<template>
  <div v-if="username">
    Benutzer: <span id="LoggedInUser">{{username}}</span>&nbsp; 
    <router-link to='/Logout'>Logout</router-link>
   </div>
 <div v-else>
    <span id="LoggedInUser">You're not signed in!</span>
 </div>
</template>

<script setup lang="ts">
const props = defineProps({
  username: String
})
</script>