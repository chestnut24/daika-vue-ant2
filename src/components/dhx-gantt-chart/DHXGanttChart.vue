<template>
  <div class="dhtmlx-gantt-con" :style="{height:height}">
    <div class="main" ref="ganttMain">
      <slot name="header" ref="gheader" />
      <div ref="gantt" class="dhtmlx-gantt"  />
    </div>
  </div>
</template>

<script>
  import {formatDate, getDaysBetween, moveArrItem, plusDate} from "@/utils/util";
  import moment from "moment";
  let initNum=1
  export default {
    name: "DHXGanttChart",
    props: {
      config: {
        type: Object,
        required: false,
        default() {
          return {};
        }
      },
      templates: {
        type: Object,
        required: false,
        default() {
          return {};
        }
      },
      tasks: {
        type: Object,
        default() {
          return {data: [], links: []};
        }
      },
      plugins: {
        type: Object,
        required: false,
        default() {
          return {
            tooltip: true, marker: true, auto_scheduling: true
          };
        }
      }
    },
    data() {
      return {
        Gantt: null,
          height:window.innerHeight-280+'px',
          moment,
          defaultConfig: {
          readonly: false, // 开启只读模式
          autofit: true,
          autosize: true,
          fit_tasks: false,
          grid_width: 400,
          min_grid_column_width: 80,
          // 表头高度
          scale_height: 50,
          // 行高
          row_height: 45,
          // 横柱图高度
          task_height: 30,
          select_task: true,
          min_column_width: 50,
          // inherit_scale_class: true,
          // open_tree_initially: true,
          order_branch: true,
          order_branch_free: true,
          // open_split_tasks: true,
          link_line_width: 2,
          link_arrow_size: 6,
          // 自定义配置：任务名称属性名、开始时间属性名、结束时间属性名、持续时间属性名、前置任务属性名
          textProp: 'name',
          startDateProp: 'start_date',
          endDateProp: 'end_date',
          durationProp: 'duration',
          preTaskProp: 'preProcess'
        },
      };
    },
    methods: {
      init() {
        // 使用新实例创建，保证能够重复创建图表
        this.Gantt = window.Gantt.getGanttInstance();
        this.createGantt();
        this.createPlugins();
          if(initNum==1){
              this.createGanttEvents();
          }
          initNum++
      },
      createGantt() {
        Object.assign(this.defaultConfig, this.config);
        let config = this.defaultConfig;
        for (const c in config) {
          this.Gantt.config[c] = config[c];
        }
        for (const t in this.templates) {
          this.Gantt.templates[t] = this.templates[t];
        }
        // 任务横柱图样式
        this.Gantt.templates.task_class = function (start, end, task) {
          // console.info(task);
          // return 'bar-style' + task.$index;
          return 'bar-style-j' + task.jobStatus;
        }

      //  this.setZoomimg("day");

          var hourScaleTemplate = function (date) {
              var dateToStr = gantt.date.date_to_str("%G");
              var endDate =gantt.date.add(date, 6, "hour");
              if(dateToStr(endDate)=='0'){
                  return  '24';
              }else{
                  return  dateToStr(endDate);
              }
          };
          this.Gantt.config.scales = [
              {unit: "month", step: 1, format: "%M"},
              {unit: "day", step: 1, format: "%m.%d"},
              {unit: "hour", step:6, format:hourScaleTemplate}
          ];
          // 初始化
          let day=moment(new Date).format('yyyy/MM/DD')
          let day7=moment(new Date).add(7,'d').format('yyyy/MM/DD')
          this.Gantt.config.start_date =day
          this.Gantt.config.end_date =day7
          this.Gantt.config.min_column_width = 30;

        this.Gantt.config.scale_height = config.scale_height;
        this.Gantt.i18n.setLocale("cn");
        this.Gantt.init(this.$refs.gantt);
        this.setTasks();
      },
      createGanttEvents() {
        //单击任务
          this.Gantt.attachEvent("onTaskClick", (id) => {
            let task = this.Gantt.getTask(id);
            this.$emit('taskSelected', task);
        });
      },
      /**
       * 递归移动任务时间
       * @param task - 任务数据
       * @param taskSource - 任务源数据
       * @param step - 移动步长（天数）
       * @param type - 移动类型,，1-后置，-1-前置
       */
      recurMoveTasksDate(task, taskSource, step, type = 1) {
        let newStartDate = plusDate(task.start_date, step);
        let newEndDate = plusDate(task.end_date, step);
        task.start_date = newStartDate;
        task.end_date = newEndDate;
        // 更新任务信息
        this.Gantt.updateTask(task.id);
        // 更新数据源
        taskSource[this.defaultConfig.startDateProp] = formatDate(newStartDate, 'yyyy-MM-dd');
        taskSource[this.defaultConfig.endDateProp] = formatDate(plusDate(newEndDate, -1), 'yyyy-MM-dd');
        // 递归
        let taskSources;
        if (type > 0) {
          taskSources = this.getTaskSourceAll(task.id, this.defaultConfig.preTaskProp);
        }else {
          let preTaskIds = task[this.defaultConfig.preTaskProp] ? task[this.defaultConfig.preTaskProp].split(',') : [];
          taskSources = this.getTaskSourceAll(preTaskIds, 'id');
        }
        taskSources.forEach(cItem => {
          this.recurMoveTasksDate(this.Gantt.getTask(cItem.id), cItem, step, type);
        });
      },
      createPlugins() {
        this.Gantt.plugins(this.plugins);
      },
      setZoomimg(level, step = 1) {
        switch (level) {
          case "day":
            this.Gantt.config.scales = [
              {unit: "month", step: step, format: "%Y年%M"},
              {unit: "day", step: step, format: "%d"}
            ];
            this.Gantt.config.scale_height = this.defaultConfig.scale_height;
            break;
          case "week":
            var weekScaleTemplate = function (date) {
              var dateToStr = gantt.date.date_to_str("%M %d日");
              var endDate = gantt.date.add(
                gantt.date.add(date, 1, "week"),
                -1,
                "day"
              );
              return dateToStr(date) + " - " + dateToStr(endDate);
            };
            this.Gantt.config.scales = [
              // {unit: "week", step: 1, format: weekScaleTemplate},
              {unit: "month", step: step, format: "%M"},
              {unit: "week", step: step, format: "%M%d日"},
              // {unit: "day", step: 1, format: "%D"}
            ];

            this.Gantt.config.scale_height = this.defaultConfig.scale_height;
            break;
          case "month":
            this.Gantt.config.scales = [
              {unit: "month", step: step, format: "%Y年%M"},
              // {unit: "day", step: 1, format: "%j, 星期%D"}
              // {unit: "day", step: 1, format: "%j"}
            ];
            this.Gantt.config.scale_height = 37;
            break;
        }
        this.Gantt.render();
      },
      setTasks() {
        this.Gantt.parse(this.tasks);
      },
      getLinks() {
        return this.Gantt.getLinks()
      },
      /**
       * 获取任务数据源
       * @param val
       * @param by
       */
      getTaskSource(val, by = 'id') {
        return this.tasks.data.find(item => {
          return item[by] == val;
        });
      },
      /**
       * 获取任务数据源
       * @param val
       * @param by
       */
      getTaskSourceAll(val, by = 'id') {
        return this.tasks.data.filter(item => {
          if (val instanceof Array) {
            return val.includes(item[by]);
          }else {
            return item[by] == val;
          }
        });
      },
      refresh(tasks) {
        if (!tasks) return;
        // 删除旧数据
        this.tasks.data.forEach(item => {
          this.Gantt.deleteTask(item.id);
        });
        // 解析新数据
        this.Gantt.parse(tasks);
        this.Gantt.refreshData();
        this.Gantt.render();
      },
      refreshData() {
        this.Gantt.refreshData();
        this.Gantt.render();
      }
    },
      destroyed() {
          initNum=1
      }
  };
</script>

<style lang="less" scoped>
  .dhtmlx-gantt-con {
    overflow: hidden;
    overflow-y: scroll;
    max-height: none;
    display: flex;
    .main {
      width: calc(100% - 45px);
      flex: 1;
    }
    .options {
      display: inline-flex;
      flex-direction: column;
      padding: 15px 0 15px 15px;
      /deep/ .a-button {
        padding: 6px;
        font-size: 16px;
      }
      .opt-item {
        margin-bottom: 30px;
      }
    }
  }
  /deep/ .dhtmlx-gantt {
    position: relative;
    width: 100%;
    /*height: 500px;*/
    /*overflow: hidden;*/
  }

  /deep/ .today {
    background-color: orange;
    color: white;
  }

  /deep/ .week-end {
    background-color: #e8e8e87d;
  }

  /* gantt 样式 */
  /deep/ .gantt_tree_content {
    overflow: hidden;
  }
  /deep/ .gantt_layout_cell_border_left {
    border-left: 1px solid #EBEEF5 !important;
  }
  /deep/ .gantt_layout_cell_border_top {
    border-top: 1px solid #EBEEF5 !important;
  }
  /deep/ .gantt_layout_cell_border_bottom {
    border-bottom: 1px solid #EBEEF5 !important;
  }
  /deep/ .gantt_layout_cell_border_right:not(.gantt_resizer) {
    border-right: 2px solid #EBEEF5 !important;
  }
  /deep/ .gantt_row, .gantt_task_row {
    border-bottom: 1px solid #EBEEF5;
  }
  /deep/ .grid_cell.gantt_layout_cell_border_right {
    border-right: 2px solid #EBEEF5 !important;
  }
  /deep/ .gantt_resizer.gantt_layout_cell_border_right {
    border-right: none !important;
  }
  // 表格
  /deep/ .gantt_grid_scale .gantt_grid_head_cell {
    color: #909399 !important;
    font-weight: bold !important;
  }
  /deep/ .gantt_grid_scale, .gantt_task_scale {
    border-bottom: 1px solid #EBEEF5 !important;
  }
  /deep/ .gantt_grid_column_resize_wrap .gantt_grid_column_resize {
    background-color: #EBEEF5 !important;
  }
  // 图项
  /deep/ .gantt_task_line {
    background-color: rgb(96, 154, 179) ;
    border: none;
  }
  /deep/ .gantt_task_progress {
    background-color: rgb(32, 127, 223);
  }

  /deep/ .a-select.radio-select {
    width: 85px;
    margin-left: 5px;
    .a-input__inner {
      height: 32px;
      padding-left: 10px;
      line-height: 32px;
    }
    .a-input__icon {
      line-height: 32px;
    }
  }
</style>
