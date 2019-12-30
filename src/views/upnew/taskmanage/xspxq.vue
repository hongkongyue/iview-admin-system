<template>
    <Layout>
        <Content>
                <Row class="background-color-white exhibition">
                    <div style="margin-bottom :20px; height:50px;background-color:#f5f7f9;text-align:left;line-height:50px;font-size:16px; font-weight: bold;padding-left: 20px;">
                    {{this.$route.query.taskCode}} / {{this.$route.query.taskName}} <Button style="margin-top:10px;margin-right:20px;float:right" type="primary" @click="submit">提交</Button>
                    </div>
                     <Row class="margin-bottom-10 background-color-white exhibition">
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="完成进度:"  :label-width="80">
                    <Select v-model="formSearch.brandId" style="width:120px">
                        <Option v-for="item in list" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="大货款号:"  :label-width="80">
                     <Input v-model="formSearch.goodsNo" placeholder=""></Input>
                </Form-item>
                <Form-item :label-width="1">
                    <Button type="primary" @click="getData">查询</Button>
                    <Button type="default" @click="handleReset">重置</Button>
                    <Button type="primary" @click="clickAll">批量编辑</Button>
                     <!--<Button type="primary" @click="exportEmployee">导出</Button>-->
                </Form-item>
                </Col>
            </Form>
            
        </Row>
                   <!-- <Table :columns="columns" size="small" highlight-row :data="list" @on-row-dblclick="edit"></Table> -->
                    <Table style="margin-top:20px"  :columns="columns1" size="small" highlight-row :data="list1" @on-selection-change="clickSelect" @on-row-dblclick="edit"></Table>
                    <!-- <Col span="24" style="padding-left:7px;margin-top:20px">
                        <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="80" inline
                        label-position="right" style="text-align:center" >
                            <Form-item :label-width="1">
                                <Button style="margin-right:20px;" type="primary" @click="submit">提交</Button>
                            </Form-item>
                        </Form>
                    </Col> -->
                </Row>
                <Modal title="查看大图" v-model="visible"> 
                    <img :src="'data:image/png;base64,'+bigUlr" v-if="visible" style="width: 100%">
                </Modal>

                <Modal title="编辑" v-model="modalShow" :footer-hide='true' @on-cancel='cancelEdit'  :width="50"> 
                    <Form v-if="modalShow"  :label-width="80">
                     <Row class="margin-bottom-10 background-color-white exhibition">
                        <Col span="12" style="padding-left:7px">
                            <Form-item label="选视频路径:">
                                <Input v-model="formChange.shellWriter"  type="textarea" placeholder=""></Input>
                            </Form-item>
                        </Col>
                        <Col span="12" style="padding-left:7px">
                            <Form-item label="剪辑师:">
                                <Select v-model="formChange.second" filterable>
                                    <Option v-for="item in brandListAdd" :value="item.oaId" :key="item.oaId">{{item.name}}</Option>
                                </Select>
                            </Form-item>
                        </Col>
                     
                    </Row>
                        <Form-item :label-width="1" style="text-align:center">
                            <Button type="primary" @click="saveEdit">保存</Button>
                            <Button type="default" @click="cancelEdit">取消</Button>
                        </Form-item>
                    </Form>
                     </Row>
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
                columns1: [
                    {
                        type: 'selection',
                        width: 50,
                        align: 'center',
                        fixed: 'left',
                     },{
                        title: '序号',
                        type:'index',
                        align: 'center',
                        width: 60,
                    },
                    {
                        title: '完成进度',
                        key: 'subTaskStatus',
                        align: 'center',
                        minWidth:90,
                        render:(h,params) =>{
                            if(params.row.subTaskStatus == 0){
                                return h('span', '未完成')
                            }else{
                                return h('span', '已完成')
                            }
                        }
                    },
                      {
                        title: '图片',
                        key: 'imgUrl',
                        align: 'center',
                        width: 80,
                        fixed: 'left',
                        render: (h, params) => {
                           if(params.row.imgUrl){
                               return h('div',{
                                   style: {
                                                        height:'80px',
                                                        textAlign:'center',
                                                        lineHeight:'80px'
                                                },
                               },
                               [h('img', {         
                                           style: {
                                                        width: 'auto',
                                                        height: 'auto',
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        objectFit: 'cover'
                                                },
                                            domProps:{
                                                       src:this.host+params.row.imgUrl,
                                                       src:'data:image/png;base64,'+params.row.imgUrl,
                                             },
                                            on: {
                                                  click: () => {
                                                            //   this.bigUlr=params.row.imgUrl
                                                            //   this.visible=true;
                                                            this.getBigImgUrl(params.row.bigImgUrl)
                                                            }
                                                }
                                                    }, '')
                                                    
                                                    
                                    ])    
                           }else{
                                  return h('img', {
                                           style: {
                                                     display: 'inline-block',
                                                     height:'80px',
                                                },
                                            domProps:{
                                                       src:'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1562574299&di=846b4c904bd54d3c3821fa5938888c69&src=http://hbimg.b0.upaiyun.com/bdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658',
                                             },
                                            on: {
                                                  click: () => {  

                                                   }
                                                }
                                                    }, '');  
                           }             
                        }
                    },
                    {
                        title: '年份',
                        key: 'years',
                        align: 'center',
                        minWidth:80,
                    },
                    {
                        title: '季节',
                        key: 'season',
                        align: 'center',
                        minWidth:60,
                    },
                    {
                        title: '波段',
                        key: 'waveBand',
                        align: 'center',
                        minWidth:60,
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth:80,
                    },
                    {
                        title: '设计款号',
                        key: 'designGoodsNo',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '颜色',
                        key: 'color',
                        align: 'center',
                        minWidth:80,
                    },
                    {
                        title: '大货款号',
                        key: 'goodsNo',
                        align: 'center',
                        minWidth:90,
                        fixed: 'left',
                    },
                    {
                        title: '拍照样应到时间',
                        key: 'photoDateStr',
                        align: 'center',
                        minWidth:120,
                    },
                    {
                        title: '大货合同货期',
                        key: 'contractDateStr',
                        align: 'center',
                        minWidth:120,
                    },
                    {
                        title: '拍照样领取日期',
                        key: 'collectDateStr',
                        align: 'center',
                        minWidth:120,
                    },
                    {
                        title: '领取件数',
                        key: 'collectQty',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '延期天数',
                        key: 'delayDays',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                        minWidth:100,
                    },
                    {
                        title: '设计师',
                        key: 'designerName',
                        align: 'center',
                        minWidth:80,
                    },
                    {
                        title: '企划跟进人',
                        key: 'plannerName',
                        align: 'center',
                        minWidth:120,
                    },
                    {
                        title: '原视频路径',
                        key: 'originalVideoPath',
                        align: 'center',
                        minWidth:120,
                    },
                    {
                        title: '选视频路径',
                        key: 'chooseVideoPath',
                        align: 'center',
                        minWidth:200,
                        render: (h, params) => {
                            this.changeName = params.row.chooseVideoPath
                            if (params.row.$isEdit) {
                                return h('Input', {
                                    props: {
                                       value: this.list1[params.index].chooseVideoPath,
                                    },
                                    // on: {
                                    //     'on-change': (e) => {
                                    //         console.log(e.target.value)
                                    //        this.changeName = e.target.value
                                    //     }
                                    // },
                                    on: {
                                        "on-change": (e) => {
                                            // params.row.chooseVideoPath= e.target.value
                                            this.changeName = e.target.value
                                            if(e.target.value.length>200){
                                                this.$Message.warning('最大的输入长度为200字节')
                                                 params.row.chooseVideoPath= params.row.chooseVideoPath.substr(0,200)
                                            }
                                           
                                        }
                                    },
                                },
                                );
                            } else {
                                return h('span', params.row.chooseVideoPath)
                            }
                        },
                    },
                    // {
                    //     title: '剪辑负责人',
                    //     key: 'cutVideoName',
                    //     align: 'center',
                    //     minWidth:180,
                    //     render: (h, params) => {
                    //         this.changeTemplate = params.row.cutVideoName
                    //               if (params.row.$isEdit) {
                    //                  return h('Select', {
                    //                 props: {
                    //                     value: this.list1[params.index].cutVideoName
                    //                 },
                    //                 on: {
                    //                     "on-change": (event) => {
                    //                         this.changeTemplate = event
                    //                     }
                    //                 },
                    //             },
                    //           this.brandListAdd.map(function (item) {
                    //                 return h('Option', {
                    //                     props: {
                    //                         value:item.id
                    //                     }
                    //                 },item.name)
                    //             }))
                    //         } else {
                    //             return h('span', params.row.cutVideoName)
                    //         }
                    //     }
                    // },
                    {
                        title: '剪辑师',
                        key: 'cutVideoName',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                            this.changeTemplate = params.row.cutVideoOaId
                                  if (params.row.$isEdit) {
                                     return h('Select', {
                                    props: {
                                        value: this.list1[params.index].cutVideoName,
                                        filterable:true
                                        // placeholder:params.row.template
                                    },
                                    on: {
                                        "on-change": (event) => {
                                            console.log('11')
                                            let oaId = ''
                                            this.brandListAdd.map(function (item) {
                                            if(event == item.name){
                                                 oaId = item.oaId
                                                 console.log(oaId,event)
                                            }
                                           
                                })
                                console.log(params.row)
                                 this.changeTemplate = oaId
                                        }
                                    },
                                },
                              this.brandListAdd.map(function (item) {
                                    return h('Option', {
                                        props: {
                                            value:item.name
                                        }
                                    },item.name)
                                }))
                            } else {
                                return h('span', params.row.cutVideoName)
                            }
                        }
                    },
                    // {
                    //     title: '操作',
                    //     key: 'operate',
                    //     minWidth: 220,
                    //     fixed: 'right',
                    //     align: 'center',
                    //      render: (h, params) => {
                    //         return h('div', [
                    //             h('Button', {
                    //                 props: {
                    //                     type: 'primary',
                    //                     size: 'small'
                    //                 },
                    //                 style: {
                    //                     marginRight: '5px'
                    //                 },
                    //                 on: {
                    //                     click: (e) => {
                    //                         this.handleChange(params.row)
                    //                     }
                    //                 }
                    //             }, '编辑'),
                    //              h('Button', {
                    //                 props: {
                    //                     // type: 'info',
                    //                     size: 'small'
                    //                 },
                    //                 style: {
                    //                     marginRight: '5px'
                    //                 },
                    //                 on: {
                    //                     click: (e) => {
                    //                         this.handleEdit(params.row)
                    //                     }
                    //                 }
                    //             }, '取消'),
                    //             h('Button', {
                    //                 props: {
                    //                     type: 'primary',
                    //                     size: 'small'
                    //                 },
                    //                 style: {
                    //                     marginRight: '5px'
                    //                 },
                    //                 on: {
                    //                     click: (e) => {
                    //                         this.saveTable(params.row);
                    //                     }
                    //                 }
                    //             }, '保存'),
                    //         ])
                    //     }
                    // }
                ],
                formSearch:{},
                list1:[],
                list:[{name:'未完成',id:'0'},{name:'已完成',id:'1'}],
                changeName:'',
                bigUlr:'',
                host:'http://eopsit.eptison.com/eop/',
                visible:false,
                changeTemplate:'',
                brandListAdd:[],
                userInfo:'',
                modalShow:false,
                formChange:{},
                selectData:[],
                selectLength:[],
            }
        },
        mounted(){
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo')); 
            this.getData()
        },
        activated(){

        },
        methods:{
             getBigImgUrl(url){
                let data = {}
                data.bigImgUrl = url
                this.request('productlaunch_getGoodsImg', {data}, false).then((res) => {
                    if(res.code==1){
                        this.bigUlr = res.data
                        this.visible=true
                    }
                })
            },
            getData(){
                console.log(this.userInfo)
                let data = {}
                data.subTaskStatus = this.formSearch.brandId
                data.goodsNo = this.formSearch.goodsNo
                data.userId = this.userInfo.userId
                data.taskCode = this.$route.query.taskCode
                this.request('getTaskDetailByTaskCode', {data}, false).then((res) => {
                    if(res.code==1){
                        this.list1 = res.data
                    }
                })
            },
            handleReset(){
                this.formSearch = {}
            },
            //提交
            submit(){
                let status = ""
                this.list1.map(function(item){
                    if(item.subTaskStatus == 0){
                        console.log(item.subTaskStatus,'111111111')
                     status = "0"
                    }else{
                          status = "1"
                          console.log(item.subTaskStatus,'222222222')
                    }
                })
                if(status == "0"){
                    this.$Message.warning('请先完成任务，再提交！')
                }else{
                    let data = {}
                data.taskCode = this.$route.query.taskCode
                data.lastUpdateUser = this.userInfo.userName
                this.request('commit', {data}, false).then((res) => {
                     if(res.code==1){
                        //  this.$set(row, '$isEdit', false)
                         this.$Message.success(res.msg)
                         this.$router.push({
                            name: 'xspwcy',
                            query: {
                                taskCode: this.$route.query.taskCode,
                                taskName:this.$route.query.taskName
                    }
                });
                         
                     }
                })
                }
            },
            //保存
            saveTable(row){
                if(this.changeName == row.chooseVideoPath && this.changeTemplate == row.cutVideoOaId){
                    this.$Message.warning('请先编辑再保存')
                }else{
                    let data = []
                data.push({
                    id:row.taskDetailId,
                    lastUpdateUser : this.userInfo.userName,
                    chooseVideoPath : this.changeName,
                    cutVideoOaId : this.changeTemplate
                })
                 this.request('saveVideoPath', {data}, false).then((res) => {
                     if(res.code==1){
                         this.$Message.success("保存成功")
                         this.getData()
                     }
                })
                }
            },
            //编辑获取负责人
              handleChange(row){
                this.$set(row, '$isEdit', true)
                let data = {}
                data.postName = '剪辑'
                this.request('getDevelopEditorUserList', {data}, false).then((res) => {
                         this.brandListAdd = res.data
                })
            },
            clickAll(){
                if(this.selectLength.length < 1){
                    this.$Message.warning('请先选择再编辑！')
                }else{
                    this.modalShow = true,
                console.log('090909')
                 let data = {}
                data.postName = '剪辑'
                this.request('getDevelopEditorUserList', {data}, false).then((res) => {
                         this.brandListAdd = res.data
                })
                }
                
            },
            //编辑保存
            saveEdit(){
                let data = {}
                data.cutVideoOaId = this.formChange.second
                data.chooseVideoPath = this.formChange.shellWriter
                data.idList = this.selectData
                data.lastUpdateUser = this.userInfo.userName
                 this.request('saveVideoPath', {data}, false).then((res) => {
                     if(res.code==1){
                         this.$Message.success("保存成功")
                         this.getData()
                         this.modalShow = false
                     }
                })

            },
            //编辑取消
            cancelEdit(){
                this.formChange = {}
                this.modalShow = false
            },
            clickSelect(selection){
                this.selectLength = selection
                console.log(selection)
                 let data = []
                selection.map((item) => {
                    data.push(item.taskDetailId)
            })
             this.selectData = data

            },
            handleEdit(row){
                this.$set(row, '$isEdit', false)
            },
        }
    }

</script>

<style>
 
</style>