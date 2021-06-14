<template>
  <div style="overflow-x: auto">
    <div style="min-width: 1600px;">
      <a-card class="card1">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" class="formSearch">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="试制单编号">
              <a-input placeholder="请输入试制单编号" v-model="queryParams.trialProductionFormNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="戴卡部件号">
              <a-input placeholder="请输入戴卡部件号" v-model="queryParams.projectNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="项目经理">
              <a-input placeholder="请输入项目经理" v-model="queryParams.projectManager"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6" v-show="isShowOtherButtons">
            <a-form-item label="交付日期">
              <a-range-picker v-model="plannedTime" format="YYYY-MM-DD" :placeholder="['开始时间', '结束时间']" @change="changeTime" />
            </a-form-item>
          </a-col>
          <a-col :span="7">
            <a-form-item >
              <a style="margin-right: 20px;margin-left: 72px" @click="isShowOtherButtons = !isShowOtherButtons"> {{isShowOtherButtons?"收起":"展开"}} <a-icon :type="isShowOtherButtons?'up':'down'" /> </a>
              <a-button type="primary" @click="searchQuery">查询</a-button>
              <a-button  @click="searchReset" style="margin-left: 8px">重置</a-button>
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>
    </div>
      </a-card>
    <!-- 操作按钮区域 -->

    <!-- table区域-begin -->
      <a-card style="margin-top: 12px" class="card1">
        <a-tabs :default-active-key="checkTab" v-model="checkTab">
          <a-tab-pane key="1" tab="待策划" :forceRender="true">
            <task-manage-list-tab1 ref="taskTabA"/>
          </a-tab-pane>
          <a-tab-pane key="2" tab="全部" :forceRender="true">
            <task-manage-list-tab1 ref="taskTabB" />
          </a-tab-pane>
        </a-tabs>
   </a-card>
    </div>
  </div>
</template>

<script>
    import TaskManageListTab1 from './TaskManageListTab1'
    export default {
        name: "TaskReceptionList",
        components: { TaskManageListTab1 },
        data() {
            return {
                description: '车间任务单管理',
                queryParams: {noPlan:1},
                plannedTime:[],
                checkTab:'1',
                isShowOtherButtons:false,
            }
        },
        mounted(){
            if(this.$route.query.formBaseNo){
                this.queryParams.trialProductionFormNo = this.$route.query.formBaseNo;
            }
        },
        watch: {
            checkTab:{
                handler(v){
                    this.searchQuery()
                }
            }
        },
        methods: {
            changeTime(value, dateString) {
                this.queryParams.deliverDtBegin = value[0].format('YYYY-MM-DD 00:00:00');
                this.queryParams.deliverDtEnd = value[1].format('YYYY-MM-DD 23:59:59');
            },
            searchQuery(){
                if(this.checkTab=='1'){
                    this.queryParams.noPlan=this.checkTab
                    this.$refs.taskTabA.queryParam=this.queryParams
                    this.$refs.taskTabA.loadData()
                }else{
                    delete this.queryParams.noPlan
                    this.$refs.taskTabB.queryParam=this.queryParams || {}
                    this.$refs.taskTabB.loadData()
                }
            },
            searchReset(){
                this.plannedTime=[]
                if(this.checkTab=='1'){
                    this.queryParams={noPlan:1}
                    this.$refs.taskTabA.queryParam=this.queryParams
                    this.$refs.taskTabA.loadData()
                }else{
                    this.queryParams={}
                    this.$refs.taskTabB.queryParam={}
                    this.$refs.taskTabB.loadData()
                }
            },
            callback(val){
                this.checkTab=val
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
  /deep/ .card1 .ant-card-body {
    padding: 24px 24px 0 32px;
  }
  @import "./../../css/public-table-css";
  @import '~@assets/less/custom-table-search.less';
  /deep/ .ant-card-bordered{
    border:none !important;
  }
</style>