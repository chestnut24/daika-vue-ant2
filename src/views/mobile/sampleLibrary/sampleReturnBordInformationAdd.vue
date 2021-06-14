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
            <span style="font-size: 14px;color: rgba(0,0,0,0.45);width: 50%;">轮型部件号:{{dataSource.projectNo}}</span>
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
          <div class="batch" v-for="(item2,index2) in dataSource.batchArr" :key="index2">
            <span style="color: #399DBC">{{item2}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="inBord-frame">
      <div class="input-number">
        <span>回库数量：</span>
        <a-input style="height: 40px;margin-top: 5px" v-model="outWarehouse"></a-input>
      </div>
      <a-divider/>
      <div class="input-select">
        <span style="color: rgba(0,0,0,0.45)">工厂仓库：</span>
        <a-dropdown>
          <div style="margin-right: 2px">
            <span v-if="factoryWarehouse === ''" style="color: rgba(0,0,0,0.45)">请选择</span>
            <span v-else style="color: rgba(0,0,0,0.45)">{{factoryWarehouse}}</span>
            <a-icon type="right" style="color: rgba(0,0,0,0.45)"/>
          </div>
          <a-menu slot="overlay" @click="factoryWareHouseClick">
            <a-menu-item v-for="data in dic.factoryWareHouse" :key="data.label">
              <span>{{data.label}}</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <a-divider/>
      <div class="input-select">
        <span style="color: rgba(0,0,0,0.45)">库位：</span>
          <div style="margin-right: 2px">
            <span v-if="inventoryLocation === ''" style="color: rgba(0,0,0,0.45)">自动</span>
            <span v-else style="color: rgba(0,0,0,0.45)">{{inventoryLocation}}</span>
          </div>
      </div>
      <a-divider/>
      <div class="input-number">
        <span>样件位置：</span>
        <a-input style="height: 40px;margin-top: 5px" v-model="samplePosition"></a-input>
      </div>
      <a-divider/>
      <div class="sample-button-frame">
        <a-button class="button-style" type="primary" @click="submitReturnBordInformation">提交</a-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {getMouldOptions } from '@api/api';
  export default {
    name: 'sampleReturnBordInformationAdd',
    mounted() {
      this.getDic();
      this.dataSource.projectNo = this.$route.query.projectNo;
      this.dataSource.purpose = this.$route.query.purpose;
      this.dataSource.projectManager = this.$route.query.projectManager;
      this.dataSource.shippingFlowSheet = this.$route.query.shippingFlowSheet;
      this.dataSource.needReturnNum = this.$route.query.needReturnNum;
      this.dataSource.returnNum = this.$route.query.returnNum;
      this.selectIndex = this.$route.query.index;
      this.selectId = this.$route.query.selectId;
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
        },
        dic: {
          noun: [],
          inventoryLocation:[],
          factoryWareHouse:[],
        },
        inventoryLocation:'',//库位
        factoryWarehouse:'',//工厂仓库
        samplePosition:'',//样件位置
        outWarehouse:'',//回库数量
        selectIndex:0,//选中的输入批次号
        selectId:0,//用来暂时存储id用的变量，从输入详情界面跳转回回库单界面时 无法确定是从哪个id传过来的 所以在该界面用变量暂存
      }
    },
    methods:{
      factoryWareHouseClick({ key }){//选择工厂仓库
        this.factoryWarehouse = key;
        this.dic.factoryWareHouse.forEach((item, index)=>{
          if(key == item.label){
            this.inventoryLocation = item.description;
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
      submitReturnBordInformation(){
        this.$router.replace({
          path:'/app/sampleReturnBordModal',
          query:{
            inventoryLocation:this.inventoryLocation,
            outWarehouse:this.outWarehouse,
            factoryWarehouse:this.factoryWarehouse,
            samplePosition:this.samplePosition,
            index:this.selectIndex,
            projectNo:this.dataSource.projectNo,
            purpose:this.dataSource.projectNo,
            projectManager:this.dataSource.projectManager,
            shippingFlowSheet:this.dataSource.shippingFlowSheet,
            needReturnNum:this.dataSource.needReturnNum,
            returnNum:this.dataSource.returnNum,
            id:this.selectId,
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
          width: 100%;
          height: 40px;
        }
      }
      .input-select{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

</style>