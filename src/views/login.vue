<template>
    <div class="main">
        <van-nav-bar title="用户登录"/>

        <van-row type="flex" justify="center" class="img">
            <van-col span="1">&nbsp;</van-col>
            <van-col span="22"><img src="../assets/sLogo.png" /></van-col>
            <van-col span="1">&nbsp;</van-col>
        </van-row>

        <van-row type="flex" justify="center" class="line">
            <van-col span="3">&nbsp;</van-col>
            <van-col span="18">
                <van-cell-group>
                    <van-field placeholder="请输入用户名" type="text" v-model="my.username" left-icon="manager"/>
                </van-cell-group>
                <van-cell-group>
                    <van-field placeholder="请输入密码"  type="password"  v-model="my.password" left-icon="lock"/>
                </van-cell-group>
            </van-col>
            <van-col span="3">&nbsp;</van-col>
        </van-row>

        <van-row type="flex" justify="center" class="btns">
            <van-col span="3">&nbsp;</van-col>
            <van-col span="18">
                <van-button class="jumpBtn" type="primary" @click.native="handleClick" size="large">登录</van-button>
            </van-col>
            <van-col span="3">&nbsp;</van-col>
        </van-row>
    </div>
</template>
<script>
export default {
    created () {
        this.$nextTick(function(){
            //this.initData();
        })
    },
    computed:{},
    methods: {
        doLogin(oj){
            const _config = {headers:{'Content-Type':'application/x-www-form-urlencoded'}};
            const postData = 	qs.stringify(oj);
            console.log(postData);

            axios.post(Config.baseUrl+'/a/login?__ajax=true',postData,_config)
                //axios.post('http://localhost:8080/security_cj/a/login',postData,_config)
                .then(response => {
                    console.log(response.data);
                    console.log(response.data.sessionid);
                    if(response.data.sessionid){
                        var sessionid = response.data.sessionid;
                        setStore({name:'loginInfo',content:oj});
                        setStore({name:'sessionid',content:sessionid,type:"Y"});
                        setStore({name:'userInfo',content:response.data,type:"Y"});

                        console.log(oj);
                        this.loadUserInfo(sessionid);

                    }else{
                        Dialog.alert({
                            title: '登录提示',
                            message:response.data.message
                        }).then(() => {
                            // on close
                        });
                    }
                });
        },

        handleClick(){
            this.doLogin(this.my);
        },
        loadUserInfo(sessionid){
            //axios.get('http://localhost:8080/security_cj/a/sys/user/infoData;JSESSIONID='+sessionid+"?__ajax=true")
            axios.get(Config.baseUrl+'/a/sys/user/infoData;JSESSIONID='+sessionid+"?__ajax=true")
                .then(res => {
                    console.log(res.data);
                    const _data = res.data;
                    if(_data.id){
                        setStore({name:'userData',content:_data,type:"Y"});
                        if(_data.roleNames=="保安队长"){
                            this.$router.push('/dz/home');
                        }else if(_data.roleNames=="保安"){
                            this.$router.push('/ba/home');
                        }else if(_data.roleNames==""){
                            this.$router.push('/ba/home');
                        }else{
                            this.$router.push('/ba/home');
                        }
                    }

                });
        },

        initData(){
            const loginInfo = getStore({name:'loginInfo'})
            if(loginInfo){
                this.doLogin(loginInfo)
            }

        }
    }
}
</script>