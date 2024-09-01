<template>
    <div class="content-box">
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="less">
    .content-box{
        width: 100%;
        max-height:60%;
        background-color: rgb(243, 244, 247);
        .content{
            margin: 10px;
            background-color: white;
        }
    }
    // 自定义过度动画
    .fade-transform-enter{
        opacity: 0;
    }
    .fade-transform-enter-to{
        opacity: 1;
    }
    // 指定要过度的属性
    .fade-transform-enter-enter-active{
        transition: all .3s linear;
    }

    // 离场过度动画
    .fade-transform-leave{
        opacity: 1;
    }

    .fade-transform-leave-to{
        opacity: 0;
    }
    .fade-transform-leave-active{
        transition: all .3s linear;
    }
</style>