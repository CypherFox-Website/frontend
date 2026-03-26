// BackEnd\src\modules\evaluate\evaluate.controller.js
import { handleAsync } from "../../utils/handleAsync.js";
import { evaluateService } from "./evaluate.service.js";

export const evaluateController = {
    evaluate: handleAsync(async (req, res) => {
        const { code } = req.body;
        const method = req.query.method || '';

        if (!code) {
            const error = new Error("El código es obligatorio");
            error.status = 400;
            error.hint = "Asegúrate de enviar la propiedad 'code' en el cuerpo de la petición.";
            throw error;
        }

        if (!method) {
            const error = new Error("El método de cifrado es obligatorio");
            error.status = 400;
            error.hint = "Asegúrate de enviar el parámetro 'method' en la URL (ej: ?method=caesar).";
            throw error;
        }

        const result = await evaluateService.evaluate_code({ code, method });
        res.status(200).json(result);
    })
}