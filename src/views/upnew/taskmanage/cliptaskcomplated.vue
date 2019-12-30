<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition" style="font-size:20px;font-weight:bold">   
            {{taskCode}} / 剪辑管理
        </Row>
        <!-- 数据列表 -->
        <!-- <Row class="background-color-white exhibition">
            <Table  ref="currentRowTable" :width="500" 	:columns="columns2" size="small" highlight-row :data="list2"></Table>
        </Row> -->
        <Row class="background-color-white exhibition">
            <Table  ref="currentRowTable"  	:columns="columns" size="small" highlight-row :data="list"></Table>
            <!-- <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" 
                 show-sizer show-total
                 show-elevator 
                 @on-change="currentChange" 
                 @on-page-size-change="sizeChange">
            </Page> -->
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
    import addComponent from '../addComponent/addStaff.vue';
    function formSearch() {
        return {
                 search: ''
        }
    }
    export default {
        data() {
            return {
                list2:[{serialNo:0}],
                visible: false,
                finishVideoPath:'',
                red_packet_table_row_index:-1,
                loadingStatus: false,
                mystyle:{
                    top:'70px',
                },
                bigUlr:'',
                columns2: [
                     {
                        title: '完成视频路径',
                        key: 'finishVideoPath',
                        align: 'center',
                        width: 245,
                        render: (h, params) => {
                              if ((this.page - 1) *this.pageSize + params.index == this.red_packet_table_row_index) {
                                     return h('Input', {
                                    props: {
                                        width:150,
                                        placeholder:params.row.finishVideoPath
                                    },
                                    style: {
                                            minWidth:'100px'
                                        },
                                    on: {
                                        "on-change": (event) => {
                                                     this.finishVideoPath= event.target.value
                                                    //  console.log(params.row.finishVideoPath)    
                                        }
                                    },
                                },
                                )
                            } else {
                                  return h('span', params.row.finishVideoPath)
                            }    
                        }
                     },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        width: 250,
                        fixed :'right',
                        render: (h, params) => {
                        if(params.row.serialNo == '合计'){
                                return h('div', '')
                            }
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
                                                  this.save()
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
                        minWidth: 60
                     },
                    //  {
                    //     title: '完成进度',
                    //     key: 'subTaskStatus',
                    //     align: 'center',
                    //     width: 120,
                    //     render:(h,params)=>{
                    //          if(params.row.subTaskStatus==1) {
                    //               return h('span','已完成')
                    //          }else{
                    //               return h('span','未完成')
                    //          }
                    //     }
                    //   },
                     {
                        title: '图片',
                        key: 'imgUrl',
                        align: 'center',
                        minWidth: 120,
                        fixed :'left',
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
                        minWidth:84,
                    },
                    {
                        title: '季节',
                        key: 'season',
                        align: 'center',
                        minWidth: 84,
                    },
                    {
                        title: '波段',
                        key: 'waveBand',
                        align: 'center',
                        minWidth: 84,
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 100,
                    },
                    {
                        title: '设计款号',
                        key: 'designGoodsNo',
                        align: 'center',
                        minWidth: 100,
                    },
                     {
                        title: '颜色',
                        key: 'color',
                        align: 'center',
                        minWidth: 70,
                      
                    },
                    {
                        title: '大货款号',
                        key: 'goodsNo',
                        align: 'center',
                        minWidth: 90,
                        fixed :'left',
                       
                    },
                    {
                        title: '拍照样应到时间',
                        key: 'photoDateStr',
                        align: 'center',
                        minWidth:120,
                       
                    },
                    {
                        title: '大货合同货期',
                        key: 'contractDateStr',
                        align: 'center',
                        minWidth:120,
                      
                    },
                    {
                        title: '拍照样领取日期',
                        key: 'collectDateStr',
                        align: 'center',
                        minWidth: 120,
                       
                    },
                    {
                        title: '领取件数',
                        key: 'collectQty',
                        align: 'center',
                        minWidth:84,
                        
                    },
                    {
                        title: '延期天数',
                        key: 'delayDays',
                        align: 'center',
                        minWidth:84,
                       
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                        width: 120,
                       
                    },
                    {
                        title: '设计师',
                        key: 'designerName',
                        align: 'center',
                        minWidth:84,
                       
                    },
                     {
                        title: '企划跟进人',
                        key: 'plannerName',
                        align: 'center',
                        minWidth:96,
                      
                    },
                     {
                        title: '剪辑师',
                        key: 'cutVideoName',
                        align: 'center',
                        minWidth:90,
                      
                    },
                    //  {
                    //     title: '原视频路径',
                    //     key: 'operation',
                    //     align: 'center',
                    //     width: 120,
                      
                    // },
                    //  {
                    //     title: '原外拍图片路径',
                    //     key: 'operation',
                    //     align: 'center',
                    //     width: 120,
                      
                    // },
                    // {
                    //     title: '原静物图片路径',
                    //     key: 'operation',
                    //     align: 'center',
                    //     width: 120,
                      
                    // },
                    {
                        title: '选视频路径',
                        key: 'chooseVideoPath',
                        align: 'center',
                        minWidth: 120,
                      
                    },
                    // {
                    //     title: '完成视频路径',
                    //     key: 'finishVideoPath',
                    //     align: 'center',
                    //     minWidth: 120,
                      
                    // },
                     {
                        title: '完成视频路径',
                        key: 'finishVideoPath',
                        align: 'center',
                        minWidth: 200,
                        render: (h, params) => {
                              if ((this.page - 1) *this.pageSize + params.index == this.red_packet_table_row_index) {
                                     return h('Input', {
                                    props: {
                                        width:150,
                                        placeholder:params.row.finishVideoPath
                                    },
                                    style: {
                                            minWidth:'100px'
                                        },
                                    on: {
                                        "on-change": (event) => {
                                                     this.finishVideoPath= event.target.value  
                                        }
                                    },
                                },
                                )
                            } else {
                                  return h('span', params.row.finishVideoPath)
                            }    
                        }
                     },
                      {
                        title: '视频ID',
                        key: 'videoId',
                        align: 'center',
                        minWidth: 200,
                        render: (h, params) => {
                              if ((this.page - 1) *this.pageSize + params.index == this.red_packet_table_row_index) {
                                     return h('Input', {
                                    props: {
                                        width:150,
                                        placeholder:params.row.videoId
                                    },
                                    style: {
                                            minWidth:'100px'
                                        },
                                    on: {
                                        "on-change": (event) => { 
                                                      params.row.videoId= event.target.value  
                                        }
                                    },
                                },
                                )
                            } else {
                                  return h('span', params.row.videoId)
                            }    
                        }
                     },
                ],
                userInfo: {},
                taskCode:'',
                list: [],
                total: 0,
                page: 1,
                pageSize: 10, 
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
            //初始化第一个列表
            getData() {
                    this.taskCode             =  this.$route.query.taskCode
                    const  {taskCode }        =  this.$route.query
                    this.taskCode             =  taskCode
                    let data                  =  {}
                        data.taskCode         =  taskCode;
                        data.length           =  this.pageSize;
                        data.start            =  (this.page - 1) * this.pageSize 
                        data.currentEopId     = this.userInfo.userId
                    this.request('productlaunch_cutVideoTask_getTaskDetailByTaskCode', {data:data}, true).then((res) => {
                        if (res.code == 1) {
                             this.list2=[]
                             this.list2.push({
                                              finishVideoPath  :  res.data[0].finishVideoPath,
                                      })
                             this.finishVideoPath= res.data[0].finishVideoPath
                             let serialNoBegain = this.pageSize * (this.page - 1);
                                res.data.forEach((item) => {
                                    serialNoBegain ++;
                                    item.serialNo = serialNoBegain
                                })
                                    this.list     = res.data
                                    // this.total    = res.data.count
                        }else{
                                    this.list      = []
                                    // this.total     = '0' 
                        }
                    })

                },  
                save(){
                            this.red_packet_table_row_index = -1;
                            let data={};
                                data.lastUpdateUser   =  this.userInfo.userName
                                data.finishVideoPath  =  this.finishVideoPath
                            const subarray=[]
                                for(let i=0,len=this.list.length;i<len;i++){
                                  subarray.push(this.list[i].taskDetailId)
                                }
                                 data.ids=subarray
                                if(!data.finishVideoPath)return this.$Message.error('完成视频路径不能为空！')
                                this.request('productlaunch_cutVideoTask_saveFinishVideoPath',{
                                                data:data
                                },true).then(res=>{
                                                if(res.code == 1){
                                                    this.$Message.success(res.msg);
                                                    this.search()
                                                }
                                            })         
                },
                submit(){
                            this.red_packet_table_row_index = -1;
                            let data={};

                                data.lastUpdateUser   = this.userInfo.userName
                                data.taskCode         = this.$route.query.taskCode
                            
                                if(!this.finishVideoPath)return this.$Message.error('完成视频路径不能为空！')
                                this.request('productlaunch_cutVideoTask_commit',{
                                                data:data
                                },true).then(res=>{
                                                if(res.code == 1){
                                                    this.$Message.success(res.msg);
                                                    this.search()
                                                      this.$router.push({
                                                          name:'cliptaskcomplated',
                                                          query: { 
                                                                 taskCode: this.$route.query.taskCode
                                                         }
                                                 })
                                                }
                                            })         
                },
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
