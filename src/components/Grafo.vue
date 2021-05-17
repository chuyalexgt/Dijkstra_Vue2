<template>
  <div class="workspace">
    <div class="node-counter">
      <h2>Nodos creados: {{ nodosCreados }}</h2>
    </div>
    <div class="node-container">
      <svg class="connectors">
        <Edge
          v-for="E in edgesToRender"
          :key="E.id"
          :x1="E.position.a.x"
          :y1="E.position.a.y"
          :x2="E.position.b.x"
          :y2="E.position.b.y"
          :peso="E.peso"
        ></Edge>
      </svg>
      <Nodo v-for="N in this.Grafo" :key="N.id" :id="N.id" :tool="selectedOption" />
    </div>
    <div class="this.Grafo-adm">
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
      <input type="radio" id="create_edge" value="C-E" v-model="selectedOption" />
      <label for="create_edge">Crear arista (relecciona dos nodos para unirlos)</label>
      <br />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "this.Grafo",
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
    Dijkstra() {
      let startpoint;
      this.verificar();
      if (!this.readyToCalculate) {
        return;
      }
      this.process = true;
      for (let nodo of this.Grafo) {
        if (nodo.origin) {
          startpoint = nodo.id;
        }
      }
      this.analizarRuta(startpoint);
    },
    analizarRuta(nodoActual) {
      let next = [];
      if (this.visited.length == this.nodosCreados) {
        return;
      }
      if (!this.visited.includes(nodoActual)) {
        for (let ruta of this.Grafo[`${nodoActual}`].edges) {
          // if (this.Grafo[`${ruta.route.out}`].this.visited) {  //esto hace que no sirva
          //   continue;
          // }
          let dist = this.Grafo[`${nodoActual}`].minDistance + ruta.peso;
          if (
            this.Grafo[`${ruta.route.out}`].minDistance == "∞" ||
            this.Grafo[`${ruta.route.out}`].minDistance > dist
          ) {
            this.Grafo[`${ruta.route.out}`].minDistance = dist;
          }
          next.push(ruta.route.out);
        }
        // this.Grafo[`${nodoActual}`].this.visited = true;   //esto hace que no sirva
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
      "Grafo",
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
