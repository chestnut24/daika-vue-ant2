<template>
  <div class="jn-public-table" style="overflow-x: auto">
    <a-card style="min-width: 1600px">
    <!-- 查询区域 -->
    <div class='table-page-search-wrapper'>
      <a-form layout='inline' @keyup.enter.native='searchQuery'>
        <a-row :gutter='24'>
          <a-col :xl='6'>
            <a-form-item label='试制单编号'>
              <a-input placeholder='请输入试制单编号' v-model='queryParam.trialProductionSearchDto.trialProductionFormNo'></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl='6'>
            <a-form-item label='戴卡部件号'>
              <a-input placeholder='请输入戴卡部件号' v-model='queryParam.trialProductionSearchDto.projectNo'></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl='6'>
            <a-form-item label='项目经理'>
              <a-input placeholder='请输入项目经理' v-model='queryParam.trialProductionSearchDto.projectManager'></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl='6' v-if="isShowOtherButtons">
            <a-form-item label='交付日期'>
              <a-range-picker style="width: 244px" format='YYYY-MM-DD' :placeholder="['开始时间', '结束时间']" @change='changeTime'/>
            </a-form-item>
          </a-col>
          <span  class='table-page-search-submitButtons'>
            <a-col :xl='6'>
              <a style="margin-right: 20px" @click="isShowOtherButtons = !isShowOtherButtons"> {{isShowOtherButtons?"收起":"展开"}} <a-icon :type="isShowOtherButtons?'up':'down'" /> </a>
              <a-button type='primary' @click='searchQuery' icon='search'>查询</a-button>
              <a-button @click='searchResets' icon='reload' style='margin-left: 8px'>重置</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>
    <!--    两个按钮-->
<!--    <div class='two-btn-wrap'>-->
<!--&lt;!&ndash;      <a-button type='primary'>查询</a-button>&ndash;&gt;-->
<!--      <a-button type='primary' style='margin-left: 15px' @click='()=>{uploadQualitySummaryVisible=true}'>上传质量总表-->
<!--      </a-button>-->
<!--    </div>-->
    </a-card>
    <a-card style="margin-top: 12px;min-width: 1600px">
      <div style="display: flex;justify-content: space-between;height: 40px">
        <h3>
          执行记录上传列表
        </h3>
        <a-button type='primary' style='margin-left: 15px' @click='()=>{uploadQualitySummaryVisible=true}'>上传质量总表
        </a-button>
      </div>
    <!--    表格部分-->
    <a-table ref='table'
             size='middle'
             bordered
             rowKey='id'
             :columns='columns'
             :loading="loading"
             :dataSource='recordList'
             :pagination=false
             :scroll='{ x: 2500, y: 400 }'
             @change='handleTableChange'>
      <!--  策划-->
      <a slot='trialPlan' slot-scope='text,record' @click='showPlanModal(text,record)'>查看</a>
      <!--  是否有异常反馈-->
      <template slot='totalFeedback' slot-scope='totalFeedback,record'>
        <a v-if='totalFeedback.abnormalFeedback||totalFeedback.abnormalFeedbackUrl'
           @click='showAbnormalFeedback(record)'>查看</a>
        <a v-else @click='showAddFeedback(record)'>添加</a>
      </template>
      <!--  是否有工艺记录上传-->
      <template slot='totalProcessParams' slot-scope='totalProcessParams,record'>
        <a v-if='totalProcessParams.craftParamUrl||totalProcessParams.processRecordUpload'
           @click='showProcessRecordFeedback(record)'>查看</a>

        <a v-else @click='showAddProcessRecordFeedback(record)'>添加</a>
      </template>

      <!--  是否有检查结果-->
      <template slot='inspectionResults' slot-scope='inspectionResults,record'>
        <a v-if='inspectionResults' @click='showInspectionResultsModal(record)'>查看</a>
        <a v-else>————</a>
      </template>


      <template slot='scheduleStatus' slot-scope='scheduleStatus'>
        <p>{{ scheduleStatusDic[scheduleStatus] }}</p>
      </template>

    </a-table>

    <!--    分页-->
    <div class='bottom-page'>
      <a-pagination
        :total=page.total
        :show-total='total => `共 ${total} 条`'
        :page-size=page.pageSize
        :current='page.currentPage'
        @change='pageChange'
      />
      <div style='margin: 0 20px'>共 {{ page.pageNum }} 页</div>
      <div style='margin: 0 10px 0 0'>到第</div>
      <a-input-number style='width: 50px' @keyup.enter.native='pageJump(page.jumpPage)'
                      v-model='page.jumpPage'></a-input-number>
      <div style='margin: 0 20px 0 10px'>页</div>
      <a-button type='primary' @click='pageJump(page.jumpPage)'>确定</a-button>
    </div>
    <!--    策划查看弹窗-->
    <a-modal v-model='planModalVisible' title='策划信息' :width='800'>
      <template slot='footer'>
        <div class='plan-modal-footer'>
          <a-button>
            提交
          </a-button>
          <a-button @click='() => planModalVisible=false'>
            取消
          </a-button>
        </div>
      </template>
      <PlanModalContent :task-record='toPlanModalRecord' :key='planModalContentKey'></PlanModalContent>
    </a-modal>

    <!--    添加异常反馈弹窗-->
    <AddFeedbackModal :modal-visible.sync='addFeedbackModalVisible'
                      :exe-record-obj='feedbackModalObj' @reload-list='getRecordList'></AddFeedbackModal>
    <!--    查看异常反馈弹窗-->
    <ShowFeedbackModal :modal-visible.sync='showFeedbackModalVisible' :exe-record-obj='feedbackModalObj'
                       :feedback-content='toFeedbackModal'></ShowFeedbackModal>
    <!-- 添加工艺记录弹窗-->
    <AddProcessRecordModal :modal-visible.sync='addProcessRecordModalVisible'
                           :exe-record-obj='processRecordModalObj' @reload-list='getRecordList'></AddProcessRecordModal>
    <!--    查看工艺记录弹窗-->
    <ShowProcessRecord :modal-visible.sync='showProcessRecordModalVisible'
                       :exe-record-obj='processRecordModalObj'
                       :show-record-content='toProcessRecordModal'></ShowProcessRecord>

    <!--    查看检查结果弹窗-->
    <ShowInspectionResults :modal-visible.sync='showInspectionResultsVisible' :exe-record-obj='inspectionResultModalObj'
                           :inspection-obj='toInspectResultModal'></ShowInspectionResults>

    <a-modal
      title="上传质量总表"
      :dialog-style="{ top: '20px' }"
      :visible="uploadQualitySummaryVisible"
      @ok="() => { uploadQualitySummaryVisible=false}"
      @cancel="() =>{ uploadQualitySummaryVisible=false}"
      :width='480'
    >
      <a-upload
        name="file"
        :multiple="true"

        :customRequest='uploadQualityFile'

        @change=""
        accept="application/vnd.ms-excel,
            application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      >
        <a-button>
          <a-icon type="upload"/>
          点击上传文件
        </a-button>
      </a-upload>

    </a-modal>
  </a-card>
  </div>
</template>

<script>
  import AddFeedbackModal from './AddFeedbackModal';
  import {
    getTrialRecordList,
    getCastingFeedback,
    getFiningFeedback,
    getMachiningFeedback,
    getFinishingRecord,
    getMachingRecord,
    getCastingRecord,
    uploadQualitySummary,
    getCastingInspectionResults,
    getMachingInspectionResults,
    getHotInspectionResults,
  } from '@/api/api';
  import PlanModalContent from './PlanModalContent';
  import ShowFeedbackModal from './ShowFeedbackModal';
  import AddProcessRecordModal from './AddProcessRecordModal';
  import ShowProcessRecord from './ShowProcessRecord';
  import ShowInspectionResults from './showInspectionResults';

  export default {
    name: 'ExecutionRecordUpload',
    components: {
      ShowInspectionResults,
      ShowProcessRecord,
      AddProcessRecordModal,
      ShowFeedbackModal,
      PlanModalContent,
      AddFeedbackModal,
    },
    computed: {
      importExcelUrl: function() {
        return `${window._CONFIG['domianURL']}` + `trial/uploadExecl/importExecl`;
      },
    },
    data() {

      return {
        loading: false,
        //弹窗控制
        showFeedbackModalVisible: false,
        addFeedbackModalVisible: false,
        planModalVisible: false,
        addProcessRecordModalVisible: false,
        showProcessRecordModalVisible: false,
        uploadQualitySummaryVisible: false,
        showInspectionResultsVisible: false,
        planModalContentKey: 0,

        //用于添加/查看策划弹窗头部中基础信息的显示
        toPlanModalRecord: {},

        //异常反馈查看弹窗详细信息
        toFeedbackModal: {},
        //用于添加/查看工艺记录弹窗头部中基础信息的显示
        processRecordModalObj: {},
        //工艺记录查看弹窗详细信息
        toProcessRecordModal: {},

        //向查看检查结果弹窗传递参数
        inspectionResultModalObj: {},
        //向查看检查结果弹窗传递详情信息
        toInspectResultModal: {},
        //执行记录列表查询所传参数
        queryParam: {
          trialProductionSearchDto: {
            trialProductionFormNo: '',
            customerName: '',
            maintenanceStatus: '',
            productSpecifications: '',
            projectNo: '',
            riskStatus: '',
            trialProductionDate: '',
            vehiclePlatform: '',
          },
          pageNo: 1,
          pageSize: 5,
        },
        scheduleStatusDic: ['待排产', '已排产', '试制中'],
        //分页
        page: { // 分页
          total: 0, // 共多少条
          pageSize: 5, // 一页多少条
          pageNum: 0, // 共多少页
          currentPage: 1, // 当前页
          jumpPage: 1, // 跳转到第几页,
        },
        //异常反馈弹窗内容
        feedbackModalObj: {},
        columns: [
          { title: '试制工序', dataIndex: 'processTechnology', align: 'left' },
          { title: '试制地', dataIndex: 'trialProductionSite', align: 'left' },
          { title: '试制单编号', dataIndex: 'formBaseNo', align: 'left', width: '280px' },
          { title: '试制完成日期', sorter: true, dataIndex: 'outMachineTime', width: '160px', align: 'left' },
          { title: '工艺试制数量', dataIndex: 'trialProductionNumber', align: 'left' },
          // { title: '拆单子工序', width: '120px', dataIndex: 'subNo', align: 'center' },
          { title: '用途', dataIndex: 'purpose', align: 'left' },
          { title: '备注', dataIndex: 'remarks', align: 'left' },
          {
            title: '排产状态',
            dataIndex: 'scheduleStatus',
            align: 'left',
            scopedSlots: { customRender: 'scheduleStatus' },
          },
          { title: '策划', dataIndex: 'trialPlan', align: 'left', scopedSlots: { customRender: 'trialPlan' } },
          { title: '机台', dataIndex: 'productionMachine', align: 'left' },
          { title: '排产时间', dataIndex: 'productionTime', align: 'left' },
          { title: '预计完成时间', dataIndex: 'planCompletionTime', align: 'left' },
          {
            title: '异常反馈',
            dataIndex: 'totalFeedback',
            width: 150,
            align: 'left',
            scopedSlots: { customRender: 'totalFeedback' },
          },
          {
            title: '工艺记录上传',
            dataIndex: 'totalProcessParams',
            width: 150,
            align: 'left',
            scopedSlots: { customRender: 'totalProcessParams' },
          },
          {
            title: '检查结果',
            dataIndex: 'inspectionResults',
            width: 150,
            align: 'left',
            scopedSlots: { customRender: 'inspectionResults' },
          },

        ],
        recordList: [],
        isShowOtherButtons: false,

      };
    },
    mounted() {
      console.log('importExcelUrl', this.importExcelUrl);
      this.getRecordList();
    },

    methods: {
      changeTime() {

      },

      handleTableChange() {
        console.log('I am in handleTableChange');
      },
      searchQuery() {
        this.getRecordList();
      },
      searchResets() {
        this.queryParam = {
          trialProductionSearchDto: {
            customerName: '',
            maintenanceStatus: '',
            productSpecifications: '',
            projectNo: '',
            riskStatus: '',
            trialProductionDate: '',
            vehiclePlatform: '',
          },
          pageNo: 1,
          pageSize: 5,
        };
      },
      getRecordList() {
        this.loading = true;
        this.queryParam.pageNo = this.page.currentPage;
        this.queryParam.pageSize = this.page.pageSize;
        console.log('执行记录上传页面获取记录列表所传参数：', this.queryParam);

        getTrialRecordList(this.queryParam).then((data) => {
          this.loading = false;
          if (data.success) {
            console.log('执行记录上传页面获取记录列表', data);
            this.recordList.splice(0, this.recordList.length);
            let tempList = data.result.records;
            for (let index in tempList) {
              tempList[index].totalFeedback = {};
              tempList[index].totalFeedback['abnormalFeedback'] = tempList[index]['abnormalFeedback'];
              tempList[index].totalFeedback['abnormalFeedbackUrlIsOrNot'] = tempList[index]['abnormalFeedbackUrlIsOrNot'];
              tempList[index].totalFeedback['abnormalFeedbackUrl'] = tempList[index]['abnormalFeedbackUrl'];
              tempList[index].totalProcessParams = {};
              tempList[index].totalProcessParams['processRecordUpload'] = tempList[index]['processRecordUpload'];
              tempList[index].totalProcessParams['craftParamUrl'] = tempList[index]['craftParamUrl'];
              tempList[index].totalProcessParams['craftParamUrlIsOrNot'] = tempList[index]['craftParamUrlIsOrNot'];
              tempList[index].formBaseNo = tempList[index].formBaseNo + '-' + tempList[index].subNo;
            }
            this.recordList = tempList;
            console.log('执行记录上传页面获取记录列表2', this.recordList);
            // this.recordList.allFeedback={}

            // this.page.pageSize = data.result.size
            this.page.pageNum = data.result.pages;
            this.page.total = data.result.total;
          } else {
            this.$message.error(data.message);
          }
        });
      },
      //换页
      pageChange(val) { // 分页改变
        // console.log(val);
        this.page.currentPage = val;
        this.getRecordList();
      },
      showAbnormalFeedback(feedback) {
        this.feedbackModalObj = { ...feedback };
        console.log('feedback', feedback);
        this.showFeedbackModalVisible = true;
        let params = {};
        if (feedback.processTechnology === '压铸') {
          params.taskId = feedback.taskId;
          getCastingFeedback(params).then((data) => {
            //返回结果没有success状态
            console.log('压铸工序异常反馈', data);
            this.toFeedbackModal = data;
            this.toFeedbackModal.onMachineTime = feedback.onMachineTime;
            this.toFeedbackModal.machineNo = feedback.productionMachine;

          });
        } else if (feedback.processTechnology === '精车') {
          params.taskId = feedback.taskId;
          getFiningFeedback(params).then((data) => {
            //返回结果没有success状态
            console.log('精车工序异常反馈', data);
            this.toFeedbackModal = data;
          });
        } else if (feedback.processTechnology === '粗车') {
          params.taskId = feedback.taskId;
          getMachiningFeedback(params).then((data) => {
            //返回结果没有success状态
            console.log('粗车工序异常反馈', data);
            this.toFeedbackModal = data;
          });
        }


      },
      showAddFeedback(feedback) {
        this.feedbackModalObj = { ...feedback };
        this.addFeedbackModalVisible = true;

      },
      uploadQualityFile(e) {

        let qualityFile = e.file;
        console.log('质量总表', qualityFile);
        const formdata = new FormData();
        formdata.append('file', qualityFile);
        uploadQualitySummary(formdata).then((data) => {
          if (data.success) {
            console.log('上传质量总表返回结果：', data);
            e.onSuccess();

          } else {
            this.$message.destroy();
            this.$message.error(data.message);
          }


        });
      },

      //展示查看工艺记录上传弹窗
      showProcessRecordFeedback(feedback) {
        this.processRecordModalObj = { ...feedback };
        this.showProcessRecordModalVisible = true;
        let params = {};
        params.taskId = feedback.taskId;
        if (feedback.processTechnology === '压铸') {

          getCastingRecord(params).then((data) => {
            //返回结果没有success状态
            console.log('压铸工序工艺记录', data);
            this.toProcessRecordModal = data;

          });
        } else if (feedback.processTechnology === '精车') {

          getFinishingRecord(params).then((data) => {
            //返回结果没有success状态
            console.log('精车工序工艺记录', data);
            this.toProcessRecordModal = data;
          });
        } else if (feedback.processTechnology === '粗车') {
          getMachingRecord(params).then((data) => {
            //返回结果没有success状态
            console.log('粗车工序工艺记录', data);
            this.toProcessRecordModal = data;
          });
        }

      },
      //展示添加工艺记录上传弹窗
      showAddProcessRecordFeedback(feedback) {
        this.processRecordModalObj = { ...feedback };
        this.addProcessRecordModalVisible = true;

      },
      //展示异常反馈弹窗
      showPlanModal(text, record) {
        this.planModalVisible = true;
        console.log('showPlanModal', text, record);
        this.toPlanModalRecord = record;
        this.planModalContentKey += 1;
      },
      //  展示异常结果弹窗
      showInspectionResultsModal(inspectionResult) {
        this.showInspectionResultsVisible = true;
        console.log('showInspectModal', inspectionResult);
        this.inspectionResultModalObj = inspectionResult;
        let params = {};
        if (inspectionResult.processTechnology === '压铸') {
          params.taskId = inspectionResult.taskId;
          getCastingInspectionResults(params).then((data) => {
            //返回结果没有success状态
            console.log('获取压铸工序检查结果', data);
            this.toInspectResultModal = data;
          });
        }
        if (inspectionResult.processTechnology === '粗车') {
          params.projectNo = inspectionResult.projectNo;
          getMachingInspectionResults(params).then((data) => {
            //返回结果没有success状态
            console.log('获取粗车工序检查结果', data);
            this.toInspectResultModal = data;
          });
        }
        if (inspectionResult.processTechnology === '热处理') {
          params.projectNo = inspectionResult.projectNo;
          getHotInspectionResults(params).then((data) => {
            //返回结果没有success状态
            console.log('获取热处理工序检查结果', data);
            this.toInspectResultModal = data;
          });
        }

      },

    },

  };
</script>

<style scoped lang="less">
  /** {*/
  /*  margin: 0;*/
  /*  padding: 0;*/
  /*}*/

  /*/deep/ .ant-btn-primary {*/
  /*  width: 90px;*/
  /*}*/
  @import "./../../../css/public-table-css";

  .feedback-modal-wrap {
    display: flex;
    flex-direction: column;
  }

  .feedback-modal-header {
    display: flex;
    flex-direction: row;
  }

  /deep/ .ant-modal-header {
    padding: 10px 14px;

  }

  /deep/ .ant-modal-body {
    padding: 14px;
  }

  .two-btn-wrap {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  /*分页*/

  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }

  /*策划弹窗*/
  /deep/ .ant-modal-footer {
    text-align: center;
  }

  .plan-modal-footer /deep/ .ant-btn {
    width: 80px;
    height: 26px;
    background-color: #169bd5;
    color: white;
  }

  .plan-modal-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 200px;
    margin: 0 auto;
  }
</style>
