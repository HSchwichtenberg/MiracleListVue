<template>
  <div v-if="username">
    Benutzer: <span id="C_Username">{{username}}</span>&nbsp; 
    <router-link to='/Logout'>Logout</router-link>
   </div>
 <div v-else>
    <span id="C_Username">You're not signed in!</span>
 </div>
</template>

<script setup lang="ts">
const props = defineProps({
  username: String
})
</script>