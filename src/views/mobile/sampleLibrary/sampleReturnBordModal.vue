<template>
  <div class="all-frame">
    <div class="title-frame">
      <div class="title-name">
        <img src="../../../assets/sampleLibrary/sampleReturnBordModalLogo.png" height="24" width="24"/>
        <span style="font-size: 18px;margin-left: 8px"><b>{{dataSource.projectNo}}</b></span>
      </div>
      <img src="../../../assets/trialExe/on_machine_page_split.png" height="8" width="694"/>
      <div class="title-down">
        <div class="information-item-middle">
          <div class="middle-top-information">
            <span style="font-size: 14px;color: rgba(0,0,0,0.45);width: 50%;">用途:{{dataSource.purpose}}</span>
            <span style="font-size: 14px;color: rgba(0,0,0,0.45);width: 50%;">项目经理:{{dataSource.projectManager}}</span>
          </div>
          <span style="font-size: 14px;color: rgba(0,0,0,0.45);">发运流转单编号:{{dataSource.shippingFlowSheet}}</span>
        </div>
      </div>
      <div class="title-info">
        <div class="information-item-down">
          <div class="information">
            <span style="color:rgba(0,0,0,0.45);font-size: 14px;">待回数量</span>
            <span style="color: #347EF2;font-size: 18px;"><b>{{dataSource.needReturnNum}}</b></span>
          </div>
          <div class="information">
            <span style="color:rgba(0,0,0,0.45);font-size: 14px;">已回数量</span>
            <span style="color: #347EF2;font-size: 18px;"><b>{{dataSource.returnNum}}</b></span>
          </div>
        </div>
        <div class="information-batch-frame">
          <div class="batch" v-for="(item2,index2) in dataSource.inputArr" :key="index2">
            <span style="color: #399DBC">{{item2.batch}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="return-input-frame">
      <div class="return-information" v-for="(data2,dataIndex) in dataSource.inputArr" :key="dataIndex">
        <div class="information-title">
          <span style="font-size: 16px;color: #000;">{{data2.batch}}</span>
          <span style="font-size: 14px;color: #B0B0B0" @click="goAddInformation(dataSource,dataIndex)"><a-icon type="right" /></span>
        </div>
        <div class="information-data-frame">
          <div class="data-frame">
            <span style="font-size: 14px;color:rgba(0,0,0,0.45)">待回数量：<span style="color: #347EF2">{{dataSource.needReturnNum}}</span></span>
          </div>
          <div class="data-frame">
            <span style="font-size: 14px;color:rgba(0,0,0,0.45)">已回数量：<span style="color: #347EF2">{{dataSource.returnNum}}</span></span>
          </div>
          <div class="data-frame">
            <span style="font-size: 14px;color:rgba(0,0,0,0.45)">回库数量：<span style="color: #347EF2">{{data2.outWarehouse}}</span></span>
          </div>
          <div class="data-frame">
            <span style="font-size: 14px;color:rgba(0,0,0,0.45)">工厂仓库：<span style="color: #347EF2">{{data2.trialProductionSite}}</span></span>
          </div>
          <div class="data-frame">
            <span style="font-size: 14px;color:rgba(0,0,0,0.45)">库位：<span style="color: #347EF2">{{data2.inventoryLocation}}</span></span>
          </div>
          <div class="data-frame">
            <span style="font-size: 14px;color:rgba(0,0,0,0.45)">样件位置：<span style="color: #347EF2">{{data2.exemplarLocation}}</span></span>
          </div>

        </div>

      </div>

    </div>
    <div class="inBord-frame">
      <div class="input-number">
        <span>备注：</span>
        <a-textarea
          placeholder="请输入备注"
          v-model="remark"
          :auto-size="{ minRows: 4}"
          style="margin-top: 5px"
        />
      </div>
      <div class="sample-button-frame">
        <a-button class="button-style" style="background: #E0ECFD;color: #4A8CF3 " @click="returnSureComplete">回库完成</a-button>
        <a-button class="button-style" type="primary"  @click="submitReturnSample">提交</a-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {returnInfo,returnSureComplete,submitReturn} from '@api/api';
  export default {
    name: 'sampleReturnBordModal',
    mounted() {
      this.dataSource.projectNo = this.$route.query.projectNo;
      this.dataSource.purpose = this.$route.query.purpose;
      this.dataSource.projectManager = this.$route.query.projectManager;
      this.dataSource.shippingFlowSheet = this.$route.query.shippingFlowSheet;
      this.dataSource.needReturnNum = this.$route.query.needReturnNum;
      this.dataSource.returnNum = this.$route.query.returnNum;
      if(this.$route.query.id){
        this.selectId = this.$route.query.id;
        returnInfo(this.$route.query.id).then((data)=>{
          console.log('data7878',data);
          this.dataSource.inputArr = data.result;
          this.$nextTick(()=>{
            if(this.$route.query.index){
              this.$set(this.dataSource.inputArr[this.$route.query.index],'exemplarLocation',this.$route.query.samplePosition);
              this.$set(this.dataSource.inputArr[this.$route.query.index],'inventoryLocation',this.$route.query.inventoryLocation);
              this.$set(this.dataSource.inputArr[this.$route.query.index],'outWarehouse',this.$route.query.outWarehouse);
              this.$set(this.dataSource.inputArr[this.$route.query.index],'trialProductionSite',this.$route.query.factoryWarehouse);
            }
          })
        })
      }
    },
    data(){
      return{
        dataSource:{
          projectNo:'',
          purpose:'',
          projectManager:'',
          shippingFlowSheet:'',
          needReturnNum:'',
          returnNum:'',
          inputArr:[
            {
              batch:'',
              exemplarLocation:'-',//样件位置
              inventoryLocation:'-',//库位
              outWarehouse:'-',//回库数量
              trialProductionSite:'-',//工厂仓库
            }
          ]
        },
        remark:'',
        selectData:0,//跳转输入回库信息界面选中的批次号
        selectId:0,//选中的id号，从回库管理界面过来，之后作为warehouseId用来提交
      }
    },
    methods:{
      goAddInformation(dataSource,dataIndex){
        console.log('dataSource', dataSource);
        this.$router.replace({
          path:'/app/sampleReturnBordInformationAdd',
          query:{
            projectNo:dataSource.projectNo,
            purpose:dataSource.projectNo,
            projectManager:dataSource.projectManager,
            shippingFlowSheet:dataSource.shippingFlowSheet,
            needReturnNum:dataSource.needReturnNum,
            returnNum:dataSource.returnNum,
            index:dataIndex,
            selectId:this.selectId
          }
        })
      },
      returnSureComplete(){ //回库完成按钮
        returnSureComplete(this.selectId).then((data)=>{
          if(data.message == '成功'){
            this.$message.success(data.message);
            this.$router.replace({
              path:'/app/sampleReturnBord',
            });
          } else {
            this.$message.warning(data.message);
          }
        })
      },
      submitReturnSample(){ //提交回库
        const arrList = this.dataSource.inputArr.map( obj => {return  {
          batch: obj.batch,
          exemplarLocation: obj.exemplarLocation,
          id: obj.id,
          inventoryLocation: obj.inventoryLocation,
          outWarehouse: obj.outWarehouse,
          trialProductionSite: obj.trialProductionSite,
          warehouseReturnId:this.selectId,
        }
        })
        const obj = {
          remark: this.remark,
          warehouseReturnLogDTOS: arrList,
        }
        submitReturn(obj).then((data)=>{
          if(data.message == '成功'){
            this.$message.success(data.message);
            this.$router.replace({
              path:'/app/sampleReturnBord',
            });
          } else {
            this.$message.warning(data.message);
          }
        })

      }
    }
  }
</script>

<style scoped lang="less">
  /deep/.ant-input{
    background: #F5F8FA;
    border-width: 0px;
  }
  .all-frame{
    width: 100%;
    background: #F5F8FA;
    .title-frame{
      width: 100%;
      border-radius: 10px 10px 0 0;
      background: #fff;
      .title-name{
        width: 100%;
        padding: 16px 0 0 24px;
        border-radius: 10px 10px 0 0 ;
        display: flex;
        align-items: center;
      }
      .title-down{
        width: 100%;
        padding: 12px 14px 16px 14px;
        .information-item-middle{
          width: 100%;
          display: flex;
          flex-direction: column;
          .middle-top-information{
            width: 100%;
            margin-bottom: 9px;
            display: flex;
            justify-content: space-between;
          }
        }
      }
      .title-info{
        width: 100%;
        padding: 18px 14px 16px 14px;
        .information-item-down {
          width: 100%;
          background: #F5F8FA;
          border-radius: 5px;
          display: flex;
          justify-content: space-between;
          padding: 5px 10px;

          .information {
            width: 50%;
            display: flex;
            flex-direction: column;
            text-align: left;
          }
        }
        .information-batch-frame{
          width: 100%;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          .batch{
            width: 48%;
            background: #F5F8FA;
            border-radius: 13px;
            padding: 5px 5px;
            display: flex;
            align-items: center;
            margin-top: 12px;
            white-space:nowrap;
            text-overflow:ellipsis;
            overflow:hidden;
          }
        }
      }


    }
    .return-input-frame{
      width: 100%;
      background: #F5F8FA;
      padding: 12px 14px;
      .return-information{
        width: 100%;
        background: #fff;
        padding: 9px 12px;
        border-radius: 5px;
        .information-title{
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .information-data-frame{
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: center;
          margin-top: 17px;
          .data-frame{
            width: 50%;
          }

        }
      }
    }
    .inBord-frame{
      width: 100%;
      background: #fff;
      padding: 16px 14px 12px 14px;
      margin-top: 8px;
      .sample-button-frame{
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top:16px;
        .button-style{
          width: 48%;
          height: 40px;
        }
      }
    }
  }


</style>