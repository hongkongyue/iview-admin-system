<style>
  #staffsalesorder_return_detail_template .print{
    cursor: pointer;
    font-size: 50px;
  }
  #staffsalesorder_return_detail_template .print:hover{
    cursor: pointer;
    font-size: 50px;
    color: #2d8cf0;
  }
</style>

<template>
  <div id="staffsalesorder_return_detail_template">
    <Modal v-model="visible" title="取消退货" @on-cancel='cancelReturn()' footer-hide :width="280" class-name="customize-modal-center">
        <Row class="margin-bottom-10 background-color-white exhibition">
                <div style="text-align:center;margin-bottom:40px">是否取消退货？</div>
                <div style="text-align:center">
                    <Button type="primary" @click="saveReturn()">确认</Button>
                    <Button @click="cancelReturn()">取消</Button>
                </div>
        </Row>
    </Modal>
    <Row class="margin-bottom-10 margin-top-10">
      <Col span="24" class="search">
        <Form :model="returnData" ref="returnData" :label-width="100" inline label-position="right">
          <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
            <i-col span="22">
              <span style="border:3px solid gray;margin-right:10px"></span>
              <b>
                退货信息：
              </b>
            </i-col>
          </Row>
          <Col span="22">
            <Row class-name="padding-top-10">
              <Col span="7">
              <Form-item label="退货单号：">
                <!-- {{returnData.logistics_company}} -->
                {{this.$route.query.row.return_code}}
              </Form-item>
              </Col>
              <Col span="7">
              <Form-item label="原始订单编号：">
                {{this.$route.query.row.source_return_code}}
                <!-- {{returnData.logistics_no}} -->
              </Form-item>
              </Col>
              <Col span="7">
              <Form-item label="单据状态：">
                {{returnOrderStatus(this.$route.query.row.order_status)}}
                <!-- {{Util.returnOrderStatus(this.$route.query.row.return_code)}} -->
                <!-- {{returnData.created}} -->
              </Form-item>
              </Col>
              <Col span="3">
                <Button v-if="this.$route.query.row.order_status < 600 && this.$route.query.row.order_status != 350" type="primary" @click="cancelReturnA">取消退货</Button>
              </Col>
              
            </Row>
            <Row class-name="padding-top-10">
              <Col span="7">
              <Form-item label="提交时间：">
                {{this.$route.query.row.created}}
                <!-- {{returnData.logistics_company}} -->
              </Form-item>
              </Col>
              <Col span="7">
              <Form-item label="物流公司：">
                {{this.$route.query.row.logistics_company}}
                <!-- {{returnData.logistics_no}} -->
              </Form-item>
              </Col>
              <Col span="7">
              <Form-item label="物流单号：">
                {{this.$route.query.row.logistics_no}}
                <!-- {{returnData.created}} -->
              </Form-item>
              </Col>
            </Row>
            <Row class-name="padding-top-10">
              <Col span="7">
              <Form-item label="单据审核人：">
                {{this.$route.query.row.order_check_name}}
                <!-- {{returnData.logistics_company}} -->
              </Form-item>
              </Col>
              <Col span="7">
              <Form-item label="单据审核时间：">
                {{this.$route.query.row.order_check_time}}
                <!-- {{returnData.logistics_no}} -->
              </Form-item>
              </Col>
              <Col span="7">
              <Form-item label="单据审核意见：">
                {{this.$route.query.row.order_check_msg}}
                <!-- {{returnData.created}} -->
              </Form-item>
              </Col>
            </Row>
            <Row class-name="padding-top-10">
              <Col span="7">
              <Form-item label="退款审核人：">
                {{this.$route.query.row.refund_check_name}}
                <!-- {{returnData.logistics_company}} -->
              </Form-item>
              </Col>
              <Col span="7">
              <Form-item label="退款审核时间：">
                {{this.$route.query.row.refund_check_time}}
                <!-- {{returnData.logistics_no}} -->
              </Form-item>
              </Col>
              <Col span="7">
              <Form-item label="退款审核意见：">
                {{this.$route.query.row.refund_check_msg}}
                <!-- {{returnData.created}} -->
              </Form-item>
              </Col>
            </Row>
            <Row class-name="padding-top-10" v-if="orderType == 'DX'">
              <Col span="8">
              <Form-item label="寄件人：">
                <!-- {{returnData.sender}} -->
              </Form-item>
              </Col>
              <Col span="8">
              <Form-item label="寄件人地址：">
                <!-- {{returnData.send_address}} -->
              </Form-item>
              </Col>
              <Col span="8">
              <Form-item label="寄件人电话：">
                <!-- {{returnData.send_tel}} -->
              </Form-item>
              </Col>
            </Row>
            <Row>

              <!--<Col span="8">-->
              <!--<Form-item label="退货完成时间：">-->
                <!--{{returnData.last_updated}}-->
              <!--</Form-item>-->
              <!--</Col>-->
               <!--<Col span="8">-->
              <!--<Form-item label="退款时间：">-->
                <!--　{{returnData.refund_time}}-->
              <!--</Form-item>-->
              <!--</Col>-->
            </Row>
          </Col>
          <Col span="3" v-if="false">
            <Icon type="md-print" class="print" @click.native="print"></Icon>
          </Col>
        </Form>
      </Col>
    </Row>
    <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
      <i-col span="22">
        <span style="border:3px solid gray;margin-right:10px"></span>
        退货商品：
      </i-col>
    </Row>
    <Row class-name="margin-bottom-10 padding-top-10">
      <Table :columns="NG_columns" size="small" :data="returnList" border></Table>
      <!-- <div v-if="this.orderType == 'NG'">
        <Table :columns="NG_columns" size="small" :data="returnData.return_order_list" border></Table>
      </div>
      <div v-else>
        <Table :columns="DX_columns" size="small" :data="returnData.return_order_list" border></Table>
      </div> -->
    </Row>
    <Row style="text-align: right;font-size: 18px">
      <!-- <b>退货总金额:{{ returnData.total_money }}元</b> -->
    </Row>
  </div>
</template>

<script>
  import Util from '../../../libs/util';
  import { mapState } from 'vuex'

  export default {
    name: "staffsalesorder_return_detail_template",
    props:['orderType','returnData'],
    data(){
      return {
        visible:false,
        userInfo:'',
        returnData:{},
        returnList:[],
        NG_columns: [
          {
            title: '序号',
            type: 'index',
            align: 'center',
            width: 65
          },
          {
            title: '品牌',
            key: 'brands',
            width: 140,
            align: 'center'
          },
          {
            title: '款号',
            key: 'section_no',
            width: 120,
            align: 'center'
          },
          {
            title: '规格名称',
            key: 'norms',
            width: 100,
            align: 'center'
          },
          {
            title: '商品条码',
            key: 'commodity_code',
            width: 120,
            align: 'center',
          },
          {
            title: '单价',
            key: 'price',
            width: 65,
            align: 'center',
          },
          // {
          //   title: '购买数量',
          //   key: 'borrow_count',
          //   width: 90,
          //   align: 'center',
          // },
          {
            title: '可退数量',
            key: 'unreturn_count',
            width: 90,
            align: 'center',
          },
          {
            title: '退货原因',
            key: 'return_reason',
            align: 'center',
            minWidth: 200
          },
          {
            title: '退货申请数量',
            key: 'item_counts',
            align: 'center',
            width:90,
          },
          {
            title: '说明',
            key: 'detail_remark',
            align: 'center',
            width:180
          },
        ],
      }
    },
    mounted(){ //this.$route.query.row.source_return_code
      this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
      this.returnOrderStatus()
      this.getData()
    },
    methods:{
      returnOrderStatus(value) {
  let orderStatus = '未知状态';
  switch (value) {
    case 200:
      orderStatus = '已审核';
      break;
    case 300:
      orderStatus = '审核通过';
      break;
    case 350:
      orderStatus = '申请失败';
      break;
    case 400:
      orderStatus = '退货中';
      break;
    case 600:
      orderStatus = '已退货';
      break;
    case 700:
      orderStatus = '待退款';
      break;
    case 750:
      orderStatus = '退款失败';
      break;
    case 800:
      orderStatus = '退款中';
      break;
    case 900:
      orderStatus = '已退款';
      break;
    case 950:
      orderStatus = '退款异常';
      break;
       case 999:
      orderStatus = '取消退货';
      break;
  }
  return orderStatus;
},
      getData(){
        let data = {}
        data.return_code = this.$route.query.row.return_code
        this.request('get_return_detail_list', {data}, false).then((res) => {
                if (res.code == '1') {
                  this.returnList = res.data
                    console.log('pppp')
                }
            })
      },
      //取消退货按钮
      cancelReturnA(){
        this.visible = true
      },
      //保存
      saveReturn(){
        let data = {}
            data.return_code = [this.$route.query.row.return_code]
            data.last_update_user = this.userInfo.userName
            this.request('cancel_return_order', {data}, false).then((res) => {
                if (res.code == '1') {
                    this.$Message.success(res.msg)
                    this.$root.eventHub.$emit('closePageFromOtherPage', 'inReturnDetail');//关闭新增页面
                    this.$router.push({name: 'inReturn'});//跳转至列表页面
                }else{
                    this.$Message.error(res.msg)
                }
            })
      },
      //取消
      cancelReturn(){
            this.visible = false
        },
    }
  }
</script>


