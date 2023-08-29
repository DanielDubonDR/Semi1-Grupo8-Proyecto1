import { Router } from "express";

import { 
    login,
    registrar,
    upload
} from "../controllers/acceso.controller.js";

const router = Router();

router.post("/registrar", upload.single('imagen'), registrar);
router.post("/login", login);

export default router;