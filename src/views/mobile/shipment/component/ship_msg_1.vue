<template>
  <div class="ShipMsg">
    <div class="banenr1">
      <div class="banner1 ban_title">
        <div class="banner1_1"></div>
        <div class="banner1_2">项目信息</div>
      </div>
      <table class="table_1">
        <tr>
          <td class="w_50" style="background: #F5F8FA;">戴卡部件号</td>
          <td class="w_50">{{mainData_p.wheelShape}}</td>
          <td class="w_50" style="background: #F5F8FA;">轮型尺寸</td>
          <td class="w_50">{{mainData_p.wheelShapeSize}}</td>
        </tr>
        <tr>
          <td class="w_50" style="background: #F5F8FA;">用途</td>
          <td class="w_50">{{mainData_p.purpose}}</td>
          <td class="w_50" style="background: #F5F8FA;">项目负责人</td>
          <td class="w_50">{{mainData_p.projectLeader}}</td>
        </tr>
      </table>
      <div class="banner1 ban_title">
        <div class="banner1_1"></div>
        <div class="banner1_2">订单信息</div>
      </div>
      <table class="table_1">
        <tr>
          <td class="w_50" style="background: #F5F8FA;">戴卡订单号</td>
          <td class="w_50">{{mainData_p.ordersId}}</td>
          <td class="w_50" style="background: #F5F8FA;">客户名称</td>
          <td class="w_50">{{mainData_p.customerName}}</td>
        </tr>
        <tr>
          <td class="w_50" style="background: #F5F8FA;">订单数量</td>
          <td class="w_50">{{mainData_p.orderNumber}}</td>
          <td class="w_50" style="background: #F5F8FA;">市场负责人</td>
          <td class="w_50">{{mainData_p.marketLeader}}</td>
        </tr>
      </table>
      <div class="banner1 ban_title">
        <div class="banner1_1"></div>
        <div class="banner1_2">发运要求</div>
      </div>
      <table class="table_2">
        <tr>
          <td class="w_50" style="background: #F5F8FA;">发运目的地</td>
          <td class="w_50" colspan="3">{{mainData_p.shipmentDestination}}</td>
        </tr>
        <tr>
          <td class="w_50" style="background: #F5F8FA;">计划发运时间</td>
          <td class="w_50">{{mainData_p.planShipmentDate}}</td>
          <td class="w_50" style="background: #F5F8FA;">紧急任务</td>
          <td class="w_50">{{mainData_p.urgentTaskStatus | f_urgentTaskStatus}}</td>
        </tr>
      </table>
      <div class="fayang_card">
        <a-carousel dot-position="top">
          <div class="card_item bg_01" v-for="(yang_item,i) in yangList_p" :key="i">
            <div class="card_item_01">
              <div class="ci_01_1">包装运输方式：</div>
              <div class="dis_f">
                <div
                  class="ci_01_2"
                >{{yang_item.packagingTransportationMode | f_packagingTransportationMode}}</div>
                <div class="ci_01_3">
                  <a-icon type="right" />
                </div>
              </div>
            </div>
            <div class="card_item_01">
              <div class="ci_01_1">送样具体用途</div>
              <div class="dis_f">
                <div class="ci_01_2">{{yang_item.sendSamplePurpose | f_sendSamplePurpose}}</div>
                <div class="ci_01_3">
                  <a-icon type="right" />
                </div>
              </div>
            </div>
            <div class="card_item_01">
              <div class="ci_01_1">发送数量：</div>
              <div class="dis_f">
                <div class="ci_01_4">{{yang_item.sendSampleNumber}}</div>
                <div class="ci_01_3 ci_01_5">
                  <a-icon type="right" />
                </div>
              </div>
            </div>
            <div
              class="card_item_02"
              v-if="yang_item.shipmentSamplePackingVo&&yang_item.shipmentSamplePackingVo.length"
            >发样需求</div>
            <div
              class="card_item_03"
              v-if="yang_item.shipmentSamplePackingVo&&yang_item.shipmentSamplePackingVo.length"
            >
              <table>
                <tr>
                  <td style="background: #e4f1fa;">批次号</td>
                  <td style="background: #e4f1fa;">所在仓库</td>
                  <td style="background: #e4f1fa;">库位</td>
                  <td style="background: #e4f1fa;">样件位置</td>
                </tr>
                <tr v-for="(item,index) in yang_item.shipmentSamplePackingVo" :key="index">
                  <td>{{item.warehouseBatch}}</td>
                  <td>{{item.batchType}}</td>
                  <td>{{item.marketLeader}}</td>
                  <td>{{item.marketLeader}}</td>
                </tr>
              </table>
            </div>
          </div>
        </a-carousel>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShipMsg1',
  data() {
    return {
      mainData_p: {},
      yangList_p: []
    }
  },
  props: ['mainData', 'yangList'],
  methods: {},
  created() {
    console.log(this.yangList)
    this.yangList_p = this.yangList
    this.mainData_p = this.mainData
  },
  filters: {
    f_packagingTransportationMode(item) {
      // 0：单箱1：双箱2：托盘3：空运托盘4：单箱+托盘5：双箱+托盘6：单箱+空运托盘7：双箱+空运托盘8：木托盘9:其他
      if (
        item == 0 ||
        item == 1 ||
        item == 2 ||
        item == 3 ||
        item == 4 ||
        item == 5 ||
        item == 6 ||
        item == 7 ||
        item == 8 ||
        item == 9
      ) {
        return {
          0: '单箱',
          1: '双箱',
          2: '托盘',
          3: '空运托盘',
          4: '单箱+托盘',
          5: '双箱+托盘',
          6: '单箱+空运托盘',
          7: '双箱+空运托盘',
          8: '木托盘',
          9: '其他'
        }[Number(item)]
      } else {
        return item
      }
    },
    f_sendSamplePurpose(item) {
      // 0：全能 1：可靠性 2：材料 3：漆膜 4：外观 5：装车 6：展车 7：全尺寸 8：其他
      if (
        item == 0 ||
        item == 1 ||
        item == 2 ||
        item == 3 ||
        item == 4 ||
        item == 5 ||
        item == 6 ||
        item == 7 ||
        item == 8
      ) {
        return {
          0: '全能',
          1: '可靠性',
          2: '材料',
          3: '漆膜',
          4: '外观',
          5: '装车',
          6: '展车',
          7: '全尺寸',
          8: '其他'
        }[Number(item)]
      } else {
        return item
      }
    },
    f_urgentTaskStatus(item) {
      if (item == 0 || item == 1) {
        return {
          0: '普通',
          1: '紧急'
        }[Number(item)]
      } else {
        return item
      }
    }
  },
  watch: {
    mainData: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        this.mainData_p = val
      },
      deep: true //true 深度监听
    },
    yangList: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        this.yangList_p = val
        console.log(this.yangList_p)
      },
      deep: true //true 深度监听
    }
  }
}
</script>

<style scoped>
.ShipMsg {
  width: 100%;
  height: auto;
}
.banner1 {
  padding: 8px 15px;
  display: flex;
  justify-content: flex-start;
  align-content: center;
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

.banner1_2 {
  width: 33.4%;
}
table {
  border-collapse: collapse;
  width: 100%;
}
.table_1 {
  table-layout: fixed;
}

th,
td {
  border: 1px solid #e8e8e8;
  word-break: break-all;
  word-wrap: break-word;
}
th {
  border-top: 0;
}
th,
td {
  padding: 8px 0;
  text-align: center;
}
/* .table_1 td {
  width: 120px;
}
.table_2 td,
.table_2 th {
  width: 240px;
} */
.td_img {
  width: 120px;
  height: auto;
}
.table_1,
.table_2 {
  border: 1px solid #e8e8e8;
}
.m_b_15 {
  margin-bottom: 20px;
}
.w_50 {
  width: 25%;
}
.fayang_card {
  padding: 10px 15px;
}
.bg_01 {
  background: #f5f8fa;
}
.card_item {
  border-radius: 6px;
  padding: 15px;
}
.card_item_01 {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}
.dis_f {
  display: flex;
  justify-content: end;
  align-items: center;
}
.ci_01_1 {
  width: 50%;
}
.ci_01_2 {
  color: #000;
  font-weight: 600;
}
.ci_01_3 {
  font-size: 15px;
  margin-left: 10px;
}
.ci_01_5 {
  opacity: 0;
}
.card_item_02 {
  border-top: 1px solid #e8e8e8;
  padding: 10px 0;
  font-size: 16px;
  font-weight: 600;
  color: #000;
}
</style>