<template>
    <div>
        <chu-tree v-show="!isLoadingData"
                ref="permissionTree"
                node-key="pcode"
                :data="permissionList"
                :props="defaultProps"
                :render-content="renderContent"
                :draggable="isDraggable"
                :show-checkbox="isShowCheckbox"
                :default-expanded-keys="[1]"
                :filter-node-method="filterPermissionNode"
                @node-click="handleClickPermission"
                @node-drop="handleDropSuccessPermission">
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

    import  {getAllPermissions}  from '@/api/user-management/permissionManagement.js'
    import { parseTree } from '@/libs/util'

    export default
    {
        name: 'RoleTree',
        props:
            {
                isShowCheckbox:Boolean,
                isDraggable:
                    {
                        type:Boolean,
                        default:true
                    }
            },
        data()
        {
            return {
                isLoadingData: true,
                permissionList: [],
                defaultProps:
                {
                    children: 'children',
                    label: 'pname'
                },
                clickedPermissionNode:''

            }
        },

        methods: {
              //渲染树节点
              renderContent (h, { root, node, data }) {
                let icon='ios-key'
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
                      h('span', data.pname)
                    ])
                  ]);
              },

              initPermissionList() {
                  getAllPermissions().then
                  (
                      (res) =>
                      {
                          if (res.status == 200)
                          {
                              this.$emit("TreeLoading");
                              this.isLoadingData = false;
                              this.permissionList = parseTree(res.data.items, null, "pcode", "shOrder");
                          }
                      }
                  )
              },

              // 单击选定节点
              handleClickPermission(nodeData, node, nodeEle) {
                this.$emit('ClickNode',nodeData, node, nodeEle);
                  // 重复单击节点
                  // if (this.clickedPermissionNode && nodeData.pcode == this.clickedPermissionNode.data.pcode)
                  // {
                  //     console.log('two');
                  //   this.clickedPermissionNode=''
                  //     /*
                  //   this.removeClickedStyle(nodeEle)  //取消点击样式
                  //   this.$emit('ClickNode','', '', '');
                  //   */
                  // }
                  // else
                  // {
                  //     this.clickedPermissionNode = node;
                  //     this.$emit('ClickNode',nodeData, node, nodeEle);
                  // }

              },

              //过滤节点
              filterPermissionNode(value, data) {
                  if (!value) return true;
                  return data.pName.indexOf(value) !== -1;
              },

              // 拖放节点成功事件的回调
              handleDropSuccessPermission(sourceNode,targetNode,position,evt) {
                  this.$emit('DropNode',sourceNode,targetNode,position,evt)
              },

              // 节点排序
              sortNode(nodeKey) {
                  let node = this.$refs.permissionTree.getNode(nodeKey);
                  console.log('sortNode before:',node)
                  node.childNodes.sort((a,b)=> a.data.shOrder - b.data.shOrder);
                  console.log('sortNode after:',node)
              },


            },

        created(){
            this.initPermissionList();
        }

    }

</script>

<style>

</style>
