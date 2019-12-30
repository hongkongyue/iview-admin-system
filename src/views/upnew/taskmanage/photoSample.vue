<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">   
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24">
                <Form-item label="品牌:"  :label-width="50" style="padding-left:20px">
                     <Select v-model="formSearch.brandId" style="width:120px" >
                              <Option v-for="item in brandList" :value="item.brandId" :key="item.brandId">{{ item.brandName }}</Option>
                      </Select>
                </Form-item>
                <Form-item label="季节:">
                      <Select v-model="formSearch.season" style="width:120px" >
                              <Option v-for="item in seasonList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                </Form-item>
                <Form-item label="年份:">
                    <Col span="12">
                        <DatePicker type="year" v-model="formSearch.date" format="yyyy年" placeholder="请选择年份" style="width: 120px"></DatePicker>
                    </Col>
                </Form-item>
                 <Form-item label="波段:" >
                                　<Select v-model="formSearch.wave" style="width:120px" :multiple="true" filterable>
                                    <Option v-for="item in waveList" :value="item.WAVE_BAND" :key="item.WAVE_BAND">
                                        {{ item.WAVE_BAND }}
                                    </Option>
                                </Select>
                </Form-item>
                    <Form-item label="领取状态:">
                                    　<Select v-model="formSearch.status" style="width:120px"><Option v-for="item in getStatus" :value="item.value" :key="item.label">{{ item.label }}</Option></Select>
                    </Form-item>
                    <Form-item label="设计师:"> 
                                       <!-- :key="item.designerName" -->
                                    <Select v-model="formSearch.designerName" filterable style="width:120px"><Option v-for="item in designerNameData" :value="item.designerName" >{{item.designerName}}</Option></Select>
                    </Form-item>
                    <Form-item label="大货款号:">
                                    <Input v-model="formSearch.goodsNo" placeholder="大货款号" style="width: 120px" />
                    </Form-item>
                    <Form-item :label-width="1">
                            <Button type="primary" @click="search">查询</Button>
                            <Button type="default" @click="handleReset">重置</Button>
                            <Button v-if="subarray.length>0"  type="primary" @click="getMore('1')">批量领取</Button>
                            <Button v-if="subarray.length==0" type="default" @click="getMore('2')">批量领取</Button>
                            <Button v-if="getGoodNOStatus" type="default" @click="getGoodNO">同步款号</Button>
                    </Form-item>
                </Col>
            
            </Form>
        </Row>
        <!-- 数据列表 -->
        <Row class="background-color-white exhibition">
            <!--  -->
            <!-- <Table  ref="currentRowTable"  @on-row-dblclick="showChakan"	@on-row-click="selectRow" @on-select-cancel="choiceId" @on-select-all-cancel="choiceId"  @on-select="choiceId" @on-select-all="choiceId"	:columns="columns" size="small" highlight-row :data="list"></Table> -->
            <Table  ref="currentRowTable" @on-select-cancel="choiceId" @on-select-all-cancel="choiceId"  @on-select="choiceId" @on-select-all="choiceId"	:columns="columns" size="small" highlight-row :data="list"></Table>
            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total
                show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
        </Row>
          <Modal title="查看大图" v-model="visible"> 
                                            <img :src="'data:image/png;base64,'+bigUlr" v-if="visible" style="width: 100%">
         </Modal>
    </div>
</template>

<script>
    // import addComponent from  './add.vue'
    // import editComponent from  './change.vue'
    import Util from 'libs/util';
    import { setTimeout } from 'timers';
    import { userInfo } from 'os';
    function formSearch() {
        return {
            search: ''
        }
    }
    export default {
        data() {
            return {
                getGoodNOStatus:true,
                visible: false,
                file:'',
                loadingStatus: false,
                mystyle:{
                    top:'70px',
                },
                brandList:[],         // 初始化品牌列表
                allusersList:[],      //初始化全部用户列表
                alldealList :[],      //初始化全部处理人列表
                dealshowFilelist:[],  //需要展示的处理文件列表
                designerNameData:[],   //设计师
                deal_visible:false,
                host:'http://eopsit.eptison.com/eop/',                 //主机名
                // host:'http://eopuat.eptison.com/eop/',  
                // host:'http://eop.quanshangtech.com:888/eop/',
                // host:'http://'+window.location.host+'/eop/',                  //主机名
                back_visible:false,
                add_visible :false,
                edit_visible:false,
                look_visible:false,
                subarray:[],
                red_packet_table_row_index:-1,
                switchtype  : '',
                rowData     : '',
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
                        minWidth: 60,

                    },
                    {
                        title: '大货款号',
                        key: 'goodsNo',
                        align: 'center',
                        minWidth: 84,
                    },
                     {
                        title: '图片',
                        key: 'imgUrl',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                           //productlaunch_getGoodsImg
                           if(params.row.imgUrl){
                             return h('div',{
                                   style: {
                                                        width: '80px',
                                                        height:'80px',
                                                        textAlign:'center',
                                                        lineHeight:'80px',
                                                        // width: 'auto',
                                                        // height: 'auto',
                                                        // maxWidth: '100%',
                                                        // maxHeight: '100%',
                                                },
                               },
                               [h('img', {         
                                           style: {
                                                        // display: 'inline-block',
                                                        // width: '100px',
                                                        // height:'70px',
                                                        // textAlign:'center',
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
                                 return h('div',{
                                   style: {
                                                        width     :'80px',
                                                        height    :'80px',
                                                        textAlign :'center',
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
                                                       src:'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1562574299&di=846b4c904bd54d3c3821fa5938888c69&src=http://hbimg.b0.upaiyun.com/bdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658',
                                             },
                                            on: {
                                                }
                                               }, '')    
                                                    
                                    ])
                           } 
                                       
                        }
                    },
                    {
                        title: '颜色',
                        key: 'color',
                        align: 'center',
                        minWidth: 84,
                    },
                    {
                        title: '领取状态',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 84,
                        render: (h, params) => {
                                 if(params.row.collectStarus==1){
                                      return h('span', {
                                        },'已领取'); 
                                 }else{
                                       return h('span', {
                                        },'未领取');
                                 }
                                 
                        },
                    },
                     {
                        title: '设计师',
                        key: 'designerName',
                        align: 'center',
                        minWidth: 84,
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 84,
                    },
                   
                    {
                        title: '年份',
                        key: 'years',
                        align: 'center',
                        minWidth: 80,
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
                        title: '领取日期',
                        key: 'collectDate',
                        align: 'center',
                        minWidth: 100,
                    },
                    {
                        title: '领取件数',
                        key: 'collectQty',
                        align: 'center',
                        minWidth: 84,
                        render: (h, params) => {
                                  if ((this.page - 1) *this.pageSize + params.index == this.red_packet_table_row_index) {
                                     return h('InputNumber', {
                                    props: {
                                        width:150,
                                        value:params.row.collectQty
                                    },
                                    style: {
                                            minWidth:'100px'
                                        },
                                    on: {
                                        "on-change": (event) => {
                                             if(/^[1-9]\d*$/.test(event)){
                                                    params.row.collectQty=event
                                            }else{
                                                    this.$Message.error('领取件数请输入正整数')
                                            }
                                        },
                                    },
                                },
                                )
                            } else {
                                return h('span', params.row.collectQty)
                            }
                        },
                    },
                    {
                        title: '延期天数',
                        key: 'delayDays',
                        align: 'center',
                        minWidth: 84,
                    },
                    {
                        title: '设计款号',
                        key: 'designGoodsNo',
                        align: 'center',
                        minWidth: 84,
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
                        title: '领取人',
                        key: 'collector',
                        align: 'center',
                        minWidth: 84,
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                        minWidth: 84,
                        render: (h, params) => {
                                  if ((this.page - 1) *this.pageSize + params.index == this.red_packet_table_row_index) {
                                 return h('Input', {
                                    props: {
                                        width:150,
                                        type:'textarea',
                                        value:params.row.remark
                                    },
                                    style: {
                                            minWidth:'100px'
                                        },
                                    on: {
                                        "on-blur": (event) => {
                                             console.log(event.target.value,'9999')
                                              params.row.remark=event.target.value
                                        },
                                    },
                                })
                            } else {
                                // return h('span', params.row.remark)
                                return h('p', {
                                                         style: {
                                                                    display: 'inline-block',
                                                                    width: '100%',
                                                                    textAlign:'left'
                                                            },
                                                         domProps:{
                                                                  title:this.list[params.index].remark
                                                                  }
                                                    }, this.list[params.index].remark.length>10?this.list[params.index].remark.substr(0,10)+'…':this.list[params.index].remark); 
                            }
                        },
                    },
                     
                     {
                        title: '操作',
                        key: 'lastUpdateUser',
                        align: 'center',
                        width: 200,
                        fixed :'right',
                        render: (h, params) => {
                            if(params.row.collectStarus==0||params.row.collectStarus==null){
                              return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        width:'110px'
                                    },
                                    on: {
                                        click: () => {
                                           this. lingqu(params.row.id,params.row.collector) 
                                        }
                                    }
                                }, '领取'),
                               ]);
                            }else{
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
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                    },
                                    on: {
                                        click: () => {
                                               this.red_packet_table_row_index = -1;
                                                this.editSave(params.row.id,params.row.collectQty,params.row.remark,params.row.collector)
                                            // this.red_packet_table_row_index = (this.page - 1) * this.pageSize + params.index;
                                        }
                                    }
                                }, '保存'),
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
                                            this.quxiaolingqu(params.row.id)
                                        }
                                    }
                                }, '取消领取'),
                               ]);  
                            }
                             
                        },
                    },
                ],
                questionDescrible:false,
                IDS:[], //批量操作的id
                userInfo: {},
                list: [],
                waveList:[],
                seasonList   :[         //四季列表
                  {label:'春季',value:'春季'},
                  {label:'夏季',value:'夏季'},
                  {label:'秋季',value:'秋季'},
                  {label:'冬季',value:'冬季'},
                ],
                getStatus :[         //四季列表
                  {label:'已领取',value:'1'},
                  {label:'未领取',value:'0'},
                ],
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
                // this.getData()
                this.getbrandList()
                this.getwaveList()
                this.getDesignerName()
                this.formSearch.submit= this.userInfo.userId
        },
        activated() {

        },
        methods: {
            //同步款号   
            getGoodNO(){
                if(this.formSearch.goodsNo == undefined){
                    this.$Message.warning('请先输入大货款号再同步！')
                }else{
                    this.getGoodNOStatus = false
                    let data = {}
                data.goodsNo = this.formSearch.goodsNo
                this.request('updatePhotoManagerTask', {data}, false).then((res) => {
                    if(res.code== 1){
                        this.getGoodNOStatus = true
                        this.getData()
                        this.$Message.success(res.msg)
                    }else{
                        this.getGoodNOStatus = true
                    }
                })
                }
            },
            //获取设计师
            getDesignerName(){
                let data = {}
                let List = []
                this.request('selectDesignerInRecords', {data}, false).then((res) => {
                    if(res.code=='1'){
                        List = res.data
                        console.log(List)
                        this.designerNameData = List.filter(item => item !== null)
                        console.log(List.filter(item => item !== null),'-0-00')
                    }
                })
            },
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
             getMore(type){
                  switch(type){
                        case'2':
                        this.$Message.error(`您未勾选或者状态为已领取,不能进行批量领取操作`)
                        break;
                         case'1':
                        if(this.subarray.length==0) return
                        this.lingqusss(this.subarray)
                        break;

                  }
             },
            //重置表单
               resetFormdata(){
                       this.formSearch={}
               },
               handleReset(){  
                       this.resetFormdata();
                       this.formSearch.create='';
                       this.formSearch.handle='';
                       this.search()
               },
               search() {
                        this.page =1
                        this.getData()
                },  
              //表单事件
              choiceId(selection,row){
                        console.log(selection)
                        this.IDS=selection;
                        if(this.IDS.length==0){
                            this.subarray=[]
                        }else{
                            for(let i=0;i<this.IDS.length;i++){
                                if(this.IDS[i].collectStarus!=1){
                                  this.subarray.push({id:this.IDS[i].id,collector:this.userInfo.userName})  
                                }
                            }
                            console.log(this.subarray,'999999')
                        }
                },
            currentChange(page) {
                    this.page = page
                    this.getData()
                },
            sizeChange(pageSize) {
                    this.pageSize = pageSize
                    this.getData()
                },
            formatParams(data) {
                    var arr = [];
                    for (var name in data) {
                    arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
                    }
                    return arr.join("&");
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
                    this.request('business_get_config_user_list', {}, false).then((res) => {
                            if(res.code==1){
                            this.alldealList=res.data
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
                        
                    let data                =  {}
                        data.length         =  this.pageSize;
                        data.start          =  (this.page - 1) * this.pageSize
                        data.brandId        =  this.formSearch.brandId    
                        data.years          =  this.unix_fullb(this.formSearch.date)
                        data.season         =  this.formSearch.season                       //类型
                        data.waveBand       =  this.formSearch.wave 
                        data.collectStarus  =  this.formSearch.status                       //问题描述
                      this.formSearch.goodsNo ? data.goodsNo        =  this.formSearch.goodsNo.split(",") : delete data.goodsNo
                        data.designerName   =  this.formSearch.designerName                 //设计师
                        if(data.waveBand  instanceof Array && data.waveBand.length==0){
                           delete data.waveBand
                        }
                    this.request('productlaunch_getDevelopPhotoManageList', {data:data}, true).then((res) => {
                        if (res.code == 1) {
                            let serialNoBegain = this.pageSize * (this.page - 1);
                                res.data.photoManageList.forEach((item) => {
                                    serialNoBegain++;
                                    item.serialNo = serialNoBegain;
                                })
                                this.list = res.data.photoManageList;
                                this.total = res.data.count;
                                if(res.data.notFound){
                                    this.$Message.error(res.data.notFound)  
                                }
                                // this.IDS=[]
                        }else{
                            this.list      = []
                            this.total     = '0' 
                        }
                    })

                },
            //返回xxxx年
            unix_fullb:function(unix){
                                if(unix){
                                    var newDate = new Date();
                                    newDate.setTime(unix);
                                var Y = newDate.getFullYear(),
                                    M = newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1,
                                    D = newDate.getDate() < 10 ? ('0' + newDate.getDate()) : newDate.getDate(),
                                    h = newDate.getHours() < 10 ? ('0' + newDate.getHours()) : newDate.getHours(),
                                    m = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes(),
                                    s = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds();
                                return  Y
                                }
                               
                },
            unix_fullTime:function(unix){
                                var newDate = new Date(unix);
                                var Y       = newDate.getFullYear(),
                                    M       = newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1,
                                    D       = newDate.getDate() < 10 ? ('0' + newDate.getDate()) : newDate.getDate();
                                return  Y +'-'+ M +'-'+D
                },
            lookbig(url){
                        this.visible=true
                        this.bigPicUrl=url
                },
            lookFile(url){
                    //  window.open('http://eop.eptison.com/'+'/eop/'+url)
                    //  window.open('http://eopuat.eptison.com/'+'/eop/'+url) 
                        window.open('http://eop.quanshangtech.com:888'+'/eop/'+url)
                    //  window.open('http://eopsit.eptison.com/'+'/eop/'+url)
                    console.log(location.href)
                },
                quxiao(){
                        this.$refs.child.chancel() 
                },
                // 操作领取
                lingqu(id){
                    let data=[];
                        data.push({id:id,collector:this.userInfo.userName});
                        //data.collectQty=collectQty
                    this.request('productlaunch_saveDevelopPgotoManage', {data:data}, false).then((res) => {
                        if (res.code == 1) {
                                this.$Message.success('领取成功')
                                this.getData()
                                // this.IDS=[]
                        }else{
                            
                        }
                    })   
                },
                //批量保存
                 lingqusss(data){
                    this.request('productlaunch_saveDevelopPgotoManage', {data:data}, false).then((res) => {
                        if (res.code == 1) {
                                this.$Message.success('批量领取成功')
                                this.subarray=[]
                                this.getData()
                                // this.IDS=[]
                        }else{
                            
                        }
                    })   
                },
                quxiaolingqu(id){// productlaunch_cancelDevelopPhotoManage
                         let data={};
                             data.id=id;
                             data.lastUpdateUser=this.userInfo.userName
                    this.request('productlaunch_cancelDevelopPhotoManage', {data:data}, false).then((res) => {
                        if (res.code == 1) {
                                this.$Message.success('取消领取成功')
                                this.getData()
                                // this.IDS=[]
                        }else{
                            
                        }
                    }) 
                },
                editSave(id,collectQty,remark,collector){
                       let data={};
                             data.id=id;
                             data.collectQty=collectQty;
                             data.remark=remark
                             data.collector=collector
                             data.lastUpdateUser=this.userInfo.userName
                    this.request('productlaunch_editDevelopPhotoManage', {data:data}, false).then((res) => {
                        if (res.code == 1) {
                                // this.$Message.success('编辑成功')
                                this.getData()
                                // this.IDS=[]
                        }else{
                            
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
