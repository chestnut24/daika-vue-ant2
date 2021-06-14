<!--订单信息维护界面 可跳转界面：新建订单、订单详情 glc-->
<template>
  <div class="min-container jn-public-table jn-public-table-other">
    <div style="min-width: 1600px">
      <a-card style="margin-bottom: 16px">
        <!-- 查询区域 -->
        <div class="search-container">
          <a-form layout="inline">
            <div class="row" v-if="!menuOpen">
              <div class="flex-left">
                <div>要求发货日期：</div>
              </div>
              <div class="item-input item-input-fold">
                <a-form-item>
                  <a-range-picker
                    style="width: 244px"
                    :show-time="{ format: 'HH:mm:ss' }"
                    format="YYYY-MM-DD"
                    @change="deliverDateChange"
                    v-model="deliveryDate"
                  ></a-range-picker>
                  <a-radio-group style="margin-left: 12px" v-model="deliveryDateRadio">
                    <a-radio-button value="a" @click="setTime('deliveryDate', 'day')">
                      当日
                    </a-radio-button>
                    <a-radio-button value="b" @click="setTime('deliveryDate', 'week')">
                      本周
                    </a-radio-button>
                    <a-radio-button value="c" @click="setTime('deliveryDate', 'month')">
                      本月
                    </a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </div>
              <div class="flex-left">
                <div>戴卡部件号：</div>
              </div>
              <div class="item-input item-input-fold">
                <a-form-item>
                  <a-input placeholder="请输入戴卡部件号" v-model="queryParam.component"></a-input>
                </a-form-item>
              </div>

              <div class="flex-left">
                <div>客户名称：</div>
              </div>
              <div class="item-input item-input-fold">
                <a-form-item>
                  <a-input placeholder="请输入客户名称" v-model="queryParam.customerName"></a-input>
                </a-form-item>
              </div>

              <div class="button-group">
                <a-button type="link" @click="changeDownOrUp" style="margin-right: 0">
                  展开
                  <a-icon type="down"/>
                </a-button>
                <a-button type="primary" @click="searchQuery(true)">查询</a-button>
                <a-button style="margin: 0" @click="resetParam">重置</a-button>
              </div>
            </div>
            <template v-if="menuOpen">

              <div class="row" style="margin-bottom: 16px">
                <!--            戴卡部件号-->
                <div class="flex-left">
                  <div>戴卡部件号</div>
                </div>
                <div class="item-input">
                  <a-form-item>
                    <a-input placeholder="请输入戴卡部件号" v-model="queryParam.component"></a-input>
                  </a-form-item>
                </div>
                <!--              客户部件号-->
                <div class="flex-left">
                  <div>客户部件号</div>
                </div>
                <div class="item-input">
                  <a-form-item>
                    <a-input placeholder="请输入客户部件号" v-model="queryParam.customerComponentNumber"></a-input>
                  </a-form-item>
                </div>
                <!--              进度-->
                <div class="flex-left">
                  <div>进度：</div>
                </div>
                <div class="item-input">
                  <a-form-item>
                    <a-select
                      placeholder="请选择"
                      v-model="queryParam.progress"
                      style="width: 244px"
                    >
                      <a-select-option v-for="data in option.progress" :key="data.value">
                        {{ data.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
                <!--              订单状态-->
                <div class="flex-left">
                  <div>订单状态：</div>
                </div>
                <div class="item-input">
                  <a-form-item>
                    <a-select

                      placeholder="请选择"
                      v-model="queryParam.orderState"
                      style="width: 244px"
                    >
                      <a-select-option v-for="data in option.orderState" :key="data.value">
                        {{ data.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
              </div>

              <div class="row" style="margin-bottom: 16px">
                <!--              订单日期-->
                <div class="flex-left">
                  <div>订单日期：</div>
                </div>
                <div class="item-input">
                  <!--              <div class="item-input">-->
                  <a-form-item>
                    <a-range-picker
                      style="width: 244px"
                      :show-time="{ format: 'HH:mm:ss' }"
                      format="YYYY-MM-DD"
                      @change="orderDateChange"
                      v-model="orderDate"
                    ></a-range-picker>
                    <a-radio-group style="margin-left: 12px" v-model="orderDateRadio">
                      <a-radio-button value="a" @click="setTime('orderDate', 'day')">
                        当日
                      </a-radio-button>
                      <a-radio-button value="b" @click="setTime('orderDate', 'week')">
                        本周
                      </a-radio-button>
                      <a-radio-button value="c" @click="setTime('orderDate', 'month')">
                        本月
                      </a-radio-button>
                    </a-radio-group>
                  </a-form-item>
                </div>
                <!--              要求发货日期-->
                <div class="flex-left">
                  <div>要求发货日期</div>
                </div>
                <!--              <div class="item-input" style="margin: 0 72px 0 12px">-->
                <div class="item-input">
                  <a-form-item>
                    <a-range-picker
                      style="width: 244px"
                      :show-time="{ format: 'HH:mm:ss' }"
                      format="YYYY-MM-DD"
                      @change="deliverDateChange"
                      v-model="deliveryDate"
                    ></a-range-picker>
                    <a-radio-group style="margin-left: 12px" v-model="deliveryDateRadio">
                      <a-radio-button value="a" @click="setTime('deliveryDate', 'day')">
                        当日
                      </a-radio-button>
                      <a-radio-button value="b" @click="setTime('deliveryDate', 'week')">
                        本周
                      </a-radio-button>
                      <a-radio-button value="c" @click="setTime('deliveryDate', 'month')">
                        本月
                      </a-radio-button>
                    </a-radio-group>
                  </a-form-item>
                </div>
                <!--              客户名称-->
                <div class="flex-left">
                  <div>客户名称：</div>
                </div>
                <!--              <div class="item-input"  style="margin: 0 66px 0 12px">-->
                <div class="item-input">
                  <a-form-item>
                    <a-input placeholder="请输入客户名称" v-model="queryParam.customerName"></a-input>
                  </a-form-item>
                </div>

              </div>
              <div class="row">
                <div class="button-group">
                  <a-button type="link" @click="changeDownOrUp" style="margin-right: 0">
                    收起
                    <a-icon type="up"/>
                  </a-button>
                  <a-button type="primary" @click="searchQuery(true)">查询</a-button>
                  <a-button @click="resetParam">重置</a-button>
                </div>
              </div>
            </template>
          </a-form>
        </div>
      </a-card>
      <a-card :bordered="false">
        <!-- 操作按钮区域 -->
        <div class="button-container">
          <!-- table区域 -->
          <div class="table-title">订单维护列表</div>
          <div class="button-group">
            <a-button v-has="'order:add'" type="primary" icon="plus" @click="buildRecord">新建</a-button>
            <a-button v-has="'order:download'" icon="download" @click="downloadRecord">下载</a-button>
            <a-button v-has="'order:export'" icon="export" @click="exportRecord">导出</a-button>
            <a-button v-has="'order:import'" icon="import" @click="importRecord">导入</a-button>
          </div>
        </div>
        <!-- 分隔线 -->
        <!--      :scroll="{ x: 3550, y: 1000 }"-->
        <a-divider/>
        <a-table
          ref="table"
          size="middle"
          bordered
          :columns="showColumns"
          :dataSource="dataSource"
          :scroll="{x: true}"
          :pagination=false>
          <jnFilterTable ref="jnFilterTable" :columns="columns" :showColumns="showColumns" @showColumnsChange="setShowColumns" slot="filterDropdown"></jnFilterTable>
          <jnFilterIcon  slot="filterIcon"></jnFilterIcon>
          <jnFilterAction slot="action" slot-scope="text, record"></jnFilterAction>
          <div slot="orderDate" slot-scope="text, orderDate, i">{{ text | dayMoment }}</div>
          <div slot="deliveryDate" slot-scope="text, deliveryDate, i">{{ text | dayMoment }}</div>
          <div slot="maintenanceTime" slot-scope="text, maintenanceTime, i">{{ text | dayMoment }}</div>
          <div slot="examinationTime" slot-scope="text, examinationTime, i">{{ text | dayMoment }}</div>
          <div slot="ordersFeedbackState" slot-scope="text, ordersFeedbackState, i">
            <span v-if="text === null">待反馈</span>
            <span v-else>{{ text }}</span>
          </div>
          <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
            <a-button v-has="'order:update'" type="link" :disabled="operate.orderState === '已关闭'" @click="editRow(operate, i)">
              修改
            </a-button>
            <a-button v-has="'order:close'" type="link" :disabled="operate.orderState === '已关闭'" @click="orderClose(operate, i)">
              关闭
            </a-button>
            <a-button v-has="'order:check'" type="link" @click="queryDetail(operate, i)">查看</a-button>
            <!--          订单反馈状态：已超期、已反馈  订单状态：已关闭-->
            <a-button v-has="'order:feedBack'" type="link"
                      :disabled="(operate.ordersFeedbackState === '已超期' || operate.ordersFeedbackState === '已反馈' || operate.orderState === '已关闭')"
                      @click="customerFeedback(operate, i)">客户反馈
            </a-button>
            <!--          <a-button type="link" :disabled="operate.orderState!=='待审批'" @click="clickAudit(operate, i)">-->
            <!--            审批-->
            <!--          </a-button>-->
          </a-space>
        </a-table>
        <!--    分页-->
        <div class="bottom-page">
          <a-pagination
            :total=page.total
            :show-total="total => `共 ${total} 条`"
            :page-size=page.pageSize
            :current="page.currentPage"
            @change="pageChange"
          />
          <div style="margin: 0 20px">共 {{page.pageNum}} 页</div>
          <div style="margin: 0 10px 0 0">到第</div>
          <a-input-number style="width: 50px" @keyup.enter.native="pageJump(page.jumpPage)"
                          v-model="page.jumpPage"></a-input-number>
          <div style="margin: 0 20px 0 10px">页</div>
          <a-button type="primary" @click="pageJump(page.jumpPage)">跳转</a-button>
        </div>
      </a-card>
    </div>

    <!--    关闭-->
    <a-modal
      v-model:visible="closeVisible"
      title="确认关闭"
      ok-text="确认"
      cancel-text="取消"
      @ok="orderCloseSure"
      @cancel="orderCloseCancel"
    >
      <p>是否确定关闭此订单？</p>
    </a-modal>

    <!--    客户反馈-->
    <a-modal
      :visible="feedbackVisible"
      title="客户反馈"
      width="600px"
      @ok="feedbackSure"
      @cancel="feedbackCancel">
      <a-row type="flex" align="middle" :gutter="[0,24]">
        <a-col :md="4" :sm="8">反馈类型</a-col>
        <a-col :md="4" :sm="8">
          <a-select
            placeholder="请选择"
            v-model="feedbackPost.ordersFeedbackType"
            style="width: 200px"
          >
            <a-select-option v-for="data in dic.ordersFeedbackType" :key="data.value">
              {{ data.label }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row type="flex" align="middle" :gutter="[0,24]">
        <a-col :md="4" :sm="8">反馈内容</a-col>
        <a-col :md="18" :sm="8">
          <a-textarea :disabled="feedbackPost.ordersFeedbackType ? false : true"
                      v-model:value="feedbackPost.ordersFeedbackMessage" placeholder="请输入反馈内容"
                      style="width: 100%" :rows="4"/>
        </a-col>
      </a-row>
      <a-row type="flex" align="middle" :gutter="[0,24]">
        <a-col :md="4" :sm="8">文件上传</a-col>
        <a-col :md="18" :sm="8">
          <!--          <a-upload v-model:file-list="feedbackPost.fileUrl"-->
          <!--                    :customRequest="getUploadUrl"-->
          <!--                    :multiple="true"-->
          <!--                    ref="uploadRef">-->
          <!--            <a-button icon="upload">-->
          <!--              上传-->
          <!--            </a-button>-->
          <!--          </a-upload>-->

          <!--          <a-upload-dragger v-model:file-list="feedbackPost.fileUrl"-->
          <!--                    :customRequest="getUploadUrl"-->
          <!--                    :multiple="true"-->
          <!--                    ref="uploadRef">-->
          <!--            <p class="ant-upload-drag-icon">-->
          <!--              <a-icon type="inbox" />-->
          <!--            </p>-->
          <!--            <p class="ant-upload-text">-->
          <!--              点击或将文件拖拽到这里上传-->
          <!--            </p>-->
          <!--            <p class="ant-upload-hint">-->
          <!--              支持扩展名：.xls  xlsx-->
          <!--            </p>-->
          <!--          </a-upload-dragger>-->

          <a-upload-dragger
            :file-list="fileList"
            :customRequest="getUploadUrl"
            :multiple="true"
            ref="uploadRef">
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox"/>
            </p>
            <p class="ant-upload-text">
              点击或将文件拖拽到这里上传
            </p>
<!--            <p class="ant-upload-hint">-->
<!--              支持扩展名：.xls xlsx-->
<!--            </p>-->
          </a-upload-dragger>
        </a-col>
      </a-row>

      <template slot="footer">

<!--        <a-button @click="test">test</a-button>-->
        <a-spin :spinning="spinning">
          <a-button @click="feedbackCancel" style="margin-right: 20px">返回
          </a-button>
          <a-button :disabled="feedbackPost.ordersFeedbackMessage === ''" type="primary"
                    @click="feedbackSure">提交
          </a-button>
        </a-spin>
      </template>
    </a-modal>

    <!--    审批-->
    <!--    <a-modal-->
    <!--      @cancel="auditCancel"-->
    <!--      :visible="auditVisible"-->
    <!--      title="订单审批"-->
    <!--      width="800px">-->
    <!--      <a-table-->
    <!--        :dataSource="auditDataSource"-->
    <!--        :columns="auditColumns"-->
    <!--        bordered-->
    <!--        :pagination=false-->
    <!--        :scroll="{ x: 900, y: 1000 }"-->
    <!--      >-->
    <!--        &lt;!&ndash;        auditOperate&ndash;&gt;-->
    <!--        <template slot="auditOperate" slot-scope="text, operate, i">-->
    <!--          <a-button type="link" @click="queryDetail(operate, i)">-->
    <!--            {{ text }}-->
    <!--          </a-button>-->
    <!--        </template>-->
    <!--      </a-table>-->
    <!--      <div class="radio-group">-->
    <!--        <div class="audit-title">处理指令</div>-->
    <!--        <a-radio-group @change="handelAuditChange('adopt')" v-model:value="auditOrder" button-style="solid"-->
    <!--                       size="large">-->
    <!--          <a-radio-button v-for="(item, index) in dic.processingInstruction" :key="index" :value="item.value">-->
    <!--            {{item.label}}-->
    <!--          </a-radio-button>-->
    <!--        </a-radio-group>-->

    <!--        <div class="audit-title">驳回说明</div>-->
    <!--        <a-textarea @change="handelAuditChange('reject')" v-model:value="auditRejectReason" placeholder="请输入驳回说明"-->
    <!--                    style="width: 100%" :rows="4"/>-->
    <!--      </div>-->
    <!--      <template slot="footer">-->
    <!--        <div class="auditFooter">-->
    <!--          <a-button :disabled="auditOrder === 0" type="primary" @click="auditAdoptOrReject('adopt')"-->
    <!--                    style="margin-right: 20px">通过-->
    <!--          </a-button>-->
    <!--          <a-button :disabled="auditRejectReason === ''" type="primary"-->
    <!--                    @click="auditAdoptOrReject('reject')">驳回-->
    <!--          </a-button>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </a-modal>-->

    <OrderAudit ref="audit" v-on:get-text="searchQuery"></OrderAudit>
  </div>
</template>

<script>
  import {
    getOrderInformation,
    getOptions,
    addAudit,
    getOrderById,
    addCustomer,
    closeOrder,
    uploadAuditFile,
  } from '@/api/api';
  import { uploadAction } from '@/api/manage';
  import OrderAudit from './OrderAudit';
  import { jnFilterTableMixin } from '@/mixins/jnFilterTable'

  export default {
    name: 'OrderInformationMaintenance',
    components: { OrderAudit },
    mixins: [jnFilterTableMixin],
    data() {
      return {
        spinning: false,

        deliveryDate: [], // 要求发货日期 用于绑定model清空
        orderDate: [], // 订单日期 用于绑定model清空

        // 字典
        option: { // 下拉选项
          progress: [], // 进度
          orderState: [], // 订单状态
        },
        dic: { // 表单中的部分数据对应的的数据词典
          noun: [], // 用途
          packaging: [], // 包装方式
          progress: [], // 进度
          orderState: [], // 订单状态
          processingInstruction: [], // 处理指令
          ordersFeedbackType: [], // 客户反馈类型
          ordersFeedbackState: [], // 客户反馈状态
        },
        // 请求参数
        queryParam: {
          deliveryDateS: '', // 要求发货开始日期
          deliveryDateE: '', // 要求发货结束日期
          component: '', // 戴卡项目号
          customerComponentNumber: '', // 客户部件号
          orderDateS: '', // 订单开始日期
          orderDateE: '', // 订单结束日期
          progress: undefined, // 进度
          orderState: undefined, // 订单状态
          customerName: '', // 客户名称
        },

        deliveryDateRadio: '',// 交付日期选择
        orderDateRadio: '',// 订单日期选择
        menuOpen: false, //

        // 分页
        page: { // 分页
          total: 0, // 共多少条
          pageSize: 10, // 一页多少条
          pageNum: 0, // 共多少页
          currentPage: 1, // 当前页
          jumpPage: 1, // 跳转到第几页,
        },
        columns: [ // 表头
          // { title: '订单日期', dataIndex: 'orderDate', width: 150, align: 'center', scopedSlots: { customRender: 'orderDate' } },
          // { title: '戴卡订单号', dataIndex: 'dkOrdersNumber', width: 300, align: 'center' },
          // { title: '客户订单号', dataIndex: 'customerOrder', width: 200, align: 'center' },
          // { title: '戴卡部件号', dataIndex: 'component', width: 150, align: 'center' },
          // { title: '客户部件号', dataIndex: 'customerComponentNumber', width: 150, align: 'center' },
          // { title: '客户名称', dataIndex: 'customerName', width: 200, align: 'center' },
          // { title: '项目经理', dataIndex: 'projectManager', width: 150, align: 'center' },
          // { title: '订单数量', dataIndex: 'orderNumber', width: 150, align: 'center' },
          // { title: '用途', dataIndex: 'noun', width: 150, align: 'center' },
          // { title: '包装方式', dataIndex: 'packaging', width: 150, align: 'center' },
          // { title: '要求发货日期', dataIndex: 'deliveryDate', width: 150, align: 'center', scopedSlots: { customRender: 'deliveryDate' }  },
          // { title: '待查库存', dataIndex: 'inventory', width: 150, align: 'center' },
          // { title: '进度', dataIndex: 'progress', width: 150, align: 'center' },
          // { title: '订单状态', dataIndex: 'orderState', width: 150, align: 'center' },
          // { title: '处理指令', dataIndex: 'processingInstruction', width: 200, align: 'center' },
          // { title: '客户反馈状态', dataIndex: 'ordersFeedbackState', width: 150, align: 'center', scopedSlots: { customRender: 'ordersFeedbackState' } },
          // { title: '维护人', dataIndex: 'maintenanceName', width: 150, align: 'center' },
          // { title: '维护时间', dataIndex: 'maintenanceTime', width: 150, align: 'center', scopedSlots: { customRender: 'maintenanceTime' }  },
          // { title: '审批人', dataIndex: 'examinationName', width: 150, align: 'center' },
          // { title: '审批时间', dataIndex: 'examinationTime', width: 150, align: 'center', scopedSlots: { customRender: 'examinationTime' }  },
          { title: '订单日期', dataIndex: 'orderDate', align: 'left', scopedSlots: { customRender: 'orderDate' } },
          { title: '戴卡订单号', dataIndex: 'dkOrdersNumber', align: 'left' },
          { title: '客户订单号', dataIndex: 'customerOrder', align: 'left' },
          { title: '戴卡部件号', dataIndex: 'component', align: 'left' },
          { title: '客户部件号', dataIndex: 'customerComponentNumber', align: 'left' },
          { title: '客户名称', dataIndex: 'customerName', align: 'left' },
          { title: '项目经理', dataIndex: 'projectManager', align: 'left' },
          { title: '订单数量', dataIndex: 'orderNumber', align: 'left' },
          { title: '用途', dataIndex: 'noun', align: 'left' },
          { title: '包装方式', dataIndex: 'packaging', align: 'left' },
          { title: '要求发货日期', dataIndex: 'deliveryDate', align: 'left', scopedSlots: { customRender: 'deliveryDate' }  },
          { title: '待查库存', dataIndex: 'inventory', align: 'left' },
          { title: '进度', dataIndex: 'progress', align: 'left' },
          { title: '订单状态', dataIndex: 'orderState', align: 'left' },
          { title: '处理指令', dataIndex: 'processingInstruction', align: 'left' },
          { title: '客户反馈状态', dataIndex: 'ordersFeedbackState', align: 'left', scopedSlots: { customRender: 'ordersFeedbackState' } },
          { title: '维护人', dataIndex: 'maintenanceName', align: 'left' },
          { title: '维护时间', dataIndex: 'maintenanceTime', align: 'left', scopedSlots: { customRender: 'maintenanceTime' }  },
          { title: '审批人', dataIndex: 'examinationName', align: 'left' },
          { title: '审批时间', dataIndex: 'examinationTime', align: 'left', scopedSlots: { customRender: 'examinationTime' }  },
          {
            title: '操作',
            dataIndex: 'operate',
            width: 250,
            align: 'center',
            fixed: 'right',
            scopedSlots: { customRender: 'operate' },
          },
        ],
        dataSource: [], // 数据

        // 关闭
        closeVisible: false, // 关闭弹窗可视化

        // 客户反馈 弹窗
        feedbackVisible: false, // 客户反馈可视化
        feedbackPost: { // 客户反馈提交的内容
          id: 0,
          fileUrl: '',
          ordersFeedbackMessage: '',
          ordersFeedbackType: undefined,
        },
        fileList: [],
        feedbackFileList: [], // 提交反馈文件弹窗

        // 审批弹窗
        auditVisible: false, // 审批弹窗可视化
        auditColumns: [ // 表头
          { title: '订单日期', dataIndex: 'orderDate', width: 150, align: 'center' },
          {
            title: '戴卡订单号',
            dataIndex: 'dkOrdersNumber',
            width: 250,
            align: 'center',
            scopedSlots: { customRender: 'auditOperate' },
          },
          { title: '客户订单号', dataIndex: 'customerOrder', width: 150, align: 'center' },
          { title: '戴卡部件号', dataIndex: 'component', width: 150, align: 'center' },
          { title: '客户部件号', dataIndex: 'customerComponentNumber', width: 150, align: 'center' },
          { title: '客户名称', dataIndex: 'customerName', width: 150, align: 'center' },
          { title: '订单数量', dataIndex: 'orderNumber', width: 150, align: 'center' },
          { title: '要求发货日期', dataIndex: 'deliveryDate', width: 150, align: 'center' },
          { title: '包装方式', dataIndex: 'packaging', width: 150, align: 'center' },
        ],
        auditDataSource: [], // 数据
        auditOrder: 0, // 处理指令 processing_instruction 字典获取
        auditRejectReason: '', // 审批-驳回说明

        selectId: 0, // 选中行的id
      };

    },

    mounted() {
      this.getAppointOption(); // 获取下拉框
      this.getDic(); // 获取字典

      this.$nextTick(() => {
        this.searchQuery(); // 获取列表信息
      });
    },

    methods: {
      test() {
        console.log('new file', this.fileList);
      },

      searchQuery(reset = false) { // 查询信息列表 reset代表是否重置页码
        if (reset) { // 如果需要重置，比如有了新的筛选条件
          this.page.currentPage = 1;
        }
        let param = this.queryParam;
        param.pageNo = this.page.currentPage; // 当前页码
        param.pageSize = this.page.pageSize; // 页大小

        getOrderInformation(param).then((data) => {
          data = data.result;
          if (!data.records.length) {
            this.dataSource = [];
          } else {
            data.records = this.dataToDic(data.records);
            this.dataSource = data.records;
            this.page.total = data.total;
            this.page.pageSize = data.size;
            this.page.pageNum = data.pages;
          }
        });
      },
      changeDownOrUp() {
        this.menuOpen = !this.menuOpen;
      },

      dataToDic(data) { // 将数据中的字段改为字典
        for (let i = 0; i < data.length; i++) { // 遍历返回的数据列表
          for (let name in data[i]) { // 列表每行 for 出每个属性
            if (name in this.dic) { // 如果该属性在字典里
              for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                if (Number(data[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                  data[i][name] = this.dic[name][j].label;
                }
              }
            }
          }
        }
        return data;
      },

      setTime(name, type) { // 快速确定时间，本日 本周 本月
        if (name === 'deliveryDate') {
          this.deliveryDate = this.returnDateByType(type);
          this.queryParam.deliveryDateS = this.returnDateByType(type)[0];
          this.queryParam.deliveryDateE = this.returnDateByType(type)[1];
        } else if (name === 'orderDate') {
          this.orderDate = this.returnDateByType(type);
          this.queryParam.orderDateS = this.returnDateByType(type)[0];
          this.queryParam.orderDateE = this.returnDateByType(type)[1];
        }
      },

      returnDateByType(type) {
        let now = new Date(); // 当前日期
        let nowDayOfWeek = now.getDay(); // 今天本周的第几天
        let nowDay = now.getDate(); // 当前日
        let nowMonth = now.getMonth(); // 当前月
        let nowYear = now.getFullYear(); // 当前年
        switch (type) {
          case 'day' :
            return [this.formatDate(now, 'before'), this.formatDate(now, 'after')];
          case 'week' :
            let day = nowDayOfWeek || 7;
            return [this.formatDate(new Date(nowYear, nowMonth, nowDay + 1 - day), 'before'), this.formatDate(now, 'after')];
          case 'month' :
            let monthStartDate = new Date(nowYear, nowMonth, 1);
            return [this.formatDate(monthStartDate, 'before'), this.formatDate(now, 'after')];
        }
      },

      formatDate(date, position) {
        let myYear = date.getFullYear();
        let myMonth = date.getMonth() + 1;
        let myWeekday = date.getDate();
        let myHour = date.getHours();
        let myMinute = date.getMinutes();
        let mySecond = date.getSeconds();

        if (myMonth < 10) {
          myMonth = '0' + myMonth;
        }
        if (myWeekday < 10) {
          myWeekday = '0' + myWeekday;
        }
        if (myHour < 10) {
          myHour = '0' + myHour;
        }
        if (myMinute < 10) {
          myMinute = '0' + myMinute;
        }
        if (mySecond < 10) {
          mySecond = '0' + mySecond;
        }
        if (position === 'before') {
          return (`${myYear}-${myMonth}-${myWeekday} 00:00:00`);
        } else if (position === 'after') {
          return (`${myYear}-${myMonth}-${myWeekday} ${myHour}:${myMinute}:${mySecond}`);
        }
      },

      getAppointOption() { // 获取指定的下拉框
        for (let name in this.option) {
          let searchName = this.humpOrLine(name, 'toLine');
          getOptions(searchName, '').then((data) => {
            this.option[name] = data;
          });
        }
      },

      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          getOptions(searchName, '').then((data) => {
            this.dic[name] = data;
          });
        }
      },

      deliverDateChange(value, dateString) { // 要求发货时间改变
        this.queryParam.deliveryDateS = value[0].format('YYYY-MM-DD 00:00:00');
        this.queryParam.deliveryDateE = value[1].format('YYYY-MM-DD 23:59:59');
      },

      orderDateChange(value, dateString) { // 订单时间改变
        this.queryParam.orderDateS = value[0].format('YYYY-MM-DD 00:00:00');
        this.queryParam.orderDateE = value[1].format('YYYY-MM-DD 23:59:59') ;
      },

      pageChange(val) { // 分页改变
        // console.log(val);
        this.page.currentPage = val;
        this.searchQuery();
      },

      pageJump(page) { // 点击指定分页跳转的情况下
        if (page > this.page.pageNum) {
          page = this.page.pageNum;
          this.page.jumpPage = this.page.pageNum;
        } else if (page < 1) {
          page = 1;
          this.page.jumpPage = 1;
        }
        this.page.currentPage = page;
        this.searchQuery();
      },

      buildRecord() { // 新建
        console.log('新建');
        this.$router.push(
          { path: `/order/orderNew` },
        );
      },

      downloadRecord() { // 下载
        console.log('下载');
      },

      exportRecord() { // 导出
        console.log('导出');
      },

      importRecord() { // 导入
        console.log('导入');
        this.test();
      },

      resetParam() { // 重置
        this.deliveryDateRadio = '';
        this.orderDateRadio = '';
        this.orderDate = [];
        this.deliveryDate = [];
        this.queryParam = {
          deliveryDateE: '', // 要求发货结束日期
          deliveryDateS: '', // 要求发货开始日期
          component: '', // 戴卡项目号
          customerComponentNumber: '', // 客户部件号
          orderDateE: '', // 订单结束日期
          orderDateS: '', // 订单开始日期
          progress: undefined, // 进度
          orderState: undefined, // 订单状态
          customerName: '', // 客户名称
        };
        console.log(this.queryParam);
      },

      editRow(operate, i) { // 编辑
        this.$router.push({
            path: `/order/orderNew`,
            query: {
              id: operate.id,
            },
          },
        );
      },

      queryDetail(operate, i) { // 查询详情
        this.$router.push({
          path: `/order/orderDetail`,
          query: {
            id: operate.id,
          },
        });
      },

      // 关闭
      orderClose(operate, i) {
        this.selectId = operate.id;
        this.closeVisible = true;
        this.searchQuery();
      },

      orderCloseSure() {
        closeOrder({ id: this.selectId }).then((data) => {
          if (data.success) {
            this.$message.success('关闭成功！');
            this.selectId = 0;
            this.closeVisible = false;
            this.searchQuery();
          } else {
            this.$message.error(data.message);
          }
        });
      },

      orderCloseCancel() {
        this.closeVisible = false;
        this.selectId = 0;
      },


      // 客户反馈
      customerFeedback(operate, i) { // 客户反馈 点击
        this.feedbackVisible = true;
        this.selectId = operate.id;
      },

      feedbackSure() { // 提交反馈
        // let fileList = this.$refs.uploadRef.sFileList;
        // if (fileList.length !== 0) {
        //   let str = '';
        //   for (let i = 0; i < fileList.length; i++) {
        //     str += fileList[i].response.result.fileUrl;
        //     if (i < fileList.length - 1) {
        //       str += ';';
        //     }
        //   }
        //   this.feedbackPost.fileUrl = str;
        // }
        this.spinning = true;
        let str = '';
        for (let i = 0; i < this.fileList.length; i++) {
          str += this.fileList[i].imgUrl;
          if (i < this.fileList.length - 1) {
            str += ';';
          }
        }
        this.feedbackPost.fileUrl = str;

        this.feedbackPost.id = this.selectId;
        addCustomer(this.feedbackPost).then((data) => {
          this.spinning = false;
          console.log('feedback', data);
          if (data.success) {
            this.$message.success('反馈提交成功！');
            this.selectId = 0;
            this.feedbackPost = { // 客户反馈提交的内容
              id: 0,
              fileUrl: '',
              ordersFeedbackMessage: '',
              ordersFeedbackType: undefined,
            };
            this.fileList = [];

            this.searchQuery();
            this.feedbackVisible = false;
          } else {
            this.$message.error(data.message);
          }
        });
      },

      feedbackCancel() { // 取消反馈
        this.feedbackPost = { // 客户反馈提交的内容
          id: 0,
          fileUrl: '',
          ordersFeedbackMessage: '',
          ordersFeedbackType: undefined,
        };
        this.fileList = [];

        this.selectId = 0;
        this.feedbackVisible = false;
      },

      getUploadUrl(file) { // 上传文件
        const newFile = new FormData();
        newFile.append('file', file.file);
        uploadAction(window._CONFIG['domianURL'] + 'api/addFileCustomer', newFile).then((data) => {
          if (data.success) {
            file.file.imgUrl  = data.result.fileUrl;
            this.fileList.push(file.file);
          } else {
            this.$message.error(data.message);
          }
        });
        // return true;
      },

      humpOrLine(name, type) { // 驼峰式转下划线 toLine  下划线转驼峰式 toHump
        if (type === 'toLine') {
          return name.replace(/([A-Z])/g, '_$1').toLowerCase();
        } else if (type === 'toHump') {
          return name.replace(/\_(\w)/g, function(all, letter) {
            return letter.toUpperCase();
          });
        }
      },

      // 审批

      clickAudit(operate) { // 审批 点击
        // this.auditVisible = true;
        // this.selectId = operate.id;
        this.$refs.audit.clickAudit(operate.id);
        // getOrderById({ id: operate.id }).then((data) => {
        //   // this.dataToDic(data.result);
        //   // this.auditDataSource = [data.result];
        //   this.auditDataSource = this.dataToDic([data.result]);
        // });
      },

      clickCancelAudit(isQuery) { // isQuery 是否重新获取值 取消时不获取，审批后重新获取
        this.auditVisible = false;
        if (isQuery) this.searchQuery();
      },

      auditAdoptOrReject(state) { // 通过/驳回审批
        // orderState 通过2 驳回3
        let param = { id: this.selectId };
        if (state === 'adopt') {
          param.orderState = 2;
          param.processingInstruction = this.auditOrder;
        } else if (state === 'reject') {
          param.orderState = 3;
          param.rejectMessage = this.auditRejectReason;
        }
        addAudit(param).then((data) => {
          console.log('audit', data);
          if (data.success) {
            this.$message.success(state === 'adopt' ? '审批通过成功！' : '审批驳回成功');
            this.selectId = 0;
            this.auditOrder = 0;
            this.auditRejectReason = '';
            this.searchQuery();
            this.auditVisible = false;
          } else {
            this.$message.error(data.message);
          }
        });
      },


      auditCancel() { // 取消审批
        this.auditVisible = false;
        this.selectId = 0;
        this.auditOrder = 0;
        this.auditRejectReason = '';
        this.searchQuery();
        this.auditVisible = false;
      },

      handelAuditChange(operate) {
        if (operate === 'adopt') {
          this.auditRejectReason = '';
        } else if (operate === 'reject') {
          this.auditOrder = 0;
        }
      },

    },
  };
</script>

<style lang="less" scoped>
  @import "./../../css/public-table-css";

  /*/deep/ .ant-table-column-has-actions {*/
  /*  padding: 8px 16px!important;*/
  /*}*/
  /*.operate-row {*/
  /*  .ant-btn {*/
  /*    padding: 0;*/
  /*    margin: 0;*/
  /*    height: 10px;*/
  /*  }*/
  /*}*/

  .min-container {
    overflow-x: auto;

    /deep/ .ant-card-body {
      padding: 24px;
    }
  }


  /deep/ .ant-card-body {
    padding: 24px 32px;
  }


  .ant-input {
    width: 244px;
  }

  .row {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .item-input {
      margin: 0 auto 0 12px;
      &:last-child{
        margin: 0 10px 0 12px;
      }
    }
    .item-input-fold {
      margin: 0 auto 0 10px;
      &:last-child{
        margin: 0 10px 0 12px;
      }
    }
  }

  /*.ant-form-item {*/
  /*  margin: 0;*/
  /*}*/

  .search-container {
    /*margin: 24px 32px;*/

    .special-date {
      height: 40px;
      width: 40px;

      span {
        text-decoration: underline;
      }
    }
  }

  .button-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    width: 100%;
    /*margin-top: 10px;*/
  }

  .button-group {
    display: flex;
    /*margin-right: 100px;*/

    button {
      margin-right: 8px;
    }
  }

  .table-title {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    /*margin-bottom: 20px;*/
  }

  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }



  .flex-left {
    display: flex;
    justify-content: flex-start;
  }

  /*审批*/
  .radio-group {
    margin: 20px;

    .audit-title {
      font-size: 18px;
      font-weight: bold;
      margin: 20px 0;
    }
  }

  .auditFooter {
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }
</style>