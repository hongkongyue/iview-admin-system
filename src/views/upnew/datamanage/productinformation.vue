<template>
<div>
    <!-- <Row class="margin-bottom-10 background-color-white exhibition" style="font-size:20px;font-weight:bold">   
            20190704WTS / 修片管理
        </Row> -->
    <Row class="margin-bottom-10 background-color-white exhibition">
        <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline label-position="right" style="100px">
            <Col span="24">

            <Form-item label="年份:">
                <Col span="12">
                <DatePicker type="year" v-model="formSearch.years" format="yyyy年" placeholder="请选择年份" style="width: 120px"></DatePicker>
                </Col>
            </Form-item>
            <Form-item label="季节:">
                <Select v-model="formSearch.season" style="width:120px">
                    <Option v-for="item in seasonList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Form-item>
            <Form-item label="波段:">
                　<Select v-model="formSearch.waveBand" style="width:120px">
                    <Option v-for="item in waveList" :value="item.WAVE_BAND" :key="item.WAVE_BAND">
                        {{ item.WAVE_BAND }}
                    </Option>
                </Select>
            </Form-item>
            <Form-item label="品牌:" :label-width="50">
                <Select v-model="formSearch.brandId" style="width:120px">
                    <Option v-for="item in brandList" :value="item.brandId" :key="item.brandId">{{ item.brandName }}</Option>
                </Select>
            </Form-item>
            <Form-item label="任务编号:">
                <Input v-model="formSearch.taskCode" placeholder="任务编号" style="width: 120px" />
            </Form-item>
            <Form-item label="大货款号:">
                <Input v-model="formSearch.goodsNo" placeholder="大货款号" style="width: 120px" />
            </Form-item>
            <Form-item :label-width="1" style="padding-left:20px">
                <Button type="primary" @click="search">查询</Button>
                <Button type="default" @click="handleReset">重置</Button>
                <Button type="primary" @click="exports">导出</Button>
            </Form-item>
            </Col>

        </Form>
    </Row>
    <Row class="background-color-white exhibition">
        <Table ref="currentRowTable" :columns="columns" size="small" highlight-row :data="list"></Table>
        <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
    </Row>
    <Modal title="查看大图" v-model="visible">
        <img :src="'data:image/png;base64,'+bigUlr" v-if="visible" style="width: 100%">
    </Modal>
    <Modal title="查看属性" v-model="look_visible" :width="940">
        <ul style="max-height:750px;overflow:auto" class="ul">
            <li v-for="v in accesskey"><span>{{v.name}}</span><span>：{{v.label}}</span></li>
        </ul>
        <div slot="footer"></div>
    </Modal>
</div>
</template>

<script>
import Util from 'libs/util'
import filter from '../../../filter'

function formSearch() {
    return {
        search: ''
    }
}
export default {
    data() {
        return {
            accesskey: [],
            look_visible: false,
            list2: [],
            waveList: [],
            visible: false,
            red_packet_table_row_index: -1,
            loadingStatus: false,
            mystyle: {
                top: '70px',
            },
            getStatus: [{
                label: '未完成',
                value: 0
            }, {
                label: '进行中',
                value: 1
            }, {
                label: '已完成',
                value: 2
            }],
            brandList: [], // 初始化品牌列表
            allusersList: [], //初始化全部用户列表
            alldealList: [], //初始化全部处理人列表
            add_visible: false,
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
            columns: [{
                    title: '序号',
                    type: 'index',
                    align: 'center',
                    width: 60
                },
                {
                    title: '任务编号',
                    key: 'taskCode',
                    align: 'center',
                    width: 90
                },
                {
                    title: '图片',
                    key: 'departmentName',
                    align: 'center',
                    width: 90,
                    render: (h, params) => {
                        if (params.row.goodsImg) {
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
                                            src: 'data:image/png;base64,' + params.row.goodsImg,
                                        },
                                        on: {
                                            click: () => {
                                                // this.bigUlr=params.row.goodsImg
                                                // this.visible=true
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
                                        on: {
                                            //   click: () => {
                                            //                 this.bigUlr=params.row.goodsImg
                                            //                 this.visible=true
                                            //             }
                                        }
                                    }, '')

                                ])
                            //   return h('img', {
                            //            style: {
                            //                       display: 'inline-block',
                            //                       width  : '70px',
                            //                       height : '70px',
                            //                 },
                            //             domProps:{
                            //                        src  : 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1562574299&di=846b4c904bd54d3c3821fa5938888c69&src=http://hbimg.b0.upaiyun.com/bdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658',
                            //              },
                            //             on: {
                            //                   click: () => {  

                            //                    }
                            //                 }
                            //                     }, '');  
                        }
                    }
                },
                {
                    title: '年份',
                    key: 'years',
                    align: 'center',
                    width: 90,
                },
                {
                    title: '季节',
                    key: 'season',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '波段',
                    key: 'waveBand',
                    align: 'center',
                    width: 80,

                },
                {
                    title: '品牌',
                    key: 'brandName',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '大货款号',
                    key: 'goodsNo',
                    align: 'center',
                    width: 90,
                },
                {
                    title: '颜色',
                    key: 'color',
                    align: 'center',
                    width: 80,

                },
                {
                    title: '一级分类',
                    key: 'classLevel1',
                    align: 'center',
                    width: 90,

                },
                {
                    title: '二级分类',
                    key: 'classLevel2',
                    align: 'center',
                    width: 90,

                },
                // {
                //     title: '三级分类',
                //     key: 'classLevel3',
                //     align: 'center',
                //     width: 90,

                // },
                {
                    title: '执行标准',
                    key: 'standard',
                    align: 'center',
                    width: 90,

                },
                {
                    title: '安全类别',
                    key: 'securityLevel',
                    align: 'center',
                    width: 90,

                },
                {
                    title: '质量等级',
                    key: 'qualityLevel',
                    align: 'center',
                    width: 90,

                },
                {
                    title: '洗标类别',
                    key: 'washType',
                    align: 'center',
                    width: 90,

                },
                {
                    title: '国际码',
                    key: 'internationalCode',
                    align: 'center',
                    width: 90,

                },
                {
                    title: '成分',
                    key: 'ingredient',
                    align: 'center',
                    tooltip: true,
                    width: 90,

                },
                {
                    title: '属性',
                    key: 'properties',
                    align: 'center',
                    width: 90,
                    render: (h, params) => {
                        return h('span', {
                            props: {
                                type: 'default'
                            },
                            style: {
                                color: '#2d8cf0',
                                cursor: 'pointer',
                            },
                            on: {
                                'click': () => {

                                    const {
                                        taskCode,
                                        photoGoodsId,
                                        classLevel1,
                                        classLevel2
                                    } = params.row
                                    const data = {};
                                    data.taskCode = taskCode
                                    data.photoGoodsId = photoGoodsId
                                    data.firstClassLevel = classLevel1
                                    data.secondClassLevel = classLevel2
                                    this.request('getPropertiesTitle', {
                                        data: data
                                    }, false).then((res) => {
                                        if (res.code == 1) {
                                            this.look_visible = true
                                            this.accesskey = res.data.templateList
                                        }
                                    })

                                }
                            }
                        }, '查看')
                    }

                },
                {
                    title: '尺寸表',
                    key: 'sizeFileName',
                    align: 'center',
                    width: 90,
                    render(h, params) {
                        return h('p', {
                            style: {
                                color: '#2d8cf0',
                                cursor: 'pointer'
                            },
                            on: {
                                // 'click': (event) => {
                                //     this.downLoad(params.row)
                                // }
                                click: () => {
                                    let A = ''
                                    if(params.row.sizeFileUrl == null){
                                        A = params.row.sizeFileName
                                    }else{
                                        A = params.row.sizeFileUrl
                                    }
                                               location.href=`/eop/productlaunch/downloadFile?fileUrl=${A}&taskCode=${params.row.taskCode}&fileName=${params.row.sizeFileName}`
                                   }
                            }
                        }, params.row.sizeFileName)
                    }
                },
                {
                    title: '总合约单价',
                    key: 'totalContractPrice',
                    align: 'center',
                    minWidth: 90,
                },
                {
                    title: '零售价',
                    key: 'salePrice',
                    align: 'center',
                    minWidth: 90,
                },
                {
                    title: '水洗唛文案',
                    key: 'washLabel',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '80px',
                                overflowX: 'auto',
                                overflowY: 'auto'
                            }
                        }, params.row.shellWriter)
                    }
                },
                {
                    title: '水洗唛图片',
                    key: 'washLabelUrl',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        if (params.row.washLabelUrl) {
                            return h('div', {
                                    style: {
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
                                            src: this.host + params.row.washLabelUrl,
                                            src: 'data:image/png;base64,' + params.row.washLabelUrl,
                                        },
                                        on: {
                                            click: () => {
                                                this.bigUlr = params.row.washLabelUrl
                                                this.visible = true;
                                            }
                                        }
                                    }, '')

                                ])
                        } else {
                            return h('img', {
                                style: {
                                    display: 'inline-block',
                                    height: '80px',
                                },
                                domProps: {
                                    src: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1562574299&di=846b4c904bd54d3c3821fa5938888c69&src=http://hbimg.b0.upaiyun.com/bdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658',
                                },
                                on: {
                                    click: () => {

                                    }
                                }
                            }, '');
                        }
                    }
                },
                {
                    title: '吊牌图片',
                    key: 'tagFile',
                    align: 'center',
                    width: 90,
                    render: (h, params) => {
                        if (params.row.tagFile) {
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
                                            src: 'data:image/png;base64,' + params.row.tagFile,
                                        },
                                        on: {
                                            click: () => {
                                                this.bigUlr = params.row.tagFile
                                                this.visible = true

                                            }
                                        }
                                    }, '')

                                ])
                            //  return h('img', {

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
                                        on: {
                                            //   click: () => {
                                            //                 this.bigUlr=params.row.goodsImg
                                            //                 this.visible=true
                                            //             }
                                        }
                                    }, '')

                                ])
                            //   return h('img', {
                            //            style: {
                            //                      display: 'inline-block',
                            //                      width  : '80px',
                            //                      height : '80px',
                            //                 },
                            //             domProps:{
                            //                        src  : 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1562574299&di=846b4c904bd54d3c3821fa5938888c69&src=http://hbimg.b0.upaiyun.com/bdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658',
                            //              },
                            //             on: {
                            //                   click: () => {  

                            //                    }
                            //                 }
                            //                     }, '');  
                        }
                    }
                },
                {
                    title: '水洗麦',
                    key: 'washType',
                    align: 'center',
                    minWidth: 90,
                },
                // {
                //     title: '吊牌图片地址',
                //     key: 'age',
                //     align: 'center',
                //     minWidth:150,
                // },    shellWriter
                {
                    title: '面料文案',
                    key: 'shellWriter',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '80px',
                                overflowX: 'auto',
                                overflowY: 'auto'
                            }
                        }, params.row.shellWriter)
                    }
                },
                {
                    title: '细节文案',
                    key: 'detailWriter',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '80px',
                                overflowX: 'auto',
                                overflowY: 'auto'
                            }
                        }, params.row.detailWriter)
                    }
                },
                {
                    title: '洗涤说明',
                    key: 'washRemark',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '80px',
                                overflowX: 'auto',
                                overflowY: 'auto'
                            }
                        }, params.row.washRemark)
                    }
                },
                {
                    title: '温馨提示',
                    key: 'warmTip',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '80px',
                                overflowX: 'auto',
                                overflowY: 'auto'
                            }
                        }, params.row.warmTip)
                    }
                },
                {
                    title: '商品卖点',
                    key: 'sellingPoint',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '80px',
                                overflowX: 'auto',
                                overflowY: 'auto'
                            }
                        }, params.row.sellingPoint)
                    }
                },
                {
                    title: '设计解读',
                    key: 'designInterpret',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '80px',
                                overflowX: 'auto',
                                overflowY: 'auto'
                            }
                        }, params.row.designInterpret)
                    }
                },
                {
                    title: '商品ID',
                    key: 'goodsId',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '80px',
                                overflowX: 'auto',
                                overflowY: 'auto'
                            }
                        }, params.row.goodsId)
                    }
                },
                {
                    title: '企划跟进人',
                    key: 'plannerName',
                    align: 'center',
                    minWidth: 100,
                },
            ],
            userInfo: {},
            list: [],
            total: 0,
            page: 1,
            pageSize: 10,
            formSearch: {

            },
            host: 'http://eopsit.eptison.com/eop/',
            brandList: [], //品牌列表

        }
    },
    mounted() {
        this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
        this.getData()
        this.getbrandList()
        this.getwaveList()
    },
    activated() {

    },
    methods: {
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
        //下载尺寸表
        downLoad(params) {
            let data = {}
            data.fileUrl = params.sizeFileUrl
            data.taskCode = params.taskCode
            data.fileName = params.sizeFileName
            let zhan = this.formatParams(data)
            location.href = (`/eop/productlaunch/downloadFile?${zhan}`)
        },
        formatParams(data) {
            var arr = [];
            for (var name in data) {
                arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
            }
            return arr.join("&");
        },
        //重置表单
        resetFormdata() {
            this.formSearch = {}
        },
        handleReset() {
            this.resetFormdata();
            this.search()
        },
        search() {
            this.page = 1
            this.getData()
        },
        currentChange(page) {
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
        //初始化波段列表
        getwaveList() {
            this.request('get_wave_band_list', {}, false).then((res) => {
                if (res.code == 1) {
                    this.waveList = res.data
                }
            })
        },
        show() {
            this.look_visible = true
        },
        //初始化第一个列表数据
        getData() {
            let data = {}
            data.length = this.pageSize
            data.start = (this.page - 1) * this.pageSize
            data.years = filter.get_unix_only(this.formSearch.years)
            data.season = this.formSearch.season
            data.waveBand = this.formSearch.waveBand
            data.taskCode = this.formSearch.taskCode
            data.brandId = this.formSearch.brandId
            data.type = 'goodsInfo'
            data.goodsNo = this.formSearch.goodsNo //大货款号
            this.request('productlaunch_getDevelopGoodsInfoList', {
                data: data
            }, true).then((res) => {
                if (res.code == 1) {
                    let serialNoBegain = this.pageSize * (this.page - 1);
                    res.data.goodsInfoList.forEach((item) => {
                        serialNoBegain++;
                        item.serialNo = serialNoBegain;
                    })
                    this.list = res.data.goodsInfoList;
                    this.total = res.data.count;
                } else {
                    this.list = []
                    this.total = '0'
                }
            })

        },
        exports() { //productlaunch/deleteDevelopUserConfig
            let data = {}
            data.years = filter.get_unix_only(this.formSearch.years)
            data.season = this.formSearch.season
            data.waveBand = this.formSearch.waveBand
            data.taskCode = this.formSearch.taskCode
            data.brandId = this.formSearch.brandId
            data.goodsNo = this.formSearch.goodsNo //大货款号
            data.type = 'goodsInfo'
            data.years ? '' : delete data.years
            data.season ? '' : delete data.season
            data.waveBand ? '' : delete data.waveBand
            data.taskCode ? '' : delete data.taskCode
            data.brandId ? '' : delete data.brandId
            data.goodsNo ? '' : delete data.goodsNo
            let params = filter.formatParams(data)
            location.href = `/eop/productlaunch/DevelopTaskEntering/detailExport?${params}`
        }
    }
}
</script>

<style>
.ivu-modal-footer {
    border-top: 0 !important;
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

.ivu-table-cell {
    padding-left: 0;
    padding-right: 0;
}

th.ivu-table-column-center :nth-of-type(4) {
    text-align: left !important
}
</style><style lang="less" scoped>
.ul {
    width: 100%;
    height: auto;

    li {
        display: inline-block;
        width: 24%;
        height: 40px;
        line-height: 40px;
        text-align: center
    }
}
</style>
