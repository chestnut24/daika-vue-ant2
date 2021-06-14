<template>
  <div class="primary-frame">
    <div class="trial-information-frame">
      <div class="information-show-frame">
        <div>
          <span style='color: #fff; font-size: 18px'>{{ userInfor.username }}</span>
          <br/>
          <span style='color: #fff; font-size: 14px'>{{ userInfor.nowTime }}&nbsp;&nbsp;{{userInfor.currentShift}}</span>
        </div>
         <div  class="scan">
           <img src="../../../assets/scan.png" height="50" width="50"/>
         </div>
      </div>
      <div class="information-select-frame">
        <div class="select-item">
          <a-dropdown>
            <a class="ant-dropdown-link"
               placement="bottomCenter"
               @click="e => e.preventDefault()">
              {{queryParams.trialProductionSite}}<a-icon type="down" />
            </a>
            <a-menu slot="overlay" style="width: 200px">
              <a-menu-item v-for='item in options.trial_production_site' :key="item"  @click="chooseSiteOnClick">
                <a href="javascript:;">{{item}}</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <div class="select-item-left">
          <a-dropdown placement="bottomCenter">
            <a class="ant-dropdown-link"
               @click="e => e.preventDefault()">
              {{queryParams.processTechnology}}<a-icon type="down" />
            </a>
            <a-menu slot="overlay" style="height: 200px;overflow-y: auto">
              <a-menu-item v-for='item in options.trialProcess' :key="item"  @click="choosePurposeOnClick">
                <a href="javascript:;">{{item}}</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </div>
    </div>
    <a-card :class='device'>
      <div class='trial-exe-tab-wrap'>
        <a-tabs default-active-key="1" @change="test" class="tab">
          <a-tab-pane key="1" tab="生产执行">
            <div class='tab-pane-scroll'>
              <span v-if="!(typeof resourceData[0]==='undefined')">
            <MachineCard v-for='(data, index) in resourceData' :key='index' :machineIndex='data.machine' :machine-task-info='getMachineTaskInfo(data)'></MachineCard>
                </span>
              <span v-else  style="display:flex;justify-content: center;align-items: center;margin: 0 auto; width: 100%;height: 200px;border-radius: 5px;background: #022c5a;color: white">无数据</span>
              <!--            <MachineCard :if-has-task='false' :machine-index=2></MachineCard>-->
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="执行反馈">
            <span v-if="feedBackArr.length !=0" >
              <template v-for="(item,index) in feedBackArr" >
                <feedback-machine-card   :machineIndex='item.productionMachine' :machineObject="item"></feedback-machine-card>
              </template>
            </span>
            <div v-else  style="display:flex;justify-content: center;align-items: center;margin: 0 auto; width: 100%;height: 200px;border-radius: 5px;background: #022c5a;color: white">
              暂无数据
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>

<script>
import {executiveFeedback} from  '@/api/api'
import { mixinDevice } from '@/utils/mixin.js';
import FeedbackMachineCard from './FeedbackMachineCard'
import MachineCard from './MachineCard';
import store from '@/store/';
import {
  getDictItemsFromCache,
  getProcessTreeTwo,
  getAppTrialExe,
} from '@/api/api';
export default {
  name: 'TrialExe',
  components: { MachineCard ,FeedbackMachineCard},
  mixins: [mixinDevice],
  data(){
    return {
      nowUser: '张工',
      tempTwo: '二',
      userInfor: { // 登录用户信息对象
        username: '',
        nowTime: '', // 登录时间
        currentShift:''
      },
      chooseSite:'请选择试制地',
      choosePurpose:'请选择工序',
      options:{
        trialProcess:[], //试制工序
        trial_production_site: [], // 试制地
      },

      queryParams: { // 请求参数
        processTechnology: '', // 工序
        trialProductionSite: '', // 试制地
      },
      resourceData: [], // 生产执行 请求返回列表
      feedBackArr:[],//试制反馈循环数组
    }
  },
  mounted() {
    this.getUserInfor();
    this.returnTime();
    this.getSelectOptions();
    this.getExecuteFeedBack();
  },
  methods: {
    test(key) {
      // this.$router.push('/app/taskQuery')
      // console.log('dic', this.dic )
      // this.queryList();
      if(key == 2){
        this.getExecuteFeedBack();
      }
      // this.$message.destroy();
      // this.$message.success('213');
    },

    getMachineTaskInfo(resourcrDataItem){
       let machineTaskInfo={
        trialSite:this.queryParams.trialProductionSite
       };
       if(resourcrDataItem.values.length===0){
         machineTaskInfo.ifHasTask=false;
         machineTaskInfo.processTechnology=this.queryParams.processTechnology;
         return machineTaskInfo}
       else{
         machineTaskInfo.ifHasTask=true;
         machineTaskInfo.processTechnology=resourcrDataItem.values[0].processTechnology;
         machineTaskInfo.trialProductionNumber=resourcrDataItem.values[0].trialProductionNumber;
         machineTaskInfo.planCompletionTime=resourcrDataItem.values[0].planCompletionTime;
         machineTaskInfo.projectNo=resourcrDataItem.values[0].projectNo;
         machineTaskInfo.purpose=resourcrDataItem.values[0].purpose;
         machineTaskInfo.formBaseNo=resourcrDataItem.values[0].formBaseNo;
         return machineTaskInfo;
       }
    },
    getSelectOptions() { // 获取表单中的部分字段对应的字典
      // for (let name in this.dic) {
      //   if (getDictItemsFromCache(name)) { // 从缓存中取dic
      //     this.dic[name] = getDictItemsFromCache(name);
      //   }
      //   console.log("dic",this.dic[name][0].text)
      // }
      this.options.trial_production_site = this.userInfor.siteList;
      this.options.trialProcess=this.userInfor.technologyList;

      this.queryParams.trialProductionSite=this.options.trial_production_site[0];
      this.queryParams.processTechnology=this.options.trialProcess[0];
      this.queryList();
    },
    queryList() {
      // let param = this.queryParams;
      let param = {
        processTechnology: this.queryParams.processTechnology,
        trialProductionSite: this.queryParams.trialProductionSite
      }
      getAppTrialExe(param).then((data) => {
        if (data.success) {
          data = data.result;
          this.resourceData=data;
        } else {
          this.$message.destroy();
          this.$message.error(data.message);
        }
      });
      this.getExecuteFeedBack();
    },

    getUserInfor() {
      this.userInfor = store.getters.userInfo;
      // console.log('infor', this.userInfor);
    },
    // getProcess(){ // 获取试制工序列表
    //   getProcessTreeTwo('').then((data) => {
    //     if (data.success) {
    //       this.options.trialProcess = data.result;
    //       this.queryParams.processTechnology=this.options.trialProcess [0].name
    //       console.log("trialProcess",this.options.trialProcess)
    //     } else {
    //       this.$message.error(data.message);
    //     }
    //   });
    // },
    returnTime() {
      let newDate = new Date();
      this.userInfor.nowTime = newDate.toLocaleDateString().replace(/\//g, "-") + " " + newDate.toTimeString().substr(0, 8);
      let currentHour=newDate.toTimeString().substr(0,2)

      if(currentHour>=8&&currentHour<20)
        this.userInfor.currentShift='白班'
      else
        this.userInfor.currentShift='夜班'
    },
    getExecuteFeedBack(){
      const param = {
        processTechnology: this.queryParams.processTechnology,
        trialProductionSite: this.queryParams.trialProductionSite
      }
      executiveFeedback(param).then((data)=>{
        if (data.success) {
          this.feedBackArr=[];
          this.feedBackArr=data.result;
          console.log("执行反馈接口获得结果",this.feedBackArr);
        } else {
          this.$message.destroy();
          this.$message.error(data.message);
        }
      })
    },
    chooseSiteOnClick(obj){
      this.queryParams.trialProductionSite = obj.key;
    },
    choosePurposeOnClick(obj){
      this.queryParams.processTechnology = obj.key;
      this.queryList();
    },


  },
}
</script>

<style lang="less" scoped>
  .dropdownStyle{
    height: 200px;
    overflow-y: auto;
  }
&.mobile {
/deep/.ant-card-body{
  padding: 5px;
  /*height: 1000px;*/
  /*overflow-y: auto;*/
}
/deep/ .ant-tabs-nav{
  width: 100%;
}
/deep/ .ant-tabs-nav .ant-tabs-tab{
  width: 50%;
  margin-left: 25px;
}
/deep/ .ant-tabs-ink-bar{
  left: -20px;
}
.primary-frame{
  width: 100%;
}
.trial-information-frame{
  width: 100%;
  height: 120px;
  border-radius: 5px;
  margin-bottom: 10px;
  background: url("../../../assets/mobileTrialBackground.png") no-repeat;
  .information-show-frame{
    width: 100%;
    height: 80px;
    border-width: 0 0 1px 0 ;
    border-style: solid;
    border-color: #183A5D;
    display: flex;
    padding: 10px;
    justify-content: space-between;
    .scan{
      margin-right: 10px;
    }
    .scan:active{
      opacity: 0.5;
    }
  }
  .information-select-frame{
    width: 100%;
    /*height: 100%;*/
    padding: 2px 0;
    display: flex;
    align-items: center;
    .select-item{
      width: 50%;
      margin-top: 5px;
      border-width: 0 1px 0 0;
      border-style: solid;
      border-color: #183A5D;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .select-item-left{
      width: 50%;
      margin-top: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.trial-exe-page-wrap{
  width: 100%;
  //height: 85vh;
  display: flex;
  flex-direction: column;

}
  .trial-exe-head-wrap{
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 140px;
    margin:5px 0;

  }

  .trial-exe-head-left{
    display: flex;
    flex-direction: column;
    width:80%;
    height: 100%;
    box-sizing: border-box;

  }
  .trial-exe-head-left>div{
    display: flex;
    flex-direction: row;

  }
//  tab栏部分
  .trial-exe-tab-wrap{
    width: 100%;
    /*height:460px;*/
    .tab{
      width: 100%;
    }
  }
  /deep/ .ant-tabs-nav{
    width: 100%;
    display: flex;
    flex-direction: row;

  }
.tab-pane-scroll{
  height: 400px;
  overflow-y: auto;
}

}
</style>