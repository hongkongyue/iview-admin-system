<template>
    <div>
        <Row class="margin-bottom-10 background-color-white exhibition">   
            <Form :model="formSearch" @keydown.native.enter.prevent="search" ref="formSearch" :label-width="90" inline
                label-position="right" style="100px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="品牌:"  :label-width="50" >
                     <Select v-model="formSearch.brand" style="width:120px" :multiple="true">
                              <Option v-for="item in brandList" :value="item.brandId" :key="item.brandId">{{ item.brandName }}</Option>
                      </Select>
                </Form-item>
                <Form-item label="季节:">
                      <Select v-model="formSearch.season" style="width:120px" :multiple="true">
                              <Option v-for="item in seasonList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                </Form-item>
                <Form-item label="年份:">
                    <Col span="12">
                        <DatePicker type="year" v-model="formSearch.date" format="yyyy年" placeholder="请选择年份" style="width: 120px"></DatePicker>
                    </Col>
                </Form-item>
                 <Form-item label="波段:">
                                　<Select v-model="formSearch.wave" style="width:120px">
                                    <Option v-for="item in waveList" :value="item.WAVE_BAND" :key="item.WAVE_BAND">
                                        {{ item.WAVE_BAND }}
                                    </Option>
                                </Select>
                </Form-item>
                <Form-item :label-width="1">
                    <Button type="primary" @click="search">查询</Button>
                    <Button type="default" @click="handleReset">重置</Button>
                </Form-item>
                </Col>
                <Col span="24"  style="padding-left:20px"> 
                <Form-item :label-width="1">
                    <Button type="primary"  @click="downTemplate">下载模板</Button>
                    <Button type="primary"  @click="openModal">导入</Button>
                    <Button type="primary"  @click="add">新增</Button>
                    <Button type="primary"  @click="exportEmployee">导出</Button>

                </Form-item>
                </Col>
            </Form>
        </Row>
        <!-- 数据列表 -->
        <Row class="background-color-white exhibition">
            <Table :columns="columns" size="small" highlight-row :data="list" @on-row-dblclick="getRowdata"></Table>
            <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total
                show-elevator @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
        </Row>
         <!-- 编辑 -->
        <Modal v-model="modal_visible" :styles="mystyle" title="编辑" style="height:900px" @on-cancel='canceledit' :width="80" @on-ok="editSubmit"
            class-name="customize-modal-center"> 
            <Row class="margin-bottom-10 background-color-white exhibition">   
            <Form :model="editformSearch" ref="editformSearch" :label-width="90" inline
                label-position="right" style="50px">
                <Col>
                    <Form-item label="品牌:">
                          <Input v-model="editformSearch.brand" disabled placeholder="请输入品牌" style="width: 120px"></Input> 
                    </Form-item>
                    <Form-item label="季节:">
                           <Input v-model="editformSearch.season" disabled placeholder="请输入季节" style="width: 120px"></Input> 
                    </Form-item>
                    <Form-item label="年份:">
                        <Col span="12">
                             <Input v-model="editformSearch.date" disabled placeholder="请输入年份" style="width: 120px"></Input> 
                        </Col>
                    </Form-item>
                    <Form-item label="波段:">
                                    <Input v-model="editformSearch.wave" disabled placeholder="请输入波段" style="width: 120px"></Input>
                    </Form-item>
                </Col>
                <Col>
                   <Form-item label="规划开发时间:">    
                              <DatePicker type="date"   v-model="editformSearch.planTime"  placement="bottom-end" placeholder="选择时间" style="width: 120px"></DatePicker>
                    </Form-item>
                    <Form-item label="规划交接时间:">  
                               <DatePicker type="date"  v-model="editformSearch.giveTime"   placement="bottom-end" placeholder="选择时间" style="width: 120px"></DatePicker>    
                    </Form-item>
                    <Form-item label="齐色样时间">  
                               <DatePicker type="date"  v-model="editformSearch.giveStyleTime" placement="bottom-end" placeholder="选择时间" style="width: 120px"></DatePicker>  
                    </Form-item>
                    <Form-item label="规划到货时间:">  
                              <DatePicker type="date"   v-model="editformSearch.arriveTime"  placement="bottom-end" placeholder="选择时间" style="width: 120px"></DatePicker>  
                    </Form-item>
                </Col>
                <Col>
                   <Form-item label="拍照时间:">    
                              <DatePicker type="date" v-model="editformSearch.photoTime" placement="bottom-end" placeholder="选择时间" style="width:120px"></DatePicker>
                    </Form-item>
                    <Form-item label="可上新时间:">  
                              <DatePicker type="date" v-model="editformSearch.mayupdateTime" placement="bottom-end" placeholder="选择时间" style="width:120px"></DatePicker>   
                    </Form-item>
                    <Form-item label="上新时间">  
                              <DatePicker type="date" v-model="editformSearch.updateTime" placement="bottom-end" placeholder="选择时间" style="width: 120px"></DatePicker>   
                    </Form-item>
                    <Form-item label="备注：">  
                                <Input type="textarea" v-model="editformSearch.note" placeholder="请输入备注" style="width: 120px"></Input>  
                    </Form-item>
                </Col>
                <Col style="padding-left:20px"> 
                    <Button type="primary" @click="edit_category">添加</Button>    
                </Col>
                <Col  style="padding-left:20px;">
                    <div style="height:250px;overflow:auto;margin-top:20px">
                         <Table :columns="editcolumns" size="small" highlight-row :data="edit_category_list"></Table> 
                         <Page style="margin-top:5px;" :total="detailtotal" :page-size="detailpageSize" :current="detailpage"  show-total
                    show-elevator @on-change="detailcurrentChange" @on-page-size-change="detailsizeChange"></Page>
                    </div> 
                </Col>
            </Form>
            <div slot="footer">
                <Button type="default" @click="cancel">取消</Button>
                <Button type="primary" @click="save">保存</Button>
            </div>
            </Row>
        </Modal>
        <!-- 新增 -->
        <Modal v-model="add_visible" :styles="mystyle" title="新增" @on-ok='addSubmit' @on-cancel='canceladd' :width="80" class-name="customize-modal-center">
            <Row class="margin-bottom-10 background-color-white exhibition">   
                <Form :model="addformSearch" ref="addformSearch" :label-width="90" inline
                    label-position="right" style="50px">
                    <Col>
                        <Form-item label="品牌:">
                            <Select v-model="addformSearch.brand" style="width:120px"     @on-change="checkParamsIsExist()">
                            <Option v-for="item in brandList" :value="item.brandId" :key="item.brandId">{{ item.brandName }}</Option>
                            </Select>
                        </Form-item>
                        <Form-item label="季节:">
                            <Select v-model="addformSearch.season" style="width:120px"     @on-change="checkParamsIsExist()">
                                    <Option v-for="item in seasonList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Form-item>
                        <Form-item label="年份:">
                            <Col span="12">
                                <DatePicker type="year"     @on-change="checkParamsIsExist()" v-model="addformSearch.date" placeholder="请选择年份" style="width: 120px"></DatePicker>
                            </Col>
                        </Form-item>
                        <Form-item label="波段:">
                                        　<Select v-model="addformSearch.wave" style="width:120px"     @on-change="checkParamsIsExist()">
                                            <Option v-for="item in waveList" :value="item.WAVE_BAND" :key="item.WAVE_BAND">
                                                {{ item.WAVE_BAND }}
                                            </Option>
                                        </Select>
                        </Form-item>
                    </Col>
                    <Col>
                    <Form-item label="规划开发时间:">    
                                <DatePicker type="date"   v-model="addformSearch.planTime"  placement="bottom-end" placeholder="选择时间" style="width: 120px"></DatePicker>
                        </Form-item>
                        <Form-item label="规划交接时间:">  
                                <DatePicker type="date"  v-model="addformSearch.giveTime"   placement="bottom-end" placeholder="选择时间" style="width: 120px"></DatePicker>    
                        </Form-item>
                        <Form-item label="齐色样时间">  
                                <DatePicker type="date"  v-model="addformSearch.giveStyleTime" placement="bottom-end" placeholder="选择时间" style="width: 120px"></DatePicker>  
                        </Form-item>
                        <Form-item label="规划到货时间:">  
                                <DatePicker type="date"   v-model="addformSearch.arriveTime"  placement="bottom-end" placeholder="选择时间" style="width: 120px"></DatePicker>  
                        </Form-item>
                    </Col>
                    <Col>
                    <Form-item label="拍照时间:">    
                                <DatePicker type="date" v-model="addformSearch.photoTime" placement="bottom-end" placeholder="选择时间" style="width:120px"></DatePicker>
                        </Form-item>
                        <Form-item label="可上新时间:">  
                                <DatePicker type="date" v-model="addformSearch.mayupdateTime" placement="bottom-end" placeholder="选择时间" style="width:120px"></DatePicker>   
                        </Form-item>
                        <Form-item label="上新时间">  
                                <DatePicker type="date" v-model="addformSearch.updateTime" placement="bottom-end" placeholder="选择时间" style="width: 120px"></DatePicker>   
                        </Form-item>
                        <Form-item label="备注：">  
                                    <Input type="textarea" v-model="addformSearch.note" placeholder="请输入备注" style="width: 120px"></Input>  
                        </Form-item>
                    </Col>
                    <Col style="padding-left:20px"> 
                        <Button type="primary" @click="add_category">添加</Button>    
                    </Col>
                    <Col  style="padding-left:20px;">
                        <div style="height:250px;overflow:auto;margin-top:20px">
                            <Table :columns="addcolumns" size="small" highlight-row :data="add_category_list" ></Table> 
                        </div> 
                    </Col>
                </Form>
                <div slot="footer">
                    <Button type="default" @click="canceladd">取消</Button>
                    <Button type="primary" @click="addSubmit">保存</Button>
                </div>
                </Row>
        </Modal>
        <!-- 导入 -->
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
                            action="/eop/business/import_business_parameters"
                            :data="{userCode:userInfo.userName}"
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
                    <Button type="default" @click="importCancel">取消</Button>
                    <Button type="primary" @click="importData">导入</Button>
                </div>
            </Modal>
        </div>
        <!-- 三级联动编辑 -->
         <Modal v-model="edit_visible" :styles="mystyle" title="选择产品分类" :width="80"  @on-ok='giveSelectedValue' @on-cancel='cancelSelectedValue'  class-name="customize-modal-center">
          <Form :model="linkage" ref="linkage" :label-width="90" inline
                label-position="right">
            <div style="height:60px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="一级分类:">
                      <!-- <Select v-model="linkage.first" style="width:120px"  @on-open-change="getLevel2value(linkage.first,linkage.second)">
                              <Option v-for="item in levelList1" :value="item.L1" :key="item.L1">{{item.L1}}</Option>
                      </Select> -->
                       <Select v-model="linkage.first" style="width:120px"  @on-open-change="getLevel2value(linkage.first,linkage.second)">
                              <Option v-for="item in levelList1" :value="item.ID" :key="item.ID">{{item.MC}}</Option>
                      </Select>
                </Form-item>
                <Form-item label="二级分类:">
                      <!-- <Select v-model="linkage.second" style="width:120px" @on-open-change="getLevel3value(linkage.second,linkage.third)">
                              <Option v-for="item in levelList2" :value="item.L2" :key="item.L2">{{item.L2}}</Option>
                      </Select> -->
                       <Select v-model="linkage.second" style="width:120px" @on-open-change="getLevel3value(linkage.second,linkage.third)">
                              <Option v-for="item in levelList2" :value="item.ID" :key="item.ID">{{item.MC}}</Option>
                      </Select>
                </Form-item>
                <Form-item label="三级分类:">
                    <Select v-model="linkage.third" style="width:120px">
                              <Option v-for="item in levelList3" :value="item.ID" :key="item.L3">{{item.MC}}</Option>
                    </Select>
                </Form-item>
                </Col>
            </div>
            </Form>
        </Modal>
        <!-- 三级联动新增 -->
         <Modal v-model="editadd_visible" :styles="mystyle" title="选择产品分类" :width="80"  @on-ok='giveSelected2Value'   class-name="customize-modal-center">
          <Form :model="addlinkage" ref="addlinkage" :label-width="90" inline
                label-position="right">
            <div style="height:60px">
                <Col span="24" style="padding-left:7px">
                <Form-item label="一级分类:">
                     <Select v-model="addlinkage.first" style="width:120px"  @on-change="getaddLevel2value(addlinkage.first)">
                              <Option v-for="item in levelList1" :value="item.ID" :key="item.ID">{{item.MC}}</Option>
                      </Select>
                </Form-item>
                <Form-item label="二级分类:">
                      <Select v-model="addlinkage.second" style="width:120px" @on-change="getaddLevel3value(addlinkage.second)">
                              <Option v-for="item in levelList2" :value="item.ID" :key="item.ID">{{item.MC}}</Option>
                      </Select>
                </Form-item>
                <Form-item label="三级分类:">
                    <Select v-model="addlinkage.third" style="width:120px">
                              <Option v-for="item in levelList3" :value="item.ID" :key="item.ID">{{item.MC}}</Option>
                    </Select>
                </Form-item>
                </Col>
            </div>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import Util from 'libs/util';
import { setTimeout } from 'timers';
    function formSearch() {
        return {
            search: ''
        }
    }
    export default {
        data() {
            return {
                mystyle:{
                    top:'10px',
                },
                linkage:{},
                addlinkage:{},
                editadd_visible:false,
                selectedIndex:'',
                selectedaddIndex:'',
                columns: [
                     {
                        title: '序号',
                        key: 'index',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                  return h('span', {
                                        },params.index+1); 
                        },

                    },
                  
                    {
                        title: '品牌名称',
                        key: 'brandName',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '季节',
                        key: 'season',
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: '年份',
                        key: 'years',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '波段',
                        key: 'waveBand',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '规划开发时间',
                        key: 'planDevDate',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '规划交接时间',
                        key: 'planDeliverDate',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '齐色样时间',
                        key: 'colorSimpleDate',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '规划到货时间',
                        key: 'planArriveDate',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '拍照时间',
                        key: 'photoDate',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '可上新时间',
                        key: 'planNewDate',
                        align: 'center',
                        width: 120,
                    },
                     {
                        title: '上新时间',
                        key: 'newDate',
                        align: 'center',
                        width: 120,
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                        width: 190,
                    },
                    {
                        title: '数据ID',
                        key: 'id',
                        align: 'center',
                        width: 120,

                    },
                    {
                        title: '创建时间',
                        key: 'created',
                        align: 'center',
                        width: 160,
                    },
                    {
                        title: '更新时间',
                        key: 'lastUpdated',
                        align: 'center',
                        width: 160,
                    },
                    {title: '修改人',
                        key: 'createUser',
                        align: 'center',
                        width: 120,
                    },
                     {
                        title: '操作',
                        key: 'operate',
                        minWidth: 150,
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
                                            this.edit(params.row);
                                            e.stopPropagation()
                                        }
                                    }
                                }, '编辑'),
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
                                                     this.mainTabledelete(params.row.id);
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
                //新增款式
                addcolumns:[{
                        title: '一级分类',
                        key: 'classLevel1',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                             return h('div', {
                                    props: {

                                     },
                                     style: {
                                        border: '1px solid #ccc',
                                        width:'90px',
                                        height:'25px',
                                        lineHeight:'25px'
                                    },
                                    on: {
                                         click: () => {
                                             this.editadd_visible=true;
                                             this.giveaddlinkageValue(
                                             this.add_category_list[params.index].classLevel1,
                                             this.add_category_list[params.index].classLevel2,
                                             this.add_category_list[params.index].classLevel3,
                                             params.index
                                             )

                                        }
                                    }
                                },this.add_category_list[params.index].classLevel1) 
                        }
                    },
                    {
                        title: '二级分类',
                        key: 'classLevel2',
                        align: 'center',
                        width: 120,
                         render: (h, params) => {
                             return h('div', {
                                    props: {

                                     },
                                     style: {
                                        border: '1px solid #ccc',
                                        width:'90px',
                                        height:'25px',
                                        lineHeight:'25px'
                                    },
                                    on: {
                                         click: () => {
                                               this.editadd_visible=true;
                                               this.giveaddlinkageValue(this.add_category_list[params.index].classLevel1,
                                               this.add_category_list[params.index].classLevel2,
                                               this.add_category_list[params.index].classLevel3,
                                                params.index
                                             )
                                        }
                                    }
                                },this.add_category_list[params.index].classLevel2) 
                        }
                    },
                    {
                        title: '三级分类',
                        key: 'classLevel3',
                        align: 'center',
                        width: 150,
                        render: (h, params) => {
                             return h('div', {
                                    props: {

                                     },
                                     style: {
                                        border: '1px solid #ccc',
                                        width:'90px',
                                        height:'25px',
                                        lineHeight:'25px'
                                    },
                                    on: {
                                         click: () => {
                                                this.editadd_visible=true;
                                                this.giveaddlinkageValue(this.add_category_list[params.index].classLevel1,
                                                this.add_category_list[params.index].classLevel2,
                                                this.add_category_list[params.index].classLevel3,
                                                params.index
                                             )
                                        }
                                    }
                                },this.add_category_list[params.index].classLevel3) 
                        }
                    },
                    {
                        title: '开发款数',
                        key: 'devStyleQty',
                        align: 'center',
                        width: 180,
                        render: (h, params) => {
                                 return h('Input', {
                                    props: {
                                        type: 'number',
                                        value: this.add_category_list[params.index].devStyleQty? this.add_category_list[params.index].devStyleQty:'',
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.add_category_list[params.index].devStyleQty =event.target.value;
                                        }
                                    }
                                })
                        }
                    },
                    {
                        title: '开发成本',
                        key: 'devCostPrice',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                 return h('Input', {
                                    props: {
                                        type: 'number',
                                        value: this.add_category_list[params.index].devCostPrice?this.add_category_list[params.index].devCostPrice:'',
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.add_category_list[params.index].devCostPrice =event.target.value;
                                    
                                        }
                                    }
                                })
                        }
                    },
                    {
                        title: '色比',
                        key: 'colorRate',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                 return h('Input', {
                                    props: {
                                        type: 'number',
                                        value: this.add_category_list[params.index].colorRate?this.add_category_list[params.index].colorRate:'',
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.add_category_list[params.index].colorRate =event.target.value;
                                                if(this.add_category_list[params.index].orderStyleQty&&
                                               this.add_category_list[params.index].mainColorQty&&
                                               this.add_category_list[params.index].subColorQty&&
                                               this.add_category_list[params.index].colorRate
                                            ){
                                            //    this.add_category_list[params.index].orderTotalQty=
                                            //      this.add_category_list[params.index].orderStyleQty*
                                            //      this.add_category_list[params.index].mainColorQty+
                                            //      this.add_category_list[params.index].orderStyleQty*
                                            //      this.add_category_list[params.index].subColorQty*(
                                            //      this.add_category_list[params.index].colorRate-1
                                            //      )
                                            //     this.add_category_list[params.index].orderTotalPrice=
                                            //     this.add_category_list[params.index].orderTotalQty*
                                            //      this.add_category_list[params.index].devCostPrice
                                            this.add_category_list[params.index].orderTotalQty=
                                                 
                                                 (this.add_category_list[params.index].orderStyleQty*1000000)*

                                                 (this.add_category_list[params.index].mainColorQty*1000000)/1000000000000

                                                 +
                                                 (this.add_category_list[params.index].orderStyleQty*1000000)*

                                                 this.add_category_list[params.index].subColorQty*1000000*(

                                                 (this.add_category_list[params.index].colorRate-1)*10

                                                 )/10000000000000
                                                this.add_category_list[params.index].orderTotalPrice=
                                                 (this.add_category_list[params.index].orderTotalQty*10000)*
                                                 (this.add_category_list[params.index].devCostPrice*10000)/100000000
                                            }
                                    
                                        }
                                    }
                                })
                        }
                    },
                    {
                        title: '主色',
                        key: 'mainColorQty',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                 return h('Input', {
                                    props: {
                                        type: 'number',
                                        value: this.add_category_list[params.index].mainColorQty?this.add_category_list[params.index].mainColorQty:'',
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.add_category_list[params.index].mainColorQty =event.target.value;
                                                if(this.add_category_list[params.index].orderStyleQty&&
                                               this.add_category_list[params.index].mainColorQty&&
                                               this.add_category_list[params.index].subColorQty&&
                                               this.add_category_list[params.index].colorRate
                                            ){
                                            //    this.add_category_list[params.index].orderTotalQty=
                                            //      this.add_category_list[params.index].orderStyleQty*
                                            //      this.add_category_list[params.index].mainColorQty+
                                            //      this.add_category_list[params.index].orderStyleQty*
                                            //      this.add_category_list[params.index].subColorQty*(
                                            //      this.add_category_list[params.index].colorRate-1
                                            //      )
                                            //     this.add_category_list[params.index].orderTotalPrice=
                                            //     this.add_category_list[params.index].orderTotalQty*
                                            //      this.add_category_list[params.index].devCostPrice
                                            this.add_category_list[params.index].orderTotalQty=
                                                 
                                                 (this.add_category_list[params.index].orderStyleQty*1000000)*

                                                 (this.add_category_list[params.index].mainColorQty*1000000)/1000000000000

                                                 +
                                                 (this.add_category_list[params.index].orderStyleQty*1000000)*

                                                 this.add_category_list[params.index].subColorQty*1000000*(

                                                 (this.add_category_list[params.index].colorRate-1)*10

                                                 )/10000000000000
                                                this.add_category_list[params.index].orderTotalPrice=
                                                 (this.add_category_list[params.index].orderTotalQty*10000)*
                                                 (this.add_category_list[params.index].devCostPrice*10000)/100000000
                                            }
                                    
                                        }
                                    }
                                })
                        }
                    },
                    {
                        title: '辅色',
                        key: 'subColorQty',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                 return h('Input', {
                                    props: {
                                        type: 'number',
                                        value: this.add_category_list[params.index].subColorQty?this.add_category_list[params.index].subColorQty:'',
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.add_category_list[params.index].subColorQty =event.target.value;
                                                if(this.add_category_list[params.index].orderStyleQty&&
                                               this.add_category_list[params.index].mainColorQty&&
                                               this.add_category_list[params.index].subColorQty&&
                                               this.add_category_list[params.index].colorRate
                                            ){
                                            //    this.add_category_list[params.index].orderTotalQty=
                                            //      this.add_category_list[params.index].orderStyleQty*
                                            //      this.add_category_list[params.index].mainColorQty+
                                            //      this.add_category_list[params.index].orderStyleQty*
                                            //      this.add_category_list[params.index].subColorQty*(
                                            //      this.add_category_list[params.index].colorRate-1
                                            //      )
                                            //     this.add_category_list[params.index].orderTotalPrice=
                                            //     this.add_category_list[params.index].orderTotalQty*
                                            //      this.add_category_list[params.index].devCostPrice
                                            this.add_category_list[params.index].orderTotalQty=
                                                 
                                                 (this.add_category_list[params.index].orderStyleQty*1000000)*

                                                 (this.add_category_list[params.index].mainColorQty*1000000)/1000000000000

                                                 +
                                                 (this.add_category_list[params.index].orderStyleQty*1000000)*

                                                 this.add_category_list[params.index].subColorQty*1000000*(

                                                 (this.add_category_list[params.index].colorRate-1)*10

                                                 )/10000000000000
                                                this.add_category_list[params.index].orderTotalPrice=
                                                 (this.add_category_list[params.index].orderTotalQty*10000)*
                                                 (this.add_category_list[params.index].devCostPrice*10000)/100000000
                                            }
                                    
                                        }
                                    }
                                })
                        }
                    },
                    {
                        title: '下单款量',
                        key: 'orderStyleQty',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                 return h('Input', {
                                    props: {
                                        type: 'number',
                                        value: this.add_category_list[params.index].orderStyleQty?this.add_category_list[params.index].orderStyleQty:'',
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.add_category_list[params.index].orderStyleQty =event.target.value;
                                            if(this.add_category_list[params.index].orderStyleQty&&
                                               this.add_category_list[params.index].mainColorQty&&
                                               this.add_category_list[params.index].subColorQty&&
                                               this.add_category_list[params.index].colorRate
                                            ){
                                            //    this.add_category_list[params.index].orderTotalQty=
                                            //      this.add_category_list[params.index].orderStyleQty*
                                            //      this.add_category_list[params.index].mainColorQty+
                                            //      this.add_category_list[params.index].orderStyleQty*
                                            //      this.add_category_list[params.index].subColorQty*(
                                            //      this.add_category_list[params.index].colorRate-1
                                            //      )
                                            //     this.add_category_list[params.index].orderTotalPrice=
                                            //     this.add_category_list[params.index].orderTotalQty*
                                            //      this.add_category_list[params.index].devCostPrice
                                            this.add_category_list[params.index].orderTotalQty=
                                                 
                                                 (this.add_category_list[params.index].orderStyleQty*1000000)*

                                                 (this.add_category_list[params.index].mainColorQty*1000000)/1000000000000

                                                 +
                                                 (this.add_category_list[params.index].orderStyleQty*1000000)*

                                                 this.add_category_list[params.index].subColorQty*1000000*(

                                                 (this.add_category_list[params.index].colorRate-1)*10

                                                 )/10000000000000
                                                this.add_category_list[params.index].orderTotalPrice=
                                                 (this.add_category_list[params.index].orderTotalQty*10000)*
                                                 (this.add_category_list[params.index].devCostPrice*10000)/100000000
                                            }
                                            console.log(this.add_category_list[params.index].orderTotalQty)
                                        }
                                    }
                                })
                        }
                    },
                    {
                        title: '下单数量',
                        key: 'orderTotalQty',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                  return h('span', {
                                        }, this.add_category_list[params.index].orderTotalQty); 
                        }
                    },
                    {
                        title: '下单金额',
                        key: 'orderTotalPrice',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                 return h('span', {
                                        },  this.add_category_list[params.index].orderTotalPrice); 
                        }
                    },
                    {
                        title: '备注',
                        key: 'detailRemark',
                        align: 'center',
                        width: 120, 
                        render: (h, params) => {
                                 return h('Input', {
                                    props: {
                                        type: 'textarea',
                                        value: '',
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.add_category_list[params.index].detailRemark =event.target.value;
                                    
                                        }
                                    }
                                })
                        }
                    },
                      {
                        title: '操作',
                        key: 'operate',
                        minWidth: 150,
                        fixed: 'right',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
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
                                            this.addDelete(params.row.id);
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    }],
                  //编辑款式
                  editcolumns:[{
                        title: '一级分类',
                        key: 'classLevel1',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            return h('div', {
                                    props: {
                                     },
                                     style: {
                                        border: '1px solid #ccc',
                                        width:'90px',
                                        height:'25px',
                                        lineHeight:'25px'
                                    },
                                    on: {
                                         click: () => {
                                                this.linkage={}
                                                this.edit_visible=true
                                                //编辑赋值
                                                this.givelinkageValue(
                                                    this.edit_category_list[params.index].classLevel1,this.edit_category_list[params.index].classLevel2,this.edit_category_list[params.index].classLevel3,
                                                    params.index
                                                )       
                                        }
                                    }
                                },this.edit_category_list[params.index].classLevel1) 
                        }
                    },
                    {
                        title: '二级分类',
                        key: 'code',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                               return h('div', {
                                    props: {

                                     },
                                     style: {
                                        border: '1px solid #ccc',
                                        width:'90px',
                                        height:'25px',
                                        lineHeight:'25px'
                                    },
                                    on: {
                                         click: () => {
                                                  this.linkage={}
                                                  this.edit_visible=true 
                                                  this.givelinkageValue(
                                                    this.edit_category_list[params.index].classLevel1,this.edit_category_list[params.index].classLevel2,this.edit_category_list[params.index].classLevel3,
                                                     params.index
                                                )      
                                        }
                                    }
                                },this.edit_category_list[params.index].classLevel2)  
                        }
                    },
                    {
                        title: '三级分类',
                        key: 'org_department_name',
                        align: 'center',
                        width: 150,
                        render: (h, params) => {
                                return h('div', {
                                        props: {

                                        },
                                        style: {
                                            border: '1px solid #ccc',
                                            width:'90px',
                                            height:'25px',
                                            lineHeight:'25px'
                                        },
                                        on: {
                                            click: () => {
                                                      this.linkage={}
                                                      this.edit_visible=true  
                                                      this.givelinkageValue(
                                                      this.edit_category_list[params.index].classLevel1,this.edit_category_list[params.index].classLevel2,this.edit_category_list[params.index].classLevel3,
                                                      params.index
                                                )     
                                            }
                                        }
                                    },this.edit_category_list[params.index].classLevel3)  
                        }
                    },
                    {
                        title: '开发款数',
                        key: 'devStyleQty',
                        align: 'center',
                        width: 180,
                        render: (h, params) => {
                                 return h('Input', {
                                    props: {
                                        type: 'number',
                                        value: this.edit_category_list[params.index].devStyleQty? this.edit_category_list[params.index].devStyleQty:'',
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.edit_category_list[params.index].devStyleQty =event.target.value;
                                        }
                                    }
                                })
                        }
                    },
                     {
                        title: '开发成本',
                        key: 'devCostPrice',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                 return h('Input', {
                                    props: {
                                        type: 'number',
                                        value: this.edit_category_list[params.index].devCostPrice?this.edit_category_list[params.index].devCostPrice:'',
                                        size: 'small',
                                        autofocus:true
                                    },
                                    // on: {
                                    //     'on-blur': (event) => {
                                    //         if(event.target.value>0){
                                    //           this.edit_category_list[params.index].devCostPrice =event.target.value;  
                                    //         }else{
                                    //              this.$Message.warning('不能小于0')
                                    //              this.edit_category_list[params.index].devCostPrice=''
                                    //              event.target.value=''
                                    //         }         
                                            
                                           
                                    
                                    //     },
                                    //     'on-change':(event)=>{
                                    //                if(event.target.value<0){
                                    //                     this.$Message.warning('不能小于0')
                                    //                     this.edit_category_list[params.index].devCostPrice=''
                                    //                     event.target.value=''  
                                    //                }
                                    //     }
                                    // }
                                     on: {
                                        'on-blur': (event) => {
                                            if(!this.edit_category_list[params.index].orderStyleQty) return this.$Message.error('下单款量不能为空')
                                            this.edit_category_list[params.index].devCostPrice =event.target.value;
                                             if(this.edit_category_list[params.index].orderStyleQty&&
                                               this.edit_category_list[params.index].mainColorQty&&
                                               this.edit_category_list[params.index].subColorQty&&
                                               this.edit_category_list[params.index].colorRate
                                            ){
                                               this.edit_category_list[params.index].orderTotalQty=
                                                 
                                                 (this.edit_category_list[params.index].orderStyleQty*1000000)*

                                                 (this.edit_category_list[params.index].mainColorQty*1000000)/1000000000000

                                                 +
                                                 (this.edit_category_list[params.index].orderStyleQty*1000000)*

                                                 this.edit_category_list[params.index].subColorQty*1000000*(

                                                 (this.edit_category_list[params.index].colorRate-1)*10

                                                 )/10000000000000
                                                this.edit_category_list[params.index].orderTotalPrice=
                                                (this.edit_category_list[params.index].orderTotalQty*10000)*
                                                 (this.edit_category_list[params.index].devCostPrice*10000)/100000000
                                            }
                                    
                                        }
                                    }
                                })
                        }
                    },
                     {
                        title: '色比',
                        key: 'colorRate',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                 return h('Input', {
                                    props: {
                                        type: 'number',
                                        value: this.edit_category_list[params.index].colorRate?this.edit_category_list[params.index].colorRate:'',
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.edit_category_list[params.index].colorRate =event.target.value;
                                             if(this.edit_category_list[params.index].orderStyleQty&&
                                               this.edit_category_list[params.index].mainColorQty&&
                                               this.edit_category_list[params.index].subColorQty&&
                                               this.edit_category_list[params.index].colorRate
                                            ){
                                               this.edit_category_list[params.index].orderTotalQty=
                                                 
                                                 (this.edit_category_list[params.index].orderStyleQty*1000000)*

                                                 (this.edit_category_list[params.index].mainColorQty*1000000)/1000000000000

                                                 +
                                                 (this.edit_category_list[params.index].orderStyleQty*1000000)*

                                                 this.edit_category_list[params.index].subColorQty*1000000*(

                                                 (this.edit_category_list[params.index].colorRate-1)*10

                                                 )/10000000000000
                                                this.edit_category_list[params.index].orderTotalPrice=
                                                (this.edit_category_list[params.index].orderTotalQty*10000)*
                                                 (this.edit_category_list[params.index].devCostPrice*10000)/100000000
                                            }
                                    
                                        }
                                    }
                                })
                        }
                    },
                    {
                        title: '主色',
                        key: 'mainColorQty',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                 return h('Input', {
                                    props: {
                                        type: 'number',
                                        value: this.edit_category_list[params.index].mainColorQty?this.edit_category_list[params.index].mainColorQty:'',
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.edit_category_list[params.index].mainColorQty =event.target.value;
                                             if(this.edit_category_list[params.index].orderStyleQty&&
                                               this.edit_category_list[params.index].mainColorQty&&
                                               this.edit_category_list[params.index].subColorQty&&
                                               this.edit_category_list[params.index].colorRate
                                            ){
                                               this.edit_category_list[params.index].orderTotalQty=
                                                 
                                                 (this.edit_category_list[params.index].orderStyleQty*1000000)*

                                                 (this.edit_category_list[params.index].mainColorQty*1000000)/1000000000000

                                                 +
                                                 (this.edit_category_list[params.index].orderStyleQty*1000000)*

                                                 this.edit_category_list[params.index].subColorQty*1000000*(

                                                 (this.edit_category_list[params.index].colorRate-1)*10

                                                 )/10000000000000
                                                this.edit_category_list[params.index].orderTotalPrice=
                                                (this.edit_category_list[params.index].orderTotalQty*10000)*
                                                 (this.edit_category_list[params.index].devCostPrice*10000)/100000000
                                            }
                                    
                                        }
                                    }
                                })
                        }
                    },
                     {
                        title: '辅色',
                        key: 'subColorQty',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                 return h('Input', {
                                    props: {
                                        type: 'number',
                                        value: this.edit_category_list[params.index].subColorQty?this.edit_category_list[params.index].subColorQty:'',
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.edit_category_list[params.index].subColorQty =event.target.value;
                                             if(this.edit_category_list[params.index].orderStyleQty&&
                                               this.edit_category_list[params.index].mainColorQty&&
                                               this.edit_category_list[params.index].subColorQty&&
                                               this.edit_category_list[params.index].colorRate
                                            ){
                                               this.edit_category_list[params.index].orderTotalQty=
                                                 
                                                 (this.edit_category_list[params.index].orderStyleQty*1000000)*

                                                 (this.edit_category_list[params.index].mainColorQty*1000000)/1000000000000

                                                 +
                                                 (this.edit_category_list[params.index].orderStyleQty*1000000)*

                                                 this.edit_category_list[params.index].subColorQty*1000000*(

                                                 (this.edit_category_list[params.index].colorRate-1)*10

                                                 )/10000000000000
                                                this.edit_category_list[params.index].orderTotalPrice=
                                                (this.edit_category_list[params.index].orderTotalQty*10000)*
                                                 (this.edit_category_list[params.index].devCostPrice*10000)/100000000
                                            }
                                    
                                        }
                                    }
                                })
                        }
                    },
                    {
                        title: '下单款量',
                        key: 'orderStyleQty',
                        align: 'center',
                        width: 120,
                         render: (h, params) => {
                                 return h('Input', {
                                    props: {
                                        type: 'number',
                                        value: this.edit_category_list[params.index].orderStyleQty?this.edit_category_list[params.index].orderStyleQty:'',
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.edit_category_list[params.index].orderStyleQty =event.target.value;
                                            if(this.edit_category_list[params.index].orderStyleQty&&
                                               this.edit_category_list[params.index].mainColorQty&&
                                               this.edit_category_list[params.index].subColorQty&&
                                               this.edit_category_list[params.index].colorRate
                                            ){
                                               this.edit_category_list[params.index].orderTotalQty=
                                                 
                                                 (this.edit_category_list[params.index].orderStyleQty*1000000)*

                                                 (this.edit_category_list[params.index].mainColorQty*1000000)/1000000000000

                                                 +
                                                 (this.edit_category_list[params.index].orderStyleQty*1000000)*

                                                 this.edit_category_list[params.index].subColorQty*1000000*(

                                                 (this.edit_category_list[params.index].colorRate-1)*10

                                                 )/10000000000000
                                                this.edit_category_list[params.index].orderTotalPrice=
                                                (this.edit_category_list[params.index].orderTotalQty*10000)*
                                                 (this.edit_category_list[params.index].devCostPrice*10000)/100000000
                                            }
                                        }
                                    }
                                })
                        }
                    },
                    {
                        title: '下单数量',
                        key: 'orderTotalQty',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                  return h('span', {
                                        }, this.edit_category_list[params.index].orderTotalQty); 
                        }
                    },
                    {
                        title: '下单金额',
                        key: 'orderTotalPrice',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                                 return h('span', {
                                        },  this.edit_category_list[params.index].orderTotalPrice); 
                        }
                    },
                    {
                        title: '备注',
                        key: 'detailRemark',
                        align: 'center',
                        width: 120, 
                        render: (h, params) => {
                                 return h('Input', {
                                    props: {
                                        type: 'textarea',
                                        value: this.edit_category_list[params.index].detailRemark,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.edit_category_list[params.index].detailRemark =event.target.value;
                                    
                                        }
                                    }
                                })
                        }
                    },
                      {
                        title: '操作',
                        key: 'operate',
                        minWidth: 150,
                        fixed: 'right',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
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
                                            this.editDelete(params.index);
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    }],
                userInfo: {},
                rowData:{},//行内数据
                list: [],
                detaillist:[],
                detailtotal:0,
                total: 0,
                detailpage:0,
                page: 1,
                detailpageSize: 10,
                pageSize: 10,
                addformSearch:{ //新增搜索条件
                },
                formSearch: {
                    is_incumbency:'1'
                },
                editformSearch:{//编辑条件

                },
                brandList:[],          //品牌列表
                waveList: [],          //波段列表
                levelList:[],          //品级列表
                levelList1:[],         //品级列表
                levelList2:[],         //品级列表
                levelList3:[],         //品级列表
                modal_visible:false,   // 编辑
                add_visible  :false,   // 新增
                edit_visible :false,   //编辑三级分类选择
                style_visible:false,   //款式弹框
                renderType   : '',     //渲染条件
                checkBrandIs_add:false,//校验品牌是否可以添加
                checkBrandIs_edit:true,//默认是可以编辑提交的
                importModal      :false,//导入弹框
                loadingStatus: false,
                file: null,
                seasonList   :[         //四季列表
                  {label:'春季',value:'春季'},
                  {label:'夏季',value:'夏季'},
                  {label:'秋季',value:'秋季'},
                  {label:'冬季',value:'冬季'},
                ],
                mainTableId:'',         //主表id
                edit_category_list:[], //编辑列表中的列表
                add_category_list:[], //新增弹框中的添加列表；
                submit_data:{},
                
            }
        },
        mounted() {
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            this.getData()
            this.getbrandList()
            this.getwaveList()
            this.getLevelList()
            this.getLevel1value()
        },
        activated() {

        },
        methods: {
            //编辑提交
            editSubmit(){
                if(!this.editformSearch.planTime) return
                if(!this.editformSearch.giveTime) return
                if(!this.editformSearch.giveStyleTime) return
                if(!this.editformSearch.arriveTime) return
                if(!this.editformSearch.photoTime) return
                if(!this.editformSearch.mayupdateTime) return
                if(!this.editformSearch.updateTime)   return
               if(this.edit_category_list.length==0){
                   this.modal_visible = true &&this.$Message.error('企划参数至少有一条分类,请确认')
                   return false
               }
               let params={
                        id              : this.mainTableId,             
                        planDevDate     : this.unix_fullTime(this.editformSearch.planTime),
                        planDeliverDate : this.unix_fullTime(this.editformSearch.giveTime),
                        colorSimpleDate : this.unix_fullTime(this.editformSearch.giveStyleTime),
                        planArriveDate  : this.unix_fullTime(this.editformSearch.arriveTime),
                        photoDate       : this.unix_fullTime(this.editformSearch.photoTime),
                        planNewDate     : this.unix_fullTime(this.editformSearch.mayupdateTime),
                        newDate         : this.unix_fullTime(this.editformSearch.updateTime),
                        remark          : this.editformSearch.note,
                        createUser      : this.userInfo.userName,
               }
                  params.parametersDetail=[];
               for(let i=0;i<this.edit_category_list.length;i++){
                   if(this.edit_category_list[i].classLevel1
                     &&this.edit_category_list[i].classLevel2
                    //  &&this.edit_category_list[i].classLevel3
                     &&this.edit_category_list[i].orderTotalQty
                     &&this.edit_category_list[i].orderTotalPrice
                     ){
                            params.parametersDetail.push({
                                detailId:this.edit_category_list[i].detailId,
                                classLevel1:this.edit_category_list[i].classLevel1,
                                classLevel2:this.edit_category_list[i].classLevel2,
                                classLevel3:this.edit_category_list[i].classLevel3,
                                devStyleQty:this.edit_category_list[i].devStyleQty,
                                devCostPrice:this.edit_category_list[i].devCostPrice,
                                colorRate:this.edit_category_list[i].colorRate,
                                mainColorQty:this.edit_category_list[i].mainColorQty,
                                subColorQty:this.edit_category_list[i].subColorQty,
                                orderStyleQty:this.edit_category_list[i].orderStyleQty,
                                detailRemark:this.edit_category_list[i].detailRemark,
                                orderTotalQty:this.edit_category_list[i].orderTotalQty,
                                orderTotalPrice:this.edit_category_list[i].orderTotalPrice
                        })
                     }
                   
               }
                //  add_business_parameters
                  this.request('edit_business_parameters', {data:params}, false).then((res) => {
                    if(res.code==1){
                    //    this.add_category_list=[];
                        this.page = 1
                        this.pageSzie = 10
                        this.checkBrandIs_edit=true;//需要验证
                        // this.addformSearch = {}//新增参数清空
                        this.getData()
                    }
                })     
            }, 
            //新增提交
            addSubmit(){
               if(!this.addformSearch.planTime){
                   this.addformSearch={};
                   this.add_category_list=[];
                   return false;
               }
               if(!this.addformSearch.giveTime) {
                   this.addformSearch={};
                   this.add_category_list=[];
                   return false;
               }
               if(!this.addformSearch.giveStyleTime){
                   this.addformSearch={};
                   this.add_category_list=[];
                   return false;
               }
               if(!this.addformSearch.arriveTime) {
                   this.addformSearch={};
                   this.add_category_list=[];
                   return false;
               }
               if(!this.addformSearch.photoTime){
                   this.addformSearch={};
                   this.add_category_list=[];
                   return false;
               }
               if(!this.addformSearch.mayupdateTime) {
                   this.addformSearch={};
                   this.add_category_list=[];
                   return false;
               }
               if(!this.addformSearch.updateTime)  {
                   this.addformSearch={};
                   this.add_category_list=[];
                   return false;
               }
               if(this.add_category_list.length==0){
                   this.addformSearch={};
                   this.add_category_list=[];
                   return false;
               }
               if(!this.checkBrandIs_add) return //前面的字段是否为空
               let params={
                        brandId         :this.addformSearch.brand,
                        brandName       :this.getBrandname(this.addformSearch.brand),
                        season          :this.addformSearch.season,
                        years           :this.unix_fullb(this.addformSearch.date),
                        waveBand        :this.addformSearch.wave,
                        planDevDate     :this.unix_fullTime(this.addformSearch.planTime),
                        planDeliverDate :this.unix_fullTime(this.addformSearch.giveTime),
                        colorSimpleDate :this.unix_fullTime(this.addformSearch.giveStyleTime),
                        planArriveDate  :this.unix_fullTime(this.addformSearch.arriveTime),
                        photoDate       :this.unix_fullTime(this.addformSearch.photoTime),
                        planNewDate     :this.unix_fullTime(this.addformSearch.mayupdateTime),
                        newDate         :this.unix_fullTime(this.addformSearch.updateTime),
                        remark          :this.addformSearch.note,
                        createUser      :this.userInfo.userName,
               }
                  params.parametersDetail=[];
               for(let i=0;i<this.add_category_list.length;i++){
                   if(this.add_category_list[i].classLevel1
                     &&this.add_category_list[i].classLevel2
                    //  &&this.add_category_list[i].classLevel3
                     &&this.add_category_list[i].orderTotalQty
                     &&this.add_category_list[i].orderTotalPrice
                     ){
                            params.parametersDetail.push({
                            classLevel1:this.add_category_list[i].classLevel1,
                            classLevel2:this.add_category_list[i].classLevel2,
                            classLevel3:this.add_category_list[i].classLevel3,
                            devStyleQty:this.add_category_list[i].devStyleQty,
                            devCostPrice:this.add_category_list[i].devCostPrice,
                            colorRate:this.add_category_list[i].colorRate,
                            mainColorQty:this.add_category_list[i].mainColorQty,
                            subColorQty:this.add_category_list[i].subColorQty,
                            orderStyleQty:this.add_category_list[i].orderStyleQty,
                            detailRemark:this.add_category_list[i].detailRemark,
                            orderTotalQty:this.add_category_list[i].orderTotalQty,
                            orderTotalPrice:this.add_category_list[i].orderTotalPrice
                        })
                     }
                   
               }
                //  add_business_parameters
                  this.request('add_business_parameters', {data:params}, false).then((res) => {
                    if(res.code==1){
                       this.add_category_list=[];
                        this.page = 1
                        this.pageSzie = 10
                        this.checkBrandIs_add=false;//需要验证
                        this.addformSearch = {}//新增参数清空
                        this.getData()
                    }
                })     
            },
            //新增弹框方法集合
            add_category(){
                this.add_category_list.push({
                    classLevel1:'',
                    classLevel2:'',
                    classLevel3:'',
                    devStyleQty:'',
                    devCostPrice:'',
                    colorRate:'',
                    mainColorQty:'',
                    subColorQty:'',
                    orderStyleQty:'',
                    detailRemark:'',
                    orderTotalQty:'',
                    orderTotalPrice:'',
                })       
            },
             //编辑新增方法集合
            edit_category(){
                this.edit_category_list.push({
                    classLevel1:'',
                    classLevel2:'',
                    classLevel3:'',
                    devStyleQty:'',
                    devCostPrice:'',
                    colorRate:'',
                    mainColorQty:'',
                    subColorQty:'',
                    orderStyleQty:'',
                    detailRemark:'',
                    orderTotalQty:'',
                    orderTotalPrice:'',
                })       
            },
             //双击实现开发明细
           getRowdata(row,index){
               this.edit(row)
           },
           //根据主表id查询企划参数明细
           getParamsDetail(id){
               let data={}
                   data.mainId=id;
                   data.length=this.detailpageSize
                   data.start = (this.detailpage - 1) * this.pageSize;
               this.request('get_parameters_detail_list', {data:data}, false).then((res) => {
                    if(res.code==1){
                       this.detaillist=res.data.parametersDetail;
                       this.edit_category_list=res.data.parametersDetail;
                       this.detailtotal=res.data.count
                    }
                })     
           },
             //搜索重置
            handleReset(){
                this.page = 1
                this.pageSzie = 10
                this.formSearch = {}
                this.getData()
            },
            //搜索
            search() {
                this.page =1
                this.getData()
            },
            currentChange(page) {
                this.page = page
                this.getData()
            },
            sizeChange(pageSize) {
                this.pageSize = pageSize
                this.getData()
            },
            detailcurrentChange(page) {
                this.detailpage = page
                // this.getData()
                this.getParamsDetail(this.mainTableId) 
                
            },
            detailsizeChange(pageSize) {
                this.detailpageSize = pageSize
                this.getParamsDetail(this.mainTableId) 
            },
            //监听校验新增企划是否存在
             checkParamsIsExist(){
                 if(!this.addformSearch.brand||!this.addformSearch.date||!this.addformSearch.season||!this.addformSearch.wave)return
                 let params={
                            brandId:this.addformSearch.brand,
                            years:this.unix_fullb(this.addformSearch.date),
                            season:this.addformSearch.season,
                            waveBand:this.addformSearch.wave
                 }
                 this.request('check_parameter_exist', {data:params}, false).then((res) => {
                    if(res.code==1){
                        //res.data.isExist返回false时可以添加
                       if(res.data.isExist==false) {
                         this.checkBrandIs_add=true
                         this.$Message.success(`该品牌:`+this.getBrandname(this.addformSearch.brand)+this.unix_fullb(this.addformSearch.date)+`${this.addformSearch.season}${this.addformSearch.wave}波段OK，可以添加`);  
                       }else{
                          this.checkBrandIs_add=false
                          this.$Message.error(`该品牌:`+this.getBrandname(this.addformSearch.brand)+this.unix_fullb(this.addformSearch.date)+`${this.addformSearch.season}${this.addformSearch.wave}波段已存在，请修改`)
                       }
                         return false
                    }
                    
                })    
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
                let data = {}
                // data.brandId = this.formSearch.brand
                
                // data.season = this.formSearch.season
                // data.waveBand = this.formSearch.wave
               
               
                // this.formSearch.brand? data.brandId = this.formSearch.brand :delete data.brandId
                // this.formSearch.season? data.season = this.formSearch.season:delete data.season
                this.formSearch.date? data.years =this.unix_fullb(Number(this.formSearch.date)):delete data.years
                this.formSearch.wave? data.waveBand = this.formSearch.wave :delete data.waveBand 

                let params=this.formatParams(data)
                let brandId=this.formSearch.brand?`&brandId=${this.formSearch.brand}`:'';
                let season=this.formSearch.season?`&season=${this.formSearch.season}`:'';
                location.href=(`/eop/business/export_business_parameters?${params}${brandId}${season}`)
                console.log(`/eop/business/export_business_parameters?${params}${brandId}${season}`,params)
            },
            //初始化品牌列表
            getbrandList(){
              this.request('get_scm_brand_list', {}, false).then((res) => {
                    if(res.code==1){
                      this.brandList=res.data
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
            //初始化波段列表
            getwaveList(){
                this.request('get_wave_band_list', {}, false).then((res) => {
                    if(res.code==1){
                      this.waveList=res.data
                    }
                })    
            },
            //初始化品类层级列表
            getLevelList(){
                  this.request('get_class_level_list', {}, false).then((res) => {
                    if(res.code==1){
                       this.levelList=res.data
                    }
                })     
            },

            //初始化第一个列表数据
            getData() {
                let data               = {}
                    data.length        = this.pageSize;
                    data.start         = (this.page - 1) * this.pageSize
                   
                    data.waveBand      = this.formSearch.wave
                // if(this.formSearch.brand){
                //     if(typeof(this.formSearch.brand)=='string'){
                //         data.brandId   =this.formSearch.brand  
                //     }else{
                //         data.brandId   =(this.formSearch.brand).join(',')
                //     }
                // } 
                //  if(this.formSearch.season){
                //     if(typeof(this.formSearch.season)=='string'){
                //        data.season     =this.formSearch.season  
                //     }else{
                //        data.season     =(this.formSearch.season).join(',')
                //     }
                // } 
                    data.season        = this.formSearch.season
                    data.brandId       = this.formSearch.brand
                this.formSearch.date?data.years=this.unix_fullb(Number(this.formSearch.date)):delete data.years
                this.request('get_parameters_list', {data:data}, true).then((res) => {
                    if (res.code == 1) {
                        this.list      = res.data.parametersList
                        this.total     = res.data.count
                    }else{
                        this.list      = []
                        this.total     = '0' 
                    }
                })

            },
            //返回xxxx年
            unix_fullb:function(unix){
                            var newDate = new Date();
                                newDate.setTime(unix);
                            var Y = newDate.getFullYear(),
                                M = newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1,
                                D = newDate.getDate() < 10 ? ('0' + newDate.getDate()) : newDate.getDate(),
                                h = newDate.getHours() < 10 ? ('0' + newDate.getHours()) : newDate.getHours(),
                                m = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes(),
                                s = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds();
                            return Y 
            },
            unix_fullTime:function(unix){
                            var newDate = new Date(unix);
                            var Y       = newDate.getFullYear(),
                                M       = newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1,
                                D       = newDate.getDate() < 10 ? ('0' + newDate.getDate()) : newDate.getDate();
                            return  Y +'-'+ M +'-'+D
            },
            //新增弹框
            add(){
                this.renderType='add';
                this.add_visible=true;
            },
            //编辑赋值
            edit(row) {
                //获取品类详情数组
                this.editformSearch={};
                this.mainTableId=row.id;
                this.detailpage=1;
                this.getParamsDetail(row.id);
                this.editformSearch.brand=this.getBrandname(row.brandId)
                this.editformSearch.date=row.years
                this.editformSearch.season=row.season
                this.editformSearch.wave=row.waveBand
                this.editformSearch.planTime=row.planDevDate 
                this.editformSearch.giveTime=row.planDeliverDate
                this.editformSearch.giveStyleTime=row.colorSimpleDate
                this.editformSearch.arriveTime=row.planArriveDate
                this.editformSearch.photoTime=row.photoDate
                this.editformSearch.mayupdateTime=row.planNewDate
                this.editformSearch.updateTime=row.newDate
                this.editformSearch.note=row.remark
                this.modal_visible = true 
            },
            //删除
            delete() {

            },
            //新增删除
            addDelete(index){
                 this.add_category_list.splice(index,1)
            },
            //编辑删除 
            editDelete(index){
                 this.edit_category_list.splice(index,1)
            },
            // 主表删除
            mainTabledelete(id){
                let data          = {}
                    data.id       = id
                    data.createUser     = this.userInfo.userName
                this.request('delete_parameters_header', {data:data}, true).then((res) => {
                    if (res.code == 1) {
                         this.handleReset()//重置列表
                    }
                })

            },
            //款式开发明细删除
            detailDelete(id){           // delete_parameters_detail
                let data                = {}
                    data.detailId       = id
                    data.createUser     = this.userInfo.userName
                this.request('delete_parameters_detail', {data:data}, true).then((res) => {
                    if (res.code == 1) {
                       this.getParamsDetail(this.mainTableId) 
                    }
                })

            },
            //弹框取消
            cancel(){
                 this.modal_visible = false
            },
            //新增弹框取消
            canceladd(){
                this.addformSearch={};
                this.add_category_list=[];
            },
            //编辑弹框取消
             canceledit(){
                    this.editformSearch={};
                    this.edit_category_list=[];
            },
            //下载模板
            downTemplate(){
            　　　window.location = ('/excel/企划参数导入模板.xlsx')
　　　　　　　　　　this.$Message.info('下载模板成功')
            },
            //导入
            openModal() {
                this.importModal = true;
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
                if (res.code == 1) {
                    this.loadingStatus = false;
                    this.file = null;
                    this.$Message.success({
                        content: res.msg,
                        duration: 3
                    });
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
            //确定导入
            importData() {
                this.loadingStatus = true;
                this.$refs['upload'].post(this.file);
            },
            //取消导入
            importCancel() {
                this.importModal = false;
                this.file = null;
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
                                    this. getaddLevel3value(this.levelList2[i].ID,third)
                               }
                           }
                       }
                    }
                })
            },
             // 获取三级分类的值
            getaddLevel3value(value,third){
                  if(!value) return
                  this.request('get_class_level3', {data:{ID:value}}, false).then((res) => {
                    if (res.code == 1) {
                       this.levelList3=res.data 
                       if(third){
                           for(let i=0;i< this.levelList3.length;i++){
                               if(third==this.levelList3[i].MC){
                                    this.addlinkage.third=this.levelList3[i].ID
                               }
                           }
                       }
                    }
                })
            },
            // 获取二级分类的值
            getLevel2value(value,second,third){
                if(!value) return
                  this.request('get_class_level2', {data:{ID:value}}, false).then((res) => {
                    if (res.code == 1) {
                       this.levelList2=res.data 
                       if(second){
                           for(let i=0;i< this.levelList2.length;i++){
                               if(second==this.levelList2[i].MC){
                                    this.linkage.second=this.levelList2[i].ID
                                    this. getLevel3value(this.levelList2[i].ID,third)
                               }
                           }
                       }

                    }
                })
            },
             // 获取三级分类的值
            getLevel3value(value,third){
                  if(!value) return
                  this.request('get_class_level3', {data:{ID:value}}, false).then((res) => {
                    if (res.code == 1) {
                        //   this.linkage.third=third 
                          this.levelList3=res.data
                          if(third){
                           for(let i=0;i< this.levelList3.length;i++){
                               if(third==this.levelList3[i].MC){
                                    this.linkage.third=this.levelList3[i].ID
                               }
                           }
                       }
                    }
                })
            },
            givelinkageValue(first,second,third,index){   
                   for(let i=0;i<this.levelList1.length;i++){
                       if(first==this.levelList1[i].MC){
                           this.linkage.first=this.levelList1[i].ID
                       }
                   }
                   
                    // this.linkage.second=second
                    this.selectedIndex=index
                    if(this.linkage.first!=''){
                        this.getLevel2value(this.linkage.first,second,third)
                    }else{
                        return false
                    }
                //    if(this.linkage.second!=''){
                    // setTimeout(function(){this.getLevel3value(this.linkage.second,third)},1500);
                 
                    //   }else{
                    //       return false 
                       
                    // }
            },
            giveaddlinkageValue(first,second,third,index){
                        // this.addlinkage.first  = first
                        // this.addlinkage.second = second
                        // this.addlinkage.third  = third
                        // this.givelinkageValue(first,second,third,'')
                //  if(first){
                //    for(let i=0;i<this.levelList1.length;i++){
                //        if(first==this.levelList1[i].MC){
                //            this.addlinkage.first=this.levelList1[i].ID
                //        }
                //    }  
                //  }else{
                //     this.addlinkage.first=''
                //  }
                  
                    // this.linkage.second=second
                    // this.selectedIndex=index
                    // if(this.addlinkage.first!=''){
                        // this.getaddLevel2value(this.addlinkage.first,second,third)
                    // }else{
                    //     return false
                    // }
                this.selectedaddIndex  = index
            },
            giveSelectedValue(){
                        for(let i=0;i<this.levelList1.length;i++){
                            if(this.linkage.first==this.levelList1[i].ID){
                                this.edit_category_list[this.selectedIndex].classLevel1=this.levelList1[i].MC
                            }
                        }
                         for(let i=0;i<this.levelList2.length;i++){
                            if(this.linkage.second==this.levelList2[i].ID){
                                this.edit_category_list[this.selectedIndex].classLevel2=this.levelList2[i].MC
                            }
                        }
                        for(let i=0;i<this.levelList3.length;i++){
                            if(this.linkage.third==this.levelList3[i].ID){
                                this.edit_category_list[this.selectedIndex].classLevel3=this.levelList3[i].MC
                            }
                        }
            },
            giveSelected2Value(){
                       for(let i=0;i<this.levelList1.length;i++){
                           if(this.addlinkage.first==this.levelList1[i].ID){
                             this.add_category_list[this.selectedaddIndex].classLevel1=this.levelList1[i].MC 
                           }
                       }
                        for(let i=0;i<this.levelList2.length;i++){
                           if(this.addlinkage.second==this.levelList2[i].ID){
                             this.add_category_list[this.selectedaddIndex].classLevel2=this.levelList2[i].MC 
                           }
                       }
                        for(let i=0;i<this.levelList3.length;i++){
                           if(this.addlinkage.third==this.levelList3[i].ID){
                             this.add_category_list[this.selectedaddIndex].classLevel3=this.levelList3[i].MC 
                           }
                       }
                        // this.add_category_list[this.selectedaddIndex].classLevel1=this.addlinkage.first
                        // this.add_category_list[this.selectedaddIndex].classLevel2=this.addlinkage.second
                        // this.add_category_list[this.selectedaddIndex].classLevel3=this.addlinkage.third
                        this.addlinkage={}
            },
            getLevel33value(value){
                   this.linkage.third=value 
            }
        }
    }
</script>

<style>

</style>
