<template>
  <div class="map-content" id="full" ref="compreMap"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-background="rgba(255,255,255, 0.6)"
    >
    <div class="top-search">
      <div class="left-sea">
         <el-select style="width:80px" @change="input3=''" v-model="select" slot="prepend" :popper-append-to-body="false" placeholder="请选择">
          <el-option label="车辆" value="1"></el-option>
          <el-option label="组织" value="2"></el-option>
        </el-select>
         <el-select style="width:300px" v-model="input3" @change="getData()" :popper-append-to-body="false" filterable :placeholder="select=='1'?'请输入车牌号':'请输入油厂名称'">
            <el-option
              v-for="(item,index) in restaurants"
              :key="index"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
         <el-date-picker
            v-model="value1"
            @blur="timedataBtn(value1)"
            type="datetimerange"
            :popper-append-to-body="false"
            :clearable='false'
            style="margin-left:1vw"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
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
            <div>运行总时长  {{ageTime}}小时</div>
            <div>运行里程  {{allDistance}}km</div>
            <div>平均速度  {{ageSpeed}}km/h</div>
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
                  <li v-for="(iteam,index) in count" :key="index" class="list-item">
                    <div class="body-it" style="width:15%">{{index+1}}</div>
                    <div class="body-it" style="width:45%">{{new Date(iteam.utc*1000).Format('yyyy-MM-dd hh:mm:ss')}}</div>
                    <div v-if="valuenum==1" class="body-it" style="width:25%">{{iteam.spd}}km/h</div>
                    <div v-if="valuenum==0" class="body-it" style="width:25%">停车</div>
                    <div class="body-it" style="width:15%" @click="setLeftMark(iteam)">
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
              :page-size="15"
              :current-page="page"
              @current-change="currentChange"
              layout="pager"
              :total="total">
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
      <div class="itamStatus1" style="border-top:1px solid #eeeeee;padding-top:4px">
        <img src="../../assets/image/new/ycnromal.png" width="13" height="15" style="margin-right:6px">
        <span>油厂</span>
      </div>
    </div>
    <!-- 右下角的车辆状态 -->
    <!-- 轨迹播放 -->
    <div class="trajectoryBox">
      <div style="color:#307CFC">{{startTimesa}}</div>
      <div style="color:#307CFC;margin-left:20px">{{startDance.toFixed(2)}}km</div>
      <div style="margin-left:20px" @click="istop()" class="bfbtn">
        <i v-if="isbf" style="color:#307CFC" class="iconfont iconbofang"></i>
        <i v-if="!isbf" style="color:#307CFC" class="iconfont iconzantingtingzhi"></i>
      </div>
      <img @click="refresh()" style="margin-left:30px;cursor:pointer;" src="../../assets/image/sx.png" width="20" height="20">
      <div style="color:#303133;margin-left:20px">{{endTimesa}}</div>
      <div style="color:#303133;margin-left:20px">{{allDistance}}km</div>
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
            <div><el-checkbox @change="isShow" v-model="checked">显示异常点</el-checkbox></div>
            <i slot="reference" style="color:#307CFC;font-size:22px" class="iconfont iconshezhi2"></i>
          </el-popover>
        
      </div>
      
    </div>
    <!-- 轨迹播放 -->
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import screenfull from 'screenfull';
import "../../libs/util.js"
export default {
  name: 'trajectory',
  data() {
    return {
      count:[],
      qweasd:'',
      normalCount:[],
      restaurants1:[],
      errorCount:[],
      normalTotal:0,
      errorTotal:0,
      total:0,
      sdName:"正常速",
      ageSpeed:"",//运行的平均速度
      ageTime:"",//运行的总时长
      carMk:null,
      fullscreen:false,
      activeInfow:null,//异常点的信息
      stendMark:[],//起点和终点
      startDance:0,
      endDance:0,
      checked:true,
      mycopy:"",
      isbf:true,
      value1:[new Date(new Date()-24*60*60*1000).Format('yyyy-MM-dd hh:mm:ss'), new Date().Format('yyyy-MM-dd hh:mm:ss')],//开始时间 结束时间
      input3:'',//车牌号
      page:1,
      pageSize:15,
      timeout:null,
      restaurants: [],
      lushu:null,//路书
      loading: false,
      myMap:null,
      statusError:[],//异常点的数据
      cityMarker:[],//异常点的数据
      ZoomNum:null,
      polyline:null,
      polylinearr:[],
      valuenum:0,
      ptsdata:[],
      allDistance:'',
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
      timeId:null,
      leftMark:null,
      startTimesa:"",//随时变化的里程数和时间
      endTimesa:"",//随时变化的里程数和时间
      startDancesa:'',//随时变化的里程数和时间
      updateData:{},//从实时监控过来的数据
      OilFacData:[],//油厂
      cityMarker1:[],//油厂
      activeLab1:null,//油厂
      activemillInfow:null,//油厂
      myOilFac:[],//油厂
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
    },
  mounted() {
    this.initMap();
    this.getData()
    this.getZmap();
    $('.map-content').on("click", "#close2",  ()=> {
      this.myMap.removeOverlay(this.activeInfow); 
    }) 
    $('.map-content').on("click", "#close3",  ()=> {
      this.myMap.removeOverlay(this.activeLab1);
      this.myMap.removeOverlay(this.activemillInfow); 
    }) 
  },
  created() {
    this.getstaData()
     if (this.$route.params.type == 'update') {
      this.updateData= this.$route.params.updateData
      this.input3=this.updateData.cNo
    }
  },
  methods: {
    //油厂
    statuMark(){
      this.cityMarker1.forEach(iteam=>{
        this.myMap.removeOverlay(iteam);  
      })
      this.OilFacData.forEach(iteam=>{
        let point = new BMap.Point(iteam.lon,iteam.lat);
        let icon=require('../../assets/image/new/ycnromal.png');
        let opts = {
          icon : new BMap.Icon(icon, new BMap.Size(27,30)),// 指定文本标注所在的地理位置
          offset : new BMap.Size(-13,-15)    //设置文本偏移量
        }
        let marker = new BMap.Marker(point, opts);  // 创建文本标注对象
        let conten=`<div style="width:80px;">${iteam.sName}</div>`
        var label = new BMap.Label(conten,{offset:new BMap.Size(-10,24)});
        marker.setLabel(label);
        marker.addEventListener("click",()=>{
          this.showIcl(iteam)
          this.showmillInform(iteam)
        });
        this.cityMarker1.push(marker);
        this.myMap.addOverlay(marker);   
      })
    },
     //显示那个大圆圈
    showIcl(row){
      if(this.activeLab1){
        this.myMap.removeOverlay(this.activeLab1); 
      }
      let point = new BMap.Point(row.lon,row.lat);
      let opts = {
          icon : new BMap.Icon(require('../../assets/image/new/ycclick.png'), new BMap.Size(27,30)),    // 指定文本标注所在的地理位置
          offset : new BMap.Size(-13, -15)    //设置文本偏移量
      }
        let marker = new BMap.Marker(point, opts); 
        this.activeLab1=marker // 创建文本标注对象
        this.myMap.addOverlay(this.activeLab1); 

    },
     //显示油厂的的信息
    showmillInform(row){
       if(this.activemillInfow){
        this.myMap.removeOverlay(this.activemillInfow); 
      }
      let activep1 = {
            position: new BMap.Point(row.lon,row.lat),    // 指定文本标注所在的地理位置
            offset: new BMap.Size(-186, -166)    //设置文本偏移量
      }
      var sContent=`<div id="copysa2" data-clipboard-text='${row.fName},地址:${row.adr}' style="width:400px;height:120px;background:#ffffff;position:relative;box-shadow:0px 0px 12px 0px rgba(51,51,51,0.3);border-radius:4px;z-index:800">
                        <div style="display:flex;width:100%;height:50px;background:#1E292F; justify-content: space-between;align-items: center;box-sizing: border-box;
                        padding:8px 16px;">
                          <img src="${require('../../assets/image/yt1.png')}" width="22" height="22">
                          <span style="font-size:17px;color:#ffffff">${row.fName}</span>
                          <img id="close3" style="cursor: pointer;" src="${require('../../assets/image/close2.png')}" width="16" height="16">
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
    getAllOol(){
      this.$fetchGet("location/getPageOilFac").then(res=>{
        this.OilFacData=this.cloneObj(res.content)
        res.content.forEach((itam,index)=>{
          this.myOilFac.push({value:itam.fName})
        })
        
      })
    },
    //是否显示异常点
    isShow(){
      if(this.checked){
        this.errorMark()
      }else{
        if(this.activeInfow){
          this.myMap.removeOverlay(this.activeInfow); 
        }
        this.clearMark()
      }
    },
    handleCommand(val){
      this.sdName=val
      if(this.timeId){
        clearTimeout(this.timeId)
      }
      if(val=="正常速"){
         this.timeId=setTimeout(()=>{
          this.oneIndex++;
          this.resetMkPoint(this.oneIndex);
        },600);
      }else if(val=="慢速"){
        this.timeId=setTimeout(()=>{
          this.oneIndex++;
          this.resetMkPoint(this.oneIndex);
        },1200);
      }else{
         this.timeId=setTimeout(()=>{
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
      console.log(this.page)
      if(this.valuenum==0){
        this.count=this.errorCount.slice((this.page-1)*15,this.page*15)
      }else{
        this.$fetchGet("getTraceCar/byPeriodWithPage",{
        cNo:this.input3,
        beginTime:this.value1[0],
        endTime:this.value1[1],
        page:this.page,
        pageSize:this.pageSize
        }).then(res=>{
          if(res.content.list.length>0){
          this.normalCount=res.content.list
            if(this.valuenum==1){
              this.count=this.normalCount
              this.total=res.content.total
              console.log(12412)
              console.log(this.count)
            }
            this.normalTotal=res.content.total
          }
        })
      }
    },
    //异常点
    //异常点的点的渲染
    errorMark(){
      this.statusError.forEach(iteam=>{
        let point = new BMap.Point(iteam.lon,iteam.lat);
        let opts = {
            icon : new BMap.Icon(require('../../assets/image/ycd.png'), new BMap.Size(12,12)),    // 指定文本标注所在的地理位置
            offset : new BMap.Size(0,0)    //设置文本偏移量
        }
        let marker = new BMap.Marker(point, opts);  // 创建文本标注对象
        marker.setRotation(iteam.drc)
        marker.addEventListener("click",()=>{
          // this.showInform(iteam,1)
          // statusError
          this.getDeatil(iteam,1,iteam.eDur)
        })
        this.cityMarker.push(marker);
        this.myMap.addOverlay(marker);   
      })

    },
    copyUrl  () {
        var div = document.getElementById('copy');
        if (document.body.createTextRange) {
            var range = document.body.createTextRange();
            range.moveToElementText(div);
            range.select();
        } else if (window.getSelection) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(div);
            selection.removeAllRanges();
            selection.addRange(range);
            /*if(selection.setBaseAndExtent){
                selection.setBaseAndExtent(text, 0, text, 1);
            }*/
        } else {
            console.warn("none");
        }
        document.execCommand("Copy"); // 执行浏览器复制命令
 
        alert("已复制好，可贴粘。");
    },
     //显示异常点的车辆的信息
    showInform(row,type,eDur){
      if(this.activeInfow){
        this.myMap.removeOverlay(this.activeInfow); 
      }
      let activep1 = {
            position: new BMap.Point(row.lon,row.lat),    // 指定文本标注所在的地理位置
            offset: new BMap.Size(-176, -220)    //设置文本偏移量
      }
      var sContent=`<div id="copysa" data-clipboard-text='${row.cNo},停车时长：${eDur}分钟,定位时间：${new Date(row.utc*1000).Format('yyyy-MM-dd hh:mm:ss')},最后定位:${row.adr}' style="width:360px;height:200px;background:#ffffff;position:relative;box-shadow:0px 0px 12px 0px rgba(51,51,51,0.3);border-radius:4px;z-index:800">
                        <div style="display:flex;width:100%;height:50px;background:${type==1?'rgba(151,151,151,1)':'rgba(48,124,252,1)'}; justify-content: space-between;align-items: center;box-sizing: border-box;
                        padding:10px 20px;">
                          <img src="${require('../../assets/image/qc1.png')}" width="32" height="32">
                          <span style="font-size:22px;color:#ffffff">${row.cNo}</span>
                          <img id="close2" style="cursor: pointer;" src="${require('../../assets/image/close2.png')}" width="16" height="16">
                        </div>
                        <div style="width:100%;overflow:hidden;box-sizing:border-box;padding:10px">
                          <div style="display:flex;justify-content:flex-start;font-size:16px;color:#7B7D7F;margin-bottom:6px;display:${type==2?'none':''}">
                            <div style="width:66px">停车时长</div>
                            <div style="margin-left:16px;flex:1">${eDur}分钟</div>
                          </div>
                          
                          <div style="display:flex;justify-content:flex-start;font-size:16px;color:#7B7D7F;margin-bottom:6px;">
                            <div style="width:66px">定位时间</div>
                            <div style="margin-left:16px">${new Date(row.utc*1000).Format('yyyy-MM-dd hh:mm:ss')}</div>
                          </div>
                          <div style="display:flex;justify-content:flex-start;font-size:16px;color:#7B7D7F;display:${row.adr==undefined?'none':''}">
                            <div style="width:66px">最后定位</div>
                            <div style="margin-left:16px;word-break:break-all;flex:1"">${row.adr}</div>
                          </div>
                          
                        </div>
                        <div style="position: absolute;bottom:-12px;left:165px;border-left: 8px solid transparent;border-right: 8px solid transparent;border-top: 12px solid #ffffff;"></div>
                    </div>`
      var infoWindow = new BMap.Label(sContent, activep1);  // 创建信息窗口对象
      infoWindow.setZIndex(900)
      infoWindow.addEventListener("dblclick",()=>{
        var clipboard = new Clipboard('#copysa')
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
      this.activeInfow=infoWindow
      this.myMap.addOverlay(this.activeInfow); 
    },
    //异常点的现实隐藏
    clearMark(){
      if(this.cityMarker){
         this.cityMarker.forEach(iteam=>{
          this.myMap.removeOverlay(iteam);  
        })
      }
      
    },

    //获取数据
    getData(){
      if(this.select=='1'){
        this.loading=true
        this.startDance=0
        this.clearPoline()
        this.$fetchGet("getTraceCar/byPeriodWithPage",{
          cNo:this.input3,
          beginTime:this.value1[0],
          endTime:this.value1[1],
          page:this.page,
          pageSize:this.pageSize
        }).then(res=>{
          if(res.content.list.length>0){
          this.normalCount=res.content.list
            if(this.valuenum==1){
              this.count=this.normalCount
              this.total=res.content.total
            }
            this.normalTotal=res.content.total
            
          }else{

          }
          
        })
        this.$fetchGet("getTraceCar/byPeriod",{
          cNo:this.input3,
          beginTime:this.value1[0],
          endTime:this.value1[1],
          page:0,
          pageSize:0
        }).then(res=>{
          this.loading=false
          if(res.code==1){
            // 异常点
            this.errorCount=res.content.error
            if(this.valuenum==0){
              this.count=this.errorCount.slice(0,15)
              this.total=this.errorCount.length
            }
            this.errorTotal=this.total


            this.ageTime=res.content.alltime
            this.ageSpeed=res.content.avg
            this.allDistance=res.content.distance
            this.statusError=res.content.error
            this.errorMark()
            this.getLine(res.content.data)
            
            this.startTimesa=res.content.data[0].time
            this.endTimesa=res.content.data[res.content.data.length-1].time
          }else{
            if(this.input3!==''){

                this.restaurants1.forEach((iteam,index)=>{
                  if(this.input3==iteam.cNo){
                      if(iteam.net==-1){
                        this.$message.error('车辆未入网');
                      }else{
                        this.$message.error('该时间段内没有可展示的轨迹');
                      }
                  }
                })
              
            }
            this.clearPoline()
          }
          
        })

      }else{
        this.OilFacData.forEach((iteam,index)=>{
          if(this.input3==iteam.fName){
            this.myMap.centerAndZoom(new BMap.Point(iteam.lon,iteam.lat),10);
            this.showIcl(iteam)
            this.showmillInform(iteam)
          }
        })
      }
    },
    istop(){
      if(this.isbf){
        this.isbf=false
        this.start()
      }else{
        this.isbf=true
        this.stop()
      }
    },
    //清除线路和起点终点异常点
    clearPoline(){
      if(this.polylinearr){
          this.polylinearr.forEach(iteam=>{
            this.myMap.removeOverlay(iteam);  
          })
      }
      if(this.timeId){
        clearTimeout(this.timeId)
      }
      this.normalCount=[]
      this.ageTime=0
      this.allDistance=0
      this.ageSpeed=0
      this.total=0
      this.normalTotal=0,
      this.errorTotal=0,
      this.errorCount=[]
      this.count=[]
      this.ptsdata=[]
      if(this.carMk){
        this.myMap.removeOverlay(this.carMk);  
      }//路书的重置
      this.clearMark()
      this.checked=true
      this.oneIndex=0//路书的重置
      this.isbf=true//路书的重置
      if(this.stendMark.length>0){
        this.stendMark.forEach(iteam=>{
          this.myMap.removeOverlay(iteam);  
        })
      }
    },
    initMap() {
      this.myMap = new BMap.Map("mymap2");
      this.myMap.centerAndZoom(new BMap.Point(108.933051,34.546597), 5);
      this.myMap.enableScrollWheelZoom(); //地图缩放的功能
      this.myMap.addControl(
        new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT })
      );
      this.getAllOol()
      this.myMap.setMapStyleV2({     
        styleId: '877fcc51379e35af5063374cd7687818'
      });
    },
    //清除车辆和组织
    clearMark1(){
      this.cityMarker1.forEach(iteam=>{
        this.myMap.removeOverlay(iteam);  
      })
      if(this.activeLab1){
        this.myMap.removeOverlay(this.activeLab1); 
      }
      if(this.activemillInfow){
        this.myMap.removeOverlay(this.activemillInfow); 
      }
    },
    //地图的缩放时间
    getZmap() {
      this.myMap.addEventListener("zoomend", () => {
        this.ZoomNum = this.myMap.getZoom();
        if(this.ZoomNum>8){
          // this.isCar=true
          this.statuMark()
        }else{
          // this.isCar=false
          this.clearMark1()
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
    handleSelect(item) {
    },
    //路书
    getLine(data){
      this.ptsdata1=data
      if(this.polyline){
        this.myMap.removeOverlay(this.polyline); 
      }
      let markdata=[]//起点和终点
      let arrPois =[]
      let arrPois1 =[]
      let lineColor=""
      let drv = new BMap.DrivingRoute()
       for(var i=0;i<data.length-1;i++){
         arrPois1.push(new BMap.Point(data[i].lon,data[i].lat))
          arrPois.splice(0,arrPois.length);//清空数组,如若不清空，会在原来基础上每次在重复的增加一边。这儿是让每两个点画线，否则第二次进来的时候就成四个数据了，第二个重复了一次
          arrPois.push(new BMap.Point(data[i].lon,data[i].lat));
          arrPois.push(new BMap.Point(data[i+1].lon,data[i+1].lat));
          //区间颜色
         if(data[i].spd<26){
            lineColor="#4ACFFF";
          }else if(data[i].spd>25&&data[i].spd<50){
              lineColor="#307CFC";
          }else if(data[i].spd>50&&data[i].spd<75){
              lineColor="#21c434";
          }else if(data[i].spd>75&&data[i].spd<100) {
              lineColor="#FFD201";
          }else{
            lineColor="#BD0301";
          }
          //创建线路
          var polyline = new BMap.Polyline(
              arrPois,//所有的GPS坐标点
              {
                strokeColor : lineColor, //线路颜色
                // strokeOpacity:0.8,
                strokeWeight : 10,//线路大小
              });
          polyline.addEventListener("click",(type)=>{
            let str=type.target.getPath()
            data.forEach(itam=>{
              if(str[0].lng==itam.lon){
                // this.getDeatil(itam)
                this.getDeatil(itam,2)
              }
            })
          })
      //绘制线路
      this.polylinearr.push(polyline)
        this.myMap.addOverlay(polyline);
      }
        let start=new BMap.Point(data[0].lon,data[0].lat);
        let end=new BMap.Point(data[data.length-1].lon,data[data.length-1].lat);
        this.startDancesa=new BMap.Point(data[0].lon,data[0].lat)
        this.endDance=this.myMap.getDistance(end,start)
        markdata.push(start,end)
        this.setStendMark(markdata)
        this.myMap.setViewport(arrPois1);
        this.ptsdata=arrPois1
       
    },
    startlushu(pts){
      this.allIndex = pts.length
      if(this.allIndex==0){
        return
      }else{
        if(this.carMk){
          this.myMap.removeOverlay(this.carMk);  
        }
        var myIcon = new BMap.Icon(require('../../assets/image/xs.png'), new BMap.Size(30,30), {    //小车图片
          //offset: new BMap.Size(0, -5),    //相当于CSS精灵
          imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
          });
        this.carMk  = new BMap.Marker(pts[this.oneIndex],{icon:myIcon});
        this.carMk.addEventListener("click",()=>{
          this.getDeatil(this.ptsdata1[this.oneIndex],2)
        })
        if(this.oneIndex==0){
          this.carMk.setAnimation(BMAP_ANIMATION_DROP);
        }
        this.myMap.addOverlay(this.carMk);
        this.resetMkPoint()
      }
    },
    //点击移动的点的详细信息（
    getDeatil(row,type,eDur){
      this.$fetchGet("getTraceCar/detail",{
        cNo:row.cNo,
        utc:row.utc,
      }).then(res=>{
        this.showInform(res.content,type,eDur)
      })
    },
    resetMkPoint(){
      this.startDance=this.startDance+(this.ptsdata1[this.oneIndex].mil)
      this.carMk.setPosition(this.ptsdata[this.oneIndex]);
      this.carMk.setRotation(this.ptsdata1[this.oneIndex].drc)
      this.startTimesa=this.ptsdata1[this.oneIndex].time
      if(this.oneIndex < this.allIndex){
        this.handleCommand(this.sdName)
      }
      if(this.oneIndex == this.ptsdata.length){
        this.isbf=true
        this.carMk.setPosition(new BMap.Point(this.ptsdata1[this.ptsdata1.length-1].lon,this.ptsdata1[this.ptsdata1.length-1].lat));
      }
    },
    start(){
      this.myMap.setViewport(this.ptsdata)
      // this.isbf=!this.isbf
      if(this.oneIndex == this.ptsdata.length){
        this.oneIndex=0
        this.startDance=0
      }
      this.startlushu(this.ptsdata)

    },
    //路书重置
    refresh(){
      this.oneIndex=0
      this.startDance=0
      this.isbf=false
      this.myMap.setViewport(this.ptsdata)
      this.startlushu(this.ptsdata)
    },
    stop(){
      // this.isbf=!this.isbf
      this.allIndex=this.oneIndex
    },
    //设置起点和终点
    setStendMark(data){
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
        this.page=1
        if(index==1){
          // this.count=this.normalCount
          // console.log("wqwqw")
          // console.log(this.count)
          // this.total=this.normalTotal

          console.log(this.page)
           this.$fetchGet("getTraceCar/byPeriodWithPage",{
            cNo:this.input3,
            beginTime:this.value1[0],
            endTime:this.value1[1],
            page:this.page,
            pageSize:this.pageSize
            }).then(res=>{
              if(res.content.list.length>0){
              this.normalCount=res.content.list
              this.count=this.normalCount
              this.total=res.content.total
                // if(this.valuenum==1){
                //   this.count=this.normalCount
                //   this.total=res.content.total
                //   console.log(12412)
                //   console.log(this.count)
                // }
                this.normalTotal=res.content.total
              }
            })
        }else{
          // this.count=this.errorCount
          this.count=this.errorCount.slice((this.page-1)*15,this.page*15)
          // this.total=this.errorTotal
          this.errorTotal=this.errorCount.length
          this.total=this.errorTotal


        }

        
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
              this.getData()
            }
        }
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

    getstaData(){
      this.$fetchGet("monitor/getAllCNo").then(res=>{
        res.content.forEach((iteam,index)=>{
          iteam.value=iteam.cNo
          this.restaurants1.push(iteam)
        })
        this.restaurants=this.restaurants1
      })
    },

    //点击左侧操作的按钮
    setLeftMark(iteam){
      this.myMap.centerAndZoom(new BMap.Point(iteam.lon,iteam.lat),19);
      if(this.valuenum==0){
        this.checked=true
        this.errorMark()
        this.getDeatil(iteam,1,iteam.eDur)
      }else{
        if(this.leftMark){
          this.myMap.removeOverlay(this.leftMark);
        }
        if(this.activeInfow){
          this.myMap.removeOverlay(this.activeInfow);
        }
          let point = new BMap.Point(iteam.lon,iteam.lat);
          let opts = {
              icon : new BMap.Icon(require('../../assets/image/xs.png'),new BMap.Size(30,30)),    // 指定文本标注所在的地理位置
              offset : new BMap.Size(0,0)    //设置文本偏移量
          }
          this.leftMark = new BMap.Marker(point, opts);  // 创建文本标注对象
          this.leftMark.addEventListener("click",()=>{
           this.getDeatil(iteam,2)
          })
          this.myMap.addOverlay(this.leftMark)
      }
    },



  }
};
</script>
<style lang="scss">
.top-search .el-select .el-input {
    // width: vw(100);
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
    z-index: 23;
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
      // background:#307CFC;
      border-radius:2px;
      cursor: pointer;
      i{
        color:#ffffff;
        font-size:16px;
      }
    }
  }
}
</style>
