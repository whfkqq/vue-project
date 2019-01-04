import HttpRequest from '@/libs/axios'
import axios from 'axios'
import config from '@/config'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro;
const httpClient = new HttpRequest(baseUrl);

//用户管理
const userMangeUrl = 'http://10.29.182.143:8088/v1'
const httpClientUserMange=new HttpRequest(userMangeUrl);

//身份验证
//const authUrl = 'https://10.29.182.142:7171'
const authUrl = 'https://dimauth.zts.com.cn:7171'
const httpClientAuth=axios.create({
  baseURL:authUrl
});


export {httpClientUserMange,httpClientAuth}
export default httpClient

