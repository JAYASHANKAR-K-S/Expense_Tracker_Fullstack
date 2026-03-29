import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import dayjs from 'dayjs';

const baseURL = 'http://127.0.0.1:8000';

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(async req => {
    let access_token = localStorage.getItem('access_token');

    if (!access_token) return req;

    const user = jwtDecode(access_token);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) {
        req.headers.Authorization = `Bearer ${access_token}`;
        return req;
    }

    // Token is expired, try to refresh
    const refresh_token = localStorage.getItem('refresh_token');
    try {
        const response = await axios.post(`${baseURL}/auth/token/refresh/`, {
            refresh: refresh_token
        });

        localStorage.setItem('access_token', response.data.access);
        req.headers.Authorization = `Bearer ${response.data.access}`;
    } catch (error) {
        // Refresh failed (expired or invalid), logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    }

    return req;
});

export default axiosInstance;
