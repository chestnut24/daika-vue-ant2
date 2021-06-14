<template>
  <div>
    <div class="ship_msg_body_7">
      <div class="banner1 ban_title">
        <div class="banner1_1"></div>
        <div class="banner1_2">物流信息维护</div>
      </div>
      <div class="banner2 ban_content">
        <div class="b2_title">物流单号：</div>
        <div class="b2_input_msg" v-if="isShow">{{pageData.logisticsOrderNo}}</div>
        <div class="b2_input" v-else>
          <a-input
          class="b2_input_wuliu"
            v-model="pageData.logisticsOrderNo"
            placeholder="请输入物流单号"
          />
        </div>
      </div>
    </div>
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
  created() {},
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
.ship_msg_body_7 {
  width: 100%;
}
.banner1 {
  padding: 8px 15px;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  border-bottom: 1px solid #f0f2f5;
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
.banner2{
  padding: 15px 12px;
  color: #000;
}
.b2_title{
  margin-bottom: 8px;
}
.b2_input_msg{
  padding: 12px 15px;
  border-radius: 5px;
  color: rgba(0,0,0,0.6);
  background: #f5f8fa;
}
.b2_input /deep/ .ant-input{
  background-color: #f5f8fa;
  border: 1px solid transparent;
  padding: 8px 13px;
  height: auto;
  color: rgba(0,0,0,0.7);
}
</style>