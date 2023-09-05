import { Router } from "express";

import { 
    deleteUserById,
    getUserById,
    updateUserImageById,
    updateUserInfoById,
    upload
} from "../controllers/user.controller.js";

const router = Router();

router.get("/usuario/ver/:id", getUserById);
router.patch("/usuario/modificar/info/:id", updateUserInfoById);
router.patch("/usuario/modificar/imagen", upload.single('file'), updateUserImageById);
router.delete("/usuario/eliminar/:id", deleteUserById);

export default router;