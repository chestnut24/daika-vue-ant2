<template>
  <div class="total-frame">
<!--    如果是添加工艺记录-->
    <span v-if="mode==='add'">
    <div class="technology-frame" v-for="(item, index) in technologyArr" :key="index">
      <div class="technology-title">
        <span class="divide"> </span>
        <span><b>{{item.title}}</b></span>
      </div>
      <div class="technology-input" v-for="(data, index2) in item.dataArr" :key="index2">
        <span style="width: 30%">{{data.name}}</span>
        <span style="width: 30%">{{data.site}}</span>
        <a-input placeholder="请输入" style="width: 30%" v-model="data.input"/>
      </div>
    </div>
    <div class="button-frame">
      <a-button class="submit-button" type="primary" @click="submitData">提交</a-button>
    </div>
       </span>
    <span v-if="mode==='show'">
       <div class="technology-frame" v-for="(item, index) in technologyShowArr" :key="index">
      <div class="technology-title">
        <span class="divide"> </span>
        <span><b>{{item.title}}</b></span>
      </div>
      <div class="technology-input" v-for="(data, index2) in item.dataArr" :key="index2">
        <span style='width: 40%;display: flex;flex-direction: row;justify-content: space-between'>
        <span style="width: 30%;white-space:nowrap">{{data.name}}</span>
        <span style="width: 30%;white-space:nowrap">{{data.site}}</span>
          </span>
        <p>{{recordObj[data.param]}}</p>
      </div>
    </div>
    </span>
  </div>
</template>

<script>
import {fineTechnologySubmit} from  '@/api/api';
export default {
  name: 'FinishingParams',
  props:{
    mode:{
      type:String
    },
    recordObj:{
      type:Object,
      default:()=>{}
    },
    appTaskId: {
      default:''
    }
  },
  data(){
    return{
      technologyArr:[
        {
          title:'刀具信息',
          dataArr:[
            { name:'正面抹平', site:'刀杆/刀片', input:'' },
            { name:'正面精车', site:'刀杆/刀片', input:'' },
            { name:'外圆', site:'刀杆/刀片', input:'' },
            { name:'帽口', site:'刀杆/刀片', input:'' },]
        },
        {
          title:'加工参数',
          dataArr:[
            { name:'正面抹平', site:'转速/进给率', input:'' },
            { name:'正面精车', site:'转速/进给率', input:'' },
            { name:'外圆', site:'转速/进给率', input:'' },
            { name:'帽口', site:'转速/进给率', input:'' },]
        },
      ],
      technologyShowArr:[
        {
          title:'刀具信息',
          dataArr:[
            { name:'正面抹平', site:'刀杆/刀片', param:'daojuMoping' },
            { name:'正面精车', site:'刀杆/刀片', param:'daojuJingche' },
            { name:'外圆', site:'刀杆/刀片', param:'daojuWaiyuan' },
            { name:'帽口', site:'刀杆/刀片', param:'daojuMaokou' },]
        },
        {
          title:'加工参数',
          dataArr:[
            { name:'正面抹平', site:'转速/进给率', param:'jiagongMoping' },
            { name:'正面精车', site:'转速/进给率', param:'jiagongJingche' },
            { name:'外圆', site:'转速/进给率', param:'jiagongWaiyuan' },
            { name:'帽口', site:'转速/进给率', param:' jiagongMaokou' },]
        },
      ]
    }


  },
  methods:{
    clearData(){
      this.technologyArr = [
        {
          title:'刀具信息',
          dataArr:[
            { name:'正面抹平', site:'刀杆/刀片', input:'' },
            { name:'正面精车', site:'刀杆/刀片', input:'' },
            { name:'外圆', site:'刀杆/刀片', input:'' },
            { name:'帽口', site:'刀杆/刀片', input:'' },]
        },
        {
          title:'加工参数',
          dataArr:[
            { name:'正面抹平', site:'转速/进给率', input:'' },
            { name:'正面精车', site:'转速/进给率', input:'' },
            { name:'外圆', site:'转速/进给率', input:'' },
            { name:'帽口', site:'转速/进给率', input:'' },]
        },
      ]
    },
    submitData(){
      const obj ={
        appTaskId:this.appTaskId,
        daojuMoping:this.technologyArr[0].dataArr[0].input,
        daojuJingche:this.technologyArr[0].dataArr[1].input,
        daojuWaiyuan:this.technologyArr[0].dataArr[2].input,
        daojuMaokou:this.technologyArr[0].dataArr[3].input,
        jiagongMoping:this.technologyArr[1].dataArr[0].input,
        jiagongJingche:this.technologyArr[1].dataArr[1].input,
        jiagongWaiyuan:this.technologyArr[1].dataArr[2].input,
        jiagongMaokou:this.technologyArr[1].dataArr[3].input,
      };
      fineTechnologySubmit(obj).then((data)=>{
        if(data.success){
          this.$message.success('提交成功');
          setTimeout(()=>{
            this.clearData()
          } ,2000)
        }else{
          this.$message.warning('提交失败');
        }
      })
    },
  }
}
</script>

<style scoped lang="less">
.total-frame{
  width: 100%;
}
.technology-frame{
  width: 100%;
  .technology-title{
    width: 100%;
    height:30px;
    display: flex;
    background-color: #F4F5F7;
    justify-content: flex-start;
    align-items: center;
    padding-left: 10px;
    .divide{
      padding-left: 2px;
      height:20px;
      background-color: #2E7AF1;
      margin-right: 10px
    }
  }
  .technology-input{
    width: 100%;
    padding: 10px 10px;
    border-width: 0 0 1px 0;
    border-color: #F2F2F4;
    border-style: solid;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.button-frame{
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px;
  .submit-button{
    width: 80%;
  }
}
/deep/ .ant-input:focus{
  border:none;
  outline: none;
  box-shadow: none;
}
/deep/ .ant-input{
  border:none;
  outline: none;
  box-shadow: none;
}
</style>