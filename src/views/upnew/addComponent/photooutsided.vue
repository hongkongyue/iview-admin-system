<template>
    <div>
        <!-- 数据列表 -->
        <Row class="background-color-white exhibition" style="min-height:630px;padding-left:0px">
            <!--  -->
            <!-- <Table  ref="currentRowTable"  @on-row-dblclick="showChakan"	@on-row-click="selectRow" @on-select-cancel="choiceId" @on-select-all-cancel="choiceId"  @on-select="choiceId" @on-select-all="choiceId"	:columns="columns" size="small" highlight-row :data="list"></Table> -->
            <Table  :columns="columns" size="small" highlight-row :data="list"></Table>
            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total
                show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
        </Row>
    </div>
</template>

<script>
    import Util from 'libs/util';
    function formSearch() { 
        return {
            search: ''
        }
    }
    export default {
        data() {
            return {
                visible: false,
                list:[],
                columns: [
                     {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        minWidth: 70,

                    },
                    {
                        title: '任务编号',
                        key: 'taskCode',
                        align: 'center',
                        minWidth: 90,
                    },
                    {
                        title: '任务名称',
                        key: 'taskName',
                        align: 'center',
                        minWidth: 90,
                    },
                    {
                        title: '触发人',
                        key: 'createUser',
                        align: 'center',
                        minWidth: 120,
                    },
                    {
                        title: '到达时间',
                        key: 'created',
                        align: 'center',
                        minWidth: 120,
                    },
                    {
                        title: '完成时间',
                        key: 'lastUpdated',
                        align: 'center',
                        minWidth: 120,
                    },
                     {
                        title: '共计时长',
                        key: 'totalTime',
                        align: 'center',
                        minWidth: 120,
                     },
                     {
                        title: '操作',
                        key: 'lastUpdateUser',
                        align: 'center',
                        minWidth: 220,
                        fixed :'right',
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
                                        click: () => {
                                                  this.$router.push({
                                                          name:'photooutsidecomplated',
                                                          query: {   
                                                              taskCode: params.row.taskCode
                                                         }
                                                 })
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
                               ]);  
                        },
                    },
                ],
                userInfo: {},
                total: 0,
                page: 1,
                pageSize: 10,
                formSearch: {
                },
                brandList:[],          //品牌列表
                modal_visible:false,   // 编 
            }
        },
        mounted() {
                this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo')); 
                this.getData()
        },
        activated() {

        },
        methods: {
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
           search() {
                        this.page =1
                        this.getData()
                },  
            currentChange(page) {
                    this.page = page
                    this.getData()
                },
            sizeChange(pageSize) {
                    this.pageSize = pageSize
                    this.getData()
                },

            //初始化第一个列表数据
            getData() {
                    
                      let data={};
                               data.length         =  this.pageSize;
                               data.start          = (this.page - 1) * this.pageSize
                               data.taskStatus= 900
                               data.userId    = this.userInfo.userId
                    this.request('productlaunch_getTaskOutdoorPhotoList', {data:data}, true).then((res) => {
                        if (res.code == 1) {
                            let serialNoBegain = this.pageSize * (this.page - 1);
                                res.data.outdoorPhotoList.forEach((item) => {
                                    serialNoBegain++;
                                    item.serialNo = serialNoBegain;
                                })
                                this.list = res.data.outdoorPhotoList;
                                this.total = res.data.count;
                        }else{
                            this.list      = []
                            this.total     = '0' 
                        }
                    })

                },
        }       
    }
</script>

<style>
    .ivu-modal-footer{
        border-top:0;
    }
        .demo-upload-list{
            display: inline-block;
            width: 60px;
            height: 60px;
            text-align: center;
            line-height: 60px;
            border: 1px solid transparent;
            border-radius: 4px;
            overflow: hidden;
            background: #fff;
            position: relative;
            box-shadow: 0 1px 1px rgba(0,0,0,.2);
            margin-right: 4px;
        }
        .demo-upload-list img{
            width: 100%;
            height: 100%;
        }
        .demo-upload-list-cover{
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,.6);
        }
        .demo-upload-list:hover .demo-upload-list-cover{
            display: block;
        }
        .demo-upload-list-cover i{
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            margin: 0 2px;
        }
</style>
