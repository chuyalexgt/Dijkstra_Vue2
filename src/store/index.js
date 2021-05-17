import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    nodosCreados: 0,
    maxNodos: 30,
    readyToCalculate: false,
    message: "",
    messageActivator :false,
    edgesToRender: [],
    createdEdges : [],
    visited :[],
    edgeCounter : 0,
    Grafo: [],
    edgeData : {
      a: undefined,
      b: undefined,
      valueEdge: undefined,
      aPos: undefined,
      bPos: undefined,
    }
  },
  mutations: {
  insertarNodo (state) {
      if (state.nodosCreados >= state.maxNodos){
        state.messageActivator = true
        state.message = "Se superó el maximo de nodos permitidos"
        return
      }
      state.Grafo[`${state.nodosCreados}`] = {
          id: state.nodosCreados,
          minDistance: "∞",
          visited: false,
          edges: [],
          origin: false
      }
      state.nodosCreados ++
      state.edgesToRender = []
      state.createdEdges = []
      for(let e of state.Grafo){
        e.edges = []
      }
  },
  eliminarNodo (state) {
    if (state.nodosCreados <= 0){
      state.messageActivator = true
      state.message = "No hay mas nodos para eliminar"
      return
    }
    state.Grafo.pop()
    state.nodosCreados --
    state.edgesToRender = []
    for(let e of state.Grafo){
      e.edges = []
    }
  },
  añadirEdge (state) {
      if(state.edgeData.a == state.edgeData.b){
        state.messageActivator = true
        state.message = "No se puede unir un nodo a si mismo"
        return
      }
      let edge = {peso : state.edgeData.valueEdge, route : {in : state.edgeData.a,out : state.edgeData.b}, position : { a : state.edgeData.aPos, b : state.edgeData.bPos}, id : state.edgeCounter }
      for (let i of state.createdEdges){
        if( i == (`${edge.route.in}-${edge.route.out}`)|(`-${edge.route.out}-${edge.route.in}`)){
          state.messageActivator = true
          state.message = "ya existe una arista entre esos dos nodos"
          return
        }
      }
      state.createdEdges.push(`${edge.route.in}-${edge.route.out}`)
      state.edgesToRender.push(edge)
      state.Grafo[`${state.edgeData.a}`].edges.push(edge)
      state.edgeCounter ++
      edge = {peso : state.edgeData.valueEdge , route : {in : state.edgeData.b,out : state.edgeData.a}, position : { a : state.edgeData.bPos, b : state.edgeData.aPos}, id : state.edgeCounter  }
      state.createdEdges.push(`${edge.route.in}-${edge.route.out}`)
      state.Grafo[`${state.edgeData.b}`].edges.push(edge)
      state.edgeCounter ++
  },
  definirOrigen(state,selectNode){
    for(let nodo of state.Grafo){
      if (nodo.origin){
          state.Grafo[`${nodo.id}`].minDistance = "∞"
          state.Grafo[`${nodo.id}`].visited = false
          state.Grafo[`${nodo.id}`].origin = false
      }
    }
    state.Grafo[`${selectNode}`].minDistance = 0
    state.Grafo[`${selectNode}`].visited = true
    state.Grafo[`${selectNode}`].origin = true
    let aux = state.Grafo.pop()
    state.Grafo.push(aux)
    state.messageActivator = true
    state.message = `se ha definido ${selectNode} como el origen`
  },
  refresh(state){
    let aux = state.Grafo.pop()
    state.Grafo.push(aux)
  },
  verificar(state){
    let origin = false
    let edge = false
    for(let nodo of state.Grafo){
      if (nodo.origin){
        origin = true
      }
    }
    if(state.createdEdges.length != 0){
      edge = true
    }
    if(origin & edge){
      state.messageActivator = true
      state.message = "Calculo Realizado"
      state.readyToCalculate = true
    }
    if(!origin){
      state.messageActivator = true
      state.message =  "No se ha fijado un origen"
    }
    if(!edge){
      state.messageActivator = true
      state.message =  "No se ha fijado ninguna arista"
    }
  },
  closeMessage(state){
    state.messageActivator = false
  }
  },

})

export default store