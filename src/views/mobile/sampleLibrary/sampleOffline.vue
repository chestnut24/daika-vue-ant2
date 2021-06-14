<template>
    <div class="all-frame">
      <div style="width: 340px; margin: 0px auto;">
        <a-input-search placeholder="请输入戴卡部件号"  @search="onSearch" />
      </div>
      <div class="information-frame">
        <div class="information-item" v-for="(item, index) in dataSource" :key="index">
          <div class="item-left">
            <div class="img-title-frame">
              <img src="../../../assets/sampleLibrary/item.png" height="24" width="24"/>
              <span style="font-size: 18px;margin-left: 8px"><b>{{item.projectNo}}</b></span>
            </div>
            <div style="margin-top: 15px">
              <span class="span-style1">{{item.formBaseNo}}</span>
            </div>
            <div style="margin-top: 7px">
              <span class="span-style1">{{item.trialProductionSite}}</span>
              <span class="span-style1">-</span>
              <span class="span-style1">{{item.workStr}}</span>
            </div>
          </div>
          <div class="item-right">
            <div class="item">
              <span style="font-weight: 500;color: rgba(0,0,0,0.65)">上机时间</span>
              <span style="font-size: 18px;color: #3C82F2"><b>{{item.onMachineTime}}</b></span>
            </div>
            <div class="item">
              <span style="font-weight: 500;color: rgba(0,0,0,0.65)">试制数量</span>
              <span style="font-size: 18px;color: #3C82F2"><b>{{item.trialProductionNumber}}</b></span>
            </div>
          </div>

        </div>

      </div>
    </div>
</template>

<script>
  import {getOfflineData} from '@api/api'
  export default {
    name: 'sampleOffline',
    mounted() {
      this.getList();
    },
    data(){
      return{
        searchParams:{
          projectNo:'',
        },
        dataSource:[],

      }
    },
    methods:{
      onSearch(value) {
        console.log(value);
        this.searchParams.projectNo = value;
        this.getList();
      },
      getList(){
        getOfflineData(this.searchParams.projectNo).then((data)=>{
          console.log('data', data);
          data.result.forEach((item,index)=>{
            item.onMachineTime=item.onMachineTime.replace(/-/g, '.');
            let str1 = item.onMachineTime.substr(5,5);
            let str2 = item.onMachineTime.substr(14,5);
            item.onMachineTime = str1 + ' ' + str2;
          })
          console.log(data.result[0].onMachineTime);
          this.dataSource = data.result;
        })
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/.ant-input{
    height: 40px;
  }
  .span-style1{
    font-weight: 500;
    color: rgba(0,0,0,0.45);
  }
  .all-frame{
    width: 100%;
    height: 500px;
    padding-top: 7px;
    background: #E8F1F6;
    .information-frame{
      width: 100%;
      padding: 12px 16px;
      background: #fff;
      margin-top: 7px;
      .information-item{
        width: 100%;
        background: #F5F8FA;
        padding: 0 15px 12px 15px;
        display: flex;
        justify-content: flex-start;
        border-radius: 5px;
        .item-left{
          width: 60%;
          padding: 7px 0;
          .img-title-frame{
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }
        }
        .item-right{
          width: 40%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 7px 0 7px 15px;
          .item{
            display: flex;
            flex-direction: column;

          }
        }
      }
    }
  }

</style>