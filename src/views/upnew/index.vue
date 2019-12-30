<template>
    <div>
        <!-- <Row class="margin-bottom-10 background-color-white exhibition" style="font-size:20px;font-weight:bold">   
            20190704WTS / 修片管理
        </Row> -->
         <Row class="margin-bottom-10 background-color-white exhibition">   
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24">
                <Form-item label="品牌:"  :label-width="80" style="padding-left:20px">
                     <Select v-model="formSearch.brandName" style="width:120px" >
                              <Option v-for="item in brandList" :value="item.brandName" :key="item.brandId">{{ item.brandName }}</Option>
                      </Select>
                </Form-item>
                <Form-item label="时效方案:"  :label-width="80" style="padding-left:20px">
                     <Select v-model="formSearch.time" style="width:120px" >
                              <Option v-for="item in timeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
                      </Select>
                </Form-item>
                <Form-item label="进度:"  :label-width="80" style="padding-left:20px">
                     <Select v-model="formSearch.progress" style="width:120px" >
                              <Option v-for="item in progressList" :value="item.value" :key="item.value">{{ item.name }}</Option>
                      </Select>
                </Form-item>
                <Form-item label="任务编号:">
                                <Input v-model="formSearch.taskCode" placeholder="任务编号" style="width: 120px" />
                </Form-item>
                <Form-item :label-width="1">
                            <Button type="primary" @click="search">查询</Button>
                            <Button type="default" @click="handleReset">重置</Button>
                            <!-- <Button type="default" @click="test">test</Button> -->
                </Form-item>
                </Col>
            
            </Form>
        </Row>
        <Row class="background-color-white exhibition">
            <Table  ref="currentRowTable" 	:columns="columns" size="small" highlight-row :data="list"></Table>
            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total
                show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
        </Row>
    </div>
</template>

<script>
    import Util from 'libs/util';
    import filter from '../../filter' 
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
                brandList    : [],         // 初始化品牌列表
                timeList:[
                    {value:1,name:'静物任务流'},
                    {value:0,name:'外拍任务流'}
                ],
                progressList:[
                    {value:400,name:'进行中'},
                    {value:900,name:'已完成'}
                ],
                allusersList : [],      //初始化全部用户列表
                alldealList  : [],      //初始化全部处理人列表
                add_visible  : false,
                seasonList   :[         //四季列表
                  {label:'春季',value:'春季'},
                  {label:'夏季',value:'夏季'},
                  {label:'秋季',value:'秋季'},
                  {label:'冬季',value:'冬季'},
                ],
                columns: [
                      {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        width: 80,
                      
                      },
                      {
                            title: '时效方案',
                            key: 'projectCode',
                            align: 'center',
                            minWidth: 100,
                            render(h,params) {
                            if(params.row.projectCode == 1){
                                return h('span', '静物任务流')
                            }else{
                                return h('span', '外拍任务流')
                            }
                        },
                     },
                       {
                            title: '任务编号',
                            key: 'taskCode',
                            align: 'center',
                            minWidth: 100,
                     },
                     {
                        title: '任务进度流',
                        key: 'status',
                        align: 'center',
                        minWidth: 220,
                        render(h,params){
                          //未超时进行中
                        if(params.row.overtimeStatus=='未超时'&&params.row.status=='进行中'){
                                                return h('ul',{
                                                        style: {
                                                                paddingTop:'5px'
                                                                // marginLeft: '-46px',
                                                            //  position:'relative',
                                                            
                                                        },
                                                }, [
                                                    h('li', {
                                                        domProps:{
                                                                   title:'已用'+filter.dd_hh_mm(params.row.usedTime),
                                                                  },
                                                        style: {
                                                            cursor:'pointer',
                                                            display:'inline-block',
                                                            height:'30px',
                                                            lineHeight:'30px',
                                                            background:'rgba(215, 215, 215, 1)',
                                                            width:params.row.usedRate*100+'%'
                                                        },
                                                        on: {
                                                            click: () => {  
                                                                  
                                                            }
                                                        }
                                                    }, ''),
                                                    h('li', {
                                                        domProps:{
                                                                   title:'还剩'+filter.dd_hh_mm(params.row.supplyTime)
                                                        },
                                                        style: {
                                                            height    :'30px',
                                                            cursor    :'pointer',
                                                            lineHeight:'30px',
                                                            display   :'inline-block',
                                                            background:'#19be6b',
                                                            background:'#BCD2EE',
                                                            color     :'white',
                                                            float: 'right',
                                                            width     :(1-params.row.usedRate)*100+'%'
                                                        }
                                                    }, '进行中'),
                                                     ]);
                               //提前完成的
                            }else if(params.row.status=='已完成'&&params.row.advanceTime>0){
                                                    return h('ul',{
                                                        style: {
                                                                textAlign:'left'
                                                                // marginLeft: '-46px',
                                                            //  position:'relative',
                                                            
                                                        },
                                                }, [
                                                    h('li', {
                                                        domProps:{
                                                                   title:'已用'+filter.dd_hh_mm(params.row.usedTime),
                                                                  },
                                                        style: {
                                                            textAlign:'center',
                                                            cursor    :'pointer',
                                                            display   :'inline-block',
                                                            height    :'30px',
                                                            lineHeight:'30px',
                                                            background:'rgba(215, 215, 215, 1)',
                                                            width     : params.row.usedRate*100<60?'60%': params.row.usedRate*100+'%'
                                                        },
                                                        on: {
                                                          
                                                        }
                                                    },'已完成 （提前了'+filter.dd_hh_mm(params.row.advanceTime)+')'),
                                                ]);   
                              //刚刚好完成的 
                            }else if(params.row.status=='已完成'&&params.row.advanceTime==0){
                                                return h('ul', [
                                                    h('li', {
                                                        domProps:{
                                                                   title:'已用'+filter.dd_hh_mm(params.row.usedTime),
                                                                  },
                                                        style: {
                                                            cursor    :'pointer',
                                                            display   :'inline-block',
                                                            height    :'30px',
                                                            lineHeight:'30px',
                                                            background:'rgba(215, 215, 215, 1)',
                                                            width     :'100%'
                                                        },
                                                        on: {
                                                          
                                                        }
                                                    },'已完成'),
                                                ]);    
                             //已经完成的但超时的
                            }else if(params.row.status=='已完成'&&params.row.overtimeStatus=='已超时'){
                                     return h('ul', [
                                                    h('li', {
                                                        domProps:{
                                                                   title:'已用'+filter.dd_hh_mm(params.row.usedTime),
                                                                  },
                                                        style: {
                                                            cursor    :'pointer',
                                                            display   :'inline-block',
                                                            height    :'30px',
                                                            lineHeight:'30px',
                                                            background:'rgba(215, 215, 215, 1)',
                                                            width     :'100%'
                                                        },
                                                        on: {
                                                          
                                                        }
                                                    },'已完成'),
                              ]);  
                            //未开始已超时的状态
                            }else if(params.row.status=='未开始'&&params.row.overtimeStatus=='已超时'){
                                     return h('ul', [
                                                    h('li', {
                                                        domProps:{
                                                                   title:'已用'+filter.dd_hh_mm(params.row.usedTime),
                                                                  },
                                                        style: {
                                                            cursor    :'pointer',
                                                            display   :'inline-block',
                                                            height    :'30px',
                                                            lineHeight:'30px',
                                                            background:' rgb(225, 65, 137)',
                                                            width     :'100%',
                                                            color     :'#fff'
                                                        },
                                                        on: {
                                                          
                                                        }
                                                    },'未开始'),
                              ]);  
                              //超时进行中 
                            }else if(params.row.status=='进行中'&&params.row.overtimeStatus=='已超时'){
                                   return h('ul', [
                                                    h('li', {
                                                        domProps:{
                                                                //    title:'已超时'+filter.dd_hh_mm(params.row.overtimeTotal),
                                                                  },
                                                        style: {
                                                                cursor    :'pointer',
                                                                display   :'inline-block',
                                                                height    :'30px',
                                                                lineHeight:'30px',
                                                                background:'#4169E1',
                                                                width     :'100%',
                                                                color     :'white'
                                                        },
                                                        on: {
                                                             
                                                        }
                                                    },'进行中'),
                              ]);         
                            }
                        }
                     },
                     {
                        title: '任务详情',
                        key: 'properties',
                        align: 'center',
                        minWidth:80,
                        render: (h, params) => {
                             return  h('a',{
                                    on:{
                                'click':(event)=>{
                                    this.test(params.row)
                                }
                            }
                        },'查看')
                       }
                    },
                    {
                        title: '超时情况',
                        key: 'overtimeStatus',
                        align: 'center',
                        minWidth: 90,
                        render:(h,params)=>{
                            if(params.row.overtimeStatus=='已超时'){
                                 return h('ul',{
                                      style: {
                                         marginLeft: '-46px',
                                         cursor:'pointer'
                                        
                                    },
                               },[
                                h('li', {
                                    style: {
                                        display   :'inline-block',
                                        height    :'30px',
                                        textAlign :'center',
                                        lineHeight:'30px',
                                        color     :'white',
                                        background:'#4169E1',
                                        width     :'80%',
                                    },
                                }, '超时'+filter.dd_hh_mm(params.row.overtimeTotal)),
                                ]);
                            }else{
                                  return h('span',{},'未超时')
                            }    
                        }
               
                    },
                    {
                        title: '超时原因',
                        key: 'overtimeReason',
                        align: 'center',
                        minWidth: 120,
                        render:(h,params)=>{
                              if(params.row.overtimeStatus=='已超时'){
                                  return h('span',{},params.row.overtimeReason)
                              }else{
                                  return h('span',{},params.row.overtimeReason)
                              }
                        }
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
                this.getbrandList()
                this.allDealsList()
                this.formSearch.submit= this.userInfo.userId
                // this.getDepartmentTree()
                // this.initTaskList()
                this.getwaveList()
        },
        activated() {

        },
        methods: {
            test(row){
                console.log(row,'909879675677890-')
                this.$router.push({
                        name: 'rwsxxq',
                        query: {
                        taskCode: row.taskCode,
                        projectCode: row.projectCode,
                        brandName: row.brandName
                        }
                    });
            },
              addNew(){
                      this.add_visible=true
              },
              getDepartmentTree(){
                this.request('get_department_tree_list', {}, false).then((res) => {
                    if (res.errno == 0) {
                        this.departmentList = Util.arrayToDepartmentTree(Util.deepClone(res.data))
                    }
                })
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
                    this.request('get_employee_list', {}, false).then((res) => {
                            if(res.errno==0){//productlaunch_developTimeConfig_selectAllTask
                            this.alldealList=res.data
                            console.log('999999999')
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
                        data.length         =  this.pageSize
                        data.start          =  (this.page - 1) * this.pageSize
                        data.taskCode       =  this.formSearch.taskCode
                        data.brandName      =  this.formSearch.brandName
                        data.projectCode    =  this.formSearch.time   //失效方案
                        data.processor     =  this.formSearch.progress   //完成进度
                    this.request('productlaunch_timingDiagram_selectPage', {data:data}, true).then((res) => {
                        if (res.code == 1&&res.data!=null){
                             let serialNoBegain = this.pageSize * (this.page - 1);
                                res.data.timingDiagramList.forEach((item) => {
                                    serialNoBegain++;
                                    item.serialNo = serialNoBegain;
                                    // item.usedRate=(item.usedRate*10000+0.5*10000)/10000
                                })
                                this.list = res.data.timingDiagramList;
                                this.total = res.data.count;
                        }else{
                            this.list      = []
                            this.total     = '0' 
                        }
                    })

                },   
                del(id){//productlaunch/deleteDevelopUserConfig
                     let data={};
                         data.id=id
                         data.lastUpdateUser=this.userInfo.userName
                     this.request('productlaunch_deleteDevelopUserConfig', {data:data}, false).then((res) => {
                            if(res.code==1){
                              this.getData()
                            }
                        })   
                },
               quxiao(){
                       this.$refs.child.formSearch={}
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
        .ivu-table-cell{
            padding-left: 0;
            padding-right:0;
        }
        th.ivu-table-column-center :nth-of-type(4){
            text-align: left !important
        }
</style>
