import { Router } from "express";
import { 
    createArtist, 
    deleteArtistById, 
    getArtistById, 
    getArtists, 
    getSongsByArtistId, 
    updateImageArtistById, 
    updateInfoArtistById, 
    upload
} from "../controllers/artistas.controller.js";

const router = Router();

router.post("/artista/crear", upload.single('imagen'), createArtist);
router.get("/artista/listar", getArtists);
router.get("/artista/ver/:id", getArtistById);
router.get("/artista/ver/canciones/:id", getSongsByArtistId)
router.patch("/artista/modificar/info/:id", updateInfoArtistById);
router.patch("/artista/modificar/image/:id", upload.single('imagen'), updateImageArtistById);
router.delete("/artista/eliminar/:id", deleteArtistById);

export default router;