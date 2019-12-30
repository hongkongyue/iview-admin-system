<template>
    <div class="background-color-white exhibition" id="presale_pool_list">
        <Form 
            :model="formSearch" 
            ref="formSearch" 
            :label-width="75" 
            inline
            label-position="right"
            @keydown.native.enter.prevent="search"
        >
            <Form-item label="品牌：" :label-width="50">
                <Select style="width:140px" size="small" v-model="formSearch.brandId" placeholder="请选择品牌" @on-change='search'>
                    <Option v-for="item in brandList" :value="item.id" :key="item.id">
                        {{ item.brands }}
                    </Option>
                </Select>
            </Form-item>
            <Form-item label="款号：">
                <Input size="small" v-model="formSearch.goodsNo" style="width: 120px" placeholder="请输入款号" @on-blur='get_brand_by_sectionNo'></Input>
            </Form-item>
            <Form-item label="商家编码">
                <Input size="small" v-model="formSearch.specNo" style="width: 120px" placeholder="请输入商家编码" @on-blur='get_brand_by_sectionNo'></Input>
            </Form-item>
            <Form-item label="生产制单号">
                <Input size="small" v-model="formSearch.orderNo" style="width: 120px" placeholder="请输入生产制单号" @on-blur='get_brand_by_sectionNo'></Input>
            </Form-item>
            <Form-item :label-width='1'>
                <Button type="primary" @click="search" size="small">查询</Button>
                <Button type="warning" @click="reset" size="small">重置</Button>
            </Form-item>
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
import { isNull } from 'util';
    function formSearch(){
        return {
            brandId:0,
            goodsNo:'',
            specNo:'',
            orderNo:''
        }

    }
    export default {
        name:'presale_pool_list',
        data(){
            return {
                formSearch: formSearch(),
                brandList:[],
                userInfo:{},
                columns:[
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        fixed: 'left',                        
                        minWidth: 150,
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
                                            let data = {
                                                goodsNo:params.row.goodsNo
                                            };
                                            if(!!this.formSearch.orderNo){
                                                data.orderNo = this.formSearch.orderNo;
                                            }
                                            if(!!this.formSearch.brandId){
                                                data.brandId = this.formSearch.brandId;
                                            }
                                            this.$router.push({
                                                name:'presale_pool_detail',
                                                params:data
                                            })
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            let data = {
                                                goodsNo:params.row.goodsNo
                                            };
                                            if(!!this.formSearch.orderNo){
                                                data.orderNo = this.formSearch.orderNo;
                                            }
                                            if(!!this.formSearch.brandId){
                                                data.brandId = this.formSearch.brandId;
                                            }
                                            this.$router.push({
                                                name:'presale_pool_add',
                                                params:data
                                            })
                                        }
                                    }
                                }, '编辑')
                            ])
                        }
                    },
                    {
                        title: '款号',
                        key: 'goodsNo',
                        align: 'center',
                        minWidth: 100
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
                                    display:!isNull(params.row.platfromGoodsNo) && params.row.platfromGoodsNo.indexOf(',') != -1 ? 'none' : 'block'
                                }
                            },params.row.platfromGoodsNo)
                        }
                    },
                    {
                        title: '规格数',
                        key: 'skuNum',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '安全库存',
                        key: 'safeStock',
                        align: 'center',
                        minWidth: 100
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
                        minWidth: 140
                    },
                    {
                        title: '仓库',
                        key: 'warehouseName',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '生产制单数量',
                        key: 'produceOrderNum',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '最近计划到货日期',
                        key: 'recentlyDate',
                        align: 'center',
                        minWidth: 140
                    },
                    {
                        title: '总下单数',
                        key: 'preSum',
                        align: 'center',
                        minWidth: 100
                    }           
                ],
                list:[],
                total:0,
                page:1,
                pageSize:10,
                spinShow:false
            }
        },
        mounted(){
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            this.getBrandList();
            this.getData();
            this.$root.eventHub.$on('refush_presale_pool_list',()=>{
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
                this.spinShow = true;
                let data = Util.deepClone(this.formSearch);
                data.userId = this.userInfo.userId;
                data.brandId = data.brandId == 0 ? '' : data.brandId;
                data.length = this.pageSize;
                data.start = (this.page - 1) * this.pageSize;
                this.request('get_presale_pool',{
                    data:data
                },false).then(res=>{
                    if(res.code == 1){
                        this.list = res.data.presaleOrderList;
                        this.total = res.data.count;
                        this.spinShow = false;
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