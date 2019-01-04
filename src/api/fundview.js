/**
 * Created by wangchy on 2018/10/23.
 */

import axios from '@/libs/api.request'


export const getFunds = (urlPath,paramsJson) =>{
	let url = 'productindicator';
	if(urlPath)
	{
		url = `/${url}/${urlPath.publicOrPrivate}/name/${urlPath.product}`;
	}
	return axios.request({
		url: url,
		params: paramsJson,
		method: 'get'
	})
}

// 根据产品代码模糊搜索产品业绩表现指标
export const getKeyStaticQuotas = (type,code) =>{
	let url = `productindicator/${type}/code/${code}`;
	return axios.request({
		url: url,
		method: 'get'
	})
}



//净值和基准
export const getNavAndBenchAndDrawDown = (type,code) =>{
	let url = `productnavadjandbenchanddrawdown/${type}/${code}`;
	return axios.request({
		url: url,
		method: 'get'
	})
}

//上行月度收益
export const getUplinkMonthReturns = (type,code) =>{
	let url = `uplinkmonthearn/${type}/${code}`;
	return axios.request({
		url: url,
		method: 'get'
	})
}

//下行月度收益
export const getDownlinkMonthReturns = (type,code) =>{
	let url = `downlinkmonthearn/${type}/${code}`;
	return axios.request({
		url: url,
		method: 'get'
	})
}

//滚动收益率和波动率
export const getRollingReturnsAndVolatility = (type,code,startDate,endDate) => {
	let url = `rollearnandvolatility/${type}/${code}`;
	if(startDate && endDate)
	{
		url +=`?startdate=${startDate}&enddate=${endDate}`
	}

	return axios.request({
		url: url,
		params: {},
		method: 'get'
	})
}


//夏普比率和索诺提比率
export const getSharpRatioAndSortinoRatio = (type,code,startDate,endDate) => {
	let url = `rollsharpratioandsortinoratio/${type}/${code}`;
	if(startDate && endDate)
	{
		url +=`?startdate=${startDate}&enddate=${endDate}`
	}

	return axios.request({
		url: url,
		params: {},
		method: 'get'
	})
}

/*
************************* 行业分析
* */
//滚动行业配置（全时段行业配置）
export const getFulltimeIndustryAllocation = (type,code) =>{
	let url = `fulltimeindustryallocation/${type}/${code}`;
	return axios.request({
		url: url,
		method: 'get'
	})
}


//行业配置滚动漂移
export const getRollingIndustryAllocation = (type,code) =>{
	let url = `rollindustryallocation/${type}/${code}`;
	return axios.request({
		url: url,
		method: 'get'
	})
}

//相对基准超额配置
export const getRelativeBenchmark = (type,code) =>{
	let url = `relativedatumexcessindustryallocation/${type}/${code}`;
	return axios.request({
		url: url,
		method: 'get'
	})
}


//行业配置有效性(加权)
export const getIAValidityWeighted = (type,code) =>{
	let url = `industryallocationvalidityweighted/${type}/${code}`;
	return axios.request({
		url: url,
		method: 'get'
	})
}


//行业配置有效性(未加权)
export const getIAValidityUnweighted = (type,code) =>{
	let url = `industryallocationvalidityunweighted/${type}/${code}`;
	return axios.request({
		url: url,
		method: 'get'
	})
}


/*
 ************************* 风格分析
 * */


export const getFactorallocationcapability = (type,code) =>{
  let url = `factorallocationcapability/${type}/${code}`;
  return axios.request({
    url: url,
    method: 'get'
  })
}


export const getFactorallocationvalidityweighted = (type,code) =>
{
	let url = `factorallocationvalidityweighted/${type}/${code}`;
	return axios.request({
		url: url,
		method: 'get'
	})
}





export const getRelativeDatumExcessIndustryAllocation = (type,code) =>{
	let url = `relativedatumexcessindustryallocation/${type}/${code}`;
	return axios.request({
		url: url,
		method: 'get'
	})

}
