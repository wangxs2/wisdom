<template>
  <div class="map-content">
    <div class="timeCar" id="mymap">
      
    </div>
  </div>
</template>

<script>
export default {
  name: 'appMain',
  data () {
      return{
        myMap:null,
      }
  },
  mounted () {
    this.initMap()
  },
  created () {
    
  },
  methods: {
    initMap(){
      this.myMap = new BMap.Map("mymap");
      this.myMap.centerAndZoom(new BMap.Point(121.571035,31.236302), 11);
      this.myMap.enableScrollWheelZoom()//地图缩放的功能
      
    }
  }
}
</script>
<style lang="scss" scoped>
.map-content{
  width: 100%;
  height: 100%;
  box-sizing:border-box;
  padding:12px;
  .timeCar{
    width: 100%;
    height: 100%;
  }
}

</style>
