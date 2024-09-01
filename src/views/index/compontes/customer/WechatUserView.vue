<template>
  <div class="content-box">
    <!-- 微信端用户的管理 -->
    <div class="search-box">
      <el-input
        @change="searchUser"
        placeholder="请输入用户名称/用户id"
        prefix-icon="el-icon-search"
        clearable
        v-model="search">
      </el-input>
      </div>
      <div class="table-box">
      <el-table
      :data="tableData"
      style="width: 100%"
      >
      <el-table-column
        label="用户id"
        width="260">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.openid }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户昵称"
        width="140">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <p size="medium">{{ scope.row.name }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="头像"
        width="140">
        <template slot-scope="scope">
          <img class="avatar" :src="$baseImageUrl + scope.row.avatar+'?timestamp='+ new Date().getTime()" />
        </template>
      </el-table-column>
      <el-table-column
        label="积分"
        width="140">
        <template slot-scope="scope">
          <p>{{ scope.row.point }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="发帖上限"
        width="140">
        <template slot-scope="scope">
          <p>{{ scope.row.totalPost }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="今日剩余发帖数"
        width="140">
        <template slot-scope="scope">
          <p>{{ scope.row.todayPost }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            v-if="scope.row.status==1"
            @click="handleDelete(scope.$index, scope.row)">禁用</el-button>
            <el-button
            size="mini"
            type="success"
            v-if="scope.row.status==0"
            @click="handleDelete(scope.$index, scope.row)">启用</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="创建时间"
        width="140">
        <template slot-scope="scope">
          <p>{{ scope.row.createTime }}</p>
        </template>
      </el-table-column> -->
      <el-table-column
        label="更新时间"
        width="140">
        <template slot-scope="scope">
          <p>{{ scope.row.updateTime }}</p>
        </template>
      </el-table-column>
    </el-table>
    </div>
      <div class="page-info-block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[5,10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageInfo.total">
        </el-pagination>
    </div>
    <el-dialog :title="form.openid" :visible.sync="dialogFormVisible">
      <el-form :model="form">
      <el-form-item label="昵称：" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="积分：" :label-width="formLabelWidth">
        <el-input v-model="form.point" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="总上限：" :label-width="formLabelWidth">
        <el-input v-model="form.totalPost" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="今日上限：" :label-width="formLabelWidth">
        <el-input v-model="form.todayPost" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="修改头像：" :label-width="formLabelWidth">
        <el-upload
        class="avatar-uploader"
        action=""
        :auto-upload="false"
        :limit="1"
        :show-file-list="false"
        :on-change="handleChange"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="账号备注" :label-width="formLabelWidth">
        <el-input v-model="form.remark" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" :label-width="formLabelWidth">
        <el-input disabled v-model="form.createTime" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel(true)">取 消</el-button>
        <el-button type="primary" @click="submitMofifyUserInfo">确 定</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import { getWechatUserAPI,modifyWechatUserInfoAPI} from '@/api/userApi'
export default {
  async created(){
    let res = await getWechatUserAPI(this.pageIndex,this.pageSize,this.search)
    if(res==false){
      return;
    }
    this.tableData = res.pageDataList
    this.pageInfo = res.pageInfo
    this.pageInfo.total = parseInt(this.pageInfo.total)
  },
  data(){
    return{
      imageUrl:"",
      search:"",
      pageIndex:1,
      pageSize:10,
      pageInfo:null,
      tableData: [],
      copyNowTableData:null, // 存储修改用户信息前的用户信息状态
      nowTableDataIndex:0,
      dialogFormVisible:false,
      form: {
         
      },
      formLabelWidth: '100px',
    }
  },
  methods:{
    handleCancel(flag){
      if(flag==true){
        // 表示需要将用户信息进行恢复
        this.$set(this.tableData,this.nowTableDataIndex,this.copyNowTableData)
      }
      this.dialogFormVisible = false
    },
    async submitMofifyUserInfo(){
      // 构建需要更新上传的对象
      this.tableData[this.nowTableDataIndex].avatar = this.imageUrl
      let res = await modifyWechatUserInfoAPI(this.tableData[this.nowTableDataIndex])
      if(!res){
        // 说明更新失败
        this.handleCancel(true)
        return;
      }
      else{
        this.$message.success("更新成功")
        this.tableData[this.nowTableDataIndex].avatar = this.copyNowTableData.avatar
        this.dialogFormVisible = false
      }

    },
  handleSizeChange(newPageSize){
      this.pageSize = newPageSize
  },
  async handleCurrentChange(pageIndex){
    this.pageIndex = pageIndex
    let res = await getWechatUserAPI(this.pageIndex,this.pageSize,this.search)
          if(!res) return;
          this.tableData = res.pageDataList
  },
  async searchUser(){
    this.pageIndex = 1
    let res = await getWechatUserAPI(this.pageIndex,this.pageSize,this.search)
    if(res==false) return;
    this.tableData = res.pageDataList
    this.pageInfo = res.pageInfo
    this.pageInfo.total = parseInt(this.pageInfo.total)
  },

  handleEdit(index,userData){
    this.dialogFormVisible = true
    this.form = userData
    this.nowTableDataIndex = index
    this.copyNowTableData = JSON.parse(JSON.stringify(this.tableData[index]))
    this.imageUrl = this.$baseImageUrl + userData.avatar +'?timestamp='+ new Date().getTime()
  },

  handleDelete(index,userData){
    console.log("index",index)
    console.log("userData",userData)
    console.log(this.tableData[index].status)
    this.tableData[index].status==1?this.tableData[index].status=0:this.tableData[index].status=1
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

  handleAvatarSuccess(res, file) {
        console.log("res",res)
        console.log("file",file)
        this.imageUrl = URL.createObjectURL(file.raw);
      },
  handleChange(file,fileList){
    fileList.splice(0,1)
    console.log("获取的fileList",fileList)
    console.log("获取的file",file)
    let that = this
    let reader = new FileReader()
    reader.readAsDataURL(file.raw)
    reader.onload  = function(event){
      console.log(event)
      let img_base64 = this.result
      that.imageUrl = img_base64
    }
  },
    
  },
  watch:{
      pageSize:{
        immediate:true,
        async handler(oldValue,newValue){
          // 访问服务器，获取新的用户数据
          this.pageIndex = 1
          let res = await getWechatUserAPI(this.pageIndex,this.pageSize,this.search)
          if(!res) return;
          this.tableData = res.pageDataList
        }
      }    
  }
}
</script>

<style scoped lang="less">
  .content-box{
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .search-box{
    width: 200px;
    margin: 10px;
  }
  .page-info-block{
    display: flex;
    justify-content: center;
    align-content: center;
  }
  .table-box{
    border: 2px solid #ccc;
    margin-top: 10px;
    .avatar{
      width: 32px;
      height: 32px;
      border-radius: 5px;
    }
  }
  .el-dialog{
    width: 400px;
    .el-form-item{
      width: 80%;
    }
    .el-form-item el-form-item--small{
      width: 100%;
      display: flex;
      flex-direction: column;
    }
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  } 
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
</style>