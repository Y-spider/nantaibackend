// 这里用于封装我自己的请求
import axios from "axios";
import { Message } from "element-ui";
import router from "@/router";
// 配置统一配置
const instance_wechat = axios.create({
    baseURL:"http://localhost:8888",
    timeout:6000, // 超时时间设置为 6s,
})
// 创建请求拦截器

instance_wechat.interceptors.request.use(config=>{
    return config;
},error=>{
    // 请求失败，直接抛出错误即可
    return Promise.reject(err)
})

// 响应拦截器

instance_wechat.interceptors.response.use(res=>{
    // 这里可以对后端返回来的请求状态码code进行统一的处理

    if(res.data.code == -1){
        Message.error(res.data.errMsg)
        return false;
    }
    else if(res.data.code == 110){

        Message.error("内容含有敏感词汇:"+res.data.errMsg)
        return false;
    }
    else if(res.data.code == -240){
        Message.error("验证码不一致")
        return false;
    }
    else if(res.data.code === -99){
        Message.error("登录失效!")
        // 重定向到登陆页面
        localStorage.removeItem("token")
        router.push("/login")
        return false;
    }
    return res.data
},err=>{
    // 请求失败，直接抛出错误
    return Promise.reject(err)
});



export default instance_wechat;