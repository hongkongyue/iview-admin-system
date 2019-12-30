<template>
    <div class="background-color-white exhibition" id="presale_pool_add">
        <Card dis-hover style="margin-bottom:20px">
            <Form 
                :model="list" 
                :label-width="75" 
                inline
                label-position="left"
            >
                <Row>
                    <Col span='6'>
                        <Form-item label="货品编码：">
                            {{list.goodsNo}}
                        </Form-item>
                    </Col>
                    <Col span='6'>
                        <Form-item label="店铺：">
                            {{list.shopName}}
                        </Form-item>
                    </Col>
                    <Col span='7'>
                        <Form-item label="品牌：" :label-width='100'>
                            {{list.brandName}}
                        </Form-item>
                    </Col>
                    <Col span='5'>
                        <Form-item label="仓库：" >
                            {{list.warehouseName}}
                        </Form-item>
                    </Col>
                    <Col span='6'>
                        <Form-item label="货品名称：">
                            {{list.goodsName}}
                        </Form-item>
                    </Col>
                    <Col span='6'>
                        <Form-item label="安全库存：">
                            <InputNumber v-if="type == 'add'" style="width: 140px" size="small" :min="0" v-model="list.safeStock"></InputNumber>
                            <span v-if="type == 'detail'">{{list.safeStock}}</span>
                        </Form-item>
                    </Col>
                    <Col span='7'>
                        <Form-item label="平台货品ID：" :label-width='100'>
                            <Select v-if="type == 'add'" style="width:160px" size="small" v-model="list.platfromGoodsNo" placeholder="请选择" @on-change="get_shop_by_platfromno">
                                <Option v-for="item in platfromGoodsNo_List" :value="item.value" :key="item.value">{{ item.value }}</Option>
                            </Select>
                            <span v-if="type == 'detail'"></span>
                        </Form-item>
                    </Col>
                    <Col span='5'>
                        <Form-item label="备注：">
                            <Input v-if="type == 'add'" size="small" v-model="list.remark" style="width: 140px" placeholder="请输入备注"></Input>
                            <span v-if="type == 'detail'">{{list.remark}}</span>
                        </Form-item>
                    </Col>
                </Row>
                
            </Form>
        </Card>
        <Card dis-hover style="margin-bottom:20px;">
            <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
                    <i-col span="24">
                        <Col span='2'>
                            <span class="card-form-title"><b>生产单</b></span>
                        </Col>
                        
                        <Button type="primary" size="small"  v-if="type == 'add'" @click="add_presaleSuborder">添加生产单</Button>
                        <Button type="primary" size="small"  v-if="type == 'add'" @click="update_presaleSuborder">更新生产单</Button>     
                    </i-col>
                </Row>
                <Row class-name="margin-bottom-10">
                    <Col span="24">
                    <Table size="small" :columns="presaleSuborder_columns" :border="true" :data="list.presaleSuborderList"></Table>
                    </Col>
                </Row>
        </Card>

        <Card dis-hover style="margin-bottom:20px;">
            <Row class-name="margin-bottom-10 padding-bottom-10 divide-line">
                    <i-col span="24">
                        <Col span='2'>
                            <span class="card-form-title"><b>商品明细</b></span>
                        </Col>
                        <Button type="primary" size="small"  v-if="type == 'add'" @click="add_presaleSubDetail">添加商品</Button>
                    </i-col>
                </Row>
                <Row class-name="margin-bottom-10">
                    <Col span="24">
                    <Table size="small" :columns="presaleSubDetail_columns" :border="true" :data="presaleSubDetailList"></Table>
                    </Col>
                </Row>
        </Card>

        <div v-if="type == 'add'" style="width: 300px;margin: auto;display: flex;justify-content: space-around;">
            <Button type="primary" size="small" @click="open_goods_page">打开商品页</Button>
            <Button type="primary" size="small" @click="submit('save')">存草稿</Button>
            <Button type="primary" size="small" @click="submit('submit')">提交</Button>
            <Button type="primary" size="small" @click="closePage">关闭</Button>
        </div>

        <div class="modal">
            <Modal v-model="modal_visible" transfer :mask-closable="false" title="商品明细" :width="1200"
               class-name="customize-modal-center">
                <Row>
                    <Col>
                        <Table size="small" :columns="presaleSubDetail_columns" :data="detail_Data"></Table>
                    </Col>
                </Row>
            </Modal>
            <Modal v-model="add_detail_visible" transfer :mask-closable="false" title="添加商品明细" :width="400"
               class-name="customize-modal-center">
                <Row>
                    <Col>
                        <b>生产单号：</b>
                        <Select @on-change="changeOrder" style="width:200px" size='small' v-model="addDetail_Form.orderNo" placeholder="请选择生产单号">
                            <Option v-for="item in list.presaleSuborderList" :value="item.orderNo" :key="item.orderNo">{{ item.orderNo }}
                            </Option>
                        </Select>
                    </Col>
                </Row>
                <Row class="margin-top-10">
                    <Col>
                        <b>商品明细：</b>
                        <Select style="width:200px" size='small' v-model="addDetail_Form.specNo" multiple placeholder="请选择商品明细">
                            <Option v-for="item in filter_presaleSubDetailList" :value="item.specNo" :key="item.specNo">{{ item.specName }}
                            </Option>
                        </Select>
                    </Col>
                </Row>
                <div slot="footer">
                    <Button type="default" @click="cancel">取消</Button>
                    <Button type="primary" @click="addDetail">添加</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>


<script>
    import Util from 'libs/util';
    let orderNo_template = Vue.extend({
        props: ['params'],
        data(){
            return {
                is_show:false
            }
        },
        mounted(){
            this.is_show = this.params.row.orderNo.indexOf(',') == -1 ? false : true;
        },
        template: `
            <div v-if="!!params.row.orderNo">
            <Tooltip placement="right" v-if="is_show">
                <div style="width:100px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{params.row.orderNo}}</div>
                <div slot="content" style="white-space: normal">
                    <span>{{params.row.orderNo}}</span>
                </div>
            </Tooltip>
            <span v-if="!is_show">{{params.row.orderNo}}</span>
            </div>
        `
    })
    export default {
        name:'presale_pool_add',
        data(){
            return {
                platfromGoodsNo_List:[],
                list:{},
                detail_Data:[],
                add_detail_visible:false,
                presaleSuborder_columns:[
                    {
                        title: '生产制单号',
                        key: 'orderNo',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '批次号',
                        key: 'batchNo',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '合约货期',
                        key: 'contractDeliveryTime',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '计划交货日期',
                        key: 'planDeliveryTime',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '安全天数',
                        key: 'safeDay',
                        align: 'center',
                        minWidth: 100,
                        render:(h,params)=>{
                            if(this.type == 'detail') {
                                return h('span',params.row.safeDay);
                            }
                            return h('Input',{
                                props: {
                                    type: 'text',
                                    value: this.list.presaleSuborderList[params.index].safeDay,
                                    size: 'small'
                                },
                                on: {
                                    'on-blur': (event) => {
                                        this.list.presaleSuborderList[params.index].safeDay = event.target.value;
                                        
                                        var reg = /^(0|[1-9]\d*)/;
                                        if(!reg.test(event.target.value)){
                                            this.$Message.warning('请输入数字！');
                                            this.list.presaleSuborderList[params.index].safeDay = 0;
                                        }else{
                                            this.list.presaleSuborderList[params.index].safeDay = event.target.value;
                                        }
                                        this.$set(this.list.presaleSuborderList,params.index,this.list.presaleSuborderList[params.index])
                                        
                                        let safeDay = this.list.presaleSuborderList[params.index].safeDay;
                                        this.presaleSubDetailList.map((x,y)=>{
                                            if(x.hasOwnProperty('children')){
                                                x.children.map((k,j)=>{
                                                    if(k.orderNo == params.row.orderNo){
                                                        let newDate = new Date(new Date(!!k.planDeliveryTime?k.planDeliveryTime:k.contractDeliveryTime).getTime() + safeDay * 1000 * 60 * 60 * 24);
                                                        this.presaleSubDetailList[y].children[j].presaleDate = Util.dateFormat(newDate,'yyyy-MM-dd');
                                                    }
                                                })
                                            }else{
                                                let newDate = new Date(new Date(!!x.planDeliveryTime?x.planDeliveryTime:x.contractDeliveryTime).getTime() + safeDay * 1000 * 60 * 60 * 24);
                                                this.presaleSubDetailList[y].presaleDate = Util.dateFormat(newDate,'yyyy-MM-dd');
                                            }
                                        })
                                        this.presaleSubDetailList.map((x,index)=>{
                                            if(x.hasOwnProperty('children')){
                                                this.presaleSubDetailList[index].children = x.children.sort((x,y)=>{
                                                    if(y.presaleDate > x.presaleDate){
                                                        return 1
                                                    }else{
                                                        return -1
                                                    }
                                                })
                                                this.presaleSubDetailList[index].presaleDate = this.presaleSubDetailList[index].children[0].presaleDate;
                                            }
                                        })
                                        this.$set(this,'presaleSubDetailList',[...this.presaleSubDetailList])
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '下单数',
                        key: 'num',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '预售百分比%',
                        key: 'presalePercent',
                        align: 'center',
                        minWidth: 120,
                        render:(h,params)=>{
                            if(this.type == 'detail') {
                                return h('span',(params.row.presalePercent));
                            }
                            return h('Input',{
                                props: {
                                    type: 'text',
                                    value: this.list.presaleSuborderList[params.index].presalePercent,
                                    size: 'small'
                                },
                                on: {
                                    'on-blur': (event) => {
                                        this.list.presaleSuborderList[params.index].presalePercent = event.target.value;
                                        var reg = /^(0|[1-9]\d*)/;
                                        if(!reg.test(event.target.value)){
                                            this.$Message.warning('请输入数字！');
                                            this.list.presaleSuborderList[params.index].presalePercent = 0;
                                        }else{
                                            if(event.target.value > 100){
                                                this.$Message.warning('输入值不能超100');                  
                                                this.list.presaleSuborderList[params.index].presalePercent = 0;                                                                              
                                            }else{
                                                this.list.presaleSuborderList[params.index].presalePercent = event.target.value;
                                            }
                                        }
                                        this.$set(this.list.presaleSuborderList,params.index,this.list.presaleSuborderList[params.index])

                                        let presalePercent = this.list.presaleSuborderList[params.index].presalePercent;


                                        this.list.presaleSuborderList[params.index].residuePresaleSum = Math.floor((presalePercent / 100) * params.row.num - params.row.instockNum - (params.row.preOrders + params.row.unPay));
                                        this.list.presaleSuborderList[params.index].presaleSum = Math.floor(presalePercent / 100 * params.row.num);
                                        this.presaleSubDetailList.map((x,y)=>{
                                            if(x.hasOwnProperty('children')){
                                                this.presaleSubDetailList[y].residuePresaleSum = 0;                                                
                                                x.children.map((k,j)=>{
                                                    if(k.orderNo == params.row.orderNo){
                                                        let residuePresaleSum = Math.floor((presalePercent / 100) * k.num - k.instockNum - (k.preOrders + k.unPay));
                                                        this.presaleSubDetailList[y].children[j].residuePresaleSum = residuePresaleSum;
                                                        this.presaleSubDetailList[y].children[j].presaleSum = Math.floor(presalePercent / 100 * k.num);
                                                    }
                                                    this.presaleSubDetailList[y].residuePresaleSum += k.residuePresaleSum;
                                                })
                                            }else{
                                                let residuePresaleSum = Math.floor((presalePercent / 100) * x.num - x.instockNum - (x.preOrders + x.unPay));
                                                this.presaleSubDetailList[y].residuePresaleSum = residuePresaleSum;
                                                this.presaleSubDetailList[y].presaleSum = Math.floor(presalePercent / 100 * x.num);
                                            }
                                        })
                                        this.list.presaleSum = 0;
                                        this.list.residuePresaleSum = 0;
                                        this.list.presaleSuborderList.map(x=>{
                                            this.list.presaleSum += x.presaleSum;
                                            this.list.residuePresaleSum += x.residuePresaleSum;
                                        })
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '总可预售数',
                        key: 'presaleSum',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '入库数',
                        key: 'instockNum',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '未入库数',
                        key: 'unInstockNum',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '剩余可预售数',
                        key: 'residuePresaleSum',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        fixed: 'left',                        
                        minWidth: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '该行将会删除，请确认！',
                                                onOk: () => {
                                                    this.delete_presaleSuborderList.push(this.list.presaleSuborderList[params.index]);
                                                    this.list.presaleSuborderList.splice(params.index,1);
                                                    let presaleSubDetailList = Util.deepClone(this.presaleSubDetailList);
                                                    let index = [];
                                                    this.presaleSubDetailList.map((x,y)=>{
                                                        if(x.hasOwnProperty('children')){
                                                            let index = [];
                                                            x.children.map((k,j)=>{
                                                                if(k.orderNo == params.row.orderNo){
                                                                    this.delete_presaleSubDetailList.push(k);
                                                                    index.push(j);
                                                                }
                                                            })
                                                            index = index.sort((val,nextVal)=>{
                                                                return nextVal - val
                                                            })
                                                            index.map((item,index)=>{
                                                                presaleSubDetailList[y].children.splice(item,1);
                                                            })
                                                        }else{
                                                            if(x.orderNo == params.row.orderNo){
                                                                this.delete_presaleSubDetailList.push(x);
                                                            }
                                                        }
                                                    })
                                                    presaleSubDetailList = presaleSubDetailList.filter((x,y)=>{
                                                        if(x.hasOwnProperty('children')){
                                                            presaleSubDetailList[y].presaleSum = 0;
                                                            presaleSubDetailList[y].instockNum = 0;
                                                            presaleSubDetailList[y].unInstockNum = 0;
                                                            presaleSubDetailList[y].residuePresaleSum = 0;
                                                            presaleSubDetailList[y].num = 0;
                                                            presaleSubDetailList[y].children.map(x=>{
                                                                presaleSubDetailList[y].presaleSum += x.presaleSum;
                                                                presaleSubDetailList[y].instockNum += x.instockNum;
                                                                presaleSubDetailList[y].unInstockNum += x.unInstockNum;
                                                                presaleSubDetailList[y].residuePresaleSum += x.residuePresaleSum;
                                                                presaleSubDetailList[y].num += x.num;
                                                            })
                                                            return x.children.length > 0;
                                                        }else{
                                                            return x.orderNo != params.row.orderNo;
                                                        }
                                                    })
                                                    let data = [];
                                                    presaleSubDetailList.map(x=>{
                                                        if(x.hasOwnProperty('children')){
                                                            x.children.map(y=>{
                                                                data.push(y)
                                                            })
                                                        }else{
                                                            data.push(x)
                                                        }
                                                    })
                                                    presaleSubDetailList = this.filterPresaleSubDetail(data);
                                                    this.$set(this,'presaleSubDetailList',[...presaleSubDetailList]);
                                                },
                                                onCancel: () => {
                                                    this.$Message.warning('已取消删除');
                                                }
                                            })
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ],
                presaleSubDetail_columns:[
                    {
                        title: '货品编码',
                        key: 'goodsNo',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '商品编码',
                        key: 'specNo',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '货品名称',
                        key: 'goodsName',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '生产单号',
                        key: 'orderNo',
                        align: 'center',
                        minWidth: 120,
                        render:(h,params)=>{
                            return h(orderNo_template,{
                                props: {
                                    params:params
                                }
                            })
                        }
                    },
                    {
                        title: '规格名称',
                        key: 'specName',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '预售日期',
                        key: 'presaleDate',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '现货库存',
                        key: 'usefulStock',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '下单数',
                        key: 'num',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '总可预售数',
                        key: 'presaleSum',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '入库数',
                        key: 'instockNum',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '未入库数',
                        key: 'unInstockNum',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '剩余可预售数',
                        key: 'residuePresaleSum',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        fixed: 'left',                        
                        minWidth: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                    },
                                    on: {
                                        click: () => {
                                            if(params.row.hasOwnProperty("children")){
                                                this.modal_visible = true;
                                                this.detail_Data = params.row.children;
                                            }else{
                                                this.$Modal.confirm({
                                                    title: '提示',
                                                    content: '该行将会删除，请确认！',
                                                    onOk: () => {
                                                        if(!this.modal_visible){
                                                            this.delete_presaleSubDetailList.push(this.presaleSubDetailList[params.index]);
                                                            this.presaleSubDetailList.splice(params.index,1);
                                                            let exists = this.presaleSubDetailList.filter(x=>{
                                                                return x.orderNo == params.row.orderNo;
                                                            })
                                                            if(exists.length ==0){
                                                                this.list.presaleSuborderList = this.list.presaleSuborderList.filter((x,y)=>{
                                                                    if(x.orderNo == params.row.orderNo){
                                                                        this.delete_presaleSuborderList.push(x);
                                                                    }
                                                                    return x.orderNo != params.row.orderNo
                                                                })
                                                            }
                                                        }else{
                                                            let presaleSubDetailList = Util.deepClone(this.presaleSubDetailList);
                                                            this.delete_presaleSubDetailList.push(this.detail_Data[params.index]);                                                         
                                                            this.detail_Data.splice(params.index,1);
                                                            let data = [];
                                                            presaleSubDetailList.map((x,y)=>{
                                                                if(x.hasOwnProperty('children')){
                                                                    x.children.map( (k,j) => {
                                                                        if(k.specNo != params.row.specNo && k.orderNo == params.row.orderNo){
                                                                            data.push(k);
                                                                        }else if(k.specNo == params.row.specNo && k.orderNo == params.row.orderNo){
                                                                            presaleSubDetailList[y].children.splice(params.index,1);
                                                                            presaleSubDetailList[y].presaleSum = 0;
                                                                            presaleSubDetailList[y].instockNum = 0;
                                                                            presaleSubDetailList[y].unInstockNum = 0;
                                                                            presaleSubDetailList[y].residuePresaleSum = 0;
                                                                            presaleSubDetailList[y].num = 0;
                                                                            presaleSubDetailList[y].orderNo = '';
                                                                            presaleSubDetailList[y].children.map(x=>{
                                                                                presaleSubDetailList[y].presaleSum += x.presaleSum;
                                                                                presaleSubDetailList[y].instockNum += x.instockNum;
                                                                                presaleSubDetailList[y].unInstockNum += x.unInstockNum;
                                                                                presaleSubDetailList[y].residuePresaleSum += x.residuePresaleSum;
                                                                                presaleSubDetailList[y].num += x.num;
                                                                                presaleSubDetailList[y].orderNo += ',' + x.orderNo;
                                                                            })
                                                                            if(presaleSubDetailList[y].orderNo.indexOf(',') == 0){
                                                                                presaleSubDetailList[y].orderNo = presaleSubDetailList[y].orderNo.substr(1,presaleSubDetailList[y].orderNo.length);
                                                                            }
                                                                        }
                                                                    })
                                                                    if(presaleSubDetailList[y].children.length == 0){
                                                                        presaleSubDetailList.splice(y,1);
                                                                        this.modal_visible = false;
                                                                    }
                                                                }else{
                                                                    data.push(x);
                                                                }

                                                            })
                                                            presaleSubDetailList = this.filterPresaleSubDetail(presaleSubDetailList);
                                                            this.$set(this,'presaleSubDetailList',[...presaleSubDetailList]);                                                                    

                                                            if(data.length == 0){
                                                                this.list.presaleSuborderList = this.list.presaleSuborderList.filter(x=>{
                                                                    if(x.orderNo == params.row.orderNo){
                                                                        this.delete_presaleSuborderList.push(x);
                                                                    }
                                                                    return x.orderNo != params.row.orderNo;
                                                                })
                                                            }
                                                        }
                                                    },
                                                    onCancel: () => {
                                                        this.$Message.warning('已取消删除');
                                                    }
                                                })
                                            }
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ],
                presaleSubDetailList:[],
                delete_presaleSuborderList:[],
                delete_presaleSubDetailList:[],
                params:{},                          //列表页面通过路由传的参数
                add_presaleSuborderNo:[],
                modal_visible:false,
                addDetail_Form:{
                    orderNo:'',
                    specNo:[]
                },
                filter_presaleSubDetailList:[],
                userInfo:{},
                presaleStatusList:[
                    {
                        value:'草稿',
                        code:'100'
                    },
                    {
                        value:'预售中',
                        code:'300'
                    },
                    {
                        value:'预售结束',
                        code:'800'
                    },
                    {
                        value:'预售取消',
                        code:'950'
                    }
                ],
                errorCodeList:[
                    {
                        code:'7',
                        value:'生产单取消'
                    },
                    {
                        code:'6',
                        value:'数量变更'
                    },
                    {
                        code:'5',
                        value:'货期延迟'
                    },
                    {
                        code:'4',
                        value:'货品到货'
                    },
                    {
                        code:'3',
                        value:'库存预警'
                    },
                    {
                        code:'2',
                        value:'库存充足'
                    },
                    {
                        code:'1',
                        value:'预售到期'
                    },
                    {
                        code:'0',
                        value:'货期提前'
                    }
                ],
            }
        },
        props:['type'],
        activated(){
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            if(this.type == 'detail'){
                this.presaleSuborder_columns = this.presaleSuborder_columns.filter(x=>{
                    return x.key != 'operation'
                })
                this.presaleSubDetail_columns = this.presaleSubDetail_columns.filter(x=>{
                    return x.key != 'operation'
                })
            }
            this.params = this.$route.params;
            this.list = {};
            this.presaleSubDetailList = []; 
            this.delete_presaleSuborderList = [];
            this.delete_presaleSubDetailList = []; 
            this.get_presale_pool_detail();
        },
        methods:{
            get_shop_by_platfromno(value){
                this.request('get_shop_by_platfromno',{
                    data:{
                        platfromGoodsNo:value
                    }
                },true).then(res=>{
                    if(res.code == 1){
                        this.list.shopName = res.data.shopName;
                        this.list.shopId = res.data.shopId;
                    }
                })
            },
            get_presale_pool_detail(){
                this.request('get_presale_pool_detail',{
                    data:this.params
                },true).then(res=>{
                    if(res.code == 1){
                        this.list = res.data;
                        this.platfromGoodsNo_List = [];
                        if(this.list.hasOwnProperty('presaleSuborderList')){
                            if(!!res.data.platfromGoodsNo){
                                res.data.platfromGoodsNo.split(',').map(x=>{
                                    this.platfromGoodsNo_List.push({value:x});
                                })
                            }
                            if(this.platfromGoodsNo_List.length == 1){
                                this.$set(this.list,'platfromGoodsNo',this.platfromGoodsNo_List[0].value);
                                this.get_shop_by_platfromno(this.platfromGoodsNo_List[0].value);
                            }
                            this.list.presalesStatus = Util.conversionStatus(this.presaleStatusList,'code',this.list.presalesStatus);
                            this.list.errorCode = Util.conversionStatus(this.errorCodeList,'code',this.list.errorCode);
                            this.list.presaleSuborderList.map(x=>{
                                x.presalePercent = x.presalePercent * 100;
                                this.presaleSubDetailList = this.presaleSubDetailList.concat(x.presaleSubDetailList)
                            })
                            this.presaleSubDetailList = this.filterPresaleSubDetail(this.presaleSubDetailList)                            
                        }
                    }
                })
            },
            filterPresaleSubDetail(data){
                let filterData = data.reduce((orderList,item)=>{
                    let flag = true;                                
                    for(let [x,y] of orderList.entries()){
                        if(item.specNo == y.specNo){
                            if(!orderList[x].hasOwnProperty('children')){
                                let data = Util.deepClone(orderList[x]);
                                orderList[x].children = [];
                                orderList[x].children.push(data);
                            }
                            orderList[x].orderNo += `,${item.orderNo}`;
                            orderList[x].num += item.num;
                            orderList[x].presaleSum += item.presaleSum;
                            orderList[x].instockNum += item.instockNum;
                            orderList[x].unInstockNum += item.unInstockNum;
                            orderList[x].residuePresaleSum += item.residuePresaleSum;
                            orderList[x].children.push(item);
                            flag = false;
                        }
                    }
                    if(flag){
                        orderList.push(item);
                    }
                    return orderList
                },[]);

                filterData.map((x,index)=>{
                    if(x.hasOwnProperty('children')){
                        filterData[index].children = x.children.sort((x,y)=>{
                            if(y.presaleDate > x.presaleDate){
                                return 1
                            }else{
                                return -1
                            }
                        })
                        filterData[index].presaleDate = filterData[index].children[0].presaleDate;
                    }
                })

                return filterData;
            },
            add_presaleSuborder(){
                this.add_presaleSuborderNo = [];
                this.$Modal.confirm({
                    title: '添加生产单',
                    render:(h) => {
                        return h('Select', {
                            props:{
                                value: this.add_presaleSuborderNo,
                                multiple:true
                            },
                            style: {
                                marginTop:'10px'  
                            },
                            on: {
                                'on-change':(value) => {
                                    this.add_presaleSuborderNo = value;                                    
                                }
                            },
                        },
                            this.delete_presaleSuborderList.map(function(item){
                                return h('Option', {
                                    props: {value: item.orderNo}
                                }, item.orderNo);
                            })
                        );
                    },
                    onOk: () => {
                        let temp_order_index = [];
                        this.add_presaleSuborderNo.map((x,y)=>{
                            this.delete_presaleSuborderList.map((k,z)=>{
                                if(x == k.orderNo){
                                    this.list.presaleSuborderList.push(k);
                                    temp_order_index.push(z);
                                }
                            })
                        })                        
                        temp_order_index = temp_order_index.sort((x,y)=>{
                            return y - x
                        })
                        temp_order_index.map(x=>{
                            this.delete_presaleSuborderList.splice(x,1)
                        })


                        let temp_detail_index = [];
                        this.add_presaleSuborderNo.map((x,y)=>{
                            this.delete_presaleSubDetailList.map((k,z)=>{
                                if(x == k.orderNo){
                                    this.presaleSubDetailList.push(k);
                                    temp_detail_index.push(z);
                                }
                            })
                        })                        
                        temp_detail_index = temp_detail_index.sort((x,y)=>{
                            return y - x
                        })
                        temp_detail_index.map(x=>{
                            this.delete_presaleSubDetailList.splice(x,1)
                        })

                        this.presaleSubDetailList = this.filterPresaleSubDetail(this.presaleSubDetailList)
                    },
                    onCancel: () => {
                        this.$Message.warning('已取消添加');
                    }
                })
            },
            update_presaleSuborder(){
                this.request('get_presale_pool_detail',{
                    data:this.params
                },true).then(res=>{
                    if(res.code == 1){
                        this.list.presaleSuborderList.map((x,y)=>{
                            res.data.presaleSuborderList.map((k,j)=>{
                                k.presalePercent = Math.floor(k.presalePercent * 100);                                
                                if(x.orderNo == k.orderNo){
                                    this.list.presaleSuborderList[y] = k
                                }
                            })
                        })
                        this.$set(this.list,'presaleSuborderList',[...this.list.presaleSuborderList])
                        let presaleSubDetailList = [];
                        this.list.presaleSuborderList.map(x=>{
                            presaleSubDetailList = presaleSubDetailList.concat(x.presaleSubDetailList)
                        })

                        let temp = [];
                        this.presaleSubDetailList.map(x=>{
                            if(x.hasOwnProperty('children')){
                                x.children.map(y=>{
                                    temp.push(y)
                                })
                            }else{
                                temp.push(x)
                            }
                        })

                        let data = [];
                        temp.map(x=>{
                            presaleSubDetailList.map(y=>{
                                if(x.orderNo == y.orderNo && x.specNo == y.specNo){
                                    data.push(y);
                                }
                            })
                        })
                        this.presaleSubDetailList = this.filterPresaleSubDetail(data);
                    }
                })
            },
            add_presaleSubDetail(){
                this.add_detail_visible = true;
                this.addDetail_Form.orderNo = '';
                this.addDetail_Form.specNo = [];
            },
            open_goods_page(){
                if(!this.list.platfromGoodsNo){
                    this.$Message.warning('请先选择平台ID！');
                    return;
                } 
                window.open(`https://item.taobao.com/item.htm?id=${this.list.platfromGoodsNo}`)
            },
            changeOrder(val){
                this.addDetail_Form.specNo = [];
                this.filter_presaleSubDetailList = this.delete_presaleSubDetailList.filter(x=>{
                    return x.orderNo == val;
                })
                this.filter_presaleSubDetailList = this.filter_presaleSubDetailList.reduce((item,nextVal)=>{
                    let flag = true;
                    for(let x of item){
                        if(x.specNo == nextVal.specNo){
                            flag = false;
                            break;
                        }
                    }
                    if(flag){
                        item.push(nextVal)
                    }
                    return item;
                },[])
            },
            cancel(){
                this.addDetail_Form.orderNo = '';
                this.addDetail_Form.specNo = [];
                this.add_detail_visible = false;
            },
            addDetail(){
                let presaleSubDetailList = [];
                if(!this.addDetail_Form.orderNo){
                    return this.$Message.warning('请选择生产单号！');
                }
                if(this.addDetail_Form.specNo.length == 0){
                    return this.$Message.warning('请选择商品明细！');
                }
                let detailData = [],index = [];
                this.delete_presaleSubDetailList.map((x,k)=>{
                    this.addDetail_Form.specNo.map(y=>{
                        if(x.specNo == y && x.orderNo == this.addDetail_Form.orderNo){
                            index.push(k);
                            detailData.push(x);
                            presaleSubDetailList.push(x);
                        }
                    })
                })
                index = index.sort((x,y)=>{
                    return y - x;
                })
                index.map(x=>{
                    this.delete_presaleSubDetailList.splice(x,1);
                })
                
                this.presaleSubDetailList.map(x=>{
                    if(x.hasOwnProperty('children')){
                        x.children.map(y=>{
                            presaleSubDetailList.push(y)
                        })
                    }else{
                        presaleSubDetailList.push(x)
                    }
                })
                presaleSubDetailList.push()
                this.presaleSubDetailList = this.filterPresaleSubDetail(presaleSubDetailList);
                this.add_detail_visible = false;
            },
            submit(type){
                let data = Util.deepClone(this.list);
                if(!this.list.platfromGoodsNo){
                    this.$Message.warning('请选择平台货品ID！');
                    return false;
                }
                let presaleSubDetailList = [];
                let flag = false;
                
                this.presaleSubDetailList.map(x=>{
                    if(x.hasOwnProperty('children')){
                        x.children.map(y=>{
                            if(y.residuePresaleSum <= 0){
                                flag = true;
                                return false;
                            }
                            presaleSubDetailList.push(y)
                        })
                    }else{
                        if(x.residuePresaleSum <= 0){
                            flag = true;                            
                            return false;
                        }
                        presaleSubDetailList.push(x)
                    }
                })
                if(flag){
                    this.$Message.warning('剩余可售数存在小于等于0，请检查！')
                    return false;
                }

                data.presaleSuborderList.map(x=>{
                    x.presalePercent = x.presalePercent / 100;
                    x.presaleSubDetailList = [];
                    presaleSubDetailList.map(y=>{
                        if(x.orderNo == y.orderNo){
                            x.presaleSubDetailList.push(y)
                        }
                    })
                })
                
                data.createUser = this.userInfo.userAccount;
                data.presalesStatus = Util.conversionStatus(this.presaleStatusList,'value',this.list.presalesStatus);
                data.errorCode = Util.conversionStatus(this.errorCodeList,'value',this.list.errorCode);
                if(type == 'submit'){
                    data.presalesStatus = 300;
                    this.$Modal.confirm({
                        title: '提示',
                        content: '是否已更新平台货品信息、发货日期和商品库存！',
                        onOk: () => {
                            this.request('submit_presale_order',{
                                data:data
                            },'提交中...').then(res=>{
                                if(res.code == 1){
                                    this.$Message.success(res.msg);
                                    this.$root.eventHub.$emit('closePageFromOtherPage', 'presale_pool_add'); //关闭新增页面
                                    this.$root.eventHub.$emit('refush_presale_pool_list');
                                }
                            })
                        },
                        onCancel: () => {
                            this.$Message.warning('已取消操作');
                        }
                    })
                }else if(type == 'save'){
                    data.presalesStatus = 100;
                    this.request('submit_presale_order',{
                            data:data
                        },'保存中...').then(res=>{
                            if(res.code == 1){
                                this.$Message.success(res.msg);
                                this.$root.eventHub.$emit('closePageFromOtherPage', 'presale_pool_add'); //关闭新增页面
                                this.$root.eventHub.$emit('refush_presale_pool_list');
                            }
                        })
                }
            },
            closePage(){
                this.$root.eventHub.$emit('closePageFromOtherPage', 'presale_pool_add'); //关闭新增页面
            }
        }
    }
</script>

<style>
    #presale_pool_add .ivu-card-body{
        padding: 16px 16px 4px 16px;
    }
    #presale_pool_add .ivu-form-item{
        margin-bottom: 12px !important;
    }
</style>
