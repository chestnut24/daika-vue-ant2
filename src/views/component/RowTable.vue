<template>
<!--  放这个组件的插槽位置-->
  <div v-if="dataSource && dataSource.length" class="table-container" :style="{'max-width': maxWidth ? maxWidth : '250px'}">
    <table :style="{width: (dataSource.length + (columns[0] && columns[0].title ? 1:0)) * 140 + 'px'}">
      <tr v-for="column in columns" :key="column.dataIndex">
        <td v-if="column.title"><span>{{ column.title }}</span></td>
        <td v-for="(data, index) in dataSource" :key="index">
          <span>{{ data[column.dataIndex] }}</span>
        </td>
      </tr>
      <slot name="customer-tr"></slot>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'RowTable',
    props: ['columns', 'dataSource', 'maxWidth'],
    data() {
      return {
        columnData: [],
        // columns: [ // 表头 仿照ant-table表头
        //   { title: '试制用途', dataIndex: 'purpose'},
        // ],
        // dataSource: [ // 数据 仿照ant-table数据
        //   {
        //     'number': 50,
        //     'isDeleted': 0,
        //     'purpose': '材料',
        //     'updateBy': null,
        //     'id': 39,
        //     'version': 0,
        //   },
        // ],
      };

    },
    mounted() {
      console.log(this.columns)
    }
    // watch: {
    //   dataSource() {
    //     this.columnData = this.dataSource;
    //   }
    // }
  };
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
    min-width: 100px;
    max-width: 2000px;
    tr {
      td {
        width: 140px;
        /*min-width: 100px !important;*/
        max-width: 140px;
        padding: 4px 16px !important;
        border-bottom: 1px solid #e8e8e8;
        border-right: 1px solid #e8e8e8;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      tr{
        background-color: #fff !important;
      }
      tr:first-child{
        background-color: #E3F1FA !important;
      }
    }
  }

</style>
