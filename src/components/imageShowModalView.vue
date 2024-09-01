<template>
    <!-- 用于定义模糊框，主要是用于点击图片时，可以放大查看图片 -->
    <div>
        <div class="modal">
            <span class="close" @click="close">&times;</span>
            <img class="modal-content" :src="url" >
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
    name:"ImageShowModel",
    props:["url"],
    methods:{
        close(){
            this.$store.commit("setIsPreviewPostImage",false)
        }
    }
}
</script>

<style soped>
    .modal{
        /* display: none; 默认不显示 */
        position: fixed; /* 固定定位 */
        z-index: 999999; /* 确保模态框在最上层 */
        padding-top: 0px; /* 位置 */
        left: 0;
        top: 0;
        width: 100%; /* 宽度 */
        height: 100%; /* 高度 */
        overflow: auto; /* 允许滚动 */
        background-color: rgb(0,0,0); /* 背景颜色 */
        display: flex;
        justify-content: center;
        align-content: center;
    }
    .modal-content{
       width: auto;
        overflow: auto;
    }
    .close{
        /* 关闭按钮 */
        position: absolute;
        top: 15px;
        right: 35px;
        color: #f1f1f1;
        font-size: 40px;
        font-weight: bold;
        transition: 0.3s;
    }
    .close:hover,.close:focus{
        color: #bbb;
        text-decoration: none;
        cursor: pointer;
    }
</style>