<template>
<div>
    <Row class="margin-bottom-10 background-color-white exhibition">
        <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline label-position="right" style="100px">
            <Col span="24">
            <Form-item label="部门:" :label-width="50">
                　<Select v-model="formSearch.departmentId" style="width:120px" @on-change="selectnextRank(formSearch.departmentId)">
                    <Option v-for="item in initdepartmentList" :value="item.departmentId" :key="item.departmentId">{{item.departmentName}}</Option>
                </Select>
            </Form-item>
            <Form-item label="设计师:">
                　<Select v-model="formSearch.designerEopId" style="width:120px">
                    <Option v-for="item in designer" :value="item.designerEopId" :key="item.designerEopId">{{item.designerName}}</Option>
                </Select>
            </Form-item>
            <Form-item label="企划:">
                　<Select v-model="formSearch.plannerEopId" style="width:120px">
                    <Option v-for="item in planner" :value="item.plannerEopId" :key="item.plannerEopId">
                        {{item.plannerName}}
                    </Option>
                </Select>
            </Form-item>
            <Form-item :label-width="1">
                <Button type="primary" @click="search">查询</Button>
                <Button type="default" @click="handleReset">重置</Button>
                <Button type="primary" @click="addNew">新增</Button>
            </Form-item>
            <!-- <Form-item ><span v-if="switchtype!='up'" @click="showmore">更多<Icon type="ios-arrow-down" /></span></Form-item> -->
            </Col>
        </Form>
    </Row>
    <!-- 数据列表 -->
    <Row class="background-color-white exhibition">
        <Table ref="currentRowTable" :columns="columns" size="small" highlight-row :data="list"></Table>
        <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
    </Row>
    <!-- 交接 -->
    <Modal v-model="handoverVisible" title="交接" :width="870" class-name="customize-modal-center" @on-cancel="handoverCancel">
        <Row class="margin-bottom-10 background-color-white exhibition">
            <Form :model="handoverVisible" ref="handoverChange" :label-width="90" inline label-position="right" style="100px">
                <Col span="24">
                <Form-item label="品牌:" :label-width="50">
                    <Input v-model="handoverChange.brandName" disabled style="width: 120px" :readonly="true" />
                </Form-item>
                <Form-item label="部门:" :label-width="50">
                    <Input v-model="handoverChange.departmentName" disabled style="width: 120px" :readonly="true" />
                </Form-item>
                <Form-item label="设计师:">
                    <Input v-model="handoverChange.designerName" disabled style="width: 120px" :readonly="true" />
                </Form-item>
                <Form-item label="企划:">
                    <Select v-model="handoverChange.name" style="width:120px" filterable>
                        <Option v-for="item in  Planning" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                </Form-item>
                <div style="color:red;margin-bottom:20px">修改后，该企划的所有未完成任务将直接触发给修改后企划！</div>
                <Row style="text-align:center">
                    <Form-item :label-width="1">
                        <Button :disabled=disabled type="primary" @click="handoverSave">确定</Button>
                    </Form-item>
                    <Form-item :label-width="1">
                        <Button type="default" @click="handoverCancel">取消</Button>
                    </Form-item>
                </Row>
                </Col>
            </Form>
        </Row>
        <div slot="footer"></div>
    </Modal>
    <!-- 新增 -->
    <Modal v-model="add_visible" title="新增" :width="870" class-name="customize-modal-center" @on-cancel="quxiao">
        <div>
            <add-component ref="childs" :departmentList="departmentList"></add-component>
        </div>
        <div slot="footer"></div>
    </Modal>
    <!-- 编辑 -->
    <Modal v-model="edit_visible" title="编辑" :width="870" class-name="customize-modal-center" @on-cancel="quxiao2">
        <div>
            <!-- <edit-component ref="child" :params="rowdata" :id="rowdata.departmentId" :planId="rowdata.plannerOaId"></edit-component> -->
            <Row class="margin-bottom-10 background-color-white exhibition">
                <Form :model="editformSearch" ref="editformSearch" :label-width="90" inline label-position="right" style="100px">
                    <Col span="24">
                    <Form-item label="品牌:" :label-width="50">
                        <!-- <Select v-model="editformSearch.brandId" style="width:120px"  filterable>
                                            <Option v-for="item in brandList" :value="item.brandId" :key="item.brandId">{{ item.brandName }}</Option>
                                    </Select> -->
                        <Input v-model="editformSearch.brandName" style="width: 120px" :readonly="true" />
                    </Form-item>
                    <Form-item label="部门:" :label-width="50">
                        <Input v-model="editformSearch.departmentName" style="width: 120px" :readonly="true" />
                    </Form-item>
                    <Form-item label="设计师:">
                        <Input v-model="editformSearch.designerName" style="width: 120px" :readonly="true" />
                    </Form-item>
                    <Form-item label="企划:">
                        <Select v-model="plannerOaId" style="width:120px" @on-change="selectPlaner(formSearch.planId)" filterable>
                            <Option v-for="item in  qihuaArray" :value="item.id" :key="item.id">{{item.name}}</Option>
                        </Select>
                    </Form-item>
                    <Row>
                        <Form-item :label-width="1" style="padding-left:280px">
                            <Button type="primary" @click="confirmedit">确定</Button>
                        </Form-item>
                        <Form-item :label-width="1">
                            <Button type="default" @click="cancel">取消</Button>
                        </Form-item>
                    </Row>
                    </Col>
                </Form>
            </Row>
        </div>
        <div slot="footer"></div>
    </Modal>
</div>
</template>

<script>
import Util from 'libs/util';
import addComponent from '../addComponent/addDesigner.vue';
// import editComponent from '../editComponent/editDesigner.vue';
function formSearch() {
    return {
        search: ''
    }
}
export default {
    data() {
        return {
            disabled: false,
            Planning: [], //企划
            qihuaArray: [], //企划的数组
            initdepartmentList: [],
            visible: false,
            red_packet_table_row_index: -1,
            loadingStatus: false,
            mystyle: {
                top: '70px',
            },
            add_visible: false,
            edit_visible: false,
            designer: [],
            planner: [],
            add_visible: false,
            plannerOaId: '',
            columns: [{
                    title: '序号',
                    type: 'index',
                    align: 'center',
                    minWidth: 60
                },
                {
                    title: '品牌',
                    key: 'brandName',
                    align: 'center',
                    minWidth: 160,
                },
                {
                    title: '部门',
                    key: 'departmentName',
                    align: 'center',
                    minWidth: 200,
                },
                {
                    title: '设计师',
                    key: 'designerName',
                    align: 'center',
                    minWidth: 150,
                },
                {
                    title: '企划',
                    key: 'plannerName',
                    align: 'center',
                    minWidth: 150,
                },
                {
                    title: '创建时间',
                    key: 'createdStr',
                    align: 'center',
                    minWidth: 220,
                },
                {
                    title: '修改时间',
                    key: 'lastUpdatedStr',
                    align: 'center',
                    minWidth: 250,
                },
                {
                    title: '操作',
                    key: 'operation',
                    align: 'center',
                    minWidth: 250,
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
                                        setTimeout(() => {
                                            this.edit_visible = true;
                                        })
                                        //this.rowdata=params.row
                                        this.editformSearch = params.row
                                        this.selectNext(params.row.departmentId)
                                        // this.red_packet_table_row_index = (this.page - 1) * this.pageSize + params.index;
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '4px'
                                },
                                on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            title: '提示',
                                            content: '该行将会删除，请确认！',
                                            onOk: () => {
                                                this.del(params.row.id);

                                            },
                                            onCancel: () => {
                                                this.$Message.warning('已取消删除');
                                            }

                                        })
                                    }
                                }
                            }, '删除'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '4px'
                                },
                                on: {
                                    click: () => {
                                        this.hanDover(params.row)
                                    }
                                }
                            }, '交接'),
                        ]);
                    }
                }
            ],
            departmentList: [],
            questionDescrible: false,
            IDS: [], //批量操作的id
            userInfo: {},
            list: [],
            total: 0,
            page: 1,
            pageSize: 10,
            formSearch: {},
            editformSearch: {},
            dealformSearch: {},
            backformSearch: {}, //回退数据
            brandList: [], //品牌列表
            modal_visible: false, // 编 
            handoverVisible: false, //交接弹框
            handoverChange: {},
            rowID: null,
            brandId: null,
        }
    },
    components: {
        addComponent,
        // editComponent
    },
    mounted() {
        this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
        this.getData()
        this.getbrandList()
        this.allUserList()
        this.allDealsList()
        this.formSearch.submit = this.userInfo.userId
        this.getDepartmentTree()
        this.initdepartlist()
    },
    activated() {

    },
    methods: {
        //交接
        hanDover(row) {
            this.handoverVisible = true
            console.log(row, '23456789')
            this.handoverChange.brandName = row.brandName
            this.handoverChange.departmentName = row.departmentName
            this.handoverChange.designerName = row.designerName
            this.rowID = row.id //当前行数据ID
            this.brandId = row.brandId //当前行数据ID
            // this.request('get_examine_post_list', {}, false).then((res) => {
            //       if (res.code== 1) {
            //                        this.qihuaArray  =res.data
            //         }
            //     }
            this.request('get_examine_post_list', {
                data: {
                    orgId: row.departmentId,
                }
            }, false).then((res) => {
                if (res.code == 1) {
                    this.Planning = res.data
                }
            })
        },
        handoverSave() {
            if (this.handoverChange.name == null) {
                this.$Message.warning('请先选择企划！')
            } else {
                this.disabled = true
                let data = {}
                data.id = this.rowID
                data.plannerOaId = this.handoverChange.name
                data.lastUpdateUser = this.userInfo.userName
                data.brandName = this.handoverChange.brandName
                data.brandId = this.brandId
                //交接确认接口
                this.request('handOverTaskt', {
                    data
                }, false).then((res) => {
                    if (res.code == '1') {
                        this.disabled = false
                        this.$Message.success(res.msg)
                        this.getData()
                        this.handoverVisible = false
                        this.rowID = null
                        this.brandId = null
                        this.handoverChange = {}
                    } else {
                        this.disabled = false
                        this.handoverVisible = false
                        this.rowID = null
                        this.brandId = null
                        this.handoverChange = {}
                    }
                })
            }
        },
        handoverCancel() {
            this.handoverChange = {}
            this.handoverVisible = false
            this.rowID = null
        },
        del(id) { //productlaunch_developDesignerConfig_deleteById
            this.request('productlaunch_developDesignerConfig_deleteById', {
                data: {
                    configId: id
                }
            }, false).then((res) => {
                if (res.code == 1) {
                    this.$Message.success('删除成功')
                    this.getData()
                    this.initdepartlist()
                }
            })
        },
        selectDepartment(searchQuery, instanceId) {
            console.log(searchQuery, instanceId)
        },
        selectnextRank(id) { //productlaunch_developDesignerConfig_designerListInit
            if (!id) return
            this.request('productlaunch_developDesignerConfig_designerListInit', {
                data: {
                    departmentId: id
                }
            }, false).then((res) => {
                if (res.code == 1) {
                    this.planner = res.data.plannerDTOS
                    this.designer = res.data.designerDTOS
                    // this.departmentList = Util.arrayToDepartmentTree(Util.deepClone(res.data))
                }
            })
        },
        addNew() {
            this.add_visible = true
        },
        getDepartmentTree() {
            this.request('get_department_tree_list', {}, false).then((res) => {
                if (res.errno == 0) {
                    this.departmentList = Util.arrayToDepartmentTree(Util.deepClone(res.data))
                }
            })
        },
        initdepartlist() {
            this.request('productlaunch_developDesignerConfig_departmentListInit', {}, false).then((res) => {
                if (res.code == 1) {
                    this.initdepartmentList = res.data
                }
            })
        },
        //重置表单
        resetFormdata() {
            this.formSearch = {}
        },
        handleReset() {
            this.formSearch = {};
            this.designer = [];
            this.planner = [];
            this.search()
            return

        },
        search() {
            this.page = 1
            this.getData()
        },
        currentChange(page) {
            this.page = page
            this.getData()
        },
        sizeChange(pageSize) {
            this.pageSize = pageSize
            this.getData()
        },
        //初始化品牌列表
        getbrandList() {
            this.request('get_scm_brand_list', {}, false).then((res) => {
                if (res.code == 1) {
                    this.brandList = res.data
                }
            })
        },
        //初始化全部用户列表
        allUserList() {
            this.request('business_get_user_list_all', {}, false).then((res) => {
                if (res.code == 1) {
                    this.allusersList = res.data
                }
            })
        },
        //初始化处理人列表
        allDealsList() {
            this.request('business_get_config_user_list', {}, false).then((res) => {
                if (res.code == 1) {
                    this.alldealList = res.data
                }
            })
        },
        //根据品牌ID返回品牌名称
        getBrandname(id) {
            for (let i = 0; i < this.brandList.length; i++) {
                if (id == this.brandList[i].brandId) {
                    return this.brandList[i].brandName
                }
            }
        },
        //初始化第一个列表数据
        getData() {
            let data = {}
            data.length = this.pageSize;
            data.start = (this.page - 1) * this.pageSize
            data.departmentId = this.formSearch.departmentId
            data.designerEopId = this.formSearch.designerEopId //类型
            data.plannerEopId = this.formSearch.plannerEopId
            this.request('productlaunch_developDesignerConfig_selectPage', {
                data: data
            }, true).then((res) => {
                if (res.code == 1) {
                    let serialNoBegain = this.pageSize * (this.page - 1);
                    res.data.designerConfigList.forEach((item) => {
                        serialNoBegain++;
                        item.serialNo = serialNoBegain;
                    })
                    this.list = res.data.designerConfigList;
                    this.total = res.data.count;
                } else {
                    this.list = []
                    this.total = '0'
                }
            })

        },
        quxiao() {
            this.$refs.childs.formSearch = {}
            this.$refs.childs.planer = []
            this.$refs.childs.designer = []
        },
        quxiao2() {
            //    this.editformSearch.brandId=''
            //    this.$refs.child.formSearch ={}
        },
        //编辑接口的问题
        confirmedit() {
            let data = {};
            data.lastUpdateUser = this.userInfo.userName
            data.id = this.editformSearch.id;
            data.plannerOaId = this.plannerOaId;
            data.brandId = this.editformSearch.brandId
            data.brandName = this.$refs.childs.getBrandName(this.editformSearch.brandId)
            if (!data.plannerOaId) return this.$Message.error('企划不能为空')
            this.request('productlaunch_developDesignerConfig_updateInfo', {
                data: data
            }, false).then((res) => {
                if (res.code == 1) {
                    this.formSearch = {};
                    this.edit_visible = false;
                    this.getData()
                }
            })
        },
        selectNext(id, orgLevelId) {
            if (!id) return
            this.request('get_examine_post_list', {
                data: {
                    orgId: id,
                }
            }, false).then((res) => {
                if (res.code == 1) {
                    this.qihuaArray = res.data
                    setTimeout(() => {
                        this.plannerOaId = this.editformSearch.plannerOaId
                    })

                }
            })
        },
        selectPlaner(obj) {
            if (!obj) return
            this.editformSearch.plannerOaId = obj
        },
        cancel() {
            this.edit_visible = false
            // this.editformSearch.brandId=''
        }
    }
}
</script>

<style>
.ivu-modal-footer {
    border-top: 0;
}

.demo-upload-list {
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
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
}

.demo-upload-list img {
    width: 100%;
    height: 100%;
}

.demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
    display: block;
}

.demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
</style>
