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
        <el-button type="primary" @click="add()">添加</el-button>
        <el-button @click="dialogVisible1=true">批量导入</el-button>
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
            <el-table-column width="160" align="center" label="操作">
                <template slot-scope="scope">
                    <span style="color:#317AF8;cursor:pointer">查看详情</span>
                    <span style="color:#317AF8;margin-left:0.5vw;cursor:pointer" @click='updute()'>修改</span>
                    <span style="color:#317AF8 ;margin-left:0.5vw;cursor:pointer">禁用</span>
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

      <!-- 添加和修改的弹窗 -->
       <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="dialogFormVisible">
            <el-form  size="small" :rules="rules" :model="form">
                <el-row>
                    <el-col>
                        <div>
                            <el-form-item label="地址全称" label-width="100px" prop="fullName">
                                <el-input v-model="form.fullName"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <div>
                            <el-form-item label="地址状态" label-width="100px" prop="status">
                                <el-select style="width:100%" v-model="form.status" placeholder="请选择">
                                  <el-option label="启用" value="1"></el-option>
                                  <el-option label="不启用" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <div>
                            <el-form-item label="地址简称" label-width="100px" prop="shortName">
                                <el-input  v-model="form.shortName"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <div>
                            <el-form-item label="行政区域" label-width="100px">
                                <el-input  v-model="quyu" :disabled="true" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <div>
                            <el-form-item label="地址编码" label-width="100px">
                                <el-input  v-model="bianma" :disabled="true" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <div>
                            <el-form-item label="所属城市" label-width="100px" prop="province">
                                <el-select style="margin-right:10px" filterable v-model="form.province" @change="changecity(1)" placeholder="请选择">
                                    <el-option
                                    v-for="(item,i) in myAllProince"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.name">
                                    </el-option>
                                </el-select>
                                <el-select style="margin-right:10px" filterable v-model="form.city" @change="changecity(2)" placeholder="请选择">
                                    <el-option
                                    v-for="item in myAllcity"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.name">
                                    </el-option>
                                </el-select>
                                <el-select v-model="form.country" filterable placeholder="请选择">
                                    <el-option
                                    v-for="item in myAllarez"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                 <el-row>
                    <el-col>
                        <div>
                            <el-form-item label="地址类型" label-width="100px" prop="type">
                                <el-select style="width:100%" v-model="form.type" placeholder="请选择">
                                  <el-option label="油厂" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <div>
                            <el-form-item label="详细地址" label-width="100px" prop="adr">
                                <el-input  type="textarea" :rows="4" v-model="form.adr" maxlength="120" ></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sunmitAll">确 定</el-button>
            </div>
        </el-dialog>
      <!-- 添加和修改的弹窗 -->

      <!-- 导入的弹窗 -->
      <el-dialog
        title="地址导入"
        align="left"
        :visible.sync="dialogVisible1"
        width="30%">
        <el-upload
        class="upload-demo"
        ref="upload"
        accept=".xlsx"
        action="/lhana/location/importLocation"
        :on-success="successFile"
        :on-error="errorFile"
        :auto-upload="false"
        :file-list="fileList">
        <el-button size="small" icon="el-icon-plus" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">支持xlsx格式，文件打下不超过2M</div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
            <span style="color:rgba(48, 124, 252, 1);margin-right:20px">下载模版</span>
            <el-button type="primary" @click="submitUpload">确认上传</el-button>
        </span>
        </el-dialog>
            
    
  </div>
</template>

<script>
// @ is an alias to /src
import cityData from './city_code.json';
export default {
    components: {
    },
    data(){
        return{
            options: [],
            title:"添加地址",
            dialogFormVisible:false,
            dialogVisible1:false,//导入的弹窗
            form:{
                fullName:'',
                shortName:'',
                status:'1',
                province:'',
                city:'',
                country:'',
                adr:'',
                type:'1',
            },
            quyu:'',
            bianma:'',
            tableData: [],
            city:0,
            area:0,
            myAllcity:[],
            myAllProince:[],
            myAllarez:[],
            rules: {
                fullName: [
                    { required: true, message: '请输入地址全称', trigger: 'blur' },
                ],
                shortName: [
                    { required: true, message: '请输入地址简称', trigger: 'blur' },
                ],
                adr: [
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'change' },
                ],
                type: [
                    { required: true, message: '请输入选择类型', trigger: 'change' },
                ],
            },
            value: '',
            currentPage4: 4,
            fileList:[],
        }
    },
    created(){
        this.myAllProince=cityData
    },
    methods: {
        handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        },
        successFile(val){
           if(val.code==1){
            this.$message({
            message: '上传成功！',
            type: 'success'
            });
           }
        },
        errorFile(){
            if(val.code==0){
               this.$message.error('上传失败！');
           }
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        changecity(type){
            console.log(this.form.province)
            if(type==1){
                this.form.city=''
                this.form.country=''
                this.city = this.myAllProince.findIndex((value, index) => {
                   return  value.name==this.form.province
                }) 
                this.myAllcity=this.myAllProince[this.city].city
            }else{
                this.form.country=''
                this.area = this.myAllcity.findIndex((value, index) => {
                   return  value.name==this.form.city
                })
                this.myAllarez=this.myAllcity[this.area].area
            }
        },
        //保存或者修改
        sunmitAll(){

        },
        updute(){
            this.title="添加地址"
            this.dialogFormVisible=true
        },
        add(){
            this.title="修改地址"
            this.dialogFormVisible=true
        },
        
    },
}
</script>
<style>
.addManage .el-form-item__content{
    text-align:left;
}
</style>
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
