<template>
<div class="foxgis-layout">
  <div class="mdl-layout mdl-js-layout">
    <header class="mdl-layout__header mdl-layout__header--seamed">
      <div class="header-top">
        <div class="header">
          <div class="base-title">
            <span>基础地理信息数据库展示系统</span>
          </div>
          <div class="contact-us">
            <a href="javascript:void(0);">关于我们 </a>|
            <a href="javascript:void(0);">意见反馈 </a>|
            <a href="javascript:void(0);">联系我们 </a>|
          </div>
        </div>
      </div>
    </header>

    <div class="mdl-layout--content">
      <slot>Layout content</slot>
    </div>

  </div>
</div>
</template>


<script>
import Cookies from 'js-cookie'
export default {
  methods: {
    signout: function(){
      Cookies.remove('username');
      Cookies.remove('access_token');
      Cookies.remove('name');
      Cookies.remove('phone');
      Cookies.remove('email');
      Cookies.remove('location');
      Cookies.remove('organization');
      window.location.href = '/';
    },

    showUserCenter: function(){
      if(document.querySelector('.userCenter').style.display === 'none'){
        document.querySelector('.userCenter').style.display = 'block';
      }else{
        document.querySelector('.userCenter').style.display = 'none';
      }
      
    }
  },
  ready() {
    /*global componentHandler */
    componentHandler.upgradeElement(this.$el.firstElementChild);
  },
  attached: function() {
    //判断是否登陆
    var username = Cookies.get('username');
    if(username !== undefined){
      this.username = username;
    }
  },
  data: function(){
    return {
      username: undefined
    }
  }
}

</script>


<style scoped>
.mdl-layout__header {
  background-color: white;
}

.header-top{
  background-color: #1f57a2;
  height: 64px;
}
.header-top .header{
  width: 1100px;
  height: 100%;
  background-image: url("../../../static/images/header.jpg");
  background-repeat: no-repeat;
  background-position: 65px 0px;
  margin:0 auto;
}
.base-title{
  float: left;
  line-height: 52px;
}
.base-title span{
  color: white;
  /* background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(rgba(255, 255, 255, 1)), to(rgba(222, 222, 222, 1)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; */
  font-size: 40px;
}
.contact-us{
  color: #b1b1b1;
  float: right;
  margin-right: 10px;
  margin-top: 40px;
}

.contact-us a{
  color: #b1b1b1;
  text-decoration: none;
  font-size: 14px;
}

.mdl-layout.has-drawer .mdl-layout__header > .mdl-layout-icon {
  display: block;
  width: 48px;
  height: 48px;
  top: 8px;
}

.mdl-layout__header-row {
  height: 60px;
  width: 1100px;
  margin:0 auto;
  padding: 0;
}

.mdl-layout__header-row .mdl-layout-title span{
  color: #2f80bc;
  font-family: SimHei;
  font-size: 26px;
}

.mdl-navigation{
  line-height: 30px;
  position: relative;
  height: 100%;
  left: 100px;
}

.mdl-layout__header-row .mdl-navigation__link.v-link-active{
  background-color: rgb(15, 109, 178);
  color: white;
}
.v-link-active svg path{
  fill:#ffffff;
}
.v-link-active span{
  color:#ffffff;
}
.mdl-layout__header-row .mdl-navigation__link {
  font-size: 1em;
  line-height: 50px;
  padding: 0;
  cursor: pointer;
  width: 150px;
  text-align: center;
  color: #313131;
}
.mdl-navigation__link div{
  width: 100%;
  height: 30px;
  margin: 0 auto;
}
.mdl-navigation__link div:last-child{
  border-right: 1px solid #c3c3c3;
}
.mdl-navigation__link svg{
  width: 24px;
  height: 24px;
  position: relative;
  bottom: 10px;
}
.mdl-navigation__link span{
  position: relative;
  bottom: 10px;
}
.mdl-layout--content {
  height: 100%;
  position:relative;
  min-height: calc(100% - 100px);
  background-color: #e4e4e4;
  display: flex;
  flex-flow: column;
  overflow: auto;
}

a.disabled {
   pointer-events: none;
   cursor: default;
}

.download_link{
  cursor: pointer;
}

.userCenter{
  height: 60px;
  width: 110px;
  z-index: 9999;
  position: absolute;
  right: 0;
  background-color: #3f51b5;
  text-align: center;
  line-height: 30px;
  display: none;
}

.userCenter a{
  display: inherit;
  cursor: pointer;
  color: #fff;
  text-decoration: none;
}

</style>
