<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :span="6">
            <a-form-item label="标题">
              <a-input placeholder="请输入标题" v-model="queryParam.titile"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="发布人">
              <a-input placeholder="请输入发布人" v-model="queryParam.sender"></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" @click="readAll" icon="book">全部标注已读</a-button>
    </div>

    <a-table
      ref="table"
      size="default"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @change="handleTableChange">
      <span slot="action" slot-scope="text, record">
        <a @click="messageClick(record)">查看</a>
      </span>
    </a-table>
    <show-announcement ref="ShowAnnouncement"></show-announcement>
    <dynamic-notice ref="showDynamNotice" :path="openPath" :formData="formData"/>
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
  </a-card>
</template>

<script>
  import { filterObj } from '@/utils/util'
  import { getAction,putAction } from '@/api/manage'
  import ShowAnnouncement from '@/components/tools/ShowAnnouncement'
  import {webeyeListMixin} from '@/mixins/webeyeListMixin'
  import DynamicNotice from '../../components/tools/DynamicNotice'

  import signApproveDialog from '../../views/shipment/signApproveDialog';
  import fuchaDialog from '../../views/shipment/fuchaDialog';
  import wuliaoDialog from '../../views/shipment/wuliaoDialog';
  import reviewTimeDialog from '../../views/shipment/reviewTimeDialog';
  import baozhuangDialog from '../../views/shipment/baozhuangDialog';
  import wuliuDialog from '../../views/shipment/wuliuDialog';

  export default {
    name: "UserAnnouncementList",
    mixins: [webeyeListMixin],
    components: {
      DynamicNotice,
      ShowAnnouncement,
      signApproveDialog,fuchaDialog,wuliaoDialog,reviewTimeDialog, baozhuangDialog,wuliuDialog
    },
    data () {
      return {
        description: '系统通告表管理页面',
        queryParam: {},
        columns: [{
          title: '标题',
          align:"center",
          dataIndex: 'titile'
        },{
          title: '消息类型',
          align: "center",
          dataIndex: 'msgCategory',
          customRender: function (text) {
            if (text == '1') {
              return "通知公告";
            } else if (text == "2") {
              return "系统消息";
            } else {
              return text;
            }
          }
        },{
          title: '发布人',
          align:"center",
          dataIndex: 'sender'
        },{
          title: '发布时间',
          align:"center",
          dataIndex: 'sendTime'
        },{
          title: '优先级',
          align:"center",
          dataIndex: 'priority',
          customRender:function (text) {
            if(text=='L'){
              return "低";
            }else if(text=="M"){
              return "中";
            }else if(text=="H"){
              return "高";
            } else {
              return text;
            }
          }
        },{
          title: '阅读状态',
          align:"center",
          dataIndex: 'readFlag',
          customRender:function (text) {
            if(text=='0'){
              return "未读";
            }else if(text=="1"){
              return "已读";
            } else {
              return text;
            }
          }
        },{
          title: '操作',
          dataIndex: 'action',
          align:"center",
          scopedSlots: { customRender: 'action' },
        }],
		    url: {
          list: "/sys/sysAnnouncementSend/getMyAnnouncementSend",
          editCementSend:"sys/sysAnnouncementSend/editByAnntIdAndUserId",
          readAllMsg:"sys/sysAnnouncementSend/readAll",
        },
        loading:false,
        openPath:'',
        formData:'',

        deliveryVisible5: false,
        deliveryVisible: false,
        deliveryVisible2:false,
        deliveryVisible4:false,
        deliveryVisible6: false,
        deliveryVisible7: false,
        deliveryId: 0,
        busType5: null,
      }
    },
    methods: {
      handleDetail: function(record){
        this.$refs.sysAnnouncementModal.detail(record);
        this.$refs.sysAnnouncementModal.title="查看";
      },
      showAnnouncement(record){
        putAction(this.url.editCementSend,{anntId:record.anntId}).then((res)=>{
          if(res.success){
            this.loadData();
            this.syncHeadNotic(record.anntId)
          }
        });
        if(record.openType==='component'){
          this.openPath = record.openPage;
          this.formData = {id:record.busId};
          this.$refs.showDynamNotice.detail();
        }else{
          this.$refs.ShowAnnouncement.detail(record);
        }
      },
      syncHeadNotic(anntId){
        getAction("sys/annountCement/syncNotic",{anntId:anntId})
      },
      readAll(){
        var that = this;
        that.$confirm({
          title:"确认操作",
          content:"是否全部标注已读?",
          onOk: function(){
            putAction(that.url.readAllMsg).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.loadData();
                that.syncHeadNotic();
              }
            });
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

    }
  }
</script>
<style scoped>
  .ant-card-body .table-operator{
    margin-bottom: 18px;
  }
  .anty-row-operator button{margin: 0 5px}
  .ant-btn-danger{background-color: #ffffff}z

  .ant-modal-cust-warp{height: 100%}
  .ant-modal-cust-warp .ant-modal-body{height:calc(100% - 110px) !important;overflow-y: auto}
  .ant-modal-cust-warp .ant-modal-content{height:90% !important;overflow-y: hidden}
</style>
