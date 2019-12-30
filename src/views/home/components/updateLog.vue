<template>
    <div style="height:150px;overflow-y: scroll;padding:0 5px 0 5px">

        <Timeline v-for="(item,index) in updateLogList" :key="index">

             <TimelineItem color="green">
             <p class="time">v{{item.verNo}}   {{item.releaseTime}}</p>
             <div class="content">
                 <template v-for="contentItem in item.contentList">
                     {{contentItem}}<br>
                 </template>
             </div>
        </TimelineItem>

        </Timeline>

    </div>
</template>

<script>

export default {
    name: 'updateLog',
    props: {
        updateLog: Array
    },
    data(){
        return {
            updateLogList:[]
        }
    },
    mounted () {
        this.request('sys_ver_log',{
            data:{
                type:1
            }
        },false).then((res)=>{
            if(res.code==1){
                this.updateLogList = res.data.data
                this.updateLogList.forEach(function(item){
                   item.contentList = item.content.split(';');
                })
            }
        })
    }
};
</script>


