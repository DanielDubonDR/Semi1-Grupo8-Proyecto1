import { Router } from "express";
import { 
    createPlaylist, 
    deletePlaylistById, 
    getPlaylistsByIdUser, 
    updatePlaylistPortadaById, 
    updatePlaylistInfoById,
    upload,
    getPlaylistSongsById,
    addSongToPlaylist
} from "../controllers/playlist.controller.js";

const router = Router();

router.post("/playlist/crear", upload.single('portada'), createPlaylist);
router.post("/playlist/agregar/cancion", addSongToPlaylist)
router.get("/playlist/listar/:id", getPlaylistsByIdUser);
router.get("/playlist/ver/:id", getPlaylistSongsById);
router.patch("/playlist/modificar/info/:id", updatePlaylistInfoById);
router.patch("/playlist/modificar/portada/:id", upload.single('portada'), updatePlaylistPortadaById);
router.delete("/playlist/eliminar/:id", deletePlaylistById);

export default router;