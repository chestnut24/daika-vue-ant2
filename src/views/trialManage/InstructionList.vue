<template>
  <div class="instruction-list-container jn-public-table">
    <a-card :bordered="false" style="min-width: 1600px">
      <!--    试制过程指令列表-->
      <!--  试制流转单号 戴卡部件号 戴卡订单号-->
      <!-- 查询区域 -->
      <div class="search-container">
        <a-form layout="inline">
          <a-row type="flex" align="middle">
            <a-col :md="7" :sm="8" class="flex-left">
              <div class="input-title">试制单编号：</div>
              <a-form-item>
                <a-input placeholder="请输入试制单编号" v-model="queryParam.trialProductionFormNo"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="7" :sm="8" class="flex-left">
              <div class="input-title">戴卡部件号：</div>
              <a-form-item>
                <a-input placeholder="请输入戴卡部件号" v-model="queryParam.projectNo"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="7" :sm="8" class="flex-left">
              <div class="input-title">戴卡订单号：</div>
              <a-form-item>
                <a-input placeholder="请输入戴卡订单号" v-model="queryParam.orderNo"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="3" :sm="8" class="fl ex-left">
              <!-- 操作按钮区域 -->
              <div class="button-container">
                <div class="button-group">
                  <a-button type="primary" @click="searchQuery(true)">查询</a-button>
                  <a-button @click="resetParam">重置</a-button>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>

    </a-card>
    <a-card :bordered="false" style="min-width: 1600px;margin-top: 20px">
      <!-- 操作按钮区域 -->
      <div class="button-container" style="justify-content: space-between">
        <div class="table-title">试制过程指令列表</div>
        <div class="button-group">
          <a-button type="primary" icon="plus" @click="jumpNewInstruction">新建</a-button>
        </div>
      </div>

      <!-- 分隔线 -->
      <a-divider/>

      <!-- table区域 -->

      <!--    :scroll="{ x: 1000, y: 1000 }"-->
      <a-table
        ref="table"
        size="middle"
        bordered
        :columns="columns"
        :dataSource="dataSource"
        :pagination=false>
        <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
          <a-button type="link" @click="editRow(operate, i, 'check')">
            查看过程指令
          </a-button>
          <a-button type="link" @click="editRow(operate, i, 'edit')">
            修改
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
        <a-button type="primary" @click="pageJump(page.jumpPage)">确定</a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
  import { getTrialInstructionList } from '@/api/api';
  export default {
    name: 'InstructionList',
    data() {
      return {
        // 请求参数
        queryParam: {
          trialProductionFormNo: '', // 试制单编号
          projectNo: '', // 戴卡部件号
          orderNo: '', // 戴卡订单号
        },

        // 表格
        columns: [ // 表头
          { title: '过程指令单号', dataIndex: 'processInstructionNumber', align: 'left' },
          { title: '试制单编号', dataIndex: 'trialProductionFormNo', align: 'left' },
          { title: '戴卡部件号', dataIndex: 'projectNo', align: 'left' },
          { title: '戴卡订单号', dataIndex: 'orderNumber', align: 'left' },
          { title: '轮型尺寸', dataIndex: 'wheelShapeSize', align: 'left' },
          { title: '影响流程', dataIndex: 'aopTrialSegment', align: 'left' },
          {
            title: '操作',
            dataIndex: 'operate',
            width: 250,
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
      }
    },

    mounted() {
      console.log("I am in InstructionList")
      let no = this.$route.query.no;
      if (no) {
        this.queryParam.trialProductionFormNo = no;
      }
      this.searchQuery(); // 获取列表信息
    },

    methods: {
      // 查询表单
      searchQuery(reset = false) { // 查询信息列表 reset代表是否重置页码
        if (reset) { // 如果需要重置，比如有了新的筛选条件
          this.page.currentPage = 1;
        }
        let param = this.queryParam;
        param.pageNo = this.page.currentPage; // 当前页码
        param.pageSize = this.page.pageSize; // 页大小
        param.column = 'create_time';
        param.order = 'desc';
        getTrialInstructionList(param).then((data) => {
          data = data.result;
          if (!data.records.length) {
            this.dataSource = [];
          } else {

            this.dataSource = data.records;

            this.page.total = data.total;
            this.page.pageSize = data.size;
            this.page.pageNum = data.pages;
          }
        });
      },

      // 按钮组
      jumpNewInstruction() {
        this.$router.push(
          { path: `/trial/instructionEdit` },
        );
      },

      resetParam() { // 重置
        this.maintainDate = [];
        this.queryParam = {
          trialProductionFormNo: '', // 试制单编号
          projectNo: '', // 戴卡部件号
          orderNo: '', // 戴卡订单号
        };
      },

      // 表格按钮
      editRow(row, index, type) {
        this.$router.push({
            path: `/trial/instructionEdit`,
            query: {
              id: row.id,
              type: type,
              no: row.trialProductionFormNo,
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
    }
  };
</script>

<style scoped lang="less">
  @import "./../../css/public-table-css";
  .instruction-list-container {
    overflow-x: auto;
    /deep/ .ant-input {
      width: 244px;
    }
    /deep/ .ant-card-body {
      padding: 24px;
    }
  }


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
    justify-content: flex-end;
    height: 32px;
    width: 100%;
    /*margin-top: 10px;*/

    .button-group {
      display: flex;
      /*margin-right: 100px;*/

      button {
        margin-right: 20px;
      }
    }
  }

  .table-title {
    display: flex;
    align-items: center;
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
    align-items: center;
  }
  .input-title {
    margin-right: 12px;
  }
</style>