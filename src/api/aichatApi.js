import instance from "@/request/myRequest";

// msg 为提问  version为ai版本
export function chatAPI(msg,version){
    return instance.get("ai/chat?question="+msg+"&version="+version,{
        responseType: 'stream'
    })
}