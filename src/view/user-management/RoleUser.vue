<template>
  <lrRelationTempl
    :is-show-switch="false"
    :is-enable-switch="true"
    :exchange-text="exchangeText"
    :is-show-change-btn="true"
    @exchanage="handleClickExchange" @saveRelation="handleClickRelation">
    <template slot="left">
      <UserDeptTreeCard ref="userDeptCard" @ClickNode="handleClickUserNode" :isShowCheckboxTree="!isShowRightCheckbox"></UserDeptTreeCard>
    </template>
    <template slot="right">
      <RoleTreeCard ref="roleCard" @ClickNode="handleClickRoleNode" :isShowCheckboxTree="isShowRightCheckbox"></RoleTreeCard>
    </template>
  </lrRelationTempl>

</template>

<script>
  import lrRelationTempl from './templates/lrRelation'
  import RoleTreeCard from './components/RoleTreeCard'
  import UserDeptTreeCard from './components/UserDeptTreeCard'
  import {setRolesOfUser} from '@/api/user-management/roleManagement.js'
  import {setUsersOfRole} from '@/api/user-management/userManagement.js'

  export default {

    components: {lrRelationTempl, RoleTreeCard, UserDeptTreeCard},

    data() {
      return {
        isUserHaveRole: true,
        exchangeText: '用户拥有角色',
        isShowRightCheckbox:true,
        roleCode: '',
        userId: ''
      }
    },

    methods:
      {
        // 切换角色、用户
        handleClickExchange() {
          this.isShowRightCheckbox=!this.isShowRightCheckbox
          this.isUserHaveRole = !this.isUserHaveRole;
          this.exchangeText = this.isUserHaveRole ? '用户拥有角色' : '角色拥有用户' ;

          this.roleCode = '';
          this.userId = '';
        },


        // 保存隶属关系
        handleClickRelation() {

          if (this.isUserHaveRole) {
            let roleCodes = this.$refs.roleCard.refRoleTree.getCheckedKeys();
            console.log("roleUser==============用户拥有角色");
            //console.log(roleCodes);

            if (this.userId == '') {
              this.$Message.warning('您还没有选定用户哦');
            }
            else if (roleCodes.length == 0) {
              this.$Message.warning('您还没有选择角色哦');

            }
            else {
              setRolesOfUser(this.userId, roleCodes).then
              (
                (res) => {
                  if (res.status === 201) {
                    this.$Message.success('保存成功');
                  }
                }
              );
            }

          } else{
            let nodes = this.$refs.userDeptCard.refUserDeptTree.getCheckedNodes();
            console.log("roleUser==============角色拥有用户");
            // console.log(nodes);

            let userIds = [];
            if (nodes.length == 0) {
              this.$Message.warning('您还没有选择权限哦');
            }
            else if (this.roleCode == '') {
              this.$Message.warning('您还没有选定角色哦');
            }
            else {
              for (let node of nodes) {
                if (node.nodeType == "2") {
                  userIds.push(node.code);
                }
              }

              if (userIds.length) {
                setUsersOfRole(this.roleCode, userIds).then
                (
                  (res) => {
                      if (res.status === 201) {
                        this.$Message.success('保存成功');
                      }
                    }
                );


              }
              else {
                this.$Message.warning('您没有选择用户哦');
              }

            }

          }





        },


        // 单击角色节点的回调
        handleClickRoleNode(roleCode) {

          this.roleCode = roleCode;
          this.$refs.userDeptCard.getUsersOfRole(roleCode);

        },

        // 单击用户节点的回调
        handleClickUserNode(userData) {

          if (userData.nodeType == '2') {
            this.userId = userData.code;
            this.$refs.roleCard.getRolesOfUser(this.userId);
          }else{
            this.userId = ''
            this.$refs.roleCard.refRoleTree.setCheckedKeys(new Array);
          }
        }
      }

  }

</script>
<style>

</style>
