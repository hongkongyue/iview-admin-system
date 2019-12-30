<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">  
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="品牌:"  :label-width="50">
                    <Select v-model="formSearch.basicBrandId"  style="width:120px" filterable>
                        <Option v-for="item in brandList" :value="item.brandId" :key="item.brandId">{{item.brandName }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="年份:">
                    <DatePicker v-model="formSearch.year" type="year" placeholder="请选择" style="width: 120px"></DatePicker>
                </Form-item>
                <Form-item label="季节:">
                    <Select v-model="formSearch.season"  style="width:120px"  filterable>
                        <Option v-for="item in seasonList" :value="item.name" :key="item.name">{{ item.name }}</Option>
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
       <!--  新增 -->
        <Modal v-model="visible" title="新增"   @on-cancel='cancel1' :width="610" class-name="customize-modal-center">
            <Row class="margin-bottom-10 background-color-white exhibition">
                 <el-form :inline="true" ref="ruleForm" :model="formData"  label-width="80px"class="demo-form-inline demo-ruleForm " label-position="left" :rules="rules">
                    <el-form-item label="品牌" size="small" label-width="65px" prop="basicBrandId">
                            <el-select  v-model="formData.basicBrandId" placeholder="请选择" style="width:180px" filterable >
                            <el-option v-for="v in brandList" :key="v.brandId" :label="v.brandName" :value="v.brandId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年份" size="small" label-width="65px" prop="year">
                       <!-- <DatePicker v-model="formData.year" type="year" placeholder="请选择" style="width: 180px"></DatePicker> -->
                       <el-date-picker
                          v-model="formData.year"
                          type="year"
                          placeholder="请选择" style="width: 180px">
                        </el-date-picker>
                    </el-form-item>
                     <el-form-item label="季节" size="small" label-width="65px" prop="season">
                        <el-select v-model="formData.season" placeholder="请选择" style="width:180px" filterable >
                            <el-option v-for="v in seasonList" :key="v.name" :label="v.name" :value="v.name"></el-option>
                        </el-select>
                    </el-form-item>
                      <el-form-item label="采购总金额" size="small" label-width="95px" prop="money">
                      <!--   <el-input type="number" v-model="formData.discount" :min="0" maxlength="20" style="width:110px"></el-input> -->
                        <el-input-number v-model="formData.money" :precision="2"  controls-position="right"  style="width:150px"></el-input-number>
                    </el-form-item>
                    <el-form-item style="padding-left:210px">
                        <Button type="primary"  @click="submitForm('ruleForm')">确认</Button>
                        <Button type="default" @click="cancel1">取消</Button>
                    </el-form-item>
                </el-form>
            </Row>
             <div slot="footer"></div>
        </Modal>
       <!--  调整金额 -->
         <Modal v-model="adjustVisible" title="调整金额"    @on-cancel='cancelAdjust' :width="910" class-name="customize-modal-center">
            <Row class="margin-bottom-10 background-color-white exhibition">
                 <el-form :inline="true" ref="ruleForms" label-position="right" :model="rowData"  label-width="80px" class="demo-form-inline demo-ruleForm "  :rules="rules">
                <!-- <Col> -->
                <el-row :gutter="24">
                  <el-col :span="5" >
                    <el-form-item label="品牌：" size="small" label-width="60px" >
                         {{rowData.basicBrandName}}
                    </el-form-item></el-col>
                  <el-col :span="4"> 
                    <el-form-item label="年份：" size="small" label-width="60px" >
                         {{rowData.year}}
                    </el-form-item></el-col>
                  <el-col :span="4"> 
                    <el-form-item label="季节：" size="small" label-width="65px">
                         {{rowData.season}}
                    </el-form-item></el-col>
                  <el-col :span="6">
                    <el-form-item  label="采购总金额：" size="small" label-width="100px">
                         {{rowData.procurementAmount|moneyFilters}}
                    </el-form-item>
                   </el-col>
                    <el-col :span="4">
                     <el-form-item  label="入库金额：" size="small" label-width="95px">
                         {{rowData.inventoryAmount|moneyFilters}}
                    </el-form-item>
                   </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="4" style="padding-left: 5px">
                   <el-form-item  label="订单金额：" size="small" label-width="95px">
                         {{rowData.orderAmount|moneyFilters}}
                    </el-form-item></el-col>
                  <el-col :span="4"> 
                     <el-form-item  label="占用金额：" size="small" label-width="95px">
                         {{rowData.occupyAmount|moneyFilters}}
                    </el-form-item></el-col>
                  <el-col :span="8"> 
                   
                     <el-form-item label="调整金额：" size="small" label-width="95px" prop="adjustmentAmount">
                        <el-input-number v-model="rowData.adjustmentAmount" @change="compareMoney" :precision="2" placeholder="请输入"  controls-position="right"  style="width:150px">    
                        </el-input-number>
                    </el-form-item></el-col>
                </el-row>  
                  
                    <el-form-item style="padding-left:380px">
                        <Button type="primary"  @click="update">确认</Button>
                        <Button type="default" @click="cancelUpdate">取消</Button>
                    </el-form-item>
                </el-form>
            </Row>
             <div slot="footer"></div>
        </Modal> 
    </div>
</template>

<script>
    import Util from 'libs/util';
    import filter from '../../filter/'
    function formSearch() {
        return {
            search: ''
        }
    }
    export default {
        name:'category',
        data() {
            return {
                 adjustVisible:false,
                 rowData:{},
                 rules:  {
                    basicBrandId : [ { required: true, message: '请选择品牌',           trigger: 'change'}],
                    year    : [ {type: 'date', required: true, message: '请选择年份',   trigger: 'change' } ],
                    season  : [ { required: true, message: '请选择季节',           trigger: 'change' }],
                    money   : [ { required: true, message: '请输入采购总金额',      trigger: 'change' },
                                {pattern:/^[1-9]\d*(\.\d+)?$/i,message:'采购总金额须大于0'}
                              ],
                    // adjustmentAmount : [ { required: true, message: '请输入调整金额', trigger: 'change' },
                    //                      {pattern:/^[1-9]\d*(\.\d+)?$/i,message:'调整金额须大于0'}
                    //                    ],
                              },
                columns: [{
                        title: '序号',
                        type:'index',
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: '品牌',
                        key: 'basicBrandName',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '年份',
                        key: 'year',
                        align: 'center',
                        minWidth:100,
                    },
                    
                    {
                        title: '季节',
                        key: 'season',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '采购总金额',
                        key: 'procurementAmount',
                        align: 'center',
                        minWidth:180,
                        render:(h,params)=>{
                        return h('div', [
                                h('span', {
                                }, filter.moneyFilters(params.row.procurementAmount)),
                            ])
                        }
                    },
                    {
                        title: '入库金额',
                        key: 'inventoryAmount',
                        align: 'center',
                        minWidth:100,
                        render:(h,params)=>{
                        return h('div', [
                                h('span', {
                                }, filter.moneyFilters(params.row.inventoryAmount)),
                            ])
                        }
                    },
                    {
                        title: '订单金额',
                        key: 'orderAmount',
                        align: 'center',
                        minWidth:100,
                        render:(h,params)=>{
                        return h('div', [
                                h('span', {
                                }, filter.moneyFilters(params.row.orderAmount)),
                            ])
                        }
                    },
                    {
                        title: '占用金额',
                        key: 'occupyAmount',
                        align: 'center',
                        minWidth:100,
                        render:(h,params)=>{
                        return h('div', [
                                h('span', {
                                }, filter.moneyFilters(params.row.occupyAmount)),
                            ])
                        }

                    },
                    {
                        title: '调整金额',
                        key: 'adjustmentAmount',
                        align: 'center',
                        minWidth:180,
                        render:(h,params)=>{
                        return h('div', [
                                h('span', {
                                }, filter.moneyFilters(params.row.adjustmentAmount)),
                            ])
                        }
                    },
                    {
                        title: '剩余金额',
                        key: 'surplusAmount',
                        align: 'center',
                        minWidth:180,
                        render:(h,params)=>{
                        return h('div', [
                                h('span', {
                                }, filter.moneyFilters(params.row.surplusAmount)),
                            ])
                        }
                    },
                    {
                        title: '维护人',
                        key: 'remark',
                        align: 'center',
                        minWidth:100
                    },
                    {
                        title: '创建时间',
                        key: 'created',
                        align: 'center',
                        minWidth:100
                    },
                    {
                        title: '操作',
                        key: 'operate',
                        minWidth: 220,
                        fixed: 'right',
                        align: 'center',
                        render: (h, params) => {
                            if(params.row.sign==1){
                                return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        // display:params.row.$isEdit == true ? 'inline-block':'none' //判断是不是最新的一条数据
                                    },
                                    on: {
                                        click: (e) => {
                                            this.handleSave(params.row)
                                        }
                                    }
                                }, '调整金额'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                         // display:params.row.$isEdit == true ? 'inline-block':'none' //判断是不是最新的一条数据
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
                    }
                ],
                 formSearch: {
                    brandId:'',//品牌id
                    userId:'',//处理人id
                },
                formAdd:{
                         money:'',
                },
                formData:{
                            basicBrandId : '',
                            year    : '',
                            season  : '',
                            money   : '',
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
                seasonList:[
                    {name:'春季'},
                    {name:'夏季'},
                    {name:'秋季'},
                    {name:'冬季'}
                ]
            }
        },
        mounted() {
            // this.getEmployeeList()
            // this.getbrandList()
            // this.getData()
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            this.formData.money=''
            this.getbrandList()
        },
        activated() {
        },
        methods: {
              resetForm(formName) {
                this.$refs[formName].resetFields();
             },
               cancel1(){
                 this.visible=false
                 this.resetForm('ruleForm')
            },
             submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.insertAdd()
                    } else {
                        return false;
                    }
                });
             },
             getName(id){
                  for(let i=0,len=this.brandList.length;i<len;i++){
                    if(this.brandList[i].brandId==id){
                         return this.brandList[i].brandName
                    }
                  }
             },
             insertAdd(){
                        let data={}
                            data.basicBrandId=this.formData.basicBrandId
                            data.basicBrandCode=String(this.formData.basicBrandId)
                            data.basicBrandName=this.getName(this.formData.basicBrandId)
                            data.year=String(filter.get_unix_only(this.formData.year))
                            data.season=this.formData.season
                            data.procurementAmount=this.formData.money
                            data.createId=this.userInfo.userId
                            data.createUser=this.userInfo.userName
                         this.request('eom_procurementBudget_saveProcurementBudget',{data},false).then(res=>{
                            if(res.code==1){
                                this.$Message.success(res.msg)
                                this.visible=false;
                                this.cancel1()
                                this.getData()
                            }
                         })
             },
               //进入明细页面
            getInRow(row){
                this.$router.push({
                name: 'quickrepeatorder_salesPlanEdit',
                query: {
                    obj : row
                }
            });
            },
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
                        this.formSearch.year ?   data.year =filter.get_unix_only(this.formSearch.year)  : delete data.year
                        this.formSearch.season ? data.season = this.formSearch.season : delete data.season
                        this.formSearch.basicBrandId ? data.basicBrandId = this.formSearch.basicBrandId : delete data.basicBrandId
                    this.request('eom_procurementBudget_getProcurementBudget', {data}, false).then((res) => {
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
            handleSave(row){
                this.rowData=row;
                this.adjustVisible=true
            },
             handleEdit(row){
                this.$set(row, '$isEdit', false)
            },
            update(){
                    let data={}
                        data.id=this.rowData.id
                        data.adjustmentAmount=this.rowData.adjustmentAmount
                        data.updateId=this.userInfo.userId
                        data.updateUser=this.userInfo.userName
                    if(data.adjustmentAmount==0) return this.$Message.error('调整金额不能为零')
                    if(data.adjustmentAmount<0&&Math.abs(data.adjustmentAmount)>Math.abs(this.rowData.surplusAmount)) return this.$Message.error('调整金额不能大于剩余金额')
                    this.request('eom_procurementBudget_updateProcurementBudget',{data},false).then(res=>{
                        if(res.code==1){
                             this.adjustVisible=false;
                             this.$Message.success(res.msg)
                             this.getData()
                        }
                    })
            },
            cancelUpdate(){
                   this.adjustVisible=false
            },
            getbrandList(){
              this.request('get_scm_brand_list',{},false).then(res=>{
                    if(res.code==1){
                     this.brandList=res.data
                    }
              })
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
                    data.updateId=this.userInfo.userId
                    data.updateUser=this.userInfo.userName
                 this.request('eom_procurementBudget_deletedProcurementBudget', {data}, false).then((res) => {
                    if(res.code==1){
                        this.$Message.success(res.msg)
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
      .el-select-dropdown,.el-date-picker{
        z-index:9999999!important;
      }
</style>
