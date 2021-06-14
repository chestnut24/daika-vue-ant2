<template>
  <div class="jn-public-table" style="overflow-x: auto">
    <a-card style="min-width: 1600px">
      <div class="search-frame">
<!--        <div class="left-search-frame">-->
          <div class="item-frame">
            <a-space align="center">
              <span style="font-size: 14px; margin-right: 5px">戴卡部件号:</span>
              <a-input v-model:value="searchParams.projectNo" placeholder="请输入戴卡部件号" />
            </a-space>
          </div>
          <div  class="item-frame">
            <a-space align="center">
              <span style="font-size: 14px; margin-right: 38px ">用途:</span>
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
              <a-input v-model:value="searchParams.projectManager" placeholder="请输入项目经理姓名" />
            </a-space>
          </div>
          <div  class="item-frame" v-if="isShowOtherButtons">
            <a-space align="center">
              <span style="font-size: 14px; margin-right: 10px ">下线车间:</span>
              <a-select  placeholder="请选择" v-model="searchParams.trialProductionSite"  style="width: 244px; margin-left: 10px" >
                <a-select-option v-for="data in option.trial_production_site" :key="data.value">
                  {{ data.label }}
                </a-select-option>
              </a-select>
            </a-space>
          </div>
          <div  class="item-frame" v-if="isShowOtherButtons">
          <a-space align="center">
            <span style="font-size: 14px; margin-right: 10px ">预入库位:</span>
            <a-select  placeholder="请选择" v-model="searchParams.inventoryLocation"  style="width: 244px; margin-left: 10px" >
              <a-select-option v-for="data in option.inventory_location" :key="data.label">
                {{ data.label }}-{{data.description}}
              </a-select-option>
            </a-select>
          </a-space>
        </div>
<!--        </div>-->
        <div class="item-frame">
          <a style="margin-right: 20px" @click="isShowOtherButtons = !isShowOtherButtons"> {{isShowOtherButtons?"收起":"展开"}} <a-icon :type="isShowOtherButtons?'up':'down'" /> </a>
          <a-button type="primary"  @click="getList" style="margin-right: 8px;"> 查询</a-button>
          <a-button  @click="reSET" style="margin-right: 8px;"> 重置</a-button>

        </div>
      </div>
    </a-card>
    <a-card style="margin-top: 16px;min-width: 1600px">
      <div class="table-frame">
        <div style="display: flex;justify-content: space-between;margin-bottom: 12px">
          <h3>入库管理列表</h3>
          <div>
            <a-button style="margin-right: 8px" @click="openStock" > 外购入库</a-button>
            <a-button style="margin-right: 8px"  @click="warehousingRecord"> 入库记录</a-button>
          </div>
        </div>
        <a-table
                :dataSource="dataSource"
                :columns="columns"
                bordered
                :pagination = false
        >
          <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
            <a-button type="link" @click="openRecord(operate, i)">入库</a-button>
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
      <sample-modal
              :modalVisible="modalVisible"
              :modalTitle = "modalTitle"
              :dataSource = "modalData"
              :columns="modalColumn"
              :searchData = "searchData"
              @close="closeFunction">
      </sample-modal>
      <a-modal v-model:visible="sureComplete" title="确认完成">
        <span>该入库任务的下线样件并未全部入库是否确认现在完成该任务？</span>
        <template #footer>
          <a-button key="submit" type="primary"  @click="handleOk">确定</a-button>
          <a-button key="back" @click="handleCancel()">取消</a-button>
        </template>
      </a-modal>
      <a-modal v-model:visible="purchaseStock" title="外购入库" width="700px">
        <div class="stock-search-frame">
          <div class="item-frame2">
            <a-space align="center">
              <span style="font-size: 14px;">戴卡部件号:</span>
              <!--            <a-input v-model:value="submitParams.projectNo" placeholder="请输入戴卡部件号"  @change="getPurpose"/>-->
              <a-input-search
                      placeholder="请输入戴卡部件号"
                      enter-button
                      style="width: 174px; "
                      v-model:value="submitParams.projectNo"
                      @search="openSelect"
                      @change="getPurpose"
              />
            </a-space>
          </div>
          <div  class="item-frame2">
            <a-space align="center">
              <span style="font-size: 14px;">用途:</span>
              <a-select  placeholder="请选择" v-model="submitParams.purpose"  style="width: 174px;" >
                <a-select-option v-for="data in option.noun" :key="data.value">
                  {{ data.label }}
                </a-select-option>
              </a-select>
            </a-space>
          </div>
          <div  class="item-frame2 item-down">
            <a-space align="center">
              <span style="font-size: 14px;">项目经理:</span>
              <a-input  placeholder="自动" v-model="submitParams.projectManager"  style="width: 174px; "  :disabled="true">
              </a-input>
            </a-space>
          </div>
          <div  class="item-frame2 item-down">
            <a-space align="center">
              <span style="font-size: 14px;" >库位:</span>
              <a-input  placeholder="请选择" v-model="submitParams.inventoryLocation"  style="width: 174px;" :disabled="true">
              </a-input>
            </a-space>
          </div>
          <div class="item-frame2 item-down">
            <a-space align="center">
              <span style="font-size: 14px;">样件位置:</span>
              <a-input v-model:value="submitParams.exemplarLocation" style="width: 174px;" placeholder="请输入样件位置" />
            </a-space>
          </div>
          <div class="item-frame2 item-down">
            <a-space align="center">
              <span style="font-size: 14px;">入库数量:</span>
              <a-input v-model:value="submitParams.intoWarehouse" style="width: 174px;" placeholder="请输入入库数量" />
            </a-space>
          </div>
          <div class="item-frame2 item-down">
            <a-space align="center">
              <span style="font-size: 14px; ">工厂仓库:</span>
              <a-select  placeholder="请选择" v-model="submitParams.factoryWareHouse"  style="width: 174px; " >
                <a-select-option v-for="data in option.factory_ware_house" :key="data.value">
                  {{ data.label }}
                </a-select-option>
              </a-select>
            </a-space>
          </div>
          <div class="text-frame">
            <p style="border-left: 4px solid #347EF2;padding-left: 6px;margin-top: 10px;">备注:</p>
            <a-textarea
                    v-model="submitParams.remark"
                    placeholder="请输入备注"
                    :auto-size="{ minRows: 3}"
                    style="width: 100%;background-color: #F7F8FA;border: 0"
            />
          </div>
        </div>
        <template #footer>
          <a-spin :spinning="spinning" style="width: 35%;margin:0 auto;">
          <div class="submit-frame">
              <a-button key="submit" type="primary"  @click="stock">确认入库</a-button>
              <a-button key="back" style="width:88px" @click="stockCancel()" >关闭</a-button>
          </div>
          </a-spin>
        </template>
        <select-number ref="modal" v-on:get-text="getProjectNumber"></select-number>
      </a-modal>

    </a-card>
  </div>
</template>

<script>
  import SampleModal from './SampleModal'
  import {getMouldOptions, getWarehousingManagement,submitBuy,sureComplete,selectManagerByProjectNo} from '@/api/api'
  import SelectNumber from '../system/SelectNumber'
  export default {
    name: 'WarehousingManagement',
    components: { SampleModal, SelectNumber},
    mounted() {
      this.getAppointOption();
      setTimeout(()=>{
        this.getList();
      },300)
      this.getDic();
    },
    data() {
      return{
        spinning:false,
        option:{
          trial_production_site:[],//下线车间
          noun:[],//用途
          inventory_location:[],//预入库位
          factory_ware_house:[],//工厂仓库
        },
        searchParams:{
          projectNo:'', //戴卡部件号
          purpose: undefined, // 用途
          projectManager: '',//项目经理
          trialProductionSite:undefined,//下线车间
          inventoryLocation:undefined,//库位
          pageNO:1,//当前页
          pageSize:5, // 展示条数
          factoryWareHouse: undefined, // 工厂仓库
        },
        submitParams:{
          projectNo:'',
          purpose:undefined,
          projectManager:undefined,
          inventoryLocation:7911,
          exemplarLocation:'',
          intoWarehouse:'',
          remark:'',
          factoryWareHouse:undefined,
        },
        projectManagerArr:[],//级联生成的项目经理数组
        modalVisible: false, // 显示弹窗组件
        modalTitle:'', // 弹窗标题
        modalData: [], //弹窗展示的数组
        modalColumn: [], //弹窗展示的列名
        searchData: [],//弹窗展示搜索的循环数组
        sureComplete: false, // 确认完成弹窗
        purchaseStock: false, //外购入库弹窗
        total: 0, // 共多少条
        pageSize: 5, // 一页多少条
        pageNum: 1, // 共多少页
        jumpPage: 1, // 跳转到第几页
        currentPage: 1, // 当前页
        sureCompleteId: '', //确认完成id
        dataSource:[],
        dic:{
          noun:[],
        },
        timer:null,
        columns: [
          { title: '试制流转单号', dataIndex: 'trialProductionFormNo', key: 'trialProductionFormNo', align: 'center'},
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center'},
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center'},
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center'},
          { title: '下线时间', dataIndex: 'offlineTime', key: 'offlineTime', align: 'center'},
          { title: '下线车间', dataIndex: 'trialProductionSite_dictText', key: 'trialProductionSite_dictText', align: 'center'},
          { title: '下线数量', dataIndex: 'offlineCount', key: 'offlineCount', align: 'center'},
          { title: '待入数量', dataIndex: 'waitIntoNumber', key: 'waitIntoNumber', align: 'center'},
          { title: '已入库数量', dataIndex: 'intoWarehouse', key: 'intoWarehouse', align: 'center'},
          { title: '预入库位', dataIndex: 'inventoryLocation', key: 'inventoryLocation', align: 'center'},
          { title: '操作', dataIndex: 'operate', key: 'operate', align: 'center', scopedSlots: { customRender: 'operate' }},
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
          trialProductionSite:undefined,//下线车间
          inventoryLocation:undefined,//库位
          pageNO:1,//当前页
          pageSize:5, // 展示条数
          factoryWareHouse: undefined, // 工厂仓库
        }
      },
      openSelect() {
        this.$refs.modal.add();
      },
      getProjectNumber(e) { // 父组件监听子组件值
        this.submitParams.projectNo = e.projectNumber;
        this.getPurpose();

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
      warehousingRecord(){ //进入入库记录
        this.$router.push({
          path: `/sampleLibrary/WarehousingRecord`,
        })
      },
      openRecord(operate, i){
        this.modalData[0] = this.dataSource[i];
        this.modalVisible = true;
        this.modalTitle = '入库单';
        this.modalColumn = [
          { title: '试制流转单号', dataIndex: 'trialProductionFormNo', key: 'trialProductionFormNo', align: 'center'},
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center'},
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center'},
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center'},
          { title: '下线时间', dataIndex: 'offlineTime', key: 'offlineTime', align: 'center'},
          { title: '下线车间', dataIndex: 'trialProductionSite_dictText', key: 'trialProductionSite_dictText', align: 'center'},
          { title: '下线数量', dataIndex: 'offlineCount', key: 'offlineCount', align: 'center'},
          { title: '待入数量', dataIndex: 'waitIntoNumber', key: 'waitIntoNumber', align: 'center'},
          { title: '已入库数量', dataIndex: 'intoWarehouse', key: 'intoWarehouse', align: 'center'},
          { title: '预入库位', dataIndex: 'inventoryLocation', key: 'inventoryLocation', align: 'center'}]
        this.searchData = [
          {
            title:'样件位置',
            placeHolder:'请输入样位位置',
            value:''
          },
          {
            title:'入库数量',
            placeHolder:'请输入入库数量',
            value:''
          },
        ]
      },
      sureCompleteModal(operate, i){//确认完成弹窗
        this.sureComplete = true;
        this.sureCompleteId = operate.id;
      },
      openStock(){ //外购入库打开
        this.purchaseStock = true;
      },
      handleOk() {
        sureComplete(this.sureCompleteId).then((data)=>{
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
      stock(){
        this.spinning = true;
        submitBuy(this.submitParams).then((data)=>{
          this.spinning = false;
          if(data.message == '成功'){
            this.purchaseStock = false;
            this.initSubmit();
            this.getList();
            this.$message.success(data.message);
          } else {
            this.$message.warning(data.message);
          }
        })
      },
      stockCancel(){
        this.purchaseStock = false;
        this.initSubmit();
      },
      getAppointOption() { // 获取指定的下拉框
        for (let name in this.option) {
          // let searchName = this.humpOrLine(name, 'toLine');
          getMouldOptions(name, '').then((data) => {
            this.option[name] = data;
          });
        }
      },
      getList(){ // 获取列表页
        this.searchParams.pageSize = this.pageSize;
        this.searchParams.pageNO = this.currentPage;
        getWarehousingManagement(this.searchParams).then((data)=>{
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
      },
      getPurpose(){
        // 输入框防抖
        // clearTimeout(this.timer) // 每次进来的时候都将之前的清除掉，如果还没到一秒的时候就将之前的清除掉，这样就不会触发之前setTimeout绑定的事件， 如果超过一秒，之前的事件就会被触发下次进来的时候同样清除之前的timer
        // this.timer = setTimeout(() => {
          // 切换为搜索
        console.log('2333');
          selectManagerByProjectNo({projectNo: this.submitParams.projectNo}).then((data)=>{
            console.log('submitParams.projectNo', data.result&&data.result.length);
            if(data.result&&data.result.length !== 0 ){
              this.submitParams.projectManager = data.result[0];
            }else{
              this.submitParams.projectManager = '';
            }

          })

        // }, 400)
      },
      initSubmit(){
        this.submitParams = {
          projectNo:'',
          purpose:undefined,
          projectManager:undefined,
          inventoryLocation:undefined,
          exemplarLocation:'',
          intoWarehouse:'',
          remark:''
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "./../../css/public-table-css";
  /deep/.ant-input[disabled]{
    background: #fff;
  }
  /deep/.ant-modal-footer{
    width: 100%;
  }
  .search-frame{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .left-search-frame{
    width: 75%;
    display: flex;
    flex-wrap: wrap;
  }
  .right-button-frame{
    width: 30%;
  }
  .item-frame{
    width: 25%;
    margin-bottom: 12px;
  }
  .item-down{
    margin-top: 20px;
  }
  .stock-search-frame{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-left: 10px;
    /deep/ .ant-space-item{
      text-align: right;
      width: 80px;
    }
  }
  .item-frame2{
    width: 48%;
  }
  .text-frame{
    width: 100%;
    padding-right: 20px;
  }
  .submit-frame{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    align-items: center;
  }
</style>
