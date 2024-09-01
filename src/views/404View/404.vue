<template>
  <div>
    <el-empty description="404未找到页面，正在返回首页"></el-empty>
  </div>
</template>

<script>
export default {
    created(){
       setTimeout(()=>{
        this.$router.push("/")
       },1000)
    },
    data(){
       
    },
}
</script>

<style>

</style>