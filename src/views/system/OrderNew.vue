<!--新建订单页面 包括订单选择弹窗 glc-->
<template>
  <a-spin :spinning="spinning">
    <div class="container">
      <div class="top-container">
        <div class="top-title">{{topTitle}}</div>
      </div>
      <img src="../../assets/order/stripe.png" height="12" width="1065"/>
      <a-card :bordered="false">
        <a-form layout="vertical">
          <!--        <table>-->
          <!--          <tr>-->
          <!--            <td class="item-title">aaa</td>-->
          <!--            <td class="item-value">bbb</td>-->
          <!--            <td class="item-title">aaa</td>-->
          <!--            <td class="item-value">bbb</td>-->
          <!--            <td class="item-title">aaa</td>-->
          <!--            <td class="item-value">bbb</td>-->
          <!--          </tr>-->
          <!--        </table>-->

          <div class="form-row">
            <a-form-item label="戴卡部件号：" class="form-item">
              <a-input disabled style="width: 200px" placeholder="请选择戴卡部件号" v-model="queryParam.component"></a-input>
              <!--              <a-button :disabled="editId  ? true : false" type="primary" @click="showSelectModal">选择</a-button>-->
              <a-button style="width: 64px;margin-left: 8px;color:#8c8c8c" :disabled="!!editId" @click="openSelect()" icon="folder"></a-button>
            </a-form-item>

            <a-form-item label="项目经理：" class="form-item">
              <a-input disabled v-model="queryParam.projectManager"></a-input>
            </a-form-item>

            <a-form-item label="戴卡订单号：" class="form-item" v-if="dkOrdersNumber">
              <a-input disabled v-model="dkOrdersNumber"></a-input>
            </a-form-item>
          </div>
        </a-form>
        <div class="part-title">
          <div class="blue-stripe"></div>
          <span>客户信息</span>
        </div>

        <a-form layout="vertical">
          <div class="form-row">
            <a-form-item label="客户部件号：" class="form-item">
              <a-input disabled v-model="queryParam.customerComponentNumber"></a-input>
            </a-form-item>

            <a-form-item label="客户名称：" class="form-item">
              <a-input disabled v-model="queryParam.customerName"></a-input>
            </a-form-item>

            <a-form-item label="客户订单号：" class="form-item">
              <a-input placeholder="请输入客户订单号" v-model="queryParam.customerOrder"></a-input>
            </a-form-item>
          </div>
        </a-form>

        <div class="part-title">
          <div class="blue-stripe"></div>
          <span>订单信息</span>
        </div>

        <a-form layout="vertical">
          <div class="form-row">
            <a-form-item label="订单数量：" class="form-item">
              <a-input placeholder="请输入订单数量" v-model="queryParam.orderNumber"></a-input>
            </a-form-item>
            <a-form-item label="用途：" class="form-item">
              <a-select
                v-model="queryParam.noun"
                placeholder="请选择"
                style="width: 272px"
              >
                <a-select-option v-for="data in option.noun" :key="data.value">
                  {{ data.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="包装方式：" class="form-item">
              <a-form-item>
                <a-select
                  v-model="queryParam.packaging"
                  placeholder="请选择"
                  style="width: 272px"
                >
                  <a-select-option v-for="data in option.packaging" :key="data.value">
                    {{ data.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-form-item>
          </div>
          <div class="form-row">
            <a-form-item label="订单日期：" class="form-item">
              <a-date-picker disabled v-model="queryParam.orderDate" style="width: 272px"></a-date-picker>
            </a-form-item>
            <a-form-item label="要求发货日期：" class="form-item">
              <a-date-picker v-model="queryParam.deliveryDate" style="width: 272px"></a-date-picker>
            </a-form-item>
          </div>
          <div class="form-row">
            <a-form-item label="送货要求：" class="form-item">
              <a-input placeholder="请输入送货要求" style="width: 880px" v-model="queryParam.deliveryRequest"></a-input>
            </a-form-item>
          </div>
          <div class="form-row">
            <a-form-item label="备注信息：" class="form-item">
              <a-input placeholder="请输入备注信息" style="width: 880px" v-model="queryParam.remark"></a-input>
            </a-form-item>
          </div>
        </a-form>


        <div class="bottom-group">
          <div class="bottom-button">
            <a-button :disabled="!canSubmit" type="primary" @click="submitForm">提交</a-button>
          </div>
          <div class="bottom-button">
            <a-button @click="goBack">返回</a-button>
          </div>
        </div>

      </a-card>

      <select-number ref="modal" v-on:get-text="getProjectNumber"></select-number>
    </div>
  </a-spin>
</template>

<script>
  import { getProjectInformation, getOptions, addOrder, getOrderById } from '@/api/api';

  import SelectNumber from './SelectNumber'

  export default {
    name: 'OrderNew',
    inject:['closeCurrent'],

    components: {SelectNumber},
    data() {
      return {
        spinning: false,
        topTitle: '订单', // 顶部title

        // 新建
        // orderDate: '', // 订单日期
        // deliveryDate: [], // 要求发货日期
        queryParam: {
          component: '', // "戴卡部件号",
          projectManager: '', // "项目经理",
          customerComponentNumber: '', // "客户部件号",
          customerName: '', // "客户名称",
          customerOrder: '', // "客户订单号",
          orderNumber: '', // 订单数量,
          noun: undefined, // 用途,
          packaging: undefined, // 包装方式,
          orderDate: '', // 订单日期
          // orderDateS: '',
          // orderDateE: '',
          deliveryDate: '', // 要求发货日期
          // deliveryDateS: '',
          // deliveryDateE: '',
          deliveryRequest: '', // "送货要求",
          remark: '', // "备注信息"
        },
        option: { // 下拉选项
          noun: [], // 用途
          packaging: [], // 包装方式
        },

        dkOrdersNumber: '', // 戴卡订单号

        // 编辑
        editId: 0, // 获取到的id
        isChanged: false, // 判断是否更改过

        // 弹窗
        projectVisible: false, // 选择弹窗
        projectNumber: '', // 检索的部件号
        dataSource: [],// 检索数组
        columns: [
          {
            title: '戴卡部件号',
            dataIndex: 'projectNumber',
            key: 'projectNumber',
          },
          {
            title: '车轮尺寸',
            dataIndex: 'size',
            key: 'size',
          },
          {
            title: '客户名称',
            dataIndex: 'customerName',
            key: 'customerName',
          },
          {
            title: '项目经理',
            dataIndex: 'projectManager',
            key: 'projectManager',
          },
          {
            title: '车型平台',
            dataIndex: 'vehiclePlatform',
            key: 'vehiclePlatform',
          },
          {
            title: '模号',
            dataIndex: 'modelNumber',
            key: 'modelNumber',
          },
          {
            title: '制作项目',
            dataIndex: 'productionProject',
            key: 'productionProject',
          },
          {
            title: '模具制作类型',
            dataIndex: 'productionType',
            key: 'productionType',
          },
          {
            title: '外观图',
            dataIndex: 'imgUrl',
            key: 'imgUrl',
            scopedSlots: { customRender: 'operate' },
          },
        ],
        selectProject: {}, // 选择的项目
        canSubmit: false, // 是否可以提交
        selectedRowInfor: '', // 选择的行信息 由 戴卡部件号+模号+制作项目+模具制作类型 确定

        // 分页
        page: { // 分页
          total: 0, // 共多少条
          pageSize: 5, // 一页多少条
          pageNum: 0, // 共多少页
          currentPage: 1, // 当前页
          jumpPage: 1, // 跳转到第几页,
        },
      };
    },

    mounted() {
      this.getAppointOption(); // 获取下拉框
      this.editId = 0;
      this.editId = Number(this.$route.query.id);
      if (this.editId) {
        this.topTitle = '编辑订单';
        this.$nextTick(() => {
          this.recoverForm();
        });
      } else {
        this.topTitle = '新增订单';
        let newDate = new Date();
        this.queryParam.orderDate = newDate.toLocaleDateString().replace(/\//g, "-") + " " + newDate.toTimeString().substr(0, 8);
      }
    },

    watch: {
      queryParam: { // 当参数有更改时才可以点击按钮
        handler(val, olVal) {
          if (!this.editId || this.isChanged) {
            this.permitSubmit();
          } else {
            this.isChanged = true;
          }
        },
        deep: true,
      },
    },

    methods: {
      showSelectModal() { // 显示选择弹窗
        this.projectNumber = '';
        this.dataSource = [];
        this.projectVisible = true;
        // this.searchQuery(true);
      },

      searchQuery(reset = false) { // 查询信息列表 reset代表是否重置页码
        if (reset) { // 如果需要重置，比如有了新的筛选条件
          this.page.currentPage = 1;
        }
        let param = {};
        param.projectNumber = this.projectNumber;
        param.pageNo = this.page.currentPage; // 当前页码
        param.pageSize = this.page.pageSize; // 页大小

        getProjectInformation(param).then((data) => {
          data = data.result;
          console.log('data',data);
          if (!data.records.length) {
            this.dataSource = [];
          } else {
            this.dataSource = data.records;
            this.page.total = data.total;
            this.page.pageSize = data.size;
            this.page.pageNum = data.pages;
          }
        });
      },


      recoverForm() {
        getOrderById({ id: this.editId }).then((data) => {
          if (data.result) {

            console.log('result', data);
            data = data.result;
            this.queryParam.component = data.component; // "戴卡部件号",
            this.queryParam.projectManager = data.projectManager; // "项目经理",

            this.dkOrdersNumber = data.dkOrdersNumber; // 戴卡订单号

            this.queryParam.customerComponentNumber = data.customerComponentNumber; // "客户部件号",
            this.queryParam.customerName = data.customerName; // "客户名称",
            this.queryParam.customerOrder = data.customerOrder; // "客户订单号",
            this.queryParam.orderNumber = data.orderNumber; // 订单数量,
            this.queryParam.noun = data.noun; // 用途,
            this.queryParam.packaging = data.packaging; // 包装方式,
            this.queryParam.deliveryRequest = data.deliveryRequest; // "送货要求",
            this.queryParam.remark = data.remark; // "备注信息"
            this.queryParam.orderDate = data.orderDate; // 订单日期
            this.queryParam.deliveryDate = data.deliveryDate; // 要求发货日期
          }
        });
      },

      submitForm() {
        this.spinning = true;
        let param = this.queryParam;
        if (this.editId !== 0) { // 如果id不为零，说明是修改；为0是新增
          param.id = this.editId;
        }
        addOrder(param).then((data) => {
          this.spinning = false;
          if (data.success) {
            if (this.editId === 0) {
              this.$message.success('订单新增成功！');
            } else {
              this.$message.success('订单编辑成功！');
            }
            this.closeCurrent();
            this.$router.push({
              path: `/order/orderInformationMaintenance`,
            });
          } else {
            this.$message.destroy();
            this.$message.error(data.message);
          }
        });
      },

      goBack() {
        this.$router.back(-1);
        this.closeCurrent();
      },

      handleCancel() { // 取消弹窗
        this.projectVisible = false;
        this.selectedRowInfor = '';
      },

      sureSelect() { // 确认选择
        if (!this.projectNumber) {
          this.$message.warning('未选择部件号！');
        } else {
          this.projectVisible = false;

          this.queryParam.component = this.selectProject.projectNumber; // 戴卡部件号
          this.queryParam.projectManager = this.selectProject.projectManager; // 项目经理
          this.queryParam.customerComponentNumber = this.selectProject.customerProjectNumber; // 客户部件号
          this.queryParam.customerName = this.selectProject.customerName; // 客户名称

          this.selectedRowInfor = '';
        }
      },

      getProjectNumber(event) { // 父组件监听子组件值

        this.queryParam.component = event.projectNumber; // 戴卡部件号
        this.queryParam.projectManager = event.projectManager; // 项目经理
        this.queryParam.customerComponentNumber = event.customerProjectNumber; // 客户部件号
        this.queryParam.customerName = event.customerName; // 客户名称

      },

      openSelect() {
        this.$refs.modal.add();
      },

      pageChange(val) { // 分页改变
        // console.log(val);
        this.page.currentPage = val;
        this.searchQuery();
      },

      pageJump(page) { // 点击指定分页跳转的情况下
        if (page > this.page.pageNum) {
          page = this.page.pageNum;
          this.page.jumpPage = this.page.pageNum;
        } else if (page < 1) {
          page = 1;
          this.page.jumpPage = 1;
        }
        this.page.currentPage = page;
        this.searchQuery();
      },

      getAppointOption() { // 获取指定的下拉框
        for (let name in this.option) {
          // let searchName = this.humpOrLine(name, 'toLine');
          getOptions(name, '').then((data) => {
            this.option[name] = data;
          });
        }
      },

      permitSubmit() { // 提交允许
        this.canSubmit = true;
      },

      // 选择
      rowClick(record, index) {
        return {
          // 事件
          on: {
            click: () => {
              console.log('record', record);
              // projectNumber modelNumber productionProject productionType
              this.selectedRowInfor = this.concatProjectInfro(record);
              this.projectNumber = record.projectNumber;
              this.selectProject = record;
            },
          },
          style: {
            'background-color': this.concatProjectInfro(record) === this.selectedRowInfor ? '#e6f7ff' : 'white'
          },
        };
      },

      concatProjectInfro(record) { // 拼接项目信息 用来 确定某一行 高亮
        return record.projectNumber + record.modelNumber + record.productionProject + record.productionType;
      },

    },
  };
</script>

<style lang="less" scoped>

  .ant-input {
    width: 272px;
  }
  /deep/ .ant-card-body {
    padding: 16px 24px;
  }

  .container {
    width: 1064px;
    margin: 16px auto 0 auto;
    display: flex;
    flex-direction: column;
  }
  .top-container {
    letter-spacing: 5px;
    width: 100%;
    height: 160px;
    background: url("../../assets/modalBackground.png") no-repeat;

    .top-title {
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 32px;
      color: #ffffff;
      font-weight: bold;
      margin-left: 40px;
    }
  }

  table {
    margin-bottom: 32px;
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
        width: 147px;
        padding-left: 12px;
        background: #f5f8fa;
      }
      .item-value {
        width: 219px;
        padding-left: 16px;
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
  .form-row {
    display: flex;
    height: 70px;
    margin: 8px 0 8px 18px;

    .form-item {
      margin-right: 32px;
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

  .flex-left {
    display: flex;
    justify-content: start;
  }

  .flex-right {
    display: flex;
    justify-content: flex-end;
  }

  /*.flex-right {*/
  /*  display: flex;*/
  /*  justify-content: center;*/
  /*}*/

  .bottom-group {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }
  .bottom-button {
    margin-right: 20px;
  }

  /*弹窗*/
  /deep/ .ant-modal-title {
    font-weight: bold;
  }

  .search-frame {
    margin-bottom: 20px;
  }

  .left-text {
    width: 120px;
  }

  .search-table {
    min-height: 300px;
  }

  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }
</style>