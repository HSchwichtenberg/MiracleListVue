<template>
  <h5 v-if="Username">
    <!-- Zeit: {{moment().format('HH:mm:ss')}} <br> -->
    Benutzer: {{C_Username}}<br>
    <router-link to='/Logout'>Logout</router-link>
   </h5>
 <h5 v-else>
    You're not signed in!
 </h5>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  Username: String
})

let C_Username = computed(() => props.Username);
</script>