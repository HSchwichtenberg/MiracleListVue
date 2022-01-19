<template>
  <div style="padding: 0">
    <div>
      <h4>Task #{{ task?.taskID }}</h4>
      <form id="taskForm">
        <!--Schaltflächen-->
        <button
          id="save"
          type="button"
          title="Änderungen speichern"
          @click="Save"
          class="btn btn-success" style="margin-right:5px;"
        >
          <span class="glyphicon glyphicon-floppy-save"></span>
          <span class="hidden-xs" i18n>Save</span>
        </button>
        <button
          id="cancel"
          type="button"
          title="Änderungen verwerfen"
          @click="Cancel"
          class="btn btn-warning" 
        >
          <span class="glyphicon glyphicon-remove"></span>
          <span class="hidden-xs" i18n>Cancel</span>
        </button>
        <!--Titel-->
        <div class="form-group">
          <label for="tasktitle">Titel</label>
          <input
            id="tasktitle"
            name="tasktitle"
            type="text"
            v-model="t.title"
            required
            class="form-control"
          />
        </div>
        <div class="row">
          <!--Wichtigkeit-->
          <span class="col-xs-3" style="padding-right: 2px">
            <div class="form-group">
              <label for="taskimportance" i18n>Importance</label>
              <select
                id="taskimportance"
                name="taskimportance"
                v-model="t.importance"
                class="form-control"
              >
                <option
                  v-for="(x) in Object.keys(Importance).filter((item) => { return isNaN(Number(item)); })"
                  :key="x"
                  :value="Importance[x]"
                >{{ x }}</option>
              </select>
            </div>
          </span>
          <!--Aufwand-->
          <span class="col-xs-3" style="padding-left: 2px; padding-right: 2px">
            <label for="taskeffort" i18n>Effort</label>
            <input
              id="taskeffort"
              type="number"
              name="taskeffort"
              v-model="t.effort"
              class="form-control"
            />
          </span>
          <!--Fälligkeit-->
          <span class="col-xs-6" style="padding-left: 2px; ">
            <div class="form-group">
              <label for="taskDue" i18n :title="t.due">Due</label>    
              <input
                id="taskdue"
                name="taskdue"
                type="date"
                v-model="taskDue"
                class="form-control"
              /> 
            </div>
          </span>
        </div>        <!--Ende row-->
        <!--Unteraufgaben-->
        <SubTaskList :task="task"></SubTaskList>
        <!--Notiz-->
        <div class="form-group">
          <label for="tasknote" i18n>Note</label>
          <textarea id="tasknote" name="tasknote " rows="5" v-model="t.note" class="form-control"></textarea>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, computed } from 'vue';
import { Task, Importance } from '@/services/MiracleListProxyV2'
import SubTaskList from '@/components/SubTaskList.vue';
//#region Öffentliche Schnittstelle der Komponente
// === Parameter
const props = defineProps({
  task: Task
})
// ===  Events
const emit = defineEmits(['TaskEditDone'])
//#endregion

// Wrapper für Parameter t, weil Zwei-Wege-Bindung direkt an Parameter nicht möglich
const t = computed(() =>  props.task);
// Alternative:
// let t = ref(props.task);
// watch(() => props.task, (newValue, oldValue) => {
//   t.value = newValue
// });

// Wrapper für due -> Workaround für Datumsformatproblem
const taskDue = computed({ 
  get: () => t.value!.due ?  t.value!.due!.toISOString().substring(0,10) : null , 
  set: (event) =>  t.value!.due = new Date(event as string) 
})

//#region Benutzeraktionen
async function Save() {
  console.log("Save");
  emit("TaskEditDone", true);
}

function Cancel() {
  console.log("Cancel");
  emit("TaskEditDone", false);
}
//#endregion

</script>