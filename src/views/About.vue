<template>
  <h2>MiracleList mit Vue.js</h2>Autor: Dr. Holger Schwichtenberg,
  <a href="http://www.IT-Visions.de/">www.IT-Visions.de</a>

  <div style="margin-top:10px">
    <h3>Client</h3>
    Application Version {{ appversion }}
    <br />
    Vue.js Version {{ vueVersion }}
  </div>

  <div style="margin-top:10px">
    <h3>Server</h3>
    {{ ServerAppVersion }}
    <br />
    {{ ServerFramework }}
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, inject } from 'vue';
import { MiracleListProxy } from '@/services/MiracleListProxyV2'
import { version as vueVersion } from 'vue';
import { version as appversion } from '../../package.json';

const props = defineProps({
  startValue: Number
})

let result = ref("");
let ServerAppVersion = ref("");
let ServerFramework = ref("");

async function About() {
  let proxy: MiracleListProxy = inject("MiracleListProxy") || new MiracleListProxy(""); // Sprint 4

  let r = await proxy.about()
  result.value = "Ergebnis:" + r;
  console.log("About:Antwort vom Server!", r)
  ServerAppVersion.value = r[6];
  ServerFramework.value = r[8];

  // oder
  // var proxy = new MiracleListProxy("https://miraclelistbackend.azurewebsites.net/");
  // proxy.about()
  // .then(r => {  result.value = "Ergebnis:" + r; 
  // console.log("About:Antwort vom Server!", r)
  // ServerAppVersion.value = r[6];
  // ServerFramework.value = r[8];
  // })
  // .catch(err => { console.error(err);});

}

onMounted(() => { // This hook is not called during server-side rendering.
  console.log("About:OnMounted");
  About();
});
</script>