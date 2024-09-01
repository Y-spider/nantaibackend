<!-- 登录页面 -->
<template>
    <div class="view">
      <div class="login-form-box">
            <h1>南泰微校园</h1>
          <!-- 登录表单 -->
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="loginFrom">
                <el-form-item label="账号" prop="account">
                    <el-input  class="el-input" type="text" v-model="ruleForm.account" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input class="el-input" type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="verificationCode" class="el-form-item-code">
                   <div style="width: 100%; height: 100%; display: flex; justify-content: space-between; align-items: center;">
                        <el-input class="el-input" type="digital" v-model.number="ruleForm.verificationCode" style="width: 100px;"></el-input>
                        <img :src="imgBase64Data" title="点击刷新验证码" style="width: 70px; height: 32px; margin-right: 60px;cursor: pointer;" @click="flushCodeImage()"/>
                   </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login('ruleForm')">登录</el-button>
                </el-form-item>
            </el-form>
      </div>
    </div>
</template>

<script>
    import {checkCode} from "../../utils/vaildata"
    import {getCodAPI,loginAPI,getMenuAPI} from "../../api/userApi"
import { mapActions, mapMutations } from 'vuex'
    export default{
        created(){
           this.flushCodeImage()
           // 将menuData的数据进行清空，保证下一次登陆不同账号获取的菜单数据的正确性
            this.setMenuData([])
        },
        data(){
            return{
                ruleForm:{
                    account:"17760580731",
                    password:"Yanwenguang123_",
                    verificationCode:null,
                },
                imgBase64Data:"",
                rules:{
                    // 定义数据校验规则
                    account:[
                        // 校验对象 account
                        {
                            // 校验规则
                            required: true, // 设置为必填
                            message:"账号不能为空" // 给出提示信息，当不满足条件时
                            
                        }
                    ],
                    password:[
                        {
                            required:true,
                            message:"密码不能为空"
                        }
                    ],
                    verificationCode:[
                        // {
                        //     required:true,
                        //     message:"验证码不能为空"
                        // },
                        {
                            validator: checkCode, 
                            trigger: "blur"
                        }
                    ]
                }
            }
        },
        methods:{
            ...mapMutations({
                setMenuData:"setMenuData",
                }),
            ...mapActions({
                asyncChangeUserInfo:"asyncChangeUserInfo"
            }),
            login(formName){
                console.log("开始进行数据校验")
                // 登录功能,并进行数据的校验
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let reData = {
                            account:this.ruleForm.account,
                            password:this.ruleForm.password,
                            validCode:this.ruleForm.verificationCode
                        }
                        loginAPI(reData)
                        .then((res)=>{
                            if(res.code == 200){
                                this.$message.success("登陆成功")
                                // 登录成功，删除uuid缓存
                                localStorage.removeItem("uuid")
                                // 保存token
                                localStorage.setItem("token",res.data)
                                localStorage.setItem("上次登录时的token",res.data)
                                localStorage.setItem("上次登录时的时间",new Date())
                                // 获取用户信息
                                this.asyncChangeUserInfo()
                                // 跳转到首页
                                this.$router.push("/home")
                            }
                        })
                        .catch((err)=>{
                            this.$message.error(err)
                        })
                    } else {
                        console.log('error submit!!');
                        this.$message.warning("请填写正确的登录信息!!!")
                        return false;
                    }
                });
            },
            async flushCodeImage(){
                // 点击刷新验证码
                let res = await getCodAPI()
                if(res==false) return;
                this.imgBase64Data=res.data.base64
                // 将验证码对应的验证码uuid存储在本地中
                localStorage.setItem("uuid",res.data.uuid)
               
            }
        }
    }
</script>

<style scoped lang="less">
    .view{
        background: url("image/海贼王4K背景图.jpg");
        width: 100%;
        height: 100%;
        position: relative;
        background-position: center -250px;

        .login-form-box{
            width: 360px;
            // height: 320px;
            display: flex;
            flex-direction: column;
            // justify-content: center;
            align-content: center;
            // background-color:white;;
            background-color: rgba(252, 252, 252, 0.7);
            position: absolute;
            padding: 20px 0px;
            border-radius: 30px;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            h1{
                text-align: center;
                font-family: 'Courier New', Courier, monospace;
                font-size: 20px;
                margin-bottom: 20px;

            }
            .loginFrom{
               display: flex;
               flex-direction: column;
               justify-content: center;
               align-content: center;
               .el-input{
                width: 80%;
               }
               .el-form-item{
                    width: 100%;
                    margin-left: -10px;
                    .sign-in-button{
                        margin-left: 30px;
                    }
               }
               .el-button{
                width: 200px;
                background-color: #777576;
                opacity: 0.7;
               }
               .el-button:hover{
                background-color: red;
               }
            }
        }
    }

</style>
