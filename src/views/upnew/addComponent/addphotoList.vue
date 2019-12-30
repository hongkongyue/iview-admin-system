<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">   
            <Form :model="formSearch" ref="formSearch" :label-width="90" inline
                label-position="right" style="200px" :rules="ruleValidate">
                <Col span="24">
                    <Form-item label="领取日期:">
                                     <Input disabled v-model="nowTime" style="width:200px" readonly></Input>
                    </Form-item>
                     <Form-item label="品牌:" prop="brandId">
                                 <Select v-model="formSearch.brandId" style="width:200px"  @on-change="allDealsList(formSearch.brandId.brandId)">
                                        <Option v-for="item in brandList" :value="item" :key="item">{{ item.brandName }}</Option>
                                </Select>
                    </Form-item>
                    <Form-item label="领取件数:">
                                 <InputNumber  disabled v-model="collectQty" :min="1" style="width:200px" readonly></InputNumber>
                    </Form-item>
                    <Form-item label="设计款号:">
                                <Input v-model="formSearch.designnumber" placeholder="设计款号" style="width:200px"/>
                    </Form-item>
                    <Form-item label="延期天数:">
                                <Input  v-model="delayday" disabled  style="width:200px" readonly></Input>
                    </Form-item>
                   
                     <Form-item label="颜色:" prop='color'>
                                　 <Input v-model="formSearch.color" placeholder="颜色" style="width:200px"/>
                    </Form-item>
                   
                   <Form-item label="大货款号:"  prop='bignumber'>
                                　<Input v-model="formSearch.bignumber" placeholder="大货款号" style="width:200px"/>
                    </Form-item>
                    <Form-item label="拍照样应到时间:" label-width="100">
                                     <DatePicker type="date" v-model="formSearch.getdate" placeholder="拍照样应到时间" style="width: 190px"></DatePicker>
                    </Form-item>
                   
               
                    <Form-item label="年份:"  prop='years'>
                                <DatePicker type="year"  v-model="formSearch.year"  placeholder="年份" style="width: 200px"></DatePicker>      　
                    </Form-item>
                     <Form-item label="大货合同到期:">
                                     <DatePicker type="date" v-model="formSearch.contracttime" placeholder="大货合同到期" style="width: 200px"></DatePicker>
                    </Form-item>
                    <Form-item label="季节:" prop='season'>
                                <Select v-model="formSearch.season" style="width:200px" >
                                        <Option v-for="item in seasonList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                    </Form-item>
                    <Form-item label="设计师:">
                                    　<Select v-model="formSearch.designerOaId" style="width:200px">
                                        <Option v-for="item in designList" :value="item.designerOaId" :key="item.designerOaId">
                                            {{item.designerName}}
                                        </Option>
                                    </Select>
                    </Form-item>
                    <Form-item label="波段:" prop='wave'>
                                   <Select v-model="formSearch.wave" style="width:200px">
                                    <Option v-for="item in waveList" :value="item.WAVE_BAND" :key="item.WAVE_BAND">
                                        {{item.WAVE_BAND }}
                                    </Option>
                                </Select>
                    </Form-item>
                    <Form-item label="企划跟进人:" prop='plannerOaId'>
                                    　<Select v-model="formSearch.plannerOaId" style="width:200px" v-if="alldealList.length!=0">
                                        <Option v-for="item in alldealList" :value="item.plannerOaId" :key="item.plannerOaId">{{item.plannerName}}</Option>
                                    </Select>
                                    <Select  style="width:200px" v-if="alldealList.length==0">
                                        <Option value="" ></Option>
                                    </Select>
                    </Form-item>
                   
                     <Form-item label="图片:" prop="pict">
                                         <Upload   v-if="dealshowFilelist.length==0"
                                                    ref="upload"
                                                    name="file"
                                                    :show-upload-list="false"
                                                    :before-upload="handleUpload"
                                                    :on-success="uploadSuccess"
                                                    :on-error="uploadError"
                                                    action="/eop/productlaunch/uploadGoodsPhoto"
                                                    :data="{fileName:Filename}"
                                                            >
                                                            <Button type="primary"  icon="ios-cloud-upload-outline" style="width: 200px">上传图片</Button>
                                          </Upload>
                                          <Button v-if="dealshowFilelist.length>0" type="primary" @click="tip" icon="ios-cloud-upload-outline" style="width: 200px">上传图片</Button>
                    </Form-item>
                    <Form-item label="备注:">
                                　 <Input type="textarea" v-model="formSearch.remark" placeholder="备注" style="width:200px"/>
                    </Form-item>
                    <Form-item label="图片列表:"  v-if="dealshowFilelist.length>0">
                                <p v-for="v in dealshowFilelist" :key="v.id" style="width:200px;cursor:pointer">{{v.dealAttachmentName}} <span @click="delpicture">&nbsp<Icon  type="ios-close-circle-outline"/></span></p>
                    </Form-item>
                    <Row>
                     <Form-item :label-width="1" style="padding-left:280px">   
                                <Button type="primary" @click="confirm">保存</Button>
                      </Form-item>
                         <Form-item :label-width="1" >   
                                <Button type="default" @click="cancel">取消</Button>    
                       </Form-item>
                    </Row>
                </Col>
            </Form>
        </Row>
          <Modal  v-model="showFlag" title="确认模块" :width="710" :styles="mystyle" class-name="customize-modal-center">
             <div style="text-align:center;height:40px">
                     <p style="font-size:16px">{{'保存后不支持修改了哦~确定保存吗？'}}</p>  
             </div>
               <div style="text-align:center">
                    <Button style="margin-right:50px" type="primary" @click="submit">确认保存</Button>
                    <Button type="default" @click="quxiao">取消保存</Button>
                </div>
             <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    import Util from 'libs/util';
    import filter from '../../../filter'
    function formSearch() {
        return {
                 search: ''
        }
    }
    export default {
        data() {
            return {
                nowTime:filter.getnowTime(),
                delayday:0,
                collectQty:1,
                dealshowFilelist:[],
                designList      :[],
                visible: false,
                alldealList:[],
                red_packet_table_row_index:-1,
                loadingStatus: false,
                mystyle:{
                    top:'270px',
                },
                ruleValidate: {
                    color: [
                        { required: true, message: '请选择颜色', trigger: 'change' }
                    ],
                     brandId: [
                        { required: true, message: '请选择品牌', trigger: 'blur' }
                     ],
                     bignumber: [
                        { required: true, message: '请选择大货款号',trigger:'change' }
                     ],
                     years: [
                         { required: true,type:'year', message: '请选择年份',trigger: 'blur'  }
                     ],
                     season: [
                         { required: true, message: '请选择季节', trigger: 'blur' }
                     ],
                     wave: [
                         { required: true, message: '请选择波段', trigger: 'blur' }
                     ],
                     pict: [
                         { required: true, message: '请选择图片', trigger: 'blur' }
                     ],
                     plannerOaId: [
                         { required: true, message: '请选择企划跟进人', trigger: 'blur' }
                     ],
                 },
                file:'',
                showFlag:false,
                Filename:'',
                brandList:[],         // 初始化品牌列表
                userInfo: {},
                formSearch: {
                },
                dealformSearch:{
                },
                seasonList   :[         //四季列表
                  {label:'春季',value:'春季'},
                  {label:'夏季',value:'夏季'},
                  {label:'秋季',value:'秋季'},
                  {label:'冬季',value:'冬季'},
                ],
                brandList:[],          //品牌列表
                modal_visible:false,   // 编 
            }
        },
        props:{
              waveList   : Array,
              brandList  : Array,
            //   alldealList: Array
        },
        components:{
          
        },
        mounted() {
                //  this.uploadList = this.$refs.upload.fileList;
                 this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo')); 
                 this.initdesignerlist()
        },
        activated() {  
        },
        methods: {
              delpicture(){
                 this.deluploadpicture() 
                 this.$Message.success('删除图片成功')    
                },
               tip(){
                     this.$Message.warning('如需再次上传，请删除已有图片')
               },
               handleUpload(file) {
                if (!/\.jpg$|.png$|.jpe$|.bmp$/.test(file.name)) {
                // if (!/\.jpg$|.png$|.jpe$/.test(file.name)) {
                     this.$Message.warning('类型不符,请重新选择图片');
                     return false
                } else {
                     this.file = file;
                     this.Filename= file.name
                     setTimeout(()=>{
                            this.$refs['upload'].post(file)
                        },1000)
                      return false;
                }
                },
                allDealsList(brandId){
                        let data={};
                        this.formSearch.plannerOaId=''
                        // this.formSearch.plannerOaId=''
                        // this.formSearch.plannerOaId=''
                        data.brandId=Number(brandId)
                        this.request('productlaunch_developDesignerConfig_plannerListInit', {data:data}, false).then((res) => {
                                if(res.code==1){
                                     this.alldealList=res.data
                                     if(res.data.length==0){
                                            // document.querySelector('.ivu-select-selected-value').innerHTML=''
                                            this.alldealList=[]
                                            //  this.$set(this.alldealList)
                                            this.formSearch.plannerOaId=''
                                     }
                                }
                            })    
                },
                uploadSuccess(res, file) {
                        if (res.code == 1) {
                            this.loadingStatus = false;
                            this.file = '';
                                file='';
                            this.dealshowFilelist.push({
                                        id                 : res.data,
                                        dealAttachmentName : res.data,
                                        dealAttachmentType : res.data,
                                        dealAttachmentUrl  : res.data
                            })
                            this.$Message.success({
                                content: res.msg,
                                duration: 3
                            });
                        } else {
                            this.file = '';
                                file='';
                            this.loadingStatus = false;
                            this.$Message.error({
                                content: res.msg,
                                duration: 3
                            });
                        }
                    },
               cancel(){
                       this.deluploadpicture()
                       this.$parent.$parent.add_visible=false
                       this.formSearch={}
                       this.alldealList=[]
               },
               quxiao(){
                    this.showFlag=false
                   
               },
               confirm(){
                   if(this.checkFormdata()){
                       this.showFlag=true
                    }
                  
               },
               submit(){
                    this.showFlag=false
                    this.$parent.$parent.add_visible=false
               },
               deluploadpicture(){  // 
                   if(this.dealshowFilelist.length==0)return 
                    this.request('productlaunch_deleteGoodsPhotodel', {data:{
                            imgUrl:this.dealshowFilelist[0].id
                    }}, false).then((res) => {
                        if(res.code==1){
                                   this.dealshowFilelist=[]
                                //    this.$Message.success(res.msg)
                        }
                    })   
                },
                initdesignerlist(){  // 
                    this.request('productlaunch_developDesignerConfig_designerListInit', {data:{}}, false).then((res) => {
                        if(res.code==1){
                            this.designList=res.data.designerDTOS
                        }
                    })   
                },
                checkFormdata(){
                         if(!this.formSearch.brandId){
                              this.$Message.error('品牌未填写，不能提交')
                             return false  
                         }
                         if(!this.formSearch.color){
                              this.$Message.error('颜色未填写，不能提交')
                             return false  
                         }
                          if(!this.formSearch.bignumber){
                              this.$Message.error('大货款号未填写，不能提交')
                             return false  
                         }
                         if(!this.formSearch.year){
                              this.$Message.error('年份未填写，不能提交')
                             return false  
                         }
                         if(!this.formSearch.season){
                              this.$Message.error('季节未填写，不能提交')
                             return false  
                         }
                         
                        if(!this.formSearch.wave){
                              this.$Message.error('波段未填写，不能提交')
                             return false  
                         }
                           if(!this.formSearch.plannerOaId){
                              this.$Message.error('企划跟进人未填写，不能提交')
                             return false  
                         }
                         if(this.dealshowFilelist.length==0){
                             this.$Message.error('未上传商品图片，请上传')
                             return false
                         }
                         return true
                },
                submit(){
                                let data={};
                                    data.collectDate  = this.nowTime
                                    data.delayDays    = this.delayday
                                    data.goodsNo      = this.formSearch.bignumber
                                    data.years        = filter.get_unix_only(this.formSearch.year)
                                    data.season       = this.formSearch.season
                                    data.waveBand     = this.formSearch.wave
                                    data.imgUrl       = this.dealshowFilelist[0].id
                                    data.brandId      = this.formSearch.brandId.brandId
                                    data.brandName    = this.formSearch.brandId.brandName
                                    data.collectQty   = this.collectQty
                                    data.designGoodsNo= this.formSearch.designnumber 
                                    data.color        = this.formSearch.color
                                    data.photoDate    = filter.get_year_month_day(this.formSearch.getdate)
                                    data.contractDate = filter.get_year_month_day(this.formSearch.contracttime) 
                                    data.plannerOaId  = this.formSearch.plannerOaId
                                    data.designerOaId = this.formSearch.designerOaId
                                    data.remark       = this.formSearch.remark
                                    data.createUser   = this.userInfo.userName
                    this.request('productlaunch_developPhotoReportManage_insertPhotoReport', {data:data}, false).then((res) => {
                                        if(res.code==1){
                                                this.dealshowFilelist=[]
                                                this.showFlag=false
                                                this.formSearch={}
                                                this.$parent.$parent.add_visible=false
                                                this.$parent.$parent.getData()  
                                        }
                    })   
                }
        }       
    }
</script>

<style>
    /* .ivu-form-item-label{
        width:100px!important
    } */
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
