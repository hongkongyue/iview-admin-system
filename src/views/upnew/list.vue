<template>
    <div id='final_account_variable' class="background-color-white exhibition">
      <Row class="margin-bottom-10 background-color-white exhibition">
        <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="80" inline
                label-position="right" style="100px">
                <Form-item label="一级品类：" :label-width="80">
                    <Select style="width:150px" v-model="formSearch.platfromCode" @on-change='changeLv1(formSearch.platfromCode)' placeholder="请选择一级品类">
                        <Option v-for="item in levelList1" :value="item" :key="item.ID">
                            {{ item.MC }}
                        </Option>
                    </Select>          
                </Form-item>
                <Form-item label="二级品类：" >
                    <Select style="width:150px" v-model="formSearch.brandId" @on-change='changeLv2' placeholder="请选择二级品类">
                        <Option v-for="item in levelList2" :value="item.MC" :key="item.ID">
                            {{ item.MC }}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item label="属性:"  >
                    <Select  v-model="formSearch.versionNumber" filterable clearable ref="store"  style="width:150px" >
                        <Option v-for="item in version_list" :value="item.name" :key="item.name">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item :label-width="10">
                    <Button type="primary" @click="search">查询</Button> 
                    <Button type="default" @click="reset" >重置</Button> 
                    <Button type="primary" @click="newAdd">新增</Button> 
                </Form-item>
        </Form>
        </Row>
        <Row class="margin-top-10">
            <Button type="primary" @click="downTemplate" >下载模板</Button>                     
            <Button type="primary" @click="openModal" >导入</Button>                     
            <Button type="primary" @click="exportData" >导出</Button>                     
        </Row>
        <Row class="margin-top-10">
            <Col class="margin-bottom-10">
                <Table :columns="columns" size="small" :data="list"></Table>
            </Col>
            <Col>
                <Page :total="total" :page-size-opts="[10,20,30,40]" :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="CurrentChange" @on-page-size-change="SizeChange"></Page>
            </Col>
        </Row>        
        <div class="modal">
            <Modal
                v-model="importModal"
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
                        action="/eop/productlaunch/developClassTemplateConfig/importExcel"
                        :data="{createUer:userInfo.userName}"
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
             <Modal v-model="visible"  title="新增" :footer-hide='true' @on-cancel='cancelAdd'  :width="50" class-name="customize-modal-center">
            <Row class="margin-bottom-10 background-color-white exhibition">
                <Form  @keydown.native.enter.prevent="search" ref="formSearchs" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                 <Form-item label="一级品类:" >
                    <Select style="width:150px" v-model="formSearchs.platfromCode" @on-change='changeLv1Add(formSearchs.platfromCode)' placeholder="请选择一级品类">
                        <Option v-for="item in levelList1Add" :value="item" :key="item.MC">
                            {{ item.MC }}
                        </Option>
                    </Select>          
                </Form-item>
                <Form-item label="二级品类:" >
                    <Select style="width:150px" v-model="formSearchs.brandId" @on-change='changeLv2' placeholder="请选择二级品类">
                        <Option v-for="item in levelList2Add" :value="item" :key="item.MC">
                            {{ item.MC }}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item label="属性:"  >
                    <Select  v-model="formSearchs.userNameAdd" filterable  style="width:150px" >
                        <Option v-for="item in brandListAdd" :value="item.name" :key="item.name">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="选项:"  >
                    <Input v-model="formSearchs.options" type="textarea" placeholder="请输入选项，以“，”隔开" style="width:150px" />
                </Form-item>
                </Col>
            </Form>
            </Row>
            <Row>
            <Form-item :label-width="1" style="text-align:center">
                    <Button type="primary" @click="save">确定</Button>
                    <Button type="default" @click="cancelAdd">取消</Button>
                </Form-item>
            </Row>
        </Modal>
        </div>
    </div>
</template>

<script>
    import Util from 'libs/util';
    import axios from 'axios';

    export default {
        name:'list',
        data(){
            return {
                formSearch:{},
                formSearchs:{},
                visible:false,
                loadingStatus:false,
                importModal:false,
                changeTemplate:'',
                changeOptions:'',
                levelList1:[],
                levelList1Add:[],
                levelList2:[],
                levelList2Add:[],
                userInfo:{},
                file:null,
                platformList:[],
                brandList:[],
                brandListAdd:[],
                version_list:[],
                list:[],
                columns:[
                    {
                        title:'序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '一级品类',
                        key: 'firstClassLevel',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '二级品类',
                        key: 'secondClassLevel',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '属性',
                        key: 'template',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                                  if (params.row.$isEdit) {
                                     return h('Select', {
                                    props: {
                                        value: this.list[params.index].template
                                        // placeholder:params.row.template
                                    },
                                    on: {
                                        "on-change": (event) => {
                                            // params.row.userId= event
                                            console.log(event)
                                            this.changeTemplate = event
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
                                return h('span', params.row.template)
                            }
                        }
                    },
                    {
                        title: '选项',
                        key: 'options',
                        align: 'center',
                        minWidth: 200,
                        render: (h, params) => {
                            if (params.row.$isEdit) {
                                return h('Input', {
                                    props: {
                                        // filterable:true,
                                       value: this.list[params.index].options,
                                        type:"textarea"
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            if(e.target.value == ''){
                                                console.log('oiooioioioioi')
                                                this.changeOptions = ' '
                                            }else{
                                                 console.log(e.target.value,'/.././')
                                           this.changeOptions = e.target.value
                                            }
                                        }
                                    },
                                },
                                );
                            } else {
                                return h('span', params.row.options)
                            }
                        },
                    },
                    {
                        title: '创建时间',
                        key: 'createdStr',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '修改时间',
                        key: 'lastUpdatedStr',
                        align: 'center',
                        minWidth: 100
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
                                }, '编辑'),
                                 h('Button', {
                                    props: {
                                        // type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: (e) => {
                                            this.handleEdit(params.row)
                                        }
                                    }
                                }, '取消'),
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
                                            this.saveTable(params.row);
                                        }
                                    }
                                }, '保存'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '该行将会删除，请确认！',
                                                onOk: () => {
                                                     this.tableDelete(params);
                                                },
                                                onCancel: () => {
                                                    this.$Message.warning('已取消删除');
                                                }
                                           
                                        })
                                     }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ],
                total:0,
                pageSize:10,
                page:1
            }
        },
        mounted(){
            this.getversion_list()//获取
            this.getLevelList1()//获取一级品类
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo')); 
            this.search();      
        },
        activated(){

        },
        methods:{
            //获取属性
            getversion_list(){
                this.request('templateListInit', {data:{}}, false).then((res) => {
                    if (res.code == 1) {
                       this.version_list=res.data
                       this.brandListAdd = res.data
                    }
                })
            },
            //获取一级品类
            getLevelList1(){
                this.request('get_class_level1', {data:{}}, false).then((res) => {
                    if (res.code == 1) {
                       this.levelList1=res.data 
                       this.levelList1Add = res.data
                       console.log(this.levelList1,'00000')
                    }
                })
            },
            //获取二级品类
            changeLv1(v){
                console.log(v,'popopopo')
                if(v == undefined){
                    console.log('/./.')
                }else{
                    let data = {}
                    data.ID = v.ID
                this.request('get_class_level2', {data}, false).then((res) => {
                    if (res.code == 1) {
                       this.levelList2=res.data
                    }
                })
                }
            },
            changeLv1Add(v){
                if(v == undefined){
                    console.log('[p[p[p[p[p[p')
                }else{
                    let data = {}
                    data.ID = v.ID
                    this.request('get_class_level2', {data}, false).then((res) => {
                        if (res.code == 1) {
                        this.levelList2Add=res.data 
                    }
                })
                }
            },
            search(){
                this.page = 1;
                this.getData();
            },
            reset(){
                this.$refs.store.clearSingleSelect()
                this.formSearch = {};
                this.search();
                this.levelList2 = []
            },
            getData(){
                let data = Util.deepClone(this.formSearch);
                data.length = this.pageSize;
                data.start = (this.page - 1) * this.pageSize;
                this.formSearch.platfromCode ? data.firstClassLevel = this.formSearch.platfromCode.MC : delete data.firstClassLevel
                this.formSearch.brandId ? data.secondClassLevel = this.formSearch.brandId : delete data.secondClassLevel
                this.formSearch.versionNumber ? data.template =  this.formSearch.versionNumber : delete data.template
                this.request('selectPageAdd',{
                    data
                },true).then(res=>{
                   if(res.code == 1){
                       this.list = res.data.classTemplateConfigList
                       this.total = res.data.count
                   }
                })
            },
            change(){
                this.search();
            },
            cancel(){
                this.importModal = false;
                this.file = null;
            },
            upload(){
                if(this.file == null){
                    this.$Message.warning('请先选择文件再导入')
                }else{
                    this.loadingStatus = true;
                    Vue.prototype.$loading('正在导入数据...');
                    this.$refs.upload.post(this.file);
                }
            },
            handleUpload(file) {
                if (!/\.xls$|.xlsx$/.test(file.name)) {
                    this.$Message.warning('文件类型不符,请重新选择文件');
                    return false
                } else {
                    this.file = file;
                    return false;
                }
            },
            uploadSuccess(res, file) {
                Vue.prototype.$loading.close();
                if (res.code == '1') {
                    this.loadingStatus = false;
                    this.file = null;
                    this.$Message.success(res.msg);
                    this.importModal = false;
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
            downTemplate(){
                window.location = ('http://eopsit.eptison.com/eop/productlaunch/developClassTemplateConfig/templateExport');
            },
            openModal(){
                this.importModal = true;
            },
            //导出
            exportData(){
                let data = {}
                this.formSearch.platfromCode ? data.firstClassLevel = this.formSearch.platfromCode.MC : delete data.firstClassLevel
                this.formSearch.brandId ? data.secondClassLevel = this.formSearch.brandId : delete data.secondClassLevel
                this.formSearch.versionNumber ? data.template = this.formSearch.versionNumber : delete data.template

                let params=this.formatParams(data)
                location.href=(`/eop/productlaunch/developClassTemplateConfig/exportDevelopClassTemplateConfigList?${params}`)
            },
             formatParams(data) {
                var arr = [];
                for (var name in data) {
                arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
                }
                return arr.join("&");
            },
            CurrentChange(val){
                this.page = val;
                this.getData();
            },
            SizeChange(val){
                this.pageSize = val;
                this.getData();
            },
            //新增
             newAdd(){
                this.formSearchs = {}
                this.visible = true
                // this.getLevelList1()
             },
            save(){
                console.log(this.formSearchs.platfromCode,'popoo')
                if(this.formSearchs.platfromCode == undefined){
                    this.$Message.warning('请选择一级品类')
                }else if(this.formSearchs.brandId == undefined){
                    this.$Message.warning('请选择二级品类')
                }else if(this.formSearchs.userNameAdd == undefined){
                    this.$Message.warning('请选择属性')
                }else{
                    let data = {}
                data.createUser = this.userInfo.userName
                data.firstClassLevel = this.formSearchs.platfromCode.MC
                data.secondClassLevel = this.formSearchs.brandId.MC
                data.template = this.formSearchs.userNameAdd
                data.options = this.formSearchs.options ? this.formSearchs.options : ''
                this.request('addNewConfigAdd', {data}, false).then((res) => {
                    if (res.code == 1) {
                        this.visible = false
                        this.getData()
                        this.levelList2Add = []
                        this.$Message.success('新增成功')
                    }
                })
                }
            },
            //取消新增
            cancelAdd(){
                this.visible = false
                this.formSearchs = {}
                this.levelList2Add = []
            },
            handleSave(row){
                this.$set(row, '$isEdit', true)
            },
            handleEdit(row){
                this.$set(row, '$isEdit', false)
            },
             //删除 
            tableDelete(prame){
                let data = {}
                data.configId = prame.row.id
                 this.request('deleteByIdAdd', {data}, false).then((res) => {
                    if(res.code==1){
                    this.$Message.success('品类属性配置模板删除成功')
                     this.getData()
                    }
                })
            },
             //编辑保存 
            saveTable(prame){
                console.log(prame,'zhanzhanzhanzhanzha')
                if(!this.changeTemplate && !this.changeOptions ){
                   this.$Message.warning('请先修改数据再进行保存')
                }else{
                    if(!this.changeTemplate){
                        let data = {}
                        data.id = prame.id
                        data.options =  this.changeOptions
                        data.lastUpdateUser = this.userInfo.userName
                        this.request('updateInfoAdd', {data}, false).then((res) => {
                            if(res.code==1){
                            this.getData()
                            this.$Message.success('保存成功')
                            delete this.changeTemplate
                            delete this.changeOptions
                    }
                })
                    }else if(!this.changeOptions){
                        let data = {}
                        data.id = prame.id
                        data.template =  this.changeTemplate
                        data.lastUpdateUser = this.userInfo.userName
                        this.request('updateInfoAdd', {data}, false).then((res) => {
                            if(res.code==1){
                            this.getData()
                            this.$Message.success('保存成功')
                            delete this.changeTemplate
                            delete this.changeOptions
                    }
                    })
                }else {
                        let data = {}
                        data.id = prame.id
                        data.options = this.changeOptions
                        data.template =  this.changeTemplate
                        data.lastUpdateUser = this.userInfo.userName
                        this.request('updateInfoAdd', {data}, false).then((res) => {
                            if(res.code==1){
                            this.getData()
                            this.$Message.success('保存成功')
                            delete this.changeTemplate
                            delete this.changeOptions
                    }
                    })
                }
            }
        }
    }
    }
</script>

<style>
    #final_account_variable{

    }
</style>

