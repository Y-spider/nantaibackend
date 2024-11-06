<!-- 首页 -->
<template>
    <div class="root-box">
        <NavBarView></NavBarView>
        <div class="view-right">
            <!-- 右边组件 -->
            <HeaderView></HeaderView>
            <ContentView></ContentView>
        </div>
    </div>
</template>

<script>
import ContentView from "./ContentView.vue"
import HeaderView from "./HeaderView.vue"
import NavBarView from "./NavBarView.vue";
export default {
    components:{
        ContentView,HeaderView,NavBarView
    },
}
</script>

<style coped lang="less">
    .root-box{
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        .view-right{
            flex: 1;
            display: flex;
            flex-direction: column;
        }
    }
</style>