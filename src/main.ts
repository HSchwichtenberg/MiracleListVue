import { createApp, inject, version as vueVersion } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

// eigene Dienste
import { MiracleListProxy } from './services/MiracleListProxyV2'
import { AuthenticationManager } from './services/AuthenticationManager'

// für moment.js (Sprint 2)
import moment from 'moment'
// Einstellung für moment.js
moment.locale(window.navigator.language); // oder z.B. moment.locale("de-de");

// für vue-toastification (Sprint 5)
import Toast, { PluginOptions, POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

// Ausgabe der Versionsnummer an Konsole und im Browsertitel
console.log(`main.ts: Starting Vue.js ${vueVersion} App ${process.env.VERSION}, released ${process.env.RELEASEDATE}`);
document.title = "MiracleListVue " + process.env.VERSION;
console.log("Backend",process.env.VUE_APP_ENV_Backend,process.env.VUE_APP_ENV_ClientID )

// Vue App erzeugen
const app = createApp(App)

// DI (Sprint 4)
app.provide('MiracleListProxy', new MiracleListProxy(process.env.VUE_APP_ENV_Backend))
app.provide('AuthenticationManager', new AuthenticationManager())

// Plugin für Vue-Toastification (Sprint 5)
const options: PluginOptions = {
 position: POSITION.BOTTOM_RIGHT,
 newestOnTop: true,
 transition: "Vue-Toastification__bounce",
 timeout: 5000,
 maxToasts: 5
};
app.use(Toast, options);

// Start der Vue.js-Anwendung
app.use(router).mount('#app');