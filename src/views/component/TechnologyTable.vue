<template>
    <div v-if="columns&&columns.length" :style="{'max-width': maxWidth ? maxWidth : '250px'}" class="table-container">
      <table :style="{width: (columns.length) * 140 + 'px'}">
        <tr>
          <td v-for="(item,index) in columns" :key="index">
            <span>{{item.name}}</span>
          </td>
        </tr>
        <tr>
          <td v-for="(item,index) in columns" :key="index">
            <a-button type="link"  class="button-text" @click="goRecord(item.id, index)" :disabled="item.status === '已核对'">
              {{item.status}}
            </a-button>
          </td>
        </tr>
      </table>

    </div>
</template>

<script>
  export default {
    name: 'TechnologyTable',
    props: ['columns','maxWidth'],
    mounted() {
    },
    data(){
      return{
      }
    },
    methods:{
      goRecord(id, index){
        localStorage.setItem('selectTab', index);
        this.$router.push({
          path: `/trialManage/TrialProductionMaintenance?id=`+`${id}`
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .table-container {
    display: flex;
    /*justify-content: flex-start;*/
    height: 100%;
    /*min-height: 100%;*/
    max-height: 100%;
    /*max-width: 250px;*/
    /*min-width: 250px;*/
    overflow: auto;
    margin: 0 auto;
  }
  table {
      /*margin: 10px;*/
      /*border: 1px solid #e8e8e8;*/
      border-top: 1px solid #e8e8e8;
      border-left: 1px solid #e8e8e8;
      min-width: 140px;
      /*max-width: 2000px;*/
      tr {
        td {
          width: 140px;
          max-width: 140px !important;
          padding: 4px 16px !important;
          border-bottom: 1px solid #e8e8e8;
          border-right: 1px solid #e8e8e8;
          span {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .button-text{
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
      }
    }
    tr{
      background-color: #fff !important;
    }
    tr:first-child{
      background-color: #E3F1FA !important;
    }
  }

</style>