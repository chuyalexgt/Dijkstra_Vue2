<template>
  <div v-bind:class="{ par: id % 2 == 0 }">
    <div>
      <div>
        <button class="node" :id="createId()" @click="task(tool)">
          <span>{{ `N->${id}` }}</span>
          <span>{{ `D= ${Grafo[id].minDistance}` }}</span>
        </button>
      </div>
    </div>
    <v-container v-if="dialog">
      <v-app>
        <v-dialog
          v-model="dialog"
          persistent
          max-width="30%"
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-card-title>
              <span class="headline">Definir valor de arista</span>
            </v-card-title>
            <v-card-text>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="value"
                  label="Edge value"
                  :rules="formRules"
                  required
                  v-on:keyup.enter="validate"
                  ref="form"
                >
                </v-text-field>
              </v-col>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" @click="validate" text> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-app>
    </v-container>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "Nodo",
  created() {},
  data() {
    return {
      dialog: false,
      formRules: [(v) => v > -1 || "ingresa un numero"],
      value: undefined,
      readyToMerge: false,
      position: undefined,
    };
  },
  props: ["id", "tool"],
  computed: {
    ...mapState(["Grafo", "edgeData"]),
  },
  methods: {
    ...mapMutations(["definirOrigen", "añadirEdge"]),
    task(tool) {
      if (this.readyToMerge) {
        this.edgeData.valueEdge = parseInt(this.value, 10);
        this.value = undefined;
        this.añadirEdge();
        this.edgeData.valueEdge = undefined;
        this.edgeData.a = undefined;
        this.edgeData.b = undefined;
        this.readyToMerge = false;
        return;
      }
      if (tool == "S-O") {
        this.definirOrigen(this.id);
        return;
      }
      if (tool == "C-E") {
        this.calculatePosition();
        if ((this.edgeData.a == undefined) & (this.edgeData.b == undefined)) {
          this.edgeData.a = this.id;
          this.edgeData.aPos = this.position;
          return;
        }
        if (
          (this.edgeData.a != undefined) &
          (this.edgeData.b == undefined) //
        ) {
          this.edgeData.b = this.id;
          this.edgeData.bPos = this.position;
          this.dialog = true;
          return;
        }
      }
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.dialog = false;
        this.readyToMerge = true;
        this.task();
      }
    },
    createId() {
      return this.id;
    },
    calculatePosition() {
      let nodo = document.getElementById(`${this.id}`);
      let p = nodo.getBoundingClientRect();
      this.position = {
        x: p.x + 32.2,
        y: p.y,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.node {
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-self: center;
  justify-content: center;
  background-color: rgb(43, 155, 155);
  width: calc(40px + 2vw);
  height: calc(40px + 2vw);
  border-radius: 50%;
  margin: 40px;
}
.par {
  flex-grow: 2;
  margin-top: 80px;
}
</style>
