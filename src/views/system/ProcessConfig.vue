<template>
  <a-spin :spinning="spinning" size="large">
    <div class="container">
      <TabTitle :level1="level1"></TabTitle>
      <a-card>
        <!--        <div class="title">试制地工序配置</div>-->
        <div class="table-container">
          <div class="table-item">
            <div class="table-title flex-center">
              <img src="../../assets/ProcessConfig/process_level1.png"/>
            </div>
            <a-table
              ref="table1"
              size="middle"
              bordered
              rowKey="id"
              :columns="columns1"
              :dataSource="dataSource1"
              :rowSelection="{ selectedRowKeys: selectedKeyLevelOne, onChange: onSelectChange, type: 'radio' }"
              :customRow="selectRowLevelOne"
              :scroll="{ x: 0, y: 2000 }"
              :pagination=false>
            </a-table>
            <!--          <a-button @click="test" class="new-button">新增</a-button>-->
          </div>
          <div class="table-item">
            <div class="table-title flex-center">
              <img src="../../assets/ProcessConfig/process_level2.png"/>
            </div>
            <a-table
              ref="table2"
              size="middle"
              bordered
              :columns="columns2"
              rowKey="id"
              :dataSource="dataSource2"
              :scroll="{ x: 0, y: 1000 }"
              :customRow="selectRowLevelTwo"
              :pagination=false>
              <a-space slot="processName" slot-scope="text, record">
                <template v-if="record.editable">
                  <a-select
                    labelInValue
                    placeholder="请选择工序"
                    v-model="selectProcessName"
                    style="width: 200px"
                    @change="changeLevelTwo"
                  >
                    <a-select-option key="new">
                      <!--                    新建-->
                      <a-button type="link" icon="plus" @click.stop.prevent="newLevelTwoOption(true)" style="width: 100%">新建工序</a-button>
                    </a-select-option>
                    <a-select-option v-for="data in optionLevelTwo" :key="data.id">
                      {{ data.name }}
                    </a-select-option>
                  </a-select>
                </template>
                <template v-else>{{ record.processName }}</template>
              </a-space>
              <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
                <a-button v-if="!operate.editable" type="link" @click="deleteLevelTwo(i)">删除</a-button>
                <a-button v-if="operate.editable" type="link" @click="saveLevelTwo">保存</a-button>
                <a-button v-if="operate.editable" type="link" @click="deleteLevelTwo(i)">取消</a-button>
              </a-space>
            </a-table>
            <a-button icon="plus" @click="newLevelTwo" class="new-button">添加工序</a-button>
          </div>
          <div class="table-item">
            <div class="table-title flex-center">
              <img src="../../assets/ProcessConfig/process_level3.png"/>
            </div>
            <a-table
              ref="table3"
              size="middle"
              bordered
              :columns="columns3"
              :dataSource="dataSource3"
              :scroll="{ x: 0, y: 1000 }"
              :pagination=false>
              <a-space slot="machineName" slot-scope="text, record">
                <template v-if="record.editable">
                  <a-select
                    labelInValue
                    placeholder="请选择机台"
                    v-model="selectMachineName"
                    style="width: 200px"
                    @change="changeLevelThree"
                  >
                    <a-select-option v-for="data in dic.trial_machine" :key="data.id">
                      {{ data.label }}
                    </a-select-option>
                  </a-select>
                </template>
                <template v-else>{{ record.machineName }}</template>
              </a-space>
              <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
                <a-button v-if="!operate.editable" type="link" @click="deleteLevelThree(i)">删除</a-button>
                <a-button v-if="operate.editable" type="link" @click="saveLevelThree">保存</a-button>
                <a-button v-if="operate.editable" type="link" @click="deleteLevelThree(i)">取消</a-button>
              </a-space>
            </a-table>
            <a-button icon="plus" @click="newLevelThree" class="new-button">添加机台</a-button>
          </div>
        </div>
        <a-divider/>
        <div class="bottom-btn-group">
          <!--        <a-button>取消</a-button>-->
          <a-button type="primary" @click="saveConfig">确定</a-button>
        </div>
      </a-card>
      <a-modal :visible="newOptionVisible" title="新增工序" width="500px" @cancel="newLevelTwoOption(false)">
        <div class="new-option-container">
          <div style="margin-bottom: 10px">新增工序名称：</div>
          <a-input v-model:value="newOptionName" placeholder="请输入工序名称"></a-input>
        </div>
        <template #footer>
          <a-button key="back" @click="newLevelTwoOption(false)">取消</a-button>
          <a-button key="submit" type="primary" @click="saveNewOption">确定</a-button>
        </template>
      </a-modal>
    </div>
  </a-spin>
</template>

<script>
  // import { notification } from 'ant-design-vue';
  import TabTitle from '../component/TabTitle';
  import {
    getOptions,
    getProcessTree,
    getProcessTreeTwo,
    postProcessTree,
    postProcessTreeTwo,
  } from '@/api/api';
  import store from '@/store/';

  export default {
    name: 'ProcessConfig',
    components: { TabTitle },
    data() {
      return {
        spinning: false,
        level1: '试制地工序配置',
        level2: 'DGFSERF DSAFG AWDSTKLAWE',
        dic: {
          trial_production_site: [], // 一级试制地
          trial_machine: [], // 三级机台同试制地
        },
        columns1: [ // 一级表头——试制
          { title: '试制', dataIndex: 'siteName', align: 'center' },
        ],
        dataSource1: [], // 数据
        columns2: [ // 二级表头——工序
          { title: '工序', dataIndex: 'processName', align: 'center', scopedSlots: { customRender: 'processName' } },
          {
            title: '操作', dataIndex: 'operate', width: 150, align: 'center',
            // fixed: 'right',
            scopedSlots: { customRender: 'operate' },
          },
        ],
        dataSource2: [], // 数据
        columns3: [ // 三级表头——机台
          { title: '机台', dataIndex: 'machineName', align: 'center', scopedSlots: { customRender: 'machineName' } },
          {
            title: '操作', dataIndex: 'operate', width: 150, align: 'center',
            // fixed: 'right',
            scopedSlots: { customRender: 'operate' },
          },
        ],
        dataSource3: [], // 数据
        selectedKeyLevelOne: [], // 一级选择key
        selectedRowLevelOne: [], // 一级选择row
        selectedKeyLevelTwo: [], // 二级选择key
        selectedRowLevelTwo: [], // 二级选择row

        optionLevelTwo: [], // 二级树的option选项
        newOptionName: '', // 二级树 新增 option选项名
        newOptionVisible: false, // 二级树 新增 option选项 界面可视化

        deleteName: '', // 要删除的名字
        deleteIndex: 0, // 要删除的index

        isEditing: false, // 是否正在编辑level

        selectProcessName: undefined, // 选择的工序名称 level——2
        selectMachineName: undefined, // 选择的机台名称 level——3

        // deleteVisible: false, // 删除确认框
      };
    },
    mounted() {
      this.getDic();
      this.getTreeData();
    },
    methods: {
      test() {
        // this.getTreeData();
        // console.log('data1', this.dataSource1);
        console.log('this.selectProcessName', this.selectProcessName);


        this.$notification.info({
          message: 'Notification Title',
          description:
            'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
      },
      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          // let searchName = this.humpOrLine(name, 'toLine');
          getOptions(name, '').then((data) => {
            this.dic[name] = data;
          });
        }

        getProcessTreeTwo('').then((data) => { // 获取二级 option 列表
          if (data.success) {
            this.optionLevelTwo = data.result;
            // console.log('optionLevelTwo', this.optionLevelTwo);
          } else {
            this.$message.error(data.message);
          }
        });
      },

      getTreeData() { // 获得树型结构数据
        getProcessTree('').then((data) => {
          if (data.success) {
            this.dataSource1 = data.result;
            if (this.dataSource1.length) {
              this.selectedKeyLevelOne = [0];
              this.selectedRowLevelOne = [this.dataSource1[0]];
              this.set2and3();
            }
          } else {
            this.$message.error(data.message);
          }
        });
      },

      onSelectChange(selectedRowKeys, selectedVersion) { // 一级列表更改
        if (this.dataSource2.length && !this.dataSource3.length) {
          this.$message.destroy();
          this.$message.warning('请选择至少一个机台！');
        } else {
          if (this.isEditing) {
            this.$message.destroy();
            this.$message.warning('请保存当前编辑行！');
          } else {
            // this.selectedKeyLevelOne = [index];
            // this.selectedRowLevelOne = [record];
            this.selectedKeyLevelOne = selectedRowKeys;
            this.selectedRowLevelOne = selectedVersion;
            this.set2and3();
          }
        }
      },

      selectRowLevelOne(record, index) { // 一级列表选择
        return {
          on: {
            click: () => {

              if (this.dataSource2.length && !this.dataSource3.length) {
                this.$message.destroy();
                this.$message.warning('请选择至少一个机台！');
              } else {
                if (this.isEditing) {
                  this.$message.destroy();
                  this.$message.warning('请保存当前编辑行！');
                } else {
                  this.selectedKeyLevelOne = [index];
                  this.selectedRowLevelOne = [record];
                  this.set2and3();
                }
              }
            },
          },
        };
      },

      selectRowLevelTwo(record, index) { // 二级列表选择
        // 事件
        return {
          on: {
            click: () => {
              if (this.dataSource2.length && !this.dataSource3.length && (record !== this.selectedRowLevelTwo[0])) {
                this.$message.destroy();
                this.$message.warning('请选择至少一个机台！');
              } else {
                if (this.isEditing && (record !== this.selectedRowLevelTwo[0])) {
                  this.$message.destroy();
                  this.$message.warning('请保存当前编辑行！');
                } else {
                  this.selectedKeyLevelTwo = [index];
                  this.selectedRowLevelTwo = [record];
                  this.dataSource3 = record.machineList ? record.machineList : [];
                }
              }
            },
          },
          style: {
            'background-color': record === this.selectedRowLevelTwo[0] ? '#e6f7ff' : 'white',
          },
        };
      },

      set2and3() { // 一级更改以后，设置2级和3级
        if (this.isEditing) {
          this.$message.destroy();
          this.$message.warning('请保存当前编辑行！');
        } else {
          this.dataSource2 = [];
          this.dataSource3 = [];
          this.dataSource2 = this.dataSource1[this.selectedKeyLevelOne[0]].processMachineDTOList;

          this.selectedKeyLevelTwo = [0];
          this.selectedRowLevelTwo = [this.dataSource2[0]];

          if (this.dataSource2.length) {
            this.dataSource3 = this.dataSource2[0].machineList;
          }
        }
      },

      deleteLevel(name, index) { // 删除指定数据的一行
        const _this = this;
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: () => {
            // _this[name].splice(index, 1);

            const newData = [..._this[name]];
            newData.splice(index, 1);
            _this[name] = newData;

            this.isEditing = false;
            this.selectMachineName = undefined;
            this.selectProcessName = undefined;
          },
        });
      },

      newLevelTwo() { // 第二级 新增

        if (this.dataSource2.length && !this.dataSource3.length) {
          this.$message.destroy();
          this.$message.warning('请选择至少一个机台！');
        } else {
          if (this.isEditing) {
            this.$message.destroy();
            this.$message.warning('请先保存当前编辑行！');
          } else {
            this.isEditing = true;

            const newData = [...this.dataSource2]; // 赋予新数
            newData.push({});
            newData[newData.length - 1].editable = true;
            newData[newData.length - 1].machineList = []; // 用来存放三级表
            this.dataSource2 = newData;

            this.dataSource3 = this.dataSource2[this.dataSource2.length - 1].machineList;

            this.selectedKeyLevelTwo = [this.dataSource2.length - 1]; // 选中新行
            this.selectedRowLevelTwo = [this.dataSource2[this.dataSource2.length - 1]];
          }
        }
      },

      newLevelTwoOption(type) { // 第二级 新增工序可选项
        if(type) {
          this.newOptionName = '';
          this.newOptionVisible = true;
        } else {
          this.newOptionVisible = false;
        }
        // postProcessTreeTwo
      },
      saveNewOption() {
        if(this.newOptionName) {
          let param = {
            pid: -1,
            name: this.newOptionName,
          };
          postProcessTreeTwo(param).then(data => {
            console.log('return data', data);
            if(data.success) {
              this.$message.destroy();
              this.$message.success(data.result);
              this.getDic();
              this.newLevelTwoOption(false);
            } else {
              this.$message.destroy();
              this.$message.error(data.message);
            }
          })
        } else {
          this.$message.destroy();
          this.$message.warning('请输入工序名称！');
        }
      },

      deleteLevelTwo(index) { // 删除指定数据的一行
        const _this = this;
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: () => {
            const newData = [..._this.dataSource2];
            newData.splice(index, 1);
            _this.dataSource2 = newData;
            this.dataSource1[this.selectedKeyLevelOne].processMachineDTOList = this.dataSource2;

            this.isEditing = false;
            this.selectProcessName = undefined;
          },
        });
      },

      changeLevelTwo(option) { // 第二级 更改
        if (option.key !== 'new') {
          let key = option.key;
          let label = option.label.replace(/\ /g,"").replace(/\s/g,""); //去掉空格和 \n
          // console.log('key', key);
          // console.log('label', label);
          const newData = [...this.dataSource2];
          newData[newData.length - 1].processId = key;
          newData[newData.length - 1].processName = label;
          this.dataSource2 = newData;
        }
      },

      saveLevelTwo() { // 第二级 保存
        if (!this.selectProcessName || this.selectProcessName.key === 'new') {
          this.$message.destroy();
          this.$message.warning('请选择工序！');
        } else {
          let repeat = false; // 判断是否重复
          for (let i = 0; i < this.dataSource2.length - 1; i++) {
            if (this.dataSource2[this.dataSource2.length - 1].processId === this.dataSource2[i].processId) {
              repeat = true;
            }
          }
          if (repeat) {
            this.$message.destroy();
            this.$message.warning('工序已存在，请重新选择！');
          } else {
            // 保存二级表
            const newData2 = [...this.dataSource2];
            newData2[newData2.length - 1].editable = false;
            this.dataSource2 = newData2;
            this.selectProcessName = undefined;
            this.isEditing = false;
            
            // 更改一级表
            const newData1 = [...this.dataSource1];
            newData1[this.selectedKeyLevelOne].processMachineDTOList = this.dataSource2;
            this.dataSource1 = newData1;
          }
        }
      },

      newLevelThree() { // 第三级 新增
        if (this.isEditing) {
          this.$message.destroy();
          this.$message.warning('请先保存当前编辑行！');
        } else {
          this.isEditing = true;
          const newData = [...this.dataSource3];
          newData.push({});
          newData[newData.length - 1].editable = true;
          this.dataSource3 = newData;
        }
      },

      deleteLevelThree(index) { // 第三级 删除指定数据的一行
        const _this = this;
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: () => {
            const newData = [..._this.dataSource3];
            newData.splice(index, 1);
            _this.dataSource3 = newData;
            this.dataSource2[this.selectedKeyLevelTwo].machineList = this.dataSource3;

            this.isEditing = false;
            this.selectMachineName = undefined;
          },
        });
      },

      changeLevelThree(option) { // 第三级 更改
        let key = option.key;
        let label = option.label.replace(/\ /g,"").replace(/\s/g,""); //去掉空格和 \n
        // console.log('key', key);
        // console.log('label', label);
        const newData = [...this.dataSource3];
        newData[newData.length - 1].machineId = key;
        newData[newData.length - 1].machineName = label;
        this.dataSource3 = newData;
      },

      saveLevelThree() { // 第三级 保存
        if (!this.selectMachineName) {
          this.$message.destroy();
          this.$message.warning('请选择机台！');
        } else {
          let repeat = false; // 判断是否重复
          for (let i = 0; i < this.dataSource3.length - 1; i++) {
            if (this.dataSource3[this.dataSource3.length - 1].machineId === this.dataSource3[i].machineId) {
              repeat = true;
            }
          }
          if (repeat) {
            this.$message.destroy();
            this.$message.warning('机台已存在，请重新选择！');
          } else {
            // 保存二级表
            const newData = [...this.dataSource3];
            newData[newData.length - 1].editable = false;
            this.dataSource3 = newData;
            this.selectMachineName = undefined;
            this.isEditing = false;

            // 更改三级表
            const newData2 = [...this.dataSource2];
            newData2[this.selectedKeyLevelTwo].machineList = this.dataSource3;
            this.dataSource2 = newData2;
          }
        }
      },

      saveConfig() { // 保存配置
        const _this = this;
        this.$confirm({
          title: "保存工序配置确认",
          content: "如果您有取消机台关联的操作，请确保该机台的任务都已经试制完毕，否则将查询不到该机台",
          onOk: function () {
            _this.spinning = true;
            // this[name].splice(index, 1);
            let param = [];
            for (let i = 0; i < _this.dataSource1.length; i++) {
              let item1 = _this.dataSource1[i]; // 获取一级列表中的对象
              param.push({}); // 一级存储 空对象
              let nowData1 = param.length - 1; // 当前要存的表1位置
              param[nowData1].siteId = item1.siteId; // 一级id
              param[nowData1].processMachineDTOList = []; // 二级空列表

              for (let j = 0; j < item1.processMachineDTOList.length; j++) {
                let item2 = item1.processMachineDTOList[j]; // 获取二级列表中的对象
                param[nowData1].processMachineDTOList.push({}); // 二级存储 空对象
                let nowData2 = param[nowData1].processMachineDTOList.length - 1; // 当前要存的表2位置

                // console.log('processid', item2.processId);
                param[nowData1].processMachineDTOList[nowData2].processId = item2.processId;
                param[nowData1].processMachineDTOList[nowData2].machineId = []; // 三级空列表

                for (let k = 0; k < item2.machineList.length; k++) {
                  let item3 = item2.machineList[k]; //  获取三级列表中的对象
                  // console.log('item3.id', item3.machineId);
                  param[nowData1].processMachineDTOList[nowData2].machineId.push(item3.machineId); // 三级空列表
                }
              }
            }
            console.log('param', param);
            postProcessTree(param).then(data => {
              console.log('return data', data);

              _this.spinning = false;
              if(data.success) {
                _this.$message.destroy();
                _this.$message.success(data.result);
              } else {
                _this.$message.destroy();
                _this.$message.error(data.message);
              }
            })
          }
        });
      }

    },
  };
</script>

<style scoped lang="less">
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .operate-row {
    .ant-btn {
      height: 50px;
      padding: 0 10px;
    }
  }
  /*____________________________________*/

  .container {
    width: 80%;
    /*width: 800px;*/
    margin: 20px auto 0 auto;
  }

  .new-option-container {
    width: 80%;
    margin: 0 auto;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
    margin: 10px;
  }

  .table-container {
    display: flex;

    .table-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin: 15px 20px;

      .new-button {
        /*width: 100px;*/
        margin-top: 10px;
        color: #aaa;
      }

      .table-title {
        width: 100%;
        height: 100px;
        background: url("../../assets/ProcessConfig/process_bg.png") no-repeat;
        background-size: 100% 100%;

        img {
          height: 60%;
        }
      }
    }
  }

  .bottom-btn-group {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    > * {
      margin: 0 10px;
    }
  }
</style>