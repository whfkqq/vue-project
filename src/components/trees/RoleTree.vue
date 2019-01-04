<template>
    <div class="role-tree-container">
        <chu-tree v-show="!isLoadingData"
                  :render-content="renderContent"
                 node-key="roleCode"
                  ref="roleTree"
                 :data="roleList"
                 :props="roleProps"
                 :draggable="isDraggable"
                  highlight-current
                  :expand-on-click-node="false"
                 :filter-node-method="filterRoleNode"
                 @node-click="handleClick"
                 :show-checkbox="isShowCheckbox"
        ></chu-tree>
      <div v-show="isLoadingData" class="loading_wrapper">
        <Spin fix>
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
      </div>
      <!--角色信息-->
      <Modal @on-visible-change="stateChange('roleInfoForm')" v-model="roleInfoModal" width="660px">
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
            <Input v-model.trim="roleInfo.roleCode"></Input>
          </FormItem>
          <FormItem label="角色类型">
            <RadioGroup v-model="roleInfo.roleType">
              <Radio label="1">授权角色</Radio>
              <Radio label="2">管理员角色</Radio>
              <Radio label="3">流程角色</Radio>
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
    </div>
</template>

<script>
    import { isValidNumber } from '@/libs/validate.js'
    import { getRoleList, roleDetaile, addRole, delRole, updateRole } from '@/api/user-management/roleManagement.js'
    var validNumber = (rule, value, callback) => {
      if (!value)
      { callback(new Error('请输入排序数字')); }
      else if (!isValidNumber(value))
      { callback(new Error('请输入正确的数字')); }
      else
      { callback(); }
    };
    export default {
        name:'RoleTree',
        props: ['isShowCheckbox','isDraggable'],
        data() {
          return {
            roleParentName: '', // 上级权限
            currentData: '', //当前角色节点
            permissionOperation: '', // 新增/编辑标志
            operationText: '默认标题', //角色信息对话框标题
            roleInfoModal: false, //默认隐藏角色信息对话框
            //角色信息
            roleInfo: {
              createTime: "",
              roleCode:"",
              roleName:"",
              roleType:"",
              updateTime: ""
            },
            // 角色表单验证规则
            roleRules: {
                roleName: [{ required:true, message: '请输入角色名称', trigger:'blur'}],
                roleCode: [{ required:true, message: '请输入角色代码', trigger:'blur'}],
                createTime: [{ required: true, type: 'date', message: '请选择时间', trigger: 'change' }],
                updateTime: [{ required: true, type: 'date', message: '请选择时间', trigger: 'change' }],
              },
            isLoadingData: true,
            roleList:[],
            roleProps: {
              children: 'children',
              label: 'roleName'
            }
          }
        },
        methods: {
          radioChange(val){
            console.log(this.roleInfo.roleType)
          },
          // 初始化角色列表
          initRoleList() {
            getRoleList()
              .then((res) => {
                  if(res.status == 200) {
                    this.isLoadingData = false;
                    this.roleList = this.parseRoleTree(res.data.items);
                  }
                }
              )
          },
          // 把从后台获取的数据转换为element-ui tree的格式
          parseRoleTree(roles) {
            let roleArray = []
            let authNode = { roleName: '授权角色', roleType: '1', roleCode:'auth', children: [] },
              managerNode = { roleName: '管理员角色', roleType: '2', roleCode:'manager', children: [] },
              flowNode = { roleName: '流程角色', roleType: '3', roleCode:'flow', children: [] };
            roles.forEach((item) => {
              if(item.roleType === authNode.roleType) {
                authNode.children.push(item);
              } else if(item.roleType === managerNode.roleType) {
                   managerNode.children.push(item);
              } else if(item.roleType === flowNode.roleType) {
                flowNode.children.push(item);
              } else if (item.roleType === null) {
                roleArray.push(item)
              }
            });
            roleArray.push(authNode,managerNode,flowNode)
            //return [authNode,managerNode,flowNode];
            return roleArray;
          },
          //单击选定节点
          handleClick(nodeData, node, nodeEle) {
            this.$emit('ClickNode',nodeData, node, nodeEle);
          },
          //新增顶级角色
          addNewRole (roleInfo) {
            this.roleList.push(roleInfo)
          },
          //新增子角色
          addRoleNode (node,data,store){
            console.log(data)
            this.roleInfo.roleType = data.roleType
            this.currentData = data
            this.operationText = '权限信息【新增】'
            this.roleOperation = 'add';
            this.roleInfoModal = true
          },
          //角色编辑
          editeRoleNode (node,data,store) {
            this.currentData = data
            this.operationText = '角色信息【编辑】'
            this.roleParentName = node.parent.data.roleName
            //this.getRoleInfo(data.roleCode)
            Object.assign(this.roleInfo,data)
            this.roleInfoModal = true
            this.roleOperation = 'update'
          },
          //获取一个角色详情
          /*getRoleInfo (roleCode) {
            roleDetaile(roleCode)
              .then((res) => {
                if (res.status == 200) {
                  this.roleInfo = res.data
                  this.roleInfoModal = true
                  this.roleOperation = 'update'
                }else {
                  this.$Message.error(`获取角色信息失败:${res.status}-${res.msg}`)
                }
              })
              .catch((error) => {
                console.log(error)
              })
          },*/
          //响应角色信息框的按钮：确定/取消
          handleRoleInfoBtn (type) {
            if (type == 'ok') {
              this.$refs.roleInfoForm.validate((valid) => {
                if (valid) {
                  this.saveRoleInfo(this.roleOperation)
                }else {
                  return false
                }
              })
            }else {
              this.roleInfoModal = false
              //this.resetRoleForm();
            }
          },
          //保存角色信息，新增，编辑
          saveRoleInfo (operation) {
            let roleInfo = {
              createTime: this.roleInfo.createTime,
              roleName: this.roleInfo.roleName,
              roleCode: this.roleInfo.roleCode,
              roleType: this.roleInfo.roleType,
              updateTime: this.roleInfo.updateTime
            }
            if (operation === 'add') {
             addRole (roleInfo)
               .then((res) => {
                 if (res.status == 201) {
                   this.roleInfoModal = false;
                   const newChild = JSON.parse(JSON.stringify(roleInfo))//{ roleCode: this.roleInfoForm.roelCode, roleName: this.roleInfoForm.roleName, children: []};
                   if (!this.currentData.children) {
                     this.$set(this.currentData, 'children', []);
                   }
                   this.currentData.children.push(newChild);
                   this.$Message.success('新增成功')
                   this.resetRoleForm()
                 }else{
                   this.$Message.error('新增失败')
                 }
               })
               .catch((error) => {

               })
            }else if (operation === 'update') {
              updateRole(roleInfo)
                .then((res) => {
                  if (res.status === 201) {
                    Object.assign(this.currentData,roleInfo)
                    this.roleInfoModal = false
                    this.$Message.success('保存成功')
                    //刷新角色树
                    this.initRoleList()
                  }
                })
                .catch((error) => {
                  console.log(error)
                })
            }
          },
          //对话框状态改变时取消验证
          stateChange (roleInfoForm) {
            this.$refs[roleInfoForm].resetFields();
          },
          //角色删除
          removeRoleNode (node,data,store) {
            var _this = this
            this.$Modal.confirm({
              title: '删除角色',
              content: '确定删除' + '<span style="color: #f00; font-size: 14px">' + data.roleName + '角色吗？</span>',
              okText: '确定',
              cancelText: '取消',
              onOk() { //确定删除
                _this.executeDeleteRole(node,data)
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
          //执行删除角色的接口
          executeDeleteRole (node,data) {
            delRole (data.roleCode)
              .then((res) => {
                node.parent.removeChild(node)
                this.$Message.success({
                  content: '已成功删除角色'+data.roleName,
                  duration: 1,
                  top: 200
                })
              })
          },
          //过滤节点
          filterRoleNode(value, data) {
            if (!value) return true;
            return data.roleName.indexOf(value) !== -1;
          },
          // 重置权限信息表单
          resetRoleForm() {
            for(let item in this.roleInfo) {
              this.roleInfo[item] = '';
            }
          },
          //render函数
          renderContent(h, { node, data, store }){
            let iconClass=''
            let isShowAddRole
            if (node.level === 1) {
              isShowAddRole = true
              iconClass = 'iconfont icon-jiaoseguanli1'
            }else if (node.level== 2) {
              isShowAddRole = false
              iconClass = 'iconfont icon-jiaoseguanli'
            }else{
              iconClass = 'iconfont icon-jiaose'
            }
            return (
              <span class="tree-node-lable tree-node__content">
              <i style="padding-left:3px;" class={iconClass}></i>
              <span class="group-title" style="padding-left:5px;">{data.roleName}</span>
            <span class="btns">
              <i v-show={isShowAddRole} class="iconfont icon-addNew" onClick= {(event) => {event.stopPropagation(); this.addRoleNode(node,data,store)}} style="padding-left:5px;"></i>
              <i class="iconfont icon-delete" onClick= {(event) => {event.stopPropagation(); this.removeRoleNode(node,data,store)}} style="padding:0px 5px 0px 5px;" ></i>
              <i class="iconfont icon-bianji" onClick= {(event) => {event.stopPropagation(); this.editeRoleNode(node,data,store)}}></i>
            </span>
            </span>
          )}
        },
        created() {
          console.log("roleTree created")
          this.initRoleList();
        },
        mounted() {
          console.log("roleTree mounted")
        },
        updated() {
          console.log("roleTree updated")
        },
        destroyed() {
          console.log('roleTree destroyed');
        }
    }
</script>

<style lang="less">
  .role-tree-container{
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
