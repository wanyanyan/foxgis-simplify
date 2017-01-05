<template>
<div class="hide_show_btn">
  <i class="material-icons" title="隐藏" @click="hiddenPanel($event)">keyboard_arrow_left</i>
</div>
<div class="data">
  <div id="timap-view"></div>
  <!-- <iframe src="http://www.baidu.com" width="80%" height="80%"> -->
  
</div>
</template>


<script>
export default {
  methods: {
    hiddenPanel:function(e) {
      var text = $(e.target).text();
      if(text === "keyboard_arrow_left"){
        $(e.target).text("keyboard_arrow_right");
        $(e.target).attr('title','显示');
        $("#nav_bar").hide();
        $("#layout_content").css('margin-left','0px');
      }else{
        $(e.target).text("keyboard_arrow_left");
        $(e.target).attr('title','隐藏');
        $("#nav_bar").show();
        $("#layout_content").css('margin-left','240px');
      }
    }
  },
  attached() {
    if($("#timap-view iframe").length > 0){
      return;
    }else{
      var iframe = document.createElement("iframe");
      iframe.setAttribute('id',"fatherSVG");
      iframe.setAttribute('src',"http://www.baidu.com");
      iframe.setAttribute('style',"width: 100%; height: 100%;");
      $("#timap-view").append(iframe);
    }
  }
} 
</script>


<style scoped>
.hide_show_btn {
  position: absolute;
  background-color: #f3f3f3;
  top: 50%;
  cursor: pointer;
  width: 13px;
  height: 60px;
  border-right: 1px solid #cccccc;
  border-top: 1px solid #cccccc;
  border-bottom: 1px solid #cccccc;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
}
.hide_show_btn:hover {
  background-color: #DCD9D9;
}
.hide_show_btn i {
  font-size: 16px;
  line-height: 60px;
}
.data {
  height: 100%;
  width: 100%;
}
#timap-view{
  width: 100%;
  height: 100%;
}
</style>
