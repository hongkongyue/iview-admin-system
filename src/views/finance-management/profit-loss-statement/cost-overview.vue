<template>
<div>
    <div class="background-color-white exhibition">
        <Form :model="formSearch" class="search" ref="formSearch" :label-width="80" inline label-position="right"
            @keydown.native.enter="search">
            <Row>
                <Form-item label="" :label-width="1">
                    <RadioGroup :value="TimeRangeValue" @on-change="changeTimeRange" type="button" style="margin-right:5px;">
                        <Radio label="昨日"></Radio>
                        <Radio label="本周"></Radio>
                        <Radio label="本月"></Radio>
                        <Radio label="全年"></Radio>
                    </RadioGroup>
                    　　　　 <DatePicker :options="pickerOptions" type="date" v-model="formSearch.startDate" placeholder="选择开始日期" style="width: 200px;margin-right:3px;"></DatePicker>
                    　 <DatePicker :options="pickerOptions" type="date" v-model="formSearch.endDate" placeholder="选择结束日期" style="width: 200px"></DatePicker>
                </Form-item>
                <Form-item label="品牌：">
                   <Select style="width:162px" v-model="formSearch.brandId" placeholder="请选择品牌" @on-change='search'>
                        <Option v-for="item in brandList" :value="item.id" :key="item.id">
                            {{ item.brands }}
                        </Option>
                    </Select>
                </Form-item>

                <Form-item :label-width="1">
                    <Button type="primary" @click="search('formSearch')" icon="ios-search">搜索</Button>
                    <Button type="warning" @click="reset">重置</Button>   
                    <Button type="success" @click="export_fixed_cost" v-if='activeTable == "fixed_cost"'>导出</Button>                                                 
                </Form-item>

            </Row>
        </Form>
    </div>
    <div style="height:5px;">
    </div>

    <div class="background-color-white exhibition">
        <Tabs @on-click="variable_cost" :value="activeTable">
            <TabPane label="变动费用" name="variable_cost">
                <Table size="small" :columns="variable_columns" :data="variable_List" class="margin-bottom-10"></Table>
                <Page :total="variable_total" :page-size="variable_pageSize" :current="variable_page" show-sizer show-total show-elevator @on-change="variable_CurrentChange" @on-page-size-change="variable_SizeChange"></Page>
            </TabPane>
            <TabPane label="固定费用" name="fixed_cost">
                <Table size="small" :columns="columns" :data="fixed_cost_list" class="margin-bottom-10"></Table>
                <Page :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
            </TabPane>
        </Tabs>
    </div>
</div>
</template>

<script>
    import Util from 'libs/util';
    function formSearch(){
        return {
            brandId:0,     //	品牌id	number	
            endDate:'',     //	结束日期	string	格式：yyyy-mm-dd
            startDate:'',   //	开始日期	string	格式：yyyy-mm-dd
        }
    }
    export default {
        name: "cost_overview",
        desc:'费用总览',
        data() {
            return {
                formSearch: formSearch(),
                brandList:[],
                columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                         title: '费用大类',
                         key: 'costType',
                         align: 'center',
                         minWidth: 150
                    },
                    {
                         title: '品牌',
                         key: 'brandName',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '金额',
                         key: 'fixedPrice',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '占比',
                         key: 'fixedRate',
                         align: 'center',
                         minWidth: 80
                    },
                    {
                         title: '唯品会MP',
                         key: 'vipmp',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '天猫',
                         key: 'tm',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '唯品会',
                         key: 'vip',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '京东',
                         key: 'jd',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '爱库存',
                         key: 'akc',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '好衣库',
                         key: 'hyc',
                         align: 'center',
                         minWidth: 100
                    },
                      {
                         title: '拼多多',
                         key: 'pdd',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '分期乐',
                         key: 'fql',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '小红书',
                         key: 'xhs',
                         align: 'center',
                         minWidth: 100
                    },{
                         title: '贝店',
                         key: 'bd',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '云集',
                         key: 'yj',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '大V店',
                         key: 'dvd',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '楚楚街',
                         key: 'ccj',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '苏宁特卖',
                         key: 'sntm',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '苏宁自营',
                         key: 'snzy',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '头号买手',
                         key: 'thms',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '宝贝仓',
                         key: 'bbc',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '环球捕手',
                         key: 'hqbs',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '蘑菇街',
                         key: 'mgj',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '达令家',
                         key: 'dlj',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '小小包',
                         key: 'xxb',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '网易考拉',
                         key: 'wykl',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '口袋通',
                         key: 'kdt',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '云集POP',
                         key: 'yjpop',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '当当网',
                         key: 'ddw',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '其他',
                         key: 'other',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '唯品会线下',
                         key: 'vipxx',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '共同承担',
                         key: 'shareSum',
                         align: 'center',
                         minWidth: 100
                    }
                ],
                fixed_cost_list:[],
                variable_columns:[
                    {
                         title: '费用大类',
                         key: 'taxDetailName',
                         align: 'center',
                         minWidth: 150
                    },
                    {
                         title: '费用明细',
                         key: 'feeDetailName',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '品牌',
                         key: 'brandName',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '金额',
                         key: 'price',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '占比',
                         key: 'rate',
                         align: 'center',
                         minWidth: 80
                    },
                    {
                         title: '唯品会MP',
                         key: 'vipmp',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '天猫',
                         key: 'tm',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '唯品会',
                         key: 'vip',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '京东',
                         key: 'jd',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '爱库存',
                         key: 'akc',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '好衣库',
                         key: 'hyc',
                         align: 'center',
                         minWidth: 100
                    },
                      {
                         title: '拼多多',
                         key: 'pdd',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '分期乐',
                         key: 'fql',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '小红书',
                         key: 'xhs',
                         align: 'center',
                         minWidth: 100
                    },{
                         title: '贝店',
                         key: 'bd',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '云集',
                         key: 'yj',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '大V店',
                         key: 'dvd',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '楚楚街',
                         key: 'ccj',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '苏宁特卖',
                         key: 'sntm',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '苏宁自营',
                         key: 'snzy',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '头号买手',
                         key: 'thms',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '宝贝仓',
                         key: 'bbc',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '环球捕手',
                         key: 'hqbs',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '蘑菇街',
                         key: 'mgj',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '达令家',
                         key: 'dlj',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '小小包',
                         key: 'xxb',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '网易考拉',
                         key: 'wykl',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '口袋通',
                         key: 'kdt',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '云集POP',
                         key: 'yjpop',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '当当网',
                         key: 'ddw',
                         align: 'center',
                         minWidth: 100
                    },
                    {
                         title: '唯品会线下',
                         key: 'vipxx',
                         align: 'center',
                         minWidth: 100
                    },
                     {
                         title: '其他',
                         key: 'other',
                         align: 'center',
                         minWidth: 100
                    }
                ],
                page:1,
                pageSize:10,
                total:0,
                TimeRangeValue:'昨日',
                activeTable:'variable_cost',
                variable_List:[],
                variable_page:1,
                variable_pageSize:10,
                variable_total:0,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6 - 1000 * 60 * 60 * 24
                    }
                }
            }
        },
        computed: {
          
        },
        watch:{
            "formSearch": {
                handler(newVal, oldVal) {
                    let endDate = Util.cutDate(new Date(), 1);
                    let startDate = Util.dateFormat(newVal.startDate,'yyyy-MM-dd');
                    if(Util.dateFormat(newVal.endDate,'yyyy-MM-dd') == endDate){
                        if(startDate == Util.cutDate(new Date(), 1)){
                            this.TimeRangeValue = '昨日';
                        }else if(startDate == Util.getWeekStartDate()){
                            this.TimeRangeValue = '本周'; 
                        }else if(startDate == Util.dateFormat(new Date().setDate(1),'yyyy-MM-dd')){
                            this.TimeRangeValue = '本月';
                        }else if(startDate == Util.getYearStartDate()){
                            this.TimeRangeValue = '全年'
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
            this.getBrandList();
            this.changeTimeRange('昨日');
        },
        methods: {
            get_fixed_cost(){
                let data = Util.deepClone(this.formSearch);
                if(!!data.startDate){
                    data.startDate = Util.dateFormat(data.startDate,'yyyy-MM-dd');
                }
                if(!!data.endDate){
                    data.endDate = Util.dateFormat(data.endDate,'yyyy-MM-dd');   
                }
                if(this.formSearch.startDate > this.formSearch.endDate){
                    this.$Message.warning('日期选择有误，请重新选择！');
                    return false;
                };
                data.start = (this.page - 1) * this.pageSize;
                data.length = this.pageSize;    
                this.request('get_fixed_cost',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.fixedCostList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        res.data.fixedCostList.map(x=>{
                            x.fixedRate = parseFloat(x.fixedRate * 100).toFixed(2) + '%'
                        })
                        this.fixed_cost_list = res.data.fixedCostList;
                        this.total = res.data.count;
                        let lastPage = Math.ceil(this.total / this.pageSize);

                        if(this.page == lastPage){
                            let fixedCostTotal = res.data.fixedCostTotal;
                            fixedCostTotal.serialNo = '合计';
                            this.fixed_cost_list.push(fixedCostTotal);
                        }
                    }
                })
            },
            get_variable_cost(){
                let data = Util.deepClone(this.formSearch);
                if(!!data.startDate){
                    data.startDate = Util.dateFormat(data.startDate,'yyyy-MM-dd');
                }
                if(!!data.endDate){
                    data.endDate = Util.dateFormat(data.endDate,'yyyy-MM-dd');   
                }
                if(this.formSearch.startDate > this.formSearch.endDate){
                    this.$Message.warning('日期选择有误，请重新选择！');
                    return false;
                };
                data.start = (this.variable_page - 1) * this.variable_pageSize;
                data.length = this.variable_pageSize;
                this.request('get_variable_cost',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        res.data.variableCostList.map(x=>{
                            x.rate = parseFloat(x.rate * 100).toFixed(2) + '%';
                        })
                        this.variable_List = res.data.variableCostList;
                        this.variable_total = res.data.count;
                        let lastPage = Math.ceil(this.variable_total / this.variable_pageSize);

                        if(this.variable_page == lastPage){
                            let variableCostTotal = res.data.variableCostTotal;
                            variableCostTotal.taxDetailName = '合计';
                            this.variable_List.push(variableCostTotal);
                        }
                    }
                })
            },
            search(){
                if(this.activeTable == 'fixed_cost'){
                    this.get_fixed_cost();
                }else{
                    this.get_variable_cost();
                }
            },
            reset(){
                this.formSearch = formSearch();
                this.TimeRangeValue = '昨日';
                this.formSearch.startDate = Util.cutDate(new Date(), 1);
                this.formSearch.endDate = Util.cutDate(new Date(), 1);
                if(this.activeTable == 'fixed_cost'){
                    this.page = 1;
                    this.get_fixed_cost();
                }else{
                    this.variable_page = 1;
                    this.get_variable_cost();
                }
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
            changeTimeRange(data){
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
                }else if(data=='全年'){
　　　　　　　　　 　this.formSearch.startDate = Util.getYearStartDate()
                }
                this.search();
            },
            variable_cost(value){
                this.activeTable = value;
                if(value == 'fixed_cost'){
                    this.get_fixed_cost();
                }else{
                    this.get_variable_cost();
                }
            },
            export_fixed_cost(){
                let data = Util.deepClone(this.formSearch);
                if(!!data.startDate){
                    data.startDate = Util.dateFormat(data.startDate,'yyyy-MM-dd');
                }
                if(!!data.endDate){
                    data.endDate = Util.dateFormat(data.endDate,'yyyy-MM-dd');   
                }
                if(this.formSearch.startDate > this.formSearch.endDate){
                    this.$Message.warning('日期选择有误，请重新选择！');
                    return false;
                };
                this.request('export_fixed_cost',data,true).then(res=>{
                    if(res.code == 1){
                        this.$Message.success(res.msg);
                        if(!!res.data){
                            if(document.location.href.indexOf('localhost')>0||document.location.href.indexOf('127.0.0.1')>0){
                                window.open('http://127.0.0.1:8360'+res.data)
                            }else{
                                window.open(res.data)
                            }
                        }
                    }else{
                        this.$Message.warning(res.message);
                    }
                })
            },
            CurrentChange(val){
                this.page = val;
                this.get_fixed_cost();
            },
            SizeChange(val){
                this.pageSize = val;
                this.get_fixed_cost();
            },
            variable_CurrentChange(val){
                this.variable_page = val;
                this.get_variable_cost();
            },
            variable_SizeChange(val){
                this.variable_pageSize = val;
                this.get_variable_cost();
            }
        }
    }
</script>

<style>
   
</style>