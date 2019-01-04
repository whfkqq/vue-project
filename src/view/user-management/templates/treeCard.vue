<template>
    <Card  class="tree_card" :style="{height: cardHeight + 'px'}">
      <div slot="title" class="tree_header">
        <Col :span="10">
          <slot name="searchInput"></slot>
        </Col>
        <Col :span="14" class="card_btns">
          <slot name="topBtns"></slot>
        </Col>

      </div>

        <div class="treeList" >
            <vue-scroll :ops="scrollOps" :style="{height: treeWrapperHeight + 'px'}">
                <Row>
                    <Col :span="20">
                        <slot name="tree"></slot>
                    </Col>
                </Row>
            </vue-scroll>
        </div>

        <slot></slot>

    </Card>

</template>

<script>

  import consts from "@/libs/consts.js"

export default
{


    data()
    {
        return {
            cardHeight:0,                   //角色、权限卡片的高度
            treeWrapperHeight:400,          //权限树、角色树的wrapper高度
            scrollOps:{
              bar:{
                background:'#999999'
              }
            }
        }
    },

    mounted()
    {
      this.cardHeight =consts.pageDivHeight.contentHeight()-10
      this.treeWrapperHeight = this.cardHeight - 70;
    }
}

</script>

<style  lang="less">

@import "../styles/variables.less";
.tree_card
{
    min-width:400px;
    border:1px solid @box-border-color;
    .ivu-card-head
    {
        border-bottom: 1px solid @box-border-color;
    }
    .card_btns
    {
        text-align: center;
    }

    .treeList
    {
        margin-top: 15px;
    }

    // 表示tree正在加载数据的icon wrapper
    .loading_wrapper
    {

      height: 100%;
      position: relative;
      top: 200px;
      font-size: 30px;
    }
  .loading_wrapper .ivu-icon-ios-loading{
    font-size: 30px !important;
  }

  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }

}



</style>
