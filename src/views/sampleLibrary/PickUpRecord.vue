<template>
  <div class="jn-public-table" style="overflow-x: auto">

  <a-card>
    <div class="search-frame" v-if="showPageination">
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
<!--        <div  class="item-frame">-->
<!--          <a-space align="center">-->
<!--            <span style="font-size: 14px ">待发仓库:</span>-->
<!--            <a-select  placeholder="请选择" v-model="searchParams.factoryWareHouse"  style="width: 174px; margin-left: 10px" >-->
<!--              <a-select-option v-for="data in option.factory_ware_house" :key="data.value">-->
<!--                {{ data.label }}-->
<!--              </a-select-option>-->
<!--            </a-select>-->
<!--          </a-space>-->
<!--        </div>-->
        <div class="item-frame">
          <a-button type="primary" style=";margin-right: 8px"  @click="getList2">查询</a-button>
          <a-button  @click="reSET"> 重置</a-button>
        </div>
      </div>
    </div>
    </a-card>
    <a-card style="min-width: 1600px;margin-top: 12px">
    <div class="table-frame">
      <h3>提货记录列表</h3>
      <a-table
        :dataSource="dataSource"
        :columns="columns"
        bordered
        :pagination = false
      >
      </a-table>
      <!--    分页-->
      <div class="bottom-page" v-if="showPageination">
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
  import {getMouldOptions, getPickById,getWarehouseSendRecord} from '@/api/api'
  export default {
    name: 'PickUpRecord',
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
          type:2
        },
        option:{
          factory_ware_house:[],//工厂仓库
          noun:[],//用途
        },
        dic:{
          noun:[],
        },
        waitingNumber:1,
        sureBadNumber:2,
        showPageination: true,
        waitingBadNumber:3,
        total: 0, // 共多少条
        pageSize: 5, // 一页多少条
        pageNum: 1, // 共多少页
        jumpPage: 1, // 跳转到第几页
        currentPage: 1, // 当前页
        dataSource: [
        ],//表格数据
        dic: { // 表单中的部分数据对应的的数据词典
          noun: [], // 维护状态
        },
        columns:[
          { title: '提货日期', dataIndex: 'createTime', key: 'createTime', align: 'center', },
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center', },
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center', },
          { title: '批次号', dataIndex: 'batch', key: 'batch', align: 'center', },
          { title: '发运流转单号', dataIndex: 'shippingFlowSheet', key: 'shippingFlowSheet', align: 'center', },
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'center', },
          // { title: '工厂仓库', dataIndex: 'factoryWareHouse', key: 'factoryWareHouse', align: 'center', },
          { title: '提货数量', dataIndex: 'updateSendNum', key: 'updateSendNum', align: 'center', },
          { title: '提货人', dataIndex: 'createBy', key: 'createBy', align: 'center', },
          { title: '备注信息', dataIndex: 'remark', key: 'remark', align: 'left', }]
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
          type:2
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
        if(localStorage.getItem('PickId')){
          const id = localStorage.getItem('PickId');
          this.showPageination = false;
          getPickById(id).then((data)=>{
            console.log('data' ,data);
            if (!data.result.length) {
              this.dataSource = [];
            }else {
              for (let i = 0; i < data.result.length; i++) { // 遍历返回的数据列表
                for (let name in data.result[i]) { // 列表每行 for 出每个属性
                  if (name in this.dic) { // 如果该属性在字典里
                    for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                      if (data.result[i][name] && Number(data.result[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                        data.result[i][name] = this.dic[name][j].label;
                      }
                    }
                  }
                }
              }
            }
            this.dataSource = data.result;
          })
        }else{
          this.showPageination = true;
          this.searchParams.pageSize = this.pageSize;
          this.searchParams.pageNO = this.currentPage;
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
            this.dataSource = data.records;
            this.pageSize = data.size;
            this.total = data.total;
            this.pageNum = data.pages;
          })
        }
      },
      getList2(){
        this.showPageination = true;
        this.searchParams.pageSize = this.pageSize;
        this.searchParams.pageNO = this.currentPage;
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
          this.dataSource = data.records;
          this.pageSize = data.size;
          this.total = data.total;
          this.pageNum = data.pages;
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
  }
  .item-frame{
    /*margin-right: 20px;*/
    width: 25%;
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


</style>
