<template>
<div id="post">
    <Row class="margin-bottom-10 background-color-white exhibition">
        <Col span="24">
        <Form :model="formSearch"  ref="formSearch" :label-width="90" inline label-position="right">
            <Form-item label="收货：">
                 <Input v-model="formSearch.return_code" placeholder="请输入退货单号"/>    
            </Form-item><Button type="primary" @click="checkMoneyBack">收货</Button>
            <Form-item label="发货：">
                 <Input v-model="formSearch.order_id"    placeholder="请输入订单号" />  
            </Form-item>
             <Button type="primary" @click="checkMoneyBack2">发货</Button>
        </Form>
        </Col>
    </Row>
</div>
</template>

<script>
export default {
    data() {
        return {
            formSearch: {
                       
            },
            
        }
    },
    mounted() {
        this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
    },
    activated() {
       
    },
    updated(){
            
    },
    methods: {
        checkMoneyBack(){
                 let data={}
                     data.return_code=this.formSearch.return_code
                    this.request('eom_est_stockin', {
                            data: data
                        }, true).then(res => {
                            if (res.code == 1) {
                                   this.$Message.success(res.msg)
                            }else{
                                 this.$Message.error(res.msg)
                            }
                        })
               },
                checkMoneyBack2(){
                 let data={}
                     data.order_id=this.formSearch.order_id
                    this.request('eom_test_ship_order', {
                            data: data
                        }, true).then(res => {
                            if (res.code == 1) {
                                   this.$Message.success(res.msg)
                            }else{
                                 this.$Message.error(res.msg)
                            }
                        })
               },
    }
}
</script>

<style>
.el-table td,
.el-table th {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
}
  .el-checkbox__input {
  display: none
}
.el-checkbox__input {
    display:block
}
.ivu-tree-empty{
    padding-left: 20px;
}
</style>
