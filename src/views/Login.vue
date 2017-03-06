<template>
<div>
  
</div>
</template>

<script>

import Cookies from 'js-cookie'
export default {
  methods:{
    login: function(e){
      var url = SERVER_API.users;
      var loginbutton = e.target.parentElement;
      loginbutton.disabled = true;
      var username = "geoway";
      var password = "123456";
      url += '/'+username;
      this.$http.post(url,{'username':username,'password':password}).then(function(response){
        loginbutton.disabled = false;
        var data = response.data;
        if(!data.is_verified){
          this.showError('用户未认证，请联系管理员');
          return;
        }
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
        
        //跳转不好处理，所以统一跳转到首页
        window.location.href = '#!/studio';
        console.log("跳转")
      },function(response){
        loginbutton.disabled = false;
        this.showError('用户名或密码错误');
      })
    }
  },
  attached() {
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
      
      //跳转不好处理，所以统一跳转到首页
      var hash = window.location.href.split("hash=")[1]
      if(hash){
        window.location.href = '#!'+hash;
      }else{
        window.location.href = '#!/studio';
      }
    },function(response){
    })
  }
}

</script>


<style scoped>

</style>
