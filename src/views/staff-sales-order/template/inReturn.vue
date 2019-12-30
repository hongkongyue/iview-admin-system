<template>
<div>
    <Row class="margin-bottom-10 background-color-white exhibition">
        <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="80" inline label-position="right" style="100px">
            <Col span="24" style="padding-left:7px">

            <Form-item label="退货单号：">
                <Input v-model="formSearch.returnCode" placeholder="退货单号"></Input>
            </Form-item>
            <Form-item label="原始订单编号：" :label-width="120">
                <Input v-model="formSearch.orderId" placeholder="原始订单编号"></Input>
            </Form-item>
            <Form-item label="物流单号：">
                <Input v-model="formSearch.logistics" placeholder="物流单号"></Input>
            </Form-item>
            <Form-item label="单据状态：" :label-width="80">
                <Select v-model="formSearch.orderStatus" style="width:120px">
                    <Option v-for="item in orderStatusList" :value="item.status_code" :key="item.status_code">{{ item.status_name }}</Option>
                </Select>
            </Form-item>
            <Form-item label="退货日期：">
                <DatePicker v-model="formSearch.time" type="datetimerange" format="yyyy-MM-dd" placeholder="开始日期-结束日期" style="width: 200px"></DatePicker>
            </Form-item>
            <Form-item :label-width="1">
                <Button type="primary" @click="search">查询</Button>
                <Button type="default" @click="handleReset">重置</Button>
                <Button type="primary" @click="cancelReturnA">取消退货</Button>
                <!-- <Button type="primary" @click="onDelete">删除</Button> --> 
            </Form-item>
            </Col>
        </Form>

    </Row>
     <Modal v-model="visible" title="取消退货" @on-cancel='cancelReturn()' footer-hide :width="280" class-name="customize-modal-center">
        <Row class="margin-bottom-10 background-color-white exhibition">
                <div style="text-align:center;margin-bottom:40px">是否取消退货？</div>
                <div style="text-align:center">
                    <Button type="primary" @click="saveReturn()">确认</Button>
                    <Button @click="cancelReturn()">取消</Button>
                </div>
        </Row>
    </Modal>
    <!-- 数据列表 -->
    <Row class="background-color-white exhibition">
        <Table :columns="columns" size="small" highlight-row :data="list" @on-selection-change="selectRow" @on-row-dblclick="edit"></Table>
        <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
    </Row>
</div>
</template>

<script>
import Util from '../../../libs/util';
import inReturnDetailVue from './inReturnDetail.vue';

function formSearch() {
    return {
        search: ''
    }
}
export default {
    name: 'brand',
    data() {
        return {
            visible:false,
            getSelList:[],
            columns: [
                // {
                //     title: 'ID',
                //     key: 'brandId',
                //     align: 'center',
                //     width: 120,
                // },
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '序号',
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '退货单号',
                    key: 'return_code',
                    align: 'center',
                    minWidth: 120,
                },
                {
                    title: '原始订单编号',
                    key: 'source_return_code',
                    align: 'center',
                    minWidth: 120,
                },
                {
                    title: '退货日期',
                    key: 'created',
                    align: 'center',
                    minWidth: 120,
                },
                {
                    title: '退货金额',
                    key: 'total_money',
                    align: 'center',
                    minWidth: 100,
                },
                {
                    title: '单据状态',
                    key: 'order_status',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('span', {}, Util.returnOrderStatus(params.row.order_status));
                    }
                },
                {
                    title: '退货人',
                    key: 'create_user',
                    align: 'center',
                    minWidth: 80,
                },
                {
                    title: '物流公司',
                    key: 'logistics_company',
                    align: 'center',
                    minWidth: 80,
                },
                {
                    title: '物流单号',
                    key: 'logistics_no',
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
                                        this.turnAlround(params.row)
                                        // this.edit(params.row);
                                        // e.stopPropagation()
                                    }
                                }
                            }, '查看')
                        ])
                    }
                }
                // }
            ],
            userInfo: {},
            visible: false,
            list: [],
            detailList: [],
            newList: [],
            total: 0,
            page: 1,
            pageSize: 10,
            formItem: {},
            formList: {},
            formSearch: {
                returnCode:'',
                orderId:'',
                logistics:'',
                orderStatus:'',
                time:['','']
            },
            submit_data: {},
            orderStatusList:[],
        }
    },
    mounted() {
        
        this.formSearch = {
                returnCode:'',
                orderId:'',
                logistics:'',
                orderStatus:'',
                time:['','']
            }
        this.formSearch.orderId = this.$route.query.orderId
        this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
        this.getReturnStatus()
        if(this.$route.query.orderId.length > 0){
            this.getGoodsFollowList()
        }
    },
    activated() {

    },
    methods: {
        //取消退货
        cancelReturnA(){
            console.l
            if(this.getSelList.length == 0){
                this.$Message.error('请先选择取消退货数据！')
            }else{
                this.visible = true
            }
        },
        saveReturn(){
            let data = {}
            data.return_code = this.getSelList
            data.last_update_user = this.userInfo.userName
            this.request('cancel_return_order', {data}, false).then((res) => {
                if (res.code == '1') {
                    this.getGoodsFollowList()
                    this.$Message.success(res.msg)
                }else{
                    this.$Message.error(res.msg)
                }
                this.visible = false
            })
        },
        cancelReturn(){
            this.visible = false
        },
        getReturnStatus(){
            this.request('get_return_status_list', {}, false).then((res) => {
                if (res.code == '1') {
                    this.orderStatusList = res.data
                }
            })
        },
        turnAlround(code) {
            this.$router.push({
                name: 'inReturnDetail',
                query: {
                    row : code
                }
            });
        },
        selectRow(selection) {
            let List = []
            selection.map((item) => {
                List.push(item.return_code)
            });
            this.getSelList = List
            console.log(this.getSelList)
        },
        //重置
        handleReset() {
            this.page = 1
            this.pageSzie = 10
            this.formSearch = {
                returnCode:'',
                orderId:'',
                logistics:'',
                orderStatus:'',
                time:['','']
            }
        },
        //搜索
        search() {
            this.page = 1
            this.getGoodsFollowList()
        },
        currentChange(page) {
            this.page = page
            this.getGoodsFollowList()
        },
        sizeChange(pageSize) {
            this.pageSize = pageSize
            this.getGoodsFollowList()
        },
        //查询
        getGoodsFollowList() {
            console.log(!this.formSearch.time[0])
            let data = {}
            data.start = (this.page - 1) * this.pageSize
            data.length = this.pageSize
            data.return_code = this.formSearch.returnCode //退货单号
            data.source_return_code = this.formSearch.orderId //原始订单编号
            data.logistics_no = this.formSearch.logistics //物流单号
            data.order_status = this.formSearch.orderStatus //状态
            !!this.formSearch.time[0] ? data.start_date = Util.dateFormat(this.formSearch.time[0], 'yyyy-MM-dd') : this.formSearch.time[0]
            !!this.formSearch.time[0] ? data.end_date = Util.dateFormat(this.formSearch.time[1], 'yyyy-MM-dd') : this.formSearch.time[1]
            // this.formSearch.time ? data.start_date = Util.dateFormat(this.formSearch.time[0], 'yyyy-MM-dd') : delete data.start_date
            // this.formSearch.time ? data.end_date = Util.dateFormat(this.formSearch.time[1], 'yyyy-MM-dd') : delete data.end_date
            this.request('get_return_list', data = {
                data
            }, true).then((res) => {
                if (res.code == 1) {
                    this.list = res.data.eomReturnOrderList
                    this.total = res.data.count
                } else {
                    this.list = []
                    this.total = '0'
                }
            })
        },
    }
}
</script>

<style>

</style>
