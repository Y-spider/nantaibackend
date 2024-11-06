<template>
  <div class="body-box">
    <!-- 搜索框 -->
    <div class="head-box">
      <el-form :inline="true" :model="querryParame" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="querryParame.openid" placeholder="openid"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="querryParame.reportType" placeholder="举报类型">
            <el-option label="违法发帖规定" value="违法发帖规定"></el-option>
            <el-option label="涉及隐私信息" value="涉及隐私信息"></el-option>
            <el-option label="抄袭或恶意转载" value="抄袭或恶意转载"></el-option>
            <el-option label="虚假信息或欺诈" value="虚假信息或欺诈"></el-option>
            <el-option label="人生攻击或诽谤" value="人生攻击或诽谤"></el-option>
            <el-option label="其他违规行为" value="其他违规行为"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="querryParame.state" placeholder="处理状态">
            <el-option label="待审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="审核拒绝" value="-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="info" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button type="info" size="mini" @click="handleResetQuerryParame">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-skeleton :rows="18" animated :loading="loading">
      <div class="table-box">
        <el-table :data="tableData" max-height="500px" style="width: 99%" @expand-change="handleGetImgUrl" border>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" class="demo-table-expand">
                <el-form-item v-if="scope.row.postId" label="举报描述">
                  {{ scope.row.reportDes }}
                </el-form-item>
                <el-form-item v-if="imageList.length > 0" label="相关图片">
                  <div class="demo-image__preview">
                    <el-image v-for="(url) in imageList" :key="url" style="width: 100px; height: 100px"
                      :src="baseImageUrl + url" :preview-src-list="[baseImageUrl + url]">
                    </el-image>
                  </div>
                </el-form-item>
                <el-form-item v-if="scope.row.postId" label="帖子ID">
                  {{ scope.row.postId }}
                </el-form-item>
                <el-form-item v-if="scope.row.commentId" label="评论ID">
                  {{ scope.row.commentId }}
                </el-form-item>
                <el-form-item v-if="scope.row.state != 0" label="处理意见">
                  {{ scope.row.handleDes }}
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="序号">
            <template slot-scope="scope">
              {{ scope.row.reportId }}
            </template>
          </el-table-column>
          <el-table-column label="openid">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>{{ scope.row.openid }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">OPENID</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="审核状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state == 0" key="待审核" type="info" effect="dark">
                待审核
              </el-tag>
              <el-tag v-if="scope.row.state == 1" key="审核通过" type="success" effect="dark">
                审核通过
              </el-tag>
              <el-tag v-if="scope.row.state == -1" key="审核拒绝" type="danger" effect="dark">
                审核拒绝
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="举报类型">
            <template slot-scope="scope">
              <el-tag type="info" effect="dark">
                {{ scope.row.reportType }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime">
          </el-table-column>
          <el-table-column label="更新时间" prop="updateTime">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleExam(scope.row)">审核</el-button>
              <!-- <el-button type="danger" size="mini" @click="handleEdit(scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="display: flex; justify-content: center">
        <div class="block">
          <el-pagination @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-sizes="[10]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="parseInt(pageInfo.total)">
          </el-pagination>
        </div>
      </div>
    </el-skeleton>
    <!-- 弹框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <el-form>
        <el-form-item label="审核状态">
          <el-select v-model="examForm.state" placeholder="请选择">
            <el-option v-for="item in examineOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="examForm.state == 1" label="奖励积分">
          <el-input-number v-model="examForm.rewardPoint" :step="10" step-strictly :min="0"></el-input-number>
        </el-form-item>
        <el-form-item v-if="examForm.state == -1 && examForm.postId" label="是否下架帖子">
          <el-switch v-model="examForm.actionFlag" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item v-if="examForm.state == -1 && examForm.commentId" label="是否删除评论">
          <el-switch v-model="examForm.actionFlag" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="处理描述">
          <el-input type="textarea" placeholder="请输入内容" v-model="examForm.handDes" maxlength="50" show-word-limit>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listReportWithPageAPI, getReportByIdAPI, getReportImageUrAPI } from "@/api/reportApi"
export default {
  data() {
    return {
      // 搜索参数
      querryParame: {
        openid: "", // 举报人opneid
        reportType: "", // 举报类型
        state: ""
      },
      dialogTitle: '', // 弹框标题
      dialogVisible: false,
      tableData: [],
      pageInfo: [],
      pageIndex: 1,
      pageSize: 10,
      isExpand: false, //标记是否是打开折叠
      imageList: [], //举报帖子中的图片
      baseImageUrl: this.$baseImageUrl,
      loading: true, // 骨架屏状态
      examForm: {
        reportId:'',
        state: 1,
        rewardPoint: 10,
        commentId: '',
        postId: '',
        handDes: '', // 处理描述
        actionFlag: true // 标识是否需要下架帖子或者删除评论，默认为false
      }, // 审核信息表单
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

    }
  },
  created() {
    this.init()
  },
  methods: {
    copyInfo() {

    },
    handleExam(report) {
      this.dialogTitle = '审核'
      this.examForm.postId = report.postId
      this.examForm.commentId = report.commentId
      this.examForm.reportId = report.reportId
      this.examForm.handDes = ''
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    async handleGetImgUrl(row) {
      this.isExpand = !this.isExpand
      if (this.isExpand) {
        let res = await getReportImageUrAPI(row.reportId)
        this.imageList = res.data
      }
    },
    handleCurrentChange(index) {
      this.pageIndex = index
      this.init()
    },
    handleSearch() {
      this.init()
    },
    handleResetQuerryParame() {
      this.querryParame = {
        openid: "", // 举报人opneid
        reportType: "", // 举报类型
        state: ""
      }
      this.init()
    },
    async init() {
      this.loading = true
      let res = await listReportWithPageAPI(this.pageIndex, this.pageSize, this.querryParame)
      if (!res) return
      this.tableData = res.data.pageDataList
      this.pageInfo = res.data.pageInfo
      this.loading = false
    }

  }

}
</script>

<style scoped>
.body-box {
  width: 100%;
}

.head-box {
  height: 60px;
  margin: 0 15px;
}

.head {
  display: flex;
  align-items: center;
  margin-left: 15px;
}

.el-form-item {
  margin-top: 15px;
}

.demo-table-expand {
  padding-left: 30px;
}
</style>