<template>
  <div class="background-color-white exhibition">
    <Form :model="formSearch" class="search" ref="formSearch" :label-width="80" inline label-position="right"
          @keydown.native.enter="search">
      <Row>
        <Col span="6">
        <Form-item label="订单编号：">
          <Input v-model="formSearch.orderId" placeholder="订单编号"></Input>
        </Form-item>
        </Col>
        <Col span="6">
        <Form-item label="收货人：">
          <Input v-model="formSearch.consigne" placeholder="收货人姓名"></Input>
        </Form-item>
        </Col>
        <Col span="6">
        <Form-item label="订单状态：">
          <Select style="width:162px" v-model="formSearch.orderStatus" placeholder="请选择">
            <Option v-for="item in orderStatusList" :value="item.statusCode" :key="item.statusCode">{{ item.statusName
              }}
            </Option>
          </Select>
        </Form-item>
        </Col>
        <Col span="6">
        <Form-item label="原始单号：">
          <Input v-model="formSearch.sourceOrderCode" placeholder="原始单号"></Input>
        </Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <Form-item label="订单日期：">
          <DatePicker type="date" v-model="formSearch.startDate" placeholder="选择开始日期" style="width: 200px"></DatePicker>
          <DatePicker type="date" v-model="formSearch.endDate" placeholder="选择结束日期" style="width: 200px"></DatePicker>
        </Form-item>
        </Col>
        <Col span="6">
        <Form-item :label-width="1">
          <Button type="primary" @click="search('formSearch')" icon="ios-search">搜索</Button>
          <Button type="default" @click="handleReset('formSearch')">重置</Button>
        </Form-item>
        </Col>
      </Row>
    </Form>
    <Row class-name="margin-bottom-10">
      <Col span="24" class="">
      <Button type="primary" icon="md-add" @click="addAgencySalesOrder">
        新增
      </Button>
      <Button type="primary" icon="arrow-down-a" @click="downTemplate()">
        下载模板
      </Button>
      <Button type="primary" icon="arrow-up-a" @click="importAgencySalesOrder">
        批量导入
      </Button>
      <Button type="primary" icon="checkmark-round" @click="submitAgencySalesOrder">
        提交
      </Button>
      </Col>
    </Row>
    <!-- 表格 -->
    <Row class="margin-bottom-10">
      <Table ref="orderList" size="small" :columns="columns" :data="list"></Table>
    </Row>
    <Row>
      <Page :total="total" :page-size="pageSize" :current="pageNumber" show-sizer show-total show-elevator
            @on-change="changePage" @on-page-size-change="changePageSize"></Page>
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
          action="/eop/eom/spl/importExcelOrder"
          :data="{account:userInfo.userAccount,userId:userInfo.userId,importType:'DX'}"
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
        <Button type="primary" @click="importAgencySalesOrderSave">导入</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import base from 'libs/base';
  import Util from 'libs/util';
  import {mapState} from 'vuex'

  export default {
    name: "agencysalesorder_list",
    data() {
      return {
        userInfo: {},
        columns: [
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
            title: '申请人',
            key: 'name',
            align: 'center',
            width: 120
          },
          {
            title: '订单编号',
            key: 'orderId',
            align: 'center',
            width: 150,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.viewAgencySalesOrder(params.row.orderId);
                  }
                }
              }, params.row.orderId);
            }
          },
          {
            title: '原始单号',
            key: 'sourceOrderCode',
            align: 'center',
            width: 120
          },
          {
            title: '订单日期',
            key: 'payTime',
            align: 'center',
            width: 150
          },
          {
            title: '订单状态',
            key: 'orderStatus',
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h('span', {}, Util.formatOrderStatus(params.row.orderStatus));
            }
          },
          {
            title: '物流公司',
            key: 'logisticsCompany',
            align: 'center',
            width: 180
          },
          {
            title: '物流单号',
            key: 'logisticsNo',
            align: 'center',
            width: 150
          },
          {
            title: '收货人',
            key: 'consigne',
            align: 'center',
            width: 100
          },
          {
            title: '备注',
            key: 'remark',
            align: 'center',
            minWidth: 150
          },
          {
            title: '操作',
            key: 'operation',
            width: 150,
            fixed: 'right',
            align: 'center',
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
                      this.viewAgencySalesOrder(params.row.orderId);
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display:params.row.orderStatus == 600 ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      this.$router.push({ name:'agencysalesorder_return',params:{ orderId:params.row.orderId }})
                    }
                  }
                }, '退货')
              ]);
            }
          }
        ],
        //列表数据
        list: [],
        //总共数据多少条
        total: 25,
        //每页多少条数据
        pageSize: 10,
        //当前页码
        pageNumber: 1,
        //搜索表单
        formSearch: {
          orderId: ''
        },
        importModal: false,
        file: null,
        loadingStatus: false
      }
    },
    methods: {
      addAgencySalesOrder() {
        this.$router.push({name: 'agencysalesorder_add'});
      },
      viewAgencySalesOrder(orderId) {

        this.$router.push({
          name: 'agencysalesorder_detail',
          params: {
            orderId: orderId
          }
        });
      },
      getData(params) {
        let dataMap = {};
        dataMap.type = ['DX'], //普通样衣类型
        dataMap.length = this.pageSize;
        dataMap.start = (this.pageNumber - 1) * this.pageSize;
        dataMap.orderStatus = params.orderStatus;
        dataMap.orderId = params.orderId;
        dataMap.userId = [this.userInfo.userId];
        if (params.consigne) {
          dataMap.consigne = params.consigne;
        }
        if(params.sourceOrderCode){
          dataMap.sourceOrderCode = params.sourceOrderCode;
        }
        if (!!params.startDate) {
          dataMap.start_date = Util.dateFormat(params.startDate, 'yyyy-MM-dd');
        }
        if (!!params.endDate) {
          dataMap.end_date = Util.dateFormat(params.endDate, 'yyyy-MM-dd');
        }

        this.request('FactorySampleCoatList',
          {
            ver: '1',
            ts: Date.parse(new Date()),
            data: {map: dataMap}
          }, true).then((res) => {
          //处理序号显示
          let serialNoBegain = this.pageSize * (this.pageNumber - 1);
          res.data.data.forEach((item) => {
            serialNoBegain++;
            item.serialNo = serialNoBegain;
          })
          this.list = res.data.data;
          //总页数
          this.total = res.data.total;
        });
      },
      //分页切换页码
      changePage(page) {
        this.pageNumber = page;
        let search = this.formSearch;
        let pageSize = this.pageSize;
        //获取最新数据
        this.getData(search);
      },
      //分页切换每页记录数
      changePageSize(pageSize) {
        this.pageSize = pageSize;
        let search = this.formSearch;
        let query = Object.assign({page: this.pageNumber, pageSize}, search);
        //获取最新数据
        this.getData({params: search});
      },
      //重置表单数据
      handleReset(name) {
        this.formSearch = {};
        this.search();
      },
      //表单搜索
      search() {
        let search = this.formSearch;
        this.pageNumber = 1;
        this.getData(search);
      },
      downTemplate() {
        window.location = ('/excel/订单批量导入模板.xlsx')
      },
      //批量导入弹窗
      importAgencySalesOrder() {
        this.file = null;
        this.$refs.upload.clearFiles();
        this.importModal = true;
      },
      cancel() {
        this.importModal = false;
      },
      importAgencySalesOrderSave() {
        this.loadingStatus = true;
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
        if (res.code == 1) {
          this.loadingStatus = false;
          this.$Message.success(res.msg);
          this.importModal = false;
          this.search();
        } else {
          this.loadingStatus = false;
          let msg = '';
          if (res.data) {
            msg = res.data.split('；').join('<br>');
          }
          this.$Message.error({
            content: res.msg + '<br>' + msg,
            duration: 3
          });
        }
      },
      uploadError(res, file) {
        this.$Message.error(res.msg + res.data);
      },
      submitAgencySalesOrder() {

        let orderIds = [];
        this.$refs['orderList'].getSelection().forEach((item) => {
          orderIds.push(item.orderId);
        })

        if (orderIds.length <= 0) {
          this.$Message.warning('请选择需要提交的记录');
          return;
        }

        this.request('OrderConfirm', {
          data: {
            orderId: orderIds.join(',')
          }
        }, '正在提交...').then((res) => {
          if (res.code == '1') {
            this.$Message.success(res.msg);
            this.search();
          }
        })
      }
    },
    created() {
    },
    computed: {
      ...mapState({
        orderStatusList: state => state.common.orderStatusList
      })
    },
    mounted() {
      this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
      this.$store.dispatch('get_order_status_list', {});
    },
    activated() {
      this.getData(this.formSearch);
    }
  }
</script>
