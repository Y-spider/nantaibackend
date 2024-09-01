<template>
  <div class="body-box">
    <div :class="chat_window_calss_name">
      <div class="chat-window-left">
        <div class="window-left-head">
          <!-- 功能icon -->
          <div class="left-icon-box">
            <img @click="handleEnlarge()" src="../../../assets/icon/缩放.png" />
          </div>
          <!-- 名称暂时不写 -->
          <div class="left-ainame-box"></div>
        </div>
        <!-- 辅助实现低像素边界线 -->
        <div class="line-box"></div>

        <div class="window-left-body" ref="scrollBox">
          <!-- 循环渲染历史记录    -->
          <div
            v-for="(record, index) in recordList"
            :key="index"
            :class="chatRecordClassNameleList[index]"
            @mouseenter="handleMouseEnterChatRecordItem(index)"
            @mouseleave="handleMouseLeaveChatRecordItem(index)"
            @click="handleClickChatRecord(index)"
          >
            <div class="chat_record_item_top" style="margin: 7px 5px">
              <p style="font-size: 14px; color: #f6f6fa">{{ record.title }}</p>
            </div>
            <div class="chat_record_item_bottom">
              <div>{{ record.createTime }}</div>
              <div>{{ record.cahtCount }}条会话</div>
            </div>
            <div
              v-show="showRemoveIconList[index]"
              class="remove-icon"
              @click="handleDeleteChatRecord(index)"
            >
              <icon class="el-icon-remove"></icon>
            </div>
          </div>
        </div>
        <!-- 辅助实现低像素边界线 -->
        <div class="line-box"></div>
        <!-- 底部 -->
        <div class="window-left-footer">
          <div class="new-chat" @click="handleCreateChat()">
            <Icon class="el-icon-circle-plus"></Icon>
            <p class="add-chat">新的聊天</p>
          </div>
        </div>
      </div>
      <!-- 聊天窗口 -->
      <div class="chat-window-right">
        <div class="right_head">
          <!-- 聊天框上边部分 -->
          <!-- <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select> -->
        </div>
        <!-- 辅助实现低像素边界线 -->
        <div class="line-box"></div>

        <div class="right_body">
          <!-- 聊天主题部分 -->
          <div class="tip_box" :class="isShowTip">
            <!-- 空会话提示部分 -->
            <div class="tip_text">
              试试发送一些问题给我，比如 "给我讲个笑话"
            </div>
            <div class="tip_button">
              <el-button plain size="small" @click="tryit()"
                >尝试一下</el-button
              >
            </div>
          </div>
          <!-- 渲染会话列表 -->
          <div class="chat_item_box" ref="chat_item_box">
                <div
                  v-for="(item,index) in recordItemDataList"
                  :key="index"
                  class="chat_item"
                  style="width: 100%; min-height: 80px; background-color: #293266"
                >
              <div class="item_question">
                <!-- 会话问题（在右边）-->
                <div class="question_content">
                  {{ item.question }}
                </div>
              </div>
              <div class="robot_icon">
                <img
                  src="../../../assets/icon/智能机器人.png"
                  width="80px"
                  height="80px"
                />
              </div>
              
              <div class="question_answer" @mouseenter="handleShowOtherFun(index)" @mouseleave="handleHiddleOtherFun(index)">
                <!-- ai回答（在左边） -->
                <LoadingView :isShow="isShowLoadingList[index]" style="margin:5px;"></LoadingView>
               <div>
                {{ item.answer }}
               </div>
              </div>
              <div :class="isShowOtherFunList[index]">
                <div class="search_network">
                    <img src="../../../assets/icon/搜索.png">
                    <a class="search_des" target="_blank"  :href="searchUrl" @click="handleNetWorkSearch(index)">网络搜索</a>
                </div>
                <div class="copy_answer" @click="handleCopyAnswer(index)">
                    <el-tooltip class="item" effect="light" content="复制" placement="bottom-start">
                        <img src="../../../assets/icon/复制.png">   
                    </el-tooltip>
                </div>
              </div>
            </div>
          </div>
          <!-- 问题输入框 -->
          <div class="make_question_box">
            <div class="question_box_head">
              <div class="question_box_head_left">
                <!-- CahtGpt版本选择 -->
                <div
                  :class="item.checke"
                  v-for="(item, index) in aiVersionList"
                  @click="handleChangeAiVersion(index)"
                  :key="index"
                >
                  {{ item.version }}
                </div>
              </div>
              <div class="question_box_head_right" @click="makeQuestionByClick">
                <icon class="el-icon-s-promotion" title="发送"></icon>
              </div>
            </div>
            <div class="question_input_box">
              <textarea
                class="question_textarea"
                style="width: 96%"
                @keydown.enter="makeQuestion"
                ref="question_input"
                rows="2"
                cols="2"
                id="que"
                placeholder="请输入内容,Enter发送,Ctrl+Enter换行"
                v-model="question"
              >
              </textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "element-ui";
import LoadingView from "@/components/LoadingView.vue";
import { getFormattedDate } from "../../../utils/common";
import { chatAPI } from "@/api/aichatApi";
export default {
  components: { Icon ,LoadingView},
  created() {
    let index = 0;
    this.recordList.forEach((t) => {
      this.showRemoveIconList[index] = false;
      this.chatRecordClassNameleList[index] = "chat_record_item";
      index++;
    });
    this.chatRecordClassNameleList[0] = "chat_record_item_selected";
  },
  data() {
    return {
      chat_window_calss_name: "chat-window-normal",
      caht_window_left_class_name: "chat-window-left",
      recordList: [
        { title: "新的聊天记录", createTime: "2024-06-23 16:18", cahtCount: 0 },
        { title: "新的聊天记录", createTime: "2024-06-23 16:18", cahtCount: 0 },
      ], // 记录历史会话记录
      // 当前会话的历史记录书数据列表
      recordItemDataList: [],
      showRemoveIconList: [],
      currentSelectedRecordChatRecordIndex: 0, // 记录当前选中的对话记录，默认是选中第一个对话
      currentChatRecordIndex:-1,
      chatRecordClassNameleList: [],
      isShowLoadingList:[], // 标识是否需要展示加载视图
      isShowOtherFunList:[], // 是否显示其他功能
      question: "",
      aiVersionList: [
        { id: 1, version: "AI-3.5" ,checke:"version_item_checked"},
        { id: 2, version: "AI-4.0" ,checke:"version_item_no_checked"},
        { id: 3, version: "AI-4o" ,checke:"version_item_no_checked"},
        { id: 4, version: "AI绘画" ,checke:"version_item_no_checked"},
        { id: 5, version: "文本转语音" ,checke:"version_item_no_checked"},
        { id: 5, version: "语音转文本" ,checke:"version_item_no_checked"},


      ],
      currentAiVersionIndex:0,
      isShowTip: "top_box",
      isShowLoading:false ,
      searchUrl:"",
      options: [{
          value: '选项1',
          label: '普通模式'
        }, {
          value: '选项2',
          label: '流式模式'
        }],
        value: '普通模式'
    };
  },
  methods: {
    handleNetWorkSearch(index){
      this.searchUrl = "https://www.baidu.com/s?tn=15007414_15_dg&ie=utf-8&wd=" + this.recordItemDataList[index].question
    },
    handleCopyAnswer(index){
      navigator.clipboard.writeText(this.recordItemDataList[index].answer)
      .then((res)=>{
        this.$message.success("复制成功")
      })
    },
    handleShowOtherFun(index){
      this.currentChatRecordIndex = index
    },
    handleHiddleOtherFun(index){
      this.currentChatRecordIndex = index
    },
    handleChangeAiVersion(index){
        this.aiVersionList[this.currentAiVersionIndex].checke = "version_item_no_checked"
        this.aiVersionList[index].checke = "version_item_checked"
        this.currentAiVersionIndex = index
    },
    handleEnlarge() {
      this.chat_window_calss_name =
        this.chat_window_calss_name == "chat-window-normal"
          ? "chat-window-enlarge"
          : "chat-window-normal";
    },
    // 处理鼠标进入会话记录
    handleMouseEnterChatRecordItem(index) {
      if (this.recordList.length != 1)
        this.$set(this.showRemoveIconList, index, true);
    },
    //  处理鼠标离开会话记录
    handleMouseLeaveChatRecordItem(index) {
      this.$set(this.showRemoveIconList, index, false);
    },
    handleDeleteChatRecord(index) {
      this.recordList.splice(index, 1);
    },
    handleCreateChat() {
      let now = getFormattedDate();
      this.recordList.unshift({
        title: "新的聊天记录",
        createTime: now,
        cahtCount: 0,
      });
      this.chatRecordClassNameleList.unshift("chat_record_item_selected");
      this.$set(this.showRemoveIconList, this.showRemoveIconList.length, false);
      this.$set(
        this.chatRecordClassNameleList,
        this.currentSelectedRecordChatRecordIndex + 1,
        "chat_record_item"
      );
      this.currentSelectedRecordChatRecordIndex = 0;
      this.scrollToTop();
      localStorage.setItem("enableCreateNewChat", false);
    },
    handleClickChatRecord(index) {
      if (index != this.currentSelectedRecordChatRecordIndex) {
        this.$set(
          this.chatRecordClassNameleList,
          index,
          "chat_record_item_selected"
        );
        this.$set(
          this.chatRecordClassNameleList,
          this.currentSelectedRecordChatRecordIndex,
          "chat_record_item"
        );
        this.currentSelectedRecordChatRecordIndex = index;
      }
    },
    // 进行发送问题
    async makeQuestion(e) {
      if (e.ctrlKey && e.keyCode === 13) {
        // 用户点击了 Ctrl+Enter 触发
        // this.$message.info("触发 Ctrl+Enter");
        this.question += "\n";
      } else {
         // 用户点击了 Enter 触发
        // 阻止键盘输入enter事件的默认事件
        e.preventDefault()
        // 首先判断上次ai是否回答完成
        if(this.isShowLoadingList[this.isShowLoadingList.length-1]){
            this.$message.warning("正在回答中....")
            return;
        }
        if(this.isShowTip == 'top_box'){
            this.isShowTip = "top_box hiddle_content"
        }
        this.recordItemDataList.push({
            question:this.question,
            answer:""
        })
        // 显示加载动画
        this.isShowLoadingList.push(true)
         // 向后端发起请求
        
        // let res =  await chatAPI(this.question)
        // console.log(res)
        // res.data('data',(chunk)=>{
        //   // 处理接受到的块级数据
        //   console.log("chunk",chunk)
        // })
        // 使用fetch发起请求并处理结果
        const res = await fetch("http://localhost:8888/back/ai/chat?question="+this.question,{headers:{ 'Content-Type':'application/json'}})
        if(res.status == 500){
          this.$message.error("请求失败!")
        }
        const reader = res.body.getReader()
        // 创建解码器
        const textDecoder = new TextDecoder()
        // while(true){
        //   const {value,done} = await reader.read()
        //   if(done){
        //     this.$message.info("读取完成")
        //     break;
        //   }
        //   // 读取的数据是一个类型化数组，所以需要讲编码转化为字符串
        //  let str =  textDecoder.decode(value).split(":")[1]
        //  this.recordItemDataList[this.recordItemDataList.length-1].answer += str
        //   console.log("读取的数据:"+str)
        // }
        // 清空输入框
        this.question = ""
        setTimeout(()=>{
            this.recordItemDataList[this.recordItemDataList.length-1].answer ="55664"
        },1000)
       // ai回答完成，隐藏加载动画
      setTimeout(()=>{
        this.$set(this.isShowLoadingList,this.isShowLoadingList.length-1,false)
      },500)
      this.recordList[this.currentSelectedRecordChatRecordIndex].cahtCount++
    // 确保DOM更新后再执行滚动条定位
    this.$nextTick(() => {
        // 处理完成后，将滚动条定位到最下面
        // 1. 拿取到滚动条显示的盒子dom节点
       const box = this.$refs.chat_item_box
       // 2. 将盒子滚动条位置设置到最下面
       box.scrollTop = box.scrollHeight 
       console.log("height="+box.height)
       console.log(box.scrollHeight)
    });
      }
      
    },
    // 用户点击发送请求
    makeQuestionByClick(){
      if(this.question == ""){
        return;
      }
      this.$message.info("触发")
      if(this.isShowLoadingList[this.isShowLoadingList.length-1]){
            this.$message.warning("正在回答中....")
            return;
        }
        if(this.isShowTip == 'top_box'){
            this.isShowTip = "top_box hiddle_content"
        }
        this.recordItemDataList.push({
            question:this.question,
            answer:""
        })


      this.question = ""

      this.isShowLoadingList.push(true)
         // 向后端发起请求
         let i = 0;
        
        setTimeout(()=>{
            this.recordItemDataList[this.recordItemDataList.length-1].answer ="55664"
        },1000)
       // ai回答完成，隐藏加载动画
      setTimeout(()=>{
        this.$set(this.isShowLoadingList,this.isShowLoadingList.length-1,false)
      },500)
      this.recordList[this.currentSelectedRecordChatRecordIndex].cahtCount++
    // 确保DOM更新后再执行滚动条定位
    this.$nextTick(() => {
        // 处理完成后，将滚动条定位到最下面
        // 1. 拿取到滚动条显示的盒子dom节点
       const box = this.$refs.chat_item_box
       // 2. 将盒子滚动条位置设置到最下面
       box.scrollTop = box.scrollHeight 
       console.log("height="+box.height)
       console.log(box.scrollHeight)
    });


    },
    // 发起尝试一下的请求
    tryit() {
        this.recordList[this.currentSelectedRecordChatRecordIndex].cahtCount++
        this.isShowTip = "top_box hiddle_content"
        this.recordItemDataList.push({
            question:"给我讲个笑话",
            answer:"为什么数学书看起来总是很悲伤？因为它总是充满了“问题”！为什么数学书看起来总是很悲伤？因为它总是充满了“问题”！为什么数学书看起来总是很悲伤？因为它总是充满了“问题”！为什么数学书看起来总是很悲伤？因为它总是充满了“问题”！"
        });
        this.isShowLoadingList.push(true)
        setTimeout(()=>{
            this.isShowLoadingList[this.isShowLoadingList.length-1] = false
        })
    },
    // 将滚动条回滚到顶端
    scrollToTop() {
      this.$refs.scrollBox.scrollTop = 0;
    },
  },
  watch: {
    recordItemDataList: function (newValue, oldValue) {
      this.isShowOtherFunList.push("other_funcation_hiddle")
      // 确保DOM更新完成后执行滚动操作
      
      this.$nextTick(() => {
        //  this.scrollToTop();
      });
    },
    currentChatRecordIndex:function (newValue,oldValue){
      // 当进入时，切换对应的额外功能的显示域隐藏
      // 显示新的，隐藏旧的
      this.$set(this.isShowOtherFunList,newValue,"other_funcation_show")
      if(oldValue == -1){
       return;
      }
      this.$set(this.isShowOtherFunList,oldValue,"other_funcation_hiddle")
    }
  },
};
</script>

<style scoped>
a{
  color: white;
}
.hiddle_content {
  z-index: -1;
}
img {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin: 5px;
  border-radius: 50%;
}
.body-box {
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  background-color: #f3f4f7;
}
.chat-window-normal {
  width: 70%;
  height: 80vh;
  display: flex;
  background-color: white;
  border-radius: 15px;
  margin-bottom: 15px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}
.chat-window-enlarge {
  width: 100%;
  height: 85vh;
  display: flex;
  background-color: white;
  border-radius: 15px;
  margin-bottom: 15px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}
.chat-window-left {
  width: 360px;
  height: 100%;
  border-radius: 15px 0px 0px 15px;
  background-color: #303b75;
  display: flex;
  flex-direction: column;
}
.window-left-head {
  display: flex;
  justify-content: space-around;
  /* border-bottom: 0.1px solid white; */
}
.el-input__inner {
  background-color: #293266 !important;
}
.left-icon-box {
  width: 30%;
  height: 60px;
  margin: 10px 10px 10px 5px;
  /* background-color: pink; */
  box-sizing: border-box;
}
.left-ainame-box {
  width: 70%;
  min-height: 60px;
  margin: 15px 10px 10px 5px;
  /* background-color: #bbb; */
}
/*  */
.line-box {
  width: 100%;
  height: 1px;
  border-bottom: 1px solid #fff;
  transform: scale(1, 0.5);
}

.window-left-body {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
}
.chat_record_item,
.chat_record_item_selected {
  width: 90%;
  /* min-width: 224px; */
  min-height: 50px;
  font-size: small;
  border-radius: 7px;
  background-color: #4a589e;
  margin: 8px 5px;
  cursor: pointer;
  opacity: 0.5;
  position: relative;
}
.chat_record_item_selected {
  opacity: 1;
}
.chat_record_item:hover {
  opacity: 1;
}
.chat_record_item_bottom {
  display: flex;
  justify-content: space-between;
  margin: 10px 5px;
  color: #9aa2c9;
  display: flex;
  justify-content: spa;
}
.remove-icon {
  position: absolute;
  margin-top: -38px;
  margin-left: -15px;
}
.el-icon-remove {
  font-size: 20px;
  color: #ccc;
}

.window-left-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  /* background-color: #bbb; */
}
.new-chat {
  width: 70%;
  height: 36px;
  margin: 15px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #3a4684;
  border-radius: 7px;
  cursor: pointer;
  opacity: 0.7;
}
.new-chat:hover {
  color: white;
  opacity: 1;
}
.el-icon-circle-plus {
  font-size: 20px;
  color: #8189b0;
  margin: 0px 7px;
}
.add-chat {
  font-size: 14px;
  color: #8189b0;
  user-select: none;
}

::-webkit-scrollbar {
  background-color: #3a4684;
  width: 5px;
}
/* 滚动条轨道的背景色 */
::-webkit-scrollbar-track {
  background: #3a4684; /* 轨道的背景颜色 */
}
/* 滚动条滑块的背景色和圆角 */
::-webkit-scrollbar-thumb {
  background-color: #ccc; /* 滑块的背景颜色 */
  border-radius: 6px; /* 滑块的圆角 */
}
/* 滑块hover时的背景色 */
::-webkit-scrollbar-thumb:hover {
  background-color: #999; /* 鼠标悬停时滑块的背景颜色 */
}
/*  */
.chat-window-right {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #293266;
  border-radius: 0px 15px 15px 0px;
}
.right_head {
  width: 100%;
  min-height: 60px;
}
.right_body {
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  background-color: #293266;
}
.right_head {
  width: 100%;
  height: 60px;
}
.tip_box {
  min-width: 100%;
  height: 68px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  color: #7f84a3;
  margin: 5px;
  position: relative;
  visibility: 0;
}
.tip_text {
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  font-size: small;
  margin-top: 15px;
}
.el-button {
  color: #ccc;
  background-color: #3a4684;
  opacity: 0.7;
  border-radius: 8px;
  border: none;
}
.el-button:hover {
  background-color: #3a4684;
  border: none;
  color: #ccc;
  opacity: 1;
}
.tip_button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 10px;
}

.chat_item_box {
  width: 100%;
  max-height: calc(72vh - 120px);
  min-height: calc(72vh - 120px);
  margin-top: -75px;
  overflow: auto;
  background-color: #293266;
  display: flex;
  flex-direction: column;
  flex-flow: column;
  flex: 1;
  overflow-y: hidden;
}
.chat_item {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
.item_question {
  display: flex;
  justify-content: right;
  align-items: center;
  margin: 8px 10px;
  color: #b3b7cf;
  line-height: 1.2;
  font-size: small;
}
.question_content {
  max-width: 80%;
  height: auto;
  padding: 5px 10px;
  background-color: #3a4684;
  word-spacing: 1px;
  border-radius: 5px 0px 5px 5px;
  color: #f8f8f8;
  font-size: 13px;
}
.question_answer {
  max-width: 90%;
  background-color: #f8f8f8;
  border-radius: 0px 5px 5px 5px;
  line-height: 1.2;
  font-size: 13px;
  display: flex;
  margin-left: 30px;
  padding: 5px 10px;

}
.other_funcation_show,.other_funcation_hiddle{
    width:93%;
    min-height: 24px;
    background-color: #293266;
    margin-left: 30px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    visibility:visible;
    position: relative;
}
.other_funcation_hiddle{
    visibility: hidden;
}

.search_network{
    display: flex;
    justify-content: center;
    align-items: center;
    color:#8e8e94 ;
}
.search_des{
    cursor: pointer;
}
.copy_answer img{
    opacity: 0.7;
}
.copy_answer img:hover{
    opacity: 1;
}
.robot_icon {
  /* background-color: #fff; */
  margin: 5px;
  margin-left: 15px;
}
.make_question_box {
  width: 90%;
  overflow: auto;
  margin-left: 5%;
  margin-top: 10px;
  background-color: #3a4684;
  border-radius: 15px;
  /* margin-top: 10px; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
}
.question_box_head {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.question_box_head_left {
  width: auto;
  display: flex;
  margin-left: 15px;
  border-radius: 8px;
  margin-top: 15px;
  background-color: #4a589e;
}

.version_item_checked,.version_item_no_checked {
  width: 50px;
  min-height: 20px;
  background-color: #2ccb92;
  margin: 5px 3px;
  color: #e9f9f3;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: small;
  border-radius: 5px;
  cursor: pointer;
}
.version_item_no_checked {
 color: #aab1d1;
  background-color: #4a589e;
}
.version_item:hover,.version_item_no_checked:hover {
  background-color: #3a4684;
  color: #e9f9f3;
}
.question_box_head_right {
  margin-top: 15px;
  margin-right: 22px;
}
.el-icon-s-promotion {
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  color: #5a628c;
}
.el-icon-s-promotion:hover {
  background-color: #313b6f;
}
.question_input_box {
  width: 99%;
  height: 60px;
  min-height: 5 0px;
  overflow: hidden;
  margin-top: 5px;
  border-radius: 8px;
  background-color: #3a4684;
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>
<style>
.question_textarea {
  color: white;
  caret-color: #959cac;
  font-size: 16px;
  background-color: #3a4684 !important;
  overflow: auto;
  border: none;
  outline: none;
  resize: none;
  margin-top: 8px;
}
</style>