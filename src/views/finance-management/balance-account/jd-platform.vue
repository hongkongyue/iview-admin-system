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
          <Select style="width:250px" v-model="shopId" placeholder="请选择">
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
            <Button type="primary" icon="arrow-up-a" @click="importData('platform')">
                导入平台订单
            </Button>
            <Button type="primary" icon="arrow-up-a" @click="importData('service')">
                导入售后服务单
            </Button>
      <Button type="primary" icon="arrow-up-a" @click="importData('pay')">
        导入京东钱包
      </Button>
       <Button type="primary" icon="checkmark-round" @click="autoCheckPlatormOrderPay" v-if="formSearch.platform_check_status == 0">
        自动核销
      </Button>
        <Button type="primary" icon="checkmark-round" @click="manualCheckPlatformOrderPay" v-if="formSearch.platform_check_status == 0">
        手动核销
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
        <Alert>京东-钱包</Alert>
      <Table ref="payList" size="small" :loading="payLoading" height="300" :columns="payColumns" :data="payList"></Table>
       <Page style="margin-top:5px;" :total="payTotal" :page-size="payPageSize" :current="payPage" show-sizer show-total show-elevator
                  @on-change="payCurrentChange" @on-page-size-change="paySizeChange"></Page>
    </Row>
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
          action="/eop-node/api/finance/importData"
          :data="{account:userInfo.userAccount,userId:userInfo.userId,importType:importType,balanceMonth:balanceMonth,shopId:this.shopId}"
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
      width: 60
    },
    {
      title: '订单号',
      key: 'order_id',
      align: 'center',
      width: 200,
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
      title: '订单类型',
      key: 'order_type',
      align: 'center',
      width: 100,
    },
    {
      title: '商品编码',
      key: 'good_code',
      align: 'center',
      width: 150,
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
      title: '商品名称',
      key: 'good_name',
      align: 'left',
      minWidth: 200,
      ellipsis: true
    },
    {
      title: '费用项',
      key: 'fee_type',
      align: 'left',
      minWidth: 80,
    },
    {
      title: '金额',
      key: 'total_money',
      align: 'center',
      minWidth: 80,
      renderHeader: (h, params) => {
        params.tableType = 'payList';
        return h(Util.deepClone(searchHeader), {
          props: {
            params: params
          }
        })
      }
    },
    {
      title: '收支方向',
      key: 'pay_type',
      align: 'center',
      minWidth: 80,
    },
    {
      title: '账单日期',
      key: 'bill_created',
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
          platform_check_status: 0
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
        payList: [],
        payColumns: payColumns,
        payTotal: 0,
        payPageSize: 10,
        payPage: 1,
        payLoading: false,
        payFormSearch: {
          platform_check_status: 0
        },
        jd_shop_list: [],
        shopId: 0,
        checkRemark: '平台分摊优惠'
      };
    },
    methods: {
      getOmsJdShopList() {
        this.request('get_oms_jd_shop_list', {}, false).then((res) => {
          if (res.errno == '0') {
            this.jd_shop_list = res.data;
            this.shopId = res.data[0].shop_id
            this.search();
          }
        })
      },
      search() {
        this.getPlatformOrder()
        this.getPayListData()
      },
      handleReset() {

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
        data.platform = 'jd';
        data.shop_id = this.shopId
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
        data.shop_id = this.shopId
        data.platform = 'jd';
        data.balanceMonth = Util.dateFormat(this.balanceMonth, 'yyyy-MM-01 00:00:00');
        this.request('finance_get_pay_list', data, false).then((res) => {
          this.payLoading = false;
          if (res.status == 'success') {
            let serialNoBegain = this.payPageSize * (this.payPage - 1);
            res.data.data.map((item) => {
              serialNoBegain++;
              item.serialNo = serialNoBegain;
            })
            this.payList = res.data.data
            this.payTotal = res.data.count
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
          this.importModal = true;
        }
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
      autoCheckPlatormOrderPay() {
        this.request('finance_auto_check_platform_order_pay', {
          shopId: this.shopId
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
      //手动核销京东平台订单
      manualCheckPlatformOrderPay() {
        let orderUuids = [];
        let payUuids = [];
        let orderArray = [];
        let payArray = [];
        this.$refs['orderList'].getSelection().forEach((item) => {
          orderArray.push(item);
        })

        this.$refs['payList'].getSelection().forEach((item) => {
          payArray.push(item);
        })

        if (orderArray.length <= 0) {
          this.$Message.warning('请选择需要核销的平台订单记录');
          return;
        } else if (payArray.length == 0) {
          this.$Message.warning('请选择需要核销的钱包记录');
          return;
        }

        for (let item of orderArray) {
          let result = payArray.some((pay) => {
            if (item.order_id.toString().trim() == pay.order_id.toString().trim() && item.goods_id.toString().trim() == pay.good_code.toString().trim()) {
              if (item.order_type == '销售订单' && pay.order_type == '订单') {
                payUuids.push(pay.uuid)
                return true;
              } else if (item.order_type == pay.order_type) {
                payUuids.push(pay.uuid)
                return true;
              } else {
                return false;
              }

            }
          })

          if (result) {
            orderUuids.push(item.uuid)
          } else {
            this.$Message.warning(item.order_type + ':' + item.order_id + ',商品ID:' + item.goods_id + '没有钱包记录,请检查');
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
            this.request('finance_manual_check_platform_order_pay', {
              orderUuids: orderUuids.join(','),
              payUuids: payUuids.join(','),
              checkRemark: this.checkRemark,
              shopId: this.shopId
            }, '正在更新核销状态').then((res) => {　　　　　　　　　　　　　　　　　　
              this.$Message.success(res.message);
              this.search();
            })
          },
          onCancel: () => {

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
      this.getOmsJdShopList();
      this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
      //处理查询
      this.$root.eventHub.$on('refreshJdRreshData', (data) => {
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
