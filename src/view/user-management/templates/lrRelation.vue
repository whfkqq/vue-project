<template>
  <div :style="{height:contentHeight+'px',overflowY:'auto'}">
    <Row :gutter="1" class="left_Right_Relation">

      <!-- 角色管理 -->
      <Col :lg="10" :xs="24" class="role" :style="{float:floatVal}">
        <slot name="left"></slot>
      </Col>

      <!-- 权限、角色 互操作按钮 -->
      <Col :lg="4" :xs="24" class="middleOperation" :style="{float:floatVal}">
        <i-switch v-model="isEnableOperation" v-show="isShowSwitch"> </i-switch>
        <Row>
          <Col>
            <Button :disabled="!isEnableOperation" @click="handleClickExchange" v-show="isShowChangeBtn">
              <i class="iconfont icon-Group-" />&nbsp;{{exchangeText}}
            </Button>
          </Col>
          <Col>
            <Button :disabled="!isEnableOperation" @click="handleClickRelation" v-if="isShowSaveBtn">
              <i class="iconfont icon-save" />&nbsp;保存隶属关系
            </Button>
          </Col>
        </Row>
      </Col>

      <!-- 权限管理 -->
      <Col :lg="10" :xs="24" class="permission" :style="{float:floatVal}">
        <slot name="right"></slot>
      </Col>

    </Row>
  </div>
</template>

<script>
  import consts from "@/libs/consts.js"
export default
{
    props:
    {
        isShowSwitch:
        {
            type:Boolean,
            default:true
        },
        exchangeText:
        {
            type:String,
            default:''
        },
        isEnableSwitch:
        {
            type:Boolean,
            default:false
        },
        isShowSaveBtn:
        {
            type:Boolean,
            default:true
        },
        isShowChangeBtn:{
          type:Boolean,
          default:true
        }
    },

    data()
    {
        return {

            isEnableOperation: false,         // 角色权限隶属关系操作状态
            isLeftMaster: true,               // 左侧为主
            floatVal:'left',
            contentHeight:0
        }
    },


    methods:
    {

        handleClickExchange()
        {
            this.isLeftMaster = !this.isLeftMaster;
            this.floatVal = this.isLeftMaster ? 'left' : 'right';
            this.$emit('exchanage');
        },

        handleClickRelation()
        {
            this.$emit('saveRelation');
        }

    },

    watch:
    {

        isEnableOperation()
        {
            this.$emit('watchSwitch',this.isEnableOperation)
        }

    },
    mounted()
    {
      this.contentHeight =consts.pageDivHeight.contentHeight()
    },
    created()
    {
        this.isEnableOperation = this.isEnableSwitch;
    }


}

</script>

<style  lang="less">
  @import "../styles/variables.less";
    .left_Right_Relation
    {
        width:99%;
        .middleOperation
        {
            padding:100px;
            min-width: 120px;
            text-align: center;
            vertical-align: middle;

            /* border:1px solid;*/
            button
            {
                margin:15px 0;
            }
        }
    }
  .main .content-wrapper{
    padding-right: 0;
  }


</style>
