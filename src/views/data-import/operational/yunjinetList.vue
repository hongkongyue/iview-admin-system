<template>
    <div class="background-color-white exhibition" id="yunjinetList">
        <Row class="margin-bottom-10">
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Col>

                <Form-item label="活动类别：" :label-width='80'>
                    <Select v-model="formSearch.salesType" style="width:150px" size="small">
                        <Option v-for="item in salesTypeList" :value="item.name" :key="item.value">{{ item.name }}
                        </Option>
                    </Select>
                </Form-item>
              
                <Form-item label="活动日期：" :label-width="80">
                    <DatePicker
                            type="datetime"
                            format="yyyy-MM-dd HH:mm"
                            placeholder="起始时间"
                            style="width: 170px"
                            v-model="formSearch.startTime"
                            size="small"
                    >
                    </DatePicker>
                </Form-item>
                <span style="display: inline-block;line-height: 32px;height:32px;margin-right: 10px">
                        -
                    </span>
                <Form-item label="" :label-width="1">
                    <DatePicker
                            type="datetime"
                            placeholder="截止时间"
                            format="yyyy-MM-dd HH:mm"
                            style="width: 170px"
                            v-model="formSearch.endTime"
                            size="small"
                    >
                    </DatePicker>
                </Form-item>
                <Form-item label="品牌：" :label-width='60'>
                    <Select v-model="formSearch.brandId" style="width:150px" size="small">
                        <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                        </Option>
                    </Select>
                </Form-item>
                </Col>
                <Col>
                <Form-item label="商品条码：" :label-width='80'>
                    <Input v-model="formSearch.commodityCode" style="width:150px" size="small"
                           placeholder="输入商品条码"></Input>
                </Form-item>
                <Form-item label="款号：" :label-width='55'>
                    <Input v-model="formSearch.sectionNo" style="width:150px" size="small" placeholder="输入款号"></Input>
                </Form-item>
                <Form-item :label-width="10">
                    <Button type="primary" icon="ios-search" size="small" @click="search">查询</Button>
                    <Button type="warning" size="small" @click="reset">重置</Button>
                    <Button type="error" size="small" @click="del">删除</Button>                    
                </Form-item>
                </Col>
            </Form>
        </Row>
        <Row>
            <Col>
            <Button type="primary" size="small" @click="downTemplate">下载模板</Button>
            <Button type="primary" size="small" @click="openModal">导入</Button>
            <!-- <Button type="warning" @click="editData">确认修改</Button> -->
            </Col>
        </Row>
        <Row class-name="margin-top-10">
            <Col>
            <Table
                    ref="importDataTable"
                    size="small"
                    :loading="loading"
                    :columns="columns"
                    :data="list"
                    :height="TableHeight"
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
                            action="/eop/oms/yunji/import_yunji_sales"
                            :data="{userAccount:userInfo.userAccount}"
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
    import Vue from 'vue';
    import {mapState} from 'vuex'
    import Util from 'libs/util';

    function formSearch() {
        return {
            startTime: '',           //起始时间
            endTime: '',             //截止时间
            brandId: '',             //品牌ID
            commodityCode: '',       //商品条码
            sectionNo: '',           //款号
        }
    }

    let renderHeader = Vue.extend({
        props: ['params'],
        data() {
            return {
                checked: false,
            }
        },
        template: `
        <div >
            <Checkbox v-model="checked" @on-change="change"></Checkbox>
        </div>
    `,
        mounted() {

        },
        methods: {
            change(val) {
                this.$root.eventHub.$emit('AllChecked', val);
            }
        }
    })

    let render = Vue.extend({
        props: ['params'],
        data() {
            return {}
        },
        template: `
        <div >
            <Checkbox v-model="params.row.checked" @on-change="change"></Checkbox>
        </div>
    `,
        mounted() {

        },
        methods: {
            change(val) {
                this.$root.eventHub.$emit('singleChecked', this.params.row);
            }
        }
    })
    export default {
        name: "yunjinetList",
        data() {
            return {
                formSearch: formSearch(),
                loading: false,      //表格数据加载开关
                columns: [
                    // {
                    //     width: 60,
                    //     align: 'center',
                    //     renderHeader: (h, params) => {
                    //         return h(Util.deepClone(renderHeader), {
                    //             props: {
                    //                 params: params
                    //             }
                    //         })
                    //     },
                    //     render: (h, params) => {
                    //         return h(Util.deepClone(render), {
                    //             props: {
                    //                 params: params
                    //             }
                    //         })
                    //     }
                    // },
                    {
                        title: '序号',
                        key: 'serialNo',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '活动类别',
                        key: 'salesType',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        width: 120
                    },
                    // {
                    //     title: '年份/季节',
                    //     key: 'season',
                    //     align: 'center',
                    //     width: 120,
                    //     render: (h, params) => {
                    //         if (this.checkedIndex.indexOf(params.index) != -1) {
                    //             return h('Input', {
                    //                 props: {
                    //                     type: 'text',
                    //                     value: this.list[params.index].season,
                    //                     size: 'small'
                    //                 },
                    //                 on: {
                    //                     'on-blur': (event) => {
                    //                         this.list[params.index].season = event.target.value;
                    //                         this.setChecked();
                    //                     }
                    //                 }
                    //             })
                    //         } else {
                    //             return h('span', params.row.season)
                    //         }
                    //     }
                    // },
                    {
                        title: '商品条码',
                        key: 'commodityCode',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            if (this.checkedIndex.indexOf(params.index) != -1) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].commodityCode,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].commodityCode = event.target.value;
                                            this.setChecked();
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.commodityCode)
                            }
                        }
                    },
                    // {
                    //     title: '材质/成分',
                    //     key: 'component',
                    //     align: 'center',
                    //     width: 100,
                    //     render: (h, params) => {
                    //         if (this.checkedIndex.indexOf(params.index) != -1) {
                    //             return h('Input', {
                    //                 props: {
                    //                     type: 'text',
                    //                     value: this.list[params.index].component,
                    //                     size: 'small'
                    //                 },
                    //                 on: {
                    //                     'on-blur': (event) => {
                    //                         this.list[params.index].component = event.target.value;
                    //                         this.setChecked();
                    //                     }
                    //                 }
                    //             })
                    //         } else {
                    //             return h('span', params.row.component)
                    //         }
                    //     }
                    // },
                    // {
                    //     title: '规格',
                    //     key: 'norms',
                    //     align: 'center',
                    //     width: 150,
                    //     render: (h, params) => {
                    //         if (this.checkedIndex.indexOf(params.index) != -1) {
                    //             return h('Input', {
                    //                 props: {
                    //                     type: 'text',
                    //                     value: this.list[params.index].norms,
                    //                     size: 'small'
                    //                 },
                    //                 on: {
                    //                     'on-blur': (event) => {
                    //                         this.list[params.index].norms = event.target.value;
                    //                         this.setChecked();
                    //                     }
                    //                 }
                    //             })
                    //         } else {
                    //             return h('span', params.row.norms)
                    //         }
                    //     }
                    // },
                    {
                        title: '供货价',
                        key: 'supplyPrice',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            if (this.checkedIndex.indexOf(params.index) != -1) {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.list[params.index].supplyPrice,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.list[params.index].supplyPrice = event.target.value;
                                            this.setChecked();
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.supplyPrice)
                            }
                        }
                    },
                    // {
                    //     title: '活动价',
                    //     key: 'salesPrice',
                    //     align: 'center',
                    //     width: 100,
                    //     render: (h, params) => {
                    //         if (this.checkedIndex.indexOf(params.index) != -1) {
                    //             return h('Input', {
                    //                 props: {
                    //                     type: 'text',
                    //                     value: this.list[params.index].salesPrice,
                    //                     size: 'small'
                    //                 },
                    //                 on: {
                    //                     'on-blur': (event) => {
                    //                         this.list[params.index].salesPrice = event.target.value;
                    //                         this.setChecked();
                    //                     }
                    //                 }
                    //             })
                    //         } else {
                    //             return h('span', params.row.salesPrice)
                    //         }
                    //     }
                    // },
                    {
                        title: '活动起始日期',
                        key: 'startTime',
                        align: 'center',
                        width: 200,
                        render: (h, params) => {
                            if (this.checkedIndex.indexOf(params.index) != -1) {
                                return h('DatePicker', {
                                    props: {
                                        type: 'datetime',
                                        format: "yyyy-MM-dd HH:mm",
                                        value: this.list[params.index].startTime,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-change': (value) => {
                                            // let hour = Util.dateFormat(value,'hh');
                                            // let minute = Util.dateFormat(value,'mm');
                                            // if(hour != '00' && minute != '00'){
                                            this.list[params.index].startTime = value;
                                            this.setChecked();
                                            // }
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.startTime)
                            }
                        }
                    },
                    {
                        title: '活动截止日期',
                        key: 'endTime',
                        align: 'center',
                        width: 200,
                        render: (h, params) => {
                            if (this.checkedIndex.indexOf(params.index) != -1) {
                                return h('DatePicker', {
                                    props: {
                                        type: 'datetime',
                                        format: "yyyy-MM-dd HH:mm",
                                        value: this.list[params.index].endTime,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-change': (value) => {
                                            // let hour = Util.dateFormat(value,'hh');
                                            // let minute = Util.dateFormat(value,'mm');
                                            // if(hour != '00' && minute != '00'){
                                            this.list[params.index].endTime = value;
                                            this.setChecked();
                                            // }
                                        }
                                    }
                                })
                            } else {
                                return h('span', params.row.endTime)
                            }
                        }
                    },
                    {
                        title: '导入人',
                        key: 'createUser',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '导入日期',
                        key: 'created',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '修改人',
                        key: 'lastUpdateUser',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '修改时间',
                        key: 'lastUpdated',
                        align: 'center',
                        width: 150
                    }
                ],
                list: [],
                importModal: false,
                loadingStatus: false,
                file: null,
                page: 1,
                pageSize: 500,
                total: 0,
                checkedIndex: [],
                userInfo: {},
                TableHeight:0,
                is_click_search_method:false,
                salesTypeList:[
                    {
                        name:'云集',
                        value:'YJ'
                    },
                    {
                        name:'好衣库',
                        value:'HYK'
                    },
                     {
                        name:'爱库存',
                        value:'AKC'
                    },{
                        name:'小小包',
                        value:'XXB'
                    },{
                        name:'头号买手',
                        value:'THMS'
                    },{
                        name:'达令家',
                        value:'DLJ'
                    },{
                        name:'宝贝仓',
                        value:'BBC'
                    },{
                        name:'网易考拉',
                        value:'YYKL'
                    }
                ]
            }
        },
        computed: {
            ...mapState({
                brandList: state => state.common.brandList
            })
        },
        activated() {
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            this.$root.eventHub.$on('singleChecked', (row) => {
                if (row.checked) {
                    this.list.map((x, y) => {
                        if (x.id == row.id) {
                            if (this.checkedIndex.indexOf(y) == -1) {
                                this.checkedIndex.push(y);
                            }
                        }
                    })
                } else {
                    this.list.map((x, y) => {
                        if (x.id == row.id) {
                            let index = this.checkedIndex.indexOf(y);
                            if (index != -1) {
                                this.checkedIndex.splice(index, 1);
                            }
                        }
                    })
                }
            });
            this.$root.eventHub.$on('AllChecked', (val) => {
                if (val) {
                    this.list.map((x, y) => {
                        this.$set(this.list[y], 'checked', true);
                        let index = this.checkedIndex.indexOf(y);
                        if (index == -1) {
                            this.checkedIndex.push(y, 1);
                        }
                    })
                } else {
                    this.checkedIndex = [];
                    this.list.map((x, y) => {
                        this.$set(this.list[y], 'checked', false);
                    })
                }

            });
        },
        mounted() {
            this.getBrandList();
            // this.search();
            this.$nextTick(() => {
                this.TableHeight = window.innerHeight - 325;
            })
            window.onresize = function temp() {
                this.TableHeight = window.innerHeight - 325;
            };
        },
        watch:{
            'formSearch':{
                handler(newVal,oldVal){
                    this.is_click_search_method = false;
                },
                deep:true
            }
        },
        methods: {
            getBrandList() {
                this.$store.dispatch('getBrandList', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    data: {}
                })
            },
            search() {
                this.page = 1;
                this.getData();
                this.checkedIndex = [];
                this.list.map((x, y) => {
                    this.$set(this.list[y], 'checked', false);
                })
            },
            reset() {
                this.formSearch = formSearch();
                this.search();
            },
            setChecked() {
                this.checkedIndex.map(x => {
                    this.$set(this.list[x], 'checked', true);
                })
            },
            getData() {
                let data = Util.deepClone(this.formSearch);
                data.startTime = !!data.startTime ? Util.dateFormat(data.startTime, 'yyyy-MM-dd hh:mm') : '';
                data.endTime = !!data.endTime ? Util.dateFormat(data.endTime, 'yyyy-MM-dd hh:mm') : '';
                
                data = Object.assign(data, {
                    length: this.pageSize,
                    start: this.pageSize * (this.page - 1),
                });
                this.request('select_yunji_sales', {
                    data: data
                }, true).then(res => {
                    if (res.code == 1) {
                        this.is_click_search_method = true;                        
                        let serialNoBegain = this.pageSize * (this.page - 1);
                        res.data.yunjiSalesList.map(x => {
                            serialNoBegain++;
                            x.serialNo = serialNoBegain;
                        })
                        this.list = res.data.yunjiSalesList;
                        this.total = res.data.salesCount;
                        if (this.checkedIndex.length > 0) {
                            this.list.map((x, y) => {
                                let index = this.checkedIndex.indexOf(y);
                                if (index != -1) {
                                    this.$set(this.list[index], 'checked', true);
                                }
                            })
                        }
                    }
                })
            },
            openModal() {
                // if (!this.formSearch.startDate || !this.formSearch.endDate) {
                //     this.$Message.warning('请先选择起始或截止时间！');
                // } else if (!this.formSearch.brandId) {
                //     this.$Message.warning('请先选择品牌！');
                // } else {
                //     this.importModal = true;
                // }
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
            editData() {
                let list = Util.deepClone(this.list);
                let data = [];
                this.checkedIndex.map(x => {
                    data.push(list[x]);
                })
                data.map(x => {
                    delete x.serialNo;
                    delete x.checked;
                })
                if (data.length == 0) {
                    this.$Message.warning('请修改后再操作！');
                    return;
                }
                this.request('edit_sales', {
                    data: {
                        list: data
                    }
                }).then(res => {
                    if (res.code == 1) {
                        this.$Message.success(res.msg);
                        this.search();
                    }
                })
            },
            cancel() {
                this.importModal = false;
                this.file = null;
            },
            SizeChange(val) {
                this.pageSize = val;
                this.getData();
            },
            CurrentChange(val) {
                this.checkedIndex = [];
                this.list.map((x, y) => {
                    this.$set(this.list[y], 'checked', false);
                });
                this.page = val;
                this.$nextTick(() => {
                    this.getData();
                })
            },
            del(){
                let data = Util.deepClone(this.formSearch);
                if(this.list.length <= 0){
                    this.$Message.warning('请查询后删除！');                
                    return false; 
                }
                if(!this.is_click_search_method){
                    this.$Message.warning('请查询后删除！');                
                    return false;
                }
                this.$Modal.confirm({
                    title: '提示',
                    content: '将会根据查询条件删除，请确认！',
                    onOk: () => {
                        this.request('delete_yunji_sales',data,true).then(res=>{
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
            /**
             * 下载模板
             */
            downTemplate(){
            　　　window.location = ('/excel/平台供货价导入模板.xlsx')
　　　　　　　　　　this.$Message.info('下载模板成功')
            }
        }
    }
</script>

<style>
    #yunjinetList .ivu-form-item {
        margin-bottom: 5px;
    }
</style>