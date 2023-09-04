import axios from "axios";

/**
 * Axios初始化操作
 */
const myAxios = axios.create({
    baseURL: process.env.VUE_APP_SERVER,
    // transformRequest: [(data) => data], // 禁用默认的数据转换
    // timeout: 5000,
    withCredentials:true,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
})
// myAxios.defaults.withCredentials = true;
/**
 * axios拦截器
 */
myAxios.interceptors.request.use(function (config) {
    console.log('请求参数：', config);
    // const token = store.state.user.token;
    // if (Tool.isNotEmpty(token)) {
    //     config.headers.token = token;
    //     console.log("请求headers增加token:", token);
    // }
    return config;
}, error => {
    return Promise.reject(error);
});
myAxios.interceptors.response.use(function (response) {
    console.log('返回结果：', response);
    return response;
}, error => {
    console.log('返回错误:',error);
    return Promise.reject(error);
});
export default myAxios;

