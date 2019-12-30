<style lang="less">
  #inventory_error_list .ivu-page{
    margin-top: 10px;
  }
</style>

<template>
  <div class="background-color-white exhibition" id="inventory_error_list">
    <Row class="margin-bottom-10">
      <Col span="24" class="search">
      <Form :model="formSearch" ref="formSearch" :label-width="90" inline label-position="right">
        <Form-item label="起始日期：">
          <DatePicker type="date" v-model="formSearch.start_date" format="yyyy-MM-dd" placeholder="选择开始日期"
                      style="width: 150px"></DatePicker>
        </Form-item>
        <Form-item label="结束日期：">
          <DatePicker type="date" v-model="formSearch.end_date" format="yyyy-MM-dd" placeholder="选择开始日期"
                      style="width: 150px"></DatePicker>
        </Form-item>
        <Form-item label="仓库：" :label-width="50">
          <Select v-model="formSearch.warehouse_code" @on-change="changeWarehouse" style="width:150px">
            <Option v-for="item in formSearch_warehouse" :value="item.warehouse_code" :key="item.warehouse_code">{{
              item.warehouse_name }}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="品牌：" :label-width="50">
          <Select v-model="formSearch.brands" multiple style="width:150px">
            <Option v-for="item in BrandList" :value="item.brands" :key="item.brands">{{ item.brands }}</Option>
          </Select>
        </Form-item>
        <Form-item :label-width="1">
          <Button type="primary" @click="search(formSearch)" icon="ios-search">搜索</Button>
          <Button type="default" @click="handleReset(formSearch)">重置</Button>
        </Form-item>
      </Form>
      </Col>
      <Col span="24">
        <Button type="primary" @click="downTempalte">下载模板</Button>
        <Button type="primary" @click="open_dialog_import">批量导入</Button>
        <Button type="primary" @click="export_inventoryError_excel">导出</Button>
      </Col>
    </Row>
    <Row class="margin-top-10">
      <Tabs type="card" @on-click="tabClick" :value="activeTable">
        <TabPane label="仓库" name="warehouse">
          <Alert >
            <span class="margin-right-40">库位抽盘数:{{!TableData.warehouse_count ? 0 : TableData.warehouse_count.check_sum}}</span>
            <span class="margin-right-40">库位差异数:{{!TableData.warehouse_count ? 0 : TableData.warehouse_count.error_sum}}</span>
            <span class="margin-right-40" style="color: red">出错率:{{!TableData.warehouse_count ? '--%' : TableData.warehouse_count.error_rate}}</span>
          </Alert>
          <Table :columns="Warehouse_columns" :data="TableData.data_warehouse"></Table>
          <Page :total="Warehousetotal" :page-size="WarehousepageSize" :current="Warehousepage"  show-sizer show-total show-elevator @on-change="WarehouseCurrentChange" @on-page-size-change="WarehouseSizeChange"></Page>
        </TabPane>
        <TabPane label="品牌" name="brand">
          <Row>
            <Col>
              <Alert >
                <span class="margin-right-40">库存抽盘数:{{!TableData.brands_count ? 0 : TableData.brands_count.check_sum}}</span>
                <span class="margin-right-40">库存差异数:{{!TableData.brands_count ? 0 : TableData.brands_count.error_sum}}</span>
                <span class="margin-right-40" style="color: red">出错率:{{!TableData.brands_count ? '--%' : TableData.brands_count.error_rate}}</span>
              </Alert>
            </Col>
            <Col class="margin-bottom-10">
              <Table :columns="Brand_columns" size="small" :data="TableData.data_brands"></Table>
            </Col>
            <Col >
              <Page :total="Brandstotal" :page-size="BrandspageSize" :current="Brandspage"  show-sizer show-total show-elevator @on-change="BrandsCurrentChange" @on-page-size-change="BrandsSizeChange"></Page>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Row>

    <Modal v-model="dialog_import_Visible" :mask-closable="false" title="批量导入" :width="750" class-name="customize-modal-center">
      <Row>
        <Upload
          ref="upload"
          :show-upload-list="true"
          :default-file-list="defaultList"
          type="drag"
          action="/eop/kpi/lst/importExcelInventoryError"
          :multiple="false"
          :before-upload="handleUpload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :auto-upload='false'
          :data="{account:userInfo.userAccount}"
        >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或将文件拖拽到此处</p>
          </div>
        </Upload>
      </Row>
      <div slot="footer">
        <Button type="primary" @click="uploadExcel()">上传</Button>
        <Button type="default"  @click="dialog_import_Visible = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import Util from 'libs/util'
  import base from 'libs/base'
  import Vue from 'vue'
  import http from 'libs/axios'
  var check_by = Vue.extend({
    props:['params'],
    template:`
      <Tooltip placement="right">
        <div style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width:100px;">{{params.row.check_by}}</div>
        <div slot="content" style="white-space: normal">
            <span>{{params.row.check_by}}</span>
        </div>
    </Tooltip>
    `
  })


  function formSearch() {
    return {
      brands: [],
      end_date: '',
      start_date: '',
      warehouse_code: ''
    }
  }

  export default {
    name: "inventory_error_list",
    data() {
      return {
        formSearch: formSearch(),
        formSearch_warehouse: [],
        dialog_import_Visible:false,     //导入弹窗开关
        activeTable:'',                   //tab页面  当前活动页名
        warehouse: [],
        BrandList: [],                        //根据仓库编码查询下属品牌列表
        TableData:{},                       //表格下的总数据
        Warehouse_columns:[
          {
            title: '序号',
            key:'serialNo',
            align:'center',
            width: 100
          },
          {
            title: '仓库',
            key: 'warehouse_code',
            align:'center',
            width: 150,
            render:(h,params)=>{
              return h('span',params.row.warehouse_code == 'XSYLC' ? '宇隆仓' : '瓜沥仓')
            }
          },
          {
            title: '库位抽盘数',
            key:'check_number',
            align:'center',
            width: 150
          },
          {
            title: '库位差异数',
            key:'error_number',
            align:'center',
            width: 150
          },
          {
            title: '库位出错率',
            key:'error_rate',
            align:'center',
            width: 150
          },
          {
            title: '盘点人',
            key:'check_by',
            align:'center',
            render:(h,params)=>{
              return h(check_by,{
                props:{
                  params:params,
                }
              })
            }
          },
          {
            title: '盘点日期',
            key:'check_date',
            align:'center',
            width: 150
          }
        ],
        Brand_columns:[
          {
            title: '序号',
            key:'serialNo',
            align:'center',
            width: 100
          },
          {
            title: '品牌',
            key: 'brands',
            align:'center',
            width: 150
          },
          {
            title: '库位抽盘数',
            key:'check_number',
            align:'center',
            width: 150
          },
          {
            title: '库位差异数',
            key:'error_number',
            align:'center',
            width: 150
          },
          {
            title: '库位出错率',
            key:'error_rate',
            align:'center',
            width: 150
          },
          {
            title: '盘点人',
            key:'check_by',
            align:'center',
            render:(h,params)=>{
              return h(check_by,{
                props:{
                  params:params,
                }
              })
            }
          },
          {
            title: '盘点日期',
            key:'check_date',
            align:'center',
            width: 150
          }
        ],
        BrandspageSize: 10,
        Brandspage: 1,
        Brandstotal: 0,
        WarehousepageSize: 10,
        Warehousepage: 1,
        Warehousetotal: 0,
        defaultList:[],
        userInfo:{}
      }
    },
    mounted() {
      this.formSearch_warehouse = base.formSearch_warehouse;
      this.userInfo=JSON.parse(window.sessionStorage.getItem('userinfo'));
      this.warehouse = base.warehouse;
      this.changeWarehouse('');
      let data = this.formSearch;
      data.start_date = Util.dateFormat(new Date(), 'yyyy-MM') + '-01';
      data.end_date = Util.dateFormat(new Date(), 'yyyy-MM-dd');
    },
    activated(){
      this.search(this.formSearch);
    },
    methods: {
      changeWarehouse(val) {
        this.request('getbrands_bywarehouse', {
          ver: '1',
          ts: Date.parse(new Date()),
          sign: '',
          methods: 'getbrands_bywarehouse',
          data: {
            warehouse_code: val
          }
        }, true).then(res => {
          if (res.code == 1) {
            this.BrandList = res.data;
          } else {
            this.$Message.warning(res.msg);
          }
        })
      },
      search(data){
        var data = JSON.parse(JSON.stringify(data))
        if(this.activeTable == 'warehouse'){
          data = Object.assign(data, {
            length: 10,
            start: 0,
            type: 'warehouse'
          })
          this.inventory_error_list(data)
        }else{
          data = Object.assign(data, {
            length: 10,
            start: 0,
            type: 'brands'
          })
          this.inventory_error_list(data)
        }
      },
      tabClick(name){
        this.activeTable = name;
        var data = JSON.parse(JSON.stringify(this.formSearch));
        if(name == 'warehouse'){
          data = Object.assign(data, {
            length: this.WarehousepageSize,
            start: this.WarehousepageSize * (this.Warehousepage - 1),
            type: 'warehouse'
          })
          this.inventory_error_list(data)
        }else{
          data = Object.assign(data, {
            length: this.BrandspageSize,
            start: this.BrandspageSize * (this.Brandspage - 1),
            type: 'brands'
          })
          this.inventory_error_list(data)
        }
      },
      inventory_error_list(data) {
        var data = JSON.parse(JSON.stringify(data))
        data.start_date = Util.dateFormat(data.start_date, 'yyyy-MM-dd');
        data.end_date = Util.dateFormat(data.end_date, 'yyyy-MM-dd');
        if(!this.activeTable){
          data = Object.assign(data, {
            length: 10,
            start: 0,
            type: ''
          })
        }

        this.request('inventory_error_list', {
          ver: '1',
          ts: Date.parse(new Date()),
          sign: '',
          methods: 'inventory_error_list',
          data: data
        }, true).then(res => {
          if(res.code == 1){
            this.TableData = res.data;
            this.Brandstotal = res.data.brands_count.counts
            this.Warehousetotal = res.data.warehouse_count.counts

            if(!!this.TableData.data_brands){
              let serialNoBegain_brand = this.BrandspageSize*(this.Brandspage-1);
              this.TableData.data_brands.forEach((item)=>{
                serialNoBegain_brand++;
                item.serialNo = serialNoBegain_brand;
              })
            }
            if(!!this.TableData.data_warehouse) {
              let serialNoBegain_warehouse = this.WarehousepageSize*(this.Warehousepage-1);
              this.TableData.data_warehouse.forEach((item)=>{
                serialNoBegain_warehouse++;
                item.serialNo = serialNoBegain_warehouse;
              })
            }
          }else{
            this.$Message.warning(res.msg);
          }
        })
      },
      handleReset() {
        this.formSearch = formSearch();
        this.formSearch.start_date = Util.dateFormat(new Date(), 'yyyy-MM') + '-01';
        this.formSearch.end_date = Util.dateFormat(new Date(), 'yyyy-MM-dd');
        this.search(this.formSearch);
      },
      downTempalte(){
        window.location = ('/excel/库位出错导入.xlsx')
      },
      open_dialog_import(){
        this.dialog_import_Visible = true;
        this.defaultList = [];
      },
      handleUpload(file){
        if (!/\.xls$|.xlsx$/.test(file.name)) {
          this.$Message.warning('文件类型不符,请重新选择文件');
          return false
        }
        if (this.defaultList.length >= 1) {
          this.$Modal.confirm({
            title: '提示',
            content: '选中文件是否替换',
            onOk:() => {
              this.defaultList.splice(0,1,file);
            },
            onCancel: () => {
              this.$Message.warning('已取消替换');
            }
          })
        }else{
          this.defaultList.push(file);
        }
        return false
      },
      uploadSuccess(res, file) {              //上传成功后触发
        if (res.code == 1) {
          this.$Message.success(res.msg);
          this.search(this.formSearch)
          this.dialog_import_Visible = false;
        } else {
          this.$Message.warning(res.msg);
        }
        this.dataInitialize();
      },
      uploadError(res, file) {               //上传失败后触发
        this.$Message.error(res.msg);
        this.dataInitialize();
      },
      dataInitialize() {                       //请求上传接口后清空文件和文件列表
        this.file = {};
        this.fileList = []
      },
      uploadExcel() {
        this.$refs.upload.post(this.defaultList[0]);
      },
      export_inventoryError_excel(){
        let start_date = Util.dateFormat(this.formSearch.start_date, 'yyyy-MM-dd');
        let end_date = Util.dateFormat(this.formSearch.end_date, 'yyyy-MM-dd');
        window.location = `${window.location.origin}/eop/kpi/lst/export_inventoryError_excel?start_date=${start_date}&end_date=${end_date}&username=${this.userInfo.userName}`
        //
        // http.get('/eop/kpi/lst/export_inventoryError_excel',{
        //   params:{
        //     start_date: start_date,
        //     end_date: end_date,
        //     username: this.userInfo.userName
        //   }
        // }).then(res => {
        //
        // }).catch(err=>{
        //   if (!err.data) {
        //   } else {
        //     this.$Message.error(err.data.msg);
        //   }
        // })
      },
      WarehouseSizeChange(val) {
        this.WarehousepageSize = val;
        var data = JSON.parse(JSON.stringify(this.formSearch));
        data = Object.assign(data, {
          length: this.WarehousepageSize,
          start: this.WarehousepageSize * (this.Warehousepage - 1),
          type: 'warehouse'
        })
        this.inventory_error_list(data)
      },
      WarehouseCurrentChange(val) {
        this.Warehousepage = val;
        var data = JSON.parse(JSON.stringify(this.formSearch));
        data = Object.assign(data, {
          length: this.WarehousepageSize,
          start: this.WarehousepageSize * (this.Warehousepage - 1),
          type: 'warehouse'
        })
        this.inventory_error_list(data)
      },
      BrandsSizeChange(val) {
        this.BrandspageSize = val;
        var data = JSON.parse(JSON.stringify(this.formSearch));
        data = Object.assign(data, {
          length: this.BrandspageSize,
          start: this.BrandspageSize * (this.Brandspage - 1),
          type: 'brands'
        })
        this.inventory_error_list(data)
      },
      BrandsCurrentChange(val) {
        this.Brandspage = val;
        var data = JSON.parse(JSON.stringify(this.formSearch));
        data = Object.assign(data, {
          length: this.BrandspageSize,
          start: this.BrandspageSize * (this.Brandspage - 1),
          type: 'brands'
        })
        this.inventory_error_list(data)
      },
    }
  }
</script>
