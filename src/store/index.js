import { createStore } from 'vuex';
import userTransactionData from './userTransactionData';
import getPricesApi from './getPricesApi';
import exchangesAndCurrencies from './exchangesAndCurrencies';

export default createStore({

  // Variables que va a necesitar mi APP.
  state: {
    password: '',
  },

  // Para no acceder directamente al estado o para filtrar info,calculan o filtran datos basados en el estado actual
  getters: {
    password(state) {
      return state.password;
    },
  },

  /* Las mutaciones son funciones síncronas que reciben el estado actual y un payload (datos necesarios para la modificación) como argumentos y
  modifican el estado. Son funciones que modifican el estado de manera sincrónica. Para realizar cambios en la variable del estado */
  mutations: {
    setPassword(state, password) {
      state.password = password;
    },
  },

  actions: {
    updatePassword({ commit }, password) {
      commit('setPassword', password); // Se utiliza commit para llamar a una mutación y se le pasa el dato a editar en el estado.
    },
  },

  // Para organizar de una mejor forma si quiero manejar varios estados. Permiten dividir el store en módulos más pequeños
  modules: {
    userTransactionData,
    getPricesApi,
    exchangesAndCurrencies,
  },
});

// PODRIA REPASAR EL USO DE DISPATCH VS MAPACTIONS

/*
1) Se realiza un mapActios o un dispatch para disparar una accion. Este es el punto de entrada para realizar operaciones asincrónicas o complejas
que afectan el estado.

2) La acción realiza la operación necesaria, que puede incluir llamadas a APIs, operaciones de tiempo de espera, procesamiento de datos, etc. Al f
inalizar su tarea, llama a commit para disparar una mutación (las acciones pueden despachar mutaciones para efectivamente cambiar el estado de la
aplicación. ("despachar mutaciones "significa ejecutar una mutación desde una acción para modificar el estado global de la aplicación.)). Las
acciones pueden ser asíncronas, pero las mutaciones siempre deben ser sincrónicas al igual que los commits.

- Funciones que pueden realizar operaciones asíncronas o no que pueden llamar a una mutatios (porque a veces si se considera que no es necesario, no
se llama a la mutations porque no hay que cambiar nada) antes de cambiar el estado.

3)La mutación es responsable de modificar el estado del store de Vuex. Este proceso debe ser sincrónico para garantizar que el estado cambie de
manera predecible (dependiendo si el cambio realmente modifica el state, puede haber veces que se realiza una mutación, pero no es necesario el
cambio porque no modifica nada del state).

4)Una vez que el estado se ha modificado, los componentes que están vinculados a ese estado a través de mapState o computed se actualizan
automáticamente para reflejar los cambios. Vuex se asegura de que cualquier componente que dependa de ese estado reaccione adecuadamente a las
modificaciones.
*/
