<template>
  <a-modal :visible="visible" title="选择工艺维护负责人" width="900px" @cancel="handleCancel" class="jn-public-table">
    <div class="search-frame">
      <a-row>
        <a-space align="center">
          <div class="left-text">
            <span style="font-size: 15px;"><b>工艺维护负责人检索</b></span>
          </div>
          <!--          <a-input v-model="projectParams.projectNumber" placeholder="请输入戴卡部件号"  style="margin-left: 20px;"/>-->
          <a-input v-model="managerParams.realName" placeholder="请输入维护负责人"  style="margin-left: 20px;border-width: 1px;"/>
          <a-button style="margin-left: 50px;" @click="search()">搜索</a-button>
        </a-space >
      </a-row>
    </div>
    <a-card class="search-table" >
      <div style="margin-bottom: 20px;padding:5px;background-color: #F2F3F6;" v-if="!(dataSource.length == 0)">
        <span class="search-hidden-text" style="font-size: 15px;"><b>工艺维护负责人信息</b></span>
      </div>
      <div class="mould-frame-down" v-if="!(dataSource.length == 0)">
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          bordered
          :pagination = false
          :customRow="rowClick"
        >
          <!--        <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">-->
          <!--          <a-button type="link" @click="check(operate, i)">查看</a-button>-->
          <!--        </a-space>-->
        </a-table>
        <!--    分页-->
        <div class="bottom-page">
          <a-pagination
            class="alerm"
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
    <template #footer>
      <a-button key="back" @click="handleCancel()">取消</a-button>
      <a-button key="submit" type="primary"   v-on:click="$emit('get-text', selectManager)" @click="handleOk">选择</a-button>
    </template>
  </a-modal>
</template>

<script>
  import {getManager } from '@/api/api'
  export default {
    name: 'selectTrialManager',
    mounted() {
      this.search();

    },
    data() {
      return{
        selectedRow: '', // 选择的行信息 由 戴卡部件号+模号+制作项目+模具制作类型 确定
        visible: false,
        highLight: '', //高亮
        projectParams: {
          projectNumber: '', // 检索的部件号
          size: '',
          modelNumber: '',
          productionProject: '',
          productionType: ''
        },
        dataSource: [],// 检索数组
        total: 0, // 共多少条
        pageSize: 10, // 一页多少条
        currentPage: 1, // 当前页
        pageNum: 1, // 共多少页
        jumpPage: 1, // 跳转到第几页
        columns: [
          {
            title: '用户姓名',
            dataIndex: 'realname',
            key: 'realname',
            align: 'center',
            width:400,
          },
          {
            title: '职务',
            dataIndex: 'post',
            key: 'post',
            align: 'center',
            width:400,
          },
          // {
          //   title: '外观图',
          //   dataIndex: 'operate',
          //   key: 'operate',
          //   align: 'center',
          //   scopedSlots: { customRender: 'operate' },
          // },
        ],

        selectManager: {},
        projectNumber: '',
        managerParams:{
          realName:'',
          pageNo:1,
          pageSize:10,
        },

      }
    },
    methods: {
      getManagerList(){
        if(this.managerParams.realName != ''){
          this.managerParams.pageNo = 1;
        }
        getManager(this.managerParams).then((data)=>{
          console.log(data.result.records);
          this.dataSource = data.result.records;
          this.total = data.result.total;
          this.pageNum = data.result.pages;
        })
      },
      rowClick(record) {
        // 事件
        return {
          on: {
            click: () => {
              console.log('record', record);
              this.selectedRow = record
              // this.projectParams.projectNumber = record.projectNumber;
              // this.projectParams.size = record.size;
              // this.projectParams.modelNumber = record.modelNumber;
              // this.projectParams.productionProject = record.productionProject;
              // this.projectParams.productionType = record.productionType;

              // this.projectNumber = record.projectNumber;
              this.selectManager = record;
            }
          },
          style: {
            'background-color': record === this.selectManager ? '#e6f7ff' : 'white'
          },
        }
      },

      add() {
        this.visible = true;
        console.log('2333333');
        // getProject({
        //   projectNumber: '',
        //   pageNo: 1,
        //   pageSize: 10
        // }).then((data) => {
        //   console.log('2333', data);
        //   this.total = data.result.total;
        //   this.currentPage = data.result.current;
        //   this.pageSize = data.result.size;
        //   this.pageNum = data.result.pages;
        // data.result.records.forEach((item , index) => {
        //   console.log('item', item);
        //   console.log('datasource', this.dataSource);
        //   this.dataSource.push({
        //     projectNumber: item.projectNumber,
        //     size: item.size,
        //     customerName: item.customerName,
        //     projectManager: item.projectManager,
        //     vehiclePlatform: item.vehiclePlatform,
        //     modelNumber: item.modelNumber,
        //     productionProject: item.productionProject,
        //     productionType: item.productionType
        //
        //   })
        // })

        // })
      },
      handleOk() {
        this.dataSource = [];
        this.visible = false;
        this.managerParams.realName = '';
        this.selectManager = {};
      },
      handleCancel() {
        this.visible = false;
        this.dataSource = [];
        this.managerParams.realName = '';
        this.selectManager = {};
      },
      tableChange(val) {
        console.log(val);
      },
      pageChange(val) { // 分页改变
        // console.log(val);
        this.managerParams.pageNo = val;
        this.currentPage = val;
        this.getManagerList();

      },
      pageJump(page) { // 点击指定分页跳转的情况下
        // if (page > this.pageNum || page < 1) {
        //   this.$message.destroy();
        //   this.$message.warning('超出页码范围！');
        // } else {
        if (page > this.pageNum) {
          page = this.pageNum;
          this.jumpPage = this.pageNum;
        } else if (page < 1) {
          page = 1;
          this.jumpPage = 1;
        }
        this.currentPage = page;
        this.managerParams.pageNo = page;
        this.getManagerList();
        // }
      },
      search() {
        this.dataSource = [];
        this.getManagerList();
      },
      check(operate, i) {
        this.$message.warning('查看功能待开发！');
      }
    }
  }
</script>

<style scoped lang="less">
  @import "./../../css/public-table-css";
  /deep/ .ant-modal-title {
    font-weight: bold;
  }
  .search-frame{
    margin-bottom: 20px;
  }
  .left-text{
    width: 150px;
  }
  .search-table{
    min-height: 300px;
  }
  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }
  // 被选中的表格行的样式
  .clickRowStyl{
    background-color: #00b4ed
  }
  .ant-table-tbody>.clickRowStyl:hover>td{
    background-color: #00b4ed
  }
  .alerm .rowcolor{
    color: #00b4ed;
  }
  .alerm .rowcolor2{
    background: blue;
  }
  .search-hidden-text{
    padding-left: 20px;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      left: 10px;
      height: 20px;
      width: 4px;
      background-color:  #1790FA;
      border-radius: 2px;
    }
  }
  /deep/ .ant-card-body{
    padding: 10px !important;
  }

</style>
