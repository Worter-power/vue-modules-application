
import actions from './actions.js';
import state from './state.js';
import mutations from './mutations';
import modules from './modules';
import qnState from "PAGE/qn/vuex/state.js"
import qnMutations from "PAGE/qn/vuex/mutations.js"
export default {
    state: {...state,...qnState},
    mutations: {...mutations,...qnMutations},
    actions: {...actions},
    modules
};
