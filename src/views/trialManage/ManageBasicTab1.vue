<template>
  <a-spin :spinning="spinning">

    <div style="width: 100%">
      <a-table
        ref="table"
        size="middle"
        bordered
        :columns="showColumns"
        :dataSource="dataSource"
        :scroll="{ x: 2500, y: 400 }"
        :pagination=false>
        <jnFilterTable ref="jnFilterTable" :columns="columns" :showColumns="showColumns" @showColumnsChange="setShowColumns" slot="filterDropdown"></jnFilterTable>
        <jnFilterIcon  slot="filterIcon"></jnFilterIcon>
        <jnFilterAction slot="action" slot-scope="text, record"></jnFilterAction>
        <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
          <a-button type="link" @click="editRow(operate, i)" v-if="operate.status === 0">
            编辑
          </a-button>
          <a-button type="link" @click="closeRow(operate, i)" v-if="operate.status != 10 && operate.status != 0">
            关闭
          </a-button>
          <a-button type="link" @click="queryRow(operate, i)">
            查看
          </a-button>
          <a-button type="link" @click="backRow(operate, i)" v-if="operate.status != 10 && operate.status != 0">
            撤回
          </a-button>
          <a-button type="link" @click="delRow(operate, i)" v-if="operate.status === 0">
            删除
          </a-button>
        </a-space>
        <a-space slot="purposesTab" slot-scope="text, operate, i" class="operate-row">
          <row-table :columns="rowColumns" :data-source="operate.purposes" maxWidth="600px"></row-table>
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

      <!-- 关闭 -->
      <a-modal @cancel="closePop" :visible="closeVisible" title="试制单关闭" width="800px" @ok="closeForm">
        <a-textarea v-model:value="closeReason" placeholder="请输入关闭原因" style="width: 100%" :rows="4"/>
      </a-modal>
      <!-- 撤回 -->
      <a-modal @cancel="closePop" :visible="backVisible" title="试制单撤回" width="800px" @ok="backForm">
        <a-textarea v-model:value="backReason" placeholder="请输入撤回原因" style="width: 100%" :rows="4"/>
      </a-modal>
      <!-- 删除 -->
      <a-modal @cancel="closePop" :visible="delVisible" title="确认删除" width="800px" @ok="delForm">
        <div>删除后不可恢复</div>
      </a-modal>
    </div>
  </a-spin>
</template>

<script>
  import {
    getTrialFormBaseList,
    getOptions,
    getDictItemsFromCache,
    closeFormBase,
    delFormBase,
    backFormBase,
  } from '@/api/api';
  import store from '@/store/';
  import RowTable from '../component/RowTable';
  import { jnFilterTableMixin } from '@/mixins/jnFilterTable'

  export default {
    name: 'ManageBasicTab1',
    props: ['queryParam', 'isSearch'],
    mixins: [jnFilterTableMixin],
    components: { RowTable },
    data() {
      return {
        spinning: true,
        dic: { // 表单中的部分数据对应的的数据词典
          trialStatus: [], // 试制状态
        },
        // 表格
        columns: [ // 表头

          // { title: '主键', dataIndex: 'id', width: 150, align: 'center', hidden:true },
          { title: '戴卡部件号', dataIndex: 'projectNo', width: 150, align: 'center' },
          { title: '戴卡订单号', dataIndex: 'orderNumber', width: 280, align: 'center' },
          { title: '试制单编号', dataIndex: 'trialProductionFormNo', width: 250, align: 'center' },
          { title: '客户名称', dataIndex: 'customerName', width: 300, align: 'center' },
          { title: '项目经理', dataIndex: 'projectManager', width: 150, align: 'center' },
          { title: '计划发样日期', dataIndex: 'planSendSamplesDt', width: 150, align: 'center' },
          { title: '试制批次', dataIndex: 'trialProductionBatch', width: 150, align: 'center' },
          { title: '计划毛坯数', dataIndex: 'planRoughcastNum', width: 150, align: 'center' },
          { title: '交付日期', dataIndex: 'deliverDt', width: 150, align: 'center' },
          {
            title: '试制用途',
            dataIndex: 'purposesTab',
            width: 650,
            align: 'center',
            scopedSlots: { customRender: 'purposesTab' },
          },
          { title: '计划量产地', dataIndex: 'planProductPlace', width: 150, align: 'center' },
          // { title: '计划量产地主键', dataIndex: 'planProductPlaceId', width: 150, align: 'center', hidden:true },
          { title: '工序', dataIndex: 'workStr', width: 250, align: 'center' },
          { title: '试制环节', dataIndex: 'trialSegment', width: 150, align: 'center' },
          { title: '状态', dataIndex: 'trialStatus', width: 150, align: 'center' },
          {
            title: '操作',
            dataIndex: 'operate',
            width: 150,
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'operate' },
          },
        ],
        dataSource: [], // 数据
        rowColumns: [ // 行内表格
          { title: '试制用途', dataIndex: 'purpose' },
          { title: '数量', dataIndex: 'number' },
        ],

        // 分页
        page: { // 分页
          total: 0, // 共多少条
          pageSize: 5, // 一页多少条
          pageNum: 0, // 共多少页
          currentPage: 1, // 当前页
          jumpPage: 1, // 跳转到第几页,
        },
        closeVisible: false, // 关闭弹窗可视化
        backVisible: false, // 撤回弹窗可视化
        delVisible: false,
        selectId: 0, // 选中行的id
        closeReason: null,
        backReason: null, //撤回原因
      };
    },
    //初始化
    mounted() {
      this.getDic(); // 获取字典
      this.searchQuery();
    },
    watch: {
      isSearch() {
        this.searchQuery(true);
      },
    },
    methods: {

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
        getTrialFormBaseList(param).then((data) => {
          this.spinning = false;
          if (data.success) {
            console.log("基础信息视图的列表结果",data)
            data = data.result;
            this.dataSource = [];
            if (!data.records.length) {
              this.dataSource = [];
            } else {
              for (let i = 0; i < data.records.length; i++) { // 遍历返回的数据列表
                for (let name in data.records[i]) { // 列表每行 for 出每个属性
                  if (name in this.dic) { // 如果该属性在字典里
                    for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                      if (data.records[i][name] === this.dic[name][j].value) { // 找到value相等时对应的label
                        data.records[i][name] = this.dic[name][j].label;
                      }
                    }
                  }
                }
              }
            }
            this.dataSource = data.records;
            this.page.total = data.total;
            this.page.pageSize = data.size;
            this.page.pageNum = data.pages;
          } else {
            this.$message.error(data.message);
          }
        });
      },

      queryRow(operate, i) { // 查看
        // this.$router.push({ name: `trialForm`, params: { id: operate.id } });
        // 需要在router.config.js配置路由，但是框架自带的布局不满足不再使用
        // 页面取值使用 -- this.$route.params.id
        this.$router.push({
          path: `/trial/trialForm`,
          query: {
            id: operate.id,
            no: operate.trialProductionFormNo,
          },
        });
      },

      backRow(operate, i) { // 撤回
        this.backVisible = true;
        this.selectId = operate.id;
      },

      backForm() { //调用撤回逻辑
        let param = { id: this.selectId, backReason: this.backReason };
        backFormBase(param).then((data) => {
          if (data.success) {
            this.$message.success(data.message);
            this.searchQuery();
          } else {
            this.$message.warning(data.message);
          }
          this.backVisible = false;
          this.selectId = 0;
          this.backReason = null;
        });
      },

      editRow(operate, i) { // 维护
        console.log(operate);
        this.$router.push(
          {
            path: `/trial/trialEditForm`,
            query: {
              id: operate.id,
            },
          },
        );
      },

      closeRow(operate, i) { // 关闭
        this.closeVisible = true;
        this.selectId = operate.id;
      },

      closePop() { //关闭弹窗
        this.selectId = 0;
        this.closeVisible = false;
        this.closeReason = null;
        this.delVisible = false;
        this.backVisible = false;
        this.backReason = null;
      },

      closeForm() {
        let param = { id: this.selectId, closeReason: this.closeReason };
        closeFormBase(param).then((data) => {
          if (data.success) {
            this.$message.success(data.message);
            this.searchQuery();
          } else {
            this.$message.warning(data.message);
          }
          this.closeVisible = false;
          this.selectId = 0;
          this.closeReason = null;
        });
      },

      delRow(operate, i) { //删除
        this.delVisible = true;
        this.selectId = operate.id;
      },

      delForm() {
        let param = { id: this.selectId };
        delFormBase(param).then((data) => {
          if (data.success) {
            this.$message.success(data.message);
            this.searchQuery();
          } else {
            this.$message.warning(data.message);
          }
          this.selectId = 0;
          this.delVisible = false;
        });
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
          getOptions(searchName, '').then((data) => {
            this.dic[name] = data;
          });
        }
      },

      // getDic() { // 从缓存中获取表单中的部分字段对应的字典
      //   for (let name in this.dic) {
      //     let searchName = this.humpOrLine(name, 'toLine');
      //     if (getDictItemsFromCache(searchName)) { // 从缓存中取dic
      //       this.dic[name] = getDictItemsFromCache(searchName);
      //     }
      //   }
      // },

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
  @import "./../../css/public-table-css";
  .operate-row {
    .ant-btn {
      padding: 0;
    }
  }

  .table-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
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
    align-items: center;

    div {
      margin-right: 20px;
    }
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
          background-color: #E3F1FA
        }
      }
    }
    tBody tr:nth-child(even){
      background-color: #F3F7F9
    }
    td:not(:last-child){
      text-align: left !important;
    }
  }
  /deep/ .ant-table-thead{
    th:not(:last-child){
      text-align: left !important;
    }
  }
</style>
