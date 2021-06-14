<template>
  <div class="ShipMsg">
    <div class="banenr1">
      <div class="part-title">
        <div class="part-title_blue"></div>
        <div>基本信息</div>
      </div>
      <table class="table_1 m_b_15">
        <tr>
          <td style="background: #F5F8FA;">戴卡部件号</td>
          <td>{{mainData_p.wheelShape}}</td>
          <td style="background: #F5F8FA;">戴卡订单号</td>
          <td>{{mainData_p.ordersId}}</td>
          <td style="width: 140px;" rowspan="4">
            <img class="td_img" :src="srccc||'../../../assets/lun.png'" />
          </td>
        </tr>
        <tr>
          <td style="background: #F5F8FA;">客户名称</td>
          <td>
            <div style="max-width: 120px;">{{mainData_p.customerName}}</div>
          </td>
          <td style="background: #F5F8FA;">轮型尺寸</td>
          <td>{{mainData_p.wheelShapeSize}}</td>
        </tr>
        <tr>
          <td style="background: #F5F8FA;">项目负责人</td>
          <td>{{mainData_p.projectLeader}}</td>
          <td style="background: #F5F8FA;">市场负责人</td>
          <td>{{mainData_p.marketLeader}}</td>
        </tr>
        <tr>
          <td style="background: #F5F8FA;">发运目的地</td>
          <td>
            <div style="max-width: 120px;">{{mainData_p.shipmentDestination}}</div>
          </td>
          <td style="background: #F5F8FA;">计划发运时间</td>
          <td>{{mainData_p.planShipmentDate}}</td>
        </tr>
      </table>
      <table class="table_2">
        <tr style="background: #F5F8FA;">
          <th>发样数量</th>
          <th>包装运输方式</th>
          <th>送样具体用途</th>
        </tr>
        <tr v-for="(item, index) in yangList_p" :key="item.packagingTransportationMode+index">
          <td>{{item.sendSampleNumber}}</td>
          <td>{{item.packagingTransportationMode | f_packagingTransportationMode}}</td>
          <td>{{item.sendSamplePurpose | f_sendSamplePurpose}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { GetImgByProjectNumMixin } from '@/mixins/GetImgByProjectNumMixin'
export default {
  name: 'ShipMsg1',
  mixins: [GetImgByProjectNumMixin],
  data() {
    return {
      pageData: {},
      mainData_p: {},
      yangList_p: [],
      srccc: null // data 中 定义 图片img的src名
    }
  },
  props: ['mainData', 'yangList'],
  methods: {
    // 查询列表
    getList() {
      // this.total = data.total;
      // this.pageNum = data.pageNum;
    }
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
    }
  },
  created() {
    this.mainData_p = this.mainData
    if (this.mainData_p.wheelShape) {
      this.getImg(this.mainData_p.wheelShape)
    }
    this.yangList_p = this.yangList
  },
  watch: {
    mainData: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        this.mainData_p = val
        if (this.mainData_p.wheelShape) {
          this.getImg(this.mainData_p.wheelShape)
        }
      },
      deep: true //true 深度监听
    },
    yangList: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        this.yangList_p = val
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
.banner1_1 {
  width: 66.6%;
}
.banner1_2 {
  width: 33.4%;
}
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
  margin-bottom: 20px;
}
.part-title {
  width: 100%;
  background: #f4f5f7;
  margin: 15px 0;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 2px;
}
.part-title_blue {
  width: 3px;
  height: 19px;
  background: #347ef2;
  border-radius: 1.5px;
  margin-right: 10px;
}
</style>