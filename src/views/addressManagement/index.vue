<template>
  <div class="addManage">
      <div class="search-header">
        <el-row :gutter="20">
            <el-col :span="8">
                <div class="grid-content">
                    <span class="header-tit">地址简称</span>
                    <el-select filterable clearable v-model="query.shortName" placeholder="请选择">
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
                        <el-option label="全部" value=""></el-option>
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
                    <span class="header-tit">地址类型</span>
                    <el-select v-model="query.type" placeholder="请选择">
                        <el-option label="全部" value="全部"></el-option>
                       <el-option label="油厂" value="油厂"></el-option>
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
                    <span class="header-tit" style="margin-right:1vw">围栏创建状态</span>
                    <el-select v-model="query.fStatus" placeholder="请选择">
                        <el-option label="全部" :value="2"></el-option>
                        <el-option label="启用" :value="1"></el-option>
                        <el-option label="禁用" :value="0"></el-option>
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
                <el-button type="primary" @click="getAlldata()">搜索</el-button>
                <el-button @click="resetAll">重置</el-button>
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
            type="index"
            width="60"
            align="center"
            label="序号"
            >
            </el-table-column>
            <el-table-column
            prop="oId"
            align="center"
            label="地址编码"
            >
            </el-table-column>
            <el-table-column
            prop="sName"
            align="center"
            label="地址简称"
            >
            </el-table-column>
            <el-table-column
            prop="division"
            width="80"
            align="center"
            label="行政区域"
            >
            </el-table-column>
            <el-table-column
            prop="name"
            width="80"
            align="center"
            label="地址类型"
            >
            <template slot-scope="scope">
                <div>{{scope.row.type==1?'油厂':""}}</div>
            </template>
            </el-table-column>
            <el-table-column
            prop="name"
            width="80"
            align="center"
            label="地址状态"
            >
            <template slot-scope="scope">
                <div :style="{color:scope.row.status==1?'#317AF8':'#DE2E2D'}">{{scope.row.status==1?'启用':"禁用"}}</div>
            </template>
            </el-table-column>
            <el-table-column
            prop="name"
            width="110"
            align="center"
            label="围栏创建状态"
            >
            <template slot-scope="scope">
                <div :style="{color:scope.row.status==1?'#317AF8':'#DE2E2D'}">{{scope.row.status==1?'成功':"失败"}}</div>
            </template>
            </el-table-column>
             <el-table-column
            prop="firNum"
            align="center"
            label="触发次数">
             <template slot-scope="scope">
                    <div style="cursor: pointer;" @click="addrestwo(scope.row)">{{scope.row.firNum}}</div>
                </template>
            </el-table-column>
            
            <el-table-column
            prop="uTime"
            align="center"
            label="操作时间">
            </el-table-column>
            <el-table-column
            prop="uBy"
            align="center"
            label="操作人">
            </el-table-column>
            <el-table-column width="60" align="center" label="位置">
                <template slot-scope="scope">
                    <img style="cursor: pointer;" @click="weiradiu(scope.row)" src="../../assets/image/dw.png">
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="操作">
                <template slot-scope="scope">
                    <span style="color:#317AF8;cursor:pointer" @click="dialogVisible2=true,detailObj=scope.row">查看详情</span>
                    <span style="color:#317AF8;margin-left:0.5vw;cursor:pointer" @click='updute(scope.row)'>修改</span>
                    <span @click="disableCir(scope.row)" :style="{'color':scope.row.status==1?'#317AF8':'#DE2E2D','margin-left':'0.5vw','cursor':'pointer'}">{{scope.row.status==1?'禁用':"启用"}}</span>
                </template>
            </el-table-column>
        </el-table>

      </div>
      <div class="page-box">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[10, 30, 100]"
            :page-size="query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
      </div>

      <!-- 添加和修改的弹窗 -->
       <el-dialog :title="title" @close="emptyForm" :close-on-click-modal="false" :visible.sync="dialogFormVisible">
            <el-form  size="small" :rules="rules" ref="addform" :model="form">
                <el-row>
                    <el-col>
                        <div>
                            <el-form-item label="地址全称" label-width="100px" :prop="title=='添加地址'?'fullName':'fullName1'">
                                <el-input :disabled="isdisplay" maxlength="30" v-model="form.fullName"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
               
                <el-row>
                    <el-col>
                        <div>
                            <el-form-item label="地址简称" label-width="100px" :prop="title=='添加地址'?'shortName':'shortName1'">
                                <el-input  :disabled="isdisplay" maxlength="10" v-model="form.shortName"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
               
                <el-row>
                    <el-col>
                        <div>
                            <el-form-item label="地址状态" label-width="100px" prop="status">
                                <el-select style="width:100%" v-model="form.status" placeholder="请选择">
                                  <el-option label="启用" :value="1"></el-option>
                                  <el-option label="禁用" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <div>
                            
                            <el-form-item style="position:relative;" label="行政区域"  label-width="100px">
                                <span style="color:#F56C6C;position:absolute;left:-77px;top:1px">*</span>
                                <el-input  v-model="form.division" :disabled="true" placeholder="自动生成" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <div>
                            <el-form-item style="position:relative;" label="地址编码"  label-width="100px">
                                <span style="color:#F56C6C;position:absolute;left:-77px;top:1px">*</span>
                                <el-input  v-model="form.oId" :disabled="true" placeholder="自动生成" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <div>
                            <el-form-item style="position:relative;" label="所属城市" label-width="100px" prop="province">
                                <span style="color:#F56C6C;position:absolute;left:-77px;top:1px">*</span>
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
                                <el-select :disabled="isdisplay" style="width:100%" v-model="form.type" placeholder="请选择">
                                  <el-option label="油厂" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <div>
                            <el-form-item label="详细地址" label-width="100px" prop="adr">
                                <el-input  type="textarea" :rows="4" v-model="form.adr" show-word-limit maxlength="120" ></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">关 闭</el-button>
                <el-button type="primary" :loading="isbtn" @click="sunmitAll('addform')">保 存</el-button>
            </div>
        </el-dialog>
      <!-- 添加和修改的弹窗 -->

      <!-- 导入的弹窗 -->
    <el-dialog
        title="地址导入"
        align="left"
        @close="emptyForm1"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible1"
        width="30%">
        <el-upload
        class="upload-demo"
        ref="upload"
        :data="{'type':type}"
        accept=".xlsx"
        action="/lhana/location/importLocation"
        :on-success="successFile"
        :on-change="handleChangePic"
        :on-error="errorFile"
        :auto-upload="false"
        :file-list="fileList">
        <el-button size="small" icon="el-icon-plus" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">支持xlsx格式，文件大小不超过2M</div>
        </el-upload>
        <div style="color:#DD2726">{{errorMessage}}</div>
        <div style="margin-top:32px">
            <span style="margin-right:70px"> 重复数据</span>
             <el-radio v-model="type" label="1">跳过</el-radio>
             <el-radio v-model="type" label="0">覆盖</el-radio>
        </div>
        <div style="color:#909399;margin-top:6px;margin-left:-4px">“地址简称”作为重复数据识别字段</div>
        <span slot="footer" class="dialog-footer">
            <span style="color:rgba(48, 124, 252, 1);margin-right:20px;cursor: pointer;" @click="downloadModel()">下载模版</span>
            <el-button type="primary" @click="submitUpload">确认上传</el-button>
        </span>
    </el-dialog>


    <!-- 地址详细信息 -->

    <el-dialog
        title="地址详情"
        align="left"
        :close-on-click-modal="false"
        custom-class="address-box"
        :visible.sync="dialogVisible2">
        <div>
            <div style="font-size:18px;color:#303133;margin-bottom:10px">基本信息</div>
            <div class="top-box">
                <div class="iteam-top">
                     <div class="list-iteam">
                        <div class="tit">地址全称</div>
                        <div>{{detailObj.fName}}</div>
                    </div>
                    <div class="list-iteam">
                        <div class="tit">地址简称</div>
                        <div>{{detailObj.sName}}</div>
                    </div>
                    <div class="list-iteam">
                        <div class="tit">地址类型</div>
                        <div>{{detailObj.type==1?'油厂':""}}</div>
                    </div>
                    <div class="list-iteam">
                        <div class="tit">行政区域</div>
                        <div>{{detailObj.division}}</div>
                    </div>
                    
                </div>
                <div class="iteam-top">
                    <div class="list-iteam">
                        <div class="tit">地址编码</div>
                        <div>{{detailObj.oId}}</div>
                    </div>
                    <div class="list-iteam">
                        <div class="tit">地址状态</div>
                        <div>{{detailObj.status==1?'启用':"禁用"}}</div>
                    </div>
                    <div class="list-iteam">
                        <div class="tit">所属城市</div>
                        <div>{{detailObj.province}}{{detailObj.city==undefined?'':detailObj.city}}{{detailObj.country==undefined?'':detailObj.country}}</div>
                    </div>
                    <div class="list-iteam">
                        <div class="tit">详细地址</div>
                        <div>{{detailObj.adr}}</div>
                    </div>

                </div>
            </div>
            <div style="font-size:18px;color:#303133;margin-bottom:10px;margin-top:50px;">围栏信息</div>
            <div class="top-box">
                <div class="iteam-top">
                    <div class="list-iteam">
                        <div class="tit">围栏经度</div>
                        <div>{{detailObj.lon}}</div>
                    </div>
                    <div class="list-iteam">
                        <div class="tit">围栏维度</div>
                        <div>{{detailObj.lat}}</div>
                    </div>
                    <div class="list-iteam">
                        <div class="tit">围栏形状</div>
                        <div>{{detailObj.shape==1?'圆形':"未知"}}</div>
                    </div>
                </div>
                <div class="iteam-top">
                    <div class="list-iteam">
                        <div class="tit">围栏半径</div>
                        <div>{{detailObj.radius}}千米</div>
                    </div>
                    <div class="list-iteam">
                        <div class="tit">围栏创建时间</div>
                        <div>{{detailObj.uTime}}</div>
                    </div>
                    <div class="list-iteam">
                        <div class="tit">围栏创建状态</div>
                        <div>{{detailObj.status==1?'成功':"失败"}}</div>
                    </div>
                    

                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible2=false">关 闭</el-button>
        </div>

       
    </el-dialog>
    <!-- 地址详细信息 -->
            
    
  </div>
</template>

<script>
import { _debounce } from "@/libs/public.js";
// @ is an alias to /src
import cityData from './city_code.json';
export default {
    components: {
    },
   
    data(){
        var validateInputNumber=(rlue,value,callback)=>{
                let index = this.restaurants.findIndex((itam, index) => {
                  return  itam.fName==value
                })
                if(index!==-1){
                    callback (new Error("该地址全称已经存在"))
                }else{
                    callback();
                }
               
        };
        var validateInput = (rule, value, callback) => {
            if (!this.checkSpecialKey(value)) {
                    callback(new Error("不能含有特殊字符！！"));
                }else{
                    callback();
                }
        };
        var validateInputNumber1=(rlue,value,callback)=>{
             let index = this.restaurants.findIndex((itam, index) => {
                   return  itam.sName==value
            })
            if(index!==-1){
                callback (new Error("该地址简称已经存在"))
            }else{
                    callback();
                }
           
        };
        return{
            options: [],
            type:'1',//跳过
            total:null,
            isbtn:false,
            isdisplay:false,
            errorMessage:"",
            restaurants: [],//油厂
            title:"添加地址",
            dialogFormVisible:false,
            dialogVisible1:false,//导入的弹窗
            dialogVisible2:false,//详情的弹框
            form:{
                fullName:'',
                shortName:'',
                status:1,
                province:'',
                city:'',
                country:'',
                adr:'',
                oId:'',
                division:"",
                type:1,
            },
            query:{
                type:"全部",
                shortName:'',
                status:2,
                division:"",
                fStatus:2,
                page:1,
                pageSize:10,
            },//请求头的信息
            quyu:'',
            detailObj:{},
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
                    { validator: validateInputNumber, trigger: 'blur'},
                    {
                        validator: validateInput, trigger: 'blur'
                    }
                ],
                shortName: [
                    { required: true, message: '请输入地址简称', trigger: 'blur' },
                    { validator: validateInputNumber1, trigger: 'blur'},
                     {
                        validator: validateInput, trigger: 'blur'
                    }
                ],
                // fullName1: [
                //     { required: true, message: '请输入地址全称', trigger: 'blur' },
                // ],
                // shortName1: [
                //     { required: true, message: '请输入地址简称', trigger: 'blur' },
                // ],
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
        this.getOther()
        this.getAlldata()
    },
    methods: {
            //围栏
        weiradiu(row){
            this.$router.push({
                name: 'realTimeMonitoring',
                params: {
                type: 'radius',
                data: row
                }
            });
        },
            //围栏
        addrestwo(row){
            this.$router.push({
                name: 'addressRecord',
                params: {
                type: 'addrestwo',
                data: row
                }
            });
        },
        handleSizeChange(val) {
            this.query.pageSize=val
            this.getAlldata()
        },
        handleCurrentChange(val) {
            this.query.page=val
            this.getAlldata()
        },
        handleChangePic(file,fileList){
            if (fileList.length > 1) {
                fileList.splice(0, 1);
            }
        },
        checkSpecialKey(str) {
            var specialKey = "[`~!#$^&*=|{}':;'\\[\\].<>/?~！#￥……&*——|{}【】‘；：”“'。，、？]‘'";
            for (var i = 0; i < str.length; i++) {
                if (specialKey.indexOf(str.substr(i, 1)) != -1) {
                return false;
                }
            }
            return true;
        },

        successFile(val){

           if(val.code==1){
            this.$message({
                message: '上传成功！',
                type: 'success'
            });
            this.errorMessage=""
           }else{
               this.errorMessage=val.content
               this.$message.error('上传失败！');
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
        sunmitAll(addform) {
            //提交表单
           
            this.$refs.addform.validate(valid => {
                console.log(this.title)
                if (valid) {
                    this.isbtn=true
                    console.log(this.title)
                    let formData = this.cloneObj(this.form);
                    if (this.title=="添加地址") {
                         console.log(this.title)
                        this.$fetchPost("location/addLocation",formData,'json').then(res => {
                            this.isbtn=false
                        if (res.code == 1) {
                            this.$message({
                            message: '添加成功',
                            type: 'success'
                            });
                            this.dialogFormVisible = false;
                            this.getAlldata()
                        } else {
                            this.Gerror(res.message);
                        }
                        });
                    } else if (this.title=="修改地址") {
                        this.$fetchPost("location/addLocation",formData,'json').then(res => {
                            this.isbtn=false
                            if (res.code == 1) {
                                this.$message({
                                message: '修改成功',
                                type: 'success'
                                });
                                this.dialogFormVisible = false;
                                this.getAlldata()
                            } else {
                                // this.Gerror(res.message);
                                this.$message.error(res.message);
                            }
                        });
                    }
                }else{
                    this.$message({
                        message: '请完善信息',
                        type: 'warning'
                    });
                }
            });

        },
        //下载模板
        downloadModel(){
            window.open("/lhana/location/downloadMouldFile ");
            // window.location.href =require("../../assets/地址导入模板.xlsx")
        },
        disableCir(row){
            let str=row.status==1?'确认禁用？':'确认启用？'
            this.$confirm(str, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$fetchGet("location/updateOilStatus",{
                    oId:row.oId,
                    status:row.status==1?0:1,
                }).then(res => {
                if (res.code == 1) {
                    this.$message({
                    message: '操作成功！',
                    type: 'success'
                    });
                    this.getAlldata()
                } else {
                    this.$message.error('操作失败！');
                }
                });
            });

        },
        emptyForm() {
        //清空表单和验证
        this.form = {
                fullName:'',
                shortName:'',
                status:1,
                province:'',
                city:'',
                country:'',
                adr:'',
                oId:'',
                division:"",
                type:1,
            };
            this.$refs.addform.resetFields();
             this.isdisplay=false
             this.isbtn=false
            this.$refs.addform.clearValidate();
        },
        emptyForm1(){
            this.fileList=[]
            this.errorMessage=""
        },
        updute(row){
            this.title="修改地址"
            this.isdisplay=true
            this.form.fullName=row.fName
            this.form.shortName=row.sName
            this.form.type=Number(row.type)
            this.form.status=Number(row.status)
            this.form.adr=row.adr
            this.form.oId=row.oId
            this.form.division=row.division
            this.form.province=row.province
            if(row.city){
                 let city = this.myAllProince.findIndex((value, index) => {
                   return  value.name==row.province
                }) 
                if(this.myAllProince[city]){
                    this.myAllcity=this.myAllProince[city].city
                    this.form.city=row.city
                }
                
            }else{
                
            }
            if(row.country){
                let area = this.myAllcity.findIndex((value, index) => {
                   return  value.name==row.city
                })
                if(this.myAllcity[area]){
                    this.myAllarez=this.myAllcity[area].area
                    this.form.country=row.country
                }
              
            }else{
                
            }
            this.dialogFormVisible=true
        },
        add(){
            this.title="添加地址"
            this.dialogFormVisible=true
        },
        getOther(){
            this.$fetchGet("location/getPageOilFac").then(res=>{
                this.restaurants=this.cloneObj(res.content)
            })

        },
          //重置
        resetAll(){
            this.query={
               type:"全部",
                shortName:'',
                status:2,
                division:"",
                fStatus:2,
                page:1,
                pageSize:20,
            }
            this.getAlldata()

        },
        getAlldata(){

            this.$fetchGet("location/searchLocation",this.query).then(res=>{
                if(res.code==1){
                    this.tableData=res.content.list
                    this.total=res.content.total
                }else{
                    this.tableData=[]
                    this.total=0
                }
                
            })

        },
        
    },
}
</script>
<style lang="scss">
.addManage .el-form-item__content{
    text-align:left;
}
.address-box{
    .top-box{
        display: flex;
        justify-content: flex-start;
        .iteam-top{
            flex: 1;
            display: flex;
            flex-direction: column;
            
            .list-iteam{
                display: flex;
                justify-content: flex-start;
                margin: 10px 0;
                font-size: 16px;
            .tit{
                width:100px;
                text-align: right;
                margin-right:16px;
            }
            }
        }

    }

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
