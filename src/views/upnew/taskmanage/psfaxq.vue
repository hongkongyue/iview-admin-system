<template>
    <Layout>
        <Content>
                <Row class="background-color-white exhibition">
                    <div style="margin-bottom :20px; height:50px;background-color:#f5f7f9;text-align:left;line-height:50px;font-size:16px; font-weight: bold;padding-left: 20px;">
                    {{this.$route.query.taskCode}} / {{this.$route.query.taskName}} <Button style="margin-top:10px;margin-right:20px;float:right" type="primary" @click="submit">提交</Button>
                    </div>
                    <Table :columns="columns" size="small" highlight-row :data="list1" @on-row-dblclick="edit"></Table>
                    <Col span="24" style="padding-left:7px;margin-top:20px">
                        <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="80" inline
                        label-position="right" style="100px">
                            <Form-item label="外拍视频摄影师:" :label-width="140">
                                <Select v-model="formSearch.optionsBm" filterable style="width:150px">
                                    <Option v-for="item in personList" :value="item.name" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </Form-item>
                            <Form-item label="外拍图片摄影师:" :label-width="140">
                                <Select v-model="formSearch.optionsBm1" filterable style="width:150px">
                                    <Option v-for="item in personList" :value="item.name" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </Form-item>
                            <!-- <Form-item label="静物图片摄影师:" :label-width="140">
                                <Select v-model="formSearch.optionsBm2" filterable style="width:150px">
                                    <Option v-for="item in personList" :value="item.name" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </Form-item> -->
                            <!-- <Form-item :label-width="1">
                                
                            </Form-item> -->
                          
                        </Form>
                             <span style="padding-left:32px;color:#999"> *如需用到外部摄影师，可选择内部企划/主管跟进</span>
                    </Col>
                </Row>
                 <Modal
                v-model="visible"
                title="批量导入">
                <div>
                    <Upload
                        ref="upload"
                        name="file"
                        :show-upload-list="false"
                        :before-upload="handleUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        type="drag"
                        :action = "this.url"
                        :data = "{userName:this.userInfo.userName,taskCode:this.$route.query.taskCode,fileName:this.name}"
                    >
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或将文件拖拽到此处</p>
                    </div>
                    </Upload>
                    <div v-if="file !== null">{{ file.name }}
                    <Button type="text"
                            :loading="loadingStatus">{{ loadingStatus ? '上传中...' : '' }}
                    </Button>
                    </div>
                </div>
                <div slot="footer">
                    <Button type="default" @click="cancel">取消</Button>
                    <Button type="primary" @click="upload">导入</Button>
                </div>
            </Modal>
       </Content>
    </Layout>  
     
</template> 

<script>
   import Util from 'libs/util';
    import axios from 'axios';

    export default {
        data(){
            return {
                columns: [{
                        title: '名称',
                        key:'name',
                        align: 'center',
                        minWidth: 100,
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
                    {
                        title: '操作',
                        key: 'operate',
                        minWidth: 220,
                        fixed: 'right',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: (e) => {
                                            this.handleSave(params.row)
                                        }
                                    }
                                }, '上传'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: (e) => {
                                            this.handleDelete(params.row)
                                        }
                                    }
                                }, '删除'),
                            ])
                        }
                    }
                ],
                url:'',
                loadingStatus:false,
                file:null,
                taskNumber:'',//任务编号
                formSearch:{},
                name:'',
                visible:false,
                visible1:false,
                visible2:false,
                personList:[],
                list1:[],
                List:[],
                list2:[],
                userInfo:{}
            }
        },
        mounted(){
            
            this.getData();
            this.getPlanner()
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo')); 
            this.getPerson();
            
        },
        activated(){

        },
        updated() {
            // this.getData() //获取数据
        },
        methods:{
            getData(){
                let data = {}
                data.taskCode = this.$route.query.taskCode
                this.request('getTaskShootingPlanDetail', {data}, false).then((res) => {
                    if(res.code==1){
                        this.list1 = res.data.details
                    }
                })
            },
            //获取默认摄影师
            getPlanner(){
                 let data = {}
                data.taskCode = this.$route.query.taskCode
                this.request('getTaskShootingPlanDetailPlanner', {data}, false).then((res) => {
                    if(res.code==1){
                        this.formSearch.optionsBm =  res.data.outdoorVideoUser
                        this.formSearch.optionsBm1 = res.data.outdoorPhotoUser
                        this.formSearch.optionsBm2 = res.data.stillLifeUser
                    }
                })
            },
            getPerson(){
                this.request('get_examine_post_list', {
                   }, false).then((res) => {
                           this.personList = res.data
                   })
            },
            //提交之后进入完成页 
            submit(){
                if(this.list1[0].shootingPlanFile == null && this.list1[1].shootingPlanFile == null){
                this.$Message.warning('请至少上传一个文件再提交')
                
            }else if(this.formSearch.optionsBm == undefined || this.formSearch.optionsBm1 == undefined){
                this.$Message.warning('请先选择摄影师再提交')
            }else{
                 let data = {}
                    data.outdoorVideoName = this.formSearch.optionsBm
                    data.outdoorPhotoName = this.formSearch.optionsBm1
                    // data.stillLifeName = this.formSearch.optionsBm2
                    data.taskCode = this.$route.query.taskCode
                    data.lastUpdateUser = this.userInfo.userName
                    this.request('submitTaskShootingPlan', {data}, false).then((res) => {
                    if(res.code==1){
                        this.$Message.success('提交成功')
                        this.list1 = []
                        this.formSearch.optionsBm = ''
                        this.formSearch.optionsBm1 = ''
                        this.formSearch.optionsBm2 = ''
                        this.$router.push({
                            name: 'psfawc',
                            query: {
                                taskCode: this.$route.query.taskCode,
                                taskName:this.$route.query.taskName
                            }
                        });
                    }
                    })
            }
            },
             search(){
                this.page = 1;
                this.getData();
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
            handleSave(row){
                console.log(row)
                this.visible = true
                if(row.name == "拍摄方案"){
                    this.url = "/eop/productlaunch/uploadShootingPlan"
                    console.log(url)
                }else if(row.name == "搭配方案"){
                   this.url = "/eop/productlaunch/uploadMatchPlan"
                }else if(row.name == "静物方案"){
                    this.url = "/eop/productlaunch/uploadStillLifePlan"
                }
            },
            cancel(){
                this.visible = false;
                this.file = null;
            },
            upload(){
                if(this.file == null){
                    this.$Message.warning('请先上传文件再导入')
                }else{
                    this.loadingStatus = true;
                    Vue.prototype.$loading('正在导入数据...');
                    this.$refs.upload.post(this.file);
                }
            },
            //上传之前
            handleUpload(file) {
                console.log(file)
                if (!/\.jpe$|.xlsx$|.jpg$|.doc$|.docx$|.png$|.csv$|.doc$|.wps$|.txt$|.pdf$|.ppt$|.pptx$|.dotx$|.bmp$|.xls$/.test(file.name)) {
                    this.$Message.warning('文件类型不符,请重新选择文件');
                    return false
                } else {
                    this.file = file;
                    console.log(this.file)
                    this.name = file.name
                console.log(this.name)
                    return false;
                }
                
            },
            //上传成功之后
            uploadSuccess(res, file) {
                Vue.prototype.$loading.close();
                if (res.code == '1') {
                    this.loadingStatus = false;
                    this.file = null;
                    this.$Message.success(res.msg);
                    this.visible = false;
                    this.search();
                } else {
                    this.loadingStatus = false;
                    this.$Message.error({
                        content: res.msg,
                        duration: 3
                    });
                }
            },
           uploadError(res, file) {
                this.$Message.error(res.msg);
            },
            handleSaveT(row){
                this.$router.push({
                    name: 'department-review-detail',
                    params: {
                        reviewId: row.id,
                    }
                });
            },
            //删除上传文件
            handleDelete(row){
                if(row.name == "拍摄方案"){
                    console.log(row,'[p[p[p[')
                    let data = {}
                    data.shootingPlanUrl = row.shootingPlanUrl
                    data.taskCode = this.$route.query.taskCode
                    data.lastUpdateUser = this.userInfo.userName
                    this.request('deleteShootingPlan', {data}, false).then((res) => {
                    if(res.code==1){
                       this.$Message.success("删除拍摄方案文件成功")
                       this.search()
                    }
                })
                }else if(row.name == "搭配方案"){
                    console.log(row,'[p[p[p[')
                    let data = {}
                    data.matchPlanUrl = row.shootingPlanUrl
                    data.taskCode = this.$route.query.taskCode
                    data.lastUpdateUser = this.userInfo.userName
                    this.request('deleteMatchPlan', {data}, false).then((res) => {
                    if(res.code==1){
                       this.$Message.success("删除拍摄方案文件成功")
                       this.search()
                    }
                })
                }else if(row.name == "静物方案"){
                    console.log(row,'[p[p[p[')
                    let data = {}
                    data.stilllifePlanUrl = row.shootingPlanUrl
                    data.taskCode = this.$route.query.taskCode
                    data.lastUpdateUser = this.userInfo.userName
                    this.request('deleteStillLifePlan', {data}, false).then((res) => {
                    if(res.code==1){
                       this.$Message.success("删除拍摄方案文件成功")
                       this.search()
                    }
                })
                }
            },
        }
    }

</script>

<style>
 
</style>