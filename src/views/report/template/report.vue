<template>
  <div class="background-color-white exhibition" id="report_template">
    <Row v-for="(item,index) in list_len" :key="index" class="margin-bottom-10">
      <Collapse v-model="value1" accordion>
          <Panel v-bind:name='String(index + 1)'>
            {{ index + 1 }}. {{ list[item][0].reportType }}
            <p slot="content">
              <Row class="margin-bottom-10">
                    <div class="ivu-table-wrapper">
                        <div class="ivu-table ivu-table-border">
                            <div class="ivu-table-header">
                              <Col span="24">
                                <table cellspacing="0" cellpadding="0" border="0" style="width:100%;">
                                    <colgroup>
                                        <col width="15%">
                                        <col width="35%">                                        
                                        <col width="50%">
                                        <col width="15%">
                                        <col width="35%">                                        
                                        <col width="50%">
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th class="ivu-table-column-center">
                                                <div class="ivu-table-cell">
                                                    <span class="">序号</span>
                                                </div>
                                            </th>
                                            <th class="ivu-table-column-center">
                                                <div class="ivu-table-cell">
                                                    <span class="">报表名称</span>
                                                </div>
                                            </th>
                                            <th class="ivu-table-column-center">
                                                <div class="ivu-table-cell">
                                                    <span class="">报表说明</span>
                                                </div>
                                            </th>
                                            <th class="ivu-table-column-center">
                                                <div class="ivu-table-cell">
                                                    <span class="">序号</span>
                                                </div>
                                            </th>
                                            <th class="ivu-table-column-center">
                                                <div class="ivu-table-cell">
                                                    <span class="">报表名称</span>
                                                </div>
                                            </th>
                                            <th class="ivu-table-column-center">
                                                <div class="ivu-table-cell">
                                                    <span class="">报表说明</span>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="ivu-table-tbody">
                                        <tr v-for="(table_item,index) in list[item]" class="ivu-table-row" v-if="(index+1) % 2 == 1">
                                            <td class="ivu-table-column-center" >
                                              <div class="ivu-table-cell">
                                                  <span>{{index + 1}}</span>
                                              </div>
                                            </td>
                                            <td class="ivu-table-column-left">
                                              <div class="ivu-table-cell">
                                                  <Row>
                                                    <Col span='20'>
                                                      <a style="cursor:pointer" @click.prevent="$router.push({name:'rpt_print',params:{reportUrl:table_item.reportUrl}})">
                                                        {{ table_item.reportName }}
                                                      </a>
                                                    </Col>
                                                    <Col span='4'>
                                                      <a :href="table_item.reportUrl" target="_blank">
                                                        <Icon type="md-open" />
                                                      </a>
                                                    </Col>
                                                  </Row>
                                              </div>
                                            </td>
                                            <td class="ivu-table-column-left">
                                              <div class="ivu-table-cell">
                                                  <div v-html="table_item.reportDesc">
                                                    {{ table_item.reportDesc }}
                                                  </div>
                                              </div>
                                            </td>
                                            <td class="ivu-table-column-center" v-if='(index + 2) <= list[item].length'>
                                              <div class="ivu-table-cell">
                                                  <span>{{index + 2}}</span>
                                              </div>
                                            </td>
                                            <td class="ivu-table-column-left" v-if='(index + 2) <= list[item].length'>
                                              <div class="ivu-table-cell">
                                                  <Row>
                                                    <Col span='20'>
                                                      <a style="cursor:pointer" @click.prevent="$router.push({name:'rpt_print',params:{reportUrl:list[item][index + 1].reportUrl}})">
                                                        {{ list[item][index + 1].reportName }}
                                                      </a>
                                                    </Col>
                                                    <Col span='4'>
                                                      <a :href="list[item][index + 1].reportUrl" target="_blank">
                                                        <Icon type="md-open" />
                                                      </a>
                                                    </Col>
                                                  </Row>
                                              </div>
                                            </td>
                                            <td class="ivu-table-column-center" v-if='(index + 2) <= list[item].length'>
                                              <div class="ivu-table-cell">
                                                  <div v-html="list[item][index + 1].reportDesc">
                                                    {{ list[item][index + 1].reportDesc }}
                                                  </div>
                                              </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                              </Col>
                            </div>
                        </div>
                    </div>
                </Row>
            </p>
          </Panel>
      </Collapse>
    </Row>
    
    <!-- <Row v-if="this.type == 'finance_base'">
      <Page style="margin-top:5px;" :total="total" :page-size="pageSize" :current="page" show-sizer show-total show-elevator
                  @on-change="currentChange" @on-page-size-change="sizeChange"></Page>
    </Row> -->
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import Vue from 'vue'

  export default {
    name: "report_template",
    data() {
      return {
        reportMenuList:[],
        resourceId: '',
        list:[],
        list_len:0,
        value1:1,
        index:0,
        page:1,
        pageSize:10,
        total:0,
      }
    },
    props:['type'],
    computed: {
      ...mapState({
        menuList: state => state.app.menuList
      })
    },
    watch: {
      menuList(val) {
        if(this.index < 1){
          this.reportMenuList = [];
          this.reportMenuList = val.filter(x => {
            return x.resourceName == '报表管理'
          })
          this.GetResourceId(this.reportMenuList[0])
          this.get_report_list();
          this.index++;
        }
      }
    },
    activated() {
      this.$store.dispatch('updateMenuList');
      this.index = 0;
    },
    methods: {
      GetResourceId(data) {
        let pathList,path;
        pathList = this.$route.path.split('/');
        path = pathList.length - 1;
        if (pathList[pathList.length - 1] == data.menuUrl) {
          this.resourceId = data.resourceId;
        } else {
          if (data.childrenResource.length > 0) {
            data.childrenResource.map(x => {
              this.GetResourceId(x)
            })
          }
        }
      },
      get_report_list(){
        let data = {};
        if(this.type == 'finance_base'){
          data.resourceId = this.resourceId;
          data.start = (this.page - 1) * this.pageSize;
          data.length = 10000;
        }else{
          data.resourceId = this.resourceId;
        }
        this.request('get_report_list',{
          data:data
        },true).then(res=>{
          if(res.code == 1){
            this.list = res.data.reportList;
            this.total = res.data.count
            this.list_len = Object.keys(this.list);
            
            // this.list_len.map(z=>{
            //   this.list[z].map((x,y)=>{
            //     if( (y+1) % 2 == 1){
            //       this.list[z][y] = Object.assign(this.list[z][y] ,this.list[z][y+1])
            //                         // console.log(this.list[z])

            //     }
            //   })
            // })
            // console.log(this.list,432432424)
          }
        })
      },
      currentChange(val){
        this.page = val;
        this.get_report_list();
      },
      sizeChange(val){
        this.pageSize = val;
        this.get_report_list();
      }
    }
  }
</script>

<style lang="less">
  #report_template{
    .ivu-collapse>.ivu-collapse-item>.ivu-collapse-header {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      color: #666;
      cursor: pointer;
      position: relative;
      background: RGB(234,244,254);
      border: 1px solid #d5e8fc;
      border-radius: 6px;
      color: #495060;
      font-size: 12px;
    }
    .ivu-collapse>.ivu-collapse-item {
        border-top: 0px;
    }
    .ivu-collapse-content{
      padding:0;
    }
    .ivu-collapse{
      border:0;
    }
    .ivu-collapse-content>.ivu-collapse-content-box {
      padding-top: 5px;
      padding-bottom: 5px;
    }
    .ivu-table td, .ivu-table th{
      height: 40px;
    }
  }
</style>
