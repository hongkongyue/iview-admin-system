<template>
    <div class="background-color-white exhibition">
        <Row class="margin-bottom-10">
            <Col span="24" class="search">
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Row>
                    <Form-item label="期间:" :label-width="70">
                        <DatePicker type="month" v-model="balanceMonth" placeholder="请选择下单时间"
                                    style="width: 200px"></DatePicker>
                    </Form-item>
                    <Form-item label="店铺:">
                        <Select style="width:250px" v-model="shopId" placeholder="请选择">
                            <Option v-for="item in shop_list" :value="item.shop_id" :key="item.shop_id">{{
                                item.shop_name}}
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
            <Button type="primary" icon="arrow-up-a" @click="importData('platform')">
                导入
            </Button>
            <Button type="primary" icon="arrow-up-a" @click="importData('oms')">
                同步OMS订单
            </Button>
            <Button type="primary" icon="checkmark-round" @click="autoCheckXiaohongshuOms">
                自动核销
            </Button>
            <Button type="primary" icon="checkmark-round" @click="manualCheckXiaohongshuOms">
                核销
            </Button>
            <Button type="primary" icon="arrow-down-a" @click="importXiaohongshu">
                导出
            </Button>
            </Col>
        </Row>
        <Tabs @on-click="changeCheckStatus" value="nocheck">
            <TabPane label="核销匹配" name="nocheck"></TabPane>
            <TabPane label="核销查询" name="checked"></TabPane>
            <TabPane label="财务信息" name="payinfo"></TabPane>
        </Tabs>
        <div v-if="tabActive != 'payinfo'">
            <Row class="margin-bottom-10">
                <Alert>小红书-平台订单</Alert>
                <Table ref="orderList" size="small" :loading="loading" height="300" :columns="columns" :data="list"
                       @on-selection-change="selectedOrderList"></Table>
                <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total
                      show-elevator
                      @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
            </Row>
            <Row class="margin-bottom-10">
                <Alert>OMS-系统订单</Alert>
                <Table ref="omsList" size="small" :loading="omsLoading" height="300" :columns="omsColumns"
                       :data="omsList"
                       @on-selection-change="selectedOmsList"></Table>
                <Page style="margin-top:5px;" :total="omsTotal" :page-size="omsPageSize" :current="omsPage" show-sizer
                      show-total show-elevator
                      @on-change="omsCurrentChange" @on-page-size-change="omsSizeChange"></Page>
            </Row>
        </div>
        <div v-if="tabActive == 'payinfo' && !!financeData.summary">
            <Row class="margin-bottom-10 margin-top-10">
                <Col span="24" class="search">
                <Form :model="financeData" ref="financeData" :label-width="100" inline label-position="right">
                    <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
                        <b>
                            <Col span="6">
                            <FormItem label="店铺名称:">
                                {{ financeData.summary['店铺名称'] }}
                            </FormItem>
                            </Col>
                            <Col span="6">
                            <FormItem label="卖家 Id:">
                                {{ financeData.summary['卖家 Id'] }}
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem label="公司名称:">
                                {{ financeData.summary['公司名称'] }}
                            </FormItem>
                            </Col>
                            <Col span="4">
                            <FormItem label="结算期间:">
                                {{ financeData.summary['结算期间'] }}
                            </FormItem>
                            </Col>
                        </b>
                    </Row>
                    <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
                        <i-col span="22">
                            <span style="border:3px solid gray;margin-right:10px"></span>
                            <b>
                                商家结算：
                            </b>
                        </i-col>
                    </Row>
                    <Row class-name="padding-top-10">
                        <Col span="6">
                        <FormItem label="商品销售:">
                            {{ financeData.summary['商品销售'] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="订单运费:">
                            {{ financeData.summary['订单运费'] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="商品退货:">
                            {{ financeData.summary['商品退货'] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="人工退款:">
                            {{ financeData.summary['人工退款'] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="提货费:">
                            {{ financeData.summary['提货费'] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="物流费:">
                            {{ financeData.summary['物流费'] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="包材费:">
                            {{ financeData.summary['包材费'] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="人工调账:">
                            {{ financeData.summary['人工调账'] }}
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <b>
                            <FormItem label="总收入:">
                                {{ financeData.summary['总收入'] }}
                            </FormItem>
                        </b>
                    </Row>
                    <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
                        <i-col span="22">
                            <span style="border:3px solid gray;margin-right:10px"></span>
                            <b>
                                RED佣金：
                            </b>
                        </i-col>
                    </Row>
                    <Row class-name="padding-top-10">
                        <Col span="6">
                        <FormItem label="销售佣金:">
                            {{ financeData.summary['销售佣金'] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退货佣金:">
                            {{ financeData.summary['退货佣金'] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="人工退款佣金:">
                            {{ financeData.summary['人工退款佣金'] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="人工调账佣金:">
                            {{ financeData.summary['人工调账佣金'] }}
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <b>
                            <FormItem label="佣金汇总:">
                                {{ financeData.summary['佣金汇总'] }}
                            </FormItem>
                        </b>
                    </Row>
                </Form>
                </Col>
            </Row>
        </div>
        <!-- 导入弹窗 -->
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
                        action="/eop-node/api/finance/importXiaohongshuData"
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
    import Vue from 'vue';
    import Util from 'libs/util';

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
                this.$root.eventHub.$emit('refreshxiaohongshuRreshData', {
                    columnName: this.data.key,
                    searchData: this.searchData,
                    tableType: this.params.tableType
                })
                this.visible = false;
            }
        }
    })

    export default {
        name: "xiaohongshu-oms",
        data() {
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
                    title: '订单类型',
                    key: 'order_type',
                    align: 'center',
                    width: 120,
                },
                {
                    title: '用户下单时间',
                    key: 'created',
                    align: 'center',
                    width: 150,
                },
                {
                    title: '条形码',
                    key: 'goods_no',
                    align: 'center',
                    width: 140,
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
                    title: '商品数量',
                    key: 'num',
                    align: 'center',
                    width: 100
                },
                {
                    title: '小红书优惠总额',
                    key: 'discount_fee',
                    align: 'center',
                    width: 150
                },
                {
                    title: '计税价格（含税）',
                    key: 'total_money',
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
                }
            ];
            let omsColumns = [
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
                        params.tableType = 'omsList';
                        return h(searchHeader, {
                            props: {
                                params: params
                            }
                        })
                    }
                },
                {
                    title: '商家编码',
                    key: 'sku_id',
                    align: 'center',
                    width: 150
                },
                {
                    title: '货品名称',
                    key: 'goods_name',
                    align: 'center',
                    minWidth: 150,
                },
                {
                    title: '下单数量',
                    key: 'num',
                    align: 'center',
                    minWidth: 100,
                },
                {
                    title: '已付金额',
                    key: 'total_money',
                    align: 'center',
                    minWidth: 90,
                    renderHeader: (h, params) => {
                        params.tableType = 'omsList';
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
                    minWidth: 150,
                },
            ];
            return {
                userInfo: {},
                importModal: false,
                shop_list: [],
                omsList: [],
                list: [],
                file: null,
                balanceMonth: '',
                shopId: '',
                importType: '',
                formSearch: {},
                omsFormSearch: {},
                columns: columns,
                loading: false,
                //总共数据多少条
                total: 0,
                //每页多少条数据
                pageSize: 10,
                //当前页码
                page: 1,
                omsColumns: omsColumns,
                omsTotal: 0,
                omsPageSize: 10,
                omsPage: 1,
                omsLoading: false,
                tabActive: 'nocheck',
                omsListSelected: [],
                orderListSelected: [],
                financeData: {}
            };
        },
        methods: {
            search() {
                this.getPlatformOrder()
                this.getOmsListData()
                this.getXiaohongshuFinance()
            },
            //获取平台列表数据
            getPlatformOrder() {
                let data = {};
                data = Util.deepClone(this.formSearch);
                data.pageNum = this.page;
                data.pageSize = this.pageSize;
                this.loading = true;
                data.platform = 'xiaohongshu';
                data.shop_id = this.shopId;
                data.balanceMonth = Util.dateFormat(this.balanceMonth, 'yyyy-MM-dd');
                this.request('finance_get_order_list', data, false).then((res) => {
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
            //获取OMS列表数据
            getOmsListData() {
                let data = {};
                data = Util.deepClone(this.omsFormSearch)
                data.pageNum = this.omsPage;
                data.pageSize = this.omsPageSize;
                data.platform = 'xiaohongshu_oms';
                data.shop_id = this.shopId;
                data.balanceMonth = Util.dateFormat(this.balanceMonth, 'yyyy-MM-dd');
                this.omsLoading = true;
                this.request('finance_get_order_list', data, false).then((res) => {
                    this.omsLoading = false;
                    if (res.status == 'success') {
                        let serialNoBegain = this.omsPageSize * (this.omsPage - 1);
                        res.data.data.map((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.omsList = res.data.data
                        this.omsTotal = res.data.count
                    }
                })
            },
            getXiaohongshuShopList() {
                this.request('get_oms_shop_list', {
                    platformName: 'xiaohongshu'
                }, false).then((res) => {
                    if (res.errno == '0') {
                        this.shop_list = res.data;
                        this.shopId = res.data[0].shop_id;
                        this.shopName = res.data[0].shop_name;
                        this.search();
                    }
                })
            },
            importData(importType) {
                this.importType = importType;
                if (!this.balanceMonth) {
                    this.$Message.warning('请先选择期间');
                } else if (this.shopId <= 0) {
                    this.$Message.warning('请先选择店铺');
                } else {
                    if (importType == 'platform') {
                        this.importModal = true;
                    } else {
                        this.importOmsOrder();
                    }
                }
            },
            /**
             * 同步oms订单数据
             */
            importOmsOrder() {
                let data = Util.deepClone(this.formSearch)
                data.balanceMonth = Util.dateFormat(this.balanceMonth, 'yyyy-MM-dd');
                this.request('importXiaohongshuData', {
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
            //自动核销
            autoCheckXiaohongshuOms() {
                this.request('autoCheckXiaohongshuOms', {
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
            manualCheckXiaohongshuOms() {
                let omsListSelected = [];
                let orderListSelected = [];
                let orderIds = [];
                this.omsListSelected.map(x => {
                    omsListSelected.push(x.uuid);
                    orderIds.push(x.source_code);
                })
                this.orderListSelected.map(x => {
                    orderListSelected.push(x.uuid);
                    orderIds.push(x.order_id);
                })
                this.request('manualCheckXiaohongshuOms', {
                    shopId: this.shopId,
                    platform: 'xiaohongshu',
                    balanceMonth: Util.dateFormat(this.balanceMonth, 'yyyy-MM-dd'),
                    omsListSelected: omsListSelected,
                    orderListSelected: orderListSelected,
                    orderIds: orderIds
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
            importXiaohongshu() {
                if(!this.balanceMonth){
                    this.$Message.warning('请先选择期间');
                }else if(this.shopId<=0){
                    this.$Message.warning('请先选择店铺');
                }else{
                    this.request('importXiaohongshu',{
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
            },
            selectedOmsList(val) {
                this.omsListSelected = val;
            },
            selectedOrderList(val) {
                this.orderListSelected = val;
            },
            cancel() {
                this.importModal = false;
                this.file = null;
            },
            importOrderSave() {
                this.loadingStatus = true;
                Vue.prototype.$loading('正在导入数据...');
                this.$refs.upload.post(this.file);
            },
            changeCheckStatus(name) {
                this.tabActive = name;
                this.omsFormSearch = {};
                let status = name == 'nocheck' ? 0 : 1
                this.formSearch.jd_oms_check_status = status;
                this.formSearch.platform_check_status = status;
                this.omsFormSearch.platform_check_status = status;
                this.omsFormSearch.jd_oms_check_status = status;
                if (name == 'payinfo') {
                    this.getXiaohongshuFinance();
                } else {
                    this.getPlatformOrder();
                    this.getOmsListData();
                }
            },
            getXiaohongshuFinance() {
                this.financeData = [];
                this.request('getXiaohongshuFinance', {
                    shopId: this.shopId,
                    platform: 'xiaohongshu',
                    balanceMonth: Util.dateFormat(this.balanceMonth, 'yyyy-MM-dd'),
                }).then(res => {
                    if (res.status == 'success') {
                        if (res.data.length > 0) {
                            this.financeData = res.data[0];
                            this.financeData.summary = JSON.parse(res.data[0].summary);
                            this.financeData.summary['结算期间'] = Util.dateFormat(this.financeData.summary['结算期间'], 'yyyy-MM')
                        }
                    }
                })
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
            currentChange(val) {
                this.page = val;
                this.getPlatformOrder();
            },
            sizeChange(val) {
                this.pageSize = val;
                this.getPlatformOrder()
            },
            omsSizeChange(val) {
                this.omsPageSize = val;
                this.getOmsListData()
            },
            omsCurrentChange(val) {
                this.omsPage = val;
                this.getOmsListData();
            },
        },
        mounted() {
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            this.getXiaohongshuShopList();
            let nowDate = new Date();
            nowDate.setMonth(nowDate.getMonth() - 1)
            nowDate.setDate(1)
            this.balanceMonth = nowDate;
            let that = this;
            this.formSearch.jd_oms_check_status = 0;
            this.formSearch.platform_check_status = 0;
            this.omsFormSearch.platform_check_status = 0;
            this.omsFormSearch.jd_oms_check_status = 0;
            //处理查询
            this.$root.eventHub.$on('refreshxiaohongshuRreshData', (data) => {
                if (data.tableType == 'orderList') {
                    that.formSearch[data.columnName] = data.searchData;
                    that.getPlatformOrder()
                } else if (data.tableType == 'omsList') {
                    that.omsFormSearch[data.columnName] = data.searchData;
                    that.getOmsListData();
                }
            })
        }
    }
</script>