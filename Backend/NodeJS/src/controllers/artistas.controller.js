import { pool } from "../db.js";
import multer from 'multer';
import { saveObj, deleteObj } from '../config/objectHandler.js';
import { tipoObjeto } from '../config/constants.js';
import { comparePassword } from "../config/objectHandler.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export const createArtist = async (req, res) => {
    const { nombres, apellidos, fecha_nac } = req.body;
    const { buffer, originalname } = req.file;
    const fileExtension = originalname.split('.').pop();
    let status = false

    const { Key, Location } = await saveObj(buffer, fileExtension, tipoObjeto.IMG);
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
    const artist = query[0][0];

    return res.send(artist);
}

export const getSongsByArtistId = async (req, res) => {

    const id_artista = req.params.id;

    // SELECT cancion.nombre AS songName, cancion.path_imagen, cancion.id_cancion, album.nombre AS albumName, album.id_album FROM cancion INNER JOIN cancion_album ON cancion.id_cancion = cancion_album.id_cancion INNER JOIN album ON cancion_album.id_album = album.id_album WHERE album.id_artista = 1;

    const query = await pool.query("SELECT cancion.nombre AS songName, cancion.path_imagen, cancion.id_cancion, album.nombre AS albumName, album.id_album FROM cancion INNER JOIN cancion_album ON cancion.id_cancion = cancion_album.id_cancion INNER JOIN album ON cancion_album.id_album = album.id_album WHERE album.id_artista = ?", [id_artista]);

    res.send(query[0]);
}

export const updateInfoArtistById = async (req, res) => {
    
    const id = req.params.id;
    const { nombres, apellidos, fecha_nac } = req.body;
    let status = false;

    const query = await pool.query("UPDATE artista SET nombres = ?, apellidos = ?, fecha_nac = ? WHERE id_artista = ?", [nombres, apellidos, fecha_nac, id]);

    status = query[0].affectedRows > 0;

    return res.send({ "status": status });
}

export const updateImageArtistById = async (req, res) => {
    
    const id = req.params.id;
    const { buffer, originalname } = req.file;
    const fileExtension = originalname.split('.').pop();
    let status = false;

    const query = await pool.query("SELECT id_fotografia FROM artista WHERE id_artista = ?", [id]);

    if(query[0].length > 0){
        await deleteObj(query[0][0].id_fotografia);
        const { Key, Location } = await saveObj(buffer, fileExtension, tipoObjeto.IMG);
        const query2 = await pool.query("UPDATE artista SET path_fotografia = ?, id_fotografia = ? WHERE id_artista = ?", [Location, Key, id]);
        status = query2[0].affectedRows > 0;
    }

    return res.send({ "status": status });
}

export const deleteArtistById = async (req, res) => {
    
    const { idArtist, idUser, password } = req.body;

    const query = await pool.query("SELECT * FROM usuario WHERE id_usuario = ?", [idUser]);

    if(query[0].length > 0)
    {

        if(query[0][0].rol != 1)
        {
            console.log(query[0].rol);
            return res.status(200).json( { status: false } );
        }

        const { password: passwordCifrado } = query[0][0];
        const isPasswordCorrect = await comparePassword(password, passwordCifrado);

        if(isPasswordCorrect)
        {
            const query2 = await pool.query("SELECT * FROM artista WHERE id_artista = ?", [idArtist]);

            if(query2[0].length > 0)
            {
                try {

                    const query3 = await pool.query("SELECT * FROM album WHERE id_artista = ?", [idArtist]);
    
                    for (const album of query3[0]) {
                        const { id_imagen } = album;
                        await deleteObj(id_imagen);
                    }
    
                    const query5 = await pool.query("SELECT * FROM cancion WHERE id_artista = ?", [idArtist]);
    
                    for (const song of query5[0]) {
                        const { id_imagen, id_obj_cancion } = song;
                        await deleteObj(id_imagen);
                        await deleteObj(id_obj_cancion);
                    }

                    const { id_fotografia } = query2[0][0];
                    await deleteObj(id_fotografia);
                    const deleteArtist = await pool.query("DELETE FROM artista WHERE id_artista = ?", [idArtist]);
                    const status = deleteArtist[0].affectedRows > 0;
                    const deleteSongs = await pool.query("DELETE FROM cancion WHERE id_artista = ?", [idArtist]);

                    res.status(200).json( { status } );

                } catch (error) {
                    console.log(error);
                    res.status(500).json( { status: false } );
                }
            }
            else
            {
                res.status(200).json( { status: false } );
            }
        }
        else{
            res.status(200).json( { status: false } );
        }
    }
    else{
        res.status(200).json( { status: false } );
    }
}