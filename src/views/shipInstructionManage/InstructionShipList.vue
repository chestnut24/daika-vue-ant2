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

            <div class="row">
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
    <!-- <div class="search-container">
      <a-form layout="inline">
        <a-row type="flex" align="middle" :gutter="[0,16]">
          <a-col :md="2" :sm="4" class="flex-left">
            <div>发运流转单号</div>
          </a-col>
          <a-col :md="3" :sm="6">
            <a-form-item>
              <a-input
                style="width: 155px"
                placeholder="请输入发运流转单号"
                v-model="queryParam.shippingFlowSheet"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="2" :sm="4" class="flex-left">
            <div style>戴卡部件号</div>
          </a-col>
          <a-col :md="3" :sm="6">
            <a-form-item>
              <a-input placeholder="请输入戴卡部件号" v-model="queryParam.wheelShape"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="2" :sm="4" class="flex-left">
            <div style="margin-left: 50px">戴卡订单号</div>
          </a-col>
          <a-col :md="3" :sm="6">
            <a-form-item>
              <a-input
                style="width: 155px"
                placeholder="请输入戴卡订单号"
                v-model="queryParam.customerOrder"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="2" :sm="4" class="flex-left">
            <div style="margin-left: 30px">样件批次号</div>
          </a-col>
          <a-col :md="3" :sm="6">
            <a-form-item>
              <a-input style="width: 155px" placeholder="请输入样件批次号" v-model="queryParam.batchNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="2" :sm="4" class="flex-left">
            <a-button type="primary" @click="searchQuery(true)">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>-->
    <a-card
      title="发运过程指令管理"
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
        <a-button type="primary" icon="plus" @click="addShipInstruction">新增</a-button>
      </div>
      <div class="My_table jn-public-table jn-public-table-other">
        <a-table
          ref="table"
          size="middle"
          bordered
          :columns="showColumns"
          :dataSource="dataSource"
          :pagination="false"
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
          <a-space slot="batchNumber" slot-scope="text, operate, i" class="operate-row">
            <div v-html="operate.batchNumber.join('<br>')"></div>
          </a-space>
          <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
            <a-button type="link" @click="editRow(operate, i, 'check')">查看过程指令</a-button>
            <a-button type="link" @click="editRow(operate, i, 'edit')">修改</a-button>
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
  </div>
</template>

<script>
import { getOptions, getShipListinstruction, getShipinstruction } from '@api/api'
import store from '@/store/'
import { jnFilterTableMixin } from '@/mixins/jnFilterTable'

export default {
  name: 'InstructionShipList',
  mixins: [jnFilterTableMixin],
  data() {
    return {
      queryParam: {
        shippingFlowSheet: '', //发运流运单号
        wheelShape: '', // 轮型项目号
        customerOrder: '', //订单号
        batchNumber: '', //样本批次号
        userId: '',
        customerName: '', //客户名称
        planShipmentDateStart: '', //计划发运开始日期
        planShipmentDateEnd: '' //计划发运开结束日期
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
      dic: {
        // 下拉框选项
        task_status: []
      },
      planShipDate: [],
      columns: [
        // 表头

        { title: '过程指令单号', dataIndex: 'id', align: 'center' },

        {
          title: '发运流转单号',
          dataIndex: 'shippingFlowSheet',
          key: 'shippingFlowSheet',
          align: 'center',
          scopedSlots: { customRender: 'shippingFlowSheet' }
        },

        { title: '戴卡部件号', dataIndex: 'wheelShape', align: 'center' },
        { title: '戴卡订单号', dataIndex: 'customerOrder', align: 'center' },
        { title: '样件批次号', dataIndex: 'batchNumber', align: 'center',scopedSlots: { customRender: 'batchNumber' } },

        { title: '轮型尺寸', dataIndex: 'wheelShapeSize', align: 'center' },
        { title: '影响流程', dataIndex: 'influenceProcess', align: 'center' },
        {
          title: '操作',
          dataIndex: 'operate',
          width: 200,
          align: 'center',
          // fixed: 'right',
          scopedSlots: { customRender: 'operate' }
        }
      ],
      dataSource: [], // 数据

      // 关闭
      closeVisible: false, // 关闭弹窗可视化
      menuOpen: false
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
    planShipDateChange(value, dateString) {
      // 要求发货时间改变
      this.queryParam.planShipmentDateStart = dateString[0]
      this.queryParam.planShipmentDateEnd = dateString[1]
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

    getDic() {
      // 获取表单中的部分字段对应的字典
      for (let name in this.dic) {
        let searchName = this.humpOrLine(name, 'toLine')
        getOptions(searchName, '').then(data => {
          this.dic[name] = data
        })
      }
    },

    getInstructions(shipmentProcessOrderIds) {
      getShipinstruction(shipmentProcessOrderIds, this.page.currentPage, this.page.pageSize).then(data => {
        this.getDic()
        if (!data.result) {
          this.dataSource = []
        } else {
          console.log('data.result', data.result)
          for (let i = 0; i < data.result.length; i++) {
            // 遍历返回的数据列表
            for (let j = 0; j < this.dic['task_status'].length; j++) {
              if (Number(data.result[i].influenceProcess) === Number(this.dic['task_status'][j].value)) {
                // 找到value相等时对应的label
                data.result[i].influenceProcess = this.dic['task_status'][j].label
              }
            }
          }
          this.dataSource = data.result
          this.page.total = data.count
          this.page.pageNum = Math.ceil(this.page.total / this.page.pageSize)
        }
      })
    },

    addShipInstruction() {
      this.$router.push({ path: `/shipInstructionManage/instructionEditShip` })
    },

    searchQuery(reset = false) {
      // 查询信息列表 reset代表是否重置页码
      if (reset) {
        // 如果需要重置，比如有了新的筛选条件
        this.page.currentPage = 1
      }
      this.queryParam.userId = store.getters.userInfo.id

      let param = this.queryParam

      getShipListinstruction(param, this.page.currentPage, this.page.pageSize).then(data => {
        this.getDic()
        if (!data.result) {
          this.dataSource = []
        } else {
          if (data.result.records) {
            for (let i = 0; i < data.result.records.length; i++) {
              // 遍历返回的数据列表
              for (let j = 0; j < this.dic['task_status'].length; j++) {
                if (Number(data.result.records[i].influenceProcess) === Number(this.dic['task_status'][j].value)) {
                  // 找到value相等时对应的label
                  data.result.records[i].influenceProcess = this.dic['task_status'][j].label
                }
              }
            }
            this.dataSource = data.result.records
            this.page.total = data.result.total
            this.page.pageNum = data.result.pages
          }
        }
      })
    },

    editRow(row, index, type) {
      this.$router.push({
        path: `/shipInstructionManage/instructionEditShip`,
        query: {
          id: row.id,
          type: type
        }
      })
    },

    // 分页
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
        planShipmentDateEnd: '' //计划发运开结束日期
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
.ant-input {
  width: 200px;
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

/deep/ .litigationInfoListredRow {
  color: red;
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