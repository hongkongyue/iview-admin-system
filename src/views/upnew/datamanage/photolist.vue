<template>
    <div>
        <!-- <Row class="margin-bottom-10 background-color-white exhibition" style="font-size:20px;font-weight:bold">   
            20190704WTS / 修片管理
        </Row> -->
         <Row class="margin-bottom-10 background-color-white exhibition">   
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24">
                <Form-item label="品牌:"  :label-width="50" style="padding-left:20px">
                     <Select v-model="formSearch.brandId" style="width:120px" >
                              <Option v-for="item in brandList" :value="item.brandId" :key="item.brandId">{{item.brandName}}</Option>
                      </Select>
                </Form-item>
                <Form-item label="季节:">
                      <Select v-model="formSearch.season" style="width:120px" >
                              <Option v-for="item in seasonList" :value="item.value" :key="item.value">{{item.label}}</Option>
                      </Select>
                </Form-item>
                <Form-item label="年份:">
                    <Col span="12">
                        <DatePicker type="year" v-model="formSearch.years" format="yyyy年" placeholder="请选择年份" style="width: 120px"></DatePicker>
                    </Col>
                </Form-item>
                 <Form-item label="外拍任务编号:" >
                                 <Input v-model="formSearch.outTaskCode" placeholder="任务编号" style="width: 120px" />
                </Form-item>
                 <Form-item label="静物任务编号:" >
                                 <Input v-model="formSearch.stillTaskCode" placeholder="任务编号" style="width: 120px" />
                </Form-item>
                <Form-item :label-width="1">
                            <Button type="primary" @click="search">查询</Button>
                            <Button type="default" @click="handleReset">重置</Button>
                            <Button type="primary" @click="exports">导出</Button>
                </Form-item>
                </Col>
            
            </Form>
        </Row>
        <Row class="background-color-white exhibition">
            <Table  ref="currentRowTable" 	:columns="columns" size="small" highlight-row :data="list"></Table>
            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total
                show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
        </Row>
         <Modal title="查看大图" v-model="visible"> 
                <img :src="'data:image/png;base64,'+bigUlr" v-if="visible" style="width: 100%">
         </Modal>
    </div>
</template>

<script>
    import Util from 'libs/util';
    import filter from '../../../filter'
    // import addComponent from '../addComponent/addStaff.vue';
    function formSearch() {
        return {
                 search: ''
        }
    }
    export default {
        data() {
            return {
                list2:[],
                waveList:[],
                visible: false,
                red_packet_table_row_index:-1,
                loadingStatus: false,
                mystyle:{
                    top:'70px',
                },
                getStatus:[{
                    label:'未完成',value:0
                },{
                    label:'进行中',value:1
                },{
                    label:'已完成',value:2
                }],
                brandList   : [],         // 初始化品牌列表
                allusersList: [],      //初始化全部用户列表
                alldealList : [],      //初始化全部处理人列表
                add_visible : false,
                seasonList   :[         //四季列表
                  {label:'春季',value:'春季'},
                  {label:'夏季',value:'夏季'},
                  {label:'秋季',value:'秋季'},
                  {label:'冬季',value:'冬季'},
                ],
                columns: [
                     {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 60
                     },
                     {
                        title: '外拍任务编号',
                        key: 'outTaskCode',
                        align: 'center',
                        width: 90,
                      },
                     {
                        title: '外拍拍摄次数',
                        key  : 'outTaskCount',
                        align: 'center',
                        width: 90,
                      },
                      {
                        title: '静物任务编号',
                        key: 'stillTaskCode',
                        align: 'center',
                        width: 90,
                      },
                     {
                        title: '静物拍摄次数',
                        key  : 'stillTaskCount',
                        align: 'center',
                        width: 90,
                      },
                       {
                        title: '图片',
                        key  : 'photoReportTimes',
                        align: 'center',
                        width: 90,
                         render: (h, params) => {
                           if(params.row.goodsImg){
                               return h('div',{
                                   style: {
                                                        width: '80px',
                                                        height:'80px',
                                                        textAlign:'center',
                                                        lineHeight:'80px'
                                                },
                               },
                               [h('img', {         
                                           style: {
                                                        width    : 'auto',
                                                        height   : 'auto',
                                                        maxWidth : '100%',
                                                        maxHeight: '100%',
                                                        objectFit: 'cover'
                                                },
                                            domProps:{
                                                       src:this.host+params.row.imgUrl,
                                                       src:'data:image/png;base64,'+params.row.goodsImg,
                                             },
                                            on: {
                                                  click: () => {
                                                            //   this.bigUlr=params.row.goodsImg
                                                            //   this.visible=true;
                                                            this.getBigImgUrl(params.row.bigImgUrl)
                                                            }
                                                }
                                                    }, '')
                                                    
                                                    
                                    ])
                                //  return h('img', {
                                           
                           }else{
                                  return h('img', {
                                           style: {
                                                     display: 'inline-block',
                                                     width  : '80px',
                                                     height : '80px',
                                                },
                                            domProps:{
                                                       src  : 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1562574299&di=846b4c904bd54d3c3821fa5938888c69&src=http://hbimg.b0.upaiyun.com/bdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658',
                                             },
                                            on: {
                                                  click: () => {  
                                                           
                                                   }
                                                }
                                                    }, '');  
                           }             
                        }
                      },
                    {
                        title: '年份',
                        key  : 'years',
                        align: 'center',
                        width: 90,
                    },
                    {
                        title: '季节',
                        key  : 'season',
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: '波段',
                        key  : 'waveBand',
                        align: 'center',
                        width: 80,
               
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                          width: 80,
                    },
                    {
                        title: '设计款号',
                        key: 'designGoodsNo',
                        align: 'center',
                         width: 90,
                    },
                    {
                        title: '颜色',
                        key: 'color',
                        align: 'center',
                        width: 80,
                      
                    },
                    {
                        title: '大货款号',
                        key: 'goodsNo',
                        align: 'center',
                        width: 90,
                       
                    },
                    {
                        title: '拍照样应到时间',
                        key: 'photoDate',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '大货合同货期',
                        key: 'contractDate',
                        align: 'center',
                        width: 120,
                      
                    },
                    {
                        title: '拍照样领取日期',
                        key: 'collectDate',
                        align: 'center',
                        width: 120,
                       
                    },
                    {
                        title: '领取件数',
                        key: 'collectQty',
                        align: 'center',
                        width: 90,
                        
                    },
                     {
                        title: '延期天数',
                        key: 'delayDays',
                        align: 'center',
                        width: 90,
                       
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                         width: 100,
                       
                    },
                     {
                        title: '设计师',
                        key: 'designerName',
                        align: 'center',
                         width: 90,
                       
                    },
                     {
                        title: '企划跟进人',
                        key: 'plannerName',
                        align: 'center',
                         width: 120,
                      
                    },
                    {
                        title: '美编',
                        key  : 'retouchName',
                        align: 'center',
                        width: 90,
                      
                    },
                    {
                        title: '剪辑师',
                        key  : 'cutVideoName',
                        align: 'center',
                        width: 90,
                      
                    },
                    {
                        title: '原视频路径',
                        key  : 'originalVideoPath',
                        align: 'center',
                        width: 120,
                      
                    },
                    {
                        title: '原外拍图片路径',
                        key  : 'originalPhotoPath',
                        align: 'center',
                        width: 120,
                      
                    },
                     {
                        title: '原静物图片路径',
                        key  : 'stillLifePath',
                        align: 'center',
                        width: 120,
                      
                    },
                    {
                        title: '选外拍图片路径',
                        key: 'chooseOutDoorPath',
                        align: 'center',
                         minWidth: 120,
                      
                    },
                    {
                        title: '选静物图片路径',
                        key: 'chooseStillLifePath',
                        align: 'center',
                         minWidth: 120,
                      
                    },
                    // {
                    //     title: '选片路径',
                    //     key  : 'choosePhotoPath',
                    //     align: 'center',
                    //     width: 120,
                      
                    // },
                    
                     
                     {
                        title: '选视频路径',
                        key: 'chooseVideoPath',
                        align: 'center',
                         width: 120,
                      
                    },
                    {
                        title: '完成静物图路径',
                        key: 'finishStillLifePath',
                        align: 'center',
                         minWidth: 120,
                      
                    },
                     {
                        title: '完成外拍图路径',
                        key: 'finishOutDoorPath',
                        align: 'center',
                         minWidth: 120,
                      
                    },
                    // {
                    //     title: '完成图路径',
                    //     key: 'finishPhotoPath',
                    //     align: 'center',
                    //      width: 120,
                      
                    // },
                    {
                        title: '完成视频路径',
                        key: 'finishVideoPath',
                        align: 'center',
                        width: 120,
                      
                     },
                     
                      {
                        title: '视频ID',
                        key: 'videoId',
                        align: 'center',
                        width: 90,
                      
                     },
                     {
                        title: '上新链接',
                        key  : 'productLaunchPath',
                        align: 'center',
                        width: 120,
                      
                    },
                ],
                departmentList: [],
                questionDescrible:false,
                IDS:[], //批量操作的id
                userInfo: {},
                list: [],
                total: 0,
                page: 1,
                pageSize: 10,
                formSearch: {
                },
                dealformSearch:{
                },
                backformSearch:{},     //回退数据
                brandList:[],          //品牌列表
                modal_visible:false,   // 编 
            }
        },
        components:{
            // addComponent,
            // editComponent
        },
        mounted() {
                    this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo')); 
                    this.getData     ()
                    this.getbrandList()
                    this.allDealsList()
                    this.getwaveList ()
        },
        activated() {

        },
        methods: {
            getBigImgUrl(url){
                let data = {}
                data.bigImgUrl = url
                this.request('productlaunch_getGoodsImg', {data}, false).then((res) => {
                    if(res.code==1){
                        this.bigUlr = res.data
                        this.visible=true
                    }
                })
            },
            //重置表单
               resetFormdata(){
                       this.formSearch={}
               },
               handleReset(){
                       this.resetFormdata();
                       this.search()
               },
               search() {
                       this.page =1
                       this.getData()
                },  
            currentChange(page) {
                       this.page = page
                       this.getData()
                },
            sizeChange(pageSize) {
                      this.pageSize = pageSize
                      this.getData()
                },
            //初始化品牌列表
            getbrandList(){
                this.request('get_scm_brand_list', {}, false).then((res) => {
                        if(res.code==1){
                        this.brandList=res.data
                        }
                    })    
                },
            //初始化处理人列表
            allDealsList(){
                    this.request('get_employee_list', {}, false).then((res) => {
                            if(res.errno==0){//productlaunch_developTimeConfig_selectAllTask
                            this.alldealList=res.data
                            console.log('999999999')
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
            //初始化第一个列表数据
            getData() {
                        let data              =   {}
                            data.length       =   this.pageSize
                            data.start        =   (this.page - 1) * this.pageSize
                            // data.taskCode     =   this.formSearch.taskCode ? this.formSearch.taskCode : ''
                            this.formSearch.stillTaskCode ? data.stillTaskCode = this.formSearch.stillTaskCode : delete data.stillTaskCode //静物编号
                            this.formSearch.outTaskCode ? data.outTaskCode = this.formSearch.outTaskCode : delete data.outTaskCode  //外拍编号
                            data.years        =   filter.get_unix_only(this.formSearch.years)
                            data.season       =   this.formSearch.season
                            data.brandId      =   this.formSearch.brandId
                            this.request('productlaunch_developPhotoReportManage_reportDetail', {data:data}, true).then((res) => {
                                if (res.code == 1) {
                                    let serialNoBegain = this.pageSize * (this.page - 1);
                                        res.data.results.forEach((item) => {
                                            serialNoBegain++;
                                            item.serialNo = serialNoBegain;
                                        })
                                        this.list = res.data.results;
                                        this.total = res.data.totalRecord;
                                }else{
                                    this.list      = []
                                    this.total     = '0' 
                                }
                            })

                },   
                exports(){
                        let data={}
                                // data.taskCode     =   this.formSearch.taskCode ? this.formSearch.taskCode : ''
                                this.formSearch.stillTaskCode ? data.stillTaskCode = this.formSearch.stillTaskCode : delete data.stillTaskCode //静物编号
                                this.formSearch.outTaskCode ? data.outTaskCode = this.formSearch.outTaskCode : delete data.outTaskCode  //外拍编号
                                data.years        =   filter.get_unix_only(this.formSearch.years)
                                data.season       =   this.formSearch.season

                                data.brandId      =   this.formSearch.brandId
                                data.years  ?  data.years  : delete  data.years
                                data.season ?  data.season : delete  data.season
                                data.brandId? data.brandId : delete  data.brandId
                        let params=filter.formatParams(data)
                        location.href=(`/eop/productlaunch/developPhotoReportManage/reportExport?${params}`)
                }
        }       
    } 
</script>

<style>
    .ivu-modal-footer{
        border-top:0;
    }
        .demo-upload-list{
            display: inline-block;
            width: 60px;
            height: 60px;
            text-align: center;
            line-height: 60px;
            border: 1px solid transparent;
            border-radius: 4px;
            overflow: hidden;
            background: #fff;
            position: relative;
            box-shadow: 0 1px 1px rgba(0,0,0,.2);
            margin-right: 4px;
        }
        .demo-upload-list img{
            width: 100%;
            height: 100%;
        }
        .demo-upload-list-cover{
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,.6);
        }
        .demo-upload-list:hover .demo-upload-list-cover{
            display: block;
        }
        .demo-upload-list-cover i{
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            margin: 0 2px;
        }
</style>
