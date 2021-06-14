<template>
  <div class="reviewTimeDialog" :style="'min-height: '+page_height+'px;'">
    <div class="my_tabs">
      <div class="tab_pane" @click="tabsKey = '1'" :class="tabsKey === '1'?'tab_pane_choose':''">
        流转单信息
        <div class="tab_pane_bottom"></div>
      </div>
      <div class="tab_pane" @click="tabsKey = '2'" :class="tabsKey === '2'?'tab_pane_choose':''">
        发运进程
        <div class="tab_pane_bottom"></div>
      </div>
      <!-- <div class="tab_pane" @click="tabsKey = '4'" :class="tabsKey === '4'?'tab_pane_choose':''">
        流程信息
        <div class="tab_pane_bottom"></div>
      </div> -->
      <div class="tab_pane" @click="tabsKey = '3'" :class="tabsKey === '3'?'tab_pane_choose':''">
        过程指令({{processOrder_number}})
        <div class="tab_pane_bottom"></div>
      </div>
    </div>
    <div class="app_ban1">
      <a-tabs v-model="tabsKey" :tabBarStyle="tabBarStyle" :tabBarGutter="0" size="small">
        <a-tab-pane key="1" tab="流转单信息">
          <ShipMsgHead
            :id="id"
            :isShow="true"
            :taskStatus_L="taskStatus_L"
            :shipNumber="shipNumber"
          ></ShipMsgHead>
          <div class="app_3_ban2"></div>
          <!-- 流转单信息的组件-建议进组件 -->
          <viewDetailsAll :id="id"></viewDetailsAll>
        </a-tab-pane>
        <a-tab-pane key="2" tab="发运进程">
          <!-- 表头组件-有按钮 -->
          <ShipMsgHead
            :id="id"
            :isShow="false"
            :pageStatus="pageStatus"
            :taskStatus_L="taskStatus_L"
            :shipNumber="shipNumber"
          ></ShipMsgHead>
          <div class="app_3_ban2"></div>
          <!-- 本页面组件 -->
          <!-- 发运任务状态 0 :待接收 1：发运物料确认 2：复查任务 3：包装确认 4：提货确认 5：物流信息维护 6:发运完成 -->
          <div v-if="pageStatus == 0">
            <shipReviewTime :id="id" :isShow="false"></shipReviewTime>
          </div>
          <div v-if="pageStatus == 1">
            <wuliaoDialog :id="id"></wuliaoDialog>
          </div>
          <div v-if="pageStatus == 2">
            <fuchaDialog :id="id"></fuchaDialog>
          </div>
          <div v-if="pageStatus == 3">
            <baozhuangDialog :id="id"></baozhuangDialog>
          </div>
          <div v-if="pageStatus == 4"></div>
          <div v-if="pageStatus == 5">
            <wuliuDialog :id="id"></wuliuDialog>
          </div>

          <!-- 全都有的状态 -->
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
          <!-- <div class="ceshi" style="width: 100%;display: block;">
            <img src="./component/img/发运任务-3-发运进程-物流信息维护.png" />
          </div>-->
        </a-tab-pane>
        <a-tab-pane key="4" tab="流程信息">开发中</a-tab-pane>
        <a-tab-pane key="3" :tab="'过程指令('+processOrder_number+')'">
          <!-- 表头组件-仅展示 -->
          <ShipMsgHead
            :id="id"
            :isShow="true"
            :taskStatus_L="taskStatus_L"
            :shipNumber="shipNumber"
          ></ShipMsgHead>
          <div class="app_3_ban2 m_b_15"></div>
          <div class="ling_body">
            <div
              class="ling_body_item"
              v-for="(process,index) in processOrder_list"
              :key="index"
              :class="index === processOrder_list.length -1?'':'ab3i'"
            >
              <listLingItem :matterData="process"></listLingItem>
            </div>
            <div class="length0_tip" v-if="processOrder_list.length === 0">暂无数据</div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import ShipMsg3 from './component/ship_msg_3'
import ShipMsg4 from './component/ship_msg_4'
import ShipMsg5 from './component/ship_msg_5'
import ShipMsg6 from './component/ship_msg_6'
import ShipMsg7 from './component/ship_msg_7'
import ShipMsg8 from './component/ship_msg_8'
import ShipMsg9 from './component/ship_msg_9'
import ShipMsgHead from './component/ship_msg_head'
import shipReviewTime from './component/ship_review_time'
import listLingItem from './component/list_ling_item'

import wuliaoDialog from './wuliaoDialog'
import fuchaDialog from './fuchaDialog'
import baozhuangDialog from './baozhuangDialog'
import wuliuDialog from './wuliuDialog'
import viewDetailsAll from './viewDetailsAll'
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

      processOrder_number: 0,
      processOrder_list: [],
      // 页面存值
      id: null,
      pageStatus: null,
      page_height: 669,
      tabBarStyle: {
        height: 0,
        overflow: 'hidden',
        borderBottom: 0
      },
      tabsKey: '2'
    }
  },
  components: {
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
    wuliuDialog,
    viewDetailsAll,
    listLingItem
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
    // 获取浏览器高度
    this.page_height = window.screen.height - 59 - 48
    console.log(window.screen.height)
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
.reviewTimeDialog {
  /* width: calc(100% + 24px); */
  height: auto;
  background: #fff;
  /* padding: 5px; */
  /* margin: -12px -12px 0 -12px; */
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
.page_btn {
  width: 80%;
}
.banner3_dianjiao {
  width: 100%;
  height: 71px;
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
.app_3_ban2 {
  background: #e9f1f6;
  width: 100%;
  height: 13px;
}
.m_b_15 {
  margin-bottom: 15px;
}
.ling_body {
  padding: 0 15px 10px 15px;
}
.ab3i {
  margin-bottom: 15px;
}

.my_tabs {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
}
.tab_pane {
  color: rgba(0, 0, 0, 0.4);
  padding: 10px 0;
  padding-bottom: 0;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
.tab_pane_choose {
  color: rgba(0, 0, 0, 1);
  font-weight: 600;
}
.tab_pane .tab_pane_bottom {
  background: transparent;
  width: 30px;
  height: 3px;
  border-radius: 1.5px;
  margin-top: 10px;
  margin-bottom: -1px;
  position: relative;
}
.tab_pane_choose .tab_pane_bottom {
  background: #317ff2;
}
.length0_tip {
  font-size: 14px;
  text-align: center;
  color: rgba(0, 0, 0, 0.4);
}
</style>