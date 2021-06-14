<template>
  <div>
    <span @click="jumpMsgList" class="header-notice" v-if="device === 'mobile'">
      <a-badge :count="msgTotal">
        <img style="padding: 4px" src="../../assets/mobile/footer/notice.png" height="24" width="20"/>
      </a-badge>
    </span>
    <a-popover
      v-else
      trigger="click"
      placement="bottomRight"
      :autoAdjustOverflow="true"
      :arrowPointAtCenter="true"
      overlayClassName="header-notice-wrapper"
      @visibleChange="handleHoverChange"
      :overlayStyle="{ width: '500px', top: '50px' }">
      <template slot="content">
        <a-spin :spinning="loadding">
          <a-tabs>
            <a-tab-pane :tab="msg1Title" key="1">
              <!--<a-list>
                <a-list-item>
                  <a-list-item-meta title="你收到了 14 份新周报" description="一年前">
                    <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                  </a-list-item-meta>
                </a-list-item>
                <a-list-item>
                  <a-list-item-meta title="你推荐的 IT大牛 已通过第三轮面试" description="一年前">
                    <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png"/>
                  </a-list-item-meta>
                </a-list-item>
                <a-list-item>
                  <a-list-item-meta title="这种模板可以区分多种通知类型" description="一年前">
                    <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png"/>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>-->
              <a-list>
                <a-list-item :key="index" v-for="(record, index) in announcement1">
                  <div style="margin-left: 5%;width: 80%">
                    <p><a @click="showAnnouncement(record)">{{ record.titile }}</a></p>
                    <p style="color: rgba(0,0,0,.45);margin-bottom: 0px">{{ record.createTime }} 发布</p>
                  </div>
                  <div style="text-align: right">
                    <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'L'" color="blue">一般消息</a-tag>
                    <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'M'" color="orange">重要消息</a-tag>
                    <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'H'" color="red">紧急消息</a-tag>
                  </div>
                </a-list-item>
                <div style="margin-top: 5px;text-align: center">
                  <a-button @click="toMyAnnouncement()" type="dashed" block>查看更多</a-button>
                </div>
              </a-list>
            </a-tab-pane>
            <a-tab-pane :tab="msg2Title" key="2">
              <a-list>
                <a-list-item :key="index" v-for="(record, index) in announcement2" @click="messageClick(record)">
                  <div style="margin-left: 5%;width: 80%">
                    <p><a  v-html="record.msgContent"></a></p>
                    <p style="color: rgba(0,0,0,.45);margin-bottom: 0px">{{ record.createTime }} 发布</p>
                  </div>
                  <div style="text-align: right">
                    <a-tag  v-if="record.priority === 'L'" color="blue">一般消息</a-tag>
                    <a-tag  v-if="record.priority === 'M'" color="orange">重要消息</a-tag>
                    <a-tag  v-if="record.priority === 'H'" color="red">紧急消息</a-tag>
                  </div>
                </a-list-item>
                <div style="margin-top: 5px;text-align: center">
                  <a-button @click="toMyAnnouncement()" type="dashed" block>查看更多</a-button>
                </div>
              </a-list>
            </a-tab-pane>
          </a-tabs>
        </a-spin>
      </template>
      <span @click="fetchNotice" class="header-notice">
      <a-badge :count="msgTotal">
        <a-icon style="font-size: 16px; padding: 4px" type="bell"/>
      </a-badge>
    </span>
      <show-announcement ref="ShowAnnouncement" @ok="modalFormOk"></show-announcement>
      <dynamic-notice ref="showDynamNotice" :path="openPath" :formData="formData"/>
    </a-popover>
    <a-modal v-model="deliveryVisible5" title="发运流转单任务异议签批审核" :footer="null" width="800px">
      <div v-if="deliveryVisible5">
        <sign-approve-dialog
                :pageId="deliveryId"
                :pageTypeNumber="busType5"
                @close="deliveryVisible5 = false,deliveryId = null"
                isShow
        ></sign-approve-dialog>
      </div>
    </a-modal>
    <a-modal v-model="deliveryVisible" title="发运计划复查时间维护" :footer="null" width="800px">
      <div v-if="deliveryVisible">
        <review-time-dialog :id="deliveryId" :iShow="false" @close="deliveryVisible = false"></review-time-dialog>
      </div>
    </a-modal>
    <a-modal v-model="deliveryVisible2" title="发运物料确认" :footer="null" width="800px">
      <div v-if="deliveryVisible2">
        <wuliao-dialog :id="deliveryId" :iShow="false" @close="deliveryVisible2 = false"></wuliao-dialog>
      </div>
    </a-modal>
    <a-modal v-model="deliveryVisible4" title="复查任务" :footer="null" width="800px">
      <div v-if="deliveryVisible4">
        <fucha-dialog :id="deliverychoose_id" @close="deliveryVisible4 = false" :iShow="false"></fucha-dialog>
      </div>
    </a-modal>
    <!--<a-modal v-model="deliveryVisible6" title="包装确认" :footer="null" width="800px">
      <div v-if="deliveryVisible6">
        <sign-approve-dialog
                :pageId="deliveryId"
                :pageTypeNumber="3"
                @close="deliveryVisible6 = false,deliveryId = null"
                isShow
        ></sign-approve-dialog>
      </div>
    </a-modal>-->
    <a-modal v-model="deliveryVisible6" title="包装确认" :footer="null" width="800px">
      <div v-if="deliveryVisible6">
        <baozhuang-dialog :id="deliveryId" @close="deliveryVisible6 = false" :iShow="false"></baozhuang-dialog>
      </div>
    </a-modal>
    <a-modal v-model="deliveryVisible7" title="物流信息维护" :footer="null" width="800px">
      <div v-if="deliveryVisible7">
        <wuliu-dialog :id="deliveryId" @close="deliveryVisible7 = false" :iShow="false"></wuliu-dialog>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import { getAction, putAction } from '@/api/manage';
  import ShowAnnouncement from './ShowAnnouncement';
  import store from '@/store/';
  import DynamicNotice from './DynamicNotice';
  import { mixin, mixinDevice } from '@/utils/mixin.js';
  import signApproveDialog from '../../views/shipment/signApproveDialog';
  import fuchaDialog from '../../views/shipment/fuchaDialog';
  import wuliaoDialog from '../../views/shipment/wuliaoDialog';
  import reviewTimeDialog from '../../views/shipment/reviewTimeDialog';
  import baozhuangDialog from '../../views/shipment/baozhuangDialog';
  import wuliuDialog from '../../views/shipment/wuliuDialog';

  export default {
    name: 'HeaderNotice',
    mixins: [mixin, mixinDevice],
    components: {
      DynamicNotice,
      ShowAnnouncement,
      signApproveDialog,fuchaDialog,wuliaoDialog,reviewTimeDialog, baozhuangDialog,wuliuDialog
    },
    data() {
      return {
        loadding: false,
        url: {
          listCementByUser: '/sys/annountCement/listByUser',
          editCementSend: '/sys/sysAnnouncementSend/editByAnntIdAndUserId',
          queryById: '/sys/annountCement/queryById',
        },
        hovered: false,
        announcement1: [],
        announcement2: [],
        msg1Count: '0',
        msg2Count: '0',
        msg1Title: '通知(0)',
        msg2Title: '',
        stopTimer: false,
        websock: null,
        lockReconnect: false,
        heartCheck: null,
        formData: {},
        openPath: '',
        deliveryVisible5: false,
        deliveryVisible: false,
        deliveryVisible2:false,
        deliveryVisible4:false,
        deliveryVisible6: false,
        deliveryVisible7: false,
        deliveryId: 0,
        busType5: null,
      };
    },
    computed: {
      msgTotal() {
        return parseInt(this.msg1Count) + parseInt(this.msg2Count);
      },
    },
    mounted() {
      this.loadData();
      this.timerFun();
      this.initWebSocket();
      // this.heartCheckFun();
    },
    destroyed: function() { // 离开页面生命周期函数
      this.websocketOnclose();
    },
    methods: {
      timerFun() {
        this.stopTimer = false;
        let myTimer = setInterval(() => {
          // 停止定时器
          if (this.stopTimer == true) {
            clearInterval(myTimer);
            return;
          }
          this.loadData();
        }, 30000); //刘东 暂时改成30s
      },
      loadData() {
        try {
          // 获取系统消息
          getAction(this.url.listCementByUser).then((res) => {
            if (res.success) {
              this.announcement1 = res.result.anntMsgList;
              this.msg1Count = res.result.anntMsgTotal;
              this.msg1Title = '通知(' + res.result.anntMsgTotal + ')';
              this.announcement2 = res.result.sysMsgList;
              this.msg2Count = res.result.sysMsgTotal;
              this.msg2Title = '系统消息(' + res.result.sysMsgTotal + ')';
            }
          }).catch(error => {
            console.log('系统消息通知异常', error);//这行打印permissionName is undefined
            this.stopTimer = true;
            console.log('清理timer');
          });
        } catch (err) {
          this.stopTimer = true;
          console.log('通知异常', err);
        }
      },
      fetchNotice() {
        if (this.loadding) {
          this.loadding = false;
          return;
        }
        this.loadding = true;
        setTimeout(() => {
          this.loadding = false;
        }, 200);
      },
      jumpMsgList() {
        this.$router.push({
          path: '/app/msgList',
        });
      },
      showAnnouncement(record) {
        putAction(this.url.editCementSend, { anntId: record.id, msgCategory: record.msgCategory }).then((res) => {
          if (res.success) {
            this.loadData();
          }
        });
        this.hovered = false;
        if (record.openType === 'component') {
          this.openPath = record.openPage;
          this.formData = { id: record.busId };
          this.$refs.showDynamNotice.detail(record.openPage);
        } else {
          this.$refs.ShowAnnouncement.detail(record);
        }
      },
      toMyAnnouncement() {
        this.$router.push({
          path: '/isps/userAnnouncement',
        });
      },
      modalFormOk() {
      },
      handleHoverChange(visible) {
        this.hovered = visible;
      },

      initWebSocket: function() {
        // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
        var userId = store.getters.userInfo.id;
        var url = window._CONFIG['domianURL'].replace('https://', 'wss://').replace('http://', 'ws://') + '/websocket/' + userId;
        //console.log(url);
        // this.websock = new WebSocket(url);
        // this.websock.onopen = this.websocketOnopen;
        // this.websock.onerror = this.websocketOnerror;
        // this.websock.onmessage = this.websocketOnmessage;
        // this.websock.onclose = this.websocketOnclose;
      },
      websocketOnopen: function() {
        console.log('WebSocket连接成功');
        //心跳检测重置
        //this.heartCheck.reset().start();
      },
      websocketOnerror: function(e) {
        console.log('WebSocket连接发生错误');
        this.reconnect();
      },
      websocketOnmessage: function(e) {
        console.log('-----接收消息-------', e.data);
        var data = eval('(' + e.data + ')'); //解析对象
        if (data.cmd == 'topic') {
          //系统通知
          this.loadData();
        } else if (data.cmd == 'user') {
          //用户消息
          this.loadData();
        }
        //心跳检测重置
        //this.heartCheck.reset().start();
      },
      websocketOnclose: function(e) {
        console.log('connection closed (' + e + ')');
        if (e) {
          console.log('connection closed (' + e.code + ')');
        }
        this.reconnect();
      },
      websocketSend(text) { // 数据发送
        try {
          this.websock.send(text);
        } catch (err) {
          console.log('send failed (' + err.code + ')');
        }
      },

      openNotification(data) {
        var text = data.msgTxt;
        const key = `open${Date.now()}`;
        this.$notification.open({
          message: '消息提醒',
          placement: 'bottomRight',
          description: text,
          key,
          btn: (h) => {
            return h('a-button', {
              props: {
                type: 'primary',
                size: 'small',
              },
              on: {
                click: () => this.showDetail(key, data),
              },
            }, '查看详情');
          },
        });
      },

      reconnect() {
        var that = this;
        if (that.lockReconnect) return;
        that.lockReconnect = true;
        //没连接上会一直重连，设置延迟避免请求过多
        setTimeout(function() {
          console.info('尝试重连...');
          that.initWebSocket();
          that.lockReconnect = false;
        }, 5000);
      },
      heartCheckFun() {
        var that = this;
        //心跳检测,每20s心跳一次
        that.heartCheck = {
          timeout: 20000,
          timeoutObj: null,
          serverTimeoutObj: null,
          reset: function() {
            clearTimeout(this.timeoutObj);
            //clearTimeout(this.serverTimeoutObj);
            return this;
          },
          start: function() {
            var self = this;
            this.timeoutObj = setTimeout(function() {
              //这里发送一个心跳，后端收到后，返回一个心跳消息，
              //onmessage拿到返回的心跳就说明连接正常
              that.websocketSend('HeartBeat');
              console.info('客户端发送心跳');
              //self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
              //  that.websock.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
              //}, self.timeout)
            }, this.timeout);
          },
        };
      },


      showDetail(key, data) {
        this.$notification.close(key);
        var id = data.msgId;
        getAction(this.url.queryById, { id: id }).then((res) => {
          if (res.success) {
            var record = res.result;
            this.showAnnouncement(record);
          }
        });

      },
      messageClick(message) {
        console.log(message)
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
        } else {
          this.showAnnouncement();
            }
        console.log(message)
      },
    },
  };
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
</style>
<style lang="less" scoped>
  .header-notice {
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
</style>
