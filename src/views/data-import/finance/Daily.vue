<template>
    <div class="background-color-white exhibition" id="daily">
        <Row class="margin-bottom-10">
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Col>
                    <Form-item label="时间：" :label-width="50">
                        <DatePicker
                                type="datetime"
                                format="yyyy-MM-dd"
                                placeholder="开始日期"
                                style="width: 170px"
                                v-model="formSearch.startDate"
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
                        >
                        </DatePicker>
                    </Form-item>
                    <Form-item label="品牌：" :label-width='60'>
                        <Select v-model="formSearch.brandId" style="width:150px">
                            <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="仓库:" :label-width="50" v-if="activeTable == 'labor'">
                        <Select v-model="formSearch.warehouseCode" style="width:150px">
                            <Option v-for="item in formSearch_warehouse" :value="item.warehouse_code"
                                    :key="item.warehouse_code">{{
                                item.warehouse_name }}
                            </Option>
                        </Select>
                    </Form-item>
                      <Form-item label="平台:" :label-width="50" v-if="activeTable == 'ad_fee'">
                        <Select v-model="formSearch.platformCode" style="width:150px">
                            <Option v-for="item in platformList" :value="item.PLATFROM_ID"
                                    :key="item.PLATFROM_ID">{{
                                item.PLATFROM_NAME }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item :label-width="10">
                        <Button type="primary" icon="ios-search" @click="search">查询</Button>
                        <Button type="warning" @click="reset">重置</Button>
                    </Form-item> 
                </Col>
            </Form>
        </Row>
        <Row>
            <div v-if='activeTable == "labor"'>
                <Button type="primary" @click="downTemplate('劳务费')">劳务费导入模板</Button>
                <Button type="primary" @click="openModal('劳务费导入')">劳务费导入</Button>            
            </div>
            <div v-if='activeTable == "red_packet"'>
                <Button type="primary" @click="openModal('红包导入')">红包导入</Button>
                <Button type="primary" @click="downTemplate('红包')">红包导入模板</Button>
            </div>
            <div v-if='activeTable == "refundCash"'>
                <Button type="primary" @click="addRefundCash">新增</Button>
                <Button type="primary" @click="downTemplate('退款+返现')">下载模板</Button>
                <Button type="primary" @click="openModal('退款+返现')">导入</Button>  
                <Button type="primary" @click="exportRefundCashData">导出</Button>
            </div>
            <div v-if='activeTable == "billVariable"'>
                <Button type="primary" @click="addBillVariable">新增</Button>                
                <Button type="primary" @click="downTemplate('账单变动项')">下载模板</Button>
                <Button type="primary" @click="openModal('账单变动项')">导入</Button>  
                <Button type="primary" @click="exportBillVariableData">导出</Button> 
            </div>
            <div v-if='activeTable == "daily_pinduoduo"'>
                <Button type="primary" @click="downTemplate('拼多多')">下载导入模板</Button>
                <Button type="primary" @click="openModal('拼多多导入')">导入</Button>
                <Button type="primary" @click="export_daily_pinduoduo">导出</Button>                
            </div>
            <div v-if='activeTable == "ad_fee"'>
                <Button type="primary" @click="downTemplate('广告费')">下载导入模板</Button>
                <Button type="primary" @click="openModal('广告费导入')">导入</Button>
                <!-- <Button type="primary" @click="export_daily_pi">导出</Button>                 -->
            </div>
            <div v-if='activeTable == "lost"'>
                <Button type="primary" @click="downTemplate('报废损失')">下载导入模板</Button>
                <Button type="primary" @click="openModal('报废损失导入')">导入</Button>
                <Button type="primary" @click="export_daily_lost">导出</Button>                
            </div>
        </Row>
        <Row class="margin-top-10">
            <Tabs type="card" @on-click="tabClick" :value="activeTable">
                <TabPane label="微信红包" name="red_packet">
                    <Col class="margin-bottom-10">
                        <Table :columns="red_packet_columns" size="small" :data="red_packet_List"></Table>
                    </Col>
                    <Col>
                        <Page :page-size-opts="[16,32,48,64]" :total="red_packet_total" :page-size="red_packet_pageSize" :current="red_packet_page"  show-sizer show-total show-elevator @on-change="red_packet_CurrentChange" @on-page-size-change="red_packet_SizeChange"></Page>
                    </Col>
                </TabPane>
                <TabPane label="劳务费" name="labor">
                    <Row>
                        <Col class="margin-bottom-10">
                            <Table :columns="labor_columns" size="small" :data="labor_List"></Table>
                        </Col>
                        <Col>
                            <Page :page-size-opts="[16,32,48,64]" :total="labor_total" :page-size="labor_pageSize" :current="labor_page"  show-sizer show-total show-elevator @on-change="labor_CurrentChange" @on-page-size-change="labor_SizeChange"></Page>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane label="退款+返现" name="refundCash">
                    <refundCash :formSearch='this.formSearch' :brandList='brandList' ref='refundCash'></refundCash>
                </TabPane>
                <TabPane label="账单变动项" name="billVariable">
                    <billVariable :formSearch='this.formSearch' :brandList='brandList' ref='billVariable'></billVariable>
                </TabPane>
                <TabPane label="拼多多" name="daily_pinduoduo">
                    <daily_pinduoduo :formSearch='this.formSearch' ref='daily_pinduoduo'></daily_pinduoduo>
                </TabPane>
                <TabPane label="广告费" name="ad_fee">
                    <ad_fee :formSearch='this.formSearch' ref='daily_ad_fee'>广告费</ad_fee>
                </TabPane>
                <TabPane label="报废损失" name="lost">
                    <lost :formSearch='this.formSearch'  ref='lost'>报废损失</lost>
                </TabPane>
            </Tabs>
        </Row>
        <div class="modal">
            <Modal
                    v-model="modal_visible"
                    :title="modal_title">
                <div>
                    <Upload
                            ref="upload"
                            name="file"
                            :show-upload-list="false"
                            :before-upload="handleUpload"
                            :on-success="uploadSuccess"
                            :on-error="uploadError"
                            type="drag"
                            :action="import_url"
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
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import Util from 'libs/util';
    import base from 'libs/base';
    import refundCash from './refundCash';
    import billVariable from './bill_variable';
    import daily_pinduoduo from './pinduoduo';
    import ad_fee from './ad_fee'
    import lost from './lost.vue'

    function formSearch(){
        return {
            warehouseCode:'',           //  仓库code
            brandId:0,                 //  品牌id
            endDate:'',                 //	结束日期
            startDate:''                //  开始日期
        }
    }


    export default {
        name:'Daily',
        data(){
            return {
                formSearch:formSearch(),
                activeTable:'red_packet',
                red_packet_total:0,
                red_packet_pageSize:16,
                red_packet_page:1,
                labor_total:0,
                labor_pageSize:16,
                labor_page:1,
                red_packet_List:[],
                red_packet_columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '日期',
                        key: 'dateTime',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '仓库',
                        key: 'warehouseName',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => {
                            if ((this.red_packet_page - 1) * this.red_packet_pageSize + params.index == this.red_packet_table_row_index) {
                                    return h('Select', {
                                        props:{
                                            value: this.red_packet_List[params.index].warehouseCode,
                                            size: 'small'
                                        },
                                        on: {
                                            'on-change':(value) => {
                                                this.red_packet_List[params.index].warehouseCode = value;
                                                this.warehouse.map(x=>{
                                                    if(x.warehouse_code == value){
                                                        this.red_packet_List[params.index].warehouseName = x.warehouse_name;
                                                    }
                                                })
                                            }
                                        },
                                    },
                                    this.warehouse.map(function(item){
                                        return h('Option', {
                                            props: {value: item.warehouse_code}
                                        }, item.warehouse_name);
                                    })
                                );
                            } else {
                                return h('span', params.row.warehouseName)
                            }
                        }
                    },
                    {
                        title: '领取',
                        key: 'getPrice',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            if ((this.red_packet_page - 1) * this.red_packet_pageSize + params.index == this.red_packet_table_row_index) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.red_packet_List[params.index].getPrice,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.red_packet_List[params.index].getPrice = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.getPrice)
                            }
                        }
                    },
                    {
                        title: '使用',
                        key: 'usePrice',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            if ((this.red_packet_page - 1) * this.red_packet_pageSize + params.index == this.red_packet_table_row_index) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.red_packet_List[params.index].usePrice,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.red_packet_List[params.index].usePrice = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.usePrice)
                            }
                        }
                    },
                    {
                        title: '导入人',
                        key: 'createUser',
                        align: 'center',
                        minWidth: 150
                    },{
                        title: '导入日期',
                        key: 'created',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        minWidth: 200,
                        render: (h, params) => {
                            if(params.row.serialNo == '合计'){
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
                                            this.red_packet_table_row_index = (this.red_packet_page - 1) * this.red_packet_pageSize + params.index;
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
                                            data.lastUpdateUser = this.userInfo.userName;
                                            delete data.serialNo;
                                            delete data._index;
                                            delete data._rowKey;
                                            this.request('edit_cost_weixin',{
                                                data:data
                                            },true).then(res=>{
                                                if(res.code == 1){
                                                    this.$Message.success(res.msg);
                                                    this.red_packet_table_row_index = -1;
                                                    let Data = {};
                                                    Data.start = (this.red_packet_page - 1) * this.red_packet_pageSize;
                                                    Data.length = this.red_packet_pageSize;
                                                    Data = Object.assign(Data,this.formSearch);
                                                    this.getred_packetData(Data);
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
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '该行将会删除，请确认！',
                                                onOk: () => {
                                                    this.request('delete_cost_weixin',{
                                                        data:{
                                                            id:params.row.id,
                                                            lastUpdateUser:this.userInfo.userAccount
                                                        }
                                                    },true).then(res=>{
                                                        if(res.code == 1){
                                                            this.$Message.success(res.msg);
                                                            let Data = {};
                                                            Data.start = (this.red_packet_page - 1) * this.red_packet_pageSize;
                                                            Data.length = this.red_packet_pageSize;
                                                            Data = Object.assign(Data,this.formSearch);
                                                            this.getred_packetData(Data);
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
                labor_List:[],
                labor_columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        width: 60
                    },
                    {
                        title: '日期',
                        key: 'dateTime',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '仓库',
                        key: 'warehouseName',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => {
                            if ((this.labor_page - 1) * this.labor_pageSize + params.index == this.labor_table_row_index) {
                                    return h('Select', {
                                        props:{
                                            value: this.labor_List[params.index].warehouseCode,
                                            size: 'small'
                                        },
                                        on: {
                                            'on-change':(value) => {
                                                this.labor_List[params.index].warehouseCode = value;
                                                this.warehouse.map(x=>{
                                                    if(x.warehouse_code == value){
                                                        this.labor_List[params.index].warehouseName = x.warehouse_name;
                                                    }
                                                })
                                            }
                                        },
                                    },
                                    this.warehouse.map(function(item){
                                        return h('Option', {
                                            props: {value: item.warehouse_code}
                                        }, item.warehouse_name);
                                    })
                                );
                            } else {
                                return h('span', params.row.warehouseName)
                            }
                        }
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 150
                    },
                    // {
                    //     title: '岗位',
                    //     key: 'salesIncome',
                    //     align: 'center',
                    //     minWidth: 150
                    // },
                    // {
                    //     title: '人数',
                    //     key: 'salesCost',
                    //     align: 'center',
                    //     minWidth: 150
                    // },
                    {
                        title: '工资总额',
                        key: 'totalPay',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => {
                            if ((this.labor_page - 1) * this.labor_pageSize + params.index == this.labor_table_row_index) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.labor_List[params.index].totalPay,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.labor_List[params.index].totalPay = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.totalPay)
                            }
                        }
                    },
                    {
                        title: '导入人',
                        key: 'createUser',
                        align: 'center',
                        minWidth: 150
                    },{
                        title: '导入日期',
                        key: 'created',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        minWidth: 200,
                        render: (h, params) => {
                            if(params.row.serialNo == '合计'){
                                return h('div','')
                            }else{
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
                                                this.labor_table_row_index = (this.labor_page - 1) * this.labor_pageSize + params.index;
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
                                                data.lastUpdateUser = this.userInfo.userName;
                                                delete data.serialNo;
                                                delete data._index;
                                                delete data._rowKey;
                                                this.request('edit_cost_service',{
                                                    data:data
                                                },true).then(res=>{
                                                    if(res.code == 1){
                                                        this.$Message.success(res.msg);
                                                        this.labor_table_row_index = -1;
                                                        let Data = {};
                                                        Data.start = (this.labor_page - 1) * this.labor_pageSize;
                                                        Data.length = this.labor_pageSize;
                                                        Data = Object.assign(Data,this.formSearch);
                                                        this.getlaborData(Data);
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
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.$Modal.confirm({
                                                    title: '提示',
                                                    content: '该行将会删除，请确认！',
                                                    onOk: () => {
                                                        this.request('delete_cost_service',{
                                                            data:{
                                                                id:params.row.id,
                                                                lastUpdateUser:this.userInfo.userAccount
                                                            }
                                                        },true).then(res=>{
                                                            if(res.code == 1){
                                                                this.$Message.success(res.msg);
                                                                let Data = {};
                                                                Data.start = (this.labor_page - 1) * this.labor_pageSize;
                                                                Data.length = this.labor_pageSize;
                                                                Data = Object.assign(Data,this.formSearch);
                                                                this.getlaborData(Data);
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
                    }
                ],
                modal_visible:false,
                modal_title:'',
                ruleValidate: {
                    salesCommission: [
                        { required: true, message: '请输入销售佣金', trigger: 'blur' }
                    ],
                    insurance: [
                        { required: true, message: '请输入保险理赔', trigger: 'blur' }
                    ],
                    tmAdFee: [
                        { required: true, message: '请输入广告费', trigger: 'blur' }
                    ],
                    salesIncome: [
                        { required: true, message: '请输入销售收入', trigger: 'blur' }
                    ],
                    salesCost: [
                        { required: true, message: '请输入销售成本', trigger: 'blur' }
                    ],
                    vipAdFee: [
                        { required: true, message: '请输入广告费', trigger: 'blur' }
                    ]
                },
                formSearch_warehouse:[],
                warehouse:[],
                import_url:'',
                file:null,
                loadingStatus: false,
                userInfo:{},
                brandList:[],
                red_packet_table_row_index:-1,
                labor_table_row_index:-1,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6 - 1000 * 60 * 60 * 24
                    }
                },
                platformList:[]
            }
        },
        computed:{
            
        },
        mounted(){
            this.getBrandList();
            var formSearch = Util.deepClone(this.formSearch);  
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));     
            let Data = {};
            Data.start = (this.red_packet_page - 1) * this.red_packet_pageSize;
            Data.length = this.red_packet_pageSize;
            Data = Object.assign(Data,formSearch);
            this.getred_packetData(Data);
            this.formSearch_warehouse = base.formSearch_warehouse;
            this.warehouse = base.warehouse;
        },
        methods:{
            setFormData(val){
                var formSearch = Util.deepClone(this.formSearch);
                let Data = {};      
                if(val == 'red_packet'){
                    Data.length = this.red_packet_pageSize;
                    Data = Object.assign(Data,formSearch);
                }else{
                    Data.length = this.labor_pageSize;
                    Data = Object.assign(Data,formSearch);
                }
                return Data
            },
            search(){
                let Data = this.setFormData(this.activeTable);
                if(this.activeTable == 'red_packet'){
                    this.red_packet_page = 1;
                    Data.start = 0;
                    this.getred_packetData(Data);
                }else if(this.activeTable == 'labor'){
                    this.labor_page = 1;
                    Data.start = 0;
                    this.getlaborData(Data);
                }else if(this.activeTable == 'refundCash'){
                    this.$refs['refundCash'].search();
                }else if(this.activeTable == 'billVariable'){
                    this.$refs['billVariable'].search();
                }else if(this.activeTable == 'daily_pinduoduo'){
                    this.$refs['daily_pinduoduo'].search();
                }else if(this.activeTable == 'ad_fee'){
                    this.$refs['daily_ad_fee'].search();
                }else if(this.activeTable == 'lost'){
                    this.$refs['lost'].search();
                }
            },
            reset(){
                this.formSearch = formSearch();
                this.page = 1;
                if(this.activeTable == 'red_packet'){
                    let Data = {};
                    Data.start = 0;
                    Data.length = this.red_packet_pageSize;
                    Data = Object.assign(Data,this.formSearch);
                    this.getred_packetData(Data);
                }else if(this.activeTable == 'labor'){
                    let Data = {};
                    Data.start = 0;
                    Data.length = this.labor_pageSize;
                    Data = Object.assign(Data,this.formSearch);
                    this.getlaborData(Data);
                }else if(this.activeTable == 'refundCash'){
                    this.$refs['refundCash'].reset();
                }else if(this.activeTable == 'billVariable'){
                    this.$refs['billVariable'].reset();
                }else if(this.activeTable == 'lost'){
                    this.$refs['lost'].reset();
                }
            },
            getred_packetData(data){
                if(data.startDate){
                    data.startDate = Util.dateFormat(data.startDate,'yyyy-MM-dd');
                }
                if(data.endDate){
                    data.endDate = Util.dateFormat(data.endDate,'yyyy-MM-dd');
                }
                if(this.formSearch.startDate > this.formSearch.endDate){
                    this.$Message.warning('日期选择有误，请重新选择！');
                    return false;
                }
                data.brandId == 0 ? data.brandId = '' : data.brandId = data.brandId;        
                
                this.request('get_cost_weixin',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        let serialNoBegain = this.red_packet_pageSize * (this.red_packet_page - 1);
                        res.data.costWeixinList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.red_packet_total = res.data.count;
                        this.red_packet_List = res.data.costWeixinList;
                        let lastPage = Math.ceil(this.red_packet_total / this.red_packet_pageSize);

                        if(this.red_packet_page == lastPage){
                            let costWeixinTotal = res.data.costWeixinTotal;
                            costWeixinTotal.serialNo = '合计';
                            this.red_packet_List.push(costWeixinTotal);
                        }
                    }
                })
            },
            getlaborData(data){
                if(data.startDate){
                    data.startDate = Util.dateFormat(data.startDate,'yyyy-MM-dd');
                }
                if(data.endDate){
                    data.endDate = Util.dateFormat(data.endDate,'yyyy-MM-dd');
                }
                if(this.formSearch.startDate > this.formSearch.endDate){
                    this.$Message.warning('日期选择有误，请重新选择！');
                    return false;
                }
                data.brandId == 0 ? data.brandId = '' : data.brandId = data.brandId;        
                
                this.request('get_cost_service',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        let serialNoBegain = this.labor_pageSize * (this.labor_page - 1);
                        res.data.costServiceList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.labor_total = res.data.count;
                        this.labor_List = res.data.costServiceList;
                        let lastPage = Math.ceil(this.labor_total / this.labor_pageSize);

                        if(this.labor_page == lastPage){
                            let costServiceTotal = res.data.costServiceTotal;
                            costServiceTotal.serialNo = '合计';
                            this.labor_List.push(costServiceTotal);
                        }
                    }
                })
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
            getPlatformList(){
            this.request('get_platform_list',{},false).then((res)=>{
              if(res.code=='1'){
                  this.platformList = res.data
                  this.platformList.unshift({
                        PLATFROM_ID:0,
                        PLATFROM_NAME:'所有平台'
                　　})
              }
            })
            },
            downTemplate(type){
                if(type == '红包'){
                    window.location = ('/excel/微信红包导入模板.xlsx');
                }else if(type == '劳务费'){
                    window.location = ('/excel/劳务费导入模板.xlsx');
                }else if(type == '退款+返现'){
                    this.$refs['refundCash'].downTemplate();
                }else if(type == '账单变动项'){
                    window.location = ('/excel/账单变动项导入模板.xlsx');
                }else if(type == '拼多多'){
                    window.location = ('/excel/日报项拼多多导入模板.xlsx');
                }else if(type == '广告费'){
                    window.location = ('/excel/日报项广告费导入模板.xlsx');
                }else if(type == '报废损失'){
                    window.location = ('/excel/报废损失导入模板.xlsx');
                }
            },
            openModal(type){
                this.modal_title = type;
                if(type == '红包导入'){
                    this.modal_visible = true;
                    this.import_url = '/eop/bi/import_cost_weixin'
                }else if(type == '劳务费导入'){
                    this.import_url = '/eop/bi/import_cost_service'
                    this.modal_visible = true;
                }else if(type == '退款+返现'){
                    this.$refs['refundCash'].importData();
                }else if(type == '账单变动项'){
                    this.$refs['billVariable'].importData();
                }else if(type == '拼多多导入'){
                    this.$refs['daily_pinduoduo'].importData();
                }else if(type=='广告费导入'){
　　　　　　　　　　　　this.$refs['daily_ad_fee'].importData();
                }else if(type=='报废损失导入'){
　　　　　　　　　　　　this.$refs['lost'].importData();
                }
            },
            cancel(){
                this.modal_visible = false;
                this.file = null;                
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
                    this.modal_visible = false;
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
            tabClick(val){
                this.activeTable = val;
                let Data = this.setFormData(val);
                if (this.activeTable == 'red_packet') {
                    Data.start = (this.red_packet_page - 1) * this.red_packet_pageSize;
                    this.getred_packetData(Data);
                } else if (this.activeTable == 'labor') {
                    Data.start = (this.labor_page - 1) * this.labor_pageSize;
                    this.getlaborData(Data);
                } else if (this.activeTable == 'refundCash') {
                    this.$refs['refundCash'].getData();
                } else if (this.activeTable == 'billVariable') {
                    this.$refs['billVariable'].getData();
                } else if (this.activeTable == 'ad_fee') {
                    if(this.platformList.length<=0){
                       this.getPlatformList()
                    }
                    this.$refs['daily_ad_fee'].getData();
                }else if (this.activeTable == 'lost') {
                    if(this.platformList.length<=0){
                       this.getPlatformList()
                    }
                    this.$refs['lost'].getData();
                }
            },
            red_packet_CurrentChange(val){
                this.red_packet_page = val;
                let Data = this.setFormData(this.activeTable);
                Data.start = (this.red_packet_page - 1) * this.red_packet_pageSize;
                this.getred_packetData(Data);
            },
            red_packet_SizeChange(val){
                this.red_packet_pageSize = val;
                let Data = this.setFormData(this.activeTable);
                Data.start = (this.red_packet_page - 1) * this.red_packet_pageSize;
                this.getred_packetData(Data);
            },
            labor_CurrentChange(val){
                this.labor_page = val;
                let Data = this.setFormData(this.activeTable);
                Data.start = (this.labor_page - 1) * this.labor_pageSize;
                this.getlaborData(Data);
            },
            labor_SizeChange(val){
                this.labor_pageSize = val;
                let Data = this.setFormData(this.activeTable);
                Data.start = (this.labor_page - 1) * this.labor_pageSize;
                this.getlaborData(Data);
            },
            addRefundCash(){
                this.$refs['refundCash'].openModal('新增');
            },
            exportRefundCashData(){
                this.$refs['refundCash'].exportRefundCashData();
            },
            addBillVariable(){
                this.$refs['billVariable'].openModal();
            },
            exportBillVariableData(){
                this.$refs['billVariable'].exportBillVariableData();
            },
            export_daily_pinduoduo(){
                this.$refs['daily_pinduoduo'].export_daily_pinduoduo();
            },
            export_daily_lost(){
                this.$refs['lost'].export_ad_fee();
            },
        },
        components:{
            refundCash,
            billVariable,
            daily_pinduoduo,
            ad_fee,
            lost
        }
    }
</script>

<style lang="css">
    #daily .ivu-form-item{
        margin-bottom:0;
    }
    #daily .ivu-form-item-error-tip{
        display: none;
    }
</style>
