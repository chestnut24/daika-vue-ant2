<template>
  <a-card style="width: 100%" class="progress-card">
<!--    <a-button @click="test" type="primary">test</a-button>-->
    <div class="container">
      <div class="menu-container">
        <template v-for="(menuItem, menuIndex) in leftOptionAfterHandel">
          <div @click="menuSelect(menuIndex)"
               :class="['menu-item', { 'menu-item-select': menuIndex === selectMenuKey}]">
            <img src="../../assets/order/plan_icon.png" height="24" width="24"/>
            <div class="menu-msg-container">
              <div class="menu-msg-title">采购计划{{ menuIndex + 1 }}</div>
              <div class="menu-msg">申请编号：{{ menuItem[0] }}</div>
              <div class="menu-msg">需用部门：{{ menuItem[1] }}</div>
              <div class="menu-msg">收货工厂：{{ menuItem[2] }}</div>
            </div>
          </div>
        </template>
      </div>
      <div class="right-msg-container">
        <div class="part-title">
          <div class="blue-stripe"></div>
          <span>采购基本信息</span>
        </div>
        <!--        物料描述-->
        <table>
          <tr>
            <td class="item-title">物料描述</td>
            <td class="item-value item-value-long">{{ purchaseParamData[purchaseValueListLong.物料描述] }}</td>
          </tr>
        </table>
        <!--        上三行-->
        <table style="border-top: 0">
          <tr v-for="(group, groupIndex) in purchaseValueList[0]" :key="groupIndex">
            <template v-for="(item, key, index) in group">
              <td class="item-title">{{ key }}</td>
              <td class="item-value">{{ purchaseParamData[item] }}</td>
            </template>
          </tr>
        </table>
        <!--        申购说明-->
        <table style="border-top: 0; margin-bottom: 12px">
          <tr>
            <td class="item-title">申购说明</td>
            <td class="item-value item-value-long">{{ purchaseParamData[purchaseValueListLong.申购说明] }}</td>
          </tr>
        </table>
        <!--        中四行-->
        <table style="margin-bottom: 12px">
          <tr v-for="(group, groupIndex) in purchaseValueList[1]" :key="groupIndex">
            <template v-for="(item, key, index) in group">
              <td class="item-title">{{ key }}</td>
              <td class="item-value">{{ purchaseParamData[item] }}</td>
            </template>
          </tr>
        </table>
        <!--        下两行-->
        <table>
          <tr v-for="(group, groupIndex) in purchaseValueList[2]" :key="groupIndex">
            <template v-for="(item, key, index) in group">
              <td class="item-title">{{ key }}</td>
              <td class="item-value">{{ purchaseParamData[item] }}</td>
            </template>
          </tr>
        </table>

        <div class="part-title" style="margin-top: 20px">
          <div class="blue-stripe"></div>
          <span>采购进度信息</span>
        </div>
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          bordered
          :pagination=false
          :scroll="{ x: 1300, y: 1000 }"
        >
          <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
            <template v-for="(item, index) of processState">
              <!--                      <a-button :type="returnButtonType(item.state)" @click="checkState(operate, i, item.name)">-->
              <!--                      <a-button :type="item.judgeComplete ? 'primary' : 'default'" @click="checkState(operate, i, item.name)">-->
              <a-button
                :style="returnButtonType(item.judgeComplete, item.disabled)"
                @click="getTracking(item)"
                :disabled="item.disabled"
              >
                {{ item.busType }}<br>{{ item.elapsedTime }}
              </a-button>
            </template>
          </a-space>
        </a-table>
      </div>
    </div>
    <a-modal
      class="progress-modal"
      :visible="progressVisible"
      @cancel="sureProgress"
      title="采购进度信息"
      width="600px">
      <div class="progress-title">{{ progressName }}</div>

      <div class="progress-body">
        <a-timeline>
          <a-timeline-item v-for="(item, index) of progressData" :key="index">
            <b>{{ item.operatorTime }}</b>
            <br>
<!--            【<span style="color: #40a9ff">{{ item.operator }}</span>】{{ item.describe }}-->
            <div v-html="item.describe">{{ item.describe }}</div>
          </a-timeline-item>
        </a-timeline>
      </div>

      <template #footer>
        <a-button type="primary" @click="sureProgress">确认</a-button>
      </template>

    </a-modal>
  </a-card>
</template>

<script>
  import { getYctList, getYctProgress, getYctTracking, getYctPlanBus, getYctPlanBusProgress } from '@/api/api';

  export default {

    name: 'PurchaseProgress',
    data() {
      return {
        selectSapNum: '', // 参数 SAP number
        totalData: [],

        // 左侧菜单栏
        openKeys: [],
        selectedKeys: [], // 旧版本时候的选中
        leftOption: [],

        leftOptionAfterHandel: [], // 经过处理的左边菜单栏
        selectMenuKey: 0, // 旧版本时候的选中

        // 采购基本信息
        // purchaseValue: [ // 旧
        //   { SAP编码: 'sapNumber', 物料描述: 'materialDescription' },
        //   { 申请编号: 'applyNumber', 申请类型: 'applyType', 计量单位: 'unit', 申购数量: 'applyPurchase' },
        //   { 申购说明: 'applyPurchaseExplanation', 物料组: 'materialGroup', 物料类型: 'materialType', 收货工厂: 'harvestPlant' },
        //   { 创建人部门: 'createByDepartment', 送审日期: 'submissionDate', 需用部门: 'useDepartment', 需用日期: 'useDate' },
        //   { 状态: 'state', 分派处理人: 'allotUser', 采购周期: 'purchaseCycle', 申请处理人: 'applyUseUser' },
        //   { 定价处理人: 'pricingUser', 使用期限: 'useDeadline', 是否新产品: 'isNewProject', 紧急采购: 'urgency' },
        //   { 创建人: 'yctCreator', 申请人: 'applyUser', 供应商名称: 'supplierName', 预计到货日期: 'predictDate' },
        // ],
        purchaseParamData: [],
        purchaseValueList: [ // 新
          [
            { SAP编码: 'sapNumber', 申请编号: 'applyNumber', 计量单位: 'unit' },
            { 申请类型: 'applyType', 申购数量: 'applyPurchase', '': '' },
            { 物料组: 'materialGroup', 物料类型: 'materialType', '': '' },
          ],
          [
            { 创建人: 'yctCreator', 创建人部门: 'createByDepartment', 申请人: 'applyUser' },
            { 收货工厂: 'harvestPlant', 采购周期: 'purchaseCycle', 状态: 'state' },
            { 需用部门: 'useDepartment', 需用日期: 'useDate', 是否新产品: 'isNewProject' },
            { 紧急采购: 'urgency', 预计到货日期: 'predictDate', '': '' },
          ],
          [
            { 申请处理人: 'applyUseUser', 分派处理人: 'allotUser', 定价处理人: 'pricingUser' },
            { 使用期限: 'useDeadline', 供应商名称: 'supplierName', 送审日期: 'submissionDate' },
          ],
        ],
        purchaseValueListLong: {  // 新 较长字段
          物料描述: 'materialDescription',
          申购说明: 'applyPurchaseExplanation',
        },


        // 进度表格
        columns: [
          { title: 'SAP编码', dataIndex: 'sapNumber', width: 190, align: 'left' },
          { title: '申请类型', dataIndex: 'applyType', width: 110, align: 'left' },
          { title: '申请编号', dataIndex: 'applyNumber', width: 190, align: 'left' },
          {
            title: '业务状态',
            dataIndex: 'operate',
            width: 830,
            align: 'center',
            // fixed: 'right',
            scopedSlots: { customRender: 'operate' },
          },
        ],
        dataSource: [],
        processState: [
          { busType: '申请', elapsedTime: '', judgeComplete: false, disabled: true, yctBusId: 0, yctPlanId: 0 },
          { busType: '分派', elapsedTime: '', judgeComplete: false, disabled: true, yctBusId: 0, yctPlanId: 0 },
          { busType: '干预', elapsedTime: '', judgeComplete: false, disabled: true, yctBusId: 0, yctPlanId: 0 },
          { busType: '申报', elapsedTime: '', judgeComplete: false, disabled: true, yctBusId: 0, yctPlanId: 0 },
          { busType: '定价', elapsedTime: '', judgeComplete: false, disabled: true, yctBusId: 0, yctPlanId: 0 },
          { busType: '合同', elapsedTime: '', judgeComplete: false, disabled: true, yctBusId: 0, yctPlanId: 0 },
          { busType: '订单', elapsedTime: '', judgeComplete: false, disabled: true, yctBusId: 0, yctPlanId: 0 },
          { busType: '送货', elapsedTime: '', judgeComplete: false, disabled: true, yctBusId: 0, yctPlanId: 0 },
          { busType: '入库', elapsedTime: '', judgeComplete: false, disabled: true, yctBusId: 0, yctPlanId: 0 },
          { busType: '质检', elapsedTime: '', judgeComplete: false, disabled: true, yctBusId: 0, yctPlanId: 0 },
        ], // 状态名字

        // 进度条时间轴
        progressVisible: false,
        progressName: '',
        progressData: [],
      };
    },
    mounted() {
      this.selectSapNum = this.$route.query.sapNumber;
      if (this.selectSapNum) {
        this.getProgressList();
      }
    },

    methods: {

      test() {
        // this.getProgressList();
        console.log('totalData', this.totalData);
        // let aaa = this.leftOption[0].split(',');
        // aaa = aaa.map(item => {
        //   item = item.substring(4);
        //   console.log('item', item);
        //   return item
        // })
        // console.log('aaa', aaa);
        getYctPlanBus({ yctPlanId: this.totalData[this.leftOption[this.selectMenuKey]][0].yctPlanId }).then(data => {
          console.log('new data', data);
        });
      },

      getProgressList() {
        getYctList({ sapNumber: this.selectSapNum }).then((data) => {
          if (data.success) {
            data = data.result;
            this.totalData = data;
            this.leftOption = [];
            for (let plan in data) {
              this.leftOption.push(plan);
              let planTem = plan.split(',');
              // planTem = planTem.map(item => {
              //   item = item.substring(4);
              //   return item;
              // });
              this.leftOptionAfterHandel.push(planTem);
            }
            if (this.leftOption.length) { // 默认选中第一个
              // this.selectedKeys = [this.leftOption[0]];
              // this.menuClick({ key: this.leftOption[0] });
              this.selectMenuKey = 0;
              this.menuSelect(0);
            }
          } else {
            this.$message.error(data.message);
          }
        });
      },

      getProgress() { // 获取进度表格中的按钮组信息

        // getYctPlanBus({yctPlanId: this.totalData[this.leftOption[this.selectMenuKey]][0].yctPlanId}).then(data => {
        //   console.log('new data', data);
        // })
        // getYctProgress({ applyNumber: this.dataSource['applyNumber'] }).then((data) => {
        getYctPlanBus({ yctPlanId: this.totalData[this.leftOption[this.selectMenuKey]][0].yctPlanId }).then(data => {
          if (data.success) {
            data = data.result;
            for (let i = 0; i < this.processState.length; i++) {
              this.processState[i].elapsedTime = '';
              this.processState[i].judgeComplete = false;
              this.processState[i].disabled = true;

            }
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < this.processState.length; j++) {
                if (data[i].busType === this.processState[j].busType) {
                  this.processState[j].elapsedTime = data[i].elapsedTime;
                  this.processState[j].judgeComplete = data[i].judgeComplete;
                  this.processState[j].disabled = false;

                  this.processState[j].yctBusId = data[i].yctBusId;
                  this.processState[j].yctPlanId = data[i].yctPlanId;
                }
              }
            }
          } else {
            this.$message.error(data.message);
          }
        });
      },

      getTracking(item) {
        console.log('item', item);

        this.progressName = item.busType;
        this.progressVisible = true;
        // getYctTracking({ applyNumber: this.dataSource['applyNumber'] }).then((data) => {
        //   if (data.success) {
        //     data = data.result;
        //     this.progressData = data;
        //   } else {
        //     this.$message.error(data.message);
        //   }
        // });
        let params = {
          busType: item.busType,
          yctBusId: item.yctBusId,
        };
        getYctPlanBusProgress(params).then((data) => {
          if (data.success) {
            data = data.result;
            this.progressData = data;
          } else {
            this.$message.destroy();
            this.$message.error(data.message);
          }
        });
      },

      menuClick(event) {
        this.purchaseParamData = this.totalData[event.key][0];
        console.log('event.key', event.key);
        this.dataSource = [{
          sapNumber: this.purchaseParamData['sapNumber'],
          applyType: this.purchaseParamData['applyType'],
          applyNumber: this.purchaseParamData['applyNumber'],
        }];
        this.getProgress();
      },

      menuSelect(index) {
        this.selectMenuKey = index;
        this.purchaseParamData = this.totalData[this.leftOption[index]][0];
        this.dataSource = [{
          sapNumber: this.purchaseParamData['sapNumber'],
          applyType: this.purchaseParamData['applyType'],
          applyNumber: this.purchaseParamData['applyNumber'],
        }];
        this.getProgress();
      },

      checkState(operate, i, name) {
        this.progressName = name;
        this.progressVisible = true;
      },

      returnButtonType(state, disabled) {
        if (!disabled) {
          switch (state) {
            case '是':
              return { background: '#347ef2', color: 'white' }; // 1 是已处理
            case '否':
              return { background: '#ff4081', color: 'white' }; // 2 是处理中
            // case 3:
            //   return 'primary'; // 3 是已处理
          }
        }
      },

      sureProgress() {
        this.progressVisible = false;
      },
    },
  };
</script>

<style scoped lang="less">
  /*新样式*/
  /deep/ .ant-card-body {
    padding: 24px;
  }

  .container {
    min-width: 1600px;
    display: flex;

    /deep/ .ant-table-thead {
      th {
        font-size: 16px;
        color: rgba(0, 0, 0, .65) !important;
        padding: 12px 16px !important;
      }
    }

    /deep/ .ant-table-body {
      th {
        font-size: 16px;
        color: rgba(0, 0, 0, .65) !important;
        padding: 12px 16px !important;
      }

      td {
        font-size: 16px;
        color: rgba(0, 0, 0, .85) !important;
        padding: 8px 16px !important;
      }

      tr {
      }

      tBody tr:nth-child(even) {
        background-color: #F3F7F9
      }
    }

    /deep/ .ant-table-tbody > tr > td {
      padding: 8px 16px;
    }
  }

  .menu-container {
    width: 277px;

    .menu-item {
      width: 100%;
      /*height: 152px;*/
      display: flex;
      margin-bottom: 1px;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 25px 16px;
      background: #e2e6ed;
      cursor: pointer;

      .menu-msg-container {
        margin-left: 8px;

        .menu-msg-title {
          font-size: 16px;
          color: #2d2e30;
          margin-bottom: 9px;
        }

        .menu-msg {
          font-size: 14px;
          color: #7c7f83;
          margin-bottom: 5px;
        }
      }
    }

    .menu-item-select {
      background: #ffffff;

      .menu-msg-title {
        color: #347ef2 !important;
      }

      .menu-msg {
        color: #8c8c8c !important;
      }
    }
  }

  .right-msg-container {
    width: calc(100% - 300px);
    margin-left: 20px;
  }

  .part-title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 30px;
    line-height: 30px;
    border-radius: 2px;
    background: #f4f5f7;
    margin-bottom: 12px;

    .blue-stripe {
      width: 3px;
      height: 20px;
      background: #347EF2;
      margin: 0 8px 0 4px;
      border-radius: 10px;
    }
  }

  table {
    border-top: solid 1px #f0f2f5;
    border-left: solid 1px #f0f2f5;
    /*margin-bottom: 32px;*/

    tr {
      td {
        height: 53px;
        color: rgb(0, 0, 0);
        font-size: 16px;
        border-right: solid 1px #f0f2f5;
        border-bottom: solid 1px #f0f2f5;
      }

      .item-title {
        width: 170px;
        padding-left: 12px;
        background: #f5f8fa;
      }

      .item-value {
        width: 270px;
        padding: 0 16px;
        word-break: break-all;
        color: rgba(0, 0, 0, 0.65);
      }

      .item-value-long {
        width: 1150px;
      }
    }
  }


  /*旧样式*/
  .operate-row {
    .ant-btn {
      height: 50px;
      padding: 0 20px;
    }
  }

  .progress-card {
    /*min-width: 1600px;*/
    overflow-x: auto;
  }


  .progress-container {
    display: flex;
  }

  .infor-container {
    /*width: 1000px;*/
    /*margin-left: 50px;*/
  }

  .table-title {
    font-size: 18px;
    font-weight: bold;
    /*margin: 0 0 20px 50px;*/
    margin-bottom: 20px;
  }

  .flex-left {
    display: flex;
    justify-content: flex-start;
    /*margin: 10px 0;*/
  }

  .progress-title {
    font-size: 16px;
    font-weight: bold;
    color: #1890FF;
    margin-left: 20px;
    /*margin: 20px;*/
  }

  .progress-body {
    width: 80%;
    display: flex;
    margin: 20px 0 0 30px;

  }

  /deep/ .ant-timeline-item-last > .ant-timeline-item-content {
    min-height: 20px;
  }

  /deep/ .ant-timeline-item-content {
    top: -15px;
    background: #f0f0f0;
    border-radius: 4px;
    /*padding: 10px;*/
    margin: 0 0 0 20px;
    width: 450px;
    padding: 15px;
  }

  .progress-modal {
    /deep/ .ant-modal-body {
      background: white;
    }
  }
</style>