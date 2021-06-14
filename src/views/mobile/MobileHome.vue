<template>
  <div>
    <div class="top-home">
<!--            <a-button @click="test">test</a-button>-->
      <div class="top-msg">
        <div class="msg-container">
          <img src="../../assets/quickNavigation/touxiang.png" height="48" width="48"/>
<!--          <img :src="returnImgPath(homeUserInfo.avatar)" height="48" width="48"/>-->
          <div class="msg">
            <div>{{homeUserInfo.roleName}}：{{homeUserInfo.realname}}<span v-if="homeUserInfo.post"> / {{homeUserInfo.post}}</span>
            </div>
            <div style="font-size: 12px">{{formatNowDate(nowDate)}}</div>
          </div>
        </div>
      </div>
      <div class="top-nav">
        <div class="task-container">
          <div class="task-item" v-for="(item, index) in taskTitle" :key="index">
            <div class="task-title">{{ item }}</div>
            <div class="task-value">{{ taskValue[index] }}</div>
          </div>
        </div>
        <div class="nav-title">
          <a-carousel style="width: 100%">
            <div class="nav-out-box">
              <div class="nav-container">
                <div v-for="(item,index) in nameList.slice(0, 8)" :key="item" class="nav-item"
                     @click="jumpPath(index)">
                  <div class="nav-item-img" :style="`background: url('${imgUrl(index+1)}') no-repeat`"></div>
                  <span>{{item}}</span>

                </div>
              </div>
            </div>
            <div class="nav-out-box">
              <div class="nav-container">
                <div v-for="(item,index) in nameList.slice(8, 10)" class="nav-item"
                     @click="jumpPath(index+8)">
                  <div class="nav-item-img" :style="`background: url('${imgUrl(index+9)}') no-repeat`"></div>
                  <!--              &nbsp;-->
                  {{item}}
                </div>
              </div>
            </div>
          </a-carousel>
          <!--          <div class="nav-container">-->

          <!--            <div v-for="(item,index) in nameList" class="nav-item" @click="jumpPath(index)">-->
          <!--              &lt;!&ndash;          <img src="../../../assets/quickNavigation/1.png" height="96" width="96"/>&ndash;&gt;-->
          <!--              <img :src="imgUrl(index+1)" alt="">-->
          <!--              &lt;!&ndash;              &nbsp;&ndash;&gt;-->
          <!--              {{item}}-->
          <!--            </div>-->
          <!--          </div>-->

        </div>
        <!--        <div style="width: 16px"></div>-->
        <div style="height: 16px"></div>
        <router-view></router-view>
      </div>
    </div>
    <a-card  class="msg-center">
      <a-tabs default-active-key="1" @change="callback" style="width: 100%">
        <a-tab-pane key="1" tab="我催办的">
          待开发
        </a-tab-pane>
        <a-tab-pane key="2" tab="催办我的" force-render>
          待开发
        </a-tab-pane>
        <a-tab-pane key="3" tab="待办任务">
          <message-center :messageStatus="'1'"></message-center>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
  import { getMyAnnouncementSendNew, getOptions, getAppTrialExe } from '@/api/api';
  import { mapActions, mapGetters, mapState } from 'vuex';
  import messageCenter from './homeTabs/messageCenter';
  import store from '@/store/';

  export default {
    name: 'MobileHome',
    components: { messageCenter },
    data() {
      return {
        nowDate: null, // 当前时间
        timer: null, // 定时器
        taskTitle: ['全部任务', '待处理', '已处理', '昨日完成任务'],
        taskValue: ['43', '31', '31', '31'],
        userIn: {}, // 复制过来的旧版
        homeUserInfo: {
          avatar: '', // 头像
          username: '', // 用户名
          realname: '', // 真名
          post: '', // 岗位
          roleName: '',
        },
        messageList: [],
        messageStatus: null, // 1为待处理，2为已处理
        option: {
          bus_type: [],
        },
        selectedBusType: undefined,
        msgAbstract: null,
        nameList: ['试制', '发运', '物料', '订单', '样件库', '模具管理', '任务追踪', '试制执行', '二级库', '信息看板'],
        pathList: ['', '/app/shipment/shipMain', '', '', '/app/sampleLibraryManagement', '', '', '/app/trialExe', '', ''],
      };
    },

    mounted() {

      // this.onSearch();
      // this.userIn = this.userInfo();
      // this.getAppointOption();

      let that = this;
      this.homeUserInfo = store.getters.userInfo;
      this.timer = setInterval(function() {
        that.nowDate = new Date();
      }, 1000);
      // this.stopTouchendPropagationAfterScroll();
    },
    // 销毁时清除计时器
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },

    computed: {},

    methods: {
      ...mapGetters(['userInfo']),
      callback() {

      },
      // stopTouchendPropagationAfterScroll() {
      //   // var locked = false;
      //
      //   window.addEventListener('touchmove', function(ev) {
      //     // console.log('22');
      //     ev.stopPropagation();
      //     ev.stopImmediatePropagation();
      //   });

        // function stopTouchendPropagation(ev) {
        //   ev.stopPropagation();
        //   window.removeEventListener('touchend', stopTouchendPropagation, true);
        //   locked = false;
        // }
      // },

      test() {
        console.log('info ', this.homeUserInfo);
      },

      returnImgPath(path) {
        return require(path);
      },

      jumpPath(index) {
        // this.$message.destroy();
        // this.$message.success('path: ' + this.pathList[Number(index)]);
        if (this.pathList[Number(index)]) {
          this.$router.push({
            path: this.pathList[Number(index)],
          });
        } else {
          this.$message.destroy();
        }
      },

      imgUrl(index) {
        return require('../../assets/mobile/home/' + index + '.png');
      },
      onSearch() {
        getMyAnnouncementSendNew({
          status: this.messageStatus,
          busType: this.selectedBusType,
          msgAbstract: this.msgAbstract,
        }).then(res => {
          console.log('res', res);
          this.messageList = res.result;
        });
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

      getTime(time) {
        const num = new Date(time).getTime() - Date.now();
        if (num < 10 * 1000) {
          return '刚刚';
        } else if (num < 60 * 1000) {
          return Math.floor(num / 1000) + '秒钟前';
        } else if (num < 60 * 60 * 1000) {
          return Math.floor(num / 1000 / 60) + '分钟前';
        } else {
          return Math.floor(num / 1000 / 60 / 24) + '天前';
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
        this.onSearch();
      },
      touchOut(){}
    },
  };
</script>

<style scoped lang="less">
  /deep/ .ant-carousel .slick-dots li.slick-active button {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #2e7af1;
  }

  /deep/ .ant-carousel .slick-dots li button {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #d9d9d9;
  }

  /deep/ .ant-tabs-nav {
    width: 100%;
  }

  /deep/ .ant-tabs-nav .ant-tabs-tab {
    width: 33%;
    margin-right: 0px;
    text-align: center;
  }

  .flex-center-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .top-home {
    background: white;

    .top-msg {
      background: url("../../assets/mobile/home/top_msg_bg.png") no-repeat;
      background-size: 100% 100%;
      /*margin-bottom: 16px;*/
      padding: 20px;
      width: 100%;
      height: 120px;

      .msg-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        letter-spacing: 1px;

        .msg {
          margin-left: 8px;
          color: #ffffff;
          font-size: 14px;
        }
      }
    }

    .top-nav {
      padding: 0 20px;
      z-index: 100;
      position: relative;
      /*display: flex;*/

      .task-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        position: absolute;
        top: -40px;
        height: 80px;
        width: 90%;
        background: white;
        z-index: 100;
        border-radius: 5px;
        box-shadow: 0 2px 5px #e7eef4;

        .task-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50px;
          /*width: 100%;*/
          text-align: center;
          /*padding: 0 10px;*/
          flex: 1;
          border-right: solid 1px #e4e4e4;

          &:last-child {
            border-width: 0;
          }

          .task-title {
            font-size: 13px;
            color: #595959;
          }

          .task-value {
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 1px;
            color: #02bbd7;
          }
        }
      }

      .nav-title {
        /*width: 60%;*/
        width: 100%;

        .nav-out-box {
          z-index: 100;
          width: 100%;
          margin-top: 50px;
          position: relative;

        }

        .nav-container {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          /*background: pink;*/
          padding-bottom: 20px;
          /*border-top: solid 1px #aaaaaa;*/
          /*border-left: solid 1px #aaaaaa;*/

          .nav-item {
            /*padding: 0 20px;*/
            padding: 10px 0;
            width: 25%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            pointer-events: auto;
            /*margin-bottom: 20px;*/
            /*border-bottom: solid 1px #aaaaaa;*/
            /*border-right: solid 1px #aaaaaa;*/

            .nav-item-img {
              width: 36px;
              height: 36px;
              margin-bottom: 5px;
              /*background: url("../../assets/quickNavigation/1.png") no-repeat;*/
              background-size: 100% !important;
            }

            img {
              width: 36px;
              height: 36px;
              margin-bottom: 5px;
            }
          }
        }
      }
    }

    .bottom-msg-container {
      display: flex;
      min-height: 300px;
      margin-top: 16px;

      .urge-msg-title {
        width: calc(50% - 16px);
      }

      .msg-detail {
        width: 50%;

        .msg-search {

          .msg-select {
            width: 150px
          }

          .msg-input {
            width: calc(100% - 150px);

            .msg-search-btn {
              padding: 0 30px;
            }
          }

        }

        .detail-container {
          margin-top: 16px;

          .detail-list {
            padding-top: 5px;
            border-bottom: 1px solid #e8e8e8;

            .detail-list-content {
              width: calc(100% - 120px);
            }

            .detail-item {
              width: 100px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #1890FF;
              cursor: pointer;
            }
          }
        }
      }
    }
  }

  .msg-center {
    /*width: calc(40% - 16px)*/
    width: 100%;
    margin-top: 12px;
    border-radius: 5px;
  }
</style>