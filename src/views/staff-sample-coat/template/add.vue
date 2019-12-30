<template>
  <div class="background-color-white exhibition" id="staffSalesOrder">
  
    <Form :model="staffFormData" ref="staffFormData" :label-width="90" :rules="ruleValidate" inline label-position="right">
      <Row>
        <Col span="24" class="search margin-bottom-10">
        <Row>
          <Col span="6">
          <Form-item label="申请类型：" prop="type">
            <Select style="width:180px" v-model="staffFormData.type" @on-change="orderTypeChange" placeholder="请选择申请类型">
                <Option value="LY">样衣领用</Option>
                <Option value="JY">样衣借用</Option>
              </Select>
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="订单编号：">
            <Input v-model="staffFormData.orderId" :readonly="true" placeholder="订单编号"></Input>
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="借用人：" prop="name">
            <Input v-model="staffFormData.name" :readonly="true" placeholder="借用人"></Input>
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="物流公司：" prop="logisticsCompany">
            <Select style="width:162px" v-model="staffFormData.logisticsCompany" placeholder="请选择" @on-change="changeLogistic" :disabled='disabled'>
                <Option v-for="item in logisticsListFilter" :value="item.logisticType" :key="item.logisticTypeNo">{{
                  item.logisticType }}
                </Option>
              </Select>
          </Form-item>
          </Col>
        </Row>
        <deliver_address_chose ref="deliveryAddressChose" @delivery-address-change="deliveryAddressChange"></deliver_address_chose>
        <Row>
          <Col span="6">
          <Form-item label="用途：" prop="use">
            <Input style="width:180px" v-model="staffFormData.use" placeholder="用途"></Input>
          </Form-item>
          </Col>
          <Col span="8">
          <Form-item label="留言：">
            <Input v-model="staffFormData.remark" type="textarea" width="200px;" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
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
      <Button type="primary" @click="save">
          提交
        </Button>
      <Button class="margin-left-10" type="primary" @click="save_order_cart" v-if="!!staffFormData.orderStatus && (staffFormData.orderStatus == 100 ||
              staffFormData.orderStatus == 200 || staffFormData.orderStatus == 250) || $route.params.openType == 'add'
        ">
          保存草稿
        </Button>
    </Row>
  </div>
</template>

<script>
  function StaffFormData() {
    return {
      orderId: '',
      address: '',
      department: '',
      logisticCenter: '4', //物流公司code
      logisticsCompany: '圆通快递', //物流公司名字
      name: '',
      orderStatus: '',
      totalFreight: '',
      phoneNo: '',
      totalMoney: '',
      zipCode: '',
      province: '',
      remark: '',
      consigne: '',
      city: '',
      county: '',
      logisticsNo: '',
      payTime: '',
      userId: '',
      type: '',
      staffOrderDetailList: [{
        goodsId: '',
        warehouseName: '',
        norms: '',
        brands: '',
        brandsId: '',
        commodityCode: '',
        count: '',
        inventoryCount: '',
        payAccount: '',
        price: '',
        sectionNo: '',
        sum: '',
        orderId: '',
        normList: []
      }]
    }
  }
  
  import cityData from 'libs/city';
  import Util from 'libs/util';
  import Vue from 'vue'
  import deliver_address_chose from '@/components/DeliverAddressChose'
  
  var commodityCode = Vue.extend({
    props: ['params', 'list', 'check_norms_index'],
    template: `
       <div>
         <div v-if="false">
           <Tooltip placement="right">
              <span>{{this.list[params.index].commodityCode}}</span>
              <div slot="content">
                  <img :src="this.list[params.index].normList[this.check_norms_index].imgUrl" alt="" style="width:50%;height:50%">
              </div>
          </Tooltip>
         </div>
         <div v-else>
           <span>{{this.list[params.index].commodityCode}}</span>
         </div>
       </div>
  
      `
  })
  
  export default {
    name: 'staffsamplecoat_add',
    components: {
      deliver_address_chose
    },
    props:['pageType','orderId','type'],
    data() {
      const validatePhoneNo = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(''));
        } else if (Util.isMobile(value)) {
          callback();
        } else {
          this.$Message.warning('请输入正确的手机号码格式');
          callback(new Error(''));
        }
      }
      return {
        temp_warehouse:'',
        columns: [
          {
            title: '操作',
            key: 'operate',
            width: 80,
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
                      this.deleteRow(params.index);
                    }
                  }
                }, '删除')
              ])
            }
          },
          {
            title: '序号',
            type: 'index',
            align: 'center',
            width: 70
          },
          {
            title: '品牌',
            key: 'brands',
            width: 180,
            align: 'center',
            render: (h, params) => {
              return h('Select', {
                  props: {
                    value: this.list[params.index].brandsId,
                  },
                  on: {
                    'on-change': (value) => {
                      this.list[params.index].brandsId = value;
                      this.changeBrand(params.index);
                    }
                  },
                },
                this.brandListFilter.map(function(item) {
                  return h('Option', {
                    props: {
                      value: item.id
                    }
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
            render: (h, params) => {
              return h('Input', {
                props: {
                  type: 'text',
                  value: this.list[params.index].sectionNo
                },
                on: {
                  'on-blur': (event) => {
                    this.list[params.index].sectionNo = event.target.value;
                    this.getGoodSpecList(params, event.target.value);
                  }
                }
              })
            }
          },
          {
            title: '规格名称',
            key: 'norms',
            width: 140,
            render: (h, params) => {
              return h('Select', {
                  props: {
                    value: this.list[params.index].norms,
                  },
                  on: {
                    'on-change': (value) => {
                      this.list[params.index].norms = value;
                      this.check_norms_index = params.index;
                      this.changeNorm(params.index);
                    }
                  },
                },
                this.list[params.index].normList.map(function(item) {
                  return h('Option', {
                    props: {
                      value: item.norms
                    }
                  }, item.norms);
                })
              );
            },
          },
          {
            title: '商品条码',
            key: 'commodityCode',
            width: 120,
            align: 'center',
            render: (h, params) => {
              return h(commodityCode, {
                props: {
                  params: params,
                  list: this.list,
                  check_norms_index: this.check_norms_index
                }
              })
            }
          },
          {
            title: '库存数量',
            key: 'inventoryCount',
            width: 90,
            align: 'center'
          },
          {
            title: '仓库',
            key: 'warehouseName',
            width: 80,
            align: 'center',
          },
          {
            title: '单价',
            key: 'price',
            minWidth: 65,
            align: 'center',
          },
          {
            title: '数量',
            key: 'count',
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h('Input', {
                props: {
                  value: Number(this.list[params.index].count),
                },
                on: {
                  'on-blur': (event) => {
                    if (!params.row.norms) {
                      this.$Message.warning('请先选择规格名称!');
                      this.list[params.index].count = 0;
                    } else if (params.row.inventoryCount < event.target.value) {
                      this.$Message.warning('输入的数量超过库存数量!请重新输入数量!');
                      this.list[params.index].count = 0;
                    } else {
                      this.list[params.index].count = Number(event.target.value);
                      this.list[params.index].sum = Number(event.target.value) * params.row.price;
                    }
                    this.$set(this.list, params.index, this.list[params.index]);
                  }
                }
              });
            }
          },
          {
            title: '金额',
            key: 'sum',
            minWidth: 65,
            align: 'center',
          },
          {
            title: '支付宝账号',
            key: 'payAccount',
            minWidth: 150,
            align: 'center',
          }
        ],
        staffFormData: StaffFormData(),
        ruleValidate: {
          name: [{
            required: true,
            message: '',
            trigger: 'blur'
          }],
          consigne: [{
            required: true,
            message: '',
            trigger: 'blur'
          }],
          use: [{
            required: true,
            message: '',
            trigger: 'blur'
          }],
          provinceCityArea: [{
            type: 'array',
            required: true,
            message: '',
            trigger: 'blur'
          }],
          phoneNo: [{
            required: true,
            validator: validatePhoneNo,
            trigger: 'blur'
          }],
          address: [{
            required: true,
            message: '',
            trigger: 'blur'
          }],
          logisticsCompany: [{
            required: true,
            message: '',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: '',
            trigger: 'blur'
          }]
        },
        addressChoseData: [], //省市区选择
        list: [], //表格数据源
        brandList: [], //品牌列表
        logisticsList: [], //物流公司列表
        freight: [], //省份运费
        check_norms_index: 0,
        trigger_num: 0,
      }
    },
    methods: {
      getLogisticList() {
        this.request('getLogisticListNode', {
          ver: '1',
          ts: Date.parse(new Date()),
          sign: '',
          data: '',
          orderType:'YY'
        }).then((res) => {
          if (res.errno == 0) {
            this.logisticsList = res.data;
            console.log(this.logisticsList,'9999')
          }
        })
      },
      changeLogistic(values) {
        this.logisticsList.forEach(x => {
          if (x.logisticType == values) {
            this.staffFormData.logisticCenter = x.logisticTypeNo
          }
        })
      },
      getFreightList() {
        this.request('GetFreightList', {
          ver: '1',
          ts: Date.parse(new Date()),
          sign: '',
          data: {
            map: {
              type: 'NG',
              userId: JSON.parse(window.sessionStorage.getItem('userinfo')).userId
            }
          }
        }).then((res) => {
          if (res.code == '1') {
            this.freight = res.data;
          }
        })
      },
      getBrandList() {
        this.request('GetBrandList', {
          ver: '1',
          ts: Date.parse(new Date()),
          sign: '',
          data: {}
        }, false).then((res) => {
          this.brandList = res.data;
        })
      },
      changeBrand(index) {
        console.log(index)
        let row = this.list[index];
        this.brandList.filter(x => {
          if (x.id == row.brandsId) {
            if(this.temp_warehouse != x.warehouseName && index == 0){
                this.temp_warehouse = x.warehouseName;
                this.staffFormData.logisticsCompany = '';
                this.staffFormData.logisticCenter = '';
            }
            row.warehouseName = x.warehouseName;
            row.warehouseNo = x.warehouseNo;
            row.payAccount = x.payAccount;
            row.brands = x.brands;
          }
        })
      },
      changeNorm(index) {
        let row = this.list[index];
        row.normList.map(norm => {
          if (norm.norms == row.norms) {
            row.inventoryCount = norm.inventoryCount;
            if (norm.inventoryCount > 0) {
              row.count = 1;
            }
            row.commodityCode = norm.commodityCode;
            row.price = norm.price;
            row.sum = row.price * row.count;
            row.goodsId = norm.goodsId;
          }
        })
      },
      getGoodSpecList(params, sectionNo) {
        let sectionNoData = Util.Trim(sectionNo);
        if (!sectionNoData) {
          return;
        }
        let row = params.row;
        var that = this;
        this.request('GetGoodSpecList', {
          ver: '1',
          ts: Date.parse(new Date()),
          sign: '',
          methods: 'get_good_spec_list',
          data: {
            type:that.staffFormData.type,
            obj: {
              brandId: row.brandsId,
              goodsNo: sectionNoData.toLocaleUpperCase(),
              warehouseNo: row.warehouseNo
            },
            type:'YY'
          }
        }, '正在查询...').then((res) => {
          if (res.code == '1') {
            this.list[params.index].normList = res.data;
            this.$Message.success('查询规格名称成功');
          }
        });
      },
      deleteRow(index) {
        //只有一条记录时 不能删除
        if (this.list.length == 1) {
          return;
        }
        this.list.splice(index, 1);
      },
      addRow() {
        //需要先确定第一条记录的仓库
        if (this.list.length == 1 && !this.list[0].warehouseNo) {
          this.$Message.warning('请先完善第一条记录');
          return;
        }
        let staffOrderDetailList =  Util.deepClone(StaffFormData().staffOrderDetailList[0]);
        let len = this.staffFormData.staffOrderDetailList.length;
        staffOrderDetailList.brandsId = this.staffFormData.staffOrderDetailList[len - 1].brandsId;

        this.list.push(staffOrderDetailList);
        this.changeBrand(len);
      },
      //计算邮费
      getTotalFreight() {
        const that = this;
        let totalCount = 0;
        that.list.forEach(function(item) {
          totalCount += Number(item.count);
        })
        if (that.staffFormData.address.indexOf('农业大厦') >= 0 || totalCount >= 2) {
          that.staffFormData.totalFreight = 0;
          return;
        }
        for (let pro of this.freight.freight) {
          if (that.staffFormData.province.indexOf(pro.province) >= 0) {
            that.staffFormData.totalFreight = pro.freight;
            break;
          }
        }
      },
      //订单类型改变
      orderTypeChange(value) {
        if (this.trigger_num == 0 && this.type == 'edit') {
          this.trigger_num++;
          return
        }
        this.getOrderId();
      },
      //自动生成orderId
      getOrderId() {
        let type = '';
        if (this.staffFormData.type) {
          type = this.staffFormData.type
        } else {
          return;
        }
        let len = String(Date.parse(new Date())).length;
        let ts = String(new Date().getTime()).substr(len - 6, 6)
        this.staffFormData.orderId = type + Util.currentDate() + ts;
  
      },
      //无需确认运费时 保存提交
      save() {
        for (let item of this.list) {
          if (!item.count) {
            this.$Message.warning('请先填写购买数量');
            return;
          }
        }
        this.$refs['staffFormData'].validate((valid) => {
  
          if (valid) {
            let data = Util.deepClone(this.staffFormData);
            data.totalFreight = 0;
            data.totalMoney = 0;
            data.userId = this.userInfo.userId;
            delete data.nameShow;
            delete data.remarkShow;
            //处理省市区
            if (data.provinceCityArea && data.provinceCityArea.length > 0) {
              data.province = data.provinceCityArea[0];
              data.city = data.provinceCityArea[1];
              data.county = data.provinceCityArea[2];
              delete data.provinceCityArea;
            }
            data.staffOrderDetailList.forEach(function(item) {
              data.totalMoney = data.totalMoney + Number(item.count) * Number(item.price);
              delete item.normList;
              item.check = true;
            });

            if(this.type == 'edit'){
                delete data.content;
                delete data.id;
            }
            this.request('StaffSampleCoatAdd', {
              ver: '1',
              ts: Date.parse(new Date()),
              sign: '',
              methods: 'add_order',
              data: {
                obj: data,
                type: 1
              }
            }, true).then((res) => {
              if (res.code == '1') {
                this.$Message.success(res.msg);
                if (this.$route.params.openType == 'add') {
                  this.$root.eventHub.$emit('closePageFromOtherPage', 'staffsamplecoat_add'); //关闭新增页面
                } else {
                  this.$root.eventHub.$emit('closePageFromOtherPage', 'staffsamplecoat_edit'); //关闭新增页面
                }
                this.$router.push({
                  name: 'staffsamplecoat_list'
                }); //跳转至列表页面
              } else {
                this.$Message.warning(res.msg);
              }
            })
          } else {
            this.$Message.error('请核对表单信息!');
            return false;
          }
        })
      },
  
      get_good_spec_by_list(data) {
        let dataMap = [];
        data.map((value, key) => {
          let warehouseName;
          warehouseName = value.warehouseName == "宇隆仓" ? 'XSYLC' : 'XSGLC';
          dataMap.push({
            brandsId: value.brandsId,
            orderDetailId: key,
            sectionNo: value.sectionNo,
            warehouseNo: warehouseName
          })
        })
        this.request('get_good_spec_by_list', {
          data: {
            list: dataMap
          }
        }, true).then(res => {
          if (res.code == 1) {
            res.data.map(x => {
              this.list[x.orderDetailId].normList = x.list;
              for (let [key, value] of x.list.entries()) {
                if (this.list[x.orderDetailId].norms == value.norms) {
                  this.list[x.orderDetailId].inventoryCount = 1;
                }
              }
            })
          }
        })
      },
      //获取订单明细信息
      getStaffSalesOrderDetail(orderId) {
        this.request('StaffSalesOrderDetail', {
          ver: '1',
          ts: Date.parse(new Date()),
          data: {
            "obj": {
              "orderId": orderId,
              "userId": ""
            },
            "type": 1
          }
        }, true).then((res) => {
          this.staffFormData = res.data.stafforder[0];
          this.staffFormData.provinceCityArea = [this.staffFormData.province, this.staffFormData.city, this.staffFormData.county];
          this.list = res.data.stafforder[0].staffOrderDetailList;
          this.get_good_spec_by_list(this.list);
          this.$root.eventHub.$emit('edit_staff_sample_order_address',res.data.stafforder[0]);
        })
      },
      save_order_cart() {
        for (let item of this.list) {
          if (!item.count) {
            this.$Message.warning('请先填写购买数量');
            return;
          }
        }
        this.$refs['staffFormData'].validate((valid) => {
          if (valid) {
            let data = Util.deepClone(this.staffFormData);
            //处理省市区
            if (data.provinceCityArea && data.provinceCityArea.length > 0) {
              data.province = data.provinceCityArea[0];
              data.city = data.provinceCityArea[1];
              data.county = data.provinceCityArea[2];
              delete data.provinceCityArea;
            }
            data.totalMoney = 0;
            data.staffOrderDetailList.forEach(function(item) {
              data.totalMoney = data.totalMoney + Number(item.count) * Number(item.price);
              delete item.normList;
              item.check = true;
            });
            data.userId = this.userInfo.userId;

            if(this.type == 'edit'){
                delete data.content;
                delete data.id;
            }

            this.request('save_order_cart', {
              data: {
                obj: data
              }
            }, true).then(res => {
              if (res.code == 1) {
                this.$Message.success(res.msg);
              }
            })
          } else {
            this.$Message.error('请核对表单信息!');
            return false;
          }
        })
      },
      //收货信息改变时触发
      deliveryAddressChange(data) {
        let that = this;
          if (data) {
          this.staffFormData.phoneNo = data.phoneNo;
          this.staffFormData.consigne = data.consigne;
          this.staffFormData.province = data.province;
          this.staffFormData.city = data.city;
          this.staffFormData.county = data.county;
          this.staffFormData.address = data.address;
        }
      }
    },
    activated() {
      this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
      this.getBrandList();
      this.getFreightList();
      this.getLogisticList();
      if (this.type == 'edit') {
        this.getStaffSalesOrderDetail(this.orderId);
      } else {
        this.getOrderId();
        this.staffFormData.name = this.userInfo.userName;
        this.list = this.staffFormData.staffOrderDetailList;
      }
    },
    computed: {
      brandListFilter: function() {
        let that = this;
        if (this.list.length > 1 && this.list[0].warehouseNo) {
          return this.brandList.filter(function(brand) {
            return that.list[0].warehouseNo == brand.warehouseNo;
          })
        } else {
          return this.brandList;
        }
      },
      logisticsListFilter: function(){
        let data = [];
        if(this.staffFormData.staffOrderDetailList[0].warehouseName == '宇隆仓'){
            data = this.logisticsList.filter(x=>{
                return x.logisticTypeNo == '2' || x.logisticTypeNo == '-1' || x.logisticTypeNo == '8'
            })
        }else{
            data = this.logisticsList.filter(x=>{
                return x.logisticTypeNo == '2' || x.logisticTypeNo == '-1' || x.logisticTypeNo == '8'
            })
        }
        return data;
      },
      disabled:function(){
        if(!!this.staffFormData.staffOrderDetailList[0].warehouseName){
            return false;
        }else{
            return false;
        }
      }
    }
  }
</script>

<style>
  #staffSalesOrder textarea {
    width: 350px;
  }
  
  #staffSalesOrder .ivu-form-item-error-tip {
    display: none;
  }
</style>
