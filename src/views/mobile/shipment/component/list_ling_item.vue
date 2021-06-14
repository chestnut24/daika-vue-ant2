<template>
  <div class="app_ban2_list_item">
    <div class="list_item_1 dis_f">
      <div class="list_item_1_1">
        <!-- 图标1 -->
        <img class="list_item_1_1_icon list_icon" src="../../../../assets/mobile/shipment_app/list_03.png">
      </div>
      <div class="list_item_1_2">
        <div class="list_item_1_2_1">{{matterData.influenceProcess}}</div>
      </div>
      <div class="list_item_1_3"></div>
    </div>
    <div class="list_item_2">
      <div class="list_item_1_2_1">指令内容：</div>
      <div>{{matterData.processOrderRequire}}</div>
    </div>
  </div>
</template>

<script>
import { getOptions } from '@/api/api'
export default {
  name: 'listItem',
  data() {
    return {
      pageData: {},
      value: null,
      dic: {
        // 表单中的部分数据对应的的数据词典
        taskStatus: [] // 计划状态
      }
    }
  },
  props: ['matterData'],
  created() {
    this.getDic()
  },
  methods: {
    fi_shipPlanNumber(data) {
      if (this.matterData.urgentTaskStatus == 1) {
        return '--'
      } else if (data === 'null') {
        return '--'
      } else {
        return data
      }
    },
    fi_planRetestDate(data) {
      if (this.matterData.urgentTaskStatus == 1) {
        return '--'
      } else {
        return data
      }
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
          _this.getData()
        }
      }, 500)
    },
    getData() {
      // 遍历返回的数据列表
      console.log(this.dic.taskStatus);
      this.dic.taskStatus.forEach(item=>{
        if (this.matterData.influenceProcess == item.value){
          this.matterData.influenceProcess = item.label
        }
      })
    }
  }
}
</script>

<style scoped>
.app_ban2_list_item {
  padding: 14px;
  background: #f5f8fa;
  border-radius: 6px;
}
.list_item_1_1 {
  width: 32px;
}
.list_item_1_1_icon {
  font-size: 22px;
}
.list_item_1_2 {
  width: calc(100% - 92px);
}
.list_item_1_2_1 {
  font-size: 16px;
  font-weight: 600;
}
.list_item_1_2_2 {
  font-size: 14px;
  font-weight: 300;
  color: #828282;
}
.list_item_1_3 {
  width: 60px;
  text-align: right;
}
.list_item_1_3_1 {
  font-size: 14px;
  font-weight: 300;
  color: #828282;
}
.list_item_1_3_2 {
  font-size: 15px;
  font-weight: 600;
}
.list_item_1_3_3 {
  font-size: 22px;
}
.list_item_1 {
  margin-bottom: 5px;
}
.list_item_2 {
  border-top: 1px solid #e8e8e8;
  padding-top: 14px;
}

/* 多用 */
.dis_f {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.blue_color {
  color: #2a7bf1;
}
.red_color {
  color: #f23131;
}
.ori_color {
  color: #ff9e17;
}
.list_icon{
  width: 24px;
  height: auto;
}
</style>