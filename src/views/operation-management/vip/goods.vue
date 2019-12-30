<template>
    <div class="background-color-white exhibition" id="vip_goods" >
             <Row>
            <Form :model="formSearch" :label-width="50" inline label-position="right">
                <Col>
                <Form-item label="品牌：" :label-width='100'>
                        <Select v-model="formSearch.brandName" filterable clearable size="small" style="width:180px">
                              <Option v-for="item in vipBrandList" :value="item.BRAND_NAME"
                                        :key="item.BRAND_NAME">{{
                                    item.BRAND_NAME }}
                             </Option>
                        </Select>
                  </Form-item>

                <Form-item label="品类：" :label-width='100'>
                        <Select v-model="formSearch.className" filterable clearable size="small" style="width:180px">
                              <Option v-for="item in classList" :value="item.CLASS_NAME"
                                        :key="item.CLASS_NAME">{{
                                    item.CLASS_NAME }}
                             </Option>
                        </Select>
                  </Form-item>
                  
                <Form-item label="创建时间:" :label-width="100">
                    <DatePicker type="daterange" size="small" v-model="formSearch.orderCreated"  placeholder="请选择创建时间" style="width: 180px">
                    </DatePicker>
                </Form-item>

                </Col>
                <Col> 
                <Form-item label="档期ID：" :label-width='100'>
                    <Input style="width: 150px" size="small" v-model="formSearch.scheduleId"></Input>
                   </Form-item>
                   <Form-item label="商品ID：" :label-width='100'>
                    <Input style="width: 150px" size="small" v-model="formSearch.goodsId"></Input>
                   </Form-item>
                   <Form-item>
                    <Button type="primary" icon="ios-search" size="small" @click="search">查询</Button>
                    <Button type="warning" size="small" @click="reset">重置</Button>
                    <Button type="primary" size="small" @click="syncGoodsDetail">同步</Button>
                    <Button type="primary" size="small" @click="downTemplate">下载模板</Button>
                    <Button type="primary" size="small" @click="importData">导入</Button>
                    <Button type="primary" size="small" @click="exportData">导出</Button>
                      </Form-item>
                </Col>
            </Form>
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
            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total
                show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
            </Col>
        </Row>
          <Modal
                v-model="importModal"
                title="导入唯品会商品">
                <div>
                    <Upload
                        ref="upload"
                        name="file"
                        :show-upload-list="false"
                        :before-upload="handleUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        type="drag"
                        action="/eop/eom/vip/import_vip_goods"
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
                    <Button type="primary" @click="importOrderSave">导入</Button>
                </div>
            </Modal>
    </div>
</template>

<script>
    import Util from 'libs/util';
    import socket from 'libs/socket';
    // import YImage from 'y-image';
    var myComponent = Vue.extend({
        props:['params'],
        template: `
            <div>
                <div :title="params.row.goodDetail" style="width: 100px; overflow: hidden; 
                display: block; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;">            
                    {{params.row.goodDetail}}
                </div>
            </div>
        `,
        methods:{
            
        }
    })
    var insideTexture = Vue.extend({
        props:['params'],
        template: `
            <div>
                <div :title="params.row.insideTexture" style="width: 80px; overflow: hidden; 
                display: block; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;">            
                    {{params.row.insideTexture}}
                </div>
            </div>
        `,
        methods:{
            
        }
    })
    var shellFabric = Vue.extend({
        props:['params'],
        template: `
            <div>
                <div :title="params.row.shellFabric" style="width: 80px; overflow: hidden; 
                display: block; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;">            
                    {{params.row.shellFabric}}
                </div>
            </div>
        `,
        methods:{
            
        }
    })
    var GOOD_Pic = Vue.extend({
        props:['params'],
        template: `
            <div>
                
                <Tooltip placement="right"
                    <img :key="params.row.picUrl" style="height:70px;width:100px;" @click="open_url(params.row.picUrl)" 
                      :src="params.row.picUrl" onerror="this.onerror=null; 
                        this.src='params.row.picUrl'">
                </Tooltip>
            </div>
        `,
        methods:{
            open_url(url){
                window.open(url);
            }
        }
    })
    export default {
        name: 'vip_goods',
        desc: '唯品会商品',
        // components: {YImage},
        data() {
            return {
                formSearch: {
                   
                },
                importModal: false,
                editModal:false,
                loadingStatus: false,
                loading: false, //表格数据加载开关
                columns: [{
                    title: '序号',
                    key: 'serialNo',
                    align: 'center',
                    width: 60
                },{
                    title: '图片',
                    key: 'picUrl',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                            return h(GOOD_Pic,{
                                props:{
                                    params:params
                                }
                            })
                        }
                },{
                    title: '品牌名称',
                    key: 'brandName',
                    align: 'center',
                    width: 100,
                },{
                    title:'品类名称',
                    key:'className',
                    align:'center',
                    width:150
                },
                {
                    title: '档期ID',
                    key: 'scheduleId',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '商品ID',
                    key: 'goodsId',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '商品名称',
                    key: 'goodsName',
                    align: 'center',
                    width: 150
                },
                {
                    title: '款号',
                    key: 'goodsCode',
                    align: 'center',
                    width: 100
                },
                {
                    title: '件均单价',
                    key: 'price',
                    align: 'center',
                    width: 85
                },
                {
                    title: '排名',
                    key: 'ranking',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '明细',
                    key: 'goodDetail',
                    align: 'center',
                    width: 150,
                    render: (h, params) => {
                            return h(myComponent,{
                                props:{
                                    params:params
                                }
                            })
                        },
                        hidden: false
                },
                {
                    title: '选购热点',
                    key: 'hotSpot',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '肩型款式',
                    key: 'shoulderStyle',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '适用人群',
                    key: 'applyTo',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '图案',
                    key: 'pattern',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '袖型',
                    key: 'sleeveStyle',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '弹性',
                    key: 'elasticity',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '袖长',
                    key: 'outsideSleeve',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '厚薄',
                    key: 'thickness',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '适用季节',
                    key: 'season',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '衣长',
                    key: 'clothesLength',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '流行元素',
                    key: 'fashionElement',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '版型',
                    key: 'modelVersion',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '适用场合',
                    key: 'occasion',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '领型',
                    key: 'collarStyle',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '上市时间',
                    key: 'marketTime',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '适用性别',
                    key: 'gender',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '风格',
                    key: 'style',
                    align: 'center',
                    width: 150,
                },
                {
                    title: '面料',
                    key: 'shellFabric',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                            return h(shellFabric,{
                                props:{
                                    params:params
                                }
                            })
                        },
                        hidden: false
                },
                {
                    title: '功能',
                    key: 'functional',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '衣门襟',
                    key: 'clotherPlacket',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '里材质',
                    key: 'insideTexture',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                            return h(insideTexture,{
                                props:{
                                    params:params
                                }
                            })
                        },
                        hidden: false
                },
                {
                    title: '腰型',
                    key: 'waistStyle',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '裤长',
                    key: 'outsideLength',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '裙型',
                    key: 'skirtStyle',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '裙/裤',
                    key: 'skirtTrousers',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '门襟',
                    key: 'placket',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '裙长',
                    key: 'skirtLength',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '填充物',
                    key: 'filler',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '裤门襟',
                    key: 'trousersPlacket',
                    align: 'center',
                    width: 100,
                },
                ],
                list: [],
                file: null,
                page: 1,
                pageSize: 10,
                total: 0,
                userInfo:{},
                ruleValidate:{},
                vipBrandList:[],
                classList:[]
            }
        },
        computed: {

        },
        mounted() {
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));    
            this.getData()
            this.getvipBrandList()
            this.getclassList()
        },
        methods: {
            search() {
                this.page =1;
                this.getData()
            },
            reset() {
                this.formSearch = {}
                this.search();
            },
            openModal() {
                this.modal_visible = true;
            },
            cancel() {
                this.importModal = false;
                this.file = null;
            },
            currentChange(val) {
                this.page = val;
                this.getData();
            },
            sizeChange(val) {
                this.pageSize = val;
                this.getData();
            },
            downTemplate() {
                window.location = ('/excel/唯品会商品导入模板.xlsx');
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
                if (res.code == '1') {
                    this.loadingStatus = false;
                    this.file = null;
                    this.$Message.success(res.msg);
                    this.importModal = false;
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
                this.$Message.error(res.msg + res.data);
            },
            importOrderSave() {
                this.loadingStatus = true;
                Vue.prototype.$loading('正在导入数据...');
                this.$refs.upload.post(this.file);
            },
            getData() {
                let data = Util.deepClone(this.formSearch);
                if (data.orderCreated&&data.orderCreated[0]) {
                    data.startTime = Util.dateFormat(data.orderCreated[0], 'yyyy-MM-dd')
                    data.endTime = Util.dateFormat(data.orderCreated[1], 'yyyy-MM-dd')
                }
                delete data.orderCreated
                data.length = this.pageSize;
                data.start = (this.page - 1) * this.pageSize;
                this.request('get_vip_goods_list', {
                    data: data
                }, true).then((res) => {
                    let serialNoBegain = this.pageSize * (this.page - 1);
                    res.data.VIPGoodsList.map(x => {
                        serialNoBegain++;
                        x.serialNo = serialNoBegain;
                    })
                    this.total = res.data.count;
                    this.list = res.data.VIPGoodsList
                    console.log(res)
                })
            },
            exportData(){
                let data = Util.deepClone(this.formSearch);
                if (data.orderCreated&&data.orderCreated[0]) {
                    data.startTime = Util.dateFormat(data.orderCreated[0], 'yyyy-MM-dd')
                    data.endTime = Util.dateFormat(data.orderCreated[1], 'yyyy-MM-dd')
                }
                for(let x in data){
                    if(!data[x]){
                        delete data[x]
                    }
                }
                var formData=new FormData();
                for(var key in data){
                    formData[key] = data[key];
                }
                this.$Spin.show();
                axios.get(`/eop/eom/vip/export_vip_goods_list?data=${encodeURIComponent(JSON.stringify(formData))}`,{

                },true).then(res=>{
                    if(res.status == 200 && !!res.data ){
                        window.open( `/eop/eom/vip/export_vip_goods_list?data=${encodeURIComponent(JSON.stringify(formData))}`);
                        this.$Spin.hide();
                    }else{
                        this.$Message.warning('无数据可导出！');
                        this.$Spin.hide();
                    }
                })
            },
             getvipBrandList() {
                this.request('get_vip_brand_list', {}, false).then((res) => {
                    if (res.code == 1) {
                        this.vipBrandList = res.data
                    }
                })
            },
            getclassList() {
                this.request('get_vip_class_list', {}, false).then((res) => {
                    if (res.code == 1) {
                        this.classList = res.data
                    }
                })
            },
            syncGoodsDetail(){
                 let data = Util.deepClone(this.formSearch)
                 let query={
                    userId:this.userInfo.userId,
                    type:'syn_vip_goods_detail',
                 }
                socket(query)
                //  if(data.manuOrderCode){
                //     query.manuOrderCode = data.manuOrderCode
                //  }
                //  if (data.orderCreated&&data.orderCreated[0]) {
                //     query.startTime = Util.dateFormat(data.orderCreated[0], 'yyyy-MM-dd')
                //     query.endTime = Util.dateFormat(data.orderCreated[1], 'yyyy-MM-dd')
                //  }
            }
        }
    }
</script>

<style lang="css">
  
</style>
