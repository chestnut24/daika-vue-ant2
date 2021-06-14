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
          <row-table :columns="rowColumns" :data-source="workStr.formWorks" :max-width="maxWidth">
            <template slot="customer-tr">
              <tr>
                <!--              <td><span>test</span></td>-->
                <td v-for="(data, index) in workStr.formWorks" :key="index">
                <span v-if="Number(data.status) === 1"><a-button type="link" @click="jumpCheck(workStr)">
                  {{ returnDicTitle('checkTrialProduction', data.status) }}
                </a-button></span>
                  <span v-else>{{ returnDicTitle('checkTrialProduction', data.status) }}</span>
                  <!--                <br>-->
                  <span v-if="Number(data.status) === 1">{{ data.checkTime | dayMoment}}</span>
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

      <!--    &lt;!&ndash; 关闭 &ndash;&gt;-->
      <!--    <a-modal @cancel="closePop" :visible="closeVisible" title="试制单关闭" width="800px" @ok="closeForm">-->
      <!--      <a-textarea v-model:value="closeReason" placeholder="请输入关闭原因" style="width: 100%" :rows="4"/>-->
      <!--    </a-modal>-->
      <!--    &lt;!&ndash; 撤回 &ndash;&gt;-->
      <!--    <a-modal @cancel="closePop" :visible="backVisible" title="试制单撤回" width="800px" @ok="backForm">-->
      <!--      <a-textarea v-model:value="backReason" placeholder="请输入撤回原因" style="width: 100%" :rows="4"/>-->
      <!--    </a-modal>-->
      <!--    &lt;!&ndash; 删除 &ndash;&gt;-->
      <!--    <a-modal @cancel="closePop" :visible="delVisible" title="确认删除" width="800px" @ok="delForm">-->
      <!--      <div>删除后不可恢复</div>-->
      <!--    </a-modal>-->
    </div>
  </a-spin>
</template>

<script>

  import store from '@/store/';
  import {
    getTrialFormMaintainList,
    getOptions,
    getDictItemsFromCache
  } from '@/api/api';

  import RowTable from '../component/RowTable';

  export default {

    name: 'ManageMaintainTab2',
    props: ['queryParam', 'isSearch'],
    components: { RowTable },
    data() {
      return {
        spinning: true,

        dic: { // 表单中的部分数据对应的的数据词典
          trialStatus: [], // 试制状态
          checkTrialProduction: [], // 试制前核对 待维护或者已维护
        },

        columns: [ // 表头
          // { title: '主键', dataIndex: 'id', width: 150, align: 'center', hidden:true },
          { title: '戴卡部件号', dataIndex: 'projectNo', align: 'center' },
          { title: '试制单编号', dataIndex: 'trialProductionFormNo',width: 260, align: 'center' },
          { title: '项目经理', dataIndex: 'projectManager', align: 'center' },
          { title: '计划发样日期', dataIndex: 'planSendSamplesDt', align: 'center' },
          {
            title: '工序', dataIndex: 'workStr', width: 900, align: 'center',
            // fixed: 'right',
            scopedSlots: { customRender: 'workStr' },
          },
        ],
        dataSource: [], // 数据

        rowColumns: [ // 行内表格
          { title: '', dataIndex: 'technologyName' },
          { title: '', dataIndex: 'managerName' },
        ],
        maxWidth: '850px',
        rowData: [
          { purpose: 'a', number: 'b', }
        ],

        page: { // 分页
          total: 0, // 共多少条
          pageSize: 5, // 一页多少条
          pageNum: 0, // 共多少页
          currentPage: 1, // 当前页
          jumpPage: 1, // 跳转到第几页,
        },
      };
    },
    watch: {
      isSearch() {
        this.searchQuery(true);
      },
    },
    // computed: {
    // },

    mounted() {
      this.getDic(); // 获取字典
      this.searchQuery();
    },
    methods: {
      test() {
        console.log('DataSource', this.dataSource);
        // this.searchQuery();
        // this.getDic();
        // console.log('dic', this.dic);
      },

      returnDicTitle(name, value) {
        let data = this.dic[name];
        for (let i = 0; i < data.length; i++) {
          if (Number(data[i].value) === value){
            return data[i].title;
          }
        }
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
        param.baseTabPage='baseTabPage'
        // console.log(store.getters.userInfo);
        getTrialFormMaintainList(param).then((data) => {
          this.spinning = false;
          if (data.success) {
            data = data.result;
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

      jumpCheck(data) {
        this.$router.push({
          path: '/trial/trialForm',
          query: {
            id: data.id,
            no: data.trialProductionFormNo,
            tab: 1,
          },
        },);
      },

      dataToDic(data) { // 将数据中的字段改为字典
        for (let i = 0; i < data.length; i++) { // 遍历返回的数据列表
          for (let name in data[i]) { // 列表每行 for 出每个属性
            if (name in this.dic) { // 如果该属性在字典里
              for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                if (Number(data[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                  data[i][name] = this.dic[name][j].title;
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
          let searchName = this.humpOrLine(name, 'toLine');
          if (getDictItemsFromCache(searchName)) { // 从缓存中取dic
            this.dic[name] = getDictItemsFromCache(searchName)
          }
          // getOptions(searchName, '').then((data) => {
          //   this.dic[name] = data;
          // });
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
