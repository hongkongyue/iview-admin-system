<template>
    <div class="background-color-white exhibition" id="budget-complete" style="min-height:350px">
        <Row class="margin-bottom-10">
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Col>
                  <Form-item label="品牌：" :label-width='60'>
                        <Select v-model="formSearch.brandId" style="width:150px">
                            <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                            </Option>
                        </Select>
                 </Form-item>

                 <Form-item label="平台：" :label-width='60'>
                        <Select v-model="formSearch.platform_id" style="width:150px">
                            <Option v-for="item in platformList" :value="item.platform_id" :key="item.platform_id">{{ item.name }}
                            </Option>
                        </Select>
                 </Form-item>

                   <Form-item label="年月:" :label-width="70">
                      <DatePicker type="month" v-model="formSearch.yearMonth" placeholder="请选择年月"
                                    style="width: 100px"></DatePicker><Icon type="ios-remove" />

                                    <DatePicker type="month" v-model="formSearch.yearMonthEnd" placeholder="请选择年月"
                                    style="width: 100px"></DatePicker>
                    </Form-item>

                      <Form-item :label-width="10">
                    <Button type="primary" icon="ios-search"  @click="search">查询</Button>
                    <Button type="warning"  @click="reset">重置</Button>
            </Form-item>
                </Col>
            </Form>
        
        </Row>
        <Row>
            <Button type="primary" @click="downTemplate">下载模板</Button>
            <Button type="primary" @click="importData">导入</Button>
        </Row>
       <Row class-name="margin-top-10">
            <Col>
            <Table
                    ref="importDataTable"
                    size="small"
                    :loading="loading"
                    :columns="columns"
                    :data="list"
            >
            </Table>
            </Col>
        </Row>
          <Modal
                v-model="importModal"
                :title="VIP参数导入">
                <div>
                    <Upload
                        ref="upload"
                        name="file"
                        :show-upload-list="false"
                        :before-upload="handleUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        type="drag"
                        action="/eop-node/api/finance/importBudgetCompleteData"
                        :data="{account:userInfo.userAccount,budgetType:'profit'}"
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
                    <Button type="primary" @click="importOrderSave">导入</Button>
                </div>
            </Modal>
    </div>
</template>

<script>
    import Util from 'libs/util';
    export default {
        name: 'budget-complete',
        desc: '预算完成率',
        props: {
            userInfo: Object //订单类型
        },
        data() {
            return {
                formSearch: {
                   yearMonth:new Date()
                },
                brandList: [],
                importModal: false,
                loadingStatus: false,
                loading: false, //表格数据加载开关
                columns: [{
                    title: '序号',
                    key: 'serialNo',
                    align: 'center',
                    width: 60
                }, {
                    title: '品牌',
                    key: 'brand_name',
                    align: 'center',
                    width: 150
                },{
                    title: '平台',
                    key: 'platform_name',
                    align: 'center',
                    width: 80
                },{
                    title: '预算',
                    key: 'budget_profit',
                    align: 'center',
                    width: 150,
                    render: (h, params) => {
                        if(params.row.serialNo=='合计'){
                                return h('span', {
                                style:{
                                    'color':'blue'
                                }
                                },params.row.budget_profit)
                        }else{
                            return h('span', params.row.budget_profit)
                        }
                    }
                },{
                    title: '本月累计',
                    key: 'net_income',
                    align: 'center',
                    width: 150,
                    render: (h, params) => {
                        if(params.row.serialNo=='合计'){
                                return h('span', {
                                style:{
                                    'color':'blue'
                                }
                                },params.row.net_income)
                        }else{
                            return h('span', params.row.net_income)
                        }
                    }
                },{
                    title: '预算完成率',
                    key: 'complete_rate',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                        if(params.row.serialNo=='合计'){
                                return h('span', {
                                style:{
                                    'color':'blue'
                                }
                                },params.row.complete_rate)
                        }else{
                            return h('span', params.row.complete_rate)
                        }
                    }
                },{
                    title: '去年同期',
                    key: 'last_budget_profit',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        if(params.row.serialNo=='合计'){
                                return h('span', {
                                style:{
                                    'color':'blue'
                                }
                                },params.row.last_budget_profit)
                        }else{
                            return h('span', params.row.last_budget_profit)
                        }
                    }
                },{
                    title:'去年同期完成率',
                    key:'last_complete_rate',
                    align: 'center',
                    width: 200,
                    render: (h, params) => {
                        if(params.row.serialNo=='合计'){
                                return h('span', {
                                style:{
                                    'color':'blue'
                                }
                                },params.row.last_complete_rate)
                        }else{
                            return h('span', params.row.last_complete_rate)
                        }
                    }
                },{
                   title:'前年同期',
                   key:'before_last_budget_profit',
                   align: 'center',
                   width:120,
                  render: (h, params) => {
                        if(params.row.serialNo=='合计'){
                                return h('span', {
                                style:{
                                    'color':'blue'
                                }
                                },params.row.before_last_budget_profit)
                        }else{
                            return h('span', params.row.before_last_budget_profit)
                        }
                    }
                },{
                    title:'前年同期完成率',
                    key:'before_last_complete_rate',
                    align: 'center',
                    width: 200,
                    render: (h, params) => {
                        if(params.row.serialNo=='合计'){
                                return h('span', {
                                style:{
                                    'color':'blue'
                                }
                                },params.row.before_last_complete_rate)
                        }else{
                            return h('span', params.row.before_last_complete_rate)
                        }
                    }
                },
                {
                    title:'本年净利率',
                    key:'complete_net_rate',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        if(params.row.serialNo=='合计'){
                                return h('span', {
                                style:{
                                    'color':'blue'
                                }
                                },params.row.complete_net_rate)
                        }else{
                            return h('span', params.row.complete_net_rate)
                        }
                    }
                },
                {
                    title:'去年净利率',
                    key:'last_complete_net_rate',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        if(params.row.serialNo=='合计'){
                                return h('span', {
                                style:{
                                    'color':'blue'
                                }
                                },params.row.last_complete_net_rate)
                        }else{
                            return h('span', params.row.last_complete_net_rate)
                        }
                    }
                },
                {
                   title:'前年净利率',
                   key:'before_last_complete_net_rate',
                   width:120
                },
                {
                    title:'创建人',
                    key:'create_user',
                    align: 'center',
                    width: 100
                },
                  {
                    title:'创建时间',
                    key:'created',
                    align: 'center',
                    width: 150
                },
                {
                    title:'最后更新人',
                    key:'last_update_user',
                    align: 'center',
                    width: 100
                },
                {
                    title:'最后更新时间',
                    key:'last_updated',
                    align: 'center',
                    width: 150
                },
                ],
                list: [],
                file: null,
                page: 1,
                pageSize: 10,
                total: 0,
                platformList:[{
                    platform_id:0, name: "所有平台"
                },{
                    platform_id:1, name: "天猫"
                },{
                    platform_id:2, name: "唯品会"
                }]
            }
        },
        computed: {

        },
        mounted() {
            this.getBrandList()
            this.getData()
        },
        methods: {
            search() {
                this.getData()
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
                    this.brandList.unshift({
                        id: 0,
                        brands: '所有品牌'
                    })
                })
            },
            getPlatformList(){
                 this.request('get_platform_list', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    data: {}
                }, false).then((res) => {
                    this.platformList = res.data;
                    this.platformList.unshift({
                        platform_id: -1,
                        name: '所有平台'
                    })
                })
            },
            reset() {
                this.formSearch = {}
                this.search();
            },
            openModal() {
                this.modal_visible = true;
                this.addForm = addForm();
            },
            cancel() {
                this.importModal = false;
                this.file = null;
            },
            downTemplate() {
                window.location = ('/excel/预算完成率(利润)导入模板.xlsx');
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
                if (res.status == 'success') {
                    this.loadingStatus = false;
                    this.file = null;
                    this.$Message.success(res.message);
                    this.importModal = false;
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
            importOrderSave() {
                this.loadingStatus = true;
                Vue.prototype.$loading('正在导入数据...');
                this.$refs.upload.post(this.file);
            },
            getData() {
                let data = Util.deepClone(this.formSearch);
                data.budgetType='profit'
                this.request('get_budget_complete_list_data', data, true).then(res => {
                    if (res.status == 'success') {
                        let serialNoBegain = 0
                        let budget_profit_total =0
                        let last_budget_profit_total =0
                        let net_income_total = 0
                        res.data.map(x => {
                            serialNoBegain++;
                            x.serialNo = serialNoBegain;
                       
                            budget_profit_total+=Number(x.budget_profit)
                            last_budget_profit_total+=Number(x.last_budget_profit)
                            net_income_total+=Number(x.net_income)
                            let item = x
                            item.budget_profit = Util.toThousands(item.budget_profit)
                            item.net_income = Util.toThousands(item.net_income)
                            item.real_income = Util.toThousands(item.real_income)
                            item.last_budget_profit = Util.toThousands(item.last_budget_profit)
                         
                            if(item.complete_rate!=0){
                                item.complete_rate = Util.toPercent(item.complete_rate)
                            }else{
                                item.complete_rate='--'
                            }
                            if(item.last_complete_rate!=0){
                                item.last_complete_rate = Util.toPercent(item.last_complete_rate)
                            }else{
                                item.last_complete_rate='--'
                            }

                            if(item.before_last_complete_rate!=0){
                                item.before_last_complete_rate = Util.toPercent(item.before_last_complete_rate)
                            }else{
                                item.before_last_complete_rate='--'
                            }

                            if(item.complete_net_rate!=0){
                                item.complete_net_rate = Util.toPercent(item.complete_net_rate)
                            }else{
                                item.complete_net_rate='--'
                            }

                            if (item.last_complete_net_rate != 0) {
                                item.last_complete_net_rate = Util.toPercent(item.last_complete_net_rate)
                            } else {
                                item.last_complete_net_rate = '--'
                            }

                            if (item.before_last_complete_net_rate != 0) {
                                item.before_last_complete_net_rate = Util.toPercent(item.before_last_complete_net_rate)
                            } else {
                                item.before_last_complete_net_rate='--'
                            }
                        })
                        let totalObj = res.total
                        res.data.push({
                            serialNo: '合计',
                            budget_profit: Util.toThousands(Number(totalObj.budget_profit).toFixed(2)),
                            last_budget_profit: Util.toThousands(Number(totalObj.last_budget_profit).toFixed(2)),
                            net_income: Util.toThousands(Number(totalObj.net_income).toFixed(2)),
                            complete_rate: totalObj.complete_rate != 0 ? Util.toPercent(totalObj.complete_rate) : '--',
                            last_complete_rate: totalObj.last_complete_rate != 0 ? Util.toPercent(totalObj.last_complete_rate) : '--',
                            complete_net_rate: totalObj.complete_net_rate != 0 ? Util.toPercent(totalObj.complete_net_rate) : '--',
                            last_complete_net_rate: totalObj.last_complete_net_rate != 0 ? Util.toPercent(totalObj.last_complete_net_rate) : '--',
                            before_last_complete_rate: totalObj.before_last_complete_rate != 0 ? Util.toPercent(totalObj.before_last_complete_rate) : '--',
                            before_last_budget_profit: Util.toThousands(Number(totalObj.before_last_budget_profit).toFixed(2)),
                            before_last_complete_net_rate: totalObj.before_last_complete_net_rate != 0 ? Util.toPercent(totalObj.before_last_complete_net_rate) : '--',
                        })
                        this.list = res.data;
                    }else{
                        this.$Message.warning({
                            content: res.message,
                            duration: 3
                        });
                    }
                })
            },
        }
    }
</script>

<style lang="css">
  
</style>
