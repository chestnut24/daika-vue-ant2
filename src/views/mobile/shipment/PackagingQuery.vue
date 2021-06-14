<template>
  <div class="app_page_main">
    <div class="app_banner1">
      <div class="app_ban1_tabs">
        <div
          class="app_ban1_tab_pane"
          :class="app_banner1_tabs_key === 1?'':'app_ban1_tab_pane_noc'"
          @click="changeTabs(1)"
        >包装主材查询</div>
        <div
          class="app_ban1_tab_pane"
          :class="app_banner1_tabs_key === 2?'':'app_ban1_tab_pane_noc'"
          @click="changeTabs(2)"
        >包装辅材查询</div>
      </div>
    </div>
    <div class="app_banner2" v-if="app_banner1_tabs_key === 2">
      <!-- 辅料 -->
      <div class="fu_liao_body">
        <div class="flb_ban1">
          <img class="flb_ban1_1" src="../../../assets/mobile/shipment_app/head_icon_03.png" />
          <div class="flb_ban1_2">辅料清单</div>
        </div>
        <div class="flb_ban2">
          <img class="flb_ban2_img" src="../../../assets/mobile/shipment_app/head_tiao_01.png" />
        </div>
        <div class="flb_ban3">
          <!-- 表格 -->
          <table class="table_1">
            <tr>
              <td class="w_50" style="background: #F5F8FA;">辅料</td>
              <td class="w_50" style="background: #F5F8FA;">数量</td>
            </tr>
            <tr>
              <td class="w_50">装配件</td>
              <td class="w_50 text_l">
                {{dataSource_fu.assemblyPartsNumbers}}
                <a
                  style="margin-left: 15px;"
                  @click="fu_look(1)"
                >
                  详情
                  <a-icon type="right" />
                </a>
              </td>
            </tr>
            <tr>
              <td class="w_50">插件</td>
              <td class="w_50 text_l">
                {{dataSource_fu.plugInNumbers}}
                <a style="margin-left: 15px;" @click="fu_look(2)">
                  详情
                  <a-icon type="right" />
                </a>
              </td>
            </tr>
            <tr>
              <td class="w_50">钢套</td>
              <td class="w_50 text_l">
                {{dataSource_fu.steelSleeveNumbers}}
                <a
                  style="margin-left: 15px;"
                  @click="fu_look(3)"
                >
                  详情
                  <a-icon type="right" />
                </a>
              </td>
            </tr>
            <tr>
              <td class="w_50">工装</td>
              <td class="w_50 text_l">
                {{dataSource_fu.workClothesNumbers}}
                <a
                  style="margin-left: 15px;"
                  @click="fu_look(4)"
                >
                  详情
                  <a-icon type="right" />
                </a>
              </td>
            </tr>
            <tr>
              <td class="w_50">辅材</td>
              <td class="w_50 text_l">
                {{dataSource_fu.auxiliaryMaterialsNumbers}}
                <a
                  style="margin-left: 15px;"
                  @click="fu_look(5)"
                >
                  详情
                  <a-icon type="right" />
                </a>
              </td>
            </tr>
            <tr>
              <td class="w_50">条码</td>
              <td class="w_50 text_l">
                {{dataSource_fu.barCodeNumbers}}
                <a style="margin-left: 15px;" @click="fu_look(6)">
                  详情
                  <a-icon type="right" />
                </a>
              </td>
            </tr>
            <tr>
              <td class="w_50">标签</td>
              <td class="w_50 text_l">
                {{dataSource_fu.tagNumbers}}
                <a style="margin-left: 15px;" @click="fu_look(7)">
                  详情
                  <a-icon type="right" />
                </a>
              </td>
            </tr>
            <tr>
              <td class="w_50">报告</td>
              <td class="w_50 text_l">
                {{dataSource_fu.reportNumbers}}
                <a style="margin-left: 15px;" @click="fu_look(8)">
                  详情
                  <a-icon type="right" />
                </a>
              </td>
            </tr>
            <tr>
              <td class="w_50">其他</td>
              <td class="w_50 text_l">
                {{dataSource_fu.otherNumbers}}
                <a style="margin-left: 15px;" @click="fu_look(9)">
                  详情
                  <a-icon type="right" />
                </a>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="app_banner2" v-if="app_banner1_tabs_key === 1">
      <div>
        <div
          v-infinite-scroll="handleInfiniteOnLoad"
          class="demo-infinite-container"
          :infinite-scroll-disabled="t_busy"
          :infinite-scroll-distance="10"
        >
          <div
            class="app_ban2_list_item app_ban2_list_item_m0"
            :class="index === dataSource.length -1?'':'aban2_list_item_bb'"
            v-for="(item,index) in dataSource"
            :key="index"
          >
            <div class="fu_liao_body">
              <div class="flb_ban1">
                <img class="flb_ban1_1" src="../../../assets/mobile/shipment_app/head_icon_03.png" />
                <div class="flb_ban1_2">{{item.packagingTransportationMode_L}}</div>
              </div>
              <div class="flb_ban2">
                <img
                  class="flb_ban2_img"
                  src="../../../assets/mobile/shipment_app/head_tiao_01.png"
                />
              </div>
              <div class="flb_ban3">
                <!-- 表格 -->
                <table class="table_1">
                  <tr>
                    <td class="w_50" style="background: #F5F8FA;">尺寸</td>
                    <td class="w_50" style="background: #F5F8FA;">数量</td>
                  </tr>
                  <tr>
                    <td class="w_50">{{item.wheelShapeSize}}</td>
                    <td class="w_50">{{item.sendSampleNumbers}}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div
            v-if="dataSource_j.length === total_j"
            class="demo-loading-container demo-loading-container2"
          >已加载全部数据</div>
          <div v-if="t_loading && !t_busy" class="demo-loading-container">
            <a-spin />
          </div>
        </div>
      </div>
    </div>
    <div class="dialog">
      <!-- dialog_look -->
      <a-modal
        :visible="dialog_look"
        :footer="null"
        :closable="false"
        width="92%"
        dialogClass="dialog_1"
      >
        <div class="dialog_look_body">
          <div class="dialog_look_body_ban1">
            <div class="banner1 ban_title">
              <div class="banner1_1"></div>
              <div class="banner1_2">项目信息</div>
            </div>
          </div>
          <div class="dialog_look_body_ban2">
            <!-- 加入滚动加载 -->
            <div
              v-infinite-scroll="handleInfiniteOnLoad_dialog"
              class="demo-infinite-container demo-infinite-container2"
              :infinite-scroll-disabled="t_busy"
              :infinite-scroll-distance="10"
            >
              <div
                class="app_ban2_list_item"
                :class="index === dataSource_dialog.length -1?'':'aban2_list_item_bb'"
                v-for="(item,index) in dataSource_dialog"
                :key="index"
              >
                <div class="dlb_ban2_body">
                  <div class="flb_ban1 dlb_ban2_body_bb">
                    <div class="flb_ban1 dlb_ban2_body_bb1">
                      <img class="flb_ban1_1" src="../../../assets/mobile/shipment_app/list_03.png" />
                      <div class="flb_ban1_2">{{item.shippingFlowSheet}}</div>
                    </div>
                    <div class="flb_ban1 dlb_ban2_body_bb3">
                      <div class="flb_ban1_3">数量:</div>
                      <div class="flb_ban1_4">{{item.auxiliaryNumber}}</div>
                    </div>
                  </div>
                  <div class="flb_ban3">{{item.auxiliaryMark}}</div>
                </div>
              </div>
              <div
                v-if="dataSource_dialog.length === total_dia"
                class="demo-loading-container demo-loading-container2"
              >已加载全部数据</div>
              <div v-if="t_loading && !t_busy" class="demo-loading-container">
                <a-spin />
              </div>
            </div>
          </div>
          <div class="dialog_look_body_ban3">
            <a-button type="primary" size="large" @click="dialog_look = false">关闭</a-button>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import store from '@/store/'

import viewDetails from './viewDetails'
import listItem from './component/list_item'

import {
  getOptions,
  getShipTaskMsgById,
  getShipTaskList,
  getShipTaskListUrgnt,
  editShipTaskaccept,
  editShipTaskaccepts,
  editShipTaskmatter,
  editShipTaskLogistics,
  editShipTaskpacking,
  editShipTaskRetask,
  editShipTaskTakeGoods,
  BZpageShipAll_fu,
  BZpageShipById,
  getBZpageShipIds,
  BZpageShipAll_zhu
} from '@/api/api'
export default {
  name: 'ShipTaskList',
  data() {
    return {
      dic: {
        // 表单中的部分数据对应的的数据词典
        packagingTransportationMode: [] // 计划状态
      },

      total: 0, // 共多少条
      pageSize: 5, // 一页多少条
      pageNum: 1, // 共多少页
      jumpPage: 1, // 跳转到第几页
      currentPage: 1, // 当前页
      total_j: 0, // 共多少条
      pageSize_j: 5, // 一页多少条
      pageNum_j: 1, // 共多少页
      jumpPage_j: 1, // 跳转到第几页
      currentPage_j: 1, // 当前页
      tableLoading: false,

      dataSource: [], //表格数据
      dataSource_j: [], //表格数据
      rowSelection_list: [],
      rowSelection_key: [],
      pageStatus: 0,
      fiveMinClear: null,

      // 滚动加载
      data: [],
      t_loading: false,
      t_busy: false,
      app_banner1_tabs_key: 1,
      status_key: 1,
      dataSource_fu: {
        assemblyPartsNumbers: 0,
        auxiliaryMaterialsNumbers: 0,
        barCodeNumbers: 0,
        otherNumbers: 0,
        plugInNumbers: 0,
        reportNumbers: 0,
        steelSleeveNumbers: 0,
        tagNumbers: 0,
        workClothesNumbers: 0
      },
      pageNo_dia: 1,
      pageSize_dia: 10,
      dialog_look: false,
      dataSource_dialog: [],
      total_dia: 0,
      pageNum_dia: 1,
      // 辅材ids
      idList: [],
      dialog_look_type: 1
    }
  },
  components: {
    viewDetails,
    listItem
  },
  //初始化
  mounted() {
    this.getDic() // 获取字典
    var userId = store.getters.userInfo.id
    // this.getList()
  },
  beforeDestroy() {
    if (this.fiveMinClear) {
      clearTimeout(this.fiveMinClear)
    }
  },
  methods: {
    // 查询列表
    getList_zhu(reset = false) {
      this.tableLoading = true
      if (reset) {
        // 如果需要重置，比如有了新的筛选条件
        this.currentPage = 1
      }
      BZpageShipAll_zhu({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }).then(data => {
        if (data.success) {
          let dataList = data.result
          if (!(dataList.records && dataList.records.length)) {
            this.dataSource = []
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
            console.log('主材', this.dataSource)
          }
        } else {
          this.$message.error(data.message)
          this.tableLoading = false
        }
      })
    },
    getList_fu(reset = false) {
      this.tableLoading = true
      BZpageShipAll_fu().then(data => {
        // if (data && data.assemblyPartsNumbers  ) {
        this.dataSource_fu = {
          assemblyPartsNumbers: data.assemblyPartsNumbers ? data.assemblyPartsNumbers : 0,
          auxiliaryMaterialsNumbers: data.auxiliaryMaterialsNumbers ? data.auxiliaryMaterialsNumbers : 0,
          barCodeNumbers: data.barCodeNumbers ? data.barCodeNumbers : 0,
          otherNumbers: data.otherNumbers ? data.otherNumbers : 0,
          plugInNumbers: data.plugInNumbers ? data.plugInNumbers : 0,
          reportNumbers: data.reportNumbers ? data.reportNumbers : 0,
          steelSleeveNumbers: data.steelSleeveNumbers ? data.steelSleeveNumbers : 0,
          tagNumbers: data.tagNumbers ? data.tagNumbers : 0,
          workClothesNumbers: data.workClothesNumbers ? data.workClothesNumbers : 0
        }
        // }

        this.tableLoading = false
      })
      getBZpageShipIds().then(data => {
        console.log('ids', data)
        this.idList = data || []
      })
    },
    resertGetList() {
      this.searchParams = {
        //
        shippingFlowSheet: '', // 发运流转单号
        wheelShape: '', // 轮型号
        customerOrder: '', // 戴卡订单号
        batchNumber: '', // 样件批次号
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
    getPageNumber_j(number) {
      if (this.pageSize_j >= number) {
        return 1
      } else {
        let a = number / this.pageSize_j
        // 向上取整
        return Math.ceil(a)
      }
    },
    // 分页
    pageChange_j(val) {
      // 分页改变
      this.currentPage_j = val
      this.getList_j()
    },
    pageJump_j(page) {
      // 点击指定分页跳转的情况下
      if (page > this.pageNum_j) {
        page = this.pageNum_j
        this.jumpPage_j = this.pageNum_j
      } else if (page < 1) {
        page = 1
        this.jumpPage_j = 1
      }
      this.currentPagev = page
      this.getList_j()
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
          _this.getList_zhu(true)
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
    rowSelectiOnSelect(selectedRowKeys) {
      this.rowSelection_list = []
      this.rowSelection_key = []
      this.rowSelection_key = selectedRowKeys
      selectedRowKeys.forEach(item => {
        this.rowSelection_list.push(this.dataSource[item])
      })
    },
    resertSevent() {
      this.rowSelection_list = []
      this.rowSelection_key = []
    },
    getList_j(reset = false) {
      // this.tableLoading = true
      if (reset) {
        // 如果需要重置，比如有了新的筛选条件
        this.currentPage_j = 1
      }
      let param = {
        pageNo: this.currentPage_j,
        pageSize: this.pageSize_j
      }
      getShipTaskListUrgnt(param).then(data => {
        console.log('紧急任务', data)
        if (data.success) {
          let dataList = data.result
          if (!(dataList.records && dataList.records.length)) {
            this.dataSource_j = []
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
            this.dataSource_j = dataList.records
            this.total_j = dataList.total
            this.pageNum_j = this.getPageNumber(dataList.total)
            this.tableLoading = false
            if (this.dataSource_j.length) {
              // 打开弹窗
              this.JinJidialog = true
            }
          }
        } else {
          this.$message.error(data.message)
        }
      })
    },
    handleInfiniteOnLoad(reset = false) {
      if (reset) {
        // 如果需要重置，比如有了新的筛选条件
        this.currentPage = 1
        this.dataSource = []
        this.total = 0
        this.pageNum = 1
      }
      const data = this.dataSource
      if (data.length !== 0) {
        if (data.length >= this.total) {
          this.t_busy = false
          this.t_loading = false
          return
        }
      }
      this.t_busy = true
      this.t_loading = true
      BZpageShipAll_zhu({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }).then(data => {
        if (data.success) {
          let dataList = data.result
          if (!(dataList.records && dataList.records.length)) {
            this.dataSource = []
            this.t_loading = false
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
            this.total = dataList.total
            this.pageNum = this.getPageNumber(dataList.total)
            if (this.currentPage >= this.pageNum) {
              this.dataSource = [...this.dataSource, ...dataList.records]
              this.t_loading = false
              return false
            } else {
              this.dataSource = [...this.dataSource, ...dataList.records]
              this.currentPage++
              this.t_loading = false
            }
          }
        } else {
          this.$message.error(data.message)
          this.t_loading = false
        }
      })
      this.t_busy = false
    },
    // 开始写方法第一行开始的
    changeTabs(type) {
      console.log(type)
      if (this.app_banner1_tabs_key === type) {
        // 暂无操作
      } else {
        this.app_banner1_tabs_key = type
        // 加载对应接口
        if (type === 1) {
          this.getList_zhu(true)
        } else if (type === 2) {
          this.getList_fu(true)
        }
      }
    },
    downPlan() {
      this.$router.push({
        path: `/app/shipment/viewDetails`,
        query: data
      })
    },
    handleMenuClick(data) {
      console.log(data)
      this.status_key = data.key
      // 1.赋值，2.请求接口
      if (this.app_banner1_tabs_key === 1) {
        this.handleInfiniteOnLoad_j(true)
      } else if (this.app_banner1_tabs_key === 2) {
        this.handleInfiniteOnLoad(true)
      }
    },
    fu_look(data1) {
      this.dialog_look = false
      this.getLookDialog(data1, this.idList)
    },
    getLookDialog(type, ids) {
      this.dialog_look_type = type
      BZpageShipById(
        {
          auxiliaryType: type,
          shipmentManagementIds: ids
        },
        {
          pageNo: this.pageNo_dia,
          pageSize: this.pageSize_dia
        }
      ).then(data => {
        if (data && data.success) {
          // 有了在看
          let dataList = data.result
          this.dataSource_dialog = dataList.records
          this.total_dia = dataList.total
          this.pageNum_dia = this.getPageNumber(dataList.total)

          this.dialog_look = true
        } else {
          this.$message.error('暂无数据')
        }
      })
    },
    handleInfiniteOnLoad_dialog(reset = false) {
      if (reset) {
        // 如果需要重置，比如有了新的筛选条件
        this.pageNo_dia = 1
        this.dataSource_dialog = []
        this.total_dia = 0
        this.pageNum_dia = 1
      }
      const data = this.dataSource_dialog
      if (data.length !== 0) {
        if (data.length >= this.total_dia) {
          this.t_busy = false
          this.t_loading = false
          return
        }
      }
      this.t_busy = true
      this.t_loading = true
      BZpageShipById(
        {
          auxiliaryType: this.dialog_look_type,
          shipmentManagementIds: this.idList
        },
        {
          pageNo: this.pageNo_dia,
          pageSize: this.pageSize_dia
        }
      ).then(data => {
        if (data.success) {
          let dataList = data.result
          if (!(dataList.records && dataList.records.length)) {
            this.dataSource_dialog = []
            this.t_loading = false
          } else {
            // 数据处理
            this.total_dia = dataList.total
            this.pageNum_dia = this.getPageNumber(dataList.total)
            if (this.pageNo_dia >= this.pageNum_dia) {
              this.dataSource_dialog = [...this.dataSource_dialog, ...dataList.records]
              this.t_loading = false
              return false
            } else {
              this.dataSource_dialog = [...this.dataSource_dialog, ...dataList.records]
              this.pageNo_dia++
              this.t_loading = false
            }
          }
        } else {
          this.$message.error(data.message)
          this.t_loading = false
        }
      })
      this.t_busy = false
    }
  }
}
</script>

<style scoped>
.app_banner1 {
  width: 100%;
  padding: 10px 15px;
  background: #fff;
}
.bg_daise {
  background: #e9f1f6;
}

.app_ban1_tabs {
  background: #e9f1f6;
  border-radius: 8px;
  display: flex;
  width: 100%;
  padding: 3px;
  box-sizing: border-box;
}
.app_ban1_tabs .app_ban1_tab_pane {
  width: 50%;
  background: #2a7bf1;
  color: #fff;
  padding: 6px 0;
  text-align: center;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
}
.app_ban1_tabs .app_ban1_tab_pane_noc {
  width: 50%;
  background: #e9f1f6;
  color: #2a7bf1;
  padding: 6px 0;
  text-align: center;
  border-radius: 8px;
  font-size: 16px;
}

.app_ban1_seach /deep/ .ant-input {
  border: 1px solid #e9f1f6;
}
.app_ban1_seach /deep/ .ant-input-affix-wrapper .ant-input:not(:first-child) {
  padding-left: 50px;
}
.app_ban1_seach /deep/ .ant-btn-primary {
  border-color: #e9f1f6;
  background-color: #2a7bf1;
}
.app_ban1_seach {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}

.app_banner2 {
  width: 100%;
  background: #e9f1f6;
  padding: 15px;
}
.app_ban2_list_item {
  background: #fff;
  border-radius: 6px;
  margin: 0 15px;
}
.app_ban2_list_item_m0 {
  margin: 0;
}
.aban2_list_item_bb {
  margin-bottom: 15px;
}

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
.bottom-page {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  align-items: center;
}
.table-frame {
  margin-top: 20px;
}
.item-button {
  margin-right: 20px;
}
.banner3 {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}
.demo-loading-container {
  width: 100%;
  text-align: center;
}
.demo-loading-container2 {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.4);
}
.demo-infinite-container {
  overflow: auto;
  height: 500px;
}
.demo-infinite-container2 {
  overflow: auto;
  height: 335px;
}
.banner3 {
  background: #fff;
  text-align: center;
  position: fixed;
  bottom: 55px;
  left: 0;
  width: 100%;
  padding: 20px 0;
  padding-top: 0;
}
.page_btn {
  width: 86%;
}
.my_page_btn /deep/ .ant-btn {
  height: auto;
  padding: 10px 0;
  font-size: 16px;
}
.banner3_dianjiao {
  width: 100%;
  height: 71px;
}

.fu_liao_body {
  background: #fff;
  border-radius: 8px;
}
.flb_ban1 {
  display: flex;
  align-items: center;
  padding: 15px;
  color: #000;
  font-weight: 600;
  font-size: 16px;
  padding-bottom: 8px;
}
.flb_ban1_1 {
  width: 24px;
  margin-right: 8px;
}
.flb_ban2_img {
  width: 100%;
  display: block;
}
table {
  border-collapse: collapse;
  width: 100%;
}
.table_1 {
  table-layout: fixed;
}

th,
td {
  border: 1px solid #e8e8e8;
  word-break: break-all;
  word-wrap: break-word;
}
th {
  border-top: 0;
}
th,
td {
  padding: 8px 0;
  text-align: center;
}
.flb_ban3 {
  padding: 15px;
  padding-top: 8px;
}
.text_l {
  text-align: right;
  padding: 8px 20px;
}
.dialog_1 /deep/ .ant-modal-body {
  padding: 0;
}
.dialog_look_body {
  width: calc(100% + 48px);
  margin: -24px;
  background: #e9f1f6;
  border-radius: 4px;
}
.banner1 {
  padding: 8px 15px;
  display: flex;
  justify-content: flex-start;
  align-content: center;
}
.banner1_1 {
  width: 3px;
  height: 19px;
  border-radius: 1.5px;
  background: #317ff2;
  margin-right: 10px;
  margin-top: 3px;
}
.banner1_2 {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}
.dialog_look_body_ban1 {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  border-radius: 4px 4px 0 0;
}
.dialog_look_body_ban2 {
  padding: 15px 0;
}
.dialog_look_body_ban3 {
  padding: 15px;
  padding-bottom: 20px;
  text-align: center;
}
.dlb_ban2_tip {
  color: rgba(0, 0, 0, 0.4);
  text-align: center;
}
.dlb_ban2_body {
  border-radius: 6px;
  background: #fff;
  margin-bottom: 15px;
}
.dlb_ban2_body_bb {
  border-bottom: 1px solid #e8e8e8;
  justify-content: space-between;
  padding: 0;
  color: #000;
  font-weight: 600;
  font-size: 16px;
  padding-bottom: 0;
}
.dlb_ban2_body_bb1 {
  padding-right: 0px;
  padding-bottom: 15px;
}
.dlb_ban2_body_bb3 {
  padding: 0;
  font-size: 16px;
  padding-right: 10px;
}
</style>