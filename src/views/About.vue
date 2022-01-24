<template>
<a href="https://vuejs.org/">
<img align="right" width="100" src="/img/vuelogo.png">
</a>

<h2>MiracleList mit Vue.js</h2>
 Autor: Dr. Holger Schwichtenberg, <a href="https://www.IT-Visions.de/">www.IT-Visions.de</a><br>
 Quellcode: <a href="https://github.com/HSchwichtenberg/MiracleListVue">GitHub</a><br>
 Live in der Cloud: <a href="http://miraclelist-vue.azurewebsites.net/">Microsoft Azure</a>

 <div class="abstand">
  <h3>Client</h3>
  URL: <a :href="clientURL">{{ clientURL }}</a>
    <br>
  Application Version {{ appversion }}
  <br />
  Vue.js Version {{ vueVersion }}
 </div>
 <div class="abstand">
  <h3>Server</h3>
  URL: <a :href="serverURL">{{ serverURL }}</a>
  <br />
  {{ serverAppVersion }}
  <br />
  {{ serverFramework }}
 </div>
</template>

<style>
.abstand { margin-top: 10px}
</style>

<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
import { MiracleListProxy } from "@/services/MiracleListProxyV2";
import { version as vueVersion } from "vue";
import { version as appversion } from "../../package.json";

let result = ref("");
let serverAppVersion = ref("");
let serverFramework = ref("");
let serverURL = process.env.VUE_APP_ENV_Backend;
let clientURL = window.location.origin;

async function About() {
 let proxy: MiracleListProxy = inject("MiracleListProxy") || new MiracleListProxy(""); // Sprint 4

 let r = await proxy.about();
 result.value = "Ergebnis:" + r;
 console.log("About:Antwort vom Server!", r);
 serverAppVersion.value = r[6];
 serverFramework.value = r[8];

 // oder
 // var proxy = new MiracleListProxy(process.env.VUE_APP_ENV_Backend);
 // proxy.about()
 // .then(r => {  result.value = "Ergebnis:" + r;
 // console.log("About:Antwort vom Server!", r)
 // ServerAppVersion.value = r[6];
 // ServerFramework.value = r[8];
 // })
 // .catch(err => { console.error(err);});
}

onMounted(() => {
 // This hook is not called during server-side rendering.
 console.log("About:OnMounted");
 About();
});
</script>