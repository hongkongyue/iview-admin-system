<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">  
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="品牌:"  :label-width="50">
                    <Select v-model="formSearch.brandId"  style="width:120px" >
                        <Option v-for="item in brandList" :value="item.brandId" :key="item.brandId">{{ item.brandName }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="处理人:">
                    <Select @on-change="employeeChange"  v-model="formSearch.userId" filterable style="width:170px">
                        <Option v-for="item in employeeList" :value="item.userId" :key="item.userId">{{item.userName}}</Option>
                    </Select>
                </Form-item>
                <Form-item :label-width="1">
                    <Button type="primary" @click="search">查询</Button>
                    <Button type="default" @click="handleReset">重置</Button>
                    <Button type="primary" @click="newAdd">新增</Button>
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
        <Modal v-model="visible" title="新增" @on-ok='save' @on-cancel='cancel' :width="50" class-name="customize-modal-center">
            <Row class="margin-bottom-10 background-color-white exhibition">
                <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="品牌:"  :label-width="50">
                    <Select  v-m @on-change="dataChange" v-model="formSearch.brandIdTwo"  style="width:120px" >
                        <Option v-for="item in brandList" :value="item.brandId" :key="item.brandId">{{ item.brandName }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="处理人:">
                    <Select @on-change="employeeChange"  v-model="formSearch.userIdTwo" filterable style="width:150px">
                        <Option v-for="item in employeeList" :value="item.userId" :key="item.userId">{{item.userName}}</Option>
                    </Select>
                </Form-item>
                </Col>
            </Form>
            </Row>
        </Modal>
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
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth:100,
                         render: (h, params) => {
                            let zhan = this.brandListTwo;
                            if (params.row.$isEdit) {
                                return h('Select', {
                                    props: {
                                        minWidth:100,
                                        placeholder:params.row.brandName
                                    },
                                    style: {
                                            minWidth:'100px'
                                        },
                                    on: {
                                        "on-change": (event) => {
                                            this.formSearch.C= event
                                        }
                                    },
                                },
                                zhan.map(function (item) {
                                    return h('Option', {
                                        props: {
                                            value:item.brandId
                                        }
                                    },item.brandName)
                                })
                                );
                            } else {
                                return h('span', params.row.brandName)
                            }
                        },
                    },
                    {
                        title: '处理人',
                        key: 'userName',
                        align: 'center',
                        minWidth:100,
                         render: (h, params) => {
                            let zhan = this.employeeListTwo;
                            if (params.row.$isEdit) {
                                return h('Select', {
                                    props: {
                                        filterable:true,
                                        placeholder:params.row.userName
                                    },
                                     style: {
                                        },
                                    on: {
                                        'on-change': (value) => {
                                            this.formSearch.A = value
                                        }
                                    },
                                },
                                zhan.map(function (item) {
                                    return h('Option', {
                                        props: {
                                            value:item.userId
                                        },
                                    },item.userName)
                                })
                                );
                            } else {
                                return h('span', params.row.userName)
                            }
                        },
                    },
                    
                    {
                        title: '创建人',
                        key: 'createUser',
                        align: 'center',
                    },
                    {
                        title: '创建时间',
                        key: 'created',
                        align: 'center',
                    },
                    {
                        title: '修改人',
                        key: 'lastUpdateUser',
                        align: 'center',
                    },
                    {
                        title: '修改时间',
                        key: 'lastUpdated',
                        align: 'center',
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
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '该行将会删除，请确认！',
                                                onOk: () => {
                                                     this.tableDelete(params);
                                                },
                                                onCancel: () => {
                                                    this.$Message.warning('已取消删除');
                                                }
                                           
                                        })
                                     }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ],
                 formSearch: {
                    brandId:'',//品牌id
                    userId:'',//处理人id
                },
                visible:false,
                total: 0,
                page: 1,
                pageSize: 10,
                list:[],
                optionList:[
                    {valeu:'1',label:'北京2222222'},
                    {valeu:'2',label:'上海'},
                    {valeu:'3',label:'杭州'}
                    
                ],
                employeeList:[],
                employeeListTwo:[],
                brandList:[],
                brandListTwo:[],
                seasonList:[]
            }
        },
        mounted() {
            this.getEmployeeList()
            this.getbrandList()
            this.getData()
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
        },
        activated() {
        },
        methods: {
            //获取处理人列表
             getEmployeeList() {
                this.request('get_user_list_all', {}, false).then((res) => {
                    if (res.code == 1) {
                        this.employeeList = res.data
                        this.employeeListTwo = res.data
                        // this.formSearch.A = 
                        // this.formSearch.C 
                    }
                })
            },
            // 确定新增
           save(){
                let data = {}
                data.brandId = this.formSearch.brandIdTwo
                data.brandName = this.formSearch.brandNameTwo
                data.userId =this.formSearch.userIdTwo
                data.userName = this.formSearch.userNameTwo
                data.createUser = this.userInfo.userName
                this.request('add_user_config', {data}, false).then((res) => {
                    if(res.code==1){
                        this.visible = false; 
                        this.getData();
                        this.formSearch = {}
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
            dataChange(){
                for (let item of this.brandList) {
                    if (item.brandId == this.formSearch.brandIdTwo) {
                        this.formSearch.brandNameTwo = item.brandName
                        break;
                    }
                }
            },
            employeeChange(){
                for (let item of this.employeeList) {
                    if (item.userId == this.formSearch.userIdTwo) {
                        this.formSearch.userNameTwo = item.userName
                        break;
                    }
                }
            },
            getbrandList(){
                 this.request('get_scm_brand_list', {}, false).then((res) => {
                    if(res.code==1){
                      this.brandList=res.data
                      this.brandListTwo=res.data
                    }
                })    
            },
            //获取table数据
            getData(){
                let data = {}
                    data.start = (this.page - 1)*this.pageSize
                    data.length = this.pageSize
                    this.formSearch.userId ? data.userId = this.formSearch.userId : delete data.userId
                    this.formSearch.brandId ? data.brandId = this.formSearch.brandId : delete data.brandId
                this.request('get_user_config_list', {data}, false).then((res) => {
                    if(res.code==1){
                      this.list=res.data.userConfigList
                      this.total = res.data.count
                    }
                })
            },
            //重置
            handleReset(){
                this.formSearch = {}
            },
            //查询
            search(){
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
                let data = {}
                data.brandId = this.formSearch.C
                data.userId = this.formSearch.A
                data.lastUpdateUser = this.userInfo.userName
                data.id = prame.id
                this.request('edit_user_config', {data}, false).then((res) => {
                    if(res.code==1){
                     this.getData()
                    }
                })
            },
            //删除 
            tableDelete(prame){
                let data = {}
                data.id = prame.row.id
                 this.request('delete_user_config', {data}, false).then((res) => {
                    if(res.code==1){
                        this.$Message.success('删除人员配置成功')
                    //  this.list.splice(data.index, 1);
                     this.getData()
                    }
                })
            },
            //新增
            newAdd(){
                this.visible = true
            },
            //取消新增
            cancel(){
                this.visible = false
                this.formSearch = {}
            },
        }
    }
</script>

<style>

</style>
