<template>
    <div class="fixed-container">
        <van-nav-bar
                :title="title"
                left-text="返回"
                left-arrow
                @click-left="$emit('close')"
        />

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
        <van-button @click="submit" class="submit" type="info" block>确定</van-button>

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
                :close-on-click-overlay="true"
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
  const oldJosnProp = {pidArr:[],vidArr:[],skuName:[],skuValue:[],pid:undefined,vid:undefined,skuArr:[]};
  export default {
    data() {
      return {
        title: "添加单品",
        loading: false,
        //当前选择的分类
        curCategory:{},
        category:{},
        goods:[],
        num:1,
        curSku:{},
        initialSku:{},
        skuKey:false,
        productSkuList:[],
        showModal:'',
        sku: {
          tree: [],
          list: [],
          "price": '0', // 默认价格（单位元）
          "stock_num": 0, // 商品总库存
          "none_sku": false, // 是否无规格商品
          "hide_stock": true // 是否隐藏剩余库存
        },
        skuGoods: {
          // 默认商品 sku 缩略图
        },
        showSku:false,
        //当前选择的商品
        curGoods:{},
      };
    },

    methods: {
      //分类树
      getCateTree() {
        this.$apis.category().then(({data}) => {
          this.category = buildTree(data,'id','parentId');
        })
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
      getSkuInfo: async function (value) {
        const _data ={
          cid:this.curCategory.id,
          productId:this.curGoods.id,
          //1,2,3
          pidArr:value.pidArr.join(','),
          //4,5,6
          vidArr:value.vidArr.join(',')
        }
        const {quantity,price} = await this.$apis.productSkuInfo(_data);
        value['stock_num'] = quantity||0;
        value['price'] = price||0;
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
      // 整理sku信息
      sortSkuArr: function (value) {
        const pidArr = value.pidArr.sort((a, b) => a - b), vidArr = [];
        pidArr.forEach(m => {
          vidArr.push(value[m])
        })
        value.pidArr = pidArr;
        value.vidArr = vidArr;
        let skuKey = '';
        pidArr.map((m,i)=>{
          if(skuKey != '') skuKey+='_';
          skuKey += m+'-'+vidArr[i];
        })
        value['skuKey'] = skuKey;
        const  skuItem = this.productSkuList[skuKey];
        value['stock_num'] = skuItem.quantity;
        value['price'] = skuItem.price;
      },
      //递归获取所有规格
      getListRecur(result,data,i,oldJosn=oldJosnProp){
        const items = data[i].items;
        for(let j = 0;j<items.length;j++){
          const m = items[j];
          const json = {
            'price': 0, // 价格（单位分）
            'stock_num': 0, // 当前 sku 组合对应的库存
            vid:m.vid,
            pid:m.pid
          }
          json[m.pid+''] = m.vid;
          if(oldJosn.pid!=undefined)
            json[oldJosn.pid] = oldJosn.vid;
          json['skuArr']=[m.pid+'-'+m.vid,...oldJosn.skuArr];
          json['pidArr']=[m.pid,...oldJosn.pidArr];
          json['vidArr']=[m.vid,...oldJosn.vidArr];
          json['skuName']=[m.pidName,...oldJosn.skuName];
          json['skuValue']=[m.vidName,...oldJosn.skuValue];
          if(i==data.length-1){
            this.sortSkuArr(json)
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

        if(filter.indexOf('category') == -1){
          this.curCategory={}
        }
        this.sku.tree = []
        this.sku.list = [];
        this.curSku= {};
        this.$forceUpdate();
      },
      onCategoryItem(item){
        this.curCategory = item;
        this.resetForm(['category']);
      },
      onGoodsItem(item){
        this.getSkusInfo(item.id)
        this.curGoods =item;
        this.resetForm(['goods','category']);

      },
      /**
       获取所有sku组合详情
       */
      getSkusInfo(cid){
        this.$apis.spuSku(cid).then(({data})=>{
          const {productSkuList} = data;
          const result = {};
          let stockNum = 0;
          productSkuList.forEach(m=>{
            result[m.sku] = m;
            stockNum += m.quantity
          })
          this.sku['stock_num']= stockNum;
          this.productSkuList = result;
        });
      },
      //sku确认选择
      skuConfirm(value){
        const {selectedSkuComb:sku,selectedNum} = value;
        sku.skuString = sku.skuValue.reverse().join(';')
        this.curSku =sku;
        this.initialSku = sku;
        this.num = selectedNum;
        this.showSku = false;
      },
      //sku切换时的回调
      skuSelected(value){
        const {selectedSkuComb} = value;
      },
      //  计步器
      numChange(value){
        this.initialSku.selectedNum = value;
        this.$forceUpdate();
      },
      //添加订单
      submit(){
        const data = {
            categoray:{...this.curCategory},
            goods:{...this.curGoods,num:this.num},
            sku:{...this.curSku}
        }
        this.$emit('add',data);
        this.$emit('close');
        this.resetForm();
        // const {uid,aid} = this.$route.params;
        // const {id:productId} =  this.curGoods;
        // const _data = {
        //   userId:uid,
        //   addressId:aid,
        //   //[{productId:1,price:23.8}]
        //   orderData:[{productId}]
        // }
        // this.$apis.orderBook(_data)
      }
    },
    components:{
      GoodsList:(resolve)=>{require(["@/components/GoodsList"],resolve)},
        CategoryList:(resolve)=>{require(["@/components/Category"],resolve)},
    },
  };
</script>

