<template>
    <lrRelationTempl
            :is-show-switch="false"
            :is-enable-switch="true"
            :exchange-text="exchangeText"
            :is-show-save-btn="false"
            :is-show-change-btn="true"
            @exchanage="handleClickExchange">
        <template slot="left">
            <UserDeptTreeCard ref="userDeptCard" :is-show-checkbox="false"  @ClickNode="handleClickUserNode"></UserDeptTreeCard>
        </template>
        <template slot="right">
            <PermissionTreeCard ref="permissionCard" :is-show-checkbox="true" @ClickNode="handleClickPermissionNode"></PermissionTreeCard>
        </template>
    </lrRelationTempl>

</template>

<script>
import lrRelationTempl from './templates/lrRelation'
import PermissionTreeCard  from './components/PermissionTreeCard'
import UserDeptTreeCard from './components/UserDeptTreeCard'


export default
{

    components: {lrRelationTempl, PermissionTreeCard, UserDeptTreeCard},

    data()
    {
        return {
            isUserHavePermission: true,
            exchangeText: '用户拥有权限',
            pCode: '',
            userId: ''
        }
    },

    methods:
    {
        // 切换角色、用户
        handleClickExchange()
        {
            // this.isUserHavePermission = isLeftMaster;
            if (this.isUserHavePermission)
            {
                this.$refs.permissionCard.isShowCheckboxTree = false;
                this.$refs.userDeptCard.isShowCheckboxTree = true;
            }
            else
            {
                this.$refs.userDeptCard.isShowCheckboxTree = false;
                this.$refs.permissionCard.isShowCheckboxTree = true;
            }

            this.isUserHavePermission = !this.isUserHavePermission;
            this.exchangeText = this.isUserHavePermission ? '用户拥有权限' : '权限拥有用户';


            this.pCode = '';
            this.userId = '';
        },



        // 单击权限节点的回调
        handleClickPermissionNode(pCode)
        {
            this.pCode = pCode;
            this.$refs.userDeptCard.getUsersOfPermission(pCode);

        },

        // 单击用户节点的回调
        handleClickUserNode(userData)
        {
            if(userData.nodeType == "2")
            {
                this.userId = userData.code;
                this.$refs.permissionCard.getPermissionsOfUser(this.userId);
            }else{
              this.$refs.permissionCard.setCheckedOffPermissions()
            }
        }
    }

}

</script>
