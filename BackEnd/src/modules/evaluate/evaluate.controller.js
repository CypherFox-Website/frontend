// BackEnd\src\modules\evaluate\evaluate.controller.js
import { handleAsync } from "../../utils/handleAsync.js";
import { evaluateService } from "./evaluate.service.js";
import { decryptPayload } from "../../utils/crypto.js";

export const evaluateController = {
  evaluate: handleAsync(async (req, res) => {
    const { payload, iv } = req.body;
    const method = req.query.method || "";

    if (!payload || !iv) {
      const error = new Error(
        "Los datos cifrados (payload e iv) son obligatorios.",
      );
      error.status = 400;
      error.hint =
        "Asegúrate de enviar 'payload' e 'iv' en el cuerpo de la petición.";
      throw error;
    }

    if (!method) {
      const error = new Error("El método de cifrado es obligatorio");
      error.status = 400;
      error.hint =
        "Asegúrate de enviar el parámetro 'method' en la URL (ej: ?method=caesar).";
      throw error;
    }

    // Desencriptar el código enviado desde el frontend
    const decryptedData = decryptPayload(payload, iv);
    const { code } = decryptedData;
    // console.log("=================");
    // console.log("Info desencriptada:", code);
    // console.log("=================");

    if (!code) {
      const error = new Error(
        "El código desencriptado es inválido o está vacío.",
      );
      error.status = 400;
      throw error;
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    const result = await evaluateService.evaluate_code({ code, method, userId: req.user?.id, token });
    res.status(200).json(result);
  }),
};
