<template>
    <div class="background-color-white exhibition" id="production_order_list">
        <Form 
            :model="formSearch" 
            class="search" 
            ref="formSearch" 
            :label-width="75" 
            inline
            label-position="right"
            @keydown.native.enter.prevent="search"
        >
            <Form-item label="品牌：" :label-width="50">
                <Select style="width:140px"  v-model="formSearch.brandId" placeholder="请选择品牌" @on-change='search'>
                    <Option v-for="item in brandList" :value="item.id" :key="item.id">
                        {{ item.brands }}
                    </Option>
                </Select>
            </Form-item>
            <Form-item label="款号：">
                <Input  v-model="formSearch.goods_no" style="width: 120px" placeholder="请输入款号" ></Input>
            </Form-item>
            <Form-item label="生产单号">
                <Input  v-model="formSearch.order_no" style="width: 120px" placeholder="请输入生产单号"></Input>
            </Form-item>
            <Form-item :label-width='1'>
                <Button type="primary" @click="search" >查询</Button>
                <Button type="warning" @click="reset" >重置</Button>
            </Form-item>
        </Form>
        <Row>
            <Col class="margin-bottom-10">
                <Table ref="orderList" size="small" :columns="columns" :data="list"></Table>
            </Col>
            <Col>
                 <Page :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator
                @on-change="changePage" @on-page-size-change="changePageSize"></Page>   
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name:'production_order_list',
        desc:'生产单跟进',
        data(){
            return {
                formSearch: {},
                brandList:[],
                columns:[
                    {
                      title:'序号',
                      key:'serialNo',
                      align: 'center',
                       minWidth: 80
                    },
                    {
                      title:'生产单号',
                      key:'order_no',
                      align: 'center',
                       minWidth: 110,
                        render:(h,params) => {
              return h('a',{
              on: {
                 click: () => {
                      this.viewDetail(params.row);
                 }
              }
              },params.row.order_no);
            }
                    },
                    {
                        title: '批次号',
                        key: 'batch_no',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '大货状态',
                        key: 'big_goods_status',
                        align: 'center',
                        minWidth: 100,
                         render: (h, params) => {
                          let showColor = 'green';
                          let showName = '已完成'
                          if (params.row.big_goods_status == 0) {
                              showColor = '#ff9900';
                              showName = '未完成'
                          } else if (params.row.big_goods_status == -1) {
                              showColor = '#ed3f14';
                              showName = '已取消'
                          }
                          return h('Tag', {
                              props: {
                                  color: showColor
                              }
                          }, showName)
                      }
                    },
                    {
                        title: '预售状态',
                        key: 'presale_status',
                        align: 'center',
                        minWidth: 120,
                        render: (h, params) => {
                          let showColor = 'green';
                          let showName = '已完成'
                          if (params.row.presale_status == 0) {
                              showColor = '#ff9900';
                              showName = '未预售'
                          } else if (params.row.presale_status == 950) {
                              showColor = '#ed3f14';
                              showName = '已取消'
                          }else if (params.row.presale_status == 100) {
                              showColor = '#ed3f14';
                              showName = '草稿'
                          }else if (params.row.presale_status == 300) {
                              showColor = 'green';
                              showName = '预售中'
                          }else if (params.row.presale_status == 800) {
                              showColor = '#ed3f14';
                              showName = '预售结束'
                          }
                          return h('Tag', {
                              props: {
                                  color: showColor
                              }
                          }, showName)
                      }
                    },
                    {
                        title: '款号',
                        key: 'goods_no',
                        align: 'center',
                        minWidth: 90
                    },
                    {
                        title: '规格数',
                        key: 'sku_num',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '品牌',
                        key: 'brand_name',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '仓库',
                        key: 'warehouse_name',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '单据类型',
                        key: 'order_type',
                        align: 'center',
                        minWidth: 90
                    },
                    {
                        title: '合约货期',
                        key: 'contract_delivery_time',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '计划交货时间',
                        key: 'plan_delivery_time',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '供应商',
                        key: 'supplier_name',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '下单数',
                        key: 'num',
                        align: 'center',
                        minWidth: 80
                    },
                     {
                        title: '下单日期',
                        key: 'order_date',
                        align: 'center',
                        minWidth: 120
                    },
                    //  {
                    //     title: '创建时间',
                    //     key: 'order_created',
                    //     align: 'center',
                    //     minWidth: 150
                    // }  
                ],
                list:[],
                total:0,
                page:1,
                pageSize:10
            }
        },
        activated(){
            this.getBrandList();
            this.getListData()
        },
        methods:{
            search(){
                this.getListData()
            },
            reset(){
                this.formSearch={}
                this.page=1
                this.search()
            },
            getListData(){
                let data = this.formSearch
                data.page = this.page
                data.pageSize = this.pageSize
                if(this.formSearch.order_no||this.formSearch.goods_no||this.formSearch.brand_id){
                       data.page = 1
                }
                this.request('get_production_order_list',data,true).then((res)=>{
                if(res.errno==0){
                    let serialNoBegain = this.pageSize * (this.page - 1);
                    for(let item of res.data.data){
                       serialNoBegain++;
                       item.serialNo = serialNoBegain;
                    }
                    this.list = res.data.data
                    this.total = res.data.count
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
                this.getListData();
            },
            changePageSize(val){
                this.pageSize = val;
                this.getListData();
            },
            viewDetail(row){

        this.$router.push({
          name: 'production_order_detail',
          params: {
            orderId:row.id,
            orderNo:''
          }
        });

            }
        }
    }
</script>