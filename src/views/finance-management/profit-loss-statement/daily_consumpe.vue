<template>
    <div id='daily_consumpe' class="background-color-white exhibition">
        <Row>
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Form-item label="月份：" :label-width="50">
                    <DatePicker
                        type="month"
                        format="yyyy-MM"
                        placeholder="月份"
                        style="width: 170px"
                        v-model="formSearch.Month"
                    >
                    </DatePicker>
                </Form-item>
                <Form-item label="品牌：" :label-width="80">
                    <Select style="width:170px" v-model="formSearch.brandId" @on-change='search' placeholder="请选择品牌">
                        <Option v-for="item in brandList" :value="item.id" :key="item.id">
                            {{item.brands }}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item :label-width="10">
                    <Button type="primary" @click="search">查询</Button> 
                    <Button type="warning" @click="reset" >重置</Button>           
                </Form-item>
            </Form>
        </Row>
        <Row>
            <Col class="margin-bottom-10">
                <Button type="primary" @click="downTemplate">下载模板</Button>                 
                <Button type="primary" @click='modal_visible = true'>新增</Button> 
                <Button type="primary" @click='openModal'>导入</Button> 
            </Col>
        </Row>
        <Row>
            <Col class="margin-bottom-10">
                <Table :columns="columns" size="small" :data="list"></Table>
            </Col>
            <Col>
                <Page  :page-size-opts="[16,32,48,64]" :total="total" :page-size="pageSize" :current="page"  show-sizer show-total show-elevator @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
            </Col>
        </Row>
        <div class="modal">
            <Modal 
                v-model="modal_visible" 
                :mask-closable="false" 
                title="新增目标日消耗" 
                :width="400"
                :transfer="true"
                class-name="customize-modal-center"
            >   
                <Form :model="ModalForm" :label-width="100" ref="submit_data" :mask-closable="false" :rules="rule" inline label-position="right" >
                    <Row>
                        <Col>
                            <Form-item label="月份：" prop='month'>
                                <DatePicker
                                    type="month"
                                    format="yyyy-MM"
                                    placeholder="月份"
                                    style="width: 170px"
                                    v-model="ModalForm.month"
                                >
                                </DatePicker>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="品牌：" prop="brandId">
                                <Select v-model.number="ModalForm.brandId" style="width:170px" @on-change='changeBrand'>
                                    <Option v-for="item in modalBrandList" :value="item.id" :key="item.id">{{ item.brands }}
                                    </Option>
                                </Select>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="目标日消耗：" prop="daily_consumpe">
                                <Input v-model="ModalForm.daily_consumpe" placeholder="请输入目标日消耗"></Input>
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
                        action="/eop-node/api/analysis/import_daily_consumpe"
                        :data="{month:month,account:userInfo.userName,userId:userInfo.userId}"
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
    import Util from 'libs/util';
    function formSearch(){
        return {
            Month:'',
            brandId:0
        }
    }
    function ModalForm(){
        return {
            brandId:'',
            month:'',
            daily_consumpe:'',
            brandName:''
        }
    }
    export default {
        name:'daily_consumpe',
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
                formSearch:formSearch(),
                ModalForm:ModalForm(),
                brandList:[],
                list:[],
                table_row_index:-1,
                columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        width: 60
                    },
                    {
                        title: '月份',
                        key: 'month',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            if ((this.page - 1) * this.pageSize + params.index == this.table_row_index) {
                                return h('DatePicker', {
                                    props: {
                                        value: this.list[params.index].month,
                                        size: 'small',
                                        type: 'month'
                                    },
                                    on: {
                                        'on-change': (event) => {
                                            this.list[params.index].month = Util.dateFormat(event,'yyyy-MM');
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.month)
                            }
                        }
                    },
                    {
                        title: '品牌',
                        key: 'brand_name',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            if ((this.page - 1) * this.pageSize + params.index == this.table_row_index) {
                                    return h('Select', {
                                        props:{
                                            value: this.list[params.index].brand_id,
                                            size: 'small'
                                        },
                                        on: {
                                            'on-change':(value) => {
                                                this.list[params.index].brand_id = value;
                                                this.modalBrandList.map(x=>{
                                                    if(x.id == value){
                                                        this.list[params.index].brand_name = x.brands;
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
                                return h('span', params.row.brand_name)
                            }
                        }
                    },
                    {
                        title: '目标日消耗',
                        key: 'daily_consumpe',
                        align: 'center',
                        minWidth: 80,
                        render: (h, params) => {
                            if ((this.page - 1) * this.pageSize + params.index == this.table_row_index) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].daily_consumpe,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].daily_consumpe = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                if(params.row.serialNo=='合计'){
                                     return h('span', {
                                        style:{
                                            'color':'blue'
                                        }
                                     },params.row.daily_consumpe)
                                }else{
                                    return h('span', params.row.daily_consumpe)
                                }
                            }
                        }
                    },
                    {
                        title: '导入人',
                        key: 'create_user',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '导入日期',
                        key: 'created',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        minWidth: 200,
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
                                            this.table_row_index = (this.page - 1) * this.pageSize + params.index;
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
                                            data.last_update_user = this.userInfo.userName;
                                            delete data.serialNo;
                                            delete data._index;
                                            delete data._rowKey;
                                            this.request('update_daily_consumpe',data,true).then(res=>{
                                                if(res.status == 'success'){
                                                    this.table_row_index = -1;
                                                    this.$Message.success(res.message);
                                                    this.get_daily_consumpe_list();
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
                                                    this.request('delete_daily_consumpe',{
                                                        uuid:params.row.uuid
                                                    },true).then(res=>{
                                                        if(res.status == 'success'){
                                                            this.$Message.success(res.message);
                                                            this.get_daily_consumpe_list();
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
                page:1,
                pageSize:16,
                total:0,
                importModal:false,
                userInfo:{},
                file:null,
                month:'',
                modal_visible:false,
                modalBrandList:[],
                rule:{
                    brandId: [
                        { required: true, type:'number', message: '请选择品牌', trigger: 'change' }
                    ],
                    month: [
                        { required: true, type:'date', message: '请选择月份', trigger: 'change' }
                    ],
                    daily_consumpe: [
                        { required: true, message: '请输入目标日消耗', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ]
                }
            }
        },
        computed:{

        },
        mounted(){
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));
            this.getBrandList();
            this.get_daily_consumpe_list();
        },
        methods:{
            search(){
                this.page = 1;
                this.get_daily_consumpe_list();
            },
            reset(){
                this.formSearch = formSearch();
                this.page = 1;
                this.get_daily_consumpe_list();
            },
            get_daily_consumpe_list(){
                let brandId = this.formSearch.brandId == 0 ? '' : this.formSearch.brandId;
                this.request('get_daily_consumpe_list',{
                    page:this.page,
                    pageSize:this.pageSize,
                    brandId:brandId,
                    month:!this.formSearch.Month?'':Util.dateFormat(this.formSearch.Month,'yyyy-MM')
                },true).then(res=>{
                    if(res.status == 'success'){
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        let daily_consumpe_total =0;
                        res.data.data.map((item) => {
                            serialNoBegain++;
                            daily_consumpe_total+=Number(item.daily_consumpe)
                            item.serialNo = serialNoBegain;
                        })
                        res.data.data.push({
                            serialNo:'合计',
                            daily_consumpe:Number(daily_consumpe_total).toFixed(2)
                        })
                        this.total = res.data.count;
                        this.list = res.data.data;
                    }
                })
            },
            getBrandList() {
                this.request('bi_brand_list', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    data: {}
                }, false).then((res) => {
                    this.brandList = res.data;
                    this.modalBrandList = Util.deepClone(res.data);
                    this.brandList.unshift({
                        id:0,
                        brands:'所有品牌'
                    })
                })
            },
            downTemplate(){
                window.location = ('/excel/目标日消耗导入模板.xlsx')
            },
            openModal(){
                this.importModal = true;
                this.month = Util.dateFormat(this.formSearch.Month,'yyyy-MM');
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
            changeBrand(val){
                this.modalBrandList.map(x=>{
                    if(x.id == val){
                        this.ModalForm.brandName = x.brands;
                    }
                })
            },
            cancel(){
                this.importModal = false;
                this.modal_visible = false;
                this.file = null;
                this.$refs['submit_data'].resetFields();
            },
            submit(){
                let data = Util.deepClone(this.ModalForm);
                data.createUser = this.userInfo.userName;
                data.month = Util.dateFormat(data.month,'yyyy-MM');
                this.$refs["submit_data"].validate((valid) => {
                    if (valid) {
                        for(let x in data){
                            if(x == 'daily_consumpe'){
                                data[x] = data[x].replace(/[^0-9/.]/g, "");
                            }
                        }
                        this.request('add_daily_consumpe',data,true).then(res=>{
                            if(res.status == 'success'){
                                this.$Message.success(res.message);
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
            CurrentChange(val){
                this.page = val;
                this.get_daily_consumpe_list();
            },
            SizeChange(val){
                this.pageSize = val;
                this.get_daily_consumpe_list();
            }
        }
    }
</script>

<style lang="css">
    
</style>
