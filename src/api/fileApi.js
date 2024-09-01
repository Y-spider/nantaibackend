import instance from "@/request/myRequest";
import instance_wechat from "@/request/myRequestOfWechat";

// 获取公共文件资源分页信息
export function pageFileAPI(pageIndex,pageSize,pageType,openid,search,state){
    var url = "/document/page?pageIndex="+pageIndex+"&pageSize="+pageSize+"&pageType="+pageType+"&state="+state
    if(openid != undefined || openid != ""){
        url+="&openid="+openid
    }
    if(search != null || search != undefined){
        url+= "&search="+search
    }

    return instance_wechat.get(url)
}

export function getDocumentImageUrlAPI(documentId){
    return instance_wechat.get("/document/getUrl?documentId="+documentId)
}

// url 为文档下载请求部分地址
export function downloadDocumnetAPI(id,url){
    return instance_wechat.get("/document/downloadFile?url="+url+"&documentId="+id,{
        responseType: 'arraybuffer'
    })
}
// 修改文档信息接口
export function modifyDocumentAPI(data){
    return instance_wechat.post("/document/modify",data)
}

// 审核文档
export function examineDocAPI(data){
    return instance_wechat.post("/document/examine",data)
}

