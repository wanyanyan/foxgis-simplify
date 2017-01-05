<template>
<div class="data">
  <div id="timap-view"></div>
  <!-- <iframe src="http://www.baidu.com" width="80%" height="80%"> -->
  
</div>
</template>


<script>
export default {
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
.data {
  height: 100%;
  width: 100%;
}
#timap-view{
  width: 100%;
  height: 100%;
}
</style>
