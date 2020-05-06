<template>
    <div class="fixed-container">
        <van-nav-bar
                :title="title"
                left-text="返回"
                left-arrow
                @click-left="$emit('close')"
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
    methods:{

    }
  }
</script>

<style scoped>

</style>
