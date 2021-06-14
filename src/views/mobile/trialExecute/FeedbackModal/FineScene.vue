<template>
  <div class="total-frame">
    <div class="top-input" >
      <span style="width: 30%">单件加工时间</span>
<!--      <a-input placeholder="请输入" style="width: 30%" v-model="machiningTime"/>-->
      <a-date-picker
        style="width: 40%"
        v-model="machiningTime"
        format="YYYY-MM-DD HH:mm:ss"
        show-time
        @change="onChange"
        @ok="onOk"/>
    </div>
    <div class="technology-frame" v-for="(item, index) in technologyArr" :key="index">
      <div class="technology-title">
        <span class="divide"> </span>
        <span><b>{{item.title}}</b></span>
      </div>
      <div class="technology-input" v-for="(data, index2) in item.dataArr" :key="index2">
        <span style="width: 30%">{{data.name}}</span>
        <a-input placeholder="请输入" style="width: 60%" v-model="data.input"/>
      </div>
    </div>
    <div class="table-input-frame">
      <div class="input-frame" v-for="(data, index) in tableInputArr" :key="index">
        <div class="table-title">
          <span>{{data.name}}</span>
        </div>
        <div class="table-input">
          <a-input placeholder="请输入" style="width: 100%" v-model="data.input"/>
        </div>
      </div>
    </div>
    <div class="button-frame">
      <a-button class="submit-button" type="primary" @click="submitData">提交</a-button>
    </div>
  </div>
</template>

<script>
  import {fineSceneSubmit} from  '@/api/api';
  export default {
    name: 'FineScene',
    props:['itemObj'],
    data(){
      return{
        machiningTime:'',//单件加工时间
        technologyArr:[
          {
            title:'问题反馈',
            dataArr:[
              { name:'1',  input:'' },
              { name:'2',  input:'' },
              { name:'3',  input:'' },]
          },
          {
            title:'废品统计',
            dataArr:[
              { name:'1',  input:'' },
              { name:'2',  input:'' },
              { name:'3',  input:'' },]
          },
        ],
        tableInputArr:[
          { name:'试制次数',  input:'' },
          { name:'投入量',  input:'' },
          { name:'成品量',  input:'' },
          { name:'前序废品',  input:'' },
          { name:'本序废品',  input:'' },
          { name:'本序废品率',  input:'' },
          { name:'总成品率',  input:'' },
        ]

      }
    },
    methods:{
      submitData(){
        let appFinishTurningSubclassDTOList = [];
        let appFinishTurningSubclasstwoDTOList = [];
        this.technologyArr[0].dataArr.forEach((item)=>{
          appFinishTurningSubclassDTOList.push({
            appFinishTurningId: item.name,
            problemFeedback: item.input
          })
        })
        this.technologyArr[1].dataArr.forEach((item)=>{
          appFinishTurningSubclasstwoDTOList.push({
            appFinishTurningId: item.name,
            scrapMessage: item.input
          })
        })
        const obj = {
          appFinishTurningSubclassDTOList:appFinishTurningSubclassDTOList,
          appFinishTurningSubclasstwoDTOList:appFinishTurningSubclasstwoDTOList,
          appTaskId:this.itemObj.appTaskId,
          trialProduceNumber: this.tableInputArr[0].input,
          inputNumber: this.tableInputArr[1].input,
          endProduct: this.tableInputArr[2].input,
          preorderScrap: this.tableInputArr[3].input,
          basicScrap: this.tableInputArr[4].input,
          basicScrapYield: this.tableInputArr[5].input,
          countYield: this.tableInputArr[6].input,
          oneComponentTime: this.machiningTime,
        }
        fineSceneSubmit(obj).then((data)=>{
          if(data.success){
            this.$message.success('提交成功');
            this.$router.back(-1);
            this.clearData();
          }else{
            this.$message.warning('提交失败');
          }
        })
      },
      onChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.machiningTime = dateString;
      },
      onOk(value) {
        console.log('onOk: ', value);
      },
      clearData(){
        this.tableInputArr = [
          { name:'试制次数',  input:'' },
          { name:'投入量',  input:'' },
          { name:'成品量',  input:'' },
          { name:'前序废品',  input:'' },
          { name:'本序废品',  input:'' },
          { name:'本序废品率',  input:'' },
          { name:'总成品率',  input:'' },
        ];
        this.technologyArr = [
          {
            title:'问题反馈',
            dataArr:[
              { name:'1',  input:'' },
              { name:'2',  input:'' },
              { name:'3',  input:'' },]
          },
          {
            title:'废品统计',
            dataArr:[
              { name:'1',  input:'' },
              { name:'2',  input:'' },
              { name:'3',  input:'' },]
          },
        ]
      }
    }
  }
</script>

<style scoped lang="less">
  .total-frame{
    width: 100%;
  }
  .technology-frame{
    width: 100%;
    margin-bottom: 10px;
  .technology-title{
    width: 100%;
    height: 30px;
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
    justify-content: space-around;
    align-items: center;
  }
}
  .top-input{
    width: 100%;
    padding: 10px 5px;
    border-width: 0 0 1px 0;
    border-color: #F2F2F4;
    border-style: solid;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .table-input-frame{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .input-frame{
      width: 50%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border: 1px solid #F2F4F6;;
      .table-title{
        width: 50%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #F5F8FA;
      }
      .table-input{
        width: 50%;
        height: 50px;
        background-color: #fff;
        display: flex;
        align-items: center;
      }
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


</style>