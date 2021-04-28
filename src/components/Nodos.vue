<template>
  <div v-bind:class="{ par : id%2 == 0 }">
    <div>
      <div>
        <button class="node" :id="create_id()" @click="Task(tool)">
          <span>{{ `N->${id}` }}</span>
          <span>{{ `D= ${Grafo[id].min_dist}` }}</span>
        </button>
      </div>
    </div>
    <template v-if="dialog">
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
              <v-form lazy-validation ref="form">
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="value"
                    label="Edge value"
                    :rules="formRules"
                    required
                  >
                  </v-text-field>
                </v-col>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" @click="validate" text>
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-app>
    </template>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Store from "../store/index";
export default {
  name: "Nodos",
  created() {},
  data() {
    return {
      dialog: false,
      formRules: [(v) => v > -1 || "ingresa un numero"],
      value: undefined,
      ready_to_merge: false,
      position: undefined,
    };
  },
  props: ["id", "tool"],
  computed: {
    ...mapState(["Grafo", "edge_data"]),
  },
  methods: {
    ...mapMutations(["Definir_origen", "Añadir_edge"]),
    Task(tool) {
      if (this.ready_to_merge) {
        Store.state.edge_data.value_edge = parseInt(this.value,10);
        this.value = undefined;
        this.Añadir_edge();
        Store.state.edge_data.value_edge = undefined;
        Store.state.edge_data.a = undefined;
        Store.state.edge_data.b = undefined;
        this.ready_to_merge = false;
        return;
      }
      if (tool == "S-O") {
        this.Definir_origen(this.id);
        return;
      }
      if (tool == "C-E") {
        this.calculate_pos();
        if (
          (Store.state.edge_data.a == undefined) &
          (Store.state.edge_data.b == undefined)
        ) {
          Store.state.edge_data.a = this.id;
          Store.state.edge_data.a_pos = this.position;
          return;
        }
        if (
          (Store.state.edge_data.a != undefined) &
          (Store.state.edge_data.b == undefined) //
        ) {
          Store.state.edge_data.b = this.id;
          Store.state.edge_data.b_pos = this.position;
          this.dialog = true;
          return;
        }
      }
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.dialog = false;
        this.ready_to_merge = true;
        this.Task();
      }
    },
    create_id() {
      return this.id;
    },
    calculate_pos() {
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
.par{
  flex-grow: 2;
  margin-top: 80px
}
</style>
