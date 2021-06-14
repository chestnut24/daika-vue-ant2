<template>
  <div class="app_page_main" :style="'min-height: '+page_height+'px;'">
    <div class="app_banner1">
      <div class="app_ban1_seach">
        <!-- @change="search()" -->
        <a-input
          size="large"
          v-model="searchParams.wheelShape"
          placeholder="请输入戴卡部件号"
          @change="search()"
        >
          <a-icon style="font-size: 20px;color: #d6d6d6;" slot="prefix" type="search" />
        </a-input>
      </div>
    </div>
    <div class="app_banner2" v-if="app_banner1_tabs_key === 2">
      <div>
        <div
          :style="'height: '+(page_height-88)+'px;'"
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
    <div class="app_banner3 banner3 my_page_btn">
      <a-button
        class="page_btn"
        type="primary"
        @click="downPlan"
        :disabled="dataSource.length==0"
      >下发计划</a-button>
    </div>
    <div class="banner3_dianjiao"></div>
  </div>
</template>

<script>
import store from '@/store/'
import reviewTimeDialog from './reviewTimeDialog'
import listItem from './component/list_plan_item'
import { getShipPlanList, downShipPlanArrs, upDateShipPlan, getOptions } from '@/api/api'
export default {
  name: 'ShipPlanList',
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
      sendDataShow: false,
      tableLoading: false,
      deliverychoose_id: null, // 选择的那个id
      dataSource: [], //表格数据
      // 滚动加载
      data: [],
      t_loading: false,
      t_busy: false,
      app_banner1_tabs_key: 2,
      page_height: 600
    }
  },
  components: { reviewTimeDialog, listItem },
  //初始化
  mounted() {
    this.getDic() // 获取字典
    var userId = store.getters.userInfo.id
    this.searchParams.userId = userId
    // this.getList()
    // 获取浏览器高度
    this.page_height = window.screen.height - 59 - 48
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
        userId: '', // 用户id
        //
        time: [], // 时间选框
        planShipmentDateStart: null, // 计划发运时间开始
        planShipmentDateEnd: null // 计划发运时间结束
      }
      this.total = 0 // 共多少条
      this.pageSize = 5 // 一页多少条
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
        content: '即将对复查时间不为空并且计划状态为未排序的进行',
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
      this.deliverychoose_id = data.shipmentManagementId
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
      if (this.searchParams.wheelShape) {
        param.wheelShape = this.searchParams.wheelShape
      }
      getShipPlanList(param, {
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
    goRouter(data, i) {
      console.log(data);
      // this.$router.push({
      //   path: `/app/shipment/viewDetailsAll_lun`,
      //   query: data
      // })
      // 有跳转吗？
    },
    search() {
      this.handleInfiniteOnLoad(true)
    }
  },
  created() {
    // 获取浏览器高度
    this.page_height = window.screen.height - 59 - 48
  }
}
</script>

<style scoped>
.app_banner1 {
  width: 100%;
  padding: 10px 15px;
  background: #e9f1f6;
}

.app_ban1_tabs {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 15px;
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
  background: #fff;
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

.app_banner2 {
  width: 100%;
  background: #e9f1f6;
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
.app_ban2_list_item {
  background: #fff;
  border-radius: 6px;
  margin: 0 15px;
}
.aban2_list_item_bb {
  margin-bottom: 15px;
}
.banner3 {
  /* margin-top: 15px; */
  background: #e9f1f6;
  text-align: center;
  position: fixed;
  bottom: 55px;
  left: 0;
  width: 100%;
  padding: 20px 0;
  padding-top: 10px;
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