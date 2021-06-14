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
  name: 'MachingInspections',
  props:['inspectionObj'],
  data(){
    return{
      tableShowArr:[
        { name:'机加单元',  param:'machiningUnit' },
        { name:'机加重量',  param:'machineWeight' },
        { name:'操作手姓名',  param:'machiningSequenceScrap' },
        { name:'标识号',  param:'identificationNumber' },
        { name:'投入量',  param:'inputs' },
        { name:'机加成品',  param:'machiningFinishedProducts' },
        { name:'废品总数',  param:'totalWaste' },
        { name:'机加本序废品',  param:'machiningSequenceScrap' },
        { name:'301',  param:'roughCart301' },
        { name:'302',  param:'roughCart302' },
        { name:'303',  param:'roughCart302' },
        { name:'304',  param:'roughCart302' },
        { name:'305',  param:'roughCart305' },
        { name:'306',  param:'roughCart306' },
        { name:'307',  param:'roughCart307' },
        { name:'308',  param:'roughCart308' },
        { name:'309',  param:'roughCart309' },
        { name:'313',  param:'roughCart313' },
        { name:'314',  param:'roughCart314' },
        { name:'316',  param:'roughCart316' },
        { name:'317',  param:'roughCart317' },
        { name:'321',  param:'roughCart321' },
        { name:'325',  param:'roughCart325' },
        { name:'326',  param:'roughCart326' },
        { name:'331',  param:'roughCart331' },
        { name:'342',  param:'roughCart342' },
        { name:'343',  param:'roughCart343' },
        { name:'345',  param:'roughCart345' },
        { name:'346',  param:'roughCart346' },
        { name:'347',  param:'roughCart347' },
        { name:'348',  param:'roughCart348' },
        { name:'351',  param:'roughCart351' },
        { name:'352',  param:'roughCart352' },
        { name:'381',  param:'roughCart381' },
      ]
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