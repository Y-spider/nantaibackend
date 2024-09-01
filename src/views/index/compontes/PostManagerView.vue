<template>
    <div>
        <PostShowView v-if="isShowPostRouteView==false" type=""></PostShowView>
        <router-view v-if="isShowPostRouteView"></router-view>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import PostShowView from '@/components/commonPostShowView.vue';
export default {
    components:{
        PostShowView
    },
    data(){
        return {
            
        }
    },
    created(){
        console.log("flag=",this.isShowPostRouteView)
    },
    computed:{
        ...mapState(["isShowPostRouteView"])
    }
}
</script>

<style>

</style>