<template>
<div class='task-process-card-wrap' :style="{'border-color':statusColor(taskprocessObject.projectStatus)}">
  <div class='card-head'>
    <div class='task-identification'>
      <p>{{taskprocessObject.projectNo}}</p>
      <p style='margin-left: 10px'>{{taskprocessObject.customerName}}</p>
    </div>
    <p class='task-status' :style='{color:statusColor(taskprocessObject.projectStatus)}'>{{taskprocessObject.projectStatus}}</p>
  </div>
  <div class='project-manager-wrap'>
    <p>项目经理：{{taskprocessObject.projectManagerName}}</p>
  </div>
  <div class='project-process-wrap'>
    <p>项目进度</p>
    <p class='risk-points' v-show='taskprocessObject.riskPoints ' :style='{color:statusColor(taskprocessObject.projectStatus)}'>
      {{taskprocessObject.riskPoints}}
    </p>
    <div class='project-process-bar'>
      <div class='stage-bar1' style='z-index: 20' :style="{'background-color':statusColor(taskprocessObject.oneProjectStatus)}"></div>
      <div class='stage-bar2' style='z-index: 15' :style="{'background-color':statusColor(taskprocessObject.twoProjectStatus)}"></div>
      <div class='stage-bar3' style='z-index: 10' :style="{'background-color':statusColor(taskprocessObject.threeProjectStatus)}"></div>
      <div class='stage-bar4' style='z-index: 5' :style="{'background-color':statusColor(taskprocessObject.fourProjectStatus)}"></div>
    </div>
    <div class='project-process-schedule'>
      <div class='schedule-stage'>
        <p v-if='taskprocessObject.onePlannedStrtDate'>{{ taskprocessObject.onePlannedStrtDate.substring(0,10)}}</p>
        <p v-else>——</p>
        <p v-if='taskprocessObject.onePlannedEndDatee'>{{taskprocessObject.onePlannedEndDate.substring(0,10)}} </p>
        <p v-else>——</p>
        <span>项目策划</span>
      </div>
<!--      <div class='schedule-stage-split'></div>-->
      <div class='schedule-stage'>
        <p v-if='taskprocessObject.twoPlannedStrtDate'>{{taskprocessObject.twoPlannedStrtDate.substring(0,10)}} </p>
        <p v-else>——</p>
        <p v-if='taskprocessObject.twoPlannedEndDate'>{{taskprocessObject.twoPlannedEndDate.substring(0,10)}} </p>
        <p v-else>——</p>
        <span>产品设计</span>
      </div>
<!--      <div class='schedule-stage-split'></div>-->
      <div class='schedule-stage'>
        <p v-if='taskprocessObject.threePlannedStrtDate'>{{taskprocessObject.threePlannedStrtDate.substring(0,10)}} </p>
        <p v-else>——</p>
        <p v-if='taskprocessObject.threePlannedEndDate'>{{taskprocessObject.threePlannedEndDate.substring(0,10)}} </p>
        <p v-else>——</p>
        <span>过程设计</span>
      </div>
<!--      <div class='schedule-stage-split'></div>-->
      <div class='schedule-stage'>
        <p v-if='taskprocessObject.fourPlannedStrtDate'>{{taskprocessObject.fourPlannedStrtDate.substring(0,10)}} </p>
        <p v-else>——</p>
        <p v-if='taskprocessObject.fourPlannedEndDate'>{{taskprocessObject.fourPlannedEndDate.substring(0,10)}} </p>
        <p v-else>——</p>
        <span>过程确认</span>
      </div>
<!--      <div class='schedule-stage-split'></div>-->
    </div>
  </div>
  <div class='latest-development'>
    <p style='color:#555555;font-weight: bolder'>最新进展</p>
    <p style='color: #7f7f7f;font-size: 12px'>{{taskprocessObject.newInfo}}</p>
  </div>
</div>
</template>

<script>
export default {
  name: 'TaskProcessCard',
  props:[ 'taskprocessObject'],

  methods:{

    statusSort(a,b){

      const statusToNo={
        '事态升级':5,
        '延期':4,
        '预警':3,
        '正常':2,
        '完成':1
      };
      console.log(statusToNo[a]>=statusToNo[b])
      return statusToNo[b]-statusToNo[a]
    },

    statusColor(status){
      if(status!==null)
        status=status.toString();
      console.log("status",status)
      if(status==='0')
      {
        return '#70b603'
      }
      else if(status==='2'){
        return '#1687ba'
      }
      else if(status==='4'){
        return '#CB5709'
      }
      else if(status==='5'){
        return '#d9001b'
      }
      else if(status==='3'){
        return '#f59a23'
      }
      else if(status==='1'){
        return '#7f7f7f'
      }
    }
  },

}
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
}
.task-process-card-wrap{
  display: flex;
  flex-direction: column;
  width: 306px;
  padding: 10px 10px 5px 10px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 10px;
  margin-right: 15px;
  margin-bottom: 15px;
  flex-shrink: 0;
}
.card-head{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.task-identification{
  display: flex;
  flex-direction: row;
  color: #575757;
  font-weight: 600;
  font-size: 18px;
}
.task-status{
  font-weight: 600;
  font-size: 20px;
}
.project-manager-wrap{
  background-color: #f2f2f2;
  border-radius: 20px;
  padding: 3px 8px;
}
.project-process-wrap{
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
}
.risk-points{
  top:18px;
  position:absolute;
  right: -5px;
  font-size: 12px;
}
.project-process-bar{
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  height: 8px;
  background-color: #d7d7d7;
  border-radius: 20px;
  margin-top: 20px;
}
.project-process-bar .stage-bar1{
  width: 25%;
  height:100%;
  border-radius: 20px;
}
.project-process-bar .stage-bar2{
  position: absolute;
  left: 23%;
  width: 27%;
  height: 100%;
  border-radius: 20px;
}
.project-process-bar .stage-bar3{
  position: absolute;
  left: 48%;
  width: 27%;
  height: 100%;
  border-radius: 20px;
}
.project-process-bar .stage-bar4{
  position: absolute;
  left: 73%;
  width: 27%;
  height: 100%;
  border-radius: 20px;
}
.project-process-schedule{
  display: flex;
  flex-direction: row;
  width: 100%;
}
.schedule-stage{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  position:relative;
  /*border-right: 1px solid #7f7f7f;;*/
}
.schedule-stage p{
  color: #333333;
  font-weight: bold;
  font-size: 12px;
}
.schedule-stage span{
  color: #7f7f7f;
  font-size: 12px;
}
.schedule-stage::after{
content: '';
  position: absolute;
  right: 0;
  top:3px;
  width: 1px;
  height: calc(100% - 6px);
  background-color: #7f7f7f;
}
.schedule-stage-split{
  width: 1px;
  height: 30px;
  background-color: #7f7f7f;
  margin: 5px;
}
.latest-development{
  display: flex;
  flex-direction: column;
}

</style>