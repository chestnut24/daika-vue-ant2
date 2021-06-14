<template>
  <div class="all-frame">
    <div class="title-frame">
      <div class="status-frame" v-if="itemObj.warehouseIntoStatus">
        <span style="color:#09C199;">外购</span>
      </div>
      <div class="title-name">
        <img src="../../../assets/sampleLibrary/item.png" height="24" width="24"/>
        <span style="font-size: 18px;margin-left: 8px"><b>{{titleObj.projectNo}}</b></span>
        <span style="font-size: 18px;margin-left: 8px"><b>{{itemObj.batch}}</b></span>
      </div>
      <img src="../../../assets/trialExe/on_machine_page_split.png" height="8" width="694"/>
      <div class="title-down">
        <div class="information-item-up">
          <span class="information-item">戴卡部件号：{{titleObj.projectNo}}</span>
          <span class="information-item">用途：{{titleObj.purpose}}</span>
          <span class="information-item">项目经理：{{titleObj.projectManager}}</span>
          <span class="information-item">库位：{{itemObj.inventoryLocation}}</span>
          <span class="information-item">工厂仓库：{{itemObj.factoryWareHouse}}</span>
          <span class="information-item">样件位置：{{itemObj.exemplarLocation}}</span>
          <span class="information-item">待查：{{itemObj.stock}}</span>
        </div>
    </div>
    </div>
    <div class="input-frame">
      <div class="input-select">
        <span>调整类型：</span>
        <a-dropdown>
          <div>
            <span v-if="adjustType === ''">请选择</span>
            <span v-else>{{adjustType}}</span>
             <a-icon type="down" />
          </div>
          <a-menu slot="overlay" @click="adjustClick">
            <a-menu-item v-for="data in adjustOption" :key="data.value">
              <span>{{data.label}}</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <a-divider/>
      <div class="input-number">
        <span>调整数量：</span>
        <a-input style="height: 40px;margin-top: 5px" v-model="scrapNum"></a-input>
      </div>
      <a-divider/>
      <div class="input-remark">
        <span >备注：</span>
        <a-textarea
          placeholder="请输入备注"
          v-model="remark"
          :auto-size="{ minRows: 2}"
          style="margin-top: 5px"
        />
      </div>
      <div class="button-style">
        <a-button type="primary" style="width: 100%;height: 48px;font-size: 18px" @click="sampleAdjust">提交</a-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {wareHouseUpdate} from '@/api/api'
  export default {
    name: 'sampleAdjust',
    inject:['closeCurrent'],
    mounted() {
      console.log('item', this.$route.query.item);
      this.titleObj = this.$route.query.titleObj;
      this.itemObj = this.$route.query.item;
    },
    data(){
      return{
        adjustType:'', //显示的调整类型
        selectType:'', //上传的调整类型对应key
        scrapNum:'',
        remark:'',
        titleObj:{
          projectNo:'',
          purpose:'',
          projectManager:'',
        },
        itemObj:{
          batch:'',
          stock:'',
          inventoryLocation:'',
          factoryWareHouse:'',
          exemplarLocation:''
        },
        dataSource:[],
        dic:{
          factoryWareHouse:[],
        },
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
      sampleAdjust(){
        const obj = {
          id: this.itemObj.id,
          updateSendNum: this.scrapNum,
          remark:this.remark,
          warehouseIntoId: this.itemObj.warehouseIntoId,
          batch:this.itemObj.batch,
          status: this.selectType
        }
        wareHouseUpdate(obj).then((data)=>{
          if(data.message == '成功'){
            this.$message.success('库存调整完成');
            this.$router.replace({
              path:'/app/sampleInformation',
              query:{
                item: this.titleObj,
              }
            });
          } else {
            this.$message.warning(data.message);
          }
        })
      },
      adjustClick({ key }){
        this.selectType = key;
        this.adjustOption.forEach((item,index)=>{
          console.log('type', item.value === key);
          if(item.value === key){
            this.adjustType = item.label;
          }else {
            // this.adjustType = '';
          }
        })
        console.log(`Click on item ${this.adjustType}`);
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
      height: 200px;
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
      }
      .title-down{
        width: 100%;
        padding:12px 14px;
        .information-item-up{
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          .information-item{
            width: 50%;
            margin-bottom: 9px;
          }
        }
      }

    }
    .input-frame{
      width: 100%;
      background: #fff;
      margin-top: 8px;
      padding: 16px 14px 24px 14px;
      .input-select{
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .button-style{
        width: 90%;
        margin: 24px auto 0 auto;
      }
    }
  }
</style>