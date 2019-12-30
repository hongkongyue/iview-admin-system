<template>
    <Layout>
        <Content>
                <Row class="background-color-white exhibition">
                    <div style="margin-bottom :20px; height:50px;background-color:#f5f7f9;text-align:left;line-height:50px;font-size:16px; font-weight: bold;padding-left: 20px;">
                    {{this.$route.query.taskCode}} / {{this.$route.query.taskName}}
                    </div>
                    <Table style="margin-top:20px"  :columns="columns1" size="small" highlight-row :data="list1" @on-row-dblclick="edit"></Table>
                </Row>
                <Modal title="查看大图" v-model="visible"> 
                    <img :src="'data:image/png;base64,'+bigUlr" v-if="visible" style="width: 100%">
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
                columns1: [{
                        title: '序号',
                        type:'index',
                        align: 'center',
                        width: 60,
                    },
                    {
                        title: '完成进度',
                        key: 'subTaskStatus',
                        align: 'center',
                        minWidth:90,
                        render:(h,params) =>{
                            if(params.row.subTaskStatus == 0){
                                return h('span', '未完成')
                            }else{
                                return h('span', '已完成')
                            }
                        }
                    },
                      {
                        title: '图片',
                        key: 'imgUrl',
                        align: 'center',
                        width: 80,
                        fixed: 'left',
                        render: (h, params) => {
                           if(params.row.imgUrl){
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
                        title: '年份',
                        key: 'years',
                        align: 'center',
                        minWidth:80,
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
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '设计款号',
                        key: 'designGoodsNo',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '颜色',
                        key: 'color',
                        align: 'center',
                        minWidth:80,
                    },
                    {
                        title: '大货款号',
                        key: 'goodsNo',
                        align: 'center',
                        minWidth:90,
                        fixed: 'left',
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
                        minWidth:120,
                    },
                    {
                        title: '领取件数',
                        key: 'collectQty',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '延期天数',
                        key: 'delayDays',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '设计师',
                        key: 'designerName',
                        align: 'center',
                        minWidth:80,
                    },
                    {
                        title: '企划跟进人',
                        key: 'plannerName',
                        align: 'center',
                        minWidth:120,
                    },
                    {
                        title: '原视频路径',
                        key: 'originalVideoPath',
                        align: 'center',
                        minWidth:120,
                    },
                    {
                        title: '选视频路径',
                        key: 'chooseVideoPath',
                        align: 'center',
                        minWidth:200,
                    },
                    {
                        title: '剪辑师',
                        key: 'cutVideoName',
                        align: 'center',
                        minWidth:120,
                    },
                ],
                formSearch:{},
                list1:[],
                list:[{id:1,name:'詹',color:'red',size:'100',age:'12',time:'2019'}],
                changeName:'',
                bigUlr:'',
                host:'http://eopsit.eptison.com/eop/',
                visible:false,
                changeTemplate:'',
                changeName:'',
                brandListAdd:[],
            }
        },
        mounted(){
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo')); 
            this.getData()
        },
        activated(){

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
            getData(){
                let data = {}
                data.subTaskStatus = this.formSearch.brandId
                data.goodsNo = this.formSearch.goodsNo
                data.userId = this.userInfo.userId
                data.taskCode = this.$route.query.taskCode
                this.request('getTaskDetailByTaskCode', {data}, false).then((res) => {
                    if(res.code==1){
                        this.list1 = res.data
                    }
                })
            },
            downLoad(params){
                console.log(params)
                console.log('popopo')
                // window.location = ('http://eopsit.eptison.com/eop/productlaunch/developClassTemplateConfig/templateExport')
            },
            handleSave(row){
                this.visible = true
            },
            handleSaveT(row){
                this.$router.push({
                    name: 'department-review-detail',
                    params: {
                        reviewId: row.id,
                    }
                });
            },
              handleChange(row){
                this.$set(row, '$isEdit', true)
            },
            handleEdit(row){
                this.$set(row, '$isEdit', false)
            },
        }
    }

</script>

<style>
 
</style>