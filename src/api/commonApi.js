import axios  from "axios"
import instance_wechat from "@/request/myRequestOfWechat";
axios.defaults.baseURL = "http://localhost/back"
export function getImageAPI(path){
    return axios.get("/17760580731/avatar/avatar.jpg")
}

export function getDeletePostDelayDayAPI(){
    return instance_wechat.get("/common/deletePostDelayDay")
}