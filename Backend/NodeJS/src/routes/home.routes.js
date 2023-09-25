import { Router } from "express";
import { getSongByAlbum, getSongs, getSongsByArtistUser } from "../controllers/home.controller.js";

const router = Router();

router.get("/home/artista/canciones/user/:user/:artist", getSongsByArtistUser);
router.get("/home/canciones/user/:user", getSongs);
router.get("/home/album/user/:user/:album", getSongByAlbum)

export default router;