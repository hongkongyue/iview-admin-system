<template>
    <div class="background-color-white exhibition" id="parameter">
        <Row class="margin-top-10">
            <Tabs type="card" @on-click="tabClick" :value="activeTable"  style="padding-bottom:50px">
                <TabPane label="包材费" name="Pack">
                    <Pack :brandList='brandList' :modalBrandList='modalBrandList'></Pack>
                </TabPane>
                <TabPane label="快递费" name="Express">
                    <Express :brandList='brandList' :modalBrandList='modalBrandList'></Express>
                </TabPane>
                <TabPane label="税率" name="taxRate">
                    <taxRate :brandList='brandList' :modalBrandList='modalBrandList'></taxRate>
                </TabPane>
                <TabPane label="短信费" name="Message">
                    <Message :brandList='brandList' :modalBrandList='modalBrandList'></Message>
                </TabPane>
                <TabPane label='看板参数' name="board">
                    <board :brandList='brandList'></board>   
                </TabPane>
                <TabPane label='销售参数' name="sales">
                    <sales :brandList='brandList'></sales>
                </TabPane>
            </Tabs>
        </Row>
    </div>
</template>

<script>
    import Express from './template/Express';
    import Message from './template/Message';
    import Pack from './template/Pack';
    import taxRate from './template/taxRate';
    import board from './template/board';
    import Util from 'libs/util';
    import sales from './template/sales'
    
    export default {
        name:'parameter',
        data(){
            return {
                activeTable:'',
                brandList:[],
                modalBrandList:[]
            }
        },
        computed:{

        },
        mounted(){
           this.getBrandList(); 
        },
        methods:{
            getBrandList() {
                this.request('bi_brand_list', {
                    ver: '1',
                    ts: Date.parse(new Date()),
                    sign: '',
                    data: {}
                }, false).then((res) => {
                    this.brandList = res.data;
                    this.brandList = this.brandList.filter(x=>{
                        return x.id != '51594' && x.id != '51609'
                    })
                    this.modalBrandList = Util.deepClone(this.brandList);
                    this.brandList.unshift({
                        id:0,
                        brands:'所有品牌'
                    })
                })
            },
        },
        components:{
            Express,
            Message,
            Pack,
            taxRate,
            board,
            sales
        }
    }
</script>

<style lang="css">
    
</style>

