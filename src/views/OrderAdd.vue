<template>
    <div class="container">
        <van-nav-bar
                :title="title"
                left-text="返回"
                left-arrow
                @click-left="$router.go(-1)"
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
                <th><input v-model="item.name" /></th>
                <th><input v-model="item.spec" /></th>
                <th><input v-model="item.unit" /></th>
                <th><input v-model="item.num"/></th>
                <th><input v-model="item.unitPrice" /></th>
                <th><input v-model="item.sumPrice" /></th>
                <th><van-icon v-if="i!=0" name="clear" @click="removePy(i)" /></th>
            </tr>
        </table>
        <van-row>
            <van-button icon="add" @click="addPy" class="add-py" hairline size="small" plain  type="info">添加</van-button>
        </van-row>

        <van-divider style="margin-top: 30px" />
        <van-field required readonly right-icon="arrow"  label="类目" placeholder="选择类目" @click="queryCategory"/>
        <van-field required readonly right-icon="arrow"  label="商品" placeholder="选择商品"/>
        <van-field required readonly right-icon="arrow" label="规格" placeholder="选择属性"/>
        <van-field required  label="数量" type="number" placeholder="请输入"/>
        <van-button class="submit" type="info" block>确定</van-button>
    </div>
</template>

<script>
  const comItem = {name:'',spec:'',unit:'',num:'',unitPrice:'',sumPrice:''}
export default {
  name: "Order",
  data: () => ({
    title:'',
    commodity:[
      comItem
    ]
  }),
  created() {
    this.getRouteTitle();
  },

  methods: {
    getRouteTitle: function () {
      const {title} = this.$route.meta;
      if (title) this.title = title;
    },
    addPy(){
        this.commodity.push({...comItem})
    },
    removePy(i){
      this.commodity.splice(i,1)
    },
    //这里要展示一个树的控件,只能选择叶子节点
    queryCategory(){
        console.log("查询商品类目");
    },
    //根据上面选择的类目查询商品
    queryProduct(cid){
        console.log("根据上面选择的类目查询商品");
    }
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

    .submit{
        margin-top: 30px;
    }

</style>
