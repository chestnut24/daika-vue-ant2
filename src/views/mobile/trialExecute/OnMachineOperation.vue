<template>
  <div class='on-machine-operation-wrap'>
    <div class='on-machine-top-bar'>
      <div>{{taskInfo.nowTrialSite}}</div>
      <span class='select-split'></span>
      <p>{{taskInfo.processTechnology}}</p>
      <span class='select-split'></span>
      <p>{{taskInfo.machineIndex }}</p>
    </div>
  <a-card :class='device'>
    <div class='on-machine-operation-wrap'>
      <div class='on-machine-operation-head'>
        {{ taskInfo.formBaseNo }}

      </div>
      <img src='@/assets/trialExe/on_machine_page_split.png' style='margin-top: 5px'>
      <div class='on-machine-operation-message-wrap'>
        <a-row type="flex" justify="space-between" align="middle">
          <a-col :span="12">轮型：<span class='grey-text'>{{taskInfo.projectNo}}</span></a-col>
          <a-col :span="12">
            <a-row type="flex"  align="middle">
              <a-col :span="24">产品尺寸：<span class='grey-text'>{{taskInfo.pSize}}</span></a-col>
          </a-row>
          </a-col>
        </a-row>
        <a-row  type="flex" justify="space-between" align="middle"  class='grid-margin'>
          <a-col :span="12">试制数量：<span class='grey-text'>{{taskInfo.trialProductionNumber}}</span></a-col>
          <a-col :span="12">
            <a-row type="flex"  align="middle">
              <a-col :span="24" class="gutter-row">试制用途：<span class='grey-text'>{{taskInfo.purpose}}</span></a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row type="flex" align="middle" class='grid-margin'>
          <a-col :span='24' class="gutter-row">当前工序预计完成日期：<span class='grey-text'>{{taskInfo.planCompletionTime.substr(0,10)}}</span></a-col>
        </a-row>
        <a-row type="flex" align="middle" class='grid-margin'>
          <a-col :span='24'>工序流程：   <span class='grey-text' :class="{'blue-text':isNowProcess(workFlowItem[0])}">{{workFlowItem[0]}}</span>
            <span v-for='item in workFlowItem.slice(1)' :key='item' class='grey-text'  :class="{'blue-text':isNowProcess(item)}">-<span>{{item}}</span></span></a-col>
        </a-row>
      </div>
      <div class='btn-wrap'>
        <div v-for='(btnItem,index) in jumpBtn' :key='index' class='opt-btn' @click="jumpPath(btnItem.path)">
          <img :src="require(`@/assets/trialExe/`+`${btnItem.imgName}`+`.png`)" style='width: 75px;height:75px'>
          <p>{{btnItem.name}}</p>
        </div>

      </div>

    </div>
  </a-card>
    <a-card :class='device' style='margin-top: 15px'>
      <div class='on-machine-operation-form-wrap'>
        <div class='number-input-wrap'>
          <span>流转数量</span>
          <div class='number-input-area'>
          <input v-model.lazy='queryParams.circulNumber' type='number' placeholder='请输入' @blur='testNegative' ></input>
          </div>
        </div>
        <div class='form-item'>
          <span>当前班次</span>
          {{userInfor.currentShift}}
        </div>
        <div class='form-item'>
          <span>操作手</span>
          {{userInfor.username }}
        </div>
        <div class='form-item' :class="{'none-bottem-border':!(taskInfo.processTechnology==='压铸')}">
          <span>确认流转单是否与实物一致</span>
          <a-switch v-model='queryParams.ifFit' style='width: 40px;'/>

        </div>

        <div class='form-item'  v-if="taskInfo.processTechnology==='压铸'">
          <span>是否与热处理工序联机</span>
          <a-switch v-model='queryParams.ifConnect' style='width: 40px;'/>
        </div>

      </div>
      <div v-if='processInstruction.length>0' class='instruction-wrap'>
        <p style='color: #a70f1d; font-weight: 700; font-size: 16px'>过程指令</p>
        <div class='instruction-frame'>{{instructionStr}}</div>
      </div>
      <div class='on-machine-operation-btn'>
        <a-button type="primary" style='width:300px;height: 40px' @click='OnMachineSubmit'>
          上机
        </a-button>
      </div>

    </a-card>
  </div>
</template>

<script>
const sessionStorge=window.sessionStorage;
import { mixinDevice } from '@/utils/mixin.js';
import store from '@/store/';

import {
  submitOnMachine,
  onMachineQuery
} from '@/api/api';

export default {
  name: 'OnMachineOperation',
  mixins: [mixinDevice],
  data(){
    return{
      taskInfo: {},
      workFlowItem: [],
      userInfor: {},
      jumpBtn:[
        {
        name:'试制记录',
          path:'/app/trialHistory',
          imgName:'process_records'
      },
        {
          name:'工序策划',
          path:'/app/processPlan',
          imgName:'process_plan'
        },
        {
          name:'执行反馈',
          path:'',
          imgName:'process_feedback'
        },
      ],
      processInstruction:[],
      queryParams: {
        ifFit: true,
        ifConnect: true,
        circulNumber: undefined
      }
    }
  },
  computed:{
    instructionStr(){
      return this.processInstruction.join(' ');
    }
  },
  created() {
    this.getMachineOperationInfo();
    this.getUserInfo();

  },
mounted(){
 let params={
   formBaseId:this.taskInfo.formBaseId,
   taskWorkSplitId:this.taskInfo.taskWorkSplitId,
   aopTrialSegment:'试制执行',
 }
   console.log("上机页面查询所传参数：",params)
  onMachineQuery(params).then((data) => {
    if (data.success) {
      console.log('上机页面查询的返回结果',data)
      if(data.result.length>0){
        for(let instructionItem of data.result){
          this.processInstruction.push(instructionItem.message)
        }
      }
    } else {
      this.$message.destroy()
      this.$message.error(data.message)
    }
  })

},


  methods:{
    testNegative(){
      console.log("this.queryParams.circulNumber",this.queryParams.circulNumber)
      console.log("testNegative")
      let  regu = /^\d+$/;
      if(!this.queryParams.circulNumber) {
        this.queryParams.circulNumber = ''
        return;
      }
      let numStr=this.queryParams.circulNumber.toString();
      console.log("numStr",numStr)
      if(!regu.test(numStr)){
        console.log("numStr===",numStr!=='')
        this.$message.warning('流转数量不能为负数',1);
        this.queryParams.circulNumber= undefined;
      }

    },
    getMachineOperationInfo(){   //获取上机任务详情（任务查询页面->查看任务 存于Session中)
      this.taskInfo=JSON.parse(sessionStorge.getItem('machineOperationInfo'))
      console.log("在上机页面中获取到的任务详情：",this.taskInfo)
      this.workFlowItem=this.taskInfo.workFlow.split('-')
      console.log("工作流程：",this.workFlowItem)
    },


    getUserInfo(){  //获取当前登录人信息
      this.userInfor = store.getters.userInfo;
      console.log('infor', this.userInfor);
      let newDate = new Date();
      let currentHour=newDate.toTimeString().substr(0,2)
      if(currentHour>=8&&currentHour<20)
        this.userInfor.currentShift='白班'
      else
        this.userInfor.currentShift='夜班'
    },
    isNowProcess(pro){
      return pro===this.taskInfo.processTechnology
    },

    //点击按钮跳转
    jumpPath(path) {
      let jumpQuery={}
      if(path==='/app/trialHistory'){
      // 上机页面无法跳转到试制记录
        this.$message.warning('任务未上机，无试制记录',2);
        return;
      }
      else if(path==='/app/processPlan'){
        jumpQuery={
          formBaseId: this.taskInfo.formBaseId,
        }
      }
      else if(path===''){
        this.$message.warning('任务未上机，无执行反馈',2);
        return;
      }
      console.log('task infor', this.taskInfo);
      this.$router.push({
        path: path,
        query:jumpQuery
      },);
    },
    OnMachineSubmit(){
      let binaryShift={
        'true':'1',
        'false':'0'
      };
        let stateShift={
          '上机':'0',
          '下机':'1',
          '待生产':'2',
          '中断':'3',
          '重启':'4'
      };
      let params={}
      params. currentShift=this.userInfor.currentShift;
      params. daikaPartNumber=this.taskInfo.projectNo;
      params.isItConsistent=binaryShift[this.queryParams.ifFit];
      params. isItHeatTreatmentOnline=binaryShift[this.queryParams.ifConnect];
      params. machineStation=this.taskInfo.machineIndex;
      params. operator=this.userInfor.username;
      params.  processFlowName=this.taskInfo.processTechnology;
      params.trialProductionSite = this.taskInfo.nowTrialSite;
      let nowState=this.taskInfo.taskState;
      params.taskOperatingState='0';

      if(!this.queryParams.circulNumber) {
        this.$message.warning('请输入流转数量',2);
        return;
      }
      else {
        params.transferNumber = this.queryParams.circulNumber.toString();
      }
      params.taskWorkSplitId=this.taskInfo.taskWorkSplitId;
      params.schedulingId=this.taskInfo.schedulingId;
      console.log("上机请求参数",params);
      submitOnMachine(params).then((data) => {
        if (data.success) {
          this.$message.success('已上机',2);

          console.log('上机接口的返回结果',data)
          this.$router.go(-1)
        } else {
          if(data.message==='操作失败，For input string: \"function Number() { [native code] }\"'){
            this.$message.warning('请输入流转数量',2);
          }
          else {
            this.$message.destroy()
            this.$message.error(data.message)
          }
        }
      })

    }
  }
}
</script>

<style lang="less" scoped>

&.mobile {
  *{
    margin: 0;
    padding: 0;
  }
  /deep/.ant-card-body{
    padding: 5px;
  }
  .grid-margin{
    margin-top:7px
  }
.on-machine-operation-wrap{
  display: flex;
  flex-direction: column;
  width: 100%;
}
  .grey-text{
    color: #878787;
    font-size: 14px;
  }
  .blue-text{
    color: #1890ff;
    font-weight: bolder;
    font-size: 14px;
  }
.on-machine-operation-head{
  width: 100%;
  height: 45px;
  font-size: 18px;
  padding: 15px;
}

  .on-machine-operation-message-wrap{
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 15px 0 15px 12px;
    border-bottom: 2px solid #f6f6f7;
  }
  .btn-wrap{
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: 10px;
  }

  .opt-btn{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 75px;
    height: 100px;
    color: #262626;
    font-size: 16px;

    //padding: ;
  }


//  下方表单部分（第二个a-card)
  .on-machine-operation-form-wrap{
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 10px;
    padding: 15px 12px 15px 12px;
  }
  .number-input-wrap{
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-bottom: 10px;
    border-bottom: 2px solid #f6f6f7;
  }
  .number-input-area{
    background-color: #f5f8fa;
    border-radius: 5px;
    padding: 6px;
    width: 100%;
    margin-top: 6px;

  }
  .number-input-area input{
    outline: none;
    border: none;
    width: 100%;
    height: 30px;
    text-align: left;
    color: #a2a2a2;
    background-color: transparent;
  }
  .number-input-area input::-webkit-input-placeholder{
    color: #a2a2a2;
  }


  .form-item{
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    border-bottom: 2px solid #f6f6f7;
    color: #a2a2a2;

  }
  .form-item /deep/.ant-switch{
    min-width: 30px;
  }
  .form-item span{
    color: #333333;
  }

  .form-item input{
    outline: none;
    border: none;
    width: 80px;
    text-align: right;
    color: #a2a2a2;
  }
  .form-item input::-webkit-input-placeholder{
    color: #a2a2a2;
  }
  .none-bottem-border{
    border-bottom: none !important;
  }

  //调整select样式使其右对齐
  .form-item /deep/.ant-select-selection{
    border: none;
  }
  .form-item /deep/.ant-select-arrow{
    right: 0;
  }
  .form-item /deep/.ant-select-selection-selected-value{
    margin-right: 20px;
    float: none;
    text-align: right;
    color: #a2a2a2;
  }
  .form-item /deep/.ant-select-selection__rendered{
    margin-right: 0;
  }

  .form-item /deep/.ant-select-search__field__placeholder, .form-item /deep/.ant-select-selection__placeholder{
    text-align: right;
    right: 15px;
    color: #a2a2a2;
  }

  .form-item /deep/.ant-select-open,.form-item /deep/.ant-select-selection{
    box-shadow: none;
  }
  //过程指令框
  .instruction-wrap{
   display: flex;
    flex-direction: column;
    padding: 15px 12px 15px 12px;
  }
.instruction-frame{
  border: 1px solid #a2a2a2;
  margin-top: 10px;
  padding: 5px 10px;
  color: #a70f20
}
  //上机按钮
  .on-machine-operation-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 10px;
  }
}



</style>
<style scoped>
.on-machine-top-bar{
  display: flex;
  flex-direction: row;
  width: 97%;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 8px;
  background:-webkit-linear-gradient(top,#0a243c,#032b56);
  margin: 0 auto 10px auto;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16);
}
.on-machine-top-bar p,.on-machine-top-bar div{
  height: 30px;
  line-height: 30px;
  color: white;
  margin-left: 20px;
  flex: 1;
}
.on-machine-top-bar .select-split{
  width: 2.5px;
  background-color: #1B3958;
}
</style>