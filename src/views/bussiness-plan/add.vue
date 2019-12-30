<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">  
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                    <Form-item label="货号编码："  >
                        <Input v-model="formSearch.goodsNo" @on-blur="getGoodNo" placeholder="请输入货号编码" ></Input>
                    </Form-item>
                    <Form-item label="问题类型：">
                        <Select v-model="formSearch.questionType" filterable multiple style="width:170px" >
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
                        <Input v-model="formSearch.questionDesc" placeholder="" type="textarea"></Input>
                    </Form-item>
                </Col>
                <Col span='24' style="padding-left:7px">
                    <Form-item label="是否穿洗："  >
                        <RadioGroup v-model="wearWash">
                            <Radio label="1">是</Radio>
                            <Radio label="0">否</Radio>
                        </RadioGroup>
                    </Form-item>
                </Col>
                <Col span='24' style="padding-left:7px">
                    <Form-item label="上传附件：" >
                        <Upload multiple ref="upload"  name="file" :show-upload-list="false" :before-upload="handleUpload" :on-success="uploadSuccess" :on-remove="uploadDelete"
                        :format="['jpg','jpeg','png','xls','xlsx','doc','docx','csv','wps','txt','pdf','dotx','bmp','jpe']" 
                            action="/eop/business/upload_question_file" :data="{fileName:this.file.name,questionCode:this.questionCode,userName:this.userName}" >
                            <Button style="width:170px" icon="ios-cloud-upload-outline">选 择</Button>
                        </Upload>
                   </Form-item>
                   <Form-item label="已上传文件:" >
                        <p v-for="(v,index) in dataList" :key="v.id" v-if="v.type=='.doc'||v.type=='.dot'||v.type=='.docx'||v.type=='.png'||v.type=='.jpeg'||v.type=='.jpg'||v.type=='.jpe'||v.type=='.xlsx'||v.type=='.xls'||v.type=='.csv'||v.type=='.wps'||v.type=='.txt'||v.type=='.pdf'||v.type=='.bmp'" ><span>{{v.name}}</span> <Icon type="ios-close-circle-outline" @click="delslice(v.id,index)"/></p>
                    </Form-item>
                  
                </Col>
                 <Col span="24" style="padding-left:7px">
                    <Form-item label="提交人：">
                        <Select @on-change="employeeChange"  v-model="commitUserName" filterable style="width:170px">
                            <Option v-for="item in personList" :value="item.userName" :key="item.userId">{{item.userName}}</Option>
                        </Select>
                    </Form-item>
                </Col>
                <div style="text-align:center">
                    <Button style="margin-right:50px" type="primary" @click="save">保存</Button>
                    <Button type="default" @click="chancel">取消</Button>
                </div>
            </Form>
            
        </Row>
            <Modal  v-model="showFlag" title="确认模块" :width="54"  class-name="customize-modal-center">
             <div style="text-align:center;height:40px">
                     <p>{{message}}</p>  
             </div>
               <div style="text-align:center">
                    <Button style="margin-right:50px" type="primary" @click="submit">提交</Button>
                    <Button type="default" @click="quxiao">取消</Button>
                </div>
             <div slot="footer"></div>
        </Modal>
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
        data() {
            return {
                 showFlag:false,
                 message :'',
                 formSearch: {},
                 brandName:'',
                 goodsName:'',
                 wearWash:'',
                 brandId:'',
                 seasonList:[],
                 personList:[],
                 dataList:[],
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
        },
        activated() {
        },
        methods: {
            
            getGoodNo(){
                let data = {}
                    data.goodsNo = this.formSearch.goodsNo
                 this.request('get_brand_by_goodsNo', {data}, false).then((res) => {
                        if(res.code==1){
                        this.commitUserName = this.userName
                         this.brandName = res.data.brandName,
                         this.goodsName = res.data.goodsName,
                         this.brandId = res.data.brandId
                        }
                    })
            },
            getPersonList(){
                console.log('-0-0-0-0')
                this.request('get_user_list_all', {}, false).then((res) => {
                        if(res.code==1){
                        this.personList = res.data
                        this.commitUserName = this.userName
                        }
                    })
            },
            handleUpload(file) {
                // console.log(file)
                if (!/\.jpe$|.xlsx$|.jpg$|.doc$|.docx$|.png$|.csv$|.doc$|.wps$|.txt$|.pdf$|.dotx$|.bmp$|.xls$/.test(file.name.toLocaleLowerCase())) {
                    this.$Message.warning('文件类型不符,请重新选择文件');
                    return false
                    // console.log('popop')
                } else {
                    // console.log('!!!!!!!!!!!')
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
                    this.questionCode = response.data.questionCode
                    console.log(this.questionCode)
                    this.dataList.push({
                        id:response.data.id,
                        name:file.name,
                        type:response.data.questionAttachmentType,
                        questionCode:response.data.questionCode
                    })
                    console.log(this.dataList,'=-=-=')
                    this.nameList.push({
                         id:response.data.id,
                        name:response.data.questionAttachmentName,
                    })
                }
            },
             delslice(id,index){
                 this.id = id
                 this.index = index
                        this.dataList.splice(index,1)
                        let params={
                              fileId:[id],
                              fileType:'Q'
                        }
                        this.nameList.splice(index,1)
                        this.request('business_delete_file', {data:params}, false).then((res) => {
                        if(res.code==1){
                             this.$Message.warning('删除成功')
                            }
                        })    
                },
             save(){
                let data = {}
                let newstring = this.formSearch.questionType.join(',')
                console.log(newstring)
                    data.questionCode = this.questionCode
                    data.goodsNo = this.formSearch.goodsNo
                    data.questionType = newstring
                    data.commitUserName = this.commitUserName
                    data.questionDesc = this.formSearch.questionDesc
                    data.createUser = JSON.parse(window.sessionStorage.getItem('userinfo')).userName
                    data.brandId = this.brandId
                    data.brandName = this.brandName
                    data.goodsName = this.goodsName
                    data.wearWash = this.wearWash
                    console.log(this.wearWash)
                    this.questionCode != '' ? data.attachmentFlag = '1' : data.attachmentFlag = '0'
                    if(!this.wearWash){
                        this.$Message.warning('是否穿洗未设置，请确认！')
                    }else{
                        // this.request('add_question', {data}, false).then((res) => {
                        this.request('business_check_question_exist', {data}, false).then((res) => {
                        if(res.code==1){
                            this.submit()
                            // this.showFlag=true
                            // this.message='问题类型不重复，可以提交'
                        // this.formSearch = {} 
                        // this.$Message.success('新增成功'); 
                        // this.brandName = ''
                        // this.goodsName = '' 
                        // this.wearWash = ''
                        // this.dataList = []
                        // this.commitUserName = this.userName
                        // this.$parent.$parent.search()
                        // this.$parent.$parent.add_visible = false
                        // this.questionCode = ''
                        }else{
                            this.showFlag=true
                            this.message=res.data
                        }
                    }).catch(error=>{

                    })    
                    }
            },
            submit(){
                      let data = {}
                let newstring = this.formSearch.questionType.join(',')
                console.log(newstring)
                    data.questionCode = this.questionCode
                    data.goodsNo      = this.formSearch.goodsNo
                    data.questionType = newstring
                    data.commitUserName = this.commitUserName
                    data.questionDesc = this.formSearch.questionDesc
                    data.createUser   = JSON.parse(window.sessionStorage.getItem('userinfo')).userName
                    data.brandId      = this.brandId
                    data.brandName    = this.brandName
                    data.goodsName    = this.goodsName
                    data.wearWash     = this.wearWash
                    console.log(this.wearWash)
                    this.questionCode != '' ? data.attachmentFlag = '1' : data.attachmentFlag = '0'
                    if(!this.wearWash){
                        this.$Message.warning('是否穿洗未设置，请确认！')
                    }else{
                        this.request('add_question', {data}, false).then((res) => {
                        // this.request('business_check_question_exist', {data}, false).then((res) => {
                        if(res.code==1){
                            this.showFlag=false
                            // this.message='问题类型不重复，可以提交'
                        this.formSearch = {} 
                        this.$Message.success('新增成功'); 
                        this.brandName = ''
                        this.goodsName = '' 
                        this.wearWash = ''
                        this.dataList = []
                        this.commitUserName = this.userName
                        this.$parent.$parent.search()
                        this.$parent.$parent.add_visible = false
                        this.questionCode = ''
                        this.showFlag=false
                        }
                    })
                    }
            },
            quxiao(){
            //    this.formSearch = {}
               this.showFlag = false
            },
            chancel(){
                console.log(this.dataList.length)
                this.$parent.$parent.add_visible = false    
                this.formSearch = {}
                this.brandName = ''
                this.goodsName = ''
                this.wearWash = ''
                this.dataList = []
                this.commitUserName = JSON.parse(window.sessionStorage.getItem('userinfo')).userName
                let arr = []
                this.nameList.forEach(item=>{
                    arr.push(item.id)
                })
                let params={
                            fileId:arr,
                            fileType:'Q'
                        }
                        if(arr.length == 0){
                            console.log('popopopopopo')
                        }else{
                            this.request('business_delete_file', {data:params}, false).then((res) => {
                            if(res.code==1){
                            this.nameList = []
                            this.questionCode = ''
                            // this.wearWash = ''
                            }
                        })
                            }
            },
        }
    }
</script>

<style>

</style>
