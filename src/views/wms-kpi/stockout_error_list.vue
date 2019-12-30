<style>
    #tockout_error_list .ivu-page {
        margin-top: 10px;
    }
</style>

<template>
    <div class="background-color-white exhibition" id="tockout_error_list">
        <Row class="margin-bottom-10">
            <Col :span="24" class="search">
            <Form :model="formSearch" ref="formSearch" :label-width="90" inline label-position="right">
                <Form-item label="起始日期：">
                    <DatePicker type="date" v-model="formSearch.start_date" format="yyyy-MM-dd" placeholder="选择开始日期"
                                style="width: 150px"></DatePicker>
                </Form-item>
                <Form-item label="结束日期：">
                    <DatePicker type="date" v-model="formSearch.end_date" format="yyyy-MM-dd" placeholder="选择开始日期"
                                style="width: 150px"></DatePicker>
                </Form-item>
                <Form-item label="仓库：" :label-width="50">
                    <Select v-model="formSearch.warehouse_code" style="width:150px">
                        <Option v-for="item in formSearch_warehouse" :value="item.warehouse_code"
                                :key="item.warehouse_code">{{
                            item.warehouse_name }}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item label="品牌：" :label-width="50">
                    <Select v-model="formSearch.brands" multiple style="width:150px">
                        <Option v-for="item in brandList" :value="item.brands" :key="item.brands">{{ item.brands }}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item :label-width="1">
                    <Button type="primary" @click="search(formSearch)" icon="ios-search">搜索</Button>
                    <Button type="default" @click="handleReset(formSearch)">重置</Button>
                </Form-item>
            </Form>
            </Col>
            <Col span="24">
            <Button type="primary" icon="md-add" @click="open_outer_dialog('新增')">新增</Button>
            </Col>
        </Row>
        <Row>
            <Tabs type="card" @on-click="tabClick" :value="activeTable">
                <TabPane label="仓库" name="warehouse">
                    <Alert>
                        <span class="margin-right-40">发货总数:{{!TableData.warehouse_counts ? 0 : TableData.warehouse_counts.warehouse_sum }}</span>
                        <span class="margin-right-40">错发数:{{!TableData.warehouse_counts ? 0 : TableData.warehouse_counts.warehouse_CF_sum}}</span>
                        <span class="margin-right-40">漏发数:{{!TableData.warehouse_counts ? 0 : TableData.warehouse_counts.warehouse_LF_sum}}</span>
                        <span class="margin-right-40" style="color: red">出错率:{{!TableData.warehouse_counts ? '--%' : TableData.warehouse_counts.warehouse_error_rate}}</span>
                    </Alert>
                    <Table size="small" :columns="Warehouse_columns" :data="TableData.warehouse_data"></Table>
                    <Page :total="Warehousetotal" :page-size="WarehousepageSize" :current="Warehousepage" show-sizer
                          show-total show-elevator @on-change="WarehouseCurrentChange"
                          @on-page-size-change="WarehouseSizeChange"></Page>
                </TabPane>
                <TabPane label="品牌" name="brand">
                    <Table size="small" :columns="Brand_columns" :data="TableData.brands_data"></Table>
                    <Page :total="Brandstotal" :page-size="BrandspageSize" :current="Brandspage" show-sizer show-total
                          show-elevator @on-change="BrandsCurrentChange" @on-page-size-change="BrandsSizeChange"></Page>
                </TabPane>
            </Tabs>
        </Row>
        <Row>
        </Row>
        <Modal v-model="outer_dialog_visible" :mask-closable="false" :title="outer_dialog_title" :width="1200"
               class-name="customize-modal-center">
            <Row>
                <Col class="margin-bottom-10" v-if="outer_dialog_title != '查看'">
                <Button type="primary" @click="add_submit_stockout">新增</Button>
                <Button type="error" @click="del_submit_stockout">删除</Button>
                </Col>
                <Col>
                <Table size="small" :columns="submit_stockout_columns" :data="submit_stockout_Data"
                       @on-select="select_submit_stockout"></Table>
                </Col>
            </Row>
            <div slot="footer" v-if="outer_dialog_title != '查看'">
                <Button type="primary" @click="submit">保存</Button>
                <Button type="default" @click="outer_dialog_visible = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import Util from 'libs/util'
    import base from 'libs/base'

    function formSearch() {
        return {
            end_date: '',
            start_date: '',
            warehouse_code: '',
            brands: []
        }
    }

    function add_stockout_Data() {
        return {
            error_day: '',         //发货出错时间
            warehouse_code: '',    //仓库code
            error_type: '',        //错误类型
            order_code: '',        //物流编号
            remark: '',            //错误说明
            brands: '',            //品牌
        }
    }

    export default {
        name: "stockout_error_list",
        data() {
            return {
                formSearch: formSearch(),
                formSearch_warehouse: [],
                warehouse: [],
                error_types: [],
                TableData: [],
                Warehouse_columns: [
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '日期',
                        key: 'warehouse_error_date',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '物流公司',
                        key: 'warehouse_code',
                        align: 'center',
                        width: 150,
                        render: (h, params) => {
                            return h('span', params.row.warehouse_code == 'XSYLC' ? '宇隆仓' : '瓜沥仓')
                        }
                    },
                    {
                        title: '错发数',
                        key: 'warehouse_CF_number',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '漏发数',
                        key: 'warehouse_LF_number',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '发货总数',
                        key: 'warehouse_number',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '发货出错率',
                        key: 'warehouse_error_rate',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '操作',
                        key: 'check_by',
                        align: 'center',
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
                                            this.open_outer_dialog('查看', params);
                                        }
                                    }
                                }, '查看'),
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
                                            this.open_outer_dialog('编辑', params);
                                        }
                                    }
                                }, '编辑')
                            ]);
                        }
                    },
                ],
                Brand_columns: [
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '日期',
                        key: 'error_day',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '品牌',
                        key: 'brands',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '错发数',
                        key: 'brands_CF_number',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '漏发数',
                        key: 'brands_LF_number',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '物流单号',
                        key: 'order_code',
                        align: 'center',
                    }
                ],
                stockoutErrorTable: {},
                outer_dialog_visible: false,     //导入弹窗开关
                outer_dialog_title: '',          //外弹窗title名
                stockoutErrorTableRow: {},
                BrandspageSize: 10,
                Brandspage: 1,
                Brandstotal: 0,
                WarehousepageSize: 10,
                Warehousepage: 1,
                Warehousetotal: 0,
                activeTable: '',
                submit_stockout_Data: [],
                submit_stockout_columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '物流中心',
                        key: 'warehouse_code',
                        width: 150,
                        align: "center",
                        render: (h, params) => {
                            if (this.outer_dialog_title == '查看') {
                                return h('span', this.submit_stockout_Data[params.index].warehouse_code == 'XSYLC' ? '宇隆仓' : '瓜沥仓')
                            } else {
                                return h('Select', {
                                        props: {
                                            value: this.submit_stockout_Data[params.index].warehouse_code,
                                        },
                                        on: {
                                            'on-change': (value) => {
                                                this.submit_stockout_Data[params.index].warehouse_code = value;
                                                this.validate_ordercode(this.submit_stockout_Data[params.index], params.index)
                                            }
                                        }
                                    },
                                    this.warehouse.map(function (item) {
                                        return h('Option', {
                                            props: {value: item.warehouse_code}
                                        }, item.warehouse_name);
                                    })
                                )
                            }
                        }
                    },
                    {
                        title: '物流编号',
                        key: 'order_code',
                        width: 150,
                        align: "center",
                        render: (h, params) => {
                            if (this.outer_dialog_title == '查看') {
                                return h('span', this.submit_stockout_Data[params.index].order_code)
                            } else {
                                return h('Input', {
                                    props: {
                                        value: this.submit_stockout_Data[params.index].order_code,
                                        type: 'text'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.submit_stockout_Data[params.index].order_code = event.target.value;
                                            this.validate_ordercode(this.submit_stockout_Data[params.index], params.index)
                                        }
                                    }
                                })
                            }
                        }
                    },
                    {
                        title: '品牌',
                        key: 'brands',
                        width: 180,
                        align: "center",
                        render: (h, params) => {
                            if (this.outer_dialog_title == '查看') {
                                return h('span', this.submit_stockout_Data[params.index].brands)
                            } else {
                                return h('Select', {
                                        props: {
                                            value: this.submit_stockout_Data[params.index].brands,
                                        },
                                        on: {
                                            'on-change': (value) => {
                                                this.submit_stockout_Data[params.index].brands = value;
                                                this.brandList.map(x=>{
                                                    if(x.brands == value) this.submit_stockout_Data[params.index].brands_id = x.id;
                                                })
                                            }
                                        }
                                    },
                                    this.brandList.map(function (item) {
                                        return h('Option', {
                                            props: {value: item.brands}
                                        }, item.brands);
                                    })
                                )
                            }
                        }
                    },
                    {
                        title: '错误类型',
                        key: 'error_type',
                        width: 150,
                        align: "center",
                        render: (h, params) => {
                            if (this.outer_dialog_title == '查看') {
                                return h('span', this.submit_stockout_Data[params.index].error_type == 'CF' ? '错发' : '漏发')
                            } else {
                                return h('Select', {
                                        props: {
                                            value: this.submit_stockout_Data[params.index].error_type,
                                        },
                                        on: {
                                            'on-change': (value) => {
                                                this.submit_stockout_Data[params.index].error_type = value;
                                            }
                                        }
                                    },
                                    this.error_types.map(function (item) {
                                        return h('Option', {
                                            props: {value: item.error_type_code}
                                        }, item.error_type_name);
                                    })
                                )
                            }
                        }
                    },
                    {
                        title: '发货人',
                        key: 'send_name',
                        width: 150,
                        align: "center"
                    },
                    {
                        title: '发货时间',
                        key: 'error_day',
                        width: 150,
                        align: "center"
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                        render: (h, params) => {
                            if (this.outer_dialog_title == '查看') {
                                return h('span', this.submit_stockout_Data[params.index].remark)
                            } else {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.submit_stockout_Data[params.index].remark
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.submit_stockout_Data[params.index].remark = event.target.value;
                                        }
                                    }
                                })
                            }
                        }
                    }
                ],
                delIndexs: [],                   //选中行
            }
        },
        mounted() {
            this.formSearch_warehouse = base.formSearch_warehouse;
            this.warehouse = base.warehouse;
            this.error_types = base.error_types;
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            this.getBrandList();
            let data = this.formSearch;
            data.start_date = Util.dateFormat(new Date(), 'yyyy-MM') + '-01';
            data.end_date = Util.dateFormat(new Date(), 'yyyy-MM-dd');
        },
        activated() {
            this.search(this.formSearch);
        },
        computed: {
            ...mapState({
                brandList: state => state.common.brandList
            })
        },
        methods: {
            stockout_error_list(data) {
                var data = JSON.parse(JSON.stringify(data))
                data.start_date = Util.dateFormat(data.start_date, 'yyyy-MM-dd');
                data.end_date = Util.dateFormat(data.end_date, 'yyyy-MM-dd');
                if (!this.activeTable) {
                    data = Object.assign(data, {
                        length: 10,
                        start: 0,
                        type: ''
                    });
                }
                this.request('stockout_error_list', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    methods: 'stockout_error_list',
                    data: data
                }, true).then(res => {
                    if (res.code == 1) {
                        this.TableData = res.data;
                        this.Brandstotal = res.data.brands_counts
                        this.Warehousetotal = res.data.warehouse_counts.warehouse_count

                        if (!!this.TableData.brands_data) {
                            let serialNoBegain_brand = this.BrandspageSize * (this.Brandspage - 1);
                            this.TableData.brands_data.forEach((item) => {
                                serialNoBegain_brand++;
                                item.serialNo = serialNoBegain_brand;
                            })
                        }
                        if (!!this.TableData.warehouse_data) {
                            let serialNoBegain_warehouse = this.WarehousepageSize * (this.Warehousepage - 1);
                            this.TableData.warehouse_data.forEach((item) => {
                                serialNoBegain_warehouse++;
                                item.serialNo = serialNoBegain_warehouse;
                            })
                        }
                    } else {
                        this.$Message.warning(res.msg);
                    }
                });
            },
            search(data) {
                var data = JSON.parse(JSON.stringify(data))
                if (this.activeTable == 'warehouse') {
                    data = Object.assign(data, {
                        length: 10,
                        start: 0,
                        type: 'warehouse'
                    })
                    this.stockout_error_list(data)
                } else {
                    data = Object.assign(data, {
                        length: 10,
                        start: 0,
                        type: 'brands'
                    })
                    this.stockout_error_list(data)
                }
            },
            handleReset() {
                this.formSearch = formSearch();
                this.formSearch.start_date = Util.dateFormat(new Date(), 'yyyy-MM') + '-01';
                this.formSearch.end_date = Util.dateFormat(new Date(), 'yyyy-MM-dd');
                this.search(this.formSearch);
            },
            tabClick(name) {
                this.activeTable = name;
                var data = JSON.parse(JSON.stringify(this.formSearch));
                if (name == 'warehouse') {
                    data = Object.assign(data, {
                        length: this.WarehousepageSize,
                        start: this.WarehousepageSize * (this.Warehousepage - 1),
                        type: 'warehouse'
                    })
                    this.stockout_error_list(data)
                } else {
                    data = Object.assign(data, {
                        length: this.BrandspageSize,
                        start: this.BrandspageSize * (this.Brandspage - 1),
                        type: 'brands'
                    })
                    this.stockout_error_list(data)
                }
            },
            open_outer_dialog(type, params) {
                this.outer_dialog_visible = true;
                this.outer_dialog_title = type;
                this.submit_stockout_Data = [];
                this.stockoutErrorTableRow = params;
                if (this.outer_dialog_title == '新增') {
                    this.submit_stockout_Data.push(add_stockout_Data());
                } else {
                    this.stockout_error_detail();
                }
            },
            validate_ordercode(row, index) {
                if (!!row.warehouse_code && !!row.order_code) {
                    this.request('validate_ordercode', {
                        data: {
                            order_code: row.order_code,
                            warehouse_code: row.warehouse_code
                        }
                    }, true).then(res => {
                        if (res.code == 1) {
                            if(!!res.data.send_name){
                                this.submit_stockout_Data[index].send_name = res.data.send_name;
                            }
                            if (!!res.data.ship_time) {
                                this.submit_stockout_Data[index].error_day = res.data.ship_time;
                            } else {
                                this.submit_stockout_Data[index].order_code = '';
                                this.$Message.warning(res.data.error_msg);
                            }
                        }
                    })
                }
            },
            stockout_error_detail() {
                this.request('stockout_error_detail', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    data: {
                        error_date: this.stockoutErrorTableRow.row.warehouse_error_date,
                        warehouse_code: this.stockoutErrorTableRow.row.warehouse_code
                    }
                }, true).then(res => {
                    if (res.code == 1) {
                        res.data.forEach(x => {
                            this.submit_stockout_Data.push({
                                error_day: x.error_day,         //发货出错时间
                                warehouse_code: x.warehouse_code,    //仓库code
                                error_type: x.error_type,        //错误类型
                                order_code: x.order_code,        //物流编号
                                remark: x.remark,            //错误说明
                                brands: x.brands,            //品牌
                                id: x.id,
                                send_name: x.send_name
                            })
                        })
                    }
                })
            },
            add_submit_stockout() {
                let data = this.submit_stockout_Data;
                if (data.length <= 0) {
                    this.submit_stockout_Data.push(add_stockout_Data());
                    return;
                }
                ;

                for (let [k, j] of data.entries()) {
                    for (let i in j) {
                        if (i == 'remark') {
                            continue;
                        } else {
                            if (!j[i]) {
                                this.$Notice.warning({
                                    title: '提示',
                                    desc: '请填写完当前行在操作!'
                                });
                                return;
                            }
                        }
                    }
                }
                this.submit_stockout_Data.push(add_stockout_Data());

            },
            select_submit_stockout(selection, row) {
                let Data = JSON.parse(JSON.stringify(this.submit_stockout_Data));
                this.delIndexs = [];
                a:
                    for (var i = 0; i < Data.length; i++) {
                        b:
                            for (var j = 0; j < selection.length; j++) {
                                if (JSON.stringify(Data[i]) == JSON.stringify(selection[j])) {
                                    this.delIndexs.push(i)
                                    break b;
                                }
                            }
                    }
            },
            del_submit_stockout() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '选中行将会删除，请确认！',
                    onOk: () => {
                        this.delIndexs.sort(function (x, y) {
                            return y - x;
                        })
                        this.delIndexs.forEach(x => {
                            this.submit_stockout_Data.splice(x, 1);
                        })
                        this.$Notice.success({
                            title: '提示',
                            desc: '已删除!'
                        });
                    },
                    onCancel: () => {
                        this.$Notice.warning({
                            title: '提示',
                            desc: '已取消删除!'
                        });
                    }
                })
            },
            add_stockout_error(data) {
                var type;
                if (this.outer_dialog_title == '新增') {
                    type = 2;
                } else {
                    type = 1;
                }
                return this.request('stockout_error', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    data: {
                        list: data,
                        type: type
                    }
                }, true)
            },
            submit() {
                let data = this.submit_stockout_Data;
                if (data.length <= 0) {
                    this.$Notice.warning({
                        title: '提示',
                        desc: '填写的数据为空，不予提交!'
                    });
                    return;
                }

                for (let [k, j] of data.entries()) {
                    for (let i in j) {
                        if (i == 'remark') {
                            continue;
                        } else {
                            if (!j[i]) {
                                this.$Notice.warning({
                                    title: '提示',
                                    desc: '请填写完当前行在操作!'
                                });
                                return;
                            }
                        }
                    }
                }

                this.add_stockout_error(this.submit_stockout_Data).then(res => {
                    if (res.code == 1) {
                        this.$Message.success(res.msg);
                        this.search(this.formSearch);
                        this.outer_dialog_visible = false;
                    }
                })
            },
            getBrandList() {
                this.$store.dispatch('getBrandList', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    data: {}
                })
            },
            WarehouseSizeChange(val) {
                this.WarehousepageSize = val;
                var data = JSON.parse(JSON.stringify(this.formSearch));
                data = Object.assign(data, {
                    length: this.WarehousepageSize,
                    start: this.WarehousepageSize * (this.Warehousepage - 1),
                    type: 'warehouse'
                })
                this.stockout_error_list(data)
            },
            WarehouseCurrentChange(val) {
                this.Warehousepage = val;
                var data = JSON.parse(JSON.stringify(this.formSearch));
                data = Object.assign(data, {
                    length: this.WarehousepageSize,
                    start: this.WarehousepageSize * (this.Warehousepage - 1),
                    type: 'warehouse'
                })
                this.stockout_error_list(data)
            },
            BrandsSizeChange(val) {
                this.BrandspageSize = val;
                var data = JSON.parse(JSON.stringify(this.formSearch));
                data = Object.assign(data, {
                    length: this.BrandspageSize,
                    start: this.BrandspageSize * (this.Brandspage - 1),
                    type: 'brands'
                })
                this.stockout_error_list(data)
            },
            BrandsCurrentChange(val) {
                this.Brandspage = val;
                var data = JSON.parse(JSON.stringify(this.formSearch));
                data = Object.assign(data, {
                    length: this.BrandspageSize,
                    start: this.BrandspageSize * (this.Brandspage - 1),
                    type: 'brands'
                })
                this.stockout_error_list(data)
            },
        }
    }
</script>

