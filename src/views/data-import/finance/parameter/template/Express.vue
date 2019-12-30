<template>
    <div class="background-color-white exhibition" id="parameter_Express">
        <Row>
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Col>
                    <Form-item label="渠道：" :label-width='60'>
                        <Select v-model="formSearch.platfromCode" style="width:150px" size="small">
                            <Option v-for="item in platfrom_List" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="品牌：" :label-width='60'>
                        <Select v-model="formSearch.brandId" style="width:150px" size="small">
                            <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="月份：" :label-width="80">
                        <DatePicker type="month" size="small"  style="width:150px" v-model="formSearch.month" placeholder="请选择月份"></DatePicker>
                    </Form-item>
                    <Form-item :label-width="10">
                        <Button type="primary" icon="ios-search" size="small" @click="search">查询</Button>
                        <Button type="warning" size="small" @click="reset">重置</Button>
                    </Form-item>
                </Col>
            </Form>
        </Row>
        <Row class="margin-bottom-10">
            <Button type="primary" @click="openModal('新增快递')">新增</Button>
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
                :width="400"
                :transfer="true"
                class-name="customize-modal-center"
            >   
                <Form :model="ModalForm" :label-width="100" ref="submit_data" :mask-closable="false" :rules="ruleValidate" inline label-position="right" >
                    <Row>
                        <Col>
                            <Form-item label="月份：" prop="month" >
                                <DatePicker :disabled='modal_title != "新增快递"' type="month" size="small"  style="width:150px" v-model="ModalForm.month" placeholder="请选择月份"></DatePicker>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="销售渠道：" prop="platfromCode">
                                <Select :disabled='modal_title != "新增快递"' v-model="ModalForm.platfromCode" @on-change='changePlatfrom' style="width:150px" size="small">
                                    <Option v-for="item in Modal_platfrom_List" :value="item.value" :key="item.value">{{ item.label }}
                                    </Option>
                                </Select>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="品牌：" prop="brandId">
                                <Select :disabled='modal_title != "新增快递"'  v-model.number="ModalForm.brandId" style="width:150px" size="small" @on-change='changeBrand'>
                                    <Option v-for="item in modalBrandList" :value="item.id" :key="item.id">{{ item.brands }}
                                    </Option>
                                </Select>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="快递费：" prop="expressPrice">
                                <Input v-model.number="ModalForm.expressPrice" size="small"  placeholder="请输入快递费" style="width:150px"></Input>
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
                            action="/eop/bi/import_cost_express"
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
        </div>
    </div>
</template>

<script>
    import Util from 'libs/util';

    function formSearch(){
        return {
            brandId:'',
            month:'',
            platfromCode:''
        }
    }

    function ModalForm(){
        return {
            brandId:'', 	        //  品牌id	        number	
            brandName:'',           //	品牌名称	    string	
            createUser:'',          //	创建人	        string	当前用户账号
            month:'',               //	月份	        string	格式：yyyy-mm
            platfromCode:'',        //	销售渠道代码	 string	1：天猫，2：唯品会
            platfromName:'',        //	渠道名称	    string	
            remark:'',              //	备注	        string
            expressPrice:'',        //  快递费
        }
    }

    export default {
        name:'parameter_Express',
        data(){
            return {
                platfrom_List:[
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:'1',
                        label:'天猫'
                    },
                    {
                        value:'2',
                        label:'唯品会'
                    }
                ],
                Modal_platfrom_List:[
                    {
                        value:'1',
                        label:'天猫'
                    },
                    {
                        value:'2',
                        label:'唯品会'
                    }
                ],
                formSearch:formSearch(),
                ModalForm:ModalForm(),
                modal_visible:false,
                modal_title:'',
                userInfo:{},
                columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '月份',
                        key: 'month',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '销售渠道',
                        key: 'platfromName',
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
                        title: '快递费平均单价',
                        key: 'expressPrice',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '创建人',
                        key: 'createUser',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '创建时间',
                        key: 'created',
                        align: 'center',
                        minWidth: 180
                    },
                    {
                        title: '最新修改人',
                        key: 'lastUpdateUser',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '最新修改时间',
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
                            if(params.row.serialNo=='合计'){
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
                                            this.openModal('编辑快递',params.row);
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
                                }, '删除')
                            ]);
                        }
                    }
                ],
                list:[],
                total:0,
                page:1,
                pageSize:10,
                ruleValidate:{
                    month: [
                        { required: true,type:'date', message: '请选择月份', trigger: 'change' }
                    ],
                    brandId: [
                        { required: true,type:'number', message: '请选择品牌', trigger: 'change' }                        
                    ],
                    platfromCode: [
                        { required: true, message: '请选择销售渠道', trigger: 'change' }                        
                    ],
                    expressPrice:[
                        { required: true,type:'number', message: '请输入快递费', trigger: 'blur' }                        
                    ]
                },
                file:null,
                loadingStatus: false,
                importModal: false,
            }
        },
        mounted(){
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));
        },
        props:['brandList','modalBrandList'],
        methods:{
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
            getData(){
                let data = Util.deepClone(this.formSearch);
                if(!!data.month){
                    data.month = Util.dateFormat(this.formSearch.month,'yyyy-MM');
                }
                data.start = (this.page - 1) * this.pageSize;
                data.length = this.pageSize;
                this.request('get_cost_express',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.costExpressList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.total = res.data.count;
                        this.list = res.data.costExpressList;
                        let lastPage = Math.ceil(this.total / this.pageSize);
                        if(this.page == lastPage){
                            this.list.push({
                                serialNo:'合计',
                                expressPrice:res.data.sumExpressPrice
                            })
                        }
                    }
                })
            },
            openImportModal(){
                this.importModal = true;
            },
            openModal(type,row){
                this.modal_visible = true;
                this.modal_title = type;
                if(type == '编辑快递'){
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
                if(this.modal_title == '新增快递'){
                    data.createUser = this.userInfo.userName;
                    url = 'add_cost_express';
                }else if(this.modal_title == '编辑快递'){
                    url='edit_cost_express';
                    data.lastUpdateUser = this.userInfo.userName;
                    delete data.serialNo;
                    delete data._index;
                    delete data._rowKey;
                }
                data.month = Util.dateFormat(data.month,'yyyy-MM');

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
                        this.request('delete_cost_express',{
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
                window.location = ('/excel/快递费导入模板.xlsx')
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
            }
        },
        components:{

        }
    }
</script>

<style lang="css">

</style>


