<template>
  <div>
    <div class="container jn-public-table jn-public-table-other">
      <div class="top-container">
        <div class="top-title">查看BOM</div>
      </div>
      <img src="../../assets/order/stripe.png" height="12" width="1065"/>
      <a-card :bordered="false">
        <div class="part-title" style="margin-top: 0">
          <div class="blue-stripe"></div>
          <span>项目基本信息</span>
        </div>

        <div class="basic-msg-table-container">
          <table>
            <tr v-for="(bomRow, rowIndex) in bomName" :key="rowIndex">
              <template v-for="(name, value, itemIndex) in bomRow">
                <td class="item-title">{{ value }}</td>
                <td class="item-value">{{ bomParam[name] }}</td>
              </template>
            </tr>
          </table>
          <div class="basic-img flex-center">
            <img :src="srccc" alt="">
          </div>
        </div>

        <div class="part-title">
          <div class="blue-stripe"></div>
          <span>BOM版本信息</span>
        </div>

        <table>
          <tr >
            <td class="item-title">当前工段</td>
            <td class="item-value">{{ bomParam.taskObject }}</td>
          </tr>
        </table>

        <!--    版本选择-->
        <a-table
          v-if="!isMould"
          bordered
          :pagination=false
          :columns="versionName"
          :dataSource="versionData"
          rowKey="id"
          :rowSelection="{ selectedRowKeys: selectedVersionKey, onChange: onSelectChange, type: 'radio' }"
          :customRow="selectProjectRow"
          class="table-set"
        >
          <a-space slot="createTime" slot-scope="text, createTime, i">
            {{ text | dayMoment }}
          </a-space>
        </a-table>

        <div class="part-title">
          <div class="blue-stripe"></div>
          <span>BOM清单</span>
        </div>

        <!--    bom清单 非模具-->
        <template v-if="!isMould">
          <table>
            <tr>
              <td class="item-title">版本号</td>
              <td class="item-value">{{ selectedVersion[0] ? selectedVersion[0].version : '' }}</td>
              <td class="item-title">维护人</td>
              <td class="item-value">{{ selectedVersion[0] ? selectedVersion[0].createBy : '' }}</td>
              <td class="item-title">维护日期</td>
              <td class="item-value">{{ selectedVersion[0] ? selectedVersion[0].createTime : '' | dayMoment }}</td>
            </tr>
          </table>
          <a-table
            bordered
            :pagination=false
            :scroll="{ x: true }"
            :columns="materialName"
            :dataSource="materialData"
            class="table-set"
          >
            <a-space slot="operate" slot-scope="text, operate, i">
              <a-button type="link" @click="checkProgress(operate, i)">
                查看
              </a-button>
            </a-space>
          </a-table>
          <!--      :scroll="{ x: 1500, y: 1000 }"-->
        </template>
        <!--    BOM清单 模具-->
        <a-table
          v-if="isMould"
          bordered
          :scroll="{ x: true }"
          :pagination=false
          :columns="mouldName"
          :dataSource="mouldData"
          class="table-set"
        />

      </a-card>
    </div>
  </div>
</template>

<script>
  import { getBomDetailById } from '@/api/api';
  import { GetImgByProjectNumMixin } from '@/mixins/GetImgByProjectNumMixin'

  export default {
    name: 'DetailBOM',
    mixins: [GetImgByProjectNumMixin],
    data() {
      return {
        srccc: null,
        dataSource: [],

        bomName: [
          { '戴卡部件号': 'projectNumber', '客户零件号': 'customerProjectNumber', '客户名称': 'customerName' },
          { '生产工艺': 'productionProcess', '车型平台': 'vehiclePlatform', '重量': 'roundWeight' },
          { '轮径': 'wheelDiameter', '轮宽': 'wheelWidth', '油漆号': 'paintNumber' },
        ], // BOM名称
        bomParam: {
          projectNumber: '', // 戴卡部件号
          customerProjectNumber: '', // 客户零件号
          customerName: '', // 客户名称
          productionProcess: '', // 生产工艺
          vehiclePlatform: '', // 车型平台
          roundWeight: '', // 重量
          wheelDiameter: '', // 轮径
          wheelWidth: '', // 轮宽
          paintNumber: '', // 油漆号

          version: '', // BOM版本
          taskObject: undefined, // 工段
        }, // 维护BOM 查询参数

        option: {
          taskObject: [], // bom 版本
        },

        dic: {},

        isMould: false, // 是否是 模具
        totalData: [], // 总数据
        // 版本选择
        versionName: [
          { title: '版本号', dataIndex: 'version', align: 'left' },
          { title: '维护人', dataIndex: 'createBy', align: 'left' },
          { title: '维护时间', dataIndex: 'createTime', align: 'left', scopedSlots: { customRender: 'createTime' } },
          { title: '物料是否完整', dataIndex: 'integrity', align: 'left' },
        ],
        versionData: [],
        selectedVersionKey: [],
        selectedVersion: [],
        totalVersion: [],
        // 辅件、机加、喷涂、包装的物料清单
        materialName: [
          { title: '物料描述', dataIndex: 'materialDescription', align: 'left' },
          { title: '物料名称', dataIndex: 'materialName', align: 'left' },
          { title: '规格型号', dataIndex: 'specifications', align: 'left' },
          { title: '用量/百件', dataIndex: 'dosage', align: 'left' },
          { title: 'SAP编码', dataIndex: 'sapNumber', align: 'left' },
          { title: '物料类型', dataIndex: 'toolStep', align: 'left' },
          { title: '物料组', dataIndex: 'materialGroup', align: 'left' },
          { title: '主库存', dataIndex: 'bomInventory', align: 'left' },
          { title: '二级库存', dataIndex: 'inventoryQuantity', align: 'left' },
          {
            title: '采购进度',
            dataIndex: 'operate',
            width: 150,
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'operate' },
          },
        ],
        materialData: [],
        // 模具的物料清单
        mouldName: [
          { title: '模号', dataIndex: 'modelNumber', align: 'left' },
          { title: '制作类型', dataIndex: 'productionType', align: 'left' },
          { title: '制作项目', dataIndex: 'productionProject', align: 'left' },
          { title: '整模状态', dataIndex: 'mouldPreparationState', align: 'left' },
          { title: '顶模状态', dataIndex: 'topDieState', align: 'left' },
          { title: '底模状态', dataIndex: 'dieBlockState', align: 'left' },
          { title: '底模环状态', dataIndex: 'dieBlockRingState', align: 'left' },
          { title: '模架状态', dataIndex: 'dieSetState', align: 'left' },
          { title: '边模状态', dataIndex: 'sideFormState', align: 'left' },
          { title: '模具是否完成', dataIndex: 'complete', align: 'left' },
        ],
        mouldData: [],
      };
    },
    mounted() {
      let id = this.$route.query.id;
      this.$nextTick(() => {
        this.getData(id);
      });
    },
    methods: {
      test() {
        let id = this.$route.query.id;
        this.getData(id);
      },
      getData(id) {
        getBomDetailById({ id: id }).then((data) => {
          if (data.success) {
            data = data.result;
            this.totalData = data;

            // 上方参数
            if (data.length) {
              this.bomParam.projectNumber = data[0].projectNumber;
              this.bomParam.customerProjectNumber = data[0].customerProjectNumber;
              this.bomParam.customerName = data[0].customerName;
              this.bomParam.productionProcess = data[0].productionProcess;
              this.bomParam.vehiclePlatform = data[0].vehiclePlatform;
              this.bomParam.roundWeight = data[0].roundWeight;
              this.bomParam.wheelDiameter = data[0].wheelDiameter;
              this.bomParam.wheelWidth = data[0].wheelWidth;
              this.bomParam.paintNumber = data[0].paintNumber;
            }

            this.getImg(this.bomParam.projectNumber);

            // 选择工段
            this.option.taskObject = [];
            for (let i = 0; i < data.length; i++) {
              this.option.taskObject.push(data[i].taskObject);
            }
            if (this.option.taskObject.length) {
              this.bomParam.taskObject = this.option.taskObject[0]; // 默认选中option的第一个
              this.selectBomTaskObject();
            }


          } else {
            this.$message.error(data.message);
          }
        });
      },

      selectBomTaskObject() { // 选择工段
        this.versionData = [];
        this.materialData = [];
        this.mouldData = [];
        this.selectedVersionKey = [];
        this.selectedVersion = [];

        this.totalData.forEach(item => {
          if (item.taskObject === this.bomParam.taskObject) { // 选择模具工段
            if (item.taskObject === '模具物料清单') {
              this.isMould = true;
              this.mouldData = item.projectMouldPlmVos;
              for(let i=0;i<this.mouldData.length; i++) {
                let mould = this.mouldData[i];
                let flag = true;
                for (let state in mould) {
                  if (!mould[state]) flag = false;
                }
                if (flag) {
                  this.mouldData[i].complete = '是';
                } else {
                  this.mouldData[i].complete = '否';
                }
              }

            } else { // 选择非模具的工段
              this.isMould = false;
              this.totalVersion = item.stringListMap;
              this.versionData = [];
              for (let version in this.totalVersion) { // 版本号的信息隐藏在其对象中，其下对象有公共部分还有不同部分
                this.versionData.push({
                  version: version,
                  createBy: this.totalVersion[version][0].createBy,
                  createTime: this.totalVersion[version][0].createTime,
                  integrity: this.totalVersion[version][0].integrity ? '是' : '否',
                });
              }
              this.versionData.sort((a, b) => {
                return a.createTime < b.createTime ? 1 : -1;
              });
              if (this.versionData.length) { // 默认选中第一行
                this.selectedVersionKey = [0];
                this.selectedVersion = [this.versionData[0]];
                this.setBomListData();
              }
            }
          }
        });
      },

      setBomListData() { // 设置BOM清单的list数据，只有非模具的工段才显示此表格
        for(let version in this.totalVersion) {
          if (version === this.selectedVersion[0].version) {
            this.materialData = this.totalVersion[version];
          }
        }
      },

      onSelectChange(selectedRowKeys, selectedVersion) {
        this.selectedVersionKey = selectedRowKeys;
        this.selectedVersion = selectedVersion;
        this.setBomListData();
      },

      selectProjectRow(record, index) {
        return {
          on: {
            click: () => {
              this.selectedVersionKey = [index];
              this.selectedVersion = [record];
              this.setBomListData();
            },
          },
        };
      },

      checkProgress(operate, i) { // 查看进度
        this.$router.push({
          path: `/material/progress`,
          query: {
            sapNumber: operate.sapNumber,
          },
        });
      },

    },
  };
</script>

<style scoped lang="less">
  @import "./../../css/public-table-css";

  /*新样式*/

  .container {
    width: 1064px;
    margin: 16px auto 0 auto;
    display: flex;
    flex-direction: column;
    /deep/ .ant-card-body {
      padding: 24px 24px 24px 24px;
    }

    /deep/ .ant-table-thead > tr > th {
      background: #f5f8fa;
    }

    table {
      border-top: solid 1px #f0f2f5;
      border-left: solid 1px #f0f2f5;

      tr {
        td {
          height: 53px;
          color: rgb(0, 0, 0);
          font-size: 16px;
          border-right: solid 1px #f0f2f5;
          border-bottom: solid 1px #f0f2f5;
        }

        .item-title {
          width: 138px;
          padding-left: 12px;
          background: #f5f8fa;
        }

        .item-value {
          width: 200px;
          padding: 0 16px;
          word-break: break-all;
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }

    .top-container {
      width: 100%;
      height: 160px;
      background: url("../../assets/modalBackground.png") no-repeat;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .top-title {
        letter-spacing: 5px;
        font-size: 32px;
        color: #ffffff;
        font-weight: bold;
        margin: 0 0 0 40px;
      }
    }
  }

  .part-title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 30px;
    line-height: 30px;
    border-radius: 2px;
    background: #f4f5f7;
    margin: 32px 0 12px 0;

    .blue-stripe {
      width: 3px;
      height: 20px;
      background: #347EF2;
      margin: 0 8px 0 4px;
      border-radius: 10px;
    }
  }

  .basic-msg-table-container {
    display: flex;
    table {
      width: 85%;
    }

    .basic-img {
      width: 15%;
      display: flex;
      align-items: center;
      justify-content: center;
      /*margin-bottom: 12px;*/
      background: #f5f8fa;
      border-top: solid 1px #f0f2f5;
      border-right: solid 1px #f0f2f5;
      border-bottom: solid 1px #f0f2f5;
      img {
        width: 90%;
      }
    }
  }



/*旧样式*/
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
    justify-content: center;
  }

  .flex-left {
    display: flex;
    justify-content: flex-start;
    padding-left: 20px;
  }



  .top-layout .ant-layout-sider {
    /*background: white;*/
  }

  .top-layout .ant-layout-content {
    background: white;
    overflow-x: visible;
  }

  /deep/ section {
    width: 66%;
  }

  .table-set {
    margin: 12px 0;
  }
</style>