import request from "@/request"
import { AddUserProps,AddUserAddress,QuerySkuInfo,OrderBookForm} from './data'
const apis = {


    //用户名称和手机号查询用户
    searchUser:async (name:any)=>request('/api/user/search.do',{data:{name},method:'post'}),

    //查询用户地址
    address: async (userId:number)=>request('/api/user/address.do',{data:{userId},method:'post'}),

    //省市县列表
    regionList:async (pid:number)=> request('/api/sys/regionList.do',{data:{pid},method:'post'}),

    //省市县明细
    regionInfo:async (regionId:number)=> request('/api/sys/regionInfo.do',{data:{regionId},method:'post'}),

    //增加客户
    addUser:async (data:AddUserProps)=> request('/api/user/add.do',{data,method:'post'}),

    //增加客户地址
    addAddress:async (data:AddUserAddress)=> request('/api/user/addAddress.do',{data,method:'post'}),

    //商品分类列表
    category:async ()=>request('/api/product/category.do'), 

    //修改地址
    updateAddress:async (data:AddUserAddress)=> request('/api/user/updateAddress.do',{data,method:'post'}),

    //根据类目查询当前类目下商品
    productList:async (cid:number)=> request('/api/product/list.do',{data:{cid},method:'post'}),

    //根据商品查询当前销售的属性(查询出来可能是多个属性和多个值,再这个值区查询单品的价格和库存)
    productAttrList:async (productId:number)=> request('/api/product/attrList.do',{data:{id:productId},method:'post'}),

    //根据类目ID和商品ID以及销售属性名和值ID查询单品信息
        productSkuInfo:async (data:QuerySkuInfo)=> request('/api/product/skuInfo.do',{data,method:'post'}),

    //提交商品订单
    orderBook:async (data:OrderBookForm)=> request('/api/order/book.do',{data,method:'post'}),
};

export default apis
