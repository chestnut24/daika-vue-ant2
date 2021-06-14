<template>
<!--  查看异常反馈弹窗-->
  <a-modal
    title="现场情况异常反馈"
    :dialog-style="{ top: '20px' }"
    :visible="modalVisible"
    @ok="() => setVisible()"
    @cancel="() =>setVisible()"
    :width='480'
  >
    <div>
      <div class="title-information-frame">
        <div class="title">
          <span style="font-size:28px;color: #fff ">试制流转单</span>
          <br/>
          <span style="font-size:16px;color: #fff ">{{exeRecordObj.formBaseNo}}</span>
        </div>
        <div class="other-information-frame">
          <div class="other-item">
            <span>轮型</span>
            <br/>
            <span>{{exeRecordObj.projectNo}}</span>
          </div>
          <div class="other-item">
            <span>产品尺寸</span>
            <br/>
            <span>未替换</span>
          </div>
          <div class="other-item">
            <span>试制数量</span>
            <br/>
            <span>{{exeRecordObj.trialProductionNumber}}</span>
          </div>
        </div>
      </div>
      <a-card>
      <FinishingProcessSecene v-if="exeRecordObj.processTechnology === '精车'" mode='show' :feedback-obj='feedbackContent'></FinishingProcessSecene>
      <MachiningSecene v-else-if="exeRecordObj.processTechnology === '粗车'" mode='show' :feedback-obj='feedbackContent'></MachiningSecene>
      <CastingSecene v-else-if="exeRecordObj.processTechnology === '压铸'" mode='show' :feedback-obj='feedbackContent'></CastingSecene>
        <DownloadFeedbackFile :file-url='this.exeRecordObj.abnormalFeedbackUrl' v-else></DownloadFeedbackFile>
      </a-card>
    </div>
    <template slot="footer">
      <a-button key="back" @click="setVisible()">
        关闭
      </a-button>

    </template>
  </a-modal>
</template>

<script>

import FinishingProcessSecene from './FinishingProcessSecene'
import MachiningSecene from './MachiningSecene'
import CastingSecene from './CastingSecene'
import DownloadFeedbackFile from './DownloadFeedbackFile'
export default {
  name: 'ShowFeedbackModal',
  components: { DownloadFeedbackFile, CastingSecene, MachiningSecene, FinishingProcessSecene },
  props:['exeRecordObj','modalVisible','feedbackContent'],
  methods:{
    setVisible(){
      console.log("exeRecordObj",this.exeRecordObj)
      this.$emit('update:modalVisible',false);
    }
  }
}

</script>

<style scoped lang='less'>
/deep/.ant-card{
  margin-top: -6px;

}
/deep/ .ant-card-body{
  height: 500px;
  overflow-y: auto;
  padding: 10px;
}
/deep/.ant-card-bordered{
  border-radius: 10px;
}
.title-information-frame{
  width: 100%;
  height: 230px ;
  padding: 10px;
  background: url("../../../assets/FineFeedbackBackground.png") no-repeat;
  background-size:100% 100%;
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

</style>