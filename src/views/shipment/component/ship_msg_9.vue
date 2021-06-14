<template>
  <div>
    <table class="table_2" :class="bottomHaves?'':'bottomHaves'">
      <tr>
        <th :class="bottomHaves?'':'bottomHaves'" style="background: #F5F8FA;width: 240px;">过程指令</th>
        <td :class="bottomHaves?'':'bottomHaves'" v-if="!isShow" style="width: 240px;">{{matterData.processOrderRequire}}</td>
        <td :class="bottomHaves?'':'bottomHaves'" v-if="isShow" style="width: 480px;">{{matterData.processOrderRequire}}</td>
        <td :class="bottomHaves?'':'bottomHaves'" v-if="!isShow" style="width: 240px;">
          <div v-if="isShow"></div>
          <div v-else>
            <slot name="btn"></slot>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ShipMsg9',
  data() {
    return {
      pageData: {},
      value: null
    }
  },
  props: ['isShow', 'matterData', 'bottomHaves'],
  created() {
    console.log(this.bottomHaves)
  },
  // watch: {
  //   matterData: {
  //     //深度监听，可监听到对象、数组的变化
  //     handler(val, oldVal) {
  //       // this.pageData = val
  //       this.pageData = JSON.parse(JSON.stringify(val))
  //     },
  //     deep: true //true 深度监听
  //   }
  // },
  methods: {}
}
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th {
  border-top: 0;
}
th,
td {
  padding: 8px;
  text-align: center;
}
.table_1 td {
  width: 120px;
}
.table_2 td,
.table_2 th {
  width: 240px;
}
.td_img {
  width: 120px;
  height: auto;
}
.table_1,
.table_2 {
  border: 1px solid #e8e8e8;
}
.table_2 th,
.table_2 td {
  border: 1px solid #e8e8e8;
}
.m_b_15 {
  margin-top: 20px;
}
.table_2 /deep/ .bottomHaves {
  border-bottom: 0 !important;
}
.bottomHaves{
  border-bottom: 0 !important;
}
</style>