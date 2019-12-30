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
           <Select style="width:250px" v-model="shopId" placeholder="请选择" @on-change="changeShop">
            <Option v-for="item in jd_shop_list" :value="item.shop_id" :key="item.shop_id">{{ item.shop_name}}
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
       <Button type="primary" icon="checkmark-round" @click="autoCheckJdOms" v-if="formSearch.jd_oms_check_status == 0">
        自动核销
      </Button>
        <Button type="primary" icon="checkmark-round" @click="manualCheckOmsOrder" v-if="formSearch.jd_oms_check_status == 0">
        手动核销
      </Button>
      <Button type="primary" icon="arrow-down-a" @click="exportBalanceData()" v-if="formSearch.jd_oms_check_status == 1">
        导出
      </Button>
       <Button type="primary" icon="arrow-down-a" @click="exportUnBalanceData()" v-if="formSearch.jd_oms_check_status == 0">
        导出
      </Button>
      </Col>
    </Row>
     <Tabs @on-click="changeCheckStatus" value="nocheck">
        <TabPane label="核销匹配" name="nocheck"></TabPane>
        <TabPane label="核销查询" name="checked"></TabPane>
    </Tabs>
     <Row class="margin-bottom-10">
        <Alert>京东-平台订单</Alert>
      <Table ref="orderList" size="small" :loading="loading" height="300" :columns="columns" :data="list"></Table>
      <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator
                  @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
        </Row>
        <Row class="margin-bottom-10">
            <Alert>OMS-系统订单</Alert>
            <Table ref="omsList" size="small" :loading="omsLoading" height="300" :columns="omsColumns"
                   :data="omsList"></Table>
            <Page style="margin-top:5px;" :total="omsTotal" :page-size="omsPageSize" :current="omsPage" show-sizer
                  show-total show-elevator
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
            width: 80
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
            width: 100,
        },
        {
            title: '商品ID',
            key: 'goods_id',
            align: 'center',
            width: 120,
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
            width: 80,
        },
        {
            title: '商家SKUID',
            key: 'sku_id',
            align: 'center',
            width: 120
        },
        {
            title: '数量',
            key: 'num',
            align: 'center',
            width: 60
        },
        {
            title: '结算金额',
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
        },
        {
            title: '下单时间',
            key: 'created',
            align: 'center',
            sortable: true,
            minWidth: 200
        },
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
            width: 200,
        },
        {
            title: '原始单号',
            key: 'source_code',
            align: 'center',
            minWidth: 80,
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
            title: '订单类型',
            key: 'order_type',
            align: 'center',
            width: 100,
        },
        {
            title: '商家编码',
            key: 'sku_id',
            align: 'center',
            width: 150,
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
            title: '货品编号',
            key: 'goods_no',
            align: 'left',
            minWidth: 150,
        },
        {
            title: '成交价',
            key: 'total_money',
            align: 'center',
            minWidth: 80,
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
            title: '订单时间',
            key: 'created',
            align: 'center',
            minWidth: 120,
        },
    ]

    export default {
        name: "balance_jd_platform",
        data() {
            return {
                userInfo: {},
                importModal: false,
                importType: '',
                file: null,
                list: [],
                formSearch: {
                    jd_oms_check_status: 0,
                    platform_check_status: 1
                },
                columns: columns,
                loading: false,
                //总共数据多少条
                total: 0,
                //每页多少条数据
                pageSize: 10,
                //当前页码
                page: 1,
                //钱包
                omsList: [],
                omsColumns: omsColumns,
                omsTotal: 0,
                omsPageSize: 10,
                omsPage: 1,
                omsLoading: false,
                omsFormSearch: {
                    jd_oms_check_status: 0
                },
                jd_shop_list: [],
                shopId: 0,
                shopName:'',
                checkRemark: '平台分摊优惠'
      };
    },
    methods:{
      changeShop(shopId){
        this.jd_shop_list.some((shop)=>{
           if(shop.shop_id==shopId){
             this.shopName = shop.shop_name;
             return true;
           }
        })
      },
      getOmsJdShopList(){
        this.request('get_oms_jd_shop_list',{},false).then((res)=>{
           if(res.errno=='0'){
             this.jd_shop_list = res.data;
             this.shopId = res.data[0].shop_id
             this.shopName = res.data[0].shop_name
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
      changeCheckStatus(name) {
                this.formSearch = {
                    platform_check_status: 1
                };
                this.omsFormSearch = {};
                let status = name == 'nocheck' ? 0 : 1
                this.formSearch.jd_oms_check_status = status;
                this.omsFormSearch.jd_oms_check_status = status;
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
          data.platform='jd';
          data.shop_id = this.shopId;
          data.balanceMonth = Util.dateFormat(this.balanceMonth,'yyyy-MM-01 00:00:00');
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
          data.platform='jd_oms';
          data.shop_id = this.shopId;
          this.omsLoading = true;
          data.balanceMonth = Util.dateFormat(this.balanceMonth,'yyyy-MM-01 00:00:00');
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
　　　　　　this.request('finance_import_data',{
             importType:this.importType,
             balanceMonth :Util.dateFormat(this.balanceMonth,'yyyy-MM-01 00:00:00'),
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
      autoCheckJdOms(){
        this.request('finance_auto_check_jd_oms_order',{
          shopId:this.shopId
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
      exportBalanceData(){
        if(!this.balanceMonth){
          this.$Message.warning('请先选择期间');
        }else if(this.shopId<=0){
          this.$Message.warning('请先选择店铺');
        }else{
         this.request('finance_exportBalance_data',{
           shopId:this.shopId,
           shopName:this.shopName,
           balanceMonth:Util.dateFormat(this.balanceMonth,'yyyy-MM-01 00:00:00')
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
      /**
       * 手动核销京东平台订单和oms订单
       */
      manualCheckOmsOrder(){

        let orderUuids = [];
        let omsUuids = [];
        let orderArray = [];
        let omsArray = [];
        this.$refs['orderList'].getSelection().forEach((item) => {
          orderArray.push(item);
        })

        this.$refs['omsList'].getSelection().forEach((item) => {
          omsArray.push(item);
        })

        if (orderArray.length <= 0) {
          this.$Message.warning('请选择需要核销的平台订单记录');
          return;
        } else if (omsArray.length == 0) {
          this.$Message.warning('请选择需要核销的Oms订单记录');
          return;
        }

        for (let item of orderArray) {
          let result = omsArray.some((oms) => {
            if (item.order_id.toString().trim() == oms.source_code && item.sku_id.toString().trim() == oms.sku_id) {
              omsUuids.push(oms.uuid)
              return true;
            }
          })

          if (result) {
            orderUuids.push(item.uuid)
          } else {
            this.$Message.warning('订单号:' + item.order_id + ',商品编码:' + item.sku_id + '没有Oms订单记录,请检查');
            return;
          }
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
            this.request('finance_manual_check_jd_oms_order', {
              orderUuids: orderUuids.join(','),
              omsUuids: omsUuids.join(','),
              checkRemark: this.checkRemark,
              shopId:this.shopId
            }, '正在更新核销状态').then((res) => {　　　　　　　　　　　　　　　　　　
              this.$Message.success(res.message);
              this.search();
            })
          },
          onCancel: () => {

          }
        })
      },
      /**
       * 导出未核销数据
       */
      exportUnBalanceData(){

        this.request('finance_export_unbalance_data',{
            shopId:this.shopId,
            shopName:this.shopName,
            platform:'jd',
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
            this.getOmsJdShopList();
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            let nowDate = new Date();
            nowDate.setMonth(nowDate.getMonth() - 1)
            this.balanceMonth = nowDate;
            //处理查询
            this.$root.eventHub.$on('refreshJdRreshData', (data) => {
                if (data.tableType == 'orderList') {
                    that.page=1;
                    that.formSearch[data.columnName] = data.searchData;
                    that.getPlatformOrder()
                } else if (data.tableType == 'omsList') {
                    that.omsPage =1;
                    that.omsFormSearch[data.columnName] = data.searchData;
                    that.getOmsListData();
                }
            })
        }
    }
</script>
