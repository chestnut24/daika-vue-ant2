<template>
  <div class="app_ban2_list_item">
    <div class="list_item_1 dis_f">
      <!-- 第一行 -->
      <div class="list_item_1_1">
        <!-- 图标1 -->
        <img
          class="list_item_1_1_icon list_icon"
          src="../../../../assets/mobile/shipment_app/list_01.png"
        />
      </div>
      <div class="list_item_1_2">
        <div class="list_item_1_2_1">{{matterData.shippingFlowSheet}}</div>
      </div>
      <div class="list_item_1_3">
        <div class="list_item_1_3_1">排序：{{fi_shipPlanNumber(matterData.shipPlanNumber)}}</div>
      </div>
    </div>
    <div class="list_item_1 dis_f list_item_1_spb">
      <!-- 第二行 -->
      <div class="list_item_1_1"></div>
      <div class="list_item_1_2" style="width: auto;">
        <div class="list_item_1_2_2" style="width: auto;">戴卡订单号：</div>
      </div>
      <div class="list_item_1_3" style="width: auto;flex-grow: 1;">
        <div class="list_item_1_3_2 ori_color" style="width: auto;">{{matterData.taskStatus_L}}</div>
      </div>
    </div>
    <div class="list_item_1 dis_f">
      <!-- 第三行以及之后 -->
      <div class="list_item_1_1"></div>
      <div class="list_item_1_2">
        <div class="list_item_1_2_2">{{matterData.customerOrder}}</div>
        <div class="list_item_1_2_2">计划发运时间：{{matterData.planShipmentDate || '--'}}</div>
        <div class="list_item_1_2_2">计划复查时间：{{fi_planRetestDate(matterData.planRetestDate) || '--'}}</div>
      </div>
      <div class="list_item_1_3">
        <div class="list_item_1_3_3 red_color" v-if="matterData.urgentTaskStatus == 1">
          <img class="list_icon" src="../../../../assets/mobile/shipment_app/list_02.png" />
        </div>
      </div>
      <!-- 保存原版 -->
      <!-- <div class="list_item_1_1">
        <img class="list_item_1_1_icon list_icon" src="../../../../assets/mobile/shipment_app/list_01.png">
      </div>
      <div class="list_item_1_2">
        <div class="list_item_1_2_1">{{matterData.shippingFlowSheet}}</div>
        <div class="list_item_1_2_2">戴卡订单号：{{matterData.customerOrder}}</div>
        <div class="list_item_1_2_2">计划发运时间：{{matterData.planShipmentDate || '--'}}</div>
        <div class="list_item_1_2_2">计划复查时间：{{fi_planRetestDate(matterData.planRetestDate) || '--'}}</div>
      </div>
      <div class="list_item_1_3">
        <div class="list_item_1_3_1">排序：{{fi_shipPlanNumber(matterData.shipPlanNumber)}}</div>
        <div class="list_item_1_3_2 ori_color">{{matterData.taskStatus_L}}</div>
        <div class="list_item_1_3_3 red_color" v-if="matterData.urgentTaskStatus == 1">
          <img class="list_icon" src="../../../../assets/mobile/shipment_app/list_02.png">
        </div>
      </div>-->
    </div>
    <div class="list_item_2 dis_f">
      <div class="list_item_2_item">
        <div class="list_item_2_item_1">戴卡部件号:</div>
        <div class="list_item_2_item_2 blue_color">{{matterData.wheelShape}}</div>
      </div>
      <div class="list_item_2_item">
        <div class="list_item_2_item_1">轮型尺寸:</div>
        <div class="list_item_2_item_2 blue_color">{{matterData.wheelShapeSize}}</div>
      </div>
      <div class="list_item_2_item">
        <div class="list_item_2_item_1">客户名称:</div>
        <div class="list_item_2_item_2 blue_color">{{matterData.customerName}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'listItem',
  data() {
    return {
      pageData: {},
      value: null
    }
  },
  props: ['matterData'],
  created() {},
  methods: {
    fi_shipPlanNumber(data) {
      if (this.matterData.urgentTaskStatus == 1) {
        return '--'
      } else if (data === 'null') {
        return '--'
      } else {
        return data
      }
    },
    fi_planRetestDate(data) {
      if (this.matterData.urgentTaskStatus == 1) {
        return '--'
      } else {
        return data
      }
    }
  }
}
</script>

<style scoped>
.app_ban2_list_item {
  padding: 15px 0;
}
.list_item_1_1 {
  width: 32px;
}
.list_item_1_1_icon {
  font-size: 22px;
}
.list_item_1_2 {
  width: calc(100% - 92px);
}
.list_item_1_2_1 {
  font-size: 16px;
  font-weight: 600;
}
.list_item_1_2_2 {
  font-size: 14px;
  font-weight: 300;
  color: #828282;
}
.list_item_1_3 {
  width: 60px;
  text-align: right;
}
.list_item_1_3_1 {
  font-size: 14px;
  font-weight: 300;
  color: #828282;
}
.list_item_1_3_2 {
  font-size: 15px;
  font-weight: 600;
}
.list_item_1_3_3 {
  font-size: 22px;
}

.list_item_2 {
  margin-top: 15px;
  background: #f5f8fa;
  border-radius: 8px;
  padding: 10px 20px;
}
.list_item_2_item_1 {
  font-size: 12px;
  font-weight: 300;
  color: #828282;
}
.list_item_2_item_2 {
  font-size: 16px;
  font-weight: 600;
}

/* 多用 */
.dis_f {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.list_item_1_spb{
  justify-content: flex-start;
}
.blue_color {
  color: #2a7bf1;
}
.red_color {
  color: #f23131;
}
.ori_color {
  color: #ff9e17;
}
.list_icon {
  width: 24px;
  height: auto;
}
</style>