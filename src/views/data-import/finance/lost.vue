<template>
    <div id="ad_fee">
        <Row>
            <Col class="margin-bottom-10">
                <Table :columns="columns" size="small" :data="list"></Table>
            </Col>
            <Col>
                <Page :total="total"  :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
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
                        action="/eop/bi/import_cost_waste"
                        :data="{userCode:userInfo.userName}"
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

    export default {
        name:'ad_fee',
        data(){
            return {
                list:[],
                red_packet_table_row_index:-1,
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
                        minWidth: 130
                    },
                     {
                        title: '日期',
                        key: 'dateTime',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '金额',
                        key: 'wasteAmount',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => {
                            if ((this.page - 1) *this.pageSize + params.index == this.red_packet_table_row_index) {
                                return h('Input', {
                                    props: {
                                        type: 'number',
                                        value: this.list[params.index].wasteAmount,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            if(event.target.value<0){
                                                event.target.value=0
                                            }
                                            this.list[params.index].wasteAmount = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.wasteAmount)
                            }
                        }
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => {
                            if ((this.page - 1) *this.pageSize + params.index == this.red_packet_table_row_index) {
                                return h('Input', {
                                    props: {
                                        type: 'textarea',
                                        value: this.list[params.index].remark,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            if(event.target.value<0){
                                                event.target.value=0
                                            }
                                            this.list[params.index].remark = event.target.value;
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.remark)
                            }
                        }
                    },
                    {
                        title: '创建人',
                        key: 'createUser',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '创建时间',
                        key: 'created',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '最后修改人',
                        key: 'lastUpdateUser',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '最后修改日期',
                        key: 'lastUpdated',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        minWidth: 150,
                        fixed :'right',
                        render: (h, params) => {
                        if(params.row.serialNo == '合计'){
                              // params.row.costWasteTotal.wasteAmount
                                return h('div', '')
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
                                            this.red_packet_table_row_index = (this.page - 1) * this.pageSize + params.index;
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
                                            this.red_packet_table_row_index = -1;
                                            let data = Util.deepClone(params.row);
                                                data.lastUpdateUser = this.userInfo.userName;
                                                delete data.serialNo;
                                                delete data.serialNo;
                                                delete data._index;
                                                delete data._rowKey;
                                                delete data.brandId
                                                delete data.brandName
                                                delete data.created
                                                delete data.dateTime
                                                delete data.createUser
                                                delete data.lastUpdated
                                            this.request('bi_edit_cost_waste',{
                                                data:data
                                            },true).then(res=>{
                                                if(res.code == 1){
                                                    this.$Message.success(res.msg);
                                                    this.red_packet_table_row_index = -1;
                                                    this.search()
                                                }
                                            })
                                        }
                                    }
                                }, '保存'),
                            ]);
                        }
                    }
                ],
                page:1,
                pageSize:10,
                total:0,
                userInfo:{},
                importModal: false,
                file: null
            }
        },
        props:['formSearch'],
        mounted(){
            this.search();
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));     
        },
        methods:{
            search(){
                this.page = 1;
                this.getData();
            },
            reset(){
                this.formSearch.startDate = '';
                this.formSearch.endDate = '';
                this.formSearch.brandId = '';
                this.page = 1;
                this.getData();
            },
            getData(){
                let data = {};
                    data.length         =  this.pageSize;
                    data.start          = (this.page - 1) * this.pageSize
                if(this.formSearch.startDate){
                    data.startDate = Util.dateFormat(this.formSearch.startDate,'yyyy-MM-dd');
                }
                if(this.formSearch.endDate){
                    data.endDate = Util.dateFormat(this.formSearch.endDate,'yyyy-MM-dd');
                }
                if(this.formSearch.startDate > this.formSearch.endDate){
                    this.$Message.warning('日期选择有误，请重新选择！');
                    return false;
                }
                this.formSearch.brandId?data.brandId = this.formSearch.brandId : delete data.brandId  
                this.request('bi_get_cost_waste',{data:data},true).then(res=>{
                    if(res.code == 1){
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.costWasteList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.list = res.data.costWasteList;
                        this.total = res.data.count;
                        let lastPage = Math.ceil(this.total / this.pageSize);
                        if(this.page == lastPage){
                               let costDailyTotal = {};
                                   costDailyTotal.serialNo = '合计';
                                   costDailyTotal.wasteAmount=res.data.costWasteTotal.wasteAmount
                            this.list.push(costDailyTotal);
                        }
                    }
                })
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
                if (res.code == 0) {
                     this.loadingStatus = false;
                    this.$Message.error({
                        content: res.msg,
                        duration: 3
                    });
                } else {
                    this.loadingStatus = false;
                    this.file = null;
                    this.$Message.success(res.msg);
                    this.importModal = false;
                    this.search();
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
            export_ad_fee(){
                let data = Util.deepClone(this.formSearch);
                !!data.startDate?data.startDate = Util.dateFormat(this.formSearch.startDate,'yyyy-MM-dd'):data.startDate = '';
                !!data.endDate?data.endDate = Util.dateFormat(this.formSearch.endDate,'yyyy-MM-dd'):data.endDate = '';
                data.brandId == 0 ? data.brandId = '' : data.brandId = this.formSearch.brandId;
                let params=this.formatParams(data)
                 location.href=(`/eop/bi/export_cost_waste?${params}`)
            },
            formatParams(data) {
                    var arr = [];
                    for (var name in data) {
                    arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
                    }
                    return arr.join("&");
                }
        } 
    }
</script>

<style>

</style>

