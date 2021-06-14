<template>
  <div class="ship_msg_3">
    <div class="show_key_list show_key_list_bb" v-if="pageData.assemblyPartsCheckOrNot !== '1'">
      <div class="show_key_list_title">装配材</div>
      <div class="show_key_list_title">{{pageData.assemblyPartsNumber}}</div>
      <div class="show_key_list_content">{{pageData.assemblyParts}}</div>
    </div>
    <div class="show_key_list show_key_list_bb" v-if="pageData.plugInCheckOrNot !== '1'">
      <div class="show_key_list_title">插件</div>
      <div class="show_key_list_title">{{pageData.plugInNumber}}</div>
      <div class="show_key_list_content">{{pageData.plugIn}}</div>
    </div>
    <div class="show_key_list show_key_list_bb" v-if="pageData.steelSleeveCheckOrNot !== '1'">
      <div class="show_key_list_title">钢套</div>
      <div class="show_key_list_title">{{pageData.steelSleeveNumber}}</div>
      <div class="show_key_list_content">{{pageData.steelSleeve}}</div>
    </div>
    <div class="show_key_list show_key_list_bb" v-if="pageData.workClothesCheckOrNot !== '1'">
      <div class="show_key_list_title">工装</div>
      <div class="show_key_list_title">{{pageData.workClothesNumber}}</div>
      <div class="show_key_list_content">{{pageData.workClothes}}</div>
    </div>
    <div class="show_key_list show_key_list_bb" v-if="pageData.auxiliaryMaterialsCheckOrNot !== '1'">
      <div class="show_key_list_title">辅材</div>
      <div class="show_key_list_title">{{pageData.auxiliaryMaterialsNumber}}</div>
      <div class="show_key_list_content">{{pageData.auxiliaryMaterials}}</div>
    </div>
    <div class="show_key_list show_key_list_bb" v-if="pageData.barCodeCheckOrNot !== '1'">
      <div class="show_key_list_title">条码</div>
      <div class="show_key_list_title">{{pageData.barCodeNumber}}</div>
      <div class="show_key_list_content">{{pageData.barCode}}</div>
    </div>
    <div class="show_key_list show_key_list_bb" v-if="pageData.tagCheckOrNot !== '1'">
      <div class="show_key_list_title">标签</div>
      <div class="show_key_list_title">{{pageData.tagNumber}}</div>
      <div class="show_key_list_content">{{pageData.tag}}</div>
    </div>
    <div class="show_key_list show_key_list_bb" v-if="pageData.reportCheckOrNot !== '1'">
      <div class="show_key_list_title">报告</div>
      <div class="show_key_list_title">{{pageData.reportNumber}}</div>
      <div class="show_key_list_content">{{pageData.report}}</div>
    </div>
    <div class="show_key_list show_key_list_bb" v-if="pageData.otherCheckOrNot !== '1'">
      <div class="show_key_list_title">其他</div>
      <div class="show_key_list_title">{{pageData.otherNumber}}</div>
      <div class="show_key_list_content">{{pageData.other}}</div>
    </div>
    <table class="table_2">
      <!-- <tr v-if="pageData.workClothesCheckOrNot !== '1'">
        <td>工装</td>
        <td>{{pageData.workClothes}}</td>
        <td>
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
        </td>
      </tr>
      <tr v-if="pageData.auxiliaryMaterialsCheckOrNot !== '1'">
        <td>辅材</td>
        <td>{{pageData.auxiliaryMaterials}}</td>
        <td>
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
        </td>
      </tr>
      <tr v-if="pageData.barCodeCheckOrNot !== '1'">
        <td>条码</td>
        <td>{{pageData.barCode}}</td>
        <td>
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
        </td>
      </tr>
      <tr v-if="pageData.tagCheckOrNot !== '1'">
        <td>标签</td>
        <td>{{pageData.tag}}</td>
        <td>
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
        </td>
      </tr>
      <tr v-if="pageData.doubleBoxCheckOrNot !== '1'">
        <td>双箱</td>
        <td>{{pageData.doubleBox}}</td>
        <td>
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
        </td>
      </tr>
      <tr v-if="pageData.trayCheckOrNot !== '1'">
        <td>托盘</td>
        <td>{{pageData.tray}}</td>
        <td>
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
        </td>
      </tr> -->
    </table>
    
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
    this.pageData = this.matterData
    this.creadSub()
  },
  watch: {
    matterData: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        // this.pageData = val
        this.pageData = JSON.parse(JSON.stringify(val))
        this.creadSub()
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
.ship_msg_3{
  padding: 15px;
  padding-top: 5px;
}
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
.title_app{
  text-align: center;
  font-size: 18px;
}



.show_key_list_bb{
  margin-bottom: 15px;
}
.show_key_list{
  display: flex;
  background: #f5f8fa;
  padding: 15px;
  border-radius: 6px;
}
.show_key_list_title{
  color: #000;
  padding-left: 10px;
  min-width: 70px;
  border-right: 1px solid #e8e8e8;
}
.show_key_list_content{
  padding: 0 15px;
  text-align: center;
}
</style>