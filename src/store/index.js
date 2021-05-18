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
    grafo: [],
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
      state.grafo[`${state.nodosCreados}`] = {
          id: state.nodosCreados,
          minDistance: "∞",
          visited: false,
          edges: [],
          origin: false,
          destiny: false,
          routeToArrive : []
      }
      state.nodosCreados ++
      state.edgesToRender = []
      state.createdEdges = []
      for(let e of state.grafo){
        e.edges = []
      }
  },
  eliminarNodo (state) {
    if (state.nodosCreados <= 0){
      state.messageActivator = true
      state.message = "No hay mas nodos para eliminar"
      return
    }
    state.grafo.pop()
    state.nodosCreados --
    state.edgesToRender = []
    for(let e of state.grafo){
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
      state.grafo[`${state.edgeData.a}`].edges.push(edge)
      edge = {peso : state.edgeData.valueEdge , route : {in : state.edgeData.b,out : state.edgeData.a}, position : { a : state.edgeData.bPos, b : state.edgeData.aPos}, id : state.edgeCounter  }
      state.createdEdges.push(`${edge.route.in}-${edge.route.out}`)
      state.grafo[`${state.edgeData.b}`].edges.push(edge)
      state.edgeCounter ++
  },
  definirOrigen(state,selectNode){
    for(let nodo of state.grafo){
      if (nodo.origin){
          state.grafo[`${nodo.id}`].minDistance = "∞"
          state.grafo[`${nodo.id}`].visited = false
          state.grafo[`${nodo.id}`].origin = false
          state.grafo[`${nodo.id}`].destiny = false
      }
    }
    state.grafo[`${selectNode}`].minDistance = 0
    state.grafo[`${selectNode}`].visited = true
    state.grafo[`${selectNode}`].origin = true
    state.grafo[`${selectNode}`].destiny = false
    let aux = state.grafo.pop()
    state.grafo.push(aux)
    state.messageActivator = true
    state.message = `se ha definido ${selectNode} como el origen`
  },
  definirDestino(state,selectNode){
    for(let nodo of state.grafo){
      if (nodo.destiny){
          state.grafo[`${nodo.id}`].minDistance = "∞"
          state.grafo[`${nodo.id}`].visited = false
          state.grafo[`${nodo.id}`].origin = false
          state.grafo[`${nodo.id}`].destiny = false
      }
    }
    state.grafo[`${selectNode}`].origin = false
    state.grafo[`${selectNode}`].destiny = true
    let aux = state.grafo.pop()
    state.grafo.push(aux)
    state.messageActivator = true
    state.message = `se ha definido ${selectNode} como el destino`
  },
  refresh(state){
    let aux = state.grafo.pop()
    state.grafo.push(aux)
  },
  verificar(state){
    let origin = false
    let edge = false
    let destiny = false
    for(let nodo of state.grafo){
      if (nodo.origin){
        origin = true
      }
    }
    for(let nodo of state.grafo){
      if (nodo.destiny){
        destiny = true
      }
    }
    if(state.createdEdges.length != 0){
      edge = true
    }
    if(origin & edge & destiny){
      state.messageActivator = true
      state.message = "Calculo Realizado"
      state.readyToCalculate = true
    }
    if(!origin){
      state.messageActivator = true
      state.message =  "No se ha fijado un origen"
    }
    if(!destiny){
      state.messageActivator = true
      state.message =  "No se ha fijado un destino"
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