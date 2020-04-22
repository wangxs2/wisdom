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
      <el-menu-item index="2" @click="$router.push({ path:'/realTimeMonitoring' })">
        <i class="el-icon-menu"></i>
        <span slot="title">实时监控</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "menuNav",
  components: {
  },
  data() {
    return {
      isCollapse: false,
      menuData: []
    };
  },
  computed: {
    ...mapGetters(["menuFlag"]),
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

