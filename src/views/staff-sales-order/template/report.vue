<style>
</style>
<template>
  <div class="background-color-white exhibition">
    <Row v-if="false">
      <Col span="24" class="search">
      <Form :model="searchForm" ref="searchForm" :label-width="80" :rules="ruleValidate" inline label-position="right">
        <FormItem label="订单日期:" prop="start_date">
          <DatePicker type="date" v-model="searchForm.start_date" format="yyyy-MM-dd" placeholder="选择开始日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="" prop="end_date">
          <DatePicker type="date" v-model="searchForm.end_date" format="yyyy-MM-dd" placeholder="选择结束日期" style="width: 200px"></DatePicker>
        </FormItem>
         <Form-item v-if="orderType=='LY,JY'" label="订单类型：">
          <Select style="width:162px" v-model="searchForm.orderType" placeholder="请选择">
              <Option value="领用">领用</Option>
              <Option value="借用">借用</Option>
          </Select>
         </Form-item>
        <FormItem label="分页">
          <Checkbox v-model="searchForm.pageVisible"></Checkbox>
        </FormItem>
        <FormItem :label-width="1">
          <Button type="primary" @click="search('searchForm')" icon="ios-search">搜索</Button>
          <Button type="default" @click="handleReset('searchForm')" >重置</Button>
        </FormItem>
      </Form>
      </Col>
    </Row>
    <div ref="report-content" id="report-content" >
        <iframe id="report" :src="report_href" name="ifd"
        style="height:inherit"
        width="100%" scrolling="no"
        frameborder="0">
      </iframe>
    </div>
  </div>
</template>

<script>
import Util from '../../../libs/util';
export default {
    name:"staffsalesorder_report_template",
    props: {
        orderType: String
    },
    data(){
        return {
            pageHeight:600,
            pageStyle:{
              height:this.pageHeight+'px;'
            },
            orderId: '',
            report_href:'',
            searchForm:{
                orderType:'借用',
                pageVisible:false
            },
            ruleValidate: {
                start_date: [
                    { required: true, type:'date', message: '请选择开始日期', trigger: 'blur' }
                ],
                end_date:[
                    {required: true, type: 'date', message: '请选择结束日期', trigger: 'blur'}
                ]
          }
        }
    },
    methods:{
        cjkEncode(text){
        if(text == null){
          return ""
        }
        var newText = "";
        for(var i = 0;i<text.length;i++){
          var code = text.charCodeAt(i);
          if(code >= 128 || code == 91 || code == 93){
            newText += "[" + code.toString(16) + "]";
          }else{
            newText += text.charAt(i)
          }
        }
        return newText;
      },
        handleReset(){
           this.searchForm={};
           this.search();
        },
        search(){
            let startDate = Util.dateFormat(this.searchForm.start_date,'yyyy-MM-dd');
            let endDate = Util.dateFormat(this.searchForm.end_date,'yyyy-MM-dd');
            let reportType='';
            if(this.orderType=='NG'){
                reportType='NG_orders_list';
            }else if(this.orderType=='LY,JY'){
                reportType='JLY_orders_list';
            }else if(this.orderType=='DX'){
                reportType='DX_orders_list';
            }else if(this.orderType=='FY'){
                reportType='FY_orders_list';
            }
            this.$refs["searchForm"].validate((valid) => {
            if (valid) {
                this.report_href = `/WebReport/ReportServer?reportlet=${reportType}.cpt&__bypagesize__=${this.searchForm.pageVisible}&start_date=${startDate}&end_date=${endDate}`;
              if(this.orderType=='LY,JY'&&this.searchForm.orderType&&this.searchForm.orderType!='全部'){

                this.report_href = `/WebReport/ReportServer?reportlet=${reportType}.cpt&order_type=${this.searchForm.orderType}&__bypagesize__=${this.searchForm.pageVisible}&start_date=${startDate}&end_date=${endDate}`
                this.report_href = this.cjkEncode(this.report_href)
              }
            } else {
              this.$Message.error('请选择开始和结束日期');
            }
          });
        }
    },
    created(){
    },
    mounted(){
        if(this.orderType == 'DX'){
            this.report_href = "/WebReport/ReportServer?reportlet=DX_orders_list.cpt"
        }
       this.$refs['report-content'].style.height=window.innerHeight-220+'px'
       const that = this;
       window.onresize = function temp() {
         that.$refs['report-content'].style.height=window.innerHeight-220+'px'
       };
    }
}
</script>

