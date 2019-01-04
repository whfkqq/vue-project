/**
 * Created by wangchy on 2018/11/22.
 */

/**
 * 创建 行业&风格 的分析图表
 * 行业配置：industry allocation 简写 ia
 * 风格因子：style factor 简写sf
 */

import {
	getFulltimeIndustryAllocation,
	getRollingIndustryAllocation,
	getRelativeBenchmark,
	getIAValidityWeighted,
	getIAValidityUnweighted

} from '@/api/fundview'

export default
{

	//滚动行业配置(全时段行业配置)
	iaRolling(params)
	{
		getFulltimeIndustryAllocation(params.fundType,params.fundCode)
		.then(res =>
		{
			try
			{
				console.log('createIARolling', res)
				let resData = res.data;
				if (resData.items.length)
				{
					params.options.legend.data = [];
					params.options.series.data = [];
					resData.items.forEach((item, index) =>
					{

						params.options.legend.data.push(item.industryName);
						params.options.legend.selected[item.industryName] = index < 10;
						params.options.series.data.push({
								name: item.industryName,
								value: item.allocation
							});

					});


					//获取分析报告
					/*    let reportInfo = report.getUplinkMonthReturnsInfo(
					 this.chartOptions.series[index*2].data,
					 this.chartOptions.series[index*2+1].data,
					 benchName
					 );
					 this.chartData.iaRolling = {...this.chartData.iaRolling,reportInfo:reportInfo};*/

					params.chart.setOption(params.options);
					console.log('createIARolling over',params.options)
				}
			}catch(e){console.log(e)}
		});
	},


	//行业配置滚动漂移
	iaRollingDrift(params)
	{
		getRollingIndustryAllocation(params.fundType,params.fundCode)
		.then(res =>
		{
			try
			{
				console.log('createChartIARolling', res)
				let resData = res.data;
				if (resData)
				{
					params.options.legend.data = [];
					params.options.xAxis.data = [];
					params.options.series = [];
					let key,dataArr,seriesItem;
					for(key in resData)
					{
						params.options.legend.data.push(key);
						dataArr = resData[key];
						seriesItem = {
							name:key,
							type:'line',
							stack: '总量',
							symbol: "none",
							areaStyle: {normal: {}},
							data:[]
						};
						dataArr.forEach( (item) => {
							let index = params.options.xAxis.data.findIndex((item1) => {return item1== item.tradeDate});
							if(index === -1)
							{
								params.options.xAxis.data.push(item.tradeDate);
							}
							seriesItem.data.push(item.allocation);
						});
						params.options.series.push(seriesItem);
					}

					//获取分析报告
					/*    let reportInfo = report.getUplinkMonthReturnsInfo(
					 this.chartOptions.series[index*2].data,
					 this.chartOptions.series[index*2+1].data,
					 benchName
					 );
					 this.chartData.iaRolling = {...this.chartData.iaRolling,reportInfo:reportInfo};*/

					params.chart.setOption(params.options);
					console.log('createChartIARolling over')
				}
			}catch(e){console.log(e)}
		});
	},

	//相对基准超额配置
	iaRelativeBenchmark(params)
	{
		getRelativeBenchmark(params.fundType,params.fundCode)
		.then(res =>
		{
			try
			{
				console.log('iaRelativeBenchmark', res)
				let resData = res.data;
				if (resData)
				{
					params.options.xAxis.data = [];
					params.options.series = [];
					let key,dataArr,seriesItem;
					for(key in resData)
					{
						params.options.legend.data.push(key);
						dataArr = resData[key];
						seriesItem = {
							name:key,
							type:'bar',
							symbol: "none",
							data:[]
						};
						dataArr.forEach( (item) => {
							let index = params.options.xAxis.data.findIndex((item1) => {return item1== item.tradeDate});
							if(index === -1)
							{
								params.options.xAxis.data.push(item.tradeDate);
							}
							seriesItem.data.push(item.allocation);
						});
						params.options.series.push(seriesItem);
					}

					//获取分析报告
					/*    let reportInfo = report.getUplinkMonthReturnsInfo(
					 this.chartOptions.series[index*2].data,
					 this.chartOptions.series[index*2+1].data,
					 benchName
					 );
					 this.chartData.iaRolling = {...this.chartData.iaRolling,reportInfo:reportInfo};*/

					params.chart.setOption(params.options);
					console.log('iaRelativeBenchmark over')
				}
			}catch(e){console.log(e)}
		});
	},

	//行业配置有效性(加权)
	iaValidityWeighted(params)
	{
		getIAValidityWeighted(params.fundType,params.fundCode)
		.then(res =>
		{
			try
			{
				console.log('iaValidityWeighted', res)
				let resData = res.data;
				if (resData)
				{
					params.options.xAxis.data = [];
					params.options.series[0].data = [];
					let key,xAxisName,dataArr,dataArrNew;
					for(key in resData)
					{
						xAxisName = key.slice(0,key.indexOf('('));  //key:交通运输(申万) 去除'(申万)'
						params.options.xAxis.data.push(xAxisName);
						dataArr = resData[key];
						dataArrNew = [];
						dataArr.forEach( (item) => {
							let index = params.options.yAxis.data.findIndex((item1) => {return item1== item.tradeDate});
							if(index === -1)
							{
								params.options.yAxis.data.push(item.tradeDate);
							}
							dataArrNew.push([xAxisName, item.tradeDate, item.validityWeighted]);
						});

						dataArrNew = dataArr.map(item => {
							if(item[2] == '0.0000')
							{
								item[2] = '-';
							}
							return [item[0], item[1], item[2]];
						});

						params.options.series[0].data = dataArrNew;
					}

					//获取分析报告
					/*    let reportInfo = report.getUplinkMonthReturnsInfo(
					 this.chartOptions.series[index*2].data,
					 this.chartOptions.series[index*2+1].data,
					 benchName
					 );
					 this.chartData.iaRolling = {...this.chartData.iaRolling,reportInfo:reportInfo};*/

					params.chart.setOption(params.options);
					console.log('create chart:iaValidityWeighted over', params.options);
				}
			}catch(e){console.log(e)}
		});
	},

	//行业配置有效性(未加权)
	iaValidityUnweighted(params)
	{
		getIAValidityUnweighted(params.fundType,params.fundCode)
		.then(res =>
		{
			try
			{
				console.log('iaValidityUnweighted', res)
				let resData = res.data;
				if (resData)
				{
					params.options.xAxis.data = [];
					params.options.series[0].data = [];
					let key,xAxisName,dataArr,dataArrNew;
					for(key in resData)
					{
						xAxisName = key.slice(0,key.indexOf('('));  //key:交通运输(申万) 去除'(申万)'
						params.options.xAxis.data.push(xAxisName);
						dataArr = resData[key];
						dataArrNew = [];
						dataArr.forEach( (item) => {
							let index = params.options.yAxis.data.findIndex((item1) => {return item1== item.tradeDate});
							if(index === -1)
							{
								params.options.yAxis.data.push(item.tradeDate);
							}
							dataArrNew.push([xAxisName, item.tradeDate, item.validityWeighted]);
						});

						dataArrNew = dataArr.map(item => {
							if(item[2] == '0.0000')
							{
								item[2] = '-';
							}
							return [item[0], item[1], item[2]];
						});

						params.options.series[0].data = dataArrNew;
					}

					//获取分析报告
					/*    let reportInfo = report.getUplinkMonthReturnsInfo(
					 this.chartOptions.series[index*2].data,
					 this.chartOptions.series[index*2+1].data,
					 benchName
					 );
					 this.chartData.iaRolling = {...this.chartData.iaRolling,reportInfo:reportInfo};*/

					params.chart.setOption(params.options);
					console.log('create chart:iaValidityUnweighted over', params.options);
				}
			}catch(e){console.log(e)}
		});
	},
}