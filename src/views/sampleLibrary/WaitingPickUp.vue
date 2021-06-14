<template>
  <a-modal :visible="modalVisible" title="待发库提货" width="1200px" @cancel="handleCancel" class="jn-public-table">
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
        <template slot="updateSendNum" slot-scope="text, record, i">
          <a-input-number
            placeholder="请输入"
            v-model="record.updateSendNum"
            style="width: 174px;"
          />
        </template>
        <template slot="remark" slot-scope="text, record, i">
          <a-input
            placeholder="请输入"
            v-model="record.remark"
          />
        </template>
      </a-table>
    </div>
    <template #footer class="footer">
      <a-spin :spinning="spinning" style="width: 20%;margin: 0 auto;">
        <div class="submit-frame">
            <a-button key="submit" type="primary"  @click="sureWarehousing">提货</a-button>
            <a-button key="back" @click="handleCancel">关闭</a-button>
        </div>
      </a-spin>
    </template>
  </a-modal>
</template>

<script>
  import {getMouldOptions,submitReturn,postPickUpList} from '@/api/api'
  export default {
    name: 'WaitingPickUp',
    props:['modalVisible','dataSource','columns','dataSourceInput'],
    data(){
      return{
        spinning:false,
        columnsInput:[
          { title: '入库批次', dataIndex: 'batch', key: 'batch', align: 'center'},
          { title: '待发数量', dataIndex: 'needSendNum', key: 'needSendNum', align: 'center'},
          { title: '待发需求', dataIndex: 'needSendNumDemand', key: 'needSendNumDemand', align: 'center'},
          { title: '已提货', dataIndex: 'outWarehouseNum', key: 'outWarehouseNum', align: 'center'},
          { title: '提货数量', dataIndex: 'updateSendNum', key: 'updateSendNum', align: 'center' ,width:200,scopedSlots: { customRender: "updateSendNum" }},
          { title: '备注', dataIndex: 'remark', key: 'remark', align: 'center',width:350,scopedSlots: { customRender: "remark" }},
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
      handleCancel(){
        this.$emit('close');
      },
      sureWarehousing(){
        // this.$emit('close');

        const arrList = this.dataSourceInput.map( obj => {return  {
          batch: obj.batch,
          exemplarLocation: obj.exemplarLocation,
          id: this.dataSource[0].id,
          inventoryLocation: obj.inventoryLocation,
          outWarehouse: obj.outWarehouse,
          trialProductionSite: obj.trialProductionSite,
          warehouseReturnId:obj.id
        }
        })
        const obj = {
          remark: this.textArea,
          warehouseReturnLogDTOS: arrList,
        }
        submitReturn(obj).then((data)=>{
          if(data.message == '成功'){
            this.$emit('close');
            this.$message.success('回库成功');
          } else {
            this.$message.warning('回库失败');
          }
        })
      },
      sureWarehousing(){
        this.spinning = true;
        console.log('data', this.dataSourceInput);
        postPickUpList(this.dataSourceInput).then((data)=>{
          this.spinning = false;
          if(data.message == '成功'){
            this.$emit('close');
            this.$message.success('提货成功');
          } else {
            this.$message.warning('提货失败');
          }
        })
      }
      // selectChange(record,i){
      //   this.arr = [...this.dataSourceInput];
      //   this.option.factory_warehouse.forEach((item, index)=>{
      //     if(record.trialProductionSite == item.value){
      //       this.arr[i].inventoryLocation = item.description;
      //     }
      //   })
      //   this.$emit('changeData',this.arr);
      // }
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
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }
  .jn-public-table{
    /deep/  td{
      text-align: left !important;
    }
    /deep/ th{
      text-align: left !important;
      background-color: #F5F8FA !important;
    }
  }

</style>
