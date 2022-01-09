import { createApp, inject } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import moment from 'moment'
import { MiracleListProxy } from './services/MiracleListProxyV2'
import { AuthenticationManager } from './services/AuthenticationManager'
import { AppState } from './services/AppState'

// import Vue from 'vue'
// console.log(Vue);

console.log("main.ts");
// Einstellung für Moment.js
moment.locale(window.navigator.language); // oder z.B. moment.locale("de-de");

const BACKEND = "https://miraclelistbackend.azurewebsites.net/"
AppState.Backend = BACKEND;

const app = createApp(App)

//app.provide('x',123 )
//console.log(inject('x')); // inject() can only be used inside setup() or functional components.
// DI
app.provide('MiracleListProxy', new MiracleListProxy(BACKEND))
app.provide('AuthenticationManager', new AuthenticationManager(BACKEND))

// Start der Vue.js-Anwendung
app.use(router).mount('#app')
