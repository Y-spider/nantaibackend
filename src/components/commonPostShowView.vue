<template>
  <!-- 通用展示帖子信息的组件 -->
  <div class="content-box">
      <div class="content-head">
          <!-- 搜索框 -->
        <el-input
          @change="handleSearch"
          placeholder="请输入搜索内容"
          prefix-icon="el-icon-search"
          style="margin-left:15px"
          v-model="search">
        </el-input>
        <!-- 过滤置顶帖子 -->
        <el-row >
          <el-button
          size="mini"
          type="info"
          :class="selectButton[0]"
          @click="handleButtonChange('全部',0)"
        >全部</el-button>
          <el-button
          size="mini"
          type="info"
          :class="selectButton[1]"
          @click="handleButtonChange('置顶帖子',1)"
        >置顶帖子</el-button>
        <el-button
          size="mini"
          type="info"
          :class="selectButton[2]"
          @click="handleButtonChange('已删除帖子',2)"
        >已删除帖子</el-button>
        <el-button
          size="mini"
          v-if="isShowTypeSecondFlag_1"
          type="info"
          :class="selectButton[3]"
          @click="handleButtonChange('买二手',3)"
        >买二手</el-button>
        <el-button
          size="mini"
          v-if="isShowTypeSecondFlag_1"
          type="info"
          :class="selectButton[4]"
          @click="handleButtonChange('卖二手',4)"
        >卖二手</el-button>
        <el-button
          size="mini"
          v-if="isShowTypeSecondFlag_2"
          type="info"
          :class="selectButton[5]"
          @click="handleButtonChange('兼职',5)"
        >兼职</el-button>
        <el-button
          size="mini"
          v-if="isShowTypeSecondFlag_2"
          type="info"
          :class="selectButton[6]"
          @click="handleButtonChange('招聘',6)"
        >招聘</el-button>
        </el-row>
        <el-select v-model="value" placeholder="请选择" @change="handleSelectChange" style="margin-left: 15px; width: 140px;"> 
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
      </el-select>
        <!-- 用于标识当前排序的标识码 0 " +
                    "创建时间升序（也是默认）1" +
                    " 创建时间降序 2 " +
                    "点赞数升序 3" +
                    " 点赞数降序 4"+
                    "浏览量升序 5"+
                    "浏览量降序 6"+
                    "评论数升序 7"+
                    "评论数降序 8" -->
      
      </div>
      <div class="content-body">
        <!-- body展示帖子信息表格 -->
    <el-table
    :data="tableData"
    resizable
    @expand-change="changeExpand"
    max-height="500px"
    border
    style="width: 99%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item v-if="props.row.imageCount" label="帖子图片:">
            <div v-if="props.row.imageCount>0"><img class="post-image" v-for="(item,index) in currentPostImageUrlList[props.$index]" :key="index" :src="item" 
            style="width: 64px; height: 64px; margin: 5px; background-repeat: no-repeat; background-size: cover;" @click="previewImage(item)"></div>
          </el-form-item>
          <el-form-item v-if="props.row.isTop==true" label="置顶剩余时间:" style="color:red;">
            <span v-if="currentPostExpireTimeOfDay!=0">{{ currentPostExpireTimeOfDay }}天{{ currentPostExpireTimeOfHour }}小时 {{ currentPostExpireTimeOfMintes }}分钟{{ currentPostExpireTimeOfSeconds }}秒</span>
            <span v-else-if="currentPostExpireTimeOfHour!=0">{{ currentPostExpireTimeOfHour }}小时 {{ currentPostExpireTimeOfMintes }}分钟{{ currentPostExpireTimeOfSeconds }}秒</span>
            <span v-else>{{currentPostExpireTimeOfMintes}}分钟{{ currentPostExpireTimeOfSeconds}}秒</span>
          </el-form-item>
          <el-form-item v-if="props.row.isDelete==true" label="恢复剩余时间:" style="color:red;">
            <span v-if="currentPostExpireTimeOfDay!=0">{{ currentPostExpireTimeOfDay }}天{{ currentPostExpireTimeOfHour }}小时 {{ currentPostExpireTimeOfMintes }}分钟{{ currentPostExpireTimeOfSeconds }}秒</span>
            <span v-else-if="currentPostExpireTimeOfHour!=0">{{ currentPostExpireTimeOfHour }}小时 {{ currentPostExpireTimeOfMintes }}分钟{{ currentPostExpireTimeOfSeconds }}秒</span>
            <span v-else>{{currentPostExpireTimeOfMintes}}分钟{{ currentPostExpireTimeOfSeconds}}秒</span>
          </el-form-item>
          <el-form-item v-if="type==''" label="帖子类型:">
            <span>{{ props.row.type }}</span>
          </el-form-item>
          <el-form-item label="帖子内容:">
            <span>{{ props.row.content }}</span>
          </el-form-item>
          <el-form-item label="更新操作人id:">
            <span>{{ props.row.updateUser }}</span>
          </el-form-item>
          <el-form-item label="创建时间:">
            <span>{{ props.row.createTime }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="帖子 ID"
      prop="id">
    </el-table-column>
    <el-table-column
      label="帖子标题"
      prop="title">
    </el-table-column>
    <el-table-column
      label="帖子内容"
      width="100">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>内容: {{ scope.row.content }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">帖子内容</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      label="联系方式"
      width="100">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>联系人: {{ scope.row.contactor }}</p>
          <p>微信: {{ scope.row.wechat }}</p>
          <p>qq: {{ scope.row.qq }}</p>
          <p>电话: {{ scope.row.phone }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">联系方式</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      label="用户信息"
      width="100">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>openid: {{ scope.row.openid }}</p>
          <p>头像: 
            <img :src="$baseImageUrl + scope.row.avatar" alt="头像" width="32px" height="32px">
          </p>
          <p>名称: {{ scope.row.name }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">用户信息</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      label="图片数量"
      prop="imageCount">
    </el-table-column>
    <el-table-column
      label="点赞数"
      prop="likeCount">
    </el-table-column>
    <el-table-column
      label="评论数"
      prop="commentCount">
    </el-table-column>
    <el-table-column
      label="浏览量"
      prop="lookCount">
    </el-table-column>
    <el-table-column
      v-if="isDelete==true && currentShowPostType =='已删除帖子'"
      label="删除时间"
      prop="updateTime">
    </el-table-column>
    <el-table-column
      v-else  
      label="更新时间"
      prop="updateTime">
    </el-table-column>
    <el-table-column
      label="帖子类型"
      prop="type">
    </el-table-column>
    <el-table-column
      v-if="isDelete==true && currentShowPostType =='已删除帖子'"
      min-width="140"
      label="操作">
      <template slot-scope="scope">
        <el-button
            size="mini"
            type="primary"
            @click="handleRecovery(scope.row,scope.$index,)">恢复</el-button>
        <el-button
            size="mini"
            type="danger"
            @click="handlePhysicalDelete(scope.row,scope.$index,)">完全删除</el-button>
      </template>
    </el-table-column>
    <el-table-column v-if="isDelete==false"  label="置顶" width="80px" style="display:flex;justify-content:center;align-items:center;">
      <template slot-scope="scope" v-if="scope.row.isDelete==false">
        <el-button
          size="mini"
          v-if="scope.row.isTop == false"
          @click="handleTop(scope.row,scope.$index,0)">置顶</el-button>
        <el-button
          size="mini"
          v-else
          type="danger"
          @click="handleTop(scope.row,scope.$index,1)">取消</el-button>
      </template>
    </el-table-column>
    <el-table-column v-if="isDelete==false"  fixed="right" width="240x" label="操作" style="display:flex;">
      <template slot-scope="scope" v-if="scope.row.isDelete==false" >
        <el-button
          size="mini"
          type="primary"
          @click="handleEdit(scope.row,scope.$index,)">编辑</el-button>
          <el-button
          v-if="scope.row.state==1"
          size="mini"
          type="danger"
          @click="handRemove(scope.row,1)">下架</el-button>
          <el-button
          v-else
          size="mini"
          type="success"
          @click="handRemove(scope.row,2)">上架</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDeletePost(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
      </div>
      <div class="contenx-box">
        <div class="block">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[5,10,20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="parseInt(pageInfo.total)">
        </el-pagination>
        </div>
    </div>
    <el-dialog title="" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="时间单位" :label-width="formLabelWidth">
          <el-select v-model="timeUnitValue">
            <el-option
              v-for="item in timeUnitOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <lable>时间</lable>
          <div class="block">
            <el-slider
              v-model="timeValue"
              show-input>
            </el-slider>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
      <el-button @click="changeTopDialog(0)">取 消</el-button>
    <el-button type="primary" @click="changeTopDialog(1)">确 定</el-button>
  </div>
</el-dialog>
<!-- 修改帖子信息弹框 -->
<el-dialog title="" :visible.sync="dialogFormVisibleOfModifyPost">
      <el-form :model="formOfModifyPost">
        <el-form-item label="评论状态" :label-width="formLabelWidth">
          <el-switch
            v-model="formOfModifyPost.openComment"
            active-text="开启评论"
            inactive-text="关闭评论">
          </el-switch>
        </el-form-item>
        <el-form-item label="帖子标题：" :label-width="formLabelWidth">
          <el-input v-model="formOfModifyPost.title" placeholder="请输入标题" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="帖子内容：" :label-width="formLabelWidth">
          <el-input
          type="textarea"
          autosize
          placeholder="请输入内容"
          v-model="formOfModifyPost.content">
        </el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <div style="display: flex; justify-content: space-around;">
            <div>
              <lable>联系人:</lable>
              <br/>
            <el-input v-model="formOfModifyPost.contactor" style="width: 80%;">
            </el-input>
            </div>
            <div>
              <lable>电话:</lable>
              <br/>
            <el-input v-model="formOfModifyPost.phone" style="width: 80%;">
            </el-input>
            </div>
            <div>
              <lable>微信:</lable>
              <br/>
            <el-input v-model="formOfModifyPost.wechat" style="width: 80%;">
            </el-input>
            </div>
            <div>
              <lable>qq:</lable>
              <br/>
            <el-input v-model="formOfModifyPost.qq" style="width: 80%;">
            </el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item >
            <!-- 帖子图片展示区域 ,可以进行图片的增加和删除-->
            <label>帖子图片：</label>
          <div class="post-imgae-show-box">
            <div  class="img-show-box" style="display:flex; flex-wrap: wrap; width: 100%; margin:0 5px;" >
              <div v-for="(url,index) in modifyPostShowImageList" :key="index" @mouseenter="handPostImageMouseEnter(index,0)" @mouseleave="handPostImageMouseLeave(index,0)">
                <!-- 这个img展示的原来帖子用户上传的图片 -->
                <img  style="width: 60px; height: 60px; margin:0 5px;" :src="$baseImageUrl+url+'?time=' + new Date().getTime()" @click="previewImage($baseImageUrl+url+'?time=' + new Date().getTime())">
                <i :class="deleteIconClassNameList[index]" style="position: relative;left:-5px;" @click="handleDeletePostImage(index,0)"></i>
              </div>
              <div v-for="(url,index) in needUploadPostImageList" :key="index" @mouseenter="handPostImageMouseEnter(index,1)" @mouseleave="handPostImageMouseLeave(index,1)">
                <!-- 这个img展示的原来帖子用户上传的图片 -->
                <img  style="width: 60px; height: 60px; margin:0 5px;" :src="url"  @click="previewImage(url)">
                <i :class="deleteIconClassNameList[modifyPostShowImageList.length+index]" style="position: relative;left:-5px;"  @click="handleDeletePostImage(index,1)"></i>
              </div>
              <el-upload
                class="avatar-uploader"
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :limit="9"
                :multiple="true"
                :on-change="handleImageUploadChange"
                :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
      <el-button @click="handlePostModify(formOfModifyPost,0)">取 消</el-button>
    <el-button type="primary" @click="handlePostModify(formOfModifyPost,1)">修 改</el-button>
  </div>
</el-dialog>
<image-show-modal-view-vue v-if="isPreviewPostImage" :url="previewImageUrl"  style="position: absolute; z-index: 9999;"></image-show-modal-view-vue>
<my-confirm-view v-if="isShowConfirmDialog" :title="confirmDialogTitle" :content="confirmDialogContent" :hanldeConfirmFuncation="confirmDialogConfirmFuncatiom" ></my-confirm-view>
</div>
</template>
<script>
import { 
  getPostByTypeWithPageAPI,
  getPostImagByPostIdAPI,
  getTopPostByPostIdAPI,
  modifyPostBatchAPI,
  setPostTopAPI,
  cancelTopPostAPI,
  modifyPostInfoAPI,
  deletePostByPostIdAPI,
  recoveryPostAPI,
  physicalDeletePostByHandAPI
} from '@/api/postApi';

import {getDeletePostDelayDayAPI} from "@/api/commonApi.js"
import imageShowModalViewVue from './imageShowModalView.vue';
import myConfirmView from './myConfirmView.vue';
import { mapState } from 'vuex';
export default {
    props:["type"],
    name:"PostShowView",
    components:{
      imageShowModalViewVue,
      myConfirmView
    },
    async created(){
      let now = new Date()
      // 创建组件是，请求接口获取帖子数据
      // 请求参数  pageIndex,pageSize,type,typeSecond,isTop,isDelete,sortCode,search
      let res = await getPostByTypeWithPageAPI(this.pageIndex,this.pageSize,this.type,"","","",1,"")
      if(!res) return;
      this.tableData = res.pageDataList
      this.pageInfo = res.pageInfo
      this.getPostImage()
      // 判断type，动态判断需不需要显示二级分类
      if(this.type=="二手闲置"){
        this.isShowTypeSecondFlag_1 = true
      }
      else if(this.type == "兼职招聘"){
        this.isShowTypeSecondFlag_2 = true
      }
    },
    data(){
        return {
          search:"",
          tableData:[],
          pageIndex:1,
          pageSize:10,
          pageInfo:"",
          currentPostImageUrlList:[],
          changeExpandFlag:false, // 标识当前处于展开状态列表的下标
          currentPostExpireTimeOfDay: 0,
          currentPostExpireTimeOfHour: 0,
          currentPostExpireTimeOfMintes: 0,
          currentPostExpireTimeOfSeconds: 0,
          intervalT:null, // 存储定时器
          isTop:"",
          isDelete:"",
          isShowTypeSecondFlag_1:false, //标识是否显示二手闲置 二级分类
          isShowTypeSecondFlag_2:false, // 标识是否显示兼职招聘 二级分类
          currentShowPostType:"全部", // 标识当前显示的状态  初始默认为 全部 ,取值可以为  置顶帖子  已删除帖子  买二手 卖二手  兼职 招聘
          options:[
          {label:"创建时间升序",value:1},
          {label:"创建时间降序",value:2},
          {label:"更新时间降序",value:9},
          {label:"更新时间升序",value:10},
          {label:"点赞数升序",value:3},
          {label:"点赞数降序",value:4},
          {label:"浏览量升序",value:5},
          {label:"浏览量降序",value:6},
          {label:"评论数升序",value:7},
          {label:"评论数降序",value:8}
          ],
          value:"创建时间升序",
          sortCode:1,
          selectButton:["selected","noSelected","noSelected","noSelected","noSelected","noSelected","noSelected"],
          currentSelectedButtonIndex:0,
          typeSecond:"",
          isTop:"",
          isDelete:"",
          dialogFormVisible:false,
          form:{},
          timeUnitOptions:[{label:"小时",value:1},{label:"天",value:2}],
          timeUnitValue:1,
          timeValue:0,
          currentOperatePost:0,
          currentOperatePostIndex:0,
          formLabelWidth:"220",
          dialogFormVisibleOfModifyPost:false,
          formOfModifyPost:{
          },
          modifyPostShowImageList:[], // 在修改帖子信息弹框中存储的图片信息列表
          needUploadPostImageList:[], // 需要上传图片数据
          needDeletePostImageList:[], // 需要删除的图片url
          deleteIconClassNameList:[], // 用于控制图片中删除按钮的显示与隐藏
          previewImageUrl:"",
          confirmDialogTitle:"",
          confirmDialogContent:"",
          confirmDialogConfirmFuncatiom:"" // 弹出对话框确认的回调函数
        } 
    },
    computed:{
      ...mapState(["isPreviewPostImage","isShowConfirmDialog","confirmDialogIsConfirm"]) 
    },
    methods:{
      handlePhysicalDelete(post,index){
          this.confirmDialogTitle = "是否手动删除？"
          this.confirmDialogContent = "删除后所有记录将清空，无法找回，是否继续删除?"
          this.$store.commit("setIsShowConfirmDialog",true)
          this.confirmDialogConfirmFuncatiom = this.handlePhysicalDeleteConfirmFunction
          this.currentOperatePost = post
          this.currentOperatePostIndex = index
      },
      async handlePhysicalDeleteConfirmFunction(){
          let res = await physicalDeletePostByHandAPI(this.currentOperatePost.openid,this.currentOperatePost.id)
          if(!res) return;
          this.tableData.splice(this.currentOperatePostIndex,1)
          this.$message.success("删除成功")
      },
      handleRecovery(post,index){
          // 在帖子完全删除之前，恢复帖子
          this.confirmDialogTitle = "恢复"
          this.confirmDialogContent = "确定恢复?"
          this.$store.commit("setIsShowConfirmDialog",true)
          this.confirmDialogConfirmFuncatiom = this.handleRecoveryConfirmFunction
          this.currentOperatePost = post
          this.currentOperatePostIndex = index
      },
      async handleRecoveryConfirmFunction(){
          let res = await recoveryPostAPI(this.currentOperatePost.id,this.currentOperatePost.openid)
          if(!res) return;
          this.currentOperatePost.isDelete = false
          this.tableData.splice(this.currentOperatePostIndex,1)
          this.$message.success("恢复成功")
      },
      handleDeletePost(index,post){
        this.confirmDialogTitle = "删除"
        this.confirmDialogContent = "确认删除？删除后15天可以恢复!!!"
        this.$store.commit("setIsShowConfirmDialog",true)
        this.currentOperatePost = post
        this.currentOperatePostIndex = index
        this.confirmDialogConfirmFuncatiom = this.hanldeConfirmFuncation
      },
     async hanldeConfirmFuncation (){
        if(this.$store.state.confirmDialogIsConfirm){
          let res = await deletePostByPostIdAPI({id:this.currentOperatePost.id,openid:this.currentOperatePost.openid})
          if(!res) return;
          this.currentOperatePost.isDelete = true
          this.tableData.splice(this.currentOperatePostIndex,1)
          this.$message.success("删除成功")
        }
      },
      async handlePostModify(post,typeCode){
        if(typeCode == 0){
          this.needDeletePostImageList = []
          this.needUploadPostImageList = []
          this.dialogFormVisibleOfModifyPost = false
          retrun;
        }
        // 发起请求进行修改帖子信息
        // 构建需要传输的数据
        let postData = {
          id:post.id,
          openid:post.openid,
          openComment:post.openComment,
          title:post.title,
          content:post.content,
          contactor:post.contactor,
          phone:post.phone,
          wechat:post.wechat,
          qq:post.qq,
          needSaveImageBase64DataList:this.needUploadPostImageList,
          needDeleteImageUrlList:this.needDeletePostImageList,
          imageCount:post.imageCount
        }
        let res = await modifyPostInfoAPI(postData)
        if(!res) return;
        this.$message.success("修改成功")
        post.imageCount +=(this.needUploadPostImageList.length-this.needDeletePostImageList.length)
        this.needDeletePostImageList = []
        this.needUploadPostImageList = []
        this.dialogFormVisibleOfModifyPost = false
      },
      handleDeletePostImage(index,typeCode){
          // 处理删除图片 typeCode == 0 表示删除的是原来帖子就有的图片  typeCode = 1 表示删除的是管理员上传的图片
          if(typeCode==0){
            this.$set(this.needDeletePostImageList,this.needDeletePostImageList.length,this.modifyPostShowImageList[index])
            this.modifyPostShowImageList.splice(index,1)
          }
          else{
            this.needUploadPostImageList.splice(index,1)
          }
      },
      previewImage(url){
        this.previewImageUrl = url
        // 更改store中的isPreviewPostImage状态，显示预览图片
        this.$store.commit("setIsPreviewPostImage",true)
      },
      judgeImageType(index){
        console.error("index",index)
        // 该函数的作用为判断出当前图片是用户上传的帖子图片还是后台管理人员上传的图片
        if(index < (this.modifyPostShowImageList.length-this.needUploadPostImageList)){
          // 说明是帖子用户上传的图片
          return true
        }
        return false
      },
      handleImageUploadChange(file,fileList){
        // 判断是否已经到达图片上传的最大上线，如果到达，则不进行处理
        if(this.modifyPostShowImageList.length == 9){
          console.warn("图片数量溢出")
          retrun;
        }
        fileList.splice(0,1)
        console.log("获取的fileList",fileList)
        console.log("获取的file",file)
        let that = this
        let reader = new FileReader()
        reader.readAsDataURL(file.raw)
        reader.onload  = function(event){
          console.log(event)
          let img_base64 = this.result
          // 将图片信息存放在需要上传的图片存储列表中
          that.$set(that.needUploadPostImageList,that.needUploadPostImageList.length,img_base64)
          that.$set(that.deleteIconClassNameList,that.deleteIconClassNameList.length,"el-icon-delete-solid delete-icon-hiddle")
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      handPostImageMouseLeave(index,typeCode){
        // 隐藏删除icon
        if(typeCode==0){
          this.$set(this.deleteIconClassNameList,index,"el-icon-delete-solid delete-icon-hiddle")
        }
        else{
          this.$set(this.deleteIconClassNameList,this.modifyPostShowImageList.length+index,"el-icon-delete-solid delete-icon-hiddle")
        }
      },
      handPostImageMouseEnter(index,typeCode){
          // 显示删除icon
          if(typeCode==0){
            this.$set(this.deleteIconClassNameList,index,"el-icon-delete-solid delete-icon-show")
          }
          else{
            this.$set(this.deleteIconClassNameList,this.modifyPostShowImageList.length + index,"el-icon-delete-solid delete-icon-show")
          }
          
          
      },
      async handleEdit(post,index){
        // 初始化帖子图片列表
        this.modifyPostShowImageList = []
        // 处理修改帖子信息
        this.dialogFormVisibleOfModifyPost = true
        this.formOfModifyPost = post
        // 如果该帖子有图片，则请求服务器获取图片url
        if(post.imageCount > 0){
            let res = await getPostImagByPostIdAPI(post.id)
            if(!res) return;
            this.modifyPostShowImageList = res.data
            for(let i = 0;i < post.imageCount;i++){
              this.$set(this.deleteIconClassNameList,i,"el-icon-delete-solid delete-icon-hiddle")
            }
        }
        console.log("formOfModifyPost",this.formOfModifyPost)
      },
      async handleTop(post,index,typeCode){
        if(post.state==0 && typeCode==0){
          this.$message.warning("请先上架帖子")
          return
        }
        this.currentOperatePost = post
        if(typeCode == 0){
        this.dialogFormVisible = true
       }
       else if(typeCode == 1){
          // 表示是取消置顶操作
          let res = await cancelTopPostAPI(post.id)
          if(!res) return;
          post.isTop = false
          // 将取消的记录移除当前渲染的列表
          this.tableData.slice(index,1)
          this.pageInfo.total-=1
          this.$message.success(res.data)
       }
      },
      async changeTopDialog(typeCode){
          if(typeCode==0){
          this.dialogFormVisible = false
          }
          else{
            // 表示进行置顶
            if(this.timeValue == 0){
              this.$message.warning("置顶时间不能为0")
              return
            }
            if(!Number.isInteger(this.timeValue)){
              this.$message.warning("置顶时间应该为整数")
              return
            }
            let calcTimeValue = this.timeValue
            if(this.timeUnitValue == 2){
              calcTimeValue = this.timeValue*24
            }
            let postData = {
              id:this.currentOperatePost.id,
              time:calcTimeValue
            }
           let res = await setPostTopAPI(postData)
           if(!res) return;
           this.$message.success("置顶成功")
           this.currentOperatePost.isTop = true
           this.timeValue = 0
           this.dialogFormVisible = false
          }
      },
      async handRemove(post,type){
        let modifyPostData = []
          if(type==1){
            // 表示上架
            modifyPostData[0] = {
              id:post.id,
              state:0
            }
          }
          else if(type==2){
            // 表示下架
            modifyPostData[0] = {
              id:post.id,
              state:1
            }
          }
          else{
            // 表示参数错误
            this.$message.danger("参数错误")
            return;
          }
          let res = await modifyPostBatchAPI(modifyPostData)
          if(!res) return;
          this.$message.success(res.data)
          post.state==0?post.state=1:post.state=0
      },
      handleSearch(){
        this.init()
      },
      async init(pageIndex){
        //请求参数  pageIndex,pageSize,type,typeSecond,isTop,isDelete,sortCode,search
        if(pageIndex==undefined){
          pageIndex = this.pageIndex
        }
        let res = await getPostByTypeWithPageAPI(pageIndex,this.pageSize,this.type,this.typeSecond,this.isTop,this.isDelete,this.sortCode,this.search)
        if(!res) return;
        this.tableData = res.pageDataList
        this.pageInfo = res.pageInfo
        this.getPostImage()
      },
      handleSelectChange(value){
          this.sortCode = value
          this.init()
      },
      handleButtonChange(type,index){
       // 根据type的值来进行查询
       if(this.currentShowPostType!=type){
        // 让按钮状态进行修改
        this.$set(this.selectButton,index,"selected")
        this.$set(this.selectButton,this.currentSelectedButtonIndex,"noSelected")
        this.currentSelectedButtonIndex = index
        this.currentShowPostType = type 
        // 根据不同的条件发起不同的请求
        if(this.currentShowPostType == "全部"){
          this.isDelete = ""
          this.isTop = ""
          this.typeSecond = ""
        }
        else if(this.currentShowPostType == "置顶帖子"){
          this.isDelete = ""
          this.isTop = true
          this.typeSecond = ""
        }
        else if(this.currentShowPostType == "已删除帖子"){
          this.isDelete = true
          this.isTop = ""
          this.typeSecond = ""
        }
        else if(this.currentShowPostType == "买二手"){
          this.isDelete = ""
          this.isTop = ""
          this.typeSecond = "buy"
        }
        else if(this.currentShowPostType == "卖二手"){
          this.isDelete = ""
          this.isTop = ""
          this.typeSecond = "sell"
        }
        else if(this.currentShowPostType == "兼职"){
          this.isDelete = ""
          this.isTop = ""
          this.typeSecond = "rent"
        }
        else if(this.currentShowPostType == "招聘"){
          this.isDelete = ""
          this.isTop = ""
          this.typeSecond = "recruit"
        }
        this.init() 
       }
      },
      changeExpand(post){
        this.changeExpandFlag = !this.changeExpandFlag
        if(this.intervalT!=null || !this.changeExpandFlag){
          clearInterval(this.intervalT)
        }
        if(post.isTop){
          this.calcExpireTime(post.id)
        }
        else if(post.isDelete){
          // 计算距离完全删除的时间
          this.calcPhysicalPostDeleteTime(post.updateTime)
        }
      },
      handleSizeChange(value){
        this.pageSize = value
        this.init()
      },
      handleCurrentChange(value){
        this.pageIndex = value
        this.init()
      },
      async getPostImage() {
        this.currentPostImageUrlList = []
        for (let post of this.tableData) {
          try {
            if (post.imageCount === 0) {
              this.$set(this.currentPostImageUrlList, this.currentPostImageUrlList.length, []);
            } else {
              let res = await getPostImagByPostIdAPI(post.id);
              if (res.data.length === 0) {
                this.$set(this.currentPostImageUrlList, this.currentPostImageUrlList.length, []);
              } else {
                let imageUrls = res.data.map(url => this.$baseImageUrl + url);
                this.$set(this.currentPostImageUrlList, this.currentPostImageUrlList.length, imageUrls);
              }
            }
          } catch (error) {
            console.error('Error fetching post images:', error);
            // 这里可以添加更多的错误处理逻辑，比如通知用户
          }
  }
      },
      async calcExpireTime(postId){
        // 计算置顶帖子的过期时间
        let res = await getTopPostByPostIdAPI(postId)
        if(!res) return;
        // 开始计算过期时间
        let now = new Date()
        let expireTime = new Date(res.data.expireTime)
        let differTime = expireTime - now  // 时间差为ms
        let differOfDay = Math.floor(differTime/(1000*60*60*24))
        let differOfHour = Math.floor((differTime - differOfDay*(1000*60*60*24))/(1000*60*60))
        let differOfMintes = Math.floor((differTime - (differOfDay*24+differOfHour)*1000*60*60)/(1000*60))        
        this.currentPostExpireTimeOfDay  = differOfDay
        this.currentPostExpireTimeOfHour = differOfHour
        this.currentPostExpireTimeOfMintes = differOfMintes
        

        this.currentPostExpireTimeOfSeconds = 0
         // 确保视图更新
    this.$nextTick(() => {
      console.log(this.currentPostExpireTimeOfMintes); // 现在应该正确显示值
      this.countDown()
    });
      },
    async calcPhysicalPostDeleteTime(deleteTime){
      // 计算已经删除帖子距离完全删除剩余的时间（默认是15天的缓存时间,如果后端改变，前端也应该改变)
      let res = await getDeletePostDelayDayAPI()
      if(!res) return;
      let delayDay = res.data
      
      // 开始计算彻底时间
        let now = new Date()
        let expireTime = new Date(deleteTime)
        expireTime.setDate(expireTime.getDate()+delayDay)
        let differTime = expireTime - now  // 时间差为ms
        let differOfDay = Math.floor(differTime/(1000*60*60*24))
        let differOfHour = Math.floor((differTime - differOfDay*(1000*60*60*24))/(1000*60*60))
        // console.log("hour",differOfHour)
        let differOfMintes = Math.floor((differTime - (differOfDay*24+differOfHour)*1000*60*60)/(1000*60))
        this.currentPostExpireTimeOfDay  = differOfDay
        this.currentPostExpireTimeOfHour = differOfHour
        this.currentPostExpireTimeOfMintes = differOfMintes
        // console.log("mintues",this.currentPostExpireTimeOfMintes)
        this.currentPostExpireTimeOfSeconds = 0
         // 确保视图更新
      this.$nextTick(() => {
        console.log(this.currentPostExpireTimeOfMintes); // 现在应该正确显示值
        this.countDown()
      });
    },

  countDown() {
   this.intervalT = setInterval(() => {
    if (this.currentPostExpireTimeOfDay === 0 &&
    this.currentPostExpireTimeOfHour === 0 &&
    this.currentPostExpireTimeOfMintes === 0 &&
    this.currentPostExpireTimeOfSecondes === 0) {
      clearInterval(this.intervalT);
      // 倒计时结束时的逻辑
    } else {
      // 更新倒计时
      if(this.currentPostExpireTimeOfSeconds===0){
        if(this.currentPostExpireTimeOfMintes!=0){
          this.currentPostExpireTimeOfMintes--
          this.currentPostExpireTimeOfSeconds=60
        }
        else{
          if(this.currentPostExpireTimeOfHour!=0){
            this.currentPostExpireTimeOfHour--
            this.currentPostExpireTimeOfMintes = 59
            this.currentPostExpireTimeOfSeconds = 60
          }
          else{
            if(this.currentPostExpireTimeOfDay!=0){
              this.currentPostExpireTimeOfDay--
              this.currentPostExpireTimeOfHour = 23
              this.currentPostExpireTimeOfMintes = 59
              this.currentPostExpireTimeOfSeconds = 60
            }
          }
        }
      }
      this.currentPostExpireTimeOfSeconds-=1
      console.log(this.currentPostExpireTimeOfSeconds)
    }
  },1000); // 1s执行一次
}
  }
}
</script>

<style scoped>
  .content-box{
    width: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .content-body{
      width: 100%;
      margin-top: 15px;
    }
  .content-head{
      width: 100%;
      display: flex;
      margin: 15px 0px;
    }
  .el-input{
        width: 15%;
      }
  .demo-table-expand .el-form-item{
    display: block;
  }
  .contenx-box{
        display: flex;
        justify-content: center;
        align-content: center;
        margin-top: 15px;
    }
    .el-form{
      margin-left:30px ;
    }
    .cell{
      font-weight: bolder !important;
      font-size: 18px;
    }
    .post-image:hover{
      width: 160px;
      height: 160px;
    }
    .ershou-type-sesond{
      height: 100%;
      display: flex;
      justify-content: center;
     
      align-items: center;
    }
    .selected{
      background-color: #909399;
      margin-left:10px;
      border:none;
      color: white;
    }
    .noSelected{
      border:none;
      background-color: #f4f4f5;
      color:#909399;
      margin-left:10px;
    }
    .noSelected:hover{
      background-color: #909399;
      margin-left:10px;
      color: white;
      border:none;
    }

    .post-imgae-show-box{
      border: 1px solid dashed;
    }

    .avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
   .avatar-uploader-icon:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    border: 3px dashed #d9d9d9;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
 
  .avatar{
    width: 60px;
    height: 60px;
    display: block;
    border: 1px solid #ccc;
  }
  .el-icon-delete-solid{
    cursor: pointer;
  }
  .el-icon-delete-solid:hover{
    color:lightcoral;
  }
  .delete-icon-show{
    visibility: show;
  }
  .delete-icon-hiddle{
    visibility: hidden;
  }
  img:hover{
    cursor: pointer;
  }
</style>