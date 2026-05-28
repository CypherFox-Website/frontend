// BackEnd/src/modules/admin/admin.controller.js
import { handleAsync } from "../../utils/handleAsync.js";
import { supabase, supabaseFromToken } from "../../config/supabase.js";
import { buildNotasForTeacher } from "../../utils/profileGrades.js";
import { decryptPayload } from "../../utils/crypto.js";

import ExcelJS from 'exceljs'; // Importar ExcelJS

export const adminController = {
  getGradesReport: handleAsync(async (req, res) => { // Renombrado a getGradesReport
    // Para respetar las RLS, extraemos el token e inicializamos un cliente con contexto de usuario
    const token = req.headers.authorization.split(" ")[1];
    const userClient = supabaseFromToken(token);

    let body = req.body;

    // Si el payload viene encriptado (como en evaluate), lo desencriptamos
    if (body.payload && body.iv) {
        body = decryptPayload(body.payload, body.iv);
    }

    const { studentEmails, deadlines } = body;

    if (!studentEmails || !Array.isArray(studentEmails) || studentEmails.length === 0) {
      const error = new Error("Bad Request: Se requiere una lista de correos de estudiantes válida.");
      error.status = 400;
      throw error;
    }

    if (!deadlines || !Array.isArray(deadlines) || deadlines.length === 0) {
      const error = new Error("Bad Request: Se requieren fechas límite para los algoritmos.");
      error.status = 400;
      throw error;
    }

    // 1. Obtener los IDs de los estudiantes a partir de sus correos
    const { data: profiles, error: profilesError } = await userClient
      .from("profiles")
      .select("id, correo, nombre")
      .in("correo", studentEmails);

    if (profilesError) throw profilesError;

    const studentIds = profiles?.map(p => p.id) || []; 

    // 2. Obtener todas las entregas (submissions) para esos estudiantes
    let submissions = [];
    if (studentIds.length > 0) {
      const { data, error: submissionsError } = await userClient
        .from("submissions")
        .select("user_id, algoritmo, raw_score, submitted_at")
        .in("user_id", studentIds);

      if (submissionsError) {
        console.error("Error al obtener entregas de estudiantes:", submissionsError);
        const error = new Error("Error al obtener las entregas de los estudiantes.");
        error.status = 500;
        throw error;
      }
      submissions = data || [];
    }

    // 3. Procesar datos para el Excel
    const reportRows = studentEmails.map(email => {
      const student = profiles?.find(p => p.correo === email);
      // Si el estudiante no tiene cuenta, mandamos un array vacío de entregas
      const studentSubmissions = student ? submissions.filter(s => s.user_id === student.id) : [];
      const gradesMap = buildNotasForTeacher(studentSubmissions, deadlines);
      
      const gradesArray = Object.values(gradesMap);
      const sum = gradesArray.reduce((acc, curr) => acc + curr.nota, 0);
      const average = gradesArray.length > 0 ? (sum / gradesArray.length) : 0;

      const row = {
        nombre: student?.nombre || "", // Nombre vacío si no tiene cuenta
        correo: email,
        promedio: average
      };

      gradesArray.forEach(g => {
        row[g.algoritmo] = g.nota;
      });

      return row;
    });

    // 4. Crear el libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Notas Finales');

    const columns = [
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Correo', key: 'correo', width: 35 },
      { header: 'One-Time Pad', key: 'One-Time Pad', width: 15, numFmt: '0.0' },
      { header: 'Playfair', key: 'Playfair', width: 15, numFmt: '0.0' },
      { header: 'Caesar', key: 'Caesar', width: 15, numFmt: '0.0' },
      { header: 'Vigenere', key: 'Vigenere', width: 15, numFmt: '0.0' },
      { header: 'Hill', key: 'Hill', width: 15, numFmt: '0.0' },
      { header: 'Homophonic', key: 'Homophonic', width: 15, numFmt: '0.0' },
      { header: 'Turning Grille', key: 'Turning Grille', width: 15, numFmt: '0.0' },
      { header: 'DES', key: 'DES', width: 15, numFmt: '0.0' },
      { header: 'AES', key: 'AES', width: 15, numFmt: '0.0' },
      { header: 'Promedio', key: 'promedio', width: 15, numFmt: '0.0' },
    ];

    worksheet.columns = columns;
    worksheet.addRows(reportRows);
    worksheet.getRow(1).font = { bold: true };

    // 5. Enviar el archivo como stream
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Reporte_Notas_CypherFox.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  }),
};