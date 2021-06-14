<template>
  <a-modal
    :maskClosable="false"
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{style:{display:'none'}}"
    :footer="null"
    @cancel="handleCancel"
   >
    <a-card :bordered="false">
      <div>
        <a-table
          bordered
          ref="table"
          rowKey="id"
          size="middle"
          :columns="columns"
          :loading="loading"
          :dataSource="dataSource1"
          :pagination="false"
          class="table1">
          <!--策划-->
          <template slot="plan" slot-scope="text, record">
            <a @click="handlePlan(record)">查看</a>
          </template>
          <!--开始时间-->
          <template slot="onMachineTime" slot-scope="text, record" >
                <span v-if="dataSource2.length>0">{{dataSource2[0].onMachineTime}}</span>
          </template>

          <!--试制完成日期-->
          <template slot="outMachineTime" slot-scope="text, record" >
            <span v-if="dataSource2.length>0">{{dataSource2[0].outMachineTime}}</span>
          </template>
        </a-table>
      </div>
      <div>
       <a-row :gutter="24" style="margin-bottom: 24px">
         <a-col :span="24" style="margin-bottom: 12px">
           <h3>执行记录</h3>
         </a-col>
         <a-col :span="4" >
           <span>上机时间：</span>
             <span v-if="dataSource2.length > 0">{{dataSource2[0].onMachineTime}}</span>
         </a-col>
         <a-col :span="4">
           <span>上机人：</span>
             <span v-if="dataSource2.length > 0">{{dataSource2[0].onMachinePerson}}</span>
         </a-col>
       </a-row>
        <hr style="border:1px solid #d6d6d6;">
        <a-row :gutter="24" style="margin-top: 24px">
          <a-col :span="24" style="margin-bottom: 24px">
            <h3>质量信息</h3>
          </a-col>
          <a-col :span="24">
            <a-table
              bordered
              ref="table"
              rowKey="id"
              size="middle"
              :columns="columns2"
              :loading="loading"
              :dataSource="dataSource2"
              :pagination="false"
            class="table2">
              <!--试制单编号-->
              <template slot="formBaseNo"  slot-scope="text, record">
                <span v-if="dataSource1.length>0">{{dataSource1[0].formBaseNo}}</span>
              </template>

              <template slot="scrapQuantity" slot-scope="text, record">
                <span v-if="record.scrapQuantity">{{record.scrapQuantity}}</span>
                <span v-else>0</span>
              </template>
            </a-table>
          </a-col>
        </a-row>
        <a-row :gutter="24" v-if="dataSource2.length>0" >
          <template v-if="dataSource2[0].abnormalInterruptTime">
            <a-col :span="4" :class="dataSource2[0].abnormalInterruptTime?'rowCol6':''">
              <span>异常中断时间：</span>
              <span>{{dataSource2[0].abnormalInterruptTime}}</span>
            </a-col>
            <a-col :span="4" :class="dataSource2[0].abnormalInterruptTime?'rowCol6':''">
              <span>操作人：</span>
              <span>{{dataSource2[0].operationPerson}}</span>
            </a-col>
          </template>
        </a-row>
        <a-row :gutter="24" v-if="dataSource2.length>0"  >
          <template v-if="dataSource2[0].restartMachineNo">
            <a-col :span="4" :class="dataSource2[0].restartMachineNo?'rowCol6':''">
              <span>重启试制到：</span>
              <span>{{dataSource2[0].restartMachineNo}} 机台</span>
            </a-col>
            <a-col :span="4" :class="dataSource2[0].restartMachineNo?'rowCol6':''">
              <span>操作时间：</span>
              <span>{{dataSource2[0].restartMachineTime}}</span>
            </a-col>
            <a-col :span="4" :class="dataSource2[0].restartMachineNo?'rowCol6':''">
              <span>操作人：</span>
              <span>{{dataSource2[0].restartMachinePerson}}</span>
            </a-col>
            <a-col :span="4" :class="dataSource2[0].restartMachineNo?'rowCol6':''">
              <span>重启说明为：</span>
              <span>{{dataSource2[0].restartExplain}} </span>
            </a-col>
          </template>
        </a-row>
        <a-row :gutter="24" v-if="dataSource2.length>0" :class="dataSource2.length>0?'rowCol6':''">
          <a-col :span="4">
            <span>下机时间：</span>
            <span>{{dataSource2[0].outMachineTime}}</span>
          </a-col>
          <a-col :span="4">
            <span>下机人：</span>
            <span>{{dataSource2[0].outMachinePerson}}</span>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </a-modal>
</template>

<script>
    import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
    import { postAction, getAction,downFile } from '@/api/manage'
    export default {
        name: 'ImplementModal',
        data() {
            return {
                description: '生产执行记录',
                title:'',
                width:window.innerWidth-300+'px',
                /* table加载状态 */
                loading:false,
                visible:false,
                confirmLoading:false,
                dataSource1:[],
                dataSource2:[],
                labelCol: {
                    xs: {span: 24},
                    sm: {span:9},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 15},
                },
                form: this.$form.createForm(this),
                validatorRules: {},
                disableSubmit: false,
                record:{},
                model:{},
                id:'',
                name:'',
                solution:'',
                columns: [ // 表头
                    { title: '试制单编号', dataIndex: 'formBaseNo'},
                    { title: '试制数量', dataIndex: 'trialProductionNumber'},
                  /*  { title: '排产状态', dataIndex: 'scheduleStatus', align: 'center' },
                    { title: '生产状态', dataIndex: 'productionStatus', align: 'center' },*/
                    {dataIndex:'scheduleStatus',title:'排产状态',width:'150px' ,
                      customRender: (text, record, index) => {
                            //字典值替换通用方法
                            return filterDictText(this.scheduleStatusList, text);
                        }},
                    {dataIndex:'productionStatus',title:'生产状态',width:'150px',
                      customRender: (text, record, index) => {
                            //字典值替换通用方法
                            return filterDictText(this.productionStatusList, text);
                        }},
                    { title: '策划', dataIndex: 'plan',scopedSlots: { customRender: 'plan' }},
                    { title: '选择机台', dataIndex: 'productionMachine' },
                    { title: '试制完成日期', dataIndex: 'outMachineTime',scopedSlots: { customRender: 'outMachineTime' } },
                    { title: '排产时间', dataIndex: 'productionTime'},
                    { title: '开始时间', dataIndex: 'onMachineTime',scopedSlots: { customRender: 'onMachineTime' }},
                    { title: '预计完成时间', dataIndex: 'planCompletionTime'},
                ],
                columns2: [ // 表头
                    { title: '试制单号', dataIndex: 'formBaseNo',scopedSlots: { customRender: 'formBaseNo' }},
                    { title: '生产日期', dataIndex: 'onMachineTime'},
                    { title: '班次', dataIndex: 'currentShift'},
                    { title: '投入量', dataIndex: 'transferNumber'},
                    { title: '下转数量', dataIndex: 'loomTacklingNumber'},
                    { title: '报废数量', dataIndex: 'scrapQuantity',scopedSlots: { customRender: 'scrapQuantity' } },
                    { title: '操作人', dataIndex: 'operator'},
                ],
                scheduleStatusList:[],
                productionStatusList:[]
            }
        },
        created(){
            this.initDictConfig()
        },
        methods:{
            initDictConfig() {
                //初始化字典  排产
                initDictOptions('trial_schedule_status').then((res) => {
                    if (res.success) {
                        this.scheduleStatusList = res.result;
                    }
                });
                //生产
                initDictOptions('trial_production_status').then((res) => {
                    if (res.success) {
                        this.productionStatusList = res.result;
                    }
                });
            },
            handlePlan(record){
                this.$router.push({path:'/trialManage/modules/PlanList',
                    query: {taskWorkListId:JSON.stringify(record.taskWorkId),ruleCode:JSON.stringify(record.processTechnology)}})
            },
            details(scheduleInfo){
                console.log(scheduleInfo)
                getAction('/trial/taskScheduling/getProductionByScheduleId',{scheduleId:scheduleInfo.id}).then(res=>{
                        if(res.success){
                            if(res.result){
                                if(res.result.productionSchedulingVO){
                                    this.dataSource1=[{...res.result.productionSchedulingVO}]
                                }
                                this.dataSource2=res.result.productionAppTaskVOList?res.result.productionAppTaskVOList:[]
                            }
                        }
                    })
                this.visible=true
            },
            close () {
                this.$emit('close');
                this.visible = false;
                this.file=''
                this.fileName=''
                this.id=''
                this.solution=''
                this.name='';
            },
            handleCancel () {
                this.close()
            },
        }
    }
</script>

<style scoped lang="less">
  .rowCol6{
    margin-top: 24px
  }
  .rowCol6 /deep/ .ant-col-6{
    width: 25% !important;
    padding-left:0 !important;
  }
 .table1 /deep/ .ant-table-thead tr th,
 .table2 /deep/ .ant-table-thead tr th,
 .table1 /deep/ .ant-table-tbody tr td:last-child,
 .table2 /deep/ .ant-table-tbody tr td:last-child{
    padding: 8px 16px !important;
  }
  .table2 /deep/ .ant-table-thead > tr > th{
    background: #ebf9ff;
  }
  /deep/ .ant-card-body{
    padding: 0;
  }
  .table1{
    margin-bottom: 24px;
  }
</style>