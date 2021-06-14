<template>
<!--  添加异常反馈弹窗-->
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
      <span style="font-size:16px;color: #fff ">{{exeRecordObj && exeRecordObj.formBaseNo}}</span>
    </div>
    <div class="other-information-frame">
      <div class="other-item">
        <span>轮型</span>
        <br/>
        <span>{{exeRecordObj && exeRecordObj.projectNo}}</span>
      </div>
      <div class="other-item">
        <span>产品尺寸</span>
        <br/>
        <span>未替换</span>
      </div>
      <div class="other-item">
        <span>试制数量</span>
        <br/>
        <span>{{exeRecordObj && exeRecordObj.trialProductionNumber}}</span>
      </div>
    </div>
  </div>
<a-card>
      <FinishingProcessSecene v-if="exeRecordObj.processTechnology === '精车'" mode='add' :app-task-id='exeRecordObj.taskId'></FinishingProcessSecene>
      <MachiningSecene v-else-if="exeRecordObj.processTechnology === '粗车'" mode='add' :app-task-id='exeRecordObj.taskId'></MachiningSecene>
      <CastingSecene v-else-if="exeRecordObj.processTechnology === '压铸'" mode='add' :app-task-id='exeRecordObj.taskId' :feedback-obj='exeRecordObj'></CastingSecene>
      <UploadFeedbackFile v-else :app-task-id='exeRecordObj.taskId' ref='uploadFileModal' @upload-success='setVisible'></UploadFeedbackFile>
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
import UploadFeedbackFile from './UploadFeedbackFile'
export default {
  name: 'AddFeedbackModal',
  components: { UploadFeedbackFile, CastingSecene, MachiningSecene, FinishingProcessSecene },
  props:['exeRecordObj','modalVisible'],
  mounted() {
    console.log("exeRecordObj",exeRecordObj)
  },
  methods:{
    setVisible(){
      this.$refs.uploadFileModal.fileList=[];
      this.$emit('update:modalVisible',false);
      this.$emit('reload-list')
    },

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


/deep/ .ant-card-body{
  max-height: 500px;
  overflow-y: auto;
}
</style>