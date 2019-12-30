<style lang="less">

</style>

<template>
<div class="background-color-white exhibition">
    <Row>
        <Form :model="formSearch" :label-width="100" inline label-position="right">

            <Form-item label="创建时间:">
                <DatePicker type="daterange" v-model="formSearch.created" :options="pickerOptions" split-panels
                    placeholder="请选择操作时间" size="small" style="width: 200px"></DatePicker>
            </Form-item>
            <Form-item label="品牌：" :label-width='50'>
                <Select v-model="formSearch.brandId" size="small" style="width:180px">
                    <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                    </Option>
                </Select>
            </Form-item>
            <Form-item :label-width="1">
                <Button type="primary" size="small" @click="search" icon="ios-search">查询</Button>
                <!-- <Button type="primary" size="small" @click="exportData">导出</Button> -->
                <Button type="primary" size="small" @click="handleReset">重置</Button>
            </Form-item>
        </Form>
    </Row>
    <Row>
        <Col span="24">
        <div style="overflow:auto;padding:10px 0 10px 0">
            <Table size="small" :columns="columns" :data="list" border highlight-row></Table>
        </div>
        </Col>
    </Row>
</div>
</template>

<script>
  import Util from 'libs/util'

  function formSearch() {
      return {
          created: [new Date(), new Date()],
          userName: ''
      }
  }

  export default {
      desc: '唯品会物流费用汇总',
      name: "across_logistics_summary",
      data() {
          return {
              brandList: [],
              formSearch: formSearch(),
              list: [],
              columns: [{
                      title: '序号',
                      key: 'serialNo',
                      align: 'center',
                      width: 80
                  },
                  {
                      title: '品牌',
                      key: 'brand_name',
                      align: 'center',
                      width: 180,
                  },
                  {
                      title: '箱数',
                      key: 'box_number',
                      align: 'center',
                      width: 180,
                  },
                  {
                      title: '重量/kg',
                      key: 'weight',
                      align: 'center',
                      width: 180,
                  },
                  {
                      title: '运费/元',
                      key: 'freight',
                      align: 'center',
                      width: 180,
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
                      id: 0,
                      brands: '所有品牌'
                  })
                  this.brandList = this.brandList.filter(x => {
                      return x.id != '51594' && x.id != '51609'
                  })
              })
          },
          getData() {
              let data = Util.deepClone(this.formSearch);
              for (let [x, y] of data.created.entries()) {
                  if (!!y) {
                      data.created[x] = Util.dateFormat(y, 'yyyy-MM-dd')
                  }
              }
              this.list = [];
              this.request('get_across_logistics_summary_data', data, true).then(res => {
                  if (res.errno == '0') {
                      let serialNoBegain = 0
                      let freightTotal=0
                      let weightTotal =0
                      let box_numberTotal=0
                      res.data.map(x => {
                          serialNoBegain++;
                          x.serialNo = serialNoBegain;
                          freightTotal+=Number(x.freight)
                          weightTotal+=Number(x.weight)
                          box_numberTotal+=Number(x.box_number)
                      })
                      res.data.push({
                          serialNo:'合计',
                          freight:Number(freightTotal).toFixed(2),
                          weight:Number(weightTotal).toFixed(2),
                          box_number:Number(box_numberTotal)
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
          exportData() {
              let data = Util.deepClone(this.formSearch);
              this.request('export_across_logistics_report_data', data, true).then(res => {
                  if (res.errno == '0') {
                      this.$Message.success('导出成功');
                      if (document.location.href.indexOf('localhost') > 0 || document.location.href.indexOf('127.0.0.1') > 0) {
                          window.open('http://127.0.0.1:8360' + res.data)
                      } else {
                          window.open(res.data)
                      }
                  }
              })
          },
      },
      activated() {

      },
      mounted() {
          this.getBrandList()
          this.getData();
      }
  };
</script>
