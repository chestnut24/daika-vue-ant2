<template>
  <div style="overflow-x: auto"  class="jn-public-table" >
    <a-card style="min-width: 1600px;">
    <div class="search-frame">
<!--      <div class="left-search-frame">-->
        <div class="item-frame">
          <a-space align="center">
            <span style="font-size: 14px; margin-right: 5px">戴卡部件号:</span>
            <a-input v-model:value="searchParams.projectNo" placeholder="请输入戴卡部件号" />
          </a-space>
        </div>
        <div  class="item-frame">
          <a-space align="center">
            <span style="font-size: 14px;  ">用途:</span>
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
          <a-space align="center">
            <span style="font-size: 14px; margin-right: 5px ">工厂仓库:</span>
            <a-select  placeholder="请选择" v-model="searchParams.factoryWareHouse"  style="width: 244px;" >
              <a-select-option v-for="data in option.factory_ware_house" :key="data.value">
                {{ data.label }}
              </a-select-option>
            </a-select>
          </a-space>
        </div> <div  class="item-frame" v-if="isShowOtherButtons">
        <a-space align="center">
          <span style="font-size: 14px;" >库位:</span>
          <a-select  placeholder="请选择" v-model="searchParams.inventoryLocation"  style="width: 244px; margin-left: 5px" >
            <a-select-option v-for="data in option.inventory_location" :key="data.label">
              {{ data.label }}-{{data.description}}
            </a-select-option>
          </a-select>
        </a-space>
      </div>
        <div  class="item-frame" v-if="isShowOtherButtons">
          <a-space align="center">
            <span style="font-size: 14px ;margin-right: 5px">样件位置:</span>
            <a-input v-model:value="searchParams.exemplarLocation" placeholder="请输入样件位置" />
          </a-space>
        </div>
<!--      </div>-->
      <div class="item-frame">
        <a style="margin-right: 20px" @click="isShowOtherButtons = !isShowOtherButtons"> {{isShowOtherButtons?"收起":"展开"}} <a-icon :type="isShowOtherButtons?'up':'down'" /> </a>
        <a-button style="margin-right: 8px;" type="primary"  @click="getList"> 查询</a-button>
        <a-button @click="reSET" style="margin-right: 32px;"> 重置</a-button>
      </div>
    </div>
    </a-card>
    <a-card style="margin-top: 16px;min-width: 1600px">
    <div class="table-frame">
        <h3>入库记录列表</h3>
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          bordered
          :pagination = false
        >
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
  import {getMouldOptions, getWarehousingRecord} from '@/api/api'
  export default {
    name: 'WarehousingRecord',
    mounted() {
      this.getAppointOption();
      setTimeout(()=>{
        this.getList();
      },300)
      this.getDic();
    },
    data() {
      return{
        searchParams:{
          projectNo:'', //戴卡部件号
          purpose: undefined, // 用途
          projectManager: '',//项目经理
          exemplarLocation: '',//样件位置
          inventoryLocation: undefined,//库位
          factoryWareHouse:undefined,//工厂仓库
          pageNO:1,//当前页
          pageSize:5,//展示条数
        },
        option:{
          factory_ware_house:[],//工厂仓库
          noun:[],//用途
          inventory_location:[],//预入库位
        },
        dic:{
          noun:[],
        },
        dataSource:[],
        total: 0, // 共多少条
        pageSize: 5, // 一页多少条
        pageNum: 1, // 共多少页
        jumpPage: 1, // 跳转到第几页
        currentPage: 1, // 当前页
        columns: [
          { title: '入库时间', dataIndex: 'createTime', key: 'createTime', align: 'center', },
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center', },
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center', },
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
          { title: '入库批次号', dataIndex: 'batch', key: 'batch', align: 'center', width:300},
          { title: '是否外购', dataIndex: 'warehouseIntoStatus', key: 'warehouseIntoStatus', align: 'center', },
          { title: '工厂仓库', dataIndex: 'factoryWareHouse_dictText', key: 'factoryWareHouse_dictText', align: 'center', },
          { title: '库位', dataIndex: 'inventoryLocation', key: 'inventoryLocation', align: 'center', },
          { title: '样件位置', dataIndex: 'exemplarLocation', key: 'exemplarLocation', align: 'center', },
          { title: '入库数量', dataIndex: 'intoWarehouse', key: 'intoWarehouse', align: 'center', },
          { title: '备注', dataIndex: 'remark', key: 'remark', align: 'center', },
        ],
        isShowOtherButtons: false,
      }
    },
    methods: {
      reSET(){
        this.searchParams = {
          projectNo:'', //戴卡部件号
          purpose: undefined, // 用途
          projectManager: '',//项目经理
          exemplarLocation: '',//样件位置
          inventoryLocation: undefined,//库位
          factoryWareHouse:undefined,//工厂仓库
          pageNO:1,//当前页
          pageSize:5,//展示条数
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
      callback(key) {
        console.log(key);
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
        getWarehousingRecord(this.searchParams).then((data)=>{
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
            item.batch = item.batch.replace(/,/g,'\n');
          })
          this.dataSource = data.records;
          this.pageSize = data.size;
          this.total = data.total;
          this.pageNum = data.pages;
          this.dataSource.forEach((item,index) =>{
            if(item.warehouseIntoStatus){
              item.warehouseIntoStatus = '是'
            }else{
              item.warehouseIntoStatus = '否'
            }
          })
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
    flex-wrap: wrap;
  }
  .left-search-frame{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .right-button-frame{
    width: 20%;
  }
  .item-frame{
    width: 25%;
    margin-bottom: 12px;
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
  .jn-public-table{
      /deep/ tr{
          td,th{
              text-align: left !important;
          }
      }
  }

</style>
