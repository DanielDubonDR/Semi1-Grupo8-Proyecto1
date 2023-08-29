import { v4 as uuidv4 } from 'uuid';
import { bucketConfig } from '../config/credentials.js';
import AWS from 'aws-sdk';

export const saveImage = async (imagen, extension) => {
    const s3 = new AWS.S3({
        accessKeyId: bucketConfig.id,
        secretAccessKey: bucketConfig.key,
        region: bucketConfig.region
    });

    const params = {
        Bucket: bucketConfig.name,
        Key: "Imagenes/"+uuidv4()+"."+extension,
        Body: imagen,
        ACL: 'public-read'
    };

    const data = await s3.upload(params).promise();
    console.log(data);
    return data;
}