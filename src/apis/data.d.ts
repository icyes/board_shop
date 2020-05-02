export interface AddUserProps {
    realName:string,
    mobile:string,
    addressInfo:string,
    regionId:number
}

//增加用户地址必填的信息
export interface AddUserAddress {
    userId:number,
    addName:string,
    receiver:string,
    mobile:string,
    country:string,
    province:string,
    city:string,
    area:string,
    addressInfo:string,
    regionId:number,
}

//查询单品(价格和库存等信息)
export interface QuerySkuInfo {
    cid:number,
    productId:number,
    //1,2,3
    pidArr:string,
    //4,5,6
    vidArr:string
}

//下单需要的数据
export interface OrderBookForm {
    userId:number,
    addressId:number,
    //[{productId:1,price:23.8}]
    orderData:string
}
