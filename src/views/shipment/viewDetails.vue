<template>
  <div class="reviewTimeDialog">
    <!-- banner3 -->
    <div v-if="page_isNoRunner">
      <!-- 发运任务状态 0 :待接收 1：发运物料确认 2：复查任务 3：包装确认 4：提货确认 5：物流信息维护 -->
      <!-- 全都有的状态 -->
      <div class="banner1">
        <ship-msg1 :mainData="mainData" :yangList="yangList"></ship-msg1>
      </div>
      <div class="banner2">
        <ship-msg2 :productInspection="productInspection"></ship-msg2>
      </div>
      <div class="banner4">
        <ship-msg3 :matterData="matterData" :isShow="true"></ship-msg3>
      </div>
      <div class="banner_ling" v-if="pageStatus>=2 && processOrder[0].length">
        <div v-for="(item,index) in processOrder[0]" :key="item.id">
          <ship-msg9
            :matterData="item"
            :isShow="true"
            :bottomHaves="(index+1) === processOrder[0].length?true: false"
          ></ship-msg9>
        </div>
      </div>
      <div class="banner5" v-if="pageStatus>=3">
        <ship-msg4 :matterData="fuchaData" :isShow="true"></ship-msg4>
      </div>
      <div class="banner_ling" v-if="pageStatus>=3 && processOrder[1].length">
        <div v-for="(item,index) in processOrder[1]" :key="item.id">
          <ship-msg9
            :matterData="item"
            :isShow="true"
            :bottomHaves="(index+1) === processOrder[1].length?true: false"
          ></ship-msg9>
        </div>
      </div>
      <!-- 需要判断是不是需要出现的 ShipMsg5 -->
      <div class="banner5" v-if="pageStatus>=3 && banner5StatusFalse === false">
        <ship-msg5 :matterData="shenpiData"></ship-msg5>
      </div>
      <!-- 对下面是不是出现的整体判断 -->
      <!-- 1. 需要审批框显示，判断是不是再次试制，是试制，不显示后续内容 -->
      <!-- 2. 需要审批框显示，不是试制的，显示后续内容 -->
      <!-- 3. 不显示审批框，显示后续内容 -->
      <div
        v-if="(pageStatus>=3 && banner5StatusFalse === false)&& shenpiData.projectManagerResult == 2"
      >
        <!-- 不显示后续内容 -->
      </div>
      <div v-else>
        <div class="banner6" v-if="pageStatus>=4">
          <ship-msg6 :matterData="baozhuangData" :matterData2="baozhuangData2" :isShow="true"></ship-msg6>
        </div>
        <div class="banner_ling" v-if="pageStatus>=4 && processOrder[2].length">
          <div v-for="(item,index) in processOrder[2]" :key="item.id">
            <ship-msg9
              :matterData="item"
              :isShow="true"
              :bottomHaves="(index+1) === processOrder[2].length?true: false"
            ></ship-msg9>
          </div>
        </div>
        <div class="banner6_1" v-if="pageStatus>=4 &&banner6StatusFalse === false">
          <ship-msg8 :matterData="shenpiData"></ship-msg8>
        </div>
        <div class="banner7" v-if="pageStatus>=6">
          <ship-msg7 :matterData="wuliuData" :isShow="true"></ship-msg7>
        </div>
        <div class="banner_ling" v-if="pageStatus>=6 && processOrder[4].length">
          <div v-for="(item,index) in processOrder[4]" :key="item.id">
            <ship-msg9
              :matterData="item"
              :isShow="true"
              :bottomHaves="(index+1) === processOrder[4].length?true: false"
            ></ship-msg9>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <!-- 发运任务状态 0 :待接收 1：发运物料确认 2：复查任务 3：包装确认 4：提货确认 5：物流信息维护 -->
      <!-- 全都有的状态 -->
      <div class="banner1">
        <ship-msg1 :mainData="mainData" :yangList="yangList"></ship-msg1>
      </div>
    </div>
    <div class="banner3 foot">
      <a-button @click="close()">关闭</a-button>
    </div>
  </div>
</template>

<script>
import store from '@/store/'
import ShipMsg1 from './component/ship_msg_1'
import ShipMsg2 from './component/ship_msg_2'
import ShipMsg3 from './component/ship_msg_3'
import ShipMsg4 from './component/ship_msg_4'
import ShipMsg5 from './component/ship_msg_5'
import ShipMsg6 from './component/ship_msg_6'
import ShipMsg7 from './component/ship_msg_7'
import ShipMsg8 from './component/ship_msg_8'
import ShipMsg9 from './component/ship_msg_9'
import { getShipTaskMsgById, editShipTaskLogistics, getShipTaskList } from '@/api/api'
export default {
  name: 'viewDetails',
  data() {
    return {
      chooseTime: null,
      mainData: {},
      yangList: [],
      productInspection: {},
      matterData: {},
      fuchaData: {},
      shenpiData: {},
      baozhuangData: {},
      baozhuangData2: {},
      wuliuData: {},
      banner5StatusFalse: true,
      banner6StatusFalse: true,
      processOrder: [[], [], [], [], []],
      isCanSubmit_ling: true,

      pageStatus: 0,
      page_isNoRunner: true
    }
  },
  // pageStatus
  props: ['id', 'shippingFlowSheet'],
  components: { ShipMsg1, ShipMsg2, ShipMsg3, ShipMsg4, ShipMsg5, ShipMsg6, ShipMsg7, ShipMsg8, ShipMsg9 },
  created() {
    this.getList()
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
          if (data.shipmentManagementInfoVo.isItRunner == 0) {
            // 是转轮
            this.page_isNoRunner = false
          }
          this.mainData = data.shipmentManagementInfoVo
          this.yangList = data.shipmentSendSampleDemandVoList
          // 成品检验 - shipmentFinalProductTestVo，shipmentProcessStateVo
          this.productInspection = { ...data.shipmentFinalProductTestVo, ...data.shipmentProcessStateVo }
          // 物料确认 - shipmentSamplePackingListVo
          this.matterData = data.shipmentSamplePackingListVo
          // 复查任务 - shipmentRetaskManagementVo
          this.fuchaData = data.shipmentRetaskManagementVo
          // 审批结果 - shipmentEndorsementResultVo
          this.shenpiData = data.shipmentEndorsementResultVo
          this.banner5StatusFalse = data.shipmentRetaskManagementVo.endorsement == 1 ? false : true
          // 包装确认 - shipmentSendSampleDemandVoList.shipmentSamplePackingVo 和 shipmentPackagingConfirmationVo
          this.baozhuangData = data.shipmentSendSampleDemandVoList || []
          this.baozhuangData2 = data.shipmentPackagingConfirmationVo
          this.banner6StatusFalse = this.getFalseNow(data.shipmentPackagingConfirmationVo)
          // 物流信息维护
          this.wuliuData = data.shipmentLogisticsVo
          // 过程指令 = shipmentProcessOrderVoList
          this.processOrder = this.getProcess(data.shipmentProcessOrderVoList || [])
        } else if (data.success) {
          this.$message.success(data.message)
        } else {
          this.$message.error(data.message)
        }
      })
    },
    getProcess(list) {
      // influenceProcess: 0-1-2-3-4 0：物料确认 1：复查任务 2：包装确认 3：提货确认(null) 4：物流信息维护
      let data = [[], [], [], [], []]
      if (list && list.length) {
        list.forEach((item, index) => {
          item.influenceProcess = Number(item.influenceProcess) - 1
          if (item.influenceProcess == 0) {
            data[0].push(item)
          } else if (item.influenceProcess == 1) {
            data[1].push(item)
          } else if (item.influenceProcess == 2) {
            data[2].push(item)
          } else if (item.influenceProcess == 3) {
            data[3].push(item)
          } else if (item.influenceProcess == 4) {
            data[4].push(item)
          }
        })
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
    getFalseNow(data) {
      if (data.packingMethodIsItQualified == 1 || data.reportIsItQualified == 1 || data.tagIsItQualified == 1) {
        return false
      } else {
        return true
      }
    },
    onTimeChange(data, a) {
      // console.log(this.chooseTime)
    },
    submit() {
      let returnData = this.$refs.childMethod.submit()
      if (returnData.isCan) {
        editShipTaskLogistics({
          ...returnData.data,
          shipmentManagementId: this.id
        }).then(data => {
          if (data.success) {
            this.$message.success('提交' + data.message)
            this.close()
          } else {
            this.$message.error(data.message)
          }
        })
      } else {
        this.$message.error('请填写物流单号')
      }
    },
    close() {
      this.$emit('close')
    },
    getList() {
      let param = {}
      param.userId = store.getters.userInfo.id
      param.shippingFlowSheet = this.shippingFlowSheet
      getShipTaskList(param, {
        pageNo: 1,
        pageSize: 5
      }).then(data => {
        if (data.success) {
          let dataList = data.result
          if (!(dataList.records && dataList.records.length)) {
            this.pageStatus = 0
          } else {
            // 数据处理
            this.pageStatus = Number(dataList.records[0].taskStatus) || 0
            // 判断是不是轮转
            if (dataList.records[0].isItRunner == 0) {
              // 是转轮
              this.page_isNoRunner = false
            }
          }
        }
      })
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
.banner_ling {
  margin-top: 15px;
}
</style>