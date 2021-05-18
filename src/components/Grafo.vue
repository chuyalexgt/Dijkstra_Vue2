<template>
  <div class="workspace">
    <div class="node-counter">
      <h2>Nodos creados: {{ nodosCreados }}</h2>
    </div>
    <div class="node-container">
      <svg class="connectors">
        <Edge
          v-bind:class="{ route: marcarRuta(E.id) }"
          v-for="E in edgesToRender"
          :key="E.id"
          :id="E.id"
          :x1="E.position.a.x"
          :y1="E.position.a.y"
          :x2="E.position.b.x"
          :y2="E.position.b.y"
          :peso="E.peso"
        ></Edge>
      </svg>
      <Nodo
        v-for="N in this.grafo"
        :key="N.id"
        :id="N.id"
        :tool="selectedOption"
        v-bind:class="{
          destino: N.destiny,
          origen: N.origin,
        }"
      />
    </div>
    <div class="this.grafo-adm">
      <div id="+-">
        <v-btn class="boton" :disabled="process" elevation="2" small @click="insertarNodo"
          >Añadir Nodo</v-btn
        >
        <v-btn class="boton" :disabled="process" elevation="2" small @click="eliminarNodo"
          >Eliminar Nodo</v-btn
        >
        <v-btn class="boton" :disabled="process" elevation="2" small @click="Dijkstra"
          >Iniciar Cálculo</v-btn
        >
        <v-btn class="boton" elevation="2" small @click="reload">Reiniciar</v-btn>
        <v-snackbar v-model="messageActivator" :timeout="timeout">
          {{ message }}

          <template>
            <v-btn color="pink" text @click="closeMessage"> Close </v-btn>
          </template>
        </v-snackbar>
      </div>
      <label for="+-">*Añadir o eliminar un nodo eliminará todas las aristas</label>
      <br />
      <input type="radio" id="select_origin" value="S-O" v-model="selectedOption" />
      <label for="select_origin">Seleccionar origen</label>
      <br />
      <input type="radio" id="createDestiny" value="S-D" v-model="selectedOption" />
      <label for="createDestiny">Seleccionar destino</label>
      <br />
      <input type="radio" id="createEdge" value="C-E" v-model="selectedOption" />
      <label for="createEdge">Crear arista (relecciona dos nodos para unirlos)</label>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import _ from "lodash";
export default {
  name: "this.grafo",
  created() {},
  data() {
    return {
      selectedOption: "",
      process: false,
      timeout: 20000,
    };
  },
  methods: {
    ...mapMutations([
      "insertarNodo",
      "eliminarNodo",
      "refresh",
      "verificar",
      "closeMessage",
    ]),
    marcarRuta(id) {
      for (let e of this.grafo) {
        if (e.destiny) {
          if (e.routeToArrive.includes(id)) {
            return true;
          }
        }
      }
    },
    Dijkstra() {
      let startpoint;
      this.verificar();
      if (!this.readyToCalculate) {
        return;
      }
      this.process = true;
      for (let nodo of this.grafo) {
        if (nodo.origin) {
          startpoint = nodo.id;
        }
      }
      this.analizarRuta(startpoint);
    },
    analizarRuta(nodoActual) {
      let next = [];
      //condicion de corte
      if (this.visited.length == this.nodosCreados) {
        return;
      }
      // condicion recursiva
      if (!this.visited.includes(nodoActual)) {
        for (let ruta of this.grafo[`${nodoActual}`].edges) {
          let dist = this.grafo[nodoActual].minDistance + ruta.peso;
          let aux = _.cloneDeep(this.grafo[nodoActual].routeToArrive);
          aux.push(ruta.id);
          if (
            this.grafo[`${ruta.route.out}`].minDistance == "∞" ||
            this.grafo[`${ruta.route.out}`].minDistance > dist
          ) {
            this.grafo[`${ruta.route.out}`].minDistance = dist;
            this.grafo[`${ruta.route.out}`].routeToArrive = aux;
          }
          next.push(ruta.route.out);
        }
        this.visited.push(nodoActual);
        for (let i of next) {
          this.analizarRuta(i);
        }
      }
      this.refresh();
    },
    reload() {
      location.reload();
    },
  },
  computed: {
    ...mapState([
      "nodosCreados",
      "grafo",
      "edgesToRender",
      "readyToCalculate",
      "message",
      "messageActivator",
      "visited",
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
