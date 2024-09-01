<template>
  <div class="content">
   <div class="button-box">
      <el-button style="background-color:lightblue">
        <i class="el-icon-plus"></i>
        添加用户
      </el-button>
   </div>
   <div class="table-box">
    <el-table
    :data="tableData"
    max-height="250"
    over
    style="width: 100%">
    <el-table-column
      label="账号"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.account }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="密码"
      width="180">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>{{ scope.row.passwd }}</p>

          <div slot="reference" class="name-wrapper">
            <span style="margin-left: 10px">密码</span>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      label="头像"
      width="180">
      <template slot-scope="scope">
        <img :src="$baseImageUrl + scope.row.avatar+'?timestamp='+ new Date().getTime()" alt="头像" width="32px" height="32px" style="border-radius: 15px;">
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
    <el-table-column
      label="创建时间"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="更新时间"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.updateTime}}</span>
      </template>
    </el-table-column>
  </el-table>
   </div>
  <div>
    <div class="page-info-block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageIndex"
          :page-sizes="[5,10,20]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next"
          :total="pageInfo.total">
        </el-pagination>
    </div>
  </div>
  <el-dialog :title="form.account" :visible.sync="dialogFormVisible">
      <el-form :model="form">
      <el-form-item label="账号：" :label-width="formLabelWidth">
        <el-input disabled v-model="form.account" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码：" :label-width="formLabelWidth">
        <el-input v-model="form.passwd" autocomplete="off"></el-input>
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
import {getBackUserInfoAPI} from "../../../../api/backUserApi.js"
export default {
  data(){
    return{
      tableData: [],
      pageIndex:1,
      pageSize:10,
      pageInfo:"",
      form: {
         
        },
      formLabelWidth: '100px',
      dialogFormVisible:false,
      imageUrl:"",
      copyBackUserData:""
    }
  },
  async created(){
    let res = await getBackUserInfoAPI(this.pageIndex,this.pageSize,"")
    if(!res) return;
    this.tableData = res.data.pageDataList
    this.pageInfo = res.data.pageInfo
    this.pageInfo.total = parseInt(this.pageInfo.total)
  },
  methods:{
    handleSizeChange(){

    },
    handleCurrentChange(){

    },
    handleEdit(index,data){
      this.dialogFormVisible = true
      this.form = data
      Object(this.copyBackUserData,this.tableData[index])
      this.imageUrl = this.$baseImageUrl + userData.avatar +'?timestamp='+ new Date().getTime()
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
    handleCancel(flag){
      this.dialogFormVisible = false
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
  }
}
</script>

<style scoped lang="less">
  .content{
    width: 100%;
    height: 540px;
    display: flex;
    flex-direction: column;
    align-content: center;
    .page-info-block,.el-pagination{
    width: 100%;
    display: flex;
    position: relative;
    top:5px;
    justify-content: center;
    align-content: center;
    }
    avatar-uploader .el-upload {
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
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
  .button-box{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right:10px;
    .el-button{
      border: none;
      width: 120px;
      height: 38px;
      background-color: lightblue;
      margin-bottom: 15px;
    }
    .el-button:hover{
      opacity: 0.7;
    }
  }
  }
  
</style>