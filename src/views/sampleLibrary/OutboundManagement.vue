<template>
  <div class="jn-public-table" style="overflow-x: auto">
    <a-card style="min-width: 1600px">
      <div class="search-frame">
        <div class="left-search-frame">
          <div class="item-frame">
            <a-space align="center">
              <span style="font-size: 14px; margin-right: 5px">戴卡部件号:</span>
              <a-input v-model:value="searchParams.projectNo" placeholder="请输入戴卡部件号" />
            </a-space>
          </div>
          <div  class="item-frame">
            <a-space align="center">
              <span style="font-size: 14px;  ">用途:</span>
              <a-select  placeholder="请选择" v-model="purposeRoute"  style="width: 244px; margin-left: 5px" >
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
<!--          <div  class="item-frame item-down" v-if="isShowOtherButtons">-->
<!--            <a-space align="center">-->
<!--              <span style="font-size: 14px ;margin-right: 8px">样件位置:&nbsp;&nbsp;&nbsp;</span>-->
<!--              <a-input v-model:value="searchParams.exemplarLocation" placeholder="请输入样件位置" />-->
<!--            </a-space>-->
<!--          </div>-->
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
            <!--          <a-space align="center">-->
            <!--            <span style="font-size: 14px;" >库位:</span>-->
            <!--            <a-select  placeholder="请选择" v-model="searchParams.inventoryLocation"  style="width: 174px; margin-left: 10px" >-->
            <!--              <a-select-option v-for="data in option.inventory_location" :key="data.label">-->
            <!--                {{ data.label }}-->
            <!--              </a-select-option>-->
            <!--            </a-select>-->
            <!--          </a-space>-->
          </div>
        </div>
        <div class="right-button-frame">
<!--          <a style="margin-right: 20px" @click="isShowOtherButtons = !isShowOtherButtons"> {{isShowOtherButtons?"收起":"展开"}} <a-icon :type="isShowOtherButtons?'up':'down'" /> </a>-->
          <a-button style="margin-right: 8px;" type="primary" @click="searchByType"> 查询</a-button>
          <a-button @click="reSET" style="margin-right: 8px;"> 重置</a-button>

        </div>
      </div>
    </a-card>
    <a-card style="margin-top: 16px;min-width: 1600px">
      <div class="table-frame">
        <a-tabs @change="callback">
          <a-button slot="tabBarExtraContent" style="margin-right: 8px" @click="goRecord"> 出库记录</a-button>

          <a-tab-pane key="1" tab="发运任务">
            <a-table
                    :dataSource="dataSource"
                    :columns="columns"
                    bordered
                    :pagination = false
            >
              <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
                <a-button type="link" @click="outboundExtra(operate, i)">出库</a-button>
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
          </a-tab-pane>
          <a-tab-pane key="2" tab=" 转轮任务">
            <a-table
                    :dataSource="dataSource2"
                    :columns="columns2"
                    bordered
                    :pagination = false
            >
              <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
                <a-button type="link" @click="outboundExtra(operate, i)">出库</a-button>
                <a-button type="link" @click="wheelComplete(operate, i)">转轮完成</a-button>
              </a-space>
            </a-table>
            <!--    分页-->
            <div class="bottom-page">
              <a-pagination
                      :total=total2
                      :show-total="total => `共 ${total2} 条`"
                      :page-size=pageSize2
                      :current="currentPage2"
                      @change="pageChange2"
              />
              <div style="margin: 0 20px">共 {{pageNum2}} 页</div>
              <div style="margin: 0 10px 0 0">到第</div>
              <a-input-number style="width: 50px" @keyup.enter.native="pageJump2(jumpPage2)" v-model="jumpPage2"></a-input-number>
              <div style="margin: 0 20px 0 10px">页</div>
              <a-button type="primary" @click="pageJump2(jumpPage2)">跳转</a-button>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <a-modal v-model:visible="sureComplete" title="确认完成">
        <span>是否决定转轮完成？</span>
        <template #footer>
          <a-button key="submit" type="primary"  @click="handleOk">确定</a-button>
          <a-button key="back" @click="sureComplete = false">取消</a-button>
        </template>
      </a-modal>
      <out-bound-modal
              :modalTitle = "outBoundTitle"
              :modalVisible="outBoundVisible"
              :queryId = "queryId"
              @OutClose="OutClose"
              ref="outBoundModal">

      </out-bound-modal>
    </a-card>

  </div>
</template>

<script>
  import SampleModal from './SampleModal'
  import {getMouldOptions,getWarehouseOut,confirmComplete,getDictItemsFromCache} from '@/api/api'
  import OutBoundModal from './OutBoundModal'
  export default {
    name: 'OutboundManagement',
    components: { SampleModal,OutBoundModal },
    // beforeRouteEnter (to, from, next) {
    //   // 注意，在路由进入之前，组件实例还未渲染，所以无法获取this实例，只能通过vm来访问组件实例
    //   console.log('from.name', from.name);
    //   if(from.name=='sampleLibrary-SampleLibraryManagement'){
    //     next(vm => {
    //
    //     })
    //   }else{
    //     next();
    //   }
    // },
    mounted() {
      this.getAppointOption();
      this.getDic();
      if(Object.keys(this.$route.query).length!=0) {
        this.searchParams.projectNo = this.$route.query.projectNo;
        setTimeout(()=>{
          this.dic.purpose.forEach((item,index)=>{
            console.log('--------->',item.text == this.$route.query.purpose);
            if(item.text == this.$route.query.purpose){
              this.purposeRoute = this.$route.query.purpose;
              console.log('item.value', Number(item.value));
              this.searchParams.purpose = Number(item.value);
            }
          })
        },300)
      }
      setTimeout(()=>{
        this.getList();
      },300);
      setTimeout(()=>{
        this.getList2();
      },600)
    },
    data() {
      return{
        purposeRoute: undefined,//路由用途
        searchParams:{
          projectNo:'', //戴卡部件号
          purpose: undefined, // 用途
          projectManager: '',//项目经理
          pageSize:5, //展示条数
          pageNO:1,//当前页
          inventoryLocation:undefined,//库位
          factoryWareHouse:undefined,//工厂仓库
          exemplarLocation:'',//样件位置
        },
        option:{
          factory_ware_house:[],//工厂仓库
          noun:[],//用途
          inventory_location:[],//预入库位
        },
        outBoundVisible: false, // 显示出库单
        outBoundTitle:'',//出库单标题
        queryId:'',//出库单查询id
        total: 0, // 共多少条
        pageSize: 5, // 一页多少条
        pageNum: 1, // 共多少页
        jumpPage: 1, // 跳转到第几页
        currentPage: 1, // 当前页
        total2: 0, // tab2共多少条
        pageSize2: 5, // tab2一页多少条
        pageNum2: 1, // tab2共多少页
        jumpPage2: 1, // tab2跳转到第几页
        currentPage2: 1, // tab2当前页
        sureComplete:false, //转轮完成
        completeId:'', //转轮完成id
        dataSource:[],
        dataSource2:[],
        dic: { // 表单中的部分数据对应的的数据词典
          noun:[],
        },
        selectTab:1,//选中的tab页
        columns: [
          { title: '发运流转单号', dataIndex: 'shippingFlowSheet', key: 'shippingFlowSheet', align: 'center', },
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center', },
          { title: '入库批次号', dataIndex: 'batch', key: 'batch', align: 'center', width:300 },
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center', },
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
          { title: '包装中', dataIndex: 'packNum', key: 'packNum', align: 'center', },
          { title: '发样数量', dataIndex: 'sendSample', key: 'sendSample', align: 'center', },
          { title: '已出库数量', dataIndex: 'outWarehouse', key: 'outWarehouse', align: 'center', },
          { title: '操作', dataIndex: 'operate', key: 'operate', align: 'center', scopedSlots: { customRender: 'operate' }, },],
        columns2: [
          { title: '发运流转单号', dataIndex: 'shippingFlowSheet', key: 'shippingFlowSheet', align: 'center', },
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center', },
          { title: '入库批次号', dataIndex: 'batch', key: 'batch', align: 'center', width:300},
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center', },
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
          // { title: '库位', dataIndex: 'inventoryLocation', key: 'inventoryLocation', align: 'center', },
          // { title: '样件位置', dataIndex: 'component8', key: 'component8', align: 'center', },
          // { title: '待查库存', dataIndex: 'stock', key: 'stock', align: 'center', },
          { title: '包装中', dataIndex: 'packNum', key: 'packNum', align: 'center', },
          { title: '发样数量', dataIndex: 'sendSample', key: 'sendSample', align: 'center', },
          { title: '已出库数量', dataIndex: 'outWarehouse', key: 'outWarehouse', align: 'center', },
          { title: '操作', dataIndex: 'operate', key: 'operate', align: 'center', scopedSlots: { customRender: 'operate' }, },],
        isShowOtherButtons: false,
      }
    },
    methods: {
      reSET(){
        this.searchParams = {
          projectNo:'', //戴卡部件号
          purpose: undefined, // 用途
          projectManager: '',//项目经理
          pageSize:5, //展示条数
          pageNO:1,//当前页
          inventoryLocation:undefined,//库位
           factoryWareHouse:undefined,//工厂仓库
          exemplarLocation:'',//样件位置
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
      pageChange2(val) { // 分页改变
        this.currentPage2 = val;
        this.getList2();
      },
      pageJump2(page) { // 点击指定分页跳转的情况下
        if (page > this.pageNum2) {
          page = this.pageNum2;
          this.jumpPage2 = this.pageNum2;
        } else if (page < 1) {
          page = 1;
          this.jumpPage2 = 1;
        }
        this.currentPage2 = page;
        this.getList2();
      },
      callback(key) {
        this.selectTab = key;
      },
      goRecord(){
        this.$router.push({
          path: `/sampleLibrary/OutboundRecord`,
        })
      },
      wheelComplete(operate, i){
        this.sureComplete = true;
        this.completeId = operate.id
      },
      handleOk(){
        confirmComplete(this.completeId).then((data)=>{
          if(data.message == '操作成功！'){
            this.sureComplete = false;
            this.getList2();
            this.$message.success('转轮完成成功');
          } else {
            this.$message.warning('转轮完成失败');
          }
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
      getList(){
        this.searchParams.pageSize = this.pageSize;
        this.searchParams.pageNO = this.currentPage;
        this.searchParams.judgeReel = false;
        if(!isNaN(this.purposeRoute)){
          this.searchParams.purpose = this.purposeRoute;
        }
        getWarehouseOut(this.searchParams).then((data)=>{
          data = data.result;
          if (!data.records.length) {
            this.dataSource = [];
          }else {
            for (let i = 0; i < data.records.length; i++) { // 遍历返回的数据列表
              for (let name in data.records[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.records[i][name] && Number(data.records[i][name]) == this.dic[name][j].value) { // 找到value相等时对应的label
                      console.log('name', this.dic[name][j].text);
                      data.records[i][name] = this.dic[name][j].text;
                    }
                  }
                }
              }
            }
          }
          data.records.forEach((item)=>{
            item.batch = item.batch.replace(/,/g,'\n');
          })
          this.dataSource = data.records;
          this.total = data.total;
          this.pageNum = data.pages;
        })
      },
      getList2(){
        this.searchParams.pageSize = this.pageSize2;
        this.searchParams.pageNO = this.currentPage2;
        this.searchParams.judgeReel = true;
        if(!isNaN(this.purposeRoute)){
          this.searchParams.purpose = this.purposeRoute;
        }
        getWarehouseOut(this.searchParams).then((data)=>{
          data = data.result;
          if (!data.records.length) {
            this.dataSource2 = [];
          }else {
            for (let i = 0; i < data.records.length; i++) { // 遍历返回的数据列表
              for (let name in data.records[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.records[i][name] && Number(data.records[i][name]) == this.dic[name][j].value) { // 找到value相等时对应的label
                      data.records[i][name] = this.dic[name][j].text;
                    }
                  }
                }
              }
            }
          }
          data.records.forEach((item)=>{
            item.batch = item.batch.replace(/,/g,'\n');
          })
          this.dataSource2 = data.records;
          this.pageSize2 = data.size;
          this.total2 = data.total;
          this.pageNum2 = data.pages;
        })
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
      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          if (getDictItemsFromCache(searchName)) { // 从缓存中取dic
            this.dic[name] = getDictItemsFromCache(searchName);
            console.log('this.dic.first',this.dic);
            this.dic.purpose = this.dic.noun;
            delete this.dic.noun;
            console.log('this.dic',this.dic);
          }
        }
      },
      outboundExtra(operate, i){
        this.$refs.outBoundModal.dataSourceRight = [];
        this.outBoundVisible = true;
        this.outBoundTitle = '出库单';
        this.queryId = operate.id;
      },
      searchByType(){
        if(this.selectTab == 1){
          this.getList();
        }else{
          this.getList2();
        }
      },
      OutClose(){
        this.outBoundVisible = false;
        if(this.selectTab == 1){
          this.getList();
        }else{
          this.getList2();
        }
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
