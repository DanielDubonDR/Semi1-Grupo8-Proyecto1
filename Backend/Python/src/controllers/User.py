from datetime import datetime
from io import BytesIO

from config.imageHandler import compararPassword, eliminarObjeto, guardarObjeto
from db import obtenerConexion
from flask import Blueprint, jsonify, request

BlueprintUser = Blueprint('usuario', __name__)

@BlueprintUser.route('/usuario/ver/<id_usuario>', methods=['GET'])
def verUsuario(id_usuario):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        cursor.execute("SELECT correo, nombres, apellidos, fecha_nac, path_foto FROM usuario WHERE id_usuario = %s;", (id_usuario,))
        usuario = cursor.fetchone()
        #Pasar la lista a un diccionario
        usuario = {
            'correo': usuario[0],
            'nombres': usuario[1],
            'apellidos': usuario[2],
            'fecha_nac': usuario[3].strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
            'path_foto': usuario[4]
        }
        cursor.close()
        conexion.close()
        return jsonify(usuario)
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({})

@BlueprintUser.route('/usuario/modificar/info/<id_usuario>', methods=['PATCH'])
def modificarInfoUsuario(id_usuario):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        data = request.get_json()
        nombres = data['nombres']
        apellidos = data['apellidos']
        correo = data['correo']
        password = data['password']

        status = False

        conexion = obtenerConexion()
        cursor = conexion.cursor()


        cursor.execute("SELECT password, correo FROM usuario WHERE id_usuario = %s;", (id_usuario,))
        query = cursor.fetchone()

        cursor.execute("SELECT * FROM usuario WHERE correo = %s;", (correo,))
        query2 = cursor.fetchone()

        if (query2 is None or len(query) == 0) or query[1] == correo:
            passwordCifrado = query[0]
            status = compararPassword(password, passwordCifrado)
            if status:
                cursor.execute("UPDATE usuario SET nombres = %s, apellidos = %s, correo = %s WHERE id_usuario = %s;", (nombres, apellidos, correo, id_usuario))
                status = cursor.rowcount > 0
                conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({'status': status})
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({'status': False})

@BlueprintUser.route('/usuario/modificar/imagen/', methods=['PATCH'])
def modificarImagenUsuario():
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        imagen = request.files['imagen']
        idUser = request.form['idUser']
        password = request.form['password']
        #Extension de la imagen
        extension = imagen.filename.split('.')[-1]
        if imagen.filename != '':
            data = imagen.read()

        status = False

        #Conexion a la base de datos
        conexion = obtenerConexion()
        cursor = conexion.cursor()

        cursor.execute("SELECT password FROM usuario WHERE id_usuario = %s;", (idUser,))
        query = cursor.fetchone()

        status = compararPassword(password, query[0])

        if status:
            cursor.execute("SELECT id_foto FROM usuario WHERE id_usuario = %s;", (idUser,))
            result = cursor.fetchall()

            if len(result) > 0:
                id_foto = result[0][0]
                eliminarObjeto(id_foto)
            newObject = guardarObjeto(BytesIO(data), extension,"Fotos/")
            id_foto = newObject['Key']
            path_foto = newObject['Location']
            cursor.execute("UPDATE usuario SET id_foto = %s, path_foto = %s WHERE id_usuario = %s;", (id_foto, path_foto, idUser))
            status = cursor.rowcount > 0
            conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({'status': status})
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({'status': False})

@BlueprintUser.route('/usuario/eliminar/<id_usuario>', methods=['DELETE'])
def eliminarUsuario(id_usuario):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        status = False

        conexion = obtenerConexion()
        cursor = conexion.cursor()

        cursor.execute("SELECT id_foto FROM usuario WHERE id_usuario = %s;", (id_usuario,))
        result = cursor.fetchall()

        if len(result) > 0:
            id_foto = result[0][0]
            eliminarObjeto(id_foto)
        cursor.execute("DELETE FROM usuario WHERE id_usuario = %s;", (id_usuario,))
        status = cursor.rowcount > 0
        conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({'status': status})
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({'status': False})

@BlueprintUser.route('/usuario/add/history', methods=['POST'])
def addHistory():
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        data = request.get_json()
        id_cancion = data['id_cancion']
        id_usuario = data['id_usuario']
        id_album = data['id_album']
        fecha = data['fecha']


        conexion = obtenerConexion()
        cursor = conexion.cursor()

        cursor.execute("INSERT INTO historico (id_cancion, id_usuario, id_album, fecha) VALUES (%s, %s, %s, %s);", (id_cancion, id_usuario, id_album, fecha))

        status = cursor.rowcount > 0
        conexion.commit()

        cursor.close()
        conexion.close()

        return jsonify({'status': status}), 200
    except Exception as e:
        print(e)
        cursor.close()
        conexion.close()
        return jsonify({'status': False}), 500

@BlueprintUser.route('/usuario/ver/top5/songs/<id_usuario>', methods=['GET'])
def verTop5Songs(id_usuario):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        cursor.execute("SELECT id_cancion, COUNT(id_cancion) AS reproducciones FROM historico WHERE id_usuario = %s GROUP BY id_cancion ORDER BY reproducciones DESC LIMIT 5;", (id_usuario,))
        query1_result = cursor.fetchall()

        if len(query1_result) == 0:
            return jsonify([])

        cancion_ids = [row[0] for row in query1_result]
        cursor.execute("SELECT id_cancion, nombre, duracion, path_cancion, path_imagen FROM cancion WHERE id_cancion IN ({});".format(','.join(map(str, cancion_ids))))
        query2_result = cursor.fetchall()

        combined_results = []
        for i in range(len(query1_result)):
            combined_data = {
                'id_cancion': query1_result[i][0],
                'reproducciones': query1_result[i][1],
                'nombre': query2_result[i][1],
                'duracion': query2_result[i][2],
                'path_cancion': query2_result[i][3],
                'path_imagen': query2_result[i][4]
            }
            combined_results.append(combined_data)
        cursor.close()
        conexion.close()
        return jsonify(combined_results)
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify([]), 500

@BlueprintUser.route('/usuario/ver/top3/artistas/<id_usuario>', methods=['GET'])
def verTop3Artistas(id_usuario):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:

        cursor.execute("SELECT a.id_artista, CONCAT(a.nombres, ' ', a.apellidos) AS nombre_artista, a.path_fotografia , COUNT(*) AS reproducciones FROM historico h JOIN cancion_album ca ON h.id_album = ca.id_album AND h.id_cancion = ca.id_cancion JOIN album al ON ca.id_album = al.id_album JOIN cancion c ON ca.id_cancion = c.id_cancion JOIN artista a ON al.id_artista = a.id_artista JOIN usuario u ON h.id_usuario = u.id_usuario WHERE u.id_usuario = %s GROUP BY a.id_artista, nombre_artista ORDER BY reproducciones DESC LIMIT 3;", (id_usuario,))

        query_result = cursor.fetchall()

        cursor.close()
        conexion.close()
        #Pasar a un json
        for i in range(len(query_result)):
            query_result[i] = {
                'id_artista': query_result[i][0],
                'nombre_artista': query_result[i][1],
                'path_fotografia': query_result[i][2],
                'reproducciones': query_result[i][3]
            }


        return jsonify(query_result)
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify([]), 500

@BlueprintUser.route('/usuario/ver/top5/albumes/<id_usuario>', methods=['GET'])
def verTop5Albumes(id_usuario):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        
        cursor.execute("SELECT id_album, COUNT(id_album) AS reproducciones FROM historico WHERE id_usuario = %s GROUP BY id_album ORDER BY reproducciones DESC LIMIT 5;", (id_usuario,))
        query1_result = cursor.fetchall()

        if len(query1_result) == 0:
            return jsonify([])
        album_ids = [row[0] for row in query1_result]
        
        cursor.execute("SELECT id_album, nombre, path_imagen FROM album WHERE id_album IN ({});".format(','.join(map(str, album_ids))))

        query2_result = cursor.fetchall()

        combined_results = []
        for i in range(len(query1_result)):
            combined_data = {
                'id_album': query1_result[i][0],
                'reproducciones': query1_result[i][1],
                'nombre': query2_result[i][1],
                'path_imagen': query2_result[i][2]
            }
            combined_results.append(combined_data)

        
        cursor.close()
        conexion.close()

        return jsonify(combined_results)
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify([]), 500

@BlueprintUser.route('/usuario/ver/historico/<id_usuario>', methods=['GET'])
def verHistorico(id_usuario):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:

        cursor.execute("SELECT h.fecha, c.nombre AS nombre_cancion, c.duracion AS duracion_cancion, a.nombres AS nombre_artista, al.nombre AS nombre_album,c.path_imagen AS path_imagen FROM historico h JOIN cancion_album ca ON h.id_album = ca.id_album AND h.id_cancion = ca.id_cancion JOIN cancion c ON ca.id_cancion = c.id_cancion JOIN album al ON ca.id_album = al.id_album JOIN artista a ON al.id_artista = a.id_artista WHERE h.id_usuario = %s ORDER BY h.fecha DESC;", (id_usuario,))
        query_result = cursor.fetchall()
        
        #Pasar a un json

        for i in range(len(query_result)):
            fecha_iso = query_result[i][0].isoformat()
            query_result[i] = {
                'fecha': fecha_iso,
                'nombre_cancion': query_result[i][1],
                'duracion_cancion': query_result[i][2],
                'nombre_artista': query_result[i][3],
                'nombre_album': query_result[i][4],
                'path_imagen': query_result[i][5]
            }

        cursor.close()
        conexion.close()

        return jsonify(query_result)
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify([]), 500