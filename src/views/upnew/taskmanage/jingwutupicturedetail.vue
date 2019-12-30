<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition" style="font-size:20px;font-weight:bold">   
            {{taskCode}} / 静物图片详情 <Button style="margin-top:10px;margin-right:20px;float:right" type="primary" @click="submit">提交</Button>
        </Row>
        <!-- 数据列表 -->
        <Row class="background-color-white exhibition">
            <!-- <Table  :width="1053" 	:columns="columns2" size="small" highlight-row :data="list2"></Table> -->
             <Table   	:columns="columns2" size="small" highlight-row :data="list2"></Table>
        </Row>
        <Row class="background-color-white exhibition">
            <Table  ref="currentRowTable" 	:columns="columns" size="small" highlight-row :data="list"></Table>
            <!-- <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total
                show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page> -->
        </Row>
         <!-- <Row class="margin-bottom-10 background-color-white exhibition" style="font-size:20px;font-weight:bold;text-align:center">   
              <Button type="primary" @click="submit">提交</Button>
        </Row> -->
          <Modal title="查看大图" v-model="visible"> 
                <img :src="'data:image/png;base64,'+bigUlr" v-if="visible" style="width: 100%">
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
        data() {
            return {
                bigUlr:'',
                list2:[],
                stillLifePath:'',
                taskCode:'',
                visible: false,
                red_packet_table_row_index:-1,
                loadingStatus: false,
                mystyle:{
                    top:'70px',
                },
                 columns2: [
                    //  {
                    //     title: '拍摄方案',
                    //     key: 'shootingPlanFile',
                    //     align: 'center',
                    //     minWidth: 180,
                    //     render:(h,params)=>{
                    //         return h('span',{
                    //              style:{
                    //                  color:'#2d8cf0',
                    //                  cursor:'pointer'
                    //              },
                    //              on: {
                    //                  click: () => {
                    //                          this.downloadFiles(params.row,'1')      
                    //                     }

                    //                 } 
                    //         },params.row.shootingPlanFile)
                    //     }
                    //  },
                    //  {
                    //     title: '搭配方案',
                    //     key: 'matchPlanFile',
                    //     align: 'center',
                    //     minWidth: 180,
                    //     render:(h,params)=>{
                    //         return h('span',{
                    //              style:{
                    //                  color:'#2d8cf0',
                    //                  cursor:'pointer'
                    //              },
                    //              on: {
                    //                  click: () => {
                    //                         this.downloadFiles(params.row,'2')      
                    //                     }

                    //                 } 
                    //         },params.row.matchPlanFile)
                    //     }
                    //   },
                    {
                        title: '静物方案',
                        key: 'stilllifePlanFile',
                        align: 'center',
                        minWidth: 180,
                        render:(h,params)=>{
                            return h('span',{
                                 style:{
                                     color:'#2d8cf0',
                                     cursor:'pointer'
                                 },
                                 on: {
                                     click: () => {
                                            this.downloadFiles(params.row,'3')      
                                        }

                                    } 
                            },params.row.stilllifePlanFile)
                        }
                        
                    },
                    {
                        title: '原静物图片路径',
                        key: 'stillLifePath',
                        align: 'center',
                        minWidth: 260,
                        render: (h, params) => {
                                  if ((this.page - 1) *this.pageSize + params.index == this.red_packet_table_row_index) {
                                     return h('Input', {
                                    props: {
                                        width:150,
                                        placeholder:params.row.stillLifePath
                                    },
                                    style: {
                                            minWidth:'100px'
                                        },
                                    // on: {
                                    //     "on-change": (event) => {
                                    //         params.row.stillLifePath= event.target.value
                                    //         this.stillLifePath      = event.target.value
                                    //     }
                                    // },
                                    on: {
                                        "on-change": (event) => {
                                            params.row.stillLifePath= event.target.value
                                            this.stillLifePath      = event.target.value
                                            if(event.target.value.length>200){
                                                this.$Message.warning('最大的输入长度为200字节')
                                                 params.row.stillLifePath= params.row.stillLifePath.substr(0,200)
                                            }
                                           
                                        }
                                    },
                                },
                              )
                            } else {
                                return h('span', params.row.stillLifePath)
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        minWidth: 250,
                        fixed :'right',
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
                                        click: () => {
                                            this.red_packet_table_row_index = (this.page - 1) * this.pageSize + params.index;
                                        }
                                    }
                                }, '编辑'),
                                  h('Button', {
                                    props: {
                                        type: 'default',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                             this.red_packet_table_row_index = -1;
                                             this.getData()       
                                        }

                                    }
                                }, '取消'),
                                 h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                               this.red_packet_table_row_index = -1;
                                                let data={};
                                                    data.lastUpdateUser   = this.userInfo.userName
                                                    data.taskCode         = this.$route.query.taskCode
                                                    data.stillLifePath    = params.row.stillLifePath
                                                    if(!data.stillLifePath)return this.$Message.error('原静物图片路径不能为空！')
                                            this.request('productlaunch_saveDevelopStillLifePath',{
                                                data:data
                                            },true).then(res=>{
                                                if(res.code == 1){
                                                    this.$Message.success(res.msg);
                                                    this.red_packet_table_row_index = -1;
                                                    this.search()
                                                }
                                            })     
                                        }
                                    }
                                }, '保存'),
                            ]);
                        }
                    }
                    ],
                columns: [
                     {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 60
                     },
                     {
                        title: '图片',
                        key: 'imgUrl',
                        align: 'center',
                        width: 90,
                        render: (h, params) => {
                           if(params.row.imgUrl){
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
                                                        width: 'auto',
                                                        height: 'auto',
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        objectFit: 'cover'
                                                },
                                            domProps:{
                                                       src:this.host+params.row.imgUrl,
                                                       src:'data:image/png;base64,'+params.row.imgUrl,
                                             },
                                            on: {
                                                  click: () => {
                                                            //   this.bigUlr=params.row.imgUrl
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
                                                     width: '80px',
                                                     height:'80px',
                                                },
                                            domProps:{
                                                       src:'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1562574299&di=846b4c904bd54d3c3821fa5938888c69&src=http://hbimg.b0.upaiyun.com/bdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658',
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
                        key: 'years',
                        align: 'center',
                        width: 90,
                    },
                    {
                        title: '季节',
                        key: 'season',
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: '波段',
                        key: 'waveBand',
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
                        title: '款号',
                        key: 'designGoodsNo',
                        align: 'center',
                         width: 80,
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
                        key: 'photoDateStr',
                        align: 'center',
                        width: 120,
                       
                    },
                    {
                        title: '大货合同货期',
                        key: 'contractDateStr',
                        align: 'center',
                        width: 120,
                      
                    },
                     {
                        title: '拍照样领取日期',
                        key  : 'collectDateStr',
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
                        render:(h,params)=>{
                            if(params.row.delayDays){
                                return h('span',params.row.delayDays)
                            }else{
                                  return h('span','0')
                            }
                        }
                       
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
                this.getData()
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
            //初始化第一个列表数据
            getData() {
                    this.taskCode             =  this.$route.query.taskCode
                    const  {taskCode }        =  this.$route.query
                    let data                  =  {}
                        data.taskCode         =  taskCode;
                        data.length           =  this.pageSize;
                        data.start            =  (this.page - 1) * this.pageSize
                    this.request('productlaunch_getDevelopStillLifeDetail', {data:data}, true).then((res) => {
                        if (res.code == 1) {
                             this.list2=[]
                             this.list2.push({
                                            shootingPlanFile : res.data.shootingPlanFile,
                                            shootingPlanUrl  : res.data.shootingPlanUrl,
                                            matchPlanFile    : res.data.matchPlanFile,
                                            matchPlanUrl     : res.data.matchPlanUrl,
                                            stilllifePlanFile: res.data.stilllifePlanFile,
                                            stilllifePlanUrl : res.data.stilllifePlanUrl,
                                            originalPhotoPath: res.data.originalPhotoPath,
                                            stillLifePath    : res.data.stillLifePath

                                     })
                             this.stillLifePath= res.data.stillLifePath
                             let serialNoBegain = this.pageSize * (this.page - 1);
                                res.data.photoManageList.forEach((item) => {
                                    serialNoBegain ++;
                                    item.serialNo = serialNoBegain
                                })
                                    this.list     = res.data.photoManageList
                                    this.total    = res.data.count
                        }else{
                                    this.list      = []
                                    this.total     = '0' 
                        }
                    })

                },  
                submit(){
                            this.red_packet_table_row_index = -1;
                            let data={};
                                data.lastUpdateUser   = this.userInfo.userName
                                data.taskCode         = this.$route.query.taskCode
                                data.stillLifePath= this.stillLifePath
                                if(!data.stillLifePath)return this.$Message.error('原静物图片路径不能为空！')
                                this.request('productlaunch_submitDevelopStillLife',{
                                                data:data
                                },true).then(res=>{
                                                if(res.code == 1){
                                                    this.$Message.success(res.msg);
                                                    this.search()
                                                      this.$router.push({
                                                          name:'jingwutupicturecomplated',
                                                          query: { 
                                                                 taskCode: this.$route.query.taskCode
                                                         }
                                                 })
                                                }
                                            })         
                },
                downloadFiles(v,type){
                               console.log(v,'99999999')
                                // return 
                               let {taskCode}=this.$route.query
                                    switch(type){
                                        case '1':
                                            let  {shootingPlanUrl,shootingPlanFile}=v
                                            let fileUrl=`fileUrl=${shootingPlanUrl}`,
                                                fileName=`&fileName=${shootingPlanFile}`;
                                            location.href='/eop/productlaunch/downloadFile'+`?${fileUrl}&taskCode=${taskCode}${fileName}`
                                            console.log(`?${fileUrl}&taskCode=${taskCode}${fileName}`)
                                            break;
                                          case '2':
                                            let  {matchPlanFile,matchPlanUrl}=v
                                            let fileUrls=`fileUrl=${matchPlanUrl}`,
                                                fileNames=`&fileName=${matchPlanFile}`;
                                            location.href='/eop/productlaunch/downloadFile'+`?${fileUrls}&taskCode=${taskCode}${fileNames}`
                                            console.log(`?${fileUrls}&taskCode=${taskCode}${fileNames}`)
                                            break;
                                            case '3':
                                            let  {stilllifePlanUrl,stilllifePlanFile}=v
                                            let fileUrlss=`fileUrl=${stilllifePlanUrl}`,
                                                fileNamess=`&fileName=${stilllifePlanFile}`;
                                            location.href='/eop/productlaunch/downloadFile'+`?${fileUrlss}&taskCode=${taskCode}${fileNamess}`
                                              console.log(`${fileUrlss}&taskCode=${taskCode}${fileNamess}`)
                                            break;
                                    }
                               
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
