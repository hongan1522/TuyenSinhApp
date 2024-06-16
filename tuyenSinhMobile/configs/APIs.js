import axios from "axios";

//const BASE_URL = 'https://feline-helped-safely.ngrok-free.app/'; 

const BASE_URL = 'https://neutral-blatantly-ghost.ngrok-free.app/'; 

export const endpoints = {
    khoa: '/khoa/',
    diem: '/diem/',
    diemkhoa: '/diemkhoa/',
    thisinh: '/thisinh/',
    tuvanvien: '/tuvanvien/',
    tuyensinh: '/tuyensinh/',
    tintuc: '/tintuc/',
    banner: '/banner/',
    register: '/user/',
    binhluan: '/binhluan/',
    admin: '/Admin/',
    login: '/o/token/',
    currentUser: '/user/current_user/'
};

export const authApi = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        }
    });
}

export const registerApi = () => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}

export default axios.create({ 
    baseURL: BASE_URL
});
