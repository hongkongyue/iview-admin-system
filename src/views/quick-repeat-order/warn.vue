<style>
#quickrepeatorder_warn .ivu-table .demo-table-info-cell-color1 {
  background-color: #cd661d;
  color: #000;
}

#quickrepeatorder_warn .ivu-table .demo-table-info-cell-color2 {
  background-color: Peru;
  color: #000;
}

#quickrepeatorder_warn .ivu-card-head {
  padding: 7px 8px !important;
}

#quickrepeatorder_warn .ivu-card-body {
  padding: 8px !important;
}
#quickrepeatorder_warn .right_click_menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  font-size: 12px;
  color: black;
  border: 1px solid #bbb;
  padding: 5px 20px;
  background: white;
  cursor: pointer;
  z-index: 999;
  display: none;
  box-shadow: 4px 3px 5px #aaa;
}
#quickrepeatorder_warn .right_click_menu:hover {
  background: #eee;
}
#quickrepeatorder_warn .ivu-form-item-error-tip {
  display: none;
}
#quickrepeatorder_warn .ivu-tag {
  height: 16px;
  line-height: 0;
  margin: 0;
}
#quickrepeatorder_warn .tag_span {
  display: inline-block;
  height: 16px;
  vertical-align: middle;
  font-size: 12px;
  margin-left: 10px;
}
.el-table td,
.el-table th {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}
.el-table .warning-row {
  /*  background: oldlace;*/
  background: rgb(235, 102, 29);
}
.el-table .success-row {
  /*  background: #f0f9eb;*/
  background: peru;
}
.fff {
  background: #fff !important;
}
@font-face {
  font-family: "iconfont"; /* project id 1578562 */
  src: url("//at.alicdn.com/t/font_1578562_c1ac5qgweum.eot");
  src: url("//at.alicdn.com/t/font_1578562_c1ac5qgweum.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_1578562_c1ac5qgweum.woff2") format("woff2"),
    url("//at.alicdn.com/t/font_1578562_c1ac5qgweum.woff") format("woff"),
    url("//at.alicdn.com/t/font_1578562_c1ac5qgweum.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_1578562_c1ac5qgweum.svg#iconfont") format("svg");
}
</style>

<template>
  <div>
    <Row class="margin-bottom-10 background-color-white exhibition">
      <Form
        :model="formSearch"
        class="search"
        ref="formSearchss"
        :label-width="90"
        inline
        label-position="right"
        @keydown.native.enter.prevent="search"
        :rules="ruleValidate"
      >
        <Card>
          <p slot="title">预警配置</p>
          <!-- <Form-item label="销售取值：">
                        <DatePicker v-model="formSearch.startDate" size="small" @on-change="changeDate" type="date"
                                    :options="pickerOptions"
                                    placeholder="起始时间"
                                    style="width: 120px"></DatePicker>
                    </Form-item>
                    <Form-item :label-width="1">
                        <DatePicker v-model="formSearch.endDate" size="small" @on-change="changeDate" type="date"
                                    :options="pickerOptions"
                                    placeholder="结束时间"
                                    style="width: 120px"></DatePicker>
          </Form-item>-->
          <!-- <Form-item label="销退率：" v-if="false">
                        <i-switch v-model="formSearch.isReturnRate" true-value="Y" false-value="N">
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
          </Form-item>-->
          <Form-item label="品牌：" :label-width="60" prop="brandId">
            <Select
              v-model="formSearch.brandId"
              style="width:120px;text-align: center"
              placeholder="请选择品牌"
            >
              <Option
                v-for="item in brandList"
                :value="item.brandId"
                :key="item.brandId"
              >{{ item.brandName }}</Option>
            </Select>
          </Form-item>
          <Form-item label="款号：" :label-width="80">
            <Input
              v-model="formSearch.sectionNo"
              style="width: 200px"
              placeholder="请输入款号"
              @on-change="Change_sectionNo"
            ></Input>
          </Form-item>
          <Form-item label="销退率：" :label-width="220" style="opacity:0">
            <!-- <InputNumber
              :min="0"
              @keyup.enter.native.prevent="search"
              :disabled="returnRate_disabled"
              v-model="formSearch.returnRate"
              step="0.1"
              style="width: 120px"
              placeholder="请输入销退率"
            ></InputNumber>-->
          </Form-item>
          <Form-item :label-width="1">
            <Button type="primary" @click="search" icon="ios-search">查询</Button>
            <Button type="primary" @click="handleReset">重置</Button>
            <Button type="primary" @click="excuteExport">导出</Button>
          </Form-item>
           <Form-item :label-width="1">
          {{updateTime?'库存数量刷新时间：'+updateTime:''}}
          </Form-item>
          <Col style="margin-top:10px">
          <Form-item label="季节：" :label-width="60">
            <Select
              v-model="formSearch.season"
              style="width:120px;text-align: center"
              placeholder="请选择季节"
            >
              <Option
                v-for="item in season_list"
                :value="item.value"
                :key="item.value"
              >{{ item.value }}</Option>
            </Select>
          </Form-item>
          <Form-item label="品类：">
            <Select v-model="formSearch.className" style="width:120px;" filterable :multiple="true">
              <Option
                v-for="item in class_name_list"
                :value="item.CLASS_NAME"
                :key="item.CLASS_ID"
              >{{item.CLASS_NAME}}</Option>
            </Select>
          </Form-item>
          <Form-item label="可销售天数：" :label-width="100">
            <Select
              v-model="formSearch.saleDayType"
              style="width:120px;text-align: center"
              placeholder="请选择"
            >
              <Option
                v-for="item in saleDayTypeList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item :label-width="1">
            <Input v-model="formSearch.saleDay" style="width:120px;" placeholder="请输入可销售天数"></Input>
          </Form-item>
          </Col>
          <!-- <br>
                    <Form-item>
          <RadioGroup v-model="quick_search" @on-change="changeRadio">-->
          <!-- <Radio label="threeDay">
                                <span>近3天</span>
                            </Radio>
                            <Radio label="sevenDay">
                                <span>近7天</span>
                            </Radio>
                            <Radio label="fifteenDay">
                                <span>近15天</span>
                            </Radio>
                            <Radio label="oneMonth">
                                <span>近1个月</span>
          </Radio>-->
          <!-- <Radio label="threeMonth">
                                <span>近3个月</span>
          </Radio>-->
          <!-- <Radio label="history">
                                <span>自定义</span>
                            </Radio>
                        </RadioGroup>
          </Form-item>-->
        </Card>
      </Form>
      <Col class="margin-top-10">
        <Alert show-icon>
          <Row>
            <Col span="3"></Col>
            <Col span="21">
              <span class="tag_span">预警SKU：{{ total }}个</span>
              <span style="padding-left: 20px">
                <Tag color="Peru"></Tag>
              </span>
              <span class="tag_span">延期预警：与最近货期比较</span>
              <Tag color="rgb(235, 102, 29)" style="margin-left:40px"></Tag>
              <span class="tag_span">缺货预警：与生产周期比较</span>
              <span style="padding-left:20px;cursor:pointer;" @click="showDrawer">
                <i class="iconfont" style="color:#1296db;font-size:16px">&#xe6d7;</i>
                <!-- <Icon type="md-help" /> -->
                <span style="font-size:12px">主表计算公式</span>
              </span>
            </Col>
          </Row>
        </Alert>
      </Col>
      <Col class="margin-top-10" style="position:relative;top:0">
        <!-- <Table size="small" :columns="columns" :data="list" ref='table'  highlight-row></Table> -->
        <!--  :expand-row-keys="expendArray" -->
        <el-table
          cell-class-name="cellcb"
          :data="Tablelist"
          max-height="400"
          row-key="sectionNo"
          border
          :tree-props="{children: 'children',hasChildren: 'hasChildren'}"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            prop="address"
            min-width="280"
            align="center"
            label="操作"
            fixed="right"
            class-name="fff"
            style="background: #fff"
          >
            <template slot-scope="scope">
              <!--  -->
              <el-button
                type="default"
                size="mini"
                v-if="scope.row.tag"
                @click="handleEdit(scope.row)"
              >取消预警</el-button>
              <el-button
                v-if="scope.row.tag"
                type="primary"
                size="mini"
                @click="fandan(scope.row)"
              >返单</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column
            prop="brandName"
            label="品牌"
            align="center"
            min-width="140"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="sectionNo"
            label="款号"
            align="center"
            min-width="180"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="color"
            align="center"
            min-width="170"
            label="颜色"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="norms"
            align="center"
            min-width="120"
            label="规格"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="lastDate"
            align="center"
            min-width="140"
            label="最近货期"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="productionCycle"
            align="center"
            min-width="140"
            label="生产周期"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="reorderHistory"
            align="center"
            min-width="140"
            label="历史返单总量"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="stockNum"
            align="center"
            min-width="140"
            label="现有库存"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="stockOnwayNum"
            align="center"
            min-width="140"
            label="在途库存"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="stockSum"
            align="center"
            min-width="140"
            label="总库存"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="subscribeNum"
            align="center"
            min-width="140"
            label="活动预计占用库存"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="tmsevenSales"
            align="center"
            min-width="140"
            label="非唯品会7天销量"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="tmfifteenSales"
            align="center"
            min-width="140"
            label="非唯品会15天销量"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="vipsevenSales"
            align="center"
            min-width="140"
            label="唯品会7天销量"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="vipfifteenSales"
            align="center"
            min-width="140"
            label="唯品会15天销量"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="saleDays"
            align="center"
            min-width="140"
            label="可销售天数"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="shortDate"
            align="center"
            min-width="140"
            label="预计断码日期"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="saleDayBySeven"
            align="center"
            min-width="150"
            label="可销售天数7天销量"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="saleDayByFifteen"
            align="center"
            min-width="150"
            label="可销售天数15天销量"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="grossRate"
            align="center"
            min-width="140"
            label="毛利率"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
        <!--  <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total :page-size-opts="[10, 50, 100, 200]" show-elevator  @on-change="currentChange"  @on-page-size-change="sizeChange"></Page> -->
        <Page
          style="margin-top:5px;"
          :total="total"
          :page-size="pageSize"
          :current="page"
          show-sizer
          show-total
          :page-size-opts="[10, 20, 30, 40]"
          show-elevator
          @on-change="CurrentChange"
          @on-page-size-change="sizeChange"
        ></Page>
        <!--   <Spin size="large" fix v-if="spinShow"></Spin>
                <div class="right_click_menu" ref='right_click_menu'>
                    <span>自定义列表</span>
        </div>-->
      </Col>
    </Row>
    <Drawer title="主表计算公式" :closable="false" v-model="drawerVisible" width="15" closable>
      <p>1. 总库存=现有库存+在途库存</p>
      <p>2. 可销售天数=（总库存-活动预计占用库存）/选定时间区间的平均日销售单量</p>
      <p>3. 预计断码日期=当前日期+可销售天数</p>
      <p>
        4. 毛利率=（3天总收入-3天总成本）/3天总收入
        备注：某一款号近3天的总销售收入（计算包含退货的），3天总成本=这个款号的不含试制费不含税成本*近3天的总销售数量，该公式计算数据范围是除唯品会的所有平台
      </p>
       <p>
        5.延期预警=最近货期(不能为空或0)与当前系统时间的差值小于0，或者最近货期(不能为空或0)与当前系统时间的差值大于可销售天数，显示预警颜色
      </p>
       <p>
        6.缺货预警=生产周期与当前系统时间的差值小于0，或者生产周期与当前系统时间的差值大于可销售天数，显示预警颜色
      </p>
    </Drawer>
  </div>
</template>
<script>
    import Util from 'libs/util';
    // import customTable from 'libs/customTable';
    import {mapState} from 'vuex';
    import axios from 'axios';
    // import Vue from 'vue';
    // import { isNull } from 'util';

    // var myComponent = Vue.extend({
    //     props:['params'],
    //     template: `
    //         <div>
    //             <span>{{params.row.stockOnwayNum}}</span>
    //             <Tooltip placement="right" v-if="!!params.row.ztsSkuDetailList && params.row.ztsSkuDetailList.length > 0">
    //                 <Icon type="ios-alert" />
    //                 <div slot="content" style="white-space: normal" v-for="(item,index) in params.row.ztsSkuDetailList">
    //                     <span>批次:{{item.pc}}</span>
    //                     <span>在途数:{{item.onwayNum}}</span>                        
    //                 </div>
    //             </Tooltip>
    //         </div>
    //     `,
    //     methods:{
            
    //     }
    // })
    // var GOOD_EXTERNAL_INFO_Component = Vue.extend({
    //     props:['params'],
    //     template: `
    //         <div>
    //             <span>{{params.row.sectionNo}}</span>
    //             <Tooltip placement="right">
    //                 <Icon type="ios-alert" />
    //                 <div slot="content" style="white-space: normal;cursor:pointer">
    //                     <div @click='open_url(params.row.itemUrl)'>{{params.row.itemUrl}}</div>
    //                 </div>
    //             </Tooltip>
    //         </div>
    //     `,
    //     methods:{
    //         open_url(url){
    //             window.open(url);
    //         }
    //     }
    // })
    function formSearch() {
        return {
            brandId: '',	          //品牌	number
            endDate: '',             //销量结束日期	 格式：yyyy-mm-dd
            isReturnRate: 'Y',	      //是否计算销退率	string	Y：是，N：否
            saleDay: '',	            //可销售天数	number
            saleDayType: '',	        //可销售天数计算类型	string	G：大于，L：小于，E：等于
            sectionNo: '',	          //款号	string
            startDate: '',           //销量起始日期	string	格式：yyyy-mm-dd
            userId: '',
            className:[],            //品类
            season:'',               //季节
            returnRate:0,            //销退率
            cancelCodes:'',
        }
    }

    export default {
        // name: "quickrepeatorder_warn",
        data() {
            return {
                 updateTime:'',
                 drawerVisible:false,
                 loadingmask:false,
                 model_visible:false,
                 Tablelist: [],
                // formSearch: formSearch(),
                formSearch:{
                            brandId: '',           //品牌  number
                            endDate: '',             //销量结束日期    格式：yyyy-mm-dd
                            isReturnRate: 'Y',        //是否计算销退率 string  Y：是，N：否
                            saleDay: '',                //可销售天数 number
                            saleDayType: '',            //可销售天数计算类型 string  G：大于，L：小于，E：等于
                            sectionNo: '',            //款号  string
                            startDate: '',           //销量起始日期   string  格式：yyyy-mm-dd
                            userId: '',
                            className:[],            //品类
                            season:'',               //季节
                            returnRate:0,            //销退率
                            cancelCodes:'',
                },
                cancelCodes:'',
                selectArray:[],
                quick_search: '',
                brandList:[],
                saleDayTypeList: [
                    {
                        label: '>',
                        value: 'G'
                    },
                    {
                        label: '=',
                        value: 'E'
                    },
                    {
                        label: '<',
                        value: 'L'
                    }
                ],
                ruleValidate:{
                    brandId: [
                        { required: true, message: '请选择品牌', trigger: 'change' }
                    ],
                },
                tempList: [],
                pageSize: 10,
                page: 1,
                total: 0,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6 - 1000 * 60 * 60 * 24
                    }
                },
                spinShow: false,
                class_name_list:[],
                temp_class_name_list:[],
                season_list:[
                    {value:'春季'},
                    {value:'夏季'},
                    {value:'秋季'},
                    {value:'冬季'}
                ],
                returnRate_disabled:true,
                userInfo:{}
            }
        },
        computed: {
            ...mapState({
                // brandList:state => state.quickRepeatOrder.brands_by_userId,
                update_columns_list:state => state.common._columns
            })
        },
        watch: {
            quick_search(newVal, oldVal) {
                let date = new Date();
                this.formSearch.endDate = Util.dateFormat(new Date(date.getTime() - 1000 * 60 * 60 * 24), 'yyyy-MM-dd');
                switch (newVal) {
                    case 'threeDay':
                        this.formSearch.startDate = Util.cutDate(new Date(), 3);
                        break;
                    case 'sevenDay':
                        this.formSearch.startDate = Util.cutDate(new Date(), 7);
                        break;
                    case 'fifteenDay':
                        this.formSearch.startDate = Util.cutDate(new Date(), 15);
                        break;
                    case 'oneMonth':
                        this.formSearch.startDate = Util.cutDate(new Date(), 30);
                        break;
                    case 'threeMonth':
                        this.formSearch.startDate = Util.cutDate(new Date(), 90);
                        break;
                    case 'history':
                        this.formSearch.startDate = '';
                        this.formSearch.endDate = '';
                    default:
                        break;
                }
            },
        //     update_columns_list: {
        // 　　　　handler(newValue, oldValue) {
        // 　　　　　　this.columns = newValue;
        // 　　　　},
        // 　　　　deep: true
        // 　　}
        },
        mounted() {
            this.request('eom_reorder_get_update_time',{},false).then(res=>{
                 this.updateTime=res.data
            })          
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            this.getBrandLists()   
            this.quick_search = 'fifteenDay';
            // this.$store.dispatch('get_brands_by_userId', {data: {userId: JSON.parse(window.sessionStorage.getItem('userinfo')).userId}});
            this.get_class_name();
            // this._columns = Util.deepClone(this.columns);
            //             console.log(this._columns)          
            
        },
        activated() {
            // var that = this;  
            // this.$store.dispatch('save_temp_columns',this._columns);
            
            // this.$nextTick(()=>{
            //     this.$store.dispatch('get_table_custom_list',{
            //     tableName:'返单预警',
            //     columns:this.columns
            // }).then((data)=>{
            //         this.columns = data;
            //         let thead = document.getElementsByTagName('thead');
            //         let ref = that.$refs['right_click_menu'];
            //         customTable.openModel({thead:thead,ref:ref,columns:this._columns,tableName:'返单预警',data_view_direction:'down'})
            //     })
            // })
        },
        methods: {
            showDrawer(){
                this.drawerVisible=true
             },
             handleEdit(row){
                      console.log(row,'99999999')
                      // this.formSearch.cancelCodes=row.sectionNo
                      // let index = this.formSearch.cancelCodes.indexOf(row.sectionNo);
                      const {sectionNo}=row
                      // this.cancelCodes=row.sectionNo
                     this.clickOK(sectionNo)                        
            },
            clickOK(sectionNo){
                 this.$Modal.confirm({
                                                title: '提示',
                                                content: '该行将会取消预警，请确认！',
                                                onOk: () => {
                                                    // if(index == -1){
                                                    //     // this.formSearch.cancelCodes += row.commodityCode + ',' ;
                                                    //      // row.sectionNo?:''
                                                        this.formSearch.cancelCodes=sectionNo
                                                        this.selectArray.push(this.formSearch.cancelCodes)
                                                    // }
                                                    // setTimeout(()=>{
                                                        this.quxiao()
                                                     // this.getData('search');   
                                                 // },100)
                                                        
                                                },
                                                onCancel: () => {
                                                        this.$Message.warning('已取消操作!');
                                                }
            })  
            },
            fandan(row){
                              let data = {
                                                type:'add_bylink',
                                                brandId:this.formSearch.brandId,
                                                season:row.season,
                                                color:row.color,
                                                sectionNo:row.sectionNo,
                                                className:!!row.className?row.className:''
                                            };
                                            // window.sessionStorage.setItem('quickrepeatorder',JSON.stringify(data));                                            
                                            this.$router.push({name:'quickrepeatorder_add',params:data});
            },
            tableRowClassName({row, rowIndex}) {
                // console.log(row)
                if(row.children){
                    for(let i=0,len=row.children.length;i<len;i++){
                        if(row.children[i].status==2){
                             return 'warning-row';  
                        }else if(row.children[i].status==1) {
                              return 'success-row';
                        }
                         return '';
                    }
                }
                // if (row.status== 2) {
                //   return 'warning-row';
                //  } else if (row.status == 1) {
                //   return 'success-row';
                // }
                // return '';
             },
            get_class_name(){
                this.request('eom_reorder_get_class_name').then(res=>{
                    if(res.code == 1){
                        // let L1 = [];
                        // var obj = {};
                        // L1 = res.data.reduce((cur,next) => {
                        //     obj[next.L1] ? "" : obj[next.L1] = true && cur.push({label:next.L1,id:next.L1});
                        //     return cur;
                        // },[])

                        // L1.map(x=>{
                        //     let L2 = [];                            
                        //     res.data.map(y=>{
                        //         if(x.label == y.L1) L2.push(y.L2);
                        //     })
                        //     L2 = [...new Set(L2)];
                        //     x.children = [];
                        //     L2.map(z=>{
                        //         let L3 = [];
                        //         res.data.map(k=>{
                        //             if(z == k.L2) L3.push(k.L3);
                        //         })
                        //         L3 = [...new Set(L3)];
                                
                        //         let data = {label:z,id:z,children:[]};
                        //         L3.map(n=>{
                        //             data.children.push({label:n,id:n})
                        //         })
                        //         x.children.push(data)
                        //     })
                        // })
                        // this.temp_class_name_list = Util.deepClone(res.data);
                        this.class_name_list = res.data;
                        // this.class_name_list = L1;
                    }
                })
            },
            getBrandLists(){
                        let data={}
                            data.userCode=this.userInfo.userAccount
                       this.request('eom_brandPermissions_getBrandListByUserCode',{data},false).then(res=>{
                               if(res.code==1){
                                  this.brandList=res.data
                               }else{
                                  console.log('9999')
                               }
                       })
            },
            Change_sectionNo(val){
                this.returnRate_disabled = !!this.formSearch.sectionNo ? false : true;
            },
            quxiao(){
                      console.log(this.Tablelist,'1234567865432345')
                      for(let i=0,len=this.Tablelist.length;i<len;i++){
                                        if(this.Tablelist[i].sectionNo==this.formSearch.cancelCodes){
                                            this.Tablelist.splice(i,1)
                                            this.total--;
                                        }
                                     }
                // data.cancelCodes=this.formSearch.cancelCodes
                // this.spinShow = true;
                      // data.sectionNo =this.formSearch.sectionNo
                      // this.request('get_reorder_goods', {data},false).then(res => {
                      //            if(res.code==1){
                      //                // this.getData()
                                     
                      //                // console.log(res,'876545678')
                      //            }      
                      // })

            },
            getData(type) {
                
                let data ={};
                //先判断是否选择品牌
                if (!this.formSearch.brandId) {
                    this.$Message.warning('请先选择需要查询的品牌');
                    return;
                }
                data.brandId=this.formSearch.brandId;
                // this.loadingmask=true
                data.className =this.formSearch.className;
                // if(this.formSearch.className.length > 0){
                //     this.formSearch.className.map(x=>{
                //         this.temp_class_name_list.map(y=>{
                //             if(y.L1 == x){
                //                 data.className.push(y.L3);
                //             }
                //             if(y.L2 == x){
                //                 data.className.push(y.L3);
                //             }
                //             if(y.L3 == x){
                //                 data.className.push(y.L3);
                //             }
                //         })
                //     })
                // }
                data.userId = JSON.parse(window.sessionStorage.getItem('userinfo')).userId;
                if (this.formSearch.saleDayType && !this.formSearch.saleDay) {
                    this.$Message.warning('请输入可销售天数!');
                    return false
                }
                if (!this.formSearch.saleDayType && this.formSearch.saleDay) {
                    this.$Message.warning('请选择可销售天数计算类型!');
                    return false
                }
                data.saleDayType=this.formSearch.saleDayType
                data.saleDay=this.formSearch.saleDay
                if (!!this.formSearch.startDate) {
                    data.startDate = Util.dateFormat(this.formSearch.startDate, 'yyyy-MM-dd');
                }
                if (!!this.formSearch.endDate) {
                    data.endDate = Util.dateFormat(this.formSearch.endDate, 'yyyy-MM-dd');
                }
                data.length = this.pageSize;
                data.start = (this.page - 1) * this.pageSize;
                // data.cancelCodes = !!data.cancelCodes ? data.cancelCodes.substr(0,data.cancelCodes.length - 1) : data.cancelCodes;
                this.formSearch.cancelCodes? data.cancelCodes=this.selectArray:delete data.cancelCodes
                // data.cancelCodes=this.formSearch.cancelCodes
                // this.spinShow = true;
                data.sectionNo =this.formSearch.sectionNo
                data.season=this.formSearch.season
                let url = '';
                if(type == 'search'){
                    url = 'get_reorder_goods'
                }else{
                    url = 'exportReOrderExcel'
                };
                // this.$nextTick(() => {
                this.request('get_reorder_goods', {data}, true).then(res => {
                    if (res.code == 1) {
                            this.Tablelist=[]
                            if(!!res.data.data&&res.data.data.length>0){
                            for(let i=0,len=res.data.data.length;i<len;i++){
                                    res.data.data[i].tag=true;
                                 if(!!res.data.data[i].children&&res.data.data[i].children.length>0){
                                    for(let j=0,leng=res.data.data[i].children.length;j<leng;j++){
                                      res.data.data[i].children[j].tag=false; 
                                         // 新增判断是延期预警还是缺货预警
                                         if(res.data.data[i].warning){
                                                    let lastDate = Math.floor(( new Date(res.data.data[i].children[j].lastDate).getTime() - new Date().getTime()) / (1000*60*60*24));  
                                                    let productionCycle = Math.floor((new Date(res.data.data[i].children[j].productionCycle).getTime() - new Date().getTime()) / (1000*60*60*24));
                                                    if(res.data.data[i].children[j].lastDate){
                                                        if(lastDate < 0 || lastDate > res.data.data[i].children[j].saleDays){
                                                         res.data.data[i].children[j].status = 1;//延期预
                                                        continue;
                                                     }
                                                    }
                                                    if(productionCycle < 0 || productionCycle > res.data.data[i].children[j].saleDays){
                                                         res.data.data[i].children[j].status = 2;//缺货预警
                                                    }
                                           }
                                          // 新增判断是延期预警还是缺货预警  
                                    } 
                                 }  
                            }
                            }
                            setTimeout(()=>{
                                    this.total = res.data.total;
                                    this.Tablelist = res.data.data;
                            },100)
                            
                            // let lastTotal = Math.ceil(this.total / this.pageSize);
                            // if(this.page == lastTotal){
                            //     this.list.push({
                            //         serialNo:'合计',
                            //         tmfifteenSales:res.data.fifteenTMSum,
                            //         vipfifteenSales:res.data.fifteenVIPSum,
                            //         stockNum:res.data.instockSum,
                            //         stockOnwayNum:res.data.onwaySum,
                            //         tmsevenSales:res.data.sevenTMSum,
                            //         vipsevenSales:res.data.sevenVIPSum,
                            //         stockSum:res.data.stockSum
                            //     })
                            // }
                        }else{
                              this.Tablelist =[]
                               this.total=0
                            //    this.$Message.error(res.msg)
                            // this.spinShow = false;
                            // this.loadingmask=false
                        }

                    })
                // })
            },
            search() {
                this.page = 1;
                this.getData('search');
            },
            handleReset() {
                this.formSearch = formSearch();
                let date = new Date();
                this.formSearch.startDate = Util.cutDate(new Date(), 15);
                this.formSearch.endDate = Util.dateFormat(new Date(date.getTime() - 1000 * 60 * 60 * 24), 'yyyy-MM-dd');
                this.quick_search = 'fifteenDay';
                this.returnRate_disabled = true;
            },
            changeDate(val) {
                this.quick_search = '';
            },
            changeRadio(val) {
                this.quick_search = val;
                this.$nextTick(() => {
                    this.search();
                })
            },
            CurrentChange(val) {
                console.log(val,'12')
                 this.page = val;
                this.getData('search');
            },
             sizeChange(val) {
                this.pageSize = val;
                this.getData('search');
            },
            getBrandList() {
                this.request('GetBrandList', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    data: {}
                }, false).then((res) => {
                    this.brandList = res.data;
                })
            },
            showInfo(){
               this.$Modal.confirm({
                    title: '导出提示',
                    content: '当前数据量过大，需要加搜索条件，请确认是否要导出当前全部数据？',
                    loading: true,
                    onOk: () => {
                        this.export_data()
                        this.$Modal.remove()
                    }
                });   
            },

            excuteExport(){
                  if (!this.formSearch.brandId) {
                    this.$Message.warning('请先选择需要查询的品牌');
                    return;
                  }
                  if(this.formSearch.className.length>0||this.formSearch.sectionNo||this.formSearch.season||(this.formSearch.saleDayType&&this.formSearch.saleDay)){
                       this.export_data()   
                  }else{
                        this.showInfo()
                    
                  }
            },
            export_data(){
                let data = Util.deepClone(this.formSearch);
                //先判断是否选择品牌
                if (!data.brandId) {
                    this.$Message.warning('请先选择需要查询的品牌');
                    return;
                }
                data.userId = JSON.parse(window.sessionStorage.getItem('userinfo')).userId;
               if (this.formSearch.saleDayType && !this.formSearch.saleDay) {
                    this.$Message.warning('请输入可销售天数!');
                    return false
                }
                if (!this.formSearch.saleDayType && this.formSearch.saleDay) {
                    this.$Message.warning('请选择可销售天数计算类型!');
                    return false
                }
                if (!!this.formSearch.startDate) {
                    data.startDate = Util.dateFormat(this.formSearch.startDate, 'yyyy-MM-dd');
                }
                if (!!this.formSearch.endDate) {
                    data.endDate = Util.dateFormat(this.formSearch.endDate, 'yyyy-MM-dd');
                }
                var formData=new FormData();
                for(var key in data){
                    formData[key] = data[key];
                }
                let form = document.createElement('form');
                form.action = `/eop/eom/reorder/exportReOrderExcel?data=${encodeURIComponent(JSON.stringify(formData))}`;
                form.method = 'post';
                this.$Spin.show();

                axios.get(`/eop/eom/reorder/exportReOrderExcel?data=${encodeURIComponent(JSON.stringify(formData))}`,{

                },true).then(res=>{
                    if(res.status == 200 && !!res.data ){
                        window.open( `/eop/eom/reorder/exportReOrderExcel?data=${encodeURIComponent(JSON.stringify(formData))}`);
                        this.$Spin.hide();
                    }else{
                        this.$Message.warning('无数据可导出！');
                        this.$Spin.hide();
                    }
                    // const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
                    // const downloadElement = document.createElement('a');
                    // const href = window.URL.createObjectURL(blob);
                    // console.log(blob,href);
                    // downloadElement.href = href;
                    // downloadElement.download = 'rate.xlsx';
                    // document.body.appendChild(downloadElement);
                    // downloadElement.click();
                    // document.body.removeChild(downloadElement); // 下载完成移除元素
                    // window.URL.revokeObjectURL(href); // 释放掉blob对象
                })
            },
        }
    }
</script>
