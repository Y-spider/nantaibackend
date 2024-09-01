// 与用户操作相关的api，写在这里
import instance from "@/request/myRequest";
import instance_wechat from "@/request/myRequestOfWechat";
//1. 获取验证码请求

export function getCodAPI(){
    return instance.get("/user/getCode",{
        headers:{
            "uuid":localStorage.getItem("uuid")
        }
    })
}

export function loginAPI(data){
    return instance.post("/user/login",data,{
        headers:{
            "uuid":localStorage.getItem("uuid")
        }
    })
}

export function getMenuAPI(){
    return instance.get("/user/getMenu",{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}

// 获取当前登陆用户的信息
export function getCurrentUserInfoAPI(){
    return instance.get("/user/getUserInfo",{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}

export function logoutAPI(){
    return instance.get("/user/logout",{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}


export function getWechatUserAPI(pageIndex,paseSize,search){
    let url = "/user/page?pageIndex="+pageIndex+"&pageSize="+paseSize
    if(search!=""){
        url += "&search="+search
    }
    return instance_wechat.get(url,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}

export function modifyWechatUserInfoAPI(data){
    return instance_wechat.post("/user/modify",data,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}
