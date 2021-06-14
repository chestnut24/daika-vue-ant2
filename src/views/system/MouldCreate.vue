<template>
  <div>
    <a-card style="margin-bottom: 24px">
        <div class="mould-frame-up-hide" v-if="showHideItem">
          <a-row class="row">
            <div class="margin-item">
              <div class="item-flex">
                <span style="font-size: 14px;margin-right: 12px; ">要求交付日期:</span>
                <a-range-picker
                  v-model:value="deliverPicker"
                  :show-time="{ format: 'HH:mm' }"
                  format="YYYY-MM-DD"
                  :placeholder="['开始日期', '结束日期']"
                  @change="deliverOnChange"
                  @ok="deliverOnOk"
                  style="width: 244px;height: 32px;"
                />
                <a-radio-group @change="deliveryDateOnChange" style="margin-left: 12px" v-model="deliveryDateRadio">
                  <a-radio-button value="a">
                    当日
                  </a-radio-button>
                  <a-radio-button value="b">
                    本周
                  </a-radio-button>
                  <a-radio-button value="c">
                    本月
                  </a-radio-button>
                </a-radio-group>
              </div>
            </div>
            <div class="margin-item">
              <div class="item-flex">
                <span style="font-size: 14px;margin-right: 12px; ">模号:</span>
                <a-input v-model:value="moldNumber" placeholder="请输入模号" style="width: 244px;height: 32px;"/>
              </div>
            </div>
            <div style="margin-right: 65px">
              <div class="item-flex">
                <span style="font-size: 14px;margin-right: 12px; ">使用单位:</span>
                <a-input v-model:value="department" placeholder="请输入使用单位" style="width: 244px;height: 32px;"/>
              </div>
            </div>
            <div >
              <a-button type="link" @click="showDown">
                展示<a-icon type="down" />
              </a-button>
              <a-button type="primary" class="buttonMargin" @click="searchMould()">查询</a-button>
              <a-button class="buttonMargin" @click="resetSearch()">重置</a-button>
            </div>
          </a-row>
        </div>
        <div class="mould-frame-up" v-if="!showHideItem">
          <a-row class="row">
            <div class="margin-item">
              <div class="item-flex">
                <span style="font-size: 14px;margin-right: 12px; ">戴卡部件号:</span>
                <a-input v-model:value="partNumber" placeholder="请输入戴卡部件号" style="width: 244px;height: 32px;"/>
              </div>
            </div>
            <div class="margin-item">
              <div class="item-flex">
                <span style="font-size: 14px;margin-right: 12px; ">模具制作类型:</span>
                <a-input v-model:value="MoldType" placeholder="请输入模具制作类型" style="width: 244px;height: 32px;" />
              </div>
            </div>
            <div class="margin-item">
              <div class="item-flex">
                <span style="font-size: 14px;margin-right: 12px; ">模号:</span>
                <a-input v-model:value="moldNumber" placeholder="请输入模号" style="width: 244px;height: 32px;"/>
              </div>
            </div>
            <div>
              <div class="item-flex">
                <span style="font-size: 14px;margin-right: 12px; ">使用单位:</span>
                <a-input v-model:value="department" placeholder="请输入使用单位" style="width: 244px;height: 32px;"/>
              </div>
            </div>
          </a-row>
          <a-row class="row">
            <div class="margin-item">
              <div class="item-flex">
                <span style="font-size: 14px;margin-right: 12px  " >要求交付日期:</span>
                <a-range-picker
                  v-model:value="deliverPicker"
                  :show-time="{ format: 'HH:mm' }"
                  format="YYYY-MM-DD"
                  :placeholder="['开始日期', '结束日期']"
                  @change="deliverOnChange"
                  @ok="deliverOnOk"
                  style="width: 244px;height: 32px;"
                />
                <a-radio-group @change="deliveryDateOnChange" style="margin-left: 12px" v-model="deliveryDateRadio">
                  <a-radio-button value="a">
                    当日
                  </a-radio-button>
                  <a-radio-button value="b">
                    本周
                  </a-radio-button>
                  <a-radio-button value="c">
                    本月
                  </a-radio-button>
                </a-radio-group>
              </div>
            </div>
            <div class="margin-item">
              <div class="item-flex">
                <span style="font-size: 14px;margin-right: 12px">模具合格日期:</span>
                <a-range-picker
                  v-model:value="qualifiedPicker"
                  :show-time="{ format: 'HH:mm:ss' }"
                  format="YYYY-MM-DD"
                  :placeholder="['开始日期', '结束日期']"
                  @change="qualifiedOnChange"
                  @ok="qualifiedOnOk"
                  style="width: 244px;height: 32px;"
                />
                <a-radio-group @change="qualifiedDateOnChange" style="margin-left: 12px" v-model="qualifiedDateRadio">
                  <a-radio-button value="a">
                    当日
                  </a-radio-button>
                  <a-radio-button value="b">
                    本周
                  </a-radio-button>
                  <a-radio-button value="c">
                    本月
                  </a-radio-button>
                </a-radio-group>
              </div>
            </div>
          </a-row>
          <a-row class="row">
            <div class="margin-item">
              <div class="item-flex">
                <span style="font-size: 14px;margin-right: 12px ">协调日期:</span>
                <a-range-picker
                  v-model:value="coordinatePicker"
                  :show-time="{ format: 'HH:mm' }"
                  format="YYYY-MM-DD"
                  :placeholder="['开始日期', '结束日期']"
                  @change="coordinateOnChange"
                  @ok="coordinateOnOk"
                  style="width: 244px;height: 32px;"
                />
                <a-radio-group @change="coordinateDateOnChange" style="margin-left: 12px" v-model="coordinateDateRadio">
                  <a-radio-button value="a">
                    当日
                  </a-radio-button>
                  <a-radio-button value="b">
                    本周
                  </a-radio-button>
                  <a-radio-button value="c">
                    本月
                  </a-radio-button>
                </a-radio-group>
              </div>
            </div>
            <a-col :span="10">
              <a-button type="link" @click="showUp">
                收起<a-icon type="up" />
              </a-button>
              <a-button type="primary" class="buttonMargin" @click="searchMould()">查询</a-button>
              <a-button class="buttonMargin" @click="resetSearch()">重置</a-button>
            </a-col>
          </a-row>
        </div>
    </a-card>
    <a-card>
        <div class="table-title">
          <p style="font-size: 18px;"><b>模具制造维护列表</b></p>
          <div class="table-title-button-frame">
            <a-button v-has="'mouldMaintain:add'" type="primary" icon="plus" class="buttonMargin" @click="openNew()">新建</a-button>
            <a-button v-has="'mouldMaintain:download'" icon="download" class="buttonMargin" @click="downLoad">下载</a-button>
            <a-button v-has="'mouldMaintain:export'" icon="export" class="buttonMargin">导出</a-button>
            <a-button v-has="'mouldMaintain:import'" icon="import" class="buttonMargin" @click="importOpen">导入</a-button>
          </div>
        </div>
        <a-divider/>
        <div class="mould-frame-down">
          <a-table
            :dataSource="dataSource"
            :columns="columns"
            bordered
            :scroll="{ x: 3980 }"
            :pagination = false
            :rowClassName="rowClassName"
          >
            <a-space slot="materialPreparationDrawingDate" slot-scope="text, record, i" :class="record.materialPreparationShowRed?'material-column':''" >
              {{text}}
            </a-space>
            <a-space slot="topBottomMaterialsDate" slot-scope="text, record, i" :class="record.topBottomMaterialsShowRed?'material-column':''" >
              {{text}}
            </a-space>
            <a-space slot="sideFormsMaterialsDate" slot-scope="text, record, i" :class="record.sideFormsMaterialsShowRed?'material-column':''" >
              {{text}}
            </a-space>
            <a-space slot="processingDrawingDate" slot-scope="text, record, i" :class="record.processingDrawingShowRed?'material-column':''" >
              {{text}}
            </a-space>
            <a-space slot="cavityBackedDate" slot-scope="text, record, i" :class="record.cavityBackedShowRed?'material-column':''" >
              {{text}}
            </a-space>
            <a-space slot="verticalLatheDate" slot-scope="text, record, i" :class="record.verticalLatheShowRed?'material-column':''" >
              {{text}}
            </a-space>
            <a-space slot="millingMachiningDate" slot-scope="text, record, i" :class="record.millingMachiningShowRed?'material-column':''" >
              {{text}}
            </a-space>
            <a-space slot="mouldQualifiedDate" slot-scope="text, record, i" :class="record.mouldQualifiedDateShow" >
              {{text}}
            </a-space>
            <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
              <a-button v-has="'mouldMaintain:update'" type="link" @click="openRepair(operate, i)">维护</a-button>
              <a-button v-has="'mouldMaintain:check'" type="link" @click="openCheck(operate, i)">查看</a-button>
            </a-space>
          </a-table>
          <!--    分页-->
          <div class="bottom-page">
            <a-pagination
              :total=total
              :show-total="total => `共 ${total} 条`"
              :page-size=pageSize
              :current="currentPage"
              @change="pageChange"
            />
            <div style="margin: 0 20px">共 {{pageNum}} 页</div>
            <div style="margin: 0 10px 0 0">到第</div>
            <a-input-number style="width: 50px" @keyup.enter.native="pageJump(jumpPage)" v-model="jumpPage"></a-input-number>
            <div style="margin: 0 20px 0 10px">页</div>
            <a-button type="primary" @click="pageJump(jumpPage)">跳转</a-button>
          </div>
        </div>
    </a-card>
    <a-modal
      title="导入"
      :visible="importVisible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-upload-dragger
        name="file"
        :multiple="true"
        :beforeUpload = "beforeUpload"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">
          点击或将文件拖拽到这里上传
        </p>
        <p class="ant-upload-hint">
          支持扩展名：.xls .xlsx
        </p>
      </a-upload-dragger>
      <template #footer>
        <a-button key="back" @click="importVisible = false">取消</a-button>
        <a-button key="submit" type="primary"  @click="importFile">开始导入</a-button>
      </template>
    </a-modal>
  </div>

</template>

<script>
  import newMould from './newMould'
  import {getMould,importExcel } from '@/api/api'
  export default {
    name: 'MoudlRepair',
    components: {newMould},
    mounted() {
      getMould(this.searchParams).then( (data) => {
        data.result.records.forEach((item,index)=>{
          const materialPreparationDrawingDate = item.materialPreparationDrawingDate;
          const processingDrawingDate = item.processingDrawingDate;
          let datePicker1 = this.getDaysBetween(item.placeDate, item.materialPreparationDrawingDate);
          if(datePicker1 > 4){
            data.result.records[index].materialPreparationShowRed = true;
            data.result.records[index].materialPreparationDrawingDate  = data.result.records[index].materialPreparationDrawingDate + '延期' + (datePicker1 -4) + '天';
          }
          let datePicker2 = this.getDaysBetween(materialPreparationDrawingDate, item.topBottomMaterialsDate);
          if(datePicker2 > 8){
            data.result.records[index].topBottomMaterialsShowRed = true;
            data.result.records[index].topBottomMaterialsDate  = data.result.records[index].topBottomMaterialsDate + '延期' + (datePicker2 -8) + '天';
          }
          let datePicker3 = this.getDaysBetween(materialPreparationDrawingDate, item.sideFormsMaterialsDate);
          if(datePicker3 > 10){
            data.result.records[index].sideFormsMaterialsShowRed = true;
            data.result.records[index].sideFormsMaterialsDate  = data.result.records[index].sideFormsMaterialsDate + '延期' + (datePicker3 -10) + '天';
          }
          let datePicker4 = this.getDaysBetween(materialPreparationDrawingDate, item.processingDrawingDate);
          if(datePicker4 > 5){
            data.result.records[index].processingDrawingShowRed = true;
            data.result.records[index].processingDrawingDate  = data.result.records[index].processingDrawingDate + '延期' + (datePicker4 -5) + '天';
          }
          let datePicker5 = this.getDaysBetween(processingDrawingDate, item.cavityBackedDate);
          if(datePicker5 > 3){
            data.result.records[index].cavityBackedShowRed = true;
            data.result.records[index].cavityBackedDate  = data.result.records[index].cavityBackedDate + '延期' + (datePicker5 -3) + '天';
          }
          let datePicker6 = this.getDaysBetween(processingDrawingDate, item.verticalLatheDate);
          if(datePicker6 > 7){
            data.result.records[index].verticalLatheShowRed = true;
            data.result.records[index].verticalLatheDate  = data.result.records[index].verticalLatheDate + '延期' + (datePicker6 -7) + '天';
          }
          let datePicker7 = this.getDaysBetween(processingDrawingDate, item.millingMachiningDate);
          if(datePicker7 > 7){
            data.result.records[index].millingMachiningShowRed = true;
            data.result.records[index].millingMachiningDate  = data.result.records[index].millingMachiningDate + '延期' + (datePicker7 -7) + '天';
          }
          let datePicker8 = this.getDaysBetween(item.coordinationDate, item.mouldQualifiedDate);
          if(datePicker8 == 1) {
            data.result.records[index].mouldQualifiedDateShow = 'material-column-blue';
          }else if(datePicker8 == 0){
            data.result.records[index].mouldQualifiedDateShow = 'material-column-green';
          }else{
            data.result.records[index].mouldQualifiedDateShow = 'material-column';
          }
        })
        data.result.records.forEach((item,index)=>{
          console.log('keys', Object.keys(item));
          if(item['deliveryState']){
            item['deliveryState'] = item['deliveryState'].split(' ')[0];
          }
          Object.keys(item).forEach((item2, index2)=>{
            if(item2.indexOf('Date') != -1){
              if(item[item2]){
                console.log('item', item[item2]);
                item[item2] = item[item2].split(' ')[0];
              }
            }
          })
        })
        this.dataSource = data.result.records
        this.total = data.result.total;
        this.pageNum = data.result.pages;
        this.$nextTick(()=>{
          console.log('data2333', this.dataSource[0].mouldQualifiedDateShow);
        })
      })
    },
    data() {
      const deliverOnChange = (value, dateString) => { // 交付日期数据改变函数
        console.log('Selected Time: ', value);
        // const startTimestamp = new Date(dateString[0]).getTime();
        // const endTimestamp = new Date(dateString[1]).getTime()
        this.deliverPicker = dateString;
        console.log('Formatted Selected Time: ', this.deliverPicker[0], this.deliverPicker[1]);
      };
      const deliverOnOk = (value) => { // 交付日期确认函数
        console.log('onOk: ', value);
      };
      const qualifiedOnChange = (value, dateString) => { // 合格日期数据改变函数
        // const startTimestamp = new Date(dateString[0]).getTime();
        // const endTimestamp = new Date(dateString[1]).getTime()
        this.qualifiedPicker = dateString;

      };
      const qualifiedOnOk = (value) => { //合格日期确认函数
        console.log('onOk2: ', value);
      };
      const coordinateOnChange = (value, dateString) => { // 协调日期数据改变函数
       this.coordinatePicker = dateString;
      };
      const coordinateOnOk = (value) => { //协调日期确认函数
        console.log('onOk3: ', value);
      };
      return{
        qualifiedDateRadio:'',//合格日期选择
        coordinateDateRadio:'',//协调日期选择
        deliveryDateRadio:'',//交付日期选择
        fileList:[],//用于暂存文件数组
        importVisible:false,//导入界面展示
        showHideItem: true,//展示下方的搜索框
        selectId: '', //详情id
        deliverPicker: [], //交付日期数组
        qualifiedPicker: [], //合格日期数组
        coordinatePicker: [], //协调日期数组
        searchParams:{
          component: '', // 部件号
          coordinationDateSt: '', // 协调日期起始
          coordinationDateEn: '', // 协调日期终止
          deliveryStatesSt: '', // 要求交付日期起始
          deliveryStatesEn: '', //要求交付日期终止
          modelNumber:'', // 模号
          mouldQualifiedDateSt: '', //模具合格日期起始
          mouldQualifiedDateEn: '', //模具合格日期终止
          factory: '', //使用单位
          modelType: '', //模具制作类型
          pageNO: 1, // 当前页
          pageSize: 5, //展示条数
        },
        modalTitle:'', // 新增、维护弹窗title
        total: 0, // 共多少条
        pageSize: 5, // 一页多少条
        pageNum: 1, // 共多少页
        jumpPage: 1, // 跳转到第几页
        currentPage: 1, // 当前页
        dataSource: [],//表格数据
        deliverOnChange, //交付日期改变
        deliverOnOk, //交付日期确认
        qualifiedOnChange, //合格日期改变
        qualifiedOnOk, //合格日期确认
        coordinateOnChange, //协调日期改变
        coordinateOnOk, //协调日期确认
        partNumber: '',// 戴卡部件号双向绑定
        MoldType: '', //模具类型双向绑定
        moldNumber:'', //模号双向绑定
        department: '', //使用单位双向绑定
        columns :[
          {
            title: '戴卡部件号',
            dataIndex: 'component',
            key: 'component',
            align: 'left',
            width:150
          },
          {
            title: '轮型尺寸',
            dataIndex: 'sizeWheelShape',
            key: 'sizeWheelShape',
            align: 'left',
            width:150
          },
          {
            title: '模号',
            dataIndex: 'modelNumber',
            key: 'modelNumber',
            align: 'left',
            width:150
          },
          {
            title: '模具制作类型',
            dataIndex: 'modelType',
            key: 'modelType',
            align: 'left',
            width:200
          },
          {
            title: '使用单位',
            dataIndex: 'factory',
            key: 'factory',
            align: 'left',
            width:150
          },
          {
            title: '制作项目',
            dataIndex: 'productionProject',
            key: 'productionProject',
            align: 'left',
            width:150
          },
          {
            title: '下单日期',
            dataIndex: 'placeDate',
            key: 'placeDate',
            align: 'left',
            width:180,
          },
          {
            title: '备料图日期',
            dataIndex: 'materialPreparationDrawingDate',
            key: 'materialPreparationDrawingDate',
            align: 'left',
            width:180,
            scopedSlots: { customRender: 'materialPreparationDrawingDate' },
          },
          {
            title: '顶底坯料到厂日期',
            dataIndex: 'topBottomMaterialsDate',
            key: 'topBottomMaterialsDate',
            align: 'left',
            width:180,
            scopedSlots: { customRender: 'topBottomMaterialsDate' },
          },
          {
            title: '边模坯料到场日期',
            dataIndex: 'sideFormsMaterialsDate',
            key: 'sideFormsMaterialsDate',
            align: 'left',
            width:180,
            scopedSlots: { customRender: 'sideFormsMaterialsDate' },
          },
          {
            title: '加工图日期',
            dataIndex: 'processingDrawingDate',
            key: 'processingDrawingDate',
            align: 'left',
            width:180,
            scopedSlots: { customRender: 'processingDrawingDate' },
          },
          {
            title: '底膜背腔程序日期',
            dataIndex: 'cavityBackedDate',
            key: 'cavityBackedDate',
            align: 'left',
            width:180,
            scopedSlots: { customRender: 'cavityBackedDate' },
          },
          {
            title: '立车程序日期',
            dataIndex: 'verticalLatheDate',
            key: 'verticalLatheDate',
            align: 'left',
            width:180,
            scopedSlots: { customRender: 'verticalLatheDate' },
          },
          {
            title: '铣加工程序日期',
            dataIndex: 'millingMachiningDate',
            key: 'millingMachiningDate',
            align: 'left',
            width:180,
            scopedSlots: { customRender: 'millingMachiningDate' },
          },
          {
            title: '顶模状态',
            dataIndex: 'topDieState',
            key: 'topDieState',
            align: 'left',
            width:150
          },
          {
            title: '底模状态',
            dataIndex: 'dieBlockState',
            key: 'dieBlockState',
            align: 'left',
            width:150
          },
          {
            title: '底模环状态',
            dataIndex: 'dieBlockRingState',
            key: 'dieBlockRingState',
            align: 'left',
            width:150

          },
          {
            title: '模架状态',
            dataIndex: 'dieSetState',
            key: 'dieSetState',
            align: 'left',
            width:150

          },
          {
            title: '边模状态',
            dataIndex: 'sideFormState',
            key: 'sideFormState',
            align: 'left',
            width:150
          },
          {
            title: '整模状态',
            dataIndex: 'mouldPreparationState',
            key: 'mouldPreparationState',
            align: 'left',
            width:150
          },
          {
            title: '要求交付日期',
            dataIndex: 'deliveryState',
            key: 'deliveryState',
            align: 'left',
            width:180,

          },
          {
            title: '协调日期',
            dataIndex: 'coordinationDate',
            key: 'coordinationDate',
            align: 'left',
            width:180,
          },
          {
            title: '模具合格日期',
            dataIndex: 'mouldQualifiedDate',
            key: 'mouldQualifiedDate',
            align: 'left',
            width:180,
            scopedSlots: { customRender: 'mouldQualifiedDate' },
          },
          {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            fixed: 'right',
            align: 'center',
            scopedSlots: { customRender: 'operate' },
          }
        ],
      }
    },
    methods:{
      downLoad(){
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = `${window._CONFIG['domianURL']}` +'sys/common/static/导入模具制造维护列表数据.xls';
        link.target="_blank";
        link.setAttribute('download', 'fileName')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) //下载完成移除元素
      },
      rowClassName(record,index) {
        let a123 = "table-gray"
        if(index%2!=0){
          return a123;
        }
      },
      showDown(){
        this.showHideItem = false;
      },
      showUp(){
        this.showHideItem = true;
      },
      deliveryDateOnChange(e) {
        switch (e.target.value) {
          case 'a': this.setTime('deliveryDate', 'day');break;
          case 'b': this.setTime('deliveryDate', 'week');break;
          case 'c': this.setTime('deliveryDate', 'month');break;
        }
      },
      qualifiedDateOnChange(e) {
        switch (e.target.value) {
          case 'a': this.setTime('qualifiedDate', 'day');break;
          case 'b': this.setTime('qualifiedDate', 'week');break;
          case 'c': this.setTime('qualifiedDate', 'month');break;
        }
      },
      coordinateDateOnChange(e) {
        switch (e.target.value) {
          case 'a': this.setTime('coordinateDate', 'day');break;
          case 'b': this.setTime('coordinateDate', 'week');break;
          case 'c': this.setTime('coordinateDate', 'month');break;
        }
      },
      tableChange(val) {
        console.log(val);
      },
      openModal() {  //界面跳转路由
        this.$router.push({
          path: `/system/newMould`,
        })
      },
      openNew() { // 打开新增界面
        this.openModal();
        localStorage.setItem('mouldTitle', '模具新增');
        localStorage.removeItem('selectId');
      },
      openRepair(operate, i) {
        console.log('打印',operate, i);
        this.selectId = operate.id;
        localStorage.setItem('selectId', this.selectId);
        this.openModal();
        localStorage.setItem('mouldTitle', '模具维护');
      },
      openCheck(operate, i) {
        this.openModal();
        this.selectId = operate.id;
        localStorage.setItem('selectId', this.selectId);
        localStorage.setItem('mouldTitle', '模具制造详细信息');
      },
      pageChange(val) { // 分页改变
        // console.log(val);
        this.currentPage = val;
        this.searchParams.pageNO = this.currentPage;
        getMould(this.searchParams).then( (data) => {
          data.result.records.forEach((item,index)=>{
            const materialPreparationDrawingDate = item.materialPreparationDrawingDate;
            const processingDrawingDate = item.processingDrawingDate;
            let datePicker1 = this.getDaysBetween(item.placeDate, item.materialPreparationDrawingDate);
            if(datePicker1 > 4){
              data.result.records[index].materialPreparationShowRed = true;
              data.result.records[index].materialPreparationDrawingDate  = data.result.records[index].materialPreparationDrawingDate + '延期' + (datePicker1 -4) + '天';
            }
            let datePicker2 = this.getDaysBetween(materialPreparationDrawingDate, item.topBottomMaterialsDate);
            if(datePicker2 > 8){
              data.result.records[index].topBottomMaterialsShowRed = true;
              data.result.records[index].topBottomMaterialsDate  = data.result.records[index].topBottomMaterialsDate + '延期' + (datePicker2 -8) + '天';
            }
            let datePicker3 = this.getDaysBetween(materialPreparationDrawingDate, item.sideFormsMaterialsDate);
            if(datePicker3 > 10){
              data.result.records[index].sideFormsMaterialsShowRed = true;
              data.result.records[index].sideFormsMaterialsDate  = data.result.records[index].sideFormsMaterialsDate + '延期' + (datePicker3 -10) + '天';
            }
            let datePicker4 = this.getDaysBetween(materialPreparationDrawingDate, item.processingDrawingDate);
            if(datePicker4 > 5){
              data.result.records[index].processingDrawingShowRed = true;
              data.result.records[index].processingDrawingDate  = data.result.records[index].processingDrawingDate + '延期' + (datePicker4 -5) + '天';
            }
            let datePicker5 = this.getDaysBetween(processingDrawingDate, item.cavityBackedDate);
            if(datePicker5 > 3){
              data.result.records[index].cavityBackedShowRed = true;
              data.result.records[index].cavityBackedDate  = data.result.records[index].cavityBackedDate + '延期' + (datePicker5 -3) + '天';
            }
            let datePicker6 = this.getDaysBetween(processingDrawingDate, item.verticalLatheDate);
            if(datePicker6 > 7){
              data.result.records[index].verticalLatheShowRed = true;
              data.result.records[index].verticalLatheDate  = data.result.records[index].verticalLatheDate + '延期' + (datePicker6 -7) + '天';
            }
            let datePicker7 = this.getDaysBetween(processingDrawingDate, item.millingMachiningDate);
            if(datePicker7 > 7){
              data.result.records[index].millingMachiningShowRed = true;
              data.result.records[index].millingMachiningDate  = data.result.records[index].millingMachiningDate + '延期' + (datePicker7 -7) + '天';
            }
            let datePicker8 = this.getDaysBetween(item.coordinationDate, item.mouldQualifiedDate);
            if(datePicker8 == 1) {
              data.result.records[index].mouldQualifiedDateShow = 'material-column-blue';
            }else if(datePicker8 == 0){
              data.result.records[index].mouldQualifiedDateShow = 'material-column-green';
            }else{
              data.result.records[index].mouldQualifiedDateShow = 'material-column';
            }
          })
          data.result.records.forEach((item,index)=>{
            console.log('keys', Object.keys(item));
            if(item['deliveryState']){
              item['deliveryState'] = item['deliveryState'].split(' ')[0];
            }
            Object.keys(item).forEach((item2, index2)=>{
              if(item2.indexOf('Date') != -1){
                if(item[item2]){
                  console.log('item', item[item2]);
                  item[item2] = item[item2].split(' ')[0];
                }
              }
            })
          })
          this.dataSource = data.result.records;
          this.total = data.result.total;
        })
      },
      pageJump(page) { // 点击指定分页跳转的情况下
        console.log('56789', this.pageNum);
        if (page > this.pageNum) {
          page = this.pageNum;
          this.jumpPage = this.pageNum;
        } else if (page < 1) {
          page = 1;
          this.jumpPage = 1;
        }
        // if (page > this.pageNum || page < 1) {
        //   this.$message.destroy();
        //   this.$message.warning('超出页码范围！');
        // } else {
          console.log('34567', page);
          this.currentPage = page;
          this.searchParams.pageNO = this.currentPage;
          getMould(this.searchParams).then( (data) => {
            data.result.records.forEach((item,index)=>{
              const materialPreparationDrawingDate = item.materialPreparationDrawingDate;
              const processingDrawingDate = item.processingDrawingDate;
              let datePicker1 = this.getDaysBetween(item.placeDate, item.materialPreparationDrawingDate);
              if(datePicker1 > 4){
                data.result.records[index].materialPreparationShowRed = true;
                data.result.records[index].materialPreparationDrawingDate  = data.result.records[index].materialPreparationDrawingDate + '延期' + (datePicker1 -4) + '天';
              }
              let datePicker2 = this.getDaysBetween(materialPreparationDrawingDate, item.topBottomMaterialsDate);
              if(datePicker2 > 8){
                data.result.records[index].topBottomMaterialsShowRed = true;
                data.result.records[index].topBottomMaterialsDate  = data.result.records[index].topBottomMaterialsDate + '延期' + (datePicker2 -8) + '天';
              }
              let datePicker3 = this.getDaysBetween(materialPreparationDrawingDate, item.sideFormsMaterialsDate);
              if(datePicker3 > 10){
                data.result.records[index].sideFormsMaterialsShowRed = true;
                data.result.records[index].sideFormsMaterialsDate  = data.result.records[index].sideFormsMaterialsDate + '延期' + (datePicker3 -10) + '天';
              }
              let datePicker4 = this.getDaysBetween(materialPreparationDrawingDate, item.processingDrawingDate);
              if(datePicker4 > 5){
                data.result.records[index].processingDrawingShowRed = true;
                data.result.records[index].processingDrawingDate  = data.result.records[index].processingDrawingDate + '延期' + (datePicker4 -5) + '天';
              }
              let datePicker5 = this.getDaysBetween(processingDrawingDate, item.cavityBackedDate);
              if(datePicker5 > 3){
                data.result.records[index].cavityBackedShowRed = true;
                data.result.records[index].cavityBackedDate  = data.result.records[index].cavityBackedDate + '延期' + (datePicker5 -3) + '天';
              }
              let datePicker6 = this.getDaysBetween(processingDrawingDate, item.verticalLatheDate);
              if(datePicker6 > 7){
                data.result.records[index].verticalLatheShowRed = true;
                data.result.records[index].verticalLatheDate  = data.result.records[index].verticalLatheDate + '延期' + (datePicker6 -7) + '天';
              }
              let datePicker7 = this.getDaysBetween(processingDrawingDate, item.millingMachiningDate);
              if(datePicker7 > 7){
                data.result.records[index].millingMachiningShowRed = true;
                data.result.records[index].millingMachiningDate  = data.result.records[index].millingMachiningDate + '延期' + (datePicker7 -7) + '天';
              }
              let datePicker8 = this.getDaysBetween(item.coordinationDate, item.mouldQualifiedDate);
              if(datePicker8 == 1) {
                data.result.records[index].mouldQualifiedDateShow = 'material-column-blue';
              }else if(datePicker8 == 0){
                data.result.records[index].mouldQualifiedDateShow = 'material-column-green';
              }else{
                data.result.records[index].mouldQualifiedDateShow = 'material-column';
              }
            })
            data.result.records.forEach((item,index)=>{
              console.log('keys', Object.keys(item));
              if(item['deliveryState']){
                item['deliveryState'] = item['deliveryState'].split(' ')[0];
              }
              Object.keys(item).forEach((item2, index2)=>{
                if(item2.indexOf('Date') != -1){
                  if(item[item2]){
                    console.log('item', item[item2]);
                    item[item2] = item[item2].split(' ')[0];
                  }
                }
              })
            })
            this.dataSource = data.result.records;
            this.total = data.result.total;
          })
        // }
      },
      searchMould() { //查询按钮
        const obj = this.searchParams;
        obj.pageNO = 1;
        obj.pageSize= 5;
        obj.coordinationDateEn =this.coordinatePicker[1]? this.coordinatePicker[1]+  ' 23:59:59':'';
        obj.coordinationDateSt = this.coordinatePicker[0]?this.coordinatePicker[0]+ ' 00:00:00':'';
        obj.mouldQualifiedDateSt = this.qualifiedPicker[0]?this.qualifiedPicker[0]+ ' 00:00:00':'';
        obj.mouldQualifiedDateEn =this.qualifiedPicker[1]? this.qualifiedPicker[1]+  ' 23:59:59':'';
        obj.deliveryStatesSt = this.deliverPicker[0]?this.deliverPicker[0] + ' 00:00:00':'';
        obj.deliveryStatesEn = this.deliverPicker[1]?this.deliverPicker[1] +  ' 23:59:59':'';
        obj.component = this.partNumber;
        obj.modelNumber = this.moldNumber;
        obj.modelType = this.MoldType;
        obj.factory = this.department;
        getMould (obj).then( (data) => {
          data.result.records.forEach((item,index)=>{
            const materialPreparationDrawingDate = item.materialPreparationDrawingDate;
            const processingDrawingDate = item.processingDrawingDate;
            let datePicker1 = this.getDaysBetween(item.placeDate, item.materialPreparationDrawingDate);
            if(datePicker1 > 4){
              data.result.records[index].materialPreparationShowRed = true;
              data.result.records[index].materialPreparationDrawingDate  = data.result.records[index].materialPreparationDrawingDate + '延期' + (datePicker1 -4) + '天';
            }
            let datePicker2 = this.getDaysBetween(materialPreparationDrawingDate, item.topBottomMaterialsDate);
            if(datePicker2 > 8){
              data.result.records[index].topBottomMaterialsShowRed = true;
              data.result.records[index].topBottomMaterialsDate  = data.result.records[index].topBottomMaterialsDate + '延期' + (datePicker2 -8) + '天';
            }
            let datePicker3 = this.getDaysBetween(materialPreparationDrawingDate, item.sideFormsMaterialsDate);
            if(datePicker3 > 10){
              data.result.records[index].sideFormsMaterialsShowRed = true;
              data.result.records[index].sideFormsMaterialsDate  = data.result.records[index].sideFormsMaterialsDate + '延期' + (datePicker3 -10) + '天';
            }
            let datePicker4 = this.getDaysBetween(materialPreparationDrawingDate, item.processingDrawingDate);
            if(datePicker4 > 5){
              data.result.records[index].processingDrawingShowRed = true;
              data.result.records[index].processingDrawingDate  = data.result.records[index].processingDrawingDate + '延期' + (datePicker4 -5) + '天';
            }
            let datePicker5 = this.getDaysBetween(processingDrawingDate, item.cavityBackedDate);
            if(datePicker5 > 3){
              data.result.records[index].cavityBackedShowRed = true;
              data.result.records[index].cavityBackedDate  = data.result.records[index].cavityBackedDate + '延期' + (datePicker5 -3) + '天';
            }
            let datePicker6 = this.getDaysBetween(processingDrawingDate, item.verticalLatheDate);
            if(datePicker6 > 7){
              data.result.records[index].verticalLatheShowRed = true;
              data.result.records[index].verticalLatheDate  = data.result.records[index].verticalLatheDate + '延期' + (datePicker6 -7) + '天';
            }
            let datePicker7 = this.getDaysBetween(processingDrawingDate, item.millingMachiningDate);
            if(datePicker7 > 7){
              data.result.records[index].millingMachiningShowRed = true;
              data.result.records[index].millingMachiningDate  = data.result.records[index].millingMachiningDate + '延期' + (datePicker7 -7) + '天';
            }
            let datePicker8 = this.getDaysBetween(item.coordinationDate, item.mouldQualifiedDate);
            if(datePicker8 == 1) {
              data.result.records[index].mouldQualifiedDateShow = 'material-column-blue';
            }else if(datePicker8 == 0){
              data.result.records[index].mouldQualifiedDateShow = 'material-column-green';
            }else{
              data.result.records[index].mouldQualifiedDateShow = 'material-column';
            }
          })
          data.result.records.forEach((item,index)=>{
            console.log('keys', Object.keys(item));
            if(item['deliveryState']){
              item['deliveryState'] = item['deliveryState'].split(' ')[0];
            }
            Object.keys(item).forEach((item2, index2)=>{
              if(item2.indexOf('Date') != -1){
                if(item[item2]){
                  console.log('item', item[item2]);
                  item[item2] = item[item2].split(' ')[0];
                }
              }
            })
          })
          this.dataSource = data.result.records;
          this.total = data.result.total;
        })
      },
      resetSearch() {
        this.coordinatePicker = [];
        this.qualifiedPicker = [];
        this.deliverPicker = [];
        this.partNumber = '';
        this.moldNumber = '';
        this.MoldType = '';
        this.department = '';
        this.deliveryDateRadio = '';
        this.qualifiedDateRadio = '';
        this.coordinateDateRadio = '';
      },
      setTime(name, type) { // 快速确定时间，本日 本周 本月
        if (name === 'deliveryDate') {
          this.deliverPicker = this.returnDateByType(type);
        } else if (name === 'coordinateDate') {
          this.coordinatePicker = this.returnDateByType(type);
        }else {
          this.qualifiedPicker = this.returnDateByType(type);

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
      getDaysBetween(dateString1,dateString2){
        const  startDate = Date.parse(dateString1);
        const  endDate = Date.parse(dateString2);
        if (startDate>endDate){
          return 0;
        }
        if (startDate==endDate){
          return 1;
        }
        const days = Math.floor((endDate - startDate)/(1*24*60*60*1000));
        return  days;
      },
      importOpen(){
        this.importVisible = true;
      },
      handleOk() {
        this.importVisible = false;
      },
      handleCancel() {
        this.importVisible = false;
      },
      beforeUpload(file, fileList){
        console.log('file',file,'fileList',fileList);
        this.fileList = fileList;
        return false;
      },
      importFile(){
        let formData = new FormData();
        this.fileList.forEach((item,index)=>{
          formData.append('file',item);
        })
        importExcel(formData).then((data)=>{
          if(data.success){
            this.$message.success(data.message);
            this.importVisible = false;
            this.fileList = [];
          }else{
            this.$message.success(data.message);
          }
        })
      },
    },

  }
</script>

<style scoped lang="less">
  /deep/ .ant-upload.ant-upload-drag{
    background-color:#F5F8FA;
  }
  /deep/ .ant-table-body{
    th{
      font-size: 16px;
      color: rgba(0,0,0,.65) !important;
    }
    td{
      font-size: 16px;
      color: rgba(0,0,0,.85) !important;
      padding: 8px 16px !important;
    }
    td:last-child{
      padding: 8px 24px !important;
      .ant-space-item {
        .ant-btn{
          font-size: 16px;
          padding: 0 !important;
        }
      }
      .ant-space-item:last-child{
        .ant-btn{
          padding: 0;
        }
      }
    }
  }
  /deep/.ant-card-body{
    padding:24px 32px;
  }
  /deep/.table-gray {
    background-color: #F5F8FA;
  }
  /deep/.ant-table{
    font-size: 16px;
  }
  /deep/.ant-table-tbody > tr > td{
    padding: 8px 16px;
  }
  .cursor{
    cursor: pointer;
  }
  .select-text{
    text-decoration:underline;
    color: #00A0E9;
  }
  .item-flex{
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .select-text:active{
   opacity: 0.5;
  }
  .row{
    margin-bottom: 16px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .buttonMargin{
    margin-right: 8px;
  }
  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    align-items: center;
  }
  .margin-item{
    margin-right: 72px;
  }
  .material-column{
    color: red;
  }
  .material-column-blue{
    color: #53BECE;
  }
  .material-column-green{
    color: lawngreen;
  }
  .table-title{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }


</style>