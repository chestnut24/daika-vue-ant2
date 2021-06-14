<template>
  <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :customRow="customRow"
        :pagination=false
        :loading="loading"
        :scroll="{ x: 2980 }"
       >
        <div slot="filterDropdown">
          <a-card>
            <a-checkbox-group @change="onColSettingsChange" v-model="settingColumns" :defaultValue="settingColumns">
              <a-row style="width: 400px;padding: 12px">
                <template v-for="(item,index) in defColumns">
                  <template v-if="item.key!='rowIndex'&& item.dataIndex!='action'">
                    <a-col :span="12"><a-checkbox :value="item.dataIndex">{{ item.title }}</a-checkbox></a-col>
                  </template>
                </template>
              </a-row>
            </a-checkbox-group>
          </a-card>
        </div>
        <a-icon slot="filterIcon" type='profile' :style="{ fontSize:'16px',color:  '#108ee9' }" />
        <!--试制单编号-->
        <template slot="trialProductionFormNo" slot-scope="text, record">
          <a @click="handleDetails(record)">{{record.trialProductionFormNo}}</a>
        </template>
        <!--戴卡-->
        <template slot="projectNo" slot-scope="text, record">
          <a  @click="showProjectDetail(record.projectId)">
            {{record.projectNo}}
          </a>
        </template>
        <template slot="planSendSamplesDt" slot-scope="text, record">
          <span>{{moment(record.planSendSamplesDt).format('YYYY.MM.DD')}}</span>
        </template>

        <template slot="maxCompletionDate" slot-scope="text, record">
          <span>{{moment(record.maxCompletionDate).format('YYYY.MM.DD')}}</span>
        </template>

        <template slot="deliverDt" slot-scope="text, record">
          <span>{{moment(record.deliverDt).format('YYYY.MM.DD')}}</span>
        </template>
        <!--用途-->
        <template slot="purposesTab" slot-scope="text, record" class="operate-row">
          <row-table :columns="rowColumns"  :data-source="record.purposes" class="rowTable" maxWidth="650px"></row-table>
        </template>
        <!--工序-->
        <template slot="workStr" slot-scope="text, record">
          <template v-if="record.workStr.length>32">
            <template v-for="(item,index) in record.workStr">
              <span v-if="(index+1)%32==0">{{item}}-<br></span>
              <span v-else>{{item}}</span>
            </template>
          </template>
          <span v-else>{{record.workStr}}</span>
        </template>
        <!--试制策划-->
        <template slot="taskWorkList" slot-scope="text, record">
          <table class="tg">
              <tr>
                <th v-for="(item,index) in record.taskWorkList" :key="index" class="tg-0pky">{{item.processTechnologyName}}</th>
              </tr>
              <tr>
                <!--有权限是蓝色，无权限或全部完成是灰色-->
                <td v-for="(item,index) in record.taskWorkList" class="tg-0pky" style="padding:4px 16px !important;">
                  <template v-if="userInfo.technologyList.find(ite=>{return ite==item.processTechnologyName})" >
                    <a v-if="item.splitStatus==2" @click="handleSplitTheBill(record,index) "
                       :class="{'fontColor':(record.taskWorkList.filter(sp=>{return sp.splitStatus==0 || sp.planStatus==0 || sp.planStatus==2 }).length==0)}"
                    >未拆单</a>
                    <a v-else-if="item.splitStatus==1" @click="handleSplitTheBill(record,index)"
                       :class="{'fontColor':(record.taskWorkList.filter(sp=>{return sp.splitStatus==0 || sp.planStatus==0 || sp.planStatus==2 }).length==0)}"
                    >已拆单</a>
                    <a v-else-if="item.splitStatus==0" @click="handleSplitTheBill(record,index)">待拆单</a>
                  </template>

                  <template v-else>
                    <span v-if="item.splitStatus==2" class="fontColor">未拆单</span>
                    <span v-else-if="item.splitStatus==1" class="fontColor">已拆单</span>
                    <span v-else-if="item.splitStatus==0" class="fontColor">待拆单</span>
                  </template>
                </td>
              </tr>
              <tr>
                <td v-for="(item,index) in record.taskWorkList" class="tg-0pky" style="padding:4px 16px !important;">
                  <div v-if="item.splitStatus!=0">
                    <template v-if="userInfo.technologyList.find(ite=>{return ite==item.processTechnologyName})" >
                      <a v-if="item.planStatus==1" :key="index" @click="handlePlan(record,index)"
                         :class="{'fontColor':(record.taskWorkList.filter(sp=>{return sp.splitStatus==0 || sp.planStatus==0 || sp.planStatus==2 }).length==0)}"
                      >
                        已策划</a>
                      <a v-if="item.planStatus==2" :key="index" @click="handlePlan(record,index)"
                         :class="{'fontColor':(record.taskWorkList.filter(sp=>{return sp.splitStatus==0 || sp.planStatus==0 || sp.planStatus==2 }).length==0)}"
                      >
                        待确定</a>
                      <a v-if="item.planStatus==0" :key="index" @click="handlePlan(record,index)"
                         :class="{'fontColor':(record.taskWorkList.filter(sp=>{return sp.splitStatus==0 || sp.planStatus==0 || sp.planStatus==2 }).length==0)}"
                      >
                        未策划</a>
                    </template>
                    <template v-else>
                      <a v-if="item.planStatus==1" :key="index" @click="handlePlan(record,index)" class="fontColor">已策划</a>
                      <a v-if="item.planStatus==2" :key="index" @click="handlePlan(record,index)" class="fontColor">待确定</a>
                      <a v-if="item.planStatus==0" :key="index" @click="handlePlan(record,index)" class="fontColor">未策划</a>
                    </template>
                  </div>
                  <a v-if="item.splitStatus==0" class="fontColor" title="请先拆单再策划">&#45;&#45;</a>
                </td>
              </tr>
          </table>
        </template>
        <span slot="action" slot-scope="text, record" class="publicFlex">
           <a-popconfirm v-if="(record.taskWorkList.filter(plan=>{ return plan.planStatus==0}).length>0 || record.taskWorkList.filter(sp=>{ return sp.splitStatus==0}).length>0 )" title="确定退回吗?" @confirm="() => handleBack(record)">
                  <a>退回 </a>
           </a-popconfirm>
           <a-popconfirm v-if="(record.taskWorkList.filter(sta=>{ return sta.planStatus==0}).length==0 && record.taskWorkList.filter(stu=>{ return stu.splitStatus==0}).length==0)" title="确定撤回吗?" @confirm="() => handleWithdraw(record)">
                  <a>撤回 </a>
           </a-popconfirm>
          <a href="javascript:;" @click="handleDetails(record)">查看</a>
        </span>

      </a-table>

    <!-- table区域-end -->
    <!--    分页-->
    <div class="bottom-page" v-if="dataSource.length>0">
      <a-pagination
        :total=page.total
        :show-total="total => `共 ${total} 条`"
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
    <!-- 表单区域 -->
    <project-information ref="projectInfor"></project-information>
    <!--拆单-->
    <split-the-bill-model ref="billmodel" @ok="modalFormOk"/>
  </div>
</template>

<script>
    import { filterObj } from '@/utils/util';
    import Vue from 'vue'
    import {postAction,getAction} from '@/api/manage'
    import RowTable from '../component/RowTable'
    import ProjectInformation from '../system/ProjectInformation'
    import moment from "moment"
    import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
    import SplitTheBillModel from './modules/SplitTheBillModel'
    export default {
        name: "TaskManageListTab1",
        components: { SplitTheBillModel, ProjectInformation, RowTable },
        props: ['queryParams', 'isSearch'],
        data() {
            return {
                description: '车间任务接收',
                moment,
                defColumns:[ // 表头
                    { title: '试制地', dataIndex: 'trialProductionSite', width: 150, },
                    { title: '试制单编号', dataIndex: 'trialProductionFormNo', width: 220,scopedSlots: { customRender: 'trialProductionFormNo' } },
                    { title: '戴卡部件号',sorter: true, dataIndex: 'projectNo',width:160,scopedSlots: { customRender: 'projectNo' }  },
                    { title: '工序', dataIndex: 'workStr', width:410,scopedSlots: { customRender: 'workStr' }},
                    { title: '项目经理',dataIndex: 'projectManager',width: 150,},
                    { title: '计划发样时间', dataIndex: 'planSendSamplesDt',width: 150,scopedSlots: { customRender: 'planSendSamplesDt' }},
                    { title: '预计完成时间', dataIndex: 'maxCompletionDate',width: 150,scopedSlots: { customRender: 'maxCompletionDate' } },
                    { title: '计划毛坯数', dataIndex: 'planRoughcastNum',width: 150},
                    { title: '交付日期', dataIndex: 'deliverDt',width: 150,scopedSlots: { customRender: 'deliverDt' }},
                    { title: '试制用途', dataIndex: 'purposesTab',width:650,scopedSlots: { customRender: 'purposesTab' } },
                    { title: '计划量产地', dataIndex: 'planProductPlace',width: 150,},
                    { title: '试制策划', dataIndex: 'taskWorkList',width: 530,scopedSlots: { customRender: 'taskWorkList' } },
                    { title: '操作', dataIndex: 'action',width: 150,align: 'center',fixed: 'right',
                        scopedSlots: {
                            filterDropdown: 'filterDropdown',
                            filterIcon: 'filterIcon',
                            customRender: 'action'},
                    },
                ],
                /* table加载状态 */
                loading:false,
                // 分页
                page: { // 分页
                    total: 0, // 共多少条
                    pageSize:10, // 一页多少条
                    pageNum: 0, // 共多少页
                    currentPage: 1, // 当前页
                    jumpPage: 1, // 跳转到第几页,
                },
                //表头
                columns:[],
                /* 数据源 */
                dataSource:[],
                //列设置
                settingColumns:[],
                rowColumns: [ // 行内表格
                    { title: '试制用途', dataIndex: 'purpose' },
                    { title: '数量', dataIndex: 'number' },
                ],
                queryParam: {noPlan:1},
                splitTheBillList:[],
                planList:[],
                url: {
                    list: "/trial/task/listTaskReceivedPage",
                    backInfo:'/trial/task/backTask',
                    rollbackPlanTask:'/trial/task/rollbackPlanTask'
                }
            }
        },
        mounted() {
            this.initColumns();
            this.loadData();
        },
        computed: {
            userInfo() {
                //userInfo.siteList     (负责多个试制地，大概率是一条数据)
                //userInfo.technologyList   (负责多个工序)
                return this.$store.getters.userInfo
            },
        },
        methods: {
            modalFormOk() {
                // 新增/修改 成功时，重载列表
                this.loadData();
                //清空列表选中
                this.onClearSelected()
            },
            onClearSelected() {
                this.selectedRowKeys = [];
                this.selectionRows = [];
            },
            loadData(arg) {
                if(!this.url.list){
                    this.$message.error("请设置url.list属性!")
                    return
                }
                //加载数据 若传入参数1则加载第一页的内容
                if (arg === 1) {
                    this.page.current = 1;
                }
               // var params = this.getQueryParams();//查询条件
                this.queryParam.pageNo = this.page.currentPage;
                this.queryParam.pageSize = this.page.pageSize;
                let params=this.queryParam
                params['column'] = 'deliver_dt';
                params['order'] = 'asc';
                this.loading = true;
                getAction(this.url.list, params).then((res) => {
                    if (res.success) {
                        //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
                        this.dataSource = res.result.records||res.result;
                        if(res.result.total)
                        {
                            this.page.total = res.result.total;
                            this.page.pageNum = res.result.pages;
                        }else{
                            this.page.total = 0;
                        }
                        //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
                    }
                    if(res.code===510){
                        this.$message.warning(res.message)
                    }
                    this.loading = false;
                })
            },
            customRow(record, index) {
              return {
                style: {
                  'background' : record.instructionNum > 0 ? '#ec808d' : ''
                }
              }
            },
            // 分页
            pageChange(val) { // 分页改变
                this.page.currentPage = val;
                this.loadData();
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
                this.loadData();
            },
            /*撤回*/
            handleWithdraw(record){
                if(!this.url.rollbackPlanTask){
                    this.$message.error("请设置url.rollbackPlanTask属性!")
                    return
                }
                let that = this;
                let param = {};//重组撤回参数
                param.taskId = record.id;
                param.formBaseId = record.formBaseId;
                param.processTechnologyName = that.userInfo.technologyList[0];
                param.trialProductionSite = record.trialProductionSite;
                postAction(that.url.rollbackPlanTask,param).then((res) => {
                    if (res.success) {
                        that.$message.success(res.message);
                        that.loadData();
                    } else {
                        that.$message.warning(res.message);
                    }
                });
            },
            /*退回*/
            handleBack(record) {
                if(!this.url.backInfo){
                    this.$message.error("请设置url.backInfo属性!")
                    return
                }
                let that = this;
                postAction(that.url.backInfo,{id:record.formBaseId}).then((res) => {
                    if (res.success) {
                        that.$message.success(res.message);
                        that.loadData();
                    } else {
                        that.$message.warning(res.message);
                    }
                });
            },
            initDictConfig(){
                //初始化字典 - 拆单
                initDictOptions('form_task_split_status').then((res) => {
                    if (res.success) {
                        this.splitTheBillList = res.result;
                    }
                });
                /*策划*/
                initDictOptions('form_task_plan_status').then((res) => {
                    if (res.success) {
                        this.planList = res.result;
                    }
                });
          },
            //列设置更改事件
            onColSettingsChange (checkedValues) {
                var key = this.$route.name+":colsettings";
                Vue.ls.set(key, checkedValues, 7 * 24 * 60 * 60 * 1000)
                this.settingColumns = checkedValues;
                const cols = this.defColumns.filter(item => {
                    if(item.key =='rowIndex'|| item.dataIndex=='action'){
                        return true
                    }
                    if (this.settingColumns.includes(item.dataIndex)) {
                        return true
                    }
                    return false
                })
                this.columns =  cols;
            },
            initColumns(){
                //权限过滤（列权限控制时打开，修改第二个参数为授权码前缀）
                //this.defColumns = colAuthFilter(this.defColumns,'testdemo:');
                var key = this.$route.name+":colsettings";
                let colSettings= Vue.ls.get(key);
                if(colSettings==null||colSettings==undefined){
                    let allSettingColumns = [];
                    this.defColumns.forEach(function (item,i,array ) {
                        allSettingColumns.push(item.dataIndex);
                    })
                    this.settingColumns = allSettingColumns;
                    this.columns = this.defColumns;
                }else{
                    this.settingColumns = colSettings;
                    const cols = this.defColumns.filter(item => {
                        if(item.key =='rowIndex'|| item.dataIndex=='action'){
                            return true;
                        }
                        if (colSettings.includes(item.dataIndex)) {
                            return true;
                        }
                        return false;
                    })
                    this.columns =  cols;
                }
            },
            /*拆单*/
            handleSplitTheBill(record,index){
                if(record.formStatus==10){
                    this.$message.warning('该试制单已关闭，不可操作')
                }else {
                    let disabled = false
                    if (record.taskWorkList[index].splitStatus != 0 ? record.taskWorkList[index].planStatus == 1 : false) {
                        disabled = true
                    } else {
                        disabled = false
                    }
                    if (record.taskWorkList[index + 1]) {
                        if (record.taskWorkList[index + 1].splitStatus == 0 ? true : record.taskWorkList[index + 1].planStatus == 0 || record.taskWorkList[index+1].planStatus==2) {
                            this.$message.warning('前一个工序没完成当前不能操做')
                            return false
                        } else {
                            record.processTechnologyName = record.taskWorkList[index].processTechnologyName
                            record.workTaskId = record.taskWorkList[index].id
                            console.log('拆单', record);
                            this.$refs.billmodel.add(record, index)
                            this.$refs.billmodel.isDisabled = disabled
                            this.$refs.billmodel.title = "拆单";
                            this.$refs.billmodel.disableSubmit = false;
                        }
                    } else {
                        record.processTechnologyName = record.taskWorkList[index].processTechnologyName
                        record.workTaskId = record.taskWorkList[index].id
                        console.log('拆单', record);
                        this.$refs.billmodel.add(record, index)
                        this.$refs.billmodel.isDisabled = disabled
                        this.$refs.billmodel.title = "拆单";
                        this.$refs.billmodel.disableSubmit = false;
                    }
                }
            },
            /*策划*/
            handlePlan(record,index){
                if(record.formStatus==10){
                    this.$message.warning('该试制单已关闭，不可操作')
                }else{
                    if(record.taskWorkList[index+1]){
                        if(record.taskWorkList[index+1].splitStatus==0?true:record.taskWorkList[index+1].planStatus==0 || record.taskWorkList[index+1].planStatus==2){
                            this.$message.warning('前一个工序没完成当前不能操做')
                            return false
                        }else{
                            this.$router.push({path:'/trialManage/modules/PlanList',query: {taskWorkListId:JSON.stringify(record.taskWorkList[index].id),ruleCode:JSON.stringify(record.taskWorkList[index].processTechnologyName)}})
                        }
                    }else{
                        this.$router.push({path:'/trialManage/modules/PlanList',query: {taskWorkListId:JSON.stringify(record.taskWorkList[index].id),ruleCode:JSON.stringify(record.taskWorkList[index].processTechnologyName)}})
                    }
                }
            },
            showProjectDetail(id) {
                this.$refs.projectInfor.getData(id);
            },
            handleDetails(record){
                this.$router.push({
                    path: `/trial/trialForm`,
                    query: {
                        id: record.formBaseId,//试制单主键  在你那边接口 formBaseId
                        no: record.trialProductionFormNo,//试制单编号  你那边接口 trialProductionFormNo
                    },
                })
            },
        }
    }
</script>
<style scoped lang="less">
  .fontColor {
    color: #7F7F7F !important;
    a{
      color: #7F7F7F !important;
    }
  }
  .operate-row {
    .ant-btn {
      padding: 0;
    }
  }
  .tg  {border-collapse:collapse;border-spacing:0;width:auto !important;min-width:auto !important;}
  .tg td,.tg th{border-color:#e8e8e8;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:16px;
    overflow:hidden;word-break:normal;}
  .tg tr th{
    background: #e3f1fa;
  }
  .tg .tg-0pky{border-color:#e8e8e8;text-align:center;padding: 4px 16px;font-weight: normal}
  .publicFlex {
    /*兼容各大浏览器*/
    display: flex;
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    /*定义子元素排列*/
    flex-direction: row;
    -webkit-box-direction: normal;
    -moz-box-orient: horizontal;
    -moz-box-direction: normal;
    -webkit-flex-direction: row;
    /*定义子元素换行情况*/
    -webkit-flex-wrap: nowrap;
    -moz-flex-wrap: nowrap;
    flex-wrap: nowrap;
    -webkit-box-orient: horizontal;
    box-orient: horizontal;
    /*横向排列布局*/
    justify-content: space-around;
    -webkit-justify-content: space-around;
    -moz-box-pack: justify;
    -webkit--moz-box-pack: justify;
    box-pack: justify;
    font-size: 14px;
  }
  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }
  @import "./../../css/public-table-css";
  @import '~@assets/less/custom-table-search.less';
  /deep/ .ant-card-body{
    padding:0 !important;
  }
  /deep/ .ant-card-bordered{
    border:none !important;
  }
  /deep/ .ant-table{
    top: -16px;
  }
  .bottom-page{
    margin-top: 0;
  }
 .tg  /deep/ .tg-0pky{
    padding:4px 16px !important;
  }
 /deep/ .rowTable{
   width: auto;
   min-width: auto;
 }
</style>