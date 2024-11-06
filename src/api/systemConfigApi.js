import instance_wechat from "@/request/myRequestOfWechat";

// 获取系统配置信息
export function getSystemConfigAPI(){
    return instance_wechat.get("/config",{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}

// 更新系统配置文件
export function modifySystemConfigAPI(data){
    return instance_wechat.post("/config",data,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}