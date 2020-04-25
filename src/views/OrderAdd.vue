<template>
  <div></div>
</template>

<script>
export default {
  name: "Order",
  data: () => ({
    category: {}
  }),
  beforeCreate() {
  },
  created() {
    this.getCateForay();
    this.getUsers();
    this.getAddress();
    this.getRegionInfo();
    this.getRegionList();
    this.addUser();
  },

  methods: {
    async getCateForay() {
      const { data } = await this.$apis.category();
      data && (this.category = data);
    },
    async getUsers() {
      const { data } = await this.$apis.searchUser(5641);
    },
    async getAddress() {
      const { data } = await this.$apis.address(1);
    },
    async getRegionInfo() {
      const { data } = await this.$apis.regionInfo(110116);
    },
    async getRegionList(pid = 0) {
      const { data } = await this.$apis.regionList(pid);
    },
    async addUser() {
      const _data = {
        realName: "名字",
        mobile: "17899009987",
        addressInfo: "地址",
        regionId: 120103
      };
      const { data } = await this.$apis.addUser(_data);
    }
  }
};
</script>
<style>
#components-form-demo-validate-other .dropbox {
  height: 180px;
  line-height: 1.5;
}
</style>
