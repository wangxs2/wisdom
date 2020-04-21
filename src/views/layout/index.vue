<template>
  <div class="layout">
    <div class="toptMenu">
      <div class="tit">
        <div class="leftBtn" @click="isShow" :class="{'iRotate':menuFlag}">
          <el-tooltip effect="dark" content="折叠菜单" placement="bottom">
            <i class="iconfont icon-icon-left-open"></i>
          </el-tooltip>
        </div>
        <div style="margin-left:15px">浦东新区机动车维修综合监管平台</div>
      </div>
      <div style="top-right">
        <top-tag></top-tag>
      </div>
    </div>
    <div class="bottomContent">
      <div class="left-menu">
        <menu-nav></menu-nav>
      </div>
      <div class="appMain">
        <div class="route-tit">
          <el-breadcrumb separator="/">
            <template v-for="(item,index) in getRouterName">
              <el-breadcrumb-item :key="index">{{ item.name }}</el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </div>
        <div class="main-content">
          <app-main></app-main>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
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
  }
};
</script>
<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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
    width: 100%;
    height: 60px;
    background: #222530;
    display: flex;
    color: #ffffff;
    justify-content: space-between;
    align-items: center;
    .tit {
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .leftBtn {
        width: 60px;
        height: 60px;
        line-height: 60px;
        color: #ffffff;
        text-align: center;
        cursor: pointer;
      }
    }
   
  }
  .bottomContent {
    width: 100%;
    flex: 1;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    .left-menu {
      // width: 1px;
      height: 100%;
      background: #2c3441;
    }
    .appMain {
      width: 1px;
      // height: 1px;
      flex: 1;
      background:#F2F2F2;
      display: flex;
      flex-direction: column;
      .route-tit {
        width: 100%;
        height: 44px;
        line-height: 44px;
        box-sizing: border-box;
        padding-left: 11px;
      }
      .main-content{
        flex: 1;
        width: 100%;
      }
    }
  }
}
</style>
