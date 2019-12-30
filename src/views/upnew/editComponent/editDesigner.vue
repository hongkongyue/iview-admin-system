<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">   
            <Form :model="formSearch" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24">
                    <!-- <Form-item label="部门:">
                        <Input v-model="formSearch.goodsNo" placeholder="请输入货号编码" style="width: 120px"
                    ></Input>
                    </Form-item> -->
                      <Form-item label="部门:"  :label-width="50">
                        <!-- <div class="tree">
                            <treeselect
                                    style="width:220px;"
                                    placeholder="请选择"
                                    :multiple="false"
                                    value-format="object"
                                    :options="departmentList"
                                    v-model="formSearch.departmentObj"
                            />
                        </div> -->
                          <Input v-model= "params.departmentName"  style="width: 120px" :readonly="true"/>
                        <!-- 　<Select v-model="formSearch.obj" style="width:120px"                @on-change="selectNext(formSearch.obj)">
                                        <Option v-for="item in departmentList" :value="item" :key="item.id">{{item.title}}</Option>
                          </Select> -->
                    </Form-item>
                    <Form-item label="设计师:">
                                     <Input v-model= "params.designerName"  style="width: 120px" :readonly="true"/>
                                <!-- 　<Select v-model="formSearch.designer" style="width:120px"    @on-change="selectDesign(formSearch.designer)">
                                        <Option v-for="item in designer" :value="item" :key="item.id">{{item.name}}</Option>
                                  </Select> -->
                    </Form-item>
                    <Form-item label="企划:">
                                    　<Select v-model="formSearch.planId" style="width:120px"  @on-change="selectPlaner(formSearch.planId)">
                                        <Option v-for="item in planer" :value="item.id" :key="item.id">
                                            {{item.name}}
                                        </Option>
                                    </Select>
                    </Form-item>
                    <Row>
                     <Form-item :label-width="1" style="padding-left:280px">   
                                 <Button type="primary" @click="confirmedit">确定</Button>
                       </Form-item>
                         <Form-item :label-width="1" >   
                                 <Button type="default" @click="cancel">取消</Button>    
                       </Form-item>
                    </Row>
                    <!-- <Form-item ><span v-if="switchtype!='up'" @click="showmore">更多<Icon type="ios-arrow-down" /></span></Form-item> -->
                </Col>
            </Form>
        </Row>
       
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
        data() {
            return {
                visible: false,
                red_packet_table_row_index:-1,
                loadingStatus: false,
                mystyle:{
                    top:'70px',
                },
                brandList:[],         // 初始化品牌列表
                userInfo: {},
                formSearch: {
                },
                planer:[],
                designer:[],
                dealformSearch:{
                },
                departmentList:[],
                backformSearch:{},     //回退数据
                brandList:[],          //品牌列表
                modal_visible:false,   // 编 
            }
        },
        props:{
               params:Object,
               id    :String,
               planId:String
        },
        watch:{
              id(n,o){
                  console.log(n)
                  if(n!=''){
                       this.selectNext(n)
                  }
              },
              planId(n,o){
                    if(n){
                         setTimeout(()=>{
                               this.$nextTick()
                         })
                    }
              }
        },
        components:{
        },
        mounted() {
                this.selectNext(this.id)
                this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
                this.getDepartmentTree()
        },
        activated() {
             
        },
        methods: {
                 selectNext(id){
                       if(!id) return
                       this.request('get_examine_post_list', {data:{orgId:id}}, false).then((res) => {
                      if (res.code== 1) {
                                    this.planer  =res.data
                                    this.formSearch.planId=this.params.plannerOaId   
                        }
                    })      
                },
                confirmedit(){
                      let data={};
                          data.lastUpdateUser  =  this.userInfo.userName
                          data.id              =  this.params.id;
                          data.plannerOaId     =  this.formSearch.planId;
                         if(!data.plannerOaId) return  this.$Message.error('企划不能为空')
                      this.request('productlaunch_developDesignerConfig_updateInfo', {data:data}, false).then((res) => {
                      if (res.code== 1) {
                                  this.formSearch={};
                                  this.$parent.$parent.edit_visible=false;
                                  this.$parent.$parent.getData()      
                        }
                    })       
                },
                selectPlaner(obj){
                        if(!obj)return 
                        this.params.plannerOaId=obj
                },
                getDepartmentTree(){
                    this.request('get_department_tree_list', {}, false).then((res) => {
                        if (res.errno == 0) {
                            this.departmentList =res.data
                            
                        }
                    })
               },
               cancel(){
                       this.$parent.$parent.edit_visible=false
                       this.formSearch={}
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
