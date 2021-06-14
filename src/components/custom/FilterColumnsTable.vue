<!-- 可以过滤展示列的表格组件：基于 ant-design-vue table 组件 -->
<template>
  <a-table
    ref="table"
    size="middle"
    bordered
    rowKey="id"
    :columns="showColumns"
    :dataSource="dataSource"
    :pagination="pagination"
    :loading="loading"
    :rowSelection="rowSelection"
    @change="onTableChange">

    <!-- 列表自动过滤项 -->
    <div slot="filterDropdown">
      <a-card>
        <a-space direction="vertical" size="middle">
          <a-input placeholder="回车搜索列" @change="onSearchIpt" @keyup.enter.stop="doSearch">
            <a-icon slot="suffix" type="search" />
          </a-input>
          <a-checkbox-group @change="onColSettingsChange" v-model="settingColumns" :defaultValue="settingColumns">
            <a-row style="width: 400px">
              <template v-for="(item,index) in columns">
                <template v-if="item.key != 'rowIndex' && item.dataIndex != 'action'">
                  <a-col :span="12">
                    <a-checkbox :value="item.dataIndex">
                      <j-ellipsis :value="item.title" :length="10"></j-ellipsis>
                    </a-checkbox>
                  </a-col>
                </template>
              </template>
            </a-row>
          </a-checkbox-group>
        </a-space>
      </a-card>
    </div>
    <a-tooltip slot="filterIcon">
      <template slot="title">自定义显示列</template>
      <a-icon type='profile' :style="{fontSize: '16px', color: '#108ee9'}"/>
    </a-tooltip>

    <template slot="action" slot-scope="text, record">
      <slot name="operation" :text="text" :record="record"></slot>
    </template>

  </a-table>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'FilterColumnsTable',
    props: {
      size: {
        type: String,
        default: ''
      },
      bordered: {
        type: Boolean,
        default: false
      },
      rowKey: {
        type: String,
        default: 'id'
      },
      columns: {
        type: Array,
        default() {
          return []
        }
      },
      dataSource: {
        type: Array,
        default() {
          return []
        }
      },
      pagination: {
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      },
      rowSelection: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    watch: {
      'columns': {
        handler(val) {
          console.info('columns columns columns')
          this.initColumns()
        },
        immediate: true
      }
    },
    data() {
      return {
        // 列设置
        settingColumns: [],
        // 显示的列
        showColumns: [],
        // 搜索列
        searchColTxt: ''
      }
    },
    methods: {
      onTableChange(pagination, filters, sorter) {
        this.$emit('change', pagination, filters, sorter);
      },
      //列设置更改事件
      onColSettingsChange(checkedValues) {
        var key = this.$route.name + ':colsettings';
        Vue.ls.set(key, checkedValues, 7 * 24 * 60 * 60 * 1000);
        this.settingColumns = checkedValues;
        const cols = this.columns.filter(item => {
          if (item.key == 'rowIndex' || item.dataIndex == 'action') {
            return true;
          }
          if (this.settingColumns.includes(item.dataIndex)) {
            return true;
          }
          return false;
        })
        this.showColumns = cols;
      },
      initColumns() {
        var key = this.$route.name + ':colsettings';
        let colSettings = Vue.ls.get(key);
        if (colSettings == null || colSettings == undefined) {
          let allSettingColumns = [];
          this.columns.forEach(function(item, i, array) {
            allSettingColumns.push(item.dataIndex);
          });
          this.settingColumns = allSettingColumns;
          this.showColumns = this.columns;
        } else {
          this.settingColumns = colSettings;
          const cols = this.columns.filter(item => {
            if (item.key == 'rowIndex' || item.dataIndex == 'action') {
              return true;
            }
            if (colSettings.includes(item.dataIndex)) {
              return true;
            }
            return false;
          });
          this.showColumns = cols;
        }
      },
      onSearchIpt(e) {
        this.searchColTxt = e.target.value;
      },
      doSearch() {
        const cols = this.columns.filter(item => {
          if (item.key == 'rowIndex' || item.dataIndex == 'action' ||
            item.title.indexOf(this.searchColTxt) > -1) {
            return true;
          }
          return false;
        });
        this.showColumns = cols;
        this.settingColumns = cols.map(item => item.dataIndex);
      }
    }
  }
</script>

<style scoped>

</style>