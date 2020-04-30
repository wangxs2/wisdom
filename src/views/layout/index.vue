<template>
  <div class="layout">
    <div class="toptMenu">
      <!-- <div class="tit">
        <div class="leftBtn" @click="isShow" :class="{'iRotate':menuFlag}">
          <el-tooltip effect="dark" content="折叠菜单" placement="bottom">
            <i class="iconfont icon-icon-left-open"></i>
          </el-tooltip>
        </div>
        <div style="margin-left:15px">运输监控系统</div>
         <div class="route-tit">
          <el-breadcrumb separator="/">
            <template v-for="(item,index) in getRouterName">
              <el-breadcrumb-item :key="index">{{ item.name }}</el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </div>
      </div>
      <div style="top-right">
        <top-tag></top-tag>
      </div> -->
      <div class="logo">
        <img src="../../assets/image/logo2.png" width="48" height="60">
        <span v-if="!menuFlag">粮运运</span>
      </div>
      <div class="left-menu">
        <menu-nav></menu-nav>
      </div>
    </div>
    <div class="bottomContent">
      <div class="topUser">
        <div class="left-rout">
          <div class="leftBtn" @click="isShow">
            <el-tooltip effect="dark" content="折叠菜单" placement="bottom">
              <img v-if="!menuFlag" src="../../assets/image/zd.png" width="23" height="20">
              <img v-if="menuFlag" src="../../assets/image/zk.png" width="23" height="20">
            </el-tooltip>
          </div>
          <div class="route-tit">
            <el-breadcrumb separator="/">
              <template v-for="(item,index) in getRouterName">
                <el-breadcrumb-item :key="index">{{ item.name }}</el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </div>
        </div>
        <div class="right-user">
          <div class="img-my"></div>
          <div class="user-name">liangyunyun</div>
          <div class="fenge"></div>
          <div class="tc" @click="tuchu" style="cursor: pointer;">退出</div>
        </div>
      </div>
      <div class="appMain">
         <app-main></app-main>
        <!-- <div class="main-content">
          <app-main></app-main>
        </div>
         -->
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery"
import { mapGetters } from "vuex";
// @ is an alias to /src
import menuNav from "./components/menu";
import topTag from "./components/topTag";
import appMain from "./components/appMain";
export default {
  name: "Home",
  components: {
      menuNav,
      topTag,
      appMain
  },
   computed: {
    ...mapGetters(["menuFlag"]),
    getRouterName: function () {
      return this.$route.matched.slice(1);
    }
  },
  mounted(){
    if(this.menuFlag==true){
      $(".toptMenu").width("64px");
    }
  },
  created(){
  },
  methods:{
    tuchu(){
      this.$router.push("/login")
      // this.menuFlag=true
    },
    isShow() {
      //侧边栏显示隐藏
      this.$store.commit("SET_FLAG");
      console.log(this.menuFlag)
      if (this.menuFlag) {
        $(".toptMenu").width("64px");
      } else {
        $(".toptMenu").width("210px");
      }
    }
  }
};
</script>
<style lang="scss">
 .route-tit{
   margin-left: vw(20);
      color: #ffffff;
      .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover{
        color: #ffffff;
      }
    }
</style>
<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  overflow: hidden;
  .iRotate {
    animation: Grotate 0.4s;
    animation-fill-mode: forwards;
  }

  @keyframes Grotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(90deg);
    }
  }
  .toptMenu {
    width: 210px;
    height: 100%;
    background: #222530;
    display: flex;
    color: #ffffff;
    flex-direction: column;
    .left-menu {
      flex: 1;
      position: relative;
      z-index:20;
    }
    .logo{
      width: 100%;
      height: vh(100);
      display: flex;
      justify-content: center;
      align-items: center;
      span{
        margin-left: vw(10)
      }

    }
   
   
  }
  .bottomContent {
    flex: 1;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .topUser{
      width: 100%;
      height: vh(60);
      background:rgba(49,122,248,1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 0 vw(20);
      position: relative;
      z-index: 100;
      .left-rout{
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .right-user{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #ffffff;
        .fenge{
          width: 1px;
          height: vh(33);
          background: #EBEEF5;
          margin:0 vw(20);
        }
        .img-my{
          width: vw(32);
          height: vw(32);
          background: url("../../assets/image/1.jpg") no-repeat;
          background-size: 100% 100%;
          border-radius: 50%;
          margin-right: vw(10);
        }
      }
    }
    .appMain {
      flex: 1;
      background:#F2F2F2;
      display: flex;
      flex-direction: column;
      .main-content{
        flex: 1;
        width: 100%;
      }
    }
  }
}
</style>
