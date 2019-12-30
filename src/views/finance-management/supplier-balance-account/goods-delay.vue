<template>
    <div class="background-color-white exhibition" id="balance_account_supplier_list" >
             <Row>
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Col>
                <Form-item label="制单号：" :label-width='100'>
                    <Input style="width: 150px" size="small" v-model="formSearch.manuOrderCode"></Input>
                </Form-item>

                <Form-item label="创建时间:" :label-width="100">
                    <DatePicker type="daterange" size="small" v-model="formSearch.orderCreated"  placeholder="请选择创建时间" style="width: 180px">
                    </DatePicker>
                </Form-item>

                <Form-item label="延期:" :label-width="100">
                      <RadioGroup v-model="formSearch.isDelay">
                        <Radio label="是"></Radio>
                        <Radio label="否"></Radio>
                    </RadioGroup>
                </Form-item>
                  <Form-item label="品牌：" :label-width='100'>
                        <Select v-model="formSearch.brandId" size="small" style="width:150px">
                            <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                            </Option>
                        </Select>
                  </Form-item>
                </Col>
                <Col> 
                  <Form-item label="款号：" :label-width='100'>
                    <Input style="width: 150px" size="small" v-model="formSearch.goodsNo"></Input>
                   </Form-item>
                  <Form-item label="供应商：" :label-width='100'>
                        <Select v-model="formSearch.supplierCode" filterable clearable size="small" style="width:180px">
                              <Option v-for="item in supplierList" :value="item.supplierCode"
                                        :key="item.supplierCode">{{
                                    item.supplierName }}
                             </Option>
                        </Select>
                  </Form-item>
                  
                   <Form-item>
                    <Button type="primary" icon="ios-search" size="small" @click="search">查询</Button>
                    <Button type="warning" size="small" @click="reset">重置</Button>
                    <Button type="primary" size="small" @click="syncFromScm">同步</Button>
                    <Button type="primary" size="small" @click="downTemplate">下载模板</Button>
                    <Button type="primary" size="small" @click="importData">导入</Button>
                    <Button type="primary" size="small" @click="exportData">导出</Button>
                      </Form-item>
                </Col>
            </Form>
        </Row>
       <Row class-name="margin-top-10">
            <Col>
            <Table
                    ref="importDataTable"
                    size="small"
                    :loading="loading"
                    :columns="columns"
                    :data="list"
            >
            </Table>
            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total
                show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
            </Col>
        </Row>
          <Modal
                v-model="importModal"
                title="导入制单扣款">
                <div>
                    <Upload
                        ref="upload"
                        name="file"
                        :show-upload-list="false"
                        :before-upload="handleUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        type="drag"
                        action="/eop/bi/import_delay_order_charged"
                        :data="{userCode:userInfo.userAccount}"
                    >
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或将文件拖拽到此处</p>
                    </div>
                    </Upload>
                    <div v-if="file !== null">{{ file.name }}
                    <Button type="text"
                            :loading="loadingStatus">{{ loadingStatus ? '上传中...' : '' }}
                    </Button>
                    </div>
                </div>
                <div slot="footer">
                    <Button type="default" @click="cancel">取消</Button>
                    <Button type="primary" @click="importOrderSave">导入</Button>
                </div>
            </Modal>
    
    
       <Modal v-model="editModal" @on-cancel="editCancel"  :width="750" title="编辑">

            <Form :model="addForm" class="addForm" :label-width="100" ref="submit_data" :mask-closable="false" :rules="ruleValidate" inline label-position="right" >
                 
                  <Row >
                        <Col span="12">
                            <Form-item label="制单号：">
                                <Input  disabled  v-model="addForm.manuOrderCode"  style="width:150px" size="small"></Input>
                            </Form-item>
                        </Col>
                         <Col  span="12">
                            <Form-item label="款号：">
                                <Input disabled   v-model="addForm.goodsNo"  style="width:150px" size="small"></Input>
                            </Form-item>
                        </Col>
                        <Col span="12">
                            <Form-item label="合约货期：">
                                <DatePicker type="date" v-model="addForm.contractDate" placeholder="" style="width: 150px"></DatePicker>
                            </Form-item>
                        </Col>
                         <Col  span="12">
                           <Form-item label="到货日期：">
                                <DatePicker type="date" v-model="addForm.arrivalDate" placeholder="" style="width: 150px"></DatePicker>
                            </Form-item>
                        </Col>

                         <Col span="12">
                            <Form-item label="下单数量：">
                               <InputNumber  :min="1" v-model="addForm.totalQty" style="width: 150px"></InputNumber>
                            </Form-item>
                        </Col>
                         <Col  span="12">
                           <Form-item label="税后价：">
                               <InputNumber  v-model="addForm.afterTaxPrice" style="width: 150px"></InputNumber>
                            </Form-item>
                        </Col>
                         <Col  span="12">
                           <Form-item label="拍照样扣款：">
                               <InputNumber  v-model="addForm.photoCharged" style="width: 150px"></InputNumber>
                            </Form-item>
                        </Col>
                         <Col  span="12">
                           <Form-item label="金额调整：">
                               <InputNumber  v-model="addForm.adjustPrice" style="width: 150px"></InputNumber>
                            </Form-item>
                        </Col>

                         <Col  span="12">
                           <Form-item label="取消扣款：">
                               <InputNumber  v-model="addForm.cancelCharged" style="width: 150px"></InputNumber>
                            </Form-item>
                        </Col>
                        <Col  span="12">
                           <Form-item label="质量扣款：">
                               <InputNumber  v-model="addForm.qualityCharged" style="width: 150px"></InputNumber>
                            </Form-item>
                        </Col>
                        <Col  span="12">
                           <Form-item label="样衣扣款：">
                               <InputNumber  v-model="addForm.sampleCharged" style="width: 150px"></InputNumber>
                            </Form-item>
                        </Col>
                        <Col  span="12">
                           <Form-item label="后期扣款调整：">
                               <InputNumber  v-model="addForm.laterAdjust" style="width: 150px"></InputNumber>
                            </Form-item>
                        </Col>
                        <Col  span="24">
                           <Form-item label="裁剪后订单量：">
                               <InputNumber  v-model="addForm.afterCutOrder" style="width: 150px"></InputNumber>
                            </Form-item>
                        </Col>

                         <Col  span="24">
                           <Form-item label="备注：">
                               <Input v-model="addForm.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
                            </Form-item>
                        </Col>
                 </Row>
            </Form>
             <div slot="footer">
                    <Button type="default" @click="cancelAddDialog">取消</Button>
                    <Button type="primary" @click="save">保存</Button>
            </div>
       </Modal>
    
    </div>
</template>

<script>
    import Util from 'libs/util';
    import socket from 'libs/socket';
    export default {
        name: 'balance_account_goods_delay',
        desc: '大货延期',
        data() {
            return {
                formSearch: {
                   
                },
                importModal: false,
                editModal:false,
                loadingStatus: false,
                loading: false, //表格数据加载开关
                columns: [{
                    title: '序号',
                    key: 'serialNo',
                    align: 'center',
                    width: 60
                }, {
                    title: '制单号',
                    key: 'manuOrderCode',
                    align: 'center',
                    width: 150
                },{
                    title: '款号',
                    key: 'goodsNo',
                    align: 'center',
                    width: 100
                },
                {
                    title:'批次',
                    key:'batchNo',
                    align: 'center',
                    width: 60
                },
                {
                    title:'开发类型',
                    key:'exDevelopment',
                    align: 'center',
                    width: 150,
                    render: (h, params) => {
                        if(params.row.exDevelopment=='A'){
                            return h('span','外部开发')
                        }else if (params.row.exDevelopment=='B'){
                            return h('span','内部开发')
                        }
                    }
                },
                 {
                    title:'品牌',
                    key:'brandName',
                    align: 'center',
                    width: 150
                },
                {
                    title:'创建日期',
                    key:'orderCreated',
                    align: 'center',
                    width: 100
                },
                  {
                    title:'合约货期',
                    key:'contractDate',
                    align: 'center',
                    width: 100
                },
                  {
                    title:'公司',
                    key:'companyName',
                    align: 'center',
                    width: 180
                },
                {
                    title:'供应商简称',
                    key:'shortName',
                    align: 'center',
                    width: 100
                },
                  {
                    title:'供应商',
                    key:'supplierName',
                    align: 'center',
                    width: 180
                },
                 {
                    title:'下单数量',
                    key:'totalQty',
                    align: 'center',
                    width: 100
                },
                {
                    title:'裁剪后订单量',
                    key:'afterCutOrder',
                    align: 'center',
                    minWidth: 120
                },
                {
                    title:'到货日期',
                    key:'arrivalDate',
                    align: 'center',
                    width: 100
                },
                {
                    title:'延期天数',
                    key:'delayDays',
                    align: 'center',
                    width: 100
                },
                {
                    title:'税后价',
                    key:'afterTaxPrice',
                    align: 'center',
                    width: 100
                },
                 {
                    title:'下单总价',
                    key:'totalPrice',
                    align: 'center',
                    width: 100
                },
                {
                    title:'折扣',
                    key:'discount',
                    align: 'center',
                    width: 80
                },
                {
                    title:'大货延期',
                    key:'bigDelayPrice',
                    align: 'center',
                    width: 100
                },
                {
                    title:'拍照样扣款',
                    key:'photoCharged',
                    align: 'center',
                    width: 100
                },
                {
                    title:'金额调整',
                    key:'adjustPrice',
                    align: 'center',
                    width: 100
                },
                {
                    title:'取消扣款',
                    key:'cancelCharged',
                    align: 'center',
                    width: 100
                },
                {
                    title:'质量扣款',
                    key:'qualityCharged',
                    align: 'center',
                    width: 100
                },
                 {
                    title:'样衣扣款',
                    key:'sampleCharged',
                    align: 'center',
                    width: 100
                },
                {
                    title:'后期扣款调整',
                    key:'laterAdjust',
                    align: 'center',
                    width: 100
                },
                {
                    title:'扣款总额',
                    key:'totalCharged',
                    align: 'center',
                    width: 100
                },
                {
                    title:'备注',
                    key:'remark',
                    align: 'center',
                    width: 100
                },
                {
                    title:'是否延期',
                    key:'isDelay',
                    align: 'center',
                    width: 100
                },
                 {
                    title:'修改人',
                    key:'lastUpdateUser',
                    align: 'center',
                    width: 100
                },
                {
                    title:'修改时间',
                    key:'lastUpdated',
                    align: 'center',
                    width: 150
                },
                 {
                        title: '操作',
                        key: 'operate',
                        fixed:'right',
                        align: 'center',
                        width: 150,
                        render: (h, params) => {
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
                                            this.edit(params.row);
                                        }
                                    }
                                }, '编辑'),
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
                                                    this.request('delete_delay_order', {
                                                        data: {
                                                            id: params.row.id
                                                        }
                                                    }, true).then(res => {
                                                        if (res.code == 1) {
                                                            this.$Message.success(res.msg);
                                                            this.getData();
                                                        }
                                                    })
                                                },
                                                onCancel: () => {
                                                    this.$Message.warning('已取消删除');
                                                }
                                            })

                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    },
                ],
                list: [],
                file: null,
                page: 1,
                pageSize: 10,
                total: 0,
                userInfo:{},
                ruleValidate:{},
                addForm:{},
                brandList:[],
                supplierList:[]
            }
        },
        computed: {

        },
        mounted() {
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));    
            this.getData()
            this.getBrandList()
            this.getSupplierList()
        },
        methods: {
            search() {
                this.page =1;
                this.getData()
            },
            reset() {
                this.formSearch = {}
                this.search();
            },
            openModal() {
                this.modal_visible = true;
                this.addForm = addForm();
            },
            cancel() {
                this.importModal = false;
                this.file = null;
            },
            currentChange(val) {
                this.page = val;
                this.getData();
            },
            sizeChange(val) {
                this.pageSize = val;
                this.getData();
            },
            downTemplate() {
                window.location = ('/excel/制单扣款导入模板.xlsx');
            },
            importData() {
                this.importModal = true;
            },
            handleUpload(file) {
                if (!/\.xls$|.xlsx$/.test(file.name)) {
                    this.$Message.warning('文件类型不符,请重新选择文件');
                    return false
                } else {
                    this.file = file;
                    return false;
                }
            },
            uploadSuccess(res, file) {
                Vue.prototype.$loading.close();
                if (res.code == '1') {
                    this.loadingStatus = false;
                    this.file = null;
                    this.$Message.success(res.msg);
                    this.importModal = false;
                    this.search();
                } else {
                    this.loadingStatus = false;
                    this.$Message.error({
                        content: res.msg,
                        duration: 3
                    });
                }
            },
            uploadError(res, file) {
                this.$Message.error(res.msg + res.data);
            },
            importOrderSave() {
                this.loadingStatus = true;
                Vue.prototype.$loading('正在导入数据...');
                this.$refs.upload.post(this.file);
            },
            getData() {
                let data = Util.deepClone(this.formSearch);
                if (data.orderCreated&&data.orderCreated[0]) {
                    data.startDate = Util.dateFormat(data.orderCreated[0], 'yyyy-MM-dd')
                    data.endDate = Util.dateFormat(data.orderCreated[1], 'yyyy-MM-dd')
                }
                delete data.orderCreated
                data.length = this.pageSize;
                data.start = (this.page - 1) * this.pageSize;
                this.request('get_delay_order_list', {
                    data: data
                }, true).then((res) => {
                    let serialNoBegain = this.pageSize * (this.page - 1);
                    res.data.delayOrderList.map(x => {
                        serialNoBegain++;
                        x.serialNo = serialNoBegain;
                    })
                    this.total = res.data.count;
                    this.list = res.data.delayOrderList
                    console.log(res)
                })
            },
            edit(row){
                this.addForm={}
                this.addForm.id = row.id
                this.addForm.manuOrderCode = row.manuOrderCode
                this.addForm.goodsNo= row.goodsNo
                this.addForm.totalQty = row.totalQty
                this.addForm.afterTaxPrice = row.afterTaxPrice
                this.addForm.photoCharged = row.photoCharged
                this.addForm.adjustPrice = row.adjustPrice
                this.addForm.cancelCharged = row.cancelCharged
                this.addForm.qualityCharged = row.qualityCharged
                this.addForm.sampleCharged = row.sampleCharged
                this.addForm.laterAdjust = row.laterAdjust
                this.addForm.afterCutOrder = row.afterCutOrder
                this.addForm.contractDate = row.contractDate
                this.addForm.arrivalDate = row.arrivalDate
                this.addForm.remark = row.remark
                this.editModal = true
            },
            cancelAddDialog(){
                this.addForm={}
                this.editModal = false
            },
            save(){
                  let data = this.addForm
                  data.contractDate = Util.dateFormat(data.contractDate,'yyyy-MM-dd')
                  data.arrivalDate = Util.dateFormat(data.arrivalDate,'yyyy-MM-dd')
                  data.lastUpdateUser = this.userInfo.userName
                  this.request('edit_delay_order',{
                      data:data
                  },'正在保存...').then((res)=>{
                      if(res.code=='1'){
                            this.$Message.success(res.msg);
                            this.getData()
                            this.cancelAddDialog()
                      }else{

                      }
                  })
            },
            exportData(){
                 let data= Util.deepClone(this.formSearch)
                 if (data.orderCreated&&data.orderCreated[0]) {
                    data.startDate = Util.dateFormat(data.orderCreated[0], 'yyyy-MM-dd')
                    data.endDate = Util.dateFormat(data.orderCreated[1], 'yyyy-MM-dd')
                }
                 delete data.orderCreated
                 let query = Util.serialize(data)
                 let url = "/eop/bi/export_delay_order_list"
                 if(query&&query.length>0){
                     url = url+"?data="+encodeURI(JSON.stringify(data))
                 }else{
                      url = url+"?data="+encodeURI('{}')
                 }
                 window.open(url)
            },
             getBrandList() {
                this.request('bi_brand_list', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    data: {}
                }, false).then((res) => {
                    this.brandList = res.data;
                    this.brandList.unshift({
                        id:0,
                        brands:'所有品牌'
                    })
                    this.brandList = this.brandList.filter(x=>{
                        return x.id != '51594' && x.id != '51609'
                    })
                })
            },
            getSupplierList() {
                this.request('get_supplier_list', {}, false).then((res) => {
                    if (res.code == 1) {
                        this.supplierList = res.data
                    }
                })
            },
            syncFromScm(){
                 let data = Util.deepClone(this.formSearch)
                 let query={
                    userId:this.userInfo.userId,
                    type:'syn_scm_order',
                 }

                 if(data.manuOrderCode){
                    query.manuOrderCode = data.manuOrderCode
                 }
                 if (data.orderCreated&&data.orderCreated[0]) {
                    query.startDate = Util.dateFormat(data.orderCreated[0], 'yyyy-MM-dd')
                    query.endDate = Util.dateFormat(data.orderCreated[1], 'yyyy-MM-dd')
                 }
                 if(query.manuOrderCode||query.startDate){
                     socket(query)
                 }else{
                      this.$Message.warning('请先选择时间或单号');
                 }
            }
        }
    }
</script>

<style lang="css">
  
</style>
