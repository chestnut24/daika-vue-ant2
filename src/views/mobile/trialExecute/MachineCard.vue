<template>


  <div class='machine-card-wrap'>
    <div class='machine-card-head'>
      <span class='left'>
      <div class='machine-index-wrap'>
      <img src='@/assets/trialExe/machine_icon2.png' style='width: 26px;height: 26px'>
      <p style='margin-left: 10px'>{{machineIndex}}</p>
      </div>
        <p style='color: #868889;'>/ {{machineTaskInfo.processTechnology}}</p>
      </span>
      <span class='right'>
        <p style='color:#868889' >试制数量：</p>
        <p style='font-weight: 500;color: #09c199 '>{{machineTaskInfo.trialProductionNumber}}</p>
      </span>
    </div>
    <div v-if='machineTaskInfo.ifHasTask' class='machine-card-content'>
      <div class='row1'>
        <div><p>轮型号：</p><span>{{machineTaskInfo.projectNo }}</span></div>
        <div><p>用途：</p><span>{{machineTaskInfo.purpose }}</span></div>
      </div>
      <div><p>试制流转单号：</p><span>{{ machineTaskInfo.formBaseNo }}</span></div>
      <div><p>预计完成时间：</p><span>{{machineTaskInfo.planCompletionTime}}</span></div>
    </div>
    <div v-else class='no-task-wrap'>
        <p class='no-task-show'>当前无任务执行</p>
    </div>
    <div class='machine-card-btn-wrap'>
      <div class='machine-card-btn' @click='gotoTaskQuery'>查看任务</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MachineCard',

  props:{
    machineTaskInfo:{
      type:Object,
      default:function(){
        return{
          ifHasTask:true
        }
      }
    },
    machineIndex:{
      type:String,
      default:'1#'
    },

  },
  data(){
    return{
      machineIndexList:['一','二','三','四','五','六','七','八','九','十','十一']
    }
  },
  computed:{
    format_planCompletionTime(){

      let newTime=this.planCompletionTime.replace(/-/g, "\/")
      return newTime
    }
  },
  methods:{
    gotoTaskQuery(){
      console.log("this.machineTaskInfo.processTechnology",this.machineTaskInfo.processTechnology);
      console.log("this.machineTaskInfo.trialSite",this.machineTaskInfo.trialSite);
      console.log("this.machineIndex",this.machineIndex);
      this.$router.push({
        path: `/app/taskQuery`,
        query: {
          nowTrialProcess:this.machineTaskInfo.processTechnology,
          nowTrialSite:this.machineTaskInfo.trialSite,
          nowMachineNo:this.machineIndex,
        },
      });
    },
  }
}
</script>

<style scoped lang='less'>
*{
  margin: 0;
  padding: 0;
}
.machine-card-wrap{
  display: flex;
  flex-direction: column;
  background-color: #f5f8fa;
  height: 185px;
  width: 98%;
  border-radius: 3px;
  margin-bottom: 15px;
  box-sizing: border-box;
}
//头部
.machine-card-head{
 width: 100%;
  height: 25%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e9ebef;
  padding: 10px;
}
.machine-card-head >.left{
  display: flex;
  flex-direction: row;
  align-items: flex-end
}

.machine-card-head >.right{
  display: flex;
  flex-direction: row;
  align-items: center
}
.machine-card-head .machine-index-wrap{
  color: #283654;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 5px;
}
//中部详细信息
.machine-card-content{
  width: 90%;
  height: 50%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 10px;
}
.machine-card-content div{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
}
.machine-card-content div p{
  color: #868889;
  font-size: 14px;
  white-space: nowrap;
}
.machine-card-content div span{
  color: #565757;
  font-size: 14px;
}
.machine-card-content div.row1{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
}
.no-task-wrap{
  width: 100%;
  height: 50%;
  box-sizing: border-box;
  position: relative;
  display: flex;
  justify-content: center;

}

.no-task-show{
  color:#aaaaaa;
  font-size: 24px;
  font-weight: 500;
  margin: 10px auto;
}
//底部按钮
.machine-card-btn-wrap{
  width: 100%;
  height: 25%;
  margin: 1px auto 5px auto;
}
.machine-card-btn{
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
</style>