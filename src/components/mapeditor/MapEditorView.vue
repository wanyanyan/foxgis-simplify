<template>
  <div id='map-editorview-container'>
    <mdl-snackbar display-on="mailSent"></mdl-snackbar>
    <div id='info-container'>
      <div class="map-popup">
        <div class="popup-tit">
          <h3>查询结果</h3>
        </div>
        <div class="popup-con">
          <div class="identify-layer">
            图层：<select id="pop-identify-select" @change="layerSelect($event)">
              <option value="{{layer}}" v-for="(layer,meta) in querySourceLayers">{{layer}}</option>
            </select>
          </div>
          <div class="identify-content">
            <div style="position: relative; overflow: hidden; width: auto; height: 100%;">
              <div class="identify-table">
                <table>
                  <tbody>
                    <tr v-for="(key,value) in selectedPopLayer.properties">
                      <td class="item-name">{{key}}</td>
                      <td class="item-value">{{value}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div id='info-tip'></div>
        <i class="material-icons" id="close-info" v-on:click="closeInfoContainer">clear</i>
      </div>
    </div>

    <div id="location-control" style='display:none' v-on:mousedown="boxDragStart" v-on:mouseup="boxDragEnd">
      <div class="dragmove" v-on:mousedown="boxMoveStart"></div>
      <div class="dragresize dragresize-lt" v-on:mousedown="dragresizedown"></div>
      <div class="dragresize dragresize-t" v-on:mousedown="dragresizedown"></div>
      <div class="dragresize dragresize-rt" v-on:mousedown="dragresizedown"></div>
      <div class="dragresize dragresize-l" v-on:mousedown="dragresizedown"></div>
      <div class="dragresize dragresize-r" v-on:mousedown="dragresizedown"></div>
      <div class="dragresize dragresize-lb" v-on:mousedown="dragresizedown"></div>
      <div class="dragresize dragresize-b" v-on:mousedown="dragresizedown"></div>
      <div class="dragresize dragresize-rb" v-on:mousedown="dragresizedown"></div>
    </div>
    <div style="position: absolute;bottom: 0;right: 0;z-index: 1;font-size:12px;" >
      <span style="color: #EC7500;" v-if="map.getZoom">级别：{{map.getZoom()}}</span>
      <span style="color: #EC7500;" v-if="map.getCenter">中心：{{map.getCenter().lng}},{{map.getCenter().lat}}</span>
    </div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { diff, validate} from 'mapbox-gl-style-spec'
import { changeStyle } from '../../vuex/actions'
import util from '../util.js'
import Cookies from 'js-cookie'
export default {
  vuex: {
    getters: {
      style: state => state.map.style
    },
    actions: {
      changeStyle
    }
  },
  methods: {
    // 地图点击 弹出info
    mapClick: function(e){
      var infoContainer = document.getElementById('info-container');
      var clickBuffer = 2;
      var southWest = {x:e.point.x-clickBuffer,y:e.point.y+clickBuffer};
      var northEast = {x:e.point.x+clickBuffer,y:e.point.y-clickBuffer};
      var features = this.map.queryRenderedFeatures([southWest,northEast]);
      this.querySourceLayers = {};
      this.selectedPopLayer.properties = {};
      this.selectedPopLayer.length = 0;
      var sourceLayers = {};
      if(features.length===0){
        infoContainer.style.display = 'none';
        return;
      }
      for(let i=0;i<features.length;i++){
        var sourceLayer = features[i].layer["source-layer"];
        var properties = features[i].properties;
        var type = features[i].geometry.type;
        if(sourceLayer&&!sourceLayers[sourceLayer]){
          sourceLayers[sourceLayer]={
            type:type,
            properties:properties
          }
        }
      }
      this.querySourceLayers = sourceLayers;
      if(Object.keys(this.querySourceLayers).length>0){
        var i = 0;
        for(var layer in this.querySourceLayers){
          if(i === 0){
            $("#pop-identify-select").val(layer);
            this.selectedPopLayer.properties = this.querySourceLayers[layer].properties;
            this.selectedPopLayer.length = Object.keys(this.querySourceLayers[layer].properties).length;
            i++;
          }
        }
        infoContainer.style.display = 'block';
        infoContainer.style.left = e.point.x-155 + 'px';
        var h = (this.selectedPopLayer.length)*27+16;
        if(h>300){h = 300;}
        infoContainer.style.top = e.point.y-87-h+'px';
      }
    },
    layerSelect: function(e){
      var infoContainer = document.getElementById('info-container');
      var oldHeight = infoContainer.offsetHeight;
      var layerName = e.target.value;
      if(Object.keys(this.querySourceLayers).length>0){
        for(var layer in this.querySourceLayers){
          if(layer === layerName){
            this.selectedPopLayer.properties = this.querySourceLayers[layer].properties;
            this.selectedPopLayer.length = Object.keys(this.querySourceLayers[layer].properties).length;
            break;
          }
        }
      }
      var h = (this.selectedPopLayer.length)*27+16;
      if(h>300){h = 300;}
      var newHeight = h+87;
      var c = newHeight - oldHeight;
      infoContainer.style.top = Number(infoContainer.style.top.split('px')[0]) - c + 'px' ;
    },
    // 点击时，绑定事件
    dragresizedown: function(e){
      //标记点击的是哪个按钮
      this.controlBound.dragButton = e.target.className;
      document.addEventListener('mousemove',this.dragresizemove,false);
      document.addEventListener('mouseup',this.dragresizeup,false);
    },
    //拖动时 改变bound
    dragresizemove: function(e){
      var controlBox = document.getElementById("location-control");
      var mapBound = this.mapBound;
      var boxBound = controlBox.getBoundingClientRect();
      var name = this.controlBound.dragButton;
      var map = this.map;
      if(name.indexOf("dragresize-lt")!=-1){
        this.controlBound.nw = map.unproject([e.pageX - mapBound.left, e.pageY-mapBound.top]);
      }else if(name.indexOf("dragresize-rt")!=-1){
        this.controlBound.nw = map.unproject([boxBound.left - mapBound.left, e.pageY - mapBound.top]);
        this.controlBound.se = map.unproject([e.pageX - mapBound.left, boxBound.top - mapBound.top + boxBound.height]);
      }else if(name.indexOf("dragresize-lb")!=-1){
        this.controlBound.nw = map.unproject([e.pageX - mapBound.left, boxBound.top - mapBound.top]);
        this.controlBound.se = map.unproject([boxBound.left - mapBound.left + boxBound.width, e.pageY-mapBound.top]);
      }else if(name.indexOf("dragresize-rb")!=-1){
        this.controlBound.se = map.unproject([e.pageX - mapBound.left, e.pageY - mapBound.top]);
      }else if(name.indexOf("dragresize-t")!=-1){
        this.controlBound.nw = map.unproject([boxBound.left - mapBound.left, e.pageY - mapBound.top]);
      }else if(name.indexOf("dragresize-b")!=-1){
        this.controlBound.se = map.unproject([boxBound.left - mapBound.left + boxBound.width, e.pageY - mapBound.top]);
      }else if(name.indexOf("dragresize-r")!=-1){
        this.controlBound.se = map.unproject([e.pageX-mapBound.left, boxBound.top - mapBound.top + boxBound.height]);
      }else if(name.indexOf("dragresize-l")!=-1){
        this.controlBound.nw = map.unproject([e.pageX - mapBound.left, boxBound.top - mapBound.top]);
      }
    },
    //up时，释放事件
    dragresizeup: function(){
      document.removeEventListener('mousemove',this.dragresizemove,false);
    },

    //拖拽"move"图标时，开始移动bound
    boxMoveStart: function(e){
      this.drag.dragstartx = e.clientX;
      this.drag.dragstarty = e.clientY;
      document.addEventListener('mousemove',this.boxMove,false);
      document.addEventListener('mouseup',this.boxMoveEnd,false);
    },
  //移动bound
    boxMove: function(e){
      var dx = e.clientX - this.drag.dragstartx;
      var dy = e.clientY - this.drag.dragstarty;
      let controlBox = document.getElementById("location-control");
      let mapBound = this.mapBound;
      let boxBound = controlBox.getBoundingClientRect();
      let newleft = boxBound.left - mapBound.left + dx;
      let newtop = boxBound.top - mapBound.top + dy;
      let newright = boxBound.left + boxBound.width - mapBound.left + dx;
      let newbottom = boxBound.top + boxBound.height - mapBound.top + dy;

      this.controlBound.nw = this.map.unproject([newleft, newtop]);
      this.controlBound.se = this.map.unproject([newright,newbottom]);
      this.drag.dragstartx = e.clientX;
      this.drag.dragstarty = e.clientY;
    },
    //up 释放事件
    boxMoveEnd: function(e){
      document.removeEventListener('mousemove',this.boxMove,false);
    },
    //拖拽bound时，使bound与地图一起移动
    boxDragStart: function(e){
      if(e.target.className.indexOf("dragresize")!=-1||e.target.className.indexOf("dragmove")!=-1){
        return;
      }
      this.dragPos.x = e.clientX;
      this.dragPos.y = e.clientY;
      document.addEventListener('mousemove',this.boxDrag,false);
    },
    //移动bound和地图
    boxDrag: function(e){
      var event = {};
      event.point = [e.layerX,e.layerY];
      event.originalEvent = e;
      this.map.fire('dragstart', event);
      this.map.fire('movestart', event);
      var dragPos = {};
      dragPos.x = e.clientX;
      dragPos.y = e.clientY;
      this.map.stop();
      this.map.transform.setLocationAtPoint(this.map.transform.pointLocation(this.dragPos), dragPos);
      this.map.fire('drag', event);
      this.map.fire('move', event);
      this.dragPos = dragPos;
      e.preventDefault();
    },
    //up 释放事件
    boxDragEnd: function(e){
      var event = {};
      event.point = [e.layerX,e.layerY];
      event.originalEvent = e;
      this.map.fire('dragend', event);
      this.map.fire('moveend', event);
      document.removeEventListener('mousemove',this.boxDrag,false);
    },
    // 在bound上缩放时
    boxZoomChange: function(e){
      if(e.detail){//firefox
        if(e.detail<0){
          this.map.zoomIn();
        }else{
          this.map.zoomOut();
        }
      }else{//其他浏览器
        if(e.deltaY < 0){
          this.map.zoomIn();
        }else{
          this.map.zoomOut();
        }
      } 
    },
    //地图缩放后，重新计算框所在的位置
    mapZoomEnd: function(e){
      var controlBox = this.$el.querySelector("#location-control");
      if(controlBox.style.display === 'block'){
        var plt = this.map.project(this.controlBound.nw);
        var prb = this.map.project(this.controlBound.se);
        controlBox.style.left = plt.x + 'px';
        controlBox.style.top = plt.y + 'px';
        controlBox.style.width = prb.x - plt.x + 'px';
        controlBox.style.height = prb.y - plt.y + 'px';
      }
      /*var center = this.map.getCenter();
      var zoom = this.map.getZoom();
      this.localStyle.center = [center.lng,center.lat];
      this.localStyle.zoom = zoom;
      var data = JSON.parse(JSON.stringify(this.localStyle));
      this.changeStyle(data);*/
    },
    mapDragStart: function(e){
      this.drag.dragstartx = e.originalEvent.offsetX - this.mapBound.left;
      this.drag.dragstarty = e.originalEvent.offsetY - this.mapBound.top;
    },
    mapDrag: function(){
      var controlBox = document.getElementById("location-control");
      if(controlBox.style.display === 'block'){
        var plt = this.map.project(this.controlBound.nw);
        var prb = this.map.project(this.controlBound.se);
        controlBox.style.left = plt.x + 'px';
        controlBox.style.top = plt.y + 'px';
      }else{
        var info = this.$el.querySelector("#info-container");
        info.style.display = 'none';
      }
    },
    mapDragEnd: function(){
      var center = this.map.getCenter();
      this.localStyle.center = [center.lng,center.lat];
      var data = JSON.parse(JSON.stringify(this.localStyle));
      this.changeStyle(data);
    },
    hideBoundsBox: function(){
      this.map.off('dragstart', this.mapDragStart);
      this.map.on('click', this.mapClick);
      var box = this.$el.querySelector("#location-control");
      box.style.display = 'none';
    },
    closeInfoContainer: function(){
      var info = this.$el.querySelector("#info-container");
      info.style.display = 'none';
    },
    'mapInit': function(style){
      this.localStyle = JSON.parse(JSON.stringify(style));
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA';
      var map = new mapboxgl.Map({
        container: 'map-editorview-container',
        style: style,
        attributionControl: false
      });
      map.addControl(new mapboxgl.NavigationControl());
      this.map = map;
      
      map.on('load',this.mapLoaded);
      map.on('click', this.mapClick);
      map.on('drag', this.mapDrag);
      //map.on('dragend', this.mapDragEnd);
      map.on('zoomend',this.mapZoomEnd);
    },
    mapLoaded:function(e){
      var href = window.location.href.replace("/#!","");
      var params = util.parseUrl(href).params;
      var bbox = params.bbox;
      if(bbox){
        var bounds = bbox.split(",");
        this.map.fitBounds([[Number(bounds[0]),Number(bounds[1])],[Number(bounds[2]),Number(bounds[3])]],{linear:true,maxzoom:14});
      }
    },
    // 给定 admin code，返回 admin 级别
    // 省市县的 admin code 是6位格式，乡镇为8位格式
    // 返回值：1 -- 省；2 -- 市；3 -- 县；4 -- 乡镇; 0 -- 无效 codeName
    getAdminType:function(codeName) {
      if (codeName.length == 8) {
        return 4;
      }
      if(codeName === '156'){
        return 0;
      }
      // check valid
      if (codeName.length != 6) {
        return -1;
      }
      // 省级行政区的后四位为0
      if (/0000$/.test(codeName)) {
        return 1;
      }
      // 市级行政的后两位为0
      if (/00$/.test(codeName)) {
        return 2;
      }
      return 3;
    }
  },
  events: {
    'map-bounds-change': function(options){
      var replaceContent;
      var bounds = options.bounds;
      if(Object.prototype.toString.call(bounds) === '[object Array]'){
        this.map.fitBounds(bounds);
      }else{
        this.$broadcast('mailSent', { message: '地图范围错误！',timeout:3000 });
      }
      if(!this.localStyle.metadata||!this.localStyle.metadata.replaceField){
        return;
      }
      var replaceField = this.localStyle.metadata.replaceField;
      var adminType = this.getAdminType(options.id.toString());//获取点击的行政级别
      var curr_adiminTyle = this.localStyle.metadata.template.level;//当前模板的行政级别
      if(adminType===curr_adiminTyle){//当前模板级别与点击级别一样才替换
        if (adminType === 1) { // province
          replaceContent = options.name;//省、市级为行政区划名称
        } else if (adminType === 2) { // city
          replaceContent = options.name;//省、市级为行政区划名称
        } else if (adminType === 3) { // county
          replaceContent = options.id;//县级为行政区划代码
        } else if (adminType === 0){//country
        } else { // village
          alert("暂不支持乡镇级");
          return;
        }
      }else{
        return;
      }
      
      for(let i=0;i<this.localStyle.layers.length;i++){
        var layer = this.localStyle.layers[i];
        if(layer.metadata&&layer.metadata.replaceLayer===true){
          var layerStr = JSON.stringify(layer);
          layerStr = layerStr.replace(new RegExp(replaceField,"g"),replaceContent);
          var newLayer = JSON.parse(layerStr);
          this.localStyle.layers[i] = newLayer;
        }
      }
      this.localStyle.metadata.replaceField = replaceContent;
      this.$parent.$broadcast('toc-init', this.localStyle);
      this.changeStyle(this.localStyle);
    },
    'show-bounds-box': function(bounds){
      var controlBox = document.getElementById("location-control");
      controlBox.style.display = 'block';
      //如果没有传入bounds，bounds的地理位置则有其css决定
      if(bounds === undefined){
        var temBounds = this.map.getBounds();
        var right_top = this.map.project(temBounds._ne);
        var left_bottom = this.map.project(temBounds._sw);
        controlBox.style.top = '8px';
        controlBox.style.left = '8px';
        controlBox.style.width = (right_top.x-16)+'px';
        controlBox.style.height = (left_bottom.y-16)+'px';
        var mapBound = this.mapBound;
        var boxBound = controlBox.getBoundingClientRect();
        this.controlBound.nw = this.map.unproject([boxBound.left-mapBound.left, boxBound.top-mapBound.top]);
        this.controlBound.se = this.map.unproject([boxBound.left+boxBound.width-mapBound.left, boxBound.top+boxBound.height-mapBound.top]);
      }else{
        this.controlBound.nw = bounds.nw;
        this.controlBound.se = bounds.se;
      }


      this.map.on('dragstart', this.mapDragStart);
      this.map.on('zoomend',this.mapZoomEnd);

      this.map.off('click', this.mapClick);
      var info = this.$el.querySelector("#info-container");
      info.style.display = 'none';
    },
    'hide-bounds-box': function(){
      this.hideBoundsBox();
    },
    'mapEditor-close':function(){
      if(this.map.remove){
        this.map.remove();
        this.map = {};
        var info = this.$el.querySelector("#info-container");
        info.style.display = 'none';
      }
      window.location.href = "#!/studio/maps";
    },
    'style-save':function(style){
      var newStyle = JSON.parse(JSON.stringify(style));
      var style_id = newStyle.style_id;
      newStyle.zoom = this.map.getZoom();
      var center = this.map.getCenter();
      newStyle.center = [center.lng,center.lat];
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.styles + '/' + username + '/' + style_id;
      var data = JSON.stringify(newStyle);
      this.$http({url:url,method:'PATCH',data:data,headers:{'x-access-token':access_token}})
      .then(function(response){
        if(response.ok){
          this.$broadcast("mailSent",{message:"样式已保存！",timeout:3000});
        }
      },function(response){
        this.$broadcast("mailSent",{message:"样式保存失败！发生未知错误！",timeout:3000});
      })
    }
  },
  computed: {
    mapBound: function(){
      var mapcontainer = this.map.getContainer();
      var bound = mapcontainer.getBoundingClientRect();
      return bound;
    }
  },
  attached(){
    //为location-control添加滚轮滚动事件，firefox为"DOMMouseScroll"，其他浏览器为"mousewheel"
    var support =document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll";
    if(support==="mousewheel"){
      document.getElementById("location-control").onmousewheel=this.boxZoomChange;
    }
    if(support==="DOMMouseScroll"){
      document.getElementById("location-control").addEventListener("DOMMouseScroll", this.boxZoomChange);
    } 
  },
  data: function(){
    return {
      map: {},
      localStyle: {},
      querySourceLayers: {},
      drag: {
        dragstartx:0,
        dragstarty:0
      },
      dragPos:{
        x:0,
        y:0
      },
      controlBound: {
        nw: [0,0],
        se: [0,0],
        dragButton:''
      },
      selectedPopLayer:{
        properties:{},
        length:0
      }
    }
  },
  watch: {
    controlBound: {
      handler:function(val,oldVal){
        var controlBox = document.getElementById("location-control");
        var plt = this.map.project(this.controlBound.nw);
        var prb = this.map.project(this.controlBound.se);
        controlBox.style.left = plt.x + 'px';
        controlBox.style.top = plt.y + 'px';
        controlBox.style.width = prb.x - plt.x + 'px';
        controlBox.style.height = prb.y - plt.y + 'px';
      },
      deep:true
    },
    style: {
      handler:function(style,oldStyle){
        var style_error = validate(style);
        if(style_error.length > 0){
          for(var i = 0;i<style_error.length;i++){
            console.log(style_error[i].message);
          }
          return;
        }
        this.localStyle = JSON.parse(JSON.stringify(style));
        var comds = diff(oldStyle,style);
        for(var i=0,length=comds.length;i<length;i++){
          switch(comds[i].command){
            case 'setPaintProperty':
              this.map.setPaintProperty.apply(this.map,comds[i].args);
              break;
            case 'setLayoutProperty':
              this.map.setLayoutProperty.apply(this.map,comds[i].args);
              break;
            case 'setStyle':
              if(this.map.setStyle === undefined){
                this.mapInit(style);
                break;
              }
              this.map.setStyle.apply(this.map,comds[i].args);
              if(style.zoom){
                this.map.setZoom(style.zoom);
              }
              if(style.center){
                this.map.setCenter(style.center);
              }
              break;
            case 'addLayer':
              this.map.addLayer.apply(this.map,comds[i].args);
              break;
            case 'removeLayer':
              this.map.removeLayer.apply(this.map,comds[i].args);
              break;
            case 'setFilter':
              this.map.setFilter.apply(this.map,comds[i].args);
              break;
            case 'setLayerZoomRange':
              this.map.setLayerZoomRange.apply(this.map,comds[i].args);
              break;
            case 'setLayerProperty':
              this.map.setLayerProperty.apply(this.map,comds[i].args);
              break;
            case 'addSource':
              this.map.addSource.apply(this.map,comds[i].args);
              break;
            case 'removeSource':
              this.map.removeSource.apply(this.map,comds[i].args);
              break;
          }
        }
      },
      deep:true
    }
  }
}
</script>

<style scoped>
#map-editorview-container {
  flex:1;
  flex-grow:1;
  position: absolute;
  left: 280px;
  top: 25px;
  height: calc(100% - 25px);
  width: calc(100% - 280px);
  box-sizing: border-box;
}

/* box bounds */
#location-control {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  box-shadow:rgba(0, 0, 0, 0.298039) 0px 0px 0px 9999px;
  z-index: 1;
}

.dragresize {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: absolute;
  background-color: #2061C6;
}

.dragresize-lt {
  left: -8px;
  top: -8px;
  cursor: nw-resize;
}

.dragresize-t {
  left: calc(50% - 10px);
  top: -8px;
  cursor: n-resize;
}

.dragresize-rt {
  right: -8px;
  top: -8px;
  cursor: ne-resize;
}

.dragresize-r {
  right: -8px;
  top: calc(50% - 10px);
  cursor: e-resize;
}

.dragresize-l {
  left: -8px;
  top: calc(50% - 10px);
  cursor: e-resize;
}

.dragresize-lb {
  left: -8px;
  bottom: -8px;
  cursor: ne-resize;
}

.dragresize-b {
  right: calc(50% - 10px);
  bottom: -8px;
  cursor: n-resize;
}

.dragresize-rb {
  right: -8px;
  bottom: -8px;
  cursor: nw-resize;
}

#close-info {
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 14px;
  cursor: pointer;
}

.dragmove{
  margin: 20px;
  width: 20px;
  height:20px;
  background-image:url('../../../static/icons/drag_move.png');
  background-size: contain;
  background-position: center;
}

.dragmove:hover{
  cursor: move;
}
/******************图层弹框样式*******************************/
#info-container {
  display: none;
  position: absolute;
  left: 500px;
  top: 300px;
  z-index: 1;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,.6));
  -moz-filter: drop-shadow(0 1px 4px rgba(0,0,0,.6));
  -ms-filter: drop-shadow(0 1px 4px rgba(0,0,0,.6));
  -o-filter: drop-shadow(0 1px 4px rgba(0,0,0,.6));
  filter: drop-shadow(0 1px 4px rgba(0,0,0,.6));
  height: auto;
  width: auto;
}

#info-tip {
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 7px solid white;
  margin: 0 auto;
}

.map-popup {
  width: 310px;
  cursor: default;
}

.popup-tit {
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid #eee;
  padding: 0 10px;
  position: relative;
  width: auto;
  border-color: #ccc;
  background-color: #e9f1f9;
}
.popup-tit h3 {
  font-size: 14px;
  margin:0;
}
.popup-con {
  position: relative;
  padding: 10px;
  background-color: #fff;
}
.identify-layer {
  height: 24px;
  margin: 6px 0 0 10px;
}
.identify-layer select {
  width: 210px;
  height: 24px;
  line-height: 24px;
  font-weight: bold;
  color: #478edd;
  margin-left: 6px;
}
.identify-content {
  padding: 8px;
}
.identify-table {
  float: right;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
  padding: 0;
  width: 100%;
}
.identify-table .item-name {
  width: 120px;
  word-break: break-all;
  padding: 3px;
  background-color: #c6deff;
}
.identify-table td {
  border: 1px solid #ccc;
}
.identify-table .item-value {
  word-break: break-all;
  padding: 3px;
}

</style>
