<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  // import "@babel/polyfill"
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
</style>
