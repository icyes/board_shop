<template>
  <div class="home">
      <div class="head">
          <a-row >
              <a-col :span="12">
                  <router-link to="order/add"><a-button >开单</a-button></router-link>
              </a-col>
              <a-col :span="12">
                  <router-link to="goods/add"><a-button >添加客户</a-button></router-link>
              </a-col>
          </a-row>
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
