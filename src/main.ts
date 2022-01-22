import { createApp, inject, version as vueVersion } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

// für moment.js (Sprint 2)
import moment from 'moment'
// Einstellung für moment.js
moment.locale(window.navigator.language); // oder z.B. moment.locale("de-de");

import { MiracleListProxy } from './services/MiracleListProxyV2'
import { AuthenticationManager } from './services/AuthenticationManager'

// Ausgabe der Versionsnummer an Konsole und im Browsertitel
console.log(`main.ts: Starting Vue.js ${vueVersion} App ${process.env.VERSION}, released ${process.env.RELEASEDATE}`);
document.title = "MiracleListVue " + process.env.VERSION;
console.log("Backend",process.env.VUE_APP_ENV_Backend,process.env.VUE_APP_ENV_ClientID )

// Vue App erzeugen
const app = createApp(App)

// Dependency Injection (Sprint 4)
app.provide('MiracleListProxy', new MiracleListProxy(process.env.VUE_APP_ENV_Backend))
app.provide('AuthenticationManager', new AuthenticationManager())

// Start der Vue.js-Anwendung
app.use(router).mount('#app');