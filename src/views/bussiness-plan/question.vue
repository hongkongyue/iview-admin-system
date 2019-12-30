<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">   
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24">
                    <Form-item label="货号编码:">
                        <Input v-model="formSearch.goodsNo" placeholder="请输入货号编码" style="width: 120px"
                    ></Input>
                    </Form-item>
                    <Form-item label="状态:">
                                　<Select v-model="formSearch.questionStatus" style="width:120px" multiple>
                                        <Option v-for="item in questionStatus" :value="item.code" :key="item.code">{{item.value}}</Option>
                                 </Select>
                    </Form-item>
                    <Form-item label="问题类型:">
                        <Col span="12">
                              　<Select v-model="formSearch.questionType" style="width:120px" multiple>
                                        <Option v-for="item in questionType" :value="item.value" :key="item.value">{{item.value}}</Option>
                                </Select>
                        </Col>
                    </Form-item>
                    <Form-item label="指定处理人:">
                                    　<Select v-model="formSearch.userId" style="width:120px" multiple>
                                        <Option v-for="item in alldealList" :value="item.userId" :key="item.userId">
                                            {{ item.userName }}
                                        </Option>
                                    </Select>
                    </Form-item>
                    <Form-item ><span v-if="switchtype!='up'" @click="showmore">更多<Icon type="ios-arrow-down" /></span></Form-item>
                </Col>
                <Col span="24"  v-if="switchtype=='up'" class="animated zoomInLeft">
                     <Form-item label="问题描述:">
                        <!-- <Input v-model="formSearch.describle" placeholder="请输入问题描述" style="width: 120px"
                    ></Input> -->
                          <AutoComplete
                                        v-model="formSearch.questionDesc"
                                        :data="data1"
                                        @on-search="handleSearch1"
                                        placeholder="请输入问题描述"
                                        style="width:120px">
                           </AutoComplete>
                    </Form-item>
                    <Form-item label="处理结果:">
                        <!-- <Input v-model="formSearch.result" placeholder="请输入核查结果" style="width: 120px" ></Input> -->
                              <AutoComplete
                                        v-model="formSearch.resultDesc"
                                        :data="data2"
                                        @on-search="handleSearch1"
                                        placeholder="请输入问题描述"
                                        style="width:120px">
                              </AutoComplete>
                    </Form-item>
                   
                    <Form-item label="提交人:">
                                    　<Select v-model="formSearch.commitUserId" style="width:120px" multiple>
                                        <Option v-for="item in allusersList" :value="item.userId" :key="item.userId">
                                            {{ item.userName }}
                                        </Option>
                                    </Select>
                    </Form-item>
                     <Form-item label="品牌:">
                                    <Select v-model="formSearch.brandId" style="width:120px" multiple>
                                        <Option v-for="item in brandList" :value="item.brandId" :key="item.brandId">
                                            {{ item.brandName }}
                                        </Option>
                                    </Select>
                    </Form-item>
                     <Form-item label="创建时间:">
                                <DatePicker v-model="formSearch.create"  type="datetimerange" :options="options2" placement="bottom-end" placeholder="请选择创建时间" style="width: 340px"></DatePicker>
                    </Form-item>
                     <Form-item label="处理时间:">
                              <DatePicker v-model="formSearch.handle" type="datetimerange" :options="options2" placement="bottom-end" placeholder="请选择处理时间" style="width: 340px"></DatePicker>
                    </Form-item>
                     <Form-item label="问题编号:">
                        <Input v-model="formSearch.questionCode" placeholder="请输入问题编号" style="width: 120px" ></Input>
                    </Form-item>
                    <Form-item label="包含失效:">
                         <RadioGroup v-model="formSearch.effectiveFlag">
                            <Radio label="是">包含</Radio>
                            <Radio label="否">不包含</Radio>
                        </RadioGroup>
                    </Form-item>
                     <Form-item label="是否延期:">
                        <RadioGroup v-model="formSearch.delayFlag">
                            <Radio label="是">是</Radio>
                            <Radio label="否">否</Radio>
                        </RadioGroup>
                    </Form-item>
                    <Form-item label="是否穿洗:">
                        <RadioGroup v-model="formSearch.wearWash">
                            <Radio label="1">是</Radio>
                            <Radio label="0">否</Radio>
                        </RadioGroup>
                    </Form-item>
                     <Form-item :label-width="180" ><span v-if="switchtype=='up'" @click="showless">收回<Icon type="ios-arrow-up" /></span></Form-item>
                </Col>
                <Col span="24"  style="padding-left:20px"> 
                <Form-item :label-width="1">
                    <Button type="primary" @click="search">查询</Button>
                    <Button type="default" @click="handleReset">重置</Button>
                    <Button type="primary" @click="addNew">新增</Button>
                    <Button type="primary" @click="edit">编辑</Button>
                    <Button type="primary" @click="chakan">查看</Button>
                    <Button type="primary" @click="handle">处理</Button>
                    <Button type="primary" @click="delMore">删除</Button>
                    <Button type="primary" @click="exportEmployee">导出</Button>

                </Form-item>
                </Col>
            </Form>
        </Row>
        <!-- 数据列表 -->
        <Row class="background-color-white exhibition">
            <!--  -->
            <Table  ref="currentRowTable"  @on-row-dblclick="showChakan"	@on-row-click="selectRow" @on-select-cancel="choiceId" @on-select-all-cancel="choiceId"  @on-select="choiceId" @on-select-all="choiceId"	:columns="columns" size="small" highlight-row :data="list"></Table>
            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total
                show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
        </Row>
         <!-- 处理模块内容 -->
         <Modal  v-model="deal_visible"  :styles="mystyle"  title="处理模块" :width="950" @on-cancel="handlecancel"  :scrollable="true"  class-name="customize-modal-center">
          <Form   :label-width="90" inline :model="dealformSearch" ref="dealformSearch" 
                label-position="right">
                <div style="height:350px;overflow:auto">
                <div style="height:60px">
                    <Col span="24" style="padding-left:7px">
                        <Form-item label="问题编号 :">
                            <Input v-model="dealformSearch.questionCode" disabled placeholder="请输入问题编号" style="width: 110px"
                            ></Input>
                        </Form-item>
                        <Form-item label="问题类型:">
                                 <!-- <Input v-model="dealformSearch.questionstatus" disabled placeholder="请输入问题类型" style="width: 110px"
                                  ></Input> -->
                                 <!-- {{dealformSearch.questionType}}  -->
                                <Select v-model="dealformSearch.questionType" style="width:110px" multiple>
                                        <Option v-for="item in questionType" :value="item.value" :key="item.value">{{item.value}}</Option>
                                </Select>
                        </Form-item>
                        <Form-item label="提交人:">
                            <Input v-model="dealformSearch.commitUserName" disabled placeholder="请输入提交人" style="width: 110px"
                            ></Input>
                        </Form-item>
                        <Form-item label="提交时间:">
                            <Input v-model="dealformSearch.commitTime" disabled placeholder="请输入提交时间" style="width: 110px"
                            ></Input>
                        </Form-item>
                    </Col>
                </div>
                <div style="height:60px">
                    <Col span="24" style="padding-left:7px">
                        <Form-item label="货号编号 :">
                            <Input v-model="dealformSearch.goodsNo" disabled placeholder="请输入货号编号" style="width: 110px"
                            ></Input>
                        </Form-item>
                        <Form-item label="品牌:">
                            <Input v-model="dealformSearch.brandName" disabled placeholder="请输入品牌" style="width: 110px"
                            ></Input>
                        </Form-item>
                        <Form-item label="货品名称:">
                            <Input v-model="dealformSearch.goodsName"  disabled placeholder="请输入货品名称" style="width: 110px"
                            ></Input>
                        </Form-item>
                        <Form-item label="状态:">
                            <Input v-model="dealformSearch.questionStatus" disabled placeholder="请输入状态" style="width: 110px"
                            ></Input>
                        </Form-item>
                    </Col>
                </div>
                <div style="height:60px">
                    <Col span="24" style="padding-left:7px">
                        <Form-item label="问题描述 :"    :span="12" >
                            <Input type="textarea"  disabled v-model="dealformSearch.questionDesc" placeholder="请输入问题描述" style="width: 320px"
                            ></Input>
                        </Form-item>
                        <Form-item label="问题附件列表:" :span="12" >
                               <!-- *.xlsx，*.xls，*.csv，*.wps，*.txt，*.pdf，*.bmp  -->
                               <Col style="width:120px">
                                <p v-for="v in dealformSearch.questionAttachmentList" :key="v.id" v-if="v.questionAttachmentType=='.pdf'||v.questionAttachmentType=='.txt'||v.questionAttachmentType=='.wps'||v.questionAttachmentType=='.csv'||v.questionAttachmentType=='.xls'||v.questionAttachmentType=='.xlsx'||v.questionAttachmentType=='.doc'||v.questionAttachmentType=='.dot'||v.questionAttachmentType=='.docx'" style="width:120px;cursor:pointer"><span @click="lookFile(v.questionAttachmentUrl)">{{v.questionAttachmentName}}</span></p>
                                <p v-for="v in dealformSearch.questionAttachmentList" :key="v.id" v-if="v.questionAttachmentType=='.bmp'||v.questionAttachmentType=='.png'||v.questionAttachmentType=='.jpeg'||v.questionAttachmentType=='.jpg'||v.questionAttachmentType=='.jpe'" style="width:120px;cursor:pointer"><img @click="lookbig(host+v.questionAttachmentUrl)" :src="host+v.questionAttachmentUrl" style="width:58px;height:58px;cursor:pointer"/></p>
                                </Col>
                       </Form-item>

                        <Form-item label="是否穿洗:"    :span="12">
                            <RadioGroup v-model="dealformSearch.wearWash">
                                <Radio :label="1" >是</Radio>
                                <Radio :label="0" >否</Radio>
                            </RadioGroup>
                       </Form-item>
                    </Col>
                </div>     
                <div style="height:60px"> 
                        <Col span="24" style="padding-left:7px">
                                <Form-item label="处理过程:" span="12">
                                    <Input type="textarea" :autosize="true" v-model="dealformSearch.processDesc" placeholder="请输入过程描述" style="width: 320px"
                                    ></Input>
                                </Form-item>
                                <Form-item label="上传结果附件:" span="14">
                                        <Upload   
                                                    ref="upload"
                                                    name="file"
                                                    :show-upload-list="false"
                                                    :before-upload="handleUpload"
                                                    :on-success="uploadSuccess"
                                                    :on-error="uploadError"
                                                    action="/eop/business/upload_deal_file"
                                                    :data="{userName:userInfo.userName,questionCode:dealformSearch.questionCode,fileName:Filename}"
                                                            >
                                                            <Button icon="ios-cloud-upload-outline" style="width: 320px">上传处理结果附件</Button>
                                         </Upload>
                                                            <div v-if="file !== null">{{ file.name }}
                                                                <Button type="text"
                                                                        :loading="loadingStatus">{{ loadingStatus ? '上传中...' : '' }}
                                                                </Button>
                                                            </div>
                                        <Modal title="查看大图" v-model="visible"> 
                                            <img :src="bigPicUrl" v-if="visible" style="width: 100%">
                                        </Modal>
                                </Form-item>                       
                        </Col>
                </div>  
                <div style="height:60px">
                    <Col span="24" style="padding-left:7px">
                             <Form-item label="处理结果:" span="12">
                                                     <Input type="textarea" :autosize="true" v-model="dealformSearch.resultDesc" size="large" placeholder="请输入处理结果" style="width: 320px"
                                                     ></Input>
                            </Form-item>
                               <!-- {{dealshowFilelist}} -->
                              <Form-item label="结果附件列表:" span="14">
                                    <!-- *.xlsx，*.xls，*.csv，*.wps，*.txt，*.pdf，*.bmp  -->
                               <p v-for="(v,index) in dealshowFilelist" :key="v.id" v-if="v.dealAttachmentType=='.pdf'||v.dealAttachmentType=='.txt'||v.dealAttachmentType=='.wps'||v.dealAttachmentType=='.csv'||v.dealAttachmentType=='.xls'||v.dealAttachmentType=='.xlsx'||v.dealAttachmentType=='.doc'||v.dealAttachmentType=='.dot'||v.dealAttachmentType=='.docx'" style="width:320px;cursor:pointer"><span @click="lookFile(v.dealAttachmentUrl)">{{v.dealAttachmentName}}</span> <Icon type="ios-close-circle-outline" @click="delslice(v.id,index)"/></p>
                               <p v-for="(v,index) in dealshowFilelist" :key="v.id" v-if="v.dealAttachmentType=='.bmp'||v.dealAttachmentType=='.png'||v.dealAttachmentType=='.jpeg'||v.dealAttachmentType=='.jpg'||v.dealAttachmentType=='.jpe'"><img @click="lookbig(host+v.dealAttachmentUrl)" :src="host+v.dealAttachmentUrl" style="width:58px;height:58px;cursor:pointer"/> <Icon type="ios-close-circle-outline" @click="delslice(v.id,index)"/></p>
                             </Form-item>
                       </Col>
                </div>
           </div>
             <div style="height:60px;line-height:60px;padding-top:20px;border-top:1px solid #e8eaec">
                    <Row>
                         <Col span="10" style="text-align:right" v-if="dealformSearch.questionStatus!='已处理'">
                              <Button type="default"  @click="handlecancel">取消</Button>
                         </Col>
                         <Col span="2" style="text-align:center" v-if="dealformSearch.questionStatus!='已处理'">
                              <Button type="primary" @click="dealStore">保存</Button>
                         </Col>
                         <Col span="2" style="text-align:center" v-if="dealformSearch.questionStatus!='已处理'">
                              <Button type="primary" @click="dealSubmit">提交</Button>
                         </Col>
                         <Col span="6" style="text-align:left" v-if="dealformSearch.questionStatus!='已处理'">
                              <Button type="primary" @click="goBack">回退</Button>
                         </Col>
                         <Col span="24" style="text-align:center" v-if="dealformSearch.questionStatus=='已处理'">
                              <Button type="primary" @click="goBack">回退</Button>
                         </Col>
                    </Row>
               </div>
            </Form>
                <div slot="footer"></div>
        </Modal>
         <!-- 查看模块 -->
        <Modal  v-model="look_visible"  :styles="mystyle"  title="查看模块" :width="950"  :scrollable="true"  class-name="customize-modal-center">
          <Form   :label-width="90" inline :model="dealformSearch" ref="dealformSearch" 
                label-position="right">
                <div style="height:350px;overflow:auto">
                 <div style="height:60px">
                    <Col span="24" style="padding-left:7px">
                        <Form-item label="问题编号 :">
                            <Input v-model="dealformSearch.questionCode" disabled placeholder="请输入问题编号" style="width: 110px"
                            ></Input>
                        </Form-item>
                        <Form-item label="问题类型:">
                                 <Input v-model="dealformSearch.questionType" disabled placeholder="请输入问题类型" style="width: 110px"
                                  ></Input>
                        </Form-item>
                        <Form-item label="提交人:">
                            <Input v-model="dealformSearch.commitUserName" disabled placeholder="请输入提交人" style="width: 110px"
                            ></Input>
                        </Form-item>
                        <Form-item label="提交时间:">
                            <Input v-model="dealformSearch.commitTime" disabled placeholder="请输入提交时间" style="width: 110px"
                            ></Input>
                        </Form-item>
                    </Col>
                </div>
                <div style="height:60px">
                    <Col span="24" style="padding-left:7px">
                        <Form-item label="货号编号 :">
                            <Input v-model="dealformSearch.goodsNo" disabled placeholder="请输入货号编号" style="width: 110px"
                            ></Input>
                        </Form-item>
                        <Form-item label="品牌:">
                            <Input v-model="dealformSearch.brandName" disabled placeholder="请输入品牌" style="width: 110px"
                            ></Input>
                        </Form-item>
                        <Form-item label="货品名称:">
                            <Input v-model="dealformSearch.goodsName"  disabled placeholder="请输入货品名称" style="width: 110px"
                            ></Input>
                        </Form-item>
                        <Form-item label="状态:">
                            <Input v-model="dealformSearch.questionStatus" disabled placeholder="请输入状态" style="width: 110px"
                            ></Input>
                        </Form-item>
                    </Col>
                </div>
                <div style="height:60px">
                    <Col span="24" style="padding-left:7px">
                        <Form-item label="问题描述 :" span="12" >
                            <Input type="textarea" :autosize="true" disabled v-model="dealformSearch.questionDesc" placeholder="请输入问题描述" style="width: 320px"
                            ></Input>
                        </Form-item>
                        <Form-item label="问题附件列表:" span="6">
                              <Col style="width:120px">
                                <p v-for="v in dealformSearch.questionAttachmentList" :key="v.id" v-if="v.questionAttachmentType=='.pdf'||v.questionAttachmentType=='.txt'||v.questionAttachmentType=='.wps'||v.questionAttachmentType=='.csv'||v.questionAttachmentType=='.xls'||v.questionAttachmentType=='.xlsx'||v.questionAttachmentType=='.doc'||v.questionAttachmentType=='.dot'||v.questionAttachmentType=='.docx'" style="width:110px;cursor:pointer"><span @click="lookFile(v.questionAttachmentUrl)">{{v.questionAttachmentName}}</span></p>
                                <p v-for="v in dealformSearch.questionAttachmentList" :key="v.id" v-if="v.questionAttachmentType=='.bmp'||v.questionAttachmentType=='.png'||v.questionAttachmentType=='.jpeg'||v.questionAttachmentType=='.jpg'||v.questionAttachmentType=='.jpe'"><img @click="lookbig(host+v.questionAttachmentUrl)" :src="host+v.questionAttachmentUrl" style="width:58px;height:58px;cursor:pointer"/></p>
                              </Col>
                        </Form-item>
                        <Form-item label="是否穿洗:">
                            <RadioGroup v-model="dealformSearch.wearWash">
                                <Radio :label="1" disabled>是</Radio>
                                <Radio :label="0" disabled>否</Radio>
                            </RadioGroup>
                       </Form-item>
                    </Col>
                </div>     
                <div style="height:60px"> 
                        <Col span="24" style="padding-left:7px">
                             <Form-item label="处理过程:" span="12">
                                                     <Input type="textarea" :autosize="true" disabled v-model="dealformSearch.processDesc" size="large" placeholder="请输入处理过程" style="width: 320px"
                                                     ></Input>
                            </Form-item>
                             
                             <Form-item label="结果文件列表:" span="14">
                                <p v-for="v in dealshowFilelist" :key="v.id" v-if="v.dealAttachmentType=='.pdf'||v.dealAttachmentType=='.txt'||v.dealAttachmentType=='.wps'||v.dealAttachmentType=='.csv'||v.dealAttachmentType=='.xls'||v.dealAttachmentType=='.xlsx'||v.dealAttachmentType=='.doc'||v.dealAttachmentType=='.dot'||v.dealAttachmentType=='.docx'" style="width:320px;cursor:pointer"><span @click="lookFile(v.dealAttachmentUrl)">{{v.dealAttachmentName}}</span> /></p>
                               <p v-for=" v in dealshowFilelist" :key="v.id" v-if="v.dealAttachmentType=='.bmp'||v.dealAttachmentType=='.png'||v.dealAttachmentType=='.jpeg'||v.dealAttachmentType=='.jpg'||v.dealAttachmentType=='.jpe'"><img @click="lookbig(host+v.dealAttachmentUrl)" :src="host+v.dealAttachmentUrl" style="width:58px;height:58px;cursor:pointer"/></p>
                             </Form-item>
                       </Col>
                </div>  
                <div style="height:60px">
                  <Col span="24" style="padding-left:7px">
                    <Form-item label="处理结果:" span="12">
                        <Input type="textarea"  disabled  :autosize="true" v-model="dealformSearch.resultDesc" size="large" placeholder="请输入处理结果" style="width: 320px"
                                                     ></Input>
                        </Form-item>
                  </Col>
                </div>
           </div>
            </Form>
                <div slot="footer"></div>
        </Modal>
        <!-- 回退弹框 -->
          <Modal  v-model="back_visible"  :styles="mystyle"  title="回退" :width="34"  @on-cancel="backcancel" @on-ok="backconfirm" class-name="customize-modal-center">
          <Form   :label-width="90" inline label-position="right">
             <!-- <div style="height:130px"> -->
                    <Col span="24">
                        <Form-item label="回退理由 :" span="12" >
                             <Select v-model="backformSearch.assign" style="width:320px" @on-change="choicedShow(backformSearch.assign)">
                                        <Option v-for="item in backReason" :value="item.value" :key="item.value">
                                            {{item.value}}
                                        </Option>
                             </Select>
                        </Form-item>
                    </Col>
                    <Form-item label="问题编号:" span="12" v-if="questionDescrible">
                            <Input  v-model="backformSearch.number" placeholder="请输入问题编号" style="width: 320px"
                            ></Input>
                    </Form-item>
                     <Form-item label="备注:" span="12" v-if="noteFlag">
                            <Input  type="textarea" :autosize="true" v-model="backformSearch.note"   placeholder="请输入备注" style="width: 320px"
                            ></Input>
                    </Form-item>
             <!-- </div> -->
             <div style="height:80px;line-height:60px;padding-top:20px">
                    <Row>
                         <Col span="11" style="text-align:right">
                              <Button type="default" @click="backcancel">取消</Button>
                         </Col>
                         <Col span="11" style="text-align:left">
                              <Button type="primary" @click="backconfirm">保存</Button>
                         </Col>
                    </Row>
               </div>
            </Form>
                <div slot="footer"></div>
        </Modal>
        <!-- 新增 -->
        <Modal  v-model="add_visible" title="新增" :width="56"  class-name="customize-modal-center" @on-cancel="quxiao" >
             <div>
                  <add-component ref="child"></add-component>
             </div>
             <div slot="footer"></div>
        </Modal>
        <!-- 编辑 -->
        <Modal  v-model="edit_visible" title="编辑" :width="56"  class-name="customize-modal-center">
             <div>
                 <edit-component :params="rowData"></edit-component>
             </div>
             <div slot="footer"></div>
        </Modal>
       
    </div>
</template>

<script>
    import addComponent from  './add.vue'
    import editComponent from  './change.vue'
    import Util from 'libs/util';
    import { setTimeout } from 'timers';
    import { userInfo } from 'os';
    function formSearch() {
        return {
            search: ''
        }
    }
    export default {
        data() {
            return {
                visible: false,
                file:'',
                loadingStatus: false,
                mystyle:{
                    top:'70px',
                },
                brandList:[],         // 初始化品牌列表
                allusersList:[],      //初始化全部用户列表
                alldealList :[],      //初始化全部处理人列表
                dealshowFilelist:[],  //需要展示的处理文件列表
                deal_visible:false,
                // host:'http://eopsit.eptison.com/eop/',                 //主机名
                // host:'http://eopuat.eptison.com/eop/',  
                host:'http://eop.quanshangtech.com:888/eop/',
                // host:'http://'+window.location.host+'/eop/',                  //主机名
                back_visible:false,
                add_visible :false,
                edit_visible:false,
                look_visible:false,
                noteFlag    :false,
                Filename    : '',        //需要上传的文件名
                bigPicUrl   : '',       //大图路径
                switchtype  : '',
                rowData     : '',
                questionStatus:[
                    {code:'100', value:'未提交'},{code:'300',value:'待处理'},{code:'400',value:'处理中'},{code:'900',value:'已处理'}
                ],
                backReason:[
                    { value:'重复处理'},{value:'补充详情'}
                ],
                 questionType:[
                    {value:'外观'},{value:'缩水'},{value:'褪色'},{value:'扣子'},{value:'拉链'},{value:'起球'},
                    {value:'掉毛'},{value:'变形'},{value:'印花脱落'},{value:'染色'},{value:'跑绒'},{value:'粘毛'},
                    {value:'异味'},{value:'货品以外'},{value:'其他'},
                ],
                columns: [
                     {
                        type: 'selection',
                        width: 50,
                        align: 'center',
                        fixed: 'left',
                     },
                     {
                        title: '序号',
                        key: 'index',
                        align: 'center',
                        width: 70,
                        render: (h, params) => {
                                  return h('span', {
                                        },params.index+1); 
                        },

                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        width: 90,
                        render: (h, params) => {
                                  return h('span', {
                                        },this.list[params.index].brandName); 
                        },
                    },
                    {
                        title: '货号编码',
                        key: 'goodsNo',
                        align: 'center',
                        width: 90,
                        render: (h, params) => {
                                  return h('span', {
                                        },this.list[params.index].goodsNo); 
                        },
                    },
                    {
                        title: '问题类型',
                        key: 'questionType',
                        align: 'center',
                        width: 120,
                          render: (h, params) => {
                                  return h('span', {
                                        },this.list[params.index].questionType); 
                        },
                    },
                    {
                        title: '状态',
                        key: 'questionStatus',
                        align: 'center',
                        width: 80,
                        render: (h, params) => {
                                 if(this.list[params.index].questionStatus==100){
                                    return h('span', {
                                        },'未提交'); 
                                 }else if(this.list[params.index].questionStatus==300){
                                    return h('span', {
                                        },'待处理');   
                                 }else if(this.list[params.index].questionStatus==400){
                                    return h('span', {
                                        },'处理中');   
                                 }else if(this.list[params.index].questionStatus==900){
                                    return h('span', {
                                        },'已处理');   
                                 }
                                 
                        },
                    },
                    {
                        title: '指定处理人',
                        key: 'userName',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                                  return h('span', {
                                        },this.list[params.index].userName); 
                        },
                    },
                    {
                        title: '问题描述',
                        key: 'questionDesc',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                          return h('p', {
                                                         style: {
                                                                    display: 'inline-block',
                                                                    width: '100%',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap'
                                                            },
                                                         domProps:{
                                                                  title:this.list[params.index].questionDesc
                                                                  }
                                                    }, this.list[params.index].questionDesc); 
                        }
                    },
                    {
                        title: '处理过程',
                        key: 'processDesc',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                          return h('p', {
                                                         style: {
                                                                    display: 'inline-block',
                                                                    width: '100%',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap'
                                                            },
                                                         domProps:{
                                                                  title:this.list[params.index].processDesc
                                                                  }
                                                    }, this.list[params.index].processDesc); 
                        }
                    },
                     {
                        title: '处理结果',
                        key: 'resultDesc',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                          return h('p', {
                                                         style: {
                                                                    display: 'inline-block',
                                                                    width: '100%',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap'
                                                            },
                                                         domProps:{
                                                                  title:this.list[params.index].resultDesc
                                                                  }
                                                    }, this.list[params.index].resultDesc); 
                        }
                    },
                    // {
                    //     title: '问题描述',
                    //     key: 'userName',
                    //     align: 'center',
                    //     width: 120,
                    // },
                    {
                        title: '提交时间',
                        key: 'commitTime',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                                  return h('span', {
                                        },this.list[params.index].commitTime); 
                        },
                    },
                    {
                        title: '附件',
                        key: 'attachmentFlag',
                        align: 'center',
                        width: 90,
                        render: (h, params) => {
                                 if(this.list[params.index].attachmentFlag==0){
                                     return h('span', {
                                        },'无'); 
                                 }else{
                                     return h('span', {
                                        },'有'); 
                                 }
                                  
                        },
                    },
                     {
                        title: '是否穿洗',
                        key: 'wearWash',
                        align: 'center',
                        width: 90,
                        render: (h, params) => {
                                 if(params.row.wearWash==0){
                                     return h('span', {
                                        },'否'); 
                                 }else{
                                    return h('span', {
                                        },'是'); 
                                 }
                                 
                        },
                    },
                    {
                        title: '是否延期',
                        key: 'delayFlag',
                        align: 'center',
                        width: 90,
                        render: (h, params) => {
                                  return h('span', {
                                        },this.list[params.index].delayFlag); 
                        },
                    },
                    {
                        title: '延期时间',
                        key: 'delayTime',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                  return h('span', {
                                        },this.list[params.index].delayTime); 
                        },
                    },
                      {
                        title: '问题编号',
                        key: 'questionCode',
                        align: 'center',
                        width: 140,
                         render: (h, params) => {
                                  return h('span', {
                                        },this.list[params.index].questionCode); 
                        },
                    },
                    {
                        title: '有效日期',
                        key: 'effectiveTime',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                                  return h('span', {
                                        },this.list[params.index].effectiveTime); 
                        },
                    },
                    {
                        title: '失效状态',
                        key: 'effectiveFlag',
                        align: 'center',
                        width: 90,
                        render: (h, params) => {
                                  return h('span', {
                                        },this.list[params.index].effectiveFlag); 
                        },
                    },
                     
                    {
                        title: '回退理由',
                        key: 'returnReason',
                        align: 'center',
                        width: 120,
                        // render: (h, params) => {
                        //           return h('span', {
                        //                 },this.list[params.index].returnReason); 
                        // },
                        render: (h, params) => {
                                          return h('p', {
                                                         style: {
                                                                    display: 'inline-block',
                                                                    width: '100%',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap'
                                                            },
                                                         domProps:{
                                                                  title:this.list[params.index].returnReason
                                                                  }
                                                    }, this.list[params.index].returnReason); 
                        }
                    },
                    {
                        title: '关联编号',
                        key: 'id',
                        align: 'relateCode',
                        width: 100,
                        render: (h, params) => {
                                  return h('span', {
                                        },this.list[params.index].relateCode); 
                        },

                    },
                   
                    {
                        title: '提交人',
                        key: 'commitUserName',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                                  return h('span', {
                                        },this.list[params.index].commitUserName); 
                        },
                    },
                    {title: '处理时间',
                        key: 'dealTime',
                        align: 'center',
                        width: 150,
                        render: (h, params) => {
                                  return h('span', {
                                        },this.list[params.index].dealTime); 
                        },
                    },
                     {title: '处理人',
                        key: 'dealUserName',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                                  return h('span', {
                                        },this.list[params.index].dealUserName); 
                        },
                    },
                     {title: '最后修改时间',
                        key: 'lastUpdated',
                        align: 'center',
                        width: 170,
                        render: (h, params) => {
                                  return h('span', {
                                        },this.list[params.index].lastUpdated); 
                        },
                    },
                    {title: '最后修改人',
                        key: 'lastUpdateUser',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                  return h('span', {
                                        },this.list[params.index].lastUpdateUser); 
                        },
                    },
                ],
                questionDescrible:false,
                IDS:[], //批量操作的id
                userInfo: {},
                list: [],
                total: 0,
                page: 1,
                pageSize: 10,
                formSearch: {
                },
                dealformSearch:{
                },
                backformSearch:{},     //回退数据
                brandList:[],          //品牌列表
                modal_visible:false,   // 编 
            }
        },
        components:{
            addComponent,
            editComponent
        },
        mounted() {
                this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo')); 
                this.uploadList = this.$refs.upload.fileList;
                this.getData()
                this.getbrandList()
                this.allUserList()
                this.allDealsList()
                this.formSearch.submit= this.userInfo.userId
        },
        activated() {

        },
        methods: {
              showChakan(){
                        this.look_visible=true 
                        this.chakan()          
              },
              selectRow(row,index){ 
                  this.IDS=[]
                  this.$refs.currentRowTable.objData[index]._isChecked = true 
                  for (let i in  this.$refs.currentRowTable.objData) {
                        if(i==index){
                          this.$refs.currentRowTable.objData[i]._isChecked=true
                        }else{
                          this.$refs.currentRowTable.objData[i]._isChecked=false  
                        }
                    }
                    this.IDS[0]=row
                    console.log(this.IDS);
              },
              choicedShow(v){
                 if(v){
                     if(v=='重复处理'){
                        this.questionDescrible=true
                        this.noteFlag=false
                     }else{
                        this.noteFlag=true
                        this.questionDescrible=false
                     }
                     
                 }
              },
              handleSearch1(value){
                 console.log(value)
              },//需要这个
            //重置表单
               resetFormdata(){
                       this.formSearch={}
               },
               handleReset(){
                       this.resetFormdata();
                       this.formSearch.create='';
                       this.formSearch.handle='';
                       this.search()
               },
               search() {
                        this.page =1
                        this.getData()
                },  
               showmore(){
                        this.switchtype='up'
                },
               showless(){
                        this.switchtype='down'
                },
               handlecancel(){ 
                     this.deal_visible=false
                    if(this.dealformSearch.questionType){
                        if(typeof(this.dealformSearch.questionType)=='string'){
                                    this.dealformSearch.questionType=this.dealformSearch.questionType
                        }else{
                                    this.dealformSearch.questionType=this.dealformSearch.questionType.join(',')
                        } 
                    }
                    if(this.dealformSearch.questionStatus!='待处理') return
                    let params={};  
                        params.detailId      =this.dealformSearch.detailId
                        params.questionCode  =this.dealformSearch.questionCode
                        params.processDesc   =this.dealformSearch.processDesc
                        params.resultDesc    =this.dealformSearch.resultDesc
                        params.questionType  =this.dealformSearch.questionType
                        params.lastUpdateUser=this.userInfo.userName
                        params.dealUserId    =this.userInfo.userAccount
                        params.wearWash      =this.dealformSearch.wearWash
                        params.questionStatus=400
                    this.request('business_save_deal_result', {data:params}, false).then((res) => {
                            if(res.code==1){
                                 this.dealformSearch={}
                                 this.search()
                                 this.deal_visible=false;
                            }else{
                                // this.deal_visible=true 
                            }
                        }) 
                      

                },
              //表单事件
              choiceId(selection,row){
                        console.log(selection)
                        this.IDS=selection;
                },
              chakan(){
                     if(this.IDS.length==1){
                        this.look_visible=true
                        // this.rowData =this.IDS
                        this.initHandle(this.IDS[0].questionCode)
                    }else  if(this.IDS.length==0){
                        this.$Message.warning('您未选择要查看项')
                    }else  if(this.IDS.length>1){
                        this.$Message.warning('只能选择一个进行查看')
                    }  
                },
             edit(){
                    if(this.IDS.length==1){
                        if(this.IDS[0].questionStatus==400||this.IDS[0].questionStatus==900){
                            this.$Message.warning('处理中或已处理不可编辑')
                        }else{
                           this.edit_visible=true
                           this.rowData =this.IDS[0].questionCode
                        }
                        
                    }else  if(this.IDS.length==0){
                        this.$Message.warning('您未选择要编辑项')
                    }else  if(this.IDS.length>1){
                        this.$Message.warning('只能选择一个进行编辑')
                    }  
                },
            //新增
            addNew(){
                    this.add_visible=true
                },
            //删除
            delMore(){
                    if(this.IDS.length==0){
                        this.$Message.warning('您未选择删除项')
                        return false
                     }
                     let data={}
                         data.lastUpdateUser=this.userInfo.userName
                         data.questionCode=[];
                     if(this.IDS.length>0){
                         for(let i=0;i<this.IDS.length;i++){
                             data.questionCode.push(this.IDS[i].questionCode)
                         }
                     }
                     this.$Modal.confirm({
                                                title: '提示',
                                                content: '该行将会删除，请确认！',
                                                onOk: () => {

                                                          this.request('business_delete_question', {data:data}, false).then((res) => {
                                                            if(res.code==1){
                                                                this.search()
                                                            }
                                                          })   
                                                },
                                                onCancel: () => {
                                                    this.$Message.warning('已取消删除');
                                                }
                                           
                                        })
            },
            //处理
            handle(){
                    if(this.IDS.length==1){
                        this.initHandle(this.IDS[0].questionCode)
                        this.deal_visible=true

                    }else  if(this.IDS.length==0){
                        this.$Message.warning('您未选择要处理项')
                    }else  if(this.IDS.length>1){
                        this.$Message.warning('只能选择一个进行处理')
                    }
                },
            //根据问题编号ID初始化处理详情页面
            initHandle(questionCode){
               let params={
                     questionCode:questionCode
               }
                this.request('business_get_question_detail', {data:params}, false).then((res) => {
                            if(res.code==1){
                                   this.dealformSearch  =res.data 
                                   this.dealshowFilelist=res.data.dealAttachmentdList
                                   console.log(this.dealshowFilelist,'000000000')
                                  if(this.dealformSearch.questionType){
                                     if(this.dealformSearch.questionType.indexOf(',')>-1){
                                      this.dealformSearch.questionType=this.dealformSearch.questionType.split(',') 
                                    }else{
                                        this.dealformSearch.questionType=this.dealformSearch.questionType
                                    }
                                  }
                                 
                                  switch(this.dealformSearch.questionStatus){
                                      case 100:
                                       this.dealformSearch.questionStatus='未提交'   
                                       break;
                                      case 300:
                                       this.dealformSearch.questionStatus='待处理'   
                                       break;
                                      case 400:
                                       this.dealformSearch.questionStatus='处理中'   
                                       break;
                                      case 900:
                                       this.dealformSearch.questionStatus='已处理'   
                                       break;
                                  }
                                 
                            }
                            // }else{ 
                            //      //   this.dealshowFilelist=[]
                            // }
                        })
                        
                       console.log(this.dealshowFilelist,'0000000888')   

            },
            //删除
            dele(){
                     if(this.IDS.length>0){
                                this.$Message.warning('已经有选中项了，可以删除')
                     }else{
                                this.$Message.warning('至少选择一个删除')
                     }
                },
            currentChange(page) {
                    this.page = page
                    this.getData()
                },
            sizeChange(pageSize) {
                    this.pageSize = pageSize
                    this.getData()
                },
            formatParams(data) {
                    var arr = [];
                    for (var name in data) {
                    arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
                    }
                    return arr.join("&");
                },
            //导出
            exportEmployee(){
                    let data                =  {}
                        this.formSearch.goodsNo? data.goodsNo                 =  this.formSearch.goodsNo:delete   data.goodsNo    //货号
                        // this.formSearch.questionStatus?   data.questionStatus =  this.formSearch.questionStatus:delete   data.questionStatus //状态
                        // this.formSearch.userId?   data.userId                 =  this.formSearch.userId:delete  data.userId          
                        this.formSearch.questionDesc?   data.questionDesc     =  this.formSearch.questionDesc : delete data.questionDesc //问题描述
                        this.formSearch.resultDesc?   data.resultDesc         =  this.formSearch.resultDesc   : delete data.resultDesc    //核查结果
                        
                        this.formSearch.delayFlag?data.delayFlag              =  this.formSearch.delayFlag   : delete  data.delayFlag
                        this.formSearch.questionCode?data.questionCode        =  this.formSearch.questionCode  : delete  data.questionCode
                        data.wearWash   =  this.formSearch.wearWash 
                        this.formSearch.effectiveFlag?data.effectiveFlag      =  this.formSearch.effectiveFlag: delete  data.effectiveFlag
                        this.formSearch.create?data.startCreateTime           =  this.unix_fullb(this.formSearch.create[0]): delete  data.startCreateTime
                        this.formSearch.create?data.endCreateTime             =  this.unix_fullb(this.formSearch.create[1]): delete  data.endCreateTime
                        this.formSearch.handle?data.startDealTime             =  this.unix_fullb(this.formSearch.handle[0]): delete  data.startDealTime
                        this.formSearch.handle?data.endDealTime               =  this.unix_fullb(this.formSearch.handle[1]): delete  data.endDealTime
                        data.startCreateTime?'':delete  data.startCreateTime
                        data.endCreateTime?''  :delete  data.endCreateTime
                        data.startDealTime?''  :delete  data.startDealTime
                        data.endDealTime?''    :delete  data.endDealTime
                        let params=this.formatParams(data)
                        console.log(params)
                        let questionType= this.formSearch.questionType?`&questionType=${this.formSearch.questionType}`:'';
                        let brandId  =this.formSearch.brandId?`&brandId=${this.formSearch.brandId}`:'';
                        let commitUserId  = this.formSearch.commitUserId?`&commitUserId=${this.formSearch.commitUserId}`:'';
                        let questionStatus= this.formSearch.questionStatus?`&questionStatus=${this.formSearch.questionStatus}`:'';
                        let userId   = this.formSearch.userId?`&userId=${this.formSearch.userId}`:'';
                        // this.formSearch.commitUserId?  data.commitUserId      =  this.formSearch.commitUserId : delete  data.commitUserId
                        // this.formSearch.brandId?    data.brandId              =  this.formSearch.brandId : delete  data.brandId
                        console.log(questionType)
                        console.log(`/eop/business/export_qusetion_list?${params}${questionType}`,params)
                        //  return 
                         location.href=(`/eop/business/export_qusetion_list?${params}${questionType}${brandId}${commitUserId}${questionStatus}${userId}`)
                },
            //初始化品牌列表
            getbrandList(){
                this.request('get_scm_brand_list', {}, false).then((res) => {
                        if(res.code==1){
                        this.brandList=res.data
                        }
                    })    
                },
             //初始化全部用户列表
            allUserList(){
                    this.request('business_get_user_list_all', {}, false).then((res) => {
                            if(res.code==1){
                            this.allusersList=res.data
                            }
                        })    
                },
            //初始化处理人列表
            allDealsList(){
                    this.request('business_get_config_user_list', {}, false).then((res) => {
                            if(res.code==1){
                            this.alldealList=res.data
                            }
                        })    
                },
            //处理提交
            dealSubmit(){
                     if(this.dealformSearch.questionType){
                        if(typeof(this.dealformSearch.questionType)=='string'){
                                    this.dealformSearch.questionType=this.dealformSearch.questionType
                        }else{
                                    this.dealformSearch.questionType=this.dealformSearch.questionType.join(',')
                        } 
                    }
                    let params={};  
                        params.detailId      =this.dealformSearch.detailId
                        params.questionCode  =this.dealformSearch.questionCode
                        params.processDesc   =this.dealformSearch.processDesc
                        params.resultDesc    =this.dealformSearch.resultDesc
                        params.questionType  =this.dealformSearch.questionType
                        params.lastUpdateUser=this.userInfo.userName
                        params.dealUserId    =this.userInfo.userAccount
                        params.wearWash      =this.dealformSearch.wearWash
                        params.questionStatus=900
                    this.request('business_save_deal_result', {data:params}, false).then((res) => {
                            if(res.code==1){
                                 this.dealformSearch={}
                                 this.$Message.success({
                                        content: res.msg,
                                        duration: 3
                                    });
                                this.deal_visible=false;
                            }else{
                                this.deal_visible=true 
                            }
                        })    
                },
            //处理保存
            dealStore(){
                       if(this.dealformSearch.questionType){
                        if(typeof(this.dealformSearch.questionType)=='string'){
                                    this.dealformSearch.questionType=this.dealformSearch.questionType
                        }else{
                                    this.dealformSearch.questionType=this.dealformSearch.questionType.join(',')
                        } 
                    }
                    let params={};  
                        params.detailId      =this.dealformSearch.detailId
                        params.questionCode  =this.dealformSearch.questionCode
                        params.processDesc   =this.dealformSearch.processDesc
                        params.resultDesc    =this.dealformSearch.resultDesc
                        params.questionType  =this.dealformSearch.questionType
                        params.lastUpdateUser=this.userInfo.userName
                        params.dealUserId    =this.userInfo.userAccount
                        params.wearWash      =this.dealformSearch.wearWash
                        params.questionStatus=400
                    this.request('business_save_deal_result', {data:params}, false).then((res) => {
                            if(res.code==1){
                                this.dealformSearch={}
                                 this.$Message.success({
                                        content: res.msg,
                                        duration: 3
                                    });
                                this.deal_visible=false;
                            }else{
                                this.deal_visible=true 
                            }
                        })    
                },
            //根据品牌ID返回品牌名称
            getBrandname(id){
                for(let i=0;i<this.brandList.length;i++){
                    if(id==this.brandList[i].brandId){
                        return this.brandList[i].brandName
                    }
                }
                },
            //初始化第一个列表数据
            getData() {
                     let obj=this.formSearch.questionType
                    if(this.formSearch.questionType){
                        if(typeof(this.formSearch.questionType)=='string'){
                                     obj=obj
                        }else{
                                     obj=obj.join(',')
                        } 
                    }
                    let  questionStatus=this.formSearch.questionStatus
                    if(questionStatus){
                       if(questionStatus.length>0){
                          questionStatus=questionStatus
                      }else{
                          questionStatus=''
                      }
                    }
                    let  brandid=this.formSearch.brandId
                    if(brandid){
                       if(brandid.length>0){
                          brandid=brandid
                      }else{
                          brandid='' 
                      }
                    }
                    let  userId=this.formSearch.userId
                    if(userId){
                       if(userId.length>0){
                          userId=userId
                      }else{
                           userId='' 
                      }
                    }
                    let  commitUserId=this.formSearch.commitUserId
                    if(commitUserId){
                       if(commitUserId.length>0){
                          commitUserId=commitUserId
                      }else{
                          commitUserId=''
                      }
                    }
                    let data                =  {}
                        data.length         =  this.pageSize;
                        data.start          = (this.page - 1) * this.pageSize
                        data.goodsNo        =  this.formSearch.goodsNo      //货号
                        data.questionStatus =  questionStatus//状态
                        data.questionType   =  obj                           //类型
                        data.userId         =  userId         
                        data.questionDesc   =  this.formSearch.questionDesc   //问题描述
                        data.resultDesc     =  this.formSearch.resultDesc     //核查结果
                        data.commitUserId   =  commitUserId
                        data.brandId        =  brandid
                        data.delayFlag      =  this.formSearch.delayFlag
                        data.questionCode   =  this.formSearch.questionCode 
                        data.effectiveFlag  =  this.formSearch.effectiveFlag
                        data.wearWash       =  this.formSearch.wearWash 
                        // data.userId.length ==0? delete data.userId:'';
                        // data.brandId.length==0?delete data.brandId:'';
                        // data.commitUserId.length==0?delete data.commitUserId:'';
                        // data.questionStatus.length==0?delete data.questionStatus:'';
                        this.formSearch.create?data.startCreateTime=this.unix_fullb(this.formSearch.create[0]):delete data.startCreateTime
                        this.formSearch.create?data.endCreateTime  =this.unix_fullb(this.formSearch.create[1]):delete data.endCreateTime
                        this.formSearch.handle?data.startDealTime  =this.unix_fullb(this.formSearch.handle[0]):delete data.startDealTime
                        this.formSearch.handle?data.endDealTime    =this.unix_fullb(this.formSearch.handle[1]):delete data.endDealTime
                    this.request('business_get_qusetion_list', {data:data}, true).then((res) => {
                        if (res.code == 1) {
                            this.list      = res.data.questionList
                            this.total     = res.data.count
                            this.IDS=[]
                        }else{
                            this.list      = []
                            this.total     = '0' 
                        }
                    })

                },
            //返回xxxx年
            unix_fullb:function(unix){
                                if(unix){
                                    var newDate = new Date();
                                    newDate.setTime(unix);
                                var Y = newDate.getFullYear(),
                                    M = newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1,
                                    D = newDate.getDate() < 10 ? ('0' + newDate.getDate()) : newDate.getDate(),
                                    h = newDate.getHours() < 10 ? ('0' + newDate.getHours()) : newDate.getHours(),
                                    m = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes(),
                                    s = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds();
                                return  Y +'-'+ M +'-'+D+' '+h+':'+m+':'+s
                                }
                               
                },
            unix_fullTime:function(unix){
                                var newDate = new Date(unix);
                                var Y       = newDate.getFullYear(),
                                    M       = newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1,
                                    D       = newDate.getDate() < 10 ? ('0' + newDate.getDate()) : newDate.getDate();
                                return  Y +'-'+ M +'-'+D
                },
            //处理逻辑
            goBack(){
                            this.back_visible=true
                },
            // 回退
            backcancel(){
                            this.back_visible=false
                            this.backformSearch={}
                },
            backconfirm(){
                             let params={
                                        questionCode  :this.dealformSearch.questionCode,//问题编号
                                        returnReason  :this.backformSearch.assign=='补充详情'?this.backformSearch.assign+':'+this.backformSearch.note:this.backformSearch.assign,                        // 回退理由
                                        relateCode    :this.backformSearch.number,                         // 关联单号
                                        lastUpdateUser:this.userInfo.userName,                         // 当前用户
                                        dealUserId    :this.userInfo.userAccount,                      // 当前用户account
                              }
                        this.request('business_return_question', {data:params}, false).then((res) => {
                            if(res.code==1){
                                        this.backformSearch={}
                                        this.$Message.warning('已经回退成功')
                                        this.back_visible=false;
                                        this.deal_visible=false;
                                        this.search()
                                }
                            })                              
                },
            handleUpload(file) {
                if (!/\.xls$|.xlsx$|.jpg$|.doc$|.docx$|.png$|.csv$|.doc$|.wps$|.txt$|.pdf$|.dotx$|.bmp$|.jpe$/.test(file.name)) {
                     this.$Message.warning('文件类型不符,请重新选择文件');
                     return false
                } else {
                     this.file = file;
                     this.Filename= file.name
                     setTimeout(()=>{
                            this.$refs['upload'].post(file)
                        },1000)
                      return false;
                }
                },
            uploadSuccess(res, file) {
                    if (res.code == 1) {
                        this.loadingStatus = false;
                        this.file = '';
                             file='';
                        this.dealshowFilelist.push({
                                    id                : res.data.id,
                                    dealAttachmentName: res.data.dealAttachmentName,
                                    dealAttachmentType: res.data.dealAttachmentType,
                                    dealAttachmentUrl : res.data.dealAttachmentUrl,
                        })
                        console.log(this.dealshowFilelist,'000000000000')
                        this.$Message.success({
                            content: res.msg,
                            duration: 3
                        });
                     } else {
                        this.file = '';
                              file='';
                        this.loadingStatus = false;
                        this.$Message.error({
                            content: res.msg,
                            duration: 3
                        });
                    }
                },
            lookbig(url){
                        this.visible=true
                        this.bigPicUrl=url
                },
            lookFile(url){
                    //  window.open('http://eop.eptison.com/'+'/eop/'+url)
                    //  window.open('http://eopuat.eptison.com/'+'/eop/'+url) 
                        window.open('http://eop.quanshangtech.com:888'+'/eop/'+url)
                    //  window.open('http://eopsit.eptison.com/'+'/eop/'+url)
                    console.log(location.href)
                },
            delslice(id,index){
                        this.dealshowFilelist.splice(index,1)
                        let params={
                              fileId:[id],
                              fileType:'A'
                        }
                        this.request('business_delete_file', {data:params}, false).then((res) => {
                        if(res.code==1){
                             this.$Message.warning('已经删除成功了')
                            }
                        })    
                        
                        //  return false
                },
                quxiao(){
                        this.$refs.child.chancel() 
                }
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
