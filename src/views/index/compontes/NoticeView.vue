<template>
 <div>
  <div class="body-box">
    <div class="head-box">
      <!-- 一些功能按钮区域 -->
      <el-button type="info" size="mini" :class="selectButton[0]" @click="handleButtonChange(1)">线上公告</el-button>
      <el-button type="info" size="mini" :class="selectButton[1]"  @click="handleButtonChange(2)">历史公告</el-button>
      <el-button type="info" size="mini" class="noSelected"  @click="handleButtonChange(3)">添加公告</el-button>
    </div>
    <div class="content-box">
      <!-- 展示数据区域 -->
      <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      label="公告编号"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.$index+1 }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="内容"
      :show-overflow-tooltip="true"
      min-width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.content }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="排序"
      min-width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.sort }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="创建时间"
      min-width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="更新时间"
      min-width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.updateTime }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" min-width="160">
      <template slot-scope="scope">
        <el-button
          v-if="typeCode==1"
          size="mini"
          @click="handleFunButton(scope.$index,scope.row,'编辑')">编辑</el-button>
        <el-button
          v-if="typeCode==1"
          size="mini"
          type="danger"
          @click="handleFunButton(scope.$index,scope.row,'下线')">下线</el-button>
          <el-button
          v-if="typeCode==-1"
          size="mini"
          type="success"
          @click="handleFunButton(scope.$index,scope.row,'上线')">上线</el-button>
          <el-button
          v-if="typeCode==-1"
          size="mini"
          type="danger"
          @click="handleFunButton(scope.$index,scope.row,'删除')">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
    </div>
    <div style="display: flex;justify-content: center;">
      <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pageIndex"
        :page-sizes="[10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="parseInt(pageInfo.total)">
      </el-pagination>
  </div>
    </div>
    <el-dialog title="新增公告" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="公告内容" :label-width="formLabelWidth">
      <el-input v-model="form.content" autocomplete="off" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="优先级" :label-width="formLabelWidth">
      <el-input v-model="form.sort" autocomplete="off" type="number"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleDialogConfirm()">确 定</el-button>
  </div>
</el-dialog>

<el-dialog title="修改公告" :visible.sync="dialogFormVisibleOfEdit">
  <el-form :model="copyCurrentOperateNotice">
    <el-form-item label="公告内容" :label-width="formLabelWidth">
      <el-input v-model="copyCurrentOperateNotice.content" autocomplete="off" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="优先级" :label-width="formLabelWidth">
      <el-input v-model="copyCurrentOperateNotice.sort" autocomplete="off" type="number"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleOfEdit = false">取 消</el-button>
    <el-button type="primary" @click="handleEdit()">确 定</el-button>
  </div>
</el-dialog>
  </div>
  <myConfirmView v-if="isShowConfirmDialog" :title="confirmTitle" :content="confirmContent" :hanldeConfirmFuncation="handleConfiemDiaglogFunction"></myConfirmView>
 </div>
</template>

<script>
import {getNoticeApi,saveAPI,modifyAPI,deleteAPI} from "@/api/noticeApi.js"
import myConfirmView from "@/components/myConfirmView.vue";
import { mapState } from 'vuex';
  export default {
    components:{
      myConfirmView
    },
    async created(){
      this.init()
    },
    computed:{
      ...mapState(["isShowConfirmDialog"])
    },
    data() {
      return {
        tableData:[],
        selectButton:["selected","noSelected"],
        typeCode:1,
        pageIndex:1,
        pageSize:10,
        pageInfo:{},
        currentSelectedButtonIndex:1,
        dialogFormVisible:false,
        form:{
            content:"",
            sort:0
        },
        formLabelWidth:140,
        confirmTitle:"",
        confirmContent:"",
        currentOperateNotice:{},
        currentOperateNoticeIndex:0,
        dialogFormVisibleOfEdit:false,
        copyCurrentOperateNotice:{}, // 当前操作notice的备份
        handleConfiemDiaglogFunction:null,
        isOnline:false // 标识是否为修改公告状态为上线
      }
    },
    methods:{
      async handleEdit(){
        // 处理编辑公告
        let res = await modifyAPI(this.copyCurrentOperateNotice)
        if(!res) return;
        this.$message.success("修改成功")
        this.dialogFormVisibleOfEdit = false
        this.$set(this.tableData,this.currentOperateNoticeIndex,this.copyCurrentOperateNotice)
        this.init()
      },
      handleFunButton(index,notice,type){
          this.currentOperateNotice = notice
          this.currentOperateNoticeIndex = index
          this.copyCurrentOperateNotice = JSON.parse(JSON.stringify(this.currentOperateNotice))
          if(type == "编辑"){
            this.dialogFormVisibleOfEdit = true
          }
          else if(type == "下线"){
            this.confirmContent = "确定下线公告?"
            this.$store.commit("setIsShowConfirmDialog",true)
            this.copyCurrentOperateNotice.state = 0
            this.isOnline = true
            this.handleConfiemDiaglogFunction = this.handleConfiemDiaglogFunctionOfModify
          }
          else if(type == "上线"){
            this.confirmContent = "确定上线公告?"
            this.$store.commit("setIsShowConfirmDialog",true)
            this.copyCurrentOperateNotice.state = 1
            this.isOnline = false
            this.handleConfiemDiaglogFunction = this.handleConfiemDiaglogFunctionOfModify
          }
          else if(type == "删除"){
            this.confirmContent = "确定删除公告?删除后无法恢复"
            this.$store.commit("setIsShowConfirmDialog",true)
            this.handleConfiemDiaglogFunction = this.handleConfiemDiaglogFunctionOfDelete
          }
      },
      async handleConfiemDiaglogFunctionOfModify(){
        // 修改帖子回调函数
        let res = await modifyAPI(this.copyCurrentOperateNotice)
        if(!res) return;
        if(this.isOnline==true){
          this.$message.success("下线成功")
        }
        else{
          this.$message.success("上线成功")
        }
        // this.tableData.splice(this.currentOperateNoticeIndex,1)
        this.init()
      },
      async handleConfiemDiaglogFunctionOfDelete(){
        // 删除帖子回调函数
        let res = await deleteAPI(this.copyCurrentOperateNotice.id)
        if(!res) return;
        this.$message.success("删除成功")
        this.tableData.splice(this.currentOperateNoticeIndex,1)
      },
      handleCurrentChange(){

      },
      async handleDialogConfirm(){
          let res = await saveAPI(this.form)
          if(!res) return;
          this.$message.success("添加成功")
          this.dialogFormVisible = false
          this.form = {}
          this.init()
      },
      async init(){
        let res  = await getNoticeApi(this.pageIndex,this.pageSize,this.typeCode)
        if(!res) return;
        this.tableData = res.data.pageDataList
        this.pageInfo = res.data.pageInfo
      },
      handleButtonChange(index){
        if(this.currentSelectedButtonIndex==index){
          return;
        }
        if(index==1){
          this.$set(this.selectButton,0,"selected")
          this.$set(this.selectButton,1,"noSelected")
          this.tableData = []
          this.currentSelectedButtonIndex = 1
          this.typeCode = 1
          this.init()
        }
        else if(index == 2){
          this.$set(this.selectButton,1,"selected")
          this.$set(this.selectButton,0,"noSelected")
          this.tableData = []
          this.currentSelectedButtonIndex = 2
          this.typeCode = -1
          this.init()
        }
        else if(index == 3){
          this.dialogFormVisible = true
        }
      },
    }
  };
</script>
<style scoped lang="less">
  .body-box{
    width: 100%;
    // position: relative;
    top: 10px;
    left: 100px;
  }
  .head-box{
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;
    .el-button{
      margin: 10px;
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
  }
</style>