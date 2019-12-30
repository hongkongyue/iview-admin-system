<template>
<div>
    <Row class="margin-bottom-10 background-color-white exhibition">
        <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline label-position="right" style="100px">
            <Col span="24" style="padding-left:7px">
            <Form-item label="类型:" :label-width="50">
                <Select v-model="formSearch.type" style="width:120px">
                    <Option v-for="item in typeList" :value="item.type_id" :key="item.type_id">{{ item.type_name }}</Option>
                </Select>
            </Form-item>
            <Form-item :label-width="1">
                <Button type="primary" @click="search">查询</Button>
                <Button type="default" @click="handleReset">重置</Button>
                <Button type="primary" @click="addNew">新增</Button>
                <!-- <Button type="primary" @click="onDelete">删除</Button> -->
            </Form-item>
            </Col>
        </Form>

    </Row>
    <!-- 数据列表 -->
    <Row class="background-color-white exhibition">
        <Table :columns="columns" size="small" highlight-row :data="list" @on-selection-change="selectRow" @on-row-dblclick="edit"></Table>
        <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
    </Row>
    <Modal v-model="addVisible" title="新增" @on-cancel='cancelAdd()' footer-hide :width="880" class-name="customize-modal-center">
        <Row class="margin-bottom-10 background-color-white exhibition">
            <Form ref="formList" :model="formList" :rules="rule" :label-width="90" inline label-position="right" style="50px">
                <FormItem label="类型:" prop="type">
                    <Select v-model="formList.type" style="width:180px">
                        <Option v-for="item in typeList" :value="item.type_id" :key="item.type_id">{{item.type_name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="退货原因:" prop="reason">
                    <Input v-model="formList.reason" type="textarea" :autosize="{minRows: 1,maxRows: 2}" style="width:400px"></Input>
                </FormItem>
                <div style="text-align:center">
                    <Button type="primary" @click="saveAdd('formList')">确认</Button>
                    <Button @click="cancelAdd('formList')">取消</Button>
                </div>
            </Form>
        </Row>
    </Modal>
    <Modal v-model="editVisible" title="编辑"  @on-cancel='cancelEdit' footer-hide :width="880" class-name="customize-modal-center">
        <Row class="margin-bottom-10 background-color-white exhibition">
            <Form :model="editList" ref="editList" :rules="rule" :label-width="90" inline label-position="right" style="50px">
                <Form-item label="类型:" prop="type">
                    <Select v-model="editList.type" disabled style="width:180px">
                        <Option v-for="item in typeList" :value="item.type_id" :key="item.type_id">{{ item.type_name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="退货原因:" prop="reason">
                    <Input v-model="editList.reason" type="textarea" :autosize="{minRows: 1,maxRows: 2}" style="width:400px"></Input>
                </Form-item>
            </Form>
            <div style="text-align:center">
                <Button type="default" @click="cancelEdit">取消</Button>
                <Button type="primary" @click="saveEdit">保存</Button>
            </div>
        </Row>
    </Modal>

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
    name: 'brand',
    data() {
        return {
            selList:[],//选中数据
            rowID:'',
            typeList: [],
            addVisible: false,
            editVisible: false,
            columns: [
                // {
                //     title: 'ID',
                //     key: 'brandId',
                //     align: 'center',
                //     width: 120,
                // },
                // {
                //     type: 'selection',
                //     width: 60,
                //     align: 'center'
                // },
                {
                    title: '序号',
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '类型',
                    key: 'type_name',
                    align: 'center',
                    minWidth: 80,
                },
                {
                    title: '退货原因',
                    key: 'return_reason',
                    align: 'center',
                    minWidth: 120,
                },
                {
                    title: '操作',
                    key: 'operate',
                    minWidth: 150,
                    fixed: 'right',
                    align: 'center',
                    render: (h, params) => {
                        // render: (h, params) => {
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
                                    click: (e) => {
                                        this.edit(params.row);
                                        e.stopPropagation()
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
                                        this.onDelete(params.row);
                                        e.stopPropagation()
                                    }
                                }
                            }, '删除')
                        ])
                    }
                }
                // }
            ],
            userInfo: {},
            visible: false,
            list: [],
            total: 0,
            page: 1,
            pageSize: 10,
            formList: {
                type: '',
                reason: ''
            },
            editList: {
                type: '',
                reason: ''
            },
            rule: {
                type: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change',
                    type: 'number'
                }],
                reason: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    },
                    {
                        type: 'string',
                        min: 1,
                        max: 10,
                        message: '最大长度为10',
                        trigger: 'blur'
                    }
                ]
            },
            formSearch: {},
        }
    },
    mounted() { //
        this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
        // this.getData()
        this.getTypeList()
    },
    activated() {

    },
    methods: {
        //新增
        addNew() {
            this.addVisible = true
        },
        //新增保存
        saveAdd() {
            console.log()
            this.$refs["formList"].validate((valid) => {
                console.log(valid)
                if (valid) {
                    let data = {} //保存接口
                    data.type_id = this.formList.type
                    data.return_reason = this.formList.reason
                    data.create_user = this.userInfo.userName
                    this.request('add_return_reason', {
                        data
                    }, false).then((res) => {
                        if (res.code == '1') {
                            this.$message.success(res.msg)
                            this.getData()
                        } else {
                            this.$message.error(res.msg)
                        }
                        this.$refs["formList"].resetFields();
                        this.addVisible = false
                        this.formList = {
                            type: '',
                            reason: ''
                        }
                    })
                } else {
                    console.log('ppp')
                }
            })
        },
        //新增取消
        cancelAdd() {
            this.$refs["formList"].resetFields();
            this.addVisible = false;
            this.formList = {
                            type: '',
                            reason: ''
                        }
        },
        //编辑
        edit(row){
            console.log(row,'0990909090')
            this.editVisible = true
            this.editList.type = row.type_id
            this.editList.reason = row.return_reason
            this.rowID = row.id
        },
        saveEdit(){
            this.$refs["editList"].validate((valid) => {
                if (valid) {
                    let data = {} //保存接口
                    data.id = this.rowID
                    data.return_reason = this.editList.reason
                    data.last_update_user = this.userInfo.userName
                    this.request('edit_return_reason', {
                        data
                    }, false).then((res) => {
                        if (res.code == '1') {
                            this.$message.success(res.msg)
                            this.getData()
                        } else {
                            this.$message.error(res.msg)
                        }
                        this.$refs["editList"].resetFields();
                        this.editVisible = false
                        this.editList = {
                            type: '',
                            reason: ''
                        }
                    })
                } else {
                    console.log('ppp')
                }
            })
        },
        cancelEdit(){
            this.$refs["editList"].resetFields();
            this.editVisible = false
        },
        //删除
        onDelete(row){
            let data = {}
            data.id = row.id
            data.last_update_user = this.userInfo.userName
            this.request('delete_return_reason', {
                data
            }, false).then((res) => {
                if (res.code == '1') {
                    this.getData()
                    this.$Message.success(res.msg)
                }else{
                    this.$Message.error(res.msg)
                }
            })
        },
        //获取列表数据
        getData() {
            let data = {}
            data.type_id = this.formSearch.type //类型ID
            data.start = (this.page - 1) * this.pageSize
            data.length = this.pageSize
            this.request('get_return_reason_list', {
                data
            }, false).then((res) => {
                if (res.code == '1') {
                    this.list = res.data.returnReasonList
                    this.total = res.data.count
                }
            })
        },
        getTypeList() {
            this.request('get_return_type_list', {}, false).then((res) => {
                if (res.code == '1') {
                    this.typeList = res.data
                }
            })
        },
        selectRow(selection) {
            this.selList = selection
            console.log(selection,'[p[p[p')
            console.log(selection.length)
        },
        //重置
        handleReset() {
            this.page = 1
            this.pageSzie = 10
            this.formSearch = {}
        },
        //搜索
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
    }
}
</script>

<style>

</style>
