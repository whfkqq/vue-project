//import { login, logout, getUserInfo } from '@/api/user'
import { setToken, getToken, removeToken } from '@/libs/util'
import {getAuthToken,getNewAuthToken} from '@/api/auth.js'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    access: [],
    token: '',
    refreshToken: getToken(),
    hasGetInfo: false
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
    },
    setRefreshToken (state, refreshToken) {
      state.refreshToken = refreshToken
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, {userName, password, remeberMe}) {
      userName = userName.trim()
     // console.log(userName+'|'+password+'|'+'|'+remeberMe)
      return new Promise((resolve, reject) => {

        getAuthToken(userName,password).then(res => {
          const data = res.data
          //初始化token
          commit('setToken',data.access_token)
          commit('setRefreshToken',data.refresh_token)
          setToken(data.refresh_token,remeberMe) //refreshToken存入cookie

          //初始化用户信息
          const avator = 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
          commit('setAvator', avator) //目前没有头像暂时写死
          commit('setUserId',data.userId)
          commit('setUserName', data.userName)
          if (data.roleList && data.roleList.length > 0)
          {
            commit('setAccess', data.roleList)
          }
          commit('setHasGetInfo', true)

          resolve(data)
        }).catch(err => {
          reject(err)
        })


      })
    },
    handleRefreshToken({ commit,state }){
      //刷新token
      return new Promise((resolve, reject) => {
        getNewAuthToken(state.refreshToken).then(res=>{
          const data = res.data
          //初始化token
          commit('setToken', data.access_token)
          commit('setRefreshToken', data.refresh_token)
          //初始化用户信息
          const avator = 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
          commit('setAvator', avator) //目前没有头像暂时写死
          commit('setUserId',data.userId)
          commit('setUserName', data.userName)
          if (data.roleList && data.roleList.length > 0)
          {
            commit('setAccess', data.roleList)
          }
          commit('setHasGetInfo', true)

          resolve(data)
        }).catch(res=>{
          reject(res)
        })

      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        //   removeToken()
        //   resolve()
        // }).catch(err => {
        //   reject(err)
        // })
        removeToken()
        resolve()
      })
    }



  }
}
