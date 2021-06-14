<template>
  <div  style="overflow-x: auto" class="jn-public-table-other">
    <a-card style="min-width: 1600px;margin-bottom: 12px;" >
      <div class="search-container ">
        <a-form layout="inline">
          <a-row type="flex" align="middle" :gutter="[0,16]">
            <div class="flex-left">
              <a-space align="center">
                <div>戴卡部件号</div>
                <a-form-item>
                  <a-input style="" placeholder="请输入戴卡部件号" v-model="queryParam.projectNo" style="width: 244px; margin-left: 10px"></a-input>
                </a-form-item>
              </a-space>
            </div>
            <div class="flex-left">
              <a-space align="center">
                <div>项目经理</div>
                <a-form-item>
                  <a-input placeholder="请输入项目经理" v-model="queryParam.projectManager" style="width: 244px; margin-left: 10px"></a-input>
                </a-form-item>
              </a-space>
            </div>
            <div class="flex-left">
              <a-space align="center">
                <div>试制单编号</div>
                <a-form-item>
                  <a-input placeholder="请输入试制单编号" v-model="queryParam.trialProductionFormNo" style="width: 244px; margin-left: 10px"></a-input>
                </a-form-item>
              </a-space>
            </div>
            <a-col :md="2" :sm="2" v-if="!showReset">
              <!-- 操作按钮区域 -->
              <div class="button-container">
                <div class="check-button-frame">
                  <a-button type="link" @click="showDown" >
                    展开
                    <a-icon type="down" />
                  </a-button>
                  <a-button type="primary" @click="getList">查询</a-button>
                </div>
                <div  style="margin-left: 20px">
                  <a-button @click="resetParam">重置</a-button>
                </div>
              </div>
            </a-col>
          </a-row>
          <a-row style="display: flex;align-items: center">
            <a-col :md="7" :sm="4" class="flex-left" v-if="showReset">
              <a-space align="center">
                <div>交付日期</div>
                <a-form-item>
                  <a-range-picker
                    :show-time="{ format: 'HH:mm:ss' }"
                    format="YYYY-MM-DD"
                    @change="trialDeliverDateChange"
                    v-model="deliveryDate"
                    style="width: 244px; margin-left: 10px"
                  ></a-range-picker>
                </a-form-item>
              </a-space>
            </a-col>
            <a-col :md="2" :sm="2" v-if="showReset">
              <!-- 操作按钮区域 -->
              <div class="button-container">
                <div class="check-button-frame">
                  <a-button type="link"  @click="showUp">
                    收起
                    <a-icon type="up" />
                  </a-button>
                  <a-button type="primary" @click="getList">查询</a-button>
                </div>
                <div  style="margin-left: 20px">
                  <a-button @click="resetParam">重置</a-button>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card class="jn-public-table" style="min-width: 1600px">
      <div class="table-frame ">
        <a-table
          ref="table"
          size="middle"
          bordered
          :columns="showColumns"
          :dataSource="dataSource"
          :scroll="{ x: true }"
          :pagination=false
          :rowClassName="rowClassName">
            <jnFilterTable ref="jnFilterTable" :columns="columns" :showColumns="showColumns" @showColumnsChange="setShowColumns" slot="filterDropdown"></jnFilterTable>
            <jnFilterIcon  slot="filterIcon"></jnFilterIcon>
            <jnFilterAction slot="action" slot-scope="text, record"></jnFilterAction>
          <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
            <a-button type="link"  @click="goRecord(operate)">
              查看
            </a-button>
          </a-space>
          <a-space slot="purposesTab" slot-scope="text, operate, i" class="operate-row" style="width: 640px">
            <row-table :columns="rowColumns" :data-source="operate.purposes" maxWidth="600px"></row-table>
          </a-space>
          <a-space slot="formWorksTab" slot-scope="text, operate, i" class="operate-row" style="width: 840px">
           <technology-table :columns="operate.tableColumn" maxWidth="840px"></technology-table>
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
    </a-card>
  </div>

</template>

<script>
  import {
    getTrialFormBaseWorkList,
    getDictItemsFromCache
  } from '@/api/api';
  import RowTable from '../component/RowTable'
  import TechnologyTable from '../component/TechnologyTable'
  import { jnFilterTableMixin } from '@/mixins/jnFilterTable'
  export default {
    name: 'ProcessMaintenance',
    components: { RowTable,TechnologyTable },
    mounted() {
      console.log("I am in ProcessMaintenance")
      this.getDic();
      setTimeout(()=>{
        this.getList();
      },300)
    },
    mixins: [jnFilterTableMixin],
    data(){
      return{
        dic:{
          check_trial_production:[],
        },
        showReset:false, //展示重置按钮
        deliveryDate: [], // 维护日期 用于绑定model清空
        // 请求参数
        queryParam: {
          projectManager: '', // 项目经理
          trialProductionFormNo: '', // 试制流转单编号
          projectNo: '', // 戴卡项目号
          deliverDtBegin: null, // 交付日期从
          deliverDtEnd: null, // 到
          pageNo:1,
          pageSize:5
        },
        rowColumns: [ // 行内表格
          { title: '试制用途', dataIndex: 'purpose' },
          { title: '数量', dataIndex: 'number' },
        ],
        dataSource:[
          {
            trialProductionFormNo:'',
          }
        ],
        // 分页
        page: { // 分页
          total: 0, // 共多少条
          pageSize: 5, // 一页多少条
          pageNum: 0, // 共多少页
          currentPage: 1, // 当前页
          jumpPage: 1, // 跳转到第几页,
        },
        columns:[
          { title: '试制单编号', dataIndex: 'trialProductionFormNo', key: 'trialProductionFormNo', align: 'left', },
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'left', },
          { title: '试制单创建日期', dataIndex: 'createTime', key: 'createTime', align: 'left', },
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'left', },
          { title: '计划发样时间', dataIndex: 'planSendSamplesDt', key: 'planSendSamplesDt', align: 'left', },
          { title: '试制批次', dataIndex: 'trialProductionBatch', key: 'trialProductionBatch', align: 'left', },
          { title: '计划毛坯数', dataIndex: 'planRoughcastNum', key: 'planRoughcastNum', align: 'left', },
          { title: '交付日期', dataIndex: 'deliverDt', key: 'deliverDt', align: 'left', },
          { title: '试制用途', dataIndex: 'purposesTab', key: 'purposesTab',width: 640, align: 'left', scopedSlots: { customRender: 'purposesTab' },},
          { title: '计划量产地', dataIndex: 'planProductPlace', key: 'planProductPlace', align: 'left'},
          { title: '工艺维护', dataIndex: 'formWorksTab', key: 'formWorksTab',width: 840, align: 'left',scopedSlots: { customRender: 'formWorksTab' } },
          { title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            align: 'center',
            width:150,
            fixed: 'right',
            scopedSlots: { customRender: 'operate' }, },
        ]
      }
    },
    methods:{
      rowClassName(record,index) {
        let a123 = "table-red"
        if(record.instructionNum && record.instructionNum > 0){
          return a123;
        }
      },
      goRecord(operate){
        localStorage.removeItem('selectTab');
        this.$router.push({
          path: '/trialManage/TrialProductionMaintenance',
          query:{
            id:operate.id,
            check:'check',
          }
        })
      },
      // 分页
      pageChange(val) { // 分页改变
        this.page.currentPage = val;
        this.getList();
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
        this.getList();
      },
      trialDeliverDateChange(value, dateString){
        this.queryParam.deliverDtBegin = value[0].format('YYYY-MM-DD 00:00:00');
        this.queryParam.deliverDtEnd = value[1].format('YYYY-MM-DD 23:59:59');
      },
      showDown(){
        this.showReset = true;
      },
      showUp(){
        this.showReset = false;
      },
      getList(){
        this.queryParam.pageNo = this.page.currentPage;
        this.queryParam.pageSize = this.page.pageSize;
        // this.queryParam.column =  'project_no';
        // this.queryParam.order = 'asc';
        this.queryParam.column =  'create_time';
        this.queryParam.order = 'desc';
        getTrialFormBaseWorkList(this.queryParam).then((data)=>{
          console.log('data', data);
          for(let i=0;i<data.result.records.length;i++){
            let arr = []
            data.result.records[i].formWorks.forEach((item,index)=>{
              for(let j=0;j<this.dic.check_trial_production.length;j++){
                if(item.status == this.dic.check_trial_production[j].value ){
                  item.status = this.dic.check_trial_production[j].text;
                }
              }
              if(item.technologyName){
                arr.push({
                  name: item.technologyName,
                  status:item.status,
                  id: item.formBaseId});
              }
            })
            data.result.records[i].tableColumn = arr;
          }
          this.dataSource = data.result.records;
          this.page.total = data.result.total;
          this.page.pageNum = data.result.pages;
          console.log('23333',  data.result.pages);
        })

      },
      resetParam() { // 重置
        this.deliveryDate = [];
        this.queryParam = {
          projectManager: '', // 项目经理
          trialProductionFormNo: '', // 试制流转单编号
          projectNo: '', // 戴卡项目号
          deliverDtBegin: null, // 交付日期从
          deliverDtEnd: null, // 到
        };
      },
      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          if (getDictItemsFromCache(name)) { // 从缓存中取dic
            this.dic[name] = getDictItemsFromCache(name)
          }
          console.log('dic', this.dic);
        }
      },
    }
  }
</script>

<style scoped lang="less">
  @import "./../../css/public-table-css";
  /deep/.table-red {
    background-color: #EC808D;
  }
  /deep/ .ant-row-flex-middle{
    align-items: flex-start;
  }
  .button-container{
    display: flex;
    padding-top: 8px;
    padding-bottom: 8px;
    .check-button-frame{
      display: flex;
    }
  }
  .search-container{
    width: 100%;
    .flex-left{
      width: 25%;
      padding-top: 8px;
      padding-bottom: 8px;
    }
  }
  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }

</style>
