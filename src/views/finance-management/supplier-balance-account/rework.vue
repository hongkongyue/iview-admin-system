<template>
    <div>
        <report_template orderType="FXDZ" :orderId="$route.params.orderId"></report_template>
    </div>
</template>

<script>
    import report_template from '../../common-page/report'
    export default {
        name: "balance_account_rework",
        components:{
            report_template
        }
    }
</script>

<style scoped>

</style>
