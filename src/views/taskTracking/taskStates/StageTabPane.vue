<template>
<div class='search-bar'>
  <div class='search-item' style='margin-bottom: 16px' v-show='showComplete'>
    <span>任务状态：</span>
    <a-select mode="tags" :default-value="['全部']" style=" min-width: 120px;max-width: 240px" v-model='queryParam.taskStatusList'>
      <a-select-option v-for='status in taskStatus':key='status' :value="status">
        {{status}}
      </a-select-option>
    </a-select>
  </div>
  <div class='search-item'>
    <span> 任务名称：</span>
    <a-input placeholder="请输入关键字" v-model='queryParam.taskName' ></a-input>
  </div>
  <div class='stage-content-wrap'>
    123
  </div>
</div>
</template>

<script>
export default {
  name: 'stage-tab-pane',
  data(){
    return{
      taskStatus:['正常','预警','全部','延期','事态升级','已完成'],
      queryParam: {
        taskStatusList: [],
        taskName:''
      }
    }
  },

}
</script>

<style scoped>

</style>