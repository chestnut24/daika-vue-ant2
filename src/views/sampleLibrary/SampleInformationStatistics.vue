<template>
  <div class="jn-public-table" style="overflow-x: auto">
    <a-card style="min-width: 1600px">
      <div class="search-frame">
        <div class="search-frame-left">
          <div class="item-frame">
            <a-space align="center">
              <span style="font-size: 14px; margin-right: 5px">戴卡部件号:</span>
              <a-input v-model:value="searchParams.projectNo" style="width: 244px" placeholder="请输入戴卡部件号" />
            </a-space>
          </div>
          <div  class="item-frame">
            <a-space align="center">
              <span style="font-size: 14px ">用途:</span>
              <a-select  placeholder="请选择" v-model="searchParams.purpose"  style="width: 244px; margin-left: 10px" >
                <a-select-option v-for="data in option.noun" :key="data.value">
                  {{ data.label }}
                </a-select-option>
              </a-select>
            </a-space>
          </div>
          <div  class="item-frame">
            <a-space align="center">
              <span style="font-size: 14px ;margin-right: 2px">项目经理:&nbsp;&nbsp;&nbsp;</span>
              <a-input v-model:value="searchParams.projectManager" style="width: 244px" placeholder="请输入项目经理姓名" />
            </a-space>
          </div>
          <div>
            <a-button type="primary" style="width: 70px;margin-right: 8px" @click="getList">查询</a-button>
            <a-button @click="reSET" style="margin-right: 8px;"> 重置</a-button>
          </div>
        </div>
      </div>
    </a-card>
    <div style="margin-top: 12px">
      <div class="data-frame">
        <div class="display-frame" style="background-color: #fff">
          <div class="display-frame-left">
            <div class="display-title">
              <span style="font-size: 18px"><b>库存统计</b></span>
            </div>
            <div class="display-data">
              <div class="span-frame" style="display: flex;padding:16px 0;">
                <a-statistic title="总库存数量：" :value="stock" style="margin-right: 50px" />
                <a-statistic title="待查数量统计：" :value="taskNum" style="margin-right: 50px" />
                <a-statistic title="待发库存统计：" :value="needSendNum" style="margin-right: 50px" />
                <!--              <span style="font-size: 18px" class="span-margin">总库存数量:&nbsp;&nbsp;&nbsp;<b>{{stock}}</b></span>-->
                <!--              <span style="font-size: 18px" class="span-margin">待查数量统计:&nbsp;&nbsp;&nbsp;<b>{{taskNum}}</b></span>-->
                <!--              <span style="font-size: 18px" class="span-margin">待发库存统计:&nbsp;&nbsp;&nbsp;<b>{{needSendNum}}</b></span>-->
              </div>
            </div>
          </div>
        </div>
        <div class="display-frame2"  style="background-color: #fff">
          <div class="display-frame-left">
            <div class="display-title">
              <span style="font-size: 18px"><b>报废统计</b></span>
            </div>
            <div class="display-data">
              <div class="span-frame" style="display: flex;padding:16px 0;">
                <a-statistic title="总报废数量：" :value="stock2" style="margin-right: 50px" />
                <a-statistic title="包装确认报废统计：" :value="packScrapNum" style="margin-right: 50px" />
                <a-statistic title="待发库存报废统计：" :value="sendScrapNum" style="margin-right: 50px" />
                <a-statistic title="无发货任务库存报废统计：" :value="normalScrapNum" style="margin-right: 50px" />
                <!--              <span style="font-size: 18px" class="span-margin">总报废数量:&nbsp;&nbsp;<b>{{stock2}}</b></span>-->
                <!--              <span style="font-size: 18px" class="span-margin">包装确认报废统计:&nbsp;&nbsp;<b>{{packScrapNum}}</b></span>-->
                <!--              <span style="font-size: 18px" class="span-margin">待发库存报废统计:&nbsp;<b>{{sendScrapNum}}</b></span>-->
                <!--              <span style="font-size: 18px" class="span-margin">无发货任务库存报废统计:&nbsp;&nbsp;&nbsp;<b>{{normalScrapNum}}</b></span>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-card style="margin-top: 12px;">
      <div class="table-frame">
        <div style="display: flex;justify-content:  space-between;margin-bottom: 12px">
          <h3>样件信息统计表</h3>
          <a-button style="margin-right: 8px" >导出</a-button>
        </div>
        <a-table
                :dataSource="dataSource"
                :columns="columns"
                bordered
                :pagination = false
        >
          <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
            <a-button type="link" @click="goBatchInformation(operate, i)">批次详情</a-button>
          </a-space>
        </a-table>
        <!--    分页-->
        <div class="bottom-page">
          <a-pagination
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

  </div>
</template>

<script>
  import {getMouldOptions,getStaticList} from '@/api/api'
  export default {
    name: 'SampleInformationStatistics',
    mounted() {
      this.getAppointOption();
      setTimeout(()=>{
        this.getList();
      },300)
      this.getDic();
    },
    data() {
      return {
        searchParams: {
          projectNo: '',
          purpose: undefined,
          projectManager: ''
        },
        option:{
          noun:[],//用途
        },
        stock:'', // 总库存数量
        needSendNum:'',// 待发库存统计
        taskNum:'',// 待查库存统计
        normalScrapNum:'', //无发货任务报废
        packScrapNum:'',//包装确认报废
        sendScrapNum:'',//待发库存报废
        stock2:'', //总库存
        total: 0, // 共多少条
        pageSize: 10, // 一页多少条
        pageNum: 1, // 共多少页
        jumpPage: 1, // 跳转到第几页
        currentPage: 1, // 当前页
        modalVisible: false, // 显示弹窗组件
        modalTitle: '', // 弹窗标题
        modalData: [], //弹窗展示的数组
        modalColumn: [], //弹窗展示的列名
        searchData: [],//弹窗展示搜索的循环数组
        dataSource: [],//表格数据
        dic: { // 表单中的部分数据对应的的数据词典
          noun: [], // 维护状态
        },
        columns: [
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center', },
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center', },
          { title: '总库存', dataIndex: 'stockSum', key: 'stockSum', align: 'center', },
          { title: '回库数量', dataIndex: 'returnNum', key: 'returnNum', align: 'center', },
          { title: '转轮数量', dataIndex: 'wheelNum', key: 'wheelNum', align: 'center', },
          { title: '包装中', dataIndex: 'packNum', key: 'packNum', align: 'center', },
          { title: '待查库存', dataIndex: 'stock', key: 'stock', align: 'center', },
          { title: '待发库存', dataIndex: 'needSendNum', key: 'needSendNum', align: 'center', },
          { title: '报废库存', dataIndex: 'scrapNum', key: 'scrapNum', align: 'center', },
          { title: '包装确认报废', dataIndex: 'packScrapNum', key: 'packScrapNum', align: 'center', },
          { title: '待发库存报废', dataIndex: 'sendScrapNum', key: 'sendScrapNum', align: 'center', },
          { title: '无发货任务报废', dataIndex: 'normalScrapNum', key: 'normalScrapNum', align: 'center', },
          { title: '所含批次', dataIndex: 'batchNum', key: 'batchNum', align: 'center', },
          { title: '操作', dataIndex: 'operate', key: 'operate', align: 'center', scopedSlots: { customRender: 'operate' }, }]
      }
    },
    methods: {
      reSET(){
        this.searchParams = {
          projectNo: '',
          purpose: undefined,
          projectManager: ''
        }
      },
      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          getMouldOptions(searchName, '').then((data) => {
            this.dic[name] = data;
            this.$nextTick(()=>{
              this.dic.purpose = this.dic.noun;
              delete this.dic.noun;
              console.log('this.dic',this.dic);
            })
          });
        }
      },
      humpOrLine(name, type) { // 驼峰式转下划线 toLine 下划线转驼峰式 toHump
        if (type === 'toLine') {
          return name.replace(/([A-Z])/g, '_$1').toLowerCase();
        } else if (type === 'toHump') {
          return name.replace(/\_(\w)/g, function(all, letter) {
            return letter.toUpperCase();
          });
        }
      },
      pageChange(val) { // 分页改变
        this.currentPage = val;
        this.getList();
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
        this.getList();
      },
      getAppointOption() { // 获取指定的下拉框
        for (let name in this.option) {
          // let searchName = this.humpOrLine(name, 'toLine');
          getMouldOptions(name, '').then((data) => {
            this.option[name] = data;
          });
        }
      },
      getList(){
        this.searchParams.pageSize = this.pageSize;
        this.searchParams.pageNO = this.currentPage;
        getStaticList(this.searchParams).then((data)=>{
          if (!data.result.warehouseVOList.records.length) {
            this.dataSource = [];
          }else {
            for (let i = 0; i < data.result.warehouseVOList.records.length; i++) { // 遍历返回的数据列表
              for (let name in data.result.warehouseVOList.records[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.result.warehouseVOList.records[i][name] && Number(data.result.warehouseVOList.records[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                      console.log(' 2355',this.dic[name][j].label);
                      data.result.warehouseVOList.records[i][name] = this.dic[name][j].label;
                    }
                  }
                }
              }
            }
          }
          this.dataSource = data.result.warehouseVOList.records;
          this.pageSize = data.result.warehouseVOList.size;
          this.total = data.result.warehouseVOList.total;
          this.pageNum = data.result.warehouseVOList.pages;
          this.stock = data.result.stockStatisticsVO.stock;
          this.needSendNum = data.result.stockStatisticsVO.needSendNum;
          this.taskNum = data.result.stockStatisticsVO.taskNum;
          this.stock2 = data.result.scrapStatisticsVO.stock;
          this.sendScrapNum = data.result.scrapStatisticsVO.sendScrapNum;
          this.normalScrapNum = data.result.scrapStatisticsVO.normalScrapNum;
          this.packScrapNum = data.result.scrapStatisticsVO.packScrapNum;
        })
      },
      goBatchInformation(operate,i){
        this.$router.push({
          path:'/sampleLibrary/BatchInformationStatistics',
          query:{
            projectNo:operate.projectNo,
            purpose:operate.purpose
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import "./../../css/public-table-css";
  .search-frame{
    width: 100%;
    display: flex;
    justify-content: space-between;

  }
  .search-frame-left{
    width: 80%;
    display: flex;
    justify-content: flex-start;
  }
  .item-frame{
    margin-right: 30px;
  }
  .display-frame{
    width: 47.3%;
    display: flex;
    justify-content: space-between;
    /*margin-top: 40px;*/
  }
  .display-frame2{
    width: 52%;
    display: flex;
    justify-content: space-between;
    /*margin-top: 40px;*/
  }
  .display-frame-left{
    width: 100%;
    /*height: 120px;*/
    border: 1px solid #F2F2F2;
  }
  .data-frame{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .display-title{
    width: 100%;
    height: 50px;
    /*background-color:#F2F2F2;*/
    display: flex;
    align-items: center;
    padding-left: 20px;
    border-bottom: 1px solid #E8E8E8;
  }
  .span-margin{
    margin-right: 20px;
  }
  .display-data{
    width: 100%;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 40px;
  }
  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    align-items: center;
  }
  .table-frame{
    /*margin-top: 20px;*/
  }

  /deep/ .ant-statistic-content-value-int{
    color: #347EF2;
  }
</style>
