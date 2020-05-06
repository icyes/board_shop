<template>
    <div>
        <van-collapse v-for="(item) in tree" :key="item.id" v-model="activeNames" accordion>
            <van-collapse-item v-if="item.children" :title="item.cateName" :name="item.cateName">
                <category-tree :current="current" @select="onSelect"   :tree="item.children"></category-tree>
            </van-collapse-item>
            <div v-else class="van-cell" :class="current&&current.id == item.id?'active':''"  @click="onSelect(item)">
                <div class="van-cell__title">{{item.cateName}}</div>
            </div>
        </van-collapse>
    </div>
</template>

<script>
  export default {
    name: "CategoryTree",
    data(){
      return{
        activeNames:[]
      }
    },
    props:{
      tree:{},
      current:{}
    },
    methods:{
      onSelect(item){
        this.$emit('select',item)
      },
    }
  }
</script>

<style scoped>
    .van-cell.active{
        background: rgba(25,137,250,0.7);
        color: #fff;
    }
    .van-cell__title{
        position: relative;
        right: 10px;
    }
</style>
