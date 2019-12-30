<template>
<div id="post">
    <Row class="margin-bottom-10 background-color-white exhibition">
        <Col span="24">
        <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline label-position="right">
            <Form-item label="单据状态：">
                <Select style="width:160px" v-model="formSearch.order_status" placeholder="请选择" filterable>
                     <Option value="200">已申请</Option>
                     <Option value="400">退货中</Option>
                     <Option value="600">已退货</Option>
                     <Option value="900">已退款</Option>
                     <Option value="950">退款异常</Option>
                     <Option value="999">取消退货</Option>
                     <Option value="300">退货审核通过</Option>
                     <Option value="350">申请审核失败</Option>
                     <Option value="750">退款审核失败</Option>      
                </Select>
            </Form-item>
            <Form-item label="退货申请审核：" label-width="110">
                <Select style="width:130px" v-model="formSearch.return_goods_status" placeholder="请选择" filterable>
                    <Option value="200">待审核</Option>
                    <Option value="300">审核通过</Option>
                    <Option value="350">审核失败</Option>
                </Select>
            </Form-item>
            <Form-item label="退款审核：">
                <Select style="width:130px" v-model="formSearch.return_pay_status" placeholder="请选择" filterable>
                        <Option value="200">待审核</Option>
                        <Option value="300">审核通过</Option>
                        <Option value="350">审核失败</Option>
                </Select>
            </Form-item>
            <Form-item label="退货日期：">
                <DatePicker v-model="formSearch.date" format="yyyy-MM-dd" type="daterange" separator="~" placement="bottom-end" placeholder="请选择" style="width: 200px"></DatePicker>
            </Form-item>
            <Form-item label="退货人：">
                <Input v-model="formSearch.consigne" placeholder="请输入" />
            </Form-item>
            <Form-item label="退货单号：">
                <Input v-model="formSearch.return_code" placeholder="请输入" />
            </Form-item>
            <Form-item label="原始订单编号：" label-width="110">
                <Input v-model="formSearch.source_return_code" placeholder="请输入" />
            </Form-item>
            <Form-item label="物流单号：">
                <Input v-model="formSearch.logistics_no" placeholder="请输入" />
            </Form-item>
            <Form-item :label-width="1">
                <Button type="primary" @click="search">查询</Button>
                <Button type="default" @click="handleReset">重置</Button>
                <Button type="primary" @click="examineCheck">审核</Button>
            </Form-item>
        </Form>
        </Col>
    </Row>
    <Row class="background-color-white exhibition">
        <Col span='3'>
        <!-- <p style="padding-left:20px">全部单据{{leftTotal}}单</p> -->
        <Tree @on-select-change="selectTree" :data="good_peoperty_list"></Tree>
        </Col>
        <Col span='21'>
        <el-table   cell-class-name="cellcb"  :data="label_list" ref="checkTable"   @selection-change="choiced" @select-all="choiced"  @select="choiced" max-height="700"  style="width: 100%" row-key="return_code" :expand-row-keys="expendArray"  border :tree-props="{children: 'children',hasChildren: 'hasChildren'}">
            <el-table-column type="selection" :selectable='checkboxT' align="center" width="55" fixed="left">
                <!-- <template slot-scope="scope">
                          <span><Icon type="ios-arrow-forward" v-if="scope.row.children">00</span>
                </template> -->
            </el-table-column>
            <el-table-column  type="index" label="序号" align="center" width="80">
            </el-table-column>
            <el-table-column prop="return_code" label="退货单号" align="left" min-width="240" show-overflow-tooltip>
                <template slot-scope="scope" class="12345">
                          <span><Icon type="ios-arrow-forward" v-if="scope.row.tag"  @click="getNewList(scope.row.return_code,scope.row.index)"/> {{scope.row.return_code}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="source_return_code" label="原始订单号" align="center" min-width="180" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="created" align="center" min-width="170" label="退货日期" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="commodity_code" align="center" min-width="120" label="商品条码" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="item_counts" align="center" min-width="140" label="退货申请数量" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="instock_count" align="center" min-width="140" label="仓库已收货数量" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="total_money" align="center" min-width="140" label="退款金额" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="remark" align="center" min-width="140" label="备注" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="order_status" align="center" min-width="140" label="单据状态" show-overflow-tooltip>
               <template slot-scope="scope">
                         {{scope.row.order_status|switchStatus}}
               </template>   
            </el-table-column>
            <el-table-column prop="return_goods_status" align="center" min-width="140" label="退货申请审核" show-overflow-tooltip>
                 <template slot-scope="scope">
                         {{scope.row.return_goods_status==300?'审核通过':(scope.row.return_goods_status==200?'待审核':(scope.row.return_goods_status==350?'审核失败':''))}}
                 </template>
            </el-table-column>
            <el-table-column prop="return_pay_status" align="center" min-width="140" label="退款审核" show-overflow-tooltip>
                 <template slot-scope="scope">
                         {{scope.row.return_pay_status==300?'审核通过':(scope.row.return_pay_status==200?'待审核':(scope.row.return_pay_status==350?'审核失败':''))}}
                 </template>
            </el-table-column>
            <el-table-column prop="address" min-width="140" align="center" label="操作" fixed="right"> 
                   <template slot-scope="scope">
                    <el-button v-if="scope.row.children"
                    type="primary"
                    size="mini"
                    @click="handleEdit(scope.row)">查看</el-button>
                </template>      
            </el-table-column>
        </el-table>
         <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total :page-size-opts="[10, 20, 30, 40]" show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
        <!-- <Table :columns="columns" @on-current-change='currentChange' size="small" highlight-row max-height="400" :data="label_list"></Table> -->
        </Col>
    </Row>
    <Modal :title="title" v-model="examine" class-name="vertical-center-modal" @on-cancel="Reset('formValidate')">
        <Form :model="formData" ref="formValidate" :label-width="90" inline :rules="ruleValidate" label-position="right">
            <Form-item label="审核是否通过?" :label-width="110" prop="selected">
                <RadioGroup v-model="formData.selected" style="width: 200px">
                    <Radio label="是"></Radio>
                    <Radio label="否"></Radio>
                </RadioGroup>
            </Form-item>
            <Col>
            <Form-item label="审核意见：" :label-width="110">
                <Input v-model="formData.remark" maxlength="100" show-word-limit type="textarea" placeholder="请输入" style="width: 200px" />
            </Form-item>
            </Col>
            <!-- <Col style="text-align:center">
            <div style="height:10px;line-height:10px">单据状态：未收货</div>
            </Col>
            <Col style="text-align:center">
            <div style="height:70px;line-height:70px">是否要强制审核？</div>
            </Col> -->
            <Row style="text-align:center">
                <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
                <Button type="default" @click="Reset('formValidate')">取消</Button>
            </Row>

        </Form>
        <div slot="footer"></div>
    </Modal>
    <Modal title="强制审核" v-model="forceExamine" class-name="vertical-center-modal" on-cancel="cancel">
        <Form :model="formData" ref="formData" :label-width="90" inline :rules="ruleValidate" label-position="right">
            <Col style="text-align:center">
            <div style="height:10px;line-height:10px">单据状态：未收货</div>
            </Col>
            <Col style="text-align:center">
            <div style="height:70px;line-height:70px">是否要强制审核？</div>
            </Col>
            <Row style="text-align:center">
                <Button type="primary" @click="confirmCheck">确定</Button>
                <Button type="default" @click="cancel">取消</Button>
            </Row>

        </Form>
        <div slot="footer"></div>
    </Modal>
</div>
</template>

<script>
import {
    mapState
} from 'vuex';
import Util from 'libs/util';
import filters from '../../../filter/'

export default {
    name: 'returnAudit',
    data() {
        return {
            defaultValue:true,
            examine:false,
            forceExamine:false,
            formSearch: {
                order_status:'',
            },
            label_list: [],
            good_peoperty_list:[],
            selectedArr:[],
            userInfo: {},
            title:'审核',
            formData: {
                selected:'',
                remark:''
            },
            ruleValidate: {
                selected: [{
                    required: true,
                    message: '请选择审核是否通过',
                    trigger: 'change'
                }],
                remark: [{
                    required: true,
                    message: '请输入审核意见',
                    trigger: 'blur'
                }],
            },
            leftTotal:'',
            total: 0,
            expendArray:[],
            page: 1,
            pageSize: 10,
            goodsIDS:[],
            moneyIDS:[],//审核的ID
            subIDS:[],
        }
    },
    mounted() {
        this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
        this.get_good_peoperty_list();
    },
    activated() {
       
    },
    updated(){
            
    },
    methods: {
         confirmCheck(){
                                   this.title="审核退款"
                                   this.examine=true
                                   this.forceExamine=false
        },
         handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                         if(this.title=='审核退货'){
                             this.checkGoodsBack()
                         }else if(this.title=='审核退款'){
                             this.checkMoneyBack()
                         }
                    } else {
                      
                    }
                })
            },
        Reset(name) {
                this.examine=false;
                this.formData.selected=''
                this.formData.remark=''
                this.$refs[name].resetFields();
        },
        // 审核退款状态
        checkMoneyBack(){
                 let data={}
                     data.refund_check_id=this.userInfo.userId
                     data.refund_check_name=this.userInfo.userName
                     data.refund_check_msg=this.formData.remark
                     data.ids=this.subIDS
                     data.return_pay_status=this.formData.selected=='否'?0:1
                    this.request('eom_check_refund_status', {
                            data: data
                        }, true).then(res => {
                            if (res.code == 1) {
                                   this.$Message.success(res.msg)
                                   this.examine=false;
                                   for(let i in this.formSearch){
                                       this.formSearch[i]=''
                                   }
                                   this.formData={}
                                   this.subIDS=[]
                                //    this.formSearch={}
                                   this.getData()
                                    this.get_good_peoperty_list();
                            }else{
                                 this.$Message.error(res.msg)
                            }
                        })
         },
        // 审核退货状态
        checkGoodsBack(){
              let data={}
                     data.order_check_id  =this.userInfo.userId
                     data.order_check_name=this.userInfo.userName
                     data.order_check_msg =this.formData.remark
                     data.ids=this.subIDS
                     data.return_goods_status=this.formData.selected=='否'?0:1
                    this.request('eom_check_goods_status', {
                            data: data
                        }, true).then(res => {
                            if (res.code == 1) {
                                   this.$Message.success(res.msg)
                                   this.examine=false;
                                   for(let i in this.formSearch){
                                        this.formSearch[i]=''
                                   }
                                   this.formData={}
                                   this.subIDS=[]
                                //    this.formSearch={}
                                   this.getData()
                                   this.get_good_peoperty_list();
                            }else{
                                 this.$Message.error(res.msg)
                            }
                        })
        },
        handleEdit(row){
                    localStorage.setItem('obj',JSON.stringify(row))
                    this.$router.push({
                                  name:'auditDetail',
                                  query: {   
                                          obj: row,
                                          show_img:row.img_url
                                        }
                              }) 
        },
         cellcb(row){
            if(row.row.checkStatus === 1&&row.columnIndex === 0){
                return "myCell"
            }
        },
        checkboxT(row,index){
             if(row.childen){
                    return 0
                }else {
                    return 1
                }
        },
        search() {
            this.visible = false;
            this.getData()
            this.get_good_peoperty_list()
        },
        handleReset() {
            this.page=1
            this.total=0
            // this.formSearch = {};
            for( let i in this.formSearch){
                this.formSearch[i]=''
            }
            this.label_list = [];
        },
        get_good_peoperty_list() {
             let    data={}
                    data.source_return_code=this.formSearch.source_return_code
                    data.return_code=this.formSearch.return_code
                    data.logistics_no=this.formSearch.logistics_no
                    data.order_status=this.formSearch.order_status?Number(this.formSearch.order_status):''
                    data.start_date=this.formSearch.date?filters.get_year_month_day(this.formSearch.date[0]):''
                    data.end_date=this.formSearch.date?filters.get_year_month_day(this.formSearch.date[1]):''
                    data.return_goods_status=this.formSearch.return_goods_status?Number(this.formSearch.return_goods_status):''
                    data.return_pay_status=this.formSearch.return_pay_status?Number(this.formSearch.return_pay_status):''
                    data.consigne=this.formSearch.consigne
            this.request('eom_get_status_count', {
                data: data
            }, true).then(res => {
                if (res.code == 1) {
                     
                    if(res.data.statusList){
                           for(let i=0,len=res.data.statusList.length;i<len;i++){
                                  res.data.statusList[i].title=res.data.statusList[i].detail_description+`${'('+res.data.statusList[i].total+')'}`
                                   res.data.statusList[i].expand=true
                                for(let j=0,len=res.data.statusList[i].children.length;j<len;j++){
                                      res.data.statusList[i].children[j].title= res.data.statusList[i].children[j].detail_description +`${'('+res.data.statusList[i].children[j].total+')'}`
                                       res.data.statusList[i].children[j].expand=true
                                      for(let h=0,len=res.data.statusList[i].children[j].children.length;h<len;h++){
                                           res.data.statusList[i].children[j].children[h].title= res.data.statusList[i].children[j].children[h].detail_description+`${'('+res.data.statusList[i].children[j].children[h].total+')'}`   
                                      }
                                }
                           }
                           setTimeout(()=>{
                                console.log(res.data.statusList,'9999999')
                                this.good_peoperty_list =res.data.statusList;
                           },200)
                          
                    }else{
                        this.good_peoperty_list=[]
                    }
                   
                }else{
                     this.$Message.error(res.msg)
                     this.good_peoperty_list=[]
                     this.leftTotal=''
                }
            })
        },
        choiced(selection){
                this.selectedArr=selection
               },
        examineCheck(){
            //  order_status=200 && return_goods_status=200  → 审核退货
            //  order_status=600 && return_pay_status =200 → 审核退款
                // let  goodIds =[]
                // let  monyIds=[]
                let ids =[]
          if(this.selectedArr.length==0){
              this.$Message.error('请选择要审核的数据')
          }else{
               if(this.selectedArr.length==1){
                       let id=this.selectedArr[0].id
                      let data={}
                          data.ids=[id]
                          this.subIDS[0]=id
                        this.request('eom_check_return_status_code', {
                            data: data
                        }, true).then(res => {
                            if(res.code == 1) {
                                   this.title="审核退货"
                                   this.examine=true
                            }else if(res.code == 2) {
                                   this.forceExamine=true
                            }else if(res.code == 3){
                                   this.title="审核退款"
                                   this.examine=true
                            }else{
                                   this.$Message.error('不能审核')
                            }
                        })   
                //   if(this.selectedArr[0].order_status==200||this.selectedArr[0].order_status==600){
                //              console.log('放行')
                //       }else{
                //             return this.$Message.error('所选择的数据，不在可审核的状态')
                //       }
               }else{
                //     for(let i=0,len=this.selectedArr.length;i<len;i++){
                //        for(let j=i+1;j<len;j++){
                //         if(this.selectedArr[i].order_status!=this.selectedArr[j].order_status){
                //                     return this.$Message.error('包含不同单据状态，不支持批量审核')
                //         }else{
                //             if(this.selectedArr[i].order_status==200||this.selectedArr[i].order_status==600){
                //             }else{
                //                     return this.$Message.error('所选择的数据，不在可审核的状态')
                //             }
                //         }
                //     }
                //  }
                      this.selectedArr.map(x=>{
                         ids.push(x.id)
                      })  
                      this.subIDS=ids
                     let data={}
                          data.ids=ids
                        this.request('eom_check_return_status_code', {
                            data: data
                        }, true).then(res => {
                            if(res.code == 1) {
                                   this.title="审核退货"
                                   this.examine=true
                            }else if(res.code == 2) {
                                   this.forceExamine=true
                            }else if(res.code == 3){
                                   this.title="审核退款"
                                   this.examine=true
                            }else{
                                   this.$Message.error('不能审核')
                            }
                        })   

               }
               
            //    this.selectedArr.map(x=>{
            //      if(x.order_status==200&&x.return_goods_status==200){  // 审核退货
            //          goodIds.push(x.id)
            //          this.title="审核退货"
            //      }
            //      if(x.order_status==600 && x.return_pay_status ==200){// 审核退款
            //          monyIds.push(x.id)
            //          this.title="审核退款" 
            //      }
            //    })
               //赋值阶段
            //    this.goodsIDS=goodIds
            //    this.moneyIDS=monyIds
            //    if(this.goodsIDS.length>0&& this.moneyIDS.length==0){
            //        this.title='审核退货'
            //        this.examine=true
            //    }else if(this.goodsIDS.length==0&& this.moneyIDS.length>0){
            //        this.title='审核退款'
            //        this.examine=true
            //    }else if(this.goodsIDS.length>0&&this.moneyIDS.length>0){
            //          return this.$Message.error('所选择的数据，不在可审核的状态')
            //    }
            //    this.examine=true
            //    console.log(ids)
          }
        },
        getRuturnList(return_code,index){
            let  data={}
                 data.return_code=return_code
        this.request('eom_get_return_detail_list', {
                   data: data
            }, true).then(res => {
                if (res.code == 1) {
                           this.expendArray=[]
                    for(let i=0,len=this.label_list.length;i<len;i++){
                        if(this.label_list[i].return_code==return_code){
                           this.label_list[i].tag=false
                           this.label_list[i].children=res.data
                           res.data.map(x=>{
                               this.expendArray.push(x.return_code)
                           }) 
                        }
                    }
                     console.log(this.expendArray,'9999999')   
                }else{
                    this.$Message.error(res.msg)
                }
            })
        },
        changeTable(row){
              console.log(row.index,'9999')
        },
        getNewList(return_code,index){
            console.log(index,'0000')
           this.getRuturnList(return_code,index)            
        },
        getData() {
            let data={}
                data.length = this.pageSize;
                data.start = (this.page - 1) * this.pageSize
                data.source_return_code=this.formSearch.source_return_code
                data.return_code=this.formSearch.return_code
                data.logistics_no=this.formSearch.logistics_no
                data.order_status=this.formSearch.order_status?Number(this.formSearch.order_status):''
                data.start_date=this.formSearch.date?filters.get_year_month_day(this.formSearch.date[0]):''
                data.end_date=this.formSearch.date?filters.get_year_month_day(this.formSearch.date[1]):''
                data.return_goods_status=this.formSearch.return_goods_status?Number(this.formSearch.return_goods_status):''
                data.return_pay_status=this.formSearch.return_pay_status?Number(this.formSearch.return_pay_status):''
                data.consigne=this.formSearch.consigne
            this.request('eom_get_return_list', {
                   data: data
            }, true).then(res => {
                if (res.code == 1) {
                    this.total=res.data.count
                    for(let i=0,len=res.data.eomReturnOrderList.length;i<len;i++){
                        res.data.eomReturnOrderList[i].tag=true;
                        res.data.eomReturnOrderList[i].index=i+1
                        // res.data.eomReturnOrderList[i].hasChildren=false
                        res.data.eomReturnOrderList[i].children=[]
                       
                    }
                    this.label_list = res.data.eomReturnOrderList;
                }
            })
        },
        selectTree(data) {
            console.log('0000', data)
            this.good_peoperty_list_row = data;
            this.visible = true;
            if (!!data && data.length > 0) {
                this.formSearch.order_status= data[0].order_status
                this.getData();
            } else {
                this.label_list = [];
            }
        },
        currentChange(currentRow, oldCurrentRow) {
            this.currentRow = currentRow;
        },
        openModal(title, params) {
            if (title == '导入') {
                this.importModal = true;
                return false;
            }
            if (title == '新增标签') {
                if (!this.good_peoperty_list_row.length > 0) {
                    this.$Message.warning('请先选择标签分类！')
                    return false;
                }
                this.submit_data = submit_data();
            } else {
                this.submit_data = Util.deepClone(params.row);
            }
            this.modal_title = title;
            this.$refs['submitForm'].resetFields();
            this.modal_visible = true;
        },
        cancel() {
            this.forceExamine = false
        },
        save(type) {
            let url = 'add_good_label';
            let data = Util.deepClone(this.submit_data);
            data.isDelete = data.isDelete == true ? 0 : 1;
            if (this.modal_title == '新增标签') {
                data.propertyCode = this.good_peoperty_list_row[0].propertyCode;
                data.propertyName = this.good_peoperty_list_row[0].propertyName;
                data.createUser = this.userInfo.userName;
            } else if (this.modal_title == '编辑标签') {
                url = 'edit_good_label';
                data = {};
                data.labelId = this.submit_data.labelId;
                data.labelCode = this.submit_data.labelCode;
                data.labelName = this.submit_data.labelName;
                data.propertyCode = this.submit_data.propertyCode;
                data.isDelete = this.submit_data.isDelete == true ? 0 : 1;
                data.lastUpdateUser = this.userInfo.userName;
            }

            this.$refs['submitForm'].validate((valid) => {
                if (valid) {
                    this.request(url, {
                        data: data
                    }, true).then(res => {
                        if (res.code == 1) {
                            this.$Message.success(res.msg);
                            if (type == '保存新增') {
                                // let oldLength = this.submit_data.labelCode.length;
                                // this.submit_data.labelCode = Number(this.submit_data.labelCode) + 1;
                                // let newLength = String(this.submit_data.labelCode).length;
                                // if(newLength < oldLength){
                                //     let gap = oldLength - newLength;
                                //     for(let i = 1;i<=gap;i++){
                                //         this.submit_data.labelCode = '0' + this.submit_data.labelCode;
                                //     }
                                // }
                                this.submit_data = submit_data();
                            } else {
                                this.modal_visible = false;
                            }

                            if (this.visible && this.good_peoperty_list_row.length > 0) {
                                this.getData({
                                    propertyCode: this.good_peoperty_list_row[0].propertyCode
                                });
                            } else {
                                this.search();
                            }
                        }
                    })
                }
            })
        },
        currentChange(page) {
            this.submitArray = []
            this.page = page
            this.getData()
        },
        sizeChange(pageSize) {

            this.pageSize = pageSize
            this.getData()
        },
    }
}
</script>

<style>
.el-table td,
.el-table th {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
}
  .el-checkbox__input {
  display: none
}
.el-checkbox__input {
    display:block
}
.ivu-tree-empty{
    padding-left: 20px;
}
</style>
