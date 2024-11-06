<!-- 首页 -->
<template>
  <div class="body-box">
    <div class="head-box">
      <div class="search-box">
        <el-input
          @change="handleSearch"
          placeholder="请输入搜索内容"
          prefix-icon="el-icon-search"
          style="margin-left: 15px"
          v-model="search"
        >
        </el-input>
      </div>
      <!-- 功能按钮 -->
      <el-button
        type="info"
        size="mini"
        :class="selectButton[0]"
        @click="handleButtonChange(0)"
        >网站管理</el-button
      >
      <!-- 添加后面有需求再进行添加 -->
      <!-- <el-button
        type="info"
        size="mini"
        :class="selectButton[1]"
        @click="handleButtonChange(1)"
        >添加网站</el-button
      > -->
      <el-badge
        :value="pagenationInfoOfNeedToExamine.total"
        :hidden="pagenationInfoOfNeedToExamine.total == 0"
        class="item"
      >
        <el-button
          type="info"
          size="mini"
          :class="selectButton[2]"
          @click="handleButtonChange(2)"
          >待审核</el-button
        >
      </el-badge>
      <el-badge
        :value="pagenationInfoOfReject.total"
        :hidden="pagenationInfoOfReject.total == 0"
        class="item"
      >
        <el-button
          type="info"
          size="mini"
          :class="selectButton[3]"
          @click="handleButtonChange(3)"
          >未通过审核</el-button
        >
      </el-badge>
    </div>
    <div class="content-box">
      <el-table
        :data="tableData"
        resizable
        @expand-change="changeExpand"
        max-height="500px"
        border
        style="width: 99%"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form
              label-position="left"
              inline
              class="demo-table-expand"
              style="margin-left: 18px"
            >
              <el-form-item label="网站描述:">
                <span class="website-des">{{ props.row.des }}</span>
              </el-form-item>
              <br />
              <el-form-item label="更新时间:">
                <span>{{ props.row.updateTime }}</span>
              </el-form-item>
              <br />
              <el-form-item label="创建时间:">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="上传用户" prop="openid"> </el-table-column>
        <el-table-column label="用户头像" width="100px">
          <template slot-scope="scope">
            <el-image
              style="width: 32px; height: 32px"
              :src="$baseImageUrl + scope.row.avatar"
              :preview-src-list="[$baseImageUrl + scope.row.avatar]"
            />
          </template>
        </el-table-column>
        <el-table-column label="网站名称" prop="title"> </el-table-column>
        <el-table-column label="网站网址" prop="url">
          <template slot-scope="scope">
            <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
          </template>
        </el-table-column>
        <el-table-column label="浏览量" prop="lookCount"> </el-table-column>
        <el-table-column fixed="right" width="300x" label="操作">
          <template slot-scope="scope" v-if="scope.row.isDelete == false">
            <el-button
              v-if="scope.row.state == 1"
              size="mini"
              type="primary"
              @click="handleEdit(scope.row, scope.$index)"
              >编辑</el-button
            >

            <el-button
              v-if="scope.row.state == 1 || scope.row.state == -1"
              size="mini"
              type="danger"
              @click="handleDeleteDoc(scope.row, scope.$index)"
              >删除</el-button
            >
            <el-button
              v-if="scope.row.state === 0"
              size="mini"
              type="primary"
              @click="handToExamine(scope.row, scope.$index)"
              >审核</el-button
            >
            <el-button
              v-if="scope.row.state === -1"
              size="mini"
              type="primary"
              @click="handCheckRejectLive(scope.row, scope.$index)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page-navgator">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="parseInt(pagenationInfo.total)"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 修改文档内容弹框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-form label-position="left" label-width="80px">
        <el-form-item label="网站名称">
          <el-input
            :disabled="currentSelectButtoIndex !== 0"
            v-model="formOfWebsite.title"
          ></el-input>
        </el-form-item>
        <el-form-item label="网站网址">
          <el-input
            :disabled="currentSelectButtoIndex !== 0"
            v-model="formOfWebsite.url"
          ></el-input>
        </el-form-item>
        <el-form-item label="网站描述">
          <el-input
            type="textarea"
            :disabled="currentSelectButtoIndex !== 0"
            v-model="formOfWebsite.des"
            :autosize="{ minRows: 2 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="审核结果" v-if="currentSelectButtoIndex == 2">
          <el-select v-model="examineValue" placeholder="请选择">
            <el-option
              v-for="item in examineOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="奖励积分"
          v-if="currentSelectButtoIndex == 2 && examineValue == 1"
        >
          <el-input-number
            v-model="rewardPoint"
            :step="10"
            step-strictly
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="处理描述">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            :maxlength="300"
            :autosize="true"
            v-model="formOfWebsite.handleDes"
            :disabled="currentSelectButtoIndex !== 2"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handSubmit" v-if="operateType != -1"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <div class="foot-box"></div>
  </div>
</template>
  
  <script>
import { pageWebsiteAPI,modifyWebsiteAPI,examineWebsiteAPI } from "@/api/websiteApi";

export default {
  name: "FileShowView",
  async created() {
    this.init();
  },
  data() {
    return {
      isDelete: false,
      selectButton: ["selected", "noSelected", "noSelected", "noSelected"],
      currentSelectButtoIndex: 0,
      pageIndex: 1,
      pageSize: 10,
      pageType: 0, // 0表示按照创建时间降序查找 1表示发布时间升序 2表示查找我的 这时就需要传递用户的openid了 3 表示浏览量升序(网站有效) 4 表示浏览量降序(网站有效) 5 表示下载量升序(文档有效) 6 表示下载量降序(文档有效)
      state: 1, // 表示当前获取的文件或者网站的审核状态 0表示待审核 1表示审核通过 -1 表示审核不通过
      tableData: [],
      pagenationInfo: {}, // 分页信息
      fileList: [],
      pagenationInfoOfNeedToExamine: {}, // 待审核分页信息
      needToExamineData: {}, // 存放待审核的数据以及分页信息
      pagenationInfoOfReject: {}, // 审核拒绝的分页信息
      rejectWebsiteData: {}, // 存放拒绝审核网站的数据以及分页信息
      // 不支持多选
      multiple: false,
      formData: "",
      search: "",
      currentItemImageUrlList: [],
      dialogTitle: "", // 弹出框标题
      rewardPoint: 50, // 审核通过奖励积分
      formOfWebsite: {
        des: "", // 网站描述，可以ai自动生成
        handleDes: "", // 处理意见
        id: "", // 网站记录id
        state: "", // 网站状态
        title:"",// 网站名称
        url:null// 网站url
      }, // 记录修改文档的内容
      dialogVisible: false,
      operateType: 0, // 弹出框确认类型标识   0 表示修改文档信息 1表示添加网站  2表示审核文档 -1表示查看审核拒绝信息
      examineOptions: [
        // 审核选项数组
        {
          value: 1,
          label: "通过",
        },
        {
          value: -1,
          label: "不通过",
        },
      ],
      examineValue: 1,
    };
  },
  methods: {
    handCheckRejectLive(data, index) {
      this.dialogVisible = true;
      this.formOfWebsite.des = data.des;
      this.formOfWebsite.handleDes = data.handleDes;
      this.operateType = -1;
    },
    async handleDeleteDoc(data) {
      // 删除文档
      this.$confirm(`确定删除网站: ${data.title}?`, "删除网站")
        .then(async () => {
          // 点击确定，进行删除
          let res = await modifyWebsiteAPI({ id: data.id, isDelete: 1 });
          this.$message.success("删除成功");
          this.init();
        })
        .catch(() => {
          // 点击取消
        });
    },
    async handSubmit() {
      // 处理弹出框确认事件
      if (this.operateType == 0) {
        // 处理更新文档信息
        let res = await modifyWebsiteAPI(this.formOfWebsite);
        this.formOfWebsite = {
          des: "",
          handleDes: "",
          id: "",
          url:null,
          state:0
        };
        this.dialogVisible = false;
        this.$message.success("修改成功");
        this.init();
      } else if (this.operateType == 1) {
        // 审核文档
        this.formOfWebsite.state = this.examineValue;
        this.formOfWebsite.rewardPoint = this.rewardPoint;
        let res = await examineWebsiteAPI(this.formOfWebsite);
        this.$message.success("审核完成");
        this.init();
        this.dialogVisible = false;
      }
    },
    handToExamine(data, index) {
      // 处理审核
      this.operateType = 1;
      this.dialogTitle = "审核文档";
      this.dialogVisible = true;
      this.formOfWebsite.title = data.title
      this.formOfWebsite.url = data.url
      this.formOfWebsite.des = data.des
      this.formOfWebsite.id = data.id;
      this.formOfWebsite.openid = data.openid;
      this.formOfWebsite.handleDes = "";
      this.formOfWebsite.url = data.url
    },
    handleEdit(data, index) {
      // 修改弹框
      this.dialogTitle = "修改文档内容";
      if (this.currentSelectButtoIndex == 0) {
        this.operateType = 0;
      }
      this.dialogVisible = true;
      this.formOfWebsite.title = data.title
      this.formOfWebsite.url = data.url
      this.formOfWebsite.des = data.des;
      this.formOfWebsite.handleDes = data.handleDes;
      this.formOfWebsite.id = data.id;
    },
    handleSearch() {
      // 处理search
      this.init();
    },

    async changeExpand(data) {
      if (data.imageCount > 0) {
        // 表示需要请求获取到图片的数据
        let res = await getDocumentImageUrlAPI(data.id);
        if (res.code == 200) {
          this.currentItemImageUrlList = res.data;
          console.log("res.data=", res.data);
        }
      }
    },
    async init() {
      this.currentSelectButtoIndex = 0;
      // 进行数据的初始化和刷新  pageIndex,pageSize,pageType,openid,search,state
      let res1 = await pageWebsiteAPI(
        this.pageIndex,
        this.pageSize,
        this.pageType,
        null, // openid
        this.search,
        this.state
      );
      if (res1.code == 200) {
        this.tableData = res1.data;
        this.pagenationInfo = res1.pageInfo;
      }
      // 获取待审核的文档的信息
      let res2 = await pageWebsiteAPI(
        this.pageIndex,
        this.pageSize,
        this.pageType,
        null, // openid
        this.search,
        0 // 0表示待审核
      );
      if (res2.code == 200) {
        this.needToExamineData = res2.data;
        this.pagenationInfoOfNeedToExamine = res2.pageInfo;
      }

      // 获取审核拒绝的文档的信息
      let res3 = await pageWebsiteAPI(
        this.pageIndex,
        this.pageSize,
        this.pageType,
        null, // openid
        this.search,
        -1 // 0表示待审核
      );

      if (res3.code == 200) {
        this.rejectWebsiteData = res3.data;
        this.pagenationInfoOfReject = res3.pageInfo;
      }
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.init();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    handleButtonChange(index) {
      this.currentSelectButtoIndex = index;
      if (index === 2) {
        // 展示待审核数据
        this.pagenationInfo = this.pagenationInfoOfNeedToExamine;
        this.tableData = this.needToExamineData;
      } else if (index === 0) {
        // 展示正常数据
        this.init();
      } else if (index == 3) {
        // 展示审核拒绝数据
        this.pagenationInfo = this.pagenationInfoOfReject;
        this.tableData = this.rejectWebsiteData;
      }
    },
  },
  watch: {
    currentSelectButtoIndex: {
      handler(newValue, oldValue) {
        this.$set(this.selectButton, newValue, "selected");
        this.$set(this.selectButton, oldValue, "noSelected");
      },
    },
  },
};
</script>
  
<style scoped lang="less">
.body-box {
  width: 100%;
  // position: relative;
  top: 5px;
  left: 100px;
}
.head-box {
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  margin: 15px 0px;
  .search-box {
    margin-right: 15px;
    margin-top: 5px;
  }
  .el-button {
    margin: 0px 2px;
  }
  .selected {
    background-color: #909399;
    margin-left: 10px;
    border: none;
    color: white;
  }
  .noSelected {
    border: none;
    background-color: #f4f4f5;
    color: #909399;
    margin-left: 10px;
  }
  .noSelected:hover {
    background-color: #909399;
    margin-left: 10px;
    color: white;
    border: none;
  }
}
.page-navgator {
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 15px;
}
.el-image {
  margin: 0px 5px;
}
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon:hover {
  border-color: #409eff;
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
.website-des {
  font-size: medium;
  font-weight: bold;
  margin: 15px;
}
</style>