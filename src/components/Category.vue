<template>
    <div class="fixed-container">
        <van-nav-bar
                title="分类选择"
                left-text="返回"
                left-arrow
                @click-left="$emit('close')"
        />
        <category-tree :tree="category" @select="onSelect"></category-tree>
    </div>
</template>

<script>
  export default {
    name: "Category",
    data(){
      return{
        activeNames:{
          1:[],
          2:[]
        },
      }
    },
    props:{
      category:{
        type:Array,
        default:()=>[]
      }
    },
    components:{
      CategoryTree:(resolve => require(['./CategoryTree'],resolve))
    },
    methods:{
      onSelect(item){
        this.$emit('select',item)
      }
    }
  }
</script>

<style scoped>

</style>
