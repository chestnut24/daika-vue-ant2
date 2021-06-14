<template>
  <div>
    <div class="part-title">
      <div class="part-title_blue"></div>
      <div>物流信息维护</div>
    </div>
    <table class="table_2 m_b_15">
      <!-- <tr style="background: #F5F8FA;">
        <th colspan="4">物流信息维护</th>
      </tr>-->
      <tr>
        <th style="background: #F5F8FA;">物流单号</th>
        <td colspan="3" v-if="isShow">
          <div style="max-width: 480px;">{{pageData.logisticsOrderNo}}</div>
        </td>
        <td colspan="3" v-else class="table_textarea">
          <a-textarea
            v-model="pageData.logisticsOrderNo"
            placeholder="请输入物流单号"
            :auto-size="{ minRows: 1, maxRows: 3 }"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ShipMsg7',
  data() {
    return {
      pageData: {}
    }
  },
  props: ['isShow', 'matterData'],
  components: {},
  created() {
    this.pageData = JSON.parse(JSON.stringify(this.matterData))
  },
  watch: {
    matterData: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        // this.pageData = val
        this.pageData = JSON.parse(JSON.stringify(val))
      },
      deep: true //true 深度监听
    }
  },

  methods: {
    submit() {
      let canSubmit = true
      if (!this.pageData.logisticsOrderNo) {
        canSubmit = false
      }
      return { isCan: canSubmit, data: this.pageData }
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
  width: 180px;
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
.table_textarea {
  min-height: 73px;
  text-align: left;
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