from flask import Blueprint, request, jsonify
from config.imageHandler import guardarObjeto, eliminarObjeto
from db import  obtenerConexion
import bcrypt
from datetime import datetime


BlueprintUser = Blueprint('usuario', __name__)

@BlueprintUser.route('/usuario/ver/<id_usuario>', methods=['GET'])
def verUsuario(id_usuario):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT correo, nombres, apellidos, fecha_nac, path_foto FROM usuario WHERE id_usuario = %s;", (id_usuario,))
    usuario = cursor.fetchone()
    cursor.close()
    conexion.close()
    return jsonify(usuario)

@BlueprintUser.route('/usuario/modificar/info/<id_usuario>', methods=['PATCH'])
def modificarInfoUsuario(id_usuario):
    data = request.get_json()
    nombres = data['nombres']
    apellidos = data['apellidos']
    fecha_nac = data['fecha_nac']
    password = data['password']

    status = False

    conexion = obtenerConexion()
    cursor = conexion.cursor()

    cursor.execute("SELECT password FROM usuario WHERE id_usuario = %s;", (id_usuario,))
    query = cursor.fetchone()
    passwordCifrado = query[0]
    status = compararPassword(password, passwordCifrado)
    if status:
        cursor.execute("UPDATE usuario SET nombres = %s, apellidos = %s, fecha_nac = %s WHERE id_usuario = %s;", (nombres, apellidos, fecha_nac, id_usuario))
        status = cursor.rowcount > 0
        conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({'status': status})

@BlueprintUser.route('/usuario/modificar/imageN/<id_usuario>', methods=['PATCH'])
def modificarImagenUsuario(id_usuario):
    data = request.get_json()
    imagen = data['imagen']
    #Extension de la imagen
    extension = imagen.filename.split('.')[-1]
    contenido = imagen.read()

    status = False

    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()

    cursor.execute("SELECT id_foto FROM usuario WHERE id_usuario = %s;", (id_usuario,))
    result = cursor.fetchall()

    if len(result) > 0:
        id_foto = result[0][0]
        eliminarObjeto(id_foto)
    nombre_imagen = guardarObjeto(contenido, extension,"Imagenes/")
    id_foto = nombre_imagen['Key']
    path_foto = nombre_imagen['Location']
    cursor.execute("UPDATE usuario SET path_foto = %s, id_foto = %s WHERE id_usuario = %s;", (path_foto, id_foto, id_usuario))
    status = cursor.rowcount > 0
    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({'status': status})

@BlueprintUser.route('/usuario/eliminar/<id_usuario>', methods=['DELETE'])
def eliminarUsuario(id_usuario):
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

@BlueprintUser.route('/usuario/add/history', methods=['POST'])
def addHistory():
    data = request.get_json()
    id_cancion = data['id_cancion']
    id_usuario = data['id_usuario']
    id_album = data['id_album']

    current_date = datetime.now()
    fecha = current_date.strftime("%Y-%m-%d %H:%M:%S")

    conexion = obtenerConexion()
    cursor = conexion.cursor()

    cursor.execute("INSERT INTO historico (id_cancion, id_usuario, id_album, fecha) VALUES (%s, %s, %s, %s);", (id_cancion, id_usuario, id_album, fecha))

    status = cursor.rowcount > 0
    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({'status': status})

@BlueprintUser.route('/usuario/ver/top5/songs/<id_usuario>', methods=['GET'])
def verTop5Songs(id_usuario):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT id_cancion, COUNT(id_cancion) AS reproducciones FROM historico WHERE id_usuario = %s GROUP BY id_cancion ORDER BY reproducciones DESC LIMIT 5;", (id_usuario,))
    query1_result = cursor.fetchall()

    cancion_ids = [row[0] for row in query1_result]

    cursor.execute("SELECT id_cancion, nombre, duracion, path_cancion, path_imagen FROM cancion WHERE id_cancion IN ({})".format(','.join(map(str, cancion_ids))))
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

@BlueprintUser.route('/usuario/ver/top3/artistas/<id_usuario>', methods=['GET'])
def verTop3Artistas(id_usuario):

    conexion = obtenerConexion()
    cursor = conexion.cursor()

    cursor.execute("SELECT a.id_artista, CONCAT(a.nombres, ' ', a.apellidos) AS nombre_artista, a.path_fotografia , COUNT(*) AS reproducciones FROM historico h JOIN cancion_album ca ON h.id_album = ca.id_album AND h.id_cancion = ca.id_cancion JOIN album al ON ca.id_album = al.id_album JOIN cancion c ON ca.id_cancion = c.id_cancion JOIN artista a ON al.id_artista = a.id_artista JOIN usuario u ON h.id_usuario = u.id_usuario WHERE u.id_usuario = %s GROUP BY a.id_artista, nombre_artista ORDER BY reproducciones DESC LIMIT 3;", (id_usuario,))

    query_result = cursor.fetchall()

    cursor.close()
    conexion.close()

    return jsonify(query_result)

@BlueprintUser.route('/usuario/ver/top3/albumes/<id_usuario>', methods=['GET'])
def verTop3Albumes(id_usuario):

    conexion = obtenerConexion()
    cursor = conexion.cursor()

    cursor.execute("SELECT id_album, COUNT(id_album) AS 'reproducciones' FROM historico GROUP BY id_album ORDER BY reproducciones DESC LIMIT 3;")
    query1_result = cursor.fetchall()

    album_ids = [row[0] for row in query1_result]

    cursor.execute("SELECT id_album, nombre, path_imagen FROM album WHERE id_album IN ({})".format(','.join(map(str, album_ids))))
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

@BlueprintUser.route('/usuario/ver/historico/<id_usuario>', methods=['GET'])
def verHistorico(id_usuario):

    conexion = obtenerConexion()
    cursor = conexion.cursor()

    cursor.execute("SELECT h.fecha, c.nombre AS nombre_cancion, c.duracion AS duracion_cancion, a.nombres AS nombre_artista, al.nombre AS nombre_album FROM historico h JOIN cancion_album ca ON h.id_album = ca.id_album AND h.id_cancion = ca.id_cancion JOIN cancion c ON ca.id_cancion = c.id_cancion JOIN album al ON ca.id_album = al.id_album JOIN artista a ON al.id_artista = a.id_artista WHERE h.id_usuario = %s ORDER BY h.fecha DESC;", (id_usuario,))
    query_result = cursor.fetchall()

    cursor.close()
    conexion.close()

    return jsonify(query_result)

def compararPassword(password, passwordCifrado):
    #se compara la contraseña que se recibe del front con la que esta en la base de datos
    password = password.encode('utf-8')
    passwordCifrado = passwordCifrado.encode('utf-8')
    if bcrypt.checkpw(password, passwordCifrado):
        return True
    else:
        return False