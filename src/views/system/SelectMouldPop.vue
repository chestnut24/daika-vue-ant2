<template>
  <a-modal :visible="visible" title="选择模具" width="1100px" class="jn-public-table" @cancel="handleCancel">
    <div class="search-frame">
      <a-row>
        <a-space align="center">
          <div class="left-text">
            <span style="font-size: 15px;"><b>戴卡部件号检索</b></span>
          </div>
          <a-input v-model="projectNumber" placeholder="请输入戴卡部件号"  style="margin-left: 20px;"/>
          <a-button style="margin-left: 50px;" @click="search()">搜索</a-button>
        </a-space >
      </a-row>
    </div>
    <a-card class="search-table" >
      <div style="margin-bottom: 20px;padding:5px;background-color: #F2F3F6;" v-if="!(dataSource.length == 0)">
        <span class="search-hidden-text"  style="font-size: 15px;"><b>模具信息</b></span>
      </div>
      <div class="mould-frame-down" v-if="!(dataSource.length == 0)">
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          bordered
          :pagination = false
          :customRow="rowClick"
        >
          <a-space slot="projectNumber" slot-scope="text, operate, i" class="operate-row">
            <a-button type="link" @click="showProjectDetail(operate, i)">{{ text }}</a-button>
          </a-space>
        </a-table>
        <!--    分页-->
        <div class="bottom-page">
          <a-pagination
            class="alerm"
            :total=total
            :show-total="total => `共 ${total} 条`"
            :page-size=pageSize
            :current="currentPage"
            @change="pageChange"
          />
          <div style="margin: 0 20px">共 {{pageNum}} 页</div>
          <div style="margin: 0 10px 0 0">到第</div>
          <a-input-number style="width: 50px" @keyup.enter.native="pageJump(jumpPage)" v-model="jumpPage"></a-input-number>
          <div style="margin: 0 20px 0 10px">页</div>
          <a-button type="primary" @click="pageJump(jumpPage)">跳转</a-button>
        </div>
      </div>

    </a-card>
    <template #footer>
      <a-button key="back" @click="handleCancel()">取消</a-button>
      <a-button key="submit" type="primary"   v-on:click="$emit('get-text', selectMould)" @click="handleOk">选择</a-button>
    </template>
    <project-information ref="projectInfor"></project-information>
  </a-modal>
</template>

<script>
    import {
        getMould,
    } from '@/api/api';

    import ProjectInformation from './ProjectInformation';

    export default {
        name: 'SelectMouldPop',
        components: { ProjectInformation },
        mounted() {

        },
        data() {
            return{
                selectedRowInfor: '', // 选择的行信息 由 戴卡部件号+模号+制作项目+模具制作类型 确定
                visible: false,
                highLight: '', //高亮
                dataSource: [],// 检索数组
                total: 0, // 共多少条
                pageSize: 5, // 一页多少条
                currentPage: 1, // 当前页
                pageNum: 1, // 共多少页
                jumpPage: 1, // 跳转到第几页
                columns: [
                    {
                        title: '戴卡部件号',
                        dataIndex: 'component',
                        key: 'component',
                        align: 'center',
                        scopedSlots: { customRender: 'projectNumber' },
                    },
                    {
                        title: '模号',
                        dataIndex: 'modelNumber',
                        key: 'modelNumber',
                        align: 'center',
                    },
                    {
                        title: '制作项目',
                        dataIndex: 'productionProject',
                        key: 'productionProject',
                        align: 'center',
                    },
                    {
                        title: '模具制作类型',
                        dataIndex: 'modelType',
                        key: 'modelType',
                        align: 'center',
                    }
                ],

                selectMould: {},
                projectNumber: '',

            }
        },
        methods: {

            showProjectDetail(operate, index) {
                this.$refs.projectInfor.getData(operate.projectId);
            },

            rowClick(record) {
                // 事件
                return {
                    on: {
                        click: () => {
                            this.selectedRowInfor = this.concatProjectInfro(record)
                            this.selectMould = record;
                        }
                    },
                    style: {
                        'background-color': this.concatProjectInfro(record) === this.selectedRowInfor ? '#e6f7ff' : 'white'
                    },
                }
            },

            concatProjectInfro(record) { // 拼接项目信息 用来 确定某一行 高亮
                // return record.projectNumber + record.modelNumber + record.productionProject + record.productionType;
                return record.id;
            },
            add() {
                this.visible = true;
            },
            handleOk() {
                this.dataSource = [];
                this.visible = false;
                this.projectNumber = '';
                this.selectMould = {};
            },
            handleCancel() {
                this.visible = false;
                this.dataSource = [];
                this.projectNumber = '';
                this.selectMould = {};
            },
            tableChange(val) {
                console.log(val);
            },
            pageChange(val) { // 分页改变
                // console.log(val);
                this.currentPage = val;
                getMould({
                    component: this.projectNumber,
                    pageNO: this.currentPage,
                    pageSize: this.pageSize,
                }).then((data) => {
                    this.total = data.result.total;
                    this.currentPage = data.result.current;
                    this.pageSize = data.result.size;
                    this.pageNum = data.result.pages;
                    this.dataSource = data.result.records;
                })
            },
            pageJump(page) { // 点击指定分页跳转的情况下
                if (page > this.pageNum) {
                    page = this.pageNum;
                    this.jumpPage = this.pageNum;
                } else if (page < 1) {
                    page = 1;
                    this.jumpPage = 1;
                }
                this.currentPage = page;
                getMould({
                    component: this.projectNumber,
                    pageNO: this.currentPage,
                    pageSize: this.pageSize
                }).then((data) => {
                    this.total = data.result.total;
                    this.currentPage = data.result.current;
                    this.pageSize = data.result.size;
                    this.pageNum = data.result.pages;
                    this.dataSource = data.result.records;
                })
            },
            search() {
                this.dataSource = [];
                getMould({
                    component: this.projectNumber,
                    pageNO: 1,
                    pageSize: this.pageSize
                }).then((data) => {
                    this.total = data.result.total;
                    this.currentPage = data.result.current;
                    this.pageSize = data.result.size;
                    this.pageNum = data.result.pages;
                    this.dataSource = data.result.records;
                })
            },
        }
    }
</script>

<style scoped lang="less">
  @import "./../../css/public-table-css";
  /deep/ .ant-modal-title {
    font-weight: bold;
  }
  .search-frame{
    margin-bottom: 20px;
  }
  .left-text{
    width: 120px;
  }
  .search-table{
    min-height: 300px;
  }
  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }
  // 被选中的表格行的样式
  .clickRowStyl{
    background-color: #00b4ed
  }
  .ant-table-tbody>.clickRowStyl:hover>td{
    background-color: #00b4ed
  }
  .alerm .rowcolor{
    color: #00b4ed;
  }
  .alerm .rowcolor2{
    background: blue;
  }
  .search-hidden-text{
    padding-left: 20px;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      left: 10px;
      height: 20px;
      width: 4px;
      background-color:  #1790FA;
      border-radius: 2px;
    }
  }
  /deep/ .ant-card-body{
    padding: 10px !important;
  }
  /deep/ td{
    text-align: left !important;
  }
  /deep/ th{
    text-align: left !important;
  }

</style>
