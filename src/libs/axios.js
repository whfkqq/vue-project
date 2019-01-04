import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Spin,Message } from 'iview'
import { removeToken } from '@/libs/util'


const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'Authorization' : 'bearer ' +  store.state.user.token
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
	    console.log('interceptors.request err:');
	    console.log(error)
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {
    	console.log('interceptors.response err:');
    	console.log(error)
      this.destroy(url)
      addErrorLog(error.response)
      refreshToken(error)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest



const refreshToken = res => {

  // token失效自动刷新,刷新失败跳转登陆
  if(res.response && res.response.status === 401 && router.history.current.name !=='loginNew'){
    let config = res.config;
      store.dispatch('handleRefreshToken').then(res => {
        //console.log("刷新++++++++++++++++++++")
        config.headers.Authorization = 'bearer ' +  store.state.user.token
        return axios(config)
      }).catch(err => {
        //console.log("刷新erro++++++++++++++++++++")
        Message.info('登陆失效，请重新登陆')
        removeToken()
        window.setTimeout(() => {
          router.replace('/login')
        },1000)
      })
  }

}
