<template>
 <!--Unteraufgaben-->
<div class="form-group">
    <label>Subtasks</label>
    <input type="text" class="form-control" name="newSubTaskTitle" v-model="newSubTaskTitle" @change="createSubTask()" i18n-placeholder placeholder="new Subtask...">
    <ul class="list-group">
        <li v-for="st in subTasks" class="list-group-item" :key="st.subTaskID">
            <input name="done{{st.taskID}}" type="checkbox" v-model="st.done" class="MLcheckbox" style="margin-right:5px;">
            <span :style="{'text-decoration': (st.done ? 'line-through' : 'none')}"> {{st!.title }}</span>
            <a @click="removeSubTask(st)" class="close">&times;</a></li>
    </ul>
</div>
</template>

<script setup lang="ts">
import { ref,  defineProps, watch } from 'vue';
import { Task, SubTask } from '@/services/MiracleListProxyV2'

//#region Öffentliche Schnittstelle der Komponente
// === Parameter
const props = defineProps({
  task: Task
})
// notwendig, wenn sich Parameterwert aufgrund der Auswahl ändert
watch(() => props.task, (newValue, oldValue) => {
  subTasks.value = props.task!.subTaskSet;
});
//#endregion

//#region Variablen für Datenbindung
let newSubTaskTitle = ref("");
let subTasks = ref(props.task!.subTaskSet);
//#endregion

//#region Benutzerinteraktionen
function createSubTask() {
  let st = new SubTask();
  st.subTaskID = 0;
  st.title = newSubTaskTitle.value;
  st.created = new Date();
  st.done = false;
  st.taskID = 0;
  subTasks.value?.push(st);
  console.log("SubTaskList.createSubTask", st);
  newSubTaskTitle.value = "";
 }

function removeSubTask(st: SubTask) {
  console.log("SubTaskList.removeSubTask", st);
  let index = props.task!.subTaskSet!.indexOf(st);
  props.task!.subTaskSet!.splice(index, 1);
 }
//#endregion   
</script>