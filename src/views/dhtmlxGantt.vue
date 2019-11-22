<template>
  <div class="gantt">
    <div class="gantt-content" ref="gantt">
      <Gantt
        v-if="tasks && ganttH"
        :style="{ height: ganttH + 'px' }"
        class="human-main-gantt"
        :tasks="tasks"
        :columns="columns"
        :holiday="holiday"
        :ganttH="ganttH"
      ></Gantt>
    </div>
  </div>
</template>

<script>
import Gantt from "../components/gantt";
import "dhtmlx-gantt";
import { timestampConver2 } from "../utils/public";
export default {
  name: "gantt",
  components: { Gantt },
  data() {
    return {
      windowHeight: document.body.clientWidth, // 框口高度
      ganttH: 0, // 资源日历高度
      tasks: {
        data: []
      }, // 资源日历数据
      columns: null, // 资源日历左侧栏title
      holiday: [], // 非工作日
      timer: null
    };
  },
  watch: {
    windowHeight() {
      if (!this.timer) {
        this.timer = true;
        let that = this;
        setTimeout(() => {
          let mainH = that.$refs.gantt.clientHeight;
          that.ganttH = mainH;
          that.timer = false;
        }, 400);
      }
    }
  },
  created() {
    // 左侧栏
    this.columns = [
      {
        name: "name", //自定义字段
        label: "人员", //用于界面展示的名称
        tree: false, // 是否是树形结构
        align: "center", // 文字对齐方式
        width: "80" //为*是自适应宽度
      },
      {
        name: "project",
        label: "项目",
        align: "center",
        width: "150"
      }
    ];

    // 非工作日
    this.holiday = [
      {
        time: 1546331094449
      },
      {
        time: 1546676694449
      }
    ];
  },
  mounted() {
    this.ganttH = this.$refs.gantt.clientHeight;
    console.log(this.ganttH);
    // 监听窗口改变
    let that = this;
    window.addEventListener("resize", function() {
      that.windowHeight = document.body.clientHeight;
    });

    // 数据，第一项，空项目，为了使右侧时间周期定位到当前天
    let data = [
      {
        id: 1,
        name: "",
        project: "",
        text: "",
        start_date: timestampConver2(new Date()),
        end_date: timestampConver2(new Date()),
        url: ""
      },
      {
        id: 2,
        name: "小李",
        project: "项目二",
        text: "项目二详情",
        start_date: timestampConver2(new Date()),
        end_date: timestampConver2(
          new Date().getTime() + 3 * 24 * 60 * 60 * 1000
        ),
        url: "http://www.baidu.om",
        status: true,
        flag: 1
      },
      {
        id: 3,
        name: "小张",
        project: "项目三",
        text: "项目三详情",
        start_date: timestampConver2(
          new Date().getTime() + 10 * 24 * 60 * 60 * 1000
        ),
        end_date: timestampConver2(
          new Date().getTime() + 14 * 24 * 60 * 60 * 1000
        ),
        url: "http://www.baiduc.om",
        status: true,
        flag: 0
      }
    ];
    this.tasks.data = data;
  }
};
</script>

<style lang="less" scoped>
.gantt {
  height: 100%;
  padding: 40px;
  box-sizing: border-box;

  &-content {
    width: 100%;
    height: 100%;
  }
}
</style>
