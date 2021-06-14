<template>
  <a-modal :visible="modalVisible" :title="modalTitle" width="1400px" @cancel="handleCancel" class="jn-public-table">
    <div class="table-frame">
      <a-table
        :dataSource="dataSource"
        :columns="columns"
        bordered
        :pagination = false
      >
      </a-table>
    </div>
    <div class="input-back-frame">
      <div class="search-frame">
        <div style="display: flex;flex-wrap: wrap">
          <div v-if="modalTitle=='库存调整' || modalTitle=='待发库库存调整'" style="margin-right: 30px;display: flex;margin-bottom: 10px">
            <span style="font-size: 14px; margin-right: 10px;margin-top:5px;min-width: 60px;">调整类型:</span>
            <a-select  placeholder="请选择" v-model="adjustType"  style="width: 244px;" >
              <a-select-option v-for="data in adjustOption" :key="data.value">
                {{ data.label }}
              </a-select-option>
            </a-select>
          </div>
          <div  v-for="(item,index) in searchData" :key="index" style="margin-right: 30px;display: flex;margin-bottom: 10px">
            <span style="font-size: 14px ;margin-right: 10px;margin-top:5px;min-width: 60px">{{item.title}}:</span>
            <a-input-number
                    v-model:value="item.value"
                    :placeholder="item.placeHolder"
                    :min="0"
                    v-if="item.title=='入库数量' ||item.title=='调整数量' ||item.title=='报废数量' ||item.title=='报废出库' "
                    style="width: 244px;"/>
            <a-input style="width: 244px;" v-model:value="item.value" :placeholder="item.placeHolder" v-else/>
          </div>
        </div>

<!--        <div class="text-frame">-->
          <div class="title-text">
            <span style="margin-right: 20px">备注:</span>
          </div>
          <a-textarea
                  v-model="textArea"
                  placeholder="请输入备注"
                  :auto-size="{ minRows: 2}"
                  style="width: 100%"
          />
<!--        </div>-->
      </div>

    </div>

    <template #footer class="footer">

        <a-spin :spinning="spinning" style="width: 20%;margin: 0 auto">
          <div class="submit-frame">
            <a-button key="submit" type="primary"  @click="handleOk"
                      v-if="modalTitle=='库存调整'||
                      modalTitle=='报废' ||
                      modalTitle=='待发库库存调整' ||
                      modalTitle=='待发库报废'||
                      modalTitle == '报废出库'" >提交</a-button>
            <a-button key="submit" type="primary"  @click="sureWarehousing" v-if="modalTitle=='入库单'">确认入库</a-button>
            <a-button key="submit" type="primary"  @click="handleOk" v-if="modalTitle=='出库单'||modalTitle=='转轮单'">确认出库</a-button>
            <a-button key="back" @click="handleCancel">关闭</a-button>
          </div>
        </a-spin>

    </template>
  </a-modal>
</template>

<script>
  import {submitWarehousing, confirmScrap,updateNum, wareHouseScrap, wareHouseUpdate,sureScrap} from '@/api/api'
  export default {
    name: 'SampleModal',
    props:['modalVisible','modalTitle','dataSource','columns','searchData'],
    computed: {
      // 计算属性的 getter
      get: function () {
        // `this` 指向 vm 实例
        return this.modalVisible
      }
    },
    data(){
      return{
        spinning:false,
        textArea:'',
        adjustType: undefined,
        adjustOption:[
          {
            label:'增加',
            value:'1'
          },
          {
            label:'减少',
            value:'0'
          },
        ]
      }
    },
    methods:{
      handleOk( ) {
        this.spinning = true;
        if(this.modalTitle == '待发库报废'){
          console.log('this.dataSource[0]',this.dataSource[0]);
          const obj = {
            id: this.dataSource[0].id,
            updateSendNum: this.searchData[0].value,
            remark:this.textArea,
            warehouseSendId: this.dataSource[0].warehouseSendId,
            batch:this.dataSource[0].batch,
          }
          confirmScrap(obj).then((data)=>{
            this.spinning = false;
            if(data.message == '成功'){
              this.$emit('close');
              this.$message.success(data.message);
            } else {
              console.log('data', data);
              this.$message.warning(data.message);
            }
          })
        }else if(this.modalTitle == '待发库库存调整'){
          const obj = {
            id: this.dataSource[0].id,
            updateSendNum: this.searchData[0].value,
            remark:this.textArea,
            warehouseSendId: this.dataSource[0].warehouseSendId,
            batch:this.dataSource[0].batch,
            status: this.adjustType
          }
          updateNum(obj).then((data)=>{
            this.spinning = false;
            if(data.message == '成功'){
              this.$emit('close');
              this.adjustType = undefined;
              this.$message.success(data.message);
            } else {
              this.$message.warning(data.message);
            }
          })
        }else if(this.modalTitle == '报废'){
          const obj = {
            id: this.dataSource[0].id,
            updateSendNum: this.searchData[0].value,
            remark:this.textArea,
            warehouseIntoId: this.dataSource[0].warehouseIntoId,
            batch:this.dataSource[0].batch,
          }
          wareHouseScrap(obj).then((data)=>{
            this.spinning = false;
            if(data.message == '成功'){
              this.$emit('close');
              this.$message.success(data.message);
            } else {
              this.$message.warning(data.message);
            }
          })
        }else if(this.modalTitle == '库存调整'){
          const obj = {
            id: this.dataSource[0].id,
            updateSendNum: this.searchData[0].value,
            remark:this.textArea,
            warehouseIntoId: this.dataSource[0].warehouseIntoId,
            batch:this.dataSource[0].batch,
            status: this.adjustType
          }
          wareHouseUpdate(obj).then((data)=>{
            this.spinning = false;
            if(data.message == '成功'){
              this.$emit('close');
              this.adjustType = undefined;
              this.$message.success(data.message);
            } else {
              this.$message.warning(data.message);
            }
          })
        }else if(this.modalTitle == '报废出库'){
          const obj = {
            warehouseScrapId: this.dataSource[0].id,
            scrapNumberOut: this.searchData[0].value,
            remark:this.textArea,
          }
          sureScrap(obj).then((data)=>{
            this.spinning = false;
            if(data.message == '操作成功！'){
              this.$emit('close');
              this.$message.success(data.message);
            } else {
              this.$message.warning(data.message);
            }
          })
        }
        this.textArea = '';

      },
      handleCancel(){
        this.$emit('close');
      },
      sureWarehousing(){
        this.spinning = true;
        const obj = {
          projectNo: this.dataSource[0].projectNo,
          warehouseIntoId: this.dataSource[0].id,
          intoWarehouse: this.searchData[1].value,
          exemplarLocation: this.searchData[0].value,
          remark:this.textArea
        }
        submitWarehousing(obj).then((data)=>{
          this.spinning = false;
         if(data.message == '成功'){
           this.$emit('close');
           this.textArea = '';
           this.$message.success(data.message);
         } else {
           this.$message.warning(data.message);
         }
        })
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
  /deep/.ant-modal-body{
    padding: 0;
  }
  .submit-frame{
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
  }
  .table-frame{
    padding: 24px;
  }
  .search-frame{
    /*width: 100%;*/
    /*display: flex;*/
    /*justify-content: center;*/
    /*!*margin-bottom: 20px;*!*/
    /*align-items: center;*/
  }
  .text-frame{
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;

  }
  .input-back-frame{
    /*background-color: #F5F8FA;*/
    padding: 20px;
    padding-top: 0;
  }
  /deep/ .ant-table-thead {
    th {
      background-color: #E3F1FA;
    }
  }
</style>
