<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">  
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="110" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                    <Form-item label="货号编码："  >
                        <Input v-model="goodsNo" @on-blur="getGoodNo" disabled placeholder="" ></Input>
                    </Form-item>
                    <Form-item label="问题类型：">
                        <Select v-model="questionTypeName" filterable multiple style="width:170px" >
                            <Option v-for="item in questionType" :value="item.value" :key="item.value">{{ item.value }}</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span='24' style="padding-left:7px">
                    <Form-item label="品牌："  >
                        <Input v-model="brandName" placeholder="" disabled></Input>
                    </Form-item>
                    <Form-item label="货品名称：" >
                        <Input v-model="goodsName" placeholder="" disabled></Input>
                    </Form-item>
                </Col>
                <Col span='24' style="padding-left:7px">
                    <Form-item label="问题描述：" >
                        <Input v-model="questionDesc" placeholder="" type="textarea"></Input>
                    </Form-item>
                </Col>
                <Col span='24' style="padding-left:7px">
                    <Form-item label="是否穿洗："  >
                        <RadioGroup v-model="wearWash">
                            <Radio :label="1">是</Radio>
                            <Radio :label="0">否</Radio>
                        </RadioGroup>
                    </Form-item>
                </Col>
                <Col span='24' style="padding-left:7px">
                    <Form-item label="上传附件：" >
                        <Upload ref="upload"  name="file" :show-upload-list="false" :before-upload="handleUpload" :on-success="uploadSuccess" :on-remove="uploadDelete"
                            action="/eop/business/upload_question_file" multiple :data="{fileName:this.file.name,questionCode:this.questionCode,userName:this.userName}" >
                            <Button style="width:170px" icon="ios-cloud-upload-outline">选 择</Button>
                        </Upload>
                   </Form-item>
                   <Form-item label="已上传文件:" >
                        <p v-for="(v,index) in dataList" :key="v.id" v-if="v.type=='.doc'||v.type=='.dot'||v.type=='.docx'||v.type=='.png'||v.type=='.jpeg'||v.type=='.jpg'||v.type=='.jpe'||v.type=='.xlsx'||v.type=='.xls'||v.type=='.csv'||v.type=='.wps'||v.type=='.txt'||v.type=='.pdf'||v.type=='.bmp'" ><span>{{v.name}}</span> <Icon type="ios-close-circle-outline" @click="delslice(v.id,index)"/></p>
                    </Form-item>
                  
                </Col>
                 <Col span="24" style="padding-left:7px">
                    <Form-item label="提交人：">
                        <Select @on-change="employeeChange"  v-model="commitUserName"  filterable style="width:170px">
                            <Option v-for="item in personList" :value="item.userName" :key="item.userId">{{item.userName}}</Option>
                        </Select>
                    </Form-item>
                </Col>
                <div style="text-align:center">
                    <Button style="margin-right:50px" type="primary" @click="save">保存</Button>
                    <Button type="default" @click="chancel">取消</Button>
                </div>
            </Form>
            <Modal v-model="visableName" title="删除附件" @on-ok="deleteOk" @on-cancel="deleteCancel">
                <p>确认删除该条附件？</p>
            </Modal>
        </Row>
    </div>
</template>

<script>
    import Util from 'libs/util';
    function formSearch() {
        return {
            search: ''
        }
    }
    export default {
        name:'category',
        props:[ 'params' ],
        data() {
            return {
                visableName:false,
                formSearch: {},
                goodsNo:'',
                questionTypeName:'',
                questionDesc:'',
                brandName:'',
                goodsName:'',
                brandId:'',
                commitUserName:'',
                seasonList:[],
                personList:[],
                dataList:[],
                zhanList:[],
                deleteList:[],
                nameList:[],
                newList:[],
                file:{},
                id:'',
                index:'',
                fileId:'',
                questionCode:'',
                userName:'',
                questionType:[
                    { value:'外观'},{value:'缩水'},{value:'褪色'},{value:'扣子'},{value:'拉链'},{value:'起球'},
                    {value:'掉毛'},{value:'变形'},{value:'印花脱落'},{value:'染色'},{value:'跑绒'},{value:'粘毛'},
                    {value:'异味'},{value:'货品以外'},{value:'其他'},
                ],
            }
        },
        mounted() {
            this.userName = JSON.parse(window.sessionStorage.getItem('userinfo')).userName
            this.getPersonList()
            // this.getDetail()
        },
        props:{
            params:{
                type:String
            }
        },
        watch:{
              params(n,o){
                  if(n){
                       this.getDetail(n)
                  }
              }
        },
        activated() {
        },
        methods: {
            getDetail(questionCode){
                let data={}
                    data.questionCode=questionCode
                    this.questionCode = questionCode
                this.request('get_question_detail', {data:data}, false).then((res) => {
                    if(res.code==1){
                        let newString =res.data.questionType
                        let newData = newString.split(',')
                        this.goodsNo = res.data.goodsNo
                        this.questionTypeName = newData
                        this.questionDesc = res.data.questionDesc
                        this.brandName = res.data.brandName
                        this.goodsName = res.data.goodsName
                        this.brandId = res.data.brandId
                        this.wearWash = res.data.wearWash
                        this.commitUserName = res.data.commitUserName
                        let arr = res.data.questionAttachmentList
                        let arrData = []
                        arr.forEach(item=>{
                            arrData.push({
                                id:item.id,
                                name:item.questionAttachmentName,
                                type:item.questionAttachmentType,
                                questionCode:item.questionCode})
                            })
                        this.dataList = arrData
                        }
                    })
            },
            deleteOk(){
                let id = this.id
                let index = this.index
                this.dataList.splice(index,1).forEach((item)=>{
                this.zhanList.push((item.id)
                    ) })

                let params={
                        fileId:[id],
                        fileType:'Q'
                        }
                this.nameList.splice(index,1)
                this.visableName = false
            },
            deleteCancel(){
                this.visableName = false
            },
            getGoodNo(){
                let data = {}
                    data.goodsNo = this.goodsNo
                this.request('get_brand_by_goodsNo', {data}, false).then((res) => {
                        if(res.code==1){
                        this.brandName = res.data.brandName,
                        this.goodsName = res.data.goodsName,
                        this.brandId = res.data.brandId
                        }
                    })
            },
            getPersonList(){
                this.request('get_user_list_all', {}, false).then((res) => {
                        if(res.code==1){
                        this.personList = res.data
                        }
                    })
            },
            handleUpload(file) {
                if (!/\.xls$|.xlsx$|.jpg$|.doc$|.docx$|.png$|.csv$|.doc$|.wps$|.txt$|.pdf$|.dotx$|.bmp$|.jpe$/.test(file.name.toLocaleLowerCase())) {
                    this.$Message.warning('文件类型不符,请重新选择文件');
                    return false
                } else {
                    this.file = file;
                    setTimeout(()=>{
                            this.$refs['upload'].post(file);
                        },1000)
                    return false
                }
            },
            uploadSuccess(response,file,fileList){
                if(response.code == '1'){
                    this.$Message.success('上传问题附件成功'); 
                    this.questionCode ? this.questionCode = this.questionCode : this.questionCode = response.data.questionCode
                    this.dataList.push({
                        id:response.data.id,
                        name:file.name,
                        type:response.data.questionAttachmentType,
                        questionCode:response.data.questionCode
                    })
                    this.nameList.push({
                        id:response.data.id,
                        name:response.data.questionAttachmentName,
                    })
                }
            },
             delslice(id,index){
                this.id = id
                this.index = index
                this.visableName = true
                },
             save(){
                this.$parent.$parent.add_visible = false
                let data = {}
                let newstring = this.questionTypeName.join(',')
                    data.questionCode = this.questionCode
                    data.goodsNo = this.goodsNo
                    data.questionType = newstring
                    data.commitUserName = this.commitUserName
                    data.questionDesc = this.questionDesc
                    data.createUser = JSON.parse(window.sessionStorage.getItem('userinfo')).userName
                    data.brandId = this.brandId
                    data.brandName = this.brandName
                    data.goodsName = this.goodsName
                    data.wearWash = this.wearWash
                    this.questionCode != '' ? data.attachmentFlag = '1' : data.attachmentFlag = '0'
                    let params={
                              fileId:this.zhanList,
                              fileType:'Q'
                        }
                    this.request('business_delete_file', {data:params}, false).then((res) => {
                    if(res.code==1){
                         this.request('edit_question', {data}, false).then((res) => {
                        if(res.code==1){
                            this.goodsNo = ''
                            this.questionType = ''
                            this.questionDesc = ''
                            this.brandName = ''
                            this.goodsName = ''
                            this.brandId = ''
                            this.commitUserName = ''
                            this.wearWash = ''
                            this.$Message.success('修改成功');
                            this.$parent.$parent.search()
                            this.$parent.$parent.edit_visible = false
                        }
                    })    
                        }
                    })
            },
            chancel(){
                this.$parent.$parent.edit_visible = false
                // this.formSearch = {}
                // this.goodsNo = ''
                // this.questionType = ''
                // this.questionDesc = ''
                // this.brandName = ''
                // this.goodsName = ''
                // this.brandId = ''
                // this.commitUserName = ''
                // this.dataList = []
                let arr = []
                this.nameList.forEach((item)=>{
                    arr.push(item.id)
                    })
                let params={
                              fileId:arr,
                              fileType:'Q'
                        }
                this.request('business_delete_file', {data:params}, false).then((res) => {
                    if(res.code==1){
                        }
                    })
            },
        }
    }
</script>

<style>

</style>
