<template>
  <div class="all-frame">
    <div class="frame-title">
      <p style="color: #fff;font-size: 32px;margin-left: 20px;opacity: 85%">{{mouldTitle}}</p>
    </div>
    <a-card>
<!--      <div class="title" style="display: flex;">-->
<!--        <span style="font-size: 17px;"><b>{{mouldTitle}}</b></span>-->
<!--        <div class="bottom-frame" v-if="!(mouldTitle == '模具维修详细信息')">-->
<!--          <a-button type="primary" @click="submitModel()" v-if="!(mouldTitle == '模具维修详细信息')">提交</a-button>-->
<!--        </div>-->
<!--      </div>-->
      <div class="number-frame frame-padding">
        <div style="margin-bottom: 2px" class="baseItemClass">
            <span class="left-text1">戴卡部件号</span>
            <div class="input-border1" >
              <a-input v-model="partNumber" placeholder="请选择"  :disabled="true" style="width: 200px;"/>
            </div>
          <a-button  @click="openSelect()" v-if="!(mouldTitle == '模具维修详细信息' || mouldTitle == '维修信息维护')" style="margin-left: 8px"><a-icon type="folder" /></a-button>
        </div>
      </div>
      <div class="basic-title frame-padding" v-if="mouldTitle == '模具维修详细信息'">
        <div>
          <span class="divide"> </span>
          <span>维修进度</span>
        </div>
      </div>
      <div class="number-frame" v-if="mouldTitle == '模具维修详细信息'">
        <a-steps :current="repairStatusNumber" labelPlacement="vertical">
          <a-step   v-for="(item , index) in dic.maintainState" :title="item.label" :key="index" />
        </a-steps>
      </div>
      <div class="basic-title frame-padding">
        <div>
          <span class="divide"> </span>
          <span>基本信息</span>
        </div>
      </div>
      <div class="basic-information-frame frame-padding">
        <div v-for="(item, index) of basicInformation" :key="index"  class="baseItem">
          <span class="left-text" :class="index === 6||index === 7 ?'bottomBorder':''">{{item.title}}</span>
          <div class="input-border" :class="[index === 2 ||index === 5 ?'rightBorder':'', index === 6||index === 7 ?'bottomBorder':'']">
            <a-input v-model="item.value" :placeholder="item.placeHolder" :disabled="mouldTitle == '模具维修详细信息' || index == 1 || index == 3"/>
          </div>
        </div>
        <div   class="baseItem">
          <span class="left-text bottomBorder"></span>
          <div class="input-border bottomBorder rightBorder">
          </div>
        </div>
      </div>
      <div class="basic-title frame-padding">
        <div>
          <span class="divide"> </span>
          <span>时间跟踪信息</span>
        </div>
      </div>
      <div class="basic-information-frame frame-padding">
        <div  class="baseItem1">
          <span class="left-text">送修日期</span>
          <div class="input-border2">
            <a-date-picker v-model:value="RepairDate" @change="RepairOnchange" format="YYYY-MM-DD" :disabled="mouldTitle == '模具维修详细信息'" style="width: 100%"/>
          </div>
        </div>
        <div  class="baseItem1">
          <span class="left-text">计划完成日期</span>
          <div class="input-border2 rightBorder">
            <a-date-picker v-model:value="PlanCompleteDate"  @change="PlanCompleteOnchange" format="YYYY-MM-DD" :disabled="mouldTitle == '模具维修详细信息'" style="width: 100%"/>
          </div>
        </div>
        <div  class="baseItem1">
          <span class="left-text bottomBorder">实际完成日期</span>
          <div class="input-border2 bottomBorder">
            <a-date-picker v-model:value="actualCompleteDate" @change="actualCompleteOnchange" format="YYYY-MM-DD" :disabled="mouldTitle == '模具维修详细信息'" style="width: 100%"/>
          </div>
        </div>
        <div  class="baseItem1">
          <span class="left-text bottomBorder">送检日期</span>
          <div class="input-border2 rightBorder bottomBorder">
            <a-date-picker v-model:value="checkDate"  @change="checkOnchange" format="YYYY-MM-DD" :disabled="mouldTitle == '模具维修详细信息'" style="width: 100%"/>
          </div>
        </div>
      </div>
      <div class="basic-title frame-padding">
        <div>
          <span class="divide"> </span>
          <span>加工状态</span>
        </div>
      </div>
      <div class="basic-information-frame frame-padding">
        <div class="baseItem1">
          <span class="left-text">维修状态</span>
          <div class="input-border2">
            <a-select  placeholder="请选择" v-model="repairStatus"  style="width: 100%; margin-left: 10px"  :disabled="mouldTitle == '模具维修详细信息'">
              <a-select-option v-for="data in option.maintain_state" :key="data.value" :value="data.value">
                {{ data.label }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div  class="baseItem1">
          <span class="left-text">修改原因</span>
          <div class="input-border2 rightBorder">
            <a-select  placeholder="请选择" v-model="repairReason1"  style="width: 100%; margin-left: 10px" :disabled="mouldTitle == '模具维修详细信息'">
              <a-select-option v-for="data in option.update_reason" :key="data.value" :value="data.value">
                {{ data.label }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div  class="baseItem2">
          <span class="left-text">修改内容</span>
          <div class="input-border3">
            <a-textarea
              v-model="modificationContent"
              placeholder="请输入"
              :auto-size="{ minRows: 1}"
              :disabled="mouldTitle == '模具维修详细信息'"
            />
          </div>
        </div>
        <div  class="baseItem2">
          <span class="left-text bottomBorder">备注</span>
          <div class="input-border3 bottomBorder">
            <a-textarea
              v-model="remark"
              placeholder="请输入"
              :auto-size="{ minRows: 1}"
              :disabled="mouldTitle == '模具维修详细信息'"
            />
          </div>
        </div>
      </div>
      <div class="bottom-frame1" >
        <a-button  @click="goBack()" style="margin-left: 20px">返回</a-button>
        <a-button type="primary" @click="submitModel()" v-if="!(mouldTitle == '模具维修详细信息')">提交</a-button>
      </div>
      <select-number ref="modal" v-on:get-text="getProjectNumber"></select-number>
    </a-card>
  </div>
</template>

<script>
  import SelectNumber from './SelectNumber'
  import {getMouldOptions,postMouldRepair, searchMouldRepairById,getOptions} from '@/api/api'
  export default {
    name: 'newMouldRepair',
    inject:['closeCurrent'],
    components: {SelectNumber},
    mounted() {
      this.getDic();

      this.mouldTitle = localStorage.getItem('mouldRepairTitle');
      this.getAppointOption();
      setTimeout(() => {
        console.log('this.dic.maintainState',this.dic.maintainState);
        if (localStorage.getItem('selectRepairId')) {
          this.mouldId = localStorage.getItem('selectRepairId');
          searchMouldRepairById( {id: this.mouldId}).then( (data) => {
            // console.log('data233333', this.dic.updateReason[data.result.updateReason].label);
            this.PlanCompleteDate = data.result.completionPlanDate;
            this.actualCompleteDate = data.result.completionRealityDate;
            this.partNumber = data.result.component;
            this.basicInformation[0].value = data.result.shopVisitDepartment;
            this.basicInformation[1].value = data.result.modelNumber;
            this.basicInformation[2].value = data.result.modelComponent;
            this.basicInformation[3].value = data.result.modelType;
            this.basicInformation[4].value = data.result.topDie;
            this.basicInformation[5].value = data.result.dieBlock;
            this.basicInformation[6].value = data.result.sealingDust;
            this.basicInformation[7].value = data.result.manHour;
            if(data.result.maintainState){
              this.dic.maintainState.forEach((item,index)=>{
                if(item.value == data.result.maintainState){
                  this.repairStatus = item.label;
                  this.repairStatusNumber = index;
                }
              })
            }
            // this.repairStatus = data.result.maintainState?this.dic.maintainState[data.result.maintainState].value: null;
            this.repairReason1 = data.result.updateReason?this.dic.updateReason[data.result.updateReason].value: null;
            this.remark = data.result.remark;
            this.checkDate = data.result.sendInspectionDate;
            this.RepairDate = data.result.sendRepairDate;
            this.modificationContent = data.result.updateContent;
          })
        }
      },500)
    },
    data() {
      return {
        repairStatusNumber:null,
        option: {
          maintain_state: [], //维修状态
          update_reason: [], // 修改原因
        },
        dic: { // 表单中的部分数据对应的的数据词典
          maintainState: [], // 维护状态
          updateReason: [], // 修改原因
        },
        mouldId: '', //查询id
        mouldTitle: '', // 页面标题
        partNumber: '', //戴卡部件号
        basicInformation: [ // 基本信息数组
          {
            title: '送修部门',
            value: '',
            placeHolder: '请输入送修部门'
          },
          {
            title: '模号',
            value: '',
            placeHolder: '请输入模号'
          },
          {
            title: '模具部件号',
            value: '',
            placeHolder: '请输入模具部件号'
          },
          {
            title: '模具制作类型',
            value: '',
            placeHolder: '请输入模具制作类型'
          },
          {
            title: '顶模',
            value: '',
            placeHolder: '请输入顶模'
          },
          {
            title: '底模',
            value: '',
            placeHolder: '请输入底模'
          },
          {
            title: '封尘',
            value: '',
            placeHolder: '请输入封尘'
          },
          {
            title: '工时',
            value: '',
            placeHolder: '请输入工时'
          },
        ],
        RepairDate: '', // 送修日期 双向绑定
        PlanCompleteDate: '', // 计划完成日期 双向绑定
        actualCompleteDate: '', //实际完成日期 双向绑定
        checkDate: '', // 送检日期 双向绑定
        repairStatus: undefined, //维修状态
        repairReason1: undefined, //维修原因
        modificationContent: '', //修改内容
        remark: '', // 备注

      }
    },
    methods: {
      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          getOptions(searchName, '').then((data) => {
            this.dic[name] = data;
          });
        }
        console.log('dic', this.dic.maintainState);
      },
      openSelect() {
        this.$refs.modal.add();
      },
      getProjectNumber(e) { // 父组件监听子组件值
        console.log('34678',e);
        this.partNumber = e.projectNumber;
        this.basicInformation[1].value = e.modelNumber;
        this.basicInformation[3].value = e.productionType;
      },
      RepairOnchange(value, dateString) {
        // const Timestamp = new Date(dateString[0]).getTime();
        this.RepairDate = dateString;
      },
      PlanCompleteOnchange(value, dateString) {
        this.PlanCompleteDate = dateString;
        console.log(' 2341515',this.PlanCompleteDate);
      },
      actualCompleteOnchange(value, dateString) {
        this.actualCompleteDate = dateString;
      },
      checkOnchange(value, dateString) {
        this.checkDate = dateString;
      },
      getAppointOption() { // 获取指定的下拉框
        for (let name in this.option) {
          // let searchName = this.humpOrLine(name, 'toLine');
          getMouldOptions(name, '').then((data) => {
            this.option[name] = data;
          });
        }
      },
      submitModel( ){
        const obj = {};
        if(this.mouldTitle == '维修信息维护'){
          obj.id = this.mouldId;
        }
        obj.component = this.partNumber; // 部件号
        obj.completionPlanDate = this.PlanCompleteDate; //计划完成日期
        obj.completionRealityDate = this.actualCompleteDate; //实际完成日期
        obj.shopVisitDepartment = this.basicInformation[0].value;//送修部门
        obj.modelNumber = this.basicInformation[1].value;//模号
        obj.modelComponent = this.basicInformation[2].value;//模号部件号
        obj.modelType = this.basicInformation[3].value;//模具制作类型
        obj.topDie = this.basicInformation[4].value;//顶模
        obj.dieBlock = this.basicInformation[5].value;//底模
        obj.sealingDust = this.basicInformation[6].value;//封尘
        obj.manHour = this.basicInformation[7].value;//工时
        obj.sendRepairDate = this.RepairDate//送修日期
        obj.sendInspectionDate = this.checkDate//送检日期
        obj.maintainState = this.repairStatus//维修状态
        obj.updateReason = this.repairReason1//修改原因
        obj.updateContent = this.modificationContent//修改内容
        obj.remark = this.remark//备注
        postMouldRepair(obj).then( (data)=>{
          this.$message.info(data.message);
          if(data.message == '成功') {
            this.$router.push({
              path: `/system/MouldRepair`,
            })
            this.closeCurrent();
          }
        });
      },
      goBack() {
        this.$router.push({
          path: `/system/MouldRepair`,
        })
        this.closeCurrent();
      },
      humpOrLine(name, type) { // 驼峰式转下划线 toLine 下划线转驼峰式 toHump
        if (type === 'toLine') {
          return name.replace(/([A-Z])/g, '_$1').toLowerCase();
        } else if (type === 'toHump') {
          return name.replace(/\_(\w)/g, function(all, letter) {
            return letter.toUpperCase();
          });
        }
      },

    }
  }
</script>

<style scoped>
  /deep/.ant-select-selection{
    border-width: 0;
  }
  /deep/.ant-select-disabled .ant-select-selection{
    background: #fff;
  }
  /deep/.ant-input{
    border-width: 0;
    font-size: 16px;
    color: #000;
  }
  /deep/ .ant-card-body{
    padding:0 24px 30px 24px;
  }
  .rightBorder{
    border-right-width:1px !important;
  }
  .bottomBorder{
    border-bottom-width:1px !important;
  }
  .all-frame{
    width: 60%;
    margin:  0 auto;
  }
  .frame-title{
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    background: url("../../assets/modalBackground.png") no-repeat;
  }
  .frame-padding{
    padding-left: 4px;
  }
  .number-frame{
    margin-top: 16px;
    margin-bottom: 32px;
  }
  .left-text {
    width: 151px;
    height: 100%;
    display: flex;
    font-size: 15px;
    font-family:  Semibold;
    align-items: center;
    background-color: #F5F8FA;
    padding-left: 12px;
    border-color:#e8e8e8;
    border-width: 1px 1px 0 1px;
    border-style:solid ;
  }
  .left-text1 {
    width: 136px;
    height: 100%;
    display: flex;
    font-size: 15px;
    font-family:  Semibold;
    align-items: center;
    background-color: #F5F8FA;
    padding-left: 12px;
    border-color:#e8e8e8;
    border-width: 1px;
    border-style:solid ;
  }
  .baseItem{
    width: 33%;
    height: 50px;
    display: flex;
    align-items: center;
  }
  .baseItem1{
    width: 50%;
    height: 50px;
    display: flex;
    align-items: center;
  }
  .baseItem2{
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
  }
  .input-border2{
    width: 323px;
    height: 100%;
    display: flex;
    align-items: center;
    border-color:#e8e8e8;
    border-width: 1px 0 0 0;
    border-style:solid ;
  }
  .input-border3{
    padding-left:5px ;
    width: 800px;
    height: 100%;
    display: flex;
    align-items: center;
    border-color:#e8e8e8 ;
    border-width: 1px 1px 0 0;
    border-style:solid ;
  }
  .input-border{
    width: 200px;
    height: 100%;
    display: flex;
    align-items: center;
    border-color:#e8e8e8;
    border-width: 1px 0 0 0;
    border-style:solid ;
  }
  .input-border1{
    width: 200px;
    height: 100%;
    display: flex;
    align-items: center;
    border-color:#e8e8e8;
    border-width: 1px 1px 1px 0;
    border-style:solid ;
  }
  .left-text-long{
    width: 120px;
  }
  .basic-title{
    width: 100%;
    height: 30px;
    background-color: #F2F2F2;
    border-radius: 5px;
    display: flex;
    align-items: center;
  }
  .basic-information-frame{
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 32px;
    margin-top: 12px;
  }
  .rightType{
    margin-left: 100px;
  }
  .rightType2{
    margin-left: 80px;
  }
  .bottom-frame{
    width: 80%;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
  }
  .bottom-frame1{
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
  }
  .divide{
    padding-left: 3px;
    border-radius: 25%;
    border-width: 0;
    height:20px;
    background-color: #1EAABF;
    margin-right: 8px
  }
  .baseItemClass{
    height: 50px;
    display: flex;
    align-items: center;
  }
</style>