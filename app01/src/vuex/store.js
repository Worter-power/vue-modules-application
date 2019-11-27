
import actions from './actions.js';
import state from './state.js';
import mutations from './mutations';
import modules from './modules';
import baseState from "PAGE/base/vuex/state.js";
import baseMutations from "PAGE/base/vuex/mutations.js";
export default {
    state: {...state, ...baseState},
    mutations: {...mutations, ...baseMutations},
    actions: {...actions},
    modules
};
