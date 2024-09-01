import Vue from 'vue'
import Vuex from 'vuex'
import { getCurrentUserInfoAPI } from '@/api/userApi'
import { Message } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      navBarState:{
        isCollapse:true
      },
      menuData:[],
      userInfo:{},// 存储当前登录用户的信息,在开发中本地也会存储一份
      isShowPostRouteView:true, // 标识是否要显示各级分类帖子相关的内容
      isPreviewPostImage:false, // 标识是否要展示点击图片放大进行预览
      isShowConfirmDialog:false, // 标识是否要展示确认弹出框
      confirmDialogIsConfirm:false // 标识确认框是否弹出后，用户的行为 false表示用户取消操作 true表示用户确认操作
  },
  getters: {
  },
  mutations: {
    changeIsCollapse(state){
      state.navBarState.isCollapse = !state.navBarState.isCollapse
    },
    setMenuData(state,data){
      state.menuData = data
      console.warn("state.menuData",data)
    },
    setUserInfo(state,data){
      state.userInfo = data
    },
    setIsShowPostRouteView(state,data){
      // Message.info("即将设置的值为:"+data)
      state.isShowPostRouteView = data
    },
    setIsPreviewPostImage(state,data){
      state.isPreviewPostImage = data
    },
    setIsShowConfirmDialog(state,data){
      state.isShowConfirmDialog = data
      state.confirmDialogIsConfirm = false
    },
    setConfirmDialogIsConfirm(state,data){
      state.confirmDialogIsConfirm = data
    }
  },
  actions: {
      async asyncChangeUserInfo({commit},payload){
        console.warn("开始获取用户信息....")
        let res = await getCurrentUserInfoAPI()
        if(res.code == 200){
          commit("setUserInfo",res.data)
          // 向本地存储一份用户数据
          localStorage.setItem("userInfo",JSON.stringify(res.data))
        }
        else{
          Message.error(res.errMsg)
        }
      }
  },
  modules: {
  }
})

