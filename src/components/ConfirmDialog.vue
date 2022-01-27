<template>
 <!-- Modaler Bootstrap-Dialog -->
<div v-if="active" id="confirmModal" class="modal" tabindex="-1" role="dialog" style="display:flex" aria-hidden="true">
 <div class="modal-dialog" role="document">
  <div class="modal-content">
   <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="No"><span aria-hidden="true">&times;</span></button>
    <h4 class="modal-title">Confirmation</h4>
   </div>
   <div class="modal-body">
    <p><span v-html="confirmModalText"></span></p>
   </div>
   <div class="modal-footer">
    <button type="button" class="btn btn-primary" @click="Yes">Yes</button>
    <button type="button" class="btn btn-default" @click="No">No</button>
   </div>
  </div><!-- /.modal-content -->
 </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
</template>

<script setup lang="ts">
import { ref  } from 'vue';

let ID : any = null;
let confirmModalText = ref("");
let YesCallback : (id: any)=> void;
let NoCallback : (id: any)=> void;
let active = ref(false);

// Zeigt den Dialog. Aufrufbar durch Nutzer
function Show(id : any, text: string, yesCallback : (id: any)=> void, noCallback : (id: any)=> void) {
 YesCallback = yesCallback;
 NoCallback = noCallback;
 ID = id;
 confirmModalText.value = text;
//  (document.getElementById("confirmModal") as any).modal();
 active.value = true;
}

defineExpose({
  Show: Show
}) 

function Yes()
{
 active.value = false;
 YesCallback(ID);
}

function No()
{
 active.value = false;
 NoCallback(ID);
}
</script>