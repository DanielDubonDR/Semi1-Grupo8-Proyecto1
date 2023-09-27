import { Router } from "express";
import { getSongByAlbum, getSongs, getSongsByArtistUser, getSongsByPlaylist } from "../controllers/home.controller.js";

const router = Router();

router.get("/home/artista/canciones/user/:user/:artist", getSongsByArtistUser);
router.get("/home/canciones/user/:user", getSongs);
router.get("/home/album/user/:user/:album", getSongByAlbum);
router.get("/home/playlist/user/:user/:playlist", getSongsByPlaylist);

export default router;