<template>
  <a-modal :visible="projectVisible" title="项目信息" width="1064px" @cancel="handleCancel" @ok="handleCancel">
<!--    <a-button @click="test" type="primary">test</a-button>-->
    <div class="table-container">
      <div class="top-container">
        <div class="left-table">
          <a-row type="flex" align="middle" v-for="(row, rowIndex) of tableNameTop" :key="rowIndex">
            <template v-for="(item, value, itemIndex) of row">
              <a-col :md="6" :sm="4" class="flex-center title-background">
                <div class="item-word">{{ value }}</div>
              </a-col>
              <a-col :md="6" :sm="4" class="flex-center">
                <div class="item-word">{{ tableData[item] }}</div>
              </a-col>
            </template>
          </a-row>
        </div>
        <div class="right-img" id="tableImg">
          <img :src="srccc" alt="">
        </div>
      </div>
      <a-row type="flex" align="middle" v-for="(row, rowIndex) of tableNameBottom" :key="rowIndex">
        <template v-for="(item, value, itemIndex) of row">
          <a-col :md="4" :sm="4" class="flex-center title-background">
            <div class="item-word">{{ value }}</div>
          </a-col>
          <a-col :md="4" :sm="4" class="flex-center">
            <div class="item-word">{{ tableData[item] }}</div>
          </a-col>
        </template>
      </a-row>
    </div>

    <template slot="footer">
      <div class="footer-button">
        <a-button type="primary" @click="handleCancel">确定</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
  import { getProjectById, getImgStrByProjectNumber } from '@/api/api';
  import { GetImgByProjectNumMixin } from '@/mixins/GetImgByProjectNumMixin';

  export default {
    name: 'ProjectInformation',
    mixins: [GetImgByProjectNumMixin],
    data() {
      return {
        projectVisible: false,
        tableNameTop: [
          {
            戴卡部件号: 'projectNumber',
            表面状态: 'surfaceState',
          },
          {
            试制批次: 'trialProductionBatch',
            首次试制时间: 'firstTrialProductionTime',
          },
          {
            轮型尺寸: 'size',
            项目阶段: 'projectPhase',
          },
          {
            客户名称: 'customerName',
            项目经理: 'projectManager',
          },
        ],
        tableNameBottom: [
          {
            客户零件号: 'customerProjectNumber',
            生产工艺: 'productionProcess',
            轮径: 'wheelDiameter',
          },
          {
            车型平台: 'vehiclePlatform',
            重量: 'roundWeight',
            轮宽: 'wheelWidth',
          },
          {
            轮辋形式: 'rimForm',
            油漆号: 'paintNumber',
            油漆类型: 'paintType',
          },
          {
            材料: 'material',
            光泽: 'gloss',
            特殊效果: 'specialEffects',
          },
          {
            戴卡3D及版本: 'version3d',
            其他说明: 'explain',
            '': '',
          },
        ],
        tableData: {},
        srccc: null,
      };
    },

    methods: {
      test() {
        console.log('tableData', this.tableData);
      },

      getData(id) {
        this.srccc = '';
        getProjectById({ id: id }).then((data) => {
          if (data.success) {
            data = data.result;
            this.tableData = data;
            this.getImg(data.projectNumber);// 获取图片
          } else {
            this.$message.error(data.message);
          }
        });
        this.projectVisible = true;
      },
      handleCancel() {
        this.projectVisible = false;
      },
    },
  };
</script>

<style scoped lang="less">
  .item-word {
    display: flex;
    align-items: center;
    line-height: 20px;
    padding: 0 15px;
    word-break: break-all;
    flex-wrap: wrap;
  }

  .flex-center {
    display: flex;
    justify-content: center;
    border: 1px solid #898a8c;
    height: 50px;
    line-height: 50px;
    /*margin-top: 1px;*/
  }

  .title-background {
    background: #b1c7d8;
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
      height: 200px;
      /*background: #898a8c;*/
      border: 1px solid #898a8c;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100px;
      }
    }


  }
</style>