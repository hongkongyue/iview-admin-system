<template>
    <div class="background-color-white exhibition" id="parameter_taxRate">
        <Row>
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Col>
                    <Form-item label="税类：" :label-width='60'>
                        <Select v-model="formSearch.taxClassCode" style="width:150px" size="small">
                            <Option v-for="item in taxClass_List" :value="item.taxClassCode" :key="item.taxClassCode">{{ item.taxClassName }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="品牌：" :label-width='60'>
                        <Select v-model="formSearch.brandId" style="width:150px" size="small">
                            <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item :label-width="10">
                        <Button type="primary" icon="ios-search" size="small" @click="search">查询</Button>
                        <Button type="warning" size="small" @click="reset">重置</Button>
                    </Form-item>
                </Col>
            </Form>
        </Row>
        <Row class="margin-bottom-10">
            <Button type="primary" @click="openModal('新增税率')">新增</Button>
            <Button type="primary" @click="downTemplate">下载模板</Button>
            <Button type="primary" @click="openImportModal">导入</Button>
        </Row>  
        <Row>
            <Col class="margin-bottom-10">
                <Table :columns="columns" size="small" :data="list"></Table>
            </Col>
            <Col>
                <Page :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
            </Col>
        </Row>

        <div class="modal">
            <Modal 
                v-model="modal_visible" 
                :mask-closable="false" 
                :title="modal_title" 
                :width="600"
                :transfer="true"
                class-name="customize-modal-center"
            >   
                <Form :model="ModalForm" :label-width="70" ref="submit_data" :mask-closable="false" :rules="ruleValidate" inline label-position="right" >
                    <Row>
                        <Col span="12">
                            <Form-item label="税类：" prop="taxClassCode">
                                <Select :disabled='modal_title != "新增税率"' v-model.number="ModalForm.taxClassCode" style="width:150px" size="small" @on-change='changeTarClass'>
                                    <Option v-for="item in taxClass_List" :value="item.taxClassCode" :key="item.taxClassCode">{{ item.taxClassName }}
                                    </Option>
                                </Select>
                            </Form-item>
                        </Col>
                        <Col span="12">
                            <Form-item label="品牌：" prop="brandId">
                                <Select :disabled='modal_title != "新增税率"' v-model.number="ModalForm.brandId" style="width:150px" size="small" @on-change='changeBrand'>
                                    <Option v-for="item in modalBrandList" :value="item.id" :key="item.id">{{ item.brands }}
                                    </Option>
                                </Select>
                            </Form-item>
                        </Col>
                        <Col span="12">
                            <Form-item label="明细：" prop="taxDetailCode">
                                <Select :disabled='modal_title != "新增税率"' v-model="ModalForm.taxDetailCode" @on-change='changeTaxDetail' style="width:150px" size="small">
                                    <Option v-for="item in taxDeatilList" :value="item.taxDetailCode" :key="item.taxDetailCode">{{ item.taxDetailName }}
                                    </Option>
                                </Select>
                            </Form-item>
                        </Col>
                        <Col span="12">
                            <Form-item label="税率%：" prop="taxRate">
                                <Input v-model.number="ModalForm.taxRate" size="small"  placeholder="请输入税率" style="width:150px"></Input>
                            </Form-item>
                        </Col>
                        <Col span="12">
                            <Form-item label="备注：">
                                <Input v-model="ModalForm.remark" size="small"  placeholder="请输入备注" style="width:150px"></Input>
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
                            action="/eop/bi/import_cost_tax_rate"
                            :data="{userCode:userInfo.userAccount}"
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
                    <Button type="default" @click="cancel('import')">取消</Button>
                    <Button type="primary" @click="importData">导入</Button>
                </div>
            </Modal>
            <Modal 
                v-model="taxRate_log_modal" 
                :mask-closable="false" 
                title="变更记录" 
                :width="600"
                :transfer="true"
                class-name="customize-modal-center"
            > 
                <Row>
                    <Col class="margin-bottom-10">
                        <Table :columns="taxRate_log_columns" size="small" :data="taxRate_log_list"></Table>
                    </Col>
                    <Col>
                        <Page :total="taxRate_log_total" :page-size="taxRate_log_pageSize" :current="taxRate_log_page" show-sizer show-total show-elevator @on-change="taxRate_log_CurrentChange" @on-page-size-change="taxRate_log_SizeChange"></Page>
                    </Col>
                </Row>
                <div slot="footer">
                    <Button type="default" @click="taxRate_log_modal = false">取消</Button>
                    <Button type="primary" @click="taxRate_log_modal = false">确定</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import Util from 'libs/util';
    import {mapState} from 'vuex';

    function formSearch(){
        return {
            brandId:'',
            taxClassCode:''
        }
    }

    function ModalForm(){
        return {
            brandId:'',             //品牌id	number	
            brandName:'',           //品牌名	string	
            createUser:'',          //创建人	string	当前用户账号
            remark:'',              //备注	    string	
            taxClassCode:'',        //税类代码	string	
            taxClassName:'',        //税类名称	string	
            taxDetailCode:'',       //明细代码	string	
            taxDetailName:'',       //明细名称	string	
            taxRate:'',             //税率	    number	
        }
    }

    export default {
        name:'parameter_taxRate',
        data(){
            return {
                taxDeatilList:[],
                formSearch:formSearch(),
                ModalForm:ModalForm(),
                modal_visible:false,
                modal_title:'',
                userInfo:{},
                taxClass_List:[],
                columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '税类',
                        key: 'taxClassName',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '明细',
                        key: 'taxDetailName',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '税率%',
                        key: 'taxRate',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '修改人',
                        key: 'lastUpdateUser',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '修改时间',
                        key: 'lastUpdated',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        minWidth: 200,
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
                                        click: () => {
                                            this.openModal('编辑税率',params.row);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.delete(params.row);
                                        }
                                    }
                                }, '删除'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.taxRate_log_modal = true;
                                            this.get_cost_tax_rate_log(params);
                                        }
                                    }
                                }, '变更记录')
                            ]);
                        }
                    }
                ],
                list:[],
                total:0,
                page:1,
                pageSize:10,
                ruleValidate:{
                    taxClassCode: [
                        { required: true,message: '请选择税类', trigger: 'change' }
                    ],
                    taxDetailCode: [
                        { required: true, message: '请选择明细', trigger: 'change' }
                    ],
                    brandId: [
                        { required: true,type:'number', message: '请选择品牌', trigger: 'change' }                        
                    ],
                    taxRate:[
                        { required: true,type:'number', message: '请输入税率', trigger: 'blur' }                        
                    ]
                },
                file:null,
                loadingStatus: false,
                importModal: false,
                taxRate_log_modal: false,
                taxRate_log_total:0,
                taxRate_log_pageSize:10,
                taxRate_log_page:1,
                taxRate_log_columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '税类',
                        key: 'taxClassName',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '明细',
                        key: 'taxDetailName',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '原税率',
                        key: 'originTaxRate',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '修改后税率',
                        key: 'newTaxRate',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '修改人',
                        key: 'lastUpdateUser',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '修改时间',
                        key: 'lastUpdated',
                        align: 'center',
                        minWidth: 150
                    },
                ],
                taxRate_log_list:[]
            }
        },
        computed:{
            
        },
        props:['brandList','modalBrandList'],        
        mounted(){
            this.get_tax_class();  
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));        
        },
        methods:{
            get_cost_tax_rate_log(params){
                this.request('get_cost_tax_rate_log',{
                    data:{
                        brandId:params.row.brandId,
                        taxClassCode:params.row.taxClassCode,	
                        taxDetailCode:params.row.taxDetailCode,
                        start:(this.taxRate_log_page - 1) * this.taxRate_log_pageSize,
                        length:this.taxRate_log_pageSize
                    }
                },true).then(res=>{
                    if(res.code == 1){
                        let serialNoBegain = this.taxRate_log_pageSize * (this.taxRate_log_page - 1);
                        res.data.costTaxRateLogList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.taxRate_log_list = res.data.costTaxRateLogList;
                        this.taxRate_log_total = res.data.count;
                    }
                })
            },
            get_tax_class(){
                this.request('get_tax_class',{
                    data:{}
                }).then(res=>{
                    if(res.code == 1){
                        this.taxClass_List = res.data;
                    }
                })
            },
            search(){
                this.page = 1;
                this.getData();
            },
            reset(){
                this.formSearch = formSearch();
                this.$nextTick(()=>{
                    this.search();
                })
            },
            changeTarClass(val){
                this.taxClass_List.map(x=>{
                    if(val == x.taxClassCode){
                        this.ModalForm.taxClassName = x.taxClassName;
                    }
                })
                this.request('get_tax_detail',{
                    data:{
                        taxClassCode:this.ModalForm.taxClassCode
                    }
                }).then(res=>{
                    if(res.code == 1){
                        this.taxDeatilList = res.data;
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
            changePlatfrom(val){
                this.Modal_platfrom_List.map(x=>{
                    if(x.value == val){
                        this.ModalForm.platfromName = x.label;
                    }
                })
            },
            changeTaxDetail(val){
                this.taxDeatilList.map(x=>{
                    if(val == x.taxDetailCode){
                        this.ModalForm.taxDetailName = x.taxDetailName;
                    }
                })
            },
            getData(){
                let data = Util.deepClone(this.formSearch);
                data.start = (this.page - 1) * this.pageSize;
                data.length = this.pageSize;
                this.request('get_cost_tax_rate',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.costTaxRateList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.total = res.data.count;
                        this.list = res.data.costTaxRateList;
                    }
                })
            },
            openImportModal(){
                this.importModal = true;
            },
            openModal(type,row){
                this.modal_visible = true;
                this.modal_title = type;
                if(type == '编辑税率'){
                    this.ModalForm = Util.deepClone(row);
                }else{
                    this.ModalForm = ModalForm();
                }
                
            },
            cancel(type){
                if(type == 'import'){
                    this.importModal = false;
                    this.file = null;
                }else{
                    this.modal_visible = false;
                    this.$refs['submit_data'].resetFields();
                }
            },
            submit(){
                let data = Util.deepClone(this.ModalForm);
                let url = '';
                if(this.modal_title == '新增税率'){
                    data.createUser = this.userInfo.userName;
                    url = 'add_cost_tax_rate';
                }else if(this.modal_title == '编辑税率'){
                    url='edit_cost_tax_rate';
                    data.lastUpdateUser = this.userInfo.userName;
                    delete data.serialNo;
                    delete data._index;
                    delete data._rowKey;
                }

                this.$refs["submit_data"].validate((valid) => {
                    if (valid) {
                        this.request(url,{
                            data:data
                        },true).then(res=>{
                            if(res.code == 1){
                                this.$Message.success(res.msg);
                                this.modal_visible = false;
                                this.$refs['submit_data'].resetFields();                                
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
            delete(row){
                this.$Modal.confirm({
                    title: '提示',
                    content: '该行将会删除，请确认！',
                    onOk: () => {
                        this.request('delete_cost_tax_rate',{
                            data:{
                                id:row.id,
                                lastUpdateUser:this.userInfo.userName
                            }
                        },true).then(res=>{
                            if(res.code == 1){
                                this.getData();
                                this.$Message.success(res.msg);
                            }
                        })
                    },
                    onCancel: () => {
                        this.$Message.warning('已取消删除');
                    }
                })
            },
            downTemplate(){
                window.location = ('/excel/税率导入模板.xlsx')
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
                if (res.code == 1) {
                    this.loadingStatus = false;
                    this.file = null;
                    this.$Message.success({
                        content: res.msg,
                        duration: 3
                    });
                    this.importModal = false;
                    this.search();
                } else {
                    this.loadingStatus = false;
                    this.$Message.error({
                        content: res.msg,
                        duration: 3
                    });
                }
            },
            uploadError(res, file) {
                this.$Message.error(res.msg);
            },
            importData() {
                this.loadingStatus = true;
                this.$refs['upload'].post(this.file);
            },
            CurrentChange(val){
                this.page = val;
                this.getData();
            },
            SizeChange(val){
                this.pageSize = val;
                this.getData();
            },
            taxRate_log_CurrentChange(val){
                this.taxRate_log_page = val;
                this.get_cost_tax_rate_log();
            },
            taxRate_log_SizeChange(val){
                this.taxRate_log_pageSize = val;
                this.get_cost_tax_rate_log();                
            }
        },
        components:{

        }
    }
</script>

<style lang="css">

</style>


