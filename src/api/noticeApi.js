import instance from "@/request/myRequest";
import instance_wechat from "@/request/myRequestOfWechat";
import { Message } from "element-ui";

export function getNoticeApi(pageIndex,pageSize,typeCode){
    // typeCode的取值为 1 或 -1 1表示获取当前线上的公告 -1 表示获取历史公告
    if(pageIndex==undefined || pageSize ==undefined || typeCode == undefined){
        Message.warning("参数缺失")
        return false
    }
    return instance.get("/notice/list?pageIndex="+pageIndex+"&pageSize="+pageSize+"&typeCode="+typeCode,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}

export function saveAPI(data){
    return instance.post("/notice/save",data,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}

export function modifyAPI(data){
    return instance.post("/notice/modify",data,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}

export function deleteAPI(id){
    return instance.get("/notice/delete?id="+id,{
        headers:{
            "token":localStorage.getItem("token")
        }
    }) 
}