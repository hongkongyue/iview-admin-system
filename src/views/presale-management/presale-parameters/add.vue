<style lang="less">
   
</style>

<template>
<div class="background-color-white exhibition">
    <Form :model="addFormData" ref="addFormData" :show-message="false" :label-width="90" :rules="ruleValidate" inline label-position="right">
        <Row>
            <Col span="24" class="search margin-bottom-10">
            <Row>
                <Col span="6">
                <Form-item label="品牌：" :label-width='80' prop="brand_id">
                    <Select :disabled="!id==''" v-model="addFormData.brand_id" style="width:150px">
                        <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                        </Option>
                    </Select>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="安全库存：" prop="safe_stock">
                    <InputNumber v-model="addFormData.safe_stock" :min="0"  placeholder="请输入安全库存" style="width:150px"></InputNumber>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="安全天数：" prop="safe_day">
                    <InputNumber v-model="addFormData.safe_day" :min="0"  placeholder="请输入安全天数" style="width:150px"></InputNumber>
                </Form-item>
                </Col>
            </Row>
            <Row>
                <Col span="6">
                <Form-item label="全品预售：" :label-width='80'>
                    <Select v-model="addFormData.is_all_presale" style="width:150px">
                        <Option v-for="item in allPresaleList" :value="item.value" :key="item.value">{{ item.name }}
                        </Option>
                    </Select>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="预售百分比：" prop="presale_percent">
                    <InputNumber v-model="addFormData.presale_percent" :max="100" :min="1"  placeholder="请输入预售百分比" style="width:150px"></InputNumber>
                    <span style="margin-left:5px;color:red">%</span>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="店铺：" prop="shop_id">
                    <Select :filterable=true v-model="addFormData.shop_id" style="width:200px">
                        <Option v-for="item in shopList" :value="item.shop_id" :key="item.shop_id">{{ item.shop_name }}
                        </Option>
                    </Select>
                </Form-item>
                </Col>
            </Row>
            </Col>
        </Row>　
        <Button   type="primary" size="small" @click="addGoods">
            <Icon type="md-add"></Icon>&nbsp;添加商品
        </Button>
        <Button v-if="id" type="primary" size="small" @click="openImportDialog">
            <Icon type="md-search"></Icon>&nbsp;选择商品
        </Button>
        勾选可批量编辑 <Checkbox v-model="batchEdit.safe_stock" @on-change="batchEditChange">安全库存</Checkbox>
        <Checkbox v-model="batchEdit.safe_day" @on-change="batchEditChange">安全天数</Checkbox>
           <Checkbox v-model="batchEdit.presale_percent" @on-change="batchEditChange">预售百分比</Checkbox>
        <!-- <Button  v-if="id" type="primary" size="small" @click="downTemplate">
            <Icon type="arrow-down-c"></Icon>&nbsp;下载模板
        </Button> -->
        </Row>
    </Form>

    <Row class="margin-top-10">
        <Table  ref="detailTable" size="small" :columns="columns" :data="list"></Table>
    </Row>

    <Row class-name="margin-top-10" type="flex" justify="center" class="code-row-bg">
        <Button type="primary" @click="save">保存</Button>
        <Button type="default" @click="cancel">取消</Button>
    </Row>
        <Modal
        title="选择商品"
        :width=950
        v-model="goodsModel"
        :mask-closable="false">
         <div>
             <goods_chose ref='goods_chose' :brand_id="addFormData.brand_id"></goods_chose>
         </div>
         <div slot="footer">
            <Button type="default" @click="closeModel">取消</Button>
            <Button type="primary" @click="saveGoods">确定</Button>
        </div>
   　　　</Modal>
</div>
</template>

<script>
import Util from '@/libs/util.js';
import goods_chose from '@/views/system/goods/goods.vue';
export default {
    name: 'presale_parameters_add',
    desc: '新增预售参数',
    data() {
        return {
            addFormData: {
                brand_id: null,
                safe_stock: null,
                safe_day: null,
                presale_percent: null,
                is_all_presale:1
            },
            loadingStatus:false,
            importModal:false,
            goodsModel:false,
            file:null,
            columns: [
                {
                title: '操作',
                key: 'operate',
                align: 'center',
                width: 100,
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px',
                            },
                            on: {
                                click: () => {
                                    this.removeGoods(params);
                                }
                            }
                        }, '删除')
                    ])
                }
            }, {
                title: '序号',
                type: 'index',
                align: 'center',
                width: 60
            }, {
                title: '款号',
                key: 'goods_no',
                align: 'center',
                width: 120,
                render: (h, params) => {
                    return h('Input', {
                        props: {
                            type: 'text',
                            value: this.list[params.index].goods_no
                        },
                        on: {
                            'on-blur': (event) => {
                                this.list[params.index].goods_no = event.target.value;
                                this.getGoodsInfo(params, event.target.value);
                            }
                        }
                    })
                }
            }, {
                title: '商品名称',
                key: 'goods_name',
                align: 'center',
                width: 200
            }, {
                title: '是否预售',
                key: 'is_presale',
                align: 'center',
                width: 100,
                render: (h, params) => {
                    return h('Select', {
                            props: {
                                value: this.list[params.index].is_presale,
                            },
                            on: {
                                'on-change': (value) => {
                                    this.list[params.index].is_presale = value;
                                }
                            },
                        },
                        this.allPresaleList.map(function (item) {
                            return h('Option', {
                                props: {
                                    value: item.value
                                }
                            }, item.name);
                        })
                    );
                },
            }, {
                title: '安全库存',
                key: 'safe_stock',
                align: 'center',
                width: 100,
                render: (h, params) => {
                    return h('InputNumber', {
                        props: {
                            value: params.row.safe_stock,
                             min:0
                        },
                        on: {
                            'on-change': (value) => {
                                params.row.safe_stock = value
                                params.row._checked = true
                                this.list[params.index] = params.row
                            },
                            'on-blur':()=>{
                                if (this.batchEdit.safe_stock) {
                                    for (let item of this.$refs['detailTable'].getSelection()) {
                                        for (let listItem of this.list) {
                                            if (item.goods_no == listItem.goods_no && item.goods_no != params.row.goods_no) {
                                                listItem.safe_stock = params.row.safe_stock
                                                listItem._checked = true
                                                break
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                }
            }, {
                title: '安全天数',
                key: 'safe_day',
                align: 'center',
                width: 100,
                render: (h, params) => {
                    return h('InputNumber', {
                        props: {
                            value: params.row.safe_day,
                            min:0
                        },
                        on: {
                            'on-change': (value) => {
                                params.row.safe_day = value
                                params.row._checked = true
                                this.list[params.index] = params.row
                            },
                            'on-blur':()=>{
                                if (this.batchEdit.safe_day) {
                                    for (let item of this.$refs['detailTable'].getSelection()) {
                                        for (let listItem of this.list) {
                                            if (item.goods_no == listItem.goods_no && item.goods_no != params.row.goods_no) {
                                                listItem.safe_day = params.row.safe_day
                                                listItem._checked = true
                                                break
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                }
            }, {
                title: '预售百分比(%)',
                key: 'presale_percent',
                align: 'center',
                width: 120,
                render: (h, params) => {
                    return h('InputNumber', {
                        props: {
                            value: params.row.presale_percent,
                            min:1,
                            max:100
                        },
                        on: {
                            'on-change': (value) => {
                                params.row.presale_percent = value
                                params.row._checked = true
                                this.list[params.index] = params.row
                            },
                             'on-blur':()=>{
                                if (this.batchEdit.presale_percent) {
                                    for (let item of this.$refs['detailTable'].getSelection()) {
                                        for (let listItem of this.list) {
                                            if (item.goods_no == listItem.goods_no && item.goods_no != params.row.goods_no) {
                                                listItem.presale_percent = params.row.presale_percent
                                                listItem._checked = true
                                                break
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                }
            }, {
                title: '规格数',
                key: 'sku_num',
                align: 'center',
                width: 100
            }],
            //列表数据
            list: [],
            //总共数据多少条
            total: 0,
            //每页多少条数据
            pageSize: 10,
            //当前页码
            pageNumber: 1,
            //搜索表单
            formSearch: {
                orderId: ''
            },
            brandList: [],
            allPresaleList: [{
                    'name': '是',
                    'value': 1
                },
                {
                    'name': '否',
                    'value': 0
                }
            ],
            shopList: [],
            ruleValidate: {
                brand_id: [{
                    required: true,
                    type: 'number',
                    message: '',
                    trigger: 'blur'
                }],
                safe_stock: [{
                    required: false,
                    type: 'number',
                    message: '',
                    trigger: 'blur'
                }],
                safe_day: [{
                    required: false,
                    type: 'number',
                    message: '',
                    trigger: 'blur'
                }],
                presale_percent: [{
                    required: false,
                    type: 'number',
                    message: '',
                    trigger: 'blur'
                }],
            },
            id: '',
            batchEdit:{
                safe_day:false,
                safe_stock:false,
                presale_percent:false
            }
        };
    },
     components:{
        goods_chose
    },
    methods: {
        getBrandList() {
            return this.request('get_brand_list', {
                ver: '1',
                ts: Date.parse(new Date()),
                sign: '',
                data: {}
            }, false)
        },
        getShopList() {
            return this.request('get_alipay_shopList', {
                platfrom_id: 1
            }, true)
        },
        save() {
            this.ruleValidate.safe_stock[0].required = this.addFormData.is_all_presale==1
            this.ruleValidate.safe_day[0].required = this.addFormData.is_all_presale==1
            this.ruleValidate.presale_percent[0].required = this.addFormData.is_all_presale==1
            let flag = false
            this.$refs['addFormData'].validate((valid) => {
                if (valid) {
                    flag = true;
                } else {
                    this.$Message.error('请核对表单信息!');
                    return;
                }
            })

            if (!flag) {
                return;
            }

            let data = Util.deepClone(this.addFormData)

            if (data.brand_id > 0) {
                for (let item of this.brandList) {
                    if (item.id == data.brand_id) {
                        data.brand_name = item.brands
                        break;
                    }
                }
            }

            if (data.shop_id > 0) {
                for (let item of this.shopList) {
                    if (item.shop_id == data.shop_id) {
                        data.shop_name = item.shop_name
                        break;
                    }
                }
            }

            //校验明细
            if(data.is_all_presale==0&&this.list.length==0){
                this.$Message.warning('全品预售为否时商品信息不能为空');
                return;
            }
            let detailData = Util.deepClone(this.list)
            for(let item of detailData){
                console.log(item)
                if(!item.goods_no||!item.goods_name){
                    this.$Message.warning('明细数据不完整,请检查');
                    flag = false
                    break;
                }
                if(item.is_presale==1){
                   if(item.safe_stock==null||item.safe_day==null||!item.presale_percent){
                       this.$Message.warning('款号:'+item.goods_no+'设置为预售,安全库存、安全天数和预售百分比为必填项,请检查');
                       flag = false
                       break;
                   }
                }
            }
            if (!flag) {
                return;
            }
            data.detail = JSON.stringify(detailData)
            this.request('update_pre_sale_parameter_data', data, '正在保存...').then((res) => {
                if (res.errno == 0) {
                    this.$Message.info(res.data)
                    this.cancel()
                    this.$router.push({
                        name: 'presale_parameters'
                    });
                } else {
                     this.$Message.warning(res.errmsg)
                }
            })
        },
        cancel() {
            if (this.id) {
                this.$root.eventHub.$emit('closePageFromOtherPage', 'presale_parameters_edit'); //关闭编辑页面
            } else {
                this.$root.eventHub.$emit('closePageFromOtherPage', 'presale_parameters_add'); //关闭新增页面
            }
        },
        addGoods() {
            this.list.push({
                serialNo: this.list.length + 1,
                goods_no: '',
                safe_stock: null,
                safe_day: null,
                is_presale: 1,
                goods_name: '',
                presale_percent:null,
                sku_num: 0
            })
        },
        removeGoods(params) {
            let item = params.row
            let index = params.index
            if(item.id){//数据库有记录　需要调用删除接口
             this.$Modal.confirm({
                title: '删除提示',
                content: '确定要删除当前记录？',
                loading: true,
                onOk: () => {
                    this.request('delete_pre_sale_parameter_data', {
                        itemId:item.id
                    }, true).then((res) => {
                        if (res.errno == 0) {
                            this.$Modal.remove();
                            this.$Message.info('删除成功');
                            this.list.splice(index, 1);
                        }
                    })
                }
            });

            }else{
                this.list.splice(index, 1);
            }
        },
        getGoodsInfo(params, value) {
       
            let row = this.list[params.index]
            let goodsNo = value
            if (!goodsNo||row.goods_name) {
                return;
            }
            let flag = true
            //先检查商品是否已存在列表中
            let i=0
            for(let item of this.list){
               if(item.goods_no == goodsNo&&i!=params.index){
                   flag = false
                   break
               }
               i++
            }
            if(!flag){
              this.$Message.warning('款号:'+goodsNo+'已存在列表中,请检查')
              row.goods_no=''
              return
            }
            this.request('get_goods_info', {
                goodsNo: goodsNo,
                brandId:this.addFormData.brand_id
            }, '正在查询商品信息...').then((res) => {
                if (res.errno == 0) {
                     this.$Message.success('查询成功')
                    if (res.data.length > 0) {
                        row.goods_name = res.data[0].goods_name
                        row.sku_num = res.data.length
                    }
                }else{
                    this.$Message.warning(res.errmsg)
                    row.goods_no=''
                }
            })
        },
        getDetail() {
            if (this.id) {
                return this.request('get_pre_sale_parameters_detail', {
                    id: this.$route.params.Id
                }, true)
            } else {
                return Promise.resolve('ok')
            }
        },
        getData() {
            this.id = this.$route.params.Id
            Promise.all([this.getBrandList(), this.getShopList(), this.getDetail()]).then((result) => {
                //品牌
                let res = result[0]
                this.brandList = res.data;
                this.addFormData.brand_id = this.brandList[0].id
                //店铺
                let res2 = result[1]
                this.shopList = res2.data;

                //详情数据
                let res3 = result[2]
                if (res3.errno == 0) {
                    this.addFormData = res3.data
                    this.addFormData.presale_percent = Number(this.addFormData.presale_percent) * 100
                    this.list = res3.data.detail;
                    this.$store.dispatch('presale_parameters_list',this.list);
                }
            })
        },
         downTemplate(){
                window.location = ('/excel/预售参数设置商品导入模板.xlsx')
        },
        openImportDialog(){
            this.goodsModel = true;
            this.$store.dispatch('presale_parameters_list',this.list);
            this.$refs['goods_chose'].getGoodsList();
        },
        cancelImportDialog(){
            this.importModal = false
            this.file=null;
        },
        importData(){
            this.loadingStatus = true
            this.$refs['upload'].post(this.file);
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
                this.loadingStatus = false;
                this.file = null;
                this.$Message.success('导入成功');
                this.importModal = false;
        },
        uploadError(res, file) {
            this.$Message.error(res.msg);
        },
        saveGoods(){
            let goods = this.$refs['goods_chose'].$parent.goods;
            goods.map(x=>{
                x.presale_percent=null,
                x.safe_stock=null,
                x.safe_day=null
            })
            this.list = this.list.concat(goods);
            this.goodsModel = false;
            this.$refs['goods_chose'].$parent.goods = [];
        },
        closeModel(){
            this.goodsModel = false;
            this.$refs['goods_chose'].$parent.goods = [];
        },
        batchEditChange() {
            let haveSelect = false
            this.columns.forEach((col) => {
                if (col.type == 'selection') {
                    haveSelect = true
                }
            })
            if (this.batchEdit.safe_stock || this.batchEdit.safe_day || this.batchEdit.presale_percent) {
                if (!haveSelect) {
                    this.columns.unshift(
                        {
                            type: 'selection',
                            width: 60,
                            align: 'center'
                        }
                    )
                }
            } else {
                if(haveSelect){
                    this.columns.shift()
                }
            }
        }
    },
    mounted() {
        this.getData()
    },
    activated() {
        if (this.id != this.$route.params.Id) {
            this.getData()
        }
    }
};
</script>
