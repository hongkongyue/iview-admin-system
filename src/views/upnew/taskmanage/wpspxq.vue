<template>
    <Layout>
        <Content>
                <Row class="background-color-white exhibition">
                    <div style="margin-bottom :20px; height:50px;background-color:#f5f7f9;text-align:left;line-height:50px;font-size:16px; font-weight: bold;padding-left: 20px;">
                    {{this.$route.query.taskCode}} / {{this.$route.query.taskName}} <Button style="margin-top:10px;margin-right:20px;float:right" type="primary" @click="submit">提交</Button>
                    </div>
                    <Table :columns="columns" size="small" highlight-row :data="list" @on-row-dblclick="edit"></Table>
                    <Table style="margin-top:20px"  :columns="columns1" size="small" highlight-row :data="list1" @on-row-dblclick="edit"></Table>
                    <!-- <Col span="24" style="padding-left:7px;margin-top:20px">
                        <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="80" inline
                        label-position="right" style="text-align:center" >
                            <Form-item :label-width="1">
                                <Button style="margin-right:20px;" type="primary" @click="submit">提交</Button>
                            </Form-item>
                        </Form>
                    </Col> -->
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
        name:'final_account_variable',
        data(){
            return {
                columns: [
                    {
                        title: '拍摄方案',
                        key: 'shootingPlanFile',
                        align: 'center',
                        minWidth:100,
                        render: (h, params) => {
                            return  h('a',{
                                    on:{
                                'click':(event)=>{
                                    this.downLoad(params.row)
                                }
                            }
                        },params.row.shootingPlanFile)
                        }
                    },
                    {
                        title: '搭配方案',
                        key: 'matchPlanFile',
                        align: 'center',
                        minWidth:100,
                        render: (h, params) => {
                            return  h('a',{
                                    on:{
                                'click':(event)=>{
                                    this.downLoadA(params.row)
                                }
                            }
                        },params.row.matchPlanFile)
                        }
                    },
//                     {
//                         title: '静物方案',
//                         key: 'stilllifePlanFile',
//                         align: 'center',
//                         minWidth:100,
//                         render: (h, params) => {
//                             return  h('a',{
//                                     on:{
//                                 'click':(event)=>{
//                                     this.downLoadB(params.row)
//                                 }
//                             }
//                         },params.row.stilllifePlanFile)
//                         }
//                     },
                    {
                        title: '原视频路径',
                        key: 'originalVideoPath',
                        align: 'center',
                        minWidth:250,
                        render: (h, params) => {
                            this.changeName = this.list[params.index].originalVideoPath
                            if (params.row.$isEdit) {
                                return h('Input', {
                                    props: {
                                       value: this.list[params.index].originalVideoPath,
                                        // type:"textarea"
                                    },
                                    // on: {
                                    //     'on-change': (e) => {
                                    //         this.changeName = e.target.value
                                    //     }
                                    // },
                                    on: {
                                        "on-change": (e) => {
                                            params.row.originalVideoPath= e.target.value
                                            this.changeName     = e.target.value
                                            if(e.target.value.length>200){
                                                this.$Message.warning('最大的输入长度为200字节')
                                                 params.row.originalVideoPath= params.row.originalVideoPath.substr(0,200)
                                            }
                                           
                                        }
                                    },
                                },
                                );
                            } else {
                                return h('span', params.row.originalVideoPath)
                            }
                        },
                    },
                    {
                        title: '操作',
                        key: 'operate',
                        minWidth: 220,
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
                                            this.handleChange(params.row)
                                        }
                                    }
                                }, '编辑'),
                                 h('Button', {
                                    props: {
                                        // type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: (e) => {
                                            this.handleEdit(params.row)
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
                                        click: (e) => {
                                            this.saveTable(params.row);
                                        }
                                    }
                                }, '保存'),
                            ])
                        }
                    }
                ],
                columns1: [{
                        title: '序号',
                        type:'index',
                        align: 'center',
                        width: 80,
                    },
                      {
                        title: '图片',
                        key: 'imgUrl',
                        align: 'center',
                        width: 120,
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
                        minWidth:100,
                    },
                    {
                        title: '季节',
                        key: 'season',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '波段',
                        key: 'waveBand',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '款号',
                        key: 'designGoodsNo',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '颜色',
                        key: 'color',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '大货款号',
                        key: 'goodsNo',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '拍照样应到时间',
                        key: 'photoDateStr',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '大货合同货期',
                        key: 'contractDateStr',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '拍照样领取日期',
                        key: 'collectDateStr',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '领取件数',
                        key: 'collectQty',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '延期天数',
                        key: 'delayDays',
                        align: 'center',
                        minWidth:100,
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
                        minWidth:100,
                    },
                    {
                        title: '企划跟进人',
                        key: 'plannerName',
                        align: 'center',
                        minWidth:100,
                    },
                ],
                formSearch:{},
                visible:false,
                list1:[{id:1,name:'詹',color:'red',size:'100',age:'12',time:'2019'},
                    {id:2,name:'詹1',color:'red2',size:'110',age:'122',time:'2019'},
                    {id:3,name:'詹3',color:'re3d',size:'130',age:'112',time:'2019'}],
                list:[{id:1,name:'詹',color:'red',size:'100',age:'12',time:'2019'}],
                changeName:'',
                bigUlr:'',
                host:'http://eopsit.eptison.com/eop/',
                visible:false,
            }
        },
        mounted(){
          this.getData()
          this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo')); 
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
                data.taskCode = this.$route.query.taskCode
                this.request('getDevelopOutdoorVideoDetail', {data}, false).then((res) => {
                    if(res.code==1){
                        this.list1 = res.data[0].photoManageList
                        this.list = res.data
                    }
                })
            },
            //提交
            submit(){
                let data = {}
                data.taskCode = this.$route.query.taskCode
                data.originalVideoPath = this.changeName
                data.lastUpdateUser = this.userInfo.userName
                if(this.changeName == null){
                    this.$Message.warning('无原视频路径，请先填写')
                }else{
                    this.request('submitDevelopOutdoorVideo', {data}, false).then((res) => {
                    if(res.code==1){
                        this.$router.push({
                            name: 'wpspwcy',
                            query: {
                                taskCode: this.$route.query.taskCode,
                                taskName: this.$route.query.taskName
                            }
                        });
                    }
                })
                }
            },
            downLoad(params){
                let data = {}
                data.fileUrl = params.shootingPlanUrl
                data.taskCode = this.$route.query.taskCode
                data.fileName = params.shootingPlanFile
                let zhan = this.formatParams(data)
                location.href=(`/eop/productlaunch/downloadFile?${zhan}`)
            },
            downLoadA(params){
                let data = {}
                data.fileUrl = params.matchPlanUrl
                data.taskCode = this.$route.query.taskCode
                data.fileName = params.matchPlanFile
                let zhan = this.formatParams(data)
                location.href=(`/eop/productlaunch/downloadFile?${zhan}`)
            },
            downLoadB(params){
                let data = {}
                data.fileUrl = params.stilllifePlanUrl
                data.taskCode = this.$route.query.taskCode
                data.fileName = params.stilllifePlanFile
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
            //编辑保存
            saveTable(){
                let data = {}
                data.taskCode = this.$route.query.taskCode
                data.originalVideoPath = this.changeName
                data.lastUpdateUser = this.userInfo.userName
                this.request('saveDevelopOriginalVideoPath', {data}, false).then((res) => {
                    if(res.code==1){
                    this.$Message.success('保存成功')
                       this.getData()
                    }
                })
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