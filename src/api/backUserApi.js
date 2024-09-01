import instance from "@/request/myRequest";

export function getBackUserInfoAPI(pageIndex,pageSize,search){
    let url = "/user/page?pageIndex="+pageIndex+"&pageSize="+pageSize
    if(search!=""){
        url += "&search="+search
    }
    return instance.get(url,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}