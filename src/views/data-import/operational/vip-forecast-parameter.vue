<template>
    <div class="background-color-white exhibition" id="vip-forecast-parameter">
        <Row class="margin-bottom-10">
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Col>
                  <Form-item label="品牌：" :label-width='60'>
                        <Select v-model="formSearch.brandId" style="width:150px">
                            <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                            </Option>
                        </Select>
                 </Form-item>

                   <Form-item label="年月:" :label-width="70">
                        <DatePicker type="month" v-model="formSearch.startMonth" placeholder="请选择年月"
                                    style="width: 200px"></DatePicker>至
                                    <DatePicker type="month" v-model="formSearch.endMonth" placeholder="请选择年月"
                                    style="width: 200px"></DatePicker>
                    </Form-item>

                      <Form-item :label-width="10">
                    <Button type="primary" icon="ios-search"  @click="search">查询</Button>
                    <Button @click="reset">重置</Button>
            </Form-item>
                </Col>
            </Form>
        
        </Row>
        <Row>
            <Button  type="primary" @click="downTemplate">下载模板</Button>
            <Button  type="primary" @click="importData">导入</Button>
            <Button v-show="activeTable == 'hdcs'" type="primary" @click="addNew">新增</Button>
            
        </Row>
        <div v-show="activeTable == 'hdcs' || activeTable == 'cgcs' " style="min-width:350px;margin-top:-20px;padding-left:350px;color:red">注：1、唯品会税前收入=满减前销售额 *（1-唯品会参数扣点）*（1-拒退率）-满减金额*（1-拒退率）+满减金额*满减扣点 *（1-拒退率）
        2、满减扣点取值：满减活动参数扣点优先级大于满减常规参数扣点</div>
       <Row class-name="margin-top-10">
            <Tabs style="padding-bottom:200px" type="card" @on-click="tabClick" :value="activeTable">
                <TabPane label="唯品会参数" name="vipcs">
                    <Col class="margin-bottom-10">
                        <Table size="small" :loading="loading" :columns="columns" :data="list"></Table>
                    </Col>
                    <Col>
                        <Page :page-size-opts="[50,100,150,200]" style="margin-top:5px;z-index:1000" :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator
                        @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
                    </Col>
                </TabPane>
                <TabPane label="活动参数" name="hdcs">
                <Row>
                    <Col class="margin-bottom-10">
                        <Table size="small" :loading="loading" :columns="columns1" :data="list1"></Table>
                    </Col>
                    <Col>
                        <Page :page-size-opts="[50,100,150,200]" style="margin-top:5px;z-index:1000" :total="total1" :page-size="pageSize1" :current="page1" show-sizer show-total show-elevator
                        @on-change="CurrentChange1" @on-page-size-change="SizeChange1"></Page>
                    </Col>
                </Row>
                </TabPane>
                <TabPane label="常规参数" name="cgcs">
                <Row>
                    <Col class="margin-bottom-10">
                        <Table size="small" :loading="loading" :columns="columns2" :data="list2"></Table>
                    </Col>
                    <Col>
                        <Page :page-size-opts="[50,100,150,200]" style="margin-top:5px;z-index:1000" :total="total2" :page-size="pageSize2" :current="page2" show-sizer show-total show-elevator
                        @on-change="CurrentChange2" @on-page-size-change="SizeChange2"></Page>
                    </Col>
                </Row>
                </TabPane>
            </Tabs>
        </Row>
          <Modal
                v-model="VIPModal"
                title="VIP参数导入">
                <div>
                    <Upload
                        ref="upload"
                        name="file"
                        :show-upload-list="false"
                        :before-upload="handleUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        type="drag"
                        action="/eop-node/api/analysis/import_vip_forecast_parameter"
                        :data="{account:userInfo.userAccount}"
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
                    <Button type="default" @click="VIPcancel">取消</Button>
                    <Button type="primary" @click="VIPOrderSave">导入</Button>
                </div>
            </Modal>
            <Modal
                v-model="hdModal"
                title="活动参数导入">
                <div>
                    <Upload
                        ref="uploadhd"
                        name="file"
                        :show-upload-list="false"
                        :before-upload="handleUploadHd"
                        :on-success="uploadSuccessHd"
                        type="drag"
                        action="/eop/bi/import_vip_forecast_promotion"
                        :data="{userCode:userInfo.userName}"
                    >
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或将文件拖拽到此处</p>
                    </div>
                    </Upload>
                    <div v-if="filehd !== null">{{ filehd.name }}
                    <Button type="text"
                            :loading="loadingStatus">{{ loadingStatus ? '上传中...' : '' }}
                    </Button>
                    </div>
                </div>
                <div slot="footer">
                    <Button type="default" @click="hdcancel">取消</Button>
                    <Button type="primary" @click="hdOrderSave">导入</Button>
                </div>
            </Modal>
            <Modal
                v-model="cgModal"
                title="常规参数导入">
                <div>
                    <Upload
                        ref="uploadcg"
                        name="file"
                        :show-upload-list="false"
                        :before-upload="handleUploadCg"
                        :on-success="uploadSuccessCg"
                        type="drag"
                        action="/eop/bi/import_vip_forecast_subpoint"
                        :data="{userCode:userInfo.userName}"
                    >
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或将文件拖拽到此处</p>
                    </div>
                    </Upload>
                    <div v-if="filecg !== null">{{ filecg.name }}
                    <Button type="text"
                            :loading="loadingStatus">{{ loadingStatus ? '上传中...' : '' }}
                    </Button>
                    </div>
                </div>
                <div slot="footer">
                    <Button type="default" @click="cgcancel">取消</Button>
                    <Button type="primary" @click="cgOrderSave">导入</Button>
                </div>
            </Modal>
            <Modal title="新增" v-model="modalAdd" @on-cancel='cancelAdd' :footer-hide='true' :width="50" >
                    <Form :label-width="80">
                        <Form-item label="品牌：" :label-width='70'>
                            <Select v-model="formAdd.brandId" style="width:200px">
                                <Option v-for="item in brandList" :value="item" :key="item.id">{{ item.brands }}
                                </Option>
                            </Select>
                        </Form-item>
                        <Form-item label="活动时间:" :label-width="70">
                            <DatePicker type="date" :options="addStartDate" @on-change="startTimeChange" v-model="formAdd.startDate" placeholder="起始时间"
                                    style="width: 200px"></DatePicker>
                                    <span>至</span>
                            <DatePicker type="date" :options="addEndDate" @on-change="endTimeChange" v-model="formAdd.endDate" placeholder="结束时间"
                                    style="width: 200px"></DatePicker>
                        </Form-item>
                        <Form-item label="扣点:" :label-width="70">
                            <InputNumber v-model="formAdd.subBucklePoint" @on-blur="inputNumberBlur(formAdd.subBucklePoint)" style="width:200px" :max="1" :min="0" :step="0.01"></InputNumber>
                           <!-- <Input v-model="formAdd.subBucklePoint" style="width:200px" placeholder=""></Input>-->
                        </Form-item>
                        <Form-item label="拒退率:" :label-width="70">
                            <InputNumber v-model="formAdd.rejectionRate" @on-blur="inputNumberBlur(formAdd.rejectionRate)" style="width:200px" :max="1" :min="0" :step="0.01"></InputNumber>
                            <!--<Input v-model="formAdd.rejectionRate" style="width:200px" placeholder=""></Input>-->
                        </Form-item>
                        <Form-item label="备注:" :label-width="70">
                            <Input v-model="formAdd.remark" @on-blur="inputBlur(formAdd.remark)" type="textarea" style="width:420px" placeholder=""></Input>
                        </Form-item>
                        <Form-item :label-width="1" style="text-align:center">
                            <Button type="primary" @click="addSave">确定</Button>
                            <Button type="default" @click="addCancel">取消</Button>
                        </Form-item>
                    </Form>
            </Modal>

            <Modal title="编辑" v-model="modalChange" @on-cancel='cancelChange' :footer-hide='true' :width="50" >
                    <Form :label-width="80">
                        <Form-item label="品牌：" :label-width='70'>
                            <Select disabled v-model="formChange.brandName" style="width:200px">
                                <Option v-for="item in brandList" :value="item.brands" :key="item.id">{{ item.brands }}
                                </Option>
                            </Select>
                        </Form-item>
                        <Form-item label="活动时间:" :label-width="70">
                            <DatePicker type="date" disabled :options="pickerOptionsOuterStart" v-model="formChange.changeStartDate" placeholder="起始时间"
                                    style="width: 200px"></DatePicker>
                                    <span>至</span>
                            <DatePicker type="date" disabled :options="pickerOptionsOuterEnd" v-model="formChange.changeEndDate" placeholder="结束时间"
                                    style="width: 200px"></DatePicker>
                        </Form-item>
                        <Form-item label="扣点:" :label-width="70">
                            <InputNumber v-model="formChange.subBucklePoint" @on-blur="inputNumberBlur(formChange.subBucklePoint)" style="width:200px" :max="1" :min="0" :step="0.01"></InputNumber>
                        </Form-item>
                        <Form-item label="拒退率:" :label-width="70">
                            <InputNumber v-model="formChange.rejectionRate" @on-blur="inputNumberBlur(formChange.rejectionRate)" style="width:200px" :max="1" :min="0" :step="0.01"></InputNumber>
                        </Form-item>
                        <Form-item label="备注:" :label-width="70">
                            <Input v-model="formChange.remark"  @on-blur="inputBlur(formChange.remark)" type="textarea" style="width:420px" placeholder=""></Input>
                        </Form-item>
                        <Form-item :label-width="1" style="text-align:center">
                            <Button type="primary" @click="editSave">确定</Button>
                            <Button type="default" @click="editCancel">取消</Button>
                        </Form-item>
                    </Form>
            </Modal>
    </div>
</template>

<script>
    import Util from 'libs/util';
    export default {
        name: 'vip_forecast_parameter',
        desc: 'VIP参数维护',
        data() {
            return {
                // addStartDate:{
                //     disabledDate (date) {
                //         return date && date.valueOf() < Date.now() - 86400000;
                //     }
                // },
                // addEndDate:{
                //     disabledDate (date) {
                //         return date && date.valueOf() < Date.now() - 86400000;
                //     }
                // },
                formAdd:{
                    rejectionRate:null,
                    subBucklePoint:null,
                },
                formChange:{},
                modalAdd:false,//新增
                modalChange:false,//编辑
                activeTable:"vipcs",
                tabsName:'vipcs',//判断新增按钮
                formSearch: {
                    startMonth:'',
                    endMonth:'',
                    brandId:'',
                },
                brandList: [],
                importModal: false,
                loadingStatus: false,
                loading: false, //表格数据加载开关
                columns: [{
                    title: '序号',
                    type: 'index',
                    align: 'center',
                    minWidth: 60
                }, {
                    title: '品牌',
                    key: 'brandName',
                    align: 'center',
                    minWidth: 100
                },{
                    title: '年份',
                    key: 'year',
                    align: 'center',
                    minWidth: 100
                },{
                    title: '月份',
                    key: 'month',
                    align: 'center',
                    minWidth: 100
                },{
                    title: '扣点',
                    key: 'bucklePoint',
                    align: 'center',
                    minWidth: 100
                },{
                    title:'拒退率',
                    key:'rejectionRate',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title:'创建人',
                    key:'createUser',
                    align: 'center',
                    minWidth: 100
                },
                  {
                    title:'创建时间',
                    key:'created',
                    align: 'center',
                    minWidth: 150
                },
                {
                    title:'最后更新人',
                    key:'lastUpdateUser',
                    align: 'center',
                    minWidth: 100
                },
                  {
                    title:'最后更新时间',
                    key:'lastUpdated',
                    align: 'center',
                    minWidth: 150
                },
                ],
                columns1: [{
                    title: '序号',
                    type: 'index',
                    align: 'center',
                    width: 60
                }, {
                    title: '品牌',
                    key: 'brandName',
                    align: 'center',
                    minWidth: 100
                },{
                    title: '起始时间',
                    key: 'startDate',
                    align: 'center',
                    minWidth: 150
                },{
                    title: '结束时间',
                    key: 'endDate',
                    align: 'center',
                    minWidth: 150
                },{
                    title: '扣点',
                    key: 'subBucklePoint',
                    align: 'center',
                    minWidth: 100
                },{
                    title:'拒退率',
                    key:'rejectionRate',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title:'备注',
                    key:'remark',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title:'创建人',
                    key:'createUser',
                    align: 'center',
                    minWidth: 100
                },
                  {
                    title:'创建时间',
                    key:'created',
                    align: 'center',
                    minWidth: 150
                },
                {
                    title:'最后更新人',
                    key:'lastUpdateUser',
                    align: 'center',
                    minWidth: 100
                },
                  {
                    title:'最后更新时间',
                    key:'lastUpdated',
                    align: 'center',
                    minWidth: 150
                },
                {
                        title: '操作',
                        key: 'operate',
                        minWidth: 180,
                        fixed: 'right',
                        align: 'center',
                         render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        width:'60px'
                                        
                                    },
                                    on: {
                                        click: (e) => {
                                            this.handleChange(params.row)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        width:'60px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '该行将会删除，请确认！',
                                                onOk: () => {
                                                     this.tableDelete(params.row);
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
                    }
                ],
                columns2: [{
                    title: '序号',
                    type: 'index',
                    align: 'center',
                    minWidth: 60
                }, {
                    title: '品牌',
                    key: 'brandName',
                    align: 'center',
                    minWidth: 100
                },{
                    title: '年份',
                    key: 'year',
                    align: 'center',
                    minWidth: 100
                },{
                    title: '月份',
                    key: 'month',
                    align: 'center',
                    minWidth: 100
                },{
                    title: '扣点',
                    key: 'subBucklePoint',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title:'创建人',
                    key:'createUser',
                    align: 'center',
                    minWidth: 100
                },
                  {
                    title:'创建时间',
                    key:'created',
                    align: 'center',
                    minWidth: 150
                },
                {
                    title:'最后更新人',
                    key:'lastUpdateUser',
                    align: 'center',
                    minWidth: 100
                },
                  {
                    title:'最后更新时间',
                    key:'lastUpdated',
                    align: 'center',
                    minWidth: 150
                },
                ],
                list: [],
                list1: [],
                list2: [],
                file: null,
                filehd: null,
                filecg: null,
                page: 1,
                pageSize: 50,
                total: 0,
                page1: 1,
                pageSize1: 50,
                total1: 0,
                page2: 1,
                pageSize2: 50,
                total2: 0,
                VIPModal:false,
                hdModal:false,
                cgModal:false,
            }
        },
        computed: {

        },
        mounted() {
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));        
            this.getBrandList()
            this.getData()
        },
        methods: {
            inputNumberBlur(i){
                if(i.toString().length>4){
                    this.$Message.warning('请输入两位小数以内的数字')
                }
                console.log(i.toString().length)
            },
            inputBlur(i){
                if(i.length>100){
                    this.$Message.warning('最大限制长度为100个字符')
                }
            },
            startTimeChange: function(e) { //设置开始时间
            console.log(e)
        this.formAdd.startDate = e;
        this.addEndDate = {
          disabledDate: date => {
            return date.valueOf() < new Date(e).valueOf() - 86400000;
          }
        }
      },
      endTimeChange: function(e) { //设置结束时间
        this.formAdd.endDate = e;
        this.addStartDate = {
          disabledDate(date) {
            return date.valueOf() > new Date(e).valueOf()
            //  || date.valueOf() < Date.now() - 86400000
          }
        }
      },
            addNew(){
                this.formAdd = {}
                this.formAdd.rejectionRate = null,
                this.formAdd.subBucklePoint = null,
                this.modalAdd = true
            },
            handleChange(row){
                console.log(row,'11`1`11`1`1')
                this.formChange.rowId = row.id
                this.formChange.brandName = row.brandName
                this.formChange.changeStartDate = row.startDate
                this.formChange.changeEndDate = row.endDate
                this.formChange.subBucklePoint = row.subBucklePoint
                this.formChange.rejectionRate = row.rejectionRate
                this.formChange.remark = row.remark
                this.modalChange = true
            },
            tabClick(val){
                this.activeTable = val
                if(this.activeTable == 'vipcs'){
                    this.formSearch = {}  
                    this.getData();
                }else if(this.activeTable == 'hdcs'){ //活动参数 
                    this.formSearch = {}              
                    this.getHdData();
                }else{          //常规参数
                    this.formSearch = {}            
                    this.getCgData();  
                }
            },
            search() {
                if(this.activeTable == 'vipcs'){
                    this.getData()
                }else if(this.activeTable == 'hdcs'){
                    this.getHdData();
                }else{
                    this.getCgData(); 
                }
            },
            getBrandList() {
                this.request('bi_brand_list', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    data: {}
                }, false).then((res) => {
                    this.brandList = res.data;
                    this.brandList = this.brandList.filter(x => {
                        return x.id != '51594' && x.id != '51609'
                    })
                    this.modalBrandList = Util.deepClone(this.brandList);
                    // this.brandList.unshift({
                    //     id: 0,
                    //     brands: '所有品牌'
                    // })
                })
            },
            reset() {
                this.formSearch.startMonth = ''
                this.formSearch.endMonth = ''
                this.formSearch.brandId = ''
                this.search();
            },
            openModal() {
                this.modal_visible = true;
                this.addForm = addForm();
            },
            VIPcancel() {
                this.VIPModal = false;
                this.file = null;
            },
            hdcancel() {
                this.hdModal = false;
                this.filehd = null;
            },
            cgcancel() {
                this.cgModal = false;
                this.filecg = null;
            },
            downTemplate() {
                if(this.activeTable == 'vipcs'){
                    window.location = ('/excel/唯品会参数导入模板.xlsx');
                }else if(this.activeTable == 'hdcs'){
                    window.location = ('/excel/活动参数导入模板.xlsx');
                }else{
                    window.location = ('/excel/常规参数导入模板.xlsx');
                }
            },
            importData() {
                if(this.activeTable == 'vipcs'){
                   this.VIPModal = true;
                }else if(this.activeTable == 'hdcs'){
                   this.hdModal = true;
                }else{
                    this.cgModal = true;
                }
            },
            // VIP导入
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
                if (res.status == 'success') {
                    this.loadingStatus = false;
                    this.file = null;
                    this.$Message.success(res.message);
                    this.VIPModal = false;
                    this.search();
                } else {
                    this.loadingStatus = false;
                    this.$Message.error({
                        content: res.message,
                        duration: 3
                    });
                }
            },
            uploadError(res, file) {
                this.$Message.error(res.msg + res.data);
            },
            VIPOrderSave() {
                if(this.file == null){
                    this.$Message.warning('请先上传文件！')
                }else{
                    this.loadingStatus = true;
                    Vue.prototype.$loading('正在导入数据...');
                    this.$refs.upload.post(this.file);
                }
            },
            //活动参数导入
            handleUploadHd(file) {
                if (!/\.xls$|.xlsx$/.test(file.name)) {
                    this.$Message.warning('文件类型不符,请重新选择文件');
                    return false
                } else {
                    this.filehd = file;
                    return false;
                }
            },
            uploadSuccessHd(res, file) {
                console.log(res.code,'zhanzhanzhan')
                Vue.prototype.$loading.close();
                if (res.code == '1') {
                    console.log('hzgjashdhjadsjkj')
                    this.loadingStatus = false;
                    this.filehd = null;
                    this.$Message.success(res.msg);
                    this.hdModal = false;
                    this.getHdData();
                } else {
                    this.loadingStatus = false;
                    this.$Message.error(res.msg);
                }
            },
            hdOrderSave() {
                if(this.filehd == null){
                    this.$Message.warning('请先上传文件！')
                }else{
                    this.loadingStatus = true;
                    Vue.prototype.$loading('正在导入数据...');
                    this.$refs.uploadhd.post(this.filehd);
                } 
            },
            //常规参数导入
            handleUploadCg(file) {
                if (!/\.xls$|.xlsx$/.test(file.name)) {
                    this.$Message.warning('文件类型不符,请重新选择文件');
                    return false
                } else {
                    this.filecg = file;
                    return false;
                }
            },
            uploadSuccessCg(res, file) {
                console.log(res,'1111')
                Vue.prototype.$loading.close();
                if (res.code == '1') {
                    this.loadingStatus = false;
                    this.filecg = null;
                    this.$Message.success(res.msg);
                    this.cgModal = false;
                    this.getCgData();
                } else {
                    this.loadingStatus = false;
                    this.$Message.error(res.msg);
                }
            },
            cgOrderSave() {
                if(this.filecg == null){
                    this.$Message.warning('请先上传文件！')
                }else{
                    this.loadingStatus = true;
                    Vue.prototype.$loading('正在导入数据...');
                    this.$refs.uploadcg.post(this.filecg);
                }
            },
            //新增保存
            addSave(){
                if(this.formAdd.brandId == undefined){
                    this.$Message.warning('请先选择品牌')
                }else if(this.formAdd.startDate == undefined || this.formAdd.endDate == undefined){
                    this.$Message.warning('请先选择活动日期')
                }else if(this.formAdd.rejectionRate == undefined && this.formAdd.subBucklePoint == undefined){
                    this.$Message.warning('扣点与拒退率必填一项')
                }else{
                    let data = {}
                    data.rejectionRate = this.formAdd.rejectionRate //拒退率
                    data.subBucklePoint = this.formAdd.subBucklePoint //扣点
                    data.remark = this.formAdd.remark//备注
                    data.brandId = this.formAdd.brandId.id //品牌id
                    data.brandName = this.formAdd.brandId.brands //品牌
                    data.startDate = Util.dateFormat(this.formAdd.startDate,'yyyy-MM-dd')
                    data.endDate= Util.dateFormat(this.formAdd.endDate,'yyyy-MM-dd')
                    data.createUser = this.userInfo.userName
                    this.request('add_vip_forecast_promotion', {data}, false).then((res) => {
                        if(res.code==1){
                            this.$Message.success('新增活动参数成功')
                            this.modalAdd = false
                            this.getHdData()
                            this.addStartDate = {}
                            this.addEndDate = {}
                        }
                    })
                }
            },
            //新增取消
            addCancel(){
                this.modalAdd = false
                this.formAdd = {}
                this.formAdd.rejectionRate = null
                this.formAdd.subBucklePoint = null
            },
            //编辑保存
            editSave(){
                if(this.formChange.rejectionRate == null && this.formChange.subBucklePoint == null){
                    this.$Message.warning('扣点与拒退率必填一项')
                }else{
                    let data = {}
                    data.lastUpdateUser = this.userInfo.userName
                    data.subBucklePoint = this.formChange.subBucklePoint
                    data.rejectionRate = this.formChange.rejectionRate
                    data.remark = this.formChange.remark
                    data.id = this.formChange.rowId
                    this.request('edit_vip_forecast_promotion', {data}, false).then((res) => {
                        if(res.code==1){
                            this.$Message.success('修改活动参数成功')
                            this.modalChange = false
                            this.getHdData()
                        }
                    })
                }
            },
            //取消编辑
            editCancel(){
                this.formChange = {}
                this.modalChange = false
            },
            //删除
            tableDelete(row){
                console.log(row,'zhanzhan')
                let data = {}
                data.id = row.id
                data.lastUpdateUser = this.userInfo.userName
                this.request('delete_vip_forecast_promotion', {data}, false).then((res) => {
                        if(res.code==1){
                            this.$Message.success('删除活动参数成功')
                            this.getHdData()
                        }
                    })
            },
            getData() {
                if(this.formSearch.endMonth !== '' && this.formSearch.startMonth == ''){
                    this.$Message.warning('日期选择有误，请重新选择！');
                }else if(this.formSearch.endMonth == '' && this.formSearch.startMonth !== ''){
                    this.$Message.warning('日期选择有误，请重新选择！');
                }else if(this.formSearch.startMonth > this.formSearch.endMonth){
                    this.$Message.warning('日期选择有误，请重新选择！');
                }else{
                    let data = {}
                    data.brandId = this.formSearch.brandId
                    this.formSearch.startMonth ? data.startMonth = Util.dateFormat(this.formSearch.startMonth,'yyyy-MM') : ''
                    this.formSearch.endMonth ? data.endMonth = Util.dateFormat(this.formSearch.endMonth,'yyyy-MM') : '';
                    data.length = this.pageSize
                    data.start = (this.page - 1)*this.pageSize
                    this.request('get_vip_forecast_parameter_list', {data}, true).then(res => {
                        if (res.code==1) {
                            this.total = res.data.count;
                            this.list = res.data.parameterList;
                        }
                    })
                }
                // if(this.formSearch.startMonth > this.formSearch.endMonth){
                //     this.$Message.warning('日期选择有误，请重新选择！');
                //     return false;
                // }else{
                //     let data = {}
                // data.brandId = this.formSearch.brandId
                // this.formSearch.startMonth ? data.startMonth = Util.dateFormat(this.formSearch.startMonth,'yyyy-MM') : ''
                // this.formSearch.endMonth ? data.endMonth = Util.dateFormat(this.formSearch.endMonth,'yyyy-MM') : '';
                // // data.endMonth = this.formSearch.endMonth
                // data.length = this.pageSize
                // data.start = this.page - 1
                // this.request('get_vip_forecast_parameter_list', {data}, true).then(res => {
                //     if (res.code==1) {
                //         this.total = res.data.count;
                //         this.list = res.data.parameterList;
                //     }
                // })
                // }
            },
            //查询活动参数列表
            getHdData(){
                if(this.formSearch.endMonth !== '' && this.formSearch.startMonth == ''){
                    this.$Message.warning('日期选择有误，请重新选择！');
                }else if(this.formSearch.endMonth == '' && this.formSearch.startMonth !== ''){
                    this.$Message.warning('日期选择有误，请重新选择！');
                }else if(this.formSearch.startMonth > this.formSearch.endMonth){
                    this.$Message.warning('日期选择有误，请重新选择！');
                    return false;
                }else{
                    let data = {}
                data.brandId = this.formSearch.brandId
                this.formSearch.startMonth ? data.startMonth = Util.dateFormat(this.formSearch.startMonth,'yyyy-MM') : ''
                this.formSearch.endMonth ? data.endMonth = Util.dateFormat(this.formSearch.endMonth,'yyyy-MM') : '';
                data.length = this.pageSize1
                data.start = (this.page1 - 1)*this.pageSize1
                this.request('get_vip_forecast_promotion_list', {data}, false).then((res) => {
                    if(res.code==1){
                        this.list1 = res.data.promotionList
                        this.total1 = res.data.count
                    }
                })
                }

                // public static String parseTime(String datdString) {
                // datdString = datdString.replace("GMT", "").replaceAll("\\(.*\\)", "");
                // //将字符串转化为date类型，格式2016-10-12
                // SimpleDateFormat format = new SimpleDateFormat("EEE MMM dd yyyy HH:mm:ss z", Locale.ENGLISH);
                // Date dateTrans = null;
                // try {
                //     dateTrans = format.parse(datdString);
                //     return new SimpleDateFormat("yyyy-MM").format(dateTrans).replace("-","/");
                // } catch (ParseException e) {
                //     e.printStackTrace();
                // }
                // return datdString;

            },
            //查询常规参数列表
            getCgData(){
                 if(this.formSearch.endMonth !== '' && this.formSearch.startMonth == ''){
                    this.$Message.warning('日期选择有误，请重新选择！');
                }else if(this.formSearch.endMonth == '' && this.formSearch.startMonth !== ''){
                    this.$Message.warning('日期选择有误，请重新选择！');
                }else if(this.formSearch.startMonth > this.formSearch.endMonth){
                    this.$Message.warning('日期选择有误，请重新选择！');
                    return false;
                }else{
                    let data = {}
                data.brandId = this.formSearch.brandId  
                this.formSearch.startMonth ? data.startMonth = Util.dateFormat(this.formSearch.startMonth,'yyyy-MM') : ''
                this.formSearch.endMonth ? data.endMonth = Util.dateFormat(this.formSearch.endMonth,'yyyy-MM') : '';
                data.length = this.pageSize2
                data.start = (this.page2 - 1)*this.pageSize2
                this.request('get_vip_forecast_subpoint_list', {data}, false).then((res) => {
                    if(res.code==1){
                        this.list2 = res.data.subPointList
                        this.total2 = res.data.count
                    }
                })
                }
            },
            SizeChange(val) {
                this.pageSize = val;
                this.getData();
            },
            CurrentChange(val) {
                this.page = val;
                this.getData();
            },
             SizeChange1(val) {
                this.pageSize1 = val;
                this.getHdData();
            },
            CurrentChange1(val) {
                this.page1 = val;
                this.getHdData();
            },
             SizeChange2(val) {
                this.pageSize2 = val;
                this.getCgData();
            },
            CurrentChange2(val) {
                this.page2 = val;
                this.getCgData();
            },
        }
    }
</script>

<style lang="css">
  
</style>
