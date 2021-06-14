<template>
  <a-card :bordered="false" style="width: 1200px">
    <!--    <a-button type="primary" @click="test">test</a-button>-->
    <div class="instruction-title" v-if="!selectId">新建发运流转过程指令</div>
    <div class="instruction-title" v-else-if="selectType === 'edit'">编辑发运流转过程指令</div>
    <div class="instruction-title" v-else-if="selectType === 'check'">查看发运流转过程指令</div>
    <div v-if="selectType !== 'check' && selectType !== 'edit'">
      <div class="title">发运流转单编号检索</div>
      <div class="select-container">
        <a-select
          labelInValue
          placeholder="请选择检索条件"
          v-model="optionSelect.sheet"
          style="width: 200px"
          @change="selectSheetChange"
        >
          <a-select-option v-for="data in option.sheet" :key="data.key">{{ data.label }}</a-select-option>
        </a-select>
        <a-input style="width: 300px" v-model="sheetInput" placeholder="请输入检索条件"></a-input>
        <a-button type="primary" @click="searchQuery(true)">检索</a-button>
      </div>

      <div class="title table-title flex-center">发运流转单信息</div>

      <!--      试制流转单信息表格-->
      <a-table
        ref="table"
        size="middle"
        bordered
        :columns="columns"
        :dataSource="dataSource"
        :customRow="sheetRowClick"
        :pagination="false"
      >
        <a-space slot="shippingFlowSheet" slot-scope="text, operate, i">
          <a-button type="link" @click.stop="showShipDetail(operate, i)">{{ text }}</a-button>
        </a-space>
        <a-space slot="projectNumber" slot-scope="text, operate, i">
          <a-button type="link" @click.stop="showProjectDetail(operate, i)">{{ text }}</a-button>
        </a-space>
      </a-table>

      <!--    分页-->
      <div class="bottom-page">
        <a-pagination
          :total="page.total"
          :show-total="total => `共 ${total} 条`"
          :page-size="page.pageSize"
          :current="page.currentPage"
          @change="pageChange"
        />
        <div style="margin: 0 20px">共 {{page.pageNum}} 页</div>
        <div style="margin: 0 10px 0 0">到第</div>
        <a-input-number
          style="width: 50px"
          @keyup.enter.native="pageJump(page.jumpPage)"
          v-model="page.jumpPage"
        ></a-input-number>
        <div style="margin: 0 20px 0 10px">页</div>
        <a-button type="primary" @click="pageJump(page.jumpPage)">确定</a-button>
      </div>
    </div>
    <!--      分隔线-->
    <a-divider />

    <div>
      <div class="select-container">
        <div class="title">影响环节</div>
        <!--        disabled="selectType === 'edit' ? true :false"-->
        <a-select
          v-if="selectType === 'edit'"
          placeholder="请选择影响环节"
          disabled
          v-model="optionSelect.taskStatus"
          style="width: 200px"
          @change="selectSheetChange"
        >
          <template v-if="selectOptions.task_status_select.length">
            <!--            <a-select-option v-for="data in option.trial_segment" :key="data.key">-->
            <a-select-option
              v-for="data in selectOptions.task_status_select"
              :key="data.value"
            >{{ data.text }}</a-select-option>
          </template>
        </a-select>

        <a-select
          v-if="!selectType || selectType === 'check'"
          :disabled="isObjectEmpty(selectSheetRow)"
          placeholder="请选择影响环节"
          v-model="optionSelect.taskStatus"
          style="width: 200px"
          @change="selectSheetChange"
        >
          <template v-if="selectOptions.task_status_select.length">
            <!--            <a-select-option v-for="data in option.trial_segment" :key="data.key">-->
            <a-select-option
              v-for="data in selectOptions.task_status_select"
              :key="data.value"
            >{{ data.text }}</a-select-option>
          </template>
        </a-select>
      </div>

      <!--      过程指令要求-->
      <div class="title">过程指令要求：</div>
      <a-textarea
        :disabled="selectType === 'check'"
        v-model="processOrderRequire"
        placeholder="请输入过程指令要求"
        :rows="4"
      />
    </div>

    <div class="bottom-btn-group flex-center">
      <a-button
        v-if="!selectType"
        :disabled="(this.isObjectEmpty(this.selectSheetRow) || !this.optionSelect.taskStatus || !this.processOrderRequire)"
        type="primary"
        @click="sureSubmit"
      >提交</a-button>
      <a-button
        v-if="selectType === 'edit'"
        :disabled="(!this.optionSelect.taskStatus || !this.processOrderRequire)"
        type="primary"
        @click="sureSubmit"
      >提交</a-button>
      <a-button @click="cancelSubmit">取消</a-button>
    </div>

    <!--    戴卡部件号弹窗组件-->
    <project-information ref="projectInfor"></project-information>
    <ship-notice-info ref="shipnoticeInfo"></ship-notice-info>
    <a-modal v-model="deliveryVisible2" title="流转单现阶段详情" :footer="null" width="800px">
      <div v-if="deliveryVisible2">
        <view-details
          :id="deliverychoose_id"
          @close="deliveryVisible2 = false;deliverychoose_shippingFlowSheet = '';deliverychoose_id = null"
          :iShow="true"
          :shippingFlowSheet="deliverychoose_shippingFlowSheet"
        ></view-details>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import {
  getShipFormBaseList,
  postShipInstructionList,
  postEditShipInstructionList,
  getShipInstructionById,
  getProcessTreeTwo,
  getDictItemsFromCache
} from '@api/api'
import store from '@/store/'
import ProjectInformation from '../system/ProjectInformation'
import ShipNoticeInfo from '@views/shipManage/ShipNoticeInfo'
import viewDetails from '@/views/shipment/viewDetails'
export default {
  name: 'InstructionEditShip',
  inject: ['closeCurrent'],
  components: { ProjectInformation, ShipNoticeInfo, viewDetails },
  data() {
    return {
      pageStatus: '',
      deliveryVisible2: false,
      deliverychoose_id: null,
      deliverychoose_shippingFlowSheet: '',
      selectId: 0, // 路由id
      selectType: '', // 如果有 type 是 edit 或者 check

      option: {
        // 下拉框选项
        sheet: [
          // 发运流转单编号检索 上
          { label: '按发运流转单号查询', key: 0 },
          { label: '按戴卡部件号查询', key: 1 }
        ],
        // trial_segment: [], // 试制环节数据字典 下左
        // process: [], // 二级工序名称 下右
        // form_task_plan_status: [], // 试制状态 行内表格
        task_status: []
        // purpose:[],
      },
      selectOptions: {
        task_status_select: []
      },

      optionSelect: {
        // 下拉框绑定值
        sheet: undefined, // 发运流转单编号检索
        // trialSegment: undefined, // 试制环节
        taskStatus: undefined
        // process: undefined, // 工序
      },
      sheetInput: '', //
      shipmentManagementIdRecover: '',

      // 表格
      columns: [
        // 表头

        // { title: '主键', dataIndex: 'id', width: 150, align: 'center', hidden:true },
        {
          title: '发运流转单号',
          dataIndex: 'shippingFlowSheet',
          width: 200,
          align: 'center',
          scopedSlots: { customRender: 'shippingFlowSheet' }
        },
        {
          title: '戴卡订单号',
          dataIndex: 'customerOrder',
          width: 150,
          align: 'center'
        },
        {
          title: '戴卡部件号',
          dataIndex: 'wheelShape',
          width: 150,
          align: 'center',
          scopedSlots: { customRender: 'projectNumber' }
        },
        // { title: '用途', dataIndex: 'purpose', width: 150, align: 'center' },
        { title: '发运数量', dataIndex: 'sendNumber', width: 150, align: 'center' },
        { title: '流转单状态', dataIndex: 'influenceProcessText', width: 150, align: 'center' }
      ],
      dataSource: [], // 数据
      selectSheetRow: {}, // 选中上方表格行

      // 分页
      page: {
        // 分页
        total: 0, // 共多少条
        pageSize: 5, // 一页多少条
        pageNum: 0, // 共多少页
        currentPage: 1, // 当前页
        jumpPage: 1 // 跳转到第几页,
      },

      // splitData: [],
      // selectSplitRow: {}, // 选中下方表格行

      // isSpecial: false, // 是否是特殊表头
      // tableTitle: '', // 表头

      processOrderRequire: '', // 过程指令要求

      recoverData: false // 是否禁用submitBtn
    }
  },

  mounted() {
    this.selectId = Number(this.$route.query.id)
    this.selectType = this.$route.query.type
    this.getDic()
    switch (this.selectType) {
      case 'check':
        this.recoverCheckById()
        break
      case 'edit':
        this.searchQuery()
        this.recoverCheckById()
        break
      case undefined:
        this.searchQuery() // 获取列表信息
        break
    }
  },

  methods: {
    // 查看界面 回复数据
    recoverCheckById() {
      getShipInstructionById({ id: this.selectId }).then(data => {
        // 获取二级 option 列表
        if (data) {
          // data = data.result;
          this.recoverData = data
          this.processOrderRequire = data.processOrderRequire
          this.optionSelect.taskStatus = data.influenceProcess.toString()
          this.shipmentManagementIdRecover = data.shipmentManagementId
          // this.optionSelect.trialSegment = data.aopTrialSegment;
          // this.optionSelect.process = data.processName;

          // for (let i = 0; i < this.option.trial_segment.length; i++) {
          //   if (this.option.trial_segment[i].text === data.aopTrialSegment) {
          //     this.optionSelect.trialSegment = Number(this.option.trial_segment[i].value);
          //   }
          // }
          // for (let i = 0; i < this.option.process.length; i++) {
          //   if (this.option.process[i].name === data.processName) {
          //     console.log('this.option.process[i].id', this.option.process[i].id);
          //   }
          // }
        }
      })
    },

    resetSelect() {
      // 重置选中项
      this.selectSheetRow = {}
      // this.selectSplitRow = {};
      // this.splitData = [];
      // this.optionSelect.trialSegment = undefined;
      // this.optionSelect.process = undefined;
      // this.
    },

    isObjectEmpty(object) {
      // 判断对象是否为空
      return JSON.stringify(object) === '{}'
    },

    returnOptionLabel(value, type) {
      for (let i = 0; i < this.option[type].length; i++) {
        let item = this.option[type][i]
        switch (type) {
          case 'trial_segment':
            if (Number(value) === Number(item.value)) return item.text
            break
          case 'form_task_plan_status':
            if (Number(value) === Number(item.value)) return item.text
            break
          case 'process':
            if (Number(value) === Number(item.id)) return item.name
            break
        }
      }

      // return option.label.replace(/\ /g, '').replace(/\s/g, '');
    },

    getDic() {
      // 获取表单中的部分字段对应的字典
      for (let name in this.option) {
        if (getDictItemsFromCache(name)) {
          // 从缓存中取dic
          this.option[name] = getDictItemsFromCache(name)
        }
      }
      this.selectOptions.task_status_select = this.option.task_status
      this.option.task_status_1 = []
      this.option.task_status_2 = []
      let list_1 = [0, 2, 3, 5]
      let list_2 = [11]
      this.option.task_status.forEach(item => {
        if (list_1.indexOf(Number(item.value)) !== -1) {
          this.option.task_status_1.push(item)
        } else if (list_2.indexOf(Number(item.value)) !== -1) {
          this.option.task_status_2.push(item)
        }
      })
      console.log(this.option.task_status_1, this.option.task_status_2)
      // getProcessTreeTwo('').then((data) => { // 获取二级 option 列表
      //   if (data.success) {
      //     this.option.process = data.result;
      //   } else {
      //     this.$message.error(data.message);
      //   }
      // });
    },

    // 试制流转单信息 查询表单
    searchQuery(reset = false) {
      // 查询信息列表 reset代表是否重置页码
      if (reset) {
        // 如果需要重置，比如有了新的筛选条件
        this.page.currentPage = 1
      }
      let param = {
        // pageNo: this.page.currentPage, // 当前页码
        // pageSize: this.page.pageSize, // 页大小
        userId: store.getters.userInfo.id
      }
      if (this.optionSelect.sheet && this.optionSelect.sheet.key === 0) {
        param.shippingFlowSheet = this.sheetInput
      } else if (this.optionSelect.sheet && this.optionSelect.sheet.key === 1) {
        param.wheelShape = this.sheetInput
      }

      getShipFormBaseList(param, this.page.currentPage, this.page.pageSize).then(data => {
        this.resetSelect()
        this.dataSource = []
        if (data.success) {
          this.page.total = data.count
          this.page.pageNum = Math.ceil(data.count / this.page.pageSize)
          data = data.result
          console.log('data', data)
          this.dataSource = JSON.parse(JSON.stringify(data))
          for (let i = 0; i < this.dataSource.length; i++) {
            // 遍历返回的数据列表
            for (let j = 0; j < this.option['task_status'].length; j++) {
              if (Number(this.dataSource[i].influenceProcess) === Number(this.option['task_status'][j].value)) {
                // 找到value相等时对应的label
                this.dataSource[i].influenceProcessText = this.option['task_status'][j].text
              }
            }
          }

          // this.page.pageSize = data.size;
          // this.page.pageNum = data.pages;
        } else {
          this.$message.error(data.message)
        }
      })
    },

    //   getTrialFormBaseList(param).then((data) => {
    //     this.resetSelect();
    //     if (data.success) {
    //       data = data.result;
    //       this.dataSource = data.records;
    //
    //       this.page.total = data.total;
    //       this.page.pageSize = data.size;
    //       this.page.pageNum = data.pages;
    //     } else {
    //       this.$message.error(data.message);
    //     }
    //   });
    // },
    // 上方表格行点击事件
    sheetRowClick(record) {
      return {
        on: {
          click: () => {
            this.selectSheetRow = record
            this.optionSelect.taskStatus = ''

            // 方法一
            // this.selectOptions.task_status_select = this.option.task_status.filter(item => {
            //   return (
            //     Number(item.value) >= Number(this.selectSheetRow.influenceProcess) &&
            //     Number(item.value) < Number(this.option.task_status.length - 1)
            //   )
            // })
            // 方法二
            //  0：是 1：否
            if (record.isItRunner == '1') {
              this.selectOptions.task_status_select = this.option.task_status_1.filter(item => {
                return (
                  Number(item.value) >= Number(this.selectSheetRow.influenceProcess)
                )
              })
            } else {
              this.selectOptions.task_status_select = this.option.task_status_2.filter(item => {
                return (
                  Number(item.value) >= Number(this.selectSheetRow.influenceProcess)
                )
              })
            }
          }
        },
        style: {
          'background-color': record === this.selectSheetRow ? '#e6f7ff' : 'white'
        }
      }
    },

    // 分页
    pageChange(val) {
      // 分页改变
      this.page.currentPage = val
      this.searchQuery()
    },

    pageJump(page) {
      // 点击指定分页跳转的情况下
      if (page > this.page.pageNum) {
        page = this.page.pageNum
        this.page.jumpPage = this.page.pageNum
      } else if (page < 1) {
        page = 1
        this.page.jumpPage = 1
      }
      this.page.currentPage = page
      this.searchQuery()
    },

    selectSheetChange(option) {
      console.log('option', option)
    },

    showShipDetail(operate, index) {
      // this.$refs.projectInfor.getData(operate.id);
      // this.$refs.shipnoticeInfo.getShipData(operate.shippingFlowSheet);
      this.deliveryVisible2 = true
      // 2.选中该条的流转单id
      this.deliverychoose_id = operate.shipmentManagementId
      // 3.选中该条的流转单号
      this.deliverychoose_shippingFlowSheet = operate.shippingFlowSheet
    },

    showProjectDetail(operate, index) {
      //缺id
      this.$refs.projectInfor.getData(operate.projectId)
    },

    returnCommonData(dataArr, title) {
      if (dataArr) {
        for (let i = 0; i < dataArr.length; i++) {
          if (dataArr[i].planType && dataArr[i].planType === title) {
            return [dataArr[i]]
          }
        }
      }
    },

    returnStatus(value) {
      for (let i = 0; i < this.dic.form_task_plan_status.length; i++) {
        let item = this.dic.form_task_plan_status[i]
        if (Number(value) === Number(item.value)) return item.text
      }
    },

    jumpFormBaseNo() {
      this.$message.warning('功能尚未开发！')
    },

    // 底部按钮组
    sureSubmit() {
      // 提交

      let param = {
        id: '',
        influenceProcess: this.optionSelect.taskStatus,
        processOrderRequire: this.processOrderRequire
        // shipmentManagementId: ""
      }

      if (!this.selectType) {
        if (this.selectSheetRow) {
          param.shipmentManagementId = this.selectSheetRow.shipmentManagementId.toString() // 上面表格选中行id
        }
        postShipInstructionList(param).then(data => {
          if (data.success) {
            this.$message.destroy()
            this.$message.success('提交成功！')
            setTimeout(() => {
              this.cancelSubmit()
            }, 1000)
          } else {
            this.$message.destroy()
            this.$message.error(data.message)
          }
        })

        // if (!this.isObjectEmpty(this.selectSplitRow)) {
        //   param.taskWorkSplitId = this.selectSplitRow.id;
        // }
      } else if (this.selectType === 'edit') {
        param.id = this.recoverData.id.toString()
        // param.formBaseId = this.isObjectEmpty(this.selectSheetRow) ? this.recoverData.formBaseId : this.selectSheetRow.id; // 上方选中表格是否有更改 有 用新的 ；无 用旧的
        // if (!this.isObjectEmpty(this.selectSplitRow)) { // 如果下方表格有更新
        //   param.taskWorkSplitId = this.selectSplitRow.id;
        // } else if (this.recoverData.taskWorkSplitId) { // 如果原来有 下方表格记录 就用原来的
        //   param.taskWorkSplitId = this.taskWorkSplitId.id;
        // }
        param.shipmentManagementId = this.shipmentManagementIdRecover.toString()
        if (this.selectSheetRow && this.selectSheetRow.shipmentManagementId !== undefined) {
          param.shipmentManagementId = this.selectSheetRow.shipmentManagementId.toString() // 上面表格选中行id
        }
        postEditShipInstructionList(param).then(data => {
          if (data.success) {
            this.$message.destroy()
            this.$message.success('编辑成功！')
            setTimeout(() => {
              this.cancelSubmit()
            }, 1000)
          } else {
            this.$message.destroy()
            this.$message.error(data.message)
          }
        })
      }

      // postTrialInstructionList(param).then((data) => { // 获取二级 option 列表
      //   if (data.success) {
      //     this.$message.destroy();
      //     this.$message.success(this.selectType === 'edit' ? '编辑成功！' : '提交成功！');
      //     setTimeout(() => {
      //       this.cancelSubmit();
      //     }, 1000);
      //   } else {
      //     this.$message.destroy();
      //     this.$message.error(data.message);
      //   }
      // });
    },

    cancelSubmit() {
      this.closeCurrent()
      this.$router.push({
        path: `/shipInstructionManage/instructionShipList`
      })
    }
  }
}
</script>

<style scoped lang="less">
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.instruction-title {
  margin: 20px;
  font-size: 18px;
  font-weight: bold;
}

.title {
  font-size: 14px;
  margin: 10px 0 10px 0;
}

.table-title {
  background: #f2f2f2;
  width: 200px;
  height: 40px;
  /*margin: 10px 0;*/
}

.select-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 50px;
  width: 100%;

  & * {
    margin-right: 20px;
  }
}

.bottom-page {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
}

.bottom-btn-group {
  width: 100%;
  height: 100px;

  & * {
    margin: 0 20px;
  }
}
</style>