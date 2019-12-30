<style>
    #throughput .common {
        height: 330px;
        transition: all 0.6s;
        overflow: hidden;
        margin-bottom: 50px;
    }

    #throughput h4{
        display: none;
    }

    #throughput table {
        cellspacing: 0;
        *border-collapse: collapse; /* IE7 and lower */
        border-spacing: 0;
        width: 100%;
        top: 30px;
        position: absolute;
    }

    #throughput thead{
        width:100%;
    }
    #throughput thead tr{
        position: absolute;
        width:inherit;
        display: inline-flex;
        flex-direction: row;
    }
    #throughput .bordered tr:hover {
        background: #fbf8e9;
        -o-transition: all 0.1s ease-in-out;
        -webkit-transition: all 0.1s ease-in-out;
        -moz-transition: all 0.1s ease-in-out;
        -ms-transition: all 0.1s ease-in-out;
        transition: all 0.1s ease-in-out;
    }

    #throughput .bordered th {
        padding: 7px;
        text-align: center;
        cellspacing: 0;
        flex:1
    }

    #throughput .bordered td {
        padding: 7px;
        text-align: center;
        cellspacing: 0;
        flex:1
    }

    #throughput .bordered th {
        background-image: -webkit-gradient(linear, left top, left bottom, from(#ebf3fc), to(#dce9f9));
        background-image: -webkit-linear-gradient(to top, #ebf3fc, #dce9f9);
        background-image: -moz-linear-gradient(to top, #ebf3fc, #dce9f9);
        background-image: -ms-linear-gradient(to top, #ebf3fc, #dce9f9);
        background-image: -o-linear-gradient(to top, #ebf3fc, #dce9f9);
        background-image: linear-gradient( to top, #ebf3fc, #dce9f9);
    }

    #throughput .bordered td:first-child, #throughput .bordered th:first-child {
        border-left: none;
        flex:1
    }

    .bordered tr:nth-of-type(2n) {
        background: #FFFFFF;
        cursor: pointer;
        display: inline-flex;
        flex-direction: row;
    }

    .bordered tr:nth-of-type(2n+1) {
        background: #F7FAFC;
        cursor: pointer;
        display: inline-flex;
        flex-direction: row;
    }
    .bordered tbody {
        display: block;
        margin-top: 31.6px;
        height: 220px;
        overflow: auto;
    }
    .bordered tbody tr {
        display: inline-flex;
        flex-direction: row;
        width: 100%;
    }
    .bordered tbody tr:hover {
        background: #fbf8e9;
        -o-transition: all 0.1s ease-in-out;
        -webkit-transition: all 0.1s ease-in-out;
        -moz-transition: all 0.1s ease-in-out;
        -ms-transition: all 0.1s ease-in-out;
        transition: all 0.1s ease-in-out;
    }

</style>

<template>
    <div id="throughput">
        <Row class="margin-bottom-10">
            <Col span="24" class="search" style="margin-bottom: 50px;">
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Form-item label="期间:" :label-width="70">
                    <DatePicker
                            type="month"
                            v-model="formSearch.month"
                            size="small"
                            placeholder="请选择期间"
                            style="width: 200px"
                    >
                    </DatePicker>
                </Form-item>
                <Form-item label-width="1">
                    <Button type="primary" icon="search" size="small" @click="search">
                        查询
                    </Button>
                    <Button type="primary" icon="arrow-down-a" size="small" @click="exportAllData">
                        导出
                    </Button>
                </Form-item>
            </Form>
            </Col>
            <Col span="24" class="margin-top-20" id="echart">
            <div ref="sum_per_month" class="common" id="sum_per_month"></div>
            <div ref="sale_stockout" class="common" id="sale_stockout"></div>
            <div ref="sale_return_stockin" class="common" id="sale_return_stockin"></div>
            <div ref="purchase_return_stockin" class="common" id="purchase_return_stockin"></div>
            <div ref="return_stockout" class="common" id="return_stockout"></div>
            </Col>
        </Row>
    </div>
</template>

<script>
    import echarts from 'echarts';
    import Util from 'libs/util';
    import apiMap from 'libs/apiMap'
    import axios from 'axios'

    function formSearch() {
        return {
            month: '',
            warehouseCode: ''
        }
    }

    export default {
        name: "throughput",
        props: ["warehouse_code"],
        data() {
            return {
                formSearch: formSearch(),
                sale_stockout_data: {},
                sum_per_month_data: {},
                purchase_return_stockin_data: {},
                return_stockout_data: {},
                sale_return_stockin_data: {},
                Data: {},
                EchartsNameList: ['sum_per_month', 'sale_stockout', 'sale_return_stockin', 'purchase_return_stockin', 'return_stockout'],
                tempEchartsId: '',
            }
        },
        mounted() {
            let nowDate=new Date();
            nowDate.setMonth(nowDate.getMonth()-1);
            nowDate.setDate(1);
            this.formSearch.month = nowDate;
            this.formSearch.warehouseCode = this.warehouse_code;
            this.$nextTick(() => {
                this.search();
            })
        },
        activated() {

        },
        methods: {
            getData(type) {
                let data = Util.deepClone(this.formSearch);
                data.month = Util.dateFormat(data.month, 'yyyy-MM');
                this.request(type, {
                    data: data
                }, '加载中').then(res => {
                    if (res.code == 1) {
                        this.Data = res.data;
                        this.init('sum_per_month', res.data);
                        this.init('sale_stockout', res.data);
                        this.init('purchase_return_stockin', res.data);
                        this.init('return_stockout', res.data);
                        this.init('sale_return_stockin', res.data);
                    }
                })
            },
            search() {
                this.getData('sum_per_month');
            },
            init(Id, data) {
                let that = this;
                let map = echarts.init(document.getElementById(Id));
                let option = {};

                let lengend_data = [];
                let title = '';
                let xAxisData = [];
                let seriesData = {};

                if (Id == 'sum_per_month' || this.tempEchartsId == 'sum_per_month') {
                    lengend_data = ['入库', '出库'];
                    lengend_data.map(x => {
                        seriesData[x] = [];
                    })
                    data.stockinList.map(x => {
                        xAxisData.push(x.brandName);
                        seriesData['入库'].push(x.stockinNumber);
                    })
                    data.stockoutList.map(x => {
                        seriesData['出库'].push(x.stockoutNumber);
                    })
                    title = '吞吐量月度汇总表\n';
                } else if (Id == 'sale_stockout' || this.tempEchartsId == 'sale_stockout') {
                    lengend_data = ['日常/单', '日常/件', '唯品会/件'];
                    lengend_data.map(x => {
                        seriesData[x] = [];
                    })
                    data.stockinList.map(x => {
                        xAxisData.push(x.brandName);
                        seriesData['日常/单'].push(x.normalOrder);
                        seriesData['日常/件'].push(x.normalItem);
                        seriesData['唯品会/件'].push(x.VIPItem);
                    })
                    title = '销退入库';
                } else if (Id == 'sale_return_stockin' || this.tempEchartsId == 'sale_return_stockin') {
                    lengend_data = ['日常/单', '日常/件', '唯品会/单', '唯品会/件'];
                    title = '发货汇总';
                    lengend_data.map(x => {
                        seriesData[x] = [];
                    })
                    data.stockoutList.map(x => {
                        xAxisData.push(x.brandName);
                        seriesData['日常/单'].push(x.stockoutnormalOrder);
                        seriesData['日常/件'].push(x.stockoutnormalItem);
                        seriesData['唯品会/单'].push(x.stockoutVIPOrder);
                        seriesData['唯品会/件'].push(x.stockoutVIPItem);
                    })
                } else if (Id == 'purchase_return_stockin' || this.tempEchartsId == 'purchase_return_stockin') {
                    lengend_data = ['采购入库/件', '返修入库/件'];
                    title = '大货/返修入库';
                    lengend_data.map(x => {
                        seriesData[x] = [];
                    })
                    data.stockinList.map(x => {
                        xAxisData.push(x.brandName);
                        seriesData['采购入库/件'].push(x.purchaseNumber);
                        seriesData['返修入库/件'].push(x.otherNumber);
                    })
                } else if (Id == 'return_stockout' || this.tempEchartsId == 'return_stockout') {
                    lengend_data = ['正品', '次品'];
                    title = '返厂出库';
                    lengend_data.map(x => {
                        seriesData[x] = [];
                    })
                    data.stockoutList.map(x => {
                        xAxisData.push(x.brandName);
                        seriesData['正品'].push(x.goodNumber);
                        seriesData['次品'].push(x.defectiveNumber);
                    })
                }

                option = {
                    title: {
                        text: title,
                        left: 'middle',
                        textStyle:{
                            color:'#000',
                            fontWeight:'normal'
                        },
                        textAlign:'center'
                    },
                    grid: {
                        top:'100',
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: lengend_data,
                        top:'30'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataView: {
                                show: true,
                                readOnly: true,
                                optionToContent: function (opt) {
                                    var colName = "序号";
                                    var typeName = "品牌";
                                    var dataview = opt.toolbox[0].feature.dataView;  //获取dataview
                                    var table = '<div style="position:absolute;top: 5px;left: 0px;right: 0px;line-height: 1.4em;text-align:center;font-size:14px;">' + title + '</div>'
                                    table += getTable(opt, colName, typeName);
                                    return table;
                                }
                            },
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            myTool1: {
                                show: true,
                                title: '全屏显示',
                                icon: 'image://http://www.haotu.net/up/4250/128/171-screen-ful.png',
                                onclick: function () {
                                    if (Id != 'fullscreen') {
                                        that.tempEchartsId = Id;
                                    }
                                    that.EchartsNameList.map(x => {
                                        that.$refs[x].style.display = 'none';
                                    })
                                    var echart = document.getElementById('echart');
                                    if (!document.getElementById('fullscreen')) {
                                        var fullscreen = document.createElement('div');
                                        fullscreen.setAttribute('id', 'fullscreen');
                                        fullscreen.setAttribute('ref', 'fullscreen');
                                        echart.insertBefore(fullscreen, echart.childNodes[0]);
                                        fullscreen.style.height = window.innerHeight - 240 + 'px';
                                        fullscreen.style.width = window.innerWidth - 250 + 'px';
                                        that.init('fullscreen', that.Data);
                                    }
                                }
                            },
                            myTool2: {
                                show: true,
                                title: '缩小',
                                icon: 'image://http://www.iconpng.com/png/iconbeast_lite/arrow-big-10.png',
                                onclick: function () {
                                    var echart = document.getElementById('echart');
                                    var fullscreen = document.getElementById('fullscreen');
                                    if (!!fullscreen) {
                                        echart.removeChild(fullscreen);
                                    }
                                    that.EchartsNameList.map(x => {
                                        that.$refs[x].style.display = 'block';
                                    })
                                }
                            }
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            axisLabel:{'interval':0,rotate:30},
                            data: xAxisData,
                            splitLine:{
                                show:false
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: ''
                        }
                    ],
                    series: [],
                    // dataZoom: [
                    //     {
                    //         show: true,
                    //         start: 80,
                    //         end: 0,
                    //         height: 10
                    //     },
                    // ]
                };

                if (Id == 'sale_stockout' || this.tempEchartsId == 'sale_stockout') {
                    option.yAxis[0].name = '件';
                    option.yAxis.push(
                        {
                            type: 'value',
                            name: '单',
                            splitLine:{
                                show:false
                            }
                        }
                    )
                    lengend_data.map(x => {
                        if (x == '日常/单') {
                            option.series.push({
                                name: x,
                                type: 'line',
                                yAxisIndex: 1,
                                data: seriesData[x],
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                        {type: 'min', name: '最小值'}
                                    ]
                                }
                            })
                        } else {
                            option.series.push({
                                name: x,
                                type: 'bar',
                                data: seriesData[x],
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                        {type: 'min', name: '最小值'}
                                    ]
                                }
                            })
                        }
                    })
                } else if (Id == 'sale_return_stockin' || this.tempEchartsId == 'sale_return_stockin') {
                    option.yAxis[0].name = '件';
                    option.yAxis.push(
                        {
                            type: 'value',
                            name: '单',
                            splitLine:{
                                show:false
                            }
                        }
                    )

                    lengend_data.map(x => {
                        if (x == '日常/单' || x == '唯品会/单') {
                            option.series.push({
                                name: x,
                                type: 'line',
                                yAxisIndex: 1,
                                data: seriesData[x],
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                        {type: 'min', name: '最小值'}
                                    ]
                                }
                            })
                        } else {
                            option.series.push({
                                name: x,
                                type: 'bar',
                                data: seriesData[x],
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                        {type: 'min', name: '最小值'}
                                    ]
                                }
                            })
                        }
                    })
                } else if (Id == 'purchase_return_stockin' || this.tempEchartsId == 'purchase_return_stockin') {
                    option.yAxis[0].name = '采购入库';
                    option.yAxis.push(
                        {
                            type: 'value',
                            name: '返修入库',
                            splitLine:{
                                show:false
                            }
                        }
                    )
                    lengend_data.map(x => {
                        if (x == '返修入库/件') {
                            option.series.push({
                                name: x,
                                type: 'bar',
                                yAxisIndex: 1,
                                data: seriesData[x],
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                        {type: 'min', name: '最小值'}
                                    ]
                                }
                            })
                        } else {
                            option.series.push({
                                name: x,
                                type: 'bar',
                                data: seriesData[x],
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                        {type: 'min', name: '最小值'}
                                    ]
                                }
                            })
                        }
                    })
                } else if (Id == 'return_stockout' || this.tempEchartsId == 'return_stockout') {
                    option.yAxis[0].name = '正品';
                    option.yAxis.push(
                        {
                            type: 'value',
                            name: '次品',
                            splitLine:{
                                show:false
                            }
                        }
                    )
                    lengend_data.map(x => {
                        if (x == '次品') {
                            option.series.push({
                                name: x,
                                type: 'bar',
                                yAxisIndex: 1,
                                data: seriesData[x],
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                        {type: 'min', name: '最小值'}
                                    ]
                                }
                            })
                        } else {
                            option.series.push({
                                name: x,
                                type: 'bar',
                                data: seriesData[x],
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                        {type: 'min', name: '最小值'}
                                    ]
                                }
                            })
                        }
                    })
                } else {
                    option.yAxis[0].name = '入库';
                    option.yAxis.push(
                        {
                            type: 'value',
                            name: '出库',
                            splitLine:{
                                show:false
                            }
                        }
                    )
                    lengend_data.map(x => {
                        if (x == '出库') {
                            option.series.push({
                                name: x,
                                type: 'bar',
                                yAxisIndex: 1,
                                data: seriesData[x],
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                        {type: 'min', name: '最小值'}
                                    ]
                                }
                            })
                        } else {
                            option.series.push({
                                name: x,
                                type: 'bar',
                                data: seriesData[x],
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                        {type: 'min', name: '最小值'}
                                    ]
                                }
                            })
                        }
                    })
                }

                function getTable(opt, colName, typeName) {
                    var axisData = opt.xAxis[0].data;//获取图形的data数组
                    var series = opt.series;//获取series
                    var num = 0;//记录序号
                    var sum = new Array();//获取合计数组（根据对应的系数生成相应数量的sum）
                    for (var i = 0; i < series.length; i++) {
                        sum[i] = 0;
                    }
                    var table = '<table class="bordered"><thead><tr>'
                        + '<th>' + colName + '</th>'
                        + '<th>' + typeName + '</th>';
                    for (var i = 0; i < series.length; i++) {
                        table += '<th>' + series[i].name + '</th>'
                    }
                    if (that.tempEchartsId == 'return_stockout' || Id == 'return_stockout') {
                        table += '<th>' + '次品率' + '</th>'
                    }
                    table += '</tr></thead><tbody>';
                    for (var i = 0, l = axisData.length; i < l; i++) {
                        num += 1;
                        for (var n = 0; n < series.length; n++) {
                            if (series[n].data[i]) {
                                sum[n] += Number(series[n].data[i]);
                            } else {
                                sum[n] += Number(0);
                            }

                        }
                        table += '<tr>'
                            + '<td>' + num + '</td>'
                            + '<td>' + axisData[i] + '</td>';
                        for (var j = 0; j < series.length; j++) {
                            if (series[j].data[i]) {
                                table += '<td>' + series[j].data[i] + '</td>';
                            } else {
                                table += '<td>' + 0 + '</td>';
                            }
                        }
                        if (that.tempEchartsId == 'return_stockout' || Id == 'return_stockout') {
                            table += '<td>' + data.stockoutList[i].defectiveRate * 100 + '%' + '</td>';
                        }
                        table += '</tr>';
                    }
                    //最后一行加上合计
                    table += '<tr>' + '<td>' + (num + 1) + '</td>' + '<td>合计</td>';

                    if (Id == 'sum_per_month' || that.tempEchartsId == 'sum_per_month') {
                        table += '<td>' + data.stockinSum + '</td>';
                        table += '<td>' + data.stockoutSum + '</td>';
                    } else if (Id == 'sale_stockout' || that.tempEchartsId == 'sale_stockout') {
                        table += '<td>' + data.normalOrderSum + '</td>';
                        table += '<td>' + data.normalItemSum + '</td>';
                        table += '<td>' + data.VIPItemSum + '</td>';
                    } else if (Id == 'sale_return_stockin' || that.tempEchartsId == 'sale_return_stockin') {
                        table += '<td>' + data.stockoutnormalOrderSum + '</td>';
                        table += '<td>' + data.stockoutnormalItemSum + '</td>';
                        table += '<td>' + data.stockoutVIPOrderSum + '</td>';
                        table += '<td>' + data.stockoutVIPItemSum + '</td>';
                    } else if (Id == 'purchase_return_stockin' || that.tempEchartsId == 'purchase_return_stockin') {
                        table += '<td>' + data.purchaseSum + '</td>';
                        table += '<td>' + data.otherSum + '</td>';
                    } else if (Id == 'return_stockout' || that.tempEchartsId == 'return_stockout') {
                        table += '<td>' + data.goodSum + '</td>';
                        table += '<td>' + data.defectiveSum + '</td>';
                        table += '<td>' + data.defectiveRateSum * 100 + '%' + '</td>';
                    }
                    table += '</tr></tbody></table>';
                    return table;
                }

                map.setOption(option);
                that.$nextTick(() => {
                    window.onresize = function () {
                        map.resize();
                    }
                })
            },
            exportAllData() {
                this.$Spin.show();
                let data = Util.deepClone(this.formSearch);
                data.month = Util.dateFormat(data.month, 'yyyy-MM');
                axios.get(apiMap.export_tps_excel.url,{
                    params:{
                        month: data.month,
                        warehouseCode: data.warehouseCode
                    }
                }).then(res=>{
                    window.open(`${window.location.origin}/eop/tps/export_tps_excel?warehouseCode=${data.warehouseCode}&month=${data.month}`);
                    this.$Spin.hide();
                }).catch(err=>{
                    this.$Spin.hide();
                })
            }
        }
    }
</script>
