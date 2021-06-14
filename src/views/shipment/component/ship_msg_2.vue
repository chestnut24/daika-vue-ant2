<template>
  <div>
    <div class="part-title">
      <div class="part-title_blue"></div>
      <div>过程状态</div>
    </div>
    <table class="table_2 m_b_15">
      <tr>
        <th>过程性能</th>
        <td>
          <PassBtnShow :showData="getTorF(pageData.processPerformance)"></PassBtnShow>
        </td>
      </tr>
      <tr>
        <th>X光过程状态</th>
        <td>
          <PassBtnShow :showData="getTorF(pageData.xprocessState)"></PassBtnShow>
        </td>
      </tr>
      <tr>
        <th>喷涂过程是否异常</th>
        <td>
          <PassBtnShow :showData="getTorF(pageData.sprayProcess)"></PassBtnShow>
        </td>
      </tr>
    </table>
    <div class="part-title">
      <div class="part-title_blue"></div>
      <div>成品检验</div>
    </div>
    <table class="table_2 m_b_15">
      <tr>
        <th>其它关注尺寸</th>
        <td>
          <div style="max-width: 480px;">{{pageData.otherFocusSizes}}</div>
        </td>
      </tr>
      <tr>
        <th>漆膜性能验证</th>
        <td>
          <div style="max-width: 480px;">{{pageData.filmPerformanceTest}}</div>
        </td>
      </tr>
      <tr>
        <th>漆膜厚度和边缘漏电</th>
        <td>
          <div style="max-width: 480px;">{{pageData.filmThicknessEdgeLeakage}}</div>
        </td>
      </tr>
      <tr>
        <th>漆膜颜色符合度</th>
        <td>
          <div style="max-width: 480px;">{{pageData.filmColourConformity}}</div>
        </td>
      </tr>
      <tr>
        <th style="border-bottom: 0;">表面外观缺陷</th>
        <td style="border-bottom: 0;">{{pageData.surfaceAppearanceDefect}}</td>
      </tr>
    </table>
    <table class="table_4">
      <tr>
        <th rowspan="2" style="width: 240px; background: #F5F8FA;border-top: 0;border-bottom: 0;">其他</th>
        <td style="width: 240px;background: #F5F8FA;border-top: 0;">平衡标示是否特殊</td>
        <td style="width: 240px;border-top: 0;">{{{'0':'是','1':'否'}[pageData.balanceSign]}}</td>
        <!-- <td style="width: 120px;background: #F5F8FA;border-top: 0;">外观检查员签字</td> -->
        <!-- <td style="width: 120px;background: #F5F8FA;border-top: 0;">日期</td> -->
      </tr>
      <tr>
        <td style="width: 240px;background: #F5F8FA;border-bottom: 0;">谐波标识</td>
        <td style="width: 240px;border-bottom: 0;">{{{'0':'是','1':'否'}[pageData.harmonicSign]}}</td>
        <!-- <td style="width: 120px;border-bottom: 0;">{{pageData.appearanceProcurator}}</td> -->
        <!-- <td style="width: 120px;border-bottom: 0;">{{pageData.date}}</td> -->
      </tr>
    </table>
    <table class="table_2">
      <tr>
        <th style="border-top: 0;">是否保留同批次外观样轮</th>
        <td style="border-top: 0;">
          <!-- {{{'0':'是','1':'否'}[pageData.sameBatchAppearanceOutline]}} -->
          <span v-if="pageData.sameBatchAppearanceOutline == '1'">否</span>
          <span
            style="margin-left: 15px;"
            v-if="pageData.sameBatchAppearanceOutlineNu"
          >{{pageData.sameBatchAppearanceOutlineNu}}</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import PassBtnShow from './pass_btn_show'
export default {
  name: 'ShipMsg2',
  data() {
    return {
      pageData: {}
    }
  },
  props: ['productInspection'],
  components: { PassBtnShow },
  watch: {
    productInspection: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        this.pageData = val
      },
      deep: true //true 深度监听
    }
  },
  methods: {
    getTorF(data) {
      if (data == '0') {
        return true
      } else if (data == '1') {
        return false
      } else {
        return null
      }
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
.table_2 td {
  width: 480px;
}
.table_2 th {
  width: 240px;
  background: #f5f8fa;
}

.table_2 {
  border: 1px solid #e8e8e8;
}

.m_b_15 {
  margin-top: 20px;
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