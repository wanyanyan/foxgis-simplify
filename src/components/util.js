export default {
  dateFormat: function(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if (month < 10) {
      month = '0' + month;
    }
    if(minutes < 10){
      minutes = '0' + minutes;
    }
    if(seconds < 10){
      seconds = '0' + seconds;
    }
    var formateString = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    return formateString;
  },
  rgb2hex:function(rgb){//将rgb的颜色格式转换为16进制的颜色格式
    if(typeof rgb==="object"){
      return rgb;
    }
    if(rgb.indexOf("#")===0){
      return rgb;
    }
    var tem = rgb.split(',');
    var regEx = /[^\d]/g;
    for(let i = 0;i<tem.length;i++){
      tem[i] = Number(tem[i].replace(regEx,""));//去掉字符串中的非数字
    }
    var rgbArr = tem;
    var r=rgbArr[0];
    var g=rgbArr[1];
    var b=rgbArr[2];
    if(r<=1&&g<=1&&b<=1){
      r=parseInt(r*255+0.5);
      g=parseInt(g*255+0.5);
      b=parseInt(b*255+0.5);
    }
    var str = ((r<<16)|(g<<8)|b).toString(16);
    if(str.length<6){
      var diff = 6-str.length;
      for(let j=0;j<diff;j++){
        str="0"+str;
      }
    }
    return "#"+str;
  },
  parseUrl:function(url) {  
    var a =  document.createElement('a');  
    a.href = url;  
    return {  
      source: url,  
      protocol: a.protocol.replace(':',''),  
      host: a.hostname,  
      port: a.port,  
      query: a.search,  
      params: (function(){  
        var ret = {},  
        seg = a.search.replace(/^\?/,'').split('&'),  
        len = seg.length, i = 0, s;  
        for (;i<len;i++) {  
            if (!seg[i]) { continue; }  
            s = seg[i].split('=');  
            ret[s[0]] = s[1];  
        }  
        return ret;  
      })(),  
      file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],  
      hash: a.hash.replace('#',''),  
      path: a.pathname.replace(/^([^\/])/,'/$1'),  
      relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],  
      segments: a.pathname.replace(/^\//,'').split('/')  
    };  
  }
  //systemSourceIds:["gw_admin_national","gw_admin_national2","gw_timeline_national_base","gw_timeline_national_water_living","gw_timeline_national_roads","gw_timeline_national_terrain","gw_increase_national","gw_increase_national2","gw_admin","gw_timeline2","gw_increase"]
}
