<template>
<div class="background-color-white exhibition" id="parameter_sales">
    <Row>
        <Form :model="formSearch" :label-width="100" inline label-position="right">
            <Col>
            <Form-item label="品牌：" :label-width='60'>
                <Select v-model="formSearch.brandId" style="width:150px" size="small">
                    <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                    </Option>
                </Select>
            </Form-item>
            <Form-item label="平台：" :label-width='60'>
                <Select v-model="formSearch.platfromCode" @on-change="platformSearchChange" style="width:150px" size="small">
                    <Option v-for="item in platformList" :value="item.PLATFROM_ID" :key="item.PLATFROM_ID">{{
                        item.PLATFROM_NAME }}
                    </Option>
                </Select>
            </Form-item>
            <Form-item label="店铺：" :label-width='60'>
                <Select v-model="formSearch.shopId" style="width:150px" size="small">
                    <Option v-for="item in shopListSearch" :value="item.SHOP_ID" :key="item.SHOP_ID">{{
                        item.SHOP_NAME }}
                    </Option>
                </Select>
            </Form-item>
            </Col>
            <Col>
            <Form-item label="状态:" :label-width='60'>
                <Select v-model="formSearch.isUsed" style="width:100px" size="small">
                    <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}
                    </Option>
                </Select>
            </Form-item>
            <Form-item label="生效日期:">
                <DatePicker v-model="formSearch.startDate" 　size="small" type="daterange" placement="bottom-end"
                    placeholder="请选择生效日期" style="width: 200px"></DatePicker>
            </Form-item>
            <Form-item label="失效日期:">
                <DatePicker v-model="formSearch.endDate" 　size="small" type="daterange" placement="bottom-end"
                    placeholder="请选择失效日期" style="width: 200px"></DatePicker>
            </Form-item>
            <Form-item :label-width="60">
                <Button type="primary" size="small" icon="ios-search" @click="search">查询</Button>
                <Button type="warning" size="small" @click="reset">重置</Button>
                <Button type="primary" 　size="small" @click="openAddModal">新增</Button>
            </Form-item>
            </Col>
        </Form>
    </Row>
    <!-- <Row class="margin-bottom-10">
        <Button type="primary" 　size="small" @click="openAddModal">新增</Button>
    </Row> -->
    <Row>
        <Col class="margin-bottom-10">
        <Table :columns="columns" size="small" :data="list"></Table>
        </Col>
        <Col>
        <Page :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="CurrentChange"
            @on-page-size-change="SizeChange"></Page>
        </Col>
    </Row>

    <div class="modal">
        <Modal v-model="addModal" @on-cancel="cancel" :width="600" :title="addForm.id>0?'编辑销售参数':'新增销售参数'">
            <div>
                <Form :model="addForm" :label-width="120" class="addForm2" ref="submit_data" :mask-closable="true"
                    :rules="ruleValidate" inline label-position="right">
                    <Row>
                        <Col span="12">
                        <Form-item label="平台:" :label-width="100" prop="platfromCode">
                            <Select v-if="addForm.id==0" v-model="addForm.platfromCode" @on-change="platformChange"
                                size="small" style="width:180px">
                                <Option v-for="item in platformList" :value="item.PLATFROM_ID" :key="item.PLATFROM_ID">{{
                                    item.PLATFROM_NAME }}
                                </Option>
                            </Select>
                            <Input v-if="addForm.id>0" disabled v-model="addForm.platfromName"></Input>
                        </Form-item>
                        </Col>
                        <Col span="12">
                        <Form-item label="品牌:" :label-width='100' prop="brandId">
                            <Select v-if="addForm.id==0" v-model="addForm.brandId" style="width:180px" size="small">
                                <Option v-for="item in brandListAdd" :value="item.id" :key="item.id">{{ item.brands }}
                                </Option>
                            </Select>
                            <Input v-if="addForm.id>0" disabled v-model="addForm.brandName"></Input>
                        </Form-item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                        <Form-item label="店铺:" :label-width='100' prop="shopId">
                            <Select v-if="addForm.id==0" v-model="addForm.shopId" style="width:180px" size="small">
                                <Option v-for="item in shopList" :value="item.SHOP_ID" :key="item.SHOP_ID">{{
                                    item.SHOP_NAME }}
                                </Option>
                            </Select>
                            <Input v-if="addForm.id>0" disabled v-model="addForm.shopName"></Input>
                        </Form-item>
                        </Col>
                        <Col span="12">
                        <Form-item label="状态:" :label-width='100'>
                            <Select v-model="addForm.isUsed" style="width:180px" size="small">
                                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label
                                    }}
                                </Option>
                            </Select>
                        </Form-item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                        <Form-item label="收入系数：" :label-width='100' prop="effectiveParameter">
                            <InputNumber v-model="addForm.effectiveParameter" :max="1" :min="0" 　size="small"
                                placeholder="请输入收入系数" style="width:180px"></InputNumber>
                        </Form-item>

                        </Col>
                        <Col span="12">
                        <Form-item label="计提系数：" :label-width='100' prop="effectiveParameter">
                            <InputNumber v-model="addForm.commissionParameter" :max="1" :min="0" 　size="small"
                                placeholder="请输入计提系数" style="width:180px"></InputNumber>
                        </Form-item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                        <Form-item label="生效时间：" :label-width='100' prop="startDate">
                            <DatePicker type="date" v-model="addForm.startDate" placeholder="请输入生效时间" size="small"
                                style="width: 180px"></DatePicker>
                        </Form-item>
                        </Col>
                        <Col span="12">
                        <Form-item label="失效时间：" :label-width='100' prop="endDate">
                            <DatePicker type="date" v-model="addForm.endDate" placeholder="请输入生效时间" size="small" style="width: 180px"></DatePicker>
                        </Form-item>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div slot="footer">
                <Button type="default" @click="cancel">取消</Button>
                <Button type="primary" @click="save">保存</Button>
            </div>
        </Modal>
    </div>
</div>
</template>

<script>
    import Util from 'libs/util';

    function formSearch() {
        return {
            brandId: 0,
        }
    }

    function initAddForm() {
        return {
            id: 0,
            commissionParameter: 1,
            effectiveParameter: 1,
            brandId: null,
            shopId:null,
            platfromCode:null,
            startDate: '',
            endDate: '',
            isUsed: 0
        }
    }

    export default {
        name: 'parameter_sales',
        data() {
            return {
                formSearch: formSearch(),
                addModal: false,
                userInfo: {},
                columns: [{
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '平台',
                        key: 'platfromName',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '店铺',
                        key: 'shopName',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '状态',
                        key: 'isUsed',
                        align: 'center',
                        minWidth: 60,
                        render: (h, params) => {
                            if (params.row.isUsed == 0) {
                                return h('span', '启用')
                            } else {
                                return h('span', '停用')
                            }
                        }
                    },
                    {
                        title: '收入系数',
                        key: 'effectiveParameter',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '计提系数',
                        key: 'commissionParameter',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '生效日期',
                        key: 'startDate',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '失效日期',
                        key: 'endDate',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '创建人',
                        key: 'createUser',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '创建时间',
                        key: 'created',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '修改人',
                        key: 'lastUpdateUser',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '修改时间',
                        key: 'lastUpdated',
                        align: 'center',
                        minWidth: 150
                    }, {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        minWidth: 150,
                        fixed: 'right',
                        render: (h, params) => {
                            if (params.row.serialNo == '合计') {
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
                                            this.edit(params.row)
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
                                                    this.request('delete_sales_parameter_data', {
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
                            ]);
                        }
                    }
                ],
                list: [],
                total: 0,
                page: 1,
                pageSize: 10,
                platformList: [],
                shopList: [],
                shopListSearch:[],
                brandListAdd: [],
                ruleValidate: {
                    startDate: [{
                        required: true,
                        type: 'date',
                        message: '生效日期不能为空',
                        trigger: 'blur'
                    }],
                    endDate: [{
                        required: true,
                        type: 'date',
                        message: '失效日期不能为空',
                        trigger: 'blur'
                    }],
                    brandId: [{
                        required: true,
                        type: 'number',
                        message: '品牌不能为空',
                        trigger: 'change'
                    }],
                    platfromCode: [{
                        required: true,
                        type: 'number',
                        message: '平台不能为空',
                        trigger: 'change'
                    }],
                    shopId: [{
                        required: true,
                        type: 'number',
                        message: '店铺不能为空',
                        trigger: 'change'
                    }],
                    effectiveParameter: [{
                        required: true,
                        type: 'number',
                        message: '收入系数不能为空',
                        trigger: 'blur'
                    }],
                    commissionParameter: [{
                        required: true,
                        type: 'number',
                        message: '计提系数不能为空',
                        trigger: 'blur'
                    }]
                },
                addForm: initAddForm(),
                statusList: [{
                        label: '启用',
                        value: 0
                    },
                    {
                        label: '停用',
                        value: 1
                    }
                ]
            }
        },
        mounted() {
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            this.getPlatformList()
            this.getData()
        },
        props: ['brandList'],
        methods: {
            search() {
                this.page = 1;
                this.getData();
            },
            reset() {
                this.formSearch = formSearch();
                this.search();
            },
            getData() {
                let data = Util.deepClone(this.formSearch);
                data.start = (this.page - 1) * this.pageSize;
                data.length = this.pageSize

                let startDate = data.startDate
                let endDate = data.endDate

                if(startDate&&startDate[0]){
                    data.startDateBegin = Util.dateFormat(startDate[0],'yyyy-MM-dd')
                }
                if(startDate&&startDate[1]){
                    data.startDateFinish= Util.dateFormat(startDate[1],'yyyy-MM-dd')
                }
                if(endDate&&endDate[0]){
                   data.endDateBegin = Util.dateFormat(endDate[0],'yyyy-MM-dd')
                }
                if(endDate&&endDate[1]){
                   data.endDateFinish = Util.dateFormat(endDate[1],'yyyy-MM-dd')
                }

                delete data.startDate
                delete data.endDate
                if(data.brandId==0){
                   delete  data.brandId
                }
                this.request('get_sales_parameter_list', {
                    data: data
                }, true).then(res => {
                    if (res.code == 1) {
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.saleParameterList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.total = res.data.count;
                        this.list = res.data.saleParameterList;
                    } else {
                        this.$Message.warning(res.msg);
                    }
                })
            },
            getPlatformList() {
                this.request('get_platform_list', {}, false).then((res) => {
                    if (res.code == '1') {
                        this.platformList = res.data
                    }
                })
            },
            getShopList(platformCode,name) {
                if (platformCode) {
                    this.request('get_shop_list_by_platform', {
                        data: {
                            platfromCode: platformCode.toString()
                        }
                    }, false).then((res) => {
                        if (res.code == '1') {
                            if(name){
                                this.shopListSearch = res.data
                            }else{
                                this.shopList = res.data
                            }
                        }
                    })
                }
            },
            CurrentChange(val) {
                this.page = val;
                this.getData();
            },
            SizeChange(val) {
                this.pageSize = val;
                this.getData();
            },
            openAddModal() {
                     this.$refs["submit_data"].resetFields()
                if (this.brandListAdd.length <= 0) {
                    this.brandListAdd = Util.deepClone(this.brandList).filter((item) => {
                        return item.id > 0
                    })
                }
                this.addModal = true
            },
            cancel() {
                this.addForm = initAddForm()
                this.addModal = false
            },
            save() {
                this.$refs["submit_data"].validate((valid) => {
                    if (valid) {
                        let data = {}
                        data = Util.deepClone(this.addForm)
                        for (let brand of this.brandList) {
                            if (brand.id == data.brandId) {
                                data.brandName = brand.brands
                                break;
                            }
                        }
                        for (let shop of this.shopList) {
                            if (data.shopId == shop.SHOP_ID) {
                                data.shopName = shop.SHOP_NAME
                                break;
                            }
                        }

                        for (let platform of this.platformList) {
                            if (data.platfromCode == platform.PLATFROM_ID) {
                                data.platfromName = platform.PLATFROM_NAME
                                break;
                            }
                        }
                        data.createUser = this.userInfo.userName
                        data.remark = ''

                        data.startDate = Util.dateFormat(data.startDate, 'yyyy-MM-dd')
                        data.endDate = Util.dateFormat(data.endDate, 'yyyy-MM-dd')

                        if (this.addForm.id > 0) {
                            this.request('edit_sales_parameter_data', {
                                data: {
                                    id: data.id,
                                    effectiveParameter: data.effectiveParameter,
                                    commissionParameter: data.commissionParameter,
                                    isUsed: data.isUsed,
                                    startDate: data.startDate,
                                    endDate: data.endDate,
                                    lastUpdateUser: this.userInfo.userName
                                }
                            }, '正在保存数据...').then((res) => {
                                if (res.code == 1) {
                                    this.cancel()
                                    this.$Message.success(res.msg);
                                    this.getData()
                                } else {
                                    this.$Message.error(res.msg);
                                }
                            })

                        } else {

                            this.request('save_sales_parameter_data', {
                                data: data
                            }, '正在保存数据...').then((res) => {
                                if (res.code == 1) {
                                    this.cancel()
                                    this.$Message.success(res.msg);
                                    this.getData()
                                } else {
                                    this.$Message.error(res.msg);
                                }
                            })

                        }

                    } else {
                        return;
                    }
                })
            },
            platformChange(platformCode) {
                this.getShopList(platformCode)
            },
            platformSearchChange(platformCode) {
                this.getShopList(platformCode,'search')
            },
            edit(row) {
                this.addForm.id = row.id
                this.addForm.isUsed = row.isUsed
                this.addForm.startDate = row.startDate
                this.addForm.endDate = row.endDate
                this.addForm.platfromName = row.platfromName
                this.addForm.brandName = row.brandName
                this.addForm.shopName = row.shopName
                this.addForm.brandId = row.brandId
                this.addForm.platfromCode = Number(row.platfromCode)
                this.addForm.shopId = row.shopId
                this.addForm.commissionParameter = row.commissionParameter
                this.addForm.effectiveParameter = row.effectiveParameter
                this.addModal = true
            }
        },
        components: {

        }
    }
</script>

<style lang="css">

</style>


