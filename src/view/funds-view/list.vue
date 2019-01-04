<template>
    <div class="content-wrapper">
        <div class="content-header addBottomStyle">
            <form class="form-inline">
                <div class="form-group">
                    <Select v-model='nameOrType'>
                        <option>产品名称</option>
                        <option>产品代码</option>
                    </Select>
                    <select  v-model='publicOrPrivate'>
                        <option>私募</option>
                        <option>公募</option>
                    </select>
                    <div class="input-group searchText">
                        <!-- <input type="text" class="form-control searchText" id="exampleInputAmount" v-model='product' placeholder="请输入产品名以及产品代码"> -->
                        <label class="control-label" for="inputSuccess">
                            <input type="text" class="form-control" id="inputSuccess" :placeholder="'请输入' + nameOrType" v-model='product' autocomplete="off">
                            <span class="glyphicon glyphicon-search" @click='searchData'></span>
                        </label>
                    </div>
                </div>
                <!-- <button type="submit" class="btn btn-primary">搜索
                    <i class="fa fa-search"></i>
                </button> -->
            </form>
        </div>
        <div class="box-body">

            <table class="table table-striped table-bordered table-hover y-table">
                <thead>
                    <tr>
                        <th v-for="c in productCol" :data-sort='c.sort' :key='c' class="text-center">
                            {{ c }}
                        </th>
                        <th class="text-center" style="width:50px">
                            订阅
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <template>
                        <tr v-for="(s,i) of result.list" :key='s'>
                            <td v-for="c in s" :class="{'hide':c.self}" :key='c'>
                                <!-- <p v-if='c.self'>
                                    <a :href="c.self.href">跳转</a>
                                </p> -->
                                <p>{{c}}</p>
                            </td>
                            <td class="subscription">
                                <a :class="{ 'active': i === selected }" @click="choose(i,s)">订阅</a>
                                <!-- <a :class='{ "active": i === selected ? c[this.sessionStorage.getItem("code")] }' @click="choose($event,i,s)">订阅</a> -->
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <!--<page :total='result.total' :pageSize='par.size' @on-change="changePage"></page>-->
        </div>
    </div>
</template>
<style scoped>
.searchText label {
    vertical-align: bottom;
}
.searchText input {
    border: none;
    outline: none;
    width: 206px !important;
}
.searchText span {
    display: inline-block;
    width: 43px;
    padding: 9.6px 0;
    text-align: center;
    vertical-align: bottom;
    top: 0;
    background: #fff;
    cursor: pointer;
}
.addBottomStyle {
    padding-bottom: 15px;
}
.y-table .fa-long-arrow-down,
.y-table .fa-long-arrow-up {
    color: #f00;
}

.y-table > thead > tr > th {
    text-align: center;
}
.subscription > a {
    display: inline-block;
    padding: 5px 0px;
    border-radius: 6px;
    background: #337ab7;
    color: #fff;
    width: 40px;
    margin-left: -3px;
    text-align: center;
    cursor: pointer;
}
.subscription .active {
    background: red;
    border-color: red;
}
.hide{
    display: none !important;
}
</style>
<script>
//import page from "@/components/page";
import {getFunds} from '@/api/fundview'

export default {
    components: {
        //page
    },
    data() {
        return {
            product: null,
            productCol: {
                productName: "产品名称",
                productCode: "产品代码",
                productType: "产品类型",
                latelyNetPrice: "最新净值",
                accumEarn: "累计收益",
                yieldOfThisYear: "今年以来收益",
                dateEstablish: "成立日期",
                annualYield: "年化收益率",
                annualVolatility: "年化波动率",
                skewness: "偏度",
                kurtosis: "峰度",
                sharpRatio: "夏普比率",
                informationRatio: "信息比率",
                sortinoRatio: "所提诺比率",
                maxDrawdown: "最大回撤",
                dateMaxDrawdown: "最大回撤日期",
                bestMonthReturn: "最好月份回报",
                worstMonthReturn: "最差月份回报",
                topDayGain: "最大单日涨幅",
                topDayLoss: "最大单日跌幅",
                extremeRatioByDay: "创新高天数占比",
                var95Percent: "Var(95%)",
                alpha: "Alpha",
                beta: "Beta",
                rsquare: "Rsquare",
                weekEarn: "本周收益",
                weekMaxDrawdown: "本周最大回撤",
                monthEarn: "本月收益",
                monthMaxDrawdown: "本月最大回撤",
                yearEarn: "本年收益",
                yearMaxDrawdown: "本年最大回撤",
                uplinkOdds: "上行胜率",
                uplinkEarnProb: "上行赢率概率",
                downlinkOdds: "下行胜率",
                downlinkEarnProb: "下行盈利概率",
                updateDate: "更新日期",
                // _links: "链接"
            },
            nameOrType: "产品名称",
            publicOrPrivate: "私募",
            serverSrc: "",
            selected: null,
            par: {
                page: 1,
                size: 20,
                total: true
            },
            result: {
                total: 0,
                list: []
            },
            search: [],
            parName: {
                page: 1,
                size: 20,
                total: true
            },
            parType: {
                page: 1,
                size: 20,
                total: true
            },
            conversion: {
                私募: 1,
                公募: 0
            },
            saveNameAndTypeObj: {}
        };
    },
    created() {},
    mounted() {
        let self = this;
        self.load();
    },
    methods: {
        load() {
            var self = this;
	        getFunds('',self.par)
                .then(res => {
                self.result.list = res.data.items;
                self.result.total = res.data.total;

                if (!sessionStorage.getItem("code")) {
                    sessionStorage.setItem("code", res.data.items[0].productCode);
                    sessionStorage.setItem("type", res.data.items[0].productType);
                    sessionStorage.setItem("name", res.data.items[0].productName);
                    self.selected = 0;
                } else {
                    let code = sessionStorage.getItem("code");
                    self.result.list.forEach((it, index) => {
                        if (it.productCode == code) {
                            self.selected = index;
                        }
                    });
                }
            });
        },
        changePage(page) {
            var self = this;
            Object.assign(self.par, page);
            self.load();
        },
        searchData() {
            let self = this;
            if (self.product) {
                if (self.nameOrType == "产品名称") {
                    //self.$get(`productindicator/${self.conversion[self.publicOrPrivate]}/name/${self.product}`, self.parName)
	                getFunds({publicOrPrivate:self.conversion[self.publicOrPrivate],product:self.product },self.parName)
                        .then(res => {
                        self.result.list = res.data.items;
                    });
                } else {
                    //self.$get(`productindicator/${self.conversion[self.publicOrPrivate]}/code/${self.product}`, self.parType)
	                getFunds({publicOrPrivate:self.conversion[self.publicOrPrivate],product:self.product },self.parType)
                    .then(res => {
                        self.result.list = res.data.items;
                    });
                }
            } else {
                this.$Modal.info({ body: "请输入信息" });
            }
        },
        choose(i, c) {
            let self = this;
            self.selected = i;
            sessionStorage.setItem("code", c.productCode);
            sessionStorage.setItem("type", c.productType);
            sessionStorage.setItem("name", c.productName);
        }
    }
};
</script>


