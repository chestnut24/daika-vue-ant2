<template>
  <div style="overflow-x: auto"  class="jn-public-table">
    <div style="padding: 16px;background-color: white;min-width: 1600px">
      <div class="search-container">
        <a-form layout="inline">
          <a-row type="flex" align="middle" :gutter="[0,16]">
            <a-col :md="6" :sm="6" class="flex-left">
              <div>戴卡部件号:</div>
              <a-form-item>
                <a-input style="width: 244px" placeholder="请输入戴卡部件号" v-model="queryParam.projectNo"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="6" class="flex-left">
              <div style="">项目经理:</div>
              <a-form-item>
                <a-input style="width: 244px" placeholder="请输入项目经理" v-model="queryParam.projectManager"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="6" class="flex-left">
              <div style="">试制单编号:</div>
              <a-form-item>
                <a-input style="width: 244px" placeholder="请输入试制单编号" v-model="queryParam.trialProductionFormNo"></a-input>
              </a-form-item>
            </a-col>

            <a-col v-if="isShowOtherButtons" :md="6" :sm="6" class="flex-left">
              <div style="margin-right: 34px">交付日期:</div>
              <a-form-item>
                <a-range-picker
                        :show-time="{ format: 'HH:mm:ss' }"
                        format="YYYY-MM-DD"
                        @change="trialDeliverDateChange"
                        v-model="deliveryDate"
                        style="width: 244px"
                ></a-range-picker>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="6" >
              <a style="margin-right: 20px" @click="isShowOtherButtons = !isShowOtherButtons"> {{isShowOtherButtons?"收起":"展开"}} <a-icon :type="isShowOtherButtons?'up':'down'" /> </a>
              <a-button style="margin-right: 8px" type="primary" @click="search()">查询</a-button>
              <a-button style="margin-right: 8px" @click="searchReset()">重置</a-button> &nbsp;
            </a-col>
            <!--          <a-col :md="2" :sm="2">-->
            <!--          </a-col>-->
          </a-row>
<!--          <a-row>-->
<!--            <a-col v-if="isShowOtherButtons" :md="8" :sm="8" class="flex-left">-->
<!--              <div style="margin-right: 34px">交付日期</div>-->
<!--              <a-form-item>-->
<!--                <a-range-picker-->
<!--                        :show-time="{ format: 'HH:mm:ss' }"-->
<!--                        format="YYYY-MM-DD"-->
<!--                        @change="trialDeliverDateChange"-->
<!--                        v-model="deliveryDate"-->
<!--                        style="width: 244px"-->
<!--                ></a-range-picker>-->
<!--              </a-form-item>-->
<!--            </a-col>-->
<!--          </a-row>-->
        </a-form>
      </div>
      <div style="margin: 20px 0;text-align: right">

      </div>
    </div>
    <div style="margin-top: 12px;padding: 16px;background-color: #fff;overflow-x: auto;min-width: 1600px;">
      <div style="padding: 12px;padding-top:0;display: flex;justify-content: space-between">
        <h3><b>试制计划预排列表</b></h3>
        <a-button style="margin-right: 32px" type="primary" @click="visible1 = true">负荷率统计</a-button>
      </div>

<!--      <table>-->
<!--        <tr>-->
<!--          <th>试制单编号</th>-->
<!--          <th>戴卡部件号</th>-->
<!--          <th>试制单创建日期</th>-->
<!--          <th>项目经理</th>-->
<!--          <th>计划发样时间</th>-->
<!--          <th>计划毛坯数</th>-->
<!--          <th>交付日期</th>-->
<!--          <th style="width: 400px">试制用途</th>-->
<!--          <th>计划量产地</th>-->
<!--          <th style="position: sticky;right: -15px;width: 180px">操作</th>-->
<!--        </tr>-->
<!--        <tr v-for="data in tableData" :style="{'background-color': data.instructionNum > 0 ? 'rgb(237,117,132)':'#fff'}">-->
<!--          <td @click="routerLink(data)"><a>{{data.trialProductionFormNo}}</a></td>-->
<!--          <td @click="showProjectDetail(data)"><a>{{data.projectNo}}</a></td>-->
<!--          <td>{{data.createTime}}</td>-->
<!--          <td>{{data.projectManager}}</td>-->
<!--          <td>{{data.planSendSamplesDt}}</td>-->
<!--          <td>{{data.planRoughcastNum}}</td>-->
<!--          <td>{{data.deliverDt}}</td>-->

<!--          <td style="max-width: 400px;overflow-x: auto">-->
<!--            <table class="inner-table">-->
<!--              <tr>-->
<!--                <td>试制用途</td>-->
<!--                <td v-for="purpose in data.purposes">{{purpose.purpose}}</td>-->
<!--              </tr>-->
<!--              <tr>-->
<!--                <td>数量</td>-->
<!--                <td v-for="purpose in data.purposes">{{purpose.number}}</td>-->
<!--              </tr>-->
<!--            </table>-->
<!--          </td>-->

<!--          <td>{{data.planProductPlace}}</td>-->
<!--          <td style="position: sticky;right: -15px;background-color: #fff;width: 180px">-->
<!--            <router-link  :to="{path:'/trial/filling', query: { id: data.id, isSee:true }}" >查看</router-link> &nbsp;-->
<!--            <span v-if="data.status == 3">-->
<!--            <a @click="showConfirm('撤回', data)">撤回</a>-->
<!--          </span>-->
<!--            <span v-if="data.status == 2 || data.status == -3">-->
<!--            <router-link :to="{path:'/trial/filling', query: { id: data.id, isSee: false }}">预排</router-link> &nbsp; <a @click="showConfirm('退回', data)">退回</a>-->
<!--          </span>-->
<!--          </td>-->
<!--        </tr>-->
<!--        <tr v-if="!tableData.length">-->
<!--          <td colspan="10">-->
<!--            <a-empty  />-->
<!--          </td>-->
<!--        </tr>-->
<!--      </table>-->
      <a-table
              ref="table"
              size="middle"
              bordered
              :columns="columns"
              :dataSource="tableData"
              :scroll="{ x: 2500, y: 400 }"
              :pagination=false>
        <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
          <router-link  :to="{path:'/trial/filling', query: { id: operate.id, isSee:true }}" >查看</router-link> &nbsp;
          <span v-if="operate.status == 3">
            <a @click="showConfirm('撤回', data)">撤回</a>
          </span>
          <span v-if="operate.status == 2 || operate.status == -3">
            <router-link :to="{path:'/trial/filling', query: { id: operate.id, isSee: false }}">预排</router-link> &nbsp; <a @click="showConfirm('退回', operate)">退回</a>
          </span>
        </a-space>
        <a-space slot="purposesTab" slot-scope="text, operate, i" class="operate-row">
          <row-table :columns="rowColumns" :data-source="operate.purposes" maxWidth="400px"></row-table>
        </a-space>
      </a-table>
      <project-information ref="projectInfor"></project-information>
      <div style="text-align: right; margin-top: 15px">
        <a-pagination
                show-size-changer
                :default-current="1"
                :total="total"
                :hideOnSinglePage="true"
        />
      </div>
      <a-modal v-model="visible1" title="负荷率维护" :width="800" okText="保存" @ok="saveModal">
        <div style="overflow-x: auto">
          <table class="modal-table">
            <tr>
              <th rowspan="2" style="min-width: 150px;">试制地</th>
              <th v-for="(data,key) in modalTitle" :colspan="data">{{key}}</th>
            </tr>
            <tr>
              <th v-for="data in modalData">{{data.processTechnology}}</th>
            </tr>
            <tr>
              <td>当前负荷率%</td>
              <td v-for="data in modalData">
                <!--            <span v-if="data.currentLoadRate">{{data.currentLoadRate}}</span>-->
                <a-input type="number" v-model="data.currentLoadRate" style="text-align: center"/>
              </td>
            </tr>
            <tr>
              <td>负荷率报警值%</td>
              <td v-for="data in modalData">
                <!--            <span v-if="data.alarmLoadRate">{{data.alarmLoadRate}}</span>-->
                <a-input type="number" v-model="data.alarmLoadRate" style="text-align: center"/>
              </td>
            </tr>
          </table>
        </div>
      </a-modal>

    </div>

  </div>

</template>

<script>
    import {listFormPrearrangement,   listLoadRate, saveOrUpdateLoadRate, backPrearrangement, cancelPrearrangement } from "@/api/api";
    import ProjectInformation from '../system/ProjectInformation';
    import RowTable from '../component/RowTable';
    export default {
        name: 'PlanningScheduling',
        components: { ProjectInformation, RowTable },
        data() {
            return {
                deliveryDate: [], // 维护日期 用于绑定model清空
                // 请求参数
                queryParam: {
                    projectManager: '', // 项目经理
                    trialProductionFormNo: '', // 试制流转单编号
                    projectNo: '', // 戴卡项目号
                    deliverDtBegin: null, // 交付日期从
                    deliverDtEnd: null, // 到
                    pageNo: 1,
                    pageSize: 10,
                    column :'project_no',
                    order :'asc'
                },
                tableData: [],
                total: 0,
                visible1: false,
                modalData: [],
                modalTitle: {},
                columns:[
                  { title: '试制单编号', width:250, dataIndex: 'trialProductionFormNo', key: 'trialProductionFormNo', align: 'left', },
                  { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'left', },
                  { title: '试制单创建日期',width:250, dataIndex: 'createTime', key: 'createTime', align: 'left', },
                  { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'left', },
                  { title: '计划发样时间', dataIndex: 'planSendSamplesDt', key: 'planSendSamplesDt', align: 'left', },
                  { title: '计划毛坯数', dataIndex: 'planRoughcastNum', key: 'planRoughcastNum', align: 'left', },
                  { title: '交付日期', dataIndex: 'deliverDt', key: 'deliverDt', align: 'left', },
                  { title: '试制用途', dataIndex: 'purposesTab', key: 'purposesTab',width: 650, align: 'left', scopedSlots: { customRender: 'purposesTab' },},
                  { title: '计划量产地', dataIndex: 'planProductPlace', key: 'planProductPlace', align: 'left'},
                  { title: '操作',
                    dataIndex: 'operate',
                    key: 'operate',
                    align: 'center',
                    width:200,
                    fixed: 'right',
                    scopedSlots: { customRender: 'operate' }, },
                ],
              isShowOtherButtons: false,
              rowColumns: [ // 行内表格
                { title: '试制用途', dataIndex: 'purpose' },
                { title: '数量', dataIndex: 'number' },
              ],
            }
        },
        mounted() {
          console.log("I am in PlanningScheduling")
            listLoadRate().then(res => {
                this.modalData = res.result.sort((a, b) => a.productPlace > b.productPlace ? 1 : -1);
                const obj = {};
                this.modalData.forEach(item => {
                    if (obj[item.productPlace]) {
                        obj[item.productPlace]++
                    } else {
                        obj[item.productPlace] = 1;
                    }
                })
                this.modalTitle = obj;
            });
            this.search();
        },
        methods: {
            trialDeliverDateChange(value, dateString) { // 交付时间改变
                if (value && value[0] && value[1]) {
                    this.queryParam.deliverDtBegin = value[0].format('YYYY-MM-DD 00:00:00');
                    this.queryParam.deliverDtEnd = value[1].format('YYYY-MM-DD 23:59:59');
                } else {
                    this.queryParam.deliverDtBegin = null;
                    this.queryParam.deliverDtEnd = null;
                }

            },
            search() {
                let param = this.queryParam;
                param.column = 'create_time';
                param.order = 'desc';
                listFormPrearrangement(param).then(res => {
                    this.tableData = res.result.records;
                    this.total = res.result.total;
                })
            },
            saveModal() {
                saveOrUpdateLoadRate(this.modalData).then(res => {
                    if (res.success) {
                        this.$message.success('保存成功');
                        this.visible1 = false;
                    } else {
                        this.$message.error(`保存失败 ${res.message}`);
                    }

                }, error => {
                    this.$message.success('保存失败');
                })
            },
            showProjectDetail(operate, index) {
                this.$refs.projectInfor.getData(operate.projectId);
            },
            routerLink(data) {
                this.$router.push({
                    path: `/trial/trialForm`,
                    query: {
                        id: data.id,//试制单主键  在你那边接口 formBaseId
                        no: data.trialProductionFormNo,//试制单编号  你那边接口 trialProductionFormNo
                    },
                })
            },
            back(data) {
                backPrearrangement({id: data.id}).then(res => {
                    if (res.success) {
                        this.$message.success('退回成功');
                        this.search();
                    } else {
                        this.$message.success(`退回失败 ${res.message}`);
                    }
                }, error => {
                    this.$message.success('退回失败');
                })
            },
            cancel(data) {
                cancelPrearrangement({id: data.id}).then(res => {
                    if (res.success) {
                        this.$message.success('撤回成功');
                        this.search();
                    } else {
                        this.$message.success(`撤回失败 ${res.message}`);
                    }
                }, error => {
                    this.$message.success('撤回失败');
                })
            },
            searchReset() {
                this.queryParam =  {
                    projectManager: '',
                    trialProductionFormNo: '',
                    projectNo: '',
                    deliverDtBegin: null,
                    deliverDtEnd: null,
                    pageNo: 1,
                    pageSize: 10,
                };
                this.deliveryDate = [];
            },
            showConfirm(operation, data) {
              this.$confirm({
                title: '',
                content: `确定要${operation}吗`,
                onOk:()=> {
                  console.log('OK');
                  if (operation === '撤回') {
                    this.cancel(data)
                  } else if (operation === '退回'){
                    this.back(data);
                  }
                },
                onCancel() {
                  console.log('Cancel');
                }
              });
            },
        }
    }
</script>

<style scoped lang="less">
  @import "./../../css/public-table-css";
  .search-container {
    .special-date {
      height: 40px;
      width: 40px;
      span {
        text-decoration: underline;
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
  }
  table{
    border-left: 1px solid #e8e8e8;
    border-top: 1px solid #e8e8e8;
    width: 100%;
    overflow-x: auto;
    position: relative;
    td,th{
      padding: 16px;
      /*min-width: 200px;*/
      text-align: center;
      border-right: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
    }
    th{
      font-size: 16px;
      color: rgba(0,0,0,.65) !important;
      padding: 12px 16px !important;
      background-color: #F4F5F7;
    }
    td {
      font-size: 16px;
      color: rgba(0, 0, 0, .85) !important;
      padding: 8px 16px !important;
      max-height: 24px;
    }
    tr:nth-child(even){
      background-color: #F3F7F9
    }
    .inner-table{
      border-left: 1px solid #e8e8e8;
      border-top: 1px solid #e8e8e8;
      td,th{
        padding: 4px 16px !important;
        text-align: center;
        border-right: 1px solid #e8e8e8;
        border-bottom: 1px solid #e8e8e8;
        min-width: 100px;
      }
      tr:nth-child(even){
        background-color: #fff;
      }
      tr:nth-child(odd){
        background-color: #F3F7F9
      }
    }
  }
  .modal-table{
    border-left: 1px solid #e8e8e8;
    border-top: 1px solid #e8e8e8;
    width: 100%;
    td,th{
      /*padding: 16px;*/
      min-width: 150px;
      text-align: center;
      border-right: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
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
          background-color: #fff !important;
        }
        tr:nth-child(odd){
          background-color: #F3F7F9;
        }
      }
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
