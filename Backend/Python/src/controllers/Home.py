from flask import Blueprint, request, jsonify
from db import  obtenerConexion

BlueprintHome = Blueprint('home', __name__)

@BlueprintHome.route('/home/artista/canciones/user/<id_user>/<id_artista>', methods=['GET'])
def getSongsByArtistUser(id_user,id_artista):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        cursor.execute("SELECT pu.id_playlist FROM playlist_usuario pu INNER JOIN playlist ON playlist.id_playlist = pu.id_playlist WHERE playlist.nombre = 'Me gusta' AND pu.id_usuario= %s", (id_user,))
        id_playlist = cursor.fetchone()
        cursor.execute("SELECT cancion.*, canciones_playlist.id_album FROM cancion INNER JOIN canciones_playlist ON cancion.id_cancion = canciones_playlist.id_cancion WHERE canciones_playlist.id_playlist = %s; ", (id_playlist[0],))
        songsLikedPlaylist = cursor.fetchall()
        cursor.execute("SELECT cancion.nombre AS songName, cancion.path_imagen, cancion.id_cancion, album.nombre AS albumName, album.id_album, CONCAT(artista.nombres, ' ', COALESCE(artista.apellidos, '')) AS nombre_artista FROM cancion INNER JOIN cancion_album ON cancion.id_cancion = cancion_album.id_cancion INNER JOIN album ON cancion_album.id_album = album.id_album INNER JOIN artista ON cancion.id_artista = artista.id_artista WHERE album.id_artista =  %s", (id_artista,))
        songsArtist = cursor.fetchall()

        songs = []
        for cancion in songsArtist:
            isLiked = any(songLiked[0] == cancion[2] for songLiked in songsLikedPlaylist)
            songs.append((cancion, isLiked))

        formato_con_likes = []
        for song, isLiked in songs:
            formatted_song = {
                "songName": song[0],
                "path_imagen": song[1],
                "id_cancion": song[2],
                "albumName": song[3],
                "id_album": song[4],
                "nombre_artista": song[5],
                "isLiked": isLiked
            }
            formato_con_likes.append(formatted_song)
        
        cursor.close()
        conexion.close()

        return jsonify({'songs': formato_con_likes}), 200
    except Exception as e:
        cursor.close()
        conexion.close()
        return jsonify({'error': str(e)}), 500
    
@BlueprintHome.route('/home/canciones/user/<id_user>', methods=['GET'])
def getSongs(id_user):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        cursor.execute("SELECT cancion.*, cancion_album.id_album, CONCAT(a.nombres, ' ', COALESCE(a.apellidos, '')) AS nombre_artista FROM artista a, cancion LEFT JOIN cancion_album ON cancion.id_cancion = cancion_album.id_cancion WHERE cancion.id_artista =  a.id_artista")
        songs = cursor.fetchall()
        #Quitar canciones que ya el id_album es null
        songs = [song for song in songs if song[8] is not None]
        cursor.execute("""
            SELECT pu.id_playlist
            FROM playlist_usuario pu
            INNER JOIN playlist ON playlist.id_playlist = pu.id_playlist
            WHERE playlist.nombre = 'Me gusta' AND pu.id_usuario = %s
        """, (id_user,))
        id_playlist = cursor.fetchone()
        cursor.execute("""
            SELECT cancion.*, canciones_playlist.id_album
            FROM cancion
            INNER JOIN canciones_playlist ON cancion.id_cancion = canciones_playlist.id_cancion
            WHERE canciones_playlist.id_playlist = %s
        """, (id_playlist[0],))
        songsLikedPlaylist = cursor.fetchall()

        songsWithLike = []
        for song in songs:
            isLiked = any(songLiked[0] == song[0] for songLiked in songsLikedPlaylist)
            songsWithLike.append((song, isLiked))

        cursor.close()
        conexion.close()

        formato_con_likes = []
        for song, isLiked in songsWithLike:
            formatted_song = {
                "id_cancion": song[0],
                "nombre": song[1],
                "duracion": song[2],
                "id_imagen": song[3],
                "path_imagen": song[4],
                "path_cancion": song[5],
                "id_obj_cancion": song[6],
                "id_artista": song[7],
                "id_album": song[8],
                "nombre_artista": song[9],
                "isLiked": isLiked
            }
            formato_con_likes.append(formatted_song)

        return jsonify({'songsWithLike': formato_con_likes}), 200
    except Exception as e:
        cursor.close()
        conexion.close()
        return jsonify({'error': str(e)}), 500
    
@BlueprintHome.route('/home/album/user/<id_user>/<id_album>', methods=['GET'])
def getSongByAlbum(id_user,id_album):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        cursor.execute("SELECT cancion.*, id_album, CONCAT(a.nombres, ' ', COALESCE(a.apellidos, '')) AS nombre_artista FROM artista a, cancion INNER JOIN cancion_album ON cancion.id_cancion = cancion_album.id_cancion WHERE cancion.id_artista = a.id_artista AND cancion_album.id_album = %s", (id_album,))
        songs = cursor.fetchall()
        cursor.execute("SELECT pu.id_playlist FROM playlist_usuario pu INNER JOIN playlist ON playlist.id_playlist = pu.id_playlist WHERE playlist.nombre = 'Me gusta' AND pu.id_usuario= %s", (id_user,))
        id_playlist = cursor.fetchone()
        cursor.execute("SELECT cancion.*, canciones_playlist.id_album FROM cancion INNER JOIN canciones_playlist ON cancion.id_cancion = canciones_playlist.id_cancion WHERE canciones_playlist.id_playlist = %s; ", (id_playlist[0],))
        songsLikedPlaylist = cursor.fetchall()

        songsWithLike = []
        for cancion in songs:
            isLiked = any(songLiked[0] == cancion[0] for songLiked in songsLikedPlaylist)
            songsWithLike.append((cancion, isLiked))

        formato_con_likes = []
        for song, isLiked in songsWithLike:
            formatted_song = {
                "id_cancion": song[0],
                "nombre": song[1],
                "duracion": song[2],
                "id_imagen": song[3],
                "path_imagen": song[4],
                "path_cancion": song[5],
                "id_obj_cancion": song[6],
                "id_artista": song[7],
                "id_album": song[8],
                "nombre_artista": song[9],
                "isLiked": isLiked
            }
            formato_con_likes.append(formatted_song)

        cursor.close()
        conexion.close()

        return jsonify({'songsWithLike': formato_con_likes}), 200
    except Exception as e:
        cursor.close()
        conexion.close()
        return jsonify({'error': str(e)}), 500
    
@BlueprintHome.route('/home/playlist/user/<id_user>/<id_playlist>', methods=['GET'], strict_slashes=False)
def getSongsByPlaylist(id_user,id_playlist):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        cursor.execute("SELECT cancion.*, id_album, CONCAT(a.nombres, ' ', COALESCE(a.apellidos, '')) AS nombre_artista FROM artista a, cancion INNER JOIN canciones_playlist ON cancion.id_cancion = canciones_playlist.id_cancion WHERE cancion.id_artista = a.id_artista AND canciones_playlist.id_playlist = %s", (id_playlist,))
        songs = cursor.fetchall()
        cursor.execute("SELECT pu.id_playlist FROM playlist_usuario pu INNER JOIN playlist ON playlist.id_playlist = pu.id_playlist WHERE playlist.nombre = 'Me gusta' AND pu.id_usuario= %s", (id_user,))
        id_playlist = cursor.fetchone()
        print(id_playlist)
        cursor.execute("SELECT cancion.*, canciones_playlist.id_album FROM cancion INNER JOIN canciones_playlist ON cancion.id_cancion = canciones_playlist.id_cancion WHERE canciones_playlist.id_playlist = %s; ", (id_playlist[0],))
        songsLikedPlaylist = cursor.fetchall()

        songsWithLike = []
        for cancion in songs:
            isLiked = any(songLiked[0] == cancion[0] for songLiked in songsLikedPlaylist)
            songsWithLike.append((cancion, isLiked))

        formato_con_likes = []
        for song, isLiked in songsWithLike:
            formatted_song = {
                "id_cancion": song[0],
                "nombre": song[1],
                "duracion": song[2],
                "id_imagen": song[3],
                "path_imagen": song[4],
                "path_cancion": song[5],
                "id_obj_cancion": song[6],
                "id_artista": song[7],
                "id_album": song[8],
                "nombre_artista": song[9],
                "isLiked": isLiked
            }
            formato_con_likes.append(formatted_song)

        cursor.close()
        conexion.close()

        return jsonify({'songsWithLike': formato_con_likes}), 200
    except Exception as e:
        cursor.close()
        conexion.close()
        return jsonify({'error': str(e)}), 500

        