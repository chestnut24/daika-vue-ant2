<template>
  <div class="reviewTimeDialog">
    <!-- 中间-表格（可能有分页） -->
    <div class="banner2">
      <div class="table-frame">
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          bordered
          :pagination="false"
          :scroll="{ x: 1000 }"
        >
          <a-space
            slot="factoryWareHouse_dictText"
            slot-scope="text, operate"
            class="operate-row"
          >{{operate.factoryWareHouse_dictText || operate.factoryWareHouse }}</a-space>
        </a-table>
      </div>
    </div>
    <!-- 底部 -->
    <div class="banner3 foot">
      <a-button @click="close()">关闭</a-button>
    </div>
  </div>
</template>

<script>
import { getshipWarehouseOut, getOptions } from '@/api/api'
export default {
  name: 'checkOutDialog',
  data() {
    return {
      dataSource: [], //表格数据
      columns: [
        {
          title: '轮型项目号',
          dataIndex: 'projectNo',
          key: 'projectNo',
          align: 'center'
        },
        {
          title: '用途',
          dataIndex: 'purpose_L',
          key: 'purpose_L',
          align: 'center'
        },
        {
          title: '样件批次号',
          dataIndex: 'batch',
          key: 'batch',
          align: 'center'
        },
        {
          title: '轮型尺寸',
          dataIndex: 'size',
          key: 'size',
          align: 'center'
        },
        {
          title: '所在仓库',
          dataIndex: 'factoryWareHouse_dictText',
          key: 'factoryWareHouse_dictText',
          align: 'center',
          scopedSlots: { customRender: 'factoryWareHouse_dictText' }
        },
        {
          title: '库位',
          dataIndex: 'inventoryLocation',
          key: 'inventoryLocation',
          align: 'center'
        },
        {
          title: '样件位置',
          dataIndex: 'exemplarLocation',
          key: 'exemplarLocation',
          align: 'center'
        },
        {
          title: '已出库',
          dataIndex: 'outWarehouse',
          key: 'outWarehouse',
          align: 'center'
        }
      ],
      dic: {
        // 表单中的部分数据对应的的数据词典
        noun: [] // 用途
      },
      tableLoading: false
    }
  },
  props: ['id'],
  components: {},
  created() {
    this.getDic()
  },
  methods: {
    getDic() {
      // 获取表单中的部分字段对应的字典
      for (let name in this.dic) {
        let searchName = this.humpOrLine(name, 'toLine')
        getOptions(searchName, '').then(data => {
          this.dic[name] = data
        })
      }
      let _this = this
      let abcd = setInterval(function() {
        let aaa = true
        for (let name in _this.dic) {
          if (_this.dic[name].length === 0) {
            aaa = false
          }
        }
        if (aaa) {
          clearInterval(abcd)
          _this.getMsg(true)
        }
      }, 500)
    },
    // 查询列表
    getMsg() {
      getshipWarehouseOut({
        shippingFlowSheet: this.id
      }).then(data => {
        console.log(data)
        if (data.success) {
          if (!data.result.length) {
            this.dataSource = []
            this.tableLoading = false
          } else {
            for (let i = 0; i < data.result.length; i++) {
              // 遍历返回的数据列表
              // 如果该属性在字典里
              for (let j = 0; j < this.dic['noun'].length; j++) {
                // 遍历该字典，看看有哪些值
                if (data.result[i]['purpose'] == this.dic['noun'][j].value) {
                  // 找到value相等时对应的label
                  data.result[i]['purpose' + '_L'] = this.dic['noun'][j].label
                }
              }
            }
            // 数据处理
            this.dataSource = data.result
            this.tableLoading = false
          }
        } else {
          this.$message.error(data.message)
          this.tableLoading = false
        }
      })
    },
    humpOrLine(name, type) {
      // 驼峰式转下划线 toLine  下划线转驼峰式 toHump
      if (type === 'toLine') {
        return name.replace(/([A-Z])/g, '_$1').toLowerCase()
      } else if (type === 'toHump') {
        return name.replace(/\_(\w)/g, function(all, letter) {
          return letter.toUpperCase()
        })
      }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.reviewTimeDialog {
  width: 100%;
  height: auto;
}
.banner3 {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}
.m_r_20 {
  margin-right: 20px;
}

.bottom-page {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  align-items: center;
}
</style>