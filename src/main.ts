import { createApp, inject, version as vueVersion } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import moment from 'moment'
import { MiracleListProxy } from './services/MiracleListProxyV2'
import { AuthenticationManager } from './services/AuthenticationManager'
import Toast, { PluginOptions, POSITION } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

// import Vue from 'vue'
// console.log(Vue);

console.log(`main.ts: Starting Vue.js ${vueVersion} App ${process.env.VERSION}, released ${process.env.RELEASEDATE}`);
// Einstellung für Moment.js
moment.locale(window.navigator.language); // oder z.B. moment.locale("de-de");

console.log("Backend",process.env.VUE_APP_ENV_Backend,process.env.VUE_APP_ENV_ClientID )
const app = createApp(App)

//app.provide('x',123 )
//console.log(inject('x')); // inject() can only be used inside setup() or functional components.
// DI
app.provide('MiracleListProxy', new MiracleListProxy(process.env.VUE_APP_ENV_Backend))
app.provide('AuthenticationManager', new AuthenticationManager())

// Für Vue-Toastification (Sprint 5)
const options: PluginOptions = {
 position: POSITION.TOP_LEFT,
 newestOnTop: true,
 transition: "Vue-Toastification__bounce",
 timeout: 5000,
 maxToasts: 5
};
app.use(Toast, options);

// Start der Vue.js-Anwendung
app.use(router).mount('#app');
