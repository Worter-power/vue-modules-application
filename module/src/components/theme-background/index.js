import Background from './src/main';

/* istanbul ignore next */
Background.install = function (Vue) {
    Vue.component(Background.name, Background);
};

export default Background;
