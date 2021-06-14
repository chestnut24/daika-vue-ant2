<template>
  <div>
    <table class="table_2 m_b_15">
      <tr style="background: #F5F8FA;">
        <th colspan="4">签批结果</th>
      </tr>
      <!-- 项目经理反馈 -->
      <tr style="background: #F5F8FA;">
        <th colspan="4">项目经理反馈</th>
      </tr>
      <tr>
        <th style="background: #F5F8FA;">审批结果</th>
        <td colspan="2">
          <div>{{matterData.projectManagerResult | f_projectManagerResult}}</div>
          <div class="font_small font_grey">{{matterData.projectManagerName}}</div>
          <div class="font_small font_grey">{{matterData.projectManagerResultTime}}</div>
        </td>
      </tr>
      <tr>
        <th style="background: #F5F8FA;">审批说明</th>
        <td colspan="2" class="font_grey table_textarea">{{matterData.projectManagerExplain}}</td>
      </tr>
      <!-- 项目部长签批 -->
      <tr style="background: #F5F8FA;" v-if="matterData.projectManagerResult != 2">
        <th colspan="4">项目部长签批</th>
      </tr>
      <tr v-if="matterData.projectManagerResult != 2">
        <th style="background: #F5F8FA;">审批结果</th>
        <td colspan="2">
          <div>{{matterData.projectDirectorResult| f_qualityDirectorResult}}</div>
          <div class="font_small font_grey">{{matterData.projectDirectorName}}</div>
          <div class="font_small font_grey">{{matterData.projectDirectorName}}</div>
        </td>
      </tr>
      <tr v-if="matterData.projectManagerResult != 2">
        <th style="background: #F5F8FA;">审批说明</th>
        <td colspan="2" class="font_grey table_textarea">{{matterData.projectDirectorExplain}}</td>
      </tr>
      <!-- 质保部长签批 -->
      <tr style="background: #F5F8FA;" v-if="matterData.projectManagerResult != 2">
        <th colspan="4">质保部长签批</th>
      </tr>
      <tr v-if="matterData.projectManagerResult != 2">
        <th style="background: #F5F8FA;">审批结果</th>
        <td colspan="2">
          <div>{{matterData.qualityDirectorResult| f_qualityDirectorResult}}</div>
          <div class="font_small font_grey">{{matterData.qualityDirectorName}}</div>
          <div class="font_small font_grey">{{matterData.qualityDirectorTime}}</div>
        </td>
      </tr>
      <tr v-if="matterData.projectManagerResult != 2">
        <th style="background: #F5F8FA;">审批说明</th>
        <td colspan="2" class="font_grey table_textarea">{{matterData.qualityDirectorExplain}}</td>
      </tr>


      <!-- <tr style="background: #F5F8FA;">
        <th></th>
        <th>审批结果</th>
        <th colspan="2">审批说明</th>
      </tr>
      <tr>
        <th style="background: #F5F8FA;">项目经理反馈</th>
        <td>
          <div>{{matterData.projectManagerResult | f_projectManagerResult}}</div>
          <div class="font_small font_grey">{{matterData.projectManagerName}}</div>
          <div class="font_small font_grey">{{matterData.projectManagerResultTime}}</div>
        </td>
        <td colspan="2" class="font_grey table_textarea">{{matterData.projectManagerExplain}}</td>
      </tr>
      <tr v-if="matterData.projectManagerResult != 2">
        <th style="background: #F5F8FA;">项目部长签批</th>
        <td>
          <div>{{matterData.projectDirectorResult| f_qualityDirectorResult}}</div>
          <div class="font_small font_grey">{{matterData.projectDirectorName}}</div>
          <div class="font_small font_grey">{{matterData.projectDirectorName}}</div>
        </td>
        <td colspan="2" class="font_grey table_textarea">{{matterData.projectDirectorExplain}}</td>
      </tr>
      <tr v-if="matterData.projectManagerResult != 2">
        <th style="background: #F5F8FA;">质保部长签批</th>
        <td>
          <div>{{matterData.qualityDirectorResult| f_qualityDirectorResult}}</div>
          <div class="font_small font_grey">{{matterData.qualityDirectorName}}</div>
          <div class="font_small font_grey">{{matterData.qualityDirectorTime}}</div>
        </td>
        <td colspan="2" class="font_grey table_textarea">{{matterData.qualityDirectorExplain}}</td>
      </tr> -->
    </table>
  </div>
</template>

<script>
export default {
  name: 'ShipMsg5',
  data() {
    return {
      pageData: {}
    }
  },
  filters: {
    f_projectManagerResult(item) {
      // 项目经理审批结果 0：保数量继续发货(流程转到项目部长和质保部长) 1：保质量继续发货（不发不合格品）2：取消发运再次安排试制
      if (item == 0 || item == 1 || item == 2) {
        return {
          0: '保数量继续发货',
          1: '保质量继续发货',
          2: '取消发运再次安排试制'
        }[Number(item)]
      } else {
        return item
      }
    },
    f_qualityDirectorResult(item) {
      // 质保部长审批结果 0：同意 1：驳回
      if (item == 0 || item == 1) {
        return {
          0: '同意',
          1: '驳回'
        }[Number(item)]
      } else {
        return item
      }
    }
  },
  props: ['matterData'],
  created() {},
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

  methods: {}
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

.font_small {
  font-size: 13px;
}
.font_grey {
  color: rgba(0, 0, 0, 0.4);
}
</style>