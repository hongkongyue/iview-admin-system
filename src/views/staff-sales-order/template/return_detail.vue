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
          <Col span="20">
            <Row class-name="padding-top-10">
              <Col span="8">
              <Form-item label="物流公司：">
                {{returnData.logistics_company}}
              </Form-item>
              </Col>
              <Col span="8">
              <Form-item label="退货物流单号：">
                {{returnData.logistics_no}}
              </Form-item>
              </Col>
              <Col span="8">
              <Form-item label="提交时间：">
                {{returnData.created}}
              </Form-item>
              </Col>
              <!--<Col span="6">-->
              <!--<Form-item label="退款状态：">-->
                <!--<span style="color:red">{{returnData.refund_status}}</span>-->
              <!--</Form-item>-->
              <!--</Col>-->
              <!--<Col span="6">-->
              <!--<Form-item label="退款总额：">-->
                <!--{{returnData.refund_fee}}-->
              <!--</Form-item>-->
              <!--</Col>-->
            </Row>
            <Row class-name="padding-top-10" v-if="orderType == 'DX'">
              <Col span="8">
              <Form-item label="寄件人：">
                {{returnData.sender}}
              </Form-item>
              </Col>
              <Col span="8">
              <Form-item label="寄件人地址：">
                {{returnData.send_address}}
              </Form-item>
              </Col>
              <Col span="8">
              <Form-item label="寄件人电话：">
                {{returnData.send_tel}}
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
      <div v-if="this.orderType == 'NG'">
        <Table :columns="NG_columns" size="small" :data="returnData.return_order_list" border></Table>
      </div>
      <div v-else>
        <Table :columns="DX_columns" size="small" :data="returnData.return_order_list" border></Table>
      </div>
    </Row>
    <Row style="text-align: right;font-size: 18px">
      <b>退货总金额:{{ returnData.total_money }}元</b>
    </Row>
  </div>
</template>

<script>
  import Util from 'libs/util'
  import { mapState } from 'vuex'

  export default {
    name: "staffsalesorder_return_detail_template",
    props:['orderType','returnData'],
    data(){
      return {
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
          {
            title: '购买数量',
            key: 'borrow_count',
            width: 90,
            align: 'center',
          },
          {
            title: '退货数量',
            key: 'item_counts',
            width: 90,
            align: 'center',
          },
          {
            title: '售后类型',
            key: 'order_type',
            width: 90,
            align: 'center',
            render: (h, params) => {
              let type='';
              if(params.row.order_type=='HH'){
                  type='换货';
              }else if(params.row.order_type=='TH'){
                  type='退货';
              }
              return h('Span',type)
            }
          },
          {
            title: '退货理由',
            key: 'detail_remark',
            align: 'center',
            minWidth: 200
          },
          {
            title: '退款金额',
            key: 'item_counts',
            align: 'center',
            width:90,
            render: (h, params) => {
              return h('Span',params.row.item_counts * params.row.price)
            }
          },
          {
            title: '退款支付宝账号',
            key: 'refundAccount',
            align: 'center',
            width:180
          },
        ],
        DX_columns: [
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
            width: 90,
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
          {
            title: '购买数量',
            key: 'borrow_count',
            width: 90,
            align: 'center',
          },
          {
            title: '退货数量',
            key: 'item_counts',
            width: 90,
            align: 'center',
          },
          {
            title: '售后类型',
            key: 'order_type',
            width: 90,
            align: 'center',
            render: (h, params) => {
              let type='';
              if(params.row.order_type=='HH'){
                type='换货';
              }else if(params.row.order_type=='TH'){
                type='退货';
              }
              return h('Span',type)
            }
          },
          {
            title: '退货理由',
            key: 'detail_remark',
            align: 'center',
            minWidth: 200
          },
          {
            title: '退款金额',
            key: 'item_counts',
            align: 'center',
            width:90,
            render: (h, params) => {
              return h('Span',params.row.item_counts * params.row.price)
            }
          }
        ],
      }
    },
    mounted(){

    },
    methods:{
      print(){
        switch (this.orderType){
          case 'NG':
            this.$router.push({name: 'staffsalesorder_return_report',params:{orderId:this.$route.params.orderId}});//跳转至列表页面
            break;
          case 'DX':
            this.$router.push({name: 'agencysalesorder_return_report',params:{orderId:this.$route.params.orderId}});//跳转至列表页面
            break;
          default:
            break;
        }
      }
    }
  }
</script>


