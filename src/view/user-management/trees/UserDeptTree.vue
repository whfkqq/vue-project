<template>
    <div>
      <chu-tree v-show="!isLoadingData"
              ref="userDeptTree"
              node-key="code"
              :data="userDeptList"
              :props="defaultProps"
              :render-content="renderContent"
              :show-checkbox="isShowCheckbox"
              :filter-node-method="filterUserDeptNode"
              @node-click="handleClickNode">
      </chu-tree>
      <div v-show="isLoadingData" class="loading_wrapper">
        <Spin fix>
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
      </div>

    </div>
</template>

<script>
import  {getUserDeptTree}  from '@/api/user-management/userManagement'
import { parseTree } from '@/libs/util'

export default
{

    props:
    [
        'isShowCheckbox'
    ],
    data()
    {
        return {
            isLoadingData: true,
            userDeptList:[],
            defaultProps:
            {
                children: 'children',
                label: 'nodeName'
            },
        }
    },

    methods:
    {
        // 获取权限列表
        initUserDeptList()
        {
            getUserDeptTree().then
            (
                (res) =>
                {
                    if(res.status == 200)
                    {
                        this.isLoadingData = false;
                        this.userDeptList = parseTree(res.data.items,null,"code","shOrder");
                    }
                }
            )
        },

        //单击选定节点
        handleClickNode(nodeData, node, nodeEle)
        {
            this.$emit('ClickNode',nodeData, node, nodeEle);
        },

        //过滤节点
        filterUserDeptNode(value, data)
        {
            if (!value) return true;
            return data.nodeName.indexOf(value) !== -1;
        },

        //渲染树节点
        renderContent (h, { root, node, data }) {
          let icon=''
          data.nodeType==='1' ? icon='md-home': icon='md-person'
          return h('span',
            {
              attrs:{
                class:'tree-node-lable'
              }
            },
            [
              h('span', [
                h('Icon', {
                  props: {
                    type: icon
                  },
                  style:{
                    marginRight:'5px'
                  }
                }),
                h('span', data.nodeName)
              ])
            ]);
      }





    },

    created()
    {
        this.initUserDeptList();
    }

}

</script>
<style>
  /*
  .tree-node-lable:hover{
     color: red;
   }
  .nodeClickStyle{
    color:red;
  }
  */
</style>
