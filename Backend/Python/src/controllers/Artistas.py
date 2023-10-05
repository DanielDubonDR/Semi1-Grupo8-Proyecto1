import datetime
from flask import Blueprint, request, jsonify
from config.imageHandler import guardarObjeto, eliminarObjeto, compararPassword
from db import  obtenerConexion
from io import BytesIO

BlueprintArtistas = Blueprint('artistas', __name__)

@BlueprintArtistas.route('/artista/crear', methods=['POST'])
def crearArtista():
    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        #variables que se reciben del front en un formulario
        nombres = request.form['nombres']
        apellidos = request.form['apellidos']
        fecha_nac = request.form['fecha_nac']
        imagen = request.files['imagen']

        #Extension de la imagen
        extension = imagen.filename.split('.')[-1]
        if imagen.filename != '':
            data = imagen.read()

        status = False

        #Si no se recibe fecha de nacimiento, se pone null
        if fecha_nac == '' or fecha_nac == None or fecha_nac == 'null':
            fecha_nac = None 

        #Guardar la imagen
        nombre_imagen = guardarObjeto(BytesIO(data), extension,"Fotos/")
        id_foto = nombre_imagen['Key']
        path_foto = nombre_imagen['Location']
        cursor.execute("INSERT INTO artista (nombres, apellidos, fecha_nac, path_fotografia, id_fotografia) VALUES (%s, %s, %s, %s, %s);", (nombres, apellidos, fecha_nac, path_foto, id_foto))
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


@BlueprintArtistas.route('/artista/listar', methods=['GET'])
def listarArtistas():
    #Conexion a la base de datos
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        cursor.execute("SELECT * FROM artista;") #id_artista, nombres, apellidos, fecha_nac, path_fotografia, id_fotografia
        data = cursor.fetchall()
        #Pasar a un json
        for i in range(len(data)):
            if data[i][3] != None:
                #Pasar a iso
                fecha_aux = data[i][3]
                fecha_aux = fecha_aux + datetime.timedelta(hours=6)
                fecha_aux = fecha_aux.isoformat()
            if data[i][3] == None or data[i][3] == 'null' or data[i][3] == '':
                fecha_aux = None
            data[i] = {
                'id_artista': data[i][0],
                'nombres': data[i][1],
                'apellidos': data[i][2],
                'fecha_nac': fecha_aux,
                'path_fotografia': data[i][4],
                'id_fotografia': data[i][5]
            }
        cursor.close()
        conexion.close()
        return jsonify(data)
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify([])

@BlueprintArtistas.route('/artista/ver/<id>', methods=['GET'])
def verArtista(id):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        cursor.execute("SELECT * FROM artista WHERE id_artista = %s;", (id,))
        data = cursor.fetchone()
        #Pasar a un json
        if data[3] != None:
            #Pasar a iso
            fecha_aux = data[3]
            fecha_aux = fecha_aux + datetime.timedelta(hours=6)
            fecha_aux = fecha_aux.isoformat()
        if data[3] == None or data[3] == 'null' or data[3] == '':
            fecha_aux = None
        data = {
            'id_artista': data[0],
            'nombres': data[1],
            'apellidos': data[2],
            'fecha_nac': fecha_aux,
            'path_fotografia': data[4],
            'id_fotografia': data[5]
        }
        lista = []
        lista.append(data)
        cursor.close()
        conexion.close()
        return jsonify(data)
    except Exception as e:
        print(e)
        cursor.close()
        conexion.close()
        return jsonify([])

@BlueprintArtistas.route('/artista/ver/canciones/<id>', methods=['GET'])
def verCancionesArtista(id):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        
        query='''
        SELECT
            cancion.nombre AS songName,
            cancion.path_imagen,
            cancion.id_cancion,
            album.nombre AS albumName,
            album.id_album
        FROM 
            cancion
        INNER JOIN 
            cancion_album 
        ON 
            cancion.id_cancion = cancion_album.id_cancion
        INNER JOIN
            album
        ON
            cancion_album.id_album = album.id_album
        WHERE
            album.id_artista = %s;
        '''
        cursor.execute(query, (id,))
        data = cursor.fetchall()
        #Pasar a un json
        for i in range(len(data)):
            data[i] = {
                'songName': data[i][0],
                'path_imagen': data[i][1],
                'id_cancion': data[i][2],
                'albumName': data[i][3],
                'id_album': data[i][4]
            }
        cursor.close()
        conexion.close()
        return jsonify(data)
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify([])

@BlueprintArtistas.route('/artista/modificar/info/<id>', methods=['PATCH'], strict_slashes=False)
def modificarInfoArtista(id):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        #JSON que se recibe del front
        data = request.get_json()
        nombres = data['nombres']
        apellidos = data['apellidos']
        fecha_nac = data['fecha_nac']

        #Si no se recibe fecha de nacimiento, se pone null
        if fecha_nac == '' or fecha_nac == None or fecha_nac == 'null':
            fecha_nac = None


        status = False

        
        cursor.execute("UPDATE artista SET nombres = %s, apellidos = %s, fecha_nac = %s WHERE id_artista = %s;", (nombres, apellidos, fecha_nac, id))

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

@BlueprintArtistas.route('/artista/modificar/image/<id>', methods=['PATCH'])
def modificarImagenArtista(id):
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        #variables que se reciben del front en un formulario
        imagen = request.files['imagen']

        #Extension de la imagen
        extension = imagen.filename.split('.')[-1]
        if imagen.filename != '':
            data = imagen.read()

        status = False
        
        #Eliminar la imagen anterior y guardar la nueva
        cursor.execute("SELECT id_fotografia FROM artista WHERE id_artista = %s;", (id,))

        result = cursor.fetchall()

        if len(result) > 0:
            id_foto = result[0][0]
            eliminarObjeto(id_foto)
            nombre_imagen = guardarObjeto(BytesIO(data), extension,"Fotos/")
            id_foto = nombre_imagen['Key']
            path_foto = nombre_imagen['Location']
            cursor.execute("UPDATE artista SET path_fotografia = %s, id_fotografia = %s WHERE id_artista = %s;", (path_foto, id_foto, id))
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

@BlueprintArtistas.route('/artista/eliminar/', methods=['DELETE'], strict_slashes=False)
def eliminarArtista():
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        data = request.get_json()
        id = data['idArtist']
        idUser = data['idUser']
        password = data['password']
        status = False

        cursor.execute("SELECT * FROM usuario WHERE id_usuario = %s;", (idUser,))

        result = cursor.fetchone()

        if len(result) > 0:
            if result[6] != 1:
                status = False
                cursor.close()
                conexion.close()
                return jsonify({'status': status})
            contraseniaCifrada = result[4]
            status = compararPassword(password, contraseniaCifrada)
            if status == False:
                cursor.close()
                conexion.close()
                return jsonify({'status': status})
            cursor.execute("SELECT * FROM artista WHERE id_artista = %s;", (id,))
            result = cursor.fetchone()
            if len(result) > 0:
                cursor.execute("SELECT * FROM album WHERE id_artista = %s;", (id,))
                result = cursor.fetchall()

                if len(result) > 0:
                    for i in range(len(result)):
                        id_imagen = result[i][4]
                        eliminarObjeto(id_imagen)
                
                cursor.execute("SELECT * FROM cancion WHERE id_artista = %s;", (id,))
                result = cursor.fetchall()

                if len(result) > 0:
                    for i in range(len(result)):
                        id_imagen = result[i][3]
                        eliminarObjeto(id_imagen)
                        id_obj_cancion = result[i][6]
                        eliminarObjeto(id_obj_cancion)
                
                cursor.execute("SELECT * FROM artista WHERE id_artista = %s;", (id,))
                result = cursor.fetchone()
                id_imagen = result[5]
                eliminarObjeto(id_imagen)
                cursor.execute("DELETE FROM artista WHERE id_artista = %s;", (id,))
                conexion.commit()
                status = cursor.rowcount > 0
                cursor.execute("DELETE FROM cancion WHERE id_artista = %s;", (id,))
                conexion.commit()
                status = cursor.rowcount > 0
                cursor.close()
                conexion.close() #Cerrar conexion, este faltaba
                return jsonify({'status': status})
            else:
                cursor.close()
                conexion.close()
                status = False
                return jsonify({'status': status})
        else:
            cursor.close()
            conexion.close()
            return jsonify({'status': False})
    except Exception as e:
        print(e)
        cursor.close()
        conexion.close()
        return jsonify({'status': False})