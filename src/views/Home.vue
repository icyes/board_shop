<template>
  <div class="home">
      <div class="head">
          <van-row >
              <van-col :span="12">
                  <router-link to="user/add"><van-button type="info">开单</van-button></router-link>
              </van-col>
              <van-col :span="12">
                  <router-link to="goods/add"><van-button type="primary">添加客户</van-button></router-link>
              </van-col>
          </van-row>
      </div>
      <van-divider />


  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
  }
}
</script>
<style lang="scss">
    .head{
        padding: 40px;
    }
</style>
