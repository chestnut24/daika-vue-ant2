<template>
  <div class="app_page_main">
    <div class="app_banner1">
      <div class="app_ban1_seach">
        <a-input size="large" v-model="searchParams.wheelShape" placeholder="请输入戴卡部件号">
          <a-icon style="font-size: 20px;color: #d6d6d6;" slot="prefix" type="search" />
        </a-input>
      </div>
    </div>
    <div class="app_banner2" v-if="app_banner1_tabs_key === 2">
      <div>
        <div
          :style="'height: '+(page_height - 60)+'px;'"
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
  </div>
</template>

<script>
import store from '@/store/'
import listItem from './component/list_lun_item_2'

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
  getShipListInformation
} from '@/api/api'
export default {
  name: 'ShipTaskList',
  data() {
    return {
      dic: {
        // 表单中的部分数据对应的的数据词典
        taskStatus: [], // 计划状态
        urgentTaskStatus: [], // 紧急任务状态
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
      page_height: 600
    }
  },
  components: {
    listItem
  },
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
      let param = {}
      param.userId = this.searchParams.userId
      param.isItRunner = '0'
      // param.isItRunner = 0
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
    getPageNumber(number) {
      if (this.pageSize >= number) {
        return 1
      } else {
        let a = number / this.pageSize
        // 向上取整
        return Math.ceil(a)
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

    handleInfiniteOnLoad(reset = false) {
      if (reset) {
        // 如果需要重置，比如有了新的筛选条件
        this.currentPage = 1
        this.dataSource = []
        this.total = 0
        this.pageNum = 1
      }
      const data = this.dataSource
      // this.t_loading = true
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
      param.isItRunner = '0'
      // param.isItRunner = 0
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

    // 开始写方法第一行开始的
    changeTabs(type) {
      console.log(type)
      if (this.app_banner1_tabs_key === type) {
        // 暂无操作
      } else {
        this.app_banner1_tabs_key = type
        // 加载对应接口
        if (type === 1) {
          this.handleInfiniteOnLoad_j(true)
        } else if (type === 2) {
          this.handleInfiniteOnLoad(true)
        }
      }
    },
    goRouter(data, i) {
      this.$router.push({
        path: `/app/shipment/viewDetailsAll_lun`,
        query: data
      })
    }
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
.app_ban2_list_item {
  background: #fff;
  border-radius: 6px;
  margin: 0 15px;
}
.aban2_list_item_bb {
  margin-bottom: 15px;
}
</style>