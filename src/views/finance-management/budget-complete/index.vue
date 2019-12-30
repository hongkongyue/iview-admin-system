<style>
</style>
<template>
 <div class="background-color-white exhibition">
     <Tabs value="name1">
        <TabPane label="收入预算" name="name1">
            <income_template :userInfo="userInfo"></income_template>
        </TabPane>
        <TabPane label="利润预算" name="name2">
            <profit_template :userInfo="userInfo"></profit_template>
        </TabPane>
        <TabPane label="平均库存预算" name="name3">
            <average_template :userInfo="userInfo"></average_template>
        </TabPane>
     </Tabs>
 </div>
</template>

<script>
import income_template from './income.vue';
import profit_template from './profit.vue';
import average_template from './average-stock.vue'
export default {

    name:"budget-complete",
    components:{
        income_template,
        profit_template,
        average_template
    },
    data(){
        return {
            userInfo: {},
        }
    },
    methods:{
        
    },
    mounted(){
        this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));    
    }
}
</script>
