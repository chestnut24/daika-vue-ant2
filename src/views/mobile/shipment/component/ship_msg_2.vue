<template>
  <div>
    <div class="showkey_2" v-if="showKey === 2">
      <div class="showkey_2_list showkey_2_list_bb">
        <div class="list_title">过程性能：</div>
        <div class="list_content">
          <PassBtnShow :showData="getTorF(pageData.processPerformance)" both_margin="40"></PassBtnShow>
        </div>
      </div>
      <div class="showkey_2_list showkey_2_list_bb">
        <div class="list_title">X光过程状态：</div>
        <div class="list_content">
          <PassBtnShow :showData="getTorF(pageData.xprocessState)" both_margin="40"></PassBtnShow>
        </div>
      </div>
      <div class="showkey_2_list showkey_2_list_bb">
        <div class="list_title">喷涂过程是否异常：</div>
        <div class="list_content">
          <PassBtnShow :showData="getTorF(pageData.sprayProcess)" both_margin="40"></PassBtnShow>
        </div>
      </div>
    </div>
    <div class="showkey_3" v-if="showKey === 3">
      <div class="showkey_3_list showkey_2_list_bb">
        <div class="list_title">其它关注尺寸:</div>
        <div class="list_content_2">{{pageData.otherFocusSizes}}</div>
      </div>
      <div class="showkey_3_list showkey_2_list_bb">
        <div class="list_title">漆膜性能验证:</div>
        <div class="list_content_2">{{pageData.filmPerformanceTest}}</div>
      </div>
      <div class="showkey_3_list showkey_2_list_bb">
        <div class="list_title">漆膜厚度和边缘漏电:</div>
        <div class="list_content_2">{{pageData.filmThicknessEdgeLeakage}}</div>
      </div>
      <div class="showkey_3_list showkey_2_list_bb">
        <div class="list_title">漆膜颜色符合度:</div>
        <div class="list_content_2">{{pageData.filmColourConformity}}</div>
      </div>
      <div class="showkey_3_list showkey_2_list_bb">
        <div class="list_title">表面外观缺陷:</div>
        <div class="list_content_2">{{pageData.surfaceAppearanceDefect}}</div>
      </div>
      <div class="showkey_3_jiange showkey_2_list_bb"></div>
      <div class="showkey_3_list showkey_2_list_bb">
        <div class="list_title">平衡标示是否特殊:</div>
        <div class="list_content">
          <div class="list_content_icon_b">
            <a-icon type="check" class="list_content_icon" v-if="getTorF(pageData.balanceSign)" />
          </div>
        </div>
      </div>
      <div class="showkey_3_list showkey_2_list_bb">
        <div class="list_title">谐波标识:</div>
        <div class="list_content">
          <div class="list_content_icon_b">
            <a-icon type="check" class="list_content_icon" v-if="getTorF(pageData.harmonicSign)" />
          </div>
        </div>
      </div>
      <div class="showkey_3_list showkey_2_list_bb">
        <div class="list_title">是否保留同批次外观样轮:</div>
        <div class="list_content">
          <div class="list_content_icon_b">
            <a-icon
              type="check"
              class="list_content_icon"
              v-if="getTorF(pageData.sameBatchAppearanceOutline)"
            />
          </div>
          <div
            class="list_content_icon_c"
            v-if="getTorF(pageData.sameBatchAppearanceOutline)"
          >{{pageData.sameBatchAppearanceOutlineNu}}</div>
        </div>
      </div>
    </div>
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
  props: ['productInspection', 'showKey'],
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
  created(){
    this.pageData = this.productInspection
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
.showkey_2_list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  padding-right: 20px;
}
.showkey_2_list_bb {
  border-bottom: 1px solid #e8e8e8;
}
.showkey_3_list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  padding-right: 20px;
}
.list_content_2 {
  color: #000;
}
.showkey_3_jiange {
  background: #f5f8fa;
  width: 100%;
  height: 10px;
}
.list_content_icon_b {
  border: 1px solid #317ff2;
  background: #e9f0fd;
  height: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center;
}
.list_content_icon {
  color: #317ff2;
}
.list_content{
  display: flex;
  align-items: center;
}
.list_content_icon_c{
  background: #f5f8fa;
  border: 1px solid #e8e8e8;
  padding: 10px 0;
  margin: -10px 0 -10px 5px;
  min-width: 50px;
  text-align: center;
}
</style>