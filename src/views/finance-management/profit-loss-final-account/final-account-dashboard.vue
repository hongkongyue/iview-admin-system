<template>
<div id='operation-dashboard-summary'>
    <div class="background-color-white exhibition">
        <Form :model="formSearch" class="search" ref="formSearch" :label-width="1" inline label-position="right"
            @keydown.native.enter="search">
            <Row>
                <Form-item label="日期：" :label-width="50">
                    <DatePicker type="month" :options="pickerOptions" v-model="formSearch.startMonth" @on-change='change' placeholder="选择开始月份" style="width: 120px;margin-right:3px;"></DatePicker>
                    <DatePicker type="month" :options="pickerOptions" v-model="formSearch.endMonth" @on-change='change' placeholder="选择结束月份" style="width: 120px"></DatePicker>
                </Form-item>
                <Form-item label="品牌：" :label-width="50">
                    <Select style="width:150px" v-model="formSearch.brandId" placeholder="请选择品牌" @on-change='change'>
                        <Option v-for="item in brandList" :value="item.id" :key="item.id">
                            {{item.brands }}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item label="版本：" :label-width="50">
                    <Select style="width:150px" v-model.number="formSearch.versionNumber" placeholder="请选择版本">
                        <Option v-for="item in version_list" :value="item.value" :key="item.value">
                            {{ item.label }}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item :label-width="1">
                    <Button type="primary" @click="search('formSearch')" icon="ios-search">搜索</Button>
                    <Button type="warning" @click="reset">重置</Button>
                    <Button type="primary" @click="print">导出</Button>                    
                </Form-item>
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
    <div class="background-color-white exhibition container">
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
    
</div>
</template>

<script>
    import Util from 'libs/util';
    
    function formSearch(){
        return {
            brandId:0,                   //  品牌id
            endMonth:'',                 //	结束日期
            startMonth:'',               //  开始日期
            versionNumber:'',            //  版本号
        }
    }


    export default {
        name: "final_account_dashboard",
        desc: '经营看板',
        data() {
            return {
                formSearch: formSearch(),
                brandList: [],
                analysis_board:{},
                analysis_board_detail:[],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6 - 1000 * 60 * 60 * 24
                    }
                },
                sort_value:'销售收入',
                version_list:[]
            }
        },
        computed: {

        },
        mounted() {
            this.getBrandList();
            // this.bi_final_board_version();
        },
        methods: {
            search(){
                let data = Util.deepClone(this.formSearch);
                
                if(data.startMonth){
                    data.startMonth = Util.dateFormat(this.formSearch.startMonth,'yyyy-MM');
                }
                if(data.endMonth){
                    data.endMonth = Util.dateFormat(this.formSearch.endMonth,'yyyy-MM');
                }
                
                data.brandId == 0 ? data.brandId = '' : data.brandId = data.brandId;        
                
                this.request('bi_final_board_total',{
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

                this.request('bi_final_board_detail',{
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
            change(){
                this.bi_final_board_version();
            },
            bi_final_board_version(){
                this.formSearch.versionNumber = '';
                let data = Util.deepClone(this.formSearch);
                
                if(data.startMonth){
                    data.startMonth = Util.dateFormat(this.formSearch.startMonth,'yyyy-MM');
                }
                if(data.endMonth){
                    data.endMonth = Util.dateFormat(this.formSearch.endMonth,'yyyy-MM');
                }
                
                data.brandId == 0 ? data.brandId = '' : data.brandId = data.brandId; 
                delete data.versionNumber;
                this.request('bi_final_board_version',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        this.version_list = [];
                        res.data.map(x=>{
                            this.version_list.push({
                                label:'V' + x + '.0',
                                value:x
                            })
                        })
                        this.version_list = this.version_list.sort((x,y)=>{
                            return x.value - y.value
                        })
                        this.formSearch.versionNumber = this.version_list[this.version_list.length - 1].value;
                        this.search();
                    }
                })
            },
            reset(){
                this.formSearch = formSearch();
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
                })
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
            print(){
                window.open('/WebReport/ReportServer?reportlet=Fin_income_profit.cpt&op=view');
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