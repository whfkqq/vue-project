<template>
    <treeCardTempl>
        <template slot="searchInput">
            <Input placeholder="权限搜索"   prefix="ios-search"  v-model="permissionKeySearch" />
        </template>


        <template slot="tree">
            <template v-if="isShowCheckboxTree">
                <PermissionTree
                        ref="checkboxPermissionTree"
                        key="CheckboxVisible"
                        :is-show-checkbox="true"
                        :is-draggable="false">
                </PermissionTree>
            </template>
            <template v-else>
                <PermissionTree
                        ref="permissionTree"
                        key="CheckboxHidden"
                        :is-show-checkbox="false"
                        :is-draggable="false"
                        @ClickNode="handleClickPermission">
                </PermissionTree>
            </template>
        </template>

    </treeCardTempl>
</template>

<script>

import treeCardTempl from '../templates/treeCard'
import PermissionTree from '../trees/PermissionTree'
import {getPermissionsOfUser}  from '@/api/user-management/permissionManagement.js'


export default
{
    components:
    {
        treeCardTempl, PermissionTree
    },

    props:
    {
        isShowCheckbox:{ type:Boolean, default:true }
    },

    data()
    {
        return {

            isShowCheckboxTree:true,
            permissionKeySearch:'',
            roleTree:null,
        }
    },

    methods:
    {

        handleClickPermission(nodeData, node, nodeEle)
        {
            //console.log('handleClickRole', node);
            this.$emit('ClickNode', nodeData.pcode);  //向父组件传递roleCode

        },

        // 获取某个用户拥有的权限
        getPermissionsOfUser(userId)
        {

            getPermissionsOfUser(userId).then
            (
                (res) =>
                {
                    console.log(res)
                    if(res.status === 200)
                    {
                        if(res.data.length)
                        {
                            this.refPermissionTree.setCheckedKeys(res.data);
                        }
                        else
                        {
                            this.$Message.warning('此用户未设置权限哦');
                            this.setCheckedOffPermissions();
                        }
                    }
                }
            )
            .catch
            (
                (error) => { this.setCheckedOffPermissions(); }
            )


        },


        // 取消当前选择的权限
        setCheckedOffPermissions()
        {

            let pCodes =  this.refPermissionTree.getCheckedKeys();
            if(pCodes.length)
            {
                pCodes.forEach((item)=>{ this.refPermissionTree.setChecked(item,false,false); } )
            }
        },

        // 刷新refPermissionTree
        refreshrefPermissionTree()
        {
            this.refPermissionTree = this.isShowCheckboxTree ? this.$refs.checkboxPermissionTree.$children[0] : this.$refs.permissionTree.$children[0];
        }


    },
    watch:
    {
        roleKeySearch(val)
        {
            this.refPermissionTree.filter(val);
        },

    },

    created()
    {
        //console.log('permission tree card,created');
        this.isShowCheckboxTree =   this.isShowCheckbox;
    },

    mounted()
    {

        this.refreshrefPermissionTree();
    },

    updated()
    {
        //console.log('permission tree card,updated');
        this.refreshrefPermissionTree();
    },

    destroyed()
    {
       // console.log('permission tree card, destroyed');
    }


}

</script>

