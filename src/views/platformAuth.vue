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
               <span class="title">EOP管理平台 | 账号绑定</span>
            </Col>
            <Col span="4" offset="9">
             <span @click="login" class="logintip">登录</span>
            </Col>
        </Row>
           <Row style="padding-top: 25vh;" type="flex" justify="space-around">
            <Col span="6" style="margin-top:60px;">
            <Form ref="platformAuthForm" :model="platformAuthForm" :rules="rules" :label-width="90">
                <FormItem style="width:300px;" label="账号：">
                    <Input v-model="platformAuthForm.account" placeholder="用户名"></Input>
                </FormItem>
                <FormItem  prop="pwd" style="width:300px;" label="密码：">
                    <Input type="password" v-model="platformAuthForm.pwd" autocomplete="off" placeholder="请输入密码"></Input>
                </FormItem>
                <FormItem style="text-align:center;width:300px;">
                    <Button type="primary"  @click="submit">绑定</Button>
                </FormItem>
            </Form>
            </Col>
           </Row>
    </div>
</template>

<script>
    import Util from '../libs/util'
    export default {
        name: 'platformAuth',
        desc: '绑定账户',
        data() {
            return {
                platformAuthForm: {
                    account: '',
                    pwd: ''
                },
                platFormAuthId: '',
                rules: {}
            };
        },
        methods: {
            submit() {
                this.$refs['platformAuthForm'].validate((valid) => {
                    console.log(this.platFormAuthId)
                    let newPwd = Util.JSEncrypt('encrypt', this.platformAuthForm.pwd);
                    if (valid) {
                        this.request('create_platform_auth_account', {
                            userPwd: newPwd,
                            platFormAuthId: this.platFormAuthId,
                            userAccount: this.platformAuthForm.account
                        }, '正在绑定账号...').then((res) => {
                            if (res.errno == 0 ) {
                                this.$Message.info('绑定成功');
                                this.$router.push({
                                    name: 'login',
                                    params: {
                                        userAccount: res.data.userAccount,
                                        userPwd: res.data.userPwd
                                    }
                                });
                            }else{
                                  this.$Message.info('绑定失败,返回信息：'+res.errmsg);
                            }
                        })
                    }
                })
            },
            login() {
                this.$router.push('/login')
            }
        },
        mounted() {
            this.platFormAuthId = this.$route.params.platFormAuthId
        }
    }
</script>