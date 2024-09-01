<template>
    <div :class="collapseStyle">
        <div class="fun-menu">
            <el-col :span="12">
                <!-- <h5>自定义颜色</h5> -->
                <div v-show="!isCollapse" class="title">
                  <div style="margin-left: -22px;"> <img src="../../assets/icon/icon.jpg" style="width: 32px; height: 32px; border-radius: 10px;"></div>
                  <div style="font-size: 22px; padding: 0px 15px;">南泰微校园</div>
                </div>
                <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                :router="true"
                :collapse="isCollapse"
                :unique-opened="true"
                :collapse-transition="false"
                @open="handleOpen"
                @close="handleClose"
                background-color="#304156"
                text-color="#fff"
                active-text-color="#ffd04b">
               <div v-for="item,id in menuData" :key="id">
                <el-submenu :index="item.path" v-if="item.children.length!=0">
                    <template slot="title">
                        <!-- <i :class="item.icon"></i> -->
                        <img class="fun-icon" :src="imageBaseUrl+item.icon">
                        <span>{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="itemChildren,idChilrden in item.children" :key="idChilrden" :index="itemChildren.path">
                        <!-- <i class="el-icon-menu"></i> -->
                        <span slot="title">{{ itemChildren.title }}</span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item v-else :index="item.path">
                    <img class="fun-icon" :src="imageBaseUrl+item.icon">
                    <span slot="title">{{ item.title }}</span>  
                </el-menu-item>
               </div>
                </el-menu>
            </el-col>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { getMenuAPI } from "../../api/userApi"
export default {
    created(){
        console.error("获取到存储的用户信息",JSON.parse(localStorage.getItem("userInfo")).account)
    },
    data(){
        return{
            imageBaseUrl:"http://localhost/",
        }
    },
    computed:{
        ...mapState({isCollapse:state=>state.navBarState.isCollapse,menuData:"menuData"}),
        collapseStyle(){
            if(!this.isCollapse){
                return 'nav-bar-box';
            }
            else{
                return 'nav-bar-box-no-collapse'
            }
        }
    },
    methods:{
        handleOpen(){

        },
        handleClose(){

        }
    }
}
</script>

<style scoped lang="less">
    .nav-bar-box,.nav-bar-box-no-collapse{
        width: 210px;
        height: 100vh;
        background-color: #304156;
        box-shadow: 2px 0px 3px #ccc;
        position: relative;
        transition: all 0.3s;
        .fun-icon{
            width: 18px;
            height: 18.4px;
            margin: 0px 8px;
        }
       .fun-menu{
        margin: -30px 0px;
        .title{
        width: 100%;
        display: flex;
        justify-content:center;
        align-items: center;
        margin: 15px 0px;
        color: white;
        position: relative;
       }
       }
       .el-col{
        width: 100%;
        margin: 30px 0px;
       }
    }
    .nav-bar-box-no-collapse{
        width: 64px;
        // 这里的解决在隐藏时，字体也会出现一部分
        .el-submenu__title span,::v-deep .el-submenu__icon-arrow{
            display: none;
        }
    }
</style>