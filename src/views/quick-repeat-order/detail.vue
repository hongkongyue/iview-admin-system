<style>
  #quickrepeatorder_detail {

  }
  #quickrepeatorder_detail .print{
    cursor: pointer;
    font-size: 50px;
  }
  #quickrepeatorder_detail .print:hover{
    cursor: pointer;
    font-size: 50px;
    color: #2d8cf0;
  }
  #quickrepeatorder_detail .operation{
    margin-top:20px;
    text-align: center;
  }
</style>

<template>
  <div class="background-color-white exhibition" id="quickrepeatorder_detail">
    <Form :model="form_detail" class="search" ref="form_detail" :label-width="80" inline label-position="right">
      <Row>
        <Col span="20">
          <Row>
            <Col span="5">
              <Form-item label="品牌：">
                {{ form_detail.brandName }}
              </Form-item>
            </Col>
            <Col span="6">
              <Form-item label="下单编号：">
                {{ form_detail.reorderCode }}
              </Form-item>
            </Col>
            <Col span="5">
              <Form-item label="品名：">
                {{ form_detail.className }}
              </Form-item>
            </Col>
            <Col span="5">
              <Form-item label="销售季节：">
                {{ form_detail.season }}
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="5">
              <Form-item label="下单批次：">
                {{ form_detail.batch }}
              </Form-item>
            </Col>
            <Col span="6">
              <Form-item label="加工厂：">
                {{ form_detail.factoryName }}
              </Form-item>
            </Col>
            <Col span="5">
              <Form-item label="加工类型：">
                {{ form_detail.processType }}
              </Form-item>
            </Col>
            <Col span="5">
              <Form-item label="要求入库时间：">
                {{ form_detail.planStockinTime }}
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="5">
              <Form-item label="制单号：">
                {{ form_detail.manuOrderCode }}
              </Form-item>
            </Col>
            <Col span="6">
              <Form-item label="订单状态：">
                {{ form_detail.reorderStatus }}
              </Form-item>
            </Col>
            <Col span="5">
              <Form-item label="合约货期：">
                {{ form_detail.contractDate }}
              </Form-item>
            </Col>
          </Row>
        </Col>
        <Col span="3">
          <Icon type="md-print" class="print" @click.native="print"></Icon>
        </Col>
      </Row>
    </Form>
    <Row>
      <Table size="small" :columns="columns" highlight-row :data="form_detail.reorderDetail"></Table>
    </Row>
    <Row>
      <Col span="24" class="margin-top-10">
        <Col span="6">
          <b>下单人：{{ form_detail.createUser }}</b>
        </Col>
        <Col span="18">
          <b>下单时间：{{ form_detail.created }}</b>
        </Col>
      </Col>
      <Col span="24" class="margin-top-10" v-if="false">
        <Col span="6">
          <b>审核人：{{ form_detail.checkUser }}</b>
        </Col>
        <Col span="18">
          <b>审核时间：{{ form_detail.checkTime }}</b>
        </Col>
      </Col>
    </Row>
    <Row class="operation" v-if='form_detail.reorderStatus == "待审核"'>
      <Button v-if="btnList.check" type="primary" @click="openModal">一级审核</Button>
    </Row>
     <Row class="operation" v-if='form_detail.reorderStatus == "一级审核通过"'>
      <Button v-if="btnListTwo.check" type="primary" @click="openModal">二级审核</Button>
    </Row>
    <Modal
      v-model="batchReview_visible"
      title="审核单据"
      :mask-closable="false"
    >
      <Form :model="batchReviewForm" ref="batchReview" :label-width="90">
        <FormItem label="">
          <RadioGroup v-model="batchReviewForm.reorderStatus">
            <Radio label="1">同意</Radio>
            <Radio label="0">驳回</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="审批意见：">
          <Input v-model="batchReviewForm.checkNote" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="请输入审批意见"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="batchReview_visible = false;">取消</Button>
        <Button type="primary" @click="operation_order">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import Util from 'libs/util'
  function batchReviewForm(){
    return {
      reorderStatus:'1',
      checkNote:''
    }
  }
  let processStatus = Vue.extend({
    props:['status'],
    data(){
      return {
        status_color:''
      }
    },
    mounted(){
      switch(this.status){
        case '草稿':
          this.status_color = '#ff9900'
          break;
        case '已完成':
          this.status_color = '#19be6b'
          break;
        case '已取消':
          this.status_color = '#ed3f14'
          break;
        default:
          break;
      }
    },
    template: `
        <div :style="{color:status_color}">
          {{status}}
        </div>
    `,
  })
  export default {
    name: "quickrepeatorder_detail",
    data(){
      return {
        form_detail:{},
        list:[],
        columns: [
          {
            title: '序号',
            key:'serialNo',
            align:'center',
            minWidth: 65
          },
          {
            title: '款号',
            key: 'sectionNo',
            align: 'center',
            minWidth: 100
          },
          {
            title: '颜色',
            key: 'color',
            align: 'center',
            minWidth: 100
          },
          {
            title: '规格',
            key: 'norms',
            align: 'center',
            minWidth: 120
          },
          {
            title: '商品条码',
            key: 'commodityCode',
            align: 'center',
            minWidth: 150
          },
          {
            title: '下单数',
            key: 'qty',
            align: 'center',
            minWidth: 100
          },
          {
            title: '生产状态',
            key: 'processStatus',
            align: 'center',
            minWidth: 100,
            render:(h,params)=>{
              console.log(h,params)
              console.log(params.row)
              return h(processStatus, {
                props: {
                    status: Util.formatOrderStatus(params.row.processStatus.toString())
                }
              })
            }
          },
          {
            title: 'scm下单量',
            key: 'scmQty',
            align: 'center',
            minWidth: 100
          },
          {
            title: '首单合约价',
            key: 'firstContractPrice',
            align: 'center',
            minWidth: 100
          },
          {
            title: '上单合约价',
            key: 'listContractPrice',
            align: 'center',
            minWidth: 100
          },
          {
            title: '总合约单价',
            key: 'totalContractPrice',
            align: 'center',
            minWidth: 100
          },
          {
            title: '试制费',
            key: 'trialPrice',
            align: 'center',
            minWidth: 100
          },
          {
            title: '合约单价',
            key: 'contractPrice',
            align: 'center',
            minWidth: 120
          },
          {
            title: '备注',
            key: 'detailRemark',
            align: 'center',
            minWidth: 80
          },
          {
            title: '大货核价成本',
            key: 'pricingPrice',
            align: 'center',
            minWidth: 110
          },
          {
            title: '税前成本价',
            key: 'untaxPrice',
            align: 'center',
            minWidth: 100
          },
          {
            title: '零售价',
            key: 'salePrice',
            align: 'center',
            minWidth: 100
          },
        ],
        btnList:{
          check:false,
          reject:false
        },
        btnListTwo:{
          check:false,
          reject:false
        },
        batchReview_visible:false,
        batchReviewForm:batchReviewForm()
      }
    },
    mounted(){

    },
    activated(){
      this.get_reorder_detail();
      this.$set(this.btnList,'check',false)
      this.$set(this.btnList,'reject',false)
      this.$set(this.btnListTwo,'check',false)
      this.$set(this.btnListTwo,'reject',false)
      console.log(this.form_detail.reorderStatus,'09890-9-9-9-09-09')
      Util.getButtonPermission('quickrepeatorder_list').then((res) => {
        for (let item of res.data.data) {
          console.log(item,'.//./././././',this.form_detail.reorderStatus)
          if (item.code == 'firstCheck' && item.available == 1) {
            this.btnList.check = true
          }
           if (item.code == 'secondCheck' && item.available == 1) {
            this.btnListTwo.check = true
          }
          if (item.code == 'reject' && item.available == 1) {
            this.btnList.reject = true
            this.btnListTwo.reject = true
          }
        }
      })
    },
    methods:{
      get_reorder_detail() {
        this.request('get_reorder_detail', {
          data: {
            reorderCode: this.$route.params.orderId
          }
        }, true).then(res => {
          if (res.code == 1) {
            //处理序号显示
            this.form_detail = res.data.reorderList;
            this.form_detail.reorderDetail = this.form_detail.reorderDetail.filter(x=>{
              let flag = false;
              if(x.qty <= 0){
                this.form_detail.reorderDetail.map(y=>{
                  if(x.color == y.color && y.qty > 0){
                    flag = true;
                  }
                })
              }else{
                flag = true;
              }
              if(flag){
                return x;
              }
            })
            let name = this.form_detail.reorderStatus
            if(name=='100'){
              this.form_detail.reorderStatus ='草稿'
            }else if(name=='200'){
              this.form_detail.reorderStatus ='待审核'
            }else if(name=='250'){
              this.form_detail.reorderStatus ='已驳回'
            }else if(name=='300'){
              this.form_detail.reorderStatus ='已审核'
            }else if(name=='350'){
              this.form_detail.reorderStatus ='一级审核失败'
            }else if(name=='400'){
              this.form_detail.reorderStatus ='一级审核通过'
            }else if(name=='600'){
              this.form_detail.reorderStatus ='已推送'
            }else if(name=='500'){
              this.form_detail.reorderStatus ='二级审核通过'
            }else if(name=='800'){
              this.form_detail.reorderStatus ='已完成'
            }else if(name=='700'){
              this.form_detail.reorderStatus ='推送失败'
            }else if(name=='950'){
              this.form_detail.reorderStatus ='已取消'
            }else if(name=='450'){
              this.form_detail.reorderStatus ='二级审核失败'
            }else if(name=='550'){
              this.form_detail.reorderStatus ='生产中'
            }else if(name=='650'){
              this.form_detail.reorderStatus ='部分生产'
            }
            else if(name=='850'){
              this.form_detail.reorderStatus ='部分完成'
            }

            let serialNoBegain = 0;
            let qty = 0;
            let contractPrice = 0;
            this.form_detail.reorderDetail.forEach((item)=>{
              serialNoBegain++;
              qty += item.qty;
              contractPrice += item.contractPrice;
              item.serialNo = serialNoBegain;
            });
            this.form_detail.reorderDetail.push({
              serialNo:'合计',
              contractPrice:contractPrice,
              qty:qty
            })
          }
        })
      },
      print(){
        this.$router.push({name: 'quickrepeatorder_report',params:{orderId:this.$route.params.orderId}});//跳转至列表页面
      },
      openModal(){
        this.batchReview_visible = true;
        this.batchReviewForm = batchReviewForm();
      },
      operation_order(status){
        console.log(this.form_detail)
        let userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
        this.request('check_order',{
          data:{
            id:this.form_detail.id,
            userId:userInfo.userId,
            userName:userInfo.userName,
            checkStatus:Number(this.batchReviewForm.reorderStatus),
            checkMsg:this.batchReviewForm.checkNote,
            // reorderCode:this.form_detail.reorderCode,
            // reorderStatus:this.batchReviewForm.reorderStatus,
            // checkNote:this.batchReviewForm.checkNote,
            // checkUser:userInfo.userName,
            // lastUpdateUser:userInfo.userName
          }
        },true).then(res=>{
          if(res.code == 1){
            this.batchReview_visible = false;
            this.$Message.success(res.msg)
            this.$root.eventHub.$emit('closePageFromOtherPage', 'quickrepeatorder_detail');//关闭新增页面
            this.$router.push({name: 'quickrepeatorder_list'});
          }
        })
      }
    }
  }
</script>
