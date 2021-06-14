<template>
  <div>
    <table class="table_2" v-if="pageTypeNumber == 11">
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
    <table class="table_2" v-if="pageTypeNumber == 12">
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
    <div class="banner3 foot" v-if="pageTypeNumber != 13">
      <!-- :disabled="!chooseTime" -->
      <a-button class="m_r_20" type="primary" @click="submit()">审批</a-button>
      <a-button @click="close()">关闭</a-button>
    </div>
    <div v-if="pageTypeNumber == 13">
      <table class="table_2">
        <tr style="background: #F5F8FA;">
          <th colspan="4" style="text-align: left;padding-left: 50px;">
            发运流转单：
            <a @click="goMsgLok(pageId)">{{pageShipNumber || ''}}</a> 在包装确认环节发现不合格项，具体如下，请批示
          </th>
        </tr>
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
      <div class="banner3 foot">
        <!-- :disabled="!chooseTime" -->
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
        if (this.pageTypeNumber == 11) {
          sendData.projectManagerExplain = this.pageData.remark
          sendData.projectManagerResult = this.pageData.value.toString()
        } else if (this.pageTypeNumber == 12) {
          if (this.roleCode === 'project_director') {
            // 项目部长
            sendData.projectDirectorExplain = this.pageData.remark
            sendData.projectDirectorResult = this.pageData.value.toString()
          } else if (this.roleCode === 'warranty_director') {
            // 质保部长
            sendData.qualityDirectorExplain = this.pageData.remark
            sendData.qualityDirectorResult = this.pageData.value.toString()
          } else {
            // 判断不出来的时候先 - 项目部长
            sendData.projectDirectorExplain = this.pageData.remark
            sendData.projectDirectorResult = this.pageData.value.toString()
          }
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
</style>