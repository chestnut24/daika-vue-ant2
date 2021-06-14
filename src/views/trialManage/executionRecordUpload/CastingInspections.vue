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
  name: 'CastingInspections',
  props:['inspectionObj'],
  data(){
    return{
      tableShowArr:[
        { name:'压铸投入量',  param:'investmentInDieCasting' },
        { name:'压铸成品量',  param:'dieCastingProduction' },
        { name:'压铸废品量',  param:'scrapQuantityOfDieCasting' },
        { name:'调机废品',  param:'wasteOfMachineAdjustment' },
        { name:'X光参检量',  param:'xrayReferenceQuantity' },
        { name:'X光废品量',  param:'xrayScrapQuantity' },
        { name:'101',  param:'qualifiedNumber101' },
        { name:'102',  param:'qualifiedNumber102' },
        { name:'103',  param:'qualifiedNumber103' },
        { name:'104',  param:'qualifiedNumber104' },
        { name:'105',  param:'qualifiedNumber105' },
        { name:'106',  param:'qualifiedNumber106' },
        { name:'107',  param:'qualifiedNumber107' },
        { name:'108',  param:'qualifiedNumber108' },
        { name:'109',  param:'qualifiedNumber109' }
      ],
      table2ShowArr:[
        { name:'101',  param:'qualifiedNumber101' },
        { name:'102',  param:'qualifiedNumber102' },
        { name:'103',  param:'qualifiedNumber103' },
        { name:'104',  param:'qualifiedNumber104' },
        { name:'105',  param:'qualifiedNumber105' },
        { name:'106',  param:'qualifiedNumber106' },
        { name:'107',  param:'qualifiedNumber107' },
        { name:'108',  param:'qualifiedNumber108' },
        { name:'109',  param:'qualifiedNumber109' },
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