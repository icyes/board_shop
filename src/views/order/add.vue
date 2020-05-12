<template>
    <div class="fixed-container">
        <van-nav-bar
                :title="title"
                left-text="返回"
                left-arrow
                @click-left="$emit('close')"
        />

        <table class="product-table">
            <tr class="table-head">
                <th>品名</th>
                <th>规格</th>
                <th>单位</th>
                <th>数量</th>
                <th>单价</th>
                <th>金额</th>
                <th></th>
            </tr>
            <tr v-for="(item,i) in commodity" :key="i" class="col-input">
                <th><input disabled v-model="item.name" /></th>
                <th><input disabled v-model="item.spec" /></th>
                <th><input disabled v-model="item.unit" /></th>
                <th><input disabled v-model="item.num"/></th>
                <th><input disabled v-model="item.unitPrice" /></th>
                <th><input disabled v-model="item.sumPrice" /></th>
                <th><van-icon name="clear" @click="removePy(i)" /></th>
            </tr>
        </table>
        <van-row type="flex" justify="center">
            <van-button icon="add" @click="showModal = 'productAdd'" class="add-py" hairline size="small" plain  type="info">添加</van-button>
        </van-row>

        <product-add :class="showModal === 'productAdd'?'show-modal':''"  @close="showModal=''" @add="addProduct"></product-add>

    </div>
</template>

<script>
  import {buildTree} from "@/utils"
  const comItem = {name:'',spec:'',unit:'',num:'',unitPrice:'',sumPrice:''}
  const oldJosnProp = {pidArr:[],vidArr:[],skuName:[],skuValue:[],pid:undefined,vid:undefined,skuArr:[]};
export default {
  name: "Order",
  data: () => ({
    title:'',
    showModal:'',
    commodity:[]
  }),
  props:{
    userId:Number,
    regionId:Number
  },
  components:{
    ProductAdd:(resolve)=>{require(["@/components/ProductAdd"],resolve)},
  },
  created() {
    this.getRouteTitle();
  },

  methods: {

    //头部title
    getRouteTitle: function () {
      const {title} = this.$route.meta;
      if (title) this.title = title;
    },
    addProduct(value){
      console.log(`value -->`, value)
      const {category,goods:{title,num},sku:{skuString,price}} = value
      const item = {name:title,spec:skuString,unit:'',num:num,unitPrice:price,sumPrice:num*price};
      this.commodity.push(item);
    },
    removePy(i){
      this.commodity.splice(i,1)
    },


  }
};
</script>
<style scoped lang="scss">
    .product-table{
        margin: 0 20px 0 10px;
    }
    .table-head{
        font-size: 14px;
        font-weight: unset;
        color: #333;
        & th:first-child{
            width: 100px;
        }
    }
    .col-input input {
        width: 100%;
        font-size: 14px;
        font-weight: unset;
        color: #2c3e50;
        border: 1px solid #eeeeee;
        padding: 5px 0;
        text-align: center;
    }
    .add-py{
        margin-top: 10px;
    }


</style>

