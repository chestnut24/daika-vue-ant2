<template>
  <a-card>
    <a-table
      ref="table"
      size="middle"
      bordered
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
    >
      <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
        <a-button type="link" @click="editRow(operate, i, 'check')">查看过程指令</a-button>
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
  </a-card>
  
</template>

<script>
import { getOptions, getShipListinstruction, getShipinstruction } from '@api/api'
import store from '@/store/'

export default {
  name: 'instructionList',
  data() {
    return {
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
          title: '发运通知单号',
          dataIndex: 'shippingFlowSheet',
          key: 'shippingFlowSheet',
          align: 'center',
          scopedSlots: { customRender: 'shippingFlowSheet' }
        },

        { title: '轮型项目号', dataIndex: 'wheelShape', align: 'center' },
        { title: '戴卡订单号', dataIndex: 'customerOrder', align: 'center' },
        { title: '样件批次号', dataIndex: 'batchNumber', align: 'center' },

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
      getArrId: []
    }
  },

  mounted() {
    // this.getAppointOption(); // 获取下拉框
    this.getDic() // 获取字典

    // this.$nextTick(() => {
    //   this.searchQuery() // 获取列表信息
    // })
    this.getArrId = this.$route.query.shipmentProcessOrderIds
    console.log(this.getArrId)
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
          _this.searchQuery(true)
        }
      }, 500)
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
      let param = this.queryParam
      // getArrId
      getShipinstruction(this.getArrId, this.page.currentPage, this.page.pageSize).then(data => {
        // this.getDic()
        if (data.success) {
          // result - records
          // let dataList = data.result
          let dataList = data
          // if (!(dataList.records && dataList.records.length)) {
          if (!(dataList.result && dataList.result.length)) {
            this.dataSource = []
          } else {
            // for (let i = 0; i < dataList.records.length; i++) {
            for (let i = 0; i < dataList.result.length; i++) {
              // 遍历返回的数据列表
              for (let j = 0; j < this.dic['task_status'].length; j++) {
                // if (Number(dataList.records[i].influenceProcess) === Number(this.dic['task_status'][j].value)) {
                if (Number(dataList.result[i].influenceProcess) === Number(this.dic['task_status'][j].value)) {
                  // 找到value相等时对应的label
                  // dataList.records[i].influenceProcess = this.dic['task_status'][j].label
                  dataList.result[i].influenceProcess = this.dic['task_status'][j].label
                }
              }
            }
            // this.dataSource = dataList.records
            this.dataSource = dataList.result
            // this.page.total = dataList.total
            this.page.total = dataList.count
            this.page.pageNum = Math.ceil(this.page.total / this.page.pageSize)
          }
        } else {
          this.$message.error(data.message)
          // this.tableLoading = false
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
    }
  }
}
</script>

<style lang="less" scoped>
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
</style>