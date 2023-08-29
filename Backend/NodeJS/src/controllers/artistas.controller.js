import { pool } from "../db.js";
import multer from 'multer';
import { saveImage } from '../config/imageHandler.js';

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export const createArtist = async (req, res) => {
    const { nombres, apellidos, fecha_nac } = req.body;
    const { buffer, originalname } = req.file;
    const fileExtension = originalname.split('.').pop();
    let status = false

    const { Key, Location } = await saveImage(buffer, fileExtension);
    const query = await pool.query("INSERT INTO artista (nombres, apellidos, fecha_nac, path_fotografia, id_fotografia) VALUES (?,?,?,?,?)", [nombres, apellidos, fecha_nac, Location, Key]);
    status = query[0].affectedRows > 0;

    return res.send({ "status": status });

}

export const getArtists = async (req, res) => {
    
    const query = await pool.query("SELECT * FROM artista");
    const artists = query[0];

    return res.send(artists);
}

export const getArtistById = async (req, res) => {
    
    const query = await pool.query("SELECT * FROM artista WHERE id_artista = ?", [req.params.id]);
    const artist = query[0];

    return res.send(artist);
}

export const updateArtistById = async (req, res) => {
    res.send({
        message: "updateArtistById",
        id: req.params.id
    });
}

export const deleteArtistById = async (req, res) => {
    res.send({
        message: "deleteArtistById",
        id: req.params.id
    });
}