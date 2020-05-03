<template>
  <div class="container">
    <van-nav-bar
      :title="title"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <van-search
      v-model="keyWord"
      shape="round"
      background="#fff"
      placeholder="请输入手机号/姓名"
      @input="searchUser"
    />
    <div
      ref="scroll"
      class="search-list"
      :class="{ show: users && users.length > 0 }"
    >
      <div>
        <van-cell
          @click.native="onUserItem(index)"
          v-for="(item, index) in users"
          :key="item.userId"
          class="user-item"
          :class="curUserIdx == index ? 'active' : ''"
          :title="item.realName"
          :value="item.mobile"
        />
        <van-row
          v-if="users && users.length > 0"
          style="height: 30px;padding: 10px 0"
          type="flex"
          align="center"
          justify="center"
          class="text-grey font-df"
          >—— 没有更多了 ——</van-row
        >
      </div>
      <van-row
        style="height: 100%"
        v-if="!users || users.length == 0"
        type="flex"
        align="center"
        justify="center"
        class="text-grey font-df"
        >{{ keyWord ? "未搜索到相关用户" : "当前暂无用户" }}</van-row
      >
    </div>
    <div v-if="users && users.length > 0" style="min-height: 100px">
      <van-divider class="address" content-position="left"
        >用户地址</van-divider
      >

      <div
        class="address-list"
        @click="onMask"
        :class="!loading.newTag ? '' : 'new-tag-input-mask'"
      >
        <van-tag
          @click.stop="onAddressItem(index)"
          class="address-item"
          :class="index == curAddressIdx ? 'active' : ''"
          v-for="(item, index) in address"
          :key="index"
          size="large"
          plain
          type="primary"
          >{{ item.addName }}</van-tag
        >
        <van-tag v-if="curUserIdx" class="add-tag" :class="{'active':curAddressIdx==-1,'show':loading.newTag}" size="large" plain type="success">
          <div
            class="new-tag-btn"
            v-if="!loading.newTag"
            @click.stop="onNewTag"
          >
              <template v-if="!addName">
                  <van-icon name="add" style="margin: 1px 4px 0 0 " />
                  <span>新标签</span>
              </template>
              <template v-else>
                  <span @click.stop="curAddressIdx=-1">{{addName}}</span>
                  <van-icon @click.stop="onNewTag" name="edit" style="margin: 0px 0px 0 4px " />
              </template>

          </div>
          <div class="new-tag-input" v-else>
            <input v-model="addName"  @click.stop="()=>false" placeholder="新标签名" /><van-icon @click.stop="addName=''" class="clear" name="clear" />
          </div>
        </van-tag>

        <van-row
          :class="
            !curUserIdx&&!loading.address && (!address || address.length == 0)
              ? ''
              : 'hidden'
          "
          type="flex"
          align="center"
          justify="center"
          class="text-grey font-df address-empty"
          >{{ curUserIdx ? "暂时没有地址" : "请选择用户" }}</van-row
        >
      </div>
    </div>

    <van-divider content-position="center" style="margin-top: 20px"
      >用户信息</van-divider
    >
    <van-form @submit="onSubmit" :show-error="false">
      <van-field
        name="realName"
        v-model="userForm.realName"
        label="姓名"
        placeholder="请填写客户姓名"
        :rules="[{ required: true, message: '请填写客户姓名' }]"
      />
      <van-field
        type="mobile"
        v-model="userForm.mobile"
        name="mobile"
        label="联系电话"
        placeholder="请输入联系电话"
        :rules="[{ required: true, message: '请填写联系电话' }]"
      />
      <van-field
        readonly
        v-model="userForm.area"
        clickable
        name="area"
        label="收货地址"
        placeholder="点击选择省市区"
        @click="showArea = true"
      />
      <van-popup v-model="showArea" position="bottom">
        <van-area
          :area-list="areaList"
          @change="onAreaChange"
          @confirm="onAreaConfirm"
          @cancel="showArea = false"
        />
      </van-popup>
      <van-field
        type="address"
        v-model="userForm.addressInfo"
        label="详细地址"
        name="addressDetail"
        placeholder="请填写详细地址"
        :rules="[{ required: true, message: '请填写详细地址' }]"
      />
      <div style="margin: 16px;">
        <van-row type="flex" justify="center">
          <van-button
            round
            block
            style="width:50%"
            type="info"
            native-type="submit"
          >
            新增客户
          </van-button>
        </van-row>
      </div>
    </van-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addName:undefined,
      title: "",
      keyWord: "",
      curUserIdx: undefined,
      users: [],
      curAddressIdx: undefined,
      address: [],
      userForm: {
        realName: undefined,
        mobile: undefined,
        area: undefined,
        addressInfo: undefined,
        regionId: undefined
      },
      loading: {
        search: false,
        address: false,
        newTag: false,
        addUser:false
      },
      showArea: false,
      areaListArr: [[], [], []],
      curAreaArr:[{},{},{}],
      areaType: ["province_list", "city_list", "county_list"],
      areaList: {
        "province_list": {},
        "city_list": {},
        "county_list": {}
      }
    };
  },

  created() {
    this.getRouteTitle();
    this.getAreaList();
  },
  mounted() {
    this.$nextTick(() => {
      this.bs = this.$createBsFactory(this.$refs.scroll);
    });
  },
  beforeDestroy() {
    if (this.bs) this.bs.destroy();
  },
  methods: {
    getRouteTitle: function () {
      const {title} = this.$route.meta;
      if (title) this.title = title;
    },
    /**
     * 用户搜索
     */
    searchUser() {
      const loading = this.loading;
      if (loading.search) return;
      loading.search = true;
      this.userClear();
      setTimeout(() => {
        this.getUsers();
        loading.search = false;
      }, 500);
    },
    userClear: function() {
      this.curUserIdx = undefined;
      this.address = undefined;
      this.curAddressIdx = undefined;
      this.loading.newTag = false;
      this.addName =undefined;
    },
    async getUsers() {
      this.curUserIdx = undefined;
      if (!this.keyWord) {
        this.userClear();
        this.users = undefined;
        return;
      }
      const { data } = await this.$apis.searchUser(this.keyWord);
      this.users = data;
      this.updateBs();
    },
    /**
     * 点击用户获取地址
     * @param uid
     * @returns {Promise<void>}
     */

    async getAddress(uid) {
      this.loading.address = true;
      const { data } = await this.$apis.address(uid);
      this.address = data;
      await this.$sleep();
      this.loading.address = false;
    },
    onUserItem(index) {
      //初始化
      this.curAddressIdx = undefined;
      this.userForm.addressInfo = undefined;
      this.userForm.area = undefined;
      this.addName = undefined;

      this.curUserIdx = index;
      const user = this.users[index];
      this.getAddress(user.userId);
    },
    async onAddressItem(index) {
      this.curAddressIdx = index;
      const { regionId, addressInfo,mobile,receiver } = this.address[index];

      // 当前收件人信息
      const {allName,cityId,provinceId,areaId,provinceName,cityName,areaName} = await this.getRegionInfo(regionId);
      //当前地区
      this.curAreaArr=[{code:provinceId,name:provinceName},{code:cityId,name:cityName},{code:areaId,name:areaName}]
      this.userForm.addressInfo = addressInfo;
      this.userForm.area = allName;
      this.userForm.regionId = regionId;
      this.userForm.mobile = mobile;
      this.userForm.realName = receiver;
    },

    //地区详情
    async getRegionInfo(regionId) {
      const { data } = await this.$apis.regionInfo(regionId);
      return data;
    },

    /**
     * 获取省市县列表
     * @param picker
     * @param value
     * @param index
     */
    onAreaChange(picker, value, index) {
      if (index < 2) {
        this.getAreaList(index + 1, value[index].code);
      }
    },
    async getRegionList(pid = 0, type = 0) {
      const { data } = await this.$apis.regionList(pid);
      this.areaListArr[type] = data;
      const result = {};
      data.forEach(m => {
        result[m.id] = m.name;
      });
      return result;
    },
    async getAreaList(i = 0, pid = 0) {
      const type = this.areaType[i];
      this.areaList[type] = await this.getRegionList(pid, i);
      if (i < 2 && this.areaList[type] != {}) {
        pid = this.areaListArr[i][0]["id"];
        this.getAreaList(i + 1, pid);
      }
    },
    //获取省市县
    onAreaConfirm(values) {
      this.curAreaArr = values;
      this.userForm.regionId = Number(values[2].code);
      this.userForm.area = values.map(item => item.name).join(",");
      this.showArea = false;
    },
    /**
     * 添加用户地址
     * @returns {Promise<void>}
     */
    async addUser() {
      if(this.loading.addUser) return ;
      this.loading.addUser = true
      const _data = { ...this.userForm };
      const rep = await this.$apis.addUser(_data).finally(res=>{
        this.loading.addUser = false;
      });
      if(!rep) return ;
      this.$notify({type:'success ',message:rep.msg});
      this.resetSubmit();
    },
    resetSubmit: function () {
      this.userClear();
      this.users = undefined;
      this.keyWord = ""
      this.resetForm();
    },
    resetForm(){
      this.userForm= {
        realName: undefined,
          mobile: undefined,
          area: undefined,
          addressInfo: undefined,
          regionId: undefined
      }
    },
    async onSubmit(values) {
      if(!this.curAddressIdx){
        this.$notify({type:'danger',message:'请选择地址标签，或新建一个标签'})
        return
      }
      if(this.curAddressIdx == -1){
        await this.addNewAddress()
      }
      this.addUser();
    },
    /**
     * 用户列表刷新
     */
    updateBs() {
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.bs) {
            this.bs.refresh();
          }
        }, 300);
      });
    },
    /**
     * 添加新地址
     */
    onMask(){
      this.loading.newTag = false;
      if(this.addName)this.curAddressIdx = -1
      else this.curAddressIdx = undefined
    },
    onNewTag(){
      this.loading.newTag = true;
      this.curAddressIdx = undefined
    },
    async addNewAddress(){
        const {regionId,addressInfo,area,mobile,realName} = this.userForm
        const {userId} = this.users[this.curUserIdx]
        const  region = this.curAreaArr;
        const _data= {
          userId,
          addName:this.addName,
          receiver:realName,
          mobile,
          country:region[2].code,
          province:region[0].code,
          city:region[1].code,
          area,
          addressInfo,
          regionId,
        }
        const {data} = await this.$apis.addAddress(_data)
        return data ;
    }
  }
};
</script>
<style scoped lang="scss">
.container {
  /*background-color: #f7f8fa;*/
}
.search-list {
  transition: all 0.5s ease-in-out;
  height: 30px;
  width: 90%;
  margin: 10px 20px;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
}
.search-list.show {
  width: 90%;
  height: 150px;
}
.user-item.active::after {
  border: 1px solid #1989fa;
}

.address {
  margin-bottom: 0;
}

.address-list {
  padding: 0px 30px;
  border-bottom: 1px solid #eeeeee;
  overflow: hidden;
  text-align: left;
  background: #eee;
  transition: all 0.5s ease-in-out;
  max-height: 200px;
  overflow-y: scroll;
  min-height: 46px;
  .van-tag {
    margin: 10px 0;
  }
  .van-tag:not(:last-child) {
    margin-right: 10px;
  }
}

.address-item.active {
  background-color: #1989fa;
  color: #fff;
}

.address-empty {
  width: 100%;
  height: 46px;
}

.add-tag{
    position: relative;
    bottom: -2px;
    z-index: 3;
    &.show{
        bottom: 2px;
    }
    &.active{
        background: #07c160;
        color: #fff;
    }
}
.new-tag-btn {
  display: inline-flex;
  align-items: center;
}

.new-tag-input {
    display: flex;
    align-items: center;
  width: 55px;
  height: 26px;
  input {
    border: none;
    width: 100%;
    height: 100%;
    color: #333;
    z-index: 3;
  }
    .clear{
        position: absolute;
        font-size: 18px;
        right: -30px;
        color: #fff;
    }
}
.new-tag-input-mask{
    /*pointer-events: none;*/
}
.new-tag-input-mask::after{
    content: "";
    position: fixed ;
    top: 0 ;
    left: 0 ;
    width: 100% ;
    height: 100% ;
    background: rgba(0,0,0,0.3);
    z-index: 2;
    transform:unset;
    .add-tag{
        z-index: 3;
    }
    pointer-events: auto;
}
</style>
