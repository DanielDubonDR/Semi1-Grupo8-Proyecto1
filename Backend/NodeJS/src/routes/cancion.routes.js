import { Router } from "express";
import { 
    createSong, 
    deleteSongById, 
    getSongById, 
    getSongs, 
    updateSongById, 
    updateSongImageById, 
    updateSongInfoById, 
    upload, 
    uploadImageSong, 
    uploadSong 
} from "../controllers/cancion.controller.js";

const router = Router();

router.post("/cancion/subir/imagen", upload.single('imagen'), uploadImageSong);
router.post("/cancion/subir/cancion", upload.single('cancion'), uploadSong);
router.post("/cancion/crear", createSong);
router.get("/cancion/listar", getSongs);
router.get("/cancion/ver/:id", getSongById);
router.patch("/cancion/modificar/info/:id", updateSongInfoById);
router.patch("/cancion/modificar/image/:id", updateSongImageById);
router.patch("/cancion/modificar/cancion/:id", updateSongById);
router.delete("/cancion/eliminar/:id", deleteSongById);


export default router;