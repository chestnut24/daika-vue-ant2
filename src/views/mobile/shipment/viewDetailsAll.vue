<template>
  <div class="viewBothMsg">
    <!-- 基础信息展示 -->
    <div v-if="page_path_1">
      <div class="app_vbm_tabs_my">
        <div class="app_ban1_tabs">
          <div
            class="app_ban1_tab_pane"
            :class="tabs_key === '1'?'':'app_ban1_tab_pane_noc'"
            @click="tabs_key = '1'"
          >基本信息</div>
          <div
            class="app_ban1_tab_pane"
            :class="tabs_key === '2'?'':'app_ban1_tab_pane_noc'"
            @click="tabs_key = '2'"
          >过程状态</div>
          <div
            class="app_ban1_tab_pane"
            :class="tabs_key === '3'?'':'app_ban1_tab_pane_noc'"
            @click="tabs_key = '3'"
          >成品检验</div>
          <div
            class="app_ban1_tab_pane"
            :class="tabs_key === '4'?'':'app_ban1_tab_pane_noc'"
            @click="tabs_key = '4'"
          >包装清单</div>
        </div>
      </div>
      <div class="app_vbm_tabs_true">
        <a-tabs v-model="tabs_key" :tabBarStyle="tabBarStyle" :tabBarGutter="0" size="small">
          <a-tab-pane key="1" tab="基本信息">
            <ship-msg1 :mainData="mainData" :yangList="yangList" :isShow="true"></ship-msg1>
          </a-tab-pane>
          <a-tab-pane key="2" tab="过程状态">
            <ship-msg2 :productInspection="productInspection" :isShow="true" :showKey="2"></ship-msg2>
          </a-tab-pane>
          <a-tab-pane key="3" tab="成品检验">
            <ship-msg2 :productInspection="productInspection" :isShow="true" :showKey="3"></ship-msg2>
          </a-tab-pane>
          <a-tab-pane key="4" tab="包装清单">
            <ship-msg3 :matterData="matterData" :isShow="true"></ship-msg3>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <!-- 非基础未知使用 -->
    <div v-if="page_path_2">
      <ship-msg1 :matterData="matterData" :isShow="true"></ship-msg1>
      <ship-msg2 :matterData="matterData" :isShow="true"></ship-msg2>
      <div class="all" v-if="pageStatus == 6">
        <div>
          <shipReviewTime :id="id" :isShow="true"></shipReviewTime>
        </div>
        <div class="banner4" v-if="pageStatus>=2">
          <ship-msg3 :matterData="matterData" :isShow="true"></ship-msg3>
        </div>
        <div class="banner_ling" v-if="pageStatus>=2 && processOrder[0].length">
          <div v-for="item in processOrder[0]" :key="item.id">
            <ship-msg9 :matterData="item" :isShow="true"></ship-msg9>
          </div>
        </div>
        <div class="banner5" v-if="pageStatus>=3">
          <ship-msg4 :matterData="fuchaData" :isShow="true"></ship-msg4>
        </div>
        <div class="banner_ling" v-if="pageStatus>=3 && processOrder[1].length">
          <div v-for="item in processOrder[1]" :key="item.id">
            <ship-msg9 :matterData="item" :isShow="true"></ship-msg9>
          </div>
        </div>
        <!-- 需要判断是不是需要出现的 ShipMsg5 -->
        <div class="banner5" v-if="pageStatus>=3 && banner5StatusFalse === false">
          <ship-msg5 :matterData="shenpiData"></ship-msg5>
        </div>
        <div class="banner6" v-if="pageStatus>=4">
          <ship-msg6 :matterData="baozhuangData" :matterData2="baozhuangData2" :isShow="true"></ship-msg6>
        </div>
        <div class="banner_ling" v-if="pageStatus>=4 && processOrder[2].length">
          <div v-for="item in processOrder[2]" :key="item.id">
            <ship-msg9 :matterData="item" :isShow="true"></ship-msg9>
          </div>
        </div>
        <div class="banner6_1" v-if="pageStatus>=4 &&banner6StatusFalse === false">
          <ship-msg8 :matterData="shenpiData"></ship-msg8>
        </div>
        <div class="banner7" v-if="pageStatus>=6">
          <ship-msg7 :matterData="wuliuData" :isShow="true"></ship-msg7>
        </div>
        <div class="banner_ling" v-if="pageStatus>=6 && processOrder[4].length">
          <div v-for="item in processOrder[4]" :key="item.id">
            <ship-msg9 :matterData="item" :isShow="true"></ship-msg9>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShipMsg1 from './component/ship_msg_1'
import ShipMsg2 from './component/ship_msg_2'
import ShipMsg3 from './component/ship_msg_3'
import ShipMsg4 from './component/ship_msg_4'
import ShipMsg5 from './component/ship_msg_5'
import ShipMsg6 from './component/ship_msg_6'
import ShipMsg7 from './component/ship_msg_7'
import ShipMsg8 from './component/ship_msg_8'
import ShipMsg9 from './component/ship_msg_9'
import ShipMsgHead from './component/ship_msg_head'
import shipReviewTime from './component/ship_review_time'

import wuliaoDialog from './wuliaoDialog'
import fuchaDialog from './fuchaDialog'
import baozhuangDialog from './baozhuangDialog'
import wuliuDialog from './wuliuDialog'
// wuliuDialog
import { getShipTaskMsgById, editShipTaskLogistics } from '@/api/api'
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

      processOrder_number: 2,
      processOrder_list: [],
      // 页面存值
      id: null,
      pageStatus: null,
      page_path_1: true,
      page_path_2: false,
      tabs_key: '1',
      tabBarStyle: {
        height: 0,
        overflow: 'hidden',
        borderBottom: 0,
        margin: 0
      }
    }
  },
  components: {
    ShipMsg1,
    ShipMsg2,
    ShipMsg3,
    ShipMsg4,
    ShipMsg5,
    ShipMsg6,
    ShipMsg7,
    ShipMsg8,
    ShipMsg9,
    ShipMsgHead,
    wuliaoDialog,
    fuchaDialog,
    shipReviewTime,
    baozhuangDialog,
    wuliuDialog
  },
  created() {
    // 页面需要接受id和状态
    console.log(this.$route.query)
    this.id = this.$route.query.id
    this.pageStatus = this.$route.query.taskStatus
    this.taskStatus_L = this.$route.query.taskStatus_L
    this.shipNumber = this.$route.query.shipNumber

    // 需要加载，包括过程指令
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
          // 过程指令 = shipmentProcessOrderVoList
          this.processOrder = this.getProcess(data.shipmentProcessOrderVoList || [])
          this.processOrder_number = data.shipmentProcessOrderVoList.length || 0
          this.processOrder_list = data.shipmentProcessOrderVoList || []
          console.log(this.wuliuData)
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
    }
  }
}
</script>

<style scoped>
.viewBothMsg {
  width: 100%;
  height: auto;
}

.app_ban1_tabs {
  background: #e1ecfd;
  border-radius: 8px;
  display: flex;
  width: 100%;
  padding: 3px;
  box-sizing: border-box;
}
.app_ban1_tabs .app_ban1_tab_pane {
  width: 50%;
  background: #2a7bf1;
  color: #fff;
  padding: 6px 0;
  text-align: center;
  border-radius: 8px;
  transition: all 0.2s;
}
.app_ban1_tabs .app_ban1_tab_pane_noc {
  width: 50%;
  background: #e1ecfd;
  color: #2a7bf1;
  padding: 6px 0;
  text-align: center;
  border-radius: 8px;
}
.app_vbm_tabs_my {
  padding: 5px 15px;
  font-size: 14px;
}
</style>