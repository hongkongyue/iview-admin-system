<style>
</style>
<template>
    <div  class="background-color-white exhibition">
        <Row class="margin-bottom-10">
            <Col span="24" class="search">
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Row>
                    <Form-item label="期间:" :label-width="70">
                        <DatePicker type="month" v-model="balanceMonth"
                                    placeholder="请选择下单时间" style="width: 200px"></DatePicker>
                    </Form-item>
                    <Form-item label="店铺:">
                        <Select style="width:250px" v-model="shopId" placeholder="请选择"  @on-change="changeShop">
                            <Option v-for="item in sm_shop_list" :value="item.shop_id" :key="item.shop_id">{{ item.shop_name}}
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
            <Button type="primary" icon="arrow-up-a" @click="importData('oms')">
                同步OMS订单
            </Button>
            <Button type="primary" icon="checkmark-round" @click="autoCheckOms" v-if="formSearch.jd_oms_check_status == 0">
                自动核销
            </Button>
            <Button type="primary" icon="checkmark-round" @click="manualCheckOms" v-if="formSearch.jd_oms_check_status == 0">
                核销
            </Button>
            <Button type="primary" icon="arrow-down-a" @click="exportBalanceData()" v-if="formSearch.jd_oms_check_status == 1">
                导出
            </Button>
            </Col>
        </Row>
        <Tabs @on-click="changeCheckStatus" value="nocheck">
            <TabPane label="核销匹配" name="nocheck"></TabPane>
            <TabPane label="核销查询" name="checked"></TabPane>
        </Tabs>
        <Row class="margin-bottom-10">
            <Alert>分期乐-平台订单</Alert>
            <Table ref="orderList" size="small" :loading="loading" height="300" :columns="columns" :data="list" @on-selection-change="selectedOrderList"></Table>
            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator
                  @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
        </Row>
        <Row class="margin-bottom-10">
            <Alert>OMS-系统订单</Alert>
            <Table ref="omsList" size="small" :loading="omsLoading" height="300" :columns="omsColumns" :data="omsList" @on-selection-change="selectedOmsList"></Table>
            <Page style="margin-top:5px;" :total="omsTotal" :page-size="omsPageSize" :current="omsPage" show-sizer show-total show-elevator
                  @on-change="omsCurrentChange" @on-page-size-change="omsSizeChange"></Page>
        </Row>
    </div>
</template>

<script>
    import Util from 'libs/util'
    let searchHeader = Vue.extend({
        props: ['params'],
        data() {
            return {
                placeholder:'',
                searchData:'',
                visible:false,
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
        mounted(){
            this.data = this.params.column;
            this.placeholder='请输入'+this.data.title+'后回车查询';
        },
        methods:{
            openSerach(){
                this.visible = true;
            },
            search(){
                this.$root.eventHub.$emit('refreshJdRreshData',{
                    columnName:this.data.key,
                    searchData:this.searchData,
                    tableType:this.params.tableType
                })
                this.visible = false;
            }
        }
    })
    let columns = [
        {
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
            title: '序号',
            key: 'serialNo',
            align: 'center',
            width: 60
        },
        {
            title: '订单号',
            key: 'order_id',
            align: 'center',
            width: 200,
            renderHeader: (h, params) => {
                params.tableType = 'orderList';
                return h(searchHeader, {
                    props: {
                        params: params
                    }
                })
            }
        },
        {
            title: '货号',
            key: 'goods_no',
            align: 'center',
            width: 120,
        },
        {
            title: '规格',
            key: 'spec_name',
            align: 'center',
            width: 150,
        },
        {
            title: '物流（快递）单号',
            key: 'Logistics_no',
            align: 'center',
            width: 140,
        },
        {
            title: '订购数量',
            key: 'num',
            align: 'center',
            width: 100
        },
        {
            title: '订单金额',
            key: 'total_amount',
            align: 'center',
            minWidth: 100,
            renderHeader: (h, params) => {
                params.tableType = 'orderList';
                return h(Util.deepClone(searchHeader), {
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
            sortable: true,
            minWidth: 200
        },
    ];

    let omsColumns=[
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
            title: '订单号',
            key: 'order_id',
            align: 'center',
            minWidth: 150,
        },
        {
            title: '原始单号',
            key: 'source_code',
            align: 'center',
            minWidth: 200,
            renderHeader: (h, params) => {
                params.tableType='omsList';
                return h(searchHeader,{
                    props: {
                        params: params
                    }
                })
            }
        },
        {
            title: '规格名称',
            key: 'spec_name',
            align: 'center',
            minWidth: 150,
        },
        {
            title: '商家编码',
            key: 'sku_id',
            align: 'center',
            width: 150,
            renderHeader: (h, params) => {
                params.tableType='omsList';
                return h(searchHeader,{
                    props: {
                        params: params
                    }
                })
            }
        },
        {
            title: '货品编号',
            key: 'goods_no',
            align: 'center',
            minWidth: 150,
        },
        {
            title: '数量',
            key: 'num',
            align: 'center',
            minWidth: 100,
        },
        {
            title: '成交价',
            key: 'total_money',
            align: 'center',
            minWidth: 90,
            renderHeader: (h, params) => {
                params.tableType='omsList';
                return h(Util.deepClone(searchHeader),{
                    props: {
                        params: params
                    }
                })
            }
        },
        {
            title: '订单时间',
            key: 'created',
            align: 'center',
            minWidth:150,
        },
    ]

    export default {
        name: "balance_sm_oms",
        data() {
            return {
                userInfo: {},
                importModal: false,
                importType:'',
                file:null,
                list: [],
                formSearch:{
                    jd_oms_check_status:0,
                    platform_check_status:1
                },
                columns:columns,
                loading:false,
                //总共数据多少条
                total: 0,
                //每页多少条数据
                pageSize: 10,
                //当前页码
                page: 1,
                //钱包
                omsList:[],
                omsColumns:omsColumns,
                omsTotal:0,
                omsPageSize:10,
                omsPage:1,
                omsLoading:false,
                omsFormSearch:{
                    jd_oms_check_status:0
                },
                sm_shop_list:[],
                shopId:0,
                omsListSelected:[],
                orderListSelected:[],
                shopName:'',
                checkRemark:''
            };
        },
        methods:{
            changeShop(shopId){
                this.sm_shop_list.some((shop)=>{
                    if(shop.shop_id==shopId){
                        this.shopName = shop.shop_name;
                        return true;
                    }
                })
            },
            getOmsSmShopList(){
                this.request('get_oms_stagmusic_shop_list',{},false).then((res)=>{
                    if(res.errno=='0'){
                        this.sm_shop_list = res.data;
                        this.shopId = res.data[0].shop_id;
                        this.shopName = res.data[0].shop_name;
                        this.search()
                    }
                })
            },
            search(){
                this.getPlatformOrder()
                this.getOmsListData();
            },
            handleReset(){

            },
            changeCheckStatus(name){
                this.formSearch={
                    platform_check_status:1
                };
                this.omsFormSearch={};
                let status = name =='nocheck'? 0:1
                this.formSearch.jd_oms_check_status=status;
                this.omsFormSearch.jd_oms_check_status=status;
                this.getPlatformOrder();
                this.getOmsListData();
            },
            sizeChange(val) {
                this.pageSize = val;
                this.getPlatformOrder()
            },
            currentChange(val) {
                this.page = val;
                this.getPlatformOrder();
            },
            getPlatformOrder(){
                let data={};
                data = Util.deepClone(this.formSearch)
                data.pageNum = this.page;
                data.pageSize = this.pageSize;
                this.loading = true;
                data.platform='stagmusic';
                data.shop_id = this.shopId;
                this.request('finance_get_order_list',data,false).then((res)=>{
                    this.loading = false;
                    if(res.status=='success'){
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.data.map((item)=>{
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.list = res.data.data
                        this.total = res.data.count
                    }
                })
            },
            omsSizeChange(val) {
                this.omsPageSize = val;
                this.getOmsListData()
            },
            omsCurrentChange(val) {
                this.omsPage = val;
                this.getOmsListData();
            },
            getOmsListData(){
                let data={};
                data = Util.deepClone(this.omsFormSearch)
                data.pageNum = this.omsPage;
                data.pageSize = this.omsPageSize;
                data.platform='stagmusic_oms';
                data.shop_id = this.shopId;
                this.omsLoading = true;
                this.request('finance_get_order_list',data,false).then((res)=>{
                    this.omsLoading = false;
                    if(res.status=='success'){
                        let serialNoBegain = this.omsPageSize * (this.omsPage - 1);
                        res.data.data.map((item)=>{
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.omsList = res.data.data
                        this.omsTotal = res.data.count
                    }
                })
            },
            importData(importType){
                this.importType = importType;
                if(!this.balanceMonth){
                    this.$Message.warning('请先选择期间');
                }else if(this.shopId<=0){
                    this.$Message.warning('请先选择店铺');
                }else if(importType=='oms'){
                    this.importOmsOrder();
                }
                else{
                    this.importModal = true;
                }
            },
            /**
             * 同步oms订单数据
             */
            importOmsOrder(){
                let data = Util.deepClone(this.formSearch)
                data.balanceMonth = Util.dateFormat(this.balanceMonth, 'yyyy-MM-dd');
                this.request('finance_stagmusic_import_data',{
                    importType:this.importType,
                    balanceMonth:Util.dateFormat(this.balanceMonth, 'yyyy-MM-dd'),
                    shopId:this.shopId
                },'正在同步OMS订单数据...').then((res)=>{
                    if(res.status=='success'){
                        this.search();
                        this.$Message.success(res.message);
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            },
            autoCheckOms(){
                this.request('finance_auto_check_stagmusic_oms_order',{
                    shopId:this.shopId,
                    balanceMonth:Util.dateFormat(this.balanceMonth, 'yyyy-MM-dd')
                },'正在核销').then((res)=>{

                    if(res.status=='success'){
                        this.$Message.success(res.message);
                        this.search();
                    }else{
                        this.$Message.error({
                            content: res.message,
                            duration: 3
                        });
                    }
                })
            },
            selectedOmsList(val){
                this.omsListSelected = val;
            },
            selectedOrderList(val){
                this.orderListSelected = val;
            },
            manualCheckOms(){
                let omsListSelected = [];
                let orderListSelected = [];
                let orderIds = [];
                this.omsListSelected.map(x=>{
                    omsListSelected.push(x.uuid);
                    orderIds.push(x.source_code);
                })
                this.orderListSelected.map(x=>{
                    orderListSelected.push(x.uuid);
                    orderIds.push(x.order_id)
                })

                if (this.orderListSelected.length <= 0) {
                    this.$Message.warning('请选择需要核销的平台订单记录');
                    return;
                } else if (this.omsListSelected.length == 0) {
                    this.$Message.warning('请选择需要核销的Oms订单记录');
                    return;
                }

                this.$Modal.confirm({
                    title: '核销提示',
                    render: (h) => {
                        return h('div', {
                            style: {
                                'margin-top': '10px'
                            }
                        }, [h('span', '备注：'),
                            h('Input', {
                                props: {
                                    value: this.checkRemark,
                                    autofocus: true,
                                    placeholder: '请输入备注内容'
                                },
                                style: {
                                    'margin-top': '5px'
                                },
                                on: {
                                    input: (val) => {
                                        this.checkRemark = val;
                                    }
                                }
                            })
                        ])
                    },
                    onOk: () => {
                        //调用api更新核销状态
                        this.request('finance_check_platform_order_oms', {
                            shopId: this.shopId,
                            platform: 'stagmusic',
                            balanceMonth: Util.dateFormat(this.balanceMonth, 'yyyy-MM-dd'),
                            omsListSelected:omsListSelected,
                            orderListSelected:orderListSelected,
                            orderIds:orderIds,
                            checkRemark:this.checkRemark
                        }, '正在核销').then((res) => {
                            if (res.status == 'success') {
                                this.$Message.success(res.message);
                                this.search();
                                this.omsListSelected = [];
                                this.orderListSelected = [];
                                this.checkRemark = '';
                            } else {
                                this.$Message.error({
                                    content: res.message,
                                    duration: 3
                                });
                            }
                        })
                    },
                    onCancel: () => {

                    }
                })
            },
            exportBalanceData(){
                if(!this.balanceMonth){
                    this.$Message.warning('请先选择期间');
                }else if(this.shopId<=0){
                    this.$Message.warning('请先选择店铺');
                }else{
                    this.request('finance_export_stagmusic_data',{
                        shopId:this.shopId,
                        shopName:this.shopName,
                        balanceMonth:Util.dateFormat(this.balanceMonth,'yyyy-MM-dd')
                    }).then(res=>{
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
        },
        mounted(){
            let that = this;
            this.getOmsSmShopList();
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            let nowDate=new Date();
            nowDate.setMonth(nowDate.getMonth()-1)
            nowDate.setDate(1)
            this.balanceMonth= nowDate;
            //处理查询
            this.$root.eventHub.$on('refreshJdRreshData',(data)=>{
                if(data.tableType=='orderList'){
                    that.formSearch[data.columnName] = data.searchData;
                    that.getPlatformOrder()
                }else if(data.tableType=='omsList'){
                    that.omsFormSearch[data.columnName] = data.searchData;
                    that.getOmsListData();
                }
            })
        }
    }
</script>