<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">   
            <Form  @keydown.native.enter.prevent="search" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24">
                   <Form-item :label-width="1">
                            <Button type="default" style="width:100px" @click="back">返回</Button>
                            <Button type="primary" style="width:100px" @click="showMadol">提交</Button>
                            <Badge v-if="silentData.length>0"   :count="subNumber" overflow-count="999" style="position:absolute;right:-12px"></Badge>
                    </Form-item>
                    <Form-item :label-width="1">
                        <span style="color:#999;padding-left:10px">*提交生成拍摄报表后不能撤回</span> 
                    </Form-item>
                </Col>
            
            </Form>
        </Row>
        <!-- 数据列表 -->
        <Row class="background-color-white exhibition">
            <Table  ref="currentRow" @on-select-cancel="choiceId" @on-select-all-cancel="choiceId"  @on-select="choiceId" @on-select-all="choiceId"	:columns="columns" size="small" highlight-row :data="silentData"></Table>
        </Row>
        <Modal title="查看大图" v-model="visible"> 
                <img :src="'data:image/png;base64,'+bigUlr" v-if="visible" style="width: 100%">
        </Modal>
        <Modal    v-model="sub_visible" title="生成静物任务流"  :width="400" @on-cancel="cancel">
             <Form :model="formSearch" ref="formSearch" :label-width="90" inline label-position="right" style="height:200px" >
                <Col span="24">
                    <Form-item label="是否要上传静物拍摄方案？" :label-width="160">
                                   <RadioGroup v-model="disabledGroup">
                                        <Radio label="是"></Radio>
                                        <Radio label="否"></Radio>
                                    </RadioGroup>
                                    <Upload  style="display:inline-block" v-if="disabledGroup=='是'"
                                                    ref="upload"
                                                    name="file"
                                                    :show-upload-list="false"
                                                    :before-upload="handleUpload"      
                                    >
                                    <Button type="primary"  icon="ios-cloud-upload-outline" style="width: 90px">上传文件</Button>
                                    </Upload>
                    </Form-item>
                    <Form-item label="静物摄影师：" :label-width="160">
                                      <Select v-model="formSearch.silenter" style="width:120px" filterable>
                                         <Option v-for="item in silentList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                                      </Select>
                    </Form-item>
                    <Row>
                     <Form-item :label-width="1" style="padding-left:100px">   
                                <Button type="primary" @click="submit">保存</Button>
                    </Form-item>
                    <Form-item :label-width="1" >   
                                <Button type="default" @click="cancel">取消</Button>    
                    </Form-item>
                    </Row>
                </Col>
            </Form>
             <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    import Util from 'libs/util';
    import axios from 'axios';
    var instance = axios.create({
    baseURL: 'https://some-domain.com/api/',
    timeout: 60000,
    headers: {'X-Custom-Header': 'foobar'}
    });
    function formSearch() {
        return {
            search: ''
        }
    }
    export default {
        props:{
           silentData:Array
        },
        beforeMount(){
            
        },
        data() {
            return {
                formSearch:{},
                file:'',
                Filename:'',
                disabledGroup:'是',
                visible:false,
                sub_visible:false,
                subNumber:'',
                silentList:[],
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
                this.getAllStaff()
              
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
                cancel(){
                        this.sub_visible=false;
                        // this.formSearch.silenter=''
                        this.disabledGroup='是'
                    },
                choiceId(selection,row){
                        this.selection=selection
                        console.log(this.selection,'999999999999999999999')
                        this.subNumber=this.selection.length    
                },
                inits(){
                        for (let i in  this.$refs.currentRow.objData) {
                                this.$refs.currentRow.objData[i]._isChecked=true
                            }
                },
                back(){
                        this.$parent.$parent.silent_visible=false
                },
                showMadol(){
                            //    this.formSearch={}
                            if(this.selection.length==1){
                                                            // this.sub_visible=true
                                                            this.getSilentPhotor(this.selection[0].brandId)
                            }else if(this.selection.length>1) {
                                    for(let i=0;i<this.selection.length;i++){
                                            for(let j = i + 1; j < this.selection.length; j++){
                                                if(this.selection[i].brandName!= this.selection[j].brandName){
                                                return   this.$Message.error('所选中包含了多个品牌，不能提交')  
                                                }else{
                                                            // this.sub_visible=true
                                                           return this.getSilentPhotor(this.selection[0].brandId)
                                                    }
                                            }   
                                        }
                            }else if(this.selection.length==0){
                                this.$Message.error('未勾选不能提交') 
                            }         
                },
                getSilentPhotor(brandId){
                                let data={}
                                    data.brandId=brandId              
                        this.request('productlaunch_developPhotoReportManage_getStillLifePhotographer', {data:data}, false).then((res) => {
                            if(res.code==1){
                                   if(res.data.length>0){
                                       this.formSearch.silenter=res.data[0].userName
                                       this.sub_visible=true
                                   }else{
                                       this.$Message.error('没有配置静物摄影师，请先配置')
                                   }
                                    
                            }
                        })   
                    },
            //   backSomething(id){
            //          if(this.silentList.length>0){
            //              for(let i=0;i<this.silentList.length;i++){
            //                  if(this.silentList[i].userEOPId==id){
            //                      return this.silentList[i].userName
            //                  }
            //              }
            //          }
            //   },
            //    backSomethingOa(id){
            //          if(this.silentList.length>0){
            //              for(let i=0;i<this.silentList.length;i++){
            //                  if(this.silentList[i].userEOPId==id){
            //                      return this.silentList[i].userOAId
            //                  }
            //              }
            //          }
            //   },
              submit(){     
                        let photoIds=[]
                                if(this.selection){
                                    for(let i=0;i<this.selection.length;i++){
                                        photoIds.push(this.selection[i].photoId)
                                    }
                                }
                                   console.log(photoIds)
                                // let data={}
                                let data=new FormData()
                                    data.append('photoIds',[photoIds])
                                    // data.photoIds=photoIds
                                    data.append('createUser',this.userInfo.userName)
                                    data.createUser=this.userInfo.userName
                                   
                                    // data.append('photographerEopId',this.formSearch.silenter)
                                    data.append('photographer',this.formSearch.silenter)
                                    // data.append('photographerOaId',this.backSomethingOa(this.formSearch.silenter))
                                    // data.photographerEopId= this.formSearch.silenter
                                    // data.photographer     = this.backSomething(this.formSearch.silenter)
                                    // data.photographerOaId = this.backSomethingOa(this.formSearch.silenter)
                                    if(this.disabledGroup=='是'){
                                        if(!this.Filename) return this.$Message.error('文件未上传')
                                         if(this.file){
                                            data.append('file',this.file)
                                            data.append('fileName',this.Filename)
                                            }
                                    }
                                    if(!this.formSearch.silenter) return this.$Message.error('摄影师不能为空')
                    this.request('productlaunch_developPhotoReportManage_createStillLifePhotoReport', data, false).then((res) => {
                        if(res.code==1){
                              this.sub_visible=false;
                            //   this.formSearch={};
                              this.file=''
                              this.Filename=''
                              this.$parent.$parent.silent_visible=false
                              this.$parent.$parent.submitArray2=[]
                              this.$parent.$parent.getData()
                              this.$parent.$parent.initPhotoStatus()
                              this.$parent.$parent.addTransferSilent=[]
                              this.$Message.success('提交成功')
                        }
                    })   

              },
               handleUpload(file) {
                if (!/\.jpe$|.xlsx$|.jpg$|.doc$|.docx$|.png$|.csv$|.doc$|.wps$|.txt$|.pdf$|.ppt$|.pptx$|.dotx$|.bmp$|.xls$/.test(file.name)) {
                // if (!/\.jpg$|.png$|.jpe$/.test(file.name)) {
                     this.$Message.warning('类型不符,请重新选择文件');
                     return false
                } else {
                     this.file = file;
                     console.log(this.file,'00000000')
                     this.Filename= file.name
                    //  setTimeout(()=>{
                    //         this.$refs['upload'].post(file)
                    //     },1000)
                      return false;
                }
                },
                getAllStaff(){
                      this.request('get_examine_post_list', {}, false).then((res) => {
                        if(res.code==1){
                                this.silentList=res.data 
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
        /* .ivu-modal{
              z-index:10000000!important;
        } */
        /* .ivu-modal-mask{
            z-index:10000000!important;
        } */
</style>
