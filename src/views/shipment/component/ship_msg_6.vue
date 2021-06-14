<template>
  <div>
    <div class="part-title">
      <div class="part-title_blue"></div>
      <div>包装确认</div>
    </div>
    <table class="table_1 m_b_15">
      <!-- <tr style="background: #F5F8FA;">
        <th colspan="7">包装确认</th>
      </tr>-->
      <tr style="background: #F5F8FA;">
        <th style="width: 160px;">批次号</th>
        <th>出库数量</th>
        <th>待发数量</th>
        <th>报废数量</th>
        <th>返库数量</th>
        <th>转轮数量</th>
        <th style="width: 100px;">备注</th>
      </tr>
      <!-- 数据v-if出来的取决于数组 -->
      <tr v-for="(item, index) in pageData" :key="item.warehouseBatch+index">
        <td>{{item.warehouseBatch}}</td>
        <!-- 出库数量++ -->
        <td>{{item.deliveryNumber}}</td>
        <!-- 待发数量 -->
        <td v-if="isShow">{{item.readyNumber}}</td>
        <td v-else>
          <a-input-number
            class="input_num"
            size="small"
            :min="0"
            v-model="item.readyNumber"
            @change="onChange(index,item)"
          />
        </td>
        <!-- 报废数量 -->
        <td v-if="isShow">{{item.scrapNumber}}</td>
        <td v-else>
          <a-input-number
            class="input_num"
            size="small"
            :min="0"
            v-model="item.scrapNumber"
            @change="onChange(index,item)"
          />
        </td>
        <!-- 返库数量 -->
        <td v-if="isShow">{{item.returnNumber}}</td>
        <td v-else>
          <a-input-number
            class="input_num"
            size="small"
            :min="0"
            v-model="item.returnNumber"
            @change="onChange(index,item)"
          />
        </td>
        <!-- 转轮数量 -->
        <td v-if="isShow">{{item.runnerNumber}}</td>
        <td v-else>
          <a-input-number
            class="input_num"
            size="small"
            :min="0"
            v-model="item.runnerNumber"
            @change="onChange(index,item)"
          />
        </td>
        <!-- 备注 -->
        <td v-if="isShow">
          <div style="width: 180px;text-align: left;">{{item.warehouseBatchMark}}</div>
        </td>
        <td v-else>
          <a-textarea
            v-model="item.warehouseBatchMark"
            placeholder="可输入"
            :auto-size="{ minRows: 1, maxRows: 3 }"
          />
        </td>
      </tr>
    </table>
    <!-- banner2 -->
    <table class="table_2 m_b_15">
      <tr style="background: #F5F8FA;">
        <th>确认项</th>
        <th>是否合格</th>
        <th>备注</th>
      </tr>
      <tr>
        <td>包装方式</td>
        <td>
          <div v-if="isShow">
            <PassBtnShow :showData="matterData2.packingMethodIsItQualified == 0?true:false"></PassBtnShow>
          </div>
          <div v-else>
            <a-radio-group name="radioGroup" v-model="matterData2.packingMethodIsItQualified">
              <a-radio :value="0">合格</a-radio>
              <a-radio :value="1">不合格</a-radio>
            </a-radio-group>
            <span v-if="isShowPage.packingMethod_s" style="color: red;">*</span>
            <span v-else style="opacity: 0;">*</span>
          </div>
        </td>
        <td v-if="isShow">
          <div style="width: 160px;text-align: left;">{{matterData2.packingMethodMark}}</div>
        </td>
        <td v-else>
          <a-textarea
            v-model="matterData2.packingMethodMark"
            placeholder="可输入"
            :auto-size="{ minRows: 1, maxRows: 3 }"
          />
        </td>
      </tr>
      <tr>
        <td>标签</td>
        <td>
          <div v-if="isShow">
            <PassBtnShow :showData="matterData2.tagIsItQualified == 0?true:false"></PassBtnShow>
          </div>
          <div v-else>
            <a-radio-group name="radioGroup" v-model="matterData2.tagIsItQualified">
              <a-radio :value="0">合格</a-radio>
              <a-radio :value="1">不合格</a-radio>
            </a-radio-group>
            <span v-if="isShowPage.tag_s" style="color: red;">*</span>
            <span v-else style="opacity: 0;">*</span>
          </div>
        </td>
        <td v-if="isShow">
          <div style="width: 160px;text-align: left;">{{matterData2.tagMark}}</div>
        </td>
        <td v-else>
          <a-textarea
            v-model="matterData2.tagMark"
            placeholder="可输入"
            :auto-size="{ minRows: 1, maxRows: 3 }"
          />
        </td>
      </tr>
      <tr>
        <td>实验报告</td>
        <td>
          <div v-if="isShow">
            <PassBtnShow :showData="matterData2.reportIsItQualified == 0?true:false"></PassBtnShow>
          </div>
          <div v-else>
            <a-radio-group name="radioGroup" v-model="matterData2.reportIsItQualified">
              <a-radio :value="0">合格</a-radio>
              <a-radio :value="1">不合格</a-radio>
            </a-radio-group>
            <span v-if="isShowPage.report_s" style="color: red;">*</span>
            <span v-else style="opacity: 0;">*</span>
          </div>
        </td>
        <td v-if="isShow">
          <div style="width: 160px;text-align: left;">{{matterData2.reportMark}}</div>
        </td>
        <td v-else>
          <a-textarea
            v-model="matterData2.reportMark"
            placeholder="可输入"
            :auto-size="{ minRows: 1, maxRows: 3 }"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import PassBtnShow from './pass_btn_show'
export default {
  name: 'ShipMsg6',
  data() {
    return {
      pageData: {},
      value: null,
      defectDescriptionList: [],
      isShowPage: {
        packingMethod_s: false,
        tag_s: false,
        report_s: false
      }
    }
  },
  props: ['isShow', 'matterData', 'matterData2'],
  components: {
    PassBtnShow
  },
  created() {
    this.createdPage()
  },
  watch: {
    matterData: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        this.pageData = []
        console.log(val)
        val.forEach(item1 => {
          item1.shipmentSamplePackingVo.forEach(item2 => {
            this.pageData.push(item2)
          })
        })
        // this.pageData = JSON.parse(JSON.stringify(val))
        this.createdPage()
      },
      deep: true //true 深度监听
    }
  },

  methods: {
    // 查询列表
    getList() {
      // this.total = data.total;
      // this.pageNum = data.pageNum;
    },
    createdPage() {
      // 1.3个合格不合格判断，默认合格
      this.matterData2.packingMethodIsItQualified = this.matterData2.packingMethodIsItQualified
        ? this.matterData2.packingMethodIsItQualified
        : 0
      this.matterData2.tagIsItQualified = this.matterData2.tagIsItQualified ? this.matterData2.tagIsItQualified : 0
      this.matterData2.reportIsItQualified = this.matterData2.reportIsItQualified
        ? this.matterData2.reportIsItQualified
        : 0
      // 2.出库数量
      if (this.pageData && this.pageData.length) {
        this.pageData.forEach((item, index) => {
          item.deliveryNumber = item.deliveryNumber ? item.deliveryNumber : 0
          item.readyNumber = item.readyNumber ? item.readyNumber : 0
          item.returnNumber = item.returnNumber ? item.returnNumber : 0
          item.runnerNumber = item.runnerNumber ? item.runnerNumber : 0
          item.scrapNumber = item.scrapNumber ? item.scrapNumber : 0
          // item.deliveryNumber =
          //   Number(item.readyNumber) + Number(item.returnNumber) + Number(item.runnerNumber) + Number(item.scrapNumber)
        })
        this.pageData = JSON.parse(JSON.stringify(this.pageData))
      }
    },
    onChange(i, data) {
      console.log(i, data)
      // this.pageData[i].deliveryNumber =
      //   Number(this.pageData[i].readyNumber) +
      //   Number(this.pageData[i].returnNumber) +
      //   Number(this.pageData[i].runnerNumber) +
      //   Number(this.pageData[i].scrapNumber)
      // this.pageData = JSON.parse(JSON.stringify(this.pageData))
      let Arr = ['readyNumber', 'returnNumber', 'runnerNumber', 'scrapNumber']
      for (let index in this.pageData[i]) {
        if (Arr.indexOf(index) !== -1) {
          if (this.pageData[i][index] === null) {
            this.pageData[i][index] = 0
          }
        }
      }
    },
    submit() {
      let canSubmit = true
      let errorMsg = true
      if (this.pageData && this.pageData.length) {
        this.pageData.forEach((item, index) => {
          if (item.deliveryNumber == 0) {
            canSubmit = false
            errorMsg = '请确认包装确认数量信息是否正确'
          } else {
            if (
              Number(item.deliveryNumber) !==
              Number(item.readyNumber) +
                Number(item.returnNumber) +
                Number(item.runnerNumber) +
                Number(item.scrapNumber)
            ) {
              canSubmit = false
              errorMsg = '请检查输入数量，当前输入数量总和与出库数量不符'
            }
          }
        })
        this.pageData = JSON.parse(JSON.stringify(this.pageData))
      } else {
        canSubmit = false
        errorMsg = '请先进行出库操作'
      }
      let stringData = JSON.parse(JSON.stringify(this.matterData2))
      stringData.packingMethodIsItQualified = stringData.packingMethodIsItQualified.toString()
      stringData.tagIsItQualified = stringData.tagIsItQualified.toString()
      stringData.reportIsItQualified = stringData.reportIsItQualified.toString()
      return { isCan: canSubmit, data: stringData, list: this.pageData, errorMsg }
      // 2.提交接口-给主组件
    }
  }
}
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid #e8e8e8;
}
th {
  border-top: 0;
}
th,
td {
  padding: 8px;
  text-align: center;
}
.table_1 td,
.table_1 th {
  width: 90px;
}
.table_2 td,
.table_2 th {
  width: 180px;
}
.td_img {
  width: 120px;
  height: auto;
}
.table_1,
.table_2 {
  border: 1px solid #e8e8e8;
}
.m_b_15 {
  margin-top: 20px;
}
.table_textarea {
  min-height: 73px;
  text-align: left;
}
.input_num {
  width: 65px;
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