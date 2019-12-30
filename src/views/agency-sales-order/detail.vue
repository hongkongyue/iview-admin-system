<style>

</style>
<template>
  <div class="background-color-white exhibition">
    <Tabs :value="activeTable">
      <TabPane label="申请信息" name="apply">
        <Card dis-hover>
          <Form class="detailForm" ref="agencySalesOrderDetail" :model="agencySalesOrder" :label-width="88" inline
                label-position="right">
            <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
              <i-col span="24">
                <span class="card-form-title">申请单信息</span>
              </i-col>
            </Row>
            <Row>
              <Col span="6">
              <Form-item label="订单状态：">
                {{agencySalesOrder.orderStatusShow}}
              </Form-item>
              </Col>
              <Col span="6">
              <Form-item label="订单编号：">
                {{agencySalesOrder.orderId}}
              </Form-item>
              </Col>
            </Row>
            <Row>
              <Col span="6">
              <Form-item label="收件人：">
                {{agencySalesOrder.consigne}}
              </Form-item>
              </Col>
              <Col span="6">
              <Form-item label="收件电话：">
                {{agencySalesOrder.phoneNo}}
              </Form-item>
              </Col>
              <Col>
              <Form-item label="收件地址：">
                {{agencySalesOrder.province+agencySalesOrder.city+agencySalesOrder.county+agencySalesOrder.address}}
              </Form-item>
              </Col>
            </Row>
            <Row>
              <Col span="6">
              <Form-item label="物流公司：">
                {{agencySalesOrder.logisticsCompany}}
              </Form-item>
              </Col>
              <Col span="6">
              <Form-item label="物流单号：">
                {{agencySalesOrder.logisticsNo}}
              </Form-item>
              </Col>
              <Col span="6">
              <Form-item label="留言：">
                {{agencySalesOrder.remark}}
              </Form-item>
              </Col>
            </Row>

            <Row>
              <Col span="6">
              <Form-item label="订单时间：">
                {{agencySalesOrder.created}}
              </Form-item>
              </Col>
            </Row>

            <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
              <i-col span="24">
                <span class="card-form-title">申请商品信息</span>
              </i-col>
            </Row>
            <Row class-name="margin-bottom-10">
              <Col span="24">
              <Table size="small" :columns="columns" :border="true" :data="list"></Table>
              </Col>
            </Row>
            <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
              <i-col span="24">
                <span class="card-form-title">付款信息</span>
              </i-col>
            </Row>
            <Row>
              <Col span="6">
              <Form-item label="商品总金额：">
                {{agencySalesOrder.totalMoney- agencySalesOrder.totalFreight}}
              </Form-item>
              </Col>
              <Col span="6">
              <Form-item label="运费：">
                {{agencySalesOrder.totalFreight}}
              </Form-item>
              </Col>
              <Col span="6">
              <Form-item label="订单总金额：">
                {{agencySalesOrder.totalMoney}}
              </Form-item>
              </Col>
            </Row>
          </Form>
             <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
        <i-col span="24">
          <span class="card-form-title">物流详情</span>
        </i-col>
      </Row>
      <Row class-name="margin-bottom-10">
        <Col span="24">
         <Timeline>
        <template v-if="expressTrackList.length>0" v-for="express in expressTrackList">
         <TimelineItem>
             {{express.time}}   {{express.context}}
         </TimelineItem>
          </template>
          <template v-if="expressTrackList.length<=0">
              <TimelineItem>
                暂无记录
              </TimelineItem>
          </template>
    　　</Timeline>
        </Col>
      </Row>
        </Card>
      </TabPane>
      <TabPane label="退货信息" name="return" v-if="len > 0">
        <staffsalesorder_return_detail_template order-type="DX"
                                                :returnData="returnData"></staffsalesorder_return_detail_template>
      </TabPane>
    </Tabs>

  </div>
</template>
<script>
  import Util from 'libs/util';
  import staffsalesorder_return_detail_template from '../staff-sales-order/template/return_detail'

  export default {
    name: "agencysalesorder_Detail",
    data() {
      return {
        orderId: '',
        agencySalesOrder: {},
        list: [],
        expressTrackList:[],
        columns: [
          {
            title: '序号',
            type: 'index',
            align: 'center',
            width: 70
          },
          {
            title: '品牌',
            key: 'brands',
            align: 'center',
          },
          {
            title: '款号',
            key: 'sectionNo',
            align: 'center',
          },
          {
            title: '规格名称',
            key: 'norms',
            align: 'center',
          },
          {
            title: '商品条码',
            key: 'commodityCode',
            align: 'center',
          },
          {
            title: '单价',
            key: 'price',
            align: 'center',
            minWidth: 65
          },
          {
            title: '数量',
            key: 'count',
            align: 'center',
          },
          {
            title: '金额',
            key: 'sum',
            align: 'center',
          },
          {
            title: '发货仓库',
            key: 'warehouseName',
            align: 'center',
          },
        ],
        activeTable:'apply',
        returnData:{},
        len:0
      }
    },
    methods: {
      getAgencySalesOrderDetail() {
        this.request('FactorySampleCoatDetail', {
          ver: '1',
          ts: Date.parse(new Date()),
          data: {
            "obj": {
              "orderId": this.orderId,
            },
            "type": 1
          }
        }, true).then((res) => {
          this.agencySalesOrder = res.data.stafforder[0];
          this.agencySalesOrder.orderStatusShow = Util.formatOrderStatus(this.agencySalesOrder.orderStatus);
          this.list = this.agencySalesOrder.staffOrderDetailList;
          this.getTrackByExpressNo();
        })
      },
      get_return_list() {
        this.request('get_return_list', {
          data: {
            source_return_code: this.$route.params.orderId
          }
        }, true).then(res => {
          if (res.code == 1) {
            res.data.refund_status='未退款';//退款状态
            if(res.data.refund_fee&&res.data.refund_fee==res.data.total_money){
                res.data.refund_status='退款成功';
            }else if(res.data.refund_fee){
                res.data.refund_status='部分退款';
            }
            this.returnData = res.data;
            this.len = res.data.return_order_list.length;
          }
        })
      },
      getTrackByExpressNo(){
         let postid = this.agencySalesOrder.logisticsNo;
         if(!postid){
            return;
         }
         let type='baishiwuliu';
         if(this.agencySalesOrder.logisticsCompany==''){
            type='';
         }else if(this.agencySalesOrder.logisticsCompany=='EMS经济快递'||this.agencySalesOrder.logisticsCompany=='经济快递'){
            type='ems';
         }else if(this.agencySalesOrder.logisticsCompany=='顺丰速递'){
            type='shunfeng'
         }
         this.request('get_express_track',{
           type:type,
           postid:postid
         },false).then((res)=>{
            if(res.status=='200'){
               this.expressTrackList = res.data;
            }
         })
       }
    },
    mounted() {
      this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
      this.orderId = this.$route.params.orderId;
      this.get_return_list();
      this.getAgencySalesOrderDetail();
    },
    components: {
      staffsalesorder_return_detail_template
    }
  }
</script>

