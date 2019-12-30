<style>
</style>
<template>
  <div class="background-color-white exhibition">
    <div v-if="$route.params.type != 'edit'">
      <staffsalesorder_detail_template order-type="LY,JY"></staffsalesorder_detail_template>
    </div>
    <div v-else>
      <staffsalesorder_add_template></staffsalesorder_add_template>
    </div>
    <!--<Tabs :value="activeTable" @on-click="tabClick">-->
      <!--<TabPane label="申请信息" name="apply">-->
        <!--<div v-if="$route.params.type != 'edit'">-->
          <!--<staffsalesorder_detail_template order-type="LY,JY"></staffsalesorder_detail_template>-->
        <!--</div>-->
        <!--<div v-else>-->
          <!--<staffsalesorder_add_template></staffsalesorder_add_template>-->
        <!--</div>-->
      <!--</TabPane>-->
      <!--<TabPane label="归还信息" name="return">-->
        <!--<staffsalesorder_return_template></staffsalesorder_return_template>-->
      <!--</TabPane>-->
    <!--</Tabs>-->
  </div>
</template>

<script>
import staffsalesorder_detail_template from '../staff-sales-order/template/detail.vue';
import staffsalesorder_return_template from './template/return'
import staffsalesorder_add_template from './template/add'
import { mapState } from 'vuex'
export default {
    name:"staffsamplecoat_Detail",
     components:{
        staffsalesorder_detail_template,
        staffsalesorder_return_template,
        staffsalesorder_add_template
    },
    data(){
        return {
        }
    },
    computed:{
      ...mapState({
        activeTable:state => state.order.staffSampleCoatDetail_ActiveTable
      })
    },
    methods:{
      tabClick(val){
        this.$store.dispatch('setStaffSampleCoatDetail_ActiveTable',val);
      }
    },
    mounted(){
    }
}
</script>

