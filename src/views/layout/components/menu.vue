<template>
  <div class="treeleft">
    <el-menu
      :default-active="$route.path"
      ref="navbar"
      router
      :collapse-transition="false"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      @select="selectMenu"
      :collapse="menuFlag"
      active-text-color="#ffffff"
      background-color="#222530"
      text-color="#fff"
    >
      <!-- <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-locations"></i>
          <span>GPS监控</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1" @click="gorouter">实时监控</el-menu-item>
          <el-menu-item index="1-2" @click="gorouter1">轨迹查询</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-map-location1"></i>
          <span>围栏管理</span>
        </template>
        <el-menu-item index="2-1">地址管理</el-menu-item>
        <el-menu-item index="2-2">围栏记录</el-menu-item>
      </el-submenu> -->


      <el-submenu v-for="(item,n) in menuData" :key="item.id" v-if="item.children && item.children.length" :index="String(n)">
        <!-- 创建父级菜单 -->
        <template slot="title">
          <i style="color:#fff;"
            class="iconfont"
            :class="item.props"></i>
          <span slot="title"
                class="menuIcon">{{ item.name }}</span>
        </template>
        <!-- 创建子菜单 -->
        <template v-for="(subItem,i) in item.children">

          <nav-item :key="n+'-'+i"
                    :item="subItem"
                    :index="n+'-'+i"
                    v-if="subItem.children && subItem.children.length">
          </nav-item>

          <el-menu-item :key="n+'-'+i"
                        :index="subItem.url"
                        v-else>
            <i style="color:#fff;"
              class="iconfont"
              :class="subItem.props"></i>
            <span slot="title"
                  class="menuIcon">{{ subItem.name }}</span>
          </el-menu-item>

        </template>
      </el-submenu>

      <el-menu-item v-else
                    :index="item.url">
        <i style="color:#fff;"
          class="iconfont"
          :class="item.props"></i>
        <span slot="title"
              class="menuIcon">{{ item.name }}</span>
      </el-menu-item>
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
      menuData: [
        {
          name:"GPS监控",
          props:'el-icon-locations',
          children:[
            {
              name:"实时监控",
              url:"/realTimeMonitoring"
            },
            {
              name:"轨迹查询",
              url:"/trajectory"
            }
          ]
        },
        {
          name:"围栏管理",
          props:'el-icon-map-location1',
          children:[
            {
              name:"地址管理",
              url:"/addressManagement"
            },
            {
              name:"围栏记录",
              url:"/addressRecord"
            }
          ]
        },
      ]
    };
  },
  computed: {
    ...mapGetters(["menuFlag"])
  },
  methods: {
    handleOpen(key, keyPath) {
    },
    handleClose(key, keyPath) {
    },
    
    selectMenu (index, indexPath) {
      // 手风琴效果
      // 获取当前打开的所有菜单
      let openMenu = this.$refs.navbar.openedMenus.concat([]);
      // 获取点击菜单的父级index，如果当前点击的是根节点，则直接关闭所有打开菜单
      let nowMenuPath =
        indexPath.length > 1 ? indexPath[indexPath.length - 2] : "";
      if (nowMenuPath) {
        // 获取父级index在数组中索引，关闭其后所有的菜单
        let menuIndex = openMenu.indexOf(nowMenuPath);
        openMenu = openMenu.slice(menuIndex + 1);
      }
      openMenu = openMenu.reverse();
      openMenu.forEach(ele => {
        this.$refs.navbar.closeMenu(ele);
      });
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
.el-menu-item{
    font-size: vw(16);

}

.el-submenu__title{
  span{
    font-size: vw(16);
  }
}
.el-icon-locations{
  width: vw(19);
  height: vw(20);
  background: url("../../../assets/image/GPS1.png") no-repeat;
  background-size: contain;
}
.el-icon-map-location1{
  width: vw(18);
  height: vw(18);
  background: url("../../../assets/image/wl.png") no-repeat;
  background-size: contain;
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

