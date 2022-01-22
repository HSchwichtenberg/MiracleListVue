import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";

describe("Home.vue", () => {
  it("Home contains any text", () => {
    const wrapper = shallowMount(Home, {
    });
    expect(wrapper.text()).not.toBe("");
  });
});
