<template>
  <!--    审批-->
  <a-modal
    class="jn-public-table"
    @cancel="auditCancel"
    :visible="auditVisible"
    title="订单审批"
    width="1120px">
    <div class="table-container">
      <a-table
        :dataSource="auditDataSource"
        :columns="auditColumns"
        bordered
        :pagination=false
        :scroll="{ x: 900, y: 1000 }"
      >
        <!--        auditOperate-->
        <template slot="auditOperate" slot-scope="text, operate, i">
          <a-button type="link" @click="queryDetail(operate, i)">
            {{ text }}
          </a-button>
        </template>
      </a-table>
    </div>
    <div class="radio-group">
<!--      <a-button @click="test">test</a-button>-->
      <div class="part-title">
        <div class="blue-stripe"></div>
        <span>处理指令</span>
      </div>

      <div class="radio-item-container">
        <template
          v-for="(item, index) in auditRadio">
          <div class="radio-item" v-if="auditOrder !== index + 1" @click="handelAuditChange('adopt', index + 1)">
            <img :src=imgUrl(index+1)>
            {{item}}
          </div>

          <div class="radio-item radio-item-select" v-if="auditOrder === index + 1" @click="handelAuditChange('adopt', index + 1)">
            <img :src=imgUrlSelect(index+1)>
            {{item}}
          </div>
        </template>
      </div>
      <!--      <a-radio-group @change="handelAuditChange('adopt')" v-model:value="auditOrder" button-style="solid"-->
      <!--                     size="large">-->
      <!--        <a-radio-button v-for="(item, index) in dic.processingInstruction" :key="index" :value="item.value">-->
      <!--          {{item.text}}-->
      <!--        </a-radio-button>-->
      <!--      </a-radio-group>-->

      <div class="part-title">
        <div class="blue-stripe"></div>
        <span>驳回说明</span>
      </div>
      <a-textarea @change="handelAuditChange('reject')" v-model:value="auditRejectReason" placeholder="请输入驳回说明"
                  class="radio-textarea" :rows="4"/>
    </div>
    <template slot="footer">

      <a-spin :spinning="spinning">
        <div class="auditFooter">
          <a-button v-has="'order:audit'" :disabled="auditOrder === 0" type="primary" @click="auditAdoptOrReject('adopt')"
                    style="margin-right: 20px">通过
          </a-button>
          <a-button v-has="'order:audit'" :disabled="auditRejectReason === ''" type="primary"
                    @click="auditAdoptOrReject('reject')">驳回
          </a-button>
        </div>
      </a-spin>
    </template>
  </a-modal>
</template>

<script>
  import {
    addAudit,
    getOrderById,
    getDictItemsFromCache
  } from '@/api/api';
  export default {
    name: 'OrderAudit',
    // props: ['auditId', 'auditShow'],
    data() {
      return {
        spinning: false,
        // 审批弹窗
        auditVisible: false, // 审批弹窗可视化
        auditColumns: [ // 表头
          { title: '订单日期', dataIndex: 'orderDate', width: 150, align: 'center' },
          { title: '戴卡订单号', dataIndex: 'dkOrdersNumber', width: 250, align: 'center', scopedSlots: { customRender: 'auditOperate' }, },
          { title: '客户订单号', dataIndex: 'customerOrder', width: 150, align: 'center' },
          { title: '戴卡部件号', dataIndex: 'component', width: 150, align: 'center' },
          { title: '客户部件号', dataIndex: 'customerComponentNumber', width: 150, align: 'center' },
          { title: '客户名称', dataIndex: 'customerName', width: 150, align: 'center' },
          { title: '订单数量', dataIndex: 'orderNumber', width: 150, align: 'center' },
          { title: '要求发货日期', dataIndex: 'deliveryDate', width: 150, align: 'center' },
          { title: '包装方式', dataIndex: 'packaging', width: 150, align: 'center' },
        ],

        auditRadio: ['安排试制', '安排发货', '部分试制部分发货', '等待'],
        auditDataSource: [], // 数据
        auditOrder: 0, // 处理指令 processing_instruction 字典获取
        auditRejectReason: '', // 审批-驳回说明

        selectId: 0, // 选中行的id

        dic: { // 表单中的部分数据对应的的数据词典
          packaging: [], // 包装方式
          processingInstruction: [], // 处理指令
        },
      }
    },
    mounted() {

    },
    methods: {
      test() {
        console.log('index', this.auditOrder);
      },
      clickAudit(id) { // 审批 点击
        this.auditOrder = 0;
        this.getDic(); // 获取字典
        this.selectId = id;
        this.auditVisible = true;
        getOrderById({ id: id }).then((data) => {
          // this.dataToDic(data.result);
          // this.auditDataSource = [data.result];
          setTimeout(() => {
            console.log('result', data.result);
            this.auditDataSource = this.dataToDic([data.result]);
            this.$nextTick(() => {
            })
          }, 0)
        });
      },

      auditAdoptOrReject(state) { // 通过/驳回审批
        this.spinning = true;
        // orderState 通过2 驳回3
        let param = { id: this.selectId };
        if (state === 'adopt') {
          param.orderState = 2;
          param.processingInstruction = this.auditOrder;
        } else if (state === 'reject') {
          param.orderState = 3;
          param.rejectMessage = this.auditRejectReason;
        }
        addAudit(param).then((data) => {
          this.spinning = false;
          console.log('audit', data);
          if (data.success) {
            this.$message.success(state === 'adopt' ? '审批通过成功！' : '审批驳回成功');
            // this.selectId = 0;
            // this.auditOrder = 0;
            // this.auditRejectReason = '';
            // this.searchQuery();
            this.auditVisible = false;
            this.$emit('get-text');
          } else {
            this.$message.error(data.message);
          }
        });
      },

      imgUrl(index) {
        return require(`../../assets/order/${index}.png`)
      },

      imgUrlSelect(index) {
        return require(`../../assets/order/${index}-blue.png`);
      },

      auditCancel() { // 取消审批
        // this.$emit('get-text', false);
        this.auditVisible = false;
        // this.selectId = 0;
        // this.auditOrder = 0;
        // this.auditRejectReason = '';
        // this.searchQuery();
      },

      handelAuditChange(operate, index = 0) {
        if (operate === 'adopt') {
          this.auditRejectReason = '';
          this.auditOrder = index;
          console.log('index', this.auditOrder);
        } else if (operate === 'reject') {
          this.auditOrder = 0;
        }
      },

      queryDetail(operate, i) { // 查询详情
        this.$router.push({
          path: `/order/orderDetail`,
          query: {
            id: operate.id,
          },
        });
      },

      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          // getOptions(searchName, '').then((data) => {
          //   this.dic[name] = data;
          // });
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


      dataToDic(data) { // 将数据中的字段改为字典
        for (let i = 0; i < data.length; i++) { // 遍历返回的数据列表
          for (let name in data[i]) { // 列表每行 for 出每个属性
            if (name in this.dic) { // 如果该属性在字典里
              for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                if (Number(data[i][name]) === Number(this.dic[name][j].value)) { // 找到value相等时对应的label
                  data[i][name] = this.dic[name][j].text;
                }
              }
            }
          }
        }
        return data;
      },

    }
  };
</script>

<style scoped lang="less">

  @import "./../../css/public-table-css";
  /deep/ .ant-modal-body {
    padding: 0;
  }

  .table-container {
    width: 100%;
    background: #f5f8fa;
    padding: 25px 32px;
  }

  /*审批*/
  .radio-group {
    margin: 20px;

    .audit-title {
      font-size: 18px;
      font-weight: bold;
      margin: 20px 0;
    }
  }

  .radio-item-container {
    display: flex;
    margin-left: 18px;

    .radio-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 136px;
      height: 75px;
      margin-right: 20px;
      color: #8e939e;
      border: solid 2px #d9dbdf;
      border-radius: 5%;
       cursor: pointer;
      img {
        margin-bottom: 10px;
      }
    }

    .radio-item-select {
      border: solid 2px #347ef2;
      color: #347ef2;
      background: #edf6ff;
    }
  }
  .radio-textarea {
    margin-left: 18px;
    width: 1040px;
  }

  .auditFooter {
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }


  .part-title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 18px 0 18px 18px;
    width: 1040px;
    height: 30px;
    line-height: 30px;
    border-radius: 2px;
    background: #f4f5f7;
    /*padding-left: 10px;*/
    /*margin: 20px 0;*/
    .blue-stripe {
      width: 3px;
      height: 20px;
      background: #347EF2;
      margin: 0 8px 0 4px;
      border-radius: 10px;
    }
  }


</style>