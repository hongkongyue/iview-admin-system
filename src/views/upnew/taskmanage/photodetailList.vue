<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">   
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24">
                 <Form-item :label-width="1">
                            <Button type="default" style="width:100px" @click="back">返回</Button>
                            <Button type="primary" style="width:100px" @click="submit">提交</Button>
                            <Badge v-if="childdata.length>0"   :count="subNumber" overflow-count="999" style="position:absolute;right:-12px"></Badge>
                 </Form-item>
                  <Form-item :label-width="1">
                        <span style="color:#999;padding-left:10px">*提交生成拍摄报表后不能撤回</span> 
                  </Form-item> 
                </Col>
            
            </Form>
        </Row>
        <!-- 数据列表 -->
        <Row class="background-color-white exhibition">
            <Table  ref="currentRowTable" @on-select-cancel="choiceId" @on-select-all-cancel="choiceId"  @on-select="choiceId" @on-select-all="choiceId"	:columns="columns" size="small" highlight-row :data=" childdata"></Table>
        </Row>
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
        props:{
           childdata:Array
        },
        beforeMount(){
            console.log(this.childdata,'111111')
        },
        data() {
            return {
                visible:false,
                subNumber:'',
                selection:[],//选中的数据
                columns: [
                    {
                        type: 'selection',
                        width: 50,
                        align: 'center',
                        fixed: 'left',
                     },
                     {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        minWidth: 70,

                    },
                     {
                        title: '图片',
                        key: 'imgUrl',
                        align: 'center',
                        minWidth: 120,
                        render: (h, params) => {
                           //productlaunch_getGoodsImg
                           if(params.row.imgUrl){
                                 return h('img', {
                                          
                                           style: {
                                                        display: 'inline-block',
                                                        width: '100px',
                                                        height:'70px',
                                                        textAlign:'center'
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
                                                    }, ''); 
                           }else{
                                  return h('img', {
                                          
                                           style: {
                                                        display: 'inline-block',
                                                        width: '100px',
                                                        height:'70px',
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
                        minWidth: 100,
                    },
                     {
                        title: '季节',
                        key: 'season',
                        align: 'center',
                        minWidth: 100,
                     },
                     {
                        title: '波段',
                        key: 'waveBand',
                        align: 'center',
                       minWidth: 100,
                     },
                      {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 120,
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
                        minWidth: 90,
                    },
                    {
                        title: '大货款号',
                        key: 'goodsNo',
                        align: 'center',
                       minWidth: 100,
                    },
                    {
                        title: '拍照样应到时间',
                        key: 'photoDateStr',
                        align: 'center',
                        minWidth: 160
                    },
                    {
                        title: '大货合同货期',
                        key: 'contractDateStr',
                        align: 'center',
                        minWidth: 160,
                    },
                    {
                        title: '拍照样领取日期',
                        key: 'collectDateStr',
                        align: 'center',
                        width: 150,
                    },
                    {
                        title: '领取件数',
                        key: 'collectQty',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '延期天数',
                        key: 'delayDays',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '备注',
                        key  : 'remark',
                        align: 'center',
                        width: 100,
                    },
                    {
                        title: '设计师',
                        key: 'designerName',
                        align: 'center',
                        minWidth: 90,
                    },
                    {
                        title: '企划跟进人',
                        key: 'plannerName',
                        align: 'center',
                        minWidth: 120,
                        render: (h, params) => {
                                         if ((this.page - 1) *this.pageSize + params.index == this.red_packet_table_row_index) {
                                     return h('Select', {
                                    props: {
                                        width:150,
                                        placeholder:params.row.plannerName
                                    },
                                    style: {
                                            minWidth:'100px'
                                        },
                                    on: {
                                        "on-change": (event) => {
                                            params.row.plannerEopId= event
                                        }
                                    },
                                },
                              this.alldealList.map(function (item) {
                                    return h('Option', {
                                        props: {
                                            value:item.plannerEopId
                                        }
                                    },item.plannerName)
                                })
                                )
                            } else {
                                return h('span', params.row.plannerName)
                            }
                        }
                    },
                ],
                userInfo: {},
            }
        },
  
        mounted() {
                this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo')); 
              
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
             choiceId(selection,row){
                    this.selection=selection
                    console.log( this.selection,'999999999999999999999')
                    this.subNumber=this.selection.length    
              },
             init(){
                    for (let i in  this.$refs.currentRowTable.objData) {
                            // if(i==index){
                            // this.$refs.currentRowTable.objData[i]._isChecked=true
                            // }else{
                               this.$refs.currentRowTable.objData[i]._isChecked=true
                            //}
                        }
              },
              back(){
                     this.$parent.$parent.edit_visible=false
              },
              submit(){
                                let photoIds=[]
                                if(this.childdata){
                                    // for(let i=0;i<this.childdata.length;i++){
                                    //     photoIds.push(this.childdata[i].photoId)
                                    // }
                                    for(let i=0;i<this.selection.length;i++){
                                        photoIds.push(this.selection[i].photoId)
                                    }
                                }
                                let data={}
                                    data.photoIds=photoIds
                                    data.createUser=this.userInfo.userName
                    this.request('productlaunch_developPhotoReportManage_createPhotoReport', {data:data}, false).then((res) => {
                        if(res.code==1){
                              this.$Message.success(res.msg)
                              this.$parent.$parent.edit_visible=false
                              this.$parent.$parent.getData()
                              this.$parent.$parent.initPhotoStatus()
                              this.$parent.$parent.addTransfer=[]
                              this.$parent.$parent.submitArray2=[]
                        }
                    })   

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
