import instance from "@/request/myRequest";
import instance_wechat from "@/request/myRequestOfWechat";

// 上传轮播图信息
export function uploadSwiperImageAPI(data){
    return instance_wechat.post("/swiper",data,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}

// 分页获取轮播图信息
export function listSwiperImageAPI(pageIndex,pageSize,state){
    return instance_wechat.get(`/swiper/list?pageIndex=${pageIndex}&pageSize=${pageSize}&state=${state}`,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}
// 更新轮播图信息
export function updateSwiperImageAPI(data){
    return instance_wechat.post("/swiper/modify",data,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}
// 删除轮播图
export function deleteSwiperImageByIdAPI(id){
  return  instance_wechat.get(`/swiper/del?id=${id}`,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}

export function getSwiperImageByIdAPI(id){
    return instance_wechat.get(`/swiper?id=${id}`,{
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}