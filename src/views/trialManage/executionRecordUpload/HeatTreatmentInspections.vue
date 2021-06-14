<template>
  <div class='casting-inspections-wrap'>
    <div class="input-frame" v-for="(data, index) in tableShowArr" :key="index">
      <div class="table-title">
        <span>{{data.name}}</span>
      </div>
      <div class="table-input">
        <p>{{inspectionObj[data.param]}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeatTreatmentInspections',
  props:['inspectionObj'],
  data(){
    return{
      tableShowArr:[
        { name:'热处理班次',  param:'heatTreatmentShift' },
        { name:'下线数',  param:'numberDownlines' },
        { name:'下线成品数',  param:'numberOfflineFinishedProducts' },
        { name:'废品',  param:'waste' },
        { name:'性能试验废品',  param:'performanceTestScrap' },
        { name:'磕碰伤废品',  param:'knockBruiseWasteProducts' },
        { name:'性能废品',  param:'performanceScrap' },
        { name:'其他废品',  param:'otherWasteProducts' },
        { name:'集中报废',  param:'centralizedScrapping' },
      ],

    }
  }
}
</script>

<style scoped lang='less'>
*{
  margin: 0;
  padding: 0;
}

.input-frame{
  width: 80%;
  height: 45px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #F2F4F6;
  margin: 0 auto;
  .table-title{
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F5F8FA;
  }
  .table-input{
    width: 50%;
    height:100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>