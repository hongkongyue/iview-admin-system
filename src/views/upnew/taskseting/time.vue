<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">  
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="时效方案:">
                    <Select v-model="formSearch.timeId" style="width:130px">
                        <Option v-for="item in timeList" :value="item.code" :key="item.code">{{item.projectName}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="任务名称:"  :label-width="80">
                    <Select v-model="formSearch.brandId"  style="width:130px" >
                        <Option v-for="item in brandList" :value="item.taskName" :key="item.id">{{ item.taskName }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="任务级:">
                    <Select v-model="formSearch.userId" style="width:130px">
                        <Option v-for="item in employeeList" :value="item" :key="item">{{item}}</Option>
                    </Select>
                </Form-item>
                
                <Form-item :label-width="1">
                    <Button type="primary" @click="search">查询</Button>
                    <Button type="default" @click="handleReset">重置</Button>
                </Form-item>
                </Col>
            </Form>
            
        </Row>
         <!-- 数据列表 -->
        <Row class="background-color-white exhibition">
            <Table :columns="columns" size="small" highlight-row :data="list" @on-row-dblclick="edit"></Table>
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
        name:'category',
        data() {
            return {
                columns: [{
                        title: '序号',
                        type:'index',
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: '任务名称',
                        key: 'taskName',
                        align: 'center',
                        minWidth:120,
                    },
                    {
                        title: '上一级任务名称',
                        key: 'upTaskName',
                        align: 'center',
                        minWidth:120,
                    },
                    
                    {
                        title: '任务级',
                        key: 'taskLevel',
                        align: 'center',
                        minWidth:120,
                    },
                    {
                        title: '任务时间/天',
                        key: 'taskTime',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                            if (params.row.$isEdit) {
                                return h('Input', {
                                    props: {
                                        placeholder:params.row.taskTime
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            this.changeTime = e.target.value
                                            console.log(params.row.taskTime,'popop')
                                        }
                                    },
                                },
                                );
                            } else {
                                return h('span', params.row.taskTime)
                            }
                        },
                    },
                    {
                        title: '创建时间',
                        key: 'createdStr',
                        align: 'center',
                        minWidth:120,
                    },
                    {
                        title: '修改时间',
                        key: 'lastUpdatedStr',
                        align: 'center',
                        minWidth:120,
                    },
                    {
                        title: '操作',
                        key: 'operate',
                        minWidth: 180,
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
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: (e) => {
                                            this.handleSave(params.row)
                                        }
                                    }
                                }, '编辑'),
                                 h('Button', {
                                    props: {
                                        // type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: (e) => {
                                            this.handleEdit(params.row)
                                        }
                                    }
                                }, '取消'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: (e) => {
                                            this.saveTable(params.row);
                                        }
                                    }
                                }, '保存'),
                            ])
                        }
                    }
                ],
                 formSearch: {
                    brandId:'',//任务名称
                    userId:999,//任务级
                },
                changeTime:'',
                total: 0,
                page: 1,
                pageSize: 10,
                list:[],
                employeeList:[],
                timeList:[],
                brandList:[],
            }
        },
        mounted() {
            this.getbrandList()//任务时效配置-所有任务名称&级别获取
            this.getData()  //获取数据列表
            this.gettimeList()
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
        },
        activated() {
        },
        methods: {
            gettimeList(){
                this.request('selectAllProjectCode', {}, false).then((res) => {
                    if(res.code==1){
                        this.timeList = res.data
                    }
                })    
            },
           currentChange(page){
               this.page = page
               this.getData()
           },
           sizeChange(pageSize){
               this.pageSize = pageSize
               this.getData()
           },
            getbrandList(){
                 this.request('selectAllNodeNamesAndLevels', {}, false).then((res) => {
                    if(res.code==1){
                      this.brandList=res.data.nameSet
                      this.employeeList=res.data.levelSet
                    }
                })    
            },
            //获取table数据
            getData(){
                console.log(this.formSearch.userId)
                let data = {}
                    data.start = (this.page - 1)*this.pageSize
                    data.length = this.pageSize
                    data.taskLevel = this.formSearch.userId
                    this.formSearch.timeId ? data.projectCode = this.formSearch.timeId : delete data.projectCode
                    this.formSearch.brandId ? data.taskName = this.formSearch.brandId : delete data.taskName
                this.request('selectPage', {data}, false).then((res) => {
                    if(res.code==1){
                        console.log(res.data,'[p[p[p[p[pp[p')
                      this.list=res.data.developTimeConfigList
                      this.total = res.data.count
                    }
                })
            },
            //重置
            handleReset(){
                this.formSearch.userId = 999
                this.formSearch.brandId = ''
                this.formSearch = {}
                this.search()
            },
            //查询
            search(){
                this.page = 1;
                this.getData()
            },
            handleSave(row){
                this.$set(row, '$isEdit', true)
            },
             handleEdit(row){
                this.$set(row, '$isEdit', false)
            },
            //编辑保存 
            saveTable(prame){
                if(this.changeTime == ''){
                    this.$Message.warning('请先编辑再保存')
                }else{
                    let data = {}
                    data.lastUpdateUser = this.userInfo.userName
                    data.taskTime = this.changeTime
                    data.id = prame.id
                    this.request('updateInfo', {data}, false).then((res) => {
                        if(res.code==1){
                        this.getData()
                        }
                    })
                }
            },
        }
    }
</script>

<style>

</style>
