<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition" style="font-size:20px;font-weight:bold">   
           {{taskCode}} {{this.$route.query.taskName}} <Button style="margin-top:10px;margin-right:20px;float:right" type="primary" @click="submit">提交</Button>
        </Row>
         <Row class="margin-bottom-10 background-color-white exhibition">   
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24">
                <Form-item label="完成进度:">
                                    　<Select v-model="formSearch.productLaunchStatus" style="width:120px">
                                        <Option v-for="item in getStatus" :value="item.value" :key="item.label">
                                            {{ item.label }}
                                        </Option>
                                    </Select>
                </Form-item>
                <Form-item label="大货款号:">
                                    <Input v-model="formSearch.goodsNo" placeholder="大货款号" style="width: 120px" />
                </Form-item>
                <Form-item :label-width="1">
                            <Button type="primary" @click="search">查询</Button>
                            <Button type="default" @click="handleReset">重置</Button>
                           
                </Form-item>
                </Col>
            
            </Form>
        </Row>
        <Row class="background-color-white exhibition">
            <Table v-if="this.$route.query.projectCode==0"   ref="currentRowTable" 	:columns="columns" size="small" highlight-row :data="list"></Table>
            <Table v-if="this.$route.query.projectCode==1"   ref="currentRowTable" 	:columns="columns2" size="small" highlight-row :data="list"></Table>
            <!-- <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total
                show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page> -->
        </Row>
        <!-- <Row class="margin-bottom-10 background-color-white exhibition" style="font-size:20px;font-weight:bold;text-align:center">   
                   <Button type="primary" @click="submit">提交</Button>
        </Row> -->
         <Modal title="查看大图" v-model="visible">
                <img   :src="'data:image/png;base64,'+bigUlr" v-if="visible" style="width: 100%">
         </Modal>
    </div>
</template>

<script>
    import Util from 'libs/util';
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
                    label:'已完成',value:1
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
                        title: '完成进度',
                        key: 'finishPhotoStatus',
                        align: 'center',
                        minWidth: 84,
                        render:(h,params) => {
                            if(params.row.finishPhotoStatus==1){
                                    return h('span',{},'已完成')
                            }else{
                                   return  h('span',{},'未完成')  
                              }
                        }
                      },
                     {
                        title: '图片',
                        key: 'departmentName',
                        align: 'center',
                        width: 120,
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
                        minWidth: 84,
                    },
                    {
                        title: '季节',
                        key: 'season',
                        align: 'center',
                        minWidth: 60,
                    },
                    {
                        title: '波段',
                        key: 'waveBand',
                        align: 'center',
                        minWidth: 60,
               
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 110,
                    },
                    {
                        title: '设计款号',
                        key: 'designGoodsNo',
                        align: 'center',
                        minWidth: 90,
                    },
                     {
                        title: '颜色',
                        key: 'color',
                        align: 'center',
                        minWidth: 84,
                      
                    },
                    {
                        title: '大货款号',
                        key: 'goodsNo',
                        align: 'center',
                        minWidth: 84,
                        fixed :'left',
                       
                    },
                    {
                        title: '拍照样应到时间',
                        key: 'photoDate',
                        align: 'center',
                        minWidth: 120,
                       
                    },
                    {
                        title: '大货合同货期',
                        key: 'contractDate',
                        align: 'center',
                        minWidth: 120,
                      
                    },
                     {
                        title: '拍照样领取日期',
                        key: 'collectDate',
                        align: 'center',
                        minWidth: 120,
                       
                    },
                    {
                        title: '领取件数',
                        key: 'collectQty',
                        align: 'center',
                        minWidth: 84,
                        
                    },
                     {
                        title: '延期天数',
                        key  : 'delayDays',
                        align: 'center',
                         minWidth: 84,
                       
                    },
                    {
                        title: '备注',
                        key  : 'remark',
                        align: 'center',
                         minWidth: 84,
                       
                    },
                     {
                        title : '设计师',
                        key   : 'designerName',
                        align : 'center',
                        minWidth: 84,
                       
                    },
                     {
                        title : '企划跟进人',
                        key   : 'plannerName',
                        align : 'center',
                        minWidth: 96,
                      
                    },
                     {
                        title : '美编',
                        key   : 'retouchName',
                        align : 'center',
                        minWidth: 96,
                      
                    },
                    {
                        title : '选外拍图片路径',
                        key   : 'choosePhotoPath',
                        align : 'center',
                        minWidth : 120,
                      
                    },
                    {
                        title : '完成外拍图片路径',
                        key   : 'finishPhotoPath',
                        align : 'center',
                        minWidth : 140,
                        render: (h, params) => {
                                  if ((this.page - 1) *this.pageSize + params.index == this.red_packet_table_row_index) {
                                     return h('Input', {
                                    props: {
                                        width      :150,
                                        type:'text',
                                        placeholder:params.row.finishPhotoPath,
                                        maxlength:201,
                                    },
                                    style: {
                                            minWidth:'100px'
                                        },
                                    on: {
                                        "on-change": (event) => {
                                            params.row.finishPhotoPath= event.target.value
                                            if(event.target.value.length>200){
                                                this.$Message.warning('最大的输入长度为200字节')
                                                 params.row.finishPhotoPath= params.row.finishPhotoPath.substr(0,200)
                                            }
                                           
                                        }
                                    },
                                },
                              )
                            } else {
                                return h('span', params.row.finishPhotoPath)
                            }
                        }
                      
                    },
                       {
                        title : '操作',
                        key   : 'lastUpdateUser',
                        align : 'center',
                        width : 180,
                        fixed :'right',
                        render: (h, params) => {
                                return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
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
                                        marginRight: '5px',
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
                                        marginRight: '5px',
                                    },
                                    on: {
                                        click: () => {
                                                this.red_packet_table_row_index = -1;
                                                if(!params.row.finishPhotoPath) return this.$Message.error('完成外拍图片路径不能为空！')
                                                let photoManageList=[]
                                                    photoManageList[0]={
                                                                     taskDetailId:params.row.taskDetailId,
                                                                     finishPhotoPath:params.row.finishPhotoPath 
                                                    } 
                                                this.save(photoManageList,400,'')
                                        }
                                    }
                                }, '保存'),
                               ]);  
                             
                        },
                    },
                ],
                columns2: [
                     {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 60
                     },
                      {
                        title: '完成进度',
                        key: 'finishPhotoStatus',
                        align: 'center',
                        minWidth: 84,
                        render:(h,params) => {
                            if(params.row.finishPhotoStatus==1){
                                    return h('span',{},'已完成')
                            }else{
                                   return  h('span',{},'未完成')  
                              }
                        }
                      },
                     {
                        title: '图片',
                        key: 'departmentName',
                        align: 'center',
                        width: 120,
                        fixed: 'left',
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
                        minWidth: 84,
                    },
                    {
                        title: '季节',
                        key: 'season',
                        align: 'center',
                        minWidth: 60,
                    },
                    {
                        title: '波段',
                        key: 'waveBand',
                        align: 'center',
                        minWidth: 60,
               
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 110,
                    },
                    {
                        title: '设计款号',
                        key: 'designGoodsNo',
                        align: 'center',
                        minWidth: 90,
                    },
                     {
                        title: '颜色',
                        key: 'color',
                        align: 'center',
                        minWidth: 84,
                      
                    },
                    {
                        title: '大货款号',
                        key: 'goodsNo',
                        align: 'center',
                        minWidth: 84,
                        fixed: 'left',
                       
                    },
                    {
                        title: '拍照样应到时间',
                        key: 'photoDate',
                        align: 'center',
                        minWidth: 120,
                       
                    },
                    {
                        title: '大货合同货期',
                        key: 'contractDate',
                        align: 'center',
                        minWidth: 120,
                      
                    },
                     {
                        title: '拍照样领取日期',
                        key: 'collectDate',
                        align: 'center',
                        minWidth: 120,
                       
                    },
                    {
                        title: '领取件数',
                        key: 'collectQty',
                        align: 'center',
                        minWidth: 84,
                        
                    },
                     {
                        title: '延期天数',
                        key  : 'delayDays',
                        align: 'center',
                         minWidth: 84,
                       
                    },
                    {
                        title: '备注',
                        key  : 'remark',
                        align: 'center',
                         minWidth: 84,
                       
                    },
                     {
                        title : '设计师',
                        key   : 'designerName',
                        align : 'center',
                        minWidth: 84,
                       
                    },
                     {
                        title : '企划跟进人',
                        key   : 'plannerName',
                        align : 'center',
                        minWidth: 96,
                      
                    },
                     {
                        title : '美编',
                        key   : 'retouchName',
                        align : 'center',
                        minWidth: 96,
                      
                    },
                    {
                        title : '选静物图片路径',
                        key   : 'choosePhotoPath',
                        align : 'center',
                        minWidth : 120,
                      
                    },
                    {
                        title : '完成静物图片路径',
                        key   : 'finishPhotoPath',
                        align : 'center',
                        minWidth : 140,
                        render: (h, params) => {
                                  if ((this.page - 1) *this.pageSize + params.index == this.red_packet_table_row_index) {
                                     return h('Input', {
                                    props: {
                                        width      :150,
                                        type:'text',
                                        placeholder:params.row.finishPhotoPath,
                                        maxlength:201,
                                    },
                                    style: {
                                            minWidth:'100px'
                                        },
                                    on: {
                                        "on-change": (event) => {
                                            params.row.finishPhotoPath= event.target.value
                                            if(event.target.value.length>200){
                                                this.$Message.warning('最大的输入长度为200字节')
                                                 params.row.finishPhotoPath= params.row.finishPhotoPath.substr(0,200)
                                            }
                                           
                                        }
                                    },
                                },
                              )
                            } else {
                                return h('span', params.row.finishPhotoPath)
                            }
                        }
                      
                    },
                       {
                        title : '操作',
                        key   : 'lastUpdateUser',
                        align : 'center',
                        width : 180,
                        fixed :'right',
                        render: (h, params) => {
                                return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
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
                                        marginRight: '5px',
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
                                        marginRight: '5px',
                                    },
                                    on: {
                                        click: () => {
                                                this.red_packet_table_row_index = -1;
                                                if(!params.row.finishPhotoPath) return this.$Message.error('完成静物图片路径不能为空！')
                                                let photoManageList=[]
                                                    photoManageList[0]={
                                                                     taskDetailId:params.row.taskDetailId,
                                                                     finishPhotoPath:params.row.finishPhotoPath 
                                                    } 
                                                this.save(photoManageList,400,'')
                                        }
                                    }
                                }, '保存'),
                               ]);  
                             
                        },
                    },
                ],
                departmentList   : [],
                questionDescrible: false,
                IDS              : [],    //批量操作的id
                userInfo         : {},
                list             : [],
                total            : 0,
                page             : 1,
                pageSize         : 10,
                formSearch       : {
                },
                dealformSearch   : {
                },
                backformSearch   : {},     //回退数据
                brandList        : [],          //品牌列表
                modal_visible    : false,   // 编 
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
              addNew(){
                      this.add_visible=true
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
            //初始化第一个列表数据
              getData() {
                    const  { taskCode }          =  this.$route.query
                    this.taskCode                =  taskCode
                    let data                     =  {}
                        data.taskCode            =  taskCode;
                        data.taskStatus          =  this.formSearch.productLaunchStatus;
                        data.goodsNo             =  this.formSearch.goodsNo
                        data.userId              =  this.userInfo.userId  
                    this.request('productlaunch_retouchPhoto_detail', {data:data}, true).then((res) => {
                        if (res.code == 1) {
                             let serialNoBegain = this.pageSize * (this.page - 1);
                                res.data.detailList.forEach((item) => {
                                    serialNoBegain++;
                                    item.serialNo = serialNoBegain;
                                })
                                this.list      = res.data.detailList
                        }else{
                                this.list      = []
                                this.total     = '0' 
                        }
                    })

                },
                save(photoManageList,status,tag){
                        const  { taskCode,taskName, projectCode}          =  this.$route.query
                        this.taskCode                =  taskCode
                        let data                     =  {}
                            data.taskCode            =  taskCode;
                            data.taskStatus          =  status;
                            data.lastUpdateUser      =  this.userInfo.userName
                            data.photoManageList     =  photoManageList
                      this.request('productlaunch_retouchPhoto_update', {data:data}, true).then((res) => {
                        if (res.code == 1) {
                                 this.$Message.success(res.msg)
                                 this.getData()
                                 if(tag){
                                         this.$router.push({
                                                          name:'xiupiantaskcomplated',
                                                          query: {   
                                                              taskCode   :  taskCode,
                                                              taskName   :  taskName,
                                                              projectCode:projectCode
                                                         }
                                                 })
                                 }
                           }
                    })
                },
                submit(){
                        let submitArray=[]
                        for(let i=0;i<this.list.length;i++){
                            submitArray.push({
                                      taskDetailId:this.list[i].taskDetailId,
                                      finishPhotoPath:this.list[i].finishPhotoPath

                            })
                        }
                        this.save(submitArray,900,'9')
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
