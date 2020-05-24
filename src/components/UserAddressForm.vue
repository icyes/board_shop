<template>
    <van-form @submit="onSubmit" :show-error="false">
        <van-field
                v-if="type==='addressAdd'"
                :disabled="disabled"
                name="realName"
                v-model="form.addName"
                label="地址名称"
                placeholder="地址名称"
                :rules="[{ required: true, message: '请输入地址名称' }]"
        />
        <van-field
                :disabled="disabled"
                name="realName"
                v-model="form.realName"
                label="收件人"
                placeholder="客户姓名"
                :rules="[{ required: true, message: '请输入客户姓名' }]"
        />
        <van-field
                :disabled="disabled"
                type="mobile"
                v-model="form.mobile"
                name="mobile"
                label="联系电话"
                placeholder="联系电话"
                :rules="[{ required: true, message: '请填写联系电话' }]"
        />
        <van-field
                :disabled="disabled"
                readonly
                :right-icon="disabled?'':'arrow'"
                @click="showAreaPopup"
                v-model="form.area"
                name="area"
                label="收货地址"
                :rules="[{ required: true, message: '请选择地区' }]"
                placeholder="省市区"
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
                :disabled="disabled"
                v-model="form.addressInfo"
                label="详细地址"
                name="addressDetail"
                placeholder="详细地址"
                :rules="[{ required: true, message: '请填写详细地址' }]"
        />
        <slot name="action" />
    </van-form>
</template>

<script>
  export default {
    name: "UserAddressForm",
    data(){
      return {
        showArea: false,
        areaListArr: [[], [], []],
        curAreaArr:[{},{},{}],
        areaType: ["province_list", "city_list", "county_list"],
        areaList: {
          "province_list": {},
          "city_list": {},
          "county_list": {}
        },
        form:{
          realName: '',
          mobile: '',
          addressInfo: '',
          regionId: '',
          addName:''
        }
      }
    },
    props:{
      disabled:{
        type:Boolean,
        default:()=>true
      },
      userForm:Object,
      type:String,
    },
    created() {
      if(this.disabled)return
      this.getAreaList();

    },
    watch:{
      userForm:{
        handler: function (value){
          if(value)
            this.form = {...value};
          else this.resetForm()
        },
        deep: true
      }
    },
    methods:{
      /**
       * 获取省市县列表
       * @param picker
       * @param value
       * @param index
       */
      // 地区选择回调
      onAreaChange(picker, value, index) {
        if (index < 2) {
          this.getAreaList(index + 1, value[index].code);
        }
      },
      showAreaPopup(){
        if(this.disabled) return;
        this.showArea = true;
      },
      resetForm(){
        this.form= {
          realName: undefined,
          mobile: undefined,
          area: undefined,
          addressInfo: undefined,
          regionId: undefined
        }
      },
      //根据pid获取列表
      async getRegionList(pid = 0, type = 0) {
        const { data } = await this.$apis.regionList(pid);
        return new Promise( (resolve) => {
          this.areaListArr[type] = data;
          const result =  Object.fromEntries(data.map(item => [item.id, item.name]));
          if(data.length>0) resolve(result)
        })
      },
      async getAreaList(i = 0, pid = 0) {
        //省、市、区类型
        const type = this.areaType[i];
        const result = await this.getRegionList(pid, i);
        this.areaList[type] = result;
        if (i < 2 && result!={}) {
          pid = Object.keys(result)[0];
          this.getAreaList(i + 1, pid);
        }
      },

      //获取省市县
      onAreaConfirm(values) {
        this.curAreaArr = values;
        this.form.regionId = Number(values[2].code);
        this.form.area = values.map(item => item.name).join(",");
        this.showArea = false;
      },

      // 表单提交事件
      async onSubmit(values) {
        this.$emit('submit',this.form);
      }
    }
  }
</script>

<style scoped>

</style>
