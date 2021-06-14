<template>
  <div style="overflow-x: auto">
    <div style="min-width: 1600px;background-color: white;margin-bottom: 16px;padding: 16px;color: #02BBD7;display: flex;justify-content: space-between">
      <div style="display: flex">
        <div>
          <img src="../../../assets/quickNavigation/touxiang.png" height="60" width="60"/>
        </div>
        <div style="width: 6px"></div>
        <div>
          <h2 style="color: #02BBD7;margin-bottom: 6px">{{userIn.realname}}: {{userIn.username}}</h2>
          <div>
            {{formatNowDate(nowDate)}}
          </div>
        </div>

      </div>
      <div style="width: 700px;">
        <div style="height: 17px"></div>
        <a-select placeholder="请选择" style="width: 100px" v-model="selectedBusType">
          <a-select-option v-for="opt in option.bus_type" :key="opt.value">
            {{opt.label}}
          </a-select-option>
        </a-select>
        <a-input-search style="width: calc(100% - 150px);" placeholder="请输入戴卡部件号" v-model="msgAbstract" @search="onSearch">
        </a-input-search>
      </div>
    </div>
    <div style="display: flex;min-width: 1600px;">
      <a-card title="消息中心" style="width: calc(40% - 16px)">
        <div style="display: flex;justify-content: space-between;color: #02BBD7;font-size: 16px;text-align: center">
          <div>
            <div style="color:#808080">全部任务</div>
            <br>
            <div><b>55</b></div>
          </div>
          <div style="width: 2px;background-color: #EEEFF3"></div>
          <div>
            <div style="color:#808080">待处理</div>
            <br>
            <div><b>23</b></div>
          </div>
          <div style="width: 2px;background-color: #EEEFF3"></div>
          <div>
            <div style="color:#808080">已处理</div>
            <br>
            <div><b>32</b></div>
          </div>
          <div style="width: 2px;background-color: #EEEFF3"></div>
          <div>
            <div style="color:#808080">昨日完成任务</div>
            <br>
            <div><b>56</b></div>
          </div>
        </div>
      </a-card>
      <div style="width: 16px"></div>
      <a-card title="快速导航" style="width: 70%;">
        <div style="display: flex;flex-wrap: nowrap;justify-content: space-between">
          <div @click="go(item, index)" v-for="(item,index) in navArr" :key="index" v-has="item.vHas" style="padding: 0 20px;text-align: center">
            <img :src="imgUrl(index+1)"  height="36" width="36" alt=""> <br>
            <span>{{item.name}}</span>
          </div>
        </div>

      </a-card>

    </div>
    <div style="min-width: 1600px;display: flex;min-height: 300px;margin-top: 16px">
      <a-card title="催办信息" style="width: calc(50% - 16px)">
        <img src="../../../assets/quickNavigation/replace-info.png" style="width: 100%"/>
        <a-radio-group slot="extra" button-style="solid" v-model="cuiBanStatus">
          <a-radio-button value="1">
            我发起的
          </a-radio-button>
          <a-radio-button value="2">
            发给我的
          </a-radio-button>
        </a-radio-group>
      </a-card>
      <div style="width: 16px">

      </div>
      <div style="width: 50%">
        <a-card title="消息中心">
          <a-radio-group slot="extra" v-model="messageStatus" button-style="solid" @change="messageStatusChange">
            <a-radio-button :value="null">
              全部
            </a-radio-button>
            <a-radio-button value="1">
              待处理
            </a-radio-button>
            <a-radio-button value="2">
              已处理
            </a-radio-button>
<!--            <a-radio-button value="?">-->
<!--              预警信息-->
<!--            </a-radio-button>-->
          </a-radio-group>

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
          <img v-if="!messageList.length" src="../../../assets/quickNavigation/youxiajiaodezhanshitupian.png" style="width: 100%"/>
          <div v-if="messageList && messageList.length" style="display: flex;justify-content: center;margin-top: 12px">
            <a-pagination
                    show-size-changer
                    :default-current="page.pageNum"
                    :total="page.total"
                    @showSizeChange="onShowSizeChange"
                    @change="onShowSizeChange"
                    :page-size.sync="page.pageSize"
                    :hideOnSinglePage="true"/>
          </div>
        </a-card>
      </div>

    </div>
    <OrderAudit ref="audit"></OrderAudit>
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
  import {getMyAnnouncementSendNew, getOptions, updateSysAnnounReadFlag} from "@/api/api"
  import { mapActions, mapGetters,mapState } from 'vuex'
  import OrderAudit from '../../system/OrderAudit';
  import signApproveDialog from '../../shipment/signApproveDialog';
  import fuchaDialog from '../../shipment/fuchaDialog';
  import wuliaoDialog from '../../shipment/wuliaoDialog';
  import reviewTimeDialog from '../../shipment/reviewTimeDialog';
  import baozhuangDialog from '../../shipment/baozhuangDialog'
  import wuliuDialog from '../../shipment/wuliuDialog';
  export default {
      name: 'workbench',
      data() {
          return {
              nowDate: null, // 当前时间
              timer: null, // 定时器
              userIn: {},
              messageList:[],
              messageStatus: null, // 1为待处理，2为已处理
              option: {
                bus_type: []
              },
              selectedBusType: undefined,
              msgAbstract: null,
            // ['试制','发运','物料','订单','样件库','任务追踪','信息看版']
              navArr:[
                {name: '试制', url: '/trial/trialList', vHas:'navigate:trial'},
                {name: '发运', url: '/ship/TransferOrderManage', vHas:'navigate:shipment'},
                {name: '物料', url: '/material/materialQuery', vHas:'navigate:bom'},
                {name: '订单', url: '/order/orderInformationMaintenance', vHas:'navigate:order'},
                {name: '样件库', url: '/sampleLibrary/SampleLibraryManagement', vHas:'navigate:sampleLibrary'},
                {name: '任务追踪', url: '', vHas:'navigate:taskTracking'},
                {name: '信息看版', url: '', vHas:'navigate:info'},
                {name: '模具管理', url: '/system/MouldCreate', vHas:'navigate:mould'},
                {name: '二级库', url: '/system/SecondaryInventory', vHas:'navigate:secondaryLibrary'},
              ],
              deliveryVisible5: false,
              deliveryVisible: false,
              deliveryVisible2:false,
              deliveryVisible4:false,
              deliveryVisible6: false,
              deliveryVisible7: false,
              deliveryId: 0,
              busType5: null,
              cuiBanStatus: '1',
              page: {
                pageSize: 10,
                pageNum: 1,
                total: 0
              }
          }
      },
      components: {OrderAudit, signApproveDialog,fuchaDialog,wuliaoDialog,reviewTimeDialog, baozhuangDialog},
      mounted() {
          this.onSearch();
          this.userIn = this.userInfo();
          this.getAppointOption();
          this.timer = setInterval(()=> {
            this.nowDate = new Date();
          }, 1000);
      },
      beforeDestroy() {
        if (this.timer) {
          clearInterval(this.timer);
        }
      },
      computed: {
        hasClose(){
          const { deliveryVisible5,
                  deliveryVisible,
                  deliveryVisible2,
                  deliveryVisible4,
                  deliveryVisible6,
                  deliveryVisible7} = this;
          return { deliveryVisible5,
            deliveryVisible,
            deliveryVisible2,
            deliveryVisible4,
            deliveryVisible6,
            deliveryVisible7}
        }
      },
      watch:{
          hasClose:{
            handler: function(val){
              this.onSearch();
            },
            immediate: true
          }
      },
      methods: {
          ...mapGetters(["userInfo"]),
          imgUrl(index){
              if (index === 6 || index === 7) {
                index = index + '-grey';
              }
              return require('../../../assets/quickNavigation/'+index+'.png')
          },
          onSearch(){
            getMyAnnouncementSendNew({status: this.messageStatus, busType: this.selectedBusType, msgAbstract: this.msgAbstract, pageSize:this.page.pageSize,pageNo:this.page.pageNum}).then(res => {
              console.log('res', res)
              this.messageList = res.result.records;
              this.page.total = res.result.total;
            });
          },
          getTime(time) {
              const num =  Date.now() - new Date(time).getTime();
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
          getAppointOption() { // 获取指定的下拉框
            for (let name in this.option) {
              getOptions(name, '').then((data) => {
                this.option[name] = data;
              });
            }
          },
          messageStatusChange() {
            this.page.pageNum = 1;
              this.onSearch();
          },
          formatNowDate(date) {
            if (date) {
              let year = date.getFullYear();
              let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
              let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
              let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
              let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
              let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
              let week = date.getDay(); // 星期
              let weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
              // 拼接 时间格式处理
              return year + '.' + month + '.' + day + ' ' + weekArr[week] + ' ' + hours + ':' + minutes + ':' + seconds;
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
        msgContentClick(message){
            if (message.msgCategory == '1') {
              updateSysAnnounReadFlag({ busId: message.busId, busType: message.busType, nowSegment:message.nowSegment});
            }
        },
        go(item, index) {
            if (index >=7 || index <= 4) {
              this.$router.push(item.url);
            } else {
              this.$message.success('页面待开发');
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
  /deep/ .ant-card-head{
    min-height: 30px;
    .ant-card-head-title{
      padding: 8px 0;
    }
  }
  /deep/ .ant-card-extra{
    padding: 0;
  }
  /deep/ .ant-input{
    background-color: #E6E7EB;
    border-radius: 16px;
    overflow: hidden;
    border: 0;
  }
  /deep/ .ant-select-selection{
    border: 0;
  }
  /deep/ .ant-radio-button-wrapper-checked{
    background-color: #C6F1F8 !important;
    border-color: transparent !important;
  }
  /deep/ .ant-radio-button-wrapper:not(:first-child)::before{
    background-color: transparent !important;
  }
  /deep/ .ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled){
    color: #04A6BF;
  }
  /deep/ .ant-radio-button-wrapper{
    height: 24px;
    line-height: 24px;
  }
</style>
