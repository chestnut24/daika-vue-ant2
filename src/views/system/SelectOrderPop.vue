<template>
  <a-modal :visible="visible" title="选择订单" width="1100px" @cancel="handleCancel">
    <div class="search-frame">
      <a-row>
        <a-space align="center">
          <div class="left-text">
            <span style="font-size: 15px;">
              <b>订单检索:</b>
            </span>
          </div>
          <a-input v-model="searchCondition" placeholder="请输入订单号或客户名称" style="margin-left: 20px;"/>
          <a-button style="margin-left: 20px;" @click="search()" type="primary" ghost>搜索</a-button>
        </a-space>
      </a-row>
    </div>
<!--    <div class="part-title">-->
<!--      <div class="part-title_blue"></div>-->
      <div class="title-text">
        <span>
        订单信息
        </span>
        </div>
<!--    </div>-->
    <a-card class="search-table My_search_table">
      <div class="mould-frame-down jn-public-table" v-if="!(dataSource.length == 0)">
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          bordered
          :pagination="false"
          :customRow="rowClick"
        >
<!--          <a-space slot="dkOrdersNumber" slot-scope="text, operate, i" class="operate-row">-->
<!--            <a-button type="link" @click="showProjectDetail(operate, i)">{{ text }}</a-button>-->
<!--          </a-space>-->
        </a-table>
        <!--    分页-->
        <div class="bottom-page">
          <a-pagination
            class="alerm"
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
    <div style="margin-top: 16px;" v-if="isShowNoOrder">
      <div class="title-text">
        <span>无订单信息录入</span>
        </div>
      <table>
        <tr>
          <th>客户名称</th>
          <th>用途</th>
          <th>要求发货日期</th>
          <th>订单数量</th>
          <th>操作</th>
        </tr>
        <tr v-for="(row,index) in newRow">
          <td>
            <a-input v-model="row.customerName" placeholder="请输入" />
          </td>
          <td>
            <!--            <a-input v-model="row.noun" placeholder="请输入"/>-->
            <a-select placeholder="请选择" v-model="row.noun" allowClear style="width: 100px;">
              <a-select-option
                v-for="opt in dic.noun"
                :value="opt.value"
                :key="opt.id"
              >{{opt.label}}</a-select-option>
            </a-select>
          </td>
          <td>
            <a-date-picker v-model="row.deliveryDate" show-time placeholder="请选择" />
          </td>
          <td>
            <a-input v-model="row.orderNumber" placeholder="请输入" />
          </td>
          <td>
            <a @click="deleteData(index)">删除</a>
          </td>
        </tr>
      </table>
      <a-button style="width: 100%;margin-top: 10px;" icon="plus" type="primary" @click="addRow"></a-button>
      <div style="text-align: right">
        <!--        <a-button style="width: 100px;margin-top: 10px;" type="primary" >保存</a-button>-->
      </div>
    </div>
    <template #footer>
      <a-button key="back" @click="handleCancel()">取消</a-button>
      <a-button key="submit" type="primary" :disabled="isDisable" @click="handleOk">选择</a-button>
    </template>
  </a-modal>
</template>

<script>
import { getOptions, selectOrderPop, typeAdd } from '@/api/api'

export default {
  name: 'SelectOrderPop',
  mounted() {
    this.getDic(); // 获取字典
  },
  // watch: {
  //     projectNo() {
  //         if (this.projectNo != '') {
  //             this.searchCondition = this.projectNo;
  //             // this.search();
  //         }
  //     }
  // },
  props: {
    isShowNoOrder: {
      type: Boolean,
      default: true
    },
    projectNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedRowInfor: '', // 选择的行信息 由 戴卡部件号+模号+制作项目+模具制作类型 确定
      visible: false,
      highLight: '', //高亮
      dataSource: [], // 检索数组
      total: 0, // 共多少条
      pageSize: 5, // 一页多少条
      currentPage: 1, // 当前页
      pageNum: 1, // 共多少页
      jumpPage: 1, // 跳转到第几页
      columns: [
        {
          title: '戴卡订单号',
          dataIndex: 'dkOrdersNumber',
          key: 'dkOrdersNumber',
          align: 'center',
          scopedSlots: { customRender: 'dkOrdersNumber' }
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
          key: 'customerName',
          align: 'center'
        },
        {
          title: '用途',
          dataIndex: 'noun',
          key: 'noun',
          align: 'center'
        },
        {
          title: '订单时间',
          dataIndex: 'orderDate',
          key: 'orderDate',
          align: 'center'
        },
        {
          title: '要求发货日期',
          dataIndex: 'deliveryDate',
          key: 'deliveryDate',
          align: 'center'
        },
        {
          title: '订单数量',
          dataIndex: 'orderNumber',
          key: 'orderNumber',
          align: 'left'
        }
      ],

      selectOrder: {},
      searchCondition: '',
      dic: {
        // 表单中的部分数据对应的的数据词典
        noun: [] // 用途
      },
      newRow: []
    }
  },
  computed: {
    isDisable() {
      return !this.newRow.every(item => item.customerName && item.noun && item.deliveryDate && item.orderNumber)
    }
  },
  methods: {
    showProjectDetail(operate, index) {
      // this.$refs.projectInfor.getData(operate.id);
      // alert("跳转暂未开发");
      this.$router.push({ path: '/order/orderDetail', query: { id: operate.id } })
    },

    rowClick(record) {
      // 事件
      return {
        on: {
          click: () => {
            this.selectedRowInfor = this.concatProjectInfro(record)
            this.selectOrder = record
          }
        },
        style: {
          'background-color': this.concatProjectInfro(record) === this.selectedRowInfor ? '#e6f7ff' : 'white'
        }
      }
    },

    concatProjectInfro(record) {
      // 拼接项目信息 用来 确定某一行 高亮
      return record.id
    },
    add() {
      this.visible = true;
      this.searchCondition = this.projectNo;
      this.search();
    },
    handleOk() {
      if (this.newRow && this.newRow.length) {
        typeAdd(this.newRow).then(
          res => {
            if (res.success) {
              this.$emit('get-text', [this.selectOrder, ...res.result]) //拼接两个集合
              this.dataSource = []
              this.visible = false
              this.searchCondition = ''
              this.selectOrder = {}
              this.newRow = []
            } else {
              this.$message.error(`${res.message}`)
            }
          },
          error => {
            this.$message.error('选择失败')
          }
        )
      } else {
        this.$emit('get-text', [this.selectOrder])
        this.dataSource = []
        this.visible = false
        this.searchCondition = ''
        this.selectOrder = {}
      }
    },
    handleCancel() {
      this.visible = false
      this.dataSource = []
      this.searchCondition = ''
      this.selectOrder = {}
    },
    tableChange(val) {
      console.log(val)
    },
    pageChange(val) {
      // 分页改变
      // console.log(val);
      this.currentPage = val
      selectOrderPop({
        queryField: this.searchCondition,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }).then(data => {
        this.total = data.result.total
        this.currentPage = data.result.current
        this.pageSize = data.result.size
        this.pageNum = data.result.pages
        for (let i = 0; i < data.result.records.length; i++) {
          // 遍历返回的数据列表
          for (let name in data.result.records[i]) {
            // 列表每行 for 出每个属性
            if (name in this.dic) {
              // 如果该属性在字典里
              for (let j = 0; j < this.dic[name].length; j++) {
                // 遍历该字典，看看有哪些值
                if (data.result.records[i][name] === this.dic[name][j].value) {
                  // 找到value相等时对应的label
                  data.result.records[i][name] = this.dic[name][j].label
                }
              }
            }
          }
        }
        this.dataSource = data.result.records
      })
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
      selectOrderPop({
        queryField: this.searchCondition,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }).then(data => {
        this.total = data.result.total
        this.currentPage = data.result.current
        this.pageSize = data.result.size
        this.pageNum = data.result.pages
        for (let i = 0; i < data.result.records.length; i++) {
          // 遍历返回的数据列表
          for (let name in data.result.records[i]) {
            // 列表每行 for 出每个属性
            if (name in this.dic) {
              // 如果该属性在字典里
              for (let j = 0; j < this.dic[name].length; j++) {
                // 遍历该字典，看看有哪些值
                if (data.result.records[i][name] === this.dic[name][j].value) {
                  // 找到value相等时对应的label
                  data.result.records[i][name] = this.dic[name][j].label
                }
              }
            }
          }
        }
        this.dataSource = data.result.records
      })
    },
    search() {
      this.dataSource = []
      selectOrderPop({
        queryField: this.searchCondition,
        pageNo: 1,
        pageSize: this.pageSize
      }).then(data => {
        this.total = data.result.total
        this.currentPage = data.result.current
        this.pageSize = data.result.size
        this.pageNum = data.result.pages
        for (let i = 0; i < data.result.records.length; i++) {
          // 遍历返回的数据列表
          for (let name in data.result.records[i]) {
            // 列表每行 for 出每个属性
            if (name in this.dic) {
              // 如果该属性在字典里
              for (let j = 0; j < this.dic[name].length; j++) {
                // 遍历该字典，看看有哪些值
                if (data.result.records[i][name] === this.dic[name][j].value) {
                  // 找到value相等时对应的label
                  data.result.records[i][name] = this.dic[name][j].label
                }
              }
            }
          }
        }
        this.dataSource = data.result.records
      })
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
    addRow() {
      if (!this.projectNo || this.projectNo == '') {
        this.$message.error('无订单填报需要选择戴卡部件号后填报')
        return
      }
      this.newRow.push({
        customerName: null,
        noun: undefined,
        deliveryDate: null,
        orderNumber: null,
        component: this.projectNo
      })
    },
    deleteData(index) {
      this.newRow.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="less">
@import '../../css/public-table-css.less';
/deep/ .ant-modal-title {
  font-weight: bold;
}
.search-frame {
  margin-bottom: 15px;
}
.left-text {
  width: 120px;
}
.search-table {
  min-height: 300px;
}
.bottom-page {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
}
// 被选中的表格行的样式
.clickRowStyl {
  background-color: #00b4ed;
}
.ant-table-tbody > .clickRowStyl:hover > td {
  background-color: #00b4ed;
}
.alerm .rowcolor {
  color: #00b4ed;
}
.alerm .rowcolor2 {
  background: blue;
}

/*.title-text {*/
/*  padding: 6px;*/
/*  border-left: 4px solid #1790fa;*/
/*  background-color: #f4f5f7;*/
/*  font-weight: bold;*/
/*}*/
table {
  margin-top: 16px;
  border-left: 1px solid #e8e8e8;
  border-top: 1px solid #e8e8e8;
  width: 100%;
  td,
  th {
    padding: 16px;
    min-width: 100px;
    text-align: center;
    border-right: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
  }
}

.My_search_table /deep/ .ant-card-body {
  padding: 10px;
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
</style>
