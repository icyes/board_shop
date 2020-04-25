import request from "@/request"
import { addUserProps } from './data'
const apis = {
    //商品分类列表
    category:async ()=>request('/api/product/category.do'),
    //用户名称和手机号查询用户
    searchUser:async (name:any)=>request('/api/user/search.do',{data:{name},method:'post'}),
    //查询用户地址
    address: async (userId:number)=>request('/api/user/address.do',{data:{userId},method:'post'}),
    //省市县列表
    regionList:async (pid:number)=> request('/api/sys/regionList.do',{data:{pid},method:'post'}),
    //省市县明细
    regionInfo:async (regionId:number)=> request('/api/sys/regionInfo.do',{data:{regionId},method:'post'}),
   // 增加客户
   addUser:async (data:addUserProps)=> request('/api/sys/add.do',{data,method:'post'}),
}

 export default apis
