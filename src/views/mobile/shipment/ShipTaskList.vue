<template>
  <div class="app_page_main">
    <div class="app_banner1">
      <div class="app_ban1_tabs">
        <div
          class="app_ban1_tab_pane"
          :class="urgentTaskStatus_key === 1?'':'app_ban1_tab_pane_noc'"
          @click="changeTabs(1)"
        >紧急任务</div>
        <div
          class="app_ban1_tab_pane"
          :class="urgentTaskStatus_key === 0?'':'app_ban1_tab_pane_noc'"
          @click="changeTabs(0)"
        >普通任务</div>
      </div>
    </div>
    <div class="app_banner1 bg_daise">
      <div class="app_ban1_seach" v-if="app_banner1_tabs_key === 2">
        <a-input-search
          size="large"
          v-model="searchParams.wheelShape"
          placeholder="请输入戴卡部件号"
          @search="search()"
        >
          <a-icon style="font-size: 20px;color: #fff;" slot="prefix" type="search" />
        </a-input-search>
        <a-dropdown>
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item v-for="item in button_list" :key="item.status" :disabled="!(item.value)">{{item.title}}</a-menu-item>
            <!-- <a-menu-item :key="2">复查任务</a-menu-item>
            <a-menu-item :key="3">包装确认</a-menu-item>
            <a-menu-item :key="4">物流信息维护</a-menu-item> -->
          </a-menu>
          <a-button style="margin-left: 8px" type="primary" size="large">
            {{{0:'任务接收',2:'复查任务',3:'包装确认',5:'物流信息维护'}[status_key]}}
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
    </div>
    <div class="app_banner2" v-if="app_banner1_tabs_key === 2">
      <div>
        <div
         :style="'height: '+(page_height-141)+'px;'"
          v-infinite-scroll="handleInfiniteOnLoad"
          class="demo-infinite-container"
          :infinite-scroll-disabled="t_busy"
          :infinite-scroll-distance="10"
        >
          <div
            class="app_ban2_list_item"
            :class="index === dataSource.length -1?'':'aban2_list_item_bb'"
            v-for="(item,index) in dataSource"
            :key="index"
            @click="goRouter(item, index)"
          >
            <list-item :matterData="item"></list-item>
            <!-- index:{{index}},id:{{item.shipmentManagementId}} -->
          </div>
          <div
            v-if="dataSource.length === total"
            class="demo-loading-container demo-loading-container2"
          >已加载全部数据</div>
          <div v-if="t_loading && !t_busy" class="demo-loading-container">
            <a-spin />
          </div>
        </div>
      </div>
    </div>
    <div class="app_banner2" v-if="app_banner1_tabs_key === 1">
      <div>
        <div
          v-infinite-scroll="handleInfiniteOnLoad_j"
          class="demo-infinite-container"
          :infinite-scroll-disabled="t_busy"
          :infinite-scroll-distance="10"
        >
          <div
            class="app_ban2_list_item"
            :class="index === dataSource_j.length -1?'':'aban2_list_item_bb'"
            v-for="(item,index) in dataSource_j"
            :key="index"
            @click="goRouter(item, index)"
          >
            <list-item :matterData="item"></list-item>
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
    <div class="app_banner3 banner3 my_page_btn">
      <a-button class="page_btn" type="primary" @click="downPlan">包装物料查询</a-button>
    </div>
    <div class="banner3_dianjiao"></div>
    <div class="dialog">
      <!-- reviewTimeDialog -->
      <a-modal v-model="deliveryVisible" title="发运物料确认" :footer="null" width="800px">
        <div v-if="deliveryVisible">
          <wuliao-dialog :id="deliverychoose_id" @close="closeTimeMsg" :iShow="false"></wuliao-dialog>
        </div>
      </a-modal>
      <!-- checkOutDialog 出库进度查询-->
      <a-modal v-model="deliveryVisible3" title="出库进度查询" :footer="null" width="1200px">
        <div v-if="deliveryVisible3">
          <check-out-dialog
            :id="deliverychoose_id"
            @close="deliveryVisible3 = false,deliverychoose_id = null"
          ></check-out-dialog>
        </div>
      </a-modal>
      <!-- fuchaDialog - 复查任务 -->
      <a-modal v-model="deliveryVisible4" title="复查任务" :footer="null" width="800px">
        <div v-if="deliveryVisible4">
          <fucha-dialog :id="deliverychoose_id" @close="closeTimeMsg4" :iShow="false"></fucha-dialog>
        </div>
      </a-modal>
      <!-- signApproveDialog 发运流转单任务异议签批审核-->
      <a-modal v-model="deliveryVisible5" title="发运流转单任务异议签批审核" :footer="null" width="800px">
        <div v-if="deliveryVisible5">
          <sign-approve-dialog
            :id="deliverychoose_id"
            @close="deliveryVisible5 = false,deliverychoose_id = null"
            isShow
          ></sign-approve-dialog>
        </div>
      </a-modal>
      <!-- baozhuangDialog - 包装确认 -->
      <a-modal v-model="deliveryVisible6" title="包装确认" :footer="null" width="800px">
        <div v-if="deliveryVisible6">
          <baozhuang-dialog :id="deliverychoose_id" @close="closeTimeMsg6" :iShow="false"></baozhuang-dialog>
        </div>
      </a-modal>
      <!-- baozhuangDialog - 包装确认 -->
      <a-modal v-model="deliveryVisible7" title="物流信息维护" :footer="null" width="800px">
        <div v-if="deliveryVisible7">
          <wuliu-dialog :id="deliverychoose_id" @close="closeTimeMsg7" :iShow="false"></wuliu-dialog>
        </div>
      </a-modal>
      <a-modal v-model="deliveryVisible2" title="流转单现阶段详情" :footer="null" width="800px">
        <div v-if="deliveryVisible2">
          <view-details
            :id="deliverychoose_id"
            @close="closeTimeMsg2"
            :iShow="true"
            :pageStatus="pageStatus"
          ></view-details>
        </div>
      </a-modal>
      <!-- 紧急任务 - 窗口 -->
      <a-modal v-model="JinJidialog" title="紧急任务" :footer="null" width="80%">
        <div v-if="JinJidialog">
          <div class="table-frame">
            <a-table
              :dataSource="dataSource_j"
              :columns="columns_j"
              bordered
              :pagination="false"
              :scroll="{ x: 1380 }"
            >
              <!-- 发运流转单号 - shippingFlowSheet -->
              <a-space slot="shippingFlowSheet" slot-scope="text, operate, i" class="operate-row">
                <a @click="getLookMsg(operate, i)">{{operate.shippingFlowSheet}}</a>
              </a-space>
              <!-- 操作 -->
              <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
                <div v-if="operate.taskStatus == 0">
                  <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
                </div>
                <div v-else-if="operate.taskStatus == 1">
                  <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
                  <a-button type="link" @click="getTimeMsg(operate, i)">物料确认</a-button>
                </div>
                <div v-else-if="operate.taskStatus == 2">
                  <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
                  <a-button type="link" @click="lookCheckOut(operate, i)">出库进度查询</a-button>
                  <a-button type="link" @click="getfuchaMsg(operate, i)">复查任务</a-button>
                </div>
                <div v-else-if="operate.taskStatus == 3">
                  <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
                  <a-button type="link" @click="lookCheckOut(operate, i)">出库进度查询</a-button>
                  <a-button type="link" @click="getbaozhuangMsg(operate, i)">包装确认</a-button>
                </div>
                <div v-else-if="operate.taskStatus == 4">
                  <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
                  <a-button type="link" @click="lookCheckOut(operate, i)">出库进度查询</a-button>
                </div>
                <div v-else-if="operate.taskStatus == 5">
                  <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
                  <a-button type="link" @click="getwuliuMsg(operate, i)">物流信息维护</a-button>
                </div>
                <div v-else>
                  <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
                </div>
              </a-space>
            </a-table>
            <!-- 分页 -->
            <div class="bottom-page">
              <a-pagination
                :total="total_j"
                :show-total="total_j => `共 ${total_j} 条`"
                :page-size="pageSize_j"
                :current="currentPage_j"
                @change="pageChange_j"
              />
              <div style="margin: 0 20px">共 {{pageNum_j}} 页</div>
              <div style="margin: 0 10px 0 0">到第</div>
              <a-input-number
                style="width: 50px"
                @keyup.enter.native="pageJump_j(jumpPage_j)"
                v-model="jumpPage_j"
              ></a-input-number>
              <div style="margin: 0 20px 0 10px">页</div>
              <a-button type="primary" @click="pageJump_j(jumpPage_j)">跳转</a-button>
            </div>
          </div>
          <div class="banner3 foot">
            <!-- :disabled="!chooseTime" -->
            <a-button type="danger" @click="JinClose()">暂时关闭</a-button>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import store from '@/store/'
// 物料确认
import wuliaoDialog from './wuliaoDialog'
// 出库进度查询
import checkOutDialog from './checkOutDialog'
// 复查任务
import fuchaDialog from './fuchaDialog'
// 复查任务审核签批
import signApproveDialog from './signApproveDialog'
// 包装确认
import baozhuangDialog from './baozhuangDialog'
// 物流信息维护
import wuliuDialog from './wuliuDialog'
import viewDetails from './viewDetails'
import listItem from './component/list_item'

import isDisabled from '@/utils/hasPermissionMy'

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
  editShipTaskTakeGoods
} from '@/api/api'
export default {
  name: 'ShipTaskList',
  data() {
    return {
      urgentTaskStatus_key: 0,
      dic: {
        // 表单中的部分数据对应的的数据词典
        taskStatus: [], // 计划状态
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
      total_j: 0, // 共多少条
      pageSize_j: 10, // 一页多少条
      pageNum_j: 1, // 共多少页
      jumpPage_j: 1, // 跳转到第几页
      currentPage_j: 1, // 当前页
      tableLoading: false,
      deliveryVisible: false, //提货完成弹窗可视化
      deliveryVisible2: false, //提货完成弹窗可视化
      deliveryVisible3: false,
      deliveryVisible4: false,
      deliveryVisible5: false,
      deliveryVisible6: false,
      deliveryVisible7: false,
      JinJidialog: false, //紧急任务弹窗可视化
      sendDataShow: false,
      deliverychoose_id: null, // 选择的那个id
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
      app_banner1_tabs_key: 2,
      status_key: 1,
      button_list: [
        { name: 'shipment:taskReceive', value: true, title: '任务接收', status: 0 },
        { name: 'shipment:reviewTask', value: true, title: '复查任务', status: 2 },
        { name: 'shipment:packageConfirm', value: true, title: '包装确认', status: 3 },
        { name: 'shipment:logisticsEdit', value: true, title: '物流信息维护', status: 5 }
      ],
      page_height: 600,
    }
  },
  components: {
    wuliaoDialog,
    checkOutDialog,
    fuchaDialog,
    signApproveDialog,
    baozhuangDialog,
    wuliuDialog,
    viewDetails,
    listItem
  },
  //初始化
  mounted() {
    this.button_list = isDisabled.getDisable(this.button_list)
    for (let i = 0; i < this.button_list.length; i++) {
      if (this.button_list[i].value) {
        this.status_key = this.button_list[i].status
        i = 100
      } else {
        i++
      }
    }
    this.getDic() // 获取字典
    var userId = store.getters.userInfo.id
    this.searchParams.userId = userId
    // this.getList()
    // 获取浏览器高度
    this.page_height = window.screen.height - 59 - 48
    console.log(window.screen.height - 564 - 59 - 48)
    
  },
  beforeDestroy() {
    if (this.fiveMinClear) {
      clearTimeout(this.fiveMinClear)
    }
  },
  methods: {
    // 查询列表
    getList(reset = false) {
      this.tableLoading = true
      if (reset) {
        // 如果需要重置，比如有了新的筛选条件
        this.currentPage = 1
      }
      let param = {}
      param.userId = this.searchParams.userId
      param.isItRunner = '1'
      // isItRunner 是否转轮 0：是 1：否
      param.taskStatus = this.status_key
      param.urgentTaskStatus = this.urgentTaskStatus_key
      if (this.searchParams.wheelShape) {
        param.wheelShape = this.searchParams.wheelShape
      }
      getShipTaskList(param, {
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
            console.log(this.dataSource)
          }
        } else {
          this.$message.error(data.message)
          this.tableLoading = false
        }
      })
    },
    resertGetList() {
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
    // 接受按钮 - 做一个判断，不是待接收的不要走接口了
    acceptubmit() {
      // 弹窗-确认下发
      this.$confirm({
        title: '确认执行接收操作?',
        content: '即将进行接收操作。注：如果您选中的发运单状态不是待接收，该发运单不会进行接收操作',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.tableLoading = true
          let idArr = []
          this.rowSelection_list.forEach(item => {
            if (item.taskStatus == 0) {
              idArr.push(item.shipmentManagementId)
            }
          })
          console.log(idArr)
          if (idArr.length == 1) {
            // 单个
            editShipTaskaccept({
              shipmentManagementId: idArr[0]
            }).then(data => {
              console.log(data)
              if (data.success) {
                this.$message.success('接收' + data.message)
                this.tableLoading = false
                this.getList()
              } else {
                this.$message.error(data.message)
                this.tableLoading = false
              }
            })
          } else if (idArr.length > 1) {
            // 多个
            editShipTaskaccepts({
              shipmentManagementId: idArr
            }).then(data => {
              console.log(data)
              if (data.success) {
                this.$message.success('批量接收' + data.message)
                this.tableLoading = false
                this.getList()
              } else {
                this.$message.error(data.message)
                this.tableLoading = false
              }
            })
          } else {
            this.$message.success('暂无待接收发运单')
            this.tableLoading = false
          }
        },
        onCancel() {
          console.log('Cancel')
        }
      })
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
    // 时间框改变时间
    ontimeChange(data) {
      if (data && data.legnth) {
        this.searchParams.planShipmentDateStart = data[0]
        this.searchParams.planShipmentDateEnd = data[1]
      } else {
        this.searchParams.planShipmentDateStart = null
        this.searchParams.planShipmentDateEnd = null
      }
    },
    // 查看
    getLookMsg(data, number) {
      this.deliveryVisible2 = false
      console.log('查看')
      this.deliveryVisible2 = true
      this.pageStatus = Number(data.taskStatus) || 0
      this.deliverychoose_id = data.shipmentManagementId
    },
    // 物料确认
    getTimeMsg(data, number) {
      console.log(data)
      this.deliveryVisible = false
      // 打开弹窗-shipmentManagementId-请求接口-结束后关闭自己，然后请求getlist
      this.deliveryVisible = true
      this.deliverychoose_id = data.shipmentManagementId
    },
    closeTimeMsg() {
      this.deliveryVisible = false
      this.deliverychoose_id = null
      if (this.JinJidialog === true) {
        this.getList_j()
      } else {
        this.getList()
      }
    },
    closeTimeMsg2() {
      this.deliveryVisible2 = false
      this.pageStatus = 0
      this.deliverychoose_id = null
    },
    // 出库进度查询
    lookCheckOut(data, number) {
      this.deliveryVisible3 = false
      this.deliveryVisible3 = true
      // this.deliverychoose_id = data.shipmentManagementId
      this.deliverychoose_id = data.shippingFlowSheet
    },
    // 物料确认
    getfuchaMsg(data, number) {
      this.deliveryVisible4 = false
      console.log(data)
      // 打开弹窗-shipmentManagementId-请求接口-结束后关闭自己，然后请求getlist
      this.deliveryVisible4 = true
      this.deliverychoose_id = data.shipmentManagementId
    },
    closeTimeMsg4() {
      this.deliveryVisible4 = false
      this.deliverychoose_id = null
      if (this.JinJidialog === true) {
        this.getList_j()
      } else {
        this.getList()
      }
    },
    // 审核这边的打开，以后可能不会看
    goShenhe(data) {
      this.deliveryVisible5 = true
      this.deliverychoose_id = data.shipmentManagementId
    },
    // 包装确认
    getbaozhuangMsg(data, number) {
      this.deliveryVisible6 = false
      this.deliveryVisible6 = true
      this.deliverychoose_id = data.shipmentManagementId
    },
    closeTimeMsg6() {
      this.deliveryVisible6 = false
      this.deliverychoose_id = null
      if (this.JinJidialog === true) {
        this.getList_j()
      } else {
        this.getList()
      }
    },
    // 物流维护
    getwuliuMsg(data, number) {
      this.deliveryVisible7 = false
      this.deliveryVisible7 = true
      this.deliverychoose_id = data.shipmentManagementId
    },
    closeTimeMsg7() {
      this.deliveryVisible7 = false
      this.deliverychoose_id = null
      if (this.JinJidialog === true) {
        this.getList_j()
      } else {
        this.getList()
      }
    },
    JinClose() {
      this.JinJidialog = false
      // 点击暂时关闭后延迟5分钟打开，重复流程
      this.fiveMinSet()
    },
    goLing(data, i) {
      console.log('指令', data)
      console.log(data.shipmentProcessOrderIds)
      this.$router.push({
        path: '/shipment/instructionList',
        query: {
          shipmentProcessOrderIds: data.shipmentProcessOrderIds
        }
      })
    },
    getList_j(reset = false) {
      // this.tableLoading = true
      if (reset) {
        // 如果需要重置，比如有了新的筛选条件
        this.currentPage_j = 1
      }
      let param = {
        userId: this.searchParams.userId,
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
      let param = {}
      param.userId = this.searchParams.userId
      param.isItRunner = '1'
      param.taskStatus = this.status_key
      param.urgentTaskStatus = this.urgentTaskStatus_key
      // isItRunner 是否转轮 0：是 1：否
      if (this.searchParams.wheelShape) {
        param.wheelShape = this.searchParams.wheelShape
      }
      getShipTaskList(param, {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }).then(data => {
        if (data.success) {
          let dataList = data.result
          if (!(dataList.records && dataList.records.length)) {
            this.dataSource = []
            this.t_loading = false
            this.t_busy = false
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
              this.t_busy = false
              return false
            } else {
              this.dataSource = [...this.dataSource, ...dataList.records]
              this.currentPage++
              this.t_loading = false
              this.t_busy = false
            }
          }
        } else {
          this.$message.error(data.message)
          this.t_loading = false
          this.t_busy = false
        }
      })
    },
    handleInfiniteOnLoad_j(reset = false) {
      if (reset) {
        // 如果需要重置，比如有了新的筛选条件
        this.currentPage_j = 1
        this.dataSource_j = []
        this.total_j = 0
        this.pageNum_j = 1
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
      let param = {
        userId: this.searchParams.userId,
        pageNo: this.currentPage_j,
        pageSize: this.pageSize_j
      }
      getShipTaskListUrgnt(param).then(data => {
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
            this.total_j = dataList.total
            this.pageNum_j = this.getPageNumber(dataList.total)
            // 数据处理
            if (this.currentPage_j >= this.pageNum_j) {
              this.dataSource_j = [...this.dataSource_j, ...dataList.records]
              this.t_loading = false
              return false
            } else {
              this.dataSource_j = [...this.dataSource_j, ...dataList.records]
              this.currentPage_j++
              this.t_loading = false
            }
          }
        } else {
          this.$message.error(data.message)
        }
      })
      this.t_busy = false
    },

    // 开始写方法第一行开始的
    changeTabs(type) {
      console.log(type)
      if (this.urgentTaskStatus_key === type) {
        // 暂无操作
      } else {
        this.urgentTaskStatus_key = type
        // 加载对应接口
        // if (type === 1) {
        //   this.handleInfiniteOnLoad_j(true)
        // } else if (type === 2) {
          this.handleInfiniteOnLoad(true)
        // }
      }
    },
    search() {
      console.log(this.searchParams.wheelShape)
      if (this.app_banner1_tabs_key === 1) {
        this.handleInfiniteOnLoad_j(true)
      } else if (this.app_banner1_tabs_key === 2) {
        this.handleInfiniteOnLoad(true)
      }
    },
    goRouter(data, i) {
      this.$router.push({
        path: `/app/shipment/viewDetails`,
        query: {
          id: data.shipmentManagementId,
          taskStatus: data.taskStatus,
          taskStatus_L: data.taskStatus_L,
          shipNumber: data.shippingFlowSheet
        }
      })
    },
    downPlan() {
      this.$router.push({
        path: `/app/shipment/PackagingQuery`
        // query: data
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
.app_ban1_seach /deep/ .ant-input-affix-wrapper .ant-input-suffix {
  right: auto;
  left: 12px;
}
.app_ban1_seach /deep/ .ant-input-search-icon {
  font-size: 20px;
  color: #d6d6d6;
}
.app_ban1_seach {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}

.app_banner2 {
  width: 100%;
  background: #e9f1f6;
}
.app_ban2_list_item {
  background: #fff;
  border-radius: 6px;
  margin: 0 15px;
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

/* .demo-infinite-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 300px;
}
.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
} */
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
</style>