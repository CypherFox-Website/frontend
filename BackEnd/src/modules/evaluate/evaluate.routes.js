// BackEnd\src\modules\evaluate\evaluate.routes.js
import { Router } from "express";
import { evaluateController } from "./evaluate.controller.js";

const evaluateRouter = Router();

evaluateRouter.post("/", evaluateController.evaluate);

export default evaluateRouter;