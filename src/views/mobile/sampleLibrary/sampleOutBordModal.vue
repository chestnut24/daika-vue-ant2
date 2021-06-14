<template>
    <div class="all-frame">
      <div class="title-frame">
<!--        <div class="status-frame">-->
<!--          <span style="color:#09C199;">转轮</span>-->
<!--        </div>-->
        <div class="title-name">
          <img src="../../../assets/sampleLibrary/sampleOutBordLogo.png" height="24" width="24"/>
          <span style="font-size: 18px;margin-left: 8px"><b>{{titleParams.projectNo}}</b></span>
        </div>
        <img src="../../../assets/trialExe/on_machine_page_split.png" height="8" width="694"/>
        <div class="title-down">
          <div class="information-item-up">
            <div class="information-top">
              <span class="information-item-top">项目经理：{{titleParams.projectManager}}</span>
              <span class="information-item-top">是否转轮：{{titleParams.judgeReel}}</span>
            </div>
            <span class="information-item">发运流转单号：{{titleParams.shippingFlowSheet}}</span>
          </div>
        </div>
      </div>
      <div class="table-frame">
        <div class="technology-title">
          <span class="divide"> </span>
          <span><b>发样需求</b></span>
        </div>
        <div class="demand-frame">
          <a-table
            style="margin-top: 10px"
            :dataSource="dataSource"
            :columns="columns"
            bordered
            :pagination = false
          >
          </a-table>
        </div>
        <div class="technology-title">
          <span class="divide"> </span>
          <span><b>出库操作</b></span>
        </div>
        <div class="select-frame">
          <a-select placeholder="请选择批次号" style="width: 100%" @change="changeBatch">
            <a-select-option v-for="(item,index) in batchDataSource" :value="item.batch" :key="index">
              <span>{{item.batch}}</span>
            </a-select-option>
          </a-select>
          <div class="batch-input-frame" v-for="(item,index) in dataSourceSelect" :key="index">
            <div class="batch-input-item">
              <span>工厂仓库：{{item.factoryWareHouse}}</span>
            </div>
            <div class="batch-input-item">
              <span>库位：{{item.inventoryLocation}}</span>
            </div>
            <div class="batch-input-item">
              <span>样件位置：{{item.exemplarLocation}}</span>
            </div>
            <div class="batch-input-item">
              <span>待查库存：{{item.stock}}</span>
            </div>
            <div class="batch-input-item" style="height: 32px;display: flex;align-items: center">
              <span>已出库：{{item.previousOutWarehouse}}</span>
            </div>
            <div class="batch-input-item">
              <span>出库：<a-input style="width: 80px;background: #fff !important;" v-model="item.outWarehouse" placeholder="请输入"></a-input></span>
            </div>
          </div>
        </div>

      </div>
      <div class="down-remark-frame">
        <div class="input-remark">
          <span >备注：</span>
          <a-textarea
            placeholder="请输入备注"
            v-model="remark"
            :auto-size="{ minRows: 4}"
            style="margin-top: 5px"
          />
        </div>
        <div class="button-style">
          <a-button type="primary" style="width: 100%;height: 48px;font-size: 18px" v-if="ifTurn" @click="sureOutBord">确认出库</a-button>
          <a-button type="primary" style="width: 48%;height: 48px;font-size: 18px" v-if="!ifTurn" @click="wheelComplete">转轮完成</a-button>
          <a-button type="primary" style="width: 48%;height: 48px;font-size: 18px" v-if="!ifTurn" @click="sureOutBord">确认出库</a-button>
        </div>
      </div>
    </div>
</template>

<script>
  const temp = {}; // 当前重复的值,支持多列
  const mergeCells = (text, array, columns) => {
    let i = 0;
    if (text !== temp[columns]) {
      temp[columns] = text;
      array.forEach((item) => {
        if (item[columns] === temp[columns]) {
          i += 1;
        }
      });
    }
    return i;
  };
  import {getDemandSample,getMouldOptions,getWarehouseOutBatchData,outWareHousing,confirmComplete} from  '@api/api';
  export default {
    name: 'sampleOutBordModal',
    mounted() {
      this.getDic();
      setTimeout(()=>{
        if(this.$route.query.id){
          this.outBordId = this.$route.query.id;
          this.ifTurn = this.$route.query.judgeReel == '1';
          getDemandSample(this.outBordId).then((data)=>{
            console.log('data23333', data);
            this.titleParams.shippingFlowSheet = data.result.shippingFlowSheet;
            this.titleParams.judgeReel = data.result.judgeReel?'是':'否';
            this.titleParams.projectManager = data.result.projectManager;
            this.titleParams.projectNo = data.result.projectNo;
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
            this.batchDataSource = [];
            this.dataSource.forEach((item)=>{
              this.batchDataSource.push({batch: item.batch, batchType:data.result.batchs[item.batch], array:[]});
            })
            this.$nextTick(() => {
              this.getRightList(data.result.id);
            })
          })
        }
      },300)

    },
    data(){
      return{
        selectBatch:'',//选择的批次号
        ifTurn:true,//是否转轮 判断 从哪个路由来的
        outBordId:'',//路由查出来的 出库单的id
        titleParams:{//标题展示的该出库单 详细信息
          projectNo:'',
          projectManager:'',
          judgeReel:'',
          shippingFlowSheet:''
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
                  attrs: {},
                };
                obj.attrs.rowSpan = mergeCells(row.sendSample, this.dataSource, 'sendSample');
                return obj;
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
                obj.attrs.rowSpan = mergeCells(row.packagingTransportationMode, this.dataSource, 'packagingTransportationMode');
                return obj;
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
                obj.attrs.rowSpan = mergeCells(row.sendSamplePurpose, this.dataSource, 'sendSamplePurpose');
                return obj;
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
            align: "center",
          },
        ],
        dataSource:[],//发样需求展示的表格
        dic: { // 表单中的部分数据对应的的数据词典
          sendSamplePurpose: [], // 发运送样具体用途
          packagingTransportationMode:[], //发运包装运输方式
        },
        batchDataSource:[],//批次号分开的下拉数组
        remark:'',//备注
        dataSourceSelect:[
          {
            factoryWareHouse:'',//工厂仓库
            inventoryLocation:'',//库位
            exemplarLocation:'',//样件位置
            stock:'',//待查库存
            previousOutWarehouse:'',//已出库
            outWarehouse:'',//出库
          }
        ]

      }
    },
    methods:{
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
      changeBatch(value){//选择对应的戴卡部件号
        console.log('value', value);
        this.selectBatch = value;
        this.dataSourceSelect = [];
        setTimeout(()=>{
          for(let i =0;i<this.batchDataSource.length;i++){
            console.log('array',this.batchDataSource[i].batch, this.batchDataSource[i].array);
            if(this.batchDataSource[i].batch == this.selectBatch){

              // this.dataSourceRight = JSON.parse(JSON.stringify(this.dataSourceLeft[i].array));
              this.dataSourceSelect = this.batchDataSource[i].array;
            }
          }

        },300);
      },
      getRightList(id){//获取右侧 批次号详细信息函数
        for(let i =0;i<this.batchDataSource.length;i++){
          getWarehouseOutBatchData({batch:this.batchDataSource[i].batch, batchType:this.batchDataSource[i].batchType,warehouseOutId:id}).then((data)=>{
            console.log('data333', data);
            this.batchDataSource[i].array = data.result.warehouseOutTableMaxVOS;
            this.batchDataSource[i].array.forEach((item) => {item.warehouseOutId = this.outBordId;});
          })
        }
      },
      sureOutBord(){
        if(this.selectBatch!= ''){
          const objArr = [];
          for(let i=0;i<this.batchDataSource.length;i++){
            if(this.batchDataSource[i].array && this.batchDataSource[i].array.length){
              this.batchDataSource[i].array.forEach((item)=>{
                if(item.outWarehouse){
                  console.log('456',item);
                  objArr.push(item);
                }
              })
            }
          }
          const obj = {
            remark: this.remark,
            warehouseOutLogDTOList: objArr
          }
          outWareHousing(obj).then((data)=>{
            if(data.message == '成功'){
              this.$message.success(data.message);
              this.dataSourceSelect = [];
              for(let i=0;i<this.batchDataSource.length;i++){
                if(this.batchDataSource[i].array && this.batchDataSource[i].array.length){
                  this.batchDataSource[i].array.forEach((item)=>{
                    item.outWarehouse = '';
                  })
                }
              }
              this.remark = '';
              this.$router.replace({
                path:'/app/sampleOutBord',
              })
            } else {
              this.$message.warning(data.message);
            }
          })
        }else{
          this.$message.warning('请选择批次号');
        }

      },
      wheelComplete(){
        confirmComplete(this.outBordId).then((data)=>{
          if(data.message == '操作成功！'){
            this.$message.success(data.message);
            this.$router.replace({
              path:'/app/sampleOutBord',
            })
          } else {
            this.$message.warning(data.message);
          }
        })

      },

    }
  }
</script>

<style scoped lang="less">
  /deep/.ant-input{
    background: #F5F8FA;
    border-width: 0px;
  }
  /deep/.ant-select-selection{
    border-width: 0;
    height: 40px;
    background:#F5F8FA ;
    line-height: 40px;
  }
  /deep/.ant-select-selection__rendered{
    line-height: 40px;
  }
  .all-frame{
    width: 100%;
    background: #F5F8FA;
    .title-frame{
      width: 100%;
      border-radius: 10px 10px 0 0;
      background: #fff;
      position: relative;
      .status-frame{
        width: 64px;
        height: 24px;
        background: #DCF6F1;
        text-align: center;
        border-radius: 0  0 0 24px;
        position: absolute;
        right: 0;
        top:0;
      }
      .title-name{
        width: 100%;
        padding: 16px 0 0 24px;
        border-radius: 10px 10px 0 0 ;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .title-down{
        width: 100%;
        padding:12px 14px;
        .information-item-up{
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          .information-top{
            width: 100%;
            display: flex;
            justify-content:flex-start;
            align-items: center;
            .information-item-top{
              width: 50%;
              margin-bottom: 9px;
            }
          }
          .information-item{
            width: 100%;
            margin-bottom: 9px;
          }
        }
      }

    }
    .table-frame{
      width: 100%;
      background: #fff;
      margin-top: 8px;
      border-radius: 5px 5px 0 0;
      padding-bottom: 16px;
      .technology-title{
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 10px;
        .divide{
          padding-left: 2px;
          height:20px;
          background-color: #2E7AF1;
          margin-right: 10px;
          border-radius: 5px;
        }
      }
      .demand-frame{
        padding: 10px 0;
      }
      .select-frame{
        width: 100%;
        padding: 0 6px;
        .batch-input-frame{
          width: 100%;
          border-width: 1px;
          border-color: #F5F8FA;
          border-style: solid;
          display: flex;
          flex-wrap: wrap;
          padding:8px 26px;
          margin:8px 0 ;
          .batch-input-item{
            width: 50%;
          }

        }
      }
    }
    .down-remark-frame{
      width: 100%;
      margin-top: 8px;
      background: #fff;
      padding: 16px 14px 24px 14px;
      .button-style{
        width: 90%;
        margin: 24px auto 0 auto;
        display: flex;
        justify-content: space-between;
      }
    }
  }

</style>