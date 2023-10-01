from flask import Blueprint, request, jsonify
from config.imageHandler import guardarObjeto, compararPassword
from db import  obtenerConexion
import bcrypt
from io import BytesIO


BlueprintAcceso = Blueprint('acceso', __name__)

@BlueprintAcceso.route('/login', methods=['POST'])
def login():
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        #variables de correo y contraseña que se reciben del front en un json
        data = request.get_json()
        correo = data['correo']
        password = data['password']
        #se hace la consulta a la base de datos
        cursor.execute("SELECT * FROM usuario WHERE correo = %s;", (correo,)) # id_usuario, correo, nombres, apellidos, fecha_nac, rol, id_foto, path_foto
        query = cursor.fetchall()
        status = False
        rol = 0
        usuario = {}
        if (len(query) > 0):
            correoConsulta = query[0][1]

            if (correoConsulta == correo):
                passwordCifrado = query[0][4]
                rol = query[0][6]
                status = compararPassword(password, passwordCifrado)
            usuario = {
            'id_usuario': query[0][0],
            'correo': query[0][1],
            'nombres': query[0][2],
            'apellidos': query[0][3],
            'fecha_nac': query[0][5].strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
            'rol': query[0][6],
            'id_foto': query[0][7],
            'path_foto': query[0][8]
            }

            if status == False:
                usuario = {}

            
        cursor.close()
        conexion.close()
        return jsonify({'status': status, 'rol': rol, 'datosUusario': usuario})
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({'status': False})

@BlueprintAcceso.route('/registrar', methods=['POST'])
def registrar():
    conexion = obtenerConexion()
    cursor = conexion.cursor()
    try:
        #variables que se reciben del front en un formulario
        nombres = request.form['nombres']
        apellidos = request.form['apellidos']
        correo = request.form['correo']
        password = request.form['password']
        fecha_nac = request.form['fecha_nac']
        imagen = request.files['imagen']

        #Extension de la imagen
        extension = imagen.filename.split('.')[-1]

        if imagen.filename != '':
            data = imagen.read()


        status = False

        #Conexion a la base de datos
        cursor.execute("SELECT * FROM usuario WHERE correo = %s;", (correo,))
        query = cursor.fetchall()
        if query is None or len(query) == 0:
            passwordCifrado = cifrarPassword(password)
            #Guardar la imagen
            nombre_imagen = guardarObjeto(BytesIO(data), extension,"Fotos/")
            id_foto = nombre_imagen['Key']
            path_foto = nombre_imagen['Location']
            cursor.execute("INSERT INTO usuario (correo, nombres, apellidos, password, fecha_nac, rol, id_foto, path_foto) VALUES (%s,%s,%s,%s,%s,%s,%s,%s);", (correo, nombres, apellidos, passwordCifrado, fecha_nac, 0, id_foto, path_foto))
            conexion.commit()

            #Crer playlist de favoritos
            usuarioId = cursor.lastrowid

            cursor.execute("INSERT INTO playlist (nombre, descripcion) VALUES (%s,%s);", ("Me gusta", "La musica que te gusta en un solo lugar"))
            conexion.commit()

            playlistId = cursor.lastrowid

            cursor.execute("INSERT INTO playlist_usuario (id_playlist, id_usuario) VALUES (%s,%s);", (playlistId, usuarioId))
            conexion.commit()
            
            cursor.close()
            conexion.close()
            status = True
        return jsonify({'status': status})
    except Exception as e:
        cursor.close()
        conexion.close()
        print(e)
        return jsonify({'status': False})
 
def cifrarPassword(password):
    #saltos
    salt = bcrypt.gensalt(4)

    #se cifra la contraseña
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    #se retorna la contraseña cifrada
    return hashed_password.decode('utf-8')