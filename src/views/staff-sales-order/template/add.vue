<template>
    <div class="background-color-white exhibition" id="staffSalesOrder">
    
        <Form :model="staffFormData" ref="staffFormData" :label-width="90" :rules="ruleValidate" inline label-position="right">
            <Row>
                <Col span="24" class="search margin-bottom-10">
                <Row>
                    <Col span="6">
                    <Form-item label="订单编号：">
                        <Input style="width:180px;" v-model="staffFormData.orderId" :readonly="true" placeholder="订单编号"></Input>
                    </Form-item>
                    </Col>
                    <Col span="6">
                    <Form-item label="申请人：" prop="name">
                        <Input v-model="staffFormData.name" placeholder="申请人名字"></Input>
                    </Form-item>
                    </Col>
                     <Col span="6">
                    <Form-item label="物流公司：" prop="logisticsCompany">
                        <Select style="width:162px" v-model="staffFormData.logisticsCompany" placeholder="请选择" @on-change="changeLogistic" >
                                <Option v-for="item in logisticsListFilter" :value="item.logistic_code" :key="item.logistic_code">{{ item.logisticType }}</Option>
                             </Select>
                    </Form-item>
                    </Col> 
                    <Col span="6">
                    <Form-item label="部门：" prop="department">
                        <!-- <div style="width:200px;height:32px;">
                            <treeselect :maxHeight="150" v-model="staffFormData.department" :multiple="false" :options="options" />
                        </div> -->
                        <Input v-model="staffFormData.department" placeholder="部门"></Input>
                    </Form-item>
                    </Col>
                </Row>
                <deliver_address_chose ref="deliveryAddressChose" @delivery-address-change="deliveryAddressChange"></deliver_address_chose>
                <Row>
                    <Col span="8">
                    <Form-item label="备注：">
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
            <Alert show-icon type="warning">本月还可以购买{{freight.count}}件</Alert>
        </Row>
        <Row class-name="margin-top-10">
            <Table :columns="columns" :border="true" :data="list"></Table>
        </Row>
        <Row class-name="margin-top-10" type="flex" justify="center" class="code-row-bg">
            <Button type="primary" @click="confirmCost">
                    确认费用
                  </Button>
        </Row>
    
        <!--添加 Modal 对话框-->
        <Modal v-model="confirmModal" title="费用明细" :width="750" class-name="customize-modal-center">
            <div>
                <Row class="margin-bottom-10">
                    <div class="ivu-table-wrapper">
                        <div class="ivu-table ivu-table-border">
                            <div class="ivu-table-header">
                                <table cellspacing="0" cellpadding="0" border="0" style="width: 700px;">
                                    <colgroup>
                                        <col width="200">
                                        <col width="150">
                                        <col width="110">
                                        <col width="110">
                                        <col width="150">
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
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="ivu-table-body" style="">
                                <table cellspacing="0" cellpadding="0" border="0">
                                    <colgroup>
                                        <col width="200">
                                        <col width="150">
                                        <col width="110">
                                        <col width="110">
                                        <col width="147">
                                    </colgroup>
                                    <tbody class="ivu-table-tbody">
                                        <tr v-for="(item,index) in listPay" class="ivu-table-row">
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
                                            <td v-if="index==0" rowspan="2" class="ivu-table-column-center">
                                                <div class="ivu-table-cell">
                                                    <span>{{staffFormData.totalFreight}}</span>
                                                </div>
                                            </td>
                                            <td class="ivu-table-column-center">
                                                <div class="ivu-table-cell">
                                                    <span>{{item.tax}}</span>
                                                </div>
                                            </td>
                                            <td class="ivu-table-column-center">
                                                <div class="ivu-table-cell">
                                                    <Icon color="red" size="25" type="social-yen"></Icon>
                                                    <span style="color:red;font-size:25px;">{{item.total.toFixed(2)}}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
    
                </Row>
                <span>温馨提示：</span>
                <Alert type="warning">内购现已支持支付宝在线支付,请提交订单后到详情页面支付,在支付过程中请勿关闭浏览器</Alert>
            </div>
            <div slot="footer">
                <Button type="default" @click="cancel">取消</Button>
                <Button type="primary" @click="confirmSave()" style="margin-left: 8px">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    function StaffFormData() {
        return {
            orderId: '',
            address: '',
            department: '',
            // logisticCenter: '45', //物流公司code
            // logisticsCompany: 'EMS', //物流公司名字
            // logisticType: 'EMS经济快递',
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
            type: 'NG',
            alipayTax: 0,
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
    
    import Util from 'libs/util';
    import deliver_address_chose from '@/components/DeliverAddressChose'
    export default {
        name: 'staffsalesorder_add',
        components: {
            deliver_address_chose
        },
        props: {
            orderType: String //订单类型
        },
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
                status: -3,
                columnsPay: [{
                        title: '付款账号',
                        key: 'payuser',
                        align: 'center',
                    },
                    {
                        title: '应付金额',
                        key: 'sum',
                        align: 'center',
                    }
                ],
                columns: [{
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
                                        transfer:true
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
                                        transfer:true
                                    },
                                    on: {
                                        'on-change': (value) => {
                                            this.list[params.index].norms = value;
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
                                            this.list[params.index].sum = Number(event.target.value) * Number(params.row.price);
                                            this.getTotalFreight();
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
                    // {
                    //     title: '支付宝账号',
                    //     key: 'payAccount',
                    //     minWidth: 150,
                    //     align: 'center',
                    // }
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
                    department: [{
                        required: true,
                        message: '',
                        trigger: 'blur'
                    }],
                    logisticsCompany: [{
                        required: true,
                        message: '',
                        trigger: 'blur'
                    }],
                    orderType: [{
                        required: true,
                        message: '',
                        trigger: 'blur'
                    }]
                },
                addressChoseData: [], //省市区选择
                list: [], //表格数据源
                listPay: [], //付款明细表格数据
                brandList: [], //品牌列表
                confirmModal: false, //明细弹出框
                logisticsList: [], //物流公司列表
                freight: [], //省份运费
                options: [{
                    id: '研发部',
                    label: '研发部'
                }],
                defaultList: [
    
                ],
                imgUrl: '',
                visible: false,
                uploadList: []
            }
        },

        methods: {
            getLogisticList() {
                this.request('GetLogisticListNew', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    data: {
                        order_type: "NG"
                    }
                }).then((res) => {
                    if (res.code == '1') {
                        this.logisticsList = res.data;
                    }
                })
            },
            changeAddress() {
                this.getTotalFreight();
            },
            changeLogistic(values) {
                this.logisticsList.forEach(x => {
                    if (x.logistic_code == values) {
                        this.staffFormData.logisticCenter = x.logisticTypeNo
                        this.staffFormData.logisticType = x.logisticType;
                    }
                })
                this.getTotalFreight();
            },
            getFreightList() {
                this.request('GetFreightListNew', {
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
                let row = this.list[index];
                this.list[index].normList = []
                this.brandList.filter(x => {
                    if (x.id == row.brandsId) {
                        // if(this.temp_warehouse != x.warehouseName && index == 0){
                        //     this.temp_warehouse = x.warehouseName;
                        //     this.staffFormData.logisticsCompany = '';
                        //     this.staffFormData.logisticCenter = '';
                        // }
                        row.warehouseName = x.warehouseName;
                        row.warehouseNo = x.warehouseNo;
                        row.payAccount = x.payAccount;
                        row.brands = x.brands;
                        row.sectionNo='';
                        row.norms='';
                        row.commodityCode='';
                        row.count=0;
                        row.inventoryCount='';
                        row.price='';
                        row.sum='';
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
                        this.getTotalFreight();
                    }
                })
            },
            getGoodSpecList(params, sectionNo) {
                let sectionNoData = Util.Trim(sectionNo);
                if (!sectionNoData) {
                    return;
                }
                let row = params.row;
                var tempList = this.list[params.index]
                tempList.norms = '';
                tempList.commodityCode = '';
                tempList.inventoryCount = '';
                tempList.count = 0
                tempList.price = '';
                tempList.sum = 0;
                this.request('GetGoodSpecList', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    methods: 'get_good_spec_list',
                    data: {
                        obj: {
                            brandId: row.brandsId,
                            goodsNo: sectionNoData.toLocaleUpperCase(),
                            warehouseNo: row.warehouseNo,
                        },
                        type:'NG'
                    }
                }, '正在查询...').then((res) => {
                    if (res.code == '1') {
                        this.list[params.index].normList = res.data;
                        this.$Message.success('查询规格名称成功');
                    }else{
                        this.list[params.index].normList = []
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
                this.list.push(StaffFormData().staffOrderDetailList[0]);
            },
            //确认费用
            confirmCost() {
    
                 for(let item of this.list){
                    if(!item.count){
                        this.$Message.warning('请先填写购买数量');
                        return;
                    }
                 }
                this.$refs['staffFormData'].validate((valid) => {
                    if (valid) {
                        this.confirmModal = true;
                    } else {
                        this.$Message.error('请核对表单信息!');
                        return false;
                    }
                })
    
                let vm = this;
                //免除邮费处理
                let totalCount = 0;
                vm.list.forEach(function(item) {
                    totalCount += Number(item.count);
                })
                if (vm.staffFormData.address.indexOf('农业大厦') >= 0 || totalCount >= 2) {
                    vm.staffFormData.totalFreight = 0;
                }
                this.listPay = [];
                vm.staffFormData.totalMoney = 0;
                //合并支付宝付款信息
                let payObj = {};
                this.staffFormData.staffOrderDetailList.map(function(item) {
                    vm.staffFormData.totalMoney += item.sum;
                    if (item.payAccount in payObj) {
                        payObj[item.payAccount] += item.sum;
                    } else {
                        payObj[item.payAccount] = item.sum;
                    }
                })
    
                for (let pay in payObj) {
                    this.listPay.push({
                        payuser: pay,
                        sum: payObj[pay]
                    });
                }
    
    
                let length = this.listPay.length;
                vm.staffFormData.alipayTax = 0;
                this.listPay.forEach((pay) => {
                    pay.total = Number(pay.sum) + Number(vm.staffFormData.totalFreight) / length;
                    pay.tax = (pay.total * 0.0055).toFixed(2);
                    pay.total = Number(pay.tax) + pay.total;
                    vm.staffFormData.alipayTax = vm.staffFormData.alipayTax + Number(pay.tax);
                })
    
                vm.staffFormData.totalMoney = vm.staffFormData.totalMoney + Number(vm.staffFormData.totalFreight);
                vm.staffFormData.totalMoney = Number(vm.staffFormData.totalMoney).toFixed(2)
            },
            cancel() {
                this.confirmModal = false;
            },
            //计算邮费
            getTotalFreight() {
                const that = this;
                //获取省份编码
                if (this.freight && this.freight.freight) {
                    for (let pro of this.freight.freight) {
                        if (pro.province.indexOf(that.staffFormData.province) >= 0) {
                            that.staffFormData.province_code = pro.province_code;
                            break;
                        }
                    }
                }
                if (!this.staffFormData.province_code) {
                    return;
                }
                
                if (!this.staffFormData.logisticCenter) {
                    return;
                }
    
                let data = [];
    
                this.list.forEach(function(item) {
                    if (item.commodityCode && item.count) {
                        data.push({
                            logistic_code: that.staffFormData.logisticsCompany,
                            num: item.count,
                            order_code: that.staffFormData.orderId,
                            spec_no: item.commodityCode,
                            state_code: that.staffFormData.province_code
                        })
                    }
                })

                if (data.length <= 0) {
                    return;
                }
                
                this.request('GetTotalFright', {
                    data: {
                        list: data
                    }
                }, '正在计算运费').then((res) => {
                    if (res.code == 1) {
                        that.staffFormData.totalFreight = Number(res.data.sum_freight).toFixed(2);
                    }
                })
            },
            //保存提交
            confirmSave() {
    
                let data = Util.deepClone(this.staffFormData);
    
                delete data.provinceCityArea;
                delete data.nameShow;
                delete data.remarkShow;
                delete data.province_code;
                data.logisticsCompany = data.logisticType;
                delete data.logisticType;
                data.userId = this.userInfo.userId;
                data.staffOrderDetailList.forEach(function(item) {
                    delete item.normList;
                    item.check = true;
                });

                this.request('StaffSalesOrderAdd', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    data: {
                        obj: data,
                        type: 1
                    }
                }, true).then((res) => {
                    if (res.code == '1') {
                        this.$Message.success(res.msg);
                        this.confirmModal = false;
                        this.$root.eventHub.$emit('closePageFromOtherPage', 'staffsalesorder_add'); //关闭新增页面
                        this.$router.push({
                            name: 'staffsalesorder_detail',
                            params: {
                                orderId: this.staffFormData.orderId,
                                pageType: 'NG'
                            }
                        });
                    } else {
                        this.$Message.warning(res.msg);
                    }
                })
            },
            //订单类型改变
            orderTypeChange(value) {
                this.getOrderId();
            },
            //自动生成orderId
            getOrderId() {
                let type = 'NG';
                let len = String(Date.parse(new Date())).length;
                let ts = String(new Date().getTime()).substr(len - 6, 6)
                this.staffFormData.orderId = type + Util.currentDate() + ts;
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
                    this.getTotalFreight();
                }
            }
        },
        mounted() {
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            this.getOrderId();
            this.getFreightList();
            this.getBrandList();
            this.getLogisticList();
            this.list = this.staffFormData.staffOrderDetailList;
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
                data = this.logisticsList.filter(x=>{
                    return x.logistic_code == 'POST' //邮政小包
                })
                return data;
            },
            disabled:function(){
                if(!!this.staffFormData.staffOrderDetailList[0].warehouseName){
                    return false;
                }else{
                    return true;
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

