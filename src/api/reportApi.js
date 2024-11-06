import instance from "@/request/myRequest";
import instance_wechat from "@/request/myRequestOfWechat";

// 分页获取和condition
export function listReportWithPageAPI(pageIndex,pageSize,condition){
    return instance_wechat.get(`report/list?pageIndex=${pageIndex}&pageSize=${pageSize}&state=${condition.state}&openid=${condition.openid}&reportType=${condition.reportType}`,{
        headers:{
            "token":localStorage.getItem("token")
        },
    })
}

// 根据id查询report
export function getReportByIdAPI(id){
    return instance_wechat.get(`report?id=${id}`)
}

// 根据id查询相关的图片信息

export function getReportImageUrAPI(id){
    return instance_wechat.get(`report/getImg?reportId=${id}`)
}