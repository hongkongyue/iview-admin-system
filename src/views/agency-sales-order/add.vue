<style scope>

</style>
<template>
    <div class="background-color-white exhibition">
        <Form class="addForm" :model="staffFormData" ref="staffFormData" :label-width="90" :rules="ruleValidate" inline label-position="right">
            <Row>
            <Col span="24" class="search margin-bottom-10">
                <Row>
                    <Col span="6">
                    <Form-item label="订单编号：">
                    <Input style="width:180px;" v-model="staffFormData.orderId" :readonly="true" placeholder="订单编号"></Input>
                    </Form-item>
                    </Col>
                    <Col span="6">
                    <Form-item label="原始订单号：">
                    <Input style="width:180px;" v-model="staffFormData.sourceOrderCode"  placeholder="原始订单号"></Input>
                    </Form-item>
                    </Col>
                   <Col span="6">
                     <Form-item label="物流公司：" prop="logisticsCompany">
                        <Select style="width:162px" v-model="staffFormData.logisticsCompany" @on-change="changeLogistic" placeholder="请选择" >
                        <Option v-for="item in logisticsList" :value="item.logistic_code" :key="item.logistic_code">{{ item.logisticType }}</Option>
                        </Select>
                    </Form-item>
                    </Col>
                    <Col span="6">
                    <Form-item label="手机号码：" prop="phoneNo">
                    <Input v-model="staffFormData.phoneNo" placeholder="收货人手机号码"></Input>
                    </Form-item>
                    </Col>
                </Row>
                <Row>
                <Col span="6">
                <Form-item label="省市区：" prop="provinceCityArea">
                    <Cascader style="width:180px;" :data="addressChoseData" v-model="staffFormData.provinceCityArea" @on-change="changeProvinceCityArea"></Cascader>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="详细地址：" prop="address">
                    <Input v-model="staffFormData.address" placeholder="详细地址"></Input>
                </Form-item>
                </Col>
                  <Col span="6">
                <Form-item label="收货人：" prop="consigne">
                <Input v-model="staffFormData.consigne" placeholder="收货人姓名"></Input>
                </Form-item>
                </Col>
                </Row>
                <Row>
                <Col span="8">
                <Form-item label="留言：">
                        <Input v-model="staffFormData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
                </Form-item>
                </Col>

                 </Row>
                 <Row>
                <Col span="6">
                <Form-item label="总金额：">
                    {{staffFormData.totalMoney}}
                </Form-item>
                </Col>
                 <Col span="6">
                <Form-item label="运费：">
                     {{staffFormData.totalFreight}}
                </Form-item>
                </Col>

                </Row>
            </Col>
            </Row>
        </Form>
    <Row class-name="margin-top-10">
    <Button type="primary" size="small" @click="addRow">
    <Icon type="md-add"></Icon>&nbsp;添加
    </Button>
    </Row>
    <Row class-name="margin-top-10">
      <Table :columns="columns" :border="true" :data="list"></Table>
    </Row>
    <Row class-name="margin-top-10" type="flex" justify="center" class="code-row-bg">
       <Button type="primary"  @click="save">
        提交
      </Button>
    </Row>
    </div>
</template>

<script>

 function StaffFormData(){
    return {
      orderId:'',             //单据编号
      sourceOrderCode:'',     //原始订单号
      address:'',             //收货地址
      department:'',          //部门
      factoryName:'',         //工厂
      use:'',                 //用途
      logisticCenter:'',      //物流公司名字
      logisticsCompany:'',    //物流公司code
      name:'',                //请购人
      totalFreight:0,         //运费
      totalMoney:0,           //总金额
      phoneNo:'',             //收货人手机号
      zipCode:'',             //邮编
      province:'',            //省份
      remark:'',              //备注
      consigne:'',            //收货人姓名
      city:'',                //市
      county:'',              //区/县
      userId:'',              //用户ID
      type:'DX',              //类型
      provinceCityArea:[],
      province_code:'',//省份编码
      staffOrderDetailList:[
        {
          goodsId:'',
          warehouseName:'',
          norms:'',
          brands:'',
          commodityCode:'',
          count:'',
          inventoryCount:'',
          payAccount:'',
          price:'',
          sectionNo:'',
          sum:'',
          orderId:'',
          normList:[]
        }
      ]
    }
}
import cityData from 'libs/city';
import Util from 'libs/util';
export default {

    name:"agencysalesorder_add",
    data(){
        const validatePhoneNo = (rule, value, callback)=>{
            if (value === '') {
                  callback(new Error(''));
            }else if(Util.isMobile(value)){
                  callback();
            }else{
                  this.$Message.warning('请输入正确的手机号码格式');
                  callback(new Error(''));
            }
        }
        return {
             columns:[
          {
              title:'操作',
              key:'operate',
              width:80,
              align: 'center',
              render:(h, params)=>{
                return h('div',[
                    h('Button',{
                        props:{
                            type:'primary',
                            size:'small'
                        },
                        style: {
                        marginRight: '5px'
                        },
                        on: {
                            click: () => {
                                this.deleteRow(params.index);
                            }
                        }},'删除')
                ])
            }
          },
          {
            title: '序号',
            type:'index',
            align:'center',
            width: 70
          },
          {
            title: '品牌',
            key: 'brands',
            width: 180,
            align: 'center',
            render: (h, params) => {
                return h('Select', {
                    props:{
                        value: this.list[params.index].brandsId,
                    },
                    on: {
                        'on-change':(value) => {
                            this.list[params.index].brandsId = value;
                            this.changeBrand(params.index);
                        }
                    },
                },
                this.brandListFilter.map(function(item){
                    return h('Option', {
                        props: {value: item.id}
                    }, item.brands);
                })
                );
            },
          },
          {
            title: '款号',
            key: 'sectionNo',
            width: 120,
            align: 'center',
            render:(h, params) => {
               return h('Input',{
                   props:{
                      type:'text',
                       value: this.list[params.index].sectionNo
                   },
                   on: {
                        'on-blur':(event) => {
                          this.list[params.index].sectionNo = event.target.value;
                          this.getGoodSpecList(params,event.target.value);
                        }
                   }
               })
            }
          },
          {
              title:'规格名称',
              key:'norms',
              width: 140,
              align: 'center',
              render: (h, params) => {
                return h('Select', {
                    props:{
                        value: this.list[params.index].norms,
                    },
                    on: {
                        'on-change':(value) => {
                            this.list[params.index].norms = value;
                            this.changeNorm(params.index);
                        }
                    },
                },
                this.list[params.index].normList.map(function(item){
                    return h('Option', {
                        props: {value: item.norms}
                    }, item.norms);
                })
                );
            },
          },
          {
              title:'商品条码',
              key:'commodityCode',
              width:120,
              align: 'center'
          },
          {
              title:'仓库',
              key:'warehouseName',
              width:80,
              align: 'center'
          },
          {
              title:'单价',
              key:'price',
              width:65,
              align: 'center'
          },
          {
              title:'数量',
              key:'count',
              width:100,
             align: 'center',
              render:(h, params)=>{
                 return h('Input',{
                    props:{
                        value: Number(this.list[params.index].count)
                    },
                   on: {
                        'on-blur':(event) => {
                          if(!params.row.norms){
                              this.$Message.warning('请先选择规格名称!');
                              this.list[params.index].count = 0;
                          }
                          else if(params.row.inventoryCount<event.target.value){
                            this.$Message.warning('输入的数量超过库存数量!请重新输入数量!');
                            this.list[params.index].count = 0;
                          } else {
                            this.list[params.index].count = Number(event.target.value);
                            this.list[params.index].sum = Number(event.target.value)*params.row.price;
                            this.getTotalFreight();
                          }
                          this.$set(this.list,params.index,this.list[params.index]);
                        }
                   }
                 });
              }
          },
          {
              title:'金额',
              key:'sum',
              width:80,
              align: 'center'
          }
          ],
            list:[],
            staffFormData:StaffFormData(),
               ruleValidate: {
                consigne: [
                    { required: true, message: '', trigger: 'blur' }
                ],
                provinceCityArea: [
                  { type: 'array', required: true, message: '', trigger: 'blur' }
                ],
                phoneNo: [
                  { required: true ,validator:validatePhoneNo, trigger: 'blur' }
                ],
                address: [
                  { required: true, message: '', trigger: 'blur' }
                ],
                logisticsCompany: [
                  { required: true, message: '', trigger: 'blur' }
                ]
          },
            addressChoseData:[],
            logisticsList:[],
            freight:[],
            brandList:[],//品牌列表
        }
    },
    methods:{
        getLogisticList(){
             this.request('GetLogisticListNew',{
                    ver:'1',
                    ts:Date.parse( new Date()),
                    sign:'',
                    data:{
                        order_type: "DX"
                    }
            }).then((res)=>{
               if(res.code == '1'){
                   this.logisticsList = res.data;
               }
            })
        },
        changeLogistic(values){
            this.logisticsList.forEach(x=>{
            if(x.logistic_code == values){
                this.staffFormData.logisticCenter = x.logisticTypeNo
            }
            })
            this.getTotalFreight();
        },
        //省市区改变时触发
        changeProvinceCityArea(value){
            this.staffFormData.provinceCityArea = value;
            const that = this;
            if( this.staffFormData.provinceCityArea&& this.staffFormData.provinceCityArea.length>0){
                this.staffFormData.province=  this.staffFormData.provinceCityArea[0];
                this.staffFormData.city =  this.staffFormData.provinceCityArea[1];
                this.staffFormData.county =  this.staffFormData.provinceCityArea[2];
                //获取省份编码
                for(let pro of this.freight.freight){
                    if(pro.province.indexOf(that.staffFormData.province)>=0){
                        that.staffFormData.province_code=pro.province_code;
                        break;
                    }
                }
               this.getTotalFreight();
            }
        },
        getAddressChoseData(){
          this.addressChoseData = cityData.data;
        },
        getFreightList(){
            this.request('GetFreightListNew',{
                   ver:'1',
                    ts:Date.parse( new Date()),
                    sign:'',
                    data:{
                        map:{
                            type:'FY',
                            userId:JSON.parse(window.sessionStorage.getItem('userinfo')).userId
                        }
                    }
            }).then((res)=>{
               if(res.code == '1'){
                  this.freight = res.data;
               }
            })
        },
        getBrandList(){
          this.request('GetBrandList',{
            ver:'1',
            ts:Date.parse( new Date()),
            sign:'',
            data:{}
          },false).then((res)=>{
              this.brandList = res.data;
          })
        },
        changeBrand(index){
            let row = this.list[index];
            this.brandList.filter(x=>{
            if(x.id == row.brandsId){
                row.warehouseName = x.warehouseName;
                row.warehouseNo = x.warehouseNo;
                row.payAccount = x.payAccount;
                row.brands = x.brands;
            }
            })
        },
        changeNorm(index){
           let row = this.list[index];
           row.normList.map(norm=>{
             if(norm.norms == row.norms){
                row.inventoryCount = norm.inventoryCount;
                row.commodityCode = norm.commodityCode;
                row.price = norm.price;
                row.goodsId = norm.goodsId;
                if(norm.inventoryCount>0){
                    row.count = 1;
                    this.getTotalFreight();
                }
                row.sum = row.price*row.count;
             }
           })
        },
        getGoodSpecList(params,sectionNo){
            let sectionNoData = Util.Trim(sectionNo);
            if(!sectionNoData){
               return;
            }
            let row = params.row;
            this.request('GetGoodSpecList',{
            ver:'1',
            ts:Date.parse( new Date()),
            sign:'',
            methods:'get_good_spec_list',
            data:{
                type:'DX',
                obj:{
                brandId:row.brandsId,
                goodsNo:sectionNoData,
                warehouseNo:row.warehouseNo
                }
            }
        },'正在查询...').then((res)=>{
           if(res.code=='1'){
               this.list[params.index].normList = res.data;
               this.$Message.success('查询规格名称成功');
           }
        });
        },
        //自动生成orderId
        getOrderId(){
             let type='DX';
             let len = String(Date.parse( new Date())).length;
             let ts = String(new Date().getTime()).substr(len-6,6)
             this.staffFormData.orderId = type + Util.currentDate()+ts;
        },
       deleteRow(index){
          //只有一条记录时 不能删除
           if(this.list.length==1){
                 return;
           }
           this.list.splice(index, 1);
           this.getTotalFreight();
       },
       addRow(){
           //需要先确定第一条记录的仓库
           if(this.list.length==1&&!this.list[0].warehouseNo){
                 this.$Message.warning('请先完善第一条记录');
                 return;
           }
           this.list.push(StaffFormData().staffOrderDetailList[0]);
       },
         //计算邮费
       getTotalFreight(){

         const that = this;
         if(!this.staffFormData.province_code){
            return;
         }

         if(!this.staffFormData.logisticCenter){
            return;
         }

         let data=[];
         let totalMoney = 0;

         this.list.forEach(function(item){
             if(item.commodityCode&&item.count){
                 data.push({
                    logistic_code:that.staffFormData.logisticsCompany,
                    num:item.count,
                    order_code:that.staffFormData.orderId,
                    spec_no:item.commodityCode,
                    state_code:that.staffFormData.province_code
                 })
                 totalMoney+=Number(item.count)*Number(item.price);
             }
         })

         if(data.length<=0){
               return;
         }

         this.request('GetTotalFright',{
            data:{
              list:data
            }
         },'正在计算运费').then((res)=>{
             if(res.code==1){
                 that.staffFormData.totalFreight = Number(res.data.sum_freight).toFixed(2);
                 that.staffFormData.totalMoney = Number(that.staffFormData.totalFreight)+totalMoney;
                 that.staffFormData.totalMoney = Number(that.staffFormData.totalMoney).toFixed(2);
             }
         })
       },
        save(){
        for(let item of this.list){
            if(!item.count){
                this.$Message.warning('请先填写购买数量');
                return;
            }
         }
        this.$refs['staffFormData'].validate((valid) => {
                if (valid) {
                            let data = Util.deepClone(this.staffFormData);
                            delete data.provinceCityArea;
                            delete data.province_code
                            data.userId =  this.userInfo.userId;

                            data.staffOrderDetailList.forEach(function(item){
                                delete item.normList;
                            });

                            this.request('FactorySampleCoatAdd',{
                                    ver:'1',
                                    ts:Date.parse( new Date()),
                                    sign:'',
                                    // methods:'add_order',
                                    data:{
                                     obj:data,
                                     type:1
                                    }
                            },true).then((res)=>{
                                 if(res.code=='1'){
                                    this.$Message.success(res.msg);
                                    this.$root.eventHub.$emit('closePageFromOtherPage','agencysalesorder_add');//关闭新增页面
                                    this.$router.push({name:'agencysalesorder_list'});//跳转至列表页面
                                    }else{
                                    this.$Message.warning(res.msg);
                                 }
                            })
                } else {
                    this.$Message.error('请核对表单信息!');
                    return false;
                }
         })
        }
    },
    mounted(){
        this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
        this.getOrderId();
        this.getAddressChoseData();
        this.getBrandList();
        this.getFreightList();
        this.getLogisticList();
        this.list = this.staffFormData.staffOrderDetailList;
    },
    computed:{
        brandListFilter:function(){
          let that = this;
          if(this.list.length >1&&this.list[0].warehouseNo){
              return this.brandList.filter(function(brand){
                     return that.list[0].warehouseNo == brand.warehouseNo;
          })
          }else{
              return this.brandList;
          }
        }
    }
}
</script>
