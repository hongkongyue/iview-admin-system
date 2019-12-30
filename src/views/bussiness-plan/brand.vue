<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">   
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="品牌:"  :label-width="50">
                     <Select v-model="formSearch.brand" style="width:120px" :multiple="true">
                              <Option v-for="item in brandList" :value="item.brandId" :key="item.brandId">{{ item.brandName }}</Option>
                      </Select>
                </Form-item>
                <Form-item label="季节:" >
                      <Select v-model="formSearch.season" style="width:120px" :multiple="true" >
                              <Option v-for="item in seasonList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                </Form-item>
                <Form-item label="年份:">
                    <Col span="12">
                        <DatePicker  type="year" v-model="formSearch.date" placeholder="请选择年份" style="width: 120px"></DatePicker>
                    </Col>
                </Form-item>
                 <Form-item label="波段:">
                                　<Select v-model="formSearch.wave" style="width:120px">
                                    <Option v-for="item in waveList" :value="item.WAVE_BAND" :key="item.WAVE_BAND">
                                        {{ item.WAVE_BAND }}
                                    </Option>
                                </Select>
                </Form-item>
                <Form-item :label-width="1">
                     <Button type="primary" @click="search">查询</Button>
                     <Button type="default" @click="handleReset">重置</Button>
                     <Button type="primary" @click="exportEmployee">导出</Button>
                </Form-item>
                </Col>
            </Form>
            
        </Row>
        <!-- 数据列表 -->
        <Row class="background-color-white exhibition">
            <Table :columns="columns" size="small" highlight-row :data="list" @on-row-dblclick="edit"></Table>
            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total
                show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
        </Row>
        <Modal v-model="visible" title="详情" @on-ok='save' @on-cancel='cancel' :width="80" class-name="customize-modal-center">
           <Row class="margin-bottom-10 background-color-white exhibition">   
            <Form :model="FormList" ref="FormList" :label-width="90" inline 
                label-position="right" style="50px">
                    <Form-item label="品牌:">
                        <Input v-model="formList.brandName" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="季节:">
                        <Input v-model="formList.season" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="年份:">
                        <Input v-model="formList.years" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="波段:">
                        <Input v-model="formList.waveBand" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                   <Form-item label="规划开发时间:">    
                        <Input v-model="formList.planDevDate" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="规划交接完成:">  
                        <Input v-model="formList.planDeliverDate" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="齐色样时间：">  
                        <Input v-model="formList.colorSimpleDate" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="规划到货时间:">  
                        <Input v-model="formList.planArriveDate" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                   <Form-item label="开发款数:">    
                        <Input v-model="formList.devStyleQty" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                   <Form-item label="备注:">
                        <Input v-model="formList.brandRemark" type='textarea'  placeholder="请输入备注" style="width: 220px"></Input>
                    </Form-item>
            </Form>
             <!-- 联动数据列表 -->
                <Row class="background-color-white exhibition">
                    <Tabs type="card" @on-click='getList' value='kfmx'>
                        <TabPane label="开发明细" name='kfmx'>
                            <Table border :columns="columnskfmx"  highlight-row :data="detailList"></Table>
                        </TabPane>
                    </Tabs>
                </Row>
                <div slot="footer">
                    <Button type="default" @click="cancel">取消</Button>
                    <Button type="primary" @click="save">保存</Button>
                </div>
            </Row>
        </Modal>

    </div>
</template>

<script>
    import Util from 'libs/util';
    function formSearch() {
        return {
            search: ''
        }
    }
    export default {
        name:'brand',
        data() {
            return {
                columns: [
                    // {
                    //     title: 'ID',
                    //     key: 'brandId',
                    //     align: 'center',
                    //     width: 120,
                    // },
                    {
                        title: '品牌名称',
                        key: 'brandName',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '季节',
                        key: 'season',
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: '年份',
                        key: 'years',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '波段',
                        key: 'waveBand',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '规划开发时间',
                        key: 'planDevDate',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '规划交接完成',
                        key: 'planDeliverDate',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '规划齐色样时间',
                        key: 'colorSimpleDate',
                        align: 'center',
                        width: 120,
                    },
                      {
                        title: '规划到货时间',
                        key: 'planArriveDate',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '开发款数',
                        key: 'devStyleQty',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '备注',
                        key: 'brandRemark',
                        align: 'center',
                        width: 120,
                    },
                     {
                        title: '操作',
                        key: 'operate',
                        minWidth: 150,
                        fixed: 'right',
                        align: 'center',
                        render: (h, params) => {
                            // render: (h, params) => {
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
                                        click: (e) => {       
                                            this.edit(params.row);
                                            e.stopPropagation()
                                        }
                                    }
                                }, '详情')
                            ])
                        }
                        }
                    // }
                ],
                //开发明细
                columnskfmx:[
                    {
                        title: '已开发款数',
                        key: 'finishStyleQty',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '设计稿延期天数',
                        key: 'planDelay',
                        align: 'center',
                        width: 150,
                    },
                    {
                        title: '建档延期天数',
                        key: 'filingDelay',
                        align: 'center',
                        width: 180,
                    },{
                        title: '头版样衣指令延期天数',
                        key: 'simpleDelay1',
                        align: 'center',
                        width: 180,
                    },{
                        title: '设计师下单延期天数',
                        key: 'designerDelay',
                        align: 'center',
                        width: 180,
                    },{
                        title: '拍摄样指令延期天数',
                        key: 'simpleDelay',
                        align: 'center',
                        width: 180,
                    },{
                        title: '大货未核价款数',
                        key: 'unPricingStyleQty',
                        align: 'center',
                        width: 180,
                    },{
                        title: '下单款数',
                        key: 'orderStyleQty',
                        align: 'center',
                        width: 180,
                    },{
                        title: '下单色数',
                        key: 'firstColoeQty',
                        align: 'center',
                        width: 180,
                    },{
                        title: '下单数量',
                        key: 'firstQty',
                        align: 'center',
                        width: 180,
                    },{
                        title: '下单金额',
                        key: 'firstAmount',
                        align: 'center',
                        width: 180,
                    },{
                        title: '规划开发金额',
                        key: 'orderTotalPrice',
                        align: 'center',
                        width: 180,
                    },{
                        title: '金额差异',
                        key: 'diffAmount',
                        align: 'center',
                        width: 180,
                    }
                    ,{
                        title: '成本差异',
                        key: 'diffCostPrice',
                        align: 'center',
                        width: 180,
                    }
                    ,{
                        title: '入库延期天数',
                        key: 'purchaseDelay',
                        align: 'center',
                        width: 180,
                    }
                    ,{
                        title: '入库数量',
                        key: 'purchaseQty',
                        align: 'center',
                        width: 180,
                    }
                    ,{
                        title: '入库金额',
                        key: 'purchaseAmount',
                        align: 'center',
                        width: 180,
                    }
                    
                ],
                userInfo: {},
                visible:false,
                list: [],
                detailList:[],
                newList:[],
                total: 0,
                page: 1,
                pageSize: 10,
                formItem:{},
                formList:{
                },
                formSearch: {
                },
                brandList:[],          //品牌列表
                waveList: [],          //波段列表
                levelList:[],          //品级列表
                renderType   : '',     //渲染条件
                seasonList   :[        //四季列表
                  {label:'春季',value:'春季'},
                  {label:'夏季',value:'夏季'},
                  {label:'秋季',value:'秋季'},
                  {label:'冬季',value:'冬季'},
                ],
                submit_data:{},
            }
        },
        mounted() {
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            this.getGoodsFollowList()
            this. getbrandList()
            this.getwaveList()
            this. getLevelList()
            this.$root.eventHub.$on('refush_brand',()=>{
                this.getGoodsFollowList();
            });
        },
        activated() {

        },
        methods: {
            //赋值
            edit(data){
                    this.visible = true
                    this.formList=data
                    console.log(this.formList)
                    this.detailList=[];
                    this.detailList.push({
                                finishStyleQty:data.finishStyleQty,
                                planDelay     :data.planDelay,
                                filingDelay   :data.filingDelay,
                                simpleDelay1  :data.simpleDelay1,
                                orderStyleQty :data.orderStyleQty,
                                firstColoeQty :data.firstColoeQty,
                                firstQty      :data.firstQty,
                                firstAmount   :data.firstAmount,
                                designerDelay :data.designerDelay,
                                simpleDelay   :data.simpleDelay,
                                unPricingStyleQty:data.unPricingStyleQty,
                                orderTotalPrice:data.orderTotalPrice,
                                diffAmount     :data.diffAmount,
                                diffCostPrice :data.diffCostPrice,
                                purchaseDelay:data.purchaseDelay,
                                purchaseQty  :data.purchaseQty,
                                purchaseAmount:data.purchaseAmount
                       })
                },
            //重置
            handleReset(){
                this.page = 1
                this.pageSzie = 10
                this.formSearch = {}
                this.getGoodsFollowList()
            },
            //搜索
            search() {
                this.page =1
                this.getGoodsFollowList()
            },
            currentChange(page) {
                this.page = page
            this.getGoodsFollowList()
            },
            sizeChange(pageSize) {
                this.pageSize = pageSize
                this.getGoodsFollowList()
            },
            //导出
             exportEmployee(){  

                 
               let data = {}
                // this.formSearch.brand? data.brandId = this.formSearch.brand :delete data.brandId
                // this.formSearch.season? data.season = this.formSearch.season:delete data.season
                this.formSearch.date? data.years =this.unix_fullb(Number(this.formSearch.date)):delete data.years
                this.formSearch.wave? data.waveBand = this.formSearch.wave :delete data.waveBand 

                let params=this.formatParams(data)
                let brandId=this.formSearch.brand?`&brandId=${this.formSearch.brand}`:'';
                let season=this.formSearch.season?`&season=${this.formSearch.season}`:''; 
                location.href=(`/eop/business/export_brand_follow_list?${params}${brandId}${season}`)
                console.log(`/eop/business/export_brand_follow_list?${params}${brandId}${season}`)
            },
            //初始化品牌列表
            getbrandList(){
              this.request('get_scm_brand_list', {}, false).then((res) => {
                    if(res.code==1){
                      this.brandList=res.data
                    }
                })    
            },
            //初始化波段列表
            getwaveList(){
                this.request('get_wave_band_list', {}, false).then((res) => {
                    if(res.code==1){
                      this.waveList=res.data
                    }
                })    
            },
            //初始化品类层级列表
            getLevelList(){
                  this.request('get_class_level_list', {}, false).then((res) => {
                    if(res.code==1){
                        console.log(res.data)
                       this.levelList=res.data
                       this.newLeveListL2(res.data[0])
                    }
                })     
            },
            //对L2级数组去重
             newLeveListL2(data){
                    let array = []
                    let zhan = this.levelList
                    for(const i of zhan) {
 	                    array.push(i.L2)
                        }
                    var l2List = [...new Set(array)]
                    this.newList = l2List
            },
            //获取品牌跟进列表
            getGoodsFollowList(){
                let data = {}
                    data.start          =  (this.page-1)*this.pageSize 
                    data.length         =  this.pageSize
                    // if(this.formSearch.brand){
                    //         if(typeof(this.formSearch.brand)=='string'){
                    //             data.brandId=this.formSearch.brand  
                    //         }else{
                    //             data.brandId=(this.formSearch.brand).join(',')
                    //         }
                    //     } 
                    //     if(this.formSearch.season){
                    //         if(typeof(this.formSearch.season)=='string'){
                    //         data.season =this.formSearch.season  
                    //         }else{
                    //         data.season =(this.formSearch.season).join(',')
                    //         }
                    //     } 
                    data.brandId        =  this.formSearch.brand
                    
                    data.season         =  this.formSearch.season
                    data.waveBand       =  this.formSearch.wave
                    this.formSearch.date?data.years          =  this.unix_fullb(this.formSearch.date):delete  data.years
                this.request('get_brand_follow_list', data={data}, true).then((res) => {
                    if (res.code == 1) {
                        this.list = res.data.brandFollowList
                        this.total = res.data.count
                    }else{
                       this.list=[]
                       this.total ='0'
                    }
                })
            },
            save(){
                let data = {}
                data.brandName=this.formList.brandName
                data.brandId= this.formList.brandId
                data.years  = this.formList.years
                data.season = this.formList.season
                data.waveBand=this.formList.waveBand
                data.brandRemarkId=this.formList.brandRemarkId
                data.brandRemark=this.formList.brandRemark
                data.lastUpdateUser=this.userInfo.userName
               this.request('edit_brand_follow_remark', data={data}, true).then((res) => {
                    if (res.code == 1) {
                        this.getGoodsFollowList()
                }
               })
            },
            formatParams(data) {
                var arr = [];
                for (var name in data) {
                arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
                }
                return arr.join("&");
            },
            //返回xxxx年
            unix_fullb:function(unix){
                            var newDate = new Date();
                                newDate.setTime(unix);
                            var Y = newDate.getFullYear(),
                                M = newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1,
                                D = newDate.getDate() < 10 ? ('0' + newDate.getDate()) : newDate.getDate(),
                                h = newDate.getHours() < 10 ? ('0' + newDate.getHours()) : newDate.getHours(),
                                m = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes(),
                                s = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds();
                            return Y 
            },
        }
    }
</script>

<style>

</style>
