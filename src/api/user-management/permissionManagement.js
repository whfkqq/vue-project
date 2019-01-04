import {httpClientUserMange as axios} from '@/libs/api.request'

//获取角色下的所有权限
export const getPermissionsOfRole = (roleCode) => {
  let url = `/permissions/getPermissionsOfRole?roleCode=${roleCode}`
  return axios.request({
    url: url,
    method: 'GET',
    params: {}
  })
}

//获取全部权限
export const getAllPermissions = () => {
  let url = `/permissions/getAllPermissions`
  return axios.request({
    url: url,
    method: 'GET',
    params: {
    },
  })
}

//新增一个权限
export const addPermission = (permissionInfo) => {
  let url = `/permissions/addPermission`
  return axios.request({
    url: url,
    method: 'POST',
    data: permissionInfo
  })
}
//删除一个权限
export const delPermission = (pcode) => {
  let url = `/permissions/delPermission?pcode=${pcode}`
  return axios.request({
    url: url,
    method: 'DELETE',
    params: {
    }
  })
}
//查看一个权限详情
export const permissionsDetaile = (pcode) => {
  let url = `/permissions/getPermission?pcode=${pcode}`
  return axios.request({
    url: url,
    method: 'GET',
    params:{}
  })
}

//更新权限
export const updatePermission = (permissionInfo) => {
  let url = `/permissions/updatePermission`
  return axios.request({
    url: url,
    method: 'PUT',
    data: permissionInfo
  })
}

// 给角色添加权限
export const setPermissionsOfRole = (permissionOfRole) => {
  let url = `/permissions/setPermissionsOfRole`
  return axios.request({
    url: url,
    method: 'POST',
    data: permissionOfRole
  })
}

//获取用户下的权限
export const getPermissionsOfUser = (userId) => {
  return axios.request({
    url: '/permissions/getPermissionsOfUser',
    method: 'get',
    params: {
      userId:userId
    }
  })
}
