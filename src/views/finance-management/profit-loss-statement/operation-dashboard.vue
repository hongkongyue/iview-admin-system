<template>
<div id='operation-dashboard-summary'>
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
                    　　<DatePicker type="date" :options="pickerOptions" v-model="formSearch.startDate" placeholder="选择开始日期" style="width: 200px;margin-right:3px;"></DatePicker>
                    　 <DatePicker type="date" :options="pickerOptions" v-model="formSearch.endDate" placeholder="选择结束日期" style="width: 200px"></DatePicker>
                </Form-item>
                <Form-item label="">
                    <Select style="width:162px" v-model="formSearch.brandId" placeholder="请选择品牌" @on-change='search'>
                        <Option v-for="item in brandList" :value="item.id" :key="item.id">
                            {{item.brands }}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item :label-width="1">
                    <Button type="primary" @click="search('formSearch')" icon="ios-search">搜索</Button>
                    <Button type="warning" @click="reset">重置</Button>
                     <Button type="primary" @click="impor">导出</Button>
                     
                </Form-item>
                <div :label-width="1" style="float:right">
                    <p style="color:red">唯品会数据刷新时间：{{newTime}}</p>
                    <p style="color:red">天猫小平台数据刷新时间：{{newTimeTwo}}</p>
                    <p style="color:red">看板最后刷新时间：{{newTimeThree}}</p>
                </div>
            </Row>
        </Form>
    </div>
    <div style="height:5px;">
    </div>
    <div class="background-color-white exhibition operation-dashboard-summary">
        <Card>
            <p slot="title" style="font-size:20px">损益总览</p>
            <Row type="flex" justify="space-around" class="code-row-bg">
                <Col span="3">
                <div>
                    <p class="title">总销售收入</p>
                    <p class="content">¥ {{analysis_board.salesAmount | toThousands}}</p>
                </div>
                </Col>
                <Col span="3">
                <div>
                    <p class="title">总销售成本</p>
                    <p class="content">¥ {{analysis_board.costAmount | toThousands}}</p>
                </div>
                </Col>
                <Col span="3">
                <div>
                    <p class="title">总毛利</p>
                    <p class="content">¥ {{analysis_board.grossAmount | toThousands}}</p>
                </div>
                </Col>
                <Col span="3">
                <div>
                    <p class="title">总毛利率</p>
                    <p class="content" style="color:#FF83FA; border:2px dotted #FF83FA">{{!!analysis_board.grossRate?analysis_board.grossRate:0}}%</p>
                </div>
                </Col>
                <Col span="3">
                <div>
                    <p class="title">总固定费用</p>
                    <p class="content">¥ {{analysis_board.fixedAmount | toThousands}}</p>
                </div>
                </Col>
                <Col span="3">
                <div>
                    <p class="title">总变动费用</p>
                    <p class="content">¥ {{analysis_board.variableAmount | toThousands}}</p>
                </div>
                </Col>
                <Col span="3">
                <div>
                    <p class="title">总净利润</p>
                    <p class="content" style="color:#FF7F00">¥ {{analysis_board.netAmount | toThousands}}</p>
                </div>
                </Col>
                <Col span="3">
                <div>
                    <p class="title">总净利润率</p>
                    <p class="content" style="color:#FF7F00; border:2px dotted #FF7F00">{{!!analysis_board.netRate?analysis_board.netRate:0 }}%</p>
                </div>
                </Col>
            </Row>
        </Card>
    </div>
    <div style="height:5px;"></div>
    <div class="background-color-white exhibition operation-dashboard-summary margin-bottom-">
        <RadioGroup :value="sort_value" type="button" size="large"  @on-change="changeSortvalue">
            <Radio label="销售收入" name='sales'></Radio>
            <Radio label="销售成本" name='cost'></Radio>
            <Radio label="毛利润" name='gross'></Radio>
            <Radio label="毛利率" name='grossRate'></Radio>
            <Radio label="净利润" name='net'></Radio>
            <Radio label="净利润率" name='netRate'></Radio>
            <Radio label="固定费用" name='fixed'></Radio>
            <Radio label="变动费用" name='variable'></Radio>
        </RadioGroup>
    </div>
    <div style="height:5px;"></div>
    <!-- <div class="background-color-white exhibition">
        <Row type="flex" justify="end">
            <Col　>
            <Tooltip placement="top" content="切换视图">
                <RadioGroup v-model="showType" type="button">
                    <Radio label="grid">
                        <Icon type="grid" size="15"></Icon>
                    </Radio>
                    <Radio label="chart">
                        <Icon type="stats-bars" size="15"></Icon>
                    </Radio>
                </RadioGroup>
            </Tooltip>
            </Col>
        </Row>
    </div> -->
    <div v-show="showType=='grid'" class="background-color-white exhibition container">
        <Row  class="code-row-bg" :gutter="24">
            <Col span="8"  v-for="(item,index) in analysis_board_detail" :key="index" style="margin-bottom:20px;">
            <Card>
                <span slot="title">{{item.platfromName}}</span>
                　<Row>
                    <Col span="12">
                        <p>销售收入</p>
                        <p style="color:black;font-weight:bold;">￥ {{item.sales | toThousands}}</p>
                    </Col>
                    <Col span="12">
                        <p>销售成本</p>
                        <p  style="color:black;font-weight:bold;">￥ {{item.cost | toThousands}}</p>
                    </Col>　　　　
                </Row>
                <Row　class="margin-top-10">
                    <Col span="12">
                        <p>毛利润</p>
                        <p  style="color:black;font-weight:bold;">￥ {{item.gross | toThousands}}</p>
                    </Col>
                    <Col span="12">
                        <p>毛利率</p>
                        <p  style="color:#2d8cf0;font-weight:bold;">{{item.grossRate}}</p>
                    </Col>
                    　　　　
                </Row>
                <Row class="margin-top-10">
                    <Col span="12">
                        <p>净利润</p>
                        <p  style="color:red;font-weight:bold;">￥ {{item.net | toThousands}}</p>
                    </Col>
                    <Col span="12">
                        <p>净利润率</p>
                        <p  style="color:red;font-weight:bold;">{{item.netRate}}</p>
                    </Col>
                    　　　　
                </Row>
                <div class="ivu-card-head" style="padding:7px 8px"><span></span></div>
                <Row class="margin-top-10">
                    <Col span="12">
                        <p>固定费用</p>
                        <p  style="color:black;font-weight:bold;">￥ {{item.fixed | toThousands}}</p>
                    </Col>
                    <Col span="12">
                        <p>变动费用</p>
                        <p  style="color:black;font-weight:bold;">￥ {{item.variable | toThousands}}</p>
                    </Col>
                </Row>
            </Card>
            </Col>
        </Row>
    </div>
    <div v-if="showType=='chart'" class="background-color-white exhibition">
        <Row type="flex" justify="left">
            <Col span="8">
            <v-chart :forceFit="true" :height="height" :data="data">
                <v-tooltip />
                <v-axis />
                <v-legend />
                <v-stack-bar position="月份*月均降雨量" color="name" />
            </v-chart>
            </Col>
            <Col span="7">
            <v-chart :forceFit="false" height="500" :data="data2" :scale="scale">
                <v-tooltip :showTitle="false" dataKey="item*percent" />
                <v-axis />
                <v-legend dataKey="item" />
                <v-pie position="percent" color="item" :v-style="pieStyle" :label="labelConfig" />
                <v-coord type="theta" />
            </v-chart>
            </Col>
            <Col span="7">
             <div>
                <v-chart :forceFit="false" :height="height" :data="data2" :scale="scale">
                <v-tooltip :showTitle="false" dataKey="item*percent" />
                <v-axis />
                <v-legend dataKey="item" />
                <v-pie position="percent" color="item" :v-style="pieStyle" :label="labelConfig" />
                <v-coord type="theta" />
            </v-chart>
             </div>
            </Col>
        </Row>
    </div>
</div>
</template>

<script>
    import Util from 'libs/util';
    
    function formSearch(){
        return {
            brandId:0,                 //  品牌id
            endDate:'',                 //	结束日期
            startDate:''                //  开始日期
        }
    }

    const sourceData = [{
            name: 'London',
            'Jan.': 18.9,
            'Feb.': 28.8,
            'Mar.': 39.3,
            'Apr.': 81.4,
            'May': 47,
            'Jun.': 20.3,
            'Jul.': 24,
            'Aug.': 35.6
        },
        {
            name: 'Berlin',
            'Jan.': 12.4,
            'Feb.': 23.2,
            'Mar.': 34.5,
            'Apr.': 99.7,
            'May': 52.6,
            'Jun.': 35.5,
            'Jul.': 37.4,
            'Aug.': 42.4
        },
    ];

    const dv = new DataSet.View().source(sourceData);
    dv.transform({
        type: 'fold',
        fields: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.'],
        key: '月份',
        value: '月均降雨量',
    });
    const data = dv.rows;

    const sourceData2 = [{
            item: '事例一',
            count: 40
        },
        {
            item: '事例二',
            count: 21
        },
        {
            item: '事例三',
            count: 17
        },
        {
            item: '事例四',
            count: 13
        },
        {
            item: '事例五',
            count: 9
        }
    ];

    const scale = [{
        dataKey: 'percent',
        min: 0,
        formatter: '.0%',
    }];

    const dv2 = new DataSet.View().source(sourceData2);
    dv2.transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        as: 'percent'
    });

    export default {
        name: "operation_dashboard",
        desc: '经营看板',
        data() {
            return {
                newTime:'',
                newTimeTwo:'',
                newTimeThree:'',
                formSearch: formSearch(),
                showType: 'grid',
                brandList: [],
                data: [],
                data2: [],
                height: 500,
                scale,
                pieStyle: {
                    stroke: "#fff",
                    lineWidth: 1
                },
                labelConfig: ['percent', {
                    offset: -40,
                    textStyle: {
                        rotate: 0,
                        textAlign: 'center',
                        shadowBlur: 2,
                        shadowColor: 'rgba(0, 0, 0, .45)'
                    }
                }],
                analysis_board:{},
                analysis_board_detail:[],
                TimeRangeValue:'昨日',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6 - 1000 * 60 * 60 * 24
                    }
                },
                sort_value:'销售收入'
            }
        },
        computed: {

        },
        watch:{
            "formSearch": {
                handler(newVal, oldVal) {
                    let endDate = this.getLastDate();
                    let startDate = Util.dateFormat(newVal.startDate,'yyyy-MM-dd');
                    if(Util.dateFormat(newVal.endDate,'yyyy-MM-dd') == endDate){
                        if(startDate == Util.dateFormat(this.getLastDate(),'yyyy-MM-dd')){
                            this.TimeRangeValue = '昨日';
                        }else if(startDate == Util.getWeekStartDate()){
                            this.TimeRangeValue = '本周'; 
                        }else if(startDate == Util.dateFormat(new Date().setDate(1),'yyyy-MM-dd')){
                            this.TimeRangeValue = '本月';
                        }else{
                            this.TimeRangeValue = ''
                        }
                    }else{
                        this.TimeRangeValue = ''
                    }
                },
                deep: true
            }
        },
        mounted() {
            this.getNewTime()
            this.changeTimeRange('昨日')
            this.getBrandList();
            this.data = dv.rows;
            this.data2 = dv2.rows
        },
        methods: {
            getNewTime(){
                this.request('bi_get_update_time', {}, false).then((res) => {
                if (res.code == 1) {
                    this.newTime = res.data.VIP
                    this.newTimeTwo = res.data.TM
                    this.newTimeThree = res.data.OTHER
                }
            })
            },
            search(){
                this.getNewTime();
                let data = Util.deepClone(this.formSearch);
                
                if(data.startDate){
                    data.startDate = Util.dateFormat(this.formSearch.startDate,'yyyy-MM-dd');
                }
                if(data.endDate){
                    data.endDate = Util.dateFormat(this.formSearch.endDate,'yyyy-MM-dd');
                }
                if(this.formSearch.startDate > this.formSearch.endDate){
                    this.$Message.warning('日期选择有误，请重新选择！');
                    return false;
                }
                data.brandId == 0 ? data.brandId = '' : data.brandId = data.brandId;        
                
                
                this.request('get_broad_status',{
                    data:data
                },false).then(res=>{
                    if(res.code == 1){
                        if(res.data.status == 0){
                            this.$Notice.warning({
                                title: '提示',
                                duration:0,
                                desc: res.data.message
                            });
                        }else if (res.data.status == 2){
                            this.$Notice.error({
                                title: '提示',
                                duration:0,
                                desc: res.data.message
                            });
                        }
                    }
                });

                this.request('bi_analysis_board_total',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        if(res.data.data.length > 0 && res.data.data.length == 1 ){
                            res.data.data.map(x=>{
                                x.grossRate = parseFloat(x.grossRate * 100).toFixed(2) ;
                                x.netRate = parseFloat(x.netRate * 100).toFixed(2);
                            })
                            this.analysis_board = res.data.data[0];
                        }
                    }
                })

                this.request('bi_analysis_board_detail',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        res.data.data.map(x=>{
                            x.grossRate = parseFloat(x.sales) < 0 && parseFloat(x.gross) < 0 ? '-' : parseFloat(x.grossRate * 100).toFixed(2) + '%';
                            x.netRate = parseFloat(x.sales) < 0 && parseFloat(x.net) < 0 ? '-' : parseFloat(x.netRate * 100).toFixed(2) + '%';
                        })
                        this.analysis_board_detail = res.data.data;
                        this.changeSortvalue(this.sort_value);
                    }
                })
            },
            impor(){
                window.open("http://192.168.30.202:8080/WebReport/ReportServer?reportlet=RealFile/profit/profit_sign.cpt");
            },
            reset(){
                this.formSearch = formSearch();
                this.TimeRangeValue = '昨日';
                this.formSearch.startDate = this.getLastDate();
                this.formSearch.endDate = this.getLastDate();
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
                        id:0,
                        brands:'所有品牌'
                    })
                    this.brandList = this.brandList.filter(x=>{
                        return x.id != '51594' && x.id != '51609'
                    })
                })
            },
            changeTimeRange(data) {
                this.formSearch.endDate = this.getLastDate()
                if (data == '昨日') {
                    this.formSearch.startDate = this.getLastDate();
                    this.TimeRangeValue = '昨日';
                } else if (data == '本周') {
                    this.formSearch.startDate = this.getWeekStartDate();
                    this.TimeRangeValue = '本周';                    
                } else if (data == '本月') {
                    this.TimeRangeValue = '本月';                    
                    this.formSearch.startDate = this.getMonthStartDate()
                }
                this.search();
            },
            changeSortvalue(value){
                this.sort_value = value;
                let name = '';
                switch(value){
                    case '销售收入':
                        name = 'sales';
                        break;
                    case '销售成本':
                        name = 'cost';
                        break;
                    case '毛利润':
                        name = 'gross';
                        break;
                    case '毛利率':
                        name = 'grossRate';
                        break;
                    case '净利润':
                        name = 'net';
                        break;
                    case '净利润率':
                        name = 'netRate';
                        break;
                    case '固定费用':
                        name = 'fixed';
                        break;
                    case '变动费用':
                        name = 'variable';
                        break;
                    default:
                        break;
                }
                let data = Util.deepClone(this.analysis_board_detail);
                data.map(x=>{
                    if(name == 'grossRate' || name == 'netRate'){
                        x[name] = x[name].substr(0,x[name].length - 1)
                    }
                })
                
                this.analysis_board_detail = data.sort((x,y)=>{
                    return y[name] - x[name]
                })
                this.analysis_board_detail.map(x=>{
                    if(name == 'grossRate'){
                        x.grossRate += '%';
                    }
                    if(name == 'netRate'){
                        x.netRate += '%';
                    }
                })
            },
            getLastDate() {
                //当日07:00之前 返回前天 07:00以后返回昨天
                var now = Util.dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss').replace(/-/g, "/")
                var d2 = Util.dateFormat(new Date(), 'yyyy-MM-dd 07:00:00').replace(/-/g, "/")
                if (Date.parse(now) - Date.parse(d2) > 0) {
                    return Util.cutDate(new Date(), 1)
                } else {
                    return Util.cutDate(new Date(), 2)
                }
            },
            getWeekStartDate() {
                 var weekDate = Util.dateFormat(Util.getWeekStartDate(), 'yyyy-MM-dd hh:mm:ss').replace(/-/g, "/")
                 var d2 = Util.dateFormat(this.getLastDate(), 'yyyy-MM-dd hh:mm:ss').replace(/-/g, "/")
                 if (Date.parse(weekDate) - Date.parse(d2) < 0) {
                     return Util.getWeekStartDate()
                 } else {
                     return this.getLastDate()
                 }
             },
             getMonthStartDate(){
                var date = new Date();
                date.setDate(1);
                date  = Util.dateFormat(date, 'yyyy-MM-dd hh:mm:ss').replace(/-/g, "/")
                var d2 = Util.dateFormat(this.getLastDate(), 'yyyy-MM-dd hh:mm:ss').replace(/-/g, "/")
                    if (Date.parse(date) - Date.parse(d2) < 0) {
                     return Util.dateFormat(date, 'yyyy-MM-dd')
                 } else {
                     return this.getLastDate()
                 }
             }
        }
    }
</script>

<style lang="less">

.operation-dashboard-summary{
   .content{
       font-size:15px;
       font-weight: bold;
   }
   .title{
       font-size:16px;
       padding-bottom: 10px;
   }
    .ivu-col-span-3{
        text-align: center;
    }
    
}
#operation-dashboard-summary .container .ivu-card-head{
    text-align: center;
    font-weight: bold;
    font-size:18px;
}

#operation-dashboard-summary .container{
    font-size:15px;
    color: grey;
}

</style>