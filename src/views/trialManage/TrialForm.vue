<template>
  <!-- 试制流转单单独展示页面 -->
  <div style="width: 100%;">
    <a-card :bordered="false" style="width: 900px;margin: 0 auto">
      <div class="top-group">
        <img src="../../assets/shizhiliuzhuandanchuangjian.png" style="width: 100%;position: absolute;top: 0;left: 0;"/>
        <div class="top-title">
          <div>
            <div style="font-size: 30px">试制流转单查询</div>
            <span style="font-size: 15px;">{{trialProductionFormNo}}</span>
          </div>
        </div>
      </div>

      <!-- table区域 -->
      <a-tabs class="top-tabs" :activeKey="activeKey" @change="tabsChange">
        <div slot="tabBarExtraContent">
          <a-button type="primary" @click="processInformation">流程信息</a-button>
          <a-button type="primary" style="margin-left: 20px;" @click="processInstruction">过程指令({{ instructionNum }})</a-button>
        </div>
        <a-tab-pane key="0" tab="试制流转单信息">
          <QuerySheetTab1></QuerySheetTab1>
        </a-tab-pane>
        <a-tab-pane key="1" tab="试制前工艺维护">
          <QueryMaintainTab2></QueryMaintainTab2>
        </a-tab-pane>
        <a-tab-pane key="2" tab="试制预排信息">
          <QueryPreTab3></QueryPreTab3>
        </a-tab-pane>
        <a-tab-pane key="3" tab="试制策划信息">
          <QueryPlanTab4></QueryPlanTab4>
        </a-tab-pane>
        <a-tab-pane key="4" tab="试制执行">
          <QueryExecuteTab5></QueryExecuteTab5>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <a-modal
      class="progress-modal"
      :visible="progressVisible"
      @cancel="sureProgress"
      title="试制任务节点信息查看"
      width="800px">
<!--      <div class="progress-title">{{ progressName }}</div>-->

      <div class="progress-body">
        <div class="left-progress">
          <a-timeline>
            <a-timeline-item
              v-for="(item, index) of timeLineData"
              :key="index"
              class="progress-item"
              @click="selectProcess(item, index)"
            >
              <div class="progress-title" :class="index === selectIndex ? 'progress-title-select' : ''">{{ item.title }}</div>
              <div class="progress-time">{{ item.date }}</div>
            </a-timeline-item>
          </a-timeline>
        </div>
        <div class="right-msg">
          <div class="msg-title">
            <img style="margin-right: 20px" src="../../assets/trialQuery/1.png" height="48" width="48"/>
            {{ selectItem.title }}
          </div>
          <a-divider style="padding-left: 24px"></a-divider>
          <div class="msg">
            <div v-if="selectIndex === 0">{{ selectItem.by }} 完成试制流转单创建<br/>创建单号为 {{ trialProductionFormNo }}</div>
            <div v-else>任务追踪，开发中 Loading</div>
          </div>
        </div>
      </div>

      <template #footer>
        <a-button type="primary" @click="sureProgress">确认</a-button>
      </template>

    </a-modal>
  </div>
</template>

<script>
  import {
    getTrialInstructionNum, getListTrialProcessInfo,
  } from '@/api/api';

  import QuerySheetTab1 from './QuerySheetTab1';
  import QueryMaintainTab2 from './QueryMaintainTab2';
  import QueryPreTab3 from './QueryPreTab3';
  import QueryPlanTab4 from './QueryPlanTab4';
  import QueryExecuteTab5 from './QueryExecuteTab5';

  export default {
    name: 'TrialForm',
    components: { QuerySheetTab1, QueryMaintainTab2, QueryPreTab3, QueryPlanTab4, QueryExecuteTab5 },
    data() {
      return {
        activeKey: '0',
        selectId: 0, // 选中行的id
        trialProductionFormNo: null,
        instructionNum: 0, // 过程指令数量
        timeLineData: [
          { title: '流转单创建', dateKey: 'formBaseCreateTime', date: '', byKey: 'formBaseCreateBy', by: '' },
          { title: '工艺维护', dateKey: 'formWorkConfimTime', date: '', byKey: 'formBaseCreateBy', by: '' },
          { title: '计划预排', dateKey: 'prearrangementTime', date: '', byKey: 'prearrangementBy', by: '' },
          { title: '任务接收', dateKey: 'taskTime', date: '', byKey: '', by: 'taskBy' },
          { title: '试制策划', dateKey: 'taskWorkPlanTime', date: '', byKey: 'taskWorkPlanBy', by: '' },
          { title: '试制排产', dateKey: 'scheduleTime', date: '', byKey: 'scheduleBy', by: '' },
          { title: '现场执行', dateKey: 'appTaskCreateTime', date: '', byKey: 'appTaskCreateBy', by: '' },
          { title: '执行反馈', dateKey: '', date: '', byKey: '', by: '' },
          { title: '试制总结', dateKey: '', date: '', byKey: '', by: '' },
        ],
        // 进度条时间轴
        progressVisible: false,
        selectIndex: 0,
        selectItem: {},
      };
    },

    //初始化
    mounted() {
      this.selectId = this.$route.query.id;
      this.trialProductionFormNo = this.$route.query.no;
      this.activeKey = this.$route.query.tab ? this.$route.query.tab.toString() : '0';
      this.getProcessInfo();
      this.getInstructionNum();
    },

    methods: {
      test() {
        this.getProcessInfo();
      },
      processInformation() {
        this.progressVisible = true;
      },

      processInstruction() {
        // trialProductionFormNo
        this.$router.push({
          path: '/trial/instructionList',
          query: {
            no: this.trialProductionFormNo,
          },
        });
      },

      getProcessInfo() {
        getListTrialProcessInfo({ formBaseId: this.selectId }).then((data) => {
          if (data.success) {
            console.log('getListTrialProcessInfo data', data);
            data = data.result;
            for(let i = 0; i < this.timeLineData.length; i++) {
              this.timeLineData[i].date = data[this.timeLineData[i].dateKey];
              this.timeLineData[i].by = data[this.timeLineData[i].byKey];
            }
            this.selectProcess(this.timeLineData[0], 0);
            // this.instructionNum = data.result;
          } else {
            this.$message.destroy();
            this.$message.error(data.message);
          }
        });
      },

      getInstructionNum() {
        getTrialInstructionNum({ formBaseId: this.selectId }).then((data) => {
          if (data.success) {
            // console.log('data', data);
            this.instructionNum = data.result;
          } else {
            this.$message.destroy();
            this.$message.error(data.message);
          }
        });
      },

      tabsChange(key) {
        this.activeKey = key;
      },

      sureProgress() {
        this.progressVisible = false;
      },

      selectProcess(item, index) {
        this.selectIndex = index;
        this.selectItem = item;
      },
    },
  };
</script>

<style scoped lang="less">

  .ant-input {
    width: 200px;
  }

  .button-group {
    display: flex;
    margin-right: 100px;

    button {
      margin-right: 20px;
    }
  }


  .top-group {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 10px;
    position: relative;
  }

  .top-title {
    font-size: 18px;
    /*font-weight: bold;*/
    /*margin-bottom: 10px;*/
    position: relative;
    z-index: 100;
    height: 146px;
    display: flex;
    align-items: center;
    color: #fff;
    padding-left: 20px;
  }

  .flex-center {
    display: flex;
    /*justify-content: center;*/
  }

  .part-title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    border-radius: 5px;
    background: #f2f2f2;
    padding-left: 10px;
    margin: 20px 0;
  }

  .top-layout .ant-layout-sider {
    /*background: white;*/
  }

  .top-layout .ant-layout-content {
    background: white;
    overflow-x: visible;
  }

  .search-frame {
    margin-bottom: 20px;
  }

  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }
  .top-tabs{
    /deep/ .ant-tabs-nav .ant-tabs-tab{
      margin: 0;
    }
  }

  .progress-body {
    display: flex;
    .left-progress {
      width: 300px;
      padding: 30px 30px 0 30px;
      background: #f5f8fa;
      border-right: solid 1px #d8dbdf;

      .progress-item {
        cursor: pointer;
      }

      .progress-title {
        font-size: 16px;
        color: #2d2e2f;
      }

      .progress-title-select {
        color: #347ef2;
        font-weight: bold;
      }

      .progress-time {
        font-size: 14px;
        color: #7c7f83;
      }
    }

    .right-msg {
      flex: 1;

      .msg-title{
        display: flex;
        align-items: center;
        width: 400px;
        height: 100px;
        margin: 0 auto;
        padding: 30px;
        color: #ffffff;
        font-size: 16px;
        border-radius: 5px;
        background-image: linear-gradient(#0b243b, #01356e);
      }

      .msg {
        padding: 0 30px;
        color: #333333;
        font-size: 14px;
      }
    }

  }
</style>
