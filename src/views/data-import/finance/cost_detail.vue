<template>
    <div class="background-color-white exhibition" id="cost_detail">
        <Row>
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Col>
                    <Form-item label="时间：" :label-width="50">
                        <DatePicker
                                type="year"
                                placeholder="开始年份"
                                style="width: 120px"
                                v-model="formSearch.startYear"
                                size="small"
                                :options="pickerOptions"
                        >
                        </DatePicker>
                    </Form-item>
                    <span style="display: inline-block;line-height: 32px;height:32px;margin-right: 10px">
                        至
                    </span>
                    <Form-item label="" :label-width="1">
                        <DatePicker
                                type="year"
                                placeholder="结束年份"
                                style="width: 120px"
                                v-model="formSearch.endYear"
                                size="small"
                                :options="pickerOptions"
                        >
                        </DatePicker>
                    </Form-item>
                    <Form-item label='费用类型：' :label-width="80">
                        <Input v-model="formSearch.costType" size="small"  placeholder="请输入费用类型" style="width:150px"></Input>
                    </Form-item>
                    <Form-item label='费用明细：' :label-width="80">
                        <Input v-model="formSearch.costDetail" size="small"  placeholder="请输入费用明细" style="width:150px"></Input>
                    </Form-item>
                    <Form-item :label-width="10">
                        <Button type="primary" icon="ios-search" size="small" @click="search">查询</Button>
                        <Button type="warning" size="small" @click="reset">重置</Button>
                    </Form-item>
                </Col>
                <Col>
                    <Form-item label="品牌：" :label-width='50'>
                        <Select v-model="formSearch.brandId" style="width:270px" size="small">
                            <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="承担平台：" :label-width='80'>
                        <Select v-model="formSearch.platfromCode" style="width:150px" size="small">
                            <Option v-for="item in platfrom_List" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="费用性质：" :label-width='80'>
                        <Select v-model="formSearch.costProperty" style="width:150px" size="small">
                            <Option v-for="item in costProperty_List" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                        </Select>
                    </Form-item>
                </Col>
            </Form>
        </Row>
        <Row class="margin-bottom-10">
            <Button type="primary" @click="downTemplate">下载模板</Button>
            <Button type="primary" @click="openModal">导入</Button>
            <Button type="primary" @click="exportData">导出</Button>
            <Button type="primary" @click="edit">编辑</Button>
            <Button type="primary" @click="save">保存</Button>            
        </Row>  
        <Row>
            <Col class="margin-bottom-10">
                <Table :columns="columns" size="small" :data="list"></Table>
            </Col>
            <Col>
                <Page :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
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
                            action="/eop/bi/import_base_cost_detail"
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
                    <Button type="primary" @click="importData">导入</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import Util from 'libs/util';
    import {mapState} from 'vuex';

    function formSearch(){
        return {
            brandId:0,         //品牌id	number	
            costDetail:'',      //费用明细	string	
            costProperty:'',    //费用性质	number	0：固定，1：变动
            costType:'',        //费用类型	string	
            endYear:'',         //结束年份	string	格式：yyyy
            platfromCode:'',    //平台代码	string	TM：天猫，VIP：唯品会
            startYear:'',       //开始年份	string	格式：yyyy
        }
    }

    export default {
        name:'cost_detail',
        data(){
            return {
                formSearch:formSearch(),
                platfrom_List:[
                    {
                        value:'0',
                        label:'共同承担'
                    },
                    {
                        value:'1',
                        label:'天猫'
                    },
                    {
                        value:'2',
                        label:'唯品会'
                    },
                    {
                        value:'3',
                        label:'小红书'
                    },
                    {
                        value:'4',
                        label:'贝店'
                    },
                    {
                        value:'5',
                        label:'云集'
                    },
                    {
                        value:'6',
                        label:'京东'
                    },
                    {
                        value:'5',
                        label:'云集'
                    },
                    {
                        value:'7',
                        label:'爱库存'
                    },
                    {
                        value:'8',
                        label:'好衣库'
                    },
                    {
                        value:'9',
                        label:'大V店'
                    },
                    {
                        value:'10',
                        label:'拼多多'
                    },
                    {
                        value:'11',
                        label:'分期乐'
                    },
                    {
                        value:'12',
                        label:'楚楚街'
                    },
                    {
                        value:'13',
                        label:'宝贝仓'
                    },
                    {
                        value:'14',
                        label:'环球捕手'
                    },
                    {
                        value:'15',
                        label:'苏宁特卖'
                    },
                    {
                        value:'16',
                        label:'苏宁自营'
                    },
                    {
                        value:'17',
                        label:'头号买手'
                    },
                    {
                        value:'18',
                        label:'蘑菇街'
                    },
                    {
                        value:'19',
                        label:'达令家'
                    },
                    {
                        value:'20',
                        label:'小小包'
                    },
                    {
                        value:'21',
                        label:'网易考拉'
                    },
                    {
                        value:'22',
                        label:'口袋通'
                    },
                    {
                        value:'23',
                        label:'云集POP'
                    },
                    {
                        value:'24',
                        label:'当当网'
                    },
                    {
                        value:'25',
                        label:'其他'
                    },
                    {
                        value:'26',
                        label:'唯品会线下'
                    },
                    {
                        value:'27',
                        label:'唯品会MP'
                    },
                    {
                        value:'28',
                        label:'每日一淘'
                    }
                    
                ],
                costProperty_List:[
                    {
                        value:'0',
                        label:'固定'
                    },
                    {
                        value:'1',
                        label:'变动'
                    }
                ],
                columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '费用类型',
                        key: 'costType',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '部门',
                        key: 'orgName',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '费用明细',
                        key: 'costDetail',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '年度',
                        key: 'year',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '一月份',
                        key: 'january',
                        align: 'center',
                        minWidth: 110,
                        render: (h, params) => {
                            if (this.isEdit) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].january,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].january = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.january)
                            }
                        }
                    },
                    {
                        title: '二月份',
                        key: 'february',
                        align: 'center',
                        minWidth: 110,
                        render: (h, params) => {
                            if (this.isEdit) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].february,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].february = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.february)
                            }
                        }
                    },
                    {
                        title: '三月份',
                        key: 'march',
                        align: 'center',
                        minWidth: 110,
                        render: (h, params) => {
                            if (this.isEdit) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].march,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].march = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.march)
                            }
                        }
                    },
                     {
                        title: '四月份',
                        key: 'april',
                        align: 'center',
                        minWidth: 110,
                        render: (h, params) => {
                            if (this.isEdit) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].april,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].april = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.april)
                            }
                        }
                    },
                    {
                        title: '五月份',
                        key: 'may',
                        align: 'center',
                        minWidth: 110,
                        render: (h, params) => {
                            if (this.isEdit) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].may,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].may = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.may)
                            }
                        }
                    },
                    {
                        title: '六月份',
                        key: 'june',
                        align: 'center',
                        minWidth: 110,
                        render: (h, params) => {
                            if (this.isEdit) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].june,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].june = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.june)
                            }
                        }
                    },
                    {
                        title: '七月份',
                        key: 'july',
                        align: 'center',
                        minWidth: 110,
                        render: (h, params) => {
                            if (this.isEdit) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].july,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].july = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.july)
                            }
                        }
                    },
                    {
                        title: '八月份',
                        key: 'august',
                        align: 'center',
                        minWidth: 110,
                        render: (h, params) => {
                            if (this.isEdit) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].august,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].august = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.august)
                            }
                        }
                    },
                    {
                        title: '九月份',
                        key: 'september',
                        align: 'center',
                        minWidth: 110,
                        render: (h, params) => {
                            if (this.isEdit) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].september,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].september = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.september)
                            }
                        }
                    },
                    {
                        title: '十月份',
                        key: 'october',
                        align: 'center',
                        minWidth: 110,
                        render: (h, params) => {
                            if (this.isEdit) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].october,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].october = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.october)
                            }
                        }
                    },
                    {
                        title: '十一月份',
                        key: 'november',
                        align: 'center',
                        minWidth: 110,
                        render: (h, params) => {
                            if (this.isEdit) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].november,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].november = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.november)
                            }
                        }
                    },
                    {
                        title: '十二月份',
                        key: 'december',
                        align: 'center',
                        minWidth: 110,
                        render: (h, params) => {
                            if (this.isEdit) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].december,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].december = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.december)
                            }
                        }
                    },
                    {
                        title: '合计',
                        key: 'sum',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '承担平台',
                        key: 'platfromName',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '费用性质',
                        key: 'costPropertySpec',
                        align: 'center',
                        minWidth: 180
                    },
                    {
                        title: '最新修改日期',
                        key: 'lastUpdated',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '最新导入日期',
                        key: 'created',
                        align: 'center',
                        minWidth: 150
                    }
                ],
                list:[],
                page:1,
                pageSize:10,
                total:0,
                file:null,
                loadingStatus: false,
                importModal: false,
                userInfo:{},
                isEdit:false,
                brandList:[],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getFullYear() > new Date().getFullYear()
                    }
                }
            }
        },
        computed:{
           
        },
        mounted(){
            this.getBrandList();
            this.search();
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));        
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
                    this.brandList = this.brandList.filter(x=>{
                        return x.id != '51594' && x.id != '51609'
                    })
                })
            },
            search(){
                this.page = 1;
                this.getData();
            },
            reset(){
                this.page = 1;
                this.formSearch = formSearch();
                this.getData();
            },
            getData(){
                let data = {};
                let formSearch = Util.deepClone(this.formSearch);
                if(!!formSearch.startYear){
                    formSearch.startYear = Util.dateFormat(formSearch.startYear,'yyyy');
                }
                if(!!formSearch.endYear){
                    formSearch.endYear = Util.dateFormat(formSearch.endYear,'yyyy');
                }
                if(this.formSearch.startYear > this.formSearch.endYear){
                    this.$Message.warning('日期选择有误，请重新选择！');
                    return false;
                }
                data.brandId == 0 ? formSearch.brandId = '' : formSearch.brandId = formSearch.brandId;        

                data.start = (this.page - 1) * this.pageSize;
                data.length = this.pageSize;
                data = Object.assign(data,formSearch);
                this.request('get_base_cosr_detail',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.baseCostDetailList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.list = res.data.baseCostDetailList;
                        this.total = res.data.count;
                        let lastPage = Math.ceil(this.total / this.pageSize);
                        if(this.page==lastPage){
                             let sum = res.data.baseCostDetailSum
                             this.list.push({
                                 serialNo:'合计',
                                 january:Number(sum.january).toFixed(2),
                                 february:Number(sum.february).toFixed(2),
                                 march:Number(sum.march).toFixed(2),
                                 april:Number(sum.april).toFixed(2),
                                 may:Number(sum.may).toFixed(2),
                                 june:Number(sum.june).toFixed(2),
                                 july:Number(sum.july).toFixed(2),
                                 august:Number(sum.august).toFixed(2),
                                 september:Number(sum.september).toFixed(2),
                                 october:Number(sum.october).toFixed(2),
                                 november:Number(sum.november).toFixed(2),
                                 december:Number(sum.december).toFixed(2),
                                 sum:Number(sum.sum).toFixed(2)
                             })
                        }
                    }
                })
            },
            openModal(){
                this.importModal = true;
            },
            edit(){
                this.isEdit = true;
            },
            save(){
                let data = Util.deepClone(this.list);
                data.map(x=>{
                    data.lastUpdateUser = this.userInfo.userAccount;
                    delete x.serialNo;
                })
                this.request('edit_base_cost_detail',{
                    data:{
                        list:data
                    }
                },true).then(res=>{
                    if(res.code == 1){
                        this.isEdit = false;
                        this.$Message.success(res.msg);
                        this.search();
                    }
                })
            },
            downTemplate(){
                window.location = ('/excel/费用明细导入模板.xlsx')
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
                    this.$Message.success({
                        content: res.msg,
                        duration: 3
                    });
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
            importData() {
                this.loadingStatus = true;
                this.$refs['upload'].post(this.file);
            },
            cancel(){
                this.importModal = false;
                this.file = null;
            },
            exportData(){
                let data = Util.deepClone(this.formSearch);
                !!data.startYear?data.startYear = Util.dateFormat(this.formSearch.startYear,'yyyy'):data.startYear = '';
                !!data.endYear?data.endYear = Util.dateFormat(this.formSearch.endYear,'yyyy'):data.endYear = '';
                data.brandId == 0 ? data.brandId = '' : data.brandId = this.formSearch.brandId;
                this.request('export_cost_detail',data,true).then(res=>{
                    if(res.status=='success'){
                        this.$Message.success(res.message);
                        if(document.location.href.indexOf('localhost')>0||document.location.href.indexOf('127.0.0.1')>0){
                            window.open('http://127.0.0.1:8360'+res.data)
                        }else{
                            window.open(res.data)
                        }
                    }
                })
            },
            CurrentChange(val){
                if(this.isEdit){
                    this.$Message.warning('当前页面修改数据未保存!')
                }else{
                    this.page = val;                    
                    this.getData();
                }
            },
            SizeChange(val){
                if(this.isEdit){
                    this.$Message.warning('当前页面修改数据未保存!')
                }else{
                    this.pageSize = val;
                    this.getData();
                }
            }
        }
    }
</script>
