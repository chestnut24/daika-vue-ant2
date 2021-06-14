<template>
  <!--  查看工艺记录弹窗-->
  <a-modal
    title="工艺参数确认"
    :dialog-style="{ top: '20px' }"
    :visible="modalVisible"
    @ok="() => setVisible()"
    @cancel="() =>setVisible()"
    :destroyOnClose=true
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
    </div>
    <a-card>
    <FinishingParams v-if="exeRecordObj.processTechnology === '精车'" mode='show' :record-obj='showRecordContent'></FinishingParams>
    <CastingParams v-else-if="exeRecordObj.processTechnology === '压铸'" mode='show' :record-obj='showRecordContent'></CastingParams>
    <MachingParams v-else-if="exeRecordObj.processTechnology === '粗车'" mode='show' :record-obj='showRecordContent'></MachingParams>
      <DownloadFeedbackFile v-else :file-url='exeRecordObj.craftParamUrl'></DownloadFeedbackFile>
    </a-card>
    <template slot="footer">
      <a-button key="back" @click="setVisible()">
        关闭
      </a-button>

    </template>
  </a-modal>

</template>

<script>
import FinishingParams from './FinishingParams'
import CastingParams from './CastingParams'
import MachingParams from './MachingParams'
import DownloadFeedbackFile from './DownloadFeedbackFile'
export default {
  name: 'ShowProcessRecord',
  components: { DownloadFeedbackFile, MachingParams, CastingParams, FinishingParams },
  props:['exeRecordObj','modalVisible','showRecordContent'],
  methods:{
    setVisible(){
      this.$emit('update:modalVisible',false);
    }
  }
}
</script>

<style scoped lang='less'>
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
</style>