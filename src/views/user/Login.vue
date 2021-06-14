<template>
  <div class="main">
    <a-form v-if="device === 'desktop'" :form="form" :class="['sinda', device]" ref="formLogin" id="formLogin"
            auto-complete="new-password">


      <a-form-item class="form-item" style="margin-top: 20px">
        <a-input
          class="input-item"
          size="large"
          v-decorator="['username',validatorRules.username,{ validator: this.handleUsernameOrEmail }]"
          type="text"
          placeholder="请输入帐户名">

<!--          autocomplete="new-password"-->
          <a-icon slot="prefix" type="user" :style="{ color: '#545d8b', fontSize: '18px' }"/>
        </a-input>
      </a-form-item>
      <div class="dividing"></div>
      <a-form-item class="form-item">
        <a-input
          class="input-item"
          v-decorator="['password',validatorRules.password]"
          size="large"
          type="password"
          placeholder="请输入密码">
          <a-icon theme="filled" slot="prefix" type="lock" :style="{ color: '#545d8b', fontSize: '18px' }"/>

        </a-input>
      </a-form-item>
      <div class="dividing"></div>
      <a-form-item class="form-item">
        <a-input
          style="width: 200px"
          class="input-item"
          v-decorator="['inputCode',validatorRules.inputCode]"
          size="large"
          type="text"
          @change="inputCodeChange"
          autocomplete="new-password"
          placeholder="请输入验证码">
          <a-icon theme="filled" slot="prefix" type="safety-certificate" :style="{ color: '#545d8b', fontSize: '18px' }"/>
        </a-input>
        <span style="margin-left: 30px">
        <img v-if="requestCodeSuccess" style="margin-top: 2px;" :src="randCodeImage"
             @click="handleChangeCheckCode"/>
        <img v-else style="margin-top: 2px;" src="../../assets/checkcode.png" @click="handleChangeCheckCode"/>
        </span>
      </a-form-item>

      <a-button class="sure-btn flex-center"
                size="large"
                type="primary"
                htmlType="submit"
                :loading="loginBtn"
                @click.stop.prevent="handleSubmit"
                :disabled="loginBtn">LOGIN
      </a-button>
      <div class="forgot-password flex-center">
        Forgot Password?
        <a-button type="link" @click="clickForgot">
          Click Here
<!--          <router-link :to="{ name: 'alteration'}" class="forge-password" style="float: right;">-->
<!--            Click Here-->
<!--          </router-link>-->
        </a-button>
      </div>
    </a-form>
    <a-form v-else :form="form" :class="['user-layout-login', device]" ref="formLogin" id="formLogin">


      <a-form-item class="mobile-row">
        <a-input
          class="mobile-input"
          size="large"
          v-decorator="['username',validatorRules.username,{ validator: this.handleUsernameOrEmail }]"
          type="text"
          placeholder="请输入帐户名">
          <a-icon slot="prefix" type="user" :style="{ color: '#ffffff', fontSize: '18px' }"/>
        </a-input>
      </a-form-item>

      <a-form-item class="mobile-row">
        <a-input
          class="mobile-input"
          v-decorator="['password',validatorRules.password]"
          size="large"
          type="password"
          autocomplete="false"
          placeholder="请输入密码">
          <a-icon theme="filled" slot="prefix" type="lock" :style="{ color: '#ffffff', fontSize: '18px' }"/>
        </a-input>
      </a-form-item>

      <a-form-item class="mobile-row">
        <a-row :gutter="0" class="mobile-input">
<!--          <a-col :md="16" :sm="16">-->
          <a-col>
            <a-form-item>
              <div style="display: flex;justify-content: space-between">
                <a-input
                  style="width: 52vw"
                  v-decorator="['inputCode',validatorRules.inputCode]"
                  size="large"
                  type="text"
                  @change="inputCodeChange"
                  placeholder="请输入验证码">
                  <a-icon theme="filled" slot="prefix" type="safety-certificate" :style="{ color: '#ffffff', fontSize: '18px' }"/>
                </a-input>

                <img v-if="requestCodeSuccess" :src="randCodeImage"
                     @click="handleChangeCheckCode"/>
                <img v-else src="../../assets/checkcode.png" @click="handleChangeCheckCode"/>
              </div>
            </a-form-item>
          </a-col>
<!--          <a-col :md="8" :sm="8" style="text-align: right">-->
<!--            <img v-if="requestCodeSuccess" style="margin-top: 2px;" :src="randCodeImage"-->
<!--                 @click="handleChangeCheckCode"/>-->
<!--            <img v-else style="margin-top: 2px;" src="../../assets/checkcode.png" @click="handleChangeCheckCode"/>-->
<!--          </a-col>-->
        </a-row>
      </a-form-item>
      <a-form-item style="margin-top:24px" class="mobile-row">
        <a-button
          size="large"
          htmlType="submit"
          class="login-button"
          :loading="loginBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="loginBtn">LOGIN
        </a-button>
      </a-form-item>

<!--      <div class="forgot-password flex-center">-->
<!--        Forgot Password?-->
<!--        <div @click="clickForgot" class="click-link">-->
<!--          Click Here-->
<!--          &lt;!&ndash;          <router-link :to="{ name: 'alteration'}" class="forge-password" style="float: right;">&ndash;&gt;-->
<!--          &lt;!&ndash;            Click Here&ndash;&gt;-->
<!--          &lt;!&ndash;          </router-link>&ndash;&gt;-->
<!--        </div>-->
<!--      </div>-->
      <div class="forgot-password flex-center">
        Check UUID
        <div @click="clickUUID" class="click-link">
          Click Here
          <!--          <router-link :to="{ name: 'alteration'}" class="forge-password" style="float: right;">-->
          <!--            Click Here-->
          <!--          </router-link>-->
        </div>
      </div>

<!--      <a-form-item class="mobile-row">-->
<!--        <a-checkbox v-decorator="['rememberMe', {initialValue: true, valuePropName: 'checked'}]">自动登录</a-checkbox>-->
<!--        <router-link :to="{ name: 'alteration'}" class="forge-password" style="float: right;">-->
<!--          忘记密码-->
<!--        </router-link>-->
<!--        <router-link :to="{ name: 'register'}" class="forge-password" style="float: right;margin-right: 10px">-->
<!--          注册账户-->
<!--        </router-link>-->
<!--      </a-form-item>-->


    </a-form>

    <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"></two-step-captcha>
    <login-select-tenant ref="loginSelect" @success="loginSelectOk"></login-select-tenant>
    <third-login ref="thirdLogin"></third-login>
  </div>
</template>

<script>
  //import md5 from "md5"
  import api from '@/api';
  import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha';
  import { mapActions } from 'vuex';
  import { timeFix } from '@/utils/util';
  import Vue from 'vue';
  import { ACCESS_TOKEN, ENCRYPTED_STRING } from '@/store/mutation-types';
  import { putAction, postAction, getAction } from '@/api/manage';
  import { encryption, getEncryptedString } from '@/utils/encryption/aesEncrypt';
  import store from '@/store/';
  import { USER_INFO } from '@/store/mutation-types';
  import ThirdLogin from './third/ThirdLogin';
  import LoginSelectTenant from './LoginSelectTenant';

  import { mixinDevice } from '@/utils/mixin.js';

  export default {

    mixins: [mixinDevice],
    components: {
      LoginSelectTenant,
      TwoStepCaptcha,
      ThirdLogin,
    },
    data() {
      return {
        customActiveKey: 'tab1',
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        requiredTwoStepCaptcha: false,
        stepCaptchaVisible: false,
        form: this.$form.createForm(this),
        encryptedString: {
          key: '',
          iv: '',
        },
        state: {
          time: 60,
          smsSendBtn: false,
        },
        validatorRules: {
          username: { rules: [{ required: true, message: '请输入用户名!' }, { validator: this.handleUsernameOrEmail }] },
          password: { rules: [{ required: true, message: '请输入密码!', validator: 'click' }] },
          mobile: { rules: [{ validator: this.validateMobile }] },
          captcha: { rule: [{ required: true, message: '请输入验证码!' }] },
          inputCode: { rules: [{ required: true, message: '请输入验证码!' }] },
        },
        verifiedCode: '',
        inputCodeContent: '',
        inputCodeNull: true,
        currentUsername: '',
        currdatetime: '',
        randCodeImage: '',
        requestCodeSuccess: false,

        uuid: '',
        registrationId: '',
        client: '',
      };
    },
    created() {
      this.currdatetime = new Date().getTime();
      Vue.ls.remove(ACCESS_TOKEN);
      this.getRouterData();
      this.handleChangeCheckCode();
      // update-begin- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题
      //this.getEncrypte();
      // update-end- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题

      this.uuid = this.$route.query.uuid;
      this.registrationId = this.$route.query.registrationId;
      this.client = this.$route.query.client;
      let loginInfo = JSON.parse(localStorage.getItem('loginInfo'));

      if (loginInfo && loginInfo.username && loginInfo.password && this.client === 'app') {
        this.loginWithoutPassword();
        // console.log('11111111');
      }


    },
    methods: {
      ...mapActions(['Login', 'Logout', 'PhoneLogin']),
      // handler
      handleUsernameOrEmail(rule, value, callback) {
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        if (regex.test(value)) {
          this.loginType = 0;
        } else {
          this.loginType = 1;
        }
        callback();
      },
      clickForgot() {
        this.$router.push({
          name: 'alteration',
        },);
      },
      handleTabClick(key) {
        this.customActiveKey = key;
        // this.form.resetFields()
      },

      loginWithoutPassword() { // 免密登录
        // that.loginBtn = true;
        // let username = localStorage.getItem('username');
        // let password = localStorage.getItem('password');
        // let uuid = this.$route.query.uuid;
        // let registrationId = this.$route.query.registrationId;
        // let client = this.$route.query.client;
        let loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
        let loginParams = {
          username: loginInfo.username,
          password: loginInfo.password,
          uuid: this.uuid,
          registrationId: this.registrationId,
          client: this.client,
          // checkKey: that.currdatetime,
          notCheckCaptcha: true,
        };
        let that = this;
        that.Login(loginParams).then((res) => {

          // that.loginBtn = false;
          this.$refs.loginSelect.show(res.result);
          // localStorage.setItem('username', loginParams.username);
          // localStorage.setItem('password', loginParams.password);
          this.loginSuccess();
        }).catch((err) => {

          // that.loginBtn = false;
          that.requestFailed(err);
        });
      },

      clickUUID() {
        this.$success({
          title: 'Check UUID',
          // JSX support
          content: `UUID: ${this.uuid}`,
        });
      },

      handleSubmit() {
        // let uuid = this.$route.query.uuid;
        // let registrationId = this.$route.query.registrationId;
        // let client = this.$route.query.client;

        let that = this;
        let loginParams = {};
        that.loginBtn = true;
        // 使用账户密码登录
        if (that.customActiveKey === 'tab1') {
          that.form.validateFields(['username', 'password', 'inputCode', 'rememberMe'], { force: true }, (err, values) => {
            if (!err) {
              loginParams.username = values.username;
              loginParams.password = values.password;
              loginParams.remember_me = values.rememberMe;
              loginParams.captcha = that.inputCodeContent;
              loginParams.checkKey = that.currdatetime;
              loginParams.notCheckCaptcha = false;

              loginParams.uuid = that.uuid;
              loginParams.registrationId = that.registrationId;
              loginParams.client = that.client;

              console.log('登录参数', loginParams);
              that.Login(loginParams).then((res) => {
                this.$refs.loginSelect.show(res.result);
                if(loginParams.client === 'app') {
                  let loginInfoSet = {
                    username: loginParams.username,
                    password: loginParams.password,
                    uuid: loginParams.uuid,
                    registrationId: loginParams.registrationId,
                    client: loginParams.client,
                  };
                  localStorage.setItem('loginInfo', JSON.stringify(loginInfoSet));
                }
              }).catch((err) => {
                that.requestFailed(err);
              });


            } else {
              that.loginBtn = false;
            }
          });
          // 使用手机号登录
        } else {
          that.form.validateFields(['mobile', 'captcha', 'rememberMe'], { force: true }, (err, values) => {
            if (!err) {
              loginParams.mobile = values.mobile;
              loginParams.captcha = values.captcha;
              loginParams.remember_me = values.rememberMe;
              that.PhoneLogin(loginParams).then((res) => {
                console.log(res.result);
                this.$refs.loginSelect.show(res.result);
              }).catch((err) => {
                that.requestFailed(err);
              });

            }
          });
        }
      },
      getCaptcha(e) {
        e.preventDefault();
        let that = this;
        this.form.validateFields(['mobile'], { force: true }, (err, values) => {
            if (!values.mobile) {
              that.cmsFailed('请输入手机号');
            } else if (!err) {
              this.state.smsSendBtn = true;
              let interval = window.setInterval(() => {
                if (that.state.time-- <= 0) {
                  that.state.time = 60;
                  that.state.smsSendBtn = false;
                  window.clearInterval(interval);
                }
              }, 1000);

              const hide = this.$message.loading('验证码发送中..', 0);
              let smsParams = {};
              smsParams.mobile = values.mobile;
              smsParams.smsmode = '0';
              postAction('/sys/sms', smsParams)
                .then(res => {
                  if (!res.success) {
                    setTimeout(hide, 0);
                    this.cmsFailed(res.message);
                  }
                  console.log(res);
                  setTimeout(hide, 500);
                })
                .catch(err => {
                  setTimeout(hide, 1);
                  clearInterval(interval);
                  that.state.time = 60;
                  that.state.smsSendBtn = false;
                  this.requestFailed(err);
                });
            }
          },
        );
      },
      stepCaptchaSuccess() {
        this.loginSuccess();
      },
      stepCaptchaCancel() {
        this.Logout().then(() => {
          this.loginBtn = false;
          this.stepCaptchaVisible = false;
        });
      },
      handleChangeCheckCode() {
        this.currdatetime = new Date().getTime();
        getAction(`/sys/randomImage/${this.currdatetime}`).then(res => {
          if (res.success) {
            this.randCodeImage = res.result;
            this.requestCodeSuccess = true;
          } else {
            this.$message.error(res.message);
            this.requestCodeSuccess = false;
          }
        }).catch(() => {
          this.requestCodeSuccess = false;
        });
      },
      loginSuccess() {
        let sUserAgent= navigator.userAgent.toLowerCase();
        let bIsIpad= sUserAgent.match(/ipad/i) == "ipad";

        let bIsIphoneOs= sUserAgent.match(/iphone os/i) == "iphone os";

        let bIsMidp= sUserAgent.match(/midp/i) == "midp";

        let bIsUc7= sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";

        let bIsUc= sUserAgent.match(/ucweb/i) == "ucweb";

        let bIsAndroid= sUserAgent.match(/android/i) == "android";

        let bIsCE= sUserAgent.match(/windows ce/i) == "windows ce";

        let bIsWM= sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
          this.$router.push({ path: '/app/home' }).catch(() => {
            console.log('登陆手机')
          });

        } else {
          this.$router.push({ path: '/dashboard/analysis' }).catch(() => {
            console.log('登录跳转首页出错,这个错误从哪里来的');
          });
        }

        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`,
        });
      },
      cmsFailed(err) {
        this.$notification['error']({
          message: '登录失败',
          description: err,
          duration: 4,
        });
      },
      requestFailed(err) {
        this.$notification['error']({
          message: '登录失败',
          description: ((err.response || {}).data || {}).message || err.message || '请求出现错误，请稍后再试',
          duration: 4,
        });
        this.loginBtn = false;
      },
      validateMobile(rule, value, callback) {
        if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
          callback();
        } else {
          callback('您的手机号码格式不正确!');
        }

      },
      validateInputCode(rule, value, callback) {
        if (!value || this.verifiedCode == this.inputCodeContent) {
          callback();
        } else {
          callback('您输入的验证码不正确!');
        }
      },
      generateCode(value) {
        this.verifiedCode = value.toLowerCase();
      },
      inputCodeChange(e) {
        this.inputCodeContent = e.target.value;
      },
      loginSelectOk() {
        this.loginSuccess();
      },
      getRouterData() {
        this.$nextTick(() => {
          if (this.$route.params.username) {
            this.form.setFieldsValue({
              'username': this.$route.params.username,
            });
          }
        });
      },
      //获取密码加密规则
      getEncrypte() {
        var encryptedString = Vue.ls.get(ENCRYPTED_STRING);
        if (encryptedString == null) {
          getEncryptedString().then((data) => {
            this.encryptedString = data;
          });
        } else {
          this.encryptedString = encryptedString;
        }
      },
    },
  };
</script>

<style lang="less" scoped>

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.mobile { // 手机端
    /*width: 100%;*/

    .main {
      width: 100vw;
      margin: 0 auto;
      /*display: flex;*/
      /*flex-direction: column;*/
      /*align-items: center;*/
    }

    label {
      font-size: 10vm;
    }

    .mobile-row {
      width: 85vw;
      margin: 0 auto 24px;
      /*display: flex;*/
      /*flex-direction: column;*/
      /*align-items: center;*/
    }

    .mobile-input {
      width: 85vw;
      /*width: 90%;*/
    }

    /deep/ .ant-form-item-control {
      /*width: 60vw;*/
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 10vh;
    }

    .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 3vw;
      font-size: 16px;
      height: 10vh;
      width: 60vw;
    }

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, .2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color .3s;

        &:hover {
          color: #1890ff;
        }
      }

      .register {
        float: right;
      }
    }
  }

  .sinda {
    /*height: 500px;*/
    width: 100%;
    z-index: 10;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &::after {
      content: '';
      background: #ffffff;
      opacity: 0.87;
      z-index: -5;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }

    /deep/ .ant-form-item {
      /*margin-bottom: 0;*/
      margin: 10px 0;
    }

    /deep/ .ant-btn {
      background: transparent;
    }

    .form-item {
      width: 80%;
      height: 80px;
      display: flex;
      /*flex-direction: column;*/
      justify-content: flex-start;
      align-items: center;

      .input-item {
        margin: auto;
        color: #545d8b;

        /deep/ .ant-input {
          height: 60px;
          color: #545d8b;
          font-size: 18px;
          font-weight: bold;
          background: transparent;
          border-width: 0;
          padding-left: 60px;

        }

      }
    }

    .sure-btn {
      width: 120%;
      height: 80px;
      font-size: 26px;
      color: #ffffff;
      letter-spacing: 2px;
      position: relative;

      &::after {
        content: '';
        background: #1788b6;
        opacity: 0.87;
        z-index: -3;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
      }
    }

    .dividing {
      height: 2px;
      width: 80%;
      background: #0e2c69;
    }

    .forgot-password {
      width: 100%;
      height: 60px;
      font-weight: bold;
      color: #676767;
    }

  }

  .user-layout-login {
    /deep/ .ant-input {
      padding-left: 50px;
      font-size: 16px;
    }
    /deep/ .ant-input-lg {
      /*font-size: 14px;*/
      color: #b4bed0;
    }


    .forgot-password {
      position: absolute;
      bottom: 3vh;
      width: 100%;
      height: 60px;
      /*font-weight: bold;*/
      color: #b4bed0;
      .click-link {
        margin-left: 12px;
        text-decoration:underline;
        color: #ffffff;
      }

      /deep/ .ant-btn {
        color: #ffffff;
        text-decoration:underline;
      }
    }

    label {
      font-size: 14px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 20px;
      height: 54px;
      width: 100%;
      color: #284479;
      font-weight: bold;
    }

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, .2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color .3s;

        &:hover {
          color: #1890ff;
        }
      }

      .register {
        float: right;
      }
    }
  }


</style>
<style>
  .valid-error .ant-select-selection__placeholder {
    color: #f5222d;
  }
</style>