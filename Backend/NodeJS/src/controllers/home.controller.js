import { pool } from '../db.js'

export const getSongsByArtistUser = async (req, res) => {
    
    try {

        const { artist, user } = req.params;
    
        const getIDLikedPlaylist = await pool.query("SELECT pu.id_playlist FROM playlist_usuario pu INNER JOIN playlist ON playlist.id_playlist = pu.id_playlist WHERE playlist.nombre = 'Me gusta' AND pu.id_usuario=?", [user]);
        
        const id_playlist = getIDLikedPlaylist[0][0].id_playlist;
        
        const songsLikedPlaylist = await pool.query("SELECT cancion.*, canciones_playlist.id_album FROM cancion INNER JOIN canciones_playlist ON cancion.id_cancion = canciones_playlist.id_cancion WHERE canciones_playlist.id_playlist = ?", [id_playlist]);
        
        const songsArtist = await pool.query("SELECT cancion.nombre AS songName, cancion.path_imagen, cancion.id_cancion, album.nombre AS albumName, album.id_album FROM cancion INNER JOIN cancion_album ON cancion.id_cancion = cancion_album.id_cancion INNER JOIN album ON cancion_album.id_album = album.id_album WHERE album.id_artista = ?", [artist]);
    
        const songs = songsArtist[0].map(song => {
            const isLiked = songsLikedPlaylist[0].some(songLiked => songLiked.id_cancion === song.id_cancion);
            return { ...song, isLiked };
        });
    
        res.status(200).json( { songs } );
    } catch (error) {
        res.status(500).json( { message: error.message } );
    }

};

export const getSongs = async (req, res) => {

    try {
        const { user } = req.params;

        const canciones = await pool.query("SELECT cancion.*, cancion_album.id_album FROM cancion LEFT JOIN cancion_album ON cancion.id_cancion = cancion_album.id_cancion");

        const songs = canciones[0].filter(song => song.id_album !== null);

        const getIDLikedPlaylist = await pool.query("SELECT pu.id_playlist FROM playlist_usuario pu INNER JOIN playlist ON playlist.id_playlist = pu.id_playlist WHERE playlist.nombre = 'Me gusta' AND pu.id_usuario=?", [user]);
            
        const id_playlist = getIDLikedPlaylist[0][0].id_playlist;
        
        const songsLikedPlaylist = await pool.query("SELECT cancion.*, canciones_playlist.id_album FROM cancion INNER JOIN canciones_playlist ON cancion.id_cancion = canciones_playlist.id_cancion WHERE canciones_playlist.id_playlist = ?", [id_playlist]);

        const songsWithLike = songs.map(song => {
            const isLiked = songsLikedPlaylist[0].some(songLiked => songLiked.id_cancion === song.id_cancion);
            return { ...song, isLiked };
        });

        res.status(200).json( { songsWithLike } );
    } catch (error) {
        res.status(500).json( { message: error.message } );
    }

};

export const getSongByAlbum = async (req, res) => {

    try{

        const { user, album } = req.params;
    
        const songs = await pool.query("SELECT cancion.*, id_album FROM cancion INNER JOIN cancion_album ON cancion.id_cancion = cancion_album.id_cancion WHERE cancion_album.id_album = ?", [album]);
    
        const getIDLikedPlaylist = await pool.query("SELECT pu.id_playlist FROM playlist_usuario pu INNER JOIN playlist ON playlist.id_playlist = pu.id_playlist WHERE playlist.nombre = 'Me gusta' AND pu.id_usuario=?", [user]);
    
        const id_playlist = getIDLikedPlaylist[0][0].id_playlist;
    
        const songsLikedPlaylist = await pool.query("SELECT cancion.*, canciones_playlist.id_album FROM cancion INNER JOIN canciones_playlist ON cancion.id_cancion = canciones_playlist.id_cancion WHERE canciones_playlist.id_playlist = ?", [id_playlist]);
    
        const songsWithLike = songs[0].map(song => {
            const isLiked = songsLikedPlaylist[0].some(songLiked => songLiked.id_cancion === song.id_cancion);
            return { ...song, isLiked };
        });
    
        res.status(200).json( { songsWithLike } );
    } catch (error) {
        res.status(500).json( { message: error.message } );
    }
};