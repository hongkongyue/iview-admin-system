<template>
<div>
    <div class="background-color-white exhibition">
        <Form :model="formSearch" class="search" ref="formSearch" :label-width="1" inline label-position="right"
            @keydown.native.enter="search">
            <Row>
                <Form-item label="">
                    <RadioGroup :value="TimeRangeValue" @on-change="changeTimeRange" type="button" style="margin-right:5px;">
                        <Radio label="昨日"></Radio>
                        <Radio label="本周"></Radio>
                        <Radio label="本月"></Radio>
                    </RadioGroup>
                    　　<DatePicker type="date" :options="pickerOptions" v-model="formSearch.startDate" placeholder="选择开始日期" style="width: 150px;margin-right:3px;"></DatePicker>
                    　 <DatePicker type="date" :options="pickerOptions" v-model="formSearch.endDate" placeholder="选择结束日期" style="width: 150px"></DatePicker>
                </Form-item>
                <Form-item label="">
                    <Select style="width:162px" v-model="formSearch.brandId" @on-change='search' placeholder="请选择品牌">
                        <Option v-for="item in brandList" :value="item.id" :key="item.id">
                            {{item.brands }}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item>
                    <Select style="width:162px" v-model="formSearch.platfromCode" @on-change='search' placeholder="请选择平台">
                        <Option v-for="item in platformList" :value="item.PLATFROM_ID" :key="item.PLATFROM_ID">
                            {{item.PLATFROM_NAME }}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item :label-width="1">
                    <Button type="primary" @click="search('formSearch')" icon="ios-search">搜索</Button>
                    <Button type="warning" @click="reset">重置</Button>
                    <Button type="primary" @click="exportData">导出</Button>
                </Form-item>
            </Row>
        </Form>
    </div>
     <div style="height:8px;"></div>
     <div class="background-color-white exhibition">
         <Row>
            <Col class="margin-bottom-10">
                <Table :columns="columns" size="small" :data="list"></Table>
            </Col>
            <Col>
                <Page :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
            </Col>
       </Row>
    </div>
</div>
</template>

<script>
    import Util from 'libs/util';

    function formSearch() {
        return {
            platfromCode: 1,
            brandId: 0, //	品牌id	number	
            endDate: '', //	结束日期	string	格式：yyyy-mm-dd
            startDate: '', //	开始日期	string	格式：yyyy-mm-dd
        }
    }
    export default {
        name: "operation_analysis_tmall",
        desc: '天猫经营分析',
        data() {
            return {
                formSearch: formSearch(),
                brandList: [],
                columns: [{
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        width: 60
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        width: 120
                    },
                    //  {
                    //     title: '店铺',
                    //     key: 'shopName',
                    //     align: 'center',
                    //     width: 150
                    //   },
                    {
                        title: '发货订单数',
                        key: 'shipOrders',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '发货订单金额',
                        key: 'shipAmount',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '退货货品金额',
                        key: 'refundGoodsAmount',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '发货货品成本',
                        key: 'shipGoodsCost',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '退货货品成本',
                        key: 'refundGoodsCost',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '冲减退换货后收入',
                        key: 'realIncome',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '冲减退换货后成本',
                        key: 'realCost',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '实收邮资',
                        key: 'realPostAmount',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '确认有效收入',
                        key: 'effectiveIncome',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '计提平台服务费',
                        key: 'platfromServiceFee',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '计提佣金',
                        key: 'commission',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '佣金合计',
                        key: 'commissionAmount',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '退款+返现（含税）',
                        key: 'refundCash',
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '可用收入',
                        key: 'usableIncome',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '可用成本',
                        key: 'usableCost',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '毛利',
                        key: 'grossIncome',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '固定费用',
                        key: 'fixedCost',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '变动费用',
                        key: 'variableCost',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '所得税税费',
                        key: 'incomeTax',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '净利润',
                        key: 'netIncome',
                        align: 'center',
                        width: 120
                    },
                ],
                list: [],
                page: 1,
                pageSize: 20,
                total: 0,
                TimeRangeValue: '昨日',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6 - 1000 * 60 * 60 * 24
                    }
                },
                platformList: []
            }
        },
        computed: {

        },
        watch: {
            "formSearch": {
                handler(newVal, oldVal) {
                    let endDate = Util.cutDate(new Date(), 1);
                    let startDate = Util.dateFormat(newVal.startDate, 'yyyy-MM-dd');
                    if (Util.dateFormat(newVal.endDate, 'yyyy-MM-dd') == endDate) {
                        if (startDate == Util.cutDate(new Date(), 1)) {
                            this.TimeRangeValue = '昨日';
                        } else if (startDate == Util.getWeekStartDate()) {
                            this.TimeRangeValue = '本周';
                        } else if (startDate == Util.dateFormat(new Date().setDate(1), 'yyyy-MM-dd')) {
                            this.TimeRangeValue = '本月';
                        } else {
                            this.TimeRangeValue = ''
                        }
                    } else {
                        this.TimeRangeValue = ''
                    }
                },
                deep: true
            }
        },
        mounted() {
            this.getPlatformList()
            this.changeTimeRange('昨日');
            this.getBrandList();
        },
        methods: {
            search() {
                this.page = 1;
                this.getData();
            },
            reset() {
                this.formSearch = formSearch();
                this.TimeRangeValue = '昨日';
                this.formSearch.startDate = Util.cutDate(new Date(), 1);
                this.formSearch.endDate = Util.cutDate(new Date(), 1);
                this.search();
            },
            getBrandList() {
                this.request('bi_brand_list', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    data: {}
                }, false).then((res) => {
                    this.brandList = res.data;
                    this.brandList.unshift({
                        id: 0,
                        brands: '所有品牌'
                    })
                    this.brandList = this.brandList.filter(x => {
                        return x.id != '51594' && x.id != '51609'
                    })
                })
            },
            getPlatformList() {
                this.request('get_platform_list', {}, false).then((res) => {
                    this.platformList = res.data
                    this.platformList.unshift({
                        PLATFROM_ID: 0,
                        PLATFROM_NAME: '所有平台'
                    })
                })
            },
            getData() {
                if (!this.formSearch.brandId) {
                    // this.$Message.warning('请选择品牌');
                    // return;
                } else if (!this.formSearch.startDate) {
                    this.$Message.warning('请选择开始日期');
                    return;
                } else if (!this.formSearch.endDate) {
                    this.$Message.warning('请选择结束日期');
                    return;
                }
                let data = Util.deepClone(this.formSearch);
                data.startDate = Util.dateFormat(data.startDate, 'yyyy-MM-dd');
                data.endDate = Util.dateFormat(data.endDate, 'yyyy-MM-dd');
                if (this.formSearch.startDate > this.formSearch.endDate) {
                    this.$Message.warning('日期选择有误，请重新选择！');
                    return false;
                };
                data.length = this.pageSize;
                data.start = (this.page - 1) * this.pageSize;
                data.brandId == 0 ? data.brandId = '' : data.brandId = data.brandId;
                if (data.platfromCode == 0) {
                    data.platfromCode = ''
                }
                this.request('get_analysis_tm', {
                    data: data
                }, true).then((res) => {
                    if (res.code == 1) {
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.analysisTMList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.list = res.data.analysisTMList;
                        this.total = res.data.count;
                        let lastPage = Math.ceil(this.total / this.pageSize);

                        if (this.page == lastPage) {
                            let biAnalysisTMLListTotalList = res.data.biAnalysisTMLListTotalList;
                            biAnalysisTMLListTotalList.serialNo = '合计';
                            this.list.push(biAnalysisTMLListTotalList);
                        }
                    }
                })
            },
            changeTimeRange(data) {
                this.formSearch.endDate = Util.cutDate(new Date(), 1)
                if (data == '昨日') {
                    this.formSearch.startDate = Util.cutDate(new Date(), 1);
                    this.TimeRangeValue = '昨日';
                } else if (data == '本周') {
                    this.formSearch.startDate = Util.getWeekStartDate();
                    this.TimeRangeValue = '本周';
                } else if (data == '本月') {
                    var date = new Date();
                    date.setDate(1);
                    this.TimeRangeValue = '本月';
                    this.formSearch.startDate = date;
                }
                this.search();
            },
            CurrentChange(val) {
                this.page = val;
                this.getData();
            },
            SizeChange(val) {
                this.pageSize = val;
                this.getData();
            },
            exportData() {
                let data = Util.deepClone(this.formSearch);
                if (!data.startDate || !data.endDate) {
                    this.$Message.warning('请选择日期！');
                    return false;
                }!!data.startDate ? data.startDate = Util.dateFormat(this.formSearch.startDate, 'yyyy-MM-dd') : data.startDate = '';
                !!data.endDate ? data.endDate = Util.dateFormat(this.formSearch.endDate, 'yyyy-MM-dd') : data.endDate = '';
                data.brandId == 0 ? data.brandId = '' : data.brandId = this.formSearch.brandId;
                data.platform = this.activeTable;
                this.request('export_analysis_tmall', data, true).then(res => {
                    if (res.code == '1') {
                        this.$Message.success(res.msg);
                        if (document.location.href.indexOf('localhost') > 0 || document.location.href.indexOf('127.0.0.1') > 0) {
                            window.open('http://127.0.0.1:8360' + res.data)
                        } else {
                            window.open(res.data)
                        }
                    }
                })
            }
        }
    }
</script>

<style>
   
</style>