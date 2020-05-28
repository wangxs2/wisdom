<template>
  <div class="login">
    <div class="content-box">
      <div class="left-img">
        <!-- <img style="margin-top:5vh" src="../../assets/image/logo2.png" alt="" srcset=""> -->
        <div class="fon">
          <span>实时监控</span>
          <span style="margin-left:30px">轨迹查询</span>
        </div>
      </div>
      <div class="right-form">
        <h3>运输监控系统</h3>
        <el-form
          :model="ruleForm2"
          :show-message="false"
          :rules="rules2"
          ref="ruleForm2"
          class="ruleSa"
        >
          <div class="message" style="color:red;margin-bottom:5px">&nbsp;{{message}}</div>
          <div class="titfon">账号</div>
          <el-form-item label prop="username" style="position: relative;">
            <el-input type="text" placeholder="账号" v-model="ruleForm2.username">
              <i
                slot="prefix"
                class="iconfont iconsearch"
                style="font-size:18px;margin-left:10px"
              ></i>
            </el-input>
            <span v-if="nameFlag" class="error-message">{{nameMess}}</span>
          </el-form-item>
          <div class="titfon">密码</div>
          <el-form-item label prop="password" style="position: relative;">
            <el-input type="password" placeholder="密码" v-model="ruleForm2.password">
              <i slot="prefix" class="iconfont iconsearch1" style="font-size:18px;margin-left:10px"></i>
            </el-input>
            <span v-if="pswFlag" class="error-message">{{pswMess}}</span>
          </el-form-item>
          <div class="passwordSa">
            <!-- <el-checkbox v-model="checked" style="float:left">自动登录</el-checkbox> -->
            <!-- <span style="float:right;color:#2ba3ff;cursor: pointer" @click="forget">忘记密码？</span> -->
            <div style="clear:both"></div>
          </div>
          <div class="bigquan"></div>
          <el-form-item style="margin-top:44px">
            <el-button
              style="width:16.8vw;height:44px;background:#395BB2;color:#ffffff"
              :loading="loading"
              @click="submitForm()"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import base64 from "@/libs/base.js";
export default {
  components: {},
  data(){
      let check = (rule, value, callback) => {
      if (value === "") {
        if (rule.field == "username") {
          this.nameFlag = true;
          this.nameMess = "请输入账号";
        } else {
          this.pswFlag = true;
          this.pswMess = "请输入密码";
        }
        return callback(new Error());
      } else {
        if (rule.field == "username") {
          this.nameFlag = false;
          this.nameMess = "";
        } else {
          this.pswFlag = false;
          this.pswMess = "";
        }
        callback();
      }
    };
      return{
        ruleForm2: {
            username: "",
            password: ""
        },
        message: "",
        nameMess: "",
        nameFlag: false,
        pswMess: "",
        pswFlag: false,
        loading: false,
        checked: true,
        rules2: {
            username: [
            {
                required: true,
                trigger: "blur",
                validator: check
            }
            ],
            password: [
            {
                required: true,
                trigger: "blur",
                validator: check
            }
            ]
        }
      }
  },
  mounted(){
    document.onkeydown = event => {
      if (event.keyCode === 13) {
        this.submitForm();
      }
    };

  },
  methods:{
      submitForm(){
        // let b = new base64();
        let Basesa = require('js-base64').Base64;
        this.$refs.ruleForm2.validate(valid => {
          if (valid) {
            let data={
              username:this.ruleForm2.username,
              password:this.ruleForm2.password
              // password:Basesa.encode(this.ruleForm2.password)
            }
            this.$fetchPost("login", data).then(res=>{
              console.log(res.slice(6,7))
                console.log(res.code)
                if(res.slice(6,7)==1){
                  this.$router.push("/realTimeMonitoring")
                }else{
                   this.$message({
                      message: "用户名或密码错误",
                      type: "warning"
                    });
                }
            })
          }else{
            this.$message({
                message: "完善信息",
                type: "warning"
              });
          }
        })
      },
      forget(){

      },
  }
};
</script>
<style lang="scss">
.ruleSa .el-input--prefix .el-input__inner {
  height: vw(44);
  line-height: vw(44);
  padding-left: 50px;
}
</style>
<style lang="scss" scoped>
$colorSa: #2ba3ff;
.login {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url("../../assets/image/bj@2x.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .content-box {
    width: vw(1032);
    height: vw(600);
    display: flex;
    .left-img {
      width: 50%;
      height: 100%;
      background: url("../../assets/image/image@2x.png") no-repeat;
      background-size: 100% 100%;
      color: #ffffff;
      font-size: vw(26);
      position: relative;
      .fon {
        position: absolute;
        left: vw(138);
        bottom: vw(84);
      }
    }

    .right-form {
      width: 50%;
      height: 100%;
      background: #ffffff;

      .ruleSa {
        padding: 0 vw(97);
        margin-top: vw(46);
        .error-message {
          font-size: 14px;
          line-height: 14px;
          color: #f56c6c;
          position: absolute;
          top: vw(15);
          right: vw(10);
          z-index: 50;
        }
      }
      h3 {
        font-size: vw(36);
        margin: 0;
        padding: 0;
        margin-top: vw(96);
        color: #333333;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          margin-right:vw(14);
        }
      }
      .titfon{
          color:#999999;
          font-size:vw(16);
          text-align:left;
          margin-bottom:vw(12);
          margin-top:vw(19);
      }
      .el-form-item {
        width: vw(320);
        margin-bottom: vw(10);
      }
      .iconsearch {
        display: inline-block;
        width: vw(18);
        height: vw(18);
        margin-left: vw(14);
        margin-top: vw(12);
        background: url("../../assets/image/icon_zh@2x.png")  no-repeat;
       background-size: 100% 100%;
      }
      .iconsearch1 {
        display: inline-block;
        width: vw(18);
        height: vw(18);
        margin-left: vw(14);
        margin-top: vw(12);
        background: url("../../assets/image/icon_mm@2x.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
