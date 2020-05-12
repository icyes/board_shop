<template>
    <div class="fixed-container">
        <van-nav-bar
                :title="title"
                left-text="返回"
                left-arrow
                @click-left="$emit('close')"
        />
        <user-address-form @submit="submit" :userForm="userForm" type="addressAdd" >
            <div slot="action" style="margin: 16px;">
                <van-row type="flex" justify="center">
                    <van-button
                            round
                            block
                            style="width:50%"
                            type="info"
                            native-type="submit"
                    >
                        添加
                    </van-button>
                </van-row>
            </div>
        </user-address-form>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        title: "添加地址",
        userForm: {
          realName: undefined,
          mobile: undefined,
          area: undefined,
          addressInfo: undefined,
          regionId: undefined
        },
        loading: false,
      };
    },
    props:{
      userId:Number
    },
    components:{
      UserAddressForm:resolve => require(['@/components/UserAddressForm'],resolve),
    },
    methods: {
      async submit(value){
        console.log(`value -->`, value);

          const {regionId,addressInfo,area,mobile,realName,addName} = value
          const _data= {
            userId:this.userId,
            addName:addName,
            receiver:realName,
            mobile,
            // country:region[2].code,
            // province:region[0].code,
            // city:region[1].code,
            // area,
            addressInfo,
            regionId,
          }
       const {data} = await this.$apis.addAddress(_data);
          if(data){
            this.$emit('submitBack',data);
            this.$emit('close');
            this.resetForm()
          }

      },
      resetForm(){
        this.userForm= {
          realName: undefined,
          mobile: undefined,
          area: undefined,
          addressInfo: undefined,
          regionId: undefined,
          addName: undefined
        }
      },
    }
  };
</script>

<style lang="scss">
    .submit{
        margin-top: 30px;
    }


    /deep/.van-sku-header__img-wrap{
        display: none !important;
    }
</style>
