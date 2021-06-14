<template>
    <div style="overflow-x: auto"  class="jn-public-table" >
        <a-card style="min-width: 1600px">
    <div class="search-frame" >
      <div class="left-search-frame">
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
        <div  class="item-frame item-down">
<!--          <a-space align="center">-->
<!--            <span style="font-size: 14px; margin-right: 10px ">工厂仓库:</span>-->
<!--            <a-select  placeholder="请选择" v-model="searchParams.factoryWareHouse"  style="width: 174px; margin-left: 10px" >-->
<!--              <a-select-option v-for="data in option.factory_ware_house" :key="data.value">-->
<!--                {{ data.label }}-->
<!--              </a-select-option>-->
<!--            </a-select>-->
<!--          </a-space>-->
        </div>
        <div  class="item-frame item-down">
<!--        <a-space align="center">-->
<!--          <span style="font-size: 14px;" >库位:</span>-->
<!--          <a-select  placeholder="请选择" v-model="searchParams.inventoryLocation"  style="width: 174px; margin-left: 10px" >-->
<!--            <a-select-option v-for="data in option.inventory_location" :key="data.label">-->
<!--              {{ data.label }}-->
<!--            </a-select-option>-->
<!--          </a-select>-->
<!--        </a-space>-->
      </div>
      </div>
      <div class="right-button-frame">
          <a-button style="margin-right: 8px;" type="primary" @click="getList">查询</a-button>
          <a-button @click="reSET"  style="margin-right: 8px;"> 重置</a-button>
      </div>
    </div>
        </a-card>
        <a-card style="min-width: 1600px;margin-top: 16px">
    <div class="table-frame">
        <div style="text-align: right;margin-bottom: 12px;display: flex;justify-content: space-between">
            <h3>回库管理列表</h3>
            <div>
                <a-button style="margin-right: 8px;"  @click="manualGo"> 手动回库</a-button>
                <a-button style="margin-right: 8px"  @click="goRecord"> 回库记录</a-button>
            </div>
        </div>
      <a-table
        :dataSource="dataSource"
        :columns="columns"
        bordered
        :pagination = false
      >
        <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
          <a-button type="link" @click="returnWarehouse(operate, i)">回库</a-button>
          <a-button type="link" @click="sureCompleteModal(operate, i)">确认完成</a-button>
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
    <a-modal v-model:visible="sureComplete" title="确认完成">
      <span>该任务待回库数量未清零，是否提前完成该任务？</span>
      <template #footer>
        <a-button key="submit" type="primary"  @click="handleOk">确定</a-button>
        <a-button key="back" @click="sureComplete = false">取消</a-button>
      </template>
    </a-modal>
    <return-modal
      :modalVisible="modalVisible"
      :modalTitle = "modalTitle"
      :dataSource = "modalData"
      :columns="modalColumn"
      :dataSourceInput="dataSourceInput"
      @close="closeFunction"
    @changeData="changeDataSource">
    </return-modal>
    <manual-return-warehousing
      :modalVisible="manualVisible"
      @manualClose="manualVisible = false">

    </manual-return-warehousing>
  </a-card>
    </div>
</template>

<script>
  import {getMouldOptions,getWarehousingReturnManagement,returnSureComplete,returnInfo} from '@/api/api'
  import ReturnModal from './ReturnModal'
  import manualReturnWarehousing from './manualReturnWarehousing'
  export default {
    name: 'WarehouseReturnManagement',
    components:{ReturnModal,manualReturnWarehousing},
    mounted() {
      this.getAppointOption();
      setTimeout(()=>{
        this.getList();
      },300)
      this.getDic();
    },
    data() {
      return{
        option:{
          factory_ware_house:[],//工厂仓库
          noun:[],//用途
          inventory_location:[],//预入库位
        },
        total: 0, // 共多少条
        pageSize: 5, // 一页多少条
        pageNum: 1, // 共多少页
        jumpPage: 1, // 跳转到第几页
        currentPage: 1, // 当前页
        sureCompleteId: '', //确认完成id
        sureComplete:false, //确认完成弹窗
        modalVisible: false, // 显示弹窗组件
        modalTitle:'', // 弹窗标题
        modalData: [], //弹窗展示的数组
        modalColumn: [], //弹窗展示的列名
        dataSourceInput:[], //弹窗分割展示的列名
        manualVisible:false, //手动回库弹窗
        searchParams:{
          projectNo:'', //戴卡部件号
          purpose: undefined, // 用途
          projectManager: '',//项目经理
          pageSize:5, //展示条数
          pageNO:1,//当前页
          inventoryLocation:undefined,//库位
          factoryWareHouse:undefined,//工厂仓库
        },
        dic:{
          noun:[],
        },
        dataSource:[],
        columns: [
          { title: '发运流转单', dataIndex: 'shippingFlowSheet', key: 'shippingFlowSheet', align: 'center', },
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center', },
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
          { title: '入库批次', dataIndex: 'batch', key: 'batch',width:300, align: 'center', },
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center', },
          { title: '是否返库', dataIndex: 'returnStatus', key: 'returnStatus', align: 'center', },
          { title: '待回数量', dataIndex: 'needReturnNum', key: 'needReturnNum', align: 'center', },
          { title: '已回库数量', dataIndex: 'returnNum', key: 'returnNum', align: 'center', },
          { title: '操作', dataIndex: 'operate', key: 'operate', align: 'center', scopedSlots: { customRender: 'operate' }, },
        ]
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
          inventoryLocation:undefined,//库位
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
      sureCompleteModal(operate, i){
        this.sureComplete = true;
        this.sureCompleteId = operate.id;
      },
      handleOk() {
        returnSureComplete(this.sureCompleteId).then((data)=>{
          if(data.message == '成功'){
            this.sureComplete = false;
            this.getList();
            this.$message.success('确认完成成功');
          } else {
            this.$message.warning('确认完成失败');
          }
        })
      },
      handleCancel() {
        this.sureComplete = false;
      },
      getList(){
        this.searchParams.pageSize = this.pageSize;
        this.searchParams.pageNO = this.currentPage;
        getWarehousingReturnManagement(this.searchParams).then((data)=>{
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
          this.dataSource.forEach((item,index) =>{
            if(item.returnStatus){
              item.returnStatus = '是'
            }else{
              item.returnStatus = '否'
            }
          })
        })
      },
      goRecord(){
        this.$router.push({
          path: `/sampleLibrary/WarehouseReturnRecord`,
        })
      },
      returnWarehouse(operate, i){
        this.modalData[0] = this.dataSource[i];
        this.modalVisible = true;
        this.modalTitle = '回库单';
        const a = [];
        returnInfo(this.modalData[0].id).then((data)=>{
          console.log('3333',data);
          this.dataSourceInput = data.result;
          data.result.forEach((item)=>{
            item.batch = item.batch.replace(/,/g,'\n');
          })
        })
        this.modalColumn = [
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center'},
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center'},
          { title: '入库批次', dataIndex: 'batch', key: 'batch', align: 'center',width:300},
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center'},
          { title: '是否返库', dataIndex: 'returnStatus', key: 'returnStatus', align: 'center'},
          { title: '待回数量', dataIndex: 'needReturnNum', key: 'needReturnNum', align: 'center'},
          { title: '已回库数量', dataIndex: 'returnNum', key: 'returnNum', align: 'left'},]
      },
      changeDataSource(arr){
        this.dataSourceInput = arr;
      },
      manualGo(){
        this.manualVisible = true;
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
  }
  .left-search-frame{
    width: 75%;
    display: flex;
    flex-wrap: wrap;
  }
  .right-button-frame{
    width: 25%;
  }
  .item-frame{
    width: 33%;
  }
  .item-down{
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
