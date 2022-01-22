<style scoped>
.MLpanel {
 padding-right: 2px;
 padding-left: 2px;
}

.MLselected {
 background-color: #e0eefa !important;
}
</style>

<template>
 <div id="col1">
  <!-- ##################################### Spalte 1: Kategorien-->
  <div v-if="data.categorySet" class="MLpanel" :class="data.task ? 'hidden-xs hidden-sm col-md-3 col-lg-2' : 'col-xs-4 col-sm-4 col-md-3 col-lg-2'">
   <!-- ---------- Überschrift Spalte 1-->
   <h4>
    <span style="margin-right: 5px" id="categoryCount">{{ data.categorySet.length }}</span>
    <span>Categories</span>
   </h4>
   <!-- ---------- neue Kategorie eingeben-->
   <input
    name="newCategoryName"
    type="text"
    class="form-control"
    v-model="data.newCategoryName"
    @change="CreateCategory"
    title="Hit ENTER to add new category"
    placeholder="new Category..." />
   <!-- ---------- Kategorieliste ausgeben-->
   <ol class="list-group scroll" id="categoryList">
    <li
     class="list-group-item"
     v-for="c in data.categorySet"
     :key="c.categoryID"
     @click="ShowTaskSet(c)"
     :title="'Task Category #' + c.categoryID"
     :class="{ MLselected: data.category && c.categoryID == data.category?.categoryID }">
     {{ c.name }}
     <span id="remove" style="float: right" class="close" :title="`Remove Category #${c.categoryID}`" @click.stop="RemoveCategory(c)">&times;</span>
    </li>
   </ol>
  </div>
 </div>

 <!-- ##################################### Spalte 2: Aufgaben-->
 <div
  id="col2"
  v-if="data.category && data.taskSet"
  class="MLpanel"
  :class="data.task ? 'hidden-xs col-sm-6 col-md-5 col-lg-6' : 'col-xs-8 col-sm-8 col-md-9 col-lg-10'">
  <!-- ---------- Überschrift Spalte 1-->
  <h4>
   <span id="taskCount" style="margin-right: 5px"> {{ data.taskSet.length }}</span>
   <span>Tasks in</span> <span id="categoryCurrentName" style="font-weight: 600"> {{ data.category.name }}</span>
  </h4>
  <!-- ---------- neue Aufgabe eingeben-->
  <input
   name="newTaskTitle"
   type="text"
   class="form-control"
   :disabled="data.category == null"
   v-model="data.newTaskTitle"
   @change="CreateTask"
   title="Hit ENTER to add new task"
   placeholder="new Task..." />

  <!-- ---------- Aufgabenliste ausgeben-->
  <ol id="taskList" class="list-group scroll">
   <li
    v-for="t in data.taskSet"
    :key="t.taskID"
    @click="ShowTaskDetail(t)"
    class="list-group-item"
    :title="'Task #' + t.taskID + '- created: ' + moment(t.created).toLocaleString()"
    :class="{ MLselected: data.task && t.taskID == data.task?.taskID }">
    <input
     type="checkbox"
     :name="'done' + t.taskID"
     :id="'done' + t.taskID"
     :checked="t.done"
     class="MLcheckbox"
     @click.stop
     @change.stop="ChangeTaskDone($event, t)" />
    {{ t.title }}
    <span style="float: right; margin-right: 10px">
     <span class="badge badge-important" style="margin-right: 10px" :title="'Importance: ' + Importance[t.importance??0] + ' (' + t.importance + ')'">{{
      Importance[t.importance??0]
     }}</span>
     <span id="remove" :title="`Remove Task #${t.taskID}`" class="close" @click.stop="RemoveTask(t)">&times;</span>
    </span>

    <div
     v-if="t.due"
     :class="{
      'text-danger': IsPast(t.due),
      'text-warning': IsToday(t.due),
      'text-success': IsFuture(t.due),
     }"
     :title="'Task due: ' + moment(t.due).toLocaleString()">
     due {{ IsToday(t.due) ? "today" : moment(t.due).fromNow() }}
    </div>
   </li>
  </ol>
 </div>

 <!-- ### Spalte 3: Aufgabendetails-->
 <div id="col3" v-if="data.task" class="MLpanel col-xs-12 col-sm-6 col-md-4 col-lg-4">
  <TaskEdit v-model:task="data.task" @TaskEditDone="TaskEditDone"></TaskEdit>
 </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { MiracleListProxy, Category, Task, Importance, LoginInfo } from "@/services/MiracleListProxyV2";
// Libraries
import moment from "moment";
// Unterkomponenten
import TaskEdit from "@/components/TaskEdit.vue";
// Sonstige Klassen
import { AuthenticationManager } from "@/services/AuthenticationManager";

//#region ------ Properties zur Datenbindung im reaktivem Objekt
const data = reactive({
 categorySet: ref<Array<Category>>(),
 taskSet: ref<Array<Task>>(),
 category: ref<Category | null>(),
 task: ref<Task | null>(),
 newCategoryName: ref<string>(),
 newTaskTitle: ref<string>(),
});
//#endregion

// Backend
let proxy = new MiracleListProxy("https://miraclelistbackend.azurewebsites.net/");
// Token merken
let token: string = "";

// Hilfsfunktionen für Template
let IsToday = (d: Date) => moment().startOf("day").isSame(moment(d).startOf("day"));
let IsPast = (d: Date) => moment(d).startOf("day") < moment().startOf("day");
let IsFuture = (d: Date) => moment(d).startOf("day") > moment().startOf("day");

onMounted(async () => {
 console.log("Home:onMounted");
 // Sprint 2+3: zunächst statischer Login. Wird später ausgelagert!
 let am = new AuthenticationManager();
 let li: LoginInfo | null = await am.LoginDebug();
 if (li == null) {
  alert("Login Error - see Browser Console!");
 } else if (li!.message) {
  alert("Login Error: " + li!.message);
 } else {
  token = li.token as string;
  console.log("Loginfo", li);
  await ShowCategorySet();
 }
});

onUnmounted(async () => {
 console.log("Home:onUnmounted");
});

async function ShowCategorySet() {
 console.log("ShowCategorySet", data.categorySet);
 data.categorySet = await proxy.categorySet(token);
 console.log("ShowCategorySet", data.categorySet);
 if (data.categorySet.length > 0) {
  ShowTaskSet(data.categorySet[0]);
 }
}

async function ShowTaskSet(c: Category | null | undefined) {
 console.log("ShowTaskSet", c);
 data.category = c;
 if (c && c.categoryID) {
  data.taskSet = await proxy.taskSet(c.categoryID, token);
  // Sortierreihenfolge beachten!
  data.taskSet = data.taskSet.sort((x, y) => (x.order as number) - (y.order as number));
  console.log("ShowTaskSet", data.taskSet);
  data.task = null;
 }
}

function ShowTaskDetail(t: Task) {
 console.log("ShowTaskDetail", t);
 data.task = t;
}

 // Nur Sprint 2 bis 4. Wird verbessert in Sprint 5
async function RemoveCategory(c: Category) {
 if (c == null || !c.categoryID) return;
 var text = `Do you want to remove category #${c.categoryID} ${c.name} and all related tasks?`;
 if (!confirm(text)) return;
 await proxy.deleteCategory(c.categoryID as number, token);
 await ShowCategorySet();
 data.category = data.categorySet!.length > 0 ? (data.categorySet![0] as Category) : null;
}

 // Nur Sprint 2 bis 4. Wird verbessert in Sprint 5
async function RemoveTask(t: Task) {
 // Sprint 2 bis 4
 if (t == null || !t.taskID) return;
 var text = `Do you want to remove Task #${t.taskID} <b>${t.title}</b>?`;
 if (!confirm(text)) return;
 await proxy.deleteTask(t.taskID, token);
 await ShowTaskSet(data.category);
 data.task = null;
}

async function CreateCategory() {
 if (!data.newCategoryName) return;
 var newcategory = await proxy.createCategory(data.newCategoryName, token);
 await ShowCategorySet();
 await ShowTaskSet(newcategory);
 data.newCategoryName = "";
}

async function CreateTask() {
 if (!data.newTaskTitle || !data.category) return;
 console.log("createTask");
 let newTask = new Task({
  taskID: 0, // notwendig für Server, da der die ID vergibt
  title: data.newTaskTitle,
  categoryID: data.category.categoryID,
  importance: Importance.B,
  created: new Date(),
  due: new Date(),
  order: 0,
  note: "",
  done: false,
 });

 newTask = await proxy.createTask(token, newTask);
 console.log("Home.createTask", newTask);
 await ShowTaskSet(data.category);
 data.newTaskTitle = "";
}

async function ChangeTaskDone(event, t: Task) {
 console.log("Task ÄNDERN", t);
 t = await proxy.changeTaskDone(t.taskID, event.target.checked, token);
 console.log("Task GEÄNDERT", t);
}

async function TaskEditDone(changed: boolean) {
 console.log("TaskEditDone", changed, data.task);
 if (changed && data.task) {
  await proxy.changeTask(token, data.task);
 } else await ShowTaskSet(data.category); // Bei Cancel: Neuladen als Undo!
 // Nun keine aktuelle Aufgabe mehr!
 data.task = null;
}
</script>
