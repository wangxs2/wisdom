<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  // import "@babel/polyfill"
  // 做你妹的适配 劳资做好了 逼事儿那么多，不给你做适配
  export default {}
</script>

<style lang="scss">
@import url("./assets/iconfont/iconfont.css");
html,body,#app {
  font-family: Microsoft YaHei,Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0
}
.el-scrollbar__wrap{
  margin-bottom: 0 !important;
}

ul,li{
  list-style-type:none;
  margin: 0;
  padding: 0
}
input:focus {
  border: 2px solid #317AF8 !important;
  border-radius:4px;
}
.el-pager li.active{
  color:#317AF8 !important;
}
.el-button--primary{
  background:rgba(49,122,248,1) !important;
  font-size:16px !important;
  padding:9px 35px !important;
  color:#ffffff !important;
}
.el-button--primary:focus, .el-button--primary:hover{
  background:rgba(17,92,223,1) !important;
}
.el-button--primary:active{
  background:rgba(3,75,200,1) !important;
}
.el-button--default{
 font-size:16px !important;
  padding:9px 35px !important;
  color:#303133;
}
.el-select-dropdown__item.selected{
  color:#007FFF!important;
}

.activesa:focus,.activesa:hover{
  color:#115CDF!important;
}
.activesa:active{
  color:#115CDF!important;
}
</style>
