<style lang="less">
    @import './login.less';
    .login-switch-img{
        position: absolute;
        top:0;
        right:0;
        cursor: pointer;
        width:40px;
        height:40px;
    }
</style>
<template>
   <div class="login" @keydown.enter="handleSubmit">
        <div class="login-top"></div>
        <div class="login-bottom">
            <div class="login-tit">Eptison 运营管理平台</div>
            <div class="login-con">
                <Card  :bordered="false">
                    <div slot="title" class="com-tit">
                        欢迎登录
                          <img @click="switchLoginMethod()" v-if="loginMethod!='account'" class="login-switch-img" src="@/assets/account.png"/>
                         <img @click="switchLoginMethod()" v-if="loginMethod=='account'" class="login-switch-img" src="@/assets/qrcode.png"/> 
                         
                    </div>
                    <div v-show="loginMethod=='account'" id="login-account" class="form-con">
                         <Form style="margin-top:50px;" ref="loginForm" :model="form" :rules="rules">
                            <FormItem prop="userName">
                                <Input v-model="form.userName" placeholder="请输入用户名">
                                </Input>
                            </FormItem>
                            <FormItem prop="password">
                                <Input type="password" v-model="form.password" placeholder="请输入密码">
                                </Input>
                            </FormItem>
                            <FormItem prop="verificationCode">
                            </FormItem>
                            <FormItem>
                                <Button @click="handleSubmit" type="primary" long>登录</Button>
                            </FormItem>
                              <FormItem @click="register" style="text-align:right;color:#2d8cf0;cursor:pointer;">
                                  <a @click="resetPwd">忘记密码?</a>
                                  <!-- <a @click="register">注册账号</a> -->
                              </FormItem>
                        </Form>
                    </div>
                    <div v-show="loginMethod!='account'" id="login_qrcode">
                   </div>
                </Card>
            </div>
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie';
import JSEncrypt from 'jsencrypt/bin/jsencrypt';
import socket from 'libs/socket';
import util from '@/libs/util.js';


export default {
    data() {
        return {
            form: {
                userPwd:'',//存放加密后密码 用于自动登录
                userName: '',
                password: '',
                verificationCodeUrl: 'https://m.dev.daimatu.cn/admin/passport/code'
            },
            loginMethod: 'account', //登录方式 账户名：account  钉钉扫码：dingdingScan
            rules: {
                userName: [{
                    required: true,
                    message: '账号不能为空',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '密码不能为空',
                    trigger: 'blur'
                }]
            }
        };
    },
    methods: {
        refreshVerificationCode() {
            this.form.verificationCodeUrl = 'https://m.dev.daimatu.cn/admin/passport/code?' + '?v=' + Math.random()
        },
        handleSubmit() {
            this.$refs.loginForm.validate((valid) => {
                if(this.userPwd){
                    valid= true
                }
                if (valid) {
                    var encrypt = new JSEncrypt();
                    encrypt.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4twvFaGUZLb2Lq8sbj/Omz+kgSX2cJtqMtnT0/1itOiP4o7nGZ6zoo8UX+4iQk99ZAAUslN3cPiV42fkJ23MWp25MjDMTRW/VnWSZYndaqoqVdPh+mniEonSz8dHy4nfiH9D1vfdQooKSOsIPtsCE5njMiDR0fS7EGInF+I9ogwIDAQAB');
                    var password = encrypt.encrypt(this.form.password);
                    if(this.userPwd){
                       password = this.userPwd
                    }
                    this.request('AdminLogin', {
                        ver: '1',
                        ts: Date.parse(new Date()),
                        sign: '',
                        methods: 'login',
                        data: {
                            userAccount: this.form.userName,
                            pwd: password
                        }
                    }, true).then((res) => {
                        if (res.code == -1) {
                            this.$Message.error(res.msg);
                        } else {
                            this.$Message.success(res.msg);
                            window.sessionStorage.setItem('password', password);
                            window.sessionStorage.setItem('userAccount',this.form.userName);
                            window.sessionStorage.setItem('token', res.data.token);
                            window.sessionStorage.setItem('userinfo', JSON.stringify(res.data));
                            window.localStorage.setItem('userAccount',this.form.userName)
                            window.localStorage.setItem('password',password)
                            Cookies.set('user', res.data.userName);
                            Cookies.set('userId', res.data.userId);
                            Cookies.set('password', password);
                            // Cookies.set('validate', this.form.validate);
                            // Cookies.set('isActive', this.form.isActive);
                            this.$router.push({
                                name: 'home_index'
                            });
                            this.$nextTick(() => {
                                let data = {
                                    type: 'message',
                                    userId: JSON.parse(window.sessionStorage.getItem('userinfo')).userId
                                }
                                socket(data);
                            })
                        }
                    });
                }
            });
        },
        directLogin(){
                      if( window.sessionStorage.getItem('share')!=1) return 
                        let password=window.sessionStorage.getItem('password');
                        let userAccount=window.sessionStorage.getItem('userAccount')
                        this.request('AdminLogin', {
                            ver: '1',
                            ts: Date.parse(new Date()),
                            sign: '',
                            methods: 'login',
                            data: {
                                userAccount: window.sessionStorage.getItem('userAccount'),
                                pwd: window.sessionStorage.getItem('password')
                            }
                        }, true).then((res) => {
                            if (res.code == -1) {
                                // this.$Message.error(res.msg);
                            } else {
                                // this.$Message.success(res.msg);
                                // console.log(password,'0000000')
                                window.sessionStorage.setItem('userAccount',userAccount);
                                window.sessionStorage.setItem('password',password);
                                window.sessionStorage.setItem('token', res.data.token);
                                window.sessionStorage.setItem('userinfo', JSON.stringify(res.data));
                                window.localStorage.setItem('userAccount',userAccount)
                                window.localStorage.setItem('password',password)
                                Cookies.set('user', res.data.userName);
                                Cookies.set('userId', res.data.userId);
                                Cookies.set('password',password);
                                // Cookies.set('validate', this.form.validate);
                                // Cookies.set('isActive', this.form.isActive);
                                this.$router.push({
                                    name: window.sessionStorage.getItem('path')
                                });
                                this.$nextTick(() => {
                                    let data = {
                                        type: 'message',
                                        userId: JSON.parse(window.sessionStorage.getItem('userinfo')).userId
                                    }
                                    socket(data);
                                })
                            }
                        });
            },
        register() {
            this.$router.push({
                name: 'register'
            });
        },
        resetPwd() {
            this.$router.push({
                name: 'resetPwd'
            });
        },
        switchLoginMethod() {
            if (this.loginMethod == 'dingdingScan') {
                this.loginMethod = 'account';
            } else {
                this.loginMethod = 'dingdingScan';
            }
        }
    },
    mounted() {
      
        var appId = util.getDingtalkAppId()
        var REDIRECT_URI = 'http://'+window.location.host+'/login';
        var goto = 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=' + appId +
            '&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=' + REDIRECT_URI;
        var obj = DDLogin({
            id: "login_qrcode", //这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
            goto: encodeURIComponent(goto),
            style: "border:none;background-color:#FFFFFF;",
            width: "300",
            height: "300"
        }); 

        var hanndleMessage = function (event) {
            var origin = event.origin;
            if (origin == "https://login.dingtalk.com") { //判断是否来自ddLogin扫码事件。
                var loginTmpCode = event.data; //拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
                location.href = goto + '&loginTmpCode=' + loginTmpCode
            }
        };

        if (typeof window.addEventListener != 'undefined') {
            window.addEventListener('message', hanndleMessage, false);
        } else if (typeof window.attachEvent != 'undefined') {
            window.attachEvent('onmessage', hanndleMessage);
        }

        let code = this.$route.query.code
        if (code) {
            this.request('scan_login', {
                code: code,
                appId:appId
            }, false).then((res) => {
                if (res.errno == 1000) {
                    this.$router.push({
                        name: 'login'
                    });
                } else if(res.errno==0) {
                    if(res.data.platFormAuthId){//未绑定
                    this.$router.push({
                        name: 'platformAuth',
                        params: {
                            platFormAuthId: res.data.platFormAuthId
                        }
                    });
                    }else if(res.data.userAccount&&res.data.userPwd){//直接登录
                         this.loginMethod = 'dingdingScan';
                         this.form.userName = res.data.userAccount
                         this.userPwd = res.data.userPwd
                         this.handleSubmit()//自动登录
                    }
                }
            })
        }

        let userAccountOther = this.$route.params.userAccount
        let userPwdOther = this.$route.params.userPwd
        if(userAccountOther&&userPwdOther){
            this.loginMethod = 'dingdingScan'
            this.userPwd = userPwdOther
            this.form.userName = userAccountOther
            this.handleSubmit()
        }

        let loginMethod = this.$route.params.loginMethod
        if(loginMethod=='scanDingtalk'){
             this.loginMethod='dingdingScan'
        }
         this.directLogin()
    }
}
</script>