<template>
    <Layout>
        <Content>
                <Row class="background-color-white exhibition">
                    <div style="margin-bottom :20px; height:50px;background-color:#f5f7f9;text-align:left;line-height:50px;font-size:16px; font-weight: bold;padding-left: 20px;">
                    {{this.$route.query.taskCode}} / {{this.$route.query.taskName}}
                    </div>
                     <Row class="margin-bottom-10 background-color-white exhibition">
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="完成进度:"  :label-width="80">
                    <Select v-model="formSearch.brandId" style="width:120px">
                        <Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
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
                   <!-- <Table :columns="columns" size="small" highlight-row :data="list" @on-row-dblclick="edit"></Table> -->
                    <Table style="margin-top:20px"  :columns="columns1" size="small" highlight-row :data="list1" @on-row-dblclick="edit"></Table>
                    
                </Row>
                <Modal title="查看大图" v-model="visible"> 
                    <img :src="'data:image/png;base64,'+bigUlr" v-if="visible" style="width: 100%">
                </Modal>
                <Modal title="查看属性" v-model="modalWatch" @on-cancel='cancelCk' :footer-hide='true' :width="60" >
                        <Form v-if="modalWatch"  :label-width="80">
                            <div style="display:flex;flex-wrap:wrap ">
                                <div v-for="(item,index) in pluginsList"></div>
                                <Form-item v-for="(item,index) in pluginsList" :key="item.name" :value="item.name" :label="item.name" :label-width="80" style="width:33%">
                                    <Select v-model="pluginsListObject['' + item.name]" placeholder="" disabled style="width:150px">
                                        <Option v-for="i in item.optionalDTOS" :value="i.name" :key="i.name">{{ i.name }}</Option>
                                    </Select>
                                </Form-item>
                            </div>
                            <Form-item :label-width="1" style="text-align:center">
                                <Button type="primary" @click="cancelCk">确定</Button>
                                <Button type="default" @click="cancelCk">取消</Button>
                            </Form-item>
                        </Form>
                </Modal>
       </Content>
    </Layout>  
     
</template> 

<script>
    import Util from 'libs/util';
    import axios from 'axios';
    export default {
        data(){
            return {
                input1:[
                {
                    name:"111",
                    id:"222"
                }
            ],
                pluginsListObject:{},
                formdata:{id:'13',name:'q1'},
                pluginsList:[],
                columns1: [{
                        title: '序号',
                        type:'index',
                        align: 'center',
                        width: 60,
                    },
                    {
                        title: '完成进度',
                        key: 'detailStatus',
                        align: 'center',
                        minWidth:90,
                        render(h,params) {
                            if(params.row.detailStatus == 0){
                                return h('span', '未完成')
                            }else{
                                return h('span', '已完成')
                            }
                        },
                    },
                    {
                        title: '大货款号',
                        key: 'goodsNo',
                        align: 'center',
                        minWidth:90,
                        fixed: 'left',
                    },
                      {
                        title: '商品图片',
                        key: 'goodsImg',
                        align: 'center',
                        fixed: 'left',
                        width: 90,
                        render: (h, params) => {
                           if(params.row.goodsImg){
                               return h('div',{
                                   style: {
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
                                                       src:this.host+params.row.goodsImg,
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
                           }else{
                                  return h('img', {
                                           style: {
                                                     display: 'inline-block',
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
                        title: '颜色',
                        key: 'color',
                        align: 'center',
                        minWidth:80,
                    },
                    // {
                    //     title: '商品图片地址',
                    //     key: 'color',
                    //     align: 'center',
                    //     minWidth:150,
                    // },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth:80,
                    },
                    {
                        title: '年份',
                        key: 'years',
                        align: 'center',
                        minWidth:60,
                    },
                    {
                        title: '季节',
                        key: 'season',
                        align: 'center',
                        minWidth:60,
                    },
                    {
                        title: '波段',
                        key: 'waveBand',
                        align: 'center',
                        minWidth:60,
                    },
                    
                    
                    {
                        title: '一级分类',
                        key: 'classLevel1',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '二级分类',
                        key: 'classLevel2',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '三级分类',
                        key: 'classLevel3',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '执行标准',
                        key: 'standard',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '安全类别',
                        key: 'securityLevel',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '质量等级',
                        key: 'qualityLevel',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '洗标类别',
                        key: 'washType',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '国际码',
                        key: 'internationalCode',
                        align: 'center',
                        minWidth:80,
                    },
                    {
                        title: '成分',
                        key: 'ingredient',
                        align: 'center',
                        minWidth:80,
                    },
                    {
                        title: '属性',
                        key: 'properties',
                        align: 'center',
                        minWidth:80,
                        render: (h, params) => {
                            return  h('a',{
                                    on:{
                                'click':(event)=>{
                                    this.showModal(params.row)
                                }
                            }
                        },'查看')
                        }
                    },
                    {
                        title: '尺寸表',
                        key: 'sizeFileName',
                        align: 'center',
                        minWidth:80,
                        render: (h, params) => {
                            return  h('a',{
                                    on:{
                                'click':(event)=>{
                                    this.downLoad(params.row)
                                }
                            }
                        },params.row.sizeFileName ? params.row.sizeFileName : '')
                        }
                    },
                    {
                        title: '总合约单价',
                        key: 'totalContractPrice',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '零售价',
                        key: 'salePrice',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '水洗唛文案',
                        key: 'washLabel',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                            return  h('div',{
                                    style:{
                                        height:'80px',
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                            }
                        },params.row.shellWriter)
                      }
                    },
                    {
                        title: '水洗唛图片',
                        key: 'washLabelUrl',
                        align: 'center',
                        minWidth: 90,
                        render: (h, params) => {
                           if(params.row.washLabelUrl){
                               return h('div',{
                                   style: {
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
                                                       src:this.host+params.row.washLabelUrl,
                                                       src:'data:image/png;base64,'+params.row.washLabelUrl,
                                             },
                                            on: {
                                                  click: () => {
                                                              this.bigUlr=params.row.washLabelUrl
                                                              this.visible=true;
                                                            }
                                                }
                                                    }, '')
                                                    
                                                    
                                    ])    
                           }else{
                                  return h('img', {
                                           style: {
                                                     display: 'inline-block',
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
                        title: '吊牌图片',
                        key: 'tagFile',
                        align: 'center',
                        minWidth:90,
                        render: (h, params) => {
                           if(params.row.tagFile){
                               return h('div',{
                                   style: {
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
                                                       src:this.host+params.row.tagFile,
                                                       src:'data:image/png;base64,'+params.row.tagFile,
                                             },
                                            on: {
                                                  click: () => {
                                                              this.bigUlr=params.row.tagFile
                                                              this.visible=true;
                                                            }
                                                }
                                                    }, '')
                                                    
                                                    
                                    ])    
                           }else{
                                  return h('img', {
                                           style: {
                                                     display: 'inline-block',
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
                        title: '水洗麦',
                        key: 'washType',
                        align: 'center',
                        minWidth:90,
                    },
                    // {
                    //     title: '吊牌图片地址',
                    //     key: 'age',
                    //     align: 'center',
                    //     minWidth:150,
                    // },    shellWriter
                    {
                        title: '面料文案',
                        key: 'shellWriter',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                            return  h('div',{
                                    style:{
                                        height:'80px',
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                            }
                        },params.row.shellWriter)
                        }
                    },
                    {
                        title: '细节文案',
                        key: 'detailWriter',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                            return  h('div',{
                                    style:{
                                        height:'80px',
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                            }
                        },params.row.detailWriter)
                      }
                    },
                    {
                        title: '洗涤说明',
                        key: 'washRemark',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                            return  h('div',{
                                    style:{
                                        height:'80px',
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                            }
                        },params.row.washRemark)
                        }
                    },
                    {
                        title: '温馨提示',
                        key: 'warmTip',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                            return  h('div',{
                                    style:{
                                        height:'80px',
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                            }
                        },params.row.warmTip)
                        }
                    },
                    {
                        title: '商品卖点',
                        key: 'sellingPoint',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                            return  h('div',{
                                    style:{
                                        height:'80px',
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                            }
                        },params.row.sellingPoint)
                        }
                    },
                     {
                        title: '设计解读',
                        key: 'designInterpret',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                            return  h('div',{
                                    style:{
                                        height:'80px',
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                            }
                        },params.row.designInterpret)
                        }
                    },
                    {
                        title: '商品ID',
                        key: 'goodsId',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                return  h('div',{
                                    style:{
                                        height:'80px',
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                            }
                        },params.row.goodsId)
                       }
                    },
                     {
                        title: '企划跟进人',
                        key: 'plannerName',
                        align: 'center',
                        minWidth:100,
                    },
                ],
                formSearch:{},
                formAdd:{},
                list1:[],
                changeName:'',
                bigUlr:'',
                host:'http://eopsit.eptison.com/eop/',
                visible:false,
                changeTemplate:'',
                changeName:'',
                brandListAdd:[],
                statusList:[{id:'1',name:'已完成'},{id:'0',name:'未完成'}],

                file:null,//商品图片
                name:'',
                imgSrcUpload:'',
                AAA:'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1562574299&di=846b4c904bd54d3c3821fa5938888c69&src=http://hbimg.b0.upaiyun.com/bdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658',
                dpFile:null,//吊牌图片
                dpName:'',
                imgSrcUploadDp:'',
                BBB:'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1562574299&di=846b4c904bd54d3c3821fa5938888c69&src=http://hbimg.b0.upaiyun.com/bdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658',
                cmbFile:null,//尺码表
                cmbName:'',
                loadingStatus:false,
                picterVisible:false,//上传商品图片
                picterVisibleDp:false,//上传吊牌图片
                excelVisible:false,//上传文件
                modalWatch:false,//查看
                modalAdd:false,//编辑
                userInfo:'',
                photoGoodsId:'',//获取当前行photoGoodsId
                imgUrlSave:'',//上传商品图片返回路径
                imgTagUrl:'',//上传吊牌图片返回路径
                excelUrl:'',//上传尺码表返回路径
                
            }
        },
        mounted(){
            this.getData();
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo')); 
        },
        activated(){

        },
        created () {
            
        },
        methods:{
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
            //获取详情数据
            getData(){
                let data = {}
                data.currentUserEopId = JSON.parse(window.sessionStorage.getItem('userinfo')).userId
                data.taskCode = this.$route.query.taskCode
                this.formSearch.goodsNo ? data.goodsNo = this.formSearch.goodsNo : delete data.goodsNo
                this.formSearch.brandId ? data.detailStatus = parseInt(this.formSearch.brandId) : delete data.detailStatus
                this.request('detailPageSelect', {data}, false).then((res) => {
                    if(res.code==1){
                        this.list1 = res.data.goodsInfoList
                    }
                })
            },
            search(){
                this.getData()
            },
            //重置
            handleReset(){
                this.formSearch = {}
            },
            //导出
            exportEmployee(){
                 let data = {}
                this.formSearch.goodsNo ? data.goodsNo = this.formSearch.goodsNo : delete data.goodsNo
                data.taskCode = this.$route.query.taskCode
                this.formSearch.brandId ?data.detailStatus =  this.formSearch.brandId : delete data.detailStatus
                data.currentUserEopId = JSON.parse(window.sessionStorage.getItem('userinfo')).userId
                let zhan = this.formatParams(data)
                location.href=(`/eop/productlaunch/DevelopTaskEntering/detailExport?${zhan}`)
            },
            formatParams(data) {
                var arr = [];
                for (var name in data) {
                arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
                }
                return arr.join("&");
            },
            //查看属性
            showModal(row){
                this.modalWatch = true
                let data ={}
                data.taskCode = this.$route.query.taskCode
                data.photoGoodsId = row.photoGoodsId
                data.firstClassLevel = row.classLevel1
                data.secondClassLevel = row.classLevel2
                this.request('getPropertiesTitle', {data}, false).then((res) => {
                    if(res.code==1){
                        this.pluginsList = res.data.templateList
                        this.getpluginsList()
                    }
                })
            },
            //取消查看属性
            cancelCk(){
                this.modalWatch = false
            },
           
            //下载尺寸表
           downLoad(params){
               console.log(params)
                let data = {}
                data.fileUrl = params.sizeFileUrl
                data.taskCode = this.$route.query.taskCode
                data.fileName = params.sizeFileName
                let zhan = this.formatParams(data)
                location.href=(`/eop/productlaunch/downloadFile?${zhan}`)
            },
            formatParams(data) {
                var arr = [];
                for (var name in data) {
                arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
                }
                return arr.join("&");
            },
              
            //赋值
            getpluginsList(){
                for (let i=0;i<this.pluginsList.length;i++) {
                this.pluginsListObject[''+this.pluginsList[i].name] = this.pluginsList[i].label
            }
            },
        }
    }

</script>

<style>
 
</style>