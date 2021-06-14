<template>
  <div>
    <a-card style="margin-bottom: 24px">
      <div class="mould-frame-up-hide" v-if="showHideItem">
        <a-row class="row">
          <div class="margin-item">
            <div class="item-flex">
              <span style="font-size: 14px;margin-right: 12px; ">戴卡部件号:</span>
              <a-input v-model:value="partNumber" placeholder="请输入戴卡部件号" style="width: 244px;height: 32px;"/>
            </div>
          </div>
          <div class="margin-item">
            <div class="item-flex">
              <span style="font-size: 14px;margin-right: 12px ">送修日期:</span>
              <a-range-picker
                v-model:value="RepairPicker"
                :show-time="{ format: 'HH:mm:ss' }"
                format="YYYY-MM-DD"
                :placeholder="['开始日期', '结束日期']"
                @change="RepairOnChange"
                @ok="RepairOnOk"
                style="width: 244px;height: 32px;"
              />
              <a-radio-group @change="RepairDateOnChange" style="margin-left: 12px" v-model="RepairDateRadio">
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
<!--          <div class="margin-item">-->
<!--            <div class="item-flex">-->
<!--              <span style="font-size: 14px;margin-right: 12px; ">送检部门:</span>-->
<!--              <a-input v-model:value="repairDepartment" placeholder="请输入送检部门" style="width: 244px;height: 32px;"/>-->
<!--            </div>-->
<!--          </div>-->
          <div class="margin-item">
            <div class="item-flex">
              <span style="font-size: 14px;margin-right: 12px; ">模号:</span>
              <a-input v-model:value="moldNumber" placeholder="请输入模号" style="width: 244px;height: 32px;"/>
            </div>
          </div>
          <div>
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
              <span style="font-size: 14px;margin-right: 12px; ">送检部门:</span>
              <a-input v-model:value="repairDepartment" placeholder="请输入送检部门" style="width: 244px;height: 32px;"/>
            </div>
          </div>
          <div class="margin-item">
            <div class="item-flex">
              <span style="font-size: 14px;margin-right: 12px; ">模号:</span>
              <a-input v-model:value="moldNumber" placeholder="请输入模号" style="width: 244px;height: 32px;"/>
            </div>
          </div>
        </a-row>
        <a-row class="row">
          <div class="margin-item">
            <div class="item-flex">
              <span style="font-size: 14px;margin-right: 12px; ">计划完成日期:</span>
              <a-range-picker
                v-model:value="planCompletePicker"
                :show-time="{ format: 'HH:mm' }"
                format="YYYY-MM-DD"
                :placeholder="['开始日期', '结束日期']"
                @change="planCompleteOnChange"
                @ok="planCompleteOnOk"
                style="width: 244px;height: 32px;"
              />
              <a-radio-group @change="planCompleteDateOnChange" style="margin-left: 12px" v-model="planCompleteDateRadio">
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
              <span style="font-size: 14px;margin-right: 12px ">送修日期:</span>
              <a-range-picker
                v-model:value="RepairPicker"
                :show-time="{ format: 'HH:mm:ss' }"
                format="YYYY-MM-DD"
                :placeholder="['开始日期', '结束日期']"
                @change="RepairOnChange"
                @ok="RepairOnOk"
                style="width: 244px;height: 32px;"
              />
              <a-radio-group @change="RepairDateOnChange" style="margin-left: 12px" v-model="RepairDateRadio">
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
          <a-col :span="4">
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
        <p style="font-size: 18px;"><b>模具维修维护列表</b></p>
        <div class="table-title-button-frame">
          <a-button v-has="'mouldRepair:add'" type="primary" icon="plus" class="buttonMargin" @click="openNew()">新建</a-button>
          <a-button v-has="'mouldRepair:download'" icon="download" class="buttonMargin">下载</a-button>
          <a-button v-has="'mouldRepair:export'" icon="export" class="buttonMargin">导出</a-button>
          <a-button v-has="'mouldRepair:import'" icon="import" class="buttonMargin">导入</a-button>
        </div>
      </div>
      <a-divider/>
      <div class="mould-frame-down">
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          bordered
          :pagination = false
          :rowClassName="rowClassName"
        >
          <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
            <a-button v-has="'mouldRepair:update'" type="link" @click="openRepair(operate, i)">维护</a-button>
            <a-button v-has="'mouldRepair:check'" type="link" @click="openCheck(operate, i)">查看</a-button>
            <a-button v-has="'mouldRepair:del'" type="link" @click="deleteOperate(operate, i)">删除</a-button>
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
      <a-modal v-model:visible="deleteVisible" title="确认删除">
        <span>确定删除本条？</span>
        <template #footer>
          <a-button key="submit" type="primary"  @click="handleOk">确定</a-button>
          <a-button key="back" @click="handleCancel()">取消</a-button>
        </template>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
  import newMould from './newMould'
  import {getMouldRepair, deleteMould, getOptions } from '@/api/api'
  export default {
    name: 'MoudlRepair',
    components: {newMould},
    mounted() {
      this.getDic();
      getMouldRepair(this.searchParams).then( (data) => {
        data = data.result;
        if (!data.records.length) {
          this.dataSource = [];
        }else {
          for (let i = 0; i < data.records.length; i++) { // 遍历返回的数据列表
            for (let name in data.records[i]) { // 列表每行 for 出每个属性
              if (name in this.dic) { // 如果该属性在字典里
                for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                  if (data.records[i][name] && Number(data.records[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                    console.log(' 2355',this.dic[name][j].label);
                    data.records[i][name] = this.dic[name][j].label;
                  }
                }
              }
            }
          }
        }
        data.records.forEach((item,index)=>{
          console.log('keys', Object.keys(item));
          Object.keys(item).forEach((item2, index2)=>{
            if(item2.indexOf('Date') != -1){
              if(item[item2]){
                console.log('item', item[item2]);
                item[item2] = item[item2].split(' ')[0];
              }
            }
          })
        })
        this.dataSource = data.records;
        this.total = data.total;
        this.pageNum = data.pages;
      })
    },
    data() {
      const planCompleteOnChange = (value, dateString) => { // 计划完成日期数据改变函数
        console.log('Selected Time: ', value);
        // const startTimestamp = new Date(dateString[0]).getTime();
        // const endTimestamp = new Date(dateString[1]).getTime()
        this.planCompletePicker = dateString;
        console.log('Formatted Selected Time: ', this.planCompletePicker[0], this.planCompletePicker[1]);
      };
      const planCompleteOnOk = (value) => { // 交付日期确认函数
        console.log('onOk: ', value);
      };
      const RepairOnChange = (value, dateString) => { // 合格日期数据改变函数
        // const startTimestamp = new Date(dateString[0]).getTime();
        // const endTimestamp = new Date(dateString[1]).getTime()
        this.RepairPicker = dateString;

      };
      const RepairOnOk = (value) => { //合格日期确认函数
        console.log('onOk2: ', value);
      };
      return{
        planCompleteDateRadio:'',//计划完成日期选择
        RepairDateRadio:'',//送修日期选择
        showHideItem:true,
        dic: { // 表单中的部分数据对应的的数据词典
          maintainState: [], // 维护状态
        },
        deleteId: '',
        deleteVisible: false, // 删除
        selectId: '', //详情id
        planCompletePicker: [], //计划完成日期数组
        RepairPicker: [], //送修日期数组
        searchParams:{
          component: '', // 部件号
          modelNumber:'', // 模号
          completionPlanDateEn: '',
          completionPlanDateSt: '',
          sendRepairDateEn: '',
          sendRepairDateSt: '',
          shopVisitDepartment: '', //送修部门
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
        planCompleteOnChange, //计划完成日期改变
        planCompleteOnOk, //计划完成日期确认
        RepairOnChange, //送修日期改变
        RepairOnOk, //送修日期确认
        partNumber: '',// 戴卡部件号双向绑定
        repairDepartment: '', //送修部门双向绑定
        moldNumber:'', //模号双向绑定
        columns :[
          {
            title: '戴卡部件号',
            dataIndex: 'component',
            key: 'component',
            align: 'left',
          },
          {
            title: '模号',
            dataIndex: 'modelNumber',
            key: 'modelNumber',
            align: 'left',
          },
          {
            title: '模具制作类型',
            dataIndex: 'modelType',
            key: 'modelType',
            align: 'left',
          },
          {
            title: '送检部门',
            dataIndex: 'shopVisitDepartment',
            key: 'shopVisitDepartment',
            align: 'left',
          },
          {
            title: '送修日期',
            dataIndex: 'sendRepairDate',
            key: 'sendRepairDate',
            align: 'left',
          },
          {
            title: '计划完成日期',
            dataIndex: 'completionPlanDate',
            key: 'completionPlanDate',
            align: 'left',
          },
          {
            title: '实际完成日期',
            dataIndex: 'completionRealityDate',
            key: 'completionRealityDate',
            align: 'left',
          },
          {
            title: '送检日期',
            dataIndex: 'sendInspectionDate',
            key: 'sendInspectionDate',
            align: 'left',
          },
          {
            title: '工时',
            dataIndex: 'manHour',
            key: 'manHour',
            align: 'left',
          },
          {
            title: '维修状态',
            dataIndex: 'maintainState',
            key: 'maintainState',
            align: 'left',
          },
          {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            align: 'center',
            width: 150,
            scopedSlots: { customRender: 'operate' },
          }
        ],
      }
    },
    methods:{
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
      planCompleteDateOnChange(e){
        switch (e.target.value) {
          case 'a': this.setTime('planCompleteDate', 'day');break;
          case 'b': this.setTime('planCompleteDate', 'week');break;
          case 'c': this.setTime('planCompleteDate', 'month');break;
        }
      },
      RepairDateOnChange(e){
        switch (e.target.value) {
          case 'a': this.setTime('RepairDate', 'day');break;
          case 'b': this.setTime('RepairDate', 'week');break;
          case 'c': this.setTime('RepairDate', 'month');break;
        }
      },
      tableChange(val) {
        console.log(val);
      },
      openModal() {  //界面跳转路由
        this.$router.push({
          path: `/system/newMouldRepair`,
        })
      },
      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          getOptions(searchName, '').then((data) => {
            this.dic[name] = data;
          });
        }
      },
      openNew() { // 打开新增界面
        this.openModal();
        localStorage.setItem('mouldRepairTitle', '维修信息新增');
        localStorage.removeItem('selectRepairId');
      },
      openRepair(operate, i) {
        // console.log('打印',operate, i);
        this.selectId = operate.id;
        localStorage.setItem('selectRepairId', this.selectId);
        this.openModal();
        localStorage.setItem('mouldRepairTitle', '维修信息维护');
      },
      openCheck(operate, i) {
        this.openModal();
        this.selectId = operate.id;
        localStorage.setItem('selectRepairId', this.selectId);
        localStorage.setItem('mouldRepairTitle', '模具维修详细信息');
      },
      pageChange(val) { // 分页改变
        // console.log(val);
        this.currentPage = val;
        this.searchParams.pageNO = this.currentPage;
        getMouldRepair(this.searchParams).then( (data) => {
          data = data.result;
          if (!data.records.length) {
            this.dataSource = [];
          }else {
            for (let i = 0; i < data.records.length; i++) { // 遍历返回的数据列表
              for (let name in data.records[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.records[i][name] && Number(data.records[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                      console.log(' 2355',this.dic[name][j].label);
                      data.records[i][name] = this.dic[name][j].label;
                    }
                  }
                }
              }
            }
          }
          data.records.forEach((item,index)=>{
            console.log('keys', Object.keys(item));
            Object.keys(item).forEach((item2, index2)=>{
              if(item2.indexOf('Date') != -1){
                if(item[item2]){
                  console.log('item', item[item2]);
                  item[item2] = item[item2].split(' ')[0];
                }
              }
            })
          })
          this.dataSource = data.records;
          this.total = data.total;
          this.pageNum = data.pages;
        })
      },
      pageJump(page) { // 点击指定分页跳转的情况下
        if (page > this.pageNum) {
          page = this.pageNum;
          this.jumpPage = this.pageNum;
        } else if (page < 1) {
          page = 1;
          this.jumpPage = 1;
        }
        this.currentPage = page;
        this.searchParams.pageNO = this.currentPage;
        getMouldRepair(this.searchParams).then( (data) => {
          data = data.result;
          if (!data.records.length) {
            this.dataSource = [];
          }else {
            for (let i = 0; i < data.records.length; i++) { // 遍历返回的数据列表
              for (let name in data.records[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.records[i][name] && Number(data.records[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                      console.log(' 2355',this.dic[name][j].label);
                      data.records[i][name] = this.dic[name][j].label;
                    }
                  }
                }
              }
            }
          }
          data.records.forEach((item,index)=>{
            console.log('keys', Object.keys(item));
            Object.keys(item).forEach((item2, index2)=>{
              if(item2.indexOf('Date') != -1){
                if(item[item2]){
                  console.log('item', item[item2]);
                  item[item2] = item[item2].split(' ')[0];
                }
              }
            })
          })
          this.dataSource = data.records;
          this.total = data.total;
          this.pageNum = data.pages;
        })
      },
      searchMould() { //查询按钮
        const obj = this.searchParams;
        obj.pageNO = 1;
        obj.pageSize= 5;
        obj.completionPlanDateEn = this.planCompletePicker[1]?this.planCompletePicker[1]+  ' 23:59:59':'';
        obj.completionPlanDateSt = this.planCompletePicker[0]?this.planCompletePicker[0]+  ' 00:00:00':'';
        obj.sendRepairDateEn = this.RepairPicker[1]?this.RepairPicker[1]+  ' 23:59:59':'';
        obj.sendRepairDateSt = this.RepairPicker[0]?this.RepairPicker[0]+  ' 00:00:00':'';
        obj.component = this.partNumber;
        obj.modelNumber = this.moldNumber;
        obj.shopVisitDepartment = this.repairDepartment;
        getMouldRepair (obj).then( (data) => {
          data = data.result;
          if (!data.records.length) {
            this.dataSource = [];
          }else {
            for (let i = 0; i < data.records.length; i++) { // 遍历返回的数据列表
              for (let name in data.records[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.records[i][name] && Number(data.records[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                      console.log(' 2355',this.dic[name][j].label);
                      data.records[i][name] = this.dic[name][j].label;
                    }
                  }
                }
              }
            }
          }
          data.records.forEach((item,index)=>{
            console.log('keys', Object.keys(item));
            Object.keys(item).forEach((item2, index2)=>{
              if(item2.indexOf('Date') != -1){
                if(item[item2]){
                  console.log('item', item[item2]);
                  item[item2] = item[item2].split(' ')[0];
                }
              }
            })
          })
          this.dataSource = data.records;
          this.total = data.total;
          this.pageNum = data.pages;
        })
      },
      resetSearch() {
        this.planCompletePicker = [];
        this.RepairPicker = [];
        this.partNumber = '';
        this.moldNumber = '';
        this.repairDepartment = '';
        this.planCompleteDateRadio = '';
        this.RepairDateRadio = '';
      },
      deleteOperate(operate, i){
        this.deleteVisible = true;
        this.deleteId = operate.id;
        console.log('2333333', operate);
      },
      handleOk(){
        deleteMould({id: this.deleteId.toString()}).then( (data) => {
          console.log('success' , data.success);
          if(data.success) {
            this.deleteVisible = false;
            this.$message.info('删除成功');
          } else {
            this.$message.warning('删除失败');
          }
        })
        getMouldRepair(this.searchParams).then( (data) => {
          data = data.result;
          if (!data.records.length) {
            this.dataSource = [];
          }else {
            for (let i = 0; i < data.records.length; i++) { // 遍历返回的数据列表
              for (let name in data.records[i]) { // 列表每行 for 出每个属性
                if (name in this.dic) { // 如果该属性在字典里
                  for (let j = 0; j < this.dic[name].length; j++) { // 遍历该字典，看看有哪些值
                    if (data.records[i][name] && Number(data.records[i][name]) === this.dic[name][j].value) { // 找到value相等时对应的label
                      console.log(' 2355',this.dic[name][j].label);
                      data.records[i][name] = this.dic[name][j].label;
                    }
                  }
                }
              }
            }
          }
          data.records.forEach((item,index)=>{
            console.log('keys', Object.keys(item));
            Object.keys(item).forEach((item2, index2)=>{
              if(item2.indexOf('Date') != -1){
                if(item[item2]){
                  console.log('item', item[item2]);
                  item[item2] = item[item2].split(' ')[0];
                }
              }
            })
          })
          this.dataSource = data.records;
          this.total = data.total;
          this.pageNum = data.pages;
        })
      },
      handleCancel() {
        this.deleteVisible = false;
      },
      setTime(name, type) { // 快速确定时间，本日 本周 本月
        if (name === 'planCompleteDate') {
          this.planCompletePicker = this.returnDateByType(type);
        } else if (name === 'RepairDate') {
          this.RepairPicker = this.returnDateByType(type);
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
      humpOrLine(name, type) { // 驼峰式转下划线 toLine 下划线转驼峰式 toHump
        if (type === 'toLine') {
          return name.replace(/([A-Z])/g, '_$1').toLowerCase();
        } else if (type === 'toHump') {
          return name.replace(/\_(\w)/g, function(all, letter) {
            return letter.toUpperCase();
          });
        }
      },

    },

  }
</script>

<style scoped lang="less">

  @import "./../../css/public-table-css";
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
  /deep/.table-gray {
    background-color: #F5F8FA;
  }
  /deep/.ant-card-body{
    padding:24px 32px;
  }
  .cursor{
    cursor: pointer;
  }
  .select-text{
    text-decoration:underline;
    color: #00A0E9;
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
  .table-title{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .margin-item{
    margin-right: 72px;
  }
  .item-flex{
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }


</style>