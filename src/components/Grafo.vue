<template>
  <div class="workspace">
    <div class="node-counter">
      <h2>Nodos creados: {{ nodos_creados }}</h2>
    </div>
    <div class="node-container">
      <svg class="connectors">
        <line
          v-for="E in edges_to_render"
          :key="E.id"
          :x1="E.position.a.x"
          :y1="E.position.a.y"
          :x2="E.position.b.x"
          :y2="E.position.b.y"
          @mouseover="show_value(E.peso)"
        >
          asasas
        </line>
      </svg>
      <Nodo
        v-for="N in Grafo"
        :key="N.id"
        :id="N.id"
        :tool="selected_option"
      />
    </div>
    <div class="grafo-adm">
      <div id="+-">
        <v-btn
          class="boton"
          :disabled="process"
          elevation="2"
          small
          @click="Insertar_nodo"
          >Añadir Nodo</v-btn
        >
        <v-btn
          class="boton"
          :disabled="process"
          elevation="2"
          small
          @click="Eliminar_nodo"
          >Eliminar Nodo</v-btn
        >
        <v-btn
          class="boton"
          :disabled="process"
          elevation="2"
          small
          @click="Dijkstra"
          >Iniciar Cálculo</v-btn
        >
        <v-btn class="boton" elevation="2" small @click="reload"
          >Reiniciar</v-btn
        >
        <v-snackbar v-model="message_activator" :timeout="timeout">
          {{ message }}

          <template>
            <v-btn color="pink" text @click="close_message">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </div>
      <label for="+-"
        >*Añadir o eliminar un nodo eliminará todas las aristas</label
      >
      <br />
      <input
        type="radio"
        id="select_origin"
        value="S-O"
        v-model="selected_option"
      />
      <label for="select_origin">Seleccionar origen</label>
      <br />
      <input
        type="radio"
        id="create_edge"
        value="C-E"
        v-model="selected_option"
      />
      <label for="create_edge">Crear arista (relecciona dos nodos para unirlos)</label>
      <div>Coloca el cursor sobre la arista para visualizar su valor</div>
      <div>valor arista: {{value}}</div>
      <br />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Nodo from "./Nodo.vue";
import Store from "../store/index";
export default {
  name: "Grafo",
  created() {},
  data() {
    return {
      selected_option: "",
      process: false,
      timeout: 20000,
      value:""
    };
  },
  components: {
    Nodo,
  },
  methods: {
    ...mapMutations(["Insertar_nodo", "Eliminar_nodo", "Refresh", "Verificar","close_message"]),
    Dijkstra() {
      var startpoint;
      this.Verificar();
      if (!Store.state.ready_to_calculate) {
        return;
      }
      this.process = true;
      for (var nodo of Store.state.Grafo) {
        if (nodo.origin) {
          startpoint = nodo.id;
        }
      }
      this.Analizar_ruta(startpoint);
    },
    Analizar_ruta(nodo_actual) {
      var next = [];
      if (Store.state.visited.length == Store.state.nodos_creados) {
        return;
      }
      if (!Store.state.visited.includes(nodo_actual)) {
        for (var ruta of Store.state.Grafo[`${nodo_actual}`].edges) {
          if (Store.state.Grafo[`${ruta.route.out}`].visited) {
            continue;
          }
          var dist = Store.state.Grafo[`${nodo_actual}`].min_dist + ruta.peso;
          if (
            Store.state.Grafo[`${ruta.route.out}`].min_dist == "∞" ||
            Store.state.Grafo[`${ruta.route.out}`].min_dist > dist
          ) {
            Store.state.Grafo[`${ruta.route.out}`].min_dist = dist;
          }
          next.push(ruta.route.out);
        }
        Store.state.Grafo[`${nodo_actual}`].visited = true;
        Store.state.visited.push(nodo_actual);
        for (let i of next) {
          this.Analizar_ruta(i);
        }
      }
      console.log(Store.state.Grafo);
      this.Refresh();
    },
    reload() {
      location.reload();
    },
    show_value(peso){
      this.value = peso;
    }
  },
  computed: {
    ...mapState([
      "nodos_creados",
      "Grafo",
      "edges_to_render",
      "ready_to_calculate",
      "message",
      "message_activator"
    ]),
  },
};
</script>

<style lang="scss">
.workspace {
  width: 100%;
  height: 100%;
}
.node-container {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  box-sizing: border-box;
  position: relative;
}
.connectors {
  position: absolute;
  width: 100%;
  height: 100%;
  stroke: #000000;
  stroke-width: 6;
}
.boton {
  margin: 15px;
}
</style>
