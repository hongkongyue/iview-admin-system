<template>

    <div class="background-color-white exhibition">
        <Row class="margin-bottom-10">
            <Col span="24" class="search">
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Row>
                    <Form-item label="期间:" :label-width="70">
                        <DatePicker type="month" v-model="balanceMonth" placeholder="请选择下单时间" style="width: 200px"></DatePicker>
                    </Form-item>
                    <Form-item label="支付宝账号:">
                        <Select style="width:250px" v-model="alipay_account" placeholder="请选择" @on-change="changeShop">
                            <Option v-for="item in alipay_account_list" :value="item.alipay_account" :key="item.alipay_account">{{ item.alipay_account}}
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
            <Button type="primary" icon="arrow-up-a" @click="importData('pay')">
                导入账单
            </Button>
            <Button type="primary" icon="arrow-up-a" @click="importData('order')">
                同步EOP订单
            </Button>
            <Button type="primary" icon="arrow-up-a" @click="importData('return')">
                同步EOP退货单
            </Button>
            <Button type="primary" icon="checkmark-round" @click="autoCheckNeigouOrder" v-if="formSearch.platform_check_status == 0">
                自动核销
            </Button>
            <!-- <Button type="primary" icon="checkmark-round" @click="manualCheckPlatformOrderPay" v-if="formSearch.platform_check_status == 0">
                手动核销
            </Button> -->
            <Button type="primary" icon="arrow-down-a" @click="exportBalanceData()" v-if="formSearch.platform_check_status == 1">
                导出
            </Button>
            <Button type="primary" icon="arrow-down-a" @click="exportUnBalanceData()" v-if="formSearch.platform_check_status == 0">
              导出
            </Button>
            </Col>
        </Row>

        <Tabs @on-click="changeCheckStatus" value="nocheck">
            <TabPane label="核销匹配" name="nocheck"></TabPane>
            <TabPane label="核销查询" name="checked"></TabPane>
        </Tabs>

        <Row class="margin-bottom-10">
            <Alert>支付宝-账务明细</Alert>
            <Table ref="payList" size="small" :loading="payLoading" height="300" :columns="payColumns" :data="payList"></Table>
            <Page style="margin-top:5px;" :total="payTotal" :page-size="payPageSize" :current="payPage" show-sizer show-total show-elevator
                @on-change="payCurrentChange" @on-page-size-change="paySizeChange"></Page>
        </Row>
        <Row class="margin-bottom-10">
            <Alert>EOP-订单</Alert>
            <Table ref="orderList" size="small" :loading="loading" height="300" :columns="columns" :data="list"></Table>
            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="currentChange"
                @on-page-size-change="sizeChange"></Page>
        </Row>

        <!-- 导入弹窗 -->
        <Modal v-model="importModal" title="导入账单">
            <div>
                <Upload ref="upload" name="file" :show-upload-list="false" :before-upload="handleUpload" :on-success="uploadSuccess" :on-error="uploadError"
                    type="drag" action="/eop-node/api/finance/importNeigouData" :data="{account:userInfo.userAccount,userId:userInfo.userId,importType:importType,balanceMonth:this.balanceMonth,shopId:this.shop_id,alipayAccount:this.alipay_account}">
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或将文件拖拽到此处</p>
                    </div>
                </Upload>
                <div v-if="file !== null">{{ file.name }}
                    <Button type="text" :loading="loadingStatus">{{ loadingStatus ? '上传中...' : '' }}
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
             this.$root.eventHub.$emit('refreshNeigouRreshData', {
                 columnName: this.data.key,
                 searchData: this.searchData,
                 tableType: this.params.tableType
             })
             this.visible = false;
         }
     }
 })

 let columns = [{
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
         title: '内购单号',
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
         width: 100,
     },
     {
         title: '订单时间',
         key: 'created',
         align: 'center'
     },
     {
         title: '应付金额',
         key: 'total_money',
         align: 'center',
         minWidth: 80,
     },
     {
         title: '服务费',
         key: 'discount_fee',
         align: 'center',
         minWidth: 80,
     },
     {
         title: '订单总额',
         key: 'total_amount',
         align: 'center',
         sortable: true,
         minWidth: 80
     },
 ];

 let payColumns = [

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
         width: 160,
         renderHeader: (h, params) => {
             params.tableType = 'payList';
             return h(searchHeader, {
                 props: {
                     params: params
                 }
             })
         }
     },
     {
         title: '发生时间',
         key: 'fee_created',
         align: 'center',
         width: 150,
     },
     {
         title: '业务类型',
         key: 'order_type',
         align: 'center',
         width: 100,
     }, {
         title: '对方账号',
         key: 'buyer_account',
         align: 'left'
     },
     {
         title: '金额',
         key: 'total_money',
         align: 'center',
         width: 80
     },
     {
         title: '收支方向',
         key: 'pay_type',
         align: 'center',
         width: 100,
     },
     {
         title: '备注',
         key: 'alipay_remark',
         align: 'center',
         minWidth: 80,
     },

 ]

 export default {
     name: "balance_neigou",
     data() {
         return {
             shop_id: 54,
             userInfo: {},
             alipay_account: 'weizhuo1111@163.com',
             formSearch: {
                 platform_check_status: 0,
             },
             importModal: false,
             file: null,
             alipay_account_list: [{
                     alipay_account: 'weizhuo1111@163.com'
                 },
                 {
                     alipay_account: 'ngleke@126.com'
                 },
                 {
                     alipay_account: 'ngxiaolongxia@126.com'
                 }
             ],
             list: [],
             columns: columns,
             loading: false,
             total: 0,
             pageSize: 10,
             page: 1,
             payList: [],
             payColumns: payColumns,
             payTotal: 0,
             payPageSize: 10,
             payPage: 1,
             payLoading: false,
             payFormSearch: {
                 platform_check_status: 0
             },
         }
     },
     methods: {

         search() {
             this.getPayListData();
             this.getPlatformOrder();
         },

         changeCheckStatus(name) {
             this.formSearch = {};
             this.payFormSearch = {};
             let status = name == 'nocheck' ? 0 : 1
             this.formSearch.platform_check_status = status;
             this.payFormSearch.platform_check_status = status;
             this.getPlatformOrder();
             this.getPayListData();
         },

         importData(importType) {
             this.importType = importType;
             if (!this.balanceMonth) {
                 this.$Message.warning('请先选择期间');
             } else if (this.shop_id <= 0) {
                 this.$Message.warning('请先选择店铺');
             } else if (this.importType == 'order') {
                 this.importEopOrder();
             } else if (this.importType == 'return') {
                 this.importEopOrder();
             } else {
                 this.importModal = true;
             }
         },
         /**
          * 同步eop订单数据
          */
         importEopOrder() {　　　　　　
             this.request('finance_import_neigou_data', {
                 importType: this.importType,
                 balanceMonth: Util.dateFormat(this.balanceMonth, 'yyyy-MM-01 00:00:00'),
                 shopId: this.shop_id
             }, '正在同步EOP订单数据...').then((res) => {
                 if (res.status == 'success') {
                     this.search();
                     this.$Message.success(res.message);
                 } else {
                     this.$Message.error(res.message);
                 }
             })
         },
         cancel() {
             this.importModal = false;
             this.file = null;
         },
         importOrderSave() {
             if (this.file == null) {
                 this.$Message.warning('请先选择文件');
                 return;
             }
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

         paySizeChange(val) {
             this.payPageSize = val;
             this.getPayListData()
         },
         payCurrentChange(val) {
             this.payPage = val;
             this.getPayListData();
         },
         getPayListData() {
             let data = {};
             data = Util.deepClone(this.payFormSearch)
             data.pageNum = this.payPage;
             data.pageSize = this.payPageSize;
             this.payLoading = true;
             data.shop_id = this.shop_id
             data.platform = 'neigou';
             data.alipay_account = this.alipay_account;
             data.balanceMonth = Util.dateFormat(this.balanceMonth, 'yyyy-MM-01 00:00:00');
             this.request('finance_get_pay_list', data, false).then((res) => {
                 this.payLoading = false;
                 if (res.status == 'success') {
                     let serialNoBegain = this.payPageSize * (this.payPage - 1);
                     res.data.data.map((item) => {
                         serialNoBegain++;
                         item.serialNo = serialNoBegain;
                         let obj = JSON.parse(item.summary)
                         item.buyer_account = obj.buyer_account;
                         item.alipay_remark = obj.remark;
                     })
                     this.payList = res.data.data
                     this.payTotal = res.data.count
                 }
             })
         },

         sizeChange(val) {
             this.pageSize = val;
             this.getPlatformOrder()
         },
         currentChange(val) {
             this.page = val;
             this.getPlatformOrder();
         },
         getPlatformOrder() {
             let data = {};
             data = Util.deepClone(this.formSearch)
             data.pageNum = this.page;
             data.pageSize = this.pageSize;
             this.loading = true;
             data.platform = 'neigou';
             data.shop_id = this.shop_id;
             data.balanceMonth = Util.dateFormat(this.balanceMonth, 'yyyy-MM-01 00:00:00');
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

         autoCheckNeigouOrder() {
             this.request('finance_auto_check_neigou_order', {
                 shopId: this.shop_id,
                 balanceMonth: Util.dateFormat(this.balanceMonth, 'yyyy-MM-01 00:00:00'),
                 alipayAccount: this.alipay_account
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

         exportBalanceData() {
             if (!this.balanceMonth) {
                 this.$Message.warning('请先选择期间');
             } else if (!this.alipay_account) {
                 this.$Message.warning('请先选择支付宝账号');
             } else {
                 this.request('finance_export_neigou_balance_data', {
                     shopId: this.shop_id,
                     alipayAccount: this.alipay_account,
                     balanceMonth: Util.dateFormat(this.balanceMonth, 'yyyy-MM-01 00:00:00')
                 }, '正在导出账单...').then(res => {
                     if (res.status == 'success') {
                         this.$Message.success(res.message);
                         if (document.location.href.indexOf('localhost') > 0 || document.location.href.indexOf('127.0.0.1') > 0) {
                             window.open('http://127.0.0.1:8360' + res.data)
                         } else {
                             window.open(res.data)
                         }
                     } else {
                         this.$Message.error(res.message);
                     }
                 })
             }
         },

       /**
       * 导出未核销数据
       */
      exportUnBalanceData(){
        this.request('finance_export_unbalance_data',{
            shopId:this.shop_id,
            alipayAccount: this.alipay_account,
            platform:'neigou',
            balanceMonth:Util.dateFormat(this.balanceMonth,'yyyy-MM-01 00:00:00')
        },'正在导出数据...').then((res)=>{
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
     mounted() {
         let that = this;
         let nowDate = new Date();
         nowDate.setMonth(nowDate.getMonth() - 1)
         nowDate.setDate(1)
         this.balanceMonth = nowDate;
         this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));

         //处理查询
         this.$root.eventHub.$on('refreshNeigouRreshData', (data) => {
             if (data.tableType == 'orderList') {
                 that.formSearch[data.columnName] = data.searchData;
                 that.page = 1;
                 that.getPlatformOrder()
             } else if (data.tableType == 'payList') {
                 that.payFormSearch[data.columnName] = data.searchData;
                 that.payPage = 1;
                 that.getPayListData();
             }
         })
     }
 }
</script>
