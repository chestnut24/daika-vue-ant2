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
                :style="choiceTabs == '1'?'':'opacity: 0.4;'"
                @click="tabsChange('1')"
              />
              <img class="btn_img btn_and" src="../../assets/shipment/bens_and.png" />
              <img
                class="btn_img btn_style"
                src="../../assets/shipment/bens_02_b.png"
                :style="choiceTabs == '2'?'':'opacity: 0.4;'"
                @click="tabsChange('2')"
              />

              <img class="btn_img btn_and" src="../../assets/shipment/bens_and.png" />
              <img
                class="btn_img btn_style"
                src="../../assets/shipment/bens_03_b.png"
                :style="choiceTabs == '3'?'':'opacity: 0.4;'"
                @click="tabsChange('3')"
              />

              <img class="btn_img btn_and" src="../../assets/shipment/bens_and.png" />
              <img
                class="btn_img btn_style"
                src="../../assets/shipment/bens_04_b.png"
                :style="choiceTabs == '4'?'':'opacity: 0.4;'"
                @click="tabsChange('4')"
              />
            </div>
            <div class="btns_list btns_2">
              <div @click="tabsChange('1')">&nbsp;基本信息</div>
              <div @click="tabsChange('2')">过程状态</div>
              <div @click="tabsChange('3')">成品检验</div>
              <div @click="tabsChange('4')">辅料清单</div>
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
                v-model="choiceTabs"
                :tabBarStyle="{
                  'height': 0,
                  'overflow': 'hidden',
                  'borderBottom': 0
                }"
                @change="tabsChange(choiceTabs)"
                style="width: 100%;"
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
                        <div style="font-size: 16px;margin-bottom: 10px;">戴卡订单号：</div>
                        <div style="width: 272px;display: flex;align-content: center;">
                          <a-input
                            disabled
                            tyle
                            placeholder="请选择戴卡订单号"
                            style="width: calc(100% - 74px)"
                            v-model="selectOrderStr"
                          ></a-input>
                          <a-button @click="openOrderPop()" style="width: 64px;margin-left: 10px;">
                            <img src="../../assets/shipment/choose_add_01.png" />
                          </a-button>
                        </div>
                      </div>
                    </a-col>
                  </a-row>

                  <a-row type="flex" align="middle" :gutter="[30,16]" style="margin-top: 5px">
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
                  </a-row>

                  <a-row type="flex" align="middle" :gutter="[30,16]" style="margin-top: 5x">
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
                    <a-col :md="10" :sm="10" class="flex-right">
                      <div style="width: 100%;">
                        <div style="font-size: 16px;margin-bottom: 10px;">市场负责人：</div>
                        <div style="width: 272px;display: flex;align-content: center;">
                          <a-input
                            v-model="SubmitParams.shipmentManagementInfoDto.marketLeader"
                            placeholder="请输入市场负责人"
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
                <a-tab-pane key="2" tab="过程状态">
                  <div class="key_2_body">
                    <div class="part-title">
                      <div class="part-title_blue"></div>
                      <div>过程状态</div>
                    </div>
                    <div class="key_2_list">
                      <div class="key_2_list_title">过程性能</div>
                      <div>
                        <a-radio-group
                          v-model="SubmitParams.shipmentProcessStateDto.processPerformance"
                          @change="onChangeRadio1"
                        >
                          <a-radio value="0">合格</a-radio>
                          <a-radio value="1">不合格</a-radio>
                        </a-radio-group>
                      </div>
                    </div>
                    <div class="key_2_list">
                      <div class="key_2_list_title">X光过程状态</div>
                      <div>
                        <a-radio-group
                          v-model="SubmitParams.shipmentProcessStateDto.xprocessState"
                          @change="onChangeRadio2"
                        >
                          <a-radio value="0">合格</a-radio>
                          <a-radio value="1">不合格</a-radio>
                        </a-radio-group>
                      </div>
                    </div>
                    <div class="key_2_list">
                      <div class="key_2_list_title">喷涂过程是否异常</div>
                      <div>
                        <a-radio-group
                          v-model="SubmitParams.shipmentProcessStateDto.sprayProcess"
                          @change="onChangeRadio3"
                        >
                          <a-radio value="0">合格</a-radio>
                          <a-radio value="1">不合格</a-radio>
                        </a-radio-group>
                      </div>
                    </div>
                  </div>
                </a-tab-pane>
                <a-tab-pane key="3" tab="成品检验">
                  <div class="part-title">
                    <div class="part-title_blue"></div>
                    <div>成品检验信息</div>
                  </div>
                  <a-form layout="inline">
                    <a-row type="flex" align="middle" :gutter="[16,16]" style="margin: 16px 0;">
                      <a-col :md="6" :sm="6" class>
                        <div>其它关注尺寸</div>
                      </a-col>
                      <a-form-item>
                        <a-col :md="12" :sm="8">
                          <a-input
                            placeholder="请输入其它关注尺寸"
                            v-model="SubmitParams.shipmentFinalProductTestDto.otherFocusSizes"
                            style="width: 200px"
                          ></a-input>
                        </a-col>
                      </a-form-item>
                    </a-row>

                    <a-row type="flex" align="middle" :gutter="[16,16]" style="margin: 16px 0;">
                      <a-col :md="6" :sm="6" class>
                        <div>漆膜性能验证</div>
                      </a-col>
                      <a-form-item>
                        <a-col>
                          <a-input
                            placeholder="请输入漆膜性能验证"
                            v-model="SubmitParams.shipmentFinalProductTestDto.filmPerformanceTest"
                            style="width: 200px"
                          ></a-input>
                        </a-col>
                      </a-form-item>
                    </a-row>

                    <a-row type="flex" align="middle" :gutter="[16,16]" style="margin: 16px 0;">
                      <a-col :md="6" :sm="6" class>
                        <div>漆膜厚度和边缘漏电</div>
                      </a-col>
                      <a-form-item>
                        <a-col :md="12" :sm="8">
                          <a-input
                            placeholder="请输入漆膜厚度和边缘漏电"
                            v-model="SubmitParams.shipmentFinalProductTestDto.filmThicknessEdgeLeakage"
                            style="width: 200px"
                          ></a-input>
                        </a-col>
                      </a-form-item>
                    </a-row>

                    <a-row type="flex" align="middle" :gutter="[16,16]" style="margin: 16px 0;">
                      <a-col :md="6" :sm="6" class>
                        <div>漆膜颜色符合度</div>
                      </a-col>
                      <a-form-item>
                        <a-col :md="10" :sm="8">
                          <a-input
                            placeholder="请输入漆膜颜色符合度"
                            v-model="SubmitParams.shipmentFinalProductTestDto.filmColourConformity"
                            style="width: 200px"
                          ></a-input>
                        </a-col>
                      </a-form-item>
                    </a-row>

                    <a-row type="flex" align="middle" :gutter="[16,16]" style="margin: 16px 0;">
                      <a-col :md="6" :sm="6" class>
                        <div>表面外观缺陷</div>
                      </a-col>
                      <a-form-item>
                        <a-col :md="10" :sm="8">
                          <a-input
                            placeholder="请输入表面外观缺陷"
                            v-model="SubmitParams.shipmentFinalProductTestDto.surfaceAppearanceDefect"
                            style="width: 200px"
                          ></a-input>
                        </a-col>
                      </a-form-item>
                    </a-row>
                    <div class="part-title">
                      <div class="part-title_blue"></div>
                      <div>其它</div>
                    </div>
                    <a-form layout="inline">
                      <a-row type="flex" align="middle">
                        <a-col :md="6" :sm="4" class>
                          <div>平衡标识是否特殊</div>
                        </a-col>
                        <a-col :md="6" :sm="8">
                          <a-form-item>
                            <a-checkbox
                              @change="onChange"
                              v-model="SubmitParams.shipmentFinalProductTestDto.balanceSign"
                            ></a-checkbox>
                          </a-form-item>
                        </a-col>

                        <a-col :md="4" :sm="4" class>
                          <div></div>
                        </a-col>
                        <a-col :md="6" :sm="8"></a-col>

                        <a-col :md="6" :sm="4" class>
                          <div>谐波标识</div>
                        </a-col>
                        <a-col :md="6" :sm="8">
                          <a-form-item>
                            <a-form-item>
                              <a-checkbox
                                @change="onChange"
                                v-model="SubmitParams.shipmentFinalProductTestDto.harmonicSign"
                              ></a-checkbox>
                            </a-form-item>
                          </a-form-item>
                        </a-col>

                        <a-col :md="4" :sm="4" class>
                          <div></div>
                        </a-col>
                        <a-col :md="6" :sm="8"></a-col>

                        <a-col :md="6" :sm="4" class>
                          <div>是否保留同批次外观样轮</div>
                        </a-col>
                        <a-col :md="6" :sm="8">
                          <a-form-item>
                            <a-row type="flex" align="middle" :gutter="[16,16]">
                              <a-col :md="4" :sm="4" class>
                                <a-checkbox
                                  @change="onChange"
                                  v-model="SubmitParams.shipmentFinalProductTestDto.sameBatchAppearanceOutline"
                                ></a-checkbox>
                              </a-col>
                              <a-col :md="8" :sm="4" class>
                                <a-input
                                  :disabled="SubmitParams.shipmentFinalProductTestDto.sameBatchAppearanceOutline === false ? true:false"
                                  v-model="SubmitParams.shipmentFinalProductTestDto.sameBatchAppearanceOutlineNu"
                                ></a-input>
                              </a-col>
                            </a-row>
                          </a-form-item>
                        </a-col>
                      </a-row>
                    </a-form>
                  </a-form>
                </a-tab-pane>
                <a-tab-pane key="4" tab="辅料清单">
                  <div class="part-title">
                    <div class="part-title_blue"></div>
                    <div>辅料清单</div>
                  </div>
                  <a-row
                    type="flex"
                    align="middle"
                    class="border_all"
                    v-for="(row, rowIndex) of tableNameTop"
                    :key="rowIndex"
                  >
                    <a-col
                      :md="1"
                      :sm="1"
                      class="flex-center border_only_bottom title-background"
                    >选择</a-col>
                    <a-col
                      :md="5"
                      :sm="5"
                      class="flex-center title-background border_only_bottom"
                    >辅料</a-col>
                    <a-col
                      :md="6"
                      :sm="6"
                      class="flex-center flex-center_0 border_only_bottom border_only_number title-background"
                    >数量</a-col>
                    <a-col
                      :md="12"
                      :sm="12"
                      class="flex-center flex-center_0 border_only_bottom title-background"
                    >备注</a-col>
                    <template v-for="(item, value, itemIndex) of row">
                      <a-col :md="1" :sm="1" class="flex-center border_only_bottom">
                        <a-checkbox
                          v-model="SubmitParams[item[0].split('.')[0]][item[0].split('.')[1]]"
                          @change="onChange"
                        ></a-checkbox>
                      </a-col>
                      <a-col :md="5" :sm="5" class="flex-center border_only_bottom">
                        <div>{{ value }}</div>
                      </a-col>
                      <a-col
                        :md="6"
                        :sm="6"
                        class="flex-center flex-center_0 border_only_bottom border_only_number"
                      >
                        <a-input-number
                          style="width: 100%;"
                          :placeholder="'请输入'+value+'数量'"
                          :disabled="SubmitParams[item[0].split('.')[0]][item[0].split('.')[1]] == true ?false:true"
                          v-model="SubmitParams[item[2].split('.')[0]][item[2].split('.')[1]]"
                        ></a-input-number>
                      </a-col>
                      <a-col :md="12" :sm="12" class="flex-center flex-center_0 border_only_bottom">
                        <a-input
                          :placeholder="'请输入'+value"
                          :disabled="SubmitParams[item[0].split('.')[0]][item[0].split('.')[1]] == true ?false:true"
                          v-model="SubmitParams[item[1].split('.')[0]][item[1].split('.')[1]]"
                        ></a-input>
                      </a-col>
                    </template>
                  </a-row>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
          <div style="width: 100%;padding: 15px 0 20px 0;">
            <a-button type="primary" @click="submitForm(0)">{{buttonTitle}}</a-button>
            <a-button type="primary" ghost style="margin-left: 10px;" @click="submitForm(1)">保存为草稿箱</a-button>
          </div>
          <selectproject-no ref="modal" v-on:get-text="getProjectNumber"></selectproject-no>
          <select-order-pop
            ref="order"
            v-on:get-text="getOrder"
            :isShowNoOrder="false"
            :projectNo="formData.projectNo||''"
          ></select-order-pop>
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
            <div>订单信息</div>
          </div>
          <div class="my_table" v-if="selectOrder&&selectOrder[0]&&selectOrder[0].id !== null">
            <table>
              <tr>
                <td style="background: #F5F8FA;">戴卡订单号</td>
                <td style="background: #F5F8FA;">客户名称</td>
                <td style="background: #F5F8FA;">订单数量</td>
                <td style="background: #F5F8FA;">操作</td>
              </tr>
              <tr v-for="(item, index) in this.selectOrder" :key="item.id">
                <td>{{item.dkOrdersNumber}}</td>
                <td>{{item.customerName}}</td>
                <td>{{item.orderNumber}}</td>
                <td>
                  <a-button type="link" @click="queryDetail(item, index)" style>详情</a-button>
                </td>
              </tr>
            </table>
          </div>
          <div class="my_table_0" v-else>暂无数据</div>
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
  getSampleLocation
} from '@api/api'
export default {
  name: 'AddShipOrder',
  inject: ['closeCurrent'],
  mixins: [GetImgByProjectNumMixin],
  components: { SelectOrderPop, SelectNumber, ProjectInformation, SelectBatchNo, SelectprojectNo }, //引入组件
  data() {
    return {
      hasNoSaveData: 0,
      purposeLabel: '',
      valueRadio1: 1,
      valueRadio2: 1,
      valueRadio3: 1,
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
      choiceTabs: '1',
      buttonTitle: '下一步',
      purpose: '',
      editStatus: false,
      formId: undefined,
      formData: {
        // 表单数据
        projectNo: '',
        ordersNo: [],
        batchNo: []
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
          sendSampleNumber: undefined,
          warehouseBatch: '',
          shipmentSendSampleDemandBatchVOList: [],
          sendSamplePurpose: undefined,
          packagingTransportationMode: undefined
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
        noun: []
      },
      tableNameTop: [
        {
          装配材: [
            'shipmentSamplePackingListDto.assemblyPartsCheckOrNot',
            'shipmentSamplePackingListDto.assemblyParts',
            'shipmentSamplePackingListDto.assemblyPartsNumber'
          ],
          插件: [
            'shipmentSamplePackingListDto.plugInCheckOrNot',
            'shipmentSamplePackingListDto.plugIn',
            'shipmentSamplePackingListDto.plugInNumber'
          ],
          钢套: [
            'shipmentSamplePackingListDto.steelSleeveCheckOrNot',
            'shipmentSamplePackingListDto.steelSleeve',
            'shipmentSamplePackingListDto.steelSleeveNumber'
          ],
          工装: [
            'shipmentSamplePackingListDto.workClothesCheckOrNot',
            'shipmentSamplePackingListDto.workClothes',
            'shipmentSamplePackingListDto.workClothesNumber'
          ],
          辅材: [
            'shipmentSamplePackingListDto.auxiliaryMaterialsCheckOrNot',
            'shipmentSamplePackingListDto.auxiliaryMaterials',
            'shipmentSamplePackingListDto.auxiliaryMaterialsNumber'
          ],
          条码: [
            'shipmentSamplePackingListDto.barCodeCheckOrNot',
            'shipmentSamplePackingListDto.barCode',
            'shipmentSamplePackingListDto.barCodeNumber'
          ],
          标签: [
            'shipmentSamplePackingListDto.tagCheckOrNot',
            'shipmentSamplePackingListDto.tag',
            'shipmentSamplePackingListDto.tagNumber'
          ],
          报告: [
            'shipmentSamplePackingListDto.reportCheckOrNot',
            'shipmentSamplePackingListDto.report',
            'shipmentSamplePackingListDto.reportNumber'
          ],
          其他: [
            'shipmentSamplePackingListDto.otherCheckOrNot',
            'shipmentSamplePackingListDto.other',
            'shipmentSamplePackingListDto.otherNumber'
          ]
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
          // appearanceProcurator: "",
          balanceSign: false,
          // date: "",
          filmColourConformity: '',
          filmPerformanceTest: '',
          filmThicknessEdgeLeakage: '',
          harmonicSign: false,
          other: '',
          otherFocusSizes: '',
          sameBatchAppearanceOutline: false,
          sameBatchAppearanceOutlineNu: '',
          surfaceAppearanceDefect: ''
        },

        shipmentManagementInfoDto: {
          daikaPartNumber: '',
          isItRunner: 1,
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
          processPerformance: '',
          sprayProcess: '',
          xprocessState: ''
        },

        shipmentSamplePackingListDto: {
          assemblyParts: '',
          assemblyPartsCheckOrNot: false,
          auxiliaryMaterials: '',
          auxiliaryMaterialsCheckOrNot: false,
          barCode: '',
          barCodeCheckOrNot: false,
          plugIn: '',
          plugInCheckOrNot: false,
          steelSleeve: '',
          steelSleeveCheckOrNot: false,
          tag: '',
          tagCheckOrNot: false,
          workClothes: '',
          workClothesCheckOrNot: false,
          report: '',
          reportCheckOrNot: false,
          other: '',
          otherCheckOrNot: false
        },

        shipmentSendSampleDemandDtoList: [
          {
            sendSampleNumber: undefined,
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
            sendSamplePurpose: undefined,
            packagingTransportationMode: undefined
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
    SubmitParams: {
      handler() {
        this.hasNoSaveData++
      },
      deep: true
    },
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
    deleteDataSource(operate, i) {
      this.dataSource.splice(i, 1)
      this.dataSourceRight = []
      this.displayRightTable()
    },
    recoverForm() {
      getShipmentById({ id: this.formId }).then(data => {
        if (data) {
          this.shipmentManagementId = data.shipmentSendSampleDemandVoList[0].shipmentManagementId
          this.shipmentSendSampleDemandIds = data.shipmentSendSampleDemandVoList[0].shipmentSendSampleDemandIds
          // this.SubmitParams.shipmentManagementInfoDto.daikaPartNumber = data.shipmentOrdersVo.component;
          this.SubmitParams.shipmentManagementInfoDto.daikaPartNumber = data.shipmentManagementInfoVo.wheelShape
          // this.formData.projectNo = data.shipmentOrdersVo.component;
          // this.formData.projectNo = data.shipmentProjectInfoVo.projectNumber;
          this.formData.projectNo = data.shipmentManagementInfoVo.wheelShape
          this.queryParam.component = data.shipmentProjectInfoVo.projectNumber
          this.queryParam.wheelSize = data.shipmentProjectInfoVo.wheelSize
          this.queryParam.surfaceState = data.shipmentProjectInfoVo.surfaceState
          this.queryParam.projectManager = data.shipmentManagementInfoVo.projectLeader
          this.queryParam.imgUrl = data.shipmentProjectInfoVo.imgUrl
          this.SubmitParams.shipmentManagementInfoDto.ordersId = data.shipmentOrdersVo.id
          this.selectOrderStr = data.shipmentOrdersVo.dkOrdersNumber
          let obj = []
          obj[0] = data.shipmentOrdersVo
          this.selectOrder = obj
          for (let i = 0; i < data.shipmentSendSampleDemandVoList.length; i++) {
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
            this.dataSource.splice(i, 1, data.shipmentSendSampleDemandVoList[i])
          }
          // for(let i = 0 ; i<data.warehouseBatchVOList.length; i++) {
          //   if( i==0) {
          //     data.shipmentSendSampleDemandVoList[i].warehouseBatchDis = data.warehouseBatchVOList[i].batch + '\n';
          //   }else{
          //     data.shipmentSendSampleDemandVoList[i].warehouseBatchDis += data.warehouseBatchVOList[i].batch + '\n';
          //   }
          //
          //   // for( let j=0; j<data.shipmentSendSampleDemandVoList[i].shipmentSendSampleDemandBatchVOList.length; j++) {
          //   //   if( j==0) {
          //   //     data.shipmentSendSampleDemandVoList[i].warehouseBatchDis = data.shipmentSendSampleDemandVoList[i].shipmentSendSampleDemandBatchVOList[j].warehouseBatch + '\n';
          //   //   }else{
          //   //     data.shipmentSendSampleDemandVoList[i].warehouseBatchDis += data.shipmentSendSampleDemandVoList[i].shipmentSendSampleDemandBatchVOList[j].warehouseBatch + '\n';
          //   //   }
          //   // }
          //   this.dataSource.splice(i,1,data.shipmentSendSampleDemandVoList[i]);
          //
          // }

          this.SubmitParams.shipmentFinalProductTestDto = data.shipmentFinalProductTestVo
          this.SubmitParams.shipmentProcessStateDto = data.shipmentProcessStateVo
          this.SubmitParams.shipmentSamplePackingListDto = data.shipmentSamplePackingListVo
          console.log('data.shipmentManagementInfoVo', data.shipmentManagementInfoVo)
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
          this.SubmitParams.shipmentProcessStateDto.processPerformance = data.shipmentProcessStateVo.processPerformance
          this.SubmitParams.shipmentProcessStateDto.sprayProcess = data.shipmentProcessStateVo.sprayProcess
          this.SubmitParams.shipmentProcessStateDto.xprocessState = data.shipmentProcessStateVo.xprocessState
          this.SubmitParams.shipmentFinalProductTestDto.date =
            data.shipmentFinalProductTestVo.date !== 'null' ? data.shipmentFinalProductTestVo.date : null
          this.SubmitParams.shipmentManagementInfoDto.planShipmentDate =
            data.shipmentManagementInfoVo.planShipmentDate !== null ||
            data.shipmentManagementInfoVo.planShipmentDate !== 'null'
              ? data.shipmentManagementInfoVo.planShipmentDate
              : null
          this.SubmitParams.shipmentSamplePackingListDto.assemblyPartsCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.assemblyPartsCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.auxiliaryMaterialsCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.auxiliaryMaterialsCheckOrNot == '0' ? true : false

          this.SubmitParams.shipmentSamplePackingListDto.barCodeCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.barCodeCheckOrNot == '0' ? true : false

          // this.SubmitParams.shipmentSamplePackingListDto.doubleBoxCheckOrNot =
          //   this.SubmitParams.shipmentSamplePackingListDto.doubleBoxCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.plugInCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.plugInCheckOrNot == '0' ? true : false

          // this.SubmitParams.shipmentSamplePackingListDto.sizeCheckOrNot =
          //   this.SubmitParams.shipmentSamplePackingListDto.sizeCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.steelSleeveCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.steelSleeveCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.tagCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.tagCheckOrNot == '0' ? true : false

          // this.SubmitParams.shipmentSamplePackingListDto.totalPackageMaterialCheckOrNot =
          //   this.SubmitParams.shipmentSamplePackingListDto.totalPackageMaterialCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.otherCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.otherCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.wheelShapeCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.wheelShapeCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.workClothesCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.workClothesCheckOrNot == '0' ? true : false
          this.SubmitParams.shipmentSamplePackingListDto.reportCheckOrNot =
            this.SubmitParams.shipmentSamplePackingListDto.reportCheckOrNot == '0' ? true : false

          this.displayRightTable()
        }
      })
    },
    displayRightTable() {
      for (let i = 0; i < this.dataSource.length; i++) {
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
    },
    submitForm(isDraft) {
      if (isDraft == 0 && this.choiceTabs != '4') {
        // this.buttonTitle = "下一个";
        this.choiceTabs = (Number(this.choiceTabs) + 1).toString()
        return
      }
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

      let param = JSON.parse(JSON.stringify(this.SubmitParams))
      param.shipmentManagementInfoDto.userId = store.getters.userInfo.id
      param.shipmentManagementInfoDto.daikaPartNumber = this.formData.projectNo
      param.shipmentManagementInfoDto.warehouseInfoId = Number(
        this.SubmitParams.shipmentManagementInfoDto.warehouseInfoId
      )
      param.shipmentManagementInfoDto.ordersId = this.SubmitParams.shipmentManagementInfoDto.ordersId
        ? Number(this.SubmitParams.shipmentManagementInfoDto.ordersId)
        : undefined
      param.shipmentManagementInfoDto.projectId = Number(this.SubmitParams.shipmentManagementInfoDto.projectId)
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
      // param.shipmentSamplePackingListDto.doubleBoxCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
      //   .doubleBoxCheckOrNot
      //   ? '0'
      //   : '1'
      param.shipmentSamplePackingListDto.plugInCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
        .plugInCheckOrNot
        ? '0'
        : '1'
      // param.shipmentSamplePackingListDto.sizeCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto.sizeCheckOrNot
      //   ? '0'
      //   : '1'
      param.shipmentSamplePackingListDto.steelSleeveCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
        .steelSleeveCheckOrNot
        ? '0'
        : '1'
      param.shipmentSamplePackingListDto.tagCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto.tagCheckOrNot
        ? '0'
        : '1'
      // param.shipmentSamplePackingListDto.totalPackageMaterialCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
      //   .totalPackageMaterialCheckOrNot
      //   ? '0'
      //   : '1'
      // param.shipmentSamplePackingListDto.trayCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto.trayCheckOrNot
      //   ? '0'
      //   : '1'
      // param.shipmentSamplePackingListDto.wheelShapeCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
      //   .wheelShapeCheckOrNot
      //   ? '0'
      //   : '1'
      param.shipmentSamplePackingListDto.workClothesCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
        .workClothesCheckOrNot
        ? '0'
        : '1'
      param.shipmentSamplePackingListDto.reportCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
        .reportCheckOrNot
        ? '0'
        : '1'
      param.shipmentSamplePackingListDto.otherCheckOrNot = this.SubmitParams.shipmentSamplePackingListDto
        .otherCheckOrNot
        ? '0'
        : '1'
      if (this.editId == 0) {
        if (param.shipmentManagementInfoDto.daikaPartNumber === '') {
          this.$message.error('戴卡部件号不能为空')
          return
        }
        if (this.selectOrderStr === '') {
          this.$message.error('订单号不能为空')
          return
        }
        if (this.SubmitParams.shipmentManagementInfoDto.shipmentDestination === '') {
          this.$message.error('发运目的地不能为空')
          return
        }
        if (
          this.SubmitParams.shipmentManagementInfoDto.planShipmentDate === '' ||
          this.SubmitParams.shipmentManagementInfoDto.planShipmentDate === undefined ||
          this.SubmitParams.shipmentManagementInfoDto.planShipmentDate === null
        ) {
          this.$message.error('计划发运时间不能为空')
          return
        }
        if (this.SubmitParams.shipmentManagementInfoDto.projectLeader === '') {
          this.$message.error('项目负责人不能为空')
          return
        }
        if (this.SubmitParams.shipmentManagementInfoDto.marketLeader === '') {
          this.$message.error('市场负责人不能为空')
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
        if (this.SubmitParams.shipmentFinalProductTestDto.sameBatchAppearanceOutline === true) {
          if (!this.SubmitParams.shipmentFinalProductTestDto.sameBatchAppearanceOutlineNu) {
            this.$message.error('您已勾选是否保留同批次外观样轮，请输入数量')
            return
          }
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
            // this.closeCurrent();
            // this.$router.push({
            //   path: `/ship/TransferOrderManage`,
            // });
          }
        })
      }
    },
    onChange(date, dateString) {
      console.log(date, dateString)
    },

    tabsChange(key) {
      this.choiceTabs = key
    },
    openSelect() {
      this.$refs.modal.add()
    },
    openOrderPop() {
      // 判断下能不能打开
      if (this.queryParam.component) {
        this.$refs.order.add()
      } else {
        this.$message.error('请先选择戴卡部件号')
      }
    },
    openBatch(operate, i) {
      this.$refs.batchInfo.add()
      this.selectedBatchRow = i
      if (this.dataSource[this.selectedBatchRow].warehouseBatchDis) {
        this.editBatchArr = this.dataSource[this.selectedBatchRow].warehouseBatchDis.split('\n')
      }
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
      if (this.queryParam.component !== event.projectNo) {
        this.SubmitParams.shipmentManagementInfoDto.ordersId = null
        this.selectOrderStr = null
        this.selectOrder = null
      }
      this.formData.projectNo = event.projectNo
      this.queryParam.component = event.projectNo
      this.purpose = event.purpose
      this.purposeLabel = event.purposeLabel
      this.queryParam.wheelSize = event.size
      this.queryParam.surfaceState = event.surfaceState
      this.queryParam.projectManager = event.projectManager // 项目经理
      this.SubmitParams.shipmentManagementInfoDto.projectId = event.id
      this.SubmitParams.shipmentManagementInfoDto.warehouseInfoId = event.warehouseIntoId
    },

    getOrder(event) {
      // 父组件监听子组件值

      this.SubmitParams.shipmentManagementInfoDto.ordersId = event[0].id
      console.log('event[0].id', event[0].id)
      this.selectOrderStr = event[0].dkOrdersNumber
      this.selectOrder = event
    },

    getBatch(event, event1) {
      // 父组件监听子组件值
      this.selectBatchStr = ''
      this.selectBatchStrDis = ''
      if (this.editId == 1 && this.editStatus === false) {
        this.tmpDataSource = this.dataSourceRight
        this.editStatus = true
      }
      // if(this.editId == 1 ) {
      //   this.tmpDataSource = this.dataSourceRight;
      //   // this.editStatus = true;
      //   console.log('this.tmpDataSource********************',this.tmpDataSource)
      // }
      this.dataSourceRight = []
      // if(this.editId == 1) {
      //    this.dataSourceRight = [...this.tmpDataSource];
      //    if(this.selectedBatchRow <this.dataSource.length) {
      //      for(let editBatch of this.editBatchArr){
      //        outer:
      //        for(let i=0;i<this.dataSourceRight.length;i++){
      //
      //          if(editBatch == this.dataSourceRight[i].batch) {
      //            this.dataSourceRight.splice(i,1)
      //            inter:
      //            for(let j=0;j<this.tmpDataSource.length;j++) {
      //
      //              if(this.tmpDataSource[j].batch == editBatch) {
      //                this.tmpDataSource.splice(j,1);
      //                break inter;
      //              }
      //            }
      //            // continue;
      //            break outer;
      //          }
      //        }
      //      }
      //    }
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

    routerJump(data) {
      this.$router.push({ path: '/order/orderDetail', query: { id: data.id } })
    },

    queryDetail(operate, i) {
      // 查询详情

      if (this.hasNoSaveData > 1) {
        this.$confirm({
          title: '确定要跳转吗',
          content: '当前页面还有未保存的数据，确定要跳转吗？',
          onOk: () => {
            this.routerJump(operate)
          }
        })
      } else {
        this.routerJump(operate)
      }
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
  width: 350px;
}
.btns_1 {
  padding: 0;
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
  padding: 0 10px;
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
  cursor: pointer;
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
.border_only_number {
  border-right: 1px solid #e8e8e8;
  /deep/ .ant-input-number {
    border: 1px solid transparent;
  }
}
</style>