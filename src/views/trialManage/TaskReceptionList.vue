<template>
  <div style="overflow-x: auto">
    <div style="min-width: 1600px;">
      <a-card class="card1">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline" @keyup.enter.native="searchQuery" class="formSearch">
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item label="试制单编号">
                  <a-input placeholder="请输入试制单编号" v-model="queryParam.trialProductionFormNo"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="戴卡部件号">
                  <a-input placeholder="请输入戴卡部件号" v-model="queryParam.projectNo"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="项目经理" >
                  <a-input placeholder="请输入项目经理" v-model="queryParam.projectManager"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6" v-show="isShowOtherButtons" >
                <a-form-item label="  交付日期 ">
                  <a-range-picker v-model="plannedTime" format="YYYY-MM-DD" :placeholder="['开始时间', '结束时间']" @change="changeTime" />
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item >
                  <a style="margin-left:72px;margin-right: 20px" @click="isShowOtherButtons = !isShowOtherButtons"> {{isShowOtherButtons?"收起":"展开"}} <a-icon :type="isShowOtherButtons?'up':'down'" /> </a>
                  <a-button type="primary" @click="searchQuery">查询</a-button>
                  <a-button  @click="searchResets"  style="margin-left: 8px">重置</a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-card>
      <a-card class="card1" style="margin-top: 12px;" title="车间任务接收列表">
        <!-- table区域-begin -->
        <div>
          <a-table
            ref="table"
            bordered
            size="middle"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination=false
            :loading="loading"
            :scroll="{ x: 2980 }"
            @change="handleTableChange"
            :customRow="customRow">
            <!--        <div slot='trialProductionFormNo'></div>-->
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
            <!--用途-->
            <template slot="purposesTab" slot-scope="text, record" class="operate-row">
              <row-table :columns="rowColumns" :data-source="record.purposes" maxWidth="650px"></row-table>
            </template>
            <!--预排信息-->
            <template slot="information" slot-scope="text, record">
              <row-table :columns="rowColumns2" :data-source="record.prearrangementList" maxWidth="880px"></row-table>
            </template>
            <template slot="formCreateTime" slot-scope="text, record">
              <span>{{moment(record.formCreateTime).format('YYYY.MM.DD')}}</span>
            </template>
            <template slot="planSendSamplesDt" slot-scope="text, record">
              <span>{{moment(record.planSendSamplesDt).format('YYYY.MM.DD')}}</span>
            </template>
            <template slot="deliverDt" slot-scope="text, record">
              <span>{{moment(record.deliverDt).format('YYYY.MM.DD')}}</span>
            </template>
            <!--试制地工序-->
            <template slot="workStr" slot-scope="text, record">
              <template v-if="record.workStr.length>32">
                <template v-for="(item,index) in record.workStr">
                  <span v-if="(index+1)%32==0">{{item}}-<br></span>
                  <span v-else>{{item}}</span>
                </template>
              </template>
             <span v-else>{{record.workStr}}</span>
            </template>
            <!--待处理时间-->
            <template slot="waitingTime" slot-scope="text, record">
              <span v-if="record.status==0" style="color:orange">{{(moment().diff(moment(record.waitingTime), 'h')/24).toFixed(1)}}天</span>
              <span v-else>0.0天</span>
            </template>
            <span slot="action" slot-scope="text, record" class="publicFlex">
             <a v-if="record.status==0" @click="handleAccept(record)" style="color: orange">接收</a>
             <a  href="javascript:;" @click="handleDetails(record)">查看</a>
             <a-popconfirm v-if="record.status==0" title="确定退回吗?" @confirm="() => handleBack(record)">
                    <a>退回</a>
                  </a-popconfirm>
          </span>

          </a-table>
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
        </div>
        <!-- table区域-end -->
        <!-- 表单区域 -->
        <project-information ref="projectInfor"></project-information>
      </a-card>
    </div>
  </div>
</template>

<script>
    import { filterObj } from '@/utils/util';
    import Vue from 'vue'
    import {JeecgListMixin} from '@/mixins/JeecgListMixin'
    import {postAction,getAction} from '@/api/manage'
    import RowTable from '../component/RowTable'
    import moment from "moment"
    import ProjectInformation from '../system/ProjectInformation'
    export default {
        name: "TaskReceptionList",
        components: { ProjectInformation, RowTable },
        mixins: [JeecgListMixin],
        data() {
            return {
                description: '车间任务接收',
                moment,
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 8 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 14 },
                },
                plannedTime: [],
                isShowOtherButtons: false,
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
                //列设置
                settingColumns:[],
                defColumns: [ // 表头
                    { title: '试制单编号', dataIndex: 'trialProductionFormNo',width: 220,scopedSlots: { customRender: 'trialProductionFormNo' }},
                    { title: '戴卡部件号',sorter: true, dataIndex: 'projectNo',width: 150,scopedSlots: { customRender: 'projectNo' } },
                    { title: '试制单创建日期', dataIndex: 'formCreateTime', width: 165,scopedSlots: { customRender: 'formCreateTime' } },
                    { title: '项目经理', dataIndex: 'projectManager',width:140},
                    { title: '计划发样时间', dataIndex: 'planSendSamplesDt',width: 155,scopedSlots: { customRender: 'planSendSamplesDt' }},
                    { title: '计划毛坯数', dataIndex: 'planRoughcastNum',width: 140},
                    { title: '交付日期', dataIndex: 'deliverDt', width:130,scopedSlots: { customRender: 'deliverDt'  }},
                    { title: '试制地工序', dataIndex: 'workStr',width: 410,scopedSlots: { customRender: 'workStr' }},
                    { title: '试制用途', dataIndex: 'purposesTab',width: 650,scopedSlots: { customRender: 'purposesTab' } },
                    { title: '预排信息', dataIndex: 'information',width: 880, scopedSlots: { customRender: 'information' }},
                    { title: '计划量产地', dataIndex: 'planProductPlace',width: 150},
                    { title: '待处理时间', dataIndex: 'waitingTime', width: 150,scopedSlots: { customRender: 'waitingTime' } },
                    { title: '操作', dataIndex: 'action',width: 150,align: 'center',fixed: 'right',
                        scopedSlots: {
                            filterDropdown: 'filterDropdown',
                            filterIcon: 'filterIcon',
                            customRender: 'action'},
                        },
                  ],
                rowColumns: [ // 行内表格
                    { title: '试制用途', dataIndex: 'purpose' },
                    { title: '数量', dataIndex: 'number' },
                ],
                rowColumns2:[
                    { title: '工序', dataIndex: 'processTechnologyName' },
                    { title: '试制地', dataIndex: 'trialProductionSite' },
                    { title: '预计时间', dataIndex: 'prearrangementTime'},
                    { title: '车间排序', dataIndex: 'currentNo' },
                ],
                url: {
                    list: "/trial/task/listTrialProductionTaskPage",
                    accept:"/trial/task/receiveTask",
                    backInfo:'/trial/task/backTask',
                }
            }
        },
        watch:{
          dataSource:{
              handler(v){
                  v.forEach((item,index)=>{
                      if(item.prearrangementList.length>0){
                          item.prearrangementList.forEach((it,de)=>{
                            //  Vue.set(this.dataSource[index].prearrangementList[de],'prearrangementTime',(moment(new Date).diff(moment(it.prearrangementTime),'h')/24).toFixed(1))
                              Vue.set(this.dataSource[index].prearrangementList[de],'prearrangementTime',(moment(it.completionDate).format('MM.DD')))
                              //console.log(this.dataSource[index].prearrangementList[de].prearrangementTime)
                          })
                      }
                  })
              }
          }
        },
        mounted(){
            this.initColumns()
        },
        methods: {
            loadData(arg) {
                if(!this.url.list){
                    this.$message.error("请设置url.list属性!")
                    return
                }
                //加载数据 若传入参数1则加载第一页的内容
                if (arg === 1) {
                    this.page.current = 1;
                }
                let params = this.getQueryParams();//查询条件
                params.pageNo = this.page.currentPage;
                params.pageSize = this.page.pageSize;
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
            searchResets() {
                this.plannedTime=[]
                this.queryParam = {}
                this.loadData(1);
            },
            changeTime(value, dateString) {
                this.queryParam.deliverDtBegin = value[0].format('YYYY-MM-DD 00:00:00');
                this.queryParam.deliverDtEnd = value[1].format('YYYY-MM-DD 23:59:59');
            },
            etQueryParams() {
                //获取查询条件
                let sqp = {}
                if(this.superQueryParams){
                    sqp['superQueryParams']=encodeURI(this.superQueryParams)
                    sqp['superQueryMatchType'] = this.superQueryMatchType
                }
                var param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
                param.field = this.getQueryField();
                param.pageNo = this.page.currentPage;
                param.pageSize = this.page.pageSize;
                return filterObj(param);
            },
            handleBack(record) {
                if(!this.url.backInfo){
                    this.$message.error("请设置url.backInfo属性!")
                    return
                }
                let that = this;
                let param = {};
                param.id = record.formBaseId;
                postAction(that.url.backInfo,param).then((res) => {
                    if (res.success) {
                        that.$message.success(res.message);
                        that.loadData();
                    } else {
                        that.$message.warning(res.message);
                    }
                });
            },
            handleAccept(record){
                if(!this.url.accept){
                    this.$message.error("请设置url.accept属性!")
                    return
                }
                let that = this;
                postAction(that.url.accept,record).then((res) => {
                    if (res.success) {
                        that.$message.success(res.message);
                        that.loadData();
                    } else {
                        that.$message.warning(res.message);
                    }
                });
            },
            customRow(record, index) {
                return {
                    style: {
                        'background': (record && record.instructionNum > 0) ? '#ED7584' : '',
                    }
                }
            }
        }
    }
</script>
<style scoped lang="less">
  .ant-popover-inner-content{
    padding:0;
  }
  .navbar {
    /deep/ .ant-popover-inner-content{
      padding:0;
      width: 400px;
    }
  }
  .operate-row {
  .ant-btn {
    padding: 0;
  }
  }
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
</style>