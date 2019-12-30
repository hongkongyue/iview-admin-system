<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">  
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="品牌:"  :label-width="50">
                    <Select v-model="formSearch.brandId" multiple style="width:120px" >
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
                    <Select v-model="formSearch.classLevel2" style="width:120px">
                        <Option v-for="item in newList" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </Form-item>
                <FormItem label="设置参数企划" :label-width="100">
                    <RadioGroup v-model="formItem.classParameterExist" @on-change='labelChange'>
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </RadioGroup>
                </FormItem>
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
                   <Form-item label="二级品类:">    
                        <Input v-model="formList.classLevel2" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="规划开发时间:">  
                        <Input v-model="formList.planDevDate" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="规划交接完成:">  
                        <Input v-model="formList.planDeliverDate" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="规划齐色样时间:">  
                        <Input v-model="formList.colorSimpleDate" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                   <Form-item label="规划到货时间:">    
                        <Input v-model="formList.planArriveDate" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="品类开发成本:">
                        <Input v-model="formList.devCostPrice" disabled placeholder="" style="width: 120px"></Input>
                    </Form-item>
                    <Form-item label="计划开发款数:">  
                        <Input v-model="formList.devStyleQty" disabled placeholder="" style="width: 120px"></Input>  
                    </Form-item>
                   <Form-item label="备注:">
                        <Input v-model="formList.classRemark" type='textarea'  placeholder="" style="width: 220px"></Input>
                    </Form-item>
            </Form>
             <!-- 联动数据列表 -->
        <Row class="background-color-white exhibition">
            <Tabs type="card" value='kfmx'>
                <TabPane label="开发明细" name='kfmx'>
                    <Table border :columns="columnskfmx"  highlight-row :data="listKfyy"></Table>
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
        name:'category',
        data() {
            return {
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
                        title: '二级品类',
                        key: 'classLevel2',
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
                        title: '品类开发成本',
                        key: 'devCostPrice',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '计划开发款数',
                        key: 'devStyleQty',
                        align: 'center',
                        width: 120, 
                    },
                    {
                        title: '备注',
                        key: 'classRemark',
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
                        width: 120,
                    },
                    {
                        title: '建档延期天数',
                        key: 'filingDelay',
                        align: 'center',
                        width: 120,
                    },{
                        title: '头版样衣指令延期天数',
                        key: 'simpleDelay1',
                        align: 'center',
                        width: 120,
                    },{
                        title: '头版样衣完成延期天数',
                        key: 'simpleFinishDelay1',
                        align: 'center',
                        width: 120,
                    },{
                        title: '下单款数',
                        key: 'orderStyleQty',
                        align: 'center',
                        width: 120,
                    },{
                        title: '下单色数',
                        key: 'firstColoeQty',
                        align: 'center',
                        width: 120,
                    },{
                        title: '下单数量',
                        key: 'firstQty',
                        align: 'center',
                        width: 120,
                    },{
                        title: '下单金额',
                        key: 'firstAmount',
                        align: 'center',
                        width: 120,
                    },{
                        title: '设计师下单延期天数',
                        key: 'designerDelay',
                        align: 'center',
                        width: 120,
                    },{
                        title: '生产下单延期天数',
                        key: 'produceDelay',
                        align: 'center',
                        width: 120,
                    },{
                        title: '拍摄样指令创建延期天数',
                        key: 'simpleDelay',
                        align: 'center',
                        width: 120,
                    }
                    ,{
                        title: '拍摄样完成延期天数',
                        key: 'simpleFinishDelay',
                        align: 'center',
                        width: 120,
                    }
                    ,{
                        title: '大货未核价款数',
                        key: 'unPricingStyleQty',
                        align: 'center',
                        width: 120,
                    }
                    ,{
                        title: '规划开发金额',
                        key: 'orderTotalPrice',
                        align: 'center',
                        width: 120,
                    }
                    ,{
                        title: '实际开发成本',
                        key: 'actualCostPrice',
                        align: 'center',
                        width: 120,
                    }
                    ,{
                        title: '金额差异',
                        key: 'diffAmount',
                        align: 'center',
                        width: 120,
                    },{
                        title: '成本差异',
                        key: 'diffCostPrice',
                        align: 'center',
                        width: 120,
                    },{
                        title: '入库延期天数',
                        key: 'purchaseDelay',
                        align: 'center',
                        width: 120,
                    },{
                        title: '入库数量',
                        key: 'purchaseQty',
                        align: 'center',
                        width: 120,
                    },{
                        title: '入库金额',
                        key: 'purchaseAmount',
                        align: 'center',
                        width: 120,
                    }
                ],
                userInfo: {},
                visible:false,
                list: [],
                newList:[],
                listKfyy:[],//开发样衣
                total: 0,
                page: 1,
                pageSize: 10,
                formItem:{},
                formList:{
                    brandId:'',//id
                    brandName:'',//品牌
                    years:'',//年份
                    season:'',//季节
                    waveBand:'',//波段
                    designer:'',//设计师
                    classLevel2:'',//二级分类
                    planDevDate:'',//规划开发时间
                    planDeliverDate:'',//规划交接完成
                    colorSimpleDate:'',//规划齐色样
                    planArriveDate:'',//规划到货时间
                    planDevDate:'',//规划开发时间
                    devCostPrice:'',//品类开发成本
                    devStyleQty:'',//计划开发款数
                    classRemark:'',//备注
                    classRemarkId:''//备注Id
                },
                formSearch: {
                    is_incumbency:'1',
                    brandId:'',//品牌id
                    years:'',//年份(yyyy)
                    season:'',//季节
                    waveBand:'',//波段
                    classLevel2:'',//二级分类
                    classParameterExist:'',
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
            this. getbrandList()
            this.getwaveList()
            this. getLevelList()
            this.getGoodsFollowList()
            this.$root.eventHub.$on('refush_category',()=>{
                this.getGoodsFollowList();
            });
        },
        activated() {
        },
        methods: {
            labelChange(v){
                this.formSearch.classParameterExist = v
            },
            //保存详情
            edit(data){
                this.visible = true
                this.formList.brandId = data.brandId,//品牌
                this.formList.brandName = data.brandName,//品牌
                this.formList.years=data.years,//年份
                this.formList.season=data.season,//季节
                this.formList.waveBand=data.waveBand,//波段
                this.formList.classLevel2=data.classLevel2,//二级品类
                this.formList.planDevDate=data.planDevDate,//规划开发时间
                this.formList.planDeliverDate=data.planDeliverDate,//规划交接完成
                this.formList.colorSimpleDate=data.colorSimpleDate,//规划齐色样
                this.formList.planArriveDate=data.planArriveDate,//规划到货时间
                this.formList.devCostPrice=data.devCostPrice,//品类开发成本
                this.formList.devStyleQty=data.devStyleQty,//计划开发款数
                this.formList.classRemark=data.classRemark//备注,
                this.formList.classRemarkId=data.classRemarkId//备注,
                let newPlList = [data]
                this.listKfyy = newPlList
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
            //导出
             exportEmployee(){
                let data = {}
                this.formSearch.classLevel2 ? data.classLevel2 = this.formSearch.classLevel2 :''
                this.formSearch.years? data.years =Number(this.formSearch.years):delete data.years
                this.formSearch.waveBand? data.waveBand = this.formSearch.waveBand :delete data.waveBand 
                let params=this.formatParams(data)
                let brandId=this.formSearch.brandId?`&brandId=${this.formSearch.brandId}`:'';
                let season=this.formSearch.season?`&season=${this.formSearch.season}`:'';
                location.href=(`/eop/business/export_class_follow_list?${params}${brandId}${season}`)
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
                    var l2List = [...new Set(array)]
                    this.newList = l2List
            },
            //获取品类企业跟进列表
            getGoodsFollowList(){
                let data = {}
                data.start = (this.page - 1)*this.pageSize
                data.length = this.pageSize
                data.brandId = this.formSearch.brandId
                data.classLevel2 = this.formSearch.classLevel2
                data.years = this.formSearch.years
                data.season = this.formSearch.season
                data.waveBand = this.formSearch.waveBand
                data.classParameterExist = this.formSearch.classParameterExist
                this.request('get_class_follow_list', data={data}, true).then((res) => {
                    if (res.code == 1) {
                        this.list = res.data.classFollowList
                        this.total = res.data.count
                    }
                })
            },
            //详情保存
            save(){
                let name = JSON.parse(window.sessionStorage.getItem('userinfo'))
                let data = {}
                data.brandName = this.formList.brandName
                data.classLevel2 = this.formList.classLevel2
                data.classRemarkId = this.formList.classRemarkId
                data.years = this.formList.years
                data.season = this.formList.season
                data.waveBand = this.formList.waveBand
                data.brandId = this.formList.brandId
                data.classRemark = this.formList.classRemark
                data.lastUpdateUser = name.userName
               this.request('edit_class_follow_remark', data={data}, true).then((res) => {
                    if (res.code == 1) {
                        this.getGoodsFollowList()
                    }
                })
            }
        }
    }
</script>

<style>

</style>
