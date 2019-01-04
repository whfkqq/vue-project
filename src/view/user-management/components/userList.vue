<template>
  <div class="group-management-container":style="{height:contentHeight+'px' ,overflowY:'auto'}">
    <div class="user-table">
      <!--table头部-->
        <Row class="user-table-header" ref="btns">
          <i-col span="2">
            <i-button @click="handleAddNewUser(dialog)" type="primary"><Icon type="md-person-add" />新增用户</i-button>
          </i-col>
          <i-col span="4">
            <Button type="primary" @click="exportData"><Icon type="ios-download-outline"></Icon>导出用户数据</Button>
          </i-col>
          <i-col span="6">
            <Input search placeholder="请输入关键字进行搜索..."   v-model="searchInput"/>
          </i-col>
        </Row>
      <!--table主体-->
     <!--   <Row>
          <i-col  offset="14">
            <Checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
              <Checkbox label="userId">用户名</Checkbox>
              <Checkbox label="employeeName">姓名</Checkbox>
              <Checkbox label="sex">性别</Checkbox>
              <Checkbox label="mainGroup">主部门</Checkbox>
              <Checkbox label="position">岗位</Checkbox>
              <Checkbox label="phone">电话</Checkbox>
              <Checkbox label="email">邮箱</Checkbox>
              <Checkbox label="mobile">手机</Checkbox>
              <Checkbox label="action">操作</Checkbox>
            </Checkbox-group>
          </i-col>
        </Row>-->
        <Row>
        <div class="user-table-content">
          <i-col span="24">
            <div :style="{height:tableHeight+'px'}">
              <vue-scroll :ops="tableOptions">
                <Table border stripe ref="userTable"  :columns="userColumns" :data="page.tableData"></Table><!--:height="tableHeight"-->
              </vue-scroll>
            </div>
          </i-col>
        </div>
      </Row>
      <!--底部（分页）-->
      <Row class="user-table-footer" ref="pageFooter">
        <i-col span="24">
          <Page
            background
            @on-page-size-change="handleSizeChange"
            @on-change="handleCurrentChange"
            :current="page.page"
            :page-size="page.pageSize"
            :page-sizes="page.sizes"
            show-total show-elevator show-sizer
            :total="page.total">
          </Page>
        </i-col>
      </Row>
      <!--用户信息 新增、编辑-->
      <Modal  :draggable="true" v-model="isShowUserInfoModal" width="660px">
        <p slot="header" style="color:#17233d;text-align:center">
          {{userInfoTitle}}
        </p>
        <Form :model="dialog.form" label-position="right" :label-width="80" :rules="ruleValidate" ref="userInfoForm">
          <FormItem label="姓名" prop="employeeName">
            <Input v-model="dialog.form.employeeName"></Input>
          </FormItem>
          <FormItem label="用户Id" prop="userId">
            <Input v-model="dialog.form.userId"></Input>
          </FormItem>
          <FormItem label="性别" prop="sex">
            <RadioGroup v-model="dialog.form.sex" size="large">
              <Radio label="1">男</Radio>
              <Radio label="0">女</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="所属部门" prop="mainGroup">
            <div v-for="(dept,index) in dialog.form.groups">
              <div v-if="dept.type==1">
                    <Input disabled  v-model="dialog.form.mainGroup"></Input>
                  <i @click="handleDeptEdit(index,type=1)" style="float: right;font-size: 25px;color: #348EED" class="iconfont icon-addNew"></i>
              </div>
            </div>
          </FormItem>
          <FormItem label="兼职部门">
            <div v-for="(dept,index) in dialog.form.groups">
              <div v-if="dept.type == 0">
                    <Input v-model="dialog.form.groups[index].groupName" disabled></Input>
                    <!--改-->
                    <span @click="handleDeptEdit(index,type=0)">
                             <i class="iconfont icon-addNew"></i>
                    </span>
                    <!--删-->
                    <span @click="handleDeptDelete(index)">
                              <i class="iconfont icon-delete"></i>
                    </span>
              </div>
            </div>
            <!--添-->
            <span @click="handleDeptAdd(type=0)">
                      <i class="iconfont icon-addNew"></i>
            </span>
          </FormItem>
          <FormItem label="电话">
            <Input v-model="dialog.form.phone"></Input>
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <Input v-model="dialog.form.email"></Input>
          </FormItem>
          <FormItem label="身份证">
            <Input v-model="dialog.form.idCard"></Input>
          </FormItem>
          <FormItem label="手机">
            <Input v-model="dialog.form.mobile"></Input>
          </FormItem>
          <FormItem label="地址">
            <Input v-model="dialog.form.address"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="handleUserInfoBtn('cancle')">取消</Button>
          <Button @click="handleUserInfoBtn('ok')">确定</Button>
        </div>
      </Modal>
      <!--新增用户选择部门对话框-->
      <Modal v-model="dialog.childDialog.choooseGroupModal" width="500" :draggable="true">
        <p slot="header" style="color:#17233d;text-align:center">
          选择部门
        </p>
        <i-input  v-model="searchGroupText" search placeholder="请输入组织机构名称..." />
        <div class="content" style="height: 400px">
          <vue-scroll :ops="groupTreeOptions">
            <chu-tree
              id="grouptree"
              ref="groupTree"
              class="filter-tree"
              :data="groupList"
              :render-content="renderContent"
              :filter-node-method="filterNode"
              @node-click="handleGroupTreeClick"
              :default-expanded-keys="[1685]"
              :expand-on-click-node="false"
            ></chu-tree>
          </vue-scroll>
        </div>
        <div slot="footer">
          <Button @click="cancleChooseGroupBtn" >取消</Button>
          <Button @click="confirmChooseGroupBtn(dialog.childDialog)" >确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  import consts from "@/libs/consts.js"
  import Bus from '@/libs/bus.js'
  import {getAllGroups} from '@/api/user-management/groupManagement.js'
  import {usersOfGroup,addUser,searchUser,getUserInfo,delUserById,editeUserInfo,getAllUsers} from '@/api/user-management/userManagement.js'
  import { parseTree } from '@/libs/util'

  export default {
    name: 'person-table',
    components: { },
    data() {
      return {
        contentHeight:0,
        tableColumnsChecked: ['userId','employeeName','sex','mainGroup','position','phone','mobile','email','action'],
        groupList: [], //保存新增用户选择部门数据
        userInfoTitle: '默认标题', // 用户信息对话框标题
        tableHeight: 0, // 用户表格高度
        tabbleBoxHeight: 0, //容器高度
        //表格header
        userColumns: [],
        //表格header
        /*userColumns: [
          {
            title: '编号',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '用户名',
            key: 'userId'
          },
          {
            title: '姓名',
            key: 'employeeName',
            sortable: true
          },
          {
            title: '主部门',
            width: 234,
            key:"mainGroup",
            render: (h,params) => {
              if (params.row.groups[0].type === '1') {
                return h('span',[params.row.groups[0].groupName])
              }else {
                for (let i=1;i<params.row.groups.length;i++) {
                  if (params.row.groups[i].type == '1') {
                    return h('span',[params.row.groups[i].groupName])
                  }
                }
              }
            }
          },
          {
            title: '岗位',
            key: 'position'
          },
          {
            title: '电话',
            key: 'phone'
          },
          {
            title: '邮箱',
            key: 'email'
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showUserDetail(params.row,params.column,params.index)
                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.removeUser(params.row,params.column,params.index)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],*/
        //表格滚动条配置
        tableOptions: {
          vuescroll: {},
          scrollPanel: {
            initialScrollY: false,
            initialScrollX: false,
            scrollingX: true,
            scrollingY: true,
            speed: 300,
            easing: undefined,
          },
          rail: {},
          bar: {
            background: '#adadad'
          }
        },
        //选择部门对话框滚动条配置
        groupTreeOptions: {
          vuescroll: {},
          scrollPanel: {},
          rail: {},
          bar: {
            background: '#adadad'
          }
        },
        searchUserId: 0,
        searchInput: '',
        node: {
          // 模拟接收到的部门id和部门名字
          groupName: '',
          parentId: '',
          groupCode: ''
        },
        // 部门下的人员列表
        tableData1: [
          {
            id: '',
            userId: '',
            employeeName: '',
            status: '',
            registerSource: '',
            type: '',
            sex: '',
            grade: '', // 年龄
            mobileShort: null,
            phoneShort: null,
            photo: null,
            orgCode: null,
            email: '',
            mobile: '',
            phone: '',
            idCard: '',
            position: '', // 岗位
            groups: [
              {
                id: '',
                createTime: null,
                updateTime: null,
                remark: null, // 备注
                groupCode: '',
                userId: '',
                status: '',
                shOrder: '',
                type: '',
                groupName: ''
              }
            ]
          }
        ],
        // 模态框相关
        dialog: {
          form: {
            userId: '',
            employeeName: '',
            registerSource: '',
            sex: '',
            grade: '',
            mobileShort: null,
            phoneShort: null,
            photo: null,
            orgCode: null,
            email: '',
            mobile: '',
            phone: '',
            idCard: '',
            position: '',
            mainGroup: '', // 所属部门
            groups: [
            ]
          },
          isNew: false,
          isReadOnly: true,
          depts: [], // 部门列表
          defaultDeptTreeProps: { // 设置tree的标题和孩子的数据名
            children: 'children',
            label: 'groupName'
          },
          childDialog: {
            deptTemp: {}, // 暂存树节点点击内容
            choooseGroupModal: false,
            index: '', // 要操作的部门数组下标
            type: '' // 要操作的部门类型 1主部门0兼职部门
          }
        },
        // 搜索相关
        searchList: {
          searchFlag: '', // 0:无搜索 1:搜索框 2:选择框 3:all
          tableData: []
        },
        // 分页相关
        page: {
          tableData: [],
          page: '', // 当前页
          pageSize: '', // 每页显示条数
          sizes: [],
          total: '' // 总条数
        },
        isShowUserInfoModal: false, //用户信息新增、详情对话框
        //表单验证
        ruleValidate: {
          employeeName: [{ required: true, message: '员工姓名不能空', trigger: 'blur' }],
          userId: [{ required: true, message: '用户编号不能为空', trigger: 'blur' }],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ],
          mainGroup: [
            { required: true, message: '部门不能为空', trigger: 'blur'}
          ]
        },
        userInfo: '', // 暂存用户信息
        //choooseGroupModal: false, //新增用户选择部门对话框
        curentData: '', // 当前部门树节点
        searchGroupText: '', //部门搜索相关
        editeRowIndex: '', //保存编辑用户行索引
      }
    },
    methods: {
      getTable2Columns () {
        const table2ColumnList = {
          name: {
            title: '编号',
            key: 'index',
            fixed: 'left',
            width: 70,
            render: (h, params) => {
              return h('div', [params.index+1
              ]);
            }
          },
          userId: {
            title: '用户名',
            key: 'userId',
            width: 90
          },
          employeeName: {
            title: '姓名',
            key: 'employeeName',
            sortable: true,
            width: 100
          },
          sex: {
            title: '性别',
            key: 'sex',
            width: 80,
            render: (h,params) => {
              return h('span',[params.row.sex === '1' ? '男' : '女'])
            }
          },
          mainGroup: {
            title: '主部门',
            width: 234,
            key:"mainGroup",
            render: (h,params) => {
              if (params.row.groups[0].type === '1') {
                return h('span',[params.row.groups[0].groupName])
              }else {
                for (let i=1;i<params.row.groups.length;i++) {
                  if (params.row.groups[i].type == '1') {
                    return h('span',[params.row.groups[i].groupName])
                  }
                }
              }
            }
          },
          position: {
            title: '岗位',
            key: 'position',
            width: 70
          },
          phone: {
            title: '电话',
            key: 'phone',
            width: 120
          },
          mobile: {
            title: '手机',
            key: 'mobile',
            width: 110
          },
          email: {
            title: '邮箱',
            key: 'email',
            width: 150
          },
          action: {
            title: '操作',
            key: 'action',
            width: 163,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showUserDetail(params.row,params.column,params.index)
                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.removeUser(params.row,params.column,params.index)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        }
        let data = [table2ColumnList.name];

        this.tableColumnsChecked.forEach(col => data.push(table2ColumnList[col]));

        return data;
      },
      //改变表格表头显示
      changeTableColumns () {
        this.userColumns = this.getTable2Columns();
      },
      //导出原始数据
      exportData () {
        this.$refs.userTable.exportCsv({
          filename: '用户原始数据',
          quoted: true
        });
      },
      getAllUser() {
        // 得到所有用户(pagebound)
        return personTableApi.getAllUsers()
      },
      //新增用户
      handleAddNewUser (dialog) {
        this.userInfoTitle = '用户信息【新增】'
        dialog.form = this.initForm()
        this.isShowUserInfoModal= true
        this.userOperation = 'add';
        this.handleDeptAdd(1)
      },
      // 用户修改部门
      handleDeptEdit(index, type) {
        this.dialog.childDialog.choooseGroupModal = true
        this.dialog.childDialog.index = index
        this.dialog.childDialog.type = type
      },
      // 用户添加部门
      handleDeptAdd(type) {
        const temp = {
          groupCode: '',
          groupName: '',
          userId: '',
          type: type
        }
        this.dialog.form.groups.push(temp)
      },
      // 用户删除部门
      handleDeptDelete(index) {
        this.dialog.form.groups.splice(index, 1)
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
      //搜索相关
      filterNode(value, data) {
        if (!value) return true;
        return data.groupName.indexOf(value) !== -1;
      },
      //部门节点点击事件
      handleGroupTreeClick(data,node,store) {
        this.dialog.childDialog.deptTemp = JSON.parse(JSON.stringify(data))
      },
      //响应新增用户部门选择取消按钮
      cancleChooseGroupBtn () {
        this.dialog.childDialog.choooseGroupModal = false
      },
      //响应新增用户选择部门选择确定按钮
      confirmChooseGroupBtn (childDialog){
          console.log('选择的部门:' + childDialog.deptTemp.groupName + '|' + childDialog.deptTemp.groupCode)
          var temp = {
            groupCode: childDialog.deptTemp.groupCode,
            groupName: childDialog.deptTemp.groupName,
            type: '',
            userId: this.dialog.form.userId
          }
          if (childDialog.type === 1) {
            temp.type = 1
            this.dialog.form.mainGroup = childDialog.deptTemp.groupName
          } else {
            temp.type = 0
          }
          this.dialog.form.groups.splice(childDialog.index, 1, temp)
          childDialog.deptTemp = {}
          childDialog.dialogVisible = false
          this.dialog.childDialog.choooseGroupModal = false
        },
      //用户详情
      showUserDetail (row,column,index) {
        console.log(row)
        this.userInfoTitle = '用户信息【编辑】'
        //this.getUser(row.userId)
        this.userInfo = row
        this.dialog.form = row
        this.editeRowIndex = index
        this.isShowUserInfoModal= true
        this.userOperation = 'update';
        if (row.groups[0].type == 1) {
          this.dialog.form.mainGroup =  row.groups[0].groupName
        } else {
          for (let i = 1; i < row.groups.length; i++) {
            if (row.groups[i].type == 1) {
              this.dialog.form.mainGroup =  row.groups[i].groupName
            }
          }
        }
      },
      //获取一个用户详情
      /*getUser (userId) {
        getUserInfo(userId).then((res) => {
          console.log(res)
          if (res.status == 200) {
            this.dialog.form = res.data
            this.dialog.form.mainGroup = this.dialog.form.groups[0].groupName
            this.isShowUserInfoModal= true
            this.userOperation = 'update';
          }
        })
      },*/
      //响应用户信息对话框按钮：取消、确定
      handleUserInfoBtn (type) {
        if (type === 'ok') {
          this.$refs.userInfoForm.validate((valid) => {
            if (valid) {
              this.saveUserInfo(this.userOperation)
            }
          })
        }else {
          this.isShowUserInfoModal = false
        }
      },
      //保存用户信息
      saveUserInfo (operation) {
        if (operation == 'update') {
          editeUserInfo(this.dialog.form)
            .then((res) => {
              if (res.status == 201) {
                this.getUsersOfGroup()
                this.$Message.success('保存成功')
                this.isShowUserInfoModal = false
              }
            })
        }else if (operation == 'add') {
          addUser(this.dialog.form)
            .then((res) => {
              if (res.status === 201) {
                this.getUsersOfGroup()
                this.isShowUserInfoModal = false
                this.$Message.success('新增成功')
                this.resetUserInfoForm();
              }
            })
        }
      },
      //对话框状态改变时取消验证
      stateChange (userInfoForm) {
        this.$refs[userInfoForm].resetFields();
      },
      //用户删除
      removeUser (row,column, index) {
        var _this = this
        this.$Modal.confirm({
          title: '用户删除',
          content: `您确定要删用户【${row.employeeName}】吗?`,
          okText: '确定',
          cancelText: '取消',
          onOk () {
            //确定删除
            _this.execDeleteUser(row.userId,index)
          },
          onCancel () {
            //取消删除
            this.$Message.info({
              content: '已取消删除',
              duration: 1,
              top: 200,
            })
          }
        })
      },
      //执行删除操作
      execDeleteUser (userId,index) {
        delUserById (userId).then((res) => {
          this.page.tableData.splice(index, 1);
          this.$Message.success('用户删除成功');
        })
      },
      //重置用户信息表单
      resetUserInfoForm() {
        for(let item in this.dialog.form) {
          this.dialog.form[item] = null;
        }
        this.dialog.form.groups = []
      },
      // 获取用户table 高度
      getHeight() {
        var tHeadHeight = this.$refs.btns.$el.offsetHeight
        var tFootHeight = this.$refs.pageFooter.$el.offsetHeight
        this.tableHeight = window.innerHeight - 64 - 40 - tHeadHeight - tFootHeight - 50
        this.tabbleBoxHeight = window.innerHeight - 130
      },
      fuzzySearchUsers(key) {
        // 模糊搜索用户
        return searchUser(key)
      },
      getUsersOfGroup() {
        // 根据部门id找用户
        var page = this.page.page
        var size = this.page.pageSize
        usersOfGroup(this.node.groupCode, page, size)
          .then((response) => {
            if (response.status === 200) {
              this.tableData1 = JSON.parse(JSON.stringify(response.data.items))
              this.page.total = response.data.total
              this.getTableDate(this.tableData1)
            }
          })
      },
      getGroupCodeByUserTree() {
        // 接受userTree组件传来的数据，tree选择的部门
        Bus.$on('triggerEventFromGroupTree', (data) => {
          var temp = Object.assign({}, data)
          this.node.groupCode = temp.groupCode
          // 获取部门的所有用户
          this.init1()
          this.getUsersOfGroup()
        })
      },
      getTableDate(data) {
        // 获取每个分页数据
        this.page.tableData = []
        if (this.searchList.searchFlag !== 0) {
          let a = (Number(this.page.page) - 1) * Number(this.page.pageSize) // 起始位置
          let b = a + Number(this.page.pageSize) - 1 // 结束位置
          var c = data.length - 1
          if (c <= b) { b = c }
          while (a <= b) {
            this.page.tableData.push(data[a])
            a++
          }
        } else {
          this.page.tableData = JSON.parse(JSON.stringify(data))
        }
      },
      // 根据userId，userName，phone和idCard搜索全公司人员显示table内容
      handleSearch() {
        this.searchList.tableData = []
        if (this.searchInput.trim() === '') {
          this.init1()
          this.getUsersOfGroup()
        } else {
          this.searchList.searchFlag = 1
          // 获取公司所有符合搜索条件的人userId，userName，phone和idCard模糊搜索
          this.fuzzySearchUsers(this.searchInput.trim())
            .then((response) => {
              if (response.status === 200) {
                this.searchList.tableData = JSON.parse(JSON.stringify(response.data.items))
                this.page.total = response.data.total
                this.init2()
                this.getTableDate(this.searchList.tableData)
                this.$Message.success('搜索成功')
              }
            })
        }
      },
      // 每页条数选项变化触发事件
      handleSizeChange(val) {
        // alert(`每页 ${val} 条`);
        this.page.pageSize = parseInt(val)
        if (this.searchList.searchFlag !== 0) {
          this.init2()
          this.getTableDate(this.searchList.tableData)
        } else {
          this.init2()
          this.getUsersOfGroup()
        }
      },
      // 当前页变化触发事件，val为点击的页码
      handleCurrentChange(val) {
        // alert(`当前页: ${val}`);
        this.page.page = parseInt(val)
        if (this.searchList.searchFlag !== 0) {
          this.getTableDate(this.searchList.tableData)
        } else {
          this.getUsersOfGroup()
        }
      },
      // 初始化
      init1() {
        this.page.pageSize = 20 // 初始化每页显示条数
        this.page.page = 1 // 初始化当前页
        this.page.total = 0 // 初始化总条数
        this.page.sizes = [8, 10, 20, 40, 80, 100]
        this.searchList.searchFlag = 0 // 初始化搜索状态
        this.searchInput = ''
        this.dialog.isNew = false // 初始化是否新建用户
      },
      // 初始化
      init2() {
        this.page.page = 1 // 初始化当前页
        this.dialog.isNew = false // 初始化是否新建用户
      },
      initForm() {
        // 初始化form表单
        const form = {
          userId: '',
          employeeName: '',
          registerSource: '',
          sex: '',
          grade: '',
          mobileShort: null,
          phoneShort: null,
          photo: null,
          orgCode: null,
          email: '',
          mobile: '',
          phone: '',
          idCard: '',
          position: '',
          mainGroup: '', // 所属部门
          groups: []
        }
        return form
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
      )}
    },
    watch: {
      //用户搜索
      searchInput: function(val) {
        if (this.searchUserId) {
          clearTimeout(this.searchUserId)
        }
        this.searchUserId = setTimeout(() => { this.handleSearch() }, 400)
      },
      //新增用户部门搜搜
      searchGroupText(val) {
        this.$refs.groupTree.filter(val)
      },
    },
    mounted() {
      this.getHeight() // 设置table高度
      //this.getAllGroups() // 加载部门树
      this.getGroups()
      this.changeTableColumns()
      this.contentHeight =consts.pageDivHeight.contentHeight()
    },
    created() {
      this.node.groupCode = '0001' // 'D2580/0016' // 设置默认显示部门
      this.init1()
      this.getUsersOfGroup()
      this.getGroupCodeByUserTree() // userTree选择的部门
    }
  }
</script>

<style lang="less">
  .group-management-container{
    height: 100%;
    overflow: hidden;
    border: 1px solid #ddd;
    padding: 10px 0px 10px 10px;
    background: #fff;
    .user-table{
      padding-right: 12px;
      .user-table-header{
        height: 50px;
      }
      .user-table-footer{
        text-align: right;
        padding: 20px 20px 20px 0px;
      }
    }
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .loading_wrapper{
    height: 100%;
    position: relative;
    top: 200px;
    font-size: 30px;
  }
  .ivu-input-wrapper {
    display: inline-block;
    width: 93%;
    position: relative;
    vertical-align: middle;
    line-height: normal;
  }
  .content {
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
          color: #2db7f5;
        }
        display: inline-block;
        width: 95%;
        padding-left: 3px;
        padding-top: 2px;
        .group-title{
          font-size: 14px;
          padding-left: 5px;
        }
      }
    }
  }
</style>
