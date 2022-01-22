<style scoped>
.MLpanel {
 padding-right: 2px;
 padding-left: 2px;
}

.MLselected {
 background-color: #e0eefa !important;
}
</style>

<template>
 

 <div class="alert alert-success" role="alert">
  <h4 class="alert-heading">Ausgangszustand</h4>
  <p> Herzlich Willkommen beim <a href="https://github.com/HSchwichtenberg/MiracleListVue/tree/Sprint1">Ausgangszustand ("Sprint 1")</a> des Tutorials <a href="https://github.com/HSchwichtenberg/MiracleListVue">Aufgabenverwaltung "MiracleList" mit Vue.js!</a></p>
</div>

</template>

<script setup lang="ts">import { onMounted } from 'vue';

onMounted(async () => {
 console.log("Home:onMounted");
});

</script>