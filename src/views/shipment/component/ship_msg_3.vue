<template>
  <div v-if="false">
    <table class="table_2 m_b_15">
      <tr style="background: #F5F8FA;">
        <!-- <th>序号</th> -->
        <th style="width: 30%;">物料核对</th>
        <th style="width: 60%;">包装清单</th>
        <!-- <th>是否合格</th> -->
      </tr>
      <tr v-if="pageData.totalPackageMaterialCheckOrNot !== '1'">
        <td>总包材</td>
        <td>{{pageData.totalPackageMaterial}}</td>
        <!-- <td>
          <div v-if="isShow">
            <PassBtnShow :showData="pageData.totalPackageMaterialIsItQualified == 0?true:false"></PassBtnShow>
          </div>
          <div v-else>
            <a-radio-group name="radioGroup" v-model="pageData.totalPackageMaterialIsItQualified">
              <a-radio :value="0">合格</a-radio>
              <a-radio :value="1">不合格</a-radio>
            </a-radio-group>
            <span v-if="isShowPage.totalPackageMaterial_s" style="color: red;">*</span>
            <span v-else style="opacity: 0;">*</span>
          </div>
        </td>-->
      </tr>
      <tr v-if="pageData.assemblyPartsCheckOrNot !== '1'">
        <td>装配件</td>
        <td>{{pageData.assemblyParts}}</td>
        <!-- <td>
          <div v-if="isShow">
            <PassBtnShow :showData="pageData.assemblyPartsIsItQualified == 0?true:false"></PassBtnShow>
          </div>
          <div v-else>
            <a-radio-group name="radioGroup" v-model="pageData.assemblyPartsIsItQualified">
              <a-radio :value="0">合格</a-radio>
              <a-radio :value="1">不合格</a-radio>
            </a-radio-group>
            <span v-if="isShowPage.assemblyParts_s" style="color: red;">*</span>
            <span v-else style="opacity: 0;">*</span>
          </div>
        </td>-->
      </tr>

      <tr v-if="pageData.wheelShapeCheckOrNot !== '1'">
        <td>轮型号</td>
        <td>{{pageData.wheelShape}}</td>
        <!-- <td>
          <div v-if="isShow">
            <PassBtnShow :showData="pageData.wheelShapeIsItQualified == 0?true:false"></PassBtnShow>
          </div>
          <div v-else>
            <a-radio-group name="radioGroup" v-model="pageData.wheelShapeIsItQualified">
              <a-radio :value="0">合格</a-radio>
              <a-radio :value="1">不合格</a-radio>
            </a-radio-group>
            <span v-if="isShowPage.wheelShape_s" style="color: red;">*</span>
            <span v-else style="opacity: 0;">*</span>
          </div>
        </td>-->
      </tr>
      <tr v-if="pageData.sizeCheckOrNot !== '1'">
        <td>尺寸</td>
        <td>{{pageData.size}}</td>
        <!-- <td>
          <div v-if="isShow">
            <PassBtnShow :showData="pageData.sizeIsItQualified == 0?true:false"></PassBtnShow>
          </div>
          <div v-else>
            <a-radio-group name="radioGroup" v-model="pageData.sizeIsItQualified">
              <a-radio :value="0">合格</a-radio>
              <a-radio :value="1">不合格</a-radio>
            </a-radio-group>
            <span v-if="isShowPage.size_s" style="color: red;">*</span>
            <span v-else style="opacity: 0;">*</span>
          </div>
        </td>-->
      </tr>
      <tr v-if="pageData.technologyCheckOrNot !== '1'">
        <td>工艺</td>
        <td>{{pageData.technology}}</td>
        <!-- <td>
          <div v-if="isShow">
            <PassBtnShow :showData="pageData.technologyIsItQualified == 0?true:false"></PassBtnShow>
          </div>
          <div v-else>
            <a-radio-group name="radioGroup" v-model="pageData.technologyIsItQualified">
              <a-radio :value="0">合格</a-radio>
              <a-radio :value="1">不合格</a-radio>
            </a-radio-group>
            <span v-if="isShowPage.technology_s" style="color: red;">*</span>
            <span v-else style="opacity: 0;">*</span>
          </div>
        </td>-->
      </tr>
      <tr v-if="pageData.plugInCheckOrNot !== '1'">
        <td>插件</td>
        <td>{{pageData.plugIn}}</td>
        <!-- <td>
          <div v-if="isShow">
            <PassBtnShow :showData="pageData.plugInIsItQualified == 0?true:false"></PassBtnShow>
          </div>
          <div v-else>
            <a-radio-group name="radioGroup" v-model="pageData.plugInIsItQualified">
              <a-radio :value="0">合格</a-radio>
              <a-radio :value="1">不合格</a-radio>
            </a-radio-group>
            <span v-if="isShowPage.plugIn_s" style="color: red;">*</span>
            <span v-else style="opacity: 0;">*</span>
          </div>
        </td>-->
      </tr>
      <tr v-if="pageData.steelSleeveCheckOrNot !== '1'">
        <td>钢套</td>
        <td>{{pageData.steelSleeve}}</td>
        <!-- <td>
          <div v-if="isShow">
            <PassBtnShow :showData="pageData.steelSleeveIsItQualified == 0?true:false"></PassBtnShow>
          </div>
          <div v-else>
            <a-radio-group name="radioGroup" v-model="pageData.steelSleeveIsItQualified">
              <a-radio :value="0">合格</a-radio>
              <a-radio :value="1">不合格</a-radio>
            </a-radio-group>
            <span v-if="isShowPage.steelSleeve_s" style="color: red;">*</span>
            <span v-else style="opacity: 0;">*</span>
          </div>
        </td>-->
      </tr>
      <tr v-if="pageData.workClothesCheckOrNot !== '1'">
        <td>工装</td>
        <td>{{pageData.workClothes}}</td>
        <!-- <td>
          <div v-if="isShow">
            <PassBtnShow :showData="pageData.workClothesIsItQualified == 0?true:false"></PassBtnShow>
          </div>
          <div v-else>
            <a-radio-group name="radioGroup" v-model="pageData.workClothesIsItQualified">
              <a-radio :value="0">合格</a-radio>
              <a-radio :value="1">不合格</a-radio>
            </a-radio-group>
            <span v-if="isShowPage.workClothes_s" style="color: red;">*</span>
            <span v-else style="opacity: 0;">*</span>
          </div>
        </td>-->
      </tr>
      <tr v-if="pageData.auxiliaryMaterialsCheckOrNot !== '1'">
        <td>辅材</td>
        <td>{{pageData.auxiliaryMaterials}}</td>
        <!-- <td>
          <div v-if="isShow">
            <PassBtnShow :showData="pageData.auxiliaryMaterialsIsItQualified == 0?true:false"></PassBtnShow>
          </div>
          <div v-else>
            <a-radio-group name="radioGroup" v-model="pageData.auxiliaryMaterialsIsItQualified">
              <a-radio :value="0">合格</a-radio>
              <a-radio :value="1">不合格</a-radio>
            </a-radio-group>
            <span v-if="isShowPage.auxiliaryMaterials_s" style="color: red;">*</span>
            <span v-else style="opacity: 0;">*</span>
          </div>
        </td>-->
      </tr>
      <tr v-if="pageData.barCodeCheckOrNot !== '1'">
        <td>条码</td>
        <td>{{pageData.barCode}}</td>
        <!-- <td>
          <div v-if="isShow">
            <PassBtnShow :showData="pageData.barCodeIsItQualified == 0?true:false"></PassBtnShow>
          </div>
          <div v-else>
            <a-radio-group name="radioGroup" v-model="pageData.barCodeIsItQualified">
              <a-radio :value="0">合格</a-radio>
              <a-radio :value="1">不合格</a-radio>
            </a-radio-group>
            <span v-if="isShowPage.barCode_s" style="color: red;">*</span>
            <span v-else style="opacity: 0;">*</span>
          </div>
        </td>-->
      </tr>
      <tr v-if="pageData.tagCheckOrNot !== '1'">
        <td>标签</td>
        <td>{{pageData.tag}}</td>
        <!-- <td>
          <div v-if="isShow">
            <PassBtnShow :showData="pageData.tagIsItQualified == 0?true:false"></PassBtnShow>
          </div>
          <div v-else>
            <a-radio-group name="radioGroup" v-model="pageData.tagIsItQualified">
              <a-radio :value="0">合格</a-radio>
              <a-radio :value="1">不合格</a-radio>
            </a-radio-group>
            <span v-if="isShowPage.tag_s" style="color: red;">*</span>
            <span v-else style="opacity: 0;">*</span>
          </div>
        </td>-->
      </tr>
      <tr v-if="pageData.doubleBoxCheckOrNot !== '1'">
        <td>双箱</td>
        <td>{{pageData.doubleBox}}</td>
        <!-- <td>
          <div v-if="isShow">
            <PassBtnShow :showData="pageData.doubleBoxIsItQualified == 0?true:false"></PassBtnShow>
          </div>
          <div v-else>
            <a-radio-group name="radioGroup" v-model="pageData.doubleBoxIsItQualified">
              <a-radio :value="0">合格</a-radio>
              <a-radio :value="1">不合格</a-radio>
            </a-radio-group>
            <span v-if="isShowPage.doubleBox_s" style="color: red;">*</span>
            <span v-else style="opacity: 0;">*</span>
          </div>
        </td>-->
      </tr>
      <tr v-if="pageData.trayCheckOrNot !== '1'">
        <td>托盘</td>
        <td>{{pageData.tray}}</td>
        <!-- <td>
          <div v-if="isShow">
            <PassBtnShow :showData="pageData.trayIsItQualified == 0?true:false"></PassBtnShow>
          </div>
          <div v-else>
            <a-radio-group name="radioGroup" v-model="pageData.trayIsItQualified">
              <a-radio :value="0">合格</a-radio>
              <a-radio :value="1">不合格</a-radio>
            </a-radio-group>
            <span v-if="isShowPage.tray_s" style="color: red;">*</span>
            <span v-else style="opacity: 0;">*</span>
          </div>
        </td>-->
      </tr>
    </table>
  </div>
  <div v-else>
    <div>
      <div class="part-title">
        <div class="part-title_blue"></div>
        <div>辅料清单</div>
      </div>
      <table class="table_2 m_b_15">
        <tr style="background: #F5F8FA;">
          <th style="width: 30%;">辅料</th>
          <th style="width: 30%;">数量</th>
          <th style="width: 30%;">备注</th>
        </tr>
        <tr v-if="pageData.assemblyPartsCheckOrNot !== '1'">
          <td>装配材</td>
          <td>{{pageData.assemblyPartsNumber}}</td>
          <td>
            <div style="width: 160px;">{{pageData.assemblyParts}}</div>
          </td>
        </tr>
        <tr v-if="pageData.plugInCheckOrNot !== '1'">
          <td>插件</td>
          <td>{{pageData.plugInNumber}}</td>
          <td>
            <div style="width: 160px;">{{pageData.plugIn}}</div>
          </td>
        </tr>
        <tr v-if="pageData.steelSleeveCheckOrNot !== '1'">
          <td>钢套</td>
          <td>{{pageData.steelSleeveNumber}}</td>
          <td>
            <div style="width: 160px;">{{pageData.steelSleeve}}</div>
          </td>
        </tr>
        <tr v-if="pageData.workClothesCheckOrNot !== '1'">
          <td>工装</td>
          <td>{{pageData.workClothesNumber}}</td>
          <td>
            <div style="width: 160px;">{{pageData.workClothes}}</div>
          </td>
        </tr>
        <tr v-if="pageData.auxiliaryMaterialsCheckOrNot !== '1'">
          <td>辅材</td>
          <td>{{pageData.auxiliaryMaterialsNumber}}</td>
          <td>
            <div style="width: 160px;">{{pageData.auxiliaryMaterials}}</div>
          </td>
        </tr>
        <tr v-if="pageData.barCodeCheckOrNot !== '1'">
          <td>条码</td>
          <td>{{pageData.barCodeNumber}}</td>
          <td>
            <div style="width: 160px;">{{pageData.barCode}}</div>
          </td>
        </tr>
        <tr v-if="pageData.tagCheckOrNot !== '1'">
          <td>标签</td>
          <td>{{pageData.tagNumber}}</td>
          <td>
            <div style="width: 160px;">{{pageData.tag}}</div>
          </td>
        </tr>
        <tr v-if="pageData.reportCheckOrNot !== '1'">
          <td>报告</td>
          <td>{{pageData.reportNumber}}</td>
          <td>
            <div style="width: 160px;">{{pageData.report}}</div>
          </td>
        </tr>
        <tr v-if="pageData.otherCheckOrNot !== '1'">
          <td>其他</td>
          <td>{{pageData.otherNumber}}</td>
          <td>
            <div style="width: 160px;">{{pageData.other}}</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import PassBtnShow from './pass_btn_show'
export default {
  name: 'ShipMsg3',
  data() {
    return {
      pageData: {},
      value: null,
      isShowPage: {
        assemblyParts_s: false,
        auxiliaryMaterials_s: false,
        assemblyParts_s: false,
        barCode_s: false,
        doubleBox_s: false,
        plugIn_s: false,
        size_s: false,
        steelSleeve_s: false,
        tag_s: false,
        technology_s: false,
        totalPackageMaterial_s: false,
        tray_s: false,
        wheelShape_s: false,
        workClothes_s: false
      }
    }
  },
  props: ['isShow', 'matterData'],
  components: {
    PassBtnShow
  },
  created() {
    this.creadSub()
  },
  watch: {
    matterData: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        // this.pageData = val
        this.pageData = JSON.parse(JSON.stringify(val))
        // this.creadSub()
        this.resertIsShowPage()
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
    resertIsShowPage() {
      this.isShowPage = {
        assemblyParts_s: false,
        auxiliaryMaterials_s: false,
        assemblyParts_s: false,
        barCode_s: false,
        doubleBox_s: false,
        plugIn_s: false,
        size_s: false,
        steelSleeve_s: false,
        tag_s: false,
        technology_s: false,
        totalPackageMaterial_s: false,
        tray_s: false,
        wheelShape_s: false,
        workClothes_s: false
      }
    },
    submit() {
      this.resertIsShowPage()
      let value = this.pageData
      let canSubmit = true
      // 1.先判断是不是都填写了-本组件 return {isCan: true,data:this.pageData}
      if (value.totalPackageMaterialCheckOrNot !== '1') {
        if (!(value.totalPackageMaterialIsItQualified == 0 || value.totalPackageMaterialIsItQualified == 1)) {
          canSubmit = false
          this.isShowPage.totalPackageMaterial_s = true
        }
      }
      if (value.assemblyPartsCheckOrNot !== '1') {
        if (!(value.assemblyPartsIsItQualified == 0 || value.assemblyPartsIsItQualified == 1)) {
          canSubmit = false
          this.isShowPage.assemblyParts_s = true
        }
      }
      if (value.auxiliaryMaterialsCheckOrNot !== '1') {
        if (!(value.auxiliaryMaterialsIsItQualified == 0 || value.auxiliaryMaterialsIsItQualified == 1)) {
          canSubmit = false
          this.isShowPage.auxiliaryMaterials_s = true
        }
      }
      if (value.barCodeCheckOrNot !== '1') {
        if (!(value.barCodeIsItQualified == 0 || value.barCodeIsItQualified == 1)) {
          canSubmit = false
          this.isShowPage.barCode_s = true
        }
      }
      if (value.doubleBoxCheckOrNot !== '1') {
        if (!(value.doubleBoxIsItQualified == 0 || value.doubleBoxIsItQualified == 1)) {
          canSubmit = false
          this.isShowPage.doubleBox_s = true
        }
      }
      if (value.plugInCheckOrNot !== '1') {
        if (!(value.plugInIsItQualified == 0 || value.plugInIsItQualified == 1)) {
          canSubmit = false
          this.isShowPage.plugIn_s = true
        }
      }
      if (value.sizeCheckOrNot !== '1') {
        if (!(value.sizeIsItQualified == 0 || value.sizeIsItQualified == 1)) {
          canSubmit = false
          this.isShowPage.size_s = true
        }
      }
      if (value.steelSleeveCheckOrNot !== '1') {
        if (!(value.steelSleeveIsItQualified == 0 || value.steelSleeveIsItQualified == 1)) {
          canSubmit = false
          this.isShowPage.steelSleeve_s = true
        }
      }
      if (value.tagCheckOrNot !== '1') {
        if (!(value.tagIsItQualified == 0 || value.tagIsItQualified == 1)) {
          canSubmit = false
          this.isShowPage.tag_s = true
        }
      }
      if (value.technologyCheckOrNot !== '1') {
        if (!(value.technologyIsItQualified == 0 || value.technologyIsItQualified == 1)) {
          canSubmit = false
          this.isShowPage.technology_s = true
        }
      }
      if (value.trayCheckOrNot !== '1') {
        if (!(value.trayIsItQualified == 0 || value.trayIsItQualified == 1)) {
          canSubmit = false
          this.isShowPage.tray_s = true
        }
      }
      if (value.wheelShapeCheckOrNot !== '1') {
        if (!(value.wheelShapeIsItQualified == 0 || value.wheelShapeIsItQualified == 1)) {
          canSubmit = false
          this.isShowPage.wheelShape_s = true
        }
      }
      if (value.workClothesCheckOrNot !== '1') {
        if (!(value.workClothesIsItQualified == 0 || value.workClothesIsItQualified == 1)) {
          canSubmit = false
          this.isShowPage.workClothes_s = true
        }
      }
      return { isCan: canSubmit, data: this.pageData }
      // 2.提交接口-给主组件
    },
    creadSub() {
      let value = this.pageData
      // 1.先判断是不是都填写了-本组件 return {isCan: true,data:this.pageData}
      if (value.totalPackageMaterialCheckOrNot !== '1') {
        if (!(value.totalPackageMaterialIsItQualified == 0 || value.totalPackageMaterialIsItQualified == 1)) {
          value.totalPackageMaterialIsItQualified = 0
        }
      }
      if (value.assemblyPartsCheckOrNot !== '1') {
        if (!(value.assemblyPartsIsItQualified == 0 || value.assemblyPartsIsItQualified == 1)) {
          value.assemblyPartsIsItQualified = 0
        }
      }
      if (value.auxiliaryMaterialsCheckOrNot !== '1') {
        if (!(value.auxiliaryMaterialsIsItQualified == 0 || value.auxiliaryMaterialsIsItQualified == 1)) {
          value.auxiliaryMaterialsIsItQualified = 0
        }
      }
      if (value.barCodeCheckOrNot !== '1') {
        if (!(value.barCodeIsItQualified == 0 || value.barCodeIsItQualified == 1)) {
          value.barCodeIsItQualified = 0
        }
      }
      if (value.doubleBoxCheckOrNot !== '1') {
        if (!(value.doubleBoxIsItQualified == 0 || value.doubleBoxIsItQualified == 1)) {
          value.doubleBoxIsItQualified = 0
        }
      }
      if (value.plugInCheckOrNot !== '1') {
        if (!(value.plugInIsItQualified == 0 || value.plugInIsItQualified == 1)) {
          value.plugInIsItQualified = 0
        }
      }
      if (value.sizeCheckOrNot !== '1') {
        if (!(value.sizeIsItQualified == 0 || value.sizeIsItQualified == 1)) {
          value.sizeIsItQualified = 0
        }
      }
      if (value.steelSleeveCheckOrNot !== '1') {
        if (!(value.steelSleeveIsItQualified == 0 || value.steelSleeveIsItQualified == 1)) {
          value.steelSleeveIsItQualified = 0
        }
      }
      if (value.tagCheckOrNot !== '1') {
        if (!(value.tagIsItQualified == 0 || value.tagIsItQualified == 1)) {
          value.tagIsItQualified = 0
        }
      }
      if (value.technologyCheckOrNot !== '1') {
        if (!(value.technologyIsItQualified == 0 || value.technologyIsItQualified == 1)) {
          value.technologyIsItQualified = 0
        }
      }
      if (value.trayCheckOrNot !== '1') {
        if (!(value.trayIsItQualified == 0 || value.trayIsItQualified == 1)) {
          value.trayIsItQualified = 0
        }
      }
      if (value.wheelShapeCheckOrNot !== '1') {
        if (!(value.wheelShapeIsItQualified == 0 || value.wheelShapeIsItQualified == 1)) {
          value.wheelShapeIsItQualified = 0
        }
      }
      if (value.workClothesCheckOrNot !== '1') {
        if (!(value.workClothesIsItQualified == 0 || value.workClothesIsItQualified == 1)) {
          value.workClothesIsItQualified = 0
        }
      }
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
.m_b_15 {
  margin-top: 20px;
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