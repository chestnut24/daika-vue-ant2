<template>
  <div class="ship_review_time">
    <div class="banner1 ban_title">
      <div class="banner1_1"></div>
      <div class="banner1_2">复查计划</div>
    </div>
    <div class="banner2">
      <table class="table_2">
        <tr>
          <td style="width: 240px;background: #F5F8FA;">计划复查时间</td>
          <td style="width: 480px;">{{chooseTime}}</td>
        </tr>
      </table>
    </div>
    <!-- banner3 -->
    <div v-if="isShow"></div>
    <div class="banner3 foot my_page_btn" v-if="!isShow">
      <a-button class="page_btn" type="primary" @click="acceptubmit()" :loading="submit_loading">接收</a-button>
    </div>
  </div>
</template>

<script>
import { getShipPlanMsgById, editShipPlanTime, editShipTaskaccept } from '@/api/api'
export default {
  name: 'shipReviewTime',
  data() {
    return {
      chooseTime: null,
      mainData: {},
      yangList: [],
      submit_loading: false
    }
  },
  props: ['id', 'isShow'],
  created() {
    console.log(this.isShow)
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
      // this.$emit('close')
      // /app/shipment/ShipTaskList
      this.$router.push({
        path: '/app/shipment/ShipTaskList'
      })
    },
    acceptubmit() {
      // 弹窗-确认下发
      this.$confirm({
        title: '确认执行接收操作?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.submit_loading = true
          editShipTaskaccept({
            shipmentManagementId: this.id
          }).then(data => {
            console.log(data)
            if (data.success) {
              this.$message.success('接收' + data.message)
              this.submit_loading = false
              // 本页面刷新还是返回列表页
              this.close()
            } else {
              this.$message.error(data.message)
              this.submit_loading = false
            }
          })
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    }
  }
}
</script>

<style scoped>
.ship_review_time {
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
  /* border-top: 0; */
}
.page_btn {
  width: 86%;
  background: #2a7bf1;
}
.my_page_btn /deep/ .ant-btn {
  height: auto;
  padding: 10px 0;
  font-size: 16px;
}
.banner1 {
  padding: 8px 15px;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  /* border-bottom: 1px solid #f0f2f5; */
}
.banner1_1 {
  width: 3px;
  height: 19px;
  border-radius: 1.5px;
  background: #317ff2;
  margin-right: 10px;
  margin-top: 3px;
}
.banner1_2 {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}
</style>