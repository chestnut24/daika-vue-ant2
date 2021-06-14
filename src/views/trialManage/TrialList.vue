<template>
  <div style="overflow-x: auto">
    <a-card style="min-width: 1650px">
      <!-- 查询区域 -->
      <div class="search-container">
        <a-form layout="inline">
          <a-row type="flex" align="middle" :gutter="[0,16]">
            <a-col :md="6" :sm="6" class="flex-left">
              <div>戴卡部件号:</div>
              <a-form-item>
                <a-input style="width: 244px" placeholder="请输入戴卡部件号" v-model="queryParam.projectNo"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="6" class="flex-left">
              <div style="">项目经理:</div>
              <a-form-item>
                <a-input style="width: 244px" placeholder="请输入项目经理" v-model="queryParam.projectManager"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="6" class="flex-left">
              <div style="">试制单编号:</div>
              <a-form-item>
                <a-input style="width: 244px" placeholder="请输入试制单编号" v-model="queryParam.trialProductionFormNo"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="6" class="flex-left" v-if="isShowOtherButtons">
              <div>交付日期:</div>
              <a-form-item>
                <a-range-picker
                  :show-time="{ format: 'HH:mm:ss' }"
                  format="YYYY-MM-DD"
                  @change="trialDeliverDateChange"
                  v-model="deliveryDate"
                  style="width: 244px"
                ></a-range-picker>
              </a-form-item>
            </a-col>
            <a-col :md="6">
              <div class="button-group">
                <a style="margin-right: 20px" @click="isShowOtherButtons = !isShowOtherButtons"> {{isShowOtherButtons?"收起":"展开"}} <a-icon :type="isShowOtherButtons?'up':'down'" /> </a>
                <a-button style="margin-right: 8px" type="primary" @click="searchTabData">查询</a-button>
                <a-button style="margin-right: 8px"  @click="resetParam" >重置</a-button>
                <!--          <a-button type="primary" @click="test">test</a-button>-->
                <!--        <a-button @click="cloumnManage">列管理</a-button>-->
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 操作按钮区域 -->
<!--      <div class="button-container">-->
<!--        <div class="button-group">-->
<!--          <a-button type="primary" icon="plus" @click="newTrialForm">新建</a-button>-->
<!--          <a-button icon="export" @click="exportRecord">导出</a-button>-->
<!--        </div>-->
<!--        <div class="button-group">-->
<!--          <a style="margin-right: 20px" @click="isShowOtherButtons = !isShowOtherButtons"> {{isShowOtherButtons?"收起":"展开"}} <a-icon :type="isShowOtherButtons?'up':'down'" /> </a>-->
<!--          <a-button type="primary" @click="searchTabData">查询</a-button>-->
<!--          <a-button type="primary" icon="plus" @click="newTrialForm">新建</a-button>-->
<!--          <a-button icon="export" @click="exportRecord">导出</a-button>-->
<!--          <a-button @click="resetParam">重置</a-button>-->
<!--&lt;!&ndash;          <a-button type="primary" @click="test">test</a-button>&ndash;&gt;-->
<!--          &lt;!&ndash;        <a-button @click="cloumnManage">列管理</a-button>&ndash;&gt;-->
<!--        </div>-->
<!--      </div>-->
      <!-- 分隔线 -->
    </a-card>
    <a-card style="min-width: 1600px;margin-top: 12px">
      <!-- table区域 -->
      <a-tabs>
        <a-tab-pane key="1" tab="基础信息视图">
          <ManageBasicTab1 :is-search="isSearch" :query-param="queryParam"></ManageBasicTab1>
        </a-tab-pane>
        <a-tab-pane key="2" tab="维护信息视图">
          <ManageMaintainTab2 :is-search="isSearch" :query-param="queryParam"></ManageMaintainTab2>
        </a-tab-pane>
        <a-tab-pane key="3" tab="预排信息视图">
          <ManagePrearrangementTab3 :is-search="isSearch" :query-param="queryParam"></ManagePrearrangementTab3>
        </a-tab-pane>
        <a-tab-pane key="4" tab="车间任务视图">
          <ManageTaskTab4 :is-search="isSearch" :query-param="queryParam"></ManageTaskTab4>
        </a-tab-pane>
        <div slot="tabBarExtraContent">
          <a-button style="margin-right: 8px" type="primary" icon="plus" @click="newTrialForm">新建</a-button>
          <a-button style="margin-right: 8px"  icon="export" @click="exportRecord">导出</a-button>
        </div>
<!--        <a-button  @click="cloumnManage">-->
<!--          列管理-->
<!--        </a-button>-->
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
  import ManageBasicTab1 from './ManageBasicTab1';
  import ManageMaintainTab2 from './ManageMaintainTab2';
  import ManagePrearrangementTab3 from './ManagePrearrangementTab3';
  import ManageTaskTab4 from './ManageTaskTab4';
  export default {
    name: 'TrialList',
    components: {  ManageBasicTab1, ManageMaintainTab2, ManagePrearrangementTab3, ManageTaskTab4 },
    data() {
      return {
        deliveryDate: [], // 维护日期 用于绑定model清空

        // 请求参数
        queryParam: {
          projectManager: '', // 项目经理
          trialProductionFormNo: '', // 试制流转单编号
          projectNo: '', // 戴卡项目号
          deliverDtBegin: null, // 交付日期从
          deliverDtEnd: null, // 到
        },

        isSearch: false, // 用来检测是否点了查询按钮，false和true无所谓

        //用途表格
        purposesTabColumns: [
          { title: '用途', dataIndex: 'purpose', width: 50, align: 'center' },
          { title: '数量', dataIndex: 'orderNumber', width: 50, align: 'center' },
        ],
        isShowOtherButtons: false,
      };
    },

    //初始化
    mounted() {},
    methods: {
      test() {
        console.log('1');
      },

      cloumnManage() { //列管理
        alert('此功能暂未开发');
      },

      newTrialForm() {
        this.$router.push(
          { path: `/trial/trialEditForm` },
        );
      },

      trialDeliverDateChange(value, dateString) { // 交付时间改变
        // this.queryParam.deliverDtBegin = dateString[0];
        // this.queryParam.deliverDtEnd = dateString[1];
        this.queryParam.deliverDtBegin = value[0].format('YYYY-MM-DD 00:00:00');
        this.queryParam.deliverDtEnd = value[1].format('YYYY-MM-DD 23:59:59');
      },

      exportRecord() { // 导出
        console.log('导出');
        alert('此功能暂未开发');
      },

      searchTabData() {
        this.isSearch = !this.isSearch;
      },

      resetParam() { // 重置
        this.deliveryDate = [];
        this.queryParam = {
          projectManager: '', // 项目经理
          trialProductionFormNo: '', // 试制流转单编号
          projectNo: '', // 戴卡项目号
          deliverDtBegin: null, // 交付日期从
          deliverDtEnd: null, // 到
        };
      },

    },
  };
</script>

<style scoped lang="less">
  /*试制流转单管理*/
  .search-container {
    .special-date {
      height: 40px;
      width: 40px;

      span {
        text-decoration: underline;
      }
    }
  }

  .button-container {
    display: flex;
    align-items: center;
    height: 50px;
    width: 100%;
    margin-top: 10px;
    justify-content: space-between;
    .button-group {
      display: flex;
      margin-right: 135px;

      button {
        margin-right: 20px;
      }
    }
  }

  .table-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }

  .operate-row {
    .ant-btn {
      padding: 0;
    }
  }

  .flex-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    div {
      margin-right: 20px;
    }
  }
</style>
