import instance from "@/request/myRequest";
import instance_wechat from "@/request/myRequestOfWechat";

// 获取网站文件资源分页信息
export function pageWebsiteAPI(pageIndex, pageSize, pageType, openid, search, state) {
    var url = "/website/page?pageIndex=" + pageIndex + "&pageSize=" + pageSize + "&pageType=" + pageType + "&state=" + state
    if (openid != undefined || openid != "") {
        url += "&openid=" + openid
    }
    if (search != null || search != undefined) {
        url += "&search=" + search
    }

    return instance_wechat.get(url)
}

// 修改网站信息
export function modifyWebsiteAPI(website) {
    return instance_wechat.post("/website/modify", website)
}

// 审核网站信息
export function examineWebsiteAPI(website){
    return instance_wechat.post("/website/examine",website)
}