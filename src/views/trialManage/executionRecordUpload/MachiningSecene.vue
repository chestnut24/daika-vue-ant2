<template>
<!--  机加异常反馈弹窗-->
  <span v-if="mode==='add'">
  <div class="total-frame">
    <div class="picture-frame">
      <div class="picture-left-frame">
        <img v-if="imgUrl" :src="imgUrl" >
        <img v-else src="@/assets/scan.png" />
      </div>
      <div class="picture-right-frame">
        <div class="input-frame" v-for="(data, index) in tableInputArr" :key="index">
          <div class="table-title">
            <span>{{data.name}}</span>
          </div>
          <div class="table-input">
            <a-input v-if="mode==='add'" placeholder="请输入" style="width: 100%" v-model="data.input"/>
          </div>
        </div>
      </div>
    </div>
    <div class="technology-frame" v-for="(item, index) in technologyArr" :key="index">
      <div class="technology-title">
        <span class="divide"> </span>
        <span><b>{{item.title}}</b></span>
      </div>
      <div class="technology-input" v-for="(data, index2) in item.dataArr" :key="index2">
        <span style="width: 30%">{{data.appMachiningFeedbackId}}</span>
        <span style="width: 30%">{{data.site}}</span>
        <a-input v-if="mode==='add'" placeholder="请输入" style="width: 30%" v-model="data.feedbackMessage"/>
      </div>
    </div>
    <div class="button-frame">
      <a-button class="submit-button" v-if="mode==='add'" type="primary" @click="submitData">提交</a-button>
    </div>
  </div>
    </span>
  <span v-else>
<div class="total-frame">
    <div class="picture-frame">
      <div class="picture-left-frame">
        <img v-if="imgUrl" :src="imgUrl" >
        <img v-else src="@/assets/scan.png" />
      </div>
      <div class="picture-right-frame">
        <div class="input-frame" v-for="(data, index) in tableShowArr" :key="index">
          <div class="table-title">
            <span>{{data.name}}</span>
          </div>
          <div class="table-input">
            <p>{{feedbackObj[data.param]}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="technology-frame">
      <div class="technology-title" style='height: 30px'>
        <span class="divide"> </span>
        <span><b>问题反馈或加工难点</b></span>
      </div>
      <span v-if="feedbackObj['appMachiningFeedbackSubclassVOs']">
      <div class="technology-input" v-for="(data, index) in feedbackObj['appMachiningFeedbackSubclassVOs']" :key="index">
        <span style="width: 30%">{{index+1}}</span>
       <p>{{data['feedbackMessage']}}</p>
      </div>
        </span>
       <div v-else class='no-problem-wrap'><p class='no-problem-show'>无问题反馈</p> </div>
    </div>
  </div>
  </span>
</template>

<script>
import {machiningSceneSubmit} from  '@/api/api';
export default {
  name: 'MachiningSecene',
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
      imgUrl:null,
      technologyArr:[
        {
          title:'问题反馈或加工难点',
          dataArr:[
            { appMachiningFeedbackId:'1',  feedbackMessage:'' },
            { appMachiningFeedbackId:'2',  feedbackMessage:'' },
            { appMachiningFeedbackId:'3',  feedbackMessage:'' },
            { appMachiningFeedbackId:'4',  feedbackMessage:'' },
            { appMachiningFeedbackId:'5',  feedbackMessage:'' },]
        },
      ],
      tableInputArr:[
        { name:'单件效率',  input:'' },
        { name:'毛坯状态',  input:'' },
        { name:'量检具情况',  input:'' },
      ],
      tableShowArr:[
        { name:'单件效率',  param:'singleEfficiency' },
        { name:'毛坯状态',  param:'blankState' },
        { name:'量检具情况',  param:'measuringTool' },
      ],

    }
  },
  methods:{
    submitData(){
      const  obj = {
        appMachiningFeedbackSubclassDTOList:  this.technologyArr[0].dataArr,
        singleEfficiency: this.tableInputArr[0].input,
        blankState: this.tableInputArr[1].input,
        measuringTool: this.tableInputArr[2].input,
        taskId: this.appTaskId,
      }
      console.log('arr', obj);

      machiningSceneSubmit(obj).then((data)=>{
        // console.log('dataSuccess', data);
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
    clearData(){
      this.tableInputArr = [
        { name:'单件效率',  input:'' },
        { name:'毛坯状态',  input:'' },
        { name:'量检具情况',  input:'' },
      ]
      this.technologyArr = [
        {
          title:'问题反馈或加工难点',
          dataArr:[
            { appMachiningFeedbackId:'1',  feedbackMessage:'' },
            { appMachiningFeedbackId:'2',  feedbackMessage:'' },
            { appMachiningFeedbackId:'3',  feedbackMessage:'' },
            { appMachiningFeedbackId:'4',  feedbackMessage:'' },
            { appMachiningFeedbackId:'5',  feedbackMessage:'' },]
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
  .technology-title{
    width: 100%;
    height: 100%;
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
.picture-frame{
  width: 100%;
  display: flex;
  margin-bottom: 10px;
  .picture-left-frame{
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      width: 80%;
      margin: 0 auto;

    }
  }
  .picture-right-frame{
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 10px;
    .input-frame{
      width: 100%;
      height: 30%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border: 1px solid #F2F4F6;;
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
        height: 30px;
        background-color: #fff;
        display: flex;
        align-items: center;
      }
    }
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