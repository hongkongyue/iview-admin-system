<style>
   
</style>
<template>

 <div class="background-color-white exhibition">

      <Card dis-hover >
      <Form class="detailForm" ref="factorySampleCoatDetail" :model="factorySampleCoat"  :label-width="88" inline label-position="right" >
         <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
              <i-col span="24">
                <span class="card-form-title">申请单信息</span>
              </i-col>
        </Row>
        <Row>
              <Col span="6">
                <Form-item label="订单状态：">
                {{factorySampleCoat.orderStatusShow}}
                </Form-item>
             </Col>
             <Col span="6">
                <Form-item label="订单编号：">
                {{factorySampleCoat.orderId}}
                </Form-item>
             </Col>
             <Col   span="6">
                 <Form-item label="工厂：">
                 {{factorySampleCoat.factoryName}}
                 </Form-item>
             </Col>
             <Col span="6">
                <Form-item label="用途：">
                 {{factorySampleCoat.use}}
                </Form-item>
             </Col>
         </Row>  
         <Row>
            <Col span="6">
                <Form-item label="收件人：">
                 {{factorySampleCoat.consigne}}
                </Form-item>
             </Col>
            <Col span="6">
                <Form-item label="收件电话：">
                 {{factorySampleCoat.phoneNo}}
                </Form-item>
             </Col>
            <Col span="6">
            <Form-item label="收件地址：">
                 {{factorySampleCoat.province+factorySampleCoat.city+factorySampleCoat.county+factorySampleCoat.address}}
            </Form-item>
            </Col>
             <Col span="6">
                <Form-item label="邮编：">
                 {{factorySampleCoat.zipCode}}
                </Form-item>
             </Col>
        </Row>
         <Row>
             <Col span="6">
                <Form-item label="物流公司：">
                {{factorySampleCoat.logisticsCompany}}
                </Form-item>
             </Col>
            <Col  span="6">
                <Form-item label="物流单号：">
                {{factorySampleCoat.logisticsNo}}
                </Form-item>
             </Col>
              <Col span="6">
                <Form-item label="备注：">
                 {{factorySampleCoat.remark}}
                </Form-item>
             </Col>
        </Row>
     
         <Row>
             <Col span="6">
                <Form-item label="订单时间：">
                {{factorySampleCoat.created}}
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
                 {{factorySampleCoat.totalMoney- factorySampleCoat.totalFreight}}
                </Form-item>
             </Col>
             <Col span="6">
                <Form-item label="运费：">
                {{factorySampleCoat.totalFreight}}
                </Form-item>
             </Col>
             <Col span="6">
                <Form-item label="订单总金额：">
                {{factorySampleCoat.totalMoney}}
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
             
 </div>
</template>
<script>
import Util from 'libs/util';
export default {
    name:"factorysamplecoat_Detail",
    data(){
        return {
            orderId: '',
            factorySampleCoat:{},
             list:[],
             expressTrackList:[],
             columns:[
                {
                    title: '序号',
                    type:'index',
                    align:'center',
                    width: 70
                },
                {
                 title: '品牌',
                 key: 'brands',
                align:'center',
                },
                {
                 title: '款号',
                 key: 'sectionNo',
                 align:'center',
                },
                {
                  title:'规格名称',
                  key:'norms',
                  align:'center',
                },
                {
                    title:'商品条码',
                    key:'commodityCode',
                    align:'center',
                },
                {
                    title:'单价',
                    key:'price',
                    align:'center',
                    minWidth:65
                },
                {
                    title:'数量',
                    key:'count',
                    align:'center',
                },
                {
                    title:'金额',
                    key:'sum',
                    align:'center',
               },
               {
                title:'发货仓库',
                key:'warehouseName',
                align:'center',
              },
            ],
        }
    },
    methods:{
        getFactorySampleCoatDetail(){
            this.request('FactorySampleCoatDetail',{
               ver:'1',
               ts:Date.parse( new Date()),
               data: {
                    "obj": {
                        "orderId": this.orderId,
                    },
                    "type": 1
               }
           },true).then((res)=>{
             this.factorySampleCoat = res.data.stafforder[0];
             this.factorySampleCoat.orderStatusShow = Util.formatOrderStatus(this.factorySampleCoat.orderStatus);
             this.list = this.factorySampleCoat.staffOrderDetailList;
             this.getTrackByExpressNo();
           })
        },
         getTrackByExpressNo(){
         let postid = this.factorySampleCoat.logisticsNo;
         if(!postid){
            return;
         }
         let type='baishiwuliu';
         if(this.factorySampleCoat.logisticsCompany==''){
            type='';
         }else if(this.factorySampleCoat.logisticsCompany=='EMS经济快递'||this.factorySampleCoat.logisticsCompany=='经济快递'){
            type='ems';
         }else if(this.factorySampleCoat.logisticsCompany=='顺丰速递'){
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
    mounted(){
       this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));
       this.orderId = this.$route.params.orderId;
       this.getFactorySampleCoatDetail();
    }
}
</script>

