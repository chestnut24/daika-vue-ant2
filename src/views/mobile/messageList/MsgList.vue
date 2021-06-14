<template>
  <a-card class="msg-center" >
    <a-tabs default-active-key="1"  v-model="activeKey"  style="width: 100%">
      <a-tab-pane key="1" tab="待处理" >
        <message-center v-if="activeKey == 1" :messageStatus="'1'" ></message-center>
      </a-tab-pane>
      <a-tab-pane key="2" tab="已处理">
        <message-center  v-if="activeKey == 2"  :messageStatus="'2'" ></message-center>
      </a-tab-pane>
      <a-tab-pane key="3" tab="全部">
        <message-center  v-if="activeKey == 3"  :messageStatus=null ></message-center>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
  import messageCenter from '../homeTabs/messageCenter'
  export default {
    name: 'MsgList',
    components:{messageCenter},
    mounted() {
    },
    data(){
      return{
        activeKey: '1'
      }
    },
    methods:{

    }
  };
</script>

<style scoped lang="less">
  /deep/.ant-tabs-nav{
    width: 100%;
  }
  /deep/.ant-tabs-nav .ant-tabs-tab{
    width: 33%;
    margin-right: 0px;
    text-align: center;
  }


</style>