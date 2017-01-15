<template>
<div>
  <foxgis-layout>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer">
      <div class="mdl-layout__drawer" id="nav_bar">
        <nav class="mdl-navigation">
          <div style="padding-left: 10px;background: #ccc;">
            <i class="material-icons">wallpaper</i>
            <span style="top: -5px;position: relative;">制图</span>
          </div>
          <a class="mdl-navigation__link" v-link="{ path: '/maps' }">
            <i class="material-icons">map</i>制图工程<span v-mdl-badge.number="map_nums"></span>
          </a>
          <a class="mdl-navigation__link" v-link="{ path: '/tile' }">
            <i class="material-icons">layers</i>瓦片集<span v-mdl-badge.number="tileset_nums"></span>
          </a>
          <!--
          <a class="mdl-navigation__link" v-link="{ path: '/data' }">
            <i class="material-icons">public</i>数据集<span v-mdl-badge.number="dataset_nums"></span>
          </a>
          -->
          <a class="mdl-navigation__link" v-link="{ path: '/fonts' }">
            <i class="material-icons">text_format</i>字体<span v-mdl-badge.number="font_nums"></span>
          </a>
          <a class="mdl-navigation__link" v-link="{ path: '/sprites' }">
            <i class="material-icons">place</i>符号库<span v-mdl-badge.number="sprite_nums"></span>
          </a>
          <div style="padding-left: 10px;background: #ccc;">
            <i class="material-icons">widgets</i>
            <span style="top: -5px;position: relative;">地图展示</span>
          </div>
          <a class="mdl-navigation__link" v-link="{ path: '/timap' }">
            <i class="material-icons">restore</i>时态地图展示
          </a>
        </nav>
      </div>
      <div class="mdl-layout__content" id="layout_content">
        <router-view></router-view>
      </div>
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
      if(window.location.hash=="#!/"){
        window.location = '#!/maps';
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
.mdl-layout--fixed-drawer>.mdl-layout__content {
  background-color: #e4e4e4;
  height: 100%;
}

.mdl-navigation {
  border-top: 1px solid rgba(0,0,0,.1);
}

.mdl-navigation a {
  cursor: pointer;
}

.material-icons {
  padding-right: 10px;
}

.v-link-active {
  background-color: #e0e0e0;
}

.mdl-badge {
  position: absolute;
  white-space: nowrap;
  margin-right: 24px;
  right: 76px;
}

.mdl-badge:after {
  top: -3px!important;  
  right: -70px!important;
}
</style>

