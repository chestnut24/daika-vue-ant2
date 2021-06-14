<template>
  <div class="app_ban2_list_item">
    <div class="list_item_1 dis_f">
      <div class="list_item_1_2">
        <div class="list_item_1_2_1">{{matterData.projectNo}}</div>
        <div class="list_item_1_2_2">{{matterData.size}}　{{matterData.purpose}}</div>
        <div class="list_item_1_2_2">{{matterData.batch}}</div>
      </div>
      <div class="list_item_1_3">
        <div class="list_item_1_3_1">已出库：<span class="green_color">{{matterData.outWarehouse}}</span></div>
      </div>
    </div>
    <div class="list_item_2 dis_f">
      <div class="list_item_2_item">
        <div class="list_item_2_item_1">仓库:</div>
        <div class="list_item_2_item_2 blue_color">{{matterData.factoryWareHouse_dictText}}</div>
      </div>
      <div class="list_item_2_item">
        <div class="list_item_2_item_1">库位:</div>
        <div class="list_item_2_item_2 blue_color">{{matterData.inventoryLocation}}</div>
      </div>
      <div class="list_item_2_item">
        <div class="list_item_2_item_1">样件位置:</div>
        <div class="list_item_2_item_2 list_item_2_item_3 blue_color">{{matterData.exemplarLocation}}</div>
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
  padding: 6px;
}
.list_item_1_1 {
  width: 32px;
}
.list_item_1_1_icon {
  font-size: 22px;
}
.list_item_1_2 {
  width: calc(100% - 80px);
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
  width: 80px;
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
  border-top: 1px solid #e8e8e8;
  margin-top: 8px;
  padding-top: 8px;
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
.list_item_2_item_3{
  text-align: center;
}

/* 多用 */
.dis_f {
  display: flex;
  width: 100%;
  justify-content: space-between;
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
.green_color{
  color: #4fd2b7;
  font-weight: 600;
}
</style>