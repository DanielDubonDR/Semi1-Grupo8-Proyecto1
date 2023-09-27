import uuid
import boto3
from config.credentials import bucketConfig
import bcrypt

s3 = boto3.client(
    's3',
    aws_access_key_id=bucketConfig['id'],
    aws_secret_access_key=bucketConfig['key'],
    region_name=bucketConfig['region']
)

def guardarObjeto(contenido, extension, tipoObjeto):
    #Generar un nombre unico para el archivo
    key = f"{tipoObjeto}{uuid.uuid4()}.{extension}"
    print(bucketConfig['name'])
    

    #Subir el archivo
    s3.upload_fileobj(contenido, bucketConfig['name'], key, ExtraArgs={'ACL': 'public-read'})
    try:
        return {
            'Key': key,
            'Location': f"https://{bucketConfig['name']}.s3.amazonaws.com/{key}"
        }
    except Exception as e:
        print(e)
        return {
            'Key': key,
            'Location': f"https://{bucketConfig['name']}.s3.amazonaws.com/{key}"
        }
    
def eliminarObjeto(key):
    try:
        s3.delete_object(Bucket=bucketConfig['name'], Key=key)
        return True
    except Exception as e:
        print(e)
        return False
    
def compararPassword(password, passwordCifrado):
    #se compara la contraseña que se recibe del front con la que esta en la base de datos
    password = password.encode('utf-8')
    passwordCifrado = passwordCifrado.encode('utf-8')
    if bcrypt.checkpw(password, passwordCifrado):
        return True
    else:
        return False
