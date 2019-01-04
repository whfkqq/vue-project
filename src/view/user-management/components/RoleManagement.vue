<template>
    <treeCardTempl>
        <template slot="searchInput">
            <Input placeholder="角色搜索" search  v-model="roleKeySearch" ></Input>
        </template>

        <template slot="topBtns">
          <Button plain @click="handleAddRole" type="primary" :disabled="isDisabledManagementBtns"><Icon type="md-person-add" />新增顶级角色</Button>
          <Button plain @click="handleEditRole" type="primary"  :disabled="isDisabledManagementBtns"><Icon type="md-create" />编辑</Button>
          <Button plain @click="handleDeleteRole" type="error"  :disabled="isDisabledManagementBtns"><Icon type="ios-trash" />删除</Button>
        </template>

        <template slot="tree">
            <template v-if="isShowCheckboxTree">
                <RoleTree
                        ref="checkboxRoleTree"
                        key="CheckboxVisible"
                        :is-show-checkbox="true"
                        :is-draggable="false">
                </RoleTree>
            </template>
            <template v-else>
                <RoleTree ref="roleTree"
                          key="CheckboxHidden"
                          :is-show-checkbox="false"
                          :is-draggable="false"
                          @ClickNode="handleClickRole">
                </RoleTree>
            </template>
        </template>
      <!--角色信息-->
      <Modal v-model="roleInfoModal" width="660px">
        <h2 slot="header" style="color:#17233d;text-align:center">
          {{operationText}}
        </h2>
        <Form :model="roleInfo" label-position="right" :label-width="80" :rules="roleRules" ref="roleInfoForm">
          <FormItem label="创建时间" prop="createTime">
                  <DatePicker type="date" placeholder="请选择时间" v-model="roleInfo.createTime"></DatePicker>
          </FormItem>
          <FormItem label="角色名称" prop="roleName">
            <Input v-model.trim="roleInfo.roleName"></Input>
          </FormItem>
          <FormItem label="角色代码" prop="roleCode">
            <Input v-model.trim="roleInfo.roleCode" :disabled="roleCodeInputDisabled"></Input>
          </FormItem>
          <FormItem label="角色类型">
            <RadioGroup v-model="roleInfo.roleType">
              <Radio label="1" disabled>授权角色</Radio>
              <Radio label="2" disabled>管理员角色</Radio>
              <Radio label="3" disabled>流程角色</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="更新时间" prop="updateTime">
              <DatePicker type="date" placeholder="请选择时间" v-model="roleInfo.updateTime"></DatePicker>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="handleRoleInfoBtn('cancle')">取消</Button>
          <Button @click="handleRoleInfoBtn('ok')">确定</Button>
        </div>
      </Modal>
    </treeCardTempl>

</template>

<script>
    import RoleTree  from '@/components/trees/RoleTree'
    import treeCardTempl from '../templates/treeCard'
    import { isValidNumber } from '@/libs/validate'
    import { addRole, delRole, updateRole, getRolesOfPermission } from '@/api/user-management/roleManagement.js'
    var validNumber = (rule, value, callback) =>
    {
        if (!value)
        { callback(new Error('请输入排序数字')); }
        else if (!isValidNumber(value))
        { callback(new Error('请输入正确的数字')); }
        else
        { callback(); }
    };

    export default
    {
        components:
        {
            treeCardTempl,RoleTree
        },

        data()
        {
            return {
                roleList: [],                   //角色列表
                roleKeySearch: '',              //搜索角色关键字
                isShowCheckboxTree:false,
                isDisabledManagementBtns:false,     //管理按钮是否disabled
                refPermissionTree:null,             //子组件:权限树的vue实例引用
                operationText:'',
                roleInfoModal: false,
                roleCodeInputDisabled:false,    //角色代码输入框disabled
                roleInfo: {
                  createTime: "",
                  roleCode:"",
                  roleName:"",
                  roleType:"",
                  updateTime: ""
                },
                // 角色表单验证规则
                roleRules:
                    {
                        roleName: [{ required:true, message: '请输入角色名称', trigger:'blur'}],
                        roleCode: [{ required:true, message: '请输入角色代码', trigger:'blur'}],
                      createTime: [{ required: true, type: 'date', message: '请选择时间', trigger: 'change' }],
                      updateTime: [{ required: true, type: 'date', message: '请选择时间', trigger: 'change' }],
                    },

                roleProps:
                    {
                        children: 'children',
                        label: 'roleName'
                    }

            }
        },

        methods:
        {

                handleClickRole(nodeData, node, nodeEle)
                {
                    console.log('RoleManagement handleClickRole',node);
                    this.clickedRoleNode = node;
                    this.$emit('ClickNode',nodeData.roleCode);  //向父组件传递roleCode
                },

                // 响应增加角色按钮
                handleAddRole()
                {
                    this.operationText = '角色信息【新增】';
                    this.roleInfoModal = true;
                    this.roleOperation = 'add';
                    this.roleInfo.roleType = '';
                    this.roleCodeInputDisabled = false;
                },

                // 响应编辑角色按钮
                handleEditRole()
                {
                    if (this.clickedRoleNode)
                    {
                        this.operationText = '角色信息【详情】';
                        this.roleCodeInputDisabled = true;
                        this.roleInfoModal = true;
                        this.roleOperation = 'update';
                        this.roleInfo.roleName = this.clickedRoleNode.data.roleName;
                        this.roleInfo.roleCode = this.clickedRoleNode.data.roleCode;
                        this.roleInfo.roleType = this.clickedRoleNode.data.roleType;

                    }
                    else
                    {
                      this.$Message.warning('请单击选定一个角色');
                    }
                },

                // 响应删除角色按钮
                handleDeleteRole()
                {
                    var _this = this
                    if (this.clickedRoleNode)
                    {
                        if (this.clickedRoleNode.isLeaf)
                        {
                          this.$Modal.confirm({
                            title: '删除部门',
                            content: `您确定要删除角色【${this.clickedRoleNode.data.roleName}】?`,
                            okText: '确定',
                            cancelText: '取消',
                            onOk() { //确定删除
                              _this.execDeleteRole(_this.clickedRoleNode);
                            },
                            onCancel() {//取消删除
                              this.$Message.info({
                                content: '已取消删除',
                                duration: 1,
                                top: 200,
                              })
                            }
                          })
                        }
                        else
                        {
                          this.$Message.error('此节点不能删除');

                        }
                    }
                    else
                    {
                      this.$Message.warning('请先单击选中一个角色');
                    }
                },
                // 响应角色信息框的按钮：确定/取消
                handleRoleInfoBtn(type) {
                    if(type === 'ok')
                    {
                        this.$refs.roleInfoForm.validate(
                            (valid) =>
                            {
                                if(valid)
                                {
                                    this.saveRoleInfo(this.roleOperation);
                                }
                                else
                                {
                                    return false;
                                }
                            }
                        );
                    }
                    else
                    {
                        this.roleInfoModal = false;
                        this.resetRoleForm();
                    }

                },

                // 保存角色信息, operation: 'add'、'update'
                saveRoleInfo(operation)
                {
                    let roleInfo =
                        {
                            createTime: this.roleInfo.createTime,
                            roleName: this.roleInfo.roleName,
                            roleCode: this.roleInfo.roleCode,
                            roleType: this.roleInfo.roleType,
                          updateTime: this.roleInfo.updateTime
                        };

                    console.log(roleInfo);

                    if(operation === 'add')
                    {
                      addRole(roleInfo).then
                        (
                            (res) =>
                            {
                                if(res.status == 201)
                                {
                                  //新增顶级角色
                                  this.$refs.roleTree.addNewRole(roleInfo)
                                  //console.log(this.$refs.roleTree.$children[0].append())
                                    //this.$refs.roleTree.$children[0].append(roleInfo,'auth');
                                    this.roleInfoModal = false;
                                }
                            }
                        )
                        .catch
                        (
                            (error)=>
                            {
                                if(error.response)
                                {
                                    console.log(error.response);
                                }
                            }
                        )

                    }
                    else if(operation === 'update')
                    {
                      updateRole(roleInfo).then
                        (
                            (res) =>
                            {
                                console.log(res)
                                if(res.status == 201) {
                                  this.clickedRoleNode.data = roleInfo;
                                  this.$Message.success('保存成功');
                                  this.roleInfoModal = false;
                                }
                            }
                        )
                    }
                },

                // 执行删除动作
                execDeleteRole(node)
                {
                    let roleCode = node.data.roleCode
                  console.log(roleCode)
                    //let param = { roleCode:node.data.roleCode };
                    delRole(roleCode).then
                    (
                        (res) =>
                        {
                            console.log(res)
                            if(res.status === 200)
                            {
                              this.$Message.success(`成功删除角色【${node.data.roleName}】！`);
                              console.log(this.clickedRoleNode)
                              this.clickedRoleNode.parent.removeChild(this.clickedRoleNode)
                              this.clickedRoleNode = ''
                            }
                        }
                    );

                    console.log("delete");
                },

                // 响应关闭角色信息表单
                handleCloseRoleInfo()
                {
                    this.resetRoleForm();
                },

                // 重置角色信息表单
                resetRoleForm()
                {
                    this.$refs.roleInfoForm.resetFields();
                },


                // 获取某个权限拥有的角色
                getRolesOfPermission(pcode)
                {
                  getRolesOfPermission(pcode).then
                    (
                        (res) =>
                        {
                            console.log(res)
                            if(res.status === 200)
                            {
                                if(res.data.length)
                                {
                                    this.refRoleTree.setCheckedKeys(res.data);
                                }
                                else
                                {
                                    this.$Message.info('此权限未设置角色哦');
                                    this.setCheckedOffRoles();
                                }
                            }
                        }
                    )
                    .catch
                    (
                        (error) => { this.setCheckedOffRoles(); }
                    )
                },



                // 取消当前选择的角色
                setCheckedOffRoles()
                {
                    let roleCodes =  this.refRoleTree.getCheckedKeys();
                    if(roleCodes.length)
                    {
                        roleCodes.forEach((item)=>{this.refRoleTree.setChecked(item,false,false);})
                    }
                },

                // 刷新refRoleTree
                refreshRefRoleTree()
                {
                    this.refRoleTree = this.isShowCheckboxTree ? this.$refs.checkboxRoleTree.$children[0] : this.$refs.roleTree.$children[0];
                }

            },

        watch:
        {
            roleKeySearch(val)
            {
                this.$refs.roleTree.$children[0].filter(val);
            },

        },

        updated()
        {
            console.log("RoleManagement updated");
            this.refreshRefRoleTree();
        },

        mounted()
        {
            console.log('RoleManagment mounted')
            this.refreshRefRoleTree();
            console.log(this.$refs.roleTree)
        }

    }


</script>

<style scoped lang="less">
  Button{
    margin-left: 10px;
  }
</style>

