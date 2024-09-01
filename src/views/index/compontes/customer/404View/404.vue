<template>
    <div>
        找不到页面！正在跳转到首页{{ poins }}
    </div>
</template>

<script>
export default {
    data(){
        return{
            poins:""
        }
    },
    created(){
        let t = setInterval(() => {
            this.poins+=".."
            if(this.poins.length == 6){
               clearInterval(t)
            }
        }, 300);
       setTimeout(()=>{
        this.$router.push("/")
       },2000)
    }
}
</script>

<style>

</style>