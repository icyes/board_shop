<template>
  <div class="home">
      <div class="head">
          <van-row >
              <van-col :span="12">
                  <router-link to="user/add"><van-button >开单</van-button></router-link>
              </van-col>
              <van-col :span="12">
                  <router-link to="goods/add"><van-button >添加客户</van-button></router-link>
              </van-col>
          </van-row>
      </div>

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
