<template>
    <div id="ad_fee">
        <Row>
            <Col class="margin-bottom-10">
                <Table :columns="columns" size="small" :data="list"></Table>
            </Col>
            <Col>
                <Page :total="total"  :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
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
                        action="/eop-node/api/analysis/import_ad_fee"
                        :data="{userAccount:userInfo.userAccount,userId:userInfo.userId}"
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

    export default {
        name:'ad_fee',
        data(){
            return {
                list:[],
                columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 60
                    },
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
                        title: '平台',
                        key: 'platform_name',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '广告费',
                        key: 'ad_fee',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '维护人',
                        key: 'created_user',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '维护日期',
                        key: 'created',
                        align: 'center',
                        minWidth: 150
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
                        minWidth: 150,
                        render: (h, params) => {
                            if(params.row.serialNo == '合计'){
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
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '该行将会删除，请确认！',
                                                onOk: () => {
                                                    this.request('del_daily_addfee',{
                                                        id:params.row.id
                                                    },true).then(res=>{
                                                        if(res.errno == 0){
                                                            this.$Message.success(res.data);
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
                userInfo:{},
                importModal: false,
                file: null
            }
        },
        props:['formSearch'],
        mounted(){
            this.search();
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));     
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
                let data = {};
                data.page = this.page;
                data.pageSize = this.pageSize;
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
                if(this.formSearch.platformCode){
                     data.platformCode = this.formSearch.platformCode
                }      
                this.request('get_daily_addfee',data,true).then(res=>{
                    if(res.errno == 0){
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.data.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.list = res.data.data;
                        this.total = res.data.count;
                        let lastPage = Math.ceil(this.total / this.pageSize);
                        if(this.page == lastPage){
                            this.list.push(res.data.totalList);
                        }
                    }
                })
            },
            cancel(){
                this.importModal = false;
                this.file = null;
            },
            CurrentChange(val){
                this.page = val;
                this.getData();
            },
            SizeChange(val){
                this.pageSize = val;
                this.getData();
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
                if (res.errno == 0) {
                    this.loadingStatus = false;
                    this.file = null;
                    this.$Message.success(res.data);
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
            importOrderSave() {
                this.loadingStatus = true;
                Vue.prototype.$loading('正在导入数据...');
                this.$refs.upload.post(this.file);
            },
            export_ad_fee(){
                let data = Util.deepClone(this.formSearch);
                !!data.startDate?data.startDate = Util.dateFormat(this.formSearch.startDate,'yyyy-MM-dd'):data.startDate = '';
                !!data.endDate?data.endDate = Util.dateFormat(this.formSearch.endDate,'yyyy-MM-dd'):data.endDate = '';
                data.brandId == 0 ? data.brandId = '' : data.brandId = this.formSearch.brandId;
                this.request('export_ad_fee',data,true).then(res=>{
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

