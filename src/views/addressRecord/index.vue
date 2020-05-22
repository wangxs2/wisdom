<template>
  <div class="addManage">
      <div class="search-header">
        <el-row :gutter="20">
            <el-col :span="8">
                <div class="grid-content">
                    <span class="header-tit">地址简称</span>
                    <el-select v-model="value" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content">
                    <span class="header-tit">行政区域</span>
                    <el-select v-model="value" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content">
                    <span class="header-tit">地址类型</span>
                    <el-select v-model="value" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:2vh">
            <el-col :span="8">
                <div class="grid-content">
                    <span class="header-tit">地址状态</span>
                    <el-select v-model="value" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content">
                    <span class="header-tit" style="margin-right:1vw">围栏创建状态</span>
                    <el-select v-model="value" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content">
                </div>
            </el-col>
        </el-row>

        <el-row :gutter="20">
           <div class="grid-content grid-content1">
                <el-button type="primary">搜索</el-button>
                <el-button>重置</el-button>
            </div>
        </el-row>
      </div>
      <div class="center-head">
        <el-button type="primary">添加</el-button>
        <el-button>批量导入</el-button>
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
            prop="date"
            align="center"
            label="序号"
            >
            </el-table-column>
            <el-table-column
            prop="name"
            align="center"
            label="地址编码"
            >
            </el-table-column>
            <el-table-column
            prop="name"
            align="center"
            label="地址简称"
            >
            </el-table-column>
            <el-table-column
            prop="name"
            align="center"
            label="行政区域"
            >
            </el-table-column>
            <el-table-column
            prop="name"
            align="center"
            label="地址类型"
            >
            </el-table-column>
            <el-table-column
            prop="name"
            align="center"
            label="地址状态"
            >
            </el-table-column>
            <el-table-column
            prop="name"
            align="center"
            label="围栏创建状态"
            >
            </el-table-column>
             <el-table-column
            prop="name"
            align="center"
            label="触发次数">
            </el-table-column>
            <el-table-column
            prop="name"
            align="center"
            label="操作时间">
            </el-table-column>
            <el-table-column
            prop="name"
            align="center"
            label="操作人">
            </el-table-column>
            <el-table-column align="center" label="位置">
                <template slot-scope="scope">
                    <img src="../../assets/image/dw.png">
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    >编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    删除</el-button>
                </template>
            </el-table-column>
        </el-table>

      </div>
      <div class="page-box">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
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
            options: [{
                value: '选项1',
                label: '黄金糕'
                }, {
                value: '选项2',
                label: '双皮奶'
                }, {
                value: '选项3',
                label: '蚵仔煎'
                }, {
                value: '选项4',
                label: '龙须面'
                }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
             tableData: [{
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
            }, {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
            }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
            }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
            }, {
            date: '2016-05-08',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
            }, {
            date: '2016-05-06',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
            }, {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
            }],
            value: '',
            currentPage4: 4
        }
    },
     methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
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
        height: vh(200);
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
            margin-right:vw(20)
        }
    }
    .center-head{
        text-align:left;
        margin:vh(10);
    }
    .table-box{
        width:100%;
        height: vh(655);
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
