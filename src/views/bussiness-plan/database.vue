<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">
                <P style="float:right;margin-top:-10px;color:#a8a6a6">最后统计时间:{{updataTime}}</p>
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="品牌:"  :label-width="50">
                     <Select v-model="formSearch.brandId"  style="width:120px">
                              <Option v-for="item in brandList" :value="item.brandId" :key="item.brandId">{{ item.brandName }}</Option>
                      </Select>
                </Form-item>
                <Form-item label="季节:">
                      <Select v-model="formSearch.season"  style="width:120px" >
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
                <!--<Form-item label="二级分类:"  :label-width="80">
                     <Select v-model="formSearch.classLevel2" style="width:120px" >
                              <Option v-for="item in newList" :value="item" :key="item">{{ item }}</Option>
                      </Select>
                </Form-item>-->
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
                     <Button type="primary" @click="upNewData">重新获取</Button>
                </Form-item>
                </Col>
            </Form>
            
        </Row>
        <!-- 数据列表 -->
        <Row class="background-color-white exhibition">
            <Table ref="table" :columns="columns" size="small" highlight-row :data="list" @on-select='rowSelect' @on-select-all='allSelect' @on-row-click="rowClick"></Table>
            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total
                show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
        </Row>
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
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 120,
                    },
                    {
                        title: '年份',
                        key: 'years',
                        align: 'center',
                        minWidth: 120,
                    },
                    {
                        title: '季节',
                        key: 'season',
                        align: 'center',
                        minWidth: 120,
                    },
                    {
                        title: '波段',
                        key: 'waveBand',
                        align: 'center',
                        minWidth: 120,
                    },
                     {
                        title: '货款编号',
                        key: 'goodsNo',
                        align: 'center',
                        minWidth: 120,
                    },
                     {
                        title: '设计款号',
                        key: 'designGoodsNo',
                        align: 'center',
                        minWidth: 120,
                    },
                    {
                        title: '设计师',
                        key: 'designer',
                        align: 'center',
                        minWidth: 120,
                    },
                    {
                        title: '最后修改时间',
                        key: 'lastUpdated',
                        align: 'center',
                        minWidth: 120
                    }
                    // ,{
                    //     title: '操作',
                    //     key: 'operate',
                    //     minWidth: 150,
                    //     fixed: 'right',
                    //     align: 'center',
                    //     render: (h, params) => {
                    //         return h('div', [
                    //             h('Button', {
                    //                 props: {
                    //                     type: 'primary',
                    //                     size: 'small'
                    //                 },
                    //                 style: {
                    //                     marginRight: '5px'
                    //                 },
                    //                 on: {
                    //                     click: (e) => {
                                            
                    //                         this.edit(params.row);
                    //                         e.stopPropagation()
                    //                     }
                    //                 }
                    //             }, '详情')
                    //         ])
                    //     }
                    // }
                ],
                userInfo: {},
                visible:false,
                list:[],
                idsList:[],
                IDS:[],
                newList:[],
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
            allSelect(selection){
                 let arrData = []
                    selection.forEach(item=>{
                        arrData.push(item.id)
                            })
                            let idsString=arrData.join(',')
                            this.idsList = idsString
            },
            rowSelect(selection,row){
                 let arrData = []
                    selection.forEach(item=>{
                        arrData.push(item.id)
                            })
                            let idsString=arrData.join(',')
                            this.idsList = idsString
            },
            //单机行选中
            rowClick(row,index){
                this.IDS=[]
                  this.$refs.table.objData[index]._isChecked = true 
                  for (let i in  this.$refs.table.objData) {
                        if(i==index){
                          this.$refs.table.objData[i]._isChecked=true
                        }else{
                          this.$refs.table.objData[i]._isChecked=false  
                        }
                    }
                    this.IDS[0]=row
                    let arrData = []
                    this.IDS.forEach(item=>{
                        arrData.push(item.id)
                            })
                            let idsString=arrData.join(',')
                            this.idsList = idsString
            },
            //获取更新时间
            getUpdateTime(){
                this.request('get_ods_update_time', {}, false).then((res) => {
                    if(res.code==1){
                      this.updataTime = res.data
                    }
                })
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
                this.formSearch.designGoodsNo = ''
                this.formSearch.goodsNo = ''
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
                // this.formSearch.classLevel2 ? data.classLevel2 = this.formSearch.classLevel2 :''
                this.formSearch.date? data.years =this.unix_fullb(Number(this.formSearch.date)):delete data.years
                this.formSearch.waveBand? data.waveBand = this.formSearch.waveBand :delete data.waveBand 
                let params=this.formatParams(data)
                let brandId=this.formSearch.brandId?`&brandId=${this.formSearch.brandId}`:'';
                let season=this.formSearch.season?`&season=${this.formSearch.season}`:'';
                let idsList= this.idsList.length?`&ids=${this.idsList}`:'';
                location.href=(`/eop/business/export_goods_info_list?${params}${brandId}${season}${idsList}`)
            },
            formatParams(data) {
                let arr = [];
                for (let name in data) {
                arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
                }
                return arr.join("&");
            },
            //重新获取scm数据
            upNewData(){
                if(this.formSearch.designGoodsNo == '' && this.formSearch.goodsNo == ''){
                    this.$Message.warning('设计款号或大货款号不能为空')
                }else{
                    let data = {}
                    this.formSearch.goodsNo == '' ? delete data.goodsNo : data.goodsNo = this.formSearch.goodsNo
                    this.formSearch.designGoodsNo == '' ? delete data.designGoodsNo : data.designGoodsNo = this.formSearch.designGoodsNo
                    this.request('update_goods_info', {data}, false).then((res) => {
                        if(res.code==1){
                            this.$Message.success('获取成功')
                            this.getGoodsFollowList()
                        }
                    })   
                }
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
                // data.classLevel2 = this.formSearch.classLevel2
                data.goodsNo = this.formSearch.goodsNo
                data.years = this.formSearch.years
                data.season = this.formSearch.season
                data.waveBand = this.formSearch.waveBand
                if (this.formSearch.departmentObj) {
                    data.departmentPath = this.formSearch.departmentObj.unit_path
                }
                this.request('get_goods_info_list', data={data}, true).then((res) => {
                    if (res.code == 1) {
                        this.list = res.data.goodsInfoList
                        this.total = res.data.count
                    }
                })
            },
        }
    }
</script>

<style>

</style>
