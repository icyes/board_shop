<template>
  <div class="container">
      <van-pull-refresh disabled v-model="isLoading" @refresh="onRefresh">
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
      <div ref="scroll" class="search-list" :class="{'show':users&&users.length>0}">
          <div>
              <van-cell @click.native="onUserItem(item)" v-for="item in users" :key="item.userId" :title="item.realName" :value="item.mobile" />
              <van-row v-if="users&&users.length>0" style="height: 30px;padding: 10px 0" type="flex" align="center" justify="center" class="text-grey font-df">—— 没有更多了 ——</van-row>
          </div>
          <van-row style="height: 100%" v-if="!users||users.length==0" type="flex" align="center" justify="center" class="text-grey font-df">当前暂无用户</van-row>
      </div>


      <van-divider content-position="center">用户信息</van-divider>
          <van-form @submit="onSubmit" :show-error="false">
              <van-field
                      name="realName"
                      v-model="realName"
                      label="姓名"
                      placeholder="请填写客户姓名"
                      :rules="[{ required: true, message: '请填写客户姓名' }]"
              />
              <van-field
                      type="mobile"
                      v-model="mobile"
                      name="mobile"
                      label="联系电话"
                      placeholder="请输入联系电话"
                      :rules="[{ required: true, message: '请填写联系电话' }]"
              />
              <van-field
                      readonly
                      v-model="addressInfo"
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
                      v-model="addressDetail"
                      name="详细地址"
                      label-width="20"
                      input-align="center"
                      placeholder="请填写详细地址"
                      :rules="[{ required: true, message: '请填写详细地址' }]"
              />
              <div style="margin: 16px;">
                  <van-row type="flex" justify="center">
                      <van-button round block style="width:50%" type="info" native-type="submit">
                          新增客户
                      </van-button>
                  </van-row>
              </div>
          </van-form>
      </van-pull-refresh>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        addressDetail:'',
        userId:undefined,
        regionId:'',
        mobile:'',
        realName:'',
        addressInfo:'',
        title:'',
        username: '',
        password: '',
        isLoading: false,
        searching:false,
        keyWord:'',
        users:[],
        loading:false,
        finished:false,
        showArea:false,
        areaListObj:[[],[],[]],
        areaType:['province_list','city_list','county_list'],
        areaList:{
          'province_list': {

          },
          'city_list': {

          },
          'county_list': {

          }
        }

    };
    },
    created() {
      const {title} = this.$route.meta;
      if(title)this.title = title;
      this.getAreaList()
    },
    mounted() {
      this.$nextTick(()=>{
        this.bs = this.$createBsFactory(this.$refs.scroll)
      })

    },
    beforeDestroy() {
      if(this.bs)this.bs.destroy()
    },
    methods: {
      async getAddress(uid) {
        const { data } = await this.$apis.address(uid);
      },
      onUserItem(user){
        this.realName = user.realName;
        this.mobile = user.mobile;
        this.userId = user.userId;
        this.getAddress(this.userId);
      },
      onAreaChange(picker, value, index){
        if(index<2){
          this.getAreaList(index+1,value[index].code)
        }
      },
      async addUser() {
        const _data = {
          realName: this.realName,
          mobile: this.mobile,
          addressInfo: this.addressInfo+this.addressDetail,
          regionId: 120103
        };
        const { data } = await this.$apis.addUser(_data);
      },
     async getAreaList(i = 0,pid =0){
            const type = this.areaType[i];
            this.areaList[type] = await this.getRegionList(pid,i);
            if(i <2 &&this.areaList[type]!={}){
              pid = this.areaListObj[i][0]['id'];
              this.getAreaList(i+1,pid);
            }
      },
      updateBs() {
        this.$nextTick(()=>{
          setTimeout(()=>{
            if (this.bs){
              this.bs.refresh();
            }
          },300)
        })

      },
      async getUsers() {
        const { data } = await this.$apis.searchUser(this.keyWord);
        this.users = data;
        this.updateBs();
      },
      async getRegionInfo() {
        const { data } = await this.$apis.regionInfo(110116);
      },
      //获取省市县
      async getRegionList(pid = 0,type=0) {
        const { data } = await this.$apis.regionList(pid);
        this.areaListObj[type] = data
        const result ={};
        data.forEach(m=>{result[m.id] =m.name })
        return result
      },
      onSubmit(values) {
        console.log('submit', values);
      },
      onRefresh() {
        setTimeout(() => {
          this.$toast('刷新成功');
          this.isLoading = false;
          this.count++;
        }, 1000);
      },
      searchUser(){
        if(this.searching) return;
        this.searching = true;
        setTimeout(()=>{
          this.getUsers();
          this.searching = false;
        },500)
      },
      onAreaConfirm(values) {
        this.addressInfo = values.map((item) => item.name).join('');
        this.showArea = false;
      },
    },

  };

</script>
<style>
    .search-list{
        transition: all 0.5s ease-in-out;
        height: 30px;
        width: 90%;
        margin: 10px 20px;
        border: 1px solid #eee;
        border-radius: 4px;
        overflow: hidden;
    }
    .search-list.show{
        width: 90%;
        height: 150px;
    }
</style>
