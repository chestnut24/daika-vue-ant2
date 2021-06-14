<template>
  <div class="secret-container">
    <div class="edit-secret-container" v-if="!editSuccess">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">

          <a-form-item style="border-bottom: solid 1px #f2f2f4">
            <div class="item-input">
              <div class="item-title">旧密码</div>
              <a-input type="password" placeholder="请输入" v-decorator="[ 'oldpassword', validatorRules.oldpassword]"/>
            </div>
          </a-form-item>

          <a-form-item style="border-bottom: solid 1px #f2f2f4">
            <div class="item-input">
              <div class="item-title">新密码</div>
              <a-input type="password" placeholder="请输入" v-decorator="[ 'password', validatorRules.password]"/>
            </div>
          </a-form-item>

          <a-form-item>
            <div class="item-input">
              <div class="item-title">确认密码</div>
              <a-input type="password" @blur="handleConfirmBlur" placeholder="请确认"
                       v-decorator="[ 'confirmpassword', validatorRules.confirmpassword]"/>
            </div>
          </a-form-item>

        </a-form>
        <div class="submit-container">
          <a-button type="primary" class="submit" @click="handleOk">下一步</a-button>
        </div>
      </a-spin>
    </div>
    <div v-else class="edit-success">
      <img src="../../../assets/mobile/footer/mine/secret_success.png"/>
      <div class="success-title">设置密码成功</div>
      <div class="success-tip">{{ lastTime }}s后自动返回上一页</div>
<!--      <a-button @click="test">test</a-button>-->
    </div>
  </div>
</template>

<script>
  import { putAction } from '@/api/manage';
  import { mapActions, mapGetters, mapState } from 'vuex';
  import store from '@/store/';

  export default {
    name: 'secret',
    data() {
      return {
        timer: 0,
        lastTime: 5,
        editSuccess: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        url: 'sys/user/updatePassword',
        username: '',
        validatorRules: {
          oldpassword: {
            rules: [{
              required: true, message: '请输入旧密码!',
            }],
          },
          password: {
            rules: [{
              required: true, message: '请输入新密码!',
            }, {
              validator: this.validateToNextPassword,
            }],
          },
          confirmpassword: {
            rules: [{
              required: true, message: '请确认新密码!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          },
        },
      };
    },
    mounted() {
      // this.username = this.userInfo().username;
      this.username = store.getters.userInfo.username;
      this.show(this.username);
    },
    beforeDestroy: function() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    methods: {
      ...mapGetters(['nickname', 'avatar', 'userInfo']),

      test() {
        this.countDown();
      },
      validateToNextPassword(rule, value, callback) {
        const form = this.form;
        if (value && this.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      },
      compareToFirstPassword(rule, value, callback) {
        const form = this.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('两次输入的密码不一样！');
        } else {
          callback();
        }
      },
      handleConfirmBlur(e) {
        const value = e.target.value;
        this.confirmDirty = this.confirmDirty || !!value;
      },

      show(uname) {
        if (!uname) {
          this.$message.warning('当前系统无登录用户!');
          return;
        } else {
          this.username = uname;
          this.form.resetFields();
          this.visible = true;
        }
      },

      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let params = Object.assign({ username: this.username }, values);
            console.log('修改密码提交数据', params);
            putAction(this.url, params).then((res) => {
              if (res.success) {
                // console.log(res)
                that.$message.success(res.message);
                this.editSuccess = true;
                this.countDown();
                // that.close();
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            });
          }
        });
      },

      countDown() {
        this.timer = setInterval(() => {
          this.lastTime--;
          console.log('lastTime', this.lastTime);
          if (!this.lastTime) {
            clearInterval(this.timer);
            this.$router.push({
              path: '/app/mine/index',
            })
          }
        }, 1000);
      },
    },
  };
</script>

<style scoped lang="less">
  .secret-container {
    width: 100vw;
    height: 100vh;
    background: #f5f8fa;

    .edit-secret-container {
      /deep/ .ant-form-item {
        margin: 0;
      }

      width: 100vw;

      .item-input {
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        background: #ffffff;
        border-bottom: solid 1px #f2f2f4;

        &:last-child {
          border-width: 0;
        }

        /deep/ .ant-input {
          width: 244px;
          border-width: 0;
          text-align: right;
        }
      }

      .submit-container {
        width: 100vw;
        display: flex;
        justify-content: center;
        margin-top: 32px;
      }

      .submit {
        width: 80vw;
        height: 40px;
      }
    }

    .edit-success {
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 20vw;
        margin-top: 64px;
      }

      .success-title {
        margin: 32px 0 5px;
        font-size: 16px;
        color: #5c6374;
      }

      .success-tip {
        font-size: 14px;
        color: #8e939e;
      }
    }
  }

</style>