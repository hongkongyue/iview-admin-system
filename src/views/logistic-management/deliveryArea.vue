<template>
    <div class="background-color-white exhibition" id="deliveryArea">
        <Row class="margin-bottom-10">
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Col>
                    <Form-item label="供应商" :label-width='60'>
                        <Select v-model="formSearch.logistics_name" style="width:150px" @on-change='change_logisticsName'>
                            <Option v-for="item in logisticsName" :value="item.value" :key="item.value">{{ item.value }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="运输方式" :label-width='60'>
                        <Select v-model="formSearch.transport_type" style="width:150px" @on-change='change_transportType'>
                            <Option v-for="item in transportType" :value="item.value" :key="item.value">{{ item.value }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="目的地" :label-width='60'>
                        <Select v-model="formSearch.destination" style="width:150px" @on-change='change_destination'>
                            <Option v-for="item in destination" :value="item.value" :key="item.value">{{ item.value }}
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
        <Row class="margin-bottom-10">
            <Button type="primary" @click="downTemplate">下载模板</Button>
            <Button type="primary" @click="openModal">导入</Button>
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
                            action="/eop-node/api/analysis/import_delivery_area"
                            :data="{userAccount:userInfo.userAccount}"
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
    import base from 'libs/base';

    function formSearch(){
        return {
            logistics_name:'',
            transport_type:'',
            destination:''
        }
    }
    export default {
        name:'deliveryArea',
        data(){
            return {
                columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 60
                    },
                     {
                        title: '单据类型',
                        key: 'pick_type',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '供应商',
                        key: 'logistics_name',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '运输方式',
                        key: 'transport_type',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '目的地',
                        key: 'destination',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '单价',
                        key: 'cost',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '最小重量（KG）',
                        key: 'minimum_weight',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '最大重量（KG）',
                        key: 'maximum_weight',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '起重',
                        key: 'lifting',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '最低收费',
                        key: 'minimum_charge',
                        align: 'center',
                        minWidth: 100
                    }
                ],
                formSearch:formSearch(),
                list:[],
                page:1,
                pageSize:10,
                total:0,
                file:null,
                loadingStatus: false,
                importModal: false,
                userInfo:{},
                temp_list:[],
                logisticsName:[
                    {
                        value:'跨越'
                    },
                    {
                        value:'品骏'
                    }
                ],
                transportType:[
                    {
                        value:'汽运'
                    },
                    {
                        value:'空运'
                    }
                ],
                destination:[]
            }
        },
        mounted(){
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo')); 
            this.getData();   
            this.destination = base.destination_list;
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
                data.page = this.page;
                data.pageSize = this.pageSize;
                this.request('get_delivery_area',data,true).then(res=>{
                    if(res.code == 1){
                        this.total = res.data.count;
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.data.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        res.data.data.map(x=>{
                            x.maximum_weight = x.maximum_weight == 0 ? '/' : x.maximum_weight;
                            x.lifting = x.lifting == 0 ? '/' : x.lifting;
                            x.minimum_charge = x.minimum_charge == 0 ? '/' : x.minimum_charge;
                        })
                        this.list = res.data.data;
                    }
                })
            },
            openModal(){
                this.importModal = true;
            },
            downTemplate(){
                window.location = ('/excel/唯品会发货地区名称(跨越物流费).xlsx')
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
            cancel(){
                this.importModal = false;
                this.file = null;
            },
            change_logisticsName(){
                if(!!this.formSearch.logistics_name){
                    this.search();
                }
            },
            change_transportType(){
                if(!!this.formSearch.transport_type){
                    this.search();
                }
            },
            change_destination(){
                if(!!this.formSearch.destination){
                    this.search();
                }
            },
            CurrentChange(val){
                this.page = val;                    
                this.getData();
            },
            SizeChange(val){
                this.pageSize = val;
                this.getData();
            }
        }
    }
</script>
        
    