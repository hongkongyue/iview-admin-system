<style lang="less">
    .header {
        height: 50px;
        background-color: #48A1EF;
        .title{
             line-height:50px;
             color:white;
             font-size: 20px;
        }
        .logintip{
            font-size: 15px;
            line-height:50px;
            color:white;
            cursor: pointer;
        }
    }
</style>

<template>
    <div style="background-color:white;height:100%;">
        <Row class="header">
            <Col span="6" offset="5">
               <span class="title">EOP管理平台 | 重置密码</span>
            </Col>
            <Col span="4" offset="9">
             <span @click="login" class="logintip">登录</span>
            </Col>
        </Row>
        <Row style="padding-top: 25vh;" type="flex" justify="space-around">
            <Col span="16" offset="4">
            <Steps :current="currentStep">
    
                <Step content="填写账号信息"></Step>
    
                <Step content="身份验证"></Step>
    
                <Step title="" content="设置新密码"></Step>
    
                <Step title="" content="完成"></Step>
            </Steps>
            </Col>
            <Col span="6" style="margin-top:60px;">
            <Form ref="resetPwdForm" :model="resetPwdForm" :rules="rules" :label-width="90">
                <FormItem v-show="currentStep==0" style="width:300px;" label="账号：">
                    <Input v-model="resetPwdForm.account" placeholder="用户名/邮箱地址"></Input>
                </FormItem>
                <FormItem v-show="currentStep==1" style="width:300px;" label="验证码：">
                    <Input v-model="resetPwdForm.code" placeholder="输入邮箱收到的验证码"></Input>
                </FormItem>
    
                <FormItem v-show="currentStep==2" prop="pwd" style="width:300px;" label="新密码：">
                    <Input type="password" v-model="resetPwdForm.pwd" autocomplete="off" placeholder="请输入密码"></Input>
                </FormItem>
                <FormItem v-show="currentStep==2" prop="checkpwd" style="width:300px;" label="确认新密码：">
                    <Input type="password" v-model="resetPwdForm.checkpwd" autocomplete="off" placeholder="请再次输入密码"></Input>
                </FormItem>
    
                <div v-show="currentStep==3">
                    <div style="text-align:center">
                        <Icon size="50" color="#40C337" type="checkmark-circled"></Icon>
                    </div>
                    <div style="font-size:20px;text-align:center;margin-top:30px;">
                        修改密码成功，请<a href="/login">点击这里</a>重新登录
                    </div>
                </div>
                <FormItem style="text-align:center;width:300px;">
                    <Button v-show="currentStep ==1" type="primary" @click="lastStep" >上一步</Button>
                    <Button v-show="currentStep<2" type="primary" @click="nextStep">下一步</Button>
                    <Button type="primary" v-show="currentStep==2" @click="submit">确定</Button>
                </FormItem>
            </Form>
            </Col>
        </Row>
    </div>
</template>

<script>
    import Util from '../libs/util'
    export default {
        name: 'resetPwd',
        desc: '重置密码',
        data() {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.resetPwdForm.checkpwd !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.resetPwdForm.validateField('checkpwd');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入你的密码'));
                } else if (value !== this.resetPwdForm.pwd) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            };
    
            return {
                currentStep: 0,
                form: {
                    userName: '',
                    password: '',
                },
                resetPwdForm: {
                    email: ''
                },
                rules: {
                    pwd: [{
                        validator: validatePass,
                        trigger: 'blur'
                    }],
                    checkpwd: [{
                        validator: validatePassCheck,
                        trigger: 'blur'
                    }],
                }
            };
        },
        methods: {
            lastStep(){
               this.currentStep = 0;
            },
            nextStep() {
                if (this.currentStep == 0) {
                    if(!this.resetPwdForm.account){
                         this.$Message.warning('请输入账号或邮箱地址');
                         return;
                    }
                    this.request('update_pwd_send_email_code', {
                        data: {
                            mail: this.resetPwdForm.account
                        }
                    }, true).then((res) => {
                        if (res.code == 1) {
                            this.$Message.info(res.msg);
                            this.currentStep = 1;
                            this.resetPwdForm.email = res.data;
                        }
                    })
                } else if (this.currentStep == 1) {
                    if(!this.resetPwdForm.code){
                         this.$Message.warning('请输入邮箱收到的验证码');
                         return;
                    }
                    this.request('CheckEmailCode', {
                        data: {
                            mail: this.resetPwdForm.email,
                            code: this.resetPwdForm.code
                        }
                    }, true).then((res) => {
                        if (res.code == 1) {
                            this.$Message.info(res.msg);
                            this.currentStep = 2;
                        }
                    })
                } else if (this.currentStep == 2) {
                    this.request('update_pwd_by_email_code', {}, true).then((res) => {
                        if (res.code == 1) {
                            this.currentStep = 3;
                        }
                    })
                }
            },
            submit() {
                this.$refs['resetPwdForm'].validate((valid) => {
                    let newPwd = Util.JSEncrypt('encrypt',this.resetPwdForm.pwd);
                    if (valid) {
                        this.request('update_pwd_by_email_code',{
                            data:{
                                newPwd:newPwd,
                                mail:this.resetPwdForm.email
                            }
                        },true).then((res)=>{
                            if(res.code==1){
                                this.$Message.info(res.msg);
                                this.currentStep = 3;
                            }
                        })
                    }
                })
            },
            login(){
                this.$router.push('/login')
            }
        },
        mounted() {
    
        }
    }
</script>