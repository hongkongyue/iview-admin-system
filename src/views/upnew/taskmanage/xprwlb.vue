<template>
    <Layout>
        <Content>
             <Row class="background-color-white exhibition">
                <Tabs style="min-height:880px;padding-left:0px" type="card" @on-click='changeTab(changeTabs)' v-model='changeTabs'>
                        <TabPane label="待完成" name='dwc'>
                        <Row class="background-color-white exhibition" style="min-height:630px;padding-left:0px">
                            <div @click="handleSave(item)" v-model="changeRoute" v-for="item in List" :value="item.id" :key="item.id" style="margin-bottom:10px;background-color:#f5f7f9">
                                <Row  style="height:80px;line-height:80px;font-size:16px">
                                    <Col span="2">
                                            <Icon type="md-notifications"  class="f16 pl20"/>
                                    </Col> 
                                    <Col span="15">
                                                {{item.taskCode}} - {{'你的'}}{{item.taskName}}{{'已送达，马上去完成吧！'}}
                                    </Col>  
                                    <Col span="2">
                                                {{item.createUser}}
                                    </Col> 
                                    <Col span="5" style="position:relative"  class="f14"> 
                                               {{item.created}}
                                            <i class="iconfont icondian  red absolute"></i>
                                    </Col>   
                                </Row>
                         </div>
                            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total
                                show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
                                </Row>
                        </TabPane>
                        <TabPane label="进行中" name='jxz'>
                            <Row class="background-color-white exhibition" style="min-height:630px;padding-left:0px">
                                <Table :columns="columns" size="small" highlight-row :data="list1" @on-row-dblclick="edit"></Table>
                                <Page style="margin-top:5px;" :total="total1" :page-size="pageSize1" :current="page1" show-sizer show-total
                                show-elevator @on-change="currentChange1" @on-page-size-change="sizeChange1"></Page>
                            </Row>
                        </TabPane>
                        <TabPane label="已完成" name='ywc'>
                            <Row class="background-color-white exhibition" style="min-height:630px;padding-left:0px">
                                <Table :columns="columns2" size="small" highlight-row :data="list2" @on-row-dblclick="edit"></Table>
                                <Page style="margin-top:5px;" :total="total2" :page-size="pageSize2" :current="page2" show-sizer show-total
                                show-elevator @on-change="currentChange2" @on-page-size-change="sizeChange2"></Page>
                            </Row>
                        </TabPane>
                </Tabs>
             </Row>
       </Content>
    </Layout>   
</template> 

<script>
    // import Util from 'libs/util';
    // import axios from 'axios';
         import filter from '../../../filter'

    export default {
        data(){
            return {
                userInfo:'',//缓存
                columns: [{
                        title: '序号',
                        type:'index',
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: '任务编号',
                        key: 'taskCode',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '任务名称',
                        key: 'taskName',
                        align: 'center',
                        minWidth:100,
                    },
                    
                    {
                        title: '触发人',
                        key: 'createUser',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '到达时间',
                        key: 'created',
                        align: 'center',
                        minWidth:150,
                    },
                    {
                        title: '倒计时',
                        key: 'countDown',
                        align: 'center',
                        minWidth:150,
                        render:(h,params) => {
                           return h('span', filter.FreshTime(params.row.countDown/1000))
                        }
                    },
                    {
                        title: '操作',
                        key: 'operate',
                        minWidth: 150,
                        fixed: 'right',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        width:'100px'
                                    },
                                    on: {
                                        click: (e) => {
                                            this.handleSave(params.row)
                                        }
                                    }
                                }, '进入'),
                            ])
                        }
                    }
                ],
                columns2: [{
                        title: '序号',
                        type:'index',
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: '任务编号',
                        key: 'taskCode',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '任务名称',
                        key: 'taskName',
                        align: 'center',
                        minWidth:100,
                    },
                    
                    {
                        title: '触发人',
                        key: 'createUser',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '到达时间',
                        key: 'created',
                        align: 'center',
                        minWidth:150,
                    },
                    {
                        title: '完成时间',
                        key: 'lastUpdated',
                        align: 'center',
                        minWidth:150,
                    },
                    {
                        title: '共计时长',
                        key: 'totalTime',
                        align: 'center',
                        minWidth:150,
                    },
                    {
                        title: '操作',
                        key: 'operate',
                        minWidth: 150,
                        fixed: 'right',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        width:'50px'
                                    },
                                    on: {
                                        click: (e) => {
                                            this.handleSaveT(params.row)
                                        }
                                    }
                                }, '查看'),
                                 h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        width:'50px'
                                    },
                                    on: {
                                        click: (e) => {
                                            const {taskCode,taskName,projectCode}=params.row
                                            this.backTask(taskCode,taskName,projectCode)
                                        }
                                    }
                                }, '撤回'),
                            ])
                        }
                    }
                ],
                List:[],
                changeRoute:'',
                list1:[],
                list2:[],
                total: 0,
                page: 1,
                pageSize: 10,
                total1: 0,
                page1: 1,
                pageSize1: 10,
                total2: 0,
                page2: 1,
                pageSize2: 10,
                CountDown:'已超时',//倒计时
                changeTabs:'dwc',
                taskStatus:'100',
            }
        },
        mounted(){
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo')); 
            this.getData()//根据状态查询任务列表
        },
        activated(){

        },
        methods:{
             // 撤回任务号
            backTask(taskCode,taskName,projectCode){
                    let data={}
                        data.taskCode=taskCode
                        data.taskName=taskName
                        data.projectCode=projectCode
                        data.lastUpdateUser=this.userInfo.userName
                     this.request('productlaunch_recallTask', {data:data}, false).then((res) => {
                         if(res.code==1){
                                this.$Message.success('撤回成功')
                                this.getData()
                            }
                })
           },
            //根据状态查询任务列表
            getData(){
                let data = {}
                data.userId = this.userInfo.userId
                data.taskStatus = this.taskStatus
                if(this.taskStatus == '100'){
                    data.length = this.pageSize;
                    data.start = (this.page - 1) * this.pageSize;
                }else if(this.taskStatus == '400'){
                     data.length = this.pageSize1;
                    data.start = (this.page1 - 1) * this.pageSize1;
                }else if(this.taskStatus == '900'){
                     data.length = this.pageSize2;
                    data.start = (this.page2 - 1) * this.pageSize2;
                        }
                data.taskStatus = this.taskStatus
                 this.request('getTaskChoosePhotoList', {data}, false).then((res) => {
                    if(res.code==1){
                        if(this.taskStatus == '100'){
                            this.List = res.data.choosePhotoList
                            this.total = res.data.count
                        }else if(this.taskStatus == '400'){
                            this.list1 = res.data.choosePhotoList
                            this.total1 = res.data.count
                        }else if(this.taskStatus == '900'){
                            this.list2 = res.data.choosePhotoList
                            this.total2 = res.data.count
                        }
                    }
                })
            },
            //改变tabs选项
            changeTab(name){
                console.log(name)
                if(name == 'jxz'){
                    this.taskStatus = '400'
                    this.getData()
                }else if(name == 'ywc'){
                    this.taskStatus = '900'
                    this.getData()
                }else if(name == 'dwc'){
                    this.taskStatus = '100'
                    this.getData()
                }
            },
            //跳转详情页   
            handleSave(row){
                console.log(row,'popopopop')
                if(row.taskStatus == "400"){
                    console.log('zhan')
                    this.$router.push({
                        name: 'xpxq',
                        query: {
                        taskCode: row.taskCode,
                        taskName: row.taskName,
                         projectCode:row.projectCode
                        }
                    });
                }else{
                    console.log('chen')
                    let data = {}
                data.taskCode = row.taskCode
                data.taskName = row.taskName
                data.lastUpdateUser = this.userInfo.userName
                this.request('editDevelopTaskStatus', {data}, false).then((res) => {
                    if(res.code==1){
                        this.$router.push({
                        name: 'xpxq',
                        query: {
                        taskCode: row.taskCode,
                        taskName:row.taskName,
                        projectCode:row.projectCode
                        }
                    });
                    }
                })
                }
            },
            //跳转完成页
            handleSaveT(row){
                this.$router.push({
                    name: 'xpwcy',
                    query: {
                        taskCode: row.taskCode,
                        taskName:row.taskName,
                        projectCode:row.projectCode
                    }
                });
            },
            currentChange(val){
                console.log(val,'[p[p[p[')
                this.page = val;
                this.getData();
            },
            sizeChange(val){
                console.log(val,'[p[p[p[')
                this.pageSize = val;
                this.getData();
            },
            currentChange1(val){
                this.page1 = val;
                this.getData();
            },
            sizeChange1(val){
                this.pageSize1 = val;
                this.getData();
            },
            currentChange2(val){
                this.page2 = val;
                this.getData();
            },
            sizeChange2(val){
                this.pageSize2 = val;
                this.getData();
            },
        }
    }

</script>

<style>
   .f16{
       font-size:26px!important
   }
   .pl20{
       padding-left: 20px
   }
   .red{
       color:red;
   }
   .icondian{
       width:10px!important
   }
   .absolute{
      position: absolute;
      top:-10px;
      right: 30px;
   }
</style>