<template>
    <div class="background-color-white exhibition" id="across_logistics">
        <Row>
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Col>
                    <Form-item label="品牌：" :label-width='50'>
                        <Select v-model="formSearch.brandId" style="width:150px" size="small">
                            <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="时间：" :label-width="80">
                        <DatePicker
                                type="datetime"
                                format="yyyy-MM-dd"
                                placeholder="开始日期"
                                style="width: 170px"
                                v-model="formSearch.startDate"
                                size="small"
                        >
                        </DatePicker>
                    </Form-item>
                    <span style="display: inline-block;line-height: 32px;height:32px;margin-right: 10px">
                        至
                    </span>
                    <Form-item label="" :label-width="1">
                        <DatePicker
                                type="datetime"
                                placeholder="结束日期"
                                format="yyyy-MM-dd"
                                style="width: 170px"
                                v-model="formSearch.endDate"
                                size="small"
                        >
                        </DatePicker>
                    </Form-item>
                    <Form-item label="运单号：" :label-width='80'>
                                <Input   v-model="formSearch.logisticsNo"  style="width:150px" size="small"  placeholder="请扫入运单号"></Input>
                    </Form-item>
                    <Form-item :label-width="1">
                        <Button type="primary" icon="ios-search" size="small" @click="search">查询</Button>
                        <Button type="warning" size="small" @click="reset">重置</Button>
                    </Form-item>
                </Col>
            </Form>
        </Row>
        <Row class="margin-bottom-10">
            <Button type="primary" @click="add">新增</Button>
            <Button type="primary" @click="exportData">导出</Button>
            <Button type="primary" @click="openReportPage">运单号校验</Button>
            <Button type="primary" @click="openSummaryPage">数据汇总</Button>
        </Row> 
        <Row>
            <Col class="margin-bottom-10">
                <Table :columns="columns" size="small" :data="list"></Table>
            </Col>
            <Col>
                <Page :total="total"  :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
            </Col>
        </Row>
        <div class="modal">
            <Modal
                    v-model="importModal"
                    title="批量导入">
                <div>
                    <Upload
                            ref="upload"
                            name="file"
                            :show-upload-list="false"
                            :before-upload="handleUpload"
                            :on-success="uploadSuccess"
                            :on-error="uploadError"
                            type="drag"
                            action="/eop/bi/import_cost_kyexpress"
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
                    <Button type="primary" @click="importData">导入</Button>
                </div>
            </Modal>
        </div>
         <Modal
        title="新增物流费用"
        v-model="addModal"
        width="650"
        :closable="false">
        <Form :model="addForm" class="addForm" :label-width="100" ref="submit_data" :mask-closable="false" :rules="ruleValidate" inline label-position="right" >
                    <Row style="margin-bottom:20px">
                             <Col>
                            <Form-item label="运单号：" prop="logistics_no">
                                <Input  ref="logisticsNoInput"  v-model="addForm.logistics_no" @on-enter="getDeliverOrderByLogisticsNo" style="width:250px" size="big" placeholder="请扫入运单号或手动输入运单号后回车"></Input>
                            </Form-item>
                             </Col>
                        <Col>
                            <Form-item label="时间：" prop='dateTime'>
                                <DatePicker
                                    type="datetime"
                                    placeholder="请选择时间"
                                    format="yyyy-MM-dd"
                                    style="width: 150px"
                                    v-model="addForm.dateTime"
                                    size="small"
                                >
                                </DatePicker>
                            </Form-item>
                            <Form-item label="品牌：" prop='brandId'>
                                <Select v-model="addForm.brandId" style="width:150px" size="small" @on-change='changeBrandModal'>
                                    <Option v-for="item in modalBrandList" :value="item.id" :key="item.id">{{ item.brands }}
                                    </Option>
                                </Select>
                            </Form-item>
                        </Col>
                        <Col>
                           <!-- <Form-item label="运单号：" prop="logistics_no">
                                <Input  ref="logisticsNoInput" :autofocus="isAutoFocus" v-model="addForm.logistics_no" @on-enter="getDeliverOrderByLogisticsNo" style="width:150px" size="small" placeholder="请输入运单号"></Input>
                            </Form-item>  -->
                           <Form-item label="供应商：" prop='supplierCode'>
                                <Select v-model="addForm.supplierCode" style="width:150px" size="small">
                                    <Option v-for="item in supplierList" :value="item.code" :key="item.code">{{ item.name }}
                                    </Option>
                                </Select>
                            </Form-item>
                              <Form-item label="货运方式：" prop='deliveryMethod'>
                                  <Input readonly v-model="addForm.deliveryMethod" style="width:150px" size="small"></Input>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="箱数：" prop="boxNumber">
                                <InputNumber ref="boxNumberInput" v-model="addForm.boxNumber" size="small" style="width:150px" placeholder="请输入箱数"></InputNumber>
                            </Form-item>
                               <Form-item label="区域：" prop='deliveryArea'>
                                  <Input readonly v-model="addForm.deliveryArea" style="width:150px" size="small"></Input>
                            </Form-item>
                    
                        </Col>
                        <Col>
                            <Form-item label="重量(kg)：" prop="weight">
                                <Input type="number" ref="weightInput" v-model="addForm.weight" size="small" @on-blur="get_delivery_area_freight" @on-enter="get_delivery_area_freight" style="width:150px" placeholder="请输入重量"></Input>
                            </Form-item>

                              <Form-item label="运费：" prop="freight">
                                <Input readonly="true" v-model="addForm.freight" size="small" style="width:150px;color:#c5c8ce" ></Input>
                            </Form-item>
                        </Col>
                    </Row>
                </Form>
                <div slot="footer">
                    <Button type="default" @click="cancelAddDialog">取消</Button>
                    <Button type="primary" @click="saveLogisticsData">保存</Button>
                </div>
    </Modal>
    </div>
</template>

<script>
    import Util from 'libs/util';

    function formSearch(){
        return {
            brandId:0,     //	品牌id	    number	
            endDate:'',     //	结束日期	string	格式：yyyy-mm-dd
            startDate:'',   //	开始日期	string	格式：yyyy-mm-dd
        }
    }

    function getAddForm(){
        return {
            dateTime: new Date(Util.cutDate(new Date(), 0)),
            boxNumber:1,
            weight:null,
            freight:null,
            deliveryArea:'',
            deliveryMethod:'',
            supplierName:'',
            supplierCode:''
        }
    }

    export default {
        name:'across_logistics',
        data(){
            return {
                formSearch:formSearch(),
                userInfo:{},
                pick_type:'',
                page:1,
                pageSize:10,
                total:0,
                file:null,
                importModal:false,
                addModal:false,
                loadingStatus:false,
                list:[],
                table_row_index:-1,
                brandList:[],
                modalBrandList:[],
                columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '时间',
                        key: 'dateTime',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '供应商',
                        key: 'supplierName',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '运单号',
                        key: 'logisticsNo',
                        align: 'center',
                        minWidth: 150
                    },
                     {
                        title: '区域',
                        key: 'deliveryArea',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title:'货运方式',
                        key:'deliveryMethod',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '箱数',
                        key: 'boxNumber',
                        align: 'center',
                        minWidth: 100,
                        // render: (h, params) => {
                        //     if (params.index == this.table_row_index) {
                        //         return h('Input', {
                        //             props: {
                        //                 type: 'text',
                        //                 value: this.list[params.index].boxNumber,
                        //                 size: 'small'
                        //             },
                        //             on: {
                        //                 'on-blur': (event) => {
                        //                     this.list[params.index].boxNumber = event.target.value;
                        //                 }
                        //             }
                        //         })
                        //     } else {
                        //         return h('span', params.row.boxNumber)
                        //     }
                        // }
                    },
                    {
                        title: '运费/元',
                        key: 'freight',
                        align: 'center',
                        minWidth: 100,
                    },
                    {
                        title: '重量/kg',
                        key: 'weight',
                        align: 'center',
                        minWidth: 80,
                        render: (h, params) => {
                            console.log(params.row)
                            if (params.index == this.table_row_index) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].weight,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            console.log(this.pick_type)
                                            this.request('get_delivery_area_freight',{
                                                weight:event.target.value,
                                                deliveryMethod:params.row.deliveryMethod,
                                                pickType:params.row.pickType,
                                                supplierName:params.row.supplierName,
                                                deliveryArea:params.row.deliveryArea
                                            },'正在计算运费...').then((res)=>{
                                                if(res.data.freight){
                                                    let data = this.list[params.index]
                                                    this.list[params.index].freight = Number(Number(res.data.freight));
                                                    if (data.supplierName == '跨越') {
                                                        data.freight = Number(data.freight) / 1.06
                                                    } else if (data.supplierName == '品骏') {
                                                        data.freight = Number(data.freight) / 1.09
                                                    }
                                                    data.freight = Number(data.freight).toFixed(2)
                                                }
                                            })
                                            this.list[params.index].weight = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.weight)
                            }
                        }
                    },
                    {
                        title: '创建人',
                        key: 'createUser',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '创建时间',
                        key: 'created',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            if (params.index == this.table_row_index) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].remark,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].remark = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.remark)
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        minWidth: 200,
                        render: (h, params) => {
                            if(params.row.serialNo=='合计'){
                                return h('div','')
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
                                            this.table_row_index = params.index;
                                        }
                                    }
                                }, '编辑'),
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
                                            let data = Util.deepClone(params.row);
                                            delete data._rowKey;
                                            delete data._index;
                                            delete data.serialNo;
                                            this.request('edit_cost_kyexpress',{
                                                data:data
                                            },true).then(res=>{
                                                if(res.code == 1){
                                                    this.$Message.success(res.msg);
                                                    this.getData();
                                                    this.table_row_index = -1;
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
                                    on: {
                                        click: () => {
                                            this.delete(params.row);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6;
                    }
                },
                addForm:getAddForm(),
                ruleValidate:{
                    dateTime: [
                        { required: true, type:'date', message: '请选择日期', trigger: 'change' }
                    ],
                    brandId: [
                        { required: true, type:'number', message: '请选择品牌', trigger: 'change' }
                    ],
                    logistics_no: [
                        { required: true, type:'string', message: '请输入运单号', trigger: 'change' }
                    ],
                    weight: [
                        { required: true, type:'string', message: '请输入重量', trigger: 'blur' }
                    ],
                    boxNumber: [
                        { required: true, type:'number', message: '请输入箱数', trigger: 'blur' }
                    ],
                },
                supplierList:[
                    {
                        code:'跨越',
                        name:'跨越'
                    },
                    {
                        code:'品骏',
                        name:'品骏'
                    }
                ]
            }
        },
        computed:{
            
        },
        mounted(){
            this.getBrandList();
            this.search();
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo')); 
            if(this.userInfo.userId == 621 || this.userInfo.userId == 600 || this.userInfo.userId == 42){
                let date = Util.dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss');
                if(date > '2019-06-12 23:59:59'){
                    this.$Notice.warning({
                        title: '提示',
                        desc: '沈阳跨越物流费（空运方式），已到VIP优惠价格截止日期，请前往EOP确认运费单价！',
                        duration:0                        
                    });
                }
                if(date > '2019-06-30 23:59:59'){
                    this.$Notice.warning({
                        title: '提示',
                        desc: '鄂州跨越物流费（空运方式），已到VIP优惠价格截止日期，请前往EOP确认运费单价！',
                        duration:0                        
                    });
                }
            }       
        },
        methods:{
            getBrandList() {
                this.request('bi_brand_list', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    data: {}
                }, false).then((res) => {
                    this.brandList = res.data;
                    this.modalBrandList = Util.deepClone(this.brandList)
                    this.brandList.unshift({
                        id:0,
                        brands:'所有品牌'
                    })
                    this.brandList = this.brandList.filter(x=>{
                        return x.id != '51594' && x.id != '51609'
                    })
                })
            },
            search(){
                this.page = 1;
                this.getData();
            },
            reset(){
                this.page = 1;
                this.formSearch = formSearch();
                this.getData();
            },
            getData(){
                let data = {};
                let formSearch = Util.deepClone(this.formSearch);
                if(!!formSearch.startDate){
                    formSearch.startDate = Util.dateFormat(formSearch.startDate,'yyyy-MM-dd');
                }
                if(!!formSearch.endDate){
                    formSearch.endDate = Util.dateFormat(formSearch.endDate,'yyyy-MM-dd');
                }
                if(this.formSearch.startDate > this.formSearch.endDate){
                    this.$Message.warning('日期选择有误，请重新选择！');
                    return false;
                }
                data.start = (this.page - 1) * this.pageSize;
                data.length = this.pageSize;
                formSearch.brandId == 0 ? formSearch.brandId = '' : formSearch.brandId = formSearch.brandId;        
                data = Object.assign(data,formSearch);
                this.request('get_cost_kyexpress',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.costKyexpressList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.list = res.data.costKyexpressList;
                        this.total = res.data.count;
                        let lastPage = Math.ceil(this.total / this.pageSize);
                        if(this.page == lastPage){
                            this.list.push({
                                serialNo:'合计',
                                boxNumber:res.data.totalBox,
                                freight:Number(res.data.totalFreight).toFixed(2),
                                weight:Number(res.data.totalWeight).toFixed(2)
                            })
                        }
                    }
                })
            },
            downTemplate(){
                window.location = ('/excel/跨越物流运费导入模板.xlsx')
            },
            openModal(){
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
                if (res.code == 1) {
                    this.loadingStatus = false;
                    this.file = null;
                    this.$Message.success({
                        content: res.msg,
                        duration: 3
                    });
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
                this.$Message.error(res.msg);
            },
            importData() {
                this.loadingStatus = true;
                this.$refs['upload'].post(this.file);
            },
            cancel(){
                this.importModal = false;
                this.file = null;
            },
            delete(row){
                this.$Modal.confirm({
                    title: '提示',
                    content: '该行将会删除，请确认！',
                    onOk: () => {
                        this.request('delete_cost_kyexpress',{
                            data:{
                                id:row.id,
                                lastUpdateUser:this.userInfo.userAccount
                            }
                        },true).then(res=>{
                            if(res.code == 1){
                                this.getData();
                                this.$Message.success(res.msg);
                            }
                        })
                    },
                    onCancel: () => {
                        this.$Message.warning('已取消删除');
                    }
                })
            },
            CurrentChange(val){
                this.page = val;
                this.getData();
            },
            SizeChange(val){
                this.pageSize = val;
                this.getData();
            },
            add(){
                this.addForm = getAddForm()
                this.addModal = true
                this.$nextTick(() => {
                this.$refs['logisticsNoInput'].focus()
               })
            },
            cancelAddDialog(){
               this.addModal = false
               this.addForm=getAddForm()
            },
            changeBrandModal(){
                if(this.addForm.brandId==51603||this.addForm.brandId==51596){
                    this.addForm.supplierCode = '品骏'
                    this.addForm.supplierName = '品骏'
                }else{
                    this.addForm.supplierCode = '跨越'
                    this.addForm.supplierName = '跨越'
                }
            },
            //输入物流单号后查询 出库单信息
            getDeliverOrderByLogisticsNo(){
                let logisticsNo = this.addForm.logistics_no
                this.addForm = getAddForm()
                this.addForm.logistics_no = logisticsNo
                this.request('getDeliverOrderByLogisticsNo',{
                    logisticsNo:this.addForm.logistics_no
                },'正在查询出库单信息...').then((res)=>{
                   if(res.errno==0){
                       let data = res.data
                       if(data.logistics_no){
                           this.pick_type = data.pick_type
                           this.addForm.deliveryArea=data.supplierArea
                           this.addForm.brandId = data.brandId
                           this.addForm.supplierCode = data.supplierName
                           this.addForm.supplierName = data.supplierName
                           this.addForm.boxNumber = data.boxNumber
                           this.addForm.dateTime = data.created
                           if(data.delivery_method==1){
                               this.addForm.deliveryMethod='汽运'
                           }else if(data.delivery_method==2){
                               this.addForm.deliveryMethod='空运'
                           }
                       }
                       this.$nextTick(() => {
                       this.$refs['weightInput'].focus()
                       })//光标定位到重量

                   }else{
                      this.$Message.warning(res.errmsg);
                   }
                })
            },
            //查询物流费用
            get_delivery_area_freight() {
                if (!this.addForm.logistics_no || !this.addForm.deliveryArea) {
                    return
                } else if (Number(this.addForm.weight) <= 0) {
                    this.$Message.warning('请输入正确的重量信息');
                    return
                }
                this.request('get_delivery_area_freight', {
                    pickType:this.pick_type,
                    weight: this.addForm.weight,
                    deliveryMethod: this.addForm.deliveryMethod,
                    supplierName: this.addForm.supplierName,
                    deliveryArea: this.addForm.deliveryArea,
                    dateTime: this.addForm.dateTime
                }, '正在计算运费...').then((res) => {
                    if (res.data && res.data.freight >= 0) {
                        this.addForm.freight = Number(Number(res.data.freight))
                        this.saveLogisticsData(); //自动提交保存
                    }
                })
            },
            saveLogisticsData() {
                let data = Util.deepClone(this.addForm);
                console.log(data)
                data.pickType = this.pick_type
                data.logisticsNo = data.logistics_no;
                delete data.logistics_no;
                data.createUser = this.userInfo.userAccount
                for (let brand of this.modalBrandList) {
                    if (data.brandId == brand.id) {
                        data.brandName = brand.brands
                        break;
                    }
                }
                data.dateTime = Util.dateFormat(data.dateTime, 'yyyy-MM-dd')

                if (data.supplierName == '跨越') {
                    data.freight = Number(data.freight) / 1.06
                } else if (data.supplierName == '品骏') {
                    data.freight = Number(data.freight) / 1.09
                }

                data.freight = Number(data.freight).toFixed(2)

                this.$refs["submit_data"].validate((valid) => {
                    if (valid) {
                        this.request('add_cost_kyexpress', {
                            data: data
                        }, '正在保存数据...').then((res) => {
                            if(res.code=='1'){
                               this.search()
                               this.cancelAddDialog()
                               this.add()
                            }else{
                                //this.$Message.warning(res.msg);
                            }
                        })
                    }else{
                       this.$Message.warning('请检查表单');
                    }
                })
            },
            exportData(){
                let data = Util.deepClone(this.formSearch);
                !!data.startDate?data.startDate = Util.dateFormat(this.formSearch.startDate,'yyyy-MM-dd'):data.startDate = '';
                !!data.endDate?data.endDate = Util.dateFormat(this.formSearch.endDate,'yyyy-MM-dd'):data.endDate = '';
                data.brandId == 0 ? data.brandId = '' : data.brandId = this.formSearch.brandId;
                this.request('export_across_logistics_data',data,true).then(res=>{
                    if(res.status=='success'){
                        this.$Message.success(res.message);
                        if(document.location.href.indexOf('localhost')>0||document.location.href.indexOf('127.0.0.1')>0){
                            window.open('http://127.0.0.1:8360'+res.data)
                        }else{
                            window.open(res.data)
                        }
                    }
                })
            },
            openReportPage(){
                 this.$router.push({
                 name: 'across_logistics_report',
                 params: {
                
                }
                });
            },
            openSummaryPage(){
                 this.$router.push({
                 name: 'across_logistics_summary',
                 params: {
                
                }
                });
            }
        }
    }
</script>


<style>

</style>
