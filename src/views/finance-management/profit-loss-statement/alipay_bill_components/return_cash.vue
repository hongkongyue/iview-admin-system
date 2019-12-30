<template>
    <div class="background-color-white exhibition" id="return_cash">
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
                        action="/eop-node/api/analysis/import_return_cash"
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
                    <Button type="primary" @click="save">导入</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>
    
<script>
    import Util from 'libs/util';
    export default {
        name:'return_cash',
        data(){
            return {
                formSearch:{},
                importModal:false,
                file:null,
                userInfo:{},
                list:[],
                columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 60
                    },{
                        title:'时间',
                        key:'date_time',
                        align:'center',
                        minWidth:60
                    },
                    {
                        title: '店铺',
                        key: 'shop_name',
                        align: 'center',
                        minWidth: 100
                    },
                    // {
                    //     title: '金额',
                    //     key: 'return_cash_fee',
                    //     align: 'center',
                    //     minWidth: 100
                    // },
                    {
                        title: '收入金额（+元）',
                        key: 'income_fee',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '支出金额（-元）',
                        key: 'expend_fee',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '导入人',
                        key: 'create_user',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '导入时间',
                        key: 'created',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '修改人',
                        key: 'last_update_user',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '修改时间',
                        key: 'last_updated',
                        align: 'center',
                        minWidth: 100
                    }
                ],
                page:1,
                pageSize:16,
                total:0
            }
        },
        props:['formSearch'],
        mounted(){
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));
        },
        methods:{
            reset(){
                this.formSearch = {};
                this.search();
            },
            search(){
                this.page = 1;
                this.getData();
            },
            getData(){
                let data = Util.deepClone(this.formSearch);
                data.page = this.page;
                data.pageSize = this.pageSize;
                this.request('get_return_cash_list',data,true).then(res=>{
                    if(res.code == 1){
                        this.total = res.data.count;
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.data.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.list = res.data.data;
                    }
                })
            },
            openModal(){
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
            cancel(){
                this.importModal = false;
                this.file = null;
            },
            save(){
                this.loadingStatus = true;
                Vue.prototype.$loading('正在导入数据...');
                this.$refs.upload.post(this.file);
            },
            CurrentChange(val){
                this.page = val;
                this.getData();
            },
            SizeChange(val){
                this.pageSize = val;
                this.getData();
            }
        }
    }
</script>

<style>
    
</style>

