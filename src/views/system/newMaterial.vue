<template>
  <div style="width: 100%;display: flex;justify-content: center;flex-wrap: wrap">
    <img src="../../assets/new-material.png" style="width: 1300px"/>
    <a-card style="width: 1300px;margin-top: 12px">
      <div class="button-frame">
        <a-button icon="import" class="buttonMargin">导入</a-button>
        <a-button icon="download" class="buttonMargin">下载</a-button>
      </div>
      <a-button class="editable-add-btn" type="primary" ghost @click="handleAdd" style="margin-bottom: 8px;margin-top: 20px">添加物料</a-button>
      <div class="mould-frame-down">
        <a-table
                :dataSource="dataSource"
                :columns="columns"
                bordered
                :pagination = false
        >
          <template  slot="materialBill" slot-scope="text, record">
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
              {{ record.materialBill }}
            </template>
          </template>
          <template  slot="factoryWarehouse" slot-scope="text, record">
            <a-select  placeholder="请选择" v-model="factoryWarehouse1"  style="width: 100px; margin-left: 10px" v-if="record.editable">
              <a-select-option v-for="data in option.factory_warehouse" :key="data.value">
                {{ data.label }}
              </a-select-option>
            </a-select>
            <template v-else>
              {{ record.factoryWarehouse }}
            </template>
          </template>
          <template slot="inventoryQuantity" slot-scope="text, record">
            <a-input
                    placeholder="请输入库存数量"
                    v-if="record.editable"
                    :value="record.inventoryQuantity"
                    v-model="inputQuantity"
            />
            <template v-else>
              {{record.inventoryQuantity}}
            </template>
          </template>
          <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
            <a-button type="link" @click="edit(operate.serialNumber)" v-if="!operate.editable">编辑</a-button>
            <a-button type="link" @click="deleteDataSource(operate, i)" v-if="!operate.editable">删除</a-button>
            <a-button type="link" @click="editSave(operate.serialNumber)" v-if="operate.editable">保存</a-button>
            <a-button type="link" @click="editBack(operate.serialNumber)" v-if="operate.editable">返回</a-button>
          </a-space>
        </a-table>
      </div>
      <div class="bottom-frame1" >
        <a-button style="margin-right: 20px" type="primary" @click="submit()" :disabled="dataSource.length == 0">提交</a-button>
        <a-button  @click="goBack()">返回</a-button>
      </div>
    </a-card>
  </div>

</template>

<script>
  import {getMouldOptions, getBill, saveMaterialArray} from '@/api/api'
  export default {

    name: 'newMaterial',
    inject:['closeCurrent'],
    mounted() {
      this.getAppointOption();
    },
    data() {
      return{
        rowClick: record => ({
          // 事件
          on: {
            click: () => {
              this.projectParams.projectNumber = record.projectNumber;
              this.projectParams.size = record.size;
              this.projectParams.modelNumber = record.modelNumber;
              this.projectParams.productionProject = record.productionProject;
              this.projectParams.productionType = record.productionType;
            }
          }
        }),
        factoryWarehouse1: undefined, //二级库存选择
        option: {
          factory_warehouse: [], //二级库存选项
        },
        editSelect: 0, // 是否选择物料信息 1 选中 0 未选中
        selectOptions: [], //物料描述下拉选项
        selectValue:[],// 物料描述选择项
        searchValue:'',
        inputQuantity: '', //输入的库存数量
        editingKey: '',//可编辑
        editableData:{},
        materialBill: '', //物料描述
        dataSource: [],
        newIndex: 1,//新增的序号 每次 删除-1 每次 提交重置成为1
        total: 25, // 共多少条
        pageSize: 10, // 一页多少条
        currentPage: 1, // 当前页
        pageNum: 3, // 共多少页
        jumpPage: 1, // 跳转到第几页
        columns: [
          {
            title: '序号',
            dataIndex: 'serialNumber',
            key: 'serialNumber',
            align: 'center',
          },
          {
            title: '物料描述',
            dataIndex: ' materialBill',
            key: ' materialBill',
            align: 'center',
            width: '200px',
            scopedSlots: { customRender: "materialBill" }
          },
          {
            title: 'SAP编码',
            dataIndex: 'sapNumber',
            key: 'sapNumber',
            align: 'center',
          },
          {
            title: '二级仓库',
            dataIndex: 'factoryWarehouse',
            key: 'factoryWarehouse',
            align: 'center',
            scopedSlots: { customRender: "factoryWarehouse" }
          },
          {
            title: '库存数量',
            dataIndex: 'inventoryQuantity',
            key: 'inventoryQuantity',
            align: 'center',
            scopedSlots: { customRender: "inventoryQuantity" }
          },
          {
            title: '物料类型',
            dataIndex: 'materialType',
            key: 'materialType',
            align: 'center',
          },
          {
            title: '物料组',
            dataIndex: 'materialGroup',
            key: 'materialGroup',
            align: 'center',
          },
          {
            title: '计量单位',
            dataIndex: 'unit',
            key: 'unit',
            align: 'center',
          },
          {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            align: 'center',
            scopedSlots: { customRender: 'operate' },
          },
        ]
      }
    },
    methods:{
      onSearch(searchText) {
        console.log('23333333',searchText);
      },
      onSelect(value) {
        const objArr = value.split('|');
        objArr.forEach((item, index) => {
          this.selectValue[index] = item.split(':')[1];
        })
        if (this.editingKey) {
          const newData = [...this.dataSource];
          // this.editableData[key] = cloneDeep(this.dataSource.filter(item => key === item.serialNumber)[0]);
          const target = newData.filter(item => this.editingKey === item.serialNumber)[0];
          if (target) {
            target.materialBill = this.selectValue[0];
            target.materialGroup = this.selectValue[1];
            target.materialType = this.selectValue[2];
            target.sapNumber = this.selectValue[3];
            target.unit = this.selectValue[4];
            this.dataSource = newData;
          }
        }
      },
      onChange(searchText) {
        if(searchText.indexOf("|") == -1 && searchText.length > 1){
          getBill(searchText).then((data) => {
            this.selectOptions = [];
            const dataATT = data.result;
            dataATT.forEach((item, index) => {
              const  string  = `${index+1}、物料描述:${item.materialBill}|物料组:${item.materialGroup}|物料类型:${item.materialType}|sap编码:${item.sapNumber}|计量单位:${item.unit}`;
              this.selectOptions[index] = string;
            })
          })
        }

      },
      getAppointOption() { // 获取指定的下拉框
        for (let name in this.option) {
          // let searchName = this.humpOrLine(name, 'toLine');
          getMouldOptions(name, '').then((data) => {
            this.option[name] = data;
          });
        }
      },
      handleAdd(){ // 新增行
        this.dataSource.push({});
        this.dataSource[this.newIndex -1].serialNumber = this.newIndex;
        this.newIndex ++;
      },
      goBack() {
        this.$router.push({
          path: `/system/SecondaryInventory`,
        })
        this.closeCurrent();
      },
      deleteDataSource(operate, i) { //删除列表行
        this.dataSource.splice(i,1); //删除指定行
        this.dataSource.forEach((item, index) => { // 改变剩余数据的序号
          if( item.serialNumber > i) {
            item.serialNumber --;
          }
        })
        this.newIndex = this.dataSource.length + 1; // 需改新增 数组的index
      },
      edit(key) {
        const newData = [...this.dataSource];
        // this.editableData[key] = cloneDeep(this.dataSource.filter(item => key === item.serialNumber)[0]);
        const target = newData.filter(item => key === item.serialNumber)[0];
        this.inputQuantity = target.inventoryQuantity;
        this.factoryWarehouse1=target.factoryWarehouse;
        this.searchValue = target.materialBill;
        this.editingKey = key;
        if (target) {
          target.editable = true;
          this.dataSource = newData;
        }

      },
      editBack(key) {
        const newData = [...this.dataSource];
        // this.editableData[key] = cloneDeep(this.dataSource.filter(item => key === item.serialNumber)[0]);
        const target = newData.filter(item => key === item.serialNumber)[0];
        this.editingKey = key;
        if (target) {
          target.editable = false;
          this.dataSource = newData;
        }
      },
      editSave(key) {
        const newData = [...this.dataSource];
        // this.editableData[key] = cloneDeep(this.dataSource.filter(item => key === item.serialNumber)[0]);
        const target = newData.filter(item => key === item.serialNumber)[0];
        this.editingKey = key;
        if (target) {
          target.editable = false;
          if(isNaN(this.factoryWarehouse1)){
            target.factoryWarehouse = this.factoryWarehouse1;
          }else{
            target.factoryWarehouse = this.factoryWarehouse1?this.option.factory_warehouse[this.factoryWarehouse1 -1].label : '';
          }
          target.inventoryQuantity = this.inputQuantity;
          this.dataSource = newData;
        }
        this.searchValue = '';
        this.factoryWarehouse1 = '';
        this.inputQuantity = ''
        // const newData = [...this.dataSource];
        // // this.editableData[key] = cloneDeep(this.dataSource.filter(item => key === item.serialNumber)[0]);
        // const target = newData.filter(item => key === item.serialNumber)[0];
        // this.editingKey = key;
        // if (target) {
        //   target.editable = false;
        //   target.materialBill = this.selectValue[0];
        //   target.materialGroup = this.selectValue[1];
        //   target.materialType = this.selectValue[2];
        //   target.sapNumber = this.selectValue[3];
        //   target.unit = this.selectValue[4];
        //   target.factoryWarehouse = this.factoryWarehouse?this.option.warehouse2_status[this.factoryWarehouse -1].label : '';
        //   target.inventoryQuantity = this.inputQuantity;
        //   this.dataSource = newData;
        //   this.searchValue = '';
        //   this.factoryWarehouse = '';
        //   this.inputQuantity = ''
        // }
      },
      submit() {
        // const arr = this.dataSource;
        const arr = this.dataSource.map( obj => {return  {
            factoryWarehouse: obj.factoryWarehouse,
            inventoryQuantity: obj.inventoryQuantity,
            materialDescription: obj.materialBill,
            materialGroup: obj.materialGroup,
            materialName: obj.materialName,
            materialNo: obj.materialNo,
            materialType: obj.materialType,
            sapNumber: obj.sapNumber,
            unit: obj.unit
          }
        })
        for (let i = 0; i<this.dataSource.length;i++){
          this.option.factory_warehouse.forEach( (item, index) => {
            if(this.dataSource[i].factoryWarehouse == item.label){
              arr[i].factoryWarehouse = item.value;
            }
          })
        }
        // const arr = [
        //   {
        //     factoryWarehouse: 1,
        //     inventoryQuantity: 0,
        //     materialDescription: 1,
        //     materialGroup: "1",
        //     materialName: "1",
        //     materialNo: "1",
        //     materialType: "1",
        //     sapNumber: "1",
        //     unit: "1"
        //   },
        //   {
        //     factoryWarehouse: 2,
        //     inventoryQuantity: 0,
        //     materialDescription: 1,
        //     materialGroup: "1",
        //     materialName: "1",
        //     materialNo: "1",
        //     materialType: "1",
        //     sapNumber: "1",
        //     unit: "1"
        //   }
        // ];
        saveMaterialArray(arr).then((data) => {
          if(data.message == '成功'){
            this.$message.success(data.message);
            this.$router.push({
              path: `/system/SecondaryInventory`,
            })
            this.closeCurrent();
          }else {
            this.$message.warning(data.message);
          }
        })
      }

    },
  }
</script>

<style scoped lang="less">
  .buttonMargin{
    margin-right: 20px;
  }
  .mould-frame-down{
    /*margin-top: 20px;*/
  }
  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }
  .bottom-frame1{
    margin-top: 20px;
    width: 100%;
    display: flex;
  }
  /deep/ .ant-table-body{
    th{
      font-size: 16px;
      color: rgba(0,0,0,.65) !important;
      padding: 12px 16px !important;
    }
    td{
      font-size: 16px;
      color: rgba(0,0,0,.85) !important;
      padding: 8px 16px !important;
      max-height: 24px;
    }
    tr{
      max-height: 24px;
    }
    td:last-child{
      padding: 8px 24px !important;
      .ant-space-item {
        .ant-btn{
          padding: 0 !important;
          height: 16px;
        }
      }
      .ant-space-item:last-child{
        .ant-btn{
          padding: 0;
        }
      }
    }
  }
  /deep/.ant-table-tbody > tr > td{
    padding: 8px 16px;
  }
</style>
