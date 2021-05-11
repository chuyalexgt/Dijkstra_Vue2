<template>
  <svg>
    <line :x1="this.x1" :y1="this.y1" :x2="this.x2" :y2="this.y2"></line>
    <text class="edge-value" :x="(x2 + x1 + 40) / 2" :y="(y2 + y1 - 15) / 2">
      {{ peso }}
    </text>
  </svg>
</template>

<script>
export default {
  name: "Edge",
  created() {},
  data() {
    return {};
  },
  props: ["x1", "x2", "y1", "y2", "peso"],
  methods: {
    showValue() {
      Store.state.value = this.peso;
    },
  },
};
</script>

<style lang="scss" scoped>
.edge-value {
  stroke-width: 1;
}
</style>
