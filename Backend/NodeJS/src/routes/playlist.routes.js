import { Router } from "express";
import { 
    createPlaylist, 
    deletePlaylistById, 
    getPlaylistsByIdUser, 
    updatePlaylistPortadaById, 
    updatePlaylistInfoById,
    upload,
    getPlaylistSongsById,
    addSongToPlaylist,
    deleteSongFromPlaylist,
    setLikedPlaylist,
    deleteLikedPlaylist
} from "../controllers/playlist.controller.js";

const router = Router();

router.post("/playlist/crear", upload.single('portada'), createPlaylist);
router.post("/playlist/agregar/cancion", addSongToPlaylist)
router.get("/playlist/listar/:id", getPlaylistsByIdUser);
router.get("/playlist/ver/:id", getPlaylistSongsById);
router.patch("/playlist/modificar/info/:id", updatePlaylistInfoById);
router.patch("/playlist/modificar/portada/:id", upload.single('portada'), updatePlaylistPortadaById);
router.delete("/playlist/eliminar/:id", deletePlaylistById);
router.delete("/playlist/eliminar/cancion/:idp/:idc", deleteSongFromPlaylist);
router.post("/playlist/agregar/cancion/liked", setLikedPlaylist);
router.delete("/playlist/eliminar/cancion/liked", deleteLikedPlaylist);

export default router;