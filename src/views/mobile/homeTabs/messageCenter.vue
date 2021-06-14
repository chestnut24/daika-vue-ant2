<template>
    <div class="all-frame" @scroll="scrollInformation">
      <div v-for="message in messageList" style="padding-top: 10px;border-bottom: 1px solid #e8e8e8;display: flex;justify-content: space-between" >
        <div style="width: calc(100% - 120px)">
          <span v-html="message.msgContent" @click="msgContentClick(message)"></span>
          <!--                <a v-if="(message.msgCategory == '2' && message.readFlag != 1) || (message.readFlag == 1 && (message.busType == 21 || message.busType == 22 ))" @click="messageClick(message)">-->
          <!--                  请点击该链接进行处理-->
          <!--                </a>-->
        </div>
        <div style="width: 20px"></div>
        <div style="width: 100px;display: flex;justify-content: center;align-items: center;color:#1890FF;flex-wrap: wrap">
          <div v-if="(message.msgCategory == '2' && message.readFlag != 1) || (message.readFlag == 1 && (message.busType == 21 || message.busType == 22 ))" @click="messageClick(message)">
            <a-button size="small">进行处理</a-button>
          </div>
          <div>
            {{getTime(message.sendTime)}}
          </div>
        </div>
      </div>
<!--      <div v-if="messageList && messageList.length" style="display: flex;flex-direction:row-reverse;justify-content: flex-start;margin-top: 12px">-->
<!--        <a-pagination-->
<!--          simple-->
<!--          show-size-changer-->
<!--          :default-current="page.pageNum"-->
<!--          :total="page.total"-->
<!--          @showSizeChange="onShowSizeChange"-->
<!--          @change="onShowSizeChange"-->
<!--          :page-size.sync="page.pageSize"-->
<!--          :hideOnSinglePage="true"/>-->
<!--      </div>-->
    </div>
</template>

<script>
  import {getMyAnnouncementSendNew,updateSysAnnounReadFlag} from "@/api/api"
  export default {
    name: 'messageCenter',
    props:['messageStatus'],
    mounted() {
      this.onSearch();
    },
    data(){
      return{
        messageList:[],
        page: {
          pageSize: 5,
          pageNum: 1,
          total: 0
        },
        timer:null,
      }
    },
    methods:{
      onSearch(){
        getMyAnnouncementSendNew({status:this.messageStatus, pageSize:this.page.pageSize,pageNo:this.page.pageNum}).then(res => {
          console.log('res', res)
          if(res.result.records.length){
            this.messageList =this.messageList.concat(res.result.records);
            this.page.total = res.result.total;
          }else{
            this.$message.warning('没有更多通知！');
          }
          // this.messageList =res.result.records;
          // this.page.total = res.result.total;
        });
      },
      scrollInformation(){//监听滚轮滑动条事件 到底部自动刷新数据
        console.log("开始滚动！");
        let scrollHeight = document.getElementsByClassName('all-frame')[0].scrollHeight;
        let scrollTop = document.getElementsByClassName('all-frame')[0].scrollTop;
        let offsetHeight = document.getElementsByClassName('all-frame')[0].offsetHeight;
        // console.log('scrollHeight',scrollHeight,'scrollTop',scrollTop,'offsetHeight',offsetHeight);
        clearTimeout(this.timer);
        this.timer = setTimeout( ()=> {
          if((scrollTop + offsetHeight) > (scrollHeight -10)) {
            console.log('到底了');
            this.page.pageNum++;
            this.onSearch();
          }
        }, 1000)

      },
      msgContentClick(message){
        if (message.msgCategory == '1') {
          updateSysAnnounReadFlag({ busId: message.busId, busType: message.busType, nowSegment:message.nowSegment});
        }
      },
      messageClick(message) {
        if (message.busType == 21 || message.busType == 22) {
          this.$router.push({path:'/order/orderDetail',query: {id:message.busId}})
          updateSysAnnounReadFlag({ busId: message.busId, busType: message.busType, nowSegment:message.nowSegment});
        } else
        if (message.busType == 20) {
          this.$refs.audit.clickAudit(message.busId);
        } else
        if (message.busType == 11 || message.busType == 12 || message.busType == 13 || message.busType == 18) {
          this.deliveryId = message.busId;
          this.busType5 = message.busType
          this.deliveryVisible5 = true;
        } else
        if (message.busType == 10) {
          const num = Number(message.nowSegment);
          switch (num) {
            // case 1: this.$router.push({path:'/ship/TransferOrderManage'}); break; //
            case 1: this.deliveryId = message.busId;this.deliveryVisible = true; break;
            case 2: this.$router.push({path:'/shipment/ShipTaskList'}); break;
            case 3: this.deliveryId = message.busId;this.deliveryVisible2 = true; break;
            case 4: this.deliveryId = message.busId;this.deliveryVisible4 = true; break;
            case 5: this.$router.push({path:'/sampleLibrary/OutboundManagement'}); break;
            case 6: this.deliveryId = message.busId;this.deliveryVisible6 = true; break;
            case 7: this.$router.push({path:`/sampleLibrary/DeliveryManagement`}); break;
            case 8: this.deliveryId = message.busId;this.deliveryVisible7 = true; break;
          }
        } else
        if (message.busType === '00') {
          const num = Number(message.nowSegment);
          switch (num) {
            case 1: this.$router.push({path:'/trialManage/ProcessMaintenance'}); break;
            case 2: this.$router.push({path:'/trial/filling', query:{id:message.busId,isSee:false}}); break;
            case 3: this.$router.push({path:'/trialManage/TaskReceptionList'}); break;

            case 4: this.$router.push({path:'/trialManage/TaskManageList'});  break;
            case 5: this.$router.push({path:'/trialManage/productionScheduling/ProductionSchedulingList'}); break;

            case 7: this.$router.push({path:`/app/trialExe`}); break;
            case 9: this.$router.push({path:`/app/trialExe`}); break;
          }
        } else
        if (message.busType === '01') {
          const num = Number(message.nowSegment);
          switch (num) {
            case 1: this.$router.push({path:'/trialManage/ProcessMaintenance'}); break;
            case -3: this.$router.push({path:'/trial/filling', query:{id:message.busId,isSee:false}}); break;
            // default: updateSysAnnounReadFlag({ busId: message.busId, busType: message.busType, nowSegment:message.nowSegment});
          }
        } /*else {
              updateSysAnnounReadFlag({ busId: message.busId, busType: message.busType, nowSegment:message.nowSegment});
            }*/
        console.log(message)
      },
      getTime(time) {
        let newTime = new Date(Date.parse(time.replace(/-/g, "/")));
        const num =  Date.now() - new Date(newTime).getTime();
        if (num < 10 * 1000) {
          return '刚刚'
        } else if (num < 60 * 1000) {
          return Math.floor(num / 1000) + '秒钟前';
        } else if (num < 60 * 60 * 1000) {
          return Math.floor(num / 1000 / 60) + '分钟前';
        } else if (num < 60 * 60 * 1000 * 24){
          return Math.floor(num / 1000 / 60 / 60) + '小时前';
        } else{
          return Math.floor(num / 1000 / 60 / 60 / 24) + '天前';
        }
      },
      onShowSizeChange(current, pageSize) {
        this.page.pageNum = current;
        this.page.pageSize = pageSize;
        this.onSearch()
      }
    }
  }
</script>

<style scoped lang="less">
  .all-frame{
    height: 600px;
    overflow-y:auto;
  }
</style>