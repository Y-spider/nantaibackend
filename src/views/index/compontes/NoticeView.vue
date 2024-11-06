<template>
  <div>
    <div class="body-box">
      <div class="head-box">
        <!-- 一些功能按钮区域 -->
        <el-button type="info" size="mini" :class="selectButton[0]" @click="handleButtonChange(0)">线上公告</el-button>
        <el-button type="info" size="mini" :class="selectButton[1]" @click="handleButtonChange(1)">历史公告</el-button>
        <el-button type="info" size="mini" class="noSelected" @click="handleButtonChange(-1)">添加公告</el-button>
        <el-button type="info" size="mini" :class="selectButton[2]" @click="handleButtonChange(2)">轮播图</el-button>
        <el-button type="info" size="mini" :class="selectButton[3]" @click="handleButtonChange(3)">添加轮播图</el-button>
        <el-button type="info" size="mini" :class="selectButton[3]" @click="handleButtonChange(4)">轮播图配置</el-button>
      </div>
      <div class="content-box">
        <!-- 公告展示数据区域 -->
        <el-table :data="tableData" v-if="(currentSelectedButtonIndex == 0 ||
          currentSelectedButtonIndex == 1) &&
          tableData.length != 0
          " style="width: 100%">
          <el-table-column label="公告编号" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="内容" :show-overflow-tooltip="true" min-width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column label="排序" min-width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" min-width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.updateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="160">
            <template slot-scope="scope">
              <el-button v-if="typeCode == 1" size="mini"
                @click="handleFunButton(scope.$index, scope.row, '编辑')">编辑</el-button>
              <el-button v-if="typeCode == 1" size="mini" type="danger"
                @click="handleFunButton(scope.$index, scope.row, '下线')">下线</el-button>
              <el-button v-if="typeCode == -1" size="mini" type="success"
                @click="handleFunButton(scope.$index, scope.row, '上线')">上线</el-button>
              <el-button v-if="typeCode == -1" size="mini" type="danger"
                @click="handleFunButton(scope.$index, scope.row, '删除')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 轮播图数据展示区 -->
        <el-table :data="imageData" v-if="currentSelectedButtonIndex == 2 && imageData.length != 0"
          style="width: 100%;overflow: auto;">
          <el-table-column label="编号" width="60">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="排序" min-width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column label="图片" :show-overflow-tooltip="true" min-width="320">
            <template slot-scope="scope">
              <el-image style="width:320px; height: 100px"
                :src="swiperImageBaseUrl + scope.row.url + '?time=' + new Date().getTime()"
                :preview-src-list="[swiperImageBaseUrl + scope.row.url + '?tiem=' + new Date().getTime()]">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" min-width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.updateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="260">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleFunButton(scope.$index, scope.row, '修改轮播图')">修改</el-button>
              <el-button size="mini" type="danger" v-if="scope.row.state === 0"
                @click="handleFunButton(scope.$index, scope.row, '下架轮播图')">下架</el-button>
              <el-button size="mini" type="success" v-else
                @click="handleFunButton(scope.$index, scope.row, '上架轮播图')">上架</el-button>

              <el-button size="mini" type="danger"
                @click="handleFunButton(scope.$index, scope.row, '删除轮播图')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-empty v-if="tableData.length == 0 &&
        (currentSelectedButtonIndex == 0 || currentSelectedButtonIndex == 1)
        " description="糟糕数据飞走了"></el-empty>
      <el-empty v-if="imageData.length == 0 && currentSelectedButtonIndex == 2" description="糟糕数据飞走了"></el-empty>

      <div style="display: flex; justify-content: center">
        <div class="block">
          <el-pagination v-if="currentSelectedButtonIndex == 0 || currentSelectedButtonIndex == 1"
            @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-sizes="[10]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next" :total="parseInt(pageInfo.total)">
          </el-pagination>
          <el-pagination v-else @current-change="handleCurrentChangeOfSwiper" :current-page.sync="pageIndexOfSwiper"
            :page-sizes="[4]" :page-size="pageSize" layout="total, sizes, prev, pager, next"
            :total="parseInt(pageInfoOfSwiper.total)">
          </el-pagination>
        </div>
      </div>
      <el-dialog title="新增公告" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="公告内容" :label-width="formLabelWidth">
            <el-input v-model="form.content" autocomplete="off" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="优先级" :label-width="formLabelWidth">
            <el-input-number controls-position="right" :min="0" v-model="form.sort"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDialogConfirm('notice')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新增轮播图" :visible.sync="dialogFormVisibleOfSwpierImage">
        <el-form :model="swiperImageForm">
          <el-form-item label="轮播图" :label-width="formLabelWidth">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :auto-upload="false"
              :on-change="handleImageUploadChange" :before-upload="beforeAvatarUpload">
              <img v-if="swiperImageForm.base64Image" :src="swiperImageForm.base64Image" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="优先级" label-width="100">
            <el-input-number controls-position="right" :min="0" v-model="swiperImageForm.sort"></el-input-number>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input type="textarea" placeholder="请输入内容" v-model="swiperImageForm.remark" maxlength="150"
              show-word-limit>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleOfSwpierImage = false">取 消</el-button>
          <el-button type="primary" @click="handleDialogConfirm('swiper')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改轮播图 -->
      <el-dialog title="修改轮播图" :visible.sync="dialogFormVisibleOfSwpierImageEdit">
        <el-form :model="swiperImageForm">
          <el-form-item label="轮播图" :label-width="formLabelWidth">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :auto-upload="false"
              :on-change="handleImageUploadChange" :before-upload="beforeAvatarUpload">
              <img v-if="!isChangeSwiperImage"
                :src="swiperImageForm.base64Image" class="avatar" />
              <img v-else :src="swiperImageForm.base64Image " class="avatar" />
            </el-upload>
          </el-form-item>
          <el-form-item label="优先级" label-width="100">
            <el-input-number controls-position="right" :min="0" v-model="swiperImageForm.sort"></el-input-number>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input type="textarea" placeholder="请输入内容" v-model="swiperImageForm.remark" maxlength="150"
              show-word-limit>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleOfSwpierImageEdit = false">取 消</el-button>
          <el-button type="primary" @click="handleModifySwiperImage">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改轮播图配置信息 -->
      <el-dialog title="修改轮播图配置" :visible.sync="dialogFromVisibleOfSwiperConfig">
        <el-form :model="swiperConfigForm">
          <el-form-item label="切换时间(ms)" :label-width="formLabelWidth">
            <el-input-number v-model="swiperConfigForm.interval" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="滑动时间(ms)" label-width="100">
            <el-input-number v-model="swiperConfigForm.duration" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="显示数量">
            <el-input-number v-model="swiperConfigForm.swiperShowCount" :min="1"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFromVisibleOfSwiperConfig = false">取 消</el-button>
          <el-button type="primary" @click="handleModifySwiperConfig">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改公告 -->
      <el-dialog title="修改公告" :visible.sync="dialogFormVisibleOfEdit">
        <el-form :model="copyCurrentOperateNotice">
          <el-form-item label="公告内容" :label-width="formLabelWidth">
            <el-input v-model="copyCurrentOperateNotice.content" autocomplete="off" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="优先级" :label-width="formLabelWidth">
            <el-input v-model="copyCurrentOperateNotice.sort" autocomplete="off" type="number" :min="0"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleOfEdit = false">取 消</el-button>
          <el-button type="primary" @click="handleEdit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <myConfirmView v-if="isShowConfirmDialog" :title="confirmTitle" :content="confirmContent"
      :hanldeConfirmFuncation="handleConfiemDiaglogFunction"></myConfirmView>
  </div>
</template>

<script>
import {
  getNoticeApi,
  saveAPI,
  modifyAPI,
  deleteAPI,
} from "@/api/noticeApi.js";
import {
  uploadSwiperImageAPI,
  listSwiperImageAPI,
  updateSwiperImageAPI,
  deleteSwiperImageByIdAPI,
  getSwiperImageByIdAPI
} from "@/api/swiperImageApi";

import { getSystemConfigAPI, modifySystemConfigAPI } from "@/api/systemConfigApi.js";
import myConfirmView from "@/components/myConfirmView.vue";
import { mapState } from "vuex";
export default {
  components: {
    myConfirmView,
  },
  async created() {
    this.initNotice();
  },
  computed: {
    ...mapState(["isShowConfirmDialog"]),
  },
  data() {
    return {
      swiperImageBaseUrl: this.$baseSwiperImgaeUrl,
      tableData: [],
      imageData: [], // 轮播图数据
      selectButton: ["selected", "noSelected", "noSelected", "noSelected"],
      typeCode: 1,
      pageIndex: 1,
      pageSize: 10,
      pageIndexOfSwiper: 1,
      pageSizeOfSwiper: 4,
      typeOfSwiper: -1, // -1表示查询全部 0表示查看在线轮播图 1表示查看下线轮播图
      pageInfo: {},
      pageInfoOfSwiper: {},
      currentSelectedButtonIndex: 0,
      dialogFormVisible: false,
      dialogFormVisibleOfSwpierImage: false,
      dialogFormVisibleOfSwpierImageEdit: false,
      dialogFromVisibleOfSwiperConfig: false,
      form: {
        content: "",
        sort: 0,
      },
      swiperImageForm: {
        id: "",
        base64Image: "",
        sort: 0,
        remark: ""
      },
      isChangeSwiperImage: false, // 点击修改轮播图图片
      swiperConfigForm: {
        id: 1,
        duration: 0, // 轮播图滑动动画时长
        interval: 0, // 自动切换时间单位ms
        swiperShowCount: 0 //轮播图最大显示个数
      },
      formLabelWidth: "140",
      confirmTitle: "",
      confirmContent: "",
      currentOperateNotice: {},
      currentOperateNoticeIndex: 0,
      currentOperateSwiper: {},
      dialogFormVisibleOfEdit: false,
      copyCurrentOperateNotice: {}, // 当前操作notice的备份
      handleConfiemDiaglogFunction: null,
      isOnline: false, // 标识是否为修改公告状态为上线
    };
  },
  watch: {
    currentSelectedButtonIndex: {
      handler(newValue, oldValue) {
        this.selectButton[newValue] = "selected";
        this.selectButton[oldValue] = "noSelected";
      },
      // immediate: true
    },
  },
  methods: {
    beforeAvatarUpload() {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleImageUploadChange(file, fileList) {
      this.isChangeSwiperImage = false
      // 判断是否已经到达图片上传的最大上线，如果到达，则不进行处理
      fileList.splice(0, 1);
      console.log("获取的file", file);
      let that = this;
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function (event) {
        console.log("event", event);
        let imgBase64 = this.result;
        that.swiperImageForm.base64Image = imgBase64;
        that.isChangeSwiperImage = true;
      };
    },
    async handleEdit() {
      // 处理编辑公告
      let res = await modifyAPI(this.copyCurrentOperateNotice);
      if (!res) return;
      this.$message.success("修改成功");
      this.dialogFormVisibleOfEdit = false;
      this.$set(
        this.tableData,
        this.currentOperateNoticeIndex,
        this.copyCurrentOperateNotice
      );
      this.initNotice();
    },
    async handleFunButton(index, rowData, type) {
      this.currentOperateNotice = rowData;
      this.currentOperateNoticeIndex = index;
      this.currentOperateSwiper = rowData
      this.copyCurrentOperateNotice = JSON.parse(
        JSON.stringify(this.currentOperateNotice)
      );
      if (type == "编辑") {
        this.dialogFormVisibleOfEdit = true;
      } else if (type == "下线") {
        this.confirmContent = "确定下线公告?";
        this.$store.commit("setIsShowConfirmDialog", true);
        this.copyCurrentOperateNotice.state = 0;
        this.isOnline = true;
        this.handleConfiemDiaglogFunction =
          this.handleConfiemDiaglogFunctionOfModify;
      } else if (type == "上线") {
        this.confirmContent = "确定上线公告?";
        this.$store.commit("setIsShowConfirmDialog", true);
        this.copyCurrentOperateNotice.state = 1;
        this.isOnline = false;
        this.handleConfiemDiaglogFunction =
          this.handleConfiemDiaglogFunctionOfModify;
      } else if (type == "删除") {
        this.confirmContent = "确定删除公告?删除后无法恢复";
        this.$store.commit("setIsShowConfirmDialog", true);
        this.handleConfiemDiaglogFunction =
          this.handleConfiemDiaglogFunctionOfDelete;
      }
      else if (type == "删除轮播图") {
        this.confirmContent = "确定删除轮播图？删除后无法恢复"
        this.$store.commit("setIsShowConfirmDialog", true)
        this.handleConfiemDiaglogFunction = this.handleConfirmDialogFuncationOfDeletSwiper
      }
      else if (type == "上架轮播图") {
        this.currentOperateSwiper.state = 0
        this.handleChangeSwiperImageState()
      } else if (type == "下架轮播图") {
        this.currentOperateSwiper.state = 1
        this.handleChangeSwiperImageState()
      }
      else if (type == "修改轮播图") {
        const swiper = await this.getSwiperImaggeById()
        console.log("swiper==", swiper)
        this.swiperImageForm.id = swiper.id
        this.swiperImageForm.base64Image = this.$baseSwiperImgaeUrl + swiper.url + "?time=" +new Date().getTime()
        this.swiperImageForm.sort = swiper.sort
        this.swiperImageForm.remark = swiper.remark
        this.dialogFormVisibleOfSwpierImageEdit = true
      }
    },
    async getSwiperImaggeById() {
      const res = await getSwiperImageByIdAPI(this.currentOperateSwiper.id)
      console.log("调用时候的res====", res)
      if (!res) return null
      return res.data
    },
    async handleChangeSwiperImageState() {
      // 切换轮播图状态 上架与下架
      const res = await updateSwiperImageAPI(this.currentOperateSwiper)
      if (!res) return
      this.$message.success("操作成功")
    },
    async handleModifySwiperImage() {
      // 更新轮播图信息
      if (this.swiperImageForm.base64Image.match("http")) {
        this.swiperImageForm.base64Image = ""
      }
      const res = await updateSwiperImageAPI(this.swiperImageForm)
      if (!res) return
      this.$message.success("更新成功")
      this.dialogFormVisibleOfSwpierImageEdit = false
      this.initSwiper()
    },
    async handleModifySwiperConfig() {
      let res = await modifySystemConfigAPI(this.swiperConfigForm)
      if (!res) return
      this.$message.success("修改配置成功")
      this.dialogFromVisibleOfSwiperConfig = false
    },
    async handleConfirmDialogFuncationOfDeletSwiper() {
      const res = await deleteSwiperImageByIdAPI(this.currentOperateSwiper.id)
      if (!res) return
      this.$message.success(`删除轮播图成功`)
      this.initSwiper()
    },
    async handleConfiemDiaglogFunctionOfModify() {
      // 修改帖子回调函数
      let res = await modifyAPI(this.copyCurrentOperateNotice);
      if (!res) return;
      if (this.isOnline == true) {
        this.$message.success("下线成功");
      } else {
        this.$message.success("上线成功");
      }
      this.initNotice();
    },
    async handleConfiemDiaglogFunctionOfDelete() {
      // 删除帖子回调函数
      let res = await deleteAPI(this.copyCurrentOperateNotice.id);
      if (!res) return;
      this.$message.success("删除成功");
      this.tableData.splice(this.currentOperateNoticeIndex, 1);
    },
    handleCurrentChangeOfSwiper(index) {
      this.pageIndexOfSwiper = index
      this.initSwiper()
    },
    handleCurrentChange(index) {
      this.pageIndex = index
      this.initNotice()
    },
    async handleDialogConfirm(type) {
      if (type === "notice") {
        let res = await saveAPI(this.form);
        if (!res) return;
        this.$message.success("添加成功");
        this.dialogFormVisible = false;
        this.form = {
          content: "",
          sort: 0,
        };
        this.initNotice();
      } else if (type === "swiper") {
        let res = await uploadSwiperImageAPI(this.swiperImageForm);
        if (!res) return;
        this.dialogFormVisibleOfSwpierImage = false;
        this.swiperImageForm = {
          base64Image: "",
          sort: 0,
          remark: ""
        };
        this.$message.success("添加成功");
        this.pageIndexOfSwiper = 1;
        this.initSwiper();
      } else {
        this.$message.error(type + "不存在");
      }
    },
    async initNotice() {
      let res = await getNoticeApi(
        this.pageIndex,
        this.pageSize,
        this.typeCode
      );
      if (!res) return;
      this.tableData = res.data.pageDataList;
      this.pageInfo = res.data.pageInfo;
    },
    async initSwiper() {
      let res = await listSwiperImageAPI(
        this.pageIndexOfSwiper,
        this.pageSizeOfSwiper,
        this.typeOfSwiper
      );
      if (!res) return;
      this.imageData = res.data.pageDataList;
      this.pageInfoOfSwiper = res.data.pageInfo;
    },
    async handleButtonChange(index) {
      if (this.currentSelectedButtonIndex == index) {
        return;
      }
      if (index == -1) {
        this.dialogFormVisible = true;
      } else if (index == 3) {
        this.dialogFormVisibleOfSwpierImage = true;
        this.swiperImageForm.id = ""
        this.swiperImageForm.base64Image = ""
        this.swiperImageForm.sort = ""
        this.swiperImageForm.remark = ""
      }
      else if (index == 4) {
        let res = await getSystemConfigAPI()
        this.swiperConfigForm.id = res.data?.id
        this.swiperConfigForm.duration = res.data?.duration
        this.swiperConfigForm.interval = res.data?.interval
        this.swiperConfigForm.swiperShowCount = res.data?.swiperShowCount
        this.dialogFromVisibleOfSwiperConfig = true
      } else if (index < 2) {
        // 公告部分功能
        this.tableData = [];
        this.currentSelectedButtonIndex = index;
        this.typeCode = index == 1 ? -1 : 1;
        this.initNotice();
      } else {
        // 轮播图部分功能
        this.currentSelectedButtonIndex = index;
        this.pageIndexOfSwiper = 1
        this.initSwiper();
      }
    },
  },
};
</script>
<style scoped >
.body-box {
  width: 100%;
  top: 10px;
  left: 100px;
}

.head-box {
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
}

.el-button {
  margin: 10px;
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
  font-size: 55px;
  color: #8c939d;
  border: 3px dashed #d9d9d9;
  min-width: 200px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}

.avatar {
  width: 200px;
  height: 60px;
  display: block;
  border: 1px solid #ccc;
}</style>