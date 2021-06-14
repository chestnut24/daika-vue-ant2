<template>
  <div style="min-width: 1600px">
    <div class="card">
      <div class="left-frame">
        <div class="left_frame_head">
          <img class="left_frame_head_img" src="../../assets/shipment/addMsg_01.png" />
          <div class="left_frame_head_btns">
            <div class="btns_list btns_1">
              <img
                class="btn_img btn_style"
                src="../../assets/shipment/bens_01_b.png"
              />
            </div>
            <div class="btns_list btns_2">
              <div>&nbsp;基本信息</div>
            </div>
          </div>
        </div>
        <img
          style="background: #fff;"
          class="left_frame_head_img"
          src="../../assets/shipment/addMsg_02.png"
        />
        <div class="left-search-frame">
          <div
            class="top"
            style="width: 100%;display: flex;flex-direction: row;position: relative;"
          >
            <div style="width: 100%;">
              <a-tabs
                default-active-key="1"
                style="width: 100%;"
                :tabBarStyle="{
                  'height': 0,
                  'overflow': 'hidden',
                  'borderBottom': 0
                }"
              >
                <a-tab-pane key="1" tab="基本信息">
                  <a-row type="flex" align="middle" :gutter="[30,16]">
                    <a-col :md="10" :sm="10" class="flex-right">
                      <div style="width: 100%;">
                        <div style="font-size: 16px;margin-bottom: 10px;">戴卡部件号：</div>
                        <div style="width: 272px;display: flex;align-content: center;">
                          <a-input
                            disabled
                            placeholder="请选择戴卡部件号"
                            style="width: calc(100% - 74px)"
                            v-model="formData.projectNo"
                          ></a-input>
                          <a-button @click="openSelect()" style="width: 64px;margin-left: 10px;">
                            <img src="../../assets/shipment/choose_add_01.png" />
                          </a-button>
                        </div>
                      </div>
                    </a-col>
                    <a-col :md="10" :sm="10" class="flex-right">
                      <div style="width: 100%;">
                        <div style="font-size: 16px;margin-bottom: 10px;">发运目的地：</div>
                        <div style="width: 272px;display: flex;align-content: center;">
                          <a-input
                            v-model="SubmitParams.shipmentManagementInfoDto.shipmentDestination"
                            placeholder="请输入发运目的地"
                            style="width: 100%;"
                          />
                        </div>
                      </div>
                    </a-col>
                  </a-row>

                  <a-row type="flex" align="middle" :gutter="[30,16]" style="margin-top: 5px">
                    <a-col :md="10" :sm="10" class="flex-right">
                      <div style="width: 100%;">
                        <div style="font-size: 16px;margin-bottom: 10px;">计划发运时间：</div>
                        <div style="width: 272px;display: flex;align-content: center;">
                          <a-date-picker
                            @change="onChange"
                            v-model="SubmitParams.shipmentManagementInfoDto.planShipmentDate"
                            style="width: 100%;"
                          />
                        </div>
                      </div>
                    </a-col>
                    <a-col :md="10" :sm="10" class="flex-right">
                      <div style="width: 100%;">
                        <div style="font-size: 16px;margin-bottom: 10px;">项目负责人：</div>
                        <div style="width: 272px;display: flex;align-content: center;">
                          <a-input
                            v-model="SubmitParams.shipmentManagementInfoDto.projectLeader"
                            placeholder="请输入项目负责人"
                            style="width: 100%;"
                          />
                        </div>
                      </div>
                    </a-col>
                  </a-row>

                  <a-row type="flex" align="middle" :gutter="[30,16]" style="margin-top: 5px">
                    <a-col :md="10" :sm="10" class="flex-right">
                      <div style="width: 100%;">
                        <div style="font-size: 16px;margin-bottom: 10px;">紧急任务：</div>
                        <div style="width: 272px;display: flex;align-content: center;">
                          <a-select
                            placeholder="请选择"
                            v-model="SubmitParams.shipmentManagementInfoDto.urgentTaskStatus"
                            style="width: 100%;"
                          >
                            <a-select-option
                              v-for="data in option.urgent_task_status"
                              :key="data.value"
                            >{{ data.label }}</a-select-option>
                          </a-select>
                        </div>
                      </div>
                    </a-col>
                    <!-- <a-col :md="10" :sm="10" class="flex-right">
                      <div style="width: 100%;">
                        <div style="font-size: 16px;margin-bottom: 10px;">紧急任务：</div>
                        <div style="width: 272px;display: flex;align-content: center;">
                          <a-select
                            placeholder="请选择"
                            v-model="SubmitParams.shipmentManagementInfoDto.urgentTaskStatus"
                            style="width: 100%;"
                          >
                            <a-select-option
                              v-for="data in option.urgent_task_status"
                              :key="data.value"
                            >{{ data.label }}</a-select-option>
                          </a-select>
                        </div>
                      </div>
                    </a-col>-->
                  </a-row>

                  <div class="part-title">
                    <div class="part-title_blue"></div>
                    <div>发样需求</div>
                  </div>
                  <div class="left-table-frame-SendSampleDemand">
                    <div class="my_table my_table_padding_0">
                      <table>
                        <tr>
                          <th
                            style="background: #F5F8FA;"
                            v-for="menu in columns"
                            :key="menu.title"
                          >{{menu.title}}</th>
                        </tr>
                        <tr v-for="(operate, i) in dataSource" :key="i">
                          <td>
                            <a-input style="width: 60px" v-model="operate.sendSampleNumber"></a-input>
                          </td>
                          <td>
                            <div
                              style="display: flex;width: 100%;justify-content: space-around;padding: 2px 0;"
                            >
                              <div
                                style="width: 190px;min-height: 32px;line-height: 32px;"
                              >{{operate.warehouseBatchDis}}</div>
                              <a-button @click="openBatch(operate, i )">
                                <img src="../../assets/shipment/choose_add_01.png" />
                              </a-button>
                            </div>
                          </td>
                          <td>
                            <a-select
                              v-model="operate.packagingTransportationMode"
                              placeholder="请选择"
                              style="width: 150px;"
                            >
                              <a-select-option
                                v-for="data in option.packaging_transportation_mode"
                                :key="data.value"
                              >{{ data.label }}</a-select-option>
                            </a-select>
                          </td>
                          <td>
                            <a-select
                              v-model="operate.sendSamplePurpose"
                              placeholder="请选择"
                              style="width: 150px"
                            >
                              <a-select-option
                                v-for="data in option.send_sample_purpose"
                                :key="data.value"
                              >{{ data.label }}</a-select-option>
                            </a-select>
                          </td>
                          <td>
                            <a-button type="link" @click="deleteDataSource(operate, i)">删除</a-button>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <a-button class="editable-add-btn" @click="handleAdd">+</a-button>
                  </div>
                  <div class="part-title">
                    <div class="part-title_blue"></div>
                    <div>备注信息</div>
                  </div>
                  <div class="basic-information-frame">
                    <a-textarea
                      v-model="SubmitParams.shipmentManagementInfoDto.remark"
                      placeholder="请输入备注"
                      :auto-size="{ minRows: 3}"
                    />
                  </div>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
          <div style="width: 100%;padding: 15px 0 20px 0;">
            <a-button type="primary" @click="submitForm(0)">提交</a-button>
            <a-button type="primary" ghost style="margin-left: 10px;" @click="submitForm(1)">保存为草稿箱</a-button>
          </div>
          <selectproject-no ref="modal" v-on:get-text="getProjectNumber"></selectproject-no>
          <select-order-pop ref="order" v-on:get-text="getOrder"></select-order-pop>
          <select-batch-no
            ref="batchInfo"
            v-on:get-text="getBatch"
            :projectNo="formData.projectNo||''"
            :purpose="this.purpose||''"
            :purposeLabel="this.purposeLabel||''"
          ></select-batch-no>
          <project-information ref="projectInfor"></project-information>
        </div>
      </div>
      <div class="right-frame">
        <div class="right_frame_card">
          <div class="part-title">
            <div class="part-title_blue"></div>
            <div>戴卡部件信息</div>
          </div>
          <div class="my_table">
            <table>
              <tr>
                <td style="background: #F5F8FA;width: 18%;">戴卡部件号</td>
                <td style="width: 23%;">{{queryParam.component ? queryParam.component : "——"}}</td>
                <td style="background: #F5F8FA;width: 18%;">车轮尺寸</td>
                <td style="width: 23%;">{{queryParam.wheelSize ? queryParam.wheelSize : '——'}}</td>
                <td style="width: 18%;" rowspan="4">
                  <div v-if="!queryParam.component">——</div>
                  <img v-else class="td_img" :src="srccc||'../../../assets/lun.png'" />
                </td>
              </tr>
              <tr>
                <td style="background: #F5F8FA;">表面状态</td>
                <td>{{queryParam.surfaceState ? queryParam.surfaceState: "——"}}</td>
                <td style="background: #F5F8FA;">项目负责人</td>
                <td>{{queryParam.projectManager ? queryParam.projectManager: '——'}}</td>
              </tr>
            </table>
          </div>
          <div class="part-title">
            <div class="part-title_blue"></div>
            <div>批次信息</div>
          </div>
          <div class="my_table" v-if="dataSourceRight&&dataSourceRight.length">
            <table>
              <tr>
                <td style="background: #F5F8FA;">戴卡部件号</td>
                <td style="background: #F5F8FA;">用途</td>
                <td style="background: #F5F8FA;">所在仓库</td>
                <td style="background: #F5F8FA;">库位</td>
                <td style="background: #F5F8FA;">样件位置</td>
              </tr>
              <tr v-for="(item, index) in dataSourceRight" :key="index">
                <td>{{item.projectNo}}</td>
                <td>{{item.purpose}}</td>
                <td>{{item.factoryWareHouse_dictText}}</td>
                <td>{{item.inventoryLocation}}</td>
                <td>{{item.exemplarLocation}}</td>
              </tr>
            </table>
          </div>
          <div class="my_table_0" v-else>暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectNumber from '../system/SelectNumber'
import SelectOrderPop from '../system/SelectOrderPop'
import ProjectInformation from '../system/ProjectInformation'
import SelectBatchNo from '../shipManage/SelectBatchNo'
import SelectprojectNo from '../shipManage/SelectprojectNo'
import store from '@/store/'
import { GetImgByProjectNumMixin } from '@/mixins/GetImgByProjectNumMixin'

import {
  getOptions,
  shipOrderNew,
  shipOrderEdit,
  getShipmentById,
  getOutgoinglibLocation,
  getSampleLocation,
  getOrderById
} from '@api/api'
export default {
  name: 'AddShipOrderWheel',
  inject: ['closeCurrent'],
  mixins: [GetImgByProjectNumMixin],
  components: { SelectOrderPop, SelectNumber, ProjectInformation, SelectBatchNo, SelectprojectNo }, //引入组件
  data() {
    return {
      purposeLabel: '',
      valueRadio1: 1,
      valueRadio2: 1,
      valueRadio3: 1,
      searchParams: {
        partNumber: '', //戴卡部件号
        use: undefined, // 用途
        projectManager: '' //项目经理
      },
      editId: 0, // 获取到的id
      total: 0,
      modalVisible: false, // 显示弹窗组件
      modalTitle: '', // 弹窗标题
      modalData: [], //弹窗展示的数组
      modalColumn: [], //弹窗展示的列名
      searchData: [], //弹窗展示搜索的循环数组
      pageSize: 1,
      selectOrder: [], //展示订单信息
      selectBatch: [], //展示批次号信息
      currentPage: 1,
      pageNum: 1,
      jumpPage: 0,
      purpose: '',
      editStatus: false,
      formId: undefined,
      formData: {
        // 表单数据
        projectNo: '',
        ordersNo: [],
        batchNo: []
        // partInfo: [],  //戴卡部件信息
        // orderInfo: [],
      },
      tmpDataSource: [],
      shipmentManagementId: '',
      shipmentSendSampleDemandIds: '',
      editBatchArr: [],
      selectOrderStr: '', //展示订单号
      selectBatchStr: '', //展示批次号
      shipmentSendSampleDemandBatchVOList: [],
      shipmentSendSampleDemandDtoList: [
        {
          sendSampleNumber: 0,
          warehouseBatch: '',
          shipmentSendSampleDemandBatchVOList: [],
          sendSamplePurpose: 0,
          packagingTransportationMode: 0
        }
      ],
      selectedBatchRow: undefined,
      dataSource: [{}], // 左侧列表数据组
      batchInfoTabColumns: [
        { title: '戴卡部件号', dataIndex: '', width: 150, align: 'center' },
        { title: '用途', dataIndex: '', width: 150, align: 'center' },
        { title: '批次号', dataIndex: '', width: 150, align: 'center' },
        { title: '所在仓库', dataIndex: '', width: 150, align: 'center' },
        { title: '库位', dataIndex: '', width: 150, align: 'center' },
        { title: '样件位置', dataIndex: '', width: 150, align: 'center' }
      ],
      option: {
        // 下拉选项
        send_sample_purpose: [], //发运送样具体用途
        packaging_transportation_mode: [], // 发运包装运输方式
        urgent_task_status: [],
        purpose: [],
        noun: [],
      },
      tableNameTop: [
        {
          总包材: [
            'shipmentSamplePackingListDto.totalPackageMaterialCheckOrNot',
            'shipmentSamplePackingListDto.totalPackageMaterial'
          ],
          装配材: [
            'shipmentSamplePackingListDto.assemblyPartsCheckOrNot',
            'shipmentSamplePackingListDto.assemblyParts'
          ],
          戴卡部件号: [
            'shipmentSamplePackingListDto.wheelShapeCheckOrNot',
            'shipmentSamplePackingListDto.wheelShapeCheckOrNot'
          ],
          尺寸: ['shipmentSamplePackingListDto.sizeCheckOrNot', 'shipmentSamplePackingListDto.size'],
          工艺: ['shipmentSamplePackingListDto.technologyCheckOrNot', 'shipmentSamplePackingListDto.technology'],
          插件: ['shipmentSamplePackingListDto.plugInCheckOrNot', 'shipmentSamplePackingListDto.plugIn'],
          钢套: ['shipmentSamplePackingListDto.steelSleeveCheckOrNot', 'shipmentSamplePackingListDto.steelSleeve']
          // 工装: ['shipmentSamplePackingListDto.workClothesCheckOrNot', 'shipmentSamplePackingListDto.workClothes'],
          // 辅材: [
          //   'shipmentSamplePackingListDto.auxiliaryMaterialsCheckOrNot',
          //   'shipmentSamplePackingListDto.auxiliaryMaterials'
          // ],
          // 条码: ['shipmentSamplePackingListDto.barCodeCheckOrNot', 'shipmentSamplePackingListDto.barCode'],
          // 标签: ['shipmentSamplePackingListDto.tagCheckOrNot', 'shipmentSamplePackingListDto.tag'],
          // 双箱: ['shipmentSamplePackingListDto.doubleBoxCheckOrNot', 'shipmentSamplePackingListDto.doubleBox'],
          // 托盘: ['shipmentSamplePackingListDto.trayCheckOrNot', 'shipmentSamplePackingListDto.tray']
        }
      ],
      queryParam: {
        component: '', // "戴卡部件号",
        projectManager: '', // "项目经理",
        surfaceState: '', //表面状态
        imgUrl: '', //图片
        wheelSize: undefined,
        send_sample_purpose: '',
        packaging_transportation_mode: '',
        urgent_task_status: ''
      },
      SubmitParams: {
        shipmentFinalProductTestDto: {
          appearanceProcurator: '',
          balanceSign: false,
          date: '',
          filmColourConformity: '',
          filmPerformanceTest: '',
          filmThicknessEdgeLeakage: '',
          harmonicSign: false,
          other: '',
          otherFocusSizes: '',
          sameBatchAppearanceOutline: false,
          surfaceAppearanceDefect: ''
        },

        shipmentManagementInfoDto: {
          daikaPartNumber: '',
          isItRunner: 0,
          marketLeader: '',
          ordersId: undefined,
          planShipmentDate: '',
          projectId: undefined,
          projectLeader: '',
          remark: '',
          shipmentDestination: '',
          shipmentStartplace: '',
          shippingFlowSheet: '',
          status: 0,
          urgentTaskStatus: undefined,
          userId: '',
          warehouseInfoId: 0
        },
        shipmentProcessStateDto: {
          processPerformance: 0,
          sprayProcess: 0,
          xprocessState: 0
        },

        shipmentSamplePackingListDto: {
          assemblyParts: '',
          assemblyPartsCheckOrNot: false,
          auxiliaryMaterials: '',
          auxiliaryMaterialsCheckOrNot: false,
          barCode: '',
          barCodeCheckOrNot: false,
          doubleBox: '',
          doubleBoxCheckOrNot: false,
          plugIn: '',
          plugInCheckOrNot: false,
          size: '',
          sizeCheckOrNot: false,
          steelSleeve: '',
          steelSleeveCheckOrNot: false,
          tag: '',
          tagCheckOrNot: false,
          technology: '',
          technologyCheckOrNot: false,
          totalPackageMaterial: '',
          totalPackageMaterialCheckOrNot: false,
          tray: '',
          trayCheckOrNot: false,
          wheelShape: '',
          wheelShapeCheckOrNot: false,
          workClothes: '',
          workClothesCheckOrNot: false
        },

        shipmentSendSampleDemandDtoList: [
          {
            sendSampleNumber: 0,
            warehouseBatch: '',
            shipmentSendSampleDemandBatchVOList: [
              {
                batchType: '',
                shipmentManagementId: '',
                shipmentSendSampleDemandId: '',
                warehouseBatch: '',
                warehouseOutTableId: ''
              }
            ],
            sendSamplePurpose: 0,
            packagingTransportationMode: 0
          }
        ]
      },
      dataSourceRight: [], //右侧列表数据组
      columns: [
        {
          title: '发样数量',
          dataIndex: 'sendSampleNumber',
          key: 'sendSampleNumber',
          align: 'center',
          scopedSlots: { customRender: 'sendSampleNumber' }
        },
        {
          title: '批次号',
          dataIndex: 'warehouseBatchDis',
          key: 'warehouseBatchDis',
          align: 'center',
          scopedSlots: { customRender: 'warehouseBatch' }
        },
        {
          title: '包装运输方式',
          dataIndex: 'packagingTransportationMode',
          key: 'packagingTransportationMode',
          align: 'center',
          scopedSlots: { customRender: 'packagingTransportationMode' }
        },
        {
          title: '送样具体用途',
          dataIndex: 'sendSamplePurpose',
          key: 'sendSamplePurpose',
          align: 'center',
          scopedSlots: { customRender: 'sendSamplePurpose' }
        },
        {
          title: '操作',
          dataIndex: 'operate',
          key: 'operate',
          align: 'center',
          scopedSlots: { customRender: 'operate' }
        }
      ],
      columnsRight: [
        {
          title: '戴卡部件号',
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
          title: '批次号',
          dataIndex: 'batch',
          key: 'batch',
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
        }
      ],
      srccc: null
    }
  },

  mounted() {
    this.getAppointOption() // 获取下拉框
    // this.editId = 0;
    this.editId = Number(this.$route.query.edited) || 0
    this.formId = Number(this.$route.query.id) || 0
    if (this.$route.query.id) {
      this.editId = 1
    }

    if (this.editId) {
      this.$nextTick(() => {
        this.recoverForm()
      })
    }
  },
  watch: {
    choiceTabs(value, oldValue) {
      if (value === '4') {
        this.buttonTitle = '提交'
      } else {
        this.buttonTitle = '下一步'
      }
    },
    queryParam: {
      handler(val, o_val) {
        console.log(val.component)
        if (val.component) {
          this.getImg(val.component)
        }
      },
      deep: true
    }
  },
  methods: {
    pageChange(val) {
      // 分页改变
    },
    onChangeCheckBox1(e) {
      console.log(`checked = ${e.target.checked}`)
    },
    onChangeRadio1(e) {
      console.log('radio checked', e.target.value)
    },
    onChangeRadio2(e) {
      console.log('radio checked', e.target.value)
    },
    onChangeRadio3(e) {
      console.log('radio checked', e.target.value)
    },
    // 包装运输方式选择框
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    handleAdd() {
      // 新增行
      this.dataSource.push({})
    },
    getDic() {
      // 获取表单中的部分字段对应的字典
      for (let name in this.option) {
        // let searchName = this.humpOrLine(name, 'toLine');
        getOptions(name, '').then(data => {
          this.option[name] = data
        })
      }
    },
    recoverForm() {
      getShipmentById({ id: this.formId }).then(data => {
        if (data) {
          this.shipmentManagementId = data.shipmentSendSampleDemandVoList[0].shipmentManagementId
          this.shipmentSendSampleDemandIds = data.shipmentSendSampleDemandVoList[0].shipmentSendSampleDemandIds
          // this.SubmitParams.shipmentManagementInfoDto.daikaPartNumber = data.shipmentOrdersVo.component;
          this.SubmitParams.shipmentManagementInfoDto.daikaPartNumber = data.shipmentManagementInfoVo.wheelShape
          this.formData.projectNo = data.shipmentManagementInfoVo.wheelShape
          // this.formData.projectNo = data.shipmentOrdersVo.component;
          this.queryParam.component = data.shipmentProjectInfoVo.projectNumber
          this.queryParam.wheelSize = data.shipmentProjectInfoVo.wheelSize
          this.queryParam.surfaceState = data.shipmentProjectInfoVo.surfaceState
          this.queryParam.projectManager = data.shipmentManagementInfoVo.projectLeader
          this.queryParam.imgUrl = data.shipmentProjectInfoVo.imgUrl
          this.selectOrderStr = data.shipmentOrdersVo.dkOrdersNumber
          let obj = []
          obj[0] = data.shipmentOrdersVo
          this.selectOrder = obj

          for (let i = 0; i < data.shipmentSendSampleDemandVoList.length; i++) {
            if (data.shipmentSendSampleDemandVoList[i].shipmentSendSampleDemandBatchVOList) {
              for (
                let j = 0;
                j < data.shipmentSendSampleDemandVoList[i].shipmentSendSampleDemandBatchVOList.length;
                j++
              ) {
                if (j == 0) {
                  data.shipmentSendSampleDemandVoList[i].warehouseBatchDis =
                    data.shipmentSendSampleDemandVoList[i].shipmentSendSampleDemandBatchVOList[j].warehouseBatch + '\n'
                } else {
                  data.shipmentSendSampleDemandVoList[i].warehouseBatchDis +=
                    data.shipmentSendSampleDemandVoList[i].shipmentSendSampleDemandBatchVOList[j].warehouseBatch + '\n'
                }
              }
            }
            this.dataSource.splice(i, 1, data.shipmentSendSampleDemandVoList[i])
          }

          this.SubmitParams.shipmentFinalProductTestDto = data.shipmentFinalProductTestVo
          this.SubmitParams.shipmentProcessStateDto = data.shipmentProcessStateVo
          this.SubmitParams.shipmentSamplePackingListDto = data.shipmentSamplePackingListVo

          this.SubmitParams.shipmentManagementInfoDto = data.shipmentManagementInfoVo

          this.SubmitParams.shipmentManagementInfoDto.userId = store.getters.userInfo.id
          this.SubmitParams.shipmentManagementInfoDto.urgentTaskStatus =
            data.shipmentManagementInfoVo.urgentTaskStatus === null ||
            data.shipmentManagementInfoVo.urgentTaskStatus === 'null'
              ? undefined
              : Number(data.shipmentManagementInfoVo.urgentTaskStatus)
          this.SubmitParams.shipmentManagementInfoDto.isItRunner = Number(data.shipmentManagementInfoVo.isItRunner)
          this.purpose = this.SubmitParams.shipmentManagementInfoDto.purpose
          for (let j = 0; j < this.option['noun'].length; j++) {
            if (this.purpose && Number(this.purpose) === Number(this.option['noun'][j].value)) {
              // 找到value相等时对应的label
              this.purposeLabel = this.option['noun'][j].label
            }
          }
          this.SubmitParams.shipmentFinalProductTestDto.balanceSign =
            data.shipmentFinalProductTestVo.balanceSign == '0' ? true : false
          this.SubmitParams.shipmentFinalProductTestDto.harmonicSign =
            data.shipmentFinalProductTestVo.harmonicSign == '0' ? true : false
          this.SubmitParams.shipmentFinalProductTestDto.sameBatchAppearanceOutline =
            data.shipmentFinalProductTestVo.sameBatchAppearanceOutline == '0' ? true : false
          this.SubmitParams.shipmentProcessStateDto.processPerformance = Number(
            data.shipmentProcessStateVo.processPerformance
          )
          this.SubmitParams.shipmentProcessStateDto.sprayProcess = Number(data.shipmentProcessStateVo.sprayProcess)
          this.SubmitParams.shipmentProcessStateDto.xprocessState = Number(data.shipmentProcessStateVo.xprocessState)
          this.SubmitParams.shipmentFinalProductTestDto.date =
            data.shipmentFinalProductTestVo.date !== 'null' || data.shipmentFinalProductTestVo.date !== null
              ? data.shipmentFinalProductTestVo.date
              : null
          this.SubmitParams.shipmentManagementInfoDto.planShipmentDate =
            data.shipmentManagementInfoVo.planShipmentDate !== 'null' ||
            data.shipmentManagementInfoVo.planShipmentDate !== null
              ? data.shipmentManagementInfoVo.planShipmentDate
              : null
          this.SubmitParams.shipmentSamplePackingListDto.assemblyPartsCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.assemblyPartsCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.auxiliaryMaterialsCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.auxiliaryMaterialsCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.barCodeCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.barCodeCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.doubleBoxCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.doubleBoxCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.plugInCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.plugInCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.sizeCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.sizeCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.steelSleeveCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.steelSleeveCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.tagCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.tagCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.totalPackageMaterialCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.totalPackageMaterialCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.trayCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.trayCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.wheelShapeCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.wheelShapeCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.workClothesCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.workClothesCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.technologyCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.technologyCheckOrNot == '0' ? true : false

          this.displayRightTable()
        }
      })
    },
    submitForm(isDraft) {
      this.SubmitParams.shipmentManagementInfoDto.status = isDraft
      for (let dataElement of this.dataSource) {
        if (dataElement.sendSampleNumber) {
          dataElement.sendSampleNumber = Number(dataElement.sendSampleNumber)
        }
      }
      this.SubmitParams.shipmentSendSampleDemandDtoList = this.dataSource
      if (this.SubmitParams.shipmentSendSampleDemandDtoList) {
        let batchArr = []
        for (let i = 0; i < this.SubmitParams.shipmentSendSampleDemandDtoList.length; i++) {
          if (this.SubmitParams.shipmentSendSampleDemandDtoList[i].shipmentSendSampleDemandBatchVOList) {
            for (
              let j = 0;
              j < this.SubmitParams.shipmentSendSampleDemandDtoList[i].shipmentSendSampleDemandBatchVOList.length;
              j++
            ) {
              batchArr.push(
                this.SubmitParams.shipmentSendSampleDemandDtoList[i].shipmentSendSampleDemandBatchVOList[j]
                  .warehouseBatch
              )
            }
          }
        }
        this.SubmitParams.shipmentManagementInfoDto.warehouseBatch = batchArr.join(',')
      }
      if (this.editId == 1) {
        for (let i = 0; i < this.SubmitParams.shipmentSendSampleDemandDtoList.length; i++) {
          this.SubmitParams.shipmentSendSampleDemandDtoList[i].shipmentManagementId = this.shipmentManagementId
          if (this.SubmitParams.shipmentSendSampleDemandDtoList[i].shipmentSendSampleDemandBatchVOList) {
            for (
              let j = 0;
              j < this.SubmitParams.shipmentSendSampleDemandDtoList[i].shipmentSendSampleDemandBatchVOList.length;
              j++
            ) {
              this.SubmitParams.shipmentSendSampleDemandDtoList[i].shipmentSendSampleDemandBatchVOList[
                j
              ].shipmentManagementId = this.shipmentManagementId
              this.SubmitParams.shipmentSendSampleDemandDtoList[i].shipmentSendSampleDemandBatchVOList[
                j
              ].shipmentSendSampleDemandIds = this.shipmentSendSampleDemandIds
            }
          }
        }
      }

      let param = JSON.parse(JSON.stringify(this.SubmitParams))
      param.shipmentManagementInfoDto.userId = store.getters.userInfo.id
      param.shipmentManagementInfoDto.daikaPartNumber = this.formData.projectNo
      param.shipmentManagementInfoDto.warehouseInfoId = Number(
        this.SubmitParams.shipmentManagementInfoDto.warehouseInfoId
      )
      param.shipmentManagementInfoDto.ordersId = Number(this.SubmitParams.shipmentManagementInfoDto.ordersId)
      param.shipmentFinalProductTestDto.balanceSign = Number(!this.SubmitParams.shipmentFinalProductTestDto.balanceSign)
      param.shipmentFinalProductTestDto.sameBatchAppearanceOutline = Number(
        !this.SubmitParams.shipmentFinalProductTestDto.sameBatchAppearanceOutline
      )
      param.shipmentFinalProductTestDto.harmonicSign = Number(
        !this.SubmitParams.shipmentFinalProductTestDto.harmonicSign
      )
      param.shipmentProcessStateDto.processPerformance = Number(
        this.SubmitParams.shipmentProcessStateDto.processPerformance
      )
      param.shipmentProcessStateDto.sprayProcess = Number(this.SubmitParams.shipmentProcessStateDto.sprayProcess)
      param.shipmentProcessStateDto.xprocessState = Number(this.SubmitParams.shipmentProcessStateDto.xprocessState)
      param.shipmentSamplePackingListDto.assemblyPartsCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
        .assemblyPartsCheckOrNot
        ? '0'
        : '1'
      param.shipmentSamplePackingListDto.auxiliaryMaterialsCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
        .auxiliaryMaterialsCheckOrNot
        ? '0'
        : '1'
      param.shipmentSamplePackingListDto.barCodeCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
        .barCodeCheckOrNot
        ? '0'
        : '1'
      param.shipmentSamplePackingListDto.doubleBoxCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
        .doubleBoxCheckOrNot
        ? '0'
        : '1'
      param.shipmentSamplePackingListDto.plugInCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
        .plugInCheckOrNot
        ? '0'
        : '1'
      param.shipmentSamplePackingListDto.sizeCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto.sizeCheckOrNot
        ? '0'
        : '1'
      param.shipmentSamplePackingListDto.steelSleeveCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
        .steelSleeveCheckOrNot
        ? '0'
        : '1'
      param.shipmentSamplePackingListDto.tagCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto.tagCheckOrNot
        ? '0'
        : '1'
      param.shipmentSamplePackingListDto.totalPackageMaterialCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
        .totalPackageMaterialCheckOrNot
        ? '0'
        : '1'
      param.shipmentSamplePackingListDto.trayCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto.trayCheckOrNot
        ? '0'
        : '1'
      param.shipmentSamplePackingListDto.wheelShapeCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
        .wheelShapeCheckOrNot
        ? '0'
        : '1'
      param.shipmentSamplePackingListDto.workClothesCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
        .workClothesCheckOrNot
        ? '0'
        : '1'
      param.shipmentSamplePackingListDto.technologyCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
        .technologyCheckOrNot
        ? '0'
        : '1'

      if (this.editId == 0) {
        if (param.shipmentManagementInfoDto.daikaPartNumber === '') {
          this.$message.error('戴卡部件号不能为空')
          return
        }

        if (this.SubmitParams.shipmentManagementInfoDto.shipmentDestination === '') {
          this.$message.error('发运目的地不能为空')
          return
        }
        if (this.SubmitParams.shipmentManagementInfoDto.planShipmentDate === '') {
          this.$message.error('计划发运时间不能为空')
          return
        }
        if (this.SubmitParams.shipmentManagementInfoDto.projectLeader === '') {
          this.$message.error('项目负责人不能为空')
          return
        }

        if (this.SubmitParams.shipmentManagementInfoDto.urgentTaskStatus === undefined) {
          this.$message.error('请选择紧急任务项')
          return
        }
        if (this.dataSource && this.dataSource[0].sendSampleNumber === undefined) {
          this.$message.error('发样数量不能为空')
          return
        }
        if (this.dataSource && this.dataSource[0].warehouseBatchDis === undefined) {
          this.$message.error('批次号不能为空')
          return
        }
        if (this.dataSource && this.dataSource[0].packagingTransportationMode === undefined) {
          this.$message.error('请选择包装运输方式')
          return
        }
        if (this.dataSource && this.dataSource[0].sendSamplePurpose === undefined) {
          this.$message.error('请选择送样具体用途')
          return
        }
        shipOrderNew(param).then(data => {
          if (data.success) {
            this.$message.success(data.message)
            this.closeCurrent()
            this.$router.push({
              path: `/ship/TransferOrderManage`
            })
          } else {
            this.$message.error(data.message)
          }
        })
      } else {
        shipOrderEdit(this.formId.toString(), param).then(data => {
          if (data.success) {
            this.$message.success(data.message)
            this.closeCurrent()
            this.$router.push({
              path: `/ship/TransferOrderManage`
            })
          } else {
            this.$message.error(data.message)
          }
        })
      }
    },
    onChange(date, dateString) {
      console.log(date, dateString)
    },

    openSelect() {
      this.$refs.modal.add()
    },
    openOrderPop() {
      this.$refs.order.add()
    },
    openBatch(operate, i) {
      this.$refs.batchInfo.add()
      this.selectedBatchRow = i
      if (this.dataSource[this.selectedBatchRow].warehouseBatchDis) {
        this.editBatchArr = this.dataSource[this.selectedBatchRow].warehouseBatchDis.split('\n')
      }
    },
    deleteDataSource(operate, i) {
      this.dataSource.splice(i, 1)
      this.dataSourceRight = []
      this.displayRightTable()
    },
    getAppointOption() {
      // 获取指定的下拉框
      for (let name in this.option) {
        getOptions(name, '').then(data => {
          this.option[name] = data
        })
      }
    },
    getProjectNumber(event) {
      // 父组件监听子组件值
      this.formData.projectNo = event.projectNo
      this.purpose = event.purpose
      this.purposeLabel = event.purposeLabel
      this.queryParam.component = event.projectNo
      this.queryParam.projectManager = event.projectManager // 项目经理
      this.queryParam.wheelSize = event.size
      this.queryParam.surfaceState = event.surfaceState
      this.SubmitParams.shipmentManagementInfoDto.projectId = event.id
      this.SubmitParams.shipmentManagementInfoDto.warehouseInfoId = event.warehouseIntoId
    },

    getOrder(event) {
      // 父组件监听子组件值

      this.SubmitParams.shipmentManagementInfoDto.ordersId = event[0].id
      this.selectOrderStr = event[0].dkOrdersNumber
      this.selectOrder = event
    },

    displayRightTable() {
      for (let i = 0; i < this.dataSource.length; i++) {
        if (this.dataSource[i].shipmentSendSampleDemandBatchVOList) {
          for (let j = 0; j < this.dataSource[i].shipmentSendSampleDemandBatchVOList.length; j++) {
            if (
              this.dataSource[i].shipmentSendSampleDemandBatchVOList[j].batchType == '0' &&
              this.dataSource[i].shipmentSendSampleDemandBatchVOList[j].warehouseBatch
            ) {
              getSampleLocation({
                batch: this.dataSource[i].shipmentSendSampleDemandBatchVOList[j].warehouseBatch
              }).then(data => {
                for (let k = 0; k < data.result.length; k++) {
                  if (this.dataSource[i].shipmentSendSampleDemandBatchVOList[j].warehouseBatch) {
                    if (data.result[k]) {
                      data.result[k]['batch'] = this.dataSource[i].shipmentSendSampleDemandBatchVOList[j].warehouseBatch
                    }
                  }
                  if (data.result[k] && data.result[k].purpose) {
                    for (let j = 0; j < this.option['noun'].length; j++) {
                      if (Number(data.result[k].purpose) === Number(this.option['noun'][j].value)) {
                        // 找到value相等时对应的label
                        data.result[k].purpose = this.option['noun'][j].label
                      }
                    }
                  }
                  if (data.result[k]) {
                    this.dataSourceRight.push(data.result[k])
                  }
                }
              })
            } else if (this.dataSource[i].shipmentSendSampleDemandBatchVOList[j].batchType == '1') {
              getOutgoinglibLocation({
                batch: this.dataSource[i].shipmentSendSampleDemandBatchVOList[j].warehouseBatch
              }).then(data => {
                for (let k = 0; k < data.result.length; k++) {
                  if (this.dataSource[i].shipmentSendSampleDemandBatchVOList[j].warehouseBatch) {
                    if (data.result && data.result[k]) {
                      data.result[k]['batch'] = this.dataSource[i].shipmentSendSampleDemandBatchVOList[j].warehouseBatch
                    }
                  }
                  if (data.result && data.result[k].purpose) {
                    for (let j = 0; j < this.option['noun'].length; j++) {
                      if (Number(data.result[k].purpose) === Number(this.option['noun'][j].value)) {
                        // 找到value相等时对应的label
                        data.result[k].purpose = this.option['noun'][j].label
                      }
                    }
                  }

                  if (data.result && data.result[k]) {
                    data.result[k]['inventoryLocation'] = '——'
                    data.result[k]['exemplarLocation'] = '——'
                    data.result[k]['factoryWareHouse_dictText'] = '——'
                    this.dataSourceRight.push(data.result[k])
                  }
                }
              })
            }
          }
        }
      }
    },

    getBatch(event, event1) {
      // 父组件监听子组件值
      this.selectBatchStr = ''
      this.selectBatchStrDis = ''
      if (this.editId == 1 && this.editStatus === false) {
        this.tmpDataSource = this.dataSourceRight
        this.editStatus = true
      }
      this.dataSourceRight = []
      // if(this.editId == 1) {
      //   this.dataSourceRight = [...this.tmpDataSource];
      //
      //   if(this.selectedBatchRow <this.dataSource.length) {
      //     for(let editBatch of this.editBatchArr){
      //       outer:
      //         for(let i=0;i<this.dataSourceRight.length;i++){
      //
      //           if(editBatch == this.dataSourceRight[i].batch) {
      //             this.dataSourceRight.splice(i,1)
      //             inter:
      //               for(let j=0;j<this.tmpDataSource.length;j++) {
      //
      //                 if(this.tmpDataSource[j].batch == editBatch) {
      //                   this.tmpDataSource.splice(j,1);
      //                   break inter;
      //                 }
      //               }
      //             // continue;
      //             break outer;
      //           }
      //         }
      //     }
      //   }
      // }
      this.shipmentSendSampleDemandBatchVOList = []

      for (let i = 0; i < event.length; i++) {
        let obj = {}
        this.selectBatchStr = this.selectBatchStr + ',' + event[i].batch
        this.selectBatchStrDis = this.selectBatchStrDis + '\n' + event[i].batch

        if (event.length) {
          obj = {
            batchType: event[i].batchType,
            warehouseBatch: event[i].batch,
            shipmentManagementId: '',
            shipmentSendSampleDemandId: '',
            warehouseOutTableId: ''
          }
        }

        if (this.editId == 1) {
          if (event.length) {
            obj = {
              batchType: event[i].batchType,
              warehouseBatch: event[i].batch,
              shipmentManagementId: this.shipmentManagementId,
              shipmentSendSampleDemandId: this.shipmentSendSampleDemandIds,
              warehouseOutTableId: ''
            }
          }
        }
        this.shipmentSendSampleDemandBatchVOList.push(obj)
      }

      for (let i = 0; i < event1.length; i++) {
        let obj = {}
        this.selectBatchStr = this.selectBatchStr + ',' + event1[i].batch
        this.selectBatchStrDis = this.selectBatchStrDis + '\n' + event1[i].batch

        if (event1.length) {
          obj = {
            batchType: event1[i].batchType,
            warehouseBatch: event1[i].batch,
            shipmentManagementId: '',
            shipmentSendSampleDemandId: '',
            warehouseOutTableId: ''
          }
        }

        if (this.editId == 1) {
          if (event1.length) {
            obj = {
              batchType: event1[i].batchType,
              warehouseBatch: event1[i].batch,
              shipmentManagementId: this.shipmentManagementId,
              shipmentSendSampleDemandId: this.shipmentSendSampleDemandIds,
              warehouseOutTableId: ''
            }
          }
        }
        this.shipmentSendSampleDemandBatchVOList.push(obj)
      }

      const newData = [...this.dataSource]
      if (this.selectBatchStrDis[0] == '\n') {
        this.selectBatchStrDis = this.selectBatchStrDis.slice(1)
      }

      newData[this.selectedBatchRow].warehouseBatch = this.selectBatchStr
      newData[this.selectedBatchRow].warehouseBatchDis = this.selectBatchStrDis
      newData[this.selectedBatchRow].shipmentSendSampleDemandBatchVOList = this.shipmentSendSampleDemandBatchVOList
      this.dataSource = newData
      // this.dataSource .push(newData);
      // this.warehouseBatchList.push(this.selectBatchStr);

      this.getDic()
      for (let i = 0; i < this.dataSourceRight.length; i++) {
        // 遍历返回的数据列表
        for (let j = 0; j < this.option['noun'].length; j++) {
          if (
            this.dataSourceRight[i].purpose &&
            Number(this.dataSourceRight[i].purpose) === Number(this.option['noun'][j].value)
          ) {
            // 找到value相等时对应的label
            this.dataSourceRight[i].purpose = this.option['noun'][j].label
          }
        }
      }

      this.displayRightTable()
    },

    queryDetail(operate, i) {
      // 查询详情
      this.$router.push({
        path: `/order/orderDetail`,
        query: {
          id: operate.id
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.card {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-content: flex-start;
  width: 100%;
}
.editable-add-btn {
  margin-bottom: 8px;
  margin-top: 5px;
  width: 100%;
  background-color: #e0ebfd;
  color: #347ef2;
  font-size: 20px;
  font-weight: 600;
  border: 1px solid transparent;
}
.left-frame {
  width: calc(50% - 5px);
}
.left_frame_head {
  width: 100%;
  position: relative;
}
.left_frame_head_img {
  width: 100%;
  display: block;
}
.left_frame_head_btns {
  position: absolute;
  top: 50%;
  margin-top: -43px;
  left: 20px;
  width: 75px;
}
.btns_1 {
  padding: 0 25px 0 15px;
}
.btns_list {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
.btns_2 {
  color: #fff;
  justify-content: space-between;
  margin-top: 15px;
}
.btns_2 > div {
  cursor: pointer;
}
.btn_img {
  width: 100%;
  height: auto;
  display: block;
}
.btn_style {
  width: 50px;
}
.btn_and {
  width: 30px;
  margin: 0 5px;
}

.left-search-frame {
  width: 100%;
  padding: 10px 20px;
  background: #fff;
}
.item-down {
  margin-top: 20px;
}
.left-table-frame {
  width: 100%;
}
.left-table-frame-SendSampleDemand {
  width: 100%;
}
.left-table-frame-SendSampleDemand /deep/.ant-table-tbody .ant-table-row td {
  padding: 0;
}
.item-frame {
  width: 50%;
}
.right-frame {
  width: calc(50% - 5px);
  background: #e7e8ed;
  padding: 10px 0 20px 0;
}
.right_frame_card {
  width: 100%;
  padding: 20px;
  padding-bottom: 30px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 8px;
}
.button-frame {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.border_all {
  border: 1px solid #e8e8e8;
  border-bottom: 0;
}
.border_only_bottom {
  border-bottom: 1px solid #e8e8e8;
}
.flex-center {
  display: flex;
  justify-content: center;
  height: 40px;
  line-height: 40px;
  border-right: 1px solid #e8e8e8;
}
.flex-center_0 {
  border-right: 0;
  padding: 3px 10px;
  /deep/ .ant-input {
    border: 1px solid transparent;
  }
}
.title-background {
  background: rgb(245, 248, 250);
}
.left-button-frame {
  width: 68%;
  display: flex;
}
.bottom-page {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  align-items: center;
}
.top-title {
  font-size: 18px;
  font-weight: bold;
}

.flex-center-right {
  display: flex;
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

.top-layout .ant-layout-content {
  background: white;
  overflow-x: visible;
}

.search-frame {
  margin-bottom: 20px;
}

.flex-left {
  display: flex;
  justify-content: start;
}

.flex-right {
  display: flex;
  justify-content: center;
}

// ++css
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
.my_table_0 {
  text-align: center;
  color: rgba(0, 0, 0, 0.4);
}

.key_2_list {
  display: flex;
  align-items: center;
  margin: 8px 0;
  font-size: 16px;
  color: #000;
}
.key_2_list_title {
  min-width: 170px;
}
.my_table_padding_0 td {
  padding: 0;
}
.my_table_padding_0 th {
  border-top: 1px solid #e8e8e8;
}
.my_table_padding_0 {
  /deep/ .ant-input {
    border: 1px solid transparent;
  }
  /deep/ .ant-select-selection {
    border: 1px solid transparent;
  }
}
</style>