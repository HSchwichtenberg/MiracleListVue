<template>
  <div v-if="Username">
    <!-- Zeit: {{moment().format('HH:mm:ss')}} <br> -->
    Benutzer: {{C_Username}}
    <router-link to='/Logout'>Logout</router-link>
   </div>
 <div v-else>
    You're not signed in!
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  Username: String
})

let C_Username = computed(() => props.Username);
</script>