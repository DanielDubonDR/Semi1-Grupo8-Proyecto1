from flask import Blueprint, request, jsonify
from db import  obtenerConexion

BlueprintHome = Blueprint('home', __name__)

@BlueprintHome.route('/home/artista/canciones/user/<id_user>/<id_artista>', methods=['GET'])
def getSongsByArtistUser(id_user,id_artista):
    try:
        conexion = obtenerConexion()
        cursor = conexion.cursor()
        cursor.execute("SELECT pu.id_playlist FROM playlist_usuario pu INNER JOIN playlist ON playlist.id_playlist = pu.id_playlist WHERE playlist.nombre = 'Me gusta' AND pu.id_usuario = %s", (id_user,))
        id_playlist = cursor.fetchone()
        cursor.execute("SELECT cancion.*, canciones_playlist.id_album FROM cancion INNER JOIN canciones_playlist ON cancion.id_cancion = canciones_playlist.id_cancion WHERE canciones_playlist.id_playlist = %s; ", (id_playlist[0],))
        songsLikedPlaylist = cursor.fetchall()
        cursor.execute("SELECT cancion.nombre AS songName, cancion.path_imagen, cancion.id_cancion, album.nombre AS albumName, album.id_album FROM cancion INNER JOIN cancion_album ON cancion.id_cancion = cancion_album.id_cancion INNER JOIN album ON cancion_album.id_album = album.id_album WHERE album.id_artista = %s;", (id_artista,))
        songsArtist = cursor.fetchall()

        songs = []
        for cancion in songsArtist:
            isLiked = any(songLiked[0] == cancion[2] for songLiked in songsLikedPlaylist)
            songs.append({**dict(cancion), 'isLiked': isLiked})
        
        cursor.close()
        conexion.close()

        return jsonify({'songs': songs}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@BlueprintHome.route('/home/canciones/user/<id_user>', methods=['GET'])
def getSongs(id_user):
    try:
        conexion = obtenerConexion()
        cursor = conexion.cursor()
        cursor.execute("SELECT cancion.*, cancion_album.id_album FROM cancion LEFT JOIN cancion_album ON cancion.id_cancion = cancion_album.id_cancion");
        songs = cursor.fetchall()
        #Quitar canciones que ya el id_album es null
        songs = list(filter(lambda song: song[8] != None, songs))
        cursor.execute("SELECT pu.id_playlist FROM playlist_usuario pu INNER JOIN playlist ON playlist.id_playlist = pu.id_playlist WHERE playlist.nombre = 'Me gusta' AND pu.id_usuario = %s", (id_user,))
        id_playlist = cursor.fetchone()
        cursor.execute("SELECT cancion.*, canciones_playlist.id_album FROM cancion INNER JOIN canciones_playlist ON cancion.id_cancion = canciones_playlist.id_cancion WHERE canciones_playlist.id_playlist = %s; ", (id_playlist[0],))
        songsLikedPlaylist = cursor.fetchall()

        songsWithLike = []
        for cancion in songs:
            isLiked = any(songLiked[0] == cancion[0] for songLiked in songsLikedPlaylist)
            songsWithLike.append({**dict(cancion), 'isLiked': isLiked})

        cursor.close()
        conexion.close()

        return jsonify({'songsWithLike': songsWithLike}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@BlueprintHome.route('/home/album/user/<id_user>/<id_album>', methods=['GET'])
def getSongByAlbum(id_user,id_album):
    try:
        conexion = obtenerConexion()
        cursor = conexion.cursor()
        cursor.execute("SELECT cancion.*, id_album FROM cancion INNER JOIN cancion_album ON cancion.id_cancion = cancion_album.id_cancion WHERE cancion_album.id_album = %s;", (id_album,))
        songs = cursor.fetchall()
        cursor.execute("SELECT pu.id_playlist FROM playlist_usuario pu INNER JOIN playlist ON playlist.id_playlist = pu.id_playlist WHERE playlist.nombre = 'Me gusta' AND pu.id_usuario = %s", (id_user,))
        id_playlist = cursor.fetchone()
        cursor.execute("SELECT cancion.*, canciones_playlist.id_album FROM cancion INNER JOIN canciones_playlist ON cancion.id_cancion = canciones_playlist.id_cancion WHERE canciones_playlist.id_playlist = %s; ", (id_playlist[0],))
        songsLikedPlaylist = cursor.fetchall()

        songsWithLike = []
        for cancion in songs:
            isLiked = any(songLiked[0] == cancion[0] for songLiked in songsLikedPlaylist)
            songsWithLike.append({**dict(cancion), 'isLiked': isLiked})

        cursor.close()
        conexion.close()

        return jsonify({'songsWithLike': songsWithLike}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

        