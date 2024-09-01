import instance from "@/request/myRequest";
import instance_wechat from "@/request/myRequestOfWechat";

// 有可能是有二级分类的分类
export function getPostByTypeWithPageAPI(pageIndex,pageSize,type,typeSecond,isTop,isDelete,sortCode,search){
    let url = "/post/getByPost?pageIndex="+pageIndex+"&pageSize="+pageSize+"&sortCode="+sortCode
    if(type!=""){
        url+="&type="+type
    }
    if(typeSecond!=""){
        url+="&typeSecond="+typeSecond
    }
    if(isTop!=""){
        url+="&isTop="+isTop
    }
    if(isDelete!=""){
        url+="&isDelete="+isDelete
    }
    if(search!=""){
        url+="&search="+search
    }

    return instance.get(url,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}

export function getPostImagByPostIdAPI(postId){
    return instance_wechat.get("/post/getPostImage?postId="+postId,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}

export function getTopPostByPostIdAPI(postId){
    return instance_wechat.get("/post/getTopPost?postId="+postId,{
        "token":localStorage.getItem("token")
    })
}

export function modifyPostBatchAPI(data){
    return instance_wechat.post("/post/modifyPost",data,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}

export function setPostTopAPI(data){
    return instance.post("/post/setTop",data,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}

export function cancelTopPostAPI(postId){
    return instance.get("/post/cancel?postId="+postId,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}


export function modifyPostInfoAPI(data){
    return instance.post("/post/modifyPost",data,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}

export function deletePostByPostIdAPI(data){
    return instance_wechat.post("/post/deletePost",data,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}

export function recoveryPostAPI(postId,openid){
    return instance.get("/post/recovery?postId="+postId+"&openid="+openid,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}

export function physicalDeletePostByHandAPI(openid,postId){
    return instance.get("/post/physicalDelete?openid="+openid+"&postId="+postId,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}
