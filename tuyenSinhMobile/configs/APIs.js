import axios from "axios";

const BASE_URL = 'https://feline-helped-safely.ngrok-free.app/'; 

//const BASE_URL = 'https://neutral-blatantly-ghost.ngrok-free.app'; 

export const endpoints = {
    khoa: '/khoa/',
    diem: '/diem/',
    diemkhoa: '/diemkhoa/',
    thisinh: '/thisinh/',
    tuvanvien: '/tuvanvien/',
    tuyensinh: '/tuyensinh/',
    tintuc: '/tintuc/',
    banner: '/banner/',
    user: '/user/',
    binhluan: '/binhluan/',
    admin: '/Admin/',
    login: '/o/token/'
};

export const authApi = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export default axios.create({ 
    baseURL: BASE_URL
});