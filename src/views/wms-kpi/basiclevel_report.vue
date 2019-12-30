<style>
    #basiclevel_report {

    }
    #basiclevel_report .right_click_menu{
        position: absolute;
        top:0;
        left:0;
        width:200px;
        font-size:12px;
        color:black;
        border:1px solid #bbb;
        padding:5px 20px;
        background: white;
        cursor: pointer;
        z-index: 999;
        display: none;
        box-shadow: 4px 3px 5px #aaa;
    }
    #basiclevel_report .right_click_menu:hover{
        background: #eee;
    }
</style>

<template>
    <div class="background-color-white exhibition" id="basiclevel_report">
        <Row class="margin-bottom-10">
            <Col span="24" class="search">
            <Form :model="formSearch" ref="formSearch" :label-width="90" inline label-position="right">
                <Form-item label="姓名:" :label-width="40">
                    <Input v-model="formSearch.name" placeholder="请输入姓名" style="width: 150px"
                           @keydown.native.enter="search(formSearch)"></Input>
                </Form-item>
                <Form-item label="起始日期：">
                    <DatePicker type="date" v-model="formSearch.start_date" format="yyyy-MM-dd" placeholder="选择开始日期"
                                style="width: 120px"></DatePicker>
                </Form-item>
                <Form-item label="结束日期：">
                    <DatePicker type="date" v-model="formSearch.end_date" format="yyyy-MM-dd" placeholder="选择开始日期"
                                style="width: 120px"></DatePicker>
                </Form-item>
                <Form-item label="仓库：" :label-width="50">
                    <Select v-model="formSearch.warehouse_code" style="width:120px">
                        <Option v-for="item in formSearch_warehouse" :value="item.warehouse_code"
                                :key="item.warehouse_code">{{
                            item.warehouse_name }}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item :label-width="1">
                    <Button type="primary" @click="search(formSearch)" icon="ios-search">搜索</Button>
                    <Button type="default" @click="handleReset(formSearch)">重置</Button>
                    <Button type="warning" @click="refresh" :disabled='kpi_update_btn_status != 1'>更新</Button>
                </Form-item>
            </Form>
            </Col>
        </Row>
        <Row class="margin-bottom-10">
            <Button type="primary" @click="export_base_kpi(formSearch)">导出</Button>            
        </Row>
        <Row class="margin-bottom-10">
            <Table size="small" @on-sort-change="sortChange" :columns="basiclevel_report_columns" :data="basiclevel_report_data" border></Table>
            <div class="right_click_menu" ref='right_click_menu'>
                <span>自定义列表</span>
            </div>
        </Row>
        <Row>
            <Page :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator
                  @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
        </Row>
    </div>
</template>

<script>
    import Util from 'libs/util';
    import base from 'libs/base';
    import axios from 'axios';
    import customTable from 'libs/customTable';
    import {mapState} from 'vuex';
    import socket from 'libs/socket';

    function formSearch() {
        return {
            name: '',
            end_date: '',
            start_date: '',
            warehouse_code: ''
        }
    }

    export default {
        name: "basiclevel_report",
        data() {
            return {
                formSearch: formSearch(),
                formSearch_warehouse: [],
                basiclevel_report_data: [],
                basiclevel_report_columns: [
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        width: 80,
                        fixed: 'left'
                    },
                    {
                        title: '姓名',
                        key: 'NAME',
                        align: 'center',
                        width: 100,
                        fixed: 'left'
                    },
                    {
                        title: '上班小时数',
                        key: 'WORK_HOURS',
                        align: 'center',
                        width: 100,
                        fixed: 'left'
                    },
                    {
                        title: '培训小时',
                        key: 'TRAINING_HOURS',
                        align: 'center',
                        minWidth: 100,
                        hidden: false
                    },
                    {
                        title: '盘点小时',
                        key: 'CHECK_HOURS',
                        align: 'center',
                        minWidth: 100,
                        hidden: false
                    },
                    {
                        title: '异常',
                        key: 'UNUSUAL',
                        align: 'center',
                        minWidth: 100,
                        hidden: false
                    },
                    {
                        title: '大货扫码',
                        align: 'center',
                        children: [
                            {
                                key: 'BIG_SCAN',
                                title: '0.01',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '客退处理',
                        align: 'center',
                        children: [
                            {
                                key: 'VIP_RETURN_ITEMS',
                                title: '0.01',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '销退处理',
                        align: 'center',
                        children: [
                            {
                                key: 'TM_RETURN_ITEMS',
                                title: '0.1',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '大货上架',
                        align: 'center',
                        children: [
                            {
                                key: 'BIG_ITEMS_SHELF',
                                title: '0.015',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '大货质检',
                        align: 'center',
                        children: [
                            {
                                key: 'BIG_QUALITY',
                                title: '0.04',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '大货交接',
                        align: 'center',
                        children: [
                            {
                                key: 'BIG_COMMIT',
                                title: '0.01',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '退货质检',
                        align: 'center',
                        children: [
                            {
                                key: 'RETURN_QUALITY',
                                title: '0.08',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '烫衣服',
                        align: 'center',
                        children: [
                            {
                                key: 'IRON_CLOTHES',
                                title: '0.12',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '天猫拣选-批量',
                        align: 'center',
                        children: [
                            {
                                key: 'TMPICK_BATCH',
                                title: '0.01',
                                align: 'center',
                                minWidth: 120,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '天猫拣选',
                        align: 'center',
                        children: [
                            {
                                key: 'TMPICK',
                                title: '0.06',
                                align: 'center',
                                minWidth: 120,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '天猫拣选-正品',
                        align: 'center',
                        children: [
                            {
                                key: 'TMPICK_GOOD',
                                title: '0.01',
                                align: 'center',
                                minWidth: 120,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '天猫拣选-次品',
                        align: 'center',
                        children: [
                            {
                                key: 'TMPICK_DEFECTIVE',
                                title: '0.04',
                                align: 'center',
                                minWidth: 120,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '唯品会拣选',
                        align: 'center',
                        children: [
                            {
                                key: 'VIP_PICK',
                                title: '0.04',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '唯品会扫描',
                        align: 'center',
                        children: [
                            {
                                key: 'VIP_SCAN',
                                title: '0.01',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            }
                        ],
                        hidden: false
                    },
                    {
                        title: '二次分拣',
                        align: 'center',
                        children: [
                            {
                                key: 'TWO_TIMES_PICK',
                                title: '0.03',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '天猫单品/多品包装',
                        align: 'center',
                        children: [
                            {
                                key: 'TMPACKAGE',
                                title: '0.05',
                                align: 'center',
                                minWidth: 120,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '散件移库',
                        align: 'center',
                        children: [
                            {
                                key: 'PARTS_MOVE',
                                title: '0.1',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '大货移库',
                        align: 'center',
                        children: [
                            {
                                key: 'BIG_MOVE',
                                title: '0.01',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '洗烫移库',
                        align: 'center',
                        children: [
                            {
                                key: 'IRON_MOVE',
                                title: '0.025',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '取消单返库',
                        align: 'center',
                        children: [
                            {
                                key: 'CANCEL_ORDER_RETURN',
                                title: '0.025',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '散件上架',
                        align: 'center',
                        children: [
                            {
                                key: 'PARTS_ITEMS_SHELF',
                                title: '0.025',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '唯品会封箱',
                        align: 'center',
                        children: [
                            {
                                key: 'VIP_CLOSE',
                                title: '0.006',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '唯品会交接',
                        align: 'center',
                        children: [
                            {
                                key: 'VIP_COMMIT',
                                title: '0.003',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '唯品会接货',
                        align: 'center',
                        children: [
                            {
                                key: 'VIP_RECEIVE',
                                title: '0.2',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '包装下料',
                        align: 'center',
                        children: [
                            {
                                key: 'PICK_BAITING',
                                title: '0.005',
                                align: 'center',
                                minWidth: 100,
                                hidden: false
                            },
                        ],
                        hidden: false
                    },
                    {
                        title: '盘点绩效',
                        key: 'WORKHOURS_PERFORMANCE',
                        align: 'center',
                        minWidth: 100,
                        hidden: false
                    },
                    {
                        title: '奖励',
                        key: 'REWARD',
                        align: 'center',
                        minWidth: 100,
                        hidden: false
                    },
                    {
                        title: '惩罚',
                        key: 'PUNISHMENT',
                        align: 'center',
                        minWidth: 100,
                        hidden: false
                    },
                    {
                        title: '绩效',
                        key: 'PERFORMANCE',
                        align: 'center',
                        minWidth: 100,
                        sortable: 'custom',
                        hidden: false
                    },
                    {
                        title: '其他绩效',
                        key: 'OTHER',
                        align: 'center',
                        minWidth: 100,
                        hidden: false
                    },
                    {
                        title: '最终绩效',
                        key: 'TOTAL_PERFORMANCE',
                        align: 'center',
                        minWidth: 120,
                        sortable: 'custom',
                        hidden: false
                    },
                ],
                page: 1,
                pageSize: 10,
                total: 0
            }
        },
        computed: {
            ...mapState({
                update_columns_list:state => state.common._columns,
                kpi_update_btn_status:state => state.common.kpi_update_btn_status
            })
        },
        watch: {
            update_columns_list: {
        　　　　handler(newValue, oldValue) {
        　　　　　　this.basiclevel_report_columns = newValue;
        　　　　},
        　　　　deep: true
        　　}
        },
        mounted() {
            this.formSearch_warehouse = base.formSearch_warehouse;
            let data = this.formSearch;
            data.start_date = Util.dateFormat(new Date(), 'yyyy-MM') + '-01';
            data.end_date = Util.dateFormat(new Date(), 'yyyy-MM-dd');
            this._columns = Util.deepClone(this.basiclevel_report_columns);
        },
        activated() {
            var that = this;  
            this.get_basekpi_status();
            this.$store.dispatch('save_temp_columns',this._columns);
            
            this.getData(this.formSearch);
            this.$nextTick(()=>{
                this.$store.dispatch('get_table_custom_list',{
                tableName:'基层KPI-管理',
                columns:this.basiclevel_report_columns
            }).then((data)=>{
                    this.basiclevel_report_columns = data;
                    let thead = document.getElementsByTagName('thead');
                    let refs = that.$refs['right_click_menu'];
                    customTable.openModel({thead:thead,ref:refs,columns:this._columns,tableName:'基层KPI-管理',data_view_direction:'up'})
                })
            })
            
        },
        methods: {
            get_basekpi_status(){
                this.request('get_basekpi_status',{},false).then(res=>{
                    if(res.code == 1){
                        this.$store.dispatch('save_update_btn_status',{
                            type:'kpi',
                            status:res.data.status
                        });
                    }
                });
            },
            getData(formSearch) {
                var data = JSON.parse(JSON.stringify(formSearch))
                data.start_date = Util.dateFormat(data.start_date, 'yyyy-MM-dd');
                data.end_date = Util.dateFormat(data.end_date, 'yyyy-MM-dd');
                data.user_id = JSON.parse(window.sessionStorage.getItem('userinfo')).userId;
                data = Object.assign(data, {
                    length: this.pageSize,
                    start: this.pageSize * (this.page - 1),
                });
                this.request('select_base_kpi', {
                    data: data
                }, true).then(res => {
                    if (!!res.data.baseKpiData) {
                        this.basiclevel_report_data = res.data.baseKpiData;
                    }
                    this.total = res.data.counts;
                    let serialNoBegain = this.pageSize * (this.page - 1);
                    res.data.baseKpiData.forEach((item) => {
                        serialNoBegain++;
                        item.serialNo = serialNoBegain;
                    })
                })
            },
            search(formSearch) {
                this.page = 1;
                this.getData(formSearch);
            },
            handleReset() {
                this.formSearch = formSearch();
                this.formSearch.start_date = Util.dateFormat(new Date(), 'yyyy-MM') + '-01';
                this.formSearch.end_date = Util.dateFormat(new Date(), 'yyyy-MM-dd');
                this.search(this.formSearch);
            },
            sortChange(val){
                if(val.column.title == '绩效'){
                    this.formSearch.sort_column = 'performance';
                }else if(val.column.title == '最终绩效'){
                    this.formSearch.sort_column = 'total_performance';
                }
                this.formSearch.sort_type = val.order;
                this.getData(this.formSearch)
            },
            export_base_kpi(formSearch){
                var data = JSON.parse(JSON.stringify(formSearch))
                data.start_date = Util.dateFormat(data.start_date, 'yyyy-MM-dd');
                data.end_date = Util.dateFormat(data.end_date, 'yyyy-MM-dd');
                data.user_id = JSON.parse(window.sessionStorage.getItem('userinfo')).userId;
                this.$Spin.show();

                axios.get('/eop/kpi/lst/export_base_kpi', {
                    params:{
                        start_date: data.start_date,
                        end_date: data.end_date,
                        user_id: data.user_id,
                        sort_type: '',
                        sort_column: '',
                        warehouse_code: data.warehouse_code,
                        name: data.name
                    }
                }, true).then(res=>{
                    window.open(`${window.location.origin}/eop/kpi/lst/export_base_kpi?start_date=${data.start_date}&end_date=${data.end_date}&user_id=${data.user_id}&sort_type=&sort_column=&warehouse_code=${data.warehouse_code}&name=${data.name}`);
                    this.$Spin.hide();
                }).catch(err=>{
                    this.$Spin.hide();
                })
            },
            SizeChange(val) {
                this.pageSize = val;
                this.getData(this.formSearch)
            },
            CurrentChange(val) {
                this.page = val;
                this.getData(this.formSearch)
            },
            refresh(){
                let data = Util.deepClone(this.formSearch);
                socket({
                    userId:JSON.parse(window.sessionStorage.getItem('userinfo')).userId,
                    type:'updateBaseKpi',
                    startDate:Util.dateFormat(data.start_date, 'yyyy-MM-dd'),
                    endDate:Util.dateFormat(data.end_date, 'yyyy-MM-dd'),
                    name:data.name
                })
            }
        }
    }
</script>


