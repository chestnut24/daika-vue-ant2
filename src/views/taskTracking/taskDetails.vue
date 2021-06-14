<template>
<a-card>
  <div class='project-details-page-wrap'>
    <div class='basic-info-wrap'>
      <div class='project-no-wrap'>
        <h3>戴卡部件号：</h3>
        <p>12345</p>
      </div>
      <div class='basic-info-table'>
        <div class='basic-info-items'>
          <div v-for='(infoItem,index) in infoTableItems' :key='index' class='basic-info-item'>
            <div class='item-head'>{{infoItem}}</div>
            <div class='item-content'>12345</div>
          </div>
        </div>
        <div class='basic-info-img'>
          <div class='info-img-head'>
            表面状态
          </div>
          <div class='info-img-content'>
            <img src="@/assets/taskTracking/machine-test.png" style='height: 100%'>
          </div>
        </div>
      </div>
    </div>
    <div class='different-stages-wrap'>

      <a-tabs default-active-key="1" @change="stageChange">
        <a-tab-pane v-for='(stageTab,index) in stageTabs' key="index" tab="stageTab.name" >
          <StageTabPane></StageTabPane>
        </a-tab-pane>

      </a-tabs>
    </div>
  </div>
</a-card>
</template>

<script>
import StageTabPane from './taskStates/StageTabPane'
export default {
  name: 'projectDetails',
  components: { StageTabPane },
  data(){
    return{
      infoTableItems:['戴卡部件号','表面状态','客户零件号','试制批次','首次试制时间','生产工艺','尺寸','项目阶段','车型平台','客户名称','项目经理','轮辋形式'],
      stageTabs:[
        {
          name:'第一阶段 项目策划',
          paramsName:'firstStage'
        },
        {
          name:'第二阶段  产品设计和开发',
          paramsName:'secondStage'
        },
        {
          name:'第三阶段  产品设计和开发',
          paramsName:'thirdStage'
        },
        {
          name:'第四阶段 产品和过程确认',
          paramsName:'forthStage'
        },
        {
          name:'文件跟踪',
          paramsName:'fileTracking'
        },
        {
          name:'试制跟踪',
          paramsName:'trialTracking'
        },
        {
          name:'发运跟踪',
          paramsName:'shipmentTracking'
        },
        {
          name:'QMS',
          paramsName:'qms'
        },
      ]
    }
  },
  methods:{
    stageChange(){
    console.log("标签切换")
    }
  },
}
</script >

<style scoped lang="less">
.project-no-wrap{
  display: flex;
  flex-direction: row;
  p{
    color: #707070;
    font-size: 18px;
  }
}
.basic-info-table{
  display: flex;
  flex-direction: row;
  width: 100%;
  .basic-info-items{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 75%;
    border-right: 1px solid #707070;
    border-top: 1px solid #707070;
    .basic-info-item{
      display: flex;
      flex-direction: row;
      min-width: 33.3%;
      flex:1;
      height: 30px;
      border-bottom: 1px solid #707070;
      border-left: 1px solid #707070;
      .item-head{
        width: 35%;
       display: flex;
        justify-content: center;
        align-items: center;
        background-color: #b4d8e9;
      }
      .item-content{
        width: 65%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

  }
  .basic-info-img{
    display: flex;
    flex-direction: row;
    border:1px solid #707070;
    .info-img-head{
      width: 40px;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      writing-mode:vertical-lr;

      background-color: #b4d8e9;
    }
  }
}

.search-bar{
  display: flex;
  flex-direction: row;
  padding: 16px 0;
}
</style>