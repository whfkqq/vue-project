import {httpClientAuth as axios} from '@/libs/api.request'

export const getAuthToken = (username,password) => {

  var params = new URLSearchParams();
  params.append('username',username);
  params.append('password',password);
  params.append('grant_type','password');
  params.append('scope','dimscope');

  return axios.request({
    url: '/authserver/oauth/token',
    method: 'post',
    data:params,
    auth: {
      username: 'first',
      password: 'passwordforauthserver'
    }
  })
}


export const getNewAuthToken = (refreshToken) => {

  var params = new URLSearchParams();
  params.append('grant_type','refresh_token');
  params.append('client_id','first');
  params.append('client_secret','passwordforauthserver');
  params.append('refresh_token',refreshToken);

  return axios.request({
    url: '/authserver/oauth/token',
    method: 'post',
    data:params
  })
}
