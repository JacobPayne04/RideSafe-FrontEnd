import axios from "axios";

const axiosSecure = axios.create({ baseURL: 'http://localhost:8080' });

axiosSecure.interceptors.request.use(config => {
    const token = localStorage.getItem('token');

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

axiosSecure.interceptors.response.use(
    res => res,
    err => {
        if(err.response?.status === 401){
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(err);
    }
);

export default axiosSecure;