<template>
  <div>
    <div class="part-title">
      <div class="part-title_blue"></div>
      <div>复查任务</div>
    </div>
    <table class="table_2 m_b_15">
      <!-- <tr style="background: #F5F8FA;">
        <th colspan="4">复查任务</th>
      </tr>-->
      <tr style="background: #F5F8FA;">
        <th>复查总数</th>
        <th>合格数</th>
        <th>不合格数</th>
        <th>报废数量</th>
      </tr>
      <tr>
        <td>{{pageData.retaskNumber}}</td>
        <td v-if="isShow">{{pageData.qualifiedNumber}}</td>
        <td v-else>
          <a-input-number size="small" :min="0" v-model="pageData.qualifiedNumber" />
          <!-- @change="onChange" -->
        </td>

        <td v-if="isShow">{{pageData.notQualifiedNumber}}</td>
        <td v-else>
          <a-input-number size="small" :min="0" v-model="pageData.notQualifiedNumber" />
        </td>
        <td v-if="isShow">{{pageData.scrapQualifiedNumber}}</td>
        <td v-else>
          <a-input-number size="small" :min="0" v-model="pageData.scrapQualifiedNumber" />
        </td>
      </tr>
      <tr>
        <th style="background: #F5F8FA;">缺陷描述</th>
        <td colspan="3" v-if="isShow">
          <div class="tap_overhide">
            <div
              v-for="item in DefectCodes"
              :key="item.index"
              style="width: calc(100% - 30px);text-align: left;margin-left: 30px;"
            >
              <p v-if="defectDescriptionList.indexOf(item.index) !== -1">
                <a-tag style="width: 38px;text-align: center;">{{item.index}}</a-tag>
                {{item.landd}}
              </p>
            </div>
          </div>
        </td>
        <td colspan="3" v-else>
          <a-select
            v-model="defectDescriptionList"
            mode="multiple"
            style="width: 100%"
            placeholder="可选择缺陷代码"
            option-label-prop="value"
          >
            <a-select-option
              v-for="item in DefectCodes"
              :key="item.index"
              :value="item.index"
              :label="item.label"
            >{{item.index}} - {{item.landd}}</a-select-option>
          </a-select>
        </td>
      </tr>
      <tr>
        <th style="background: #F5F8FA;">签批</th>
        <td colspan="3">
          <a-radio-group :disabled="isShow" name="radioGroup" v-model="pageData.endorsement">
            <a-radio :value="0" style="margin-right: 30px;">无异议签批</a-radio>
            <a-radio :value="1">有异议签批</a-radio>
          </a-radio-group>
        </td>
      </tr>
      <tr>
        <th style="background: #F5F8FA;">签批说明</th>
        <td colspan="3" v-if="isShow">
          <div style="max-width: 480px;">{{pageData.endorsementExplain}}</div>
        </td>
        <td colspan="3" v-else class="table_textarea">
          <a-textarea
            v-model="pageData.endorsementExplain"
            placeholder="可输入签批说明"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ShipMsg4',
  data() {
    return {
      pageData: {
        qualifiedNumber: 0,
        notQualifiedNumber: 0,
        scrapQualifiedNumber: 0
      },
      value: null,
      DefectCodes: [
        {
          index: '01',
          label: '轮辋缩松',
          description: 'Shrinkage porosity  of rim',
          landd: '轮辋缩松 Shrinkage porosity  of rim'
        },
        {
          index: '02',
          label: '轮心缩松',
          description: 'Shrinkage poprosity of wheel center',
          landd: '轮心缩松 Shrinkage poprosity of wheel center'
        },
        {
          index: '03',
          label: '轮辐缩松',
          description: 'Shrinkage poprosity of wheel spoke',
          landd: '轮辐缩松 Shrinkage poprosity of wheel spoke'
        },
        { index: '04', label: '轮辋气孔', description: 'Gas hloes in rim', landd: '轮辋气孔 Gas hloes in rim' },
        {
          index: '05',
          label: '轮心气孔',
          description: 'Gas holes in wheeol center',
          landd: '轮心气孔 Gas holes in wheeol center'
        },
        {
          index: '06',
          label: '轮辐缩孔',
          description: 'Shrinkage holes of wheel spoke',
          landd: '轮辐缩孔 Shrinkage holes of wheel spoke'
        },
        {
          index: '07',
          label: '轮辋夹渣',
          description: 'Slag inclusions on rim',
          landd: '轮辋夹渣 Slag inclusions on rim'
        },
        {
          index: '08',
          label: '轮心夹渣',
          description: 'Slag inclusions on wheel center',
          landd: '轮心夹渣 Slag inclusions on wheel center'
        },
        {
          index: '09',
          label: '轮辐夹渣',
          description: 'Slag inclusions on wheel spoke',
          landd: '轮辐夹渣 Slag inclusions on wheel spoke'
        },

        { index: '12', label: '针孔', description: '', landd: '针孔' },
        { index: '13', label: '浇不足', description: 'Misrun', landd: '浇不足 Misrun' },
        {
          index: '14',
          label: '顶杆印深',
          description: 'Deep marks of ejector pin',
          landd: '顶杆印深 Deep marks of ejector pin'
        },
        { index: '15', label: '铸面粗糙', description: 'Rough cast surface', landd: '铸面粗糙 Rough cast surface' },
        {
          index: '16',
          label: '铸面裂纹',
          description: 'Cracks on cast surface',
          landd: '铸面裂纹 Cracks on cast surface'
        },
        {
          index: '18',
          label: '铸面变形',
          description: 'Deformation of cast surface',
          landd: '铸面变形 Deformation of cast surface'
        },
        {
          index: '19',
          label: '铸造磕碰伤',
          description: 'Collision marks on cast surface',
          landd: '铸造磕碰伤 Collision marks on cast surface'
        },

        {
          index: '20',
          label: '法兰面氧化皮',
          description: 'Oxide skin on flange face',
          landd: '法兰面氧化皮 Oxide skin on flange face'
        },
        {
          index: '25',
          label: '铸面针孔',
          description: 'Pin holes on cast surface',
          landd: '铸面针孔 Pin holes on cast surface'
        },
        { index: '26', label: '粘铝', description: 'Aluminum sticking', landd: '粘铝 Aluminum sticking' },
        {
          index: '27',
          label: '刻字标识不清',
          description: 'Ambiguous carved characters',
          landd: '刻字标识不清 Ambiguous carved characters'
        },

        {
          index: '40',
          label: '去毛刺划伤',
          description: 'Deburring scratches',
          landd: '去毛刺划伤 Deburring scratches'
        },
        { index: '41', label: '机械划伤', description: 'Mechanical scratches', landd: '机械划伤 Mechanical scratches' },
        { index: '42', label: '振刀', description: 'Vibration tool', landd: '振刀 Vibration tool' },
        { index: '44', label: '粘刀', description: 'Sticking blade', landd: '粘刀 Sticking blade' },
        {
          index: '46',
          label: '机加磕碰伤',
          description: 'Collision marks caused in machining',
          landd: '机加磕碰伤 Collision marks caused in machining'
        },
        {
          index: '48',
          label: '机加其它废品',
          description: 'Other scraps generated in machining',
          landd: '机加其它废品 Other scraps generated in machining'
        },
        {
          index: '49',
          label: '法兰面未加工到',
          description: 'Insufficiently processed flange face',
          landd: '法兰面未加工到 Insufficiently processed flange face'
        },

        {
          index: '50',
          label: '装饰面未加工到',
          description: 'Insufficiently processed decoration surface',
          landd: '装饰面未加工到 Insufficiently processed decoration surface'
        },
        {
          index: '51',
          label: '内轮辋未加工到',
          description: 'Insufficiently processed inner-side of the rim',
          landd: '内轮辋未加工到 Insufficiently processed inner-side of the rim'
        },
        {
          index: '52',
          label: '外轮辋未加工到',
          description: 'Insufficiently processed outer-side of the rim',
          landd: '外轮辋未加工到 Insufficiently processed outer-side of the rim'
        },
        {
          index: '53',
          label: '机加毛刺',
          description: 'Burring generated in machining',
          landd: '机加毛刺 Burring generated in machining'
        },
        {
          index: '55',
          label: '铝屑打伤',
          description: 'Damage caused by aluminum scraps',
          landd: '铝屑打伤 Damage caused by aluminum scraps'
        },
        {
          index: '56',
          label: '精车表面非刀具蹭伤',
          description: 'Bruise caused by something other than cutting tool in FT',
          landd: '精车表面非刀具蹭伤 Bruise caused by something other than cutting tool in FT'
        },

        {
          index: '91',
          label: '机加后缺肉',
          description: 'Misrun after machining',
          landd: '机加后缺肉 Misrun after machining'
        },
        {
          index: '93',
          label: '机加刻字不清',
          description: 'Ambiguous machining carved characters',
          landd: '机加刻字不清 Ambiguous machining carved characters'
        },
        {
          index: '100',
          label: '粗车宽窄边',
          description: 'Uneven edges caused in rough turning',
          landd: '粗车宽窄边 Uneven edges caused in rough turning'
        },

        { index: '63', label: '灰尘', description: 'Dust', landd: '灰尘 Dust' },
        { index: '64', label: '流挂', description: 'Sagging', landd: '流挂 Sagging' },
        { index: '65', label: '橘皮', description: 'Orange peel', landd: '橘皮 Orange peel' },
        {
          index: '66',
          label: '透明漆/透明粉气泡',
          description: 'Blister generated by celluloid paint/powder',
          landd: '透明漆/透明粉气泡 Blister generated by celluloid paint/powder'
        },
        {
          index: '67',
          label: '喷涂磕碰伤',
          description: 'Collision marks caused in spraying',
          landd: '喷涂磕碰伤 Collision marks caused in spraying'
        },
        {
          index: '68',
          label: '喷涂其它废品',
          description: 'Other scraps generated in spraying',
          landd: '喷涂其它废品 Other scraps generated in spraying'
        },
        { index: '69', label: '锈蚀点', description: 'Rust spots', landd: '锈蚀点 Rust spots' },

        {
          index: '70',
          label: '粉包/粉刺',
          description: 'Powder packages/powder thorn',
          landd: '粉包/粉刺 Powder packages/powder thorn'
        },
        { index: '71', label: '面不平', description: 'Uneven surface', landd: '面不平 Uneven surface' },
        { index: '72', label: '打磨痕迹', description: 'Grinding marks', landd: '打磨痕迹 Grinding marks' },
        {
          index: '73',
          label: '喷涂粉坑',
          description: 'Powder pit caused in spraying',
          landd: '喷涂粉坑 Powder pit caused in spraying'
        },
        {
          index: '74',
          label: '喷涂粘漆',
          description: 'Paint sticking caused in spraying',
          landd: '喷涂粘漆 Paint sticking caused in spraying'
        },
        {
          index: '75',
          label: '喷涂漏底',
          description: 'Incompletely covered basic body or coat  in spraying',
          landd: '喷涂漏底 Incompletely covered basic body or coat  in spraying'
        },
        {
          index: '76',
          label: '喷涂粘铝屑',
          description: 'Aluminum scraps sticking caused in spraying',
          landd: '喷涂粘铝屑 Aluminum scraps sticking caused in spraying'
        },
        {
          index: '77',
          label: '喷涂油渍',
          description: 'Oil stain generated in spraying',
          landd: '喷涂油渍 Oil stain generated in spraying'
        },
        {
          index: '78',
          label: '喷涂表面纤维、毛发',
          description: 'Fiber and  hair on spraying surface',
          landd: '喷涂表面纤维、毛发 Fiber and  hair on spraying surface'
        },
        { index: '79', label: '色差', description: 'Color difference', landd: '色差 Color difference' },

        { index: '80', label: '银漆点', description: 'Paint spots', landd: '银漆点 Paint spots' },
        {
          index: '83',
          label: '漆后伤',
          description: 'Scars caused after painting',
          landd: '漆后伤 Scars caused after painting'
        },
        { index: '84', label: '槽液', description: 'Tank solution', landd: '槽液 Tank solution' },
        { index: '85', label: '缺粉', description: 'Short of powder', landd: '缺粉 Short of powder' },
        {
          index: '86',
          label: '喷涂印痕',
          description: 'Marks caused in spraying',
          landd: '喷涂印痕 Marks caused in spraying'
        },
        {
          index: '87',
          label: '喷涂水印',
          description: 'Water marks caused in spraying',
          landd: '喷涂水印 Water marks caused in spraying'
        },
        {
          index: '88',
          label: '喷涂麻面',
          description: 'Pitted surface caused in spraying',
          landd: '喷涂麻面 Pitted surface caused in spraying'
        },
        { index: '89', label: '黑灰', description: 'Black ash', landd: '黑灰 Black ash' },

        {
          index: '90',
          label: '环带状废品',
          description: 'Scraps with banded traces',
          landd: '环带状废品 Scraps with banded traces'
        },
        {
          index: '94',
          label: '无亮漆',
          description: 'Having no lacquer varnish',
          landd: '无亮漆 Having no lacquer varnish'
        },
        { index: '95', label: '亮粉点', description: 'Bright powder spot', landd: '亮粉点 Bright powder spot' },
        { index: '96', label: '笔印', description: 'Pen marks', landd: '笔印 Pen marks' },
        { index: '97', label: '擦伤', description: 'Bruises', landd: '擦伤 Bruises' },
        { index: '98', label: '冲粉', description: 'Powder spraying', landd: '冲粉 Powder spraying' },
        { index: '99', label: '手印', description: 'Imprints of hand', landd: '手印 Imprints of hand' },

        { index: '152', label: '漆渣', description: 'Paint slag', landd: '漆渣 Paint slag' },
        { index: '153', label: '黄点', description: 'Yellow spots', landd: '黄点 Yellow spots' },
        {
          index: '154',
          label: '精车崩漆',
          description: 'Paint collapsing during FT',
          landd: '精车崩漆 Paint collapsing during FT'
        },
        {
          index: '155',
          label: '亮漆薄',
          description: 'Thinness of lacquer varnish',
          landd: '亮漆薄 Thinness of lacquer varnish'
        },
        {
          index: '150',
          label: '沉孔黑印',
          description: 'Black marks on counter hole',
          landd: '沉孔黑印 Black marks on counter hole'
        }
      ],
      defectDescriptionList: []
    }
  },
  props: ['isShow', 'matterData'],
  components: {},
  created() {
    this.createdPage()
  },
  watch: {
    matterData: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        // this.pageData = val
        this.pageData = JSON.parse(JSON.stringify(val))
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
      // 1.数量加合
      this.pageData.qualifiedNumber = this.pageData.qualifiedNumber ? this.pageData.qualifiedNumber : 0
      this.pageData.notQualifiedNumber = this.pageData.notQualifiedNumber ? this.pageData.notQualifiedNumber : 0
      this.pageData.scrapQualifiedNumber = this.pageData.scrapQualifiedNumber ? this.pageData.scrapQualifiedNumber : 0
      // this.onChange(null)
      // 2.默认无异议
      if (!(this.pageData.endorsement == 0 || this.pageData.endorsement == 1)) {
        this.pageData.endorsement = 0
      }
      // 3.解数组 - &jn-   defectDescriptionList
      if (this.pageData.defectDescription) {
        let arr = []
        arr = this.pageData.defectDescription.split('&jn-')
        this.defectDescriptionList = arr
      }
    },
    submit() {
      let value = this.pageData
      let canSubmit = true
      let errorMsg = null
      if (this.pageData.endorsement == 1 && this.defectDescriptionList.length === 0) {
        canSubmit = false
        errorMsg = '有异议签批请最少选择一项缺陷描述代码'
      } else if (
        Number(this.pageData.retaskNumber) !==
        (Number(this.pageData.qualifiedNumber) || 0) +
          (Number(this.pageData.notQualifiedNumber) || 0) +
          (Number(this.pageData.scrapQualifiedNumber) || 0)
      ) {
        canSubmit = false
        errorMsg =
          '复查总数与当前输入数量不符，当前输入数量为' +
          ((Number(this.pageData.qualifiedNumber) || 0) +
            (Number(this.pageData.notQualifiedNumber) || 0) +
            (Number(this.pageData.scrapQualifiedNumber) || 0))
      } else if (
        this.pageData.retaskNumber === null ||
        this.pageData.retaskNumber === '' ||
        this.pageData.retaskNumber === 0
      ) {
        canSubmit = false
        errorMsg = '请先进行正常出库'
      }
      return {
        isCan: canSubmit,
        data: this.pageData,
        defectDescription: this.defectDescriptionList.join('&jn-'),
        errorMsg
      }
      // 2.提交接口-给主组件
    },
    onChange(data) {
      console.log(data)
      this.pageData.retaskNumber =
        (Number(this.pageData.qualifiedNumber) || 0) +
        (Number(this.pageData.notQualifiedNumber) || 0) +
        (Number(this.pageData.scrapQualifiedNumber) || 0)
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
.tap_overhide {
  width: 100%;
  max-height: 355px;
  overflow-y: auto;
}
</style>