// BackEnd\src\modules\evaluate\evaluate.routes.js
import { Router } from "express";
import { evaluateController } from "./evaluate.controller.js";
import { tryAuth } from "../../middlewares/requireAuth.js";

const evaluateRouter = Router();

evaluateRouter.post("/", tryAuth, evaluateController.evaluate);

export default evaluateRouter;