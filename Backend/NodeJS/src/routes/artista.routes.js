import { Router } from "express";
import { 
    createArtist, 
    deleteArtistById, 
    getArtistById, 
    getArtists, 
    updateArtistById, 
    upload
} from "../controllers/artistas.controller.js";

const router = Router();

router.post("/artista/crear", upload.single('imagen'), createArtist);
router.get("/artista/listar", getArtists);
router.get("/artista/ver/:id", getArtistById);
router.put("/artista/modificar/:id", updateArtistById);
router.delete("/artista/eliminar/:id", deleteArtistById);


export default router;