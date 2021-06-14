<template>
  <div class="all-frame">
    <div class="title-frame">
      <div class="title-name">
        <img src="../../../assets/sampleLibrary/sampleReturnBordModalLogo.png" height="24" width="24"/>
        <span style="font-size: 18px;margin-left: 8px"><b>{{projectNo}}</b></span>
      </div>
      <img src="../../../assets/trialExe/on_machine_page_split.png" height="8" width="694"/>
      <div class="title-down">
        <div class="information-item-middle">
          <div class="middle-top-information">
            <span style="font-size: 14px;color: rgba(0,0,0,0.45);width: 50%;">轮形部件号:{{projectNo}}</span>
            <span style="font-size: 14px;color: rgba(0,0,0,0.45);width: 50%;">用途:{{purpose}}</span>
          </div>
          <span style="font-size: 14px;color: rgba(0,0,0,0.45);">项目经理:{{projectManager}}</span>
        </div>
      </div>
    </div>
    <div class="table-frame">
      <table>
        <tr>
          <th>入库批次</th>
          <th>提货数量</th>
          <th>备注</th>
        </tr>
        <tr style="background: #fff" v-for="(item, index) in batchArr">
          <td>
            <div style="background: #fff" class="batch-frame">
              <span  style="width: 100%">{{item.batch}}</span>
              <div class="batch-information"><span style="color: #399DBC">待发数量:{{item.needSendNum}}</span></div>
              <div class="batch-information"><span style="color: #399DBC">已提货:{{item.outWarehouseNum}}</span></div>
              <div class="batch-information"><span style="color: #399DBC">待发需求:{{item.needSendNumDemand}}</span></div>

            </div>
          </td>
          <td><a-input placeholder="请输入"></a-input></td>
          <td style="width: 70px"><a-input placeholder="请输入"></a-input></td>
        </tr>
      </table>
    </div>
    <div class="inBord-frame">
      <div class="sample-button-frame">
        <a-button class="button-style" style="background: #E0ECFD;color: #4A8CF3 " @click="getSampleComplete">提货完成</a-button>
        <a-button class="button-style" type="primary" @click="sureWarehousing">提货</a-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {getPickUpList,confirmSend,postPickUpList} from '@api/api'
  export default {
    name: 'sampleWaitingBordGetSample',
    mounted() {
      if(this.$route.query.id){
        this.projectNo = this.$route.query.projectNo;
        this.purpose = this.$route.query.purpose;
        this.projectManager = this.$route.query.projectManager;
        this.shippingFlowSheet = this.$route.query.shippingFlowSheet;
        this.selectId = this.$route.query.id;
        getPickUpList({id:this.$route.query.id}).then((data)=>{
          console.log('data', data);
          this.batchArr = data.result;
        })
      }
    },
    data(){
      return{
        projectNo:'',
        purpose:'',
        projectManager:'',
        batchArr:[],//循环列表
        shippingFlowSheet:'',
        selectId:''

      }
    },
    methods:{
      getSampleComplete(){
        confirmSend({id:this.selectId,shippingFlowSheet:this.shippingFlowSheet}).then((data)=>{
          if(data.message == '成功'){
            this.$message.success(data.message);
            this.$router.replace({
              path:'/app/sampleGetSample',
            })
          } else {
            this.$message.warning(data.message);
          }
        })
      },
      sureWarehousing(){
        console.log('data', this.batchArr);
        postPickUpList(this.batchArr).then((data)=>{
          if(data.message){
            this.$message.success(data.message);
            this.$router.replace({
              path:'/app/sampleGetSample',
            })
          } else {
            this.$message.warning(data.message);
          }
        })
      }

    }
  }
</script>

<style scoped lang="less">
  .all-frame {
    width: 100%;
    background: #F5F8FA;
    .title-frame {
      width: 100%;
      border-radius: 10px 10px 0 0;
      background: #fff;
      .title-name {
        width: 100%;
        padding: 16px 0 0 24px;
        border-radius: 10px 10px 0 0;
        display: flex;
        align-items: center;
      }
      .title-down {
        width: 100%;
        padding: 12px 14px 16px 14px;
        .information-item-middle {
          width: 100%;
          display: flex;
          flex-direction: column;
          .middle-top-information {
            width: 100%;
            margin-bottom: 9px;
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
    .table-frame{
      width: 100%;
      padding: 8px 6px;
      background: #fff;
      margin-top: 8px;
      table,table tr th, table tr td { border:1px solid #F0F2F5; }
      th{
        padding: 14px;
        background:#F5F8FA ;
      }
      td{
        padding: 8px 12px;
      }
      .batch-frame{
        width: 180px;
        display: flex;
        flex-wrap: wrap;
      }
      .batch-information{
        width: 48%;
        height: 26px;
        background: #F5F8FA;
        border-radius: 13px;
        padding: 4px 0 4px 12px;
        margin-top: 5px;
        display: flex;
        align-items: center;
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