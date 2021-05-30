<template>
  <svg>
    <line :x1="this.x1" :y1="this.y1" :x2="this.x2" :y2="this.y2"></line>
    <text class="edge-value" :x="(x2 + x1 + 5) / 2" :y="(y2 + y1 - 15) / 2">
      {{ peso }}
    </text>
  </svg>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Edge",
  created() {},
  data() {
    return {};
  },
  computed: {
    ...mapState(["value"]),
  },
  props: ["x1", "x2", "y1", "y2", "peso", "id"],
  methods: {
    showValue() {
      this.value = this.peso;
    },
  },
};
</script>

<style lang="scss" scoped>
.edge-value {
  stroke-width: 1;
  transition: all 2s;
}
.route line {
  stroke: #3c09f3;
  animation-duration: 0.1s;
}
</style>
