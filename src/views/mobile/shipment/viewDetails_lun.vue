<template>
  <div class="viewBothMsg_all_lun">
    <div class="val_ban2_1">
      <shipMsgQian ref="child" :matterData="pageItem" :isShow="false"></shipMsgQian>
    </div>
    <div class="banner3 foot my_page_btn">
      <!-- success_btn -->
      <a-button v-if="success_btn" class="page_btn page_btn_success" type="primary">
        <a-icon type="check-circle" />提交成功
      </a-button>

      <a-button
        v-else
        class="page_btn"
        type="primary"
        @click="submit()"
        :loading="submit_loading"
      >提交</a-button>
    </div>
  </div>
</template>

<script>
import shipMsgQian from './component/ship_msg_qian'
import { addShipmentRunnerSignfor } from '@/api/api'
export default {
  name: 'viewDetailsLun',
  data() {
    return {
      pageItem: {},
      id: null,
      submit_loading: false,
      // 成功的
      success_btn: false
      // success_btn: true
    }
  },
  components: {
    shipMsgQian
  },
  created() {
    // // 页面需要接受id和状态
    this.id = this.$route.query.id
    // // 获取浏览器高度
    // this.page_height = window.screen.height - 59 - 48
    // console.log(window.screen.height)
  },
  methods: {
    submit() {
      this.submit_loading = true
      let sendData = this.$refs.child.getData()
      console.log(sendData)
      addShipmentRunnerSignfor({
        shipmentManagementId: this.id,
        signforName: sendData.signforName,
        signforNumber: sendData.signforNumber,
        signforPhone: sendData.signforPhone,
        signforWechatNumber: sendData.signforWechatNumber
      }).then(data => {
        if (data.success) {
          this.$message.success('提交' + data.message)
          this.submit_loading = false
          this.success_btn = true
        } else {
          this.$message.error(data.message)
          this.submit_loading = false
        }
      })
    }
  }
}
</script>

<style scoped>
.viewBothMsg_all_lun {
  padding: 15px;
  padding-top: 1px;
  height: auto;
  background: #e9f1f6;
}
.val_ban1,
.val_ban2 {
  margin: 15px;
}
.val_ban1_item {
  padding: 0 15px;
  background: #fff;
  border-radius: 6px;
}
.val_ban2_1,
.val_ban2_2 {
  margin-top: 15px;
  background: #fff;
  border-radius: 6px;
  width: 100%;
}
.val_ban2_2 {
  padding-top: 15px;
}
.val_ban2_2_cord {
  width: 50%;
  min-height: 150px;
  height: auto;
  margin: 0 auto;
  background: pink;
}
.val_ban2_2_content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
  margin-top: 15px;
}
.val_ban2_2_content_1 {
  width: 20px;
  margin-right: 10px;
}

.banner3 {
  margin-top: 15px;
  background: #fff;
  text-align: center;
  position: fixed;
  bottom: 55px;
  left: 0;
  width: 100%;
  padding: 30px 0;
  padding-top: 10px;
}
.page_btn {
  width: 86%;
  background: #2a7bf1;
}
.my_page_btn /deep/ .ant-btn {
  height: auto;
  padding: 10px 0;
  font-size: 16px;
}
.page_btn_success{
  background: #87d068;
  border-color: #87d068;
}
</style>