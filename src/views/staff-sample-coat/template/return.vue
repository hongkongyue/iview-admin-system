<style>
  #staffsalesorder_return {

  }
</style>

<template>
  <div class="background-color-white " id="staffsalesorder_return">
    <Card dis-hover>
      <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
        <i-col span="24">
          <b>归还汇总信息：</b>
        </i-col>
      </Row>
      <Row>
        <Table size="small" :columns="collect_columns" :data="List.return_collect"></Table>
      </Row>
      <Row class-name="margin-top-10 margin-bottom-10 padding-bottom-10 divide-line">
        <Page :total="total" size="small" :page-size="pageSize" :current="page"  show-sizer show-total show-elevator @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
      </Row>
      <Row class-name="margin-top-40 margin-bottom-10 padding-bottom-10 divide-line">
        <i-col span="24">
          <b>归还入库：</b>
        </i-col>
      </Row>

      <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
        <Table size="small" :columns="order_columns" :data="List.return_order"></Table>
      </Row>
      <Row class-name="margin-top-40 padding-bottom-10 divide-line" v-if="this.tempList.orderStatus == 900">
        <i-col span="24">
          <b>关闭原因：</b>
        </i-col>
        <Form ref="closeOrderForm" v-model="tempList" :label-width="90" inline label-position="right">
          <Form-item label="赔付总数：" :label-width="72">
            <b>{{tempList.pay_count}}</b>
          </Form-item>
          <Form-item label="赔付总金额：">
            <b>{{tempList.pay_sum}}</b>
          </Form-item>
          <Form-item label="责任归属：">
            <b>{{tempList.duty_belong}}</b>
          </Form-item>
          <Form-item label="原因：">
            <b>{{tempList.lost_reason}}</b>
          </Form-item>
        </Form>
      </Row>
    </Card>
    <Modal v-model="modal_visible" :mask-closable="false" title="归还详细" :width="900" class-name="customize-modal-center">
      <Table height="300" size="small" :columns="order_detial_columns" :data="return_order_list"></Table>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "staffsalesorder_return",
    data() {
      return {
        List: {},
        tempList: {},
        collect_columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '品牌',
            key: 'brands',
            width: 120,
            align: 'center'
          },
          {
            title: '款号',
            key: 'section_no',
            width: 120,
            align: 'center'
          },
          {
            title: '规格',
            key: 'norms',
            align: 'center'
          },
          {
            title: '商品条码',
            key: 'commodity_code',
            width: 120,
            align: 'center'
          },
          {
            title: '单价',
            key: 'price',
            width: 60,
            align: 'center'
          },
          {
            title: '借用数量',
            key: 'borrow_count',
            width: 90,
            align: 'center'
          },
          {
            title: '归还数量',
            key: 'item_counts',
            width: 90,
            align: 'center',
          },
          {
            title: '入库数量',
            key: 'instock_count',
            width: 90,
            align: 'center'
          },
          {
            title: '未归还数',
            key: 'unreturn_count',
            width: 90,
            align: 'center'
          },
          {
            width: 90,
            title: '赔付金额',
            key: 'pay_price',
            align: 'center'
          }
        ],
        order_detial_columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '品牌',
            key: 'brands',
            width: 120,
            align: 'center'
          },
          {
            title: '款号',
            key: 'section_no',
            width: 120,
            align: 'center'
          },
          {
            title: '规格',
            key: 'norms',
            align: 'center',
            width: 120
          },
          {
            title: '商品条码',
            key: 'commodity_code',
            width: 120,
            align: 'center'
          },
          {
            title: '单价',
            key: 'price',
            width: 60,
            align: 'center'
          },
          {
            title: '借用数量',
            key: 'borrow_count',
            width: 90,
            align: 'center'
          },
          {
            title: '归还数量',
            key: 'item_counts',
            width: 90,
            align: 'center',
          },
          {
            title: '入库数量',
            key: 'instock_count',
            width: 90,
            align: 'center'
          },
          {
            title: '未归还数',
            key: 'unreturn_count',
            width: 90,
            align: 'center'
          }
        ],
        order_columns: [
          {
            type: 'index',
            minWidth: 60,
            align: 'center'
          },
          {
            title: '归还单号',
            key: 'return_code',
            minWidth: 100,
            align: 'center'
          },
          {
            title: '申请单号',
            key: 'source_return_code',
            minWidth: 120,
            align: 'center'
          },
          {
            title: '物流单号',
            key: 'logistics_no',
            minWidth: 120,
            align: 'center'
          },
          {
            title: '物流公司',
            key: 'logistics_company',
            minWidth: 120,
            align: 'center'
          },
          {
            title: '归还说明',
            key: 'suggest',
            minWidth: 120,
            align: 'center'
          },
          {
            title: '入库时间',
            key: 'created',
            minWidth: 120,
            align: 'center'
          },
          {
            title: '归还时间',
            key: 'created',
            minWidth: 120,
            align: 'center'
          },

          {
            title: '操作',
            key: 'operate',
            width: 160,
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
                      this.modal_visible = true;
                      this.return_order_list = this.List.return_order[params.index].return_order_list
                    }
                  }
                }, '查看'),
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
                      this.$router.push({name:'print',params:{orderId:this.List.return_order[params.index].return_code,orderType:'GH'}});
                    }
                  }
                }, '打印')
              ])
            }
          }
        ],
        return_order_list:[],
        pageSize:10,
        page:1,
        index:0,
        modal_visible:false,
        total:25
      }
    },
    mounted() {
      this.get_return_order_list();
      this.$root.eventHub.$on('routerPushStaffsamplecoat_detail',()=>{
        this.get_return_order_list();
      })
    },
    methods: {
      get_return_order_list() {
        this.request('get_return_order_list', {
          data: {
            source_order_code: this.$route.params.orderId
          }
        }, true).then(res => {
          if (res.code == 1) {
            this.List = res.data;
            this.tempList = JSON.parse(JSON.stringify(res.data));
            this.total = res.data.return_collect.length;
            let start = (this.page - 1)*this.pageSize;
            let end = start + this.pageSize;
            if(this.tempList.return_collect.length > 0){
              this.List.return_collect = this.tempList.return_collect.slice(start,end);
            }else{
              this.List.return_collect = [];
            }
          }
        })
      },
      CurrentChange(val){
        this.page = val;
        let start = (this.page - 1)*this.pageSize;
        let end = start + this.pageSize;
        if(!!this.tempList.return_collect && this.tempList.return_collect.length > 0){
          this.List.return_collect = this.tempList.return_collect.slice(start,end);
        }else{
          this.List.return_collect = [];
        }
      },
      SizeChange(val){
        this.pageSize = val;
        let start = (this.page - 1)*this.pageSize;
        let end = start + this.pageSize;
        if(!!this.tempList.return_collect && this.tempList.return_collect.length > 0){
          this.List.return_collect = this.tempList.return_collect.slice(start,end);
        }else{
          this.List.return_collect = [];
        }
      }
    }
  }
</script>

