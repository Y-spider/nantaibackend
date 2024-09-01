<template>
    <div class="header-box">
        <div class="bread-line">
           <div style="display: flex; justify-content: center; align-items: center;">
                <el-button icon="el-icon-s-fold" v-if="!isShow" @click="changeIsCollapse()"></el-button>
                <el-button icon="el-icon-s-unfold" v-else @click="changeIsCollapse()"></el-button>
                <el-breadcrumb separator-class="el-icon-arrow-right" >
                        <el-breadcrumb-item :to="{path:item.path}" v-for="(item,index) in breadcrumbDataList" :key="index">{{ item.name }}</el-breadcrumb-item>
                </el-breadcrumb>
           </div>
            <div class="avatar">
                <div class="flex-box" style="justify-content: center;align-items: center;">
                    <img :src="avatarUrl+'?time='+new Date().getTime"  @mouseenter="showAccount" @mouseleave="hiddeAccount"/>
                    <img src="../../assets/icon/退出.png" class="icon" @click="logout">
                </div>
                <div class="showUserAccountBorad" :style="isShowAccount">
                    {{ userInfo.account }}
                </div>
            </div>
        </div>
        <div class="tag-line">
            <el-tag
                v-for="(tag,index) in tags"
                :key="tag.name"
                :closable="tag.closableFlag"
                effect="dark"
                size="small"
                :type="tag.flag==true?'success':'info'"
                @close="handleClose(tag,index)"
                @click="handClick(tag,index)"
                >
                {{tag.name}}
            </el-tag>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import {logoutAPI} from "../../api/userApi"
export default {
    data(){
        return{
            //breadcrumDataList的值和当前点击
            breadcrumbDataList:[],
            avatarUrl:this.$baseImageUrl + JSON.parse(localStorage.getItem("userInfo")).avatar,
            userInfo:JSON.parse(localStorage.getItem("userInfo")),
            isShowAccount:" opacity: 0;",
            tags:[],
            effectTagIndex:0  // 记录当前显示的标签
        }
    },
    computed:{
        ...mapState({
            isShow:state=>state.navBarState.isCollapse
        })
    },
    methods:{
       ...mapMutations({changeIsCollapse:"changeIsCollapse"}),
       showAccount(){
        this.isShowAccount = " opacity: 1;"
       },
       hiddeAccount(){
        this.isShowAccount = " opacity: 0;"
       },
       // 安全推出系统
       async logout(){
            let res = await logoutAPI()
            if(!res) return;
            this.$message.success("退出成功")
            // 清空token
            localStorage.removeItem("token")
            this.$router.push("/login")
       },
       handleClose(tag,index){
            // 删除后，将路由记录跳转到上一条路由
            console.log("index",index)
            console.log("this.tags.length",this.tags.length-1)
           if(index == this.tags.length-1){
            // 关闭的是当前显示的标签
                this.tags.splice(index,1)
                this.tags[this.tags.length-1].flag = true
                console.log("this.tags.length",this.tags.length-1)
                this.$router.push(this.tags[this.tags.length - 1].path)
                console.log("route",this.tags[this.tags.length - 1].path)
                this.effectTagIndex = this.tags.length-1
                return
           }
           this.tags.splice(index,1)
       },
       handClick(tag,index){
        console.log("触发点击")
        this.tags[index].flag = true
        this.$router.push(tag.path)
       }
    },
    watch:{
        $route:{
            immediate:true,
            handler(newVal,oldVal){
                console.log(this.$route)
                this.breadcrumbDataList = this.$route.meta
                let meatInfo = this.$route.meta
                let flag = false
                console.log("metaInfo",meatInfo)
                if(meatInfo.length>1){
                    this.tags.forEach((tag)=>{
                        if(tag.name == meatInfo[1].name){
                            console.error("已经存在标签",tag.name)
                           flag = true
                        }
                    })
                }
                else{
                    this.tags.forEach((tag)=>{
                        if(tag.name == meatInfo[0].name){
                            console.error("已经存在标签",tag.name)
                            flag = true
                        }
                    })
                }
                // 添加标签
               if(meatInfo.length > 1 && !flag){
                    this.tags[this.tags.length] = {
                        name:meatInfo[1].name,
                        path:meatInfo[1].path,
                        flag:false,
                        closableFlag:true
                    }
               }
               else if(!flag){
                    this.tags[this.tags.length] = {
                        name:meatInfo[0].name,
                        path:meatInfo[0].path,
                        flag:false,
                        closableFlag:true
                    }
               }
                // 将tags中的tag与path的路径进行对比，相同的则将颜色设置为success
                this.tags[this.effectTagIndex].flag = false
                this.tags.forEach((tag,index)=>{
                    if(tag.path == this.$route.path){
                        tag.flag = true
                        this.effectTagIndex = index
                        return
                    }
                })
                if(this.tags.length == 1){
                    this.tags[0].closableFlag = false
                }
            }
        }
    }
}
</script>

<style scoped lang="less">
    .header-box{
        width: 99%;
        display: flex;
        flex-direction: column;
        box-shadow: 0px 1px 1px #ccc;
        .bread-line{
            width: 100%;
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-content: center;
            box-shadow: 0px 1px 1px #ccc;
            margin: 5px 0px;
            .el-breadcrumb{
                display: flex;
                align-items: center;
                margin-left: 15px;
            }
        }
        .avatar{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: 13px;
            img{
                width: 32px;
                height: 32px;
                border-radius: 50%;
                margin-right: 5px;
                cursor: pointer;
            }
            .showUserAccountBorad{
                color:black;
                font-size: small;
                z-index: 999;
                position: relative;
                left: -15px;

            }
            .icon{
                width: 20px;
                height: 20px;
            }

        }
        .tag-line{
            width: 100%;
            height: 30px;
            // background-color: lightblue;
            display: flex;
            align-items: center;
            .el-tag{
                font-size: 14px;
                margin: 0px 5px;
                cursor: pointer;
            }
        }
        .flex-box{
            display: flex;
            justify-content: center;
            align-content: center;
        }
    }
</style>