<template>
    <div class="fixed-container">
        <van-nav-bar
                :title="title"
                left-text="返回"
                left-arrow
                @click-left="$emit('close')"
        />
        <user-address-form @submit="submit" :userForm="userForm" :disabled="false" >
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
        title: "新增用户",
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
    components:{
      UserAddressForm:resolve => require(['@/components/UserAddressForm'],resolve),
    },
    methods: {
     async submit(value){

       const toast = this.$toast.loading({
         duration: 0, // 持续展示 toast
         message: '提交中...',
         forbidClick: true,
       });
        const _data = { ...value };
        const rep = await this.$apis.addUser(_data).finally(res=>{
          toast.clear();
        });
        if(!rep) return ;
        this.$notify({type:'success ',message:rep.msg});
        this.resetForm();
        this.$emit('close')

      },
      resetForm(){
        this.userForm= {
          realName: undefined,
          mobile: undefined,
          area: undefined,
          addressInfo: undefined,
          regionId: undefined
        }
      }
    }
  };
</script>

