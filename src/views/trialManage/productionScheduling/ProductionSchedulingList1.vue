<template>
  <a-row :gutter="24">
    <a-col style="padding-left:0" :span="12">
      <a-card>
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-select v-model="queryParams.trialProductionSite" placeholder="请选择试制地">
                    <a-select-option v-for="(item,index) in trialProductionSiteList" :key="item.id" :value="item.text">{{item.text}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item  :labelCol="{lg: {span: 7}, sm: {span: 7}}"
                              :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
                  <a-select  v-model="queryParams.processTechnology" placeholder="请选择工序">
                    <a-select-option v-for="(item,index) in listProcessTechnologyTree" :key="item.id" :value="item.name">{{item.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8" :push="3">
                <a-button  type="primary" @click="handelAdd">新增占位计划</a-button>
              </a-col>
            </a-row>
            <div>
              <span style="background-color: #eeeeee;padding:2px">排产计划表</span>
            </div>
            <hr  style="border:1px dashed #cccccc;">
            <a-row :gutter="24">
              <a-col :span="12" class="statuS">
                <a-form-item label="试制单编号">
                  <a-input placeholder="请输入试制单编号" v-model="queryParams.formBaseNo"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12" class="statuS">
                <a-form-item label="排产状态">
                  <j-dict-select-tag placeholder="请选择排产状态" @change="handelSchedule" :triggerChange="true" v-model="queryParams.scheduleStatus" dict-code="trial_schedule_status"/>
                </a-form-item>
              </a-col>
              <a-col :span="12" class="statuS">
                <a-form-item label="生产状态">
                  <j-dict-select-tag dict-code="trial_production_status" placeholder="请选择生产状态" v-model="queryParams.productionStatus"/>
                </a-form-item>
              </a-col>
              <a-col :span="12" class="statuS">
                <a-form-item label="试制完成时间">
                  <a-range-picker v-model="plannedTime" format="YYYY-MM-DD" :placeholder="['开始时间', '结束时间']" @change="changeTime" />
                </a-form-item>
              </a-col>
              <a-col :span="18" class="timeS">
                <a-form-item label="排产时间" >
                  <a-range-picker
                    format="YYYY-MM-DD"
                    @change="deliverDateChange"
                    :placeholder="['开始时间', '结束时间']"
                    v-model="deliveryDate"
                  ></a-range-picker>
                  <a-button type="link" class="special-date" @click="setTime('week')"><span>本周</span></a-button>
                  <a-button type="link" class="special-date" @click="setTime('month')"><span>本月</span></a-button>
                </a-form-item>
              </a-col>
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </a-col>
          </span>
            </a-row>
          </a-form>
        </div>
        <!-- 操作按钮区域 -->

        <!-- table区域-begin -->
        <div>
          <a-tabs default-active-key="0" @change="callback" v-model="activeKey">
            <a-tab-pane key="0" tab="待排产">
              <scheduling-page tab="待排产" :query-params="queryParamObject"/>
            </a-tab-pane>
            <a-tab-pane key="1" tab="已排产">
              <scheduling-page tab="已排产" :query-params="queryParamObject"/>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>
    </a-col>
    <a-col :span="12" style="padding-left: 0">
      <DHXGanttChart :config="projGanttCfg" :templates="projGanttTpls" :tasks="projGanttData"
                     ref="dhxGanttChartRef" @linkDelete="onLinkDelete" @scaleChange="onScaleChange"
                     @beforeExport="onBeforeExport" @afterExport="onAfterExport" @taskSelected="onTaskSelect"/>
    </a-col>
    <!--生产执行记录-->
    <implement-modal ref="implementModal" />
    <!--新增占位计划-->
    <a-modal
      title="新增占位计划"
      :width="500"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
      cancelText="关闭">
      <a-form :form="form">
        <a-form-model-item label="排产指令"
                           :labelCol="labelCol"
                           :wrapperCol="wrapperCol">
          <a-input  v-decorator="['scheduldInstructions', validatorRules.scheduldInstructions]"/>
        </a-form-model-item>
        <a-form-model-item label="预计完成时间"
                           :labelCol="labelCol"
                           :wrapperCol="wrapperCol">
          <j-date :showTime="true" date-format="YYYY-MM-DD HH:mm:ss" v-decorator="['planCompletionTime', validatorRules.planCompletionTime]" style="width: 100%"/>
        </a-form-model-item>
      </a-form>

    </a-modal>
  </a-row>
</template>

<script>
    import {gantt} from 'dhtmlx-gantt';
    import { deleteAction, getAction,downFile,getFileAccessHttpUrl } from '@/api/manage'
    import SchedulingPage from './SchedulingPage'
    import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
    import moment from "moment"
    import {formatDate, getDaysBetween, plusDate} from "@/utils/util";
    import DHXGanttChart from '@/components/dhx-gantt-chart/DHXGanttChart'
    import ImplementModal from './modules/ImplementModal'
    import { postAction } from '../../../api/manage'
    let init=1
    export default {
        name: "TaskReceptionList",
        components: { ImplementModal, SchedulingPage,DHXGanttChart},
        data() {
            return {
                description: '车间试制排产',
                activeKey:'0',
                queryParamObject:{},
                queryParams: {scheduleStatus:0,
                    processTechnology:'抛光',
                    trialProductionSite:'一号线'},
                plannedTime:[],
                deliveryDate:[],
                listProcessTechnologyTree:[],
                trialProductionSiteList:[],
                form: this.$form.createForm(this),
                confirmLoading: false,
                labelCol: {
                    xs: {span: 24},
                    sm: {span:6},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 12},
                },
                validatorRules:{
                    scheduldInstructions:{rules: [{ required: true, message: '请输入排产指令!' }]},
                    planCompletionTime:{rules: [{ required: true, message: '请选择预计完成时间!' }]},
                },
                tasks: {
                    data: [
                        { id: 1, text: "Task #1", start_date: "15-04-2020",duration: 10, progress: 0.6 ,color:"blue"},
                        { id: 2, text: "Task #2", start_date: "20-05-2020",duration: 20, progress: 0.4 ,color:"blue"},
                        { id: 3, text: "Task #2-1", start_date: "12-06-2020",duration: 38, progress: 0.4, parent: 2, color:"blue"},
                    ],
                },
                visible:false,
                projGanttCfg: {
                    readonly: true,
                    drag_progress: false,
                    startDateProp: 'planStartTime',
                    endDateProp: 'planEndTime',
                    durationProp: 'duration',
                    preTaskProp: 'workingProcedureIndexPre',
                    columns: [
                        {
                            name: 'machine',
                            label: '机台',
                            fieldType: 'string',
                            required: true,
                            align: 'center',
                            resize: true,
                            width:'80',
                            template(obj) {
                                return `${obj.machine}`;
                            },
                            order: 3
                        },
                        {
                            name: 'name',
                            label: '编号',
                            fieldType: 'string',
                            required: true,
                            align: 'center',
                            resize: true,
                            hide:true,
                            template(obj) {
                                return `${obj.name}`;
                            },
                            order: 1
                        },
                        {
                            name: 'onMachineTime',
                            label: '上机',
                            fieldType: 'date',
                            required: true,
                            align: 'center',
                            resize: true,
                            template(obj) {
                                if(obj.onMachineTime){
                                    return `${obj.onMachineTime}`;
                                }else{
                                    return '--'
                                }
                            },
                            order: 4
                        },
                        {
                            name: 'outMachineTime',
                            label: '下机',
                            fieldType: 'date',
                            required: true,
                            align: 'center',
                            resize: true,
                            template(obj) {
                                if(obj.outMachineTime){
                                    return `${obj.outMachineTime}`;
                                }else{
                                    return '--'
                                }
                            },
                            order: 5
                        },
                        {
                            name: 'start_date',
                            label: '开始时间',
                            fieldType: 'date',
                            required: true,
                            align: 'center',
                            resize: true,
                            hide:true,
                            template(obj) {
                                // return `${formatDate(obj.start_date, 'yyyy/MM/dd HH:mm:ss')}`;
                                return `${moment(obj.start_date).format('yyyy/MM/DD HH:mm:ss')}`
                            },
                            order:6
                        },
                    ]
                },
                projGanttTpls: {
                    task_text: function (start, end, task) {
                        return task.name;
                    }
                },
                projGanttData: null,
                currentTmpId: null
            }
        },
        created(){
            this.queryParamObject={...this.queryParams}
            this.getListProcessTechnologyTree()
            this.initDictConfig()
            /*获取排产视图*/
           this.getListProductionScheduling()
        },
        mounted() {
            //本地化
            gantt.i18n.setLocale("cn");
        },
        methods: {
            handelAdd(){
                if(!this.queryParams.processTechnology){
                    this.$message.warning('请先选择工序')
                }else if(!this.queryParams.trialProductionSite) {
                    this.$message.warning('请先选择试制地')
                }else{
                    this.form.resetFields();
                    this.visible=true
                }
            },
            close () {
                this.visible = false;
            },
            handleOk () {
                const that = this;
                // 触发表单验证
                this.form.validateFields((err, values) => {
                    if (!err) {
                        that.confirmLoading = true;
                        let trialProductionScheduling={
                            trialProductionSite:this.queryParams.trialProductionSite,
                            processTechnology:this.queryParams.processTechnology,
                            scheduldInstructions:values.scheduldInstructions,
                            planCompletionTime:values.planCompletionTime
                        }
                        postAction('/trial/taskScheduling/newOccupySchedulePlan',trialProductionScheduling).then(res=>{
                            if(res.success){
                                this.$message.success('添加成功')
                                this.getListProductionScheduling()
                                this.visible=false
                                that.close();
                            }else{
                                this.$message.error(res.message)
                                this.visible=true
                            }
                        }).finally(() => {
                            that.confirmLoading = false;
                        })
                    }
                })
            },
            handleCancel () {
                this.close()
            },
            handelSchedule(val){
              /*  if(val=='0' || val=='1'){
                    this.activeKey=val
                }*/
                this.queryParams.scheduleStatus=val
            },
            getListProductionScheduling(){
                let params={
                    /*currentDate:'2021-04-01',*/
                    currentDate:moment(new Date).format('YYYY-MM-DD'),
                    trialProductionSite:this.queryParams.trialProductionSite,
                    processTechnology:this.queryParams.processTechnology
                    /*trialProductionSite:'二号线',
                    processTechnology:'粗车'*/
                }
                getAction('/trial/taskScheduling/listProductionScheduling',params).then(res=>{
                    if (res.success) {
                        this.setProjGanttData(res.result);
                    }else{
                        this.setProjGanttData([]);
                    }
                })
            },
            setProjGanttData(tasks) {
                this.projGanttData = this.parseProjGanttData(tasks);
                setTimeout(() => {
                    this.$refs.dhxGanttChartRef.init();
                }, 150);
            },
            parseProjGanttData(tasks) {
                console.log(tasks)
                let ganttData = {
                    data: [],
                    links: []
                };
                let preTasks;
                // 解析基本数据和连接线
                tasks.forEach((item, index) => {
                    if(item.values.length){
                        item.values.forEach((itt,ind)=>{
                            // if(itt.productionTime==moment(new Date).format('yyyy-MM-DD')){
                            let first = itt.scheduldInstructions.indexOf("-") + 1; // 从第一个横杠算起（+1表示不包括该横杠）
                            let sheng = itt.scheduldInstructions.indexOf("-", first); // 第一个横杠后的第一个横杠（即第二个横杠）
                            var years = moment().year() ,month=moment().month(),day=moment().day();
                            let newData=  itt.scheduldInstructions.slice(first,sheng)
                            let scheduldDay=newData.substring(newData.lastIndexOf("\.")+1,newData.length);
                            let scheduldMonth= newData.substring(0,newData.lastIndexOf("\."))
                            if(newData)
                                itt.id=itt.id
                            if(itt.onMachineTime){
                                if(itt.outMachineTime){
                                    itt.name=itt.projectNoDK?itt.projectNoDK+' 已下机':'';
                                    itt.color="#868686"
                                } else if(itt.productionStatus==3){
                                    itt.name=itt.no?"NO."+itt.no+' 异常中断':'';
                                    itt.color="orange"
                                } else{
                                    itt.name=itt.projectNoDK?itt.projectNoDK:'';
                                }

                            } else{
                                itt.name=itt.no?"NO."+itt.no:'';
                            }
                                itt.machine=item.machine?item.machine:'';
                                itt.start_date=scheduldDay+'/'+scheduldMonth+'/'+years+' 00:00:00'
                                console.log(itt.start_date)
                                itt.end_date=scheduldDay+'/'+scheduldMonth+'/'+years+' 23:59:59'
                              /*  itt.start_date='25/04/2021 00:00:00'
                                console.log(itt.start_date)
                                itt.end_date='25/04/2021 23:59:59'*/
                                itt.onMachineTime=itt.onMachineTime? moment(itt.onMachineTime).format('HH:mm:ss'):null
                               // itt.outMachineTime=itt.outMachineTime? formatDate(itt.outMachineTime, 'HH:mm:ss'):null
                                itt.outMachineTime=itt.outMachineTime? moment(itt.outMachineTime).format('HH:mm:ss'):null
                                //itt.start_date = itt.productionTime ? formatDate(itt.productionTime, 'dd-MM-yyyy') : null;
                                // item.end_date = itt.planCompletionTime ? formatDate(itt.planCompletionTime, 'dd-MM-yyyy'): null;
                                ganttData.data.push(itt);
                           // }
                        })
                    }
                });
                return ganttData;
            },
            initDictConfig(){
                //初始化字典 - 试制地
                initDictOptions('trial_production_site').then((res) => {
                    if (res.success) {
                        this.trialProductionSiteList = res.result;
                    }
                });
            },
            onLinkDelete(taskData, ganttRef) {
                if (taskData.workingProcedureIndexPre) {
                    let preIndexs = taskData.workingProcedureIndexPre.split(',');
                    let preTasks = this.projGanttData.data.filter(item => {
                        return preIndexs.includes(item.workingProcedureIndexPre);
                    })
                    taskData.workingProcedureIndexPreName = preTasks.map(a => a.name).join(',');
                } else {
                    taskData.workingProcedureIndexPreName = '';
                }
                // console.info(taskData)
                ganttRef.updateTask(taskData.id);
            },
            onScaleChange(scale, editable) {
                if (!editable) {
                    this.enableEdit(false);
                }
            },
            onBeforeExport() {
                // 隐藏无需导出的列
                this.projGanttCfg.columns[0].hide = true;
                this.projGanttCfg.columns[3].hide = true;
                this.projGanttCfg.columns[7].hide = true;
                this.$refs.dhxGanttChartRef.refreshData();
            },
            onAfterExport() {
                setTimeout(() => {
                    console.info('onAfterExport')
                    this.projGanttCfg.columns[0].hide = !this.processEditable;
                    this.projGanttCfg.columns[3].hide = false;
                    this.projGanttCfg.columns[7].hide = false;
                    this.$refs.dhxGanttChartRef.refreshData();
                }, 300);
            },
            onTaskSelect(scheduleId) {
               // this.currentTmpId = task.tmpId
              this.$refs.implementModal.details(scheduleId)
              this.$refs.implementModal.title='生产执行记录'
            },
            getListProcessTechnologyTree(){
                getAction('/trial/processTechnology/listProcessTechnologyTree').then(res=>{
                    if(res.success){
                        this.listProcessTechnologyTree=res.result
                    }
                })
            },
            setTime(name) { // 快速确定时间，本日 本周 本月
                this.queryParams.scheduleDtEnd = moment().format("YYYY-MM-DD HH:mm:ss");
                if (name === 'month') {
                    this.queryParams.scheduleDtBegin =this.getTime();
                }else{
                    this.queryParams.scheduleDtBegin =this.getTimeWeek();
                }
                this.deliveryDate=[this.queryParams.scheduleDtBegin,this.queryParams.scheduleDtEnd]
            },
            getTimeWeek(){
                  var date = moment();
                  var dow = date.day();
                  var monday1 = date.subtract(dow-1, 'days').format('YYYY-MM-DD')//本周一
                  return monday1+' 00:00:00'
              },
            getTime(){
                var date = moment().startOf('month');   //当月第一天
                var y = date.get('year');
                var m = date.get('month') + 1;
                var d = date.get('date');
                if (y < 10) {
                    y = '0' + y;
                }
                if (m < 10) {
                    m = '0' + m;
                }
                if (d < 10) {
                    d = '0' + d;
                }
               let startDateString = y + "-" + m + "-" + d +' 00:00:00';
               return startDateString
            },
            deliverDateChange(value, dateString) { // 要求发货时间改变
               // this.queryParams.scheduleDtBegin = dateString[0];
               // this.queryParams.scheduleDtEnd = dateString[1];
                this.queryParams.scheduleDtBegin = value[0].format('YYYY-MM-DD 00:00:00');
                this.queryParams.scheduleDtEnd = value[1].format('YYYY-MM-DD 23:59:59');
            },

            changeTime(value, dateString) {
                this.queryParams.deliverDtBegin = value[0].format('YYYY-MM-DD 00:00:00');
                this.queryParams.deliverDtEnd = value[1].format('YYYY-MM-DD 23:59:59');
            },
            searchQuery(){
                this.queryParams = {...this.queryParams}
                console.log(this.queryParams)
                  if(this.queryParams.scheduleStatus==="0" || this.queryParams.scheduleStatus==="1"){
                   this.activeKey=this.queryParams.scheduleStatus
                }
                this.queryParamObject={...this.queryParams}
                this.getListProductionScheduling()
            },
            searchReset(){
                this.queryParams.scheduleDtBegin = ''
                this.queryParams.scheduleDtEnd = ''
                this.queryParams.deliverDtBegin = ''
                this.queryParams.deliverDtEnd = ''
                this.queryParams.formBaseNo=''
                this.deliveryDate=null
                this.plannedTime=null
                this.queryParams.productionStatus=null
               /* this.queryParams.scheduleStatus=''*/
                this.queryParamObject={...this.queryParams}
                this.getListProductionScheduling()
            },
            callback(val){
                 this.queryParams.scheduleStatus=val
                 this.searchQuery()
            },
        }
    }
</script>
<style scoped lang="less">
  .operate-row {
    .ant-btn {
      padding: 0;
    }
  }
  .gantt-container {
    height: 600px;
  }
  .new-page {
    height: 100%;
    background-color:#FFF;
    padding: 20px;
    border-radius: 4px;
  }
 /deep/ .hoursStyle{
   background-color: orange;
   color: white;
  }
 /deep/ .statuS .ant-form-item > .ant-form-item-label{
   width: 25% !important;
 }
  /deep/ .timeS .ant-form-item > .ant-form-item-label{
    width: 16.5% !important;
  }
  /deep/ .timeS .ant-calendar-picker{
    width: 58.5%;
  }
</style>