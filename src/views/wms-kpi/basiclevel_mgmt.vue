<style>
    #basiclevel_mgmt {
 
    }
</style>

<template>
    <div class="background-color-white exhibition" id="basiclevel_mgmt">
        <Row class="margin-bottom-10">
            <Col span="24" class="search">
            <Form :model="formSearch" ref="formSearch" :label-width="90" inline label-position="right">
                <Form-item label="姓名:" :label-width="40">
                    <Input v-model="formSearch.name" placeholder="请输入姓名" style="width: 150px"
                           @keydown.native.enter="search(formSearch)"></Input>
                </Form-item>
                <Form-item label="起始日期:">
                    <DatePicker type="date" v-model="formSearch.start_date" format="yyyy-MM-dd" placeholder="选择开始日期"
                                style="width: 150px"></DatePicker>
                </Form-item> 
                <Form-item label="结束日期:">
                    <DatePicker type="date" v-model="formSearch.end_date" format="yyyy-MM-dd" placeholder="选择开始日期"
                                style="width: 150px"></DatePicker>
                </Form-item>
                <Form-item label="仓库:" :label-width="50">
                    <Select v-model="formSearch.warehouse_code" style="width:150px">
                        <Option v-for="item in formSearch_warehouse" :value="item.warehouse_code"
                                :key="item.warehouse_code">{{
                            item.warehouse_name }}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item :label-width="1">
                    <Button type="primary" @click="search(formSearch)" icon="ios-search">搜索</Button>
                    <Button type="default" @click="handleReset(formSearch)">重置</Button>
                </Form-item>
            </Form>
            </Col>
        </Row>
        <Row class="margin-bottom-10">
            <Button type="primary" icon="md-add" @click="openDialog('新增')">新增</Button>
            <Button type="primary" icon="arrow-down-a" @click="downTemplate()">
                下载模板
            </Button>
            <Button type="primary" icon="arrow-up-a" @click="importDialog">
                批量导入
            </Button>
        </Row>
        <Row class="margin-bottom-10">
            <Table :columns="basiclevel_report_columns" size="small" :data="basiclevel_report_data" border></Table>
        </Row>
        <Row>
            <Page :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator
                  @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
        </Row>
        <Modal v-model="add_dialog_visible" :mask-closable="false" :title="dialog_title" :width="900"
               class-name="customize-modal-center" v-if="dialog_title == '新增'">
            <Row>
                <Col>
                <Form :model="addForm" ref="addForm" :label-width="80" inline label-position="right">
                    <Form-item label="仓库:" :label-width="50">
                        <Select v-model="addForm.warehouse_code" size="small" style="width:150px">
                            <Option v-for="item in warehouse" :value="item.warehouse_code" :key="item.warehouse_code">
                                {{item.warehouse_name }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="考核日期:" :label-width="80">
                        <DatePicker type="date" size='small' v-model="addForm.date" :options="pickerOptions" format="yyyy-MM-dd"
                                    placeholder="选择开始日期"
                                    style="width: 150px"></DatePicker>
                    </Form-item>
                </Form>
                </Col>
                <Col class="margin-bottom-10">
                <Button type="primary" @click="add" size='small'>新增明细</Button>
                <Button type="error" @click="del" size='small'>删除明细</Button>
                </Col>
                <Col>
                <Table :columns="submitData_columns" size="small" :data="submit_data"
                       @on-select="select_submitData"></Table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary" @click="add_manual">保存</Button>
                <Button type="default" @click="add_dialog_visible = false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="edit_dialog_visible" :mask-closable="false" :title="dialog_title" :width="750"
               class-name="customize-modal-center" v-if="dialog_title == '编辑'">
            <Row>
                <Form :model="edit_submit_data" ref="editForm" :label-width="90" inline label-position="right"
                      :rules="ruleValidate">
                    <Col span="12">
                    <Form-item label="仓库:" prop="warehouse_code">
                        <Select v-model="edit_submit_data.warehouse_code" style="width:150px">
                            <Option v-for="item in warehouse" :value="item.warehouse_code" :key="item.warehouse_code">
                                {{item.warehouse_name }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="姓名:" prop="name">
                        <Input v-model="edit_submit_data.name" placeholder="Enter your name..."
                               style="width: 150px"></Input>
                    </Form-item>
                    <Form-item label="培训小时:">
                        <Input v-model.number="edit_submit_data.training_hours" style="width: 150px"></Input>
                    </Form-item>
                    <Form-item label="异常:">
                        <Input v-model.number="edit_submit_data.unusual" style="width: 150px"></Input>
                    </Form-item>
                    <Form-item label="烫衣服:">
                        <Input v-model="edit_submit_data.iron_clothes" style="width: 150px"></Input>
                    </Form-item>
                    <Form-item label="唯品会交接:">
                        <Input v-model="edit_submit_data.vip_commit" style="width: 150px"></Input>
                    </Form-item>
                    <Form-item label="包装下料:">
                        <Input v-model="edit_submit_data.pick_baiting" style="width: 150px"></Input>
                    </Form-item>
                    <Form-item label="惩罚:">
                        <Input v-model="edit_submit_data.punishment" style="width: 150px"></Input>
                    </Form-item>
                    </Col>
                    <Col span="12">
                    <Form-item label="考核日期:" prop="date">
                        <DatePicker type="date" v-model="edit_submit_data.day_time" :options="pickerOptions"
                                    format="yyyy-MM-dd" placeholder="选择开始日期"
                                    style="width: 150px"></DatePicker>
                    </Form-item>
                    <!-- <Form-item label="上班小时数:" prop="work_hours">
                        <Input v-model.number="edit_submit_data.work_hours" style="width: 150px"></Input>
                    </Form-item> -->
                    <Form-item label="盘点小时:">
                        <Input v-model.number="edit_submit_data.check_hours" style="width: 150px"></Input>
                    </Form-item>
                    <Form-item label="大货交接:">
                        <Input v-model="edit_submit_data.big_commit" style="width: 150px"></Input>
                    </Form-item>
                    <Form-item label="唯品会封箱:">
                        <Input v-model="edit_submit_data.vip_close" style="width: 150px"></Input>
                    </Form-item>
                    <Form-item label="唯品会接货:">
                        <Input v-model="edit_submit_data.vip_receive" style="width: 150px"></Input>
                    </Form-item>
                    <Form-item label="奖励:">
                        <Input v-model="edit_submit_data.reward" style="width: 150px"></Input>
                    </Form-item>
                    <Form-item label="其他绩效:">
                        <Input v-model="edit_submit_data.other" style="width: 150px"></Input>
                    </Form-item>
                    </Col>
                </Form>
            </Row>
            <div slot="footer">
                <Button type="primary" @click="edit_manual">保存</Button>
                <Button type="default" @click="close_modal">取消</Button>
            </div>
        </Modal>

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
                        action="/eop/kpi/lst/import_base_kpi"
                        :data="{userId:userInfo.userAccount}"
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
                <Button type="primary" @click="importSave">导入</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Util from 'libs/util'
    import base from 'libs/base'

    function formSearch() {
        return {
            name: '',
            end_date: '',
            start_date: '',
            warehouse_code: ''
        }
    }

    function addForm() {
        return {
            warehouse_code: '',
            date: ''
        }
    }

    function addRow() {
        return {
            big_commit: 0,      //大货交接
            create_user: '',    //录入人
            iron_clothes: 0,    //烫衣服
            name: '',           //姓名
            other: 0,           //其他绩效
            pick_baiting: 0,    //包装下料
            punishment: 0,      //惩罚
            reward: 0,          //奖励
            user_code: '',      //人员编码
            vip_close: 0,       //唯品会封箱
            vip_commit: 0,      //唯品会交接
            vip_receive: 0,     //唯品会接货
            // work_hours: '',     //上班小时数
            training_hours:0,   //培训小时
            check_hours:0,      //盘点小时
            unusual:0,          //异常
        }
    }

    export default {
        name: "basiclevel_mgmt",
        data() { 
            return {
                formSearch: formSearch(),
                addForm: addForm(),
                addRow: addRow(),
                warehouse: [],
                formSearch_warehouse: [],
                basiclevel_report_data: [],
                basiclevel_report_columns: [
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        width: 80,
                        fixed: 'left'
                    },
                    {
                        title: '仓库',
                        key: 'warehouse_code',
                        align: 'center',
                        width: 80,
                        fixed: 'left',
                        render: (h, params) => {
                            return h('span', params.row.warehouse_code == 'XSYLC' ? '宇隆仓' : '瓜沥仓')
                        }
                    },
                    {
                        title: '考核日期',
                        key: 'day_time',
                        align: 'center',
                        minWidth: 100,
                        fixed: 'left'
                    },
                    {
                        title: '用户编码',
                        key: 'user_code',
                        align: 'center',
                        minWidth: 100,
                        fixed: 'left'
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center',
                        minWidth: 100,
                        fixed: 'left'
                    },
                    // {
                    //     title: '上班小时数',
                    //     key: 'work_hours',
                    //     align: 'center',
                    //     minWidth: 100,
                    //     fixed: 'left'
                    // },
                    {
                        title: '培训小时',
                        key: 'training_hours',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '盘点小时',
                        key: 'check_hours',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '异常',
                        key: 'unusual',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '大货交接',
                        key: 'big_commit',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '烫衣服',
                        key: 'iron_clothes',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '唯品会封箱',
                        key: 'vip_close',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '唯品会交接',
                        key: 'vip_commit',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '唯品会接货',
                        key: 'vip_receive',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '包装下料',
                        key: 'pick_baiting',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '奖励',
                        key: 'reward',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '惩罚',
                        key: 'punishment',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '其他绩效',
                        key: 'other',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '创建日期',
                        key: 'day_time',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '创建人',
                        key: 'create_user',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '操作',
                        key: 'check_by',
                        align: 'center',
                        width: 140,
                        fixed: 'right',
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
                                            this.openDialog('编辑', params);
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
                                            this.delete_manual(params);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    },
                ],
                add_dialog_visible: false,
                edit_dialog_visible: false,
                dialog_title: '',
                submit_data: [],
                submitData_columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        width: 100,
                        align: "center",
                        render: (h, params) => {
                            return h('Input', {
                                props: {
                                    value: this.submit_data[params.index].name,
                                    type: 'text',
                                    size:'small'
                                },
                                on: {
                                    'on-blur': (event) => {
                                        if(!this.addForm.warehouse_code){
                                            this.$Message.warning('请先选择仓库！');
                                            this.$set(this.submit_data[params.index],'name','')
                                            return;
                                        }
                                        if(event.target.value){
                                            this.request('select_user_code',{
                                                data:{
                                                    name:event.target.value,
                                                    warehouse_code:this.addForm.warehouse_code
                                                }
                                            }).then(res=>{
                                                if(res.code == 1){
                                                    this.$set(this.submit_data[params.index],'user_code',res.data.user_code)
                                                }
                                            })
                                        }

                                        this.submit_data[params.index].name = event.target.value;
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '用户编码',
                        key: 'user_code',
                        width: 150,
                        align: "center"
                    },
                    // {
                    //     title: '上班小时数',
                    //     key: 'work_hours',
                    //     width: 100,
                    //     align: "center",
                    //     render: (h, params) => {
                    //         return h('Input', {
                    //             props: {
                    //                 value: this.submit_data[params.index].work_hours,
                    //                 type: 'text',
                    //                 size:'small'
                    //             },
                    //             on: {
                    //                 'on-blur': (event) => {
                    //                     this.submit_data[params.index].work_hours = event.target.value;
                    //                 }
                    //             }
                    //         })
                    //     }
                    // },
                    {
                        title: '培训小时',
                        key: 'training_hours',
                        width: 100,
                        align: "center",
                        render: (h, params) => {
                            return h('Input', {
                                props: {
                                    value: this.submit_data[params.index].training_hours,
                                    type: 'text',
                                    size:'small'
                                },
                                on: {
                                    'on-blur': (event) => {
                                        this.submit_data[params.index].training_hours = event.target.value;
                                    },
                                    'on-focus': (event) => {
                                        this.focus(event)
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '盘点小时',
                        key: 'check_hours',
                        width: 100,
                        align: "center",
                        render: (h, params) => {
                            return h('Input', {
                                props: {
                                    value: this.submit_data[params.index].check_hours,
                                    type: 'text',
                                    size:'small'
                                },
                                on: {
                                    'on-blur': (event) => {
                                        this.submit_data[params.index].check_hours = event.target.value;
                                    },
                                    'on-focus': (event) => {
                                        this.focus(event)
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '异常',
                        key: 'unusual',
                        width: 100,
                        align: "center",
                        render: (h, params) => {
                            return h('Input', {
                                props: {
                                    value: this.submit_data[params.index].unusual,
                                    type: 'text',
                                    size:'small'
                                },
                                on: {
                                    'on-blur': (event) => {
                                        this.submit_data[params.index].unusual = event.target.value;
                                    },
                                    'on-focus': (event) => {
                                        this.focus(event)
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '大货交接',
                        key: 'big_commit',
                        width: 100,
                        align: "center",
                        render: (h, params) => {
                            return h('Input', {
                                props: {
                                    value: this.submit_data[params.index].big_commit,
                                    type: 'text',
                                    size:'small'
                                },
                                on: {
                                    'on-blur': (event) => {
                                        this.submit_data[params.index].big_commit = Number(event.target.value);
                                    },
                                    'on-focus': (event) => {
                                        this.focus(event)
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '烫衣服',
                        key: 'iron_clothes',
                        width: 100,
                        align: "center",
                        render: (h, params) => {
                            return h('Input', {
                                props: {
                                    value: this.submit_data[params.index].iron_clothes,
                                    type: 'text',
                                    size:'small'
                                },
                                on: {
                                    'on-blur': (event) => {
                                        this.submit_data[params.index].iron_clothes = Number(event.target.value);
                                    },
                                    'on-focus': (event) => {
                                        this.focus(event)
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '唯品会封箱',
                        key: 'vip_close',
                        width: 100,
                        align: "center",
                        render: (h, params) => {
                            return h('Input', {
                                props: {
                                    value: this.submit_data[params.index].vip_close,
                                    type: 'text',
                                    size:'small'
                                },
                                on: {
                                    'on-blur': (event) => {
                                        this.submit_data[params.index].vip_close = Number(event.target.value);
                                    },
                                    'on-focus': (event) => {
                                        this.focus(event)
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '唯品会交接',
                        key: 'vip_commit',
                        width: 100,
                        align: "center",
                        render: (h, params) => {
                            return h('Input', {
                                props: {
                                    value: this.submit_data[params.index].vip_commit,
                                    type: 'text',
                                    size:'small'
                                },
                                on: {
                                    'on-blur': (event) => {
                                        this.submit_data[params.index].vip_commit = Number(event.target.value);
                                    },
                                    'on-focus': (event) => {
                                        this.focus(event)
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '唯品会接货',
                        key: 'vip_receive',
                        width: 100,
                        align: "center",
                        render: (h, params) => {
                            return h('Input', {
                                props: {
                                    value: this.submit_data[params.index].vip_receive,
                                    type: 'text',
                                    size:'small'
                                },
                                on: {
                                    'on-blur': (event) => {
                                        this.submit_data[params.index].vip_receive = Number(event.target.value);
                                    },
                                    'on-focus': (event) => {
                                        this.focus(event)
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '包装下料',
                        key: 'pick_baiting',
                        width: 100,
                        align: "center",
                        render: (h, params) => {
                            return h('Input', {
                                props: {
                                    value: this.submit_data[params.index].pick_baiting,
                                    type: 'text',
                                    size:'small'
                                },
                                on: {
                                    'on-blur': (event) => {
                                        this.submit_data[params.index].pick_baiting = Number(event.target.value);
                                    },
                                    'on-focus': (event) => {
                                        this.focus(event)
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '奖励',
                        key: 'reward',
                        width: 100,
                        align: "center",
                        render: (h, params) => {
                            return h('Input', {
                                props: {
                                    value: this.submit_data[params.index].reward,
                                    type: 'text',
                                    size:'small'
                                },
                                on: {
                                    'on-blur': (event) => {
                                        this.submit_data[params.index].reward = Number(event.target.value);
                                    },
                                    'on-focus': (event) => {
                                        this.focus(event)
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '惩罚',
                        key: 'punishment',
                        width: 100,
                        align: "center",
                        render: (h, params) => {
                            return h('Input', {
                                props: {
                                    value: this.submit_data[params.index].punishment,
                                    type: 'text',
                                    size:'small'
                                },
                                on: {
                                    'on-blur': (event) => {
                                        this.submit_data[params.index].punishment = Number(event.target.value);
                                    },
                                    'on-focus': (event) => {
                                        this.focus(event)
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '其他绩效',
                        key: 'other',
                        width: 100,
                        align: "center",
                        render: (h, params) => {
                            return h('Input', {
                                props: {
                                    value: this.submit_data[params.index].other,
                                    type: 'text',
                                    size:'small'
                                },
                                on: {
                                    'on-blur': (event) => {
                                        this.submit_data[params.index].other = Number(event.target.value);
                                    },
                                    'on-focus': (event) => {
                                        this.focus(event)
                                    }
                                }
                            })
                        }
                    },
                ],
                delIndexs: [],
                edit_submit_data: {},
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6
                    }
                },
                ruleValidate: {
                    name: [
                        {required: true, message: 'The name cannot be empty', trigger: 'blur'}
                    ],
                    day_time: [
                        {required: true, message: 'The name cannot be empty', trigger: 'change'}
                    ],
                    warehouse_code: [
                        {required: true, message: 'The name cannot be empty', trigger: 'blur'}
                    ],
                    // work_hours: [
                    //     {required: true, type: 'number', message: 'The name cannot be empty', trigger: 'blur'}
                    // ]
                },
                page: 1,
                pageSize: 10,
                total: 0,
                importModal: false,
                file: null,
                loadingStatus: false,
                userInfo:{}
            }
        },
        mounted() {
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            this.formSearch_warehouse = base.formSearch_warehouse;
            this.warehouse = base.warehouse;
            let data = this.formSearch;
            data.start_date = Util.dateFormat(new Date(), 'yyyy-MM') + '-01';
            data.end_date = Util.dateFormat(new Date(), 'yyyy-MM-dd');
        },
        activated() {
            this.getData(this.formSearch);
        },
        methods: {
            getData(formSearch) {
                var data = JSON.parse(JSON.stringify(formSearch))
                data.start_date = Util.dateFormat(data.start_date, 'yyyy-MM-dd');
                data.end_date = Util.dateFormat(data.end_date, 'yyyy-MM-dd');
                data = Object.assign(data, {
                    length: this.pageSize,
                    start: this.pageSize * (this.page - 1),
                });
                this.request('list_manual', {
                    data: data
                }, true).then(res => {
                    if (res.code == 1) {
                        this.total = res.data.counts;
                        this.basiclevel_report_data = res.data.listManual;
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.listManual.forEach((item) => {
                            serialNoBegain++;
                            item.serialNo = serialNoBegain;
                        })
                    } else {
                        this.$Message.warning(res.msg);
                    }
                })
            },
            search(formSearch) {
                this.page = 1;
                this.getData(formSearch)
            },
            handleReset() {
                this.formSearch = formSearch();
                this.formSearch.start_date = Util.dateFormat(new Date(), 'yyyy-MM') + '-01';
                this.formSearch.end_date = Util.dateFormat(new Date(), 'yyyy-MM-dd');
                this.search(this.formSearch);
            },
            //下载模板
            downTemplate() {
                window.location = ('/excel/物流基层维护模板.xlsx')
            },
            openDialog(type, params) {
                this.dialog_title = type;
                this.addRow = addRow();
                this.addRow.create_user = this.userInfo.userAccount;
                this.addForm = addForm();
                if (this.dialog_title == '新增') {
                    this.submit_data = [];
                    this.add_dialog_visible = true;
                    this.submit_data.push(this.addRow);
                } else if (this.dialog_title == '编辑') {
                    this.edit_dialog_visible = true;
                    this.edit_submit_data = {};
                    this.edit_submit_data = JSON.parse(JSON.stringify(params.row));
                }
            },
            close_modal() {
                this.edit_dialog_visible = false;
                this.$refs['editForm'].resetFields();
            },
            add() {
                let data = this.submit_data;
                this.addRow = addRow();
                this.addRow.create_user = this.userInfo.userAccount;
                if (data.length <= 0) {
                    data.push(this.addRow);
                    return;
                }
                ;
                if (!data[data.length - 1].name || !data[data.length - 1].user_code ) {
                    this.$Notice.warning({
                        title: '提示',
                        desc: '请填写完当前行在操作!'
                    });
                    return;
                } else {
                    data.push(this.addRow);
                }
            },
            select_submitData(selection, row) {
                let Data = JSON.parse(JSON.stringify(this.submit_data));
                this.delIndexs = [];
                a:
                    for (var i = 0; i < Data.length; i++) {
                        b:
                            for (var j = 0; j < selection.length; j++) {
                                if (JSON.stringify(Data[i]) == JSON.stringify(selection[j])) {
                                    this.delIndexs.push(i)
                                    break b;
                                }
                            }
                    }
            },
            del() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '选中行将会删除，请确认！',
                    onOk: () => {
                        this.delIndexs.sort(function (x, y) {
                            return y - x;
                        })
                        this.delIndexs.forEach(x => {
                            this.submit_data.splice(x, 1);
                        })
                        this.$Notice.success({
                            title: '提示',
                            desc: '已删除!'
                        });
                    },
                    onCancel: () => {
                        this.$Notice.warning({
                            title: '提示',
                            desc: '已取消删除!'
                        });
                    }
                })
            },
            add_manual() {
                let Data = JSON.parse(JSON.stringify(this.submit_data));
                console.log(Data,'00000000000000000000000')
                for (let x in this.addForm) {
                    if (!this.addForm[x]) {
                        this.$Notice.warning({
                            title: '提示',
                            desc: '请填写仓库和考核日期!'
                        });
                        return
                    }
                }
                Data.forEach((x, y) => {
                    console.log(x, y,'9999')
                    if (!x.name || !x.user_code) {
                        Data.splice(y, 1)
                    } else {
                        x.warehouse_code = this.addForm.warehouse_code;
                        x.day_time = Util.dateFormat(this.addForm.date, 'yyyy-MM-dd');
                    }
                })
                if (Data.length == 0) {
                    console.log(Data,'000')
                    this.$Notice.warning({
                        title: '提示',
                        desc: '请填写完整再提交!'
                    });
                    return
                }
                this.request('add_manual', {
                    data: {
                        list: Data
                    }
                }, true).then(res => {
                    if (res.code == 1) {
                        this.$Message.success(res.msg);
                        this.add_dialog_visible = false;
                        this.search(this.formSearch);
                    }
                })
            },
            edit_manual() {
                this.$refs['editForm'].validate((valid) => {
                    if (valid) {
                        let data = JSON.parse(JSON.stringify(this.edit_submit_data))
                        delete data.serialNo
                        delete data._index
                        delete data._rowKey
                        data.day_time = Util.dateFormat(data.day_time, 'yyyy-MM-dd');
                        this.request('edit_manual', {
                            data: {
                                obj: data
                            }
                        }, true).then(res => {
                            if (res.code == 1) {
                                this.$Message.success(res.msg);
                                this.edit_dialog_visible = false;
                                this.search(this.formSearch);
                            }
                        })
                    } else {
                        this.$Message.error('请核对表单信息!');
                    }
                })
            },
            delete_manual(params) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '该行将会删除，请确认！',
                    onOk: () => {
                        this.request('delete_manual', {
                            data: {
                                id: params.row.id,
                                user_name: this.userInfo.userName
                            }
                        }, true).then(res => {
                            if (res.code == 1) {
                                this.$Message.success(res.msg);
                                if (this.basiclevel_report_data.length <= 1) {
                                    this.page = this.page - 1;
                                }
                                this.search(this.formSearch)
                            }
                        })
                    },
                    onCancel: () => {
                        this.$Message.warning('已取消删除!');
                    }
                })
            },
            focus(event) {
                event.currentTarget.select();
            },
            importDialog() {
                this.file = null;
                this.$refs.upload.clearFiles();
                this.importModal = true;
            },
            cancel() {
                this.importModal = false;
            },
            importSave() {
                this.loadingStatus = true;
                this.$refs.upload.post(this.file);
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
                if (res.code == 1) {
                    this.loadingStatus = false;
                    this.$Message.success(res.msg);
                    this.importModal = false;
                    this.search(this.formSearch);
                } else {
                    this.loadingStatus = false;
                    this.$Message.error(res.msg);
                }
            },
            uploadError(res, file) {
                this.$Message.error(res.msg);
            },
            SizeChange(val) {
                this.pageSize = val;
                this.getData(this.formSearch)
            },
            CurrentChange(val) {
                this.page = val;
                this.getData(this.formSearch)
            },
        }
    }
</script>

