<template>
  <div class="min-container jn-public-table jn-public-table-other">
    <div style="min-width: 1600px">
      <a-card style="margin-bottom: 20px">
        <!-- 查询区域 -->
        <div class="search-container">
          <a-form layout="inline">
            <div class="row" v-if="!menuOpen">
              <!--          戴卡部件号-->
              <div class="flex-left">
                <div>戴卡部件号：</div>
              </div>
              <div class="item-input">
                <a-form-item>
                  <a-input placeholder="请输入戴卡部件号" v-model="queryParam.projectNumber"></a-input>
                </a-form-item>
              </div>
              <!--          生产工艺-->
              <div class="flex-left">
                <div>生产工艺：</div>
              </div>
              <div class="item-input">
                <a-form-item>
                  <a-input placeholder="请输入生产工艺" v-model="queryParam.productionProcess"></a-input>
                </a-form-item>
              </div>
              <!--          客户名称-->
              <div class="flex-left">
                <div>客户名称：</div>
              </div>
              <div class="item-input">
                <a-form-item>
                  <a-input placeholder="请输入客户名称" v-model="queryParam.customerName"></a-input>
                </a-form-item>
              </div>


              <div class="button-group">
                <a-button type="link" @click="changeDownOrUp" style="margin-right: 0">展开<a-icon type="down"/></a-button>
                <a-button type="primary" @click="searchQuery(true)">查询</a-button>
                <a-button @click="resetParam">重置</a-button>
              </div>
            </div>
            <template v-else>
              <div class="row">
                <!--          戴卡部件号-->
                <div class="flex-left">
                  <div>戴卡部件号：</div>
                </div>
                <div class="item-input">
                  <a-form-item>
                    <a-input placeholder="请输入戴卡部件号" v-model="queryParam.projectNumber"></a-input>
                  </a-form-item>
                </div>
                <!--          生产工艺-->
                <div class="flex-left">
                  <div>生产工艺：</div>
                </div>
                <div class="item-input">
                  <a-form-item>
                    <a-input placeholder="请输入生产工艺" v-model="queryParam.productionProcess"></a-input>
                  </a-form-item>
                </div>
                <!--          客户名称-->
                <div class="flex-left">
                  <div>客户名称：</div>
                </div>
                <div class="item-input">
                  <a-form-item>
                    <a-input placeholder="请输入客户名称" v-model="queryParam.customerName"></a-input>
                  </a-form-item>
                </div>
                <!--          车型平台-->
                <div class="flex-left">
                  <div>车型平台：</div>
                </div>
                <div class="item-input">
                  <a-form-item>
                    <a-input placeholder="请输入车型平台" v-model="queryParam.vehiclePlatform"></a-input>
                  </a-form-item>
                </div>
              </div>

              <!--            按钮组-->
              <div class="row">
                <div class="button-group">
                  <a-button type="link" @click="changeDownOrUp" style="margin-right: 0">收起<a-icon type="up"/></a-button>
                  <a-button type="primary" @click="searchQuery(true)">查询</a-button>
                  <a-button @click="resetParam">重置</a-button>
                </div>
              </div>
            </template>
          </a-form>
          <!-- 操作按钮区域 -->
        </div>
      </a-card>
      <a-card>


        <!-- table区域 -->
        <div class="table-title-container">
          <div class="table-title">项目物料查询列表</div>
          <div class="button-group">
            <a-button icon="export" @click="exportRecord">导出</a-button>
          </div>
        </div>

        <!-- 分隔线 -->
        <a-divider/>
        <a-table
          ref="table"
          size="middle"
          bordered
          :columns="columns"
          :dataSource="dataSource"
          :scroll="{ x: true }"
          :pagination=false>
          <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
            <a-button type="link" @click="checkRow(operate, i)">
              查看
            </a-button>
          </a-space>
        </a-table>

        <!--    分页-->
        <div class="bottom-page">
          <a-pagination
            :total=page.total
            :show-total="total => `共 ${total} 条`"
            :page-size=page.pageSize
            :current="page.currentPage"
            @change="pageChange"
          />
          <div style="margin: 0 20px">共 {{page.pageNum}} 页</div>
          <div style="margin: 0 10px 0 0">到第</div>
          <a-input-number style="width: 50px" @keyup.enter.native="pageJump(page.jumpPage)"
                          v-model="page.jumpPage"></a-input-number>
          <div style="margin: 0 20px 0 10px">页</div>
          <a-button type="primary" @click="pageJump(page.jumpPage)">跳转</a-button>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
  import { getMaterialQuery, getOptions } from '@/api/api';

  export default {
    name: 'MaterialQuery',
    data() {
      return {

        menuOpen: false, //
        maintainDate: [], // 维护日期 用于绑定model清空

        // 请求参数
        queryParam: {
          maintainDateS: '', // 维护开始日期
          maintainDateE: '', // 维护结束日期
          projectNumber: '', // 戴卡项目号
          productionProcess: '', // 生产工艺
          maintainState: undefined, // 维护状态
          customerName: '', // 客户名称
          vehiclePlatform: '', // 车型平台
        },

        // 字典
        // 字典
        dic: { // 表单中的部分数据对应的的数据词典
          maintenanceState: [], // 维护状态
        },

        // 表格
        columns: [ // 表头
          { title: '戴卡部件号', dataIndex: 'projectNumber', align: 'left' },
          { title: '客户零件号', dataIndex: 'customerProjectNumber', align: 'left' },
          { title: '客户名称', dataIndex: 'customerName', align: 'left' },
          { title: '生产工艺', dataIndex: 'productionProcess', align: 'left' },
          { title: '轮径', dataIndex: 'wheelDiameter', align: 'left' },
          { title: '轮宽', dataIndex: 'wheelWidth', align: 'left' },
          { title: '车型平台', dataIndex: 'vehiclePlatform', align: 'left' },
          {
            title: '操作',
            dataIndex: 'operate',
            width: 150,
            align: 'center',
            // fixed: 'right',
            scopedSlots: { customRender: 'operate' },
          },
        ],
        dataSource: [], // 数据

        // 分页
        page: { // 分页
          total: 0, // 共多少条
          pageSize: 5, // 一页多少条
          pageNum: 0, // 共多少页
          currentPage: 1, // 当前页
          jumpPage: 1, // 跳转到第几页,
        },
      };
    },

    mounted() {
      this.getDic();
      this.$nextTick(() => {
        this.searchQuery(); // 获取列表信息
      });
    },
    methods: {
      changeDownOrUp() {
        this.menuOpen = !this.menuOpen;
      },

      maintainDateChange(value, dateString) { // 维护时间改变
        this.queryParam.maintainDateS = dateString[0];
        this.queryParam.maintainDateE = dateString[1];
      },

      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          getOptions(searchName, '').then((data) => {
            this.dic[name] = data;
          });
        }
      },
      humpOrLine(name, type) { // 驼峰式转下划线 toLine  下划线转驼峰式 toHump
        if (type === 'toLine') {
          return name.replace(/([A-Z])/g, '_$1').toLowerCase();
        } else if (type === 'toHump') {
          return name.replace(/\_(\w)/g, function(all, letter) {
            return letter.toUpperCase();
          });
        }
      },

      setTime(name, type) { // 快速确定时间，本日 本周 本月
        if (name === 'maintainDate') {
          this.maintainDate = this.returnDateByType(type);
          this.queryParam.maintainDateS = this.returnDateByType(type)[0];
          this.queryParam.maintainDateE = this.returnDateByType(type)[1];
        }
      },

      returnDateByType(type) {
        let now = new Date(); // 当前日期
        let nowDayOfWeek = now.getDay(); // 今天本周的第几天
        let nowDay = now.getDate(); // 当前日
        let nowMonth = now.getMonth(); // 当前月
        let nowYear = now.getFullYear(); // 当前年
        switch (type) {
          case 'day' :
            return [this.formatDate(now, 'before'), this.formatDate(now, 'after')];
          case 'week' :
            let day = nowDayOfWeek || 7;
            return [this.formatDate(new Date(nowYear, nowMonth, nowDay + 1 - day), 'before'), this.formatDate(now, 'after')];
          case 'month' :
            let monthStartDate = new Date(nowYear, nowMonth, 1);
            return [this.formatDate(monthStartDate, 'before'), this.formatDate(now, 'after')];
        }
      },

      formatDate(date, position) {
        let myYear = date.getFullYear();
        let myMonth = date.getMonth() + 1;
        let myWeekday = date.getDate();
        let myHour = date.getHours();
        let myMinute = date.getMinutes();
        let mySecond = date.getSeconds();

        if (myMonth < 10) {
          myMonth = '0' + myMonth;
        }
        if (myWeekday < 10) {
          myWeekday = '0' + myWeekday;
        }
        if (myHour < 10) {
          myHour = '0' + myHour;
        }
        if (myMinute < 10) {
          myMinute = '0' + myMinute;
        }
        if (mySecond < 10) {
          mySecond = '0' + mySecond;
        }
        if (position === 'before') {
          return (`${myYear}-${myMonth}-${myWeekday} 00:00:00`);
        } else if (position === 'after') {
          return (`${myYear}-${myMonth}-${myWeekday} ${myHour}:${myMinute}:${mySecond}`);
        }
      },

      exportRecord() { // 导出
        this.$message.warning('导出功能待开发！');
      },

      searchQuery(reset = false) { // 查询信息列表 reset代表是否重置页码
        if (reset) { // 如果需要重置，比如有了新的筛选条件
          this.page.currentPage = 1;
        }
        let param = this.queryParam;
        param.pageNo = this.page.currentPage; // 当前页码
        param.pageSize = this.page.pageSize; // 页大小

        getMaterialQuery(param).then((data) => {
          data = data.result;
          if (!data.records.length) {
            this.dataSource = [];
          } else {
            for (let i = 0; i < data.records.length; i++) { // 遍历返回的数据列表
              for (let name in data.records[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.records[i][name] && Number(data.records[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                      data.records[i][name] = this.dic[name][j].label;
                    }
                  }
                }
              }
            }

            this.dataSource = data.records;
            this.page.total = data.total;
            this.page.pageSize = data.size;
            this.page.pageNum = data.pages;
          }
        });
      },

      resetParam() { // 重置
        this.maintainDate = [];
        this.queryParam = {
          maintainDateS: '', // 要求发货结束日期
          maintainDateE: '', // 要求发货开始日期
          component: '', // 戴卡项目号
          productionProcess: '', // 生产工艺
          maintainState: undefined, // 维护状态
          customerName: '', // 客户名称
          vehiclePlatform: '', // 订单结束日期
        };
      },

      // 表格
      checkRow(operate, i) { // 查看
        this.$router.push({
            path: `/material/detail`,
            query: {
              id: operate.id,
            },
          },
        );
      },


      // 分页
      pageChange(val) { // 分页改变
        // console.log(val);
        this.page.currentPage = val;
        this.searchQuery();
      },

      pageJump(page) { // 点击指定分页跳转的情况下
        if (page > this.page.pageNum) {
          page = this.page.pageNum;
          this.page.jumpPage = this.page.pageNum;
        } else if (page < 1) {
          page = 1;
          this.page.jumpPage = 1;
        }
        this.page.currentPage = page;
        this.searchQuery();
      },

    },
  };
</script>

<style scoped lang="less">

  @import "./../../css/public-table-css";
  .min-container {
    overflow-x: auto;

    /deep/ .ant-card-body {
    padding: 24px;
  }
  }
  .ant-input {
    width: 244px;
  }

  .row {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 16px;
    &:nth-last-child(1) {
      margin-bottom: 0;
    }

    .item-title {
    }

    .item-input {
      margin: 0 auto 0 12px;
      &:last-child {
        margin: 0 10px 0 12px;
      }
    }

    .item-input-fold {

      margin: 0 40px 0 10px;
    }
  }

  .button-group {
    display: flex;
    /*margin-right: 100px;*/

    button {
      margin-right: 8px;
    }
  }

  /*物料维护*/
  .search-container {
    .special-date {
      height: 40px;
      width: 40px;

      span {
        text-decoration: underline;
      }
    }
  }

  .button-container {
    display: flex;
    align-items: center;
    margin-top: 20px;
    /*height: 50px;*/
    /*width: 100%;*/
    /*margin-top: 10px;*/

    button {
      margin-right: 8px;
    }
  }

  .table-title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .table-title {
    font-size: 18px;
    font-weight: bold;
    /*margin-bottom: 20px;*/
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
</style>