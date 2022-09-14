import { shallowMount, mount, flushPromises } from "@vue/test-utils";
import TaskEdit from "@/components/TaskEdit.vue";
import { Task } from "@/services/MiracleListProxyV2";
import { vi,describe, it, expect, afterEach } from "vitest";
/**
 * Hilfsroutine für TaskEdit-Tests
 * Instanziert Komponente und prüft Daten
 */
function InitTaskEdit(valid: boolean) {

 // Parameter vorbereiten
 let t = new Task();
 t.taskID = 123;
 if (valid) {
  t.title = "Testaufgabe";
  t.due = new Date();
 } else {
  t.title = "x";
 }

 // Komponente zum Test instanzieren
 const wrapper = mount(TaskEdit, {
  props: { task: t },
 });

 // Prüfung Überschrift und Aufgabentitel
 expect(wrapper.get("#taskheadline").text()).toBe("Task #123");
 const e = wrapper.get("input[name=tasktitle]").element as HTMLInputElement;
 expect(e.value).toBe(t.title);

 return wrapper;
}

describe("TaskEdit", () => {
 it("TaskEdit Save Validation OK", async () => {
  const wrapper = InitTaskEdit(true);
  // Aktion: Save
  await wrapper.get("#save").trigger("click");
  // wichtig, da der Klick auf #save asynchron behandelt wird!
  await flushPromises();
  // Ereignisse prüfen
  expect(wrapper.emitted()).toHaveProperty("click");
  expect(wrapper.emitted()).toHaveProperty("TaskEditDone");
  const TaskEditDoneEvent = wrapper.emitted("TaskEditDone");
  var eventParameter = (TaskEditDoneEvent![0] as Array<any>)[0];
  expect(eventParameter).toBeTruthy();
 });
 
 it("TaskEdit Save Validation failed", async () => {
  const wrapper = InitTaskEdit(false);
  await wrapper.get("#save").trigger("click");
  await flushPromises();
  // Ereignisse prüfen
  expect(wrapper.emitted()).toHaveProperty("click");
  expect(wrapper.emitted()).not.toHaveProperty("TaskEditDone");
 });

 it("TaskEdit Cancel", async () => {
  const wrapper = InitTaskEdit(true);

  // Aktion: Cancel
  await wrapper.get("#cancel").trigger("click");
  // Ereignisse prüfen
  expect(wrapper.emitted()).toHaveProperty("click");
  expect(wrapper.emitted()).toHaveProperty("TaskEditDone");
  const TaskEditDoneEvent = wrapper.emitted("TaskEditDone");
  var eventParameter = (TaskEditDoneEvent![0] as Array<any>)[0];
  expect(eventParameter).toBeFalsy();
 });

 it("TaskEdit Custom Event Check", async () => {
  const wrapper = InitTaskEdit(true);
  // Aktion: Save
  await wrapper.vm.$emit("TaskEditDone",true);
  // Ereignisse prüfen
  console.log("EVENTS: ", wrapper.emitted()); // {"TaskEditDone": [[false]], "click": [[{"isTrusted": false}]]}
  expect(wrapper.emitted()).not.toHaveProperty("click");
  expect(wrapper.emitted()).toHaveProperty("TaskEditDone");
  const TaskEditDoneEvent = wrapper.emitted("TaskEditDone");
  var eventParameter = (TaskEditDoneEvent![0] as Array<any>)[0];
  expect(eventParameter).toBeTruthy();
 });

});
// https://next.vue-test-utils.vuejs.org/guide/essentials/event-handling.html#asserting-the-emitted-events
// console.log("EVENTS: ", wrapper.emitted()); // {"TaskEditDone": [[false]], "click": [[{"isTrusted": false}]]}
// console.log("Parameter",(TaskEditDoneEvent![0] as Array<any>)[0], (TaskEditDoneEvent![0] as any).constructor.name);
// console.log("Typname ermitteln:", e.constructor.name);
