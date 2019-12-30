<template>
<div>
    <Row class="margin-bottom-10 background-color-white exhibition">
        <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline label-position="right" style="100px">
            <Col span="24">
            <Form-item label="品牌:" :label-width="50" style="padding-left:20px">
                <Select v-model="formSearch.brandId" style="width:120px">
                    <Option v-for="item in brandList" :value="item.brandId" :key="item.brandId">{{item.brandName}}</Option>
                </Select>
            </Form-item>
            <Form-item label="季节:">
                <Select v-model="formSearch.season" style="width:120px" :multiple="true">
                    <Option v-for="item in seasonList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
            </Form-item>
            <Form-item label="年份:">
                <Col span="12">
                <DatePicker type="year" v-model="formSearch.years" format="yyyy年" placeholder="请选择年份" style="width: 120px" :multiple="true"></DatePicker>
                </Col>
            </Form-item>
            <Form-item label="波段:">
                　<Select v-model="formSearch.wave" style="width:120px" :multiple="true">
                    <Option v-for="item in waveList" :value="item.WAVE_BAND" :key="item.WAVE_BAND">
                        {{item.WAVE_BAND}}
                    </Option>
                </Select>
            </Form-item>
            <Form-item label="领取状态:">
                <Select v-model="formSearch.status" style="width:120px">
                    <Option v-for="item in getStatus" :value="item.value" :key="item.label">
                        {{item.label}}
                    </Option>
                </Select>
            </Form-item>
            <Form-item label="外拍拍摄状态:">
                <Select v-model="formSearch.taskCode" style="width:120px">
                    <Option v-for="item in photoStatus" :value="item.id" :key="item.label">
                        {{ item.label }}
                    </Option>
                </Select>
            </Form-item>
            <Form-item label="静物拍摄状态:">
                <Select v-model="formSearch.taskCodesilent" style="width:120px">
                    <Option v-for="item in silentStatus" :value="item.id" :key="item.label">
                        {{ item.label }}
                    </Option>
                </Select>
            </Form-item>
            <Form-item label="设计师:">
                <Select v-model="formSearch.designerName" style="width:120px" filterable>
                    <Option v-for="item in designerNameData" :value="item.designerName">{{item.designerName}}</Option>
                </Select>
            </Form-item>
            <Form-item label="大货款号:">
                <Input v-model="formSearch.goodsNo" placeholder="大货款号" style="width: 120px" />
            </Form-item>
            <Form-item :label-width="1">
                <Button type="primary" @click="search">查询</Button>
                <Button type="default" @click="handleReset">重置</Button>
                <Button type="primary" @click="addNew">新增</Button>
                <Button v-if="submitArray.length>0&&moreBrand==1" type="primary" @click="getMore('1')">生成外拍任务流</Button>
                <Badge v-if="submitArray.length>0&&moreBrand==1" :count="submitArray.length" overflow-count="999" style="position:absolute;right:290px"></Badge>
                <Button v-if="(submitArray.length==0||submitArray.length>0)&&moreBrand==2" type="default" @click="getMore('2')">生成外拍任务流</Button>
                <Button v-if="submitArray.length==0&&moreBrand==1" type="default" @click="getMore('2')">生成外拍任务流</Button>
                <Button type="primary" @click="getMores('1')">生成静物任务流</Button>
                <Badge v-if="submitArray2.length>0" :count="submitArray2.length" overflow-count="999" style="position:absolute;right:170px"></Badge>
                <!-- <Button v-if="(submitArray2.length==0||submitArray2.length>0)&&moreBrands==2" type="default" @click="getMores('2')">生成静物任务流</Button>
                            <Button v-if="submitArray2.length==0&&moreBrands==1" type="default" @click="getMores('2')">生成静物任务流</Button> -->
                <Button type="default" @click="photoAgain('0')">外拍翻拍</Button>
                <Button type="primary" @click="photoAgain('1')">静物翻拍</Button>
                <Button type="primary" @click="lotofsModify">编辑</Button>
            </Form-item>
            </Col>
            <Col span="24" style="padding-left:20px">

            </Col>
        </Form>
    </Row>
    <!-- 数据列表 -->
    <Row class="background-color-white exhibition">
        <!--  -->
        <!-- <Table  ref="currentRowTable"  @on-row-dblclick="showChakan"	@on-row-click="selectRow" @on-select-cancel="choiceId" @on-select-all-cancel="choiceId"  @on-select="choiceId" @on-select-all="choiceId"	:columns="columns" size="small" highlight-row :data="list"></Table> -->
        <Table ref="currentRowTable" @on-select-cancel="choiceId" @on-select-all-cancel="choiceId" @on-select="choiceId" @on-select-all="choiceId" :columns="columns" size="small" highlight-row :data="list"></Table>
        <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total :page-size-opts="[10, 50, 100, 200]" show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
    </Row>
    <!-- 新增方式 -->
    <Modal :mask-closable="false" v-model="add_choses" title="新增" :width="600" :styles="mystyle" class-name="customize-modal-center" @on-cancel="groupCancel">
        <Row class="margin-bottom-10 background-color-white exhibition" style="text-align:center">
            <span>请先选择新增方式：</span>
            <RadioGroup v-model="disabledGroup">
                <Radio label="1">批量</Radio>
                <Radio label="0">单款</Radio>
            </RadioGroup>
            <br>
            <Button style="margin-top:20px" v-if="this.disabledGroup == '1'" type="primary" @click="downLoad">下载模板</Button>
        </Row>
        <Row style="text-align:center">
            <div :label-width="1">
                <Button v-if="this.disabledGroup == '1'" type="primary" @click="groupSave">导入</Button>
                <Button v-if="this.disabledGroup == '0'" type="primary" @click="groupSave">确定</Button>
                <Button type="default" @click="groupCancel">取消</Button>
            </div>
        </Row>
        <div slot="footer"></div>
    </Modal>
    <!-- 批量新增 -->
    <Modal :mask-closable="false" v-model="add_lot" title="批量导入" :width="600" :styles="mystyle" class-name="customize-modal-center" @on-cancel="lotCancel">
        <div>
            <Upload ref="upload" name="file" :show-upload-list="false" :before-upload="handleUpload" :on-success="uploadSuccess" :on-error="uploadError" type="drag" action="/eop/productlaunch/developPhotoReportManage/importPhotoReport" :data="{file:this.file,userName:this.userInfo.userName}">
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
        <Row style="text-align:center;margin-top:20px">
            <div :label-width="1">
                <Button type="primary" @click="lotSave">确定</Button>
                <Button type="default" @click="lotCancel">取消</Button>
            </div>
        </Row>
        <div slot="footer"></div>
    </Modal>
    <!-- 新增 -->
    <Modal :mask-closable="false" v-model="add_visible" title="新增" :width="710" :styles="mystyle" class-name="customize-modal-center" @on-cancel="quxiao">
        <div>
            <add-component ref="child" :waveList="waveList" :brandList="brandList" :alldealList="alldealList"></add-component>
        </div>
        <div slot="footer"></div>
    </Modal>
    <!-- 生成拍摄报表 -->
    <Modal :mask-closable="false" v-model="edit_visible" title="生成外拍任务流" :width="85" :styles="mystyle" class-name="customize-modal-center">
        <div>
            <give-component ref="giveBrith" :childdata="childdata"></give-component>
        </div>
        <div slot="footer"></div>
    </Modal>
    <!--生成静物任务流-->
    <Modal :mask-closable="false" v-model="silent_visible" title="生成静物任务流" :width="85" :styles="mystyle" class-name="customize-modal-center">
        <div>
            <silent-component ref="giveBrithsecond" :silentData="silentData"></silent-component>
        </div>
        <div slot="footer"></div>
    </Modal>
    <Modal title="查看大图" v-model="visible">
        <img :src="'data:image/png;base64,'+bigUlr" v-if="visible" style="width: 100%">
    </Modal>
    <Modal title="编辑企划跟进人" v-model="edit_planer_visible" @on-ok="confirmSave" on-cancel="getData">
        <Row class="margin-bottom-10 background-color-white exhibition">
            <Form :model="formData" ref="formData" label-width="90" inline label-position="right">
                <Col span="24">
                <Form-item label="企划跟进人:">
                    <Select v-model="plannerOaId" style="width:120px" @on-change="selectNext(plannerOaId)" filterable>
                        <Option v-for="item in alldealList" :value="item.plannerOaId" :key="item.plannerOaId">{{ item.plannerName }}</Option>
                    </Select>
                </Form-item>
                </Col>
            </Form>
        </row>
    </Modal>
    <Modal title="批量编辑企划跟进人" v-model="lots_edit_planer_visible" @on-ok="lotsofconfirmSave" on-cancel="getData">
        <Row class="margin-bottom-10 background-color-white exhibition">
            <Form :model="formData" ref="formData" label-width="90" inline label-position="right">
                <Col span="24">
                <Form-item label="企划跟进人:">
                    <Select v-model="lotsofplannerOaId" style="width:120px" @on-change="selectNexts(lotsofplannerOaId)" filterable>
                        <Option v-for="item in lotsofalldealList" :value="item.plannerOaId" :key="item.plannerOaId">{{ item.plannerName }}</Option>
                    </Select>
                </Form-item>
                </Col>
            </Form>
        </row>
    </Modal>
</div>
</template>

<script>
Array.prototype.distinct = function () {
    var arr = this,
        i,
        j,
        len = arr.length;
    for (i = 0; i < len; i++) {
        for (j = i + 1; j < len; j++) {
            if (arr[i].photoId == arr[j].photoId) {
                arr.splice(j, 1);
                len--;
                j--;
            }
        }
    }
    return arr;
};
import axios from 'axios'
import Util from 'libs/util';
import filters from '../../../filter'
import addComponent from '../addComponent/addphotoList.vue';
import giveComponent from './photodetailList.vue';
import silentComponent from './photodetailsList.vue';

function formSearch() {
    return {
        search: ''
    }
}
export default {
    data() {
        return {
            disabledGroup: '0',
            outside: false,
            silent: false,
            addTransfer: [], //中转要提交的新增加的外拍任务流购物车数组
            addTransferSilent: [], //中转要提交的新增加的静物任务流购物车数组
            lotsofalldealList:[],//批量
            lotsofplannerOaId:[],//批量
            lotsofplannerOaId:'',
            formData: {},
            visible: false,
            plannerOaId: '',
            file: null,
            edit_planer_visible: false,
            lots_edit_planer_visible:false,//批量编辑
            loadingStatus: false,
            mystyle: {
                top: '70px',
            },
            getStatus: [ //四季列表
                {
                    label: '已领取',
                    value: '1'
                },
                {
                    label: '未领取',
                    value: '0'
                },
            ],
            photoStatus: [], //拍摄报表状态
            silentStatus: [],
            childdata: [], //向子组件传递的数据
            silentData: [], //向静物组件传递数据
            moreBrand: 2,
            moreBrands: 2,
            brandList: [], // 初始化品牌列表
            designerNameData: [], //设计师
            deal_visible: false,
            add_visible: false,
            add_choses: false,
            edit_visible: false,
            silent_visible: false, //生成静物任务流
            submitArray: [], //外拍任务流要提交的数组
            submitArray2: [], //静物任务流要提交的数组
            red_packet_table_row_index: -1,
            columns: [{
                    type: 'selection',
                    width: 50,
                    align: 'center',
                    fixed: 'left',
                },
                {
                    title: '序号',
                    type: 'index',
                    align: 'center',
                    minWidth: 60,

                },
                {
                    title: '大货款号',
                    key: 'goodsNo',
                    align: 'center',
                    minWidth: 90,
                },
                {
                    title: '图片',
                    key: 'imgUrl',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        if (params.row.imgUrl) {
                            return h('div', {
                                    style: {
                                        width: '80px',
                                        height: '80px',
                                        textAlign: 'center',
                                        lineHeight: '80px'
                                    },
                                },
                                [h('img', {
                                        style: {
                                            width: 'auto',
                                            height: 'auto',
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'cover'
                                        },
                                        domProps: {
                                            src: this.host + params.row.imgUrl,
                                            src: 'data:image/png;base64,' + params.row.imgUrl,
                                        },
                                        on: {
                                            click: () => {
                                                //   this.bigUlr=params.row.imgUrl
                                                //   this.visible=true;
                                                this.getBigImgUrl(params.row.bigImgUrl)
                                            }
                                        }
                                    }, '')

                                ])
                        } else {
                            return h('div', {
                                    style: {
                                        width: '80px',
                                        height: '80px',
                                        textAlign: 'center',
                                        lineHeight: '80px'
                                    },
                                },
                                [h('img', {
                                        style: {
                                            width: 'auto',
                                            height: 'auto',
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'cover'
                                        },
                                        domProps: {
                                            src: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1562574299&di=846b4c904bd54d3c3821fa5938888c69&src=http://hbimg.b0.upaiyun.com/bdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658',
                                        },
                                    }, '')

                                ])
                        }
                    }
                },
                {
                    title: '颜色',
                    key: 'color',
                    align: 'center',
                    minWidth: 84,
                },
                {
                    title: '领取状态',
                    key: 'collectStarusStr',
                    align: 'center',
                    minWidth: 84,
                },
                {
                    title: '设计师',
                    key: 'designerName',
                    align: 'center',
                    minWidth: 80,
                },
                {
                    title: '企划跟进人',
                    key: 'plannerName',
                    align: 'center',
                    minWidth: 100,
                    // fixed :'right',
                    render: (h, params) => {
                        if ((this.page - 1) * this.pageSize + params.index == this.red_packet_table_row_index) {
                            return h('Select', {
                                    props: {
                                        width: 150,
                                        placeholder: params.row.plannerName
                                    },
                                    style: {
                                        minWidth: '100px',

                                    },
                                    on: {
                                        "on-change": (event) => {
                                            params.row.plannerOaId = event
                                        }
                                    },
                                },
                                this.alldealList.map(function (item) {
                                    return h('Option', {
                                        props: {
                                            value: item.plannerOaId
                                        }
                                    }, item.plannerName)
                                })
                            )
                        } else {
                            return h('span', params.row.plannerName)
                        }
                    }
                },
                {
                    title: '外拍拍摄状态',
                    key: 'taskCode',
                    align: 'center',
                    minWidth: 110,
                    render: (h, params) => {
                        if (params.row.taskCode == 0) {
                            return h('span', {

                            }, '未生成')
                        } else {
                            return h('span', {}, params.row.taskCode)
                        }
                    }
                },
                {
                    title: '外拍拍摄次数',
                    key: 'photoReportTimes',
                    align: 'center',
                    minWidth: 110,
                },
                {
                    title: '静物拍摄状态',
                    key: 'jTaskCode',
                    align: 'center',
                    minWidth: 110,
                    render: (h, params) => {
                        if (params.row.jTaskCode == 0) {
                            return h('span', {

                            }, '未生成')
                        } else {
                            return h('span', {}, params.row.jTaskCode)
                        }
                    }
                },
                {
                    title: '静物拍摄次数',
                    key: 'jPhotoReportTimes',
                    align: 'center',
                    minWidth: 110,
                },
                {
                    title: '品牌',
                    key: 'brandName',
                    align: 'center',
                    minWidth: 106,
                },
                {
                    title: '年份',
                    key: 'years',
                    align: 'center',
                    minWidth: 84,
                },
                {
                    title: '季节',
                    key: 'season',
                    align: 'center',
                    minWidth: 64,
                },
                {
                    title: '波段',
                    key: 'waveBand',
                    align: 'center',
                    minWidth: 84,
                },
                {
                    title: '领取日期',
                    key: 'collectDateStr',
                    align: 'center',
                    minWidth: 120,
                },
                {
                    title: '领取件数',
                    key: 'collectQty',
                    align: 'center',
                    minWidth: 84,
                },
                {
                    title: '延期天数',
                    key: 'delayDays',
                    align: 'center',
                    minWidth: 84,
                },
                {
                    title: '设计款号',
                    key: 'designGoodsNo',
                    align: 'center',
                    minWidth: 84,
                },
                {
                    title: '拍照样应到时间',
                    key: 'photoDateStr',
                    align: 'center',
                    minWidth: 120,
                },
                {
                    title: '大货合同货期',
                    key: 'contractDateStr',
                    align: 'center',
                    minWidth: 120,
                },
                {
                    title: '备注',
                    key: 'remark',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '操作',
                    key: 'lastUpdateUser',
                    align: 'center',
                    minWidth: 150,
                    fixed: 'right',
                    render: (h, params) => {
                        if (params.row.taskCode != 0) {
                            return h('div', [
                                //    h('Button', {
                                //         props: {
                                //             type: 'primary',
                                //             size: 'small'
                                //         },
                                //         on: {
                                //             click: () => {
                                //                     this.photoAgain(params.row.photoId)
                                //             }
                                //         }
                                //     }, '翻拍'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            // this.allDealsList=[]
                                            this.edit_planer_visible = true
                                            this.formData = params.row
                                            // this.plannerOaId=params.row.plannerOaId
                                            // this.red_packet_table_row_index = (this.page - 1) * this.pageSize + params.index;
                                            this.allDealsList(params.row.brandId, params.row.plannerOaId)
                                        }
                                    }
                                }, '编辑'),
                            ]);

                        } else {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            // this.allDealsList=[]
                                            this.edit_planer_visible = true
                                            this.formData = params.row
                                            // this.plannerOaId=params.row.plannerOaId
                                            // this.red_packet_table_row_index = (this.page - 1) * this.pageSize + params.index;
                                            this.allDealsList(params.row.brandId, params.row.plannerOaId)
                                        }
                                    }
                                }, '编辑'),
                            ]);
                        }

                    },
                },
            ],
            questionDescrible: false,
            IDS: [], //批量操作的id
            userInfo: {},
            list: [],
            waveList: [],
            seasonList: [ //四季列表
                {
                    label: '春季',
                    value: '春季'
                },
                {
                    label: '夏季',
                    value: '夏季'
                },
                {
                    label: '秋季',
                    value: '秋季'
                },
                {
                    label: '冬季',
                    value: '冬季'
                },
            ],
            total: 0,
            page: 1,
            pageSize: 10,
            formSearch: {},
            dealformSearch: {},
            backformSearch: {}, //回退数据
            brandList: [], //品牌列表
            modal_visible: false, // 编 
            add_lot: false,
        }
    },
    components: {
        addComponent,
        giveComponent,
        silentComponent
        // editComponent
    },
    mounted() {
        this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
        // this.getData()
        this.getbrandList()
        this.getwaveList()
        // this.allDealsList()
        this.alldealList = []
        this.formSearch.submit = this.userInfo.userId
        this.initPhotoStatus()
        this.initSilentStatus()
        this.getDesignerName()
    },
    activated() {

    },
    methods: {
        check(){
                 
        },
        lotofsModify(){
             if(this.IDS.length==0){
                 this.$Message.error('请选择修改数据')
             }else if(this.IDS.length>1){
                    for (let i = 0; i < this.IDS.length; i++) {
                            for (let j = i + 1; j < this.IDS.length; j++) {
                                if (this.IDS[i].brandName != this.IDS[j].brandName) {
                                     this.$Message.error('所选中包含了多个品牌，不能进行批量编辑')
                                     this.lots_edit_planer_visible=false
                                } else if(this.IDS[i].brandName == this.IDS[j].brandName) {
                                     this.lots_edit_planer_visible=true
                                }
                            }
                        }  
                                    let data = {};
                                        data.brandId = Number(this.IDS[0].brandId)
                                    this.request('productlaunch_developDesignerConfig_plannerListInit', {
                                        data: data
                                    }, false).then((res) => {
                                        if (res.code == 1) {
                                            this.lotsofalldealList = res.data
                                        }
                                    })
            }else if(this.IDS.length==1){
                    this.lots_edit_planer_visible=true 
                                    let data = {};
                                        data.brandId = Number(this.IDS[0].brandId)
                                    this.request('productlaunch_developDesignerConfig_plannerListInit', {
                                        data: data
                                    }, false).then((res) => {
                                        if (res.code == 1) {
                                            this.lotsofalldealList = res.data
                                        }
                                    })
            }
        },
        groupSave() {
            if (this.disabledGroup == '0') {
                this.add_visible = true
                this.add_choses = false
            } else if (this.disabledGroup == '1') {
                this.add_lot = true
                this.add_choses = false
            }
            console.log(this.disabledGroup)
        },
        groupCancel() {
            this.add_choses = false
            this.disabledGroup = '0'
        },
        lotSave() {
            if (this.file == null) {
                this.$Message.warning('请先选择文件再导入！')
            } else {
                console.log(this.file, '657890')
                this.$refs['upload'].post(this.file);
                this.add_lot = false
                this.disabledGroup = '0'
            }
        },
        lotCancel() {
            this.add_lot = false
            this.file = null
            this.disabledGroup = '0'
        },
        //下载模板
        downLoad() {
            window.location = ('/excel/拍摄报表新增导入模板.xlsx');
        },
        upload() {
            if (this.file == null) {
                this.$message.warning('请先选择文件再导入')
            } else {
                console.log('456789')
                this.visible = false
            }
        },
        //上传之前
        handleUpload(file) {
            if (!/\.xlsx$/.test(file.name)) {
                this.$Message.warning('文件类型不符,请重新选择文件');
                return false
            } else {
                this.file = file //需要传给后台的file文件
            }
            return false
        },

        //上传成功之后
        uploadSuccess(res, file) {
            Vue.prototype.$loading.close();
            if (res.code == '1') {
                this.loadingStatus = false;
                this.file = null;
                // this.$Message.success(res.msg);
                this.$Notice.open({
                    title: '导入',
                    desc: res.msg,
                    duration: 10
                });
            } else {
                this.file = null
                this.loadingStatus = false;
                this.$Notice.open({
                    title: '导入',
                    desc: res.msg,
                    duration: 10
                });
            }
        },
        //获取设计师
        getDesignerName() {
            let data = {}
            let List = []
            this.request('selectDesignerInRecords', {
                data
            }, false).then((res) => {
                if (res.code == '1') {
                    List = res.data
                    console.log(List)
                    this.designerNameData = List.filter(item => item !== null)
                    console.log(List.filter(item => item !== null), '-0-00')
                }
            })
        },
        getBigImgUrl(url) {
            let data = {}
            data.bigImgUrl = url
            this.request('productlaunch_getGoodsImg', {
                data
            }, false).then((res) => {
                if (res.code == 1) {
                    this.bigUlr = res.data
                    this.visible = true
                }
            })
        },
        selectNext(plannerOaId) {
            this.plannerOaId = plannerOaId
        },
         selectNexts(plannerOaId) {
            this.lotsofplannerOaId = plannerOaId
        },
        //初始化拍摄状态的列表
        initPhotoStatus() {
            let data = {};
            data.projectCode = 0;
            this.request('productlaunch_developPhotoReportManage_taskCodeListInit', {
                data: data
            }, false).then((res) => {
                if (res.code == 1) {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i] == 'NULL') {
                            if (res.data[i] == 'NULL') {
                                this.photoStatus[0] = {
                                    id: 'NULL',
                                    label: '未生成'
                                }
                            } else {
                                this.photoStatus.push({
                                    id: res.data[i],
                                    label: res.data[i]
                                })
                            }
                        } else {
                            this.photoStatus[0] = {
                                id: 'NULL',
                                label: '未生成'
                            }
                            this.photoStatus.push({
                                id: res.data[i],
                                label: res.data[i]
                            })
                        }

                    }
                }
            })
            console.log(this.photoStatus, '000000000000000')
        },
        //初始化拍摄状态的列表
        initSilentStatus() {
            let data = {};
            data.projectCode = 1;
            this.request('productlaunch_developPhotoReportManage_taskCodeListInit', {
                data: data
            }, false).then((res) => {
                if (res.code == 1) {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i] == 'NULL') {
                            if (res.data[i] == 'NULL') {
                                this.silentStatus[0] = {
                                    id: 'NULL',
                                    label: '未生成'
                                }
                            } else {
                                this.silentStatus.push({
                                    id: res.data[i],
                                    label: res.data[i]
                                })
                            }
                        } else {
                            this.silentStatus[0] = {
                                id: 'NULL',
                                label: '未生成'
                            }
                            this.silentStatus.push({
                                id: res.data[i],
                                label: res.data[i]
                            })
                        }

                    }
                }
            })
        },

        //翻拍的东西
        photoAgain(type) {
            let arr = []
            if (this.IDS.length == 0) return this.$Message.error('未选择翻拍项')
            for (let i = 0, len = this.IDS.length; i < len; i++) {
                if (type == 0) {
                    if (this.IDS[i].taskCode != 0) {
                        arr.push(this.IDS[i].photoId)
                    } else {
                        return this.$Message.error('包含了未生成拍摄状态码的选项，请重新选择')
                    }
                } else {
                    if (this.IDS[i].JTaskCode != 0) {
                        arr.push(this.IDS[i].photoId)
                    } else {
                        return this.$Message.error('包含了未生成拍摄状态码的选项，请重新选择')
                    }
                }

            }
            let data = {}
            if (type == 0) {
                data.projectCode = '0'
            } else {
                data.projectCode = '1'
            }
            data.photoIds = arr
            data.createUser = this.userInfo.userName
            this.request('productlaunch_developPhotoReportManage_reBuild', {
                data: data
            }, false).then((res) => {
                if (res.code == 1) {
                    arr = []
                    this.getData()
                } else {
                    arr = []
                    //    this.$Message.error(res.msg)
                }
            })
        },
        getMore(type) {
            switch (type) {
                case '2':
                    if (this.submitArray.length > 0) {
                        for (let i = 0; i < this.submitArray.length; i++) {
                            for (let j = i + 1; j < this.submitArray.length; j++) {
                                if (this.submitArray[i].brandName != this.submitArray[j].brandName) {
                                    this.moreBrand = 2
                                    return this.$Message.error('所选中包含了多个品牌，不能进行生成外拍报表操作')
                                } else {
                                    return this.$Message.error(`不能进行生成外派任务流操作！`)

                                }
                            }
                        }
                    } else {
                        this.$Message.error(`不能进行生成外拍任务流操作！`)
                    }

                    // this.$Message.error(`不能进行生成外拍任务流操作！`)
                    break;
                case '1':
                    for (let i = 0; i < this.submitArray.length; i++) {
                        for (let j = i + 1; j < this.submitArray.length; j++) {
                            if (this.submitArray[i].brandName != this.submitArray[j].brandName) {
                                //   this.moreBrand=2
                                return this.$Message.error('所选中包含了多个品牌，不能进行生成外拍报表操作')
                            }
                        }
                        if (!this.submitArray[i].plannerName) {
                            return this.$Message.error('企划跟进人不能为空，请编辑企划跟进人或重新选择')
                            // break; 
                        }
                    }
                    this.addTransfer.push(...this.submitArray)
                    this.addTransfer = this.addTransfer.distinct()
                    this.childdata = this.addTransfer
                    setTimeout(() => {
                        this.edit_visible = true
                        this.$refs.giveBrith.subNumber = this.addTransfer.length
                        this.$refs.giveBrith.init()
                        this.$refs.giveBrith.selection = this.childdata
                    }, 200)

                    break;

            }
        },
        getMores(type) {
            switch (type) {
                case '2':
                    if (this.submitArray2.length > 0) {

                    } else {
                        this.$Message.error(`不能进行生成静物任务流操作！`)
                    }

                    break;
                case '1':
                    if (this.submitArray2.length == 0) return this.$Message.error(`您未选择或选择项不符合，不能进行生成静物任务流操作！`)
                    for (let i = 0; i < this.submitArray2.length; i++) {
                        for (let j = i + 1; j < this.submitArray2.length; j++) {
                            if (this.submitArray2[i].brandName != this.submitArray2[j].brandName) {
                                return this.$Message.error('所选中包含了多个品牌，不能进行生成静物报表操作')
                            }
                        }
                        if (!this.submitArray2[i].plannerName) {
                            return this.$Message.error('企划跟进人不能为空，请编辑企划跟进人或重新选择')
                        }
                    }
                    this.addTransferSilent.push(...this.submitArray2)
                    this.addTransferSilent = this.addTransferSilent.distinct()
                    this.silentData = this.addTransferSilent

                    setTimeout(() => {
                        this.silent_visible = true
                        this.$refs.giveBrithsecond.subNumber = this.addTransferSilent.length
                        this.$refs.giveBrithsecond.inits()
                        this.$refs.giveBrithsecond.selection = this.silentData
                    }, 200)
                    break;

            }
        },
        //重置表单
        resetFormdata() {
            this.formSearch = {}
        },
        handleReset() {
            this.submitArray = []
            this.submitArray2 = []
            this.resetFormdata();
            this.search()
        },
        search() {
            this.page = 1
            this.getData()
        },
        //表单事件
        choiceId(selection, row) {
            this.IDS = selection;
            console.log(this.IDS)
            this.submitArray  = []
            this.submitArray2 = [];
            if (this.IDS.length > 0) {
                for (let i = 0; i < this.IDS.length; i++) {
                    if (this.IDS[i].collectStarus == 1 && this.IDS[i].taskCode == 0) {
                        this.submitArray.push(this.IDS[i])
                    } else if (this.IDS[i].collectStarus == 1 && this.IDS[i].taskCode != 0) {
                        this.moreBrand = 2
                    }
                }
                for (let i = 0; i < this.IDS.length; i++) {
                    if (this.IDS[i].collectStarus == 1 && this.IDS[i].jTaskCode == 0) {
                        this.submitArray2.push(this.IDS[i])
                    }
                }

            }
            if (this.submitArray.length > 0) {
                if (this.submitArray.length == 1) {
                    this.moreBrand = 1
                } else if (this.submitArray.length > 1) {
                    for (let i = 0; i < this.submitArray.length; i++) {
                        for (let j = i + 1; j < this.submitArray.length; j++) {
                            if (this.submitArray[i].brandName == this.submitArray[j].brandName) {
                                this.moreBrand = 1
                                //return this.$Message.error('所选中包含了多个品牌，不能进行生成报表操作')  
                            } else {
                                //   if(!this.submitArray[i].plannerName){
                                //        this.moreBrand=2
                                //      return this.$Message.error('企划跟进人不能为空，请编辑企划跟进人或重新选择')  
                                //   }else{
                                this.moreBrand = 2
                                //   }

                            }
                        }
                    }
                }
            }
            // if(this.submitArray2.length>0){
            //         if(this.submitArray2.length==1){
            //                 this.moreBrands=1
            //         }else if(this.submitArray2.length>1){
            //             for(let i=0;i<this.submitArray2.length;i++){
            //                 for(let j = i + 1; j < this.submitArray2.length; j++){
            //                     if(this.submitArray2[i].brandName != this.submitArray2[j].brandName){
            //                             this.moreBrands=2
            //                             //return this.$Message.error('所选中包含了多个品牌，不能进行生成报表操作')  
            //                     }else{
            //                             //   if(!this.submitArray[i].plannerName){
            //                             //        this.moreBrand=2
            //                             //      return this.$Message.error('企划跟进人不能为空，请编辑企划跟进人或重新选择')  
            //                             //   }else{
            //                                 this.moreBrands=1
            //                             //   }

            //                      }
            //                     }      
            //           }
            //         }     
            // }
            console.log(this.moreBrand)
            console.log(this.submitArray, '88888888888888')
        },
        //新增
        addNew() {
            this.add_choses = true
            // this.add_visible = true
        },
        currentChange(page) {
            this.submitArray = []
            this.page = page
            this.getData()
        },
        sizeChange(pageSize) {

            this.pageSize = pageSize
            this.getData()
        },
        //初始化品牌列表
        getbrandList() {
            this.request('get_scm_brand_list', {}, false).then((res) => {
                if (res.code == 1) {
                    this.brandList = res.data
                }
            })
        },
        //初始化企划跟进人列表
        allDealsList(brandId, id) {
            let data = {};
            data.brandId = Number(brandId)
            this.request('productlaunch_developDesignerConfig_plannerListInit', {
                data: data
            }, false).then((res) => {
                if (res.code == 1) {
                    this.alldealList = res.data
                    setTimeout(() => {
                        this.plannerOaId = id
                    }, 100)
                }
            })
        },
        lotsofconfirmSave() {
              
            let data = [];
                 for(let i=0;i<this.IDS.length;i++){
                    data.push({photoId:this.IDS[i].photoId,taskDetailId:this.IDS[i].taskDetailId,lastUpdateUser:this.userInfo.userName,plannerOaId:this.lotsofplannerOaId}) 
                 }
                for(let i =0;i<data.length;i++){
                    if(!data[i].plannerOaId){
                       return this.$Message.error('未选择企划跟进人')  
                    }
                }
            this.request('productlaunch_developPhotoReportManage_updatePlannerBatch', {
                data: data
            }, false).then((res) => {
                if (res.code == 1) {
                    this.lotsofplannerOaId=''
                    this.lotsofalldealList=[]
                    this.red_packet_table_row_index = -1
                    this.getData()
                }
            })
        },
        confirmSave() {
            let data = {};
            data.photoId = this.formData.photoId;
            data.taskDetailId = this.formData.taskDetailId ? this.formData.taskDetailId : null;
            data.plannerOaId = this.plannerOaId
            data.lastUpdateUser = this.userInfo.userName
            if (!data.plannerOaId) return this.$Message.error('未选择企划跟进人')
            this.request('productlaunch_developPhotoReportManage_updatePhotoReport', {
                data: data
            }, false).then((res) => {
                if (res.code == 1) {
                    this.red_packet_table_row_index = -1
                    this.getData()
                }
            })
        },
        //初始化波段列表
        getwaveList() {
            this.request('get_wave_band_list', {}, false).then((res) => {
                if (res.code == 1) {
                    this.waveList = res.data
                }
            })
        },
        //初始化第一个列表数据
        getData() {
            let obj = []
            let data = {};
            let subArray = [];
            let str = '';
            let strs = '';
            if (this.formSearch.goodsNo) {
                if (this.formSearch.goodsNo.includes(',')) {
                    subArray = this.formSearch.goodsNo.split(',')
                } else {
                    subArray.push(this.formSearch.goodsNo)
                }
            } else {
                subArray = ''
            }
            if (this.formSearch.taskCode == 0 || this.formSearch.taskCode) {
                str = (this.formSearch.taskCode).toString()
            }
            if (this.formSearch.taskCodesilent == 0 || this.formSearch.taskCodesilent) {
                strs = (this.formSearch.taskCodesilent).toString()
            }
            data.designerName = this.formSearch.designerName //设计师
            data.length = this.pageSize;
            data.start = (this.page - 1) * this.pageSize
            data.userEopId = this.userInfo.userId
            data.brandId = this.formSearch.brandId
            data.season = this.formSearch.season
            data.waveBand = this.formSearch.wave
            data.collectStarus = this.formSearch.status
            data.taskCode = str
            data.jTaskCode = strs
            data.goodsNo = subArray
            data.goodsNo ? '' : delete data.goodsNo
            data.taskCode ? '' : delete data.taskCode
            data.jTaskCode ? '' : delete data.jTaskCode
            console.log(typeof (str), '909090909090909')
            if (this.formSearch.years && !this.formSearch.years[0]) {
                delete data.years
            } else {
                if (this.formSearch.years) {
                    for (let i = 0; i < this.formSearch.years.length; i++) {
                        obj.push(filters.get_unix_only(this.formSearch.years[i]))
                    }
                    data.years = obj
                } else {
                    delete data.years
                }

            }
            if (data.season instanceof Array) {
                if (data.season.length == 0) {
                    delete data.season
                }
            }
            if (data.waveBand instanceof Array) {
                if (data.waveBand.length == 0) {
                    delete data.waveBand
                }
            }
            this.request('productlaunch_developPhotoReportManage_selectPage', {
                data: data
            }, true).then((res) => {
                if (res.code == 1) {
                    this.lotsofplannerOaId=''
                    this.lotsofalldealList=[]
                    let serialNoBegain = this.pageSize * (this.page - 1);
                    res.data.dataList.forEach((item) => {
                        serialNoBegain++;
                        item.serialNo = serialNoBegain;
                    })
                    this.list = res.data.dataList;
                    // this.list.push(res.data.dataList[0]);
                    this.total = res.data.count;
                    this.IDS = []
                    this.submitArray2 = []
                    this.moreBrand = 2
                    this.moreBrands = 2
                    if (res.data.notFound) {
                        this.$Message.error(res.data.notFound)
                    }
                } else {
                    this.list = []
                    this.total = '0'
                }
            })

        },
        quxiao() {
            this.$refs.child.formSearch = {}
            this.$refs.child.deluploadpicture()
        },
    }
}
</script>

<style>
.ivu-modal-footer {
    border-top: 0;
}

.demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
}

.demo-upload-list img {
    width: 100%;
    height: 100%;
}

.demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
    display: block;
}

.demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}

.ivu-select-dropdown-list {
    z-index: 1000000 !important
}

.ivu-select-dropdown {
    z-index: 1000000 !important
}
</style>
