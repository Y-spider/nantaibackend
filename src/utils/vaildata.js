// 用于存放项目用到的所有校验相关的方法
export function checkCode (rule,value,callback){
    // 定义的校验验证码,检验验证码是否输入
    if(value == null){
        callback(new Error("验证码不能为空"))
    }
    else{
        callback()
    }
   
};