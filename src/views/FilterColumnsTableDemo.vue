<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="用户名">
              <j-input placeholder="请输入名称模糊查询" v-model="queryParam.name"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        <span style="float:right;">
          <a @click="loadData()"><a-icon type="sync"/>刷新</a>
        </span>
      </div>

      <FilterColumnsTable
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="operation" slot-scope="record">
          <a @click="handleEdit(record.record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </FilterColumnsTable>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <FilterColTableDemoModal ref="modalForm" @ok="modalFormOk"></FilterColTableDemoModal>
  </a-card>
</template>

<script>
  import FilterColTableDemoModal from '@comp/FilterColTableDemoModal.vue'
  import JInput from '@comp/JInput.vue'
  import FilterColumnsTable from '@comp/custom/FilterColumnsTable'
  import { filterDictTextByCache } from '@comp/dict/JDictSelectUtil'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: 'FilterColumnsTableDemo',
    mixins: [JeecgListMixin],
    components: {
      FilterColTableDemoModal,
      JInput,
      FilterColumnsTable
    },
    data() {
      return {
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: function(t, r, index) {
              return parseInt(index) + 1
            }
          },
          {
            title: '姓名1',
            align: 'center',
            dataIndex: 'name'
          },
          {
            title: '关键词1',
            align: 'center',
            dataIndex: 'keyWord'
          },
          {
            title: '打卡时间名1',
            align: 'center',
            dataIndex: 'punchTime'
          },
          {
            title: '性别',
            align: 'center',
            dataIndex: 'sex',
            customRender: (text) => {
              //字典值替换通用方法
              return filterDictTextByCache('sex', text)
            }
          },
          {
            title: '年龄',
            align: 'center',
            dataIndex: 'age'
          },
          {
            title: '生日',
            align: 'center',
            dataIndex: 'birthday'
          },
          {
            title: '邮箱',
            align: 'center',
            dataIndex: 'email'
          },
          {
            title: '个人简介',
            align: 'center',
            dataIndex: 'content'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            scopedSlots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',
              customRender: 'action'
            }
          }
        ],
        url: {
          list: '/trial/formBase/formBaseWorkList',
          delete: '/test/jeecgDemo/delete',
          deleteBatch: '/test/jeecgDemo/deleteBatch',
          exportXlsUrl: '/test/jeecgDemo/exportXls'
        },
        dataSource: [{
          name: 'Z张三',
          keyWord: '关键词',
          punchTime: '2020-08-08',
          sex: '男',
          age: '28',
          birthday: '生日啊',
          email: '111111@qq.com',
          content: '还需要介绍吗',

        }]
      }
    },
    methods: {},
    created() {
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>
