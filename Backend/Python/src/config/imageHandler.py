import uuid
import boto3
from config.credentials import bucketConfig

def guardarImagen(imagen,extension):
    try:
        s3 = boto3.client(
            's3', 
            aws_access_key_id=bucketConfig['id'],
            aws_secret_access_key=bucketConfig['key'],
            region_name=bucketConfig['region'])
        
        key = "Imagenes/" + str(uuid.uuid4()) + "." + extension


        s3.upload_fileobj(imagen, bucketConfig['name'], key, ExtraArgs={'ACL': 'public-read'})

        #Obtener la url de la imagen
        Location = f"https://{bucketConfig['name']}.s3.{bucketConfig['region']}.amazonaws.com/{key}"

        Data = {
            "Location": Location,
            "Key": key
        }
        return Data
    except Exception as e:
        return e