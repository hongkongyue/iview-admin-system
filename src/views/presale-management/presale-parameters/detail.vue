<style lang="less">
   
</style>

<template>
<div class="background-color-white exhibition">
    　 <Form :model="form_detail" class="detailForm" ref="form_detail" :label-width="100" inline label-position="right">
        <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
            <i-col span="24">
                <span style="font-weight:bold;font-size:14px;" class="card-form-title">预售设置</span>
            </i-col>
        </Row>
        <Col span="24">
        <Row>
            <Col span="5">
            <Form-item label="品牌：">
                {{ form_detail.brand_name }}
            </Form-item>
            </Col>
            <Col span="6">
            <Form-item label="安全库存：">
                {{ form_detail.safe_stock }}
            </Form-item>
            </Col>
            <Col span="5">
            <Form-item label="安全天数：">
                {{ form_detail.safe_day }}
            </Form-item>
            </Col>
            <Col span="5">
            <Form-item label="预售百分比：">
                {{ form_detail.presale_percent }}
            </Form-item>
            </Col>
        </Row>
          <Row>
            <Col span="5">
            <Form-item label="全品预售：">
                {{ form_detail.is_all_presale_show }}
            </Form-item>
            </Col>
            <Col span="6">
            <Form-item label="商品总数：">
                {{ form_detail.detail.length }}
            </Form-item>
            </Col>
            <Col span="5">
            <Form-item label="店铺：">
                {{ form_detail.shop_name }}
            </Form-item>
            </Col>
            <Col span="5">
            <!-- <Form-item label="预售百分比：">
                {{ form_detail.presale_status }}
            </Form-item> -->
            </Col>
        </Row>
        <Row>
            <Col span="5">
            <Form-item label="创建人：">
                {{ form_detail.create_user }}
            </Form-item>
            </Col>
            <Col span="6">
            <Form-item label="创建时间：">
                {{ form_detail.created }}
            </Form-item>
            </Col>
            <Col span="5">
            <Form-item label="修改人：">
                {{ form_detail.update_user }}
            </Form-item>
            </Col>
            <Col span="5">
            <Form-item label="修改时间：">
                {{ form_detail.updated }}
            </Form-item>
            </Col>
        </Row>
        </Col>
    </Form>

     <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
        <i-col span="24">
            <span style="font-weight:bold;font-size:14px;" class="card-form-title">商品信息</span>
        </i-col>
    </Row>
    <Row　class-name="margin-bottom-10">
        <Table size="small" :columns="columns" highlight-row :data="form_detail.detail"></Table>
    </Row>
</div>
</template>

<script>
import Util from '@/libs/util.js';
export default {
    name: 'presale_parameters_detail_',
    desc: '预售参数详情',
    data() {
        return {
            id: "",
            form_detail: {},
            columns: [{
                title: '序号',
                type: 'index',
                align: 'center',
                width: 60
            }, {
                title: '款号',
                key: 'goods_no',
                align: 'center',
                width: 120
            }, {
                title: '商品名称',
                key: 'goods_name',
                align: 'center',
                width: 200
            }, {
                title: '是否预售',
                key: 'is_presale_show',
                align: 'center',
                width: 100
            }, {
                title: '安全库存',
                key: 'safe_stock',
                align: 'center',
                width: 100,
            }, {
                title: '安全天数',
                key: 'safe_day',
                align: 'center',
                width: 100
            }, {
                title: '预售百分比(%)',
                key: 'presale_percent',
                align: 'center',
                width: 120
            }, {
                title: '规格数',
                key: 'sku_num',
                align: 'center',
                width: 100
            }],
        };
    },
    methods: {
          getDetail() {
              this.request('get_pre_sale_parameters_detail', {
                  id: this.$route.params.Id
              }, true).then(res => {
                  if (res.errno == 0) {
                      res.data.presale_percent = Util.toPercent(res.data.presale_percent)
                      this.form_detail = res.data
                  }
              })
          }
    },
    activated() {

    },
    mounted() {
        this.getDetail()
    }
};
</script>
