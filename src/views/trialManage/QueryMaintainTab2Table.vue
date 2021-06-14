<template>
  <div>
    <!--          <a-button @click="test" type="primary">test</a-button>-->
    <div class="top-msg">
      <div class="msg-item">
        <span class="msg-title">注意事项：</span>
        <span class="msg-content">{{ data.remarks }}</span>
      </div>
      <div class="msg-item">
        <span class="msg-title">负责人：</span>
        <span class="msg-content">{{ data.managerName }}</span>
      </div>
    </div>
    <a-table
      ref="preTab"
      size="middle"
      bordered
      :columns="columns"
      :dataSource="data.workPlanList"
      :pagination=false
    class="new-table">
      <template slot="status" slot-scope="text, status, i">
<!--        <a-button @click="jumpMaintain(status)">-->
<!--          {{ returnStatus(text) }}-->
<!--        </a-button>-->
        <div
          v-if="returnStatus(text) === '已核对'"
          style="color: #30c919;cursor: pointer"
          @click="jumpMaintain(status)"
        >{{ returnStatus(text) }}</div>
        <div v-else style="color: red">{{ returnStatus(text) }}</div>
      </template>
    </a-table>

    <div style="margin-top: 20px">
      <div class="msg-title" style="color: #000;font-size: 16px">试制地推荐：</div>
      <div class="msg-content" style="font-size: 16px">{{ returnSplitRemark(data.trialProductionRecommend) }}</div>
    </div>
    <div style="margin-top: 20px">
      <div class="msg-title" style="color: #000;font-size: 16px">解决方案：</div>
      <div class="msg-content" style="font-size: 16px">{{ data.solution }}</div>
    </div>

    <div class="bottom-container">
      <div style="margin-right: 20px">
        <span style="color: black;font-weight: bolder">工序核对人：</span>{{ data.processCheckerName }}
      </div>
      <div>{{ data.checkTime }}</div>
    </div>
  </div>
</template>

<script>

  import {
    getDictItemsFromCache,
  } from '@/api/api';

  export default {
    name: 'QueryMaintainTab2Table',
    props: {
      data: {
        type: Object,
        required: false,
      },
    },
    data() {
      return {
        columns: [
          { title: '是否核对', dataIndex: 'status', align: 'center', scopedSlots: { customRender: 'status' } },
          { title: '确认人', dataIndex: 'confirmName', align: 'center' },
          { title: '试制前策划项', dataIndex: 'technologyName', align: 'center' },
        ],
        dic: {
          check_trial_production: [],
        },
      };
    },
    mounted() {
      this.getDic();
    },
    methods: {

      test() {
        console.log('dic', this.dic);
      },

      returnSplitRemark(remark) {
        return remark ? remark.replaceAll(';', '\t') : '';
      },

      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          if (getDictItemsFromCache(name)) { // 从缓存中取dic
            this.dic[name] = getDictItemsFromCache(name);
          }
        }
      },

      jumpMaintain(data) {
        this.$router.push({
          path: '/trialManage/TrialProductionMaintenance',
          query: {
            id: data.formBaseId,
            check: 'check'
          },
        },);
      },

      returnStatus(status) {
        let dicArr = this.dic.check_trial_production;
        for (let i = 0; i < dicArr.length; i++) {
          if (Number(status) === Number(dicArr[i].value)) {
            return dicArr[i].text;
          }
        }
      },

    },
  };
</script>

<style scoped lang="less">

  .top-msg {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .msg-item {
    font-size: 16px;
    height: 40px;
    display: flex;
    align-items: center;
  }

  .msg-title {
    font-weight: bold;
  }

  .msg-content {
    color: #878787;
  }

  .bottom-container {
    width: 100%;
    /*height: 50px;*/
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    font-size: 16px;
    font-weight: bold;
    color: #7f7f7f;
  }
  .new-table{
    /deep/ .ant-table-content{
      tr{
        th{
          background-color: #E3F1FA !important;
          font-size: 16px;
          text-align: left !important;
        }
        td{
          text-align: left !important;
        }
      }
    }
  }
</style>
