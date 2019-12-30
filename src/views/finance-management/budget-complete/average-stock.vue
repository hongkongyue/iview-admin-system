<template>
    <div class="background-color-white exhibition" id="average-stock" style="min-height:350px">
        <Row class="margin-bottom-10">
            <Form :model="formSearch" :label-width="100" inline label-position="right">
                <Col>
                  <Form-item label="品牌：" :label-width='60'>
                        <Select v-model="formSearch.brandId" style="width:150px">
                            <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brands }}
                            </Option>
                        </Select>
                 </Form-item>
                   <Form-item label="年月:" :label-width="70">
                        <DatePicker type="month" v-model="formSearch.yearMonth" placeholder="请选择年月"
                                    style="width: 100px"></DatePicker>
                    </Form-item>

                      <Form-item :label-width="10">
                    <Button type="primary" icon="ios-search"  @click="search">查询</Button>
                    <Button type="warning"  @click="reset">重置</Button>
            </Form-item>
                </Col>
            </Form>
        
        </Row>
        <Row>
            <Button type="primary" @click="downTemplate">下载模板</Button>
            <Button type="primary" @click="importData">导入</Button>
        </Row>
       <Row class-name="margin-top-10">
            <Col>
            <Table
                    ref="importDataTable"
                    size="small"
                    :loading="loading"
                    :columns="columns"
                    :data="list"
            >
            </Table>
            </Col>
        </Row>
          <Modal
                v-model="importModal"
                :title="平均库存导入">
                <div>
                    <Upload
                        ref="upload"
                        name="file"
                        :show-upload-list="false"
                        :before-upload="handleUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        type="drag"
                        action="/eop-node/api/finance/importBudgetCompleteData"
                        :data="{account:userInfo.userAccount,budgetType:'averageStock'}"
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
                    <Button type="primary" @click="importOrderSave">导入</Button>
                </div>
            </Modal>
    </div>
</template>

<script>
    import Util from 'libs/util';
    export default {
        name: 'average-stock',
        desc: '平均库存',
        props: {
             userInfo: Object
        },
        data() {
            return {
                formSearch: {
                   yearMonth:new Date()
                },
                brandList: [],
                importModal: false,
                loadingStatus: false,
                loading: false, //表格数据加载开关
                columns: [{
                    title: '序号',
                    key: 'serialNo',
                    align: 'center',
                    width: 60
                },{
                    title: '年月',
                    key: 'date_time',
                    align: 'center',
                    width: 100
                },{
                    title: '品牌',
                    key: 'brand_name',
                    align: 'center',
                    width: 120
                },
                {
                    title: '预算',
                    key: 'budget_average_stock',
                    align: 'center',
                    width: 120
                },
                {
                    title: '实际平均库存',
                    key: 'real_average_stock',
                    align: 'center',
                    width: 150
                },
                {
                    title: '降幅',
                    key: 'decline_rate',
                    align: 'center',
                    width: 120
                },
                {
                    title:'创建人',
                    key:'create_user',
                    align: 'center',
                    width: 100
                },
                  {
                    title:'创建时间',
                    key:'created',
                    align: 'center',
                    width: 150
                },
                {
                    title:'最后更新人',
                    key:'last_update_user',
                    align: 'center',
                    width: 100
                },
                  {
                    title:'最后更新时间',
                    key:'last_updated',
                    align: 'center',
                    width: 150
                },
                ],
                list: [],
                file: null,
                page: 1,
                pageSize: 10,
                total: 0,
            }
        },
        computed: {

        },
        mounted() {
            this.getBrandList()
            this.getData()
        },
        methods: {
            search() {
                this.getData()
            },
              getBrandList() {
                this.request('bi_brand_list', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    data: {}
                }, false).then((res) => {
                    this.brandList = res.data;
                    this.brandList = this.brandList.filter(x => {
                        return x.id != '51594' && x.id != '51609'
                    })
                    this.modalBrandList = Util.deepClone(this.brandList);
                    this.brandList.unshift({
                        id: 0,
                        brands: '所有品牌'
                    })
                })
            },
              reset() {
                this.formSearch = {}
                this.search();
            },
            openModal() {
                this.modal_visible = true;
                this.addForm = addForm();
            },
            cancel() {
                this.importModal = false;
                this.file = null;
            },
            downTemplate() {
                window.location = ('/excel/预算完成率(平均库存)导入模板.xlsx');
            },
            importData() {
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
                if (res.status == 'success') {
                    this.loadingStatus = false;
                    this.file = null;
                    this.$Message.success(res.message);
                    this.importModal = false;
                    this.search();
                } else {
                    this.loadingStatus = false;
                    this.$Message.error({
                        content: res.message,
                        duration: 3
                    });
                }
            },
            uploadError(res, file) {
                this.$Message.error(res.msg + res.data);
            },
            importOrderSave() {
                this.loadingStatus = true;
                Vue.prototype.$loading('正在导入数据...');
                this.$refs.upload.post(this.file);
            },
              getData() {
                  let data = Util.deepClone(this.formSearch);
                  data.budgetType = 'averageStock'
                  this.request('get_budget_complete_list_data', data, true).then(res => {
                      if (res.status == 'success') {
                          let serialNoBegain = 0
                          res.data.map(x => {
                              serialNoBegain++;
                              x.serialNo = serialNoBegain;
                              x.real_average_stock = Util.toThousands(x.real_average_stock)
                              x.budget_average_stock = Util.toThousands(x.budget_average_stock)
                              x.decline_rate = Util.toPercent(x.decline_rate)
                          })

                          this.list = res.data
                      }else{
                        this.$Message.warning({
                            content: res.message,
                            duration: 3
                        });
                      }
                  })
              }
        }
    }
</script>

<style lang="css">
  
</style>
