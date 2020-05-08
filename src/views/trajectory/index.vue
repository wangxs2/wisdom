<template>
  <div class="map-content" ref="compreMap">
    <div class="top-search">
      <div class="left-sea">
        <el-autocomplete  v-model="searchinput"  :fetch-suggestions="querySearchAsync" placeholder="请输入车牌号" @select="handleSelect" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="车牌号" value="1"></el-option>
            <!-- <el-option label="组织" value="2"></el-option> -->
          </el-select>
          <!-- <el-button  slot="append" icon="el-icon-search"></el-button> -->
        </el-autocomplete>

         <el-date-picker
            v-model="value1"
            type="datetimerange"
            style="margin-left:1vw"
            range-separator="至"
            format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
            <!-- <el-button  slot="append" icon="el-icon-search"></el-button> -->
        </el-date-picker>
        <div class="search">
          <img @click="timedataBtn" src="../../assets/image/sear.png" alt="" srcset="">
        </div>
      </div>
      <div class="right-sea">
        <div @click="mapFullEvent" class="box-qunping">
          <img src="../../assets/image/fdicon.png" width="22" height="23">
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
        <div class="tit" style="color:#333333">轨迹信息</div>
        <div class="cltit">
          <div>运行总时长  46小时36分钟</div>
          <div>运行里程  674km</div>
          <div>平均速度  66km/h</div>
        </div>
        <div class="point">
            <div @click="changePoint(index)" :class="valuenum==index?'itampoint active':'itampoint'" v-for="(itam,index) in pointData" :key="index">{{itam}}</div>
        </div>
        <div class="table-box">
          <div class="table-head">
            <div class="head-it" style="width:15%">序号</div>
            <div class="head-it" style="width:45%">定位时间</div>
            <div class="head-it" style="width:25%">速度</div>
            <div class="head-it" style="width:15%">操作</div>
          </div>
          <div class="table-body">
            <el-scrollbar style="height:100%">
              <ul
                class="list">
                <li v-for="i in count" :key="i" class="list-item">
                  <div class="body-it" style="width:15%">{{i}}</div>
                  <div class="body-it" style="width:45%">2020-02-11 09:26:26</div>
                  <div class="body-it" style="width:25%">20km/h</div>
                  <div class="body-it" style="width:15%">
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
    <div class="timeCar" id="mymap2">
      <!-- top搜索 -->
    </div>
    <!-- 右下角的车辆状态 -->
    <div class="statusCar">
      <div style="margin-bottom:1vh">时速<span style="color:#999999">(km/h)</span></div>
      <div class="itamStatus1" v-for="item in carData" :key="item.id">
        <span class="leimg"></span>
        <span>{{item.name}}</span>
      </div>
    </div>
    <!-- 右下角的车辆状态 -->
    <!-- 轨迹播放 -->
    <div class="trajectoryBox">
      <div style="color:#307CFC">2020-02-11 12:30:24</div>
      <div style="color:#307CFC;margin-left:20px">28km</div>
      <div style="margin-left:20px" @click="isbf=!isbf" class="bfbtn">
        <i v-if="isbf" class="iconfont iconbofang"></i>
        <i v-if="!isbf" class="iconfont iconzantingtingzhi"></i>
      </div>
      <img style="margin-left:30px;cursor: pointer;" src="../../assets/image/sx.png" width="30" height="30">
      <div style="color:#303133;margin-left:20px">2020-02-11 12:30:24</div>
      <div style="color:#303133;margin-left:20px">28km</div>
      <div style="margin-left:40px">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{sdName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="慢速">慢速</el-dropdown-item>
            <el-dropdown-item command="快速">快速</el-dropdown-item>
            <el-dropdown-item command="正常速">正常速</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div style="margin-left:30px;cursor: pointer;">
          <el-popover
            placement="bottom"
            title="轨迹点显示设置"
            width="200"
            trigger="click"
            >
            <div><el-checkbox v-model="checked">显示异常点</el-checkbox></div>
            <i slot="reference" style="color:#307CFC;font-size:22px" class="iconfont iconshezhi2"></i>
          </el-popover>
        
      </div>
      
    </div>
    <!-- 轨迹播放 -->
  </div>
</template>

<script>
import screenfull from 'screenfull';
export default {
  name: "appMain",
  data() {
    return {
      count: 40,
      sdName:"正常速",
      checked:true,
      isbf:true,
      value1:[new Date(), new Date()],
      restaurants: [],
      timeout:  null,
      loading: false,
      myMap: null,
      ZoomNum: null,
      valuenum:0,
      isLeft:true,//是否隐藏左侧的车辆信息
      mapstyle: "normal",
      searchinput:"",
      select:"1",
      pointData:["异常点","轨迹点"],
      carData:[
        {
          name:"0-25",
          id:1,
        },
        {
          name:"25-50",
          id:2,
        },
        {
          name:"50-75",
          id:3,
        },
        {
          name:"75-100",
          id:4,
        },
        {
          name:"100-125",
          id:5,
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
  },
  methods: {
    handleCommand(val){
      console.log(val)
      this.sdName=val
    },
    initMap() {
      this.myMap = new BMap.Map("mymap2");
      this.myMap.centerAndZoom(new BMap.Point(108.933051,34.546597), 5);
      this.myMap.enableScrollWheelZoom(); //地图缩放的功能
      this.myMap.addControl(
        new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT })
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
        if(this.ZoomNum>8){
          this.isCar=true
        }else{
          this.isCar=false
        }
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
    },
    changePoint(index){
        this.valuenum=index
    },
    //时间间隔不能大于3天
    timeUpdatethree(val){
        let sTime=new Date(val[0]).getTime();
        let eTime=new Date(val[1]).getTime();
        let reduceDate=(eTime-sTime)/1000/60/60/24;
        if(reduceDate>3){
            return true;
        }
    },

    timedataBtn(val) {
        let timeUpdate=this.timeUpdatethree
        if(val!=null){
            if(timeUpdate(val)){
              this.$message.error('查询天数不能大于3天');
            }else{
            //   this.$message.success('查询成功');
            }

        }

    },



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
      position: relative;
     .search{
        position: absolute;
        top: 0;
        right: -28px;
        width:50px;
        height:39px;
        background:rgba(230,241,252,1);
        display: flex;
        justify-content: center;
        align-items: center;
     }
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
    height:86%;
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
        //   flex:1;
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
        //   flex:1;
          .iconfont{
            cursor: pointer;
            font-size:vw(20);
            color:#999999;
          }
        }
        
      }
      .list-item:hover{
        background: rgba(188,216,252,0.6);
      }
    }
    .cltit{
      width:100%;
      height:vh(120);
      display:flex;
      flex-direction: column;
      div{
        text-align:left;
        margin-bottom:vh(6);
      }
      box-sizing: border-box;
      padding: vw(18) vw(12);
      font-size: vw(16);
    }
    .point{
        width:100%;
        height:vh(50);
        display:flex;
        .itampoint{
            flex:1;
            line-height:vh(50);
            cursor: pointer;
        }
        .active{
            background:rgba(188,216,252,1);
            color:#307CFC;
        }
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
  .statusCar{
    position: absolute;
    bottom:vh(20);
    right:vw(20);
    z-index:10;
    background:rgba(255,255,255,1);
    box-shadow:1px 1px 4px 0px rgba(213,213,213,1);
    border-radius:4px;
    box-sizing:border-box;
    padding:vh(10) vw(13);
    padding-bottom:0;
    .itamStatus1{
      display:flex;
      align-items: center;
      margin-bottom:vh(10);
    //   cursor: pointer;
      .leimg{
          display:inline-block;
          width:vw(8);
          height:vh(16);
        //   background:#81dafa;
          border-radius:4px;
          margin-right:vw(10);
      }
      span{
        font-size:vw(16);
        color:#747576;
      }
    }
    .itamStatus1:nth-child(2){
      .leimg{
          background:#81dafa;
      }
    }
    .itamStatus1:nth-child(3){
      .leimg{
          background:#307cfc;
      }
    }
    .itamStatus1:nth-child(4){
      .leimg{
          background:#21c434;
      }
    }
    .itamStatus1:nth-child(5){
      .leimg{
          background:#ffd201;
      }
    }
    .itamStatus1:nth-child(6){
      .leimg{
          background:#bd0301;
      }
    }
  }
  .trajectoryBox{
    position: absolute;
    bottom:vh(20);
    left:vw(453);
    z-index:10;
    font-size:16px;
    background:rgba(255,255,255,1);
    box-shadow:1px 1px 4px 0px rgba(213,213,213,1);
    border-radius:4px;
    box-sizing:border-box;
    padding:16px 24px;
    display:flex;
    align-items: center;
    .bfbtn{
      width:24px;
      height:30px;
      display:flex;
    align-items: center;
     justify-content: center;
      background:#307CFC;
      border-radius:2px;
      cursor: pointer;
      i{
        color:#ffffff;
        font-size:9px;
      }
    }
  }
}
</style>
