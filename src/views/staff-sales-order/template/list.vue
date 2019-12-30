<style lang="less">
  .search .ivu-form-item {
    margin-bottom: 12px;
  }
</style>

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
      </Row>
      <Row>
        <Col v-if="orderType=='LY,JY'" span="6">
        <Form-item label="订单类型：">
          <Select style="width:162px" v-model="formSearch.orderType" placeholder="请选择">
            <Option value="LY,JY">查看全部</Option>
            <Option value="LY">样衣领用</Option>
            <Option value="JY">样衣借用</Option>
          </Select>
        </Form-item>
        </Col>
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
           <!-- <Button type="primary" icon="md-add" @click="addStaffSalesOrder">
        test
      </Button> -->
        </Form-item>
        </Col>
      </Row>
    </Form>
    <Row class-name="margin-bottom-10">
      <Col v-if="pageType=='list'" span="24" class="">
      <!-- <Button  v-if="btnList.add" type="primary" icon="md-add" @click="addStaffSalesOrder"> -->
         <Button  type="primary" icon="md-add" @click="addStaffSalesOrder">
        新增
      </Button>
      </Col>
    </Row>
    <!-- 表格 -->
    <Row class="margin-bottom-10">
      <Table size="small" :columns="columns" :data="list"></Table>
    </Row>
    <Row>
      <Page :total="total" :page-size="pageSize" :current="pageNumber" show-sizer show-total show-elevator
            @on-change="changePage" @on-page-size-change="changePageSize"></Page>
    </Row>
    <Modal v-model="visible" title="退款" @on-cancel='cancelReturn()' footer-hide :width="280" class-name="customize-modal-center">
        <Row class="margin-bottom-10 background-color-white exhibition">
                <div style="text-align:center;margin-bottom:40px">是否退款？</div>
                <div style="text-align:center">
                    <Button type="primary" @click="saveReturn()">确认</Button>
                    <Button @click="cancelReturn()">取消</Button>
                </div>
        </Row>
    </Modal>
  </div>
</template>

<script>
  import base from '../../../libs/base';
  import Util from '../../../libs/util';
  import {mapState} from 'vuex'

  export default {
    name: 'staffsalesorder_list_template',
    props: {
      orderType: String,
      pageType: String
    },
    data() {
      return {
        selRow:{},
        userInfo:'',
        columns: [
          {
            title: '序号',
            key: 'serialNo',
            align: 'center',
            width: 60
          },
          {
            title: '订单编号',
            key: 'orderId',
            align:'center',
            width: 200,
            render:(h,params) => {
              return h('a',{
              on: {
                 click: () => {
                      this.viewStaffSalesOrder(params.row.orderId);
                 }
              }
              },params.row.orderId);
            }
          },
          {
            title: '订单日期',
            key: 'payTime',
            align: 'center',
            width: 150
          },
          {
            title: '订单金额',
            key: 'totalMoney',
            align: 'center',
            width: 100
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
            title: '收货人',
            key: 'consigne',
            align: 'center',
            width: 80
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
            title: '审核人',
            key: 'checkUserName',
            align: 'center',
            width: 110
          },
          {
            title: '审核时间',
            key: 'checkTime',
            align: 'center',
            width: 150
          },
          {
            title: '审核意见',
            key: 'suggest',
            align: 'left',
            width: 150
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
            fixed: 'right',
            align: 'left',
            minWidth: 250,
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
                      this.viewStaffSalesOrder(params.row.orderId);
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
                    display: ((params.row.orderStatus == 200 || params.row.orderStatus == 200 || params.row.orderStatus == 250) && this.pageType == 'list') ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      this.cancel_order(params.row.orderId);
                    }
                  }
                }, '取消'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {

                    marginRight: '5px', //&& this.pageType == 'list'
                    display:(Number(params.row.orderStatus) >= 600  && params.row.isDelay == '0'&&Number(params.row.orderStatus) != 950) ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      this.$router.push({ name:'staffsalesorder_return',params:{ orderId:params.row.orderId }})
                    }
                  }
                }, '退货申请'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display:((Number(params.row.orderStatus) - 600) > 0 && this.pageType == 'list'&&Number(params.row.orderStatus) != 950) ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      this.$router.push({ name:'inReturn',query:{orderId:params.row.orderId}})
                    }
                  }
                }, '查看退货'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display:(Number(params.row.orderStatus) >= 300 && Number(params.row.orderStatus) < 600 && this.pageType == 'list') ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      this.getVisible(params.row) //退款确认
                    }
                  }
                }, '退款')
              ])
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
        requestApi: '',
        btnList:{
          add:false
        },
        visible:false,
      };
    },

    methods: {
      //退款按钮  
      getVisible(row){ //判断订单是否符合退款条件
        console.log(row,'9089')
        let data = {}
        data.order_id = row.orderId
        this.request('check_order_return', {data}, false).then((res) => {
                if (res.code == '2') {
                    this.visible = true
                    this.selRow = row
                }else{
                  this.$Message.error(res.msg)
                }
            })
      },
      //确认退款
      saveReturn(){ //
      let data = {}
      data.order_id = this.selRow.orderId
      data.last_update_user = this.userInfo.userName
      this.request('add_return_order_auto', {data}, false).then((res) => {
                if (res.code == '1') {
                    this.getData(this.formSearch)
                    this.$Message.success(res.msg)
                }else{
                  this.$Message.success(res.msg)
                }
                this.visible = false
            })
        console.log(this.selRow)
      },
      cancelReturn(){
        this.visible = false
        this.selRow = {}
      },
      //新增内购申请
      addStaffSalesOrder() {
        if (this.orderType == 'NG') {
          this.$router.push({name: 'staffsalesorder_add'});
        } else if (this.orderType == 'LY,JY') {
          this.$router.push({name: 'staffsamplecoat_add'});
        }
      },
      viewStaffSalesOrder(orderId) {
        let detailRouteName = '';
        if (this.orderType == 'NG') {
          detailRouteName = 'staffsalesorder_detail';
        } else if (this.orderType == 'LY,JY') {
          detailRouteName = 'staffsamplecoat_detail';
        }
        this.$router.push({
          name: detailRouteName,
          params: {
            orderId: orderId,
            pageType: this.pageType
          }
        });
      },
      getData(params) {
        let dataMap = {};
        dataMap.type = this.orderType.split(',');
        if (params.orderType) {
          dataMap.type = params.orderType.split(',');
        }
        if (params.consigne) {
          dataMap.consigne = params.consigne;
        }
        dataMap.length = this.pageSize;
        dataMap.start = (this.pageNumber - 1) * this.pageSize;
        dataMap.orderStatus = params.orderStatus;
        dataMap.orderId = params.orderId;
        if (params.startDate) {
          dataMap.start_date = Util.dateFormat(params.startDate, 'yyyy-MM-dd');
        }
        if (params.endDate) {
          dataMap.end_date = Util.dateFormat(params.endDate, 'yyyy-MM-dd');
        }
        if (this.pageType == 'list') {
          dataMap.userId = [JSON.parse(window.sessionStorage.getItem('userinfo')).userId];
        } else {
          dataMap.param = JSON.parse(window.sessionStorage.getItem('userinfo')).userId;
        }
        this.request(this.requestApi,
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
        //  this.$refs[name].resetFields();
      },
      //表单搜索
      search() {
        let search = this.formSearch;
        this.pageNumber = 1;
        this.getData(search);
      },

      cancel_order(orderId) {
        this.$Modal.confirm({
          title: '提示',
          content: '该订单将会取消，请确认！',
          onOk: () => {
            this.request('cancel_order', {
              data: {
                orderId: orderId,
                userAccount: JSON.parse(window.sessionStorage.getItem('userinfo')).userAccount
              }
            }, true).then(res => {
              if (res.code == 1) {
                this.$Message.success(res.msg);
                this.search();
              }
            })
          },
          onCancel: () => {
          }
        })
      }
    },
    computed: {
      ...mapState({
        orderStatusList: state => state.common.orderStatusList
      })
    },
    mounted() {
      this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
      this.$store.dispatch('get_order_status_list', {});
      if (this.orderType == 'NG') {
        this.requestApi = this.pageType == 'list' ? 'StaffSalesOrderList' : 'StaffSalesOrderListCheck';
      } else if (this.orderType == 'LY,JY') {
        this.requestApi = 'StaffSampleCoatList';
      }
      //  //审核页面 隐藏部分列
      // if(this.orderType=='NG'&&this.pageType=='list'){
      //   this.columns = this.columns.filter((item)=>{
      //           if('logisticsCompany,logisticsNo,checkUserName,checkTime,suggest'.indexOf(item.key)>=0){
      //                 return false
      //           }
      //           return true;
      //   })
      // }
    },
    activated() {
      this.getData(this.formSearch);
      this.btnList.add = false
      Util.getButtonPermission('staffsalesorder_list').then((res) => {
        for (let item of res.data.data) {
          if (item.code == 'add' && item.available == 1) {
            this.btnList.add = true
          }
        }
      })
    }
  };
</script>
