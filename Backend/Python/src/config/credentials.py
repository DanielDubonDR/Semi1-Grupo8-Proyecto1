from dotenv import load_dotenv
import os

#Carga las variables de entorno
load_dotenv()

dbConfig = {
    'pool_name': "pool_sound_stream",
    'host': os.environ.get('DB_HOST'),
    'user': os.environ.get('DB_USER'),
    'password': os.environ.get('DB_PASSWORD'),
    'database': os.environ.get('DATABASE'),
    'port': os.environ.get('DB_PORT')
}
#Configuracion del bucket
bucketConfig = {
    'name': os.environ.get('NAME_BUCKET'),
    'region': os.environ.get('REGION_BUCKET'),
    'id': os.environ.get('ID_BUCKET'),
    'key': os.environ.get('KEY_BUCKET')
}