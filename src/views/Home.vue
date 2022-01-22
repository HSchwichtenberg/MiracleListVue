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
 <ConfirmDialog ref="confirmDialog"></ConfirmDialog>
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
     @dragover.prevent
     @drop="DropTaskToCategory($event, c)"
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
  <!-- <ol  id="taskList" class="list-group scroll"> -->
  <draggable id="taskList" v-model="data.taskSet" item-key="taskID" class="list-group scroll" @end="ChangeTaskOrder" tag="ol">
   <!-- v-for="t in data.taskSet"    
    :key="t.taskID" -->
   <template #item="{ element: t }">
    <li
     @click="ShowTaskDetail(t)"
     draggable="true"
     @dragstart="DragTask($event, t)"
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
      <span class="badge badge-important" style="margin-right: 10px" :title="'Importance: ' + Importance[t.importance] + ' (' + t.importance + ')'">{{
       Importance[t.importance]
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
   </template>
  </draggable>
  <!-- </ol> -->
 </div>

 <!-- ### Spalte 3: Aufgabendetails-->
 <div id="col3" v-if="data.task" class="MLpanel col-xs-12 col-sm-6 col-md-4 col-lg-4">
  <TaskEdit v-model:task="data.task" @TaskEditDone="TaskEditDone"></TaskEdit>
 </div>

</template>

<script setup lang="ts">
import { ref, reactive, onMounted, inject, computed, onUnmounted, watchEffect } from "vue";
import { MiracleListProxy, Category, Task, Importance } from "@/services/MiracleListProxyV2";
// import { AuthenticationManager } from '@/services/AuthenticationManager' // Sprint 4
import moment from "moment";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import TaskEdit from "@/components/TaskEdit.vue";
import { AppState } from "@/services/AppState";
import draggable from "vuedraggable";
import * as signalR from "@microsoft/signalr"; // Sprint 5
import { HubConnectionState } from "@microsoft/signalr"; // Sprint 5
import { useToast } from "vue-toastification"; // Sprint 5
const toast = useToast();

async function ChangeTaskOrder(evt, originalEvent) {
 let orderedTaskIDSet: Array<number> = [];
 // Liste der Aufgaben in der nun gewünschten Reihenfolge
 data.taskSet!.forEach(async (t) => {
  orderedTaskIDSet.push(t.taskID as number);
 });
 // Aufruf des Backeneds
 let erfolgreiche = await proxy.changeTaskOrder(data.category?.categoryID, AppState.Token, orderedTaskIDSet);
 console.log(`ChangeTaskOrder Done: ${erfolgreiche} of ${data.taskSet?.length}!`);

 // Ungünstige Möglichkeit
 // let i = 0;
 // data.taskSet!.forEach(   async t => {
 //     console.log("vorher",t.order,t.taskID);
 //     t.order = ++i;
 //     await proxy.changeTask(AppState.Token, t);
 //     console.log("nachher",t.order,t.taskID);
 //   });
}

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
// let proxy = new MiracleListProxy("https://miraclelistbackend.azurewebsites.net/");
let proxy: MiracleListProxy = inject("MiracleListProxy") || new MiracleListProxy(""); // Sprint 4

// Hilfsfunktionen für Template
let IsToday = (d: Date) => moment().startOf("day").isSame(moment(d).startOf("day"));
let IsPast = (d: Date) => moment(d).startOf("day") < moment().startOf("day");
let IsFuture = (d: Date) => moment(d).startOf("day") > moment().startOf("day");
// Verweise auf Elemente
const confirmDialog = ref<typeof ConfirmDialog>();

// Sprint 5: SignalR
let HubConnection = ref<signalR.HubConnection>();
let HubConnected = computed(() => HubConnection.value?.state == HubConnectionState.Connected);
// Überwachung der Zustandsänderungen der HubConnection
watchEffect(async () => {
 AppState.HubConnectionInfo.value =
  "SignalR: <span style='color:" + (HubConnected.value ? "green" : "red") + "'>" + HubConnection.value?.state + "<span>";
});

onMounted(async () => {
 console.log("Home:onMounted");
 // Sprint 2+3: zunächst statischer Login. Wird später ausgelagert!
 // var am = new AuthenticationManager("https://miraclelistbackend.azurewebsites.net/");
 // var li = await am.Login();
 // token = li.token || null;
 // console.log("Loginfo", li);
 console.log("Token", AppState.Token, AppState.CurrentLoginInfo);
 // if (AppState.Token) // Sprint 2+3
 await ShowCategorySet();

 //#region ------ SignalR (Spring 5)
 console.log("*** SignalR Init HubConnection...");
 // ASP.NET Core SignalR-Verbindung konfigurieren
 HubConnection.value = new signalR.HubConnectionBuilder().withUrl(process.env.VUE_APP_ENV_Backend + "/MLHub").build();
 // -> eingehende Nachricht
 HubConnection.value!.on("SendCategoryListUpdate", async (sender: string, categoryID: number) => {
  console.log(`*** SignalR-CategoryListUpdate von ${sender}: ${categoryID}`);
  toast.info(`Category list has been changed in annother instance.`);
  await ShowCategorySet();
 });
 // -> eingehende Nachricht
 HubConnection.value!.on("SendTaskListUpdate", async (sender: string, categoryID: number) => {
  console.log(`*** SignalR-TaskListUpdate von ${sender}: ${categoryID}`);
  var changedCategory: Category | undefined = data.categorySet?.find((x) => x.categoryID == categoryID);
  if (changedCategory) toast.success(`Task in Category ${categoryID}: ${changedCategory.name} has been changed in annother instance.`);
  if (categoryID == data.category!.categoryID) {
   await ShowTaskSet(data.category);
  }
 });

 // Verbindung zum SignalR-Hub starten
 HubConnection.value!.start()
  .then(() => {
   console.log(`*** SignalR-Connection OK (${HubConnection.value!.state}): ${HubConnection.value!.connectionId} ${AppState.Token}`);
   // Beim Hub registrieren für Ereignisse auf dem Server
   HubConnection.value!.send("Register", AppState.Token);
  })
  .catch((err) => console.error(err));
 //#endregion
});

onUnmounted(async () => {
 console.log("Home:onUnmounted");
 HubConnection.value?.stop();
 AppState.HubConnectionInfo.value = "";
});

async function ShowCategorySet() {
 console.log("ShowCategorySet", data.categorySet);
 data.categorySet = await proxy.categorySet(AppState.Token);
 console.log("ShowCategorySet", data.categorySet);
 if (data.categorySet.length > 0) {
  ShowTaskSet(data.categorySet[0]);
 }
}

async function ShowTaskSet(c: Category | null | undefined) {
 console.log("ShowTaskSet", c);
 data.category = c;
 if (c && c.categoryID) {
  data.taskSet = await proxy.taskSet(c.categoryID, AppState.Token);
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

async function RemoveCategory(c: Category) {
 // ab Sprint 5
 if (c == null || !c.categoryID) return;
 var text = `Do you want to remove category #${c.categoryID} <b>${c.name}</b> and all related tasks?`;
 async function RemoveInternal() {
  await proxy.deleteCategory(c.categoryID as number, AppState.Token);
  await ShowCategorySet();
  data.category = data.categorySet!.length > 0 ? (data.categorySet![0] as Category) : null;
  await SendCategoryListUpdate(); // Sprint 5
 }
 if (confirmDialog.value) {
  confirmDialog.value.Show(c.categoryID, text, RemoveInternal, null);
 }
}

async function RemoveCategor_Alt(c: Category) {
 // Sprint 2 bis 4
 if (c == null || !c.categoryID) return;
 var text = `Do you want to remove category #${c.categoryID} ${c.name} and all related tasks?`;
 if (!confirm(text)) return;
 await proxy.deleteCategory(c.categoryID as number, AppState.Token);
 await ShowCategorySet();
 data.category = null;
}

async function RemoveTask(t: Task) {
 // ab Sprint 5
 if (t == null || !t.taskID) return;
 var text = `Do you want to remove Task #${t.taskID} <b>${t.title}</b>?`;
 async function RemoveInternal() {
  if (t.taskID) await proxy.deleteTask(t.taskID, AppState.Token);
  await ShowTaskSet(data.category);
  data.task = null;
  await SendTaskListUpdate(); // Sprint 5
 }
 if (confirmDialog.value) {
  confirmDialog.value.Show(t.taskID, text, RemoveInternal, null);
 }
}

async function RemoveTask_alt(t: Task) {
 // Sprint 2 bis 4
 if (t == null || !t.taskID) return;
 var text = `Do you want to remove Task #${t.taskID} <b>${t.title}</b>?`;
 if (!confirm(text)) return;
 await proxy.deleteTask(t.taskID, AppState.Token);
 await ShowTaskSet(data.category);
 data.task = null;
}

async function CreateCategory() {
 if (!data.newCategoryName) return;
 var newcategory = await proxy.createCategory(data.newCategoryName, AppState.Token);
 await ShowCategorySet();
 await ShowTaskSet(newcategory);
 data.newCategoryName = "";
 await SendCategoryListUpdate(); // Sprint 5
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

 newTask = await proxy.createTask(AppState.Token, newTask);
 console.log("Home.createTask", newTask);
 await ShowTaskSet(data.category);
 data.newTaskTitle = "";
 await SendTaskListUpdate(); // Sprint 5
}

async function ChangeTaskDone(event, t: Task) {
 console.log("Task ÄNDERN", t);
 t = await proxy.changeTaskDone(t.taskID, event.target.checked, AppState.Token);
 console.log("Task GEÄNDERT", t);
 await SendTaskListUpdate(); // Sprint 5
}

async function TaskEditDone(changed: boolean) {
 console.log("TaskEditDone", changed, data.task);
 if (changed && data.task) {
  await proxy.changeTask(AppState.Token, data.task);
  toast.success(`Saved.`);
  await SendTaskListUpdate(); // Sprint 5
 } else await ShowTaskSet(data.category); // Bei Cancel: Neuladen als Undo!
 // Nun keine aktuelle Aufgabe mehr!
 data.task = null;
}

async function SendCategoryListUpdate() {
 console.log("SignalR.SendCategoryListUpdate", HubConnection.value!.state);
 if (HubConnected.value) await HubConnection.value!.send("SendCategoryListUpdate", AppState.Token);
 else console.warn("SignalR.connection: not connected!", "");
}

async function SendTaskListUpdate() {
 console.log("SignalR.SendTaskListUpdate", HubConnection.value!.state);
 if (HubConnected.value) await HubConnection.value!.send("SendTaskListUpdate", AppState.Token, data.category!.categoryID);
 else console.warn("SignalR.connection: not connected!", "");
}

// Sprint 5
function DragTask(ev, task: Task) {
 ev.dataTransfer.setData("task", JSON.stringify(task));
}

// Sprint 5
async function DropTaskToCategory(ev, category: Category) {
 const task = JSON.parse(ev.dataTransfer.getData("task")) as Task;
 console.log("Drop", task.taskID, task.categoryID, category.categoryID);
 task.categoryID = category.categoryID;
 await proxy.changeTask(AppState.Token, task);
 await ShowTaskSet(data.category);
}
</script>
