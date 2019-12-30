<style>
</style>
<template>
   <staffsalesorder_list_template order-type="NG" page-type="list"></staffsalesorder_list_template>
</template>
<script>
import staffsalesorder_list_template from './template/list.vue';
export default {
    name:"staffsalesorder_list",
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

