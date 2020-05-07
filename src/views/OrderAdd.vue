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
        <van-field :value="curCategory.cateName" @click="queryCategory" required readonly right-icon="arrow"  label="类目" placeholder="选择类目" />
        <van-field :value="curGoods.title" @click="queryProduct" required readonly right-icon="arrow"  label="商品" placeholder="选择商品"/>
        <van-field :value="curSku.skuString" @click="querySku" required readonly right-icon="arrow" label="规格" placeholder="选择属性"/>
        <van-field required  label="数量" type="number" placeholder="请输入">
            <template #input>
                <div style="width: 100%;text-align: right">
                    <van-stepper v-model="num" @change="numChange"  :max="curSku.stock_num"/>
                </div>
            </template>
        </van-field>
        <van-button class="submit" type="info" block>确定</van-button>

        <goods-list @select="onGoodsItem" :current="curGoods" :goods="goods"  :class="showModal == 'goods'?'show-modal':''" @close="showModal= ''"></goods-list>
        <category-list  @select="onCategoryItem" :current="curCategory" :category="category" :class="showModal == 'category'?'show-modal':''" @close="showModal= ''" ></category-list>
        <van-sku
                ref="sku"
                :key = "'key_'+skuKey"
                v-model="showSku"
                :sku="sku"
                :goods="skuGoods"
                :initialSku="initialSku"
                :preview-on-click-image="false"
                :quota-used="10"
                :start-sale-num="0"
                @buy-clicked="skuConfirm"
                @sku-selected="skuSelected"
                buy-text="确认"
                add-cart-text="取消"
        >
            <template #sku-actions="props">
                <div></div>
                <div class="van-sku-actions">
                    <van-button square size="large" type="warning" @click="showSku = false">
                        取消
                    </van-button>
                    <!-- 直接触发 sku 内部事件，通过内部事件执行 onBuyClicked 回调 -->
                    <van-button
                            square
                            size="large"
                            type="danger"
                            @click="props.skuEventBus.$emit('sku:buy')"
                    >
                        确认
                    </van-button>
                </div>
            </template>

        </van-sku>
    </div>
</template>

<script>
  import {buildTree} from "@/utils"
  const comItem = {name:'',spec:'',unit:'',num:'',unitPrice:'',sumPrice:''}
  const oldJosnProp = {pidArr:[],vidArr:[],skuName:[],skuValue:[],pid:0,vid:0};
export default {
  name: "Order",
  data: () => ({
    title:'',
    showModal:'',
    //当前选择的分类
    curCategory:{},
    category:{},
    goods:[],
    num:1,
    curSku:{},
    initialSku:{},
    skuKey:false,
    sku: {
      tree: [],
      list: [],
      "price": '0', // 默认价格（单位元）
      "stock_num": 100, // 商品总库存
      "none_sku": false, // 是否无规格商品
      "hide_stock": false // 是否隐藏剩余库存
  },
    skuGoods: {
    // 默认商品 sku 缩略图
  },
    showSku:false,
    //当前选择的商品
    curGoods:{},
    commodity:[
      comItem
    ]
  }),
  components:{
    GoodsList:(resolve)=>{require(["../components/GoodsList"],resolve)},
    CategoryList:(resolve)=>{require(["../components/Category"],resolve)},
  },
  created() {
    this.getRouteTitle();
  },

  methods: {
    //分类树
    getCateTree() {
      this.$apis.category().then(({data}) => {
        this.category = buildTree(data,'id','parentId');
      })
    },
    //头部title
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
        this.getCateTree();
         this.showModal= 'category'
    },
    //根据上面选择的类目查询商品
    queryProduct(cid){
      const {id} = this.curCategory;
      if(id == undefined) {
        this.$toast('请先选择分类 ');
        return
      }
      this.$apis.productList(id).then(({data})=>{
            this.goods = data;
      })
      this.showModal = 'goods'
    },
    getSkuInfo: function (value) {

      const _data ={
        cid:this.curCategory.id,
        productId:this.curGoods.id,
        //1,2,3
        pidArr:value.pidArr.join(','),
        //4,5,6
        vidArr:value.vidArr.join(',')
      }
      this.$apis.productSkuInfo(_data)
    },
    getSkuTree: function (data) {
      const result = [];
      data.forEach(m => {
        result.push({
          k: m.pidName,
          'k_s': m.pid + '',
          v: m.items.map(mm => {
            return {
              id: mm.vid,
              name: mm.vidName,
            }
          })
        })
      })
      return result;
    },
    //递归获取所有规格
    getListRecur(result,data,i,oldJosn=oldJosnProp){
     const items = data[i].items;
      for(let j = 0;j<items.length;j++){
        const m = items[j];
        const json = {
            'price': 0, // 价格（单位分）
            'stock_num': 100, // 当前 sku 组合对应的库存
            vid:m.vid,
            pid:m.pid
          }
        json[m.pid+''] = m.vid;
        json[oldJosn.pid] = oldJosn.vid;
        json['pidArr']=[m.pid,...oldJosn.pidArr];
        json['vidArr']=[m.vid,...oldJosn.vidArr];
        json['skuName']=[m.pidName,...oldJosn.skuName];
        json['skuValue']=[m.vidName,...oldJosn.skuValue];
        if(i==data.length-1){
          result.push(json);
        }else{
          this.getListRecur(result,data,i+1,json)
        }
      }
      return result;
    },
    getSkuList(data){
      let result = [];
      result = this.getListRecur(result,data,0)
      return result
    },
    querySku(){
      const {id} = this.curGoods;
      if(id == undefined) {
        this.$toast('请先选择商品');
        return
      }
      if(!this.curSku.skuValue)
      this.$apis.productAttrList(id).then(({data})=>{
        const _tree = this.getSkuTree(data);
        const _list = this.getSkuList(data);
        this.setInitSku(data)
        this.sku.list = _list;
        this.sku.tree = _tree;
        this.$forceUpdate();

      })
      this.showModal = 'sku';
      this.skuKey=!this.skuKey
      setTimeout(()=>{
        this.showSku = true;
      },300)
    },
    //设置初始选择的sku值
    setInitSku(data){
        const initSku = { selectedNum: 1};
        data.forEach(m=>{
            initSku[m.pid+''] = m.items[0].vid;
        })
      this.initialSku = initSku
    },
    //重置sku和商品的数据
    resetForm: function (filter=[]) {
      this.showModal = '';
      if(filter.indexOf("goods")==-1){
        this.curGoods = {};
        this.goods = [];
      }
      this.sku.tree = []
      this.sku.list = [];
      this.curSku= {};
      this.$forceUpdate();
    },
    onCategoryItem(item){
      this.curCategory = item;
      this.resetForm();
    },
    onGoodsItem(item){
      this.curGoods =item;
      this.resetForm(['goods'])
    },
    //sku确认选择
    skuConfirm(value){
      console.log(`skuConfirm -->`, value)
      const {selectedSkuComb:sku,selectedNum} = value;
      sku.skuString = sku.skuValue.reverse().join(',')
      this.curSku =sku;
      this.initialSku = sku;
      this.num = selectedNum;
      this.showSku = false;
    },
    //sku切换时的回调
    skuSelected(value){
      console.log(`skuSelected -->`, value)
      // this.getSkuInfo(value.selectedSkuComb)
    },
  //  计步器
    numChange(value){
      this.initialSku.selectedNum = value;
      this.$forceUpdate();
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

    .show-modal{
        left: 0px !important;
    }

/deep/.van-sku-header__img-wrap{
        display: none !important;
    }

</style>

