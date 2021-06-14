<template>
  <div  style="overflow-x: auto">
    <div class="jn-public-table" style="min-width: 1600px;">
      <div class="card">
        <div class="left-frame">
          <div style="padding: 10px;background-color: #fff;width: 100%;margin-bottom: 10px">
            <div style="background-color: #F5F8FA;display: flex;justify-content: space-between;padding: 20px 50px">
              <img src="../../assets/sampleLibrayManagement/1.png" style="height: 60px" @click="warehousing">
              <img src="../../assets/sampleLibrayManagement/2.png" style="height: 60px" @click="outBound">
              <img src="../../assets/sampleLibrayManagement/3.png" style="height: 60px" @click="warehousingReturn">
              <img src="../../assets/sampleLibrayManagement/4.png" style="height: 60px" @click="waitingDatabase">
<!--              <img src="../../assets/sampleLibrayManagement/5.png" alt="">-->
            </div>
          </div>
          <a-card style="padding: 10px">
          <div class="left-search-frame">
            <div class="item-frame">
              <a-space align="center">
                <span style="font-size: 14px ">戴卡部件号:</span>
                <a-input v-model:value="searchParams.projectNo" placeholder="请输入戴卡部件号" />
              </a-space>
            </div>
            <div  class="item-frame">
              <a-space align="center">
                <span style="font-size: 14px; margin-right: 10px ">用途:</span>
                <a-select  placeholder="请选择" v-model="searchParams.purpose"  style="width:244px; margin-left: 10px" >
                  <a-select-option v-for="data in option.noun" :key="data.value">
                    {{ data.label }}
                  </a-select-option>
                </a-select>
              </a-space>
            </div>
            <div  class="item-frame item-down">
              <a-space align="center">
                <span style="font-size: 14px ;margin-right: 2px">项目经理:&nbsp;&nbsp;&nbsp;</span>
                <a-input v-model:value="searchParams.projectManager" placeholder="请输入项目经理" />
              </a-space>
            </div>
            <div  class="item-frame item-down">
              <a-button style="margin-right: 8px" type="primary" @click="getList"> 查询</a-button>
              <a-button @click="reSET"> 重置</a-button>
            </div>
          </div>
          <div class="button-frame">
<!--              <div class="left-button-frame">-->
<!--                <a-button style="margin-right: 26px;" @click="warehousing"> 入库</a-button>-->
<!--                <a-button style="margin-right: 26px;" @click="outBound"> 出库</a-button>-->
<!--                <a-button @click="warehousingReturn"> 回库</a-button>-->
<!--              </div>-->
<!--              <div class="right-button-frame">-->
<!--                <a-button type="primary" ghost @click="waitingDatabase"> 待发库管理</a-button>-->
<!--              </div>-->
            </div>
          <div class="left-table-frame">
            <a-table
              :dataSource="dataSource"
              :columns="columns"
              bordered
              :pagination = false
              :customRow="rowClick"
            >
              <a-space slot="planSum" slot-scope="text, operate, i" class="operate-row">
                <a-button type="link" @click="goOutBound(operate, i)">{{text}}</a-button>
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
        <a-card class="right-frame">
          <a-table
            :dataSource="dataSourceRight"
            :columns="columnsRight"
            bordered
            :pagination = false
          >
            <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
              <a-button type="link" @click="inventoryAdjustment(operate, i)">库存调整</a-button>
              <a-button type="link" @click="openScrap(operate, i)">报废</a-button>
            </a-space>
          </a-table>
        </a-card>
      </div>
      <sample-modal
        :modalVisible="modalVisible"
        :modalTitle = "modalTitle"
        :dataSource = "modalData"
        :columns="modalColumn"
        :searchData = "searchData"
        @close="closeFunction">
      </sample-modal>
    </div>
  </div>

</template>

<script>
  import {getMouldOptions,getSampleList, getSampleById} from '@/api/api'
  import SampleModal from './SampleModal'
  export default {
    name: 'SampleLibraryManagement',
    components: { SampleModal },
    mounted() {
      this.getAppointOption();
      this.getDic();
      setTimeout(()=>{
        this.getList();
      },300)
    },
    data(){
      return{
        searchParams:{
          projectNo:'', //戴卡部件号
          purpose: undefined, // 用途
          projectManager: '',//项目经理
          pageNO:1,//当前页
          pageSize:5//展示条数
        },
        option:{
          noun:[],//用途
        },
        dic: { // 表单中的部分数据对应的的数据词典
          noun: [], // 维护状态
          factoryWareHouse:[],//工厂仓库
        },
        total:0,
        modalVisible: false, // 显示弹窗组件
        modalTitle:'', // 弹窗标题
        modalData: [], //弹窗展示的数组
        modalColumn: [], //弹窗展示的列名
        searchData: [],//弹窗展示搜索的循环数组
        pageSize: 5,
        currentPage: 1,
        pageNum:1,
        jumpPage:0,
        dataSource:[], // 左侧列表数据组
        dataSourceRight:[], //右侧列表数据组
        selectBatch:'',//选择的 行
        columns: [
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center', },
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center', },
          { title: '待查库存', dataIndex: 'stock', key: 'stock', align: 'center', },
          { title: '包装中', dataIndex: 'packNum', key: 'packNum', align: 'center', },
          { title: '待发库存', dataIndex: 'needSendNum', key: 'needSendNum', align: 'center', },
          { title: '所含批次', dataIndex: 'batchNum', key: 'batchNum', align: 'center', },
          { title: '计划数', dataIndex: 'planSum', key: 'planSum', align: 'center', scopedSlots: { customRender: 'planSum' },},],
        columnsRight:[
          { title: '入库批次号', dataIndex: 'batch', key: 'batch', align: 'center', },
          { title: '待查库存', dataIndex: 'stock', key: 'stock', align: 'center', },
          // { title: '包装中', dataIndex: 'packNum', key: 'packNum', align: 'center', },
          // { title: '待发库存', dataIndex: 'needSendNum', key: 'needSendNum', align: 'center', },
          { title: '是否外购', dataIndex: 'warehouseIntoStatus', key: 'warehouseIntoStatus', align: 'center', },
          { title: '工厂仓库', dataIndex: 'factoryWareHouse', key: 'factoryWareHouse', align: 'center', },
          { title: '库位', dataIndex: 'inventoryLocation', key: 'inventoryLocation', align: 'center', },
          { title: '样件位置', dataIndex: 'exemplarLocation', key: 'exemplarLocation', align: 'center', },
          { title: '操作', dataIndex: 'operate', key: 'operate', align: 'center', scopedSlots: { customRender: 'operate' }, },]
      }
    },
    methods:{
      reSET(){
        this.searchParams = {
          projectNo:'', //戴卡部件号
          purpose: undefined, // 用途
          projectManager: '',//项目经理
          pageNO:1,//当前页
          pageSize:5//展示条数
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
      warehousing() {//入库跳转
        this.$router.push({
          path: `/sampleLibrary/WarehousingManagement`,
        })
      },
      outBound() {//出库跳转
        this.$router.push({
          path: `/sampleLibrary/OutboundManagement`,
        })
      },
      goOutBound(operate,i){
        this.$router.push({
          path: `/sampleLibrary/OutboundManagement`,
          query:{
            projectNo: operate.projectNo,
            purpose:operate.purpose,
            judgeReel:false,
          }
        })
      },
      warehousingReturn() {//回库跳转
        this.$router.push({
          path: `/sampleLibrary/WarehouseReturnManagement`,
        })
      },
      waitingDatabase() { //待发库跳转
        this.$router.push({
          path: `/sampleLibrary/WaitingDatabaseManagement`,
        })
      },
      openScrap(operate, i){ //打开报废弹窗
        this.modalData[0] = this.dataSourceRight[i];
        this.modalVisible = true;
        this.modalTitle = '报废';
        this.modalColumn = [
          { title: '入库批次号', dataIndex: 'batch', key: 'batch', align: 'center', },
          { title: '待查库存', dataIndex: 'stock', key: 'stock', align: 'center', },
          // { title: '包装中', dataIndex: 'packNum', key: 'packNum', align: 'center', },
          // { title: '待发库存', dataIndex: 'needSendNum', key: 'needSendNum', align: 'center', },
          { title: '是否外购', dataIndex: 'warehouseIntoStatus', key: 'warehouseIntoStatus', align: 'center', },
          { title: '工厂仓库', dataIndex: 'factoryWareHouse_dictText', key: 'factoryWareHouse_dictText', align: 'center', },
          { title: '库位', dataIndex: 'inventoryLocation', key: 'inventoryLocation', align: 'center', },
          { title: '样件位置', dataIndex: 'exemplarLocation', key: 'exemplarLocation', align: 'center'},]
        this.searchData = [
          {
            title:'报废数量',
            placeHolder:'请输入',
            value:''
          },
        ]
      },
      inventoryAdjustment(operate, i) { // 打开调整库存窗口
        this.modalData[0] = this.dataSourceRight[i];
        this.modalVisible = true;
        this.modalTitle = '库存调整';
        this.modalColumn = [
          { title: '入库批次号', dataIndex: 'batch', key: 'batch', align: 'center', },
          { title: '待查库存', dataIndex: 'stock', key: 'stock', align: 'center', },
          // { title: '包装中', dataIndex: 'packNum', key: 'packNum', align: 'center', },
          // { title: '待发库存', dataIndex: 'needSendNum', key: 'needSendNum', align: 'center', },
          { title: '是否外购', dataIndex: 'warehouseIntoStatus', key: 'warehouseIntoStatus', align: 'center', },
          { title: '工厂仓库', dataIndex: 'factoryWareHouse', key: 'factoryWareHouse', align: 'center', },
          { title: '库位', dataIndex: 'inventoryLocation', key: 'inventoryLocation', align: 'center', },
          { title: '样件位置', dataIndex: 'exemplarLocation', key: 'exemplarLocation', align: 'center'},]
        this.searchData = [
          {
            title:'调整数量',
            placeHolder:'请输入调整数量',
            value:''
          },
        ]
      },
      getAppointOption() { // 获取指定的下拉框
        for (let name in this.option) {
          getMouldOptions(name, '').then((data) => {
            this.option[name] = data;
          });
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
        console.log('this.dic',this.dic);

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
      getList(){
        this.searchParams.pageSize = this.pageSize;
        this.searchParams.pageNO = this.currentPage;
        getSampleList(this.searchParams).then((data)=>{
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
      rowClick(record) {
        // 事件
        return {
          on: {
            click: () => {
              this.selectBatch = record;
              let purposeValue = '';
              this.dic.purpose.forEach((item)=>{
                if(this.selectBatch.purpose == item.label){
                  purposeValue = item.value;
                }
              })
              getSampleById({purpose:purposeValue,projectNo:this.selectBatch.projectNo}).then((data)=>{
                if (!data.result.length) {
                  this.dataSourceRight = [];
                }else {
                  for (let i = 0; i < data.result.length; i++) { // 遍历返回的数据列表
                    for (let name in data.result[i]) { // 列表每行 for 出每个属性
                      if (name in this.dic) { // 如果该属性在字典里
                        for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                          if (data.result[i][name] && Number(data.result[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                            console.log(' 2355',this.dic[name][j].label);
                            data.result[i][name] = this.dic[name][j].label;
                          }
                        }
                      }
                    }
                  }
                }
                this.dataSourceRight = data.result;
                this.dataSourceRight.forEach((item)=>{
                  if(item.warehouseIntoStatus){
                    item.warehouseIntoStatus = '是'
                  }else{
                    item.warehouseIntoStatus = '否'
                  }
                })

              })
            }
          },
          style: {
            'background-color': record === this.selectBatch ? '#e6f7ff' : 'white'
          },
        }
      },
      closeFunction(){
        this.modalVisible = false;
        this.getList();
        let purposeValue = '';
        this.dic.purpose.forEach((item)=>{
          if(this.selectBatch.purpose == item.label){
            purposeValue = item.value;
          }
        })
        getSampleById({purpose:purposeValue,projectNo:this.selectBatch.projectNo}).then((data)=>{
          if (!data.result.length) {
            this.dataSourceRight = [];
          }else {
            for (let i = 0; i < data.result.length; i++) { // 遍历返回的数据列表
              for (let name in data.result[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.result[i][name] && Number(data.result[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                      console.log(' 2355',this.dic[name][j].label);
                      data.result[i][name] = this.dic[name][j].label;
                    }
                  }
                }
              }
            }
          }
          this.dataSourceRight = data.result;
          this.dataSourceRight.forEach((item)=>{
            if(item.warehouseIntoStatus){
              item.warehouseIntoStatus = '是'
            }else{
              item.warehouseIntoStatus = '否'
            }
          })

        })
      }
    },
  }
</script>

<style scoped lang="less">
  @import "./../../css/public-table-css";
  /deep/ .ant-table-body{
    th{
      font-size: 14px !important;
    }
    td{
      font-size: 14px !important;
    }
  }
  .card{
    width: 100%;
    display: flex;
    /deep/ .ant-card-body{
      padding: 10px 0;
    }
  }
  .left-frame{
    width: 45%;
    margin-right: 10px;
    /*padding: 10px;*/
  }
  .left-search-frame{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .item-down{
    margin-top: 20px;
  }
  .item-frame{
    width: 50%;
  }
  .right-frame{
    width: 55%;
    padding: 0 10px;
  }
  .button-frame{
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

  }
  .left-button-frame{
    width: 68%;
    display: flex;
  }
  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    align-items: center;
  }

</style>
