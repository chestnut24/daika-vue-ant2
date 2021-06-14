<template>
  <div class='trial-history-page-wrap'>
<!--    <a-button type="primary" @click="test">test</a-button>-->
    <div class='trial-history-head-bar'>
      <div style='color: white'>{{ dataSource[selectItemIndex] && dataSource[selectItemIndex].processFlowName }}{{ dataSource[selectItemIndex] && dataSource[selectItemIndex].taskOperatingState }}</div>
      <div class="drawer-btn-container flex-center">
        <div class="drawer-item flex-center" :class="device === 'mobile' ? 'drawer-item-mobile' : ''" @click="openDrawer">
          <a-icon
            class="icon"
            type="menu-fold"></a-icon>
        </div>
      </div>
    </div>
    <a-card :class='device'>
      <div class='trial-history-no'>
        {{ taskInfo.formBaseNo }}
      </div>
      <img src='@/assets/trialExe/on_machine_page_split.png' style='width: 100%'>
      <div class='trial-history-message-wrap'>
        <a-row type="flex" justify="space-between" align="middle">
          <a-col :span="12">轮型：<span class='grey-text'>{{taskInfo.projectNo}}</span></a-col>
          <a-col :span="12">
            <a-row type="flex"  align="middle">
              <a-col :span="24">产品尺寸：<span class='grey-text'>{{taskInfo.pSize}}</span></a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row type="flex" align="middle" class='grid-margin'>
          <a-col :span='24'>工序流程：   <span class='grey-text' :class="{'blue-text':isNowProcess(workFlowItem[0])}">{{workFlowItem[0]}}</span>
            <span v-for='item in workFlowItem.slice(1)' :key='item' class='grey-text'  :class="{'blue-text':isNowProcess(item)}">-<span>{{item}}</span></span></a-col>
        </a-row>
      </div>
    </a-card>
    <a-card :class='device' style='margin-top:15px'>

      <template v-for="(data, dataIndex) in dataSource">
        <HistoryTable v-if="dataIndex === selectItemIndex" :data="data" :table-column="tableColumn[data.taskOperatingState]">
          <template v-slot:img-box v-if="data.taskOperatingState==='下机'">
            <div class='img-box'>
<!--              <img v-for='(imgSrc,index) in data.imgUrl' :key='index' :src="require(`@/assets/trialExe/flower.png`)" alt='下机图片' style='width: 80px;height: 80px;margin-right: 12px'>-->
              <img v-for='(imgSrc,index) in data.imgUrl' :key='index' :src="handleReturnImg(imgSrc)" alt='' style='width: 80px;height: 80px;margin-right: 12px'>

            </div>
          </template>
        </HistoryTable>
      </template>

      <!--    抽屉-->
      <a-drawer
        title="试制记录"
        placement="right"
        :closable="true"
        :visible="drawerVisible"
        @close="closeDrawer"
      >
        <div class="progress-body" v-if="dataSource.length !== 0">
          <a-timeline>
            <a-timeline-item v-for="(item, timeIndex) of dataSource" :key="timeIndex">
              <div @click="selectItem(timeIndex)">
                <b :style="{color: selectItemIndex === timeIndex ? '#1890ff' : '' }">{{ item.processFlowName }} {{
                    item.taskOperatingState }}</b>
                <br>
                {{ item.createTime }}
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>
        <div v-else>
          暂无数据
        </div>
      </a-drawer>
    </a-card>
  <div>


  </div>
  </div>
</template>

<script>
  const sessionStorge=window.sessionStorage;
  import { getAppTrialHistoryById, getDictItemsFromCache } from '@/api/api';
  import HistoryTable from './HistoryTable';
  import { mixinDevice } from '@/utils/mixin.js';

  export default {
    name: 'TrialHistory',
    mixins: [mixinDevice],
    components: { HistoryTable },
    data() {
      return {
        dic: {
          task_operating_state: [],  // app任务状态
          //操作状态 0：上机 1：下机 2：待生产 3：中断 4：重启
        },
        taskInfo: {},

        workFlowItem: [],
        dataSource: [],
        selectItemIndex: 0, // 选中时间轴的index
        tableColumn: {
          上机: { // 上机
            上机时间: 'onMachineTime',
            当前班次: 'currentShift',
            操作人: 'onMachinePerson',
            排产时间: 'productionTime',
            是否按排产时间试制: 'isAccordProductionTime',
            流转数量: 'transferNumber',
            流转单是否与实物一致: 'isItConsistent',
            是否与热处理工序联机: 'isItHeatTreatmentOnline',
          },
          下机: { // 下机
            下机时间: 'outMachineTime',
            当前班次: 'currentShift',
            操作人: 'outMachinePerson',
            下转数量: 'loomTacklingNumber',
            注意事项: 'mattersNeedingAttention',
            上传图片: 'imgUrl',
          },
          中断: { // 中断
            中断时间: 'abnormalInterruptTime',
            当前班次: 'currentShift',
            操作人: 'operationPerson',
            中断说明: 'interruptExplain',
          },
          重启: { // 重启
            重启时间: 'restartMachineTime',
            当前班次: 'currentShift',
            操作人: 'restartMachinePerson',
            重启机台: 'restartMachineNo',
            重启说明: 'restartExplain',
          },
        },

        drawerVisible: false, // 抽屉可视化
      };
    },
    mounted() {
      this.getDic();
      this.getHistory();
      this.getMachineOperationInfo();
    },
    watch: {
      selectItemIndex(val, oldVal) {
        this.$message.destroy();
        this.$message.success(`切换到：${this.dataSource[this.selectItemIndex].processFlowName} ${this.dataSource[this.selectItemIndex].taskOperatingState}`);
      }
    },
    methods: {
      test() {
        // console.log('123');
        // this.getHistory();
        console.log('data source', this.dataSource);
        // console.log('dic', this.dic);
      },
      getHistory() {
        let params={
          taskId:this.$route.query.taskId
        }
        getAppTrialHistoryById(params).then((data) => {
          if (data.success) {
            data = data.result;
            console.log("history data:",data)
            for(let i = 0; i < data.length; i++) {
              for (let j = 0; j < this.dic.task_operating_state.length;j++) {
                if (Number(data[i].taskOperatingState) === Number(this.dic.task_operating_state[j].value)) {
                  data[i].taskOperatingState = this.dic.task_operating_state[j].text;
                }
              }

              if (data[i].taskOperatingState === '上机' && data[i].onMachineTime && data[i].productionTime) {
                // 是否按排产时间试制  需要判断 上机时间是否等于排产时间  上机时间格式为：2021-04-06  排产时间格式为;2021-4-6
                let onMachineTime =  new Date(data[i].onMachineTime);
                onMachineTime =  onMachineTime.toLocaleDateString().replace(/\//g, '-'); // 改2021-04-16为2021-4-6
                data[i].isAccordProductionTime = onMachineTime === data[i].productionTime ? '是' : '否';
              } else {
                data[i].isAccordProductionTime = '';
              }
              // this.returnTrueOrFalse(Number(data[i].isItConsistent)); // 是否按排产时间试制
              data[i].isItConsistent = this.returnTrueOrFalse(Number(data[i].isItConsistent)); // 流转单是否与实物一致
              data[i].isItHeatTreatmentOnline = this.returnTrueOrFalse(Number(data[i].isItHeatTreatmentOnline)); // 是否与热处理工序联机
            }
            // this.dataSource = [];
            //
            // for (let i = 0; i < 5; i++) {
            //   this.dataSource.push(data.splice(0, 0));
            // }

            // this.dataSource[0].taskOperatingState = '下机';
            // this.dataSource[1].processFlowName = '热处理';
            // this.dataSource[1].taskOperatingState = '下机';
            // this.dataSource[2].taskOperatingState = '中断';
            // this.dataSource[3].taskOperatingState = '重启';
            // this.dataSource[4].taskOperatingState = '下机';

            this.dataSource = data;
            console.log('data source', this.dataSource);
          } else {
            this.$message.destroy();
            this.$message.error(data.message);
          }
        });
      },

      getMachineOperationInfo(){   //获取上机任务详情（任务查询页面->查看任务 存于Session中)
        this.taskInfo=JSON.parse(sessionStorge.getItem('machineOperationInfo'))
        console.log("在上机页面中获取到的任务详情：",this.taskInfo);
        this.workFlowItem=this.taskInfo.workFlow.split('-');
        console.log("工作流程：",this.workFlowItem);
      },

      isNowProcess(pro){
        return pro===this.taskInfo.processTechnology
      },

      returnTrueOrFalse(value) { // 0：否 1：是
        switch (value) {
          case null: return '';
          case 0: return '否';
          case 1: return '是';
        }
      },

      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          if (getDictItemsFromCache(name)) { // 从缓存中取dic
            this.dic[name] = getDictItemsFromCache(name);
          }
        }
      },

      selectItem(index) {
        this.selectItemIndex = index;
      },

      openDrawer() {
        this.drawerVisible = true;
      },

      closeDrawer() {
        this.drawerVisible = false;
      },

      handleReturnImg(imgSrc) {
        console.log('imgSrc', imgSrc);
        // console.log(require(`${imgSrc}`));
        // return require(`${imgSrc}`);
        return imgSrc;
        // return require(`@/assets/trialExe/flower.png`);
      },
    },
  };
</script>

<style scoped lang="less">

&.mobile {
  *{
    margin: 0;
    padding: 0;
  }
  /deep/.ant-card-body{
    padding: 5px 5px 15px 5px;
  }
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .top-msg-container {
    width: 100%;
    display: flex;
    background: #f2f2f2;
    padding: 10px;

    .top-no {
      font-size: 18px;
      font-weight: bold;
    }

    .msg {
      width: 100%;
      display: flex;
      margin: 5px 0;
      font-size: 14px;

      .process-container {
        width: calc(100% - 70px);
        display: flex;
        flex-wrap: wrap;
      }
    }


  }

  .title {
    display: flex;
    align-items: center;
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
  .img-box{
    display: flex;
    //flex-wrap: wrap;
    flex-direction: row;
    overflow-x: auto;
    margin-left: 40px;
    max-height: 160px;
  }
}
.trial-history-page-wrap{
  display: flex;
  flex-direction: column;
}
//顶部蓝色bar
.trial-history-head-bar{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 97%;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 10px 15px;
  background:-webkit-linear-gradient(top,#0a243c,#032b56);
  margin: 0 auto 10px auto;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16);
}
.trial-history-no{
  width: 100%;
  height: 45px;
  font-size: 18px;
  padding: 15px;
}
.trial-history-message-wrap{
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
  .drawer-item-mobile {
    .icon {

      &:hover {
        background: transparent!important;
      }
    }
  }
}
</style>
