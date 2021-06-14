<!--订单详情页面 glc-->
<template>
  <div class="container">
<!--        <a-button @click="test">test</a-button>-->

    <div class="top-container">
      <div class="top-title">订单详情</div>
      <a-button style="width: 100px;margin-left: 40px" type="primary" @click="checkHistory">历史记录</a-button>
    </div>
    <a-card :bordered="false">

      <table>
        <tr>
          <td class="item-title">戴卡部件号</td>
          <td class="item-value">{{ queryParam.component }}</td>
          <td class="item-title">项目经理</td>
          <td class="item-value">{{ queryParam.projectManager }}</td>
          <td class="item-title" v-if="queryParam.dkOrdersNumber">戴卡订单号</td>
          <td class="item-value" v-if="queryParam.dkOrdersNumber">{{ queryParam.dkOrdersNumber }}</td>
        </tr>
      </table>

      <div class="part-title">
        <div class="blue-stripe"></div>
        <span>订单进度</span>
      </div>
      <!--      <div class="process-container">-->
      <!--        <template v-for="(step, index) in orderSteps">-->
      <!--          <img v-if="index !== 0" src="../../assets/order/arrow.png" height="24" width="40"/>-->
      <!--        </template>-->
      <!--      </div>-->

      <div class="steps-container">
        <template v-for="(step, index) in orderSteps">
          <div class="steps-line" v-if="index !== 0" :style="{'background': returnColor(step.state)}"></div>
          <div :style="index === 2 || index === 3 ? 'cursor: pointer' : ''" class="steps-items" @click="progressJump(index, step)">
            <!--       灰色stop rgba(0, 0, 0, 0.25)  蓝色对 #1890ff  红色错 ff4d4f-->
            <div class="steps-icon" :style="{'border-color': returnColor(step.state) }">
              <img v-if="step.state === 'right'" src="../../assets/process_right.png" height="18" width="18"/>
              <img v-if="step.state === 'error'" src="../../assets/process_error.png" height="18" width="18"/>
              <span v-if="step.state === 'stop'">{{ index + 1}}</span>
              <span v-if="step.state === 'wait'" style="color: #70b603">{{ index + 1}}</span>
            </div>
            <div class="steps-infor-group">
              <div :style="{color: returnProcessColor(step.name)}">{{ step.name }}</div>
              <div :style="{color: returnProcessColor(step.name)}" v-if="step.date !== ''">{{ step.date }}</div>
              <!--              <div style="color: #FF4D4F" v-if="step.description">{{ step.description }}</div>-->
              <div v-if="step.description">{{ step.description }}</div>
            </div>
          </div>
        </template>
      </div>

      <div class="part-title">
        <div class="blue-stripe"></div>
        <span>客户信息</span>
      </div>

      <table>
        <tr>
          <td class="item-title">客户部件号</td>
          <td class="item-value">{{ queryParam.customerComponentNumber }}</td>
          <td class="item-title">客户名称</td>
          <td class="item-value">{{ queryParam.customerName }}</td>
          <td class="item-title">客户订单号</td>
          <td class="item-value">{{ queryParam.customerOrder }}</td>
        </tr>
      </table>

      <div class="part-title">
        <div class="blue-stripe"></div>
        <span>订单信息</span>
      </div>

      <table style="margin: 0">
        <tr>
          <td class="item-title">订单数量</td>
          <td class="item-value">{{ queryParam.orderNumber }}</td>
          <td class="item-title">用途</td>
          <td class="item-value">{{ queryParam.noun }}</td>
          <td class="item-title">包装方式</td>
          <td class="item-value">{{ queryParam.packaging }}</td>
        </tr>
        <tr>
          <td class="item-title">订单日期</td>
          <td class="item-value">{{ queryParam.orderDate }}</td>
          <td class="item-title">要求发货日期</td>
          <td class="item-value">{{ queryParam.deliveryDate }}</td>
          <td class="item-title"></td>
          <td class="item-value"></td>
        </tr>
      </table>
      <table style="margin: 0; border-top: 0">
        <tr>
          <td class="item-title">送货要求</td>
          <td class="item-value" style="width: 876px">{{ queryParam.deliveryRequest }}</td>
        </tr>
      </table>
      <table style="border-top: 0">
        <tr>
          <td class="item-title">备注信息</td>
          <td class="item-value" style="width: 876px">{{ queryParam.remark }}</td>
        </tr>
      </table>

      <div class="part-title">
        <div class="blue-stripe"></div>
        <span>客户反馈</span>
      </div>
      <table style="border-top: 0">
        <tr>
          <td class="item-title">反馈类型</td>
          <td class="item-value" style="width: 876px">{{ queryParam.ordersFeedbackType }}</td>
        </tr>
        <tr>
          <td class="item-title">反馈内容</td>
          <td class="item-value" style="width: 876px">{{ queryParam.ordersFeedbackMessage }}</td>
        </tr>
        <tr>
          <td class="item-title">文件上传</td>
          <td class="item-value" style="width: 876px">
            <div class="file-container">
              <div class="file-item" @click="downloadFile(file)" v-for="(file, index) in queryParam.fileUrl"
                   :key="index">
                <img src="../../assets/order/file.png" height="17" width="14"/>
                {{ fileNameUrl[index] }}
              </div>
            </div>
          </td>
        </tr>
      </table>

      <div class="bottom-page">
        <a-button @click="returnList()">返回</a-button>
      </div>
    </a-card>

    <!--    历史记录-->
    <a-modal
      @cancel="cancelCheckHistory"
      :visible="historyVisible"
      title="历史记录"
      width="800px">
      <a-table
        :dataSource="historyData"
        :columns="historyColumn"
        bordered
        :pagination=false
        :scroll="{ x: 2400, y: 500 }"
      >
        <a-space slot="reject" slot-scope="text, reject, i">
          <a-button type="link" @click="checkHistoryReject(reject, i)">查看</a-button>
        </a-space>
      </a-table>
      <template slot="footer">
        <div class="auditFooter">
          <a-button type="primary"
                    @click="cancelCheckHistory">确定
          </a-button>
        </div>
      </template>
    </a-modal>
    <a-modal
      @cancel="cancelHistoryReject"
      :visible="historyRejectVisible"
      title="驳回说明"
      width="500px">
      <p>
        {{historyRejectInstruction}}
      </p>
      <template slot="footer">
        <div class="auditFooter">
          <a-button type="primary"
                    @click="cancelHistoryReject">确定
          </a-button>
        </div>
      </template>
    </a-modal>

<!--    复查、发运弹窗-->
    <a-modal v-model="deliveryVisible2" title="流转单现阶段详情" :footer="null" width="800px">
      <div v-if="deliveryVisible2">
        <view-details
          :id="deliverychoose_id"
          @close="closeTimeMsg2"
          :iShow="true"
          :pageStatus="pageStatus"
        ></view-details>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import { getOptions, getOrderById, getOrderProgress, checkOrderHistory, webDownloadLocal } from '@/api/api';
  import viewDetails from '@/views/shipment/viewDetails'

  export default {
    name: 'OrderDetail',
    inject: ['closeCurrent'],
    components: { viewDetails },
    data() {
      return {
        selectId: 0, // 获取到的id
        orderSteps: [ // right已处理 error已驳回 stop未处理 wait待处理
          { name: '提交订单', state: 'stop', date: '', description: null },
          { name: '待处理', state: 'stop', date: '', description: null },
          { name: '试制', state: 'stop', date: '', description: null },
          { name: '复查', state: 'stop', date: '', description: null },
          { name: '物流已提货', state: 'stop', date: '', description: null },
          { name: '客户反馈', state: 'stop', date: '', description: null },
        ],
        stepName: ['提交订单', '待处理', '已驳回', '已处理', '试制', '复查', '物流已提货', '客户反馈'],

        queryParam: {
          component: '', // "戴卡部件号",
          dkOrdersNumber: '', // 戴卡订单号
          projectManager: '', // "项目经理",
          customerComponentNumber: '', // "客户部件号",
          customerName: '', // "客户名称",
          customerOrder: '', // "客户订单号",
          orderNumber: '', // 订单数量,
          noun: undefined, // 用途,
          packaging: undefined, // 包装方式,
          orderDate: '', // 订单日期
          deliveryDate: '', // 要求发货日期
          deliveryRequest: '', // "送货要求",
          remark: '', // "备注信息"
          ordersFeedbackType: undefined,
          ordersFeedbackMessage: '',
          fileNameUrl: [], // 文件name列表
        },

        option: { // 下拉选项
          noun: [], // 用途
          packaging: [], // 包装方式
          // feedbackState: [],
          ordersFeedbackType: [],
        },

        // 历史记录
        historyVisible: false, // 历史记录弹窗可视化
        historyColumn: [ // 历史记录表头
          { title: '订单日期', dataIndex: 'orderDate', width: 150, align: 'center' },
          { title: '戴卡订单号', dataIndex: 'dkOrdersNumber', width: 150, align: 'center' },
          { title: '客户订单号', dataIndex: 'customerOrder', width: 150, align: 'center' },
          { title: '戴卡部件号', dataIndex: 'component', width: 150, align: 'center' },
          { title: '客户部件号', dataIndex: 'customerComponentNumber', width: 150, align: 'center' },
          { title: '客户名称', dataIndex: 'customerName', width: 150, align: 'center' },
          { title: '项目经理', dataIndex: 'projectManager', width: 150, align: 'center' },
          { title: '订单数量', dataIndex: 'orderNumber', width: 150, align: 'center' },
          { title: '用途', dataIndex: 'noun', width: 150, align: 'center' },
          { title: '包装方式', dataIndex: 'packaging', width: 150, align: 'center' },
          { title: '要求发货日期', dataIndex: 'deliveryDate', width: 150, align: 'center' },
          // { title: '待查库存', dataIndex: 'inventory', width: 150, align: 'center' },
          // { title: '进度', dataIndex: 'progress', width: 150, align: 'center' },
          // { title: '订单状态', dataIndex: 'orderState', width: 150, align: 'center' },
          // { title: '处理指令', dataIndex: 'processingInstruction', width: 150, align: 'center' },
          // { title: '客户反馈状态', dataIndex: 'ordersFeedbackState', width: 150, align: 'center' },
          { title: '维护人', dataIndex: 'maintenanceName', width: 150, align: 'center' },
          { title: '维护时间', dataIndex: 'maintenanceTime', width: 150, align: 'center' },
          { title: '审批人', dataIndex: 'examinationName', width: 150, align: 'center' },
          { title: '审批时间', dataIndex: 'examinationTime', width: 150, align: 'center' },
          {
            title: '驳回说明',
            dataIndex: 'reject',
            width: 150,
            align: 'center',
            // fixed: 'right',
            scopedSlots: { customRender: 'reject' },
          },
        ], // 历史记录 表头
        historyData: [], // 历史记录 数据

        dic: { // 表单中的部分数据对应的的数据词典
          noun: [], // 用途
          packaging: [], // 包装方式
          progress: [], // 进度
          orderState: [], // 订单状态
          processingInstruction: [], // 处理指令
          ordersFeedbackType: [], // 客户反馈类型
          ordersFeedbackState: [], // 客户反馈状态
        },
        historyRejectVisible: false, // 历史记录 驳回说明 可视化
        historyRejectInstruction: '', // 历史记录 驳回说明

        deliveryVisible2: false, // 发运弹窗 可视化
        deliverychoose_id: 0, // 发运弹窗id
        pageStatus: '', // 发运弹窗 no
      };
    },
    mounted() {
      this.getAppointOption(); // 获取下拉框
      this.getDic();
      this.selectId = 0;
      this.selectId = Number(this.$route.query.id);
      if (this.selectId) {
        this.$nextTick(() => {
          this.recoverData();
          this.getProcess();
        });
      }
    },

    methods: {
      test() {
        this.getProcess();
        // let keyList = Object.keys(this.option);
        // for (let i = 0; i < keyList.length; i++) {
        //   let key = keyList[i];
        //   for (let j = 0; j < this.option[key].length; j++) {
        //
        //     console.log('label', this.option[key][j].value);
        //   }
        // }
        // console.log('label', Object.keys(this.option));
      },

      recoverData() {
        getOrderById({ id: this.selectId }).then((data) => {
          if (data.success) {
            data = data.result;
            console.log('data', data);

            let keyList = Object.keys(this.option);
            for (let i = 0; i < keyList.length; i++) {
              let key = keyList[i];
              for (let j = 0; j < this.option[key].length; j++) {
                if (data[key] === this.option[key][j].value) {
                  data[key] = this.option[key][j].label;
                  console.log('data[key]', data[key]);
                }
              }
            }
            let fileList = data.fileUrl;
            this.fileNameUrl = [];
            if (fileList) {
              data.fileUrl = data.fileUrl.split(';');
              data.fileUrl.forEach(item => {
                this.fileNameUrl.push(item.split('/').pop());
              });
            } else {
              data.fileUrl = [];
            }

            this.queryParam = data;
          } else {
            this.$message.destroy();
            this.$message.warning(data.message);
          }
        });
      },


      // 进度条
      getProcess() { // 获取进度条
        getOrderProgress({ id: this.selectId }).then((data) => {
          data = data.result;
          console.log('process data', data);
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
              // 提交订单0(list0) 必有
              // (list1) 待处理绿色wait 1  已驳回红色error 2  已处理right蓝色 3
              // 试制4(list2) 复查5(list3) 物流已提货6(list4) 客户反馈7(list5)
              let stepItem = {};
              let instructStr = '';
              if (data[i].processingInstruction) {
                instructStr = this.dic.processingInstruction[data[i].processingInstruction - 1].label;
              }

              stepItem = {
                name: this.stepName[data[i].progress],
                state: this.returnProcessState(Number(data[i].progress)),
                date: data[i].createTime.split(' ')[0],
                description: instructStr,

                formBaseId: data[i].formBaseId,
                formBaseINo: data[i].formBaseINo,
                shipmentId: data[i].shipmentId,
                shipmentNo: data[i].shipmentNo,
              };

              if (data[i].progress === 0) {
                this.orderSteps.splice(0, 1, stepItem);
              } else if (data[i].progress > 0 && data[i].progress < 4) {
                this.orderSteps.splice(1, 1, stepItem);
              } else {
                this.orderSteps.splice(data[i].progress - 2, 1, stepItem);
              }
            }
          }
        });
      },

      progressJump(index, step) { // 点击进度条跳转或弹窗
        if (index === 2) {
          if (step.formBaseId) {
            this.$router.push({
              path: '/trial/trialForm',
              query: {
                id: step.formBaseId,
                no: step.formBaseNo,
              },
            },);
          } else {
            this.$message.destroy();
            this.$message.warning('此环节尚未进行！');
          }
        } else if (index === 3) {
          if (step.shipmentId) {
            this.deliverychoose_id = step.shipmentId; // 发运弹窗id
            this.pageStatus = step.shipmentNo; // 发运弹窗id
            this.deliveryVisible2 = true;
          } else {
            this.$message.destroy();
            this.$message.warning('此环节尚未进行！');
          }
        }
      },

      closeTimeMsg2() {
        this.deliveryVisible2 = false;
      },

      returnProcessState(type) { // 根据process 数值返回相应 state
        switch (type) {
          case 0 :
            return 'right';
          case 1 :
            return 'wait';
          case 2 :
            return 'error';
          case 3 :
            return 'right';
          case 4 :
            return 'right';
          case 5 :
            return 'right';
          case 6 :
            return 'right';
          case 7 :
            return 'right';
        }
      },

      returnProcessColor(state) {
        switch (state) {
          case '待处理' :
            return '#70b603';
          case '已驳回' :
            return '#FF4D4F';
        }
      },

      returnList() {
        // this.$router.push(
        //   { path: `/order/orderInformationMaintenance` },
        // );
        this.closeCurrent();
        this.$router.back(-1);
      },

      returnColor(type) { // 根据输入类型返回颜色
        switch (type) {
          case 'stop' :
            return 'rgba(0, 0, 0, 0.25)';
          case 'right' :
            return '#1890ff';
          case 'error' :
            return '#ff4d4f';
          case 'wait' :
            return '#70b603';
        }
      },

      // 历史记录
      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          getOptions(searchName, '').then((data) => {
            this.dic[name] = data;
          });
        }
      },

      getAppointOption() { // 获取指定的下拉框
        for (let name in this.option) {
          let searchName = this.humpOrLine(name, 'toLine');
          getOptions(searchName, '').then((data) => {
            this.option[name] = data;
          });
        }
      },

      checkHistory() { // 查看历史记录
        checkOrderHistory({ id: this.selectId }).then((data) => {
          if (data.success) {
            data = data.result;
            for (let i = 0; i < data.length; i++) { // 遍历返回的数据列表
              for (let name in data[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data[i][name] === this.dic[name][j].value) { // 找到value相等时对应的label
                      data[i][name] = this.dic[name][j].label;
                    }
                  }
                }
              }
            }

            this.historyData = data;


            this.historyVisible = true;
          } else {
            this.$message.error(data.message);
          }
        });
      },

      cancelCheckHistory() { // 取消查看历史记录
        this.historyVisible = false;
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

      checkHistoryReject(reject, i) { // 取消查看历史记录 驳回说明
        if (reject.rejectMessage) {
          this.historyRejectInstruction = reject.rejectMessage;
        } else {
          this.historyRejectInstruction = '暂无驳回说明';
        }
        this.historyRejectVisible = true;
      },

      cancelHistoryReject() { // 取消查看历史记录
        this.historyRejectVisible = false;
      },

      downloadFile(file) { // 下载文件
        let fileName = file.split('/').pop();

        let params = {
          fileUrl: file,
        };

        this.$http({
          url: `${window._CONFIG['domianURL']}/api/webDownloadLocal`,
          method: 'get',
          responseType: 'arraybuffer',   //一定要设置响应类型，否则页面会是空白pdf
          params: params,
        }).then((data) => {
          console.log('data', data);

          let content = data;//arraybuffer类型数据
          let resBlob = new Blob([content]);
          let reader = new FileReader();
          reader.readAsText(resBlob, 'utf-8');
          reader.onload = () => {
            try { // 判断是否可以转化为json格式，可以就说明不是文件流，错误返回值
              let res = JSON.parse(reader.result);
              console.log(res);
              this.$message.destroy();
              this.$message.error(res.message);
            } catch { // 报错说明不能转化为json，是文件流，下载文件
              console.log('res status', data);
              let blob = new Blob([data]);
              const blobUrl = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.style.display = 'none';
              a.download = fileName;
              a.href = blobUrl;
              a.click();
              document.body.removeChild(a);
            }
          };
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  /*.ant-input {*/
  /*  width: 200px;*/
  /*}*/

  .container {
    width: 1064px;
    margin: 16px auto 0 auto;
    display: flex;
    flex-direction: column;
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
      margin: 0 0 20px 40px;
    }
  }

  table {
    border-top: solid 1px #f0f2f5;
    border-left: solid 1px #f0f2f5;
    margin-bottom: 32px;

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

  .file-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .file-item {
    width: 316px;
    height: 38px;
    padding: 0 16px;
    margin: 5px 10px 5px 0;
    line-height: 15px;
    font-size: 14px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #f7f8fa;
    border-radius: 19px;

    cursor: pointer;

    &:hover {
      background: #eaebed;
    }

    &:active {
      background: #f7f8fa;
    }


    img {
      margin-right: 12px;
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
    margin-bottom: 20px;
  }

  .flex-center {
    display: flex;
    justify-content: center;
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
    margin-bottom: 12px;

    .blue-stripe {
      width: 3px;
      height: 20px;
      background: #347EF2;
      margin: 0 8px 0 4px;
      border-radius: 10px;
    }
  }

  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

  .steps-container {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 0 20px;

    .steps-items {
      width: 75px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      /*cursor: pointer;*/

      .steps-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        text-align: center;
        line-height: 22px;
        border-radius: 24px;
        font-size: 12px;
        margin-bottom: 10px;
        color: rgba(0, 0, 0, 0.25);

        border: 1px solid rgba(0, 0, 0, 0.25);
      }


      .steps-infor-group {

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 14px;

        & div {
          margin: 3px 0;
        }
      }
    }

    .steps-line {
      width: 8%;
      height: 1px;
      margin: 12px 0;
      background: #1890ff;
    }


    /*新进度条*/

    .process-container {
      display: flex;
      flex-wrap: wrap;
    }
  }
</style>