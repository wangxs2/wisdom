<template>
  <div class="treeleft">
    <el-menu
      default-active="2"
      :collapse-transition="false"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="menuFlag"
      active-text-color="#ffffff"
      background-color="#323B4B"
      text-color="#fff"
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>GPS监控</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1">实时监控</el-menu-item>
          <el-menu-item index="1-2">轨迹查询</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-map-location"></i>
          <span>围栏管理</span>
        </template>
        <el-menu-item index="2-1">地址管理</el-menu-item>
        <el-menu-item index="2-2">围栏记录</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "menuNav",
  components: {},
  data() {
    return {
      isCollapse: false,
      menuData: []
    };
  },
  computed: {
    ...mapGetters(["menuFlag"])
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="scss" scoped>
.treeleft {
  width: 210px;
}
.el-menu-item.is-active {
  background-color: #2ba3ff !important;
}
</style>

<style lang="scss">
.treeleft {
  .menuIcon {
    padding: 0px 10px;
    font-size: 16px;
  }
  .el-menu {
    border: none;
    text-align: left;
  }
  .iconfont {
    font-size: 18px;
  }
  .el-submenu__icon-arrow {
    font-size: 16px;
  }
}
</style>

