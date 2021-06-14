<template>
  <!--  查询tab1  试制流转单信息-->
    <div>
      <div class="title-text">
        <span>项目信息</span>
      </div>
      <a-layout class="top-layout">
        <a-layout-content>
          <table class="project-table" >
            <tr>
              <td class="td-bgc">戴卡部件号</td>
              <td>{{data.projectNo}}</td>
              <td class="td-bgc">表面状态</td>
              <td>{{data.project && data.project.surfaceState}}</td>
              <td class="td-bgc">试制批次</td>
              <td>{{data.project && data.project.trialProductionBatch}}</td>
              <td rowspan="3">
                <img style="width: 120px" :src="srccc" alt="">
              </td>
            </tr>
            <tr>
              <td class="td-bgc">首次试制时间</td>
              <td>{{data.project && data.project.firstTrialProductionTime | dayMoment}}</td>
              <td class="td-bgc">尺寸</td>
              <td>{{data.project && data.project.wheelDiameter + '*' + data.project.wheelWidth}}</td>
              <td class="td-bgc">项目阶段</td>
              <td>{{data.project && data.project.wheelDiameter + '*' + data.project.wheelWidth}}</td>
            </tr>
            <tr>
              <td class="td-bgc">项目阶段</td>
              <td>{{data.project && data.project.projectPhase}}</td>
              <td class="td-bgc">项目经理</td>
              <td colspan="3">{{data.project && data.project.projectManager}}</td>
            </tr>
          </table>

        </a-layout-content>

<!--        <a-layout-sider></a-layout-sider>-->
      </a-layout>
      <div class="title-text">
        <span>模具信息</span>
      </div>


      <table class="project-table" style="margin-top:16px;">
        <tr>
          <td class="td-bgc">戴卡部件号</td>
          <td>{{data.projectNo}}</td>
          <td class="td-bgc">模次号</td>
          <td>{{data.mouldSafeguardVO && data.mouldSafeguardVO.modelNumber}}</td>
          <td class="td-bgc">尺寸</td>
          <td>{{data.mouldSafeguardVO && data.mouldSafeguardVO.sizeWheelShape}}</td>
        </tr>
        <tr>
          <td class="td-bgc">模具类型</td>
          <td>{{data.mouldSafeguardVO && data.mouldSafeguardVO.modelType}}</td>
          <td class="td-bgc">使用单位</td>
          <td>{{data.mouldSafeguardVO && data.mouldSafeguardVO.factory}}</td>
          <td class="td-bgc">模具合格日期</td>
          <td>{{data.mouldSafeguardVO && data.mouldSafeguardVO.mouldQualifiedDate | dayMoment}}</td>
        </tr>
        <tr>
          <td class="td-bgc">制作项目</td>
          <td colspan="5">{{data.mouldSafeguardVO && data.mouldSafeguardVO.productionProject}}</td>
        </tr>
      </table>



      <div v-for="(item, index) in data.ordersList" :key="item.id">
        <div class="title-text">
          <span>订单信息{{index+1}}</span>
        </div>
        <table class="project-table" style="margin-top:16px;">
          <tr>
            <td class="td-bgc">戴卡订单号</td>
            <td>{{item.dkOrdersNumber}}</td>
            <td class="td-bgc">订单日期</td>
            <td>{{item.orderDate | dayMoment}}</td>
            <td class="td-bgc">客户订单号</td>
            <td>{{item.customerOrder}}</td>
          </tr>
          <tr>
            <td class="td-bgc">戴卡部件号</td>
            <td>{{data.projectNo}}</td>
            <td class="td-bgc">客户部件号</td>
            <td>{{item.customerComponentNumber}}</td>
            <td class="td-bgc">客户名称</td>
            <td colspan="3">{{item.customerName}}</td>
          </tr>
          <tr>
            <td class="td-bgc">订单数量</td>
            <td>{{item.orderNumber}}</td>
            <td class="td-bgc">要求发货日期</td>
            <td>{{item.deliveryDate | dayMoment}}</td>
          </tr>
        </table>
      </div>

      <div class="title-text">
        <span>试制信息</span>
      </div>
      <table class="project-table" style="margin-top:16px;">
        <tr>
          <td class="td-bgc">计划毛坯数</td>
          <td>{{data.planRoughcastNum}}</td>
          <td class="td-bgc">计划发样日期</td>
          <td>{{data.planSendSamplesDt | dayMoment}}</td>
          <td class="td-bgc">交付日期</td>
          <td>{{data.deliverDt | dayMoment}}</td>
        </tr>
        <tr>
          <td class="td-bgc">共摸信息</td>
          <td>{{data.sameMouldInfo}}</td>
          <td class="td-bgc">特殊说明</td>
          <td>{{data.remarks}}</td>
          <td class="td-bgc">轮型防措</td>
          <td colspan="3">{{data.wheeledPokaYoke}}</td>
        </tr>
      </table>
<!--      <a-row type="flex" align="middle" :gutter="[0,24]" style="margin: 20px 0">-->
<!--        <div style="width: 90px">用途：</div>-->
<!--        <a-table-->
<!--          ref="purposesTab"-->
<!--          size="middle"-->
<!--          bordered-->
<!--          :columns="purposesTabColumns"-->
<!--          :dataSource="data.purposes"-->
<!--          :pagination=false>-->
<!--        </a-table>-->
<!--      </a-row>-->
      <table class="bottom-table">
        <tr>
          <th colspan="2">用途</th>
        </tr>
        <tr>
          <th>用途</th>
          <th>数量</th>
        </tr>
        <tr v-for="purpoes in data.purposes">
          <td>{{purpoes.purpose}}</td>
          <td>{{purpoes.number}}</td>
        </tr>

      </table>
<!--      <a-row type="flex" align="middle" :gutter="[0,24]" style="margin: 20px 0">-->
<!--        <div style="width: 90px">工序选择：</div>-->
<!--        <a-table-->
<!--          ref="formWorksTab"-->
<!--          size="middle"-->
<!--          bordered-->
<!--          :columns="formWorksTabColumns"-->
<!--          :dataSource="data.formWorks"-->
<!--          :pagination=false>-->
<!--        </a-table>-->
<!--      </a-row>-->
      <table class="bottom-table">
        <tr>
          <th colspan="3">工序选择</th>
        </tr>
        <tr>
          <th>工艺流程</th>
          <th>负责人</th>
          <th>注意事项</th>
        </tr>
        <tr v-for="formWorks in data.formWorks">
          <td>{{formWorks.technologyName}}</td>
          <td>{{formWorks.managerName}}</td>
          <td>{{formWorks.remarks}}</td>
        </tr>
      </table>
    </div>
</template>

<script>

  import {
    getFormById,
    getDictItemsFromCache
  } from '@/api/api';
  import { GetImgByProjectNumMixin } from '@/mixins/GetImgByProjectNumMixin'
  export default {
    name: 'QuerySheetTab1',
    data() {
      return {
        selectId: 0, // 选中行的id
        trialProductionFormNo: null,
        dic: { // 表单中的部分数据对应的的数据词典
          trialStatus: [], // 试制状态
        },
        data: {},
        // 表格
        columns: [ // 表头
          // { title: '主键', dataIndex: 'id', width: 150, align: 'center', hidden:true },
          { title: '戴卡部件号', dataIndex: 'projectNo', width: 150, align: 'center' },
          { title: '戴卡订单号', dataIndex: 'orderNumber', width: 200, align: 'center' },
          { title: '试制单编号', dataIndex: 'trialProductionFormNo', width: 200, align: 'center' },
          { title: '客户名称', dataIndex: 'customerName', width: 150, align: 'center' },
          { title: '项目经理', dataIndex: 'projectManager', width: 150, align: 'center' },
          { title: '计划发样日期', dataIndex: 'planSendSamplesDt', width: 150, align: 'center' },
          { title: '试制批次', dataIndex: 'trialProductionBatch', width: 150, align: 'center' },
          { title: '计划毛坯数', dataIndex: 'planRoughcastNum', width: 150, align: 'center' },
          { title: '交付日期', dataIndex: 'deliverDt', width: 150, align: 'center' }
        ],
        dataSource: [], // 数据
        //用途表格
        purposesTabColumns: [
          { title: '用途', dataIndex: 'purpose', width: 150, align: 'center' },
          { title: '数量', dataIndex: 'number', width: 150, align: 'center' },
        ],
        //工序表格
        formWorksTabColumns: [
          { title: '工艺流程', dataIndex: 'technologyName', width: 150, align: 'center' },
          { title: '负责人', dataIndex: 'managerName', width: 150, align: 'center' },
          { title: '注意事项', dataIndex: 'remarks', width: 150, align: 'center' },
        ],
        srccc: null,
      };
    },
    mixins: [GetImgByProjectNumMixin],
    //初始化
    mounted() {
      this.getDic(); // 获取字典
      this.selectId = this.$route.query.id;
      this.trialProductionFormNo = this.$route.query.no;
      this.getFormById();
    },

    methods: {
      processInformation() {
        alert("此功能暂未开发");
      },

      processInstruction() {
        alert("此功能暂未开发");
      },

      getFormById() {
        let param = { id: this.selectId }
        getFormById(param).then((data) => {
          if (data.success) {
            // this.$message.success(data.message);
            this.data = data.result;
            this.getImg(this.data.projectNo);

            console.log(this.data)
          } else {
            this.$message.warning(data.message)
          }
        })
      },

      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          if (getDictItemsFromCache(searchName)) { // 从缓存中取dic
            this.dic[name] = getDictItemsFromCache(searchName);
          }
        }
      },

      humpOrLine(name, type) { // 驼峰式转下划线 toLine  下划线转驼峰式 toHump
        if (type === 'toLine') {
          return name.replace(/([A-Z])/g, '_$1').toLowerCase();
        } else if (type === 'toHump') {
          return name.replace(/\_(\w)/g, function(all, letter) {
            return letter.toUpperCase();
          });
        }
      },
    }
  };
</script>

<style scoped lang="less">
  @import "./../../css/public-table-css";

  .ant-input {
    width: 200px;
  }

  .button-group {
    display: flex;
    margin-right: 100px;

    button {
      margin-right: 20px;
    }
  }


  .top-group {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .top-title {
    font-size: 18px;
    font-weight: bold;
    /*margin-bottom: 10px;*/
  }

  .flex-center {
    display: flex;
    /*justify-content: center;*/
  }

  .part-title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    border-radius: 5px;
    background: #f2f2f2;
    padding-left: 10px;
    margin: 20px 0;
  }

  .top-layout .ant-layout-sider {
    /*background: white;*/
  }

  .top-layout .ant-layout-content {
    background: white;
    overflow-x: visible;
  }

  .search-frame {
    margin-bottom: 20px;
  }

  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }
  .project-table{
    border-left: 1px solid #e8e8e8;
    border-top: 1px solid #e8e8e8;
    width: 100%;
    margin-bottom:16px;
    .td-bgc{
      background-color: #F5F8FA;
    }
    td,th{
      padding: 16px;
      min-width: 100px;
      text-align: left;
      border-right: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
    }
  }
  .bottom-table{
    border-left: 1px solid #e8e8e8;
    border-top: 1px solid #e8e8e8;
    width: 100%;
    margin-bottom:16px;
    td,th{
      padding: 16px;
      min-width: 100px;
      text-align: center;
      border-right: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
    }
    th{
      background-color: #F5F8FA;
    }

  }

</style>
