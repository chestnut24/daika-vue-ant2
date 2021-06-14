<template>
  <div class="jn-public-table" style="overflow-x: auto">
  <a-card style="min-width: 1600px">
    <div class="search-frame">
      <div class="search-frame-left">
        <div class="item-frame">
          <a-space align="center">
            <span style="font-size: 14px; margin-right: 5px">戴卡部件号:</span>
            <a-input style="width: 244px" v-model:value="searchParams.projectNo" placeholder="请输入戴卡部件号" />
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
            <a-input style="width: 244px"  v-model:value="searchParams.projectManager" placeholder="请输入项目经理姓名" />
          </a-space>
        </div>
        <div  class="item-frame" v-if="isShowOtherButtons">
<!--          <a-space align="center">-->
<!--            <span style="font-size: 14px ">待发仓库:</span>-->
<!--            <a-select  placeholder="请选择" v-model="searchParams.factoryWareHouse"  style="width: 244px; margin-left: 10px" >-->
<!--              <a-select-option v-for="data in option.factory_ware_house" :key="data.value">-->
<!--                {{ data.label }}-->
<!--              </a-select-option>-->
<!--            </a-select>-->
<!--          </a-space>-->
        </div>

        <div class="item-frame">
<!--          <a style="margin-right: 20px" @click="isShowOtherButtons = !isShowOtherButtons"> {{isShowOtherButtons?"收起":"展开"}} <a-icon :type="isShowOtherButtons?'up':'down'" /> </a>-->
          <a-button type="primary" style="width: 70px;margin-right: 8px" @click="getList">查询</a-button>
          <a-button style="margin-right: 8px" @click="reSET" > 重置</a-button>
        </div>
      </div>

    </div>
  </a-card>
    <a-card style="min-width: 1600px;margin-top: 12px">
    <div class="table-frame">
      <div style="display: flex;justify-content: space-between;margin-bottom: 12px">
        <h3>提货管理列表</h3>
        <a-button style="margin-right: 8px" @click="goCheck" >提货台账</a-button>
      </div>
      <a-table
        :dataSource="dataSource"
        :columns="columns"
        bordered
        :pagination = false
      >
        <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
          <a-button type="link" @click="openPick(operate, i)">提货</a-button>
          <a-button type="link" @click="deliveryComplete(operate, i)">提货完成</a-button>
          <a-button type="link" @click="goRecord(operate, i)">提货记录</a-button>
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
    <a-modal v-model:visible="deliveryVisible" title="确认完成">
      <span>该发运流转单的样件尚未完全提货 您是否提前完成提货任务？</span>
      <template #footer>
        <a-button key="submit" type="primary"  @click="handleOk">确定</a-button>
        <a-button key="back" @click="handleCancel()">取消</a-button>
      </template>
    </a-modal>
    <waiting-pick-up
      :modalVisible="modalVisible"
      :dataSource = "modalData"
      :columns="modalColumn"
      :dataSourceInput="dataSourceInput"
      @close="closeFunction">
    </waiting-pick-up>
  </a-card>
  </div>
</template>

<script>
  import {getDelivery, getMouldOptions,confirmSend,getPickUpList} from '@/api/api'
  import WaitingPickUp from './WaitingPickUp'
  export default {
    name: 'DeliveryManagement',
    components:{WaitingPickUp},
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
          pageSize:5, //展示条数
          pageNO:1,//当前页
          factoryWareHouse:undefined,//工厂仓库
        },
        option:{
          factory_ware_house:[],//工厂仓库
          noun:[],//用途
        },
        dic: { // 表单中的部分数据对应的的数据词典
          noun: [], // 维护状态
        },
        total: 0, // 共多少条
        pageSize: 5, // 一页多少条
        pageNum: 1, // 共多少页
        jumpPage: 1, // 跳转到第几页
        currentPage: 1, // 当前页
        deliveryVisible:false, //提货完成弹窗可视化
        deliveryCompleteId: '',//提货完成id
        deliveryNo:'', //提货完成发运流转单号
        modalVisible: false, // 显示弹窗组件
        modalData: [], //弹窗展示的数组
        modalColumn: [], //弹窗展示的列名
        dataSourceInput:[], //弹窗分割展示的列名
        dataSource: [
          {
            component:'',
            modelNumber:'',
            modelType:'',
            shopVisitDepartment:'',
            sendRepairDate:'',
            completionPlanDate:'',
          }
        ],//表格数据
        columns:[
          { title: '入库日期', dataIndex: 'createTime', key: 'createTime', align: 'center', },
          { title: '发运流转单号', dataIndex: 'shippingFlowSheet', key: 'shippingFlowSheet', align: 'center', },
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center', },
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
          { title: '批次号', dataIndex: 'batch', width:300,key: 'batch', align: 'center', },
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center', },
          // { title: '工厂仓库', dataIndex: 'factoryWareHouse', key: 'factoryWareHouse', align: 'center', },
          { title: '待发数量', dataIndex: 'needSendNum', key: 'needSendNum', align: 'center', },
          { title: '待发需求', dataIndex: 'needSendNumDemand', key: 'needSendNumDemand', align: 'center', },
          { title: '已提货', dataIndex: 'outWarehouseNum', key: 'outWarehouseNum', align: 'center', },
          { title: '操作', dataIndex: 'operate', key: 'operate', align: 'center', scopedSlots: { customRender: 'operate' }, }],
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
      goDelivery() {
        this.$router.push({
          path: `/sampleLibrary/DeliveryManagement`,
        })
      },
      handleOk() {
        confirmSend({id:this.deliveryCompleteId,shippingFlowSheet:this.deliveryNo}).then((data)=>{
          if(data.message == '成功'){
            this.deliveryVisible = false;
            this.getList();
            this.$message.success('提货完成');
          } else {
            this.$message.warning('提货失败');
          }
        })
      },
      handleCancel() {
        this.deliveryVisible = false;
      },
      deliveryComplete(operate, i){//提货完成弹窗
        this.deliveryVisible = true;
        this.deliveryCompleteId = operate.id;
        this.deliveryNo = operate.shippingFlowSheet;
      },
      goRecord(operate, i){
        localStorage.setItem('PickId', operate.id);
        this.$router.push({
          path: `/sampleLibrary/PickUpRecord`,
        })

      },
      goCheck(){
        localStorage.removeItem('PickId');
        this.$router.push({
          path: `/sampleLibrary/PickUpRecord`,
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
      getList(){
        this.searchParams.pageSize = this.pageSize;
        this.searchParams.pageNO = this.currentPage;
        getDelivery(this.searchParams).then((data)=>{
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
          data.records.forEach((item)=>{
            item.batch = item.batch.replace(/,/g,'\r\n');
          })
          this.dataSource = data.records;
          this.pageSize = data.size;
          this.total = data.total;
          this.pageNum = data.pages;
        })
      },
      openPick(operate, i){
        this.modalData[0] = this.dataSource[i];
        this.modalVisible = true;
        console.log('233', this.modalData[0]);
        getPickUpList({id:this.modalData[0].id}).then((data)=>{
          this.dataSourceInput = data.result;
        })
        this.modalColumn = [
          { title: '入库日期', dataIndex: 'createTime', key: 'createTime', align: 'center'},
          { title: '发运流转单', dataIndex: 'shippingFlowSheet', key: 'shippingFlowSheet', align: 'center'},
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center'},
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center'},
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center'},
          // { title: '工厂仓库', dataIndex: 'factoryWareHouse', key: 'factoryWareHouse', align: 'center'},
          { title: '待发数量', dataIndex: 'needSendNum', key: 'needSendNum', align: 'center'},
          { title: '待发需求', dataIndex: 'needSendNumDemand', key: 'needSendNumDemand', align: 'center', },]
        },
      closeFunction(){
        this.modalVisible = false;
        this.getList();
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
    /*margin-right: 20px;*/
    width: 25%;
    margin-bottom: 12px;
  }
  .display-frame{
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
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
    /*margin-top: 20px;*/
  }
  .item-button{
    margin-right: 20px;
  }
  .jn-public-table{
    /deep/ .ant-table-row-cell-break-word{
      /*white-space: nowrap;*/
      /*max-width: 300px;*/
      /*overflow-x: auto;*/
    }
  }


</style>
