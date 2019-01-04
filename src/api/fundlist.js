/*
    AppName:mcomb
    Description:fundlist.js
    Coding by tianyj on 15:34
 */
import axios from '@/libs/api.request'

export const getFundTableData = (userID) => {
  let url = `getUserFunds/${userID}`;
  // Optionally the request above could also be done as  -BYTZ03
  return axios.request({
    url: url,
    method: 'get',
    params: {}
  })
}


