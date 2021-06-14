<template>
    <div style="overflow-x: auto"  class="jn-public-table" >
        <a-card  style="min-width: 1600px;">
            <div class="search-frame">
                <div class="search-frame-left">
                    <div class="item-frame">
                        <a-space align="center">
                            <span style="font-size: 14px; margin-right: 5px">戴卡部件号:</span>
                            <a-input v-model:value="searchParams.projectNo" placeholder="请输入戴卡部件号" />
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
                            <span style="font-size: 14px ;margin-right: 5px">项目经理:</span>
                            <a-input v-model:value="searchParams.projectManager" placeholder="请输入项目经理姓名" />
                        </a-space>
                    </div>
                    <div  class="item-frame">
                        <!--            <a-space align="center">-->
                        <!--              <span style="font-size: 14px ">待发仓库:</span>-->
                        <!--              <a-select  placeholder="请选择" v-model="searchParams.factoryWareHouse"  style="width: 174px; margin-left: 10px" >-->
                        <!--                <a-select-option v-for="data in option.factory_ware_house" :key="data.value">-->
                        <!--                  {{ data.label }}-->
                        <!--                </a-select-option>-->
                        <!--              </a-select>-->
                        <!--            </a-space>-->
                    </div>
                </div>
              <div>
                <a-button type="primary" style="width: 70px;margin-right: 8px" @click="getList">查询</a-button>
                <a-button @click="reSET" style="margin-right: 32px;"> 重置</a-button>
              </div>

            </div>
        </a-card>
        <a-card  style="min-width: 1600px;margin-top: 16px">
           <!-- <div class="display-frame">
                <div class="display-frame-left">
                    <div class="display-title">
                        <span style="font-size: 18px"><b>待发库统计</b></span>
                    </div>
                    <div class="display-data">
&lt;!&ndash;                        <div class="span-frame">&ndash;&gt;
&lt;!&ndash;                            <span style="font-size: 18px" class="span-margin">待发库存统计:&nbsp;&nbsp;&nbsp;<b>{{waitingNumber}}</b></span>&ndash;&gt;
&lt;!&ndash;                            <span style="font-size: 18px" class="span-margin">包装确认报废统计:&nbsp;&nbsp;&nbsp;<b>{{sureBadNumber}}</b></span>&ndash;&gt;
&lt;!&ndash;                            <span style="font-size: 18px" class="span-margin">待发库存报废统计:&nbsp;&nbsp;&nbsp;<b>{{waitingBadNumber}}</b></span>&ndash;&gt;
&lt;!&ndash;                        </div>&ndash;&gt;
                    </div>
                </div>
            </div>-->
            <a-card title="待发库统计" style="min-width: 1600px;">
                <div style="display: flex;justify-content: space-between">
                    <div style="display: flex;justify-content: space-between;color: #02BBD7;font-size: 16px;text-align: center;width: 500px">
                        <div>
                            <div style="color:#808080">待发库存统计</div>
<!--                            <br>-->
                            <div style="font-size: 22px;margin-top: 12px"><b>{{waitingNumber}}</b></div>
                        </div>
                        <div style="width: 2px;background-color: #EEEFF3"></div>
                        <div>
                            <div style="color:#808080">包装确认报废统计</div>
<!--                            <br>-->
                            <div style="font-size: 22px;margin-top: 12px"><b>{{sureBadNumber}}</b></div>
                        </div>
                        <div style="width: 2px;background-color: #EEEFF3"></div>
                        <div>
                            <div style="color:#808080">待发库存报废统计</div>
<!--                            <br>-->
                            <div style="font-size: 22px;margin-top: 12px"><b>{{waitingBadNumber}}</b></div>
                        </div>
                    </div>
                    <div class="double-button" style="margin-top: 16px">
                        <a-button type="primary" class="item-button" ghost @click="goRecordClosing">待发库记录台账</a-button>
                        <a-button type="primary" class="item-button" ghost @click="goDelivery">提货管理</a-button>
                    </div>
                </div>
            </a-card>
            <div class="table-frame">
                <a-table
                        :dataSource="dataSource"
                        :columns="columns"
                        bordered
                        :pagination = false
                >
                    <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
                        <a-button type="link" @click="modifyNumber(operate, i)">修改数量</a-button>
                        <a-button type="link" @click="Scrap(operate, i)">报废</a-button>
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
            <sample-modal
                    :modalVisible="modalVisible"
                    :modalTitle = "modalTitle"
                    :dataSource = "modalData"
                    :columns="modalColumn"
                    :searchData = "searchData"
                    @close="closeFunction">
            </sample-modal>
        </a-card>
    </div>
</template>

<script>
  import {getWarehouseSend, getMouldOptions, getWarehouseStatistics} from '@/api/api'
  import SampleModal from './SampleModal'
  export default {
    name: 'WaitingDatabaseManagement',
    mounted() {
      this.getAppointOption();
      setTimeout(()=>{
        this.getList();
      },300)
      this.getDic();
      getWarehouseStatistics().then((data)=>{
        this.waitingNumber = data.result.needSendNum; // 待发库存
        this.sureBadNumber = data.result.packScrapNum; // 包装确认报废
        this.waitingBadNumber = data.result.sendScrapNum; // 待发库存报废
      })
    },
    components: { SampleModal },
    data(){
      return{
        searchParams:{
          projectNo:'', //戴卡部件号
          purpose: undefined, // 用途
          projectManager: '',//项目经理
          pageSize:5, //展示条数
          pageNO:1,//当前页
          factoryWareHouse:undefined,//工厂仓库
        },
        option:{
          factory_ware_house:[],//工厂仓库
          noun:[],//用途
        },
        dic:{
          noun:[],
        },
        waitingNumber:'',
        sureBadNumber:'',
        waitingBadNumber:'',
        total: 0, // 共多少条
        pageSize: 5, // 一页多少条
        pageNum: 1, // 共多少页
        jumpPage: 1, // 跳转到第几页
        currentPage: 1, // 当前页
        modalVisible: false, // 显示弹窗组件
        modalTitle:'', // 弹窗标题
        modalData: [], //弹窗展示的数组
        modalColumn: [], //弹窗展示的列名
        searchData: [],//弹窗展示搜索的循环数组
        dataSource: [],//表格数据
        columns:[
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center', },
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
          { title: '批次号', dataIndex: 'batch', key: 'batch', align: 'center', },
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center', },
          // { title: '工厂仓库', dataIndex: 'factoryWareHouse', key: 'factoryWareHouse', align: 'center', },
          { title: '待发库存', dataIndex: 'needSendNum', key: 'needSendNum', align: 'center', },
          { title: '包装确认报废', dataIndex: 'packScrapNum', key: 'packScrapNum', align: 'center', },
          { title: '待发库存报废', dataIndex: 'sendScrapNum', key: 'sendScrapNum', align: 'center', },
          { title: '操作', dataIndex: 'operate', key: 'operate', align: 'center', scopedSlots: { customRender: 'operate' }, }]
      }
    },
    methods:{
      reSET(){
        this.searchParams = {
          projectNo:'', //戴卡部件号
          purpose: undefined, // 用途
          projectManager: '',//项目经理
          pageSize:5, //展示条数
          pageNO:1,//当前页
          factoryWareHouse:undefined,//工厂仓库
        }
      },
      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          getMouldOptions(searchName, '').then((data) => {
            this.dic[name] = data;
            if (name === 'noun') {
              this.dic.purpose = this.dic.noun;
            }
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
        this.getTopInformation();
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
        this.getTopInformation();
      },
      goDelivery() {
        this.$router.push({
          path: `/sampleLibrary/DeliveryManagement`,
        })
      },
      goRecordClosing() {
        this.$router.push({
          path: `/sampleLibrary/WaitingDatabaseRecordClosing`,
        })
      },
      getAppointOption() { // 获取指定的下拉框
        for (let name in this.option) {
          // let searchName = this.humpOrLine(name, 'toLine');
          getMouldOptions(name, '').then((data) => {
            this.option[name] = data;
          });
        }
      },
      modifyNumber(operator,i){
        this.modalData[0] = this.dataSource[i];
        this.modalVisible = true;
        this.modalTitle = '待发库库存调整';
        this.modalColumn = [
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center', },
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
          { title: '批次号', dataIndex: 'batch', key: 'batch', align: 'center', },
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center', },
          // { title: '工厂仓库', dataIndex: 'factoryWareHouse', key: 'factoryWareHouse', align: 'center', },
          { title: '待发库存', dataIndex: 'needSendNum', key: 'needSendNum', align: 'center', },
          { title: '包装确认报废', dataIndex: 'packScrapNum', key: 'packScrapNum', align: 'center', },
          { title: '待发库存报废', dataIndex: 'sendScrapNum', key: 'sendScrapNum', align: 'left'},]
        this.searchData = [
          {
            title:'调整数量',
            placeHolder:'请输入调整数量',
            value:''
          },
        ]
      },
      Scrap(operate, i){
        this.modalData[0] = this.dataSource[i];
        this.modalVisible = true;
        this.modalTitle = '待发库报废';
        this.modalColumn = [
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center', },
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
          { title: '批次号', dataIndex: 'batch', key: 'batch', align: 'center', },
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center', },
          { title: '工厂仓库', dataIndex: 'factoryWareHouse', key: 'factoryWareHouse', align: 'center', },
          { title: '待发库存', dataIndex: 'needSendNum', key: 'needSendNum', align: 'center', },
          { title: '包装确认报废', dataIndex: 'packScrapNum', key: 'packScrapNum', align: 'center', },
          { title: '待发库存报废', dataIndex: 'sendScrapNum', key: 'sendScrapNum', align: 'left'},]
        this.searchData = [
          {
            title:'报废数量',
            placeHolder:'请输入调报废数量',
            value:''
          },
        ]
      },
      getList(){
        this.searchParams.pageSize = this.pageSize;
        this.searchParams.pageNO = this.currentPage;
        getWarehouseSend(this.searchParams).then((data)=>{
          data = data.result;
          if (!data.records.length) {
            this.dataSource = [];
          }else {
            for (let i = 0; i < data.records.length; i++) { // 遍历返回的数据列表
              for (let name in data.records[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.records[i][name] && Number(data.records[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                      console.log(' 2355',this.dic[name][j].label);
                      data.records[i][name] = this.dic[name][j].label;
                    }
                  }
                }
              }
            }
          }
          this.dataSource = data.records;
          this.pageSize = data.size;
          this.total = data.total;
          this.pageNum = data.pages;
        })
      },
      closeFunction(){
        this.modalVisible = false;
        this.getList();
        this.getTopInformation();
      },
      getTopInformation(){
        getWarehouseStatistics().then((data)=>{
          this.waitingNumber = data.result.needSendNum; // 待发库存
          this.sureBadNumber = data.result.packScrapNum; // 包装确认报废
          this.waitingBadNumber = data.result.sendScrapNum; // 待发库存报废
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
    justify-content: space-between;
  }
  .item-frame{
    margin-right: 20px;
  }
  .display-frame{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .display-frame-left{
    width: 100%;
    height: 120px;
    border: 1px solid #F2F2F2;
  }
  .display-title{
    width: 100%;
    height: 50px;
    background-color:#F2F2F2;
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
  .span-margin{
    margin-right: 20px;
  }
  .display-data{
    width: 100%;
    height: 70px;
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
    margin-top: 20px;
  }
  .item-button{
    margin-right: 20px;
  }
  .double-button{
      /deep/ .ant-btn-background-ghost.ant-btn-primary{
          color: #fff;
          background-color: #FF4081 !important;
          border-color: #FF4081;
      }
  }
    .jn-public-table{
        /deep/ .ant-card-body{
            padding: 16px 20px;
        }
    }


</style>
