<template >
    <div style="min-width:1200px">
        
        <Row class="margin-bottom-10 background-color-white exhibition" style="font-size:20px;font-weight:bold"> 
            <div style="margin-bottom :20px; height:50px;background-color:#f5f7f9;text-align:left;line-height:50px;font-size:16px; font-weight: bold;padding-left: 20px;">
                    {{this.$route.query.brandName}} / {{this.$route.query.projectCode == '0' ? '外拍任务流' : '静物任务流'}} / {{this.$route.query.taskCode}}
                    </div>
        </Row>
        <!-- <div></div> -->
        <!-- <Icon type="md-checkmark-circle" size="18" />
        <Button type="primary">催办</Button> <Icon  type="md-checkmark" /> -->
        <div v-if="this.$route.query.projectCode == '0'">
        <div class="ListData1" style="display:flex;flex-wrap:wrap;width:200px;z-index:110;">
            <div  v-for="(item,index) in ListData1" :key="index" style="padding-top:5px;width:50%"  >
                <div >
                    <div style="width:36px;display: inline-block;">{{item}}</div>
                    <Icon v-if="processor1 == 900" type="md-checkmark-circle" size="18" />
                    <Button v-if="processor1 == 400" type="primary" size="small" style="margin-left:2px" @click="handleClick(item,taskName1)">催办</Button>
                    <!-- <Button size="small" type="primary" @click="handleClick(item.value)">催办</Button> -->
                </div>
            </div> 
        </div>

        <div class="ListData2" style="display:flex;flex-wrap:wrap;width:200px;z-index:100;">
            <div  v-for="(item,index) in ListData2" :key="index" style="padding-top:5px;width:50%"  >
                <div >
                    <div style="width:36px;display: inline-block;">{{item}}</div>
                    <Icon v-if="processor2 == 900" type="md-checkmark-circle" size="18" />
                    <Button v-if="processor2 == 400" type="primary" size="small" style="margin-left:2px" @click="handleClick(item,taskName2)">催办</Button>
                    <!-- <Button size="small" type="primary" @click="handleClick(item.value)">催办</Button> -->
                </div>
            </div> 
        </div>

        <div class="ListData3" style="display:flex;flex-wrap:wrap;width:200px;z-index:100;">
            <div  v-for="(item,index) in ListData3" :key="index" style="padding-top:5px;width:50%"  >
                <div >
                    <div style="width:36px;display: inline-block;">{{item}}</div>
                    <Icon v-if="processor3 == 900" type="md-checkmark-circle" size="18" />
                    <Button v-if="processor3 == 400" type="primary" size="small" style="margin-left:2px"   @click="handleClick(item,taskName3)">催办</Button>
                    <!-- <Button size="small" type="primary" @click="handleClick(item.value)">催办</Button> -->
                </div>
            </div> 
        </div>

        <div class="ListData4" style="display:flex;flex-wrap:wrap;width:200px;z-index:100;">
            <div  v-for="(item,index) in ListData4" :key="index" style="padding-top:5px;width:50%"  >
                <div >
                    <div style="width:36px;display: inline-block;">{{item}}</div>
                    <Icon v-if="processor4 == 900" type="md-checkmark-circle" size="18" />
                    <Button v-if="processor4 == 400" type="primary" size="small" style="margin-left:2px"  @click="handleClick(item,taskName4)">催办</Button>
                    <!-- <Button size="small" type="primary" @click="handleClick(item.value)">催办</Button> -->
                </div>
            </div> 
        </div>

        <div class="ListData5" style="display:flex;flex-wrap:wrap;width:200px;z-index:100;">
            <div  v-for="(item,index) in ListData5" :key="index" style="padding-top:5px;width:50%"  >
                <div >
                    <div style="width:36px;display: inline-block;">{{item}}</div>
                    <Icon v-if="processor5 == 900" type="md-checkmark-circle" size="18" />
                    <Button v-if="processor5 == 400" type="primary" size="small" style="margin-left:2px"  @click="handleClick(item,taskName5)">催办</Button>
                    <!-- <Button size="small" type="primary" @click="handleClick(item.value)">催办</Button> -->
                </div>
            </div> 
        </div>

        <div class="ListData6" style="display:flex;flex-wrap:wrap;width:200px;z-index:100;">
            <div  v-for="(item,index) in ListData6" :key="index" style="padding-top:5px;width:50%"  >
                <div >
                    <div style="width:36px;display: inline-block;">{{item}}</div>
                    <Icon v-if="processor6 == 900" type="md-checkmark-circle" size="18" />
                    <Button v-if="processor6 == 400" type="primary" size="small" style="margin-left:2px"  @click="handleClick(item,taskName6)">催办</Button>
                    <!-- <Button size="small" type="primary" @click="handleClick(item.value)">催办</Button> -->
                </div>
            </div> 
        </div>

        <div class="ListData7" style="display:flex;flex-wrap:wrap;width:200px;z-index:100;">
            <div  v-for="(item,index) in ListData7" :key="index" style="padding-top:5px;width:50%"  >
                <div >
                    <div style="width:36px;display: inline-block;">{{item}}</div>
                    <Icon v-if="processor7 == 900" type="md-checkmark-circle" size="18" />
                    <Button v-if="processor7 == 400" type="primary" size="small" style="margin-left:2px"  @click="handleClick(item,taskName7)">催办</Button>
                    <!-- <Button size="small" type="primary" @click="handleClick(item.value)">催办</Button> -->
                </div>
            </div> 
        </div>

        <div class="ListData8" style="display:flex;flex-wrap:wrap;width:200px;z-index:100;">
            <div  v-for="(item,index) in ListData8" :key="index" style="padding-top:5px;width:50%"  >
                <div >
                    <div style="width:36px;display: inline-block;">{{item}}</div>
                    <Icon v-if="processor8 == 900" type="md-checkmark-circle" size="18" />
                    <Button v-if="processor8 == 400" type="primary" size="small" style="margin-left:2px"  @click="handleClick(item,taskName8)">催办</Button>
                    <!-- <Button size="small" type="primary" @click="handleClick(item.value)">催办</Button> -->
                </div>
            </div> 
        </div>

        <div class="ListData9" style="display:flex;flex-wrap:wrap;width:200px;z-index:100;">
            <div  v-for="(item,index) in ListData9" :key="index" style="padding-top:5px;width:50%"  >
                <div >
                    <div style="width:36px;display: inline-block;">{{item}}</div>
                    <Icon v-if="processor9 == 900" type="md-checkmark-circle" size="18" />
                    <Button v-if="processor9 == 400" type="primary" size="small" style="margin-left:2px"  @click="handleClick(item,taskName9)">催办</Button>
                    <!-- <Button size="small" type="primary" @click="handleClick(item.value)">催办</Button> -->
                </div>
            </div> 
        </div>

        <div class="ListData10" style="display:flex;flex-wrap:wrap;width:200px;z-index:100;">
            <div  v-for="(item,index) in ListData10" :key="index" style="padding-top:5px;width:50%"  >
                <div >
                    <div style="width:36px;display: inline-block;">{{item}}</div>
                    <Icon v-if="processor10 == 900" type="md-checkmark-circle" size="18" />
                    <Button v-if="processor10 == 400" type="primary" size="small"  @click="handleClick(item,taskName10)">催办</Button>
                    <!-- <Button size="small" type="primary" @click="handleClick(item.value)">催办</Button> -->
                </div>
            </div> 
        </div>
        </div>
        <!-- <div>fsd</div> -->
        <div v-if="this.$route.query.projectCode == '1'">
            <div class="ListData11" style="display:flex;flex-wrap:wrap;width:200px;z-index:110;">
            <div  v-for="(item,index) in ListData11" :key="index" style="padding-top:5px;width:50%"  >
                <div >
                    <div style="width:36px;display: inline-block;">{{item}}</div>
                    <Icon v-if="processor11 == 900" type="md-checkmark-circle" size="18" />
                    <Button v-if="processor11 == 400" type="primary" size="small" style="margin-left:2px" @click="handleClick(item,taskName11)">催办</Button>
                    <!-- <Button size="small" type="primary" @click="handleClick(item.value)">催办</Button> -->
                </div>
            </div> 
        </div>

        <div class="ListData12" style="display:flex;flex-wrap:wrap;width:200px;z-index:100;">
            <div  v-for="(item,index) in ListData12" :key="index" style="padding-top:5px;width:50%"  >
                <div >
                    <div style="width:36px;display: inline-block;">{{item}}</div>
                    <Icon v-if="processor12 == 900" type="md-checkmark-circle" size="18" />
                    <Button v-if="processor12 == 400" type="primary" size="small" style="margin-left:2px" @click="handleClick(item,taskName12)">催办</Button>
                    <!-- <Button size="small" type="primary" @click="handleClick(item.value)">催办</Button> -->
                </div>
            </div> 
        </div>

        <div class="ListData13" style="display:flex;flex-wrap:wrap;width:200px;z-index:100;">
            <div  v-for="(item,index) in ListData13" :key="index" style="padding-top:5px;width:50%"  >
                <div >
                    <div style="width:36px;display: inline-block;">{{item}}</div>
                    <Icon v-if="processor13 == 900" type="md-checkmark-circle" size="18" />
                    <Button v-if="processor13 == 400" type="primary" size="small" style="margin-left:2px"  @click="handleClick(item,taskName13)">催办</Button>
                    <!-- <Button size="small" type="primary" @click="handleClick(item.value)">催办</Button> -->
                </div>
            </div> 
        </div>

        <div class="ListData14" style="display:flex;flex-wrap:wrap;width:200px;z-index:100;">
            <div  v-for="(item,index) in ListData14" :key="index" style="padding-top:5px;width:50%"  >
                <div >
                    <div style="width:36px;display: inline-block;">{{item}}</div>
                    <Icon v-if="processor14 == 900" type="md-checkmark-circle" size="18" />
                    <Button v-if="processor14 == 400" type="primary" size="small" style="margin-left:2px"  @click="handleClick(item,taskName14)">催办</Button>
                    <!-- <Button size="small" type="primary" @click="handleClick(item.value)">催办</Button> -->
                </div>
            </div> 
        </div>

        </div>

   <!-- 外拍任务流  -->
<div v-if="this.$route.query.projectCode == '0'">
<!-- 第一层 -->
<svg class="line1" xmlns="http://www.w3.org/2000/svg" version="1.1">

  <line x1="60" y1="30" x2="60" y2="260"
  style="stroke:rgb(0,0,0);stroke-width:2"/> 
  
</svg>
<svg class="line2" xmlns="http://www.w3.org/2000/svg" version="1.1">

  <line x1="60" y1="1" x2="200" y2="1"
  style="stroke:rgb(0,0,0);stroke-width:2"/>
  
</svg>
<svg class="svgup1" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect width="120" height="60" :class="this.processor3Status"
  />
  <a target="_blank">
            <text x="20" y="35" fill="black">外拍视频拍摄</text>
        </a>
  <line x1="120" y1="30" x2="290" y2="30"
  style="stroke:rgb(0,0,0);stroke-width:2"/>
<!-- 
  <line x1="60" y1="60" x2="60" y2="260"
  style="stroke:rgb(255,0,0);stroke-width:2"/> -->
  
</svg>


<svg class="svgup2" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect width="120" height="60" :class="this.processor4Status"
  />
  <a target="_blank">
            <text x="40" y="35" fill="black">选视频</text>
        </a>
  <line x1="120" y1="30" x2="300" y2="30"
  style="stroke:rgb(0,0,0);stroke-width:2"/>
  
</svg>

<svg class="svgup3" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect width="120" height="60" :class="this.processor5Status"
  />
  <a target="_blank">
            <text x="45" y="35" fill="black">剪辑</text>
        </a>
  <line x1="120" y1="30" x2="260" y2="30"
  style="stroke:rgb(0,0,0);stroke-width:2"/>

  <line x1="260" y1="30" x2="260" y2="230"
  style="stroke:rgb(0,0,0);stroke-width:2"/>
  
</svg>
<!-- 第二层 -->
       <svg class="svg" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect width="120" height="60" :class="this.processor1Status"
  />
  <a target="_blank">
            <text x="20" y="35" fill="black">调整拍摄报表</text>
        </a>
  <line x1="120" y1="30" x2="200" y2="30"
  style="stroke:rgb(0,0,0);stroke-width:2"/>
  
</svg>



<svg class="svg1" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect width="120" height="60" :class="this.processor2Status"
  />
  <a target="_blank">
            <text x="35" y="35" fill="black">拍摄方案</text>
        </a>
  <line x1="120" y1="30" x2="200" y2="30"
  style="stroke:rgb(0,0,0);stroke-width:2"/>

  <line x1="60" y1="60" x2="60" y2="230"
  style="stroke:rgb(0,0,0);stroke-width:2"/>
</svg>

<svg class="svg2" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect width="120" height="60" :class="this.processor6Status"
  />
  <a target="_blank">
            <text x="25" y="35" fill="black">外拍图片拍摄</text>
        </a>
  <line x1="120" y1="30" x2="200" y2="30"
  style="stroke:rgb(0,0,0);stroke-width:2"/> -->
</svg>

<svg class="svg3" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect width="120" height="60" :class="this.processor7Status"
  />
  <a target="_blank">
            <text x="30" y="35" fill="black">选外拍图片</text>
        </a>
  <line x1="120" y1="30" x2="200" y2="30"
  style="stroke:rgb(0,0,0);stroke-width:2"/>

  
</svg>

<svg class="svg4" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect width="120" height="60" :class="this.processor8Status"
  />
  <a target="_blank">
            <text x="30" y="35" fill="black">修外拍图片</text>
        </a>
  <line x1="120" y1="30" x2="200" y2="30"
  style="stroke:rgb(0,0,0);stroke-width:2"/>
</svg> 

<svg class="svg5" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect width="120" height="60" :class="this.processor10Status"
  />
  <a target="_blank">
            <text x="50" y="35" fill="black">上新</text>
        </a>
        <line x1="60" y1="60" x2="60" y2="230"
  style="stroke:rgb(0,0,0);stroke-width:2"/>
</svg> 

<!-- 第三层 -->
<svg class="svgDown1" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect width="120" height="60" :class="this.processor9Status"
  />
  <a target="_blank">
            <text x="20" y="35" fill="black">录入产品资料</text>
        </a>
  
</svg>
<svg class="lineDown1" xmlns="http://www.w3.org/2000/svg" version="1.1">

  <line x1="0" y1="30" x2="340" y2="30"
  style="stroke:rgb(0,0,0);stroke-width:2"/>
  
</svg>

<svg class="lineDown2" xmlns="http://www.w3.org/2000/svg" version="1.1">

  <line x1="0" y1="30" x2="340" y2="30"
  style="stroke:rgb(0,0,0);stroke-width:2"/>
  
</svg>
</div>

<!-- 静物任务流  -->
<div v-if="this.$route.query.projectCode == '1'">
     <svg class="svg" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect width="120" height="60" :class="this.processor11Status"
  />
  <a target="_blank">
            <text x="20" y="35" fill="black">调整拍摄报表</text>
        </a>
  <line x1="120" y1="30" x2="200" y2="30"
  style="stroke:rgb(0,0,0);stroke-width:2"/>
  
</svg>



<svg class="svg1" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect width="120" height="60" :class="this.processor12Status"
  />
  <a target="_blank">
            <text x="20" y="35" fill="black">静物图片拍摄</text>
        </a>
  <line x1="120" y1="30" x2="200" y2="30"
  style="stroke:rgb(0,0,0);stroke-width:2"/>

</svg>

<svg class="svg2" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect width="120" height="60" :class="this.processor13Status"
  />
  <a target="_blank">
            <text x="30" y="35" fill="black">选静物图片</text>
        </a>
  <line x1="120" y1="30" x2="200" y2="30"
  style="stroke:rgb(0,0,0);stroke-width:2"/> 
</svg>

<svg class="svg3" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect width="120" height="60" :class="this.processor14Status"
  />
  <a target="_blank">
            <text x="30" y="35" fill="black">修静物图片</text>
        </a>

  
</svg>
</div>

    </div>
</template>

<script>
    import Util from 'libs/util'; 
    function formSearch() {
        return {
                 search: '',
                 
        }
    }
    export default {
        data() {
            return {
                processor1Status:'processor11_100',
                processor2Status:'processor11_100',
                processor3Status:'processor11_100',
                processor4Status:'processor11_100',

                processor5Status:'processor11_100',
                processor6Status:'processor11_100',
                processor7Status:'processor11_100',
                processor8Status:'processor11_100',

                processor9Status:'processor11_100',
                processor10Status:'processor11_100',

                processor11Status:'processor11_100',
                processor12Status:'processor11_100',
                processor13Status:'processor11_100',
                processor14Status:'processor11_100',

                taskName1:'',
                taskName2:'',
                taskName3:'',
                taskName4:'',
                taskName5:'',
                taskName6:'',
                taskName7:'',
                taskName8:'',
                taskName9:'',
                taskName10:'',
                taskName11:'',
                taskName12:'',
                taskName13:'',
                taskName14:'',


                ListData1:[],//调整拍摄报表
                processor1:0,
                ListData2:[],//拍摄方案
                processor2:0,
                ListData3:[],//外拍视频拍摄
                processor3:0,
                ListData4:[],//选视频
                processor4:0,
                ListData5:[],//剪辑
                processor5:0,
                ListData6:[],//外拍图片拍摄
                processor6:0,
                ListData7:[],//选外拍图片
                processor7:0,
                ListData8:[],//修外拍图片
                processor8:0,
                ListData9:[],//录入产品资料
                processor9:0,
                ListData10:[],//上新
                processor10:0,

//静物任务流
                ListData11:[],//调整拍摄报表
                processor11:0,
                ListData12:[],//拍摄方案
                processor12:0,
                ListData13:[],//外拍图片拍摄
                processor13:0,
                ListData14:[],//选外拍图片
                processor14:0,
                
                 formSearch:{}
            }
        },
        components:{
            // addComponent,
            // editComponent
        },
        mounted() {
            this.getData()
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
            
        },
        activated() {

        },
        methods: {
            chosesprocessor1Status(){
                console.log(this.processor1,'-07687670-0-0-')
                if(this.processor1 == 100){
                    this.processor1Status = 'processor11_100'
                }else if(this.processor11 == 400){
                    this.processor1Status = 'processor11_400'
                }else{
                    this.processor1Status = 'processor11_900'
                }
            },
            chosesprocessor2Status(){
                console.log(this.processor11,'-07687670-0-0-')
                if(this.processor2 == 100){
                    this.processor12Status = 'processor11_100'
                }else if(this.processor2 == 400){
                    this.processor2Status = 'processor11_400'
                }else{
                    this.processor2Status = 'processor11_900'
                }
            },
            chosesprocessor3Status(){
                console.log(this.processor11,'-07687670-0-0-')
                if(this.processor3 == 100){
                    this.processor3Status = 'processor11_100'
                }else if(this.processor3 == 400){
                    this.processor3Status = 'processor11_400'
                }else{
                    this.processor3Status = 'processor11_900'
                }
            },
            chosesprocessor4Status(){
                console.log(this.processor11,'-07687670-0-0-')
                if(this.processor4 == 100){
                    this.processor4Status = 'processor11_100'
                }else if(this.processor4 == 400){
                    this.processor4Status = 'processor11_400'
                }else{
                    this.processor4Status = 'processor11_900'
                }
            },
            chosesprocessor5Status(){
                console.log(this.processor11,'-07687670-0-0-')
                if(this.processor5 == 100){
                    this.processor5Status = 'processor11_100'
                }else if(this.processor5 == 400){
                    this.processor5Status = 'processor11_400'
                }else{
                    this.processor5Status = 'processor11_900'
                }
            },
            chosesprocessor6Status(){
                console.log(this.processor11,'-07687670-0-0-')
                if(this.processor6 == 100){
                    this.processor5Status = 'processor11_100'
                }else if(this.processor6 == 400){
                    this.processor6Status = 'processor11_400'
                }else{
                    this.processor6Status = 'processor11_900'
                }
            },
            chosesprocessor7Status(){
                console.log(this.processor11,'-07687670-0-0-')
                if(this.processor7 == 100){
                    this.processor7Status = 'processor11_100'
                }else if(this.processor7 == 400){
                    this.processor7Status = 'processor11_400'
                }else{
                    this.processor7Status = 'processor11_900'
                }
            },
            chosesprocessor8Status(){
                console.log(this.processor11,'-07687670-0-0-')
                if(this.processor8 == 100){
                    this.processor8Status = 'processor11_100'
                }else if(this.processor8 == 400){
                    this.processor8Status = 'processor11_400'
                }else{
                    this.processor8Status = 'processor11_900'
                }
            },
            chosesprocessor9Status(){
                console.log(this.processor11,'-07687670-0-0-')
                if(this.processor9 == 100){
                    this.processor9Status = 'processor11_100'
                }else if(this.processor9 == 400){
                    this.processor9Status = 'processor11_400'
                }else{
                    this.processor9Status = 'processor11_900'
                }
            },
            chosesprocessor10Status(){
                console.log(this.processor11,'-07687670-0-0-')
                if(this.processor10 == 100){
                    this.processor10Status = 'processor11_100'
                }else if(this.processor10 == 400){
                    this.processor10Status = 'processor11_400'
                }else{
                    this.processor10Status = 'processor11_900'
                }
            },
            chosesprocessor11Status(){
                console.log(this.processor11,'-07687670-0-0-')
                if(this.processor11 == 100){
                    this.processor11Status = 'processor11_100'
                }else if(this.processor11 == 400){
                    this.processor11Status = 'processor11_400'
                }else{
                    this.processor11Status = 'processor11_900'
                }
            },
            chosesprocessor12Status(){
                console.log(this.processor11,'-07687670-0-0-')
                if(this.processor12 == 100){
                    this.processor12Status = 'processor11_100'
                }else if(this.processor12 == 400){
                    this.processor12Status = 'processor11_400'
                }else{
                    this.processor12Status = 'processor11_900'
                }
            },
            chosesprocessor13Status(){
                console.log(this.processor11,'-07687670-0-0-')
                if(this.processor13 == 100){
                    this.processor13Status = 'processor11_100'
                }else if(this.processor13 == 400){
                    this.processor13Status = 'processor11_400'
                }else{
                    this.processor13Status = 'processor11_900'
                }
            },
            chosesprocessor14Status(){
                console.log(this.processor11,'-07687670-0-0-')
                if(this.processor14 == 100){
                    this.processor14Status = 'processor11_100'
                }else if(this.processor14 == 400){
                    this.processor14Status = 'processor11_400'
                }else{
                    this.processor14Status = 'processor11_900'
                }
            },
            getData(){
                let data = {}
                data.taskCode = this.$route.query.taskCode
                this.request('timingDiagram_detail', {data}, false).then((res) => {
                        if(res.code==1){
                            if(this.$route.query.projectCode == '1'){ //静物任务流
                            
                                this.ListData11 = res.data.detailInfoVoList[0].taskLeaders
                                this.processor11 = res.data.detailInfoVoList[0].status  //任务状态
                                this.taskName11 = res.data.detailInfoVoList[0].taskName  //任务名称
                                
                                this.ListData12 = res.data.detailInfoVoList[1].taskLeaders
                                this.processor12 = res.data.detailInfoVoList[1].status  //任务状态
                                this.taskName12 = res.data.detailInfoVoList[1].taskName  //任务名称

                                this.ListData13 = res.data.detailInfoVoList[2].taskLeaders
                                this.processor13 = res.data.detailInfoVoList[2].status  //任务状态
                                this.taskName13 = res.data.detailInfoVoList[2].taskName  //任务名称

                                this.ListData14 = res.data.detailInfoVoList[3].taskLeaders
                                this.processor14 = res.data.detailInfoVoList[3].status  //任务状态
                                this.taskName14 = res.data.detailInfoVoList[3].taskName  //任务名称

                                this.chosesprocessor11Status()
                                this.chosesprocessor12Status()
                                this.chosesprocessor13Status()
                                this.chosesprocessor14Status()
                            }else{ //外拍任务流
                                this.ListData1 = res.data.detailInfoVoList[0].taskLeaders
                                this.processor1 = res.data.detailInfoVoList[0].status  //任务状态
                                this.taskName1 = res.data.detailInfoVoList[0].taskName  //任务名称

                                this.ListData2 = res.data.detailInfoVoList[1].taskLeaders
                                this.processor2 = res.data.detailInfoVoList[1].status  //任务状态
                                this.taskName2 = res.data.detailInfoVoList[1].taskName  //任务名称

                                this.ListData3 = res.data.detailInfoVoList[2].taskLeaders  //人员
                                this.processor3 = res.data.detailInfoVoList[2].status  //任务状态
                                this.taskName3 = res.data.detailInfoVoList[2].taskName  //任务名称

                                this.ListData4 = res.data.detailInfoVoList[3].taskLeaders
                                this.processor4 = res.data.detailInfoVoList[3].status  //任务状态
                                this.taskName4 = res.data.detailInfoVoList[3].taskName  //任务名称

                                this.ListData5 = res.data.detailInfoVoList[4].taskLeaders
                                this.processor5 = res.data.detailInfoVoList[4].status  //任务状态
                                this.taskName5 = res.data.detailInfoVoList[4].taskName  //任务名称

                                this.ListData6 = res.data.detailInfoVoList[5].taskLeaders
                                this.processor6 = res.data.detailInfoVoList[5].status  //任务状态
                                this.taskName6 = res.data.detailInfoVoList[5].taskName  //任务名称

                                this.ListData7 = res.data.detailInfoVoList[6].taskLeaders
                                this.processor7 = res.data.detailInfoVoList[6].status  //任务状态
                                this.taskName7 = res.data.detailInfoVoList[6].taskName  //任务名称

                                this.ListData8 = res.data.detailInfoVoList[7].taskLeaders
                                this.processor8 = res.data.detailInfoVoList[7].status  //任务状态
                                this.taskName8 = res.data.detailInfoVoList[7].taskName  //任务名称

                                this.ListData9 = res.data.detailInfoVoList[8].taskLeaders
                                this.processor9 = res.data.detailInfoVoList[8].status  //任务状态
                                this.taskName9 = res.data.detailInfoVoList[8].taskName  //任务名称

                                this.ListData10 = res.data.detailInfoVoList[9].taskLeaders
                                this.processor10 = res.data.detailInfoVoList[9].status  //任务状态
                                this.taskName10 = res.data.detailInfoVoList[9].taskName  //任务名称
                                // this.status = res.data.detailInfoVoList[3].
                                this.chosesprocessor1Status()
                                this.chosesprocessor2Status()
                                this.chosesprocessor3Status()
                                this.chosesprocessor4Status()
                                this.chosesprocessor5Status()
                                this.chosesprocessor6Status()
                                this.chosesprocessor7Status()
                                this.chosesprocessor8Status()
                                this.chosesprocessor9Status()
                                this.chosesprocessor10Status()
                            }
                        }
                    })    
            },
            handleClick(item,name){   
                    console.log(item,name,'[p[p[p[p[')
                    let data = {}
                    data.taskCode = this.$route.query.taskCode
                    data.taskName = name
                    data.createUser = this.userInfo.userName
                    data.remindUser = item
                    this.request('remindTask', {data}, false).then((res) => {
                        if(res.code==1){
                        this.$Message.success('催办成功！')
                        }
                    })  
                },
        }       
    } 
</script>

<style>
.processor11_900{
    fill:rgb(255,255,255);stroke-width:1;stroke:rgb(0,0,0)
}
.processor11_400{
    fill:rgb(204,204,204);stroke-width:1;stroke:rgb(0,0,0)
}
.processor11_100{
    fill:rgb(153,153,153);stroke-width:1;stroke:rgb(0,0,0)
}
.ListData1{
    float: left;
    position: absolute;
    left: 0px;
    top: 380px
}
.ListData2{
    float: left;
    position: absolute;
    left: 200px;
    top: 380px
}
.ListData3{
    float: left;
    position: absolute;
    left: 370px;
    top: 180px
}
.ListData4{
    float: left;
    position: absolute;
    left: 590px;
    top: 180px
}
.ListData5{
    float: left;
    position: absolute;
    left: 790px;
    top: 180px
}
.ListData6{
    float: left;
    position: absolute;
    left: 390px;
    top: 380px
}
.ListData7{
    float: left;
    position: absolute;
    left: 610px;
    top: 380px
}
.ListData8{
    float: left;
    position: absolute;
    left: 800px;
    top: 380px
}
.ListData9{
    float: left;
    position: absolute;
    left: 590px;
    top: 580px
}
.ListData10{
    float: left;
    position: absolute;
    left: 1000px;
    top: 380px
}

.ListData11{
    float: left;
    position: absolute;
    left: 0px;
    top: 380px
}
.ListData12{
    float: left;
    position: absolute;
    left: 200px;
    top: 380px
}
.ListData13{
    float: left;
    position: absolute;
    left: 390px;
    top: 380px
}
.ListData14{
    float: left;
    position: absolute;
    left: 610px;
    top: 380px
}
.list{
    float: left;
    position: absolute;
}
    .ivu-modal-footer{
        border-top:0;
    }
        .demo-upload-list{
            display: inline-block;
            width: 60px;
            height: 60px;
            text-align: center;
            line-height: 60px;
            border: 1px solid transparent;
            border-radius: 4px;
            overflow: hidden;
            background: #fff;
            position: relative;
            box-shadow: 0 1px 1px rgba(0,0,0,.2);
            margin-right: 4px;
        }
        .demo-upload-list img{
            width: 100%;
            height: 100%;
        }
        .demo-upload-list-cover{
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,.6);
        }
        .demo-upload-list:hover .demo-upload-list-cover{
            display: block;
        }
        .demo-upload-list-cover i{
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            margin: 0 2px;
        }
        .ivu-table-cell{
            padding-left: 0;
            padding-right:0;
        }
        th.ivu-table-column-center :nth-of-type(4){
            text-align: left !important
        }
        .svg{
            float: left;
            position: relative;
            top: 200px;
            width: 200px;
            text-align: center
        }
        .svg1{
            height: 300px;
            float: left;
            position: relative;
            top: 200px;
            width: 200px;
        }
        .svg2{
            float: left;
            position: relative;
            top: 200px;
            width: 200px;
        }
        .svg3{
            float: left;
            position: relative;
            top: 200px;
            width: 200px;
            height: 200px;
        }
        .svg4{
            float: left;
            position: relative;
            top: 200px;
            width: 200px;
        }
        .svg5{
            float: left;
            position: relative;
            top: 200px;
            width: 120px;
            height: 240px;
        }
        .svgup1{
             float: left;
            position: absolute;
            left: 410px;
            height: 200px
        }
        .svgup2{
             float: left;
            position: absolute;
            left: 610px;
            height: 200px
        }
        .svgup3{
             float: left;
            position: absolute;
            left: 810px;
            height: 200px
        }
        .line1{
            height: 200px;
            float: left;
            position: absolute;
            left: 210px;
            top: 120px;
        }
        .line2{
            float: left;
            position: absolute;
            top: 150px;
            left: 210px;
        }
        .svgDown1{
            width: auto;
            float: left;
            position: absolute;
            top: 520px;
            left: 610px;
        }
        .lineDown1{
            width: 350px;
            float: left;
            position: absolute;
            left: 270px;
            top: 520px
        }
        .lineDown2{
            width: 350px;
            float: left;
            position: absolute;
            left: 730px;
            top: 520px
        }
</style>
