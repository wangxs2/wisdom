<template>
  <div class="map-content" ref="compreMap">
    <div class="top-search">
      <div class="left-sea">
        <el-input placeholder="请输入内容" v-model="searchinput" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="车辆" value="1"></el-option>
            <el-option label="组织" value="2"></el-option>
          </el-select>
          <el-button  slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div class="right-sea">
        <el-button type="warning" plain>报警（126）</el-button>
        <el-button>距离下一次刷新 59 秒</el-button>
        <i @click="mapFullEvent" class="iconfont icon-quanping1"></i>
      </div>
    </div>
    <div class="timeCar" id="mymap">
      <!-- top搜索 -->
    </div>
  </div>
</template>

<script>
import screenfull from 'screenfull';
export default {
  name: "appMain",
  data() {
    return {
      myMap: null,
      ZoomNum: null,
      mapstyle: "normal",
      searchinput:"",
      select:"1",
      // mapstyle:"dark",
    };
  },
  mounted() {
    this.initMap();
    this.getZmap();
  },
  created() {},
  methods: {
    initMap() {
      this.myMap = new BMap.Map("mymap");
      this.myMap.centerAndZoom(new BMap.Point(121.571035, 31.236302), 14);
      this.myMap.enableScrollWheelZoom(); //地图缩放的功能
      this.myMap.addControl(
        new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT })
      );
      this.myMap.setMapStyle({ style: this.mapstyle });
      var top_right_navigation = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_SMALL
      }); //右上角，仅包含平移和缩放按钮
      this.myMap.addControl(top_right_navigation);
    },
    //地图的缩放时间
    getZmap() {
      this.myMap.addEventListener("zoomend", () => {
        this.ZoomNum = this.myMap.getZoom();
        // 14 是1公里
        // 13 是2公里
        // 12 是5公里
        // 11 是10公里
        // 10 是20公里
        // 9 是25公里
        // 8 是50公里
        // 7 是100公里
        // 6 是200公里
        // 5 是500公里
      });
    },
    //全屏
    mapFullEvent () {
      console.log(screenfull)
      screenfull.toggle(this.$refs.compreMap)
    },
  }
};
</script>
<style lang="scss">
.el-select .el-input {
    width: 100px;
  }
</style>
<style lang="scss" scoped>
.map-content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 6px;
  position: relative;
  .top-search {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background: #ffffff;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 12px;
    .right-sea{
      display: flex;
      align-items: center;
      .icon-quanping1{
        font-size:30px;
        color:#1A98FF;
        margin-left:8px;
        cursor: pointer;
      }
    }
  }
  .timeCar {
    width: 100%;
    height: 100%;
  }
}
</style>
