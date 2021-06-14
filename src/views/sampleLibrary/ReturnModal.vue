<template>
  <a-modal class="jn-public-table" :visible="modalVisible" :title="modalTitle" width="1200px" @cancel="handleCancel">
    <div class="table-frame">
      <a-table
        :dataSource="dataSource"
        :columns="columns"
        bordered
        :pagination = false
      >
      </a-table>
    </div>
    <div class="input-table-frame">
      <a-table
        :dataSource="dataSourceInput"
        :columns="columnsInput"
        bordered
        :pagination = false
      >
        <template slot="outWarehouse" slot-scope="text, record, i">
          <a-input-number
            placeholder="请输入"
            v-model="record.outWarehouse"
            style="width: 100px"
            :min = 0
          />
        </template>
        <template  slot="trialProductionSite" slot-scope="text, record,i">
          <a-select  placeholder="请选择" v-model="record.trialProductionSite"  style="width: 100px;" @select="selectChange(record,i)">
            <a-select-option v-for="data in option.factory_warehouse" :key="data.value">
              {{ data.label }}
            </a-select-option>
          </a-select>
        </template>
        <template slot="exemplarLocation" slot-scope="text, record, i">
          <a-input
            placeholder="请输入"
            v-model="record.exemplarLocation"
            style="width: 100px"
          />
        </template>
      </a-table>
    </div>
    <div class="text-frame">
      <div class="title-text">
        <span style="margin-right: 20px">备注:</span>
      </div>
      <a-textarea
        v-model="textArea"
        placeholder="请输入备注"
        :auto-size="{ minRows: 2}"
        style="width: 100%"
      />
    </div>
    <template #footer class="footer">
      <a-spin :spinning="spinning" style="width: 20%;margin: 0 auto;">
        <div class="submit-frame">
            <a-button key="submit" type="primary"  @click="sureWarehousing">确认回库</a-button>
            <a-button key="back" @click="handleCancel">关闭</a-button>
        </div>
      </a-spin>
    </template>
  </a-modal>
</template>

<script>
  import {getMouldOptions,submitReturn} from '@/api/api'
  export default {
    name: 'ReturnModal',
    props:['modalVisible','modalTitle','dataSource','columns','dataSourceInput'],
    mounted() {
        this.getAppointOption();
    },
    data(){
      return{
        spinning:false,
        columnsInput:[
          { title: '入库批次', dataIndex: 'batch', key: 'batch', align: 'center'},
          { title: '待回数量', dataIndex: 'needReturnNum', key: 'needReturnNum', align: 'center'},
          { title: '已回数量', dataIndex: 'returnNum', key: 'returnNum', align: 'center'},
          { title: '回库数量', dataIndex: 'outWarehouse', key: 'outWarehouse', align: 'center',scopedSlots: { customRender: "outWarehouse" }},
          { title: '工厂仓库', dataIndex: 'trialProductionSite', key: 'trialProductionSite', align: 'center' ,scopedSlots: { customRender: "trialProductionSite" }},
          { title: '库位', dataIndex: 'inventoryLocation', key: 'inventoryLocation', align: 'center'},
          { title: '样件位置', dataIndex: 'exemplarLocation', key: 'exemplarLocation', align: 'left',scopedSlots: { customRender: "exemplarLocation" }},
        ],
        textArea:'',
        modalVisible1:false,
        adjustType: '',
        outWarehouseNumber:'',//回库数量
        factoryWarehouse1:undefined,//仓库
        arr:[], //暂存数组
        option: {
          factory_warehouse: [], //二级库存选项
        },
      }
    },
    methods:{
      handleOk( ) {
        this.$emit('close');
      },
      handleCancel(){
        this.$emit('close');
      },
      sureWarehousing(){
        this.spinning = true;
        // this.$emit('close');
        const arrList = this.dataSourceInput.map( obj => {return  {
          batch: obj.batch,
          exemplarLocation: obj.exemplarLocation,
          id: obj.id,
          inventoryLocation: obj.inventoryLocation,
          outWarehouse: obj.outWarehouse,
          trialProductionSite: obj.trialProductionSite,
          warehouseReturnId:this.dataSource[0].id,
        }
        })
        const obj = {
          remark: this.textArea,
          warehouseReturnLogDTOS: arrList,
        }
        submitReturn(obj).then((data)=>{
          this.spinning = false;
          if(data.message == '成功'){
            this.$emit('close');
            this.$message.success(data.message);
          } else {
            this.$message.warning(data.message);
          }
        })
      },
      getAppointOption() { // 获取指定的下拉框
        for (let name in this.option) {
          // let searchName = this.humpOrLine(name, 'toLine');
          getMouldOptions(name, '').then((data) => {
            this.option[name] = data;
          });
        }
      },
      selectChange(record,i){
        this.arr = [...this.dataSourceInput];
        this.option.factory_warehouse.forEach((item, index)=>{
          if(record.trialProductionSite == item.value){
            this.arr[i].inventoryLocation = item.description;
          }
        })
        this.$emit('changeData',this.arr);
      }
    }
  }
</script>

<style scoped lang="less">
  @import "./../../css/public-table-css";

  /deep/.ant-modal-footer{
    width: 100%;

  }
  /deep/.ant-modal-title{
    font-weight: bold;
  }
  .submit-frame{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .table-frame{
    margin-bottom: 40px;
  }
  .search-frame{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  .input-table-frame{
    margin-bottom: 20px;
  }
  .text-frame{
    /*width: 70%;*/
    /*display: flex;*/
    /*align-items: center;*/
    /*justify-content: center;*/
    /*margin: 0 auto;*/
  }
  /*/deep/.jn-public-table[data-v-273a144e] .ant-table-body td{*/
  /*  max-height: 1000px !important;*/
  /*}*/

</style>
