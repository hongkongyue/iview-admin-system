<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">  
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="款号:"  :label-width="50">
                    <Input v-model="formSearch.goodsNo" placeholder="" style="width: 180px"></Input>
                </Form-item>
                <Form-item :label-width="1">
                    <Button type="primary" @click="search">查询</Button>
                    <Button type="default" @click="handleReset">重置</Button>
                </Form-item>
                </Col>
            </Form>
            
        </Row>
         <!-- 数据列表 -->
        <Row class="background-color-white exhibition">
            <Table :columns="columns" size="small" highlight-row :data="list" @on-row-dblclick="edit"></Table>
            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total
                show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
        </Row>
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
        name:'category',
        data() {
            return {
                finishCurrentEstimateOrders:'',
                columns: [{
                        title: '序号',
                        type:'index',
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '年份',
                        key: 'year',
                        align: 'center',
                        minWidth:100,
                    },
                    
                    {
                        title: '季节',
                        key: 'season',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '平台',
                        key: 'platformName',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '活动名称',
                        key: 'activityName',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '款号',
                        key: 'goodsNo',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '往期销量比例',
                        key: 'salesPercentage',
                        align: 'center',
                        minWidth:100,
                        render: (h, params) => {
                                return h('span', parseInt(params.row.salesPercentage * 100) + '%')
                        }
                    },
                    {
                        title: '往期预估销量',
                        key: 'pastEstimateSales',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '当前预估销量',
                        key: 'currentEstimateOrders',
                        align: 'center',
                        minWidth:100,
                        render: (h, params) => {
                            if (params.row.$isEdit) {
                                return h('Input', {
                                    props: {
                                        type: 'number',
                                        value: this.list[params.index].currentEstimateOrders,
                                        size: 'small',
                                        pattern:(/[^\d]/g,'')
                                    },
                                    // on: {
                                    //     'on-blur': (event) => {
                                    //         this.list[params.index].currentEstimateOrders = event.target.value;
                                    //     }
                                    // }
                                    on: {
                                        "on-change": (event) => {
                                            params.row.currentEstimateOrders= event.target.value
                                            this.finishCurrentEstimateOrders= event.target.value  
                                            if(event.target.value.length>8){
                                                 this.$Message.warning('预估销量最大的输入长度为8位')
                                                 params.row.currentEstimateOrders= params.row.currentEstimateOrders.substr(0,8)
                                            }
                                            else if(event.target.value.indexOf('.') !== -1){
                                                this.$Message.error('预估销量不能输入小数')
                                            }
                                            else if(event.target.value<0){
                                                this.$Message.warning('预估销量不能为负数')
                                            }
                                           
                                        }
                                    },
                                })
                            } else {
                                return h('span', params.row.currentEstimateOrders)
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'operate',
                        minWidth: 220,
                        fixed: 'right',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                    },
                                    on: {
                                        click: (e) => {
                                            this.handleSave(params.row)
                                        }
                                    }
                                }, '编辑'),
                                 h('Button', {
                                    props: {
                                        // type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        display:params.row.$isEdit == true ? 'inline-block':'none'
                                    },
                                    on: {
                                        click: (e) => {
                                            this.saveTable(params.row)
                                            console.log(params.row.$isEdit,'////')
                                        }
                                    }
                                }, '保存'),
                                h('Button', {
                                    props: {
                                        // type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        display:params.row.$isEdit == true ? 'inline-block':'none'
                                    },
                                    on: {
                                        click: (e) => {
                                            this.getData()
                                            this.handleEdit(params.row)
                                        }
                                    }
                                }, '取消'),
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
                                                     this.tableDelete(params);
                                                },
                                                onCancel: () => {
                                                    this.$Message.warning('已取消删除');
                                                }
                                           
                                        })
                                     }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ],
                 formSearch: {
                    brandId:'',//品牌id
                    userId:'',//处理人id
                },
                visible:false,
                total: 0,
                page: 1,
                pageSize: 10,
                list:[],
                optionList:[
                    {valeu:'1',label:'北京2222222'},
                    {valeu:'2',label:'上海'},
                    {valeu:'3',label:'杭州'}
                    
                ],
                employeeList:[],
                employeeListTwo:[],
                brandList:[],
                brandListTwo:[],
                seasonList:[
                    {name:'春季'},
                    {name:'夏季'},
                    {name:'秋季'},
                    {name:'冬季'}
                ]
            }
        },
        mounted() {
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
        },
        // activated() {
        //     console.log(this.$route.query.obj.toString().length)
        //     if(this.$route.query.obj.toString().length > 0){
        //         this.getData()
        //     }
        // },
        created(){
            this.getData()
        },
        methods: {
           currentChange(page){
               this.page = page
               this.getData()
           },
           sizeChange(pageSize){
               this.pageSize = pageSize
               this.getData()
           },
            //获取table数据
            getData(){
                let data = {}
                    data.start = (this.page - 1)*this.pageSize
                    data.length = this.pageSize
                    data.goodsNo = this.formSearch.goodsNo
                    data.reorderPlanId = this.$route.query.obj
                this.request('reorderPlan_getActivityDetails', {data}, false).then((res) => {
                    if(res.code==1){
                      this.list=res.data.eomReorderPlanDetailList
                      this.total = res.data.count
                    }
                })
            },
            //重置
            handleReset(){
                this.formSearch = {}
            },
            //查询
            search(){
                this.getData()
            },
            handleSave(row){
                this.$set(row, '$isEdit', true)
            },
             handleEdit(row){
                this.$set(row, '$isEdit', false)
            },
            //编辑保存 
            saveTable(prame){
                if(this.finishCurrentEstimateOrders == ''){
                    this.$Message.error('请先编辑再保存')
                }else{
                    let data = {}
                data.id = prame.id
                data.currentEstimateOrders = this.finishCurrentEstimateOrders
                this.request('reorderPlan_updateActivityDetails', {data}, false).then((res) => {
                    if(res.code==1){
                        this.$Message.success(res.msg)
                        this.finishCurrentEstimateOrders = ''
                     this.getData()
                    }
                })
                }
            },
            //删除 
            tableDelete(prame){
                let data = {}
                data.ids = [prame.row.id]
                 this.request('reorderPlan_deleteActivityDetails', {data}, false).then((res) => {
                    if(res.code=='1'){
                        this.$Message.success(res.msg)
                     this.getData()
                    }
                })
            },
        }
    }
</script>

<style>

</style>
