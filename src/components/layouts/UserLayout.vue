<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="desktop-container" v-if="device === 'desktop'">
      <img src="~@/assets/login/logo_top_left.png" class="logo" alt="logo">
      <div class="input-container">
        <div class="top-container">
          <img class="top-logo" src="~@/assets/login/logo_top.png" alt="">
          <img class="top-title" src="~@/assets/login/top_title.png" alt="">
        </div>

        <route-view></route-view>
      </div>

    </div>
    <div class="container"  v-if="device === 'mobile'">
      <div class="container-whole">
        <div class="top">
          <div class="header">
            <a href="/">
              <div style="width: 85vw;display: flex;justify-content: flex-start">
                <img src="../../assets/login/mobile_logo_sinda.png" height="53" width="134"/>
              </div>
<!--              <img src="~@/assets/dk_logo_login.png" class="logo" alt="logo">-->
            </a>
          </div>
        </div>

        <route-view></route-view>
      </div>

    </div>
  </div>
</template>

<script>
  import RouteView from '@/components/layouts/RouteView';
  import { mixinDevice } from '@/utils/mixin.js';

  export default {
    name: 'UserLayout',
    components: { RouteView },
    mixins: [mixinDevice],
    data() {
      return {};
    },
    mounted() {
      document.body.classList.add('userLayout');
    },
    beforeDestroy() {
      document.body.classList.remove('userLayout');
    },
  };
</script>

<style lang="less" scoped>

  #userLayout.user-layout-wrapper {
    height: 100%;

    &.mobile { // 手机端
      .container {
        width: 100vw;
        background: #284479;
        padding: 10vh 0;

        .main {
          min-width: 260px;
          width: 100vw;
          margin: 0 auto;
        }

        .container-whole {
          width: 100vw;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          /*padding-top: 10vh;*/

          /deep/ .ant-input {
            background: transparent;
            border-width: 0;
            color: white;
            border-bottom: solid 1px #8998b6;
            border-radius: 0;
          }
        }
        .top {
          /*margin-top: 10vh;*/
          text-align: center;
          margin-bottom: 8vh;
          padding-top: 3vh;

          .header {
            height: 6vh;
            line-height: 6vh;

            .badge {
              position: absolute;
              display: inline-block;
              line-height: 1;
              vertical-align: middle;
              margin-left: -12px;
              margin-top: -10px;
              opacity: 0.8;
            }

            .logo {
              height: 9vh;
              vertical-align: top;
              margin-right: 0px;
              border-style: none;
            }

            .title {
              font-size: 33px;
              color: rgba(0, 0, 0, .85);
              font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
              font-weight: 600;
              position: relative;
              top: 2px;
            }
          }

          .desc {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.45);
            margin-top: 12px;
            margin-bottom: 40px;
          }
        }

      }
    }

    .container {
      width: 100%;
      min-height: 100%;
      background: #f0f2f5;
      background-size: 100%;
      padding: 110px 0 144px;
      position: relative;
      /*background: url("../../assets/login_background.png") ;*/
      background-size: cover;

      a {
        text-decoration: none;
      }

      .container-whole {
        width: 500px;
        margin: 0 auto;
        /*background: white;*/
      }

      .top {
        text-align: center;
        margin-bottom: 70px;
        padding-top: 40px;

        .header {
          height: 44px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 60px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 33px;
            color: rgba(0, 0, 0, .85);
            font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }

        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
      }

      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;

          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;

            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }

        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }

    .desktop-container {
      display: flex;
      align-items: center;
      position: relative;
      width: 100%;
      min-height: 100%;
      background: url("../../assets/login/background.png") no-repeat;
      background-size:  100% 100%;
      /*z-index: -10;*/

      .logo {
        position: absolute;
        top: 40px;
        left: 40px;
        height: 50px;
      }

      .input-container {
        width: 420px;
        /*height: 500px;*/
        /*position: absolute;*/
        margin-left: calc(33% - 200px);

        .top-container {
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          width: 100%;
          height: 100px;
          position: relative;
          z-index: 10;
          &::after {
            content: '';
            background: #0e2c69;
            opacity: 0.87;
            z-index: -5;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
          }


          .top-logo {
            position: absolute;
            height: 100px;
            top: -20px;
            left: 50px;
          }

          .top-title {
            height: 90px;
            margin-right: 70px;
          }
        }
      }
    }
  }
</style>