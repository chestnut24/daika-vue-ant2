<template>
  <a-spin :spinning="spinning">
    <div class="container jn-public-table jn-public-table-other">
      <div class="top-container">
        <div class="top-title" v-if="!selectId">新建试制流转过程指令</div>
        <div class="top-title" v-else-if="selectType === 'edit'">编辑试制流转过程指令</div>
        <div class="top-title" v-else-if="selectType === 'check'">查看试制流转过程指令</div>
      </div>
      <img src="../../assets/order/stripe.png" height="12" width="1065"/>
      <a-card :bordered="false">
        <div v-if="selectType !== 'check'">
          <div class="part-title" style="margin-top: 0">
            <div class="blue-stripe"></div>
            <span>试制流转单信息检索</span>
          </div>
          <div class="select-container">
            <a-select
              labelInValue
              placeholder="请选择检索条件"
              v-model="optionSelect.sheet"
              style="width: 244px"
              @change="selectSheetChange"
            >
              <a-select-option v-for="data in option.sheet" :key="data.key">
                {{ data.label }}
              </a-select-option>
            </a-select>
            <a-input style="width: 244px" v-model="sheetInput" placeholder="请输入检索内容"></a-input>
            <a-button type="primary" @click="searchQuery(true)">检索</a-button>
          </div>

          <div class="part-title">
            <div class="blue-stripe"></div>
            <span>试制流转单信息</span>
          </div>

          <!--      试制流转单信息表格-->
          <a-table
            ref="table"
            size="middle"
            bordered
            :columns="columns"
            :dataSource="dataSource"
            :customRow="sheetRowClick"
            :pagination=false>
            <a-space slot="projectNumber" slot-scope="text, operate, i">
              <a-button type="link" @click.stop="showProjectDetail(operate, i)">{{ text }}</a-button>
            </a-space>
          </a-table>

          <!--    分页-->
          <div class="bottom-page">
            <a-pagination
              :total=page.total
              :show-total="total => `共 ${total} 条`"
              :page-size=page.pageSize
              :current="page.currentPage"
              @change="pageChange"
            />
            <div style="margin: 0 20px">共 {{page.pageNum}} 页</div>
            <div style="margin: 0 10px 0 0">到第</div>
            <a-input-number style="width: 50px" @keyup.enter.native="pageJump(page.jumpPage)"
                            v-model="page.jumpPage"></a-input-number>
            <div style="margin: 0 20px 0 10px">页</div>
            <a-button type="primary" @click="pageJump(page.jumpPage)">确定</a-button>
          </div>
        </div>
        <div class="part-title">
          <div class="blue-stripe"></div>
          <span>影响环节</span>
        </div>
        <div class="select-container">
          <a-select
            v-if="selectType === 'edit'"
            placeholder="请选择试制环节"
            v-model="optionSelect.trialSegment"
            style="width: 244px"
            @change="selectSheetChange"
          >
            <template v-if="option.trial_segment.length">
              <!--            <a-select-option v-for="data in option.trial_segment" :key="data.key">-->
              <a-select-option v-for="data in option.trial_segment" :key="data.text">
                {{ data.text }}
              </a-select-option>
            </template>
          </a-select>
          <a-select
            v-if="!selectType || selectType === 'check'"
            :disabled="isObjectEmpty(selectSheetRow)"
            placeholder="请选择试制环节"
            v-model="optionSelect.trialSegment"
            style="width: 244px"
            @change="selectSheetChange"
          >
            <template v-if="option.trial_segment.length">
              <!--            <a-select-option v-for="data in option.trial_segment" :key="data.key">-->
              <a-select-option v-for="data in option.trial_segment" :key="data.text">
                {{ data.text }}
              </a-select-option>
            </template>
          </a-select>
          <a-select
            v-if="selectType === 'edit'"
            placeholder="请选择工序"
            v-model="optionSelect.process"
            style="width: 244px"
          >
            <!--          <a-select-option v-for="data in option.process" :key="data.id">-->
            <a-select-option v-for="data in option.process" :key="data.name">
              {{ data.name }}
            </a-select-option>
          </a-select>
          <a-select
            v-if="!selectType || selectType === 'check'"
            :disabled="isObjectEmpty(selectSheetRow)"
            placeholder="请选择工序"
            v-model="optionSelect.process"
            style="width: 244px"
          >

            <!--          @change="selectProcessChange"-->
            <!--          <a-select-option v-for="data in option.process" :key="data.id">-->
            <a-select-option v-for="data in option.process" :key="data.name">
              {{ data.name }}
            </a-select-option>
          </a-select>
          <a-button v-if="!selectType"
                    :disabled="isObjectEmpty(selectSheetRow) || optionSelect.trialSegment === '试制执行' ? false : true"
                    type="primary" @click="querySplitList()">检索
          </a-button>
          <a-button v-if="selectType === 'edit'" type="primary" @click="querySplitList()">检索</a-button>
        </div><!--        下方表格-->
        <a-table
          v-if="splitData.length"
          ref="preTab"
          size="middle"
          bordered
          :columns="splitColumns"
          :dataSource="splitData"
          :customRow="splitRowClick"
          :pagination=false>
          <!--        <template slot="formBaseNo" slot-scope="text, formBaseNo, i">-->
          <!--          <span><a-button type="link" @click.stop="jumpFormBaseNo">{{ text }}</a-button></span>-->
          <!--        </template>-->

          <!--      有一列时-->
          <template slot="spColumn1" slot-scope="text, spColumn1, i">
        <span v-if="tableTitle === '压铸'">
<!--          <a-button type="link" @click="jumpPlan()">{{ spColumn1.trialProductionTaskPlanCast && returnStatus(spColumn1.trialProductionTaskPlanCast.planStatus) }}</a-button><br>-->
          {{ spColumn1.trialProductionTaskPlanCast && returnStatus(spColumn1.trialProductionTaskPlanCast.planStatus) }}<br>
          <span>{{ spColumn1.trialProductionTaskPlanCast && spColumn1.trialProductionTaskPlanCast.planName }}</span><br>
          <span>{{ spColumn1.trialProductionTaskPlanCast && spColumn1.trialProductionTaskPlanCast.planTime | dayMoment }}</span>
        </span>
            <span v-if="tableTitle === '热处理'">
<!--          <a-button type="link" @click="jumpPlan()">{{ spColumn1.trialProductionTaskPlanHeat && returnStatus(spColumn1.trialProductionTaskPlanHeat.planStatus) }}</a-button><br>-->
          {{ spColumn1.trialProductionTaskPlanHeat && returnStatus(spColumn1.trialProductionTaskPlanHeat.planStatus) }}<br>
          <span>{{ spColumn1.trialProductionTaskPlanHeat && spColumn1.trialProductionTaskPlanHeat.planName }}</span><br>
          <span>{{ spColumn1.trialProductionTaskPlanHeat && spColumn1.trialProductionTaskPlanHeat.planTime | dayMoment }}</span>
        </span>
            <span v-if="tableTitle === '粗车'">
<!--          <a-button type="link" @click="jumpPlan()">{{ spColumn1.trialProductionTaskPlanMachine && returnStatus(spColumn1.trialProductionTaskPlanMachine.planStatus) }}</a-button><br>-->
          {{ spColumn1.trialProductionTaskPlanMachine && returnStatus(spColumn1.trialProductionTaskPlanMachine.planStatus) }}<br>
          <span>{{ spColumn1.trialProductionTaskPlanMachine && spColumn1.trialProductionTaskPlanMachine.planName }}</span><br>
          <span>{{ spColumn1.trialProductionTaskPlanMachine && spColumn1.trialProductionTaskPlanMachine.planTime | dayMoment }}</span>
        </span>
            <span v-if="tableTitle === '精车'">
<!--          <a-button type="link" @click="jumpPlan()">{{ spColumn1.trialProductionTaskPlanTechnology && returnStatus(spColumn1.trialProductionTaskPlanTechnology.planStatus) }}</a-button><br>-->
          {{ spColumn1.trialProductionTaskPlanTechnology && returnStatus(spColumn1.trialProductionTaskPlanTechnology.planStatus) }}><br>
          <span>{{ spColumn1.trialProductionTaskPlanTechnology && spColumn1.trialProductionTaskPlanTechnology.planName }}</span><br>
          <span>{{ spColumn1.trialProductionTaskPlanTechnology && spColumn1.trialProductionTaskPlanTechnology.planTime | dayMoment }}</span>
        </span>
            <span v-if="tableTitle === '喷涂'">
          <template v-for="data in returnCommonData(spColumn1.trialProductionTaskPlanCommonList, '试制档案')">
<!--            <a-button type="link" @click="jumpPlan()">{{ returnStatus(data.planStatus) }}</a-button><br>-->
            {{ returnStatus(data.planStatus) }}<br>
            <span>{{ data.planName }}</span><br>
            <span>{{ data.planTime | dayMoment }}</span>
          </template>
        </span>
            <span v-else>
          <template v-for="data in returnCommonData(spColumn1.trialProductionTaskPlanCommonList, tableTitle)">
<!--            <a-button type="link" @click="jumpPlan()">{{ returnStatus(data.planStatus) }}</a-button><br>-->
            {{ returnStatus(data.planStatus) }}<br>
            <span>{{ data.planName }}</span><br>
            <span>{{ data.planTime | dayMoment }}</span>
          </template>
        </span>
          </template>

          <!--      有两列时-->
          <template slot="spColumn2" slot-scope="text, spColumn2, i">

        <span v-if="tableTitle === '压铸'">
<!--          <a-button type="link" @click="jumpPlan()">{{ spColumn2.trialProductionTaskPlanCastx && returnStatus(spColumn2.trialProductionTaskPlanCastx.planStatus) }}</a-button><br>-->
          {{ spColumn2.trialProductionTaskPlanCastx && returnStatus(spColumn2.trialProductionTaskPlanCastx.planStatus) }}<br>
          <span>{{ spColumn2.trialProductionTaskPlanCastx && spColumn2.trialProductionTaskPlanCastx.planName }}</span><br>
          <span>{{ spColumn2.trialProductionTaskPlanCastx && spColumn2.trialProductionTaskPlanCastx.planTime | dayMoment }}</span>
        </span>
            <span v-if="tableTitle === '粗车'">
          <template v-for="data in returnCommonData(spColumn2.trialProductionTaskPlanCommonList, '气密平衡')">
<!--            <a-button type="link" @click="jumpPlan()">{{ returnStatus(data.planStatus) }}</a-button><br>-->
            {{ returnStatus(data.planStatus) }}<br>
            <span>{{ data.planName }}</span><br>
            <span>{{ data.planTime | dayMoment }}</span>
          </template>
        </span>
          </template>

          <!--      有三列时-->
          <template slot="spColumn3" slot-scope="text, spColumn3, i">
        <span v-if="tableTitle === '粗车'">
          <template v-for="data in returnCommonData(spColumn3.trialProductionTaskPlanCommonList, '三坐标')">
<!--            <a-button type="link" @click="jumpPlan()">{{ returnStatus(data.planStatus) }}</a-button><br>-->
            {{ returnStatus(data.planStatus) }}<br>
            <span>{{ data.planName }}</span><br>
            <span>{{ data.planTime | dayMoment }}</span>
          </template>
        </span>
          </template>
        </a-table>
        <div class="part-title">
          <div class="blue-stripe"></div>
          <span>过程指令要求</span>
        </div>
        <a-textarea :disabled="selectType === 'check'" v-model:value="processRequest" placeholder="请输入过程指令要求"
                    :rows="4"/>
        <div class="bottom-btn-group flex-center">
<!--          <a-button type="primary" @click="test">test</a-button>-->
          <a-button
            v-if="!selectType"
            :disabled="submitDisabled || (this.isObjectEmpty(this.selectSheetRow) || !this.optionSelect.process || !this.optionSelect.trialSegment
        || !this.processRequest) || (splitData.length !== 0 && this.isObjectEmpty(this.selectSplitRow))"
            type="primary" @click="sureSubmit">提交
          </a-button>
          <a-button
            v-if="selectType === 'edit'"
            :disabled="submitDisabled || (!this.optionSelect.process || !this.optionSelect.trialSegment || !this.processRequest) || (splitData.length !== 0 && this.isObjectEmpty(this.selectSplitRow))"
            type="primary" @click="sureSubmit">提交
          </a-button>
          <a-button @click="cancelSubmit">取消</a-button>
        </div>
      </a-card>
      <project-information ref="projectInfor"></project-information>
    </div>
  </a-spin>
</template>

<script>

  import {
    getProcessInstructionList,
    getTrialInstructionList,
    getTrialFormBaseList,
    getTrialSplitInstruction,
    postTrialInstructionList,
    getTrialInstructionById,
    getProcessTreeTwo,
    getDictItemsFromCache,
  } from '@/api/api';
  import ProjectInformation from '../system/ProjectInformation';

  export default {
    name: 'InstructionEdit',
    inject: ['closeCurrent'],
    components: { ProjectInformation },
    data() {
      return {
        spinning: false,
        submitDisabled: false, // 一上来可以点击，点击提交后不可点击
        selectId: 0, // 路由id
        selectType: '', // 如果有 type 是 edit 或者 check

        option: { // 下拉框选项
          sheet: [ // 发运流转单编号检索 上
            { label: '按试制流转单号查询', key: 0 },
            { label: '按戴卡部件号查询', key: 1 },
          ],
          trial_segment: [], // 试制环节数据字典 下左
          process: [], // 二级工序名称 下右
          form_task_plan_status: [], // 试制状态 行内表格
        },
        fixTrialSegment: [ // 写死固定的下拉框
          { text: '试制工艺维护', value: '' },
          { text: '试制预排', value: '' },
          { text: '车间试制策划', value: '' },
          { text: '试制执行', value: '' },
        ],
        optionSelect: { // 下拉框绑定值
          sheet: undefined, // 发运流转单编号检索
          trialSegment: undefined, // 试制环节
          process: undefined, // 工序
        },
        sheetInput: '', //

        // 请求参数
        queryParam: {
          trialProductionFormNo: '', // 试制单编号
          projectNo: '', // 戴卡部件号
          orderNo: '', // 订单号
        },
        // 试制流转单信息 表格
        columns: [ // 表头

          // { title: '主键', dataIndex: 'id', width: 150, align: 'center', hidden:true },
          { title: '试制流转单号', dataIndex: 'trialProductionFormNo', width: 200, align: 'left' },
          {
            title: '戴卡部件号', dataIndex: 'projectNo', width: 150, align: 'left',
            scopedSlots: { customRender: 'projectNumber' },
          },
          { title: '试制数量', dataIndex: 'planRoughcastNum', width: 150, align: 'left' },
          { title: '流转单状态', dataIndex: 'trialSegment', width: 150, align: 'left' },
        ],
        dataSource: [], // 数据
        selectSheetRow: {}, // 选中上方表格行

        // 分页
        page: { // 分页
          total: 0, // 共多少条
          pageSize: 5, // 一页多少条
          pageNum: 0, // 共多少页
          currentPage: 1, // 当前页
          jumpPage: 1, // 跳转到第几页,
        },

        splitColumns: [ // 下方表格 处理方式同 试制流转单查询-tab4
          { title: '试制流转单', dataIndex: 'formBaseNo', align: 'left', scopedSlots: { customRender: 'formBaseNo' } },
          { title: '工序', dataIndex: 'processTechnology', align: 'left' },
          { title: '子序号', dataIndex: 'subNo', align: 'left' },
          { title: '试制数量', dataIndex: 'trialProductionNumber', align: 'left' },
          { title: '用途', dataIndex: 'purpose', align: 'left' },
          { title: '备注', dataIndex: 'remarks', align: 'left' },
        ],
        splitData: [],
        selectSplitRow: {}, // 选中下方表格行

        specialTitle: ['压铸', '热处理', '粗车', '精车', '喷涂'],
        isSpecial: false, // 是否是特殊表头
        tableTitle: '', // 表头

        processRequest: '', // 过程指令要求

        recoverData: {}, //

      };
    },

    mounted() {
      this.selectId = Number(this.$route.query.id);
      this.selectType = this.$route.query.type;
      this.getDic();
      switch (this.selectType) {
        case 'check' :
          this.recoverCheckById();
          break;
        case 'edit' :
          this.recoverCheckById();
          break;
        case undefined :
          this.searchQuery(); // 获取列表信息
          break;
      }
    },

    methods: {
      test() {
        // this.recoverCheckById();
        // this.searchQuery();
        console.log('recover', this.recoverData);
      },

      // 查看界面 回复数据
      recoverCheckById() {
        getTrialInstructionById({ id: this.selectId }).then((data) => { // 获取二级 option 列表
          if (data.success) {

            if (this.$route.query.no) {
              this.sheetInput = this.$route.query.no;

              this.optionSelect.sheet = {
                key: 0,
                label: `
          按试制流转单号查询
          `,
              };
            }
            data = data.result;
            this.recoverData = data;
            this.processRequest = data.message;
            this.optionSelect.trialSegment = data.aopTrialSegment;
            this.optionSelect.process = data.processName;
            if(this.selectType === 'edit') {
              this.$nextTick( () => {
                this.searchQuery();
              });

            }
          } else {
            this.$message.error(data.message);
          }
        });
      },

      resetSelect() { // 重置选中项
        this.selectSheetRow = {};
        this.selectSplitRow = {};
        this.splitData = [];
        this.optionSelect.trialSegment = undefined;
        this.optionSelect.process = undefined;
        // this.optionSelect.trialSegment = undefined;
        // this.optionSelect.process = undefined;
        // this.
      },

      isObjectEmpty(object) { // 判断对象是否为空
        return JSON.stringify(object) === '{}';
      },

      returnOptionLabel(value, type) {

        for (let i = 0; i < this.option[type].length; i++) {
          let item = this.option[type][i];
          switch (type) {
            case 'trial_segment':
              if (Number(value) === Number(item.value)) return item.text;
              break;
            case 'form_task_plan_status':
              if (Number(value) === Number(item.value)) return item.text;
              break;
            case 'process':
              if (Number(value) === Number(item.id)) return item.name;
              break;
          }
        }

        // return option.label.replace(/\ /g, '').replace(/\s/g, '');
      },

      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.option) {
          if (getDictItemsFromCache(name)) { // 从缓存中取dic
            this.option[name] = getDictItemsFromCache(name);
          }
        }

        for (let i = 0; i < this.fixTrialSegment.length; i++) { // 需要写死这四个属性
          let item = this.fixTrialSegment[i];
          // item.value = this.option.trial_segment[]
          for (let j = 0; j < this.option.trial_segment.length; j++) {
            if (item.text === this.option.trial_segment[j].text) {
              item.value = this.option.trial_segment[j].value;
            }
          }
        }

        this.option.trial_segment = this.fixTrialSegment;

        getProcessTreeTwo('').then((data) => { // 获取二级 option 列表
          if (data.success) {
            this.option.process = data.result;
          } else {
            this.$message.error(data.message);
          }
        });
      },

      // 试制流转单信息 查询表单
      searchQuery(reset = false) { // 查询信息列表 reset代表是否重置页码
        // this.selectSplitRow = {};
        // this.resetSelect();
        if (reset) { // 如果需要重置，比如有了新的筛选条件
          this.page.currentPage = 1;
        }
        let param = {
          pageNo: this.page.currentPage, // 当前页码
          pageSize: this.page.pageSize, // 页大小
        };
        if (this.optionSelect.sheet && this.optionSelect.sheet.key === 0) {
          param.trialProductionFormNo = this.sheetInput;
        } else if (this.optionSelect.sheet && this.optionSelect.sheet.key === 1) {
          param.projectNo = this.sheetInput;
        }
        if (this.$route.query.no) {
          param.trialProductionFormNo = this.$route.query.no;
          // this.optionSelect.sheet.key = 0;
        }

        getProcessInstructionList(param).then((data) => {
          // this.resetSelect();
          if (data.success) {
            data = data.result;
            console.log('data data data', data);
            this.dataSource = data.records;

            this.page.total = data.total;
            this.page.pageSize = data.size;
            this.page.pageNum = data.pages;
            if (this.selectType === 'edit') { // 如果是编辑，就选中经过筛选后的表格的第一列

              for(let i = 0; i < this.dataSource.length; i++) {
                if (this.dataSource[i].id === this.recoverData.formBaseId) {
                  this.selectSheetRow = this.dataSource[i]; // !!!! 复原上方表格id相等的一列
                }
              }

              this.splitData = [];
              this.selectSplitRow = {};
              if (this.optionSelect.trialSegment === '试制执行') {
                this.querySplitList();
              }
            }
          } else {
            this.$message.error(data.message);
          }
        });
      },

      sheetRowClick(record) { // 上方表格行点击事件
        return {
          on: {
            click: () => {
              this.selectSheetRow = record;
              this.splitData = [];
              this.selectSplitRow = {};
            },
          },
          style: {
            'background-color': record === this.selectSheetRow ? '#e6f7ff' : 'white',
          },
        };
      },

      splitRowClick(record) { // 下方表格行点击事件
        return {
          on: {
            click: () => {
              this.selectSplitRow = record;
            },
          },
          style: {
            'background-color': record === this.selectSplitRow ? '#e6f7ff' : 'white',
          },
        };
      },

      // 分页
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

      selectSheetChange(option) {
        console.log('optionSelect.process', this.optionSelect.process);
        console.log('option', option);
        console.log('optionSelect.sheet', this.optionSelect.sheet);
      },

      showProjectDetail(operate, index) {
        this.$refs.projectInfor.getData(operate.projectId);
      },

      // 拆单列表查询
      selectProcessChange() { // 选择工序
        // this.tableTitle = this.returnOptionLabel(this.optionSelect.trialSegment, 'trial_segment');
        this.tableTitle = this.optionSelect.process;
      },

      querySplitList() {
        this.selectSplitRow = {};
        if (!this.optionSelect.trialSegment) {
          this.$message.destroy();
          this.$message.warning('请选择试制环节！');
        } else if (!this.optionSelect.process) {
          this.$message.destroy();
          this.$message.warning('请选择工序！');
        } else if (this.isObjectEmpty(this.selectSheetRow)) {
          this.$message.destroy();
          this.$message.warning('请选择试制流转单信息！');
        } else {
          let param = {
            formBaseId: this.selectSheetRow.id,
            // processTechnology: this.returnOptionLabel(this.optionSelect.process, 'process'),
            // trialSegment: this.returnOptionLabel(this.optionSelect.trialSegment, 'trial_segment'),
            processTechnology: this.optionSelect.process,
            trialSegment: this.optionSelect.trialSegment,
          };
          getTrialSplitInstruction(param).then((data) => { // 获取下面表格
            if (data.success) {
              this.splitData = data.result;
              if (!this.splitData.length) {
                this.$message.destroy();
                this.$message.warning('影响环节列表为空！');
              } else {
                if (this.selectType === 'edit') { // 如果是编辑的话，默认选中复原行
                  for(let i = 0; i < this.splitData.length; i++) {
                    if (this.recoverData.taskWorkSplitId === this.splitData[i].id) {
                      this.selectSplitRow = this.splitData[i]; // 如果下方表格 id相等，便选中该行
                    }
                  }
                }
                this.tableTitle = this.optionSelect.process;
                this.isSpecial = this.isSpecialTitle(this.tableTitle);
                this.splitColumns = [ // 下方表格 处理方式同 试制流转单查询-tab4
                  {
                    title: '试制流转单',
                    dataIndex: 'formBaseNo',
                    align: 'left',
                    scopedSlots: { customRender: 'formBaseNo' },
                  },
                  { title: '工序', dataIndex: 'processTechnology', align: 'left' },
                  { title: '子序号', dataIndex: 'subNo', align: 'left' },
                  { title: '试制数量', dataIndex: 'trialProductionNumber', align: 'left' },
                  { title: '用途', dataIndex: 'purpose', align: 'left' },
                  { title: '备注', dataIndex: 'remarks', align: 'left' },
                ];
                if (this.isSpecial) {
                  switch (this.tableTitle) {
                    case '压铸':
                      this.splitColumns.splice(this.splitColumns.length, 0,
                        {
                          title: '压铸工艺',
                          dataIndex: 'spColumn1',
                          align: 'left',
                          scopedSlots: { customRender: 'spColumn1' },
                        },
                        {
                          title: 'X光机控制要求',
                          dataIndex: 'spColumn2',
                          align: 'left',
                          scopedSlots: { customRender: 'spColumn2' },
                        },
                      );
                      break;
                    case '热处理':
                      this.splitColumns.splice(this.splitColumns.length, 0,
                        {
                          title: '热处理工艺策划',
                          dataIndex: 'spColumn1',
                          align: 'left',
                          scopedSlots: { customRender: 'spColumn1' },
                        },
                      );
                      break;
                    case '粗车':
                      this.splitColumns.splice(this.splitColumns.length, 0,
                        {
                          title: '生产要求',
                          dataIndex: 'spColumn1',
                          align: 'left',
                          scopedSlots: { customRender: 'spColumn1' },
                        },
                        {
                          title: '气密平衡',
                          dataIndex: 'spColumn2',
                          align: 'left',
                          scopedSlots: { customRender: 'spColumn2' },
                        },
                        {
                          title: '三坐标',
                          dataIndex: 'spColumn3',
                          align: 'left',
                          scopedSlots: { customRender: 'spColumn3' },
                        },
                      );
                      break;
                    case '精车':
                      this.splitColumns.splice(this.splitColumns.length, 0,
                        {
                          title: '精车工艺要求',
                          dataIndex: 'spColumn1',
                          align: 'left',
                          scopedSlots: { customRender: 'spColumn1' },
                        },
                      );
                      break;
                    case '喷涂':
                      this.splitColumns.splice(this.splitColumns.length, 0,
                        {
                          title: '试制档案',
                          dataIndex: 'spColumn1',
                          align: 'left',
                          scopedSlots: { customRender: 'spColumn1' },
                        },
                        {
                          title: '试制跟踪',
                          dataIndex: 'spColumn2',
                          align: 'left',
                          scopedSlots: { customRender: 'spColumn2' },
                        },
                      );
                      break;
                  }
                } else {
                  this.splitColumns.splice(this.splitColumns.length, 0,
                    {
                      title: `${this.tableTitle}工艺要求`,
                      dataIndex: 'spColumn1',
                      align: 'left',
                      scopedSlots: { customRender: 'spColumn1' },
                    },
                  );
                }
              }
            } else {
              this.$message.error(data.message);
            }
          });
        }
      },

      isSpecialTitle(title) {
        return (this.specialTitle.indexOf(title) !== -1);
      },

      returnCommonData(dataArr, title) {
        if (dataArr) {
          for (let i = 0; i < dataArr.length; i++) {
            if (dataArr[i].planType && dataArr[i].planType === title) {
              return [dataArr[i]];
            }
          }
        }
      },

      returnStatus(value) {
        for (let i = 0; i < this.option.form_task_plan_status.length; i++) {
          let item = this.option.form_task_plan_status[i];
          if (Number(value) === Number(item.value)) return item.text;
        }
      },

      jumpFormBaseNo() {
        // this.$message.warning('功能尚未开发！');
      },

      // 底部按钮组
      sureSubmit() { // 提交
        this.spinning = true;
        this.submitDisabled = true;
        let param = {
          // aopTrialSegment: this.returnOptionLabel(this.optionSelect.trialSegment, 'trial_segment'), // 环节-下左
          // processName: this.returnOptionLabel(this.optionSelect.process, 'process'), // 工序-下右
          aopTrialSegment: this.optionSelect.trialSegment, // 环节-下左
          processName: this.optionSelect.process, // 工序-下右
          message: this.processRequest, // 指令要求-输入框
        };

        if (!this.selectType) {
          param.formBaseId = this.selectSheetRow.id; // 上面表格选中行id
          if (!this.isObjectEmpty(this.selectSplitRow)) { // 下面表格如果有选中
            param.taskWorkSplitId = this.selectSplitRow.id;
          }
        } else if (this.selectType === 'edit') {
          param.id = this.recoverData.id;
          param.formBaseId = this.isObjectEmpty(this.selectSheetRow) ? this.recoverData.formBaseId : this.selectSheetRow.id; // 上方选中表格是否有更改 有 用新的 ；无 用旧的
          if (!this.isObjectEmpty(this.selectSplitRow)) { // 如果下方表格有更新
            param.taskWorkSplitId = this.selectSplitRow.id;
          } else if (this.recoverData.taskWorkSplitId) { // 如果原来有 下方表格记录 就用原来的
            param.taskWorkSplitId = this.taskWorkSplitId;
          }
        }
        postTrialInstructionList(param).then((data) => { // 获取二级 option 列表
          this.spinning = false;
          if (data.success) {
            this.$message.destroy();
            this.$message.success(this.selectType === 'edit' ? '编辑成功！' : '提交成功！');
            setTimeout(() => {
              this.cancelSubmit();
            }, 500);
          } else {
            this.$message.destroy();
            this.$message.error(data.message);

            this.submitDisabled = false;
          }
        });
      },
      jumpPlan() {
        // this.$message.warning('暂未开发')
      },

      cancelSubmit() {
        this.closeCurrent();
        this.$router.push({
          path: `/trial/instructionList`,
        });
      },
    },
  };
</script>

<style scoped lang="less">
  /*新样式*/
  @import "./../../css/public-table-css";

  .container {
    width: 1064px;
    margin: 16px auto 0 auto;
    display: flex;
    flex-direction: column;

    /deep/ .ant-card-body {
      padding: 24px;
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
  }

  .top-container {
    width: 100%;
    height: 160px;
    background: url("../../assets/shizhiliuzhuandanchuangjian.png") no-repeat;
    background-size: 100% 100%;
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