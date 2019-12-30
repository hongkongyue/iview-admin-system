<style lang="less">

</style>

<template>
  <div class="background-color-white exhibition">
    <Row class="margin-bottom-10">
      <Col span="24" class="search">
      <Form :model="formSearch" :label-width="100" inline label-position="right">
        <Row>
        <Form-item label="日期:" :label-width="70">
          <DatePicker type="date" v-model="formSearch.dateTime" 
                      placeholder="请选择下单时间" style="width: 150px"></DatePicker>
        </Form-item>
        <!-- <Form-item label="支付时间:">
          <DatePicker type="daterange" v-model="formSearch.gmt_payment" :options="pickerOptions" split-panels
                      placeholder="请选择支付时间" style="width: 200px"></DatePicker>
        </Form-item> -->
        <Form-item  label="商品货号:">
          <Input style="width:150px" v-model="formSearch.sn" placeholder="请输入商品货号"></Input>
        </Form-item>
         <Form-item label="条形码:">
          <Input v-model="formSearch.barcode" placeholder="请输入商品条形码"></Input>
        </Form-item>
        </Row>
         <Row>
         <Form-item label="品牌名称:">
          <Input style="width:200px;" v-model="formSearch.brandName" placeholder="请输入品牌名称"></Input>
        </Form-item>
          <Form-item label="常态合作编码:">
          <Select style="width:180px" v-model="formSearch.shopCode" placeholder="请选择">
            <Option v-for="item in shopList" :value="item.shopCode" :key="item.shopCode">{{ item.shopName}}
            </Option>
          </Select>
        </Form-item>
        <Form-item :label-width="1">
          <Button type="primary" @click="search" icon="ios-search">查询</Button>
          <Button type="primary" @click="updateConfig" >设置</Button>
          <Button type="primary" @click="syncVipStockData" >同步</Button>
          <Button type="default" @click="handleReset">重置</Button>
        </Form-item>
         </Row>
      </Form>
      </Col>
      <Col span="24">
      <Table size="small" :columns="columns" :data="list" border highlight-row></Table>
      </Col>
    </Row>
    <Row>
      <Page :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator
            @on-change="changePage" @on-page-size-change="changePageSize"></Page>
    </Row>
     <Modal v-model="configModalVisible" title="设置唯品会登录信息" @on-cancel='cancel' :width="750" class-name="customize-modal-center">
        <Form ref="submitForm" :model="submit_data" :label-width="80" :rules="rules">
            <Row>
            

                </Col>
                <Col span='16'>
                <Form-item label="eptison:">
                    　　<Input placeholder="vc-token" type="textarea" :rows="4"   v-model="submit_data.eptison_vc_token"></Input>
                      　<Input placeholder="visadminvipvipcom"  v-model="submit_data.eptison_visadminvipvipcom"></Input>
                </Form-item>
                </Col>
            </Row>
            <Row>
                  <Col span='16'>
                <Form-item label="leke:">
                    　　<Input placeholder="vc-token" type="textarea" :rows="4"  v-model="submit_data.leke_vc_token"></Input>
                      　<Input placeholder="visadminvipvipcom"  v-model="submit_data.leke_visadminvipvipcom"></Input>
                </Form-item>
                </Col>
            </Row>
        </Form>
        <div slot="footer">
            <Button type="default" @click="cancel">取消</Button>
            <Button type="primary" @click="save">保存</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
  import Util from 'libs/util'
  function formSearch() {
    return {
      dateTime:new Date(),
      trade_no: ''
    }
  }

  export default {
    name: "vip_stock",
    data() {
      return {
        formSearch: formSearch(),
        list: [],
        columns: [
          {
            title: '序号',
            key:'serialNo',
            align: 'center',
            width: 80
          },
           {
            title: '日期',
            key: 'date_time',
            align: 'center',
            width: 100,
          },{
              title:'常态合作编码',
              key:'shop_name',
              align:'center',
              width:150
          },
           {
            title: '品牌名称',
            key: 'brand_name',
            align: 'center',
            width: 150,
          },
          {
            title: '商品名称',
            key: 'goods_name',
            align: 'center',
            minWidth: 150
          },
          {
            title: '商品货号',
            key: 'sn',
            align: 'center',
            width: 100
          },
          {
            title: '条形码',
            key: 'barcode',
            align: 'center',
            width: 120
          },
          {
            title: '可售库存',
            key: 'sale_stock_num',
            align: 'center',
            width: 85
          },
          {
            title: '可扣减库存',
            key: 'leaving_stock_num',
            align: 'center',
            width: 100,
          },
          {
            title: '购物车占用',
            key: 'cart_hold_num',
            align: 'center',
            width: 100
          },
          {
            title: '订单处理中',
            key: 'order_process_num',
            align: 'center',
            width: 100
          },
          {
            title: '同步时间',
            key: 'created',
            align: 'center',
            width: 150
          },

        ],
        pageSize:10,
        page:1,
        total:0,
        shopList:[{
            "shopCode": 10736140,
            "shopName": "衣品天成童装全国仓采购协议"
        }, {
            "shopCode": 10736139,
            "shopName": "FSK-全国仓"
        }, {
            "shopCode": 10736138,
            "shopName": "奢步士女-全国仓"
        }, {
            "shopCode": 10736137,
            "shopName": "奢步士男-全国仓"
        }, {
            "shopCode": 10736136,
            "shopName": "n-max-全国仓"
        }, {
            "shopCode": 10736135,
            "shopName": "KOJO-全国仓"
        }, {
            "shopCode": 10736134,
            "shopName": "衣品天成女-全国仓"
        }, {
            "shopCode": 10736133,
            "shopName": "衣品天成男-全国仓"
        }, {
            "shopCode": 10736132,
            "shopName": "LA CRAWFISH采购档期JIT（全国仓）"
        }, {
            "shopCode": 10736131,
            "shopName": "LACHATA采购档期JIT（全国仓）"
        }, {
            "shopCode": 10736130,
            "shopName": "I'M ONE采购档期JIT（全国仓）"
        }, {
            "shopCode": 10736129,
            "shopName": "盛放全国仓采购档期"
        }, {
            "shopCode": 10736128,
            "shopName": "米莱达全国仓采购协议"
        }, {
            "shopCode": 10736123,
            "shopName": "对白-常态合作编码（全国仓）"
        },{
            "shopCode": 60763704,
            "shopName": "leke女-全国仓"
        },{
            "shopCode": 60763703,
            "shopName": "leke男-全国仓"
        }],
        configModalVisible:false,
        submit_data:{}
      };
    },
    computed: {},
    methods: {
      getData() {
        let data = Util.deepClone(this.formSearch);
        data.pageNum = this.page;
        data.pageSize = this.pageSize;

        this.request('get_vip_stock_list_data', data, true).then(res => {
          if (res.errno == 0) {

            let serialNoBegain = this.pageSize * (this.page - 1);
            res.data.data.map(x => {
              serialNoBegain++;
              x.serialNo = serialNoBegain;
            })
            this.total = res.data.count;
            this.list = res.data.data;
          }
        })
      },
      search() {
        this.page = 1;
        this.getData();
      },
      handleReset() {
        this.formSearch = formSearch();
        this.search();
      },
      changePage(page) {
        this.page = page;
        //获取最新数据
        this.getData();
      },
      //分页切换每页记录数
      changePageSize(pageSize) {
        this.pageSize = pageSize;
        //获取最新数据
        this.getData();
      },
      /**
       * 设置vip登录信息
       */
      updateConfig(){
        this.configModalVisible = true
      },
      cancel(){
        this.configModalVisible = false
      },
      syncVipStockData(){

         this.request('sync_vip_stock',{},true).then((res)=>{
                if(res.errno==0){
                     this.$Message.success(res.data)
                }else{
                     this.$Message.warning(res.errmsg)
                }
        })

      },
      save(){
        this.request('update_vip_config',this.submit_data,'正在保存...').then((res)=>{
                if(res.errno==0){
                     this.configModalVisible = false
                     this.$Message.success(res.data)
                }else{
                     this.$Message.warning(res.errmsg)
                }
        })
      }
    },
    activated() {
      this.getData();
    },
  };
</script>
