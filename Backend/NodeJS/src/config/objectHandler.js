import { v4 as uuidv4 } from 'uuid';
import { bucketConfig } from './credentials.js';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: bucketConfig.id,
    secretAccessKey: bucketConfig.key,
    region: bucketConfig.region
});

export const saveObj = async (obj, extension, tipoObjeto) => {
    const params = {
        Bucket: bucketConfig.name,
        Key: tipoObjeto+uuidv4()+"."+extension,
        Body: obj,
        ACL: 'public-read'
    };

    const data = await s3.upload(params).promise();
    console.log(data);
    return data;
}

export const deleteObj = async (key) => {
    const params = {
        Bucket: bucketConfig.name,
        Key: key
    };

    const data = await s3.deleteObject(params).promise();
    return data;
}