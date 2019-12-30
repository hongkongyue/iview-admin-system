<style>
  #add_return .add_retun_table_input .ivu-input,
  #add_return .add_retun_table_input .ivu-input-wrapper
  {
    width:100px;
    display: inline-block;
  }
</style>

<template>
  <div id="add_return">
    <Row class="margin-bottom-10">
      <Col span="24" class="search">
      <Form :model="form" ref="form" :label-width="80" inline label-position="right" :rules="rules">
        <Form-item label="物流公司:" prop="logistics_code">
          <Select v-model="form.logistics_code" style="width:150px"  @on-change="changeLogistic">
            <Option v-for="item in logisticList"
                    :value="item.logistic_code"
                    :key="item.logistic_code"

            >{{item.logisticType }}
            </Option>
          </Select>
        </Form-item>
        <span v-if="form.logistics_code != 'YPKD'">
          <Form-item label="物流单号:" prop="logistics_no">
            <InputNumber style="width: 150px" v-model="form.logistics_no" placeholder="请输入物流单号"></InputNumber>
          </Form-item>
        </span>
        <Form-item label="归还说明:">
          <Input v-model="form.suggest" placeholder="请输入归还说明" style="width: 150px"></Input>
        </Form-item>
      </Form>
      </Col>
    </Row>
    <Row class="add_retun_table_input">
      <Table height="300" :columns="tableColumns" size="small" :data="tableData" border></Table>
    </Row>
  </div>
</template>

<script>
    import Util from 'libs/util'
    import { mapState } from 'vuex'

    function form() {
      return {
        logistics_no:null,     //物流单号
        suggest:'',         //归还说明
        logistics_code:'',  //物流公司code
        logistics_company:'',   //物流公司中文
      }
    }
    export default {
        name: "add_return",
        props:{
          pageType:String
        },
        data(){
          return {
            form:form(),
            rules:{
              logistics_no:[
                { required: true, message: '请填写物流单号!', trigger: 'blur' ,type:'number'}
              ],
              logistics_code:[
                { required: true, message: '请选择物流公司!', trigger: 'change' }
              ]
            },
            checkYes:[false,false],
            checkNo:[false,false],
            tableData:[],
            tableColumns:[
              {
                type: 'index',
                width: 60,
                align: 'center'
              },
              {
                title:'品牌',
                key:'brands',
                width:120,
                align:'center'
              },
              {
                title:'规格',
                key:'norms',
                width:100,
                align:'center'
              },
              {
                title:'商品条码',
                key:'commodity_code',
                width:120,
                align:'center'
              },
              {
                title:'借用数量',
                key:'count',
                width:100,
                align:'center'
              },
              {
                title:'未归还数',
                key:'unreturn_count',
                width:100,
                align:'center'
              },
              {
                title:'归还数量',
                key:'item_counts',
                align:'center',
                render:(h,params) => {
                  return h('Input',{
                    props:{
                      size:'small',

                    },
                    on:{
                      'on-blur':(event)=>{
                        this.tableData[params.index].item_counts = Number(event.target.value);
                      }
                    }
                  })
                }
              },
            ],
            Row:{}
          }
        },
        mounted(){
          this.$store.dispatch('GetLogisticListNew',{
            data:{
              order_type: "GH"
            }
          })
          this.$root.eventHub.$on('returnModal',(obj)=>{
            this.form = form();
            this.Row = obj.row;
            this.tableData = obj.tableData;
          })
        },
        computed:{
          ...mapState({
            logisticList:state => state.common.logisticList,
          })
        },
        methods:{
          cancel(){
            this.$refs['form'].resetFields();
          },
          add_return_order(){
            var data = {};
            data.create_user = JSON.parse(window.sessionStorage.getItem('userinfo')).userAccount;
            data.logistics_code = this.form.logistics_code;
            data.logistics_company = this.form.logistics_company
            data.logistics_no = this.form.logistics_no;
            data.order_type = this.Row.type;
            data.source_return_code = this.Row.orderId;
            data.suggest = this.form.suggest;
            data.warehouse_code = this.Row.warehouseCode;
            data.return_order_list = JSON.parse(JSON.stringify(this.tableData));
            data.return_order_list = data.return_order_list.filter(x=>{
              if(!!x.item_counts && x.item_counts > 0){
                delete x.count;
                delete x.unreturn_count;
                delete x.brands;
                x.price_sum = x.price * x.item_counts
                return x
              }
            })
            if(data.return_order_list.length < 1){
              this.$Notice.warning({
                title: '提示',
                desc: '至少归还一件商品!'
              })
              return false;
            }
            this.$refs["form"].validate((valid) => {
              if (valid) {
                this.request('add_return_order',{
                  data:{
                    obj:data
                  }
                },true).then(res=>{
                  if(res.code == 1){
                    this.$store.dispatch('setReturnModal',false)
                    this.$Message.success(res.msg);
                    this.$store.dispatch('setStaffSampleCoatDetail_ActiveTable','return');
                    this.$router.push({
                      name:'staffsamplecoat_detail',
                      params: {
                        orderId: this.Row.orderId,
                        pageType:this.pageType
                      }});
                    this.$root.eventHub.$emit('routerPushStaffsamplecoat_detail');
                  }
                })
              } else {
                this.$Notice.warning({
                  title: '提示',
                  desc: '请核对表单信息!'
                });
                return false;
              }
            })
          },
          changeLogistic(values){
            this.logisticList.forEach(x=>{
              if(x.logistic_code == values){
                this.form.logistics_company	 = x.logisticType
              }
            })
          },
        }
    }
</script>

