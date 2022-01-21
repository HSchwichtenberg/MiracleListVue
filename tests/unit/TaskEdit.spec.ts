import { mount } from '@vue/test-utils'
import TaskEdit from '@/components/TaskEdit.vue'
import { Task } from '@/services/MiracleListProxyV2'
import { VueElement } from 'vue'

describe('TaskEdit', () => {
  it("TaskEdit Save", async () => {

    let t = new Task();
    t.taskID = 123;
    t.title = "Testaufgabe";
    const wrapper = mount(TaskEdit, {
     props: { task: t }
    });

    expect(wrapper.get("#taskheadline").text()).toBe("Task #123");
    const e = wrapper.find('input[name=tasktitle]').element as HTMLInputElement
    // console.log("Typname ermitteln:", e.constructor.name);
    expect(e.value).toBe('Testaufgabe');

    await wrapper.find('#cancel').trigger('click');
  
    console.log("EVENTS: ", wrapper.emitted()); // {"TaskEditDone": [[false]], "click": [[{"isTrusted": false}]]}
    expect(wrapper.emitted()).toHaveProperty('click');
    expect(wrapper.emitted()).toHaveProperty('TaskEditDone');
    const TaskEditDoneEvent = wrapper.emitted('TaskEditDone');
   // console.log("Parameter",(TaskEditDoneEvent![0] as Array<any>)[0], (TaskEditDoneEvent![0] as any).constructor.name);
    var eventParameter = (TaskEditDoneEvent![0] as Array<any>)[0];
    expect(eventParameter).toBeFalsy();

     // https://next.vue-test-utils.vuejs.org/guide/essentials/event-handling.html#asserting-the-emitted-events


  })
})
