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
</style>
