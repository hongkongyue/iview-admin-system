<template>
    <div class="background-color-white exhibition">
        <Row class="margin-bottom-10">
            <Col span="24" class="search">
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Row>
                    <Form-item label="期间:" :label-width="70">
                        <DatePicker type="month" v-model="balanceMonth" placeholder="请选择下单时间" style="width: 200px"></DatePicker>
                    </Form-item>
                    <Form-item label="店铺:">
                        <Select style="width:250px" v-model="shopId" placeholder="请选择" @on-change="changeShop">
                            <Option v-for="item in pinduoduo_shop_list" :value="item.shop_id" :key="item.shop_id">{{ item.shop_name}}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item :label-width="1">
                        <Button type="primary" @click="search" icon="ios-search">查询</Button>
                    </Form-item>
                </Row>
            </Form>
            </Col>
        </Row>

        <Row class-name="margin-bottom-10">
            <Col span="24" class="">
                <Button type="primary" icon="arrow-up-a" @click="importData('bill')">
                    导入账单
                </Button>
                <Button type="primary" icon="arrow-up-a" @click="importData('oms')">
                    同步OMS订单
                </Button>
                <Button type="primary" icon="checkmark-round" @click="autoCheckOrder" v-if="formSearch.platform_check_status == 0">
                    自动核销
                </Button>
                <Button type="primary" icon="arrow-down-a" @click="exportData('yet')" v-if="formSearch.platform_check_status == 1">
                    导出已核销
                </Button>
                <Button type="primary" icon="arrow-down-a" @click="exportData('no_yet')" v-if="formSearch.platform_check_status == 0">
                    导出未核销
                </Button>
            </Col>
        </Row>

        <Tabs @on-click="changeCheckStatus" value="nocheck">
            <TabPane label="核销匹配" name="nocheck"></TabPane>
            <TabPane label="核销查询" name="checked"></TabPane>
        </Tabs>

        <Row class="margin-bottom-10">
            <Alert>拼多多</Alert>
            <Table ref="pinduoduoList" size="small" :loading="pinduoduoLoading" height="300" :columns="pinduoduoColumns" :data="pinduoduoList"></Table>
            <Page style="margin-top:5px;" :total="pinduoduoTotal" :page-size="pinduoduoPageSize" :current="pinduoduoPage" show-sizer show-total show-elevator
                @on-change="pinduoduoCurrentChange" @on-page-size-change="pinduoduoSizeChange"></Page>
        </Row>
        <Row class="margin-bottom-10">
            <Alert>旺店通</Alert>
            <Table ref="wangdiantongList" size="small" :loading="loading" height="300" :columns="columns" :data="list"></Table>
            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="currentChange"
                @on-page-size-change="sizeChange"></Page>
        </Row>

        <!-- 导入弹窗 -->
        <Modal
                v-model="importModal"
                title="导入账单">
            <div>
                <Upload
                        ref="upload"
                        name="file"
                        :show-upload-list="false"
                        :before-upload="handleUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        type="drag"
                        action="/eop-node/api/finance/importPinduoduoData"
                        :data="{account:userInfo.userAccount,userId:userInfo.userId,balanceMonth:balanceMonth,shopId:shopId,importType:importType}"
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
</template>

<script>
    import Util from 'libs/util'
    let searchHeader = Vue.extend({
        props: ['params'],
        data() {
        return {
            placeholder: '',
            searchData: '',
            visible: false,
            data: [],
        }
        },
        template: `
            <div >
            <Poptip v-model="visible" placement="bottom-start" transfer="true">
            　<span>{{data.title}}</span>
            　<span class="ivu-table-filter"><i @on-click="openSerach" class="ivu-icon ivu-icon-funnel"></i></span>
            <div slot="title"></div>
            <div slot="content">
            <div>
                <Input @on-enter.stop="search"　v-model="searchData"  :placeholder="placeholder"></Input>
            </div>
            </div>
            </Poptip>
            </div>
        `,
        mounted() {
        this.data = this.params.column;
        this.placeholder = '请输入' + this.data.title + '后回车查询';
        },
        methods: {
        openSerach() {
            this.visible = true;
        },
        search() {
            this.$root.eventHub.$emit('refreshJdRreshData', {
            columnName: this.data.key,
            searchData: this.searchData,
            tableType: this.params.tableType
            })
            this.visible = false;
        }
        }
    })
    let pinduoduoColumns = [
        {
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
            title: '序号',
            key: 'serialNo',
            align: 'center',
            width: 80
        },
        {
            title: '商户订单号',
            key: 'order_id',
            align: 'center',
            width: 200,
            renderHeader: (h, params) => {
                params.tableType = 'pinduoduoList';
                return h(searchHeader, {
                props: {
                    params: params
                }
                })
            }
        },
        {
            title: '发生时间',
            key: 'created',
            align: 'center',
            width: 150,
        },
        {
            title: '收入金额',
            key: 'total_amount',
            align: 'center',
            width: 150,
            renderHeader: (h, params) => {
                params.tableType = 'pinduoduoList';
                return h(searchHeader, {
                    props: {
                        params: params
                    }
                })
            }
        },
        {
            title: '支出金额',
            key: 'total_money',
            align: 'center',
            width: 150,
            renderHeader: (h, params) => {
                params.tableType = 'pinduoduoList';
                return h(searchHeader, {
                    props: {
                        params: params
                    }
                })
            }
        },
        {
            title: '账务类型',
            key: 'order_type',
            align: 'center',
            minWidth: 80,
        },
        {
            title: '备注',
            key: 'remark',
            align: 'center',
            minWidth: 80,
        },
    ]

    let columns = [{
            type: 'selection',
            minWidth: 60,
            align: 'center'
        },
        {
            title: '序号',
            key: 'serialNo',
            align: 'center',
            minWidth: 80
        },
        {
            title: '原始单号',
            key: 'source_code',
            align: 'center',
            minWidth: 200,
            renderHeader: (h, params) => {
                params.tableType = 'wangdiantongList';
                return h(searchHeader, {
                    props: {
                        params: params
                    }
                })
            }
        },
        {
            title: '下单时间',
            key: 'created',
            align: 'center',
            minWidth: 150,
        },
        {
            title: '商家编码',
            key: 'sku_id',
            align: 'center',
            minWidth: 120,
            renderHeader: (h, params) => {
                params.tableType = 'wangdiantongList';
                    return h(searchHeader, {
                    props: {
                        params: params
                    }
                })
            }
        },
        {
            title: '下单数量',
            key: 'num',
            align: 'center',
            minWidth: 100,
        },
        {
            title: '成交价',
            key: 'total_money',
            align: 'center',
            minWidth: 80,
            renderHeader: (h, params) => {
                params.tableType = 'wangdiantongList';
                    return h(searchHeader, {
                    props: {
                        params: params
                    }
                })
            }
        },
        {
            title: '退款时间',
            key: 'bill_created',
            align: 'center',
            minWidth: 150
        },
        {
            title: '退款金额',
            key: 'total_amount',
            align: 'center',
            minWidth:100,
            renderHeader: (h, params) => {
                params.tableType = 'wangdiantongList';
                    return h(searchHeader, {
                    props: {
                        params: params
                    }
                })
            }
        }
    ];

    
    export default {
        data(){
            return{
                formSearch:{
                    platform_check_status:0,
                    jd_oms_check_status:0
                },
                omsFormSearch:{},
                pinduoduo_shop_list:[],
                balanceMonth: '',
                shopId:0,
                shopName:'',
                importType:'',
                importModal:false,
                loading: false,
                userInfo:{},
                file:null,
                list:[],
                columns:columns,         
                //总共数据多少条
                total: 0,
                //每页多少条数据
                pageSize: 10,
                //当前页码
                page: 1,
                //钱包
                pinduoduoList:[],
                pinduoduoColumns:pinduoduoColumns,
                pinduoduoTotal: 0,
                pinduoduoPageSize: 10,
                pinduoduoPage: 1,
                pinduoduoLoading: false,
            }
        },
        mounted(){
            let that = this;
            let nowDate = new Date();
            nowDate.setMonth(nowDate.getMonth() - 1)
            nowDate.setDate(1)
            this.balanceMonth = nowDate;
            this.getOmsJdShopList();
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            //处理查询
            this.$root.eventHub.$on('refreshJdRreshData', (data) => {
                if (data.tableType == 'pinduoduoList') {
                    that.formSearch[data.columnName] = data.searchData;
                    that.pinduoduoPage = 1;
                    that.getBillList();
                } else if (data.tableType == 'wangdiantongList') {
                    that.omsFormSearch[data.columnName] = data.searchData;
                    that.payPage = 1;
                    that.getOmsList();
                }
            })
        },
        methods:{
            getOmsJdShopList() {
                this.request('get_oms_shop_list', {
                    platformName: 'pinduoduo'
                }, false).then((res) => {
                    if (res.errno == '0') {
                        this.pinduoduo_shop_list = res.data;
                        this.shopId = res.data[0].shop_id;
                        this.shopName = res.data[0].shop_name;
                        this.search();
                    }
                })
            },
            changeShop(val){
                this.pinduoduo_shop_list.map(x=>{
                    if(x.shop_id == val){
                        this.shopName = x.shop_name;
                    }
                })
            },
            search(){
                this.getOmsList();
                this.getBillList();
            },
            getOmsList(){
                let data = {};
                data = Util.deepClone(this.omsFormSearch);
                data.pageNum = this.page;
                data.pageSize = this.pageSize;
                this.loading = true;
                data.platform = 'pinduoduo_oms';
                data.shop_id = this.shopId
                data.balanceMonth = Util.dateFormat(this.balanceMonth, 'yyyy-MM-01 00:00:00');
                this.request('getPinduoduoFinance', data, false).then((res) => {
                    this.loading = false;
                    if (res.status == 'success') {
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.data.map((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.list = res.data.data
                        this.total = res.data.count
                    }
                })
            },
            getBillList(){
                let data = {};
                data = Util.deepClone(this.formSearch);
                data.pageNum = this.pinduoduoPage;
                data.pageSize = this.pinduoduoPageSize;
                this.pinduoduoLoading = true;
                data.platform = 'pinduoduo';
                data.shop_id = this.shopId
                data.balanceMonth = Util.dateFormat(this.balanceMonth, 'yyyy-MM-01 00:00:00');
                this.request('getPinduoduoFinance', data, false).then((res) => {
                    this.pinduoduoLoading = false;
                    if (res.status == 'success') {
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.data.map((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.pinduoduoList = res.data.data
                        this.pinduoduoTotal = res.data.count
                    }
                })
            },
            changeCheckStatus(name){
                this.formSearch={}
                this.omsFormSearch = {};
                this.pinduoduoFormSearch={};
                let status = name =='nocheck'? 0:1
                this.formSearch.jd_oms_check_status=status;
                this.formSearch.platform_check_status = status;
                this.omsFormSearch.jd_oms_check_status=status;
                this.omsFormSearch.platform_check_status=status;
                this.getOmsList();
                this.getBillList();
            },
            importData(importType){
                this.importType = importType;
                if (!this.balanceMonth) {
                    this.$Message.warning('请先选择期间');
                } else if (this.shopId <= 0) {
                    this.$Message.warning('请先选择店铺');
                } else {
                    if (importType == 'bill') {
                        this.importModal = true;
                    } else {
                        this.importOmsOrder();
                    }
                }
            },
            importOmsOrder(){
                let data = Util.deepClone(this.formSearch)
                data.balanceMonth = Util.dateFormat(this.balanceMonth, 'yyyy-MM-dd');
                this.request('finance_import_pinduoduo_data', {
                    importType: this.importType,
                    balanceMonth: Util.dateFormat(this.balanceMonth, 'yyyy-MM-dd'),
                    shopId: this.shopId
                }, '正在同步OMS订单数据...').then((res) => {
                    if (res.status == 'success') {
                        this.search();
                        this.$Message.success(res.message);
                    } else {
                        this.$Message.error(res.message);
                    }
                })
            },
            autoCheckOrder(){
                this.request('autoCheckPinduoduoOms', {
                    shopId: this.shopId,
                    balanceMonth: Util.dateFormat(this.balanceMonth, 'yyyy-MM-dd')
                }, '正在核销').then((res) => {
                    if (res.status == 'success') {
                        this.$Message.success(res.message);
                        this.search();
                    } else {
                        this.$Message.error({
                            content: res.message,
                            duration: 3
                        });
                    }
                })
            },
            exportData(type){
                if(!this.balanceMonth){
                    this.$Message.warning('请先选择期间');
                }else if(this.shopId<=0){
                    this.$Message.warning('请先选择店铺');
                }else{
                    this.request('exportPinduoduoData',{
                        shopId:this.shopId,
                        shopName:this.shopName,
                        type:type,
                        balanceMonth:Util.dateFormat(this.balanceMonth,'yyyy-MM-dd')
                    },'正在导出中').then(res=>{
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
            },
            importOrderSave(){
                if(!this.file && typeof(this.file)!="undefined" && this.file!=0){
                    this.$Message.warning('请选择文件再操作!');
                }else{
                    this.loadingStatus = true;
                    Vue.prototype.$loading('正在导入数据...');
                    this.$refs.upload.post(this.file);
                }
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
            sizeChange(val) {
                this.pageSize = val;
                this.getOmsList();
            },
            currentChange(val) {
                this.page = val;
                this.getOmsList();                
            },
            pinduoduoSizeChange(val) {
                this.pinduoduoPageSize = val;
                this.getBillList();
            },
            pinduoduoCurrentChange(val) {
                this.pinduoduoPage = val;
                this.getBillList();                
            },
        }
    }
</script>
