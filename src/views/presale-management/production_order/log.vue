<style lang="less">

</style>

<template>
<div class="background-color-white exhibition">
  <Row class="margin-bottom-10">
    <Col span="24" class="search">
    <Form :model="formSearch" :label-width="100" inline label-position="right">
      <Row>
        <Form-item label="操作时间:">
          <DatePicker type="daterange" v-model="formSearch.date_time" :options="pickerOptions" split-panels placeholder="请选择操作时间" style="width: 200px"></DatePicker>
        </Form-item>
           <Form-item  label="操作类型:">
          <Input style="width:150px" v-model="formSearch.table_name" placeholder="请输入操作类型"></Input>
        </Form-item>
          <Form-item  label="生产单号:">
          <Input style="width:150px" v-model="formSearch.order_no" placeholder="请输入生产单号"></Input>
        </Form-item>
           <Form-item  label="操作描述:">
          <Input style="width:250px" v-model="formSearch.operate_desc" placeholder="请输入操作描述进行模糊查询"></Input>
        </Form-item>
        <Form-item :label-width="1">
          <Button type="primary" @click="search" icon="ios-search">查询</Button>
          <Button type="primary" @click="handleReset">重置</Button>
        </Form-item>
      </Row>
    </Form>
    </Col>
    <Col span="24">
    <Table size="small" :columns="columns" :data="list" border highlight-row></Table>
    </Col>
  </Row>
  <Row>
    <Page :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
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
      name: "production_order_log",
      data() {
          return {
              formSearch: formSearch(),
              pickerOptions: {
                  disabledDate(time) {
                      return time.getTime() > Date.now() - 8.64e6
                  }
              },
              list: [],
              columns: [{
                      title: '序号',
                      key: 'serialNo',
                      align: 'center',
                      width: 100
                  },
                  {
                      title: '操作类型',
                      key: 'table_name',
                      align: 'center',
                      width: 200,
                  },
                  {
                      title: '生产单号',
                      key: 'order_no',
                      align: 'center',
                      width: 120,
                  },
                  {
                      title: '操作描述',
                      key: 'operate_desc',
                      align: 'left',
                      minWidth: 300
                  },
                  {
                      title: '操作人',
                      key: 'user_name',
                      align: 'center',
                      width: 150,
                  },
                  {
                      title: '操作时间',
                      key: 'date_time',
                      align: 'center',
                      width: 150
                  },

              ],
              pageSize: 10,
              page: 1,
              total: 0,
          };
      },
      computed: {},
      methods: {
          get_operation_log_list() {
              let data = Util.deepClone(this.formSearch);
              data.pageNum = this.page;
              data.pageSize = this.pageSize;
              if (data.date_time) {


                  for (let [x, y] of data.date_time.entries()) {
                      if (!!y) {
                          data.date_time[x] = Util.dateFormat(y, 'yyyy-MM-dd')
                      }
                  }

              }

              this.request('get_production_order_log', data, true).then(res => {
                  if (res.status == 'success') {
                      let serialNoBegain = this.pageSize * (this.page - 1);
                      res.data.data.map(x => {
                          serialNoBegain++;
                          x.serialNo = serialNoBegain;
                          if (x.resource_name) {
                              x.desc = x.description + '[' + x.resource_name + ']'
                          }
                      })
                      this.total = res.data.count;
                      this.list = res.data.data;
                  }
              })
          },
          search() {
              this.page = 1;
              this.get_operation_log_list();
          },
          handleReset() {
              this.formSearch = formSearch();
              this.search();
          },
          changePage(page) {
              this.page = page;
              //获取最新数据
              this.get_operation_log_list();
          },
          //分页切换每页记录数
          changePageSize(pageSize) {
              this.pageSize = pageSize;
              //获取最新数据
              this.get_operation_log_list();
          },
      },
      mounted() {
          this.get_operation_log_list();
      }
  };
</script>
