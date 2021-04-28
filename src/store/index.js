import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nodos_creados: 0,
    max_nodos: 30,
    ready_to_calculate: false,
    message: "",
    message_activator :false,
    edges_to_render: [],
    created_edges : [],
    visited :[],
    edge_counter : 0,
    Grafo: [],
    edge_data : {
      a: undefined,
      b: undefined,
      value_edge: undefined,
      a_pos: undefined,
      b_pos: undefined,
    }
  },
  mutations: {
    Insertar_nodo (state) {
      if (state.nodos_creados >= state.max_nodos){
        state.message_activator = true
        state.message = "Se superó el maximo de nodos permitidos"
        return
      }
      state.Grafo[`${state.nodos_creados}`] = {
          id: state.nodos_creados,
          min_dist: "∞",
          visited: false,
          edges: [],
          origin: false
      }
      state.nodos_creados ++
      state.edges_to_render = []
      state.created_edges = []
      for(let e of state.Grafo){
        e.edges = []
      }
  },
    Eliminar_nodo (state) {
    if (state.nodos_creados <= 0){
      state.message_activator = true
      state.message = "No hay mas nodos para eliminar"
      return
    }
    state.Grafo.pop()
    state.nodos_creados --
    state.edges_to_render = []
    for(let e of state.Grafo){
      e.edges = []
    }
  },
  Añadir_edge (state) {
      if(state.edge_data.a == state.edge_data.b){
        state.message_activator = true
        state.message = "No se puede unir un nodo a si mismo"
        return
      }
      var edge = {peso : state.edge_data.value_edge, route : {in : state.edge_data.a,out : state.edge_data.b}, position : { a : state.edge_data.a_pos, b : state.edge_data.b_pos}, id : state.edge_counter }
      for (let i of state.created_edges){
        if( i == (`${edge.peso}-${edge.route.in}-${edge.route.out}`)|(`${edge.peso}-${edge.route.out}-${edge.route.in}`)){
          state.message_activator = true
          state.message = "ya existe una arista entre esos dos nodos"
          return
        }
      }
      state.created_edges.push(`${edge.peso}-${edge.route.in}-${edge.route.out}`)
      state.edges_to_render.push(edge)
      state.Grafo[`${state.edge_data.a}`].edges.push(edge)
      state.edge_counter ++
      edge = {peso : state.edge_data.value_edge , route : {in : state.edge_data.b,out : state.edge_data.a}, position : { a : state.edge_data.b_pos, b : state.edge_data.a_pos}, id : state.edge_counter  }
      state.created_edges.push(`${edge.peso}-${edge.route.in}-${edge.route.out}`)
      state.Grafo[`${state.edge_data.b}`].edges.push(edge)
      state.edge_counter ++
  },
  Definir_origen(state,select_node){
    for(var nodo of state.Grafo){
      if (nodo.origin){
          state.Grafo[`${nodo.id}`].min_dist = "∞"
          state.Grafo[`${nodo.id}`].visited = false
          state.Grafo[`${nodo.id}`].origin = false
      }
    }
    state.Grafo[`${select_node}`].min_dist = 0
    state.Grafo[`${select_node}`].visited = true
    state.Grafo[`${select_node}`].origin = true
    var aux = state.Grafo.pop()
    state.Grafo.push(aux)
    state.message_activator = true
    state.message = `se ha definido ${select_node} como el origen`
  },
  Refresh(state){
    var aux = state.Grafo.pop()
    state.Grafo.push(aux)
  },
  Verificar(state){
    var origin = false
    var edge = false
    for(var nodo of state.Grafo){
      if (nodo.origin){
        origin = true
      }
    }
    if(state.created_edges.length != 0){
      edge = true
    }
    if(origin & edge){
      state.message_activator = true
      state.message = "Calculo Realizado"
      state.ready_to_calculate = true
    }
    if(!origin){
      state.message_activator = true
      state.message =  "No se ha fijado un origen"
    }
    if(!edge){
      state.message_activator = true
      state.message =  "No se ha fijado ninguna arista"
    }
  },
  close_message(state){
    state.message_activator = false
  }
  },

})
