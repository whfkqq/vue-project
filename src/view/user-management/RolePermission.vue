<template>
  <div>
    <lrRelationTempl
      :is-show-switch="true"
      :is-enable-switch="false"
      :exchange-text="exchangeText"
      @watchSwitch="handleWatchSwitch"
      @exchanage="handleClickExchange"
      @saveRelation="handleClickRelation"
      class="role_permission">
      <template slot="left">
        <RoleManagement ref="roleManagement" @ClickNode="handleClickRoleNode"></RoleManagement>
      </template>
      <template slot="right">
        <PermissionManagement ref="permissionManagement" @ClickNode="handleClickPermissionNode"></PermissionManagement>
      </template>
    </lrRelationTempl>
  </div>


</template>

<script>
import lrRelationTempl from './templates/lrRelation'
import RoleManagement  from './components/RoleManagement'
import PermissionManagement from './components/PermissionManagement'
import { setRolesOfPermission} from '@/api/user-management/roleManagement.js'
import { setPermissionsOfRole } from '@/api/user-management/permissionManagement.js'
export default
{

    components:{ lrRelationTempl,RoleManagement,PermissionManagement },

    data()
    {
        return {
            isEnableOperation: false,
            isRoleHavePermission:true,
            exchangeText:'角色拥有权限',
            roleCode:'',
          pcode:''
        }
    },

    methods:
    {
        // 切换角色、权限
        handleClickExchange()
        {
           // this.isRoleHavePermission = isLeftMaster;
            if(this.isRoleHavePermission)
            {
                this.$refs.permissionManagement.isShowCheckboxTree = false;
                this.$refs.roleManagement.isShowCheckboxTree = true;
            }
            else
            {
                this.$refs.permissionManagement.isShowCheckboxTree = true;
                this.$refs.roleManagement.isShowCheckboxTree = false;
            }

            this.isRoleHavePermission = !this.isRoleHavePermission;
            this.exchangeText = this.isRoleHavePermission ? '角色拥有权限' : '权限拥有角色';


            this.roleCode = '';
            this.pcode = '';
        },


        // 保存隶属关系
        handleClickRelation()
        {
            if(this.isRoleHavePermission)
            {
                let pcodes =  this.$refs.permissionManagement.refPermissionTree.getCheckedKeys();
                console.log(pcodes);
                if(pcodes.length == 0)
                {
                    this.$message
                    (
                        {
                            message: '您还没有选择权限哦',
                            type:'warning'
                        }
                    )
                }
                else if(this.roleCode == '')
                {
                    this.$message
                    (
                        {
                            message: '您还没有选定角色哦',
                            type:'warning'
                        }
                    )
                }
                else
                {
                  let permissionOfRole = {
                    roleCode:this.roleCode, pcodeList:pcodes
                  }
                  setPermissionsOfRole(permissionOfRole).then
                    (
                        (res)=>
                        {
                            console.log(res)
                            if(res.status === 201)
                            {
                               this.$Message.success('保存成功')
                            }
                        }
                    );
                }

            }
            else
            {
                let roleCodes =  this.$refs.roleManagement.refRoleTree.getCheckedKeys();
                console.log(roleCodes);
                if(roleCodes.length == 0)
                {
                    this.$Message.info('您还没有选择角色哦')
                }
                else if(this.pcode == '')
                {
                    this.$Message.info('您还没有选定权限哦')
                }
                else
                {
                  let roleOfPermission = {
                    pcode:this.pcode, roleCodeList:roleCodes
                  }
                  setRolesOfPermission(roleOfPermission).then
                    (
                        (res)=>
                        {
                            console.log(res)
                            if(res.status === 201)
                            {
                                this.$Message.success('保存成功')
                            }
                        }
                    );
                }
            }
        },


        // 单击角色节点的回调
        handleClickRoleNode(roleCode)
        {
            console.log('handleClickRoleNode',roleCode);
            if(this.isEnableOperation)
            {
                this.roleCode = roleCode;
                this.$refs.permissionManagement.getPermissionsOfRole(roleCode);
            }
        },

        // 单击权限节点的回调
        handleClickPermissionNode(pcode)
        {
            console.log('handleClickPermissionNode',pcode);
            if(this.isEnableOperation)
            {
                this.pcode = pcode;
                this.$refs.roleManagement.getRolesOfPermission(pcode);
            }
        },

        // 状态开关的回调
        handleWatchSwitch(isEnableOperation)
        {
            this.isEnableOperation = isEnableOperation;
            // 显示/隐藏 树节点的checkbox
            if(this.isRoleHavePermission)
            {
                this.$refs.permissionManagement.isShowCheckboxTree = this.isEnableOperation ? true:false;
            }
            else
            {
                this.$refs.roleManagement.isShowCheckboxTree = this.isEnableOperation ? true:false;
            }

            // 设置管理按钮的disabled及权限树的可拖放属性
            if(this.isEnableOperation)
            {
                this.$refs.roleManagement.isDisabledManagementBtns = true;
                this.$refs.permissionManagement.isDisabledManagementBtns = true;
            }
            else
            {
                this.$refs.roleManagement.isDisabledManagementBtns = false;
                this.$refs.permissionManagement.isDisabledManagementBtns = false;
                this.roleCode = '';
                this.pcode = '';
            }
        }

    }

}

</script>


<style lang="less">
.role_permission
{
    /**
  以下为重置element-ui的默认css
  权限管理和角色管理 页面使用
 **/

    //表单每行的值所在div
    .el-form-item__content
    {
        width:70%;
    }

    .el-dialog__footer
    {
        text-align: center;
    }

}

</style>
