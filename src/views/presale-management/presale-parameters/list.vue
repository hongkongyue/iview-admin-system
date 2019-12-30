<style lang="less">
   
</style>

<template>
<div class="background-color-white exhibition">
    <Form :model="formSearch" class="search" ref="formSearch" :label-width="80" inline label-position="right"
        @keydown.native.enter="search">

        <Row>
            <Col span="6">
            <Form-item label="品牌：" :label-width='60'>
                <Select v-model="formSearch.brandId" style="width:150px">
                    <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                    </Option>
                </Select>
            </Form-item>
            </Col>

            <Col span="6">
            <Form-item :label-width="1">
                <Button type="primary" @click="search('formSearch')" icon="ios-search">搜索</Button>
                <Button type="default" @click="handleReset('formSearch')">重置</Button>
            </Form-item>
            </Col>
        </Row>
    </Form>
    <Row class-name="margin-bottom-10">
        <Col span="24" class="">
        <Button type="primary" icon="md-add" @click="add">
            新增
        </Button>
        </Col>
    </Row>
    <!-- 表格 -->
    <Row class="margin-bottom-10">
        <Table size="small" :columns="columns" :data="list"></Table>
    </Row>
</div>
</template>

<script>
import Util from '@/libs/util.js';
export default {
    name: 'presale_parameters',
    desc: '预售参数设置',
    data() {
        return {
            columns: [{
                    title: '序号',
                    key: 'serialNo',
                    align: 'center',
                    width: 60
                },
                {
                    title: '品牌',
                    key: 'brand_name',
                    align: 'center',
                    width: 150
                }, {
                    title: '安全库存',
                    key: 'safe_stock',
                    align: 'center',
                    width: 100
                }, {
                    title: '安全天数',
                    key: 'safe_day',
                    align: 'center',
                    width: 100
                }, {
                    title: '预售百分比(%)',
                    key: 'presale_percent',
                    align: 'center',
                    width: 120
                }, {
                    title: '全品预售',
                    key: 'is_all_presale',
                    align: 'center',
                    width: 120,
                      render: (h, params) => {
              let showColor='green';
              if(params.row.is_all_presale==0){
                showColor='red';
              }
              return h('Tag',{
                props:{
                  color:showColor
                }
              },params.row.is_all_presale == 1 ? '是' : '否')
            }
                }, {
                    title: '商品总数',
                    key: 'goods_num',
                    align: 'center',
                    width: 85
                }, {
                    title: '店铺',
                    key: 'shop_name',
                    align: 'center',
                    width: 150
                }, {
                    title: '创建时间',
                    key: 'created',
                    align: 'center',
                    width: 150
                }, {
                    title: '创建人',
                    key: 'create_user',
                    align: 'center',
                    width: 120
                }, {
                    title: '修改时间',
                    key: 'updated',
                    align: 'center',
                    width: 150
                }, {
                    title: '修改人',
                    key: 'update_user',
                    align: 'center',
                    width: 80
                }, {
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    align: 'left',
                    width: 180,
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
                                        this.viewDetail(params.row);
                                    }
                                }
                            }, '查看'),
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
                                        this.edit(params.row);
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                },
                                on: {
                                    click: () => {
                                        this.delete(params.row);
                                    }
                                }
                            }, '删除')
                        ])
                    }
                }
            ],
            //列表数据
            list: [],
            //搜索表单
            formSearch: {
                orderId: ''
            },
            brandList: []
        };
    },
    methods: {
        search(){
            this.getListData()
        },
        add() {
            this.$router.push({
                name: 'presale_parameters_add'
            });
        },
        getBrandList() {
            this.request('get_brand_list', {
                ver: '1',
                ts: Date.parse(new Date()),
                sign: '',
                data: {}
            }, false).then((res) => {
                this.brandList = res.data;
                this.brandList = this.brandList.filter(x => {
                    return x.id != '51594' && x.id != '51609'
                })
            })
        },
        viewDetail(row) {
            this.$router.push({
                name:'presale_parameters_detail',
                 params: {
            Id:row.id,
          }
            })
        },
        getListData(){
            let data = Util.deepClone(this.formSearch)
            this.request('get_pre_sale_parameters_list',data,true).then((res)=>{
                if(res.errno==0){
                    let serialNoBegain=0
                    for(let item of res.data){
                       serialNoBegain++;
                       item.serialNo = serialNoBegain;
                    }
                    this.list = res.data
                }
            })
        },
        /**
         * 修改
         */
        edit(row){
　　　　　　　 this.$router.push({
                name: 'presale_parameters_edit',
                params: {
            Id:row.id,
          }
            });
        },
        delete(row){
              this.$Modal.confirm({
                title: '删除提示',
                content: '确定要删除当前记录？',
                loading: true,
                onOk: () => {
                    this.request('delete_pre_sale_parameter_data', {
                        id:row.id
                    }, true).then((res) => {
                        if (res.errno == 0) {
                            this.$Modal.remove();
                            this.$Message.info('删除成功');
                            this.search()
                        }
                    })
                }
            });
        },
        handleReset(){
            this.formSearch={}
            this.search()
        }
    },
    activated(){
        if(this.list.length>0){
            this.search()
        }
    },
    mounted() {
        this.getBrandList()
        this.getListData()
    }
};
</script>
