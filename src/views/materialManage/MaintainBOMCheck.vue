<template>
  <div>
    <!--    维护BOM界面-查看（不可编辑）-->

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
          <span>BOM信息</span>
        </div>
        <table class="msg-container">
          <tr>
            <td class="item-title">BOM版本</td>
            <td class="item-value">
              <a-select
                placeholder="请选择BOM版本"
                v-model="bomParam.version"
                style="width: 100%"
                @change="selectBomVersion"
                :disabled="isCheck"
              >
                <a-select-option v-for="data in option.version" :key="data">
                  {{ data }}
                </a-select-option>
              </a-select>
            </td>
            <td class="item-title">工段</td>
            <td class="item-value">{{ bomParam.taskObject }}</td>
          </tr>
        </table>

        <div class="part-title">
          <div class="blue-stripe"></div>
          <span>BOM信息</span>
        </div>


        <div class="button-group">
          <a-button icon="import" @click="projectImport" :disabled="isCheck">项目导入</a-button>
          <a-button icon="import" @click="fileImport" :disabled="isCheck">文件导入</a-button>
        </div>

        <!--        底部表格-->
        <div class="list-container">
          <a-table
            :dataSource="bomData"
            :columns="bomColumns"
            bordered
            :pagination=false
            :scroll = "{x: true}"
            class="bom-table"
          >
            <template slot="materialDescription" slot-scope="text, record">
              <a-auto-complete
                v-model="searchValue"
                :data-source="selectOptions"
                style="width: 200px"
                placeholder="请输入物料描述"
                @select="onSelect"
                @search="onSearch"
                @change="onChange"
                :dropdown-match-select-width="false"
                :dropdown-style="{ width: '800px' }"
                v-if="record.editable"
              ></a-auto-complete>
              <template v-else>
                {{ record.materialDescription }}
              </template>
            </template>
            <template slot="materialName" slot-scope="text, record">
              <a-input
                placeholder="请输入规格型号"
                v-if="record.editable"
                :value="record.materialName"
                v-model="editInput.materialName"
              />
              <template v-else>
                {{record.materialName}}
              </template>
            </template>
            <template slot="specifications" slot-scope="text, record">
              <a-input
                placeholder="请输入规格型号"
                v-if="record.editable"
                :value="record.specifications"
                v-model="editInput.specifications"
              />
              <template v-else>
                {{record.specifications}}
              </template>
            </template>
            <template slot="dosage" slot-scope="text, record">
              <a-input
                placeholder="请输入用量"
                v-if="record.editable"
                :value="record.dosage"
                v-model="editInput.dosage"
              />
              <template v-else>
                {{record.dosage}}
              </template>
            </template>
            <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
              <a-button type="link" @click="editBom(operate, i)" v-if="!operate.editable" :disabled="isCheck">编辑
              </a-button>
              <a-button type="link" @click="deleteSureModal(i)" v-if="!operate.editable" :disabled="isCheck">删除</a-button>
              <a-button type="link" @click="saveBom(operate, i)" v-if="operate.editable" :disabled="isCheck">保存</a-button>
              <a-button type="link" @click="backBom(operate, i)" v-if="operate.editable" :disabled="isCheck">返回</a-button>
            </a-space>
          </a-table>
        </div>
        <div class="editable-add-btn" :class="!isCheck ? 'editable-add-btn-edit' : ''">
          <a-button  @click="addBom" :disabled="isCheck">添加物料</a-button>
        </div>
        <div class="bottom-button-group">
          <a-button class="bottom-button" type="primary" @click="submitProject(1)" :disabled="isCheck || isEditing">保存草稿
          </a-button>
          <a-button class="bottom-button" type="primary" @click="submitProject(2)" :disabled="isCheck || isEditing">提交
          </a-button>
          <a-button class="bottom-button" @click="returnMaintainList">
            <a-icon type="left"/>
            返回
          </a-button>
        </div>
      </a-card>

    </div>

    <!--    项目导入弹窗-->
    <a-modal
      :visible="projectSelectVisible"
      title="项目选择框"
      width="900px"
      ok-text="确认"
      cancel-text="取消"
      @ok="sureSelect"
      @cancel="cancelProjectImport">
      <div class="search-frame">

        <a-row type="flex" align="middle" :gutter="[0,16]">
          <a-col :md="3" :sm="4" class="flex-left">
            <div>戴卡部件号:</div>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-input v-model:value="projectParam.projectNumber" placeholder="戴卡部件号"></a-input>
          </a-col>
          <a-col :md="3" :sm="4" class="flex-left">
            <div>当前工段:</div>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-input disabled v-model:value="projectParam.toolStep" placeholder="请输入当前工段"></a-input>
          </a-col>
          <a-col :md="2" :sm="8">
            <a-button type="primary" @click="searchProjectQuery(true)" style="margin-right: 50px">查询</a-button>
          </a-col>
        </a-row>
        <a-row type="flex" align="middle" :gutter="[0,16]">
          <a-col :md="3" :sm="4" class="flex-left">
            <div>项目经理:</div>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-input v-model:value="projectParam.projectManager" placeholder="请输入项目经理"></a-input>
          </a-col>
          <a-col :md="3" :sm="4" class="flex-left">
            <div>车型平台:</div>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-input v-model:value="projectParam.vehiclePlatform" placeholder="请输入当前车型平台"></a-input>
          </a-col>
        </a-row>

      </div>
      <div class="search-table jn-public-table jn-public-table-other">
        <div style="margin-bottom: 20px">
          <div class="part-title">
            <div class="blue-stripe"></div>
            <span>项目列表</span>
          </div>
        </div>
        <div class="mould-frame-down">
          <a-table
            bordered
            :pagination=false
            :columns="projectColumns"
            :dataSource="projectData"
            rowKey="id"
            :rowSelection="{ selectedRowKeys: selectedRowKeysArray, onChange: onSelectChange, type: 'radio' }"
            :customRow="selectProjectRow"
          />
        </div>
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
          <a-button @click="pageJump(page.jumpPage)">跳转</a-button>
        </div>
      </div>
    </a-modal>

    <!--    确认删除弹窗-->
    <a-modal
      :visible="deleteVisible"
      title="删除确认"
      width="800px"
      ok-text="确认"
      cancel-text="取消"
      @ok="sureDelete"
      @cancel="cancelDelete">
      <p>是否确认删除此条记录？</p>
    </a-modal>
  </div>
</template>

<script>
  import {
    getBomDetail,
    getBomList,
    getAllBomVersion,
    getImportProject,
    saveBom,
    getBill,
    getOptions,
  } from '@/api/api';
  import { GetImgByProjectNumMixin } from '@/mixins/GetImgByProjectNumMixin'

  export default {
    name: 'MaintainBOMCheck',
    inject: ['closeCurrent'],
    mixins: [GetImgByProjectNumMixin],
    data() {
      return {
        srccc: null,
        isCheck: true, // 是否是查看，是就true并且disabled  不是就是维护，可以编辑
        queryBomParam: {}, // 查询上方BOM信息参数
        bomName: [
          { '戴卡部件号': 'projectNumber', '客户部件号': 'customerProjectNumber', '客户名称': 'customerName' },
          { '生产工艺': 'productionProcess', '车型平台': 'vehiclePlatform', '重量': 'roundWeight' },
          { '轮径': 'wheelDiameter', '轮宽': 'wheelWidth', '油漆号': 'paintNumber' },
        ], // BOM名称
        bomParam: {
          projectNumber: '', // 戴卡部件号
          customerProjectNumber: '', // 客户部件号
          customerName: '', // 客户名称
          productionProcess: '', // 生产工艺
          vehiclePlatform: '', // 车型平台
          roundWeight: '', // 重量
          wheelDiameter: '', // 轮径
          wheelWidth: '', // 轮宽
          paintNumber: '', // 油漆号

          version: '', // BOM版本
          taskObject: '', // 工段
        }, // 维护BOM 查询参数

        option: {
          version: [], // bom 版本
        },
        dic: {
          judgeNewMaterial: [],
        },

        // BOM底部列表
        bomColumns: [ // 表头
          { title: '是否新物料', dataIndex: 'judgeNewMaterial', align: 'left' },
          {
            title: '物料描述',
            dataIndex: 'materialDescription',
            align: 'left',
            scopedSlots: { customRender: 'materialDescription' },
          },
          { title: '物料名称', dataIndex: 'materialName', align: 'left', scopedSlots: { customRender: 'materialName' } },
          {
            title: '规格型号',
            dataIndex: 'specifications',
            align: 'left',
            scopedSlots: { customRender: 'specifications' },
          },
          { title: '用量/百件', dataIndex: 'dosage', align: 'left', scopedSlots: { customRender: 'dosage' } },
          { title: 'SAP编码', dataIndex: 'sapNumber', align: 'left', scopedSlots: { customRender: 'sapNumber' } },
          { title: '物料类型', dataIndex: 'materialType', align: 'left', scopedSlots: { customRender: 'materialType' } },
          { title: '物料组', dataIndex: 'materialGroup', align: 'left', scopedSlots: { customRender: 'materialGroup' } },
          {
            title: '计量单位',
            dataIndex: 'measuringUnit',
            align: 'left',
            scopedSlots: { customRender: 'measuringUnit' },
          },
          {
            title: '操作',
            dataIndex: 'operate',
            width: 200,
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'operate' },
          }],
        bomData: [],

        // 删除弹窗
        deleteVisible: false,
        deleteIndex: 0,

        selectValue: [],// 物料描述选择项
        searchValue: '',
        selectOptions: [], //物料描述下拉选项
        editingKey: '',// 编辑行index
        editInput: {
          materialName: '', // 物料名称
          specifications: '', // 规格型号
          dosage: '', // 用量/百件
        }, // 编辑行的内容
        isEditing: false, // 是否正在编辑
        newMaterialName: '1、新物料', // 新物料名称

        // 项目导入
        projectSelectVisible: false, // 项目导入弹窗可视化

        projectParam: { // 项目导入 查询参数
          projectNumber: '', // 戴卡部件号
          toolStep: '', // 当前工段
          projectManager: '', // "项目经理"
          vehiclePlatform: '', // 车型平台
        },

        projectColumns: [ // 表头
          { title: '项目编号', dataIndex: 'projectNumber', align: 'left' },
          { title: '客户名称', dataIndex: 'customerName', align: 'left' },
          { title: '项目经理', dataIndex: 'projectManager', align: 'left' },
          { title: '物料版本号', dataIndex: 'version', align: 'left' },
        ],
        projectData: [], // 数据

        selectedRowKeysArray: [],
        selectedRows: [],

        // 项目分页
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
      // this.isCheck = JSON.parse(this.$route.query.isCheck);
      console.log(this.isCheck);
      this.getDic(); // 获取字典
      this.queryBomParam = { id: this.$route.query.id, taskObject: this.$route.query.taskObject };
      this.$nextTick(() => {
        this.getBomDetailFunc();
      });
    },

    methods: {

      // BOM清单

      fileImport() {
        this.$message.warning('文件导入功能待开发！');
      },

      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          getOptions(searchName, '').then((data) => {
            this.dic[name] = data;
          });
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

      getBomDetailFunc() { // 获取BOM的detail
        getBomDetail(this.queryBomParam).then((data) => {
          if (data.success) {
            data = data.result;
            console.log('data detail', data);
            this.bomParam = data;
            this.bomData = this.dataToDic(data.bomVoList);
            this.getImg(this.bomParam.projectNumber);

            this.getBomVersion();
          } else {
            this.$message.error(data.message);
          }
        });
      },

      dataToDic(data) { // 将数据中的字段改为字典
        for (let i = 0; i < data.length; i++) { // 遍历返回的数据列表
          for (let name in data[i]) { // 列表每行 for 出每个属性
            if (name in this.dic) { // 如果该属性在字典里
              for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                if (Number(data[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                  data[i][name] = this.dic[name][j].label;
                }
              }
            }
          }
        }
        return data;
      },

      dicToData(data) { // 将字典改为012数字
        for (let i = 0; i < data.length; i++) { // 遍历返回的数据列表
          for (let name in data[i]) { // 列表每行 for 出每个属性
            if (name in this.dic) { // 如果该属性在字典里
              for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                if (data[i][name] === this.dic[name][j].label) { // 找到value相等时对应的label
                  data[i][name] = this.dic[name][j].value;
                }
              }
            }
          }
        }
        return data;
      },

      selectBomVersion() { // 选择BOM版本

        // this.getBomDetail();
        console.log('version', this.bomParam.version);
        let param = {
          version: this.bomParam.version,
          toolStep: this.bomParam.taskObject,
        };
        getBomList(param).then((data) => {
          if (data.success) {
            data = data.result;
            this.bomData = this.dataToDic(data);
          } else {
            this.$message.error(data.message);
          }
        });
      },

      getBomVersion() { // 获取所有BOM版本
        let param = {
          projectNumber: this.bomParam.projectNumber,
          toolStep: this.bomParam.taskObject,
        };
        getAllBomVersion(param).then((data) => {
          if (data.success) {
            console.log('bom version', data);
            data = data.result;
            this.option.version = data;
            this.bomParam.version = data[0];
          } else {
            this.$message.error(data.message);
          }
        });
      },

      editBom(operate, index) { // 编辑BOM
        if (this.isEditing) {
          this.$message.warning('请先保存当前编辑行！');
        } else {
          this.isEditing = true;
          const newData = [...this.bomData];
          this.editingKey = index;
          newData[index].editable = true;

          this.searchValue = operate.materialDescription;
          this.editInput = {
            materialName: operate.materialName,
            specifications: operate.specifications,
            dosage: operate.dosage,
          };

          this.bomData = this.dataToDic(newData);
        }
      },

      // 删除确认弹窗
      deleteSureModal(index) { // 弹出删除确认框
        this.deleteVisible = true;
        this.deleteIndex = index;
      },
      cancelDelete() {
        this.deleteIndex = 0;
        this.deleteVisible = false;
      },
      sureDelete() {
        this.deleteBom(this.deleteIndex);
        this.cancelDelete();
      },

      deleteBom(index) { // 删除BOM
        // console.log('operate', operate);
        this.bomData.splice(index, 1); //删除指定行
        this.$message.success('删除成功！');
      },

      saveBom(operate, index) { // 保存BOM
        const newData = [...this.bomData];
        // this.editableData[key] = cloneDeep(this.dataSource.filter(item => key === item.serialNumber)[0]);
        let target = newData[index];
        console.log('editinput', this.editInput);

        if (this.editInput.materialName && this.editInput.specifications && this.editInput.dosage && this.searchValue) {
          target.materialName = this.editInput.materialName;
          target.specifications = this.editInput.specifications;
          target.dosage = this.editInput.dosage;

          if (target.materialDescription === this.newMaterialName) {
            target.judgeNewMaterial = 1;
            target.materialDescription = '';

            target.sapNumber = '';
            target.materialType = '';
            target.materialGroup = '';
            target.measuringUnit = '';
            this.searchValue = '';
          } else {
            target.judgeNewMaterial = 0;
          }
          this.bomData = this.dataToDic(newData);

          this.editInput = {
            materialName: '', // 物料名称
            specifications: '', // 规格型号
            dosage: '', // 用量/百件
          };

          this.searchValue = '';
          this.isEditing = false;

          target.editable = false;
        } else {
          this.$message.warning('请填写物料描述、物料名称、规格型号、用量！');
        }

      },

      backBom(operate, index) { // 返回BOM
        const newData = [...this.bomData];
        newData[index].editable = false;
        this.editingKey = index;
        this.bomData = this.dataToDic(newData);
        this.isEditing = false;
      },


      addBom() { // 新增行
        // console.log(this.newIndex);
        this.bomData.push({});
      },

      submitProject(type) { // 提交或者保存草稿
        // 1草稿2提交
        if (this.bomData.length === 0) {
          this.$message.warning('当前BOM清单为空！');
        } else {
          let param = {};
          let dataNew = [...this.bomData];
          param.bomToSaveListDtoList = this.dicToData(dataNew);
          param.maintenanceState = type;
          param.projectNumber = this.bomParam.projectNumber;
          // param.toolStep = this.bomParam.taskObject.substr(0, this.bomParam.taskObject.length-4);
          param.toolStep = this.bomParam.taskObject;
          param.version = this.bomParam.version;
          saveBom(param).then((data) => {
            if (data.success) {
              // this.getBomDetailFunc();
              this.$message.success(type === 1 ? '保存草稿成功！' : '提交成功！');
              this.returnMaintainList();
            } else {
              this.$message.error(data.message);
            }
          });
        }
      },

      returnMaintainList() {
        this.closeCurrent();
        this.$router.push(
          { path: `/material/materialMaintain` },
        );
      },

      onSearch(searchText) {
        console.log('23333333', searchText);
      },
      onSelect(value) {
        const objArr = value.split('|');
        objArr.forEach((item, index) => {
          this.selectValue[index] = item.split(':')[1];
        });
        const newData = [...this.bomData];
        let target = newData[this.editingKey];
        console.log('edit', this.editingKey);
        target.judgeNewMaterial = 0;
        target.materialDescription = this.selectValue[0];
        target.materialGroup = this.selectValue[1];
        target.materialType = this.selectValue[2];
        target.sapNumber = this.selectValue[3];
        target.measuringUnit = this.selectValue[4];
        if (value === this.newMaterialName) {
          target.judgeNewMaterial = 1;
          target.materialDescription = this.newMaterialName;
          target.sapNumber = '';
          target.materialType = '';
          target.materialGroup = '';
          target.measuringUnit = '';
        }

        this.bomData = this.dataToDic(newData);

      },

      onChange(searchText) {
        if (searchText.indexOf('|') == -1) {
          getBill(searchText).then((data) => {
            this.selectOptions = [];
            const dataATT = data.result;
            this.selectOptions[0] = this.newMaterialName;
            dataATT.forEach((item, index) => {
              const string = `${index + 2}、物料描述:${item.materialBill}|物料组:${item.materialGroup}|物料类型:${item.materialType}|sap编码:${item.sapNumber}|计量单位:${item.unit}`;
              this.selectOptions[index + 1] = string;
            });
          });
        }
      },


      // 项目导入
      projectImport() {
        this.projectParam.toolStep = this.bomParam.taskObject;
        this.projectSelectVisible = true;
      },

      searchProjectQuery(reset = false) { // 查询信息列表 reset代表是否重置页码
        if (reset) { // 如果需要重置，比如有了新的筛选条件
          this.page.currentPage = 1;
        }
        let param = this.projectParam;
        param.pageNo = this.page.currentPage; // 当前页码
        param.pageSize = this.page.pageSize; // 页大小

        getImportProject(param).then((data) => {
          if (data.success) {
            data = data.result;
            this.projectData = data.records;
            this.page.total = data.total;
            this.page.pageSize = data.size;
            this.page.pageNum = data.pages;
          } else {
            this.$message.error(data.message);
          }
        });
      },

      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeysArray = selectedRowKeys;
        this.selectedRows = selectedRows;
      },

      cancelProjectImport() {
        this.projectSelectVisible = false;
        this.selectedRowKeysArray = [];
        this.selectedRows = [];
        this.projectData = [];

        this.projectParam = { // 项目导入 查询参数
          projectNumber: '', // 戴卡部件号
          toolStep: '', // 当前工段
          projectManager: '', // "项目经理"
          vehiclePlatform: '', // 车型平台
        };

        this.page = { // 分页
          total: 0, // 共多少条
          pageSize: 5, // 一页多少条
          pageNum: 0, // 共多少页
          currentPage: 1, // 当前页
          jumpPage: 1, // 跳转到第几页,
        };

      },

      sureSelect() {
        // console.log('selectedRowKeysArray', this.selectedRowKeysArray);
        // console.log('selectedRows', this.selectedRows);
        if (this.selectedRows.length !== 0) {
          this.bomParam.version = this.selectedRows[0].version;
          this.selectBomVersion();
          this.cancelProjectImport();
          this.$message.success('项目选择成功！');
        } else {
          this.$message.warning('请选择项目！');
        }
      },

      selectProjectRow(record, index) {
        return {
          on: {
            click: () => {
              this.selectedRowKeysArray = [index];
              this.selectedRows = [record];
            },
          },
        };
      },

      // 分页
      pageChange(val) { // 分页改变
        // console.log(val);
        this.page.currentPage = val;
        this.searchProjectQuery();
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
        this.searchProjectQuery();
      },
    },
  };
</script>

<style scoped lang="less">
  @import "./../../css/public-table-css";

  .ant-input {
    width: 244px;
  }


  /*新样式*/
  /deep/.ant-select-selection{
    border-width: 0;
  }
  /deep/.ant-select-disabled .ant-select-selection{
    background: #fff;
  }

  /deep/.ant-input[disabled]{
    background-color: #fff;
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

  .container {
    width: 1064px;
    margin: 16px auto 0 auto;
    display: flex;
    flex-direction: column;
    /deep/ .ant-card-body {
      padding: 24px 24px 24px 24px;
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
      margin-bottom: 32px;
      background: #f5f8fa;
      border-top: solid 1px #f0f2f5;
      border-right: solid 1px #f0f2f5;
      border-bottom: solid 1px #f0f2f5;
      img {
        width: 90%;
      }
    }
  }

  .msg-container {
    width: 100%;
    .item-title {
      width: 15%;
    }
    .item-value {
      width: 35%;
    }
  }

  .list-container {
    /deep/ .ant-table-thead > tr > th {
      background: #f5f8fa;
    }
    /deep/ .ant-input {
      border-width: 0;
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
    margin-bottom: 12px;

    .blue-stripe {
      width: 3px;
      height: 20px;
      background: #347EF2;
      margin: 0 8px 0 4px;
      border-radius: 10px;
    }
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
    justify-content: center;
    align-items: center;
  }
  .flex-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .flex-left {
    display: flex;
    justify-content: flex-start;
    padding-left: 20px;
  }

  /*.part-title {*/
  /*  width: 100%;*/
  /*  height: 30px;*/
  /*  line-height: 30px;*/
  /*  border-radius: 5px;*/
  /*  background: #f2f2f2;*/
  /*  padding-left: 10px;*/
  /*  margin: 20px 0;*/
  /*}*/

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

  .bom-table {
    margin-top: 20px;
  }

  .bottom-button-group {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-top: 20px;

    .bottom-button {
      margin-right: 20px;
    }
  }

  .editable-add-btn {
    /*margin-bottom: 8px;*/
    margin-top: 15px;
  }
  .editable-add-btn-edit {
    /deep/ .ant-btn {
      color: #1890ff!important;
      border: solid 1px #1890ff!important;
    }
  }

  /deep/ section {
    width: 66%;
  }
</style>