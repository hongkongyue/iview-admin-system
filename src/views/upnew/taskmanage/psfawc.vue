<template>
    <Layout>
        <Content>
                <Row class="background-color-white exhibition">
                    <div style="margin-bottom :20px; height:50px;background-color:#f5f7f9;text-align:left;line-height:50px;font-size:16px; font-weight: bold;padding-left: 20px;">
                    {{this.$route.query.taskCode}} / {{this.$route.query.taskName}}
                    </div>
                    <Table :columns="columns" size="small" highlight-row :data="List" @on-row-dblclick="edit"></Table>
                </Row>
                <Row type="flex" justify="center" class="background-color-white exhibition">
                <Col span='6' ><span>外拍视频摄影师：</span>{{ this.personA }}</Col>
                <Col span='6'><span>外拍图片摄影师：</span>{{ this.personB }}</Col>
                <!-- <Col span='6' ><span>静物图片摄影师：</span>{{ this.personC }}</Col> -->
                </Row>
       </Content>
    </Layout>   
</template> 

<script>
    import Util from 'libs/util';
    import axios from 'axios';
    export default {
        data(){
            return {
                columns: [
                    {
                        title: '名称',
                        key: 'name',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '上传状态',
                        key: 'shootingPlanStatus',
                        align: 'center',
                        minWidth:100,
                        render(h,params) {
                            if(params.row.shootingPlanStatus == 0){
                                return h('span', '未上传')
                            }else{
                                return h('span', '已上传')
                            }
                        },
                    },
                    {
                        title: '上传时间',
                        key: 'shootingPlanCreated',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '修改时间',
                        key: 'shootingPlanLastUpdated',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '文件名称',
                        key: 'shootingPlanFile',
                        align: 'center',
                        minWidth:100,
                        render: (h, params) => {
//                             let url = '/eop/productlaunch/deleteMatchPlan'
                            return  h('a',{
                                    on:{
                                'click':(event)=>{
                                    this.downLoad(params.row)
                                }
                            }
                        },params.row.shootingPlanFile ? params.row.shootingPlanFile : '')
                        }
                    },
                ],
                formSearch:{},
                List:[],
                personA:'- -',
                personB:'- -',
                personC:'- -',
                // CountDown:'2019-07-10-'//倒计时
            }
        },
        mounted(){
          this.getData();
          this.getPlanner()
        },
        activated(){

        },
        methods:{
            getData(){
                let data = {}
                data.taskCode = this.$route.query.taskCode
                this.request('getTaskShootingPlanDetail', {data}, false).then((res) => {
                    if(res.code==1){
                        this.List = res.data.details
                    }
                })
            },
             //获取默认摄影师
            getPlanner(){
                 let data = {}
                data.taskCode = this.$route.query.taskCode
                this.request('getTaskShootingPlanDetailPlanner', {data}, false).then((res) => {
                    if(res.code==1){
                        this.personA = res.data.outdoorVideoUser
                        this.personB = res.data.outdoorPhotoUser
                        this.personC = res.data.stillLifeUser
                    }
                })
            },
             downLoad(params){
                console.log(params)
                let data = {}
                data.fileUrl = params.shootingPlanUrl
                data.taskCode = this.$route.query.taskCode
                data.fileName = params.shootingPlanFile
                let zhan = this.formatParams(data)
                location.href=(`/eop/productlaunch/downloadFile?${zhan}`)
            },
            formatParams(data) {
                var arr = [];
                for (var name in data) {
                arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
                }
                return arr.join("&");
            },
        }
    }

</script>

<style>
 
</style>