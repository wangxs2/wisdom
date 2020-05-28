<template>
  <div class="map-content" ref="compreMap">
    <div class="top-search">
      <div class="left-sea">
        <el-select style="width:80px" @change="searchinput=''" v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="车辆" value="1"></el-option>
          <el-option label="组织" value="2"></el-option>
        </el-select>
         <el-select style="width:300px" v-model="searchinput" @change="handleSelect" filterable :placeholder="select=='1'?'请输入车牌号':'请输入油厂名称'">
            <el-option
              v-for="(item,index) in restaurants"
              :key="index"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
      </div>
      <!-- 录入省市的边界 -->
      <!-- <el-select  @change="getXzqu" v-model="inputaas" placeholder="请选择">
        <el-option
          style="width:400px"
          v-for="(item,index) in options"
          :key="index"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <el-select  @change="postName" v-model="value" placeholder="请选择">
        <el-option
          style="width:400px"
          v-for="(item,index) in options"
          :key="index"
          :label="item.name"
          :value="item.center">
        </el-option>
      </el-select> -->
      <!-- 录入省市的边界 -->
      <div class="right-sea">
        <div class="bjbtn" @click="isWaring=!isWaring" type="danger"><img src="../../assets/image/bjicon.png"> 报警（{{waringData.length}}）</div>
        <div class="shua"  @click="totalTime=60,getAllCar()"> <i class="iconfont icon-shuaxin1"></i>距离下一次刷新 <span style="color:#1989FA"> {{totalTime}} </span> 秒</div>
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
             <el-select style="width:100%" size="small" @change="carStatus()" v-model="valuenum" placeholder="请选择">
                <el-option
                  v-for="item in cltitData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
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
            <div class="head-it" style="width:15%">序号</div>
            <div class="head-it" style="width:35%">车牌号</div>
            <div class="head-it" v-if="valuenum!==1&&valuenum!==2">车辆状态</div>
            <div class="head-it" v-if="valuenum==1">速度</div>
            <div class="head-it" v-if="valuenum==2">静止时长</div>
            <div class="head-it">操作</div>
          </div>
          <div class="table-body">
            <el-scrollbar style="height:100%">
              <ul
                class="list">
                <li v-for="(itam,index) in countLeft" :key="index" class="list-item">
                  <div class="body-it" style="width:15%">{{index+1}}</div>
                  <div class="body-it" style="width:35%">{{itam.cNo}}</div>
                  <div class="body-it" v-if="valuenum!==1&&valuenum!==2"><span :class="itam.onLine==1?'body-it0':itam.onLine==2?'body-it1':'body-it2'">{{itam.net==-1?"未入网":itam.onLine==1?'行驶':itam.onLine==2?'静止':itam.onLine==-1?'离线':''}}</span></div>
                  <div class="body-it" v-if="valuenum==1">{{itam.spd}}km/h</div>
                  <div class="body-it" v-if="valuenum==2">{{toHourMinute(itam.during)}}</div>
                  <div class="body-it">
                    <img @click="guiji(itam)" src="../../assets/image/bf.png">
                    <img style="margin-left:14px" @click="dwMark(itam,2)" src="../../assets/image/dw.png">
                  </div>
                </li>
              </ul>
              <!-- <p v-if="loading">加载中...</p>
              <p v-if="noMore">没有更多了</p> -->
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
            <div class="head-it" style="width:15%">序号</div>
            <div class="head-it" style="width:35%">车牌号</div>
            <div class="head-it">停留时长</div>
            <div class="head-it">操作</div>
          </div>
          <div class="table-body">
            <el-scrollbar style="height:100%">
              <ul
                class="list">
                <li v-for="(iteam,index) in waringData" :key="index" class="list-item">
                  <div class="body-it" style="width:15%">{{index+1}}</div>
                  <div class="body-it" style="width:35%">{{iteam.cNo}}</div>
                  <div class="body-it">{{toHourMinute(iteam.during)}}</div>
                  <div class="body-it">
                    <!-- <i  class="iconfont icon-bofang1"></i> -->
                    <img @click="dwMark(iteam,2)" src="../../assets/image/dw.png">
                  </div>
                </li>
              </ul>
              <!-- <p v-if="loading">加载中...</p>
              <p v-if="noMore">没有更多了</p> -->
            </el-scrollbar>
          </div>
        </div>
        
      </div>
    </transition>
    <!-- 报警的列表 -->
    <!-- 缩放的按钮 -->
    <div class="zoomBtn">
      <div class="box-big" @click="addLk()">
        <img v-if="islk" src="../../assets/image/lk1.png" width="26" height="26">
        <img v-if="!islk" src="../../assets/image/lk2.png"  width="26" height="26">
      </div>
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
    <!-- 右下角的车辆状态 -->
    <div class="statusCar" v-if="isCar">
      <div class="itamStatus" v-for="item in carData" :key="item.id">
        <img :src="item.iurl" width="16" height="16">
        <span>{{item.name}}</span>
      </div>
    </div>
    <!-- 右下角的车辆状态 -->
  </div>
</template>

<script>
import screenfull from 'screenfull';
import Clipboard from 'clipboard'
import cityName from './city.js';
export default {
  name: "appMain",
  data() {
    return {
      countLeft:[],//左侧
      myCno:'',
      oilData:[],
      waringData:[],
      value:'',
      inputaas:'',
      totalTime: 60, //倒计时
      activeLab:null,//选中车辆
      activeInfow:null,//选中车辆详细信息
      activemillInfow:null,//选中油厂详细信息
      restaurants: [],
      restaurants1: [],
      timeout:  null,
      loading: false,
      isWaring: false,
      isCar: false,//图例
      myMap: null,
      ZoomNum: null,
      valuenum:0,
      isLeft:true,//是否隐藏左侧的车辆信息
      mapstyle: "normal",
      searchinput:"",
      cityPoint:[],//省的聚合
      cityMarker:[],//车辆和组织
      select:"1",
      carData:[
        {
          name:"行驶",
          id:1,
          iurl:require("../../assets/image/xs.png")
        },
        {
          name:"静止",
          id:2,
          iurl:require("../../assets/image/jz.png")
        },
        {
          name:"离线",
          id:3,
          iurl:require("../../assets/image/lx.png")
        },
        {
          name:"油厂",
          id:4,
          iurl:require("../../assets/image/yc3.png")
        },
      ],
      cltitData:[
        {
          name:"全部",
          id:0,
        },
        {
          name:"行驶",
          id:1,
        },
        {
          name:"静止",
          id:2,
        },
        {
          name:"离线",
          id:-1,
        },
         {
          name:"未入网",
          id:3,
        },
      ],
      allData:[],
      OilFacData:[],
      statusData:[],
      myOilFac:[],
      activeLab1:null,
      myAllCp:[],
      onLine:"",
      titindex:0,
      islk:true,//路况
      tiadata:{},//轨迹回放
      ctrl:null,
      myMapTwo:null,
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
    "select":function(val,old){
      if(val==2){
        this.restaurants=this.myOilFac
      }else{
        this.restaurants=this.restaurants1
      }
    }
  },
  computed: {
      noMore () {
        return this.statusData >= this.statusData.length
      },
      disabled () {
        return this.loading || this.noMore
      }
    },
  mounted() {
    this.getstaData()
    this.initMap();
    this.getZmap();
    $('.map-content').on("click", "#close1",  ()=> {
      this.myMap.removeOverlay(this.activeInfow); 
      this.myMap.removeOverlay(this.activeLab); 
    })
    $('.map-content').on("click", "#close2",  ()=> {
      this.myMap.removeOverlay(this.activemillInfow); 
      this.myMap.removeOverlay(this.activeLab1); 
    })
    $('.map-content').on("click", "#trajectory",  ()=> {
       this.guiji(this.tiadata)
    })
    
  },
  created() {
    this.options=cityName
    this.countDown()
    this.getAllCar()
   
    
  },
  methods: {
    //倒计时
    countDown() {
      if(this.totalTimeme){
        clearTimeout(this.totalTimeme)
      }
      this.totalTime--
      if(this.totalTime<0){
        this.totalTime=60
        this.getAllCar()
      }
      this.totalTimeme=setTimeout( ()=> {
				this.countDown()
			}, 1000)
    },
    addLk(){
      this.islk=!this.islk
      if(!this.islk){
        this.ctrl.showTraffic({predictDate:{hour:15, weekday: 5}});
      }else{
        this.ctrl.hideTraffic();
      }
    },
    //轨迹回放
    guiji(row){
       this.$router.push({
        name: 'trajectory',
        params: {
          type: 'update',
          updateData: row
        }
      });
    },
    //定位到当前的点
    dwMark(row,type){
      this.myMap.centerAndZoom(new BMap.Point(row.lon,row.lat),19);
      if(type==1){
        if(this.select=='1'){
          this.myCno=row.cNo
          this.showIclice(row)
          this.showInform(row)
        }else{
          this.showIcl(row)
          this.showmillInform(row)
        }
      }else{
        this.myCno=row.cNo
        this.showIclice(row)
        this.showInform(row)
      }
     
    },
    //切换车辆的状态
    carStatus(){
      if(this.select=="1"){
        this.getAllCar()
      }
    },
    getstaData(){
      this.myOilFac=[]
      this.restaurants1=[]
      this.$fetchGet("monitor/getFooBar").then(res=>{
        res.content[0].forEach((iteam,index)=>{
          this.cltitData[index].name=this.cltitData[index].name+'('+iteam+')'
        })
      })

      this.$fetchGet("monitor/getAllCNo").then(res=>{
        this.myAllCp=this.cloneObj(res.content)
        res.content.forEach((iteam,index)=>{
          this.restaurants1.push({value:iteam.cNo})
        })
        this.restaurants=this.restaurants1
        console.log(this.restaurants1)
      })
      this.$fetchGet("location/getPageOilFac").then(res=>{
        this.OilFacData=this.cloneObj(res.content)
        res.content.forEach((itam,index)=>{
          this.myOilFac.push({value:itam.fName})
        })
      })
    },
    getAllCar(){
      this.waringData=[]
      this.statusData=[]
      this.allData=[]
      this.countLeft=[]
      this.$fetchGet("monitor/getLinkage",{
        cNo:"",
        stat:this.valuenum
      }).then(res=>{
          if(res.code=='1'){
            this.allData=res.content.graph
            this.countLeft=this.cloneObj(res.content.cars)
            this.statusData=this.cloneObj(res.content.cars)
            if(this.activeLab){
              let num=this.statusData.findIndex((element)=>(element.cNo ==this.myCno))
              if(num==-1){
                this.myMap.removeOverlay(this.activeLab);
                this.myMap.removeOverlay(this.activeInfow);
              }else{
                this.statusData.forEach((iteam,index)=>{
                  if(iteam.cNo==this.myCno){
                    this.activeLab.setPosition(new BMap.Point(iteam.lon,iteam.lat))
                    this.activeInfow.setPosition(new BMap.Point(iteam.lon,iteam.lat))
                  }
                })
              }
            }
            
          }else{
             if(this.ZoomNum>8){
                this.clearMark()
              }else{
                this.clearBig()
              }
              if(this.activeLab){
                this.activeLab.setPosition(new BMap.Point(iteam.lon,iteam.lat))
                this.activeInfow.setPosition(new BMap.Point(iteam.lon,iteam.lat))
              }
          }
          if(this.ZoomNum>8){
            this.statuMark()
          }else{
            this.makeBigcel()
          }
          
      })
      this.$fetchGet("monitor/getWarn").then(res=>{
        if(res.code==1){
          this.waringData=res.content
        }
        // this.waringData=res.content
      })


    },
    initMap() {
      // 108.933051,34.546597
      this.myMap = new BMap.Map("mymap");
      // this.myMapTwo = new BMapGL.Map("mymap"); 
      this.myMap.centerAndZoom(new BMap.Point(121.644624,31.205915), 5);  
      this.myMap.enableScrollWheelZoom(); //地图缩放的功能
      this.myMap.addControl(
        new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT })
      );
      // this.myMap.setMapStyleV2({     
      //   styleId: '877fcc51379e35af5063374cd7687818'
      // });

      this.ctrl = new BMapLib.TrafficControl({showPanel: false});
      this.ctrl.setAnchor(BMAP_ANCHOR_BOTTOM_RIGHT);  
      this.myMap.addControl(this.ctrl);
      // this.statuMark()
    },
    //地图的缩放时间
    getZmap() {
      this.myMap.addEventListener("zoomend", () => {
        this.ZoomNum = this.myMap.getZoom();
        if(this.ZoomNum>8){
          this.isCar=true
          this.clearBig()
          this.statuMark()
        }else{
          this.isCar=false
          this.makeBigcel()
          this.clearMark()
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
      // this.searchinput=""
      console.log(item)
      if(this.select=='1'){
        this.statusData.forEach((iteam,index)=>{
          if(item==iteam.cNo){
              if(iteam.net==-1){
                this.$notify.error({
                  title: '',
                  message: '车辆未入网',
                  position: 'top-left'
                });
              }
              this.dwMark(iteam,1)
          }
        })
      }else{
        this.OilFacData.forEach((iteam,index)=>{
          if(item==iteam.fName){
            this.dwMark(iteam,1)
          }
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
    //大圆圈的点
    makeBigcel(){
      this.clearBig()
      this.allData.forEach(iteam=>{
        var point = new BMap.Point(iteam.centerLongitude,iteam.centerLatitude);
        let opts = {
            position : point,    // 指定文本标注所在的地理位置
            offset   : new BMap.Size(-20, -30)    //设置文本偏移量
          }
        let img,width,height;
        if(iteam.num<10){
          img=require('../../assets/image/1w.png')
          width="27px"
          height=29
        }else if(iteam.num>9&&iteam.num<100){
          img=require('../../assets/image/2w.png')
          width="33px"
          height=37
        }else if(iteam.num>99&&iteam.num<1000){
          img=require('../../assets/image/3w.png')
          width="41px"
          height=45
        }else if(iteam.num>999&&iteam.num<10000){
          img=require('../../assets/image/4w.png')
          width="47px"
          height=52
        }
        let conten=`<div style="width:${width};height:${height}px;cursor: pointer;color:#ffffff;font-size:16px;text-align:center;line-height:${height-4}px;background:url(${img});background-size:100% 100%">${iteam.num}</div>`
        let label = new BMap.Label(conten, opts);  // 创建文本标注对象
        label.addEventListener("click",()=>{
          let obj=label.getPosition()
          this.myMap.setZoom(9)
          this.myMap.centerAndZoom(new BMap.Point(obj.lng,obj.lat), 9);
        });
        this.cityPoint.push(label);
        this.myMap.addOverlay(label);   
      })
    },
    //清除大圆圈
    clearBig(){
      this.cityPoint.forEach(iteam=>{
        this.myMap.removeOverlay(iteam);  
      })
    },
    //各个状态的点
    statuMark(){
      this.clearMark()
      this.statusData.forEach(iteam=>{
        let point = new BMap.Point(iteam.lon,iteam.lat);
        let icon;
        if(iteam.onLine==1){
          icon=require('../../assets/image/xs.png')
        }else if(iteam.onLine==2){
          icon=require('../../assets/image/jz.png')
        }else{
          icon=require('../../assets/image/lx.png')
        }
        let opts = {
            icon : new BMap.Icon(icon, new BMap.Size(30,30)),    // 指定文本标注所在的地理位置
            offset : new BMap.Size(-15, -15)    //设置文本偏移量
        }
        let marker = new BMap.Marker(point, opts);  // 创建文本标注对象
        marker.setRotation(iteam.drc)
        marker.addEventListener("click",()=>{
          this.showIclice(iteam)
          this.showInform(iteam)
        });
        this.cityMarker.push(marker);
        this.myMap.addOverlay(marker);   
      })
      this.OilFacData.forEach(iteam=>{
        let point = new BMap.Point(iteam.lon,iteam.lat);
        let icon=require('../../assets/image/yc3.png');
        let opts = {
            icon : new BMap.Icon(icon, new BMap.Size(27,30)),   // 指定文本标注所在的地理位置
            offset : new BMap.Size(-15, -15)    //设置文本偏移量
        }
        let marker = new BMap.Marker(point, opts);  // 创建文本标注对象
        marker.addEventListener("click",()=>{
          this.showIcl(iteam)
          this.showmillInform(iteam)
        });
        this.cityMarker.push(marker);
        this.myMap.addOverlay(marker);   
      })
    },
    //显示那个大圆圈
    showIclice(row){
      if(this.activeLab){
        this.myMap.removeOverlay(this.activeLab); 
      }
      this.myCno=row.cNo
      let activep = {
            position : new BMap.Point(row.lon,row.lat),    // 指定文本标注所在的地理位置
            offset   : new BMap.Size(-48, -48)    //设置文本偏移量
          }
          let conten1=`<div style="width:60px;
                                  height:60px;
                                  background:${row.onLine==1?'rgba(188,216,252,0.2)':row.onLine==2?'rgba(253,226,186,0.2)':'rgba(223,222,222,0.2)'};
                                  box-shadow:0px 2px 2px 0px rgba(0,0,0,0.5);
                                  border:2px solid ${row.onLine==1?'rgba(48,124,252,1)':row.onLine==2?'rgba(255,153,0,1)':'rgba(151,151,151,1)'};
                                  border-radius:50%;"></div>`
          let label1 = new BMap.Label(conten1, activep);  // 创建文本标注对象
          this.activeLab=label1
          this.myMap.addOverlay(label1); 

    },
     //显示那个大圆圈
    showIcl(row){
      if(this.activeLab1){
        this.myMap.removeOverlay(this.activeLab1); 
      }
      let activep = {
            position : new BMap.Point(row.lon,row.lat),    // 指定文本标注所在的地理位置
            offset   : new BMap.Size(-48, -48)    //设置文本偏移量
          }
          let conten1=`<div style="width:60px;
                                  height:60px;
                                  background:rgba(188,216,252,0.4);
                                  box-shadow:0px 2px 2px 0px rgba(0,0,0,0.5);
                                  border:2px solid rgba(37,205,119,1);
                                  border-radius:50%;"></div>`
          let label1 = new BMap.Label(conten1, activep);  // 创建文本标注对象
          this.activeLab1=label1
          this.myMap.addOverlay(this.activeLab1); 

    },
    //清除车辆和组织
    clearMark(){
      console.log(this.ZoomNum)
      this.cityMarker.forEach(iteam=>{
        this.myMap.removeOverlay(iteam);  
      })
      if(this.activeLab&&(this.ZoomNum<8||this.ZoomNum==8)){
        this.myMap.removeOverlay(this.activeLab); 
      }
      if(this.activeInfow&&(this.ZoomNum<8||this.ZoomNum==8)){
        this.myMap.removeOverlay(this.activeInfow); 
      }

      if(this.activeLab1&&(this.ZoomNum<8||this.ZoomNum==8)){
        this.myMap.removeOverlay(this.activeLab1); 
      }
      if(this.activemillInfow&&(this.ZoomNum<8||this.ZoomNum==8)){
        this.myMap.removeOverlay(this.activemillInfow); 
      }
    },
    
    //显示车辆的信息
    showInform(row){
      if(this.activeInfow){
        this.myMap.removeOverlay(this.activeInfow); 
      }
     
      let activep1 = {
            position: new BMap.Point(row.lon,row.lat),    // 指定文本标注所在的地理位置
            offset: new BMap.Size(-180, -270)    //设置文本偏移量
      }
      this.tiadata=row
      var sContent=`<div id="copysa1" data-clipboard-text='${row.cNo},时速:${row.spd}km/h,定位时间：${new Date(row.utc*1000).Format('yyyy-MM-dd hh:mm:ss')},最后定位:${row.adr}' style="width:360px;background:#ffffff;position:relative;box-shadow:0px 0px 12px 0px rgba(51,51,51,0.3);border-radius:4px;z-index:800">
                        <div style="display:flex;width:100%;height:50px;background:${row.onLine==1?'rgba(48,124,252,1)':row.onLine==2?'rgba(255,153,0,1)':'rgba(151,151,151,1)'}; justify-content: space-between;align-items: center;box-sizing: border-box;
                        padding:10px 20px;">
                          <img src="${require('../../assets/image/qc1.png')}" width="32" height="32">
                          <span style="font-size:22px;color:#ffffff">${row.cNo}</span>
                          <img id="close1" style="cursor: pointer;" src="${require('../../assets/image/close2.png')}" width="16" height="16">
                        </div>
                        <div style="width:100%;overflow:hidden;box-sizing:border-box;padding:10px">
                          <div style="display:flex;justify-content:flex-start;font-size:16px;color:#7B7D7F;margin-bottom:6px;">
                            <div style="width:66px">时速</div>
                            <div style="margin-left:16px;flex:1">${row.spd} km/h</div>
                          </div>
                          
                          <div style="display:flex;justify-content:flex-start;font-size:16px;color:#7B7D7F;margin-bottom:6px;">
                            <div style="width:66px">定位时间</div>
                            <div style="margin-left:16px">${new Date(row.utc*1000).Format('yyyy-MM-dd hh:mm:ss')}</div>
                          </div>
                          <div style="display:flex;justify-content:flex-start;font-size:16px;color:#7B7D7F;display:${row.adr==undefined?'none':''}">
                            <div style="width:66px">最后定位</div>
                            <div style="margin-left:16px;word-break:break-all;flex:1"">${row.adr}</div>
                          </div>
                          <div style="display:flex;justify-content:center;margin-top:14px">
                             <div id="trajectory" style="cursor: pointer;width:110px;height:30px;background:rgba(48,124,252,1);border-radius:4px;color:#ffffff;display:flex;justify-content:center;align-items:center;">
                                   <img style="margin-right:6px" src="${require('../../assets/image/bf1.png')}" width="16" height="20">轨迹回放
                             </div>
                          </div>
                        </div>
                        <div style="position: absolute;bottom:-12px;left:165px;border-left: 8px solid transparent;border-right: 8px solid transparent;border-top: 12px solid #ffffff;"></div>
                    </div>`
      var infoWindow = new BMap.Label(sContent, activep1);
        // 创建信息窗口对象
      infoWindow.addEventListener("dblclick",()=>{
        var clipboard = new Clipboard('#copysa1')
        console.log(clipboard)
        clipboard.on('success', e => {
          this.$message({
            message: '复制成功',
            type: 'success'
          });
          clipboard.destroy()
        })
         clipboard.on('error', e => {
          this.$message.error('该浏览器不支持自动复制');
          clipboard.destroy()
        })
      });
      infoWindow.setZIndex(900)
      this.activeInfow=infoWindow
      this.myMap.addOverlay(this.activeInfow); 
    },
    //显示油厂的的信息
    showmillInform(row){
       if(this.activemillInfow){
        this.myMap.removeOverlay(this.activemillInfow); 
      }
      let activep1 = {
            position: new BMap.Point(row.lon,row.lat),    // 指定文本标注所在的地理位置
            offset: new BMap.Size(-180, -140)    //设置文本偏移量
      }
      var sContent=`<div id="copysa2" data-clipboard-text='${row.fName},地址:${row.adr}' style="width:400px;background:#ffffff;position:relative;box-shadow:0px 0px 12px 0px rgba(51,51,51,0.3);border-radius:4px;z-index:800">
                        <div style="display:flex;width:100%;height:50px;background:rgba(208,250,228,1); justify-content: space-between;align-items: center;box-sizing: border-box;
                        padding:8px 16px;">
                          <img src="${require('../../assets/image/yt1.png')}" width="28" height="16">
                          <span style="font-size:18px;color:#25CD77">${row.fName}</span>
                          <img id="close2" style="cursor: pointer;" src="${require('../../assets/image/close1.png')}" width="16" height="16">
                        </div>
                        <div style="width:100%;overflow:hidden;box-sizing:border-box;padding:10px">
                          <div style="display:flex;justify-content:flex-start;font-size:16px;color:#7B7D7F;">
                            <div style="width:36px">地址</div>
                            <div style="margin-left:16px;word-break:break-all;flex:1"">${row.adr}</div>
                          </div>
                        </div>
                        <div style="position: absolute;bottom:-12px;left:165px;border-left: 8px solid transparent;border-right: 8px solid transparent;border-top: 12px solid #ffffff;"></div>
                    </div>`
      var infoWindow = new BMap.Label(sContent, activep1);  // 创建信息窗口对象
      infoWindow.addEventListener("dblclick",()=>{
        var clipboard = new Clipboard('#copysa2')
        console.log(clipboard)
        clipboard.on('success', e => {
          this.$message({
            message: '复制成功',
            type: 'success'
          });
          clipboard.destroy()
        })
         clipboard.on('error', e => {
          this.$message.error('该浏览器不支持自动复制');
          clipboard.destroy()
        })
      });
      infoWindow.setZIndex(900)
      this.activemillInfow=infoWindow
      this.myMap.addOverlay(this.activemillInfow); 
    },
    postName(){
      this.$fetchPost("monitor/insetPogem",{
        orgName:this.inputaas,
        polygonGeom:this.mapo,
        centerLongitude:this.value
      },'json').then(res=>{
      })
    },

    // 将分钟数量转换为小时和分知钟字符串道
   toHourMinute(minutes){
      if(minutes/60<1){
        return (minutes + "分" );
      }else{
        return (Math.floor(minutes/60) + "小时" + (minutes%60) + "分" );
      }
    },
    // 使用示属例
    //搜索行政区录入数据库
    getXzqu(){
      var bdary = new BMap.Boundary();
      bdary.get(this.inputaas, (rs)=>{       //获取行政区域
        this.myMap.clearOverlays();        //清除地图覆盖物       
        var count = rs.boundaries.length; //行政区域的点有多少个
        if (count === 0) {
          alert('未能获取当前输入行政区域');
          return ;
        }
        this.mapo=''
        var pointArray = [];
        for (var i = 0; i < count; i++) {
          var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#ff0000"}); //建立多边形覆盖物
          this.myMap.addOverlay(ply);  //添加覆盖物
          pointArray = pointArray.concat(ply.getPath());
          this.mapo=rs.boundaries[i]
        }    
        this.myMap.setViewport(pointArray);    //调整视野  
        this.mapo=this.formattingCharacters(pointArray)
        // addlabel();               
      });  
    },

    //处理边界的经纬度
    formattingCharacters (val) {
      // let arr = val
      // arr.push(val[0]);
      let arr1 = [];
      let arr2;
      val.forEach((iteam, index) => {
        arr1.push(iteam.lng + ' ' + iteam.lat)
      })
      arr2 = arr1.join(',')
      let arr3 = `POLYGON((${arr2}))`
      return arr3
    },

  }
};
</script>
<style lang="scss">
.BMapLabel{
  border:none !important;
  background-color:transparent !important;
}
.el-input__inner{
  border-radius:0!important;
}
.top-search .el-select .el-input {
    // width: vw(100);
}
.el-scrollbar__wrap{
  overflow-x: hidden !important;
  overflow-y: scroll;
}
.searchbtn{
  background:rgba(230,241,252,1);
  .el-icon-search{
    font-weight:800;
    color:#307CFC;
  }
}
.el-icon-message-solid{
  // display: inline-block;
  // width: 18px;
  // height: 22px;
  // background: url("../../assets/image/bjicon.png") no-repeat;
  // background-size: 100% 100%;
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
      .bjbtn{
        width:136px;
        height:40px;
        display: flex;
        justify-content: center;
        align-items: center;
        background:rgba(221,39,38,1);
        box-shadow:1px 1px 2px 0px rgba(181,181,181,1);
        border-radius:4px;
        font-size:16px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(249,249,249,1);
        cursor: pointer;
        img{
          margin-top:-2px;
          margin-right:10px;
          
        }
      }
      .bjbtn:hover{
        background:rgba(221,39,38,0.8);
      }
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
        width:vw(250);
       box-sizing: border-box;
       padding: vh(10) vw(10);
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
          width:25%;
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
          width:25%;
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
    width:vw(464);
    height: 76%;
    right: vw(20);
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
    left: -2px;
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
    .itamStatus{
      display:flex;
      align-items: center;
      margin-bottom:vh(10);
      cursor: pointer;
      img{
        margin-right:vw(8);
      }
      span{
        font-size:vw(16);
      }
    }
    .itamStatus:nth-child(4){
      border-top:1px solid #F0F2F5;
      padding-top:vh(10);
    }
  }
}
</style>
