<template>
    <treeCardTempl>
        <template slot="searchInput">
            <Input placeholder="用户搜索" prefix="ios-search"   v-model="userKeySearch" />
        </template>
        <template slot="tree">
            <template v-if="isShowCheckboxTree">
                <UserDeptTree
                        ref="checkboxUserDeptTree"
                        :is-show-checkbox="true"
                        key="CheckboxVisible" >
                </UserDeptTree>
            </template>
            <template v-else>
                <UserDeptTree
                        ref="userDeptTree"
                        :is-show-checkbox="false"
                        @ClickNode="handleClickUser"
                        key="CheckboxHidden" ></UserDeptTree>
            </template>
        </template>
    </treeCardTempl>
</template>

<script>
import treeCardTempl from '../templates/treeCard'
import UserDeptTree from '../trees/UserDeptTree'
import {getUsersOfRole,getUsersOfPermission} from '@/api/user-management/userManagement.js'


export default
{
    components:
    {
        treeCardTempl,UserDeptTree
    },

    props:
    {
      isShowCheckboxTree:{ type:Boolean, default:false }
    },
    data()
    {
        return {
            refUserDeptTree: null,
            userKeySearch:''

        }
    },

    methods:
    {
        handleClickUser(nodeData, node, nodeEle)
        {

            this.$emit('ClickNode',nodeData);  //向父组件传递
        },



        // 获取某个角色拥有的用户
        getUsersOfRole(roleCode)
        {
            getUsersOfRole(roleCode).then
            (
                (res) =>
                {

                    if(res.status === 200)
                    {
                        if(res.data.length)
                        {
                            this.refUserDeptTree.setCheckedKeys(res.data);
                            //bus.$emit('SetCheckedKeys',res.data);
                        }
                        else
                        {
                          this.$Message.warning('此角色未设置权限哦');
                            this.setCheckedOffUsers();
                        }
                    }
                }
            )
            .catch
            (

                (error) =>
                {
                    console.log(error);
                    this.setCheckedOffPermissions();
                }
            )
        },

        //  获取某个权限拥有的用户
        getUsersOfPermission(pCode)
        {
            getUsersOfPermission(pCode).then
            (
                (res) =>
                {

                    if(res.status === 200)
                    {
                        if(res.data.length)
                        {
                            this.refUserDeptTree.setCheckedKeys(res.data);
                            //bus.$emit('SetCheckedKeys',res.data);
                        }
                        else
                        {
                            this.$Message.warning('此权限未设置用户哦');
                            this.setCheckedOffUsers();
                        }
                    }
                }
            )
            .catch
            (

                (error) =>
                {
                    console.log(error);
                    this.setCheckedOffPermissions();
                }
            )
        },

        // 取消当前选择的用户
        setCheckedOffUsers()
        {
            let roleCodes =  this.refUserDeptTree.getCheckedKeys();
            if(roleCodes.length)
            {
                roleCodes.forEach((item)=>{ this.refUserDeptTree.setChecked(item,false,false); });
            }
        },


        // 刷新userDeptTree
        refreshUserDeptTree()
        {
            this.refUserDeptTree = this.isShowCheckboxTree ? this.$refs.checkboxUserDeptTree.$children[0] : this.$refs.userDeptTree.$children[0];
        }

    },

    watch:
    {
        userKeySearch(val)
        {
            this.refUserDeptTree.filter(val);
        },

    },
    created()
    {
       // console.log('userDeptCard created');
    },

    updated()
    {
       // console.log("userDeptCard updated");
        this.refreshUserDeptTree();
    },

    mounted()
    {
       // console.log('userDeptCard mounted')
        this.refreshUserDeptTree();
    },

    destroyed()
    {
      //  console.log('userDeptCard destroyed');
    }




}



</script>
