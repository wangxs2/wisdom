<template>
  <div class="map-content" ref="compreMap">
    <div class="top-search">
      <div class="left-sea">
        <el-autocomplete  v-model="searchinput"  :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="车辆" value="1"></el-option>
            <el-option label="组织" value="2"></el-option>
          </el-select>
          <el-button  slot="append" icon="el-icon-search"></el-button>
        </el-autocomplete>
      </div>
      <div class="right-sea">
        <el-button @click="isWaring=!isWaring" type="warning" plain>报警（126）</el-button>
        <el-button>距离下一次刷新 59 秒 <i class="iconfont icon-shuaxin"></i></el-button>
        <i @click="mapFullEvent" class="iconfont icon-quanping3"></i>
      </div>
    </div>
    <!-- 左侧的车辆信息 -->
    <transition
        name="from-above-down"
        enter-active-class="animated fadeInLeft"
        leave-active-class="animated fadeOutLeft"
      >
      <div class="left-content" style="left:0px" v-if="isLeft">
        <div class="tit">车辆信息</div>
        <div class="cltit">
          <div :class='titindex==index?"cltit-iteamac cltit-iteam":"cltit-iteam"' @click="titindex=index" v-for="(iteam,index) in cltitData">
            <span>{{iteam.name}}</span>
            <span style="margin-top:4px">{{iteam.num}}</span>
          </div>
        </div>
        <div class="table-box">
          <div class="table-head">
            <div class="head-it">序号</div>
            <div class="head-it">车牌号</div>
            <div class="head-it">车辆状态</div>
            <div class="head-it">操作</div>
          </div>
          <div class="table-body">
            <div class="infinite-list-wrapper">
              <ul
                class="list">
                <li v-for="i in count" class="list-item">
                  <div class="body-it">{{i}}</div>
                  <div class="body-it">赣JS5129</div>
                  <div :class="i==1?'body-it body-it0':i==2?'body-it body-it1':'body-it body-it2'">{{i==1?'行驶':i==2?'静止':'离线'}}</div>
                  <div class="body-it">
                    <i  class="iconfont icon-bofang1"></i>
                    <i style="margin-left:6px"  class="iconfont icon-weizhilanse"></i>
                  </div>
                </li>
              </ul>
              <p v-if="loading">加载中...</p>
              <p v-if="noMore">没有更多了</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 左侧的车辆信息 -->
    <transition
        name="from-above-down"
        enter-active-class="animated fadeInLeft fadesa"
        leave-active-class="animated fadeOutLeft fadesa1"
      >
      <div class="sideslip" v-if="isLeft" @click="isLeft=false">
        <i  class="iconfont icon-top"></i>
      </div>
    </transition>
    <transition
        name="from-above-down"
        enter-active-class="animated fadeInLeft fadesa2"
        leave-active-class="animated fadeOutRight"
      >
      <div class="sideslip1" v-if="!isLeft" @click="isLeft=true">
        <i  class="iconfont icon-next"></i>
      </div>
    </transition>
    <!-- 报警的列表 -->
    <transition
        name="from-above-down"
        enter-active-class="animated fadeInDown"
        leave-active-class="animated fadeOutUp"
      >
      <div class="left-content waring-box" style="right:0px" v-if="isWaring">
        <div class="tit">报警对象：静止超过10分钟的车辆</div>
        <div class="table-box">
          <div class="table-head">
            <div class="head-it">序号</div>
            <div class="head-it">车牌号</div>
            <div class="head-it">停留时长</div>
            <div class="head-it">操作</div>
          </div>
          <div class="table-body">
            <div class="infinite-list-wrapper">
              <ul
                class="list">
                <li v-for="i in count" class="list-item">
                  <div class="body-it">{{i}}</div>
                  <div class="body-it">赣JS5129</div>
                  <div>1小时45分钟</div>
                  <div class="body-it">
                    <!-- <i  class="iconfont icon-bofang1"></i> -->
                    <i style="margin-left:6px"  class="iconfont icon-weizhilanse"></i>
                  </div>
                </li>
              </ul>
              <p v-if="loading">加载中...</p>
              <p v-if="noMore">没有更多了</p>
            </div>
          </div>
        </div>
        
      </div>
    </transition>

    <!-- 报警的列表 -->
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
      count: 40,
      restaurants: [],
      timeout:  null,
      loading: false,
      isWaring: false,
      myMap: null,
      ZoomNum: null,
      isLeft:true,//是否隐藏左侧的车辆信息
      mapstyle: "normal",
      searchinput:"",
      select:"1",
      cltitData:[
        {
          name:"全部",
          num:126
        },
        {
          name:"行驶",
          num:126
        },
        {
          name:"静止",
          num:126
        },
        {
          name:"离线",
          num:126
        },
      ],
      titindex:0,
      // mapstyle:"dark",
    };
  },
   computed: {
      noMore () {
        return this.count >= 40
      },
      disabled () {
        return this.loading || this.noMore
      }
    },
  mounted() {
    this.restaurants = this.loadAll();
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
    //加载更多
    loadAll() {
      return [
        { "value": "油厂1", "address": "长宁区新渔路144号" },
        { "value": "油厂2", "address": "上海市长宁区淞虹路661号" },
        { "value": "油厂3", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
        { "value": "油厂4", "address": "天山西路438号" },
        
      ];
      },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 100 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    },
  }
};
</script>
<style lang="scss">
.el-select .el-input {
    width: vw(100);
  }
</style>
<style lang="scss" scoped>
.map-content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-bottom: vh(6);
  position: relative;
  .top-search {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: vh(60);
    background: #ffffff;
    z-index: 20;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: vh(6) vw(12);
    box-shadow:0px 0px vw(10) 0px rgba(51,51,51,0.3);
    border-bottom:1px solid #DCDFE6;
    .right-sea{
      display: flex;
      align-items: center;
      .icon-quanping3{
        font-size:vw(24);
        color:#1A98FF;
        margin-left:vw(8);
        cursor: pointer;
      }
    }
  }
  .fadesa{
    animation:saam 1s;
  }
  @keyframes saam {
  0% {
    opacity: 0;
    left: 0px;
  }
  
  100% {
    opacity: 1;
    left: vw(400);
  }
}
.fadesa1{
    animation:saam1 1s;
  }
  @keyframes saam1 {
  0% {
    opacity: 1;
    left: vw(400);
  }
  
    100% {
      opacity: 0;
      left: 0px;
    }
  }
  .fadesa2{
    animation:saam2 1s;
  }
  @keyframes saam2 {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  
    100% {
      opacity:1;
    }
  }
  .left-content{
    width:vw(400);
    height:100%;
    position: absolute;
    box-shadow:vw(2) vw(4) vw(2) vw(2) rgba(51,51,51,0.3);
    top: vh(60);
    box-sizing:border-box;
    display:flex;
    flex-direction: column;
    padding:vw(6);
    padding-bottom:vh(90);
    background: rgba(255,255,255,1);
    z-index: 10;
    .tit{
      width:100%;
      height:vh(40);
      border-bottom:1px solid #DCDFE6;
      box-sizing:border-box;
      padding:vh(6) 0;
      color:rgb(44, 158, 255);
    }
    .table-box{
      flex:1;
      margin-top:vh(10);
      border:1px solid #DCDFE6;
      display:flex;
      flex-direction: column;
      overflow:hidden;
      .table-head{
        width:100%;
        height:vh(36);
        display:flex;
        border-bottom:1px solid #DCDFE6;
        box-sizing:border-box;
        padding:vh(6) 0;
        padding-right:vw(16);
        .head-it{
          flex:1;
        }
      }
      .table-body{
        flex:1;
        overflow:hidden;
      }
      .infinite-list-wrapper{
         overflow:hidden;
        overflow-y:scroll;
        width:100%;
        height:100%;
       }
      ul,li{
        width:100%
      }
      .list-item{
        display:flex;
        box-sizing:border-box;
        border-bottom:1px solid #DCDFE6;
        padding:vh(6) 0;
        .body-it{
          flex:1;
          .iconfont{
            cursor: pointer;
            font-size:vw(20);
            color:#999999;
          }
        }
        .body-it0{
          color:#2BA3FF;
        }
        .body-it1{
          color:#FFB42E;
        }
        .body-it2{
          color:#909399;
          
        }
      }
    }
    .cltit{
      width:100%;
      height:vh(50);
      display:flex;
      // border-right:1px solid #DCDFE6;
      // border-left:1px solid #DCDFE6;
      .cltit-iteam{
        flex:1;
        box-sizing:border-box;
        padding:1px 0;
        // border:1px solid #DCDFE6;
        border-top:none;
        border-right:none;
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .cltit-iteamac{
        background:#eeeeee;
        color:#333333;
      }
    }
  }
  .waring-box{
    padding:vw(6);
    box-shadow:vw(10) vw(10) vw(10) vw(20) rgba(51,51,51,0.3);
    .tit{
      border:none;
      background:#DCDFE6;
    }
  }
  .sideslip{
    position: absolute;
    top: 46%;
    left: vw(400);
    z-index:10;
    .iconfont{
      font-size:vw(32);
      cursor: pointer;
    }
  }
  .sideslip1{
    position: absolute;
    top: 46%;
    left: 0px;
    z-index:10;
    .icon-next{
      font-size:vw(32);
      cursor: pointer;

    }
  }
  .timeCar {
    width: 100%;
    height: 100%;
  }
}
</style>
