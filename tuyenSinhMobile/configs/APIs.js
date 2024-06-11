import axios from "axios";

<<<<<<< HEAD
const BASE_URL = 'https://feline-helped-safely.ngrok-free.app/'; 

export const endpoints = {
    'khoa': '/khoa/',
    'diemkhoa': '/diemkhoa/',
=======
const BASE_URL = 'https://neutral-blatantly-ghost.ngrok-free.app'; 

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
    admin: '/Admin/' 
>>>>>>> 8c75fb0e5d115187f519d4ddc145ba8852c245d2
};

export const authApi = () => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ...`
        }
    });
}

export default axios.create({ 
    baseURL: BASE_URL
});