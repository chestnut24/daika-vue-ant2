<template>
  <div>
    <!-- 新样式 -->
    <div v-if="pageTypeNumber == 18">
      <div class="banner1_body">
        <div class="ban1_show">
          <img class="ban1_show_img" src="../../assets/shipment/qianpi_show_img.png" />
          <div class="ban1_show_content">
            发运流转单：
            <a @click="goMsgLok(pageId)">{{pageShipNumber || ''}}</a> 在复查任务环节 出现了 异议签批，请批示
          </div>
        </div>
      </div>
      <div class="banner2_body">
        <div class="part-title">
          <div class="part-title_blue"></div>
          <div>处理指令：</div>
        </div>
        <div class="ban2_content">
          <div
            class="ban2_c_item"
            :class="pageData.value == 0?'ban2_c_item_choose':''"
            @click="pageData.value = 0"
          >
            <img src="../../assets/shipment/icon1_hui.png" v-if="pageData.value != 0" />
            <img src="../../assets/shipment/icon1_lan.png" v-if="pageData.value == 0" />
            <div class="ban2_c_item_title">保数量继续发货</div>
          </div>
          <div
            class="ban2_c_item"
            :class="pageData.value == 1?'ban2_c_item_choose':''"
            @click="pageData.value = 1"
          >
            <img src="../../assets/shipment/icon2_hui.png" v-if="pageData.value != 1" />
            <img src="../../assets/shipment/icon2_lan.png" v-if="pageData.value == 1" />
            <div class="ban2_c_item_title">保质量继续发货</div>
          </div>
          <div
            class="ban2_c_item"
            :class="pageData.value == 2?'ban2_c_item_choose':''"
            @click="pageData.value = 2"
          >
            <img src="../../assets/shipment/icon3_hui.png" v-if="pageData.value != 2" />
            <img src="../../assets/shipment/icon3_lan.png" v-if="pageData.value == 2" />
            <div class="ban2_c_item_title">取消发运再次安排试制</div>
          </div>
        </div>
      </div>
      <div class="banner3_body">
        <div class="part-title">
          <div class="part-title_blue"></div>
          <div>签批说明：</div>
        </div>
        <div class="ban3_content">
          <a-textarea
            v-model="pageData.remark"
            placeholder="可输入签批说明"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </div>
      </div>
    </div>
    <!-- 旧版 -->
    <table class="table_2" v-if="pageTypeNumber == 111">
      <tr style="background: #F5F8FA;">
        <th colspan="4" style="text-align: left;padding-left: 50px;">
          发运流转单：
          <a @click="goMsgLok(pageId)">{{pageShipNumber || ''}}</a> 在复查任务环节 出现了 异议签批，请批示
        </th>
      </tr>
      <tr>
        <th style="background: #F5F8FA;">签批</th>
        <td colspan="3">
          <a-radio-group name="radioGroup" v-model="pageData.value">
            <a-radio :value="0" style="margin-right: 30px;">保数量继续发货</a-radio>
            <a-radio :value="1" style="margin-right: 30px;">保质量继续发货</a-radio>
            <a-radio :value="2">取消发运再次安排试制</a-radio>
          </a-radio-group>
        </td>
      </tr>
      <tr>
        <th style="background: #F5F8FA;">签批说明</th>
        <td colspan="3" class="table_textarea">
          <a-textarea
            v-model="pageData.remark"
            placeholder="可输入签批说明"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </td>
      </tr>
    </table>
    <!-- new -->
    <div v-if="pageTypeNumber == 12 || pageTypeNumber == 11">
      <div class="banner1_body">
        <div class="ban1_show">
          <img class="ban1_show_img" src="../../assets/shipment/qianpi_show_img.png" />
          <div class="ban1_show_content">
            发运流转单：
            <a @click="goMsgLok(pageId)">{{pageShipNumber || ''}}</a> 在复查任务环节 出现了 异议签批，请批示
          </div>
        </div>
      </div>
      <div class="banner2_body">
        <div class="part-title">
          <div class="part-title_blue"></div>
          <div>处理指令：</div>
        </div>
        <div class="ban2_content">
          <div
            class="ban2_c_item ban2_c_item_icon"
            :class="pageData.value == 0?'ban2_c_item_choose':''"
            @click="pageData.value = 0"
          >
            <a-icon
              class="ban2_c_item_icon_hui"
              theme="filled"
              type="check-circle"
              v-if="pageData.value != 0"
            />
            <a-icon
              class="ban2_c_item_icon_lan"
              theme="filled"
              type="check-circle"
              v-if="pageData.value == 0"
            />
            <div class="ban2_c_item_title">同意</div>
          </div>
          <div
            class="ban2_c_item ban2_c_item_icon"
            :class="pageData.value == 1?'ban2_c_item_choose':''"
            @click="pageData.value = 1"
          >
            <a-icon
              class="ban2_c_item_icon_hui"
              theme="filled"
              type="close-circle"
              v-if="pageData.value != 1"
            />
            <a-icon
              class="ban2_c_item_icon_lan"
              theme="filled"
              type="close-circle"
              v-if="pageData.value == 1"
            />
            <div class="ban2_c_item_title">驳回</div>
          </div>
        </div>
      </div>
      <div class="banner3_body">
        <div class="part-title">
          <div class="part-title_blue"></div>
          <div>签批说明：</div>
        </div>
        <div class="ban3_content">
          <a-textarea
            v-model="pageData.remark"
            placeholder="可输入签批说明"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </div>
      </div>
    </div>
    <!-- old -->
    <table class="table_2" v-if="pageTypeNumber == 122">
      <tr style="background: #F5F8FA;">
        <th colspan="4" style="text-align: left;padding-left: 50px;">
          发运流转单：
          <a @click="goMsgLok(pageId)">{{pageShipNumber || ''}}</a> 在复查任务环节 出现了 异议签批，请批示
        </th>
      </tr>
      <tr>
        <th style="background: #F5F8FA;">签批</th>
        <td colspan="3">
          <a-radio-group name="radioGroup" v-model="pageData.value">
            <a-radio :value="0" style="margin-right: 30px;">同意</a-radio>
            <a-radio :value="1">驳回</a-radio>
          </a-radio-group>
        </td>
      </tr>
      <tr>
        <th style="background: #F5F8FA;">签批说明</th>
        <td colspan="3" class="table_textarea">
          <a-textarea
            v-model="pageData.remark"
            placeholder="可输入签批说明"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </td>
      </tr>
    </table>
    <div class="banner3 foot shehe_foot_style" v-if="pageTypeNumber != 13">
      <!-- :disabled="!chooseTime" -->
      <a-button class="m_r_20" @click="close()">取消</a-button>
      <a-button type="primary" @click="submit()">审批</a-button>
    </div>
    <!-- new -->
    <div v-if="pageTypeNumber == 13">
      <div class="banner1_body">
        <div class="ban1_show">
          <img class="ban1_show_img" src="../../assets/shipment/qianpi_show_img.png" />
          <div class="ban1_show_content">
            发运流转单：
            <a @click="goMsgLok(pageId)">{{pageShipNumber || ''}}</a> 在包装确认环节发现不合格项，具体如下，请批示
          </div>
        </div>
      </div>
      <div class="banner2_body">
        <div class="part-title">
          <div class="part-title_blue"></div>
          <div>包装环节内容：</div>
        </div>
        <div>
          <table class="table_2">
            <tr style="background: #F5F8FA;">
              <th>确认项</th>
              <th>是否合格</th>
              <th>备注</th>
            </tr>
            <tr>
              <td>包装方式</td>
              <td>
                <div>
                  <PassBtnShow :showData="matterData2.packingMethodIsItQualified == 0?true:false"></PassBtnShow>
                </div>
              </td>
              <td>{{matterData2.packingMethodMark}}</td>
            </tr>
            <tr>
              <td>标签</td>
              <td>
                <div>
                  <PassBtnShow :showData="matterData2.tagIsItQualified == 0?true:false"></PassBtnShow>
                </div>
              </td>
              <td>{{matterData2.tagMark}}</td>
            </tr>
            <tr>
              <td>实验报告</td>
              <td>
                <div>
                  <PassBtnShow :showData="matterData2.reportIsItQualified == 0?true:false"></PassBtnShow>
                </div>
              </td>
              <td>{{matterData2.reportMark}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="banner3_body">
        <div class="part-title">
          <div class="part-title_blue"></div>
          <div>签批说明：</div>
        </div>
        <div class="ban3_content">
          <a-textarea
            v-model="pageData.remark"
            placeholder="可输入签批说明"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </div>
      </div>
      <div class="banner3 foot shehe_foot_style">
        <a-button class="m_r_20 greenBtn" type="primary" @click="submit_bao(0)">通过</a-button>
        <a-button @click="submit_bao(1)" type="danger">驳回</a-button>
      </div>
    </div>
    <!-- old -->
    <div v-if="pageTypeNumber == 133">
      <table class="table_2">
        <tr style="background: #F5F8FA;">
          <th>确认项</th>
          <th>是否合格</th>
          <th>备注</th>
        </tr>
        <tr>
          <td>包装方式</td>
          <td>
            <div>
              <PassBtnShow :showData="matterData2.packingMethodIsItQualified == 0?true:false"></PassBtnShow>
            </div>
          </td>
          <td>{{matterData2.packingMethodMark}}</td>
        </tr>
        <tr>
          <td>标签</td>
          <td>
            <div>
              <PassBtnShow :showData="matterData2.tagIsItQualified == 0?true:false"></PassBtnShow>
            </div>
          </td>
          <td>{{matterData2.tagMark}}</td>
        </tr>
        <tr>
          <td>实验报告</td>
          <td>
            <div>
              <PassBtnShow :showData="matterData2.reportIsItQualified == 0?true:false"></PassBtnShow>
            </div>
          </td>
          <td>{{matterData2.reportMark}}</td>
        </tr>
      </table>
      <div class="banner3 foot shehe_foot_style">
        <a-button class="m_r_20 greenBtn" type="primary" @click="submit_bao(0)">通过</a-button>
        <a-button @click="submit_bao(1)" type="danger">驳回</a-button>
      </div>
    </div>
    <div class="dialog">
      <a-modal v-model="deliveryVisible2" title="流转单现阶段详情" :footer="null" width="800px">
        <div v-if="deliveryVisible2">
          <view-details
            :id="pageId"
            @close="deliveryVisible2 = false"
            :iShow="true"
            :pageStatus="pageStatus"
          ></view-details>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { getShipTaskMsgById, ApprovalshipOrder } from '@/api/api'
import PassBtnShow from './component/pass_btn_show'
import store from '@/store/'
import viewDetails from './viewDetails'
export default {
  name: 'signApproveDialog',
  data() {
    return {
      value: null,
      pageNumber: '',
      defectDescriptionList: [],
      mainData: {},

      // 正式
      // pageTypeNumber: 1, // 11.复查-一级 12.复查-2/3级 13.包装确认
      // pageId: 32,
      pageShipMsg: {},
      pageShipNumber: '',
      pageData: {
        value: null,
        remark: null
      }, // 填写数据
      matterData2: {}, // 包装确认的详情
      roleCode: null,
      deliveryVisible2: false,
      pageStatus: 0
    }
  },
  // 工作流id + 发运流转单id
  props: ['pageId', 'pageTypeNumber'],
  components: { PassBtnShow, viewDetails },
  created() {},
  mounted() {
    this.getMsg() // 获取发运单详情
    console.log(store.getters.userInfo.roleCode)
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
  },

  methods: {
    // 查询列表
    getMsg() {
      getShipTaskMsgById({
        shipmentManagementId: this.pageId
      }).then(data => {
        console.log(data)
        if (data.shipmentManagementInfoVo && data.shipmentManagementInfoVo.wheelShape) {
          this.pageShipMsg = data
          this.pageShipNumber = data.shipmentManagementInfoVo.shippingFlowSheet
          if (this.pageTypeNumber == 13) {
            this.pageStatus = 4
          } else {
            this.pageStatus = 3
          }
          this.roleCode = store.getters.userInfo.roleCode
          if (this.pageTypeNumber == 13) {
            this.matterData2 = data.shipmentPackagingConfirmationVo
          }
        } else if (data.success) {
          this.$message.success(data.message)
        } else {
          this.$message.error(data.message)
        }
      })
    },
    // 复查 - 需要选择签批结果
    submit() {
      let value = this.pageData
      let canSubmit = true
      if (value.value == null) {
        // 可以提交了
        canSubmit = false
      }
      if (canSubmit) {
        let sendData = {
          shipmentManagementId: this.pageId
        }
        if (this.pageTypeNumber == 18) {
          sendData.projectManagerExplain = this.pageData.remark
          sendData.projectManagerResult = this.pageData.value.toString()
        } else if (this.pageTypeNumber == 11) {
          sendData.projectDirectorExplain = this.pageData.remark
          sendData.projectDirectorResult = this.pageData.value.toString()
        } else if (this.pageTypeNumber == 12) {
          // 质保部长
          sendData.qualityDirectorExplain = this.pageData.remark
          sendData.qualityDirectorResult = this.pageData.value.toString()
        }

        // 方法
        ApprovalshipOrder(sendData).then(data => {
          if (data.success) {
            this.$message.success('审批' + data.message)
            this.close()
          } else {
            this.$message.error(data.message)
          }
        })
      } else {
        this.$message.error('请选择签批结果')
      }

      // 2.提交接口-给主组件
    },
    // 包装确认 - 不需要判断
    submit_bao(value) {
      let sendData = {
        packagingConfirmationResult: value.toString(),
        packagingConfirmationExplain: this.pageData.remark,
        shipmentManagementId: this.pageId
      }
      // 方法
      ApprovalshipOrder(sendData).then(data => {
        if (data.success) {
          this.$message.success('审批' + data.message)
          this.close()
        } else {
          this.$message.error(data.message)
        }
      })
    },
    close() {
      this.$emit('close')
    },
    goMsgLok(id) {
      console.log('查看详情', id)
      this.deliveryVisible2 = true
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
.banner3 {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}
.m_r_20 {
  margin-right: 20px;
}
.greenBtn {
  background: #2fb050;
  border-color: #2fb050;
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
.ban1_show_img {
  display: block;
  width: 100%;
}
.ban1_show {
  position: relative;
}
.ban1_show_content {
  position: absolute;
  bottom: 15px;
  left: 76px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.5);
}
.ban3_content {
  width: 100%;
}
.ban2_content {
  display: flex;
}
.ban2_c_item {
  width: 180px;
  border: 2px solid #d9dbdf;
  border-radius: 6px;
  text-align: center;
  font-size: 16px;
  padding: 10px 0;
  color: #8e939e;
  background: #fff;
  cursor: pointer;
  margin-right: 20px;
}
.ban2_c_item_icon {
  width: 150px;
}
.ban2_c_item_title {
  margin-top: 10px;
}
.ban2_c_item_choose {
  border: 2px solid #639bf5;
  color: #639bf5;
  background: #edf6ff;
}
.shehe_foot_style {
  justify-content: flex-end;
}
.ban2_c_item_icon_hui {
  color: #d9dbdf;
  font-size: 20px;
}
.ban2_c_item_icon_lan {
  color: #639bf5;
  font-size: 20px;
}
</style>