<template>
    <div class="background-color-white exhibition" id="shortage_warning_list">
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title">预警设置</p>
                    <Form :model="formSearch" class="search" ref="formSearch" :label-width="80" inline label-position="right" @submit.native.prevent="submit">
                        <Form-item label="品牌：" :label-width="50">
                            <Select style="width:162px" size="small" placeholder="请选择" @on-change="changeBrand"
                                    v-model="formSearch.brandId">
                                <Option v-for="item in data" :value="item.brandId" :key="item.brandId">
                                    {{ item.brandName }}
                                </Option>
                            </Select>
                        </Form-item>
                        <Form-item label="预警值：" >
                            <InputNumber step="5" size="small" v-model.number="formSearch.minWarningQty"></InputNumber>
                            至
                            <InputNumber step="5" size="small" v-model.number="formSearch.maxWarningQty"></InputNumber>
                        </Form-item>
                        <Form-item :label-width="1">
                            <Button type="primary" @click="submit" size="small">确认</Button>
                        </Form-item>
                    </Form>
                </Card>
            </Col>
            <Col span="24" class="margin-top-10">
                <Alert show-icon>预警SKU：{{ total }}个</Alert>
            </Col>
            <Col span="24">
                <Table size="small" :columns="columns" :data="warningList" border highlight-row></Table>
            </Col>
            <Col span="24" class="margin-top-10">
                <Page :total="total" size="small" :page-size="pageSize" :current="page" show-sizer show-total show-elevator
                      @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
            </Col>

        </Row>
    </div>
</template>

<script>
    import Util from 'libs/util'

    function formSearch(){
        return {
            brandId:'',
            minWarningQty:0,
            maxWarningQty:0
        }
    }
    export default {
        name: "shortage_warning",
        data(){
            return{
                userInfo:{},
                formSearch:formSearch(),
                data:[],
                warningList:[],
                columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '款号',
                        key: 'sectionNo',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '货品名称',
                        key: 'specName',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '季节',
                        key: 'season',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '规格名称',
                        key: 'specName',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '商家编码',
                        key: 'commodityCode',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '库存数量',
                        key: 'stockNum',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '可用库存',
                        key: 'vipStockNum',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '可用库存占比',
                        key: 'vipStockRate',
                        align: 'center',
                        minWidth:100
                    },
                ],
                page:1,
                pageSize:10,
                total:0,
            }
        },
        computed: {

        },
        mounted(){
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            this.request('get_vip_warning_qty',{
                data:{
                    userAccount:this.userInfo.userAccount,
                    userId:this.userInfo.userId
                }
            }).then(res=>{
                if(res.code == 1){
                    this.data = res.data;
                    this.formSearch.brandId = this.data[0].brandId;
                    this.changeBrand(this.formSearch.brandId);
                    this.search();
                }
            })
        },
        activated(){
            this.$nextTick(()=>{
                this.get_vip_warning_qty();
            })
        },
        methods:{
            search(){
                let data = Util.deepClone(this.formSearch);
                data.userId = this.userInfo.userId;
                data.userAccount = this.userInfo.userAccount;
                data.length = this.pageSize;
                data.start = (this.page - 1) * this.pageSize;
                if(typeof data.maxWarningQty != 'number' || typeof data.minWarningQty != 'number'){
                    this.$Message.warning('请核对表单信息！');
                    return false;
                }
                if(data.maxWarningQty < data.minWarningQty){
                    this.$Message.warning('注：最大值不能小于最小值！');
                    return false;
                }
                this.request('get_vip_warning_list',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.warningList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.warningList = res.data.warningList;
                        this.total = res.data.counts;
                    }
                })
            },
            submit(){
                this.page = 1;
                this.search();
                this.get_vip_warning_qty();
            },
            get_vip_warning_qty(){
                this.request('get_vip_warning_qty',{
                  data:{
                      userAccount:this.userInfo.userAccount,
                      userId:this.userInfo.userId
                  }
                }).then(res=>{
                    if(res.code == 1){
                        this.data = res.data;
                    }
                })
            },
            changeBrand(val){
                this.data.map(x=>{
                    if(val == x.brandId){
                        this.formSearch.minWarningQty = x.minWarningQty;
                        this.formSearch.maxWarningQty = x.maxWarningQty;
                    }
                })
            },
            CurrentChange(val) {
                this.page = val;
                this.search();
            },
            SizeChange(val) {
                this.pageSize = val;
                this.search();
            },
        }
    }
</script>

<style>

</style>
