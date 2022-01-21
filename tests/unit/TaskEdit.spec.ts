import { flushPromises, shallowMount } from "@vue/test-utils";
import TaskEdit from "@/components/TaskEdit.vue";
import { Task } from "@/services/MiracleListProxyV2";
import { nextTick, VueElement } from "vue";

function InitTaskEdit(valid: boolean) {
 let t = new Task();
 t.taskID = 123;
 if (valid) {
  t.title = "Testaufgabe";
  t.due = new Date();
 } else {
  t.title = "x";
 }

 const wrapper = shallowMount(TaskEdit, {
  props: { task: t },
 });

 expect(wrapper.get("#taskheadline").text()).toBe("Task #123");
 const e = wrapper.find("input[name=tasktitle]").element as HTMLInputElement;
 expect(e.value).toBe(t.title);

 return wrapper;
}

describe("TaskEdit", () => {
 it("TaskEdit Save", async () => {
  const wrapper = InitTaskEdit(true);
  // Aktion: Save
  await wrapper.find("#save").trigger("click");
  // wichtig, da der Klick auf #save asynchron behandelt wird!
  await flushPromises();
  // Ereignisse prüfen
  expect(wrapper.emitted()).toHaveProperty("click");
  expect(wrapper.emitted()).toHaveProperty("TaskEditDone");
  const TaskEditDoneEvent = wrapper.emitted("TaskEditDone");
  var eventParameter = (TaskEditDoneEvent![0] as Array<any>)[0];
  expect(eventParameter).toBeTruthy();
 });

 it("TaskEdit Cancel", async () => {
  const wrapper = InitTaskEdit(false);

  // Aktion: Cancel
  await wrapper.find("#cancel").trigger("click");
  // Ereignisse prüfen
  expect(wrapper.emitted()).toHaveProperty("click");
  expect(wrapper.emitted()).toHaveProperty("TaskEditDone");
  const TaskEditDoneEvent = wrapper.emitted("TaskEditDone");
  var eventParameter = (TaskEditDoneEvent![0] as Array<any>)[0];
  expect(eventParameter).toBeFalsy();
 });

//  it("TaskEdit Validation faild", async () => {
//   const wrapper = InitTaskEdit(true);
//   await wrapper.find("#save").trigger("click");
//   // Ereignisse prüfen
//   expect(wrapper.emitted()).toHaveProperty("click");
//   expect(wrapper.emitted()).not.toHaveProperty("TaskEditDone");
//  });
});

// https://next.vue-test-utils.vuejs.org/guide/essentials/event-handling.html#asserting-the-emitted-events
// console.log("EVENTS: ", wrapper.emitted()); // {"TaskEditDone": [[false]], "click": [[{"isTrusted": false}]]}
// console.log("Parameter",(TaskEditDoneEvent![0] as Array<any>)[0], (TaskEditDoneEvent![0] as any).constructor.name);
  // console.log("Typname ermitteln:", e.constructor.name);
