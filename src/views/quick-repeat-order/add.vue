<style>
#quick_repeat_order_add .commonWidth {
    display: inline-block;
    font-size: 12px;
}

#quick_repeat_order_add .ivu-form-item-error-tip {
    display: none;
}
</style>
<template>
<div class="background-color-white exhibition" id="quick_repeat_order_add">
    <Row>
        <Form :model="formSearch" class="search" ref="formSearch" :label-width="80" inline label-position="right" :rules="rules" @keydown.native.enter.prevent="search">
            <Card>
                <Form-item label="销售取值：">
                    <DatePicker v-model="formSearch.startDate" size="small" type="date" @on-change="changeDate" placeholder="起始时间" style="width: 120px" :options="pickerOptions">
                    </DatePicker>
                </Form-item>
                <Form-item :label-width="1">
                    <DatePicker v-model="formSearch.endDate" size="small" type="date" @on-change="changeDate" placeholder="结束时间" style="width: 120px" :options="pickerOptions">
                    </DatePicker>
                </Form-item>
                <Form-item label="款号：" prop="sectionNo" :label-width="180">
                    <Input v-model="formSearch.sectionNo" style="width: 120px" placeholder="请输入款号" size="small" @on-blur='get_brand_by_sectionNo'></Input>
                </Form-item>

                
                <Form-item label="返单颜色：">
                    <Select style="width:120px" size="small" placeholder="请选择返单颜色" @on-change="changeColor" multiple v-model="selectedColor">
                        <Option v-for="item in colorList" :value="item" :key="item">
                            {{ item }}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item :label-width="20">
                    <Button type="primary" @click="search('formSearch')" size="small">查询</Button>
                    <Button type="default" @click="handleReset('formSearch')" size="small">重置</Button>
                    <Button type="primary" @click="submit('add')" size="small">提交</Button>
        <Button type="primary" @click="submit('save')" size="small">草稿</Button>
                </Form-item>
                <!-- <Row class="margin-top-20" style="text-align: center">
    </Row> -->
                <br>
                <Form-item :label-width="6">
                    <RadioGroup v-model="quick_search" @on-change="changeRadio">
                        <Radio label="threeDay">
                            <span>近3天</span>
                        </Radio>
                        <Radio label="sevenDay">
                            <span>近7天</span>
                        </Radio>
                        <Radio label="fifteenDay">
                            <span>近15天</span>
                        </Radio>
                        <Radio label="oneMonth">
                            <span>近1个月</span>
                        </Radio>
                        <Radio label="threeMonth">
                            <span>近3个月</span>
                        </Radio>
                        <Radio label="history">
                            <span>自定义</span>
                        </Radio>
                    </RadioGroup>
                </Form-item>
                <Form-item label="品牌：" :label-width="117">
                    <b>{{formSearch.brandName}}</b>
                </Form-item>
                <Form-item label="品名：" :label-width='80'>
                    <b>{{formSearch.className}}</b>
                </Form-item>
                <Form-item label="销售季节：" :label-width='100'>
                    <b>{{formSearch.season}}</b>
                </Form-item>

            </Card>
        </Form>
    </Row>
    
    <Row class="margin-top-8">
        <Form :model="Form" ref="Form" :label-width="80" inline label-position="right">
            <Col span="24">
            <Card>
                <div slot="title">下单录入
                    <span style="padding-left:20px;cursor:pointer;font-size:15px" @click="showDrawer">
                <!-- <Icon type="md-help" /> -->
                <i class="iconfont" style="color:#1296db;font-size:16px"> &#xe6d7;</i>
                <span style="font-size:12px">计算公式</span>
              </span>
                </div>
                
                <Row class="margin-bottom-10">
                    <Col span="24" class="commonWidth">
                    <b style="width:120px;display: inline-block">款号：{{formSearch.sectionNo}}</b>
                    <b style="width:120px;display: inline-block">总销量：{{this.totalSales}}</b>
                    <b class="commonWidth margin-bottom-10">返单总数：</b>
                    <InputNumber :step="10" v-model="formSearch.totalQty" icon="ios-clock-outline" size="small"></InputNumber>

                    <div style="display: inline-block;margin-left:10px;">
                        <b>
                            <span>下单总数：</span>{{ this.placing_sum }}
                            <span style="display: inline-block;margin-left:30px;">差异数：</span><span style="color:red">{{ Math.abs(this.placing_sum - this.formSearch.totalQty) }}</span>
                        </b>
                        <b style="padding-left:20px" class="commonWidth margin-bottom-10">要求入库时间：</b>
                        <DatePicker v-model="formSearch.planStockinTime" size="small" type="date" placeholder="入库时间" style="width: 120px">
                        </DatePicker>

                        <b style="width:120px;display: inline-block;margin-left:20px">部门：{{this.planform}}</b>
                        <b style="width:120px;display: inline-block;margin-left:20px">剩余金额：{{this.surplusMoney}}</b>
                        <Button type="primary" @click="getSurplusMoney(getNewMoney)" size="small">同步最新</Button>
                    </div>

                    <br>
                    <div class="margin-top-8">
                        <div v-for="item in color_data" class="margin-right-10 margin-top-8">
                            <Row class="margin-bottom-10">
                                <Col span="4">
                                <b>
                                    <span>颜色: {{item.name}}</span>
                                </b>
                                </Col>
                                <Col span="4">
                                <b>
                                    <span>已销占比: </span>
                                    <span style="color: red">{{Math.round(item.scale*1000) / 10}}%</span>
                                </b>
                                </Col>
                                <Col span="4">
                                <b>
                                    <span>总库存: </span>
                                    <span style="color: red">{{item.stockSum}}</span>
                                </b>
                                </Col>
                                <Col span="4" class="commonHeight">
                                <b>
                                    <span>下单量: </span>
                                </b>
                                <InputNumber size="small" :step="10" v-model="Form[item.name]" :readonly="item.isread" style="width:60px" @on-change="changeColorNumber(item.name,Form[item.name])">
                                </InputNumber>
                                <Icon type="md-unlock" style="cursor: pointer" @click.native="clickColor(item.name)" v-if="!item.isread"></Icon>
                                <Icon type="md-lock" style="cursor: pointer" @click.native="clickColor(item.name)" v-else></Icon>
                                </Col>
                                <Col span="4">
                                <b>
                                    <span>下单后库存量: </span>
                                    {{ Form[item.name] + item.stockSum }}
                                </b>
                                </Col>
                                <Col span="4" style="height: 24px;line-height: 24px;">
                                <b>
                                    <span>下单后库存比例: </span>
                                    <span style="color: red">{{item.after_placing_orders}}%</span>
                                </b>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    </Col>
                    <Col span="24">
                    <Table size="small" :columns="columns" :data="Data" highlight-row></Table>
                    <Spin size="large" fix v-if="spinShow"></Spin>

                    </Col>
                </Row>
            </Card>
            </Col>
        </Form>
    </Row>
    <Modal v-model="visibleYes" title="是否下单">
        <div style="text-align:center">
            <div>当前剩余金额：{{originPrice}}</div>
            <div>该单金额：{{orderPrice}}</div>
            <div>下单后剩余金额：{{afterPrice}}</div>
        </div>
        <div slot="footer">
            <Button type="primary" @click="saveVisible">确认</Button>
            <Button type="default" @click="cancelVisible">取消</Button>
        </div>
    </Modal>
     <Drawer title="计算公式" :closable="false" v-model="drawerVisible" width="15">
      <p>1. 往期销售比例 :某一规格的往期销量和=用该款号找对应的品类，在去年同时间段对应的所有该品类下的款号，计算某一规格对应的所有销量和
某一规格的往期销售比例=某一规格的往期销量和/当页所有规格的往期销量和</p>
      <p>2. 销售比例 :按照选择的“销售取值”日期期间，计算出每一个规格在选择的时间段内的总销量，该值=某一规格的总销量/该款的总销量，特别说明：当某一SKU出现断码时，销售比例计算需要去掉断码的天数（不含断码当天）</p>
      <p>3. 返单比例 :初始默认值等于销售比例，当修改下单数量后，该值=下单数量/所有SKU下单数量求和</p>
      <p>4. 下单后库存量=总库存+下单数量</p>
      <p>5. 下单后库存比例=该SKU的下单后库存量/该款的下单后库存量</p>
    </Drawer>
</div>
</template>

<script>
import echarts from 'echarts';
import {
    mapState
} from 'vuex';
import Util from 'libs/util'

function formSearch() {
    return {
        brandName: '', //	品牌
        brandId: '', //	品牌id
        created: '', //	下单人		当前用户名
        factoryId: '', //  加工厂id
        factoryName: '', //  加工厂
        className: '', //  品名
        sectionNo: '', //  款号
        orderType: 'FD', //  订单类型		FD：返单
        planStockinTime: '', //	要求入库时间		格式：YYYY-MM-DD
        processType: '', //	加工类型
        startDate: '',
        endDate: '',
        totalQty: 0
    }
}

export default {
    name: "quickrepeatorder_add",
    desc: '快捷返单新增页面',
    props: ['type'],
    data() {
        return {
            getSeasonNow:'',//当前季节
            getNewMoney:[],//剩余金额列表
            drawerVisible:false,
            orderPrice:'',//该单金额
            originPrice:'',//当前剩余金额
            afterPrice:'',//下单后剩余金额
            checkOrderPriceList:[],//校验下单金额需要的遍历用的数组
            surplusMoney: '', //剩余金额
            totalSales: '', //总销量
            planform: '', //部门
            PostType: '',
            visibleYes: false,
            saveData: [],
            formSearch: formSearch(),
            columns: [{
                    title: '序号',
                    type: 'index',
                    minWidth: 60
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
                    minWidth: 100,
                    sortable: true
                },
                {
                    title: '规格',
                    key: 'norms',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '商品条码',
                    key: 'commodityCode',
                    align: 'center',
                    minWidth: 120
                },
                {
                    title: '往期销售比例',
                    key: 'salesPercentage',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        console.log(params.row.salesPercentage,'././././././.')
                        return h('span', params.row.salesPercentage != 0 ? (params.row.salesPercentage * 100).toFixed(2) +'%' : 0 +'%')
                    }
                },
                {
                    title: '销售比例',
                    key: 'saleRatio',
                    align: 'center',
                    minWidth: 120
                },
                {
                    title: '返单比例',
                    key: 'reorderRate',
                    align: 'center',
                    minWidth: 120
                },
                {
                    title: '在途库存',
                    key: 'stockOnwayNum',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('span', params.row.stockOnwayNum)
                    }
                },
                {
                    title: '现有库存',
                    key: 'stockNum',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('span', params.row.stockNum)
                    }
                },
                {
                    title: '总库存',
                    key: 'stockSum',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        // if(this.type == 'edit'){
                        //     return h('span',params.row.stockSum - params.row.qty)
                        // }
                        return h('span', params.row.stockSum)
                    }
                },
                {
                    title: '活动预计占用库存',
                    key: 'subscribeNum',
                    align: 'center',
                    minWidth: 120
                },
                {
                    title: '下单数量',
                    key: 'qty',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('Input', {
                            props: {
                                value: this.Data[params.index].qty,
                                size: 'small'
                            },
                            on: {
                                'on-blur': (event) => {
                                    let reg = /^\d+$/;
                                    if (reg.test(event.target.value)) {
                                        this.Data[params.index].qty = parseInt(event.target.value);
                                    } else {
                                        this.$Message.warning('只允许输入数字！');
                                        this.Data[params.index].qty = 0;
                                    }
                                    this.$nextTick(() => {
                                        let Form = Util.deepClone(this.Form);

                                        let qty_color = [];
                                        this.Data.map(x => {
                                            let flag = false;
                                            qty_color.map(y => {
                                                if (x.color == y.color) {
                                                    y.qty += x.qty;
                                                    flag = true;
                                                }
                                            })
                                            if (!flag) {
                                                qty_color.push({
                                                    color: x.color,
                                                    qty: x.qty
                                                })
                                            }
                                        })
                                        this.Data.map(x => {
                                            this.color_data.map(k => {
                                                if (x.color == k.name) {
                                                    qty_color.map(j => {
                                                        if (x.color == j.color) {
                                                            if (parseInt(k.stockSum) + parseInt(j.qty) <= 0) {
                                                                x.inventoryRatio = '0%';
                                                            } else {
                                                                x.inventoryRatio = Math.round((parseInt(x.qty) + parseInt(x.stockSum)) / (parseInt(k.stockSum) + parseInt(j.qty)) * 100) + '%';
                                                            }
                                                        }
                                                    })
                                                }
                                            })
                                        })
                                        //test
                                        this.Data.map(x => {
                                            this.color_data.map(k => {
                                                if (x.color == k.name) {
                                                    qty_color.map(j => {
                                                        if (x.color == j.color) {
                                                            console.log(x.qty, x.stockSum, k.stockSum, j.qty, '999999999999999')
                                                            if (parseInt(j.qty) <= 0) {
                                                                x.reorderRate = '0%';
                                                            } else {
                                                                x.reorderRate = Math.round((parseInt(x.qty)) / (parseInt(j.qty)) * 100) + '%';
                                                            }
                                                        }
                                                    })
                                                }
                                            })
                                        })

                                        this.$set(this.Data, params.index, this.Data[params.index]);
                                    })
                                }
                            }
                        })
                    }
                },
                {
                    title: '下单后库存量',
                    key: 'inventorySum',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        // if(this.type == 'edit'){
                        //     return h('span',params.row.stockSum)
                        // }
                        return h('span', params.row.stockSum + params.row.qty)
                    }

                },
                {
                    title: '下单后库存比例',
                    key: 'inventoryRatio',
                    align: 'center',
                    minWidth: 120
                },
                {
                    title: '备注',
                    key: 'detailRemark',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('Input', {
                            props: {
                                type: 'text',
                                value: this.Data[params.index].detailRemark,
                                size: 'small'
                            },
                            on: {
                                input: (val) => {
                                    this.Data[params.index].detailRemark = val;
                                }
                            }
                        })
                    }
                },
            ],
            colorList: [], // 临时颜色列表
            selectedColor: [], // 选中的颜色
            quick_search: '',
            Data: [],
            legend_data: [],
            color_data: [],
            norms_data: [],
            Form: {},
            saleNumCount: 0,
            stockSumCount: 0,
            placing_sum: 0, //下单总数
            rules: {
                // brandId: [
                //     {required: true, message: '', trigger: 'change'}
                // ],
                sectionNo: [{
                    required: true,
                    message: '',
                    trigger: 'change'
                }]
            },
            TempFormSearch: {},
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6 - 1000 * 60 * 60 * 24
                }
            },
            params: {},
            isreset: false,
            spinShow: false
        }
    },
    computed: {
        ...mapState({
            brandList: state => state.quickRepeatOrder.brands_by_userId
        })
    },
    watch: {
        quick_search(newVal, oldVal) {
            let date = new Date();
            this.formSearch.endDate = Util.dateFormat(new Date(date.getTime() - 1000 * 60 * 60 * 24), 'yyyy-MM-dd');
            switch (newVal) {
                case 'threeDay':
                    this.formSearch.startDate = Util.cutDate(new Date(), 3);
                    break;
                case 'sevenDay':
                    this.formSearch.startDate = Util.cutDate(new Date(), 7);
                    break;
                case 'fifteenDay':
                    this.formSearch.startDate = Util.cutDate(new Date(), 15);
                    break;
                case 'oneMonth':
                    this.formSearch.startDate = Util.cutDate(new Date(), 30);
                    break;
                case 'threeMonth':
                    this.formSearch.startDate = Util.cutDate(new Date(), 90);
                    break;
                case 'history':
                    this.formSearch.startDate = '';
                    this.formSearch.endDate = '';
                default:
                    break;
            }
        },
        //返单总数失去焦点后计算
        'formSearch.totalQty': {
            handler(curVal, oldVal) {
                let isread_count = 0; //已经锁住总数
                let notread_count = 0; //未锁住总数
                let scale = 0; //销售比例
                let Form = Util.deepClone(this.Form); //克隆颜色Form表单
                this.color_data.map(x => {
                    if (x.isread) {
                        for (let y in this.Form) {
                            if (y == x.name) {
                                isread_count += this.Form[y];
                            }
                        }
                    } else {
                        notread_count += x.value;
                        scale += Math.round(x.scale);
                    }
                })
                this.color_data.map(x => {
                    for (let y in Form) {
                        if (x.name == y && !x.isread) {
                            let totalQty = Util.deepClone(this.formSearch.totalQty);
                            this.$set(Form, y, Math.round((totalQty + this.stockSumCount) * x.scale - x.stockSum))
                        }
                    }
                })
                this.Form = Form;

                let count = 0;
                for (let y in this.Form) {
                    if (this.Form[y] < 0) {
                        this.Form[y] = 0;
                    } else {
                        count += this.Form[y];
                    }
                }
                //计算颜色下单数量
                for (let y in this.Form) {
                    if (this.Form[y] > 0) {
                        this.Form[y] = Math.round(this.formSearch.totalQty * (this.Form[y] / count) / 10) * 10;
                    }
                }

                let sum = 0;
                for (let x in this.Form) {
                    sum += this.Form[x];
                }
                this.placing_sum = sum;

                for (let y in this.Form) {
                    this.color_data.map(x => {
                        if (x.name == y) {
                            x.after_placing_orders = Math.round((this.Form[y] + x.stockSum) / (this.stockSumCount + sum) * 1000) / 10;
                        }
                    })
                }

                this.$nextTick(() => {
                    this.Data.map(x => {
                        this.color_data.map(y => {
                            if (x.color == y.name) {
                                let saleRatio = x.saleRatio.split('%');
                                let count = ((this.Form[y.name] + y.stockSum) * (saleRatio[0] / 100) - x.stockSum) / 10;
                                x.qty = count <= 0 ? 0 : Math.round(count) * 10;
                            }
                        })
                    })
                    let stockSum = 0;
                    for (let y in Form) {
                        stockSum += Form[y];
                    }
                    this.color_data.map(x => {
                        stockSum += x.stockSum
                    })
                    let qty_color = [];
                    this.Data.map(x => {
                        let flag = false;
                        qty_color.map(y => {
                            if (x.color == y.color) {
                                y.qty += x.qty;
                                flag = true;
                            }
                        })
                        if (!flag) {
                            qty_color.push({
                                color: x.color,
                                qty: x.qty
                            })
                        }
                    })
                    this.Data.map(x => {
                        qty_color.map(y => {
                            if (x.color == y.color) {
                                if (y.qty == 0) {
                                    x.qty = 0;
                                } else {
                                    x.qty = Math.round(this.Form[y.color] * (x.qty / y.qty) / 10) * 10;
                                }
                            }
                        })
                    })
                    qty_color = [];
                    this.Data.map(x => {
                        let flag = false;
                        qty_color.map(y => {
                            if (x.color == y.color) {
                                y.qty += x.qty;
                                flag = true;
                            }
                        })
                        if (!flag) {
                            qty_color.push({
                                color: x.color,
                                qty: x.qty
                            })
                        }
                    })
                    this.Data.map(x => {
                        this.color_data.map(k => {
                            if (x.color == k.name) {
                                qty_color.map(j => {
                                    if (x.color == j.color) {
                                        if (parseInt(k.stockSum) + parseInt(j.qty) <= 0) {
                                            x.inventoryRatio = '0%';
                                        } else {
                                            x.inventoryRatio = Math.round((parseInt(x.qty) + parseInt(x.stockSum)) / (parseInt(k.stockSum) + parseInt(j.qty)) * 100) + '%';
                                        }
                                    }
                                })
                            }
                        })
                    })
                    //test
                    this.Data.map(x => {
                        this.color_data.map(k => {
                            if (x.color == k.name) {
                                qty_color.map(j => {
                                    if (x.color == j.color) {
                                        console.log(x.qty, x.stockSum, k.stockSum, j.qty, '999999999999999')
                                        if (parseInt(j.qty) <= 0) {
                                            x.reorderRate = '0%';
                                        } else {
                                            x.reorderRate = Math.round((parseInt(x.qty)) / (parseInt(j.qty)) * 100) + '%';
                                        }
                                    }
                                })
                            }
                        })
                    })
                })
            },
            deep: true
        },
    },
    methods: {
        showDrawer(){
                this.drawerVisible=true
             },
        get_brand_by_sectionNo() {
            if (!!this.formSearch.sectionNo) {
                this.request('get_brand_by_sectionNo', {
                    data: {
                        sectionNo: this.formSearch.sectionNo.toLocaleUpperCase()
                    }
                }).then(res => {
                    if (res.code == 1) {
                        this.formSearch.brandName = res.data.BRAND_NAME;
                        this.formSearch.brandId = res.data.BRAND_ID;
                        this.getdepartment()
                    }
                })
            }
        },
        //获取部门
        getdepartment() {
            if (!!this.formSearch.sectionNo) {
                this.request('get_goods_department', {
                    data: {
                        goodsNo: this.formSearch.sectionNo.toLocaleUpperCase()
                    }
                }).then(res => {
                    if (res.code == 1) {
                        this.planform = res.data.departmentName
                    }
                })
            }
        },
        search() {
            var data = Util.deepClone(this.formSearch);
            if (this.isFirst > 1) {
                this.formSearch.totalQty = 0;
            }
            data.startDate = !!data.startDate ? Util.dateFormat(this.formSearch.startDate, 'yyyy-MM-dd') : '';
            data.endDate = !!data.endDate ? Util.dateFormat(this.formSearch.endDate, 'yyyy-MM-dd') : '';
            this.spinShow = true;
            this.request('get_reorder_goods', {
                data: {
                    brandId: data.brandId,
                    sectionNo: data.sectionNo.toLocaleUpperCase(),
                    startDate: data.startDate,
                    endDate: data.endDate,
                    userId: JSON.parse(window.sessionStorage.getItem('userinfo')).userId,
                    shortDay:1
                }
            }).then(res => {
                console.log(res.data.data[0].children.sort(creatCompare("color")))

                function creatCompare(propertyName) {
                    return function (obj1, obj2) {
                        var value1 = obj1[propertyName];
                        var value2 = obj2[propertyName];
                        console.log(obj1)
                        if (value1 === value2) {
                            return obj1.norm - obj2.norm
                        }
                        if (value1 < value2) {
                            return -1
                        } else if (value1 > value2) {
                            return 1
                        } else {
                            return 0
                        }
                    }
                }
                if (res.code == 1) {
                    if (res.data.data[0].children.length <= 0) {
                        this.$Message.warning('该款号下无数据！');
                        this.spinShow = false;
                        return false;
                    }
                    if (this.type == 'edit') {
                        let Form = Util.deepClone(this.Form);
                        let obj = {};
                        this.TempFormSearch.reorderDetail.map(x => {
                            if (x.color in obj) {
                                obj[x.color] += x.qty
                            } else {
                                obj[x.color] = x.qty
                            }
                        })
                        for (let y in obj) {
                            Form[y] = obj[y];
                        }
                        this.Form = Form;

                        res.data.data[0].children.map(x => {
                            this.TempFormSearch.reorderDetail.map(y => {
                                if (x.commodityCode == y.commodityCode) {
                                    this.$set(y, 'stockNum', x.stockNum);
                                    this.$set(y, 'stockOnwayNum', x.stockOnwayNum)
                                }
                            })
                        })
                        this.Data = this.TempFormSearch.reorderDetail;
                    }

                    //将品名和销售季节渲染到页面
                    if (typeof (res.data.data[0].children) == 'object' && !isNaN(res.data.data[0].children.length)) {
                        this.formSearch.goodsName = res.data.data[0].children[0].goodsName;
                        this.formSearch.season = res.data.data[0].children[0].season;
                        this.totalSales = res.data.data[0].saleNum
                        this.getNewMoney = res.data.data[0]
                        this.getSurplusMoney(res.data.data[0]) //获取剩余金额
                        this.checkOrderPriceList = res.data.data[0].children
                    }
                    //获取返单颜色列表（去重）
                    this.colorList = [];
                    res.data.data[0].children.map(x => {
                        if (!!x.color && this.colorList.indexOf(x.color) == -1) {
                            this.colorList.push(x.color);
                        }
                    })
                    this.colorList.unshift('全部');
                    this.formSearch.className = res.data.data[0].children[0].className;

                    //新增快捷返单时赋值
                    if (this.type != 'edit' || this.isFirst > 1) {
                        this.Data = res.data.data[0].children;
                    }

                    //根据选中返单颜色获取详细列表
                    if (this.selectedColor.length > 0 && this.selectedColor != '全部') {
                        let Data = [];
                        this.selectedColor.map(x => {
                            this.Data.map(y => {
                                if (x == y.color) {
                                    Data.push(y);
                                }
                            })
                        })
                        console.log(Data,)
                        this.Data = Data;
                        let newData = []
                        this.selectedColor.map(x => {
                            res.data.data[0].children.map(y => {
                                if (x == y.color) {
                                    newData.push(y);
                                }
                            })
                        })
                        this.checkOrderPriceList = newData //校验下单金额需要的遍历用的数组
                        console.log(this.checkOrderPriceList,'.......')
                    }

                    //定义颜色、款号   图表中使用
                    this.legend_data = [];
                    this.color_data = [];
                    this.norms_data = [];
                    this.Data.map(x => {
                        x.detailRemark = '';
                        this.legend_data.push(x.norms);
                        this.norms_data.push({
                            name: x.norms,
                            value: x.saleNum
                        })
                    })

                    //统计各个颜色销售数量
                    let obj = {},
                        color_data = [];
                    this.Data.map(x => {
                        if (x.color in obj) {
                            obj[x.color] += x.saleNum
                        } else {
                            obj[x.color] = x.saleNum
                        }
                    })
                    for (let y in obj) {
                        color_data.push({
                            name: y,
                            value: obj[y]
                        });
                        this.color_data.push({
                            name: y,
                            value: obj[y],
                            isread: false,
                            stockSum: 0,
                            after_placing_orders: 0, //下单后比例
                        })
                    }
                    color_data.map(x => {
                        this.legend_data.push(x.name);
                    })
                    //统计各个颜色库存数量
                    this.color_data.map(x => {
                        this.Data.map(y => {
                            if (x.name == y.color) {
                                if (this.type != 'edit') {
                                    x.stockSum += y.stockSum
                                } else {
                                    x.stockSum += y.stockSum - y.qty;
                                }
                            }
                        })
                    })

                    let saleNum_color_sum = [];
                    //计算每条详细的销售比例
                    this.Data.map(x => {
                        let flag = false;
                        saleNum_color_sum.map(z => {
                            if (z.color == x.color) {
                                z.saleNum += x.saleNum;
                                flag = true;
                            }
                        })
                        if (!flag) {
                            saleNum_color_sum.push({
                                color: x.color,
                                saleNum: x.saleNum
                            })
                        }
                        this.color_data.map(y => {
                            if (x.color == y.name) {
                                if (y.value == 0) {
                                    x.scale = 0;
                                } else {
                                    x.scale = x.saleNum / y.value;
                                }
                            }
                        })
                    })
                    //获取所有规格尺码的saleNum数量
                    this.saleNumCount = 0;
                    this.stockSumCount = 0;
                    this.color_data.map(x => {
                        if (this.isFirst > 1) {
                            this.Form[x.name] = 0;
                        }
                        this.saleNumCount += x.value;
                        this.stockSumCount += x.stockSum;
                    })
                    //计算每个颜色合计的销售比例
                    this.color_data.map(x => {
                        if (x.value == 0) {
                            x.scale = 0;
                        } else {
                            x.scale = x.value / this.saleNumCount;
                        }
                    })

                    let colorSelected = {};
                    this.legend_data.map(x => {
                        colorSelected[x] = true;
                    })

                    if (this.type == 'edit') {
                        let sum = 0;
                        for (let x in this.Form) {
                            sum += this.Form[x];
                        }
                        this.placing_sum = sum;
                        for (let y in this.Form) {
                            this.color_data.map(x => {
                                if (x.name == y) {
                                    x.after_placing_orders = Math.round((this.Form[y] + x.stockSum) / (this.stockSumCount + sum) * 1000) / 10;
                                }
                            })
                        }
                        this.Data.map(x => {
                            saleNum_color_sum.map(y => {
                                if (x.color == y.color) {
                                    if (y.saleNum == 0) {
                                        x.saleRatio = 0 + '%';
                                    } else {
                                        x.saleRatio = Math.round(x.saleNum / y.saleNum * 100) + '%';
                                    }
                                }
                            })
                            this.$set(x, 'inventorySum', "0")
                        })
                    } else {
                        this.Data.map(x => {
                            saleNum_color_sum.map(y => {
                                if (x.color == y.color) {
                                    if (y.saleNum == 0) {
                                        x.saleRatio = 0 + '%';
                                    } else {
                                        x.saleRatio = Math.round(x.saleNum / y.saleNum * 100) + '%';
                                    }
                                }
                            })
                            this.$set(x, 'inventoryRatio', "0%")
                            this.$set(x, 'reorderRate', "0%") //test
                            this.$set(x, 'inventorySum', "0")
                        })
                    }
                    if (this.params.type == 'add_bylink') {
                        this.isreset = true;
                    } else {
                        this.isreset = false;
                    }
                    this.isFirst++;
                    this.spinShow = false;

                    if (this.type == 'edit') {
                        let qty_color = [];
                        this.Data.map(x => {
                            let flag = false;
                            qty_color.map(y => {
                                if (x.color == y.color) {
                                    y.qty += x.qty;
                                    flag = true;
                                }
                            })
                            if (!flag) {
                                qty_color.push({
                                    color: x.color,
                                    qty: x.qty
                                })
                            }
                        })
                        this.Data.map(x => {
                            x.stockSum = x.stockSum - x.qty;
                            this.color_data.map(k => {
                                if (x.color == k.name) {
                                    qty_color.map(j => {
                                        if (x.color == j.color) {
                                            if (parseInt(k.stockSum) + parseInt(j.qty) <= 0) {
                                                x.inventoryRatio = '0%';
                                            } else {
                                                x.inventoryRatio = Math.round((parseInt(x.qty) + parseInt(x.stockSum)) / (parseInt(k.stockSum) + parseInt(j.qty)) * 100) + '%';
                                            }
                                        }
                                    })
                                }
                            })
                        })
                        //test
                        this.Data.map(x => {
                            console.log(x.stockSum, x.qty, '0000000000')
                            x.stockSum = x.stockSum - x.qty;
                            this.color_data.map(k => {
                                console.log(k.name, '1111111')
                                if (x.color == k.name) {
                                    qty_color.map(j => {
                                        console.log(j.color, '222222222')
                                        console.log(x.qty, x.stockSum, k.stockSum, j.qty, '999999999999999')
                                        if (x.color == j.color) {
                                            if (parseInt(j.qty) <= 0) {
                                                x.reorderRate = '0%';
                                            } else {
                                                x.reorderRate = Math.round((parseInt(x.qty)) / (parseInt(j.qty)) * 100) + '%';
                                            }
                                        }
                                    })
                                }
                            })
                        })
                    }
                }
            })

        },
        //获取剩余金额
        getSurplusMoney(obj) {
            if(obj.season == null){
                this.$Message.error("请先查询再同步最新剩余金额")
            }else{
                console.log(obj.season, '-0-0--0-0-0-0--',obj)
            let data = {}
            data.start = 0
            data.length = 10
            data.year = new Date().getFullYear()
            data.season = this.getSeasonNow
            data.basicBrandId = this.formSearch.brandId
            this.request('eom_procurementBudget_getProcurementBudget', {
                data
            }, false).then((res) => {
                if (res.code == 1) {
                    res.data.results.length > 0 ? this.surplusMoney = res.data.results[0].surplusAmount : this.surplusMoney = 0
                }
            })
            }
        },
        handleReset() {
            this.formSearch = formSearch();
            this.colorList = [];
            this.selectedColor = [];
            this.isFirst = 2;
            this.isreset = true;
            this.Data = [];
            this.Form = {};
            this.color_data = [];
        },
        submit(type) {
            if(!this.formSearch.planStockinTime == true){
                this.$Message.error('请先选择要求入库时间');
                return false;
            }
            let data = Util.deepClone(this.formSearch);
            if (!!this.formSearch.planStockinTime) {
                data.planStockinTime = Util.dateFormat(this.formSearch.planStockinTime, 'yyyy-MM-dd');
            }
            data.reorderDetail = this.Data;
            data.startDate = Util.dateFormat(this.formSearch.startDate, 'yyyy-MM-dd');
            data.endDate = Util.dateFormat(this.formSearch.endDate, 'yyyy-MM-dd');
            // data.planStockinTime = Util.dateFormat(this.formSearch.planStockinTime, 'yyyy-MM-dd');
            let obj = {};
            let color_data = [];
            this.Data.map(x => {
                if (x.color in obj) {
                    obj[x.color] += x.qty
                } else {
                    obj[x.color] = x.qty
                }
            })
            for (let y in obj) {
                color_data.push({
                    name: y,
                    value: obj[y]
                })
            }

            if (Math.abs(this.placing_sum - this.formSearch.totalQty) > 0) {
                this.$Message.warning('返单总数与下单总数不一致，请核对！');
                return false;
            }

            let visible = true;
            color_data.map(x => {
                for (let y in this.Form) {
                    if (x.name == y) {
                        if (x.value != this.Form[y]) {
                            let num = x.value - this.Form[y];
                            if (num > 0) {
                                this.$Message.warning(`${x.name}尺码明细比总数多${Math.abs(num)}件`)
                            } else {
                                this.$Message.warning(`${x.name}尺码明细比总数少${Math.abs(num)}件`)
                            }
                            visible = false;
                        }
                    }
                }
            })

            if (!visible) {
                return false;
            }
            if (this.formSearch.totalQty == 0) {
                this.$Message.warning('请填写返单总数！')
                return false;
            }
            data.reorderDetail = data.reorderDetail.map(x => {
                return {
                    commodityCode: x.commodityCode,
                    color: x.color,
                    colorNo: '',
                    detailRemark: x.detailRemark,
                    norms: x.norms,
                    qty: x.qty,
                    sectionNo: x.sectionNo,
                    saleNum: x.saleNum,
                    stockSum: x.qty + x.stockOnwayNum + x.stockNum,
                    costPrice:x.costPrice
                }
            })
            data.userId = JSON.parse(window.sessionStorage.getItem('userinfo')).userId;
            // this.PostType = '';      //接口类型
            if (type == 'add') {
                this.PostType = 'add_reorder';
            } else {
                this.PostType = 'add_reorder_cart';
            }

            if (!data.sectionNo || !data.brandId) {
                this.$Message.warning('请填写款号和品牌！')
                return false
            }
            this.saveData = data
            //获取下单金额，剩余可用金额
            this.checkOrderPrice(data)
            console.log(this.saveData, data)
            // this.$refs['formSearch'].validate((valid) => {
            //     if (valid) {
            //         this.request(PostType, {
            //             data: {
            //                 obj: data
            //             }
            //         }).then(res => {
            //             if (res.code == 1) {
            //                 this.$Message.success(res.msg);
            //                 setTimeout(() => {
            //                     if (this.type == 'edit') {
            //                         this.$root.eventHub.$emit('closePageFromOtherPage', 'quickrepeatorder_edit');//关闭新增页面
            //                         this.$router.push({name: 'quickrepeatorder_list'});
            //                     } else {
            //                         this.$root.eventHub.$emit('closePageFromOtherPage', 'quickrepeatorder_add');//关闭新增页面
            //                         this.$router.push({name: 'quickrepeatorder_list'});
            //                     }
            //                 }, 2000)
            //             }
            //         })
            //     } else {
            //         this.$Message.error('请核对表单信息!');
            //         return false;
            //     }
            // })

        },
        //获取下单金额，剩余可用金额
        checkOrderPrice(name){
            console.log(name.reorderDetail,this.checkOrderPriceList,'0909')
           let a = []
           let b = []
           a = this.checkOrderPriceList
           b = name.reorderDetail
            let list = []
            console.log(list,'/./././././././/.')
            for ( let i = 0; i < this.checkOrderPriceList.length; i++) { 
                           list.push({
                        brandId: a[i].brandsId,
                        year:new Date().getFullYear(),
                        season:this.getSeasonNow,
                        costPrice:a[i].costPrice,
                        stockSum:b[i].stockSum,
                        qty:b[i].qty
                    })
                    console.log(list)
            }
            // this.checkOrderPriceList.map(x,indexx => {
            //     name.reorderDetail.map(y,indexy => {
            //         console.log(x,y,indexx,indexy,'099867890')
            //         if(x==y){
            //             list.push({
            //             brandId: x.brandsId,
            //             year:x.years,
            //             season:x.season,
            //             costPrice:x.costPrice,
            //             stockSum:y.stockSum,
            //             qty:y.qty
            //         })
            //         }
            //     })
                    
            //     })
                // push({
                    //     brandId: x.brandsId,
                    //     year:x.years,
                    //     season:x.season,
                    //     costPrice:x.costPrice
                    // })
                // name.reorderDetail.map(x => {
                //     list.push({
                //         qty:x.qty,
                //         commodityCode:x.commodityCode
                //     })
                // })
            console.log(list,'/./././././././/.')
            let data = {}
            data.data = list
            this.request('check_order_price', data, false).then((res) => {
                if (res.code == 1) {
                    this.visibleYes = true
                    this.orderPrice = res.data.orderPrice //该单金额
                    this.originPrice = res.data.originPrice //当前剩余金额
                    this.afterPrice = res.data.afterPrice //下单后剩余金额
                }
            })
            
        },
        saveVisible() {
            this.$refs['formSearch'].validate((valid) => {
                console.log(valid, '67890')
                if (valid) {
                    this.request(this.PostType, {
                        data: {
                            obj: this.saveData
                        }
                    }).then(res => {
                        if (res.code == 1) {
                            this.$Message.success(res.msg);
                            this.visibleYes = false
                            setTimeout(() => {
                                if (this.type == 'edit') {
                                    this.$root.eventHub.$emit('closePageFromOtherPage', 'quickrepeatorder_edit'); //关闭新增页面
                                    this.$router.push({
                                        name: 'quickrepeatorder_list'
                                    });
                                } else {
                                    this.$root.eventHub.$emit('closePageFromOtherPage', 'quickrepeatorder_add'); //关闭新增页面
                                    this.$router.push({
                                        name: 'quickrepeatorder_list'
                                    });
                                }
                            }, 2000)
                        }
                    })
                } else {
                    this.$Message.error('请核对表单信息!');
                    return false;
                }
            })
        },
        cancelVisible() {
            this.visibleYes = false
        },
        changeColor(val) {
            let index = val.indexOf('全部');
            let selectedColor = Util.deepClone(this.selectedColor);
            if (val.indexOf('全部') != -1) {
                if (val.length == 1 || index != 0) {
                    selectedColor = ['全部'];
                } else {
                    selectedColor.splice(index, 1);
                }
            }

            if (this.isFirst != 0 && !this.isreset) {
                this.selectedColor = selectedColor;
                this.search();
            }
        },
        changeDate(val) {
            this.quick_search = '';
        },
        changeRadio(val) {
            if (!this.formSearch.brandId || !this.formSearch.sectionNo) {
                return false;
            }
            this.quick_search = val;
            this.$nextTick(() => {
                this.search();
            })
        },
        clickColor(val) {
            this.color_data.map(x => {
                if (x.name == val) {
                    x.isread = !x.isread;
                }
            })
        },
        changeColorNumber(name, val) {
            if (this.isFirst <= 1) {
                return false;
            }
            let Not_read_count = 0;
            let isread_count = 0;

            this.color_data.map(x => {
                if (!x.isread) {
                    for (let y in this.Form) {
                        if (y == x.name && x.name != name) {
                            Not_read_count += this.Form[y];
                        }
                    }
                }
                if (x.isread || x.name == name) {
                    for (let y in this.Form) {
                        if (x.name == y) {
                            isread_count += this.Form[y];
                        }
                    }
                }
            })
            let Form = Util.deepClone(this.Form);
            this.color_data.map(x => {
                for (let y in Form) {
                    if (x.name == y && !x.isread && y != name) {
                        let totalQty = Util.deepClone(this.formSearch.totalQty);
                        var scale;
                        if (Not_read_count == 0) {
                            scale = 0;
                        } else {
                            scale = this.Form[y] / Not_read_count;
                        }
                        let count = (totalQty - isread_count) * scale;
                        this.$set(Form, y, Math.round(count));
                    }
                }
            })

            this.Form = Form;

            let sum = 0;
            this.placing_sum = 0;
            for (let x in this.Form) {
                sum += this.Form[x];
                this.placing_sum += this.Form[x];
            }

            this.$nextTick(() => {
                this.Data.map(x => {
                    this.color_data.map(y => {
                        if (x.color == y.name) {
                            let saleRatio = x.saleRatio.split('%');
                            let count = ((this.Form[y.name] + y.stockSum) * (saleRatio[0] / 100) - x.stockSum) / 10;
                            x.qty = count <= 0 ? 0 : Math.round(count) * 10;
                        }
                    })
                })

                let qty_color = [];
                this.Data.map(x => {
                    let flag = false;
                    qty_color.map(y => {
                        if (x.color == y.color) {
                            y.qty += x.qty;
                            flag = true;
                        }
                    })
                    if (!flag) {
                        qty_color.push({
                            color: x.color,
                            qty: x.qty
                        })
                    }
                })

                let stockSum = 0;
                for (let y in Form) {
                    stockSum += Form[y];
                }
                this.color_data.map(x => {
                    stockSum += x.stockSum;
                })

                this.Data.map(x => {
                    qty_color.map(y => {
                        if (x.color == y.color) {
                            if (y.qty == 0) {
                                x.qty = 0;
                            } else {
                                x.qty = Math.round(this.Form[y.color] * (x.qty / y.qty) / 10) * 10;
                            }
                        }
                    })
                })
                qty_color = [];
                this.Data.map(x => {
                    let flag = false;
                    qty_color.map(y => {
                        if (x.color == y.color) {
                            y.qty += x.qty;
                            flag = true;
                        }
                    })
                    if (!flag) {
                        qty_color.push({
                            color: x.color,
                            qty: x.qty
                        })
                    }
                })
                this.Data.map(x => {
                    this.color_data.map(k => {
                        if (x.color == k.name) {
                            qty_color.map(j => {
                                if (x.color == j.color) {
                                    if (parseInt(k.stockSum) + parseInt(j.qty) <= 0) {
                                        x.inventoryRatio = '0%';
                                    } else {
                                        x.inventoryRatio = Math.round((parseInt(x.qty) + parseInt(x.stockSum)) / (parseInt(k.stockSum) + parseInt(j.qty)) * 100) + '%';
                                    }
                                }
                            })
                        }
                    })
                })

                //test
                this.Data.map(x => {
                    this.color_data.map(k => {
                        if (x.color == k.name) {
                            qty_color.map(j => {
                                if (x.color == j.color) {
                                    console.log(x.qty, x.stockSum, k.stockSum, j.qty, '999999999999999')
                                    if (parseInt(j.qty) <= 0) {
                                        x.reorderRate = '0%';
                                    } else {
                                        x.reorderRate = Math.round((parseInt(x.qty)) / (parseInt(j.qty)) * 100) + '%';
                                    }
                                }
                            })
                        }
                    })
                })
            })
            for (let y in this.Form) {
                this.color_data.map(x => {
                    if (x.name == y) {
                        x.after_placing_orders = Math.round((this.Form[y] + x.stockSum) / (this.stockSumCount + sum) * 1000) / 10;
                    }
                })
            }
        },
        get_reorder_detail() {
            this.request('get_reorder_detail', {
                data: {
                    reorderCode: this.$route.params.orderId
                }
            }, true).then(res => {
                if (res.code == 1) {
                    this.formSearch = res.data.reorderList;
                    this.Form = {};
                    this.TempFormSearch = Util.deepClone(res.data.reorderList);
                    console.log(this.TempFormSearch,'098867890')
                    this.quick_search = '';
                    this.colorList = [];
                    this.TempFormSearch.reorderDetail.map(x => {
                        if (!!x.color && this.colorList.indexOf(x.color) == -1) {
                            this.colorList.push(x.color);
                        }
                    })
                    this.colorList.unshift('全部');
                    let obj = {};
                    this.TempFormSearch.reorderDetail.map(x => {
                        if (x.color in obj) {
                            obj[x.color] += x.qty
                        } else {
                            obj[x.color] = x.qty
                        }
                    })
                    this.selectedColor = [];
                    for (let y in obj) {
                        this.selectedColor.push(y);
                    }
                    this.search();
                }
            })
        },
    },
    mounted() {
        this.quick_search = 'threeDay';
        this.formSearch.createUser = JSON.parse(window.sessionStorage.getItem('userinfo')).userName;
        this.$store.dispatch('get_brands_by_userId', {
            data: {
                userId: JSON.parse(window.sessionStorage.getItem('userinfo')).userId
            }
        });
        this.request('eom_reorder_get_season_now', {}, false).then((res) => {
                if (res.code == 1) {
                    this.getSeasonNow = res.data
                }
        })
        // window.onresize = function () {
        //     var map = echarts.init(document.getElementById('echart-area'));
        //     map.resize();
        // };

    },
    activated() {
        this.quick_search = 'threeDay';
        this.formSearch.startDate = Util.cutDate(new Date(), 3);
        this.formSearch.endDate = Util.dateFormat(new Date(new Date().getTime() - 1000 * 60 * 60 * 24), 'yyyy-MM-dd');
        this.selectedColor = [];
        this.params = this.$route.params;
        if (!!this.params.type && this.params.type == 'add_bylink') {
            this.formSearch.sectionNo = this.params.sectionNo;
            this.formSearch.className = this.params.className;
            this.formSearch.season = this.params.season;
            this.formSearch.brandId = this.params.brandId;
            // this.selectedColor = [];
            // this.selectedColor.push(this.params.color);
            // this.colorList = [];
            // this.colorList.push(this.params.color);
            this.get_brand_by_sectionNo();
            this.getdepartment()
            this.search();
            this.selectedColor.unshift('全部');
        }
        if (this.type == 'edit') {
            this.get_reorder_detail();
            this.isFirst = 0;
            this.get_brand_by_sectionNo();
            this.getdepartment()
        } else {

            this.isFirst = 2;
        }
    }
}
</script>




[{name:'1',color:red},{name:'2',color:blue}] //数组1
怎么让数组变成数组2
[{name:'1',color:red,age:18},{name:'2',color:blue,age:20}]