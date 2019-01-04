<template>
  <div class="group-tree-container" :style="{height:contentHeight+'px' ,overflowY:'auto'}">
    <vue-scroll :ops="groupTreeOptions">
      <chu-tree
        ref="groupTree"
        v-show="!isLoadingData"
        id="groupTree"
        node-key="groupCode"
        class="filter-tree"
        :data="groupList"
        :render-content="renderContent"
        :filter-node-method="filterNode"
        @node-click="handleGroupTreeNodeClick"
        :default-expanded-keys="['0001']"
        :expand-on-click-node="false"
      ></chu-tree>
      <div v-show="isLoadingData" class="loading_wrapper">
        <Spin fix>
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
      </div>
    </vue-scroll>
    <!--组织机构编辑and角色详情Modal-->
    <Modal :draggable="true" v-model="groupInfoModal" width="660px">
      <h2 slot="header" style="color:#17233d;text-align:center">
        {{groupInfoModalTitle}}
      </h2>
      <Form :model="groupInfoForm" label-position="right" :label-width="80" :rules="ruleValidate" ref="groupForm">
        <FormItem label="创建时间" prop="createTime">
          <DatePicker type="date" placeholder="请选择时间" v-model="groupInfoForm.createTime"></DatePicker>
        </FormItem>
        <FormItem label="组织名称" prop="groupName">
          <Input v-model="groupInfoForm.groupName"></Input>
        </FormItem>
        <FormItem label="组织代码" prop="groupCode">
          <Input v-model="groupInfoForm.groupCode"></Input>
        </FormItem>
        <FormItem label="上级部门">
          <Input style="width: 93%; float: left"  disabled v-model="groupInfoForm.parentGroupName"></Input>
          <div class="dialog-form-item__tree" @click="showGroupDialog"><i style="float: right;font-size: 22px;" class="iconfont icon-zuzhijigou"></i></div>
        </FormItem>
        <FormItem label="上级部门Id">
          <Input disabled v-model="groupInfoForm.parentId"></Input>
        </FormItem>
        <FormItem label="更新时间" prop="updateTime">
              <DatePicker type="date" placeholder="Select date" v-model="groupInfoForm.updateTime"></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancelRroupInfo('groupForm')">取消</Button>
        <Button @click="confirmGroupInfo">确定</Button>
      </div>
    </Modal>
    <!--选择上级部门对话框-->
    <Modal :draggable="true"  v-model="isShowPopGroupTree" width="450px">
      <h2 slot="header" style="color:#17233d;text-align:center">
        请选择上级部门
      </h2>
      <Input placeholder="请输入组织机构名称..." search  v-model="groupKeySearch" ></Input>
      <div class="permission-tree-container" style="height: 400px">
        <vue-scroll :ops="groupTreeOptions">
        <chu-tree  node-key="groupCode"
                   ref="chooseGroupTree"
                   class="filter-tree"
                   :data="groupList"
                   :render-content="renderContent"
                   :filter-node-method="filterNode"
                   @node-click="handleClickPopGroup"
                   :default-expanded-keys="['0001']"
                   :expand-on-click-node="false" >
        </chu-tree >
        </vue-scroll>
      </div>
      <div slot="footer">
        <Button @click="handlePopGroupBtn('cancle')">取消</Button>
        <Button @click="handlePopGroupBtn('ok')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import consts from "@/libs/consts.js"
  import Bus from '@/libs/bus.js'
  import {getAllGroups, addGroup, deleteGroup, updateGroup } from '@/api/user-management/groupManagement'
  import { parseTree } from '@/libs/util'
  export default {
    components: {
    },
    props: ["isShowGroupIcons"],
    data () {
      return {
        contentHeight:0, //默认容器高度
        isLoadingData: true, //初始化显示loading加载，请求数据成功false
        groupList: [], //存放父组件传过来的数据
        isShowIcons: false, //是否显示部门编辑功能的图标
        //滚动条相关配置
        groupTreeOptions: {
          vuescroll: {},
          scrollPanel: {},
          rail: {},
          bar: {
            background: '#adadad'
          }
        },
        curentData: '', //保存当前点击的部门节点对象
        curentNode: '', //保存当前点击的部门节点对象
        groupTreeHeight: 0, // 组织机构高度
        groupInfoModal: false, //角色信息Modal
        groupInfoModalTitle: '默认标题',// 角色信息Modal标题
        addGroupInfo: {}, //d当前点击的节点，作为新增子节点的父节点
        //表单信息
        groupInfoForm: {
          createTime: '', // 创建时间
          groupCode:'',//部门编号
          groupName: '',//部门名称
          parentId: '', // 上级部门ID
          parentGroupName: '', //上级部门名称
          updateTime: '' //更新时间
        },
        //表单验证
        ruleValidate: {
          groupName: [{ required:true, message: '请输入组织名称', trigger:'blur'}],
          groupCode: [{ required:true, message: '请输入组织代码', trigger:'blur'}],
          createTime: [{ required: true, type: 'date', message: '请选择时间', trigger: 'change' }],
          updateTime: [{ required: true, type: 'date', message: '请选择时间', trigger: 'change' }],
        },
        isShowPopGroupTree: false, // 是否显示选择上级部门对话框
        newParentGroupData: '', //新增或编辑节点时选择的父节点',
        newParentGroupNode:'',  //增加或编辑节点时选择的父节点
        groupKeySearch: '', //搜索关键字

      }
    },
    created () {
      this.isShowIcons = this.isShowGroupIcons
    },
    methods: {
      //获取所有组织机构
     getGroups () {
        getAllGroups().then((res) => {
          for (let i=0;i<res.data.items.length;i++) {
            res.data.items[i].title = res.data.items[i].groupName
          }
          this.groupList = parseTree(res.data.items,null, 'groupCode')
          this.isLoadingData = false
        })
      },
      //部门搜索
      filterNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      //部门节点点击事件
      handleGroupTreeNodeClick(data,node,store) {
        //this.curentData = data
        //this.curentNode = node
        Bus.$emit('triggerEventFromGroupTree',data)
        this.$emit('nodeCliked',node,data,store)
        //var parent = document.getElementById('groupTree')
        //this.getChildren(parent,this.curentData)
      },
      //遍历tree下所有dom节点改变点击时的样式
     /* getChildren (parent) {
        var children = parent.children
        //遍历childen的每个节点
        for (var i = 0;i<children.length;i++) {
          if (children[i].tagName == 'SPAN' && children[i].className == 'group-title') {
            children[i].style.background =''
            children[i].style.color = ''
            if (children[i].innerText == this.curentData.groupName) {
              children[i].style.background = '#d5e8fc'
              children[i].style.color = '#bf002f'
            }
          }
          //对当前子节点调用getChildren
          this.getChildren(children[i])//这里用递归的方法
        }
      },*/
      // 获取用户table 高度
      getGroupBoxHeight() {
        this.groupTreeHeight = window.innerHeight -220
      },
      //增加组织机构图标点击的回调
      addGroupNode(node,data,store) {
        this.addGroupInfo = data
        this.groupInfoModal = true
        this.groupInfoModalTitle = '新增部门'
        this.groupInfoForm.groupCode = ''
        this.groupInfoForm.groupName = ''
        this.groupInfoForm.parentId = data.groupCode
        this.groupInfoForm.parentGroupName = data.groupName
      },
      //新增组织接口
      addNewGroup (groupInfoForm) {
        addGroup(groupInfoForm)
          .then((res) => {
            this.addGroup(this.addGroupInfo)
            this.$Message.success({
              content: '已成功新增' + '<span style="color: #f00; font-size: 14px">' + groupInfoForm.groupName + '部门？</span>',
              duration: 2,
              top: 200,
            })
          })
          .catch((err) => {
            console.log(err)
          })
      },
      //确定新增按钮的回调
      addGroup(data) {
        const newChild = JSON.parse(JSON.stringify(this.groupInfoForm))//{ roleCode: this.roleInfoForm.roelCode, roleName: this.roleInfoForm.roleName, children: []};
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },
      //确定删除后执行的后台删除方法
      executeDeleteOrganization(node,data) {
        deleteGroup(data.groupCode)
          .then((res) => {
            node.parent.removeChild(node)
            this.$Message.success({
              content: '已成功删除部门'+data.groupName,
              duration: 1,
              top: 200,
            })
            this.currentData = null
          })
          .catch((err)=> {
            console.log("未能删除节点")
          })
      },
      // 删除节点图标点击的回调
      removeGroupNode (node,data,store) {
          var _this = this
          this.$Modal.confirm({
            title: '删除部门',
            content: '确定删除部门' + '<span style="color: #f00; font-size: 14px">' + data.groupName + '吗？</span>',
            okText: '确定',
            cancelText: '取消',
            onOk() { //确定删除
              _this.executeDeleteOrganization(node,data)
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
      //编辑组织机构图标的回调
      editeGroupNode (node,data,store) {
        this.curentData = data
        this.curentNode = node
        this.groupInfoForm.groupCode = data.groupCode
        this.groupInfoForm.groupName = data.groupName
        this.groupInfoForm.parentId = data.parentId
        this.groupInfoForm.parentGroupName = node.parent.data.groupName
        this.groupInfoModalTitle = '编辑部门'
        this.groupInfoModal = true
      },
      //后台部门编辑接口
      editeGroupInfo(groupInfo) {
        updateGroup(groupInfo)
          .then((res) => {
            if (res.status == 201) {
              if (this.curentNode.parent.data.groupCode == groupInfo.parentId) {
                Object.assign(this.curentData,groupInfo)
              } else {
                this.$refs.groupTree.remove(this.curentData)
                this.$refs.groupTree.append(groupInfo,groupInfo.parentId)
              }
              this.$Message.info({
                content: '修改成功',
                duration: 1,
                top: 200,
              })
            }
          })
      },
      //遍历节点找到现在编辑的节点
      travelRoleNode (groupList) {
        for (var i=0;i<groupList.length;i++) {
          if (groupList[i].groupCode == this.groupInfoForm.groupCode) {
            groupList[i].groupCode = this.groupInfoForm.groupCode
            groupList[i].groupName = this.groupInfoForm.groupName
          }
          if (groupList[i].children){
            this.travelRoleNode(groupList[i].children)
          }else{continue}
        }
      },
      //显示选择上级部门对话框
      showGroupDialog () {
        this.getGroups()
        this.isShowPopGroupTree = true
      },
      //在弹出的部门树上：单击节点
      handleClickPopGroup (nodeData,node,nodeEle) {
        this.newParentGroupData = nodeData
        this.newParentGroupNode = node
      },
      //在弹出选择部门对话框单击按钮： 确定、取消
      handlePopGroupBtn (type) {
        this.isShowPopGroupTree = false
        if (type == 'ok') {
          this.groupInfoForm.parentId = this.newParentGroupNode.data.groupCode
          this.groupInfoForm.parentGroupName = this.newParentGroupNode.data.groupName
        }
      },
      //取消编辑部门节点
      cancelRroupInfo (name) {
        if(this.groupInfoModalTitle == '新增部门') {
          //清空验证
          this.$refs[name].resetFields();
          this.$Message.info({
            content: '已取消新增',
            duration: 1,
            top: 200,
          })
        }else{
          this.$Message.info({
            content: '已取消编辑',
            duration: 1,
            top: 200,
          })
        }
        this.groupInfoModal = false
      },
      //确认保存角色节点修改
      confirmGroupInfo () {
        var _this = this
        this.$refs.groupForm.validate((valid) => {
          if (valid) {
            //this.saveRoleInfo(this.roleOperation)
            if (this.groupInfoModalTitle == '新增部门') {
              this.$Modal.confirm({
                title: '新增部门',
                content: '确定新增部门' + '<span style="color: #f00; font-size: 14px">' + this.groupInfoForm.groupName + '吗？</span>',
                okText: '确定',
                cancelText: '取消',
                onOk() { //确定新增
                  _this.addNewGroup(_this.groupInfoForm)
                  // _this.addGroup(_this.addGroupInfo)
                  _this.groupInfoModal = false
                },
                onCancel() {//取消删除
                  _this.groupInfoModal = false
                  this.$Message.info({
                    content: '已取消新增',
                    duration: 1,
                    top: 200,
                  })
                }
              })
            }else{
              this.$Modal.confirm({
                title: '部门修改',
                content: '确定保部门' + '<span style="color: #f00; font-size: 14px">' + this.groupInfoForm.groupName + '编辑吗？</span>',
                okText: '确定',
                cancelText: '取消',
                onOk() { //确定保存
                  _this.editeGroupInfo(_this.groupInfoForm)
                  _this.groupInfoModal = false
                  //_this.travelRoleNode(_this.groupList)   //遍历更新节点

                },
                onCancel() {//取消删除
                  _this.groupInfoModal = false
                  this.$Message.info({
                    content: '已取消编辑',
                    duration: 1,
                    top: 200,
                  })
                }
              })
            }
          }else {
            return false
          }
        })

      },
      //render函数
      renderContent(h, { node, data, store }){
        let iconClass=''
        let isChecked=''
        if (node.level === 1) {
          iconClass = 'iconfont icon-erji-zuzhijigou'
        }else if (node.level== 2) {
          iconClass = 'iconfont icon-zuzhijigou'
        }else{
          iconClass = 'iconfont icon-zuzhi'
          isChecked = 'checked'
        }
        if (this.isCliced) {
        }
        return (
          <span class="tree-node-lable tree-node__content">
          <i class={iconClass}></i>
          <span class="group-title">{data.groupName}</span>
            <span class="btns" v-show={this.isShowIcons}>
              <i class="iconfont icon-addNew" onClick= {(event) => {event.stopPropagation(); this.addGroupNode(node,data,store)}} style="padding-left:5px;"></i>
              <i class="iconfont icon-delete" onClick= {(event) => {event.stopPropagation(); this.removeGroupNode(node,data,store)}} style="padding:0px 5px 0px 5px;" ></i>
              <i class="iconfont icon-bianji" onClick= {(event) => {event.stopPropagation(); this.editeGroupNode(node,data,store)}}></i>
            </span>
          </span>
        )
      }
    },
    mounted () {
      this.$nextTick(()=> {
        //this.getGroupBoxHeight()
        this.contentHeight =consts.pageDivHeight.contentHeight()-90
        this.getGroups()
      })
    },
    watch: {
      //部门节点修改选择上级部门： 选择功能
      groupKeySearch(val) {
        this.$refs.chooseGroupTree.filter(val);
      }
    }
  }
</script>

<style lang="less">
  .group-tree-container{
    height: 100%;
    min-height: 500px;
    overflow: auto;
    padding: 10px 0px 0px 0px;
    .loading_wrapper{
      .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
      }
      @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
      }
    }
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
        width: 95%;
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
