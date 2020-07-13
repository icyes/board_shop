<template>
  <div class="container home">
      <div class="head">
          <van-row type="flex" justify="center">
              <van-col :span="24" >
                  <router-link to="order/address"><van-button class="shadow" block type="info">开单</van-button></router-link>
              </van-col>
          </van-row>
      </div>
      <van-divider/>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-empty v-if="list.length===0" description="暂无订单" />
          <van-card v-else v-for="(item,index) of list" :key="index" num="2" price="2.00" thumb="https://img.yzcdn.cn/vant/ipad.jpeg">
              <template #desc>
                  <van-row>客户：{{item.name}}</van-row>
                  <van-row>联系电话：122414124124123</van-row>
                  <van-row>下单时间：2020-04-25 12：30:30</van-row>
              </template>
        </van-card>
      </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      isLoading: false,
      list:[]
    };
  },
  methods:{
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    },
  }
}
</script>
<style lang="scss">
    .home{display: flex;flex-flow: column;}
    .head{padding: 40px;}
</style>
