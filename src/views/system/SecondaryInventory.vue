<template>
  <div class="jn-public-table" style="overflow-x: auto;width: 100%">
    <a-card style="min-width: 1600px;">
      <div class="mould-frame">
        <div class="mould-frame-up">
          <a-row class="row">
            <a-col :span="6">
              <a-space align="center">
                <span style="font-size: 14px; margin-right: 8px ">SAP编码:&nbsp;</span>
                <a-input v-model:value="searchParams.sapNumber" placeholder="请输入" />
              </a-space>
            </a-col>
            <a-col :span="6">
              <a-space align="center">
                <span style="font-size: 14px; margin-right: 8.5px ">物料描述:&nbsp;</span>
                <a-input v-model:value="searchParams.materialDescription" placeholder="请输入" />
              </a-space>
            </a-col>
            <a-col :span="6">
              <a-space align="center">
                <span style="font-size: 14px; margin-right: 10px ">二级仓库:</span>
                <a-select  placeholder="请选择" v-model="searchParams.factoryWarehouse"  style="width: 244px; margin-left: 10px" >
                  <a-select-option v-for="data in option.factory_warehouse" :key="data.value">
                    {{ data.label }}
                  </a-select-option>
                </a-select>
              </a-space>
            </a-col>
            <a-col :span="6">
              <a-button type="primary" class="buttonMargin" @click="searchMould()">查询</a-button>
              <a-button class="buttonMargin" @click="resetSearch()">重置</a-button></a-col>
          </a-row>
          <a-row class="row" v-if="isShowOtherButtons">
            <a-col :span="6">
              <a-space align="center">
                <span style="font-size: 14px; ">物料类型:&nbsp;&nbsp;</span>
                <a-input v-model:value="searchParams.materialType" placeholder="请输入" />
              </a-space>
            </a-col>
            <a-col :span="6">
              <a-space align="center">
                <span style="font-size: 14px; ">物料组:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <a-input v-model:value="searchParams.materialGroup" placeholder="请输入" />
              </a-space>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-card>
    <a-card style="min-width: 1600px;margin-top: 16px">
      <div style="font-size: 18px;display: flex;justify-content: space-between">
        <b>物料库存清单</b>
        <div class="mould-frame-button" style="width: 200px">
          <a-row>
              <a-button type="primary" icon="plus" class="buttonMargin" @click="openNew()" v-has="'secondary_inventory:add'">新建</a-button>
              <a-button icon="export" class="buttonMargin" v-has="'secondary_inventory:export'">导出</a-button>
          </a-row>
        </div>
      </div>
      <div class="mould-frame-down" style="margin-top: 16px">
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          bordered
          :pagination = false
        >
          <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
            <a-button v-has="'secondary_inventory:adjustment'" type="link" @click="openCheck(operate, i)">调整库存</a-button>
            <a-button v-has="'secondary_inventory:del'" type="link" @click="deleteOperate(operate, i)">删除</a-button>
          </a-space>
        </a-table>
        <!--    分页-->
        <div class="bottom-page">
          <a-pagination
            :total=total
            :show-total="total => `共 ${total} 条`"
            :page-size=pageSize
            :current="currentPage"
            @change="pageChange"
          />
          <div style="margin: 0 20px">共 {{pageNum}} 页</div>
          <div style="margin: 0 10px 0 0">到第</div>
          <a-input-number style="width: 50px" @keyup.enter.native="pageJump(jumpPage)" v-model="jumpPage"></a-input-number>
          <div style="margin: 0 20px 0 10px">页</div>
          <a-button type="primary" @click="pageJump(jumpPage)">跳转</a-button>
        </div>
      </div>
      <a-modal v-model:visible="visible" title="调整库存">
        <a-row class="row1">
          <div class="messageInput">
            <span style="font-size: 15px;width: 80px ">库存数量:</span>
            <a-input v-model:value="count" placeholder="请输入" />
          </div>
        </a-row>
        <template #footer>
          <a-button key="submit" type="primary"  @click="modify">确定</a-button>
          <a-button key="back" @click="handleCancel1">取消</a-button>
        </template>
      </a-modal>
      <a-modal v-model:visible="deleteVisible" title="确认删除">
        <span>确定删除本条？</span>
        <template #footer>
          <a-button key="submit" type="primary"  @click="handleOk">确定</a-button>
          <a-button key="back" @click="handleCancel">取消</a-button>
        </template>
      </a-modal>
    </a-card>

  </div>

</template>

<script>
  import newMould from './newMould'
  import {getSecondData,getMouldOptions,deleteSecondData,modifyInventory,getOptions} from '@/api/api'
  export default {
    name: 'MoudlRepair',
    components: {newMould},
    mounted() {
      this.getDic();
      this.getAppointOption();
      getSecondData(this.searchParams).then( (data) => {
        console.log('data' ,data.result.records);
        data = data.result;
        if (!data.records.length) {
          this.dataSource = [];
        }else {
          for (let i = 0; i < data.records.length; i++) { // 遍历返回的数据列表
            for (let name in data.records[i]) { // 列表每行 for 出每个属性
              if (name in this.dic) { // 如果该属性在字典里
                for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                  if (data.records[i][name] && Number(data.records[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                    console.log(' 2355',this.dic[name][j].label);
                    data.records[i][name] = this.dic[name][j].label;
                  }
                }
              }
            }
          }
        }
        this.dataSource = data.records;
        for(let i = 0 ; i<this.dataSource.length; i++) {
          this.dataSource[i].serialNumber = (i + 1 );
        }
        this.total = data.total;
        this.pageNum = data.pages;
        this.pageNum = data.pages;
      })
    },
    data() {
      const planCompleteOnChange = (value, dateString) => { // 计划完成日期数据改变函数
        console.log('Selected Time: ', value);
        // const startTimestamp = new Date(dateString[0]).getTime();
        // const endTimestamp = new Date(dateString[1]).getTime()
        this.planCompletePicker = dateString;
        console.log('Formatted Selected Time: ', this.planCompletePicker[0], this.planCompletePicker[1]);
      };
      const planCompleteOnOk = (value) => { // 交付日期确认函数
        console.log('onOk: ', value);
      };
      const RepairOnChange = (value, dateString) => { // 合格日期数据改变函数
        // const startTimestamp = new Date(dateString[0]).getTime();
        // const endTimestamp = new Date(dateString[1]).getTime()
        this.RepairPicker = dateString;

      };
      const RepairOnOk = (value) => { //合格日期确认函数
        console.log('onOk2: ', value);
      };
      return{
        deleteVisible: false, //删除界面弹窗
        deleteId: '',
        modifyItem: null,// 修改库存的对象
        option: {
          factory_warehouse: [], //二级库存选项
        },
        dic: { // 表单中的部分数据对应的的数据词典
          factoryWarehouse: [], // 维护状态
        },
        warehouseStatus: undefined, //二级库存
        count: '', //库存数量
        visible: false, // 调整库存可视化
        selectId: '', //详情id
        planCompletePicker: [], //计划完成日期数组
        RepairPicker: [], //送修日期数组
        searchParams:{
          factoryWarehouse: undefined, // 二级仓库
          materialGroup:'', // 物料组
          materialDescription: '', // 物料描述
          materialType: '', // 物料类型
          sapNumber: '', // sap编码
          pageNO: 1, // 当前页
          pageSize: 10, //展示条数
        },
        modalTitle:'', // 新增、维护弹窗title
        total: 25, // 共多少条
        pageSize: 10, // 一页多少条
        pageNum: 3, // 共多少页
        jumpPage: 1, // 跳转到第几页
        currentPage: 1, // 当前页
        dataSource: [],//表格数据
        planCompleteOnChange, //计划完成日期改变
        planCompleteOnOk, //计划完成日期确认
        RepairOnChange, //送修日期改变
        RepairOnOk, //送修日期确认
        partNumber: '',// 戴卡部件号双向绑定
        repairDepartment: '', //送修部门双向绑定
        moldNumber:'', //模号双向绑定
        columns :[
          {
            title: '序号',
            dataIndex: 'serialNumber',
            key: 'serialNumber',
            align: 'left',
          },
          {
            title: 'SAP编码',
            dataIndex: 'sapNumber',
            key: 'sapNumber',
            align: 'left',
          },
          {
            title: '物料描述',
            dataIndex: 'materialDescription',
            key: 'materialDescription',
            align: 'left',
          },
          {
            title: '物料类型',
            dataIndex: 'materialType',
            key: 'materialType',
            align: 'left',
          },
          {
            title: '物料组',
            dataIndex: 'materialGroup',
            key: 'materialGroup',
            align: 'left',
          },
          {
            title: '二级仓库',
            dataIndex: 'factoryWarehouse',
            key: 'factoryWarehouse',
            align: 'left',
          },
          {
            title: '库存数量',
            dataIndex: 'inventoryQuantity',
            key: 'inventoryQuantity',
            align: 'left',
          },
          {
            title: '计量单位',
            dataIndex: 'unit',
            key: 'unit',
            align: 'left',
          },
          {
            title: '修改人',
            dataIndex: 'updateBy',
            key: 'updateBy',
            align: 'left',
          },
          {
            title: '修改时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            align: 'left',
          },
          {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            align: 'center',
            width: 150,
            scopedSlots: { customRender: 'operate' },
          }
        ],
        isShowOtherButtons: false
      }
    },
    methods: {
      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          getMouldOptions(searchName, '').then((data) => {
            this.dic[name] = data;
          });
        }
        console.log('dic', this.dic);
      },
      tableChange(val) {
        console.log(val);
      },
      openNew() {
        this.$router.push({
          path: `/system/newMaterial`,
        })
      },
      pageChange(val) { // 分页改变
        // console.log(val);
        this.currentPage = val;
        this.searchParams.pageNO = this.currentPage;
        getSecondData(this.searchParams).then((data) => {
          data = data.result;
          if (!data.records.length) {
            this.dataSource = [];
          }else {
            for (let i = 0; i < data.records.length; i++) { // 遍历返回的数据列表
              for (let name in data.records[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.records[i][name] && Number(data.records[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                      console.log(' 2355',this.dic[name][j].label);
                      data.records[i][name] = this.dic[name][j].label;
                    }
                  }
                }
              }
            }
          }
          this.dataSource = data.records;
          for(let i = 0 ; i<this.dataSource.length; i++) {
            this.dataSource[i].serialNumber = (i + 1 );
          }
          this.total = data.total;
          this.pageNum = data.pages;
          this.pageNum = data.pages;
        })
      },
      pageJump(page) { // 点击指定分页跳转的情况下
        if (page > this.pageNum) {
          page = this.pageNum;
          this.jumpPage = this.pageNum;
        } else if (page < 1) {
          page = 1;
          this.jumpPage = 1;
        }
        this.currentPage = page;
        this.searchParams.pageNO = this.currentPage;
        getSecondData(this.searchParams).then((data) => {
          data = data.result;
          if (!data.records.length) {
            this.dataSource = [];
          }else {
            for (let i = 0; i < data.records.length; i++) { // 遍历返回的数据列表
              for (let name in data.records[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.records[i][name] && Number(data.records[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                      console.log(' 2355',this.dic[name][j].label);
                      data.records[i][name] = this.dic[name][j].label;
                    }
                  }
                }
              }
            }
          }
          this.dataSource = data.records;
          for(let i = 0 ; i<this.dataSource.length; i++) {
            this.dataSource[i].serialNumber = (i + 1 );
          }
          this.total = data.total;
          this.pageNum = data.pages;
          this.pageNum = data.pages;
        })

      },
      searchMould() { //查询按钮
        const obj = this.searchParams;
        obj.pageNO = 1;
        obj.pageSize = 10;
        getSecondData(obj).then((data) => {
          data = data.result;
          if (!data.records.length) {
            this.dataSource = [];
          }else {
            for (let i = 0; i < data.records.length; i++) { // 遍历返回的数据列表
              for (let name in data.records[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.records[i][name] && Number(data.records[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                      console.log(' 2355',this.dic[name][j].label);
                      data.records[i][name] = this.dic[name][j].label;
                    }
                  }
                }
              }
            }
          }
          this.dataSource = data.records;
          for(let i = 0 ; i<this.dataSource.length; i++) {
            this.dataSource[i].serialNumber = (i + 1 );
          }
          this.total = data.total;
          this.pageNum = data.pages;
        })

      },
      resetSearch() {
        this.searchParams.factoryWarehouse = undefined;
        this.searchParams.materialGroup = '';
        this.searchParams.materialDescription = '';
        this.searchParams.materialType = '';
        this.searchParams.sapNumber = '';
      },
      deleteOperate(operate, i) {
        this.deleteVisible = true;
        this.deleteId = operate.id;
        console.log('2333333', operate);
      },
      openCheck(operate, i) {
        this.visible = true;
        this.modifyItem = operate
      },
      handleOk() {
        deleteSecondData( this.deleteId ).then((data) => {
          if(data.success) {
            this.deleteVisible = false;
            this.$message.info('删除成功');
          }else {
            this.$message.warning('删除失败');
          }
        })
        const obj = this.searchParams;
        obj.pageNO = 1;
        obj.pageSize = 10;
        getSecondData(obj).then((data) => {
          data = data.result;
          if (!data.records.length) {
            this.dataSource = [];
          }else {
            for (let i = 0; i < data.records.length; i++) { // 遍历返回的数据列表
              for (let name in data.records[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.records[i][name] && Number(data.records[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                      console.log(' 2355',this.dic[name][j].label);
                      data.records[i][name] = this.dic[name][j].label;
                    }
                  }
                }
              }
            }
          }
          this.dataSource = data.records;
          for(let i = 0 ; i<this.dataSource.length; i++) {
            this.dataSource[i].serialNumber = (i + 1 );
          }
          this.total = data.total;
          this.pageNum = data.pages;
          this.pageNum = data.pages;
        })
      },
      handleCancel(){
        this.deleteVisible = false;
      },
      modify() {
        this.modifyItem.inventoryQuantity = this.count;
        modifyInventory({id:this.modifyItem.id,inventoryQuantity:this.modifyItem.inventoryQuantity} ).then((data) => {
          if(data.success){
            this.visible = false;
            this.$message.success('修改成功');
            this.count = '';
          }else {
            this.$message.warning('修改失败');
          }
        })
        const obj = this.searchParams;
        obj.pageNO = 1;
        obj.pageSize = 10;
        getSecondData(obj).then((data1) => {
          console.log('233333', data1);
          data1 = data1.result;
          if (!data1.records.length) {
            this.dataSource = [];
          }else {
            for (let i = 0; i < data1.records.length; i++) { // 遍历返回的数据列表
              for (let name in data1.records[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data1.records[i][name] && Number(data1.records[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                      console.log(' 2355',this.dic[name][j].label);
                      data1.records[i][name] = this.dic[name][j].label;
                    }
                  }
                }
              }
            }
          }
          this.dataSource = data1.records;
          for(let i = 0 ; i<this.dataSource.length; i++) {
            this.dataSource[i].serialNumber = (i + 1 );
          }
          this.total = data1.total;
          this.pageNum = data1.pages;
          this.currentPage = 1;
        })
      },
      handleCancel1(){
        this.visible = false;
      },
      getAppointOption() { // 获取指定的下拉框
        for (let name in this.option) {
          // let searchName = this.humpOrLine(name, 'toLine');
          getMouldOptions(name, '').then((data) => {
            this.option[name] = data;
          });
        }
      },
      humpOrLine(name, type) { // 驼峰式转下划线 toLine 下划线转驼峰式 toHump
        if (type === 'toLine') {
          return name.replace(/([A-Z])/g, '_$1').toLowerCase();
        } else if (type === 'toHump') {
          return name.replace(/\_(\w)/g, function(all, letter) {
            return letter.toUpperCase();
          });
        }
      },
    }
  }
</script>

<style scoped lang="less">
  @import "./../../css/public-table-css";
  .cursor{
    cursor: pointer;
  }
  .select-text{
    text-decoration:underline;
    color: #00A0E9;
  }
  .select-text:active{
    opacity: 0.5;
  }
  .row{
    margin-bottom: 20px;
  }
  .buttonMargin{
    margin-right: 8px;
  }
  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    align-items: center;
  }
  .messageInput{
    width: 80%;
    margin: 0 auto;
    display: flex;
    align-items: center;
  }

</style>
