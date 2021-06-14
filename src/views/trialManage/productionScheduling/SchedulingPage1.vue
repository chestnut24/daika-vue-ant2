<template>
  <div>
    <!-- table -->
      <form :autoFormCreate="(form) => this.form = form">
        <a-table
          ref="table"
          bordered
          :columns="columns"
          :dataSource="dataSource"
          :pagination=false
        >
          <template v-for="(col, i) in columns" :slot="col.dataIndex" slot-scope="text, record, index">
            <a-input
              :key="col"
              v-if="record.editable && col.align"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value,index, col.dataIndex)"
            />
              <a v-else-if="col.dataIndex=='formBaseNo'" @click="handleDetails(record)">{{record.formBaseNo}}</a>
              <a v-else-if="col.dataIndex=='projectNo'" @click="showProjectDetail(record.projectId)">
                {{record.projectNo}}
              </a>
            <!--工艺策划-->
              <a v-else-if="col.dataIndex=='technology'" @click="handlePlan(record)">查看</a>

            <!--试制前策划-->

            <a v-else-if="col.dataIndex=='triaProduction'" @click="handlePlan(record)">查看</a>

            <!--生产状态-->
            <template v-else-if="col.dataIndex=='productionStatus'">
              <template v-if="record.scheduleStatus!=0">
                <template v-for="(item,index) in productionStatusList" >
                    <span v-if="item.value==record.productionStatus" :key="index">
                       <span v-if="item.text=='正常'" style="color: #1de208">{{item.text}}</span>
                       <span v-else-if="item.text=='延误' || item.text=='中断'" style="color: #d81307">{{item.text}}</span>
                       <span v-else-if="item.text=='未生产'" style="color: #515151">{{item.text}}</span>
                    </span>
                </template>
              </template>
              <span v-else style="color: #8697aa">--</span>
            </template>
            <!--排产序号-->
            <template v-else-if="col.dataIndex=='no'">
              <span v-if="record.no==-1">--</span>
              <span v-else>{{record.no}}</span>
            </template>
            <!--预计完成时间-->
            <template v-else-if="col.dataIndex=='planCompletionTime'">
              <span v-if="record.planCompletionTime">{{record.planCompletionTime}}</span>
              <span v-else>--</span>
            </template>
            <a v-else-if="col.dataIndex=='planCompletionTime'" @click="handlePlan(record)">查看</a>
              <span v-else-if="col.dataIndex=='deliverDt'">{{moment(record.deliverDt).format('YYYY.MM.DD')}}</span>
              <template v-else>{{ text }}</template>
          </template>
          <template slot="action" slot-scope="text, record, index">
            <div class="editable-row-operations">
          <span v-if="record.editable">
            <a-button size="small" type="primary" ghost @click="save(record)" :loading="tLoading">保存</a-button>
            <a-divider type="vertical" />
            <a-popconfirm title="真的放弃编辑吗?" @confirm="() => cancel(record)">
              <a-button size="small" type="primary" ghost>取消</a-button>
            </a-popconfirm>
          </span>
          <span v-else>
            <a-button size="small" type="primary" ghost class="edit" @click="edit(record)">修改</a-button>
          </span>
            </div>
          </template>
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
      </form>
    <project-information ref="projectInfor"/>
  </div>
</template>

<script>
    import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
    import Vue from 'vue'
    import FooterToolBar from '@/components/tools/FooterToolBar'
    import { getAction, postAction, putAction } from '@api/manage'
    import ProjectInformation from '../../system/ProjectInformation'
    import moment from "moment"
    export default {
        name: "SchedulingPage",
        components: { ProjectInformation,FooterToolBar },
        props: ['queryParams', 'isSearch'],
        data () {
            return {
                description: '车间排产。',
                // 是否正在加载
                loading: false,
                moment,
                // 分页
                page: { // 分页
                    total: 0, // 共多少条
                    pageSize: 5, // 一页多少条
                    pageNum: 0, // 共多少页
                    currentPage: 1, // 当前页
                    jumpPage: 1, // 跳转到第几页,
                },
                // 选择的行
                selectedRows: [],
                // 数据源，控制表格的数据
                dataSource: [],
                // table
                columns: [
                    {dataIndex:'formBaseNo',title:'试制单编号',width:'180px',scopedSlots: { customRender: 'formBaseNo' } },
                    {dataIndex:'projectNo', title:'戴卡部件号',width:'120px',scopedSlots: { customRender: 'projectNo' }},
                    {dataIndex:'planEndDt', title:'下发日期'},
                    {dataIndex:'trialProductionNumber',title:'试制数量'},
                 /*   {dataIndex:'triaProduction',title:'试制前策划',width:'110px',scopedSlots: { customRender: 'triaProduction' }},*/
                    {dataIndex:'scheduleStatus',title:'排产状态',
                        customRender: (text, record, index) => {
                            //字典值替换通用方法
                            return filterDictText(this.scheduleStatusList, text);
                        }},
                    {dataIndex:'productionStatus',title:'生产状态',scopedSlots: { customRender: 'productionStatus' }},
                    {dataIndex:'technology',title:'工艺策划',scopedSlots: { customRender: 'technology' }},
                    {dataIndex:'scheduldInstructions',title:'排产指令',scopedSlots: { customRender: 'scheduldInstructions' }},
                    {dataIndex:'productionMachine',title:'机台'},
                    {dataIndex:'productionTime',title:'排产时间'},
                    {dataIndex:'no',title:'排产序号',scopedSlots: { customRender: 'no'}},
                    {dataIndex:'deliverDt',title:'交付日期',scopedSlots: { customRender: 'deliverDt'}},
                    {dataIndex:'planCompletionTime',title:'预计完成时间',width:'120px',scopedSlots: { customRender: 'planCompletionTime'}},
                    {dataIndex:'remark',title:'备注',scopedSlots: { customRender: 'remark' }},
                    {dataIndex:'action',title:'操作',width:'140px',align: 'center',scopedSlots: { customRender: 'action' } }
                ],
                // 查询url地址
                url: {
                    getData: '/trial/taskScheduling/listTaskSchedulingPage',
                    // 模拟保存单行数据（即时保存）
                    saveRow: '/mock/vxe/immediateSaveRow',
                    // 模拟保存整个表格的数据
                    saveAll: '/mock/vxe/immediateSaveAll',
                },
                selectedRows: [],
                tLoading:false,
                scheduleStatusList:[],
                productionStatusList:[]
            }
        },
        watch: {
            queryParams:{
                immediate:true,
                handler(v){
                    if(v){
                        this.queryParam=v
                        this.loadData()
                    }
                }
            }
        },
        created() {
            this.loadData()
            this.initDictConfig()
        },
        methods: {
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
            initDictConfig() {
                //初始化字典  排产
                initDictOptions('trial_schedule_status').then((res) => {
                    if (res.success) {
                        this.scheduleStatusList = res.result;
                    }
                });
                //生产
                initDictOptions('trial_production_status').then((res) => {
                    if (res.success) {
                        this.productionStatusList = res.result;
                    }
                });
            },
            showProjectDetail(id) {
                this.$refs.projectInfor.getData(id);
            },
            handleDetails(record){
                this.$router.push({
                    path: `/trial/trialForm`,
                    query: {
                        id: record.formBaseId,//试制单主键  在你那边接口 formBaseId
                        no: record.formBaseNo,//试制单编号  你那边接口 trialProductionFormNo
                    },
                })
            },
            handlePlan(record){
                this.$router.push({path:'/trialManage/modules/PlanList',
                    query: {taskWorkListId:JSON.stringify(record.taskWorkId),ruleCode:JSON.stringify(this.queryParam.processTechnology)}})
            },
            // 加载数据
            loadData() {
                // 封装查询条件
                let formData=this.queryParam;
                formData.pageNo=this.page.currentPage;
                formData.pageSize=this.page.pageSize;
                formData['column'] = 'deliver_dt';
                formData['order'] = 'asc';
                // 调用查询数据接口
                this.loading = true
                getAction(this.url.getData, formData).then(res => {
                    if (res.success) {
                        // 将查询的数据赋值给 dataSource
                        this.dataSource = res.result.records
                        this.dataSource.forEach((item,index)=>{
                          Vue.set(this.dataSource[index],'editable',false)
                        })
                        // 后台查询回来的 total，数据总数量
                        this.page.total = res.result.records.length
                        this.page.pageNum = res.result.pages;
                        // 重置选择
                        this.selectedRows = []
                    } else {
                        this.$error({title: '主表查询失败', content: res.message})
                    }
                }).finally(() => {
                    // 这里是无论成功或失败都会执行的方法，在这里关闭loading
                    this.loading = false
                })
            },
            handleSubmit (e) {
                e.preventDefault()
            },
            save (row) {
                this.tLoading=true
                let trialProductionScheduling={
                    formBaseId:row.formBaseId,
                    taskSplitId:row.taskSplitId,
                    scheduldInstructions:row.scheduldInstructions,
                    trialProductionSite:this.queryParam.trialProductionSite,
                    processTechnology:this.queryParam.processTechnology,
                    remark:row.remark
                }
                if(row.id){
                    trialProductionScheduling.id=row.id
                }
                postAction('/trial/taskScheduling/editScheduling',trialProductionScheduling).then(res=>{
                  this.tLoading=false
                  if(res.success){
                      delete row.editable
                      this.selectedRows = []
                      this.loadData()
                  }else{
                      this.$message.error(res.message)
                  }
                })
            },
          /*  toggle (key) {
                let target = this.data.filter(item => item.key === key)[0]
                target.editable = !target.editable
            },*/
            edit (row) {
                if (row.scheduleStatus==2){
                    this.$message.warning('试制中，排产指令，不可修改')
                }else{
                    row.editable = true
                }
            },
            getRowByKey (key, newData) {
                const data = this.data
                return (newData || data).filter(item => item.key === key)[0]
            },
            cancel (row) {
                delete row.editable
                this.loadData()
            },
            handleChange (value,index, column) {
                const newData = [...this.dataSource]
                const target = newData.filter((item,ind) => index ===ind)[0]
                if (target) {
                    target[column] = value
                    this.dataSource = newData
                }
            },
            // 最终全页面提交
            validate () {
                this.$refs.repository.form.validateFields((err, values) => {
                    if (!err) {
                        this.$notification['error']({
                            message: 'Received values of form:',
                            description: values
                        })
                    }
                })
                this.$refs.task.form.validateFields((err, values) => {
                    if (!err) {
                        this.$notification['error']({
                            message: 'Received values of form:',
                            description: values
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
  .card{
    margin-bottom: 24px;
  }
 /deep/ table{table-layout:fixed;}
  /deep/th, /deep/ td , /deep/.ant-table-row td{word-break:break-all;padding: 0;}
  /deep/ tr>td:first-child{
    padding: 8px 0 5px 0;
  }


  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }
</style>