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
   <!-- TODO in Sprint 3 -->
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
    </li>
   </ol>
  </div>
 </div>

 <!-- ##################################### Spalte 2: Aufgaben-->
 <div id="col2" v-if="data.category && data.taskSet" class="MLpanel col-xs-8 col-sm-8 col-md-9 col-lg-10">
  <!-- ---------- Überschrift Spalte 1-->
  <h4>
   <span id="taskCount" style="margin-right: 5px"> {{ data.taskSet.length }}</span>
   <span>Tasks in</span> <span id="categoryCurrentName" style="font-weight: 600"> {{ data.category.name }}</span>
  </h4>
  <!-- ---------- neue Aufgabe eingeben-->
  <!-- TODO in Sprint 3 -->

  <!-- ---------- Aufgabenliste ausgeben-->
  <ol id="taskList" class="list-group scroll">
   <li
    v-for="t in data.taskSet"
    :key="t.taskID"
    @click="ShowTaskDetail(t)"
    draggable="true"
    class="list-group-item"
    :title="'Task #' + t.taskID + '- created: ' + moment(t.created).toLocaleString()"
    :class="{ MLselected: data.task && t.taskID == data.task?.taskID }">
    <input type="checkbox" :name="'done' + t.taskID" :id="'done' + t.taskID" :checked="t.done" class="MLcheckbox" />
    {{ t.title }}
    <span style="float: right; margin-right: 10px">
     <span class="badge badge-important" style="margin-right: 10px" :title="'Importance: ' + Importance[t.importance] + ' (' + t.importance + ')'">{{
      Importance[t.importance]
     }}</span>
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
 <!-- TODO in Sprint 3 -->
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { MiracleListProxy, Category, Task, Importance, LoginInfo } from "@/services/MiracleListProxyV2";
import { AuthenticationManager } from "@/services/AuthenticationManager";
import moment from "moment";

//#region ------ Properties zur Datenbindung im reaktivem Objekt
const data = reactive({
 categorySet: ref<Array<Category>>(),
 taskSet: ref<Array<Task>>(),
 category: ref<Category | null>(),
 task: ref<Task | null>()
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
</script>