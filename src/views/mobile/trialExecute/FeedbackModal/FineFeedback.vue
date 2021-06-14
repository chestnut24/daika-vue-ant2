<template>
  <div class="trial-feedback-frame">
    <div class="title-information-frame">
      <div class="title">
        <span style="font-size:28px;color: #fff ">试制流转单</span>
        <br/>
        <span style="font-size:16px;color: #fff ">{{showParams.formBaseNo}}</span>
      </div>
      <div class="other-information-frame">
        <div class="other-item">
          <span>轮型</span>
          <br/>
          <span>{{showParams.projectNo}}</span>
        </div>
        <div class="other-item">
          <span>产品尺寸</span>
          <br/>
          <span>{{showParams.psize}}</span>
        </div>
        <div class="other-item">
          <span>试制数量</span>
          <br/>
          <span>{{showParams.trialProductionNumber}}</span>
        </div>
      </div>

    </div>
    <div class="trial-input-frame">
      <div class="radio-frame">
        <a-tabs type="card" :activeKey="activeTab">
          <a-tab-pane :key="1" tab="工艺参数确认">
            <div class="tab-frame">
              <FineTechnology v-if="showParams.processTechnology === '精车'" :itemObj="itemObj"></FineTechnology>
              <MachiningTechnology v-else-if="showParams.processTechnology === '粗车'" :itemObj="itemObj"></MachiningTechnology>
              <CastingTechnology v-else-if="showParams.processTechnology === '压铸'" :itemObj="itemObj"></CastingTechnology>
<!--              <CastingTechnology :itemObj="itemObj"></CastingTechnology>-->
<!--              <MachiningTechnology :itemObj="itemObj"></MachiningTechnology>-->
<!--              <FineTechnology :itemObj="itemObj"></FineTechnology>-->
              <span v-else>无</span>
            </div>
          </a-tab-pane>
          <a-tab-pane :key="2" tab="现场情况反馈">
            <div class="tab-frame">
              <FineScene v-if="showParams.processTechnology === '精车'" :itemObj="itemObj"></FineScene>
              <MachiningScene v-else-if="showParams.processTechnology === '粗车'" :itemObj="itemObj"></MachiningScene>
              <CastingScene v-else-if="showParams.processTechnology === '压铸'" :itemObj="itemObj"></CastingScene>
<!--              <CastingScene :itemObj="itemObj"></CastingScene>-->
<!--              <MachiningScene :itemObj="itemObj"></MachiningScene>-->
<!--              <FineScene :itemObj="itemObj"></FineScene>-->
              <span v-else>无</span>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    
  </div>
</template>

<script>
  import FineTechnology from './FineTechnology'
  import FineScene from './FineScene'
  import MachiningScene from './MachiningScene'
  import MachiningTechnology from './MachiningTechnology'
  import CastingScene from './CastingScene'
  import CastingTechnology from './CastingTechnology'
  export default {
    name: 'FineFeedback',
    components:{FineTechnology,FineScene,MachiningScene,MachiningTechnology,CastingScene,CastingTechnology},
    mounted() {
      console.log('obj', this.$route.query.obj);
      this.showParams = this.$route.query.obj;
      this.itemObj = this.$route.query.obj;
      this.activeTab =  (Number(this.$route.query.tabs));
      console.log('this.activeTab',this.activeTab);
    },
    data(){
      return{
        itemObj:null,//用来传递给组件的obj，其中包含一些需要在组件中展示的数据 从上级路由获取过来的
        showParams:{
          projectNo:'' ,
          trialProductionNumber: '',
          formBaseNo:'' ,
          psize: '',
        },
        activeTab:0,//默认展开的tab页
      }
    }
  }
</script>

<style scoped lang="less">
   /deep/.ant-tabs{
     width: 100%;
     display: flex;
     flex-wrap: wrap;
     justify-content: center;
   }
  /deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab{
    width: 48%;
    text-align: center;
    background-color: #E0EBFD;
    border-radius: 10px;
    color:#2E7AF1 ;
  }
  /deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active{
    background-color: #2E7AF1;
    color: #fff;
  }
  .trial-feedback-frame{
    width: 100%;
    background-color: #273650;
    .title-information-frame{
      width: 100%;
      height: 230px ;
      padding: 10px;
      background: url("../../../../assets/FineFeedbackBackground.png") no-repeat;
      .title{
        width: 100%;
        height: 90px;
        margin-top: 50px;
      }
      .other-information-frame{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .other-item{
          width: 32%;
          height: 60px  ;
          background: #fff;
          text-align: center;
          line-height: 30px;
          border-radius: 5px;
        }
      }
    }
    .trial-input-frame{
      background-color: #fff;
      border: 0.5px solid black;
      border-radius: 20px 20px 0 0px;
      .radio-frame{
        width: 100%;
        padding-top: 20px;
        display: flex;
        justify-content: center;
        .tab-frame{
          width: 100%;

        }
      }
    }
  }


</style>