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
                    　　<DatePicker type="date"  :options="pickerOptions" v-model="formSearch.startDate" placeholder="选择开始日期" style="width: 180px;margin-right:3px;"></DatePicker>
                    　 <DatePicker type="date"  :options="pickerOptions" v-model="formSearch.endDate" placeholder="选择结束日期" style="width: 180px"></DatePicker>
                </Form-item>
                <Form-item label="">
                    <Select style="width:162px" v-model="formSearch.brandId" placeholder="请选择品牌" @on-change='search'>
                        <Option v-for="item in brandList" :value="item.id" :key="item.id">
                            {{item.brands }}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item label="平台名称:" :label-width='70' v-if='activeTable == "TM"'>
                    <Select style="width:120px" v-model="formSearch.platfromCode" @on-change='search' placeholder="请选择平台">
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
         <Tabs type="card" @on-click="tabClick" :value="activeTable">
            <TabPane label="天猫" name="TM">
                <Col class="margin-bottom-10">
                    <Table :columns="TM_columns" size="small" :data="TM_List"></Table>
                </Col>
                <Col>
                    <Page :total="TM_total" :page-size="TM_pageSize" :current="TM_page"  show-sizer show-total show-elevator @on-change="TM_CurrentChange" @on-page-size-change="TM_SizeChange"></Page>
                </Col>
            </TabPane>
            <TabPane label="唯品会" name="VIP">
            <Row>
                <Col class="margin-bottom-10">
                    <Table :columns="VIP_columns" size="small" :data="VIP_List"></Table>
                </Col>
                <Col>
                    <Page :total="VIP_total" :page-size="VIP_pageSize" :current="VIP_page"  show-sizer show-total show-elevator @on-change="VIP_CurrentChange" @on-page-size-change="VIP_SizeChange"></Page>
                </Col>
            </Row>
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
        name: "variable_cost",
        desc: '变动费用',
        data() {
            return {
                formSearch: formSearch(),
                brandList: [],
                TM_total:100,
                TM_pageSize:10,
                TM_page:1,
                VIP_total:0,
                VIP_pageSize:10,
                VIP_page:1,
                TM_List:[],
                TM_columns: [
                    {
                        title: '平台名称',
                        key: 'platfromName',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '日期',
                        key: 'dateTime',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '刮刮卡',
                        key: 'scratchCard',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '售后卡',
                        key: 'afterCard',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '二合一售后卡',
                        key: 'twoInOneAfterCard',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '气泡袋',
                        key: 'bubbleBag',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '销售佣金',
                        key: 'salesCommission',
                        align: 'center',
                        width: 100
                    },
                     {
                        title: '保险理赔',
                        key: 'insurance',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '退货包运费',
                        key: 'backFreight',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '广告费',
                        key: 'tmAdFee',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '城建税、地方教育税附加',
                        key: 'additionalTax',
                        align: 'center',
                        width: 150
                    },
                      {
                        title:'印花税',
                        key: 'stampTax',
                        align: 'center',
                        width: 150
                    },
                    {
                        title:'短信或营销费用',
                         key: 'messagePrice',
                        align: 'center',
                        width: 150
                    },
                     {
                        title:'仓库快递费',
                         key: 'warehouseFreight',
                        align: 'center',
                        width: 150
                    },
                     {
                        title:'研发费用',
                         key: 'researchFee',
                        align: 'center',
                        width: 150
                    },
                    {
                        title:'微信红包',
                         key: 'weixinUsed',
                        align: 'center',
                        width: 150
                    },
                    {
                        title:'劳务费用',
                        key: 'serviceFee',
                        align: 'center',
                        width: 150
                    },
                    {
                        title:'报废损失',
                        key: 'tmWaste',
                        align: 'center',
                        width: 150
                    },
                      {
                        title:'合计',
                        key: 'variableSum',
                        align: 'center',
                        width: 150
                    }
                ],
                VIP_columns: [{
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '日期',
                        key: 'dateTime',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '唯品会纸箱费',
                        key: 'vipBoxAmount',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '唯品会端广告费',
                        key: 'vipAdFee',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '跨月物流费',
                        key: 'kyexpress',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '劳务费',
                        key: 'serviceFee',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '城建税教育费附加',
                        key: 'additionalTax',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '印花税',
                        key: 'stampTax',
                        align: 'center',
                        width: 150
                    },
                    {
                        title:'研发费用',
                        key: 'researchFee',
                        align: 'center',
                        width: 150
                    },
                    {
                        title:'变动费用',
                        key: 'researchFee',
                        align: 'center',
                        width: 150
                    },
                    {
                        title:'报废损失',
                        key: 'vipWaste',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '合计',
                        key: 'variableSum',
                        align: 'center',
                        width: 150
                    },
                ],
                VIP_List: [],
                activeTable:'TM',
                TimeRangeValue:'昨日',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6 - 1000 * 60 * 60 * 24
                    }
                },
                platformList:[]
            }
        },
        computed: {

        },
        mounted() {
            this.changeTimeRange('昨日');
            this.getBrandList();
            this.getPlatformList();
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
        methods: {
            getPlatformList() {
                this.request('get_platform_list', {}, false).then((res) => {
                    this.platformList = res.data
                    this.platformList.unshift({
                        PLATFROM_ID: 0,
                        PLATFROM_NAME: '所有平台'
                    })
                })
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
            setFormData(val){
                var formSearch = Util.deepClone(this.formSearch);
                let Data = {};      
                if(val == 'TM'){
                    Data.length = this.TM_pageSize;
                    Data = Object.assign(Data,formSearch);
                }else{
                    Data.length = this.VIP_pageSize;
                    Data = Object.assign(Data,formSearch);
                }
                return Data
            },
            search(){
                let Data = this.setFormData(this.activeTable);
                if(this.activeTable == 'TM'){
                    this.TM_page = 1;
                    Data.start = 0;
                    this.getTMData(Data);
                }else{
                    this.VIP_page = 1;
                    Data.start = 0;
                    this.getVIPData(Data);
                }
            },
            reset(){
                this.formSearch = formSearch();
                this.formSearch.startDate = Util.cutDate(new Date(), 1);
                this.formSearch.endDate = Util.cutDate(new Date(), 1);
                this.TimeRangeValue = '昨日';
                this.page = 1;
                if(this.activeTable == 'TM'){
                    let Data = {};
                    Data.start = 0;
                    Data.length = this.TM_pageSize;
                    Data = Object.assign(Data,this.formSearch);
                    this.getTMData(Data);
                }else{
                    let Data = {};
                    Data.start = 0;
                    Data.length = this.VIP_pageSize;
                    Data = Object.assign(Data,this.formSearch);
                    this.getVIPData(Data);
                }
            },
            getTMData(data){
                if(data.startDate){
                    data.startDate = Util.dateFormat(data.startDate,'yyyy-MM-dd');
                }
                if(data.endDate){
                    data.endDate = Util.dateFormat(data.endDate,'yyyy-MM-dd');
                }
                if(this.formSearch.startDate > this.formSearch.endDate){
                    this.$Message.warning('日期选择有误，请重新选择！');
                    return false;
                }
                data.brandId == 0 ? data.brandId = '' : data.brandId = data.brandId;        
                
                this.request('get_variable_tm',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        let serialNoBegain = this.TM_pageSize * (this.TM_page - 1);
                        res.data.variableTMList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.TM_total = res.data.count;
                        this.TM_List = res.data.variableTMList;
                        let lastPage = Math.ceil(this.TM_total / this.TM_pageSize);

                        if(this.TM_page == lastPage){
                            let biVariableCostTMListTotal = res.data.biVariableCostTMListTotal;
                            biVariableCostTMListTotal.brandName = '合计';
                            this.TM_List.push(biVariableCostTMListTotal);
                        }
                    }
                })
            },
            getVIPData(data){
                if(data.startDate){
                    data.startDate = Util.dateFormat(data.startDate,'yyyy-MM-dd');
                }
                if(data.endDate){
                    data.endDate = Util.dateFormat(data.endDate,'yyyy-MM-dd');
                }
                if(this.formSearch.startDate > this.formSearch.endDate){
                    this.$Message.warning('日期选择有误，请重新选择！');
                    return false;
                }
                data.brandId == 0 ? data.brandId = '' : data.brandId = data.brandId;        
                
                this.request('get_variable_vip',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        let serialNoBegain = this.VIP_pageSize * (this.VIP_page - 1);
                        res.data.variableVIPList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.VIP_total = res.data.count;
                        this.VIP_List = res.data.variableVIPList;
                        let lastPage = Math.ceil(this.VIP_total / this.VIP_pageSize);

                        if(this.VIP_page == lastPage){
                            let biVariableCostVIPListTotal = res.data.biVariableCostVIPListTotal;
                            biVariableCostVIPListTotal.brandName = '合计';
                            this.VIP_List.push(biVariableCostVIPListTotal);
                        }
                    }
                })
            },
            tabClick(val){
                this.activeTable = val;
                let Data = this.setFormData(val);
                if(this.activeTable == 'TM'){
                    Data.start = (this.TM_page - 1) * this.TM_pageSize;
                    this.getTMData(Data);
                }else{
                    Data.start = (this.VIP_page - 1) * this.VIP_pageSize;                    
                    this.getVIPData(Data);
                }
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
            exportData(){
                let data = Util.deepClone(this.formSearch);
                if(!data.startDate || !data.endDate){
                    this.$Message.warning('请选择日期！');
                    return false;
                }
                !!data.startDate?data.startDate = Util.dateFormat(this.formSearch.startDate,'yyyy-MM-dd'):data.startDate = '';
                !!data.endDate?data.endDate = Util.dateFormat(this.formSearch.endDate,'yyyy-MM-dd'):data.endDate = '';
                data.brandId == 0 ? data.brandId = '' : data.brandId = this.formSearch.brandId;
                data.platform = this.activeTable;
                this.request('export_variable_cost',data,true).then(res=>{
                    if(res.code=='1'){
                        this.$Message.success(res.msg);
                        if(document.location.href.indexOf('localhost')>0||document.location.href.indexOf('127.0.0.1')>0){
                            window.open('http://127.0.0.1:8360'+res.data)
                        }else{
                            window.open(res.data)
                        }
                    }
                })
            },
            TM_CurrentChange(val){
                this.TM_page = val;
                let Data = this.setFormData(this.activeTable);
                Data.start = (this.TM_page - 1) * this.TM_pageSize;
                this.getTMData(Data);
            },
            TM_SizeChange(val){
                this.TM_pageSize = val;
                let Data = this.setFormData(this.activeTable);
                Data.start = (this.TM_page - 1) * this.TM_pageSize;
                this.getTMData(Data);
            },
            VIP_CurrentChange(val){
                this.VIP_page = val;
                let Data = this.setFormData(this.activeTable);
                Data.start = (this.VIP_page - 1) * this.VIP_pageSize;
                this.getVIPData(Data);
            },
            VIP_SizeChange(val){
                this.VIP_pageSize = val;
                let Data = this.setFormData(this.activeTable);
                Data.start = (this.VIP_page - 1) * this.VIP_pageSize;
                this.getVIPData(Data);
            }
        }
    }
</script>

<style>
   
</style>