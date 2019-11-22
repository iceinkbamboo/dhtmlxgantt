<template>
  <div ref="gantt"></div>
</template>
<script src="js/gantt/locale_cn.js"></script>
<script>
import { timestampConver } from "../utils/public";
import "dhtmlx-gantt";
export default {
  name: "gantt",
  props: {
    tasks: {
      type: Object,
      default() {
        return { data: [], links: [] };
      }
    },
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    holiday: {
      type: Array,
      default() {
        return [];
      }
    },
    ganttH: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  watch: {
    tasks: {
      //深度监听，可监听到对象、数组的变化
      handler(newV, oldV) {
        if (newV != oldV) {
          // 清除旧数据
          gantt.clearAll();
          // 重新渲染
          this.ganttInt();
        }
      },
      deep: true
    },
    ganttH: {
      handler(newV, oldV) {
        if (newV != oldV) {
          this.ganttInt();
          let h = this.$props.ganttH - 38;
          document.getElementsByClassName("gantt_container")[0].style.height =
            h + "px";
        }
      }
    }
  },
  mounted: function() {
    // 首次渲染
    this.ganttInt();
  },
  methods: {
    ganttInt() {
      // 动态改变gantt高度
      setTimeout(() => {
        let h = this.$props.ganttH - 38;
        document.getElementsByClassName("gantt_container")[0].style.height =
          h + "px";
      }, 10);
      let that = this;
      // 自定义左侧栏
      gantt.config.columns = this.$props.columns;
      // 日期中文显示
      gantt.locale = {
        date: {
          month_full: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
          ],
          month_short: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月"
          ],
          day_full: [
            "星期日",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六"
          ],
          day_short: ["日", "一", "二", "三", "四", "五", "六"]
        },
        labels: {
          dhx_cal_today_button: "今天",
          day_tab: "日",
          week_tab: "周",
          month_tab: "月",
          new_event: "新建日程",
          icon_save: "保存",
          icon_cancel: "关闭",
          icon_details: "详细",
          icon_edit: "编辑",
          icon_delete: "删除",
          confirm_closing: "请确认是否撤销修改!", //Your changes will be lost, are your sure?
          confirm_deleting: "是否删除日程?",
          section_description: "描述",
          section_time: "时间范围",
          section_type: "类型",

          /* grid columns */

          column_text: "任务名",
          column_start_date: "开始时间",
          column_duration: "持续时间",
          column_add: "",

          /* link confirmation */

          link: "关联",
          confirm_link_deleting: "将被删除",
          link_start: " (开始)",
          link_end: " (结束)",

          type_task: "任务",
          type_project: "项目",
          type_milestone: "里程碑",

          minutes: "分钟",
          hours: "小时",
          days: "天",
          weeks: "周",
          months: "月",
          years: "年"
        }
      };
      // 禁止编辑
      gantt.config.readonly = true;
      // start_time,end_time格式设置
      gantt.config.date_format = "%Y-%m-%d";
      // 单击事件
      gantt.attachEvent("onTaskClick", (id, e) => {
        // 获取当前任务，包含该任务的属性
        let task = gantt.getTask(id);
        let target = e.target || e.srcElement;
        if (target.className === "gantt_task_content") {
          // 当前点击右侧日历任务
          // 获取当前点击项目的jira路径
          let url = task.url;
          window.open(`${url}`, "_blank");
          return false;
        } else {
          // 当前点击左侧栏，右侧日历定位到本任务
          return true;
        }
      });
      //上方栏设置
      gantt.config.scale_unit = "day"; //"minute", "hour", "day", "week", "quarter", "month", "year"
      gantt.config.scale_height = 50;
      gantt.config.min_column_width = 80;

      gantt.attachEvent("onTemplatesReady", function() {
        // 依照年月日周显示日期
        gantt.templates.date_scale = function(date) {
          let y = gantt.date.date_to_str("%Y/%n/%j");
          y = y(date);
          let d = gantt.date.date_to_str("周%D");
          let md = d(date);
          let cy =
            '<div style="font-size:1.2em; height:20px; line-height:20px;">' +
            y +
            "</div>";
          let cd =
            '<div style="font-size:1.1em; height:15px; line-height:15px;">' +
            md +
            "</div>";
          return '<div style="padding:10px 0px;">' + cy + cd + "</div>";
        };

        // 右侧任务时间栏样式
        gantt.templates.scale_cell_class = function(date) {
          // 判断节假日
          // 需要每年的节假日日期,使用时间戳（毫秒）
          let holiday = that.$props.holiday;
          let isExit = holiday.find(item => {
            return (
              timestampConver(item.time) == timestampConver(date.getTime())
            );
          });
          if (isExit) {
            return "dhtmlxgantt_weekend";
          } else {
            return "dhtmlxgantt_workday";
          }
        };
        // 右侧任务栏列样式
        gantt.templates.timeline_cell_class = function(start, end, item) {
          let holiday = that.$props.holiday;
          let isExit = holiday.find(item => {
            return timestampConver(item.time) == timestampConver(end.getTime());
          });
          if (isExit) {
            return "dhtmlxgantt_weekend";
          }
        };
        // 右侧条状图背景颜色更改
        // 可根据自定义条件设置不同颜色
        // flag,1开发中，2已完成
        gantt.templates.task_class = function(start, end, item) {
          return item.status
            ? item.flag == 1
              ? "gannt_task_calss_rd"
              : "gannt_task_calss_finish"
            : "gannt_task_calss_error";
        };
        // 左侧title样式修改
        gantt.templates.grid_header_class = function(columnName, column) {
          return "dhtmlxgantt_header";
        };
      });
      // 设置右侧日历的开始时间和结束时间
      gantt.config.start_date = new Date("2019/1/1");
      gantt.config.end_date = new Date(
        timestampConver(
          parseInt(new Date().getTime()) + 31 * 24 * 60 * 60 * 1000
        )
      );

      // 发生异常时，允许弹出警告到UI界面
      gantt.config.show_errors = true;

      // 初始化
      gantt.refreshData();
      gantt.init(this.$refs.gantt);
      gantt.parse(this.$props.tasks);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";
// 左侧头部样式
/deep/.dhtmlxgantt_header {
  color: #000000 !important;
  font-size: 14px;
  font-weight: 500;
}
// 右侧头部样式
/deep/.dhtmlxgantt_weekend {
  background: #d8d4d4 !important;
  color: #696767 !important;
  opacity: 0.6;
}
/deep/.dhtmlxgantt_workday {
  color: #000000 !important;
}
// 右侧任务样式
/deep/.gannt_task_calss_rd {
  border-color: #669933;
  background: #669933;
}
/deep/.gannt_task_calss_qa {
  border-color: #95cc9c;
  background: #95cc9c;
}
/deep/.gannt_task_calss_error {
  border-color: red;
  background: red;
}
/deep/.gannt_task_calss_finish {
  border-color: #8a8686;
  background: #8a8686;
}
// 选中行样式（左/右）
/deep/.gantt_task_row.gantt_selected {
  background: #f1debb;
}
/deep/.gantt_grid_data .gantt_row.gantt_selected {
  background: #f1debb;
}
// 选中行右侧单元格样式
/deep/.gantt_task_row.gantt_selected .gantt_task_cell {
  border-color: #f1debb;
}
// 左侧行鼠标悬浮时样式
/deep/.gantt_grid_data .gantt_row:hover {
  background: #f1debb;
}
// 设置时间段显示初始值为当前，样式修改
/deep/.gantt_data_area,
/deep/.gantt_grid_data {
  position: absolute;
  top: 15px;
  z-index: 666;
}
/deep/.gantt_grid_scale {
  position: absolute;
  z-index: 888;
  background: #ffffff;
}
/deep/.gantt_scale_line {
  height: 50px !important;
  position: absolute;
  z-index: 888;
  background: #ffffff;
  border-bottom: 1px solid #cccccc !important;
}
</style>
