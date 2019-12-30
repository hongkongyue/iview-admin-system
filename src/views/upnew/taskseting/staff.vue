<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">   
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24">
                    <!-- <Form-item label="部门:">
                        <Input v-model="formSearch.goodsNo" placeholder="请输入货号编码" style="width: 120px"
                    ></Input>
                    </Form-item> -->
                     <Form-item label="部门:"  :label-width="50">
                    <div class="tree">
                        <treeselect
                                style="width:250px;"
                                placeholder="请选择"
                                :multiple="false"
                                value-format="object"
                                :options="departmentList"
                                v-model="formSearch.departmentObj"
                        />
                    </div>
                   </Form-item>
                    <Form-item label="任务名称:">
                                　<Select v-model="formSearch.taskId" style="width:120px">
                                        <Option v-for="item in questionType" :value="item.id" :key="item.id">{{item.taskName}}</Option>
                                  </Select>
                    </Form-item>
                    <Form-item label="处理人:">
                                    　<Select v-model="formSearch.userOAId"  style="width:120px;"  filterable>
                                        <Option v-for="item in alldealList" :value="item.id" :key="item.id"> {{item.name}}</Option>
                                     </Select>
                    </Form-item>
                    <Form-item :label-width="1">
                        <Button type="primary" @click="search">查询</Button>
                        <Button type="default" @click="handleReset">重置</Button>
                        <Button type="primary" @click="addNew">新增</Button>
                    </Form-item>
                    <!-- <Form-item ><span v-if="switchtype!='up'" @click="showmore">更多<Icon type="ios-arrow-down" /></span></Form-item> -->
                </Col>
                <Col span="24"  style="padding-left:20px"> 
                
                </Col>
            </Form>
        </Row>
        <!-- 数据列表 -->
        <Row class="background-color-white exhibition">
            <Table  ref="currentRowTable" 	:columns="columns" size="small" highlight-row :data="list"></Table>
            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total
                show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
        </Row>
        <!-- 新增 -->
        <Modal  v-model="add_visible" title="新增" :width="830"  class-name="customize-modal-center" @on-cancel="quxiao" >
             <div>
                  <add-component ref="child" :departmentList="departmentList" :alldealList="alldealList" :questionType="questionType"></add-component>
             </div>
             <div slot="footer"></div>
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
                visible: false,
                red_packet_table_row_index:-1,
                loadingStatus: false,
                mystyle:{
                    top:'70px',
                },
                brandList:[],         // 初始化品牌列表
                allusersList:[],      //初始化全部用户列表
                alldealList :[],      //初始化全部处理人列表
                add_visible :false,
                questionStatus:[],
                backReason:[
                    { value:'重复处理'},{value:'补充详情'}
                ],
                 questionType:[
                ],
                columns: [
                     {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 120
                     },
                     {
                        title: '部门',
                        key: 'departmentName',
                        align: 'center',
                        minWidth: 200,
                      },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 200,
                    },
                    {
                        title: '任务名称',
                        key: 'taskName',
                        align: 'center',
                        minWidth: 200,
                    },
                    {
                        title: '处理人',
                        key: 'userName',
                        align: 'center',
                        minWidth: 200,
                        render: (h, params) => {
                                  if ((this.page - 1) *this.pageSize + params.index == this.red_packet_table_row_index) {
                                     return h('Select', {
                                    props: {
                                        width:150,
                                        placeholder:params.row.userName,
                                        filterable:true,
                                        textAlign:'center'
                                    },
                                    style: {
                                            minWidth:'100px'
                                        },
                                    on: {
                                        "on-change": (event) => {
                                            params.row.userId= event
                                        }
                                    },
                                },
                              this.alldealList.map(function (item) {
                                    return h('Option', {
                                        props: {
                                            value:item
                                        }
                                    },item.name)
                                }))
                            } else {
                                return h('span', params.row.userName)
                            }
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'createdStr',
                        align: 'center',
                        minWidth: 220,
                    },
                    {
                        title: '修改时间',
                        key: 'lastUpdatedStr',
                        align: 'center',
                       minWidth: 220,
                    },
                     {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        minWidth: 250,
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
                                            this.red_packet_table_row_index = -1;
                                                let data={};
                                                    data.lastUpdateUser = this.userInfo.userName;
                                                    data.id      =params.row.id;
                                                    data.userOAId=params.row.userId.id;
                                                    data.userName=params.row.userId.name
                                            this.request('productlaunch_editDevelopUserConfig',{
                                                data:data
                                            },true).then(res=>{
                                                if(res.code == 1){
                                                    this.$Message.success(res.msg);
                                                    this.red_packet_table_row_index = -1;
                                                    this.search()
                                                }
                                            })     
                                        }
                                    }
                                }, '保存'),
                                 h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                                this.$Modal.confirm({
                                                    title: '提示',
                                                    content: '该行将会删除，请确认！',
                                                    onOk: () => {
                                                        this.del(params.row.id);
                                                    },
                                                    onCancel: () => {
                                                        this.$Message.warning('已取消删除');
                                                    }
                                                })   
                                            }
                                    }
                                }, '删除'),
                            ]);
                        }
                    }
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
            addComponent,
            // editComponent
        },
        mounted() {
                this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo')); 
                this.getData()
                this.getbrandList()
                this.allDealsList()
                this.formSearch.submit= this.userInfo.userId
                this.getDepartmentTree()
                this.initTaskList()
        },
        activated() {

        },
        methods: {
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
                       this.formSearch.create='';
                       this.formSearch.handle='';
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
                            console.log(this.alldealList,'999999999')
                            }
                        })    
                },
            //初始化任务列表
            initTaskList(){
                    this.request('productlaunch_developTimeConfig_selectAllTask', {}, false).then((res) => {
                            if(res.code==1){//
                            this.questionType=res.data
                            }
                        })    
                },
            //根据品牌ID返回品牌名称
            getBrandname(id){
                for(let i=0;i<this.brandList.length;i++){
                    if(id==this.brandList[i].brandId){
                        return this.brandList[i].brandName
                    }
                }
                },
            //初始化第一个列表数据
            getData() {
                      let id='';
                      if(this.formSearch.departmentObj){
                          id=this.formSearch.departmentObj.id
                      }else{
                          id=''
                      }
                    let data                =  {}
                        data.length         =  this.pageSize;
                        data.start          = (this.page - 1) * this.pageSize
                        data.departmentId   = id
                        data.taskId         = this.formSearch.taskId
                        data.userOAId       = this.formSearch.userOAId
                        data.departmentId?'':delete  data.departmentId
                    this.request('productlaunch_getDevelopUserConfigList', {data:data}, true).then((res) => {
                        if (res.code == 1) {
                             let serialNoBegain = this.pageSize * (this.page - 1);
                                res.data.userConfigList.forEach((item) => {
                                    serialNoBegain++;
                                    item.serialNo = serialNoBegain;
                                })
                                this.list = res.data.userConfigList;
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
