<template>
  <treeCardTempl>
    <template slot="searchInput">
      <Input placeholder="角色搜索" prefix="ios-search" v-model="roleKeySearch"/>
    </template>


    <template slot="tree">
      <template v-if="isShowCheckboxTree">
        <RoleTree
          ref="checkboxRoleTree"
          :is-show-checkbox="true"
          :is-draggable="false"
          key="CheckboxVisible">
        </RoleTree>
      </template>
      <template v-else>
        <RoleTree
          ref="roleTree"
          :is-show-checkbox="false"
          :is-draggable="false"
          v-on:ClickNode="handleClickRole"
          key="CheckboxHidden">
        </RoleTree>
      </template>
    </template>


  </treeCardTempl>

</template>

<script>

  import {getRolesOfUser} from '@/api/user-management/roleManagement.js'
  import RoleTree from '../trees/RoleTree'
  import treeCardTempl from '../templates/treeCard'


  export default {
    components:
      {
        treeCardTempl, RoleTree
      },
    props:
      {
        isShowCheckboxTree:{ type:Boolean, default:false }
      },

    data() {
      return {
        roleKeySearch: '',
        refRoleTree: null,
      }
    },

    methods:
      {

        handleClickRole(nodeData, node, nodeEle) {

          this.clickedRoleNode = node;
          this.$emit('ClickNode', nodeData.roleCode);  //向父组件传递roleCode
        },

        // 获取某个用户拥有的角色
        getRolesOfUser(userId) {

          getRolesOfUser(userId).then
          (
            (res) => {

              if (res.status === 200) {
                if (res.data.length) {
                  this.refRoleTree.setCheckedKeys(res.data);
                }
                else {
                  this.$Message.warning('此用户未设置角色哦');
                  this.setCheckedOffRoles();
                }
              }
            }
          )
            .catch
            (
              (error) => {
                this.setCheckedOffRoles();
              }
            )


        },


        // 取消当前选择的角色
        setCheckedOffRoles() {
          let roleCodes = this.refRoleTree.getCheckedKeys();
          if (roleCodes.length) {
            roleCodes.forEach((item) => {
              this.refRoleTree.setChecked(item, false, false);
            })
          }
        },

        // 刷新refRoleTree
        refreshRefRoleTree() {
          this.refRoleTree = this.isShowCheckboxTree ? this.$refs.checkboxRoleTree.$children[0] : this.$refs.roleTree.$children[0];
        }


      },

    watch:
      {
        roleKeySearch(val) {
          this.refRoleTree.filter(val);
        },

      },

    created() {
      //console.log('Role Card ,created');
    },


    updated() {
      //console.log("Role Card updated");
      this.refreshRefRoleTree();
    },

    mounted() {
      //console.log('Role card mounted')
      this.refreshRefRoleTree();
    },

    destroyed() {
      //console.log('Role card, destroyed');
    }

  }

</script>
