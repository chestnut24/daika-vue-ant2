<template>
  <div style="min-width: 1600px">
    <a-card style="margin-bottom: 16px">
      <!-- 查询区域 -->
      <div class="search-container jn-public-table">
        <a-form layout="inline">
          <div class="row" v-if="!menuOpen">
            <div class="flex-left">
              <div>发运流转单号：</div>
            </div>
            <div class="item-input item-input-fold">
              <a-form-item>
                <a-input v-model="queryParam.shippingFlowSheet" placeholder="请输入发运流转单号" />
              </a-form-item>
            </div>
            <div class="flex-left">
              <div>戴卡部件号：</div>
            </div>
            <div class="item-input item-input-fold">
              <a-form-item>
                <a-input v-model="queryParam.wheelShape" placeholder="请输入戴卡部件号" />
              </a-form-item>
            </div>

            <div class="flex-left">
              <div>戴卡订单号：</div>
            </div>
            <div class="item-input item-input-fold">
              <a-form-item>
                <a-input v-model="queryParam.customerOrder" placeholder="请输入戴卡订单号" />
              </a-form-item>
            </div>

            <div class="button-group">
              <a-button type="link" @click="changeDownOrUp" style="margin-right: 0">
                展开
                <a-icon type="down" />
              </a-button>
              <a-button type="primary" @click="searchQuery(true)">查询</a-button>
              <a-button @click="resetGetList()">重置</a-button>
            </div>
          </div>
          <template v-if="menuOpen">
            <div class="row" style="margin-bottom: 16px">
              <div class="flex-left">
                <div>发运流转单号：</div>
              </div>
              <div class="item-input item-input-fold">
                <a-form-item>
                  <a-input v-model="queryParam.shippingFlowSheet" placeholder="请输入发运流转单号" />
                </a-form-item>
              </div>
              <div class="flex-left">
                <div>戴卡部件号：</div>
              </div>
              <div class="item-input item-input-fold">
                <a-form-item>
                  <a-input v-model="queryParam.wheelShape" placeholder="请输入戴卡部件号" />
                </a-form-item>
              </div>

              <div class="flex-left">
                <div>戴卡订单号：</div>
              </div>
              <div class="item-input item-input-fold">
                <a-form-item>
                  <a-input v-model="queryParam.customerOrder" placeholder="请输入戴卡订单号" />
                </a-form-item>
              </div>
              <div class="flex-left">
                <div>样件批次号：</div>
              </div>
              <div class="item-input" style="margin: 0 65px 0 12px">
                <a-form-item>
                  <a-input v-model="queryParam.batchNumber" placeholder="请输入样件批次号" />
                </a-form-item>
              </div>
            </div>

            <div class="row" style="margin-bottom: 16px">
              <div class="flex-left">
                <div>客户名称</div>
              </div>
              <div class="item-input" style="margin: 0 72px 0 12px">
                <a-form-item>
                  <a-input v-model="queryParam.customerName" placeholder="请输入客户名称" />
                </a-form-item>
              </div>
              <div class="flex-left">
                <div>计划发运时间：</div>
              </div>
              <div class="item-input" style="margin: 0 66px 0 12px">
                <a-form-item>
                  <a-range-picker
                    style="width: 244px;"
                    @change="ontimeChange($event)"
                    v-model="queryParam.time"
                    valueFormat="YYYY-MM-DD"
                  />
                </a-form-item>
              </div>
              <div class="flex-left">
                <div>发运通知书状态：</div>
              </div>
              <div class="item-input" style="margin: 0 66px 0 12px">
                <a-form-item>
                  <a-select placeholder="请选择" v-model="queryParam.status" style="width: 244px;">
                    <a-select-option
                      v-for="data in option.ship_status"
                      :key="data.value"
                    >{{ data.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div class="button-group">
                <a-button type="link" @click="changeDownOrUp" style="margin-right: 0">
                  收起
                  <a-icon type="up" />
                </a-button>
                <a-button type="primary" @click="searchQuery(true)">查询</a-button>
                <a-button @click="resetGetList()">重置</a-button>
              </div>
            </div>
          </template>
        </a-form>
      </div>
    </a-card>

    <a-card
      title="发运流转单管理"
      style="width: 100%;margin-top: 16px;"
      :bordered="false"
      :headStyle="{
        padding: '0 32px',
        fontSize: '18px',
        fontWeight: '600',
      }"
      :bodyStyle="{padding: '16px 32px'}"
    >
      <div slot="extra">
        <div class="button-group">
          <a-button
            style="margin-right: 8px;"
            type="primary"
            ghost
            icon="plus"
            @click="buildShipOrder"
          >新增发运任务</a-button>
          <a-button type="primary" icon="plus" @click="buildRunnerOrder">新增转轮任务</a-button>
        </div>
      </div>
      <div class="My_table jn-public-table jn-public-table-other">
        <a-table
          ref="table"
          size="middle"
          bordered
          :columns="showColumns"
          :dataSource="dataSource"
          :scroll="{ x: true }"
          :row-class-name="isRedRow"
          :pagination="false"
        >
          <!-- 列管理 -s -->
          <jnFilterTable
            ref="jnFilterTable"
            :columns="columns"
            :showColumns="showColumns"
            @showColumnsChange="setShowColumns"
            slot="filterDropdown"
          ></jnFilterTable>
          <jnFilterIcon slot="filterIcon"></jnFilterIcon>
          <jnFilterAction slot="action" slot-scope="text, record"></jnFilterAction>
          <!-- 列管理 -e -->
          <a-space slot="shippingFlowSheet" slot-scope="text, operate, i" class="operate-row">
            <a-button type="link" @click="showFlowSheetDetail(operate, i)">{{ text }}</a-button>
          </a-space>

          <a-space
            slot="batchNo"
            slot-scope="text, operate"
            class="operate-row"
          ><div v-html="operate.batchNumber.join('<br>')"></div></a-space>

          <a-space slot="shipInstructions" slot-scope="text, operate, i" class="operate-row">
            <a-button type="link" @click="showInstructions(operate, i)">{{ text }}</a-button>
          </a-space>

          <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
            <a-button type="link" @click="showFlowSheetDetail(operate, i)">查看</a-button>
            <a-button type="link" v-if="operate.status === '草稿'" @click="editRow(operate, i)">修改</a-button>
            <a-button
              type="link"
              v-if="operate.status !== '草稿' && operate.status !== '已关闭'"
              @click="orderClose(operate, i)"
            >{{ '关闭' }}</a-button>
            <a-button
              type="link"
              v-if="(operate.status === '待计划' || operate.status === '已下发') && (operate.urgentTaskStatus == '0' || operate.urgentTaskStatus == 'null')"
              @click="switchemergency(operate, i)"
            >紧急</a-button>
          </a-space>
        </a-table>
        <!--    分页-->
        <div class="bottom-page">
          <a-pagination
            :total="page.total"
            :show-total="total => `共 ${total} 条`"
            :page-size="page.pageSize"
            :current="page.currentPage"
            @change="pageChange"
          />
          <div style="margin: 0 20px">共 {{page.pageNum}} 页</div>
          <div style="margin: 0 10px 0 0">到第</div>
          <a-input-number
            style="width: 50px"
            @keyup.enter.native="pageJump(page.jumpPage)"
            v-model="page.jumpPage"
          ></a-input-number>
          <div style="margin: 0 20px 0 10px">页</div>
          <a-button type="primary" @click="pageJump(page.jumpPage)">确定</a-button>
        </div>
      </div>
    </a-card>
    <ship-notice-info ref="shipnoticeInfo"></ship-notice-info>
    <!--    <instruction-ship-list ref = 'instructionshiplist'></instruction-ship-list>-->
    <shipinstruction-show ref="shipinstructionshow"></shipinstruction-show>
    <!--    关闭-->
    <a-modal
      v-model:visible="closeVisible"
      title="确认关闭"
      ok-text="确认"
      cancel-text="取消"
      @ok="orderCloseSure"
      @cancel="orderCloseCancel"
    >
      <p>是否确定关闭此发运流转单？</p>
    </a-modal>

    <a-modal
      v-model:visible="urgencyVisible"
      title="确认修改为紧急状态"
      ok-text="确认"
      cancel-text="取消"
      @ok="orderUrgenceSure"
      @cancel="orderUrgenceCancel"
    >
      <p>是否确定修改为紧急状态？</p>
    </a-modal>

    <a-modal v-model="deliveryVisible2" title="流转单现阶段详情" :footer="null" width="800px">
      <div v-if="deliveryVisible2">
        <view-details
          :id="deliverychoose_id"
          @close="deliveryVisible2 = false;deliverychoose_shippingFlowSheet = '';deliverychoose_id = null"
          :iShow="true"
          :shippingFlowSheet="deliverychoose_shippingFlowSheet"
        ></view-details>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getShipListInformation, getOptions, closeShipOrder, updateTaskStatus, getShipTaskList } from '@/api/api'
import { uploadAction } from '@/api/manage'
import viewDetails from '@/views/shipment/viewDetails'
import store from '@/store/'
import ShipNoticeInfo from '@views/shipManage/ShipNoticeInfo'
import InstructionShipList from '@views/shipInstructionManage/InstructionShipList'
import ShipinstructionShow from '@views/shipInstructionManage/ShipinstructionShow'

import { jnFilterTableMixin } from '@/mixins/jnFilterTable'

export default {
  name: 'TransferOrderManage',
  components: { ShipNoticeInfo, InstructionShipList, ShipinstructionShow, viewDetails }, //引入组件
  mixins: [jnFilterTableMixin],
  data() {
    return {
      planShipDate: [], // 计划发运时间
      // 字典
      option: {
        // 下拉选项
        // status:[]
        ship_status: [] // 发运通知书状态
      },
      dic: {
        // 表单中的部分数据对应的的数据词典
        shipStatus: [] // 发运通知书状态
      },
      closeTitle: '关闭',
      // 请求参数
      queryParam: {
        shippingFlowSheet: '', //发运流运单号
        wheelShape: '', // 轮型项目号
        customerOrder: '', //订单号
        batchNumber: '', //样本批次号
        userId: '',
        customerName: '', //客户名称
        planShipmentDateStart: '', //计划发运开始日期
        planShipmentDateEnd: '', //计划发运开结束日期
        status: undefined //发运通知书状态
      },
      // 分页
      page: {
        // 分页
        total: 0, // 共多少条
        pageSize: 5, // 一页多少条
        pageNum: 0, // 共多少页
        currentPage: 1, // 当前页
        jumpPage: 1 // 跳转到第几页,
      },
      pageStatus: '',
      deliveryVisible2: false,
      // 2.选中该条的流转单id
      deliverychoose_id: '',
      // 3.选中该条的流转单号
      deliverychoose_shippingFlowSheet: '',
      columns: [
        { title: '序号', dataIndex: 'id', align: 'center' },
        {
          title: '发运流转单号',
          dataIndex: 'shippingFlowSheet',
          key: 'shippingFlowSheet',
          align: 'center',
          scopedSlots: { customRender: 'shippingFlowSheet' }
        },
        { title: '戴卡部件号', dataIndex: 'wheelShape', align: 'center' },
        { title: '是否转轮任务', dataIndex: 'isItRunner', align: 'center' },
        { title: '戴卡订单号', dataIndex: 'customerOrder', align: 'center' },
        { title: '样件批次号', dataIndex: 'batchNumber', align: 'center', scopedSlots: { customRender: 'batchNo' } },
        { title: '轮型尺寸', dataIndex: 'wheelShapeSize', align: 'center' },
        { title: '客户名称', dataIndex: 'customerName', align: 'center' },
        { title: '计划发运时间', dataIndex: 'planShipmentDate', align: 'center' },
        { title: '发运通知书状态', dataIndex: 'status', align: 'center' },
        {
          title: '过程指令',
          dataIndex: 'shipInstructions',
          align: 'center',
          scopedSlots: { customRender: 'shipInstructions' }
        },
        {
          title: '操作',
          dataIndex: 'operate',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'operate' }
        }
      ],
      dataSource: [], // 数据

      // 关闭
      closeVisible: false, // 关闭弹窗可视化
      urgencyVisible: false,

      selectId: undefined, // 选中行的id
      menuOpen: false // 展开收起的查询条件
    }
  },

  mounted() {
    this.getAppointOption() // 获取下拉框
    this.getDic() // 获取字典

    this.$nextTick(() => {
      this.searchQuery() // 获取列表信息
    })
  },

  methods: {
    showFlowSheetDetail(operate, index) {
      // this.$refs.shipnoticeInfo.getData(operate.id);
      this.deliveryVisible2 = true
      // 2.选中该条的流转单id
      this.deliverychoose_id = operate.id
      // 3.选中该条的流转单号
      this.deliverychoose_shippingFlowSheet = operate.shippingFlowSheet
    },

    showInstructions(operate, i) {
      if (operate.shipmentProcessOrderIds) {
        this.$refs.shipinstructionshow.getInstructions(operate.shipmentProcessOrderIds)
      }
    },

    searchQuery(reset = false) {
      // 查询信息列表 reset代表是否重置页码
      if (reset) {
        // 如果需要重置，比如有了新的筛选条件
        this.page.currentPage = 1
      }
      this.queryParam.userId = store.getters.userInfo.id

      let param = this.queryParam

      getShipListInformation(param, this.page.currentPage, this.page.pageSize).then(data => {
        this.getDic()
        if (!data.result) {
          this.dataSource = []
        } else {
          if (data.result.records) {
            for (let i = 0; i < data.result.records.length; i++) {
              // 遍历返回的数据列表
              if (data.result.records[i].isItRunner === '0') {
                data.result.records[i].isItRunner = '是'
              } else if (data.result.records[i].isItRunner === '1') {
                data.result.records[i].isItRunner = '否'
              }
              for (let j = 0; j < this.dic['shipStatus'].length; j++) {
                if (Number(data.result.records[i].status) === Number(this.dic['shipStatus'][j].value)) {
                  // 找到value相等时对应的label
                  data.result.records[i].status = this.dic['shipStatus'][j].label
                }
              }
              data.result.records[i].shipInstructions =
                data.result.records[i].shipmentProcessOrderIds && data.result.records[i].shipmentProcessOrderIds.length
                  ? data.result.records[i].shipmentProcessOrderIds.length
                  : 0

              // for (let name in data.result[i]) { // 列表每行 for 出每个属性
              //   console.log(name,'---------',data.result[i]);
              //   if (name in this.dic) { // 如果该属性在字典里
              //     for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
              //       if (Number(data.result[i][name]) === Number(this.dic[name][j].value)) { // 找到value相等时对应的label
              //         console.log('this.dic[name][j].value',this.dic[name]);
              //         data.result[i][name] = this.dic[name][j].label;
              //         console.log('data.result[i][name]',data.result[i][name]);
              //       }
              //     }
              //   }
              // }
            }
            this.dataSource = data.result.records
            this.page.total = data.result.total
            this.page.pageNum = data.result.pages
          }
        }
      })
    },

    getAppointOption() {
      // 获取指定的下拉框
      for (let name in this.option) {
        let searchName = this.humpOrLine(name, 'toLine')
        getOptions(searchName, '').then(data => {
          this.option[name] = data
        })
      }
    },

    getDic() {
      // 获取表单中的部分字段对应的字典
      for (let name in this.dic) {
        let searchName = this.humpOrLine(name, 'toLine')
        getOptions(searchName, '').then(data => {
          this.dic[name] = data
        })
      }
    },

    planShipDateChange(value, dateString) {
      // 要求发货时间改变
      this.queryParam.planShipmentDateStart = dateString[0]
      this.queryParam.planShipmentDateEnd = dateString[1]
    },

    pageChange(val) {
      // 分页改变
      this.page.currentPage = val
      this.searchQuery()
    },

    pageJump(page) {
      // 点击指定分页跳转的情况下
      if (page > this.page.pageNum) {
        page = this.page.pageNum
        this.page.jumpPage = this.page.pageNum
      } else if (page < 1) {
        page = 1
        this.page.jumpPage = 1
      }
      this.page.currentPage = page
      this.searchQuery()
    },

    buildShipOrder() {
      // 新建
      this.$router.push({ path: `/ship/AddShipOrder` })
    },

    buildRunnerOrder() {
      // 下载
      this.$router.push({ path: `/ship/AddShipOrderWheel` })
    },

    resetParam() {
      // 重置
      this.orderDate = []
      this.deliveryDate = []
      this.queryParam = {
        shippingFlowSheet: '', //发运流运单号
        wheelShape: '', // 轮型项目号
        customerOrder: '', //订单号
        batchNumber: '', //样本批次号
        customerName: '', //客户名称
        planShipmentDateStart: '', //计划发运开始日期
        planShipmentDateEnd: '', //计划发运开结束日期
        status: undefined //发运通知书状态
      }
    },

    editRow(operate, i) {
      // 编辑
      if (operate.isItRunner == '否') {
        this.$router.push({
          path: `/ship/AddShipOrder`,
          query: {
            id: operate.id,
            edited: 1
          }
        })
      } else {
        this.$router.push({
          path: `/ship/AddShipOrderWheel`,
          query: {
            id: operate.id,
            edited: 1
          }
        })
      }
    },

    queryDetail(operate, i) {
      // 查询详情
      this.$router.push({
        path: `/shipmentManagementInfo/getShipmentById`,
        query: {
          id: operate.id
        }
      })
    },

    // 关闭
    orderClose(operate, i) {
      // 提示
      let param = {}
      param.userId = store.getters.userInfo.id
      param.shippingFlowSheet = operate.shippingFlowSheet
      getShipTaskList(param, {
        pageNo: 1,
        pageSize: 100
      }).then(data => {
        if (data.success) {
          let dataList = data.result
          if (!(dataList.records && dataList.records.length)) {
            this.selectId = operate.id
            this.closeVisible = true
          } else {
            dataList.records.forEach(item => {
              if (item.shipmentManagementId == operate.id) {
                if (item.taskStatus == 4) {
                  // 不能关闭
                  this.$message.error('发运流转单进入“提货中”后，不可关闭')
                } else {
                  this.selectId = operate.id
                  this.closeVisible = true
                }
              }
            })
          }
        } else {
          this.selectId = operate.id
          this.closeVisible = true
        }
      })
      // this.selectId = operate.id
      // this.closeVisible = true
      // this.searchQuery()
      // this.closeTitle = '已关闭';
    },

    isRedRow(record, index) {
      if (record.urgentTaskStatus == '1') {
        return 'litigationInfoListredRow'
      } else {
        return ''
      }
    },
    switchemergency(operate, i) {
      this.selectId = operate.id
      this.urgencyVisible = true
    },

    orderUrgenceSure() {
      updateTaskStatus(Number(this.selectId)).then(data => {
        if (data.success) {
          this.$message.success('修改为紧急状态！')
          this.selectId = undefined
          this.$nextTick(() => {
            this.searchQuery()
          })
        } else {
          this.$message.error(data.message)
        }
      })
      this.urgencyVisible = false
    },

    orderUrgenceCancel() {
      this.urgencyVisible = false
      this.selectId = undefined
    },

    orderCloseSure() {
      closeShipOrder(Number(this.selectId)).then(data => {
        if (data.success) {
          this.$message.success('关闭成功！')
          this.selectId = undefined
          this.closeVisible = false
          this.searchQuery()
        } else {
          this.$message.error(data.message)
        }
      })
    },

    orderCloseCancel() {
      this.closeVisible = false
      this.selectId = undefined
    },

    humpOrLine(name, type) {
      // 驼峰式转下划线 toLine  下划线转驼峰式 toHump
      if (type === 'toLine') {
        return name.replace(/([A-Z])/g, '_$1').toLowerCase()
      } else if (type === 'toHump') {
        return name.replace(/\_(\w)/g, function(all, letter) {
          return letter.toUpperCase()
        })
      }
    },

    changeDownOrUp() {
      this.menuOpen = !this.menuOpen
    },

    resetGetList() {
      this.queryParam = {
        shippingFlowSheet: '', //发运流运单号
        wheelShape: '', // 轮型项目号
        customerOrder: '', //订单号
        batchNumber: '', //样本批次号
        userId: '',
        customerName: '', //客户名称
        planShipmentDateStart: '', //计划发运开始日期
        planShipmentDateEnd: '', //计划发运开结束日期
        status: undefined //发运通知书状态
      }
      this.page = {
        // 分页
        total: 0, // 共多少条
        pageSize: 5, // 一页多少条
        pageNum: 0, // 共多少页
        currentPage: 1, // 当前页
        jumpPage: 1 // 跳转到第几页,
      }
      this.searchQuery(true)
    }
  }
}
</script>

<style scoped lang="less">
@import '../../css/public-table-css.less';
.ant-input {
  width: 200px;
}

.text-wrapper {
  white-space: pre-wrap;
  margin: 0 auto;
}

/*.ant-form-item {*/
/*  margin: 0;*/
/*}*/

.search-container {
  .special-date {
    height: 40px;
    width: 40px;

    span {
      text-decoration: underline;
    }
  }
}
.jn-public-table /deep/ .ant-table-body tr.litigationInfoListredRow td {
  color: #f86162 !important;
}

/deep/ tr.litigationInfoListredRow td {
  color: #f86162 !important;
}

.button-container {
  display: flex;
  align-items: center;
  height: 50px;
  width: 100%;
  margin-top: 10px;

  .button-group {
    display: flex;
    width: 95%;
    margin-right: 100px;

    button {
      margin-right: 15px;
    }
  }
  .button-col {
    width: 5%;
    display: flex;
    right: 25px;
  }
}

.table-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.bottom-page {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
}

.operate-row {
  .ant-btn {
    padding: 0;
  }
}

.flex-left {
  display: flex;
  justify-content: flex-start;
}

/*审批*/
.radio-group {
  margin: 20px;

  .audit-title {
    font-size: 18px;
    font-weight: bold;
    margin: 20px 0;
  }
}

.auditFooter {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.button-frame {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.left-button-frame {
  width: 68%;
  display: flex;
}
.bottom-page {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  align-items: center;
}

.search-frame-left {
  width: 80%;
  display: flex;
  align-items: center;
}
.item-frame {
  margin-right: 20px;
}
.row {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .item-input {
    margin: 0 72px 0 12px;
  }
  .item-input-fold {
    margin: 0 40px 0 10px;
  }
}
.search-container {
  .special-date {
    height: 40px;
    width: 40px;
    span {
      text-decoration: underline;
    }
  }
}
.flex-left {
  display: flex;
  justify-content: flex-start;
}
.button-group {
  display: flex;

  button {
    margin-right: 20px;
  }
}
</style>