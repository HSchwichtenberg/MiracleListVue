<template>
 <div class="panel panel-primary">
  <div class="panel-heading" id="headline">
   <h2>User Login</h2>
  </div>
  <div class="panel-body">
   <div>
    MiracleList is a sample application for a single-page web application (SPA) for task management..
    <br />
    This implementation of this application version {{ appversion }} is based on Vue.js version {{ vueVersion }}.
   </div>

   <br />
   <div>
    Enter the combination of your e-mail address and any password to log in to the user. If there is not yet a user account for this email address, a
    new user account will be created automatically with a few sample tasks.
   </div>
   <br />
   <form @submit.prevent>
    <div class="row">
     <div class="col-xs-12 form-group">
      <label for="name">Email Address</label>
      <input id="username"  name="username" type="text" v-model="Username" placeholder="Your Email Address" autocomplete="username" class="form-control" />
     </div>
    </div>

    <div class="row">
     <div class="col-xs-12 form-group">
      <label for="password">Password</label>
      <input
       id="password"
       name="password"
       type="password"
       v-model="Password"
       autocomplete="current-password"
       placeholder="Your Password - Choose a new password the first time you log in"
       class="form-control" />
     </div>
    </div>

    <button @click="Login" type="submit" class="btn btn-primary" id="Login" title="Login using the MiracleList Backend" name="Login">Login</button>
    &nbsp;
    <span id="errorMsg" class="text-danger">{{ Message }}</span>
   </form>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

import { version as vueVersion } from "vue";
import { version as appversion } from "../../package.json";
import { AuthenticationManager } from "@/services/AuthenticationManager";

// DI
let am: AuthenticationManager = inject("AuthenticationManager") as AuthenticationManager;
const router = useRouter();
const route = useRoute();

// Variablen für Datenbindung
let Username = ref("");
let Password = ref("");
let Message = ref("");

onMounted(async () => {
 console.log("Login:OnMounted");
 if (process.env.NODE_ENV === "development") {
  Username.value = process.env.VUE_APP_ENV_DebugUser;
  Password.value = process.env.VUE_APP_ENV_DebugPassword;
 }
 // Abmeldewunsch?
 if (route.path.toLowerCase().includes("/logout")) am.Logout();
 // vorhandenes Token?
 if (await am.CheckLocalTokenValid()) router.push("/");
});

// Benutzerinteraktion
async function Login() {
 if (!Username.value || !Password.value) {
  Message.value = "Username and Password required!";
  return;
 }
 let r = await am.Login(Username.value, Password.value);
 if (!r) router.push("Home");
 else Message.value = r;
}
</script>