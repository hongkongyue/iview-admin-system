<style>
</style>
<template>
  <div class="background-color-white exhibition">
    <Form :model="formSearch" class="search" ref="formSearch" :label-width="80" inline label-position="right"
          @keydown.native.enter="search">
      <Row>
        <Form-item label="订单状态：">
          <Select style="width:160px" v-model="formSearch.reorderStatus" placeholder="请选择">
            <Option v-for="item in orderStatusList" :value="item.value" :key="item.value">
              {{ item.name }}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="品牌：">
          <Select v-model="formSearch.brandId" style="width:160px;text-align: center" placeholder="请选择品牌">
            <Option v-for="item in brandList" :value="item.brandId" :key="item.brandId">
              {{ item.brandName }}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="品名：">
          <Select style="width:160px" v-model="formSearch.className" filterable placeholder="请选择">
            <Option v-for="item in class_name_list" :value="item.CLASS_NAME" :key="item.CLASS_NAME">{{ item.CLASS_NAME }}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="销售季节：">
          <Select style="width:160px" v-model="formSearch.seasen" filterable placeholder="请选择">
            <Option v-for="item in seasenList" :value="item.seasen" :key="item.seasen">{{ item.seasen }}</Option>
          </Select>
        </Form-item>
        <br>
        <Form-item label="款号：">
          <Input v-model="formSearch.sectionNo" style="width:160px" placeholder="请输入款号"></Input>
        </Form-item>
        <Form-item label="下单编号：">
          <Input v-model="formSearch.reorderCode" style="width:160px" placeholder="请输入下单编号"></Input>
        </Form-item>
        <Form-item label="制单号：">
          <Input v-model="formSearch.manuOrderCode" style="width:160px" placeholder="请输入制单号"></Input>
        </Form-item>
        <Form-item label="下单时间：">
          <DatePicker
            v-model="formSearch.startDate"
            type="date"
            placeholder="起始时间"
            style="width: 200px"
          >
          </DatePicker>
        </Form-item>
        <Form-item :label-width="1">
          <DatePicker
            v-model="formSearch.endDate"
            type="date"
            placeholder="结束时间"
            style="width: 200px"
          >
          </DatePicker>
        </Form-item>
        <Form-item :label-width="1">
          <Button type="primary" @click="search('formSearch')" icon="ios-search">搜索</Button>
          <Button type="default" @click="handleReset('formSearch')">重置</Button>
        </Form-item>
      </Row>
    </Form>
    <!-- 表格 -->
    <Row class="margin-bottom-10">
      <Table size="small" :columns="columns" :data="list" highlight-row></Table>
    </Row>
    <Row>
      <Page :total="total" :page-size="pageSize" :current="pageNumber" show-sizer show-total show-elevator
            @on-change="changePage" @on-page-size-change="changePageSize"></Page>
    </Row>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import Util from 'libs/util'

  function formSearch() {
    return {
      brandId: '',           //	品牌id	string
      endDate: '',           //	结束时间	string	格式：YYYY-MM-DD
      className: '',         //	品名	string
      sectionNo: '',         //	款号	string
      // sectionNo: '',         //	下单编号	string
      // sectionNo: '',         //	制单号	string
      reorderStatus: '',     //	状态	number
      seasen: '',            //	季节	string
      startDate: '',         //	开始时间	string	格式：YYYY-MM-DD
      userId: '',            //  用户id
    }
  }

  let reorderStatus = Vue.extend({
    props:['status'],
    data(){
      return {
        status_color:''
      }
    },
    mounted(){
      switch(this.status){
        case '草稿':
          this.status_color = '#ff9900'
          break;
        case '已完成':
          this.status_color = '#19be6b'
          break;
        case '已取消':
          this.status_color = '#ed3f14'
          break;
        default:
          break;
      }
    },
    template: `
        <div :style="{color:status_color}">
          {{status}}
        </div>
    `,
  })

  export default {
    name: "quickrepeatorder_list",
    desc: '快捷返单列表页面',
    data() {
      return {
        brandList:[],
        formSearch: formSearch(),
        columns: [
          {
            title: '序号',
            key: 'serialNo',
            align: 'center',
            minWidth: 60
          },
          {
            title: '下单编号',
            key: 'reorderCode',
            align: 'center',
            minWidth: 190
          },
          {
            title: '申请品牌',
            key: 'brandName',
            align: 'center',
            minWidth: 120
          },
          {
            title: '品名',
            key: 'className',
            align: 'center',
            minWidth: 120
          },
          {
            title: '款号',
            key: 'sectionNo',
            align: 'center',
            minWidth: 100
          },
          // {
          //   title: '批次',
          //   key: 'batch',
          //   align: 'center',
          //   minWidth: 120
          // },
          {
            title: '状态',
            key: 'reorderStatus',
            align: 'center',
            minWidth: 100,
            render:(h,params)=>{
              return h(reorderStatus, {
                props: {
                    status: Util.formatOrderStatusNew(params.row.reorderStatus.toString())
                }
              })
            }
          },
          // {
          //   title: '审批意见',
          //   key: 'checkNote',
          //   align: 'center',
          //   minWidth: 150
          // },
          // {
          //   title: '原因',
          //   key: 'uploadFlag',
          //   align: 'center',
          //   minWidth: 180
          // },
          {
            title: '创建时间',
            key: 'created',
            align: 'center',
            minWidth: 150
          },
          {
            title: '创建人',
            key: 'createUser',
            align: 'center',
            minWidth: 100
          },
          {
            title: '一级审核',
            key: 'firstCheckName',
            align: 'center',
            minWidth: 100
          },
          {
            title: '一级审核意见',
            key: 'firstCheckMsg',
            align: 'center',
            minWidth: 100
          },
          {
            title: '二级审核',
            key: 'secondCheckName',
            align: 'center',
            minWidth: 100
          },
          {
            title: '二级审核意见',
            key: 'secondCheckMsg',
            align: 'center',
            minWidth: 100
          },
          {
            title: '操作',
            key: 'sendTime',
            align: 'left',
            minWidth: 200,
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
                      this.$router.push({name: 'quickrepeatorder_detail',params:{orderId:params.row.reorderCode}});//跳转至列表页面
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display:params.row.reorderStatus == 350||params.row.reorderStatus == 100 || params.row.reorderStatus == 450 || params.row.reorderStatus == 250 ? 'inline-block':'none'
                  },
                  on: {
                    click: () => {
                      this.$router.push({name: 'quickrepeatorder_edit',params:{orderId:params.row.reorderCode}});//跳转至列表页面
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display:params.row.reorderStatus == 500 ||params.row.reorderStatus == 700 ? 'inline-block':'none'
                  },
                  on: {
                    click: () => {
                              this.$Modal.confirm({
                              title: '提示',
                              content: '重新推送，请确认！',
                              onOk: () => {
                                this.request('eom_reorder_push_scm',{
                                  data:{
                                    reorderCode:params.row.reorderCode
                                  }
                                },true).then(res=>{
                                  if(res.code == 1){
                                    this.$Message.success(res.msg);
                                    this.getData();
                                  }
                                })
                              },
                              onCancel: () => {
                                this.$Message.warning('已取消操作!');
                              }
                      })
                      // this.$router.push({name: 'quickrepeatorder_edit',params:{orderId:params.row.reorderCode}});//跳转至列表页面
                    }
                  }
                }, '推送'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display:params.row.reorderStatus == 100 ? 'inline-block':'none'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '提示',
                        content: '该行将会取消返单，请确认！',
                        onOk: () => {
                          this.request('cancel_reorder',{
                            data:{
                              reorderCode:params.row.reorderCode,
                              userAccount:JSON.parse(window.sessionStorage.getItem('userinfo')).userAccount
                            }
                          },true).then(res=>{
                            if(res.code == 1){
                              this.$Message.success(res.msg);
                              this.getData();
                            }
                          })
                        },
                        onCancel: () => {
                          this.$Message.warning('已取消操作!');
                        }
                      })
                      
                    }
                  }
                }, '取消')
              ]);
            }

          }
        ],
        //列表数据
        list: [],
        //总共数据多少条
        total: 0,
        //每页多少条数据
        pageSize: 10,
        //当前页码
        pageNumber: 1,
        //根据用户ID获取的品名
        goods_name: [],
        seasenList: [
          {
            seasen: '春季'
          },
          {
            seasen: '夏季'
          },
          {
            seasen: '秋季'
          },
          {
            seasen: '冬季'
          }
        ],
        class_name_list:[],
        orderStatusList:[
          {name:'草稿',value:'100'},
          {name:'待审核',value:'200'},
          {name:'已审核',value:'300'},
          {name:'一级审核失败',value:'350'},
          {name:'一级审核通过',value:'400'},
          {name:'二级审核失败',value:'450'},
          {name:'二级审核通过',value:'500'},
          {name:'已推送',value:'600'},
          {name:'部分生产',value:'650'},
          {name:'推送失败',value:'700'},
          {name:'已完成',value:'800'},
          {name:'部分完成',value:'850'},
          {name:'已取消',value:'950'},
        ]
      }
    },
    mounted() {
      this.$store.dispatch('get_order_status_list', {});
      this.$store.dispatch('get_brands_by_userId', {data: {userId: JSON.parse(window.sessionStorage.getItem('userinfo')).userId}});
      this.get_class_name();
      this.getBrandLists()
    },
    activated() {
      this.getData();
    },
    computed: {
      ...mapState({
        // orderStatusList: state => state.common.orderStatusList,
        // brandList:state => state.quickRepeatOrder.brands_by_userId
      })
    },
    methods: {
      getBrandLists(){
                        let data={}
                            data.userCode=JSON.parse(window.sessionStorage.getItem('userinfo')).userAccount
                       this.request('eom_brandPermissions_getBrandListByUserCode',{data},false).then(res=>{
                               if(res.code==1){
                                  this.brandList=res.data
                               }
                       })
            },
      //重置表单数据
      handleReset() {
        this.formSearch = formSearch();
        this.search();
      },
      search(){
        this.pageNumber = 1;
        this.getData();
      },
      //表单搜索
      getData() {
        this.formSearch.userId = JSON.parse(window.sessionStorage.getItem('userinfo')).userAccount;
        if(!!this.formSearch.startDate){
          this.formSearch.startDate = Util.dateFormat(this.formSearch.startDate, 'yyyy-MM-dd');
        }
        if(!!this.formSearch.endDate) {
          this.formSearch.endDate = Util.dateFormat(this.formSearch.endDate, 'yyyy-MM-dd');
        }
        this.formSearch.length = this.pageSize;
        this.formSearch.start = this.pageSize * (this.pageNumber - 1);
        this.request('get_reorder_list', {
          data: this.formSearch
        },true).then(res => {
          if (res.code == 1) {
            let serialNoBegain = this.pageSize*(this.pageNumber-1);
            res.data.reorderList.forEach((item)=>{
              serialNoBegain++;
              item.serialNo = serialNoBegain;
            })
            this.total = res.data.counts;
            this.list = res.data.reorderList;
          }
        })
      },
      get_class_name(){
          this.request('get_class_name').then(res=>{
              if(res.code == 1){
                  this.class_name_list = res.data;
              }
          })
      },
      //分页切换页码
      changePage(page) {
        this.pageNumber = page;
        this.getData();
      },
      //分页切换每页记录数
      changePageSize(pageSize) {
        this.pageSize = pageSize;
        this.getData();
      },
    }
  }
</script>

