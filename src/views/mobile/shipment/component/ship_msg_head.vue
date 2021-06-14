<template>
  <div class="app_head">
    <div class="app_haed_body">
      <div class="a_h_ban1 dis_f">
        <div class="a_h_ban1_1">流转单信息</div>
        <div class="a_h_ban1_2 dis_f">
          <div class="a_h_ban1_2_1 a_op8">流转单状态：</div>
          <div class="a_h_ban1_2_2 blue_color">
            <img class="icon_img" src="../../../../assets/mobile/shipment_app/head_icon_01.png" />
          </div>
          <div class="a_h_ban1_2_3 blue_color">{{taskStatus_L || '-'}}</div>
        </div>
      </div>
      <div class="a_h_ban2 a_op8">{{shipNumber}}</div>
      <div class="a_h_ban3" v-if="getShowChu(pageStatus)" @click="showDrawer()">
        <img
          class="icon_img icon_img2"
          src="../../../../assets/mobile/shipment_app/head_icon_02.png"
        />
        出库进度
      </div>
    </div>
    <div class="dialog">
      <a-drawer
        placement="right"
        :closable="false"
        :destroyOnClose="true"
        :visible="visible"
        :after-visible-change="afterVisibleChange"
        @close="onClose"
        :headerStyle="headerStyle"
        :bodyStyle="bodyStyle"
        wrapClassName="dialog_drawer"
      >
        <div class="dialog_drawer_title">
          <div class="ddt_ban1">
            <img class="icon_img4" src="../../../../assets/mobile/shipment_app/head_icon_03.png" />
            <div class="ddt_ban1_title">出库进度</div>
          </div>
          <div class="ddt_ban2">
            <!-- 代替下划线的横线 -->
            <!-- head_tiao_01 -->
            <img class="icon_img3" src="../../../../assets/mobile/shipment_app/head_tiao_01.png" />
          </div>
        </div>
        <div>
          <checkOutDialog :id="shipNumber" @close="onClose"></checkOutDialog>
        </div>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import checkOutDialog from '../checkOutDialog'
export default {
  name: 'ShipMsgHead',
  data() {
    return {
      pageData: {},
      value: null,
      visible: false,
      headerStyle: {
        padding: 0,
        margin: 0,
        height: 0
      },
      bodyStyle: {
        padding: 0,
        margin: 0
      }
    }
  },
  props: ['id', 'isShow', 'matterData', 'pageStatus', 'taskStatus_L', 'shipNumber'],
  components: { checkOutDialog },
  created() {},
  // watch: {
  //   matterData: {
  //     //深度监听，可监听到对象、数组的变化
  //     handler(val, oldVal) {
  //       // this.pageData = val
  //       this.pageData = JSON.parse(JSON.stringify(val))
  //     },
  //     deep: true //true 深度监听
  //   }
  // },
  methods: {
    // 发运任务状态 2：复查任务 3：包装确认 4：提货确认 有出库进度查询
    getShowChu(type) {
      if (type == 2 || type == 3) {
        return true
      } else {
        return false
      }
    },
    afterVisibleChange(val) {
      console.log('visible', val)
    },
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    }
  }
}
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid #e8e8e8;
}
th {
  border-top: 0;
}
th,
td {
  padding: 8px;
  text-align: center;
}
.table_1 td {
  width: 120px;
}
.table_2 td,
.table_2 th {
  width: 240px;
}
.td_img {
  width: 120px;
  height: auto;
}
.table_1,
.table_2 {
  border: 1px solid #e8e8e8;
}
.m_b_15 {
  margin-top: 20px;
}
.head_main {
  position: relative;
}
.app_img {
  width: 100%;
  height: auto;
  display: block;
}
.aap_zimu {
  color: #fff;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.zimu_1 {
  padding: 16% 20px 0 20px;
  font-size: 28px;
}
.zimu_2 {
  padding: 0 20px 0 20px;
  font-size: 16px;
}
.zimu_3 {
  padding: 20px 20px 0 20px;
  font-size: 16px;
  text-align: right;
}

/* 511 */
.app_haed_body {
  background: #012245;
  border-radius: 5px;
  padding: 15px;
  margin: 0 15px 15px 15px;
  color: #fff;
}
.dis_f {
  display: flex;
}
.blue_color {
  color: #2a7bf1;
}
.a_h_ban1 {
  justify-content: space-between;
}
.a_h_ban1_1,
.a_h_ban2 {
  font-size: 16px;
}
.a_op8 {
  opacity: 0.8;
}
.a_h_ban1_2_3 {
  margin-left: 5px;
}
.a_h_ban3 {
  margin-top: 8px;
  border-top: 1px solid rgba(232, 232, 232, 0.4);
  padding-top: 10px;
  color: #fff;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog_drawer /deep/ .ant-drawer-content {
  border-radius: 15px 0 0 15px;
}
.blue_color {
  color: #2a7bf1;
}

.list_item_1_1_icon {
  font-size: 19px;
  width: 20px;
  height: 20px;
}
.ddt_ban1 {
  display: flex;
  align-content: center;
  padding: 20px 15px 15px 10px;
}
.ddt_ban1_title {
  font-size: 17px;
  margin: 0 10px;
}
.icon_img {
  display: block;
  width: 22px;
  height: auto;
}
.icon_img4 {
  display: block;
  width: 25px;
  height: auto;
}
.icon_img2 {
  width: 14px;
  height: 16px;
  margin-right: 5px;
}
.icon_img3 {
  display: block;
  width: 100%;
  height: auto;
}
</style>