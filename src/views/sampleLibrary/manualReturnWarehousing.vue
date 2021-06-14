<template>
    <a-modal :visible="modalVisible" title="手动回库单" width="1200px" @cancel="handleCancel"  class="jn-public-table">
      <div class="table-frame">
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          bordered
          :pagination = false
        >
          <template  slot="projectNo" slot-scope="text, record,i">
            <a-input
              placeholder="请输入"
              v-model="record.projectNo"
              @change="getPurpose(record,i)"
              style="width: 180px"
            />
          </template>
          <template  slot="purpose" slot-scope="text, record,i">
            <a-select  placeholder="请选择" v-model="record.purpose"  style="width: 100px;"  @change="getBatch(record,i)">
              <a-select-option v-for="(data,index) in record.purposeArr" :key="data">
                {{ data }}
              </a-select-option>
            </a-select>
          </template>
          <template  slot="batch" slot-scope="text, record,i">
            <a-select  placeholder="请选择" v-model="record.batch"  style="width: 180px;"  >
              <a-select-option v-for="(data,index) in record.batchArr" :key="data">
                {{ data }}
              </a-select-option>
            </a-select>
          </template>
          <template  slot="outWarehouse" slot-scope="text, record,i">
            <a-input
              placeholder="请输入"
              v-model="record.outWarehouse"
              style="width: 100px"
            />
          </template>
          <template  slot="trialProductionSite" slot-scope="text, record,i">
            <a-select  placeholder="请选择" v-model="record.trialProductionSite"  style="width: 100px;" @select="selectChange(record,i)">
              <a-select-option v-for="data in option.factory_ware_house" :key="data.value">
                {{ data.label }}
              </a-select-option>
            </a-select>
          </template>
          <template  slot="exemplarLocation" slot-scope="text, record,i">
            <a-input
              placeholder="请输入"
              v-model="record.exemplarLocation"
              style="width: 70px"
            />
          </template>
          <template  slot="operate" slot-scope="text, record,i">
            <a-button type="link" @click="deleteRecord(record,i)">删除</a-button>
          </template>
        </a-table>
        <a-button class="editable-add-btn" @click="handleAdd" style="margin: 8px 0;width: 100%;background-color:#E0EBFD;color:#347EF2;padding: 3px ">+</a-button>
      </div>
      <div class="text-frame">
        <div style="margin-bottom: 10px;padding:5px;background-color: #F2F3F6;">
          <span class="search-hidden-text">备注:</span>
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
              <a-button style="margin-right: 8px" key="submit" type="primary" @click="completeReturn">确认回库</a-button>
              <a-button style="margin-right: 32px" key="back" @click="handleCancel">关闭</a-button>
          </div>
        </a-spin>

      </template>
    </a-modal>
</template>

<script>
  import {getPurpose,getBatch,getMouldOptions,manualReturn} from  '@/api/api'
  export default {
    name: 'manualReturnWarehousing',
    mounted() {
      this.getAppointOption();
      this.getDic();
    },
    data(){
      return{
        spinning:false,
        textArea:'',
        columns:[
          {title: '戴卡部件号', dataIndex: 'projectNo', key: 'projectNo', align: 'center',width:200,scopedSlots: { customRender: "projectNo" }},
          {title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'center',scopedSlots: { customRender: "purpose" }},
          {title: '入库批次', dataIndex: 'batch', key: 'batch', align: 'center',width:150,scopedSlots: { customRender: "batch" }},
          {title: '回库数量', dataIndex: 'outWarehouse', key: 'outWarehouse', align: 'center',scopedSlots: { customRender: "outWarehouse" }},
          {title: '工厂仓库', dataIndex: 'trialProductionSite', key: 'trialProductionSite', align: 'center',scopedSlots: { customRender: "trialProductionSite" }},
          {title: '库位', dataIndex: 'inventoryLocation', key: 'inventoryLocation', align: 'center'},
          {title: '样件位置', dataIndex: 'exemplarLocation', key: 'exemplarLocation', align: 'center',scopedSlots: { customRender: "exemplarLocation" }},
          {title: '操作', dataIndex: 'operate', key: 'operate', align: 'center',width:100,scopedSlots: { customRender: "operate" }},
        ],
        dataSource:[],
        timer:null,
        option: {
          factory_ware_house: [], //二级库存选项
        },
        dic:{
          noun:[],
        }
      }
    },
    props:['modalVisible'],
    methods:{
      deleteRecord(record,i){ //删除指定行
        this.dataSource.splice(i,1); //删除指定行
      },
      handleCancel(){
        this.$emit('manualClose');
      },
      handleAdd(){
        this.dataSource.push({})
      },
      getPurpose(record,i){
        // 输入框防抖
        clearTimeout(this.timer) // 每次进来的时候都将之前的清除掉，如果还没到一秒的时候就将之前的清除掉，这样就不会触发之前setTimeout绑定的事件， 如果超过一秒，之前的事件就会被触发下次进来的时候同样清除之前的timer
        this.timer = setTimeout(() => {
          // 切换为搜索
          getPurpose({projectNo: record.projectNo}).then((data)=>{
            console.log('data.result', data.result);
            this.$set(this.dataSource[i], 'purposeArr', data.result);
            this.$nextTick(()=>{
              const arr = [...this.dataSource];
              arr[i].purposeArr.forEach((item ,index)=>{
                this.dic.purpose.forEach((item2,index2)=>{
                  if(item == item2.value){
                    arr[i].purposeArr[index] = item2.label;
                  }
                })
              })
              this.dataSource = arr;
            })
          })
        }, 400)
      },
      getBatch(record,i){
        let purposeValue = 0;
        this.dic.purpose.forEach((item,index)=>{
          if(record.purpose == item.label){
            purposeValue = item.value;
          }
        })
        getBatch({
          projectNo: record.projectNo,
          purpose: purposeValue,
        }).then((data)=>{
          console.log('3333', data.result);
          let arr = [...this.dataSource];
          arr[i].batchArr = data.result;
          this.dataSource = arr //待定
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
        let arr = [...this.dataSource];
        this.option.factory_ware_house.forEach((item, index)=>{
          if(record.trialProductionSite == item.value){
            arr[i].inventoryLocation = item.description;
          }
        })
        this.dataSource = arr;
      },
      completeReturn(){
        this.spinning = true;
        let arr = [...this.dataSource];
        arr.forEach((item,index)=>{
          this.dic.purpose.forEach((item2)=>{
            if(item2.label == item.purpose){
              arr[index].purpose = item2.value;
            }
          })
        })
        const obj = {
          remark: this.textArea,
          warehouseReturnLogDTOS: arr,
        }
        manualReturn(obj).then((data)=>{
          this.spinning = false;
          if(data.message == '成功'){
            this.$emit('manualClose');
            this.dataSource = [];
            this.$message.success(data.message);
          } else {
            this.$message.warning(data.message);
          }
        })
      },
      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          getMouldOptions(searchName, '').then((data) => {
            this.dic[name] = data;
            if (name === 'noun') {
              this.dic.purpose = this.dic.noun;
            }
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
  .text-frame{
    /*width: 70%;*/
    /*display: flex;*/
    /*align-items: center;*/
    /*justify-content: center;*/
    /*margin: 0 auto;*/
  }
  .table-frame{
    margin-bottom: 20px;
  }
  /deep/ .ant-table-thead>tr{
    background-color: #E3F1FA !important;
    th{
      background-color: #E3F1FA !important;

    }
  }
  .search-hidden-text{
    padding-left: 15px;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      left: 3px;
      height: 20px;
      width: 4px;
      background-color:  #1790FA;
      border-radius: 2px;
    }
  }

</style>
