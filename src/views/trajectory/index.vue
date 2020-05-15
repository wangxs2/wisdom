<template>
  <div class="map-content" ref="compreMap"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-background="rgba(255,255,255, 0.6)"
    >
    <div class="top-search">
      <div class="left-sea">
        <el-input style="width:20vw" placeholder="请输入车牌号" v-model="input3" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="车牌号" value="1"></el-option>
            <!-- <el-option label="组织" value="2"></el-option> -->
          </el-select>
          <el-button @click="getData()"  slot="append" icon="el-icon-search"></el-button>
        </el-input>
         <el-date-picker
            v-model="value1"
            @change="timedataBtn(value1)"
            type="datetimerange"
            :clearable='false'
            style="margin-left:1vw"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
            <!-- <el-button  slot="append" icon="el-icon-search"></el-button> -->
        </el-date-picker>
        <!-- <div class="search">
          <img @click="timedataBtn(value1)" src="../../assets/image/sear.png" alt="" srcset="">
        </div> -->
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
            <div v-if="valuenum==1" class="head-it" style="width:25%">速度</div>
            <div v-if="valuenum==0" class="head-it" style="width:25%">异常类型</div>
            <div class="head-it" style="width:15%">操作</div>
          </div>
          <div class="table-body">
            <el-scrollbar style="height:100%">
              <ul
                class="list">
                <li v-for="i in count" :key="i" class="list-item">
                  <div class="body-it" style="width:15%">{{i}}</div>
                  <div class="body-it" style="width:45%">2020-02-11 09:26:26</div>
                  <div v-if="valuenum==1" class="body-it" style="width:25%">20km/h</div>
                  <div v-if="valuenum==0" class="body-it" style="width:25%">停车</div>
                  <div class="body-it" style="width:15%">
                    <img src="../../assets/image/dw.png">
                  </div>
                </li>
              </ul>
              <!-- <p v-if="loading">加载中...</p>
              <p v-if="noMore">没有更多了</p> -->
            </el-scrollbar>
          </div>
        </div>
        <div class="pagingClass">
          <el-pagination
            background
            @size-change="sizeChange"
            @current-change="currentChange"
            layout="pager"
            :total="1000">
          </el-pagination>
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
      <div style="color:#307CFC">{{value1[0]}}</div>
      <div style="color:#307CFC;margin-left:20px">{{startDance}}km</div>
      <div style="margin-left:20px" @click="isbf=!isbf" class="bfbtn">
        <i v-if="isbf" @click="start()" class="iconfont iconbofang"></i>
        <i v-if="!isbf" @click="stop()" class="iconfont iconzantingtingzhi"></i>
      </div>
      <img @click="refresh()" style="margin-left:30px;cursor: pointer;" src="../../assets/image/sx.png" width="30" height="30">
      <div style="color:#303133;margin-left:20px">{{value1[1]}}</div>
      <div style="color:#303133;margin-left:20px">{{endDance}}km</div>
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
import "../../libs/util.js"
export default {
  name: "appMain",
  data() {
    return {
      count: 40,
      sdName:"正常速",
      carMk:null,
      stendMark:[],//起点和终点
      startDance:0,
      endDance:0,
      checked:true,
      isbf:true,
      value1:[new Date(new Date()-24*60*60*1000).Format('yyyy-MM-dd hh:mm:ss'), new Date().Format('yyyy-MM-dd hh:mm:ss')],//开始时间 结束时间
      beginTime:'',//开始时间
      endTime:'',//结束时间
      input3:'陕YH0008',//车牌号
      restaurants: [],
      page:1,
      pageSize:15,
      timeout:null,
      lushu:null,//路书
      loading: false,
      myMap:null,
      ZoomNum:null,
      valuenum:0,
      ptsdata:[],
      ptsdata1:[],//取旋转的角度
      oneIndex:0,//起始点
      allIndex:0,//轨迹点总的长度
      isLeft:false,//是否隐藏左侧的车辆信息
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
    },
  mounted() {
    this.restaurants = this.loadAll();
    this.initMap();
    // this.playMark()
    this.getZmap();
    
  },
  created() {
   
  },
  methods: {
    handleCommand(val){
      this.sdName=val
      console.log(val)
      if(val=="正常速"){
         setTimeout(()=>{
          this.oneIndex++;
          this.resetMkPoint(this.oneIndex);
        },600);
      }else if(val=="慢速"){
        setTimeout(()=>{
          this.oneIndex++;
          this.resetMkPoint(this.oneIndex);
        },1200);
      }else{
         setTimeout(()=>{
          this.oneIndex++;
          this.resetMkPoint(this.oneIndex);
        },300);
      }
      
    },
    //分页
    sizeChange(val){
    },
    currentChange(val){
      this.page=val
    },
    //获取数据
    getData(){
      this.loading=true
      this.$fetchGet("getTraceCar/byPeriod",{
        cNo:this.input3,
        beginTime:this.beginTime,
        endTime:this.endTime,
        page:this.page,
        pageSize:this.pageSize
      }).then(res=>{
        if(res.content.list.length>0){
          // this.getLine(res.content)
        }else{

        }
        
      })
      this.$fetchGet("getTraceCar/byPeriod",{
        cNo:this.input3,
        beginTime:this.beginTime,
        endTime:this.endTime,
        page:0,
        pageSize:0
      }).then(res=>{
        this.loading=false
        if(res.content.data.length>0){
          this.getLine(res.content.data)
        }else{
          this.$message.error('暂无数据！请重试');
        }
        
      })
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
    },
    //路书
    getLine(data){
      this.ptsdata1=data
      let markdata=[]//起点和终点
      let arrPois =[]
      let lineColor=""
      let drv = new BMap.DrivingRoute()
      data.forEach(iteam=>{
        arrPois.push(new BMap.Point(iteam.lon,iteam.lat))
          //区间颜色
        if(iteam.spd<26){
            lineColor="#4ACFFF";
        }else if(iteam.spd>25&&iteam.spd<50){
            lineColor="#307CFC";
        }else if(iteam.spd>50&&iteam.spd<75){
            lineColor="#21c434";
        }else if(iteam.spd>75&&iteam.spd<100) {
            lineColor="#FFD201";
        }else{
          lineColor="#BD0301";
        }
        //创建线路
  
      })
      let polyline = new BMap.Polyline(
          arrPois,//所有的GPS坐标点
          {
            strokeColor : lineColor, //线路颜色
            strokeOpacity:1,
            strokeWeight :6,//线路大小
          });
        //绘制线路
        this.myMap.addOverlay(polyline);
        let start=new BMap.Point(data[0].lon,data[0].lat);
        let end=new BMap.Point(data[data.length-1].lon,data[data.length-1].lat);
        this.startDance=this.myMap.getDistance(start,new BMap.Point(data[0].lon,data[0].lat))
        this.endDance=this.myMap.getDistance(start,end)
        markdata.push(start,end)
        this.setStendMark(markdata)
        this.myMap.setViewport(arrPois);
        this.ptsdata=arrPois
       
    },

    //播放点的速度
    playMark(){
      var that=this
      var myP1 = new BMap.Point(116.380967,39.913285);    //起点
      var myP2 = new BMap.Point(116.424374,39.914668);    //终点
      var driving2 = new BMap.DrivingRoute(this.myMap, {renderOptions:{map: this.myMap, autoViewport: true}});    //驾车实例
      driving2.search(myP1, myP2);    //显示一条公交线路
      window.run =  ()=>{
        var driving = new BMap.DrivingRoute(that.myMap);    //驾车实例
        driving.search(myP1, myP2);
        driving.setSearchCompleteCallback(()=>{
          var pts = driving.getResults().getPlan(0).getRoute(0).getPath();
          console.log(44)
          console.log(pts) 
          this.ptsdata=pts
          // this.startlushu(pts)   //通过驾车实例，获得一系列点的数组
          // var paths = pts.length;    //获得有几个点
          // var carMk = new BMap.Marker(pts[0],{icon:myIcon});
          // carMk.addEventListener("click",(e)=>{
          // })
          // that.myMap.addOverlay(carMk);
          // let i=0;
          // function resetMkPoint(i){
          //   carMk.setPosition(pts[i]);
          //   carMk.setRotation(90)
          //   if(i < paths){
          //     setTimeout(function(){
          //       i++;
          //       resetMkPoint(i);
          //     },100);
          //   }
          // }
          // setTimeout(function(){
          //   resetMkPoint(0);
          // },100)

        });
      }
      run();
      // setTimeout(function(){
      //   run();
      // },1500);

    },

    startlushu(pts){
      this.allIndex = pts.length
      if(this.carMk){
        this.myMap.removeOverlay(this.carMk);  
      }
       var myIcon = new BMap.Icon(require('../../assets/image/xs.png'), new BMap.Size(30,30), {    //小车图片
        //offset: new BMap.Size(0, -5),    //相当于CSS精灵
        imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
        });
      this.carMk  = new BMap.Marker(pts[this.oneIndex],{icon:myIcon});
      if(this.oneIndex==0){
        this.carMk.setAnimation(BMAP_ANIMATION_DROP);
      }
        
        this.myMap.addOverlay(this.carMk );
        this.resetMkPoint()

        // setTimeout(()=>{
        //   this.resetMkPoint(this.oneIndex);
        // },1500)
     
    },
    resetMkPoint(){
      this.carMk.setPosition(this.ptsdata[this.oneIndex]);
      this.carMk.setRotation(this.ptsdata1[this.oneIndex].drc+180)
      // this.carMk.setRotation(225)
      console.log(this.oneIndex)
      if(this.oneIndex < this.allIndex){
        // setTimeout(()=>{
        //   this.oneIndex++;
        //   this.resetMkPoint(this.oneIndex);
        // },600);
        this.handleCommand(this.sdName)
      }
    },
    start(){
      //  this.lushu.start();
      this.startlushu(this.ptsdata)
    },
    //路书重置
    refresh(){
      this.oneIndex=0
      this.startlushu(this.ptsdata)
    },
    stop(){
      // this.lushu.pause();
      console.log(this.oneIndex)
      this.allIndex=this.oneIndex
    },
    //设置起点和终点
    setStendMark(data){
      if(this.stendMark.length>0){
         this.stendMark.forEach(iteam=>{
          this.myMap.removeOverlay(iteam);  
        })
      }else{
        data.forEach((iteam,index)=>{
            let icon;
            if(index==0){
              icon=require('../../assets/image/kas.png')
            }else{
              icon=require('../../assets/image/zd1.png')
            }
            let opts = {
                icon : new BMap.Icon(icon, new BMap.Size(44,44),new BMap.Size(0,0),{
                  imageOffset: new BMap.Size(0, 0)  
                }),    // 指定文本标注所在的地理位置
                offset : index==0?new BMap.Size(-4,-22): new BMap.Size(-5,-22)   //设置文本偏移量
            }
            let marker = new BMap.Marker(iteam, opts); 
            this.stendMark.push(marker);
            this.myMap.addOverlay(marker);  
        })
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
        this.beginTime=val[0]
        this.endTime=val[1]
        if(val!=null){
          
            if(timeUpdate(val)){
              this.$message.error('查询天数不能大于3天');
            }else{
            //   this.$message.success('查询成功');
                this.getData()
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
      display: flex;
       justify-content: flex-start;
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
    .pagingClass{
      box-sizing:border-box;
      padding:vh(6) vw(4);
      padding-top:vh(12);
    }
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
