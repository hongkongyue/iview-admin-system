<template>
<div>
    <Row class="margin-bottom-10 background-color-white exhibition">
        <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="80" inline label-position="right" style="100px">
            <Col span="24" style="padding-left:7px">
            <Form-item label="品牌:" :label-width="50">
                <Select v-model="formSearch.brand" filterable style="width:150px">
                    <Option v-for="item in brandList" :value="item.brandName" :key="item.brandId">{{ item.brandName }}</Option>
                </Select>
            </Form-item>
            <Form-item label="年份:">
                <DatePicker v-model="formSearch.year" type="year" placeholder="" style="width: 150px"></DatePicker>
            </Form-item>
            <Form-item label="季节:">
                <Select v-model="formSearch.season" filterable style="width:120px">
                    <Option v-for="item in seasonList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                </Select>
            </Form-item>
            <Form-item label="活动时间:">
                <el-date-picker size="small" v-model="formSearch.time" format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
                <!-- <DatePicker v-model="formSearch.time" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="" style="width: 250px"></DatePicker> -->
            </Form-item>
            <Form-item :label-width="1">
                <Button type="primary" @click="search">查询</Button>
                <Button type="default" @click="handleReset">重置</Button>
                <Button type="primary" @click="newAdd">新增</Button>
                <Button type="primary" @click="downLoad">下载明细模板</Button>
            </Form-item>
            </Col>
        </Form>

    </Row>
    <!-- 数据列表 -->
    <Row class="background-color-white exhibition">
        <Table :columns="columns" size="small" highlight-row :data="list" @on-row-dblclick="edit"></Table>
        <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
    </Row>
    <el-dialog :visible="visible" :append-to-body="true" title="新增" @close="cancel" width="500">
        <Row class="margin-bottom-10 background-color-white exhibition">
            <Form :model="formAdd" :rules="ruleValidate" @keydown.native.enter.prevent="search" ref="formAdd" :label-width="120" inline label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="品牌:" :label-width="120" prop="brand">
                    <Select v-model="formAdd.brand" filterable style="width:180px">
                        <Option v-for="item in brandList" :value="item" :key="item.brandId">{{ item.brandName }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="年份:" prop="year">
                    <DatePicker v-model="formAdd.year" format="yyyy" type="year" placeholder="" style="width: 180px"></DatePicker>
                </Form-item>
                <Form-item label="季节:" :label-width="120" prop="season">
                    <Select v-model="formAdd.season" filterable style="width:180px">
                        <Option v-for="item in seasonList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="平台:" :label-width="120" prop="planform">
                    <Select v-model="formAdd.planform" filterable style="width:180px">
                        <Option v-for="item in palnformList" :value="item" :key="item.PLATFROM_NAME">{{ item.PLATFROM_NAME }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="活动名称:" prop="name">
                    <Input v-model="formAdd.name" placeholder="" style="width: 180px"></Input>
                </Form-item>
                <Form-item style="z-index:100" label="活动时间:" prop="time">
                    <!-- <DatePicker v-model="formAdd.time" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="" style="width: 250px"></DatePicker> -->
                    <el-date-picker style="z-index:200" size="small" v-model="formAdd.time" format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </Form-item>
                <Form-item label="总预估单量/单:" prop="dan">
                    <Input v-model="formAdd.dan" placeholder="" style="width: 180px"></Input>
                    <!-- <Input size="small" v-model="formAdd.dan" maxlength="8" oninput="value=value.replace(/[^\d]/g,'')" style="width:180px"></Input> -->
                </Form-item>
                <Form-item label="总预估销量/件:" prop="jian">
                    <Input v-model="formAdd.jian" placeholder="" style="width: 180px"></Input>
                </Form-item>
                <div style="margin-left:30px">
                    <span style="color:red">*</span>
                    <span>上传活动明细:</span>
                    <!-- <Form-item label="上传活动明细:" prop="upload"> -->
                    <Button style="margin-left:10px" type="default" @click="chosesUpload">选择文件</Button> {{fileName.length>0?fileName:'未选择任何文件'}}
                    <p style="color:red">备注：若导入文件中出现款号重复，系统自动去重</p>
                    <!-- </Form-item> -->
                </div>
                </Col>
            </Form>
            <div style="text-align:center;float:right">
                <Button :disabled="saveDisabled" type="primary" @click="save">确认</Button>
                <Button type="default" @click="cancel">取消</Button>
            </div>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
    
  </span> -->
        </Row>
    </el-dialog>
    <el-dialog :visible="visibleChange" :append-to-body="true" title="编辑" @close="cancelChange" width="500">
        <Row class="margin-bottom-10 background-color-white exhibition">
            <Form :model="formChange" @keydown.native.enter.prevent="search" ref="formChange" :label-width="120" inline label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="品牌:" :label-width="120">
                    <Select v-model="formChange.brand" disabled filterable @on-change="changebrand(formChange.brand)" style="width:180px">
                        <Option v-for="item in brandList" :value="item.brandName" :key="item.brandName">{{ item.brandName }}</Option>
                    </Select>
                    <span style="color:red;margin-left:10px">*</span>
                </Form-item>
                <Form-item label="年份:">
                    <DatePicker v-model="formChange.year" format="yyyy" type="year" placeholder="" style="width: 180px"></DatePicker>
                    <span style="color:red;margin-left:10px">*</span>
                </Form-item>
                <Form-item label="季节:" :label-width="120">
                    <Select v-model="formChange.season" filterable style="width:180px">
                        <Option v-for="item in seasonList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                    </Select>
                    <span style="color:red;margin-left:10px">*</span>
                </Form-item>
                <Form-item label="平台:" :label-width="120">
                    <Select v-model="formChange.planform" filterable @on-change="changeplanform(formChange.planform)" style="width:180px">
                        <Option v-for="item in palnformList" :value="item.PLATFROM_NAME" :key="item.PLATFROM_NAME">{{ item.PLATFROM_NAME }}</Option>
                    </Select>
                    <span style="color:red;margin-left:10px">*</span>
                </Form-item>
                <Form-item label="活动名称:">
                    <Input v-model="formChange.name" placeholder="" style="width: 180px"></Input>
                    <span style="color:red;margin-left:10px">*</span>
                </Form-item>
                <Form-item label="活动时间:">
                    <!-- <DatePicker v-model="formAdd.time" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="" style="width: 250px"></DatePicker> -->
                    <el-date-picker size="small" v-model="formChange.time" format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                    <span style="color:red;margin-left:10px">*</span>
                </Form-item>
                <Form-item label="总预估单量/单:">
                    <!-- <Input v-model="formChange.dan" placeholder="" style="width: 180px"></Input> -->
                    <el-input size="small" v-model="formChange.dan" maxlength="8" oninput="value=value.replace(/[^\d]/g,'')" style="width:180px"></el-input>
                    <span style="color:red;margin-left:10px">*</span>
                </Form-item>
                <Form-item label="总预估销量/件:">
                    <el-input size="small" v-model="formChange.jian" maxlength="8" oninput="value=value.replace(/[^\d]/g,'')" style="width:180px"></el-input>
                    <span style="color:red;margin-left:10px">*</span>
                    <!-- <Input v-model="formChange.jian" placeholder="" style="width: 180px"></Input> -->
                </Form-item>
                <div style="margin-left:30px">
                    <span>上传活动明细:</span>
                    <!-- <Form-item label="上传活动明细:" prop="upload"> -->
                    <Button style="margin-left:10px" type="default" @click="chosesUpload">选择文件</Button> {{fileName.length>0?fileName:'未选择任何文件'}}
                    <!-- </Form-item> -->
                    <p style="color:red">备注：若导入文件中出现款号重复，系统自动去重</p>
                </div>
                </Col>
            </Form>
            <div style="text-align:center;float:right">
                <Button :disabled="saveDisabled" type="primary" @click="saveChange">确认</Button>
                <Button type="default" @click="cancelChange">取消</Button>
            </div>
        </Row>
    </el-dialog>
    <el-dialog :visible="picterVisible" :append-to-body="true" @close="closeChoces" title="上传文件">
        <div>
            <Upload ref="upload" name="file" :show-upload-list="false" :before-upload="handleUpload" :on-success="uploadSuccess" :on-error="uploadError" type="drag" action="/eop/eom/reorderPlan/importDetails" :data="{}">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或将文件拖拽到此处</p>
                </div>
            </Upload>
            <div v-if="file !== null">{{ file.name }} 
                <Button type="text" :loading="loadingStatus">{{ loadingStatus ? '上传中...' : '' }}
                </Button>
            </div>
        </div>
        <div slot="footer">
            <Button v-if="visible == true" type="default" @click="cancelTag">取消</Button>
            <Button v-if="visibleChange == true" type="default" @click="cancelTagUp">取消</Button>
            <Button type="primary" @click="uploadImg">导入</Button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import Util from 'libs/util'

function formSearch() {
    return {
        search: ''
    }
}
export default {
    name: 'category',
    data() {
        return {
            saveDisabled:false,
            visibleChange: false,
            file: null,
            fileName: '',
            picterVisible: false,
            newUploadList: [], //上传文件返回的数组
            changeUploadList: [], //编辑
            columns: [{
                    title: '序号',
                    type: 'index',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '品牌',
                    key: 'brandName',
                    align: 'center',
                    minWidth: 100,
                },
                {
                    title: '年份',
                    key: 'year',
                    align: 'center',
                    minWidth: 100,
                },
                {
                    title: '季节',
                    key: 'season',
                    align: 'center',
                    minWidth: 100,
                },
                {
                    title: '平台',
                    key: 'platformName',
                    align: 'center',
                    minWidth: 100,
                },

                {
                    title: '活动名称',
                    key: 'activityName',
                    align: 'center',
                    minWidth: 100,
                },
                {
                    title: '活动开始时间',
                    key: 'activityStartTime',
                    align: 'center',
                    minWidth: 100,
                },
                {
                    title: '活动结束时间',
                    key: 'activityEndTime',
                    align: 'center',
                    minWidth: 100,
                },
                {
                    title: '总预估单量/单',
                    key: 'totalEstimateOrders',
                    align: 'center',
                    minWidth: 100,
                },
                {
                    title: '总预估单量/件',
                    key: 'totalEstimateSales',
                    align: 'center',
                    minWidth: 100,
                },
                {
                    title: '创建时间',
                    key: 'created',
                    align: 'center',
                    minWidth: 100,
                },
                {
                    title: '操作',
                    key: 'operate',
                    minWidth: 200,
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
                                    display: new Date(params.row.activityStartTime) - new Date() > 0 ? 'inline-block' : 'none'
                                },
                                on: {
                                    click: (e) => {
                                        this.handleSave(params.row)
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
                                    click: (e) => {
                                        this.getInRow(params.row.id) //进入明细页面
                                    }
                                }
                            }, '进入'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                    display: new Date(params.row.activityStartTime) - new Date() > 0 ? 'inline-block' : 'none'
                                },
                                on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            title: '提示',
                                            content: '该行将会删除，请确认！',
                                            onOk: () => {
                                                this.tableDelete(params);
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
            formSearch: {
                brandId: '', //品牌id
                userId: '', //处理人id
            },
            userInfo: '',
            changePlanformId: '',
            changeBrandId: '',
            formAdd: {},
            formChange: {
                brand: '',
                year: '',
                season: '',
                planform: '',
                name: '',
                time: '',
                dan: '',
                jian: ''
            },
            ruleValidate: {
                brand: [{
                    required: true,
                    message: '请选择',
                    type: 'object',
                    trigger: 'change'
                }],
                year: [{
                    required: true,
                    message: '请选择',
                    type: "date",
                    trigger: 'change'
                }],
                season: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                planform: [{
                    required: true,
                    type: 'object',
                    message: '请选择',
                    trigger: 'change'
                }],
                name: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }],
                time: [{
                    required: true,
                    message: '请选择',
                    type: "array",
                    trigger: 'change'
                }],
                dan: [{
                    required: true,
                    pattern: /^[a-z0-9]{1,8}$/,
                    message: '请输入数字且不能超过8位',
                    trigger: 'change'
                }, ],
                jian: [{
                    required: true,
                    pattern: /^[a-z0-9]{1,8}$/,
                    message: '请输入数字且不能超过8位',
                    trigger: 'change'
                }],
                // upload:[{
                //     required: true,
                //     message: '请选择',
                //     trigger: 'blur'
                // }]
            },
            visible: false,
            total: 0,
            page: 1,
            pageSize: 10,
            list: [],
            optionList: [{
                    valeu: '1',
                    label: '北京2222222'
                },
                {
                    valeu: '2',
                    label: '上海'
                },
                {
                    valeu: '3',
                    label: '杭州'
                }

            ],
            employeeList: [],
            employeeListTwo: [],
            brandList: [],
            brandListTwo: [],
            palnformList: [], //平台
            seasonList: [{
                    name: '春季'
                },
                {
                    name: '夏季'
                },
                {
                    name: '秋季'
                },
                {
                    name: '冬季'
                }
            ]
        }
    },
    mounted() {
        this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
        // this.getEmployeeList()
        this.getbrandList()
        this.getPlatformList()
        // this.getData()

    },
    activated() {},
    methods: {
        chosesUpload() {
            this.picterVisible = true
        },
        uploadImg() {
            if (this.file == null) {
                this.$Message.warning('请先选择文件再导入')
            } else {
                this.picterVisible = false
                this.loadingStatus = true;
                // Vue.prototype.$loading('正在导入数据...');
                this.$refs.upload.post(this.file);
            }
        },
        cancelTag() {
            this.picterVisible = false
            this.file = null
            this.fileName = ''
        },
        cancelTagUp() {
            this.picterVisible = false
            this.file = null
        },
        closeChoces(){
            if(this.visibleChange == true){
                this.cancelTagUp()
            }else{
                this.cancelTag()
            }
        },
        //上传之前
        handleUpload(file) {
            if (!/\.xlsx$/.test(file.name)) {
                this.$Message.warning('文件类型不符,支持格式：xlsx！请重新选择文件');
                return false
            } else {
                this.file = file
                // this.file = file //需要传给后台的file文件
                // this.fileName = file.name
                return false
            }
        },
        //上传成功之后
        uploadSuccess(res, file) {
            Vue.prototype.$loading.close();
            if (res.code == '1') {
                this.loadingStatus = false;
                let List = []
                res.data.map(x => {
                    List.push({
                        goodsNo: x.goodsNo
                    })
                })
                this.file = file //需要传给后台的file文件
                this.fileName = file.name
                this.newUploadList = List
                this.$Message.success(res.msg);
                this.picterVisible = false;
                this.imgTagUrl = res.data
                console.log(this.newUploadList, '/./././')
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
        //下载模板
        downLoad() {
            window.location = ('/excel/活动明细模版.xlsx')
        },
        //进入明细页面
        getInRow(row) {
            this.$router.push({
                name: 'quickrepeatorder_salesPlanEdit',
                query: {
                    obj: row
                }
            });
        },
        //获取处理人列表
        getEmployeeList() {
            this.request('get_user_list_all', {}, false).then((res) => {
                if (res.code == 1) {
                    this.employeeList = res.data
                    this.employeeListTwo = res.data
                    // this.formSearch.A = 
                    // this.formSearch.C 
                }
            })
        },
        //
        getPlatformList() {
            this.request('get_platform_list', {}, false).then((res) => {
                if (res.code == 1) {
                    this.palnformList = res.data
                }
            })
        },
        // 确定新增
        save() {
            this.$refs["formAdd"].validate((valid) => {
                if (valid) {
                    if (this.file == null) {
                        this.$Message.error('请先上传活动明细')
                    } else {
                        this.saveDisabled = true
                        let data = {}
                        data.brandId = this.formAdd.brand.brandId
                        data.brandName = this.formAdd.brand.brandName
                        data.year = Util.dateFormat(this.formAdd.year, 'yyyy')
                        data.platformCode = this.formAdd.planform.PLATFROM_ID
                        data.platformName = this.formAdd.planform.PLATFROM_NAME
                        this.formAdd.time ? data.activityStartTime = Util.dateFormat(this.formAdd.time[0], 'yyyy-MM-dd hh:mm:ss') : delete data.activityStartTime
                        this.formAdd.time ? data.activityEndTime = Util.dateFormat(this.formAdd.time[1], 'yyyy-MM-dd hh:mm:ss') : delete data.activityEndTime
                        data.season = this.formAdd.season
                        data.activityName = this.formAdd.name
                        data.totalEstimateOrders = this.formAdd.dan
                        data.totalEstimateSales = this.formAdd.jian
                        data.activityDetails = this.newUploadList
                        data.remark = this.fileName
                        this.request('reorderPlan_addActivity', {
                            data
                        }, false).then((res) => {
                            if (res.code == 1) {
                                this.$Message.success(res.msg)
                                this.visible = false;
                                this.getData();
                                this.formAdd = {}
                                this.file = null
                                this.fileName = ''
                                this.$refs["formAdd"].resetFields();
                            }
                            this.saveDisabled = false
                        })
                    }
                }
            })
        },
        currentChange(page) {
            this.page = page
            this.getData()
        },
        sizeChange(pageSize) {
            this.pageSize = pageSize
            this.getData()
        },
        dataChange() {
            for (let item of this.brandList) {
                if (item.brandId == this.formSearch.brandIdTwo) {
                    this.formSearch.brandNameTwo = item.brandName
                    break;
                }
            }
        },
        employeeChange() {
            for (let item of this.employeeList) {
                if (item.userId == this.formSearch.userIdTwo) {
                    this.formSearch.userNameTwo = item.userName
                    break;
                }
            }
        },
        getbrandList() {
            let data = {}
            data.userCode = this.userInfo.userAccount
            this.request('getBrandListByUserCode', {
                data
            }, false).then((res) => {
                if (res.code == 1) {
                    this.brandList = res.data
                    this.brandListTwo = res.data
                }
            })
        },
        //获取table数据
        getData() {
            let data = {}
            data.start = (this.page - 1) * this.pageSize
            data.length = this.pageSize
            data.brandName = this.formSearch.brand //品牌
            this.formSearch.year ? data.year = Util.dateFormat(this.formSearch.year, 'yyyy') : delete data.year //年份
            data.season = this.formSearch.season //季节
            this.formSearch.time ? data.activityStartTime = Util.dateFormat(this.formSearch.time[0], 'yyyy-MM-dd hh:mm:ss') : delete data.activityStartTime
            this.formSearch.time ? data.activityEndTime = Util.dateFormat(this.formSearch.time[1], 'yyyy-MM-dd hh:mm:ss') : delete data.activityEndTime
            this.request('reorderPlan_getActivity', {
                data
            }, true).then((res) => {
                if (res.code == 1) {
                    this.list = res.data.eomReorderPlanList
                    this.total = res.data.count
                }
            })
        },
        //重置
        handleReset() {
            this.formSearch = {}
        },
        //查询
        search() {
            this.getData()
        },
        //编辑
        handleSave(row) {
            this.visibleChange = true
            console.log(row, '//./')
            this.rowId = row.id
            this.formChange.brand = row.brandName
            this.changeBrandId = row.brandId
            this.formChange.year = row.year.toString()
            this.formChange.season = row.season
            this.formChange.planform = row.platformName
            this.changePlanformId = row.platformCode //平台code
            this.formChange.name = row.activityName
            this.formChange.time = [row.activityStartTime, row.activityEndTime]
            this.formChange.dan = row.totalEstimateOrders
            this.formChange.jian = row.totalEstimateSales
            this.fileName = row.remark
        },
        //编辑保存
        saveChange() {
            if (this.formChange.brand == '') {
                this.$Message.error('品牌不能为空')
            } else if (this.formChange.year == '') {
                this.$Message.error('年份不能为空')
            } else if (this.formChange.season == '') {
                this.$Message.error('季节不能为空')
            } else if (this.formChange.planform == '') {
                this.$Message.error('平台不能为空')
            } else if (this.formChange.name == '') {
                this.$Message.error('活动名称不能为空')
            } else if (this.formChange.time == '') {
                this.$Message.error('活动时间不能为空')
            } else if (this.formChange.dan == '') {
                this.$Message.error('总预估单量/单不能为空')
            } else if (this.formChange.jian == '') {
                this.$Message.error('总预估销量/件不能为空')
            } else {
                this.saveDisabled = true
                let data = {}
                data.id = this.rowId
                data.brandId = this.changeBrandId
                data.brandName = this.formChange.brand
                data.year = Util.dateFormat(this.formChange.year, 'yyyy')
                data.platformCode = this.changePlanformId
                data.platformName = this.formChange.planform
                this.formChange.time ? data.activityStartTime = Util.dateFormat(this.formChange.time[0], 'yyyy-MM-dd hh:mm:ss') : delete data.activityStartTime
                this.formChange.time ? data.activityEndTime = Util.dateFormat(this.formChange.time[1], 'yyyy-MM-dd hh:mm:ss') : delete data.activityEndTime
                data.season = this.formChange.season
                data.activityName = this.formChange.name
                data.totalEstimateOrders = Number(this.formChange.dan)
                data.totalEstimateSales = this.formChange.jian
                this.file != null ? data.activityDetails = this.newUploadList : delete data.activityDetails
                data.remark = this.fileName
                this.request('reorderPlan_updateActivity', {
                    data
                }, false).then((res) => {
                    if (res.code == 1) {
                        this.$Message.success(res.msg)
                        this.visibleChange = false;
                        this.getData();
                        this.formChange = {
                            brand: '',
                            year: '',
                            season: '',
                            planform: '',
                            name: '',
                            time: '',
                            dan: '',
                            jian: ''
                        }
                        this.file = null
                        this.fileName = ''
                    }
                    this.saveDisabled = false
                })
            }
        },
        cancelChange() {
            this.saveDisabled = false
            this.fileName = ''
            this.visibleChange = false
            this.formChange = {
                brand: '',
                year: '',
                season: '',
                planform: '',
                name: '',
                time: '',
                dan: '',
                jian: ''
            }
        },
        changebrand(name) {
            let changeBrandId = ''
            this.brandList.map(x => {
                if (name == x.brandName) {
                    changeBrandId = x.brandId
                }
            })
            this.changeBrandId = changeBrandId
        },
        changeplanform(name) {
            let changePlanformId = ''
            this.palnformList.map(x => {
                if (name == x.PLATFROM_NAME) {
                    changePlanformId = x.PLATFROM_ID
                }
            })
            this.changePlanformId = changePlanformId
        },
        handleEdit(row) {
            this.$set(row, '$isEdit', false)
        },
        //编辑保存 
        saveTable(prame) {
            let data = {}
            data.brandId = this.formSearch.C
            data.userId = this.formSearch.A
            data.lastUpdateUser = this.userInfo.userName
            data.id = prame.id
            this.request('edit_user_config', {
                data
            }, false).then((res) => {
                if (res.code == 1) {
                    this.getData()
                }
            })
        },
        //删除 
        tableDelete(prame) {
            let data = {}
            data.ids = [prame.row.id]
            this.request('reorderPlan_deleteActivity', {
                data
            }, false).then((res) => {
                if (res.code == 1) {
                    this.$Message.success(res.msg)
                    this.getData()
                }
            })
        },
        //新增
        newAdd() {
            this.visible = true
        },
        //取消新增
        cancel() {
            this.saveDisabled = false
            this.visible = false
            this.formAdd = {}
            this.file = null
            this.fileName = ''
            this.$refs["formAdd"].resetFields();
        },
    }
}
</script>

<style>
      .ivu-message{
        z-index:9999999!important;
      }
</style>
