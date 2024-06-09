import axios from "axios";

const BASE_URL = 'http://192.168.1.15:8000/'; 

export const endpoints = {
    'khoa': '/khoa/'
};

export default axios.create({ 
    baseURL: BASE_URL
});