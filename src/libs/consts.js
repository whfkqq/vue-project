export default {
  //存储一些常用的常量
  pageDivHeight:
    {
      header:0,
      footer:0,
      contentPadding:18,
      contentHeight:function(){
        return window.innerHeight-this.header-this.footer-this.contentPadding*2
      }
    }
}

