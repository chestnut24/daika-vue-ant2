<template>
  <!--  查询tab2  试制前工艺维护-->
<!--    <div>-->
<!--      <div v-if="!dataSource.length" class="loading">-->
<!--        <a-spin tip="Loading...">-->
<!--        </a-spin>-->
<!--      </div>-->
<!--      <a-button @click="test" type="primary">test</a-button>-->

<!--    </div>-->

  <a-spin :spinning="spinning" tip="loading">
    <a-tabs v-model:activeKey="activeKey" style="margin: 0 20px 20px 20px">
      <template v-for="(data, index) in dataSource">
        <a-tab-pane :key="index" :tab="data.technologyName">
          <QueryMaintainTab2Table :data="data"></QueryMaintainTab2Table>
        </a-tab-pane>
      </template>
    </a-tabs>
  </a-spin>
</template>

<script>
  import {
    getTrialMaintainById,
    getDictItemsFromCache,
  } from '@/api/api';

  import QueryMaintainTab2Table from './QueryMaintainTab2Table';
  export default {
    name: 'QueryMaintainTab2',

    components: {  QueryMaintainTab2Table },

    data() {
      return {
        spinning: false,
        selectId: 0, // 选中行的id
        trialProductionFormNo: null,
        dataSource: [],
        activeKey: 0,
      };
    },

    mounted() {
      this.selectId = this.$route.query.id;
      this.trialProductionFormNo = this.$route.query.no;
      this.getDataById();
    },

    methods: {
      test() {
        // console.log('1');
        this.getDataById();
      },

      getDataById() {
        this.spinning = true;
        let param = { id: this.selectId };
        getTrialMaintainById(param).then((data) => {
          this.spinning = false;
          if (data.success) {
            data = data.result;
            console.log('data', data);
            // this.$message.success(data.message);
            this.dataSource = data.formWorks;
            // console.log('this.dataSource', this.dataSource);
          } else {
            this.$message.warning(data.message)
          }
        })
      },

    },
  };
</script>

<style scoped>
  .loading {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>