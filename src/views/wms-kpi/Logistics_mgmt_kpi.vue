<style>
  #logistics_mgmt_kpi .Alert_Margin{
    margin-bottom:10px;
  }
</style>
<template>
  <div class="background-color-white exhibition" id="logistics_mgmt_kpi">
    <Row class="margin-bottom-10">
      <Col span="24" class="search margin-bottom-10">
      <Form :model="formSearch" ref="formSearch" :label-width="80" inline label-position="right">
        <Form-item label="起始日期：">
          <DatePicker type="date" v-model="formSearch.start_date" format="yyyy-MM-dd" placeholder="选择开始日期" style="width: 200px"></DatePicker>
          <DatePicker type="date" v-model="formSearch.end_date" format="yyyy-MM-dd" placeholder="选择结束日期" style="width: 200px"></DatePicker>
        </Form-item>
        </Form-item>
        <Form-item :label-width="1">
          <Button type="primary" @click="search('formSearch')" icon="ios-search">搜索</Button>
          <Button type="default" @click="handleReset('formSearch')" >重置</Button>
        </Form-item>
      </Form>
      </Col>
      <Col span="24" class="search margin-bottom-10">
      <Alert>* 物流中心</Alert>
      <Table class="Alert_Margin" :columns="Columns" size="small"  :data="wmscenterData" id="test"></Table>
      </Col>
      <Col span="24" class="search margin-bottom-10">
      <Alert >* 瓜沥物流中心</Alert>
      <Table class="Alert_Margin" :columns="Columns" size="small"  :data="glwmsData"></Table>
      </Col>
      <Col span="24" class="search margin-bottom-10">
      <Alert>* 宇隆物流中心</Alert>
      <Table :columns="Columns" size="small" :data="ylwmsData"></Table>
      </Col>
    </Row>
  </div>
</template>

<script>
  import Util from 'libs/util'
  import Vue from 'vue'
  var myComponent = Vue.extend({
    props:['params','formSearch'],
    template: `<div>
                <span>{{params.row.Indicator}}</span>
                <Tooltip placement="right">
                  <Icon type="android-alert"></Icon>
                  <div slot="content" style="white-space: normal">
                      <span>{{params.row.data_source}}</span>
                  </div>
              </Tooltip>
              <span style="cursor: pointer;margin-left:10px" v-if="(params.row.Indicator == '发货延时率' || params.row.Indicator == '发货出错率') && params.row.warehouse_code!=''" @click="exportExcel(params.row.Indicator,params.row.warehouse_code,formSearch)">
                <Icon type="arrow-down-c"></Icon>
              </span>
            </div>`,
    methods:{
      exportExcel(Indicator,warehouse,formSearch){
        var TempFormSearch = JSON.parse(JSON.stringify(formSearch))
        TempFormSearch.start_date = Util.dateFormat(formSearch.start_date,'yyyy-MM-dd');
        TempFormSearch.end_date = Util.dateFormat(formSearch.end_date,'yyyy-MM-dd');
        switch(Indicator){
          case '发货延时率':
            this.stockout_delay_export_excel(Indicator,warehouse,TempFormSearch)
            break;
          case '发货出错率':
            this.stockout_error_export_excel(Indicator,warehouse,TempFormSearch)
            break;
          default:
            break;
        }
      },
      stockout_delay_export_excel(type,warehouse,TempFormSearch){
        // this.request('stockout_delay_export_excel', {
        //   warehouse_code:warehouse,
        //   start_date:TempFormSearch.start_date,
        //   end_date:TempFormSearch.end_date
        // },true).then(res => {
        //   if(res.code == 1){
        //     this.$Message.success(res.data);
        //     return
        //   }
          window.location = `${window.location.origin}/eop/kpi/lst/stockout_delay_export_excel?warehouse_code=${warehouse}&start_date=${TempFormSearch.start_date}&end_date=${TempFormSearch.end_date}`
        // })
      },
      stockout_error_export_excel(Indicator,warehouse,TempFormSearch){
        // this.request('stockout_error_export_excel', {
        //   ver: '1',
        //   ts: Date.parse(new Date()),
        //   sign: '',
        //   methods: 'stockout_error_export_excel',
        //   params: {
        //     warehouse_code:warehouse,
        //     start_date:TempFormSearch.start_date,
        //     end_date:TempFormSearch.end_date
        //   }
        // },true).then(res => {
        //   if(res.code == 1){
        //     this.$Message.success(res.data);
        //     return
        //   }
          window.location = `${window.location.origin}/eop/kpi/lst/stockout_error_export_excel?warehouse_code=${warehouse}&start_date=${TempFormSearch.start_date}&end_date=${TempFormSearch.end_date}`
        // })
      }
    }
  })

  function formSearch(){
    return {
      start_date:'',
      end_date:''
    }
  }
  export default {
    name: "logistics_mgt_kpi",
    data() {
      return {
        formSearch:formSearch(),          //搜索表单筛选条件
        //物流中心表格数据
        wmscenterData: [
          {
            Indicator: '库位出错率',
            rate: '--',
            data_source: '抽查出错库位数/抽查库位数（2000个）*100%',
            data_dep_head: '吕三华',
            data_provide_dep: '财务中心',
            assessee: '屠江富、宋海波',
            warehouse_code:''
          },
          {
            Indicator: '发货延时率',
            rate: '--',
            data_source: '每月当天16点前付款订单当天发货未完成订单数占比发货延时率=未按时发货订单数/当月总订单数*100%\n' +
            '货未及时到位，虚拟上架、跟CEO报备除外',
            data_dep_head: '吕三华',
            data_provide_dep: '财务中心',
            assessee: '屠江富、宋海波',
            warehouse_code:''
          },
          {
            Indicator: '收货延时率',
            rate: '--',
            data_source: '每月当天16点前做单完成的扫码完成\n' +
            '=收货未扫码件数/当月收货总件数*100%\n' +
            '跟CEO报备除外',
            data_dep_head: '吕三华',
            data_provide_dep: '财务中心',
            assessee: '屠江富、宋海波',
            warehouse_code:''
          }
        ],
        //物流中心表格行显示内容
        Columns:[
          {
            title: '指标名称',
            key:'Indicator',
            width: 150,
            align:'center',
            render: (h, params) => {
              return h(myComponent,{
                props:{
                  params:params,
                  formSearch:this.formSearch
                }
              })
            }
          },
          {
            title: 'KPI数据',
            key:'rate',
            width: 200,
            align:'center'
          },
          {
            title: '数据部门负责人',
            key:'data_dep_head',
            width: 200,
            align:'center'
          },
          {
            title: '统计数据提供部门',
            key:'data_provide_dep',
            width: 200,
            align:'center'
          },
          {
            title: '被评估人',
            key:'assessee',
            align:'center'
          }
        ],
        //瓜沥仓表格数据
        glwmsData: [
          {
            Indicator: '库位出错率',
            rate: '--',
            data_source: '抽查出错库位数/抽查库位数（2000个）*100%',
            data_dep_head: '吕三华',
            data_provide_dep: '财务中心',
            assessee: '徐荣炜',
            warehouse_code:'XSGLC'
          },
          {
            Indicator: '发货延时率',
            rate: '--',
            data_source: '每月当天16点前付款订单当天发货未完成订单数占比发货延时率=未按时发货订单数/当月总订单数*100%\n' +
            '货未及时到位，虚拟上架、跟CEO报备除外',
            data_dep_head: '吕三华',
            data_provide_dep: '财务中心',
            assessee: '徐荣炜',
            warehouse_code:'XSGLC'
          },
          {
            Indicator: '发货出错率',
            rate: '--',
            data_source: '每月错发数量占比每月错发数/当月发货总数*100%',
            data_dep_head: '吕三华',
            data_provide_dep: '财务中心',
            assessee: '徐荣炜',
            warehouse_code:'XSGLC'
          },
          {
            Indicator: '收货延时率',
            rate: '--',
            data_source: '每月当天16点前做单完成的扫码完成\n' +
            '=收货未扫码件数/当月收货总件数*100%\n' +
            '跟CEO报备除外',
            data_dep_head: '吕三华',
            data_provide_dep: '财务中心',
            assessee: '王素',
            warehouse_code:'XSGLC'
          },
          {
            Indicator: '全检及时率',
            rate: '--',
            data_source: '当天扫码完成的大货及销退在24小时内全检完成，\n' +
            '三退在48小时内完成（双十一除外） =已质检总数量/月扫码数量*100%',
            data_dep_head: '吕三华',
            data_provide_dep: '财务中心',
            assessee: '吴叶飞',
            warehouse_code:'XSGLC'
          },
          {
            Indicator: '退货上架及时率',
            rate: '--',
            data_source: '当天16点前退仓并当天处理完成且在24小时内上架完成/唯品会到仓72小时内上架完成\n' +
            '=已上架数据/当月总销退数*100%',
            data_dep_head: '吕三华',
            data_provide_dep: '财务中心',
            assessee: '王素',
            warehouse_code:'XSGLC'
          },
          {
            Indicator: '大货上架及时率',
            rate: '--',
            data_source: '当天扫码完成的需在48小时内上架完成\n' +
            '=已上架数据/当月扫码总数据*100%',
            data_dep_head: '吕三华',
            data_provide_dep: '财务中心',
            assessee: '王素',
            warehouse_code:'XSGLC'
          }
        ],
        //宇隆仓表格数据
        ylwmsData: [
          {
            Indicator: '库位出错率',
            rate: '--',
            data_source: '抽查出错库位数/抽查库位数（2000个）*100%',
            data_dep_head: '吕三华',
            data_provide_dep: '财务中心',
            assessee: '王胜凯',
            warehouse_code:'XSYLC'
          },
          {
            Indicator: '发货延时率',
            rate: '--',
            data_source: '每月当天16点前付款订单当天发货未完成订单数占比发货延时率=未按时发货订单数/当月总订单数*100%\n' +
            '货未及时到位，虚拟上架、跟CEO报备除外',
            data_dep_head: '吕三华',
            data_provide_dep: '财务中心',
            assessee: '王胜凯',
            warehouse_code:'XSYLC'
          },
          {
            Indicator: '发货出错率',
            rate: '--',
            data_source: '每月错发数量占比每月错发数/当月发货总数*100%',
            data_dep_head: '吕三华',
            data_provide_dep: '财务中心',
            assessee: '王胜凯',
            warehouse_code:'XSYLC'
          },
          {
            Indicator: '收货延时率',
            rate: '--',
            data_source: '每月当天16点前做单完成的扫码完成\n' +
            '=收货未扫码件数/当月收货总件数*100%\n' +
            '跟CEO报备除外',
            data_dep_head: '吕三华',
            data_provide_dep: '财务中心',
            assessee: '李青',
            warehouse_code:'XSYLC'
          },
          {
            Indicator: '全检及时率',
            rate: '--',
            data_source: '当天扫码完成的大货及销退在24小时内全检完成，\n' +
            '三退在48小时内完成（双十一除外） =已质检总数量/月扫码数量*100%',
            data_dep_head: '吕三华',
            data_provide_dep: '财务中心',
            assessee: '戴叶芬',
            warehouse_code:'XSYLC'
          },
          {
            Indicator: '退货上架及时率',
            rate: '--',
            data_source: '当天16点前退仓并当天处理完成且在24小时内上架完成/唯品会到仓72小时内上架完成\n' +
            '=已上架数据/当月总销退数*100%',
            data_dep_head: '吕三华',
            data_provide_dep: '财务中心',
            assessee: '李青',
            warehouse_code:'XSYLC'
          },
          {
            Indicator: '大货上架及时率',
            rate: '--',
            data_source: '当天扫码完成的需在48小时内上架完成\n' +
            '=已上架数据/当月扫码总数据*100%',
            data_dep_head: '吕三华',
            data_provide_dep: '财务中心',
            assessee: '李青',
            warehouse_code:'XSYLC'
          }
        ],
      }
    },
    mounted(){
      this.formSearch.start_date = Util.dateFormat(new Date(),'yyyy-MM') + '-01';
      this.formSearch.end_date = Util.dateFormat(new Date(),'yyyy-MM-dd');
    },
    activated(){
      this.search();
    },
    methods:{
      search(){
        this.logistics_center();
        this.select_warehouse_kpi('XSYLC');
        this.select_warehouse_kpi('XSGLC');
      },
      handleReset(){
        this.formSearch.start_date = Util.dateFormat(new Date(),'yyyy-MM') + '-01';
        this.formSearch.end_date = Util.dateFormat(new Date(),'yyyy-MM-dd');
        this.search();
      },
      logistics_center() {
        var data = JSON.parse(JSON.stringify(this.formSearch))
        data.start_date = Util.dateFormat(data.start_date, 'yyyy-MM-dd');
        data.end_date = Util.dateFormat(data.end_date, 'yyyy-MM-dd');
        this.request('logistics_center',{
          ver: '1',
          ts: Date.parse(new Date()),
          sign: '',
          methods: 'logistics_center',
          data: data
        },true).then(res => {
          if(res.code == 1){
            if(res.data.length > 0){
              this.wmscenterData[0].rate = res.data[0].inventory_error_rate;
              this.wmscenterData[1].rate = res.data[0].stockout_delayed_rate;
              this.wmscenterData[2].rate = res.data[0].stockin_delayed_rate;
            }
          }else{
            this.$Message.warning(res.msg);
          }
        })
      },
      select_warehouse_kpi(val){
        var data = JSON.parse(JSON.stringify(this.formSearch))
        data.start_date = Util.dateFormat(data.start_date, 'yyyy-MM-dd');
        data.end_date = Util.dateFormat(data.end_date, 'yyyy-MM-dd');
        data.warehouse_code = val;
        this.request('select_warehouse_kpi',{
          ver: '1',
          ts: Date.parse(new Date()),
          sign: '',
          methods: 'select_warehouse_kpi',
          data: data
        },true).then(res => {
          if(res.code == 1){
            if(res.data.length > 0){
              if(val == 'XSYLC'){
                this.ylwmsData[0].rate = res.data[0].inventory_error_rate;
                this.ylwmsData[1].rate = res.data[0].stockout_delayed_rate;
                this.ylwmsData[2].rate = res.data[0].stockout_error_rate;
                this.ylwmsData[3].rate = res.data[0].stockin_delayed_rate;
                this.ylwmsData[4].rate = res.data[0].qc_intime_rate
                this.ylwmsData[5].rate = res.data[0].return_intime_rate;
                this.ylwmsData[6].rate = res.data[0].stockin_intime_rate;
              }else{
                this.glwmsData[0].rate = res.data[0].inventory_error_rate;
                this.glwmsData[1].rate = res.data[0].stockout_delayed_rate;
                this.glwmsData[2].rate = res.data[0].stockout_error_rate;
                this.glwmsData[3].rate = res.data[0].stockin_delayed_rate;
                this.glwmsData[4].rate = res.data[0].qc_intime_rate;
                this.glwmsData[5].rate = res.data[0].return_intime_rate;
                this.glwmsData[6].rate = res.data[0].stockin_intime_rate;
              }
            }
          }else{
            this.$Message.warning(res.msg);
          }
        })
      },


    }
  }
</script>
