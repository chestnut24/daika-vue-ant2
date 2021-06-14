<template>

  <div class='process-planning-page-wrap'>
    <a-spin tip="加载中" :spinning="spinning">
      <div class='process-planning-head-bar'>
        <div style='color: white'>{{ selectedFirstLevelName }} {{ selectedSecondaryName }}</div>
        <div class='drawer-btn-container flex-center'>
          <div class='drawer-item flex-center' @click='openDrawer'>
            <a-icon
              class='icon'
              type='menu-fold'></a-icon>
          </div>
        </div>
      </div>
      <!--    抽屉-->
      <a-drawer
        title='试制记录'
        placement='right'
        :closable='true'
        :visible='drawerVisible'
        @close='closeDrawer'
      >
        <div class='drawer-content'>
          <a-timeline>
            <a-timeline-item v-for='(subList,keyName,index) of taskPlanList' :key='index'>
              <p :class="{'blue-text':keyName===selectedFirstLevelName}" style='font-size: 16px'>{{ keyName }}</p>
              <div class='sublist'>
                <p v-for='(subItem,subName,subIndex) in subList' @click='selectItem(keyName,subName)'
                   :class="{'blue-text':subName===selectedSecondaryName}">
                  {{ subName }}
                </p>
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>
      </a-drawer>


      <a-card :class='device'>
        <div class='process-planning-no'>
          {{ taskInfo.formBaseNo }}
        </div>
        <img src='@/assets/trialExe/on_machine_page_split.png' style='width: 100%'>
        <div class='process-planning-message-wrap'>
          <a-row type='flex' justify='space-between' align='middle'>
            <a-col :span='12'>轮型：<span class='grey-text'>{{ taskInfo.projectNo }}</span></a-col>
            <a-col :span='12'>
              <a-row type='flex' align='middle'>
                <a-col :span='24'>产品尺寸：<span class='grey-text'>{{ taskInfo.pSize }}</span></a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row type='flex' align='middle' class='grid-margin'>
            <a-col :span='24'>工序流程： <span class='grey-text'
                                          :class="{'blue-text':isNowProcess(workFlowItem[0])}">{{ workFlowItem[0] }}</span>
              <span v-for='item in workFlowItem.slice(1)' :key='item' class='grey-text'
                    :class="{'blue-text':isNowProcess(item)}">-<span>{{ item }}</span></span></a-col>
          </a-row>
        </div>


      </a-card>
      <a-card :class='device' style='margin-top: 20px'>

        <!--      <div v-for="(firstLevel, firstValue, firstIndex) in taskPlanList" :key="firstIndex">-->
        <!--        <div>{{ firstValue }}</div>-->
        <!--        <template v-for="(secondLevel, secondValue, secondIndex) in firstLevel">-->
        <!--          <div v-if="secondLevel.fileUrl" class='selected-content-wrap' @click='getFileByCommonId'>-->
        <!--            <img src='@/assets/trialExe/pdf_icon.png' style='width: 28px;height: 36px;margin-right: 10px'>-->
        <!--            {{ this.fileUrl }}-->
        <!--          </div>-->
        <!--          <div v-else class='selected-content-wrap' @click='getPDF(secondLevel)'>-->
        <!--            <img src='@/assets/trialExe/pdf_icon.png' style='width: 28px;height: 36px;margin-right: 10px'>-->
        <!--            {{ secondValue }}.pdf-->
        <!--          </div>-->
        <!--        </template>-->
        <!--      </div>-->
        <div v-if="fileUrl" class='selected-content-wrap' @click="getFileByCommonId('other')">
          <img src='@/assets/trialExe/pdf_icon.png' style='width: 28px;height: 36px;margin-right: 10px'>
          {{ this.selectedFirstLevelName }}——{{ this.fileUrl }}
        </div>
<!--        <div v-else class='selected-content-wrap' @click='getPDF'>-->
        <div v-else class='selected-content-wrap' @click="getFileByCommonId('pdf')">
          <img src='@/assets/trialExe/pdf_icon.png' style='width: 28px;height: 36px;margin-right: 10px'>
          {{ this.selectedFirstLevelName }}——{{ this.selectedSecondaryName }}.pdf

        </div>
      </a-card>

      <!--    PDF弹窗-->
      <a-modal v-model="pdfModalVisible" title="PDF文件预览" :footer='null' :closable='false'>
        <iframe class='prism-player' :src='pdfUrl' width='100%' height='100%'></iframe>
      </a-modal>

    </a-spin>
  </div>
</template>

<script>
  require('fast-text-encoding');
  const sessionStorge = window.sessionStorage;
  import { mixinDevice } from '@/utils/mixin.js';
  import {
    getTaskPlanByFromBaseId,
    getProcessPdf,
    getFileByTaskCommonId,
  } from '@/api/api';

  export default {
    name: 'ProcessPlanning',
    mixins: [mixinDevice],
    data() {
      return {
        //获取所有试制策划列表请求参数
        planListQueryParams: {
          formBaseId: Number,
        },

        selectedName: '',
        taskPlanList: {},
        taskInfo: {},
        workFlowItem: [],
        drawerVisible: false,
        selectedFirstLevelName: '',
        selectedSecondaryName: '',
        pdfUrl: '',

        fileUrl: '', // 非特殊工艺的文件URL
        commonId: 0, // 非特殊工艺的文件id
        pdfModalVisible: false,
        uploadAction: window._CONFIG['domianURL'] + 'trial/taskWorkSplit/download/pdf',
      };

    },
    computed: {
      spinning() {
        return this.selectedSecondaryName === '';
      },
    },
    mounted() {
      this.planListQueryParams.formBaseId = this.$route.query.formBaseId;
      this.getTaskPlanList();
      this.getMachineOperationInfo();
    },
    methods: {
      //获取所有试制策划列表
      getTaskPlanList() {
        let params = {
          formBaseId: this.planListQueryParams.formBaseId,
        };
        getTaskPlanByFromBaseId(params).then((data) => {
          if (data.success) {
            console.log('获取所有试制策划列表接口的返回结果', data);
            this.taskPlanList = data.result;
            this.selectedFirstLevelName = Object.keys(this.taskPlanList)[0];
            this.selectedSecondaryName = Object.keys(this.taskPlanList[this.selectedFirstLevelName])[0];
            this.splitFilePath();
          } else {
            this.$message.destroy();
            this.$message.error(data.message);
          }
        });
      },
      splitFilePath() {
        this.fileUrl = '';
        let returnData = this.taskPlanList[this.selectedFirstLevelName][this.selectedSecondaryName];
        // console.log('returnData', returnData);
        if (returnData.fileUrl) {
          let url = returnData.fileUrl.split('/');
          this.fileUrl = url[url.length - 1];
          this.commonId = returnData.commonId;
          console.log('this.fileUrl', this.fileUrl);
        }
      },

      isNowProcess(pro) {
        return pro === this.taskInfo.processTechnology;
      },
      getMachineOperationInfo() {   //获取上机/下机任务详情（任务查询页面->查看任务 存于Session中)
        this.taskInfo = JSON.parse(sessionStorge.getItem('machineOperationInfo'));
        console.log('在工序策划中获取到的任务详情：', this.taskInfo);
        this.workFlowItem = this.taskInfo.workFlow.split('-');
        console.log('工作流程：', this.workFlowItem);
      },

      //抽屉相关操作

      openDrawer() {
        this.drawerVisible = true;
      },
      closeDrawer() {
        this.drawerVisible = false;
      },

      //时间轴点击操作
      selectItem(keyName, subName) {
        this.selectedFirstLevelName = keyName;
        this.selectedSecondaryName = subName;
        this.splitFilePath();
      },

      //获取pdf
      getPDF() {
        let processMessage = this.taskPlanList[this.selectedFirstLevelName][this.selectedSecondaryName]
        // let processMessage = item;
        let params = {};

        params.taskWorkSplitId = processMessage.taskWorkSplitId;
        if (processMessage.planType === 'common') {
          params.commonType = processMessage.commonType;
        }
        params.planType = processMessage.planType;

        this.$http({
          url: `${window._CONFIG['domianURL']}trial/taskWorkSplit/download/pdf`,
          method: 'get',
          responseType: 'arraybuffer',   //一定要设置响应类型，否则页面会是空白pdf
          params: params,
        }).then(res => {
          /*
                  let content =res;//arraybuffer类型数据
                  let resBlob = new Blob([content]);
                  let reader = new FileReader();
                  reader.readAsText(resBlob, 'utf-8');
                  reader.onload = () => {
                    try { // 判断是否可以转化为json格式，可以就说明不是文件流，错误返回值
                      let res = JSON.parse(reader.result);
                      console.log(res);
                      this.$message.destroy();
                      this.$message.error(res.message);
                    } catch { // 报错说明不能转化为json，是文件流，下载文件
                      this.ifPDF=true}
                      */

          let ifPDF = false;

          let utf8decoder = new TextDecoder();
          //在decodedString 中 中文乱码，因此使用decodedString2
          let decodedString = String.fromCharCode.apply(null, new Uint8Array(res));
          //将arraybuffer类型结果转化为字符串
          let decodedString2 = utf8decoder.decode(new Uint8Array(res));
          console.log('decodedString', utf8decoder.decode(new Uint8Array(res)));


          //如果返回的是文件流，则无法转化为 JavaScript 对象。如果可以转化，说明返回的是文件流获取失败信息
          try {
            if (typeof JSON.parse(decodedString2) == 'object') {
              var obj = JSON.parse(decodedString2);
              console.log('obj.message', obj.message);

              this.$message.error(obj.message, 2);
            }
          } catch (e) {
            ifPDF = true;
          }
          console.log('typeof decodedString', typeof decodedString);
          if (ifPDF === true) {
            let url = URL.createObjectURL(new Blob([res]));
            this.pdfUrl = `/static/pdf/web/viewer.html?file=${encodeURIComponent(url)}`;
            // console.log('pdfUrl', this.pdfUrl)
            this.pdfModalVisible = true;
          }
          // }

        }, function(res) {
          console.log('error');
          var decodedString = String.fromCharCode.apply(null, new Uint8Array(res));
          var obj = JSON.parse(decodedString);
          console.log('obj', obj);
        });


      },


      //获取pdf 当无fileURL时下载PDF
      getPdfFile() {
        let processMessage = this.taskPlanList[this.selectedFirstLevelName][this.selectedSecondaryName]
        // let processMessage = item;
        let params = {};
        params.taskWorkSplitId = processMessage.taskWorkSplitId;
        if (processMessage.planType === 'common') {
          params.commonType = processMessage.commonType;
        }
        params.planType = processMessage.planType;
      },


      //获取file 当有fileUrl时，通过commonId下载
      getFileByCommonId(type) {
        let params = {};
        let fileName = '';
        let url = '';
        if (type === 'pdf') {
          let processMessage = this.taskPlanList[this.selectedFirstLevelName][this.selectedSecondaryName]
          fileName = `${this.selectedSecondaryName}.pdf`;
          url = `${window._CONFIG['domianURL']}trial/taskWorkSplit/download/pdf`;
          // let processMessage = item;
          // let params = {};
          params.taskWorkSplitId = processMessage.taskWorkSplitId;
          if (processMessage.planType === 'common') {
            params.commonType = processMessage.commonType;
          }
          params.planType = processMessage.planType;
        } else if (type === 'other') {
          params = { taskCommonId: this.commonId };
          fileName = this.fileUrl;
          url = `${window._CONFIG['domianURL']}trial/task/plan/common/getFileByTaskCommonId`;
        }

        this.$http({
          url: url,
          method: 'get',
          responseType: 'arraybuffer',   //一定要设置响应类型，否则页面会是空白
          params: params,
        }).then((data) => {
          let content = data;//arraybuffer类型数据
          let resBlob = new Blob([content]);
          let reader = new FileReader();
          reader.readAsText(resBlob, 'utf-8');
          reader.onload = () => {
            try { // 判断是否可以转化为json格式，可以就说明不是文件流，错误返回值
              let res = JSON.parse(reader.result);
              console.log(res);
              this.$message.destroy();
              this.$message.error(res.message);
            } catch { // 报错说明不能转化为json，是文件流，下载文件
              console.log('res status', data);
              let blob = new Blob([data]);
              const blobUrl = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.style.display = 'none';
              // a.download = this.fileUrl;
              a.download = fileName;
              a.href = blobUrl;
              a.click();
              // document.body.removeChild(a);
            }
          };
        });
      },

    },

  };
</script>

<style lang='less' scoped>

  &.mobile {
    /deep/ .ant-card-body {
      padding: 5px 5px 15px 5px;
    }

    .process-planning-no {
      width: 100%;
      height: 45px;
      font-size: 18px;
      padding: 15px;
    }

    .process-planning-message-wrap {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 10px 0 10px 12px;
    }

    .flex-center {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .grey-text {
      width: 50px;
      color: #878787;
      font-size: 14px;
    }

    .blue-text {
      color: #1890ff;
      font-weight: bolder;
      font-size: 14px;
    }

  }

  .sublist {

    color: #8c8c8c;
  }

  .blue-text {
    color: #2e7af1;
  }

  .process-planning-page-wrap {
    display: flex;
    flex-direction: column;
  }

  /*顶部蓝色bar*/
  .process-planning-head-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 97%;
    box-sizing: border-box;
    border-radius: 5px;
    padding: 10px 15px;
    background: -webkit-linear-gradient(top, #0a243c, #032b56);
    margin: 0 auto 10px auto;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  }

  .process-planning-no {
    width: 100%;
    height: 45px;
    font-size: 18px;
    padding: 15px;
  }

  .process-planning-message-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px 0 10px 12px;
  }

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }


  //抽屉及其中时间轴
  .drawer-btn-container {
    height: 100%;
    color: white;

    .drawer-item {
      flex-direction: column;
      cursor: pointer;

      .icon {
        font-size: 22px;

        &:hover {
          background: rgba(0, 0, 0, 0.05);
        }
      }
    }
  }

  .drawer-content {
    width: 80%;
    display: flex;
    margin: 20px 0 0 30px;

  }

  //选中项展示
  .selected-content-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: -10px;
    padding: 10px 0 10px 12px;
  }

  //pdf弹窗
  /deep/ .ant-modal {
    top: 50px
  }

  /deep/ .ant-modal-body {
    height: 600px;
    padding: 15px;
  }

  /deep/ .ant-modal-header {
    padding: 10px 18px;
  }


</style>