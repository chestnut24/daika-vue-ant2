<template>
  <div class="jn-public-table jn-public-table-other min-container">
    <div style="min-width: 1600px">
      <a-card style="margin-bottom: 20px">

        <!-- 查询区域 -->
        <div class="search-container">
          <a-form layout="inline">
<!--            <a-row class="row" v-if="!menuOpen">-->
<!--              &lt;!&ndash;            维护日期&ndash;&gt;-->
<!--              <a-col :span="8">-->
<!--                <div class="flex-left">-->
<!--                  <div class="input-title">维护日期：</div>-->
<!--                  <a-form-item>-->
<!--                    <a-range-picker-->
<!--                      style="width: 244px"-->
<!--                      :show-time="{ format: 'HH:mm:ss' }"-->
<!--                      format="YYYY-MM-DD"-->
<!--                      @change="maintainDateChange"-->
<!--                      v-model="maintainDate"-->
<!--                    ></a-range-picker>-->
<!--                    <a-radio-group style="margin-left: 12px" v-model="maintainDateRadio">-->
<!--                      <a-radio-button value="a" @click="setTime('maintainDate', 'day')">-->
<!--                        当日-->
<!--                      </a-radio-button>-->
<!--                      <a-radio-button value="b" @click="setTime('maintainDate', 'week')">-->
<!--                        本周-->
<!--                      </a-radio-button>-->
<!--                      <a-radio-button value="c" @click="setTime('maintainDate', 'month')">-->
<!--                        本月-->
<!--                      </a-radio-button>-->
<!--                    </a-radio-group>-->
<!--                  </a-form-item>-->
<!--                </div>-->
<!--              </a-col>-->

<!--              &lt;!&ndash;            戴卡部件号&ndash;&gt;-->
<!--              <a-col :span="6">-->
<!--                <div class="flex-left">-->
<!--                  <div class="input-title">戴卡部件号：</div>-->
<!--                  <a-form-item>-->
<!--                    <a-input placeholder="请输入戴卡部件号" v-model="queryParam.projectNumber"></a-input>-->
<!--                  </a-form-item>-->
<!--                </div>-->
<!--              </a-col>-->

<!--              &lt;!&ndash;            生产工艺&ndash;&gt;-->
<!--              <a-col :span="6">-->
<!--                <div class="flex-left">-->
<!--                  <div class="input-title">生产工艺：</div>-->
<!--                  <a-form-item>-->
<!--                    <a-input placeholder="请输入生产工艺" v-model="queryParam.productionProcess"></a-input>-->
<!--                  </a-form-item>-->
<!--                </div>-->
<!--              </a-col>-->
<!--              <a-col :span="4">-->
<!--                <div class="button-group">-->
<!--                  <a-button type="link" @click="changeDownOrUp" style="margin-right: 0">-->
<!--                    展开-->
<!--                    <a-icon type="down"/>-->
<!--                  </a-button>-->
<!--                  <a-button type="primary" @click="searchQuery(true)">查询</a-button>-->
<!--                  <a-button @click="resetParam">重置</a-button>-->
<!--                </div>-->
<!--              </a-col>-->

<!--            </a-row>-->

            <div class="row" v-if="!menuOpen">
              <div class="flex-left">
                <div>维护日期：</div>
              </div>
              <div class="item-input item-input-fold">
                <a-form-item>
                  <a-range-picker
                    style="width: 244px"
                    :show-time="{ format: 'HH:mm:ss' }"
                    format="YYYY-MM-DD"
                    @change="maintainDateChange"
                    v-model="maintainDate"
                  ></a-range-picker>
                  <a-radio-group style="margin-left: 12px" v-model="maintainDateRadio">
                    <a-radio-button value="a" @click="setTime('maintainDate', 'day')">
                      当日
                    </a-radio-button>
                    <a-radio-button value="b" @click="setTime('maintainDate', 'week')">
                      本周
                    </a-radio-button>
                    <a-radio-button value="c" @click="setTime('maintainDate', 'month')">
                      本月
                    </a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </div>
              <div class="flex-left">
                <div>戴卡部件号：</div>
              </div>
              <div class="item-input item-input-fold">
                <a-form-item>
                  <a-input placeholder="请输入戴卡部件号" v-model="queryParam.projectNumber"></a-input>
                </a-form-item>
              </div>

              <div class="flex-left">
                <div>生产工艺：</div>
              </div>
              <div class="item-input item-input-fold">
                <a-form-item>
                  <a-input placeholder="请输入生产工艺" v-model="queryParam.productionProcess"></a-input>
                </a-form-item>
              </div>

              <div class="button-group">
                <a-button type="link" @click="changeDownOrUp" style="margin-right: 0">
                  展开
                  <a-icon type="down"/>
                </a-button>
                <a-button type="primary" @click="searchQuery(true)">查询</a-button>
                <a-button @click="resetParam">重置</a-button>
              </div>
            </div>
            <template v-else>
              <a-row class="row">
                <!--            戴卡部件号-->
                <a-col :span="6">
                  <div class="flex-left">
                    <div class="input-title">戴卡部件号：</div>
                    <a-form-item>
                      <a-input placeholder="请输入戴卡部件号" v-model="queryParam.projectNumber"></a-input>
                    </a-form-item>
                  </div>
                </a-col>

                <!--            生产工艺-->
                <a-col :span="6">
                  <div class="flex-left">
                    <div class="input-title">生产工艺：</div>
                    <a-form-item>
                      <a-input placeholder="请输入生产工艺" v-model="queryParam.productionProcess"></a-input>
                    </a-form-item>
                  </div>
                </a-col>

                <!--            客户名称-->
                <a-col :span="6">
                  <div class="flex-left">
                    <div class="input-title">客户名称：</div>
                    <a-form-item>
                      <a-input placeholder="请输入客户名称" v-model="queryParam.customerName"></a-input>
                    </a-form-item>
                  </div>
                </a-col>

                <!--            车型平台-->
                <a-col :span="6">
                  <div class="flex-left">
                    <div class="input-title">车型平台：</div>
                    <a-form-item>
                      <a-input placeholder="请输入车型平台" v-model="queryParam.vehiclePlatform"></a-input>
                    </a-form-item>
                  </div>
                </a-col>

              </a-row>
              <a-row class="row">
                <!--            维护状态-->
                <a-col :span="6">
                  <div class="flex-left">
                    <div class="input-title" style="margin-right: 28px">维护状态：</div>
                    <a-form-item>
                      <a-select
                        placeholder="请选择维护状态"
                        v-model="queryParam.maintenanceState"
                        style="width: 244px"
                      >
                        <a-select-option v-for="data in dic.maintenanceState" :key="data.value">
                          {{ data.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </div>
                </a-col>

                <!--            维护日期-->
                <a-col :span="9">
                  <div class="flex-left">
                    <div class="input-title">维护日期：</div>
                    <a-form-item>
                      <a-range-picker
                        style="width: 244px"
                        :show-time="{ format: 'HH:mm:ss' }"
                        format="YYYY-MM-DD"
                        @change="maintainDateChange"
                        v-model="maintainDate"
                      ></a-range-picker>
                      <a-radio-group style="margin-left: 12px" v-model="maintainDateRadio">
                        <a-radio-button value="a" @click="setTime('maintainDate', 'day')">
                          当日
                        </a-radio-button>
                        <a-radio-button value="b" @click="setTime('maintainDate', 'week')">
                          本周
                        </a-radio-button>
                        <a-radio-button value="c" @click="setTime('maintainDate', 'month')">
                          本月
                        </a-radio-button>
                      </a-radio-group>
                    </a-form-item>
                  </div>
                </a-col>

                <!--            按钮组-->
                <a-col :span="6">
                  <div class="button-group">

                    <a-button type="link" @click="changeDownOrUp" style="margin-right: 0">
                      收起
                      <a-icon type="up"/>
                    </a-button>
                    <a-button type="primary" @click="searchQuery(true)">查询</a-button>
                    <a-button @click="resetParam">重置</a-button>
                    <!--        <a-button @click="jumpOther(1)">查看详情</a-button>-->
                    <!--        <a-button @click="jumpOther(2)">采购进度</a-button>-->
                  </div>
                </a-col>
              </a-row>
            </template>
          </a-form>
        </div>

      </a-card>
      <a-card :bordered="false">
        <!-- table区域 -->
        <div class="button-container">
          <div class="table-title">项目物料维护列表
            <span
              style="font-size: 14px;margin-left: 30px">工段：{{ dataSource.length ?  dataSource[0].taskObject : ''}}</span>
          </div>
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
            <a-button :disabled="(!operate.maintenanceState || operate.maintenanceState === '未维护')" type="link"
                      @click="checkRow(operate, i)">
              查看
            </a-button>
            <a-button type="link" @click="maintainRow(operate, i)">
              维护
            </a-button>
            <a-button type="link" @click="showProjectDetail(operate, i)">项目信息</a-button>
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
          <a-button type="primary" @click="pageJump(page.jumpPage)">确定</a-button>
        </div>

        <select-number ref="modal" v-on:get-text="getProjectNumber"></select-number>
        <project-information ref="projectInfor"></project-information>
        <a-modal :visible="tipVisible" title="提示" @ok="closeTip" @cancel="closeTip">
          <p>当面没有需要维护物料的工段任务，请去项目物料查询页面查看已维护信息（管理员）</p>
        </a-modal>
      </a-card>
    </div>
  </div>
</template>

<script>

  import { getMaterialMaintain, getOptions } from '@/api/api';
  import SelectNumber from '../system/SelectNumber';
  import ProjectInformation from '../system/ProjectInformation';
  import Login from '../user/Login';

  export default {
    name: 'MaterialMaintain',
    components: { SelectNumber, ProjectInformation },
    data() {
      return {
        menuOpen: false, //
        maintainDate: [], // 维护日期 用于绑定model清空
        maintainDateRadio: '', // 维护日期radio

        // 请求参数
        queryParam: {
          maintenanceStartDate: '', // 维护开始日期
          maintenanceEndDate: '', // 维护结束日期
          projectNumber: '', // 戴卡项目号
          productionProcess: '', // 生产工艺
          maintenanceState: undefined, // 维护状态
          customerName: '', // 客户名称
          vehiclePlatform: '', // 车型平台
        },

        // 字典
        dic: { // 表单中的部分数据对应的的数据词典
          maintenanceState: [], // 维护状态
        },

        // 表格
        columns: [ // 表头
          { title: '戴卡部件号', dataIndex: 'projectNumber', align: 'left' },
          { title: '项目经理', dataIndex: 'projectManager', align: 'left' },
          { title: '客户零件号', dataIndex: 'customerProjectNumber', align: 'left' },
          { title: '客户名称', dataIndex: 'customerName', align: 'left' },
          { title: '生产工艺', dataIndex: 'productionProcess', align: 'left' },
          { title: '轮径', dataIndex: 'wheelDiameter', align: 'left' },
          { title: '轮宽', dataIndex: 'wheelWidth', align: 'left' },
          { title: '车型平台', dataIndex: 'vehiclePlatform', align: 'left' },
          { title: '维护状态', dataIndex: 'maintenanceState', align: 'left' },
          { title: '维护人', dataIndex: 'createBy', align: 'left' },
          { title: '维护日期', dataIndex: 'createTime', align: 'left' },
          { title: '最新版本', dataIndex: 'version', align: 'left' },
          {
            title: '操作',
            dataIndex: 'operate',
            width: 250,
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'operate' },
          },
        ],
        dataSource: [], // 数据

        // 分页
        page: { // 分页
          total: 0, // 共多少条
          pageSize: 10, // 一页多少条
          pageNum: 0, // 共多少页
          currentPage: 1, // 当前页
          jumpPage: 1, // 跳转到第几页,
        },

        tipVisible: false,
      };
    },

    mounted() {
      this.getDic(); // 获取字典
      this.$nextTick(() => {
        this.searchQuery(); // 获取列表信息
      });
    },

    methods: {

      changeDownOrUp() {
        this.menuOpen = !this.menuOpen;
      },
      showProjectDetail(operate, index) {
        this.$refs.projectInfor.getData(operate.id);
      },

      jumpOther(num) {
        let path = [
          { path: `/material/maintainBOM` }, // 维护BOM
          { path: `/material/detail` },  // 查看详情
          { path: `/material/progress` },  // 采购进度
        ];
        this.$router.push(path[num]);
      },

      maintainDateChange(value, dateString) { // 维护时间改变
        // this.queryParam.maintenanceStartDate = dateString[0];
        // this.queryParam.maintenanceEndDate = dateString[1];
        this.queryParam.maintenanceStartDate = value[0].format('YYYY-MM-DD 00:00:00');
        this.queryParam.maintenanceEndDate = value[1].format('YYYY-MM-DD 23:59:59');
      },

      setTime(name, type) { // 快速确定时间，本日 本周 本月
        if (name === 'maintainDate') {
          this.maintainDate = this.returnDateByType(type);
          this.queryParam.maintenanceStartDate = this.returnDateByType(type)[0];
          this.queryParam.maintenanceEndDate = this.returnDateByType(type)[1];
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
        console.log('导出');
      },

      getProjectNumber(event) { // 父组件监听子组件值

        this.queryParam.projectNumber = event.projectNumber; // 戴卡部件号

      },

      openSelect() { // 打开选择窗口
        this.$refs.modal.add();
      },


      searchQuery(reset = false) { // 查询信息列表 reset代表是否重置页码
        if (reset) { // 如果需要重置，比如有了新的筛选条件
          this.page.currentPage = 1;
        }
        let param = this.queryParam;
        param.pageNo = this.page.currentPage; // 当前页码
        param.pageSize = this.page.pageSize; // 页大小

        getMaterialMaintain(param).then((data) => {
          data = data.result;
          if (!data.records.length) {
            this.dataSource = [];
            // this.tipVisible = true;
          } else {

            this.dataSource = this.dataToDic(data.records);
            for (let i = 0; i < this.dataSource.length; i++) {
              if (!this.dataSource[i].maintenanceState) { // 如果维护状态为空，则改为未维护
                this.dataSource[i].maintenanceState = '未维护';
              }
            }
            this.page.total = data.total;
            this.page.pageSize = data.size;
            this.page.pageNum = data.pages;
          }
        });
      },

      dataToDic(data) { // 将数据中的字段改为字典
        for (let i = 0; i < data.length; i++) { // 遍历返回的数据列表
          for (let name in data[i]) { // 列表每行 for 出每个属性
            if (name in this.dic) { // 如果该属性在字典里
              for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                if (data[i][name] && Number(data[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                  data[i][name] = this.dic[name][j].label;
                }
              }
            }
          }
        }
        return data;
      },

      resetParam() { // 重置
        this.maintainDateRadio = '',
          this.maintainDate = [];
        this.queryParam = {
          maintenanceStartDate: '', // 要求发货结束日期
          maintenanceEndDate: '', // 要求发货开始日期
          projectNumber: '', // 戴卡部件号
          productionProcess: '', // 生产工艺
          maintenanceState: undefined, // 维护状态
          customerName: '', // 客户名称
          vehiclePlatform: '', // 订单结束日期
        };
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

      // 表格
      checkRow(operate, i) { // 查看
        this.$router.push({
          path: `/material/checkBOM`,
          query: {
            id: operate.id,
            taskObject: operate.taskObject,
            // isCheck: true,
          },
        });
      },

      maintainRow(operate, i) { // 维护
        this.$router.push({
            path: `/material/maintainBOM`,
            query: {
              id: operate.id,
              taskObject: operate.taskObject,
              // isCheck: false,
            },
          },
        );
      },

      informationRow(operate, i) { // 项目信息
        console.log('');
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

      closeTip() { // 关闭提示弹窗
        this.tipVisible = false;
      },

    },
  };
</script>

<style scoped lang="less">

  /*新样式*/
  @import "./../../css/public-table-css";

  .min-container {
    overflow-x: auto;

    /deep/ .ant-card-body {
      padding: 24px;
    }
  }

  .input-title {
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
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

    .item-input {
      margin: 0 auto 0 12px;
    }

    .item-input:nth-last-child(1) {
      margin: 0 10px 0 12px;
    }

    .item-input-fold {
      margin: 0 auto 0 10px;
    }

    .item-input-fold:nth-last-child(1) {
      margin: 0 10px 0 12px;
    }

    .display-none {
      display: block;
    }
  }

  .button-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    width: 100%;
    /*margin-top: 10px;*/
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

  /*.button-container {*/
  /*  display: flex;*/
  /*  align-items: center;*/
  /*  height: 50px;*/
  /*  width: 100%;*/
  /*  margin-top: 10px;*/

  /*}*/

  .table-title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 18px;
    font-weight: bold;
    /*margin-bottom: 20px;*/
  }

  .button-group {
    display: flex;
    /*margin-right: 100px;*/

    button {
      margin-right: 8px;
    }
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

  @media only screen and (max-width: 1900px) {
    .display-none {
      display: none !important;
    }
  }
</style>