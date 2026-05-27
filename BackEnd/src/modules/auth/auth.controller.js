// BackEnd/src/modules/auth/auth.controller.js
import { handleAsync } from "../../utils/handleAsync.js";

export const authController = {
  // GET /api/auth/me  (requiere token en Authorization header)
  // HU-03: solo usuarios @unal.edu.co llegan aquí (validado en requireAuth)
  me: handleAsync(async (req, res) => {
    const user = req.user;
    res.status(200).json({ user });
  }),
};
