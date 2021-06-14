<template>
  <a-card>
    <h3 style="width: 100%;text-align: center">车间工艺策划</h3>
<!--    <a-button @click="test">test</a-button>-->
    <a-card title="试制流转单号信息">
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns1"
        :dataSource="formBase"
        :pagination="false"
        :loading="loading"
        >
        <!--项目经理-->
        <template slot="projectManager" slot-scope="text, record">
          <span>{{record.project.projectManager}}</span>
        </template>
        <!--试制单编号-->
        <template slot="trialProductionFormNo" slot-scope="text, record">
          <a @click="handleDetails(record,'试制流转单号信息')">{{record.trialProductionFormNo}}</a>
        </template>
        <!--用途-->
        <template slot="purposesTab" slot-scope="text, record" class="operate-row">
          <row-table style="width:100%;max-width: none" :columns="rowColumns" :data-source="record.purposes"></row-table>
        </template>
        <template slot="formCreateTime" slot-scope="text, record">
          <span>{{moment(record.formCreateTime).format('YYYY.MM.DD')}}</span>
        </template>
        <template slot="planSendSamplesDt" slot-scope="text, record">
          <span>{{moment(record.planSendSamplesDt).format('YYYY.MM.DD')}}</span>
        </template>
        <template slot="deliverDt" slot-scope="text, record">
          <span>{{moment(record.deliverDt).format('YYYY.MM.DD')}}</span>
        </template>
        <!--待处理时间-->
        <template slot="waitingTime" slot-scope="text, record">
          <span v-if="record.status==0" style="color:orange">{{(moment().diff(moment(record.waitingTime), 'h')/24).toFixed(1)}}天</span>
          <span v-else>{{(moment().diff(moment(record.waitingTime), 'h')/24).toFixed(1)}}天</span>
        </template>
      </a-table>
    </a-card>
    <a-card title="试制工序信息">
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns2"
        :dataSource="taskWorkVOList"
        :pagination="false"
        :loading="loading"
        >
        <!--试制单编号-->
        <template slot="trialProductionFormNo" slot-scope="text, record">
          <a @click="handleDetails(record,'试制工序信息')">{{record.trialProductionFormNo}}</a>
        </template>
        <!--用途-->
        <template slot="purposesTab" slot-scope="text, record" class="operate-row">
          <row-table style="width:100%;max-width: none" information :columns="rowColumns" :data-source="record.purposes"></row-table>
        </template>
        <template slot="prearrangementTime" slot-scope="text, record">
          <span>{{moment(record.prearrangementTime).format('YYYY.MM.DD')}}</span>
        </template>
        <template slot="deliverDt" slot-scope="text, record">
          <span>{{moment(record.deliverDt).format('YYYY.MM.DD')}}</span>
        </template>
        <!--待处理时间-->
        <template slot="waitingTime" slot-scope="text, record">
          <span v-if="record.status==0" style="color:orange">{{(moment().diff(moment(record.waitingTime), 'h')/24).toFixed(1)}}天</span>
          <span v-else>{{(moment().diff(moment(record.waitingTime), 'h')/24).toFixed(1)}}天</span>
        </template>
      </a-table>
    </a-card>
    <a-card title="工艺策划信息">
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="workSplitVOList"
        :pagination="false"
        :loading="loading"
        >
        <!--试制单编号-->
        <template slot="formBaseNo" slot-scope="text, record">
          <a @click="handleDetails(record)">{{record.formBaseNo}}</a>
        </template>
        <!--压铸工艺-->
        <template slot="trialProductionTaskPlanCast" slot-scope="text, record,index">
          <template v-if="record.trialProductionTaskPlanCast">
            <a @click="handleCasting(record,'已策划',index)" v-if="record.trialProductionTaskPlanCast.planStatus==1">已策划</a>
            <a @click="handleCasting(record,'未策划',index)" v-else>未策划</a>
          </template>
          <a @click="handleCasting(record,'未策划',index)" v-else>未策划</a>
        </template>
        <!--X光机控制要求-->
        <template slot="trialProductionTaskPlanCastx" slot-scope="text, record,index">
          <template v-if="record.trialProductionTaskPlanCastx">
            <a @click="handleRequirement(record,'已策划',index)" v-if="record.trialProductionTaskPlanCastx.planStatus==1">已策划</a>
            <a @click="handleRequirement(record,'未策划',index)" v-else>未策划</a>
          </template>
          <a @click="handleRequirement(record,'未策划',index)" v-else>未策划</a>
        </template>
        <!--热处理要求-->
        <template slot="TrialProductionTaskPlanHeat" slot-scope="text, record,index">
          <template v-if="record.trialProductionTaskPlanHeat">
            <a @click="handleHeat(record,'已策划',index)" v-if="record.trialProductionTaskPlanHeat.planStatus==1">已策划</a>
            <a @click="handleHeat(record,'未策划',index)" v-else>未策划</a>
          </template>
          <a @click="handleHeat(record,'未策划',index)" v-else>未策划</a>
        </template>
        <!--生产要求-->
        <template slot="requirement" slot-scope="text, record,index">
          <template v-if="record.trialProductionTaskPlanMachine">
            <a @click="handleMachining(record,'已策划',index)" v-if="record.trialProductionTaskPlanMachine.planStatus==1">已策划</a>
            <a @click="handleMachining(record,'未策划',index)" v-else>未策划</a>
          </template>
          <a @click="handleMachining(record,'未策划',index)" v-else>未策划</a>
        </template>
        <!--气密平衡-->
        <template slot="balance" slot-scope="text, record,index">
          <template v-if="record.trialProductionTaskPlanCommonList?record.trialProductionTaskPlanCommonList.length>0:false">
            <a @click="handleBalance(record,'已策划','气密平衡',index)" v-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='气密平衡' && ite.planStatus==1}) ">已策划</a>
            <a @click="handleBalance(record,'未策划','气密平衡',index)" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='气密平衡' && ite.planStatus==0}) ">未策划</a>
            <a @click="handleBalance(record,'未策划','气密平衡',index)" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType!='气密平衡' && ite.planStatus==1 &&  ite.planStatus!=0}) ">未策划</a>
          </template>
          <a @click="handleBalance(record,'未策划','气密平衡',index)" v-else>未策划</a>
        </template>
        <!--三坐标-->
        <template slot="coordinate" slot-scope="text, record,index">
          <template v-if="record.trialProductionTaskPlanCommonList?record.trialProductionTaskPlanCommonList.length>0:false">
              <a @click="handleBalance(record,'已策划','三坐标',index)" v-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='三坐标' && ite.planStatus==1}) ">已策划</a>
              <a @click="handleBalance(record,'未策划','三坐标',index)" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='三坐标' && ite.planStatus==0}) ">未策划</a>
              <a @click="handleBalance(record,'未策划','三坐标',index)" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType!='三坐标' && ite.planStatus==1 &&  ite.planStatus!=0}) ">未策划</a>
          </template>
          <a @click="handleBalance(record,'未策划','三坐标',index)" v-else>未策划</a>
        </template>
        <!--精车要求-->
        <template slot="TrialProductionTaskPlanTechnology" slot-scope="text, record,index">
          <template v-if="record.trialProductionTaskPlanTechnology">
            <a @click="handleFineCar(record,'已策划',index)" v-if="record.trialProductionTaskPlanTechnology.planStatus==1">已策划</a>
            <a @click="handleFineCar(record,'未策划',index)" v-else>未策划</a>
          </template>
          <a @click="handleFineCar(record,'未策划',index)" v-else>未策划</a>
        </template>
        <!--试制档案-->
        <template slot="archives" slot-scope="text, record,index">
          <template v-if="record.trialProductionTaskPlanCommonList?record.trialProductionTaskPlanCommonList.length>0:false">
            <a @click="handleArchives(record,'已策划','试制档案',index)" v-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='试制档案' && ite.planStatus==1}) ">已策划</a>
            <a @click="handleArchives(record,'未策划','试制档案',index)" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='试制档案' && ite.planStatus==0}) ">未策划</a>
            <a @click="handleArchives(record,'未策划','试制档案',index)" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType!=='试制档案' && ite.planStatus!==0 && ite.planStatus==1}) ">未策划</a>
          </template>
          <a @click="handleArchives(record,'未策划','试制档案',index)" v-else>未策划</a>
        </template>
        <!--试制跟踪-->
        <template slot="track" slot-scope="text, record,index">
          <template v-if="record.trialProductionTaskPlanCommonList?record.trialProductionTaskPlanCommonList.length>0:false">
              <a @click="handleArchives(record,'已策划','试制跟踪',index)" v-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='试制跟踪' && ite.planStatus==1}) ">已策划</a>
              <a @click="handleArchives(record,'未策划','试制跟踪',index)" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType=='试制跟踪' && ite.planStatus==0}) ">未策划</a>
              <a @click="handleArchives(record,'未策划','试制跟踪',index)" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType!=='试制跟踪' && ite.planStatus!==0 && ite.planStatus==1}) ">未策划</a>
          </template>
          <a @click="handleArchives(record,'未策划','试制跟踪',index)" v-else>未策划</a>
        </template>
        <!--通用-->
        <template slot="currency" slot-scope="text, record,index">
          <template v-if="record.trialProductionTaskPlanCommonList?record.trialProductionTaskPlanCommonList.length>0:false">
            <a @click="handleCurrency(record,'已策划',index)" v-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType==record.type && ite.planStatus==1}) ">已策划</a>
            <a @click="handleCurrency(record,'未策划',index)" v-else-if="record.trialProductionTaskPlanCommonList.find(ite=>{return ite.planType==record.type && ite.planStatus==0}) ">未策划</a>
          </template>
          <a @click="handleCurrency(record,'未策划',index)" v-else>未策划</a>
        </template>
      </a-table>
    </a-card>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <!--铸造-->
    <casting-modal ref="casting" @ok="modalFormOk"/>
    <!--X光机控制要求-->
    <xrequirement-modal ref="Xrequirement" @ok="modalFormOk"/>
    <!--热处理-->
    <heat-treatment-modal ref="heatModal" @ok="modalFormOk"/>
    <!--生产要求-->
    <machining-modal ref="machingModal" @ok="modalFormOk"/>
    <!--气密平衡-->
    <BalanceModal ref="balanceModal"  @ok="modalFormOk"/>
    <!--试制档案-->
    <spray-modal ref="sprayModal"  @ok="modalFormOk"/>
    <!--通用-->
<currency-modal ref="currencyModal"  @ok="modalFormOk"/>
    <!--精车工艺要求-->
    <fine-car-modal ref="fincarModal"  @ok="modalFormOk"/>
    <div class="instruction-msg" v-if="instructionMessage !== ''">过程指令：{{instructionMessage}}</div>
  </a-card>
</template>

<script>
    import { onMachineQuery } from '@api/api';
    import moment from "moment"
    import RowTable from '../../component/RowTable'
    import CastingModal from '../workshopProcess/modules/CastingModal'
    import { deleteAction, getAction,downFile,getFileAccessHttpUrl } from '@/api/manage'
    import XrequirementModal from '../workshopProcess/modules/XrequirementModal'
    import HeatTreatmentModal from '../workshopProcess/modules/HeatTreatmentModal'
    import BalanceModal from '../workshopProcess/modules/BalanceModal'
    import SprayModal from '../workshopProcess/modules/SprayModal'
    import MachiningModal from '../workshopProcess/modules/MachiningModal'
    import CurrencyModal from '../workshopProcess/modules/CurrencyModal'
    import FineCarModal from '../workshopProcess/modules/FineCarModal'
    export default {
        name: "PlanList",
        components: { FineCarModal, CurrencyModal, MachiningModal, SprayModal, BalanceModal, HeatTreatmentModal, XrequirementModal, CastingModal, RowTable },
        data() {
            return {
                instructionMessage: '', // 试制指令信息
                description: '车间工艺策划',
                moment,
                /* table加载状态 */
                loading:false,
                plannedTime: [],
                taskWorkListId:'',
                formBase:[],
                taskWorkVOList:[],
                workSplitVOList:[],
                ruleCode:'',
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
                columns:[],
                columns1: [ // 表头
                    { title: '试制单编号', dataIndex: 'trialProductionFormNo', align: 'center',scopedSlots: { customRender: 'trialProductionFormNo' }},
                    { title: '试制单创建日期', dataIndex: 'formCreateTime', align: 'center',scopedSlots: { customRender: 'formCreateTime' } },
                    { title: '项目经理', dataIndex: 'projectManager',align: 'center',scopedSlots: { customRender: 'projectManager' } },
                    { title: '计划发样时间', dataIndex: 'planSendSamplesDt', align: 'center' ,scopedSlots: { customRender: 'planSendSamplesDt' }},
                    { title: '计划毛坯数', dataIndex: 'planRoughcastNum', align: 'center' },
                    { title: '交付日期', dataIndex: 'deliverDt',align: 'center',scopedSlots: { customRender: 'deliverDt'  }},
                    { title: '试制用途', dataIndex: 'purposesTab', align: 'center',scopedSlots: { customRender: 'purposesTab' } },
                    { title: '计划量产地', dataIndex: 'planProductPlace', align: 'center' },
                ],
                columns2: [ // 表头
                    { title: '试制单编号', dataIndex: 'trialProductionFormNo', align: 'center',scopedSlots: { customRender: 'trialProductionFormNo' }},
                    { title: '工序', dataIndex: 'processTechnologyName', align: 'center',scopedSlots: { customRender: 'formCreateTime' } },
                    { title: '预排完成日期', dataIndex: 'prearrangementTime',align: 'center',scopedSlots: { customRender: 'prearrangementTime' } },
                    { title: '试制数量', dataIndex: 'planRoughcastNum', align: 'center' },
                    { title: '交付日期', dataIndex: 'deliverDt', align: 'center',scopedSlots: { customRender: 'deliverDt' } },
                    { title: '试制用途', dataIndex: 'purposesTab', align: 'center',scopedSlots: { customRender: 'purposesTab' } },
                ],
                rowColumns: [ // 行内表格
                    { title: '试制用途', dataIndex: 'purpose' },
                    { title: '数量', dataIndex: 'number' },
                ],
                rowColumns2:[
                    { title: '工序', dataIndex: 'processTechnologyName' },
                    { title: '试制地', dataIndex: 'trialProductionSite' },
                    { title: '预计时间', dataIndex: 'prearrangementTime'},
                    { title: '车间排序', dataIndex: 'currentNo' },
                ],
                url: {
                    accept:"/trial/task/receiveTask",
                    backInfo:'/trial/task/backTask',
                },
            }
        },
        computed:{
            columsList(){
                return {
                     '压铸':['formBaseNo','processTechnology','subNo','trialProductionNumber','purpose','remarks','trialProductionTaskPlanCast','trialProductionTaskPlanCastx'], //铸造
                     '热处理':['formBaseNo','processTechnology','subNo','trialProductionNumber','purpose','remarks','TrialProductionTaskPlanHeat'],
                     '粗车':['formBaseNo','processTechnology','subNo','trialProductionNumber','purpose','remarks','requirement','balance','coordinate'], //机加
                     '精车':['formBaseNo','processTechnology','subNo','trialProductionNumber','purpose','remarks','TrialProductionTaskPlanTechnology'],
                     '喷涂':['formBaseNo','processTechnology','subNo','trialProductionNumber','purpose','remarks','archives','track'],//喷涂
                     // 'other':['formBaseNo','processTechnology','subNo','trialProductionNumber','purpose','remarks','currency'],//通用
                }
            }
        },
        mounted(){
            if(this.$route.query.taskWorkListId){
                this.taskWorkListId=JSON.parse(this.$route.query.taskWorkListId)
                this.ruleCode=JSON.parse(this.$route.query.ruleCode)
                this.setColumns()
               // this.getPlanList(this.taskWorkListId)
            }

        },
        watch:{
            '$route': function(newRoute) {
                if(this.$route.query.taskWorkListId){
                    this.ruleCode=JSON.parse(this.$route.query.ruleCode)
                    this.setColumns()
                    this.taskWorkListId=this.$route.query.taskWorkListId
                }
            },
            taskWorkListId(n){
                if(n){
                  this.getPlanList(n)
                }
            }
        },
        methods: {
          test() {
            console.log('name', this.taskWorkVOList);
          },
            getInstruction() {
            let param = {
              formBaseId: this.formBase[0].id,
              aopTrialSegment: '车间试制策划',
              processName: this.taskWorkVOList[0].processTechnologyName,
            };
            onMachineQuery(param).then((data) => {
              if (data.success) {
                console.log('data data', data);
                data = data.result;
                // instructionMessage
                for (let i = 0; i < data.length; i++ ) {
                  this.instructionMessage = this.instructionMessage + ' ' + data[i].message;
                  // if (data[i].taskWorkSplitId !== null) {  // 第二个表单 工艺策划 如果 taskWorkSplitId 不为null 拼接 message
                  //   this.instructionMessage = this.instructionMessage + ' ' + data[i].message;
                  // }
                }
                // console.log('message', this.instructionMessage);
              } else {
                this.$message.destroy();
                this.$message.error(data.message);
              }
            });
          },
            modalFormOk() {
                this.getPlanList(this.$route.query.taskWorkListId)
            },
            handleDetails(record,tag){
                let no,id
                if(tag=='试制流转单号信息'){
                    no=record.trialProductionFormNo
                    id=record.id
                }else if(tag=='试制工序信息'){
                    no=record.trialProductionFormNo
                    id=record.formBaseId
                }else{
                    no=record.formBaseNo
                    id=record.formBaseId
                }
                this.$router.push({
                    path: `/trial/trialForm`,
                    query: {
                        id,//试制单主键  在你那边接口 formBaseId
                        no,//试制单编号  你那边接口 trialProductionFormNo
                    },
                })
            },
            setColumns(){
                let columnConfig=[]
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
                  console.log(this.ruleCode);
                        [...columnConfig] =['formBaseNo','processTechnology','subNo','trialProductionNumber','purpose','remarks','currency']
                }
                //if(this.ruleCode=='')
                //let [...columnConfig] =this.columsList[this.ruleCode]
                this.columns=[];
                columnConfig.forEach(config=>{
                    let temp=this.columnData.filter((item,index)=>{
                        return item.key==config
                    })
                   if(temp[0].key=='currency'){
                       temp[0].title=this.ruleCode+'工艺'
                    }
                    this.columns.push(temp[0])
                })
            },
            getPlanList(taskWorkListId){
                this.loading = true;
                getAction('/trial/taskWork/getWorkPlanByTaskWorkId',{taskWorkId:taskWorkListId}).then(res=>{
                    if (res.success) {
                        this.formBase=[{...res.result.formBase}]
                        this.taskWorkVOList=res.result.taskWorkVO?[{...res.result.taskWorkVO}]:[]
                        this.workSplitVOList=res.result.workSplitVOList
                        this.$nextTick(() => {

                          this.getInstruction();
                        })
                    }
                    if(res.code===510){
                        this.$message.warning(res.message)
                    }
                    this.loading = false;
                })
            },
            /*铸造工艺*/
            handleCasting(record,tag,index){
              record.formBase=this.formBase[0]
              record.workSplitVOList=this.workSplitVOList[index]
              console.log("record.formBase",record.formBase)
              console.log("this.formBase",this.formBase)
              this.$refs.casting.add(record,tag)
                if(tag=='已策划'){
                    this.$refs.casting.disableSubmit=true
                }else{
                    this.$refs.casting.disableSubmit=false
                }
            },
            /*X光过程控制要求*/
            handleRequirement(record,tag,index){
                record.formBase=this.formBase[0]
                record.workSplitVOList=this.workSplitVOList[index]
                this.$refs.Xrequirement.add(record,tag)
                if(tag=='已策划'){
                    this.$refs.Xrequirement.disableSubmit=true
                }else{
                    this.$refs.Xrequirement.disableSubmit=false
                }
            },
            /*热处理*/
            handleHeat(record,tag,index){
                record.formBase=this.formBase[0]
                record.workSplitVOList=this.workSplitVOList[index]
                this.$refs.heatModal.add(record,tag)
                if(tag=='已策划'){
                    this.$refs.heatModal.disableSubmit=true
                }else{
                    this.$refs.heatModal.disableSubmit=false
                }
            },
            /*生产要求*/
            handleMachining(record,tag,index){
                record.formBase=this.formBase[0]
                record.workSplitVOList=this.workSplitVOList[index]
                this.$refs.machingModal.add(record,tag)
                if(tag=='已策划'){
                    this.$refs.machingModal.disableSubmit=true
                }else{
                    this.$refs.machingModal.disableSubmit=false
                }
            },
            /*气密平衡==三坐标*/
            handleBalance(record,tag,name,index){
                record.formBase=this.formBase[0]
                record.workSplitVOList=this.workSplitVOList[index]
                this.$refs.balanceModal.add(record,tag,name)
                if(tag=='已策划'){
                    this.$refs.balanceModal.disableSubmit=true
                }else{
                    this.$refs.balanceModal.disableSubmit=false
                }
                this.$refs.balanceModal.title=name
            },
            /*试制档案===试制档案*/
            handleArchives(record,tag,name,index){
                record.formBase=this.formBase[0]
                record.workSplitVOList=this.workSplitVOList[index]
                this.$refs.sprayModal.add(record,tag,name)
                if(tag=='已策划'){
                    this.$refs.sprayModal.disableSubmit=true
                }else{
                    this.$refs.sprayModal.disableSubmit=false
                }
                this.$refs.sprayModal.title=name
            },
            /*通用*/
            handleCurrency(record,tag,index){
                record.formBase=this.formBase[0]
                record.workSplitVOList=this.workSplitVOList[index]
                record.title=this.ruleCode+'工艺'
                this.$refs.currencyModal.add(record,tag,this.ruleCode,name)
                if(tag=='已策划'){
                    this.$refs.currencyModal.disableSubmit=true
                }else{
                    this.$refs.currencyModal.disableSubmit=false
                }
                this.$refs.currencyModal.title=this.ruleCode+'工艺'
            },
            /*精车工艺要求*/
            handleFineCar(record,tag,index){
                record.formBase=this.formBase[0]
                record.workSplitVOList=this.workSplitVOList[index]
                this.$refs.fincarModal.add(record,tag)
                if(tag=='已策划'){
                    this.$refs.fincarModal.disableSubmit=true
                }else{
                    this.$refs.fincarModal.disableSubmit=false
                }
                this.$refs.fincarModal.title='精车工艺要求'
            }
        }
    }
</script>
<style scoped lang="less">
  .instruction-msg {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 50px;
    margin: 0 20px;
    color: red;
    font-size: 18px;
  }
</style>