<template>
    <div id="finance_Daily">
        <Row>
            <Col class="margin-bottom-10">
                <Table :columns="columns" size="small" :data="list"></Table>
            </Col>
            <Col>
                <Page :total="total" :page-size-opts="[16,32,48,64]" :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
            </Col>
        </Row> 
        <div class="modal">
            <Modal
                v-model="importModal"
                title="批量导入">
                <div>
                    <Upload
                        ref="upload"
                        name="file"
                        :show-upload-list="false"
                        :before-upload="handleUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        type="drag"
                        action="/eop-node/api/analysis/import_bill_variable"
                        :data="{account:userInfo.userAccount,userId:userInfo.userId}"
                    >
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或将文件拖拽到此处</p>
                    </div>
                    </Upload>
                    <div v-if="file !== null">{{ file.name }}
                    <Button type="text"
                            :loading="loadingStatus">{{ loadingStatus ? '上传中...' : '' }}
                    </Button>
                    </div>
                </div>
                <div slot="footer">
                    <Button type="default" @click="cancel">取消</Button>
                    <Button type="primary" @click="importOrderSave">导入</Button>
                </div>
            </Modal>
            <Modal 
                v-model="modal_visible" 
                :mask-closable="false" 
                title="新增账单变动项" 
                :width="400"
                :transfer="true"
                class-name="customize-modal-center"
            >   
                <Form :model="addForm" :label-width="100" ref="submit_data" :mask-closable="false" :rules="ruleValidate" inline label-position="right" >
                    <Row style="margin-bottom:20px">
                        <Col>
                            <Form-item label="时间：" prop='dateTime'>
                                <DatePicker
                                    type="datetime"
                                    placeholder="请选择时间"
                                    format="yyyy-MM-dd"
                                    style="width: 150px"
                                    v-model="addForm.dateTime"
                                    size="small"
                                >
                                </DatePicker>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="品牌：" prop='brandId'>
                                <Select v-model="addForm.brandId" style="width:150px" size="small" @on-change='changeBrand'>
                                    <Option v-for="item in modalBrandList" :value="item.id" :key="item.id">{{ item.brands }}
                                    </Option>
                                </Select>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="销售佣金/元：" prop="salesCommission">
                                <Input v-model="addForm.salesCommission" style="width:150px" size="small" placeholder="请输入销售佣金/元"></Input>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="保险理赔/元：" prop="insurance">
                                <Input v-model="addForm.insurance" size="small" style="width:150px" placeholder="请输入保险理赔/元"></Input>
                            </Form-item>
                        </Col>
                    </Row>
                </Form>
                <div slot="footer">
                    <Button type="default" @click="cancel">取消</Button>
                    <Button type="primary" @click="submit">确定</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import Util from 'libs/util';
    function addForm(){
        return {
            insurance:'',       //	保险理赔	number	
            salesCommission:'', //	销售佣金	number
            brandId:'',         //	品牌id	    number	
            brandName:'',       //	品牌名称	string
            createUser:'',      //	创建人	    string	当前用户账号
            dateTime:'',        //	日期	    string	格式：yyyy-mm-dd
        }
    }
    export default {
        name:'bill_variable',
        data(){
            const validatePass = (rule, value, callback) => {
                if (!!value) {
                    var reg = (/^([\d\,\d\.\d])+$/);
                    if(reg.test(value)){
                        let newValue = '';
                        let arr = value.split(',');
                        arr.map(x=>{
                            newValue += x;
                        })
                        if (isNaN(Number(newValue))) {
                            // 对第二个密码框单独验证
                            callback(new Error('请输入数字'));
                        }else{
                            callback();
                        }
                    }else{
                        callback(new Error('输入有误，请重新输入'));
                    }
                    
                }
            };
            return {
                addForm:addForm(),
                page:1,
                pageSize:16,
                total:0,
                list:[],
                table_row_index:-1,
                columns:[
                    {
                        title: '日期',
                        key: 'date_time',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '品牌',
                        key: 'brand_name',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '销售佣金',
                        key: 'sales_commission',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            if (params.index == this.table_row_index) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].sales_commission,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].sales_commission = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.sales_commission)
                            }
                        }
                    },
                    {
                        title: '保险理赔',
                        key: 'insurance',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            if (params.index == this.table_row_index) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].insurance,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].insurance = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.insurance)
                            }
                        }
                    },
                    {
                        title: '创建人',
                        key: 'create_user',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '创建日期',
                        key: 'created',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '修改人',
                        key: 'last_update_user',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '修改日期',
                        key: 'last_updated',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        minWidth: 200,
                        render: (h, params) => {
                            if(params.row.date_time  == '合计'){
                                return h('div','')
                            }
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.table_row_index = params.index;
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            let data = Util.deepClone(params.row);
                                            data.lastUpdateUser = this.userInfo.userName;
                                            delete data.serialNo;
                                            delete data._index;
                                            delete data._rowKey;
                                            this.request('update_bill_variable',data,true).then(res=>{
                                                if(res.status == 'success'){
                                                    this.$Message.success(res.message);
                                                    this.table_row_index = -1;
                                                    this.getData();
                                                }else{
                                                    this.$Message.warning(res.message);
                                                }
                                            })
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
                                                    this.request('delete_bill_variable',{
                                                        id:params.row.id
                                                    },true).then(res=>{
                                                        if(res.status == 'success'){
                                                            this.$Message.success(res.message);
                                                            this.getData();
                                                        }else{
                                                            this.$Message.warning(res.message);
                                                        }
                                                    })
                                                },
                                                onCancel: () => {
                                                    this.$Message.warning('已取消删除');
                                                }
                                            })
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                userInfo:{},
                brandList:[],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6 - 1000 * 60 * 60 * 24
                    }
                },
                importModal: false,
                file: null,
                modal_visible:false,
                ruleValidate: {
                    dateTime: [
                        { required: true, type:'date', message: '请选择日期', trigger: 'change' }
                    ],
                    brandId: [
                        { required: true, type:'number', message: '请选择品牌', trigger: 'change' }
                    ],
                    insurance: [
                        { required: true, message: '请输入保险理赔', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    salesCommission: [
                        { required: true, message: '请输入销售佣金', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ],
                },
                modalBrandList:[]
            }
        },
        computed:{
            
        },
        props:['formSearch','brandList'],
        mounted(){
            this.search();
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));                    
        },
        watch:{
            'brandList':{
                handler(newVal, oldVal) {
                    if(newVal.length > 0){
                        this.modalBrandList = Util.deepClone(newVal);
                        this.modalBrandList.shift();
                    }
                },
                deep: true
            }
        },
        methods:{
            search(){
                this.page = 1;
                this.getData();
            },
            reset(){
                this.formSearch.startDate = '';
                this.formSearch.endDate = '';
                this.formSearch.brandId = '';
                this.page = 1;
                this.getData();
            },
            getData(){
                let data = Util.deepClone(this.formSearch);
                if(!!data.startDate) data.startDate = Util.dateFormat(data.startDate,'yyyy-MM-dd');
                if(!!data.endDate) data.endDate = Util.dateFormat(data.endDate,'yyyy-MM-dd');
                data.page = this.page;
                data.pageSize = this.pageSize;
                this.request('get_bill_variable_data',data,true).then(res=>{
                    if(res.status == 'success'){
                        this.total = res.data.count;
                        this.list = res.data.data;
                        let lastPage = Math.ceil(this.total / this.pageSize);

                        if(this.page == lastPage){
                            let bill_variable_total = res.bill_variable_total;
                            bill_variable_total.date_time = '合计';
                            this.list.push(bill_variable_total);
                        }
                    }
                })
            },
            changeBrand(val){
                if(
                    (val == '51606' || val == '51605' || val == '51602' == val =='51600')
                ){
                    this.$Message.warning('该品牌无天猫变动费用，请重新选择品牌！');
                    this.addForm.brandId = '';
                    this.addForm.brandName = '';
                    return;
                }
                this.brandList.map(x=>{
                    if(x.id == val){
                        this.addForm.brandName = x.brands;
                    }
                })
            },
            cancel(){
                this.importModal = false;
                this.file = null;
                this.$refs['submit_data'].resetFields();
                this.modal_visible = false;
            },
            CurrentChange(val){
                this.page = val;
                this.getData();
            },
            SizeChange(val){
                this.pageSize = val;
                this.getData();
            },
            downTemplate(){
                window.location = ('/excel/退款返现导入模板.xlsx');
            },
            importData(){
                this.importModal = true;
            },
            handleUpload(file) {
                if (!/\.xls$|.xlsx$/.test(file.name)) {
                    this.$Message.warning('文件类型不符,请重新选择文件');
                    return false
                } else {
                    this.file = file;
                    return false;
                }
            },
            uploadSuccess(res, file) {
                Vue.prototype.$loading.close();
                if (res.status == 'success') {
                    this.loadingStatus = false;
                    this.file = null;
                    this.$Message.success(res.message);
                    this.importModal = false;
                    this.search();
                } else {
                    this.loadingStatus = false;
                    this.$Message.error({
                        content: res.message,
                        duration: 3
                    });
                }
            },
            openModal(){
                this.modal_visible = true;
                this.addForm = addForm(); 
            },
            uploadError(res, file) {
                this.$Message.error(res.msg + res.data);
            },
            importOrderSave() {
                this.loadingStatus = true;
                Vue.prototype.$loading('正在导入数据...');
                this.$refs.upload.post(this.file);
            },
            exportBillVariableData(){
                let data = Util.deepClone(this.formSearch);
                !!data.startDate?data.startDate = Util.dateFormat(this.formSearch.startDate,'yyyy-MM-dd'):data.startDate = '';
                !!data.endDate?data.endDate = Util.dateFormat(this.formSearch.endDate,'yyyy-MM-dd'):data.endDate = '';
                data.brandId == 0 ? data.brandId = '' : data.brandId = this.formSearch.brandId;
                this.request('export_bill_variable',data,true).then(res=>{
                    if(res.status=='success'){
                        this.$Message.success(res.message);
                        if(document.location.href.indexOf('localhost')>0||document.location.href.indexOf('127.0.0.1')>0){
                            window.open('http://127.0.0.1:8360'+res.data)
                        }else{
                            window.open(res.data)
                        }
                    }
                })
            },
            submit(){
                let data = Util.deepClone(this.addForm);
                data.createUser = this.userInfo.userName;
                data.dateTime = Util.dateFormat(this.addForm.dateTime,'yyyy-MM-dd');
                
                this.$refs["submit_data"].validate((valid) => {
                    if (valid) {
                        for(let x in data){
                            if(x == 'salesCommission' || x == 'insurance'){
                                data[x] = data[x].replace(/[^0-9/.]/g, "");
                            }
                        }
                        this.request('add_bill_variable',data,true).then(res=>{
                            if(res.status == 'success'){
                                this.$Message.success(res.message);
                                this.modal_visible = false;
                                this.search();
                            }else{
                                this.$Message.warning(res.message);
                            }
                        })
                    } else {
                        this.$Notice.warning({
                            title: '提示',
                            desc: '请核对表单信息!'
                        });
                        return false;
                    }
                })
            }
        } 
    }
</script>

<style>

</style>

