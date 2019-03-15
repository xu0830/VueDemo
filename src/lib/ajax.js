import axios from 'axios';
import appconst from './appconst';

const ajax = axios.create({
    baseURL: appconst.remoteServiceBaseUrl,
    timeout: 30000,
    headers: {
        // 'Access-Control-Allow-Origin': '*'
    }
});

export default ajax;