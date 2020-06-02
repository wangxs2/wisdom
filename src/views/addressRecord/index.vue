<template>
  <div class="addManage">
      <div class="search-header">
        <el-row :gutter="20">
            <el-col :span="8">
                <div class="grid-content">
                    <span class="header-tit">地址简称</span>
                    <el-select v-model="query.sName" placeholder="请选择">
                        <el-option
                            v-for="(item,index) in restaurants"
                            :key="index"
                            :label="item.sName"
                            :value="item.sName">
                            </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content">
                    <span class="header-tit">行政区域</span>
                    <el-select clearable  v-model="query.division" placeholder="请选择">
                        <el-option label="东北" value="东北"></el-option>
                        <el-option label="华东" value="华东"></el-option>
                        <el-option label="华中" value="华中"></el-option>
                        <el-option label="华北" value="华北"></el-option>
                        <el-option label="华南" value="华南"></el-option>
                        <el-option label="西北" value="西北"></el-option>
                        <el-option label="西南" value="西南"></el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content">
                    <span class="header-tit">触发类型</span>
                    <el-select v-model="query.type" placeholder="请选择">
                        <el-option label="全部" :value="2"></el-option>
                        <el-option label="离开" :value="0"></el-option>
                        <el-option label="进入" :value="1"></el-option>
                    </el-select>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:2vh">
            <el-col :span="8">
                <div class="grid-content">
                    <span class="header-tit">地址状态</span>
                     <el-select v-model="query.status" placeholder="请选择">
                        <el-option label="全部" :value="2"></el-option>
                       <el-option label="启用" :value="1"></el-option>
                       <el-option label="禁用" :value="0"></el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content">
                    <span class="header-tit">开始时间</span>
                    <el-date-picker
                        v-model="query.bUtc"
                        type="datetime"
                        value-format="yyyy-mm-dd hh:mm:ss"
                        placeholder="选择日期时间">
                        </el-date-picker>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content">
                    <span class="header-tit">结束时间</span>
                     <el-date-picker
                        value-format=""
                        v-model="query.eUtc"
                        type="datetime"
                        placeholder="选择日期时间">
                        </el-date-picker>
                </div>
            </el-col>
        </el-row>
         <el-row :gutter="20" style="margin-top:2vh">
           <el-col :span="8">
                <div class="grid-content">
                    <span class="header-tit" style="margin-right:3.4vw">车牌号</span>
                    <el-select v-model="query.cNo" filterable placeholder="请选择">
                       <el-option
                        v-for="(item,index) in myAllCp"
                        :key="index"
                        :label="item.cNo"
                        :value="item.cNo">
                        </el-option>
                    </el-select>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
           <div class="grid-content grid-content1">
                <el-button @click="getAlldata()" type="primary">搜索</el-button>
                <el-button @click="resetAll">重置</el-button>
            </div>
        </el-row>
      </div>
      <div class="table-box">
        <div class="table-tit" style="color:#303133">地址列表</div>
         <el-table
            :data="tableData"
            :header-cell-style="{background:'#F4F8FD',color:'#606266'}"
            height="92%"
            border
            style="width: 100%">
            <el-table-column
            type="index"
            align="center"
            label="序号"
            >
            </el-table-column>
            <el-table-column
            prop="cNo"
            align="center"
            label="车牌号"
            >
            </el-table-column>
            <el-table-column
            prop="sNam"
            align="center"
            label="地址简称"
            >
            <template slot-scope="scope">
                <div style="color:#307CFC">{{scope.row.sNam}}</div>
            </template>
            </el-table-column>
            <el-table-column
            prop="division"
            align="center"
            label="行政区域"
            >
            </el-table-column>
            <el-table-column
            prop="name"
            align="center"
            label="触发类型"
            >
            </el-table-column>
            <el-table-column
            prop="utc"
            align="center"
            label="触发时间"
            >
            </el-table-column>
            <el-table-column
            prop="source"
            align="center"
            label="触发数据源"
            >
            </el-table-column>
             <el-table-column
            prop="name"
            align="center"
            label="触发位置1">
            </el-table-column>
            <el-table-column
            prop="name"
            align="center"
            label="触发位置2">
            </el-table-column>
        </el-table>

      </div>
      <div class="page-box">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
      </div>
    
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  components: {
  },
  data(){
        return{
            options: [],
            total:null,
            tableData: [],
            restaurants: [],
            myAllCp: [],
            value: '',
            currentPage4: 4,
            query:{
                page:1,
                pageSize:15,
                type:2,
                status:2,
                sName:"",
                bUtc:"",
                source:"",
                eUtc:"",
                division:"",
            }
        }
    },
     created(){
         this.getAll()
        this.getAlldata()
    },
     methods: {
       handleSizeChange(val) {
            this.query.pageSize=val
            this.getAlldata()
        },
        handleCurrentChange(val) {
            this.query.page=val
            this.getAlldata()
        },
        getAll(){
            this.$fetchGet("monitor/getAllCNo").then(res=>{
                this.myAllCp=this.cloneObj(res.content)
            })
            this.$fetchGet("location/getPageOilFac").then(res=>{
                this.restaurants=this.cloneObj(res.content)
            })

        },
        //重置
        resetAll(){
            this.query={
                page:1,
                pageSize:15,
                type:0,
                status:2,
                sName:"",
                bUtc:"",
                source:"",
                eUtc:"",
                division:"",
            }
            this.getAlldata()

        },
      getAlldata(){
            this.$fetchPost("fence/getFenceRec",this.query,'json').then(res=>{
                if(res.code==1){
                    this.tableData=res.content.list
                    this.total=res.content.total
                }
                
            })

        },
    },
}
</script>
<style lang="scss" scoped>
.addManage{
    width: 100%;
    height: 100%;
    background: #F1F8FD;
    box-sizing: border-box;
    padding: vw(20);
    .search-header{
         box-sizing: border-box;
         padding: vw(20);
        width: 100%;
        height: vh(240);
        background: #ffffff;
        // border: 1px solid red;
        border-radius:4px;
        box-shadow:1px 1px 4px 0px rgba(213,213,213,1);
        .grid-content{
            text-align:left;
            .header-tit{
                margin-right:vw(50);
            }
        }
        .grid-content1{
            text-align:right;
            margin-right:vw(20);
            margin-top:vw(-20)
        }
    }
    .center-head{
        text-align:left;
        margin:vh(10);
    }
    .table-box{
        width:100%;
        height: vh(654);
        margin-top:vh(20);
        background: #ffffff;
        box-shadow:1px 1px 4px 0px rgba(213,213,213,1);
         box-sizing: border-box;
         padding: vw(20);
        .table-tit{
            font-size:vw(22);
            text-align:left;
            margin-bottom:vh(20);
        }
    }
    .page-box{
        text-align:right;
        margin-top:vh(20);
    }
}
</style>
