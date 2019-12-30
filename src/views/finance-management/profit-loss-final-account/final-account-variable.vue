<template>
    <div id='final_account_variable' class="background-color-white exhibition">
        <Form :model="formSearch" class="search" ref="formSearch" :label-width="1" inline label-position="right">
            <Row>
                <Form-item label="渠道：" :label-width="50">
                    <Select style="width:150px" v-model="formSearch.platfromCode" @on-change='change' placeholder="请选择渠道">
                        <Option v-for="item in platformList" :value="item.PLATFROM_ID" :key="item.PLATFROM_ID">
                            {{ item.PLATFROM_NAME }}
                        </Option>
                    </Select>          
                </Form-item>
                <Form-item label="品牌：" :label-width="50">
                    <Select style="width:150px" v-model="formSearch.brandId" @on-change='change' placeholder="请选择品牌">
                        <Option v-for="item in brandList" :value="item.id" :key="item.id">
                            {{ item.brands }}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item label="月份：" :label-width="50">
                    <DatePicker type="month" :options="pickerOptions" v-model="formSearch.startMonth" @on-change='change' placeholder="选择开始月份" style="width: 120px;margin-right:3px;"></DatePicker>
                    <DatePicker type="month" :options="pickerOptions" v-model="formSearch.endMonth" @on-change='change' placeholder="选择结束月份" style="width: 120px"></DatePicker>
                </Form-item>
                <Form-item label="版本：" :label-width="50">
                    <Select style="width:150px" v-model.number="formSearch.versionNumber" @on-change='change' placeholder="请选择版本">
                        <Option v-for="item in version_list" :value="item.value" :key="item.value">
                            {{ item.label }}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item :label-width="10">
                    <Button type="primary" @click="search">查询</Button> 
                    <Button type="warning" @click="reset" >重置</Button> 
                </Form-item>
            </Row>
        </Form>
        <Row class="margin-top-10">
            <Button type="primary" @click="downTemplate" >下载模板</Button>                     
            <Button type="primary" @click="openModal" >导入</Button>                     
            <Button type="primary" @click="exportData" >导出</Button>                     
        </Row>
        <Row class="margin-top-10">
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
                        action="/eop/bi/import_final_parameter"
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
                    <Button type="default" @click="cancel">取消</Button>
                    <Button type="primary" @click="upload">导入</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import Util from 'libs/util';
    import axios from 'axios';

    function formSearch(){
        return {
            platfromCode:'',
            brandId:'',
            startMonth:'',
            endMonth:'',
            versionNumber:''
        }
    }

    export default {
        name:'final_account_variable',
        data(){
            return {
                formSearch:formSearch(),
                loadingStatus:false,
                importModal:false,
                userInfo:{},
                file:null,
                platformList:[],
                brandList:[],
                version_list:[],
                list:[],
                columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '月份',
                        key: 'month',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '渠道',
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
                        title: '销售收入',
                        key: 'salesIncome',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '销售成本',
                        key: 'salesCost',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '销售佣金',
                        key: 'salesCommission',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '保险理赔',
                        key: 'insurance',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '退货包运费',
                        key: 'backFreight',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '广告费用',
                        key: 'adFee',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '物流费用',
                        key: 'expressFee',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '短信或营销费用',
                        key: 'messagePrice',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '微信红包',
                        key: 'weixinUsed',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '仓库快递费',
                        key: 'warehouseFreight',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '创建人',
                        key: 'createUser',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '导入版本',
                        key: 'versionNumber',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        minWidth: 200,
                        render: (h, params) => {
                            if(params.row.serialNo  == '合计'){
                                return h('div','')
                            }
                            return h('div', [
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
                                                    this.request('delete_final_parameter',{
                                                        data:{
                                                            id:params.row.id
                                                        }
                                                    },true).then(res=>{
                                                        if(res.code == '1'){
                                                            this.$Message.success(res.msg);
                                                            this.getData();
                                                        }else{
                                                            this.$Message.warning(res.msg);
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
                total:0,
                pageSize:16,
                page:1
            }
        },
        mounted(){
            this.getPlatformList();
            this.getBrandList();
            this.get_final_parameter_version();
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo')); 
            this.search();      
        },
        activated(){

        },
        methods:{
            search(){
                this.page = 1;
                this.getData();
            },
            reset(){
                this.formSearch = formSearch();
                this.search();
            },
            getData(){
                let data = Util.deepClone(this.formSearch);
                data.length = this.pageSize;
                data.start = (this.page - 1) * this.pageSize;
                data.brandId = data.brandId == 0 ? '' : data.brandId;
                data.platfromCode = data.platfromCode == 0 ? '' : data.platfromCode;
                data.startMonth = !!data.startMonth ? Util.dateFormat(data.startMonth,'yyyy-MM') : ''
                data.endMonth = !!data.endMonth ? Util.dateFormat(data.endMonth,'yyyy-MM') : ''
                this.request('get_final_parameter_list',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        this.total = res.data.count;
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.finalParameterList.map(item=>{
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                            item.versionNumber = 'V' + item.versionNumber + '.0';
                        })
                        let lastPage = Math.ceil(this.total / this.pageSize);
                        this.list = res.data.finalParameterList;
                        if(this.page == lastPage){
                            let finalParameterTotal = res.data.finalParameterTotal;
                            finalParameterTotal.serialNo = '合计';
                            this.list.push(finalParameterTotal);
                        }
                    }
                })
            },
            change(){
                this.search();
                this.get_final_parameter_version();
            },
            get_final_parameter_version(){
                let data = Util.deepClone(this.formSearch);
                data.brandId = data.brandId == 0 ? '' : data.brandId;
                data.platfromCode = data.platfromCode == 0 ? '' : data.platfromCode;
                data.startMonth = !!data.startMonth ? Util.dateFormat(data.startMonth,'yyyy-MM') : ''
                data.endMonth = !!data.endMonth ? Util.dateFormat(data.endMonth,'yyyy-MM') : ''
                delete data.versionNumber;
                
                this.request('get_final_parameter_version',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        this.version_list = [];
                        res.data.map(x=>{
                            this.version_list.push({
                                label:'V' + x + '.0',
                                value:x
                            })
                        })
                        this.version_list = this.version_list.sort((x,y)=>{
                            return x.value - y.value
                        })
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
                    this.brandList.unshift({
                        id: 0,
                        brands: '所有品牌'
                    })
                })
            },
            getPlatformList() {
                this.request('get_platform_list', {}, false).then((res) => {
                    this.platformList = res.data
                    this.platformList.unshift({
                        PLATFROM_ID: 0,
                        PLATFROM_NAME: '所有平台'
                    })
                })
            },
            cancel(){
                this.importModal = false;
                this.file = null;
            },
            upload(){
                this.loadingStatus = true;
                Vue.prototype.$loading('正在导入数据...');
                this.$refs.upload.post(this.file);
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
                if (res.code == '1') {
                    this.loadingStatus = false;
                    this.file = null;
                    this.$Message.success(res.msg);
                    this.importModal = false;
                    this.search();
                    this.get_final_parameter_version();
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
            downTemplate(){
                window.location = ('/excel/决算变动参数导入模板.xlsx');
            },
            openModal(){
                this.importModal = true;
            },
            exportData(){
                let data = Util.deepClone(this.formSearch);
                data.brandId = data.brandId == 0 ? '' : data.brandId;
                data.platfromCode = data.platfromCode == 0 ? '' : data.platfromCode;
                data.startMonth = !!data.startMonth ? Util.dateFormat(data.startMonth,'yyyy-MM') : ''
                data.endMonth = !!data.endMonth ? Util.dateFormat(data.endMonth,'yyyy-MM') : ''
                for(let x in data){
                    if(!data[x]){
                        delete data[x]
                    }
                }
                var formData=new FormData();
                for(var key in data){
                    formData[key] = data[key];
                }
                this.$Spin.show();
                axios.get(`/eop/bi/export_final_parameter?data=${encodeURIComponent(JSON.stringify(formData))}`,{

                },true).then(res=>{
                    if(res.status == 200 && !!res.data ){
                        window.open( `/eop/bi/export_final_parameter?data=${encodeURIComponent(JSON.stringify(formData))}`);
                        this.$Spin.hide();
                    }else{
                        this.$Message.warning('无数据可导出！');
                        this.$Spin.hide();
                    }
                })
            },
            CurrentChange(val){
                this.page = val;
                this.getData();
            },
            SizeChange(val){
                this.pageSize = val;
                this.getData();
            },
        }
    }
</script>

<style>
    #final_account_variable{

    }
</style>

