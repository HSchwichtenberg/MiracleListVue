<template>
  <div>
    Counter: {{ counter }}   <button @click="increment">+1</button>
   </div>
</template>

<style scoped>
div { color: blue}
</style>

<script setup lang="ts">
import { ref,  onMounted } from 'vue';

const props = defineProps({
  startValue: Number
  // oder
  // startValue: {
  //   default: 0,
  //   type: Number
  // } 
})

var counter = ref(props.startValue || 0);
// oder
// var counter = ref(0);
// counter.value = props.startValue || 0;

function increment()
{
  counter.value++; 
}

// oder
// var increment = () =>  
// {
//   counter.value++; 
// }

onMounted(() => { // This hook is not called during server-side rendering.
     console.log("Vorlage:OnMounted");
  });
     
</script>