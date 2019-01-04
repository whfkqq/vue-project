/**
 * Created by whf on 2018/10/30.
 */
import {httpClientUserMange as axios} from '@/libs/api.request'

//获取所有组织机构
export const getAllGroups = () => {
  let url = `/groups/getAllGroups`
  return axios.request({
    url: url,
    params: {},
    method: 'get'
  })
}
//新增组织机构
export const addGroup = (groupInfoForm) => {
  let url =  `/groups/addGroup`
  return axios.request({
    url: url,
    data: groupInfoForm,
    method: 'POST'
  })
}
// 删除组织机构
export const deleteGroup = (groupCode) => {
  let url = `/groups/delGroup?groupCode=${groupCode}`
  return axios.request({
    url: url,
    params: {},
    method: 'DELETE'
  })
}
//组织机构修改
export const updateGroup = (groupInfo) => {
  let url = `/groups/updateGroup`
  console.log(groupInfo)
  return axios.request({
    url: url,
    data:groupInfo,
    method: 'PUT'
  })
}
