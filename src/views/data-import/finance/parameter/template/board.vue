<template>
    <div class="background-color-white exhibition" id="parameter_Express">
        <Row>
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Col>
                    <Form-item label="品牌：" :label-width='60'>
                        <Select v-model="formSearch.brandId" style="width:150px" size="small">
                            <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="活动期间" :label-width="80">
                        <DatePicker type="daterange" size="small" v-model="formSearch.datetime" split-panels placeholder="选择日期" style="width: 200px"></DatePicker>
                    </Form-item>
                    <Form-item :label-width="10">
                        <Button type="primary" size="small" icon="ios-search" @click="search">查询</Button>
                        <Button type="warning" size="small" @click="reset">重置</Button>
                    </Form-item>
                </Col>
            </Form>
        </Row>
        <Row class="margin-bottom-10">
            <Button type="primary" @click="downTemplate">下载模板</Button>
            <Button type="primary" @click="openModal">导入</Button>
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
                            action="/eop-node/api/analysis/import_board_parameter"
                            :data="{userAccount:userInfo.userAccount,platform_id:5}"
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

    function formSearch(){
        return {
            brandId:0,
        }
    }

    export default {
        name:'parameter_Express',
        data(){
            return {
                formSearch:formSearch(),
                importModal: false,
                userInfo:{},
                columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '品牌',
                        key: 'brand_name',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '活动名称',
                        key: 'activity_name',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '供货价折扣',
                        key: 'supply_discount',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '活动预估折扣',
                        key: 'activity_rate_discount',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '我方折扣承担比例',
                        key: 'our_discount_rate',
                        align: 'center',
                        minWidth: 140
                    },
                    {
                        title: '物流推广费比例',
                        key: 'logistics_promotion_fee_rate',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '活动开始时间',
                        key: 'activity_period_start',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '活动结束时间',
                        key: 'activity_period_end',
                        align: 'center',
                        minWidth: 120
                    }
                ],
                list:[],
                total:0,
                page:1,
                pageSize:10,
                file:null,
                loadingStatus: false,
                
            }
        },
        mounted(){
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));
        },
        props:['brandList'],
        methods:{
            search(){
                this.page = 1;
                this.getData();
            },
            reset(){
                this.formSearch = formSearch();
                this.search();
            },
            getData(){
                let data = Util.deepClone(this.formSearch);
                data.page = this.page;
                data.pageSize = this.pageSize;
                this.request('get_board_parameter',data,true).then(res=>{
                    if(res.code == 1){
                        this.total = res.data.count;
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.data.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.list = res.data.data;
                    }else{
                        this.$Message.warning(res.msg)
                    }
                })
            },
            openModal(){
                this.importModal = true;
            },
            cancel(){
                this.importModal = false;
                this.file = null;
            },
            downTemplate(){
                window.location = ('/excel/云集看板参数导入模板.xlsx')
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
            CurrentChange(val){
                this.page = val;
                this.getData();
            },
            SizeChange(val){
                this.pageSize = val;
                this.getData();
            }
        },
        components:{

        }
    }
</script>

<style lang="css">

</style>


