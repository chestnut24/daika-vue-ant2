<template>
  <div>
    <a-modal :visible="visible" title="选择部件号" width="1100px" @cancel="handleCancel">
      <div class="search-frame" style="margin-bottom: 15px;">
        <a-row>
          <a-space align="center">
            <div class="left-text">
              <span style="font-size: 15px;">
                <b>戴卡部件号检索:</b>
              </span>
            </div>
            <a-input v-model="projectNo" placeholder="请输入戴卡部件号" style="margin-left: 20px;" />
            <a-button style="margin-left: 20px;" @click="search()" type="primary" ghost>搜索</a-button>
          </a-space>
        </a-row>
      </div>
      <div>
        <div class="part-title">
          <div class="part-title_blue"></div>
          <div>部件信息</div>
        </div>
        <a-card class="search-table My_search_table">
          <div class="table-frame">
            <div class="left-frame">
              <div class="mould-frame-down jn-public-table" v-if="!(dataSource.length == 0)">
                <a-table
                  :columns="columns"
                  :data-source="dataSource"
                  bordered
                  :pagination="false"
                  :customRow="rowClick"
                >
                  <a-space slot="projectNo" slot-scope="text, operate, i" class="operate-row">
                    <a-button type="link" @click="showProjectDetail(operate, i)">{{ text }}</a-button>
                  </a-space>
                </a-table>
                <!--    分页-->
                <div class="bottom-page">
                  <a-pagination
                    class="alerm"
                    :total="total"
                    :show-total="total => `共 ${total} 条`"
                    :page-size="pageSize"
                    :current="currentPage"
                    @change="pageChange"
                  />
                  <div style="margin: 0 20px">共 {{pageNum}} 页</div>
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </div>
      <template #footer>
        <a-button key="back" @click="handleCancel()">取消</a-button>
        <!-- v-on:click="$emit('get-text', selectProject)" -->
        <a-button key="submit" type="primary" @click="handleOk">选择</a-button>
      </template>
      <project-information ref="projectInfor"></project-information>
    </a-modal>
  </div>
</template>

<script>
import { getOptions, getProjectNo } from '@api/api'

import ProjectInformation from '@views/system/ProjectInformation'

export default {
  name: 'SelectprojectNo',
  components: { ProjectInformation },
  data() {
    return {
      dataSource: [], // 检索数组
      total: 0, // 共多少条
      pageSize: 5, // 一页多少条
      currentPage: 1, // 当前页
      pageNum: 1, // 共多少页
      jumpPage: 1, // 跳转到第几页
      visible: false,
      selectProject: {},
      dic: {
        // 下拉选项
        purpose: [], // 用途-作废
        noun: [] // 用途-作废
      },
      projectNo: '',
      columns: [
        {
          title: '戴卡部件号',
          dataIndex: 'projectNo',
          key: 'projectNo',
          align: 'left',
          scopedSlots: { customRender: 'projectNo' }
        },
        {
          title: '用途',
          dataIndex: 'purposeLabel',
          key: 'purposeLabel',
          align: 'left'
        },
        {
          title: '尺寸',
          dataIndex: 'size',
          key: 'size',
          align: 'left'
        },

        {
          title: '项目经理',
          dataIndex: 'projectManager',
          key: 'projectManager',
          align: 'left'
        }
      ]
    }
  },
  methods: {
    rowClick(record) {
      // 事件
      return {
        on: {
          click: () => {
            this.selectProject = record
          }
        },
        style: {
          'background-color': record === this.selectProject ? '#e6f7ff' : 'white'
        }
      }
    },
    showProjectDetail(operate, index) {
      this.$refs.projectInfor.getData(Number(operate.id))
    },
    add() {
      this.visible = true
    },
    handleOk() {
      if (this.selectProject.id) {
        this.$emit('get-text', this.selectProject)
        this.dataSource = []
        this.visible = false
        this.projectNo = ''
        this.selectProject = {}
      } else {
        this.$message.error('该数据有误请选择其他数据')
      }
    },
    handleCancel() {
      this.visible = false
      this.dataSource = []
      this.projectNo = ''
      this.selectProject = {}
    },

    pageChange(val) {
      // 分页改变
      this.currentPage = Number(val)
      this.getDic()
      getProjectNo(this.projectNo, this.currentPage, this.pageSize).then(data => {
        this.total = data.result.total
        this.currentPage = data.result.current
        this.pageSize = data.result.size
        this.pageNum = data.result.pages
        this.dataSource = data.result.records
        for (let i = 0; i < this.dataSource.length; i++) {
          // 遍历返回的数据列表
          for (let j = 0; j < this.dic['noun'].length; j++) {
            if (
              this.dataSource[i].purpose &&
              Number(this.dataSource[i].purpose) === Number(this.dic['noun'][j].value)
            ) {
              // 找到value相等时对应的label
              this.dataSource[i].purposeLabel = this.dic['noun'][j].label
            }
          }
        }
      })
    },
    pageJump(page) {
      // 点击指定分页跳转的情况下
      if (page > this.pageNum) {
        page = this.pageNum
        this.jumpPage = this.pageNum
      } else if (page < 1) {
        page = 1
        this.jumpPage = 1
      }
      this.currentPage = page
      this.getDic()
      getProjectNo(this.projectNo, this.currentPage, this.pageSize).then(data => {
        this.total = data.result.total
        this.currentPage = data.result.current
        this.pageSize = data.result.size
        this.pageNum = data.result.pages
        this.dataSource = data.result.records
        for (let i = 0; i < this.dataSource.length; i++) {
          // 遍历返回的数据列表
          for (let j = 0; j < this.dic['noun'].length; j++) {
            if (
              this.dataSource[i].purpose &&
              Number(this.dataSource[i].purpose) === Number(this.dic['noun'][j].value)
            ) {
              // 找到value相等时对应的label
              this.dataSource[i].purposeLabel = this.dic['noun'][j].label
            }
          }
        }
      })
    },
    getAppointOption() {
      // 获取指定的下拉框
      for (let name in this.option) {
        getOptions(name, '').then(data => {
          this.option[name] = data
        })
      }
    },
    getDic() {
      // 获取表单中的部分字段对应的字典
      for (let name in this.dic) {
        getOptions(name, '').then(data => {
          this.dic[name] = data
        })
      }
    },
    search() {
      this.dataSource = []
      this.getDic()
      getProjectNo(this.projectNo, this.currentPage, this.pageSize).then(data => {
        if (data) {
          this.total = data.result.total
          this.currentPage = data.result.current
          this.pageSize = data.result.size
          this.pageNum = data.result.pages
          this.dataSource = data.result.records
          for (let i = 0; i < this.dataSource.length; i++) {
            // 遍历返回的数据列表
            for (let j = 0; j < this.dic['noun'].length; j++) {
              if (
                this.dataSource[i].purpose &&
                Number(this.dataSource[i].purpose) === Number(this.dic['noun'][j].value)
              ) {
                // 找到value相等时对应的label
                this.dataSource[i].purposeLabel = this.dic['noun'][j].label
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '../../css/public-table-css.less';
.table-frame {
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  width: 100%;
}
.left-frame {
  width: 100%;
}
.bottom-page {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
}
.search-table {
  min-height: 300px;
}
.My_search_table /deep/ .ant-card-body {
  padding: 10px;
}
.part-title {
  width: 100%;
  background: #f4f5f7;
  margin: 15px 0;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 2px;
}
.part-title_blue {
  width: 3px;
  height: 19px;
  background: #347ef2;
  border-radius: 1.5px;
  margin-right: 10px;
}
</style>