<template>
    <div class="background-color-white exhibition" id="parameter_Message">
        <Row class="margin-bottom-10">
            <Button type="primary" @click="openModal('新增短信')">新增</Button>
            <Button type="primary" @click="get_cost_message_log">变更记录</Button>
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
                v-model="modal_visible" 
                :mask-closable="false" 
                :title="modal_title" 
                :width="400"
                :transfer="true"
                class-name="customize-modal-center"
            >   
                <Form :model="ModalForm" :label-width="120" ref="submit_data" :mask-closable="false" :rules="ruleValidate" inline label-position="right" >
                    <Row>
                        <Col>
                            <Form-item label="发送短信数/单：" prop="messageNumber">
                                <Input v-model.number="ModalForm.messageNumber" size="small"  placeholder="请输入发送短信数/单" style="width:150px"></Input>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="单价/元：" prop="messagePrice">
                                <Input v-model.number="ModalForm.messagePrice" size="small"  placeholder="请输入单价/元" style="width:150px"></Input>
                            </Form-item>
                        </Col>
                        <Col>
                            <Form-item label="备注：">
                                <Input v-model="ModalForm.remark" size="small"  placeholder="请输入备注" style="width:150px"></Input>
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
                v-model="message_log_modal" 
                :mask-closable="false" 
                title="变更记录" 
                :width="800"
                :transfer="true"
                class-name="customize-modal-center"
            > 
                <Row>
                    <Col class="margin-bottom-10">
                        <Table :columns="message_log_columns" size="small" :data="message_log_list"></Table>
                    </Col>
                    <Col>
                        <Page :total="message_log_total" :page-size="message_log_pageSize" :current="message_log_page" show-sizer show-total show-elevator @on-change="message_log_CurrentChange" @on-page-size-change="message_log_SizeChange"></Page>
                    </Col>
                </Row>
                <div slot="footer">
                    <Button type="default" @click="message_log_modal = false">取消</Button>
                    <Button type="primary" @click="message_log_modal = false">确定</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import Util from 'libs/util';
    import {mapState} from 'vuex';

    function ModalForm(){
        return {
            messageNumber:'',
            messagePrice:'',
            createUser:'',
            remark:''
        }
    }

    export default {
        name:'parameter_Message',
        data(){
            return {
                tarClass_List:[],
                taxDeatilList:[],
                ModalForm:ModalForm(),
                modal_visible:false,
                modal_title:'',
                userInfo:{},
                columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '发送短信数量/单',
                        key: 'messageNumber',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '单价/元',
                        key: 'messagePrice',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '修改人',
                        key: 'lastUpdateUser',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '修改时间',
                        key: 'lastUpdated',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                        minWidth: 150
                    },
                    {
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
                                            this.openModal('编辑短信',params.row);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.delete(params.row);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                list:[],
                total:0,
                page:1,
                pageSize:10,
                ruleValidate:{
                    messageNumber:[
                        { required: true, type:'number', message: '请输入发送短信数/单', trigger: 'blur' }                        
                    ],
                    messagePrice:[
                        { required: true, type:'number', message: '单价/元', trigger: 'blur' }                        
                    ]
                },
                message_log_modal: false,
                message_log_total:0,
                message_log_pageSize:10,
                message_log_page:1,
                message_log_columns:[
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '原短信费',
                        key: 'originPrice',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '新短信费',
                        key: 'newPrice',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '原短信数',
                        key: 'originNumber',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '新短信数',
                        key: 'newNumber',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '修改人',
                        key: 'lastUpdateUser',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '修改时间',
                        key: 'lastUpdated',
                        align: 'center',
                        minWidth: 150
                    },
                ],
                message_log_list:[]
            }
        },
        mounted(){
            this.search();
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));        
        },
        methods:{
            get_cost_message_log(){
                this.message_log_modal = true;
                this.request('get_cost_message_log',{
                    data:{}
                },true).then(res=>{
                    if(res.code == 1){
                        let serialNoBegain = this.message_log_pageSize * (this.message_log_page - 1);
                        res.data.costMessageLogList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.message_log_list = res.data.costMessageLogList;
                        this.message_log_total = res.data.count;
                    }
                })
            },
            search(){
                this.page = 1;
                this.getData();
            },
            changeTarClass(val){
                this.tarClass_List.map(x=>{
                    if(val == x.taxClassCode){
                        this.ModalForm.taxClassName = x.taxClassName;
                    }
                })
                this.request('get_tax_detail',{
                    data:{
                        taxClassCode:this.ModalForm.taxClassCode
                    }
                }).then(res=>{
                    if(res.code == 1){
                        this.taxDeatilList = res.data;
                    }
                })
            },
            changePlatfrom(val){
                this.Modal_platfrom_List.map(x=>{
                    if(x.value == val){
                        this.ModalForm.platfromName = x.label;
                    }
                })
            },
            changeTaxDetail(val){
                this.taxDeatilList.map(x=>{
                    if(val == x.taxDetailCode){
                        this.ModalForm.taxDeatilName = x.taxDeatilName;
                    }
                })
            },
            getData(){
                let data = {};
                data.start = (this.page - 1) * this.pageSize;
                data.length = this.pageSize;
                this.request('get_cost_message',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.costMessageList.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                        this.total = res.data.count;
                        this.list = res.data.costMessageList;
                    }
                })
            },
            openModal(type,row){
                this.modal_visible = true;
                this.modal_title = type;
                if(type == '编辑短信'){
                    this.ModalForm = Util.deepClone(row);
                }else{
                    this.ModalForm = ModalForm();
                }
                
            },
            cancel(){
                this.modal_visible = false;
                this.$refs['submit_data'].resetFields();
            },
            submit(){
                let data = Util.deepClone(this.ModalForm);
                let url = '';
                if(this.modal_title == '新增短信'){
                    data.createUser = this.userInfo.userName;
                    url = 'add_cost_message';
                }else if(this.modal_title == '编辑短信'){
                    url='edit_cost_message';
                    data.lastUpdateUser = this.userInfo.userName;
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
            delete(row){
                this.$Modal.confirm({
                    title: '提示',
                    content: '该行将会删除，请确认！',
                    onOk: () => {
                        this.request('delete_cost_message',{
                            data:{
                                id:row.id,
                                lastUpdateUser:this.userInfo.userName
                            }
                        },true).then(res=>{
                            if(res.code == 1){
                                this.getData();
                                this.$Message.success(res.msg);
                            }
                        })
                    },
                    onCancel: () => {
                        this.$Message.warning('已取消删除');
                    }
                })
            },
            CurrentChange(val){
                this.page = val;
                this.getData();
            },
            SizeChange(val){
                this.pageSize = val;
                this.getData();
            },
            message_log_CurrentChange(val){
                this.message_log_page = val;
                this.get_cost_message_log();
            },
            message_log_SizeChange(val){
                this.message_log_pageSize = val;
                this.get_cost_message_log();                
            }
        },
        components:{

        }
    }
</script>

<style lang="css">

</style>


