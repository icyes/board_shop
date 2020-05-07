<template>
    <div class="fixed-container">
        <van-nav-bar
                :title="title"
                left-text="返回"
                left-arrow
                @click-left="$emit('close')"
        />
        <div class="list">
            <van-cell-group>
                <van-cell @click="onGoodsItem(item)" :class="current&&current.id==item.id?'active':''" v-for="(item) in goods" :key="item.id" :title="item.title" :value="item.productSize" :label="item.keywords" class="goods-item" />
            </van-cell-group>
        </div>
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
    props:{
      goods:{
        type:Array
      },
      current:{}
    },
    methods:{
      onGoodsItem(item){
        this.$emit('select',item)
      }
    }
  }
</script>

<style scoped lang="scss">
    .van-cell.active{
        background: rgba(25,137,250,0.7);
        color: #fff;
        .van-cell__label,.van-cell__value{
            color: #fff;
        }
    }
</style>
