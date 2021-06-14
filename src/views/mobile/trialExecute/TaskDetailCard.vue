<template>
  <div class='task-detail-card-wrap'>
    <div class='task-detail-card-head'>
      <span class='left'>
      <div class='machine-index-wrap'>
      <img :src="require(`@/assets/trialExe/state_`+`${img_path_state}`+`.png`)" style='width: 26px;height: 26px'>
      <p style='margin-left: 10px'>{{taskState}}</p><span v-if="taskState==='待生产'">-{{formatNumber(taskInfo.no)}}</span>
      </div>
        <p style='color: #868889;'>/ {{taskInfo.processTechnology}}</p>
      </span>
      <span class='right'>
        <p style='color:#868889' >试制数量：</p>
        <p style='font-weight: 500;color: #09c199 '>{{taskInfo.trialProductionNumber}}</p>
      </span>
    </div>
    <div class='task-detail-card-content'>
      <div class='row1'>
        <div><p>轮型号：</p><span>{{taskInfo.projectNo }}</span></div>
        <div><p>用途：</p><span>{{taskInfo.purpose }}</span></div>
      </div>
      <div><p>试制流转单号：</p><span>{{ taskInfo.formBaseNo }}</span></div>
      <div v-if="taskState==='上机' || taskState==='中断'"><p>上机时间：</p><span>{{ taskInfo.onMachineTime }}</span></div>
      <div><p>预计完成时间：</p><span>{{taskInfo.planCompletionTime}}</span></div>
    </div>

    <div class='task-detail-card-btn-wrap'>
      <div v-if="taskState==='待生产'" class='on-machine-btn' @click='goOnOperation'>上机</div>
      <div v-if="taskState==='上机'" class='small-operate-btn display-center'  @click='goOffOperation(true,false)'>异常中断</div>
      <div v-if="taskState==='中断'" class='small-operate-btn display-center' @click='goOffOperation(false,true)'>任务重启</div>
      <div v-if="taskState==='上机'||taskState==='中断'" class='small-operate-btn display-center' @click='goOffOperation(false,false)' style='margin-left: 5px'>下机</div>
    </div>
  </div>







<!--  <div class='task-detail-card-wrap'>-->
<!--    <div class='task-state'>{{taskState}}</div>-->
<!--    <div class='main-content-wrap'>-->
<!--      <div class='task-title'>-->
<!--        <div v-if="taskState==='上机' || taskState==='中断'">-->
<!--          <p style='color: #333333; font-size: 12px;font-weight: 400'>上机时间: &nbsp;&nbsp;</p>-->
<!--          <span style='color: #5ea2c0;font-size: 11px;'>04.22  18:00</span>-->
<!--        </div>-->
<!--        <div v-if="taskState==='待生产'">-->
<!--          <p style='color: #333333; font-size: 16px;font-weight: 600'>NO.{{ taskInfo.no }}</p>-->
<!--        </div>-->
<!--        <p style='color: #7f7f7f; font-size: 12px'>工序: {{taskInfo.processTechnology}}</p>-->
<!--      </div>-->
<!--      <div class='task-details-wrap'>-->
<!--      <div class='task-details-left'>-->

<!--        <div class='row1'>-->
<!--          <p>{{taskInfo.projectNo}} </p>-->
<!--          <p style='margin-left: 5px'>{{ taskInfo.purpose}}</p>-->
<!--        </div>-->
<!--        <p style='color: #969696;font-size: 12px;'>{{taskInfo.formBaseNo}}</p>-->
<!--        <p style='color: #5ea2c0;font-size: 11px;display: inline-block;white-space:nowrap'>预计完成时间：{{ taskInfo.planCompletionTime}}</p>-->
<!--      </div>-->
<!--      <div class='task-details-right'>-->
<!--        <p style='color: #969696;font-size: 12px'>试制数量</p>-->
<!--        <p style='color: #4b4b4b;font-size: 16px;font-weight: bolder'>{{taskInfo.trialProductionNumber}}</p>-->
<!--      </div>-->
<!--    </div>-->
<!--    </div>-->
<!--    <div class='operate-btn-wrap'>-->
<!--      <div v-if="taskState==='待生产'" class='on-machine-btn' @click='goOnOperation'>上机</div>-->
<!--      <div v-if="taskState==='上机'" class='small-operate-btn display-center'  @click='goOffOperation(true,false)'>异常中断</div>-->
<!--      <div v-if="taskState==='中断'" class='small-operate-btn display-center' @click='goOffOperation(false,true)'>任务重启</div>-->
<!--      <div v-if="taskState==='上机'||taskState==='中断'" class='small-operate-btn display-center' @click='goOffOperation(false,false)' style='margin-left: 5px'>下机</div>-->
<!--    </div>-->
<!--  </div>-->

</template>

<script>
const sessionStorge=window.sessionStorage;
export default {
  name: 'TaskDetailCard',
props:{
  taskState:{
    type:String,
    default:'已上机'
  },
  taskInfo:{
  type:Object,
    default:function(){
      return{
        no:0, //序号
        planCompletionTime:'', //预计完成时间
        processTechnology:'', //工序
        purpose:'', //用途
        projectNo:'',  //轮型号
        onMachineTime:'' , //上机时间
        trialProductionNumber:'' //工序数量
      }
    }
}
},
  computed:{
    img_path_state(){
      if(this.taskState==='上机'){
        return 'on_machine';
      }
      else if(this.taskState==='中断'){
        return 'interupt'
      }
      else{
        return 'waiting'
      }
    }
  },
  methods:{
    //点击上机或下机前将当前任务信息保存到session中（避免路由跳转携带太多参数）
    saveMachineOperationInfo(){
      let allTaskInfo={...this.taskInfo}
      allTaskInfo.machineIndex=this.$parent.$parent.nowMachineNo;
      allTaskInfo.nowTrialSite=this.$parent.$parent.nowTrialSite;

      console.log("父组件",this.$parent)
      console.log("父组件中的试制地：",this.$parent.$parent.nowTrialSite)
      allTaskInfo.taskState=this.taskState;
      sessionStorge.setItem('machineOperationInfo',JSON.stringify(allTaskInfo));

    },
    goOnOperation(){
      this.saveMachineOperationInfo();
      console.log("点击上机后，保存信息：",sessionStorge.getItem('machineOperationInfo'))
      this.$router.push('/app/onMachineOperation');
    },
    goOffOperation(ifInterupt=false,ifRestart=false){

      this.saveMachineOperationInfo();
      console.log("点击下机后，保存信息：",sessionStorge.getItem('machineOperationInfo'))
      this.$router.push({
        path:'/app/offMachineOperate',
        //如果是点击异常中断或者任务重启，到达下机页面后立刻打开弹窗
        query:{
          ifFromInterupt:ifInterupt,
          ifFromRestart:ifRestart
        }
      });
    },

    formatNumber(number){
      console.log("number",number)
      let strNum=number.toString();
      if(strNum.length>2)
        return strNum;
      else{
        console.log("Array(2).join('0') + number)",(Array(2).join('0') + number).slice(-2));
        return Array(2).join('0') + number;
      }
    }

  }
}
</script>

<style scoped>

*{
  margin: 0;
  padding: 0;
}
.task-detail-card-wrap{
  display: flex;
  flex-direction: column;
  background-color: #f5f8fa;

  width: 100%;
  border-radius: 3px;
  margin-bottom: 15px;
  box-sizing: border-box;

}
/*头部*/
  .task-detail-card-head{
    width: 100%;
    height: 45px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #e9ebef;
    padding: 10px 15px;
  }
.task-detail-card-head >.left{
  display: flex;
  flex-direction: row;
  align-items: flex-end
}

.task-detail-card-head >.right{
  display: flex;
  flex-direction: row;
  align-items: center
}
.task-detail-card-head .machine-index-wrap{
  color: #283654;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 5px;
}
/*中部详细信息*/
  .task-detail-card-content{
    width: 90%;
    max-height: 120px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 10px 15px;
  }
.task-detail-card-content div{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
}
.task-detail-card-content div p{
  color: #868889;
  font-size: 14px;
  white-space: nowrap;
}
.task-detail-card-content div span{
  color: #565757;
  font-size: 14px;
}
.task-detail-card-content div.row1{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
}

/*底部按钮*/
  .task-detail-card-btn-wrap{
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    height: 51px;
    margin: 1px auto 5px auto;
  }
.on-machine-btn{
  width: 90%;
  margin: 0 auto;
  height: 95%;
  background-color: #d8e5f9;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3780f1;
  font-size: 16px;
}

.small-operate-btn{
  width: 45%;
  height: 95%;
  background-color: #d8e5f9;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3780f1;
  font-size: 16px;
}


/*.display-center{*/
/*  display: flex;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*}*/
/*.task-detail-card-wrap{*/
/*  display: flex;*/
/*  flex-direction: row;*/
/*  background-color: #f5f5f5;*/
/*  height: 90px;*/
/*  width: 98%;*/
/*  border-radius: 13px;*/
/*  margin-top: 15px;*/
/*}*/
/*.task-state{*/
/*  width: 8%;*/
/*  height: 100%;*/
/*  background-color: #555555;*/
/*  border-radius:13px 0 0 13px;*/
/*  color: white;*/
/*  box-sizing: border-box;*/
/*  writing-mode:vertical-lr;*/
/*  text-align: center;*/
/*  display: flex;*/
/*  align-items: center;*/
/*  justify-content: center;*/
/*}*/
/*.main-content-wrap{*/
/*  width: 65%;*/
/*  height:100%;*/
/*  display: flex;*/
/*  flex-direction: column;*/
/*  border-right: 1px solid #d7d7d7;*/
/*  box-sizing: border-box;*/
/*  margin-left: 3px;*/
/*}*/
/*.task-title{*/
/*  width: 100%;*/
/*  height: 20%;*/
/*  box-sizing: border-box;*/
/*  margin-top: 10px;*/
/*  display: flex;*/
/*  flex-direction: row;*/
/*  align-items: center;*/
/*  justify-content: space-between;*/
/*}*/
/*.task-title>div{*/
/*  display: flex;*/
/*  flex-direction: row;*/
/*}*/

/*.task-details-wrap{*/
/*  height: 80%;*/
/*  width: 100%;*/
/*  box-sizing: border-box;*/
/*  display: flex;*/
/*  flex-direction: row;*/
/*  justify-content: space-between;*/
/*}*/
/*.task-details-left{*/
/*  display: flex;*/
/*  flex-direction: column;*/
/*  width: 70%;*/
/*  box-sizing: border-box;*/
/*}*/
/*.task-details-left .row1{*/
/*  width: 100%;*/
/*  display: flex;*/
/*  flex-direction: row;*/

/*  color: #555555;*/
/*  font-weight: bold;*/
/*  font-size: 13px;*/
/*}*/
/*.task-details-right{*/
/*  display: flex;*/
/*  flex-direction: column;*/
/*  align-items: center;*/
/*  box-sizing: border-box;*/
/*  width: 30%;*/
/*  height: 80%;*/
/*}*/
/*  !*右侧查看任务*!*/
/*  .operate-btn-wrap {*/
/*    display: flex;*/
/*    flex-direction: row;*/
/*    justify-content: center;*/
/*    align-items: center;*/
/*    box-sizing: border-box;*/
/*    width: 25%;*/
/*    height: 100%;*/
/*    padding: 5px 5px;*/
/*  }*/
/*.on-machine-btn{*/
/*  width:90%;*/
/*  height: 95%;*/

/*  display: flex;*/
/*  align-items: center;*/
/*  justify-content: center;*/
/*  background-color: #666666;*/
/*  border-radius: 10px;*/
/*  color: white;*/
/*  text-align: center;*/
/*  margin:0px auto 0 auto*/
/*}*/
/*.small-operate-btn{*/
/*  width: 45%;*/
/*  height: 100%;*/
/*  flex-shrink: 0;*/
/*  background-color: #666666;*/
/*  border-radius: 8px;*/
/*  color: white;*/
/*  text-align: center;*/
/*  display: flex;*/
/*  flex-direction: row;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*  writing-mode:vertical-lr;*/

/*}*/

</style>