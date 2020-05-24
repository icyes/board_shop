<template>
  <div class="fixed-container">
    <van-nav-bar
      :title="title"
      left-text="返回"
      left-arrow
      @click-left="$emit('close')"
    />
    <van-cell title="商品列表" icon="shop-o">
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #default>
        <van-button
          icon="add"
          @click="showModal = 'productAdd'"
          class="add-py"
          hairline
          size="small"
          plain
          type="info"
          >添加</van-button
        >
      </template>
    </van-cell>
    <van-empty
      v-if="commodity && commodity.length === 0"
      description="暂无商品"
    />
    <template v-else>
      <van-card
        v-for="(item, i) in commodity"
        :key="i"
        :num="item.num"
        :price="item.price"
        :desc="item.skuString"
        :title="item.title"
      >
        <template #footer>
            <van-row class="goods-item-action" block type="flex" justify="end" align="center">
                <van-stepper @change="computeAmount" v-model="commodity[i].num" min="1" />
                <van-button class="btn-del" @click="delGoodsItem(i)" size="mini">删除</van-button>
            </van-row>

        </template>
      </van-card>
      <van-field
        v-model="productAmount"
        name="productAmount"
        label="商品总金额"
        placeholder="商品总金额"
        type="number"
        :rules="[{ required: true, message: '请填写商品总金额' }]"
      />
      <van-field
        v-model="orderAmount"
        name="orderAmount"
        label="订单总金额"
        placeholder="订单总金额"
        type="number"
        :rules="[{ required: true, message: '请填写订单总金额' }]"
      />
      <van-field
        v-model="payAmount"
        name="payAmount"
        label="实付金额"
        placeholder="实付金额"
        type="number"
        :rules="[{ required: true, message: '请填写实付金额' }]"
      />
      <van-field
        v-model="payedMoney"
        name="payedMoney"
        label="已付金额"
        placeholder="已付金额"
        type="number"
        :rules="[{ required: true, message: '请填写已付金额' }]"
      />
    </template>

    <van-row type="flex" justify="center">
      <van-button
        :disabled="!canSubmit"
        round
        block
        class="submit"
        type="info"
        @click="submit"
        >下单</van-button
      >
    </van-row>

    <product-add
      :class="showModal === 'productAdd' ? 'show-modal' : ''"
      @close="showModal = ''"
      @add="addProduct"
    ></product-add>
  </div>
</template>

<script>
import { buildTree } from "@/utils";
const comItem = {
  name: "",
  spec: "",
  unit: "",
  num: "",
  unitPrice: "",
  sumPrice: ""
};
const oldJosnProp = {
  pidArr: [],
  vidArr: [],
  skuName: [],
  skuValue: [],
  pid: undefined,
  vid: undefined,
  skuArr: []
};
export default {
  name: "Order",
  data: () => ({
    title: "",
    showModal: "",
    commodity: [],
    productAmount: undefined,
    orderAmount: undefined,
    payAmount: undefined,
    payedMoney: undefined
  }),
  props: {
    userId: Number,
    regionId: Number
  },
  components: {
    ProductAdd: resolve => {
      require(["@/components/ProductAdd"], resolve);
    }
  },
  created() {
    this.getRouteTitle();
  },
  computed: {
    comProductAmount(){
      let result = 0;
      this.commodity.forEach(m=>{
        result += m.num*m.price;
      })
      return result;
    },
    comOrderAmount(){
      let result = 0;
      this.commodity.forEach(m=>{
        result += m.num*m.price;
      })
      return result;
    },
    canSubmit() {
      if (
        this.commodity.length > 0 &&
        this.productAmount !== undefined &&
        this.orderAmount !== undefined &&
        this.payAmount !== undefined &&
        this.payedMoney !== undefined
      ){
        return true;
      }
      return false;
    }
  },

  methods: {
    //头部title
    getRouteTitle: function() {
      const { title } = this.$route.meta;
      if (title) this.title = title;
    },
    computeAmount(){
      let result = 0;
      this.commodity.forEach(m=>{
        result += m.num*m.price;
      })

      this.productAmount =result;
      this.orderAmount =result;
    },
    //删除列表项
    delGoodsItem(i){
      this.commodity.splice(i,1);
      this.computeAmount();
    },
    addProduct(value) {
      const {
        category,
        goods: { title, num, id,unitName },
        sku: { skuString, price, skuKey,id:skuId }
      } = value;

      let targetIdx ;

      this.commodity.some((m,i)=>{
            if(m.skuId === skuId){
              targetIdx = i;
              return true;
            }
      })

      if(targetIdx !== undefined){
        this.commodity[targetIdx].num += num;
        this.computeAmount()
        return;
      }

      const item = {
        productId: id,
        title: title,
        skuString: skuString,
        unitName:unitName,
        num: num,
        price: (price/100).toFixed(2),
        skuNo: skuKey,
        sumPrice: num * price,
        skuId:skuId
      };
      this.commodity.push(item);
      this.computeAmount()
    },
    removePy(i) {
      this.commodity.splice(i, 1);
    },
    reset(){
      this.commodity= []
        this.productAmount= undefined
        this.orderAmount= undefined
        this.payAmount= undefined
        this.payedMoney= undefined
    },
    submit() {
      const data = {
        userId: this.userId,
        addressId: this.regionId,
        productAmount: this.productAmount,
        orderAmount: this.orderAmount,
        payAmount: this.payAmount,
        payedMoney: this.payedMoney,
        orderData: JSON.stringify(this.commodity)
      };
      this.$apis.orderBook(data).then(({ret})=>{
        if(ret===0){
          this.$notify({type:'success ',message:"下单成功"});
          this.reset()
          this.$emit('close')
        }

      });
    }
  }
};
</script>
<style scoped lang="scss">
.product-table {
  margin: 0 20px 0 10px;
}
.table-head {
  font-size: 14px;
  font-weight: unset;
  color: #333;
  & th:first-child {
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
.add-py {
  margin-top: 10px;
}

.submit {
  width: 60%;
}

    /deep/ .goods-item-action{
        &  button,input{
            background-color: #fff;
        }
        & .btn-del{
            height: 28px;
            border-color: #fff;
        }

    }
</style>
