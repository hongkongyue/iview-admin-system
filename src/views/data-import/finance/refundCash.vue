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
                v-model="modal_visible" 
                :mask-closable="false" 
                :title="modal_title" 
                :width="400"
                :transfer="true"
                class-name="customize-modal-center"
            >   
                <Form :model="ModalForm" :label-width="100" ref="submit_data" :mask-closable="false" :rules="rule" inline label-position="right" >
                    <Row>
                        <Col>
                            <Form-item label="日期：" prop="dateTime">
                                <DatePicker
                                        type="datetime"
                                        format="yyyy-MM-dd"
                                        placeholder=""
                                        style="width: 170px"
                                        v-model="ModalForm.dateTime"
                                        size="small"
                                >
                                </DatePicker>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="品牌：" prop="brandId">
                                <Select v-model.number="ModalForm.brandId" style="width:170px" size="small" @on-change='changeBrand'>
                                    <Option v-for="item in modalBrandList" :value="item.id" :key="item.id">{{ item.brands }}
                                    </Option>
                                </Select>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="店铺：" prop="shopId">
                                <Select v-model.number="ModalForm.shopId" style="width:170px" size="small" @on-change='changeShop'>
                                    <Option v-for="item in shop_list" :value="item.shopId" :key="item.shopId">{{ item.shopName }}
                                    </Option>
                                </Select>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="退款+返现：" prop="refundCash">
                                <InputNumber v-model="ModalForm.refundCash" size="small"  placeholder="请输入退款+返现金额" style="width:170px" :min="0"></InputNumber>
                            </Form-item>
                        </Col>
                    </Row>
                </Form>
                <div slot="footer">
                    <Button type="default" @click="cancel">取消</Button>
                    <Button type="primary" @click="submit">确定</Button>
                </div>
            </Modal>

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
                        action="/eop-node/api/analysis/importDailyData"
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
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import Util from 'libs/util';

    function ModalForm(){
        return {
            brandId:'',         //	品牌id	    number	
            brandName:'',       //	品牌名称	string	
            createUser:'',      //	创建人	    string	当前用户账号
            dateTime:'',        //	日期	    string	格式：yyyy-mm-dd
            refundCash:'',      //	退款返现	number	
            remark:'',          //  备注	    string
            shopId:'',
            shopName:''
        }
    }

    export default {
        name:'Daily',
        data(){
            return {
                ModalForm:ModalForm(),
                page:1,
                pageSize:10,
                total:0,
                list:[],
                table_row_index:-1,
                columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '日期',
                        key: 'dateTime',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            if (params.index == this.table_row_index) {
                                return h('DatePicker', {
                                    props: {
                                        value: this.list[params.index].dateTime,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-change': (event) => {
                                            this.list[params.index].dateTime = Util.dateFormat(event,'yyyy-MM-dd');
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.dateTime)
                            }
                        }
                    },
                    {
                        title: '店铺',
                        key: 'shopName',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            if (params.index == this.table_row_index) {
                                    return h('Select', {
                                        props:{
                                            value: this.list[params.index].shopId,
                                            size: 'small'
                                        },
                                        on: {
                                            'on-change':(value) => {
                                                this.list[params.index].shopId = value;
                                                this.shop_list.map(x=>{
                                                    if(x.shopId == value){
                                                        this.list[params.index].shopName = x.shopName;
                                                    }
                                                })
                                            }
                                        },
                                    },
                                    this.shop_list.map(function(item){
                                        return h('Option', {
                                            props: {value: item.shopId}
                                        }, item.shopName);
                                    })
                                );
                            } else {
                                return h('span', params.row.shopName)
                            }
                        }
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            if (params.index == this.table_row_index) {
                                    return h('Select', {
                                        props:{
                                            value: this.list[params.index].brandId,
                                            size: 'small'
                                        },
                                        on: {
                                            'on-change':(value) => {
                                                this.list[params.index].brandId = value;
                                                this.brandList.map(x=>{
                                                    if(x.id == value){
                                                        this.list[params.index].brandName = x.brands;
                                                    }
                                                })
                                            }
                                        },
                                    },
                                    this.modalBrandList.map(function(item){
                                        return h('Option', {
                                            props: {value: item.id}
                                        }, item.brands);
                                    })
                                );
                            } else {
                                return h('span', params.row.brandName)
                            }
                        }
                    },
                    
                    {
                        title: '退款+返现（含税）',
                        key: 'refundCash',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => {
                            if (params.index == this.table_row_index) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].refundCash,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].refundCash = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.refundCash)
                            }
                        }
                    },
                    {
                        title: '维护人',
                        key: 'createUser',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '新增日期',
                        key: 'created',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '修改日期',
                        key: 'lastUpdated',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => {
                            if(params.row.serialNo == '合计'){
                                return h('div','')
                            }
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
                                        click: () => {
                                            this.get_daily_shop_list();
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
                                            this.request('edit_cost_daily',{
                                                data:data
                                            },true).then(res=>{
                                                if(res.code == 1){
                                                    this.$Message.success(res.msg);
                                                    this.table_row_index = -1;
                                                    this.getData();
                                                }
                                            })
                                        }
                                    }
                                }, '保存')
                            ]);
                        }
                    }
                ],
                page:1,
                pageSize:16,
                total:0,
                modal_visible:false,
                modal_title:'',
                rule:{
                    dateTime: [
                        { required: true,type:'date', message: '请选择日期', trigger: 'change' }
                    ],
                    brandId: [
                        { required: true,type:'number', message: '请选择品牌', trigger: 'change' }                        
                    ],
                    shopId: [
                        { required: true,type:'number', message: '请选择店铺', trigger: 'change' }                        
                    ],
                    refundCash:[
                        { required: true,type:'number', message: '请输入退款返现', trigger: 'blur' }                        
                    ]
                },
                userInfo:{},
                brandList:[],
                modalBrandList:[],
                shop_list:[],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6 - 1000 * 60 * 60 * 24
                    }
                },
                importModal: false,
                file: null
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
                // this.formSearch = formSearch();
                this.formSearch.startDate = '';
                this.formSearch.endDate = '';
                this.formSearch.brandId = '';
                this.page = 1;
                this.getData();
            },
            getData(){
                let data = {};
                data.start = (this.page - 1) * this.pageSize;
                data.length = this.pageSize;
                if(this.formSearch.startDate){
                    data.startDate = Util.dateFormat(this.formSearch.startDate,'yyyy-MM-dd');
                }
                if(this.formSearch.endDate){
                    data.endDate = Util.dateFormat(this.formSearch.endDate,'yyyy-MM-dd');
                }
                if(this.formSearch.startDate > this.formSearch.endDate){
                    this.$Message.warning('日期选择有误，请重新选择！');
                    return false;
                }
                this.formSearch.brandId == 0 ? data.brandId = '' : data.brandId = this.formSearch.brandId;        
                
                this.request('get_cost_daily',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.costDailyList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.list = res.data.costDailyList;
                        this.total = res.data.count;
                        let lastPage = Math.ceil(this.total / this.pageSize);

                        if(this.page == lastPage){
                            let costDailyTotal = res.data.costDailyTotal;
                            costDailyTotal.serialNo = '合计';
                            this.list.push(costDailyTotal);
                        }
                    }
                })
            },
            changeBrand(val){
                this.brandList.map(x=>{
                    if(x.id == val){
                        this.ModalForm.brandName = x.brands;
                    }
                })
            },
            changeShop(val){
                this.shop_list.map(x=>{
                    if(x.shopId == val){
                        this.ModalForm.shopName = x.shopName;
                    }
                })
            },
            openModal(type,row){
                this.modal_visible = true;
                this.modal_title = type;
                this.ModalForm = ModalForm();
                this.get_daily_shop_list();
            },
            get_daily_shop_list(){
                this.request('get_daily_shop_list',{
                    data:{}
                }).then(res=>{
                    if(res.code == 1){
                        this.shop_list = res.data;
                    }
                })
            },
            submit(){
                let data = Util.deepClone(this.ModalForm);
                let url = '';
                data.createUser = this.userInfo.userName;
                data.dateTime = Util.dateFormat(data.dateTime,'yyyy-MM-dd');                    
                this.$refs["submit_data"].validate((valid) => {
                    if (valid) {
                        this.request('add_cost_daily',{
                            data:data
                        },true).then(res=>{
                            if(res.code == 1){
                                this.$Message.success(res.msg);
                                this.modal_visible = false;
                                this.search();
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
            },
            cancel(){
                this.modal_visible = false;
                this.importModal = false;
                this.file = null;
                this.$refs['submit_data'].resetFields();
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
            uploadError(res, file) {
                this.$Message.error(res.msg + res.data);
            },
            importOrderSave() {
                this.loadingStatus = true;
                Vue.prototype.$loading('正在导入数据...');
                this.$refs.upload.post(this.file);
            },
            exportRefundCashData(){
                let data = Util.deepClone(this.formSearch);
                !!data.startDate?data.startDate = Util.dateFormat(this.formSearch.startDate,'yyyy-MM-dd'):data.startDate = '';
                !!data.endDate?data.endDate = Util.dateFormat(this.formSearch.endDate,'yyyy-MM-dd'):data.endDate = '';
                data.brandId == 0 ? data.brandId = '' : data.brandId = this.formSearch.brandId;
                this.request('export_refundCash_data',data,true).then(res=>{
                    if(res.status=='success'){
                        this.$Message.success(res.message);
                        if(document.location.href.indexOf('localhost')>0||document.location.href.indexOf('127.0.0.1')>0){
                            window.open('http://127.0.0.1:8360'+res.data)
                        }else{
                            window.open(res.data)
                        }
                    }
                })
            }
        } 
    }
</script>

<style>

</style>

