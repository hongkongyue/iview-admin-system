<template>
    <div class="background-color-white exhibition" id="balance_account_supplier_list">
        <Row>
            <Form :model="formSearch" :label-width="120" inline label-position="right">
                <Col>
                <Form-item label="供应商：" :label-width='100'>
                        <Select v-model="formSearch.supplierCode" filterable clearable size="small" style="width:180px">
                              <Option v-for="item in supplierList" :value="item.supplierCode"
                                        :key="item.supplierCode">{{
                                    item.supplierName }}
                             </Option>
                        </Select>
                </Form-item>

                <Form-item label="季节：" :label-width='60'>
                    <Select v-model="formSearch.season" style="width:150px">
                        <Option v-for="item in seasonList" :value="item.value" :key="item.value">
                            {{ item.label }}</Option>
                    </Select>
                </Form-item>

                <Form-item label="年份:" :label-width="70">
                    <DatePicker type="year" v-model="formSearch.years" placeholder="请选择年份" style="width: 150px">
                    </DatePicker>
                </Form-item>

                <Form-item :label-width="10">
                    <Button type="primary" icon="ios-search" size="small" @click="search">查询</Button>
                    <Button type="warning" size="small" @click="reset">重置</Button>
                    <Button type="primary" size="small" @click="edit">新增</Button>
                    <Button type="primary" size="small" @click="downTemplate">下载模板</Button>
                    <Button type="primary" size="small" @click="importData">导入</Button>
                </Form-item>
                </Col>
            </Form>
        </Row>
        <Row class-name="margin-top-10">
            <Col>
            <Table ref="importDataTable" size="small" :loading="loading" :columns="columns" :data="list">
            </Table>
            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total
                show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
            </Col>
        </Row>
        <Modal v-model="importModal" title="导入供应商折扣">
            <div>
                <Upload ref="upload" name="file" :show-upload-list="false" :before-upload="handleUpload"
                    :on-success="uploadSuccess" :on-error="uploadError" type="drag"
                    action="/eop/bi/import_supplier_discount" :data="{userCode:userInfo.userAccount}">
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
                <Button type="default" @click="cancel">取消</Button>
                <Button type="primary" @click="importOrderSave">导入</Button>
            </div>
        </Modal>

        <div>
            <Modal v-model="editModal" @on-cancel="editCancel" :width="750" title="新增供应商">
                <div>
                    <Form ref="addForm" :model="addForm" :label-width="120"  :mask-closable="true"
                        :rules="ruleValidate" inline label-position="right">
                        <Row>
                            <Form-item label="供应商全称:" :label-width="100" prop="supplierCode">
                                <Select v-if="addForm.id==0" filterable="true" clearable v-model="addForm.supplierCode"
                                    @on-change="supplierChange" size="small" style="width:250px">
                                    <Option v-for="item in supplierList" :value="item.supplierCode"
                                        :key="item.supplierCode">{{
                                    item.supplierName }}
                                    </Option>
                                </Select>
                                <Input v-if="addForm.id>0" disabled v-model="addForm.supplierName"></Input>
                            </Form-item>
                        </Row>
                        <Row>
                            <Form-item label="供应商简称:" :label-width="100" prop="shortCode">
                                <Input style="width: 150px" disabled v-model="addForm.shortName"></Input>
                            </Form-item>
                        </Row>
                        <Row>
                            <Col span="12">
                            <Form-item label="年份:" :label-width="100" prop="years">
                                <DatePicker type="year" v-model="addForm.years" placeholder="请选择年份"
                                    style="width: 150px"></DatePicker>
                            </Form-item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                            <Form-item label="季节:" :label-width="100" prop="season">
                                <Select v-model="addForm.season" style="width:150px">
                                    <Option v-for="item in seasonList" :value="item.value" :key="item.value">
                                        {{ item.label }}</Option>
                                </Select>
                            </Form-item>
                            </Col>
                        </Row>
                        <Row>
                            <Form-item label="折扣:" :label-width="100" prop="discount">
                                <InputNumber :max="100" v-model="addForm.discount" :formatter="value => `${value}%`"
                                    :parser="value => value.replace('%', '')"></InputNumber>
                            </Form-item>
                        </Row>
                        <Row>
                            <Form-item label="备注:" :label-width="100" prop="remark">
                                 <Input style="width: 300px" v-model="addForm.shortName"></Input>
                            </Form-item>
                        </Row>
                    </Form>
                </div>
                <div slot="footer">
                    <Button type="default" @click="editCancel">取消</Button>
                    <Button type="primary" @click="save">保存</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import Util from 'libs/util';
    export default {
        name: 'balance_account_supplier_list',
        desc: '供应商',
        data() {
            return {
                formSearch: {
                    yearMonth: new Date()
                },
                supplierList: [],
                importModal: false,
                editModal: false,
                loadingStatus: false,
                loading: false, //表格数据加载开关
                columns: [{
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        width: 60
                    }, {
                        title: '供应商编号',
                        key: 'supplierCode',
                        align: 'center',
                        width: 150
                    }, {
                        title: '供应商简称',
                        key: 'shortName',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '供应商全称',
                        key: 'supplierName',
                        align: 'center',
                        minWidth: 200
                    },
                    {
                        title: '外部开发?',
                        key: 'exDevelopment',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '年份',
                        key: 'years',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '季节',
                        key: 'season',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '折扣(%)',
                        key: 'discount',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '操作',
                        key: 'operate',
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
                                                    this.request('delete_supplier_discount', {
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
                userInfo: {},
                ruleValidate: {
                    supplierCode: [
                        { required: true, message: '请选择供应商', trigger: 'change' }
                    ],
                    years: [
                        { required: true, message: '请选择年份', trigger: 'blur',type:'date' }
                    ],
                    season: [
                        { required: true, message: '请选择季节', trigger: 'change' }
                    ],
                    discount: [
                        { required: true, message: '请填写折扣', trigger: 'blur',type:'number' }
                    ],

                },
                addForm: {},
                seasonList: [{
                        label: '春',
                        value: '春'
                    },
                    {
                        label: '夏',
                        value: '夏'
                    },
                    {
                        label: '秋',
                        value: '秋'
                    },
                    {
                        label: '冬',
                        value: '冬'
                    }
                ]
            }
        },
        computed: {

        },
        mounted() {
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            this.getData()
            this.getSupplierList()
        },
        methods: {
            search() {
                this.getData()
            },
            reset() {
                this.formSearch = {}
                this.search();
            },
            cancel() {
                this.importModal = false;
                this.file = null;
            },
            editCancel() {
                this.editModal = false
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
                window.location = ('/excel/供应商折扣导入模板.xlsx');
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
                if (data.years) {
                    data.years = Util.dateFormat(data.years, 'yyyy')
                }
                data.length = this.pageSize;
                data.start = (this.page - 1) * this.pageSize;
                this.request('get_supplier_discount_list', {
                    data: data
                }, true).then((res) => {
                    let serialNoBegain = this.pageSize * (this.page - 1);
                    res.data.supplierDiscountList.map(x => {
                        serialNoBegain++;
                        x.serialNo = serialNoBegain;
                    })
                    this.total = res.data.count;
                    this.list = res.data.supplierDiscountList
                    console.log(res)
                })
            },
            edit(row) {
                this.$refs['addForm'].resetFields()
                this.addForm = {}
                this.addForm.id = 0
                this.addForm.years = new Date()
                this.addForm.discount=null;
                if (row && row.id > 0) {
                    this.addForm.id = row.id
                    this.addForm.years = row.years
                    this.addForm.season = row.season
                    this.addForm.discount = row.discount
                    this.addForm.supplierName = row.supplierName
                    this.addForm.shortName = row.shortName
                    this.addForm.supplierCode = row.supplierCode
                }
                this.editModal = true
            },
            delete() {


            },
            getSupplierList() {
                this.request('get_supplier_list', {}, false).then((res) => {
                    if (res.code == 1) {
                        this.supplierList = res.data
                    }
                })
            },
            supplierChange() {
                for (let item of this.supplierList) {
                    if (item.supplierCode == this.addForm.supplierCode) {
                        this.addForm.shortName = item.shortName
                        this.addForm.shortCode = item.shortCode
                        this.addForm.supplierName = item.supplierName
                        break;
                    }
                }
            },
            save() {
                this.$refs['addForm'].validate((valid) => {
                    if(!valid){
                       return;
                    }
                    let data = Util.deepClone(this.addForm)
                    data.years = Util.dateFormat(data.years, 'yyyy')
                    if (this.addForm.id > 0) {

                        this.request('edit_supplier_discount', {
                            data: {
                                id: data.id,
                                years: data.years,
                                season: data.season,
                                discount: data.discount,
                                lastUpdateUser: this.userInfo.userName
                            }
                        }, '正在保存...').then((res) => {
                            if (res.code == '1') {
                                this.editModal = false
                                this.getData()
                                this.$Message.success(res.msg)
                            } else {
                                this.$Message.error(res.msg)
                            }
                        })

                    } else {
                        this.request('add_supplier_discount', {
                            data: data
                        }, '正在保存...').then((res) => {
                            if (res.code == '1') {
                                this.editModal = false
                                this.getData()
                                this.$Message.success(res.msg)
                            } else {
                                this.$Message.error(res.msg)
                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="css">
  
</style>
