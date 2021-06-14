<template>
  <div class="ship_msg_qian">
    <div class="ship_msg_qian_body onlyshow" v-if="isShow">
      <div class="ship_msg_qian_li">
        <div class="li_title">签收微信号：</div>
        <div class="li_content">{{matterData.signforWechatNumber}}</div>
      </div>
      <div class="ship_msg_qian_li">
        <div class="li_title">签收姓名：</div>
        <div class="li_content">{{matterData.signforName}}</div>
      </div>
      <!-- <div class="ship_msg_qian_li">
        <div class="li_title">签收日期：</div>
        <div class="li_content">2021.05.11 12:35</div>
      </div>-->
      <div class="ship_msg_qian_li">
        <div class="li_title">签收手机号：</div>
        <div class="li_content">{{matterData.signforPhone}}</div>
      </div>
      <div class="ship_msg_qian_li ship_msg_qian_li0">
        <div class="li_title">签收数量：</div>
        <div class="li_content">{{matterData.signforNumber}}</div>
      </div>
    </div>
    <div class="ship_msg_qian_body addmsg" v-if="!isShow">
      <div class="ship_msg_add_li">
        <div class="li_add_title">签收微信号：</div>
        <div class="li_add_content">
          <a-input size="small" v-model="sendData.signforWechatNumber" placeholder="请输入微信号" />
        </div>
      </div>
      <div class="ship_msg_add_li">
        <div class="li_add_title">签收姓名：</div>
        <div class="li_add_content">
          <a-input size="small" v-model="sendData.signforName" placeholder="请输入姓名" />
        </div>
      </div>
      <!-- <div class="ship_msg_add_li">
        <div class="li_add_title">签收日期：</div>
        <div class="li_add_content">
          <a-date-picker size="small" v-model="sendData.data3" placeholder="请选择日期" @change="onTimeChange" />
        </div>
      </div>-->
      <div class="ship_msg_add_li">
        <div class="li_add_title">签收手机号：</div>
        <div class="li_add_content">
          <a-input size="small" v-model="sendData.signforPhone" placeholder="请输入手机号" />
        </div>
      </div>
      <div class="ship_msg_add_li ship_msg_qian_li0">
        <div class="li_add_title">签收数量：</div>
        <div class="li_add_content">
          <a-input-number
            size="small"
            :min="0"
            v-model="sendData.signforNumber"
            placeholder="请输入数量"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getShipmentRunnerSignfor } from '@/api/api'
export default {
  name: 'ShipMsg9',
  data() {
    return {
      pageData: {},
      value: null,
      sendData: {},
      matterData: {}
    }
  },
  props: ['isShow', 'id'],
  created() {
    console.log(this.isShow)
    if (this.isShow) {
      this.getMsg()
    }
  },
  watch: {
    // matterData: {
    //   //深度监听，可监听到对象、数组的变化
    //   handler(val, oldVal) {
    //     // this.pageData = val
    //     this.pageData = JSON.parse(JSON.stringify(val))
    //   },
    //   deep: true //true 深度监听
    // }
    isShow(val, old) {
      console.log('11')
      if (this.isShow) {
        this.getMsg()
      }
    }
  },
  methods: {
    onTimeChange() {},
    getData() {
      return this.sendData
    },
    // 查询列表
    getMsg() {
      getShipmentRunnerSignfor({
        shipmentManagementId: this.id
      }).then(data => {
        this.matterData = data
      })
    }
  }
}
</script>

<style scoped>
.ship_msg_qian {
  width: 100%;
}
.ship_msg_qian_li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 10px;
  border-bottom: 1px solid #e8e8e8;
  color: rgba(0, 0, 0, 0.5);
}
.ship_msg_qian_li0 {
  border-bottom: 0;
}
.li_content {
  color: #000;
}

/* 填写部分 */

.ship_msg_add_li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e8e8e8;
  color: rgba(0, 0, 0, 0.5);
}
.li_add_content /deep/ .ant-input {
  border: 1px solid transparent;
  width: 166px;
}
.li_add_content /deep/ .ant-input-number {
  border: 1px solid transparent;
  width: 166px;
}
</style>