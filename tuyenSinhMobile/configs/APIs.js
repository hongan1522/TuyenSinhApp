import axios from "axios";

const BASE_URL = 'https://feline-helped-safely.ngrok-free.app/'; 

export const endpoints = {
    'khoa': '/khoa/',
    'diemkhoa': '/diemkhoa/',
};

export default axios.create({ 
    baseURL: BASE_URL
});