<template>
<!--策划查看弹窗内容-->
<div class='modal-content-wrap'>
  <a-table
    ref="table"
    size="middle"
    bordered
    rowKey="id"
    :columns="columns"
    :dataSource="tableSource"
    :pagination="false"
    :loading="loading"
  >
    <!--压铸工艺-->
    <template slot="trialProductionTaskPlanCast" slot-scope="text, record">
      <template v-if="record.trialProductionTaskPlanCast">
        <a @click="handleCasting(record,'已策划')" v-if="record.trialProductionTaskPlanCast.planStatus==1">已策划</a>
        <a @click="handleCasting(record,'未策划')" v-else>未策划</a>
      </template>
      <a @click="handleCasting(record,'未策划')" v-else>未策划</a>
    </template>
    <!--X光机控制要求-->
    <template slot="trialProductionTaskPlanCastx" slot-scope="text, record">
      <template v-if="record.trialProductionTaskPlanCastx">
        <a @click="handleRequirement(record)" v-if="record.trialProductionTaskPlanCastx.planStatus==1">已策划</a>
        <a @click="handleRequirement(record)" v-else>未策划</a>
      </template>
      <a @click="handleRequirement(record)" v-else>未策划</a>
    </template>
    <!--热处理要求-->
    <template slot="TrialProductionTaskPlanHeat" slot-scope="text, record">
      <template v-if="record.trialProductionTaskPlanHeat">
        <a @click="handleHeat(record,'已策划')" v-if="record.trialProductionTaskPlanHeat.planStatus==1">已策划</a>
        <a @click="handleHeat(record,'未策划')" v-else>未策划</a>
      </template>
      <a @click="handleHeat(record,'未策划')" v-else>未策划</a>
    </template>
    <!--生产要求-->
    <template slot="requirement" slot-scope="text, record">
      <template v-if="record.trialProductionTaskPlanMachine">
        <a @click="handleMachining(record,'已策划')" v-if="record.trialProductionTaskPlanMachine.planStatus==1">已策划</a>
        <a @click="handleMachining(record,'未策划')" v-else>未策划</a>
      </template>
      <a @click="handleMachining(record,'未策划')" v-else>未策划</a>
    </template>
    <!--气密平衡-->
    <template slot="balance" slot-scope="text, record">
      <template v-if="record.trialProductionTaskPlanCommonList?record.trialProductionTaskPlanCommonList.length>0:false">
        <a @click="handleBalance(record,'已策划','气密平衡')" v-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='气密平衡' && ite.planStatus==1}) ">已策划</a>
        <a @click="handleBalance(record,'未策划','气密平衡')" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='气密平衡' && ite.planStatus==0}) ">未策划</a>
        <a @click="handleBalance(record,'未策划','气密平衡')" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType!='气密平衡' && ite.planStatus==1 &&  ite.planStatus!=0}) ">未策划</a>
      </template>
      <a @click="handleBalance(record,'未策划','气密平衡')" v-else>未策划</a>
    </template>
    <!--三坐标-->
    <template slot="coordinate" slot-scope="text, record">
      <template v-if="record.trialProductionTaskPlanCommonList?record.trialProductionTaskPlanCommonList.length>0:false">
        <a @click="handleBalance(record,'已策划','三坐标')" v-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='三坐标' && ite.planStatus==1}) ">已策划</a>
        <a @click="handleBalance(record,'未策划','三坐标')" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='三坐标' && ite.planStatus==0}) ">未策划</a>
        <a @click="handleBalance(record,'未策划','三坐标')" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType!='三坐标' && ite.planStatus==1 &&  ite.planStatus!=0}) ">未策划</a>
      </template>
      <a @click="handleBalance(record,'未策划','三坐标')" v-else>未策划</a>
    </template>
    <!--精车要求-->
    <template slot="TrialProductionTaskPlanTechnology" slot-scope="text, record">
      <template v-if="record.trialProductionTaskPlanTechnology">
        <a @click="handleFineCar(record,'已策划')" v-if="record.trialProductionTaskPlanTechnology.planStatus==1">已策划</a>
        <a @click="handleFineCar(record,'未策划')" v-else>未策划</a>
      </template>
      <a @click="handleFineCar(record,'未策划')" v-else>未策划</a>
    </template>
    <!--试制档案-->
    <template slot="archives" slot-scope="text, record">
      <template v-if="record.trialProductionTaskPlanCommonList?record.trialProductionTaskPlanCommonList.length>0:false">
        <a @click="handleArchives(record,'已策划','试制档案')" v-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='试制档案' && ite.planStatus==1}) ">已策划</a>
        <a @click="handleArchives(record,'未策划','试制档案')" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='试制档案' && ite.planStatus==0}) ">未策划</a>
        <a @click="handleArchives(record,'未策划','试制档案')" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType!=='试制档案' && ite.planStatus!==0 && ite.planStatus==1}) ">未策划</a>
      </template>
      <a @click="handleArchives(record,'未策划','试制档案')" v-else>未策划</a>
    </template>
    <!--试制跟踪-->
    <template slot="track" slot-scope="text, record">
      <template v-if="record.trialProductionTaskPlanCommonList?record.trialProductionTaskPlanCommonList.length>0:false">
        <a @click="handleArchives(record,'已策划','试制跟踪')" v-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='试制跟踪' && ite.planStatus==1}) ">已策划</a>
        <a @click="handleArchives(record,'未策划','试制跟踪')" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='试制跟踪' && ite.planStatus==0}) ">未策划</a>
        <a @click="handleArchives(record,'未策划','试制跟踪')" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType!=='试制跟踪' && ite.planStatus!==0 && ite.planStatus==1}) ">未策划</a>
      </template>
      <a @click="handleArchives(record,'未策划','试制跟踪')" v-else>未策划</a>
    </template>
    <!--通用-->
    <template slot="currency" slot-scope="text, record">
      <template v-if="record.trialProductionTaskPlanCommonList?record.trialProductionTaskPlanCommonList.length>0:false">
        <a @click="handleCurrency(record,'已策划')" v-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType==record.type && ite.planStatus==1}) ">已策划</a>
        <a @click="handleCurrency(record,'未策划')" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType==record.type && ite.planStatus==0}) ">未策划</a>
      </template>
      <a @click="handleCurrency(record)" v-else>未策划</a>
    </template>
  </a-table>
  <casting-modal  ref="casting" @ok="modalFormOk"></casting-modal>
  <xrequirement-modal ref="Xrequirement" @ok="modalFormOk"></xrequirement-modal>
  <!--热处理-->
  <heat-treatment-modal ref="heatModal" @ok="modalFormOk"></heat-treatment-modal>
  <!--生产要求-->
  <machining-modal ref="machingModal" @ok="modalFormOk"></machining-modal>

  <!--气密平衡-->
  <BalanceModal ref="balanceModal"  @ok="modalFormOk"></BalanceModal>

  <!--试制档案-->

  <spray-modal ref="sprayModal"  @ok="modalFormOk"/>
  <!--通用-->
  <currency-modal ref="currencyModal"  @ok="modalFormOk"></currency-modal>

  <!--精车工艺要求-->
  <fine-car-modal ref="fincarModal"  @ok="modalFormOk"></fine-car-modal>
</div>
</template>

<script>
import { getPlanByTaskId } from '@api/api';
import CastingModal from '../workshopProcess/modules/CastingModal'
import XrequirementModal from '../workshopProcess/modules/XrequirementModal'
import HeatTreatmentModal from '../workshopProcess/modules/HeatTreatmentModal'
import MachiningModal from '../workshopProcess/modules/MachiningModal'
import BalanceModal from '../workshopProcess/modules/BalanceModal'
import CurrencyModal from '../workshopProcess/modules/CurrencyModal'
import FineCarModal from '../workshopProcess/modules/FineCarModal'
import SprayModal from '../workshopProcess/modules/SprayModal'
export default {
  name: 'PlanModalContent',
  components: { FineCarModal, CurrencyModal, BalanceModal, MachiningModal, HeatTreatmentModal, XrequirementModal, CastingModal,SprayModal },
  props:['taskRecord'],
  data(){
    return{
      loading:false,
      ruleCode:'',
      tableSource:[{
        'formBaseNo':'',
        'processTechnology':'',
        'subNo':'',
        'trialProductionNumber':'',
        'purpose':'',
        'remarks':'',
      }],
      columns:[],
      columsList:{
        '压铸':['formBaseNo','processTechnology','subNo','trialProductionNumber','purpose','remarks','trialProductionTaskPlanCast','trialProductionTaskPlanCastx'], //铸造
        '热处理':['formBaseNo','processTechnology','subNo','trialProductionNumber','purpose','remarks','TrialProductionTaskPlanHeat'],
        '粗车':['formBaseNo','processTechnology','subNo','trialProductionNumber','purpose','remarks','requirement','balance','coordinate'], //机加
        '精车':['formBaseNo','processTechnology','subNo','trialProductionNumber','purpose','remarks','TrialProductionTaskPlanTechnology'],
        '喷涂':['formBaseNo','processTechnology','subNo','trialProductionNumber','purpose','remarks','archives','track'],//喷涂
        'other':['formBaseNo','processTechnology','subNo','trialProductionNumber','purpose','remarks','currency'],//通用
      },
      columnData: [
        {
          dataIndex: 'formBaseNo',
          key: 'formBaseNo',
          title: '试制单编号',
          width:170,
          align: 'center',
          scopedSlots: {customRender: 'formBaseNo'}
        },
        {
          title: '工序',
          dataIndex: 'processTechnology',
          key: 'processTechnology',
          align: 'center',
        },
        {
          dataIndex: 'subNo',
          key: 'subNo',
          title: '子序号',
          align: 'center',
        },
        {
          dataIndex: 'trialProductionNumber',
          key: 'trialProductionNumber',
          title: '试制数量',
          align: 'center',
        },
        {
          dataIndex: 'purpose',
          key: 'purpose',
          title: '用途',
          align: 'center',
        },
        {
          dataIndex: 'remarks',
          key: 'remarks',
          title: '备注',
          align: 'center',
        },
        {
          dataIndex: 'trialProductionTaskPlanCast',
          key: 'trialProductionTaskPlanCast',
          title: '压铸工艺',
          align: 'center',
          scopedSlots: {customRender: 'trialProductionTaskPlanCast'}
        },
        {
          title: 'X光机控制要求',
          key: 'trialProductionTaskPlanCastx',
          dataIndex: 'trialProductionTaskPlanCastx',
          align: 'center',
          scopedSlots: {customRender: 'trialProductionTaskPlanCastx'}
        },
        {
          title: '热处理要求',
          align: 'center',
          dataIndex: 'TrialProductionTaskPlanHeat',
          key: 'TrialProductionTaskPlanHeat',
          scopedSlots: {customRender: 'TrialProductionTaskPlanHeat'},
        },
        {
          title: '生产要求',
          align: 'center',
          dataIndex: 'requirement',
          key: 'requirement',
          scopedSlots: {customRender: 'requirement'},
        },
        {
          title: '气密平衡',
          align: 'center',
          dataIndex: 'balance',
          key: 'balance',
          scopedSlots: {customRender: 'balance'},
        },
        {
          title: '三坐标',
          align: 'center',
          dataIndex: 'coordinate',
          key: 'coordinate',
          scopedSlots: {customRender: 'coordinate'},
        },
        {
          title: '精车要求',
          align: 'center',
          dataIndex: 'TrialProductionTaskPlanTechnology',
          key: 'TrialProductionTaskPlanTechnology',
          scopedSlots: {customRender: 'TrialProductionTaskPlanTechnology'},
        },
        {
          title: '试制档案',
          align: 'center',
          dataIndex: 'archives',
          key: 'archives',
          scopedSlots: {customRender: 'archives'},
        },
        {
          title: '试制跟踪',
          align: 'center',
          dataIndex: 'track',
          key: 'track',
          scopedSlots: {customRender: 'track'},
        },

        {
          title: '通用',
          align: 'center',
          dataIndex: 'currency',
          key: 'currency',
          scopedSlots: {customRender: 'currency'},
        },
      ],
    }

  },
  mounted() {
    console.log("taskRecord",this.taskRecord)
    this.ruleCode=this.taskRecord.processTechnology;
    // this.tableSource[0]['formBaseNo']=this.taskRecord.projectNo;
    // this.tableSource[0]['processTechnology']=this.taskRecord.processTechnology;
    // this.tableSource[0]['trialProductionNumber']=this.taskRecord.trialProductionNumber;
    // this.tableSource[0]['remarks']=this.taskRecord.remarks;
    // this.tableSource[0]['subNo']=this.taskRecord.subNo;
    // this.tableSource[0]['purpose']=this.taskRecord.purpose;
    this.getPlanMessage();
    this.setColumns();

  },

  methods:{
    getPlanMessage(){
      this.loading=true;
      let params={
        appTaskId:this.taskRecord.taskId
      };
      console.log("点击策划弹窗获取策划信息所传参数：",params)
      getPlanByTaskId(params).then(res=>{
        if (res.success) {
      console.log("res",res);
      this.$set(this.tableSource,0,res.result)
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
        this.loading = false;
      })

    },
    setColumns(){
      console.log("ruleCode",this.ruleCode);
      let columnConfig=[];

      if(this.ruleCode=='热处理'){
        [...columnConfig] =this.columsList[this.ruleCode]
      }else if(this.ruleCode=='粗车'){
        [...columnConfig] =this.columsList[this.ruleCode]
      }else if(this.ruleCode=='喷涂'){
        [...columnConfig] =this.columsList[this.ruleCode]
      }else if(this.ruleCode=='压铸'){
        [...columnConfig] =this.columsList[this.ruleCode]
      }else if(this.ruleCode=='精车'){
        [...columnConfig] =this.columsList[this.ruleCode]
      }else{
        [...columnConfig] =this.columsList['other']
      }
      this.columns=[];
      columnConfig.forEach(config=>{
        let temp=this.columnData.filter((item,index)=>{
          return item.key==config
        })
        // console.log("temp",temp);
        if(temp[0].key=='currency'){
          temp[0].title=this.ruleCode+'工艺'
        }
        this.columns.push(temp[0])

      })
      console.log("columns",this.columns);
    },
    /*铸造工艺*/
    handleCasting(record,tag){
      record.formBase={
        project:{
          id:record.projectId,
          projectNumber:record.projectNo
        }
      }
      this.$refs.casting.add(record,tag)
      this.$refs.casting.disableSubmit=false
    },
    /*X光过程控制要求*/
    handleRequirement(record){
      record.formBase={
        project:{
          id:record.projectId,
          projectNumber:record.projectNo
        }
      }
      this.$refs.Xrequirement.add(record)
      this.$refs.Xrequirement.disableSubmit=false
    },
    /*热处理*/
    handleHeat(record,tag){
      record.formBase={
        project:{
          id:record.projectId,
          projectNumber:record.projectNo
        }
      }
      this.$refs.heatModal.add(record,tag)
      this.$refs.heatModal.disableSubmit=false
    },
    /*生产要求*/
    handleMachining(record,tag){
      record.formBase={
        project:{
          id:record.projectId,
          projectNumber:record.projectNo
        }
      }
      this.$refs.machingModal.add(record,tag)
      this.$refs.machingModal.disableSubmit=false
    },
    /*气密平衡==三坐标*/
    handleBalance(record,tag,name){
      record.formBase={
        project:{
          id:record.projectId,
          projectNumber:record.projectNo
        }
      }
      this.$refs.balanceModal.add(record,tag,name)
      this.$refs.balanceModal.disableSubmit=false
      this.$refs.balanceModal.title=name
    },
    /*试制档案===试制档案*/
    handleArchives(record,tag,name){
      record.formBase={
        project:{
          id:record.projectId,
          projectNumber:record.projectNo
        }
      }
      this.$refs.sprayModal.add(record,tag,name)
      this.$refs.sprayModal.disableSubmit=false
      this.$refs.sprayModal.title=name
    },
    /*通用*/
    handleCurrency(record,tag){
      record.formBase={
        project:{
          id:record.projectId,
          projectNumber:record.projectNo
        }
      }
      console.log('123', record);
      record.title=this.ruleCode+'工艺'
      this.$refs.currencyModal.add(record,tag,this.ruleCode)
      this.$refs.currencyModal.disableSubmit=false
      this.$refs.currencyModal.title=this.ruleCode+'工艺'
    },
    /*精车工艺要求*/
    handleFineCar(record,tag){
      record.formBase={
        project:{
          id:record.projectId,
          projectNumber:record.projectNo
        }
      }
      this.$refs.fincarModal.add(record,tag)
      this.$refs.fincarModal.disableSubmit=false
      this.$refs.fincarModal.title='精车工艺要求'
    },
    modalFormOk() {
      this.getPlanMessage()
    },
  }

}
</script>

<style lang='less' scoped>
.modal-content-wrap{
  display: flex;
  justify-content: center;
}
table {
  border-collapse: collapse;
}

table, td, th {
  border: 1px solid black;
  min-width: 30px;
}
table td,table th{
  padding: 5px 10px;
  text-align: center;
}
table th{
  background-color: #b4d8e9;
}
.special-width{
  width: 100px;
}
</style>