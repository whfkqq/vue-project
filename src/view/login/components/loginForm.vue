<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <div class="form-wrapper">
        <Input class="form-input"  v-model="form.userName" placeholder="用户名">
          <i class="iconfont icon-zhucedengluyonghuming login-icon" slot="prefix" />
        </Input>
      </div>

    </FormItem>

    <FormItem prop="password">
      <div class="form-wrapper">
        <Input class="form-input" type="password" v-model="form.password" placeholder="密码">
          <i class="iconfont icon-mima login-icon" slot="prefix" />
        </Input>
      </div>
    </FormItem>

    <div class="form-wrapper">
      <Checkbox v-model="form.remeberMe">记住密码</Checkbox>
      <a class="forget" @click="handleForget">忘记密码</a>
    </div>

    <Button @click="handleSubmit" type="primary" class="submit">登&nbsp&nbsp录</Button>


  </Form>
</template>
<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'loginForm',
    data () {
      return {
        form: {
          userName: '',
          password: '',
          remeberMe: false
        },
        rules:{
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      ...mapActions([
        'handleLogin',
        'getUserInfo'
      ]),
      handleSubmit () {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            var userName=this.form.userName
            var password=this.form.password
            var remeberMe=this.form.remeberMe
            this.handleLogin({userName,password,remeberMe}).then(res => {
                console.log("登陆成功")
                this.$router.push({
                  name: this.$config.homeName
                })
            }).catch(res => {
            	console.log('loginform',res)
              if(res.response.status === 400 || res.response.status===401){
                this.$Message.info('账号或密码错误');
              }else{
                this.$Message.info('登陆失败');
              }
            })
          }
        })
      },
      handleForget(){
        this.$Message.info('敬请期待');
      }


    }
  }
</script>
<style lang="less">
  @import "form.less";

</style>
