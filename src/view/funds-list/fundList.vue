<!--
    AppName:fund
    Description:fundList.vue
    Coding by tianyj on 2018/11/10 14:31
-->
<template>
  <div>
    <Card>
      <Icon type="ios-film-outline"></Icon>
      基金列表
    </Card>
    <div class="list-wrapper">
      <div v-for="item in tableData" id="list" class="select" @click="handleClickFund(item)">
        <fund-info :base-info="item"></fund-info>
      </div>
    </div>

  </div>
</template>
<script>
  import Tables from '_c/tables'
  import {getFundTableData} from '@/api/fundlist'
  import FundInfo from '../components/fund-info/FundInfo.vue'

  export default {
    name: 'fund_list',
    components: {
      FundInfo
    },
    data() {
      return {
        tableData: [],
      }
    },
    methods: {
	    handleClickFund(item) {
        this.$router.push({name:'content',params:item})
      },
      exportExcel() {
        this.$refs.tables.exportCsv({
          filename: `table-${(new Date()).valueOf()}.csv`
        })
      }
    },
    mounted() {
      getFundTableData('BYTZ03').then(res => {

       /* let arr = new Array()
        res.data.items.forEach(function (value, index, array) {
          //code something
          var data = new Object();
          data.name = array[index].productName;
          data.code = array[index].productCode;
          data.status = array[index].listedState;
          data.administrator = array[index].investManager;
          data.strategy = array[index].investStrategy;
          data.manager = array[index].fundManager;
          data.establishDate = array[index].startDate;
          data.unitNav = array[index].navadj;
          data.accumulateNav = array[index].accumNavadj;
          data.returnsByYear = array[index].annualYield;
          data.returnsThisYear = array[index].yieldOfThisYear;
          arr.push(data);
        });
        console.log(arr);*/
        this.tableData = res.data.items;
      })
    }
  }
</script>

<style lang="less">
  .list-wrapper
  {
    height: 600px;
    overflow-y: auto;

  }

  #list {
    border-bottom: 1px solid #CCCCCC;
  }

  div.select:hover {
    background-color: #F0F8FF;
    border-left: 6px solid #4F94CD;
  }
</style>
