<template>
  <div class="jn-public-table" style="overflow-x: auto">
    <a-card style="min-width: 1600px">
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
            <a-select  placeholder="请选择" v-model="searchParams.purpose"  style="width: 244px; margin-left: 5px" >
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
        <div  class="item-frame" v-if="isShowOtherButtons">
<!--          <a-space align="center">-->
<!--            <span style="font-size: 14px ">工厂仓库:</span>-->
<!--            <a-select  placeholder="请选择" v-model="searchParams.factoryWareHouse"  style="width: 244px; margin-left: 5px" >-->
<!--              <a-select-option v-for="data in option.factory_ware_house" :key="data.value">-->
<!--                {{ data.label }}-->
<!--              </a-select-option>-->
<!--            </a-select>-->
<!--          </a-space>-->
        </div>
        <div class="item-frame">
<!--          <a style="margin-right: 20px" @click="isShowOtherButtons = !isShowOtherButtons"> {{isShowOtherButtons?"收起":"展开"}} <a-icon :type="isShowOtherButtons?'up':'down'" /> </a>-->
          <a-button type="primary" style="width: 70px;margin-right: 8px"  @click="getList">查询</a-button>
          <a-button @click="reSET" style="margin-right: 32px;"> 重置</a-button>
        </div>
      </div>

    </div>
    </a-card>
    <a-card style="min-width: 1600px;margin-top: 12px">
    <div class="table-frame">
      <a-tabs type="card" @change="callback">
        <a-tab-pane   v-for="(item, index) in tabArr"   :key="index" :tab="item.tab" >
          <a-table
            :dataSource="item.dataSource"
            :columns="item.columns"
            bordered
            :pagination = false
          >
          </a-table>
          <!--    分页-->
          <div class="bottom-page">
            <a-pagination
              :total=item.total
              :show-total="total => `共 ${total} 条`"
              :page-size=item.pageSize
              :current="item.currentPage"
              @change="pageChange"
            />
            <div style="margin: 0 20px">共 {{item.pageNum}} 页</div>
            <div style="margin: 0 10px 0 0">到第</div>
            <a-input-number style="width: 50px" @keyup.enter.native="pageJump(checkTab1,item.jumpPage)" v-model="item.jumpPage"></a-input-number>
            <div style="margin: 0 20px 0 10px">页</div>
            <a-button type="primary" @click="pageJump(checkTab1,item.jumpPage)">跳转</a-button>
          </div>

        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
  </div>
</template>

<script>
  import {getWarehouseSendRecord, getMouldOptions} from '@/api/api'
  export default {
    name: 'WaitingDatabaseRecordClosing',
    mounted() {
      this.getAppointOption();
      setTimeout(()=>{
        this.getList();
      },300)
      this.getDic();
    },
    data(){
      return{
        searchParams:{
          projectNo:'', //戴卡部件号
          purpose: undefined, // 用途
          projectManager: '',//项目经理
          pageSize:5, //展示条数
          pageNO:1,//当前页
          factoryWareHouse:undefined,//工厂仓库
          type: 1, //默认是1，随着tab页改变改变 1为入库记录，2为提货记录，3包装确认报废记录，4待发库报废记录，5为待发库存调整记录
        },
        option:{
          factory_ware_house:[],//工厂仓库
          noun:[],//用途
        },
        dic:{
          noun:[],
        },
        tabArr:[
          {tab:'入库记录',total:0,pageSize:5,currentPage:1,pageNum:0,jumpPage:0,dataSource:[],
            columns:[
              { title: '入库日期', dataIndex: 'createTime', key: 'createTime', align: 'center', },
              { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center', },
              { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
              { title: '批次号', dataIndex: 'batch', key: 'batch', align: 'center', },
              { title: '发运流转单号', dataIndex: 'shippingFlowSheet', key: 'shippingFlowSheet', align: 'center', },
              { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center', },
              // { title: '工厂仓库', dataIndex: 'factoryWareHouse_dictText', key: 'factoryWareHouse_dictText', align: 'center', },
              { title: '入库数量', dataIndex: 'updateSendNum', key: 'updateSendNum', align: 'center', },
              { title: '入库人', dataIndex: 'createBy', key: 'createBy', align: 'center', },
              { title: '备注信息', dataIndex: 'remark', key: 'remark', align: 'left', }
            ]},
          {tab: '提货记录',total:0,pageSize:5,currentPage:1,pageNum:0,jumpPage:0,dataSource:[],
            columns:[
              { title: '提货日期', dataIndex: 'createTime', key: 'createTime', align: 'center', },
              { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center', },
              { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
              { title: '批次号', dataIndex: 'batch', key: 'batch', align: 'center', },
              { title: '发运流转单号', dataIndex: 'shippingFlowSheet', key: 'shippingFlowSheet', align: 'center', },
              { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center', },
              // { title: '工厂仓库', dataIndex: 'factoryWareHouse_dictText', key: 'factoryWareHouse_dictText', align: 'center', },
              { title: '提货数量', dataIndex: 'updateSendNum', key: 'updateSendNum', align: 'center', },
              { title: '提货人', dataIndex: 'createBy', key: 'createBy', align: 'center', },
              { title: '备注信息', dataIndex: 'remark', key: 'remark', align: 'left', }
            ]},
          {tab: '包装确认报废记录',total:0,pageSize:5,currentPage:1,pageNum:0,jumpPage:0,dataSource:[],
            columns:[
              { title: '包装确认报废日期', dataIndex: 'createTime', key: 'createTime', align: 'center', },
              { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center', },
              { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
              { title: '批次号', dataIndex: 'batch', key: 'batch', align: 'center', },
              { title: '发运流转单号', dataIndex: 'shippingFlowSheet', key: 'shippingFlowSheet', align: 'center', },
              { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center', },
              // { title: '工厂仓库', dataIndex: 'factoryWareHouse_dictText', key: 'factoryWareHouse_dictText', align: 'center', },
              { title: '包装确认报废数量', dataIndex: 'updateSendNum', key: 'updateSendNum', align: 'center', },
              { title: '包装确认报废人', dataIndex: 'createBy', key: 'createBy', align: 'center', },
              { title: '备注信息', dataIndex: 'remark', key: 'remark', align: 'left', }
            ]},
          {tab: '待发库报废记录',total:0,pageSize:5,currentPage:1,pageNum:0,jumpPage:0,dataSource:[],
            columns:[
              { title: '待发库报废日期', dataIndex: 'createTime', key: 'createTime', align: 'center', },
              { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center', },
              { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
              { title: '批次号', dataIndex: 'batch', key: 'batch', align: 'center', },
              { title: '发运流转单号', dataIndex: 'shippingFlowSheet', key: 'shippingFlowSheet', align: 'center', },
              { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center', },
              // { title: '工厂仓库', dataIndex: 'factoryWareHouse_dictText', key: 'factoryWareHouse_dictText', align: 'center', },
              { title: '待发库报废数量', dataIndex: 'updateSendNum', key: 'updateSendNum', align: 'center', },
              { title: '待发库报废人', dataIndex: 'createBy', key: 'createBy', align: 'center', },
              { title: '备注信息', dataIndex: 'remark', key: 'remark', align: 'left', }
            ]},
          {tab: '待发库库存调整记录',total:0,pageSize:5,currentPage:1,pageNum:0,jumpPage:0,dataSource:[],
            columns:[
              { title: '待发库库存调整日期', dataIndex: 'createTime', key: 'createTime', align: 'center', },
              { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center', },
              { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
              { title: '批次号', dataIndex: 'batch', key: 'batch', align: 'center', },
              { title: '发运流转单号', dataIndex: 'shippingFlowSheet', key: 'shippingFlowSheet', align: 'center', },
              { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center', },
              // { title: '工厂仓库', dataIndex: 'factoryWareHouse_dictText', key: 'factoryWareHouse_dictText', align: 'center', },
              { title: '待发库库存调整数量', dataIndex: 'updateSendNum', key: 'updateSendNum', align: 'center', },
              { title: '待发库库存调整人', dataIndex: 'createBy', key: 'createBy', align: 'center', },
              { title: '备注信息', dataIndex: 'remark', key: 'remark', align: 'left', }
            ]},
        ],
        checkTab:1,//选中的tab页
        checkTab1:0,//默认选中的是tab[0]
        columns:[
          { title: '提货日期', dataIndex: 'createTime', key: 'createTime', align: 'center', },
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center', },
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
          { title: '批次号', dataIndex: 'batch', key: 'batch', align: 'center', },
          { title: '发运流转单号', dataIndex: 'shippingFlowSheet', key: 'shippingFlowSheet', align: 'center', },
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center', },
          // { title: '工厂仓库', dataIndex: 'factoryWareHouse_dictText', key: 'factoryWareHouse_dictText', align: 'center', },
          { title: '提货数量', dataIndex: 'updateSendNum', key: 'updateSendNum', align: 'center', },
          { title: '提货人', dataIndex: 'createBy', key: 'createBy', align: 'center', },
          { title: '备注信息', dataIndex: 'remark', key: 'remark', align: 'center', }
        ],
        isShowOtherButtons: false,
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
      callback(key) {
        console.log(key);
        this.checkTab = key + 1;
        this.checkTab1 = key
        this.getList();
      },
      pageChange(val){
        this.tabArr[this.checkTab1].currentPage = val;
        this.getList();
      },
      pageJump(key,page){
        if(page > this.tabArr[key].pageNum){
          page = this.tabArr[key].pageNum;
          this.tabArr[key].jumpPage = this.tabArr[key].pageNum;
        }else if (page < 1){
          page = 1;
          this.tabArr[key].jumpPage = 1;
        }
        this.tabArr[key].currentPage = page;
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
        this.searchParams.pageSize = this.tabArr[this.checkTab1].pageSize;
        this.searchParams.pageNO = this.tabArr[this.checkTab1].currentPage;
        this.searchParams.type = this.checkTab;
        getWarehouseSendRecord(this.searchParams).then((data)=>{
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
          this.tabArr[this.checkTab1].dataSource = data.records;
          this.tabArr[this.checkTab1].pageSize = data.size;
          this.tabArr[this.checkTab1].total = data.total;
          console.log('this.tabArr[this.checkTab1].dataSource',this.tabArr[this.checkTab1].dataSource)
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
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .item-frame{
    width: 25%;
    margin-bottom: 12px;
  }
  .table-frame{
    margin-top: 20px;
  }
  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    align-items: center;
  }

</style>
