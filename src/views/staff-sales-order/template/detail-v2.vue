<style>
  #staffSalesOrderDetail .ivu-form-item{
      margin-bottom: 10px;
  }
  #staffSalesOrderDetail .print{
    cursor: pointer;
    font-size: 20px;
  }
  #staffSalesOrderDetail .print:hover{
    cursor: pointer;
    font-size: 20px;
    color: #2d8cf0;
  }
</style>
<template>
  <div class="background-color-white" id="staffSalesOrderDetail">
    <Card dis-hover >
      <Form ref="staffSalesOrderDetail" :model="staffSalesOrder"  :label-width="88" inline label-position="right" >
        <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
          <i-col span="22">
            当前状态：<span style="color:#ed3f14" class="card-form-title">{{staffSalesOrder.orderStatusShow}}</span>
          </i-col>
        </Row>
        <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
          <i-col span="24">
            <span class="card-form-title">单据信息</span>
          </i-col>
        </Row>
        <Row>
          <Col span="6">
          <Form-item label="订单编号：">
            {{staffSalesOrder.orderId}}
          </Form-item>
          </Col>
          <Col v-if="pageType=='list'" span="6">
          <Form-item label="物流公司：">
            {{staffSalesOrder.logisticsCompany}}
          </Form-item>
          </Col>
          <Col v-if="pageType=='list'" span="6">
          <Form-item label="物流单号：">
            {{staffSalesOrder.logisticsNo}}
          </Form-item>
          </Col>
          <Col v-if="pageType=='check'" span="6">
          <Form-item label="申请人：">
            {{staffSalesOrder.name}}
          </Form-item>
          </Col>
          <Col v-if="pageType=='check'"  span="6">
          <Form-item label="部门：">
            {{staffSalesOrder.department}}
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="备注：">
            {{staffSalesOrder.remark}}
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <Form-item label="收件信息：">
            {{staffSalesOrder.consigne}}    {{staffSalesOrder.phoneNo}}     {{staffSalesOrder.province+staffSalesOrder.city+staffSalesOrder.county+staffSalesOrder.address}}
          </Form-item>
          </Col>
          <Col v-if="pageType=='check'" span="6">
          <Form-item label="物流公司：">
            {{staffSalesOrder.logisticsCompany}}
          </Form-item>
          </Col>
          <Col v-if="pageType=='check'" span="6">
          <Form-item label="物流单号：">
            {{staffSalesOrder.logisticsNo}}
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="6">
          <Form-item label="订单时间：">
            {{staffSalesOrder.created}}
          </Form-item>
          </Col>
          <Col  span="6">
          <Form-item label="发货时间：">
            {{staffSalesOrder.checkTime}}
          </Form-item>
          </Col>
        </Row>
      </Form>
      <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
        <i-col span="24">
          <span class="card-form-title">商品信息</span>
        </i-col>
      </Row>
      <Row class-name="margin-bottom-10">
        <Col span="24">
        <Table size="small" :columns="columns" :border="true" :data="list"></Table>
        </Col>
      </Row>
      <!-- 在线支付 -->
      <template v-if="payScreenshot.length<=0">
        <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
          <i-col span="24">
            <span class="card-form-title">付款信息</span>
          </i-col>
        </Row>
        <Row>
          <Col span="16">
          <Form  :label-width="80" inline label-position="right">
            <Form-item label="商品总额：">
              <Icon color="red" size="20"  type="social-yen"></Icon>
              <span style="color:red;font-size:20px;">{{(staffSalesOrder.totalMoney-staffSalesOrder.totalFreight).toFixed(2)}}</span>
            </Form-item>
            <Form-item label="运费：">
              <Icon color="red" size="20"  type="social-yen"></Icon>
              <span style="color:red;font-size:20px;">{{(staffSalesOrder.totalFreight).toFixed(2)}}</span>
            </Form-item>
            <Form-item label="服务费：">
              <Icon color="red" size="20"  type="social-yen"></Icon>
              <span style="color:red;font-size:20px;">{{(staffSalesOrder.alipayTax).toFixed(2)}}</span>
            </Form-item>
            <Form-item label="订单总额：">
              <Icon color="red" size="20"  type="social-yen"></Icon>
              <span style="color:red;font-size:20px;">{{(staffSalesOrder.totalMoney + staffSalesOrder.alipayTax).toFixed(2)}}</span>
            </Form-item>
          </Form>
          </Col>
        </Row>
        <Row class-name="margin-bottom-10" :gutter="2">
          <Col span="16">
          <div class="ivu-table-wrapper" style="width: 750px;">
            <div class="ivu-table ivu-table-border">
              <div class="ivu-table-header">
                <table cellspacing="0" cellpadding="0" border="0"  >
                  <colgroup>
                    <col width="180">
                    <col width="100">
                    <col width="70">
                    <col width="120">
                    <col width="100">
                    <col width="100">
                    <col width="100">
                  </colgroup>
                  <thead>
                  <tr>
                    <th class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span class="">付款账号</span>
                      </div>
                    </th>
                    <th class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span class="">应付金额</span>
                      </div>
                    </th>
                    <th class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span class="">运费</span>
                      </div>
                    </th>
                    <th class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span class="">支付宝手续费</span>
                      </div>
                    </th>
                    <th class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span class="">应付总额</span>
                      </div>
                    </th>
                    <th class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span class="">状态</span>
                      </div>
                    </th>
                    <th class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span class="">操作</span>
                      </div>
                    </th>
                  </tr>
                  </thead>
                </table>
              </div>
              <div class="ivu-table-body" style="">
                <table cellspacing="0" cellpadding="0" border="0">
                  <colgroup>
                    <col width="180">
                    <col width="100">
                    <col width="70">
                    <col width="120">
                    <col width="100">
                    <col width="100">
                    <col width="100">
                  </colgroup>
                  <tbody class="ivu-table-tbody">
                  <tr v-for="(item,index) in payList" class="ivu-table-row">
                    <td class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span>{{item.payuser}}</span>
                      </div>
                    </td>
                    <td class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span>{{item.sum}}</span>
                      </div>
                    </td>
                    <td v-if="index==0" :rowspan="payList.length" class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span>{{staffSalesOrder.totalFreight}}</span>
                      </div>
                    </td>
                      <td class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span>{{item.tax}}</span>
                      </div>
                    </td>
                    <td class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span>{{item.total ? item.total.toFixed(2) : ''}}</span>
                      </div>
                    </td>
                    <td class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span　style="color:orange">{{item.payStatus}}</span>
                      </div>
                    </td>
                    <td class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                          <Button type="primary" size="small" :disabled="pageType=='check'||!item.canPay" @click="pay(item)" style="margin-left: 8px">支付</Button>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          </Col>
        </Row>
      </template>

       <!--上传图片验证审核 -->
       <template  v-if="payScreenshot.length>0" >
        <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
          <i-col span="24">
            <span class="card-form-title">付款信息</span>
          </i-col>
        </Row>
        <Row>
          <Col span="10">
          <Form  :label-width="80" inline label-position="right">
            <Form-item label="商品总额：">
              <Icon color="red" size="20"  type="social-yen"></Icon>
              <span style="color:red;font-size:20px;">{{staffSalesOrder.totalMoney-staffSalesOrder.totalFreight}}</span>
            </Form-item>
            <Form-item label="运费：">
              <Icon color="red" size="20"  type="social-yen"></Icon>
              <span style="color:red;font-size:20px;">{{staffSalesOrder.totalFreight}}</span>
            </Form-item>
            <Form-item label="订单总额：">
              <Icon color="red" size="20"  type="social-yen"></Icon>
              <span style="color:red;font-size:20px;">{{staffSalesOrder.totalMoney.toFixed(2)}}</span>
            </Form-item>
          </Form>
          </Col>
          <Col span="2">  付款凭证：
          </Col>
        </Row>
        <Row class-name="margin-bottom-10" :gutter="2">
          <Col span="10">
          <div class="ivu-table-wrapper" style="width: 450px;">
            <div class="ivu-table ivu-table-border">
              <div class="ivu-table-header">
                <table cellspacing="0" cellpadding="0" border="0"  >
                  <colgroup>
                    <col width="180">
                    <col width="100">
                    <col width="70">
                    <col width="100">
                  </colgroup>
                  <thead>
                  <tr>
                    <th class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span class="">付款账号</span>
                      </div>
                    </th>
                    <th class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span class="">应付金额</span>
                      </div>
                    </th>
                    <th class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span class="">运费</span>
                      </div>
                    </th>
                    <th class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span class="">应付总额</span>
                      </div>
                    </th>
                  </tr>
                  </thead>
                </table>
              </div>
              <div class="ivu-table-body" style="">
                <table cellspacing="0" cellpadding="0" border="0">
                  <colgroup>
                    <col width="180">
                    <col width="100">
                    <col width="70">
                    <col width="100">
                  </colgroup>
                  <tbody class="ivu-table-tbody">
                  <tr :key="index" v-for="(item,index) in payList" class="ivu-table-row">
                    <td class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span>{{item.payuser}}</span>
                      </div>
                    </td>
                    <td class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span>{{item.sum}}</span>
                      </div>
                    </td>
                    <td v-if="index==0" :rowspan="payList.length" class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span>{{staffSalesOrder.totalFreight}}</span>
                      </div>
                    </td>
                    <td class="ivu-table-column-center">
                      <div class="ivu-table-cell">
                        <span>{{(item.sum + staffSalesOrder.totalFreight/payList.length).toFixed(2)}}</span>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          </Col>
          <template  v-for="item in payScreenshot">
            <Col :key="item.url" span="4">
            <img :key="item.url" style="height:250px;width:300px;" @click="showViewPayImageDialog(item.url)" title="点击查看大图"  :src="item.url" onerror="this.onerror=null; this.src='http://woxin2.jx139.com/cztx/images/ic_default_head.png'">
            </Col>
          </template>
        </Row>
          <Row v-if=" this.pageType =='check'" type="flex" justify="center" class="code-row-bg">
            <Button type="primary" :disabled="!(staffSalesOrder.orderStatus=='200')"   @click="openCheckDialog">
                审核
            </Button>
        </Row>
          <!-- 点击查看图片弹窗 -->
        <Modal title="查看图片" v-model="viewPayImageDialog.visible">
                <img :src="viewPayImageDialog.url" v-if="viewPayImageDialog.visible" style="width: 100%">
        </Modal>
        <Modal
            v-model="checkDialogForm.visible"
            title="审核单据"
            :mask-closable="false"
            >
            <Form :model="checkDialogForm"   ref="checkDialogForm" :rules="ruleValidate" :label-width="90">
                <FormItem label="">
                <RadioGroup v-model="checkDialogForm.orderStatus">
                    <Radio label="2">同意</Radio>
                    <Radio label="-2">驳回</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="审批意见：" prop="suggest">
                <Input v-model="checkDialogForm.suggest" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入审批意见"></Input>
            </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" @click="cancel()" >取消</Button>
                <Button type="primary" @click="checkStaffSalesOrder" >确认</Button>
            </div>
        </Modal>
      </template>

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
import Util from '../../../libs/util';
import { mapState } from 'vuex'

export default {
    name:"staffsalesorder_detail_template",
    props: {
        orderType: String//订单类型
    },
    data(){
        return {
            pageType:String,//页面类型 审核页面 or 查看页面
            orderId: '',
            staffSalesOrder:{},
            list:[],
            payList:[],
            viewPayImageDialog:{
                visible:false,
                url:''
            },
            ruleValidate:{
                suggest: [
                    { required: true, message: '请填写审批意见', trigger: 'blur' }
                ]
            },
            checkDialogForm:{
                loading:true,
                visible:false,
                orderStatus:'2',
                suggest:''
            },
            payScreenshot:[],
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
                 width: 150
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
            alipayOrderList:[],//支付记录
            expressTrackList:[]//物流记录
        }
    },
    computed:{
    
    },
    methods:{
       //获取订单明细信息
       getStaffSalesOrderDetail(orderId){
           this.request('StaffSalesOrderDetail',{
               ver:'1',
               ts:Date.parse( new Date()),
               data: {
                    "obj": {
                        "orderId": orderId,
                        "userId": ""
                    },
                    "type": 1
               }
           },true).then((res)=>{
             this.staffSalesOrder = res.data.stafforder[0];
             this.staffSalesOrder.orderStatusShow = Util.formatOrderStatus(this.staffSalesOrder.orderStatus);
             this.list = this.staffSalesOrder.staffOrderDetailList;
             this.payScreenshot = this.staffSalesOrder.imageList;
             this.payScreenshot.forEach(function(item){
                 item.url ='/eop'+item.path;
             });
             this.getTrackByExpressNo();
             this.calculatePayInfo();
           })
       },
       showViewPayImageDialog(url){
         this.viewPayImageDialog.visible = true;
         this.viewPayImageDialog.url = url;
       },
       calculatePayInfo(){
          let vm = this;
          let payList=[];
          //合并支付宝付款信息
          let payObj={};
          let skuObj={};
          this.staffSalesOrder.staffOrderDetailList.map(function(item){
              if(item.payAccount in payObj){
                   payObj[item.payAccount] += item.sum;
              }else{
                   payObj[item.payAccount]= item.sum;
              }

              if(item.payAccount in skuObj){
                   skuObj[item.payAccount] += (";"+item.brands+'-'+item.sectionNo+'-'+item.norms)
              }else{
                   skuObj[item.payAccount] = (item.brands+'-'+item.sectionNo+'-'+item.norms)
              }
          })
          for(let pay in payObj){
            payList.push({
                payuser:pay,
                sum: payObj[pay]
            });
          }
          let length = payList.length;
          if(this.staffSalesOrder.orderStatus != '950'){
            payList.forEach((item)=>{
              //应付总额
              item.total = item.sum + this.staffSalesOrder.totalFreight/length ;
              item.tax = (item.total*0.0055).toFixed(2);
              item.total = Number(item.tax) + item.total;
              //商品信息
              item.subject = skuObj[item.payuser];
              item.canPay = false;
              item.payStatus ='已支付';
            })
          }
          
           vm.payList = payList;
          //未审核订单需要请求支付查询接口
           if(this.staffSalesOrder.orderStatus=='200'){
               this.getAlipayOrder(function(){
                 payList.forEach((item)=>{
                   item.canPay = true;
                   item.payStatus ='未支付';
                   //部分支付情况
                   vm.alipayOrderList.forEach((pay)=>{
                    if(pay.alipay_account == item.payuser){
                        item.canPay = false;
                        item.payStatus ='已支付';
                    }
                   })
                 })
                 vm.payList = payList;
               })
           }
       },
       //审核提交
       checkStaffSalesOrder(){
           this.$refs['checkDialogForm'].validate((valid) => {
                if (valid) {
                    this.request('StaffSalesOrderAdd',{
                        ver:'1',
                        ts:Date.parse( new Date()),
                        sign:'',
                        data:{
                            obj:{
                            orderId:this.orderId,
                            checkUserId:this.userInfo.userId,
                            suggest:this.checkDialogForm.suggest,
                            checkUserName:this.userInfo.userName
                            },
                            type:this.checkDialogForm.orderStatus,
                        }
                        },'提交中...').then((res)=>{
                            if(res.code==1){
                                this.getStaffSalesOrderDetail(this.orderId);
                                this.checkDialogForm.visible = false;
                            }else{
                                this.$Message.error(res.msg);
                            }
                        }).catch(()=>{

                        })
                } else {
                    return false;
                }
         })
       },
       //自动审核订单状态
       autoCheckStaffSalesOrder(){
          this.request('StaffSalesOrderAdd',{
                        ver:'1',
                        ts:Date.parse( new Date()),
                        sign:'',
                        data:{
                            obj:{
                            orderId:this.orderId,
                            checkUserId:'1',
                            suggest:'支付宝在线支付,审核通过',
                            checkUserName:'管理员'
                            },
                            type:'2',
                        }
                        },'提交中...').then((res)=>{
                            if(res.code==1){
                                this.getStaffSalesOrderDetail(this.orderId);
                            }else{
                                this.$Message.error(res.msg);
                            }
                        }).catch(()=>{

            })
       },
       //审核弹出框
       openCheckDialog(){
          this.checkDialogForm.visible = true;
       },
       cancel(){
          this.checkDialogForm.visible = false;
       },
       //在线支付
       pay(item){
         console.log(item)
         item.orderId = this.orderId;
         //item.orderId='NG200901011329';
         item.returnUrl = location.href.split('?')[0];
         //item.total= 64.00;
         let data = {}
         data.data = item
         this.request('eom_alipay_order',data,false).then((res)=>{
            if(res.code=='1'){
               window.location.href = res.data;
            }else{
               this.$Message.error(res.message);
            }
         })
       },
       //当订单状态为待审核时需要查询支付记录
       //一般为同一个订单涉及到多个支付宝时才需要
       getAlipayOrder(callback){
         let vm = this;
         this.request('search_alipay_order',{
           orderId:this.orderId
         },false).then((res)=>{
             if(res.status=='success'){
            　this.alipayOrderList = res.data.pay_log_list;
              callback();
              //检测是否需要调用审核接口
              if(res.data.order_checked){
                  vm.autoCheckStaffSalesOrder();
              }
             }
         })
       },
       getTrackByExpressNo(){
         let postid = this.staffSalesOrder.logisticsNo;
         if(!postid){
            return;
         }
         let type='baishiwuliu';
         if(this.staffSalesOrder.logisticsCompany==''){
            type='';
         }else if(this.staffSalesOrder.logisticsCompany=='EMS经济快递'||this.staffSalesOrder.logisticsCompany=='经济快递'){
            type='ems';
         }else if(this.staffSalesOrder.logisticsCompany=='顺丰速递'){
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
       this.pageType = this.$route.params.pageType;
       this.orderId = this.$route.params.orderId
       this.getStaffSalesOrderDetail(this.orderId);
    }
}
</script>

