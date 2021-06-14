<template>
<div class='task-track-home-wrap'>
  <a-card>
  <div class='search-bar-wrap'>
    <div class='search-item'>
     <span> 戴卡部件号：</span>
      <a-input style="" placeholder="请输入戴卡部件号" v-model="queryParam.projectNo"></a-input>
    </div>
    <div class='search-item'>
      <span>日期筛选：</span>
      <a-range-picker

     @change="trialDeliverDateChange"/>
    </div>
    <div class='search-item' style='margin-bottom: 16px' v-show='showComplete'>
      <span>任务状态：</span>
      <a-select mode="tags" :default-value="['全部']" style=" min-width: 120px;max-width: 240px" v-model='queryParam.taskStatusList'>
        <a-select-option v-for='status in taskStatus':key='status' :value="status">
          {{status}}
        </a-select-option>
      </a-select>
    </div>
    <div class='search-item'>
      <span> 任务名称：</span>
      <a-input placeholder="请输入关键字" v-model='queryParam.taskName' ></a-input>
    </div>
    <!-- 操作按钮区域 -->
    <div class='search-btn-wrap'>
      <div>
        <a-button type="primary" @click="getList">查询</a-button>
      </div>
      <div  style="margin-left: 20px">
        <a-button >重置</a-button>
      </div>
    </div>

<!--    展开/收起-->
    <div class='search-item'v-show='showComplete===false' @click='showComplete=!showComplete' >
      <a >展开 </a>
      <a-icon type="down" style='color:#1890FF' />
    </div>

    <div class='search-item'v-show='showComplete===true' @click='showComplete=!showComplete' >
      <a >收起 </a>
      <a-icon type="up" style='color:#1890FF' />
    </div>
  </div>
  </a-card>
  <a-card style='margin-top: 16px'>
  <div class='task-cards-wrap'>

 <TaskProcessCard v-for='(cardPropsItem,index) in cardPropsList' :key='index' :taskprocess-object='cardPropsItem'></TaskProcessCard>
 </div>
  </a-card>
  </div>

</template>

<script>
import TaskProcessCard from './TaskProcessCard'
import {
  getTaskTrialList,
  getDictItemsFromCache,
} from '@/api/api';
export default {
  name: 'TaskTrackHome',
  components: { TaskProcessCard },
  data(){
    return {
      showComplete:false,
      //查询参数
      queryParam: {
        projectNo: '', // 戴卡项目号
        completeStartTime:'', // 完成日期从
        completeEndTime: '', // 完成日期到
        taskName:'',
        taskStatusList:['全部']
      },
      //状态字典
      statusDic:{},
      taskStatus:['正常','预警','全部','延期','事态升级','已完成'],
      cardPropsList:[
        {
          customerName: "一汽奥迪",
          fourPlannedEndDate: null,
          fourPlannedStrtDate: null,
          fourProjectStatus: null,
          fourTaskInrId: null,
          newInfo: "张秀丰已提交'毛坯图' 21.05.10",
          onePlannedEndDate: "2021-05-08 13:49:23.0",
          onePlannedStrtDate: "2021-05-01 13:49:19.0",
          oneProjectStatus: "4",
          oneTaskInrId: "1001",
          projectId: 1,
          projectManagerName: "admin",
          projectNo: "05319c03",
          projectStatus: 3,
          riskPoints: "【05319c03】里程碑阶段二设计和开发完成 admin",
          threePlannedEndDate: null,
          threePlannedStrtDate: null,
          threeProjectStatus: null,
          threeTaskInrId: null,
          twoPlannedEndDate: "2021-05-09 13:49:37.0",
          twoPlannedStrtDate: "2021-05-08 13:49:33.0",
          twoProjectStatus: "4",
          twoTaskInrId: "1002"},
        {
          customerName: "一汽奥迪",
          fourPlannedEndDate: null,
          fourPlannedStrtDate: null,
          fourProjectStatus: null,
          fourTaskInrId: null,
          newInfo: "张秀丰已提交'毛坯图' 21.05.10",
          onePlannedEndDate: "2021-05-08 13:49:23.0",
          onePlannedStrtDate: "2021-05-01 13:49:19.0",
          oneProjectStatus: "4",
          oneTaskInrId: "1001",
          projectId: 1,
          projectManagerName: "admin",
          projectNo: "05319c03",
          projectStatus: 0,
          riskPoints: "【05319c03】里程碑阶段二设计和开发完成 admin",
          threePlannedEndDate: null,
          threePlannedStrtDate: null,
          threeProjectStatus: null,
          threeTaskInrId: null,
          twoPlannedEndDate: "2021-05-09 13:49:37.0",
          twoPlannedStrtDate: "2021-05-08 13:49:33.0",
          twoProjectStatus: "4",
          twoTaskInrId: "1002"},
        {
          customerName: "一汽奥迪",
          fourPlannedEndDate: null,
          fourPlannedStrtDate: null,
          fourProjectStatus: null,
          fourTaskInrId: null,
          newInfo: "张秀丰已提交'毛坯图' 21.05.10",
          onePlannedEndDate: "2021-05-08 13:49:23.0",
          onePlannedStrtDate: "2021-05-01 13:49:19.0",
          oneProjectStatus: "0",
          oneTaskInrId: "1001",
          projectId: 1,
          projectManagerName: "admin",
          projectNo: "05319c03",
          projectStatus:0,
          riskPoints: "【05319c03】里程碑阶段二设计和开发完成 admin",
          threePlannedEndDate: null,
          threePlannedStrtDate: null,
          threeProjectStatus: null,
          threeTaskInrId: null,
          twoPlannedEndDate: "2021-05-09 13:49:37.0",
          twoPlannedStrtDate: "2021-05-08 13:49:33.0",
          twoProjectStatus: "0",
          twoTaskInrId: "1002"},
        {
          customerName: "一汽奥迪",
          fourPlannedEndDate: null,
          fourPlannedStrtDate: null,
          fourProjectStatus: null,
          fourTaskInrId: null,
          newInfo: "张秀丰已提交'毛坯图' 21.05.10",
          onePlannedEndDate: "2021-05-08 13:49:23.0",
          onePlannedStrtDate: "2021-05-01 13:49:19.0",
          oneProjectStatus: "4",
          oneTaskInrId: "1001",
          projectId: 1,
          projectManagerName: "admin",
          projectNo: "05319c03",
          projectStatus: 3,
          riskPoints: "【05319c03】里程碑阶段二设计和开发完成 admin",
          threePlannedEndDate: null,
          threePlannedStrtDate: null,
          threeProjectStatus: null,
          threeTaskInrId: null,
          twoPlannedEndDate: "2021-05-09 13:49:37.0",
          twoPlannedStrtDate: "2021-05-08 13:49:33.0",
          twoProjectStatus: "4",
          twoTaskInrId: "1002"},
        {
          customerName: "一汽奥迪",
          fourPlannedEndDate: null,
          fourPlannedStrtDate: null,
          fourProjectStatus: null,
          fourTaskInrId: null,
          newInfo: "张秀丰已提交'毛坯图' 21.05.10",
          onePlannedEndDate: "2021-05-08 13:49:23.0",
          onePlannedStrtDate: "2021-05-01 13:49:19.0",
          oneProjectStatus: "4",
          oneTaskInrId: "1001",
          projectId: 1,
          projectManagerName: "admin",
          projectNo: "05319c03",
          projectStatus: 1,
          riskPoints: "【05319c03】里程碑阶段二设计和开发完成 admin",
          threePlannedEndDate: null,
          threePlannedStrtDate: null,
          threeProjectStatus: null,
          threeTaskInrId: null,
          twoPlannedEndDate: "2021-05-09 13:49:37.0",
          twoPlannedStrtDate: "2021-05-08 13:49:33.0",
          twoProjectStatus: "3",
          twoTaskInrId: "1002"},
        {
          customerName: "一汽奥迪",
          fourPlannedEndDate: null,
          fourPlannedStrtDate: null,
          fourProjectStatus: null,
          fourTaskInrId: null,
          newInfo: "张秀丰已提交'毛坯图' 21.05.10",
          onePlannedEndDate: "2021-05-08 13:49:23.0",
          onePlannedStrtDate: "2021-05-01 13:49:19.0",
          oneProjectStatus: "4",
          oneTaskInrId: "1001",
          projectId: 1,
          projectManagerName: "admin",
          projectNo: "05319c03",
          projectStatus: 2,
          riskPoints: "【05319c03】里程碑阶段二设计和开发完成 admin",
          threePlannedEndDate: null,
          threePlannedStrtDate: null,
          threeProjectStatus: null,
          threeTaskInrId: null,
          twoPlannedEndDate: "2021-05-09 13:49:37.0",
          twoPlannedStrtDate: "2021-05-08 13:49:33.0",
          twoProjectStatus: "1",
          twoTaskInrId: "1002"}
      ]
    }
  },
 mounted() {
    this.getStatusDict()
 },
  methods:{
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    //对获取的列表结果按状态排序
    sortListByStatus(a,b){
      return a['projectStatus']-b['projectStatus']
    },
    trialDeliverDateChange(value, dateString){
      this.queryParam.completeStartTime = value[0].format('YYYY-MM-DD 00:00:00');
      this.queryParam.completeEndTime = value[1].format('YYYY-MM-DD 23:59:59');
    },
    getList(){
      let params= JSON.parse(JSON.stringify(this.queryParam));
      console.log("原始params",params)
      params.taskStatusList.splice(0,params.taskStatusList.length)
      console.log("this.queryParam.taskStatusList",this.queryParam.taskStatusList)
      for(let status of this.queryParam.taskStatusList) {
        params.taskStatusList.push(this.statusDic[status])
      }
      console.log("任务追踪列表查询参数",params);
      getTaskTrialList({ }).then((data)=>{

        this.cardPropsList.push(data.result[0]);
        this.cardPropsList=this.cardPropsList.sort(this.sortListByStatus)
        console.log("任务追踪列表查询结果",this.cardPropsList)

      })

    },
    getStatusDict(){
      let name='project_status_plm';
      let statusDict=getDictItemsFromCache(name);
      for(let index in statusDict)
        this.statusDic[statusDict[index].text] =index;
      console.log("任务追踪页面获取到的状态字典",this.statusDic)
    }
  }
}
</script>

<style scoped>
/deep/ .ant-card-body{
  padding: 24px 32px;
}
*{
  margin: 0;
  padding: 0;
}
.task-track-home-wrap{
display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 4px;
}
.search-bar-wrap{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 100%;

}
.search-item{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 72px;
  min-height:32px;
}
.search-item span{
  white-space: nowrap;
  margin-right: 10px;
}
.task-cards-wrap{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}
.search-btn-wrap{
  width: 170px;
  display: flex;
  flex-direction: row;
}
.search-btn-wrap /deep/ .ant-btn-primary,.search-btn-wrap /deep/.ant-btn{
  width: 60px;
}

/deep/.ant-input{
  width: 244px;
  height: 32px;
  margin-left: 12px;
}
</style>