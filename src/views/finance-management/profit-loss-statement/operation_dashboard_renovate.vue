<template>
    <div class="background-color-white exhibition" id="operation_dashboard_renovate">
        <Row class="margin-bottom-10">
            <Col span="24">
                <Alert>损益看板更新</Alert>
                <DatePicker type="date" v-model="startDate" :options="board_pickerOptions" split-panels placeholder="请选择开始日期" style="width: 200px"></DatePicker>
                <DatePicker type="date" v-model="endDate" :options="board_pickerOptions" split-panels placeholder="请选择结束日期" style="width: 200px;margin-left:10px"></DatePicker>
                <Button type="primary" style="margin-left:10px;" @click="update_operation_dashboard" :disabled='odr_btn_status != 1'>更新</Button> 
            </Col>
            <Col span="24" class="margin-top-40">
                <Alert>唯品会数据同步</Alert>
                <DatePicker type="date" v-model="vip_analysis_renovate.startDate" :options="vip_pickerOptions" split-panels placeholder="请选择开始日期" style="width: 200px"></DatePicker>
                <DatePicker type="date" v-model="vip_analysis_renovate.endDate" :options="vip_pickerOptions" split-panels placeholder="请选择结束日期" style="width: 200px;margin-left:10px"></DatePicker>
                <Button type="primary" style="margin-left:10px;" @click="refresh_vip" :disabled='vip_update_btn_status != 1'>更新</Button> 
            </Col>
            <Col span="24" class="margin-top-40">
                <Alert>损益决算看板更新</Alert>
                <DatePicker type="month" v-model="update_final_account.startMonth" split-panels placeholder="请选择开始月份" style="width: 200px" @on-change='bi_final_board_version'></DatePicker>
                <DatePicker type="month" v-model="update_final_account.endMonth" split-panels placeholder="请选择结束月份" style="width: 200px;margin-left:10px" @on-change='bi_final_board_version'></DatePicker>
                <Select style="width:150px;margin-left:10px" v-model.number="update_final_account.versionNumber" @on-change='change' placeholder="请选择版本">
                    <Option v-for="item in version_list" :value="item.value" :key="item.value">
                        {{ item.label }}
                    </Option>
                </Select>
                <Button type="primary" style="margin-left:10px;" @click="refresh_final_account" :disabled='final_broad_update_btn_status != 1'>更新</Button> 
            </Col>
            <Col span="24" class="margin-top-40">
                <Alert>销售数据更新</Alert>
                <DatePicker type="date" v-model="sales_renovate.startDate"  split-panels placeholder="请选择开始日期" style="width: 200px"></DatePicker>
                <DatePicker type="date" v-model="sales_renovate.endDate"  split-panels placeholder="请选择结束日期" style="width: 200px;margin-left:10px"></DatePicker>
                <Button type="primary" style="margin-left:10px;" @click="refresh_sales" >更新</Button> 
            </Col>
        </Row>
    </div>
</template>

<script>
    import Util from 'libs/util';
    import socket from 'libs/socket';
    import {mapState} from 'vuex';
    
    function vip_analysis_renovate(){
        return {
            startDate:'',
            endDate:''
        }
    }

    function update_final_account(){
        return {
            startMonth:'',
            endMonth:'',
            versionNumber:''
        }
    }

    export default {
        name: "operation_dashboard_renovate",
        data() {
            return {
                version_list:[],
                vip_analysis_renovate:vip_analysis_renovate(),
                update_final_account:update_final_account(),
                startDate:'',
                endDate:'',
                board_pickerOptions:{
                    disabledDate(time) {
                        // return time.getTime() > Date.now() - 8.64e6 - 1000 * 60 * 60 * 24
                        return false
                    }
                },
                vip_pickerOptions: {
                    disabledDate(time) {
                        // return Date.now() - 8.64e6 - 1000 * 60 * 60 * 24 * 4 > time.getTime() || time.getTime() > Date.now() - 8.64e6 - 1000 * 60 * 60 * 24
                         return false
                    }
                },
                userInfo:{},
                sales_renovate:{}
            }
        },
        computed:{
            ...mapState({
                odr_btn_status:state => state.common.board_update_btn_status,
                vip_update_btn_status:state => state.common.vip_update_btn_status,
                final_broad_update_btn_status:state => state.common.final_broad_update_btn_status
            })
        },
        mounted() {
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));  
        },
        activated(){
            this.get_broad_status();
            this.get_vip_status();
            this.bi_final_board_version(); 
            this.get_final_board_status();                 
        },
        methods: {
            get_broad_status(){
                this.request('get_broad_status',{},false).then(res=>{
                    if(res.code == 1){
                        this.$store.dispatch('save_update_btn_status',{
                            type:'broad',
                            status:res.data.status
                        });
                    }
                });
            },
            get_vip_status(){
                this.request('get_vip_status',{},false).then(res=>{
                    if(res.code == 1){
                        this.$store.dispatch('save_update_btn_status',{
                            type:'vip',
                            status:res.data.status
                        });
                    }
                });
            },
            get_final_board_status(){
                this.request('get_final_board_status',{},false).then(res=>{
                    if(res.code == 1){
                        this.$store.dispatch('save_update_btn_status',{
                            type:'refresh_final_broad',
                            status:res.data.status
                        });
                    }
                });
            },
            update_operation_dashboard(){
                if(!this.startDate || !this.endDate){
                    this.$Message.warning('请选择起始日期！')
                    return false;
                }
                socket({
                    userId:this.userInfo.userId,
                    type:'refresh_broad',
                    startDate:Util.dateFormat(this.startDate,'yyyy-MM-dd'),
                    endDate:Util.dateFormat(this.endDate,'yyyy-MM-dd')
                })
            },
            refresh_vip(){
                if(!this.vip_analysis_renovate.startDate || !this.vip_analysis_renovate.endDate){
                    this.$Message.warning('请选择起始日期！')
                    return false;
                }
                socket({
                    userId:this.userInfo.userId,
                    type:'refresh_vip',
                    startDate:Util.dateFormat(this.vip_analysis_renovate.startDate,'yyyy-MM-dd'),
                    endDate:Util.dateFormat(this.vip_analysis_renovate.endDate,'yyyy-MM-dd')
                })
            },
            bi_final_board_version(){
                let data = Util.deepClone(this.update_final_account);
                
                if(data.startMonth){
                    data.startMonth = Util.dateFormat(this.update_final_account.startMonth,'yyyy-MM');
                }
                if(data.endMonth){
                    data.endMonth = Util.dateFormat(this.update_final_account.endMonth,'yyyy-MM');
                }
                
                delete data.versionNumber;
                this.request('bi_final_board_version',{
                    data:data
                },true).then(res=>{
                    if(res.code == 1){
                        this.version_list = [];
                        res.data.map(x=>{
                            this.version_list.push({
                                label:'V' + x + '.0',
                                value:x
                            })
                        })
                        this.version_list = this.version_list.sort((x,y)=>{
                            return x.value - y.value
                        })
                    }
                })
            },
            refresh_final_account(){
                let data = Util.deepClone(this.update_final_account);
                
                if(!data.startMonth && !data.endMonth){
                    this.$Message.warning('请选择更新月份！');
                    return false;
                }
                if(!data.versionNumber){
                    this.$Message.warning('请选择要更新的版本！');
                    return false;
                }
                if(data.startMonth){
                    data.startMonth = Util.dateFormat(this.update_final_account.startMonth,'yyyy-MM');
                }
                if(data.endMonth){
                    data.endMonth = Util.dateFormat(this.update_final_account.endMonth,'yyyy-MM');
                }
                data.userId = this.userInfo.userId,
                data.type = 'refresh_final_broad';
                socket(data);
            },
            refresh_sales(){
                let data = Util.deepClone(this.sales_renovate);
                
                if(!data.startDate && !data.endDate){
                    this.$Message.warning('请选择日期！');
                    return false;
                }
                if(data.startDate){
                    data.startDate = Util.dateFormat(this.sales_renovate.startDate,'yyyy-MM-dd');
                }
                if(data.endDate){
                    data.endDate = Util.dateFormat(this.sales_renovate.endDate,'yyyy-MM-dd');
                }
                data.userId = this.userInfo.userId,
                data.type = 'refresh_sale_OMS';
                socket(data);
            }
        }
    }
</script>

<style>

</style>
