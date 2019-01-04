/**
 * Created by wangchy on 2018/11/12.
 */

import _math from 'lodash/math'
import report from '@/config/reportTemplate.js'

export default
{
	//净值
	/*
	*
	* */
	getNavInfo(navData,benchData)
	{
		let navDividBenchSum = 0,
			navResult,
			navReport = '';
		navData.forEach((item,index) => {
			navDividBenchSum +=  item/(benchData[index]/benchData[0]);
		});

		navResult = navDividBenchSum/navData.length;
		console.log('navReportValue:',navResult)
		if(navResult > 0.3)
		{
			navReport  = report.nav.variables[0];
		}
		else if(navResult < 0)
		{
			navReport  = report.nav.variables[1];
		}
		else
		{
			navReport  = report.nav.variables[2];
		}

		return navReport;
	},


	//回撤
	getDrawDownInfo(drawDownData,dateData)
	{
		let minDrawDownValue,minDrawDownValueIndex,date,drawDownReport;
		minDrawDownValue =  Math.min.apply(null,drawDownData);
		minDrawDownValueIndex = drawDownData.indexOf(minDrawDownValue);
		date = dateData[minDrawDownValueIndex];

		if(minDrawDownValue > 0.1)
		{
			drawDownReport = report.drawDown.variables[0];
		}
		else if(minDrawDownValue > 0.05)
		{
			drawDownReport = report.drawDown.variables[1];
		}
		else
		{
			drawDownReport = report.drawDown.variables[2];
		}
		drawDownReport += report.drawDown.base.replace('$year$',date.substr(0,4));
		drawDownReport = drawDownReport.replace('$month$',date.substr(5,2));
		drawDownReport = drawDownReport.replace('$value$',minDrawDownValue);

		return drawDownReport;
	},

	//上行
	/*
	* 1. 基准数据取每个月的最后一天的数据，作为基准月度数据
	* 2. 基准月度数据再转换：从第二个月开始，当月的数值/上一个月的数值，作为当月的数值
	* 3. 基准月度数据过滤：大于0的表示上行，小于0表示下行
	* 4. 最后：（月度收益>基准的个数）/总个数
	* */
	getUplinkMonthReturnsInfo(monthReturnsData, benchData,benchName)
	{
		let len = monthReturnsData.length;
		let count = 0;
		let result,reportInfo;

		for(var i = 0; i < len; i++)
		{
			if(monthReturnsData[i] > benchData[i])
			{
				count++;
			}
		}
		result = count/len;
		if(result < 0.4)
		{
			reportInfo = report.uplinkMonthReturns.variables[0];
		}
		else if(result > 0.6)
		{
			reportInfo = report.uplinkMonthReturns.variables[1];
		}
		else
		{
			reportInfo = report.uplinkMonthReturns.variables[2];
		}
		reportInfo = report.uplinkMonthReturns.base.replace('$benchName$', benchName) + reportInfo;
		return reportInfo;
	},

	//下行月度收益
	getDownlinkMonthReturnsInfo(monthReturnsData, benchData, benchName)
	{
		let len = monthReturnsData.length;
		let count = 0;
		let result,reportInfo;

		for(var i = 0; i < len; i++)
		{
			if(monthReturnsData[i] > benchData[i])
			{
				count++;
			}
		}
		result = count/len;
		if(result < 0.4)
		{
			reportInfo = report.downlinkMonthReturns.variables[0];
		}
		else if(result > 0.6)
		{
			reportInfo = report.downlinkMonthReturns.variables[1];
		}
		else
		{
			reportInfo = report.downlinkMonthReturns.variables[2];
		}
		reportInfo = report.uplinkMonthReturns.base.replace('$benchName$', benchName) + reportInfo;
		return reportInfo;
	},

	/*
	* 收益率和波动率
	* 收益率：大于0的个数 / 总个数
	* 波动率：（每个数/平均数）>1 的个数/ 总个数
	*
	*/

	getReturnsAndVolatilityInfo(returnsData, volatilityData)
	{
		let reportInfo, returnsReportInfo ; //report.returnsAndVolatility.base
		let positiveReturnsCount = 0;
		let returnsResult;
		returnsData.forEach((item)=>{if(item > 0) {positiveReturnsCount++}});
		returnsResult = positiveReturnsCount / returnsData.length;
		if(returnsResult > 0.6)
		{
			returnsReportInfo = report.returns.variables[0];
		}
		else if(returnsResult < 0.6)
		{
			returnsReportInfo = report.returns.variables[1];

		}
		else
		{
			returnsReportInfo = report.returns.variables[2];
		}

		let volatilityMean = _math.mean(volatilityData);
		let volatilityGT1Count = 0;
		let volatilityResult, volatilityReportInfo;
		volatilityData.forEach((item)=>{if((item / volatilityMean) > 1) {volatilityGT1Count++}});
		volatilityResult = volatilityGT1Count / volatilityData.length;
		if(volatilityResult > 0.6)
		{
			volatilityReportInfo = report.volatility.variables[0];
		}
		else if(volatilityResult < 0.6)
		{
			volatilityReportInfo = report.volatility.variables[1];

		}
		else
		{
			volatilityReportInfo = report.volatility.variables[2];
		}
		reportInfo = report.returnsAndVolatility.base + returnsReportInfo + volatilityReportInfo;
		return reportInfo;
	},


	/*
	* 夏普比率和索提诺比率
	* 1. 首先标记最后一个值L
	* 2. 所有数据降序排序，然后找出L的索引indexL
	* 3. 计算百分比value：(1-(indexL/总个数))*100
	* 4. 去掉各位数：Math.floor(value/10)*10
	* */

	getSharpRatioAndSortinoRatio(sharpData, sortinoData)
	{
		//console.log('sharpData',sharpData);
		//console.log('sortinoData',sortinoData);
		function getRatio(data)
		{
			let len = data.length;
			let lastValue = data[len - 1];
			data = data.sort().reverse();
			let lastValueIndex = data.indexOf(lastValue);
			return Math.floor((1-(lastValueIndex/len))*10)*10;
		}

		let sharpRatio = getRatio(sharpData);
		let sortinoRatio = getRatio(sortinoData);
		return report.sharpRatioAndSortinoRatio.base.replace('$sharp$',sharpRatio).replace('$sortino$',sortinoRatio);
	}

}