<template>
  <div class="all-frame">
    <div class="title-frame">
      <div class="title-name">
        <img src="../../../assets/sampleLibrary/inBordLogo.png" height="24" width="24"/>
        <span style="font-size: 18px;margin-left: 8px"><b>{{item.projectNo}}</b></span>
        <span style="font-size: 18px;margin-left: 8px"><b>{{item.purpose}}</b></span>
      </div>
      <img src="../../../assets/trialExe/on_machine_page_split.png" height="8" width="694"/>
      <div class="title-down">
        <div class="information-item-middle">
          <span style="font-size: 14px;color: rgba(0,0,0,0.45);margin-bottom: 9px;">项目经理:{{item.projectManager}}</span>
          <span style="font-size: 14px;color: rgba(0,0,0,0.45);">发运流转单编号:{{item.trialProductionFormNo}}</span>
        </div>
        <div class="information-item-down">
          <div class="information">
            <span style="color:rgba(0,0,0,0.45);font-size: 14px;">下线数量</span>
            <span style="color: #347EF2;font-size: 18px;"><b>{{item.offlineCount}}</b></span>
          </div>
          <div class="information">
            <span style="color:rgba(0,0,0,0.45);font-size: 14px;">下线时间</span>
            <span style="color: #347EF2;font-size: 18px;"><b>{{item.offlineTime}}</b></span>
          </div>
          <div class="information">
            <span style="color:rgba(0,0,0,0.45);font-size: 14px;">下线车间</span>
            <span style="color: #347EF2;font-size: 18px;"><b>{{item.trialProductionSite}}</b></span>
          </div>
          <div class="information">
            <span style="color:rgba(0,0,0,0.45);font-size: 14px;">待入数量</span>
            <span style="color: #347EF2;font-size: 18px;"><b>{{item.waitIntoNumber}}</b></span>
          </div>
          <div class="information">
            <span style="color:rgba(0,0,0,0.45);font-size: 14px;">已入库数量</span>
            <span style="color: #347EF2;font-size: 18px;"><b>{{item.intoWarehouse}}</b></span>
          </div>
          <div class="information">
            <span style="color:rgba(0,0,0,0.45);font-size: 14px;">预入库位</span>
            <span style="color: #347EF2;font-size: 18px;"><b>{{item.inventoryLocation}}</b></span>
          </div>
        </div>
      </div>
    </div>
    <div class="inBord-frame">
      <div class="input-number">
        <span>样件位置：</span>
        <a-input style="height: 40px;margin-top: 5px" v-model="samplePosition" placeholder="请输入"></a-input>
      </div>
      <a-divider/>
      <div class="input-number">
        <span>入库数量：</span>
        <a-input style="height: 40px;margin-top: 5px" v-model="inBordNum" placeholder="请输入"></a-input>
      </div>
      <a-divider/>
      <div class="input-number">
        <span>备注：</span>
        <a-textarea
          placeholder="请输入备注"
          v-model="remark"
          :auto-size="{ minRows: 2}"
          style="margin-top: 5px"
        />
      </div>
      <div class="sample-button-frame">
        <a-button class="button-style" style="background: #E0ECFD;color: #4A8CF3 " @click="makeSureComplete">确认完成</a-button>
        <a-button class="button-style" type="primary"  @click="submit">提交</a-button>
      </div>
    </div>

  </div>
    
</template>

<script>
  import {sureComplete,submitWarehousing} from '@api/api'
  export default {
    name: 'sampleInbordModal',
    mounted() {
      this.item = this.$route.query.item;
    },
    data(){
      return{
        item:{
          projectNo:'',
          trialProductionFormNo:'',
          offlineCount:'',
          offlineTime:'',
          trialProductionSite:'',
          waitIntoNumber:'',
          intoWarehouse:'',
          inventoryLocation:'',
          purpose:'',
          projectManager:'',
        },
        samplePosition:'',//样件位置
        inBordNum:'',//入库数量
        remark:'',//备注

      }
    },
    methods:{
      makeSureComplete(){
        console.log('id', this.item.id);
        sureComplete(this.item.id).then((data)=>{
          if(data.message == '成功'){
            this.$message.success(data.message);
            this.$router.replace({
              path:'/app/sampleInbord',
            });
          } else {
            this.$message.warning(data.message);
          }
        })
      },
      submit(){
        const obj = {
          projectNo: this.item.projectNo,
          warehouseIntoId: this.item.id,
          intoWarehouse: this.inBordNum,
          exemplarLocation: this.samplePosition,
          remark:this.remark
        }
        submitWarehousing(obj).then((data)=>{
          if(data.message == '成功'){
            this.$message.success(data.message);
            this.$router.replace({
              path:'/app/sampleInbord',
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
  /deep/.ant-divider-horizontal{
    margin: 16px 0;
  }
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
      }
      .title-down{
        width: 100%;
        padding: 12px 14px 16px 14px;
        .information-item-middle{
          display: flex;
          flex-direction: column;
        }
        .information-item-down{
          width: 100%;
          background: #F5F8FA;
          border-radius: 5px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          padding:5px 10px;
          margin-top: 16px;
          .information{
            width: 30%;
            display: flex;
            flex-direction: column;
            text-align: left;
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