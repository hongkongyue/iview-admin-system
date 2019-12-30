<style>

</style>

<template>
<div class="background-color-white exhibition" id="production_order_detail">
    <Form :model="form_detail" class="detailForm"  ref="form_detail" :label-width="100" inline label-position="left">
        <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
            <i-col span="20">
                <span style="font-weight:bold;font-size:14px;" class="card-form-title">单据信息</span>
            </i-col>
             <i-col span="4">
                    <Button type="primary"　size="small" @click="syncProduceOrder" >从scm手动同步</Button>
            </i-col>
        </Row>
        <Row>
            <Col span="24">
            <Row>
                <Col span="5">
                <Form-item label="生产单号：">
                    {{ form_detail.order_no }}
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="批次：">
                    {{ form_detail.batch_no }}
                </Form-item>
                </Col>
                <Col span="5">
                <Form-item label="大货状态：">
                    {{ form_detail.big_goods_status_show }}
                </Form-item>
                </Col>
                <Col span="5">
                <Form-item label="预售状态：">
                    {{ form_detail.presale_status_show }}
                </Form-item>
                </Col>
            </Row>
            <Row>
                <Col span="5">
                <Form-item label="货品编码：">
                    {{ form_detail.goods_no }}
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="规格数量：">
                    {{ form_detail.sku_num }}
                </Form-item>
                </Col>
                <Col span="5">
                <Form-item label="品牌：">
                    {{ form_detail.brand_name }}
                </Form-item>
                </Col>
                <Col span="5">
                <Form-item label="仓库：">
                    {{ form_detail.warehouse_name }}
                </Form-item>
                </Col>
            </Row>
                <Row>
                <Col span="5">
                <Form-item label="单据类型：">
                    {{ form_detail.order_type }}
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="合约货期：">
                    {{ form_detail.contract_delivery_time }}
                </Form-item>
                </Col>
                <Col span="5">
                <Form-item label="计划交货时间：">
                    {{ form_detail.plan_delivery_time }}
                </Form-item>
                </Col>
                <Col span="5">
                <Form-item label="供应商：">
                    {{ form_detail.supplier_name }}
                </Form-item>
                </Col>
            </Row>
             <Row>
                <Col span="5">
                <Form-item label="下单总数：">
                    {{ form_detail.num }}
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="入库总数：">
                    {{ form_detail.instock_num_sum }}
                </Form-item>
                </Col>
                <Col span="5">
                <Form-item label="未到货数量：">
                    {{ form_detail.no_instock_num_sum }}
                </Form-item>
                </Col>
                <Col span="5">
                <Form-item label="关联预售单：">
                    <a @click="openPresaleStrategyDetail">{{ form_detail.order_code }}</a>
                </Form-item>
                </Col>
            </Row>
             <Row>
                <Col span="5">
                <Form-item label="下单日期：">
                    {{ form_detail.order_date }}
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="创建时间：">
                    {{ form_detail.order_created }}
                </Form-item>
                </Col>
                <Col span="5">
                <Form-item label="最后修改时间：">
                    {{ form_detail.order_updated }}
                </Form-item>
                </Col>
                  <Col span="5">
                <Form-item label="最后更新时间：">
                    {{ form_detail.updated }}
                </Form-item>
                </Col>
            </Row>
            </Col>
        </Row>
    </Form>
    <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
        <i-col span="24">
            <span style="font-weight:bold;font-size:14px;" class="card-form-title">商品信息</span>
        </i-col>
    </Row>
    <Row　class-name="margin-bottom-10">
        <Table size="small" :columns="columns" highlight-row :data="form_detail.detail"></Table>
    </Row>
    <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
        <i-col span="24">
            <span style="font-weight:bold;font-size:14px;" class="card-form-title">日志信息</span>
        </i-col>
    </Row>

    <Row　class-name="margin-bottom-10">
          <Col span="18">
        <Table size="small" :columns="logColumns" highlight-row :data="form_detail.log"></Table>
        </Col>
    </Row>
</div>
</template>

<script>
  export default {
      name: "production_order_detail_",
      desc: '生产单跟进明细',
      data() {
          return {
              form_detail: {},
              list: [],
              columns: [{
                      title: '序号',
                      type: 'index',
                      align: 'center',
                      width: 60
                  },
                  {
                      title: '大货状态',
                      key: 'big_goods_status',
                      align: 'center',
                      minWidth: 95,
                      render: (h, params) => {
                          let showColor = 'green';
                          let showName = '已完成'
                          if (params.row.big_goods_status == 0) {
                              showColor = '#ff9900';
                              showName = '未完成'
                          } else if (params.row.big_goods_status == -1) {
                              showColor = '#ed3f14';
                              showName = '已取消'
                          }
                          return h('Tag', {
                              props: {
                                  color: showColor
                              }
                          }, showName)
                      }
                  },
                  {
                      title: '生产状态',
                      key: 'produce_status',
                      align: 'center',
                      minWidth: 95,
                      render: (h, params) => {
                          let showColor = '';
                          let showName = ''
                          if (params.row.produce_status == 0) {
                              showColor = '#ff9900';
                              showName = '生产中'
                          } else if (params.row.produce_status == 1) {
                              showColor = '#19be6b';
                              showName = '已完成'
                          } else if (params.row.produce_status == 2) {
                              showColor = '#ed3f14';
                              showName = '代销'
                          } else if (params.row.produce_status == -1) {
                              showColor = '#ed3f14';
                              showName = '取消'
                          }
                          return h('Tag', {
                              props: {
                                  color: showColor
                              }
                          }, showName)
                      }
                  },
                  {
                      title: '货品编码',
                      key: 'goods_no',
                      align: 'center',
                      minWidth: 100
                  },
                  {
                      title: '货品名称',
                      key: 'goods_name',
                      align: 'center',
                      minWidth: 150
                  },
                  {
                      title: '规格编码',
                      key: 'spec_no',
                      align: 'center',
                      minWidth: 120
                  },
                  {
                      title: '规格名称',
                      key: 'spec_name',
                      align: 'center',
                      minWidth: 120
                  },
                  {
                      title: '计划交货时间',
                      key: 'plan_delivery_time',
                      align: 'center',
                      minWidth: 150
                  },
                  {
                      title: '合约货期',
                      key: 'contract_delivery_time',
                      align: 'center',
                      minWidth: 150
                  },

                  {
                      title: '下单数',
                      key: 'num',
                      align: 'center',
                      minWidth: 100
                  },
                  {
                      title: '入库数',
                      key: 'in_stock_num',
                      align: 'center',
                      minWidth: 100
                  },
                  {
                      title: '未入库数',
                      key: 'not_in_stock_num',
                      align: 'center',
                      minWidth: 100
                  },
              ],
              logColumns: [{
                      title: '序号',
                      type: 'index',
                      align: 'center',
                      width: 65
                  },
                  {
                      title: '操作时间',
                      key: 'date_time',
                      align: 'center',
                      width: 180
                  },
                  {
                      title: '操作人',
                      key: 'user_name',
                      align: 'center',
                      width: 150
                  },
                  {
                      title: '操作内容',
                      key: 'operate_desc',
                      align: 'center',
                  },
              ]
          }
      },
      mounted() {
          this.getDetail()
      },
      activated() {

      },
      methods: {
          getDetail() {
              this.request('get_production_order_detail', {
                  orderId: this.$route.params.orderId
              }, true).then(res => {
                  if (res.errno == 0) {
                      this.form_detail = res.data
                      if (this.form_detail.big_goods_status == 0) {
                          this.form_detail.big_goods_status_show = "未完成"
                      } else if (this.form_detail.big_goods_status == 1) {
                          this.form_detail.big_goods_status_show = "已完成"
                      } else if (this.form_detail.big_goods_status == -1) {
                          this.form_detail.big_goods_status_show = "已取消"
                      }
                  }
              })
          },
          openPresaleStrategyDetail() {
              let orderCode = this.form_detail.order_code
              this.$router.push({
                  name: 'presale_strategy_detail',
                  params: {
                      orderCode: orderCode
                  }
              })
          },
          /**
           * 从scm手动同步单条记录
           */
          syncProduceOrder(){
              this.request('sync_production_order',{
                  mainId:this.form_detail.id
              },'正在从scm同步...').then((res)=>{
                  this.$Message.success('同步成功')
                  this.getDetail()
              })
          }
      }
  }
</script>
