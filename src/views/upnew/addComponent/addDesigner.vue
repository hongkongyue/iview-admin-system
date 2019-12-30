<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">   
            <Form :model="formSearch" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24">
                    <Form-item label="品牌:"  :label-width="50">
                        <Select v-model="formSearch.brandId" style="width:120px"  filterable>
                                <Option v-for="item in brandList" :value="item.brandId" :key="item.brandId">{{ item.brandName }}</Option>
                        </Select>
                    </Form-item>
                      <Form-item label="部门:"  :label-width="50">
                        　<Select v-model="formSearch.obj" style="width:120px"                @on-change="selectNext(formSearch.obj)" >
                                        <Option v-for="item in departmentList" :value="item" :key="item.id">{{item.title}}</Option>
                          </Select>
                    </Form-item>
                    <Form-item label="设计师:" prop="designer">
                                　<Select v-model="formSearch.designer" style="width:120px"    @on-change="selectDesign(formSearch.designer)" filterable>
                                        <Option v-for="item in designer" :value="item.id" :key="item.id">{{item.name}}</Option>
                                  </Select>
                    </Form-item>
                    <Form-item label="企划:"  prop="planer">
                                    <Select v-model="formSearch.planer" style="width:120px"  @on-change="selectPlaner(formSearch.planer)" filterable>
                                        <Option v-for="item in planer" :value="item.id" :key="item.id">{{item.name}}</Option>
                                    </Select>
                    </Form-item>
                    <Row>
                     <Form-item :label-width="1" style="padding-left:320px">   
                                 <Button type="primary" @click="confirmAdd">确定</Button>
                    </Form-item>
                    <Form-item :label-width="1">   
                                 <Button type="default" @click="cancel">取消</Button>    
                    </Form-item>
                    </Row>
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
                flag:'',
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
                storeArray:[]
            }
        },
        components:{
          
        },
        mounted() {
                this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
                this.getDepartmentTree()
                this.getbrandList()
        },
        activated() {
             
        },
        methods: {
              //初始化品牌列表
              getbrandList(){
                this.request('get_scm_brand_list', {}, false).then((res) => {
                        if(res.code==1){
                        this.brandList=res.data
                        }
                    })      
                },
              //获取品牌名称
                //  根据id返回设计师名称和企划人名场
                 getBrandName(id){
                     if(this.brandList.length>0){
                         for(let i=0,len=this.brandList.length;i<len;i++){
                             if(this.brandList[i].brandId==id){
                                  return this.brandList[i].brandName
                             }
                         }
                     }
                 },
                 confirm(){
                         let data={};
                             data.createUser       = this.userInfo.userName
                             data.departmentId     = this.formSearch.departmentId
                             data.departmentName   = this.formSearch.departmentName
                            //  data.designerOaId     
                         this.request('productlaunch_developDesignerConfig_addNewConfig', {data:data}, false).then((res) => {
                    if (res.code== 1) {
                                  this.designer=res.data;
                                //   this.planer=res.data;
                                  
                    }
                })      
                },

                //  根据id返回设计师名称和企划人名场
                 getDesiger(id){
                     if(this.storeArray.length>0){
                         for(let i=0,len=this.storeArray.length;i<len;i++){
                             if(this.storeArray[i].id==id){
                                  return this.designer[i].name
                             }
                         }
                     }
                 },
                getPlaner(id){
                     if(this.planer.length>0){
                         for(let i=0,len=this.planer.length;i<len;i++){
                             if(this.planer[i].id==id){
                                  return this.planer[i].name
                             }
                         }
                     }
                 },
                 selectNext(obj){//get_examine_post_li this.formSearch.designer=''
                       if(!obj) return
                       this.formSearch.departmentId=obj.id
                       this.formSearch.departmentName=obj.label
                       this.request('get_examine_post_list', {data:{orgId:obj.id}}, false).then((res) => {
                      if (res.code== 1) {
                                    this.storeArray=[]
                                    this.designer=res.data
                                    this.planer  =res.data
                                    this.storeArray=res.data;
                        }
                    })      
                },
                confirmAdd(){
                      let data={};
                          data.createUser    =  this.userInfo.userName
                          data.departmentId  =  this.formSearch.departmentId;
                          data.departmentName=  this.formSearch.departmentName;
                          data.designerOaId  =  this.formSearch.designer;
                          data.designerName  =  this.getDesiger(this.formSearch.designer);
                          data.plannerOaId   =  this.formSearch.planer;
                          data.plannerName   =  this.getDesiger(this.formSearch.planer);
                          data.brandId       =  this.formSearch.brandId
                          data.brandName     =  this.getBrandName(this.formSearch.brandId)
                         if(!data.brandId)      return  this.$Message.error('品牌不能为空')
                         if(!data.departmentId) return  this.$Message.error('部门不能为空')
                         if(!data.designerOaId) return  this.$Message.error('设计师不能为空')
                         if(!data.plannerOaId)  return  this.$Message.error('企划不能为空')
                      this.request('productlaunch_developDesignerConfig_addNewConfig', {data:data}, false).then((res) => {
                      if (res.code== 1) {
                                  this.$Message.success('新增成功')
                                  this.formSearch={};
                                  this.planer   =[]
                                  this.designer =[]
                                  this.$parent.$parent.add_visible=false;
                                  this.$parent.$parent.getData()
                                  this.$parent.$parent.initdepartlist()
                        }else{
                        }
                    }) 
                },
                selectDesign(obj){
                        this.formSearch.designer=obj
                        // console.log(this.formSearch.designer)
                        //  let id        = this.getorg_department_path(this.formSearch.designer)
                        //  let orgLevelId= this.getorg_level_id(this.formSearch.designer)
                        //  console.log(id,orgLevelId)
                        //     this.request('get_examine_post_list', {data:{unit_path:id,orgLevelId:orgLevelId}}, false).then((res) => {
                        //         if (res.code== 1) {
                        //             this.planer  =res.data                         
                        //         }
                        //     })
                },
                selectPlaner(obj){
                   this.formSearch.planer=obj
                  
      
                },
                getorg_level_id(id){
                        console.log(id)
                        for(let i=0;i<this.designer.length;i++){
                            if(this.designer[i].id==id){
                                return this.designer[i].org_level_id
                            }
                        }
                },
                getorg_department_path(id){
                        console.log(id)
                        for(let i=0;i<this.designer.length;i++){
                            if(this.designer[i].id==id){
                                return this.designer[i].org_department_path
                            }
                        }
                },
                getDepartmentTree(){
                
                    this.request('get_department_tree_list', {}, false).then((res) => {
                        if (res.errno == 0) {
                            this.departmentList =res.data
                        }
                    })
               },
               cancel(){
                       this.planer   =[]
                       this.designer =[]
                       this.$parent.$parent.add_visible=false
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
