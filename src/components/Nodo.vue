<template>
  <div
    v-bind:class="{
      par: id % 2 == 0,
      desconectado: this.listaNodosDesconectados.includes(this.id),
    }"
  >
    <div>
      <div>
        <button
          class="node"
          :id="createId()"
          @click="task(tool)"
          v-bind:class="{
            selected: (this.edgeData.a == this.id) | (this.edgeData.b == this.id),
          }"
        >
          <span>{{ `N->${id}` }}</span>
          <span>{{ `D= ${grafo[id].minDistance}` }}</span>
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
    ...mapState(["grafo", "edgeData", "listaNodosDesconectados"]),
  },
  methods: {
    ...mapMutations(["definirOrigen", "añadirEdge", "definirDestino", "createEdge"]),
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
        this.edgeData.a = undefined;
        this.edgeData.b = undefined;
        return;
      }
      if (tool == "S-D") {
        this.definirDestino(this.id);
        this.edgeData.a = undefined;
        this.edgeData.b = undefined;
        return;
      }
      if (tool == "C-E") {
        this.calculatePosition();
        this.createEdge([this.id, this.position]);
        if ((this.edgeData.a != undefined) & (this.edgeData.b !== undefined)) {
          this.dialog = true;
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
  border: 2px solid rgb(8, 112, 112);
  box-shadow: inset 2px 2px 2px 1px white;
  box-shadow: inset -2px -2px 2px 1px black;
  background-color: rgb(22, 199, 199);
  width: calc(40px + 2vw);
  height: calc(40px + 2vw);
  border-radius: 50%;
  margin: 40px;
  transition: box-shadow 0.5s;
}
.par {
  flex-grow: 2;
  margin-top: 80px;
}
.destino .node {
  background-color: rgb(155, 43, 43);
  box-shadow: inset -2px -2px 2px 1px white;
  box-shadow: inset 2px 2px 2px 1px black;
}
.origen .node {
  background-color: rgb(52, 155, 43);
  box-shadow: inset -2px -2px 2px 1px white;
  box-shadow: inset 2px 2px 2px 1px black;
}
@keyframes pulse {
  from {
    box-shadow: 0px 0px 9px -3px rgb(50, 156, 226);
  }

  to {
    box-shadow: 0px 0px 25px 1px rgb(50, 156, 226);
  }
}
.selected {
  animation-duration: 0.5s;
  animation-name: pulse;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
.desconectado {
  visibility: hidden;
}
</style>
