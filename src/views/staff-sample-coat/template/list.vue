<style lang="less">
  .search .ivu-form-item {
    margin-bottom: 12px;
  }
</style>

<template>
  <div class="background-color-white exhibition">
    <Form :model="formSearch" class="search" ref="formSearch" :label-width="80" inline label-position="right"
          @keydown.native.enter="search">
      <Row>
        <Col span="6">
        <Form-item label="订单编号：">
          <Input v-model="formSearch.orderId" placeholder="订单编号"></Input>
        </Form-item>
        </Col>
        <Col span="6">
        <Form-item label="收货人：">
          <Input v-model="formSearch.consigne" placeholder="收货人姓名"></Input>
        </Form-item>
        </Col>
        <Col span="6">
        <Form-item label="订单状态：">
          <Select style="width:162px" v-model="formSearch.orderStatus" placeholder="请选择">
            <Option v-for="item in orderStatusList" :value="item.statusCode" :key="item.statusCode">{{ item.statusName
              }}
            </Option>
          </Select>
        </Form-item>
        </Col>
        <Col span="6">
        <Form-item label="原始单号：">
          <Input v-model="formSearch.sourceOrderCode" placeholder="原始单号"></Input>
        </Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="6">
        <Form-item label="订单类型：">
          <Select style="width:162px" v-model="formSearch.orderType" placeholder="请选择">
            <Option value="LY,JY">查看全部</Option>
            <Option value="LY">样衣领用</Option>
            <Option value="JY">样衣借用</Option>
          </Select>
        </Form-item>
        </Col>
        <Col span="12">
        <Form-item label="订单日期：">
          <DatePicker type="date" v-model="formSearch.startDate" placeholder="选择开始日期" style="width: 200px"></DatePicker>
          <DatePicker type="date" v-model="formSearch.endDate" placeholder="选择结束日期" style="width: 200px"></DatePicker>
        </Form-item>
        </Col>
        <Col span="6">
        <Form-item :label-width="1">
          <Button type="primary" @click="search('formSearch')" icon="ios-search">搜索</Button>
          <Button type="default" @click="handleReset('formSearch')">重置</Button>
        </Form-item>
        </Col>
      </Row>
    </Form>
    <Row v-if="pageType == 'check'">
      <Button type="primary" @click="batchReview">批量审核</Button>
    </Row>
    <Row class-name="margin-bottom-10">
      <Col v-if="pageType=='list'" span="24" class="">
      <Button type="primary" icon="md-add" @click="addStaffSampleCoat">
        新增
      </Button>
      <Button type="primary" icon="arrow-down-a" @click="downTemplate()">
        下载模板
      </Button>
      <Button type="primary" icon="arrow-up-a" @click="importStaffSampleCoat">
        批量导入
      </Button>
      </Col>
    </Row>
    <!-- 表格 -->
    <Row class="margin-bottom-10">
      <Table size="small" :columns="columns" :data="list" @on-selection-change="selectRow"></Table>
    </Row>
    <Row>
      <Page :total="total" :page-size="pageSize" :current="pageNumber" show-sizer show-total show-elevator
            @on-change="changePage" @on-page-size-change="changePageSize"></Page>
    </Row>

    <!-- 导入弹窗 -->
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
          action="/eop/eom/spl/importExcelOrder"
          :data="{account:userInfo.userAccount,userId:userInfo.userId,importType:'YY'}"
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
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="importStaffSampleCoatSave">导入</Button>
      </div>
    </Modal>
    <Modal v-model="returnModal" title="样衣归还" width="800" :closable="false">
      <addReturn v-if="false" :pageType="pageType" ref="addReturn"></addReturn>
      <div slot="footer">
        <Button type="primary" @click="addReturn">确定</Button>
        <Button type="default" @click="cancel">取消</Button>
      </div>
    </Modal>
    <Modal v-model="closeOrder_Modal" title="关闭订单" width="400">
      <Form :model="closeOrder_form" ref="closeOrder_form" :label-width="90" inline label-position="right"
            :rules="rules">
        <Form-item label="责任归属：" prop="duty_belong">
          <Select style="width:162px" v-model="closeOrder_form.duty_belong" placeholder="请选择">
            <Option v-for="item in liability" :value="item.value" :key="item.value">{{ item.value }}</Option>
          </Select>
        </Form-item>
        <Form-item label="原因：">
          <Input v-model="closeOrder_form.reason" placeholder="请输入原因"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="close_return_order">确定</Button>
        <Button type="default" @click="close_closeOrderModal">取消</Button>
      </div>
    </Modal>

    <Modal
      v-model="batchReview_visible"
      title="审核单据"
      :mask-closable="false"
    >
      <Form :model="batchReviewForm" ref="batchReview" :rules="ruleValidate" :label-width="90">
        <FormItem label="">
          <RadioGroup v-model="batchReviewForm.checkStatus">
            <Radio label="2">同意</Radio>
            <Radio label="-2">驳回</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="审批意见：" prop="suggest">
          <Input v-model="batchReviewForm.suggest" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="请输入审批意见"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="batchReview_visible = false;">取消</Button>
        <Button type="primary" @click="checkStaffSalesOrder">确认</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import base from 'libs/base';
  import addReturn from './addReturn'
  import Util from 'libs/util';
  import {mapState} from 'vuex';
  import Vue from 'vue'

  var operation = Vue.extend({
    props: ['params', 'pageType'],
    template: `
    <div>
      <Button type="primary" size="small" @click="viewStaffSampleCoat(params.row.orderId,'view')">查看</Button>
      <span v-if="this.pageType == 'list'">
        <!--<Button type="primary" size="small" v-if="params.row.orderStatus == 750 || params.row.orderStatus == 600 || params.row.orderStatus == 700" @click="openReturnModal(params.row)">归还</Button>-->
        <!--<Button type="primary" size="small" v-if="params.row.orderStatus == 750 || params.row.orderStatus == 600" @click="closeOrder(params.row)">关闭</Button>-->
        <Button type="primary" size="small" v-if="params.row.orderStatus == 100 || params.row.orderStatus == 250 || params.row.orderStatus == 200" @click="editStaffSampleCoat(params.row.orderId)">编辑</Button>
        <Button type="primary" size="small" v-if="params.row.orderStatus == 100 || params.row.orderStatus == 200 || params.row.orderStatus == 250 || params.row.orderStatus == 350" @click="cancel_order(params.row.orderId)">取消</Button>
      </span>
    </div>
  `,
    methods: {
      viewStaffSampleCoat(orderId, type) {
        this.$store.dispatch('setStaffSampleCoatDetail_ActiveTable', 'apply');
        this.$router.push({
          name: 'staffsamplecoat_detail',
          params: {
            orderId: orderId,
            pageType: this.pageType,
            type: type
          }
        });
      },
      editStaffSampleCoat(orderId){
        this.$router.push({
            name: 'staffsamplecoat_edit',
            params: {
                orderId: orderId
            }
        });
      },
      openReturnModal(row) {
        this.request('check_return_order_detail', {
          data: {
            orderId: row.orderId,
          }
        }, true).then((res) => {
          if (res.code == 1) {
            if (res.data.staffOrderDetailList.length > 0) {
              this.$store.dispatch('setReturnModal', true);
              var tableData = [];
              tableData = res.data.staffOrderDetailList.map(x => {
                return {
                  brands: x.brands,
                  commodity_code: x.commodityCode,
                  count: x.count,
                  unreturn_count: x.count - x.returnCount,
                  norms: x.norms,
                  price: x.price,
                  section_no: x.sectionNo,
                  detail_id: x.orderDetailId
                }
              })
              this.$root.eventHub.$emit('returnModal', {
                tableData: tableData,
                row: row
              });
            } else {
              this.$Message.warning(res.msg);
            }
          }
        })
      },
      closeOrder(row) {
        this.$root.eventHub.$emit('closeOrder_Modal', {
          closeOrder_Modal: true,
          Row: row
        })
      },
      cancel_order(orderId) {
        this.$Modal.confirm({
          title: '提示',
          content: '该订单将会取消，请确认！',
          onOk: () => {
            this.request('cancel_order', {
              data: {
                orderId: orderId,
                userAccount: JSON.parse(window.sessionStorage.getItem('userinfo')).userAccount
              }
            }, true).then(res => {
              if (res.code == 1) {
                this.$root.eventHub.$emit('cancel_order');
                this.$Message.success(res.msg);
              }
            })
          },
          onCancel: () => {
          }
        })
      }
    }
  })

  function closeOrder_form() {
    return {
      duty_belong: '',
      reason: ''
    }
  }

  function batchReviewForm(){
    return {
      batchReviewForm:'',
      suggest:''
    }
  }

  export default {
    name: 'staffsamplecoat_list_template',
    props: {
      pageType: String
    },
    data() {
      return {
        batchReviewForm:batchReviewForm(),
        userInfo: {},
        columns: [
          {
            type: 'selection',
            align: 'center',
            width: 60
          },
          {
            title: '序号',
            key: 'serialNo',
            align: 'center',
            width: 60
          },
          {
            title: '借用人',
            key: 'name',
            align: 'center',
            width: 100
          },
          {
            title: '订单类型',
            key: 'typeShow',
            align: 'center',
            width: 100
          },
          {
            title: '订单编号',
            key: 'orderId',
            align: 'center',
            width: 150,
            render: (h, params) => {
              if (params.row.isDelay == 1) {
                return h('div', [
                  h('Span', {
                    style: {
                      marginRight: '5px',
                      color: 'red'
                    },
                  }, '逾期'),
                  h('a', {
                    on: {
                      click: () => {
                        this.viewStaffSampleCoat(params.row.orderId, 'view');
                      }
                    }
                  }, params.row.orderId)
                ])
              } else {
                return h('a', {
                  on: {
                    click: () => {
                      this.viewStaffSampleCoat(params.row.orderId, 'view');
                    }
                  }
                }, params.row.orderId)
              }
            }
          },
          {
            title: '原始单号',
            key: 'sourceOrderCode',
            align: "center",
            width: 150
          },
          {
            title: '订单日期',
            key: 'payTime',
            align: 'center',
            width: 150
          },
          {
            title: '订单金额',
            key: 'totalMoney',
            align: 'center',
            width: 100
          },
          {
            title: '订单状态',
            key: 'orderStatus',
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h('span', {}, Util.formatOrderStatus(params.row.orderStatus));
            }
          },
          {
            title: '物流公司',
            key: 'logisticsCompany',
            align: 'center',
            width: 180
          },
          {
            title: '物流单号',
            key: 'logisticsNo',
            align: 'center',
            width: 150
          },
          {
            title: '审核意见',
            key: 'suggest',
            align: 'center',
            width: 150
          },
          {
            title: '审核人',
            key: 'checkUserName',
            align: 'center',
            width: 100
          },
          {
            title: '审核时间',
            key: 'checkTime',
            align: 'center',
            width: 150
          },
          {
            title: '备注',
            key: 'remark',
            align: 'center',
            minWidth: 150
          },
          {
            title: '操作',
            key: 'operation',
            width: 200,
            fixed: 'right',
            render: (h, params) => {
              return h(operation, {
                props: {
                  params: params,
                  pageType: this.pageType
                }
              })
            }
          }
        ],
        //列表数据
        list: [],
        //总共数据多少条
        total: 25,
        //每页多少条数据
        pageSize: 10,
        //当前页码
        pageNumber: 1,
        //搜索表单
        formSearch: {
          orderType: 'LY,JY',
          orderId: ''
        },
        importModal: false,
        file: null,
        loadingStatus: false,
        closeOrder_Modal: false,
        closeOrder_form: closeOrder_form(),
        listRow: {},
        liability: [
          {
            value: '个人',
            label: '个人'
          },
          {
            value: '部门',
            label: '部门'
          },
          {
            value: '其他',
            label: '其他'
          }
        ],
        rules: {
          duty_belong: [{required: true, message: '请选择责任归属!', trigger: 'change'}]
        },
        ruleValidate:{
          suggest: [
            { required: true, message: '请填写审批意见', trigger: 'blur' }
          ]
        },
        selectedRow:[],                     //选中行
        batchReview_visible: false,        //批量审核弹窗开关
      };
    },

    methods: {
      //新增内购样衣
      addStaffSampleCoat() {
        this.$router.push({name: 'staffsamplecoat_add', params: {openType: 'add'}});
      },
      viewStaffSampleCoat(orderId, type) {
        this.$store.dispatch('setStaffSampleCoatDetail_ActiveTable', 'apply');
        this.$router.push({
          name: 'staffsamplecoat_detail',
          params: {
            orderId: orderId,
            pageType: this.pageType,
            type: type
          }
        });
      },
      getData(params) {
        let dataMap = {};
        dataMap.type = this.formSearch.orderType.split(',');
        if (params.orderType) {
          dataMap.type = this.formSearch.orderType.split(',');
        }
        if (params.consigne) {
          dataMap.consigne = params.consigne;
        }
        dataMap.length = this.pageSize;
        dataMap.start = (this.pageNumber - 1) * this.pageSize;
        dataMap.orderStatus = params.orderStatus;
        dataMap.orderId = params.orderId;
        if (params.sourceOrderCode) {
          dataMap.sourceOrderCode = params.sourceOrderCode;
        }
        if (!!params.startDate) {
          dataMap.start_date = Util.dateFormat(params.startDate, 'yyyy-MM-dd');
        }
        if (!!params.endDate) {
          dataMap.end_date = Util.dateFormat(params.endDate, 'yyyy-MM-dd');
        }
        if (this.pageType == 'list') {
          dataMap.userId = [JSON.parse(window.sessionStorage.getItem('userinfo')).userId];
        } else {
          dataMap.param = JSON.parse(window.sessionStorage.getItem('userinfo')).userId;
          dataMap.orgId = JSON.parse(window.sessionStorage.getItem('userinfo')).orgId;
        }
        this.request('StaffSampleCoatList',
          {
            ver: '1',
            ts: Date.parse(new Date()),
            data: {map: dataMap}
          }, true).then((res) => {

          //处理序号显示
          let serialNoBegain = this.pageSize * (this.pageNumber - 1);
          res.data.data.forEach((item) => {
            serialNoBegain++;
            item.serialNo = serialNoBegain;
            if (item.type == 'LY') {
              item.typeShow = '样衣领用';
            } else if (item.type == 'JY') {
              item.typeShow = '样衣借用';
            }
          })
          this.list = res.data.data;
          //总页数
          this.total = res.data.total;
        });
      },
      //分页切换页码
      changePage(page) {
        this.pageNumber = page;
        let search = this.formSearch;
        let pageSize = this.pageSize;
        //获取最新数据
        this.getData(search);
      },
      //分页切换每页记录数
      changePageSize(pageSize) {
        this.pageSize = pageSize;
        let search = this.formSearch;
        let query = Object.assign({page: this.pageNumber, pageSize}, search);
        //获取最新数据
        this.getData({params: search});
      },
      //重置表单数据
      handleReset(name) {
        this.formSearch = {
          orderType: 'LY,JY'
        };
        this.search();
      },
      //表单搜索
      search() {
        let search = this.formSearch;
        this.pageNumber = 1;
        this.getData(search);
      },
      downTemplate() {
        window.location = ('/excel/订单批量导入模板.xlsx')
      },
      //批量导入弹窗
      importStaffSampleCoat() {
        this.file = null;
        this.$refs.upload.clearFiles();
        this.importModal = true;
      },
      cancel() {
        if (this.returnModal) {
          this.$store.dispatch('setReturnModal', false);
          this.$refs.addReturn.cancel();
        }
        if (this.importModal) {
          this.importModal = false;
        }
      },
      importStaffSampleCoatSave() {
        this.loadingStatus = true;
        this.$refs.upload.post(this.file);
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
        if (res.code == 1) {
          this.loadingStatus = false;
          this.$Message.success(res.msg);
          this.importModal = false;
          this.search();
        } else {
          this.loadingStatus = false;
          this.$Message.error(res.msg + res.data);
        }
      },
      uploadError(res, file) {
        this.$Message.error(res.msg + res.data);
      },
      addReturn() {
        this.$refs.addReturn.add_return_order()
      },
      close_return_order() {
        this.$refs["closeOrder_form"].validate((valid) => {
          if (valid) {
            var data = this.closeOrder_form;
            data.source_order_code = this.listRow.orderId;
            this.$Modal.confirm({
              title: '提示',
              content: '商品未全部归还，是否关闭订单',
              onOk: () => {
                this.request('close_return_order', {
                  data: data
                }, true).then(res => {
                  if (res.code == 1) {
                    this.$Message.success(res.msg);
                    this.closeOrder_Modal = false;
                    this.search();
                  }
                })
              },
              onCancel: () => {
                this.$Message.warning('已取消');
              }
            })
          } else {
            this.$Notice.warning({
              title: '提示',
              desc: '请核对表单信息!'
            });
            return false;
          }
        })
      },
      close_closeOrderModal() {
        this.closeOrder_Modal = false;
        this.search();
      },
      selectRow(val){
        this.selectedRow = val;
      },
      batchReview() {
        if(this.selectedRow.length > 0){
          for(let x of this.selectedRow){
            if(x.orderStatus != '200'){
              this.$Message.warning('存在非待审核状态，请核对！')
              return false;
            }
          }

          this.batchReview_visible = true;
          this.batchReviewForm = batchReviewForm();
          this.$refs['batchReview'].resetFields();
        }else{
          this.$Message.warning('请选择要审核行！')
        }
      },
      checkStaffSalesOrder(){
        let data = Util.deepClone(this.batchReviewForm);
        let orderIds = '';
        this.selectedRow.map(x=>{
          orderIds += x.orderId + ','
        })

        orderIds = orderIds.substr(0,orderIds.length -1);
        data.orderIds = orderIds;
        data.checkUserId = JSON.parse(window.sessionStorage.getItem('userinfo')).userId;
        data.checkUserName = JSON.parse(window.sessionStorage.getItem('userinfo')).userName;
        this.request('check_order_by_list',{
          data:data
        }).then(res=>{
          if(res.code == 1){
            this.$Message.success(res.msg);
            this.batchReview_visible = false;
            this.search();
          }
        })
      }
    },
    computed: {
      ...mapState({
        orderStatusList: state => state.common.orderStatusList,
        returnModal: state => state.order.returnModal
      })
    },
    mounted() {
      this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
      this.$store.dispatch('get_order_status_list', {});
      this.$root.eventHub.$on('returnModal_1', (obj) => {
        this.$store.dispatch('setReturnModal', true);
        this.listRow = obj.Row;
      })
      this.$root.eventHub.$on('closeOrder_Modal', (obj) => {
        this.closeOrder_Modal = obj.closeOrder_Modal;
        this.listRow = obj.Row;
        this.closeOrder_form = closeOrder_form();
        this.$refs['closeOrder_form'].resetFields();
      })
      this.$root.eventHub.$on('cancel_order', () => {
        this.getData(this.formSearch);
      })
    },
    activated() {
      this.getData(this.formSearch);
    },
    components: {
      addReturn
    }
  };
</script>
