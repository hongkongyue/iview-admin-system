<template>
    <Layout>
        <Content>
                <Row class="background-color-white exhibition">
                    <div style="margin-bottom :20px; height:50px;background-color:#f5f7f9;text-align:left;line-height:50px;font-size:16px; font-weight: bold;padding-left: 20px;">
                    {{this.$route.query.taskCode}} / {{this.$route.query.taskName}} <Button style="margin-top:10px;margin-right:20px;float:right" type="primary" @click="commit">提交</Button>
                    </div>
                     <Row class="margin-bottom-10 background-color-white exhibition">
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="完成进度:"  :label-width="80">
                    <Select v-model="formSearch.brandId" style="width:120px">
                        <Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="大货款号:"  :label-width="80">
                     <Input v-model="formSearch.goodsNo" placeholder=""></Input>
                </Form-item>
                <Form-item :label-width="1">
                    <Button type="primary" @click="search">查询</Button>
                    <Button type="default" @click="handleReset">重置</Button>
                     <Button type="primary" @click="exportEmployee">导出</Button>
                </Form-item>
                </Col>
            </Form>
            
        </Row>
                   <!-- <Table :columns="columns" size="small" highlight-row :data="list" @on-row-dblclick="edit"></Table> -->
                    <Table style="margin-top:20px"  :columns="columns1" size="small" highlight-row :data="list1" @on-row-dblclick="edit"></Table>
                    <!-- <Col span="24" style="padding-left:7px;margin-top:20px">
                        <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="80" inline
                        label-position="right" style="text-align:center" >
                            <Form-item :label-width="1">
                                <Button style="margin-right:20px;" type="primary" @click="commit">提交</Button>
                            </Form-item>
                        </Form>
                    </Col> -->
                </Row>
                <Modal title="查看大图" v-model="visible"> 
                    <img :src="'data:image/png;base64,'+bigUlr" v-if="visible" style="width: 100%">
                </Modal>
                <Modal title="查看属性" v-model="modalWatch" @on-cancel='cancelCk' :footer-hide='true' :width="60" >
                        <Form v-if="modalWatch"  :label-width="80">
                            <div style="display:flex;flex-wrap:wrap ">
                                <div v-for="(item,index) in pluginsList"></div>
                                <Form-item v-for="(item,index) in pluginsList" :key="item.name" :value="item.name" :label="item.name" :label-width="80" style="width:33%">
                                    <Select v-model="pluginsListObject['' + item.name]" disabled :multiple="true" placeholder="" style="width:150px">
                                        <Option v-for="i in item.optionalDTOS" :value="i.name" :key="i.name">{{ i.name }}</Option>
                                    </Select>
                                </Form-item> 
                            </div>
                            <Form-item :label-width="1" style="text-align:center">
                                <Button type="primary" @click="cancelCk">确定</Button>
                                <Button type="default" @click="cancelCk">取消</Button>
                            </Form-item>
                        </Form>
                </Modal>

                <Modal title="选择品类" v-model="modalLV" :footer-hide='true' @on-cancel='cancelLV'  :width="50"> 
                    <Form v-if="modalLV"  :label-width="80">
                     <Row class="margin-bottom-10 background-color-white exhibition">
                        <Col span="12" style="padding-left:7px">
                            <Form-item label="一级分类:">
                                <Select v-model="formLv.first"   @on-change="getaddLevel2value(formLv.first.ID)">
                                    <Option v-for="item in levelList1" :value="item" :key="item">{{item.MC}}</Option>
                                </Select>
                            </Form-item>
                        </Col>
                        <Col span="12" style="padding-left:7px">
                            <Form-item label="二级分类:">
                                <Select v-model="formLv.second">
                                    <Option v-for="item in levelList2" :value="item.MC" :key="item.MC">{{item.MC}}</Option>
                                </Select>
                            </Form-item>
                        </Col>
                        <Col span="12" style="padding-left:7px">
                            <Form-item label="执行标准:">
                                <Input v-model="formLv.zxbz" type="textarea" placeholder=""></Input>
                            </Form-item>
                        </Col>
                        <Col span="12" style="padding-left:7px">
                            <Form-item label="安全类别:">
                                <Input v-model="formLv.aqlb" type="textarea" placeholder=""></Input>
                            </Form-item>
                        </Col>
                        <Col span="12" style="padding-left:7px">
                            <Form-item label="质量等级:">
                                <Input v-model="formLv.zldj" type="textarea" placeholder=""></Input>
                            </Form-item>
                        </Col>
                        <Col span="12" style="padding-left:7px">
                            <Form-item label="洗标类别:">
                                <Input v-model="formLv.xblb" type="textarea" placeholder=""></Input>
                            </Form-item>
                        </Col>
                        <Col span="12" style="padding-left:7px">
                            <Form-item label="国际码:">
                                <Input v-model="formLv.gjm" type="textarea" placeholder=""></Input>
                            </Form-item>
                        </Col>
                        <Col span="12" style="padding-left:7px">
                            <Form-item label="成分:">
                                <Input v-model="formLv.cf" type="textarea" placeholder=""></Input>
                            </Form-item>
                        </Col>
                    </Row>
                        <Form-item :label-width="1" style="text-align:center">
                            <Button type="primary" @click="saveLV">保存</Button>
                            <Button type="default" @click="cancelLV">取消</Button>
                        </Form-item>
                    </Form>
                     </Row>
                </Modal>

                <Modal v-model="saveYes" title="保存分类" @on-ok="saveOk" @on-cancel="saveCancel">
                    <p style="font-size:16px">保存品类将不可修改，请确认是否保存！</p>
                </Modal>
               
                <Modal title="编辑" v-model="modalAdd" :footer-hide='true' @on-cancel='cancelBj'  :width="1300" style="display:flex"> 
                    <Form v-if="modalAdd"  :label-width="80">
                     <div style="display:flex;flex-wrap:wrap ">
                        <Form-item v-for="(item,index) in pluginsList" :key="item.name" :prop="item.name" :label="item.name" :label-width="100" style="width:25%">
                           <Select v-model="pluginsListObject['' + item.name]" placeholder="" style="width:210px" :multiple="true" filterable>
                                <Option v-for="i in item.optionalDTOS" :value="i.name" :key="i.name">{{ i.name }}</Option>
                            </Select> 
                        </Form-item>
                        </div>
                        <Row >
                    <Col span="12" style="padding-left:7px">
                    
                        <Form-item label="面料文案">
                            <Input v-model="formAdd.shellWriter" @on-change='changeXD(formAdd.shellWriter)' type="textarea" placeholder=""></Input>
                        </Form-item>

                         <Form-item label="细节文案">
                            <Input v-model="formAdd.detailWriter" @on-change='changeXD(formAdd.detailWriter)' type="textarea" placeholder=""></Input>
                        </Form-item>
                        
                        <Form-item label="洗涤说明">
                            <Input v-model="formAdd.goodsNo4" @on-change='changeXD(formAdd.goodsNo4)' type="textarea" placeholder=""></Input>
                        </Form-item>
                
                        <Form-item label="温馨提示"  :label-width="80">
                            <Input v-model="formAdd.goodsNo3" @on-change='changeXD(formAdd.goodsNo3)' type="textarea" placeholder=""></Input>
                        </Form-item>
                    </Col>
                    <Col span="12" style="padding-left:7px">
                        <Form-item label="水洗唛文案">
                            <Input v-model="formAdd.washLabel" @on-change='changeXD(formAdd.washLabel)' type="textarea" placeholder=""></Input>
                        </Form-item>
                        <Form-item label="商品卖点"  :label-width="80">
                            <Input v-model="formAdd.goodsNo1" @on-change='changeXD(formAdd.goodsNo1)' type="textarea" placeholder=""></Input>
                        </Form-item>
                
                        <Form-item label="设计解读"  :label-width="80">
                            <Input v-model="formAdd.goodsNo2" @on-change='changeXD(formAdd.goodsNo2)' type="textarea" placeholder=""></Input>
                        </Form-item>

                        <Form-item label="商品ID"  :label-width="80">
                            <Input v-model="formAdd.goodsNoID" @on-change='changeXD(formAdd.goodsNoID)' type="textarea" placeholder=""></Input>
                        </Form-item>
                    </Col>
                    </Row>
                    
                    <Row >
                    <Col span="6" style="padding-left:7px">
                        <span >商品图片：</span><Button  @click="uploadPic" type="primary" style="width:120px;margin-left:20px">上传</Button>
                        <div style="width:150px;height:150px;padding-top:10px;margin-left:80px">
                            <img v-bind:src="AAA" style="width:130px;height:130px">;
                        </div>
                     
                    </Col>
                    <Col span="6" style="padding-left:7px">
                        <span >吊牌图片：</span><Button @click="uploadPicDp" type="primary" style="width:120px;margin-left:20px">上传</Button>
                        <div style="width:150px;height:150px;padding-top:10px;margin-left:80px">
                            <img v-bind:src="BBB" style="width:130px;height:130px">
                        </div>
                    </Col>
                    <Col span="6" style="padding-left:7px">
                        <span >洗水唛图片：</span><Button @click="uploadPicSxm" type="primary" style="width:120px;margin-left:20px">上传</Button>
                        <div style="width:150px;height:150px;padding-top:10px;margin-left:80px">
                            <img v-bind:src="CCC" style="width:130px;height:130px">
                        </div>
                    </Col>
                    <Col span="6" style="padding-left:7px"> 
                    <span >尺寸表：</span><Button @click="uploadshow" type="primary" style="width:120px;margin-left:20px">上传</Button>
                    <div style="padding-top:10px">{{this.cmbName}}</div>
                        
                    </Col>
                    </Row>
                        <Form-item :label-width="1" style="text-align:center">
                            <Checkbox v-model="single" style="color:red">是否同步同款号不同色</Checkbox>
                            <Button type="primary" @click="save">保存</Button>
                            <Button type="default" @click="cancelBj">取消</Button>
                        </Form-item>
                    </Form>
                </Modal>


<!--上传商品图片-->
                <Modal
                v-model="picterVisible"
                title="上传商品图片">
                <div>
                    <Upload
                        ref="upload"
                        name="file"
                        :show-upload-list="false"
                        :before-upload="handleUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        type="drag"
                        action = "/eop/productlaunch/uploadTempGoodInfoFile"
                        :data = "{taskCode:this.$route.query.taskCode,fileType:'good',newFileName:this.name,detailId:this.detailId}"
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
                    <Button type="default" @click="cancelGood">取消</Button>
                    <Button type="primary" @click="upload">导入</Button>
                </div>
            </Modal>
            <!--上传吊牌图片-->
                <Modal
                v-model="picterVisibleDp"
                title="上传吊牌图片">
                <div>
                    <Upload
                        ref="uploadDp"
                        name="file"
                        :show-upload-list="false"
                        :before-upload="handleUploadDp"
                        :on-success="uploadSuccessDp"
                        :on-error="uploadErrorDp"
                        type="drag"
                        action = "/eop/productlaunch/uploadTempGoodInfoFile"
                        :data = "{taskCode:this.$route.query.taskCode,fileType:'tag',newFileName:this.dpName,detailId:this.detailId}"
                    >
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或将文件拖拽到此处</p>
                    </div>
                    </Upload>
                    <div v-if="dpFile !== null">{{ dpFile.name }}
                    <Button type="text"
                            :loading="loadingStatus">{{ loadingStatus ? '上传中...' : '' }}
                    </Button>
                    </div>
                </div>
                <div slot="footer">
                    <Button type="default" @click="cancelTag">取消</Button>
                    <Button type="primary" @click="uploadBBB">导入</Button>
                </div>
            </Modal>

            <!--上传洗水唛图片-->
                <Modal
                v-model="picterVisibleSxm"
                title="上传洗水唛图片">
                <div>
                    <Upload
                        ref="uploadSxm"
                        name="file"
                        :show-upload-list="false"
                        :before-upload="handleUploadSxm"
                        :on-success="uploadSuccessSxm"
                        :on-error="uploadErrorSxm"
                        type="drag"
                        action = "/eop/productlaunch/uploadTempGoodInfoFile"
                        :data = "{taskCode:this.$route.query.taskCode,fileType:'wash',newFileName:this.sxmName,detailId:this.detailId}"
                    >
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或将文件拖拽到此处</p>
                    </div>
                    </Upload>
                    <div v-if="sxmFile !== null">{{ sxmName }}
                    <Button type="text"
                            :loading="loadingStatus">{{ loadingStatus ? '上传中...' : '' }}
                    </Button>
                    </div>
                </div>
                <div slot="footer">
                    <Button type="default" @click="cancelSxm">取消</Button>
                    <Button type="primary" @click="uploadCCC">导入</Button>
                </div>
            </Modal>

            <!--上传尺码表-->
                <Modal
                v-model="excelVisible"
                title="上传尺寸表">
                <div>
                    <Upload
                        ref="uploadCmb"
                        name="file"
                        :show-upload-list="false"
                        :before-upload="handleUploadCmb"
                        :on-success="uploadSuccessCmb"
                        :on-error="uploadErrorCmb"
                        type="drag"
                        action = "/eop/productlaunch/uploadTempGoodInfoFile"
                        :data = "{taskCode:this.$route.query.taskCode,fileType:'size',newFileName:this.cmbName,detailId:this.detailId}"
                    >
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或将文件拖拽到此处</p>
                    </div>
                    </Upload>
                    <div v-if="cmbFile !== null">{{ cmbFile.name }}
                    <Button type="text"
                            :loading="loadingStatus">{{ loadingStatus ? '上传中...' : '' }}
                    </Button>
                    </div>
                </div>
                <div slot="footer">
                    <Button type="default" @click="cancelSize">取消</Button>
                    <Button type="primary" @click="uploadCmb">导入</Button>
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
                single:false,
                input1:[
                {
                    name:"111",
                    id:"222"
                }
            ],
                pluginsListObject:{},
                formdata:{id:'13',name:'q1'},
                pluginsList:[],
                columns1: [{
                        title: '序号',
                        type:'index',
                        align: 'center',
                        width: 60,
                    },
                    {
                        title: '完成进度',
                        key: 'detailStatus',
                        align: 'center',
                        minWidth:90,
                        render(h,params) {
                            if(params.row.detailStatus == 0){
                                return h('span', '未完成')
                            }else{
                                return h('span', '已完成')
                            }
                        },
                    },
                     {
                        title: '大货款号',
                        key: 'goodsNo',
                        align: 'center',
                        minWidth:90,
                        fixed: 'left',
                    },
                      {
                        title: '商品图片',
                        key: 'goodsImg',
                        align: 'center',
                        width: 90,
                        fixed: 'left',
                        render: (h, params) => {
                           if(params.row.goodsImg){
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
                                                       src:this.host+params.row.goodsImg,
                                                       src:'data:image/png;base64,'+params.row.goodsImg,
                                             },
                                            on: {
                                                  click: () => {
                                                                this.getBigImgUrl(params.row.bigImgUrl)
                                                            //   this.bigUlr=params.row.goodsImg
                                                            //   this.visible=true;
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
                        title: '颜色',
                        key: 'color',
                        align: 'center',
                        minWidth:80,
                    },
                    // {
                    //     title: '商品图片地址',
                    //     key: 'color',
                    //     align: 'center',
                    //     minWidth:150,
                    // },
                    {
                        title: '品牌',
                        key: 'brandName',
                        align: 'center',
                        minWidth:80,
                    },
                    {
                        title: '年份',
                        key: 'years',
                        align: 'center',
                        minWidth:70,
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
                        title: '一级分类',
                        key: 'classLevel1',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '二级分类',
                        key: 'classLevel2',
                        align: 'center',
                        minWidth:90,
                    },
                    // {
                    //     title: '三级分类',
                    //     key: 'classLevel3',
                    //     align: 'center',
                    //     minWidth:150,
                    // },
                    {
                        title: '执行标准',
                        key: 'standard',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '安全类别',
                        key: 'securityLevel',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '质量等级',
                        key: 'qualityLevel',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '洗标类别',
                        key: 'washType',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '国际码',
                        key: 'internationalCode',
                        align: 'center',
                        minWidth:80,
                    },
                    {
                        title: '成分',
                        key: 'ingredient',
                        align: 'center',
                        tooltip:true,
                        minWidth:80,
                    //     render: (h, params) => {
                    //         return  h('div',{
                    //                 style:{
                    //                     height:'80px',
                    //                     overflowX: 'auto',
                    //                     overflowY: 'auto'
                    //         }
                    //     },params.row.ingredient)
                    //   }
                    },
                    
                    {
                        title: '属性',
                        key: 'properties',
                        align: 'center',
                        minWidth:80,
                        render: (h, params) => {
                             return  h('a',{
                                    on:{
                                'click':(event)=>{
                                    this.showModal(params.row)
                                }
                            }
                        },'查看')
                       }
                    },
                    {
                        title: '尺寸表',
                        key: 'sizeFileName',
                        align: 'center',
                        minWidth:80,
                        render: (h, params) => {
                            return  h('a',{
                                    on:{
                                'click':(event)=>{
                                    this.downLoad(params.row)
                                }
                            }
                        },params.row.sizeFileName ? params.row.sizeFileName : '')
                      }
                    },
                    {
                        title: '总合约单价',
                        key: 'totalContractPrice',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '零售价',
                        key: 'salePrice',
                        align: 'center',
                        minWidth:90,
                    },
                    {
                        title: '水洗唛文案',
                        key: 'washLabel',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                            return  h('div',{
                                    style:{
                                        height:'80px',
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                            }
                        },params.row.washLabel)
                      }
                    },
                    {
                        title: '水洗唛图片',
                        key: 'washLabelUrl',
                        align: 'center',
                        minWidth: 90,
                        render: (h, params) => {
                           if(params.row.washLabelUrl){
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
                                                       src:this.host+params.row.washLabelUrl,
                                                       src:'data:image/png;base64,'+params.row.washLabelUrl,
                                             },
                                            on: {
                                                  click: () => {
                                                              this.bigUlr=params.row.washLabelUrl
                                                              this.visible=true;
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
                        title: '吊牌图片',
                        key: 'tagFile',
                        align: 'center',
                        minWidth: 90,
                        render: (h, params) => {
                           if(params.row.tagFile){
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
                                                       src:this.host+params.row.tagFile,
                                                       src:'data:image/png;base64,'+params.row.tagFile,
                                             },
                                            on: {
                                                  click: () => {
                                                              this.bigUlr=params.row.tagFile
                                                              this.visible=true;
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
                    // {
                    //     title: '水洗麦',
                    //     key: 'washType',
                    //     align: 'center',
                    //     minWidth:90,
                    // },
                    {
                        title: '面料文案',
                        key: 'shellWriter',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                            return  h('div',{
                                    style:{
                                        height:'80px',
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                            }
                        },params.row.shellWriter)
                      }
                    },
                    {
                        title: '细节文案',
                        key: 'detailWriter',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                            return  h('div',{
                                    style:{
                                        height:'80px',
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                            }
                        },params.row.detailWriter)
                      }
                    },
                    {
                        title: '洗涤说明',
                        key: 'washRemark',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                            return  h('div',{
                                    style:{
                                        height:'80px',
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                            }
                        },params.row.washRemark)
                      }
                    },
                    {
                        title: '温馨提示',
                        key: 'warmTip',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                return  h('div',{
                                    style:{
                                        height:'80px',
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                            }
                        },params.row.warmTip)
                      }
                    },
                    {
                        title: '商品卖点',
                        key: 'sellingPoint',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                return  h('div',{
                                    style:{
                                        height:'80px',
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                            }
                        },params.row.sellingPoint)
                       }
                    },
                     {
                        title: '设计解读',
                        key: 'designInterpret',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                return  h('div',{
                                    style:{
                                        height:'80px',
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                            }
                        },params.row.designInterpret)
                       }
                    },
                    {
                        title: '商品ID',
                        key: 'goodsId',
                        align: 'center',
                        minWidth:120,
                        render: (h, params) => {
                return  h('div',{
                                    style:{
                                        height:'80px',
                                        overflowX: 'auto',
                                        overflowY: 'auto'
                            }
                        },params.row.goodsId)
                       }
                    },
                     {
                        title: '企划跟进人',
                        key: 'plannerName',
                        align: 'center',
                        minWidth:100,
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
                                        marginRight: '5px',
                                        width:'60px'
                                        
                                    },
                                    on: {
                                        click: (e) => {
                                            this.handleChange(params.row)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        width:'60px',
                                        display:params.row.detailStatus == 0 ? 'inline-block' : 'none'
                                    },
                                    on: {
                                        click: (e) => {
                                            this.saveTable(params.row);
                                        }
                                    }
                                }, '完成'),
                            ])
                        }
                    }
                ],
                detailStatus:0,
                formSearch:{},
                formAdd:{},
                list1:[],
                list:[],
                changeName:'',
                bigUlr:'',
                host:'http://eopsit.eptison.com/eop/',
                visible:false,
                changeTemplate:'',
                changeName:'',
                brandListAdd:[],
                statusList:[{id:'1',name:'已完成'},{id:'0',name:'未完成'}],

                file:null,//商品图片
                name:'',
                imgSrcUpload:'',
                AAA:'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1562574299&di=846b4c904bd54d3c3821fa5938888c69&src=http://hbimg.b0.upaiyun.com/bdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658',
                dpFile:null,//吊牌图片
                dpName:'',
                imgSrcUploadDp:'',
                imgSrcUploadSxm:'',
                BBB:'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1562574299&di=846b4c904bd54d3c3821fa5938888c69&src=http://hbimg.b0.upaiyun.com/bdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658',
                cmbFile:null,//尺码表
                CCC:'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1562574299&di=846b4c904bd54d3c3821fa5938888c69&src=http://hbimg.b0.upaiyun.com/bdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658',
                cmbName:'',
                sxmFile:null,
                sxmName:'',
                loadingStatus:false,
                picterVisible:false,//上传商品图片
                picterVisibleDp:false,//上传吊牌图片
                picterVisibleSxm:false,//上传洗水唛图片
                excelVisible:false,//上传文件
                modalWatch:false,//查看
                modalAdd:false,//编辑
                userInfo:'',
                photoGoodsId:'',//获取当前行photoGoodsId
                imgUrlSave:'',//上传商品图片返回路径
                imgTagUrl:'',//上传吊牌图片返回路径
                imgWashUrl:'',//上传水洗唛图片返回路径
                excelUrl:'',//上传尺码表返回路径

                modalLV:false,//没有二级品类 需先选择
                formLv:{},
                levelList1:[],
                levelList2:[],
                rowId:'',

                detailId:'',//上传id
                
                saveYes:false,//二次确认保存
            }
        },
        mounted(){
            this.getData();
            this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo')); 
        },
        activated(){

        },
        created () {
            
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
            //获取详情数据
            getData(){
                let data = {}
                data.currentUserEopId = JSON.parse(window.sessionStorage.getItem('userinfo')).userId
                data.taskCode = this.$route.query.taskCode
                this.formSearch.goodsNo ? data.goodsNo = this.formSearch.goodsNo : delete data.goodsNo
                this.formSearch.brandId ? data.detailStatus = parseInt(this.formSearch.brandId) : delete data.detailStatus
                this.request('detailPageSelect', {data}, false).then((res) => {
                    if(res.code==1){
                        this.list1 = res.data.goodsInfoList
                        this.row = {}
                    }
                })
            },
            search(){
                this.getData()
            },
            //重置
            handleReset(){
                this.formSearch = {}
            },
            changeXD(e){
                if(e.length > 1000){
                    this.$Message.warning('最大的输入长度为1000字节')
                }
            },
            //导出
            exportEmployee(){
                 let data = {}
                this.formSearch.goodsNo ? data.goodsNo = this.formSearch.goodsNo : delete data.goodsNo
                data.taskCode = this.$route.query.taskCode
                this.formSearch.brandId ?data.detailStatus =  this.formSearch.brandId : delete data.detailStatus
                data.currentUserEopId = JSON.parse(window.sessionStorage.getItem('userinfo')).userId
                let zhan = this.formatParams(data)
                location.href=(`/eop/productlaunch/DevelopTaskEntering/detailExport?${zhan}`)
            },
            formatParams(data) {
                var arr = [];
                for (var name in data) {
                arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
                }
                return arr.join("&");
            },
             upload(){
                if(this.file == null){
                    this.$Message.warning('请先上传商品图片再导入')
                }else{
                    this.AAA = this.imgSrcUpload
                    this.picterVisible =false
                    this.loadingStatus = true;
                    Vue.prototype.$loading('正在导入数据...');
                    this.$refs.upload.post(this.file);
                 }
            },
            //上传商品图片
            uploadPic(){
                this.picterVisible = true
            },
            //上传吊牌图片
            uploadPicDp(){
                this.picterVisibleDp = true
            },
            //取消上传商品图片
            cancelGood(){
                this.file = null
                this.picterVisible = false
            },
            //取消上传吊牌图片
            cancelTag(){
                this.dpFile = null
                this.picterVisibleDp = false 
            },
            uploadPicSxm(){
                this.picterVisibleSxm = true
            },
            cancelSxm(){
                this.sxmFile = null
                this.picterVisibleSxm = false 
            },
            //上传尺码表
            uploadshow(){
                this.excelVisible = true 
            },
            //取消上传尺码表
            cancelSize(){
                this.cmbFile = null
                this.excelVisible = false
            },
            //上传之前
            handleUpload(file) {
                if (!/\.jpeg$|.jpg$|.JPG$|.JPEG$|.PNG$|.png$/.test(file.name)) {
                    this.$Message.warning('文件类型不符,支持格式：JPEG，jpeg，JPG，jpg，PNG，png！请重新选择文件');
                    return false
                } else {
                     this.file = file //需要传给后台的file文件
                     this.name = file.name
                    const reader = new FileReader()
                    reader.readAsDataURL(file)
                     reader.onload = () => {
                    const _base64 = reader.result
                    this.imgSrcUpload = _base64//将_base64赋值给图片的src，实现图片预览
                }
            return false//阻止图片继续上传，使得form表单提交时统一上传
                }
            },
            //上传成功之后
            uploadSuccess(res, file) {
                Vue.prototype.$loading.close();
                if (res.code == '1') {
                    this.loadingStatus = false;
                    this.file = null;
                    this.$Message.success(res.msg);
                    this.picterVisible = false;
                    this.imgUrlSave = res.data
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
            //上传
            uploadBBB(){
                if(this.dpFile == null){
                    this.$Message.warning('请先上传吊牌图片再导入')
                }else{
                    this.BBB = this.imgSrcUploadDp
                    this.picterVisibleDp =false
                    this.loadingStatus = true;
                    Vue.prototype.$loading('正在导入数据...');
                    this.$refs.uploadDp.post(this.dpFile);
                }
            },
            //上传之前
            handleUploadDp(file) {
                if (!/\.jpeg$|.jpg$|.JPG$|.JPEG$|.PNG$|.png$/.test(file.name)) {
                    this.$Message.warning('文件类型不符,支持格式：JPEG，jpeg，JPG，jpg，PNG，png！请重新选择文件');
                    return false
                } else {
                     this.dpFile = file //需要传给后台的file文件
                     this.dpName = file.name
                    const reader = new FileReader()
                    reader.readAsDataURL(file)
                     reader.onload = () => {
                    const _base64 = reader.result
                    this.imgSrcUploadDp = _base64//将_base64赋值给图片的src，实现图片预览
                }
            return false//阻止图片继续上传，使得form表单提交时统一上传
                }
            },
            //上传成功之后
            uploadSuccessDp(res, file) {
                Vue.prototype.$loading.close();
                if (res.code == '1') {
                    this.loadingStatus = false;
                    this.dpFile = null;
                    this.$Message.success(res.msg);
                    this.picterVisibleDp = false;
                    this.imgTagUrl = res.data
                } else {
                    this.loadingStatus = false;
                    this.$Message.error({
                        content: res.msg,
                        duration: 3
                    });
                }
            },
           uploadErrorDp(res, file) {
                this.$Message.error(res.msg);
            },

            //上传
            uploadCCC(){
                if(this.sxmFile == null){
                    this.$Message.warning('请先上传洗水唛图片再导入')
                }else{
                    this.CCC = this.imgSrcUploadSxm
                    this.picterVisibleSxm =false
                    this.loadingStatus = true;
                    Vue.prototype.$loading('正在导入数据...');
                    this.$refs.uploadSxm.post(this.sxmFile);
                }
            },
            //上传之前
            handleUploadSxm(file) {
                if (!/\.jpeg$|.jpg$|.JPG$|.JPEG$|.PNG$|.png$/.test(file.name)) {
                    this.$Message.warning('文件类型不符,支持格式：JPEG，jpeg，JPG，jpg，PNG，png！请重新选择文件');
                    return false
                } else {
                     this.sxmFile = file //需要传给后台的file文件
                     this.sxmName = file.name
                    const reader = new FileReader()
                    reader.readAsDataURL(file)
                     reader.onload = () => {
                    const _base64 = reader.result
                    this.imgSrcUploadSxm = _base64//将_base64赋值给图片的src，实现图片预览
                }
            return false//阻止图片继续上传，使得form表单提交时统一上传
                }
            },
            //上传成功之后
            uploadSuccessSxm(res, file) {
                Vue.prototype.$loading.close();
                if (res.code == '1') {
                    this.loadingStatus = false;
                    this.sxmFile = null;
                    this.$Message.success(res.msg);
                    this.picterVisibleSxm = false;
                    this.imgWashUrl = res.data
                } else {
                    this.loadingStatus = false;
                    this.$Message.error({
                        content: res.msg,
                        duration: 3
                    });
                }
            },
           uploadErrorSxm(res, file) {
                this.$Message.error(res.msg);
            },
            //上传尺码表
            uploadCmb(){
                if(this.cmbFile == null){
                    this.$Message.warning('请先上传尺寸表再导入')
                }else{
                    this.excelVisible =false
                    this.loadingStatus = true;
                    Vue.prototype.$loading('正在导入数据...');
                    this.$refs.uploadCmb.post(this.cmbFile);
                }
            },
            
            //上传之前
            handleUploadCmb(file) {
                if (!/\.xlsx$|.xls$/.test(file.name)) {
                    this.$Message.warning('文件类型不符,请重新选择文件');
                    return false
                } else {
                     this.cmbFile = file //需要传给后台的file文件
                     this.cmbName = file.name
                    return false//阻止图片继续上传，使得form表单提交时统一上传
                }
            },
            //上传成功之后
            uploadSuccessCmb(res, file) {
                Vue.prototype.$loading.close();
                if (res.code == '1') {
                    this.loadingStatus = false;
                    this.cmbFile = null;
                    this.$Message.success(res.msg);
                    this.visible = false;
                    this.cmbName = file.name
                    this.excelUrl = res.data
                    console.log(this.cmbName,'00000')
                } else {
                    this.loadingStatus = false;
                    this.$Message.error({
                        content: res.msg,
                        duration: 3
                    });
                }
            },
           uploadErrorCmb(res, file) {
                this.$Message.error(res.msg);
            },

            //查看属性
            showModal(row){
                this.modalWatch = true
                let data ={}
                 data.taskCode = this.$route.query.taskCode
                data.photoGoodsId = row.photoGoodsId
                data.firstClassLevel = row.classLevel1
                data.secondClassLevel = row.classLevel2
                this.request('getPropertiesTitle', {data}, false).then((res) => {
                    if(res.code==1){
                        this.pluginsList = res.data.templateList
                        this.getpluginsList()
                    }
                })
            },
            //取消查看属性
            cancelCk(){
                this.modalWatch = false
            },
            //保存编辑
            save(){
                console.log(this.single) //是否同步
                const parametersJson = this.pluginsList
                 for(let i in parametersJson){
                    this.pluginsListObject[parametersJson[i].name]
                     this.pluginsList[i].label = this.pluginsListObject[parametersJson[i].name] //给label（默认值）赋值
                }
               
                let data = {}
                data.detailStatus = this.detailStatus //状态
                data.properties = this.pluginsList
                data.lastUpdateUser = this.userInfo.userName
                data.taskCode = this.$route.query.taskCode   
                this.imgUrlSave ? data.imgUrl = this.imgUrlSave : delete data.imgUrl //商品图片地址
                this.imgTagUrl ? data.tagFileUrl = this.imgTagUrl : delete  data.tagFileUrl//吊牌地址
                this.dpName ? data.tagFileName = this.dpName : delete data.tagFileName //吊牌名称
                this.imgWashUrl ? data.washLabelUrl = this.imgWashUrl : delete  data.washLabelUrl//洗水唛地址
                this.sxmName ? data.washLabelName = this.sxmName : delete data.washLabelName //洗水唛名称
                this.excelUrl ? data.sizeFileUrl = this.excelUrl : delete data.sizeFileUrl//尺码表地址
                this.cmbName ? data.sizeFileName = this.cmbName : delete data.sizeFileName//尺码表名称
                data.photoGoodsId = this.photoGoodsId
                data.washRemark = this.formAdd.goodsNo4 //洗涤说明
                data.shellWriter = this.formAdd.shellWriter //面料文案  
                data.detailWriter = this.formAdd.detailWriter //细节文案  
                data.washLabel = this.formAdd.washLabel //水洗唛文案
                data.warmTip = this.formAdd.goodsNo3//温馨提示
                data.sellingPoint = this.formAdd.goodsNo1 //商品卖点
                data.designInterpret = this.formAdd.goodsNo2 //设计说明
                data.goodsId = this.formAdd.goodsNoID //商品ID
                data.syncFlag = this.single //是否同步
                this.request('changeSave', {data}, false).then((res) => {
                    if(res.code==1){
                        this.modalAdd = false
                        this.$Message.success('保存成功')
                        this.getData()
                        this.single = false
                        this.formAdd = {}
                        this.row = {}
                    }
                })
            },
            //取消编辑
            cancelBj(){
                this.getData()
                let data = {}
                data.taskCode = this.$route.query.taskCode
                this.request('deleteTempGoodInfoFile', {data}, false).then((res) => {
                    if(res.code==1){
                        this.formAdd = {}
                        this.row = {}
                        this.modalAdd =false
                        this.formLv = {}
                        this.cmbName = ''
                        this.AAA = 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1562574299&di=846b4c904bd54d3c3821fa5938888c69&src=http://hbimg.b0.upaiyun.com/bdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658'
                        this.BBB = 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1562574299&di=846b4c904bd54d3c3821fa5938888c69&src=http://hbimg.b0.upaiyun.com/bdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658'
                        this.CCC = 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1562574299&di=846b4c904bd54d3c3821fa5938888c69&src=http://hbimg.b0.upaiyun.com/bdaca9a07e1a8947c00c2f826ebf848750927aa24963-cATwbg_fw658'
                    }
                })
            },
            //改变当前行数据状态
            saveTable(row){
                let data = {}
                data.taskCode = this.$route.query.taskCode
                data.detailStatus = 1
                data.photoGoodsId = row.photoGoodsId
                data.lastUpdateUser = this.userInfo.userName
                data.syncFlag = false
                this.request('changeSave', {data}, false).then((res) => {
                    if(res.code==1){
                        this.getData()
                    }
                })
            },
            //提交
            commit(){
                let data = {}
                data.taskCode = this.$route.query.taskCode
                data.lastUpdateUser = this.userInfo.userName
                this.request('commitRl', {data}, false).then((res) => {
                    if(res.code==1){
                        this.$Message.success(res.msg)
                        this.$router.push({
                            name: 'lrcpzlwcy',
                            query: {
                                taskCode:this.$route.query.taskCode,
                                taskName:this.$route.query.taskName
                            }
                        });
                    }
                })
            },
            //下载尺寸表
           downLoad(params){
                let data = {}
                data.fileUrl = params.sizeFileUrl
                data.taskCode = this.$route.query.taskCode
                data.fileName = params.sizeFileName
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
                this.visible = true
            },
            handleSaveT(row){
                this.$router.push({
                    name: 'department-review-detail',
                    params: {
                        reviewId: row.id,
                    }
                });
            },
            // 获取一级分类的值
            getLevel1value(){
                 this.request('get_class_level1', {data:{}}, false).then((res) => {
                    if (res.code == 1) {
                       this.levelList1=res.data 
                       console.log(this.levelList1,'00000')
                    }
                })
            },
            getaddLevel2value(value,second,third){
                if(!value) return
                  this.request('get_class_level2', {data:{ID:value}}, false).then((res) => {
                    if (res.code == 1) {
                       this.levelList2=res.data 
                       if(second){
                           for(let i=0;i< this.levelList2.length;i++){
                               if(second==this.levelList2[i].MC){
                                    this.addlinkage.second=this.levelList2[i].ID
                               }
                           }
                       }
                    }
                })
            },
            //保存属性
            saveLV(){
                if(this.formLv.second == undefined){
                    this.$Message.warning('请先选择二级分类再保存！')
                }else{
                    this.saveYes = true
                }
            },
            //二次确认保存
            saveOk(){
                     let data = {}
                    data.lastUpdateUser = this.userInfo.userName
                    data.id = this.rowId
                    data.classLevel1 = this.formLv.first.MC //一级分类
                    data.classLevel2 = this.formLv.second //二级分类
                    data.standard = this.formLv.zxbz //执行标准
                    data.securityLevel = this.formLv.aqlb //安全类别
                    data.qualityLevel = this.formLv.zldj //质量等级
                    data.washType = this.formLv.xblb //洗标类别
                    data.internationalCode = this.formLv.gjm //国际码
                    data.ingredient = this.formLv.cf //成分
                    this.request('editForEntering', {data}, false).then((res) => {
                    if(res.code==1){
                        this.$Message.success('保存成功')
                        this.modalLV = false
                        this.saveYes = false
                        this.rowId = ''
                        this.modalAdd = true
                        this.getSx()
                    }
                })
            },
            //取消保存
            saveCancel(){
                this.saveYes = false
            },
            getSx(){
                    this.photoGoodsId = this.row.photoGoodsId //获取当前行的photoGoodsId
                    this.AAA = 'data:image/png;base64,'+this.row.goodsImg
                    this.BBB = 'data:image/png;base64,'+this.row.tagFile
                    this.CCC = 'data:image/png;base64,'+this.row.washLabelUrl
                    this.cmbName = this.row.sizeFileName
                    this.formAdd.goodsNo4 = this.row.washRemark //洗涤说明
                    this.formAdd.goodsNo3 = this.row.warmTip//温馨提示
                    this.formAdd.goodsNo1 = this.row.sellingPoint //商品卖点
                    this.formAdd.goodsNo2 = this.row.designInterpret //设计说明
                    let data = {}
                    data.taskCode = this.$route.query.taskCode
                    data.photoGoodsId = this.row.photoGoodsId
                    data.firstClassLevel = this.formLv.first.MC
                    data.secondClassLevel = this.formLv.second
                this.request('getPropertiesTitle', {data}, false).then((res) => {
                    if(res.code==1){
                        console.log(res.data)
                        this.pluginsList = res.data.templateList
                        console.log(this.pluginsList)
                        this.getpluginsList()
                    }
                })
            },
            cancelLV(){
                this.formLv = {}
                this.modalLV = false
            },
            handleChange(row){
                console.log(row,'-0-0-0-0-')
                this.row = row //保存当前数据
                if(row.classLevel2 == null){
                    this.rowId = row.photoGoodsId
                    this.modalLV = true
                    this.getLevel1value()
                }else{
                    this.formAdd.washLabel = this.row.washLabel
                    this.detailStatus = this.row.detailStatus
                    this.formAdd.shellWriter = this.row.shellWriter
                    this.formAdd.detailWriter = this.row.detailWriter
                    this.detailId = this.row.photoGoodsId
                    this.photoGoodsId = this.row.photoGoodsId //获取当前行的photoGoodsId
                    this.modalAdd = true
                    this.AAA = 'data:image/png;base64,'+this.row.goodsImg
                    this.BBB = 'data:image/png;base64,'+this.row.tagFile
                    this.CCC = 'data:image/png;base64,'+this.row.washLabelUrl
                    this.cmbName = this.row.sizeFileName
                    this.formAdd.goodsNo4 = this.row.washRemark //洗涤说明
                    this.formAdd.goodsNo3 = this.row.warmTip//温馨提示
                    this.formAdd.goodsNo1 = this.row.sellingPoint //商品卖点
                    this.formAdd.goodsNo2 = this.row.designInterpret //设计说明
                    this.formAdd.goodsNoID = this.row.goodsId //ID
                    let data = {}
                    data.taskCode = this.$route.query.taskCode
                    data.photoGoodsId = this.row.photoGoodsId
                    data.firstClassLevel = this.row.classLevel1
                    data.secondClassLevel = this.row.classLevel2
                this.request('getPropertiesTitle', {data}, false).then((res) => {
                    if(res.code==1){
                        console.log(res.data)
                        this.pluginsList = res.data.templateList
                        console.log(this.pluginsList)
                        this.getpluginsList()
                    }
                })
                  }
            },
            //赋值
            getpluginsList(){
                for (let i=0;i<this.pluginsList.length;i++) {
                    this.pluginsListObject[''+this.pluginsList[i].name] = this.pluginsList[i].label
                }
            },
            handleEdit(row){
                this.$set(row, '$isEdit', false)
            },
        }
    }

</script>

<style  scoped>
     .ivu-select-multiple .ivu-tag{
        max-width: 70px!important;
     }
</style>