<template>
  <div class="reviewTimeDialog">
    <!-- <div class="banner1">
      <ship-msg1 :mainData="mainData" :yangList="yangList"></ship-msg1>
    </div>
    <div class="banner2">
      <ship-msg2 :productInspection="productInspection"></ship-msg2>
    </div> -->
    <div class="banner4">
      <ship-msg3 ref="childMethod" :matterData="matterData" :isShow="false"></ship-msg3>
    </div>
    <div class="banner_ling" v-if="processOrder[0].length">
      <div v-for="(item,index) in processOrder[0]" :key="item.id">
        <ship-msg9 :matterData="item" :isShow="false" :bottomHaves="(index+1) === processOrder[0].length?true: false">
          <template v-slot:btn>
            <a-switch
              checked-children="确认接收"
              un-checked-children="未接收"
              :default-checked="false"
              v-model="item.isQue"
              @change="switchOnchange($event, 0)"
            />
          </template>
        </ship-msg9>
      </div>
    </div>
    <!-- banner3 -->
    <div class="banner3 foot">
      <!-- :disabled="!chooseTime" -->
      <a-button
        class="m_r_20"
        type="primary"
        @click="submit()"
        :loading="submit_loading"
        :disabled="!isCanSubmit_ling"
      >提交</a-button>
      <a-button @click="close()">取消</a-button>
    </div>
  </div>
</template>

<script>
import ShipMsg1 from './component/ship_msg_1'
import ShipMsg2 from './component/ship_msg_2'
import ShipMsg3 from './component/ship_msg_3'
import ShipMsg9 from './component/ship_msg_9'
import { getShipTaskMsgById, editShipTaskmatter } from '@/api/api'
export default {
  name: 'wuliaoDialog',
  data() {
    return {
      chooseTime: null,
      mainData: {},
      yangList: [],
      productInspection: {},
      matterData: {},
      submit_loading: null,
      processOrder: [[], [], [], [], []],
      isCanSubmit_ling: true
    }
  },
  props: ['id', 'iShow'],
  components: { ShipMsg1, ShipMsg2, ShipMsg3, ShipMsg9 },
  created() {
    console.log(this.iShow)
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

          // 过程指令 = shipmentProcessOrderVoList
          this.processOrder = this.getProcess(data.shipmentProcessOrderVoList || [])
          if (this.processOrder[0].length) {
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
        console.log('go')
        let stringData = JSON.parse(JSON.stringify(returnData.data))
        for (let index in stringData) {
          if (stringData[index] == 0 || stringData[index] == 1) {
            stringData[index] = stringData[index].toString()
          }
        }
        editShipTaskmatter({
          ...stringData,
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
        this.$message.error('请核对物料信息，填写表格数据')
        this.submit_loading = false
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