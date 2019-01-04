import axios from 'axios'
import store from '@/store'

const baseUrl = 'http://127.0.0.1:8600/docserver' // 文件中心地址或微服务API网关地址
const baseUrl4Upload = 'http://127.0.0.1:8600/zuul/docserver' // 文件中心地址或微服务API网关地址（文件上传）
const sharePrefix = 'http://127.0.0.1:8081/doc/shareurl' // 文件分享链接访问地址

const httpClient = axios.create({ baseURL: baseUrl })

httpClient.interceptors.request.use(config => {
    if (docApi.userId) {
      config.params = {
        ...config.params,
        'userId': docApi.userId
      }
    } else if (docApi.accessToken) {
      config.params = {
        ...config.params,
        'access_token': docApi.accessToken
      }
    }
  return config;
}, error => {
  return Promise.reject(error)
});

var docApi = {
  userId: '',
  baseUrl: baseUrl,
  baseUrl4Upload: baseUrl4Upload,
  sharePrefix: sharePrefix,
  accessToken: store.state.user.token,

  getFileList(params) {
    return httpClient.request({
      url: '/file/query',
      params: params,
      method: 'post'
    })
  },

  createFolder(params) {
    return httpClient.request({
      url: '/file/create',
      params: params,
      method: 'post'
    })
  },

  rename(params) {
    return httpClient.request({
      url: '/file/rename',
      params: params,
      method: 'post'
    })
  },

  move(params) {
    return httpClient.request({
      url: '/file/move',
      params: params,
      method: 'post'
    })
  },

  delete(params) {
    return httpClient.request({
      url: '/file/recycle',
      params: params,
      method: 'post'
    })
  },

  md5Check4Upload(params) {
    return httpClient.request({
      url: '/file/upload/md5Check',
      params: params,
      method: 'post'
    })
  },

  chunkCheck4Upload(params) {
    return httpClient.request({
      url: '/file/upload/chunkCheck',
      params: params,
      method: 'post'
    })
  },

  chunksMerge4Upload(params) {
    return httpClient.request({
      url: '/file/upload/chunksMerge',
      params: params,
      method: 'post'
    })
  },

  recovery(params) {
    return httpClient.request({
      url: '/file/recovery',
      params: params,
      method: 'post'
    })
  },

  clean(params) {
    return httpClient.request({
      url: '/file/clean',
      params: params,
      method: 'post'
    })
  },

  share(params) {
     return httpClient.request({
      url: '/file/share',
      params: params,
      method: 'post'
    })
  },

  unshare(params) {
    return httpClient.request({
      url: '/file/unshare',
      params: params,
      method: 'post'
    })
  },

  getShareList(params) {
    return httpClient.request({
      url: '/file/sharequery',
      params: params,
      method: 'post'
    })
  },

  getShareUrl(params) {
    return httpClient.request({
      url: '/file/shareurl',
      params: params,
      method: 'post'
    })
  },

  formatDownloadUrl(fileId, shareUrl) {
    if (!shareUrl) {
      if(this.userId) {
        return docApi.baseUrl + '/file/download?userId=' + this.userId + '&fileId=' + fileId;
      } else if (this.accessToken) {
        return docApi.baseUrl + '/file/download?access_token=' + this.accessToken + '&fileId=' + fileId;
      }
    } else {
      if (this.accessToken) {
        return docApi.baseUrl + '/file/download/' + shareUrl + '?access_token=' + this.accessToken+ '&fileId=' + fileId;
      } else {
        return docApi.baseUrl + '/file/download/' + shareUrl + '?fileId=' + fileId;
      }
    }
  },

  formatShareUrl(shareUrl) {
    return this.sharePrefix + '/' + shareUrl;
  },

  formatSize(size, pointLength, units) {
    let unit;
    units = units || [ 'B', 'K', 'M', 'G', 'TB' ];
    while ( (unit = units.shift()) && size > 1024 ) {
      size = size / 1024;
    }
    return (unit === 'B' ? size : size.toFixed( pointLength || 2 )) +  unit;
  }
}

export default docApi
