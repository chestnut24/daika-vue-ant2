<template>
    <div class="flex-center mine-container">
      <div class="top-person-msg flex-center flex-column">
        <img src="../../../assets/quickNavigation/touxiang.png" height="80" width="80"/>
        <div class="name">{{homeUserInfo.realname}}</div>
        <div>{{homeUserInfo.roleName}}</div>
      </div>
      <div class="id-no flex-column" style="margin-bottom: 12px">
        <div class="item-title">
          <img src="../../../assets/mobile/footer/mine/uuid.png"/>
          <div>ID号：</div>
        </div>
        <div class="item-value">
          <span v-if="loginInfo.uuid">{{ loginInfo && loginInfo.uuid }}</span>
          <span v-else>0E7ACC7E-22FF-46B3-B5AC-696787B256F4</span>
        </div>
      </div>
      <div class="mine-item" v-for="item in dataList" :key="item.index" @click="jumpPath(item.path)">
        <div class="item-title">
          <img :src="returnImgPath(item.icon)"/>
          <span>{{ item.name }}</span>
        </div>
        <a-icon
          style="color: #c0c3c9;font-size: 16px"
          type="right"></a-icon>
      </div>
      <div class="flex-center logout" @click="handleLogout">退出登录</div>
    </div>
</template>

<script>
  import { mapActions, mapGetters,mapState } from 'vuex'
  import store from '@/store/';
  export default {
    name: 'mine',
    data() {
      return {
        homeUserInfo: {
          avatar: '', // 头像
          username: '', // 用户名
          realname: '', // 真名
          post: '', // 岗位
          roleName: '', // 角色名称
        },
        loginInfo: {
          username: '',
          password: '',
          uuid: '',
          registrationId: '',
          client: '',
        },
        dataList: [
          { name: '密码管理', icon: 'secret', path: '/app/mine/secret', index: 0 },
          { name: '新版本检测', icon: 'version', path: '', index: 1 },
          { name: '关于', icon: 'about', path: '/app/mine/about', index: 2 },
        ]
      }
    },
    mounted() {
      this.homeUserInfo = store.getters.userInfo;
      if (JSON.parse(localStorage.getItem('loginInfo'))) {
        this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
      }
    },
    methods: {
      ...mapActions(["Logout"]),
      handleLogout() {
        const that = this

        this.$confirm({
          title: '提示',
          content: '真的要注销登录吗 ?',
          onOk() {
            return that.Logout({}).then(() => {
              // update-begin author:wangshuai date:20200601 for: 退出登录跳转登录页面
              let loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
              if (loginInfo && loginInfo.client === 'app') {
                that.$router.push({ path: `/user/login?uuid=${loginInfo.uuid}&registrationId=${loginInfo.registrationId}&client=${loginInfo.client}` });
                localStorage.removeItem('loginInfo');
              } else {
                that.$router.push({ path: '/user/login' });
              }
              // update-end author:wangshuai date:20200601 for: 退出登录跳转登录页面
              //window.location.reload()
            }).catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
          },
          onCancel() {
          },
        });
      },

      jumpPath(path) {
        if(path) {
          this.$router.push({
            path: path,
          })
        }
      },

      returnImgPath(name) {
        return require(`../../../assets/mobile/footer/mine/${name}.png`);
      }
    }
  };
</script>

<style scoped lang="less">
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .flex-column {
    display: flex;
    flex-direction: column;
  }

  .mine-container {
    flex-direction: column;
    justify-content: flex-start;
    width: 100vw;
    height: 85vh;
    background: #f5f8fa;
    letter-spacing: 1px;

    .top-person-msg {
      color: #ffffff;
      font-size: 12px;
      width: 100%;
      height: 180px;
      background: url("../../../assets/mobile/footer/mine/top_bg.png") no-repeat;
      background-size: 100% 100%;
      .name {
        font-size: 18px;
        margin-top: 10px;
      }
    }

    .item-title {
      display: flex;
      align-items: center;
      img {
        width: 25px;
        height: 25px;
        margin-right: 10px;
        color: #5c6374;
        font-size: 14px;
      }
      .item-value {
        margin-top: 12px;
        color: #8e939e;
        font-size: 12px;
      }
    }

    .id-no {
      width: 100%;
      justify-content: center;
      align-items: flex-start;
      background: #ffffff;
      padding: 16px;
    }

    .mine-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: #ffffff;
      border-bottom: solid 1px #f2f2f4;
      &:last-child {
        border-width: 0;
      }
    }

    .logout {
      margin-top: 12px;
      width: 100%;
      background: #ffffff;
      padding: 16px;
      color: #347ef2;
      letter-spacing: 2px;
    }

  }
</style>