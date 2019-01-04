<template>
    <treeCardTempl>
        <template slot="searchInput">
                <Input placeholder="权限搜索" search  v-model="permissionKeySearch" ></Input>
        </template>
        <template slot="topBtns">
                <Button plain @click="handleAddPermission" type="primary" :disabled="isDisabledManagementBtns"><Icon type="md-lock" />新增顶级权限</Button>
               <Button plain @click="handleEditPermission" type="primary" :disabled="isDisabledManagementBtns"><Icon type="md-create" />编辑</Button>
                <Button plain @click="handleDeletePermission" type="error" :disabled="isDisabledManagementBtns"><Icon type="ios-trash" />删除</Button>
        </template>

        <template slot="tree">
                <template v-if="isShowCheckboxTree">
                    <PermissionTree
                            key="CheckboxVisible"
                            ref="CheckboxPermissionTree"
                            :is-show-checkbox="true"
                            :is-draggable="false">
                    </PermissionTree>
                </template>
                <template v-else>
                    <PermissionTree
                            key="CheckboxHidden"
                            ref="permissionTree"
                            :is-show-checkbox="false"
                            :is-draggable="true"
                            @ClickNode="handleClickPermission"
                            @DropNode="handleDropSuccessPermission">
                    </PermissionTree>
                </template>
        </template>
      <!--权限信息-->
      <Modal @on-visible-change="stateChange('permissionInfoForm')" v-model="isShowPermissionInfo" width="660px">
        <Modal v-model="isShowPopPermissionTree" width="400px">
          <h2 slot="header" style="color:#17233d;text-align:center">
            请选择上级权限
          </h2>
          <PermissionTree v-if="isShowPopPermissionTree"
                          ref="popPermissionTree"
                          :is-show-checkbox="false"
                          @ClickNode="handleClickPopPermission" >
          </PermissionTree>
          <div slot="footer">
            <Button @click="handlePopPermissionBtn('cancle')">取消</Button>
            <Button @click="handlePopPermissionBtn('ok')">确定</Button>
          </div>
        </Modal>
        <h2 slot="header" style="color:#17233d;text-align:center">
          {{operationText}}
        </h2>
        <Form :model="permissionInfo" label-position="right" :label-width="80" :rules="permissionRules" ref="permissionInfoForm">
          <!--<FormItem label="创建时间" prop="createTime">
            <DatePicker type="date" placeholder="请选择时间" v-model="permissionInfo.createTime"></DatePicker>
          </FormItem>-->
          <FormItem label="权限名称" prop="pname">
            <Input v-model.trim="permissionInfo.pname"></Input>
          </FormItem>
          <FormItem label="权限代码" prop="pcode">
            <Input v-model.trim="permissionInfo.pcode"></Input>
          </FormItem>
          <FormItem label="上级权限">
            <Input style="width: 93%; float: left" v-model="permissionInfo.parentName" disabled class="dialog-form-item__parentPermission"></Input>
            <div class="dialog-form-item__tree" @click="showPermissionDialog"><i style="float: right;font-size: 22px;" class="iconfont icon-zuzhijigou"></i></div>
          </FormItem>
          <FormItem label="权限类型">
            <RadioGroup v-model="permissionInfo.type">
              <Radio label="menu">菜单</Radio>
              <Radio label="link">链接</Radio>
              <Radio label="button">按钮</Radio>
              <Radio label="function">功能</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="图标" prop="图标">
            <Input v-model.trim="permissionInfo.img"></Input>
          </FormItem>
          <FormItem label="对应的url" prop="url">
            <Input v-model.trim="permissionInfo.url"></Input>
          </FormItem>
          <FormItem label="排序" prop="shOrder">
            <Input v-model.trim="permissionInfo.shOrder"></Input>
          </FormItem>
          <!--<FormItem label="更新时间" prop="updateTime">
            <DatePicker type="date" placeholder="请选择时间" v-model="permissionInfo.updateTime"></DatePicker>
          </FormItem>-->
        </Form>
        <div slot="footer">
          <Button @click="handlePermissionInfoBtn('cancle')">取消</Button>
          <Button @click="handlePermissionInfoBtn('ok')">确定</Button>
        </div>
      </Modal>

    </treeCardTempl>
</template>

<script>
    import treeCardTempl from '../templates/treeCard'
    import PermissionTree from '@/components/trees/PermissionTree'
    import { isValidNumber } from '@/libs/validate.js'
    import { addPermission, delPermission, permissionsDetaile, updatePermission, getPermissionsOfRole } from '@/api/user-management/permissionManagement.js'
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
        components: {
          treeCardTempl,
          PermissionTree
        },

        props:['isShowCheckbox'],

        data()
        {
            return {
                isShowPopPermissionTree: false,
                isShowPermissionInfo: false, //是否显示权限信息对话框
                permissionList: [], //存放权限数据
                isTreeLoading: true,
                refPermissionTree:null,             //子组件:权限树的vue实例引用
                isShowCheckboxTree:false,
                clickedPermissionNode: '',
                permissionKeySearch: '',            //搜索权限关键字
                isDisabledManagementBtns:false,      // 管理按钮是否disabled
                operationText:'',                   // 操作类型 增加、编辑
                permissionInfo: {
                  //createTime: '',
                  pname: '',
                  pcode:'',
                  parentId: '',
                  parentName: '',
                  url: '',
                  status: '1',
                  type: 'menu',
                  shOrder: null
                  //updateTime: ''
                },
                newParentPermissionData: '', //新增或编辑节点时选择的父节点',
                newParentPermissionNode:'',          //增加或编辑节点时选择的父节点
                permissionCodeInputDisabled: true,  // 权限代码输入框是否可编辑
                refPopPermissionTree:'',
                isShowPopPermissionTree: false,     // 权限信息表单中的权限树是否显示

                //权限表单验证规则
                permissionRules: {
                  pname: [{required: true, message: '请输入权限名称', trigger: 'blur'}],
                  pcode: [{required: true, message: '请输入权限代码', trigger: 'blur'}],
                    // parentPermission: [{ required:true, message:'请选择父级权限', trigger:'blur'}],
                    url: [{required: true, message: '请输入URL', trigger: 'blur'}],
                    shOrder: [{required: true, validator: validNumber, trigger: 'blur'}]
                },
            }
        },

        methods:
        {
            handleClickPermission(nodeData, node, nodeEle)
            {
                //this.newParentPermissionData = nodeData;
                this.clickedPermissionNode = node;
                this.$emit('ClickNode',nodeData.pcode);  //向父组件传递pCode
            },
            handleDropEndPermission(sourceNode,targetNode,position,evt)
            {

                //console.log('handleDropEndPermission')
                //this.$refs.permissionTree.$children[0].setChecked(sourceNode.data.pCode,true,false);
            },


            handleDropSuccessPermission(sourceNode,targetNode,position,evt)
            {
                console.log(sourceNode)

                let shOrder = 1,
                    parentId = '';
                // 成为目标节点的孩子
                if(position === 'inner')
                {
                    shOrder = targetNode.children ? targetNode.children.length : 1;
                    parentId = targetNode.data.pcode;
                }
                else
                {
                    if(targetNode.parent)
                    {
                        parentId = targetNode.parent.data.pcode;
                    }

                    if(position === 'before')
                    {
                        shOrder = targetNode.data.shOrder;
                    }
                    else
                    {
                        shOrder = targetNode.data.shOrder + 1;
                    }
                }

                let params = { pcode: sourceNode.data.pcode, parentId: parentId, shOrder: shOrder};
                permissionAPI.update(params).then
                (
                    (res)=>
                    {
                        if(res.status === 201)
                        {
                            this.$message
                            (
                                {
                                    message:'拖动成功！',
                                    type:'success'
                                }
                            );
                        }
                    }
                );

            },



            /********** 权限信息表单-start ***********/

            // 响应增加权限按钮
            handleAddPermission()
            {

                this.resetPermissionForm();
                this.operationText = '权限信息【新增】';
                this.isShowPermissionInfo = true;
                //this.permissionInfo.parentName = this.clickedPermissionNode ? this.clickedPermissionNode.data.pname : '';
                //this.permissionInfo.parentId = this.clickedPermissionNode ? this.clickedPermissionNode.data.pcode : null;
                this.permissionOperation = 'add';
                this.permissionCodeInputDisabled = false;
                this.newParentPermissionNode = this.clickedPermissionNode;
            },

            // 响应编辑权限按钮
            handleEditPermission()
            {
                if (this.clickedPermissionNode)
                {
                    this.operationText = '权限信息【详情】';
                    this.getPermissionInfo(this.clickedPermissionNode.data.pcode);  // 获取权限详细信息
                    this.newParentPermissionNode = this.clickedPermissionNode.parent;
                    console.log('handleEditPermission',this.newParentPermissionNode)
                }
                else
                {
                  this.$Message.warning('请单击选定一个权限');
                }
            },

            // 获取一个权限详情
            getPermissionInfo(pcode)
            {
              permissionsDetaile(pcode).then
                (
                    (res) =>
                    {
                        console.log(res);
                        if(res.status === 200)
                        {
                            this.permissionInfo = res.data;
                            this.permissionInfo.parentName = this.clickedPermissionNode.parent ? this.clickedPermissionNode.parent.label : '';
                            this.permissionCodeInputDisabled = true;
                            this.isShowPermissionInfo = true;
                            this.permissionOperation = 'update';
                        }
                        else
                        {
                            this.$Message.error('获取权限信息失败')
                        }
                    }
                );
            },


            // 响应删除权限按钮
            handleDeletePermission()
            {
                var _this = this
                if (this.clickedPermissionNode)
                {
                    if (this.clickedPermissionNode.isLeaf)
                    {
                      this.$Modal.confirm({
                        title: '删除部门',
                        content: `您确定要删除权限【${this.clickedPermissionNode.data.pname}】?`,
                        okText: '确定',
                        cancelText: '取消',
                        onOk() { //确定删除
                          _this.execDeletePermission(_this.clickedPermissionNode)
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
                      this.$Modal.confirm({
                        title: '删除部门',
                        content: `【${this.clickedPermissionNode.data.pname}】权限包含子权限, 是否全部删除?`,
                        okText: '确定',
                        cancelText: '取消',
                        onOk() { //确定删除
                          _this.execDeletePermission(_this.clickedPermissionNode)
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
                }
                else
                {
                    this.$Message.warning("请先单击选定一个权限")
                }
            },
            // 执行删除动作
            execDeletePermission(node) {
              let pcode = node.data.pcode;
              delPermission(pcode).then((res) => {
                  if(res.status === 200) {
                    //this.$refs.permissionTree.$children[0].remove(this.clickedPermissionNode);
                    this.$Message.success(`成功删除权限【${node.data.pname}】！`)
                    //this.clickedPermissionNode.parent.removeChild(this.clickedPermissionNode)
                    //this.permissionInfo.parentName = null
                    //this.clickedPermissionNode = null
                    //this.clickedPermissionNode = ''
                    this.refPermissionTree.remove(this.clickedPermissionNode.data);
                    this.clickedPermissionNode = ''
                  }
                });
              },
            // 显示权限树对话框
            showPermissionDialog() {
                this.isShowPopPermissionTree = true;
            },
            // 响应权限信息框种的按钮：确定/取消
            handlePermissionInfoBtn(type) {
                if(type === 'ok') {
                    this.$refs.permissionInfoForm.validate(
                        (valid) => {
                            if(valid) {
                              this.savePermissionInfo(this.permissionOperation);
                            } else {
                              return false;
                            }
                        }
                    );
                }
                else {
                    this.isShowPermissionInfo = false;
                    this.resetPermissionForm();
                }

            },
            //对话框状态改变时取消验证
            stateChange (permissionInfoForm) {
              this.$refs[permissionInfoForm].resetFields();
            },
            // 保存权限信息, operation: 'add'、'update'
            savePermissionInfo(operation)
            {
                let permissionInfo =
                    {
                        pname: this.permissionInfo.pname,
                        pcode: this.permissionInfo.pcode,
                        parentId: this.permissionInfo.parentId,
                        type: this.permissionInfo.type,
                        url: this.permissionInfo.url,
                        img: this.permissionInfo.img,
                        shOrder: parseInt(this.permissionInfo.shOrder),
                        status: this.permissionInfo.status,
                    };

                console.log('savePermissionInfo',permissionInfo);

                if(operation === 'add')
                {
                  addPermission(permissionInfo).then
                    (
                        (res) =>
                        {
                            console.log(res)
                            if(res.status == 201)
                            {
                                let parentId = permissionInfo.parentId ? permissionInfo.parentId : null;
                              this.refPermissionTree.append(permissionInfo,permissionInfo.parentId);
                              /*if (this.newParentPermissionData !== '') {
                                alert(11)
                                /!*const newChild = JSON.parse(JSON.stringify(permissionInfo))
                                //新增子权限
                                  if (!this.newParentPermissionData.children) {
                                    this.$set(this.newParentPermissionData, 'children', []);
                                  }
                                  this.newParentPermissionData.children.push(permissionInfo)*!/
                                this.refPermissionTree.append(permissionInfo,permissionInfo.parentId);
                              } else{
                                //this.$refs.permissionTree.addNewPermmison(permissionInfo)
                                this.refPermissionTree.append(permissionInfo,permissionInfo.parentId);
                              }*/
                                this.isShowPermissionInfo = false;
                                this.$Message.success('新增成功');
                              this.permissionInfo.parentName = ''
                              this.clickedPermissionNode = ''
                              //this.resetPermissionForm();  //重置表单
                        }
                        }
                    )
                    .catch
                    (
                        (error)=>
                        {
                            console.log("catch");
                            console.log(error);
                            if(error.response)
                            {
                                console.log(error.response);
                            }
                        }
                    )
                }
                else if(operation === 'update')
                {
                  updatePermission(permissionInfo).then
                    (
                        (res) =>
                        {
                            if(res.status == 201)
                            {
                                console.log('update:',this.clickedPermissionNode.parent.data.pcode,permissionInfo.parentId)
                                if(this.clickedPermissionNode.parent.data.pcode == permissionInfo.parentId)
                                {
                                    Object.assign(this.clickedPermissionNode.data,permissionInfo);  //不改变父节点，直接刷新
                                }
                                else
                                {
                                    this.refPermissionTree.remove(this.clickedPermissionNode.data);
                                    this.refPermissionTree.append(permissionInfo,permissionInfo.parentId);
                                }
                                this.$nextTick(()=>{ this.$refs.permissionTree.sortNode(permissionInfo.parentId); });
                                //this.$refs.permissionTree.initPermissionList();
                                this.isShowPermissionInfo = false;
                                this.$Message.success('保存成功');
                              this.resetPermissionForm();
                            }
                        }
                    )
                }
            },



            // 响应关闭权限信息表单
            handleClosePermissionInfo()
            {
                this.resetPermissionForm();
            },

            // 重置权限信息表单
            resetPermissionForm()
            {
                //this.$refs['permissionInfoForm'].resetFields();
                for(let item in this.permissionInfo)
                {
                    this.permissionInfo[item] = '';
                }
                console.log("reset form")
            },
            // 在弹出的权限树上：单击节点
            handleClickPopPermission(nodeData, node, nodeEle)
            {
                this.newParentPermissionData = nodeData;
                this.newParentPermissionNode = node;
            },

            // 在弹出的权限树上：单击按钮
            handlePopPermissionBtn(type)
            {
                this.isShowPopPermissionTree = false;
                console.log(type)
                if (type === 'ok')
                {
                    this.permissionInfo.parentName = this.newParentPermissionNode.data.pname;
                    this.permissionInfo.parentId = this.newParentPermissionNode.data.pcode;
                    console.log(this.permissionInfo)
                }
            },

            /************ 权限信息表单-end *********/


            // 获取某个角色拥有的权限
            getPermissionsOfRole(roleCode)
            {
               // console.log(this.$refs.CheckboxPermissionTree)
                getPermissionsOfRole(roleCode).then
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
                                this.$Message.info('此角色未设置权限哦');
                                this.setCheckedOffPermissions();
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


            // 取消当前选择的权限
            setCheckedOffPermissions()
            {
                let pcodes =  this.refPermissionTree.getCheckedKeys();
                if(pcodes.length)
                {
                  pcodes.forEach((item)=>{this.refPermissionTree.setChecked(item,false,false);})
                }
            },

            // 刷新refPermissionTree
            refreshRefPermisson()
            {
                this.refPermissionTree = this.isShowCheckboxTree ? this.$refs.CheckboxPermissionTree.$children[0] : this.$refs.permissionTree.$children[0];
            },


        },

        computed:
        {

        },

        watch:
        {
            permissionKeySearch(val)
            {
                this.refPermissionTree.filter(val);
            }
        },

        created()
        {
            //console.log('PermissionManagement created');

        },

        mounted() {
          this.$nextTick(() => {
            this.refreshRefPermisson();
          })
        },

        updated()
        {
            //console.log("PermissionManagement updated");
          //this.$refs.permissionTree
          console.log(this.$refs.permissionTree)
            this.refreshRefPermisson();
        }

    }
</script>

<style scoped lang="less">
  Button{
    margin-left: 10px;
  }
</style>

