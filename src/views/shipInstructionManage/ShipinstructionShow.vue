<template>
  <a-modal :visible="visible" width ="1100px" @cancel="handleCancel">
    <a-table
      ref="table"
      size="middle"
      style = "width: 100%;padding: 50px 10px 0 10px;min-height: 300px;"
      bordered
      :columns="columns"
      :dataSource="dataSource"
      :pagination=false>
      <a-space slot="operate" slot-scope="text, operate, i" class="operate-row">
        <a-button type="link" @click="editRow(operate, i, 'check')">
          查看过程指令
        </a-button>
<!--        <a-button type="link" @click="editRow(operate, i, 'edit')">-->
<!--          修改-->
<!--        </a-button>-->
      </a-space>
    </a-table>

<!--        分页-->
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
      <a-button type="primary" @click="pageJump(page.jumpPage)">确定</a-button>
    </div>
    <template #footer>
      <a-button key="back" @click="handleCancel()">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
import { getOptions, getShipinstruction } from '@api/api'

  export default {
    name: "ShipinstructionShow",

    data() {
      return {
        page: { // 分页
          total: 0, // 共多少条
          pageSize: 5, // 一页多少条
          pageNum: 0, // 共多少页
          currentPage: 1, // 当前页
          jumpPage: 1, // 跳转到第几页,
        },
        visible: false,
        dic: { // 下拉框选项
          task_status:[],
        },
        columns: [ // 表头

          { title: '过程指令单号', dataIndex: 'id', align: 'center' },

          {
            title: '发运流转单号',
            dataIndex: 'shippingFlowSheet',
            key: 'shippingFlowSheet',
            align: 'center',
            scopedSlots: { customRender: 'shippingFlowSheet' },
          },

          { title: '戴卡部件号', dataIndex: 'wheelShape', align: 'center' },
          { title: '订单号', dataIndex: 'customerOrder', align: 'center' },
          { title: '样件批次号', dataIndex: 'batchNumber', align: 'center' ,

          },

          { title: '轮型尺寸', dataIndex: 'wheelShapeSize', align: 'center' },
          { title: '影响流程', dataIndex: 'influenceProcess', align: 'center' },
          {
            title: '操作',
            dataIndex: 'operate',
            width: 200,
            align: 'center',
            // fixed: 'right',
            scopedSlots: { customRender: 'operate' },
          },
        ],
        dataSource: [], // 数据
      }},
    mounted() {
      this.getDic();
    },
    methods : {

      getDic() { // 获取表单中的部分字段对应的字典
        for (let name in this.dic) {
          let searchName = this.humpOrLine(name, 'toLine');
          getOptions(searchName, '').then((data) => {
            this.dic[name] = data;
          });
        }
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
      handleCancel() {

        this.visible = false;
        this.closeCurrent();
        this.$router.back(-1);
      },
      pageChange(val) { // 分页改变
        this.page.currentPage = val;
        this.searchQuery();
      },

      editRow(row, index, type) {
        this.$router.push({
            path: `/shipInstructionManage/instructionEditShip`,
            query: {
              id: row.id,
              type: type
            },
          },
        );
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

      getInstructions(shipmentProcessOrderIds) {
        this.visible = true;
        // this.getDic();
        getShipinstruction(shipmentProcessOrderIds,this.page.currentPage,this.page.pageSize).then((data) => {

          this.$nextTick(() => {
            if (!data.result) {
              this.dataSource = [];
            } else {
              for (let i = 0; i < data.result.length; i++) { // 遍历返回的数据列表
                for(let j=0;j<this.dic['task_status'].length;j++){
                  if (Number(data.result[i].influenceProcess) === Number(this.dic['task_status'][j].value)) { // 找到value相等时对应的label
                    data.result[i].influenceProcess = this.dic['task_status'][j].label;
                  }
                }
              }
              this.dataSource = data.result;
              this.page.total = data.count;
              this.page.pageNum =Math.ceil(this.page.total/this.page.pageSize);
            }
          });

        });
      },
    },

  }
</script>

<style scoped>
  .bottom-page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }
</style>