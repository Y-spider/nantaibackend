<template>
  <!-- 自定义填出确认弹出框 -->
  <div>
    <el-dialog
    :title="title"
    :visible="true"
    width="30%"
    :before-close="handleClose">
    <span>{{ content }}</span>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancle()">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm()">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
export default {
    props:["title","content","hanldeConfirmFuncation"],
    methods:{
        cancle(){
            this.$store.commit("setIsShowConfirmDialog",false)
        },
        dialogConfirm(){
            this.$store.commit("setIsShowConfirmDialog",false)
            this.$store.commit("setConfirmDialogIsConfirm",true)
            console.log("dadsadsa",this.hanldeConfirmFuncation)
            console.log(this.hanldeConfirmFuncation!=undefined)
            if(this.hanldeConfirmFuncation!=undefined){
                this.hanldeConfirmFuncation()
            }
        },
        handleClose(){
            // 不是点击取消或者确定关闭弹框时触发
            this.$store.commit("setIsShowConfirmDialog",false)
            this.$store.commit("setConfirmDialogIsConfirm",false)
        }
    }
}
</script>

<style>

</style>