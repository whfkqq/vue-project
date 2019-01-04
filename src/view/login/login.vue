<template>
  <div id="newLogin">
    <div class="header">

        <div class="col-h-1" >
          <img class="img-t-1" src="../../assets/images/login/img_name_top.png" alt="logo">
        </div>
        <div  class="col-h-2">
          <div class="btn-t-1" @click="handleSupport">技术支持</div>
          <div class="btn-t-2" @click="handleLogin">登陆</div>
        </div>

    </div>
    <div class="content">
      <img src="../../assets/images/login/img_login_bg_01.png" class="bg-img"/>
      <div class="login-wrapper">
        <img src="../../assets/images/login/img_login_name.png" alt="title" class="login-title">
        <div class="login-form">
          <login-form ref="login"></login-form>

        </div>
      </div>

    </div>
    <div class="footer">
      版权所有©2018中泰证券，Inc保留全部权利。
    </div>



  </div>
</template>

<script>
  import loginForm from '@/view/login/components/loginForm.vue'

    export default {
      name: "login",
      components:{loginForm},
      methods:{
        handleSupport(){
          this.$Message.info('请邮件联系我们');
        },
        handleLogin(){
          this.$refs.login.handleSubmit()
        }
      }
    }
</script>

<style >

  body{
    overflow-y: auto;
  }
  #newLogin{
    width: 100%;
    height: 100%;
    /*max-width: 1920px;*/
    background: #ffffff;
  }
  .header{
    height: 80px;
    border-bottom: #999999 solid 1px;
  }

  .col-h-1{
    float: left;
    height: 80px;
  }
  .col-h-2{
    height: 80px;
    width: 240px;
    float: right;
  }

  .img-t-1{
    height: 48px;
    width: 300px;
    margin-top: 12px;
    margin-left: 20px;
    /*display: block;*/
  }

  .btn-t-1,.btn-t-2{
    position: relative;
    font-size: 16px;
    width: 50%;
    text-align:center;
    display: inline-block;
    top: 50%;
    transform: translate(0, -50%)
  }
  .btn-t-1{
    border-right: black solid 1px;
  }

  .content{
    height: 800px;
    position: relative;
  }
  .bg-img{
    height: 800px;
    width: 1518px;
  }

  .login-wrapper{
    width: 400px;
    /*height: 450px;*/
    position: absolute;
    right: 120px;
    top: 25%;
    padding: 30px 20px 30px;
    border-radius: 8px;
    background: #fff;
  }
  .login-title{
    width: 100%;
    height: 72px;
    margin-bottom: 30px;
  }
  .login-form{
    /*padding-top: 45px;*/
    /*padding-bottom: 15px;*/
  }


  .footer{
    width: 100%;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

</style>
