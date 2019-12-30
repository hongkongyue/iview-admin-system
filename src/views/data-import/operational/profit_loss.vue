<template>
    <div class="background-color-white exhibition" id="profit_loss">
        <Row class="margin-bottom-10">
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Col>
                    <Form-item label="品牌：" :label-width='60'>
                        <Select v-model="formSearch.brandId" style="width:150px">
                            <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="日期：" :label-width="80">
                        <DatePicker
                                type="datetime"
                                format="yyyy-MM-dd"
                                placeholder="开始日期"
                                style="width: 170px"
                                v-model="formSearch.startDate"
                        >
                        </DatePicker>
                    </Form-item>
                    <span style="display: inline-block;line-height: 32px;height:32px;margin-right: 10px">
                        至
                    </span>
                    <Form-item label="" :label-width="1">
                        <DatePicker
                                type="datetime"
                                placeholder="结束日期"
                                format="yyyy-MM-dd"
                                style="width: 170px"
                                v-model="formSearch.endDate"
                        >
                        </DatePicker>
                    </Form-item>
                    <Form-item :label-width="10">
                        <Button type="primary" icon="ios-search" @click="search">查询</Button>
                        <Button type="warning" @click="reset">重置</Button>
                    </Form-item>
                </Col>
            </Form>
        </Row>
        <Row>
            <div v-if='activeTable == "TM"'>
                <Button type="primary" @click="openModal">新增</Button>
                <Button type="primary" @click="downTemplate">下载模板</Button>
                <Button type="primary" @click="importData('tm')">导入</Button>
                <Button type="primary" @click="exportData">导出</Button>   
            </div>
            <div v-else>
                <Dropdown @on-click='click_down_vip_template'>
                    <Button type="primary">
                        下载模板
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name='cost'>唯品会成本收入</DropdownItem>
                        <DropdownItem name='vipAdFee'>唯品会广告费</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown @on-click='click_down_vip_template'>
                    <Button type="primary">
                        导入
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name='import_cost'>唯品会成本收入</DropdownItem>
                        <DropdownItem name='import_vipAdFee'>唯品会广告费</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button type="primary" @click="vipForecastParameter">唯品会参数维护</Button>
                <Button type="primary" @click="exportData">导出</Button>
            </div>
        </Row>
        <Row class="margin-top-10">
            <Tabs type="card" @on-click="tabClick" :value="activeTable">
                <TabPane label="天猫" name="TM">
                    <Col class="margin-bottom-10">
                        <Table :columns="TM_columns" size="small" :data="TM_List"></Table>
                    </Col>
                    <Col>
                        <Page :page-size-opts="[16,32,48,64]" :total="TM_total" :page-size="TM_pageSize" :current="TM_page"  show-sizer show-total show-elevator @on-change="TM_CurrentChange" @on-page-size-change="TM_SizeChange"></Page>
                    </Col>
                </TabPane>
                <TabPane label="唯品会" name="VIP">
                <Row>
                    <Col class="margin-bottom-10">
                        <Table :columns="VIP_columns" size="small" :data="VIP_List"></Table>
                    </Col>
                    <Col>
                        <Page :page-size-opts="[16,32,48,64]" :total="VIP_total" :page-size="VIP_pageSize" :current="VIP_page"  show-sizer show-total show-elevator @on-change="VIP_CurrentChange" @on-page-size-change="VIP_SizeChange"></Page>
                    </Col>
                </Row>
                </TabPane>
            </Tabs>
        </Row>
        <div class="modal">
            <Modal 
                v-model="modal_visible" 
                :mask-closable="false" 
                title="损益新增" 
                :width="550"
                :transfer="true"
                class-name="customize-modal-center"
            >   
                <Form :model="addForm" :label-width="88" ref="submit_data" :mask-closable="false" :rules="ruleValidate" inline label-position="right" >
                    <Row style="margin-bottom:20px">
                        <Col span="12">
                            <Form-item label="时间：" :label-width="60" class="margin-bottom-10" prop='dateTime'>
                                <DatePicker
                                    type="datetime"
                                    placeholder="请选择时间"
                                    format="yyyy-MM-dd"
                                    style="width: 150px"
                                    v-model="addForm.dateTime"
                                >
                                </DatePicker>
                            </Form-item>
                        </Col>
                        <Col span="12">
                            <Form-item label="品牌：" :label-width="60"  class="margin-bottom-10" prop='brandId'>
                                <Select v-model="addForm.brandId" style="width:150px" @on-change='changeBrand'>
                                    <Option v-for="item in modalBrandList" :value="item.id" :key="item.id">{{ item.brands }}
                                    </Option>
                                </Select>
                            </Form-item>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:20px" v-if="activeTable == 'TM'">
                        <Col>
                            <i-col span="24" style="border-left:5px solid grey" class="margin-bottom-10">
                                <span style="font-weight:bold;font-size:14px;margin-left:10px;" class="card-form-title">天猫变动费用</span>
                            </i-col>
                        </Col>
                        <!-- <Col span="12">
                            <Form-item label="销售佣金/元：" :label-width="130"  prop="salesCommission">
                                <Input v-model="addForm.salesCommission" placeholder="请输入销售佣金/元"></Input>
                            </Form-item>
                        </Col>
                        <Col span="12">
                            <Form-item label="保险理赔/元：" :label-width="100" prop="insurance">
                                <Input v-model="addForm.insurance" placeholder="请输入保险理赔/元"></Input>
                            </Form-item>
                        </Col> -->
                        <Col span="12">
                            <Form-item label="广告费/元：" :label-width="90" prop="tmAdFee">
                                <Input v-model="addForm.tmAdFee" placeholder="请输入广告费/元"></Input>
                            </Form-item>
                        </Col>
                    </Row>
                    <Row v-if='activeTable == "VIP"'>
                        <Col>
                            <i-col span="24" style="border-left:5px solid grey">
                                <span style="font-weight:bold;font-size:14px;margin-left:10px;" class="card-form-title">唯品会变动费用</span>
                            </i-col>
                        </Col>
                        <Col span="12">
                            <Form-item label="销售收入(不含税)：" :label-width="130" prop="salesIncome">
                                <Input v-model="addForm.salesIncome" placeholder="请输入销售收入"></Input>
                            </Form-item>
                        </Col>
                        <Col span="12">
                            <Form-item label="销售成本：" :label-width="100" prop="salesCost">
                                <Input v-model="addForm.salesCost" placeholder="请输入销售成本"></Input>
                            </Form-item>
                        </Col>
                        <Col span="12">
                            <Form-item label="广告费：" :label-width="130" prop="vipAdFee">
                                <Input v-model="addForm.vipAdFee" placeholder="请输入广告费"></Input>
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
                :title="upload_modal_title">
                <div>
                    <Upload
                        ref="upload"
                        name="file"
                        :show-upload-list="false"
                        :before-upload="handleUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        type="drag"
                        :action="upload_url"
                        :data="{account:userInfo.userAccount,userId:userInfo.userId,platform:activeTable}"
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
    import {mapState} from 'vuex';
    import Util from 'libs/util';

    function formSearch(){
        return {
            brandId:0,                 //  品牌id
            endDate:'',                 //	结束日期
            startDate:''                //  开始日期
        }
    }

    function addForm(){
        return {
            brandId:'',         //	品牌id	    number	
            brandName:'',       //	品牌名称	string	
            createUser:'',      //	创建人	    string	当前用户账号
            dateTime:'',        //	日期	    string	格式：yyyy-mm-dd
            // insurance:'',       //	保险理赔	number	
            remark:'',          //	备注	    string	
            // salesCommission:'', //	销售佣金	number	
            salesCost:'',       //	销售成本	number	
            salesIncome:'',     //	销售收入	number	
            tmAdFee:'',         //	天猫广告费	number	
            vipAdFee:'',        //	唯品会广告费
        }
    }

    export default {
        name:'profit_loss',
        data(){
            const validatePass = (rule, value, callback) => {
                if (!!value) {
                    var reg = (/^([\d\,\d\.\d])+$/);
                    if(reg.test(value)){
                        let newValue = '';
                        let arr = value.split(',');
                        arr.map(x=>{
                            newValue += x;
                        })
                        if (isNaN(Number(newValue))) {
                            // 对第二个密码框单独验证
                            callback(new Error('请输入数字'));
                        }else{
                            callback();
                        }
                    }else{
                        callback(new Error('输入有误，请重新输入'));
                    }
                    
                }
            };
            return {
                formSearch:formSearch(),
                addForm:addForm(),
                activeTable:'TM',
                TM_total:100,
                TM_pageSize:16,
                TM_page:1,
                VIP_total:0,
                VIP_pageSize:16,
                VIP_page:1,
                TM_List:[],
                TM_columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '日期',
                        key: 'dateTime',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => {
                            if ((this.TM_page - 1) * this.TM_pageSize + params.index == this.tm_table_row_index) {
                                return h('DatePicker', {
                                    props: {
                                        value: this.TM_List[params.index].dateTime,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-change': (event) => {
                                            this.TM_List[params.index].dateTime = Util.dateFormat(event,'yyyy-MM-dd');
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.dateTime)
                            }
                        }
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '天猫端广告费',
                        key: 'tmAdFee',
                        align: 'center',
                        minWidth: 180,
                        render: (h, params) => {
                            if ((this.TM_page - 1) * this.TM_pageSize + params.index == this.tm_table_row_index) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.TM_List[params.index].tmAdFee,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.TM_List[params.index].tmAdFee = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.tmAdFee)
                            }
                        }
                    },
                    {
                        title: '维护人',
                        key: 'createUser',
                        align: 'center',
                        minWidth: 150
                    },{
                        title: '维护日期',
                        key: 'created',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        minWidth: 200,
                        render: (h, params) => {
                            if(params.row.serialNo == '合计'){
                                return h('div','');    
                            }
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
                                            this.tm_table_row_index = (this.TM_page - 1) * this.TM_pageSize + params.index;
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
                                            let data = Util.deepClone(params.row);
                                            data.lastUpdateUser = this.userInfo.userName;
                                            delete data.serialNo;
                                            delete data._index;
                                            delete data._rowKey;
                                            this.request('edit_profit_loss_ad_tm',{
                                                data:data
                                            },true).then(res=>{
                                                if(res.code == 1){
                                                    this.$Message.success(res.msg);
                                                    this.tm_table_row_index = -1;
                                                    let Data = {};
                                                    Data.start = (this.TM_page - 1) * this.TM_pageSize;
                                                    Data.length = this.TM_pageSize;
                                                    Data = Object.assign(Data,this.formSearch);
                                                    this.getTMData(Data);
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
                                                    this.request('delete_profit_loss_tm',{
                                                        data:{
                                                            id:params.row.id,
                                                            lastUpdateUser:this.userInfo.userAccount
                                                        }
                                                    },true).then(res=>{
                                                        if(res.code == 1){
                                                            this.$Message.success(res.msg);
                                                            let Data = {};
                                                            Data.start = (this.TM_page - 1) * this.TM_pageSize;
                                                            Data.length = this.TM_pageSize;
                                                            Data = Object.assign(Data,this.formSearch);
                                                            this.getTMData(Data);
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
                VIP_List:[],
                VIP_columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        width: 60
                    },
                    {
                        title: '日期',
                        key: 'dateTime',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => {
                            if ((this.VIP_page - 1) * this.VIP_pageSize + params.index == this.vip_table_row_index) {
                                return h('DatePicker', {
                                    props: {
                                        value: this.VIP_List[params.index].dateTime,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-change': (event) => {
                                            this.VIP_List[params.index].dateTime = Util.dateFormat(event,'yyyy-MM-dd');
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.dateTime)
                            }
                        }
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '销售收入(不含税)',
                        key: 'salesIncome',
                        align: 'center',
                        minWidth: 150,
                    },
                    {
                        title: '调整销售收入',
                        key: 'adjustSalesIncome',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => {
                            if ((this.VIP_page - 1) * this.VIP_pageSize + params.index == this.vip_table_row_index) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.VIP_List[params.index].adjustSalesIncome,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.VIP_List[params.index].adjustSalesIncome = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.adjustSalesIncome)
                            }
                        }
                    },
                    {
                        title: '销售成本',
                        key: 'salesCost',
                        align: 'center',
                        minWidth: 150,
                    },
                    {
                        title: '调整销售成本',
                        key: 'adjustSalesCost',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => {
                            if ((this.VIP_page - 1) * this.VIP_pageSize + params.index == this.vip_table_row_index) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.VIP_List[params.index].adjustSalesCost,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.VIP_List[params.index].adjustSalesCost = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.adjustSalesCost)
                            }
                        }
                    },
                    {
                        title: '毛利率',
                        key: 'grossRate',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '广告费',
                        key: 'vipAdFee',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => {
                            if ((this.VIP_page - 1) * this.VIP_pageSize + params.index == this.vip_table_row_index) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.VIP_List[params.index].vipAdFee,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.VIP_List[params.index].vipAdFee = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.vipAdFee)
                            }
                        }
                    },
                    {
                        title: '研发费用',
                        key: 'researchFee',
                        align: 'center',
                        minWidth: 180
                    },
                    {
                        title: '维护人',
                        key: 'createUser',
                        align: 'center',
                        minWidth: 150
                    },{
                        title: '维护日期',
                        key: 'created',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        minWidth: 200,
                        render: (h, params) => {
                            if(params.row.serialNo == '合计'){
                                return h('div','');    
                            }
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
                                            this.vip_table_row_index = (this.VIP_page - 1) * this.VIP_pageSize + params.index
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
                                            let data = Util.deepClone(params.row);
                                            data.lastUpdateUser = this.userInfo.userName;
                                            delete data.serialNo;
                                            delete data._index;
                                            delete data._rowKey;
                                            delete data.grossRate;
                                            this.request('edit_profit_loss_vip',{
                                                data:data
                                            },true).then(res=>{
                                                if(res.code == 1){
                                                    this.vip_table_row_index = -1;
                                                    this.$Message.success(res.msg);
                                                    let Data = {};
                                                    Data.start = (this.VIP_page - 1) * this.VIP_pageSize;
                                                    Data.length = this.VIP_pageSize;
                                                    Data = Object.assign(Data,this.formSearch);
                                                    this.getVIPData(Data);
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
                                                    this.request('delete_profit_loss_vip',{
                                                        data:{
                                                            id:params.row.id,
                                                            lastUpdateUser:this.userInfo.userAccount
                                                        }
                                                    },true).then(res=>{
                                                        if(res.code == 1){
                                                            this.$Message.success(res.msg);
                                                            let Data = {};
                                                            Data.start = (this.VIP_page - 1) * this.VIP_pageSize;
                                                            Data.length = this.VIP_pageSize;
                                                            Data = Object.assign(Data,this.formSearch);
                                                            this.getVIPData(Data);
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
                modal_visible:false,
                ruleValidate: {
                    dateTime: [
                        { required: true, type:'date', message: '请选择日期', trigger: 'change' }
                    ],
                    brandId: [
                        { required: true, type:'number', message: '请选择品牌', trigger: 'change' }
                    ],
                    // salesCommission: [
                    //     { required: true, message: '请输入销售佣金', trigger: 'blur' },
                    //     { validator: validatePass, trigger: 'blur' }
                    // ],
                    // insurance: [
                    //     { required: true, message: '请输入保险理赔', trigger: 'blur' },
                    //     { validator: validatePass, trigger: 'blur' }
                    // ],
                    tmAdFee: [
                        { required: true, message: '请输入广告费', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    salesIncome: [
                        { required: true, message: '请输入销售收入', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    salesCost: [
                        { required: true, message: '请输入销售成本', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    vipAdFee: [
                        { required: true, message: '请输入广告费', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ]
                },
                brandList:[],
                modalBrandList:[],
                tm_table_row_index:-1,
                vip_table_row_index:-1,
                userInfo:{},
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6 - 1000 * 60 * 60 * 24
                    }
                },
                importModal:false,
                file:{},
                upload_url:'',
                upload_modal_title:''
            }
        },
        computed:{
            
        },
        mounted(){
            this.getBrandList();
            var formSearch = Util.deepClone(this.formSearch);         
            let Data = {};
            Data.start = (this.TM_page - 1) * this.TM_pageSize;
            Data.length = this.TM_pageSize;
            Data = Object.assign(Data,formSearch);
            this.getTMData(Data);
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
        },
        methods:{
            setFormData(val){
                var formSearch = Util.deepClone(this.formSearch);
                let Data = {};      
                if(val == 'TM'){
                    Data.length = this.TM_pageSize;
                    Data = Object.assign(Data,formSearch);
                }else{
                    Data.length = this.VIP_pageSize;
                    Data = Object.assign(Data,formSearch);
                }
                return Data
            },
            search(){
                let Data = this.setFormData(this.activeTable);
                if(this.activeTable == 'TM'){
                    this.TM_page = 1;
                    Data.start = 0;
                    this.getTMData(Data);
                }else{
                    this.VIP_page = 1;
                    Data.start = 0;
                    this.getVIPData(Data);
                }
            },
            reset(){
                this.formSearch = formSearch();
                this.page = 1;
                if(this.activeTable == 'TM'){
                    let Data = {};
                    Data.start = 0;
                    Data.length = this.TM_pageSize;
                    Data = Object.assign(Data,this.formSearch);
                    this.getTMData(Data);
                }else{
                    let Data = {};
                    Data.start = 0;
                    Data.length = this.VIP_pageSize;
                    Data = Object.assign(Data,this.formSearch);
                    this.getVIPData(Data);
                }
            },
            getTMData(data){
                if(data.startDate){
                    data.startDate = Util.dateFormat(data.startDate,'yyyy-MM-dd');
                }
                if(data.endDate){
                    data.endDate = Util.dateFormat(data.endDate,'yyyy-MM-dd');
                }
                if(this.formSearch.startDate > this.formSearch.endDate){
                    this.$Message.warning('日期选择有误，请重新选择！');
                    return false;
                }
                data.brandId == 0 ? data.brandId = '' : data.brandId = data.brandId;        
                
                this.request('get_profit_loss_tm',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        let serialNoBegain = this.TM_pageSize * (this.TM_page - 1);
                        res.data.profitLossTMList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.TM_total = res.data.count;
                        this.TM_List = res.data.profitLossTMList;
                        let lastPage = Math.ceil(this.TM_total / this.TM_pageSize);

                        if(this.TM_page == lastPage){
                            let profitLossTMTotal = res.data.profitLossTMTotal;
                            profitLossTMTotal.serialNo = '合计';
                            this.TM_List.push(profitLossTMTotal);
                        }
                    }
                })
            },
            getVIPData(data){
                if(data.startDate){
                    data.startDate = Util.dateFormat(data.startDate,'yyyy-MM-dd');
                }
                if(data.endDate){
                    data.endDate = Util.dateFormat(data.endDate,'yyyy-MM-dd');
                }
                if(this.formSearch.startDate > this.formSearch.endDate){
                    this.$Message.warning('日期选择有误，请重新选择！');
                    return false;
                }
                data.brandId == 0 ? data.brandId = '' : data.brandId = data.brandId;        
                
                this.request('get_profit_loss_vip',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        let serialNoBegain = this.VIP_pageSize * (this.VIP_page - 1);
                        res.data.profitLossVIPList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                            item.grossRate = Number(item.grossRate * 100).toFixed(2) + '%'
                        })
                        this.VIP_total = res.data.count;
                        this.VIP_List = res.data.profitLossVIPList;
                        let lastPage = Math.ceil(this.VIP_total / this.VIP_pageSize);

                        if(this.VIP_page == lastPage){
                            let biProfitLossVIPTotal = res.data.biProfitLossVIPTotal;
                            biProfitLossVIPTotal.serialNo = '合计';
                            this.VIP_List.push(biProfitLossVIPTotal);
                        }
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
                    this.brandList = this.brandList.filter(x=>{
                        return x.id != '51594' && x.id != '51609'
                    })
                    this.modalBrandList = Util.deepClone(this.brandList);
                    this.brandList.unshift({
                        id:0,
                        brands:'所有品牌'
                    })
                })
            },
            
            openModal(){
                this.modal_visible = true;
                this.addForm = addForm();                
            },
            changeBrand(val){
                if(
                    this.activeTable == 'TM' && 
                    (val == '51606' || val == '51605' || val == '51602' == val =='51600')
                ){
                    this.$Message.warning('该品牌无天猫变动费用，请重新选择品牌！');
                    this.addForm.brandId = '';
                    this.addForm.brandName = '';
                    return;
                }
                this.brandList.map(x=>{
                    if(x.id == val){
                        this.addForm.brandName = x.brands;
                    }
                })
            },
            cancel(){
                this.modal_visible = false;
                this.importModal = false;
                this.file = null;
                this.$refs['submit_data'].resetFields();
            },
            submit(){
                let data = Util.deepClone(this.addForm);
                data.createUser = this.userInfo.userName;
                data.dateTime = Util.dateFormat(this.addForm.dateTime,'yyyy-MM-dd');
                this.$refs["submit_data"].validate((valid) => {
                    if (valid) {
                        for(let x in data){
                            if(x == 'createUser' || x == 'brandId' || x == 'brandName' || x == 'dateTime' || x == 'remark'){
                                continue;
                            }else{
                                data[x] = data[x].replace(/[^0-9/.]/g, "");
                            }
                        }
                        let url = '';
                        if(this.activeTable == 'TM'){
                            url = 'add_profit_loss_ad_tm';
                            delete data.salesIncome;
                            delete data.salesCost;
                            delete data.vipAdFee;
                        }else{
                            url = 'add_profit_loss_vip'
                            delete data.salesCommission;
                            delete data.insurance;
                            delete data.tmAdFee;
                        }
                        this.request(url,{
                            data:data
                        },true).then(res=>{
                            if(res.code == 1){
                                this.$Message.success(res.msg);
                                this.modal_visible = false;
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
            tabClick(val){
                this.activeTable = val;
                let Data = this.setFormData(val);
                if(this.activeTable == 'TM'){
                    Data.start = (this.TM_page - 1) * this.TM_pageSize;
                    this.getTMData(Data);
                }else{
                    Data.start = (this.VIP_page - 1) * this.VIP_pageSize;                    
                    this.getVIPData(Data);
                }
            },
            downTemplate(type){
                if(this.activeTable == 'TM'){
                    window.location = ('/excel/损益维护天猫导入模板.xlsx');
                }
            },
            importData(type){
                switch(type){
                    case 'tm':
                        this.upload_url = '/eop-node/api/analysis/importProfitLossData';
                        this.upload_modal_title = '天猫损益批量导入';
                        break;
                    // case 'vip_income':
                    //     this.upload_url = '/eop-node/api/analysis/import_profitloss_vip_income';
                    //     this.upload_modal_title = '唯品会收入批量导入';
                    //     break;
                    case 'vip_cost':
                        this.upload_url = '/eop/bi/import_profit_vip_cost';
                        this.upload_modal_title = '唯品会成本收入批量导入';
                        break;
                    case 'vipAdFee':
                        this.upload_url = '/eop-node/api/analysis/import_profit_vipAdFee';
                        this.upload_modal_title = '唯品会广告费批量导入';
                        break;
                    default:
                        break;
                }
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
                this.$Message.error(res.msg);
            },
            importOrderSave() {
                this.loadingStatus = true;
                Vue.prototype.$loading('正在导入数据...');
                this.$refs.upload.post(this.file);
            },
            exportData(){
                if(!this.formSearch.startDate){
                    this.$Message.warning('请选择起始时间');
                }else if(!this.formSearch.endDate){
                    this.$Message.warning('请选择结束时间');
                }else{
                    console.log('0000000000000000000')
                    this.request('exportProfitLossData',{
                        startDate:Util.dateFormat(this.formSearch.startDate,'yyyy-MM-dd'),
                        endDate:Util.dateFormat(this.formSearch.endDate,'yyyy-MM-dd'),
                        platform:this.activeTable,
                        brandId:this.formSearch.brandId
                    }).then(res=>{
                        if(res.status=='success'){
                            this.$Message.success(res.message);
                            if(document.location.href.indexOf('localhost')>0||document.location.href.indexOf('127.0.0.1')>0){
                                window.open('http://127.0.0.1:8360'+res.data)
                            }else{
                                window.open(res.data)
                            }
                        }
                    })
                }
            },
            click_down_vip_template(val){
                switch(val){
                    case 'cost':
                        window.location = ('/excel/唯品会导入模板.xlsx');
                        break;
                    case 'vipAdFee':
                        window.location = ('/excel/唯品会广告费导入模板.xlsx');
                        break;
                    case 'import_cost':
                        this.importData('vip_cost');
                        break;
                    case 'import_vipAdFee':
                        this.importData('vipAdFee')
                        break;
                    default:
                        break;
                }
            },
            TM_CurrentChange(val){
                this.TM_page = val;
                let Data = this.setFormData(this.activeTable);
                Data.start = (this.TM_page - 1) * this.TM_pageSize;
                this.getTMData(Data);
            },
            TM_SizeChange(val){
                this.TM_pageSize = val;
                let Data = this.setFormData(this.activeTable);
                Data.start = (this.TM_page - 1) * this.TM_pageSize;
                this.getTMData(Data);
            },
            VIP_CurrentChange(val){
                this.VIP_page = val;
                let Data = this.setFormData(this.activeTable);
                Data.start = (this.VIP_page - 1) * this.VIP_pageSize;
                this.getVIPData(Data);
            },
            VIP_SizeChange(val){
                this.VIP_pageSize = val;
                let Data = this.setFormData(this.activeTable);
                Data.start = (this.VIP_page - 1) * this.VIP_pageSize;
                this.getVIPData(Data);
            },
            /**
             * 打开唯品会参数维护页面
             */
            vipForecastParameter(){
                this.$router.push({
                    name: 'vip_forecast_parameter',
                    params: {

                    }
                });
            }
        }
    }
</script>

<style lang="css">
    #profit_loss .ivu-form-item{
        margin-bottom:0;
    }
    #profit_loss .ivu-form-item-error-tip{
        display: none;
    }
    #profit_loss .ivu-tabs{
        padding-bottom: 200px;
    }
    #profit_loss .downTemplate{
        display: inline-block;

    }
</style>
