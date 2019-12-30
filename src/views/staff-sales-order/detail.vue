<style>
</style>
<template>
  <div class="background-color-white exhibition">
    <Tabs :value="activeTable" @on-click="tabClick">
      <TabPane label="申请信息" name="apply">
        <staffsalesorder_detail_template order-type="NG"></staffsalesorder_detail_template>
      </TabPane>
      <!-- <TabPane label="退货信息" name="return" v-if="len > 0">
        <staffsalesorder_return_detail_template order-type="NG" :returnData="list"></staffsalesorder_return_detail_template>
      </TabPane> -->
    </Tabs>
  </div>
</template>
<script>
  import staffsalesorder_detail_template from './template/detail-v2.vue';
  import staffsalesorder_return_detail_template from './template/return_detail'

  export default {
    name: "staffsalesorder_Detail",
    components: {
      staffsalesorder_detail_template,
      staffsalesorder_return_detail_template
    },
    data() {
      return {
        orderId: '',
        activeTable: '',
        list:{},
        len:0
      }
    },
    mounted() {
      // this.get_return_list();
    },
    methods: {
      get_return_list(){
        this.request('get_return_list',{
          data:{
            source_return_code:this.$route.params.orderId
          }
        },true).then(res=>{
          if(res.code == 1){
            res.data.refund_status='未退款';//退款状态
            if(res.data.refund_fee&&res.data.refund_fee==res.data.total_money){
              res.data.refund_status='退款成功';
            }else if(res.data.refund_fee){
                res.data.refund_status='部分退款';
            }
            this.list = res.data;
            this.len = res.data.return_order_list.length;
          }
        })
      },
      tabClick(value){

      }
    }
  }
</script>

