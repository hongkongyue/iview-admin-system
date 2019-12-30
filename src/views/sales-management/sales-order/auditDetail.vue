<template>
<div>
    <Row class="margin-bottom-10 background-color-white exhibition">
        <Col span="24">
        <Form :model="formSearch"  :label-width="120" inline label-position="right">
            <Divider orientation="left">退货信息</Divider>
            <!-- <Form-item label="单据状态：">{{this.$route.query.obj.order_status}}</Form-item>
            <Form-item label-width="20">
                <Button type="primary" @click="search">手动退款</Button>
            </Form-item>
            <Form-item label="退货申请审核：" label-width="110">{{this.$route.query.obj.return_goods_status}} </Form-item>
            <Form-item label="退款审核：" label-width="110">{{this.$route.query.obj.return_pay_status}}</Form-item>
            <Form-item :label-width="200">
                <Button type="primary" @click="()=>{this.examine=true}">审核</Button>
            </Form-item> -->
            <Col span="22">
            <Row class-name="padding-top-10">
              <Col span="7">
              <Form-item label="单据状态：">
                {{this.$route.query.obj.order_status| switchStatus}} <Button v-if="this.$route.query.obj.order_status == 950" type="primary" @click="handReturn">手动退款</Button>
              </Form-item>
              </Col>
              <Col span="7">
              <Form-item label="退货申请审核：">
                {{this.$route.query.obj.return_goods_status| checkStatus}}
                
              </Form-item>
              </Col>
              <Col span="7">
              <Form-item label="退款审核：">
                {{this.$route.query.obj.return_pay_status | checkStatus}} <span style="padding-left:20px"><Button v-if="this.$route.query.obj.order_status == 400||this.$route.query.obj.order_status == 300||this.$route.query.obj.order_status == 200 ||this.$route.query.obj.order_status == 600" type="primary" @click="examineCheck">审核</Button></span>
              </Form-item>
              </Col>
            </Row>
            <Row class-name="padding-top-10">
              <Col span="7">
              <Form-item label="单据审核人：">
                {{this.$route.query.obj.order_check_name}}
              </Form-item>
              </Col>
              <Col span="7">
              <Form-item label="单据审核时间：">
                {{this.$route.query.obj.order_check_time}}
              </Form-item>
              </Col>
              <Col span="7">
              <Form-item label="单据审核意见：">
                {{this.$route.query.obj.order_check_msg}}
              </Form-item>
              </Col>
            </Row>
            <Row class-name="padding-top-10">
              <Col span="7">
              <Form-item label="退款审核人：">
                {{this.$route.query.obj.refund_check_name}}
              </Form-item>
              </Col>
              <Col span="7">
              <Form-item label="退款审核时间：">
                {{this.$route.query.obj.refund_check_time}}
              </Form-item>
              </Col>
              <Col span="7">
              <Form-item label="退款审核意见：">
                {{this.$route.query.obj.refund_check_msg}}
              </Form-item>
              </Col>
            </Row>
            </Col>
            <Divider orientation="left">单据信息</Divider>
            <Col>
            <Form-item label="退货单号：">
                {{this.$route.query.obj.return_code}}
                <!-- <span>NGTH20191006165619</span> -->
            </Form-item>
            <Form-item label="原始订单编号:">
                {{this.$route.query.obj.source_return_code}}
            </Form-item>
            <Form-item label="物流公司：">
                {{this.$route.query.obj.logistics_company}}
            </Form-item>
            <Form-item label="物流单号：">
                {{this.$route.query.obj.logistics_no}}
            </Form-item>
            <Form-item label="图片：">
                <!-- {{this.$route.query.obj.img_url}} -->
                <img v-if="this.$route.query.show_img" width="70px" height="70px"  :src="imgURL" @click="lookbig"/>
                <img v-if="!this.$route.query.show_img" width="70px" height="70px" :src="noPicture"/>
            </Form-item>
            </Col>
            <Form-item label="退货信息：">
                {{this.$route.query.obj.consigne}}，{{this.$route.query.obj.province}}
                {{this.$route.query.obj.city}}{{this.$route.query.obj.county}}{{this.$route.query.obj.address}}，
                {{this.$route.query.obj.phone_no}}
                <!-- <span>李先生 13844315562 浙江省杭州市萧山区农业大厦2栋17层</span> -->
            </Form-item>
            <Form-item label="订单时间：">
                {{this.$route.query.obj.order_time}}
                <!-- <span>2015-06-27 13:45:00</span> -->
            </Form-item>
            <Divider orientation="left">商品信息</Divider>
            <Table :columns="columns" @on-current-change='currentChange' size="small" highlight-row max-height="400" :data="returnList"></Table>
        </Form>
        </Col>
    </Row>
    <Modal :title="title" v-model="examine" class-name="vertical-center-modal" @on-cancel="Reset('formValidate')">
        <Form :model="formData" ref="formValidate" :label-width="90" inline :rules="ruleValidate" label-position="right">
            <Form-item label="审核是否通过?" :label-width="110" prop="selected">
                <RadioGroup v-model="formData.selected" style="width: 200px">
                    <Radio label="是"></Radio>
                    <Radio label="否"></Radio>
                </RadioGroup>
            </Form-item>
            <Col>
            <Form-item label="审核意见：" :label-width="110" >
                <Input v-model="formData.remark" maxlength="100" show-word-limit type="textarea" placeholder="请输入" style="width: 200px" />
            </Form-item>
            </Col>
            <!-- <Col style="text-align:center">
            <div style="height:10px;line-height:10px">单据状态：未收货</div>
            </Col>
            <Col style="text-align:center">
            <div style="height:70px;line-height:70px">是否要强制审核？</div>
            </Col> -->
            <Row style="text-align:center">
                <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
                <Button type="default" @click="Reset('formValidate')">取消</Button>
            </Row>

        </Form>
        <div slot="footer"></div>
    </Modal>
    <Modal title="强制审核" v-model="forceExamine" class-name="vertical-center-modal" @on-cancel="cancel">
        <Form  :label-width="90" inline  label-position="right">
            <Col style="text-align:center">
            <div style="height:10px;line-height:10px">单据状态：未收货</div>
            </Col>
            <Col style="text-align:center">
            <div style="height:70px;line-height:70px">是否要强制审核？</div>
            </Col>
            <Row style="text-align:center">
                <Button type="primary" @click="confirmCheck">确定</Button>
                <Button type="default" @click="cancel">取消</Button>
            </Row>

        </Form>
        <div slot="footer"></div>
    </Modal>
    <Modal title="查看大图" v-model="visible">
        <img :src="imgURL" v-if="visible" style="width: 100%">
    </Modal>
</div>
</template>

<script>
import {
    mapState
} from 'vuex';
export default {
    name: 'auditDetail',
    data() {
        return {
            examine: '',
            noPicture: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575004170413&di=10a00dde6c3c50cd3a2b18fe8994cdae&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fbdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658',
            formSearch: {},
            formData: {
               selected:'',
               remark:'' 
            },
            title:'审核',
            imgURL:'',
            forceExamine:false,
            visible:false,
            order_status:'',
            ruleValidate: {
                selected: [{
                    required: true,
                    message: '请选择审核是否通过',
                    trigger: 'change'
                }],
                remark: [{
                    required: true,
                    message: '请输入审核意见',
                    trigger: 'blur'
                }],
            },
            returnList: [],
            userInfo: {},
            columns: [
                {
                        title: '序号',
                        key: 'index',
                        align: 'center',
                        width: 70,
                        render: (h, params) => {
                                  return h('span', {
                                        },params.index+1); 
                        },

                    },
                {
                    title: '品牌',
                    key: 'brands',
                    align: 'center',
                    minWidth: 150
                },
                {
                    title: '款号',
                    key: 'section_no',
                    align: 'center',
                    minWidth: 150
                },
                {
                    title: '规格名称',
                    key: 'norms',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '商品条码',
                    key: 'commodity_code',
                    align: 'center',
                    minWidth: 150
                },
                {
                    title: '单价',
                    key: 'price',
                    minWidth: 150,
                    align: 'center',
                },
                {
                    title: '退货申请数量',
                    key: 'item_counts',
                    align: 'center',
                    minWidth: 100,
                },
                {
                    title: '仓库已收货数量',
                    key: 'instock_count',
                    align: 'center',
                    minWidth: 100,
                },
                {
                    title: '售后类型',
                    key: 'order_type',
                    align: 'center',
                    minWidth: 110,
                },
                {
                    title: '退款金额',
                    key: 'price_sum',
                    align: 'center',
                    minWidth: 100,
                },
                {
                    title: '退货仓库',
                    key: 'warehouse_name',
                    align: 'center',
                    minWidth: 100,
                },
                {
                    title: '退货理由',
                    key: 'return_reason',
                    align: 'center',
                    minWidth: 100,
                },
                 {
                    title: '说明',
                    key  : 'detail_remark',
                    align: 'center',
                    minWidth: 100,
                },
            ],
            examine: false,

        }
    },
    beforeCreate(){

    },
    beforeDestroy(){
        localStorage.removeItem('obj')
    },
    mounted() {
        this.$route.query.obj=JSON.parse(localStorage.getItem('obj'))
        this.imgURL='http://'+window.location.host+this.$route.query.show_img;
        console.log(this.$route.query.obj,'11111111111111')
        this.order_status=this.$route.query.obj.order_status
        this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
        this.getData()//table数据
    },
    methods: {
         handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                         if(this.title=='审核退货'){
                             this.checkGoodsBack()
                         }else if(this.title=='审核退款'){
                             this.checkMoneyBack()
                         }
                    } else {
                      
                    }
                })
            },
        lookbig(){
                this.visible=true
            },
        Reset(name) {
                this.examine=false;
                this.$refs[name].resetFields();
                // this.formData.selected=''
                // this.formData.remark=''
               
        },
        getData(){
            console.log(this.$route.query.obj.return_code)
            let data = {}
            data.return_code = this.$route.query.obj.return_code
            this.request('get_return_detail_list', {data}, false).then((res) => {
                if (res.code == '1') {
                  this.returnList = res.data
                    console.log('pppp')
                }
            })
        },
                // 审核退款状态
        checkMoneyBack(){
                 let data={}
                     data.refund_check_id=this.userInfo.userId
                     data.refund_check_name=this.userInfo.userName
                     data.refund_check_msg=this.formData.remark
                     data.ids=[this.$route.query.obj.id]
                     data.return_pay_status=this.formData.selected=='否'?0:1
                    this.request('eom_check_refund_status', {
                            data: data
                        }, true).then(res => {
                            if (res.code == 1) {
                                   this.$Message.success(res.msg)
                                   this.examine=false;
                                   this.formData={}
                                   localStorage.removeItem('obj')
                                   this.$root.eventHub.$emit('closePageFromOtherPage', 'auditDetail');//关闭新增页面
                                   this.$router.push({name: 'returnAudit'});//跳转
                                 
                            }else{
                                 this.$Message.error(res.msg)
                            }
                        })
         },
        // 审核退货状态
        checkGoodsBack(){
              let data={}
                     data.order_check_id  =this.userInfo.userId
                     data.order_check_name=this.userInfo.userName
                     data.order_check_msg =this.formData.remark
                     data.ids=[this.$route.query.obj.id]
                     data.return_goods_status=this.formData.selected=='否'?0:1
                    this.request('eom_check_goods_status', {
                            data: data
                        }, true).then(res => {
                            if (res.code == 1) {
                                   this.$Message.success(res.msg)
                                   this.examine=false;
                                   this.formData={}
                                //    this.$Message.success(res.msg)
                                localStorage.removeItem('obj')
                             this.$root.eventHub.$emit('closePageFromOtherPage', 'auditDetail');//关闭新增页面
                             this.$router.push({name: 'returnAudit'});//跳转至列表页面
                            }else{
                                 this.$Message.error(res.msg)
                            }
                        })
        },
        confirmCheck(){
                                   this.title="审核退款"
                                   this.examine=true
                                   this.forceExamine=false
        },
        examineCheck(){
                      let data={}
                          data.ids=[this.$route.query.obj.id]
                        this.request('eom_check_return_status_code', {
                            data: data
                        }, true).then(res => {
                            if(res.code == 1) {
                                   this.title="审核退货"
                                   this.examine=true
                            }else if(res.code == 2) {
                                   this.forceExamine=true
                            }else if(res.code == 3){
                                   this.title="审核退款"
                                   this.examine=true
                            }else{
                                   this.$Message.error('不能审核')
                            }
                        })   
                //    if(this.$route.query.obj.order_status==200&&this.$route.query.obj.return_goods_status==200){
                //        this.title="审核退货"
                //        this.examine=true
                //    }else if(this.$route.query.obj.order_status==600 && this.$route.query.obj.return_pay_status ==200){
                //        this.title="审核退款"
                //         this.examine=false
                //    }
        },
        //手动退款
        handReturn(){
                let data={}
                    data.id=this.$route.query.obj.id
                    data.return_code=this.$route.query.obj.return_code
                    data.last_update_user=this.userInfo.userName
                    this.request('eom_refund_pay_01',{data:data},false).then(res=>{
                         if(res.code==1){
                             this.$Message.success(res.msg)
                             this.$root.eventHub.$emit('closePageFromOtherPage', 'auditDetail');//关闭新增页面
                             this.$router.push({name: 'returnAudit'});//跳转至列表页面
                         }else{

                         }
                    })
        },
        search() {
           this.visible = false; 
            this.getData()
        },
        handleReset() {
            this.formSearch = {};
            this.label_list = [];
        },
        currentChange(currentRow, oldCurrentRow) {
            this.currentRow = currentRow;
        },
        cancel() {
            this.forceExamine = false
        },
    }
}
</script>
