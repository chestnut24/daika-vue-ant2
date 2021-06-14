<template>


    <a-modal :visible="modalVisible" :title="modalTitle" width="1200px" @cancel="handleCancel"  class="jn-public-table" >
      <template v-if="modalVisible">
        <img src="../../assets/chukudanbeijing.png" height="100" style="position: absolute;top: 24px;left: 24px;width: calc(100% - 48px)"/>
        <div class="title-frame">
          <div style="display: flex">
            <div>
              <img src="../../assets/chukudanbeijinglogo.png" height="48" width="48"/>
            </div>
            <div style="width: 100%;padding-left: 10px">
              <div>
                <span>{{projectNo}} </span>
              </div>
              <div style="display: flex;margin-top: 5px">
                <div>
                  <span style="color: rgba(255,255,255,.45)">项目经理:</span>
                  <span class="span-data">{{projectManager}} </span>
                </div>
                <div>
                  <span style="color: rgba(255,255,255,.45)">是否转轮:</span>
                  <span class="span-data">{{ifTurn}} </span>
                </div>
                <div>
                  <span style="color: rgba(255,255,255,.45)">发运流转单:</span>
                  <span class="span-data">{{outNUmber}}</span>
                </div>
              </div>
            </div>
          </div>

          <!--        <div class="item-down">-->
          <!--          <span>戴卡部件号:</span>-->
          <!--          <span class="span-data">{{projectNo}} </span>-->
          <!--        </div>-->




        </div>
        <div class="table-frame" style="margin-top: 64px">
          <div class="title-text">
            <span class="table-title">发样需求</span>
          </div>
          <a-table
            style="margin-top: 10px"
            :dataSource="dataSource"
            :columns="columns"
            bordered
            :pagination = false
          >
          </a-table>
        </div>
        <div class="out-warehouse-frame">
          <div class="title-text">
            <span class="table-title">出库操作</span>
          </div>
          <div class="double-table-frame">
            <div class="left-table">
              <!--          <a-table-->
              <!--            style="margin-top: 10px"-->
              <!--            :dataSource="dataSourceLeft"-->
              <!--            :columns="columnsLeft"-->
              <!--            bordered-->
              <!--            :pagination = false-->
              <!--            :customRow="rowClick"-->
              <!--          >-->
              <!--          </a-table>-->
              <div v-if="dataSourceLeft && dataSourceLeft.length" >
                <!--                <div v-for="data in dataSourceLeft" @click="rowClick2(data)">-->
                <!--                    <a-radio-group :options="plainOptions" :default-value="value1" @change="onChange1" />-->
                <!--                    {{data.batch}}</div>-->
                <a-radio-group name="radioGroup" v-model="radioValue" :default-value="0">
                  <a-radio :class="radioValue === index?'active-left':''" v-for="(data,index) in dataSourceLeft" :value="index" @click="rowClick2(data)">
                    {{data.batch}}
                  </a-radio>
                </a-radio-group>

              </div>
              <a-empty v-else />
            </div>
            <a-tabs style="margin-left: 12px;width: 75%">
              <a-tab-pane key="1" tab="样件库">
                <div>
                  <!--              <span>样件库</span>-->
                  <a-table class="inner-a-table"
                           style="margin-top: 10px"
                           :dataSource="dataSourceRight"
                           :columns="columnsRight"
                           bordered
                           :pagination = false
                  >
                    <template slot="outWarehouse" slot-scope="text, record, i">
                      <a-input-number
                        placeholder="请输入"
                        v-model="record.outWarehouse"
                        :min="0"
                        style="width: 100px"
                      />
                    </template>
                  </a-table>
                </div>
              </a-tab-pane>
              <a-tab-pane key="2" tab="待发库" force-render>
                <div class="right-right-table">
                  <!--              <span>待发库</span>-->
                  <a-table class="inner-a-table"
                           style="margin-top: 10px"
                           :dataSource="dataSourceAdd"
                           :columns="columnsAdd"
                           bordered
                           :pagination = false
                  >
                    <template slot="outWarehouse" slot-scope="text, record, i">
                      <a-input-number
                        placeholder="请输入"
                        v-model="record.outWarehouse"
                        :min = 0
                        style="width: 100%"
                      />
                    </template>
                  </a-table>
                </div>
              </a-tab-pane>
            </a-tabs>


          </div>


        </div>
        <!--    <div class="text-frame">-->
        <div class="title-text" style="margin-top: 16px">
          <span>备注</span>
        </div>
        <a-textarea
          v-model="textArea"
          placeholder="请输入备注"
          :auto-size="{ minRows: 2}"
          style="width: 100%"
        />
        <!--    </div>-->
      </template>
      <template #footer class="footer">
        <a-spin :spinning="spinning" style="width: 30%;margin: 0 auto;">
          <div class="submit-frame">
              <a-button key="submit" type="primary"  @click="handleOk">确认出库</a-button>
              <a-button key="back" @click="handleCancel">关闭</a-button>
          </div>
        </a-spin>
      </template>
    </a-modal>

</template>

<script>
  // 动态计算需要合并的单元格的行
  import pick from 'lodash.pick'

  const temp1 = {}; // 当前重复的值,支持多列
  const mergeCells1 = (text, array, columns) => {
    let i = 0;
    if (text !== temp1[columns]) {
      temp1[columns] = text;
      array.forEach((item) => {
        if (item[columns] === temp1[columns]) {
          i += 1;
        }
      });
    }
    return i;
  };
  const temp2 = {}; // 当前重复的值,支持多列
  const mergeCells2 = (text, array, columns) => {
    let i = 0;
    if (text !== temp2[columns]) {
      temp2[columns] = text;
      array.forEach((item) => {
        if (item[columns] === temp2[columns]) {
          i += 1;
        }
      });
    }
    return i;
  };
  const temp3 = {}; // 当前重复的值,支持多列
  const mergeCells3 = (text, array, columns) => {
    let i = 0;
    if (text !== temp3[columns]) {
      temp3[columns] = text;
      array.forEach((item) => {
        if (item[columns] === temp3[columns]) {
          i += 1;
        }
      });
    }
    return i;
  };
  const mergeCellsNew = (array, columns,index) => {
    let sameRow = array[index][columns];
    let sameNum = 0;
    for(let i =index;i<array.length;i++){
      if(array[i][columns] != sameRow){
        break;
      }else{
        sameNum++;
      }
    }
    return sameNum;
  };
  import {getDemandSample,getWarehouseOutBatchData,outWareHousing,getMouldOptions} from '@/api/api'
  export default {
    name: 'OutBoundModal',
    props:['modalVisible','modalTitle','queryId'],
    mounted() {
      this.getDic();
    },
    updated() {


    },
    watch:{
      queryId(val, oldVal){
        // console.log('val', val, 'oldVal', oldVal);
        // getDemandSample(val).then((data)=>{
        //   console.log('dt',data.result);
        //   this.outNUmber = data.result.shippingFlowSheet;
        //   this.ifTurn = data.result.judgeReel?'是':'否';
        //   this.projectManager = data.result.projectManager;
        //   this.projectNo = data.result.projectNo;
        //   this.dataSourceLeft=[];
        //   if (!data.result.shipmentSendSampleDemandMinVOS.length) {
        //     this.dataSource = [];
        //   }else {
        //     for (let i = 0; i < data.result.shipmentSendSampleDemandMinVOS.length; i++) { // 遍历返回的数据列表
        //       for (let name in data.result.shipmentSendSampleDemandMinVOS[i]) { // 列表每行 for 出每个属性
        //         if (name in this.dic) { // 如果该属性在字典里
        //           for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
        //             if (data.result.shipmentSendSampleDemandMinVOS[i][name] && Number(data.result.shipmentSendSampleDemandMinVOS[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
        //               data.result.shipmentSendSampleDemandMinVOS[i][name] = this.dic[name][j].label;
        //             }
        //           }
        //         }
        //       }
        //     }
        //   }
        //   this.dataSource = data.result.shipmentSendSampleDemandMinVOS;
        //   this.dataSource.forEach((item)=>{
        //     this.dataSourceLeft.push({batch: item.batch, batchType:data.result.batchs[item.batch], array:[]});
        //   })
        //   this.waitingId = data.result.id
        //   this.$nextTick(() => {
        //     this.getRightList(data.result.id);
        //     this.selectBatch = this.dataSourceLeft[0];
        //     setTimeout(()=>{
        //       for(let i =0;i<this.dataSourceLeft.length;i++){
        //         if(this.dataSourceLeft[i].batch == this.selectBatch.batch){
        //           // this.dataSourceRight = JSON.parse(JSON.stringify(this.dataSourceLeft[i].array));
        //           this.dataSourceRight = this.dataSourceLeft[i].array;
        //         }
        //       }
        //     },300);
        //   })
        // })
      },
      modalVisible(val, oldVal){
        getDemandSample(this.queryId).then((data)=>{
          console.log('dt',data.result);
          this.outNUmber = data.result.shippingFlowSheet;
          this.ifTurn = data.result.judgeReel?'是':'否';
          this.projectManager = data.result.projectManager;
          this.projectNo = data.result.projectNo;
          this.dataSourceLeft=[];
          if (!data.result.shipmentSendSampleDemandMinVOS.length) {
            this.dataSource = [];
          }else {
            for (let i = 0; i < data.result.shipmentSendSampleDemandMinVOS.length; i++) { // 遍历返回的数据列表
              for (let name in data.result.shipmentSendSampleDemandMinVOS[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.result.shipmentSendSampleDemandMinVOS[i][name] && Number(data.result.shipmentSendSampleDemandMinVOS[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                      data.result.shipmentSendSampleDemandMinVOS[i][name] = this.dic[name][j].label;
                    }
                  }
                }
              }
            }
          }
          this.dataSource = data.result.shipmentSendSampleDemandMinVOS;
          this.dataSource.forEach((item)=>{
            this.dataSourceLeft.push({batch: item.batch, batchType:data.result.batchs[item.batch], array:[],waitingArray:[],waitingObj:{}});
          })
          this.waitingId = data.result.id
          this.$nextTick(() => {
            this.getRightList(data.result.id);
            this.radioValue = 0;
            this.selectBatch = this.dataSourceLeft[0];
            setTimeout(()=>{
              for(let i =0;i<this.dataSourceLeft.length;i++){
                if(this.dataSourceLeft[i].batch == this.selectBatch.batch){
                  // this.dataSourceRight = JSON.parse(JSON.stringify(this.dataSourceLeft[i].array));
                  this.dataSourceRight = this.dataSourceLeft[i].array;
                  this.dataSourceAdd = this.dataSourceLeft[i].waitingArray;
                }
              }
            },300);
          })
        })
      }
    },
    data(){
      return{
        spinning:false,
        timer:null,
        waitingId:'',//待发库id
        waitingObj:{},//待发库对象
        waitingInput:'',//待发库的输入
        textArea:'',//备注
        outNUmber:'',
        projectNo:'',
        ifTurn:null,
        projectManager: '',
        dic: { // 表单中的部分数据对应的的数据词典
          sendSamplePurpose: [], // 发运送样具体用途
          packagingTransportationMode:[], //发运包装运输方式
          factoryWareHouse:[],//工厂仓库
        },
        columns:[
          {
            title: '发样数量',
            dataIndex: 'sendSample',
            align: "center",
            customRender: (text, row, index) => {
              if(text != ''){
                const obj = {
                  children: text ,
                  attrs: {
                  },
                };
                // obj.attrs.rowSpan = mergeCells1(row.sendSample, this.dataSource, 'sendSample');
                obj.attrs.rowSpan = mergeCellsNew(this.dataSource,'sendSample',index);
                console.log('rowSpan',obj.attrs.rowSpan,index);
                if(obj.attrs.rowSpan == 0 && index == 0){
                  obj.attrs.rowSpan = this.dataSource.length;
                }else if (index !=0&& text == this.dataSource[index-1].sendSample&&this.dataSource.length != 1 &&obj.attrs.rowSpan != 0  ){
                  obj.attrs.rowSpan = 0;
                }
                console.log('rowSpan2',obj.attrs.rowSpan,index);
                return obj;
              }else{
                const obj = {
                  children: text ,
                  attrs: {
                    rowSpan: 1
                  },
                };
                return  text ;
              }
            },
          },
          {
            title: '包装运输方式',
            dataIndex: 'packagingTransportationMode',
            align: "center",
            customRender: (text, row, index) => {

              if(text != ''){
                const obj = {
                  children: text ,
                  attrs: {},
                };
                // obj.attrs.rowSpan = mergeCells2(row.packagingTransportationMode, this.dataSource, 'packagingTransportationMode');
                obj.attrs.rowSpan = mergeCellsNew(this.dataSource,'packagingTransportationMode',index);
                if(obj.attrs.rowSpan == 0 && index == 0){
                  obj.attrs.rowSpan = this.dataSource.length;
                }else if (index !=0&& text == this.dataSource[index-1].packagingTransportationMode&&this.dataSource.length != 1 &&obj.attrs.rowSpan != 0){
                  obj.attrs.rowSpan = 0;
                }

                return obj;
              }else{
                const obj = {
                  children: text ,
                  attrs: {
                    rowSpan: 1
                  },
                };
                return  text ;
              }
            },
          },
          {
            title: '送样具体用途',
            dataIndex: 'sendSamplePurpose',
            align: "center",
            customRender: (text, row, index) => {
              if(text != ''){
                const obj = {
                  children: text ,
                  attrs: {},
                };
                // obj.attrs.rowSpan = mergeCells3(row.sendSamplePurpose, this.dataSource, 'sendSamplePurpose');
                obj.attrs.rowSpan = mergeCellsNew(this.dataSource,'sendSamplePurpose',index);
                if(obj.attrs.rowSpan == 0 && index == 0){
                  obj.attrs.rowSpan = this.dataSource.length;
                }else if (index !=0&& text == this.dataSource[index-1].sendSamplePurpose&&this.dataSource.length != 1 &&obj.attrs.rowSpan != 0){
                  obj.attrs.rowSpan = 0;
                }
                // console.log('row3改',index, obj.attrs.rowSpan);

                return obj;
              }else{
                const obj = {
                  children: text ,
                  attrs: {
                    rowSpan: 1
                  },
                };
                return  text ;
              }
            },
          },
          {
            title: '批次号',
            dataIndex: 'batch',
            align: "center",
          },
          {
            title: '待查库存',
            dataIndex: 'stock',
            align: "center",
          },
          {
            title: '待发库存',
            dataIndex: 'stockSend',
            align: "center",
          },
          {
            title: '已出库数量',
            dataIndex: 'outWarehouse',
            align: "left",
          },
      ],
        dataSource:[],
        columnsLeft:[ //批次号选择框
          {
            title: '批次号',
            dataIndex: 'batch',
            align: "center",
          },
        ],
        dataSourceLeft:[],//处理后的批次号数组
        dataSourceRight:[],//右侧输入出库的数组
        columnsRight:[
          { title: '工厂仓库', dataIndex: 'factoryWareHouse', align: "center", },
          { title: '库位', dataIndex: 'inventoryLocation', align: "center", },
          { title: '样件位置', dataIndex: 'exemplarLocation', align: "center", },
          { title: '待查库存', dataIndex: 'stock', align: "center", },
          { title: '已出库', dataIndex: 'previousOutWarehouse', align: "center", },
          { title: '出库', dataIndex: 'outWarehouse', align: "outWarehouse",scopedSlots: { customRender: "outWarehouse" } },
        ],
        selectBatch:'', //左侧选择的批次号
        dataSourceAdd:[],// 最右侧待发库输入数组
        columnsAdd:[
          { title: '待发库存', dataIndex: 'stock', align: "center", },
          { title: '已出库', dataIndex: 'previousOutWarehouse', align: "center", },
          { title: '出库', dataIndex: 'outWarehouse', align: "outWarehouse",width:200,scopedSlots: { customRender: "outWarehouse" } },
        ],
          radioValue:0,
      }
    },
    methods:{
      handleOk( ) {
        this.spinning = true;
        const self = this;
        // this.$emit('OutClose');
        const objArr = [];
        for(let i=0;i<this.dataSourceLeft.length;i++){
          if(this.dataSourceLeft[i].array && this.dataSourceLeft[i].array.length){
            this.dataSourceLeft[i].array.forEach((item)=>{
              if(item.outWarehouse){
                objArr.push(item);
              }
            })
          }
          if(this.dataSourceLeft[i].waitingArray && this.dataSourceLeft[i].waitingArray.length){
            console.log('456',this.dataSourceLeft[i].waitingObj);
            if(this.dataSourceLeft[i].waitingObj.batch){
              this.dataSourceLeft[i].waitingArray.forEach((item)=>{
                objArr.push({
                  batch:this.dataSourceLeft[i].waitingObj.batch,
                  batchType:this.dataSourceLeft[i].waitingObj.batchType,
                  id:this.dataSourceLeft[i].waitingObj.id,
                  warehouseOutId:this.waitingId,
                  outWarehouse:this.dataSourceLeft[i].waitingArray[0].outWarehouse,
                })
              })
            }
          }
        }
        const obj = {
          remark: this.textArea,
          warehouseOutLogDTOList: objArr
        }
        outWareHousing(obj).then((data)=>{
          this.spinning = false;
          if(data.message == '成功'){
            this.$emit('OutClose');
            self.destroyAll()
            this.$message.success('出库成功');
            this.dataSourceRight = [];
            for(let i=0;i<this.dataSourceLeft.length;i++){
              if(this.dataSourceLeft[i].array && this.dataSourceLeft[i].array.length){
                this.dataSourceLeft[i].array.forEach((item)=>{
                  item.outWarehouse = '';
                })
              }
            }
            this.textArea = '';
            this.waitingInput = '';
          } else {
            this.$message.warning(data.message);
          }
        })
      },
      handleCancel(){
        this.waitingInput = '';
        this.textArea = '';
        this.$emit('OutClose');
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
      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          getMouldOptions(searchName, '').then((data) => {
            this.dic[name] = data;
          });
        }
      },
      rowClick(record) {
        console.log('balabala',record);
        // 事件
        return {
          on: {
            click: () => {
              this.selectBatch = record;
              this.dataSourceRight = [];
              setTimeout(()=>{
                for(let i =0;i<this.dataSourceLeft.length;i++){
                  if(this.dataSourceLeft[i].batch == this.selectBatch.batch){
                    // this.dataSourceRight = JSON.parse(JSON.stringify(this.dataSourceLeft[i].array));
                    this.dataSourceRight = this.dataSourceLeft[i].array;
                  }
                }

              },300);
            }
          },
          style: {
            'background-color': record === this.selectBatch ? '#e6f7ff' : 'white'
          },
        }
      },
        rowClick2(record){
            this.selectBatch = record;
            this.dataSourceRight = [];
            setTimeout(()=>{
                for(let i =0;i<this.dataSourceLeft.length;i++){
                    if(this.dataSourceLeft[i].batch == this.selectBatch.batch){
                        // this.dataSourceRight = JSON.parse(JSON.stringify(this.dataSourceLeft[i].array));
                        this.dataSourceRight = this.dataSourceLeft[i].array;
                        this.dataSourceAdd = this.dataSourceLeft[i].waitingArray;
                    }
                }

            },300);
        },
      getRightList(id){//获取右侧 批次号详细信息函数
        for(let i =0;i<this.dataSourceLeft.length;i++){
          getWarehouseOutBatchData({batch:this.dataSourceLeft[i].batch, batchType:this.dataSourceLeft[i].batchType,warehouseOutId:id}).then((data)=>{
            console.log('data333', data);
            this.dataSourceLeft[i].waitingArray = [];
            if (!data.result.warehouseOutTableMaxVOS.length) {
              this.dataSourceLeft[i].array = [];
            }else {
              for (let i = 0; i < data.result.warehouseOutTableMaxVOS.length; i++) { // 遍历返回的数据列表
                for (let name in data.result.warehouseOutTableMaxVOS[i]) { // 列表每行 for 出每个属性
                  if (name in this.dic) { // 如果该属性在字典里
                    for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                      if (data.result.warehouseOutTableMaxVOS[i][name] && Number(data.result.warehouseOutTableMaxVOS[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                        data.result.warehouseOutTableMaxVOS[i][name] = this.dic[name][j].label;
                      }
                    }
                  }
                }
              }
            }
            this.dataSourceLeft[i].array = data.result.warehouseOutTableMaxVOS;
            this.dataSourceLeft[i].array.forEach((item) => {item.warehouseOutId = this.queryId;});
            this.dataSourceLeft[i].waitingObj = data.result;
            this.dataSourceLeft[i].waitingArray.push({
              stock:data.result.stock,
              previousOutWarehouse:data.result.previousOutWarehouse
            })
            // this.dataSourceAdd.push({
            //   stock:data.result.stock,
            //   previousOutWarehouse:data.result.previousOutWarehouse
            // })
          })
        }
      },
      // inputSet(text,record, index){ //设置 input数据
      //   for(let i = 0;i<this.dataSourceLeft.length;i++){
      //     if(this.dataSourceLeft[i].batch == record.batch){
      //       this.dataSourceLeft[i].array[index].outWarehousing = record.outWarehousing
      //     }
      //   }
      //   console.log('199',this.dataSourceLeft);
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
  .title-frame{
    display: flex;
    padding-left: 10px;
    margin-bottom: 20px;
    color: #fff;
    position: relative;
    z-index: 100;
    top: 24px;
    left: 24px;
  }
  .row-down{
    margin-left: 20px;
  }
  .item-down{
    margin-top: 10px;
  }
  .span-data{
    margin-left: 10px;
    margin-right: 30px;
    color: rgba(255,255,255,.65);
  }
  .text-frame{
    width: 75%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px auto;
  }
  .table-title{
    padding: 10px 10px;
    font-weight: bold;
    font-size: 15px;
    margin-bottom: 10px;
  }
  .out-warehouse-frame{
    width: 100%;
    margin-top: 12px;
  }
  .double-table-frame{
    width: 100%;
    display: flex;
    /*justify-content: space-between;*/
  }
  .left-table{
    width: calc(25% - 2px);
      overflow-x: hidden;
    /*padding-right:2px ;*/
    border-width: 0 2px 0 0;
    border-style: solid;
    border-color: #347EF2;
    margin-top: 21px;
      max-height: 240px;
      overflow-y: auto;
      /deep/ .ant-radio-wrapper{
        padding: 10px;
          background-color: #F7F8FA;
          margin-bottom: 6px;
          width: 100%;
      }


  }
  .right-table{
    /*width: 50%;*/
    padding-right:10px ;
    border-width: 0 2px 0 0;
    border-style: solid;
    border-color: #D7D7D7;
  }
  .right-right-table{
    /*width: 20%;*/
  }
  /deep/ .ant-modal-body{
    position: relative;
  }
    .inner-a-table {
       /deep/ .ant-table-body{
           td{
               font-size: 16px;
               color: rgba(0,0,0,.85) !important;
               padding: 8px 16px !important;
               max-height: 24px;
           }
       }
        /deep/ .ant-table-thead{
            tr{
                background-color: #E3F1FA !important;
                th{
                    background-color: #E3F1FA !important;

                }
            }
        }
    }
    .active-left{
        background-color: #347EF2 !important;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        color: #fff !important;
    }
</style>
