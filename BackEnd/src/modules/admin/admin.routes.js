// BackEnd/src/modules/admin/admin.routes.js
import { Router } from "express";
import { adminController } from "./admin.controller.js";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { checkRole } from "../../middlewares/checkRole.js"; // Asumiendo que checkRole existe

const adminRouter = Router();

// POST /api/admin/grades-report - Genera y descarga el Excel de notas finales
adminRouter.post("/grades-report", requireAuth, checkRole('teacher'), adminController.getGradesReport);

export default adminRouter;