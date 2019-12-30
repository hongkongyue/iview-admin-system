<template>
        <div>
             <Row class="margin-bottom-10 background-color-white exhibition" style="padding-left:20px">
                <Tabs type="card">
                        <TabPane label="待完成">
                            <wait></wait>
                        </TabPane>
                        <TabPane label="进行中" >
                            <going></going>
                        </TabPane>
                        <TabPane label="已完成">
                            <completed></completed>
                        </TabPane>
                </Tabs>
             </Row>
       </div>
</template> 

<script>
    import Util from 'libs/util'
    import wait from '../addComponent/photooutsidewait.vue'
    import going  from '../addComponent/photooutsideing.vue'
    import completed from '../addComponent/photooutsided.vue'
    function formSearch() {
        return {
            search: ''
        }
    }
    export default {
        data() {
            return {
            }
        },
        components:{
                  wait,
                  going,
                  completed
        },
        mounted() {
        },
        activated() {

        },
        methods: {
          
             
        }       
    }
</script>

<style>
    .ivu-modal-footer{
        border-top:0;
    }
        .demo-upload-list{
            display: inline-block;
            width: 60px;
            height: 60px;
            text-align: center;
            line-height: 60px;
            border: 1px solid transparent;
            border-radius: 4px;
            overflow: hidden;
            background: #fff;
            position: relative;
            box-shadow: 0 1px 1px rgba(0,0,0,.2);
            margin-right: 4px;
        }
        .demo-upload-list img{
            width: 100%;
            height: 100%;
        }
        .demo-upload-list-cover{
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,.6);
        }
        .demo-upload-list:hover .demo-upload-list-cover{
            display: block;
        }
        .demo-upload-list-cover i{
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            margin: 0 2px;
        }
</style>
