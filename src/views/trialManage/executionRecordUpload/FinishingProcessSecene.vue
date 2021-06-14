<template>
<!--精车异常反馈弹窗-->

  <div class="total-frame">
    <span v-if="mode==='add'">
    <div class="top-input" >
      <span style="width: 30%">单件加工时间</span>
      <!--      <a-input placeholder="请输入" style="width: 30%" v-model="machiningTime"/>-->
      <a-date-picker
        style="width: 40%"
        v-model="machiningTime"
        format="YYYY-MM-DD HH:mm:ss"
        show-time
        @change="onChange"
       />
    </div>
    <div class="technology-frame" v-for="(item, index) in technologyArr" :key="index">
      <div class="technology-title">
        <span class="divide"> </span>
        <span><b>{{item.title}}</b></span>
      </div>
      <div class="technology-input" v-for="(data, index2) in item.dataArr" :key="index2">
        <span style="width: 30%">{{data.name}}</span>
        <a-input v-if="mode==='add'" placeholder="请输入" style="width: 60%" v-model="data.input"/>
      </div>
    </div>

    <div class="button-frame">
      <a-button class="submit-button" v-if="mode==='add'" type="primary" @click="submitData">提交</a-button>
    </div>
      </span>

<!--    如果是查看异常信息-->
    <span v-if="mode==='show'">
      <div class='top-input'>
         <span style="width: 30%">单件加工时间</span>
        <p>{{feedbackObj['oneComponentTime']}}</p>
      </div>
      <div class='technology-frame'>
         <div class="technology-title">
        <span class="divide"> </span>
        <span><b>问题反馈</b></span>
      </div>
        <span v-if="feedbackObj['appFinishTurningSubclassVOs']">
      <div class="technology-input" v-for="(data, index) in feedbackObj['appFinishTurningSubclassVOs']" :key="index">
        <span style="width: 30%">{{index}}</span>
        <p>{{data['problemFeedback']}}</p>
      </div>
        </span>
        <div v-else class='no-problem-wrap'><p class='no-problem-show'>无问题反馈</p> </div>
      </div>
      <div class='technology-frame'>
         <div class="technology-title">
        <span class="divide"> </span>
        <span><b>废品统计</b></span>
      </div>
        <span v-if="feedbackObj['appFinishTurningSubclasstwoVOs']">
      <div class="technology-input" v-for="(data, index) in feedbackObj['appFinishTurningSubclasstwoVOs']" :key="index">
        <span style="width: 30%">{{index}}</span>
        <p>{{data['scrapMessage']}}</p>
      </div>
        </span>
      </div>
       <div class="table-input-frame">
      <div class="input-frame" v-for="(data, index) in tableShowArray" :key="index">
        <div class="table-title">
          <span>{{data.name}}</span>
        </div>
        <div class="table-input">
          <p>{{feedbackObj[data.param]}}</p>
        </div>
      </div>
    </div>
    </span>
  </div>
</template>

<script>
import {fineSceneSubmit} from  '@/api/api';
export default {
  name: 'FinishingProcessSecene',
  props:{
    mode:{
      type:String
    },
    feedbackObj:{
      type:Object,
      default:()=>{}
    },
    appTaskId: {
      default:''
    }
  },
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
      ],
      tableShowArray:[
        { name:'试制次数',  param:'trialProduceNumber' },
        { name:'投入量',  param:'inputNumber' },
        { name:'成品量',  param:'endProduct' },
        { name:'前序废品',  param:'preorderScrap' },
        { name:'本序废品',  param:'basicScrap' },
        { name:'本序废品率',  param:'basicScrapYield' },
        { name:'总成品率',  param:'countYield' },
      ]
    }
  },
  methods:{
    onChange(value, dateString) {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
      this.machiningTime = dateString;
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
    },
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
        appTaskId:this.appTaskId,
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
*{
  padding: 0;
  margin: 0;
}
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
    justify-content:space-between;
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
  justify-content: space-between;
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
.technology-input /deep/ .ant-input{
 text-align: right;
}


//无问题反馈
.no-problem-wrap{
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  justify-content: center;

}

.no-problem-show{
  color:#aaaaaa;
  font-size: 24px;
  font-weight: 500;
  margin: 10px auto;
}
</style>