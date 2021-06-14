<template>
  <div class="fuchaDialog">
    <!-- <div class="banner1">
      <ship-msg1 :mainData="mainData" :yangList="yangList"></ship-msg1>
    </div>
    <div class="banner2">
      <ship-msg2 :productInspection="productInspection"></ship-msg2>
    </div> -->
    <!-- <div class="banner4">
      <ship-msg3 :matterData="matterData" :isShow="true"></ship-msg3>
    </div> -->
    <!-- <div class="banner_ling" v-if="processOrder[0].length">
      <div v-for="item in processOrder[0]" :key="item.id">
        <ship-msg9 :matterData="item" :isShow="true"></ship-msg9>
      </div>
    </div> -->
    <div class="banner5">
      <ship-msg4 ref="childMethod" :matterData="fuchaData" :isShow="banner5Status"></ship-msg4>
    </div>
    <div class="banner_ling" v-if="processOrder[1].length">
      <div v-for="item in processOrder[1]" :key="item.id">
        <ship-msg9 :matterData="item" :isShow="!banner5StatusFalse">
          <template v-slot:btn>
            <a-switch
              checked-children="确认接收"
              un-checked-children="未接收"
              :default-checked="false"
              v-model="item.isQue"
              @change="switchOnchange($event, 1)"
            />
          </template>
        </ship-msg9>
      </div>
    </div>
    <div class="banner5" v-if="banner5StatusFalse === false">
      <ship-msg5 :matterData="shenpiData"></ship-msg5>
    </div>
    <!-- banner3 -->
    <div class="banner3 foot my_page_btn">
      <a-button
        v-if="banner5StatusFalse === false"
        class="page_btn"
        type="primary"
        @click="submit()"
        :disabled="banner5Status"
        :loading="submit_loading"
      >提交</a-button>
      <a-button
        v-if="banner5StatusFalse === true"
        class="page_btn"
        type="primary"
        @click="submit()"
        :disabled="(!isCanSubmit_ling)"
        :loading="submit_loading"
      >提交</a-button>
    </div>
    <div class="banner3_dianjiao"></div>
  </div>
</template>

<script>
import ShipMsg1 from './component/ship_msg_1'
import ShipMsg2 from './component/ship_msg_2'
import ShipMsg3 from './component/ship_msg_3'
import ShipMsg4 from './component/ship_msg_4'
import ShipMsg5 from './component/ship_msg_5'
import ShipMsg9 from './component/ship_msg_9'
import { getShipTaskMsgById, editShipTaskRetask } from '@/api/api'
export default {
  name: 'fuchaDialog',
  data() {
    return {
      chooseTime: null,
      mainData: {},
      yangList: [],
      productInspection: {},
      matterData: {},
      fuchaData: {},
      shenpiData: {},
      banner5Status: false,
      banner5StatusFalse: true,
      submit_loading: false,
      processOrder: [[], [], [], [], []],
      isCanSubmit_ling: true
    }
  },
  props: ['id'],
  components: { ShipMsg1, ShipMsg2, ShipMsg3, ShipMsg4, ShipMsg5, ShipMsg9 },
  created() {
    this.getMsg()
  },
  methods: {
    // 查询列表
    getMsg() {
      getShipTaskMsgById({
        shipmentManagementId: this.id
      }).then(data => {
        console.log(data)
        if (data.shipmentManagementInfoVo && data.shipmentManagementInfoVo.wheelShape) {
          this.mainData = data.shipmentManagementInfoVo
          this.yangList = data.shipmentSendSampleDemandVoList
          // 成品检验 - shipmentFinalProductTestVo，shipmentProcessStateVo
          this.productInspection = { ...data.shipmentFinalProductTestVo, ...data.shipmentProcessStateVo }
          // 物料确认 - shipmentSamplePackingListVo
          this.matterData = data.shipmentSamplePackingListVo
          // 复查任务 - shipmentRetaskManagementVo
          this.fuchaData = data.shipmentRetaskManagementVo
          this.banner5Status =
            data.shipmentRetaskManagementVo.endorsement == 0 || data.shipmentRetaskManagementVo.endorsement == 1
              ? true
              : false
          // 审批结果 - shipmentEndorsementResultVo
          this.shenpiData = data.shipmentEndorsementResultVo
          this.banner5StatusFalse = data.shipmentRetaskManagementVo.endorsement == 1 ? false : true
          // 过程指令 = shipmentProcessOrderVoList
          this.processOrder = this.getProcess(data.shipmentProcessOrderVoList || [])
          if (this.processOrder[1].length) {
            this.isCanSubmit_ling = false
          }
        } else if (data.success) {
          this.$message.success(data.message)
        } else {
          this.$message.error(data.message)
        }
      })
    },
    onTimeChange(data, a) {
      // console.log(this.chooseTime)
    },
    getProcess(list) {
      // influenceProcess: 0-1-2-3-4 0：物料确认 1：复查任务 2：包装确认 3：提货确认(null) 4：物流信息维护
      let data = [[], [], [], [], []]
      if (list && list.length) {
        list.forEach((item,index)=>{
          item.influenceProcess = Number(item.influenceProcess) - 1
          if (item.influenceProcess == 0){
            data[0].push(item);
          } else if (item.influenceProcess == 1){
            data[1].push(item);
          } else if (item.influenceProcess == 2){
            data[2].push(item);
          } else if (item.influenceProcess == 3){
            data[3].push(item);
          } else if (item.influenceProcess == 4){
            data[4].push(item);
          }
        });
      }
      return data
    },
    switchOnchange(data, i) {
      let return_data = true
      this.processOrder[i].forEach(item => {
        if (!(item.isQue === true)) {
          return_data = false
        }
      })
      this.isCanSubmit_ling = return_data
    },
    submit() {
      this.submit_loading = true
      let returnData = this.$refs.childMethod.submit()
      if (returnData.isCan) {
        let stringData = JSON.parse(JSON.stringify(returnData.data))
        if (stringData.endorsement !== null) {
          stringData.endorsement = stringData.endorsement.toString()
        }
        editShipTaskRetask({
          ...stringData,
          defectDescription: returnData.defectDescription,
          shipmentManagementId: this.id
        }).then(data => {
          if (data.success) {
            this.$message.success('提交' + data.message)
            this.close()
            this.submit_loading = false
          } else {
            this.$message.error(data.message)
            this.submit_loading = false
          }
        })
      } else {
        this.$message.error(returnData.errorMsg);
        this.submit_loading = false
      }
    },
    close() {
      // this.$emit('close')
      this.$router.push({
        path: '/app/shipment/ShipTaskList'
      })
      // /app/shipment/ShipTaskList
    }
  }
}
</script>

<style scoped>
.fuchaDialog {
  width: 100%;
  height: auto;
}
.banner3 {
  margin-top: 15px;
  background: #fff;
  text-align: center;
  position: fixed;
  bottom: 55px;
  left: 0;
  width: 100%;
  padding: 30px 0;
  padding-top: 10px;
}
.page_btn{
  width: 86%;
  background: #2a7bf1;
}
.my_page_btn /deep/ .ant-btn{
  height: auto;
  padding: 10px 0;
  font-size: 16px;
}
.banner3_dianjiao{
  width: 100%;
  height: 75px;
}
.m_r_20 {
  margin-right: 20px;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid #e8e8e8;
  border-top: 0;
}
th,
td {
  padding: 8px;
  text-align: center;
}
.table_2 td {
  width: 240px;
}
.td_img {
  width: 220px;
  height: auto;
}
.table_2 {
  border: 1px solid #e8e8e8;
  border-top: 0;
}
.banner_ling {
  margin-top: 15px;
}
</style>