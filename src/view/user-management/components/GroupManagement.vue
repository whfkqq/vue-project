<template>
  <div class="group-container">
    <i-input  v-model="filterText" search placeholder="请输入组织机构名称..." />
    <div class="btns">
      <i-button class="btn" @click="handleAddGroup" type="primary"><Icon type="md-person-add" />新增</i-button>
      <i-button class="btn mbtn" @click="handleUpdateGroup" type="primary"><Icon type="md-create" />修改</i-button>
      <i-button class="btn" @click="handleDeleteGroup" type="error"><Icon type="ios-trash" />删除</i-button>
    </div>
    <group-tree
      @nodeCliked="childTreeClickd"
      :groupList="groupList"
      :isShowGroupIcons="true"
      ref="groupTree"
      >
    </group-tree>
    <!--组织机构修改and详情Modal-->
    <Modal v-model="groupInfoModal" width="660px">
      <h2 slot="header" style="color:#17233d;text-align:center">
        {{groupInfoModalTitle}}
      </h2>
      <Form :model="groupInfoForm" label-position="right" :label-width="80" :rules="ruleValidate" ref="groupForm">
        <FormItem label="创建时间" prop="createTime">
          <DatePicker type="date" placeholder="Select date" v-model="groupInfoForm.createTime"></DatePicker>
        </FormItem>
        <FormItem label="组织名称" prop="groupName">
          <Input v-model="groupInfoForm.groupName"></Input>
        </FormItem>
        <FormItem label="组织代码" prop="groupCode">
          <Input v-model="groupInfoForm.groupCode"></Input>
        </FormItem>
        <FormItem label="上级部门">
          <Input style="width: 93%;float: left" disabled v-model="groupInfoForm.parentGroupName"></Input>
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
    <!--新增部门方式选择-->
    <Modal v-model="chooseAddGroupInfo" width="400px">
      <h2 slot="header" style="text-align:center">
        <p>青选择新增部门方式</p>
      </h2>
      <div class="content" style="text-align: center">
        <RadioGroup v-model="chosseAddGroup" @on-change="chooseResult">
          <Radio label="新增顶级部门"></Radio>
          <Radio label="新增子部门"></Radio>
        </RadioGroup>
      </div>
      <div slot="footer">
        <Button @click="cancelChooseAdd">取消</Button>
        <Button @click="confirmChooseAdd">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { getAllGroups,addGroup, deleteGroup, updateGroup } from '@/api/user-management/groupManagement.js'
  import { parseTree } from '@/libs/util'
  import groupTree from '@/components/trees/groupTree'
  export default {
    components: {
      groupTree
    },
    data () {
      return {
        filterText: '', // 搜索绑定
        groupList: [],  // 组织机构列表传给子组件的部门数据
        currentData: '', //保存当前被点击的节点对象
        currentNode: '', //保存当前被点击的节点
        groupInfoModal: false, // 部门信息Modal
        chooseAddGroupInfo: false, //新增方式选择Modal
        chosseAddGroup : '新增顶级部门', //默认新增顶级部门
        chooseAddGroupStatus: '新增顶级部门', //保存选择新增部门的方式,默认添加顶级部门
        groupInfoModalTitle: '默认标题', // Modal 默认标题
        addGroupInfo: {},  //d当前点击的节点，作为新增子节点的父节点
        //表单信息
        groupInfoForm: {
          createTime: '', // 创建时间
          groupCode:'',//部门编号
          groupName: '',//部门名称
          parentId: '', // 上级部门ID
          parentGroupName: '', //上级部门名称
          updateTime: ''
        },
        //表单验证
        ruleValidate: {
          groupName: [{ required:true, message: '请输入组织名称', trigger:'blur'}],
          groupCode: [{ required:true, message: '请输入组织代码', trigger:'blur'}],
          createTime: [{ required: true, type: 'date', message: '请选择时间', trigger: 'change' }],
          updateTime: [{ required: true, type: 'date', message: '请选择时间', trigger: 'change' }],
        },
        //滚动条相关配置
        groupTreeOptions: {
          vuescroll: {},
          scrollPanel: {},
          rail: {},
          bar: {
            background: '#adadad'
          }
        },
        isShowPopGroupTree: false, // 是否显示选择上级部门对话框
        newParentGroupData: '', //新增或编辑节点时选择的父节点',
        newParentGroupNode:'',  //增加或编辑节点时选择的父节点
        groupKeySearch: '', //搜索关键字
      }
    },
    watch: {
      filterText(val) {
        this.$refs.groupTree.$children[0].$children[0].$children[0].filter(val)
      },
      groupKeySearch(val) {
        this.$refs.chooseGroupTree.filter(val);
      }
    },
    methods: {
      //部门搜索
      filterNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      //获取所有组织机构
      getGroups () {
        getAllGroups().then((res) => {
          for (let i=0;i<res.data.items.length;i++) {
            res.data.items[i].title = res.data.items[i].groupName
          }
          this.groupList = parseTree(res.data.items,null, 'groupCode')
        })
      },
      //子组件触发的点击事件
      childTreeClickd (node,data,store) {
        this.addGroupInfo = data
        this.currentNode = node
        this.currentData = data
      },
      // 新增部门节点
      handleAddGroup () {
        if (!this.currentData) {
          this.chooseAddGroupInfo = true
        }else{
          this.groupInfoModal = true
          this.groupInfoModalTitle = '新增部门'
          this.groupInfoForm.groupCode = ''
          this.groupInfoForm.groupName = ''
          this.groupInfoForm.parentId = this.currentData.groupCode
          this.groupInfoForm.parentGroupName = this.currentData.groupName
        }
      },
      // 新增部门方式（顶级节点和子节点）选择的回调
      chooseResult (val) {
        this.chooseAddGroupStatus = val
      },
      //取消选择新增方式按钮点击的回调
      cancelChooseAdd () {
        this.chooseAddGroupInfo = false
        this.$Message.info({
          content: '已取消新增',
          duration: 1,
          top: 200,
        })
      },
      //确定选择新增方式按钮点击的回调
      confirmChooseAdd () {
        if (this.chooseAddGroupStatus == '新增顶级部门') {
          this.groupInfoModalTitle = '新增部门'
          this.groupInfoModal = true
          this.chooseAddGroupInfo = false
        }else{
          this.chooseAddGroupInfo = false
          this.$Message.warning({
            content: '请选择一个部门',
            duration: 2,
            top: 200,
          })
          if (this.currentData) {
            this.groupInfoModal = true
          }
        }
      },
      //确认新增部门后台接口
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
        const newChild = JSON.parse(JSON.stringify(this.groupInfoForm))
        if (this.chooseAddGroupStatus == '新增顶级部门') {
          this.groupList.push(newChild);
        }else{
          if (!data.children) {
            this.$set(data, 'children', []);
          }
          data.children.push(newChild);
        }
      },
      //部门节点修改按钮点击的回调
      handleUpdateGroup () {
        if (!this.currentData) {
          this.$Message.warning({
            content: '请选择要编辑的节点名称',
            duration: 1,
            top: 200,
          })
        }else{
          this.groupInfoModalTitle = '编辑部门'
          this.groupInfoForm.groupName = this.currentData.groupName
          this.groupInfoForm.groupCode = this.currentData.groupCode
          this.groupInfoForm.parentId = this.currentData.parentId
          this.groupInfoForm.parentGroupName = this.currentNode.parent.data.groupName
          this.groupInfoModal = true
        }
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
          console.log(this.groupInfoForm.parentId)
          console.log(this.groupInfoForm.parentGroupName)
        }
      },

      //取消编辑部门节点
      cancelRroupInfo (name) {
        //清空验证
        this.$refs[name].resetFields();
        if(this.groupInfoModalTitle == '新增部门') {
          this.$Message.info({
            content: '已取新增',
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
      //后台部门编辑接口
      editeGroupInfo(groupInfo) {
        updateGroup(groupInfo)
          .then((res) => {
            console.log(this.currentNode.parent.data.groupCode)
            console.log(groupInfo.parentId)
            if (res.status == 201) {
              if (this.currentNode.parent.data.groupCode == groupInfo.parentId) {
                Object.assign(this.currentData,groupInfo)
              }else {
                this.$refs.groupTree.$children[0].$children[0].$children[0].remove(this.currentData)
                this.$refs.groupTree.$children[0].$children[0].$children[0].append(groupInfo,groupInfo.parentId)
              }
            }
            this.$Message.info({
              content: '保存成功',
              duration: 1,
              top: 200,
            })
            this.groupInfoModal = false
          })
      },
      //确认保存部门节点修改
      confirmGroupInfo () {
        var _this = this
        this.$refs.groupForm.validate((valid) => {
          if (valid) {
            if (this.groupInfoModalTitle == '新增部门') {
              this.$Modal.confirm({
                title: '新增部门',
                content: '确定新增部门' + '<span style="color: #f00; font-size: 14px">' + this.groupInfoForm.groupName + '吗？</span>',
                okText: '确定',
                cancelText: '取消',
                onOk() { //确定新增
                  _this.addNewGroup(_this.groupInfoForm)
                  //_this.addGroup(_this.addGroupInfo)
                  _this.groupInfoModal = false
                  _this.currentData = null
                  this.$Message.success({
                    content: '新增成功',
                    duration: 1,
                    top: 200,
                  })
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
                  //_this.groupInfoModal = false
                  //_this.travelRoleNode(_this.groupList)
                  /*this.$Message.success({
                    content: '保存成功',
                    duration: 1,
                    top: 200,
                  })*/
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
          } else {
            this.$Message.error('请检查输入是否正确');
          }
        })
      },
      //确定删除后执行的后台删除方法
      executeDeleteOrganization() {
        deleteGroup(this.currentData.groupCode)
          .then((res) => {
            this.$Message.success({
              content: '已成功删除部门'+this.currentData.groupName,
              duration: 1,
              top: 200,
            })
            this.currentData = null
          })
          .catch((err)=> {
            console.log("未能删除节点")
          })
      },
      //删除部门节点按钮
      handleDeleteGroup () {
        console.log(this.currentNode.parent)
        var _this = this
       if (!this.currentData) {
         this.$Message.warning({
           content: '请选择要删除的节点',
           duration: 1,
           top: 200,
         })
       }else {
         this.$Modal.confirm({
           title: '部门删除',
           content: '确定删除部门' + '<span style="color: #f00; font-size: 14px">' + this.currentData.groupName + '吗？</span>',
           okText: '确定',
           cancelText: '取消',
           onOk() {
             _this.currentNode.parent.removeChild(_this.currentNode) //找到父节点将自己删除
             _this.executeDeleteOrganization()
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
        </span>
      )
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.getGroups()
      })
    }
  }
</script>

<style scoped lang="less">
  .group-container{
    border: 1px solid #ddd;
    background: #fff;
    padding: 10px 5px 0px 10px;
    .btns{
      margin-top: 1rem;
      display: flex;
      .btn{
        flex: .3;
      }
      .mbtn{
        margin: 0px 10px 0px 10px;
      }
    }
  }
</style>
