import { Router } from "express";
import { 
    createPlaylist, 
    deletePlaylistById, 
    getPlaylistByIdUser, 
    getPlaylistsByIdUser, 
    updatePlaylistPortadaById, 
    updatePlaylistInfoById,
    upload
} from "../controllers/playlist.controller.js";

const router = Router();

router.post("/playlist/crear", upload.single('portada'), createPlaylist);
router.get("/playlist/listar/:id", getPlaylistsByIdUser);
router.get("/playlist/ver/:id", getPlaylistByIdUser);
router.patch("/playlist/modificar/info/:id", updatePlaylistInfoById);
router.patch("/playlist/modificar/portada/:id", upload.single('portada'), updatePlaylistPortadaById);
router.delete("/playlist/eliminar/:id", deletePlaylistById);

export default router;