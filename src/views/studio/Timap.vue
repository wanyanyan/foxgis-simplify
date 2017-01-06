<template>
<div class="hide_show_btn" @click="hiddenPanel">
  <i class="material-icons" title="隐藏">keyboard_arrow_left</i>
</div>
<div class="data">
  <div id="timap-view"></div>
</div>
</template>


<script>
export default {
  methods: {
    hiddenPanel:function() {
      if($("#nav_bar").is(":visible")){
        $(".hide_show_btn i").text("keyboard_arrow_right");
        $(".hide_show_btn i").attr('title','显示');
        $("#nav_bar").fadeOut(200);
        $("#layout_content").animate({'margin-left':'0px'},200);
      }else{
        $(".hide_show_btn i").text("keyboard_arrow_left");
        $(".hide_show_btn i").attr('title','隐藏');
        $("#nav_bar").fadeIn(200);
        $("#layout_content").animate({'margin-left':'240px'},200);
      }
    }
  },
  attached() {
    if($("#timap-view iframe").length > 0){
      return;
    }else{
      var iframe = document.createElement("iframe");
      iframe.setAttribute('id',"fatherSVG");
      iframe.setAttribute('src',"/timap");
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
  transform: translate(0,-50%);
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
