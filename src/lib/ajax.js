import axios from 'axios';
import appconst from './appconst';
import Cookie from 'js-cookie';

const ajax = axios.create({
    baseURL: appconst.remoteServiceBaseUrl,
    timeout: 30000
});

ajax.interceptors.request.use(function(config){
    config.headers.common["Authorization"]= Cookie.get("cj.token")? Cookie.get("cj.token") : '';
    return config;
});

export default ajax;