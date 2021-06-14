<template>
  <div class="checkoutDialog">
    <div class="check_list">
      <div
        class="check_list_item"
        v-for="(item, index) in dataSource"
        :key="index"
        :class="index === dataSource.length -1 ?'':'check_bottom'"
      >
        <listCheckItem :matterData="item"></listCheckItem>
      </div>
      <div class="length0_tip" v-if="dataSource.length === 0">暂无数据</div>
    </div>
    <div class="banner3 foot my_page_btn">
      <a-button @click="close()" class="page_btn">关闭</a-button>
    </div>
  </div>
</template>

<script>
import { getshipWarehouseOut, getOptions } from '@/api/api'
import listCheckItem from './component/list_check_item'
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
          dataIndex: 'purpose',
          key: 'purpose',
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
          dataIndex: 'factoryWareHouse',
          key: 'factoryWareHouse',
          align: 'center'
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
      option: {
        noun: []
      },
      tableLoading: false
    }
  },
  props: ['id'],
  components: { listCheckItem },
  created() {
    this.getDic()
  },
  methods: {
    // 查询列表
    getMsg() {
      getshipWarehouseOut({
        shippingFlowSheet: this.id
      }).then(data => {
        if (data.success) {
          if (!data.result.length) {
            this.dataSource = []
            this.tableLoading = false
          } else {
            for (let k = 0; k < data.result.length; k++) {
              // 遍历返回的数据列表
              for (let j = 0; j < this.option['noun'].length; j++) {
                if (Number(data.result[k].purpose) === Number(this.option['noun'][j].value)) {
                  // 找到value相等时对应的label
                  data.result[k].purpose = this.option['noun'][j].label
                }
              }
            }
            // 数据处理
            this.dataSource = data.result
            console.log(this.dataSource)
            this.tableLoading = false
          }
        } else {
          this.$message.error(data.message)
          this.tableLoading = false
        }
      })
    },
    getDic() {
      // 获取表单中的部分字段对应的字典
      for (let name in this.option) {
        let searchName = this.humpOrLine(name, 'toLine')
        getOptions(searchName, '').then(data => {
          this.option[name] = data
        })
      }
      let _this = this
      let abcd = setInterval(function() {
        let aaa = true
        for (let name in _this.option) {
          if (_this.option[name].length === 0) {
            aaa = false
          }
        }
        if (aaa) {
          clearInterval(abcd)
          _this.getMsg()
        }
      }, 500)
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
.checkoutDialog {
  width: 100%;
  height: auto;
  /* position: relative; */
}
.banner3 {
  text-align: center;
  width: 100%;
  position: absolute;
  bottom: 30px;
  left: 0;
}
.page_btn {
  width: 90%;
}
.my_page_btn /deep/ .ant-btn {
  height: auto;
  padding: 10px 0;
  font-size: 16px;
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
.check_list {
  padding: 15px;
}
.check_bottom {
  margin-bottom: 15px;
}
.check_list_item {
  background: #f5f8fa;
  border-radius: 6px;
}
.length0_tip {
  font-size: 14px;
  text-align: center;
  color: rgba(0, 0, 0, 0.4);
}
</style>