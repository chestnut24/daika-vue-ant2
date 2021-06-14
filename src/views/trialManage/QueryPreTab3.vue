<template>
<!--  查询tab3  试制前预排-->
  <a-spin :spinning="spinning" tip="loading">
    <div style="margin: 20px">
<!--      <a-button @click="test">test</a-button>-->
      <a-table class="new-table"
        ref="preTab"
        size="middle"
        bordered
        :columns="columns"
        :dataSource="dataSource"
        :pagination=false>
        <template slot="trialProductionSite" slot-scope="text, trialProductionSite, i">
          {{ text }}
          <span :style="{color: getItemCurrentLoadRate(trialProductionSite).currentLoadRate && getItemCurrentLoadRate(trialProductionSite).currentLoadRate >= getItemCurrentLoadRate(trialProductionSite).alarmLoadRate ? 'red':'#84c026'}">（负荷率{{ trialProductionSite.loadRate }}%）</span>
        </template>
      </a-table>
      <div class="bottom-container">
        <div style="margin-right: 20px">
          <span style="color: black;font-weight: bolder">预排人：</span>{{ prearrangementBy }}
        </div>
        <div>{{ prearrangementTime }}</div>
      </div>
    </div>
  </a-spin>
</template>

<script>
  import {
    getTrialPreById,
    listLoadRate,
    getDictItemsFromCache,
  } from '@/api/api';
  export default {
    name: 'QueryPreTab3',

    data() {
      return {
        spinning: false,
        selectId: 0, // 选中行的id
        trialProductionFormNo: null,
        columns: [
          { title: '工序', dataIndex: 'processTechnologyName', align: 'center' },
          { title: '试制地', dataIndex: 'trialProductionSite', align: 'center', scopedSlots: { customRender: 'trialProductionSite' }, },
          { title: '试制完成日期', dataIndex: 'completionDate', align: 'center' },
          { title: '预排序号', dataIndex: 'currentNo', align: 'center' },
        ],
        dataSource: [],
        loadRateList: [], // 总的负荷率列表
        prearrangementBy: '', // 预排人
        prearrangementTime: '', // 预排时间
      };
    },

    mounted() {
      this.selectId = this.$route.query.id;
      this.trialProductionFormNo = this.$route.query.no;
      this.getListLoadRate();
      this.getDataById();
    },
    methods: {
      test() {
        // console.log('1');
        // this.getDataById();

        this.getListLoadRate();
      },

      getListLoadRate() {
        listLoadRate({}).then(data => {
          if (data.success) {
            console.log('data listLoadRate', data);
            this.loadRateList = data.result;
          } else {
            this.$message.destroy();
            this.$message.error(data.message);
          }
        })
      },

      getDataById() {
        this.spinning = true;
        let param = { formId: this.selectId };
        getTrialPreById(param).then((data) => {
          this.spinning = false;
          if (data.success) {
            data = data.result;
            // this.$message.success(data.message);
            // this.data = data.result
            console.log('return data', data);
            this.dataSource = data.prearrangementList;
            this.prearrangementBy = data.prearrangementBy;
            this.prearrangementTime = data.prearrangementTime;
          } else {
            this.$message.warning(data.message)
          }
        })
      },

      getItemCurrentLoadRate(rate) { // 查看是否在loadRateList中
        const a = this.loadRateList.find(item => item.processTechnology === rate.processTechnologyName && item.productPlace === rate.trialProductionSite);
        if (a) return {alarmLoadRate: a.alarmLoadRate, currentLoadRate: a.currentLoadRate};
        return {alarmLoadRate: null, currentLoadRate: null};
      },
    },
  };
</script>

<style scoped lang="less">
  .bottom-container {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    font-size: 16px;
    font-weight: bold;
    color: #7f7f7f;
  }
  .loading {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
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
