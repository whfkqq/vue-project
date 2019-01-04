<template>
    <div class="permission-tree-container">
        <chu-tree v-show="!isLoadingData"
                :render-content="renderContent"
                ref="permissionTree"
                node-key="pcode"
                :data="permissionList"
                :props="defaultProps"
                :draggable="isDraggable"
                :show-checkbox="isShowCheckbox"
                :check-strictly="false"
                :expand-on-click-node="false"
                :check-on-click-node="true"
                :default-expanded-keys="[1]"
                :filter-node-method="filterPermissionNode"
                :default-expand-all="true"
                @node-click="handleClickPermission"
                @node-drop="handleDropSuccessPermission">
        </chu-tree>
        <div v-show="isLoadingData" class="loading_wrapper">
          <Spin fix>
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
          </Spin>
        </div>
      <!--新增权限的对话框-->
      <Modal @on-visible-change="stateChange('permissionInfoForm')" :draggable="true"  v-model="isShowPermissionInfo" width="660px">
        <!--选择上级权限对话框-->
        <Modal :closable="false" :draggable="true"  v-model="isShowPopPermissionTree" width="400px">
          <h2 slot="header" style="color:#17233d;text-align:center">
            请选择上级权限
          </h2>
          <Input placeholder="权限搜索" search  v-model="permissionKeySearch" ></Input>
          <div class="permission-tree-container">
            <chu-tree ref="chooseParentPermission"
                       :render-content="renderContent"
                       :data="permissionList"
                       :props="defaultProps"
                       :draggable="isDraggable"
                       :check-strictly="false"
                       :expand-on-click-node="false"
                       :check-on-click-node="true"
                       :default-expanded-keys="[1]"
                       :filter-node-method="filterPermissionNode"
                       :default-expand-all="true"
                       @node-click="handleClickPopPermission" >
            </chu-tree >
          </div>
          <div slot="footer">
            <Button @click="handlePopPermissionBtn('cancle')">取消</Button>
            <Button @click="handlePopPermissionBtn('ok')">确定</Button>
          </div>
        </Modal>
        <h2 slot="header" style="color:#17233d;text-align:center">
          {{operationText}}
        </h2>
        <Form :model="permissionInfo" label-position="right" :label-width="80" :rules="permissionRules" ref="permissionInfoForm">
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
        </Form>
        <div slot="footer">
          <Button @click="handlePermissionInfoBtn('cancle')">取消</Button>
          <Button @click="handlePermissionInfoBtn('ok')">确定</Button>
        </div>
      </Modal>
    </div>

</template>


<script>
    import { parseTree } from '@/libs/util'
    import { isValidNumber } from '@/libs/validate.js'
    import {getAllPermissions, addPermission, delPermission, permissionsDetaile, updatePermission } from '@/api/user-management/permissionManagement.js'
    var validNumber = (rule, value, callback) => {
      if (!value)
      { callback(new Error('请输入排序数字')); }
      else if (!isValidNumber(value))
      { callback(new Error('请输入正确的数字')); }
      else
      { callback(); }
    };
    export default
    {
        name: 'RoleTree',
        props: {
          isShowCheckbox:Boolean,
          isDraggable: {
            type:Boolean,
            default:true
          }
        },
        data() {
          return {
            permissionKeySearch: '',//搜索关键字
            currentData: '',//当前节点
            permissionParentName: '', //上级权限名称
            //权限信息
            permissionInfo: {
              pname: '',
              pcode:'',
              parentId: '',
              parentName: '',
              url: '',
              status: '1',
              type: 'menu',
              shOrder: null
            },
            operationText: '默认标题',//默认标题
            isShowPermissionInfo: false, // 是否显示全新信息
            //权限表单验证规则
            permissionRules: {
              pname: [{required: true, message: '请输入权限名称', trigger: 'blur'}],
              pcode: [{required: true, message: '请输入权限代码', trigger: 'blur'}],
              url: [{required: true, message: '请输入URL', trigger: 'blur'}],
              shOrder: [{required: true, validator: validNumber, trigger: 'blur'}]
            },
            isLoadingData: true,
            permissionList: [],
            defaultProps: {
              children: 'children',
              label: 'pname'
            },
            clickedPermissionNode:'',
            isShowPopPermissionTree: false, //是否显示选择上级权限对话框
            newParentPermissionData: '', //新增或编辑节点时选择的父节点',
            newParentPermissionNode:'',  //增加或编辑节点时选择的父节点
            isShowIcons: true, //是否显示编辑图标
            currentNode: '', //当前节点
            }
        },

        methods: {
          //初始化权限数据
          initPermissionList() {
            getAllPermissions()
              .then((res) => {
                  if (res.status == 200) {
                    this.$emit("TreeLoading");
                    this.isLoadingData = false;
                    this.permissionList = parseTree(res.data.items, null, "pcode", "shOrder");
                  }
                })
          },
          //新增顶级权限
          addNewPermmison (pInfo) {
            this.permissionList.push(pInfo)
          },
          //新增子权限
          addPermissionNode (node,data,store) {
            this.resetPermissionForm()
            this.currentData = data
            this.operationText = '权限信息【新增】'
            this.permissionInfo.parentName = data.pname
            this.permissionInfo.parentId = data.pcode
            this.isShowPermissionInfo =  true
            this.permissionOperation = 'add';
          },
          //响应权限信息框按钮：确定/取消
          handlePermissionInfoBtn(type) {
            if(type === 'ok') {
              this.$refs.permissionInfoForm.validate((valid) => {
                if(valid) {
                  this.savePermissionInfo(this.permissionOperation);
                } else {
                  return false;
                }
              });
            } else {
              this.isShowPermissionInfo = false;
              //this.resetPermissionForm();
            }
          },
          //权限信息编辑
          editePermissionNode (node,data,store) {
            this.currentNode = node;
            this.currentData = data
            this.operationText = '权限信息【编辑】'
            this.permissionParentName = node.parent.data.pname
            this.getPermissionInfo(data.pcode)
          },
          //获取一个权限详情
          getPermissionInfo (pcode) {
            permissionsDetaile(pcode)
              .then((res) => {
                if (res.status == 200) {
                  this.permissionInfo = res.data
                  this.permissionInfo.parentName = this.permissionParentName
                  this.isShowPermissionInfo = true
                  this.permissionOperation = 'update';
                } else{
                  this.$Message.error(`获取权限信息失败:${res.status}-${res.msg}`)
                }
              })
              .catch((error) => {
                  this.$Message.error(`error`)
              })
          },
          //显示选择上级权限对话框
          showPermissionDialog () {
            this.initPermissionList()
            this.isShowPopPermissionTree = true;
            this.isShowIcons = false
          },
          //在弹出的权限树上：单击节点
          handleClickPopPermission (nodeData,node,nodeEle) {
            this.newParentPermissionData = nodeData;
            this.newParentPermissionNode = node;
          },
          //在弹出的权限树上单击按钮：确定、取消
          handlePopPermissionBtn (type) {
            this.isShowIcons = true
            this.isShowPopPermissionTree = false;
            if (type === 'ok') {
              this.permissionInfo.parentName = this.newParentPermissionNode.data.pname;
              this.permissionInfo.parentId = this.newParentPermissionNode.data.pcode;
            }
          },
          //对话框状态改变时取消验证
          stateChange (permissionInfoForm) {
            this.$refs[permissionInfoForm].resetFields();
          },
          //保存权限信息
          savePermissionInfo (operation) {
            let permissionInfo = {
              pname: this.permissionInfo.pname,
              pcode: this.permissionInfo.pcode,
              parentId: this.permissionInfo.parentId,
              type: this.permissionInfo.type,
              url: this.permissionInfo.url,
              img: this.permissionInfo.img,
              shOrder: parseInt(this.permissionInfo.shOrder),
              status: this.permissionInfo.status,
            }
            if (operation == 'add') {
               addPermission(permissionInfo)
                 .then((res) => {
                   if (res.status == 201) {
                     const newChild = JSON.parse(JSON.stringify(permissionInfo))//{ roleCode: this.roleInfoForm.roelCode, roleName: this.roleInfoForm.roleName, children: []};
                     if (!this.currentData.children) {
                       this.$set(this.currentData, 'children', []);
                     }
                     this.currentData.children.push(newChild);
                     this.isShowPermissionInfo =  false
                     this.$Message.success('新增成功')
                     this.resetPermissionForm()
                   }else{
                     this.$Message.error('新增失败')
                   }
                 })
                 .catch((error) => {
                    console.log(error)
                 })
            } else if (operation == 'update') {
              updatePermission(permissionInfo)
                .then((res) => {
                  if (res.status == 201) {
                    if (this.currentNode.parent.data.pcode ==permissionInfo.parentId ) {
                      Object.assign(this.currentData,permissionInfo)
                    } else {
                      this.$refs.permissionTree.remove(this.currentData)
                      this.$refs.permissionTree.append(permissionInfo,permissionInfo.parentId)
                    }
                    this.isShowPermissionInfo =  false
                  }
                })
                .catch((error) => {
                  console.log(error)
                })
            }
            this.resetPermissionForm()
          },
          //删除一个权限
          removePermissionNode (node,data,store) {
            var _this = this
            this.$Modal.confirm({
              title: '删除权限',
              content: '确定删除' + '<span style="color: #f00; font-size: 14px">' + data.pname + '权限吗？</span>',
              okText: '确定',
              cancelText: '取消',
              onOk() { //确定删除
                _this.executeDeletePermission(node,data)
              },
              onCancel() {//取消删除
                this.$Message.info({
                  content: '已取消删除',
                  duration: 1,
                  top: 200,
                })
              }
            })
          },
          //执行删除权限的接口
          executeDeletePermission (node,data) {
            delPermission(data.pcode)
              .then((res) => {
                node.parent.removeChild(node)
                this.$Message.success({
                  content: '已成功删除权限'+data.pname,
                  duration: 1,
                  top: 200,
                })
              })
              .catch((error) => {
                console.log(error)
              })
          },
          // 单击选定节点
          handleClickPermission(nodeData, node, nodeEle) {
            this.changeClickedStyle(nodeData, node, nodeEle)
            // 重复单击节点，没有反应
            if (this.clickedPermissionNode && nodeData.pcode == this.clickedPermissionNode.data.pcode) {
              console.log('too');
            } else {
              this.clickedPermissionNode = node;
              this.$emit('ClickNode',nodeData, node, nodeEle);
            }
          },
          //过滤节点
          filterPermissionNode(value, data) {
            if (!value) return true;
            return data.pname.indexOf(value) !== -1;
          },

          // 拖放节点成功事件的回调
          handleDropSuccessPermission(sourceNode,targetNode,position,evt) {
            this.$emit('DropNode',sourceNode,targetNode,position,evt)
          },
          // 节点排序
          sortNode(nodeKey) {
            let node = this.$refs.permissionTree.getNode(nodeKey);
            node.childNodes.sort((a,b)=> a.data.shOrder - b.data.shOrder);
          },
          // 重置权限信息表单
          resetPermissionForm() {
            for(let item in this.permissionInfo) {
              this.permissionInfo[item] = '';
            }
          },
          //render函数
          renderContent(h, { node, data, store }){
            let iconClass=''
            let isShowAddRole
            if (node.level === 1) {
              isShowAddRole = true
              iconClass = 'iconfont icon-quanxianguanli2'
            }else{
              iconClass = 'iconfont icon-quanxianguanli'
            }
            return (
              <span class="tree-node-lable tree-node__content">
              <i style="padding-left:3px;" class={iconClass}></i>
              <span class="group-title" style="padding-left:5px;">{data.pname}</span>
            <span class="btns" v-show={this.isShowIcons}>
               <i class="iconfont icon-addNew" onClick= {(event) => {event.stopPropagation(); this.addPermissionNode(node,data,store)}} style="padding-left:5px;"></i>
              <i class="iconfont icon-delete" onClick= {(event) => {event.stopPropagation(); this.removePermissionNode(node,data,store)}} style="padding:0px 5px 0px 5px;" ></i>
              <i class="iconfont icon-bianji" onClick= {(event) => {event.stopPropagation(); this.editePermissionNode(node,data,store)}}></i>
            </span>
            </span>
          )}
        },
      watch: {
          permissionKeySearch(val) {
            this.$refs.chooseParentPermission.filter(val);
          }
        },
        created() {
            this.initPermissionList();
        },
        mounted() {
        },
        updated() {
        },
        beforeDestroy(){
        },
        destroyed() {
        },
    }

</script>

<style lang="less">
  .permission-tree-container{
    padding: 10px 0px 0px 0px;
  .chu-tree-node__content {
    line-height: 30px;
    height: 30px;
    cursor: pointer;
  .tree-node__content:hover .group-title {
    background-color: #eaf4fe;
    color: #515a6e;
    transition: all .2s ease-in-out
  }
  .tree-node__content {
  .iconfont{
    color: #2d8cf0;
  }
  display: inline-block;
  padding-left: 3px;
  padding-top: 2px;
  .group-title{
    font-size: 14px;
    padding-left: 5px;
  }
  .btns {
    opacity: 0;
    transition: all .5s linear;
  }
  }
  .tree-node__content:hover .btns {
    opacity: 1;
  }
  }
  }
</style>
