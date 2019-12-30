<template>
    <div class="background-color-white exhibition" id="data_integration">
        <Row type="flex" justify="space-between">
          <Col  v-for="item in data" span="6" v-bind:key="item.fee_type" style="padding-right:3px">
    <div class="ivu-table-wrapper">
        <div class="ivu-table  ivu-table-small ivu-table-border">
            <!---->
            <div class="ivu-table-header">
                <table cellspacing="0" cellpadding="0" border="0" style="width:100%;" >
                    <colgroup>
                        <!-- <col width="418">
                        <col width="418">
                        <col width="418"> -->
                        <!---->
                    </colgroup>
                    <thead>
                        <tr>
                            <th class="">
                                <div class="ivu-table-cell"><span class="">费用类型</span>
                                </div>
                            </th>
                            <th class="">
                                <div class="ivu-table-cell"><span class="">店铺</span>
                                </div>
                            </th>
                            <th class="">
                                <div class="ivu-table-cell"><span class="">金额</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="ivu-table-body">
                <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                    <colgroup>
                        <!-- <col width="418">
                        <col width="418">
                        <col width="418"> -->
                    </colgroup>
                    <tbody class="ivu-table-tbody">
                        <template v-for="(dataItem,index) in item.list">

                       <tr v-bind:key="dataItem.shop_name" class="ivu-table-row">
                            <td v-if="index==0" :rowspan="item.list.length" class="">
                                <div class="ivu-table-cell">
                               <span>{{dataItem.fee_type}}</span>
                                </div>
                            </td>
                            <td class="">
                                <div class="ivu-table-cell">
                                <span>{{dataItem.shop_name}}</span>
                                </div>
                            </td>
                            <td class="">
                                <div class="ivu-table-cell">
                               <span>{{dataItem.spend}}</span>

                                </div>
                            </td>
                        </tr>
                        </template>
                           <tr class="ivu-table-row">
                            <td  class="">
                                <div class="ivu-table-cell">
                               <span>合计</span>
                                </div>
                            </td>
                            <td colspan="2" class="">
                                <div class="ivu-table-cell">
                                <span style="color:red">{{item.totalSpend}}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
   </Col>
   </Row>
    </div>
</template>
    
<script>
    export default {
        name:'data_integration',
        data(){
            return {
                formSearch:{}
            }
        },
         props: {
            data: Array
        },
    }
</script>

<style>
    
</style>

