<template>
  <div class="app_main">
    <div class="app_banner1">
      <div class="app_banner1_body">
        <div class="a_ban1_echart">
          <div id="myChart" :style="{width: '200px', height: '200px'}"></div>
          <div class="a_ban1_echart_r">
            <div class="a_ban1_echart_r1">
              <div class="a_ban1_echart_r2"></div>
            </div>
          </div>
        </div>
        <div class="a_ban1_tip">
          <div class="tip_hang">
            <div class="tip_hang_1" style="background: #63cacf;"></div>
            <div class="tip_hang_2">发运计划:</div>
            <div class="tip_hang_3">{{echartList.shipmentTaskCount}}</div>
          </div>
          <div class="tip_hang">
            <div class="tip_hang_1" style="background: #ffbc45;"></div>
            <div class="tip_hang_2">任务接收:</div>
            <div class="tip_hang_3">{{echartList.taskReceiveCount}}</div>
          </div>
          <!-- <div class="tip_hang">
            <div class="tip_hang_1" style="background: #02c236;"></div>
            <div class="tip_hang_2">物料确认:</div>
            <div class="tip_hang_3">4</div>
          </div>-->
          <div class="tip_hang">
            <div class="tip_hang_1" style="background: #3c88f8;"></div>
            <div class="tip_hang_2">复查任务:</div>
            <div class="tip_hang_3">{{echartList.reviewTaskCount}}</div>
          </div>
          <div class="tip_hang">
            <div class="tip_hang_1" style="background: #8edba5;"></div>
            <div class="tip_hang_2">包装确认:</div>
            <div class="tip_hang_3">{{echartList.packagingConfirmCount}}</div>
          </div>
          <div class="tip_hang">
            <div class="tip_hang_1" style="background: #b763cf;"></div>
            <div class="tip_hang_2">样件提货:</div>
            <div class="tip_hang_3">{{echartList.sampleExtractionCount}}</div>
          </div>
          <div class="tip_hang">
            <div class="tip_hang_1" style="background: #ff857d;"></div>
            <div class="tip_hang_2">物流信息维护:</div>
            <div class="tip_hang_3">{{echartList.logisticsInfoCount}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="app_banner1_foot"></div>
    <div class="app_banner2">
      <div class="app_banner2_body">
        <div class="ab2_btn" @click="goRouter(1)">
          <div class="ab2_btn_icon">
            <img
              style="width: 100%;"
              src="../../../assets/mobile/shipment_app/main_page/menu_01.png"
            />
          </div>
          <div>流转单管理</div>
        </div>
        <div class="ab2_btn" @click="goRouter(2)">
          <div class="ab2_btn_icon">
            <img
              style="width: 100%;"
              src="../../../assets/mobile/shipment_app/main_page/menu_02.png"
            />
          </div>
          <div>发运计划</div>
        </div>
        <div class="ab2_btn" @click="goRouter(3)">
          <div class="ab2_btn_icon">
            <img
              style="width: 100%;"
              src="../../../assets/mobile/shipment_app/main_page/menu_03.png"
            />
          </div>
          <div>发运任务</div>
        </div>
        <div class="ab2_btn" @click="goRouter(5)">
          <div class="ab2_btn_icon">
            <img
              style="width: 100%;"
              src="../../../assets/mobile/shipment_app/main_page/menu_04.png"
            />
          </div>
          <div>转轮任务</div>
        </div>
        <div class="ab2_btn" @click="goRouter(4)">
          <div class="ab2_btn_icon">
            <img
              style="width: 100%;"
              src="../../../assets/mobile/shipment_app/main_page/menu_05.png"
            />
          </div>
          <div>过程指令</div>
        </div>
      </div>
    </div>
    <div class="app_banner3">
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
            @click="goRouterItem(item, index)"
          >
            <listLunItem :matterData="item"></listLunItem>
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
import { getOptions, getShipmentStatistics, getShipTaskList } from '@/api/api'
import listLunItem from './component/list_lun_item'
export default {
  name: 'shipMain',
  data() {
    return {
      dic: {
        // 表单中的部分数据对应的的数据词典
        taskStatus: [], // 计划状态
        urgentTaskStatus: [] // 紧急任务状态
      },
      echartList: {
        logisticsInfoCount: 0,
        packagingConfirmCount: 0,
        reviewTaskCount: 0,
        sampleExtractionCount: 0,
        shipmentPlanCount: 0,
        shipmentTaskCount: 0,
        taskReceiveCount: 0
      },
      page_height: 600,
      t_loading: false,
      t_busy: false,
      dataSource: [],
      total: 0, // 共多少条
      pageSize: 10, // 一页多少条
      pageNum: 1, // 共多少页
      jumpPage: 1, // 跳转到第几页
      currentPage: 1, // 当前页
      searchParams: {
        userId: '' // 用户id
      }
    }
  },
  components: { listLunItem },
  //初始化
  mounted() {
    // this.drawLine()
    this.getDic() // 获取字典
    var userId = store.getters.userInfo.id
    this.searchParams.userId = userId

    this.getEchart()
    // this.getList()
    // 获取浏览器高度
    this.page_height = window.screen.height - 59 - 48
  },
  methods: {
    goRouter(num) {
      if (num === 1) {
        // 跳转流转单管理-缓
        // this.$router.push({
        //   path: `/sampleLibrary/PickUpRecord`
        // })
      } else if (num === 2) {
        // 跳转发运计划-缓
        // this.$router.push({
        //   path: `/app/shipment/ShipPlanList`
        // })
      } else if (num === 3) {
        // 跳转发运任务-急
        this.$router.push({
          path: `/app/shipment/ShipTaskList`
        })
      } else if (num === 4) {
        // 跳转过程指令-急
        // this.$router.push({
        //   path: `/app/shipment/ShipTaskList_lun`
        // })
      } else if (num === 5) {
        // 跳转转轮任务- ？
        this.$router.push({
          path: `/app/shipment/ShipTaskList_lun`
        })
      }
    },
    getEchart() {
      getShipmentStatistics().then(data => {
        this.echartList = data || {
          logisticsInfoCount: 0,
          packagingConfirmCount: 0,
          reviewTaskCount: 0,
          sampleExtractionCount: 0,
          shipmentPlanCount: 0,
          shipmentTaskCount: 0,
          taskReceiveCount: 0
        }
        this.drawLine()
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
    // 查询列表
    getList(reset = false) {
      this.tableLoading = true
      if (reset) {
        // 如果需要重置，比如有了新的筛选条件
        this.currentPage = 1
      }
      let param = {}
      param.userId = this.searchParams.userId
      // param.isItRunner = '0'
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
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let index = 0

      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        series: [
          {
            name: '发运数据',
            type: 'pie',
            radius: ['60%', '80%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 3
            },
            legend: {
              data: ['统计', '数量'],
              selectedMode: false,
              show: false
            },
            label: {
              show: false,
              position: 'center'
            },
            normal: {
              label: {
                show: true,
                fontSize: '14',
                trigger: 'item',
                // formatter: '{b} \n {c}',
                color: '#2a7bf1',
                align: 'center',
                verticalAlign: 'middle',
                formatter: ['', '{b[0]}', '{b|{c[0]}}'].join('\n'),
                rich: {
                  b: {
                    fontSize: 20,
                    fontWeight: 600,
                    lineHeight: 30
                  }
                }
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                trigger: 'item',
                // formatter: '{b} \n {c}',
                color: '#2a7bf1',
                align: 'center',
                verticalAlign: 'middle',
                formatter: ['', '{b}', '{b|{c}}'].join('\n'),
                rich: {
                  b: {
                    fontSize: 20,
                    fontWeight: 600,
                    lineHeight: 30
                  }
                }
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: this.echartList.shipmentTaskCount, name: '发运计划', itemStyle: { color: '#63cacf' } },
              { value: this.echartList.taskReceiveCount, name: '任务接收', itemStyle: { color: '#ffbc45' } },
              // { value: this.echartList.shipmentTaskCount, name: '物料确认', itemStyle: { color: '#02c236' } },
              { value: this.echartList.reviewTaskCount, name: '复查任务', itemStyle: { color: '#3c88f8' } },
              { value: this.echartList.packagingConfirmCount, name: '包装确认', itemStyle: { color: '#8edba5' } },
              { value: this.echartList.sampleExtractionCount, name: '样件提货', itemStyle: { color: '#b763cf' } },
              { value: this.echartList.logisticsInfoCount, name: '物流信息维护', itemStyle: { color: '#ff857d' } }
            ]
          }
        ]
      })
      myChart.dispatchAction({
        type: 'highlight',

        seriesIndex: 0,

        dataIndex: 0
      }) //设置默认选中高亮部分

      myChart.on('mouseover', function(e) {
        if (e.dataIndex != index) {
          myChart.dispatchAction({
            type: 'downplay',

            seriesIndex: 0,

            dataIndex: index
          })
        }
      })

      myChart.on('mouseout', function(e) {
        index = e.dataIndex

        myChart.dispatchAction({
          type: 'highlight',

          seriesIndex: 0,

          dataIndex: e.dataIndex
        })
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
      // param.isItRunner = '0'
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
    getPageNumber(number) {
      if (this.pageSize >= number) {
        return 1
      } else {
        let a = number / this.pageSize
        // 向上取整
        return Math.ceil(a)
      }
    },
    goRouterItem(data, i) {
      if (data.isItRunner == '1') {
        this.$router.push({
          path: `/app/shipment/viewDetails`,
          query: {
            id: data.shipmentManagementId,
            taskStatus: data.taskStatus,
            taskStatus_L: data.taskStatus_L,
            shipNumber: data.shippingFlowSheet
          }
        })
      } else if (data.isItRunner == '0') {
        this.$router.push({
          path: `/app/shipment/viewDetailsAll_lun`,
          query: data
        })
      }
    }
  },
  created() {}
}
</script>

<style scoped>
.app_main {
  font-size: 16px;
  box-sizing: border-box;
}
.app_banner1 {
  background: #0080b6;
  /* 背景图片，拼色那种 */
  padding: 14px;
  padding-top: 12px;
  z-index: 1;
}
.app_banner1_body {
  background: #fff;
  border-radius: 6px;
  padding: 10px;
  position: relative;
  display: flex;
  justify-content: space-between;
}
.app_banner1_foot {
  background: #e9f1f6;
  width: 100%;
  height: 65px;
  margin-top: -65px;
  z-index: -1;
}

.a_ban1_echart {
  width: 60%;
  position: relative;
}
#myChart {
  position: relative;
  z-index: 1;
}
.a_ban1_echart_r {
  border: 1px solid #e8e8e8;
  width: 100px;
  height: 100px;
  position: absolute;
  top: 50px;
  left: 50px;
  border-radius: 50%;
}
.a_ban1_echart_r1 {
  border: 5px solid #fff;
  width: 98px;
  height: 98px;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  background: #e0ebfd;
}
.a_ban1_echart_r2 {
  border: 1px solid #c2d9f9;
  width: 78px;
  height: 78px;
  position: absolute;
  top: 5px;
  left: 5px;
  border-radius: 50%;
  background: #fff;
}
.a_ban1_tip {
  width: 40%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
}
.tip_hang {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}
.tip_hang_1 {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.tip_hang_3 {
  width: 26px;
  font-weight: 600;
  font-size: 15px;
}
.tip_hang_2 {
  width: calc(100% - 34px);
  padding-left: 5px;
}
.app_banner2,
.app_banner3 {
  background: #e9f1f6;
  width: 100%;
  padding: 14px;
  padding-top: 0;
}
.app_banner2_body {
  background: #fff;
  border-radius: 6px;
  padding: 10px 0;
  display: flex;
  justify-content: space-around;
}
.ab2_btn {
  width: 18%;
  text-align: center;
  font-size: 12px;
}
/* 临时放置 */
.ab2_btn_icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin: 5px auto;
}
.app_banner3_item {
  background: #fff;
  border-radius: 6px;
}
.ab3i {
  margin-bottom: 15px;
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
.app_ban2_list_item {
  background: #fff;
  border-radius: 6px;
  /* margin: 0 15px; */
}
.aban2_list_item_bb {
  margin-bottom: 15px;
}
</style>