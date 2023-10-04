import mysql.connector
from config.credentials import dbConfig
from flask import Blueprint

blueprint = Blueprint('db', __name__)

# Conexion a la base de datos
pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name=dbConfig['pool_name'],
    host=dbConfig['host'],
    user=dbConfig['user'],
    password=dbConfig['password'],
    database=dbConfig['database'],
    port=dbConfig['port'],
    pool_size=1000,
)

# Funcion para conectarse a la base de datos
def obtenerConexion():
    return pool.get_connection()

# Cerrar conexion
def cerrarConexion():
    pool.close()

# Funcion para ejecutar una consulta de prueba
@blueprint.route('/prueba', methods=['GET'])
def prueba():
    #Show databases
    query = "SHOW DATABASES"
    try:
        conexion = obtenerConexion()
        cursor = conexion.cursor()
        cursor.execute(query)
        resultado = cursor.fetchall()
    finally:
        cursor.close()
        conexion.close()

    return resultado
