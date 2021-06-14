<template>
  <a-spin :spinning="spinning">
    <a-list
      itemLayout="horizontal"
      :dataSource="data"
    >

      <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
        <a-list-item-meta>
          <a slot="title">{{ item.title }}</a>
          <span slot="description">
          <div class="list-item-description-container">
          <span class="security-list-description">{{ item.description }}</span>
          <span v-if="item.value">：</span>
          <span v-if="!isEdit" class="security-list-value">{{ item.value }}</span>
          <a-input v-if="isEdit" style="width: 244px;margin-left: 12px" placeholder="请输入" v-model="bindValue[index]"/>
          </div>
        </span>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
    <div class="btn-group">
<!--      <a-button @click="test">test</a-button>-->
      <a-button v-if="!isEdit" type="primary" @click="editInfo">修改</a-button>
      <a-button v-if="isEdit" @click="cancelInfo">取消</a-button>
      <a-button v-if="isEdit" type="primary" @click="saveInfo">保存</a-button>
    </div>
  </a-spin>
</template>

<script>
  import {listBindInfo, updateMobileInfo} from '@/api/api';
  import store from '@/store/';
  export default {
    data() {
      return {
        isEdit: false, // 是否正处于编辑状态
        spinning: false,
        data: [
          { title: '手机唯一编码', description: 'UUID', value: '' },
          { title: '手机推送注册码', description: 'registrationId', value: '' },
        ],
        bindValue: ['', ''], // 绑定的值，第一个值是UUID，第二个值是registrationId
      };
    },
    mounted() {
      this.getUserInfo();
    },
    methods: {
      test() {
        console.log(store.getters.userInfo);
      },

      getUserInfo() {
        listBindInfo({userId: store.getters.userInfo.id}).then( data => {
          if (data.success) {
            data = data.result;
            this.data[0].value = data.mobileInfo.uuid;
            this.data[1].value = data.mobileInfo.registrationId;
          } else {
            this.$message.destroy();
            this.$message.error(data.message);
          }
        })
      },

      editInfo() {
        this.isEdit = true;
        this.bindValue[0] = this.data[0].value;
        this.bindValue[1] = this.data[1].value;
      },

      cancelInfo() {
        this.isEdit = false;
      },

      saveInfo() {
        this.spinning = true;
        this.data[0].value = this.bindValue[0];
        this.data[1].value = this.bindValue[1];
        // this.isEdit = false;
        let params = {
          uuid: this.data[0].value,
          registrationId: this.data[1].value,
          userId: store.getters.userInfo.id,
          userName: store.getters.userInfo.userName,
        };
        updateMobileInfo(params).then( data => {
          this.spinning = false;
          if (data.success) {
            data = data.result;
            this.data[0].value = data.mobileInfo.uuid;
            this.data[1].value = data.mobileInfo.registrationId;
            this.isEdit = false;
          } else {
            this.$message.destroy();
            this.$message.error(data.message);
          }
        })
      },
    },
  };
</script>

<style scoped lang="less">
  .list-item-description-container {
    display: flex;
    align-items: center;
  }
  .btn-group {
    display: flex;
    margin-top: 10px;
    button {
      margin-right: 20px;
    }
  }
</style>