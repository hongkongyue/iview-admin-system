<style>
#staff_sales_order_return .ivu-form-item {
    margin-bottom: 15px;
}
</style>

<template>
<div class="background-color-white exhibition" id="staff_sales_order_return">
    <Card dis-hover>
        <Form ref="Form" :model="Form" :label-width="110" inline label-position="right" :rules="rules">
            <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
                <i-col span="22">
                    <span style="border:3px solid gray;margin-right:10px"></span>
                    退货信息：
                </i-col>
            </Row>
            <Row class-name="margin-bottom-10 padding-top-10">
                <Col span="24">
                <div v-if="$route.params.orderId.substring(0,2) == 'DX'">
                    <Col span="6">
                    <Form-item :label-width="110" label="寄件人：" prop="sender" v-if="Form.logistics_code != 'YPKD'">
                        <Input type="text" v-model="Form.sender" size="small"></Input>
                    </Form-item>
                    </Col>
                    <Col span="6">
                    <Form-item :label-width="120" label="寄件人地址：" prop="send_address">
                        <Input type="text" v-model="Form.send_address" size="small"></Input>
                    </Form-item>
                    </Col>
                    <Col span="6">
                    <Form-item :label-width="120" label="寄件人电话：" prop="send_tel">
                        <Input type="text" v-model="Form.send_tel" size="small"></Input>
                    </Form-item>
                    </Col>
                </div>
                </Col>
                <Col span="6">
                <Form-item label="物流公司：" prop="logistics_company">
                    <Select style="width:162px" v-model="Form.logistics_company" size="small" placeholder="请选择" @on-change="changeLogistic">
                        <Option v-for="item in logisticList" :value="item.logisticType" :key="item.logisticTypeNo">
                            {{
                                item.logisticType }}
                        </Option>
                    </Select>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item :label-width="120" label="退货物流单号：" prop="logistics_no" v-if="Form.logistics_code != 'YPKD' && !!Form.logistics_company">
                    <Input type="text" v-model="Form.logistics_no" @on-blur="bulrLogisticsNo" size="small"></Input>
                </Form-item>
                </Col>
                <Col span="6">
                <Button style="margin-left:20px" type="primary" @click="upLoad">上传图片</Button>
                <div style="width:150px;height:150px;padding-top:10px;margin-left:80px">
                    <img v-bind:src="AAA" @click="seeBigPic" style="width:130px;height:130px;margin-left:15px;margin-top:-41px">
                </div>
                </Col>

            </Row>
            <Modal title="查看大图" v-model="visible">
                <img :src="AAA" v-if="visible" style="width: 100%">
            </Modal>
            <Modal v-model="picterVisible" title="上传图片">
                <div>
                    <Upload ref="upload" name="file" :show-upload-list="false" :before-upload="handleUpload" :on-success="uploadSuccess" :on-error="uploadError" type="drag" action="/eop/eom/upload_logistics_img" :data="{img_name:this.Name}">
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>点击或将文件拖拽到此处</p>
                        </div>
                    </Upload>
                    <div v-if="file !== null">{{ file.name }}
                        <Button type="text" :loading="loadingStatus">{{ loadingStatus ? '上传中...' : '' }}
                        </Button>
                    </div>
                </div>
                <div slot="footer">
                    <Button type="default" @click="cancelTag">取消</Button>
                    <Button type="primary" @click="uploadImg">导入</Button>
                </div>
            </Modal>
            <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
                <i-col span="22">
                    <span style="border:3px solid gray;margin-right:10px"></span>
                    退货商品：
                </i-col>
            </Row>
            <Row class-name="margin-bottom-10 padding-top-10">
                <div v-if="$route.params.orderId.substring(0,2) == 'NG'">
                    <Table :columns="NG_columns" :border="true" :data="staffSalesOrder.staffOrderDetailList" size="small"></Table>
                </div>
                <div v-else>
                    <Table :columns="DX_columns" :border="true" :data="staffSalesOrder.staffOrderDetailList" size="small"></Table>
                </div>
            </Row>
            <Row style="text-align: right">
                <b>退货总金额:{{ totalMoney }}元</b>
            </Row>
            <Row style="text-align: center">
                <Button type="primary" @click="submit">确认退货</Button>
            </Row>
        </Form>
    </Card>
</div>
</template>

<script>
import Util from 'libs/util'
import {
    mapState
} from 'vuex'

function Form() {
    return {
        logistics_company: '', //物流公司编码
        logistics_code: '', //物流公司名称
        logistics_no: '', //运单号
        send_address: '',
        send_tel: '',
        sender: ''
    }
}

export default {
    name: "staffsalesorder_return_template",
    data() {
        const vaildator_logistics_no = (rule, value, callback) => {
            let reg = /^[A-Za-z0-9]+$/;
            if (value === '') {
                callback(new Error('请输入物流单号'));
            }
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error('只允许输入数字、字母'))
            }
        }
        const vaildator_send_tel = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入寄件人号码'));
            }
            if (Util.isMobile(String(value))) {
                callback();
            } else {
                callback(new Error('请输入正确的手机号码格式'))
            }
        }
        return {
            returnReasonList: [],
            imgUrl: null,
            visible: false,
            imgSrcUpload: '',
            picterVisible: false,
            file: null,
            Name: '',
            AAA: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1562574299&di=846b4c904bd54d3c3821fa5938888c69&src=http://hbimg.b0.upaiyun.com/bdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658',
            Form: Form(),
            staffSalesOrder: [],
            totalMoney: 0,
            NG_columns: [{
                    title: '序号',
                    type: 'index',
                    align: 'center',
                    width: 65
                },
                {
                    title: '品牌',
                    key: 'brands',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '款号',
                    key: 'sectionNo',
                    width: 85,
                    align: 'center'
                },
                {
                    title: '规格名称',
                    key: 'norms',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '商品条码',
                    key: 'commodityCode',
                    width: 115,
                    align: 'center',
                },
                {
                    title: '单价',
                    key: 'price',
                    width: 70,
                    align: 'center',
                },
                {
                    title: '可退数量',
                    key: 'unreturnCount',
                    width: 90,
                    align: 'center',
                },
                // {
                //   title: '退款支付宝账号',
                //   key: 'refundAccount',
                //   width: 180,
                //   align: 'center',
                //   render: (h, params) => {
                //     return h('Input', {
                //       props: {
                //         type: 'text',
                //         value: this.staffSalesOrder.staffOrderDetailList[params.index].refundAccount,
                //         size:'small'
                //       },
                //       on: {
                //         input: (val) => {
                //           this.staffSalesOrder.staffOrderDetailList[params.index].refundAccount = val;
                //         }
                //       }
                //     })
                //   }
                // },
                {
                    title: '退货原因',
                    key: 'order_type',
                    width: 110,
                    align: 'center',
                    render: (h, params) => {
                        return h('Select', {
                                props: {
                                    value: this.staffSalesOrder.staffOrderDetailList[params.index].order_type,
                                    size: 'small',
                                    transfer: true
                                },
                                on: {
                                    'on-change': (value) => {
                                        this.staffSalesOrder.staffOrderDetailList[params.index].order_type = value;
                                        this.totalMoney = 0;
                                        this.staffSalesOrder.staffOrderDetailList.map(x => {
                                            this.totalMoney += x.item_counts * x.price;
                                        })
                                    }
                                },
                            },
                            this.returnReasonList.map(function (item) {
                                return h('Option', {
                                    props: {
                                        value: item.RETURN_REASON
                                    }
                                }, item.RETURN_REASON);
                            })
                        );
                    },
                },
                {
                    title: '退货申请数量',
                    key: 'item_counts',
                    width: 110,
                    align: 'center',
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                // editable:false,
                                value: this.staffSalesOrder.staffOrderDetailList[params.index].item_counts,
                                size: 'small'
                            },
                            on: {
                                input: (value) => {
                                    let data = this.staffSalesOrder.staffOrderDetailList[params.index];
                                    this.totalMoney = 0;

                                    if (value < 0) {
                                        this.$Message.warning('不能为负数！');
                                        data.item_counts = 0;
                                        this.$set(this.staffSalesOrder.staffOrderDetailList, params.index, data);
                                        this.staffSalesOrder.staffOrderDetailList.map(x => {
                                            this.totalMoney += x.item_counts * x.price;
                                        })
                                        return false;
                                    }

                                    if(value){
                                        if(value.toString().indexOf('.') != -1){
                                            this.$Message.warning('不能为小数！');
                                        return false;
                                        }
                                    }

                                    if (value > params.row.unreturnCount) {
                                        this.$Message.warning('退还数量超过可退数量！');
                                        data.item_counts = 0;
                                        this.$set(this.staffSalesOrder.staffOrderDetailList, params.index, data);
                                        this.staffSalesOrder.staffOrderDetailList.map(x => {
                                            this.totalMoney += x.item_counts * x.price;
                                        })
                                        return false;
                                    }
                                     else {
                                        data.item_counts = value;
                                        this.staffSalesOrder.staffOrderDetailList.map(x => {
                                            if (!!x.order_type) {
                                                this.totalMoney += x.item_counts * x.price;
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    }
                },
                {
                    title: '说明',
                    key: 'detail_remark',
                    align: 'center',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('Input', {
                            props: {
                                type: 'textarea',
                                value: this.staffSalesOrder.staffOrderDetailList[params.index].detail_remark,
                                size: 'small',
                                autosize: {
                                    minRows: 1,
                                    maxRows: 5
                                },
                                maxlength: "100",
                            },
                            on: {
                                input: (val) => {
                                    this.staffSalesOrder.staffOrderDetailList[params.index].detail_remark = val;
                                }
                            }
                        })
                    }
                },
            ],
            DX_columns: [{
                    title: '序号',
                    type: 'index',
                    align: 'center',
                    width: 65
                },
                {
                    title: '品牌',
                    key: 'brands',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '款号',
                    key: 'sectionNo',
                    width: 85,
                    align: 'center'
                },
                {
                    title: '规格名称',
                    key: 'norms',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '商品条码',
                    key: 'commodityCode',
                    width: 115,
                    align: 'center',
                },
                {
                    title: '单价',
                    key: 'price',
                    width: 70,
                    align: 'center',
                },
                {
                    title: '可退数量',
                    key: 'count',
                    width: 90,
                    align: 'center',
                },
                {
                    title: '售后类型',
                    key: 'order_type',
                    width: 110,
                    align: 'center',
                    render: (h, params) => {
                        return h('Select', {
                                props: {
                                    value: this.staffSalesOrder.staffOrderDetailList[params.index].order_type,
                                    size: 'small'
                                },
                                on: {
                                    'on-change': (value) => {
                                        this.staffSalesOrder.staffOrderDetailList[params.index].order_type = value;
                                        this.totalMoney = 0;
                                        this.staffSalesOrder.staffOrderDetailList.map(x => {
                                            this.totalMoney += x.item_counts * x.price;
                                        })
                                    }
                                },
                            },
                            this.order_type.map(function (item) {
                                return h('Option', {
                                    props: {
                                        value: item.value
                                    }
                                }, item.label);
                            })
                        );
                    },
                },
                {
                    title: '退货数量',
                    key: 'item_counts',
                    width: 110,
                    align: 'center',
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: this.staffSalesOrder.staffOrderDetailList[params.index].item_counts,
                                size: 'small'
                            },
                            on: {
                                input: (value) => {
                                    let data = this.staffSalesOrder.staffOrderDetailList[params.index];
                                    this.totalMoney = 0;

                                    if (value < 0) {
                                        this.$Message.warning('不能为负数！');
                                        data.item_counts = 0;
                                        this.$set(this.staffSalesOrder.staffOrderDetailList, params.index, data);
                                        this.staffSalesOrder.staffOrderDetailList.map(x => {
                                            this.totalMoney += x.item_counts * x.price;
                                        })
                                        return false;
                                    }

                                    if (value > params.row.count) {
                                        this.$Message.warning('退还数量超过可退数量！');
                                        data.item_counts = 0;
                                        this.$set(this.staffSalesOrder.staffOrderDetailList, params.index, data);
                                        this.staffSalesOrder.staffOrderDetailList.map(x => {
                                            this.totalMoney += x.item_counts * x.price;
                                        })
                                        return false;
                                    } else {
                                        data.item_counts = value;
                                        this.staffSalesOrder.staffOrderDetailList.map(x => {
                                            if (!!x.order_type) {
                                                this.totalMoney += x.item_counts * x.price;
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    }
                },
                {
                    title: '退货理由',
                    key: 'detail_remark',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('Input', {
                            props: {
                                type: 'text',
                                value: this.staffSalesOrder.staffOrderDetailList[params.index].detail_remark,
                                size: 'small'
                            },
                            on: {
                                input: (val) => {
                                    this.staffSalesOrder.staffOrderDetailList[params.index].detail_remark = val;
                                }
                            }
                        })
                    }
                },
            ],
            rules: {
                logistics_company: [{
                    required: true,
                    message: '请选择物流公司',
                    trigger: 'change'
                }],
                logistics_no: [{
                    required: true,
                    validator: vaildator_logistics_no,
                    trigger: 'blur'
                }],
                sender: [{
                    required: true,
                    message: '请输入寄件人',
                    trigger: 'blur'
                }],
                send_tel: [{
                    required: true,
                    validator: vaildator_send_tel,
                    trigger: 'blur'
                }],
                send_address: [{
                    required: true,
                    message: '请输入寄件地址',
                    trigger: 'blur'
                }]
            },
            order_type: [{
                value: 'TH',
                label: '退货'
            }],
        }
    },
    mounted() {
        this.getReason()
        let type = this.$route.params.orderId;
        type = type.substring(0, 2);
        if (type == 'DX') {
            this.Form.sender = '张喆';
            this.Form.send_address = '北京市东城区建国门金成建国601';
            this.Form.send_tel = 13581694578
        }
        this.$store.dispatch('GetLogisticListNew', {
            data: {
                order_type: "GH"
            },
            type: type
        });
        this.orderId = this.$route.params.orderId
        this.getStaffSalesOrderDetail(this.orderId);
    },
    destroyed() { //
        if (this.imgUrl != null) {
            console.log('/.........../////////////.............')
            let data = {}
            data.img_url = this.imgUrl
            this.request('delete_logistics_img', {
                data
            }, false).then((res) => {
                if (res.code == '1') {
                    console.log('000')
                }
            })
        }
    },
    computed: {
        ...mapState({
            logisticList: state => state.common.logisticList,
        })
    },
    methods: {
        //校验
        bulrLogisticsNo() {
            //校验物流单号是否可用
            this.request('check_logistics_no', {
                data: {
                    source_order_code: this.$route.params.orderId,
                    logistics_code: this.Form.logistics_code,
                    logistics_no: this.Form.logistics_no
                }
            }, false).then((res) => {
                if (res.code == '1') {
                    this.$Message.success(res.msg)
                } else {
                    this.$Message.error(res.msg)
                }
            })
        },
        //退货原因下拉
        getReason() {
            this.request('get_return_type_list_all', {}, false).then((res) => {
                if (res.code == '1') {
                    this.returnReasonList = res.data
                    console.log(res.data)
                }
            })
        },
        seeBigPic() {
            if (this.file == null) {
                this.$Message.error('暂无图片')
            } else {
                this.visible = true
            }
        },
        //上传图片
        upLoad() {
            this.picterVisible = true
        },
        cancelTag(){
            this.picterVisible = false
            this.file = null
        },
        uploadImg() {
            if (this.file == null) {
                this.$Message.warning('请先上传吊牌图片再导入')
            } else {
                this.AAA = this.imgSrcUpload
                this.picterVisible = false
                this.loadingStatus = true;
                // Vue.prototype.$loading('正在导入数据...');
                this.$refs.upload.post(this.file);
            }
        },
        //上传之前
        handleUpload(file) {
            if (!/\.jpeg$|.jpg$|.JPG$|.JPEG$|.PNG$|.png$/.test(file.name)) {
                this.$Message.warning('文件类型不符,支持格式：JPEG，jpeg，JPG，jpg，PNG，png！请重新选择文件');
                return false
            } else {
                this.file = file //需要传给后台的file文件
                this.Name = file.name
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = () => {
                    const _base64 = reader.result
                    this.imgSrcUpload = _base64 //将_base64赋值给图片的src，实现图片预览
                }
                return false //阻止图片继续上传，使得form表单提交时统一上传
            }
        },
        //上传成功之后
        uploadSuccess(res, file) {
            Vue.prototype.$loading.close();
            if (res.code == '1') {
                this.imgUrl = res.data
                this.loadingStatus = false;
                this.dpFile = null;
                this.$Message.success(res.msg);
                this.picterVisibleDp = false;
                this.imgTagUrl = res.data
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
        changeLogistic(values) {
            this.logisticList.forEach(x => {
                if (x.logisticType == values) {
                    this.Form.logistics_code = x.logistic_code
                }
            })
        },
        //获取订单明细信息
        getStaffSalesOrderDetail(orderId) {
            this.request('StaffSalesOrderDetail', {
                ver: '1',
                ts: Date.parse(new Date()),
                data: {
                    "obj": {
                        "orderId": orderId,
                        "userId": ""
                    },
                    "type": 1
                }
            }, true).then((res) => {
                if (res.code == 1) {
                    this.staffSalesOrder = res.data.stafforder[0];
                    this.totalMoney = 0;
                    this.staffSalesOrder.staffOrderDetailList.map(x => {
                        x.item_counts = 0;
                        x.order_type = '';
                        x.detail_remark = '';
                    })
                }
            })
        },
        submit() {
            console.log(this.file, '098765')
            let userName = JSON.parse(window.sessionStorage.getItem('userinfo')).userName;
            this.$refs['Form'].validate((valid) => {
                if (valid) {
                    let Data = Util.deepClone(this.staffSalesOrder.staffOrderDetailList);
                    let File = this.imgUrl
                    console.log(File, '9876543234568')
                    Data = Data.filter(x => {
                        return !!x.order_type && x.item_counts > 0
                    }).map(y => {
                        return {
                            img_url: File,
                            commodity_code: y.commodityCode,
                            detail_remark: y.detail_remark,
                            item_counts: y.item_counts,
                            price: y.price,
                            order_type: y.order_type,
                            source_return_code: this.$route.params.orderId,
                            detail_id: y.orderDetailId,
                            create_user: JSON.parse(window.sessionStorage.getItem('userinfo')).userName
                        }
                    })
                    Data.map(x => {
                        for (let y in this.Form) {
                            x[y] = this.Form[y]
                        }
                    })

                    if (Data.length < 1) {
                        console.log(Data)
                        this.$Message.warning('请核对信息后再提交！');
                        return false;
                    }
                    // if(this.file == null){
                    //     this.$Message.warning('请上传图片再提交！');
                    //     return false;
                    // }

                    this.request('add_return_order', {
                        data: {
                            list: Data,
                        }
                    }, true).then(res => {
                        if (res.code == 1) {
                            this.$Message.success(res.msg);
                            setTimeout(() => {
                                this.imgUrl = null
                                this.file = null
                                let type = this.$route.params.orderId;
                                type = type.substring(0, 2);
                                if (type == 'NG') {
                                    this.$root.eventHub.$emit('closePageFromOtherPage', 'staffsalesorder_return'); //关闭新增页面
                                    this.$router.push({
                                        name: 'staffsalesorder_list'
                                    }); //跳转至列表页面
                                } else {
                                    this.$root.eventHub.$emit('closePageFromOtherPage', 'agencysalesorder_return'); //关闭新增页面
                                    this.$router.push({
                                        name: 'agencysalesorder_list'
                                    }); //跳转至列表页面
                                }
                            })
                        }
                    })
                } else {
                    this.$Message.error('请核对表单信息!');
                    return false;
                }
            })
        }
    }
}
</script>
