<style>
</style>
<template>
   <staffsalesorder_list_template order-type="NG" page-type="check"></staffsalesorder_list_template>
</template>

<script>
import staffsalesorder_list_template from './template/list.vue';
export default {

    name:"staffsalesorder_check",
    components:{
        staffsalesorder_list_template
    },
    data(){
        return {
            orderId: '',
        }
    },
    methods:{
        
    },
    mounted(){

    }
}
</script>

