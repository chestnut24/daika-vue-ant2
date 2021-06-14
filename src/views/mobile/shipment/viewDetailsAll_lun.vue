<template>
  <div class="viewBothMsg_all_lun">
    <div class="val_ban1">
      <div class="val_ban1_item">
        <listItem :matterData="pageItem"></listItem>
      </div>
    </div>
    <div class="val_ban2">
      <div class="val_ban2_1" v-if="Number(this.pageItem.taskStatus) >= 12">
        <shipMsgQian
          :isShow="Number(this.pageItem.taskStatus) >= 12"
          :id="pageItem.shipmentManagementId"
        ></shipMsgQian>
      </div>
      <div class="val_ban2_2" v-if="pageItem.taskStatus == 11">
        <div class="val_ban2_2_cord">
          <vue-qr
            :text="downloadData.url"
            :margin="10"
            colorDark="#000"
            colorLight="#fff"
            :dotScale="1"
            :logoScale="0.2"
            :size="180"
          ></vue-qr>
        </div>
        <div class="val_ban2_2_content">
          <div class="val_ban2_2_content_1">
            <img
              style="width: 100%;display: block;"
              src="../../../assets/mobile/shipment_app/qcord.png"
            />
          </div>
          <div>请扫码签收</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import listItem from './component/list_lun_item_2'
import shipMsgQian from './component/ship_msg_qian'
// wuliuDialog
import { getShipmentRunnerSignfor } from '@/api/api'

import vueQr from 'vue-qr'
export default {
  name: 'viewDetails',
  data() {
    return {
      chooseTime: null,
      matterData: {},
      wuliuData: {},
      banner5StatusFalse: true,
      banner6StatusFalse: true,
      processOrder: [[], [], [], [], []],
      isCanSubmit_ling: true,

      processOrder_number: 2,
      processOrder_list: [],
      // 页面存值
      pageItem: {},
      page_path_1: true,
      page_path_2: false,
      tabs_key: '1',
      tabBarStyle: {
        height: 0,
        overflow: 'hidden',
        borderBottom: 0,
        margin: 0
      },
      isShow: false,
      downloadData: {
        url: 'https://www.baidu.com/' //需要转化成二维码的网址
        // icon: require('./xxx.jpg') //二维码中间的图片,可以不设置
      }
    }
  },
  components: {
    listItem,
    shipMsgQian,
    vueQr
  },
  created() {
    // 页面需要接受id和状态
    this.pageItem = this.$route.query
    console.log(this.pageItem)
    // 1.判断状态是不是签收了-3，2.判断有没有签收后的条件 -5和之后就查询接口展示数据
    // this.getMsg();
    if (this.pageItem.taskStatus == 11) {
      // 展示二维码了
      this.isShow = false
      let test = window.location.href
      let Arr_test = test.split('/app/shipment/viewDetailsAll_lun')
      let bendi = Arr_test[0]
      this.downloadData.url = bendi + '/app/shipment/viewDetails_lun?id=' + this.pageItem.shipmentManagementId
    } else if (Number(this.pageItem.taskStatus) >= 12) {
      //
      this.isShow = true
      // 查询数据
      // this.getMsg();
    }
  },
  methods: {
    // 查询列表
    getMsg() {
      getShipmentRunnerSignfor({
        shipmentManagementId: this.pageItem.shipmentManagementId
      }).then(data => {
        console.log(data)
        this.matterData = data
        // if (data.shipmentManagementId) {
        //   this.matterData = data;
        //   console.log(this.matterData)
        // } else if (data.success) {
        //   this.$message.success(data.message)
        // } else {
        //   this.$message.error(data.message)
        // }
      })
    },
    ceshi() {
      this.$router.push({
        path: `/app/shipment/viewDetails_lun`,
        query: {
          id: this.pageItem.shipmentManagementId
        }
      })
    }
  }
}
</script>

<style scoped>
.viewBothMsg_all_lun {
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
</style>