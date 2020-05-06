<template>
    <div class="goods-list">
        <van-nav-bar
                :title="title"
                left-text="返回"
                left-arrow
                @click-left="$router.go(-1)"
        />
    </div>
</template>

<script>
  export default {
    name: "GoodsList",
    data(){
      return{
        title:'商品列表'
      }
    },
    created() {
      this.$apis.category().then(res=>{
        console.log(res);
      })
    }
  }
</script>

<style scoped>
    .goods-list{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        height: 100%;
        background: #fff;
    }
</style>
