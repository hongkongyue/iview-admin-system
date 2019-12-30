<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">
                <P style="float:right;margin-top:-10px;color:#a8a6a6">最后统计时间:{{updataTime}}</p>
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="品牌:"  :label-width="50">
                     <Select v-model="formSearch.brandId" multiple style="width:120px">
                              <Option v-for="item in brandList" :value="item.brandId" :key="item.brandId">{{ item.brandName }}</Option>
                      </Select>
                </Form-item>
                <Form-item label="季节:">
                      <Select v-model="formSearch.season" multiple style="width:120px" >
                              <Option v-for="item in seasonList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                </Form-item>
                <Form-item label="年份:">
                    <Col span="12">
                        <DatePicker @on-change='changeFormNf' type="year" v-model="formSearch.years" placeholder="请选择年份" style="width: 120px"></DatePicker>
                    </Col>
                </Form-item>
                 <Form-item label="波段:">
                                　<Select v-model="formSearch.waveBand" style="width:120px">
                                    <Option v-for="item in waveList" :value="item.WAVE_BAND" :key="item.WAVE_BAND">
                                        {{ item.WAVE_BAND }}
                                    </Option>
                                </Select>
                </Form-item>
                <Form-item label="二级分类:"  :label-width="80">
                     <Select v-model="formSearch.classLevel2" style="width:120px" >
                              <Option v-for="item in newList" :value="item" :key="item">{{ item }}</Option>
                      </Select>
                </Form-item>
                <Form-item label="设计款号:"  :label-width="80">
                     <Input v-model="formSearch.designGoodsNo" placeholder=""></Input>
                </Form-item>
                <Form-item label="大货款号:"  :label-width="80">
                     <Input v-model="formSearch.goodsNo" placeholder=""></Input>
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
                <Form :model="FormList" @keydown.native.enter.prevent="search" ref="addformSearch" :label-width="90" inline
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
                    <Form-item label="设计款号:">    
                        <Input v-model="formList.designGoodsNo" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="设计师:">  
                        <Input v-model="formList.designer" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="一级分类:">  
                        <Input v-model="formList.classLevel1" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="二级分类:">  
                        <Input v-model="formList.classLevel2" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="三级分类:">    
                        <Input v-model="formList.classLevel3" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="开发类型:">  
                        <Input v-model="formList.devType" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="外发工厂:">  
                        <Input v-model="formList.factoryName" disabled placeholder="" style="width: 120px"></Input>  
                    </Form-item>
                    <Form-item label="设计稿日期:">  
                        <Input v-model="formList.designDate" disabled placeholder="" style="width: 120px"></Input>  
                    </Form-item>
                    <Form-item label="建档时间:">    
                        <Input v-model="formList.fillingDate" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="规划开发时间:">  
                        <Input v-model="formList.planDevDate" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="规划延期天数:">  
                        <Input v-model="formList.planDelay" disabled placeholder="" style="width: 120px"></Input>  
                    </Form-item>
                    <Form-item label="建档延期天数:">  
                        <Input v-model="formList.filingDelay" disabled placeholder="" style="width: 120px"></Input>  
                    </Form-item>
                    <Form-item label="备注:">
                        <Input v-model="formList.remark" type='textarea'  placeholder="" style="width: 220px"></Input>
                    </Form-item>
                </Form>
             <!-- 联动数据列表 -->
        <Row class="background-color-white exhibition">
            <Tabs type="card" @on-click='getList' v-model='cardName'>
                <TabPane label="开发样衣" name='kfyy'>
                    <Table border :columns="columnskfyy"  highlight-row :data="listKfyy"></Table>
                </TabPane>
                <TabPane label="大货下单" name='dhxd'>
                    <Table :columns="columnsdhxd"  highlight-row :data="listDhxd"></Table>
                </TabPane>
                <TabPane label="齐色样" name='qsy'>
                    <Table :columns="columnsqsy"  highlight-row :data="listQsy"></Table>
                </TabPane>
                <TabPane label="入库跟进" name='rkgj'>
                    <Table :columns="columnsrkgj" highlight-row :data="listRkgj"></Table>
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
        name:'commodity',
        data() {
            return {
                updataTime:'',
                cardName:'kfyy',
                columns: [{
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '年份',
                        key: 'years',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '季节',
                        key: 'season',
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
                        title: '设计款号',
                        key: 'designGoodsNo',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '设计师',
                        key: 'designer',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '一级分类',
                        key: 'classLevel1',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '二级分类',
                        key: 'classLevel2',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '三级分类',
                        key: 'classLevel3',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '开发类型',
                        key: 'devType',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '外发工厂',
                        key: 'factoryName',
                        align: 'center',
                        width: 120, 
                    },
                    {
                        title: '设计稿日期',
                        key: 'designDate',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '建档时间',
                        key: 'fillingDate',
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
                        title: '规划延期天数',
                        key: 'planDelay',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '建档延期天数',
                        key: 'filingDelay',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                        width: 120
                    },{
                        title: '操作',
                        key: 'operate',
                        minWidth: 150,
                        fixed: 'right',
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
                                        click: (e) => {
                                            
                                            this.edit(params.row);
                                            e.stopPropagation()
                                        }
                                    }
                                }, '详情')
                            ])
                        }
                    }
                ],
                //开发样衣
                 columnskfyy: [{
                        title: '规划交接时间',
                        key: 'planDeliverDate',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '头版样衣',
                        key: 'code',
                        align: 'center',
                        children:[
                            {
                                title: 'BOM指令创建时间',
                                key: 'bomcreateDate',
                                align: 'center',
                                width: 120,
                            },{
                                title: 'BOM完成时间',
                                key: 'bomfinishDate',
                                align: 'center',
                                width: 120,
                            },{
                                title: '样衣指令创建时间',
                                key: 'simpleCreateDate1',
                                align: 'center',
                                width: 120,
                            },{
                                title: '样衣完成时间',
                                key: 'simpleFinishDate1',
                                align: 'center',
                                width: 120,
                            },{
                                title: '样衣指令延期天数',
                                key: 'simpleDelay1',
                                align: 'center',
                                width: 120,
                            },{
                                title: '样衣完成延期天数',
                                key: 'simpleFinishDelay1',
                                align: 'center',
                                width: 120,
                            }
                        ],
                        width: 80,
                    },
                    {
                        title: '二版样衣',
                        key: 'org_department_name',
                        align: 'center',
                        children:[
                            {
                                title: '样衣指令创建时间',
                                key: 'simpleCreateDate2',
                                align: 'center',
                                width: 120,
                            },{
                                title: '样衣完成时间',
                                key: 'simpleFinishDate2',
                                align: 'center',
                                width: 120,
                            },{
                                title: '样衣指令延期',
                                key: 'simpleDelay2',
                                align: 'center',
                                width: 120,
                            },{
                                title: '样衣完成延期',
                                key: 'simpleFinishDelay2',
                                align: 'center',
                                width: 120,
                            }
                        ],
                        width: 150,
                    },
                    {
                        title: '三板样衣',
                        key: 'org_department_root_name',
                        align: 'center',
                        children:[
                            {
                                title: '样衣指令创建时间',
                                key: 'simpleCreateDate3',
                                align: 'center',
                                width: 120,
                            },{
                                title: '样衣完成时间',
                                key: 'simpleFinishDate3',
                                align: 'center',
                                width: 120,
                            },{
                                title: '样衣指令延期',
                                key: 'simpleDelay3',
                                align: 'center',
                                width: 120,
                            },{
                                title: '样衣完成延期',
                                key: 'simpleFinishDelay3',
                                align: 'center',
                                width: 120,
                            }
                        ],
                        width: 180,
                    },
                    {
                        title: '样衣预警',
                        key: 'simpleWarning',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '开发核价',
                        key: 'level_name',
                        align: 'center',
                        children:[
                            {
                                title: '开发核价提交时间',
                                key: 'picingCreateDate',
                                align: 'center',
                                width: 120,
                            },{
                                title: '开发核价完成时间',
                                key: 'pricingFinashDate',
                                align: 'center',
                                width: 120,
                            },{
                                title: '开发核价延期天数',
                                key: 'pricingDelay',
                                align: 'center',
                                width: 120,
                            }
                        ],
                        width: 120,
                    }
                ],
                //大货下单
                columnsdhxd:[
                    // {
                    //     title: '是否下单',
                    //     key: 'isOrder',
                    //     align: 'center',
                    // },
                    {
                        title: '下单款号',
                        key: 'goodsNo',
                        align: 'center',
                    },
                    {
                        title: '设计师下单时间',
                        key: 'designerDate',
                        align: 'center',
                    },
                    {
                        title: '大货bom状态',
                        key: 'bomstatus',
                        align: 'center',
                    },{
                        title: '设计师下单延期',
                        key: 'designerDelay',
                        align: 'center',
                    },{
                        title: '大货核价提交时间',
                        key: 'bigPricingCreateDate',
                        align: 'center',
                    },{
                        title: '大货核价完成时间',
                        key: 'bigPricingFinishDate',
                        align: 'center',
                    },{
                        title: '核价延期天数',
                        key: 'bigPricingDelay',
                        align: 'center',
                    },{
                        title: '生产下单提交时间',
                        key: 'produceCreateDate',
                        align: 'center',
                    },{
                        title: '生产下单延期',
                        key: 'produceDelay',
                        align: 'center',
                    }
                ],
                //齐射样
                columnsqsy:[
                    {   title: '规划齐色样时间',
                        key: 'colorSimpleDate',
                        align: 'center',
                    },{
                        title: '样衣指令创建时间',
                        key: 'simpleCreateDate',
                        align: 'center',
                    },{
                        title: '样衣完成时间',
                        key: 'simpleFinishDate',
                        align: 'center',
                    },{
                        title: '样衣指令延期',
                        key: 'simpleDelay',
                        align: 'center',
                    },{
                        title: '样衣完成延期',
                        key: 'simpleFinishDelay',
                        align: 'center',
                    },{
                        title: '样衣预警',
                        key: 'simpleWarning',
                        align: 'center',
                    }
                ],
                //入库跟进
                columnsrkgj:[
                    {   title: '规划品类开发成本',
                        key: 'devCostPrice',
                        align: 'center',
                        width: 120,
                    },{
                        title: '总合约单价',
                        key: 'totalContractPrice',
                        align: 'center',
                        width: 120,
                    },{
                        title: '税前成本价',
                        key: 'costPrice',
                        align: 'center',
                        width: 120,
                    },{
                        title: '首单下单色数',
                        key: 'firstColoeQty',
                        align: 'center',
                        width: 120,
                    },{
                        title: '首单下单数量',
                        key: 'firstQty',
                        align: 'center',
                        width: 120,
                    },{
                        title: '首单下单金额',
                        key: 'firstAmount',
                        align: 'center',
                        width: 120,
                    },{
                        title: '规划到货时间',
                        key: 'planArriveDate',
                        align: 'center',
                        width: 120,
                    },{   title: '入库数量',
                        key: 'purchaseQty',
                        align: 'center',
                        width: 120,
                    },{
                        title: '入库金额',
                        key: 'purchaseAmount',
                        align: 'center',
                        width: 120,
                    },{
                        title: '实际入库时间',
                        key: 'actualPurchaseDate',
                        align: 'center',
                        width: 120,
                    },{
                        title: '完成80%入库时间',
                        key: 'purchaseDate80',
                        align: 'center',
                        width: 150,
                    },{
                        title: '入库延期天数',
                        key: 'purchaseDelay',
                        align: 'center',
                        width: 120,
                    },{
                        title: '未入库数量',
                        key: 'unPurchaseQty',
                        align: 'center',
                        width: 120,
                    },{
                        title: '入库率',
                        key: 'purchaseRate',
                        align: 'center',
                        width: 120,
                    },{
                        title: '入库差异',
                        key: 'purchaseDefQty',
                        align: 'center',
                        width: 120,
                    }
                ],            
                userInfo: {},
                visible:false,
                list:[],
                newList:[],
                listKfyy:[],//开发样衣
                listDhxd:[],//大货下单
                listQsy:[],//齐色样
                listRkgj:[],//入库跟进
                total: 0,
                page: 1,
                pageSize: 10,
                formItem:{},
                formList:{
                    id:'',//id
                    brandName:'',//品牌
                    years:'',//年份
                    season:'',//季节
                    waveBand:'',//波段
                    designGoodsNo:'',//设计款号
                    designer:'',//设计师
                    classLevel1:'',//一级分类
                    classLevel2:'',//二级分类
                    classLevel3:'',//三级分类
                    devType:'',//开发类型
                    factoryName:'',//外发工厂
                    designDate:'',//设计稿日期
                    fillingDate:'',//建档时间
                    planDevDate:'',//规划开发时间
                    planDelay:'',//规划延期天数
                    filingDelay:'',//建档延期天数
                    remark:''//备注
                },
                formSearch: {
                    brandId:'',//品牌id
                    years:'',//年份(yyyy)
                    season:'',//季节
                    waveBand:'',//波段
                    classLevel2:'',//二级分类
                    designGoodsNo:'',//设计款号
                    goodsNo:''//大货款号
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
            }
        },
        mounted() {
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            this.getGoodsFollowList()
            this.getbrandList()
            this.getwaveList()
            this.getLevelList()
            this.getUpdateTime()
            this.$root.eventHub.$on('refush_commodity',()=>{
                this.getGoodsFollowList();
            });
        },
        activated() {

        },
        methods: {
            // 新增弹框方法集合
            add_category(){
                this.add_category_list.push({
                    classLevel1:'',
                    classLevel2:'',
                    classLevel3:'',
                    devStyleQty:'',
                    devCostPrice:'',
                    colorRate:'',
                    mainColorQty:'',
                    subColorQty:'',
                    orderStyleQty:'',
                    detailRemark:'',
                    orderTotalQty:'',
                    orderTotalPrice:'',
                })       
            },
            //获取更新时间
            getUpdateTime(){
                this.request('get_ods_update_time', {}, false).then((res) => {
                    if(res.code==1){
                      this.updataTime = res.data
                    }
                })
            },
            //详情
            edit(data){
                this.visible = true
                this.formList.id = data.id,//品牌
                this.formList.brandName = data.brandName,//品牌
                this.formList.years=data.years,//年份
                this.formList.season=data.season,//季节
                this.formList.waveBand=data.waveBand,//波段
                this.formList.designGoodsNo=data.designGoodsNo,//设计款号
                this.formList.designer=data.designer,//设计师
                this.formList.classLevel1=data.classLevel1,//一级分类
                this.formList.classLevel2=data.classLevel2,//二级分类
                this.formList.classLevel3=data.classLevel3,//三级分类
                this.formList.devType=data.devType,//开发类型
                this.formList.factoryName=data.factoryName,//外发工厂
                this.formList.designDate=data.designDate,//设计稿日期
                this.formList.fillingDate=data.fillingDate,//建档时间
                this.formList.planDevDate=data.planDevDate,//规划开发时间
                this.formList.planDelay=data.planDelay,//规划延期天数
                this.formList.filingDelay=data.filingDelay,//建档延期天数
                this.formList.remark=data.remark//备注,
                this.request('get_develop_simple', {data:{designGoodsNo:this.formList.designGoodsNo}}, false).then((res) => {
                    if(res.code==1){
                      this.listKfyy = res.data
                    }
                })
            },
            //切换tabs获取数据
            getList(name){
                console.log(name)
                if(name=='kfyy'){
                    this.request('get_develop_simple', {data:{designGoodsNo:this.formList.designGoodsNo}}, false).then((res) => {
                        if(res.code==1){
                           this.listKfyy = res.data
                        }
                })
                }else if(name=='dhxd'){
                     this.request('get_big_order', {data:{designGoodsNo:this.formList.designGoodsNo}}, false).then((res) => {
                        if(res.code==1){
                            this.listDhxd = res.data
                        }
                     })
                }else if(name=='qsy'){
                     this.request('get_color_simple_list', {data:{designGoodsNo:this.formList.designGoodsNo}}, false).then((res) => {
                        if(res.code==1){
                            this.listQsy = res.data
                        }
                     })
                }else{
                     this.request('get_purchase_follow_list', {data:{designGoodsNo:this.formList.designGoodsNo}}, false).then((res) => {
                        if(res.code==1){
                            this.listRkgj = res.data
                        }
                    })
                }
            },
            //改变表单的值
            changeFormNf(v){
                this.formSearch.years = v
            },
             //重置
            handleReset(){
                this.page = 1
                this.pageSzie = 10
                this.formItem = {}
                this.formSearch = {}
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
            //导出  designGoodsNo   goodsNo
             exportEmployee(){
                 console.log(Number(this.formSearch.years))
                let data = {}
                this.formSearch.designGoodsNo ? data.designGoodsNo = this.formSearch.designGoodsNo : delete data.designGoodsNo
                this.formSearch.goodsNo ? data.goodsNo = this.formSearch.goodsNo : delete data.goodsNo
                this.formSearch.classLevel2 ? data.classLevel2 = this.formSearch.classLevel2 :''
                this.formSearch.years? data.years =Number(this.formSearch.years):delete data.years
                this.formSearch.waveBand? data.waveBand = this.formSearch.waveBand :delete data.waveBand 
                let params=this.formatParams(data)
                let brandId=this.formSearch.brandId?`&brandId=${this.formSearch.brandId}`:'';
                let season=this.formSearch.season?`&season=${this.formSearch.season}`:'';
                location.href=(`/eop/business/export_goods_follow?${params}${brandId}${season}`)
            },
            formatParams(data) {
                let arr = [];
                for (let name in data) {
                arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
                }
                return arr.join("&");
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
                let l2List = [...new Set(array)]
                this.newList = l2List
            },
            //获取商品企业跟进列表
            getGoodsFollowList(){
                let data = {}
                data.start = (this.page - 1)*this.pageSize
                data.length = this.pageSize
                data.brandId = this.formSearch.brandId
                data.designGoodsNo = this.formSearch.designGoodsNo
                data.classLevel2 = this.formSearch.classLevel2
                data.goodsNo = this.formSearch.goodsNo
                data.years = this.formSearch.years
                data.season = this.formSearch.season
                data.waveBand = this.formSearch.waveBand
                if (this.formSearch.departmentObj) {
                    data.departmentPath = this.formSearch.departmentObj.unit_path
                }
                this.request('get_goods_follow_list', data={data}, true).then((res) => {
                    if (res.code == 1) {
                        this.list = res.data.followList
                        this.total = res.data.count
                    }
                })
            },
            //保存
            save(){
                let name = JSON.parse(window.sessionStorage.getItem('userinfo'))
                let data = {}
                data.id = this.formList.id
                data.remark = this.formList.remark
                data.lastUpdateUser = name.userName
                this.request('edit_follow_remark', data={data}, true).then((res) => {
                    if (res.code == 1) {
                        this.getGoodsFollowList()
                        this.cardName = 'kfyy'
                    }
                })
            },
            //取消
            cancel(){
                this.cardName = 'kfyy'
            }
        }
    }
</script>

<style>

</style>
