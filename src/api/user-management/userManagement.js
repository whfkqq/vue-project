/**
 * Created by whf on 2018/10/30.
 */
import {httpClientUserMange as axios} from '@/libs/api.request'

//获取所有用户
export const getAllUsers = (page,size) => {
  let url = `/users/getAllUsers?page=${page}&size=${size}`;
  return axios.request({
    url: url,
    params: {},
    method: 'get'
  })
}
//获取组织机构下的所有用户
export const usersOfGroup = (groupCode) => {
  let url = `/users/getUsersOfGroup?groupCode=${groupCode}`
  return axios.request({
    url: url,
    params: {},
    method: 'GET'
  })
}
//新增用户
export const addUser = (newAddUserInfo) => {
  let url = `/users/addUser`
  return axios.request({
    url: url,
    data: newAddUserInfo,
    method: 'POST'
  })
}
//删除用户
export const delUserById = (userId) => {
  let url = `/users/delUser?userId=${userId}`;
  return axios.request({
    url: url,
    params: {},
    method: 'DELETE'
  })
}
//更新用户信息
export const editeUserInfo = (userInfo) => {
  let url = `/users/updateUser`
  return axios.request({
    url: url,
    method: 'PUT',
    data:userInfo
  })
}
//获取一个用户详情
export const getUserInfo = (userId) => {
  let url = `/users/getUser?userId=${userId}`
  return axios.request({
    url: url,
    method: 'GET',
    params: {}
  })
}
//用户查询
export const searchUser = (keyWord) => {
  let url = `/users/fuzzySearchUsers?keyword=${keyWord}`
  return axios.request({
    url: url,
    params: {},
    method: 'GET'
  })
}

//获取角色下的用户
export const getUsersOfRole = (roleCode) => {
  return axios.request({
    url: '/users/getUsersOfRole',
    method: 'get',
    params: {
      roleCode:roleCode
    }
  })
}
//获取权限下的用户
export const getUsersOfPermission = (pCode) => {
  return axios.request({
    url: '/users/getUsersOfPermission',
    method: 'get',
    params: {
      pcode:pCode
    }
  })
}

//设置角色下的用户
export const setUsersOfRole = (roleCode,userList) => {
  return axios.request({
    url: '/users/setUsersOfRole',
    method: 'post',
    data: {
      roleCode: roleCode,
      userList: userList
    }
  })
}

//获取用户部门树
export const getUserDeptTree = () => {
  return axios.request({
    url: '/users/getUserDeptTree',
    method: 'get',
    params: {

    }
  })
}
