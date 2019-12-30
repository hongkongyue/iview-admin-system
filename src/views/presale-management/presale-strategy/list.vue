<template>
    <div class="background-color-white exhibition" id="presale_strategy_list">
        <Form 
            :model="formSearch" 
            ref="formSearch" 
            :label-width="75" 
            inline
            label-position="right"
            @keydown.native.enter.prevent="search"
        >
            <Row>
                <Col span='24'>
                    <Form-item label="店铺：" >
                        <Select style="width:180px" size="small" v-model="formSearch.shopId" placeholder="请选择店铺" @on-change='search'>
                            <Option v-for="item in shopList" :value="item.SHOP_ID" :key="item.SHOP_ID">
                                {{ item.SHOP_NAME }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="品牌：">
                        <Select style="width:140px" size="small" v-model="formSearch.brandId" placeholder="请选择品牌" @on-change='search'>
                            <Option v-for="item in brandList" :value="item.id" :key="item.id">
                                {{ item.brands }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="款号：">
                        <Input size="small" v-model="formSearch.goodsNo" style="width: 140px" placeholder="请输入款号" @on-blur='get_brand_by_sectionNo'></Input>
                    </Form-item>
                    <Form-item label="商家编码：" :label-width="90">
                        <Input size="small" v-model="formSearch.specNo" style="width: 140px" placeholder="请输入商家编码" @on-blur='get_brand_by_sectionNo'></Input>
                    </Form-item>
                    
                    <Form-item :label-width='1'>
                        <Button type="primary" @click="search" size="small">查询</Button>
                        <Button type="warning" @click="reset" size="small">重置</Button>
                    </Form-item>
                </Col>
                <Col span='24'>
                    <Form-item label="预售状态：">
                        <Select style="width:180px" size="small" v-model="formSearch.presaleStatus" placeholder="请选择预售状态" @on-change='search'>
                            <Option v-for="item in presaleStatusList" :value="item.code" :key="item.code">
                                {{ item.value }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="异常状态：">
                        <Select style="width:140px" size="small" v-model="formSearch.errorCode" placeholder="请选择异常状态" @on-change='search'>
                            <Option v-for="item in errorCodeList" :value="item.code" :key="item.code">
                                {{ item.value }}
                            </Option>
                        </Select>                
                    </Form-item>
                    <Form-item label="预售单号：">
                        <Input size="small" v-model="formSearch.orderCode" style="width: 140px" placeholder="请输入预售单号" @on-blur='get_brand_by_sectionNo'></Input>
                    </Form-item>
                    <Form-item label="生产制单号：" :label-width="90">
                        <Input size="small" v-model="formSearch.orderNo" style="width: 140px" placeholder="请输入生产制单号" @on-blur='get_brand_by_sectionNo'></Input>
                    </Form-item>
                </Col>
            </Row>
            
        </Form>
        <Row>
            <Col class="margin-bottom-10">
                <Table ref="orderList" size="small" :columns="columns" :data="list"></Table>
                <Spin size="large" fix v-if="spinShow"></Spin>
            </Col>
            <Col>
                 <Page :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator
                @on-change="changePage" @on-page-size-change="changePageSize"></Page>   
            </Col>
        </Row>
    </div>
</template>

<script>
    import Util from 'libs/util'
    function formSearch(){
        return {
            brandId:0,
            shopId:'',
            goodsNo:'',
            specNo:'',
            presaleStatus:'',
            errorCode:'',
            orderCode:'',
            orderNo:''
        }

    }
    let error_detail_template = Vue.extend({
        props: ['params'],
        data(){
            return {
                is_show:false
            }
        },
        mounted(){
            this.is_show = this.params.row.errorDetail.indexOf(';') == -1 ? false : true;
        },
        template: `
            <div v-if="!!params.row.errorDetail">
            <Tooltip placement="right" v-if="is_show">
                <div style="width:130px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{params.row.errorDetail}}</div>
                <div slot="content" style="white-space: normal">
                    <span>{{params.row.errorDetail}}</span>
                </div>
            </Tooltip>
            <span v-if="!is_show">{{params.row.errorDetail}}</span>
            </div>
        `
    })
    export default {
        name:'presale_strategy_list',
        data(){
            return {
                formSearch: formSearch(),
                brandList:[],
                columns:[
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        fixed: 'left',                        
                        minWidth: 220,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                name:'presale_strategy_detail',
                                                params:{orderCode:params.row.orderCode}
                                            })
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        display:params.row.presalesStatus == 800 ? 'none' : 'inline-block'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                name:'presale_strategy_modify',
                                                params:{orderCode:params.row.orderCode}
                                            })
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        display:params.row.presalesStatus == 800 ? 'none' : 'inline-block'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '该行将会终止，请确认！',
                                                onOk: () => {
                                                    this.edit_presale_status(params.row.orderCode,800);
                                                },
                                                onCancel: () => {
                                                    this.$Message.warning('已取消终止');
                                                }
                                            })
                                        }
                                    }
                                }, '终止'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        display:params.row.presalesStatus == 800 ? 'none' : 'inline-block'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '该行将会取消，请确认！',
                                                onOk: () => {
                                                    this.edit_presale_status(params.row.orderCode,950);
                                                },
                                                onCancel: () => {
                                                    this.$Message.warning('已取消操作');
                                                }
                                            })
                                        }
                                    }
                                }, '取消')
                            ])
                        }
                    },
                    {
                        title: '预售单号',
                        key: 'orderCode',
                        align: 'center',
                        minWidth: 140
                    },
                    {
                        title: '店铺',
                        key: 'shopName',
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
                        title: '预售状态',
                        key: 'presalesStatus',
                        align: 'center',
                        minWidth: 100,
                        render:(h,params)=>{
                            return h('span',Util.conversionStatus(this.presaleStatusList,'code',params.row.presalesStatus))
                        }
                    },
                    {
                        title: '款号',
                        key: 'goodsNo',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '货品名称',
                        key: 'goodsName',
                        align: 'center',
                        minWidth: 200
                    },
                    {
                        title: '平台货品ID',
                        key: 'platfromGoodsNo',
                        align: 'center',
                        minWidth: 120,
                        render:(h, params) => {
                            return h('span',{
                                style:{
                                    display:params.row.platfromGoodsNo.indexOf(',') != -1 ? 'none' : 'block'
                                }
                            },params.row.platfromGoodsNo)
                        }
                    },
                    {
                        title: '仓库',
                        key: 'warehouseName',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '异常状态',
                        key: 'errorCode',
                        align: 'center',
                        minWidth: 100,
                        render:(h,params)=>{
                            return h('span',Util.conversionStatus(this.errorCodeList,'code',params.row.errorCode))
                        }
                    },
                    {
                        title: '异常原因',
                        key: 'errorDetail',
                        align: 'center',
                        minWidth: 150,
                        render:(h,params)=>{
                            return h(error_detail_template,{
                                props:{
                                    params:params
                                }
                            })
                        }
                    },
                    {
                        title: '规格数',
                        key: 'skuNum',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '总可预售数',
                        key: 'presaleSum',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '预订单',
                        key: 'preOrders',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '未付款',
                        key: 'unPay',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '剩余可预售数',
                        key: 'residuePresaleSum',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '创建时间',
                        key: 'created',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '最后修改时间',
                        key: 'lastUpdated',
                        align: 'center',
                        minWidth: 150
                    }              
                ],
                list:[],
                total:0,
                page:1,
                pageSize:10,
                presaleStatusList:[
                    {
                        value:'草稿',
                        code:'100'
                    },
                    {
                        value:'预售中',
                        code:'300'
                    },
                    {
                        value:'预售结束',
                        code:'800'
                    },
                    {
                        value:'预售取消',
                        code:'950'
                    }
                ],
                errorCodeList:[
                    {
                        code:'7',
                        value:'生产单取消'
                    },
                    {
                        code:'6',
                        value:'数量变更'
                    },
                    {
                        code:'5',
                        value:'货期延迟'
                    },
                    {
                        code:'4',
                        value:'货品到货'
                    },
                    {
                        code:'3',
                        value:'库存预警'
                    },
                    {
                        code:'2',
                        value:'库存充足'
                    },
                    {
                        code:'1',
                        value:'预售到期'
                    },
                    {
                        code:'0',
                        value:'货期提前'
                    }
                ],
                userInfo:{},
                shopList:[],
                spinShow:false
            }
        },
        mounted(){
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            this.getBrandList();
            this.get_shop_list();
            this.getData();
            this.$root.eventHub.$on('refush_presale_strategy_list',()=>{
                this.getData();
            });
        },
        methods:{
            search(){
                this.page = 1;
                this.getData();
            },
            reset(){
                this.formSearch = formSearch();
                this.search();
            }, 
            getData(){
                let data = Util.deepClone(this.formSearch);
                data.userId = this.userInfo.userId;
                data.brandId = data.brandId == 0 ? '' : data.brandId;
                data.length = this.pageSize;
                data.start = (this.page - 1) * this.pageSize;
                this.spinShow = true;
                this.request('get_presale_order_list',{
                    data:data
                },false).then(res=>{
                    if(res.code == 1){
                        this.spinShow = false;
                        this.list = res.data.presaleOrderList;
                        this.total = res.data.count;
                    }
                })
            },
            edit_presale_status(orderCode,presaleStatus){
                this.request('edit_presale_status',{
                    data:{
                        orderCode:orderCode,
                        presaleStatus:presaleStatus,
                        lastUpdateUser:this.userInfo.userAccount
                    }
                },true).then(res=>{
                    if(res.code == 1){
                        this.$Message.success(res.msg);
                        this.getData();
                    }
                })
            },
            get_shop_list(){
                this.request('get_shop_list',{},true).then(res=>{
                    if(res.code == 1){
                        this.shopList = res.data;
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
                })
            },
            changePage(val){
                this.page = val;
                this.getData();
            },
            changePageSize(val){
                this.pageSize = val;
                this.getData();
            }
        }
    }
</script>