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
      v-if="data.categorySet"
      class="MLPanel"
      :class="data.task ? 'hidden-xs hidden-sm col-md-3 col-lg-2' : 'col-xs-4 col-sm-4 col-md-3 col-lg-2'"
    >
      <!-- ---------- Überschrift Spalte 1-->
      <h4>
        {{ data.categorySet.length }}
        <span>Categories</span>
      </h4>
      <!-- ---------- neue Kategorie eingeben-->
      <input
        name="newCategoryName"
        type="text"
        class="form-control"
        v-model="data.newCategoryName"
        @change="createCategory"
        placeholder="new Category..."
      />
      <!-- ---------- Kategorieliste ausgeben-->
      <ol class="list-group scroll">
        <li
          class="list-group-item"
          v-for="c in data.categorySet"
          :key="c.categoryID"
          @click="ShowTaskSet(c)"
          :title="'Task Category #' + c.categoryID"
          :style="{ backgroundColor: data.category && c.categoryID == data.category?.categoryID ? '#E0EEFA' : 'white' }"
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
    v-if="data.category && data.taskSet"
    class="MLPanel"
    :class="data.task ? 'hidden-xs col-sm-6 col-md-5 col-lg-6' : 'col-xs-8 col-sm-8 col-md-9 col-lg-10'"
  >
    <!-- ---------- Überschrift Spalte 1-->
    <h4>
      {{ data.taskSet.length }}
      <span>Tasks in</span>
      {{ data.category.name }}
    </h4>
    <!-- ---------- neue Aufgabe eingeben-->
    <input
      name="newTaskTitle"
      type="text"
      class="form-control"
      :disabled="(data.category == null)"
      v-model="data.newTaskTitle"
      @change="createTask"
      placeholder="new Task..."
    />
    
    <!-- ---------- Aufgabenliste ausgeben-->
    <ol class="list-group scroll">
        <draggable
        v-model="data.taskSet"
        item-key="taskID"
        class="list-group"
        @end="Moved"
      >
  <template #item="{ element }">
      <li
        @click="ShowTaskDetail(element)"
        class="list-group-item"
        :title="'Task #' + element.taskID + ' Created: ' + element.created"
        :style="{ backgroundColor: data.task && element.taskID == data.task?.taskID ? '#E0EEFA' : 'white' }"
      >
        <input
          type="checkbox"
          :name="'done' + element.taskID"
          :id="'done' + element.taskID"
          :checked="element.done"
          class="MLcheckbox"
          @change="ChangeTaskDone($event, element)"
        />
        {{ element.title }} {{element.order}} {{element.taskID}}
        <span style="float:right;margin-right:10px">
          <span
            class="badge badge-important"
            style="margin-right:10px"
            :title="'Importance: ' + Importance[element.importance] + ' (' + element.importance + ')'"
          >{{ Importance[element.importance] }}</span>
          <span
            id="Remove"
            :title="`Remove Task #${element.taskID}`"
            class="close"
            @click.stop="RemoveTask(element)"
          >&times;</span>
        </span>

        <div
          v-if="element.due"
          :class="{ 'text-danger': IsPast(element.due), 'text-warning': IsToday(element.due), 'text-success': IsFuture(element.due) }"
          :title="'due ' + moment(element.due.toString()).toLocaleString()"
        >due {{ (IsToday(element.due) ? "today" : moment(element.due).fromNow()) }}</div> 
        
        </li></template></draggable>
    </ol>
  </div>

  <!-- <transition name="fade"> -->
  <!-- ### Spalte 3: Aufgabendetails-->
  <div v-if="data.task" class="MLPanel col-xs-12 col-sm-6 col-md-4 col-lg-4">
    <TaskEdit v-model:task="data.task" @TaskEditDone="TaskEditDone"></TaskEdit>
  </div>
  <!-- </transition> -->
</template>

<script setup lang="ts">

import { ref, reactive, onMounted, inject } from 'vue';
import { MiracleListProxy, Category, Task, Importance } from '@/services/MiracleListProxyV2'
// import { AuthenticationManager } from '@/services/AuthenticationManager' // Sprint 4
import moment from 'moment'
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import TaskEdit from '@/components/TaskEdit.vue';
import { AppState } from '@/services/AppState';
import draggable from 'vuedraggable'

function Moved(evt, originalEvent){
  console.log("MOVE:", evt, originalEvent);
  let i = 0;
  data.taskSet!.forEach(   async t => {
      console.log("vorher",t.order,t.taskID);
      t.order = ++i;
      await proxy.changeTask(AppState.Token, t);
      console.log("nachher",t.order,t.taskID);
    });
}

//#region Properties zur Datenbindung inr reaktivem Objekt
const data = reactive({
 categorySet : ref<Array<Category>>(),
 taskSet : ref<Array<Task>>(),
 category : ref<Category | null>(),
 task : ref<Task | null>(),
 newCategoryName : ref<string>(),
newTaskTitle : ref<string>()
});
//#endregion
let taskSet : ref<Array<Task>>;
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
 console.log("API v2CategorySetGet OK!", data.categorySet)
  data.categorySet = await proxy.categorySet(AppState.Token);

  console.log("API v2CategorySetGet OK!", data.categorySet)
  if (data.categorySet.length > 0) { ShowTaskSet(data.categorySet[0]); }
}

async function ShowTaskSet(c: Category | null | undefined) {
  console.log("ShowTaskSet", c);
  data.category = c;
  if (c && c.categoryID) {
    data.taskSet = await proxy.taskSet(c.categoryID, AppState.Token);
data.taskSet = data.taskSet.sort((x,y)=>(x.order-y.order));
    console.log("API v2TaskSetByIdGet OK!", data.taskSet)
    data.task = null;
  }
}

function ShowTaskDetail(t: Task) {
  data.task = t;
}

async function RemoveCategory(c: Category) { // ab Sprint 5
  if (c == null || !c.categoryID) return;
  var text = `Do you want to remove category #${c.categoryID} <b>${c.name}</b> and all related tasks?`;
  async function RemoveInternal() {
    await proxy.deleteCategory(c.categoryID as number, AppState.Token);
    await ShowCategorySet();
    data.category = null;
  }
  if (confirmDialog.value) { confirmDialog.value.Show(c.categoryID, text, RemoveInternal, null); }
}

async function RemoveCategor_Alt(c: Category) { // Sprint 2 bis 4
  if (c == null || !c.categoryID) return;
  var text = `Do you want to remove category #${c.categoryID} ${c.name} and all related tasks?`;
  if (!confirm(text)) return;
  await proxy.deleteCategory(c.categoryID as number, AppState.Token);
  await ShowCategorySet();
  data.category = null;
}

async function RemoveTask(t: Task) { // ab Sprint 5
  if (t == null || !t.taskID) return;
  var text = `Do you want to remove Task #${t.taskID} <b>${t.title}</b>?`;
  async function RemoveInternal() {
    if (t.taskID) await proxy.deleteTask(t.taskID, AppState.Token);
    await ShowTaskSet(data.category);
    data.task = null;
  }
  if (confirmDialog.value) { confirmDialog.value.Show(t.taskID, text, RemoveInternal, null); }

}

async function RemoveTask_alt(t: Task) { // Sprint 2 bis 4
 if (t == null || !t.taskID) return;
 var text = `Do you want to remove Task #${t.taskID} <b>${t.title}</b>?`;
 if (!confirm(text)) return;
 await proxy.deleteTask(t.taskID, AppState.Token);
 await ShowTaskSet(data.category);
 data.task = null;
}

async function createCategory() {
  if (!data.newCategoryName) return;
  var newcategory = await proxy.createCategory(data.newCategoryName, AppState.Token);
  await ShowCategorySet();
  await ShowTaskSet(newcategory);
  data.newCategoryName = "";
}

async function createTask() {
  if (!data.newTaskTitle || !data.category) return;
  console.log("createTask");
  let newTask = new Task({
    taskID: 0, // notwendig für Server, da der die ID vergibt
    title: data.newTaskTitle,
    categoryID: data.category.categoryID,
    importance: Importance.B,
    created: new Date(),
    due: undefined,
    order: 0,
    note: "",
    done: false,
  });

  newTask = await proxy.createTask(AppState.Token, newTask);
  console.log("Home.createTask", newTask);
  await ShowTaskSet(data.category);
  data.newTaskTitle = "";
}

async function ChangeTaskDone(event, t: Task) {
  console.log("Task ÄNDERN", t);
  t = await proxy.changeTaskDone(t.taskID, event.target.checked, AppState.Token);
  console.log("Task GEÄNDERT", t)
}

async function TaskEditDone(changed: boolean) {
  console.log("TaskEditDone", changed, data.task);
  if (changed && data.task) await proxy.changeTask(AppState.Token, data.task);
  else await ShowTaskSet(data.category); // Bei Cancel: Neuladen als Undo!
  // Nun keine aktuelle Aufgabe mehr!
  data.task = null;
}
</script>