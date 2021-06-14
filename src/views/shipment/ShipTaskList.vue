<template>
  <div class="pageMain" style="min-width: 1600px">
    <a-card style="margin-bottom: 16px">
      <!-- 查询区域 -->
      <div class="search-container jn-public-table">
        <a-form layout="inline">
          <div class="row" v-if="!menuOpen">
            <div class="flex-left">
              <div>发运流转单号：</div>
            </div>
            <div class="item-input item-input-fold">
              <a-form-item>
                <a-input v-model="searchParams.shippingFlowSheet" placeholder="请输入发运流转单号" />
              </a-form-item>
            </div>
            <div class="flex-left">
              <div>戴卡部件号：</div>
            </div>
            <div class="item-input item-input-fold">
              <a-form-item>
                <a-input v-model="searchParams.wheelShape" placeholder="请输入戴卡部件号" />
              </a-form-item>
            </div>

            <div class="flex-left">
              <div>戴卡订单号：</div>
            </div>
            <div class="item-input item-input-fold">
              <a-form-item>
                <a-input v-model="searchParams.customerOrder" placeholder="请输入戴卡订单号" />
              </a-form-item>
            </div>

            <div class="button-group">
              <a-button type="link" @click="changeDownOrUp" style="margin-right: 0">
                展开
                <a-icon type="down" />
              </a-button>
              <a-button type="primary" @click="getList(true)">查询</a-button>
              <a-button @click="resertGetList()">重置</a-button>
            </div>
          </div>
          <template v-if="menuOpen">
            <div class="row" style="margin-bottom: 16px">
              <div class="flex-left">
                <div>发运流转单号：</div>
              </div>
              <div class="item-input item-input-fold">
                <a-form-item>
                  <a-input v-model="searchParams.shippingFlowSheet" placeholder="请输入发运流转单号" />
                </a-form-item>
              </div>
              <div class="flex-left">
                <div>戴卡部件号：</div>
              </div>
              <div class="item-input item-input-fold">
                <a-form-item>
                  <a-input v-model="searchParams.wheelShape" placeholder="请输入戴卡部件号" />
                </a-form-item>
              </div>

              <div class="flex-left">
                <div>戴卡订单号：</div>
              </div>
              <div class="item-input item-input-fold">
                <a-form-item>
                  <a-input v-model="searchParams.customerOrder" placeholder="请输入戴卡订单号" />
                </a-form-item>
              </div>
            </div>

            <div class="row" style="margin-bottom: 16px">
              <div class="flex-left">
                <div>样件批次号：</div>
              </div>
              <div class="item-input">
                <a-form-item>
                  <a-input v-model="searchParams.batchNumber" placeholder="请输入样件批次号" />
                </a-form-item>
              </div>
              <div class="flex-left">
                <div>客户名称</div>
              </div>
              <div class="item-input">
                <a-form-item>
                  <a-input v-model="searchParams.customerName" placeholder="请输入客户名称" />
                </a-form-item>
              </div>
              <div class="flex-left">
                <div>计划发运时间：</div>
              </div>
              <div class="item-input">
                <a-form-item>
                  <a-range-picker
                    style="width: 244px;"
                    @change="ontimeChange($event)"
                    v-model="searchParams.time"
                    valueFormat="YYYY-MM-DD"
                  />
                </a-form-item>
              </div>
              <div class="button-group">
                <a-button type="link" @click="changeDownOrUp" style="margin-right: 0">
                  收起
                  <a-icon type="up" />
                </a-button>
                <a-button type="primary" @click="getList(true)">查询</a-button>
                <a-button @click="resertGetList()">重置</a-button>
              </div>
            </div>
          </template>
        </a-form>
      </div>
    </a-card>

    <a-card
      title="发运任务管理"
      style="width: 100%"
      :bordered="false"
      :headStyle="{
        padding: '0 32px',
        fontSize: '18px',
        fontWeight: '600',
      }"
      :bodyStyle="{padding: '16px 32px'}"
    >
      <div slot="extra">
        <a-button type="primary" ghost style="margin-right: 8px;" @click="lookBaoQuery_dialog = true">包装物料查询</a-button>
        <a-button type="primary" @click="acceptubmit" :disabled="rowSelection_list.length == 0">接收</a-button>
      </div>
      <div class="jn-public-table jn-public-table-other">
        <a-table
          :dataSource="dataSource"
          :columns="showColumns"
          bordered
          :pagination="false"
          :loading="tableLoading"
          :scroll="{ x: true }"
          :row-selection="{ selectedRowKeys: rowSelection_key, onChange: rowSelectiOnSelect }"
        >
          <jnFilterTable
            ref="jnFilterTable"
            :columns="columns"
            :showColumns="showColumns"
            @showColumnsChange="setShowColumns"
            slot="filterDropdown"
          ></jnFilterTable>
          <jnFilterIcon slot="filterIcon"></jnFilterIcon>
          <jnFilterAction slot="action" slot-scope="text, record"></jnFilterAction>
          <!-- 发运流转单号 - shippingFlowSheet -->
          <a-space slot="shippingFlowSheet" slot-scope="text, operate, i" class="operate-row">
            <a @click="getLookMsg(operate, i)">{{operate.shippingFlowSheet}}</a>
          </a-space>
          <a-space
            slot="batchNumber"
            slot-scope="text, operate, i"
            class="operate-row"
          >
          <div v-html="operate.batchNumber.join('<br>')"></div>
          <!-- {{operate.batchNumber.join('，')}} -->
          </a-space>
          <!-- 紧急任务 -->
          <a-space slot="urgentTaskStatus" slot-scope="text, operate" class="operate-row">
            <span
              v-if="operate.urgentTaskStatus == 1"
              style="color: #FF3133;"
            >{{operate.urgentTaskStatus_L}}</span>
            <span v-else>{{operate.urgentTaskStatus_L}}</span>
          </a-space>
          <!-- shipPlanNumber -->
          <a-space slot="shipPlanNumber" slot-scope="text, operate" class="operate-row">
            <span v-if="operate.urgentTaskStatus == 1">--</span>
            <span v-else-if="operate.shipPlanNumber === 'null'">--</span>
            <span v-else>{{operate.shipPlanNumber}}</span>
          </a-space>
          <!-- planRetestDate -->
          <a-space slot="planRetestDate" slot-scope="text, operate" class="operate-row">
            <span v-if="operate.urgentTaskStatus == 1">--</span>
            <span v-else>{{operate.planRetestDate}}</span>
          </a-space>
          <!-- 是否转轮 -->
          <a-space slot="isItRunner" slot-scope="text, operate" class="operate-row">
            <span v-if="operate.isItRunner == 1">否</span>
            <span v-else-if="operate.isItRunner == 0">是</span>
            <span v-else></span>
          </a-space>
          <!-- 过程指令 - shipmentProcessOrderVos -->
          <a-space slot="shipmentProcessOrderVos" slot-scope="text, operate, i" class="operate-row">
            <a
              v-if="operate.shipmentProcessOrderIds&&operate.shipmentProcessOrderIds.length"
              @click="goLing(operate, i)"
            >有({{operate.shipmentProcessOrderIds.length}})</a>
            <span v-else>无</span>
          </a-space>
          <!-- 操作 -->
          <a-space slot="operate" slot-scope="text, operate, i" class="operate-row operate_caozuo">
            <!-- 发运任务状态 0 :待接收 1：发运物料确认 2：复查任务 3：包装确认 4：提货确认 5：物流信息维护 -->
            <div v-if="operate.taskStatus == 0">
              <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
            </div>
            <div v-else-if="operate.taskStatus == 1">
              <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
            </div>
            <div v-else-if="operate.taskStatus == 2">
              <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
              <a-button type="link" @click="lookCheckOut(operate, i)">出库进度查询</a-button>
              <a-button type="link" @click="getfuchaMsg(operate, i)">复查任务</a-button>
            </div>
            <div v-else-if="operate.taskStatus == 3">
              <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
              <a-button type="link" @click="lookCheckOut(operate, i)">出库进度查询</a-button>
              <a-button type="link" @click="getbaozhuangMsg(operate, i)">包装确认</a-button>
            </div>
            <div v-else-if="operate.taskStatus == 4">
              <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
              <!-- <a-button type="link" @click="lookCheckOut(operate, i)">出库进度查询</a-button> -->
            </div>
            <div v-else-if="operate.taskStatus == 5">
              <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
              <a-button type="link" @click="getwuliuMsg(operate, i)">物流信息维护</a-button>
            </div>
            <div v-else-if="operate.taskStatus == 10">
              <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
              <a-button type="link" @click="lookCheckOut(operate, i)">出库进度查询</a-button>
            </div>
            <div v-else-if="operate.taskStatus == 11">
              <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
              <a-button type="link" @click="goQrcord(operate, i)">签收</a-button>
            </div>
            <div v-else-if="operate.taskStatus == 12">
              <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
              <a-button type="link" @click="lookShipQian(operate, i)">签收信息查询</a-button>
            </div>
            <div v-else>
              <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
            </div>
          </a-space>
        </a-table>
        <!-- 分页 -->
        <div class="bottom-page">
          <a-pagination
            :total="total"
            :show-total="total => `共 ${total} 条`"
            :page-size="pageSize"
            :current="currentPage"
            @change="pageChange"
          />
          <div style="margin: 0 20px">共 {{pageNum}} 页</div>
          <div style="margin: 0 10px 0 0">到第</div>
          <a-input-number
            style="width: 50px"
            @keyup.enter.native="pageJump(jumpPage)"
            v-model="jumpPage"
          ></a-input-number>
          <div style="margin: 0 20px 0 10px">页</div>
          <a-button type="primary" @click="pageJump(jumpPage)">跳转</a-button>
        </div>
      </div>
    </a-card>
    <div class="dialog">
      <!-- reviewTimeDialog -->
      <a-modal v-model="deliveryVisible" title="发运物料确认" :footer="null" width="800px">
        <div v-if="deliveryVisible">
          <wuliao-dialog :id="deliverychoose_id" @close="closeTimeMsg" :iShow="false"></wuliao-dialog>
        </div>
      </a-modal>
      <!-- checkOutDialog 出库进度查询-->
      <a-modal v-model="deliveryVisible3" title="出库进度查询" :footer="null" width="1200px">
        <div v-if="deliveryVisible3">
          <check-out-dialog
            :id="deliverychoose_id"
            @close="deliveryVisible3 = false,deliverychoose_id = null"
          ></check-out-dialog>
        </div>
      </a-modal>
      <!-- fuchaDialog - 复查任务 -->
      <a-modal v-model="deliveryVisible4" title="复查任务" :footer="null" width="800px">
        <div v-if="deliveryVisible4">
          <fucha-dialog :id="deliverychoose_id" @close="closeTimeMsg4" :iShow="false"></fucha-dialog>
        </div>
      </a-modal>
      <!-- signApproveDialog 发运流转单任务异议签批审核-->
      <a-modal v-model="deliveryVisible5" title="发运流转单任务异议签批审核" :footer="null" width="800px">
        <div v-if="deliveryVisible5">
          <sign-approve-dialog
            :id="deliverychoose_id"
            @close="deliveryVisible5 = false,deliverychoose_id = null"
            isShow
          ></sign-approve-dialog>
        </div>
      </a-modal>
      <!-- baozhuangDialog - 包装确认 -->
      <a-modal v-model="deliveryVisible6" title="包装确认" :footer="null" width="800px">
        <div v-if="deliveryVisible6">
          <baozhuang-dialog :id="deliverychoose_id" @close="closeTimeMsg6" :iShow="false"></baozhuang-dialog>
        </div>
      </a-modal>
      <!-- baozhuangDialog - 包装确认 -->
      <a-modal v-model="deliveryVisible7" title="物流信息维护" :footer="null" width="800px">
        <div v-if="deliveryVisible7">
          <wuliu-dialog :id="deliverychoose_id" @close="closeTimeMsg7" :iShow="false"></wuliu-dialog>
        </div>
      </a-modal>
      <a-modal v-model="deliveryVisible2" title="流转单现阶段详情" :footer="null" width="800px">
        <div v-if="deliveryVisible2">
          <view-details
            :id="deliverychoose_id"
            @close="deliveryVisible2 = false;pageStatus = '0';deliverychoose_id = null"
            :iShow="true"
            :shippingFlowSheet="pageStatus"
          ></view-details>
        </div>
      </a-modal>
      <!-- 紧急任务 - 窗口 -->
      <a-modal v-model="JinJidialog" title="紧急任务" :footer="null" width="1250px">
        <div v-if="JinJidialog">
          <div class="table-frame tmt_0 My_table jn-public-table jn-public-table-other">
            <div class="jinji_show_img">
              <img
                style="width: 100%;height: auto;display: block;"
                src="../../assets/jin_show_img.png"
              />
            </div>
            <a-table
              :dataSource="dataSource_j"
              :columns="columns_j"
              bordered
              :pagination="false"
              :scroll="{ x: true }"
            >
              <!-- 发运流转单号 - shippingFlowSheet -->
              <a-space slot="shippingFlowSheet" slot-scope="text, operate, i" class="operate-row">
                <a
                  style="color: #ff4d4f;"
                  @click="getLookMsg(operate, i)"
                >{{operate.shippingFlowSheet}}</a>
              </a-space>
              <!-- batchNumber -->
              <a-space
                slot="batchNumber"
                slot-scope="text, operate, i"
                class="operate-row"
              >
              <!-- {{operate.batchNumber.join('，')}} -->
              <div v-html="operate.batchNumber.join('<br>')"></div>
              </a-space>
              <!-- 操作 -->
              <a-space
                slot="operate"
                slot-scope="text, operate, i"
                class="operate-row operate_caozuo"
              >
                <div v-if="operate.taskStatus == 0">
                  <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
                </div>
                <div v-else-if="operate.taskStatus == 1">
                  <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
                </div>
                <div v-else-if="operate.taskStatus == 2">
                  <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
                  <a-button type="link" @click="lookCheckOut(operate, i)">出库进度查询</a-button>
                  <a-button type="link" @click="getfuchaMsg(operate, i)">复查任务</a-button>
                </div>
                <div v-else-if="operate.taskStatus == 3">
                  <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
                  <a-button type="link" @click="lookCheckOut(operate, i)">出库进度查询</a-button>
                  <a-button type="link" @click="getbaozhuangMsg(operate, i)">包装确认</a-button>
                </div>
                <div v-else-if="operate.taskStatus == 4">
                  <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
                  <!-- <a-button type="link" @click="lookCheckOut(operate, i)">出库进度查询</a-button> -->
                </div>
                <div v-else-if="operate.taskStatus == 5">
                  <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
                  <a-button type="link" @click="getwuliuMsg(operate, i)">物流信息维护</a-button>
                </div>
                <div v-else-if="operate.taskStatus == 10">
                  <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
                  <a-button type="link" @click="lookCheckOut(operate, i)">出库进度查询</a-button>
                </div>
                <div v-else-if="operate.taskStatus == 11">
                  <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
                  <a-button type="link" @click="goQrcord(operate, i)">签收</a-button>
                </div>
                <div v-else-if="operate.taskStatus == 12">
                  <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
                  <a-button type="link" @click="lookShipQian(operate, i)">签收信息查询</a-button>
                </div>
                <div v-else>
                  <a-button type="link" @click="getLookMsg(operate, i)">流转单详情</a-button>
                </div>
              </a-space>
            </a-table>
            <!-- 分页 -->
            <div class="bottom-page">
              <a-pagination
                :total="total_j"
                :show-total="total_j => `共 ${total_j} 条`"
                :page-size="pageSize_j"
                :current="currentPage_j"
                @change="pageChange_j"
              />
              <div style="margin: 0 20px">共 {{pageNum_j}} 页</div>
              <div style="margin: 0 10px 0 0">到第</div>
              <a-input-number
                style="width: 50px"
                @keyup.enter.native="pageJump_j(jumpPage_j)"
                v-model="jumpPage_j"
              ></a-input-number>
              <div style="margin: 0 20px 0 10px">页</div>
              <a-button type="primary" @click="pageJump_j(jumpPage_j)">跳转</a-button>
            </div>
          </div>
          <div class="banner3 foot dialogFoot">
            <!-- :disabled="!chooseTime" -->
            <a-button type="danger" @click="JinClose()">暂时关闭</a-button>
          </div>
        </div>
      </a-modal>
      <!-- 打开二维码 goQrcord_dialog -->
      <a-modal v-model="goQrcord_dialog" title="转轮任务签收" :footer="null" width="300px">
        <div v-if="goQrcord_dialog">
          <div style="width: 100%;">
            <vue-qr
              :text="downloadData.url"
              :margin="10"
              colorDark="#000"
              colorLight="#fff"
              :dotScale="1"
              :logoScale="0.2"
              :size="250"
            ></vue-qr>
          </div>
          <div style="width: 100%;text-align: center;">
            <a-button @click="closeTimeMsg8()">关闭</a-button>
          </div>
        </div>
      </a-modal>
      <!-- 签收后信息 lookShipQian_dialog -->
      <a-modal v-model="lookShipQian_dialog" title="签收信息" :footer="null" width="300px">
        <div v-if="lookShipQian_dialog">
          <div style="width: 100%;border: 1px solid #e8e8e8;">
            <shipMsgQian :isShow="true" :id="deliverychoose_id"></shipMsgQian>
          </div>
          <div style="width: 100%;text-align: center;margin-top: 15px;">
            <a-button @click="lookShipQian_dialog = false">关闭</a-button>
          </div>
        </div>
      </a-modal>
      <!-- 包装物料查询 lookBaoQuery_dialog -->
      <a-modal v-model="lookBaoQuery_dialog" title="包装物料查询" :footer="null" width="850px">
        <div v-if="lookBaoQuery_dialog">
          <div>
            <PackagingQuery></PackagingQuery>
          </div>
          <div style="width: 100%;text-align: center;margin-top: 15px;">
            <a-button @click="lookBaoQuery_dialog = false">关闭</a-button>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import store from '@/store/'
// 物料确认
import wuliaoDialog from './wuliaoDialog'
// 出库进度查询
import checkOutDialog from './checkOutDialog'
// 复查任务
import fuchaDialog from './fuchaDialog'
// 复查任务审核签批
import signApproveDialog from './signApproveDialog'
// 包装确认
import baozhuangDialog from './baozhuangDialog'
// 物流信息维护
import wuliuDialog from './wuliuDialog'
import viewDetails from './viewDetails'
import { jnFilterTableMixin } from '@/mixins/jnFilterTable'
import vueQr from 'vue-qr'
import shipMsgQian from '../mobile/shipment/component/ship_msg_qian'
import PackagingQuery from './PackagingQuery'

import {
  getOptions,
  getShipTaskMsgById,
  getShipTaskList,
  getShipTaskListUrgnt,
  editShipTaskaccept,
  editShipTaskaccepts,
  editShipTaskmatter,
  editShipTaskLogistics,
  editShipTaskpacking,
  editShipTaskRetask,
  editShipTaskTakeGoods
} from '@/api/api'
export default {
  name: 'ShipTaskList',
  mixins: [jnFilterTableMixin],
  data() {
    return {
      deliveryVisible_ceshi: false,
      dic: {
        // 表单中的部分数据对应的的数据词典
        taskStatus: [], // 计划状态
        urgentTaskStatus: [] // 紧急任务状态
      },
      searchParams: {
        //
        shippingFlowSheet: '', // 发运流转单号
        wheelShape: '', // 轮型号
        customerOrder: '', // 戴卡订单号
        batchNumber: '', // 样件批次号
        userId: '', // 用户id
        //
        time: [], // 时间选框
        planShipmentDateStart: null, // 计划发运时间开始
        planShipmentDateEnd: null // 计划发运时间结束
      },
      waitingNumber: 1,
      sureBadNumber: 2,
      waitingBadNumber: 3,
      total: 0, // 共多少条
      pageSize: 10, // 一页多少条
      pageNum: 1, // 共多少页
      jumpPage: 1, // 跳转到第几页
      currentPage: 1, // 当前页
      total_j: 0, // 共多少条
      pageSize_j: 5, // 一页多少条
      pageNum_j: 1, // 共多少页
      jumpPage_j: 1, // 跳转到第几页
      currentPage_j: 1, // 当前页
      tableLoading: false,
      deliveryVisible: false, //提货完成弹窗可视化
      deliveryVisible2: false, //提货完成弹窗可视化
      deliveryVisible3: false,
      deliveryVisible4: false,
      deliveryVisible5: false,
      deliveryVisible6: false,
      deliveryVisible7: false,
      JinJidialog: false, //紧急任务弹窗可视化
      menuOpen: false,
      deliverychoose_id: null, // 选择的那个id
      dataSource: [], //表格数据
      dataSource_j: [], //表格数据
      columns: [
        {
          title: '发运流转单号',
          dataIndex: 'shippingFlowSheet',
          key: 'shippingFlowSheet',
          fixed: 'left',
          width: '250px',
          scopedSlots: { customRender: 'shippingFlowSheet' }
        },
        {
          title: '戴卡部件号',
          dataIndex: 'wheelShape',
          key: 'wheelShape',
          align: 'center'
        },
        {
          title: '戴卡订单号',
          dataIndex: 'customerOrder',
          key: 'customerOrder',
          align: 'center'
        },
        {
          title: '样件批次号',
          dataIndex: 'batchNumber',
          key: 'batchNumber',
          align: 'center',
          scopedSlots: { customRender: 'batchNumber' }
        },
        {
          title: '轮型尺寸',
          dataIndex: 'wheelShapeSize',
          key: 'wheelShapeSize',
          align: 'center'
        },
        {
          title: '是否转轮',
          dataIndex: 'isItRunner',
          key: 'isItRunner',
          scopedSlots: { customRender: 'isItRunner' }
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
          key: 'customerName',
          align: 'center'
        },
        {
          title: '计划发运时间',
          dataIndex: 'planShipmentDate',
          key: 'planShipmentDate',
          align: 'center'
        },
        {
          title: '计划复查时间',
          dataIndex: 'planRetestDate',
          key: 'planRetestDate',
          align: 'center',
          scopedSlots: { customRender: 'planRetestDate' }
        },
        {
          title: '发运计划序号',
          dataIndex: 'shipPlanNumber',
          key: 'shipPlanNumber',
          align: 'center',
          scopedSlots: { customRender: 'shipPlanNumber' }
        },
        {
          title: '紧急任务',
          dataIndex: 'urgentTaskStatus_L',
          key: 'urgentTaskStatus_L',
          align: 'center',
          scopedSlots: { customRender: 'urgentTaskStatus' }
        },
        {
          title: '任务状态',
          dataIndex: 'taskStatus_L',
          key: 'taskStatus_L',
          align: 'center'
        },
        {
          title: '过程指令',
          dataIndex: 'shipmentProcessOrderVos',
          key: 'shipmentProcessOrderVos',
          align: 'center',
          scopedSlots: { customRender: 'shipmentProcessOrderVos' }
        },
        // 操作格子
        {
          title: '操作',
          dataIndex: 'operate',
          key: 'operate',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'operate' }
        }
      ],
      columns_j: [
        {
          title: '发运流转单号',
          dataIndex: 'shippingFlowSheet',
          key: 'shippingFlowSheet',
          scopedSlots: { customRender: 'shippingFlowSheet' }
        },
        {
          title: '戴卡部件号',
          dataIndex: 'wheelShape',
          key: 'wheelShape',
          align: 'center'
        },
        {
          title: '样件批次号',
          dataIndex: 'batchNumber',
          key: 'batchNumber',
          align: 'center',
          scopedSlots: { customRender: 'batchNumber' }
        },
        {
          title: '轮型尺寸',
          dataIndex: 'wheelShapeSize',
          key: 'wheelShapeSize',
          align: 'center'
        },
        {
          title: '计划发运时间',
          dataIndex: 'planShipmentDate',
          key: 'planShipmentDate',
          align: 'center'
        },
        {
          title: '任务状态',
          dataIndex: 'taskStatus_L',
          key: 'taskStatus_L',
          align: 'center'
        },
        // 操作格子
        {
          title: '操作',
          dataIndex: 'operate',
          key: 'operate',
          align: 'center',
          scopedSlots: { customRender: 'operate' }
        }
      ],
      rowSelection_list: [],
      rowSelection_key: [],
      pageStatus: '0',
      fiveMinClear: null,
      goQrcord_dialog: false,
      lookShipQian_dialog: false,
      downloadData: {
        url: 'https://www.baidu.com/' //需要转化成二维码的网址
      },
      lookBaoQuery_dialog: false,
    }
  },
  components: {
    wuliaoDialog,
    checkOutDialog,
    fuchaDialog,
    signApproveDialog,
    baozhuangDialog,
    wuliuDialog,
    viewDetails,
    vueQr,
    shipMsgQian,
    PackagingQuery
  },
  //初始化
  mounted() {
    this.getDic() // 获取字典
    var userId = store.getters.userInfo.id
    this.searchParams.userId = userId
    // this.getList()
  },
  beforeDestroy() {
    if (this.fiveMinClear) {
      clearTimeout(this.fiveMinClear)
    }
  },
  methods: {
    // 查询列表
    getList(reset = false) {
      this.tableLoading = true
      this.resertSevent()
      if (reset) {
        // 如果需要重置，比如有了新的筛选条件
        this.currentPage = 1
      }
      let param = {}
      param.userId = this.searchParams.userId
      if (this.searchParams.shippingFlowSheet) {
        param.shippingFlowSheet = this.searchParams.shippingFlowSheet
      }
      if (this.searchParams.wheelShape) {
        param.wheelShape = this.searchParams.wheelShape
      }
      if (this.searchParams.customerOrder) {
        param.customerOrder = this.searchParams.customerOrder
      }
      if (this.searchParams.batchNumber) {
        param.batchNumber = this.searchParams.batchNumber
      }
      if (this.searchParams.customerName) {
        param.customerName = this.searchParams.customerName
      }
      if (this.searchParams.time.length) {
        param.planShipmentDateStart = this.searchParams.planShipmentDateStart
        param.planShipmentDateEnd = this.searchParams.planShipmentDateEnd
      }
      getShipTaskList(param, {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }).then(data => {
        if (data.success) {
          let dataList = data.result
          if (!(dataList.records && dataList.records.length)) {
            this.dataSource = []
            this.total = 0
            this.pageNum = 0
            this.tableLoading = false
          } else {
            for (let i = 0; i < dataList.records.length; i++) {
              // 遍历返回的数据列表
              for (let name in dataList.records[i]) {
                // 列表每行 for 出每个属性
                if (name in this.dic) {
                  // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) {
                    // 遍历该字典，看看有哪些值
                    if (dataList.records[i][name] == this.dic[name][j].value) {
                      // 找到value相等时对应的label
                      dataList.records[i][name + '_L'] = this.dic[name][j].label
                    }
                  }
                }
              }
            }
            // 数据处理
            this.dataSource = dataList.records
            this.total = dataList.total
            this.pageNum = this.getPageNumber(dataList.total)
            this.tableLoading = false
            console.log(this.dataSource)
          }
        } else {
          this.$message.error(data.message)
          this.tableLoading = false
        }
      })
    },
    resertGetList() {
      this.searchParams = {
        //
        shippingFlowSheet: '', // 发运流转单号
        wheelShape: '', // 轮型号
        customerOrder: '', // 戴卡订单号
        batchNumber: '', // 样件批次号
        userId: this.searchParams.userId,
        //
        time: [], // 时间选框
        planShipmentDateStart: null, // 计划发运时间开始
        planShipmentDateEnd: null // 计划发运时间结束
      }
      this.total = 0 // 共多少条
      this.pageSize = 10 // 一页多少条
      this.pageNum = 1 // 共多少页
      this.jumpPage = 1 // 跳转到第几页
      this.currentPage = 1 // 当前页
      this.getList(true)
    },
    getPageNumber(number) {
      if (this.pageSize >= number) {
        return 1
      } else {
        let a = number / this.pageSize
        // 向上取整
        return Math.ceil(a)
      }
    },
    // 分页
    pageChange(val) {
      // 分页改变
      this.currentPage = val
      this.getList()
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
      this.getList()
    },
    getPageNumber_j(number) {
      if (this.pageSize_j >= number) {
        return 1
      } else {
        let a = number / this.pageSize_j
        // 向上取整
        return Math.ceil(a)
      }
    },
    // 分页
    pageChange_j(val) {
      // 分页改变
      this.currentPage_j = val
      this.getList_j()
    },
    pageJump_j(page) {
      // 点击指定分页跳转的情况下
      if (page > this.pageNum_j) {
        page = this.pageNum_j
        this.jumpPage_j = this.pageNum_j
      } else if (page < 1) {
        page = 1
        this.jumpPage_j = 1
      }
      this.currentPagev = page
      this.getList_j()
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
          _this.getList(true)
          _this.getList_j(true)
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
    // ————————————————————————————————
    goDelivery() {
      this.$router.push({
        path: `/sampleLibrary/DeliveryManagement`
      })
    },
    goRecord() {
      this.$router.push({
        path: `/sampleLibrary/PickUpRecord`
      })
    },
    // ——————————————————————————————————————
    // 接受按钮 - 做一个判断，不是待接收的不要走接口了
    acceptubmit() {
      // 弹窗-确认下发
      this.$confirm({
        title: '确认执行接收操作?',
        content: '即将进行接收操作。注：如果您选中的发运单状态不是待接收，该发运单不会进行接收操作',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.tableLoading = true
          let idArr = []
          this.rowSelection_list.forEach(item => {
            if (item.taskStatus == 0) {
              idArr.push(item.shipmentManagementId)
            }
          })
          console.log(idArr)
          if (idArr.length == 1) {
            // 单个
            editShipTaskaccept({
              shipmentManagementId: idArr[0]
            }).then(data => {
              console.log(data)
              if (data.success) {
                this.$message.success('接收' + data.message)
                this.tableLoading = false
                this.getList()
              } else {
                this.$message.error(data.message)
                this.tableLoading = false
              }
            })
          } else if (idArr.length > 1) {
            // 多个
            editShipTaskaccepts({
              shipmentManagementId: idArr
            }).then(data => {
              console.log(data)
              if (data.success) {
                this.$message.success('批量接收' + data.message)
                this.tableLoading = false
                this.getList()
              } else {
                this.$message.error(data.message)
                this.tableLoading = false
              }
            })
          } else {
            this.$message.success('暂无待接收发运单')
            this.tableLoading = false
          }
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    rowSelectiOnSelect(selectedRowKeys) {
      this.rowSelection_list = []
      this.rowSelection_key = []
      this.rowSelection_key = selectedRowKeys
      selectedRowKeys.forEach(item => {
        this.rowSelection_list.push(this.dataSource[item])
      })
    },
    resertSevent() {
      this.rowSelection_list = []
      this.rowSelection_key = []
    },
    // 时间框改变时间
    ontimeChange(data) {
      if (data && data.length) {
        this.searchParams.planShipmentDateStart = data[0]
        this.searchParams.planShipmentDateEnd = data[1]
      } else {
        this.searchParams.planShipmentDateStart = null
        this.searchParams.planShipmentDateEnd = null
      }
    },
    // 查看
    getLookMsg(data, number) {
      this.deliveryVisible2 = false
      console.log('查看')
      this.deliveryVisible2 = true
      // this.pageStatus = Number(data.taskStatus) || 0
      this.pageStatus = data.shippingFlowSheet
      this.deliverychoose_id = data.shipmentManagementId
    },
    // 物料确认
    getTimeMsg(data, number) {
      console.log(data)
      this.deliveryVisible = false
      // 打开弹窗-shipmentManagementId-请求接口-结束后关闭自己，然后请求getlist
      this.deliveryVisible = true
      this.deliverychoose_id = data.shipmentManagementId
    },
    closeTimeMsg() {
      this.deliveryVisible = false
      this.deliverychoose_id = null
      if (this.JinJidialog === true) {
        this.getList_j()
      } else {
        this.getList()
      }
    },
    closeTimeMsg2() {
      this.deliveryVisible2 = false
      this.pageStatus = '0'
      this.deliverychoose_id = null
    },
    // 出库进度查询
    lookCheckOut(data, number) {
      this.deliveryVisible3 = false
      this.deliveryVisible3 = true
      // this.deliverychoose_id = data.shipmentManagementId
      this.deliverychoose_id = data.shippingFlowSheet
    },
    // 物料确认
    getfuchaMsg(data, number) {
      this.deliveryVisible4 = false
      console.log(data)
      // 打开弹窗-shipmentManagementId-请求接口-结束后关闭自己，然后请求getlist
      this.deliveryVisible4 = true
      this.deliverychoose_id = data.shipmentManagementId
    },
    closeTimeMsg4() {
      this.deliveryVisible4 = false
      this.deliverychoose_id = null
      if (this.JinJidialog === true) {
        this.getList_j()
      } else {
        this.getList()
      }
    },
    // 审核这边的打开，以后可能不会看
    goShenhe(data) {
      this.deliveryVisible5 = true
      this.deliverychoose_id = data.shipmentManagementId
    },
    // 包装确认
    getbaozhuangMsg(data, number) {
      this.deliveryVisible6 = false
      this.deliveryVisible6 = true
      this.deliverychoose_id = data.shipmentManagementId
    },
    closeTimeMsg6() {
      this.deliveryVisible6 = false
      this.deliverychoose_id = null
      if (this.JinJidialog === true) {
        this.getList_j()
      } else {
        this.getList()
      }
    },
    // 物流维护
    getwuliuMsg(data, number) {
      this.deliveryVisible7 = false
      this.deliveryVisible7 = true
      this.deliverychoose_id = data.shipmentManagementId
    },
    closeTimeMsg7() {
      this.deliveryVisible7 = false
      this.deliverychoose_id = null
      if (this.JinJidialog === true) {
        this.getList_j()
      } else {
        this.getList()
      }
    },
    JinClose() {
      this.JinJidialog = false
      // 点击暂时关闭后延迟5分钟打开，重复流程
      this.fiveMinSet()
    },
    goLing(data, i) {
      console.log('指令', data)
      console.log(data.shipmentProcessOrderIds)
      this.$router.push({
        path: '/shipment/instructionList',
        query: {
          shipmentProcessOrderIds: data.shipmentProcessOrderIds
        }
      })
      // this.$router.push({
      //   path: `/shipInstructionManage/instructionEditShip`,
      //   query: {
      //     id: row.id,
      //     type: type
      //   }
      // })
    },
    getList_j(reset = false) {
      // this.tableLoading = true
      if (reset) {
        // 如果需要重置，比如有了新的筛选条件
        this.currentPage_j = 1
      }
      let param = {
        userId: this.searchParams.userId,
        pageNo: this.currentPage_j,
        pageSize: this.pageSize_j
      }
      getShipTaskListUrgnt(param).then(data => {
        console.log('紧急任务', data)
        if (data.success) {
          let dataList = data.result
          if (!(dataList.records && dataList.records.length)) {
            this.dataSource_j = []
            // this.tableLoading = false
            this.fiveMinSet()
            // this.JinJidialog = true
          } else {
            for (let i = 0; i < dataList.records.length; i++) {
              // 遍历返回的数据列表
              for (let name in dataList.records[i]) {
                // 列表每行 for 出每个属性
                if (name in this.dic) {
                  // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) {
                    // 遍历该字典，看看有哪些值
                    if (dataList.records[i][name] == this.dic[name][j].value) {
                      // 找到value相等时对应的label
                      dataList.records[i][name + '_L'] = this.dic[name][j].label
                    }
                  }
                }
              }
            }
            // 数据处理
            this.dataSource_j = dataList.records
            this.total_j = dataList.total
            this.pageNum_j = this.getPageNumber(dataList.total)
            this.tableLoading = false
            if (this.dataSource_j.length) {
              // 打开弹窗
              this.JinJidialog = true
            } else {
              // 启动5分钟定时器
              this.fiveMinSet()
            }
          }
        } else {
          this.$message.error(data.message)
          // this.tableLoading = false
          this.fiveMinSet()
        }
      })
    },
    fiveMinSet() {
      if (this.fiveMinClear) {
        clearTimeout(this.fiveMinClear)
      }
      this.fiveMinClear = setTimeout(() => {
        this.getList_j()
      }, 5 * 60 * 1000)
    },
    goQrcord(data, i) {
      this.goQrcord_dialog = false
      this.goQrcord_dialog = true
      this.deliverychoose_id = data.shipmentManagementId
      let test = window.location.href
      let Arr_test = test.split('/shipment/ShipTaskList')
      let bendi = Arr_test[0]
      this.downloadData.url = bendi + '/app/shipment/viewDetails_lun?id=' + data.shipmentManagementId
    },
    closeTimeMsg8() {
      this.goQrcord_dialog = false
      this.deliverychoose_id = null
      if (this.JinJidialog === true) {
        this.getList_j()
      } else {
        this.getList()
      }
    },
    lookShipQian(data, i) {
      this.lookShipQian_dialog = false
      this.lookShipQian_dialog = true
      this.deliverychoose_id = data.shipmentManagementId
    },
    changeDownOrUp() {
      this.menuOpen = !this.menuOpen
    }
  }
}
</script>

<style scoped lang="less">
@import '../../css/public-table-css.less';
.search-frame {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.search-frame-left {
  width: 80%;
  display: flex;
  align-items: center;
}
.item-frame {
  margin-right: 20px;
}
.display-frame {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}
.display-frame-left {
  width: 100%;
  height: 120px;
  border: 1px solid #f2f2f2;
}
.display-title {
  width: 100%;
  height: 50px;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  padding-left: 20px;
}
.span-margin {
  margin-right: 20px;
}
.display-data {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 40px;
}
.bottom-page {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  align-items: center;
}
.table-frame {
  margin-top: 20px;
}
.item-button {
  margin-right: 20px;
}
.banner3 {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

.pageMain {
  // margin: -12px -12px 0 -12px;
  padding: 16px;
  padding-bottom: 0;
}
.page_seach {
  padding: 24px 32px;
  margin-bottom: 16px;
}
.bg_w {
  background: #fff;
}
.bottom-page {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  margin-bottom: 24px;
  align-items: center;
}
.item-button {
  margin-right: 20px;
}
.dialogFoot {
  margin: 0 -24px -24px -24px;
  background: #f5f8fa;
  border-radius: 0 0 4px 4px;
  padding: 15px 24px;
  border-top: 1px solid #e8e8e8;
}
.jinji_show_img {
  margin-bottom: 15px;
  width: 100%;
}
.tmt_0 {
  margin-top: 0;
}
.operate_caozuo {
  /deep/ .ant-btn-link {
    margin: 0 4px;
  }
}
.My_table /deep/ .ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  padding: 11px 16px;
  font-size: 16px;
  text-align: left;
}
.My_table /deep/ .ant-table-tbody > tr > td {
  padding: 3px 16px;
  font-size: 16px;
  text-align: left;
}
.My_table /deep/ .ant-table-tbody > tr {
  height: 40px;
}
.row {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .item-input {
    margin: 0 72px 0 12px;
  }
  .item-input-fold {
    margin: 0 40px 0 10px;
  }
}
.search-container {
  .special-date {
    height: 40px;
    width: 40px;
    span {
      text-decoration: underline;
    }
  }
}
.flex-left {
  display: flex;
  justify-content: flex-start;
}
.button-group {
  display: flex;

  button {
    margin-right: 20px;
  }
}
</style>