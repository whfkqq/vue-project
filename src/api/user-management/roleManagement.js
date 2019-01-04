/**
 * Created by whf on 2018/11/9.
 */
import {httpClientUserMange as axios} from '@/libs/api.request'
//获取所有角色
export const getRoleList = () => {
  let url = `/roles/getAllRoles`
  return axios.request({
    url: url,
    method: 'GET',
    params: {
    }
  })
}

//新增角色
export const addRole = (roleInfo) => {
  let url = `/roles/addRole`
  return axios.request({
    url: url,
    data: roleInfo,
    method: 'POST',
  })
}
//删除一个角色
export const delRole = (roleCode) => {
  let url = `/roles/delRole?roleCode=${roleCode}`
  return axios.request({
    url: url,
    params: {},
    method: 'DELETE'
  })
}
//获取一个角色详情
export const roleDetaile = (roleCode) => {
  let url = `/roles/getRole?roleCode=${roleCode}`
  return axios.request({
    url: url,
    method: 'GET',
    params:{}
  })
}
//角色编辑
export const updateRole = (roleInfo) => {
  let url = `/roles/updateRole`
  return axios.request({
    url: url,
    method: 'PUT',
    data: roleInfo
  })
}

//获取权限对应的角色
export const getRolesOfPermission = (pcode) => {
  let url = `/roles/getRolesOfPermission?pcode=${pcode}`
  return axios.request({
    url: url,
    method: 'GET',
    params: {}
  })
}

//给权限添加角色
export const setRolesOfPermission = (roleOfPermission) => {
  let url = `/roles/setRolesOfPermission`
  return axios.request({
    url: url,
    method: 'POST',
    data: roleOfPermission
  })
}

//设置用户下的角色
export const setRolesOfUser = (userId,roleCodes) => {
  return axios.request({
    url: '/roles/setRolesOfUser',
    method: 'post',
    data: {
      userId: userId,
      roleCodeList: roleCodes
    }
  })
}
//获取用户的角色
export const getRolesOfUser = (userId) => {
  return axios.request({
    url: '/roles/getRolesOfUser',
    params: {
      userId:userId
    },
    method: 'get'
  })
}
