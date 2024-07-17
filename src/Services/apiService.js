import axios from 'axios';
import getApiUrl from './getApiUrl';

class ApiService {
    static instance = null;

    constructor() {
        if (!ApiService.instance) {
            ApiService.instance = this;
        }
        return ApiService.instance;
    }

    async login(email, password) {
        const response = await axios.post(getApiUrl('/login_check'), {
            email,
            password,
        });
        return response.data;
    }
}

const apiServiceInstance = new ApiService();
Object.freeze(apiServiceInstance);
export default apiServiceInstance;