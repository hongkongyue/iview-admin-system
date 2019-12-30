<style lang="less">

</style>

<template>
<div class="background-color-white exhibition">
  <Row>
    <Form :model="formSearch" :label-width="100" inline label-position="right">
  
        <Form-item label="创建时间:">
          <DatePicker type="daterange" v-model="formSearch.created" :options="pickerOptions" split-panels placeholder="请选择操作时间" size="small" style="width: 200px"></DatePicker>
        </Form-item>
         <Form-item label="品牌：" :label-width='50'>
                        <Select v-model="formSearch.brandId" size="small" style="width:180px">
                            <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                            </Option>
                        </Select>
        </Form-item>
        <Form-item label="EOP录入状态：" :label-width='100'>
                        <Select v-model="formSearch.eopStatus" size="small" style="width:100px">
                            <Option v-for="item in eopStatusList" :value="item.name" :key="item.name">{{ item.name }}
                            </Option>
                        </Select>
        </Form-item>
        <Form-item :label-width="1">
          <Button type="primary" size="small" @click="search" icon="ios-search">查询</Button>
          <Button type="primary" size="small" @click="exportData">导出</Button>
          <Button type="primary" size="small" @click="handleReset">重置</Button>
        </Form-item>
    </Form>
    </Row>
    <Row>
    <Col span="24">
     <div style="overflow:auto;padding:10px 0 10px 0">
    <Table  size="small" :columns="columns" :data="list" border highlight-row></Table>

     </div>
    </Col>
      </Row>
</div>
</template>

<script>
  import Vue from 'vue'
  import Util from 'libs/util'

  function formSearch() {
    return {
      created:[new Date(),new Date()],
      userName:''
    }
  }

    let createdHeader = Vue.extend({
        props: ['params'],
        data() {
            return {
                data: [],
            }
        },
        template: `
        <div>
        　<span>{{data.title}}</span>
          <Tooltip content="旺店通出仓单的创建时间" placement="bottom-start">
           <Icon type="information-circled"></Icon>
          </Tooltip>
        </div>
    `,
        mounted() {
            this.data = this.params.column;
        },
        methods: {
        }
    })

  export default {
    desc:'唯品会物流费用报表',
    name: "across_logistics_report",
    data() {
      return {
        brandList:[],
        eopStatusList:[{
          name:'已录入'
        },
        {
          name:'未录入'
        }],
        formSearch: formSearch(),
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        list: [],
        columns: [
          {
            title: '序号',
            key:'serialNo',
            align: 'center',
            width: 80
          },
           {
            title: '创建时间',
            key: 'created',
            align: 'center',
            width: 180,
            renderHeader: (h, params) => {
                return h(createdHeader, {
                    props: {
                        params: params
                    }
                })
            }
          },
          {
            title: '供应商',
            key: 'supplier_name',
            align: 'center',
            width: 100,
          },
          {
            title: 'OMS运单号',
            key: 'logistics_no',
            align: 'center',
            width: 150
          },
          {
            title: '区域',
            key: 'jit_warehouse_name',
            align: 'center',
            width:130,
          },
          {
            title: '货运方式',
            key: 'delivery_method_name',
            align: 'center',
            width: 120
          },
          {
            title: '品牌',
            key: 'brand_name',
            align: 'center',
            width: 180,
          },
          {
            title: 'EOP录入状态',
            key: 'eop_status',
            align: 'center',
            width: 120,
            render: (h, params) => {
              if(params.row.eop_status=='未录入'){
               return h('span',{
               style:{
                  color:'red'
                }
               },params.row.eop_status)
              }else{
                return h('span',{
                style:{
                  color:'#19be6b'
                }
                },params.row.eop_status)
              }
            }
          },
        ]
      };
    },
    computed: {},
    methods: {
      getBrandList() {
                this.request('bi_brand_list', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    data: {}
                }, false).then((res) => {
                    this.brandList = res.data;
                    this.brandList.unshift({
                        id:0,
                        brands:'所有品牌'
                    })
                    this.brandList = this.brandList.filter(x=>{
                        return x.id != '51594' && x.id != '51609'
                    })
                })
            },
      getData() {
        let data = Util.deepClone(this.formSearch);
        for(let [x,y] of data.created.entries()){
          if(!!y){
            data.created[x] = Util.dateFormat(y, 'yyyy-MM-dd')
          }
        }
        this.list=[];
        this.request('get_across_logistics_report_data', data, true).then(res => {
          if (res.errno == '0') {
            this.$Message.success('查询到'+res.data.length+'条记录');
            let serialNoBegain = 0
            res.data.map(x => {
              serialNoBegain++;
              x.serialNo = serialNoBegain;
            })
            this.list = res.data;
          }
        })
      },
      search() {
        this.getData();
      },
      handleReset() {
        this.formSearch = formSearch();
        this.search();
      },
       exportData(){
                let data = Util.deepClone(this.formSearch);
                this.request('export_across_logistics_report_data',data,true).then(res=>{
                    if(res.errno=='0'){
                        this.$Message.success('导出成功');
                        if(document.location.href.indexOf('localhost')>0||document.location.href.indexOf('127.0.0.1')>0){
                            window.open('http://127.0.0.1:8360'+res.data)
                        }else{
                            window.open(res.data)
                        }
                    }
                })
            },
    },
    activated() {
      
    },
    mounted(){
      this.getBrandList()
      this.getData();
    }
  };
</script>
