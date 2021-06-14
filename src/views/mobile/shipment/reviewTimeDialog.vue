<template>
  <div class="reviewTimeDialog">
    <!-- banner1 -->
    <div class="banner1">
      <ship-msg1 :mainData="mainData" :yangList="yangList"></ship-msg1>
    </div>
    <!-- banner2 -->
    <div class="banner2">
      <table class="table_2">
        <tr>
          <td style="width: 240px;">计划复查时间</td>
          <td style="width: 480px;" v-if="iShow">{{chooseTime}}</td>
          <td style="width: 480px;" v-else>
            <a-date-picker
              style="width: 100%;"
              @change="onTimeChange"
              v-model="chooseTime"
              size="small"
              valueFormat="YYYY-MM-DD"
            />
          </td>
        </tr>
      </table>
    </div>
    <!-- banner3 -->
    <div class="banner3 foot" v-if="iShow">
      <a-button @click="close()">关闭</a-button>
    </div>
    <div class="banner3 foot" v-else>
      <a-button class="m_r_20" type="primary" @click="submit()" :disabled="!chooseTime" :loading="submit_loading">提交</a-button>
      <a-button @click="close()">取消</a-button>
    </div>
  </div>
</template>

<script>
import ShipMsg1 from './component/ship_msg_1'
import { getShipPlanMsgById, editShipPlanTime } from '@/api/api'
export default {
  name: 'reviewTimeDialog',
  data() {
    return {
      chooseTime: null,
      mainData: {},
      yangList: [],
      submit_loading: false,
    }
  },
  props: ['id', 'iShow'],
  components: { ShipMsg1 },
  created() {
    console.log(this.iShow)
    this.getMsg()
  },
  methods: {
    // 查询列表
    getMsg() {
      getShipPlanMsgById({
        shipmentManagementId: this.id
      }).then(data => {
        this.chooseTime = data.planRetestDate || null
        this.mainData = data.shipmentManagementInfoVo
        this.yangList = data.shipmentSendSampleDemandVoList
      })
    },
    onTimeChange(data, a) {
      // console.log(this.chooseTime)
    },
    submit() {
      this.submit_loading = true
      editShipPlanTime({
        planRetestDate: this.chooseTime,
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
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.reviewTimeDialog {
  width: 100%;
  height: auto;
}
.banner3 {
  margin-top: 15px;
  display: flex;
  justify-content: center;
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
</style>