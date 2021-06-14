<template>

  <div>
<!--    <a-button type="primary" @click="getData(32)">-->
<!--      点击-->
<!--    </a-button>-->
    <a-modal :visible="projectVisible" title="发运通知单预览" width="800px" @cancel="handleCancel" @ok="handleCancel">
      <div class="table-container">
        <div class="top-container">
          <div class="left-table">
            <a-row type="flex" align="middle" v-for="(row, rowIndex1) of tableNameTop" :key="row['订单号']">
              <template v-for="(item1, value, itemIndex) of row">
                <a-col :md="5" :sm="2" class="flex-center title-background">
                  <div>{{ value }}</div>
                </a-col>
                <a-col :md="7" :sm="6" class="flex-center">
                  <div>{{ tableData[item1.split('.')[0]]&&tableData[item1.split('.')[0]][item1.split('.')[1]]?tableData[item1.split('.')[0]][item1.split('.')[1]]: '' }}</div>
                </a-col>
              </template>
            </a-row>
          </div>
          <div class="right-img">
            <img class="td_img" src="" />
          </div>
        </div>

        <div v-for="(SendSampleDemandVoListRow) of tableData.shipmentSendSampleDemandVoList">
          <a-row type="flex" align="middle" v-for="(row, rowIndex2) of tableNameTop1" :key="row['包装运输方式']">
            <template v-for="(item2, value, itemIndex) of row">
              <a-col :md="8" :sm="6" class="flex-center title-background">
                <div>{{ value }}</div>
              </a-col>
            </template>
          </a-row>
          <a-row type="flex" align="middle" v-for="(row, rowIndex3) of tableNameTop1" :key="row['发样数量']">
            <template v-for="(item3, value, itemIndex) of row">
              <a-col :md="8" :sm="6" class="flex-center">
                <div>{{SendSampleDemandVoListRow[item3]?SendSampleDemandVoListRow[item3]:''}}</div>
              </a-col>
            </template>
          </a-row>
        </div>
        <template v-if="tableData">
          <a-row type="flex" align="middle" >
              <a-col :md="9" :sm="6" class="flex-center title-background">
                <div>过程性能</div>
              </a-col>
              <a-col :md="15" :sm="9" class="flex-center">
                <div>
                  <a-radio-group v-model="processPerformance" disabled @change="onChange">
                    <a-radio value="0">
                      合格
                    </a-radio>
                    <a-radio value="1">
                      不合格
                    </a-radio>
                  </a-radio-group>
                </div>
              </a-col>
          </a-row>
        </template>
        <template v-if="tableData">
          <a-row type="flex" align="middle" >
            <a-col :md="9" :sm="6" class="flex-center title-background">
              <div>X光过程状态</div>
            </a-col>
            <a-col :md="15" :sm="9" class="flex-center">
              <div>
                <a-radio-group v-model="xprocessState" disabled @change="onChange">
                  <a-radio value="0">
                    合格
                  </a-radio>
                  <a-radio value="1">
                    不合格
                  </a-radio>
                </a-radio-group>
              </div>
            </a-col>
          </a-row>
        </template>
        <template v-if="tableData">
          <a-row type="flex" align="middle" >
            <a-col :md="9" :sm="6" class="flex-center title-background">
              <div>喷涂过程是否异常</div>
            </a-col>
            <a-col :md="15" :sm="9" class="flex-center">
              <div>
                <a-radio-group v-model="sprayProcess" disabled @change="onChange">
                  <a-radio value="0">
                    合格
                  </a-radio>
                  <a-radio value="1">
                    不合格
                  </a-radio>
                </a-radio-group>
              </div>
            </a-col>
          </a-row>
        </template>


<!--        <template v-if="tableData">-->
<!--          <a-row type="flex" align="middle" v-for="(row, rowIndex6) of tableNameTop2" :key="row['过程性能']">-->
<!--            <template v-for="(item4, value, itemIndex) in row">-->
<!--              <a-col :md="9" :sm="6" class="flex-center title-background">-->
<!--                <div>{{ value }}</div>-->
<!--              </a-col>-->
<!--              <a-col :md="15" :sm="9" class="flex-center">-->
<!--                <div>-->
<!--                  <a-radio-group :defaultValue="tableData[item4.split('.')[0]]&&tableData[item4.split('.')[0]][item4.split('.')[1]]?tableData[item4.split('.')[0]][item4.split('.')[1]]:null" @change="onChange">-->
<!--                    <a-radio value="0">-->
<!--                      合格-->
<!--                    </a-radio>-->
<!--                    <a-radio value="1">-->
<!--                      不合格-->
<!--                    </a-radio>-->
<!--                  </a-radio-group>-->
<!--                </div>-->
<!--              </a-col>-->
<!--            </template>-->
<!--          </a-row>-->

<!--        </template>-->

        <a-row type="flex" align="middle" v-for="(row, rowIndex7) of tableNameTop3" :key="row['其它关注尺寸']">
          <template v-for="(item5, value, itemIndex) of row">
            <a-col :md="9" :sm="6" class="flex-center title-background">
              <div>{{ value }}</div>
            </a-col>
            <a-col :md="15" :sm="9" class="flex-center">
              <div>{{ tableData[item5.split('.')[0]]&&tableData[item5.split('.')[0]][item5.split('.')[1]]?tableData[item5.split('.')[0]][item5.split('.')[1]]: '' }}</div>
            </a-col>
          </template>
        </a-row>
        <a-row>
          <a-col  :md="9" class="title-background" style="height: 80px; display: flex; align-items: center;justify-content: center;border:10px;border: 1px solid #898a8c;">其它</a-col>
          <a-col :md="15">
            <a-row type="flex" align="middle" v-for="(row, rowIndex8) of tableNameTop5" :key="row['日期']">
              <template v-for="(item6, value, itemIndex) of row">
                <a-col :md="6" :sm="4" class="flex-center title-background">
                  <div>{{ value }}</div>
                </a-col>
              </template>
            </a-row>
            <a-row type="flex" align="middle" v-for="(row, rowIndex9) of tableNameTop5" :key="row['谐波标识']">
              <template v-for="(item7, value, itemIndex) of row">
                <a-col :md="6" :sm="4" class="flex-center">
                  <div v-if=" itemIndex =='0' ||itemIndex=='1' ">{{ tableData[item7.split('.')[0]]&&tableData[item7.split('.')[0]][item7.split('.')[1]]? (tableData[item7.split('.')[0]][item7.split('.')[1]]=="0"?"是":"否") : ''}}</div>
                  <div v-if=" itemIndex =='2' ||itemIndex=='3' ">{{ tableData[item7.split('.')[0]]&&tableData[item7.split('.')[0]][item7.split('.')[1]]?tableData[item7.split('.')[0]][item7.split('.')[1]]: ''  }}</div>
                </a-col>
              </template>
            </a-row>
          </a-col>
        </a-row>

        <a-row type="flex" align="middle" v-for="(row, rowIndex10) of tableNameTop6" :key="row['是否保留同批次外观样轮']">
          <template v-for="(item8, value, itemIndex) of row">
            <a-col :md="9" :sm="6" class="flex-center title-background">
              <div>{{ value }}</div>
            </a-col>
            <a-col :md="15" :sm="9" class="flex-center">
              <div v-if=" rowIndex10 =='0' ">{{tableData[item8.split('.')[0]]&&tableData[item8.split('.')[0]][item8.split('.')[1]]? (tableData[item8.split('.')[0]][item8.split('.')[1]]=="0"?"是":"否") : ''}}</div>
            </a-col>
          </template>
        </a-row>
        <a-row type="flex" align="middle" v-for="(row, rowIndex11) of tableNameBottom" :key="row['尺寸']">
          <template v-for="(item9, value, itemIndex) of row" v-if="tableData[item9.split('.')[0]]&&tableData[item9.split('.')[0]][item9.split('.')[1]]">
            <a-col :md="9" :sm="6" class="flex-center title-background">
              <div>{{ value }}</div>
            </a-col>
            <a-col :md="15" :sm="9" class="flex-center">
              <div>{{ tableData[item9.split('.')[0]]&&tableData[item9.split('.')[0]][item9.split('.')[1]]?tableData[item9.split('.')[0]][item9.split('.')[1]]: ''  }}</div>
            </a-col>
          </template>
        </a-row>
      </div>
    </a-modal>
  </div>

</template>

<script>
import {  getShipmentById, getShipmentByFlowSheet, getOptions } from '@/api/api'
export default {
  name: "ShipNoticeInfo",
  data() {
    return {
      projectVisible: false,

      option: { // 下拉选项
        send_sample_purpose:[],  //发运送样具体用途
        packaging_transportation_mode: [], // 发运包装运输方式
      },
      processPerformance :'',
      xprocessState:'',
      sprayProcess:'',
      tableNameTop: [
        {
          戴卡部件号: 'shipmentManagementInfoVo.wheelShape',
          戴卡订单号: 'shipmentManagementInfoVo.ordersId',
        },
        {
          客户名称: 'shipmentManagementInfoVo.customerName',
          轮型尺寸: 'shipmentManagementInfoVo.wheelShapeSize',
        },
        {
          项目负责人: 'shipmentManagementInfoVo.projectLeader',
          市场负责人: 'shipmentManagementInfoVo.marketLeader',
        },
        {
          发运目的地: 'shipmentManagementInfoVo.shipmentDestination',
          计划发运时间: 'shipmentManagementInfoVo.planShipmentDate',
        },
      ],
      tableNameTop1: [
        {
          发样数量: 'sendSampleNumber',
          包装运输方式: 'packagingTransportationMode',
          送样具体用途: 'sendSamplePurpose',
        },
      ],
      tableNameTop2: [
        {
          过程性能: 'shipmentProcessStateVo.processPerformance',
          X光过程状态: 'shipmentProcessStateVo.xprocessState',
          喷涂过程是否异常: 'shipmentProcessStateVo.sprayProcess',
        },
      ],
      tableNameTop3: [
        {
          其它关注尺寸: 'shipmentFinalProductTestVo.otherFocusSizes',
          漆膜性能验证: 'shipmentFinalProductTestVo.filmPerformanceTest',
          漆膜厚度和边缘漏电: 'shipmentFinalProductTestVo.filmThicknessEdgeLeakage',
          漆膜颜色符合度: 'shipmentFinalProductTestVo.filmColourConformity',
          表面外观缺陷: 'shipmentFinalProductTestVo.surfaceAppearanceDefect',
        },
      ],
      tableNameTop4: [
        {
          其它: '',
        },
      ],
      tableNameTop5: [
        {
          平衡标识是否特殊: 'shipmentFinalProductTestVo.balanceSign',
          谐波标识: 'shipmentFinalProductTestVo.harmonicSign',
          外观检察员签字: 'shipmentFinalProductTestVo.appearanceProcurator',
          日期: 'shipmentFinalProductTestVo.date',
        },
      ],
      tableNameTop6: [
        {
          是否保留同批次外观样轮: 'shipmentFinalProductTestVo.sameBatchAppearanceOutline',
        },
      ],
      tableNameBottom: [
        {
          // 是否保留同批次外观样轮: 'shipmentFinalProductTestVo.sameBatchAppearanceOutline',
          总包材: 'shipmentSamplePackingListVo.totalPackageMaterial',
          装配件: 'shipmentSamplePackingListVo.assemblyParts',
          戴卡部件号: 'shipmentSamplePackingListVo.wheelShape',
          尺寸: 'shipmentSamplePackingListVo.size',
          工艺: 'shipmentSamplePackingListVo.technology',
          插件: 'shipmentSamplePackingListVo.plugIn',
          钢套: 'shipmentSamplePackingListVo.steelSleeve',
          工装: 'shipmentSamplePackingListVo.workClothes',
          辅材: 'shipmentSamplePackingListVo.auxiliaryMaterials',
          条码: 'shipmentSamplePackingListVo.barCode',
          标签: 'shipmentSamplePackingListVo.tag',
          双箱: 'shipmentSamplePackingListVo.doubleBox',
          托盘: 'shipmentSamplePackingListVo.tray',
        },
      ],
      tableData: {
      },
    }
  },
  mounted() {
    this.getDic();
  },

  methods: {
    showProjectDetail(id) {
      this.getData(id);
    },
    onChange(e) {
      console.log(`checked = ${e.target.checked}`);
    },
    getDic() { // 获取表单中的部分字段对应的字典
      for (let name in this.option) {
        getOptions(name, '').then((data) => {
          this.option[name] = data;
        });
      }
    },
    getData(id) {
      getShipmentById({ id: id }).then((data) => {

        if(data.shipmentSendSampleDemandVoList.length) {
          for(let i=0;i<data.shipmentSendSampleDemandVoList.length;i++) {
            for(let j=0;j<this.option['send_sample_purpose'].length;j++){
              if (data.shipmentSendSampleDemandVoList[i].sendSamplePurpose!==null && Number(data.shipmentSendSampleDemandVoList[i].sendSamplePurpose) === Number(this.option['send_sample_purpose'][j].value)) { // 找到value相等时对应的label
                data.shipmentSendSampleDemandVoList[i].sendSamplePurpose = this.option['send_sample_purpose'][j].label;
              }
            }

            for(let k=0;k<this.option['packaging_transportation_mode'].length;k++){
              if (data.shipmentSendSampleDemandVoList[i].packagingTransportationMode!==null && Number(data.shipmentSendSampleDemandVoList[i].packagingTransportationMode) === Number(this.option['packaging_transportation_mode'][k].value)) { // 找到value相等时对应的label
                data.shipmentSendSampleDemandVoList[i].packagingTransportationMode = this.option['packaging_transportation_mode'][k].label;
              }
            }

          }
        }
        this.tableData = data;
        this.processPerformance = this.tableData.shipmentProcessStateVo.processPerformance;
        this.sprayProcess = this.tableData.shipmentProcessStateVo.sprayProcess ? this.tableData.shipmentProcessStateVo.sprayProcess : '';
        this.xprocessState = this.tableData.shipmentProcessStateVo.xprocessState;
      });
      this.projectVisible = true;
    },
    getShipData(shippingFlowSheet) {
      getShipmentByFlowSheet({ shippingFlowSheet: shippingFlowSheet }).then((data) => {
        this.getDic();
        if(data.shipmentSendSampleDemandVoList.length) {
          for(let i=0;i<data.shipmentSendSampleDemandVoList.length;i++) {
            for(let j=0;j<this.option['send_sample_purpose'].length;j++){
              if (data.shipmentSendSampleDemandVoList[i].sendSamplePurpose!==null && Number(data.shipmentSendSampleDemandVoList[i].sendSamplePurpose) === Number(this.option['send_sample_purpose'][j].value)) { // 找到value相等时对应的label
                data.shipmentSendSampleDemandVoList[i].sendSamplePurpose = this.option['send_sample_purpose'][j].label;
              }
            }

            for(let k=0;k<this.option['packaging_transportation_mode'].length;k++){
              if (data.shipmentSendSampleDemandVoList[i].packagingTransportationMode!==null && Number(data.shipmentSendSampleDemandVoList[i].packagingTransportationMode) === Number(this.option['packaging_transportation_mode'][k].value)) { // 找到value相等时对应的label
                data.shipmentSendSampleDemandVoList[i].packagingTransportationMode = this.option['packaging_transportation_mode'][k].label;
              }
            }

          }
        }
        this.tableData = data;
        this.processPerformance = this.tableData.shipmentProcessStateVo.processPerformance;
        this.sprayProcess = this.tableData.shipmentProcessStateVo.sprayProcess ? this.tableData.shipmentProcessStateVo.sprayProcess : '';
        this.xprocessState = this.tableData.shipmentProcessStateVo.xprocessState;
      });

      this.projectVisible = true;
    },
    handleCancel() {
      this.projectVisible = false;
    }
  },
}
</script>

<style scoped lang="less">

  .flex-center {
    display: flex;
    justify-content: center;
    border: 1px solid #898a8c;
    height: 40px;
    line-height: 40px;
    /*margin-top: 1px;*/
  }
  .title-background {
    background: #b1c7d8;
    //border:5px;
    /*color: white;*/
    /*border: 1px solid white;*/
  }

  .table-container {
    width: 100%;

    border: 1px solid #898a8c;
  }

  .top-container {
    width: 100%;
    display: flex;
    .left-table {
      width: 66.66%;
    }
    .right-img {
      width: 33.34%;
      height: 160px;
      /*background: #898a8c;*/
      border: 1px solid #898a8c;
      .td_img {
        /*width: 80%;*/
      }
    }
  }
</style>