<template>
    <div>
        <van-collapse v-for="(item) in tree" :key="item.id" v-model="activeNames" accordion>
            <van-collapse-item v-if="item.children" :title="item.cateName" :name="item.cateName">
                <category-tree @select="onSelect"   :tree="item.children"></category-tree>
            </van-collapse-item>
            <div v-else class="van-cell " style="right: 10px" @click="onSelect(item)">
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
      tree:{}
    },
    methods:{
      onSelect(item){
        this.$emit('select',item)
      },
    }
  }
</script>

<style scoped>

</style>
