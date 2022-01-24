<template>
  <!--Unteraufgaben-->
  <div class="form-group">
    <label>Subtasks</label>
    <input
      type="text"
      class="form-control"
      name="newSubTaskTitle"
      v-model="newSubTaskTitle"
      @change="CreateSubTask()"
      placeholder="new Subtask..."
    />
    <ul class="list-group">
      <li v-for="st in subTasks" class="list-group-item" :key="st.subTaskID">
        <input
          type="checkbox"
          v-model="st.done"
          class="MLcheckbox"
          style="margin-right:5px;"
        />
        <span :style="{ 'text-decoration': (st.done ? 'line-through' : 'none') }">{{ st.title }}</span>
        <a @click="RemoveSubTask(st)" class="close">&times;</a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Task, SubTask } from '@/services/MiracleListProxyV2'

//#region Öffentliche Schnittstelle der Komponente
// === Parameter
const props = defineProps({
  task: Task
})
// notwendig, wenn sich Parameterwert aufgrund der Auswahl ändert
watch(() => props.task, () => {
  subTasks.value = props.task!.subTaskSet;
});
//#endregion

//#region Variablen für Datenbindung
let newSubTaskTitle = ref("");
let subTasks = ref(props.task!.subTaskSet);
//#endregion

//#region Benutzerinteraktionen
function CreateSubTask() {
  let newSubTask = new SubTask({
    subTaskID: 0,
    title: newSubTaskTitle.value,
    created: new Date(),
    done: false,
    taskID: 0
  });
  subTasks.value?.push(newSubTask);
  console.log("SubTaskList.createSubTask", newSubTask);
  newSubTaskTitle.value = "";
}

function RemoveSubTask(st: SubTask) {
  console.log("SubTaskList.removeSubTask", st);
  let index = props.task!.subTaskSet!.indexOf(st);
  props.task!.subTaskSet!.splice(index, 1);
}
//#endregion
</script>