<template>
  <div>
    <report_template orderType="DX" :orderId="$route.params.orderId"></report_template>
  </div>
</template>

<script>
  import report_template from '../common-page/report'
  export default {
    name: "agencysalesorder_return_report",
    components:{
      report_template
    }
  }
</script>

<style scoped>

</style>
