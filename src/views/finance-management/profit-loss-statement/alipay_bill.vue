<template>
    <div id='alipay_bill'>
        <Form :model="formSearch" :label-width="100" inline label-position="right">
            <div class="background-color-white exhibition" style="margin-bottom:10px">
                <Row>
                    <Form-item label="日期：" :label-width="50">
                        <DatePicker type="daterange" v-model="formSearch.datetime" split-panels placeholder="选择日期" style="width: 180px"></DatePicker>
                    </Form-item>
                    <Form-item label="店铺：" :label-width="50" v-if="activeTable == 'bill_costview'" @click='exportData'>
                        <Select v-model="formSearch.shop_id" style="width:170px" @on-change='changeShop'>
                            <Option v-for="item in AllShopList" :value="item.shop_id" :key="item.shop_id">{{ item.shop_name }}</Option>
                        </Select>           
                    </Form-item>
                    <Form-item label="店铺：" :label-width="50" v-if="activeTable == 'bill'" @click='openModal'>
                        <Select v-model="formSearch.shop_id" style="width:170px" @on-change='changeShop'>
                            <Option v-for="item in shopList" :value="item.shop_id" :key="item.shop_id">{{ item.shop_name }}</Option>
                        </Select>           
                    </Form-item>
                     <Form-item label="费用类型：" :label-width='80'　v-if="activeTable == 'bill'">
                  　  <Select v-model="formSearch.fee_type" style="width:150px">
                        <Option v-for="item in feeTypeList" :value="item.name" :key="item.name">{{ item.name }}
                        </Option>
                    </Select>
              　　　　  </Form-item>
                    <Form-item label="店铺：" :label-width="50" v-if="activeTable == 'return_cash'">
                        <Select v-model.number="formSearch.shop_id" style="width:170px" @on-change='changeShop'>
                            <Option v-for="item in shop_list" :value="item.shopId" :key="item.shopId">{{ item.shopName }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item :label-width="10">
                        <Button type="primary" @click="search">查询</Button> 
                        <!-- <Button type="primary" v-if="activeTable=='return_cash'" icon="arrow-down-a" @click="downTemplate()">下载模板</Button> -->
                        <!-- <Button type="primary" v-if="activeTable == 'bill'" @click='openModal'>导入</Button>  -->
                        <Button type="primary" v-if="activeTable == 'bill'" @click="sync_alipay_bill">同步账单</Button>   
                        <Button type="primary" v-if="activeTable == 'bill_costview'||activeTable=='data_integration'" @click='exportData'>导出</Button>  
                        <Button type="primary" v-if="activeTable == 'data_integration'" @click="sync_alipay_return_refund">同步</Button>         
                        <!-- <Button type="primary" v-if="activeTable == 'return_cash'" @click="open_return_cash_modal">导入</Button> -->
                        <Button type="primary" v-if="activeTable == 'return_cash'" @click="sync_alipay_refund_bill">同步账单</Button>
                        <Button type="warning" @click="reset" >重置</Button> 
                    </Form-item>
                </Row>
            </div>
            <div class="background-color-white exhibition">
                <Row>
                    <Col>
                        <Tabs type="card" @on-click="tabClick" :value="activeTable">
                            <TabPane label="支付宝账单" name="bill">
                                <Col class="margin-bottom-10">
                                    <Table :columns="bill_columns"  size="small" :data="bill_list"></Table>
                                </Col>
                                <Col>
                                    <Page :total="bill_total" :page-size="bill_pageSize" :current="bill_page"  show-sizer show-total show-elevator @on-change="bill_CurrentChange" @on-page-size-change="bill_SizeChange"></Page>
                                </Col>
                            </TabPane>
                            <TabPane label="支付宝收支汇总" name="bill_costview">
                                <Col class="margin-bottom-10">
                                    <Table :columns="bill_costview_columns"  size="small" :data="bill_costview_list"></Table>
                                </Col>
                            </TabPane>
                            <TabPane label="返现" name="return_cash">
                                <returnCash :formSearch='formSearch' ref='return_cash'></returnCash>
                            </TabPane>
                            <TabPane label="数据整合" name="data_integration">
                                <dataIntegration :data="dataIntegrationList"></dataIntegration>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
            </div>
        </Form>
        <div class="modal">
            <Modal
                v-model="importModal"
                title="批量导入">
                <div>
                    <Upload
                        ref="upload"
                        name="file"
                        :show-upload-list="false"
                        :before-upload="handleUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        type="drag"
                        action="/eop-node/api/analysis/import_alipay_bill"
                        :data="{shop_id:formSearch.shop_id,shop_name:formSearch.shop_name,account:userInfo.userAccount,userId:userInfo.userId}"
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
    </div>
</template>

<script>
    import data_integration from './alipay_bill_components/data_integration.vue'
    import return_cash from './alipay_bill_components/return_cash.vue'
    import Util from 'libs/util';
    import { request } from 'http';
    function formSearch(){
        return {
            datetime:[],
            shop_id:'',
            shop_name:''
        }
    }
    export default {
        name:'alipay_bill',
        data(){
            return {
                formSearch:formSearch(),
                activeTable:'bill',
                shopList:[],
                AllShopList:[],
                bill_columns:[
                    {
                        title: '入账时间',
                        key: 'enter_created',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '支付宝流水号',
                        key: 'serial_no',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '收入（+元）',
                        key: 'income',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '支出（-元）',
                        key: 'spend',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '账户余额（元）',
                        key: 'balance',
                        align: 'center',
                        minWidth: 100
                    },{
                        title:'费用类型',
                        key:"fee_type",
                        align:"center",
                        minWidth: 80
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        minWidth: 400
                    }
                ],
                bill_list:[],
                bill_page:1,
                bill_pageSize:10,
                bill_total:0,

                bill_costview_list:[],
                bill_costview_columns:[
                    {
                        title: '入账时间',
                        key: 'enter_created',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '用途',
                        key: 'remark',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '收入（+元）',
                        key: 'income',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '支出（-元）',
                        key: 'spend',
                        align: 'center',
                        minWidth: 80
                    }
                ],
                importModal:false,
                userInfo:{},
                file:null,
                dataIntegrationList:[],
                shop_list:[],
                feeTypeList:[
                    {
                        name:'销售佣金'
                    },{
                        name:'保险理赔'
                    },{
                        name:'支付宝退款'
                    },{
                        name:'未知'
                    }
                ]
            }
        },
        computed:{

        },
        mounted(){
            this.get_alipay_shopList();
            this.get_alipay_bill();
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));
        },
        methods:{
            search(){
                if(this.activeTable == 'bill'){
                    this.bill_page = 1;
                    this.get_alipay_bill();
                }else if(this.activeTable=='data_integration'){
                    this.get_alipay_bill_data_integration()
                }
                else if(this.activeTable == 'bill_costview'){
                    this.get_alipay_bill_costview();
                }else if(this.activeTable == 'return_cash'){
                    this.$refs['return_cash'].search();
                }
            },
            get_daily_shop_list(){
                this.request('get_daily_shop_list',{
                    data:{}
                }).then(res=>{
                    if(res.code == 1){
                        this.shop_list = res.data;
                        this.shop_list.unshift({
                            shopId:'',
                            shopName:'所有店铺'
                        })
                    }
                })
            },
            reset(){
                this.formSearch = formSearch();
                if(this.activeTable == 'bill'){
                    this.bill_page = 1;
                    this.get_alipay_bill();
                }else if(this.activeTable == 'bill_costview'){
                    this.get_alipay_bill_costview();
                }else if(this.activeTable == 'return_cash'){
                    this.$refs['return_cash'].reset();
                }
            },
            get_alipay_bill(){
                let data = Util.deepClone(this.formSearch);
                data.pageNum = this.bill_page;
                data.pageSize = this.bill_pageSize;
                this.request('get_alipay_bill',data,true).then(res=>{
                    if(res.status == 'success'){
                        this.bill_list = res.data.data;
                        this.bill_total = res.data.count;
                    }
                })
            },
            get_alipay_bill_costview(){
                if(!this.formSearch.datetime[0] && !this.formSearch.datetime[1]){
                    this.$Message.warning('请选择日期！')
                    return false;
                }
                
                this.request('get_alipay_bill_costview',{
                    shop_id:this.formSearch.shop_id,
                    datetime:this.formSearch.datetime
                },true).then(res=>{
                    if(res.status == 'success'){
                        let income = 0;
                        let spend = 0;
                        res.data.map(x=>{
                            income += Number(x.income);
                            spend += Number(x.spend);
                        })
                        if(!!res.data && res.data.length > 0 ){
                            res.data.push({
                                income:income.toFixed(2),
                                spend:spend.toFixed(2),
                                remark:'总计',
                                enter_created:''
                            })
                        }
                        
                        this.bill_costview_list = res.data;
                    }
                })
            },
            get_alipay_bill_data_integration(){
                if(!this.formSearch.datetime[0] && !this.formSearch.datetime[1]){
                    this.$Message.warning('请选择日期！')
                    return false;
                }
                this.request('get_alipay_bill_data_integration',{
                    datetime:this.formSearch.datetime
                },true).then(res=>{
                    if(res.status == 'success'){
                       this.dataIntegrationList = res.data
                    }
                })
            },
            get_alipay_shopList(){
                this.request('get_alipay_shopList',{
                    platfrom_id:1
                },true).then(res=>{
                    if(res.status == 'success'){
                        this.shopList = res.data;
                        this.AllShopList = Util.deepClone(res.data);
                        this.AllShopList.unshift({
                            shop_id:'',
                            shop_name:'所有店铺'
                        })
                    }
                })
            },
            changeShop(val){
                this.shopList.map(x=>{
                    if(x.shop_id == val){
                        this.formSearch.shop_name = x.shop_name
                    }
                })
                if(this.activeTable == 'bill'){
                    this.get_alipay_bill();
                }else if(this.activeTable == 'bill_costview'){
                    this.get_alipay_bill_costview();
                }else if(this.activeTable == 'return_cash'){
                    this.$refs['return_cash'].search();
                }
            },
            openModal(){
                if(!this.formSearch.shop_id){
                    return this.$Message.warning('请选择店铺后导入！');
                }
                this.importModal = true;
            },
            tabClick(val){
                this.activeTable = val;
                if(this.activeTable == 'return_cash'){
                    this.get_daily_shop_list();
                }
                // if(this.activeTable == 'bill'){
                //     this.get_alipay_bill();
                // }else{
                //     this.get_alipay_bill_costview();
                // }
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
            cancel(){
                this.importModal = false;
                this.file = null;
            },
            exportData(){
                if(!this.formSearch.datetime[0] && !this.formSearch.datetime[1]){
                    this.$Message.warning('请选择日期！')
                    return false;
                }
                let requestUrl='export_alipay_bill_costview'
                if(this.activeTable=='data_integration'){
                    requestUrl='export_alipay_bill_data_integration'
                }
                this.request(requestUrl,{
                    shop_id:this.formSearch.shop_id,
                    datetime:this.formSearch.datetime
                },true).then(res=>{
                    if(res.status=='success'){
                        this.$Message.success(res.message);
                        if(document.location.href.indexOf('localhost')>0||document.location.href.indexOf('127.0.0.1')>0){
                            window.open('http://127.0.0.1:8360'+res.data)
                        }else{
                            window.open(res.data)
                        }
                    }else{
                        this.$Message.warning(res.message);
                    }
                })
            },
            downTemplate(){
                window.location = ('/excel/店铺返现退款导入模板.xlsx')
            },
            bill_CurrentChange(val){
                this.bill_page = val;
                this.get_alipay_bill();
            },
            bill_SizeChange(val){
                this.bill_pageSize = val;
                this.get_alipay_bill();
            },
            open_return_cash_modal(){
                this.$refs['return_cash'].openModal();
            },
            //下载模板
            downTemplate(){
                if(this.activeTable=='return_cash'){
                    window.location = ('/excel/店铺返现导入模板.xlsx')
                }
            },
            //同步退款返现数据 到 日报项-退款返现 中
            sync_alipay_return_refund(){

                if(!this.formSearch.datetime[0] && !this.formSearch.datetime[1]){
                    this.$Message.warning('请选择日期！')
                    return false;
                }

                this.request('sync_alipay_return_refund',{
                    datetime:this.formSearch.datetime,
                    userName:this.userInfo.userName
                },true).then(res=>{
                    if(res.status=='success'){
                       this.$Message.info(res.message);
                    }else{
                        this.$Message.warning(res.message);
                    }
                })
            },
            //手动同步支付宝账单数据
            sync_alipay_bill(){

                if(!this.formSearch.datetime[0] && !this.formSearch.datetime[1]){
                    this.$Message.warning('请选择日期！')
                    return false;
                }

                if(!this.formSearch.shop_id){
                    this.$Message.warning('请选择店铺！')
                    return false;
                }

                this.request('sync_alipay_bill',{
                    datetime:this.formSearch.datetime,
                    userName:this.userInfo.userName,
                    shopId:this.formSearch.shop_id
                },'正在同步账单数据...').then(res=>{
                    if(res.status=='success'){
                       this.$Message.info(res.message);
                       this.search();
                    }else{
                        this.$Message.warning(res.message);
                    }
                })
            },
             //手动同步支付宝账单数据
            sync_alipay_refund_bill(){

                if(!this.formSearch.datetime[0] && !this.formSearch.datetime[1]){
                    this.$Message.warning('请选择日期！')
                    return false;
                }

                this.request('sync_alipay_refund_bill',{
                    datetime:this.formSearch.datetime,
                    userName:this.userInfo.userName
                },'正在同步退款账单数据...').then(res=>{
                    if(res.status=='success'){
                       this.$Message.info(res.message);
                       this.search();
                    }else{
                        this.$Message.warning(res.message);
                    }
                })
            }
        },
        components:{
            'dataIntegration':data_integration,
            'returnCash':return_cash
        }
    }
</script>

<style lang="css">
    #alipay_bill .ivu-form-item{
        margin-bottom:0;
    }
</style>
