<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">  
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="80" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="部门:" :label-width="40">
                    <Select v-model="formSearch.optionsBm" style="width:150px" @on-change="watchChange(formSearch.optionsBm)">
                        <Option v-for="item in departmentName" :value="item.org_department_id" :key="item.org_department_id">{{ item.org_department_name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="岗位:" :label-width="50">
                    <Select  v-model="formSearch.post_list" @on-change="ChangeGw(formSearch.post_list)" style="width:150px" >
                        <Option v-for="item in newList" :value="item.id" :key="item.id">
                            {{item.name}}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item label="处理人:">
                    <Select  v-model="formSearch.userId" filterable clearable ref="store" style="width:120px">
                        <Option v-for="item in personList" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="任务名称:">
                    <Select  v-model="formSearch.taskId" style="width:120px">
                        <Option v-for="item in employeeList" :value="item.id" :key="item.id">{{item.taskName}}</Option>
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
        <Modal v-model="visible"  title="新增" :footer-hide='true' @on-cancel='cancel'  :width="50" class-name="customize-modal-center">
            <Row class="margin-bottom-10 background-color-white exhibition">
                <Form  @keydown.native.enter.prevent="search" ref="formSearchs" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="部门:" >
                    <Select v-model="formSearchs.optionsBmAdd" label-in-value=true style="width:150px" @on-change="watchChangeAdd(formSearchs.optionsBmAdd)">
                        <Option v-for="item in departmentNameAdd" :value="item" :key="item.org_department_id">{{ item.org_department_name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="岗位:">
                    <Select  v-model="formSearchs.post_listAdd" @on-change="ChangeGwAdd(formSearchs.post_listAdd)" style="width:150px" >
                        <Option v-for="item in newListAdd" :value="item" :key="item.id">
                            {{item.name}}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item label="处理人:"  >
                    <Select   v-model="formSearchs.userNameAdd" filterable style="width:150px" >
                        <Option v-for="item in brandList" :value="item" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                 <Form-item label="任务名称:">
                    <Select  v-model="formSearchs.taskIdAdd" filterable style="width:150px">
                        <Option v-for="item in employeeList" :value="item" :key="item.id">{{item.taskName}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="工作量/周:">
                    <Input v-model="formSearchs.workLoad" style="width:150px" placeholder="按款"></Input>
                </Form-item>
                </Col>
            </Form>
            </Row>
            <Row>
            <Form-item :label-width="1" style="text-align:center">
                    <Button type="primary" @click="save">确定</Button>
                    <Button type="default" @click="cancel">取消</Button>
                </Form-item>
            </Row>
        </Modal>
    </div>
</template>

<script>
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
                        title: '部门',
                        key: 'departmentName',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '岗位',
                        key: 'postName',
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
                        title: '处理人',
                        key: 'userName',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '工作量/周',
                        key: 'workLoad',
                        align: 'center',
                        minWidth:100,
                         render: (h, params) => {
                            if (params.row.$isEdit) {
                                return h('Input', {
                                    props: {
                                        // filterable:true,
                                        placeholder:params.row.workLoad,
                                        // type:"textarea",
                                        // rows:"4"
                                    },
                                    on: {
                                        'on-change': (e) => {
                                           this.changeTime = e.target.value
                                        }
                                    },
                                },
                                );
                            } else {
                                return h('span', params.row.workLoad)
                            }
                        },
                    },
                    {
                        title: '创建时间',
                        key: 'created',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '修改时间',
                        key: 'lastUpdated',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '操作',
                        key: 'operate',
                        minWidth: 220,
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
                changeTime:'',
                formSearchs:{},
                gwId:'',
                org_id:'',
                total: 0,
                page: 1,
                pageSize: 10,
                list:[],
                personList:[],
                newList:[],
                newListAdd:[],
                getList:[],
                postList:[],
                departmentName:[],
                departmentNameAdd:[],
                employeeList:[],
                employeeListTwo:[],
                brandList:[],
                brandListTwo:[],
                seasonList:[]
            }
        },
        mounted() {
            this.initDepartment()//获取部门
            this.getEmployeeList()//获取任务名称
            this.getData() //获取数据
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
        },
        activated() {
        },
        methods: {
            ChangeGw(v){
                 if(v == undefined){
                    console.log('/./')
                }else{
                    this.request('get_examine_post_list', {
                       data:{
                           orgId:this.formSearch.optionsBm,
                           postId:this.formSearch.post_list
                       }
                   }, false).then((res) => {
                           this.personList = res.data
                   })
                }
            },
            ChangeGwAdd(v){
                console.log(v,'/./././///../')
                if(v == undefined){
                    this.formSearchs.userNameAdd = ''
                }else{
                    this.request('get_examine_post_list', {
                       data:{
                           orgId:this.formSearchs.optionsBmAdd.org_department_id,
                           postId:this.formSearchs.post_listAdd.id
                       }
                   }, false).then((res) => {
                       let array = []
                    for(const i of res.data){
                        array.push({
                            name:i.name,
                            id:i.id
                         })
                    }
                         this.brandList = array
                   })
                }
            },
            watchChange(params){
                if(this.formSearch.optionsBm){
                    this.getGwList(params)
                }
            },
            watchChangeAdd(params){
                if(this.formSearchs.optionsBmAdd){
                    this.getGwAddList(params)
                    this.formSearchs.org_department_name = params.org_department_name
                }
            },
            getGwList(params){
                this.request('get_examine_post_list', {
                       data:{
                           orgId:this.formSearch.optionsBm,
                       }
                   }, false).then((res) => {
                           this.getList = res.data
                           this.getnewList(res.data[0])
                   })
            },
            getGwAddList(v){
                if(v.org_department_id == undefined){
                }else {
                    this.request('get_examine_post_list', {
                       data:{
                           orgId:v.org_department_id,
                       }
                   }, false).then((res) => {
                           this.getList = res.data
                           this.getnewListAdd(res.data[0])
                   })
                }
            },
            //数组去重
            getnewListAdd(data){
                let obj = {}
                 let array = []
                    let zhan = this.getList
                    for(const i of zhan) {
 	                    array.push({
                            name:i.org_post_name,
                            id:i.org_post_id
                         }
                    ),
                    this.gwId = i.org_post_id
                }
                    var l2List = [...new Set(array)]
                    this.newListAdd = l2List
                    //二次去重
                    this.newListAdd = this.newListAdd.reduce((cur,next)=>{
                        obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
                        return cur;
                    },[])
            },
             //数组去重
            getnewList(data){
                let obj = {}
                 let array = []
                    let zhan = this.getList
                    for(const i of zhan) {
 	                    array.push({
                            name:i.org_post_name,
                            id:i.org_post_id
                         }
                    ),
                    this.gwId = i.org_post_id
                }
                    var l2List = [...new Set(array)]
                    this.newList = l2List
                    //二次去重
                    this.newList = this.newList.reduce((cur,next)=>{
                        obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
                        return cur;
                    },[])
            },
            //初始化员工列表
            initStafflist(underling,org_department_id){
                let personId = JSON.parse(window.sessionStorage.getItem('userinfo'));
                let personIdName = personId.userName;
                   this.request('get_examine_employee_list', {
                       data:{
                            user_id:this.userInfo.userId,
                            underling:underling,
                            org_department_id:org_department_id,
                       }
                   }, false).then((res) => {       
                       if(this.addType=='one'){                  
                           this.staffList=[];
                       }else if(this.addType=='more'){
                              this.newstafflist=[];
                              this.newstafflist=res.data;
                       }
                        
                   })
            },
            initDepartment(){
                 let userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
                  this.request('get_examine_org_list', {
                       data:{
                           user_id:userInfo.userId,
                       }
                   }, false).then((res) => {
                         this.departmentName=res.data
                   })
            },
            //获取任务名称
             getEmployeeList() {
                this.request('selectAllNodeNamesAndLevels', {}, false).then((res) => {
                    if(res.code==1){
                      this.employeeList=res.data.nameSet
                    }
                })
            },
            // 确定新增
           save(){
                let data = {}
                data.departmentId = this.formSearchs.optionsBmAdd.org_department_id
                data.departmentName = this.formSearchs.org_department_name
                data.postId = this.formSearchs.post_listAdd.id
                data.postName = this.formSearchs.post_listAdd.name
                data.taskId = this.formSearchs.taskIdAdd.id
                data.taskName = this.formSearchs.taskIdAdd.taskName
                data.workLoad = this.formSearchs.workLoad
                data.userName =  this.formSearchs.userNameAdd.name
                data.createUser = this.userInfo.userName
                data.userOAId = this.formSearchs.userNameAdd.id
                this.request('addDevelopWorkConfig', {data}, false).then((res) => {
                    if(res.code==1){ 
                        this.getData();
                        this.formSearchs = {}
                        this.$Message.success('新增工作量配置成功')
                        this.visible = false;
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
            getData(){
                let data = {}
                    data.start = (this.page - 1)*this.pageSize
                    data.length = this.pageSize
                    this.formSearch.userId ? data.userOAId = this.formSearch.userId : delete data.userOAId
                    this.formSearch.taskId ? data.taskId = this.formSearch.taskId : delete data.taskId
                    this.formSearch.post_list ? data.postId = this.formSearch.post_list : delete data.postId
                    this.formSearch.optionsBm ? data.departmentId = this.formSearch.optionsBm : delete data.departmentId
                this.request('getDevelopWorkConfigList', {data}, false).then((res) => {
                    if(res.code=='1'){
                      this.list=res.data.workConfigList
                      this.total = res.data.count
                    }
                })
            },
            //重置
            handleReset(){
                this.$refs.store.clearSingleSelect()
                this.newList = []
                this.personList = []
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
                    data.id = prame.id
                    data.workLoad = this.changeTime
                    data.lastUpdateUser = this.userInfo.userName
                    this.request('editDevelopWorkConfig', {data}, false).then((res) => {
                        if(res.code==1){
                        this.getData()
                        }
                    })
                }
            },
            //删除 
            tableDelete(prame){
                let data = {}
                data.id = prame.row.id
                data.lastUpdateUser = this.userInfo.userName
                 this.request('deleteDevelopWorkConfig', {data}, false).then((res) => {
                    if(res.code==1){
                    this.$Message.success('删除人员配置成功')
                     this.getData()
                    }
                })
            },
            //新增
            newAdd(){
                this.departmentNameAdd = [],
                this.newListAdd = [],
                this.brandList = [],
                this.formSearchs = {}
                this.visible = true
                let userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
                  this.request('get_examine_org_list', {
                       data:{
                           user_id:userInfo.userId,
                       }
                   }, false).then((res) => {
                         this.departmentNameAdd=res.data
                   })
            },
            //取消新增
            cancel(){
                this.visible = false
                this.formSearchs = {}
            },
        }
    }
</script>

<style>

</style>
