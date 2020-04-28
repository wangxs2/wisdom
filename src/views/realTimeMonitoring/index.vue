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
        <el-button @click="isWaring=!isWaring" type="danger" icon="el-icon-message-solid">报警（126）</el-button>
        <div class="shua"  @click="totalTime=60"> <i class="iconfont icon-shuaxin1"></i>距离下一次刷新 {{totalTime}} 秒</div>
        <div @click="mapFullEvent" class="box-qunping">
          <img src="../../assets/image/fdicon.png" alt="" srcset="">
        </div>
      </div>
    </div>
    <!-- 左侧的车辆信息 -->
    <transition
        name="from-above-down"
        enter-active-class="animated fadeInLeft"
        leave-active-class="animated fadeOutLeft"
      >
      <div class="left-content" style="left:0px" v-if="isLeft">
        <div class="tit" style="color:#333333">车辆信息</div>
        <div class="cltit">
          <div style="margin-right:1vw">车辆状态</div>
          <div style="flex:1">
             <el-select style="width:100%" size="small" v-model="valuenum" placeholder="请选择">
                <el-option
                  v-for="item in cltitData"
                  :key="item.num"
                  :label="item.name"
                  :value="item.num">
                </el-option>
              </el-select>
          </div>
          <!-- <div :class='titindex==index?"cltit-iteamac cltit-iteam":"cltit-iteam"' @click="titindex=index" v-for="(iteam,index) in cltitData">
            <span>{{iteam.name}}</span>
            <span>{{iteam.num}}</span>
          </div> -->
        </div>
        <div class="table-box">
          <div class="table-head">
            <div class="head-it">序号</div>
            <div class="head-it">车牌号</div>
            <div class="head-it">车辆状态</div>
            <div class="head-it">操作</div>
          </div>
          <div class="table-body">
            <el-scrollbar style="height:100%">
              <ul
                class="list">
                <li v-for="i in count" :key="i" class="list-item">
                  <div class="body-it">{{i}}</div>
                  <div class="body-it">赣JS5129</div>
                  <div class="body-it"><span :class="i==1?'body-it0':i==2?'body-it1':'body-it2'">{{i==1?'行驶':i==2?'静止':'离线'}}</span></div>
                  <div class="body-it">
                    <img src="../../assets/image/bf.png">
                    <img style="margin-left:14px" src="../../assets/image/dw.png">
                  </div>
                </li>
              </ul>
              <p v-if="loading">加载中...</p>
              <p v-if="noMore">没有更多了</p>
            </el-scrollbar>
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
        <!-- <i  class="iconfont icon-top"></i> -->
        <img src="../../assets/image/image_1@3x.png">
      </div>
    </transition>
    <transition
        name="from-above-down"
        enter-active-class="animated fadeInLeft fadesa2"
        leave-active-class="animated fadeOutRight"
      >
      <div class="sideslip1" v-if="!isLeft" @click="isLeft=true">
        <!-- <i  class="iconfont icon-next"></i> -->
        <img src="../../assets/image/image_2@3x.png">
      </div>
    </transition>
    <!-- 报警的列表 -->
    <transition
        name="from-above-down"
        enter-active-class="animated fadeInDown"
        leave-active-class="animated fadeOutUp"
      >
      <div class="left-content waring-box" v-if="isWaring">
        <div class="tit">报警对象：静止超过10分钟的车辆</div>
        <div class="table-box">
          <div class="table-head">
            <div class="head-it">序号</div>
            <div class="head-it">车牌号</div>
            <div class="head-it">停留时长</div>
            <div class="head-it">操作</div>
          </div>
          <div class="table-body">
            <el-scrollbar style="height:100%">
              <ul
                class="list">
                <li v-for="i in count" class="list-item">
                  <div class="body-it">{{i}}</div>
                  <div class="body-it">赣JS5129</div>
                  <div>1小时45分钟</div>
                  <div class="body-it">
                    <!-- <i  class="iconfont icon-bofang1"></i> -->
                    <img src="../../assets/image/dw.png">
                  </div>
                </li>
              </ul>
              <p v-if="loading">加载中...</p>
              <p v-if="noMore">没有更多了</p>
            </el-scrollbar>
          </div>
        </div>
        
      </div>
    </transition>
    <!-- 报警的列表 -->
    <!-- 缩放的按钮 -->
    <div class="zoomBtn">
      <div class="box-big" id="box-big1" @click="addZoom()">
        <img src="../../assets/image/big.png">
      </div>
      <div class="box-big" id="box-big2" @click="delZoom()">
        <img src="../../assets/image/small.png">
      </div>
    </div>
    <!-- 缩放的按钮 -->
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
      totalTime: 60, //倒计时
      restaurants: [],
      timeout:  null,
      loading: false,
      isWaring: false,
      myMap: null,
      ZoomNum: null,
      valuenum:12,
      isLeft:true,//是否隐藏左侧的车辆信息
      mapstyle: "normal",
      searchinput:"",
      select:"1",
      cltitData:[
        {
          name:"全部(126)",
          num:12
        },
        {
          name:"行驶(126)",
          num:136
        },
        {
          name:"静止(126)",
          num:116
        },
        {
          name:"离线(126)",
          num:106
        },
      ],
      titindex:0,
      // mapstyle:"dark",
    };
  },
  watch:{
    "ZoomNum":function(val,old){
      if(val>18){
        $("#box-big1").css({"cursor": "not-allowed"});
      }else{
        $("#box-big1").css({"cursor": "pointer"});
      }
      if(val<5){
        $("#box-big2").css({"cursor": "not-allowed"});
      }else{
        $("#box-big2").css({"cursor": "pointer"});
      }
    },
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
  created() {
    // this.getLine()
    this.countDown()
  },
  methods: {
    //倒计时
    countDown() {
      this.totalTime--
      if(this.totalTime<0){
        this.totalTime=60
      }
      setTimeout( ()=> {
				this.countDown()
			}, 1000)
    },
    initMap() {
      this.myMap = new BMap.Map("mymap");
      this.myMap.centerAndZoom(new BMap.Point(108.933051,34.546597), 5);
      this.myMap.enableScrollWheelZoom(); //地图缩放的功能
      this.myMap.addControl(
        new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT })
      );
      this.myMap.setMapStyleV2({     
        styleId: '877fcc51379e35af5063374cd7687818'
      });
    },
    //地图的缩放时间
    getZmap() {
      this.myMap.addEventListener("zoomend", () => {
        this.ZoomNum = this.myMap.getZoom();
        console.log(this.ZoomNum)
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
    //路书
    getLine(){
      var lushu;
        // 实例化一个驾车导航用来生成路线
          var drv = new BMap.DrivingRoute('全国', {
              onSearchComplete: function(res) {
                  if (drv.getStatus() == BMAP_STATUS_SUCCESS) {
                      var plan = res.getPlan(0);
                      var arrPois =[];
                      for(var j=0;j<plan.getNumRoutes();j++){
                          var route = plan.getRoute(j);
                          arrPois= arrPois.concat(route.getPath());
                      }
                      console.log(arrPois)
                      map.addOverlay(new BMap.Polyline(arrPois, {strokeColor: '#111'}));
                      map.setViewport(arrPois);

                      lushu = new BMapLib.LuShu(map,arrPois,{
                      defaultContent:"",//"从天安门到百度大厦"
                      autoView:true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
                      icon  : new BMap.Icon('/jsdemo/img/car.png', new BMap.Size(52,26),{anchor : new BMap.Size(27, 13)}),
                      speed: 4500,
                      enableRotation:true,//是否设置marker随着道路的走向进行旋转
                      landmarkPois: [
                        {lng:116.314782,lat:39.913508,html:'加油站',pauseTime:20},
                        {lng:116.315391,lat:39.964429,html:'高速公路收费<div><img src="//map.baidu.com/img/logo-map.gif"/></div>',pauseTime:3},
                        {lng:116.381476,lat:39.974073,html:'肯德基早餐',pauseTime:2}
                      ]});
                  }
              }
          });
          var start=new BMap.Point(116.404844,39.911836);
          var end=new BMap.Point(116.308102,40.056057);
        drv.search(start, end);
        //绑定事件
        $("run").onclick = function(){
          lushu.start();
        }
        $("stop").onclick = function(){
          lushu.stop();
        }
        $("pause").onclick = function(){
          lushu.pause();
        }
        $("hide").onclick = function(){
          lushu.hideInfoWindow();
        }
        $("show").onclick = function(){
          lushu.showInfoWindow();
        }
        function $(element){
          return document.getElementById(element);
        }
    },
     //加大地图级别
    addZoom(params) {
      this.myMap.zoomIn() //放大一级视图
    },
    //缩小地图级别
    delZoom(params) {
      this.myMap.zoomOut() //缩小一级视图
    }

  }
};
</script>
<style lang="scss">
.top-search .el-select .el-input {
    width: vw(100);
}
.el-scrollbar__wrap{
  overflow-x: hidden !important;
  overflow-y: scroll;
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
    // background: #ffffff;
    z-index: 20;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: vh(6) vw(20);
    // box-shadow:0px 0px vw(10) 0px rgba(51,51,51,0.3);
    // border-bottom:1px solid #DCDFE6;
    .left-sea{
      box-shadow:0px 0px vw(6) 0px rgba(51,51,51,0.3);
    }
    .right-sea{
      display: flex;
      align-items: center;
      .box-qunping{
        width:vw(40);
        height:vw(40);
        margin-left: vw(20);
        background:rgba(230,241,252,1);
        box-shadow:1px 1px 4px 0px rgba(213,213,213,1);
        border-radius:4px;
        display: flex;
        justify-content: center;
        align-items: center;
         cursor: pointer;
      }
      .shua{
        display: flex;
        justify-content: center;
        align-items: center;
        width:vw(220);
       box-sizing: border-box;
       padding: vh(10) vw(14);
        background:rgba(230,241,252,1);
        box-shadow:1px 1px 4px 0px rgba(213,213,213,1);
        border-radius:4px;
        margin-left: vw(20);
        cursor: pointer;
        color: #7B7D7F;
      }
      .shua:hover{
        background:rgba(255,255,255,0.8);
      }
      .icon-shuaxin1{
        display: inline-block;
        width: vw(22);
        height: vw(22);
        background: url("../../assets/image/sx.png") no-repeat;
        background-size: 100% 100%;
        margin-right: vw(8);
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
  .zoomBtn{
    position: absolute;
    top:vh(80);
    right:vw(20);
    z-index: 9;
    display:flex;
    flex-direction: column;
    .box-big{
      width:vw(40);
      height:vw(40);
      background:rgba(255,255,255,1);
      box-shadow:1px 1px 4px 0px rgba(213,213,213,1);
      border-radius:4px;
      display:flex;
      justify-content: center;
      align-items: center;
      margin-bottom:vh(10);
       cursor: pointer;
    }
    .box-big:hover{
      background:rgba(255,255,255,0.8);
    }
  }
  .left-content{
    width:vw(400);
    height:90%;
    position: absolute;
    box-shadow:vw(2) vw(2) vw(2) vw(2) rgba(51,51,51,0.1);
    top: vh(60);
    box-sizing:border-box;
    display:flex;
    flex-direction: column;
    // padding:vw(6);
    // padding-bottom:vh(90);
    background: rgba(255,255,255,1);
    border-radius:4px 4px 0px 0px;
    z-index: 10;
    .tit{
      width:100%;
      height:vh(50);
      line-height: vh(50);
      // border-bottom:1px solid #DCDFE6;
      box-sizing:border-box;
      background: #F0F2F5;
      font-size: vw(20);
      color: #303133;
      border-radius:4px 4px 0px 0px;
    }
    .table-box{
      flex:1;
      // margin-top:vh(10);
      // border:1px solid #DCDFE6;
      display:flex;
      flex-direction: column;
      overflow:hidden;
      .table-head{
        width:100%;
        height:vh(40);
        display:flex;
        background: rgba(244,248,253,1);
        color: #303133;
        // border-bottom:1px solid #DCDFE6;
        box-sizing:border-box;
        padding:vh(6) 0;
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
        cursor: pointer;
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
          color:#ffffff;
          font-size: vw(12);
          display: inline-block;
          background:#307CFC;
          border-radius:4px;
          box-sizing:border-box;
          padding:vh(3) vw(6);
        }
        .body-it1{
          color:#ffffff;
          font-size: vw(12);
          display: inline-block;
          background:#FF9900;
          border-radius:4px;
          box-sizing:border-box;
          padding:vh(3) vw(6);
        }
        .body-it2{
          color:#ffffff;
          font-size: vw(12);
          display: inline-block;
          background:#909399;
          border-radius:4px;
          box-sizing:border-box;
          padding:vh(3) vw(6);
          
        }
      }
      .list-item:hover{
        background: rgba(188,216,252,0.6);
      }
    }
    .cltit{
      width:100%;
      height:vh(60);
      display:flex;
      justify-content: flex-start;
      align-items: center;
      box-sizing: border-box;
      padding: vw(12);
      font-size: vw(16);
    }
  }
  .waring-box{
    padding:vw(0);
    height: 80%;
    right: vw(52);
    box-shadow:vw(2) vw(2) vw(2) vw(4) rgba(51,51,51,0.1);
    .table-box{
      box-sizing: border-box;
    }
    .tit{
      background:rgba(255,225,225,0.8);
      color: #DD2726;
      font-size: vw(16);
      box-sizing: border-box;
    }
  }
  .sideslip{
    position: absolute;
    top: 46%;
    left: vw(400);
    z-index:10;
    cursor: pointer;
  }
  .sideslip1{
    position: absolute;
    top: 46%;
    left: 0px;
    z-index:10;
    cursor: pointer;
  }
  .timeCar {
    width: 100%;
    height: 100%;
  }
}
</style>
