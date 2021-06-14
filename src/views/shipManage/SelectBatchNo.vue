<template>
  <div>
    <a-modal :visible="visible" title="选择批次号" width="1100px" @cancel="handleCancel">
      <div class="search-frame">
        <a-row>
          <a-space align="center">
            <div class="left-text">
              <span style="font-size: 15px;margin-right: 10px;">
                <b>所属轮型：{{this.projectNo}}</b>
              </span>
            </div>
            <div class="left-text">
              <span style="font-size: 15px;margin-right: 10px;">
                <b>用途：{{this.purposeLabel}}</b>
              </span>
            </div>
            <div class="left-text">
              <span style="font-size: 15px;">
                <b>批次号检索:</b>
              </span>
            </div>
            <a-input v-model="batch" placeholder="请输入批次号" style="margin-left: 20px;" />
            <a-button style="margin-left: 20px;" @click="searchBatch()" type="primary" ghost>搜索</a-button>
          </a-space>
        </a-row>
      </div>
      <div>
        <a-tabs default-active-key="1" v-model="choiceTabs" @change="callback">
          <a-tab-pane key="1" tab="从样件库查询">
            <a-card class="search-table My_search_table">
              <div class="table-frame">
                <div class="left-frame">
                  <div
                    class="mould-frame-down jn-public-table"
                    v-if="dataSourceLeft&&!(dataSourceLeft.length == 0)"
                  >
                    <a-table
                      :row-selection="rowSelection"
                      :columns="columnsLeft"
                      :data-source="dataSourceLeft"
                      bordered
                      :pagination="false"
                      :customRow="rowClick"
                    ></a-table>
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
                    </div>
                  </div>
                </div>
                <div class="right-frame">
                  <div
                    class="mould-frame-down jn-public-table"
                    v-if="dataSourceRight&&!(dataSourceRight.length == 0)"
                  >
                    <a-table
                      :dataSource="dataSourceRight"
                      :columns="columnsRight"
                      bordered
                      :pagination="false"
                    ></a-table>
                  </div>
                </div>
              </div>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="2" tab="从待发库查询" force-render>
            <a-card class="search-table-delegateLib My_search_table">
              <div class="table-frame-delegateLib">
                <div class="left-frame-delegateLib">
                  <div
                    class="mould-frame-down jn-public-table"
                    v-if="dataSourceOutgoinglibLeft&&!(dataSourceOutgoinglibLeft.length == 0)"
                  >
                    <a-table
                      :row-selection="rowSelectionOutgoingLib"
                      :columns="columnsOutgoinglibLeft"
                      :data-source="dataSourceOutgoinglibLeft"
                      bordered
                      :pagination="false"
                      :customRow="rowClickDelegateLib"
                    >
                      <a-space
                        slot="shippingFlowSheet"
                        slot-scope="text, operate, i"
                        class="operate-row"
                      >
                        <a-button type="link" @click="showFlowSheetDetail(operate, i)">{{ text }}</a-button>
                      </a-space>
                    </a-table>
                    <!--    分页-->
                    <div class="bottom-page">
                      <a-pagination
                        class="alerm"
                        :total="totalOutgoinglib"
                        :show-total="total => `共 ${totalOutgoinglib} 条`"
                        :page-size="pageSizeOutgoinglib"
                        :current="currentPageOutgoingLib"
                        @change="pageChange"
                      />
                      <div style="margin: 0 20px">共 {{pageNumOutgoinglib}} 页</div>
                    </div>
                  </div>
                </div>
                <!-- <div class="right-frame-delegateLib">
                  <div
                    class="mould-frame-down jn-public-table"
                    v-if="dataSourceOutgoinglibRight&&!(dataSourceOutgoinglibRight.length == 0)"
                  >
                    <a-table
                      :dataSource="dataSourceOutgoinglibRight"
                      :columns="columnsOutgoinglibRight"
                      bordered
                      :pagination="false"
                    ></a-table>
                  </div>
                </div> -->
              </div>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </div>
      <ship-notice-info ref="shipnoticeInfo"></ship-notice-info>
      <template #footer>
        <a-button key="back" @click="handleCancel()">取消</a-button>
        <a-button
          key="submit"
          type="primary"
          v-on:click="$emit('get-text', selectedRowsSampleLib, selectedRowsOutgoinglib )"
          @click="handleOk"
        >选择</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import ShipNoticeInfo from '../shipManage/ShipNoticeInfo'
import { getSampleLib, getSampleLocation, getOutgoinglibLocation, getOutgoinglib, getOptions } from '@api/api'

export default {
  name: 'SelectBatchNo',
  components: { ShipNoticeInfo }, //引入组件
  data() {
    return {
      selectedRowInfor: '', // 选择的行信息 由 戴卡部件号+模号+制作项目+模具制作类型 确定
      visible: false,
      // visible: true,
      highLight: '', //高亮
      dataSourceLeft: [], // 检索数组
      selectBatch: {},
      total: 0, // 共多少条
      pageSize: 5, // 一页多少条
      currentPage: 1, // 当前页
      pageNum: 1, // 共多少页
      jumpPage: 1, // 跳转到第几页
      totalOutgoinglib: 0,
      pageSizeOutgoinglib: 5,
      currentPageOutgoingLib: 1,
      pageNumOutgoinglib: 1,
      choiceTabs: '1',
      selectedRowKeys: [],
      columnsLeft: [
        {
          title: '批次号',
          dataIndex: 'batch',
          key: 'batch',
          align: 'left'
          // scopedSlots: { customRender: 'batch' },
        },
        {
          title: '库存',
          dataIndex: 'stock',
          key: 'stock',
          align: 'left'
        }
      ],
      selectedRows: [],
      selectedRowsSampleLib: [],
      selectedRowsOutgoinglib: [],
      highLightRight: '', //高亮
      dataSourceRight: [], // 检索数组
      totalRight: 0, // 共多少条
      pageSizeRight: 5, // 一页多少条
      currentPageRight: 1, // 当前页
      pageNumRight: 1, // 共多少页
      jumpPageRight: 1, // 跳转到第几页
      dataSourceOutgoinglibLeft: [],
      dataSourceOutgoinglibRight: [],
      option: {
        // 下拉选项
        purpose: [], // 用途
        noun: [],
      },
      columnsOutgoinglibLeft: [
        {
          title: '发运流转单号',
          dataIndex: 'shippingFlowSheet',
          key: 'shippingFlowSheet',
          align: 'left',
          scopedSlots: { customRender: 'shippingFlowSheet' }
        },
        {
          title: '批次号',
          dataIndex: 'batch',
          key: 'batch',
          align: 'left'
        },
        {
          title: '戴卡部件号',
          dataIndex: 'projectNo',
          key: 'projectNo',
          align: 'left'
        },
        {
          title: '用途',
          dataIndex: 'purpose',
          key: 'purpose',
          align: 'left'
        },
        {
          title: '项目经理',
          dataIndex: 'projectManager',
          key: 'projectManager',
          align: 'left'
        },
        {
          title: '待发库存',
          dataIndex: 'needSendNum',
          key: 'needSendNum',
          align: 'left'
        }
      ],
      columnsOutgoinglibRight: [
        {
          title: '工厂仓库',
          dataIndex: 'factoryWareHouse',
          key: 'factoryWareHouse',
          align: 'left'
        },
        {
          title: '库存',
          dataIndex: 'needSendNum',
          key: 'needSendNum',
          align: 'left'
        }
      ],
      columnsRight: [
        {
          title: '所在仓库',
          // factoryWareHouse
          dataIndex: 'factoryWareHouse_dictText',
          key: 'factoryWareHouse_dictText',
          align: 'left'
          // scopedSlots: { customRender: 'batch' },
        },
        {
          title: '库位',
          dataIndex: 'inventoryLocation',
          key: 'inventoryLocation',
          align: 'left'
        },
        {
          title: '样件位置',
          dataIndex: 'exemplarLocation',
          key: 'exemplarLocation',
          align: 'left'
        }
      ],
      batch: ''
    }
  },
  props: ['projectNo', 'purpose', 'purposeLabel'],
  computed: {
    rowSelection() {
      // this.selectedRows = [];
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          this.selectedRowsSampleLib = selectedRows
          for (let i = 0; i < this.selectedRowsSampleLib.length; i++) {
            this.selectedRowsSampleLib[i].batchType = '0'
          }
        }
      }
    },
    rowSelectionOutgoingLib() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRowKeys)

          this.selectedRowsOutgoinglib = selectedRows
          for (let i = 0; i < this.selectedRowsOutgoinglib.length; i++) {
            this.selectedRowsOutgoinglib[i].batchType = '1'
          }
        }
      }
    }
  },
  mounted() {
    this.selectedRows = []
    this.getDic()
  },
  methods: {
    getDic() {
      // 获取表单中的部分字段对应的字典
      for (let name in this.option) {
        getOptions(name, '').then(data => {
          this.option[name] = data
        })
      }
    },
    showFlowSheetDetail(operate, index) {
      this.$refs.shipnoticeInfo.getShipData(operate.shippingFlowSheet)
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    callback(key) {
      console.log(key)
    },

    rowClick(record) {
      // 事件
      return {
        on: {
          click: () => {
            this.selectedRowInfor = record
            this.selectBatch = record
            this.dataSourceRight = []
            getSampleLocation({
              batch: record.batch
              // pageNO: 1,
              // pageSize: this.pageSizeRight
            }).then(data => {
              this.dataSourceRight = data.result
            })
          }
        },
        style: {
          'background-color': record === this.selectedRowInfor ? '#e6f7ff' : 'white'
        }
      }
    },

    rowClickDelegateLib(record) {
      // 事件
      return {
        on: {
          click: () => {
            this.selectedRowInfor = record
            this.selectBatch = record
            // this.dataSourceRight = [];
            this.dataSourceOutgoinglibRight = []
            getOutgoinglibLocation({
              batch: record.batch
            }).then(data => {
              this.dataSourceOutgoinglibRight = data.result
            })
          }
        },
        style: {
          'background-color': record === this.selectedRowInfor ? '#e6f7ff' : 'white'
        }
      }
    },

    add() {
      this.visible = true
      this.selectedRows = []
    },
    handleOk() {
      this.dataSourceLeft = []
      this.dataSourceRight = []
      this.dataSourceOutgoinglibLeft = []
      this.dataSourceOutgoinglibRight = []
      this.selectedRowsOutgoinglib = []
      this.selectedRowsSampleLib = []
      this.visible = false
      this.batch = ''
      this.selectBatch = {}
    },
    handleCancel() {
      this.visible = false
      this.dataSourceLeft = []
      this.dataSourceRight = []
      this.dataSourceOutgoinglibLeft = []
      this.dataSourceOutgoinglibRight = []
      // this.selectedRowsOutgoinglib = [];
      // this.selectedRowsSampleLib = [];
      this.batch = ''
      this.selectBatch = {}
    },
    tableChange(val) {
      console.log(val)
    },
    pageChange(val) {
      // 分页改变
      this.currentPage = val
      getSampleLib({
        batch: this.batch,
        projectNo: this.projectNo,
        purpose: this.purpose,
        pageNO: this.currentPage,
        pageSize: this.pageSize
      }).then(data => {
        if (data) {
          this.total = data.result.total
          this.currentPage = data.result.current
          this.pageSize = data.result.size
          this.pageNum = data.result.pages
          this.dataSourceLeft = data.result.records
        }
      })
    },
    pageChangeOutgoinglib(val) {
      // 分页改变
      this.currentPageOutgoinglib = val
      getOutgoinglib({
        batch: this.batch,
        projectNo: this.projectNo,
        purpose: this.purpose,
        pageNO: this.currentPage,
        pageSize: this.pageSize
      }).then(data => {
        if (data) {
          this.totalOutgoinglib = data.result.total
          this.currentPageOutgoinglib = data.result.current
          this.pageSizeOutgoinglib = data.result.size
          this.pageNumOutgoinglib = data.result.pages
          this.dataSourceOutgoinglibLeft = data.result.records
          for (let i = 0; i < this.dataSourceOutgoinglibLeft.length; i++) {
            for (let j = 0; j < this.option['noun'].length; j++) {
              if (Number(this.dataSourceOutgoinglibLeft[i].purpose) === Number(this.option['noun'][j].value)) {
                // 找到value相等时对应的label
                this.dataSourceOutgoinglibLeft[i].purpose = this.option['noun'][j].label
              }
            }
          }
        }
      })
    },
    searchBatch() {
      if (this.choiceTabs == '1') {
        this.search()
      } else if (this.choiceTabs == '2') {
        this.searchOutgoinglib()
      }
    },
    search() {
      this.dataSourceLeft = []
      this.dataSourceRight = []
      // this.selectedRows = [];
      if (this.projectNo) {
        getSampleLib({
          batch: this.batch,
          projectNo: this.projectNo,
          purpose: this.purpose,
          pageNO: 1,
          pageSize: this.pageSize
        }).then(data => {
          this.total = data.result.total
          this.currentPage = data.result.current
          this.pageSize = data.result.size
          this.pageNum = data.result.pages
          this.dataSourceLeft = data.result.records
        })
      } else {
        this.$message.error('请选择戴卡部件号')
      }
    },
    searchOutgoinglib() {
      this.dataSourceOutgoinglibLeft = []
      this.dataSourceOutgoinglibRight = []
      if (this.projectNo) {
        getOutgoinglib({
          batch: this.batch,
          projectNo: this.projectNo,
          purpose: this.purpose,
          pageNO: 1,
          pageSize: this.pageSize
        }).then(data => {
          this.totalOutgoinglib = data.result.total
          this.currentPageOutgoinglib = data.result.current
          this.pageSizeOutgoinglib = data.result.size
          this.pageNumOutgoinglib = data.result.pages
          this.dataSourceOutgoinglibLeft = data.result.records
          for (let i = 0; i < this.dataSourceOutgoinglibLeft.length; i++) {
            for (let j = 0; j < this.option['noun'].length; j++) {
              if (Number(this.dataSourceOutgoinglibLeft[i].purpose) === Number(this.option['noun'][j].value)) {
                // 找到value相等时对应的label
                this.dataSourceOutgoinglibLeft[i].purpose = this.option['noun'][j].label
              }
            }
          }
        })
      } else {
        this.$message.error('请选择戴卡部件号')
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '../../css/public-table-css.less';
.table-frame {
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  width: 100%;
}
.left-frame {
  width: 45%;
  /*height: 200px;*/
  /*border-width:0 3px 0 0;*/
  /*border-style: solid;*/
  /*border-color: #aaa;*/
  padding: 0 10px;
}
.right-frame {
  width: 55%;
  padding: 0 10px;
}
.bottom-page {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
}
.table-frame-delegateLib {
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  width: 100%;
}
.left-frame-delegateLib {
  width: 100%;
  /*height: 200px;*/
  /*border-width:0 3px 0 0;*/
  /*border-style: solid;*/
  /*border-color: #aaa;*/
  padding: 0 10px;
}
.search-table {
  min-height: 300px;
}
.search-table-delegateLib {
  min-height: 300px;
}
.right-frame-delegateLib {
  width: 30%;
  padding: 0 10px;
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