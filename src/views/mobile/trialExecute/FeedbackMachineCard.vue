<template>
  <div class="machine-frame" @click='gotoTrialHistory'>
    <div class="machine-frame-top">
      <div class="machine-name">
        <img src="../../../assets/workbench.png" height="30" width="30"/>
        <span style="font-size: 16px">{{machineIndex}}号机台 / </span>
        <span style="font-size: 14px;color: #C3C5C7">{{showParams.processTechnology}}</span>
      </div>
      <div class="trial-number">
        <span style="font-size: 14px">试制数量：</span>
        <span style="font-size: 16px"><b>{{showParams.trialProductionNumber}}</b></span>
      </div>
    </div>
    <div class="machine-frame-mid">
      <span style="width: 50%">轮型号：{{showParams.projectNo}}</span>
      <span style="width: 50%">用途：{{showParams.purpose}}</span>
      <span style="width: 100%">试制流转单号：{{showParams.formBaseNo}}</span>
      <span style="width: 100%">上机时间：{{showParams.onMachineTime}}</span>
      <span style="width: 100%">下机时间：{{showParams.outMachineTime}}</span>

    </div>
    <div class="machine-frame-bottom">
      <a-button
        style="background-color: #D8E5F9;color: #2E7AF1"
        @click.stop="goFeedback"
        :disabled="!(showParams.processTechnology ==='精车' || showParams.processTechnology ==='粗车' || showParams.processTechnology ==='压铸')">现场反馈</a-button>
      <a-button
        style="background-color: #D8E5F9;color: #2E7AF1"
        @click.stop='goScene'
        :disabled="!(showParams.processTechnology ==='精车' || showParams.processTechnology ==='粗车' || showParams.processTechnology ==='压铸')">工艺记录</a-button>
      <a-button style="background-color: #D8E5F9;color: #2E7AF1" @click.stop='goCheckRecord' >检查结果</a-button>
    </div>

  </div>
<!--  <div class='machine-card-wrap'>-->
<!--    <div class='machine-index display-center'><span>{{machineIndex}}号机台</span></div>-->
<!--    <div class="show-frame">-->
<!--      <div class="show-up-frame">-->
<!--        <div class="show-left-frame">-->
<!--          <span style="width: 30%"><b>{{showParams.projectNo}}</b></span>-->
<!--          <span style="width: 30%;margin-left: 5px;"><b>{{showParams.purpose}}</b></span>-->
<!--          <span style="width: 30%;margin-left: 8px;">工序:{{showParams.processTechnology}}</span>-->
<!--          <br/>-->
<!--          <span style="width: 100%">{{showParams.formBaseNo}}</span>-->
<!--          <br/>-->
<!--          <span style="width: 100%">{{showParams.onMachineTime}} ~  {{showParams.outMachineTime}}</span>-->
<!--        </div>-->
<!--        <div class="show-right-frame">-->
<!--          <span style="font-size: 16px">试制数量</span>-->
<!--          <br/>-->
<!--          <span style="font-size: 16px"><b> {{showParams.trialProductionNumber}}</b></span>-->

<!--        </div>-->
<!--      </div>-->
<!--      <div class="show-down-frame">-->
<!--        <a-button style="background-color: #7F7F7F;color: #fff" @click="goFeedback">现场反馈</a-button>-->
<!--        <a-button style="background-color: #7F7F7F;color: #fff">工艺记录</a-button>-->
<!--        <a-button style="background-color: #7F7F7F;color: #fff">检查结果</a-button>-->

<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
</template>

<script>
const sessionStorge=window.sessionStorage;
  export default {
    name: 'FeedbackMachineCard',
    props:['machineIndex', 'machineObject'],
    mounted() {
      this.showParams = this.machineObject;
    },
    watch:{
      machineObject(newParams, oldParams){
        console.log('newParams', newParams.processTechnology);
        this.showParams = newParams;
      }
    },
    data(){
      return{
        showParams:{
          projectNo:'',//轮型号
          purpose:'',//用途
          processTechnology:'',//工序
          formBaseNo:'',//试制单编号
          onMachineTime:'',//上机时间
          outMachineTime:'',//下机时间
          trialProductionNumber:'',//试制数量
        }

      }
    },
    methods:{
      goFeedback(){
        this.$router.push({
          path: '/app/trail/FineFeedback',
          query: {
            obj:this.machineObject,
            tabs:2
          },
        },);
      },
      goScene(){
        this.$router.push({
          path: '/app/trail/FineFeedback',
          query: {
            // projectNo: this.showParams.projectNo,
            // trialProductionNumber: this.showParams.trialProductionNumber,
            // formBaseNo: this.showParams.formBaseNo,
            // psize: this.showParams.psize,
            obj:this.machineObject,
            tabs:1
          },
        },);
      },
      saveMachineOperationInfo(){
        let allTaskInfo={...this.machineObject}
        allTaskInfo.machineIndex=this.machineIndex;
        allTaskInfo.nowTrialSite=this.machineObject.trialProductionSite;
        allTaskInfo.workFlow =this.machineObject.workStr.replace(/,/g, '-')
        allTaskInfo.taskState="下机";
        sessionStorge.setItem('machineOperationInfo',JSON.stringify(allTaskInfo));
      },
      gotoTrialHistory(){
        this.saveMachineOperationInfo()
        console.log("外层div被点击了")
        this.$router.push({
          path:'/app/trialHistory',
          query: {
            taskId: this.machineObject.appTaskId,
          }
        },);
      },
      goCheckRecord(){
        this.$message.info('该页面待开发');
      }

    }
  }
</script>

<style scoped lang='less'>
  /deep/.ant-btn{
    width: 30%;
    border-width:0 ;
  }
  /deep/.ant-btn[disabled]{
    background:#F5F5F5 !important;
    color: #B8B8B8  !important;
  }
  .machine-frame{
    background-color: #F5F8FA;
    height:210px;
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    .machine-frame-top{
      width: 100%;
      display: flex;
      justify-content: space-between;
      border-width: 0 0 1px 0;
      border-style: solid;
      padding: 10px 0px;
      border-color: #E9EBEF;
    }
    .machine-name img{
      margin-right: 15px;
    }
    .machine-frame-mid{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 10px 0px;
    }
    .machine-frame-bottom{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }


</style>