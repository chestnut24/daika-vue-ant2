<template>
  <!--  查询tab4  试制策划-->
<!--  <div>-->
<!--    <a-button @click="test" type="primary">test</a-button>-->
<!--    <div v-if="!dataSource.length" class="loading">-->
<!--      <a-spin tip="Loading...">-->
<!--      </a-spin>-->
<!--    </div>-->

<!--  </div>-->
  <a-spin :spinning="spinning" style="display: flex;justify-content: center;width: 100%">
    <div v-for="(data, dataIndex) in dataSource" :key="dataIndex">
      <QueryPlanTab4Table :datasource="data"></QueryPlanTab4Table>
    </div>
  </a-spin>
</template>

<script>
  import {
    getTrialQueryPlanById,
    getDictItemsFromCache,
  } from '@/api/api';

  import QueryPlanTab4Table from './QueryPlanTab4Table';
  export default {
    name: 'QueryPlanTab4',

    components: {  QueryPlanTab4Table },
    data() {
      return {

        spinning: false,
        selectId: 0, // 选中行的id
        trialProductionFormNo: null,
        columns: [
          { title: '试制流转单', dataIndex: 'formBaseNo', align: 'center', scopedSlots: { customRender: 'formBaseNo' } },
          { title: '工序', dataIndex: 'processTechnology', align: 'center' },
          { title: '子序号', dataIndex: 'subNo', align: 'center' },
          { title: '试制数量', dataIndex: 'trialProductionNumber', align: 'center' },
          { title: '用途', dataIndex: 'purpose', align: 'center' },
          { title: '备注', dataIndex: 'remarks', align: 'center' },
        ],
        dataSource: [],
        specialTitle: ['压铸', '热处理', '粗车', '精车', '喷涂', ],
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
        // console.log('data source', this.dataSource);
      },

      getDataById() {
        this.spinning = true;
        let param = { formId: this.selectId };
        getTrialQueryPlanById(param).then((data) => {
          this.spinning = false;
          if (data.success) {
            // this.$message.success(data.message);
            this.dataSource = data.result;
            console.log('return data', data);
          } else {
            this.$message.warning(data.message)
          }
        })
      },

    },
  };
</script>

<style scoped lang="less">

  .loading {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/ .ant-spin-container{
    width: 100%;
    .table-title{
      background-color: #E3F1FA;
      color: black;
      font-weight: 400;
    }
    .ant-table-thead tr th{
      background-color: #FAFAFA !important;
    }
  }

</style>
