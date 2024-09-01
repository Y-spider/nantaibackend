// 封装的公共方法
// 1. 封装获取当前时间格式字符串
export function getFormattedDate() {
    const now = new Date(); // 获取当前时间
    const year = now.getFullYear(); // 获取年份
    const month = now.getMonth() + 1; // 获取月份，月份从0开始，所以需要+1
    const day = now.getDate(); // 获取日期
    const hours = now.getHours(); // 获取小时
    const minutes = now.getMinutes(); // 获取分钟
  
    // 将个位数的月份、日期、小时或分钟前面补0
    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  
    // 格式化日期时间字符串
    return `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}`;
  }