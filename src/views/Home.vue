<style scoped>
.MLPanel {
  padding-right: 2px;
  padding-left: 2px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<template>
  <ConfirmDialog ref="confirmDialog"></ConfirmDialog>
  <div>
    <!-- ##################################### Spalte 1: Kategorien-->
    <div
      v-if="categorySet"
      class="MLPanel"
      :class="task ? 'hidden-xs hidden-sm col-md-3 col-lg-2' : 'col-xs-4 col-sm-4 col-md-3 col-lg-2'"
    >
      <!-- ---------- Überschrift Spalte 1-->
      <h4>
        {{ categorySet.length }}
        <span>Categories</span>
      </h4>
      <!-- ---------- neue Kategorie eingeben-->
      <input
        name="newCategoryName"
        type="text"
        class="form-control"
        v-model="newCategoryName"
        @change="createCategory"
        placeholder="new Category..."
      />
      <!-- ---------- Kategorieliste ausgeben-->
      <ol class="list-group scroll">
        <li
          class="list-group-item"
          v-for="c in categorySet"
          :key="c.categoryID"
          @click="ShowTaskSet(c)"
          :title="'Task Category #' + c.categoryID"
          :style="{ backgroundColor: category && c.categoryID == category?.categoryID ? '#E0EEFA' : 'white' }"
        >
          {{ c.name }}
          <span
            id="Remove"
            style="float:right;"
            class="close"
            :title="`Remove Category #${c.categoryID}`"
            @click.stop="RemoveCategory(c)"
          >&times;</span>
        </li>
      </ol>
    </div>
  </div>

  <!-- ##################################### Spalte 2: Aufgaben-->

  <div
    v-if="category && taskSet"
    class="MLPanel"
    :class="task ? 'hidden-xs col-sm-6 col-md-5 col-lg-6' : 'col-xs-8 col-sm-8 col-md-9 col-lg-10'"
  >
    <!-- ---------- Überschrift Spalte 1-->
    <h4>
      {{ taskSet.length }}
      <span>Tasks in</span>
      {{ category.name }}
    </h4>
    <!-- ---------- neue Aufgabe eingeben-->
    <input
      name="newTaskTitle"
      type="text"
      class="form-control"
      :disabled="(category == null)"
      v-model="newTaskTitle"
      @change="createTask"
      placeholder="new Task..."
    />
    <!-- ---------- Aufgabenliste ausgeben-->
    <ol class="list-group scroll">
      <li
        v-for="t in taskSet"
        :key="t.taskID"
        @click="ShowTaskDetail(t)"
        class="list-group-item"
        :title="'Task #' + t.taskID + ' Created: ' + t.created"
        :style="{ backgroundColor: task && t.taskID == task?.taskID ? '#E0EEFA' : 'white' }"
      >
        <input
          type="checkbox"
          :name="'done' + t.taskID"
          :id="'done' + t.taskID"
          :checked="t.done"
          class="MLcheckbox"
          @change="ChangeTaskDone($event, t)"
        />
        {{ t.title }}
        <span style="float:right;margin-right:10px">
          <span
            class="badge badge-important"
            style="margin-right:10px"
            :title="'Importance: ' + Importance[t.importance] + ' (' + t.importance + ')'"
          >{{ Importance[t.importance] }}</span>
          <span
            id="Remove"
            :title="`Remove Task #${t.taskID}`"
            class="close"
            @click.stop="RemoveTask(t)"
          >&times;</span>
        </span>

        <div
          v-if="t.due"
          :class="{ 'text-danger': IsPast(t.due), 'text-warning': IsToday(t.due), 'text-success': IsFuture(t.due) }"
          :title="'due ' + moment(t.due.toString()).toLocaleString()"
        >due {{ (IsToday(t.due) ? "today" : moment(t.due).fromNow()) }}</div>
      </li>
    </ol>
  </div>

  <!-- <transition name="fade"> -->
  <!-- ### Spalte 3: Aufgabendetails-->
  <div v-if="task" class="MLPanel col-xs-12 col-sm-6 col-md-4 col-lg-4">
    <TaskEdit v-model:task="task" @TaskEditDone="TaskEditDone"></TaskEdit>
  </div>
  <!-- </transition> -->
</template>

<script setup lang="ts">

import { ref, onMounted, inject } from 'vue';
import { MiracleListProxy, Category, Task, Importance } from '@/services/MiracleListProxyV2'
// import { AuthenticationManager } from '@/services/AuthenticationManager' // Sprint 4
import moment from 'moment'
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import TaskEdit from '@/components/TaskEdit.vue';
import { AppState } from '@/services/AppState';

//#region Properties zur Datenbindung
let categorySet = ref<Array<Category>>();
let taskSet = ref<Array<Task>>();
let category = ref<Category | null>();
let task = ref<Task | null>();
let newCategoryName = ref<string>();
let newTaskTitle = ref<string>();
//#endregion

// Backend
// let proxy = new MiracleListProxy("https://miraclelistbackend.azurewebsites.net/");
let proxy: MiracleListProxy = inject("MiracleListProxy") || new MiracleListProxy(""); // Sprint 4
// Ausgabe-Hilfsfunktionen
let IsToday = (d: Date) => moment().startOf('day').isSame(moment(d).startOf('day'));
let IsPast = (d: Date) => moment(d).startOf('day') < moment().startOf('day')
let IsFuture = (d: Date) => moment(d).startOf('day') > moment().startOf('day')
// Verweise auf Elemente
const confirmDialog = ref<typeof ConfirmDialog>();

onMounted(async () => { // This hook is not called during server-side rendering.
  console.log("Home:OnMounted");
  // Sprint 2+3: zunächst statischer Login. Wird später ausgelagert!
  // var am = new AuthenticationManager("https://miraclelistbackend.azurewebsites.net/");
  // var li = await am.Login();
  // token = li.token || null;
  // console.log("Loginfo", li);
  console.log("Token", AppState.Token, AppState.CurrentLoginInfo);
  // if (AppState.Token) 
  await ShowCategorySet();
});

async function ShowCategorySet() {
  categorySet.value = await proxy.categorySet(AppState.Token);
  console.log("API v2CategorySetGet OK!", categorySet.value)
  if (categorySet.value.length > 0) { ShowTaskSet(categorySet.value[0]); }
}

async function ShowTaskSet(c: Category | null | undefined) {
  console.log("ShowTaskSet", c);
  category.value = c;
  if (c && c.categoryID) {
    taskSet.value = await proxy.taskSet(c.categoryID, AppState.Token);
    console.log("API v2TaskSetByIdGet OK!", taskSet.value)
    task.value = null;
  }
}

function ShowTaskDetail(t: Task) {
  task.value = t;
}

async function RemoveCategory(c: Category) {
  if (c == null || !c.categoryID) return;
  var text = `Do you want to remove category #${c.categoryID} <b>${c.name}</b> and all related tasks?`;
  async function RemoveInternal() {
    await proxy.deleteCategory(c.categoryID as number, AppState.Token);
    await ShowCategorySet();
    category.value = null;
  }
  if (confirmDialog.value) { confirmDialog.value.Show(c.categoryID, text, RemoveInternal, null); }
  // oder:
  // if (!confirm(text)) return;
}

async function RemoveTask(t: Task) {
  if (t == null || !t.taskID) return;
  var text = `Do you want to remove Task #${t.taskID} <b>${t.title}</b>?`;
  async function RemoveInternal() {
    if (t.taskID) await proxy.deleteTask(t.taskID, AppState.Token);
    await ShowTaskSet(category.value);
    task.value = null;
  }
  if (confirmDialog.value) { confirmDialog.value.Show(t.taskID, text, RemoveInternal, null); }
  // oder:
  // if (!confirm(text)) return;
}

async function createCategory() {
  if (!newCategoryName.value) return;
  var newcategory = await proxy.createCategory(newCategoryName.value, AppState.Token);
  await ShowCategorySet();
  await ShowTaskSet(newcategory);
  newCategoryName.value = "";
}

async function createTask() {
  if (!newTaskTitle.value || !category.value) return;
  console.log("createTask");
  let newTask = new Task({
    taskID: 0, // notwendig für Server, da der die ID vergibt
    title: newTaskTitle.value,
    categoryID: category.value.categoryID,
    importance: Importance.B,
    created: new Date(),
    due: undefined,
    order: 0,
    note: "",
    done: false,
  });

  newTask = await proxy.createTask(AppState.Token, newTask);
  console.log("Home.createTask", newTask);
  await ShowTaskSet(category.value);
  newTaskTitle.value = "";
}

async function ChangeTaskDone(event, t: Task) {
  console.log("Task ÄNDERN", t);
  var x = await proxy.changeTaskDone(t.taskID, event.target.checked, AppState.Token);
  console.log("Task GEÄNDERT", t)
}

async function TaskEditDone(changed: boolean) {
  console.log("TaskEditDone", changed, task.value);
  if (changed && task.value) await proxy.changeTask(AppState.Token, task.value);
  else await ShowTaskSet(category.value); // Bei Cancel: Neuladen als Undo!
  // Nun keine aktuelle Aufgabe mehr!
  task.value = null;
}
</script>