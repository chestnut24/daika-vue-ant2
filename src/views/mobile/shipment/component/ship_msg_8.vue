<template>
  <div>
    <table class="table_2 m_b_15">
      <tr style="background: #F5F8FA;">
        <th colspan="4">签批结果</th>
      </tr>
      <tr style="background: #F5F8FA;">
        <th></th>
        <th>审批结果</th>
        <th colspan="2">审批说明</th>
      </tr>
      <tr>
        <th style="background: #F5F8FA;">项目经理签批</th>
        <td>
          <div>{{matterData.packagingConfirmationResult| f_qualityDirectorResult}}</div>
          <!-- <div class="font_small font_grey">朱部长</div> -->
          <!-- <div class="font_small font_grey">2021.6.12</div> -->
        </td>
        <td colspan="2" class="font_grey table_textarea">{{matterData.packagingConfirmationExplain}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ShipMsg8',
  data() {
    return {
      pageData: {},
    }
  },
  filters: {
    f_qualityDirectorResult(item) {
      // 质保部长审批结果 0：同意 1：驳回
      if (
        item == 0 ||
        item == 1 
      ) {
        return {
          0: '同意',
          1: '驳回',
        }[Number(item)]
      } else {
        return item
      }
    },
  },
  props: ['matterData'],
  created() {
  },
  watch: {
    matterData: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        // this.pageData = val
        this.pageData = JSON.parse(JSON.stringify(val))
        console.log(this.pageData)
      },
      deep: true //true 深度监听
    }
  },

  methods: {

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
  text-align: left;
}

.font_small{
  font-size: 13px;
}
.font_grey{
  color: rgba(0,0,0,.4);
}
</style>