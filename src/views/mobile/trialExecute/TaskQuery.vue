
<template>

  <div class='task-query-wrap'>
    <div class='select-wrap'>
      <a-select v-model='nowTrialSite' style='width:35%' @change='test'>
        <a-select-option v-for='item in selectOptions.trial_production_site' :key='item'>
          {{ item }}
        </a-select-option>
      </a-select>
      <span class='select-split'></span>
      <a-select v-model='nowTrialProcess' style='width:35%' @change='test'>
        <a-select-option v-for='item in selectOptions.trialProcess' :key='item'>
          {{ item }}
        </a-select-option>
      </a-select>
      <span class='select-split'></span>
      <a-select v-model='nowMachineNo' style='width:30%' @change='test'>
        <a-select-option v-for='item in selectOptions.machineNo' :key='item'>
          {{ item }}
        </a-select-option>
      </a-select>
    </div>
  <a-card :class='device'>
    <div class='task-query-wrap'>

      <div class='task-query-main'>
<!--   <span v-if='taskDetailList.length===0' style="display:flex;justify-content: center;align-items: center;margin: 0 auto; width: 200px;height: 100px;border-radius: 5px;background: #022c5a;color: white">-->
   <span v-if='taskDetailList.length===0' style="display:flex;justify-content: center;align-items: center;margin: 0 auto; width: 100%;height: 200px;border-radius: 5px;background: #022c5a;color: white">
     暂无数据
   </span>
        <span v-else>

    <TaskDetailCard v-for='(item,index) in taskDetailList' :key='index' :task-state='getTaskState(item)'
                    :task-info='getTaskDetailObject(item)'></TaskDetailCard>
    </span>
      </div>
    </div>

  </a-card>
  </div>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import {
  getDictItemsFromCache,
  getAPPTaskList
} from '@/api/api'

import store from '@/store/'
import TaskDetailCard from './TaskDetailCard'


export default {
  name: 'TaskQuery',
  components: { TaskDetailCard },
  mixins: [mixinDevice],
  data() {
    return {
      userInfor: { // 登录用户信息对象

      },
      selectOptions: {
        trialProcess: [], //试制工序
        trial_production_site: [], // 试制地
        machineNo: []//机床编号
      },
      dataDic: {
        trial_machine: []
      },
      nowMachineNo: '1#',
      nowTrialProcess: '',
      nowTrialSite: '',
      taskDetailList: []
    }
  },
  mounted() {
    this.getUserInfo()
    this.getDataDic()
    this.getSelectOptions()
    this.getTaskList()
  },
  activated() {
    console.log("actvated")
    this.getTaskList()
    // this.getSelectOptions()
  },
beforeRouteEnter(to,from,next){
    console.log("to",to);
    console.log("from",from);

    next(vm=>{
      if(from.name==='app-trialExe'){
        vm.getSelectOptions()
      }
    })
},
  methods: {
    test() {
      this.getTaskList()
    },

    getTaskList() {
      let queryParams = {
        processTechnology: this.nowTrialProcess,
        productionMachine: this.nowMachineNo,
        trialProductionSite: this.nowTrialSite
      }
      console.log('传到获取任务查询接口的参数：', queryParams)
      getAPPTaskList(queryParams).then((data) => {
        if (data.success) {
          console.log("taskList",data)
          data = data.result
          console.log("原始任务列表",data)
          this.taskDetailList.splice(0,this.taskDetailList.length)
          //移除结果列表中为下机状态的任务
          for(let taskItem of data){
            if(taskItem.appOperatingState!==1)
              this.taskDetailList.push(taskItem)
          }

          console.log('获取任务查询接口的返回结果', this.taskDetailList)
        } else {
          this.$message.destroy()
          this.$message.error(data.message)
        }
      })
    },
    getTaskState(data) {
      if (data.appOperatingState === null)
        return '待生产'
      else if (data.appOperatingState === 0)
        return '上机'
      else if (data.appOperatingState === 1)
        return '下机'
      else if (data.appOperatingState === 3)
        return '中断'
      else
        return '重启'
    },

    //任务查询页面获取任务列表（根据不同的试制地、工序、机台）
    getTaskDetailObject(data) {

      let taskDetailInfo = {};
      taskDetailInfo.planCompletionTime = data.planCompletionTime;
      taskDetailInfo.processTechnology = data.processTechnology;
      taskDetailInfo.purpose = data.purpose;
      taskDetailInfo.projectNo = data.projectNo;
      taskDetailInfo.onMachineTime = data.onMachineTime;
      taskDetailInfo.trialProductionNumber = data.trialProductionNumber;
      taskDetailInfo.formBaseNo = data.formBaseNo;
      taskDetailInfo.pSize = data.psize;
      taskDetailInfo.no = data.no;
      taskDetailInfo.appTaskId = data.appTaskId;
      taskDetailInfo.schedulingId=data.id;
      taskDetailInfo.taskWorkSplitId=data.taskSplitId;
      taskDetailInfo.formBaseId=data.formBaseId
      taskDetailInfo.workFlow = data.workStr.replace(/,/g, '-');
      return taskDetailInfo
    },
    getUserInfo() {
      this.userInfor = store.getters.userInfo
      console.log('infor', this.userInfor)
    },
    getSelectOptions() {
      this.selectOptions.machineNo=[]
      this.selectOptions.trial_production_site = this.userInfor.siteList
      this.selectOptions.trialProcess = this.userInfor.technologyList
      for (let data of this.dataDic.trial_machine) {
        this.selectOptions.machineNo.push(data.text)
      }
      this.nowTrialSite = this.$route.query.nowTrialSite
      this.nowTrialProcess = this.$route.query.nowTrialProcess
      this.nowMachineNo = this.$route.query.nowMachineNo
    },
    getDataDic() {
      for (let name in this.dataDic) {
        console.log('name:', name)
        if (getDictItemsFromCache(name)) { // 从缓存中取dic
          this.dataDic[name] = getDictItemsFromCache(name)
        }

        console.log('dic', this.dataDic[name])
      }

    }

  }
}
</script>

<style lang='less' scoped>
.task-query-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.select-wrap{
  display: flex;
  flex-direction: row;
  width: 97%;
  //height: 92px;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 8px;
  background:-webkit-linear-gradient(top,#0a243d,#022c5b);
  margin: 0 auto 10px auto;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16);
}
.select-wrap /deep/.ant-select-selection{
  background-color: transparent;
  border: none;
  box-shadow: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.select-wrap /deep/.ant-select-arrow > *{
  color:#445E79 ;
  font-size: 14px;
}
.select-wrap /deep/.ant-select-arrow{
  right: 20px;
}
.select-wrap /deep/.ant-select-selection-selected-value{
  float: none;
  color: white;
}
.select-wrap .select-split{
  width: 2.5px;
  background-color: #1B3958;
}
&.mobile {
  /deep/.ant-card-body{
    padding: 5px 5px 15px 5px;
  }
  p {
    margin: 0
  }

  .grid-margin {
    margin-top: 5px
  }



  .task-query-head {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 140px;
    box-sizing: border-box;
    padding: 10px 0;
    border-bottom: 1px solid grey;
  }

  .task-query-head > div {
    display: flex;
    flex-direction: row;
  }

  .task-query-main {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 620px;

    overflow-y: scroll;
  }
  .task-query-main::-webkit-scrollbar { width: 0 !important }
}
</style>