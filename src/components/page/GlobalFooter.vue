<template>
  <div class="footer" v-if="device === 'mobile'">
    <div class="btn-group">
      <div class="bottom-btn"
           :class="index === selectPathIndex ? 'bottom-btn-select' : ''"
           v-for="(item, index) in nameList"
           :key="index"
           @click="jumpPath(index)">
        <img :src="returnPicPath(index)" height="25" width="25"/>
        <div>{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mixin, mixinDevice } from '@/utils/mixin.js'
  export default {
    name: 'LayoutFooter',
    data() {
      return {
        nameList: ['工作台', '消息中心', '我的'],
        pathList: ['/app/home', '/app/msgList', '/app/mine/index'],
        selectPathIndex: null,
      };
    },
    mixins: [mixin, mixinDevice],

    watch: {// 如果路由有变化，会再次执行该方法
      '$route': 'routeChange',//getOrderInfo为自定义方法
    },
    mounted() {
      this.routeChange();
    },

    methods: {
      jumpPath(index) {
        this.$router.push({
          path: this.pathList[index],
        });
      },

      routeChange() {
        let path = this.$route.fullPath;
        switch (path) {
          case '/app/home':
            this.selectPathIndex = 0;
            break;
          case '/app/msgList':
            this.selectPathIndex = 1;
            break;
          case '/app/mine/index':
            this.selectPathIndex = 2;
            break;
          default:
            this.selectPathIndex = null;
            break;
        }
      },
      
      returnPicPath(index) {
        if(index === this.selectPathIndex) {
          return require(`../../assets/mobile/footer/btn_select${index}.png`);
        } else {
          return require(`../../assets/mobile/footer/btn${index}.png`);
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .footer {
    /*padding: 0 16px;*/
    /*margin: 48px 0 24px;*/
    /*text-align: center;*/
    height: 55px;
    width: 100%;
    position: fixed;
    z-index: 10;
    bottom: 0;
    /*border-top: solid 1px #aaaaaa;*/
    background: #ffffff;

    .btn-group {
      width: 100%;
      height: 100%;
      padding: 0 20px;
      display: flex;

      .bottom-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        color: #8c8c8c;
        font-size: 12px;
        /*border-right: solid 1px #aaaaaa;*/

        &:last-child {
          border-width: 0;
        }
      }
      .bottom-btn-select {
        /*background: #409eff;*/
        color: #293449;
        font-weight: bold;
      }
    }

    .links {
      margin-bottom: 8px;

      a {
        color: rgba(0, 0, 0, .45);

        &:hover {
          color: rgba(0, 0, 0, .65);
        }

        &:not(:last-child) {
          margin-right: 40px;
        }
      }
    }

    .copyright {
      color: rgba(0, 0, 0, .45);
      font-size: 14px;
    }
  }
</style>