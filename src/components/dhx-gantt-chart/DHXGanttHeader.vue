<template>
  <div>
    <button @click="exportToPNG">导出 PNG</button>
    <form class="gantt_control">
      <input type="radio" id="scale1" class="gantt_radio" name="scale" value="day" v-model="modelV"/>
      <label for="scale1">Day scale</label>

      <input type="radio" id="scale2" class="gantt_radio" name="scale" value="week" v-model="modelV"/>
      <label for="scale2">Week scale</label>

      <input type="radio" id="scale3" class="gantt_radio" name="scale" value="month" v-model="modelV"/>
      <label for="scale3">Month scale</label>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Gantt: this.$parent.Gantt,
      modelV: "day",
      options: [
        { value: "day", label: "天" },
        { value: "week", label: "周" },
        { value: "month", label: "月" }
      ]
    };
  },
  watch: {
    modelV(value) {
      this.$parent.setZoomimg(value);
    }
  },
  methods: {
    exportToPNG() {
      // https://docs.dhtmlx.com/gantt/samples/06_skins/06_dynamic_skin.html
      this.$parent.exportChart();
    }
  }
};
</script>

<style>
.dthmlx-gantt-header {
  background-color: #ebedef;
  border: 1px solid #ced2d8;
}
</style>
