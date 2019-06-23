import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false;

Vue.use(Vuetify, {
    theme: {
        primary: '#232F3F', // #E53935
        secondary: '#37475A', // #FFCDD2
        accent: '#FEBD69' // #3F51B5
    }
});

new Vue({
    render: h => h(App),
}).$mount('#app');
