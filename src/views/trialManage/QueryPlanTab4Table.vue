<template>
  <div>
    <!--    <a-button @click="test">test</a-button>-->
    <div class="table-title">{{ datasource.name }}</div>
    <!--        <div v-if="isSpecialTitle(value)">123</div>-->
    <a-table class="new-table"
      ref="preTab"
      size="middle"
      bordered
      :columns="columns"
      :dataSource="datasource.value"
      :pagination=false>
      <!--      <template slot="formBaseNo" slot-scope="text, formBaseNo, i">-->
      <!--        <span><a-button type="link" @click="jumpFormBaseNo">{{ text }}</a-button></span>-->
      <!--      </template>-->

      <!--      有一列时-->
      <template slot="spColumn1" slot-scope="text, spColumn1, i">
        <span v-if="tableTitle === '压铸'">
          <a-button type="link"
                    @click="handleCasting(spColumn1, returnStatus(spColumn1.trialProductionTaskPlanCast.planStatus))">
            {{ spColumn1.trialProductionTaskPlanCast && returnStatus(spColumn1.trialProductionTaskPlanCast.planStatus) }}
          </a-button>
          <br>
          <span>{{ spColumn1.trialProductionTaskPlanCast && spColumn1.trialProductionTaskPlanCast.planName }}</span><br>
          <span>{{ spColumn1.trialProductionTaskPlanCast && spColumn1.trialProductionTaskPlanCast.planTime | dayMoment }}</span>
        </span>
        <span v-if="tableTitle === '热处理'">
          <a-button type="link"
                    @click="handleHeat(spColumn1, returnStatus(spColumn1.trialProductionTaskPlanHeat.planStatus))">
            {{ spColumn1.trialProductionTaskPlanHeat && returnStatus(spColumn1.trialProductionTaskPlanHeat.planStatus) }}
          </a-button>
          <br>
          <span>{{ spColumn1.trialProductionTaskPlanHeat && spColumn1.trialProductionTaskPlanHeat.planName }}</span><br>
          <span>{{ spColumn1.trialProductionTaskPlanHeat && spColumn1.trialProductionTaskPlanHeat.planTime | dayMoment }}</span>
        </span>
        <span v-if="tableTitle === '粗车'">
          <a-button type="link"
                    @click="handleMachining(spColumn1, returnStatus(spColumn1.trialProductionTaskPlanMachine.planStatus))">
            {{ spColumn1.trialProductionTaskPlanMachine && returnStatus(spColumn1.trialProductionTaskPlanMachine.planStatus) }}
          </a-button>
          <br>
          <span>{{ spColumn1.trialProductionTaskPlanMachine && spColumn1.trialProductionTaskPlanMachine.planName }}</span><br>
          <span>{{ spColumn1.trialProductionTaskPlanMachine && spColumn1.trialProductionTaskPlanMachine.planTime | dayMoment }}</span>
        </span>
        <span v-if="tableTitle === '精车'">
          <a-button type="link"
                    @click="handleFineCar(spColumn1, returnStatus(spColumn1.trialProductionTaskPlanTechnology.planStatus))">
            {{ spColumn1.trialProductionTaskPlanTechnology && returnStatus(spColumn1.trialProductionTaskPlanTechnology.planStatus) }}
          </a-button>
          <br>
          <span>{{ spColumn1.trialProductionTaskPlanTechnology && spColumn1.trialProductionTaskPlanTechnology.planName }}</span><br>
          <span>{{ spColumn1.trialProductionTaskPlanTechnology && spColumn1.trialProductionTaskPlanTechnology.planTime | dayMoment }}</span>
        </span>
        <span v-if="tableTitle === '喷涂'">
          <template v-for="data in returnCommonData(spColumn1.trialProductionTaskPlanCommonList, '试制档案')">
            <a-button type="link" @click="handleArchives(spColumn1, returnStatus(data.planStatus), '试制档案')">{{ returnStatus(data.planStatus) }}</a-button><br>
            <span>{{ data.planName }}</span><br>
            <span>{{ data.planTime | dayMoment }}</span>
          </template>
        </span>
        <span v-else>
          <template v-for="data in returnCommonData(spColumn1.trialProductionTaskPlanCommonList, tableTitle)">
            <a-button type="link" @click="handleCurrency(spColumn1, returnStatus(data.planStatus))">{{ returnStatus(data.planStatus) }}</a-button><br>
            <span>{{ data.planName }}</span><br>
            <span>{{ data.planTime | dayMoment }}</span>
          </template>
        </span>
      </template>

      <!--      有两列时-->
      <template slot="spColumn2" slot-scope="text, spColumn2, i">

        <span v-if="tableTitle === '压铸'">
          <a-button type="link" @click="handleRequirement(spColumn2)">{{ spColumn2.trialProductionTaskPlanCastx && returnStatus(spColumn2.trialProductionTaskPlanCastx.planStatus) }}</a-button><br>
          <span>{{ spColumn2.trialProductionTaskPlanCastx && spColumn2.trialProductionTaskPlanCastx.planName }}</span><br>
          <span>{{ spColumn2.trialProductionTaskPlanCastx && spColumn2.trialProductionTaskPlanCastx.planTime | dayMoment }}</span>
        </span>
        <span v-if="tableTitle === '粗车'">
          <template v-for="data in returnCommonData(spColumn2.trialProductionTaskPlanCommonList, '气密平衡')">
            <a-button type="link" @click="handleBalance(spColumn2, returnStatus(data.planStatus), '气密平衡')">{{ returnStatus(data.planStatus) }}</a-button><br>
            <span>{{ data.planName }}</span><br>
            <span>{{ data.planTime | dayMoment }}</span>
          </template>
        </span>
        <span v-if="tableTitle === '喷涂'">
          <template v-for="data in returnCommonData(spColumn2.trialProductionTaskPlanCommonList, '试制跟踪')">
            <a-button type="link" @click="handleArchives(spColumn2, returnStatus(data.planStatus), '试制跟踪')">{{ returnStatus(data.planStatus) }}</a-button><br>
            <span>{{ data.planName }}</span><br>
            <span>{{ data.planTime | dayMoment }}</span>
          </template>
        </span>
      </template>

      <!--      有三列时-->
      <template slot="spColumn3" slot-scope="text, spColumn3, i">
        <span v-if="tableTitle === '粗车'">
          <template v-for="data in returnCommonData(spColumn3.trialProductionTaskPlanCommonList, '三坐标')">
            <a-button type="link" @click="handleBalance(spColumn3, returnStatus(data.planStatus), '三坐标')">{{ returnStatus(data.planStatus) }}</a-button><br>
            <span>{{ data.planName }}</span><br>
            <span>{{ data.planTime | dayMoment }}</span>
          </template>
        </span>
      </template>
    </a-table>


      <!--铸造-->
    <casting-modal ref="casting" @ok="modalFormOk"/>
      <!--X光机控制要求-->
    <xrequirement-modal ref="Xrequirement" @ok="modalFormOk"/>
      <!--热处理-->
    <heat-treatment-modal ref="heatModal" @ok="modalFormOk"/>
      <!--生产要求-->
    <machining-modal ref="machingModal" @ok="modalFormOk"/>
      <!--气密平衡-->
    <BalanceModal ref="balanceModal" @ok="modalFormOk"/>
      <!--试制档案-->
    <spray-modal ref="sprayModal" @ok="modalFormOk"/>
      <!--通用-->
    <currency-modal ref="currencyModal" @ok="modalFormOk"/>
      <!--精车工艺要求-->
    <fine-car-modal ref="fincarModal" @ok="modalFormOk"/>
  </div>
</template>

<script>
  import {
    getDictItemsFromCache,
  } from '@/api/api';

  import CastingModal from './workshopProcess/modules/CastingModal';
  import XrequirementModal from './workshopProcess/modules/XrequirementModal';
  import HeatTreatmentModal from './workshopProcess/modules/HeatTreatmentModal';
  import MachiningModal from './workshopProcess/modules/MachiningModal';
  import BalanceModal from './workshopProcess/modules/BalanceModal';
  import CurrencyModal from './workshopProcess/modules/CurrencyModal';
  import FineCarModal from './workshopProcess/modules/FineCarModal';
  import SprayModal from './workshopProcess/modules/SprayModal';

  export default {
    name: 'QueryPlanTab4Table',
    props: ['datasource'],
    components: {
      FineCarModal,
      CurrencyModal,
      BalanceModal,
      MachiningModal,
      HeatTreatmentModal,
      XrequirementModal,
      CastingModal,
      SprayModal,
    },
    data() {
      return {
        columns: [
          { title: '试制流转单', dataIndex: 'formBaseNo', align: 'center', scopedSlots: { customRender: 'formBaseNo' } },
          { title: '工序', dataIndex: 'processTechnology', align: 'center' },
          { title: '子序号', dataIndex: 'subNo', align: 'center' },
          { title: '试制数量', dataIndex: 'trialProductionNumber', align: 'center' },
          { title: '用途', dataIndex: 'purpose', align: 'center' },
          { title: '备注', dataIndex: 'remarks', align: 'center' },
        ],
        specialTitle: ['压铸', '热处理', '粗车', '精车', '喷涂'],
        isSpecial: false, // 是否是特殊表头
        tableTitle: '', // 表头

        dic: { // 表单中的部分数据对应的的数据词典
          form_task_plan_status: [], // 试制状态
        },
      };
    },
    mounted() {

      this.getDic(); // 获取字典
      this.tableTitle = this.datasource.name;
      this.isSpecial = this.isSpecialTitle(this.tableTitle);
      // console.log('data11', this.data);
      if (this.isSpecial) {
        switch (this.tableTitle) {
          case '压铸':
            this.columns.splice(this.columns.length, 0,
              { title: '压铸工艺', dataIndex: 'spColumn1', align: 'center', scopedSlots: { customRender: 'spColumn1' } },
              { title: 'X光机控制要求', dataIndex: 'spColumn2', align: 'center', scopedSlots: { customRender: 'spColumn2' } },
            );
            break;
          case '热处理':
            this.columns.splice(this.columns.length, 0,
              { title: '热处理工艺策划', dataIndex: 'spColumn1', align: 'center', scopedSlots: { customRender: 'spColumn1' } },
            );
            break;
          case '粗车':
            this.columns.splice(this.columns.length, 0,
              { title: '生产要求', dataIndex: 'spColumn1', align: 'center', scopedSlots: { customRender: 'spColumn1' } },
              { title: '气密平衡', dataIndex: 'spColumn2', align: 'center', scopedSlots: { customRender: 'spColumn2' } },
              { title: '三坐标', dataIndex: 'spColumn3', align: 'center', scopedSlots: { customRender: 'spColumn3' } },
            );
            break;
          case '精车':
            this.columns.splice(this.columns.length, 0,
              { title: '精车工艺要求', dataIndex: 'spColumn1', align: 'center', scopedSlots: { customRender: 'spColumn1' } },
            );
            break;
          case '喷涂':
            this.columns.splice(this.columns.length, 0,
              { title: '试制档案', dataIndex: 'spColumn1', align: 'center', scopedSlots: { customRender: 'spColumn1' } },
              { title: '试制跟踪', dataIndex: 'spColumn2', align: 'center', scopedSlots: { customRender: 'spColumn2' } },
            );
            break;
        }
      } else {
        this.columns.splice(this.columns.length, 0,
          {
            title: `${this.tableTitle}工艺要求`,
            dataIndex: 'spColumn1',
            align: 'center',
            scopedSlots: { customRender: 'spColumn1' },
          },
        );
      }
    },
    methods: {
      test() {
        console.log('datasource', this.dataSource);
      },

      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          if (getDictItemsFromCache(name)) { // 从缓存中取dic
            this.dic[name] = getDictItemsFromCache(name);
          }
        }
      },
      returnStatus(value) {
        for (let i = 0; i < this.dic.form_task_plan_status.length; i++) {
          let item = this.dic.form_task_plan_status[i];
          if (Number(value) === Number(item.value)) return item.text;
        }
      },

      isSpecialTitle(title) {
        return (this.specialTitle.indexOf(title) !== -1);
      },

      returnCommonData(dataArr, title) {
        if (dataArr) {
          for (let i = 0; i < dataArr.length; i++) {
            if (dataArr[i].planType && dataArr[i].planType === title) {
              // console.log('dataArr', dataArr[i]);
              return [dataArr[i]];
            }
          }
        }
      },

      jumpPlan(data) {
        console.log('return data', data);
        // this.$message.destroy();
        // this.$message.warning('此功能暂未开发！');
      },

      /*铸造工艺*/
      handleCasting(record, tag) {
        record.formBase = {
          project: {
            id: record.projectId,
            projectNumber: record.projectNo,
          },
        };
        this.$refs.casting.add(record, tag);
        this.$refs.casting.disableSubmit = false;
      },
      /*X光过程控制要求*/
      handleRequirement(record) {
        record.formBase = {
          project: {
            id: record.projectId,
            projectNumber: record.projectNo,
          },
        };
        this.$refs.Xrequirement.add(record);
        this.$refs.Xrequirement.disableSubmit = false;
      },
      /*热处理*/
      handleHeat(record, tag) {
        record.formBase = {
          project: {
            id: record.projectId,
            projectNumber: record.projectNo,
          },
        };
        this.$refs.heatModal.add(record, tag);
        this.$refs.heatModal.disableSubmit = false;
      },
      /*生产要求*/
      handleMachining(record, tag) {
        record.formBase = {
          project: {
            id: record.projectId,
            projectNumber: record.projectNo,
          },
        };
        this.$refs.machingModal.add(record, tag);
        this.$refs.machingModal.disableSubmit = false;
      },
      /*气密平衡==三坐标*/
      handleBalance(record, tag, name) {
        record.formBase = {
          project: {
            id: record.projectId,
            projectNumber: record.projectNo,
          },
        };
        this.$refs.balanceModal.add(record, tag, name);
        this.$refs.balanceModal.disableSubmit = false;
        this.$refs.balanceModal.title = name;
      },
      /*试制档案===试制档案*/
      handleArchives(record, tag, name) {
        record.formBase = {
          project: {
            id: record.projectId,
            projectNumber: record.projectNo,
          },
        };
        this.$refs.sprayModal.add(record, tag, name);
        this.$refs.sprayModal.disableSubmit = false;
        this.$refs.sprayModal.title = name;
      },
      /*通用*/
      handleCurrency(record, tag) {
        console.log('record', record);
        record.formBase = {
          project: {
            id: record.projectId,
            projectNumber: record.projectNo,
          },
        };
        record.title = record.processTechnology + '工艺';
        this.$refs.currencyModal.add(record, tag, record.processTechnology);
        this.$refs.currencyModal.disableSubmit = false;
        this.$refs.currencyModal.title = record.processTechnology + '工艺';
      },
      /*精车工艺要求*/
      handleFineCar(record, tag) {
        record.formBase = {
          project: {
            id: record.projectId,
            projectNumber: record.projectNo,
          },
        };
        this.$refs.fincarModal.add(record, tag);
        this.$refs.fincarModal.disableSubmit = false;
        this.$refs.fincarModal.title = '精车工艺要求';
      },
      modalFormOk() {
        // this.getPlanMessage()
      },
    },
  };
</script>

<style scoped lang="less">

  /*/deep/ .ant-btn {*/
  /*  height: 19px;*/
  /*}*/
  /*.modal-container {*/
  /*  /deep/ .ant-btn {*/
  /*    height: 32px!important;*/
  /*  }*/
  /*}*/

  .table-title {
    height: 40px;
    width: 100%;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #3c4662;
    /*background: #192546;*/
    color: white;
    font-size: 18px;
    font-weight: bold;
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
    /deep/ button{
      padding: 0;
    }
  }
</style>
