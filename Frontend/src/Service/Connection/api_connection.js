import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:puerto/',
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const registro = async (register) => {
    console.log(register);
    const response = await instance.post('/registro', register);
    return response;
}