<template>
  <a-spin :spinning="spinning">

    <div style="width: 100%">
      <!--    <a-button type="primary" @click="test">test</a-button>-->
      <a-table
        ref="table"
        size="middle"
        bordered
        :columns="columns"
        :dataSource="dataSource"
        :scroll="{ x: 0, y: 1000 }"
        :pagination=false>
        <a-space slot="workStr" slot-scope="text, workStr, i" class="operate-row">
          <row-table :columns="rowColumns" :data-source="workStr.taskWorkList" :max-width="maxWidth">
            <template slot="customer-tr">
              <tr>
                <td><span>拆单</span></td>
                <td v-for="(data, dataIndex) in workStr.taskWorkList" :key="dataIndex">
                <span v-if="!data.taskWorkSplits.length">
                  <a-button disabled type="link">未拆单</a-button>
                </span>
                  <div v-else>
                    <!--                  有哪个状态显示哪个，list为空就显示无 如果是1显示日期-->
                    <span v-for="(item, intemIndex) in data.taskWorkSplits" :key="intemIndex"  @click="jumpSplit(item)">
                    <a-button :disabled="returnSplitStatus(item.scheduleStatus) === '试制完成'" type="link">{{ item.subNo }}（{{ item.trialProductionNumber }}）{{ returnSplitStatus(item.scheduleStatus) }}</a-button>
                    <br>
                  </span>
                  </div>
                </td>
              </tr>
            </template>
          </row-table>
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
    </div>
  </a-spin>
</template>

<script>
  import store from '@/store/';
  import {
    getTrialTaskWorkList,
    getOptions,
    getDictItemsFromCache
  } from '@/api/api';
  import RowTable from '../component/RowTable';
  export default {
    name: 'ManageTaskTab4',
    props: ['queryParam', 'isSearch'],
    components: { RowTable },
    data() {
      return {

        dic: { // 表单中的部分数据对应的的数据词典
          trial_schedule_status: [], // 试制状态
        },

        columns: [ // 表头
          // { title: '主键', dataIndex: 'id', width: 150, align: 'center', hidden:true },
          { title: '戴卡部件号', dataIndex: 'projectNo', align: 'center' },
          { title: '试制单编号', dataIndex: 'trialProductionFormNo',width:240, align: 'center' },
          { title: '项目经理', dataIndex: 'projectManager', align: 'center' },
          { title: '计划发样日期', dataIndex: 'planSendSamplesDt',width:130, align: 'center' },
          { title: '计划毛坯数', dataIndex: 'planRoughcastNum', align: 'center' },
          {
            title: '工序', dataIndex: 'workStr', width: 870, align: 'center',
            // fixed: 'right',
            scopedSlots: { customRender: 'workStr' },
          },
        ],
        dataSource: [], // 数据
        rowColumns: [ // 行内表格
          { title: '工序', dataIndex: 'processTechnologyName' },
          { title: '试制地', dataIndex: 'trialProductionSite' },
        ],
        maxWidth: '850px',

        page: { // 分页
          total: 0, // 共多少条
          pageSize: 5, // 一页多少条
          pageNum: 0, // 共多少页
          currentPage: 1, // 当前页
          jumpPage: 1, // 跳转到第几页,
        },
        spinning: true,
      };
    },
    watch: {
      isSearch() {
        this.searchQuery(true);
      },
    },

    mounted() {
      this.getDic(); // 获取字典
      this.searchQuery();
    },
    methods: {
      test() {
        // console.log('123');
        // this.searchQuery();
        // console.log('this.dic', this.dic);
        // console.log('store', store);
        console.log('dataSource', this.dataSource);
      },

      searchQuery(reset = false) {
        if (reset) { // 如果需要重置，比如有了新的筛选条件
          this.page.currentPage = 1;
        }
        let param = this.queryParam;
        param.pageNo = this.page.currentPage; // 当前页码
        param.pageSize = this.page.pageSize; // 页大小
        param.column = 'create_time';
        param.order = 'desc';
        param.createBy = store.getters.userInfo.username;
        // param.column =  'project_no';
        // param.order = 'asc';
        // console.log(store.getters.userInfo);
        getTrialTaskWorkList(param).then((data) => {
          this.spinning = false;
          if (data.success) {
            data = data.result;
            console.log('data', data);
            this.dataSource = [];

            this.dataSource = this.dataToDic(data.records);
            this.page.total = data.total;
            this.page.pageSize = data.size;
            this.page.pageNum = data.pages;

          } else {
            this.$message.error(data.message);
          }
        });
      },

      returnSplitStatus(status) {
        for (let i = 0; i < this.dic.trial_schedule_status.length; i++) {
          let item = this.dic.trial_schedule_status[i];
          if (Number(item.value) === Number(status)) {
            return item.text;
          }
        }
        // this.dic.trial_schedule_status.map(item => {
        //   if (Number(item.value) === Number(status)) return item.text;
        // })
      },


      jumpSplit(data) {
        let tab = 3; // 默认跳到第4个tab页 0123
        if (this.returnSplitStatus(data.scheduleStatus) === '试制中') tab = 4;
        this.$router.push({
          path: '/trial/trialForm',
          query: {
            id: data.formBaseId,
            no: data.formBaseNo,
            tab: tab, // 第4个tab页 试制中第五个
          },
        },);
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

      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          // let searchName = this.humpOrLine(name, 'toLine');
          if (getDictItemsFromCache(name)) { // 从缓存中取dic
            this.dic[name] = getDictItemsFromCache(name);
          }
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
    },
  };
</script>

<style scoped lang="less">
  .operate-row {
    .ant-btn {
      padding: 0;
    }
  }
  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }
  /deep/ .ant-table-thead {

    th{
      font-size: 16px;
      color: rgba(0,0,0,.65) !important;
      padding: 12px 16px !important;
    }
  }
  /deep/ .ant-table-body{
    td{
      font-size: 16px;
      color: rgba(0,0,0,.85) !important;
      padding: 8px 16px !important;
      max-height: 24px;
      table{
        td{
          padding: 4px 16px !important;
        }
        tr:nth-child(even){
          background-color: #fff;
        }
        tr:nth-child(odd){
          background-color: #F3F7F9
        }
      }
    }
    tBody tr:nth-child(even){
      background-color: #F3F7F9
    }
    td{
      text-align: left !important;
    }
  }
  /deep/ .ant-table-thead{
    th{
      text-align: left !important;
    }
  }
</style>
