<template>
    <div class="background-color-white exhibition" id="daily">
        <Row class="margin-bottom-10">
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Col>
                    <Form-item label="月份：" :label-width="50">
                        <DatePicker type="month" :options="pickerOptions" v-model="formSearch.startMonth" @on-change='change' placeholder="选择开始月份" style="width: 120px;margin-right:3px;"></DatePicker>
                        <DatePicker type="month" :options="pickerOptions" v-model="formSearch.endMonth" @on-change='change' placeholder="选择结束月份" style="width: 120px"></DatePicker>
                    </Form-item>
                    <Form-item label="品牌：" :label-width='60'>
                        <Select v-model="formSearch.brandId" style="width:150px">
                            <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item :label-width="10">
                        <Button type="primary" icon="ios-search" @click="search">查询</Button>
                        <Button type="warning" @click="reset">重置</Button>
                    </Form-item> 
                </Col>
            </Form>
        </Row>
        <Row>
            <Button type="primary" @click="downTemplate">下载模板</Button>
            <Button type="primary" @click="importModal = true">导入</Button>
            <Button type="primary" @click="exportData">导出</Button>                
        </Row>
        <Row class="margin-top-10">
            <Col class="margin-bottom-10">
                <Table :columns="columns" size="small" :data="List"></Table>
            </Col>
            <Col>
                <Page :page-size-opts="[16,32,48,64]" :total="total" :page-size="pageSize" :current="page"  show-sizer show-total show-elevator @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
            </Col>
        </Row>
        <div class="modal">
            <Modal
                    v-model="importModal"
                    title="数据导入">
                <div>
                    <Upload
                            ref="upload"
                            name="file"
                            :show-upload-list="false"
                            :before-upload="handleUpload"
                            :on-success="uploadSuccess"
                            :on-error="uploadError"
                            type="drag"
                            action="/eop/bi/import_final_service_fee"
                            :data="{userCode:userInfo.userName}"
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
            brandId:0,                 //  品牌id
            endMonth:'',               
            startMonth:''             
        }
    }

    export default {
        name:'final-account-service-fee',
        data(){
            return {
                formSearch:formSearch(),
                List:[],
                table_row_index:-1,
                columns:[
                    {
                        title: '月份',
                        key: 'month',
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
                        title: '劳务费总额',
                        key: 'totalFee',
                        align: 'center',
                        minWidth: 120,
                        render: (h, params) => {
                            if ((this.page - 1) * this.pageSize + params.index == this.table_row_index) {
                                let totalFee = 0;
                                return h('InputNumber', {
                                    props: {
                                        value: this.List[params.index].totalFee,
                                        size: 'small',
                                        min:0
                                    },
                                    on: {
                                        'input': (value) => {
                                            totalFee = value;
                                        },
                                        'on-blur': () => {
                                            this.List[params.index].totalFee = totalFee;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.totalFee)
                            }
                        }
                    },
                    {
                        title: '报废损失',
                        key: 'totalWaste',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '导入人',
                        key: 'createUser',
                        align: 'center',
                        minWidth: 100
                    },{
                        title: '导入日期',
                        key: 'created',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '修改人',
                        key: 'lastUpdateUser',
                        align: 'center',
                        minWidth: 100
                    },{
                        title: '修改日期',
                        key: 'lastUpdated',
                        align: 'center',
                        minWidth: 150
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
                                            data.lastUpdateUser = this.userInfo.userName;
                                            delete data.serialNo;
                                            delete data._index;
                                            delete data._rowKey;
                                            this.request('edit_final_service_fee',{
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
                                                    let data = Util.deepClone(params.row);
                                                    delete data.serialNo;
                                                    delete data._index;
                                                    delete data._rowKey;
                                                    this.request('delete_final_service_fee',{
                                                        data:data
                                                    },true).then(res=>{
                                                        if(res.code == 1){
                                                            this.$Message.success(res.msg);
                                                            this.getData();
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
                pageSize:10,
                total:0,
                file:null,
                loadingStatus: false,
                userInfo:{},
                brandList:[],
                importModal:false
            }
        },
        computed:{
            
        },
        mounted(){
            this.getBrandList();
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));     
            this.search();
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
                data.startMonth = !!data.startMonth ? Util.dateFormat(data.startMonth,'yyyy-MM') : ''
                data.endMonth = !!data.endMonth ? Util.dateFormat(data.endMonth,'yyyy-MM') : ''
                
                this.request('get_final_service_fee_list',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        this.total = res.data.count;
                        this.List = res.data.finalServiceFeeList;
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
                        id:0,
                        brands:'所有品牌'
                    })
                })
            },
            downTemplate(type){
                window.location = ('/excel/损益决算其他变动项导入模板.xlsx');
            },
            cancel(){
                this.importModal = false;
                this.file = null;                
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
            exportData(){
                let data = Util.deepClone(this.formSearch);
                data.brandId = data.brandId == 0 ? '' : data.brandId;
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
                axios.get(`/eop/bi/export_final_service_fee?data=${encodeURIComponent(JSON.stringify(formData))}`,{

                },true).then(res=>{
                    if(res.status == 200 && !!res.data ){
                        window.open( `/eop/bi/export_final_service_fee?data=${encodeURIComponent(JSON.stringify(formData))}`);
                        this.$Spin.hide();
                    }else{
                        this.$Message.warning('无数据可导出！');
                        this.$Spin.hide();
                    }
                })
            },
        }
    }
</script>

<style lang="css">

</style>
