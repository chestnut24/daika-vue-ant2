<template>
  <div class="pageMain" style="min-width: 1600px">
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
                <a-input v-model="searchParams.shippingFlowSheet" placeholder="请输入发运流转单号" />
              </a-form-item>
            </div>
            <div class="flex-left">
              <div>戴卡部件号：</div>
            </div>
            <div class="item-input item-input-fold">
              <a-form-item>
                <a-input v-model="searchParams.wheelShape" placeholder="请输入戴卡部件号" />
              </a-form-item>
            </div>

            <div class="flex-left">
              <div>戴卡订单号：</div>
            </div>
            <div class="item-input item-input-fold">
              <a-form-item>
                <a-input v-model="searchParams.customerOrder" placeholder="请输入戴卡订单号" />
              </a-form-item>
            </div>

            <div class="button-group">
              <a-button type="link" @click="changeDownOrUp" style="margin-right: 0">
                展开
                <a-icon type="down" />
              </a-button>
              <a-button type="primary" @click="getList(true)">查询</a-button>
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
                  <a-input v-model="searchParams.shippingFlowSheet" placeholder="请输入发运流转单号" />
                </a-form-item>
              </div>
              <div class="flex-left">
                <div>戴卡部件号：</div>
              </div>
              <div class="item-input item-input-fold">
                <a-form-item>
                  <a-input v-model="searchParams.wheelShape" placeholder="请输入戴卡部件号" />
                </a-form-item>
              </div>

              <div class="flex-left">
                <div>戴卡订单号：</div>
              </div>
              <div class="item-input item-input-fold">
                <a-form-item>
                  <a-input v-model="searchParams.customerOrder" placeholder="请输入戴卡订单号" />
                </a-form-item>
              </div>
            </div>

            <div class="row" style="margin-bottom: 16px">
              <div class="flex-left">
                <div>样件批次号：</div>
              </div>
              <div class="item-input">
                <a-form-item>
                  <a-input v-model="searchParams.batchNumber" placeholder="请输入样件批次号" />
                </a-form-item>
              </div>
              <div class="flex-left">
                <div>客户名称</div>
              </div>
              <div class="item-input">
                <a-form-item>
                  <a-input v-model="searchParams.customerName" placeholder="请输入客户名称" />
                </a-form-item>
              </div>
              <div class="flex-left">
                <div>计划发运时间：</div>
              </div>
              <div class="item-input">
                <a-form-item>
                  <a-range-picker
                    style="width: 244px;"
                    @change="ontimeChange($event)"
                    v-model="searchParams.time"
                    valueFormat="YYYY-MM-DD"
                  />
                </a-form-item>
              </div>
              <div class="button-group">
                <a-button type="link" @click="changeDownOrUp" style="margin-right: 0">
                  收起
                  <a-icon type="up" />
                </a-button>
                <a-button type="primary" @click="getList(true)">查询</a-button>
                <a-button @click="resetGetList()">重置</a-button>
              </div>
            </div>
          </template>
        </a-form>
      </div>
    </a-card>

    <a-card
      title="发运计划管理"
      style="width: 100%"
      :bordered="false"
      :headStyle="{
        padding: '0 32px',
        fontSize: '18px',
        fontWeight: '600',
      }"
      :bodyStyle="{padding: '16px 32px'}"
    >
      <div slot="extra">
        <a-button type="primary" @click="downPlan" :disabled="dataSource.length==0">下发计划</a-button>
      </div>
      <div class="My_table jn-public-table jn-public-table-other">
        <a-table
          :dataSource="dataSource"
          :columns="showColumns"
          bordered
          :pagination="false"
          :loading="tableLoading"
          :scroll="{ x: true }"
        >
          <jnFilterTable
            ref="jnFilterTable"
            :columns="columns"
            :showColumns="showColumns"
            @showColumnsChange="setShowColumns"
            slot="filterDropdown"
          ></jnFilterTable>
          <jnFilterIcon slot="filterIcon"></jnFilterIcon>
          <jnFilterAction slot="action" slot-scope="text, record"></jnFilterAction>
          <!-- shippingFlowSheet -->
          <a-space slot="shippingFlowSheet" slot-scope="text, operate, i" class="operate-row">
            <a @click="getLookMsg(operate, i)">{{operate.shippingFlowSheet}}</a>
          </a-space>
          <a-space slot="urgentTaskStatus" slot-scope="text, operate" class="operate-row">
            <span
              v-if="operate.urgentTaskStatus == 1"
              style="color: #FF3133;"
            >{{operate.urgentTaskStatus_L}}</span>
            <span v-else>{{operate.urgentTaskStatus_L}}</span>
          </a-space>
          <a-space
            slot="batchNumber"
            slot-scope="text, operate, i"
            class="operate-row"
          ><div v-html="operate.batchNumber.join('<br>')"></div></a-space>
          <!-- shipPlanNumber -->
          <a-space slot="shipPlanNumber" slot-scope="text, operate" class="operate-row">
            <span v-if="operate.urgentTaskStatus == 1">--</span>
            <span v-else-if="operate.shipPlanNumber === 'null'">--</span>
            <span v-else>{{operate.shipPlanNumber}}</span>
          </a-space>
          <!-- planRetestDate -->
          <a-space slot="planRetestDate" slot-scope="text, operate" class="operate-row">
            <span v-if="operate.urgentTaskStatus == 1">--</span>
            <span v-else>{{operate.planRetestDate}}</span>
          </a-space>
          <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
            <a type="link" @click="getLookMsg(operate, i)">查看</a>
            <!-- 如果已生效就不能改 -->
            <a
              :disabled="operate.planStatus == 2"
              type="link"
              @click="getTimeMsg(operate, i)"
            >复查时间维护</a>
          </a-space>
        </a-table>
        <!--    分页-->
        <div class="bottom-page">
          <a-pagination
            :total="total"
            :show-total="total => `共 ${total} 条`"
            :page-size="pageSize"
            :current="currentPage"
            @change="pageChange"
          />
          <div style="margin: 0 20px">共 {{pageNum}} 页</div>
          <div style="margin: 0 10px 0 0">到第</div>
          <a-input-number
            style="width: 50px"
            @keyup.enter.native="pageJump(jumpPage)"
            v-model="jumpPage"
          ></a-input-number>
          <div style="margin: 0 20px 0 10px">页</div>
          <a-button type="primary" @click="pageJump(jumpPage)">跳转</a-button>
        </div>
      </div>
    </a-card>

    <div class="dialog">
      <!-- reviewTimeDialog -->
      <a-modal v-model="deliveryVisible" title="发运计划复查时间维护" :footer="null" width="800px">
        <div v-if="deliveryVisible">
          <review-time-dialog :id="deliverychoose_id" @close="closeTimeMsg" :iShow="false"></review-time-dialog>
        </div>
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
  </div>
</template>

<script>
import store from '@/store/'
import reviewTimeDialog from './reviewTimeDialog'
import viewDetails from '@/views/shipment/viewDetails'
import { getShipPlanList, downShipPlanArrs, upDateShipPlan, getOptions } from '@/api/api'
import { jnFilterTableMixin } from '@/mixins/jnFilterTable'
export default {
  name: 'ShipPlanList',
  mixins: [jnFilterTableMixin],
  data() {
    return {
      dic: {
        // 表单中的部分数据对应的的数据词典
        planStatus: [], // 计划状态
        urgentTaskStatus: [] // 紧急任务状态
      },
      searchParams: {
        //
        shippingFlowSheet: '', // 发运流转单号
        wheelShape: '', // 轮型号
        customerOrder: '', // 戴卡订单号
        batchNumber: '', // 样件批次号
        userId: '', // 用户id
        //
        time: [], // 时间选框
        planShipmentDateStart: null, // 计划发运时间开始
        planShipmentDateEnd: null // 计划发运时间结束
      },
      waitingNumber: 1,
      sureBadNumber: 2,
      waitingBadNumber: 3,
      total: 0, // 共多少条
      pageSize: 10, // 一页多少条
      pageNum: 1, // 共多少页
      jumpPage: 1, // 跳转到第几页
      currentPage: 1, // 当前页
      deliveryVisible: false, //提货完成弹窗可视化
      deliveryVisible2: false, //提货完成弹窗可视化
      menuOpen: false, // 展开收起
      tableLoading: false,
      deliverychoose_id: null, // 选择的那个id
      dataSource: [], //表格数据
      columns: [
        {
          title: '发运流转单号',
          dataIndex: 'shippingFlowSheet',
          key: 'shippingFlowSheet',
          fixed: 'left',
          width: '250px',
          scopedSlots: { customRender: 'shippingFlowSheet' }
        },
        {
          title: '戴卡部件号',
          dataIndex: 'wheelShape',
          key: 'wheelShape'
        },
        {
          title: '戴卡订单号',
          dataIndex: 'customerOrder',
          key: 'customerOrder'
        },
        {
          title: '样件批次号',
          dataIndex: 'batchNumber',
          key: 'batchNumber',
          scopedSlots: { customRender: 'batchNumber' }
        },
        {
          title: '轮型尺寸',
          dataIndex: 'wheelShapeSize',
          key: 'wheelShapeSize'
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
          key: 'customerName'
        },
        {
          title: '计划发运时间',
          dataIndex: 'planShipmentDate',
          key: 'planShipmentDate'
        },
        {
          title: '紧急任务',
          dataIndex: 'urgentTaskStatus_L',
          key: 'urgentTaskStatus_L',
          scopedSlots: { customRender: 'urgentTaskStatus' }
        },
        {
          title: '计划复查时间',
          dataIndex: 'planRetestDate',
          key: 'planRetestDate',
          scopedSlots: { customRender: 'planRetestDate' }
        },
        {
          title: '发运计划序号',
          dataIndex: 'shipPlanNumber',
          key: 'shipPlanNumber',
          scopedSlots: { customRender: 'shipPlanNumber' }
        },
        {
          title: '计划状态',
          dataIndex: 'planStatus_L',
          key: 'planStatus_L'
        },
        // 操作格子
        {
          title: '操作',
          dataIndex: 'operate',
          key: 'operate',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'operate' }
        }
      ],
      deliverychoose_shippingFlowSheet: ''
    }
  },
  components: { reviewTimeDialog, viewDetails },
  //初始化
  mounted() {
    this.getDic() // 获取字典
    var userId = store.getters.userInfo.id
    this.searchParams.userId = userId
    // this.getList()
  },
  methods: {
    // 查询列表
    getList(reset = false) {
      this.tableLoading = true
      if (reset) {
        // 如果需要重置，比如有了新的筛选条件
        this.currentPage = 1
      }
      let param = {
        shipmentPlanSearchDto: this.searchParams,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      getShipPlanList(this.searchParams, {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }).then(data => {
        if (data.success) {
          let dataList = data.result
          if (!(dataList.records && dataList.records.length)) {
            this.dataSource = []
            this.total = 0
            this.pageNum = 0
            this.tableLoading = false
          } else {
            for (let i = 0; i < dataList.records.length; i++) {
              // 遍历返回的数据列表
              for (let name in dataList.records[i]) {
                // 列表每行 for 出每个属性
                if (name in this.dic) {
                  // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) {
                    // 遍历该字典，看看有哪些值
                    if (dataList.records[i][name] == this.dic[name][j].value) {
                      // 找到value相等时对应的label
                      dataList.records[i][name + '_L'] = this.dic[name][j].label
                    }
                  }
                }
              }
            }
            // 数据处理
            this.dataSource = dataList.records
            this.total = dataList.total
            this.pageNum = this.getPageNumber(dataList.total)
            this.tableLoading = false
          }
        } else {
          this.$message.error(data.message)
          this.tableLoading = false
        }
      })
    },
    resetGetList() {
      this.searchParams = {
        //
        shippingFlowSheet: '', // 发运流转单号
        wheelShape: '', // 轮型号
        customerOrder: '', // 戴卡订单号
        batchNumber: '', // 样件批次号
        userId: this.searchParams.userId,
        //
        time: [], // 时间选框
        planShipmentDateStart: null, // 计划发运时间开始
        planShipmentDateEnd: null // 计划发运时间结束
      }
      this.total = 0 // 共多少条
      this.pageSize = 10 // 一页多少条
      this.pageNum = 1 // 共多少页
      this.jumpPage = 1 // 跳转到第几页
      this.currentPage = 1 // 当前页
      this.getList(true)
    },
    getPageNumber(number) {
      if (this.pageSize >= number) {
        return 1
      } else {
        let a = number / this.pageSize
        // 向上取整
        return Math.ceil(a)
      }
    },
    // 分页
    pageChange(val) {
      // 分页改变
      this.currentPage = val
      this.getList()
    },
    pageJump(page) {
      // 点击指定分页跳转的情况下
      if (page > this.pageNum) {
        page = this.pageNum
        this.jumpPage = this.pageNum
      } else if (page < 1) {
        page = 1
        this.jumpPage = 1
      }
      this.currentPage = page
      this.getList()
    },
    getDic() {
      // 获取表单中的部分字段对应的字典
      for (let name in this.dic) {
        let searchName = this.humpOrLine(name, 'toLine')
        getOptions(searchName, '').then(data => {
          this.dic[name] = data
        })
      }
      let _this = this
      let abcd = setInterval(function() {
        let aaa = true
        for (let name in _this.dic) {
          if (_this.dic[name].length === 0) {
            aaa = false
          }
        }
        if (aaa) {
          clearInterval(abcd)
          _this.getList(true)
        }
      }, 500)
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
    // 下发计划按钮
    downPlan() {
      // 弹窗-确认下发
      this.$confirm({
        title: '确认执行下发操作?',
        content: '即将对复查时间不为空并且计划状态为已排序的进行下发计划',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.tableLoading = true
          // console.log('OK')
          downShipPlanArrs().then(data => {
            console.log(data)
            if (data.success) {
              this.$message.success('下发' + data.message)
              this.tableLoading = false
              this.getList()
            } else {
              this.$message.error(data.message)
              this.tableLoading = false
            }
          })
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    // 时间框改变时间
    ontimeChange(data) {
      if (data && data.length) {
        this.searchParams.planShipmentDateStart = data[0]
        this.searchParams.planShipmentDateEnd = data[1]
      } else {
        this.searchParams.planShipmentDateStart = null
        this.searchParams.planShipmentDateEnd = null
      }
    },
    // 查看
    getLookMsg(data, number) {
      console.log('查看')
      this.deliveryVisible2 = true
      ;(this.deliverychoose_id = data.shipmentManagementId),
        (this.deliverychoose_shippingFlowSheet = data.shippingFlowSheet)
    },
    // 复查时间维护
    getTimeMsg(data, number) {
      console.log(data)
      // 打开弹窗-shipmentManagementId-请求接口-结束后关闭自己，然后请求getlist
      this.deliveryVisible = true
      this.deliverychoose_id = data.shipmentManagementId
    },
    closeTimeMsg() {
      this.deliveryVisible = false
      this.deliverychoose_id = null
      // this.currentPage = 1
      this.getList(false)
    },
    closeTimeMsg2() {
      this.deliveryVisible2 = false
      this.deliverychoose_id = null
    },
    changeDownOrUp() {
      this.menuOpen = !this.menuOpen
    }
  },
  created() {
    // this.getDic() // 获取字典
    // var userId = store.getters.userInfo.id
    // this.searchParams.userId = userId
    // this.getList()
  }
}
</script>

<style scoped lang="less">
@import '../../css/public-table-css.less';
.search-frame {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.search-frame-left {
  width: 80%;
  display: flex;
  align-items: center;
}
.item-frame {
  margin-right: 20px;
}
.display-frame {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}
.display-frame-left {
  width: 100%;
  height: 120px;
  border: 1px solid #f2f2f2;
}
.display-title {
  width: 100%;
  height: 50px;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  padding-left: 20px;
}
.span-margin {
  margin-right: 20px;
}
.display-data {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 40px;
}

.pageMain {
  // margin: -12px -12px 0 -12px;
  padding: 16px;
  padding-bottom: 0;
}
.page_seach {
  padding: 24px 32px;
  margin-bottom: 16px;
}
.bg_w {
  background: #fff;
}
.bottom-page {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  margin-bottom: 24px;
  align-items: center;
}
.item-button {
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