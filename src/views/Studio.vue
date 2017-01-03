<template>
<div>
  <foxgis-layout>
  <div class="content">
    <div class="layout-container">
      <div class="mdl-layout__drawer">
        <nav class="mdl-navigation">
          <a class="mdl-navigation__link" v-link="{ path: '/maps' }">
            <i class="material-icons">map</i>制图工程<span v-mdl-badge.number="map_nums"></span>
          </a>
          <a class="mdl-navigation__link" v-link="{ path: '/tile' }">
            <i class="material-icons">layers</i>瓦片集<span v-mdl-badge.number="tileset_nums"></span>
          </a>
          <a class="mdl-navigation__link" v-link="{ path: '/data' }">
            <i class="material-icons">public</i>数据集<span v-mdl-badge.number="dataset_nums"></span>
          </a>
          <a class="mdl-navigation__link" v-link="{ path: '/fonts' }">
            <i class="material-icons">text_format</i>字体<span v-mdl-badge.number="font_nums"></span>
          </a>
          <a class="mdl-navigation__link" v-link="{ path: '/sprites' }">
            <i class="material-icons">place</i>符号库<span v-mdl-badge.number="sprite_nums"></span>
          </a>
        </nav>
      </div>
      <div class="mdl-layout__content">
        <router-view></router-view>
      </div>
    </div>
    <!-- <foxgis-footer></foxgis-footer> -->
  </div>
  </foxgis-layout>
</div>
</template>


<script>
import Cookies from 'js-cookie'

export default {
  methods: {
    
  },
  ready() {
    /*global componentHandler */
    componentHandler.upgradeElement(this.$el.firstElementChild);
  },
  login:function(){
    var url = SERVER_API.users;
    var username = "geoway";
    var password = "123456";
    url += '/'+username;
    this.$http.post(url,{'username':username,'password':password}).then(function(response){
      loginbutton.disabled = false;
      var data = response.data;
      var access_token = data.access_token;
      var username = data.username;
      var name = data.name;
      var email = data.email;
      var phone = data.phone;
      var organization = data.organization;
      var location = data.location;
      var role = data.role;
      var days = 0;

      Cookies.set('access_token',access_token);
      Cookies.set('username',username);
      if(name!=undefined){
        Cookies.set('name',name);
      }
      if(email!=undefined){
        Cookies.set('email',email);
      }
      if(phone!=undefined){
        Cookies.set('phone',phone);
      }
      if(location!=undefined){
        Cookies.set('location',location);
      }
      if(organization!=undefined){
        Cookies.set('organization',organization);
      }
      if(role!=undefined){
        Cookies.set('role',role);
      }
    },function(response){
      loginbutton.disabled = false;
      this.showError('用户名或密码错误');
    })
  },
  attached: function() {
    var url = SERVER_API.users;
    var username = "geoway";
    var password = "123456";
    url += '/'+username;
    this.$http.post(url,{'username':username,'password':password}).then(function(response){
      var data = response.data;
      var access_token = data.access_token;
      var username = data.username;
      var name = data.name;
      var email = data.email;
      var phone = data.phone;
      var organization = data.organization;
      var location = data.location;
      var role = data.role;
      var days = 0;

      Cookies.set('access_token',access_token);
      Cookies.set('username',username);
      if(name!=undefined){
        Cookies.set('name',name);
      }
      if(email!=undefined){
        Cookies.set('email',email);
      }
      if(phone!=undefined){
        Cookies.set('phone',phone);
      }
      if(location!=undefined){
        Cookies.set('location',location);
      }
      if(organization!=undefined){
        Cookies.set('organization',organization);
      }
      if(role!=undefined){
        Cookies.set('role',role);
      }
      this.username = username;
      var tileset_url = SERVER_API.tilesets + '/' + username;
      var dataset_url = SERVER_API.datasets + '/' + username;
      var fonts_url = SERVER_API.fonts + '/' + username;
      var sprites_url = SERVER_API.sprites + '/' + username;
      var maps_url = SERVER_API.styles+'/' + username;

      this.$http({url: maps_url, method: 'GET', headers: { 'x-access-token': access_token } })
      .then(function(response) {
        var data = response.data;
        this.map_nums = data.length;
      },function(response){

      });

      this.$http({url: tileset_url, method: 'GET', headers: {'x-access-token': access_token}})
      .then(function(response) {
        var data = response.data;
        this.tileset_nums = data.length;
      },function(response){

      });

      this.$http({url: dataset_url, method: 'GET', headers: {'x-access-token': access_token}})
      .then(function(response) {
        var data = response.data;
        this.dataset_nums = data.length;
      },function(response){

      });

      this.$http({url: fonts_url, method: 'GET', headers: {'x-access-token': access_token}})
      .then(function(response) {
        var data = response.data;
        this.font_nums = data.length;
      },function(response){

      });

      this.$http({url: sprites_url, method: 'GET', headers: {'x-access-token': access_token}})
      .then(function(response) {
        var data = response.data;
        this.sprite_nums = data.length;
      },function(response){

      });
    },function(response){
      loginbutton.disabled = false;
      this.showError('用户名或密码错误');
    });
  },
  data: function(){
    return {
      username: '用户',
      upload_nums:0,
      sprite_nums:0,
      dataset_nums:0,
      tileset_nums:0,
      map_nums:0,
      font_nums:0
    }
  },
  events: {
    "sprite_nums":function(msg) {
      this.sprite_nums = parseInt(msg);
    },

    "dataset_nums":function(msg) {
      this.dataset_nums = parseInt(msg);
    },

    "tileset_nums":function(msg) {
      this.tileset_nums = parseInt(msg);
    },
    
    "font_nums":function(msg){
      this.font_nums = parseInt(msg);
    },

    "map_nums":function(msg){
      this.map_nums = parseInt(msg);
    }
  }
}

</script>


<style scoped>
.layout-container{
  position: relative;
  width: 1100px;
  /* background-color: white; */
  margin: 10px auto;
}
.mdl-layout__drawer{
  width: 200px;
  display: block;
  position: absolute;
  overflow: initial;
  /* float: left; */
  -webkit-transform: inherit;
  transform: inherit;
  box-shadow: none;
  z-index: initial;
  background-color: transparent;
}
.mdl-layout__content{
  width: 895px;
  display: block;
  clear:both;
  float: right;
  position: initial;
  /* position: relative;
  bottom: 252px; */
}
.content>.mdl-layout__content {
  background-color: #e4e4e4;
}

.mdl-layout__drawer .mdl-navigation{
  padding: 0;
  background-color: white;
}
.mdl-layout__drawer .mdl-navigation .mdl-navigation__link{
  padding: 8px 7px;
  color: #5d5d5d;
  cursor: pointer;
  border-bottom: 1px solid rgba(0,0,0,.1);
}
.mdl-layout__drawer .mdl-navigation .v-link-active {
  color: #2f80bc;
}
.mdl-layout__drawer .mdl-navigation .mdl-navigation__link:hover {
  background-color: #ffffff;
  color: #2f80bc;
}

.material-icons {
  padding-right: 10px;
}

.mdl-badge {
  position: absolute;
  white-space: nowrap;
  margin-right: 5px;
  right: 76px;
}
.mdl-layout__drawer .mdl-navigation .v-link-active .mdl-badge[data-badge]:after{
  background-color: #2f80bc;
}
.mdl-layout__drawer .mdl-navigation .mdl-navigation__link:hover .mdl-badge[data-badge]:after{
  background-color: #2f80bc;
}
.mdl-badge[data-badge]:after{
  width: 22px;
  height: 20px;
  border-radius: 3px;
  background: #9a9a9a;
  color: #fff;
  font-family: inherit;
}
.mdl-badge:after {
  top: 1px!important;  
  right: -70px!important;
}

</style>

