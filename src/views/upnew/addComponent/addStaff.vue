<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">   
            <Form :model="formSearch" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:40px">
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
                                　<Select v-model="formSearch.questionStatus" style="width:250px" >
                                       <Option v-for="item in questionType" :value="item" :key="item.id">{{item.taskName}}</Option>
                                 </Select>
                    </Form-item>
                   </Col>
                   <Col  span="24">
                     <Form-item label="处理人:">
                                    　<Select v-model="formSearch.userId"  filterable  style="width:250px">
                                        <Option v-for="item in alldealList" :value="item" :key="item">{{ item.name}}</Option>
                                     </Select>
                     </Form-item>
                     <!-- <Form-item label="处理人:" >
                        <Select   v-model="formSearch.userId" filterable style="width:250px" >
                            <Option v-for="item in alldealList" :value="item" :key="item.id">{{ item.name }}</Option>
                        </Select>
                   </Form-item> -->
                     <Form-item label="品牌:">
                                    　<Select v-model="formSearch.brandId" style="width:250px" >
                                        <Option v-for="item in brandList" :value="item" :key="item.brandId">
                                            {{item.brandName}}
                                        </Option>
                                    </Select>
                    </Form-item>
                    <Row>
                     <Form-item :label-width="1" style="padding-left:300px">   
                                 <Button type="primary" @click="addconfirm">确定</Button>
                       </Form-item>
                         <Form-item :label-width="1" >   
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
    import addComponent from '../addComponent/addStaff.vue';
    function formSearch() {
        return {
                 search: ''
        }
    }
    export default {
        data() {
            return {
                departmentList:[],
                formSearch: {
                },
                brandList:[],
            }
        },
        props:{
             departmentList: Array,
             alldealList   : Array,
             questionType  : Array,
        },
        mounted() {
               this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
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
           cancel(){
                        this.$parent.$parent.add_visible=false
                        this.formSearch={}
           },
           confirm(){
                   console.log(this.formSearch) 
                    return
                   this.$parent.$parent.getData()
           },
          addconfirm(){// productlaunch_addDevelopUserConfig
                  let id,name;
                  let data={};
                      if(this.formSearch.departmentObj){
                          data.departmentId  = this.formSearch.departmentObj.id
                          data.departmentName= this.formSearch.departmentObj.label
                      }else{
                         return this.$Message.error('部门不能为空')
                      }
                      if(this.formSearch.questionStatus){
                             data.taskId=this.formSearch.questionStatus.id;
                             data.taskName=this.formSearch.questionStatus.taskName;
                      }else{
                          return this.$Message.error('任务名称不能为空')  
                      }
                       if(this.formSearch.userId){
                             data.userOAId=this.formSearch.userId.id;
                             data.userName=this.formSearch.userId.name;
                      }else{
                          return this.$Message.error('处理人不能为空')  
                      }
                       if(this.formSearch.brandId){
                             data.brandId=this.formSearch.brandId.brandId;
                             data.brandName=this.formSearch.brandId.brandName;
                      }else{
                          return this.$Message.error('品牌不能为空')  
                      }
                     data.createUser= this.userInfo.userName
                 this.request('productlaunch_addDevelopUserConfig', {data:data}, false).then((res) => {
                        if(res.code==1){
                              this.$Message.success('新增成功') 
                              this.$parent.$parent.getData() 
                              this.formSearch={}
                              this.$parent.$parent.add_visible=false

                        }
                    })    
          }
        }       
    }
</script>

<style>
    /* .ivu-modal-footer{
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
        } */
</style>
