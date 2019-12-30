<template>
    <div class="background-color-white exhibition" id="good_external_info">
        <Row class="margin-bottom-10">
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Col>
                    <Form-item label="品牌：" :label-width='50'>
                        <Select v-model="formSearch.brandId" style="width:130px" placeholder='请选择品牌'>
                            <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="款号：" :label-width='50'>
                        <Input style="width:130px;"  v-model="formSearch.sectionNo" placeholder="请输入款号"></Input>
                    </Form-item>
                    <Form-item label="商品编码：" :label-width='80'>
                        <Input style="width:130px;"  v-model="formSearch.commodityCode" placeholder="请输入商品编码"></Input>
                    </Form-item>
                    <Form-item :label-width="10">
                        <Button type="primary"  icon="ios-search" @click="search">查询</Button>
                        <Button type="warning"  @click="reset">重置</Button>
                    </Form-item>
                </Col>
            </Form>
        </Row>
        <Row class="margin-bottom-10">
            <Col>
                <Button type="primary" @click="downTemplate">下载模板</Button>                
                <Button type="primary" @click="openModal">导入</Button>
            </Col>
        </Row>
        <Row>
            <Col class="margin-bottom-10">
                <Table :columns="columns" size="small" :data="list"></Table>
            </Col>
            <Col>
                <Page :total="total" :page-size-opts="[16,32,48,64]" :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
            </Col>
        </Row> 
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
                        action="/eop-node/api/shop_operation/data_import/good_external_info/importData"
                        :data="{userAccount:userInfo.userAccount}"
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
            <Modal 
                v-model="model_visible"
                title="明细"
                :mask-closable="false" 
                :width="800"
                :transfer="true"
                class-name="customize-modal-center"
            >
                <Row>
                    <Col class="margin-bottom-10">
                        <Table :columns="detail_columns" height='300' size="small" :data="detail_List"></Table>
                    </Col>
                </Row>
            </Modal>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import Util from 'libs/util';

    function formSearch(){
        return {
            brandId:0,                 //  品牌id
            sectionNo:'',
            commodityCode:''
        }
    }

    export default {
        name:'good_external_info',
        data(){
            return {
                formSearch:formSearch(),
                userInfo:{},
                brandList:[],
                importModal:false,
                file:null,
                list:[],
                tempList:[],
                detail_List:[],
                detail_columns:[
                    {
                        title: '修改字段名',
                        key: 'field_name',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '原值',
                        key: 'old_value',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '新值',
                        key: 'new_value',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '修改人',
                        key: 'update_user',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '修改时间',
                        key: 'updated',
                        align: 'center',
                        minWidth: 150
                    }
                ],
                table_row_index:-1,
                columns:[
                    {
                        title: '品牌',
                        key: 'brand_name',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '款号',
                        key: 'section_no',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '商家编码',
                        key: 'commodity_code',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '图片链接',
                        key: 'img_url',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => {
                            if ((this.page - 1) * this.pageSize + params.index == this.table_row_index) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].img_url,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].img_url = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.img_url)
                            }
                        }
                    },
                    {
                        title: '唯品会售价',
                        key: 'vip_price',
                        align: 'center',
                        minWidth: 120,
                        render: (h, params) => {
                            if ((this.page - 1) * this.pageSize + params.index == this.table_row_index) {
                                return h('InputNumber', {
                                    props: {
                                        min:'0',
                                        value: this.list[params.index].vip_price,
                                        size: 'small'
                                    },
                                    on: {
                                        'input': (event) => {
                                            this.list[params.index].vip_price = event;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.vip_price)
                            }
                        }
                    },
                    {
                        title: '电商平台价格',
                        key: 'electricity_platform_price',
                        align: 'center',
                        minWidth: 120,
                        render: (h, params) => {
                            if ((this.page - 1) * this.pageSize + params.index == this.table_row_index) {
                                return h('InputNumber', {
                                    props: {
                                        min:'0',
                                        value: this.list[params.index].electricity_platform_price,
                                        size: 'small'
                                    },
                                    on: {
                                        'input': (event) => {
                                            this.list[params.index].electricity_platform_price = event;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.electricity_platform_price)
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        minWidth: 200,
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
                                            this.request('get_good_external_info_detail',{
                                                uuid:params.row.uuid
                                            },true).then(res=>{
                                                if(res.code == 1){
                                                    res.data.map(x=>{
                                                        switch (x.field_name){
                                                            case 'img_url':
                                                                x.field_name = '图片链接'
                                                                break;
                                                            case 'vip_price':
                                                                x.field_name = '唯品会售价'
                                                                break;
                                                            case 'electricity_platform_price':
                                                                x.field_name = '电商平台价格'
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    })
                                                    this.detail_List = res.data;
                                                }
                                            })
                                            this.model_visible = true;
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
                                            this.table_row_index = (this.page - 1) * this.pageSize + params.index;
                                        }
                                    }
                                }, '编辑'),
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
                                            let row = Util.deepClone(params.row);
                                            let data = {}
                                            if(row.img_url != this.tempList[params.index].img_url){
                                                data.img_url = row.img_url;
                                            }
                                            if(row.vip_price != this.tempList[params.index].vip_price){
                                                data.vip_price = row.vip_price;
                                            }
                                            if(row.electricity_platform_price != this.tempList[params.index].electricity_platform_price){
                                                data.electricity_platform_price = row.electricity_platform_price;
                                            }
                                            if(JSON.stringify(data)=="{}"){
                                                this.table_row_index = -1;
                                                return false;
                                            }else{
                                                data.uuid = row.uuid;
                                                data.lastUpdateUser = this.userInfo.userName;
                                            }
                                            this.request('update_good_external_info',data,true).then(res=>{
                                                if(res.code == 1){
                                                    this.$Message.success(res.msg);
                                                    this.table_row_index = -1;
                                                    this.getData();
                                                }
                                            })
                                        }
                                    }
                                }, '保存'),
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
                                                    this.request('delete_good_external_info',{
                                                        uuid:params.row.uuid
                                                    },true).then(res=>{
                                                        if(res.code == 1){
                                                            this.$Message.success(res.msg);
                                                            this.getData();
                                                        }
                                                    })
                                                },
                                                onCancel: () => {
                                                    this.$Message.warning('已取消删除');
                                                }
                                            })
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                page:1,
                pageSize:10,
                total:0,
                model_visible:false
            }
        },
        computed:{
            
        },
        mounted(){
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            this.getBrandList();
            this.search();
        },
        methods:{
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
            getData(){
                let data = Util.deepClone(this.formSearch);
                data.brandId = data.brandId == 0 ? '' : data.brandId;
                data.page = this.page;
                data.pageSize = this.pageSize;
                this.request('get_good_external_info_list',data,true).then(res=>{
                    if(res.code == 1){
                        this.list = res.data.data;
                        this.tempList = Util.deepClone(res.data.data);
                        this.total = res.data.count;
                    }
                })
            },
            search(){
                this.page = 1;
                this.getData();
            },
            reset(){
                this.formSearch = formSearch();
                this.search();
            },
            openModal(){
                this.importModal = true;
            },
            cancel(){
                this.importModal = false;
                this.file = null;
            },
            CurrentChange(val){
                this.page = val;
                this.getData();
            },
            SizeChange(val){
                this.pageSize = val;
                this.getData();
            },
            downTemplate(){
                window.location = ('/excel/商品外部信息导入模板.xlsx');
            },
            importData(){
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
                if (res.code == 1) {
                    this.loadingStatus = false;
                    this.file = null;
                    this.$Message.success(res.msg);
                    this.importModal = false;
                    this.search();
                } else {
                    this.loadingStatus = false;
                    this.$Message.error({
                        render: h => {
                            return h('div', {
                                domProps: {
                                   innerHTML: res.msg
                                }
                            })
                        },
                        duration: 10,
                        closable: true
                    });
                }
            },
            uploadError(res, file) {
                this.$Message.error(res.msg);
            },
            importOrderSave() {
                this.loadingStatus = true;
                Vue.prototype.$loading('正在导入数据...');
                this.$refs.upload.post(this.file);
            },
        }
    }
</script>

<style lang="css">
    #good_external_info .ivu-form-item {
        margin-bottom: 5px;
    }
</style>
