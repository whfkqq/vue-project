
/**
 * Created by wangchy on 2018/11/10.
 */

// 基金评测报告模板
export default
{
	nav:
	{
		base:'',
		variables:
		[
			'产品大部分时段跑赢$benchName$。20期滚动夏普和索提诺比率，全时段中夏普比率位于$sharp$分位数位置，全时段中索提诺比率位于$sortino$分位数位置20期滚动夏普和索提诺比率，全时段中夏普比率位于$sharp$分位数位置',
			'产品大部分时段不如$benchName$。',
			'产品整体净值走势与$benchName$基本相同。'
		]
	},

	uplinkMonthReturns:
	{
		base:'相比$benchName$，在市场上行时段中，',
		variables:
			[
				'产品的大部分时段表现劣于基准，展现了基金经理择时能力弱于市场。',
				'产品的大部分时段表现优于基准，展现了优于市场的稳定择时能力。',
				'产品的大部分时段表现与基准趋势类似，展现了基金经理择时与市场基本相同。'
			]
	},

	downlinkMonthReturns:
	{
		base:'相比$benchName$,在市场下行时段中，',
		variables:
			[
				'产品的大部分时段表现劣于基准，展现了基金经理择时能力弱于市场。',
				'产品的大部分时段表现优于基准，展现了优于市场的稳定择时能力。',
				'产品的大部分时段表现与基准趋势类似，展现了基金经理择时与市场基本相同。'
			]
	},

	drawDown:
		{
			base:'在$year$年$month$月时的回撤最大，为$value$。',
			variables:
				[
					'产品回撤较大，在较长时间回撤大于10%。',
					'产品回撤较小，回撤控制能力较强。',
					'产品回撤较稳定。'
				]
		},

	returnsAndVolatility:
	{
		base: '20期滚动收益和波动率表现，'
	},
	returns:
		{
			base:'',
			variables:
				[
					'滚动收益率高，说明产品择时能力优于基准。',
					'滚动收益率低，说明产品择时能力弱于基准。',
					'滚动收益率稳定，说明产品择时能力一般。'
				]
		},

	volatility:
		{
			base:'',
			variables:
				[
					'产品波动率低，说明产品在给定时段稳定度高。',
					'产品波动率高，说明产品在改定时段稳定度低，风险大。',
					'产品波动率稳定，基本在零上下浮动。'
				]
		},

	sharpRatioAndSortinoRatio:
		{
			base:'20期滚动夏普和索提诺比率，全时段中夏普比率位于$sharp$分位数位置，全时段中索提诺比率位于$sortino$分位数位置。',
			variables: []
		}


}