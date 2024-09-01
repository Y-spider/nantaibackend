import Vue from 'vue'
import VueRouter from 'vue-router'
import {getMenuAPI} from "../api/userApi"
import store from '@/store'
import { Message } from 'element-ui'
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {
    path: '/',
    name: 'mainlayout',
    component:()=>import(/* webpackChunkName: "mainlayout" */ '../views/index/index.vue'),
    redirect:"/home",
    children:[
      {
        path:"/home",
        meta:[{"name":"首页","path":"/home"}],
        name:"home",
        component:()=>import(/* webpackChunkName: "home" */ '../views/index/compontes/HomeView.vue')
      }
    ]
  },
  {
    path:"/login",
    name:"login",
    component:()=>import(/* webpackChunkName: "login" */ '../views/login/LoginView.vue')
  },
  {
    path:"*",
    component:()=>import(/* webpackChunkName: "404" */ "../views/404View/404.vue")
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


// 设置全局前置路由守卫

router.beforeEach(async (to,from,next)=>{
  // Message.info(to.path == "/postManager")
  // 通过判断是否存在token，进行判定用户可以进入那些页面和禁止进入那些页面
  let token = localStorage.getItem("token")
  // 1. 如果用户访问登录页面，有token，则跳转到首页，如果没有则跳转到登录页面
  if(to.path=="/login" && token){
    next("/")
    return;
  }
  // 2. 用户没有token，访问非登陆页面，则跳转到登陆页面
  if(to.path!="/login" && !token){
    next("/login")
    return;
  }
   // 4. 判断是否是去帖子管理的页面,则将 
   if(to.path==="/postManager"){
      store.commit("setIsShowPostRouteView",false)
    }
    else{
      // Message.info("触发"+to.path)
      store.commit("setIsShowPostRouteView",true)
    }
  // 3. 判断vuex中menuData中的数据，如果为空则发起请求
  if(token && store.state.menuData.length==0){
      let res = await getMenuAPI(token)
      store.commit("setMenuData",res.data)
      // 将Vuex中的menuData进行获取后，下一步就是需要将获取的menuData注册在路由中
      // 当然在获取的menudData数据中，并不是所有的字段都需要，我们只需要其中的path字段即可
      // 关于路由需要的字段主要是path和 component 两个字段，但是由于后端并没有返回组件名称，所以这里的组件路径通过固定来进行指定，
      //统一放在views/index/compoents文件夹下并且组件的名称命名格式为获取路径最后/的内容并且每一个单词大写(由于后端传递的格式为驼峰，所以只需要将第一个字母大写即可)
      // 并且统一以再加上View.vue结尾哦。
      let daynamicRouteDataList = []
      if(res.data==undefined) return;
      res.data.forEach((item)=>{
        // 开始构建路由对象,先构建一级对象
        let daynamicRouteDataListIndex = daynamicRouteDataList.length
        let splitList =  item.path.split("/")
        let componentName = splitList[splitList.length-1].charAt(0).toUpperCase() + splitList[splitList.length-1].substring(1) + "View.vue"
        daynamicRouteDataList[daynamicRouteDataListIndex] = {
          path:item.path,
          meta:[{"name":item.title,"path":item.path}],
          name:splitList[splitList.length-1], // 路由名称
          component:()=>import(`../views/index/compontes/${componentName}`)
        }
        router.addRoute("mainlayout",daynamicRouteDataList[daynamicRouteDataListIndex])
        // console.log(item)
        if(item.children.length != 0){
         // 说明当前路由有子路由，需要将子路由添加到当前路由记录中
         let childrenRouts = item.children
         childrenRouts.forEach((croute)=>{
          let childRouteName = croute.path.split("/")[croute.path.split("/").length-1]
          let childComponentName = childRouteName.charAt(0).toUpperCase() + childRouteName.substring(1) +"View.vue"
           router.addRoute(splitList[splitList.length-1],{
              name:childRouteName,
              meta:[{"name":item.title,"path":item.path},{"name":croute.title,"path":croute.path}],
              path:croute.path, 
              component:()=>import(`../views/index/compontes/${splitList[splitList.length-1]}/${childComponentName}`)
           })
         })
        }
      })
      // 关于这里为什么需要进next(to.path)是因为在添加完路由后，需要在下一次路由检查时才会生效,所以不能直接next()，关于next，
      //如果next中没有路径则不会走路由守卫，如果有路径则会走路由守卫
      // 看老师教学视频是这样的，但是实际上不使用next(to.path)也是可以的
      next(to.path)
  }
  next()
})



export default router
