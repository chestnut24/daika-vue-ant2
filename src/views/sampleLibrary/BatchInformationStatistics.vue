<template>
  <div style="overflow-x: auto">
    <a-card  class="jn-public-table" style="min-width: 1600px;">
    <div class="top-frame">
      <div class="search-frame">
        <a-row class="row">
          <a-col :span="6">
<!--            <a-space align="center">-->
              <span style="font-size: 14px;margin-right: 13px ">戴卡部件号:</span>
              <a-input v-model:value="searchParams.projectNo" placeholder="请输入戴卡部件号" style="width: 244px"/>
<!--            </a-space>-->
          </a-col>
          <a-col :span="6">
<!--            <a-space align="center">-->
              <span style="font-size: 14px;margin-right: 13px">是否外购:</span>
              <a-select  placeholder="请选择" v-model="searchParams.warehouseIntoStatus"  style="width: 244px;" >
                <a-select-option v-for="data in option.warehouse_into_status" :key="data.value">
                  {{ data.label }}
                </a-select-option>
              </a-select>
<!--            </a-space>-->
          </a-col>
          <a-col :span="6">
<!--            <a-space align="center">-->
              <span style="font-size: 14px ;margin-right: 13px">用途:</span>
              <a-select  placeholder="请选择" v-model="modelPurpose"  style="width: 244px;" @change="purposeChange">
                <a-select-option v-for="data in option.noun" :key="data.value">
                  {{ data.label }}
                </a-select-option>
              </a-select>
<!--            </a-space>-->
          </a-col>
<!--        </a-row>-->
<!--        <a-row class="row-down">-->

           <a-col :span="6" v-if="isShowOtherButtons">
<!--            <a-space align="center">-->
              <span style="font-size: 14px ;margin-right: 13px">项目经理:</span>
              <a-input v-model:value="searchParams.projectManager" placeholder="请输入项目经理" />
<!--            </a-space>-->
          </a-col>

          <a-col :span="6"  v-if="isShowOtherButtons" style="margin-top: 10px">
<!--            <a-space align="center">-->
              <span style="font-size: 14px;margin-right: 13px ">日期筛选:</span>
              <a-range-picker
                v-model:value="datePicker"
                :show-time="{ format: 'HH:mm' }"
                format="YYYY-MM-DD HH:mm:ss"
                :placeholder="['开始日期', '结束日期']"
                @change="OnChange"
                @ok="OnOk"
                style="width: 244px"
              />
<!--            </a-space>-->
          </a-col>
            <a-col :span="6" :style="{marginTop: isShowOtherButtons ? '10px':'0'}">
<!--                <div class="button-frame">-->
                    <a style="margin-right: 20px" @click="isShowOtherButtons = !isShowOtherButtons"> {{isShowOtherButtons?"收起":"展开"}} <a-icon :type="isShowOtherButtons?'up':'down'" /> </a>
                    <a-button style="margin-right: 8px" type="primary" @click="getList">查询</a-button>
                    <a-button @click="reSET" style="margin-right: 8px;"> 重置</a-button>
<!--                </div>-->
            </a-col>
<!--          <a-col :span="8"  v-if="isShowOtherButtons">-->
<!--            <a-space align="center">-->
<!--              <span style="font-size: 14px ">工厂仓库:</span>-->
<!--              <a-select  placeholder="请选择" v-model="searchParams.factoryWareHouse"  style="width: 244px;" >-->
<!--                <a-select-option v-for="data in option.factory_ware_house" :key="data.value">-->
<!--                  {{ data.label }}-->
<!--                </a-select-option>-->
<!--              </a-select>-->
<!--            </a-space>-->
<!--          </a-col>-->
        </a-row>
<!--        <a-row class="row-down">-->
<!--          <a-col :span="8"  v-if="isShowOtherButtons">-->
<!--            <a-space align="center">-->
<!--              <span style="font-size: 14px ">库位:</span>-->
<!--              <a-select  placeholder="请选择" v-model="searchParams.inventoryLocation"  style="width: 244px;" >-->
<!--                <a-select-option v-for="data in option.inventory_location" :key="data.label">-->
<!--                  {{ data.label }}-->
<!--                </a-select-option>-->
<!--              </a-select>-->
<!--            </a-space>-->
<!--          </a-col>-->
<!--          <a-col :span="8"  v-if="isShowOtherButtons">-->
<!--            <a-space align="center">-->
<!--              <span style="font-size: 14px ">样件位置:</span>-->
<!--              <a-input v-model:value="searchParams.exemplarLocation" placeholder="请输入样件位置" />-->
<!--            </a-space>-->
<!--          </a-col>-->
<!--        </a-row>-->
      </div>

    </div>
    </a-card>
    <a-card style="margin-top: 10px;min-width: 1600px">
    <div class="table-frame">
        <div style="display: flex;justify-content: space-between">
            <h3 style="font-size: 18px;margin-bottom: 20px">批次信息统计表</h3>
            <a-button style="margin-right: 8px">导出</a-button>
        </div>
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
  import {getMouldOptions,getBatchStaticList,getDictItemsFromCache} from '@/api/api'
  export default {
    name: 'BatchInformationStatistics',
    mounted() {
      this.getAppointOption();
      this.getDic();
        if(this.$route.query.projectNo){
        this.searchParams.projectNo = this.$route.query.projectNo;
        this.dic.purpose.forEach((item)=>{
          if(item.text == this.$route.query.purpose){
            this.searchParams.purpose = item.value;
            this.modelPurpose = this.$route.query.purpose;
            console.log('nan', isNaN(this.modelPurpose),this.modelPurpose )
            // this.searchParams.purpose = this.$route.query.purpose;
          }
        })
      }
      this.getList();

    },
    data(){
      const OnChange = (value, dateString) => { // 交付日期数据改变函数
        console.log('Selected Time: ', value);
        // const startTimestamp = new Date(dateString[0]).getTime();
        // const endTimestamp = new Date(dateString[1]).getTime()
        this.datePicker = dateString;
        console.log('Formatted Selected Time: ', this.datePicker[0], this.datePicker[1]);
      };
      const OnOk = (value) => { // 交付日期确认函数
        console.log('onOk: ', value);
      };
      return{
        modelPurpose: undefined,
        searchParams: {
          createTimeEn:'',
          createTimeSt:'',
          exemplarLocation:'',
          factoryWareHouse:undefined,
          inventoryLocation:undefined,
          projectNo: '',
          purpose: undefined,
          projectManager: '',
          pageNO:1,
          pageSize:10,
          warehouseIntoStatus:undefined,
        },
        option:{
          factory_ware_house:[],//工厂仓库
          noun:[],//用途
          inventory_location:[],//预入库位
          warehouse_into_status:[],//是否外购
        },
        dic:{ // 表单中的部分数据对应的的数据词典
          noun: [], // 维护状态
        },
        datePicker:['', ''],// 日期筛选
        OnChange, //交付日期改变
        OnOk, //交付日期确认
        total: 0, // 共多少条
        pageSize: 10, // 一页多少条
        pageNum: 1, // 共多少页
        jumpPage: 1, // 跳转到第几页
        currentPage: 1, // 当前页
        dataSource: [
          {
            component:'',
          }
        ],//表格数据
        columns:[
          { title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'left', },
          { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'left', },
          { title: '项目经理', dataIndex: 'projectManager', key: 'projectManager', align: 'left', },
          { title: '入库批次号', dataIndex: 'batch', key: 'batch', align: 'left', },
          { title: '入库时间', dataIndex: 'createTime', key: 'createTime', align: 'left', },
          { title: '是否外购', dataIndex: 'warehouseIntoStatus', key: 'warehouseIntoStatus', align: 'left', },
          // { title: '工厂仓库', dataIndex: 'factoryWareHouse_dictText', key: 'factoryWareHouse_dictText', align: 'center', },
          // { title: '库位', dataIndex: 'inventoryLocation', key: 'inventoryLocation', align: 'center', },
          // { title: '样件位置', dataIndex: 'exemplarLocation', key: 'exemplarLocation', align: 'center', },
          { title: '总库存', dataIndex: 'stockSum', key: 'stockSum', align: 'left', },
          { title: '回库数量', dataIndex: 'returnNum', key: 'returnNum', align: 'left', },
          { title: '轮次数量', dataIndex: 'wheelNum', key: 'wheelNum', align: 'left', },
          { title: '待查库存', dataIndex: 'stock', key: 'stock', align: 'left', },
          { title: '包装中', dataIndex: 'packNum', key: 'packNum', align: 'left', },
          { title: '总报废库存', dataIndex: 'scrapNum', key: 'scrapNum', align: 'left', },
          { title: '包装确认报废', dataIndex: 'packScrapNum', key: 'packScrapNum', align: 'left', },
          { title: '无发货任务报废', dataIndex: 'normalScrapNum', key: 'normalScrapNum', align: 'left', }],
        isShowOtherButtons: false,
      }
    },
    methods:{
      purposeChange(){
        console.log('purpose', this.modelPurpose);
      },
      reSET(){
        this.searchParams = {
          createTimeEn:'',
          createTimeSt:'',
          exemplarLocation:'',
          factoryWareHouse:undefined,
          inventoryLocation:undefined,
          projectNo: '',
          purpose: undefined,
          projectManager: '',
          pageNO:1,
          pageSize:10,
          warehouseIntoStatus:undefined,
        };
        this.modelPurpose = null;
        this.datePicker = [];
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
      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          if(getDictItemsFromCache(searchName, '')){
            this.dic[name] = getDictItemsFromCache(searchName);
            if (name === 'noun') {
              this.dic.purpose = this.dic.noun;
            }
          }
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
        this.searchParams.createTimeSt = this.datePicker[0];
        this.searchParams.createTimeEn = this.datePicker[1];
        if(!isNaN(this.modelPurpose)){
          this.searchParams.purpose = this.modelPurpose;
        }
        getBatchStaticList(this.searchParams).then((data)=>{
          data = data.result;
          if (!data.records.length) {
            this.dataSource = [];
          }else {
            for (let i = 0; i < data.records.length; i++) { // 遍历返回的数据列表
              for (let name in data.records[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.records[i][name] && Number(data.records[i][name]) == this.dic[name][j].value) { // 找到value相等时对应的label
                      console.log(' 2355',name, this.dic[name][j].text);
                      data.records[i][name] = this.dic[name][j].text;
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
          this.dataSource.forEach((item, index)=>{
            if(item.warehouseIntoStatus){
              this.dataSource[index].warehouseIntoStatus = '是';
            }else {
              this.dataSource[index].warehouseIntoStatus = '否';
            }
          })

        })

      }

    }
  }
</script>

<style scoped lang="less">
  @import "./../../css/public-table-css";
  .top-frame{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .search-frame{
    width: 100%;
  }
  .row-down{
    margin-top: 20px;
  }
  .button-frame{
    /*display: flex;*/
    /*flex-direction: column;*/
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
  /deep/ .ant-space-item{
    width: 100px;
  }
  /deep/ .ant-table-body{
    td,th{
      font-size: 14px!important;
    }
  }




</style>
