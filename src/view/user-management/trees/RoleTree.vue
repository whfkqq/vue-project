<template>
    <div>
        <chu-tree v-show="!isLoadingData"
                 node-key="roleCode"
                 :data="roleList"
                 :props="roleProps"
                 :render-content="renderContent"
                 :draggable="isDraggable"
                 :filter-node-method="filterRoleNode"
                 @node-click="handleClick"
                 :show-checkbox="isShowCheckbox">

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

    import  {getRoleList}  from '@/api/user-management/roleManagement.js'

    export default
    {
        name:'RoleTree',
        props:
        [
            'isShowCheckbox','isDraggable'
        ],
        data()
        {
            return {
                isLoadingData: true,
                roleList:[],
                roleProps:
                {
                    children: 'children',
                    label: 'roleName'
                }
            }
        },

        methods:
        {
          renderContent (h, { root, node, data }) {
            let icon=''
            let rootCode=['auth','manager','flow']
            function test(i){
              return i === data.roleCode
            }
            rootCode.some(test) ? icon = 'md-people' : icon = 'md-person'
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
                  h('span', data.roleName)
                ])
              ]);
          },
            // 初始化角色列表
            initRoleList()
            {
                getRoleList().then
                (
                    (res) =>
                    {
                        if(res.status == 200)
                        {
                            this.isLoadingData = false;
                            this.roleList = this.parseRoleTree(res.data.items);
                        }
                    }
                )
            },

            // 把从后台获取的数据转换为element-ui tree的格式
            parseRoleTree(roles)
            {
                let authNode = { roleName: '授权角色', roleType: '2', roleCode:'auth', children: [] },
                    managerNode = { roleName: '管理员角色', roleType: '1', roleCode:'manager', children: [] },
                    flowNode = { roleName: '流程角色', roleType: '3', roleCode:'flow', children: [] };
                roles.forEach
                (
                    (item) =>
                    {
                        if(item.roleType === authNode.roleType)
                        {
                            authNode.children.push(item);
                        }
                        else if(item.roleType === managerNode.roleType)
                        {
                            managerNode.children.push(item);
                        }
                        else if(item.roleType === flowNode.roleType)
                        {
                            flowNode.children.push(item);
                        }
                    }
                );
                return [authNode,managerNode,flowNode];

            },



            //单击选定节点
            handleClick(nodeData, node, nodeEle)
            {
                this.$emit('ClickNode',nodeData, node, nodeEle);

            },

            //过滤节点
            filterRoleNode(value, data)
            {
                if (!value) return true;
                return data.roleName.indexOf(value) !== -1;
            },


        },


        created()
        {
            this.initRoleList();
        }


    }
</script>

