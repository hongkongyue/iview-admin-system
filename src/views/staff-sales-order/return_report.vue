<template>
  <div>
    <report_template orderType="NG" :orderId="$route.params.orderId"></report_template>
  </div>
</template>

<script>
  import report_template from '../common-page/report'
  export default {
    name: "staffsalesorder_return_report",
    components:{
      report_template
    }
  }
</script>

<style scoped>

</style>
