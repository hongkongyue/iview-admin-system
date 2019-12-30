<template>
<div class="background-color-white exhibition">
        <Form :model="formSearch" class="search" ref="formSearch" :label-width="80" inline label-position="right"  @keydown.native.enter="search">
     <Row>
      <Col span="6">
        <Form-item label="订单编号：">
          <Input v-model="formSearch.orderId" placeholder="订单编号"></Input>
        </Form-item>
      </Col>
       <Col span="6">
        <Form-item label="收货人：">
          <Input v-model="formSearch.consigne" placeholder="收货人姓名"></Input>
        </Form-item>
      </Col>
       <Col span="6">
        <Form-item label="订单状态：" >
          <Select style="width:162px" v-model="formSearch.orderStatus" placeholder="请选择" >
             <Option v-for="item in orderStatusList" :value="item.statusCode" :key="item.statusCode">{{ item.statusName }}</Option>
          </Select>
        </Form-item>
        </Col>
      </Row>
      <Row>
         <Col span="12">
            <Form-item label="订单日期：">
              <DatePicker type="date" v-model="formSearch.startDate" placeholder="选择开始日期" style="width: 200px"></DatePicker>
              <DatePicker type="date" v-model="formSearch.endDate" placeholder="选择结束日期" style="width: 200px"></DatePicker>
            </Form-item>
          </Col>
         <Col span="6">
          <Form-item :label-width="1">
            <Button type="primary" @click="search('formSearch')" icon="ios-search">搜索</Button>
            <Button type="default" @click="handleReset('formSearch')" >重置</Button>
          </Form-item>
         </Col>
      </Row>
      </Form>
       <Row class-name="margin-bottom-10">
           <Col  span="24" class="">
          <Button type="primary"  icon="md-add" @click="addFactorySampleCoat">
            新增
          </Button>
          </Col>
     </Row>
     <!-- 表格 -->
     <Row class="margin-bottom-10">
      <Table size="small" :columns="columns" :data="list"></Table>
    </Row>
    <Row>
     <Page :total="total" :page-size="pageSize" :current="pageNumber"  show-sizer show-total show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
    </Row>
</div>
</template>
<script>
import base from 'libs/base';
import Util from 'libs/util';
import {mapState} from 'vuex'
export default {
    name:"factorysamplecoat_list",
    data(){
        return {
           columns: [
          {
            title: '序号',
            key:'serialNo',
            align:'center',
            width: 60
          },
          {
            title: '借用人',
            key:'name',
            align:'center',
            width: 120
          },
          {
            title: '工厂',
            key:'factoryName',
            align:'center',
            width: 120
          },
          {
            title: '订单编号',
            key: 'orderId',
            align:'center',
            width: 150,
            render:(h,params) => {
              return h('a',{
              on: {
                 click: () => {
                      this.viewFactorySampleCoat(params.row.orderId);
                 }
              }
              },params.row.orderId);
            }
          },
          {
            title: '订单日期',
            key: 'payTime',
            align:'center',
            width: 150
          },
          {
            title: '订单金额',
            key: 'totalMoney',
            align:'center',
            width: 100
          },
          {
            title: '订单状态',
            key: 'orderStatus',
            align: 'center',
            width: 100,
            render:(h,params)=>{
              return h('span',{},Util.formatOrderStatus(params.row.orderStatus));
            }
          },
          {
            title: '物流公司',
            key: 'logisticsCompany',
            align: 'center',
            width: 180
          },
          {
            title: '物流单号',
            key: 'logisticsNo',
            align: 'center',
            width: 150
          },
          {
            title: '收货人',
            key: 'consigne',
            align: 'center',
            width: 100
          },
          {
            title: '备注',
            key: 'remark',
            align: 'center',
            minWidth:150
          },
          {
            title: '操作',
            key: 'operation',
            width: 120,
            fixed:'right',
            align: 'center',
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
                      this.viewFactorySampleCoat(params.row.orderId);
                    }
                  }
                }, '查看')
              ]);
            }
          }
        ],
        //列表数据
        list: [],
        //总共数据多少条
        total: 25,
        //每页多少条数据
        pageSize: 10,
        //当前页码
        pageNumber: 1,
        //搜索表单
        formSearch: {
          orderId:''
        }
        }
    },
    methods:{
          addFactorySampleCoat(){
               this.$router.push({name:'factorysamplecoat_add'});
          },
          viewFactorySampleCoat(orderId){

            this.$router.push({
            name:'factorysamplecoat_detail',
            params: {
                orderId: orderId
            }});
          },
          getData (params) {
          let dataMap={};
          dataMap.type=['FY'], //普通样衣类型
          dataMap.length = this.pageSize;
          dataMap.start = (this.pageNumber-1)*this.pageSize;
          dataMap.orderStatus = params.orderStatus;
          dataMap.orderId = params.orderId;
          dataMap.userId = [this.userInfo.userId];
          if(params.consigne){
             dataMap.consigne = params.consigne;
          }
          if(!!params.startDate){
            dataMap.start_date = Util.dateFormat(params.startDate,'yyyy-MM-dd');
          }
          if(!!params.endDate){
            dataMap.end_date = Util.dateFormat(params.endDate,'yyyy-MM-dd');
          }

          this.request('FactorySampleCoatList',
             {
               ver:'1',
               ts:Date.parse( new Date()),
               data:{map:dataMap}
               }, true).then((res) => {
              //处理序号显示
              let serialNoBegain = this.pageSize*(this.pageNumber-1);
              res.data.data.forEach((item)=>{
                 serialNoBegain++;
                 item.serialNo = serialNoBegain;
              })
              this.list= res.data.data;
              //总页数
              this.total = res.data.total;
          });
        },
        //分页切换页码
        changePage(page){
          this.pageNumber = page;
          let search = this.formSearch;
          let pageSize = this.pageSize;
          //获取最新数据
          this.getData(search);
        },
        //分页切换每页记录数
        changePageSize(pageSize){
           this.pageSize = pageSize;
           let search = this.formSearch;
           let query = Object.assign({page: this.pageNumber,pageSize}, search);
          //获取最新数据
          this.getData({ params: search});
        },
        //重置表单数据
        handleReset (name) {
           this.formSearch ={};
           this.search();
        },
         //表单搜索
        search() {
            let page = 1;
            this.pageNumber = page;
            let search = this.formSearch;
            this.getData(search);
        }
    },
    created(){
    },
    computed: {
      ...mapState({
        orderStatusList: state => state.common.orderStatusList
      })
    },
    mounted(){
         this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));
         this.$store.dispatch('get_order_status_list', {});
    },
    activated(){
      this.search();
    }
}
</script>
