<template>
  <div class="row" style="background: white; margin-bottom: 10px">
    <span class="col-xs-10 col-sm-4 col-md-3 col-lg-2">
      <img @click="ShowAbout" src="/img/MiracleListLogo.jpg" />

      <!-- <router-link to="/About">About>
      <img  src="/img/MiracleListLogo.jpg" />
      </router-link>-->
    </span>
    <!--  Anzeige dieses Blocks oben nur auf großen Displays -->
    <span
      class="col-xs-6 col-lg-9 col-sm-7 col-md-8 hidden-xs"
      style="vertical-align: middle;margin-top:25px"
    >
      <UserStatus :Username="AppState.Username.value" ></UserStatus>
    </span>

    <span class="col-xs-1">
      <ul class="nav navbar-nav navbar-right">
        <li class="dropdown">
          <a class="dropdown-toggle" data-toggle="dropdown">
            <span style="font-size: 2.2em" class="glyphicon glyphicon-menu-hamburger icon-primary"></span>
          </a>
          <ul class="dropdown-menu">
            <!-- Menüpunkte für MiracleList -->
            <li>
              <router-link to="/About">About this App</router-link>
            </li>
            <li>
              <router-link to="/">Home</router-link>
            </li>
            <li>
              <router-link to="/Login">Login</router-link>
            </li>
            <li>
              <router-link to="/Logout">Logout</router-link>
            </li>
            <!-- Werbung -->
            <li>
              <a href="https://www.it-visions.de/miraclelist" target="_blank">www.MiracleList.net</a>
            </li>
            <li>
              <a
                href="https://www.it-visions.de/thema/vue.js"
                target="_blank"
              >Beratung und Schulung zu Vue.js</a>
            </li>
            <li>
              <a href="https://www.it-visions.de/VueJSBuch" target="_blank">Fachbuch zu Vue.js</a>
            </li>
            <li>
              <a href="https://www.it-visions.de" target="_blank">www.IT-Visions.de</a>
            </li>
            <li>
              <a href="https://www.MAXIMAGO.de" target="_blank">MAXIMAGO</a>
            </li>
          </ul>
        </li>
      </ul>
    </span>
  </div>

   <div class="row">
  <router-view />
</div>
  <div class="row">
<span class="col-xs-12">
   <div> MiracleListVue {{ appVersion }} running on Vue.js {{ vueVersion }} - released {{releaseDate}}</div> 
      <div>  Author: Dr. Holger Schwichtenberg, <a href="http://www.IT-Visions.de">www.IT-Visions.de</a>, 2021-{{ moment().year() }}</div> 

<div>Backend: {{backend}} 
   <span :title="AppState.HubConnection.value?.connectionId ?? 'no connection!'"> SignalR: {{AppState.HubConnection.value?.baseUrl}} 
 <span :style="AppState.HubConnected ? 'color:green' : 'color:red'"> {{AppState.HubConnection.value?.state }}</span> </span></div> 


  <!-- Alternative Anzeige dieses Blocks unten auf kleinen Displays -->

  <UserStatus :Username="AppState.Username.value"></UserStatus>
  
 </span> </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { onMounted, readonly } from 'vue';
import { useRoute } from 'vue-router'
import router from './router'
import { version as vueVersion } from 'vue';
import { version as appVersion, releaseDate } from '../package.json'
import UserStatus from './components/UserStatus.vue';
import { AppState } from './services/AppState';

const route = useRoute();
function ShowAbout() {
  if (route.path.includes("/About")) router.replace("/");
  else router.replace("/About");
}

let backend = readonly(process.env.VUE_APP_ENV_Backend);

onMounted(() => {
  console.log("App.vue:OnMounted");
 });
</script>