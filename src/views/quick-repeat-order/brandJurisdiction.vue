<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">  
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="部门:"  :label-width="50">
                    <Select v-model="formSearch.department" @on-change="changeDepart" filterable :label-in-value="true" style="width:120px" >
                        <Option v-for="item in departmentList" :value="item.id" :key="item.id">{{ item.label }}</Option>
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
        <Modal v-model="visible" :title="titleModal" footer-hide  @on-cancel='cancel' :width="650" class-name="customize-modal-center">
            <Row class="margin-bottom-10 background-color-white exhibition">
                <Form :model="formAdd" :rules="ruleValidate" ref="formAdd" :label-width="80" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="部门:" prop="department">
                    <Select v-model="formAdd.department" filterable :disabled="disabled" @on-change="changeDepartment(formAdd.department)"  style="width:180px" >
                        <Option v-for="item in departmentList" :value="item.id" :key="item.brandId">{{ item.label}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="品牌:" prop="brand">
                    <Select  v-model="formAdd.brand" filterable @on-change="changeBrand(formAdd.brand)" style="width:180px" >
                        <Option v-for="item in brandList" :value="item.brandName" :key="item.brandId">{{ item.brandName }}</Option>
                    </Select>
                </Form-item>
                </Col>
                <div style="margin-top:20px;text-align:center">
                    <Button type="primary" @click="save(titleModal)">确认</Button>
                    <Button  @click="cancel">取消</Button>
                </div>
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
                disabled:false,
                columns: [{
                        title: '序号',
                        type:'index',
                        align: 'center',
                        width: 60,
                    },
                    {
                        title: '部门',
                        key: 'title',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '品牌',
                        key: 'basicBrandName',
                        align: 'center',
                        minWidth:100,
                    },
                    
                    {
                        title: '维护人',
                        key: 'remark',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '创建时间',
                        key: 'created',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '修改时间',
                        key: 'updated',
                        align: 'center',
                        minWidth:100,
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
                formAdd:{
                    department:'',
                    brand:''
                },
                ruleValidate:{
                    department: [
                        { required: true, message: '请选择', trigger: 'change' }
                    ],
                    brand: [
                        { required: true, message: '请选择', trigger: 'change' }
                    ],
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
                departmentList:[],
                seasonList:[
                    {name:'春季'},
                    {name:'夏季'},
                    {name:'秋季'},
                    {name:'冬季'}
                ],
                brandId:'',
                brandCode:'',
                objItem:{},
                titleModal:'',
                rowObj:{},
            }
        },
        mounted() {
            this.getDepartment()
            // this.getData()
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
        },
        activated() {
        },
        methods: {
            changeDepartment(id){
                let objItem = {}
                this.departmentList.map(x => {
                    if(id == x.id){
                        objItem = x
                    }
                })
                this.objItem = objItem
            },
            changeBrand(name){
                let brandId = ''
                let brandCode = ''
                this.brandList.map(x => {
                    if(name == x.brandName){
                        brandId = x.brandId
                        brandCode = x.brandId
                    }
                })
                this.brandId = brandId
                this.brandCode = brandCode
            },
            // 确定新增
           save(name){
                this.$refs["formAdd"].validate((valid) => {
                    if (valid) {
                        let data = {}
                        if(name == '新增'){
                            data.createId = this.userInfo.userId
                            data.createUser = this.userInfo.userName
                        }else{
                            data.id = this.rowObj.id
                            data.updateId = this.userInfo.userId
                            data.updateUser = this.userInfo.userName
                        }
                        data.label = this.objItem.label
                        data.title = this.objItem.title
                        data.unitPath = this.objItem.unit_path
                        data.departmentId = this.formAdd.department
                        data.basicBrandId = this.brandId
                        data.basicBrandCode = this.brandCode.toString()
                        data.basicBrandName = this.formAdd.brand
                        this.request('saveOrUpdateBrandPermissions', {data}, false).then((res) => {
                            if(res.code==1){
                                this.visible = false; 
                                this.getData();
                                this.$Message.success(res.msg)
                                this.brandId = '',
                                this.brandCode = '',
                                this.objItem = {},
                                this.titleModal = '',
                                this.rowObj = {},
                                this.formAdd = {},
                                this.$refs["formAdd"].resetFields();
                            }
                        })
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
            //获取部门下拉
            getDepartment(){
                 this.request('get_oa_department_list', {}, false).then((res) => {
                    if(res.code==1){
                      this.departmentList=res.data
                    }
                })    
            },
            //品牌
            getbrandList(){
                 this.request('get_scm_brand_list', {}, false).then((res) => {
                    if(res.code==1){
                      this.brandList=res.data
                    }
                })    
            },
            //获取table数据
            getData(){
                let data = {}
                    data.start = (this.page - 1)*this.pageSize
                    data.length = this.pageSize
                    data.departmentId = this.formSearch.department
                this.request('getBrandPermissions', {data}, true).then((res) => {
                    if(res.code==1){
                      this.list=res.data.results
                      this.total = res.data.totalRecord
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
            //编辑
            handleSave(row){
                this.disabled = true
                this.getbrandList()
                console.log(row,'////')
                this.titleModal = '编辑'
                this.visible = true
                this.rowObj = row
                this.formAdd.department = row.departmentId
                this.formAdd.brand = row.basicBrandName
                this.objItem.label = row.label
                this.objItem.title = row.title
                this.objItem.unit_path = row.unit_path
                this.brandId = row.basicBrandId
                this.brandCode = row.basicBrandCode
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
                        this.$Message.success(res.msg)
                     this.getData()
                     this.$refs["formAdd"].resetFields();
                    }
                })
            },
            //删除 
            tableDelete(prame){
                let data = {}
                data.id = prame.row.id
                data.updateId = this.userInfo.userId
                data.updateUser = this.userInfo.userName
                 this.request('deletedBrandPermissions', {data}, false).then((res) => {
                    if(res.code==1){
                        this.$Message.success(res.msg)
                        this.getData()
                    }
                })
            },
            //新增
            newAdd(){
                this.disabled = false
                this.visible = true
                this.titleModal = '新增'
                this.getbrandList()
            },
            //取消新增
            cancel(){
                this.visible = false
                this.formAdd = {}
                this.$refs["formAdd"].resetFields();
            },
        }
    }
</script>

<style>

</style>
