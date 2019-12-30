<template>
    <div class="background-color-white exhibition" id="refund-rate">
        <Row class="margin-bottom-10">
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Col>
                  <Form-item label="品牌：" :label-width='60'>
                        <Select v-model="formSearch.brandId" style="width:150px">
                            <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                            </Option>
                        </Select>
                 </Form-item>
                 <Form-item label="平台:" :label-width="100" prop="platfromCode">
                            <Select  v-model="formSearch.platfromCode" @on-change="platformChange"
                                size="small" style="width:180px">
                                <Option v-for="item in platformList" :value="item.PLATFROM_ID" :key="item.PLATFROM_ID">{{
                                    item.PLATFROM_NAME }}
                                </Option>
                            </Select>
                        </Form-item>

                   <Form-item label="年月:" :label-width="70">
                        <DatePicker type="month" v-model="formSearch.yearMonth" placeholder="请选择年月"
                                    style="width: 200px"></DatePicker>
                    </Form-item>

                      <Form-item :label-width="10">
                    <Button type="primary" icon="ios-search" size="small" @click="search">查询</Button>
                    <Button type="warning" size="small" @click="reset">重置</Button>
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
            <Col>
            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer
                  show-total show-elevator
                  @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
            </Col>
        </Row>

        <div class="modal">
            <Modal 
                v-model="modal_visible" 
                :mask-closable="false" 
                :title="modal_title" 
                :width="400"
                :transfer="true"
                class-name="customize-modal-center"
            >   
                <Form :model="ModalForm" :label-width="100" ref="submit_data" :mask-closable="false" :rules="ruleValidate" inline label-position="right" >
                    <Row>
                        
                        <Col>
                            <Form-item label="销售渠道：" prop="platfromCode">
                                <Select :disabled='modal_title != "新增退货率"' v-model="ModalForm.platfromId" @on-change='changePlatfrom' style="width:150px" size="small">
                                    <Option v-for="item in platformList" :value="item.PLATFROM_ID" :key="item.PLATFROM_ID">{{ item.PLATFROM_NAME }}
                                    </Option>
                                </Select>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="品牌：" prop="brandId">
                                <Select :disabled='modal_title != "新增退货率"'  v-model.number="ModalForm.brandId" style="width:150px" size="small" @on-change='changeBrand'>
                                    <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                                    </Option>
                                </Select>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="年份：" prop="years" >
                                <Input :disabled='modal_title != "新增退货率"'  size="small"  style="width:150px" v-model="ModalForm.years" ></Input>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="月份：" prop="month" >
                                <Input :disabled='modal_title != "新增退货率"'  size="small"  style="width:150px" v-model="ModalForm.month" ></Input>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="退货率：" prop="refundRate">
                                <Input v-model.number="ModalForm.refundRate" size="small"  placeholder="请输入退货率" style="width:150px"></Input>
                            </Form-item>
                        </Col>
                    </Row>
                </Form>
                <div slot="footer">
                    <Button type="default" @click="cancel">取消</Button>
                    <Button type="primary" @click="submit">确定</Button>
                </div>
            </Modal>
          <Modal
                v-model="importModal"
                title="导入退货率">
                <div>
                    <Upload
                        ref="upload"
                        name="file"
                        :show-upload-list="false"
                        :before-upload="handleUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        type="drag"
                        action="/eop/eom/import_refund_date"
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
                    <Button type="default" @click="cancel('import')">取消</Button>
                    <Button type="primary" @click="importOrderSave">导入</Button>
                </div>
            </Modal>
            </div>
    </div>
</template>

<script>
    import Util from 'libs/util';
    function ModalForm(){
        return {
            brandId:'', 	        //  品牌id	        number	
            brandName:'',           //	品牌名称	    string	
            createUser:'',          //	创建人	        string	当前用户账号
            years:'',               //年份
            month:'',               //	月份	        string	格式：mm
            platfromId:'',        //	销售渠道代码	 string	1：天猫，2：唯品会
            platfromName:'',        //	渠道名称	    string	
            remark:'',              //	备注	        string
            refundRate:'',        //  快递费
        }
    }
    export default {
        name: 'refund_rate',
        desc: '退货率',
        data() {
            return {
                formSearch: {

                },
                brandList: [],
                importModal: false,
                loadingStatus: false,
                loading: false, //表格数据加载开关
                ModalForm:ModalForm(),
                columns: [{
                    title: '序号',
                    key: 'serialNo',
                    align: 'center',
                    width: 60
                }, {
                    title: '渠道',
                    key: 'platfromName',
                    align: 'center',
                    width: 150
                },{
                    title: '品牌',
                    key: 'brandName',
                    align: 'center',
                    width: 150
                },{
                    title: '年份',
                    key: 'years',
                    align: 'center',
                    width: 100
                },{
                    title: '月份',
                    key: 'month',
                    align: 'center',
                    width: 100
                },{
                    title: '退货率(%)',
                    key: 'refundRate',
                    align: 'center',
                    width: 100
                },
                {
                    title:'创建人',
                    key:'createUser',
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
                    key:'lastUpdateUser',
                    align: 'center',
                    width: 100
                },
                  {
                    title:'最后更新时间',
                    key:'lastUpdated',
                    align: 'center',
                    width: 150
                },{
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        minWidth: 150,
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
                                            this.openModal('编辑退货率',params.row);
                                        }
                                    }
                                }, '编辑')
                            ]);
                        }
                    }
                ],
                list: [],
                platformList: [],
                userInfo:{},
                file: null,
                page: 1,
                pageSize: 10,
                total: 0,
            }
        },
        computed: {

        },
        mounted() {
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));        
            this.getBrandList()
            this.getPlatformList()
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
            getPlatformList() {
                this.request('get_platform_list', {}, false).then((res) => {
                    if (res.code == '1') {
                        this.platformList = res.data
                    }
                })
            },
            reset() {
                this.formSearch = {}
                this.search();
            },
            openModal(type,row){
                this.modal_visible = true;
                this.modal_title = type;
                if(type == '编辑退货率'){
                    this.ModalForm = Util.deepClone(row);
                }else{
                    this.ModalForm = ModalForm();
                }
                
            },
            cancel(type){
                if(type == 'import'){
                    this.importModal = false;
                    this.file = null;
                }else{
                    this.modal_visible = false;
                    this.$refs['submit_data'].resetFields();
                }
            },
            downTemplate() {
                window.location = ('/excel/退货率导入模板.xlsx');
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
                data.length = this.pageSize;
                data.start = (this.page - 1) * this.pageSize;
                if (data.yearMonth) {
                    data.year = new Date(data.yearMonth).getFullYear();
                    data.month = new Date(data.yearMonth).getMonth() + 1;
                }
                delete data.yearMonth;
                this.request('get_refund_rate_list', {
                    data: data
                }, true).then((res) => {
                    let serialNoBegain = this.pageSize * (this.page - 1);
                    res.data.refundRateList.map(x => {
                        serialNoBegain++;
                        x.serialNo = serialNoBegain;
                    })
                    this.total = res.data.count;
                    this.list = res.data.refundRateList
                    console.log(res)
                })
            },
            SizeChange(val) {
                this.pageSize = val;
                this.getData();
            },
            CurrentChange(val) {
                this.page = val;
                this.getData();
            },
            submit(){
                let data = Util.deepClone(this.ModalForm);
                let url = '';
                if(this.modal_title == '新增退货率'){
                    data.createUser = this.userInfo.userAccount;
                    url = 'add_refund_rate';
                }else if(this.modal_title == '编辑退货率'){
                    url='edit_refund_rate';
                    data.lastUpdateUser = this.userInfo.userAccount;
                    delete data.serialNo;
                    delete data._index;
                    delete data._rowKey;
                }
                this.$refs["submit_data"].validate((valid) => {
                    if (valid) {
                        this.request(url,{
                            data:data
                        },true).then(res=>{
                            if(res.code == 1){
                                this.$Message.success(res.msg);
                                this.modal_visible = false;
                                this.$refs['submit_data'].resetFields();                                                                
                                this.search();
                            }
                        })
                    } else {
                        this.$Notice.warning({
                            title: '提示',
                            desc: '请核对表单信息!'
                        });
                        return false;
                    }
                })
                
            },
        }
    }
</script>

<style lang="css">
  
</style>
